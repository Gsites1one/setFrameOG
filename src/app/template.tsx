"use client";

import { useEffect, useState } from "react";
import { m, useReducedMotion } from "framer-motion";

// Client-module flag: survives template remounts (navigations) within the same
// JS context, and is never mutated on the server (effects don't run there).
let clientHasMounted = false;

// Bracket wipe: two panels sweep outward revealing the new page, each edged
// with a copper bracket line.
//
// It runs ONLY on client-side navigations, never on the first paint. Next
// renders template.tsx on initial load too, so gating the first paint behind
// this animation used to hide the whole page at opacity 0 for 250ms, which
// made the content ineligible for LCP and wrecked Speed Index. On first load
// the children are now returned untouched: content paints immediately.
export default function Template({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  // Evaluated once per mount. During SSR and the client's hydration render this
  // is false, so the server HTML and first client paint always agree.
  const [playWipe] = useState(() =>
    typeof window === "undefined" ? false : clientHasMounted
  );

  useEffect(() => {
    clientHasMounted = true;
  }, []);

  if (shouldReduceMotion || !playWipe) return <>{children}</>;

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-[90] flex">
        <m.div
          className="h-full w-1/2 border-r-2 border-accent bg-background"
          initial={{ x: "0%" }}
          animate={{ x: "-100%" }}
          transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1], delay: 0.05 }}
        />
        <m.div
          className="h-full w-1/2 border-l-2 border-accent bg-background"
          initial={{ x: "0%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1], delay: 0.05 }}
        />
      </div>
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.25, ease: "easeOut" }}
      >
        {children}
      </m.div>
    </>
  );
}
