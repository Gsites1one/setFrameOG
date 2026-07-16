type SectionNumberProps = {
  /** Two-digit number, e.g. "01". */
  number: string;
  title: string;
};

// Section mark (P7.2): an oversized low-opacity mono numeral sitting behind
// the title like a watermark, plus a short copper hairline rule that draws in
// on section-enter. No brackets — the [ ] motif is reserved for logo + buttons.
//
// The rule is a CSS scaleX transition driven by the shared RevealObserver, so
// this is server-rendered markup with no client JS. It was a Framer Motion
// component per section purely to animate one hairline. Reduced motion renders
// the rule fully drawn.
export function SectionNumber({ number, title }: SectionNumberProps) {
  return (
    <div className="relative mb-10">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-1 -top-10 select-none font-mono text-7xl font-medium leading-none text-foreground/[0.06] sm:text-8xl"
      >
        {number}
      </span>
      <div className="relative">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">{title}</h2>
        <div
          aria-hidden="true"
          data-reveal="rule"
          className="mt-4 h-px w-16 origin-left bg-accent"
        />
      </div>
    </div>
  );
}
