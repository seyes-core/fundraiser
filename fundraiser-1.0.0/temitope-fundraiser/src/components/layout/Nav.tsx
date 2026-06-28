"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/",             label: "Home" },
  { href: "/about",        label: "About" },
  { href: "/transparency", label: "Transparency" },
  { href: "/guestbook",    label: "Guestbook" },
];

interface NavProps {
  onDonate: () => void;
}

export function Nav({ onDonate }: NavProps) {
  const [open, setOpen] = useState(false);
  const path = usePathname();

  return (
    <nav
      style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(250,250,248,0.96)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid #E8E6E1",
      }}
      aria-label="Main navigation"
    >
      <div style={{ maxWidth: 1060, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 58 }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1917", fontFamily: "'Lora', Georgia, serif", lineHeight: 1.1 }}>Temitope</div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#C8861A" }}>Fundraising Campaign</div>
        </Link>

        {/* Desktop links */}
        <div style={{ display: "flex", alignItems: "center", gap: 2 }} className="hidden sm:flex">
          {NAV_LINKS.map((l) => {
            const active = path === l.href;
            return (
              <Link key={l.href} href={l.href}
                style={{
                  padding: "7px 14px", borderRadius: 8,
                  background: active ? "#EEF3F8" : "transparent",
                  color: active ? "#1B3A5C" : "#6B6860",
                  fontWeight: active ? 600 : 500, fontSize: 14,
                  textDecoration: "none", transition: "all .15s",
                }}>
                {l.label}
              </Link>
            );
          })}
          <button
            onClick={onDonate}
            style={{ marginLeft: 10, padding: "8px 20px", borderRadius: 8, border: "none", background: "#1B3A5C", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
          >
            Donate
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setOpen((o) => !o)}
          className="sm:hidden"
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#1A1917", padding: 6 }}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div style={{ borderTop: "1px solid #E8E6E1", background: "#FFFFFF", padding: "12px 20px 16px" }}>
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href}
              onClick={() => setOpen(false)}
              style={{
                display: "block", padding: "10px 0",
                color: path === l.href ? "#1B3A5C" : "#1A1917",
                fontWeight: path === l.href ? 600 : 500,
                fontSize: 15, textDecoration: "none",
                borderBottom: "1px solid #F3F2EF",
              }}>
              {l.label}
            </Link>
          ))}
          <button
            onClick={() => { onDonate(); setOpen(false); }}
            style={{ marginTop: 14, width: "100%", padding: "12px 0", borderRadius: 10, border: "none", background: "#1B3A5C", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer" }}
          >
            Donate Now
          </button>
        </div>
      )}
    </nav>
  );
}
