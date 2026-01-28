"use client";

import { useEffect, useState } from "react";
import { Cursor } from "./Cursor";

interface TypeWriterProps {
  text: string;
  delay?: number;
  className?: string;
  showCursor?: boolean;
  onComplete?: () => void;
}

export function TypeWriter({
  text,
  delay = 50,
  className = "",
  showCursor = true,
  onComplete,
}: TypeWriterProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setDisplayedText(text);
      setIsComplete(true);
      onComplete?.();
      return;
    }

    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
        setIsComplete(true);
        onComplete?.();
      }
    }, delay);

    return () => clearInterval(timer);
  }, [text, delay, onComplete]);

  return (
    <span className={className}>
      {displayedText}
      {showCursor && !isComplete && <Cursor />}
    </span>
  );
}
