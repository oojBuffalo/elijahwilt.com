"use client";

import { useState } from "react";
import { TypeWriter } from "../terminal/TypeWriter";
import { Cursor } from "../terminal/Cursor";
import { personalInfo } from "@/lib/data";

export function Hero() {
  const [lineIndex, setLineIndex] = useState(0);

  const lines = [
    { prompt: "$ whoami", output: personalInfo.name },
    { prompt: "$ cat role.txt", output: personalInfo.title + " | " + personalInfo.subtitle },
    { prompt: "$ cat tagline.txt", output: personalInfo.tagline },
  ];

  return (
    <section className="min-h-screen flex flex-col justify-center px-6 py-20 max-w-4xl mx-auto">
      <div className="font-mono space-y-6">
        {lines.map((line, index) => (
          <div key={index} className={index > lineIndex ? "opacity-0" : "opacity-100"}>
            {index <= lineIndex && (
              <>
                <div className="text-text-secondary mb-1">
                  <span className="text-accent-green">elijah@portfolio</span>
                  <span className="text-text-secondary"> ~ </span>
                  {index === lineIndex ? (
                    <TypeWriter
                      text={line.prompt.slice(2)}
                      delay={40}
                      showCursor={false}
                      onComplete={() => {
                        setTimeout(() => {
                          if (lineIndex < lines.length - 1) {
                            setLineIndex((prev) => prev + 1);
                          }
                        }, 300);
                      }}
                    />
                  ) : (
                    <span>{line.prompt.slice(2)}</span>
                  )}
                </div>
                <div
                  className={`text-2xl sm:text-3xl md:text-4xl font-bold animate-fade-in ${
                    index === 0 ? "text-text-primary" : "text-accent-cyan"
                  }`}
                >
                  {">"} {line.output}
                  {index === lines.length - 1 && lineIndex === lines.length - 1 && (
                    <Cursor />
                  )}
                </div>
              </>
            )}
          </div>
        ))}
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
