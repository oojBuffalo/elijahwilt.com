"use client";

import { useEffect, useMemo, useRef } from "react";
import { type Project, type ProjectCategory } from "@/lib/data";
import { setSearchParams, useSearchParam } from "@/lib/useSearchParam";
import {
  collectDirIds,
  defaultExpandedDirs,
  findPath,
  flattenProjects,
  selectableIds,
} from "./projectMeta";
import { ProjectTree } from "./ProjectTree";
import { DetailPane } from "./DetailPane";

export function ProjectsExplorer({
  tree,
  isInView,
}: {
  tree: ProjectCategory[];
  isInView: boolean;
}) {
  // Deep-link state: ?project= selects a file, ?dirs= controls expanded folders.
  const urlProject = useSearchParam("project");
  const urlDirs = useSearchParam("dirs");

  const validIds = useMemo(() => selectableIds(tree), [tree]);
  const dirIds = useMemo(() => collectDirIds(tree), [tree]);
  const defaultDirs = useMemo(() => defaultExpandedDirs(tree), [tree]);
  const projectsById = useMemo(() => {
    const map = new Map<string, Project>();
    for (const project of flattenProjects(tree)) {
      map.set(project.id, project);
    }
    return map;
  }, [tree]);

  const selectedId =
    urlProject && validIds.has(urlProject) ? urlProject : null;

  // An explicit ?dirs= wins; otherwise folders containing projects open by
  // default. A selected project additionally expands its ancestor folders.
  const expandedDirs = useMemo(() => {
    const hasExplicitDirs = urlDirs !== null;
    const base = hasExplicitDirs
      ? new Set((urlDirs ?? "").split(",").filter((id) => dirIds.has(id)))
      : new Set(defaultDirs);
    if (!hasExplicitDirs && selectedId) {
      findPath(tree, selectedId)?.forEach((id) => base.add(id));
    }
    return base;
  }, [urlDirs, selectedId, dirIds, defaultDirs, tree]);

  const selectedProject = selectedId
    ? projectsById.get(selectedId) ?? null
    : null;

  const handleSelect = (id: string) => {
    const next = selectedId === id ? null : id;
    setSearchParams({
      project: next,
      dirs: expandedDirs.size > 0 ? Array.from(expandedDirs).join(",") : null,
    });
  };

  const handleToggleDir = (id: string) => {
    const next = new Set(expandedDirs);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSearchParams({
      project: selectedId,
      dirs: next.size > 0 ? Array.from(next).join(",") : null,
    });
  };

  // Mobile: bring the freshly-revealed detail (rendered below the tree) into view.
  const belowRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!selectedProject) return;
    const el = belowRef.current;
    if (!el || el.offsetParent === null) return; // hidden (desktop layout)
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "nearest",
    });
  }, [selectedProject]);

  return (
    <div>
      <div className="md:grid md:grid-cols-[minmax(0,20rem)_1fr] md:items-start md:gap-8">
        <ProjectTree
          tree={tree}
          expandedDirs={expandedDirs}
          selectedId={selectedId}
          onToggleDir={handleToggleDir}
          onSelect={handleSelect}
          isInView={isInView}
        />

        {/* Desktop detail pane: sticky beside the tree. */}
        <div
          className="mt-8 hidden md:sticky md:top-20 md:mt-0 md:block"
          role="region"
          aria-label="Project details"
        >
          <div key={selectedProject?.id ?? "readme"} className="animate-fade-in">
            <DetailPane project={selectedProject} />
          </div>
        </div>
      </div>

      {/* Mobile detail: full-width beneath the whole tree (no rails, no chrome
          wedged into the listing). */}
      <div
        id="mobile-project-detail"
        ref={belowRef}
        className="mt-6 md:hidden"
        role="region"
        aria-label="Project details"
      >
        {selectedProject && (
          <div key={selectedProject.id} className="animate-fade-in">
            <DetailPane project={selectedProject} />
          </div>
        )}
      </div>

      {/* Concise, polite announcement so AT users aren't re-read the whole card. */}
      <p className="sr-only" aria-live="polite">
        {selectedProject ? `Showing details for ${selectedProject.title}` : ""}
      </p>
    </div>
  );
}
