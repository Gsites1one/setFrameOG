"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";

const SESSION_KEY = "sf-intro-seen";

// First-visit-per-session brand orientation (<=700ms). The hero headline and
// CTA are already painted underneath; this is a lightweight overlay that never
// delays interaction. Dismissed instantly by scroll, tap, or keydown. Runs at
// most once.
//
// Skipped entirely on prefers-reduced-motion, on return visits, and on phones.
// The phone rule is deliberate: an opaque overlay is precisely what Speed Index
// penalises, and mobile is both the slowest connection and the ranking-critical
// surface. Desktop keeps the branded moment at no measurable cost.
export function IntroCurtain() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isPhone = window.matchMedia("(max-width: 767px)").matches;
    if (reducedMotion || isPhone) return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    sessionStorage.setItem(SESSION_KEY, "1");
    setShow(true);

    const dismiss = () => setShow(false);
    const timer = setTimeout(dismiss, 700);

    window.addEventListener("scroll", dismiss, { once: true, passive: true });
    window.addEventListener("pointerdown", dismiss, { once: true });
    window.addEventListener("keydown", dismiss, { once: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", dismiss);
      window.removeEventListener("pointerdown", dismiss);
      window.removeEventListener("keydown", dismiss);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <m.div
          className="fixed inset-0 z-[95] flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          aria-hidden="true"
        >
          <div className="relative flex items-center">
            <m.span
              className="font-display text-4xl font-bold text-accent"
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              [
            </m.span>
            <m.span
              className="mx-2 font-display text-3xl font-bold tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.25 }}
            >
              SetFrame
            </m.span>
            <m.span
              className="font-display text-4xl font-bold text-accent"
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              ]
            </m.span>
            {/* copper pulse crossing the center */}
            <m.span
              className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-transparent via-accent/40 to-transparent"
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 220, opacity: [0, 1, 0] }}
              transition={{ duration: 0.5, delay: 0.35, ease: "easeInOut" }}
            />
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
