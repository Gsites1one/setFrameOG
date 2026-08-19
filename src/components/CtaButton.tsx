"use client";

import { useRef } from "react";
import Link from "next/link";
import { m, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

type CtaButtonProps = {
  size?: "sm" | "lg";
  className?: string;
  /**
   * Button text. Defaults to the standard CTA; the homepage's closing band
   * passes "Contact us" (Iteration 8, Task 2) so the last thing on the page
   * asks plainly instead of repeating the hero's wording.
   */
  label?: string;
  /**
   * Render a real <button type="submit"> instead of a link to /contact.
   * Added for /webcriticapp's form: that page needs the site's primary button
   * to submit a form rather than navigate, and cloning the class string into a
   * second component is exactly how two buttons drift apart. Everything else —
   * shape, magnet, hover glow, Syne label — is shared.
   */
  submit?: boolean;
  disabled?: boolean;
  /**
   * Stretch to the container's width. Needed by the contact form, whose submit
   * button spans the form (Iteration 10, Task 2). It is a prop rather than a
   * `className="w-full"` at the call site because the magnet wrapper below is
   * `inline-block` and shrink-wraps — w-full on the button alone would resolve
   * against a wrapper that is already only as wide as the label, so the button
   * would not grow at all. Both elements have to change together.
   */
  fullWidth?: boolean;
};

// One source of truth for the primary button's look. Both the link form and
// the submit form render this identical string.
//
// The LABEL uses --color-accent-text, not the brand copper (Iteration 11): at
// 14px it is normal text and needs 4.5:1, which brand copper cannot hold once
// the aurora sits behind it. The BORDER and glow stay brand copper — they are
// UI, judged at 3:1. Hover brightens one step further than the new resting
// value so the four-channel hover still reads as brightening.
const BUTTON_CLASSES =
  "inline-flex items-center justify-center rounded-full border border-accent/50 font-display font-semibold tracking-wide text-accent-text transition-[color,background-color,border-color,box-shadow] duration-300 hover:border-accent hover:bg-accent/15 hover:text-[#f2cfa8] hover:shadow-[0_0_26px_-4px_rgba(199,123,63,0.6)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-accent/50 disabled:hover:bg-transparent disabled:hover:text-accent-text disabled:hover:shadow-none";

const SIZE_CLASSES: Record<NonNullable<CtaButtonProps["size"]>, string> = {
  sm: "px-4 py-1.5 text-xs",
  lg: "px-6 py-3 text-sm",
};

const MAGNET_STRENGTH = 0.3; // fraction of cursor offset the button follows

// The [ ] motif is now reserved for the brand mark alone (Iteration 8, Task 2)
// — no CTA button carries it. The brief named three instances (hero, nav, the
// homepage closing band), but this shared component actually renders in seven
// places once /services, /about and /knowledge are counted; bracketing those
// while the three named ones went plain would have read as a bug, so the
// brackets are gone from the component itself rather than per-instance.
export function CtaButton({
  size = "lg",
  className = "",
  label = "Start a conversation",
  submit = false,
  disabled = false,
  fullWidth = false,
}: CtaButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 250, damping: 18 });
  const springY = useSpring(y, { stiffness: 250, damping: 18 });

  // Cache the rect on enter so the magnet handler never reads layout per move.
  const onPointerEnter = () => {
    if (ref.current) rectRef.current = ref.current.getBoundingClientRect();
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (shouldReduceMotion || e.pointerType !== "mouse" || !rectRef.current) return;
    const rect = rectRef.current;
    x.set((e.clientX - rect.left - rect.width / 2) * MAGNET_STRENGTH);
    y.set((e.clientY - rect.top - rect.height / 2) * MAGNET_STRENGTH);
  };

  const onPointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <m.div
      ref={ref}
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{ x: springX, y: springY }}
      className={fullWidth ? "block w-full" : "inline-block"}
    >
      {/* The label is set in font-display (Syne), matching every other button
          on the site. Hover brightens on four channels at once — border, fill,
          text and an outward copper glow — because an earlier state only
          changed border and fill, which was easy to miss and was being
          swallowed entirely while the hero scrim overlapped this button.
          transition covers box-shadow too, or the glow would snap on. */}
      {submit ? (
        <button
          type="submit"
          disabled={disabled}
          className={`${BUTTON_CLASSES} ${SIZE_CLASSES[size]} ${
            fullWidth ? "w-full" : ""
          } ${className}`}
        >
          {label}
        </button>
      ) : (
        <Link
          href="/contact"
          className={`${BUTTON_CLASSES} ${SIZE_CLASSES[size]} ${
            fullWidth ? "w-full" : ""
          } ${className}`}
        >
          {label}
        </Link>
      )}
    </m.div>
  );
}
