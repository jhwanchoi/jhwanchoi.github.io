// Diagram generator — lays out flow diagrams as SVG with auto-wrapped text and
// auto-sized boxes so text never overflows/overlaps. Monospace width is
// estimated at 0.6em. Run: node scripts/gen-diagrams.mjs
import { writeFileSync } from "node:fs";

const W = 900, M = 26, GAP = 34, PAD = 13, TOP = 70, ROWGAP = 46;
const FONT = "'IBM Plex Mono',ui-monospace,Menlo,monospace";
const C = {
  bg:"#ffffff", box:"#f4f0e7", border:"#e6e0d3", text:"#1f1d18", sub:"#5f5b50",
  cap:"#8b8675", ttl:"#27317f", arrow:"#b3ab99", chipbg:"#ece7db", chiptx:"#3a362c",
};
const ACC = { cyan:"#2c7572", violet:"#4a55b8", green:"#1d7a44", amber:"#a96a12" };
const TINT = { cyan:"#e7f0ef", violet:"#eaecf8", green:"#e7f2eb", amber:"#f6efe2" };

const esc = s => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const charW = fs => fs * 0.6;
function wrap(text, maxW, fs){
  const max = Math.max(4, Math.floor(maxW / charW(fs)));
  const out = [];
  for(const word of String(text).split(/\s+/)){
    let w = word;
    if(!out.length){ out.push(w); continue; }
    const last = out[out.length-1];
    if((last + " " + w).length <= max){ out[out.length-1] = last + " " + w; }
    else { out.push(w); }
    // hard break overlong tokens
    while(out[out.length-1].length > max){
      const cur = out[out.length-1];
      out[out.length-1] = cur.slice(0, max);
      out.push(cur.slice(max));
    }
  }
  return out;
}

const TFS = 13, BFS = 10.5, TLH = 17, BLH = 14;
function boxLayout(node, boxW){
  const inner = boxW - PAD*2 - 6;
  const titleLines = wrap(node.title, inner, TFS);
  const bodyLines = (node.lines || []).flatMap(l => wrap(l, inner, BFS));
  const h = 12 + titleLines.length*TLH + (bodyLines.length ? 8 + bodyLines.length*BLH : 0) + 12;
  return { titleLines, bodyLines, h };
}

function renderBox(x, y, w, h, node, lay){
  const acc = ACC[node.accent] || ACC.cyan;
  let s = "";
  if(node.emphasis){
    s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="11" fill="${TINT[node.accent]||C.box}" stroke="${acc}" stroke-width="1.8"/>`;
  } else {
    s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="11" fill="${C.box}" stroke="${C.border}" stroke-width="1.5"/>`;
    s += `<rect x="${x}" y="${y}" width="5" height="${h}" rx="2.5" fill="${acc}"/>`;
  }
  const tx = x + PAD + 6;
  let cy = y + 12 + 13;
  const titleColor = C.text;
  for(const ln of lay.titleLines){
    s += `<text x="${tx}" y="${cy}" fill="${titleColor}" font-size="${TFS}" font-weight="700">${esc(ln)}</text>`;
    cy += TLH;
  }
  if(lay.bodyLines.length){
    cy += 8 - TLH + TLH; // keep baseline; small gap
    cy = y + 12 + lay.titleLines.length*TLH + 8 + 11;
    for(const ln of lay.bodyLines){
      s += `<text x="${tx}" y="${cy}" fill="${C.sub}" font-size="${BFS}">${esc(ln)}</text>`;
      cy += BLH;
    }
  }
  return s;
}

function diagram(d){
  const rows = d.rows;
  let svg = "";
  let y = TOP;
  const rowMeta = [];
  // layout rows
  for(const row of rows){
    const boxes = row.boxes;
    const n = boxes.length;
    const boxW = (W - M*2 - GAP*(n-1)) / n;
    const lays = boxes.map(b => boxLayout(b, boxW));
    const rowH = Math.max(...lays.map(l => l.h));
    const labelH = row.label ? 20 : 0;
    rowMeta.push({ boxes, lays, boxW, rowH, y: y + labelH, labelY: y + 13, label: row.label, flow: row.flow !== false });
    y += labelH + rowH + ROWGAP;
  }
  // legend
  const legend = d.legend || [];
  const LFS = 10, lcw = LFS * 0.64;   // safety margin: SVG-in-<img> falls back to system mono
  let lx = M, ly = y - ROWGAP + 24, legendSvg = "", lh = 0;
  if(legend.length){ lh = 8; }
  const chips = [];
  for(const t of legend){
    const cw = Math.ceil((t.length + 2)*lcw) + 24;   // +2 for the "● " prefix
    if(lx + cw > W - M){ lx = M; ly += 34; }
    chips.push({ x:lx, y:ly, w:cw, t }); lx += cw + 10;
  }
  const legendBottom = legend.length ? ly + 26 : y - ROWGAP;
  const H = Math.ceil(legendBottom + 18);

  // emit
  svg += `<rect width="${W}" height="${H}" fill="${C.bg}"/>`;
  svg += `<text x="${M}" y="32" fill="${C.ttl}" font-size="15" font-weight="700">${esc(d.title)}</text>`;
  if(d.subtitle) svg += `<text x="${M}" y="51" fill="${C.cap}" font-size="10.5">${esc(d.subtitle)}</text>`;

  for(const rm of rowMeta){
    if(rm.label) svg += `<text x="${M}" y="${rm.labelY}" fill="${C.cap}" font-size="10" font-weight="700" letter-spacing="1">${esc(rm.label)}</text>`;
    let x = M;
    const mid = rm.y + rm.rowH/2;
    rm.boxes.forEach((b, i) => {
      svg += renderBox(x, rm.y, rm.boxW, rm.rowH, b, rm.lays[i]);
      if(rm.flow && i < rm.boxes.length-1){
        const ax = x + rm.boxW, ax2 = x + rm.boxW + GAP;
        svg += `<path d="M${ax+2} ${mid} H${ax2-4}" stroke="${C.arrow}" stroke-width="1.7" fill="none" marker-end="url(#ah)"/>`;
      }
      x += rm.boxW + GAP;
    });
  }
  for(const ch of chips){
    svg += `<rect x="${ch.x}" y="${ch.y}" width="${ch.w}" height="26" rx="7" fill="${C.chipbg}" stroke="${C.border}" stroke-width="1"/>`;
    svg += `<text x="${ch.x+13}" y="${ch.y+17}" fill="${C.chiptx}" font-size="${LFS}">● ${esc(ch.t)}</text>`;
  }

  const full = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" font-family="${FONT}" role="img" aria-label="${esc(d.title)}">`
    + `<defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${C.arrow}"/></marker></defs>`
    + svg + `</svg>\n`;
  writeFileSync(new URL(`../assets/diagrams/${d.file}`, import.meta.url), full);
  console.log(`✓ ${d.file}  (${W}x${H})`);
}

// ---------------- diagram definitions ----------------
const DIAGRAMS = [
  {
    file: "vertex-gemini.svg",
    title: "Gemini × Vertex AI — Auto-FP Detection (production)",
    subtitle: "autonomous-driving vision inference to multimodal LLM classification",
    rows: [{ boxes: [
      { title:"Airflow DAG", lines:["SVNet3 inference","GPU workers"], accent:"violet" },
      { title:"Frames + meta", lines:["JPEG + AEB / TTC","to S3 / HCP"], accent:"cyan" },
      { title:"Vertex AI · Gemini 2.5 Flash", lines:["image + metadata","+ inspection manual"], accent:"green", emphasis:true },
      { title:"Structured JSON", lines:["FP / TP · confidence","· reasoning (schema)"], accent:"amber" },
      { title:"PostgreSQL", lines:["to stats dashboard"], accent:"cyan" },
    ]}],
    legend: [
      "FastAPI batched async · dedup ~40% fewer calls",
      "per-request token tracking",
      "JSON-schema structured output",
      "human-in-the-loop (human decides)",
      "real customer-release evaluation",
    ],
  },
  {
    file: "bedrock-observability.svg",
    title: "AWS Bedrock — LLM Cost & Usage Observability",
    subtitle: "token-level cost-per-request attribution · Terraform IaC",
    rows: [{ boxes: [
      { title:"Bedrock", lines:["model invocations","multi-region"], accent:"amber" },
      { title:"CloudWatch Logs", lines:["invocation logs","in / out / cache tokens"], accent:"cyan" },
      { title:"Lambda (daily)", lines:["EventBridge cron 00:00","Logs Insights queries","cost calc · pricing.json"], accent:"amber", emphasis:true },
      { title:"Custom Metrics", lines:["Custom/BedrockCost","per model · per user"], accent:"violet" },
      { title:"Dashboard + Slack", lines:["cost / token widgets","daily team report"], accent:"green" },
    ]}],
    legend: [
      "cache-token pricing (0.1x / 1.25x)",
      "per-user IAM cost attribution",
      "90%+ vs actual billing",
      "org cost-optimization tool",
    ],
  },
  {
    file: "rag-wiki.svg",
    title: "RAG Knowledge Wiki — Hybrid Retrieval + Grounded Synthesis",
    subtitle: "keyword + embedding retrieval to cited answers · CI-rebuilt vector index",
    rows: [
      { label:"INDEX BUILD (CI)", boxes: [
        { title:"Git + Markdown", lines:["docs + frontmatter"], accent:"violet" },
        { title:"GitHub Actions", lines:["build embedding index"], accent:"violet" },
        { title:"Vector index (.npy)", lines:["text-embedding-3-small"], accent:"violet" },
      ]},
      { label:"QUERY", boxes: [
        { title:"User question", lines:["symptom / intent"], accent:"cyan" },
        { title:"Hybrid retrieval", lines:["grep field-scoring","+ embedding cosine top-k"], accent:"cyan", emphasis:true },
        { title:"Context inject", lines:["top docs + sections"], accent:"amber" },
        { title:"LLM synthesis", lines:["grounded + cited","+ freshness signals"], accent:"green", emphasis:true },
      ]},
    ],
    legend: [
      "hybrid keyword + vector retrieval",
      "CI-rebuilt index (Git + Markdown)",
      "grounded answers with citations",
    ],
  },
  // ---- platform & SVEvalFlow project diagrams ----
  {
    file: "mlops-platform.svg",
    title: "MLOps Platform — Shared GPU Cluster & SVEvalFlow",
    subtitle: "RKE2 Kubernetes · GitOps · co-designed (led scheduler & queue policy)",
    rows: [
      { label:"SVEVALFLOW · inference / evaluation (sole owner)", flow:false, boxes:[
        { title:"Inferit", lines:["svnet3 build","+ inference"], accent:"green", emphasis:true },
        { title:"MTBF Validation", lines:["AEB analysis","at scale"], accent:"green", emphasis:true },
        { title:"PRISM", lines:["ISP convert","+ re-sim"], accent:"green", emphasis:true },
      ]},
      { label:"ORCHESTRATION & MLOPS", flow:false, boxes:[
        { title:"Airflow", lines:["DAG orchestration"], accent:"cyan" },
        { title:"Ray / KubeRay", lines:["distributed compute"], accent:"cyan" },
        { title:"KServe / Knative", lines:["scale-to-zero serve"], accent:"cyan" },
        { title:"MLflow", lines:["registry / tracking"], accent:"cyan" },
        { title:"lakeFS", lines:["versioned data"], accent:"cyan" },
        { title:"Harbor", lines:["image registry"], accent:"cyan" },
      ]},
      { label:"GITOPS & SECRETS", flow:false, boxes:[
        { title:"GitHub Actions", lines:["build → registry"], accent:"violet" },
        { title:"ArgoCD", lines:["app-of-apps sync"], accent:"violet" },
        { title:"External Secrets", lines:["secret injection"], accent:"violet" },
        { title:"Grafana / Prometheus", lines:["observability"], accent:"violet" },
      ]},
      { label:"RKE2 CLUSTER + STORAGE", flow:false, boxes:[
        { title:"Control plane", lines:["K8s API"], accent:"amber" },
        { title:"GPU workers", lines:["60+ heterogeneous"], accent:"amber" },
        { title:"Service nodes", lines:["platform UIs"], accent:"amber" },
        { title:"Object store + NFS", lines:["artifacts / data"], accent:"amber" },
      ]},
    ],
    legend: [
      "led scheduler & queue policy design",
      "Scale-to-Zero serverless inference",
      "dev/prod isolation (quota · priority)",
      "GitOps: GitHub → registry → ArgoCD → cluster",
    ],
  },
  {
    file: "inferit.svg",
    title: "Inferit — svnet3 Build & Distributed Inference",
    subtitle: "config/artifact management · Ray fan-out across cluster GPUs · EDD",
    rows: [{ boxes: [
      { title:"Entry", lines:["Engineer / PRISM","EDD / MTBF / CLI"], accent:"cyan" },
      { title:"Inferit BFF", lines:["FastAPI + Postgres","jobs · profiles · idem"], accent:"violet" },
      { title:"Airflow svnet_inference", lines:["envelope fan-out","16-GPU cap"], accent:"cyan" },
      { title:"K8s GPU pods", lines:["init → engine","→ sidecar"], accent:"green", emphasis:true },
      { title:"Artifacts", lines:["lakeFS · Harbor","MLflow · Postgres"], accent:"amber" },
      { title:"Callback", lines:["to caller"], accent:"cyan" },
    ]}],
    legend: [
      "builds svnet3 across many configs",
      "option-file / camera-param versioning",
      "distributed/parallel: 6mo to 1.5mo",
      "EDD evaluation integration",
    ],
  },
  {
    file: "prism.svg",
    title: "PRISM — Jira-Driven ISP Conversion & Re-simulation",
    subtitle: "event-driven · Terraform IaC · dual-version (issue + latest)",
    rows: [{ boxes: [
      { title:"Jira ticket", lines:["status change"], accent:"cyan" },
      { title:"Webhook", lines:["FastAPI · ALB/TLS"], accent:"violet" },
      { title:"SQS FIFO", lines:["dedup · DLQ"], accent:"amber" },
      { title:"Lambda consumer", lines:["ordered per issue"], accent:"violet" },
      { title:"Backend", lines:["versioned jobs","Postgres"], accent:"cyan" },
      { title:"ISP conversion tool", lines:["in-house"], accent:"green" },
      { title:"Airflow Resim DAG", lines:["dual-version"], accent:"green", emphasis:true },
    ]}],
    legend: [
      "Phase 1 (ISP): deployed ~150/month",
      "Phase 2 (Resim): in dev · technical lead",
      "FIFO ordering per issue key",
      "80% faster than manual",
    ],
  },
  {
    file: "mtbf-pipeline.svg",
    title: "MTBF Validation — Large-Scale Reliability Pipeline",
    subtitle: "release-gated svnet3 inference + AEB analysis at scale",
    rows: [{ boxes: [
      { title:"Command / ticket", lines:["validation request"], accent:"cyan" },
      { title:"Airflow mtbf_validation", lines:["DAG orchestration"], accent:"violet" },
      { title:"GPU pods", lines:["SVNet3 inference","KPO fan-out"], accent:"green", emphasis:true },
      { title:"AEB evaluation", lines:["9 configs","3 TTC × 3 frames"], accent:"amber" },
      { title:"Visual Inspection", lines:["+ Gemini assist"], accent:"cyan" },
      { title:"PostgreSQL + dashboard", lines:["Redis cache"], accent:"cyan" },
    ]}],
    legend: [
      "173,101 clips · 99.97% success",
      "+205% throughput vs single machine",
      "automation: single-person operation",
      "Gemini auto-FP on Vertex AI (see GenAI)",
    ],
  },
];

for(const d of DIAGRAMS) diagram(d);
console.log("done.");
