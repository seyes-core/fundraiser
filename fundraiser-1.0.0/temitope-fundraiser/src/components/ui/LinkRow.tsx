"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface LinkRowBaseProps {
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
  className?: string;
}

type LinkRowProps = LinkRowBaseProps &
  (
    | { href: string; onClick?: never; external?: boolean }
    | { href?: never; onClick: () => void; external?: never }
  );

/**
 * Tappable link row — bold label + right arrow, hairline divider between
 * rows, ≥56px tall tap target. Reads as a list of destinations.
 */
export function LinkRow({
  label,
  sublabel,
  icon,
  href,
  onClick,
  external,
  className,
}: LinkRowProps) {
  const content = (
    <>
      <span className="flex items-center gap-3 min-w-0">
        {icon && (
          <span className="text-2xl shrink-0" aria-hidden>
            {icon}
          </span>
        )}
        <span className="min-w-0">
          <span className="block text-[17px] font-semibold leading-snug">
            {label}
          </span>
          {sublabel && (
            <span className="block text-sm text-muted mt-0.5 leading-relaxed">
              {sublabel}
            </span>
          )}
        </span>
      </span>
      <ArrowRight className="w-5 h-5 shrink-0 text-navy" aria-hidden />
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={cn("link-row", className)}
        {...(external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("link-row w-full text-left bg-transparent border-x-0 border-b-0 cursor-pointer", className)}
    >
      {content}
    </button>
  );
}

export default LinkRow;
