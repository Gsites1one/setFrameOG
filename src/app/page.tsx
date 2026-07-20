import { About } from "@/components/About";
import { ApproachBand } from "@/components/ApproachBand";
import { Faq } from "@/components/Faq";
import { FinalCta } from "@/components/FinalCta";
import { FloatingNav } from "@/components/FloatingNav";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HowWeWork } from "@/components/HowWeWork";
import { CapabilityMarquee } from "@/components/CapabilityMarquee";
import { Foundation } from "@/components/Foundation";
import { Work } from "@/components/Work";
import { FAQ_ITEMS } from "@/lib/faq";

// FAQPage structured data so answer engines can cite the FAQ directly.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function Home() {
  return (
    <>
      <FloatingNav />
      <main>
        <Hero />
        {/* 01 The foundation (three pillars) grounds the visitor before the
            breadth strip lists specifics; then the proof (Work). Iteration 4. */}
        <Foundation />
        <CapabilityMarquee />
        <Work />
        <HowWeWork />
        <About />
        <ApproachBand />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
