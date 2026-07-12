"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PROJECTS } from "@/lib/projects";

const HOLD_MS = 10000; // how long each project stays visible
const FOLD_MS = 700; // one direction of the corner fold

const CORNERS = [
  { pos: "-left-2 -top-2", border: "border-l-2 border-t-2", fold: { x: 20, y: 20 } },
  { pos: "-right-2 -top-2", border: "border-r-2 border-t-2", fold: { x: -20, y: 20 } },
  { pos: "-bottom-2 -left-2", border: "border-b-2 border-l-2", fold: { x: 20, y: -20 } },
  { pos: "-bottom-2 -right-2", border: "border-b-2 border-r-2", fold: { x: -20, y: -20 } },
];

export function CornerShowcase() {
  const shouldReduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [folding, setFolding] = useState(false);

  useEffect(() => {
    if (shouldReduceMotion || PROJECTS.length < 2) return;

    let swapTimer: ReturnType<typeof setTimeout>;
    let openTimer: ReturnType<typeof setTimeout>;

    const interval = setInterval(() => {
      setFolding(true); // corners fold inward, content fades out
      swapTimer = setTimeout(() => {
        setIndex((i) => (i + 1) % PROJECTS.length);
        openTimer = setTimeout(() => setFolding(false), 100); // corners fold back out
      }, FOLD_MS);
    }, HOLD_MS);

    return () => {
      clearInterval(interval);
      clearTimeout(swapTimer);
      clearTimeout(openTimer);
    };
  }, [shouldReduceMotion]);

  const project = PROJECTS[index];

  return (
    <div className="relative">
      {CORNERS.map((corner) => (
        <motion.span
          key={corner.pos}
          className={`pointer-events-none absolute z-10 h-6 w-6 border-accent ${corner.pos} ${corner.border}`}
          animate={
            folding ? { x: corner.fold.x, y: corner.fold.y, opacity: 0.6 } : { x: 0, y: 0, opacity: 1 }
          }
          transition={{ duration: FOLD_MS / 1000, ease: "easeInOut" }}
        />
      ))}

      <div className="overflow-hidden rounded-xl border border-white/10 bg-surface shadow-2xl">
        <div className="flex items-center gap-2 border-b border-white/10 bg-surface px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
          <AnimatePresence mode="wait">
            <motion.span
              key={project.slug}
              className="ml-3 rounded-full bg-background px-3 py-1 font-mono text-[11px] text-foreground/50"
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {project.url.replace("https://", "")}
            </motion.span>
          </AnimatePresence>
        </div>

        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open the live ${project.name} website in a new tab`}
          className="block"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={project.slug}
              className="relative aspect-video"
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
              transition={{ duration: FOLD_MS / 1000, ease: "easeInOut" }}
            >
              <Image
                src={project.image}
                alt={project.alt}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover object-top"
                priority={index === 0}
              />
            </motion.div>
          </AnimatePresence>
        </a>
      </div>
    </div>
  );
}
