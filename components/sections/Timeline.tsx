"use client";

import { useId, useState, type ReactNode } from "react";
import { useInView } from "@/lib/useInView";
import {
  timeline,
  type TimelineEntry,
  type WorkEntry,
  type EducationEntry,
} from "@/lib/data";
import { cn } from "@/lib/cn";
import { Disclosure } from "@/components/Disclosure";

/**
 * Shared card header: a small type kicker (cyan = education, green =
 * experience) with the period anchored right, then the title row. The visible
 * kicker carries the card's type for sighted, color-blind, and assistive-tech
 * users alike, so no separate visually-hidden label is needed.
 */
function CardHeader({
  type,
  period,
  children,
}: {
  type: TimelineEntry["type"];
  period: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-3">
      <div className="flex items-baseline justify-between gap-3 mb-1">
        <span
          className={cn(
            "font-mono text-xs uppercase tracking-wider",
            type === "education" ? "text-accent-cyan" : "text-accent-green"
          )}
        >
          {type === "education" ? "Education" : "Experience"}
        </span>
        <span className="font-mono text-xs text-text-secondary shrink-0">
          {period}
        </span>
      </div>
      <h3 className="font-mono font-bold text-text-primary leading-snug">
        {children}
      </h3>
    </div>
  );
}

function WorkCard({ entry }: { entry: WorkEntry }) {
  return (
    <div className="border border-border rounded-lg p-4 bg-bg-secondary transition-colors hover:border-accent-green/50">
      <CardHeader type="work" period={entry.period}>
        {entry.title}
      </CardHeader>
      <p className="text-sm text-accent-green mb-2">{entry.org}</p>
      <p className="text-text-secondary text-sm">{entry.description}</p>
    </div>
  );
}

function EducationCard({ entry }: { entry: EducationEntry }) {
  // Coursework is collapsed by default to keep cards compact.
  const [showCoursework, setShowCoursework] = useState(false);
  const courseworkId = useId();

  return (
    <div className="border border-border rounded-lg p-4 bg-bg-secondary transition-colors hover:border-accent-cyan/50">
      <CardHeader type="education" period={entry.period}>
        {entry.title}
        {entry.major && (
          <>
            {" "}
            <span className="whitespace-nowrap text-sm font-normal text-text-secondary">
              ·{" "}
              <span className="text-text-primary">{entry.major}</span>
            </span>
          </>
        )}
      </CardHeader>

      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 mb-3">
        <p className="text-sm text-accent-green">{entry.org}</p>
        {entry.gpa && (
          <p className="text-sm font-mono shrink-0">
            <span className="text-text-secondary">GPA </span>
            <span className="text-text-primary">{entry.gpa}</span>
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => setShowCoursework((open) => !open)}
        aria-expanded={showCoursework}
        aria-controls={courseworkId}
        className="w-full flex items-center justify-between gap-2 text-left group"
      >
        <span className="text-xs font-mono text-text-secondary group-hover:text-accent-cyan transition-colors">
          Relevant coursework{" "}
          <span className="text-text-secondary/60">
            ({entry.coursework.length})
          </span>
        </span>
        <svg
          className={cn(
            "w-4 h-4 text-text-secondary group-hover:text-accent-cyan transition-transform shrink-0",
            showCoursework && "rotate-180"
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

      <Disclosure id={courseworkId} open={showCoursework}>
        <div className="flex flex-wrap gap-2 pt-3">
          {entry.coursework.map((course) => (
            <span
              key={course}
              className="px-2 py-1 text-xs bg-bg-primary border border-border rounded text-text-primary"
            >
              {course}
            </span>
          ))}
        </div>
      </Disclosure>
    </div>
  );
}

export function Timeline() {
  const { ref, isInView } = useInView<HTMLElement>();

  return (
    <section id="timeline" ref={ref} className="px-6 py-20 max-w-5xl mx-auto">
      {/* Legacy anchors so old #experience / #education deep links still land here. */}
      <span id="experience" className="block" aria-hidden="true" />
      <span id="education" className="block" aria-hidden="true" />

      <h2 className="font-mono text-text-secondary mb-8">
        <span className="text-accent-green">~/timeline</span> $ cat history.log
      </h2>

      <div className="relative">
        {/* Spine: left edge on mobile, centered on md+. */}
        <div
          className="absolute left-0 sm:left-4 md:left-1/2 top-0 bottom-0 w-px bg-border"
          aria-hidden="true"
        />

        <ol className="space-y-8">
          {timeline.map((entry, index) => (
            <li
              // Static, never-reordered list — index is a stable key and avoids
              // org+period collisions that could bleed card state across rows.
              key={index}
              className={cn(
                "relative pl-8 sm:pl-12 md:pl-0 md:grid md:grid-cols-2 md:gap-x-16",
                "scroll-reveal",
                isInView && "visible"
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Connector from the spine across the gutter to the card. */}
              <div
                className={cn(
                  "absolute top-7 h-px w-8 bg-border left-0 sm:left-4",
                  entry.type === "education"
                    ? "md:left-auto md:right-1/2"
                    : "md:left-1/2"
                )}
                aria-hidden="true"
              />
              {/* Dot on the spine, aligned with the card's title line. */}
              <div
                className={cn(
                  "absolute left-0 sm:left-4 md:left-1/2 top-6 w-2 h-2 -translate-x-1/2 rounded-full ring-2 ring-bg-primary",
                  entry.type === "education"
                    ? "bg-accent-cyan"
                    : "bg-accent-green"
                )}
                aria-hidden="true"
              />
              <div
                className={
                  entry.type === "education" ? "md:col-start-1" : "md:col-start-2"
                }
              >
                {entry.type === "education" ? (
                  <EducationCard entry={entry} />
                ) : (
                  <WorkCard entry={entry} />
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
