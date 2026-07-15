import Image from "next/image";
import { SYSTEM_TILES, type SystemTile } from "@/lib/projects";

// Systems strip (P7.2): a continuous marquee of unique system tiles. Two
// identical copies of the tile list sit side by side; the track translates
// -50% and loops, so the seam is invisible and no tile ever sits adjacent to
// a copy of itself (there are 7 unique tiles, so a full pass reads as one
// long continuous run rather than a ~2s repeat). Every tile is a real link to
// its /knowledge#slug section. The second copy is aria-hidden + removed from
// the tab order so assistive tech and keyboard users only meet each tile once.

function SystemTileCard({
  tile,
  interactive,
}: {
  tile: SystemTile;
  interactive: boolean;
}) {
  return (
    <a
      href={`/knowledge#${tile.slug}`}
      tabIndex={interactive ? undefined : -1}
      aria-hidden={interactive ? undefined : true}
      className="group mx-3 block w-72 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-surface transition-colors hover:border-accent/50 focus-visible:border-accent sm:w-80"
    >
      <div className="relative aspect-video overflow-hidden bg-surface">
        <Image
          src={tile.image}
          alt={tile.alt}
          fill
          sizes="320px"
          className="object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div
          aria-hidden="true"
          className="ambient-glow pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(199,123,63,0.30),transparent_65%)]"
        />
      </div>
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div>
          <p className="font-display text-sm font-semibold">{tile.name}</p>
          <p className="mt-1 text-xs leading-relaxed text-foreground/60">
            {tile.tagline}
          </p>
        </div>
        <span
          aria-hidden="true"
          className="shrink-0 font-mono text-sm text-accent transition-transform duration-200 group-hover:translate-x-0.5"
        >
          →
        </span>
      </div>
    </a>
  );
}

export function SystemsStrip() {
  return (
    <div className="marquee mt-10">
      <div className="marquee-track flex w-max">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex">
            {SYSTEM_TILES.map((tile) => (
              <SystemTileCard
                key={`${copy}-${tile.slug}`}
                tile={tile}
                interactive={copy === 0}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
