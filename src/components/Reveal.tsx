import type { CSSProperties } from "react";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Stagger, in seconds. */
  delay?: number;
};

// Section-level fade-in on scroll: triggers once, subtle upward translate.
//
// Deliberately NOT a client component. This used to be a Framer Motion
// `whileInView` component, and with 15 instances on the homepage it was a
// meaningful share of hydration work (Total Blocking Time) for an effect CSS
// does natively. It is now plain server-rendered markup; RevealObserver adds
// `.is-visible` from a single shared IntersectionObserver. Identical result,
// no per-instance JS.
export function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  return (
    <div
      data-reveal="fade"
      className={className}
      style={delay ? ({ "--reveal-delay": `${delay}s` } as CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}
