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
- The square bracket [ ] is the core visual motif of the brand. Reuse it across
  the UI: section numbering ([ 01 ], [ 02 ]), button styling ([ Start a
  conversation ]), card corner details, list markers.

## 3. Color System

- Background: #121214 (graphite, not pure black)
- Text/foreground: #F5F5F4
- Accent: #C77B3F (copper)
- Optional supporting surface tone: #1A1A1D for cards/elevated surfaces
- WCAG rule: accent (#C77B3F) on background (#121214) passes contrast for
  large text, buttons, and UI elements only. NEVER use accent for body text
  or small paragraph copy. Body/paragraph text is always #F5F5F4.
- Accent usage is restricted to: CTA buttons, hover states, section numbering
  (e.g. [ 01 ]), thin divider lines, icon accents, active/focus states.
- Logo stays monochrome (pure white/graphite or graphite/white) in all
  placements.

## 4. Site Structure (single page + minimal footer pages)

1. **Hero** (REVISED again after review: loss-led messaging, sell movement
   not technology; never mention team size or city in the hero)
   - Wordmark kicker: [SetFrame] wordmark above the H1, first element to fade in.
   - H1 (locked copy): "Your business is losing money in places you never look."
   - Subline (locked): "SetFrame builds websites and systems that catch what
     quietly slips away and turn it into movement."
   - Right of the showcase: three bracket-numbered keyword lines on why
     websites matter now (kept at keyword level on purpose, the full
     reasoning stays private).
   - Primary CTA button → /contact. Label: [ Start a conversation ].
     Font: Syne semibold (REVISED — was IBM Plex Mono, rejected in review).
   - Visual proof above the fold: **corner-fold project showcase** (REVISED —
     replaces static placeholder). Browser-chrome frame with bracket corner
     details cycling through real portfolio screenshots:
     * Each project holds ~6s, then the four bracket corners fold inward
       (frame "closes"), content swaps, corners fold back out (~0.45s per
       direction), revealing the next project. Loops continuously.
     * Address bar shows example-style display domains (auracapital.com,
       projectaura.net), not the real deployment URLs. Layout: showcase
       sits left, why-websites keyword list sits right (two columns on
       desktop).
     * Real portfolio sites to feature (screenshots to capture):
       - Aura Capital — https://auracapitalv1.vercel.app
       - Financial advisor site — https://bolt-tryouts-finacial-advisor-v2.vercel.app
     * Driven by the same data array as the work strip (add once, appears
       everywhere).
     * Paused when prefers-reduced-motion is set (show first project static).
   - Deliberate load animation: bracket-draw (~500ms) → staggered H1 line
     reveal (~400ms) → subline + CTA fade (implemented in Phase 2).

2. **Proof / Work strip**
   - Marquee or carousel with project mockups, driven by a data array
     (shared with the hero showcase).
   - Real portfolio assets now available (REVISED — no longer blocked):
     * Aura Capital — https://auracapitalv1.vercel.app
     * Financial advisor site — https://bolt-tryouts-finacial-advisor-v2.vercel.app
     * JPTRANSPORT74 and future work can be appended to the array later.
   - Each item: project name, one-line outcome, hover preview effect.

3. **Services** ([ 01 ] [ 02 ] [ 03 ] numbering)
   - Three cards: Websites / Content Systems / Business Automation.
   - Each card: outcome-first title, 2-3 sentence description, no tech jargon,
     no "AI" in titles.
   - Hover: subtle scale + copper border shift + spotlight effect (see section 7).

4. **How we work** (3 steps, buyer's perspective, AEO-friendly)
   - Frame as question → answer where natural
     (e.g. "How does a project start?").
   - Step numbering with bracket motif.

5. **Selected work** (expanded portfolio)
   - Larger mockups with short case framing: context → what was built → result.
   - Hover preview, click opens live demo links in new tab.

6. **About**
   - Short personal section: founder-operated studio, based in Tilburg (NL),
     working with Dutch and international businesses. Photo placeholder.
   - Human trust section: keep it 3-4 sentences max.

7. **FAQ** (objection handling, AEO-friendly)
   - 4-6 questions structured as direct question → concise answer:
     pricing approach, timeline, what happens after launch, do you only work
     with financial firms (answer: no — that is a focus, not a limit).

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
- Explicitly out of scope: 3D globe, WebGL scenes, particle systems.

## 8. SEO / OG / Technical Setup (from day one, not post-launch)

- og:image must use an absolute URL pointing to the live setframe.net domain
  (not a relative path, not a placeholder domain — this caused a critical bug
  on a previous project and must be avoided from the first commit).
- Meta title + meta description written per page, not left default.
- Favicon generated from the [S] bracket icon mark, tested for legibility
  at 16x16px.
- sitemap.xml and robots.txt included.
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
- On /contact, the form's submit button is the primary action of that page.
- Portfolio "view live" links open in new tabs and do not use button styling
  (they are secondary by design, visually quiet).

## 10. Trust / Compliance Footer Elements

- KVK number (TODO placeholder until registered).
- Contact email on the setframe.net domain (not a free gmail/outlook address).
- Location: Tilburg / Noord-Brabant, NL.

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

- [ ] Lighthouse Performance score > 90
- [ ] Lighthouse SEO score > 90
- [ ] Fully responsive and tested on mobile viewport
- [ ] Contact form verified end-to-end (a real test submission arrives)
- [ ] All sections from the site structure spec are present and populated with
      real copy (no lorem ipsum placeholders left in final build)
- [ ] prefers-reduced-motion respected
- [ ] Deployed and verified live on setframe.net via Vercel
- [ ] og:image and favicon verified working when the live URL is shared/tested
      (check via metatags.io)

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
- [ ] Phase 5: Selected work + About
- [ ] Phase 6: Final CTA + Footer (compliance elements)
- [ ] Phase 7: SEO/OG/favicon/sitemap + Lighthouse pass + mobile QA
      (includes /contact page meta + form E2E test)
- [ ] Phase 8: Final deploy to setframe.net + metatags.io verification
