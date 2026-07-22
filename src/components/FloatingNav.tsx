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
                  onClick={(e) => {
                    // Smooth scroll for in-page anchors only. The global
                    // scroll-behavior:smooth was removed because it made
                    // route changes smooth-scroll the whole page to the top;
                    // this keeps the nice anchor glide without that bug.
                    // Reduced-motion users get the browser default (instant).
                    const target = document.querySelector(link.href);
                    if (
                      target &&
                      !window.matchMedia("(prefers-reduced-motion: reduce)")
                        .matches
                    ) {
                      e.preventDefault();
                      target.scrollIntoView({ behavior: "smooth" });
                      history.pushState(null, "", link.href);
                    }
                  }}
                  className="transition-colors hover:text-accent"
                >
                  {link.label}
                </a>
              )}
            </li>
          ))}
        </ul>
        {/* Sized down on phones only (owner review: "a little too big").
            The font step is half the fix — the real cause was that the full
            label wrapped onto THREE lines at 390px, which inflated the whole
            pill to 67px tall. Setting the full label to nowrap instead would
            need ~128px next to Work/Services/FAQ and overflow the screen, so
            phones get a short label and everything from sm up keeps the full
            one. aria-label carries the complete wording either way, so the
            accessible name never changes with the breakpoint. */}
        <Link
          href="/contact"
          aria-label="Start a conversation"
          className="whitespace-nowrap font-display text-[11px] font-semibold text-accent transition-opacity hover:opacity-80 sm:text-xs"
        >
          <span aria-hidden="true" className="sm:hidden">
            [ Start ]
          </span>
          <span aria-hidden="true" className="hidden sm:inline">
            [ Start a conversation ]
          </span>
        </Link>
      </div>
    </nav>
  );
}
