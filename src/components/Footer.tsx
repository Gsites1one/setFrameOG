import Image from "next/image";
import Link from "next/link";
import { CONTACT_EMAIL, LOCATION } from "@/lib/constants";

// Mirrors the floating nav (Iteration 6, Task 8) so the two never disagree
// about where "Services" goes — it used to point at the homepage #services
// anchor, which is now a real page. "Systems" keeps pointing at /knowledge,
// which stays the deeper technical reference reachable by contextual links.
const NAV_LINKS = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/#faq", label: "FAQ" },
  { href: "/knowledge", label: "Systems" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 px-6 py-14">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 md:flex-row md:justify-between">
        <div>
          <Image
            src="/brand/wordmark-white.png"
            alt="SetFrame"
            width={150}
            height={100}
            className="h-auto w-32"
          />
          <p className="mt-4 font-mono text-xs leading-relaxed text-foreground/50">
            {LOCATION}
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-col gap-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-xs text-foreground/60 transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-2 font-mono text-xs text-foreground/60">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="transition-colors hover:text-accent"
          >
            {CONTACT_EMAIL}
          </a>
          <Link
            href="/privacy"
            className="transition-colors hover:text-accent"
          >
            Privacy policy
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-5xl border-t border-white/5 pt-6">
        <p className="font-mono text-xs text-foreground/60">
          © {year} SetFrame. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
