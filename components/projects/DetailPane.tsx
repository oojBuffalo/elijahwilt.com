import type { Project } from "@/lib/data";
import { cn } from "@/lib/cn";
import { fileNameFor, statusMeta } from "./projectMeta";

/** Editor-style tab strip shown at the top of the pane. */
function EditorTab({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-border bg-bg-secondary px-3 py-2 font-mono text-xs">
      <span
        className="h-2 w-2 shrink-0 rounded-full bg-accent-cyan/70"
        aria-hidden="true"
      />
      <span className="text-text-secondary">{label}</span>
    </div>
  );
}

function GitHubIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

interface DetailPaneProps {
  project: Project | null;
  /** Inline (mobile) variant: lighter chrome, no min-height. */
  embedded?: boolean;
}

/**
 * Single detail renderer for a selected project. When `project` is null it
 * shows a README welcome (used as the desktop pane's empty state).
 */
export function DetailPane({ project, embedded = false }: DetailPaneProps) {
  if (!project) {
    return (
      <div className="overflow-hidden rounded-lg border border-border">
        <EditorTab label="README.md" />
        <div className="bg-bg-primary px-5 py-6 font-mono text-sm leading-relaxed text-text-secondary">
          <p>
            <span className="text-accent-green">#</span> ~/projects
          </p>
          <p className="mt-3">Select a file from the tree to view its details.</p>
          <p className="mt-1 text-text-secondary/70">
            Directories group by course, company, or “personal”.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs">
            <span className="rounded bg-accent-green/15 px-2 py-0.5 text-accent-green">
              shipped
            </span>
            <span className="rounded bg-accent-cyan/15 px-2 py-0.5 text-accent-cyan">
              wip
            </span>
            <span className="rounded bg-border/40 px-2 py-0.5 text-text-secondary">
              archived
            </span>
          </div>
        </div>
      </div>
    );
  }

  const status = statusMeta(project.status);

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      {/* Inline (mobile) cards omit the tab — the filename is already shown in
          the tree row directly above. */}
      {!embedded && <EditorTab label={fileNameFor(project)} />}
      <div
        className={cn(
          "bg-bg-primary px-5 py-5",
          !embedded && "md:min-h-[16rem]"
        )}
      >
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-mono font-bold text-text-primary">{project.title}</h3>
          <span className="rounded bg-accent-green/20 px-2 py-0.5 font-mono text-xs text-accent-green">
            {project.type}
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded px-2 py-0.5 font-mono text-xs",
              status.className
            )}
          >
            {status.pulse && (
              <span className="h-1.5 w-1.5 rounded-full bg-current motion-safe:animate-pulse" />
            )}
            {status.label}
          </span>
        </div>

        <p className="mt-2 text-sm text-text-secondary">{project.summary}</p>

        <p className="mt-4 leading-relaxed text-text-primary">
          {project.description}
        </p>

        {project.tech.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="rounded border border-border bg-bg-secondary px-2 py-1 font-mono text-xs text-accent-cyan"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {project.repo && (
          <a
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded border border-border px-3 py-1.5 font-mono text-sm text-text-secondary transition-colors hover:border-accent-cyan hover:text-accent-cyan"
          >
            <GitHubIcon />
            View on GitHub
          </a>
        )}
      </div>
    </div>
  );
}
