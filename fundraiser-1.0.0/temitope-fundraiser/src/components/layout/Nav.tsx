"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/transparency", label: "Transparency" },
  { href: "/guestbook", label: "Guestbook" },
];

interface NavProps {
  onDonate: () => void;
}

/**
 * Compact sticky header — logo left, hamburger right, 64px tall.
 * No visible border; a subtle elevation change appears on scroll.
 */
export function Nav({ onDonate }: NavProps) {
  const [open, setOpen] = useState(false);
  const [elevated, setElevated] = useState(false);
  const path = usePathname();

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-canvas/95 backdrop-blur-md transition-shadow duration-200",
        elevated ? "shadow-header" : "shadow-none",
      )}
    >
      <nav
        className="container-site flex items-center justify-between h-16"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link href="/" className="no-underline" onClick={() => setOpen(false)}>
          <span className="block font-display font-bold text-[15px] text-ink leading-tight">
            Temitope
          </span>
          <span className="block text-[10px] font-bold uppercase tracking-[0.1em] text-navy">
            Fundraising Campaign
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-0.5">
          {NAV_LINKS.map((l) => {
            const active = path === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "px-3.5 py-2 rounded-lg text-sm no-underline transition-colors",
                  active
                    ? "bg-navy-light text-navy font-semibold"
                    : "text-muted font-medium hover:text-ink hover:bg-subtle",
                )}
              >
                {l.label}
              </Link>
            );
          })}
          <button
            onClick={onDonate}
            className="btn-primary ml-2.5 px-5 text-sm min-h-[40px]"
          >
            Donate
          </button>
        </div>

        {/* Mobile menu toggle — 44px tap target */}
        <button
          onClick={() => setOpen((o) => !o)}
          className="md:hidden flex items-center justify-center w-11 h-11 -mr-2
                     rounded-lg bg-transparent border-0 text-ink cursor-pointer"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile menu — tappable link rows with hairline dividers */}
      {open && (
        <div className="md:hidden bg-surface border-t border-line px-5 pt-1 pb-5 max-h-[calc(100dvh-4rem)] overflow-y-auto">
          {NAV_LINKS.map((l) => {
            const active = path === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center justify-between py-4 min-h-tap border-b border-ink/5 no-underline",
                  active ? "text-navy font-semibold" : "text-ink font-medium",
                )}
              >
                <span className="text-base">{l.label}</span>
                {active && (
                  <span className="w-1.5 h-1.5 rounded-full bg-navy" aria-hidden />
                )}
              </Link>
            );
          })}
          <button
            onClick={() => {
              onDonate();
              setOpen(false);
            }}
            className="btn-primary w-full mt-4"
          >
            Donate Now
          </button>
        </div>
      )}
    </header>
  );
}

export default Nav;
