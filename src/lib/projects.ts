export type Project = {
  slug: string;
  name: string;
  outcome: string;
  url: string;
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
    image: "/work/aura-capital.webp",
    alt: "Homepage of the Aura Capital financial planning website, headline Wealth with intention",
  },
  {
    slug: "advisor-platform",
    name: "Advisor Platform",
    outcome: "A dark, modern advisory experience with live portfolio storytelling.",
    url: "https://bolt-tryouts-finacial-advisor-v2.vercel.app",
    image: "/work/financial-advisor.webp",
    alt: "Homepage of a dark themed financial advisor website with a live portfolio overview card",
  },
];
