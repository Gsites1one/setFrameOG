// Score tone mapping for the audit report.
//
// Three muted tones that sit next to graphite (#121214) and copper without the
// default saturated traffic-light look:
//   >= 8     sage    #8CA882
//   5 - 7.9  copper  #C77B3F  — the existing accent token. It already reads as
//                               amber, so the middle band needs no new colour.
//   < 5      rust    #CE6B5F
//
// Contrast against graphite was computed, not eyeballed:
//   sage 7.16:1 · copper 5.64:1 · rust 5.25:1 — all three clear WCAG AA for
//   normal text (4.5:1), so they stay legible on badges as well as on the big
//   numeral.
//
// Rust was retuned from a first pick of #C4604E. That version was only 17 deg
// of hue from copper, close enough that "needs work" and "poor" could read as
// the same colour at a glance. #CE6B5F moves to 20 deg of separation AND
// improves contrast (4.57 -> 5.25), so it wins on both axes.
//
// Colour is never the only signal regardless: the overall score is displayed as
// a number and every priority badge carries its own word, so nothing here
// depends on distinguishing two warm tones.
export type ScoreTone = "good" | "mid" | "low";

export const TONE_TEXT: Record<ScoreTone, string> = {
  good: "text-[#8CA882]",
  mid: "text-accent",
  low: "text-[#CE6B5F]",
};

// Badge treatment: tinted fill + matching text + faint matching border, the
// same pattern the rest of the site uses for status pills.
export const TONE_BADGE: Record<ScoreTone, string> = {
  good: "border-[#8CA882]/25 bg-[#8CA882]/15 text-[#8CA882]",
  mid: "border-accent/25 bg-accent/15 text-accent",
  low: "border-[#CE6B5F]/25 bg-[#CE6B5F]/15 text-[#CE6B5F]",
};

export const TONE_BAR: Record<ScoreTone, string> = {
  good: "bg-[#8CA882]",
  mid: "bg-accent",
  low: "bg-[#CE6B5F]",
};

/** Raw values for the SVG score ring, which needs a stroke rather than a class. */
export const TONE_HEX: Record<ScoreTone, string> = {
  good: "#8CA882",
  mid: "#C77B3F",
  low: "#CE6B5F",
};

export function toneForScore(score: number): ScoreTone {
  if (score >= 8) return "good";
  if (score >= 5) return "mid";
  return "low";
}

/**
 * High / Medium / Low priority reuses the same three tones rather than
 * introducing a fourth colour. Note the inversion: a HIGH priority item is the
 * one costing the most, so it takes the rust tone, and a low-priority item
 * takes sage.
 */
export function toneForPriority(priority: string): ScoreTone {
  const p = String(priority ?? "").trim().toLowerCase();
  if (p.startsWith("high")) return "low";
  if (p.startsWith("med")) return "mid";
  return "good";
}
