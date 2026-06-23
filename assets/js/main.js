import { applyLang } from "./i18n.js";
import { SKILLS, badgeURL } from "./skills.js";

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---- render shields.io skill badges (replaces text fallback) ---- */
function initSkills(){
  document.querySelectorAll(".chips[data-cat]").forEach(span=>{
    const list = SKILLS[span.getAttribute("data-cat")];
    if(!list) return;
    span.classList.add("badges");
    span.innerHTML = list.map(s=>
      `<img loading="lazy" src="${badgeURL(s)}" alt="${s.n}">`).join("");
  });
}

/* ---- language toggle ---- */
function initLang(){
  let lang = "en";
  try{ lang = (localStorage.getItem("lang") === "ko") ? "ko" : "en"; }catch(e){}
  applyLang(lang);
  const btn = document.getElementById("lang-toggle");
  function syncBtn(){
    if(!btn) return;
    btn.textContent = (lang === "en") ? "EN" : "KR";
    // accessible name announces the action, in the current UI language
    btn.setAttribute("aria-label", (lang === "en") ? "Switch to Korean" : "영어로 전환");
  }
  syncBtn();
  if(btn){
    btn.addEventListener("click", ()=>{
      lang = (lang === "en") ? "ko" : "en";
      applyLang(lang);
      syncBtn();
      retype();           // replay the hero typing in the new language
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
        links.forEach(l=>{ l.classList.remove("active"); l.removeAttribute("aria-current"); });
        const a = byId(en.target.id);
        if(a){ a.classList.add("active"); a.setAttribute("aria-current","true"); }
      }
    });
  }, { rootMargin:"-45% 0px -45% 0px", threshold:0 });
  document.querySelectorAll("main section").forEach(s=>obs.observe(s));
}

/* ---- expandable project cards ---- */
function setCardOpen(card, open){
  const head = card.querySelector(".proj-head");
  const body = card.querySelector(".proj-body");
  if(!head || !body) return;
  head.setAttribute("aria-expanded", String(open));
  body.hidden = !open;
  card.classList.toggle("is-open", open);
}
function initCards(){
  document.querySelectorAll("[data-project]").forEach(card=>{
    const head = card.querySelector(".proj-head");
    const body = card.querySelector(".proj-body");
    if(!head || !body) return;
    head.addEventListener("click", ()=>{
      const open = head.getAttribute("aria-expanded") === "true";
      setCardOpen(card, !open);
      // reflect the open card in the URL so it's deep-linkable/shareable
      if(!open && card.id){ try{ history.replaceState(null, "", "#" + card.id); }catch(e){} }
    });
  });
}

/* ---- deep links: open + scroll to a card/section from the URL hash ---- */
function openFromHash(){
  const id = decodeURIComponent((location.hash || "").slice(1));
  if(!id) return;
  const el = document.getElementById(id);
  if(!el) return;
  if(el.hasAttribute("data-project")) setCardOpen(el, true);
  requestAnimationFrame(()=> el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }));
}

/* ---- count-up on scroll for numeric-leading metrics ---- */
function countUp(el){
  const target = el.textContent.trim();
  if(/→/.test(target)) return;                          // skip before→after / range metrics
  const m = target.match(/^([^\d]*)([\d,.]+)(.*)$/);   // prefix, number, suffix
  if(!m) return;                                        // non-numeric: leave as-is
  const [ , pre, numStr, suf ] = m;
  const dec = (numStr.split(".")[1]||"").length;
  const end = parseFloat(numStr.replace(/,/g,""));
  const useComma = numStr.includes(",");
  const dur = 900; let start = null;
  function frame(t){
    if(start === null) start = t;
    const p = Math.min((t-start)/dur, 1);
    let s = dec ? (end*p).toFixed(dec) : Math.round(end*p).toString();
    if(useComma) s = Number(s).toLocaleString("en-US");
    el.textContent = pre + s + suf;
    if(p < 1) requestAnimationFrame(frame);
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
let typeTimer = null;
function retype(){
  const el = document.querySelector(".hero-cmd .muted");
  if(!el) return;
  if(reduce) return;                 // applyLang already set full text
  if(typeTimer) clearTimeout(typeTimer);
  const full = el.textContent; el.textContent = "";
  let i = 0;
  (function tick(){ el.textContent = full.slice(0, ++i);
    if(i < full.length) typeTimer = setTimeout(tick, 55); })();
}

window.addEventListener("DOMContentLoaded", ()=>{
  initLang(); initSkills(); initSpy(); initCards(); initCounters(); retype();
  openFromHash();
});
window.addEventListener("hashchange", openFromHash);
