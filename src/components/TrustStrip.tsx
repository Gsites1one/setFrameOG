// Three checkable facts, sitting next to the two highest-intent buttons on the
// site (Iteration 10, Task 4).
//
// Every line here is already stated in prose somewhere on the site — this is a
// layout change, not a new claim, which is what keeps it inside the standing
// honesty rule (no client history, no measured result, nothing SetFrame has not
// already promised in its own words):
//
//   "Fixed scope and price"        <- FAQ, "How do you price projects?":
//                                     "Fixed price per project, agreed before
//                                      any work starts."
//   "Direct to the person who
//    builds it"                    <- ContactReasons, "One person, full
//                                     accountability": "You talk directly to
//                                     the person who designs and builds your
//                                     project."
//   "Reply within one business
//    day"                          <- /contact intro and the form's success
//                                     state: "You will hear back within one
//                                     business day."
//
// The point is the packaging. Stated as three short, scannable, checkable
// facts they read as specifics; stated as three paragraphs elsewhere on the
// page they read as reassurance the visitor skims past. No em-dashes (copy
// rule); mono at 70% opacity so it reads as a spec line rather than more
// marketing, consistent with the hero's proof bar.
//
// Server component, no client JS, no animation — it sits next to a CTA and
// must never be the reason a CTA is slow to become interactive.

const FACTS = [
  "Fixed scope and price",
  "Direct to the person who builds it",
  "Reply within one business day",
];

export function TrustStrip({ className = "" }: { className?: string }) {
  return (
    <ul
      className={`flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-xs tracking-wide text-foreground/70 ${className}`}
    >
      {FACTS.map((fact) => (
        <li key={fact} className="flex items-center gap-2">
          {/* Same copper node the Eyebrow uses, one step smaller. Decorative:
              the list semantics already separate the items for assistive tech. */}
          <span
            aria-hidden="true"
            className="h-1 w-1 shrink-0 rounded-full bg-accent shadow-[0_0_6px_1px_rgba(199,123,63,0.5)]"
          />
          {fact}
        </li>
      ))}
    </ul>
  );
}
