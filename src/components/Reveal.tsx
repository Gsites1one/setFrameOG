"use client";

import { motion, useReducedMotion } from "framer-motion";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

// Section-level fade-in on scroll: triggers once, subtle upward translate.
export function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { duration: 0.5, delay, ease: "easeOut" }
      }
    >
      {children}
    </motion.div>
  );
}
