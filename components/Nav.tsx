"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

const SECTIONS = [
  { id: "about", label: "about" },
  { id: "timeline", label: "timeline" },
  { id: "projects", label: "projects" },
  { id: "skills", label: "skills" },
  { id: "contact", label: "contact" },
] as const;

/**
 * Sticky in-page section navigation. A thin IntersectionObserver "trip line"
 * just below the bar tracks which section is in view and highlights its link.
 * Anchor jumps are offset by `scroll-padding-top` (globals.css) so targets
 * clear the bar.
 */
export function Nav() {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const sections = SECTIONS.map(({ id }) =>
      document.getElementById(id)
    ).filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Sections tile the page back-to-back, so usually exactly one crosses
        // the trip line; if two momentarily do, take the topmost.
        const hit = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
          )[0];
        if (hit) setActive(hit.target.id);
      },
      // Active band: ~15%–45% down the viewport (just under the bar). Wide
      // enough that a section is reliably inside it during scroll — a thin band
      // could be skipped by a short section or a fast jump, leaving no hit.
      // The topmost-intersecting tiebreak above keeps the upper section active.
      { rootMargin: "-15% 0px -55% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Section navigation"
      className="sticky top-0 z-50 border-b border-border bg-bg-primary/80 backdrop-blur"
    >
      <div className="px-6 max-w-5xl mx-auto flex items-center justify-between gap-4">
        <a
          href="#main-content"
          className="hidden sm:block shrink-0 py-3 font-mono text-sm text-accent-green hover:text-accent-cyan transition-colors"
        >
          ~
        </a>
        <ul className="flex items-center gap-4 sm:gap-6 overflow-x-auto py-3 font-mono text-xs sm:text-sm">
          {SECTIONS.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={active === id ? "true" : undefined}
                className={cn(
                  "whitespace-nowrap transition-colors hover:text-accent-cyan",
                  active === id ? "text-accent-cyan" : "text-text-secondary"
                )}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
