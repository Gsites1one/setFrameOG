const MOCKUP_URL = "auracapitalv1.vercel.app";

export function HeroMockup() {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute -left-2 -top-2 h-6 w-6 border-l-2 border-t-2 border-accent" />
      <span className="pointer-events-none absolute -right-2 -top-2 h-6 w-6 border-r-2 border-t-2 border-accent" />
      <span className="pointer-events-none absolute -bottom-2 -left-2 h-6 w-6 border-b-2 border-l-2 border-accent" />
      <span className="pointer-events-none absolute -bottom-2 -right-2 h-6 w-6 border-b-2 border-r-2 border-accent" />

      <div className="overflow-hidden rounded-xl border border-white/10 bg-surface shadow-2xl">
        <div className="flex items-center gap-2 border-b border-white/10 bg-surface px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
          <span className="ml-3 rounded-full bg-background px-3 py-1 font-mono text-[11px] text-foreground/50">
            {MOCKUP_URL}
          </span>
        </div>

        {/* TODO: replace with real Aura Capital screenshot once assets are supplied */}
        <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-surface via-surface to-accent/30">
          <span className="font-display text-2xl font-semibold text-foreground/80">
            Aura Capital
          </span>
        </div>
      </div>
    </div>
  );
}
