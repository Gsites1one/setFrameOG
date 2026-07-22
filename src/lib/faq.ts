export type FaqItem = {
  question: string;
  answer: string;
};

// Single source for the FAQ section and the FAQPage structured data.
export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What do you actually build?",
    answer:
      "Custom websites and the business systems behind them: booking, follow-up, outreach, e-commerce, dashboards and internal automation. Every project is designed and built for one business against one goal. Nothing is resold from a template.",
  },
  {
    question: "How does a project start?",
    answer:
      "With a short conversation about where your business loses time, leads or follow-up. You get a clear proposal with scope, price and timeline within two working days.",
  },
  {
    question: "How do you price projects?",
    answer:
      "Fixed price per project, agreed before any work starts. No hourly billing, no surprises along the way.",
  },
  {
    question: "How long does a project take?",
    answer:
      "A quick win — a working version you can already use — lands in about 7 days. A complete project, built, rolled out and measured against the goal we agreed, runs about 30 days.",
  },
  {
    question: "What happens after launch?",
    answer:
      "You own everything that was built. Ongoing improvements are available as support, or your team can take over completely.",
  },
  {
    question: "Do you only work with financial firms?",
    answer:
      "No. The advisory project shown is one example of the approach in action. Websites, response systems, outreach, e-commerce and the rest apply to any business that wants more of what it already does well, whatever the industry.",
  },
];
