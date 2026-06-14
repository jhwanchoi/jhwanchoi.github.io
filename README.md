# jhwanchoi.github.io

Personal portfolio of **Jihwan Choi** — MLOps / Software Engineer.

Static, hand-coded, no build step. Bilingual (EN/KR). Deployed via GitHub Pages from `main`.

**Live:** https://jhwanchoi.github.io

## Structure

```
index.html            single page (all sections, data-i18n attributes)
assets/css/styles.css  design system + components
assets/js/i18n.js      EN/KR string table + applyLang()
assets/js/main.js      scrollspy, count-up, typing, card expand, language toggle
assets/pdf/            downloadable résumés (EN/KR)
scripts/check-i18n.mjs dependency-free i18n key check (node scripts/check-i18n.mjs)
```

Design & implementation notes live in `docs/superpowers/`.
