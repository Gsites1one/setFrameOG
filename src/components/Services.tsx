import { Reveal } from "./Reveal";
import { SpotlightCard } from "./SpotlightCard";

const SERVICES = [
  {
    number: "[ 01 ]",
    title: "Websites that turn visitors into booked calls",
    body: "People land on your site already comparing. A credible, fast site makes the next step obvious and easy to take.",
  },
  {
    number: "[ 02 ]",
    title: "Content that keeps working after you post it",
    body: "Structured pages and publishing flows that compound over time. One offer, one page, one clear action.",
  },
  {
    number: "[ 03 ]",
    title: "Follow-up that never forgets",
    body: "Quiet systems that reply, remind and book while you work. The leads you already pay for stop slipping away.",
  },
];

export function Services() {
  return (
    <section id="services" className="mx-auto max-w-5xl px-6 py-24">
      <Reveal>
        <div className="mb-10 flex items-baseline gap-4">
          <span className="font-mono text-sm text-accent">[ 02 ]</span>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            What gets built.
          </h2>
        </div>
      </Reveal>

      <div className="grid gap-6 md:grid-cols-3">
        {SERVICES.map((service, i) => (
          <Reveal key={service.number} delay={i * 0.12}>
            <SpotlightCard className="h-full">
              <div className="flex h-full flex-col p-6">
                <span className="font-mono text-sm text-accent">
                  {service.number}
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold leading-snug">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground/70">
                  {service.body}
                </p>
              </div>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
