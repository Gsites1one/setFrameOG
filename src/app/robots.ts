import type { MetadataRoute } from "next";

// Matches the SITE_URL used for metadataBase in layout.tsx — see the TODO
// there about swapping to setframe.net once that domain is live.
const SITE_URL = "https://setframe.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
