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
  initLang(); initSpy(); initCards(); initCounters(); retype();
});
