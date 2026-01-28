"use client";

import { useInView } from "@/lib/useInView";
import { education } from "@/lib/data";
import { cn } from "@/lib/cn";

export function Education() {
  const { ref, isInView } = useInView<HTMLElement>();

  return (
    <section id="education" ref={ref} className="px-6 py-20 max-w-4xl mx-auto">
      <h2 className="font-mono text-text-secondary mb-8">
        <span className="text-accent-green">~/education</span> $ cat degrees.txt
      </h2>

      <div className="space-y-6">
        {education.map((edu, index) => (
          <div
            key={index}
            className={cn(
              "border border-border rounded-lg p-6 bg-bg-secondary",
              "scroll-reveal",
              isInView && "visible"
            )}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
              <div>
                <h3 className="font-mono font-bold text-text-primary text-lg">
                  {edu.degree}
                </h3>
                <p className="text-accent-green">{edu.institution}</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-mono text-accent-cyan block">
                  {edu.period}
                </span>
                {edu.gpa && (
                  <span className="text-sm text-text-secondary">
                    GPA: {edu.gpa}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm text-text-secondary mb-2 font-mono">
                Relevant Coursework:
              </p>
              <div className="flex flex-wrap gap-2">
                {edu.coursework.map((course) => (
                  <span
                    key={course}
                    className="px-2 py-1 text-xs bg-bg-primary border border-border rounded text-text-primary"
                  >
                    {course}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
