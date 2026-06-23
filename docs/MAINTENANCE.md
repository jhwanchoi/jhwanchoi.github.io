# Résumé & Portfolio — Maintenance Guide

**Model (as of 2026-06):**
- **The site `https://jhwanchoi.github.io` IS the portfolio** — single source of truth for project detail, architecture diagrams, and screenshots.
- **The résumé** (in the Obsidian vault) stays **concise** and **deep-links into the site per project** (e.g. `…github.io/#inferit`).
- There is **no separate portfolio document** anymore (the old portfolio `.md`/LaTeX/PDF are retired).

---

## A. Updating the portfolio = updating the site

Repo: `~/jhwanchoi.github.io` (deploys to GitHub Pages from `main`).

```
index.html              all content (hero, GenAI, work, skills, projects), data-i18n attributes
assets/css/styles.css   design system
assets/js/i18n.js        EN/KR strings — every visible string lives here
assets/js/main.js        toggle, scrollspy, count-up, card expand, deep-link (#id) handling
assets/js/skills.js      skill badges (+ logos.js for custom AWS/OpenAI/lakeFS icons)
assets/diagrams/*.svg    architecture diagrams (dark theme)
assets/screenshots/*.png masked screenshots
assets/pdf/*.pdf         downloadable résumés (EN/KR)
scripts/gen-diagrams.mjs diagram generator (node scripts/gen-diagrams.mjs)
scripts/check-i18n.mjs   verify every data-i18n key resolves in EN & KR
```

### Add or update a project card
1. **HTML** (`index.html`): copy an existing `<article class="proj card" data-project>` block.
   - Give it a **stable `id`** (this is the deep-link target, e.g. `id="inferit"`).
   - Header (`.proj-head` button): `.proj-name` (data-i18n), `.proj-metric`, `.genai-tags` chips, `.proj-toggle`.
   - Body (`.proj-body[hidden]`, unique `id` + matching `aria-controls`): detail `<p data-i18n>`, the diagram `<img class="genai-diagram">`, optional `<div class="shots">` screenshots.
2. **i18n** (`assets/js/i18n.js`): add the new `data-i18n` keys to **both** `en` and `ko`.
3. **Diagram**: either add a definition to `scripts/gen-diagrams.mjs` and run `node scripts/gen-diagrams.mjs`, **or** request an SVG from claude cowork (see `Personal/Resume/cowork-diagram-prompts.md` for the style spec) and drop it in `assets/diagrams/<name>.svg`.
4. **Screenshots** (optional): masked PNGs into `assets/screenshots/`, reference in the body.
5. **Verify**: `node scripts/check-i18n.mjs` → "OK". Then preview over HTTP (ES modules need it):
   `cd ~/jhwanchoi.github.io && python3 -m http.server 8765` → open `http://localhost:8765`. Check the console is clean, EN⇄KR toggles, the card expands, and `#<id>` deep-links open it.
6. **Deploy**: `git add -A && git commit && git push origin main`. Pages serves `main` (usually live in ~1 min).

### Deep links
Every card / the MLOps platform heading has an `id`. Link to it as `https://jhwanchoi.github.io/#<id>`.
Current ids: `#mlops-platform`, `#inferit`, `#mtbf`, `#prism`, `#wls`, `#alas`, `#gemini-vertex`, `#bedrock`, `#rag`, `#agentic`.
(Visiting the hash auto-expands the card and scrolls to it; expanding a card also updates the URL.)

---

## B. Updating the résumé

Sources (Obsidian vault, `Personal/Resume/`):
- `Resume - Jihwan.Choi - ENG.md` — EN golden source (edit here first)
- `Resume - Jihwan Choi.md` — KR (keep in sync)
- `Resume LaTex Code.md` / `Resume LaTex Code - KR.md` — LaTeX that generates the PDFs

Process:
1. Edit the markdown (EN first, then mirror to KR). Keep it **concise** — résumé-worthy bullets only; push detail to the site via a per-project deep link.
2. Mirror the change into the matching LaTeX file.
3. **Regenerate the PDF locally** (no TeX engine in the agent environment): EN → `pdflatex`; KR → `xelatex` (uses `kotex`).
4. Copy the new PDFs to `~/jhwanchoi.github.io/assets/pdf/` (`Resume_jihwanchoi_ENG.pdf`, `Resume_jihwanchoi_KOR.pdf`) and push, so the site's "Download résumé" button stays current.

Résumé keeps: header + `jhwanchoi.github.io` link, profile, Generative AI Engineering, experience (with per-project deep links), skills, education. Diagrams do **not** go in the résumé (text/ATS-friendly); they live on the site.

---

## C. Always-on rules

- **Scrub before publishing anything** (site or résumé): no internal IPs (`10.x`), hostnames/FQDNs (`*.stradvision.com`, Harbor/HCP/Qumulo endpoints), AWS account IDs/ARNs, S3 bucket names, customer names (e.g. APTIV), the in-house ISP tool's product name (say "in-house ISP conversion tool"), or colleague names/emails. Keep own code names (SVEvalFlow, Inferit, MTBF, PRISM, svnet3, WLS, ALAS).
- **Accuracy ground-truth**: the agent memory `user_project_roles.md` records true roles (design-only vs full ownership). Check it before claiming scope.
- **Diagram style**: dark theme (`#0b1020` bg, JetBrains Mono, cyan/violet/green/amber accents, wrapped text, no overflow). The generator (`scripts/gen-diagrams.mjs`) and `cowork-diagram-prompts.md` both encode this.
- **Bilingual parity**: every site string exists in EN and KR; `check-i18n.mjs` enforces key parity.
