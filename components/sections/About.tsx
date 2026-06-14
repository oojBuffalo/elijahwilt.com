"use client";

import { useInView } from "@/lib/useInView";
import { about } from "@/lib/data";
import { cn } from "@/lib/cn";

export function About() {
  const { ref, isInView } = useInView<HTMLElement>();

  return (
    <section
      id="about"
      ref={ref}
      className="px-6 py-20 max-w-5xl mx-auto"
    >
      <h2 className="font-mono text-text-secondary mb-8">
        <span className="text-accent-green">~/about</span> $ cat bio.txt
      </h2>

      <div className="max-w-3xl space-y-6">
        <ul
          className={cn(
            "flex flex-wrap gap-2",
            "scroll-reveal",
            isInView && "visible"
          )}
          aria-label="Focus areas"
        >
          {about.focusAreas.map((area) => (
            <li
              key={area}
              className="px-3 py-1 text-xs font-mono bg-bg-secondary border border-border rounded text-accent-cyan"
            >
              {area}
            </li>
          ))}
        </ul>

        {about.paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className={cn(
              "text-lg leading-relaxed text-text-primary",
              "scroll-reveal",
              isInView && "visible"
            )}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
