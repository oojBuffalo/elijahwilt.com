"use client";

import { useInView } from "@/lib/useInView";
import { useSearchParam, setSearchParam } from "@/lib/useSearchParam";
import { projects } from "@/lib/data";
import { cn } from "@/lib/cn";
import { Disclosure } from "@/components/Disclosure";

export function Projects() {
  const { ref, isInView } = useInView<HTMLElement>();
  // Deep-link: the ?project= param is the single source of truth for which
  // panel is open. useSearchParam re-renders on URL changes (incl. back/forward).
  const urlProject = useSearchParam("project");
  const expandedProject =
    urlProject && projects.some((project) => project.id === urlProject)
      ? urlProject
      : null;

  const toggleProject = (id: string) => {
    setSearchParam("project", expandedProject === id ? null : id);
  };

  return (
    <section id="projects" ref={ref} className="px-6 py-20 max-w-5xl mx-auto">
      <h2 className="font-mono text-text-secondary mb-8">
        <span className="text-accent-green">~/projects</span> $ ls -la
      </h2>

      <div className="space-y-4">
        {projects.map((project, index) => {
          const isExpanded = expandedProject === project.id;

          return (
            <div
              key={project.id}
              className={cn(
                "border border-border rounded-lg overflow-hidden",
                "scroll-reveal",
                isInView && "visible"
              )}
              style={{ transitionDelay: `${index * 75}ms` }}
            >
              <button
                onClick={() => toggleProject(project.id)}
                className="w-full px-4 py-4 flex items-start justify-between gap-3 bg-bg-secondary hover:bg-border/30 transition-colors text-left"
                aria-expanded={isExpanded}
                aria-controls={`project-panel-${project.id}`}
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="font-mono font-bold text-text-primary">
                      {project.title}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-accent-green/20 text-accent-green rounded font-mono">
                      {project.type}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary mt-1">
                    {project.summary}
                  </p>
                </div>
                <svg
                  className={cn(
                    "w-5 h-5 text-text-secondary transition-transform shrink-0 mt-0.5",
                    isExpanded && "rotate-180"
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
              </button>

              <Disclosure id={`project-panel-${project.id}`} open={isExpanded}>
                <div className="px-4 py-4 bg-bg-primary border-t border-border">
                  <p className="text-text-primary mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 text-xs font-mono bg-bg-secondary border border-border rounded text-accent-cyan"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </Disclosure>
            </div>
          );
        })}
      </div>
    </section>
  );
}
