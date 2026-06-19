import { cn } from "@/lib/cn";

interface TreeGuidesProps {
  /** One entry per ancestor depth; true = that ancestor has following siblings. */
  guides: boolean[];
  /** Whether this node is the last child of its parent (└ vs ├). */
  isLast: boolean;
}

/**
 * Decorative indent guides for a tree row, drawn as CSS lines (not box-drawing
 * text) so they fill the full row height and stay continuous across rows. One
 * fixed-width cell per ancestor draws a vertical rail when that ancestor
 * continues; the final "elbow" cell draws the connection to this node.
 */
export function TreeGuides({ guides, isLast }: TreeGuidesProps) {
  return (
    <span className="flex shrink-0 self-stretch" aria-hidden="true">
      {guides.map((cont, index) => (
        <span key={index} className="relative w-5 shrink-0">
          {cont && (
            <span className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-border" />
          )}
        </span>
      ))}
      {/* Elbow connecting to this node. */}
      <span className="relative w-5 shrink-0">
        <span
          className={cn(
            "absolute left-1/2 top-0 w-px -translate-x-1/2 bg-border",
            isLast ? "h-1/2" : "bottom-0"
          )}
        />
        <span className="absolute left-1/2 right-1 top-1/2 h-px bg-border" />
      </span>
    </span>
  );
}
