"use client";

import { useEffect, useRef } from "react";
import { useAnimateAfterIdle } from "@/lib/useAnimateAfterIdle";
import { usePreviewVariants } from "@/lib/previewVariants";

// Site-wide background "life" package. Two layers:
// 1. Default ambient layer (Task 6): a slow drifting/breathing copper glow
//    plus a slow-pulsing mesh + grain, CSS-only, on for every device
//    including touch. This is what keeps the background alive with no
//    pointer at all.
// 2. Cursor-reactive enhancement: a second copper glow that follows the
//    pointer, plus a cursor-revealed dot grid. Fine-pointer devices only,
//    layered on top of (never replacing) the default ambient layer.
// All motion here is transform/opacity only, and the pointer-follow loop
// runs through a single rAF tick. Fully static under reduced motion.
//
// P7.5: these full-viewport ambient animations are held paused until the
// browser is idle after first paint (`.anim-gate`), so they don't keep the
// early filmstrip "in motion" and inflate mobile Speed Index. They resume a
// beat later — imperceptible against the graphite base.

const GRAIN_DATA_URI = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

// PREVIEW ONLY — aurora blobs. Fixed percentage positions, own colour and
// own keyframe class each, so no two share a period or a starting phase.
const AURORA_BLOBS = [
  { cls: "aurora-a", pos: "left-[-10%] top-[-5%] h-[46rem] w-[46rem]", tint: "rgba(199,123,63,0.12)" },
  { cls: "aurora-b", pos: "right-[-14%] top-[18%] h-[40rem] w-[40rem]", tint: "rgba(79,179,201,0.09)" },
  { cls: "aurora-c", pos: "left-[18%] bottom-[-18%] h-[44rem] w-[44rem]", tint: "rgba(199,123,63,0.08)" },
  { cls: "aurora-d", pos: "right-[8%] bottom-[6%] h-[34rem] w-[34rem]", tint: "rgba(79,179,201,0.06)" },
];

// PREVIEW ONLY — drifting particles. Decorative texture, deliberately NOT a
// path or a connector shape: that critique already landed on AboutPipe and
// this is not a repeat of it. Positions are fixed percentages so they are
// stable across renders (no Math.random, which would also break hydration).
const PARTICLES = [
  { x: "12%", y: "22%", size: 3, tint: "#c77b3f", dur: "17s", delay: "-2s" },
  { x: "27%", y: "68%", size: 2, tint: "#4fb3c9", dur: "23s", delay: "-11s" },
  { x: "38%", y: "14%", size: 2, tint: "#c77b3f", dur: "19s", delay: "-6s" },
  { x: "46%", y: "82%", size: 3, tint: "#4fb3c9", dur: "26s", delay: "-18s" },
  { x: "55%", y: "35%", size: 2, tint: "#c77b3f", dur: "21s", delay: "-4s" },
  { x: "63%", y: "58%", size: 3, tint: "#c77b3f", dur: "29s", delay: "-14s" },
  { x: "71%", y: "12%", size: 2, tint: "#4fb3c9", dur: "18s", delay: "-9s" },
  { x: "78%", y: "74%", size: 2, tint: "#c77b3f", dur: "24s", delay: "-21s" },
  { x: "84%", y: "42%", size: 3, tint: "#4fb3c9", dur: "20s", delay: "-7s" },
  { x: "91%", y: "88%", size: 2, tint: "#c77b3f", dur: "27s", delay: "-16s" },
  { x: "8%", y: "50%", size: 2, tint: "#4fb3c9", dur: "22s", delay: "-13s" },
  { x: "33%", y: "45%", size: 2, tint: "#c77b3f", dur: "25s", delay: "-19s" },
];

export function LifeBackground() {
  const glowRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const animate = useAnimateAfterIdle();
  // PREVIEW ONLY. "current" leaves the pointer-tracking path below fully
  // intact and reachable; the two new variants replace it.
  const { bg } = usePreviewVariants();
  const isAurora = bg === "aurora" || bg === "scroll";

  useEffect(() => {
    // The pointer-tracking glow and the cursor-revealed grid mask are the two
    // things the aurora variants replace, so their listeners and rAF tick must
    // not be attached at all under those variants — leaving a rAF loop running
    // against elements that are no longer rendered would make the comparison
    // dishonest on the exact axis (cost) it is likely to be judged on.
    if (isAurora) return;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!finePointer || reducedMotion) return;

    const glow = glowRef.current;
    const grid = gridRef.current;
    if (!glow || !grid) return;

    glow.style.opacity = "1";

    const target = { x: window.innerWidth / 2, y: window.innerHeight * 0.3 };
    const current = { ...target };
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      grid.style.setProperty("--mx", `${e.clientX}px`);
      grid.style.setProperty("--my", `${e.clientY}px`);
    };

    const tick = () => {
      current.x += (target.x - current.x) * 0.06;
      current.y += (target.y - current.y) * 0.06;
      glow.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [isAurora]);

  // bg=scroll only: publish scroll progress as --sp on :root, 0 at the top of
  // the document and 1 at the bottom. Everything that reacts to it is plain
  // CSS reading the variable, so this writes ONE custom property per frame and
  // never touches layout.
  //
  // Throttled on a TIMESTAMP, not requestAnimationFrame, matching the pattern
  // FloatingNav's scroll fallback already documents: rAF is throttled or
  // suspended outright in background/occluded tabs, which is exactly the case
  // where this would be carrying the feature. An rAF version was written first
  // and measured doing nothing — --sp held at 0.0000 across a full 5983px
  // scroll because the frames never came. A plain clock check keeps one cheap
  // write per frame-ish interval without depending on frames being produced.
  //
  // The listener is not attached at all unless this variant is active, and not
  // under reduced motion, where --sp is left unset and the CSS resolves through
  // its own 0 fallback to a calm top-of-page state.
  useEffect(() => {
    if (bg !== "scroll") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    let last = 0;

    const write = () => {
      last = Date.now();
      const max = root.scrollHeight - root.clientHeight;
      const sp = max > 0 ? Math.min(1, Math.max(0, root.scrollTop / max)) : 0;
      root.style.setProperty("--sp", sp.toFixed(4));
    };

    const onScroll = () => {
      if (Date.now() - last < 16) return;
      write();
    };

    write();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      root.style.removeProperty("--sp");
    };
  }, [bg]);

  return (
    <div
      aria-hidden="true"
      data-animate={animate ? "on" : "off"}
      className="anim-gate pointer-events-none fixed inset-0 -z-10"
    >
      {/* Default ambient layer — on for every device, no pointer required.
          Slow drifting + breathing copper glow (transform + opacity only). */}
      <div className="ambient-glow-drift absolute left-[10%] top-[15%] h-[40rem] w-[40rem] rounded-full bg-accent/10 blur-[130px]" />

      {/* static mesh depth: two faint off-center glows so the graphite never
          reads as flat void, even on touch with no cursor tracking. Slow
          breathing opacity, same shared keyframe as the glow above. */}
      <div
        className="ambient-glow absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 15% 0%, rgba(199,123,63,0.05), transparent 70%), radial-gradient(55% 45% at 100% 100%, rgba(79,179,201,0.04), transparent 70%)",
        }}
      />

      {/* slow gradient shift: a second bloom that drifts + scales + crossfades
          on a longer period than the glow, so the graphite keeps shifting
          subtly instead of sitting still. transform + opacity only. */}
      <div
        className="gradient-shift absolute inset-0"
        style={{
          background:
            "radial-gradient(45% 40% at 70% 20%, rgba(199,123,63,0.06), transparent 70%), radial-gradient(40% 35% at 25% 85%, rgba(79,179,201,0.05), transparent 70%)",
        }}
      />

      {/* always-on faint dot grid: barely visible, gives the graphite a
          material texture on every device (the cursor grid below brightens a
          radius of it on fine pointers). */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(245,245,244,0.4) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.04,
        }}
      />

      {/* PREVIEW — aurora + particles. Inside the same .anim-gate wrapper as
          everything else here, so they stay paused until the browser is idle
          after first paint and never inflate the mobile Speed Index window.
          The always-on faint dot grid above and the grain below are untouched
          in every variant, per the brief. */}
      {isAurora && (
        <>
          {AURORA_BLOBS.map((b, i) => {
            // The scroll transform goes on a WRAPPER, never on the blob: the
            // blob's aurora keyframes already animate transform, and an
            // animated transform always beats a declared one, so sharing an
            // element would silently drop one of the two. Nesting composes
            // them, so these blobs drift AND respond to scroll.
            const scrollCls =
              bg === "scroll" && i === 0
                ? "scroll-lift"
                : bg === "scroll" && i === 2
                  ? "scroll-sink"
                  : "";
            const blob = (
              <div
                className={`${b.cls} ${scrollCls ? "absolute inset-0" : `${b.pos} absolute`} rounded-full blur-[130px]`}
                style={{ backgroundColor: b.tint }}
              />
            );
            return scrollCls ? (
              <div key={b.cls} className={`${scrollCls} ${b.pos} absolute`}>
                {blob}
              </div>
            ) : (
              <div key={b.cls} className="contents">
                {blob}
              </div>
            );
          })}

          {/* Temperature shift, bg=scroll only. Two washes crossfading against
              each other: copper at the top of the page, teal by the bottom.
              This is the part that is actually felt — two blobs drifting across
              a ~6900px page is close to invisible on its own, which is exactly
              what the first version got wrong. Opacity only. */}
          {bg === "scroll" && (
            <>
              <div
                className="scroll-warm absolute inset-0"
                style={{
                  background:
                    "radial-gradient(75% 60% at 50% 8%, rgba(199,123,63,0.10), transparent 72%)",
                }}
              />
              <div
                className="scroll-cool absolute inset-0"
                style={{
                  background:
                    "radial-gradient(80% 65% at 50% 92%, rgba(79,179,201,0.10), transparent 74%)",
                }}
              />
            </>
          )}

          <div className={bg === "scroll" ? "scroll-particles absolute inset-0" : "contents"}>
          {PARTICLES.map((d) => (
            <span
              key={`${d.x}-${d.y}`}
              className="particle absolute rounded-full"
              style={
                {
                  left: d.x,
                  top: d.y,
                  height: d.size,
                  width: d.size,
                  backgroundColor: d.tint,
                  boxShadow: `0 0 6px 1px ${d.tint}`,
                  opacity: 0,
                  "--particle-duration": d.dur,
                  "--particle-delay": d.delay,
                } as React.CSSProperties
              }
            />
          ))}
          </div>
        </>
      )}

      {/* cursor-following copper glow; ENHANCEMENT only, layered on top of
          the ambient glow above. Stays invisible on touch / reduced motion.
          Not rendered under the aurora variants. */}
      {!isAurora && (
        <div
          ref={glowRef}
          className="absolute left-0 top-0 h-[44rem] w-[44rem] rounded-full bg-accent/10 blur-[140px] opacity-0 transition-opacity duration-700"
        />
      )}

      {/* dot grid revealed in a radius around the cursor. Not rendered under
          the aurora variants; the always-on faint grid above stays either way. */}
      {!isAurora && (
      <div
        ref={gridRef}
        className="absolute inset-0"
        style={
          {
            "--mx": "-999px",
            "--my": "-999px",
            backgroundImage:
              "radial-gradient(circle, rgba(245,245,244,0.4) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage:
              "radial-gradient(260px circle at var(--mx) var(--my), black 0%, transparent 85%)",
            WebkitMaskImage:
              "radial-gradient(260px circle at var(--mx) var(--my), black 0%, transparent 85%)",
            opacity: 0.5,
          } as React.CSSProperties
        }
      />
      )}

      {/* grain so the graphite reads as material, not void — slow, barely
          perceptible pulse, on a different period than the glow so nothing
          reads as synced/mechanical */}
      <div
        className="grain-breathe absolute inset-0"
        style={{ backgroundImage: GRAIN_DATA_URI }}
      />
    </div>
  );
}
