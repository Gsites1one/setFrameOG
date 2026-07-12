export type Project = {
  slug: string;
  name: string;
  outcome: string;
  url: string;
  // Shown in the mockup address bar instead of the real deployment URL:
  // example-style domains read as shipped client work, not demos.
  displayUrl: string;
  image: string;
  alt: string;
};

// Shared by the hero showcase and the work strip. Append new projects here,
// they appear everywhere automatically.
export const PROJECTS: Project[] = [
  {
    slug: "aura-capital",
    name: "Aura Capital",
    outcome: "Independent financial planning, positioned to book consultations.",
    url: "https://auracapitalv1.vercel.app",
    displayUrl: "auracapital.com",
    image: "/work/aura-capital.webp",
    alt: "Homepage of the Aura Capital financial planning website, headline Wealth with intention",
  },
  {
    slug: "project-aura",
    name: "Project Aura",
    outcome: "A dark, modern advisory experience with live portfolio storytelling.",
    url: "https://bolt-tryouts-finacial-advisor-v2.vercel.app",
    displayUrl: "projectaura.net",
    image: "/work/financial-advisor.webp",
    alt: "Homepage of a dark themed financial advisor website with a live portfolio overview card",
  },
];
