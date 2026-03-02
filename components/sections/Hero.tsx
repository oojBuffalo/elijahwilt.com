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

export function Hero() {
  const [lineIndex, setLineIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("prompt");

  const lines = heroTerminalLines;
  const isLastLine = lineIndex === lines.length - 1;

  function advancePhase() {
    if (phase === "prompt") {
      // Done typing prompt → start typing output
      setPhase("output");
    } else {
      // Done typing output → move to next line's prompt
      if (!isLastLine) {
        setLineIndex((prev) => prev + 1);
        setPhase("prompt");
      }
    }
  }

  return (
    <section className="min-h-screen flex flex-col justify-center px-6 py-20 max-w-6xl mx-auto">
      <div className="font-mono space-y-6">
        {lines.map((line, index) => {
          const isPast = index < lineIndex;
          const isCurrent = index === lineIndex;
          const isFuture = index > lineIndex;

          if (isFuture) return <div key={index} className="opacity-0" />;

          // Past lines: render statically
          if (isPast) {
            return (
              <div key={index}>
                <div className="text-text-secondary mb-1">
                  <span className="text-accent-green">elijah@portfolio</span>
                  <span className="text-text-secondary"> ~ </span>
                  <span>{line.prompt.slice(2)}</span>
                </div>
                <div
                  className={`text-xl sm:text-2xl md:text-3xl font-bold whitespace-pre-wrap ${index === 0 ? "text-text-primary" : "text-accent-cyan"
                    }`}
                >
                  {line.output.split("\n").map((part, partIndex) => (
                    <div key={partIndex}>
                      {">"} <MathText text={part} />
                    </div>
                  ))}
                </div>
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

              {/* Output row — only shown once prompt finishes */}
              {phase === "output" && (
                <div
                  className={`text-xl sm:text-2xl md:text-3xl font-bold whitespace-pre-wrap ${index === 0 ? "text-text-primary" : "text-accent-cyan"
                    }`}
                >
                  <TypeWriter
                    text={line.output}
                    delay={20}
                    showCursor={false}
                    onComplete={() => setTimeout(advancePhase, 350)}
                  />
                  {isLastLine && <Cursor />}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-16 animate-fade-in animate-delay-500">
        <a
          href="#about"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-cyan transition-colors"
        >
          <span className="font-mono text-sm">scroll for more</span>
          <svg
            className="w-4 h-4 animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
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
