// Tiny per-step process motif (P7.3), thematically matched to each step:
//  - conversation: three typing dots exchanging (step 01, "a conversation").
//  - preview: a small frame with a scan line drawing down it (step 02, "a
//    working preview").
//  - ongoing: a steady core with an expanding pulse ring (step 03, "the
//    system keeps working").
// ~24px, transform/opacity only. The `active` flag pauses the animation when
// the step is not the active one (CSS gate in globals.css). Decorative.

type StepMotifProps = {
  type: "conversation" | "preview" | "ongoing";
  active: boolean;
};

export function StepMotif({ type, active }: StepMotifProps) {
  return (
    <span
      className="step-motif inline-flex text-accent"
      data-active={active ? "true" : "false"}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        {type === "conversation" && (
          <>
            <circle cx="5" cy="12" r="2" fill="currentColor" className="motif-typing" style={{ animationDelay: "0s" }} />
            <circle cx="12" cy="12" r="2" fill="currentColor" className="motif-typing" style={{ animationDelay: "0.2s" }} />
            <circle cx="19" cy="12" r="2" fill="currentColor" className="motif-typing" style={{ animationDelay: "0.4s" }} />
          </>
        )}

        {type === "preview" && (
          <>
            <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" opacity="0.45" />
            <line x1="6" y1="8" x2="18" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="motif-scan" />
          </>
        )}

        {type === "ongoing" && (
          <>
            <circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" className="motif-ring" />
            <circle cx="12" cy="12" r="2.5" fill="currentColor" className="motif-core" />
          </>
        )}
      </svg>
    </span>
  );
}
