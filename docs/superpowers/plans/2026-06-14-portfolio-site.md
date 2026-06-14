# Portfolio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `jhwanchoi.github.io` — a bilingual (EN/KR), single-page, dark "technical-dashboard + terminal" portfolio site with a left nav rail, animated metrics, and expandable project cards, deployed from `main` with no build step.

**Architecture:** Static `index.html` with `data-i18n` attributes for every visible string; a vanilla-JS i18n string table (`assets/js/i18n.js`) swaps EN/KR; `assets/js/main.js` handles scrollspy, count-up, typing, and card expansion; hand-written `assets/css/styles.css` holds the design system. `.nojekyll` makes GitHub Pages serve files verbatim.

**Tech Stack:** HTML5, modern CSS (custom properties, grid/flex), vanilla ES modules. Zero npm dependencies. Dependency-free Node (`node:` built-ins only) for smoke checks.

**Verification note:** The spec mandates zero dependencies, so there is no unit-test framework. Each task is verified by (a) opening `index.html` in a browser and confirming specific behavior, and (b) where useful, a dependency-free Node smoke script. Discipline = small steps, explicit verification, frequent commits.

**Content sources (in `…/Personal/Resume/`):** `Resume - Jihwan.Choi - ENG.md` (EN), `Resume - Jihwan Choi.md` (KR), `Resume_jihwanchoi_ENG.pdf`, `Resume_jihwanchoi_KOR.pdf`. Mirror this content exactly — no new claims.

**Working dir:** `~/jhwanchoi.github.io` (git initialized, remote `origin` set, `.superpowers/` + `.DS_Store` gitignored).

---

## File Structure

```
jhwanchoi.github.io/
├── index.html                 # single page: all sections, data-i18n attrs
├── .nojekyll                  # serve files as-is (no Jekyll)
├── README.md
├── assets/
│   ├── css/styles.css         # design tokens + components
│   ├── js/i18n.js             # { en, ko } string table + applyLang()
│   ├── js/main.js             # scrollspy, count-up, typing, card expand, toggle wiring
│   ├── pdf/Resume_jihwanchoi_ENG.pdf
│   ├── pdf/Resume_jihwanchoi_KOR.pdf
│   └── favicon.svg
└── scripts/
    └── check-i18n.mjs         # dependency-free: every data-i18n key exists in en & ko
```

Responsibilities: `index.html` = structure only; `styles.css` = all visual design; `i18n.js` = all copy (both languages) + the swap function; `main.js` = all interaction. Keeping copy out of HTML is what makes bilingual maintainable.

---

## Task 1: Scaffold + GitHub Pages baseline

**Files:**
- Create: `~/jhwanchoi.github.io/.nojekyll`
- Create: `~/jhwanchoi.github.io/index.html`
- Create: `~/jhwanchoi.github.io/assets/css/styles.css`
- Create: `~/jhwanchoi.github.io/README.md`

- [ ] **Step 1: Create `.nojekyll` (empty) and `README.md`**

`README.md`:
```markdown
# jhwanchoi.github.io

Personal portfolio of Jihwan Choi — MLOps / Software Engineer.
Static site (no build). Bilingual EN/KR. Live: https://jhwanchoi.github.io
```

- [ ] **Step 2: Create minimal `index.html` shell with semantic landmarks**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Jihwan Choi — MLOps / Software Engineer</title>
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>
  <nav id="rail" aria-label="Section navigation"></nav>
  <main>
    <section id="home"></section>
    <section id="work"></section>
    <section id="skills"></section>
    <section id="projects"></section>
    <section id="ai"></section>
  </main>
  <footer id="site-footer"></footer>
  <script type="module" src="assets/js/i18n.js"></script>
  <script type="module" src="assets/js/main.js"></script>
</body>
</html>
```

- [ ] **Step 3: Create `styles.css` with a visible baseline**

```css
:root{ --bg:#0b1020; --text:#e2e8f0; }
*{ box-sizing:border-box; margin:0; padding:0; }
body{ background:var(--bg); color:var(--text);
  font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif; }
main{ padding:2rem; }
```

- [ ] **Step 4: Verify in browser**

Run: `open ~/jhwanchoi.github.io/index.html`
Expected: dark navy page loads, no console errors (empty sections fine).

- [ ] **Step 5: Commit**

```bash
cd ~/jhwanchoi.github.io
git add -A
git commit -m "feat: scaffold static site shell + GitHub Pages baseline"
```

---

## Task 2: Design system (CSS tokens, layout shell, primitives)

**Files:**
- Modify: `assets/css/styles.css`

- [ ] **Step 1: Replace `styles.css` with the full design system**

```css
:root{
  /* palette */
  --bg:#0b1020; --surface:#131a2e; --surface-2:#0f1626; --border:#1e293b;
  --text:#e2e8f0; --muted:#94a3b8; --faint:#64748b;
  --cyan:#22d3ee; --violet:#a78bfa; --green:#3fb950; --amber:#f59e0b;
  /* type */
  --sans:"Inter",system-ui,-apple-system,"Segoe UI",sans-serif;
  --mono:ui-monospace,Menlo,"SF Mono",monospace;
  /* layout */
  --rail-w:64px; --maxw:880px; --radius:12px;
}
*{ box-sizing:border-box; margin:0; padding:0; }
html{ scroll-behavior:smooth; }
body{ background:var(--bg); color:var(--text); font-family:var(--sans);
  line-height:1.55; -webkit-font-smoothing:antialiased; }
a{ color:inherit; text-decoration:none; }

/* layout shell */
#rail{ position:fixed; top:0; left:0; bottom:0; width:var(--rail-w);
  border-right:1px solid var(--border); background:var(--surface-2);
  display:flex; flex-direction:column; align-items:center; padding:16px 0; gap:18px; z-index:20; }
main{ margin-left:var(--rail-w); }
section{ max-width:var(--maxw); margin:0 auto; padding:72px 28px; }
.section-index{ font-family:var(--mono); font-size:.72rem; color:var(--cyan);
  letter-spacing:.12em; }
.section-title{ font-size:1.6rem; font-weight:800; letter-spacing:-.02em; margin:.2rem 0 1.4rem; }

/* primitives */
.card{ background:var(--surface); border:1px solid var(--border);
  border-radius:var(--radius); padding:16px 18px; }
.chip{ display:inline-block; background:var(--surface); border:1px solid var(--border);
  border-radius:999px; padding:4px 11px; font-size:.78rem; color:var(--muted);
  font-family:var(--mono); }
.mono{ font-family:var(--mono); }
.prompt{ font-family:var(--mono); color:var(--green); }
.muted{ color:var(--muted); }

/* responsive shell */
@media (max-width:768px){
  #rail{ flex-direction:row; bottom:auto; right:0; width:auto; height:52px;
    border-right:none; border-bottom:1px solid var(--border); justify-content:space-between; padding:0 14px; }
  main{ margin-left:0; margin-top:52px; }
  section{ padding:48px 18px; }
}
@media (prefers-reduced-motion:reduce){
  html{ scroll-behavior:auto; }
  *{ animation:none !important; transition:none !important; }
}
```

- [ ] **Step 2: Verify in browser**

Run: `open ~/jhwanchoi.github.io/index.html`
Expected: left rail strip visible (64px, bordered), main content offset to its right. Shrink window < 768px → rail becomes a top bar.

- [ ] **Step 3: Commit**

```bash
git add assets/css/styles.css
git commit -m "feat: design system tokens, layout shell, primitives"
```

---

## Task 3: i18n string table (all copy, EN + KR)

**Files:**
- Create: `assets/js/i18n.js`

This is the content backbone. Keys are dot-named by section. Mirror the resume exactly.

- [ ] **Step 1: Create `i18n.js` with the full string table and `applyLang()`**

```js
export const STRINGS = {
  en: {
    "meta.title": "Jihwan Choi — MLOps / Software Engineer",
    "nav.home":"HOME","nav.work":"WORK","nav.skills":"SKILLS","nav.projects":"PROJECTS","nav.ai":"AI",
    "hero.cmd":"cat profile.md",
    "hero.name":"Jihwan Choi",
    "hero.role":"MLOps & Software Engineer · SVEvalFlow Owner",
    "hero.tagline":"I turn ML infrastructure into measurable business value — distributed validation, cost-driven on-prem moves, and AI-native tooling.",
    "hero.cta.pdf":"Download résumé (PDF)",
    "metric.saved.v":"₩448M","metric.saved.l":"SAVED VS AWS",
    "metric.valid.v":"6mo→1.5mo","metric.valid.l":"VALIDATION TIME",
    "metric.success.v":"99.97%","metric.success.l":"SUCCESS RATE",
    "metric.events.v":"80M/day","metric.events.l":"LOG EVENTS",
    "work.title":"Experience",
    "work.sv.co":"Stradvision","work.sv.role":"Software Engineer","work.sv.date":"Jul 2022 – Present",
    "work.sv.mlops.h":"MLOps Platform — Shared GPU Cluster Co-Design & SVEvalFlow Owner (Oct 2025 – Present)",
    "work.sv.mlops.b1":"Co-designed a shared GPU cluster on RKE2 Kubernetes (60+ heterogeneous GPUs); led scheduler & queue policy design; integrated 15+ MLOps components (Ray/KubeRay, MLflow, Airflow, ArgoCD, KServe, Harbor).",
    "work.sv.mlops.b2":"Sole ownership of the inference/evaluation workflow (SVEvalFlow): Inferit, MTBF, PRISM.",
    "work.sv.mlops.b3":"Built 3 CI/CD pipelines (GitHub Actions + ArgoCD) and Scale-to-Zero serverless inference (KServe/Knative) to cut idle GPU cost.",
    "work.sv.data.h":"Data & Labeling Automation (2022 – 2025)",
    "work.sv.data.b1":"Log-analysis, auto-labeling, and ingestion services (WLS, ALAS, IGS, SURF, RNS, SLT) — see Projects.",
    "work.kiro.co":"Korea Institute of Robotics & Technology Convergence (KIRO)",
    "work.kiro.role":"Researcher","work.kiro.date":"Jan 2022 – Jul 2022",
    "work.kiro.b1":"Built a real-time gesture-based Human-Robot Interaction system; supported an autism-diagnosis assistance robot project.",
    "skills.title":"Skills",
    "skills.languages":"Languages","skills.backend":"Backend","skills.database":"Database",
    "skills.cloud":"Cloud","skills.infra":"Infrastructure","skills.mlops":"ML / MLOps",
    "skills.cicd":"CI/CD","skills.monitoring":"Monitoring","skills.ai":"AI / LLM","skills.tools":"Tools",
    "projects.title":"Selected Projects",
    "projects.expand":"Details",
    "proj.inferit.name":"Inferit","proj.inferit.metric":"6mo → 1.5mo",
    "proj.inferit.sub":"svnet3 build/inference acceleration & artifact management",
    "proj.inferit.d1":"Distributed/parallelized single-machine inference across cluster GPUs → cut a 20,000-hour validation from 6+ months to 1.5 months.",
    "proj.inferit.d2":"Versioned customer option files, eliminating 1–2 days of engineer↔PM communication; 5+ major versions; per-ticket auto-inference (OD/LD/TSR/TLR); integrated Evaluation Driven Development.",
    "proj.mtbf.name":"MTBF Validation","proj.mtbf.metric":"173,101 clips · 99.97%",
    "proj.mtbf.sub":"Large-scale svnet3 reliability validation",
    "proj.mtbf.d1":"Runs svnet3 inference on customer-ODD data before/after release, detecting FP & AEB flags; 205% higher throughput and 67.3% lower processing time vs a single machine.",
    "proj.mtbf.d2":"Proposed & executed Cloud→On-Premise transition: AWS ₩820M → On-Prem ₩370M (55% saved). Automation enables single-person operation of large-scale validation.",
    "proj.prism.name":"PRISM","proj.prism.metric":"~150 req/mo · 80% faster",
    "proj.prism.sub":"Customer Jira-integrated ISP conversion & re-simulation",
    "proj.prism.d1":"Phase 1 (operating): event-driven ISP conversion via Jira Webhook → SQS → Lambda; ~150 requests/month, 80% faster than manual.",
    "proj.prism.d2":"Phase 2 (Resim, in dev): did initial development, now technical lead supporting a developer from another org; dual-version inference via Airflow DAG.",
    "proj.wls.name":"WLS","proj.wls.metric":"₩100M/mo prevented",
    "proj.wls.sub":"Labeling-log analysis platform",
    "proj.wls.d1":"Collected/analyzed 80M daily labeling-log events to prevent ~₩100M/month in overbilling (settlement-audit confirmed); findings fed UI/UX improvements and the ALAS model (+20% labeling efficiency).",
    "proj.alas.name":"ALAS","proj.alas.metric":"-35% manual work",
    "proj.alas.sub":"Auto-labeling microservice",
    "proj.alas.d1":"Auto-labeling microservice reducing manual annotation ~35%; ECS→EKS migration, CDK-based IaC.",
    "ai.title":"AI-Native Development & Internal Evangelism",
    "ai.sub":"2025 – Present",
    "ai.llmwiki.t":"LLM Wiki","ai.llmwiki.d":"Git + Markdown MLOps ops-knowledge system (NL authoring, search, Q&A, quality lint, sync) — turned scattered knowledge into a team asset.",
    "ai.debate.t":"Multi-Model Debate","ai.debate.d":"Claude/GPT/Gemini draft → critique → third-party review → synthesize, raising reliability for design reviews. (github.com/jhwanchoi/dotfiles)",
    "ai.bedrock.t":"Bedrock Observability","ai.bedrock.d":"CloudWatch dashboard + Slack alerts for in-house LLM usage/cost visibility.",
    "ai.plugin.t":"Cluster-ops Claude Plugin","ai.plugin.d":"MLOps cluster ops utilities (diagnostics, storage) exposed as slash commands.",
    "ai.evangelism.t":"Internal Evangelism","ai.evangelism.d":"Hosted internal AI-dev meetings; shared modern AI tooling trends (Claude Code, Gemini CLI, Codex; MCP/Plugin/Skill).",
    "edu.title":"Education",
    "edu.school":"Handong Global University",
    "edu.degree":"B.S. in Electronic & Computer Engineering","edu.date":"2018 – 2022",
    "footer.contact":"Get in touch","footer.top":"Back to top"
  },
  ko: {
    "meta.title":"최지환 — MLOps / 소프트웨어 엔지니어",
    "nav.home":"홈","nav.work":"경력","nav.skills":"기술","nav.projects":"프로젝트","nav.ai":"AI",
    "hero.cmd":"cat profile.md",
    "hero.name":"최지환",
    "hero.role":"MLOps · 소프트웨어 엔지니어 · SVEvalFlow 오너",
    "hero.tagline":"ML 인프라를 측정 가능한 비즈니스 가치로 — 분산 검증, 비용 기반 On-Prem 전환, AI-native 도구를 만듭니다.",
    "hero.cta.pdf":"이력서 PDF 다운로드",
    "metric.saved.v":"4.48억원","metric.saved.l":"AWS 대비 절감",
    "metric.valid.v":"6개월→1.5개월","metric.valid.l":"검증 소요 시간",
    "metric.success.v":"99.97%","metric.success.l":"성공률",
    "metric.events.v":"8천만/일","metric.events.l":"로그 이벤트",
    "work.title":"경력",
    "work.sv.co":"Stradvision","work.sv.role":"소프트웨어 엔지니어","work.sv.date":"2022.07 – 현재",
    "work.sv.mlops.h":"MLOps 플랫폼 — 공유 GPU 클러스터 공동 설계 & SVEvalFlow 오너 (2025.10 – 현재)",
    "work.sv.mlops.b1":"RKE2 Kubernetes 기반 공유 GPU 클러스터(60+ 이종 GPU)를 공동 설계, 스케줄러·큐 정책 설계 주도, 15+ MLOps 컴포넌트(Ray/KubeRay, MLflow, Airflow, ArgoCD, KServe, Harbor) 통합.",
    "work.sv.mlops.b2":"추론·평가 워크플로우(SVEvalFlow)를 단독 오너십으로 운영: Inferit, MTBF, PRISM.",
    "work.sv.mlops.b3":"GitHub Actions + ArgoCD CI/CD 3종, KServe/Knative Scale-to-Zero 서버리스 추론으로 GPU 유휴 비용 절감.",
    "work.sv.data.h":"데이터·라벨링 자동화 (2022 – 2025)",
    "work.sv.data.b1":"로그 분석·자동 라벨링·인제스션 서비스(WLS, ALAS, IGS, SURF, RNS, SLT) — 프로젝트 참고.",
    "work.kiro.co":"한국로봇융합연구원 (KIRO)",
    "work.kiro.role":"연구원","work.kiro.date":"2022.01 – 2022.07",
    "work.kiro.b1":"제스처 인식 기반 실시간 Human-Robot Interaction 시스템 개발, 자폐 진단 보조 로봇 프로젝트 지원.",
    "skills.title":"기술 스택",
    "skills.languages":"언어","skills.backend":"Backend","skills.database":"Database",
    "skills.cloud":"Cloud","skills.infra":"Infrastructure","skills.mlops":"ML / MLOps",
    "skills.cicd":"CI/CD","skills.monitoring":"Monitoring","skills.ai":"AI / LLM","skills.tools":"Tools",
    "projects.title":"주요 프로젝트",
    "projects.expand":"자세히",
    "proj.inferit.name":"Inferit","proj.inferit.metric":"6개월 → 1.5개월",
    "proj.inferit.sub":"svnet3 빌드·추론 가속 & 형상관리",
    "proj.inferit.d1":"단일 머신 추론을 클러스터 GPU로 분산·병렬화 → 20,000시간 검증을 6개월+에서 1.5개월로 단축.",
    "proj.inferit.d2":"고객 option 파일 형상관리로 엔지니어↔PM 1~2일 커뮤니케이션 제거, 메이저 5+ 버전, 티켓 기반 자동 추론(OD/LD/TSR/TLR), EDD 통합.",
    "proj.mtbf.name":"MTBF Validation","proj.mtbf.metric":"173,101 clips · 99.97%",
    "proj.mtbf.sub":"svnet3 대규모 신뢰성 검증",
    "proj.mtbf.d1":"릴리즈 전/후 고객 ODD 데이터에 svnet3 추론, FP·AEB flag 검출; 단일 머신 대비 처리량 205% 증가·처리 시간 67.3% 감소.",
    "proj.mtbf.d2":"비용 기반 Cloud→On-Premise 전환 제안·실행: AWS 8.2억 → On-Prem 3.7억(55% 절감). 자동화로 대규모 검증을 1인 운영.",
    "proj.prism.name":"PRISM","proj.prism.metric":"월 ~150건 · 80% 단축",
    "proj.prism.sub":"고객 Jira 연동 ISP 변환·Re-simulation",
    "proj.prism.d1":"Phase 1(운영): Jira Webhook → SQS → Lambda 이벤트 기반 ISP 변환, 월 ~150건, 수동 대비 80% 단축.",
    "proj.prism.d2":"Phase 2(Resim, 개발 중): 초기 개발 후 테크니컬 리드로 타 조직 개발자 지원, Airflow DAG 기반 이슈/최신 버전 동시 추론.",
    "proj.wls.name":"WLS","proj.wls.metric":"월 1억원 방지",
    "proj.wls.sub":"라벨링 로그 분석 플랫폼",
    "proj.wls.d1":"일일 8,000만 건 로그 분석으로 월 약 1억원 과다 정산 방지(정산 감사 확정치); UI/UX 개선·ALAS 모델로 연결(라벨링 효율 +20%).",
    "proj.alas.name":"ALAS","proj.alas.metric":"수동 작업 -35%",
    "proj.alas.sub":"자동 라벨링 마이크로서비스",
    "proj.alas.d1":"객체 자동 라벨링 마이크로서비스로 수동 라벨링 약 35% 감소; ECS→EKS 마이그레이션, CDK IaC.",
    "ai.title":"AI-Native 개발 & 사내 전파",
    "ai.sub":"2025 – 현재",
    "ai.llmwiki.t":"LLM Wiki","ai.llmwiki.d":"Git + Markdown 기반 MLOps 운영 지식 시스템(자연어 작성·검색·질의응답·품질 린트·동기화) — 흩어진 지식을 팀 자산으로.",
    "ai.debate.t":"Multi-Model Debate","ai.debate.d":"Claude/GPT/Gemini 초안→비판→제3자 리뷰→종합 교차검증으로 설계 리뷰 신뢰도 향상. (github.com/jhwanchoi/dotfiles)",
    "ai.bedrock.t":"Bedrock 사용량 관측","ai.bedrock.d":"CloudWatch 대시보드 + Slack 알림으로 사내 LLM 사용량·비용 가시화.",
    "ai.plugin.t":"클러스터 운영 Claude 플러그인","ai.plugin.d":"MLOps 클러스터 운영 유틸리티(진단·스토리지)를 슬래시 커맨드로 제공.",
    "ai.evangelism.t":"사내 전파","ai.evangelism.d":"AI-driven development 사내 미팅 호스트, 최신 AI 도구(Claude Code, Gemini CLI, Codex; MCP/Plugin/Skill) 트렌드 전파.",
    "edu.title":"학력",
    "edu.school":"한동대학교",
    "edu.degree":"전자공학 및 컴퓨터공학 학사","edu.date":"2018 – 2022",
    "footer.contact":"연락하기","footer.top":"맨 위로"
  }
};

export function applyLang(lang){
  const dict = STRINGS[lang] || STRINGS.en;
  document.documentElement.lang = (lang === "ko") ? "ko" : "en";
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key = el.getAttribute("data-i18n");
    if(dict[key] != null) el.textContent = dict[key];
  });
  // language-specific PDF link
  const pdf = document.querySelector("[data-pdf]");
  if(pdf) pdf.setAttribute("href",
    lang === "ko" ? "assets/pdf/Resume_jihwanchoi_KOR.pdf" : "assets/pdf/Resume_jihwanchoi_ENG.pdf");
  if(dict["meta.title"]) document.title = dict["meta.title"];
  try{ localStorage.setItem("lang", lang); }catch(e){}
}
```

- [ ] **Step 2: Verify the module parses (dependency-free Node)**

Run: `node --input-type=module -e "import('file://'+process.cwd()+'/assets/js/i18n.js').then(m=>console.log('keys:',Object.keys(m.STRINGS.en).length,Object.keys(m.STRINGS.ko).length))"` (from repo root)
Expected: prints two equal counts, e.g. `keys: 78 78`. If counts differ, a key is missing in one language — fix before committing.

- [ ] **Step 3: Commit**

```bash
git add assets/js/i18n.js
git commit -m "feat: bilingual i18n string table (EN/KR) + applyLang"
```

---

## Task 4: Nav rail markup + i18n hookup

**Files:**
- Modify: `index.html` (`#rail`)
- Modify: `assets/css/styles.css` (rail items)

- [ ] **Step 1: Fill `#rail` in `index.html`**

```html
<nav id="rail" aria-label="Section navigation">
  <a class="rail-logo" href="#home" aria-label="Home">JC</a>
  <a class="rail-link" href="#home" data-spy="home"><span class="rail-i">01</span><span data-i18n="nav.home">HOME</span></a>
  <a class="rail-link" href="#work" data-spy="work"><span class="rail-i">02</span><span data-i18n="nav.work">WORK</span></a>
  <a class="rail-link" href="#skills" data-spy="skills"><span class="rail-i">03</span><span data-i18n="nav.skills">SKILLS</span></a>
  <a class="rail-link" href="#projects" data-spy="projects"><span class="rail-i">04</span><span data-i18n="nav.projects">PROJECTS</span></a>
  <a class="rail-link" href="#ai" data-spy="ai"><span class="rail-i">05</span><span data-i18n="nav.ai">AI</span></a>
  <button id="lang-toggle" class="rail-lang" aria-label="Toggle language">EN</button>
</nav>
```

- [ ] **Step 2: Add rail CSS**

```css
.rail-logo{ width:34px; height:34px; border-radius:9px; background:var(--cyan);
  color:var(--bg); display:flex; align-items:center; justify-content:center;
  font-family:var(--mono); font-weight:800; }
.rail-link{ display:flex; flex-direction:column; align-items:center; gap:2px;
  font-size:.6rem; letter-spacing:.08em; color:var(--faint); writing-mode:vertical-rl; padding:6px 0; }
.rail-link .rail-i{ font-family:var(--mono); }
.rail-link.active{ color:var(--cyan); }
.rail-lang{ margin-top:auto; background:transparent; border:1px solid var(--border);
  color:var(--muted); border-radius:8px; padding:5px 8px; font-family:var(--mono);
  font-size:.7rem; cursor:pointer; }
.rail-lang:hover{ color:var(--cyan); border-color:var(--cyan); }
@media (max-width:768px){
  .rail-link{ writing-mode:horizontal-tb; flex-direction:row; gap:5px; }
  .rail-link .rail-i{ display:none; }
  .rail-lang{ margin-top:0; }
}
```

- [ ] **Step 3: Verify in browser**

Run: `open index.html`
Expected: rail shows JC monogram, 5 vertical labels, an EN button at the bottom.

- [ ] **Step 4: Commit**

```bash
git add index.html assets/css/styles.css
git commit -m "feat: nav rail markup + styles"
```

---

## Task 5: Hero (HOME) section

**Files:**
- Modify: `index.html` (`#home`)
- Modify: `assets/css/styles.css`

- [ ] **Step 1: Fill `#home`**

```html
<section id="home">
  <div class="hero">
    <div class="hero-cmd"><span class="prompt">$</span> <span class="muted" data-i18n="hero.cmd">cat profile.md</span></div>
    <h1 class="hero-name" data-i18n="hero.name">Jihwan Choi</h1>
    <p class="hero-role" data-i18n="hero.role">MLOps &amp; Software Engineer · SVEvalFlow Owner</p>
    <p class="hero-tagline" data-i18n="hero.tagline">I turn ML infrastructure into measurable business value.</p>
    <div class="hero-actions">
      <a class="btn" data-pdf href="assets/pdf/Resume_jihwanchoi_ENG.pdf" data-i18n="hero.cta.pdf">Download résumé (PDF)</a>
      <a class="btn ghost" href="https://github.com/jhwanchoi" target="_blank" rel="noopener">GitHub</a>
      <a class="btn ghost" href="https://linkedin.com/in/jihwan-choi-717554233/" target="_blank" rel="noopener">LinkedIn</a>
      <a class="btn ghost" href="mailto:jhwan333@gmail.com">Email</a>
    </div>
    <div class="metrics">
      <div class="metric"><div class="metric-v mono" data-count data-i18n="metric.saved.v">₩448M</div><div class="metric-l" data-i18n="metric.saved.l">SAVED VS AWS</div></div>
      <div class="metric"><div class="metric-v mono" data-count data-i18n="metric.valid.v">6mo→1.5mo</div><div class="metric-l" data-i18n="metric.valid.l">VALIDATION TIME</div></div>
      <div class="metric"><div class="metric-v mono" data-count data-i18n="metric.success.v">99.97%</div><div class="metric-l" data-i18n="metric.success.l">SUCCESS RATE</div></div>
      <div class="metric"><div class="metric-v mono" data-count data-i18n="metric.events.v">80M/day</div><div class="metric-l" data-i18n="metric.events.l">LOG EVENTS</div></div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add hero CSS**

```css
#home{ min-height:100vh; display:flex; align-items:center; }
.hero-cmd{ font-family:var(--mono); font-size:.85rem; margin-bottom:14px; }
.hero-name{ font-size:clamp(2.4rem,6vw,3.6rem); font-weight:800; letter-spacing:-.03em; }
.hero-role{ color:var(--cyan); font-weight:600; margin-top:4px; }
.hero-tagline{ color:var(--muted); max-width:560px; margin-top:14px; }
.hero-actions{ display:flex; flex-wrap:wrap; gap:10px; margin-top:22px; }
.btn{ background:var(--cyan); color:var(--bg); font-weight:700; font-size:.85rem;
  padding:9px 15px; border-radius:9px; }
.btn.ghost{ background:transparent; color:var(--muted); border:1px solid var(--border); }
.btn.ghost:hover{ color:var(--cyan); border-color:var(--cyan); }
.metrics{ display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-top:34px; }
.metric{ background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:14px; }
.metric-v{ font-size:1.4rem; font-weight:700; color:var(--violet); }
.metric:nth-child(2) .metric-v{ color:var(--cyan); }
.metric:nth-child(3) .metric-v{ color:var(--green); }
.metric:nth-child(4) .metric-v{ color:var(--amber); }
.metric-l{ font-size:.62rem; letter-spacing:.08em; color:var(--faint); margin-top:4px; }
@media (max-width:768px){ .metrics{ grid-template-columns:repeat(2,1fr); } }
```

- [ ] **Step 3: Verify in browser** — `open index.html`. Expected: full-height hero, name, cyan role, tagline, 4 buttons, 4 colored metric cards.

- [ ] **Step 4: Commit** — `git add -A && git commit -m "feat: hero section with metric cards"`

---

## Task 6: WORK timeline section

**Files:**
- Modify: `index.html` (`#work`), `assets/css/styles.css`

- [ ] **Step 1: Fill `#work`**

```html
<section id="work">
  <div class="section-index">02</div>
  <h2 class="section-title" data-i18n="work.title">Experience</h2>
  <div class="timeline">
    <article class="tl-item">
      <header class="tl-head">
        <span class="tl-co" data-i18n="work.sv.co">Stradvision</span>
        <span class="tl-meta"><span data-i18n="work.sv.role">Software Engineer</span> · <span data-i18n="work.sv.date">Jul 2022 – Present</span></span>
      </header>
      <h3 class="tl-sub" data-i18n="work.sv.mlops.h">MLOps Platform …</h3>
      <ul>
        <li data-i18n="work.sv.mlops.b1"></li>
        <li data-i18n="work.sv.mlops.b2"></li>
        <li data-i18n="work.sv.mlops.b3"></li>
      </ul>
      <h3 class="tl-sub" data-i18n="work.sv.data.h">Data &amp; Labeling Automation</h3>
      <ul><li data-i18n="work.sv.data.b1"></li></ul>
    </article>
    <article class="tl-item">
      <header class="tl-head">
        <span class="tl-co" data-i18n="work.kiro.co">KIRO</span>
        <span class="tl-meta"><span data-i18n="work.kiro.role">Researcher</span> · <span data-i18n="work.kiro.date">Jan – Jul 2022</span></span>
      </header>
      <ul><li data-i18n="work.kiro.b1"></li></ul>
    </article>
  </div>
</section>
```

- [ ] **Step 2: Add timeline CSS**

```css
.timeline{ border-left:2px solid var(--border); padding-left:22px; display:flex; flex-direction:column; gap:30px; }
.tl-item{ position:relative; }
.tl-item::before{ content:""; position:absolute; left:-29px; top:6px; width:10px; height:10px;
  border-radius:50%; background:var(--cyan); box-shadow:0 0 0 4px var(--bg); }
.tl-head{ display:flex; flex-wrap:wrap; align-items:baseline; gap:10px; }
.tl-co{ font-weight:800; font-size:1.05rem; }
.tl-meta{ color:var(--faint); font-family:var(--mono); font-size:.75rem; }
.tl-sub{ font-size:.9rem; color:var(--cyan); margin:14px 0 6px; font-weight:600; }
.tl-item ul{ list-style:none; display:flex; flex-direction:column; gap:6px; }
.tl-item li{ position:relative; padding-left:16px; color:var(--muted); font-size:.9rem; }
.tl-item li::before{ content:"▹"; position:absolute; left:0; color:var(--cyan); }
```

- [ ] **Step 3: Verify** — `open index.html`. Expected: vertical line with two dotted entries, Stradvision sub-roles as cyan headings + bulleted lists.

- [ ] **Step 4: Commit** — `git add -A && git commit -m "feat: work timeline section"`

---

## Task 7: SKILLS section

**Files:**
- Modify: `index.html` (`#skills`), `assets/css/styles.css`

- [ ] **Step 1: Fill `#skills`** — one row per category; chips are static (not translated):

```html
<section id="skills">
  <div class="section-index">03</div>
  <h2 class="section-title" data-i18n="skills.title">Skills</h2>
  <div class="skill-grid">
    <div class="skill-row"><span class="skill-cat" data-i18n="skills.languages">Languages</span><span class="chips">Python · C++ · TypeScript</span></div>
    <div class="skill-row"><span class="skill-cat" data-i18n="skills.backend">Backend</span><span class="chips">Django · FastAPI · NestJS</span></div>
    <div class="skill-row"><span class="skill-cat" data-i18n="skills.database">Database</span><span class="chips">PostgreSQL · MongoDB · Redis</span></div>
    <div class="skill-row"><span class="skill-cat" data-i18n="skills.cloud">Cloud</span><span class="chips">AWS (EC2 · EKS · ECS · SQS · SNS · Lambda · S3 · Bedrock)</span></div>
    <div class="skill-row"><span class="skill-cat" data-i18n="skills.infra">Infrastructure</span><span class="chips">Kubernetes (RKE2) · Docker · Terraform · CDK · Rancher</span></div>
    <div class="skill-row"><span class="skill-cat" data-i18n="skills.mlops">ML / MLOps</span><span class="chips">Ray · KubeRay · MLflow · KServe · Knative · lakeFS</span></div>
    <div class="skill-row"><span class="skill-cat" data-i18n="skills.cicd">CI/CD</span><span class="chips">ArgoCD · GitHub Actions · Harbor · Helm · Airflow</span></div>
    <div class="skill-row"><span class="skill-cat" data-i18n="skills.monitoring">Monitoring</span><span class="chips">Grafana · Prometheus · Loki · DataDog</span></div>
    <div class="skill-row"><span class="skill-cat" data-i18n="skills.ai">AI / LLM</span><span class="chips">Claude Code · Gemini CLI · Codex · MCP · AWS Bedrock · n8n</span></div>
    <div class="skill-row"><span class="skill-cat" data-i18n="skills.tools">Tools</span><span class="chips">Git · Jira · Confluence · Atlassian API</span></div>
  </div>
</section>
```

- [ ] **Step 2: Add CSS**

```css
.skill-grid{ display:flex; flex-direction:column; gap:10px; }
.skill-row{ display:grid; grid-template-columns:140px 1fr; gap:14px; align-items:baseline;
  padding:10px 0; border-bottom:1px solid var(--border); }
.skill-cat{ font-family:var(--mono); font-size:.78rem; color:var(--cyan); letter-spacing:.04em; }
.chips{ color:var(--muted); font-size:.9rem; }
@media (max-width:768px){ .skill-row{ grid-template-columns:1fr; gap:4px; } }
```

- [ ] **Step 3: Verify** — `open index.html`. Expected: 10 category rows, cyan mono labels left, tech list right.

- [ ] **Step 4: Commit** — `git add -A && git commit -m "feat: skills section"`

---

## Task 8: PROJECTS — expandable cards

**Files:**
- Modify: `index.html` (`#projects`), `assets/css/styles.css`

- [ ] **Step 1: Fill `#projects`** (5 cards; repeat the pattern per project, swapping the `proj.*` keys: inferit, mtbf, prism, wls, alas):

```html
<section id="projects">
  <div class="section-index">04</div>
  <h2 class="section-title" data-i18n="projects.title">Selected Projects</h2>
  <div class="proj-grid">

    <article class="proj card" data-project>
      <button class="proj-head" aria-expanded="false">
        <div class="proj-top">
          <span class="proj-name" data-i18n="proj.inferit.name">Inferit</span>
          <span class="proj-metric mono" data-i18n="proj.inferit.metric">6mo → 1.5mo</span>
        </div>
        <span class="proj-sub" data-i18n="proj.inferit.sub">svnet3 build/inference acceleration</span>
        <span class="proj-toggle" data-i18n="projects.expand">Details</span>
      </button>
      <div class="proj-body" hidden>
        <p data-i18n="proj.inferit.d1"></p>
        <p data-i18n="proj.inferit.d2"></p>
      </div>
    </article>

    <!-- Repeat the <article> above for: mtbf (d1,d2), prism (d1,d2), wls (d1), alas (d1).
         For single-detail projects (wls, alas) include only the <p> keys that exist. -->

  </div>
</section>
```

Concretely add these four more articles after Inferit:

```html
    <article class="proj card" data-project>
      <button class="proj-head" aria-expanded="false">
        <div class="proj-top"><span class="proj-name" data-i18n="proj.mtbf.name">MTBF Validation</span>
          <span class="proj-metric mono" data-i18n="proj.mtbf.metric">173,101 clips · 99.97%</span></div>
        <span class="proj-sub" data-i18n="proj.mtbf.sub"></span>
        <span class="proj-toggle" data-i18n="projects.expand">Details</span>
      </button>
      <div class="proj-body" hidden><p data-i18n="proj.mtbf.d1"></p><p data-i18n="proj.mtbf.d2"></p></div>
    </article>

    <article class="proj card" data-project>
      <button class="proj-head" aria-expanded="false">
        <div class="proj-top"><span class="proj-name" data-i18n="proj.prism.name">PRISM</span>
          <span class="proj-metric mono" data-i18n="proj.prism.metric"></span></div>
        <span class="proj-sub" data-i18n="proj.prism.sub"></span>
        <span class="proj-toggle" data-i18n="projects.expand">Details</span>
      </button>
      <div class="proj-body" hidden><p data-i18n="proj.prism.d1"></p><p data-i18n="proj.prism.d2"></p></div>
    </article>

    <article class="proj card" data-project>
      <button class="proj-head" aria-expanded="false">
        <div class="proj-top"><span class="proj-name" data-i18n="proj.wls.name">WLS</span>
          <span class="proj-metric mono" data-i18n="proj.wls.metric"></span></div>
        <span class="proj-sub" data-i18n="proj.wls.sub"></span>
        <span class="proj-toggle" data-i18n="projects.expand">Details</span>
      </button>
      <div class="proj-body" hidden><p data-i18n="proj.wls.d1"></p></div>
    </article>

    <article class="proj card" data-project>
      <button class="proj-head" aria-expanded="false">
        <div class="proj-top"><span class="proj-name" data-i18n="proj.alas.name">ALAS</span>
          <span class="proj-metric mono" data-i18n="proj.alas.metric"></span></div>
        <span class="proj-sub" data-i18n="proj.alas.sub"></span>
        <span class="proj-toggle" data-i18n="projects.expand">Details</span>
      </button>
      <div class="proj-body" hidden><p data-i18n="proj.alas.d1"></p></div>
    </article>
```

- [ ] **Step 2: Add CSS**

```css
.proj-grid{ display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.proj{ padding:0; overflow:hidden; }
.proj-head{ width:100%; text-align:left; background:transparent; border:0; color:inherit;
  padding:16px 18px; cursor:pointer; display:flex; flex-direction:column; gap:5px; }
.proj-top{ display:flex; justify-content:space-between; align-items:baseline; gap:10px; }
.proj-name{ font-weight:800; font-size:1.05rem; }
.proj-metric{ color:var(--green); font-size:.82rem; font-weight:700; }
.proj-sub{ color:var(--muted); font-size:.82rem; }
.proj-toggle{ font-family:var(--mono); font-size:.7rem; color:var(--cyan); margin-top:4px; }
.proj-toggle::before{ content:"+ "; }
.proj[aria-open] .proj-toggle::before{ content:"– "; }
.proj-body{ padding:0 18px 16px; display:flex; flex-direction:column; gap:8px;
  color:var(--muted); font-size:.88rem; border-top:1px solid var(--border); padding-top:12px; }
@media (max-width:768px){ .proj-grid{ grid-template-columns:1fr; } }
```

- [ ] **Step 3: Verify (interaction added in Task 10)** — `open index.html`. Expected: 5 project cards in a 2-col grid; bodies hidden; "+ Details" visible. (Clicking does nothing yet — wired in Task 10.)

- [ ] **Step 4: Commit** — `git add -A && git commit -m "feat: projects section with expandable cards"`

---

## Task 9: AI-NATIVE section + footer

**Files:**
- Modify: `index.html` (`#ai`, `#site-footer`), `assets/css/styles.css`

- [ ] **Step 1: Fill `#ai` and footer**

```html
<section id="ai">
  <div class="section-index">05</div>
  <h2 class="section-title" data-i18n="ai.title">AI-Native Development</h2>
  <p class="muted mono" style="font-size:.8rem;margin-bottom:18px" data-i18n="ai.sub">2025 – Present</p>
  <div class="ai-grid">
    <div class="ai-card card"><h3 data-i18n="ai.llmwiki.t">LLM Wiki</h3><p data-i18n="ai.llmwiki.d"></p></div>
    <div class="ai-card card"><h3 data-i18n="ai.debate.t">Multi-Model Debate</h3><p data-i18n="ai.debate.d"></p></div>
    <div class="ai-card card"><h3 data-i18n="ai.bedrock.t">Bedrock Observability</h3><p data-i18n="ai.bedrock.d"></p></div>
    <div class="ai-card card"><h3 data-i18n="ai.plugin.t">Cluster-ops Plugin</h3><p data-i18n="ai.plugin.d"></p></div>
    <div class="ai-card card"><h3 data-i18n="ai.evangelism.t">Evangelism</h3><p data-i18n="ai.evangelism.d"></p></div>
  </div>
</section>

<footer id="site-footer">
  <div class="footer-edu">
    <span class="section-index" data-i18n="edu.title">Education</span>
    <div><strong data-i18n="edu.school">Handong Global University</strong>
      <span class="muted" data-i18n="edu.degree">B.S. ECE</span>
      <span class="mono muted" data-i18n="edu.date">2018 – 2022</span></div>
  </div>
  <div class="footer-links">
    <a href="mailto:jhwan333@gmail.com">jhwan333@gmail.com</a>
    <a href="https://github.com/jhwanchoi" target="_blank" rel="noopener">GitHub</a>
    <a href="https://linkedin.com/in/jihwan-choi-717554233/" target="_blank" rel="noopener">LinkedIn</a>
    <a href="#home" data-i18n="footer.top">Back to top</a>
  </div>
</footer>
```

- [ ] **Step 2: Add CSS**

```css
.ai-grid{ display:grid; grid-template-columns:repeat(2,1fr); gap:14px; }
.ai-card h3{ font-size:.95rem; color:var(--green); margin-bottom:6px; }
.ai-card p{ color:var(--muted); font-size:.86rem; }
#site-footer{ margin-left:var(--rail-w); max-width:var(--maxw); margin-right:auto;
  padding:30px 28px 60px; border-top:1px solid var(--border); display:flex;
  flex-wrap:wrap; justify-content:space-between; gap:18px; }
.footer-edu div{ display:flex; flex-direction:column; gap:2px; margin-top:4px; }
.footer-links{ display:flex; flex-wrap:wrap; gap:16px; align-items:center;
  font-family:var(--mono); font-size:.82rem; color:var(--muted); }
.footer-links a:hover{ color:var(--cyan); }
@media (max-width:768px){ .ai-grid{ grid-template-columns:1fr; } #site-footer{ margin-left:0; } }
```

- [ ] **Step 3: Verify** — `open index.html`. Expected: 5 AI cards (green headings), footer with education + links.

- [ ] **Step 4: Commit** — `git add -A && git commit -m "feat: AI-native section + footer"`

---

## Task 10: Interactions — toggle, scrollspy, card expand, count-up, typing

**Files:**
- Create: `assets/js/main.js`

- [ ] **Step 1: Create `main.js`**

```js
import { applyLang } from "./i18n.js";

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---- language toggle ---- */
function initLang(){
  let lang = "en";
  try{ lang = localStorage.getItem("lang") || "en"; }catch(e){}
  applyLang(lang);
  const btn = document.getElementById("lang-toggle");
  if(btn){
    btn.textContent = (lang === "en") ? "EN" : "KR";
    btn.addEventListener("click", ()=>{
      lang = (lang === "en") ? "ko" : "en";
      applyLang(lang);
      btn.textContent = (lang === "en") ? "EN" : "KR";
    });
  }
}

/* ---- scrollspy: highlight active rail link ---- */
function initSpy(){
  const links = [...document.querySelectorAll(".rail-link")];
  const byId = id => links.find(l => l.getAttribute("data-spy") === id);
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting){
        links.forEach(l=>l.classList.remove("active"));
        const a = byId(en.target.id); if(a) a.classList.add("active");
      }
    });
  }, { rootMargin:"-45% 0px -45% 0px", threshold:0 });
  document.querySelectorAll("main section").forEach(s=>obs.observe(s));
}

/* ---- expandable project cards ---- */
function initCards(){
  document.querySelectorAll("[data-project]").forEach(card=>{
    const head = card.querySelector(".proj-head");
    const body = card.querySelector(".proj-body");
    head.addEventListener("click", ()=>{
      const open = head.getAttribute("aria-expanded") === "true";
      head.setAttribute("aria-expanded", String(!open));
      if(open){ body.hidden = true; card.removeAttribute("aria-open"); }
      else{ body.hidden = false; card.setAttribute("aria-open",""); }
    });
  });
}

/* ---- count-up on scroll for numeric-leading metrics ---- */
function countUp(el){
  const target = el.textContent.trim();
  const m = target.match(/^([^\d]*)([\d,.]+)(.*)$/);   // prefix, number, suffix
  if(!m){ return; }                                     // non-numeric (e.g. 6mo→1.5mo): leave as-is
  const [ , pre, numStr, suf ] = m;
  const dec = (numStr.split(".")[1]||"").length;
  const end = parseFloat(numStr.replace(/,/g,""));
  const useComma = numStr.includes(",");
  let start=null; const dur=900;
  function frame(t){
    if(start===null) start=t;
    const p = Math.min((t-start)/dur, 1);
    const val = end * (0.2 + 0.8*p) * (p<1 ? 1 : 1);
    let cur = (end*p);
    let s = dec ? cur.toFixed(dec) : Math.round(cur).toString();
    if(useComma) s = Number(s).toLocaleString("en-US");
    el.textContent = pre + s + suf;
    if(p<1) requestAnimationFrame(frame);
    else el.textContent = target;
  }
  requestAnimationFrame(frame);
}
function initCounters(){
  if(reduce) return;
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{ if(en.isIntersecting){ countUp(en.target); obs.unobserve(en.target); } });
  }, { threshold:0.6 });
  document.querySelectorAll("[data-count]").forEach(el=>obs.observe(el));
}

/* ---- typing effect on hero command ---- */
function initTyping(){
  const el = document.querySelector(".hero-cmd .muted");
  if(!el || reduce) return;
  const full = el.textContent; el.textContent = "";
  let i=0; (function tick(){ el.textContent = full.slice(0, ++i);
    if(i<full.length) setTimeout(tick, 55); })();
}

window.addEventListener("DOMContentLoaded", ()=>{
  initLang(); initSpy(); initCards(); initCounters(); initTyping();
});
```

- [ ] **Step 2: Verify all interactions in browser**

Run: `open index.html` and check:
- Click **EN** button → all text switches to Korean, button shows **KR**, PDF link points to `…KOR.pdf`; reload keeps Korean.
- Scroll → active rail link highlights cyan per section.
- Click a project card → body expands, toggle shows "–"; click again collapses.
- On load, hero `$ cat profile.md` types out; `99.97%` / `80M/day` count up when scrolled into view.
- Expected: no console errors.

- [ ] **Step 3: Commit** — `git add assets/js/main.js && git commit -m "feat: interactions — lang toggle, scrollspy, card expand, count-up, typing"`

---

## Task 11: Assets — PDFs, favicon, meta/OG, i18n smoke check

**Files:**
- Create: `assets/pdf/Resume_jihwanchoi_ENG.pdf`, `assets/pdf/Resume_jihwanchoi_KOR.pdf`
- Create: `assets/favicon.svg`
- Create: `scripts/check-i18n.mjs`
- Modify: `index.html` (`<head>` meta)

- [ ] **Step 1: Copy résumé PDFs into the repo**

```bash
SRC="/Users/jihwanchoi/Library/Mobile Documents/iCloud~md~obsidian/Documents/Personal/Resume"
mkdir -p ~/jhwanchoi.github.io/assets/pdf
cp "$SRC/Resume_jihwanchoi_ENG.pdf" ~/jhwanchoi.github.io/assets/pdf/
cp "$SRC/Resume_jihwanchoi_KOR.pdf" ~/jhwanchoi.github.io/assets/pdf/
```

- [ ] **Step 2: Create `assets/favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#0b1020"/>
  <text x="32" y="42" font-family="monospace" font-size="30" font-weight="700"
        fill="#22d3ee" text-anchor="middle">JC</text>
</svg>
```

- [ ] **Step 3: Add meta/OG tags to `<head>`**

```html
  <meta name="description" content="Jihwan Choi — MLOps / Software Engineer. SVEvalFlow owner; distributed ML validation, cost-driven on-prem transitions, AI-native tooling.">
  <meta property="og:title" content="Jihwan Choi — MLOps / Software Engineer">
  <meta property="og:description" content="MLOps inference/evaluation platform owner & AI-native tool builder.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://jhwanchoi.github.io">
```

- [ ] **Step 4: Create `scripts/check-i18n.mjs` (dependency-free)**

```js
import { readFileSync } from "node:fs";
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const { STRINGS } = await import(new URL("../assets/js/i18n.js", import.meta.url));
const keys = [...html.matchAll(/data-i18n="([^"]+)"/g)].map(m=>m[1]);
const uniq = [...new Set(keys)];
let bad = 0;
for(const k of uniq){
  for(const lang of ["en","ko"]){
    if(STRINGS[lang][k] == null){ console.error(`MISSING ${lang}: ${k}`); bad++; }
  }
}
const enExtra = Object.keys(STRINGS.en).length, koExtra = Object.keys(STRINGS.ko).length;
if(enExtra !== koExtra){ console.error(`COUNT MISMATCH en=${enExtra} ko=${koExtra}`); bad++; }
console.log(bad ? `FAIL: ${bad} issue(s)` : `OK: ${uniq.length} keys resolve in EN & KR`);
process.exit(bad ? 1 : 0);
```

- [ ] **Step 5: Run the smoke check**

Run: `cd ~/jhwanchoi.github.io && node scripts/check-i18n.mjs`
Expected: `OK: <n> keys resolve in EN & KR`. If it fails, add the missing keys to `i18n.js` and re-run.

- [ ] **Step 6: Verify favicon + PDF download in browser** — `open index.html`; click "Download résumé" (EN) → opens ENG pdf; toggle to KR → opens KOR pdf.

- [ ] **Step 7: Commit** — `git add -A && git commit -m "feat: pdf assets, favicon, OG meta, i18n smoke check"`

---

## Task 12: Polish pass + deploy

**Files:**
- Modify: any (visual refinements only)

- [ ] **Step 1: Cross-check rendering**

Open `index.html`, verify at full width and < 768px: rail→top bar, metrics 4→2 cols, projects/ai 2→1 col, no horizontal scroll, Korean text doesn't overflow cards.

- [ ] **Step 2: Final i18n + console check**

Run: `node scripts/check-i18n.mjs` → `OK`. Browser console → no errors in either language.

- [ ] **Step 3: Push to GitHub**

```bash
cd ~/jhwanchoi.github.io
git push -u origin main
```
Expected: branch `main` created on remote with all files.

- [ ] **Step 4: Enable GitHub Pages**

Either: GitHub UI → Settings → Pages → Source = `Deploy from a branch`, Branch = `main` / `/ (root)` → Save.
Or via gh CLI: `gh api -X POST repos/jhwanchoi/jhwanchoi.github.io/pages -f source[branch]=main -f source[path]=/ 2>/dev/null || true`

- [ ] **Step 5: Verify live**

Wait ~1 min, then: `open https://jhwanchoi.github.io`
Expected: site loads over HTTPS, toggle/scrollspy/cards work, PDFs download.

- [ ] **Step 6: Final commit (if any polish changes)** — `git add -A && git commit -m "polish: responsive + a11y refinements" && git push`

---

## Self-Review (completed)

**Spec coverage:** Language toggle (T3/T10) ✓ · single-page concise resume (T4–T9) ✓ · hand-coded no-build (all) ✓ · dark dashboard + terminal aesthetic (T2/T5) ✓ · terminal hero + left rail (T4/T5) ✓ · sections HOME/WORK/SKILLS/PROJECTS/AI + footer (T5–T9) ✓ · i18n data-attr approach (T3) ✓ · expandable cards (T8/T10) ✓ · count-up + typing + reduced-motion (T10) ✓ · PDF download swap (T3/T11) ✓ · responsive + a11y (T2/T12) ✓ · GitHub Pages from main + .nojekyll (T1/T12) ✓.

**Placeholder scan:** the only "repeat the pattern" note (T8) is immediately followed by the concrete full markup for all four remaining cards — no unresolved placeholders.

**Type consistency:** `applyLang(lang)` signature, `[data-i18n]` / `[data-pdf]` / `[data-count]` / `[data-spy]` / `[data-project]` attributes, and `.active` / `aria-open` states are used identically across HTML, CSS, and JS tasks.
