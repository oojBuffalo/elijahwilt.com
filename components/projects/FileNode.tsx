import type { Project } from "@/lib/data";
import { cn } from "@/lib/cn";
import { TreeGuides } from "./TreeGuides";
import { extensionFor, fileNameFor } from "./projectMeta";

function FileIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-3.5 w-3.5 shrink-0", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14 3v4a1 1 0 0 0 1 1h4M14 3H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V8l-5-5Z"
      />
    </svg>
  );
}

interface FileNodeProps {
  project: Project;
  /** Continuation flags for each ancestor depth (drives the indent rails). */
  guides: boolean[];
  isLast: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

/**
 * A project "file" row. Selecting it surfaces the detail elsewhere (the sticky
 * pane on desktop, the full-width region below the tree on mobile) — the row
 * itself stays a pure navigator entry. `py-2 md:py-1` widens the touch target
 * on phones without loosening desktop density.
 */
export function FileNode({
  project,
  guides,
  isLast,
  selectedId,
  onSelect,
}: FileNodeProps) {
  // Placeholder scaffold: shown dimmed, not interactive, not a deep-link target.
  if (project.todo) {
    return (
      <div className="flex items-stretch font-mono text-sm text-text-secondary/40">
        <TreeGuides guides={guides} isLast={isLast} />
        <span className="flex items-center py-2 md:py-1">
          <FileIcon className="mr-1.5" />
          <span className="italic">coming soon</span>
          <span className="ml-2 rounded bg-border/30 px-1.5 py-0.5 text-[10px] not-italic">
            todo
          </span>
        </span>
      </div>
    );
  }

  const isSelected = selectedId === project.id;
  const name = fileNameFor(project);
  const ext = extensionFor(project.type);
  const stem = name.slice(0, name.length - ext.length);

  return (
    <button
      type="button"
      onClick={() => onSelect(project.id)}
      aria-pressed={isSelected}
      className={cn(
        "flex w-full items-stretch rounded-sm text-left font-mono text-sm transition-colors",
        isSelected
          ? "bg-accent-cyan/10 text-accent-cyan"
          : "text-text-primary hover:bg-border/20 hover:text-accent-cyan"
      )}
    >
      <TreeGuides guides={guides} isLast={isLast} />
      <span className="flex min-w-0 items-center py-2 pr-2 md:py-1">
        <FileIcon className="mr-1.5" />
        <span className="truncate">
          {stem}
          <span className="text-text-secondary/70">{ext}</span>
        </span>
        {isSelected && (
          <span
            className="ml-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-cyan"
            aria-hidden="true"
          />
        )}
      </span>
    </button>
  );
}
