import type { Metadata } from "next";
import { Syne, Inter, IBM_Plex_Mono } from "next/font/google";
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

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500"],
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
  areaServed: ["Poland", "Netherlands", "Worldwide"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${inter.variable} ${ibmPlexMono.variable}`}
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
