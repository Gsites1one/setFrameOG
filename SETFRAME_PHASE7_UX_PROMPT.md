# SETFRAME — PHASE 7 UX + GRAPHICS + SEO PASS
Role: Act as a world-class web designer and senior frontend engineer. Plan briefly, then execute.

## Objective
Raise the site's visual and interaction quality to the reference bar (graphics depth, smooth motion, live background) and finish the remaining Phase 7 assets — WITHOUT regressing the Lighthouse gains already banked.

## Context (carry forward — do not re-derive)
- Live: setframe.vercel.app. `setframe.net` is NOT registered/live yet — do not point anything at it as if it were reachable (see Task 8).
- Stack: Next.js (App Router) + Tailwind v4 + Framer Motion via LazyMotion (strict, domAnimation).
- Tokens: graphite #121214, foreground #F5F5F4, copper accent #C77B3F. Teal #4FB3C9 is approved for GRAPHICS ONLY (never UI/text). Fonts: Syne (headings), IBM Plex Mono (labels/numbers), Inter (body). Core motif: square brackets [ ].
- `implementation_plan_SF.md` is the single source of truth. Phases 1-6 shipped and live. Phase 7 is in progress.
- Copy rules (unchanged): no em-dashes, no "AI" in headlines, outcome-first language.
- LAST MEASURED LIGHTHOUSE (production, treat as HARD FLOORS — do not regress):
  mobile Perf 92 / A11y 96 / Best Practices 100 / SEO 100 / Agentic Browsing 2/2; desktop Perf 99.
- Perf work already banked (DO NOT UNDO): LazyMotion strict, modern .browserslistrc, `display:swap` fonts, content-visibility on heavy sections, cached getBoundingClientRect, non-composited animations cut from 56 to ~14 (mobile). CLS is 0 — keep it 0.

## CRITICAL CONSTRAINTS (read before touching anything)
1. Every new/edited animation MUST animate ONLY `transform` and `opacity` (compositor-safe). No animating width/height/top/left/box-shadow/filter in loops. This protects the non-composited-animation count and Speed Index.
2. `prefers-reduced-motion`: every new motion needs a complete static fallback. No exceptions. Note: `src/app/globals.css` already has a global reduced-motion block (`* { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }`) — new CSS-driven motion inherits this for free; new JS-driven motion (rAF loops, Framer variants) still needs its own explicit guard.
3. New raster images MUST ship through `next/image` as WebP/AVIF with explicit width/height. Only the hero image may be `priority`; everything below the fold is lazy. Hero image budget: keep the served asset lean so LCP does not regress (mobile LCP is currently ~3.0s — do not push it up).
4. Palette unchanged. Teal stays graphics-only.
5. Do not regress any Lighthouse category below the floors above. If a change forces a tradeoff, STOP and explain.

## Task groups

### 1. VERIFY-FIRST — systems/websites split (do this before anything else)
A production screenshot showed the scrolling strip STILL mixing website cards (Aura Capital, Project Aura) with the Client Response System, despite the split being reported done.

VERIFIED during prep for this doc: the current source is already correct. `src/lib/projects.ts` defines `WEBSITE_PROJECTS` / `SYSTEM_PROJECTS` filtered by `type`, and `src/components/Work.tsx` renders them separately — `WEBSITE_PROJECTS` in their own non-scrolling two-up grid, `SYSTEM_PROJECTS` in the strip (currently a single centered card since there's only one system; it auto-upgrades to the marquee at 2+). So the code-level bug described here does not exist in the current tree.

Do this anyway, in order:
1. Load the LIVE site (setframe.vercel.app), inspect the rendered strip and grid.
2. If it now matches the source (systems-only strip, websites in their own grid): the earlier screenshot was a stale deploy. Change nothing in code. Note it as confirmed-correct and move on.
3. If the live site still mixes types despite the source being correct: this is a deploy/cache issue, not a filter bug — investigate build/deploy freshness rather than rewriting the filter logic.

### 2. Upgrade graphics quality WHILE PRESERVING the animation
The current in-code SVG visuals animate well but read graphically weak. The hero's current visual is `src/components/SystemSignature.tsx` (an inline SVG bracket-framed node cluster with pulsing links, layered behind the H1 in `src/components/Hero.tsx`) — this is what gets replaced/rebuilt on top of the raster.

CONFIRMED: all 5 raster assets already exist in `public/` at the exact paths below (verified on disk, not pending):
- `public/hero/leak-to-movement.webp` — hero signature (a business leaking copper particles, caught and redirected by a teal+copper system cluster). Replaces `SystemSignature.tsx` as the hero visual. Directly mirrors the H1 "losing money in places you never look".
- `public/systems/response-system.webp` — systems strip tile (dashboard/chip network).
- `public/systems/automation-hub.webp` — systems strip tile (radiating gear hub).
- `public/systems/system-map.webp` — systems strip tile (node board/map).
- `public/systems/system-tower.webp` — systems section anchor / feature visual (layered tower + light beam).

- Preserve motion the right way: over each static base, layer ONLY compositor-safe motion — (a) slow opacity "breathing" on a glow layer, (b) ≤12px mouse parallax on fine-pointer devices, (c) OPTIONAL copper pulse travelling a path, allowed only if it stays on the compositor AND is paused off-screen via IntersectionObserver. Port the existing SVG pulse as an overlay where it still looks good on top of the raster; drop it where the raster reads better alone. Owner's judgment: animation feel is a feature, keep it alive.
- Captions for system tiles use CAPABILITY framing (illustrative service types), never client case-study claims. Buyer language, reuse the services vocabulary (reply, follow-up, booked, sorted).
- The strip already has the 1-vs-2+ branching logic in `Work.tsx` (`SystemsStrip`): single system renders as a centered feature card, 2+ renders as the marquee. If the owner later adds a 2nd+ real system, it auto-upgrades — no new logic needed here, just make sure the new raster tiles slot into both branches cleanly.

### 3. Redesign section numbering (currently flat `[0N]`, reads weak)
Confirmed current flat numbering across ALL FIVE numbered sections (not just the two below) — apply the redesign to all five for a consistent system, not a partial one:
- `src/components/Work.tsx` — `[ 01 ]`
- `src/components/Services.tsx` — `[ 02 ]`
- `src/components/HowWeWork.tsx` — `[ 03 ]` (this is the "Process" section referenced below)
- `src/components/About.tsx` — `[ 04 ]`
- `src/components/Faq.tsx` — `[ 05 ]`

- All five section headers: pair the number with the planned "bracket beam" — a thin copper line that draws in on section-enter (transform/opacity only), number set larger in IBM Plex Mono, bracket motif as a corner detail. It should read as a deliberate mark, not plain text in brackets.
- Process sticky rail (`HowWeWork.tsx`): add weight hierarchy. Currently the rail (`lg:` only, hidden under reduced motion) shows ONE large copper-filled active number and separate progress dots — it does NOT currently show the inactive step numbers at all, only dots. Add the inactive numbers back in small, outline-only style alongside (not instead of) the existing dots, so the hierarchy reads: active = large + copper-filled, inactive = small + outline. Keep the existing progress dots as-is.

### 4. Smoothness (instant jumps currently kill the feel)
- Top anchor nav / quick-menu (`src/components/FloatingNav.tsx`): links are currently plain `<a href="#work">` etc. with no smooth-scroll (browser default instant jump). Simplest compositor-safe fix: add `scroll-behavior: smooth` on `html`/`:root` in `globals.css` — the existing global reduced-motion block already forces `scroll-behavior: auto !important` under `prefers-reduced-motion: reduce`, so the "instant on reduced-motion" requirement is satisfied automatically with zero new JS. Only reach for JS-driven scrolling if the CSS approach proves insufficient.
- FAQ accordion (`src/components/Faq.tsx`, section 05): currently native `<details>/<summary>` — good for semantics/find-in-page, but native `<details>` cannot animate its open/close height. Two valid paths:
  (a) Keep `<details>` for semantics, control it via `onToggle`, and animate an inner content wrapper's height via a grid-rows (`grid-template-rows: 0fr → 1fr`) or measured-height technique.
  (b) Replace `<details>` with a controlled `button[aria-expanded]` + `div[role=region]` pattern (matches Framer `AnimatePresence` more naturally) — this is the more common approach when using Framer for the animation, but it must reproduce the same accessible semantics `<details>` gives for free (exposed expanded/collapsed state, keyboard operability).
  Pick (a) if you want to keep native semantics with minimal risk; pick (b) if `AnimatePresence` height animation proves cleaner. Whichever is chosen, verify keyboard operability (Enter/Space toggles, focus stays on the trigger) and that the expanded state is still exposed to assistive tech.

### 5. Contact form
- Replace the single "what you want to build or improve" PLACEHOLDER text (`src/components/ContactForm.tsx`, the `message` field) with a rotating hint cycling through varied reasons, e.g. "Let's talk about your business." / "What's costing you leads?" / "Tell me what's not working."
- MANDATORY a11y: the field already has a PERSISTENT, visible `<label htmlFor="message">Message</label>` — do not remove, hide, or fold it into the rotating text. The rotating text stays a placeholder-only hint; the existing label remains the sole accessible name. This protects A11y (96) and Agentic Browsing (2/2), both of which read the accessibility tree.

### 6. Background aliveness (currently dead after load; absent on mobile)
Confirmed in `src/components/LifeBackground.tsx`: today there is (1) a static two-glow radial-gradient mesh that never animates, (2) a cursor-following copper glow + cursor-revealed dot grid that only activate on fine-pointer devices via a `pointermove` listener (opacity stays 0 until the first pointer move — so touch/mobile never sees them), and (3) a static grain overlay. This matches the "dead after load, absent on mobile" diagnosis exactly.
- Add a DEFAULT autonomous ambient layer for ALL devices including touch/mobile: a slow drifting copper glow plus a slow-pulsing grain/mesh on an 8-15s loop. Transform/opacity only.
- Keep the cursor-reactive glow (the existing fine-pointer-only effect) as an ENHANCEMENT layer on top — not the sole source of life.
- Full static on `prefers-reduced-motion`. Must not raise the non-composited-animation count.

### 7. Contrast fix (real WCAG failure found in Lighthouse)
Root cause: text muted via Tailwind opacity utilities (`text-foreground/NN`) instead of a solid color token. Computed contrast (foreground #F5F5F4 composited over background #121214 / surface #1a1a1d, per WCAG relative luminance):

| Opacity | Contrast on graphite | Contrast on surface | AA (4.5:1, normal text) |
|---|---|---|---|
| /40 | 3.61:1 | 3.59:1 | **FAILS** |
| /45 | 4.25:1 | 4.20:1 | **FAILS** |
| /50 | 4.97:1 | 4.87:1 | passes |
| /55 and above | 5.6:1+ | 5.6:1+ | passes comfortably |

Confirmed FAILING instances to fix (all currently `/40` or `/45`, verified via grep across `src/`):
- `src/components/Footer.tsx:53` — `text-foreground/40` on "Privacy policy [[ TO FILL ]]" (the one Lighthouse actually flagged).
- `src/components/Hero.tsx:74` — `text-foreground/40` on the "scroll" hint label.
- `src/components/HowWeWork.tsx:59` — `text-foreground/40` on "scroll — how it works".
- `src/components/ContactForm.tsx:8` — `placeholder:text-foreground/40` (shared `FIELD_CLASSES`, affects every input's placeholder).
- `src/components/ServiceGraphics.tsx:106,178` — `fill-foreground/45` on small SVG labels (11px/10px monospace) inside the service graphics.

Fix: define a solid `--color-muted` token in `globals.css` (pick a value ≥4.5:1 on BOTH graphite and surface — e.g. a solid gray around `#8a8a89`–`#909090`, verify before committing) and swap the five instances above to it (`text-muted` / `fill-muted` as appropriate). Do NOT blanket-replace every `text-foreground/NN` in the codebase — instances at `/50` and above already pass AA and reworking them is out of scope (see Constraints: only make changes directly requested).

### 8. Remaining Phase 7 SEO assets
- Favicon generated from the [S] bracket mark, legible at 16x16.
- og:image: compose a 1200x630 card from the hero graphic + the MONOCHROME wordmark, exposed via an absolute URL through `metadataBase`.
  - `src/app/layout.tsx` currently hardcodes `SITE_URL = "https://setframe.net"` for `metadataBase` and the `Organization` JSON-LD — but setframe.net is NOT live yet (confirmed). Change `SITE_URL` to the live Vercel URL (`https://setframe.vercel.app` — confirm the exact production URL before committing) for now, with a clearly marked `// TODO: swap to setframe.net once the domain is live` comment. This also fixes the `logo` field in `organizationJsonLd`, which currently points at a `setframe.net` URL that doesn't resolve.
- `sitemap.xml` and `robots.txt`.
- `llms.txt` at the domain root: a short machine-readable summary of what SetFrame is + key sections. Cheap, low-risk, extends agent-readiness (keeps Agentic Browsing healthy). Note: it does not affect Google ranking.

### 9. Plan sync (documentation — keep the source of truth honest)
Update `implementation_plan_SF.md` so it matches everything shipped here plus the prior UX pass (hero is now the leak-to-movement raster + composited motion; systems strip is systems-only — confirmed already correct in source, just re-confirmed live; websites are a separate grid; numbering redesigned across all five sections; background has a default ambient layer). Update the Phase 7 checklist to reflect what is now DONE vs still owner-blocked (real Lighthouse re-run, Formspree E2E test, swapping `SITE_URL` to setframe.net once that domain goes live).

## Scope
- Work in: `src/`, `public/`, and `implementation_plan_SF.md`.
- Do NOT touch: `.env*`, lockfiles, CI/host configs, or anything outside the above.

## Constraints
- Only make changes directly requested here. Do not add features, abstractions, or files beyond scope.
- No new dependencies without asking first.

## Acceptance criteria (binary)
- [ ] Scrolling strip shows ONLY systems; websites live in their own non-scrolling grid (verify on the LIVE site; source already confirms this — see Task 1).
- [ ] The 5 raster graphics render via `next/image` (WebP/AVIF, explicit dimensions, lazy below fold); hero is LCP-safe.
- [ ] All new motion is compositor-safe; reduced-motion static parity verified in-DOM.
- [ ] Section numbering uses the bracket-beam + weight hierarchy on all five numbered sections (Work, Services, Process, About, FAQ), not flat `[0N]` text.
- [ ] Anchor nav smooth-scrolls (instant on reduced-motion); FAQ animates open/close while preserving accessible expand/collapse semantics.
- [ ] Contact field has BOTH a rotating placeholder hint AND the existing persistent visible `<label>` (unchanged).
- [ ] Background has default ambient motion on mobile AND desktop; cursor glow is enhancement-only.
- [ ] No text uses opacity-based muting that fails AA; `--color-muted` passes >=4.5:1 on both graphite and surface, applied to the 5 confirmed failing instances (Footer, Hero, HowWeWork, ContactForm placeholder, ServiceGraphics x2).
- [ ] favicon, og:image, sitemap.xml, robots.txt, llms.txt all present and wired; `metadataBase`/JSON-LD point at a URL that actually resolves (Vercel URL, not setframe.net, until that domain is live).
- [ ] `implementation_plan_SF.md` updated to match reality.
- [ ] Local build passes with no console errors.

## Stop conditions — pause and ask before:
- Any change would drop a Lighthouse category below its stated floor.
- Two valid animation implementations exist and the choice affects architecture (e.g. the FAQ `<details>` vs controlled-component decision in Task 4 — pick one and note why, but flag if it has wider implications).
- Adding any dependency or deleting any file.
- The exact production Vercel URL cannot be confirmed (Task 8 needs it for `metadataBase`).

## Progress
After each step output: ✅ [what was done] — [file(s) affected]. At the end, give a full file-change summary AND an honest list of what you could NOT verify from your environment (you cannot run Lighthouse — flag that the owner must re-run it on mobile and confirm no category regressed; and the Formspree E2E submission is the owner's test).

## Session Strategy
Continue if this session is fresh; if context is already long, run `/compact focus on SetFrame Phase 7` first, then begin.

Think carefully and step-by-step before starting — this is a multi-file change with hard performance floors.

---
NOTE: This prompt targets an agentic tool with real system access. Review scope, forbidden actions, and stop conditions before pasting, and confirm the `public/` asset paths match where you actually drop the images (as of this finalization pass, all 5 already exist on disk — see Task 2).
