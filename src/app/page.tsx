import { FloatingNav } from "@/components/FloatingNav";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { WorkMarquee } from "@/components/WorkMarquee";

export default function Home() {
  return (
    <>
      <FloatingNav />
      <main>
        <Hero />
        <WorkMarquee />
        <Services />
      </main>
    </>
  );
}
