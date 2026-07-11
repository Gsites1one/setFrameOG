"use client";

import { motion, useReducedMotion } from "framer-motion";

type BracketMarkProps = {
  side: "left" | "right";
  className?: string;
  delay?: number;
  duration?: number;
};

const PATHS: Record<BracketMarkProps["side"], string> = {
  left: "M 30 4 L 10 4 Q 4 4 4 10 L 4 190 Q 4 196 10 196 L 30 196",
  right: "M 10 4 L 30 4 Q 36 4 36 10 L 36 190 Q 36 196 30 196 L 10 196",
};

export function BracketMark({
  side,
  className = "",
  delay = 0,
  duration = 0.5,
}: BracketMarkProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <svg
      viewBox="0 0 40 200"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <motion.path
        d={PATHS[side]}
        fill="none"
        stroke="currentColor"
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={shouldReduceMotion ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { duration, delay, ease: "easeInOut" }
        }
      />
    </svg>
  );
}
