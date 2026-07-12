export type FaqItem = {
  question: string;
  answer: string;
};

// Single source for the FAQ section and the FAQPage structured data.
export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "How does a project start?",
    answer:
      "With a short conversation about where your business loses time, leads or follow-up. You get a clear proposal with scope, price and timeline within a few days.",
  },
  {
    question: "How do you price projects?",
    answer:
      "Fixed price per project, agreed before any work starts. No hourly billing, no surprises along the way.",
  },
  {
    question: "How long does a project take?",
    answer:
      "Most websites launch in two to four weeks. Systems that handle replies, follow-up or paperwork usually add one to two weeks depending on scope.",
  },
  {
    question: "What happens after launch?",
    answer:
      "You own everything that was built. Ongoing improvements are available as support, or your team can take over completely.",
  },
  {
    question: "Do you only work with financial firms?",
    answer:
      "No. Financial and advisory firms are a focus, not a limit. If your business runs on inquiries, appointments and follow-up, this works for you.",
  },
];
