# Portfolio Site Design — jhwanchoi.github.io

**Date:** 2026-06-14
**Author:** Jihwan Choi (with Claude)
**Status:** Approved design → implementation

## 1. Goal & Audience

A personal portfolio site at `https://jhwanchoi.github.io` that presents Jihwan Choi's
career as an **MLOps / Software Engineer** in a way that is user-friendly, fast to scan,
and visually distinctive.

**Primary audience:** technical recruiters and hiring managers (autonomous-driving / MLOps /
platform / backend), both international (English-first) and domestic (Korean).

**Core message:** "An engineer who turns ML infrastructure into measurable business value" —
backed by hard metrics (₩448M saved, 6mo→1.5mo validation, 99.97% success, 80M events/day),
with a differentiating AI-native tooling story.

## 2. Locked Decisions

| Decision | Choice |
|----------|--------|
| Language | **Bilingual EN/KR** with a header toggle. Default **EN**. |
| Depth | **Concise interactive single-page resume** (depth-on-demand via expandable cards). |
| Stack | **Hand-coded static, no build step.** Plain HTML + CSS + vanilla JS. Deploys straight from `main`. |
| Aesthetic | **Dark "technical dashboard" + subtle terminal touches** (monospace accents, `$` command lines, count-up metrics). |
| Hero/Nav | **Terminal hero + left vertical nav rail** (app-like, scrollspy-linked). |

## 3. Site Structure (single page, scrollspy nav)

Left nav rail jumps between sections:

1. **HOME** — Hero: name, title, one-line value prop, 3–4 count-up metric cards, social links
   (GitHub / LinkedIn / email), EN⇄KR toggle, "Download PDF résumé" button.
2. **WORK** — Experience timeline. Stradvision (2022–present) as the spine: MLOps Platform /
   SVEvalFlow ownership → Data & Labeling era. KIRO researcher below.
3. **SKILLS** — Categorized skill chips (Languages, Backend, Database, Cloud, Infra, ML/MLOps,
   CI/CD, Monitoring, AI/LLM, Tools). Placed high for fast stack-match scanning.
4. **PROJECTS** — Selected projects as compact cards (Inferit, MTBF Validation, PRISM, WLS, ALAS),
   each with a headline metric + stack tags; **click to expand inline detail** (concise default).
5. **AI-NATIVE** — AI-native development & internal evangelism (the differentiator): LLM Wiki,
   Multi-Model Debate, Bedrock cost observability, Cluster-ops Claude plugin, evangelism.
   Distinct visual treatment.
- **FOOTER** — Education (Handong Global University), contact links, back-to-top.

## 4. Visual Design System

- **Palette (dark):** background `#0b1020`, surface `#131a2e`, border `#1e293b`,
  text `#e2e8f0` / muted `#94a3b8` / faint `#64748b`.
  Accents: cyan `#22d3ee` (primary), violet `#a78bfa`, green `#3fb950` (terminal/success),
  amber `#f59e0b`. Each metric/section uses an accent for rhythm.
- **Type:** Inter (or system sans) for body/headings; `ui-monospace`/Menlo for metrics,
  `$` command lines, section indices (`01`, `02`). Tight tracking on big headings.
- **Motion (subtle, respect `prefers-reduced-motion`):** typing effect on hero `$` line;
  metric count-up on scroll into view; soft fade/slide-in per section; nav-rail active dot.
- **Texture:** thin borders, rounded cards (8–12px), faint grid/scanline optional, no heavy shadows.

## 5. Components

- `NavRail` — fixed left, logo monogram (JC), numbered section links, active-state via scrollspy;
  collapses to a top bar on mobile.
- `Hero` — terminal-style intro + metric card grid + actions (links, lang toggle, PDF).
- `Timeline` — vertical dated entries; nested sub-roles under Stradvision.
- `SkillGrid` — labeled category rows of chips.
- `ProjectCard` — collapsed (name, headline metric, stack tags) → expanded (bullets, detail).
- `AiNativeGrid` — distinct cards for AI-native items.
- `Footer` — education, contact, back-to-top.
- `LangToggle` — switches all `data-i18n` text between EN/KR.

## 6. Bilingual (i18n) Approach

No framework. A single `i18n.js` holds an object `{ en: {...}, ko: {...} }` keyed by string id.
Markup uses `data-i18n="hero.title"`. On toggle, JS swaps `textContent` for all `[data-i18n]`
nodes, sets `<html lang>`, persists choice to `localStorage`, and updates the PDF link to the
matching language résumé. Content is sourced from the existing resume markdown (EN + KR).

## 7. Architecture / File Layout

```
jhwanchoi.github.io/
├── index.html            # single page, all sections, data-i18n attributes
├── assets/
│   ├── css/styles.css     # design system + components (hand-written)
│   ├── js/
│   │   ├── i18n.js        # { en, ko } string table + toggle logic
│   │   ├── main.js        # scrollspy, count-up, typing, card expand, reduced-motion
│   │   └── (no deps)      # zero npm; everything vanilla
│   ├── pdf/               # Resume_jihwanchoi_ENG.pdf, Resume_jihwanchoi_KOR.pdf
│   └── favicon / og image
├── .nojekyll             # bypass Jekyll; serve files as-is
├── README.md
└── docs/superpowers/specs/   # this design doc (not served)
```

## 8. Deployment

- GitHub Pages, source = `main` branch root. `.nojekyll` so our hand-built files serve verbatim.
- No CI/build. `git push` → live. Custom domain: out of scope (use `jhwanchoi.github.io`).

## 9. Accessibility & Responsive

- Semantic landmarks (`nav`, `main`, `section`, `footer`), visible focus, AA contrast on dark.
- Keyboard-operable nav, toggle, and expandable cards (`button` + `aria-expanded`).
- `prefers-reduced-motion` disables typing/count-up/transition.
- Responsive: nav rail → top bar < 768px; metric grid and project cards reflow to 1 column.

## 10. Out of Scope (YAGNI)

Blog/CMS, contact form/backend, analytics, dark/light theme switch (dark only), build tooling,
per-project detail pages (depth lives in inline expand), custom domain, animations beyond the
three subtle ones above.

## 11. Content Source

All copy comes from the already-polished, scrubbed resume files:
`Resume - Jihwan.Choi - ENG.md` (EN) and `Resume - Jihwan Choi.md` (KR), plus the matching
PDFs for download. No new claims; the site mirrors the approved résumé content.

## 12. Open Items

- Confirm hero one-line value prop wording (EN/KR) during implementation.
- Confirm exactly which 3–4 metrics headline the hero (candidate set: ₩448M, 6mo→1.5mo,
  99.97%, 80M/day, +205%, 173,101).
