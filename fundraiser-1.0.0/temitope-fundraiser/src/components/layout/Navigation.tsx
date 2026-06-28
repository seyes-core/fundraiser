'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/campaign', label: 'Campaign' },
  { href: '/guestbook', label: 'Guestbook' },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-rule">
      <nav className="container-site flex items-center justify-between h-16" aria-label="Main navigation">
        <Link
          href="/"
          className="font-semibold text-base text-ink hover:text-lead transition-colors"
          onClick={() => setOpen(false)}
        >
          Temitope<span className="text-stone-400">.</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'text-sm font-medium transition-colors',
                pathname === href ? 'text-ink' : 'text-stone-500 hover:text-ink'
              )}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/#donate"
            className="btn-primary text-xs px-4 py-2 gap-1.5"
          >
            <Heart className="w-3.5 h-3.5" />
            Donate
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 -mr-2 rounded-lg text-stone-500 hover:text-ink"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-rule bg-white">
          <div className="container-site py-4 flex flex-col gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  pathname === href
                    ? 'bg-mist text-ink'
                    : 'text-stone-600 hover:bg-mist hover:text-ink'
                )}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/#donate"
              className="btn-primary mt-2 text-sm"
              onClick={() => setOpen(false)}
            >
              <Heart className="w-4 h-4" />
              Donate Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
