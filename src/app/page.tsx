import { Faq } from "@/components/Faq";
import { FloatingNav } from "@/components/FloatingNav";
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
        <HowWeWork />
        <Faq />
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
