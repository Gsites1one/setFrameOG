// Animated category graphics for the services section. Shared grammar:
// graphite depth, copper primary glow, teal (--color-cool) secondary glow,
// mono labels in buyer language, traveling pulses via the .flow-dash CSS.
// All motion pauses under prefers-reduced-motion (handled in globals.css).

const COPPER = "#c77b3f";
const COOL = "#4fb3c9";

function GlowDefs({ id }: { id: string }) {
  return (
    <defs>
      <radialGradient id={`${id}-copper-glow`}>
        <stop offset="0%" stopColor={COPPER} stopOpacity="0.35" />
        <stop offset="100%" stopColor={COPPER} stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`${id}-cool-glow`}>
        <stop offset="0%" stopColor={COOL} stopOpacity="0.3" />
        <stop offset="100%" stopColor={COOL} stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

// [ 01 ] Websites: a visitor travels the page and becomes a booked call.
export function GraphicWebsites() {
  return (
    <svg
      viewBox="0 0 560 350"
      className="h-full w-full"
      role="img"
      aria-label="A website visitor path ending in a booked call"
    >
      <GlowDefs id="web" />
      <circle cx="420" cy="250" r="90" fill="url(#web-copper-glow)" />
      <circle cx="150" cy="110" r="80" fill="url(#web-cool-glow)" />

      {/* browser frame */}
      <rect x="90" y="60" width="380" height="230" rx="12" fill="#121214" stroke="rgba(245,245,244,0.14)" strokeWidth="1.5" />
      <circle cx="112" cy="80" r="3.5" fill="rgba(245,245,244,0.2)" />
      <circle cx="126" cy="80" r="3.5" fill="rgba(245,245,244,0.2)" />
      <circle cx="140" cy="80" r="3.5" fill="rgba(245,245,244,0.2)" />
      <line x1="90" y1="96" x2="470" y2="96" stroke="rgba(245,245,244,0.14)" strokeWidth="1.5" />

      {/* wireframe blocks, cool secondary */}
      <rect x="115" y="118" width="180" height="16" rx="4" fill="none" stroke={COOL} strokeOpacity="0.5" strokeWidth="1.5" className="blink-a" />
      <rect x="115" y="146" width="130" height="10" rx="3" fill="none" stroke={COOL} strokeOpacity="0.3" strokeWidth="1.5" className="blink-b" />
      <rect x="115" y="182" width="105" height="60" rx="6" fill="none" stroke={COOL} strokeOpacity="0.35" strokeWidth="1.5" className="blink-c" />
      <rect x="238" y="182" width="105" height="60" rx="6" fill="none" stroke={COOL} strokeOpacity="0.35" strokeWidth="1.5" className="blink-a" />

      {/* visitor path to CTA */}
      <path
        d="M 60 40 C 120 40, 150 118, 210 150 C 280 188, 330 240, 398 258"
        fill="none"
        stroke="rgba(245,245,244,0.1)"
        strokeWidth="1.5"
      />
      <path
        className="flow-dash"
        d="M 60 40 C 120 40, 150 118, 210 150 C 280 188, 330 240, 398 258"
        fill="none"
        stroke={COPPER}
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* CTA node */}
      <rect x="366" y="240" width="94" height="34" rx="17" fill="#121214" stroke={COPPER} strokeWidth="1.5" className="flow-node" />
      <text x="413" y="261" textAnchor="middle" fontSize="11" className="fill-foreground font-mono">
        call booked
      </text>

      <text x="60" y="26" fontSize="11" className="fill-foreground/60 font-mono">
        visitor arrives
      </text>
    </svg>
  );
}

// [ 02 ] Chatbots / instant answers: question in, answer out, same minute.
export function GraphicChatbots() {
  return (
    <svg
      viewBox="0 0 560 350"
      className="h-full w-full"
      role="img"
      aria-label="A customer question answered instantly, at any hour"
    >
      <GlowDefs id="chat" />
      <circle cx="400" cy="120" r="90" fill="url(#chat-copper-glow)" />
      <circle cx="140" cy="230" r="85" fill="url(#chat-cool-glow)" />

      {/* incoming question bubble (cool) */}
      <path
        d="M 80 90 h 180 a 10 10 0 0 1 10 10 v 44 a 10 10 0 0 1 -10 10 h -140 l -18 18 v -18 h -22 a 10 10 0 0 1 -10 -10 v -44 a 10 10 0 0 1 10 -10 z"
        fill="#121214"
        stroke={COOL}
        strokeOpacity="0.6"
        strokeWidth="1.5"
      />
      <text x="100" y="117" fontSize="11" className="fill-foreground/70 font-mono">
        &quot;are you open tomorrow,
      </text>
      <text x="100" y="134" fontSize="11" className="fill-foreground/70 font-mono">
        and what would it cost?&quot;
      </text>
      <text x="80" y="76" fontSize="10" className="fill-muted font-mono">
        asked 23:41
      </text>

      {/* connector with pulse */}
      <path d="M 280 154 C 320 180, 330 200, 300 224" fill="none" stroke="rgba(245,245,244,0.1)" strokeWidth="1.5" />
      <path className="flow-dash" d="M 280 154 C 320 180, 330 200, 300 224" fill="none" stroke={COPPER} strokeWidth="2" strokeLinecap="round" />

      {/* reply bubble (copper) */}
      <path
        d="M 300 224 h 180 a 10 10 0 0 1 10 10 v 44 a 10 10 0 0 1 -10 10 h -22 v 18 l -18 -18 h -140 a 10 10 0 0 1 -10 -10 v -44 a 10 10 0 0 1 10 -10 z"
        fill="#121214"
        stroke={COPPER}
        strokeWidth="1.5"
        className="flow-node"
      />
      <text x="320" y="251" fontSize="11" className="fill-foreground/85 font-mono">
        full answer, prices,
      </text>
      <text x="320" y="268" fontSize="11" className="fill-foreground/85 font-mono">
        and a booking link
      </text>
      <text x="418" y="306" fontSize="10" className="fill-accent font-mono">
        answered 23:41
      </text>

      {/* typing dots above reply */}
      <circle cx="310" cy="205" r="3" fill={COPPER} className="blink-a" />
      <circle cx="322" cy="205" r="3" fill={COPPER} className="blink-b" />
      <circle cx="334" cy="205" r="3" fill={COPPER} className="blink-c" />
    </svg>
  );
}

// [ 03 ] Documents & data: the pile gets read, checked, filed.
export function GraphicDocuments() {
  return (
    <svg
      viewBox="0 0 560 350"
      className="h-full w-full"
      role="img"
      aria-label="Documents being read and filed into order automatically"
    >
      <GlowDefs id="doc" />
      <circle cx="280" cy="170" r="95" fill="url(#doc-copper-glow)" />
      <circle cx="460" cy="120" r="70" fill="url(#doc-cool-glow)" />

      {/* messy pile (cool, tilted sheets) */}
      <g transform="rotate(-8 105 190)">
        <rect x="70" y="150" width="70" height="88" rx="6" fill="#121214" stroke={COOL} strokeOpacity="0.35" strokeWidth="1.5" />
      </g>
      <g transform="rotate(5 125 185)">
        <rect x="88" y="142" width="70" height="88" rx="6" fill="#121214" stroke={COOL} strokeOpacity="0.5" strokeWidth="1.5" />
        <line x1="98" y1="162" x2="146" y2="162" stroke={COOL} strokeOpacity="0.35" strokeWidth="1.5" />
        <line x1="98" y1="176" x2="138" y2="176" stroke={COOL} strokeOpacity="0.25" strokeWidth="1.5" />
      </g>
      <text x="78" y="262" fontSize="11" className="fill-foreground/55 font-mono">
        the daily pile
      </text>

      {/* connector into reader */}
      <path d="M 160 186 C 200 186, 210 172, 244 172" fill="none" stroke="rgba(245,245,244,0.1)" strokeWidth="1.5" />
      <path className="flow-dash" d="M 160 186 C 200 186, 210 172, 244 172" fill="none" stroke={COPPER} strokeWidth="2" strokeLinecap="round" />

      {/* central reader with scan line */}
      <rect x="244" y="122" width="86" height="104" rx="10" fill="#121214" stroke={COPPER} strokeWidth="1.5" className="flow-node" />
      <line x1="256" y1="146" x2="318" y2="146" stroke="rgba(245,245,244,0.25)" strokeWidth="1.5" />
      <line x1="256" y1="162" x2="308" y2="162" stroke="rgba(245,245,244,0.18)" strokeWidth="1.5" />
      <line x1="256" y1="178" x2="314" y2="178" stroke="rgba(245,245,244,0.18)" strokeWidth="1.5" />
      <g style={{ transformOrigin: "287px 174px" }} className="scan-line">
        <line x1="250" y1="174" x2="324" y2="174" stroke={COPPER} strokeWidth="2" strokeLinecap="round" opacity="0.9" />
      </g>
      <text x="287" y="246" textAnchor="middle" fontSize="10" className="fill-muted font-mono">
        read &amp; checked
      </text>

      {/* connector out */}
      <path d="M 330 172 C 366 172, 376 158, 404 158" fill="none" stroke="rgba(245,245,244,0.1)" strokeWidth="1.5" />
      <path className="flow-dash flow-dash-delayed" d="M 330 172 C 366 172, 376 158, 404 158" fill="none" stroke={COPPER} strokeWidth="2" strokeLinecap="round" />

      {/* ordered rows appearing */}
      <g className="row-a">
        <rect x="404" y="112" width="110" height="24" rx="6" fill="#121214" stroke={COPPER} strokeOpacity="0.7" strokeWidth="1.5" />
        <line x1="414" y1="124" x2="470" y2="124" stroke={COPPER} strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" />
      </g>
      <g className="row-b">
        <rect x="404" y="146" width="110" height="24" rx="6" fill="#121214" stroke={COPPER} strokeOpacity="0.5" strokeWidth="1.5" />
        <line x1="414" y1="158" x2="486" y2="158" stroke={COPPER} strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" />
      </g>
      <g className="row-c">
        <rect x="404" y="180" width="110" height="24" rx="6" fill="#121214" stroke={COPPER} strokeOpacity="0.35" strokeWidth="1.5" />
        <line x1="414" y1="192" x2="458" y2="192" stroke={COPPER} strokeOpacity="0.45" strokeWidth="2" strokeLinecap="round" />
      </g>
      <text x="404" y="228" fontSize="11" className="fill-foreground/55 font-mono">
        filed, in order
      </text>
    </svg>
  );
}
