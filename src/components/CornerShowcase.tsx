"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PROJECTS } from "@/lib/projects";
import { FlowDiagram } from "./FlowDiagram";

const HOLD_MS = 6000; // how long each project stays visible
const FOLD_MS = 450; // one direction of the corner fold

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
  const frameRef = useRef<HTMLDivElement>(null);

  // Signature interaction: a copper spotlight follows the cursor across the
  // showcase, brightening whatever it passes over (screenshots and the flow
  // diagram's copper pulses read stronger under it). Fine pointer only; the
  // overlay simply never appears on touch, leaving a clean static frame.
  const onPointerMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    frameRef.current.style.setProperty("--sx", `${e.clientX - rect.left}px`);
    frameRef.current.style.setProperty("--sy", `${e.clientY - rect.top}px`);
  };

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

      <div
        ref={frameRef}
        onPointerMove={onPointerMove}
        className="group/frame relative overflow-hidden rounded-xl border border-white/10 bg-surface shadow-2xl"
        style={{ "--sx": "-300px", "--sy": "-300px" } as React.CSSProperties}
      >
        {/* signature copper spotlight, revealed on hover with a fine pointer */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 opacity-0 mix-blend-screen transition-opacity duration-300 group-hover/frame:opacity-100"
          style={{
            background:
              "radial-gradient(260px circle at var(--sx) var(--sy), rgba(199,123,63,0.22), transparent 70%)",
          }}
        />
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
              {project.displayUrl}
            </motion.span>
          </AnimatePresence>
        </div>

        <a
          href={project.url}
          target={project.kind === "site" ? "_blank" : undefined}
          rel={project.kind === "site" ? "noopener noreferrer" : undefined}
          aria-label={
            project.kind === "site"
              ? `Open the live ${project.name} website in a new tab`
              : `Learn more about ${project.name} on the contact page`
          }
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
              {project.kind === "site" && project.image ? (
                <Image
                  src={project.image}
                  alt={project.alt ?? project.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover object-top"
                  priority={index === 0}
                />
              ) : (
                <FlowDiagram />
              )}
            </motion.div>
          </AnimatePresence>
        </a>
      </div>
    </div>
  );
}
