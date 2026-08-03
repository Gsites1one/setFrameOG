"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavWordmark } from "./NavWordmark";

// Work / Services / About / FAQ (Iteration 6, Task 8). Services and About are
// real pages now, so they are plain links. Work and FAQ stay section anchors:
// on the homepage they smooth-scroll in place, and from any other page they
// navigate home WITH the hash so the visitor lands on the right section
// instead of at the top of the homepage.
const NAV_LINKS = [
  { label: "Work", hash: "#work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "FAQ", hash: "#faq" },
] as const;

export function FloatingNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  // Visibility is DERIVED, not pushed into state from the effect: the only
  // thing state tracks is whether the hero is on screen, which is genuine
  // external input and so is set from the observer callback. Writing
  // `visible` directly in the effect body would be a setState-in-effect
  // cascade (and the lint rule that guards against it).
  //
  // On the homepage the nav waits until the hero has scrolled away, so it
  // never covers the opening statement. Every other page has no hero to
  // clear, so the nav is available immediately.
  const [heroOnScreen, setHeroOnScreen] = useState(true);
  const visible = !isHome || !heroOnScreen;

  useEffect(() => {
    if (!isHome) return;
    const hero = document.getElementById("hero");
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setHeroOnScreen(entry.isIntersecting),
      { rootMargin: "-64px 0px 0px 0px" }
    );
    observer.observe(hero);

    // Geometry fallback. If the observer never delivers, `heroOnScreen` would
    // stay true forever and the homepage would silently lose its navigation —
    // the same "one mechanism fails, nothing recovers" shape as the scroll
    // reveals that once left the page blank after a back-navigation. This is
    // the cheap insurance: a passive, throttled scroll check that resolves the
    // same boolean from the hero's own rect, so both paths agree.
    // Throttled on a timestamp rather than requestAnimationFrame: rAF is
    // throttled or suspended in background/occluded tabs, which is exactly the
    // situation where this fallback would be carrying the feature. A plain
    // clock check keeps one rect read per 100ms without depending on frames
    // being produced at all.
    let last = 0;
    const onScroll = () => {
      const now = Date.now();
      if (now - last < 100) return;
      last = now;
      setHeroOnScreen(hero.getBoundingClientRect().bottom > 64);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [isHome]);

  return (
    <nav
      inert={!visible || undefined}
      className={`fixed left-1/2 top-4 z-50 -translate-x-1/2 transition-all duration-300 ${
        visible
          ? "translate-y-0 opacity-100"
          : "-translate-y-4 opacity-0 pointer-events-none"
      }`}
    >
      {/* Spacing is tighter below sm than it looks like it needs to be: with
          "About" added as a fourth item the pill measured 326px at a 320px
          viewport and hung 3px off both edges. The gaps, the horizontal
          padding and the link size all step up at sm. Dropping the links to
          11px on phones also matches the CTA beside them, which is 11px there
          too, so the row is one consistent size rather than two. */}
      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-surface/80 px-2 py-2 backdrop-blur-md sm:gap-5 sm:px-4">
        <NavWordmark />
        <ul className="flex items-center gap-2 font-mono text-[11px] tracking-wide text-foreground/80 sm:gap-4 sm:text-xs">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              {"href" in link ? (
                <Link
                  href={link.href}
                  className="transition-colors hover:text-accent"
                >
                  {link.label}
                </Link>
              ) : isHome ? (
                <a
                  href={link.hash}
                  onClick={(e) => {
                    // Smooth scroll for in-page anchors only. The global
                    // scroll-behavior:smooth was removed because it made
                    // route changes smooth-scroll the whole page to the top;
                    // this keeps the nice anchor glide without that bug.
                    // Reduced-motion users get the browser default (instant).
                    const target = document.querySelector(link.hash);
                    if (
                      target &&
                      !window.matchMedia("(prefers-reduced-motion: reduce)")
                        .matches
                    ) {
                      e.preventDefault();
                      target.scrollIntoView({ behavior: "smooth" });
                      history.pushState(null, "", link.hash);
                    }
                  }}
                  className="transition-colors hover:text-accent"
                >
                  {link.label}
                </a>
              ) : (
                // Off the homepage the same item becomes a route change that
                // carries the hash, so it is never a dead anchor pointing at a
                // section that does not exist on this page.
                <Link
                  href={`/${link.hash}`}
                  className="transition-colors hover:text-accent"
                >
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
        {/* Sized down on phones only (owner review: "a little too big").
            The font step is half the fix — the real cause was that the full
            label wrapped onto THREE lines at 390px, which inflated the whole
            pill to 67px tall. Setting the full label to nowrap instead would
            need ~128px next to the section links and overflow the screen, so
            phones get a short label and everything from sm up keeps the full
            one. aria-label carries the complete wording either way, so the
            accessible name never changes with the breakpoint.

            font-mono, not font-display (Iteration 6, Task 2). The nav was
            rendering three typefaces in one pill — Syne 700 wordmark, IBM Plex
            Mono links, Syne 600 CTA — and a geometric display face sitting
            inline against a monospace face at the same 12px is what made the
            bar look unevenly set. The links and the CTA now share one face, so
            the pill reads as a single system; the wordmark stays Syne because
            a logo is legitimately its own treatment. The [ ] motif is kept. */}
        <Link
          href="/contact"
          aria-label="Start a conversation"
          className="whitespace-nowrap font-mono text-[11px] font-medium tracking-wide text-accent transition-opacity hover:opacity-80 sm:text-xs"
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
