import type { Project, ProjectDir } from "@/lib/data";
import { cn } from "@/lib/cn";
import { FileNode } from "./FileNode";
import { TreeGuides } from "./TreeGuides";

function FolderIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-accent-cyan"
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
  );
}

interface DirNodeProps {
  id: string;
  name: string;
  /** Continuation flags for each ancestor depth (drives the indent rails). */
  guides: boolean[];
  isLast: boolean;
  /** Top-level category dirs render slightly bolder. */
  bold?: boolean;
  /** Subdirectories (course/company) — mutually exclusive with `projects`. */
  dirs?: ProjectDir[];
  /** Flat project files directly in this directory. */
  projects?: Project[];
  expandedDirs: Set<string>;
  selectedId: string | null;
  onToggleDir: (id: string) => void;
  onSelect: (id: string) => void;
}

export function DirNode({
  id,
  name,
  guides,
  isLast,
  bold = false,
  dirs,
  projects,
  expandedDirs,
  selectedId,
  onToggleDir,
  onSelect,
}: DirNodeProps) {
  const isOpen = expandedDirs.has(id);
  const panelId = `dir-panel-${id}`;
  // Children get a continuing rail in this dir's column when it has later siblings.
  const childGuides = [...guides, !isLast];

  const childDirs = dirs ?? [];
  const childFiles = projects ?? [];
  const childCount = childDirs.length + childFiles.length;

  return (
    <div>
      <button
        type="button"
        onClick={() => onToggleDir(id)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full items-stretch rounded-sm text-left font-mono text-sm text-accent-cyan transition-colors hover:bg-border/20 hover:text-accent-green"
      >
        <TreeGuides guides={guides} isLast={isLast} />
        <span className="flex items-center py-2 pr-2 md:py-1">
          <svg
            className={cn(
              "mr-1 h-3.5 w-3.5 shrink-0 text-text-secondary transition-transform",
              isOpen ? "rotate-0" : "-rotate-90"
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
          <FolderIcon />
          <span className={cn("ml-1.5", bold && "font-bold")}>{name}/</span>
        </span>
      </button>

      <div
        id={panelId}
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={cn(
          "grid transition-[grid-template-rows] duration-300 motion-reduce:transition-none",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="min-h-0 overflow-hidden">
          {childDirs.map((child, index) => (
            <DirNode
              key={child.id}
              id={child.id}
              name={child.name}
              guides={childGuides}
              isLast={index === childCount - 1}
              projects={child.projects}
              expandedDirs={expandedDirs}
              selectedId={selectedId}
              onToggleDir={onToggleDir}
              onSelect={onSelect}
            />
          ))}
          {childFiles.map((project, index) => (
            <FileNode
              key={project.id}
              project={project}
              guides={childGuides}
              isLast={childDirs.length + index === childCount - 1}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
