"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

// Living brand mark for the nav: [ S ]. The gap between the brackets and the
// letter shifts subtly with scroll (tiny parallax), and the brackets pulse
// copper on a slow ~6s cycle. Amplitude is deliberately low so it never hurts
// legibility. Static under reduced motion.
export function NavWordmark() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  // 2px -> 6px gap across the first 600px of scroll
  const gap = useTransform(scrollY, [0, 600], [2, 6]);

  return (
    <Link
      href="/"
      aria-label="SetFrame home"
      className="flex items-center font-display text-base font-bold"
    >
      <motion.span
        className={`text-accent ${shouldReduceMotion ? "" : "nav-pulse"}`}
        style={{ marginRight: shouldReduceMotion ? 2 : gap }}
      >
        [
      </motion.span>
      <span>S</span>
      <motion.span
        className={`text-accent ${shouldReduceMotion ? "" : "nav-pulse"}`}
        style={{ marginLeft: shouldReduceMotion ? 2 : gap }}
      >
        ]
      </motion.span>
    </Link>
  );
}
