import type { Metadata } from "next";
import { Syne, Inter, IBM_Plex_Mono } from "next/font/google";
import { IntroCurtain } from "@/components/IntroCurtain";
import { LifeBackground } from "@/components/LifeBackground";
import { MotionProvider } from "@/components/MotionProvider";
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

// Absolute URLs for OG/structured data. TODO: confirmed target domain.
const SITE_URL = "https://setframe.net";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "SetFrame — Websites and systems that quietly run your business",
  description:
    "SetFrame builds websites and systems that catch what your business quietly loses and turn it into movement.",
  openGraph: {
    title: "SetFrame — Websites and systems that quietly run your business",
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
  email: "hello@setframe.net",
  description:
    "Founder-operated studio building websites and business systems for companies that run on inquiries, appointments and follow-up.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Tilburg",
    addressRegion: "Noord-Brabant",
    addressCountry: "NL",
  },
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
