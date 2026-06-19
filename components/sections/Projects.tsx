"use client";

import { useInView } from "@/lib/useInView";
import { ProjectsExplorer } from "@/components/projects/ProjectsExplorer";

export function Projects() {
  const { ref, isInView } = useInView<HTMLElement>();

  return (
    <section id="projects" ref={ref} className="px-6 py-20 max-w-5xl mx-auto">
      <h2 className="font-mono text-text-secondary mb-8">
        <span className="text-accent-green">~/projects</span> $ tree
      </h2>

      <ProjectsExplorer isInView={isInView} />
    </section>
  );
}
