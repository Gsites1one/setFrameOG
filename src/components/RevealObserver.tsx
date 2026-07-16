"use client";

import { useEffect } from "react";

// ONE IntersectionObserver for every scroll reveal on the page.
//
// This replaces ~20 individual Framer Motion components (each with its own
// observer and animation machinery) that existed only to fade content up or
// draw a hairline. Those are plain CSS transitions, so the elements are now
// server-rendered markup and this is the only JS involved. Mounted once in
// the root layout.
export function RevealObserver() {
  useEffect(() => {
    // Tells the inline failsafe in layout.tsx that reveals are handled, so it
    // does not strip the `js` class and show everything.
    document.documentElement.dataset.revealsArmed = "1";

    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!els.length) return;

    const showAll = () => {
      for (const el of els) el.classList.add("is-visible");
    };

    // Reduced motion, or a browser without IntersectionObserver: show
    // everything at once rather than risk content that never appears.
    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      showAll();
      return;
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

    for (const el of els) io.observe(el);
    return () => io.disconnect();
  }, []);

  return null;
}
