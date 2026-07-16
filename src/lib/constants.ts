// Canonical origin for every absolute URL on the site: metadataBase, og:image,
// Organization JSON-LD, sitemap and robots all derive from this one value.
//
// Keeping it in a single place is deliberate. The plan calls out a past
// critical bug where og:image pointed at the wrong origin; a partial swap
// across several files is exactly how that happens.
//
// Domain cutover completed: setframe.net is attached to the Vercel project,
// DNS resolves to it (apex A -> Vercel, www CNAME -> Vercel) and Vercel
// reports configured-correctly with no conflicts. setframe.vercel.app still
// resolves and is kept only as the deployment alias, never as a canonical URL.
export const SITE_URL = "https://setframe.net";

export const CONTACT_EMAIL = "hello@setframe.net"; // TODO: replace once the mailbox is live
export const KVK_NUMBER = "[[ TO FILL ]]"; // TODO: real KVK number once registered
export const LOCATION = "Poland · Netherlands · Worldwide";
