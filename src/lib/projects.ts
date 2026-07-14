export type Project = {
  slug: string;
  name: string;
  outcome: string;
  // Content type drives which section a project appears in.
  type: "website" | "system";
  // Live demo for websites, /contact for systems (nothing public to open).
  url: string;
  // Shown in the mockup address bar instead of the real deployment URL:
  // example-style domains read as shipped client work, not demos.
  displayUrl: string;
  image?: string;
  alt?: string;
};

// Single source of truth. The website portfolio grid filters type "website";
// the systems strip filters type "system". Append new projects here.
export const PROJECTS: Project[] = [
  {
    slug: "aura-capital",
    name: "Aura Capital",
    outcome: "Independent financial planning, positioned to book consultations.",
    type: "website",
    url: "https://auracapitalv1.vercel.app",
    displayUrl: "auracapital.com",
    image: "/work/aura-capital.webp",
    alt: "Homepage of the Aura Capital financial planning website, headline Wealth with intention",
  },
  {
    slug: "project-aura",
    name: "Project Aura",
    outcome: "A dark, modern advisory experience with live portfolio storytelling.",
    type: "website",
    url: "https://bolt-tryouts-finacial-advisor-v2.vercel.app",
    displayUrl: "projectaura.net",
    image: "/work/financial-advisor.webp",
    alt: "Homepage of a dark themed financial advisor website with a live portfolio overview card",
  },
  {
    slug: "response-system",
    name: "Client Response System",
    outcome: "Every inquiry answered in seconds, every lead followed up. Nothing goes cold.",
    type: "system",
    url: "/contact",
    displayUrl: "runs 24/7 behind the scenes",
  },
];

export const WEBSITE_PROJECTS = PROJECTS.filter((p) => p.type === "website");
export const SYSTEM_PROJECTS = PROJECTS.filter((p) => p.type === "system");
