import { FAQ_ITEMS } from "@/lib/faq";
import { Reveal } from "./Reveal";

export function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-24">
      <Reveal>
        <div className="mb-10 flex items-baseline gap-4">
          <span className="font-mono text-sm text-accent">[ 04 ]</span>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Questions, answered directly.
          </h2>
        </div>
      </Reveal>

      <div className="space-y-3">
        {FAQ_ITEMS.map((item, i) => (
          <Reveal key={item.question} delay={i * 0.06}>
            <details className="group rounded-xl border border-white/10 bg-surface transition-colors hover:border-accent/40 open:border-accent/40">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-display text-base font-semibold [&::-webkit-details-marker]:hidden">
                {item.question}
                <span
                  aria-hidden="true"
                  className="font-mono text-accent transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="px-5 pb-5 text-sm leading-relaxed text-foreground/70">
                {item.answer}
              </p>
            </details>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
