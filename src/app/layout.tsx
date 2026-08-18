import type { Metadata } from "next";
import { Syne, Inter, Space_Mono } from "next/font/google";
import { FloatingNav } from "@/components/FloatingNav";
import { IntroCurtain } from "@/components/IntroCurtain";
import { LifeBackground } from "@/components/LifeBackground";
import { MotionProvider } from "@/components/MotionProvider";
import { RevealObserver } from "@/components/RevealObserver";
import { CONTACT_EMAIL, SITE_URL } from "@/lib/constants";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Space Mono replaces IBM Plex Mono sitewide (Iteration 8, Task 1). Two earlier
// iterations tried to fix the uneven letter rendering as a loading or CSS bug
// and both times measurement cleared the loading path — the font resolved, the
// weight was right, there were no stray feature-settings. The unevenness was
// the typeface's own letterforms (the oversized Q in "FAQ" being the clearest
// tell), so the fix is to change the face rather than keep debugging it.
//
// Space Mono ships 400 and 700 only — there is no 500, so nothing anywhere
// should ask for `font-medium` on this token or the browser has to pick a
// neighbour. The three ghost numerals that did were moved to font-normal.
const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  weight: ["400", "700"],
  display: "swap",
});

// SITE_URL is the single source for every absolute URL (see lib/constants.ts
// for the domain-cutover note).

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "SetFrame — Websites and systems that run your business",
  description:
    "SetFrame builds websites and systems that catch what your business quietly loses and turn it into movement.",
  openGraph: {
    title: "SetFrame — Websites and systems that run your business",
    description:
      "SetFrame builds websites and systems that catch what your business quietly loses and turn it into movement.",
    url: SITE_URL,
    siteName: "SetFrame",
    type: "website",
  },
};

// Site-wide Organization structured data for search and answer engines.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SetFrame",
  url: SITE_URL,
  logo: `${SITE_URL}/brand/wordmark-white.png`,
  email: CONTACT_EMAIL,
  // Impersonal, matching the About copy (owner decision: no founder framing).
  // Answer engines quote this verbatim, so it must not contradict the site.
  description:
    "A studio that builds websites and the systems behind them for businesses that run on inquiries, appointments and follow-up.",
  // No city on the brand (owner decision) — reach is stated as areaServed.
  // Order matches the footer's visible LOCATION text exactly.
  areaServed: ["Poland", "Netherlands", "Worldwide"],
  // The single, real contact channel on the site (the same address the footer
  // and contact form use). Kept minimal on purpose: no phone (there is no
  // public number), no availableLanguage (the site is English-only, so Polish
  // would be a claim nothing on the page supports), and no sameAs (no live
  // social profiles exist yet). Every one of those would be fabricated data.
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: CONTACT_EMAIL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning is scoped to this ONE element and is the
    // standard fix for this exact pattern, not a blanket silencer. The inline
    // script in <body> below runs classList.add("js") on <html> before React
    // hydrates, so the server sends three font-variable classes and the client
    // finds those three plus "js" — verified by diffing the two directly:
    // server "syne... inter... space_mono...", client the same plus "js".
    // React then reports an attribute mismatch on every route in dev. The
    // mismatch is intentional and the class must be applied before body parses
    // (that is the whole point — reveals only start hidden when something can
    // reveal them), so the attribute is exactly what this prop exists for. It
    // suppresses the warning for this element's own attributes only; children
    // are still fully hydration-checked.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${syne.variable} ${inter.variable} ${spaceMono.variable}`}
    >
      <body className="font-sans bg-background text-foreground antialiased">
        {/* Marks JS as available before body content parses, so scroll reveals
            only start hidden when something can actually reveal them (runs
            inline and synchronously, so there is no flash).

            The timer is a failsafe: reveals are hidden by CSS from first paint,
            so if RevealObserver never mounts (a hydration error, a chunk that
            fails to load) every section below the fold would stay invisible
            forever. If nothing has armed within 4s, drop the class and show the
            page. Costs nothing on a healthy load. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "var d=document.documentElement;d.classList.add('js');" +
              "setTimeout(function(){if(d.dataset.revealsArmed!=='1')d.classList.remove('js')},4000)",
          }}
        />
        <RevealObserver />
        <MotionProvider>
          <LifeBackground />
          <IntroCurtain />
          {/* Site-wide as of Iteration 6, Task 8: it used to be mounted only
              on the homepage, which left /services, /about, /knowledge and
              /contact with no way to reach the rest of the site except the
              back link. It must sit inside MotionProvider — NavWordmark
              animates through LazyMotion. */}
          <FloatingNav />
          {children}
        </MotionProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
      </body>
    </html>
  );
}
