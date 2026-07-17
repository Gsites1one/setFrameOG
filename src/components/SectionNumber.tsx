type SectionNumberProps = {
  /** Two-digit number, e.g. "01". */
  number: string;
  title: string;
};

// Section mark: a ghost numeral above the title, plus a short copper hairline
// rule that draws in on section-enter. No brackets — the [ ] motif is reserved
// for logo + buttons.
//
// P9: the numeral is in normal flow ABOVE the heading (previously an absolute
// watermark behind it), so it can never overlap the heading or body text at
// any breakpoint. It stays faint, reading as a quiet ghost marker.
//
// The rule is a CSS scaleX transition driven by the shared RevealObserver, so
// this is server-rendered markup with no client JS. Reduced motion renders the
// rule fully drawn.
export function SectionNumber({ number, title }: SectionNumberProps) {
  return (
    <div className="mb-10">
      <span
        aria-hidden="true"
        className="block select-none font-mono text-5xl font-medium leading-none text-foreground/[0.12] sm:text-6xl"
      >
        {number}
      </span>
      <h2 className="mt-3 font-display text-2xl font-bold sm:text-3xl">{title}</h2>
      <div
        aria-hidden="true"
        data-reveal="rule"
        className="mt-4 h-px w-16 origin-left bg-accent"
      />
    </div>
  );
}
