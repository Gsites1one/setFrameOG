// Single source of truth for portfolio + capability content.
//
// Two distinct shapes:
//  - WEBSITE_PROJECT: the one real portfolio case study (two prototypes),
//    shown in the Work section as actual delivered-work proof.
//  - CAPABILITIES: the broad range of what gets built, shown as one
//    consistently-illustrated gallery (Services section) AND as the deeper
//    per-capability sections on /knowledge (each slug is the anchor).
//    Every headline leads with the pain a visitor already feels; the
//    mechanism that solves it stays in the supporting line, never the
//    headline (Iteration 3, Constraint 6).

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

/* ─────────────────────────── Capabilities ─────────────────────────── */

export type Capability = {
  slug: string;
  /**
   * Plain-language capability name — shown as the H2 on /knowledge, where a
   * named heading is the right frame for a deeper technical page. NOT shown
   * on the Services gallery card itself: that card's headline must lead with
   * the pain (below), never the mechanism name (Iteration 3, Constraint 6).
   */
  name: string;
  /** Pain-led headline — what the visitor already feels. Shown on the card. */
  headline: string;
  /** Mechanism/outcome — the payoff, shown as the supporting line. */
  outcome: string;
  image: string;
  alt: string;
  knowledge: {
    whatItIs: string;
    theLeak: string;
    whatClientSees: string;
  };
};

// The full range of what gets built. Every card gets identical visual
// treatment (full illustration, same anatomy) — breadth is represented by
// showing all of it well, not by trimming to a tidy small number.
export const CAPABILITIES: Capability[] = [
  {
    slug: "websites",
    name: "Websites that convert",
    headline: "Visitors browse and leave without booking a call.",
    outcome:
      "The same traffic starts booking calls instead of leaving.",
    image: "/systems/site-conversion.jpg",
    alt: "Isometric illustration of a screen-like panel with a search bar and data lines, wired to glowing connector nodes, representing a website built to convert",
    knowledge: {
      whatItIs:
        "A site built specifically to turn a first-time visitor into a booked call, not just to look good.",
      theLeak:
        "Visitors compare you against everyone else in seconds. A slow or unclear site loses that comparison before you get a chance to talk to them.",
      whatClientSees:
        "A fast, credible site where the next step is obvious, and a working preview you can see before anything is signed.",
    },
  },
  {
    slug: "response-booking",
    name: "Automated response and booking",
    headline: "Leads go cold while you're busy with something else.",
    outcome:
      "Replies land in seconds instead of hours, day or night.",
    image: "/systems/instant-reply.jpg",
    alt: "Isometric illustration of a glowing envelope icon with a clock beside it and pulsing rings beneath, wired to connector nodes, representing an instant automated reply",
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
    slug: "document-processing",
    name: "Document processing",
    headline: "Hours lost every week to paperwork and admin.",
    outcome:
      "A morning of paperwork each week comes back as minutes.",
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
    slug: "lead-capture",
    name: "Lead capture",
    headline: "Visitors leave without any way to follow up with them.",
    outcome: "Visitors you could never name become contacts you can reach.",
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
    slug: "outreach",
    name: "High-volume personalized outreach",
    headline: "Not enough new clients coming in.",
    outcome:
      "Hundreds of the right prospects hear from you every week, personally.",
    image: "/systems/outreach-scale.jpg",
    alt: "Isometric illustration of a central glowing cube radiating many thin connector lines to a wide ring of smaller nodes, representing outreach sent at scale to many individual prospects",
    knowledge: {
      whatItIs:
        "A system that reaches large numbers of prospects with messages personalized to each one, instead of one generic blast.",
      theLeak:
        "Personalizing outreach by hand does not scale, and generic blasts get ignored or marked as spam.",
      whatClientSees:
        "Consistent daily contact with hundreds or thousands of prospects, each message speaking to that specific person or business.",
    },
  },
  {
    slug: "ecommerce",
    name: "E-commerce",
    headline: "Losing sales because there's no way to buy outside business hours.",
    outcome: "Orders arrive overnight and at weekends, while you sleep.",
    image: "/systems/storefront-cycle.jpg",
    alt: "Isometric illustration of a small lit storefront with an awning, sitting on a glowing looped platform, representing a store that runs continuously",
    knowledge: {
      whatItIs:
        "A store that takes orders and payments on its own, day and night, without someone behind the counter.",
      theLeak:
        "Every hour the shop is not open online is an hour of sales going to whoever is open.",
      whatClientSees: "A store that is always open, selling while you sleep.",
    },
  },
  {
    slug: "dashboards",
    name: "Dashboards and Python tooling",
    headline: "No clear picture of what's actually happening in the business.",
    outcome: "You know today's numbers today, not at month end.",
    image: "/systems/response-system.webp",
    alt: "Illustration of a glowing dashboard panel with a search bar and data bars, wired to connector nodes, representing a live business data dashboard",
    knowledge: {
      whatItIs:
        "A live dashboard that pulls the numbers that matter into one place, updated automatically instead of copied in by hand.",
      theLeak:
        "Decisions get made on guesswork because the real numbers are scattered across spreadsheets, inboxes and someone's memory.",
      whatClientSees:
        "One screen with the figures that actually matter, always current, no manual pulling of reports.",
    },
  },
  {
    slug: "ai-skills",
    name: "Specialized LLM skill-building",
    headline: "Repetitive work eating hours that should go to clients.",
    outcome: "Work that filled hours every week hands itself back.",
    image: "/systems/skill-assembly.jpg",
    alt: "Isometric illustration of a central modular cube built from four snapping pieces, connected to a ring of smaller floating modules, representing a custom capability assembled from parts",
    knowledge: {
      whatItIs:
        "A custom-built capability, shaped around one specific repetitive task in your business.",
      theLeak:
        "The tasks eating the most hours are usually the most repetitive ones, and repetitive work is exactly what should not need a person every time.",
      whatClientSees:
        "The task still gets done, just without someone doing it by hand every time.",
    },
  },
  {
    slug: "automation-hub",
    name: "Automation hub",
    headline:
      "Reminders and hand-offs fall through the cracks when your team is stretched thin.",
    outcome:
      "Nothing gets forgotten, even in your busiest week.",
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
    name: "System map",
    headline: "If it's only in your head, the business stalls the moment you're away.",
    outcome:
      "The business keeps running the week you are not there.",
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
];
