"use client";

import {
  setPreviewVariant,
  usePreviewVariants,
  type BgVariant,
  type HeroVariant,
} from "@/lib/previewVariants";

// PREVIEW ONLY. Dev-only floating panel, fixed top-right, two toggle groups
// stacked. Gated on process.env.NODE_ENV, which Next inlines at build time, so
// the whole component is dead code eliminated from the production bundle
// rather than shipped-but-hidden.

const HERO_OPTIONS: { value: HeroVariant; label: string }[] = [
  { value: "current", label: "Current" },
  { value: "a", label: "A" },
  { value: "b", label: "B" },
];

const BG_OPTIONS: { value: BgVariant; label: string }[] = [
  { value: "current", label: "Current" },
  { value: "aurora", label: "Aurora" },
  { value: "scroll", label: "Aurora + Scroll" },
];

function Row({
  title,
  options,
  active,
  paramKey,
}: {
  title: string;
  options: { value: string; label: string }[];
  active: string;
  paramKey: "hero" | "bg";
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-20 shrink-0 font-mono text-[10px] uppercase tracking-wider text-foreground/50">
        {title}
      </span>
      <div className="flex gap-1">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={active === o.value}
            onClick={() => setPreviewVariant(paramKey, o.value)}
            className={`rounded-full px-2.5 py-1 font-mono text-[10px] transition-colors ${
              active === o.value
                ? "bg-accent/20 text-accent ring-1 ring-accent/50"
                : "text-foreground/60 hover:bg-white/5 hover:text-foreground"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function PreviewSwitcher() {
  const { hero, bg } = usePreviewVariants();

  if (process.env.NODE_ENV !== "development") return null;

  return (
    <div className="fixed right-4 top-4 z-[100] space-y-1.5 rounded-xl border border-white/15 bg-[rgba(18,18,20,0.92)] p-3 shadow-xl backdrop-blur-sm">
      <Row title="Hero" options={HERO_OPTIONS} active={hero} paramKey="hero" />
      <Row title="Background" options={BG_OPTIONS} active={bg} paramKey="bg" />
    </div>
  );
}
