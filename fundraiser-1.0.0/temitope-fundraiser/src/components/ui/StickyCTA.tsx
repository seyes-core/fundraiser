"use client";
import { ChevronRight } from "lucide-react";

/**
 * Sticky bottom CTA bar — mobile only (hidden ≥sm). Persistent, low-friction
 * conversion path that never competes with the nav.
 * Pair with `pb-16 sm:pb-0` on the page wrapper so it never covers content.
 */
export function StickyCTA({
  label = "Donate Now",
  onClick,
}: {
  label?: string;
  onClick: () => void;
}) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 sm:hidden pb-[env(safe-area-inset-bottom)] bg-accent">
      <button
        type="button"
        onClick={onClick}
        className="w-full flex items-center justify-center gap-2 bg-accent text-white
                   font-bold text-[15px] py-4 min-h-tap border-0 cursor-pointer
                   active:bg-accent-hover transition-colors"
      >
        {label} <ChevronRight className="w-4 h-4" aria-hidden />
      </button>
    </div>
  );
}

export default StickyCTA;
