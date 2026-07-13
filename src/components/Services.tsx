import { Reveal } from "./Reveal";
import { SpotlightCard } from "./SpotlightCard";
import {
  GraphicChatbots,
  GraphicDocuments,
  GraphicWebsites,
} from "./ServiceGraphics";

const SERVICES = [
  {
    number: "[ 01 ]",
    title: "Websites that turn visitors into booked calls",
    body: "People land on your site already comparing. A credible, fast site makes the next step obvious and easy to take.",
    Graphic: GraphicWebsites,
  },
  {
    number: "[ 02 ]",
    title: "Answers the moment someone asks",
    body: "Questions get answered instantly, day or night, with prices and a booking link included. Warm conversations reach you, cold ones stop costing time.",
    Graphic: GraphicChatbots,
  },
  {
    number: "[ 03 ]",
    title: "Paperwork that reads itself",
    body: "Invoices, forms and documents get read, checked and filed the moment they arrive. The information shows up where you need it.",
    Graphic: GraphicDocuments,
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
              <div className="flex h-full flex-col">
                <div className="aspect-[16/10] border-b border-white/10">
                  <service.Graphic />
                </div>
                <div className="flex flex-1 flex-col p-6">
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
              </div>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
