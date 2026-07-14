"use client";

import { LazyMotion, domAnimation } from "framer-motion";

// Loads only the DOM animation feature set (animations, exit, gestures,
// whileInView) instead of the full Framer Motion bundle. All components use
// the lightweight `m.` primitives; `strict` guarantees none slip back to the
// heavy `motion.` components.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
