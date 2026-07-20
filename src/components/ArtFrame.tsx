import type { ReactNode } from "react";

// Shared container treatment for all supplied photographic/cinematic artwork
// (Iteration 4, Task 4). The pillar and approach images are warm, rendered
// photos; the rest of the site is flat dark cards. This wraps each one in the
// site's card language — same corner radius and line-colour border as the
// cards — and melts its edges into the page background with an inset vignette
// so nothing reads as a pasted-in photo. A very light copper wash nudges the
// warm amber toward the site's copper accent without editing the files.
//
// The overlays are pointer-events-none and sit above the art; the art itself
// (with its baked-in legend text) is never dimmed enough to lose legibility.
export function ArtFrame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-white/10 bg-surface shadow-[0_24px_70px_-35px_rgba(0,0,0,0.9)] ${className}`}
    >
      {children}
      {/* edge-melt: fade the artwork into the page background at the borders */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-xl shadow-[inset_0_0_44px_12px_rgba(18,18,20,0.55)]"
      />
      {/* light copper unifying wash — kept subtle so legend text stays legible */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-accent/[0.05] mix-blend-soft-light"
      />
    </div>
  );
}
