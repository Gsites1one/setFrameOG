import { Reveal } from "./Reveal";

// Concrete proof over decoration. Real data is not in yet, so every value is
// marked [[ TO FILL ]] for the user to replace. No stock logos.
// TODO: replace all [[ TO FILL ]] tokens with real metric, result and quote.
const TOFILL = "text-foreground/40 [font-variant-ligatures:none]";

export function ProofBlock() {
  return (
    <section aria-label="Proof" className="mx-auto max-w-5xl px-6 py-16">
      <Reveal>
        <div className="grid gap-8 rounded-2xl border border-white/10 bg-surface/60 p-8 md:grid-cols-3 md:gap-6">
          {/* Metric */}
          <div>
            <p className="font-mono text-4xl font-medium text-accent">
              <span className={TOFILL}>[[ 00% ]]</span>
            </p>
            <p className="mt-2 font-mono text-xs leading-relaxed text-foreground/60">
              <span className={TOFILL}>[[ metric label, e.g. more calls booked ]]</span>
            </p>
          </div>

          {/* Named result */}
          <div className="md:border-l md:border-white/10 md:pl-6">
            <p className="font-mono text-sm text-foreground/85">Aura Capital</p>
            <p className="mt-2 font-mono text-xs leading-relaxed text-foreground/60">
              <span className={TOFILL}>
                [[ one concrete result, e.g. redesigned site, consultations up ]]
              </span>
            </p>
          </div>

          {/* Quote */}
          <div className="md:border-l md:border-white/10 md:pl-6">
            <p className="font-mono text-xs leading-relaxed text-foreground/85">
              <span className={TOFILL}>
                &ldquo;[[ one-line client quote ]]&rdquo;
              </span>
            </p>
            <p className="mt-2 font-mono text-xs text-foreground/50">
              <span className={TOFILL}>[[ name, role ]]</span>
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
