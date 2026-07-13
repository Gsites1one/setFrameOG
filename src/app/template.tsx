"use client";

import { motion, useReducedMotion } from "framer-motion";

// Bracket wipe: on every navigation the page is revealed by two panels
// sweeping outward, each edged with a copper bracket line. Content fades
// in underneath. Skipped entirely under reduced motion.
export default function Template({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) return <>{children}</>;

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-[90] flex">
        <motion.div
          className="h-full w-1/2 border-r-2 border-accent bg-background"
          initial={{ x: "0%" }}
          animate={{ x: "-100%" }}
          transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1], delay: 0.05 }}
        />
        <motion.div
          className="h-full w-1/2 border-l-2 border-accent bg-background"
          initial={{ x: "0%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1], delay: 0.05 }}
        />
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.25, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </>
  );
}
