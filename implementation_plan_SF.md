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
- Raster illustrations (ADDED — Phase 7 UX pass, do not regenerate).
  CURRENT (Phase 9, verified against `public/`): seven isometric renders in
  `public/systems/` driving the systems strip / `/knowledge` tiles —
  `response-system.webp`, `lead-capture.webp`, `booking-flow.webp`,
  `document-intake.webp`, `automation-hub.webp`, `system-map.webp`, and the
  "What is SaaS?" concept tile `saas.webp` — plus `public/approach/
  tailored.webp` and three `public/process/` step images (Phase 9). All
  share the graphite backdrop so they blend into the site background.
  ORPHANED (owner decision: leave as-is, do not delete): `public/hero/
  leak-to-movement.webp` was the original hero art, replaced by the coded
  `HeroVisual.tsx` SVG in Phase 7.2. It has zero references in `src/` and is
  NOT the OG image source (that is `public/brand/opengraph-source.png`,
  Phase 8, a separate asset) — the two are easy to confuse since both are
  copper/teal hero-style art. `public/systems/system-tower.webp` (the
  earlier systems-section anchor) was deleted in Phase 7.2 along with the
  section it anchored.
  The SVG pulse/motion vocabulary (`.flow-dash`, `.flow-node`, etc.) stays in
  use elsewhere (Services graphics) and as compositor-safe overlays where it
  still reads well on top of a raster.

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

CURRENT on-page order (Phase 9, verified in `src/app/page.tsx`): Hero →
Services (01) → Work (02, merges the website prototypes and the systems
strip — see items 2 and 5 below, kept separate here for history) → How we
work (03) → About (04) → Approach band → FAQ (05) → Final CTA → Footer.
The numbered list below is grouped by TOPIC, not page order; where a number
is given it is the on-page section numeral, current as of Phase 9.

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

2. **Systems strip** — lives inside the `Work` section (02), not standalone
   (REVISED — split by content type, owner decision)
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

3. **Services** — section 01 (RENUMBERED — Phase 9, was 02; now the first
   section after the hero so the broad capability statement is not preceded
   by the narrower Work/proof section; see section 4 top note and Phase 9
   checklist).
   - Three cards: Websites / Content Systems / Business Automation.
   - Card numbering: plain copper mono numerals (01 / 02 / 03) — NO brackets
     (bracket rule, Phase 7.2).
   - Each card: outcome-first title, 2-3 sentence description, no tech jargon,
     no "AI" in titles.
   - Hover: subtle scale + copper border shift + spotlight effect (see section 7).

4. **How we work** — section 03 (3 steps, buyer's perspective, AEO-friendly)
   - Frame as question → answer where natural
     (e.g. "How does a project start?").
   - Step numbering: plain numerals, NO bracket motif (Phase 7.2).
   - CURRENT (SUPERSEDES the sticky scroll-rail + StepMotif micro-animation
     described in the history below) — Phase 9: a static 3-column grid
     (stacked on mobile), no sticky positioning, no scroll-triggered step
     advance. Each step: a thin copper line icon, a non-overlapping ghost
     numeral, the existing question as title, the existing answer as
     description, and a supporting image from `public/process/` below. One-
     time Reveal fade-in only. Server component, no client JS.
   - HISTORY (superseded): Phase 7.3 added a sticky number rail (desktop) with
     a small thematic micro-animation next to each step's heading
     (`StepMotif.tsx`), paused unless active. `StepMotif.tsx` is left in the
     repo but is now unused dead code (owner can prune).

5. **Selected work — website portfolio** — lives inside the `Work` section
   (02, headed "Built and running", Phase 9) alongside the systems strip
   (item 2 above), not standalone.
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

6. **About** — section 04 (REVISED — impersonal, owner decision)
   - No founder-personal framing: no bio, no location-as-personal-detail,
     no photo or photo placeholder.
   - Impersonal studio description: what SetFrame is, what it specializes in,
     how it helps the visitor's business. 3-4 sentences, outcome-first
     (section 6 copy rules).

7. **FAQ** — section 05 (objection handling, AEO-friendly)
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
  SHIPPED — Phase 7 UX pass: `SectionNumber.tsx` is the shared component used
  by all five numbered sections. CURRENT numbering (Phase 9, RENUMBERED —
  Services and Work swapped so the broad capability statement comes first):
  Services [01], Work [02], Process [03], About [04], FAQ [05]. Design
  UPDATED — Phase 9: the numeral moved from an absolute watermark behind the
  heading to an in-flow block above it (so it can never overlap text), no
  longer has the bracket-corner tick detail, still paired with a copper line
  that draws in (scaleX + opacity) once on section-enter.
  Process rail weight hierarchy (active large + copper-filled, inactive small
  + outline) — SUPERSEDED, Phase 9: the sticky rail no longer exists; "How
  we work" is now a static 3-column grid (see section 4, item 4).
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
      HISTORY: on setframe.net, mobile 90 (desktop 98) after the Phase 8
      cutover, confirmed by the owner as sufficient after a two-step journey —
      an interim run scored 86 (an accounting artefact: every visual metric
      had improved, but fixing the opacity:0 first paint also pulled hydration
      cost inside the TBT measurement window). Root cause fixed by moving 15
      Framer Motion scroll-reveal components to CSS + one shared observer.
      See Phase 8 for the full account.
      SINCE THEN (Phases 7.2-9, all landed after that measurement): coded
      hero SVG, richer ambient background, new /knowledge route, per-section
      micro-animations, and the Phase 9 restructure/redesign all touched
      Perf-relevant code. Owner re-runs during this stretch tracked
      91 -> 87 -> 89 -> 90/92 (mobile/desktop) as fixes landed (idle-gating
      the hero + background animations, Phase 7.4/7.5).
      RE-VERIFIED after Phase 9 (hero edge fix, numeral reposition, section
      reorder, static HowWeWork grid, contact form change): mobile 90 /
      desktop 98, all other categories 100, CLS 0, no regression. Owner
      accepted mobile at 90 (2 under the stretch floor; Speed Index 4.8s and
      LCP 3.1s are font-swap/filmstrip bound, not fixable without a visible
      UX change) rather than chase the last points. See Phase 9 in section
      13 for the full detail.
- [x] Lighthouse SEO score > 90 — owner run: 100 mobile + desktop.
- [x] Fully responsive and tested on mobile viewport (375px: no horizontal
      overflow, sticky process falls back to a stacked list).
- [~] Contact form verified end-to-end. A submission DOES arrive, but the
      test landed in Formspree's Spam folder. Cause is Formspree's Formshield
      ML filter reacting to test-shaped content ("Test" / test123@gmail.com /
      "I need website."), not our code. Honeypot (_gotcha) + _subject added.
      Re-test with realistic content and mark "Not spam" to train the filter;
      filter aggressiveness is a Formspree paid-plan setting.
- [~] All sections present and populated with real copy (no lorem ipsum).
      Privacy policy now real (/privacy). Remaining intentional placeholders:
      KVK number ([[ TO FILL ]] in the footer); proof block deliberately
      deferred until a real metric exists.
- [x] prefers-reduced-motion respected (full static fallback across intro,
      wipe, marquee, SVG graphics, sticky process, ambient background).
- [x] Deployed and verified live on setframe.net via Vercel.
      Apex A -> Vercel, www CNAME -> Vercel and redirecting to apex, HTTPS
      active, `vercel domains verify` = configured-correctly, zero conflicts.
      A leftover OVH AAAA record on the apex was serving IPv6 visitors the
      wrong host; removed.
- [x] og:image and favicon verified working from the live domain, and
      reviewed by the owner on metatags.io. Title/og:title shortened to 54
      characters (was 62, truncating on X/LinkedIn/Google); og:image is now
      a generated composite with a small caption under the wordmark instead
      of a static file.

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
          NOTE: `SystemSignature.tsx` and `BracketMark.tsx` became unused
          here — DELETED in Phase 7.4 housekeeping (see below), so this is no
          longer an open item.
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
      Lighthouse re-run (owner, on setframe.net):
        * First pass: Performance 86 (down from the earlier 90 measured on
          the .vercel.app origin). Every visual metric improved (FCP 1.4->1.1s,
          LCP 3.3->2.7s, Speed Index 4.1->3.8s, CLS 0) and the black-curtain
          frame was gone from the filmstrip, so this was accounted for, not a
          regression: TBT is measured from FCP onward, and moving FCP 300ms
          earlier pulled hydration work inside the measurement window
          (20ms -> 380ms). TBT carries ~30% weight, which swamped the gains.
        * Root cause: Reveal (15 instances) and SectionNumber (one per
          section) each mounted a Framer Motion component purely to fade
          content up or draw a hairline, effects plain CSS does natively.
          Both converted to server-rendered markup driven by CSS transitions,
          with ONE shared IntersectionObserver (RevealObserver) adding
          .is-visible. ~23 fewer motion components hydrate; visually
          identical. Hidden start state is scoped to html.js (set inline,
          before body parses) with an inline 4s failsafe that drops the class
          if RevealObserver never arms, so a broken observer shows content
          instead of leaving it invisible forever.
        * Re-run after the fix: Performance 90, confirmed by the owner as
          sufficient to proceed rather than chase the original 92+ floor
          further. Accessibility 100, Best Practices 100, SEO 100.
      Metatags.io review (owner) — three fixes applied:
        1. Title + og:title were 62 characters, truncating on X/LinkedIn/
           Google. Shortened to "SetFrame — Websites and systems that run
           your business." (54 characters).
        2. og:image was a static PNG. Converted to a generated route
           (opengraph-image.tsx via next/og ImageResponse) that composites
           the original artwork (now public/brand/opengraph-source.png) with
           a small caption, "catch what slips away", directly under the
           baked-in wordmark. Minimal, light-coloured, legible at thumbnail
           size; the artwork itself is untouched.
        3. Confirmed correct: favicon, robots.txt, sitemap.xml.
      Privacy policy (owner: "find one similar to our business, adapt it"):
        * New /privacy page: controller identity, what is collected (contact
          form fields only — name, email, preferred contact method, message),
          why (replying to the enquiry, nothing else), who sees it (named:
          Formspree, as the form processor), retention, data-subject rights,
          right to complain to a local data protection authority, and a
          changes note. Deliberately jurisdiction-neutral (KVK is not filed
          yet, so no claim of formal Dutch incorporation).
        * Footer's "[[ TO FILL ]]" placeholder now links to /privacy. The
          contact form's short privacy line now links to it too (best
          practice is a link directly at the point of collection, not just
          the footer). Added to sitemap.xml at low priority.
      STILL OPEN (owner-only):
        * KVK number in the footer.
        * A real metric to restore the deferred proof block.
        * Contact form re-test with realistic content; mark the earlier spam
          -folder test "Not spam" in Formspree to train Formshield.
      NOTED, NOT FIXED (pre-existing, predates this pass, out of scope per
      "no other changes"): a React hydration console warning on <html
      className> appears in dev mode on every route. Traced to the
      classList.add('js') inline script added for RevealObserver, which
      needs suppressHydrationWarning on <html> to silence cleanly (standard
      fix for this pattern). Does not affect rendered output and Best
      Practices still scores 100, so left alone rather than touched under an
      explicit no-other-changes instruction.

- [~] Phase 9: Clarity pass (structure, naming, hero edge, process redesign)
      + a contact-form field tweak. External review drove this.
      Hero background edge (Task 1): the coded hero SVG was capped at
      `max-w-5xl` and centred, so on wide viewports it read as an inset panel
      with graphite "bars" either side. Removed the width cap so the SVG spans
      the full viewport and fades out via its radial mask (widened to
      `ellipse 72% 62% ... transparent 92%`); verified at 1920px it now fills
      the width with no hard edge.
      Section numeral overlap (Task 2): `SectionNumber`'s ghost numeral was an
      absolute watermark behind the heading and clipped into the text on some
      breakpoints. It is now an in-flow block ABOVE the heading (smaller,
      faint), so it can never overlap heading/body at any width. Verified no
      overlap across all five numbered sections at mobile + desktop.
      Scope narrative (Task 3, owner chose "reorder"): the broad capability
      statement ("What gets built", Services) now comes FIRST, right after the
      hero (renumbered 01); the portfolio + systems strip (Work, renumbered
      02) follows as ONE cohesive proof section headed "Built and running."
      Its intro states both sides (websites live + systems running); the
      website-only "why websites" lines that re-narrowed the framing were
      replaced with that both-category intro (no service removed — websites
      are still in Services and shown as prototypes). The systems strip subhead
      is reframed as "The systems side of the same work" so it ties back to the
      capability list instead of reading as a separate, narrower offering.
      Process redesign (Task 4): "How working together goes" dropped the
      sticky scroll-rail + continuous StepMotif animation for a static 3-column
      grid (stacked on mobile). Each step: a thin copper line icon, a
      non-overlapping ghost numeral, the existing question as title, the
      existing answer as description, and a supporting image below. Images are
      the owner's public/process/ art, which arrived mis-named and oversized
      (discovery.webp.jpg 70KB, preview.webp.png 1.96MB, ongoing.webp.png
      1.68MB); converted to real optimised .webp at the correct paths
      (16/38/33 KiB) and removed the originals. One-time Reveal fade only, no
      scroll-driven motion. HowWeWork is now a server component (no client JS);
      `StepMotif.tsx` is left in place but unused (deleting was outside this
      pass's scope).
      Preserved (Task 5, confirmed untouched): hero ambient glow blob,
      systems-strip / website-card cursor spotlight, FinalCta "leak reversed"
      banner, ContactReasons staggered reveal.
      Contact form (owner request, separate from the review): the "preferred
      contact method" select is now controlled and moved above the contact
      field; choosing "Phone call" or "Video call" swaps the Email row for a
      Phone number row (label / name / type=tel / autocomplete / validation all
      switch, visible label stays correct). Note: a phone-preference submission
      carries no email, so the reply happens by the requested call, not email.
      OWNER must re-run Lighthouse on setframe.net to confirm no category
      regressed (verification not possible from here). Build passes, no new
      console errors (the pre-existing <html> hydration dev-warning is
      unchanged and unrelated).
      Lighthouse re-run (owner, post-Phase-9, on setframe.net): mobile
      Performance 90, Accessibility 100, Best Practices 100, SEO 100,
      Agentic Browsing 3/3; desktop Performance 98. CLS 0 on both. No
      category regressed. Mobile sits 2 points under the original 92 stretch
      floor (Speed Index 4.8s and LCP 3.1s the soft spots, both already
      diagnosed in Phase 7.4/7.5 as font-swap/filmstrip bound, not something
      fixable without a visible UX change). Given the repeated diminishing
      returns across Phases 7.4/7.5/9 and the explicit "not at all costs"
      instruction, treated as accepted rather than chased further unless the
      owner decides otherwise.

## 14. Iteration 3 — Architecture & Breadth Revision

Triggered by a third-party review and an independent code read, both landing
on the same root cause: the page introduced up to 9 named things (3
illustrated services + 7 thin system tiles, one of which, "What is SaaS?",
was course-glossary content, not a delivered system) with badly uneven visual
weight. Two things got full illustration, seven got a name and a tagline —
visitors remembered the two illustrated things and forgot the rest, producing
a "websites, then a pile of stuff, then just websites again" impression.

**Non-negotiable constraints for this iteration** (owner-set, override
anything earlier that conflicts):
- The site is not niche-targeted. Financial-advisory framing stays confined
  to the two existing website prototypes; nothing else should read as built
  for one industry.
- No course terminology surfaces verbatim anywhere on the page.
- The offering is broader than websites + documents + chat: lead capture,
  high-volume personalized outreach, e-commerce, dashboards/Python tooling,
  specialized LLM skill-building all belong on the page.
- No FAQ hedging about scope or client history (there are zero clients yet).
  Confident, capability-forward language now; revisit once real proof exists.
- No fixed pillar count. The organizing principle is visual consistency and
  trust, not a compressed feature list.
- Every card leads with the pain the visitor already feels; the mechanism is
  the supporting line, never the headline.

**Graphics**: before writing any code, five new isometric illustrations were
requested from the owner (this style cannot be generated in-session — it is
AI-rendered raster art, confirmed by direct visual inspection of the existing
assets) with an explicit brief per image. All five arrived matching the
established grammar exactly (dark graphite background, copper+teal glowing
isometric forms, connector lines, floating node cubes, no baked-in text):
`site-conversion.jpg`, `instant-reply.jpg`, `outreach-scale.jpg`,
`storefront-cycle.jpg`, `skill-assembly.jpg`.

**Task 1-2 — unified capability gallery** (`src/lib/projects.ts`,
`src/components/Services.tsx`): `SYSTEM_TILES`/`SystemTile` renamed to
`CAPABILITIES`/`Capability`. Ten cards now share identical visual treatment
(isometric image, pain-led headline, one outcome line), replacing both the
old 3-card Services grid and the old 7-tile systems marquee:
Websites / Automated response & booking / Document processing / Lead capture
/ High-volume outreach / E-commerce / Dashboards & Python tooling /
Specialized LLM skill-building / Automation Hub / System Map (the last two
kept as bonus cards per owner decision — real capabilities, not forced into
the original 8-item table). Asset reassignment: `response-system.webp`'s
actual imagery (bar chart, gauge, database icons) reads as a dashboard, not
"instant reply," so it now illustrates Dashboards; the response/booking card
uses the new `instant-reply.jpg`. "What is SaaS?" is fully removed from the
gallery/strip — it already lived in its own hardcoded, visually separate
section on /knowledge (never data-driven from the tile array), so removing it
from `CAPABILITIES` was sufficient with no template changes needed there.
Coded SVG components (`ServiceGraphics.tsx`, its three `Graphic*` exports)
and the old marquee (`SystemsStrip.tsx`) are deleted, not left unused —
keeping them would have reintroduced the exact two-illustration-language
inconsistency this iteration exists to fix.

**Task 3 — nav simplification** (`FloatingNav.tsx`): "Systems" removed as a
top-level destination. Nav is Work / Services / FAQ (+ Contact), matching the
3-item acceptance criterion. /knowledge stays reachable: every gallery card
links to `/knowledge#slug`, plus a "See how each one works" link under the
gallery, plus the existing ApproachBand link — contextual, not competing.

**Task 4 — hero clipping fix** (`HeroVisual.tsx`): `preserveAspectRatio`
changed from `xMidYMid slice` to `xMidYMid meet`. Slice mode scaled the SVG
to cover its container, cropping whichever axis overflowed; on a tall/narrow
viewport (most phones) the business-glyph rectangle near the left edge got
sliced through, reading as "the border is cut off." Meet mode never crops,
only adds empty space on the non-matching axis. Verified at 320px width
directly: the glyph's bounding rect stays fully inside the SVG's rendered
box.

**Task 5 — FAQ confidence** (`src/lib/faq.ts`): "Do you only work with
financial firms?" rewritten from "financial firms are a focus, not a limit"
(itself a hedge) to naming the broadened capability range as the evidence of
breadth, with no claim of client history that doesn't exist. Other FAQ
answers already stated general capability/timeline, not client history, so
needed no change.

**Task 6 — visual consistency**: achieved by construction, not audited
separately — all 10 gallery cards render from one card template (same image
treatment, same hover: lift + border + ambient glow, same anatomy), so there
is one illustration language on the page, not two.

**Task 7 — verification performed in this session** (owner should still spot
-check visually; the screenshot tool was unreliable again this session, so
this was verified via direct DOM measurement, which is more precise than a
visual glance for confirming zero overlap):
- 320px width: hero glyph rect fully within the SVG's rendered box (no
  clipping); every numbered section's ghost numeral sits with a clean ~12px
  gap above its heading, zero overlap, across all 5 numbered sections.
- Desktop width: same, zero overlap, zero clipping.
- Gallery: all 10 cards confirmed rendering with correct pain-led headline,
  correct outcome line, correct image, in the live DOM.
- Nav confirmed at exactly 3 items (Work / Services / FAQ).
- Work section confirmed showing only the 2 website prototypes, no
  duplicate systems content.
- FAQ confirmed rendering the rewritten financial-firms answer on click.
- /knowledge confirmed rendering all 10 capability sections plus the
  separately-framed SaaS explainer (first, no image, distinct treatment).
- Build passes clean; no new lint errors introduced (two pre-existing
  `setState`-in-effect errors in `template.tsx` and `IntroCurtain.tsx` are
  unchanged, unrelated to this iteration, and were already flagged to the
  owner in an earlier pass as intentionally left alone).

---

## Iteration 4.2 — owner review (5 items)

### 1. Movement pillar graphic → v2
`movementv2.png` (1.9MB) converted to WebP (72KB) and wired into pillar 1.
Alt rewritten: v2 is a cinematic knight-move close-up with a copper light
trail, and the previous alt described labelled milestones ("time back, leads
that stop going cold…") that do not exist in the new image. v2's 1.50 aspect
also fills the `aspect-[4/3]` ArtFrame better than the square file it replaced
(1.00), so letterboxing decreased rather than increased.

### 2. Mobile: back-navigation left only the hero visible — REAL FIX
Symptom: on mobile, /contact → Back showed only the hero until a manual
refresh. The hero is the only section with no `[data-reveal]`, so "only the
hero is visible" is precisely the signature of every scroll reveal stuck at
its hidden state.

Could NOT be reproduced in tooling: the automation browser runs its tab at
`visibilityState: "hidden"`, which freezes IntersectionObserver delivery, so
reveals fail there even on a plain first load. A first "reproduction" was
discarded as a false positive after a control test proved IO never fires in
that tab at all. Diagnosis therefore came from the code, and the fix was
designed to hold regardless of which mechanism was actually failing.

Root problem: `RevealObserver` had **no recovery path**. Nodes were being
observed correctly (verified: 29 `observe()` calls across a navigation), but
if IO failed to deliver for any reason, content stayed invisible forever with
no error — the same failure class as the old `template.tsx` opacity:0 bug, and
the same rule applies: content must never depend on a single mechanism
succeeding in order to be visible.

Fix: IO stays the primary path, backed by a geometric sweep that reveals
anything at or above the viewport bottom using `getBoundingClientRect` alone.
It runs on route change (`usePathname`), on `pageshow` (bfcache restores), and
throttled on scroll, and the scroll listener detaches itself as soon as
nothing is left hidden. The sweep deliberately does not also test
`rect.bottom > 0` — that would skip elements already scrolled past and strand
hairlines above the fold when a fast scroll outruns it.

Verified against the worst case: with IO fully frozen, **25/25 reveals
recover**, including after /contact → Back.

### 3. Contact form broke under Chrome Translate — root cause was NOT the crash
Initial hypothesis (React/Translate `removeChild` conflict) was **wrong** and
was disproved by simulation: rewriting every text node in the form produced
zero React errors, and the swap still failed.

Actual cause: the `<select>` used `<option>Email</option>` with **no `value`
attribute**. An option with no value takes its value from its own text, so
Chrome Translate rewriting the labels changed the selected *value* to the
translated string. `method === "Phone call"` could then never match and the
field silently refused to switch — which is exactly why the bug appeared only
with translation on.

Fix: explicit `value` on every option. Translate rewrites visible text but not
attributes, so the value is stable in every language, and the submitted
`contactMethod` now always arrives in the inbox in English rather than in
whatever language the visitor was reading.

Hardening kept alongside it (correct in its own right, prevents the crash
class): the email and phone rows are both always mounted and swap via
`[hidden]` + `disabled` instead of conditional rendering, and the rotating
message hint crossfades stacked spans instead of mounting/unmounting a text
node every 3.5s. `disabled` matters as much as `hidden` — a hidden-but-enabled
required field blocks submission with a message the visitor cannot see, and
disabled controls are omitted from the payload. Enter motion moved to a CSS
keyframe (`.field-enter`), which replays on `display:none` → displayed, so the
swap stays animated with no mount/unmount and nothing the field depends on to
exist. Verified: with all 16 text nodes translated, both swap directions work
with zero errors.

### 4. Mobile nav CTA
Font dropped a step on phones only (`text-[11px]`, `sm:text-xs`). The font was
only half the problem: "[ Start a conversation ]" wrapped onto **three lines**
at 390px, inflating the whole pill to 67px tall — that was what read as "too
big". Full label set to nowrap would need ~128px beside Work/Services/FAQ and
overflow a 390px screen, so phones get "[ Start ]" and `sm:` and up keep the
full label. `aria-label` carries the complete wording at every breakpoint, so
the accessible name never changes. Result: pill 67px → 42px, one line, fits
with ~51px margins each side.

### 5. Copy — what is being sold, time frames, outcomes over descriptions
**What is sold.** The hero never stated the transaction. Added one mono line
under the sub-headline — deliberately a spec line, not another paragraph, as
the page already carries a lot of prose: "Websites and business systems, built
to order. 7 days to a working version, 30 days to full rollout," with both
numbers in copper. Reinforced with a new first FAQ, "What do you actually
build?", which also strengthens the FAQPage structured data for AEO.

**Time frames** (owner's own numbers: 7 days = quick win, 30 days = full
rollout with measured change). Applied in four places only, not everywhere:
hero spec line, process step 03 ("weeks, not months" → "live in 7 days and the
full build in 30"), and two FAQ answers ("a few days" → "two working days";
"two to four weeks / add one to two weeks" → 7-day quick win, 30-day complete
project). `/knowledge` step 03 updated to match.

**Descriptions → outcomes.** All ten capability `outcome` lines rewritten to
name what changes for the client rather than what gets installed, e.g. "Real
numbers, live, in one place" → "You know today's numbers today, not at month
end"; "Tasks that used to take a person now run themselves" → "Work that
filled hours every week hands itself back". The ten pain `headline`s are
untouched, per the standing constraint. Marquee symmetry re-verified after the
rewrite: all cards still 420×176 with identical 104px text blocks, nothing
clipped, and the line spread actually tightened from 3–5 to 1–3.

Process step 01 now writes the goal as a commitment: "…then write the goal as
one sentence you can hold me to: quote turnaround goes from two days to two
hours, inside 30." Pillar 1 states the outcome-vs-description rule outright:
"A three-hour job that comes back as thirty minutes is a result. A new
dashboard is not."

**HONESTY LINE HELD — owner decision may be needed.** SetFrame has no clients
yet, so no line claims a measured past result. Delivery windows (7/30 days)
are the owner's own promise and are stated flat. Before→after magnitudes are
framed as what the build targets or as the definition of what counts as a
result — never as a case study. If the owner wants harder numbers on the page,
they must come from a real delivered project.

---

## Iteration 5 — SEO/AEO foundations + design-safe mobile perf pass

### Premise correction (verified in-repo, not assumed)
The brief assumed structured data, sitemap, and robots were probably missing.
They already existed and were correct:
- `Organization` JSON-LD in `layout.tsx`, `FAQPage` JSON-LD in `page.tsx`.
- `sitemap.ts` (/, /knowledge, /contact, /privacy), `robots.ts` (allow all +
  sitemap ref).
- Fonts already `next/font` + `display:swap`; modern `.browserslistrc`.
So Tasks 2 & 4 became verification, Task 3 a small enhancement.

### T1 — KVK removed
Deleted the `KVK [[ TO FILL ]]` footer line and the now-unused `KVK_NUMBER`
constant. No placeholder anywhere on the site. Verified in built HTML + live.

### T2 — FAQPage schema (verify)
Schema and the visible FAQ both map over the same `FAQ_ITEMS`, so they mirror
verbatim by construction. Confirmed live: 6 Q/A pairs, schema text ===
rendered button text exactly.

### T3 — Organization contactPoint (add)
Added `contactPoint {ContactPoint, customer support, hello@setframe.net}`.
Deliberately minimal: no phone, no availableLanguage (site is English-only, so
Polish would be unsupported by anything on the page), no sameAs (no live
socials). areaServed order matches the footer's visible LOCATION text.

### T4 — sitemap/robots (verify)
Both already correct; left as-is. Confirmed `/sitemap.xml` and `/robots.txt`
resolve live.

### T5 — mobile performance: diagnosis-first, one safe fix, one flagged tradeoff
Real Lighthouse (run locally against the prod build, since the bash sandbox has
no external HTTPS) plus live DOM measurement established the facts:

- **The mobile LCP element is the H1 heading TEXT** (~58,860px^2, ~3x anything
  else), set in Syne — NOT an image.
- **Observed (raw trace) FCP and LCP are both 136ms** — the heading paints
  instantly; fonts finish at ~35ms; render-blocking CSS shows 0ms savings.
- The reported ~3.6s mobile LCP is a **Lantern SIMULATION artifact**: 87% of it
  is modeled "Render Delay" (main-thread contention under 4x CPU throttle),
  driven by the framer-motion hydration graph — even though observed render
  delay is ~0 and TBT is 20ms.

**Applied (safe, zero design change): fixed two inverted loading priorities.**
- Hero wordmark (above the fold) was `loading="lazy"` -> `priority`.
- Foundation pillar 1 was `priority`+`eager` but sits ~1080px down, below the
  fold on both breakpoints -> now `lazy` like pillars 2/3. Its preload had been
  competing with above-the-fold resources on the throttled mobile pipe.
Image `sizes` were audited and are already correctly scoped (no over-serving of
desktop widths to mobile — the brief's hypothesis there was not confirmed).

**Flagged tradeoff (NOT resolved unilaterally, per the constraints).** The only
lever that would meaningfully move the *simulated* mobile LCP is reducing the
initial framer-motion/hydration JS. But framer-motion is on the critical path
via ABOVE-the-fold protected design: the living nav pulse (`NavWordmark`), the
ambient `LifeBackground`, `IntroCurtain`, and the `MotionProvider` LazyMotion
root. Code-splitting the only below-the-fold client pieces (`Faq`,
`BrowserFrame`) cannot remove framer from the initial load because the nav and
background already require it, so the payoff is ~0. The marquee is already a
zero-JS server component, so the brief's "lazy-mount the marquee's JS"
suggestion is moot. Moving the number further would mean stripping animation
from the above-the-fold design, which the constraints forbid. Real-world paint
is already instant (136ms), TBT 20ms, CLS 0.

**Measured (local prod build; local != field environment):**
- Desktop: Performance 100 (no regression; field baseline 98).
- Mobile: Performance 89 (field baseline 88), FCP 0.9s, LCP 3.6s (simulated;
  observed 0.136s), TBT 20ms, CLS 0, Speed Index 3.3s (down from field 4.8s).
Authoritative after-numbers should come from PageSpeed Insights on the live
HTTPS site; local Lighthouse absolute values are not directly comparable.

---

## Iteration 6 — polish pass + /services and /about

### T1 Pillar framing
object-contain -> object-cover in one shared 4:3 ArtFrame. Native ratios were
1.50 / 1.38 / 1.00, so contain letterboxed each panel differently. Verified
identical after: 347x260 box, 1px border, 12px radius on all three.
The contain was originally required because an EARLIER generation of this
artwork had legend text baked into the image. Opened all three files first to
check: the current ones are plain cinematic photographs with no text, so the
constraint no longer applies. Stale alt text on pillars 2 and 3 (describing
labels and a plaque that are not in the images) corrected at the same time.

### T2 Uneven mono letters — brief's diagnosis was wrong
All three hypotheses in the brief were disproven by measuring computed style:
IBM Plex Mono resolved and was loaded on BOTH elements, weight was correct
(400), font-feature-settings was `normal`, font-stretch `100%`.

Actual causes:
1. Tagline had `letter-spacing: 3px` (0.25em) on a MONOSPACE face at 12px —
   10x the tracking of every other mono element on the site (0.3px), which is
   why only this label showed it. Tracking is self-defeating on monospace:
   every glyph already sits in an identical advance box, so narrow characters
   carry large side bearings that extra tracking doubles. Now 0.1em.
2. The nav pill rendered THREE typefaces at once — Syne 700 wordmark, IBM Plex
   Mono links, Syne 600 CTA. The CTA is now mono and matches the links exactly.
   The wordmark stays Syne; a logo is legitimately its own treatment.

Before/after computed:
- tagline: IBM Plex Mono 400 3px  ->  IBM Plex Mono 400 1.2px
- nav CTA: Syne 600 normal        ->  IBM Plex Mono 500 0.3px (== nav links)

### T3 Hero scrim — first implementation measured badly, replaced
A radial-gradient ellipse was built first and then measured per RENDERED LINE
rather than by eye. It failed: gradients fall off by elliptical distance, so
the widest headline line (the FIRST one) sat at only 0.33 scrim alpha — the
most important text on the page was the least protected. Sizing the ellipse to
cover it would have needed ~90% of the hero and killed the animation.

Replaced with a blurred rounded rectangle, which matches the shape of a text
block. Result is strictly better on both axes: every line (13 at desktop, 20 at
320px) sits in the solid core with >= 41px margin against a 32px blur, AND
scrim coverage DROPPED from 54% to 39% of the hero. The animation itself is
untouched — 14 animated elements still running, scrim is static, no change to
its speed or path.

### T4 Pillar stagger
80ms -> 120ms. Everything else in the requested spec was already true via the
shared CSS Reveal system (24px, 0.5s, ease-out, fires once, reduced-motion
safe); verified including "does not replay on scroll-back". NOT rebuilt on
Framer whileInView as the brief asked: Reveal was deliberately moved OFF Framer
to cut hydration cost, and Foundation is a server component, so it would have
been a pure perf regression for a visually identical result.

### T5 Rhythm
Section 03: connector thread between step markers, drawing in on scroll via the
same shared observer (new `data-reveal="rule-y"` variant for the vertical
case). Desktop spans the full grid and aligns to 0px against all three icon
centres; mobile segments sit entirely inside the 40px grid gap so they never
cross heading, body or image. Equal-height columns verified unchanged.
Section 02: 64px depth offset on the second frame, stacking plainly on mobile.
BrowserFrame internals untouched.

### T6 /services
Sales view of the same ten capabilities. Reuses the locked `headline` and
`outcome` strings verbatim — no new per-capability copy — and hands off to
/knowledge#slug instead of repeating its prose. All 10 anchors verified to
resolve on /knowledge. CTA repeated at intervals inside the list. Own meta/OG,
added to sitemap at priority 0.9.

### T7 /about
Studio-level expansion of section 04: five principles plus a "what working
together looks like" panel, deliberately distinct from section 03's process
steps. Verified: no first-person singular, no AI mention, no photo (only asset
is the wordmark). Homepage section 04 trimmed to a two-paragraph teaser with a
"Read more about SetFrame" link, so the text is not duplicated across pages.

### T8 Nav
Work / Services / About / FAQ. Moved into the ROOT LAYOUT — it had been mounted
only on the homepage, so /services, /about, /knowledge and /contact previously
had no navigation at all. Services and About are page links; Work and FAQ stay
in-page anchors on the homepage and become /#work and /#faq from anywhere else,
so no item is ever a dead anchor. Verified on all five pages.

Two problems the acceptance checks caught rather than assumed:
- With a fourth item the pill measured 326px at a 320px viewport and hung 3px
  off BOTH edges. Now 285px with 17px margins; links drop to 11px on phones,
  which also matches the CTA beside them.
- Nav visibility depended solely on an IntersectionObserver — the same
  "one mechanism fails and nothing recovers" shape as the reveal bug that once
  left the page blank after back-navigation. Added a throttled geometry
  fallback. It uses a timestamp, NOT requestAnimationFrame, because rAF is
  suspended in exactly the background/occluded-tab case where the fallback
  would be carrying the feature.
Visibility is also derived from state rather than pushed from inside the
effect, so no new setState-in-effect lint error was introduced (still the same
2 pre-existing ones in template.tsx and IntroCurtain.tsx).

### Environment note (recurring)
The automation browser runs its tab occluded: `document.visibilityState` is
"hidden", so CSS TRANSITIONS do not advance, IntersectionObserver does not
deliver, rAF does not fire, and screenshots time out. Elements therefore read
as stuck at their start values even when correct. Verify final state by
injecting `transition:none !important` and reading computed style, and prove
CSS correctness with a freshly-created probe element carrying the same classes.

---

## Iteration 7 — hero rebalance, CTA fixes, /about rebuild

### T1 Hero widened back out (both sides), scrim kept
The hero read as flat because the artwork and the copy were fighting for the
same pixels. Measured: at 1440px the headline occupies viewBox x179..x621 while
the system cluster sat at x620..700 and the leak arc ran x190..x640 — the
animation was passing straight through the text, which is exactly what forced
the Iteration 6 scrim, and with the scrim over the centre there was nothing
left to look at.

HeroVisual is now two clusters pinned to the left and right margins, middle
left open. The left is not a rigid mirror: business glyph + three-node cluster
on its own bead timing; the right keeps the four-node system cluster. Verified
zero overlap with the text block at 320 / 768 / 1440.

GEOMETRY LIMIT (stated rather than hidden): flanking needs margin to flank
into. Free margin per side measures ~179 viewBox units at 1440px, ~25 at 768px,
and at 320px the text block is TALLER than the whole SVG box. There is nowhere
to put a cluster on a phone without it landing under the copy, so clusters show
from lg up, and a slow 26s breathing wash (opacity only, nothing travels)
carries the hero below that.

### T2 CTA button — root cause was scrim bleed, not hover CSS
Measured BEFORE the fix:
- scrim bottom edge sat 8px BELOW the button's top edge
- with its 32px blur the veil covered 87% of the button's height
- text wrapper z-10 vs button wrapper z-auto, so the 0.88-alpha dark layer
  painted OVER the button
The hover brightening was happening underneath that veil, which is why it read
as going darker. Fixed at BOTH layers so neither has to hold alone: scrim
bottom inset pulled in and the CTA moved down (16px clearance past the blur at
all three widths), plus z-20 on the CTA wrapper. Headline protection
unaffected — every text line still sits in the solid core (worst margin 35px
against a 32px blur).

Hover now brightens on four channels instead of two: background luminance
0 -> 0.079, text 0.529 -> 0.665, border to solid copper, plus an outward copper
glow. Verified from the generated CSS, not assumed.

Brackets removed from the HERO instance only, via a `brackets` prop defaulting
to true — every other bracket on the site is untouched.

BUTTON FONT — the brief's premise was partly wrong. The hero CTA and the
contact submit button were ALREADY font-display (Syne). The only monospace one
was the nav CTA, which Iteration 6 Task 2 deliberately set to mono to stop the
nav pill rendering three typefaces at once. It is Syne again per this
iteration's sitewide rule, so the pill now carries two faces (Syne wordmark +
Syne CTA, mono section links between them). That is a deliberate trade the
owner asked for, not a regression.

### T3 /about rebuilt around the two supplied images
Running text cut from ~780 words to ~200. Structure: one opening sentence with
Image A (compass), three one-sentence principles, closing block with Image B
(blueprint) on breadth + selective scoping — deliberately distinct from the
homepage approach banner, which is about finding the one gap.

Framing: both images use ArtFrame at one shared 3:4 ratio with object-cover,
verified identical to the pillar treatment (1px border, 12px radius, same
shadow). 3:4 rather than the pillars' 4:3 because both sources are portrait
(0.80 and 0.64) and a landscape box would have cropped the blueprint's roof
off. Verified 0.750 on both at 320 / 768 / 1440.

MOVED, not cut: the durability standard ("anything that needs babysitting gets
abandoned in the first busy week") now lives on /knowledge beside the step
about a system that keeps running.
CUT as redundant: everything else removed already existed almost verbatim
elsewhere — fixed scope/price and post-launch ownership in the FAQ, direct
contact in the contact page reasons, feedback-until-it-fits and
see-it-before-you-commit in the homepage pillars. Nothing unique was deleted.
FAQ_ITEMS untouched, so FAQPage JSON-LD is unchanged.

### Two verification traps hit this iteration (worth remembering)
1. A stale `next start` kept holding port 3100 after a rebuild, so it served
   OLD html referencing a CSS hash the new build no longer had — the stylesheet
   came back as 9 BYTES and every Tailwind utility appeared "not applied"
   (position:static, aspect-ratio:auto, 0px border). It looked exactly like a
   broken page. Always confirm the served CSS is non-trivial before concluding
   a styling bug, and kill the old server by PID rather than trusting pkill.
2. Iterating document.styleSheets to look for `:hover` rules found ZERO while
   the raw CSS text contained 26 — the CSSOM walk missed Tailwind v4's nested
   output. Fetch and grep the stylesheet text; do not trust a CSSOM traversal
   to prove a rule is missing.

---

## Iteration 8 — Space Mono, bracket cleanup, /work, /services cards

### T1 Mono typeface replaced at the token
`--font-mono` now points at Space Mono. One token change plus the loader, so
all 18 files using `font-mono` inherited it — no per-instance overrides, no
mixed state. Verified: zero IBM Plex references in the codebase, and zero
elements resolving to a non-Space-Mono stack across / /work /services /about at
320 / 768 / 1440.

Why replace rather than debug again: Iterations 6 and 7 both cleared the
loading path by measurement (font resolved, weight correct, no stray
feature-settings, font-stretch 100%). The unevenness was the typeface's own
letterforms. Objective check on the new face — every glyph
(F A Q W I M L O 0 1 8 9) measures an identical 24.48px advance, where a
proportional control returns 11 different widths. An oversized Q is now
structurally impossible.

GOTCHA: Space Mono ships 400 and 700 only — there is no 500. The three ghost
numerals that used `font-medium` were moved to `font-normal` so nothing asks
for a weight the family cannot serve.

### T2 Brackets removed from CTA buttons; closing band reworded
The [ ] motif is now reserved for the brand mark. The brief named three
instances, but `CtaButton` actually renders in SEVEN places once /services
(x3), /about and /knowledge are counted — bracketing those while the named
three went plain would have read as a bug, so the brackets came out of the
component. LogoMark and the nav [S] wordmark keep theirs.
Homepage closing band now reads "Contact us" via a new `label` prop; hero and
nav keep "Start a conversation".
LEFT ALONE (flagged, not forgotten): the contact form's "[ Send message ]" —
not named in the brief and a different label.

### T3 /work — proof only, shows rather than explains
`BrowserFrame` now takes either a screenshot or coded children, so a system
panel and a website prototype are literally the same component. Verified:
identical frame signature across all 11 panels, every screen 16:9 at the same
534px width — no panel is a lesser afterthought.

Two website prototypes plus NINE coded UI mockups covering every remaining
marquee category: inbox/booking, document intake, contacts, outreach, orders,
dashboard, task runner, workflow, system map. Built from real components over a
small shared primitive set (Shell / TopBar / NavItem / Pill / Avatar / Line) so
nine screens stay one visual family; each renders 20-38 elements of real
interface. ZERO interactive elements — static by design for now.

Honesty framing: badged Prototype 01-11 continuing the existing convention,
captioned only with locked capability names and outcome lines, plus an explicit
on-page note that every screen is demonstration data. No client is implied and
no number is presented as a measured result. No /services or /knowledge
explanatory copy is duplicated here.

Nav + footer Work now point at /work; /work is in the sitemap with its own
meta/OG. The homepage KEEPS its two prototypes as proof and links out to the
fuller gallery rather than losing the section.

### T4 /services entries elevated to cards
Bordered panel, thumbnail reusing the existing marquee illustration, index
promoted to the section-01 ghost numeral treatment, and "Learn how it works"
rebuilt as a real secondary pill in the site's button language (border, pill
shape, copper hover glow) one step down from the main CTA.

The animation constraint was the load-bearing part — ten cards must not animate
at once. The side accent is driven per card by the shared RevealObserver, so
each card's hairline draws only when THAT card enters view, then rests; hover
adds a copper wash on top. Measured: 1 of 10 revealed at page top, progressing
1 -> 4 -> 7 -> 9 -> 10 on scroll, with 0 cards carrying any
infinite-iteration animation. No per-card JS, no permanent loop.


---

## Iteration 9 — Hero CTA and trust-proof refresh

Backfilled from the session that shipped it (commit `0322193`), so this is the
record rather than a reconstruction — the earlier housekeeping note flagging
this as a gap is resolved. Driven by an external OpenAI-based audit of
setframe.net (design 8.5, ux 6.5, mobile 7, performance 9, seo 9,
accessibility 10, trust 4.5, content 6, cta ~6, overall ~7.4). The low trust
score reflects the deliberate absence of testimonials, client logos and
founder identity, not a bug; adding fabricated proof, logos, testimonials,
founder photos or "early clients" scarcity framing was explicitly considered
and declined for that round. One file changed, `src/components/Hero.tsx`.

**T1 — hero CTA reworded.** "Start a conversation" became **"Book a 15-minute
call"**, passed as `label` to the shared `CtaButton` so the component default
is untouched, with microcopy beneath: "A conversation, not a pitch — no
obligation." That phrase is lifted verbatim from section 03 step 1 rather than
reworded, so the promise at the button and the promise in the process section
are the same sentence rather than two similar-sounding claims. The nav pill
keeps "Start a conversation" and the closing band keeps "Contact us"; only the
hero instance changed.

**T2 — 7/30-day commitment promoted to a proof bar.** The delivery commitment
was the most concrete, checkable thing on the page and was set as the least
legible text in the hero: one 12px mono line at 55% opacity under the subline.
Same words, promoted into a bordered two-cell strip on `bg-surface/70` —
"7 days / to a working version" and "30 days / to full rollout" — with the
figures in Space Mono 700 copper at 20px (24px from `sm`), matching the section
numerals and FAQ numbering; Syne stays on headings and button labels.
"Websites and business systems, built to order." was explicitly resolved rather
than dropped: it stays as a standalone label line directly above the strip,
because dropping it would leave two bare numbers with nothing to attach to. No
new copy — every word was already in the old sentence.

**T3 — secondary CTA.** "See recent builds →" → `/work`, reusing the existing
arrow-link anatomy ("Discover the process →"): Syne label, transparent
`border-b` that lights copper on hover, separate `aria-hidden` copper arrow.
One size down and starting at 70% opacity so it stays subordinate to the button.

**T4 — readability, measured not assumed.** Contrast against the actual
painted backgrounds at 320px: "built to order" line **8.66:1** (up from
5.80:1), stat labels 9.57:1, stat numbers 5.37:1 (20px bold copper on the
strip), microcopy 8.66:1, secondary link 8.66:1. The weakest hero text is now
8.66:1 where it was 5.80:1.

**T5 — mobile hierarchy.** At 320×700 the sequence measures h1 (163–388),
subline (408–512), label (552–591), proof strip (603–698), CTA (730),
microcopy (787), secondary (831) — gaps of 12/40/12/32/12/24px, no oversized
gap, and the whole proof strip above the fold. Room came from section padding
(`py-24` → `py-16 sm:py-24`), the wordmark (`w-32` → `w-28 sm:w-32`) and its
margin; the subline gained a ~34ch cap plus `text-pretty` on phones. The
headline scrim's bottom inset tightened `-bottom-8` → `-bottom-6` now that the
mono line had left that wrapper. The H1 was NOT touched — a `text-balance` was
tried and reverted, since the iteration was scoped to the CTA and
secondary/tertiary elements.

**T6 — scroll cue removed, not upgraded.** The animated-chevron version was
built first and the measurement killed it. The cue was pinned to the bottom of
the SECTION, not the viewport, and with the proof bar and second CTA added the
hero is now taller than the screen at every width checked — **918px against a
700px viewport at 320px, 956px against 900px at 1440px** — so it sat below the
fold on phone and desktop alike and could never do its job. At 320px it landed
with a **0px gap** against the "See recent builds" link, and the only repairs
were extra bottom padding (pushing the CTA further down, against T5) or a
per-breakpoint hide. The chevron CSS was removed too, so `globals.css` came out
net-unchanged. The hero overflowing the fold is now itself the cue, and the
hero ends on an onward link instead of a dead end.

Type-check clean; the two pre-existing `setState`-in-effect lint errors in
`template.tsx` and `IntroCurtain.tsx` are unchanged and unrelated.

---

## Iteration 10 — Hero legibility, contact-page CTA/contact-method UX, and AI-audit score uplift

**Origin:** a design/UX/SEO critique session run against the live site,
combining a manual pass (screens of the hero, the contact form, and the
site's own `/webcriticapp` self-audit tool showing 7.3/10 overall — Trust
Signals 4.5, CTA Effectiveness 5.5, Content 6.0, UX/Usability 6.5, Mobile
Experience 7.0 against Design 8.5, Performance 9.0, SEO 9.0, Accessibility
10) with current (Aug 2026) research on hero-text legibility techniques,
segmented-control UI patterns, and trust-signal design for solo studios.
Sources for the external research are listed at the end of this section.

Two items were named directly by the owner (T1, T2/T3 below); the rest (T4–T8)
came out of re-auditing the rest of the site against the same weak categories,
so a repeat AI audit has concrete, shipped changes to score against rather
than the same gaps.

**Hard guardrail for this whole iteration:** Accessibility currently scores
10/10 and Performance 9.0. Nothing below may drop either — every new
interactive element gets the same keyboard/focus/ARIA treatment already
standard across the codebase (see `:focus-visible` in `globals.css:35` and
the reduced-motion blocks throughout), and no new layer may sit on the LCP
path the way the existing scrim already deliberately avoids (`Hero.tsx:72-73`
notes it costs nothing on the LCP path — keep that property when touching it).

### T1 — Hero headline scrim: from opaque black box to integrated frosted panel

**The problem, as reported and as measured.** `Hero.tsx:115-118` renders the
readability backing behind the H1/subline as:

```tsx
<div
  aria-hidden="true"
  className="pointer-events-none absolute -inset-x-12 -top-10 -bottom-6 rounded-[48px] bg-[rgba(18,18,20,0.88)] blur-[32px]"
/>
```

0.88 alpha on a near-black fill is functionally opaque. Sitting on top of
`LifeBackground`'s cursor-tracking glow and the hero's own `ambient-glow` +
`hero-breathe` wash (which visibly pulses and drifts everywhere else on the
page), the result is exactly what was flagged: one dead, flat, unmoving
rectangle in the middle of an otherwise-alive screen. `blur-[32px]` here
softens the box's own edges (it's a `filter`, applied to the element), it
does not affect what's *behind* the box — so the interior reads as flat no
matter how soft the edge is.

This is the second time this exact region has been tuned (Iteration 6 Task 3
introduced it, Iteration 7 Task 2 fixed a z-index bug where it painted over
the CTA's hover state, Iteration 9 pulled the bottom inset in further). Worth
being explicit about what is *not* being reopened: the rounded-rect shape
(chosen over a radial ellipse after the ellipse measured badly — first
headline line at 0.33 alpha, see Iteration 7 Task 2 for the numbers), the
geometry/insets, and the z-10/z-20 stacking that keeps the CTA clear of the
veil. Only the fill treatment changes.

**Fix — swap opacity for depth.** Lower the alpha and add `backdrop-blur`, so
the panel becomes a frosted-glass surface that *shows a soft, diffused hint
of the glow moving behind it* rather than blocking it outright. This is
standard current practice for keeping text legible over animated/photographic
hero backgrounds without a flat card sitting on top of the scene (glass /
blur-panel treatments are called out repeatedly in the 2026 hero-section
trend pieces gathered for this pass — see Sources). Concretely:

```tsx
<div
  aria-hidden="true"
  className="pointer-events-none absolute -inset-x-12 -top-10 -bottom-6 rounded-[48px] bg-[rgba(18,18,20,0.5)] backdrop-blur-2xl blur-[32px]"
/>
```

- `backdrop-blur-2xl` blurs the ambient glow *through* the panel — the light
  keeps moving underneath, just diffused, so the panel reads as part of the
  same scene instead of a sticker on top of it.
- Alpha drops from 0.88 to ~0.5. Verify contrast after the change the same
  way Iteration 7 did (measure the darkest and lightest text pixel against
  the panel at every breakpoint) — 0.5 + backdrop-blur should still clear AA
  comfortably since the backdrop is dimmed foreground glow, not full-brightness
  page background, but this needs the same measurement discipline the rest of
  this file uses, not an eyeball check.
- Add a small text-shadow as a second line of defense so legibility never
  depends on the panel alone — new utility in `globals.css`:

  ```css
  .hero-text-shadow {
    text-shadow:
      0 2px 28px rgba(10, 10, 11, 0.85),
      0 1px 3px rgba(10, 10, 11, 0.6);
  }
  ```

  Applied to the H1 (`Hero.tsx:120`) and the subline (`Hero.tsx:129`). This
  is what lets the alpha come down further than it otherwise safely could.

- `backdrop-blur` needs a browser that supports `backdrop-filter` — universal
  in every evergreen browser at this point, and there is no functional
  regression for the handful of browsers that don't support it: the fill
  still renders, just without the frosted effect, so it degrades to
  "translucent dark panel," not broken.

**Optional follow-up, not part of this pass:** capping `hero-breathe`'s peak
opacity (currently swings 0.35 → 0.85, `globals.css:297-309`) slightly lower
would reduce how bright the wash gets directly behind the now-translucent
panel. Only worth touching after T1's main fix ships and gets looked at — two
variables changing at once makes it harder to tell which one fixed (or
didn't fix) the "jarring" complaint.

### T2 — Contact form submit button: drop the brackets, stop hand-rolling a second button

**The bug, precisely.** Iteration 8 Task 2 deliberately removed the `[ ]`
motif from every CTA except the logo — but flagged one exception at the time:
*"LEFT ALONE (flagged, not forgotten): the contact form's '\[ Send message \]'
— not named in the brief and a different label."* That flag is why it's still
there. `ContactForm.tsx:267-273` renders its own raw `<button>` with its own
copy of the pill/border/hover classes instead of using the shared
`CtaButton` component every other primary action on the site goes through —
so it drifted from the bracket-removal pass, and it will drift again the next
time `CtaButton`'s hover treatment changes, because this button doesn't get
that change for free.

**Fix.** Delete the bespoke button and render `CtaButton` in its existing
`submit` mode (`CtaButton.tsx:93-100` already supports this — it was built
for exactly this kind of case per its own comment: *"the site's primary
button to submit a form rather than navigate"*):

```tsx
<CtaButton
  submit
  size="lg"
  label={state.submitting ? "Sending..." : "Send message"}
  disabled={state.submitting}
  className="w-full"
/>
```

This is a strict improvement, not a wash: it removes the brackets (the
literal ask), it makes the contact page's highest-intent button visually and
behaviourally identical to every other CTA on the site (magnet-follow,
four-channel hover brighten, copper glow — currently exclusive to
`CtaButton` instances), and it deletes ~7 lines of duplicated class string
that only existed because this button was never migrated. `disabled` and
size classes are already wired through the shared component, so nothing else
in the form needs to change.

### T3 — "Preferred contact method": native `<select>` → segmented control

**What was asked:** instead of one visible value with a dropdown to reveal
the other two, show all three options together in the field and select by
clicking directly. That's a textbook segmented control — and the option
count is exactly in its sweet spot (best-practice guidance puts 3-5 options
as the ideal range for a segmented control; 6+ should stay a dropdown,
binary states should stay a toggle — this field has exactly 3).

**Constraint that must not be lost.** `ContactForm.tsx:120-129` documents a
real, previously-shipped bug: an `<option>` without an explicit `value`
attribute takes its value from its own *text*, and Google Translate rewrites
visible text but not attributes — so under Translate, `method` stopped
matching `"Phone call"` and the phone field silently refused to appear. The
current `<select>` avoids this only because every `<option>` carries an
explicit `value=`. A button-based segmented control is naturally safe from
the same failure mode as long as it keeps the same discipline: each
segment's click handler must set state from a **hardcoded JS literal**, never
from the button's own rendered text — which the implementation below does.

**Implementation** (`ContactForm.tsx`, replacing the `<select>` block at
lines 113-141):

```tsx
const CONTACT_METHODS = ["Email", "Phone call", "Video call"] as const;
type ContactMethod = (typeof CONTACT_METHODS)[number];

// Short forms only for the segmented control's own label — never read back
// out of the DOM, so this is not the same hazard the select's `<option>`
// text used to be.
const METHOD_SHORT: Record<ContactMethod, string> = {
  Email: "Email",
  "Phone call": "Call",
  "Video call": "Video",
};
```

```tsx
<div>
  <span id="contactMethod-label" className={FIELD_LABEL_CLASSES}>
    Preferred contact method
  </span>
  <div
    role="radiogroup"
    aria-labelledby="contactMethod-label"
    className="grid grid-cols-3 gap-1 rounded-lg border border-white/10 bg-surface p-1"
    onKeyDown={(e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      const i = CONTACT_METHODS.indexOf(method as ContactMethod);
      const next =
        e.key === "ArrowRight"
          ? CONTACT_METHODS[(i + 1) % CONTACT_METHODS.length]
          : CONTACT_METHODS[(i - 1 + CONTACT_METHODS.length) % CONTACT_METHODS.length];
      setMethod(next);
    }}
  >
    {CONTACT_METHODS.map((m) => (
      <button
        key={m}
        type="button"
        role="radio"
        aria-checked={method === m}
        tabIndex={method === m ? 0 : -1}
        onClick={() => setMethod(m)}
        className={`rounded-md px-2 py-2.5 text-xs font-mono tracking-wide transition-colors sm:text-sm ${
          method === m
            ? "border border-accent/50 bg-accent/15 text-accent"
            : "border border-transparent text-foreground/60 hover:text-foreground/90"
        }`}
      >
        <span className="sm:hidden">{METHOD_SHORT[m]}</span>
        <span className="hidden sm:inline">{m}</span>
      </button>
    ))}
  </div>
  {/* The visual control above is presentational only (buttons carry no
      `name`). This hidden input is what Formspree actually receives —
      same field name the select used to submit, so nothing downstream
      (the notification email, any Formspree rule) needs to change. */}
  <input type="hidden" name="contactMethod" value={method} />
</div>
```

Notes tying this to the rest of the file:

- `role="radiogroup"` / `role="radio"` / `aria-checked` / roving `tabIndex`
  (0 on the selected segment, -1 on the others) plus manual arrow-key
  handling is the standard accessible pattern for this component — this is
  what keeps Accessibility at 10 rather than trading the native `<select>`'s
  free keyboard support for a mouse-only widget.
- Mobile: labels shrink to "Email / Call / Video" below `sm`, matching the
  exact technique `FloatingNav.tsx:159-164` already uses for its own
  "Start" vs "Start a conversation" swap — `aria-label`-free here because the
  short label is still real, readable text, not a truncation.
- `wantsPhone` (`ContactForm.tsx:48`) already reads from `method` by string
  comparison, so the email/phone field swap and the Translate-safe
  always-mounted `[hidden]` rows (`ContactForm.tsx:143-166` and the
  `field-enter` CSS) need **no changes** — they're downstream of `method`
  and don't care how it got set.
- Touch target: `py-2.5` plus the 44px+ overall row height at the `lg` field
  sizing keeps each segment comfortably inside the 44px minimum tap target
  guidance, which matters more here than on desktop-only components since
  this sits directly under Mobile Experience's current 7.0.

### T4 — Trust Signals (4.5/10 — the weakest category, and the one with the most headroom)

This is the biggest score gap on the site, and re-reading `About.tsx` shows
why: *"Impersonal studio description (owner decision): no founder framing, no
location-as-personal-detail, no photo."* That's a deliberate brand choice,
not an oversight — current research on solo-studio credibility agrees
founder-forward framing is the single strongest trust lever available, so
this is flagged as a decision for you, not something to override
unilaterally. Two tracks below: things safe to ship without touching that
decision, and one item that only you can call.

**Safe to ship now — no conflict with the impersonal-brand decision:**

- **Surface the proof that already exists, closer to the CTA.** The
  `/work` gallery already carries "outcome lines" per its own honesty
  framing (Iteration 8 Task 3: *"captioned only with locked capability names
  and outcome lines... no client is implied and no number is presented as a
  measured result"*). None of that currently appears on the homepage or the
  contact page — the visitor has to click through to `/work` to see any of
  it. Pull one or two outcome lines into a compact strip near the contact
  form or under the hero proof bar. Zero new copywriting: reuse what
  Iteration 8 already wrote and vetted for honesty.
- **A concrete "what happens next" strip**, built entirely from copy that
  already exists elsewhere on the site (the FAQ, the contact reasons, the
  proof bar): e.g. "Fixed scope & price · Direct to the person who builds it
  · Reply within 1 business day." This is exactly the "quantified /
  specific over generic" pattern current trust-design guidance calls out —
  it reads as three checkable facts instead of three adjectives, and every
  one of them is already stated in prose somewhere on the site (`ContactReasons.tsx`,
  the FAQ, `ContactForm.tsx`'s success state). Repackaging as a compact,
  scannable line is copy-layout work, not new claims.
- **A small lock/shield icon next to the existing privacy line**
  (`ContactForm.tsx:280-287`, "Your details are used only to reply to your
  message..."). The text is already right; current guidance notes a visible
  security cue at the point of data collection measurably helps form
  completion, and this is a one-icon change next to copy that's already
  written.

**Needs your call, not a code change:** `LOCATION` in `constants.ts:15`
currently reads `"Poland · Netherlands · Worldwide"` — deliberately vague in
the same way `CONTACT_EMAIL` is a placeholder pending the real mailbox (see
the `// TODO` on the line above it). To an AI auditor and to a skeptical
visitor, a location string with no city and no registration detail can read
as evasive rather than global-reach-flexible, which is very likely part of
what's dragging this category down. Whether to add a real city, a KVK/company
registration number, or a LinkedIn link is a business-readiness decision
(is the entity registered yet?), not a design one — flagged the same way the
plan already flags the `hello@setframe.net` placeholder, so it surfaces
again whenever that becomes available rather than getting lost.

### T5 — CTA Effectiveness (5.5/10)

- T2 and T3 both land here directly (a consistent, on-brand submit button
  and a lower-friction contact-method field both reduce the last-mile drop
  the AI grader is very likely penalizing).
- **Button weight, flagged as a decision rather than shipped outright.**
  Every CTA on the site (`CtaButton.tsx:29-30`) is an outline/pill —
  transparent fill, accent border, brightening on hover. Outline buttons are
  well-documented to read as lower-commitment/lower-visual-weight than a
  solid fill, and "CTA effectiveness" graders lean heavily on exactly this
  signal. The pill-with-border look is also clearly load-bearing brand
  identity here (it's the shared anatomy across seven CTA instances plus the
  logo motif), so a wholesale swap to solid fill is not proposed. A safer
  middle ground worth testing: give only the **highest-intent instance**
  (the hero's "Book a 15-minute call") a subtly higher resting fill opacity
  than the rest (e.g. `bg-accent/10` at rest instead of fully transparent,
  keeping the same border/hover language), so there's a visible hierarchy
  between the one CTA that matters most and the six that repeat it, without
  touching the shared component's default for the other six.
- Proof-bar and CTA are already well-paired in the hero (T1 doesn't change
  that relationship, only the panel behind the copy above it).

### T6 — Content (6.0/10)

- The single highest-leverage move for this category is the same one
  T4 already proposes: turning `/work`'s existing outcome lines and the
  FAQ's existing specifics into visible on-page content earlier in the
  funnel, rather than writing new copy. A grader scoring "Content" is very
  likely counting concrete, specific claims versus abstract ones — the site
  already has the concrete claims, they're just gated one click deeper than
  they need to be.
- Once real client work exists, a short case-study format (problem → fix →
  outcome, 3-4 sentences, still under the same "no number presented as a
  measured result unless it's real" honesty rule Iteration 8 already set)
  would move Content and Trust together. Not actionable yet if there's no
  case study to write honestly — noted for when there is one.

### T7 — UX/Usability (6.5/10)

- T3's segmented control is the concrete fix here (fewer clicks, all
  options visible up front, matches how the field is actually used —
  most visitors have one preferred contact method and now see it
  immediately instead of opening a dropdown to find out the options exist).
- No other usability blocker turned up in this pass strong enough to act on
  without a dedicated page-by-page review (`/services`, `/work`, `/knowledge`
  weren't re-audited screen-by-screen here — flagged as a good candidate for
  a focused Iteration 11 if the score doesn't move enough on this pass
  alone).

### T8 — Mobile Experience (7.0/10)

- T3 explicitly carries a mobile-specific requirement (short labels, 44px+
  touch targets) rather than treating mobile as an afterthought — see the
  notes under T3.
- T1's frosted-panel change should be re-verified at 320px the same way
  Iteration 7 measured the original scrim there (that iteration's numbers —
  918px hero height against a 700px viewport at 320px — are why the scroll
  cue was removed rather than repositioned; the panel geometry itself is
  unchanged here, only its fill, so this is a lighter re-check than a full
  re-measure, but still a re-check).

### Verification checklist before calling Iteration 10 done

1. Contrast-check the H1 and subline against the new frosted panel at
   320 / 768 / 1440px, same method as Iteration 7 Task 2 (measure, don't
   eyeball).
2. Confirm the CTA button under the hero copy is still fully clear of the
   panel's blurred edge (re-run the same 8px-gap check Iteration 7 Task 2
   used) — geometry is unchanged, but re-verify rather than assume.
3. Tab through the contact form with a keyboard only: Name → segmented
   control (arrow keys move the selection, Tab leaves the group as one
   stop) → Email/Phone (whichever is visible) → Message → Send. No dead
   stops, no doubled focus.
4. Screen-reader spot check (VoiceOver or NVDA): the segmented control
   announces as a radio group with three options and the current selection;
   the submit button announces its live label ("Sending..." while
   submitting).
5. Submit a real test message through Formspree with each of the three
   contact methods selected and confirm `contactMethod` arrives correctly
   in the notification email for all three (this is exactly the field the
   Translate bug broke before — worth a direct check, not an assumption).
6. Re-run the site's own `/webcriticapp` audit after deploying and compare
   against the 7.3 baseline (Trust Signals 4.5, CTA Effectiveness 5.5,
   Content 6.0, UX/Usability 6.5, Mobile Experience 7.0) captured at the
   start of this iteration.

**Sources consulted for this iteration's external research (Aug 2026):**
- [Segmented Control UI: A Visibility-First Component and How to Stop Misusing It](https://www.letsgroto.com/blog/segmented-control-ui)
- [Design for Trust in 2026: UI Patterns That Build Credibility](https://www.maviklabs.com/blog/design-for-trust-2026/)
- [Top Hero Section Examples for 2026: Boost Conversions](https://memorable.design/hero-section-examples/)
- [14 Web Design Trends to Keep up with in 2026](https://uxpilot.ai/blogs/web-design-trends-2026)
- [Best Practices for Dark Mode in Web Design 2026](https://natebal.com/best-practices-for-dark-mode/)

### Iteration 10 — what actually shipped

Files touched: `Hero.tsx`, `globals.css`, `CtaButton.tsx`, `ContactForm.tsx`,
`FinalCta.tsx`, `contact/page.tsx`, plus a new `TrustStrip.tsx`.

**T1 — SHIPPED as specified.** Panel is now
`bg-[rgba(18,18,20,0.5)] backdrop-blur-2xl blur-[32px]`, and
`.hero-text-shadow` is applied to the H1 and the subline. Verified applied in
the live DOM: `background-color: rgba(18,18,20,0.5)`,
`backdrop-filter: blur(40px)`, `filter: blur(32px)`, text-shadow on both.
Checklist item 1 (contrast, measured not eyeballed): compositing the panel over
the ambient glow AND the breathe wash both held at their **keyframe peaks**
gives a worst-case surface of `rgb(34,27,24)`, against which the headline reads
**15.56:1** and the subline **9.26:1** (AA floor 4.5:1). Identical at
320/768/1440 because nothing in the calculation is breakpoint-dependent.
Checklist item 2: the CTA clears the panel's bottom edge by 186px at 1440 and
194px at 320 — the proof bar now sits between them, so the old 8px-gap concern
is moot by a wide margin.

Two things worth knowing, neither of which blocked the change:
- **Could not be verified visually.** The screenshot tool failed again this
  session (the recurring occluded-tab environment note), so T1 — the one
  purely visual task in this iteration — was shipped on measurement alone.
  The frosted effect is *confirmed applied*, not *confirmed good-looking*.
  Worth an owner eyeball before anything else in this iteration is judged.
- **`backdrop-filter` is the most expensive thing on this page's LCP viewport.**
  It forces the compositor to read back and re-blur its region on every frame
  the backdrop changes, and the backdrop here changes continuously by design
  (`hero-breathe` 26s, `ambient-glow` 9s, plus the cursor glow). That is in
  tension with this iteration's own Performance 9.0 guardrail, and Speed Index
  is already this site's weakest metric across four prior recovery passes
  (7.4, 7.5, Iteration 5). Not pre-emptively reverted, because the plan
  specified it and the owner re-runs Lighthouse every iteration — but if mobile
  Perf drops, **delete `backdrop-blur-2xl` first**. The alpha drop from 0.88 to
  0.5 is what fixes the "dead flat rectangle" complaint on its own; the
  backdrop blur only diffuses the glow further.

**T2 — SHIPPED.** The bespoke `<button>` is gone; the form renders `CtaButton`
in `submit` mode. Brackets removed ("Send message" / "Sending..."), and the
button inherits the magnet follow, four-channel hover brighten and copper glow
that were previously exclusive to `CtaButton` instances. One addition the plan
did not anticipate: `className="w-full"` alone would NOT have worked, because
the magnet wrapper is `inline-block` and shrink-wraps, so `w-full` on the
button would resolve against a wrapper only as wide as the label. Added a
`fullWidth` prop that sets both. Verified: button width 272px === form width
272px at 320px.

**T3 — SHIPPED, with one acceptance miss caught and fixed.** Native `<select>`
replaced by a radiogroup-semantics segmented control. Verified by driving it
in the live DOM: `aria-checked` tracks selection, roving `tabIndex` keeps the
group to ONE tab stop, arrow keys move selection AND focus together and wrap
in both directions, and the hidden `contactMethod` input submits
`Email` / `Phone call` / `Video call` correctly. The downstream email/phone
swap still works — with a call preferred, the email row goes hidden +
disabled + not-required and the phone row shown + enabled + required. Full tab
order confirmed: name → radiogroup → email → message → send → privacy link, no
dead stops. **The miss:** the plan asserted `py-2.5` would clear the 44px touch
target; measured, it computed to a **38px** row on 12px mono. Fixed with an
explicit `min-h-11` (44px) plus flex centring, which also survives a future
type-size change that padding arithmetic would not. Re-measured: 44px.

**T4 — partially shipped.** New shared `TrustStrip.tsx` renders three checkable
facts — "Fixed scope and price · Direct to the person who builds it · Reply
within one business day" — each traceable to existing on-site prose (the
pricing FAQ, ContactReasons' accountability item, and the /contact intro plus
the form's success state respectively). Zero new claims; the change is
packaging. Placed above the contact form (highest-intent moment; the rotating
reasons card below it shows only one of three items at a time, which is fine
for depth and useless as reassurance at the moment of decision) and below the
homepage closing CTA. It sits outside FinalCta's `max-w-2xl` column: measured
inside it the three facts came to ~681px against a 672px measure and wrapped
with a single orphan on line two, so `max-w-3xl` gives them the ~9px they were
short of. The lock icon shipped alongside the privacy line, and that line's
colour moved from `text-foreground/50` to the solid `text-muted` token — /50 on
graphite computes below the 4.5:1 AA floor, so the icon change doubled as a
contrast fix.

NOT shipped from T4: pulling `/work` outcome lines under the hero proof bar.
Those are capability outcomes rather than delivered-work proof, and the hero's
vertical sequence was rebalanced by measurement one iteration ago — adding a
fourth text tier there reopens that work for a weaker version of what the
TrustStrip already does next to both CTAs. Flagged rather than silently
skipped; say the word if you want it there anyway.

**T5 — the button-fill decision is NOT shipped, per the plan's own
instruction** that it be "flagged as a decision rather than shipped outright."
When you want it, it is one line: add `bg-accent/10` to the hero instance only
via `className`, leaving the shared default untouched for the other six CTAs.
T2 and T3 both landed here as the plan predicted.

**T6 / T7 / T8** — carried by T3, T4 and T1 as the plan laid out; no separate
work. T7's flagged page-by-page re-audit of `/services`, `/work` and
`/knowledge` was not attempted and remains a candidate for Iteration 11.

**Still owner-only, unchanged:** the `LOCATION` / KVK / LinkedIn call (a
business-readiness decision, not a design one), a real case study for Content,
checklist item 5 (Formspree end-to-end with all three contact methods — worth a
direct check, since `contactMethod` is exactly the field the Translate bug
broke before), and checklist item 6 (re-run `/webcriticapp` against the 7.3
baseline).

Build passes clean (`npm run build`, exit 0, 19 static pages). Type-check
clean. Lint unchanged: the same two pre-existing `setState`-in-effect errors in
`template.tsx` and `IntroCurtain.tsx`, no new ones. No horizontal overflow at
320 / 768 / 1440 on `/` or `/contact`.
