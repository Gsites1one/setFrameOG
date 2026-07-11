"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CONTACT_EMAIL } from "@/lib/constants";

const NAV_LINKS = [
  { href: "#work", label: "Work" },
  { href: "#services", label: "Services" },
  { href: "#faq", label: "FAQ" },
];

export function FloatingNav() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { rootMargin: "-64px 0px 0px 0px" }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      inert={!visible || undefined}
      className={`fixed left-1/2 top-4 z-50 -translate-x-1/2 transition-all duration-300 ${
        visible
          ? "translate-y-0 opacity-100"
          : "-translate-y-4 opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex items-center gap-5 rounded-full border border-white/10 bg-surface/80 px-4 py-2 backdrop-blur-md">
        <Image
          src="/brand/icon-mark-white.png"
          alt="SetFrame"
          width={20}
          height={20}
        />
        <ul className="flex items-center gap-4 font-mono text-xs tracking-wide text-foreground/80">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="transition-colors hover:text-accent"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="font-mono text-xs text-accent transition-opacity hover:opacity-80"
        >
          [ Start a conversation ]
        </a>
      </div>
    </nav>
  );
}
