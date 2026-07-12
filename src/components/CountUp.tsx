"use client";

import { useEffect, useRef } from "react";

type CountUpProps = {
  to: number;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
  className?: string;
};

// Mono-font counter that ticks up when it enters the viewport.
// Instant under reduced motion. Ready for proof stats sections.
export function CountUp({
  to,
  prefix = "",
  suffix = "",
  durationMs = 1400,
  className = "",
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reducedMotion) {
      el.textContent = `${prefix}${to}${suffix}`;
      return;
    }

    let raf = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const step = (now: number) => {
          const t = Math.min((now - start) / durationMs, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = `${prefix}${Math.round(to * eased)}${suffix}`;
          if (t < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, prefix, suffix, durationMs]);

  return (
    <span ref={ref} className={`font-mono tabular-nums ${className}`}>
      {`${prefix}0${suffix}`}
    </span>
  );
}
