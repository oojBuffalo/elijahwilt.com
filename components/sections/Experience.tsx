"use client";

import { useInView } from "@/lib/useInView";
import { experience } from "@/lib/data";
import { cn } from "@/lib/cn";

export function Experience() {
  const { ref, isInView } = useInView<HTMLElement>();

  return (
    <section id="experience" ref={ref} className="px-6 py-20 max-w-4xl mx-auto">
      <h2 className="font-mono text-text-secondary mb-8">
        <span className="text-accent-green">~/experience</span> $ cat timeline.log
      </h2>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-0 sm:left-4 top-0 bottom-0 w-px bg-border" />

        <div className="space-y-8">
          {experience.map((job, index) => (
            <div
              key={index}
              className={cn(
                "relative pl-8 sm:pl-12",
                "scroll-reveal",
                isInView && "visible"
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Timeline dot */}
              <div className="absolute left-0 sm:left-4 top-1.5 w-2 h-2 -translate-x-1/2 rounded-full bg-accent-green" />

              <div className="border border-border rounded-lg p-4 bg-bg-secondary">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <h3 className="font-mono font-bold text-text-primary">
                    {job.title}
                  </h3>
                  <span className="text-sm font-mono text-accent-cyan">
                    {job.period}
                  </span>
                </div>
                <p className="text-sm text-accent-green mb-2">{job.company}</p>
                <p className="text-text-secondary text-sm">{job.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
