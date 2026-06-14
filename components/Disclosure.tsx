import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Animated collapsible panel shared by the Projects, Skills, and Timeline
 * coursework accordions. Renders the grid-rows 0fr→1fr height transition plus
 * the a11y wiring (id, aria-hidden, inert) so a collapsed panel is out of the
 * tab order and the accessibility tree. The trigger button stays with each
 * caller, which sets `aria-expanded` and `aria-controls={id}`.
 */
export function Disclosure({
  id,
  open,
  children,
}: {
  id: string;
  open: boolean;
  children: ReactNode;
}) {
  return (
    <div
      id={id}
      aria-hidden={!open}
      inert={!open}
      className={cn(
        "grid transition-[grid-template-rows] duration-300 motion-reduce:transition-none",
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      )}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}
