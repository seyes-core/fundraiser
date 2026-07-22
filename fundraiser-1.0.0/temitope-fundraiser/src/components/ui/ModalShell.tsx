"use client";
import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Modal shell — renders as a bottom sheet on mobile (slides up, rounded top
 * corners, full width) and a centered dialog from sm up.
 */
export function ModalShell({
  onClose,
  ariaLabel,
  children,
  maxWidth = "max-w-[480px]",
}: {
  onClose: () => void;
  ariaLabel: string;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  // Lock body scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[1000] bg-ink/55 flex items-end sm:items-center justify-center sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        className={cn(
          "relative bg-surface w-full shadow-modal overflow-y-auto",
          "rounded-t-modal sm:rounded-modal",
          "max-h-[92dvh] sm:max-h-[90vh]",
          "px-5 pt-8 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-7 sm:py-9",
          maxWidth,
        )}
      >
        {/* Drag handle affordance (mobile only) */}
        <div
          className="sm:hidden absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-line"
          aria-hidden
        />
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 sm:top-4 sm:right-4 w-11 h-11 sm:w-9 sm:h-9
                     flex items-center justify-center rounded-full bg-subtle border-0
                     text-muted cursor-pointer hover:text-ink"
        >
          <X className="w-[18px] h-[18px]" />
        </button>
        {children}
      </div>
    </div>
  );
}

export default ModalShell;
