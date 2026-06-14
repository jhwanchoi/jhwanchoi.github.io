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
const en = Object.keys(STRINGS.en).length, ko = Object.keys(STRINGS.ko).length;
if(en !== ko){ console.error(`COUNT MISMATCH en=${en} ko=${ko}`); bad++; }
console.log(bad ? `FAIL: ${bad} issue(s)` : `OK: ${uniq.length} keys resolve in EN & KR (en=${en}, ko=${ko})`);
process.exit(bad ? 1 : 0);
