// Animated system-flow visual: what a business quietly loses on the left,
// an always-on system in the middle, the recovered outcome on the right.
// Deliberately outcome-worded, never technical. Pure SVG + CSS animation
// (dash flow + node pulses), paused under prefers-reduced-motion via CSS.

const LANES = [
  { y: 70, input: "New inquiry", output: "Replied in seconds" },
  { y: 158, input: "Missed call", output: "Follow-up sent" },
  { y: 246, input: "Paper pile", output: "Read, sorted, filed" },
];

const CENTER_X = 280;
const INPUT_X = 96;
const OUTPUT_X = 464;

export function FlowDiagram() {
  return (
    <svg
      viewBox="0 0 560 315"
      className="h-full w-full bg-surface"
      role="img"
      aria-label="Diagram of an always-on business system: inquiries, missed calls and paperwork flow in, instant replies, follow-ups and sorted documents flow out"
    >
      {/* connector tracks */}
      {LANES.map((lane) => (
        <g key={lane.y}>
          <path
            d={`M ${INPUT_X + 8} ${lane.y} C ${CENTER_X - 60} ${lane.y}, ${CENTER_X - 80} 158, ${CENTER_X - 52} 158`}
            fill="none"
            stroke="rgba(245,245,244,0.12)"
            strokeWidth="1.5"
          />
          <path
            d={`M ${CENTER_X + 52} 158 C ${OUTPUT_X - 120} 158, ${OUTPUT_X - 100} ${lane.y}, ${OUTPUT_X - 8} ${lane.y}`}
            fill="none"
            stroke="rgba(245,245,244,0.12)"
            strokeWidth="1.5"
          />
          {/* animated copper flow on top of the tracks */}
          <path
            className="flow-dash"
            d={`M ${INPUT_X + 8} ${lane.y} C ${CENTER_X - 60} ${lane.y}, ${CENTER_X - 80} 158, ${CENTER_X - 52} 158`}
            fill="none"
            stroke="#c77b3f"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            className="flow-dash flow-dash-delayed"
            d={`M ${CENTER_X + 52} 158 C ${OUTPUT_X - 120} 158, ${OUTPUT_X - 100} ${lane.y}, ${OUTPUT_X - 8} ${lane.y}`}
            fill="none"
            stroke="#c77b3f"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>
      ))}

      {/* input labels */}
      {LANES.map((lane) => (
        <text
          key={`in-${lane.y}`}
          x={INPUT_X}
          y={lane.y + 4}
          textAnchor="end"
          className="fill-foreground/60 font-mono"
          fontSize="12"
        >
          {lane.input}
        </text>
      ))}

      {/* center node */}
      <rect
        x={CENTER_X - 52}
        y={134}
        width="104"
        height="48"
        rx="10"
        fill="#121214"
        stroke="#c77b3f"
        strokeOpacity="0.6"
        strokeWidth="1.5"
        className="flow-node"
      />
      <text
        x={CENTER_X}
        y={155}
        textAnchor="middle"
        className="fill-foreground font-mono"
        fontSize="12"
      >
        [ your system ]
      </text>
      <text
        x={CENTER_X}
        y={172}
        textAnchor="middle"
        className="fill-foreground/50 font-mono"
        fontSize="10"
      >
        always on
      </text>

      {/* output labels */}
      {LANES.map((lane) => (
        <text
          key={`out-${lane.y}`}
          x={OUTPUT_X}
          y={lane.y + 4}
          textAnchor="start"
          className="fill-foreground/85 font-mono"
          fontSize="12"
        >
          {lane.output}
        </text>
      ))}
    </svg>
  );
}
