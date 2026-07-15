// Single source of truth for portfolio + systems content.
//
// Two distinct shapes now:
//  - WEBSITE_PROJECT: one consolidated website project shown as two prototypes.
//  - SYSTEM_TILES: the scrolling systems strip on the homepage AND the
//    per-tile depth sections on /knowledge (each tile's `slug` is the anchor
//    the strip links to: /knowledge#<slug>).

/* ─────────────────────────── Website work ─────────────────────────── */

export type WebsitePrototype = {
  slug: string;
  /** "Prototype 01" etc. — shown as a small label in the mockup. */
  label: string;
  name: string;
  outcome: string;
  /** Live deployment (opens in a new tab). */
  url: string;
  /** Example-style domain shown in the mockup address bar. */
  displayUrl: string;
  image: string;
  alt: string;
};

export const WEBSITE_PROJECT: {
  name: string;
  concept: string;
  prototypes: WebsitePrototype[];
} = {
  name: "Independent financial advisory",
  concept:
    "One brief, two working prototypes for an independent financial advisory firm. Each turns a first-time visitor into a booked consultation, a different way.",
  prototypes: [
    {
      slug: "aura-capital",
      label: "Prototype 01",
      name: "Aura Capital",
      outcome:
        "Calm, editorial planning site positioned to book consultations.",
      url: "https://auracapitalv1.vercel.app",
      displayUrl: "auracapital.com",
      image: "/work/aura-capital.webp",
      alt: "Homepage of the Aura Capital financial planning website, headline Wealth with intention",
    },
    {
      slug: "project-aura",
      label: "Prototype 02",
      name: "Project Aura",
      outcome:
        "A dark, modern advisory experience with live portfolio storytelling.",
      url: "https://bolt-tryouts-finacial-advisor-v2.vercel.app",
      displayUrl: "projectaura.net",
      image: "/work/financial-advisor.webp",
      alt: "Homepage of a dark themed financial advisor website with a live portfolio overview card",
    },
  ],
};

/* ─────────────────────────── Systems ─────────────────────────── */

export type SystemTile = {
  slug: string;
  name: string;
  /** Short caption on the strip tile. */
  tagline: string;
  image: string;
  alt: string;
  /**
   * Depth shown on /knowledge. Omitted for the SaaS concept tile, which
   * links to the dedicated "What is SaaS?" explainer section instead.
   */
  knowledge?: {
    whatItIs: string;
    theLeak: string;
    whatClientSees: string;
  };
  /** The plain-language concept tile ("What is SaaS?"). */
  concept?: boolean;
};

// Capability tiles: the kinds of systems SetFrame builds. Framed as service
// types (never as a specific client's measured results), so nothing here
// needs a fabricated metric. If a specific number is ever added, tag it
// [[REVIEW]] so the owner signs off before it ships.
export const SYSTEM_TILES: SystemTile[] = [
  {
    slug: "response-system",
    name: "Client Response System",
    tagline: "Every inquiry answered in seconds.",
    image: "/systems/response-system.webp",
    alt: "Illustration of a central dashboard node wired to a chip network, representing an automated response system",
    knowledge: {
      whatItIs:
        "An always-on responder that greets every inquiry the moment it lands, by form, chat or message, and points it to the right next step.",
      theLeak:
        "Leads that arrive after hours or during a busy day go cold before anyone replies. The slowest reply usually loses the job.",
      whatClientSees:
        "Every enquiry gets an instant, on-brand first reply, a logged record, and a gentle follow-up if the person goes quiet. Nothing sits unanswered.",
    },
  },
  {
    slug: "lead-capture",
    name: "Lead Capture",
    tagline: "Turn visitors into named leads.",
    image: "/systems/lead-capture.webp",
    alt: "Illustration of a glowing point traveling along a curved path into a screen, representing a visitor becoming a captured lead",
    knowledge: {
      whatItIs:
        "A short, fast path that turns an interested visitor into a named lead with the details you actually need.",
      theLeak:
        "Visitors who were ready to talk leave because the form was long, unclear, or asked for too much too soon.",
      whatClientSees:
        "Focused capture points that fill the inbox with real prospects instead of noise.",
    },
  },
  {
    slug: "booking-flow",
    name: "Booking Flow",
    tagline: "Let people book themselves in.",
    image: "/systems/booking-flow.webp",
    alt: "Illustration of a calendar on a platform with a glowing path curving toward it, representing self-serve booking",
    knowledge: {
      whatItIs:
        "A self-serve booking path that lets people pick a time and confirm without a single back-and-forth email.",
      theLeak:
        "Every 'what times are you free?' exchange adds delay, and some people give up before a slot is agreed.",
      whatClientSees:
        "A calendar that fills itself, with reminders so fewer people forget the appointment.",
    },
  },
  {
    slug: "document-intake",
    name: "Document Intake",
    tagline: "Paperwork that files itself.",
    image: "/systems/document-intake.webp",
    alt: "Illustration of a stack of documents connected by a glowing line to an ordered set of blocks, representing automated document intake",
    knowledge: {
      whatItIs:
        "A system that reads incoming documents, pulls out the key details, and files them where they belong.",
      theLeak:
        "Invoices, forms and paperwork pile up and get keyed in by hand, which is slow and easy to get wrong.",
      whatClientSees:
        "Documents arrive and sort themselves, with the important numbers already where you need them.",
    },
  },
  {
    slug: "automation-hub",
    name: "Automation Hub",
    tagline: "Repetitive work, handled for you.",
    image: "/systems/automation-hub.webp",
    alt: "Illustration of a radiating gear hub connected to smaller nodes, representing business process automation",
    knowledge: {
      whatItIs:
        "A quiet hub that handles the repetitive follow-ups, reminders and hand-offs your team does by hand today.",
      theLeak:
        "Routine tasks eat hours and slip when everyone is busy. The work that gets forgotten is usually the follow-up.",
      whatClientSees:
        "Reminders, follow-ups and updates happen on their own, on time, every time.",
    },
  },
  {
    slug: "system-map",
    name: "System Map",
    tagline: "Every process, out of your head.",
    image: "/systems/system-map.webp",
    alt: "Illustration of a network board with mapped nodes and connections, representing a business's systemized processes",
    knowledge: {
      whatItIs:
        "A clear map of how your business actually runs, so every process is written down instead of living in one person's head.",
      theLeak:
        "When a process depends on someone's memory, it breaks the moment they are away.",
      whatClientSees:
        "Every step documented and connected, so the business keeps moving without you holding it together.",
    },
  },
  {
    slug: "saas",
    name: "What is SaaS?",
    tagline: "New to this? Start here.",
    image: "/systems/saas.webp",
    alt: "Illustration of a glowing data block sending a trail of light to a small house, representing software delivered as a service",
    concept: true,
  },
];
