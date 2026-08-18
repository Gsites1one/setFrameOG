"use client";

import { useEffect, useState } from "react";

// PREVIEW ONLY (preview/hero-and-background branch). Two independent toggles
// read from the URL, both defaulting to today's production behaviour when the
// param is absent or unrecognised:
//
//   ?hero=a | ?hero=b        anything else / absent -> "current"
//   ?bg=aurora | ?bg=scroll  anything else / absent -> "current"
//
// They compose freely, e.g. /?hero=b&bg=aurora.
//
// Deliberately NOT next/navigation's useSearchParams. That hook forces a
// Suspense boundary around every component that calls it or the build fails,
// and both callers here (Hero, LifeBackground) sit above the fold — one of
// them in the root layout — so wrapping them would push a Suspense boundary
// onto every route in the site just to serve a throwaway preview switch.
// Reading window.location instead keeps the homepage statically rendered and
// leaves the production render path untouched, which is what section 6's
// "nothing here may leak into the default path" actually requires.

export type HeroVariant = "current" | "a" | "b";
export type BgVariant = "current" | "aurora" | "scroll";

export type PreviewVariants = { hero: HeroVariant; bg: BgVariant };

export const PREVIEW_EVENT = "setframe:preview-variants";

const DEFAULTS: PreviewVariants = { hero: "current", bg: "current" };

export function readPreviewVariants(): PreviewVariants {
  if (typeof window === "undefined") return DEFAULTS;
  const p = new URLSearchParams(window.location.search);
  const hero = p.get("hero");
  const bg = p.get("bg");
  return {
    hero: hero === "a" || hero === "b" ? hero : "current",
    bg: bg === "aurora" || bg === "scroll" ? bg : "current",
  };
}

// The first client render deliberately returns the DEFAULTS, matching what the
// server rendered, so hydration can never mismatch; the effect then applies
// whatever the URL actually asked for. The visible consequence is a single
// frame of the production treatment before a variant swaps in, which is
// correct for a preview switch and wrong for nothing.
export function usePreviewVariants(): PreviewVariants {
  const [variants, setVariants] = useState<PreviewVariants>(DEFAULTS);

  useEffect(() => {
    const sync = () => setVariants(readPreviewVariants());
    sync();
    window.addEventListener(PREVIEW_EVENT, sync);
    window.addEventListener("popstate", sync);
    return () => {
      window.removeEventListener(PREVIEW_EVENT, sync);
      window.removeEventListener("popstate", sync);
    };
  }, []);

  return variants;
}

// Updates one param in place. history.replaceState rather than the Next router
// so the page is never re-fetched and scroll position is kept — the whole
// point is flipping variants mid-scroll and watching what changes.
export function setPreviewVariant(key: "hero" | "bg", value: string) {
  const url = new URL(window.location.href);
  if (value === "current") url.searchParams.delete(key);
  else url.searchParams.set(key, value);
  window.history.replaceState(null, "", url);
  window.dispatchEvent(new Event(PREVIEW_EVENT));
}
