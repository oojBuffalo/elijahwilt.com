"use client";

import { useEffect, useRef, useState } from "react";
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

  // Keep the latest onComplete in a ref so a new callback identity (callers
  // often pass an inline arrow) doesn't re-run the effect and restart typing.
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    setDisplayedText("");
    setIsComplete(false);

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setDisplayedText(text);
      setIsComplete(true);
      onCompleteRef.current?.();
      return;
    }

    // Step by code points, not UTF-16 units, so emoji never render as a
    // lone surrogate mid-animation.
    const chars = Array.from(text);
    let index = 0;
    const timer = setInterval(() => {
      if (index < chars.length) {
        setDisplayedText(chars.slice(0, index + 1).join(""));
        index++;
      } else {
        clearInterval(timer);
        setIsComplete(true);
        onCompleteRef.current?.();
      }
    }, delay);

    return () => clearInterval(timer);
  }, [text, delay]);

  return (
    <span className={className}>
      {displayedText}
      {showCursor && !isComplete && <Cursor />}
    </span>
  );
}
