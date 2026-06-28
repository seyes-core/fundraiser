import Link from "next/link";
import { CAMPAIGN } from "@/lib/constants";

export function Footer() {
  return (
    <footer style={{ borderTop: "1px solid #E8E6E1", background: "#FFFFFF", padding: "36px 20px" }}>
      <div style={{ maxWidth: 1060, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 24 }}>
        <div>
          <div style={{ fontFamily: "'Lora', Georgia, serif", fontWeight: 700, fontSize: 15, color: "#1A1917", marginBottom: 4 }}>Temitope Ogungbuji</div>
          <div style={{ fontSize: 12, color: "#9C9A95", marginBottom: 8 }}>Aspiring Software Developer · Nigeria</div>
          <a href={CAMPAIGN.GITHUB} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 12, color: "#6B6860", textDecoration: "none", display: "block" }}>
            🐙 github.com/temitope-ogungbuji
          </a>
        </div>

        <nav aria-label="Footer navigation">
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {["/", "/about", "/transparency", "/guestbook"].map((href) => (
              <Link key={href} href={href}
                style={{ fontSize: 13, color: "#6B6860", textDecoration: "none", textTransform: "capitalize" }}>
                {href === "/" ? "Home" : href.slice(1)}
              </Link>
            ))}
          </div>
        </nav>

        <div style={{ fontSize: 11, color: "#9C9A95", textAlign: "right" }}>
          <div>Payments secured by Flutterwave</div>
          <div style={{ marginTop: 3 }}>Donor details remain private</div>
          <div style={{ marginTop: 3 }}>© 2026 Temitope Ogungbuji</div>
        </div>
      </div>
    </footer>
  );
}
