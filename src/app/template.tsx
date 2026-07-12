"use client";

import { motion, useReducedMotion } from "framer-motion";

// Re-mounts on every route change, giving each page a soft fade-in so
// navigating between / and /contact never shows a hard load.
export default function Template({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { duration: 0.25, ease: "easeOut" }
      }
    >
      {children}
    </motion.div>
  );
}
