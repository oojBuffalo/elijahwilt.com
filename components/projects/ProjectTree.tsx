import type { ProjectCategory } from "@/lib/data";
import { cn } from "@/lib/cn";
import { DirNode } from "./DirNode";

/*
 * Accessibility note: this is deliberately built from nested disclosure buttons
 * (dirs: aria-expanded/aria-controls) plus a selection model (files: aria-pressed)
 * rather than a full WAI-ARIA `role="tree"` widget. A static 3-level tree does
 * not justify a roving-tabindex / arrow-key manager, and disclosure buttons match
 * the idiom used everywhere else in this codebase (Skills, Timeline). Native
 * Tab/Enter/Space make it fully operable. Please don't "upgrade" it to role=tree
 * without also adding the keyboard interaction model that pattern requires.
 */

interface ProjectTreeProps {
  tree: ProjectCategory[];
  expandedDirs: Set<string>;
  selectedId: string | null;
  onToggleDir: (id: string) => void;
  onSelect: (id: string) => void;
  isInView: boolean;
}

export function ProjectTree({
  tree,
  expandedDirs,
  selectedId,
  onToggleDir,
  onSelect,
  isInView,
}: ProjectTreeProps) {
  return (
    <div className="font-mono text-sm">
      {/* Root of the tree — the project directory itself. */}
      <div className="flex items-center gap-1.5 py-1 font-bold text-accent-green">
        <svg
          className="h-4 w-4 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 7a1 1 0 0 1 1-1h5l2 2h8a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7Z"
          />
        </svg>
        projects
      </div>

      {tree.map((category, index) => (
        <div
          key={category.id}
          className={cn("scroll-reveal", isInView && "visible")}
          style={{ transitionDelay: `${index * 75}ms` }}
        >
          <DirNode
            id={category.id}
            name={category.name}
            guides={[]}
            isLast={index === tree.length - 1}
            bold
            dirs={category.dirs}
            projects={category.projects}
            expandedDirs={expandedDirs}
            selectedId={selectedId}
            onToggleDir={onToggleDir}
            onSelect={onSelect}
          />
        </div>
      ))}
    </div>
  );
}
