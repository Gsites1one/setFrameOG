"use client";

import { useEffect, useState } from "react";

// Client-module flag: survives template remounts (navigations) within the same
// JS context, and is never mutated on the server (effects don't run there).
let clientHasMounted = false;

const WIPE_DURATION_MS = 600; // animation duration + delay, plus a small margin

// Bracket wipe: two panels sweep outward revealing the new page, each edged
// with a copper bracket line. Runs only on client-side navigations, never on
// first paint (see the clientHasMounted comment below).
//
// IMPORTANT: children are ALWAYS rendered at full opacity, immediately, never
// wrapped in an animation that has to fire for the page to be visible. This
// used to wrap {children} in a Framer Motion m.div (initial opacity:0,
// animate to 1). In production, that animation would occasionally never
// fire after a client-side navigation, the wrapper's inline style stayed
// frozen at opacity:0, and the entire page went invisible while still fully
// present and interactive in the DOM, with zero console errors. Root cause
// unconfirmed; the fix is to remove the failure mode; content must never
// depend on an animation succeeding to be visible.
//
// The wipe panels are pure CSS (see .wipe-panel-* in globals.css), not
// Framer, for the same reason: a CSS animation is guaranteed by the browser
// to run once the class is attached, with no JS animation-engine timing to
// race. Worst case if something goes wrong, the panels just don't slide;
// they are pointer-events-none, so they can never block the page.
export default function Template({ children }: { children: React.ReactNode }) {
  const [showWipe, setShowWipe] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const shouldWipe = clientHasMounted && !reducedMotion;
    clientHasMounted = true;

    if (!shouldWipe) return;

    setShowWipe(true);
    const timer = setTimeout(() => setShowWipe(false), WIPE_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showWipe && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[90] flex"
        >
          <div className="wipe-panel wipe-panel-left h-full w-1/2 border-r-2 border-accent bg-background" />
          <div className="wipe-panel wipe-panel-right h-full w-1/2 border-l-2 border-accent bg-background" />
        </div>
      )}
      {children}
    </>
  );
}
