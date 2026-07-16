"use client";

import { useEffect, useState } from "react";

// Returns false until the browser is idle after first paint, then true.
// Used with the `.anim-gate` CSS gate to hold above-the-fold ambient CSS
// animations paused during the LCP / Speed Index window, so they don't
// inflate Speed Index by keeping the early filmstrip visually "in motion".
// The animations start a beat later — imperceptible to the visitor.
export function useAnimateAfterIdle(timeout = 1200): boolean {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const start = () => setAnimate(true);
    const ric = window.requestIdleCallback;
    const id = ric ? ric(start, { timeout }) : window.setTimeout(start, 800);
    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(id as number);
      else clearTimeout(id as number);
    };
  }, [timeout]);

  return animate;
}
