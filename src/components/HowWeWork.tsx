import { Reveal } from "./Reveal";

// Buyer-perspective steps, framed as question -> answer for AEO.
const STEPS = [
  {
    number: "[ 01 ]",
    question: "Where does it start?",
    answer:
      "A conversation, not a pitch. We find where your business leaks time, leads or follow-up, and what stopping that is worth.",
  },
  {
    number: "[ 02 ]",
    question: "What do I see before committing?",
    answer:
      "A working preview. You see the direction with your own eyes before anything is signed, so there is nothing to take on faith.",
  },
  {
    number: "[ 03 ]",
    question: "When do results show up?",
    answer:
      "Launch lands in weeks, not months. Then the system keeps working: replying, reminding and booking while you run the business.",
  },
];

export function HowWeWork() {
  return (
    <section id="how" className="mx-auto max-w-5xl px-6 py-24">
      <Reveal>
        <div className="mb-10 flex items-baseline gap-4">
          <span className="font-mono text-sm text-accent">[ 03 ]</span>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            How working together goes.
          </h2>
        </div>
      </Reveal>

      <div className="grid gap-10 md:grid-cols-3">
        {STEPS.map((step, i) => (
          <Reveal key={step.number} delay={i * 0.12}>
            <div className="border-t border-accent/30 pt-5">
              <span className="font-mono text-sm text-accent">{step.number}</span>
              <h3 className="mt-3 font-display text-lg font-semibold">
                {step.question}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/70">
                {step.answer}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
