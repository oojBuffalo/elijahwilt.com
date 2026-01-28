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
      className="px-6 py-20 max-w-4xl mx-auto"
    >
      <h2 className="font-mono text-text-secondary mb-8">
        <span className="text-accent-green">~/about</span> $ cat bio.txt
      </h2>

      <div className="space-y-6">
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
