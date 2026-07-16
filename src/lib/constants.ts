// Canonical origin for every absolute URL on the site: metadataBase, og:image,
// Organization JSON-LD, sitemap and robots all derive from this one value.
//
// Keeping it in a single place is deliberate. The plan calls out a past
// critical bug where og:image pointed at the wrong origin; a partial swap
// across several files is exactly how that happens.
//
// DOMAIN CUTOVER: setframe.net is attached to the Vercel project but its DNS
// still points elsewhere. Flip this to "https://setframe.net" ONLY once the
// domain actually resolves to the site, then verify on metatags.io. Flipping
// early points og:image at a dead host, which is worse than the .vercel.app
// origin it uses today.
export const SITE_URL = "https://setframe.vercel.app";

export const CONTACT_EMAIL = "hello@setframe.net"; // TODO: replace once the mailbox is live
export const KVK_NUMBER = "[[ TO FILL ]]"; // TODO: real KVK number once registered
export const LOCATION = "Poland · Netherlands · Worldwide";
