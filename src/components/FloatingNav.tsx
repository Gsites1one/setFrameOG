"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { NavWordmark } from "./NavWordmark";

// Iteration 3, Task 3: nav stays at 3 section-level items. /knowledge is
// still reachable (each Services card links to it, plus a "See how each one
// works" link under the gallery) but is no longer a competing top-level
// destination alongside Work/Services.
const NAV_LINKS = [
  { href: "#work", label: "Work" },
  { href: "#services", label: "Services" },
  { href: "#faq", label: "FAQ" },
];

export function FloatingNav() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { rootMargin: "-64px 0px 0px 0px" }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      inert={!visible || undefined}
      className={`fixed left-1/2 top-4 z-50 -translate-x-1/2 transition-all duration-300 ${
        visible
          ? "translate-y-0 opacity-100"
          : "-translate-y-4 opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex items-center gap-5 rounded-full border border-white/10 bg-surface/80 px-4 py-2 backdrop-blur-md">
        <NavWordmark />
        <ul className="flex items-center gap-4 font-mono text-xs tracking-wide text-foreground/80">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              {link.href.startsWith("/") ? (
                <Link
                  href={link.href}
                  className="transition-colors hover:text-accent"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  href={link.href}
                  className="transition-colors hover:text-accent"
                >
                  {link.label}
                </a>
              )}
            </li>
          ))}
        </ul>
        <Link
          href="/contact"
          className="font-display text-xs font-semibold text-accent transition-opacity hover:opacity-80"
        >
          [ Start a conversation ]
        </Link>
      </div>
    </nav>
  );
}
