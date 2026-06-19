"use client";

import { useState } from "react";
import { TypeWriter } from "../terminal/TypeWriter";
import { Cursor } from "../terminal/Cursor";
import { heroTerminalLines } from "@/lib/data";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

const MathText = ({ text }: { text: string }) => {
  const parts = text.split(/(\$[^\$]+\$)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("$") && part.endsWith("$")) {
          const math = part.slice(1, -1);
          return <InlineMath key={i} math={math} />;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
};

// phase: 'prompt' = typing the prompt, 'output' = typing the output
type Phase = "prompt" | "output";

type TerminalLine = (typeof heroTerminalLines)[number];

const outputClasses = (index: number) =>
  `text-xl sm:text-2xl md:text-3xl font-bold whitespace-pre-wrap ${
    index === 0 ? "text-text-primary" : "text-accent-cyan"
  }`;

// The exact multi-line string the output TypeWriter types: a "> " prefix per
// line. The invisible reserve renders this same plain text (StaticOutput's
// `plain` mode), so the typed overlay and the reserve stay the same size even
// if an output ever contains a $math$ span (both show it literally; settled
// lines still render math via MathText).
const typedOutput = (line: TerminalLine) =>
  line.output
    .split("\n")
    .map((part) => "> " + part)
    .join("\n");

const StaticPrompt = ({ line }: { line: TerminalLine }) => (
  <div className="text-text-secondary mb-1">
    <span className="text-accent-green">elijah@portfolio</span>
    <span className="text-text-secondary"> ~ </span>
    <span>{line.prompt.slice(2)}</span>
  </div>
);

const StaticOutput = ({
  line,
  index,
  withCursor = false,
  plain = false,
}: {
  line: TerminalLine;
  index: number;
  withCursor?: boolean;
  // plain renders the raw text instead of MathText, matching the typed overlay
  // exactly; used for the invisible size-reserving copy of the current line.
  plain?: boolean;
}) => (
  <div className={outputClasses(index)}>
    {line.output.split("\n").map((part, partIndex, parts) => (
      <div key={partIndex}>
        {">"} {plain ? part : <MathText text={part} />}
        {withCursor && partIndex === parts.length - 1 && <Cursor />}
      </div>
    ))}
  </div>
);

export function Hero() {
  const [lineIndex, setLineIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("prompt");

  const lines = heroTerminalLines;
  const isLastLine = lineIndex === lines.length - 1;
  // Past the last line: every line renders statically and the cursor parks
  // at the end of the final output.
  const done = lineIndex >= lines.length;

  function advancePhase() {
    if (phase === "prompt") {
      // Done typing prompt → start typing output
      setPhase("output");
    } else {
      // Done typing output → move to next line's prompt (or the done state).
      // Captured lineIndex (not a functional updater) keeps this idempotent
      // when Strict Mode's double effect fires onComplete twice.
      setLineIndex(lineIndex + 1);
      setPhase("prompt");
    }
  }

  return (
    <section className="min-h-screen flex flex-col justify-start sm:justify-center px-6 py-20 max-w-5xl mx-auto">
      {/* Static copy for assistive tech; the typed terminal below is decorative */}
      <div className="sr-only">
        <h1>{lines[0].output}</h1>
        {lines.slice(1).map((line, index) => (
          <p key={index}>{line.output}</p>
        ))}
      </div>

      <div className="font-mono space-y-6" aria-hidden="true">
        {lines.map((line, index) => {
          const isPast = index < lineIndex;
          const isFuture = index > lineIndex;

          // Future lines: render invisibly so layout doesn't shift as lines appear
          if (isFuture) {
            return (
              <div key={index} className="hidden sm:invisible sm:block">
                <StaticPrompt line={line} />
                <StaticOutput line={line} index={index} />
              </div>
            );
          }

          // Past lines: render statically
          if (isPast) {
            return (
              <div key={index}>
                <StaticPrompt line={line} />
                <StaticOutput
                  line={line}
                  index={index}
                  withCursor={done && index === lines.length - 1}
                />
              </div>
            );
          }

          // Current line — animate prompt then output
          return (
            <div key={index}>
              {/* Prompt row */}
              <div className="text-text-secondary mb-1">
                <span className="text-accent-green">elijah@portfolio</span>
                <span className="text-text-secondary"> ~ </span>
                {phase === "prompt" ? (
                  <TypeWriter
                    text={line.prompt.slice(2)}
                    delay={40}
                    showCursor={false}
                    onComplete={() => setTimeout(advancePhase, 200)}
                  />
                ) : (
                  <span>{line.prompt.slice(2)}</span>
                )}
              </div>

              {/* The invisible static copy reserves the output's final size
                  through both phases; the typing overlays it out-of-flow so
                  the layout never shifts. Both render `typedOutput` (the
                  `plain` reserve below and the TypeWriter), so they stay the
                  same size even if an output contains a $math$ span. */}
              <div className="relative">
                <div className="invisible">
                  <StaticOutput
                    line={line}
                    index={index}
                    withCursor={isLastLine}
                    plain
                  />
                </div>
                {phase === "output" && (
                  <div className={`absolute inset-0 ${outputClasses(index)}`}>
                    <TypeWriter
                      text={typedOutput(line)}
                      delay={20}
                      showCursor={false}
                      onComplete={() => setTimeout(advancePhase, 350)}
                    />
                    {isLastLine && <Cursor />}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-auto sm:mt-16 animate-fade-in animate-delay-500">
        <a
          href="#about"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-cyan transition-colors"
        >
          <span className="font-mono text-sm">scroll for more</span>
          <svg
            className="w-4 h-4 motion-safe:animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </a>
      </div>
    </section>
  );
}
