import { cn } from "@/lib/utils";

/**
 * Section wrapper with alternating background tone.
 * Creates the "card stack with rhythm" scroll feel on mobile —
 * tone changes replace borders/dividers as section separators.
 */
export function Section({
  tone = "canvas",
  id,
  className,
  innerClassName,
  children,
}: {
  tone?: "canvas" | "surface" | "tint" | "dark";
  id?: string;
  className?: string;
  innerClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "w-full section-pad px-5 sm:px-8",
        tone === "canvas" && "bg-canvas",
        tone === "surface" && "bg-surface",
        tone === "tint" && "bg-navy-light",
        tone === "dark" && "bg-navy text-white",
        className,
      )}
    >
      <div className={cn("mx-auto max-w-content", innerClassName)}>
        {children}
      </div>
    </section>
  );
}

export default Section;
