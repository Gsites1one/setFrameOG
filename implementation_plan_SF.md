# implementation_plan_SF.md
# SetFrame — Studio Website Implementation Plan
# Role: Act as an expert web designer and senior frontend engineer.
# Mode: PLAN FIRST. Do not write code until this plan is reviewed and confirmed.

---

## 0. Project Definition

- **Project:** SetFrame studio website (the studio's own site, not a client demo)
- **Purpose:** Personal brand + studio showcase. This site advertises SetFrame:
  a one-person studio building websites, content systems, and business automation.
  Financial advisory firms are the primary outreach target, but the site must
  speak to any business owner who lands on it. Do not write copy that excludes
  non-financial visitors.
- **Scope:** Front-end only prototype. No backend, no database, no integrations.
- **Contact:** dedicated /contact page — REVISED after Phase 2 (supersedes the
  earlier mailto-only decision). The page contains:
  1. A short "why SetFrame" trust block above the form (3 bracket-numbered
     reasons, concise, no hype).
  2. A form: name, email, preferred contact method, message. Submissions go
     through Formspree (free tier, no backend code, no API keys in repo).
     Deliver to owner's current email until hello@setframe.net is live
     (TODO marker).
  3. A short privacy line under the form (what happens with submitted data).
     A full privacy policy page stays out of scope for v1 but is a fast
     follow once KVK/domain formalities land.
- **Single CTA:** "[ Start a conversation ]" — now links to /contact (not
  mailto). Appears in hero, floating nav (small variant), and final section.
- **Language of the site:** English.

## 1. Tech Stack

- **Next.js (App Router)** — decided in plan review. Chosen over a plain Vite
  SPA because per-route metadata, OG image generation, and static/ISR
  rendering are handled natively, which matters for the SEO/AEO requirements
  in section 8 (absolute og:image, per-page meta, crawlable semantic
  structure).
- Tailwind CSS
- Framer Motion (preferred) or GSAP for animation
- Formspree for contact form submissions (no backend of our own)
- Page transitions: subtle 200-300ms fade between / and /contact (Next.js
  View Transitions) — no hard page loads
- Deployed via GitHub → Vercel auto-deploy
- Target domain: setframe.net
- Component size limit: max 400-600 lines per component file
- One font pairing site-wide: Syne (headings) + IBM Plex Mono (labels, numbering,
  small technical details). Body text: **Inter** — decided in plan review
  (better paragraph-length legibility than Syne regular, still pairs cleanly
  against the Syne display headings).

## 2. Brand Assets (provided, do not regenerate)

- Wordmark: [SetFrame] — white-on-graphite and graphite-on-white PNG/SVG variants
- Icon mark: [S] in square brackets — both color variants
- Logo is ALWAYS monochrome. Never recolor the logo with the accent color.
- The square bracket [ ] is the core visual motif of the brand.
  BRACKET RULE (REVISED — Phase 7.2, hard criterion): the [ ] motif is
  reserved for the LOGO and BUTTONS only. It is NOT used for section numbers,
  the hero headline frame, the process rail, or any other body text. Section
  numbers are now oversized low-opacity mono ghost numerals with a copper
  hairline; buttons and the [S] / [SetFrame] logo keep the brackets.
- Raster illustrations (ADDED — Phase 7 UX pass, do not regenerate): five
  isometric renders in `public/hero/` and `public/systems/`, all sharing the
  graphite backdrop so they blend into the site background —
  `leak-to-movement.webp` (hero signature), `response-system.webp`,
  `automation-hub.webp`, `system-map.webp` (systems strip tiles), and
  `system-tower.webp` (systems section anchor visual). These replace the
  earlier in-code SVG hero/system-flow graphics as the visual base plate;
  the SVG pulse/motion vocabulary (`.flow-dash`, `.flow-node`, etc.) stays in
  use elsewhere (Services graphics) and as compositor-safe overlays where it
  still reads well on top of the raster.

## 3. Color System

- Background: #121214 (graphite, not pure black)
- Text/foreground: #F5F5F4
- Accent: #C77B3F (copper)
- Optional supporting surface tone: #1A1A1D for cards/elevated surfaces
- Secondary cool glow: #4FB3C9 (teal) — REVISED, approved in review. Restricted
  to service/system GRAPHICS only, never UI chrome, buttons, or text. This
  intentionally overrides the "single copper, no new colors" line from the
  UX-upgrade brief (user chose to keep teal when the conflict was surfaced).
- WCAG rule: accent (#C77B3F) on background (#121214) passes contrast for
  large text, buttons, and UI elements only. NEVER use accent for body text
  or small paragraph copy. Body/paragraph text is always #F5F5F4.
- Muted text token (ADDED — Phase 7 UX pass): a real Lighthouse AA failure
  was traced to `text-foreground/NN` opacity utilities at 40-45%, which
  compute to 3.6-4.25:1 on graphite/surface — below the 4.5:1 AA floor for
  normal text (opacity utilities at 50%+ already passed and were left
  alone). Added a solid `--color-muted: #8a8a89` token in `globals.css`
  (5.41:1 on graphite, 5.02:1 on surface, both verified), used via
  `text-muted` / `fill-muted` wherever text needs to read as de-emphasized
  but must stay legible: the footer's placeholder privacy line, the hero and
  process-section "scroll" hints, the contact form's placeholder color, and
  two small SVG labels in the service graphics.
- Accent usage is restricted to: CTA buttons, hover states, section numbering,
  thin divider lines, icon accents, active/focus states.
  (UPDATED — Phase 7.2: section numbers no longer use the [ 01 ] bracket form;
  they are oversized low-opacity mono ghost numerals + a copper hairline. See
  the bracket rule in section 2.)
- Logo stays monochrome (pure white/graphite or graphite/white) in all
  placements.

## 4. Site Structure (single page + minimal footer pages)

1. **Hero** (REVISED again after review: loss-led messaging, sell movement
   not technology; never mention team size or city in the hero)
   - Wordmark kicker: [SetFrame] wordmark above the H1, first element to fade in.
   - H1 (locked copy): "Your business is losing money in places you never look."
   - Subline (locked): "SetFrame builds websites and systems that catch what
     quietly slips away and turn it into movement."
   - Primary CTA button → /contact. Label: [ Start a conversation ].
     Font: Syne semibold (REVISED — was IBM Plex Mono, rejected in review).
   - CURRENT hero (SUPERSEDES the corner-fold showcase, raster signature and
     bracket-framed H1 described in the history below) — Phase 7.2 + 7.4:
     * No raster anywhere in the hero. The focal visual is coded SVG
       (`HeroVisual.tsx`): a business leaking copper beads along an arc into a
       teal+copper cluster that turns them into rising movement, masked with a
       soft radial falloff (no rectangular edge). Opacity-only bead/node/rise
       motion + a small fine-pointer parallax.
     * The H1 has NO bracket frame (bracket rule, section 2). The three
       "why websites" keyword lines moved OUT of the hero into the Work
       section.
     * No `priority` image ships (the raster is gone), so the H1 text is the
       LCP candidate. The SVG animations are idle-gated (`.anim-gate` +
       requestIdleCallback, Phase 7.4) so they do not run inside the LCP /
       Speed Index window on mobile.
     * Paused / static under prefers-reduced-motion.
   - HISTORY (superseded, kept for intent): a corner-fold project showcase
     cycling portfolio screenshots sat right of the copy with three
     bracket-numbered keyword lines; Phase 7 briefly used a
     `leak-to-movement.webp` raster with `priority` in place of the earlier
     `SystemSignature.tsx` SVG. Both were replaced by the coded hero above.
   - Deliberate load animation: staggered H1 line reveal → subline + CTA fade
     (implemented in Phase 2).

2. **Systems strip** (REVISED — split by content type, owner decision)
   - The scrolling marquee is now SYSTEMS-ONLY: the Client Response System
     flow diagram and any future automation / system graphics or animated
     diagrams. No website screenshots here.
   - Driven by the shared data array filtered to `type: "system"`.
   - Website screenshots moved out to their own section (see 5, Selected work).
   - VERIFIED live (Phase 7 UX pass): re-checked the deployed site directly —
     the strip only ever showed systems and websites already had their own
     grid. An earlier screenshot suggesting they were mixed did not match
     either the source or the live site; no filter bug existed.
   - CURRENT systems strip (SUPERSEDES the 3-tile / tower version below) —
     Phase 7.2: seven UNIQUE tiles driven by `SYSTEM_TILES` in `projects.ts`
     (Client Response System, Lead Capture, Booking Flow, Document Intake,
     Automation Hub, System Map, and a "What is SaaS?" concept tile). Two
     seamless marquee copies so no tile sits next to its own duplicate and
     there is no ~2s repeat. EVERY tile is a real `<a>` to `/knowledge#<slug>`
     with visible focus; the duplicate copy is aria-hidden + `tabIndex -1`.
     The "systems that keep working after launch" anchor block and its
     `system-tower.webp` graphic were REMOVED.
   - HISTORY (superseded): Phase 7 briefly showed three capability tiles
     (Client Response System + Automation Hub + System Map) with the tower
     graphic anchoring the section.

3. **Services**
   - Three cards: Websites / Content Systems / Business Automation.
   - Numbering: plain copper mono numerals (01 / 02 / 03) — NO brackets
     (bracket rule, Phase 7.2).
   - Each card: outcome-first title, 2-3 sentence description, no tech jargon,
     no "AI" in titles.
   - Hover: subtle scale + copper border shift + spotlight effect (see section 7).

4. **How we work** (3 steps, buyer's perspective, AEO-friendly)
   - Frame as question → answer where natural
     (e.g. "How does a project start?").
   - Step numbering: plain numerals, NO bracket motif (Phase 7.2). Each step
     also carries a small thematic micro-animation next to its heading
     (Phase 7.3, `StepMotif.tsx`), paused unless it is the active step.

5. **Selected work — website portfolio**
   - CURRENT (SUPERSEDES the two-up type-filtered grid below) — Phase 7.2:
     ONE consolidated website project (`WEBSITE_PROJECT` in `projects.ts`)
     shown as two prototypes of one concept — Aura Capital = Prototype 01,
     Project Aura = Prototype 02 — in a single labelled card pair.
   - Each prototype card: browser-chrome frame + screenshot, hover-preview
     effect, "Prototype 0N" label, name, one-line outcome, and a quiet
     "view live" link (opens in a new tab, not button-styled, per section 9).
     Carries the signature copper cursor-spotlight.
   - HISTORY (superseded): originally a two-up NON-scrolling grid of two
     separate website projects filtered by `type: "website"`.

6. **About** (REVISED — impersonal, owner decision)
   - No founder-personal framing: no bio, no location-as-personal-detail,
     no photo or photo placeholder.
   - Impersonal studio description: what SetFrame is, what it specializes in,
     how it helps the visitor's business. 3-4 sentences, outcome-first
     (section 6 copy rules).

7. **FAQ** (objection handling, AEO-friendly)
   - 4-6 questions structured as direct question → concise answer:
     pricing approach, timeline, what happens after launch, do you only work
     with financial firms (answer: no — that is a focus, not a limit).
   - UPDATED — Phase 7 UX pass: rows were native `<details>/<summary>`, which
     can only show/hide instantly. Replaced with a controlled
     `button[aria-expanded]` + `div[role=region]` pattern animated via
     Framer `AnimatePresence` (height + opacity). This is a deliberate,
     scoped exception to the transform/opacity-only motion rule — animating
     to `height: "auto"` isn't a compositor property — but it only ever runs
     on user click, never during page load, so it can't appear in or affect
     the Lighthouse non-composited-animations count (measured from the
     automated load trace, not post-load interaction). All closed by
     default, matching the previous behavior; FAQPage JSON-LD unaffected
     (still generated from the same `FAQ_ITEMS` in `src/app/page.tsx`).

8. **Final CTA section**
   - Repeat the single primary CTA. One line of copy + button. Nothing else.

9. **Footer**
   - Logo (monochrome), KVK number placeholder (TODO until registered),
     hello@setframe.net, Tilburg / Noord-Brabant, NL, copyright line.
   - No social icons until profiles exist (TODO markers).

10. **/contact page** (ADDED after Phase 2)
   - "Why SetFrame" trust block: 3 bracket-numbered reasons ([ 01 ]-[ 03 ]),
     each 1-2 sentences, outcome-focused, before the form.
   - Form fields: name, email, preferred contact method (email / phone /
     video call), message. Formspree submission, client-side validation,
     clear success and error states.
   - Short privacy line under the form.
   - Same background treatment and motion language as the homepage.
   - Reached via fade page transition from any CTA.
   - UPDATED — Phase 7 UX pass: the message field's placeholder now rotates
     through a few varied hints ("Let's talk about your business.", "What's
     costing you leads?", "Tell me what's not working.", plus the original
     line) on a 3.5s interval, paused under reduced motion. The field's
     persistent, visible `<label htmlFor="message">Message</label>` is
     unchanged and stays the sole accessible name for the field regardless
     of which hint is showing.

## 5. Motion & Animation Requirements (mandatory, not optional)

- Fade-in on scroll for every major section (trigger once, ~400-600ms, subtle
  upward translate + opacity).
- Marquee or carousel behavior in the portfolio/proof section.
- Hover states on all interactive cards (subtle scale or border/accent shift).
- One deliberate hero animation on load (staggered text reveal or logo motion).
- Avoid static, flat sections. Every scroll-triggered section needs at least
  one motion element.
- Respect prefers-reduced-motion: disable non-essential animation when set.

## 6. Copy Rules

- No em-dashes anywhere in site copy. Use periods, commas, or restructure the
  sentence instead.
- Headline structure: name the buyer + the outcome, not the technology.
- No usage of the word "AI" in headlines or service names. In body copy,
  describe outcomes (saved time, consistent follow-up, more booked calls),
  not tools.
- Keep body copy concise. No paragraph longer than 3 sentences in marketing
  sections.
- First paragraph of the homepage must clearly state who the site is for and
  what outcome is delivered. No vague intros.

## 7. GitHub-inspired dynamic elements (approved direction)

Implement these patterns, adapted to the SetFrame palette. All must be CSS/JS
based (no WebGL, no heavy canvas — Lighthouse Performance > 90 is a hard
requirement):

- **Background "life" package (ADDED after Phase 2 review — the graphite base
  read as too flat/dead):** three site-wide layers, all transform/opacity
  based, tuned subtle:
  1. Cursor-following ambient glow: the copper glow drifts slowly toward the
     cursor position (single element, GPU-cheap).
  2. Cursor-reactive dot grid: barely-visible dot pattern over the graphite
     that brightens in a radius around the cursor (CSS mask technique,
     GitHub-style).
  3. Grain overlay: low-opacity SVG noise so the graphite reads as material,
     not void.
  Touch devices fall back to the static pulsing glow (no cursor to track).
  All three respect prefers-reduced-motion.
  UPDATED — Phase 7 UX pass: the background previously went static after
  first paint and had no life at all on touch (the cursor-follow layers
  never activate without a pointer). Added a DEFAULT ambient layer that runs
  on every device with no pointer required — a slow drifting + breathing
  copper glow (`.ambient-glow-drift`, 9s opacity breathe + 14s transform
  drift, combined in one rule since `animation` shorthand doesn't stack
  across separate classes) plus a slower opacity pulse on the static mesh
  and grain (`.grain-breathe`, 11s, deliberately off-cycle from the glow so
  nothing reads as synced). The cursor-following glow and dot grid stay as a
  fine-pointer-only ENHANCEMENT layered on top, not the sole source of life.
  Transform/opacity only; explicit `animation: none` under reduced motion in
  addition to the site-wide reduced-motion block.
- **Micro-interaction set (ADDED in hero rework 2):** magnetic CTA button
  (pulls toward cursor, springs back), custom bracket cursor (copper [ ]
  pair trailing the pointer, expands over interactive elements, hidden over
  text fields, fine-pointer only), CountUp kinetic numbers component for
  proof stats. Lighthouse Performance >= 90 stays a hard guarantee.
- **Spotlight hover on cards:** radial gradient that follows the cursor on
  service/portfolio cards (copper glow at low opacity on graphite).
- **Ambient glow:** one or two large, blurred copper radial gradients behind
  the hero and final CTA section, subtle, low opacity, slow pulse (8-10s,
  opacity 0.06-0.12) — implemented in Phase 2, becomes cursor-following as
  part of the life package.
- **Scroll-driven reveal storytelling:** sections reveal progressively on
  scroll (already covered in Motion Requirements — GitHub-style stagger).
- **Marquee strip:** continuous horizontal marquee for project logos/mockups.
- **Bracket beam detail:** thin animated copper line that draws along section
  dividers as they enter the viewport (echoes the [ ] motif).
  SHIPPED — Phase 7 UX pass: `SectionNumber.tsx` is the shared component now
  used by all five numbered sections (Work [01], Services [02], Process
  [03], About [04], FAQ [05]) — a larger IBM Plex Mono number with a small
  bracket-corner tick detail, paired with a copper line that draws in
  (scaleX + opacity) once on section-enter. The Process sticky rail also
  gained a weight hierarchy: the active step number is large and
  copper-filled, inactive step numbers are small and outline-only (text-stroke,
  transparent fill), alongside the existing progress dots.
- Explicitly out of scope: 3D globe, WebGL scenes, particle systems.

## 8. SEO / OG / Technical Setup (from day one, not post-launch)

- og:image must use an absolute URL. setframe.net is not registered/live yet,
  so `metadataBase`/`SITE_URL` currently point at the live Vercel URL
  (https://setframe.vercel.app) with a TODO marker in `layout.tsx` to swap to
  setframe.net once that domain is live — not a relative path, not a dead
  placeholder domain (this caused a critical bug on a previous project and
  must be avoided).
- Meta title + meta description written per page, not left default.
- Favicon generated from the [S] bracket icon mark (Phase 7: shipped via
  `src/app/icon.png`, composited from `public/brand/icon-mark-white.png` onto
  the graphite background, verified legible down to 16x16 and 32x32).
- sitemap.xml and robots.txt included (Phase 7: shipped via `src/app/sitemap.ts`
  and `src/app/robots.ts`, Next's file-convention routes).
- llms.txt at the domain root (Phase 7: shipped as a static `public/llms.txt`
  — short machine-readable summary of what SetFrame is and its key sections,
  for agent/answer-engine readability; does not affect Google ranking).
- Semantic heading structure (single H1 per page, logical H2/H3 hierarchy) so
  AI answer engines and search crawlers can parse and cite the content
  correctly.
- Where natural, structure key sections as direct question → answer framing
  (AEO-friendly), especially in services, "how we work", and FAQ sections.
- Alt text on all images and mockups.
- No analytics for v1 — decided in plan review. Revisit (Vercel Analytics or
  Plausible, to avoid a GDPR cookie-consent banner) post-launch if needed.

## 9. Conversion / CTA Rules

- Single primary CTA across the entire site: "[ Start a conversation ]"
  linking to /contact (REVISED — was mailto).
- CTA styling: Syne semibold label inside bracket motif (REVISED — was
  IBM Plex Mono, rejected in review as wrong for buttons).
- Primary CTA appears in hero, floating nav (small variant), and final
  closing section. No competing or secondary CTAs pulling attention away
  from the primary action.
- UPDATED — Phase 7 UX pass: the floating nav's in-page anchor links
  (`#work`, `#services`, `#faq`) jumped instantly. Added `scroll-behavior:
  smooth` on `html` in `globals.css`; the existing site-wide reduced-motion
  block already forces `scroll-behavior: auto !important`, so this is
  instant under prefers-reduced-motion with no extra JS.
- On /contact, the form's submit button is the primary action of that page.
- Portfolio "view live" links open in new tabs and do not use button styling
  (they are secondary by design, visually quiet).

## 10. Trust / Compliance Footer Elements

- KVK number (TODO placeholder until registered).
- Contact email on the setframe.net domain (not a free gmail/outlook address).
- Reach line (REVISED — Phase 7.2, owner decision): "Poland · Netherlands ·
  Worldwide". No city anywhere on the site; the Organization JSON-LD uses
  `areaServed` instead of a postal address.

## 11. Workflow & Session Rules (for Claude Code / IDE agents)

- PLAN MODE FIRST: before building, review this plan, identify gaps, ask
  clarifying questions. Do not generate code in the first response.
- Build section by section following the checklist below. After completing a
  section, update the checklist in this file and commit.
- Commit + sync to GitHub after every completed section. Never push a broken
  build.
- When the chat context grows long, start a new session and re-attach this
  file. This file is the single source of truth.
- GitHub repo is the source of truth. Deploy via Vercel (auto-deploy on
  commit). Verify preview after every deploy.

## 12. Definition of Done

- [~] Lighthouse Performance score > 90
      Last owner run (on the .vercel.app origin): mobile 90, desktop 98.
      The LCP/Speed-Index root cause was found and fixed AFTER that run
      (template.tsx gated every first paint at opacity:0 behind the wipe;
      intro curtain covered the viewport ~1.25s). NEEDS a re-run on
      setframe.net to confirm the owner's 92+ mobile floor.
- [x] Lighthouse SEO score > 90 — owner run: 100 mobile + desktop.
- [x] Fully responsive and tested on mobile viewport (375px: no horizontal
      overflow, sticky process falls back to a stacked list).
- [~] Contact form verified end-to-end. A submission DOES arrive, but the
      test landed in Formspree's Spam folder. Cause is Formspree's Formshield
      ML filter reacting to test-shaped content ("Test" / test123@gmail.com /
      "I need website."), not our code. Honeypot (_gotcha) + _subject added.
      Re-test with realistic content and mark "Not spam" to train the filter;
      filter aggressiveness is a Formspree paid-plan setting.
- [x] All sections present and populated with real copy (no lorem ipsum).
      Remaining intentional placeholders: KVK number and privacy policy
      ([[ TO FILL ]]); proof block deliberately deferred until a real metric
      exists.
- [x] prefers-reduced-motion respected (full static fallback across intro,
      wipe, marquee, SVG graphics, sticky process, ambient background).
- [x] Deployed and verified live on setframe.net via Vercel.
      Apex A -> Vercel, www CNAME -> Vercel and redirecting to apex, HTTPS
      active, `vercel domains verify` = configured-correctly, zero conflicts.
      A leftover OVH AAAA record on the apex was serving IPv6 visitors the
      wrong host; removed.
- [x] og:image and favicon verified working from the live domain.
      Fetched from setframe.net: og:image 200 image/png (absolute URL on
      setframe.net), favicon 200, robots.txt 200 pointing at
      setframe.net/sitemap.xml, sitemap.xml 200 listing all three routes.
      Owner may still eyeball the social card on metatags.io.

## 13. Build Checklist (update as you go)

- [x] Phase 1: Project scaffold (stack decision, Tailwind config with brand
      tokens, fonts, layout shell, deploy pipeline test with "hello world")
- [x] Phase 2: Hero (copy, CTA, load animation, ambient glow)
- [x] Phase 2.5: "Alive" rework (ADDED after Phase 2 review):
      * CTA font → Syne semibold, CTA target → /contact
      * Background life package (cursor glow + reactive dot grid + grain)
      * Hero corner-fold showcase with real portfolio screenshots
      * /contact page: why-SetFrame block + Formspree form + privacy line
      * Fade page transition between / and /contact
- [x] Phase 3: Proof marquee + Services cards (spotlight hover)
- [x] Phase 4: How we work + FAQ (AEO structure, FAQPage JSON-LD)
- [x] Phase 5: Selected work (Work section) + About (faceless, first-person)
- [x] Phase 6: Final CTA + Footer (compliance placeholders: KVK, privacy [[TO FILL]])
- [~] Phase 7: SEO/OG/favicon/sitemap + Lighthouse pass + mobile QA
      DONE: FAQPage + Organization JSON-LD, metadataBase + OG tags, focus
      states, AA contrast fixes, single-H1 hierarchy, mobile no-overflow +
      stacked fallbacks, reduced-motion parity. Intro curtain, breathing nav,
      hero signature, signature spotlight, sticky process, grain/mesh depth.
      Content-structure decisions (owner):
        * Systems strip is now systems-only (type: "system").
        * Website portfolio split into its own two-up non-scrolling grid
          (type: "website").
        * Proof block DEFERRED entirely (no real metric yet, no fabricated
          quote). Rebuild when a real metric + Aura Capital result exist.
        * About rewritten impersonal (no founder/location/photo).
      Lighthouse hardening (baseline mobile Perf 90 / A11y 92, treat as
      required, need real margin > 90):
        * LazyMotion to shrink the Framer Motion bundle (unused JS).
        * Modern browserslist targets (drop legacy JS/polyfills).
        * Font display swap; confirm no render-blocking head resources.
        * Off-screen animation pausing (content-visibility) for heavy SVG
          graphics; confirm transform/opacity-only where composited.
        * Fix aria-hidden focusable descendants (marquee duplicate links).
        * Cache getBoundingClientRect off the pointer loop (forced reflow).
      DONE — Phase 7 UX + graphics + SEO pass (this pass, see sections 2, 3,
      4, 7, 9 above for detail):
        * Verified live that the systems/websites split was already correct
          in both source and the deployed site; no filter bug existed.
        * Hero SVG signature replaced by the `leak-to-movement.webp` raster
          + compositor-safe breathing glow + parallax; systems strip now
          shows the real Client Response System plus two illustrative
          capability tiles (Automation Hub, System Map), all via
          `next/image`; `system-tower.webp` anchors the systems portion of
          Work. All 5 raster assets render through `next/image`
          (WebP source, explicit `fill`+`sizes`, lazy below the fold; only
          the hero image is `priority`).
        * Section numbering redesigned: shared `SectionNumber.tsx`
          (bracket-beam mark) now used by all five numbered sections; the
          Process sticky rail gained active/inactive weight hierarchy.
        * Anchor nav smooth-scrolls (instant under reduced motion); FAQ rows
          animate open/close via a controlled component (native `<details>`
          replaced, semantics preserved via `aria-expanded`/`role=region`).
        * Contact message field placeholder rotates through varied hints;
          persistent visible `<label>` unchanged.
        * Background gained a default ambient layer (drifting/breathing
          glow + slow mesh/grain pulse) active on every device, including
          touch; cursor-reactive layers remain a fine-pointer enhancement.
        * AA contrast: added `--color-muted` (#8a8a89, verified >=4.5:1 on
          both graphite and surface) and applied it to the 5 confirmed
          failing instances (Footer privacy line, Hero + Process "scroll"
          hints, contact form placeholder, 2 service-graphic SVG labels).
        * Favicon (`src/app/icon.png`, from the [S] mark), og:image
          (`src/app/opengraph-image.png`, hero raster + monochrome
          wordmark), `sitemap.xml`, `robots.txt` (Next file conventions),
          and `public/llms.txt` all shipped.
        * `SITE_URL`/`metadataBase` in `layout.tsx` corrected to the live
          Vercel URL (setframe.net is not registered/live yet) — this also
          fixed the Organization JSON-LD `logo` field, which previously
          pointed at a setframe.net URL that didn't resolve.
      STILL TODO before Phase 8 (owner-blocked, cannot be verified from this
      environment):
        * A real Lighthouse re-run on mobile + desktop, confirming no
          category dropped below the stated floors (mobile Perf 92 / A11y
          96 / Best Practices 100 / SEO 100 / Agentic Browsing 2/2; desktop
          Perf 99) after this pass's changes.
        * Contact form Formspree submission tested end-to-end (a real
          message arrives).
        * Swap `SITE_URL` from the Vercel URL to `https://setframe.net`
          (in `layout.tsx`, `sitemap.ts`, `robots.ts`) once that domain is
          registered and live.
- [~] Phase 7.2: Coded hero + structure + /knowledge (this pass). Bracket
      motif is now reserved for LOGO + BUTTONS only.
      Hero + background:
        * Removed the `leak-to-movement.webp` raster from the hero (no raster
          used as any page/hero/section background). New coded visual
          `HeroVisual.tsx`: an SVG business leaking copper beads along an arc
          into a teal+copper cluster that turns them into rising movement,
          masked with a soft radial falloff so there is no rectangular edge.
          Motion is opacity-only (bead shimmer, node pulse, rising dots) plus
          a small fine-pointer parallax; reduced-motion resolves to a calm
          static state. The hero no longer ships a `priority` image, so the
          H1 is the clear LCP candidate.
        * `LifeBackground` enriched: added an always-on faint dot grid and a
          slow `gradient-shift` bloom (drift + scale + crossfade, 15s) on top
          of the existing glow-drift / mesh / grain, so the background stays
          alive by default on every device including mobile. Cursor glow +
          bright dot grid stay a fine-pointer enhancement. All transform/
          opacity; reduced-motion static.
      Numbering + brackets:
        * `SectionNumber` redesigned to an oversized low-opacity mono ghost
          numeral + a short copper hairline rule (no brackets). Process rail:
          active step large + copper, inactive small + outline, no brackets.
          Stripped `[ 0N ]` from Work, Services, HowWeWork and the contact
          reasons. Removed the hero H1 bracket frame (`BracketMark` no longer
          used) and dropped brackets from non-button text ("← Back", the
          "Message sent" confirmation). Buttons + logo keep the motif.
          NOTE: `SystemSignature.tsx` and `BracketMark.tsx` are now unused
          (left in place — deleting them was outside this pass's stated
          removals; owner can prune).
      Systems strip + /knowledge:
        * Deleted the "systems that keep working after launch" anchor block
          and its tower graphic (`system-tower.webp` removed).
        * New `SystemsStrip.tsx`: 7 unique tiles (Client Response System,
          Lead Capture, Booking Flow, Document Intake, Automation Hub, System
          Map, and a "What is SaaS?" concept tile), two seamless copies so no
          tile sits next to its own duplicate and there is no ~2s repeat.
          Every tile is a real `<a>` to `/knowledge#<slug>` with visible
          focus; the second copy is aria-hidden + `tabIndex -1`.
        * New route `/knowledge` (`src/app/knowledge/page.tsx`): single H1,
          one anchored section per tile (what it is / the leak it fixes /
          what you see), a plain "What is SaaS?" section, and a 3-step "how it
          works" section mirroring the HowWeWork copy. Own title/description +
          OpenGraph; added to the floating nav, footer and `sitemap.xml`.
          All copy is a concise draft flagged `[[REVIEW]]` for owner sign-off;
          no metrics or testimonials invented.
      Content + conversion:
        * Websites consolidated into ONE project shown as two prototypes
          (Aura Capital = Prototype 01, Project Aura = Prototype 02) in a
          single labelled card pair; per-prototype hover preview + view-live
          kept. Data model in `projects.ts` reshaped to `WEBSITE_PROJECT`
          (prototypes[]) + `SYSTEM_TILES`.
        * `ApproachBand` added near About: two sentences on diagnosing each
          business's specific leak (not a template) + `approach/tailored.webp`
          + a quiet "learn more" link to /knowledge.
        * `FinalCta` reworked into a lively banner: a copper current sweeps a
          full-width hairline through one pulsing node into the outcome
          headline + primary button (transform/opacity; static line under
          reduced motion).
        * Contact reasons (`ContactReasons.tsx`): copper line-icons, stronger
          type hierarchy, staggered scroll reveal.
        * Contact message hint now crossfades (opacity) between phrases as a
          decorative aria-hidden overlay; the persistent visible `<label>` is
          unchanged and remains the field's accessible name.
        * Location changed to "Poland · Netherlands · Worldwide" everywhere
          (constants + JSON-LD `areaServed`); no city.
      STILL TODO before Phase 8 (owner-blocked, cannot verify here):
        * Lighthouse re-run (mobile + desktop) confirming no category dropped
          below floor after Phase 7.2 (esp. the coded hero SVG + new
          background layers vs. Perf/CLS, and the new /knowledge route).
        * Formspree end-to-end submission test.
        * Real illustration/screenshots stay owner-supplied; `leak-to-
          movement.webp` is currently unused (freed from the hero) and may be
          repurposed on /knowledge or removed.
- [~] Phase 7.3: Micro-polish (this pass). Two targeted motion additions; the
      bracket rule gains ONE sanctioned inline exception.
        * Process rail (`HowWeWork` + new `StepMotif.tsx`): each of the three
          steps now has a tiny (~24px) motif next to its heading, matched to
          the copy — step 01 "a conversation" = three typing/exchange dots,
          step 02 "a working preview" = a small frame with a scan line drawing
          down, step 03 "the system keeps working" = a steady core with an
          expanding pulse ring. transform/opacity only; each motif is paused
          unless it is the active step (reuses the existing `active` state via
          a `.step-motif[data-active="false"]` CSS gate); static under reduced
          motion.
        * About section (`About` + new `AboutPipe.tsx`): a subtle ambient
          background — a copper current travels a curved, organic path
          (stroke-dashoffset; the one scoped exception to transform/opacity for
          this pass, kept faint and paused off-screen) with three brief
          leak/catch bursts (opacity/scale) that flash and vanish. Paused
          off-screen via IntersectionObserver (`.about-pipe[data-visible]`),
          static under reduced motion. Kept at low opacity (container 0.5,
          faint copper strokes).
        * Contrast (HARD requirement) re-verified: About body text is
          `text-foreground/80` (light on dark). Worst realistic case (the
          brightest travelling dash directly behind a glyph, ~0.21 effective
          copper alpha) computes to 8.8:1; even an implausible 0.5 alpha stays
          5.48:1 — comfortably above AA 4.5:1. The pipe cannot pull the body
          text below AA.
        * Inline logo mark (`LogoMark.tsx`): the first "SetFrame" in the About
          copy now renders as the wordmark inline ("Set" + bold "Frame" in
          copper brackets). This is the single sanctioned inline reuse of the
          bracket motif; brackets are aria-hidden so assistive tech still reads
          "SetFrame". No other bracket usage was added.
      STILL TODO before Phase 8 (owner-blocked): the same Lighthouse re-run
      and Formspree E2E as Phase 7 / 7.2.
- [~] Phase 7.4 / 7.5: mobile Perf recovery (invisible to users; no UX change).
      Owner Lighthouse runs showed mobile Perf slipping (92 → 91 → 87 → 89)
      with Speed Index the weak metric (~5s), because the coded hero + the
      full-viewport ambient background were animating from the first frame and
      keeping the early filmstrip "in motion".
        * P7.4: restored the idle-gate the previous raster hero had — the
          HeroVisual SVG animations now pause until requestIdleCallback after
          first paint.
        * P7.5: extended the same idle-gate (shared `useAnimateAfterIdle` hook
          + `.anim-gate`) to the whole `LifeBackground` layer stack (glow drift,
          mesh, gradient shift, grain) and the hero glow blob. They resume a
          beat after first paint — imperceptible against the graphite base, so
          nothing changes from the visitor's perspective, but the early frames
          Speed Index weights most are now static.
      Owner must re-run mobile Lighthouse to confirm Perf clears the 92 floor.
      If it still falls short, the next (still invisible) lever is trimming the
      hero bead count / converting bead motion to compositor-friendly transforms
      to clear the "non-composited animations" diagnostic. LCP (~3.2s mobile) is
      font-swap bound and not worth chasing without a type change (a UX change),
      so it was left alone.
- [x] Phase 8: Final deploy to setframe.net — LIVE.
      Domain:
        * setframe.net + www.setframe.net attached to the Vercel project.
          Apex A -> 216.198.79.1 / 64.29.17.1, www CNAME -> Vercel and
          redirecting to the apex. HTTPS active.
        * `vercel domains verify setframe.net` = ok / configured-correctly,
          conflicts: []. 
        * ROOT CAUSE worth remembering: after the A/CNAME records were set,
          the domain still failed verification and was unreachable over IPv6.
          A leftover OVH AAAA record (2001:41d0:301:5::29) remained on the
          apex, so IPv6-preferring clients (most mobile carriers) resolved to
          OVH instead of Vercel — a silent partial outage invisible to anyone
          testing over IPv4. Removing the AAAA fixed verification immediately.
          When cutting a domain over, always check AAAA, not just A.
      Cutover:
        * SITE_URL centralised in src/lib/constants.ts, so one line moved
          metadataBase, og:image, og:url, Organization JSON-LD, sitemap and
          robots together. This is the guard against the past critical bug
          where a partial swap left og:image on the wrong origin.
        * Verified live from setframe.net: og:image 200 image/png on an
          absolute setframe.net URL, favicon 200, robots.txt 200 pointing at
          setframe.net/sitemap.xml, sitemap.xml 200 with all three routes,
          /contact + /knowledge 200, honeypot present on the live form, no
          .vercel.app origin anywhere in the build output.
        * Organization JSON-LD description was still "Founder-operated
          studio", contradicting the impersonal-About decision. Fixed —
          answer engines quote that field verbatim.
      Perf fixes shipped alongside (need an owner re-run to score):
        * template.tsx runs on initial load, not just navigations, so the
          bracket wipe wrapped every first paint in opacity:0 for 250ms
          (content at opacity 0 is ineligible for LCP) behind two opaque
          full-screen panels for ~550ms. Wipe now plays only on client-side
          navigations.
        * Intro curtain (opaque, ~1.25s — exactly what Speed Index measures)
          skipped on phones, trimmed to 700ms elsewhere.
      REMAINING (owner):
        1. Lighthouse re-run on https://setframe.net (mobile floor 92+).
        2. Contact form re-test with realistic content; mark the earlier test
           "Not spam" in Formspree to train Formshield.
        3. Optional: eyeball the social card on metatags.io.
        4. Fill KVK number + privacy policy; add a real metric to restore the
           deferred proof block.
