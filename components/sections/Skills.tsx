"use client";

import { useMemo } from "react";
import { useInView } from "@/lib/useInView";
import { useSearchParam, setSearchParam } from "@/lib/useSearchParam";
import { skills } from "@/lib/data";
import { cn } from "@/lib/cn";

export function Skills() {
  const { ref, isInView } = useInView<HTMLElement>();
  // Deep-link: the ?skills= param (comma-separated category names) is the single
  // source of truth. useSearchParam re-renders on URL changes (incl. back/forward).
  const urlSkills = useSearchParam("skills");
  const expandedCategories = useMemo(
    () =>
      new Set(
        (urlSkills ?? "")
          .split(",")
          .filter((category) => Object.hasOwn(skills, category))
      ),
    [urlSkills]
  );

  const toggleCategory = (category: string) => {
    const next = new Set(expandedCategories);
    if (next.has(category)) {
      next.delete(category);
    } else {
      next.add(category);
    }
    setSearchParam("skills", next.size > 0 ? Array.from(next).join(",") : null);
  };

  const categories = Object.entries(skills);

  return (
    <section id="skills" ref={ref} className="px-6 py-20 max-w-4xl mx-auto">
      <h2 className="font-mono text-text-secondary mb-8">
        <span className="text-accent-green">~/skills</span> $ ls -la
      </h2>

      <div className="space-y-3">
        {categories.map(([category, skillList], index) => {
          const isExpanded = expandedCategories.has(category);

          return (
            <div
              key={category}
              className={cn(
                "border border-border rounded-lg overflow-hidden",
                "scroll-reveal",
                isInView && "visible"
              )}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <button
                onClick={() => toggleCategory(category)}
                className="w-full px-4 py-3 flex items-center justify-between bg-bg-secondary hover:bg-border/30 transition-colors text-left"
                aria-expanded={isExpanded}
              >
                <span className="font-mono text-accent-cyan">{category}/</span>
                <svg
                  className={cn(
                    "w-5 h-5 text-text-secondary transition-transform",
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

              <div
                className={cn(
                  "grid transition-[grid-template-rows] duration-300 motion-reduce:transition-none",
                  isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="px-4 py-4 flex flex-wrap gap-2 bg-bg-primary">
                    {skillList.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 text-sm font-mono bg-bg-secondary border border-border rounded text-text-primary hover:border-accent-cyan transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
