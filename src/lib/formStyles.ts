// Shared form styling. Extracted from ContactForm (where it had lived as a
// local constant) so /webcriticapp's inputs are provably the same treatment
// rather than a second set of classes that drift apart over time.
export const FIELD_CLASSES =
  "w-full rounded-lg border border-white/10 bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted outline-none transition-colors focus:border-accent/60";

// Inline validation / hint text, matching the ValidationError treatment the
// contact form already uses.
export const FIELD_ERROR_CLASSES = "mt-1.5 block text-xs text-accent";

// Field label, matching the contact form's label treatment.
export const FIELD_LABEL_CLASSES =
  "mb-1.5 block font-mono text-xs tracking-wide text-foreground/60";
