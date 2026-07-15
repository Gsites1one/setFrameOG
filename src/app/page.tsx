import { About } from "@/components/About";
import { ApproachBand } from "@/components/ApproachBand";
import { Faq } from "@/components/Faq";
import { FinalCta } from "@/components/FinalCta";
import { FloatingNav } from "@/components/FloatingNav";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HowWeWork } from "@/components/HowWeWork";
import { Services } from "@/components/Services";
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
        <Work />
        <Services />
        {/* Proof block deferred: no real metric yet, no fabricated quote. */}
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
