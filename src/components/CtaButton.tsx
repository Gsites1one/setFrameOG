"use client";

import { useRef } from "react";
import Link from "next/link";
import { m, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

type CtaButtonProps = {
  size?: "sm" | "lg";
  className?: string;
};

const SIZE_CLASSES: Record<NonNullable<CtaButtonProps["size"]>, string> = {
  sm: "px-4 py-1.5 text-xs",
  lg: "px-6 py-3 text-sm",
};

const MAGNET_STRENGTH = 0.3; // fraction of cursor offset the button follows

export function CtaButton({ size = "lg", className = "" }: CtaButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 250, damping: 18 });
  const springY = useSpring(y, { stiffness: 250, damping: 18 });

  // Cache the rect on enter so the magnet handler never reads layout per move.
  const onPointerEnter = () => {
    if (ref.current) rectRef.current = ref.current.getBoundingClientRect();
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (shouldReduceMotion || e.pointerType !== "mouse" || !rectRef.current) return;
    const rect = rectRef.current;
    x.set((e.clientX - rect.left - rect.width / 2) * MAGNET_STRENGTH);
    y.set((e.clientY - rect.top - rect.height / 2) * MAGNET_STRENGTH);
  };

  const onPointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <m.div
      ref={ref}
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{ x: springX, y: springY }}
      className="inline-block"
    >
      <Link
        href="/contact"
        className={`inline-flex items-center justify-center rounded-full border border-accent/50 font-display font-semibold tracking-wide text-accent transition-colors hover:border-accent hover:bg-accent/10 ${SIZE_CLASSES[size]} ${className}`}
      >
        [ Start a conversation ]
      </Link>
    </m.div>
  );
}
