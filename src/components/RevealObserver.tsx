"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// ONE IntersectionObserver for every scroll reveal on the page.
//
// This replaces ~20 individual Framer Motion components (each with its own
// observer and animation machinery) that existed only to fade content up or
// draw a hairline. Those are plain CSS transitions, so the elements are now
// server-rendered markup and this is the only JS involved. Mounted once in
// the root layout, which persists across client-side navigations.
//
// That persistence matters: this component does NOT remount when the user
// navigates between pages, so a one-time querySelectorAll on mount would
// only ever see the first page's reveal elements. A page reached by
// client-side navigation (e.g. clicking into /contact) mounts brand-new
// [data-reveal] nodes that a one-time scan would never observe, so they
// would sit at the CSS hidden state forever. A MutationObserver watches for
// [data-reveal] elements actually being added to the DOM and observes them
// as they appear, which works regardless of how navigation happens to be
// implemented rather than assuming anything about routing internals.
//
// FAILSAFE (owner-reported bug): on mobile, navigating to /contact and back
// left only the Hero visible until a manual refresh. The Hero is the one
// section with no [data-reveal], so "only the hero is visible" is exactly
// the signature of every reveal stuck at the hidden state. Observing the
// nodes was never the weak link (they do get observed); the weak link is
// that this whole system had NO recovery path — if IntersectionObserver
// failed to deliver for any reason, the page stayed blank forever with no
// error. That is the same failure class as the old template.tsx opacity:0
// bug, and the same rule applies: content must never depend on one
// mechanism succeeding in order to be visible.
//
// So IO stays the primary path, and a plain geometric sweep backs it up.
// The sweep reveals anything currently on screen using getBoundingClientRect
// alone, so it works even if IO never fires a single callback. It runs on
// route change, on pageshow (bfcache restores), and — throttled — on scroll.
// The scroll listener detaches itself the moment nothing is left hidden, so
// on a healthy page it costs a handful of cheap checks and then unhooks.
export function RevealObserver() {
  const pathname = usePathname();
  const sweepRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Tells the inline failsafe in layout.tsx that reveals are handled, so it
    // does not strip the `js` class and show everything.
    document.documentElement.dataset.revealsArmed = "1";

    const hidden = () =>
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)");

    const showAll = () => {
      hidden().forEach((el) => el.classList.add("is-visible"));
    };

    // Reduced motion, or a browser without IntersectionObserver: show
    // everything at once rather than risk content that never appears.
    if (
      !("IntersectionObserver" in window) ||
      !("MutationObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      showAll();
      // Newly navigated pages need the same treatment.
      sweepRef.current = showAll;
      return () => {
        sweepRef.current = null;
      };
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target); // reveal once, then stop paying for it
        }
      },
      { rootMargin: "0px 0px -80px 0px" }
    );

    const observeWithin = (root: ParentNode) => {
      root
        .querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)")
        .forEach((el) => io.observe(el));
    };

    observeWithin(document);

    const mo = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE) continue;
          const el = node as HTMLElement;
          if (el.matches("[data-reveal]")) io.observe(el);
          observeWithin(el);
        }
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    // --- Failsafe sweep -----------------------------------------------------
    let scrollBound = false;
    let lastSweep = 0;

    const sweep = () => {
      const viewportH =
        window.innerHeight || document.documentElement.clientHeight;
      const remaining = hidden();

      remaining.forEach((el) => {
        const rect = el.getBoundingClientRect();
        // At or above the bottom of the viewport: the visitor has reached it,
        // so reveal it directly, no IO callback required. Deliberately not
        // `rect.bottom > 0` as well — that would skip anything already
        // scrolled past, leaving hairlines and headings stuck undrawn above
        // the fold if a fast scroll outran the sweep.
        if (rect.top < viewportH) {
          el.classList.add("is-visible");
          io.unobserve(el);
        } else {
          // Off screen: make sure IO is watching it (cheap if already is).
          io.observe(el);
        }
      });

      // Nothing left to reveal on this page — stop listening to scroll.
      if (scrollBound && hidden().length === 0) {
        window.removeEventListener("scroll", onScroll);
        scrollBound = false;
      }
    };

    function onScroll() {
      const now = Date.now();
      if (now - lastSweep < 250) return; // throttle: 4 sweeps/sec at most
      lastSweep = now;
      sweep();
    }

    const armScrollFailsafe = () => {
      if (scrollBound || hidden().length === 0) return;
      scrollBound = true;
      window.addEventListener("scroll", onScroll, { passive: true });
    };

    const runSweep = () => {
      sweep();
      armScrollFailsafe();
    };
    sweepRef.current = runSweep;

    // bfcache restore (mobile back gesture) re-shows a page without remounting.
    window.addEventListener("pageshow", runSweep);
    armScrollFailsafe();

    return () => {
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("pageshow", runSweep);
      if (scrollBound) window.removeEventListener("scroll", onScroll);
      sweepRef.current = null;
    };
  }, []);

  // Every route change mounts a fresh set of [data-reveal] nodes. Sweep after
  // they have been laid out (two frames), with a slower backstop in case the
  // new page's markup lands late.
  useEffect(() => {
    const run = () => sweepRef.current?.();
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(run);
    });
    const timer = window.setTimeout(run, 400);
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
      window.clearTimeout(timer);
    };
  }, [pathname]);

  return null;
}
