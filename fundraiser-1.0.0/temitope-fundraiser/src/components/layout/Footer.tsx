import Link from "next/link";
import { CAMPAIGN } from "@/lib/constants";

const FOOTER_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/transparency", label: "Transparency" },
  { href: "/guestbook", label: "Guestbook" },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="container-site py-9 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-7">
        <div>
          <div className="font-display font-bold text-[15px] text-ink mb-1">
            Temitope Ogungbuji
          </div>
          <div className="text-xs text-faint mb-2">
            Aspiring Software Developer · Nigeria
          </div>
          <a
            href={CAMPAIGN.GITHUB}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-xs text-muted no-underline min-h-tap sm:min-h-0"
          >
            🐙 github.com/Bambillion
          </a>
        </div>

        <nav aria-label="Footer navigation">
          <div className="flex flex-col sm:flex-row gap-0 sm:gap-6">
            {FOOTER_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-[13px] text-muted no-underline py-2.5 sm:py-0
                           border-b border-ink/5 sm:border-0 min-h-tap sm:min-h-0
                           flex items-center"
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="text-[11px] text-faint sm:text-right leading-relaxed">
          <div>Payments secured by Flutterwave</div>
          <div className="mt-0.5">Donor details remain private</div>
          <div className="mt-0.5">© 2026 Temitope Ogungbuji</div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
