"use client";

import { useEffect } from "react";
import { useAnimateAfterIdle } from "@/lib/useAnimateAfterIdle";

// Site-wide background. Iteration 11 settled this after a side-by-side preview.
//
// The aurora base is now the background: large soft copper/teal blobs each on
// its own slow transform loop, plus a drifting particle field, over the
// unchanged always-on dot grid and grain.
//
// REMOVED with that decision: the cursor-following glow and the cursor-revealed
// dot-grid mask, along with their pointermove listeners and the rAF tick that
// drove them. They were a fine-pointer-only enhancement, so half the audience
// never saw them at all, and the aurora carries the same job for everyone with
// no pointer required and no per-frame JS.
//
// Scroll coupling is deliberately NOT global. See the SCROLL BOUNDARY note on
// the effect below.
//
// All motion is transform/opacity only and stays behind .anim-gate, so it is
// held paused until the browser is idle after first paint and never inflates
// the mobile Speed Index window. Static under reduced motion.

const GRAIN_DATA_URI = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

// Aurora blobs. Alphas sit in the lower half of the 0.05-0.12 range the
// existing ambient layers use, and that is a contrast requirement rather than
// taste: these are fixed full-viewport layers that sit UNDER the hero copy, so
// every point of alpha here is subtracted from the headroom copper text has.
// See --color-accent-text in globals.css for the measurements.
//
// Fixed percentage positions, own colour and
// own keyframe class each, so no two share a period or a starting phase.
const AURORA_BLOBS = [
  { cls: "aurora-a", pos: "left-[-10%] top-[-5%] h-[46rem] w-[46rem]", tint: "rgba(199,123,63,0.06)" },
  { cls: "aurora-b", pos: "right-[-14%] top-[18%] h-[40rem] w-[40rem]", tint: "rgba(79,179,201,0.045)" },
  { cls: "aurora-c", pos: "left-[18%] bottom-[-18%] h-[44rem] w-[44rem]", tint: "rgba(199,123,63,0.05)" },
  { cls: "aurora-d", pos: "right-[8%] bottom-[6%] h-[34rem] w-[34rem]", tint: "rgba(79,179,201,0.04)" },
];

// Drifting particles. Decorative texture, deliberately NOT a
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
  const animate = useAnimateAfterIdle();


  // SCROLL BOUNDARY — publishes scroll progress as --sp on :root.
  //
  // The boundary is the document scroll position at which #hero's bottom edge
  // reaches the TOP of the viewport, i.e. the hero is completely off screen:
  //
  //   scrollY <  boundary  ->  --sp pinned to exactly 0
  //   scrollY >= boundary  ->  --sp ramps 0..1 across (documentMax - boundary)
  //
  // Above the boundary the blobs run ONLY their own 43-88s loops, so nothing in
  // the hero is coupled to the scrollbar. In the first seconds the visitor has
  // one job — read the headline — and movement that tracks their scroll competes
  // for exactly that attention. The coupling arrives as the next section does.
  //
  // Two weaker boundaries were rejected: the hero's bottom crossing the viewport
  // BOTTOM fires at ~57px, while the headline still fills the screen, and any
  // "first section partially visible" test leaves the hero on screen for the
  // whole window it covers. Measured, this boundary is ~957px at 1440x900 and
  // ~919px at 320px, leaving a ~5025px ramp.
  //
  // Because the ramp starts AT 0 and is linear, crossing the boundary is
  // continuous — there is no step to see.
  //
  // Throttled on a timestamp, not requestAnimationFrame: rAF is throttled or
  // suspended in background/occluded tabs, which is the same trap FloatingNav's
  // scroll fallback already documents. Recomputes the boundary on resize, since
  // the hero's height is breakpoint-dependent.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    let last = 0;
    let boundary = 0;

    const measure = () => {
      const hero = document.getElementById("hero");
      boundary = hero
        ? hero.getBoundingClientRect().bottom + window.scrollY
        : root.clientHeight;
    };

    const write = () => {
      last = Date.now();
      const span = root.scrollHeight - root.clientHeight - boundary;
      const sp =
        span > 0
          ? Math.min(1, Math.max(0, (root.scrollTop - boundary) / span))
          : 0;
      root.style.setProperty("--sp", sp.toFixed(4));
    };

    const onScroll = () => {
      if (Date.now() - last < 16) return;
      write();
    };

    const onResize = () => {
      measure();
      write();
    };

    measure();
    write();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      root.style.removeProperty("--sp");
    };
  }, []);

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

      {/* Aurora blobs. Blobs 0 and 2 additionally carry the scroll response;
          the other two stay purely on their own loops so the layer never reads
          as one synchronised sheet reacting to the scrollbar.

          The scroll transform sits on a WRAPPER, never on the blob itself: the
          blob already carries an aurora keyframe animation, and an animated
          transform always beats a declared one, so sharing an element would
          silently drop one of the two. Nesting composes them, which is what
          lets these blobs drift AND respond to scroll. */}
      {AURORA_BLOBS.map((b, i) => {
        const scrollCls =
          i === 0 ? "scroll-lift" : i === 2 ? "scroll-sink" : "";
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

      {/* Temperature shift: copper at the top of the page, teal by the bottom.
          Driven by the same --sp as the blobs, so it is gated by the same hero
          boundary for free — inside the hero this holds at full copper and zero
          teal rather than needing its own condition. Opacity only.

          This is the part that is actually felt. Two blobs drifting across a
          ~6000px ramp is close to invisible on its own, which is exactly what
          the first attempt at this got wrong. */}
      <div
        className="scroll-warm absolute inset-0"
        style={{
          background:
            "radial-gradient(75% 60% at 50% 8%, rgba(199,123,63,0.05), transparent 72%)",
        }}
      />
      <div
        className="scroll-cool absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 65% at 50% 92%, rgba(79,179,201,0.05), transparent 74%)",
        }}
      />

      {/* Particle field counter-drifts against the blobs, which is what makes
          the movement read as depth rather than the whole layer sliding. */}
      <div className="scroll-particles absolute inset-0">
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
