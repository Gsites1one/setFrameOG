"use client";

import { useEffect } from "react";

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
export function RevealObserver() {
  useEffect(() => {
    // Tells the inline failsafe in layout.tsx that reveals are handled, so it
    // does not strip the `js` class and show everything.
    document.documentElement.dataset.revealsArmed = "1";

    const showAll = () => {
      document
        .querySelectorAll<HTMLElement>("[data-reveal]")
        .forEach((el) => el.classList.add("is-visible"));
    };

    // Reduced motion, or a browser without IntersectionObserver: show
    // everything at once rather than risk content that never appears.
    if (
      !("IntersectionObserver" in window) ||
      !("MutationObserver" in window) ||
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

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
