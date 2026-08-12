import { TONE_HEX, toneForScore } from "@/lib/auditScore";

// Radial score indicator. Plain SVG rather than a chart library — it is one arc
// and a number, and the site already avoids pulling in libraries for what SVG
// and CSS do natively.
//
// No state, no effect, no client boundary: the arc renders at its final
// stroke-dashoffset and the draw-in is a CSS keyframe that starts from the full
// circumference (passed down as a custom property). An earlier version flipped
// a state flag in an effect to trigger the transition, which is a
// setState-in-effect cascade for something the compositor handles by itself.
// Reduced motion drops the keyframe and the final value is simply what paints.
//
// The colour comes from the shared tone scale, so the ring, the category bars
// and the priority pills can never disagree about what "good" looks like.
export function ScoreRing({
  score,
  rating,
  size = 168,
  stroke = 11,
}: {
  score: number;
  /** Poor / Fair / Good / Excellent, shown under the numeral. */
  rating?: string;
  size?: number;
  stroke?: number;
}) {
  const tone = toneForScore(score);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(10, score)) / 10;
  const offset = circumference * (1 - pct);

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Overall score ${score.toFixed(1)} out of 10`}
    >
      <svg width={size} height={size} className="-rotate-90">
        {/* track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(245,245,244,0.07)"
          strokeWidth={stroke}
        />
        {/* value */}
        <circle
          className="score-ring-draw"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={TONE_HEX[tone]}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={
            { "--ring-circumference": circumference } as React.CSSProperties
          }
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-display text-[2.75rem] font-bold leading-none"
          style={{ color: TONE_HEX[tone] }}
        >
          {score.toFixed(1)}
        </span>
        <span className="mt-1 font-mono text-[10px] tracking-[0.1em] text-foreground/40">
          /10
        </span>
        {rating && (
          <span
            className="mt-2 font-display text-xs font-semibold"
            style={{ color: TONE_HEX[tone] }}
          >
            {rating}
          </span>
        )}
      </div>
    </div>
  );
}
