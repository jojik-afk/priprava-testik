// @title Français – Révision R7A (pays, vacances, nature, université)
// @subject Languages
// @topic Francouzština – opakovací test 23. 10. (Édito A1, str. 132–147)
// @template mixed

import { useState, useCallback, useMemo, useEffect } from "react";

/* ═══════════════════════════════════════════════════════════════════
   TÉMA "AFFICHE" — ivory, trikolóra, dvojitý rámeček
   Rody barevně: le/un = bleu, la/une = rouge, les/des = noir
   Varianta oproti testům 1–12 a 13–23: plakátová hlavička na papíře
   s „vstupenkou“ (datum testu), svislý postranní rejstřík místo
   vodorovných záložek, úvodní záložka = plán testu se zaškrtáváním.
   ═══════════════════════════════════════════════════════════════════ */

const CSS = `
.root {
  --ivory:#fbf7f0; --paper:#ffffff; --ink:#1a1a1a; --muted:#5b5750;
  --bleu:#1b3a8f; --rouge:#c8102e; --line:#d8d0c2;
  --ok:#1f7a45; --bad:#b32020; --warn:#a86a00;
  background: var(--ivory);
  color: var(--ink);
  font-family:'Montserrat',system-ui,sans-serif;
  font-size:16px; line-height:1.65;
  min-height:100vh;
  position:relative;
}
.root *{box-sizing:border-box;}
.root ul{list-style:disc; padding-left:22px; margin:10px 0;}
.root ol{list-style:decimal; padding-left:24px; margin:10px 0;}
.root li{margin:4px 0;}
.root p{margin:10px 0;}
.root button{font-family:inherit;}
.root h1,.root h2,.root h3,.root h4{font-family:'Playfair Display',Georgia,serif; font-weight:700; margin:0; line-height:1.25;}

.tricolore{
  position:fixed; left:0; top:0; bottom:0; width:6px; z-index:50;
  background:linear-gradient(to bottom,var(--bleu) 0 33.33%,#fff 33.33% 66.66%,var(--rouge) 66.66% 100%);
}
.shell{ padding-left:6px; }

/* ── plakátová hlavička ── */
.affiche{ border-bottom:3px double var(--bleu); background:var(--ivory); }
.affiche-in{
  max-width:1220px; margin:0 auto; padding:30px 26px 24px;
  display:flex; gap:28px; align-items:flex-end; justify-content:space-between;
}
.affiche .kicker{ font-size:12px; letter-spacing:.26em; text-transform:uppercase; color:var(--rouge); font-weight:700; }
.affiche h1{ font-size:clamp(30px,5.4vw,56px); color:var(--bleu); font-weight:900; margin-top:6px; letter-spacing:-.01em; }
.affiche h1 em{ color:var(--rouge); font-style:italic; }
.affiche .sub{ font-size:14px; color:var(--muted); margin-top:10px; max-width:640px; }
.ticket{
  flex-shrink:0; display:flex; background:#fff; border:3px double var(--rouge);
  font-family:'Playfair Display',serif; min-width:220px;
}
.ticket .l{ padding:10px 14px; border-right:2px dashed var(--line); text-align:center; }
.ticket .l .d{ font-size:44px; font-weight:900; color:var(--rouge); line-height:1; }
.ticket .l .m{ font-size:12px; letter-spacing:.2em; text-transform:uppercase; font-family:'Montserrat',sans-serif; font-weight:700; }
.ticket .r{ padding:10px 14px; display:flex; flex-direction:column; justify-content:center; }
.ticket .r .a{ font-size:20px; font-weight:700; color:var(--bleu); }
.ticket .r .b{ font-size:12px; font-family:'Montserrat',sans-serif; color:var(--muted); }

/* ── rozvržení: rejstřík + obsah ── */
.layout{ max-width:1220px; margin:0 auto; display:grid; grid-template-columns:230px 1fr; gap:30px; padding:0 26px; }
.layout > *{ min-width:0; }
.registre{ position:sticky; top:0; align-self:start; padding:22px 0; max-height:100vh; overflow-y:auto; }
.registre .cap{ font-size:11px; letter-spacing:.22em; text-transform:uppercase; color:var(--muted); font-weight:700; margin:0 0 8px 12px; }
.reg-btn{
  display:flex; gap:10px; align-items:baseline; width:100%; text-align:left;
  background:transparent; border:none; border-left:4px solid transparent;
  padding:10px 12px; min-height:46px; cursor:pointer; color:var(--ink); font-size:15px;
  transition:all .45s ease;
}
.reg-btn .rn{ font-family:'Playfair Display',serif; color:var(--rouge); font-weight:700; min-width:26px; font-size:14px; }
.reg-btn:hover{ background:#f3ede2; }
.reg-btn.on{ border-left-color:var(--rouge); background:#fff; color:var(--bleu); font-weight:700; box-shadow:inset 0 0 0 1px var(--line); }

main{ padding:26px 0 80px; }
.fade{ animation:fadeIn .45s ease; }
@keyframes fadeIn{ from{opacity:0; transform:translateY(8px);} to{opacity:1; transform:none;} }

/* ── nadpisy sekcí ── */
.sect-title{ display:flex; align-items:baseline; gap:12px; margin:0 0 6px; flex-wrap:wrap; }
.sect-title h2{ font-size:clamp(22px,3.4vw,30px); }
.sect-title .no{ font-family:'Playfair Display',serif; font-size:15px; color:var(--rouge); letter-spacing:.14em; text-transform:uppercase; }
.sect-lede{ color:var(--muted); margin:0 0 20px; border-bottom:1px solid var(--line); padding-bottom:14px; }
.sub-h{ font-size:21px; margin:28px 0 10px; color:var(--bleu); }

/* ── karty ── */
.card{ background:var(--paper); border:3px double var(--bleu); padding:20px 22px; margin-bottom:18px; }
.card.red{ border-color:var(--rouge); }
.card h3{ font-size:20px; margin:0 0 8px; }
.lede{ color:var(--muted); font-size:15px; margin:0 0 14px; }
.grid2{ display:grid; grid-template-columns:1fr 1fr; gap:18px; }
.grid2 > *{ min-width:0; }

/* ── plán testu ── */
.plan{ display:grid; grid-template-columns:1fr 1fr; gap:18px; }
.plan > *{ min-width:0; }
.plan .card{ margin:0; display:flex; flex-direction:column; }
.plan .num{ font-family:'Playfair Display',serif; font-size:42px; font-weight:900; color:var(--rouge); line-height:1; }
.plan .fr-q{ font-style:italic; color:var(--muted); font-size:14px; margin:6px 0 10px; }
.plan .go{ margin-top:auto; padding-top:10px; display:flex; gap:8px; flex-wrap:wrap; }

/* ── rozbalovací blok ── */
.acc{ border:1px solid var(--line); background:#fff; margin-bottom:12px; }
.acc-head{
  width:100%; display:flex; gap:12px; align-items:center; justify-content:space-between;
  background:#fff; border:none; padding:14px 16px; cursor:pointer; text-align:left;
  transition:background .45s ease; min-height:48px;
}
.acc-head:hover{ background:#faf7f1; }
.acc-head .t{ font-family:'Playfair Display',serif; font-weight:700; font-size:18px; }
.acc-head .badge{ font-size:11px; letter-spacing:.14em; text-transform:uppercase; color:var(--muted); white-space:nowrap; }
.acc-head .chev{ color:var(--rouge); font-size:15px; transition:transform .45s ease; }
.acc-head.open .chev{ transform:rotate(90deg); }
.acc-body{ padding:4px 16px 18px; border-top:1px solid var(--line); }

/* ── modrý box z učebnice ── */
.bluebox{ border:2px solid #3a8fc4; background:#fff; margin:14px 0; }
.bluebox .bh{ background:#3a8fc4; color:#fff; font-weight:700; text-align:center; padding:6px 10px; font-size:15px; }
.bluebox .bb{ padding:12px 14px; }
.bluebox .bb b{ color:#1f6f9f; }
.pour{ border:2px solid var(--rouge); background:#fff; margin:14px 0; }
.pour .ph{ display:flex; gap:8px; align-items:center; padding:6px 12px; border-bottom:1px solid var(--line); font-weight:700; }
.pour .ph span{ background:var(--rouge); color:#fff; padding:1px 8px; font-size:13px; }
.pour .pb{ padding:8px 14px 10px; }

/* ── slovíčka ── */
.vgrid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(270px,1fr)); gap:0 22px; }
.vrow{ display:flex; gap:10px; align-items:baseline; padding:7px 0; border-bottom:1px dotted var(--line); }
.vrow .fr{ font-weight:600; }
.vrow .cz{ color:var(--muted); margin-left:auto; text-align:right; font-size:14px; }
.g-m{ color:var(--bleu); }
.g-f{ color:var(--rouge); }
.g-p{ color:#1a1a1a; }
.cat{ font-size:12px; letter-spacing:.18em; text-transform:uppercase; color:var(--rouge); margin:18px 0 6px; font-weight:700; }
.note{ background:#fff6e0; border-left:4px solid var(--warn); padding:10px 14px; margin:12px 0; font-size:15px; }
.search{
  width:100%; padding:12px 14px; border:1px solid var(--bleu); background:#fff;
  font-size:16px; font-family:inherit; margin-bottom:16px; border-radius:0;
}
.search:focus{ outline:2px solid var(--rouge); outline-offset:-2px; }

/* ── gramatika ── */
.rule{ background:#f7f3ea; border-left:4px solid var(--rouge); padding:12px 16px; margin:12px 0; }
.rule b{ color:var(--bleu); }
.ex{ font-family:'Courier New',monospace; font-size:15px; background:#fff; border:1px solid var(--line); padding:10px 14px; margin:10px 0; }
.ex div{ padding:2px 0; }
.ex .cz{ color:var(--muted); font-family:'Montserrat',sans-serif; font-size:13px; }
.tbl{ width:100%; border-collapse:collapse; margin:12px 0; font-size:15px; }
.tbl th,.tbl td{ border:1px solid var(--line); padding:8px 10px; text-align:left; vertical-align:top; }
.tbl th{ background:#f2ece1; font-family:'Playfair Display',serif; font-size:14px; letter-spacing:.06em; }
.tbl tr:nth-child(even) td{ background:#fcfaf6; }
.tblwrap{ overflow-x:auto; }
.red-e{ color:var(--rouge); font-weight:700; }
.timeline{ display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin:12px 0; }
.timeline > div{ border:1px solid var(--line); background:#fff; padding:12px 14px; min-width:0; }
.timeline .h{ font-family:'Playfair Display',serif; font-weight:700; font-size:17px; margin-bottom:4px; }
.arrow{ height:10px; margin:6px 0 8px; position:relative; }
.arrow i{ position:absolute; top:3px; height:4px; background:var(--bleu); }
.arrow i::after{ content:""; position:absolute; right:-8px; top:-5px; border:7px solid transparent; border-left-color:var(--bleu); border-right:0; }

/* ── doplňovačky ── */
.gap{ border:1px solid var(--line); background:#fff; padding:14px 16px; margin-bottom:12px; }
.gap-head{ display:flex; gap:10px; align-items:center; flex-wrap:wrap; margin-bottom:6px; }
.gap .n{ font-family:'Playfair Display',serif; color:var(--rouge); font-weight:700; }
.gap .hint{ font-size:13px; color:var(--muted); }
.gap-line{ font-size:17px; line-height:2.3; }
.blank{
  display:inline-block; min-width:96px; width:auto; padding:4px 8px; margin:0 3px;
  border:none; border-bottom:2px solid var(--bleu); background:#f5f7fc;
  font-size:16px; font-family:inherit; border-radius:0;
}
.blank.wide{ display:block; width:100%; margin:6px 0; border:2px solid var(--bleu); padding:10px 12px; }
.blank:focus{ outline:2px solid var(--rouge); outline-offset:1px; }
.blank.ok{ border-color:var(--ok); background:#eef7f1; }
.blank.bad{ border-color:var(--bad); background:#fbeeee; }
.gap-actions{ display:flex; gap:8px; flex-wrap:wrap; margin-top:8px; }
.mini{
  background:#fff; border:1px solid var(--bleu); color:var(--bleu); padding:8px 14px;
  font-size:13px; font-weight:700; letter-spacing:.06em; text-transform:uppercase;
  cursor:pointer; transition:all .45s ease; min-height:44px;
}
.mini:hover{ background:var(--bleu); color:#fff; }
.mini.red{ border-color:var(--rouge); color:var(--rouge); }
.mini.red:hover{ background:var(--rouge); color:#fff; }
.verdict-line{ font-size:14px; margin-top:6px; font-weight:600; }
.diff{ font-size:11px; letter-spacing:.1em; text-transform:uppercase; padding:3px 9px; border:1px solid; font-weight:700; }
.diff.e{ color:var(--ok); border-color:var(--ok); }
.diff.m{ color:var(--warn); border-color:var(--warn); }
.diff.h{ color:var(--rouge); border-color:var(--rouge); }
.diff.b{ color:#1f6f9f; border-color:#1f6f9f; }
.sol{ margin-top:12px; border-top:1px solid var(--line); padding-top:10px; }
.sol .step{ margin:8px 0; }
.sol .lab{ font-size:11px; letter-spacing:.16em; text-transform:uppercase; color:var(--rouge); font-weight:700; }
.sol .res{ border:2px solid var(--rouge); padding:8px 12px; margin-top:10px; font-weight:700; }

/* ── tlačítka / módy ── */
.modes{ display:flex; flex-wrap:wrap; gap:8px; margin-bottom:18px; }
.mode{
  background:#fff; border:1px solid var(--line); padding:10px 16px; font-size:14px;
  cursor:pointer; transition:all .45s ease; min-height:44px; color:var(--ink);
}
.mode:hover{ border-color:var(--bleu); }
.mode.on{ background:var(--bleu); border-color:var(--bleu); color:#fff; font-weight:700; }
.btn{
  background:#fff; border:2px solid var(--bleu); color:var(--bleu); padding:10px 20px;
  font-size:15px; cursor:pointer; transition:all .45s ease; min-height:44px; font-weight:600;
}
.btn:hover:not(:disabled){ background:var(--bleu); color:#fff; }
.btn:disabled{ opacity:.35; cursor:default; }
.btn.red{ border-color:var(--rouge); color:var(--rouge); }
.btn.red:hover:not(:disabled){ background:var(--rouge); color:#fff; }
.scorebar{ display:flex; flex-wrap:wrap; gap:12px; align-items:center; margin-bottom:14px; font-size:14px; }
.scorebar .chip{ border:1px solid var(--line); padding:6px 12px; background:#fff; }
.scorebar .chip b{ color:var(--bleu); }
.prog{ height:8px; background:#eae3d6; margin:6px 0 14px; }
.prog i{ display:block; height:100%; background:var(--rouge); transition:width .8s ease; }

/* ── dril ── */
.drill{ text-align:center; padding:10px 0; }
.drill .prompt{ font-family:'Playfair Display',serif; font-size:clamp(22px,4vw,30px); margin:6px 0 4px; }
.drill .ctx{ font-size:14px; color:var(--muted); margin-bottom:12px; }
.drill input{ max-width:420px; width:100%; text-align:center; }
.drill .fbk{ min-height:28px; font-weight:600; margin-top:10px; }

/* ── kvíz ── */
.dotbar{ display:flex; gap:7px; justify-content:center; flex-wrap:wrap; margin-bottom:18px; }
.dot{ width:20px; height:20px; border:1px solid rgba(0,0,0,.25); cursor:pointer; transition:background .45s ease; }
.qnum{ font-size:11px; letter-spacing:.18em; text-transform:uppercase; color:var(--muted); }
.qtext{ font-size:19px; font-weight:600; margin:8px 0 18px; line-height:1.45; }
.opt{
  display:flex; gap:10px; align-items:center; padding:12px 15px; border:1px solid var(--line);
  background:#fff; margin-bottom:9px; cursor:pointer; transition:all .45s ease; min-height:44px;
}
.opt:hover{ border-color:var(--bleu); }
.fb{ margin-top:18px; border:2px solid; padding:14px 16px; }
.fb .h{ font-family:'Playfair Display',serif; font-weight:700; font-size:17px; margin-bottom:6px; }
.fb .corr{ color:var(--ok); font-size:14px; margin-bottom:6px; font-weight:600; }
.fb .exp{ font-size:15px; color:#33302b; }
.fb .tip{ margin-top:8px; font-size:14px; font-style:italic; color:var(--warn); }
.navrow{ display:flex; justify-content:space-between; gap:10px; margin-top:18px; }
.results{ text-align:center; padding:40px 20px; }
.results .score{ font-family:'Playfair Display',serif; font-size:56px; font-weight:700; color:var(--bleu); }
.results .pct{ font-size:22px; color:var(--rouge); margin-bottom:12px; }
.results .msg{ font-size:17px; max-width:420px; margin:0 auto 22px; }

/* ── psaní ── */
.textarea{
  width:100%; padding:13px 15px; border:2px solid var(--bleu); background:#fff;
  font-size:16px; font-family:inherit; margin:10px 0; line-height:1.6; border-radius:0;
}
.textarea:focus{ outline:2px solid var(--rouge); outline-offset:-2px; }
.checklist{ list-style:none !important; padding-left:0 !important; }
.checklist li{ padding:4px 0; display:flex; gap:10px; align-items:flex-start; }
.checklist label{ display:flex; gap:10px; align-items:flex-start; cursor:pointer; }
.checklist input{ width:20px; height:20px; margin-top:3px; accent-color:var(--bleu); flex-shrink:0; }
.model{ background:#f7f3ea; border-left:4px solid var(--bleu); padding:12px 16px; font-style:italic; }
.model div{ margin:3px 0; }
.postcard{
  background:#fffdf8; border:1px solid #c9bfae; box-shadow:0 6px 18px rgba(60,40,10,.08);
  display:grid; grid-template-columns:1fr 1fr; font-family:'Playfair Display',serif; font-style:italic; font-size:16px;
}
.postcard > div{ padding:16px 18px; min-width:0; }
.postcard > div:first-child{ border-right:1px solid #c9bfae; }
.postcard p{ margin:6px 0; }
.painting{ border-left:4px solid var(--bleu); padding:4px 0 4px 14px; margin:12px 0; }
.painting .who{ font-family:'Playfair Display',serif; font-weight:700; font-size:17px; }
.painting .reg{ font-size:12px; letter-spacing:.16em; text-transform:uppercase; color:var(--rouge); font-weight:700; }
.steps{ counter-reset:st; list-style:none !important; padding-left:0 !important; }
.steps li{ counter-increment:st; position:relative; padding:8px 0 8px 44px; border-bottom:1px dotted var(--line); }
.steps li::before{
  content:counter(st); position:absolute; left:0; top:8px; width:30px; height:30px; border:2px solid var(--rouge);
  color:var(--rouge); font-family:'Playfair Display',serif; font-weight:700; display:flex; align-items:center; justify-content:center;
}
.steps .fr{ font-family:'Courier New',monospace; font-size:15px; display:block; margin-top:2px; }

/* ── kartičky ── */
.fcwrap{ perspective:1400px; margin:0 auto 16px; max-width:540px; }
.fc{ position:relative; width:100%; height:230px; transform-style:preserve-3d; transition:transform .45s ease; cursor:pointer; }
.fc.flip{ transform:rotateY(180deg); }
.fc-face{
  position:absolute; inset:0; backface-visibility:hidden; -webkit-backface-visibility:hidden; background:#fff;
  border:3px double var(--bleu); display:flex; flex-direction:column;
  align-items:center; justify-content:center; padding:24px; text-align:center;
}
.fc-face.back{ transform:rotateY(180deg); border-color:var(--rouge); }
.fc-face .big{ font-family:'Playfair Display',serif; font-size:clamp(20px,4vw,30px); }
.fc-face .small{ font-size:12px; letter-spacing:.18em; text-transform:uppercase; color:var(--muted); margin-top:14px; }
.fcdots{ display:flex; gap:5px; justify-content:center; flex-wrap:wrap; margin:10px 0; }
.fcdots i{ width:9px; height:9px; background:#e2dacb; display:block; cursor:pointer; }
.fcdots i.on{ background:var(--rouge); }

/* ── tahák ── */
.cheat{ column-count:2; column-gap:22px; }
.cheat > div{ break-inside:avoid; margin-bottom:16px; border:1px solid var(--line); background:#fff; padding:12px 14px; }
.cheat h4{ font-size:17px; color:var(--bleu); margin-bottom:6px; }
.mono{ font-family:'Courier New',monospace; }

@media (max-width:860px){
  .layout{ grid-template-columns:1fr; gap:0; padding:0; }
  .registre{
    position:sticky; top:0; z-index:40; max-height:none; padding:0; overflow-x:auto; overflow-y:hidden;
    display:flex; background:var(--ivory); border-bottom:3px double var(--bleu);
  }
  .registre .cap{ display:none; }
  .reg-btn{ width:auto; white-space:nowrap; border-left:none; border-bottom:4px solid transparent; padding:12px 12px 9px; }
  .reg-btn.on{ border-bottom-color:var(--rouge); box-shadow:none; background:transparent; }
  main{ padding:18px 16px 60px; }
}
@media (max-width:640px){
  .affiche-in{ flex-direction:column; align-items:flex-start; gap:14px; padding:20px 16px 18px; }
  .ticket{ min-width:0; }
  .ticket .l .d{ font-size:32px; }
  .grid2, .plan, .timeline, .postcard{ grid-template-columns:1fr; }
  .postcard > div:first-child{ border-right:none; border-bottom:1px solid #c9bfae; }
  .vgrid{ grid-template-columns:1fr; }
  .cheat{ column-count:1; }
  .card{ padding:16px 14px; }
  .tbl{ font-size:14px; }
  .tbl th,.tbl td{ padding:6px 7px; }
  .blank{ min-width:80px; }
  .acc-head .badge{ white-space:normal; text-align:right; }
}
`;

/* ═══════════════════════════════════════════════════════════════════
   POMOCNÉ FUNKCE
   ═══════════════════════════════════════════════════════════════════ */

function shuffleArray(a){ const s=[...a]; for(let i=s.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [s[i],s[j]]=[s[j],s[i]]; } return s; }

function shuffleQuestions(qs){
  return qs.map(q=>{
    const sh=shuffleArray(q.options.map((_,i)=>i));
    return { ...q, options: sh.map(i=>q.options[i]), correct: q.correct.map(o=>sh.indexOf(o)) };
  });
}

function arrEqual(a,b){
  if(!a||!b) return false;
  const sa=[...a].sort((x,y)=>x-y), sb=[...b].sort((x,y)=>x-y);
  return sa.length===sb.length && sa.every((v,i)=>v===sb[i]);
}

/** Sjednotí apostrofy, mezery, velikost písmen a koncovou interpunkci. */
function clean(s){
  return (s||"").toLowerCase().replace(/[’‘`´]/g,"'").replace(/\s*'\s*/g,"'")
    .replace(/[.!?;:,«»"“”]+/g," ").replace(/\s+/g," ").trim();
}
function strip(s){ return clean(s).normalize("NFD").replace(/[̀-ͯ]/g,""); }

/** Kontrola jedné mezery: vrací "ok" | "accent" (správně, ale chybí diakritika) | "bad". */
function checkBlank(user, spec){
  if(!clean(user)) return "bad";
  if(spec.re) return spec.re.test(strip(user)) ? "ok" : "bad";
  const alts = spec.alts || spec;
  if(alts.some(a => clean(a) === clean(user))) return "ok";
  if(alts.some(a => strip(a) === strip(user))) return "accent";
  return "bad";
}
function shownAnswer(spec){ return spec.show || (spec.alts || spec).join(" / "); }

/** Normalizace pro hledání obratů v psaném textu. */
function normText(s){
  return " " + (s||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"")
    .replace(/[’'`]/g," ").replace(/[^a-z0-9\s-]/g," ").replace(/\s+/g," ") + " ";
}

/** Bez členu a závorek — pro velkorysé porovnání slovíček. */
function bare(s){
  return strip(s).replace(/\(.*?\)/g," ").replace(/^(les|le|la|un|une|des)\s+|^l'/,"").replace(/\s+/g," ").trim();
}

/** Obarví člen podle rodu (le/un = modrá, la/une = červená, les/des = černá). */
function Fr({ t, g }){
  const m = /^(les|des|le|la|l['’]|un|une)\s?/i.exec(t || "");
  if(!m) return <span className={g==="f"?"g-f":g==="m"?"g-m":""}>{t}</span>;
  const art = m[0], rest = (t||"").slice(art.length);
  const a = art.trim().toLowerCase();
  let cls = "g-p";
  if(a==="le"||a==="un") cls="g-m";
  else if(a==="la"||a==="une") cls="g-f";
  else if(a==="l'"||a==="l’") cls = g==="f" ? "g-f" : g==="m" ? "g-m" : "g-p";
  return <span><span className={cls} style={{fontWeight:700}}>{art}</span>{rest}</span>;
}

function loadLS(key, fallback){
  try { const v = window.localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch(e) { return fallback; }
}
function saveLS(key, val){
  try { window.localStorage.setItem(key, JSON.stringify(val)); } catch(e) { /* soukromé okno */ }
}

/* ═══════════════════════════════════════════════════════════════════
   DATA — 1) ZEMĚ A NÁRODNOSTI (banque, semaine 23 + str. 132)
   ═══════════════════════════════════════════════════════════════════ */

// g: f / m / p (pl.) · v: začíná samohláskou
const PAYS = [
  { pays:"l'Espagne", g:"f", v:1, cz:"Španělsko", en:"en Espagne", de:"d'Espagne", m:"espagnol", f:"espagnole" },
  { pays:"la France", g:"f", cz:"Francie", en:"en France", de:"de France", m:"français", f:"française" },
  { pays:"la Pologne", g:"f", cz:"Polsko", en:"en Pologne", de:"de Pologne", m:"polonais", f:"polonaise" },
  { pays:"la Russie", g:"f", cz:"Rusko", en:"en Russie", de:"de Russie", m:"russe", f:"russe" },
  { pays:"l'Italie", g:"f", v:1, cz:"Itálie", en:"en Italie", de:"d'Italie", m:"italien", f:"italienne" },
  { pays:"la Suisse", g:"f", cz:"Švýcarsko", en:"en Suisse", de:"de Suisse", m:"suisse", f:"suisse" },
  { pays:"la République tchèque", g:"f", cz:"Česko (Česká republika)", en:"en République tchèque", de:"de République tchèque", m:"tchèque", f:"tchèque", alt:"la Tchéquie → en Tchéquie" },
  { pays:"les États-Unis", g:"p", v:1, cz:"Spojené státy (USA)", en:"aux États-Unis", de:"des États-Unis", m:"américain", f:"américaine" },
  { pays:"la Côte d'Ivoire", g:"f", cz:"Pobřeží slonoviny", en:"en Côte d'Ivoire", de:"de Côte d'Ivoire", m:"ivoirien", f:"ivoirienne" },
  { pays:"l'Allemagne", g:"f", v:1, cz:"Německo", en:"en Allemagne", de:"d'Allemagne", m:"allemand", f:"allemande" },
  { pays:"le Liechtenstein", g:"m", cz:"Lichtenštejnsko", en:"au Liechtenstein", de:"du Liechtenstein", m:"liechtensteinois", f:"liechtensteinoise", pron:"[liʃtɛnʃtajn] – [liʃtɛnʃtajnwa]" },
  { pays:"la Chine", g:"f", cz:"Čína", en:"en Chine", de:"de Chine", m:"chinois", f:"chinoise" },
  { pays:"le Maroc", g:"m", cz:"Maroko", en:"au Maroc", de:"du Maroc", m:"marocain", f:"marocaine" },
  { pays:"l'Égypte", g:"f", v:1, cz:"Egypt", en:"en Égypte", de:"d'Égypte", m:"égyptien", f:"égyptienne" },
  { pays:"la Belgique", g:"f", cz:"Belgie", en:"en Belgique", de:"de Belgique", m:"belge", f:"belge" },
  { pays:"l'Angleterre", g:"f", v:1, cz:"Anglie", en:"en Angleterre", de:"d'Angleterre", m:"anglais", f:"anglaise" },
  { pays:"le Royaume-Uni", g:"m", cz:"Spojené království", en:"au Royaume-Uni", de:"du Royaume-Uni", m:"anglais / écossais / irlandais", f:"anglaise / écossaise / irlandaise", natAlts:{ m:["anglais","ecossais","irlandais","britannique"], f:["anglaise","ecossaise","irlandaise","britannique"] } },
  { pays:"les Pays-Bas", g:"p", cz:"Nizozemsko", en:"aux Pays-Bas", de:"des Pays-Bas", m:"néerlandais", f:"néerlandaise" },
  { pays:"le Japon", g:"m", cz:"Japonsko", en:"au Japon", de:"du Japon", m:"japonais", f:"japonaise" },
  { pays:"la Corée", g:"f", cz:"Korea", en:"en Corée", de:"de Corée", m:"coréen", f:"coréenne" },
  { pays:"l'Algérie", g:"f", v:1, cz:"Alžírsko", en:"en Algérie", de:"d'Algérie", m:"algérien", f:"algérienne" },
];

/* ═══════════════════════════════════════════════════════════════════
   DATA — 2) SLOVÍČKA str. 133, 139, 147 (Édito A1)
   ═══════════════════════════════════════════════════════════════════ */

const VOCAB = [
  { page:"133", title:"Les vacances", sub:"Unité 9 · str. 133", groups:[
    { cat:"Les lieux, les destinations", items:[
      { fr:"la campagne", cz:"venkov" },
      { fr:"l'île", g:"f", cz:"ostrov" },
      { fr:"la mer", cz:"moře" },
      { fr:"la montagne", cz:"hory, hora" },
      { fr:"le village", cz:"vesnice" },
    ]},
    { cat:"L'hébergement (ubytování)", items:[
      { fr:"le camping", cz:"kemp" },
      { fr:"la chambre d'hôtes", cz:"penzion (pokoj u lidí doma)" },
      { fr:"l'échange d'appartements / de maisons", g:"m", cz:"výměna bytů / domů", ans:["l'échange d'appartements","l'échange de maisons","l'échange"] },
      { fr:"la ferme", cz:"farma, statek" },
      { fr:"l'hôtel", g:"m", cz:"hotel" },
      { fr:"la location", cz:"pronájem (bytu, chaty)" },
      { fr:"la tente", cz:"stan" },
    ]},
    { cat:"La réservation", items:[
      { fr:"l'arrivée", g:"f", cz:"příjezd" },
      { fr:"le départ", cz:"odjezd" },
      { fr:"la chambre simple / double / familiale", cz:"jednolůžkový / dvoulůžkový / rodinný pokoj", ans:["la chambre double","la chambre simple","la chambre familiale"] },
      { fr:"le lit simple / double", cz:"jednolůžko / dvojlůžko (manželská postel)", ans:["le lit double","le lit simple"] },
      { fr:"le lit bébé", cz:"dětská postýlka" },
      { fr:"le parking", cz:"parkoviště" },
      { fr:"le petit déjeuner compris", cz:"snídaně v ceně" },
      { fr:"les animaux acceptés", cz:"zvířata povolena" },
      { fr:"réserver une chambre", cz:"zarezervovat pokoj" },
    ]},
    { cat:"Les moyens de transport", items:[
      { fr:"l'avion", g:"m", cz:"letadlo (→ à l'aéroport = na letišti)" },
      { fr:"le van", cz:"dodávka, obytná dodávka" },
      { fr:"la voiture", cz:"auto" },
    ]},
    { cat:"Les activités", items:[
      { fr:"se baigner", cz:"koupat se" },
      { fr:"bronzer", cz:"opalovat se" },
      { fr:"faire de la randonnée", cz:"chodit na túry" },
      { fr:"faire du surf", cz:"surfovat" },
      { fr:"goûter la cuisine locale", cz:"ochutnat místní kuchyni" },
      { fr:"prendre des photos", cz:"fotit" },
      { fr:"visiter un musée / un village (traditionnel)", cz:"navštívit muzeum / (tradiční) vesnici", ans:["visiter un musée","visiter un village"] },
    ]},
  ]},
  { page:"139", title:"La nature", sub:"Unité 9 · str. 139", groups:[
    { cat:"Les lieux", items:[
      { fr:"le champ", cz:"pole" },
      { fr:"le chemin", cz:"cesta, pěšina" },
      { fr:"la forêt", cz:"les" },
      { fr:"le lac", cz:"jezero" },
      { fr:"la plage", cz:"pláž" },
      { fr:"la rivière", cz:"řeka" },
    ]},
    { cat:"La flore", items:[
      { fr:"l'arbre", g:"m", cz:"strom" },
      { fr:"la fleur", cz:"květina" },
      { fr:"l'herbe", g:"f", cz:"tráva" },
      { fr:"la plante", cz:"rostlina" },
    ]},
    { cat:"Les animaux", items:[
      { fr:"le canard", cz:"kachna" },
      { fr:"le chat", cz:"kočka" },
      { fr:"le cheval", cz:"kůň (pl. les chevaux)" },
      { fr:"le chien", cz:"pes" },
      { fr:"le lapin", cz:"králík" },
      { fr:"l'oiseau", g:"m", cz:"pták (pl. les oiseaux)" },
      { fr:"le poisson", cz:"ryba" },
      { fr:"la poule", cz:"slepice" },
      { fr:"la vache", cz:"kráva" },
    ]},
    { cat:"Les activités", items:[
      { fr:"faire du bateau", cz:"jezdit na lodi" },
      { fr:"faire de la plongée", cz:"potápět se" },
      { fr:"pique-niquer", cz:"dělat piknik" },
    ]},
  ]},
  { page:"147", title:"L'université, les études", sub:"Unité 10 · str. 147", groups:[
    { cat:"Le campus", items:[
      { fr:"l'amphithéâtre, l'amphi", g:"m", cz:"posluchárna", ans:["l'amphithéâtre","l'amphi"] },
      { fr:"la bibliothèque", cz:"knihovna" },
      { fr:"le logement étudiant", cz:"studentské bydlení, kolej" },
      { fr:"le restaurant universitaire, le resto U", cz:"menza", ans:["le restaurant universitaire","le resto U"] },
      { fr:"la salle de cours", cz:"učebna" },
      { fr:"le secrétariat", cz:"studijní oddělení, sekretariát" },
      { fr:"l'université", g:"f", cz:"univerzita" },
    ]},
    { cat:"Les études et les personnes", items:[
      { fr:"le cours", cz:"hodina, přednáška, kurz" },
      { fr:"le diplôme", cz:"diplom (titul)" },
      { fr:"la licence", cz:"bakalářský titul (3 roky)" },
      { fr:"le master", cz:"magisterský titul (+2 roky)" },
      { fr:"le doctorat", cz:"doktorát" },
      { fr:"l'enseignant(e)", g:"m", cz:"vyučující", ans:["l'enseignant","l'enseignante"] },
      { fr:"le/la professeur(e)", cz:"profesor(ka), učitel(ka)", ans:["le professeur","la professeure","le prof","la prof"] },
      { fr:"les études", cz:"studium" },
      { fr:"l'étudiant(e)", g:"m", cz:"student(ka)", ans:["l'étudiant","l'étudiante"] },
      { fr:"étudier", cz:"studovat" },
      { fr:"faire des études", cz:"studovat (vysokou školu)" },
      { fr:"faire un stage", cz:"dělat stáž, praxi" },
      { fr:"s'inscrire", cz:"zapsat se, přihlásit se" },
      { fr:"la formation", cz:"vzdělání, příprava, kurz" },
      { fr:"la note", cz:"známka" },
    ]},
    { cat:"Les disciplines (obory)", items:[
      { fr:"le commerce", cz:"obchod" },
      { fr:"le droit", cz:"právo" },
      { fr:"l'économie", g:"f", cz:"ekonomie" },
      { fr:"l'informatique", g:"f", cz:"informatika" },
      { fr:"les langues", cz:"jazyky" },
      { fr:"les lettres", cz:"humanitní obory, literatura" },
      { fr:"les mathématiques", cz:"matematika" },
      { fr:"les sciences", cz:"přírodní vědy" },
    ]},
  ]},
];

const ALL_WORDS = VOCAB.flatMap(p => p.groups.flatMap(g => g.items.map(it => ({ ...it, page:p.page, cat:g.cat }))));

/* ═══════════════════════════════════════════════════════════════════
   DATA — 3) DOPLŇOVAČKY
   task: "___" = mezera · blanks: [[alternativy]] nebo {re, show}
   diff: e / m / h, nebo b = cvičení přímo z učebnice
   ═══════════════════════════════════════════════════════════════════ */

const PREP_GAPS = [
  { diff:"e", task:"Je vais ___ Japon cet été.", blanks:[["au"]], hint:"le Japon", rule:"KAM / KDE: au + mužský rod země.", why:"le Japon je mužského rodu → à + le = au." },
  { diff:"e", task:"Elle habite ___ Espagne.", blanks:[["en"]], hint:"l'Espagne", rule:"KAM / KDE: en + ženský rod nebo samohláska.", why:"l'Espagne (f.) → en Espagne." },
  { diff:"e", task:"Nous partons ___ États-Unis.", blanks:[["aux"]], hint:"množné číslo", rule:"KAM / KDE: aux + země v množném čísle.", why:"les États-Unis → à + les = aux." },
  { diff:"e", task:"Il travaille ___ Paris.", blanks:[["à"]], hint:"město", rule:"KAM / KDE: à + město (bez členu).", why:"Paris je město → à Paris." },
  { diff:"m", task:"Marco vient ___ Italie.", blanks:[["d'"]], hint:"venir de…", rule:"ODKUD: de / d' + ženský rod, d' před samohláskou.", why:"l'Italie začíná samohláskou → d'Italie." },
  { diff:"m", task:"Yuki revient ___ Japon.", blanks:[["du"]], hint:"revenir de…", rule:"ODKUD: du + mužský rod (de + le = du).", why:"le Japon → du Japon." },
  { diff:"m", task:"Ils arrivent ___ Pays-Bas.", blanks:[["des"]], hint:"arriver de…", rule:"ODKUD: des + množné číslo (de + les = des).", why:"les Pays-Bas → des Pays-Bas." },
  { diff:"m", task:"Je reviens ___ Belgique.", blanks:[["de"]], hint:"la Belgique", rule:"ODKUD: de + ženský rod (bez členu!).", why:"la Belgique → de Belgique (ne „de la Belgique“)." },
  { diff:"m", task:"Saïd vit ___ Maroc, mais il vient ___ Algérie.", blanks:[["au"],["d'"]], hint:"le Maroc · l'Algérie", rule:"KDE: au + m. · ODKUD: d' + samohláska.", why:"le Maroc → au Maroc; l'Algérie → d'Algérie." },
  { diff:"h", task:"Elle arrive ___ Amsterdam et après, elle va ___ Copenhague.", blanks:[["d'"],["à"]], hint:"dvě města", rule:"Města: ODKUD de / d', KAM à.", why:"Amsterdam začíná samohláskou → d'Amsterdam; kam → à Copenhague." },
  { diff:"h", task:"Il vient ___ Irak.", blanks:[["d'"]], hint:"l'Irak je mužský rod", rule:"Remarque str. 132: de / du → d' před a, e, i, o, u.", why:"l'Irak je m., ale začíná samohláskou → d'Irak (ne „du Irak“)." },
  { diff:"h", task:"Mon voisin habite ___ Liechtenstein, il est ___ .", blanks:[["au"],["liechtensteinois"]], hint:"le Liechtenstein", rule:"au + m. · národnost: -ois / -oise.", why:"le Liechtenstein → au Liechtenstein; il est liechtensteinois [liʃtɛnʃtajnwa]." },
  { diff:"b", task:"(3a) Chen vient ___ Chine.", blanks:[["de"]], hint:"učebnice str. 132, cv. 3", rule:"ODKUD + ženský rod → de.", why:"la Chine → de Chine." },
  { diff:"b", task:"(3b) Julia et Martin arrivent ___ Berlin.", blanks:[["de"]], hint:"učebnice str. 132, cv. 3", rule:"ODKUD + město → de.", why:"Berlin je město → de Berlin." },
  { diff:"b", task:"(3c) Saïda et Franck reviennent ___ Maroc.", blanks:[["du"]], hint:"učebnice str. 132, cv. 3", rule:"ODKUD + mužský rod → du.", why:"le Maroc → du Maroc." },
  { diff:"b", task:"(3d) Michel vient ___ Pays-Bas.", blanks:[["des"]], hint:"učebnice str. 132, cv. 3", rule:"ODKUD + množné číslo → des.", why:"les Pays-Bas → des Pays-Bas." },
];

const GRAM = [
  {
    id:"pc", page:"137", title:"Le passé composé avec être", short:"Passé composé s être",
    gaps:[
      { diff:"b", task:"(3a) Il ___ (rentrer) de vacances hier.", blanks:[["est rentré"]], hint:"učebnice str. 137, cv. 3", rule:"rentrer → être + rentré.", why:"il = mužský rod, jednotné číslo → bez koncovky: il est rentré." },
      { diff:"b", task:"(3b) Elles ___ (partir) où cet été ?", blanks:[["sont parties"]], hint:"učebnice str. 137, cv. 3", rule:"Shoda s podmětem: elles → -es.", why:"elles = ženský rod, množné číslo → parti + es = sont parties." },
      { diff:"b", task:"(3c) Ma sœur ___ (arriver) à la plage.", blanks:[["est arrivée"]], hint:"učebnice str. 137, cv. 3", rule:"Shoda: ma sœur (f.) → -e.", why:"est arrivé + e = est arrivée." },
      { diff:"b", task:"(3d) L'année dernière, nous ___ (aller) à Nice.", blanks:[["sommes allés","sommes allées","sommes allé(e)s"]], hint:"učebnice str. 137, cv. 3", rule:"nous → -s (případně -es pro samé ženy).", why:"nous sommes allés (smíšená skupina / muži) nebo allées (jen ženy)." },
      { diff:"e", task:"Hier, Marie ___ (partir) en Martinique.", blanks:[["est partie"]], hint:"Marie = ona", rule:"partir → parti, s être.", why:"Marie je žena → parti + e." },
      { diff:"e", task:"Mes parents ___ (rentrer) dimanche.", blanks:[["sont rentrés"]], hint:"ils", rule:"ils → sont + -s.", why:"mes parents = ils → sont rentrés." },
      { diff:"m", task:"Léa, tu ___ (aller) où cet été ?", blanks:[["es allée"]], hint:"tu = Léa", rule:"tu es + participe, shoda s tím, kdo je „tu“.", why:"Léa je dívka → allé + e = es allée." },
      { diff:"m", task:"Claude Monet ___ (naître) en 1840 et il ___ (mourir) à Giverny.", blanks:[["est né"],["est mort"]], hint:"nepravidelná příčestí", rule:"naître → né · mourir → mort (obě s être).", why:"Monet = on → est né, est mort (bez koncovky)." },
      { diff:"m", task:"Les filles ___ (venir) avec nous.", blanks:[["sont venues"]], hint:"venir → venu", rule:"venir → venu, s être; elles → -es.", why:"les filles = elles → venu + es." },
      { diff:"h", task:"Nous ___ (visiter) le musée et nous ___ (monter) à la tour.", blanks:[["avons visité"],["sommes montés","sommes montées"]], hint:"jedno s avoir, jedno s être!", rule:"visiter = avoir (bez shody) · monter = être (se shodou).", why:"avons visité · sommes montés (monter je pohybové sloveso)." },
      { diff:"h", task:"Elle ___ (tomber) dans la rivière, mais elle ___ (rester) calme !", blanks:[["est tombée"],["est restée"]], hint:"dvě slovesa s être", rule:"tomber, rester → être + shoda.", why:"elle → tombé + e, resté + e." },
    ],
  },
  {
    id:"imp", page:"138", title:"Les verbes impersonnels à l'imparfait", short:"Il faisait, c'était, il y avait",
    gaps:[
      { diff:"b", task:"(4a) Aujourd'hui, il fait beau. → Hier, ___ mauvais.", blanks:[["il faisait"]], hint:"učebnice str. 138, cv. 4", rule:"il fait → il faisait.", why:"Popis počasí v minulosti = imparfait slovesa faire." },
      { diff:"b", task:"(4b) Aujourd'hui, il y a du soleil. → Hier, ___ des nuages.", blanks:[["il y avait"]], hint:"učebnice str. 138, cv. 4", rule:"il y a → il y avait.", why:"avoir v imparfait: il avait → il y avait." },
      { diff:"b", task:"(4c) Aujourd'hui, il fait chaud. → Hier, ___ froid.", blanks:[["il faisait"]], hint:"učebnice str. 138, cv. 4", rule:"il fait → il faisait.", why:"Počasí: il faisait froid." },
      { diff:"b", task:"(4d) Aujourd'hui, c'est animé. → Hier, ___ calme.", blanks:[["c'était"]], hint:"učebnice str. 138, cv. 4", rule:"c'est → c'était.", why:"être v imparfait: il était → c'était." },
      { diff:"e", task:"C'est très intéressant ! (včera) → ___ très intéressant !", blanks:[["c'était"]], hint:"být", rule:"c'est → c'était.", why:"Hodnocení zážitku v minulosti: C'était super / génial / intéressant." },
      { diff:"m", task:"Hier, il ne ___ pas beau.", blanks:[["faisait"]], hint:"zápor", rule:"ne + sloveso + pas.", why:"il ne faisait pas beau (věta z pohlednice Carole)." },
      { diff:"m", task:"Il y a beaucoup de touristes. (minulý rok) → L'année dernière, ___ beaucoup de touristes.", blanks:[["il y avait"]], hint:"je tam / byl tam", rule:"il y a → il y avait.", why:"Popis situace v minulosti." },
      { diff:"h", task:"Hier, ___ du soleil, alors ___ (aller) à la plage. ___ génial !", blanks:[["il y avait"],["je suis allé","je suis allée"],["c'était"]], hint:"popis + děj + hodnocení", rule:"Popis/počasí = imparfait · jednorázová akce = passé composé.", why:"il y avait du soleil (kulisa), je suis allé(e) (akce), c'était génial (hodnocení)." },
    ],
  },
  {
    id:"cod", page:"145", title:"Les pronoms COD (2) — me, te, nous, vous", short:"COD me / te / nous / vous",
    gaps:[
      { diff:"b", task:"(2a) Quand nous faisons des erreurs, le professeur ___ corrige.", blanks:[["nous"]], hint:"učebnice str. 145, cv. 2", rule:"nous → nous (před slovesem).", why:"Profesor opravuje NÁS → nous corrige." },
      { diff:"b", task:"(2b) Je parle et tu ___ écoutes.", blanks:[["m'"]], hint:"učebnice str. 145, cv. 2", rule:"me → m' před samohláskou.", why:"Posloucháš MĚ; écoutes začíná samohláskou → m'écoutes." },
      { diff:"b", task:"(2c) C'est à toi ! Le professeur ___ regarde.", blanks:[["te"]], hint:"učebnice str. 145, cv. 2", rule:"te (tebe).", why:"Profesor se dívá na TEBE → te regarde." },
      { diff:"b", task:"(2d) Qu'est-ce que vous dites ? Je ne ___ comprends pas.", blanks:[["vous"]], hint:"učebnice str. 145, cv. 2", rule:"V záporu: ne + COD + sloveso + pas.", why:"Nerozumím VÁM → je ne vous comprends pas." },
      { diff:"e", task:"Tu ___ aides à faire cet exercice ? (moi)", blanks:[["m'"]], hint:"aider → samohláska", rule:"me → m'.", why:"Příklad z modrého boxu: Tu m'aides à faire cet exercice ?" },
      { diff:"e", task:"Le droit ___ intéresse. (moi)", blanks:[["m'"]], hint:"intéresser", rule:"me → m' před samohláskou.", why:"Le droit m'intéresse = Právo MĚ zajímá." },
      { diff:"m", task:"Je ne ___ entends pas, Paul ! (toi)", blanks:[["t'"]], hint:"zápor + samohláska", rule:"te → t' · zápor obklopuje COD + sloveso.", why:"je ne t'entends pas." },
      { diff:"m", task:"Les étudiants ___ invitent au resto U. (nous)", blanks:[["nous"]], hint:"nás", rule:"nous se nemění.", why:"Ils nous invitent." },
      { diff:"h", task:"Ta sœur ? Je ___ trouve sympa. Et tes parents ? Je ___ aime bien.", blanks:[["la"],["les"]], hint:"opakování COD (1): le / la / l' / les", rule:"3. osoba: le (m.), la (f.), l' (samohláska), les (pl.).", why:"ta sœur → la · tes parents → les." },
      { diff:"h", task:"Cet amphi ? Je ___ connais bien. Le professeur ? Il ___ écoute toujours, nous.", blanks:[["le"],["nous"]], hint:"3. osoba vs. 1. osoba", rule:"le = ho/to · nous = nás.", why:"cet amphi (m.) → le connais; il NÁS poslouchá → nous écoute." },
    ],
  },
  {
    id:"duree", page:"146", title:"La durée, la continuation", short:"pendant, longtemps, toujours",
    gaps:[
      { diff:"b", task:"(2a) J'arrive ! Je suis ___ au restaurant universitaire mais je pars !", blanks:[["toujours"]], hint:"učebnice str. 146, cv. 2", rule:"přítomný čas + toujours = pořád ještě.", why:"Jsem POŘÁD v menze (děj trvá) → toujours." },
      { diff:"b", task:"(2b) Pierre a étudié le droit ___ deux ans, mais maintenant il étudie le commerce.", blanks:[["pendant"]], hint:"učebnice str. 146, cv. 2", rule:"pendant + podstatné jméno = po dobu (omezená doba).", why:"pendant deux ans = po dva roky (skončilo)." },
      { diff:"b", task:"(2c) Nous sommes restés en Angleterre ___ cinq ans. Nous y avons habité ___ .", blanks:[["pendant"],["longtemps"]], hint:"učebnice str. 146, cv. 2", rule:"pendant + nom · sloveso + longtemps.", why:"pendant cinq ans (je tam číslo) · longtemps stojí za slovesem, bez podstatného jména." },
      { diff:"e", task:"J'ai habité en Italie ___ trois ans.", blanks:[["pendant"]], hint:"+ podstatné jméno", rule:"pendant + nom.", why:"Za mezerou je „trois ans“ → pendant." },
      { diff:"e", task:"Les études de droit durent ___ .", blanks:[["longtemps"]], hint:"bez podstatného jména", rule:"verbe + longtemps (dlouho).", why:"Příklad z modrého boxu: Les études de droit durent longtemps." },
      { diff:"m", task:"Il est 22 heures et Paul est ___ à la bibliothèque !", blanks:[["toujours"]], hint:"pořád ještě", rule:"présent + toujours.", why:"Děj začal dřív a ještě trvá." },
      { diff:"m", task:"Tu es ___ étudiant ? — Oui, je n'ai pas fini mon master.", blanks:[["toujours"]], hint:"pořád ještě", rule:"présent + toujours.", why:"Jako v boxu: je suis toujours à l'université." },
      { diff:"h", task:"___ les vacances, j'ai fait un stage. Le stage n'a pas duré ___ : deux semaines.", blanks:[["pendant"],["longtemps"]], hint:"dvě různá slova", rule:"pendant + nom · ne… pas + longtemps.", why:"pendant les vacances (podst. jméno) · ça n'a pas duré longtemps." },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════════
   DATA — 4) LIST OD PROFESORA (3ABC_R7A – Révision.docx)
   ═══════════════════════════════════════════════════════════════════ */

const INTERDIT = ["Interdiction de","Il est interdit de","Défense de","Ne pas"];
const DEMANDE = ["Merci de","Prière de","Il faut"];

const FICHE = [
  { id:"r1", title:"Exercice 1 — Překlad základních slovíček", note:"Se členem (určitým nebo neurčitým).", items:[
    { task:"ryba → ___", blanks:[["le poisson","un poisson"]], rule:"le poisson (m.)", why:"Pozor: le poisson [pwasɔ̃] = ryba × le poison [pwazɔ̃] = jed." },
    { task:"auto / vozidlo → ___", blanks:[["la voiture","une voiture"]], rule:"la voiture (f.)", why:"" },
    { task:"úkol / povinnost → ___", blanks:[["le devoir","un devoir","les devoirs"]], rule:"le devoir (m.)", why:"faire ses devoirs = dělat úkoly." },
    { task:"les → ___", blanks:[["la forêt","une forêt"]], rule:"la forêt (f.)", why:"ê se čte jako è." },
    { task:"peníze → ___", blanks:[["l'argent"]], rule:"l'argent (m.)", why:"Je n'ai pas d'argent." },
    { task:"šití / krejčovství → ___", blanks:[["la couture"]], rule:"la couture (f.)", why:"la haute couture = luxusní móda." },
    { task:"boty / obuv → ___", blanks:[["les chaussures","des chaussures"]], rule:"les chaussures (f. pl.)", why:"" },
    { task:"počasí → ___", blanks:[["la météo","le temps"]], rule:"la météo / le temps", why:"Quel temps fait-il ? = Jaké je počasí?" },
  ]},
  { id:"r2", title:"Exercice 2 — Členy dělivé a výrazy množství", items:[
    { task:"Au petit-déjeuner, je bois ___ café et je mange ___ pain.", blanks:[["du"],["du"]], rule:"du + m. / de la + f. / de l' + samohláska = nějaké, trochu.", why:"Neurčité množství → du café, du pain. („un café“ = jeden šálek, v cvičení se čeká du.)" },
    { task:"Dans cette recette, il faut ajouter un peu ___ sucre.", blanks:[["de"]], rule:"Po výrazech množství jen de / d'.", why:"un peu de sucre." },
    { task:"Je n'ai pas ___ argent sur moi aujourd'hui.", blanks:[["d'"]], rule:"Zápor → de / d'.", why:"argent začíná samohláskou → pas d'argent." },
    { task:"Elle achète beaucoup ___ fruits au marché.", blanks:[["de"]], rule:"beaucoup de + i množné číslo.", why:"beaucoup de fruits (ne „des“)." },
  ]},
  { id:"r3", title:"Exercice 3 — Město, místa a doprava", items:[
    { task:"Pour passer de l'autre côté de la rivière, la voiture traverse le ___ .", blanks:[["pont"]], rule:"le pont = most.", why:"Traversez le Pont Neuf…" },
    { task:"Je vais au collège tous les matins ___ bus ou ___ pied.", blanks:[["en"],["à"]], rule:"en + uvnitř dopravního prostředku · à + pied / vélo / trottinette.", why:"en bus, en métro, en voiture · à pied, à vélo." },
    { task:"Pour acheter des médicaments, on va ___ .", blanks:[["à la pharmacie"]], rule:"à la + f.", why:"la pharmacie → à la pharmacie." },
    { task:"« Kde je autobusová zastávka? » → Où est ___ , s'il vous plaît ?", blanks:[["l'arrêt de bus","l'arrêt du bus","l'arrêt d'autobus"]], rule:"l'arrêt (m.) = zastávka.", why:"Où est l'arrêt de bus, s'il vous plaît ?" },
  ]},
  { id:"r4", title:"Exercice 4 — Oblečení, počasí a nákupy", items:[
    { task:"En hiver, quand il neige et qu'il fait très froid, je mets ___ .", wide:true, blanks:[{ re:/(manteau|bonnet|echarpe|gants|bottes|pull|anorak|doudoune|blouson)/, show:"un manteau / un bonnet / une écharpe / des gants / des bottes" }], rule:"Zimní oblečení.", why:"Pozor: un imperméable = pláštěnka do DEŠTĚ, na sníh se hodí spíš manteau, bonnet, écharpe, gants, bottes." },
    { task:"Aujourd'hui, il y a ___ , le ___ est magnifique.", blanks:[{ re:/^(du )?soleil$|ciel bleu/, show:"du soleil" },["temps"]], rule:"il y a du soleil · le temps = počasí.", why:"Il y a du soleil, le temps est magnifique." },
    { task:"Cette robe est ___ , elle va très bien avec mon pantalon gris.", blanks:[{ re:/(elegante|blanche|bleue|noire|rouge|jolie|belle|verte|rose|longue|courte|grise|jaune)/, show:"élégante / blanche / bleue / noire…" }], rule:"Přídavné jméno v ženském rodě (la robe).", why:"bleu → bleue, blanc → blanche, élégant → élégante." },
    { task:"Pour payer mes achats au magasin, je paye par ___ ou en espèces.", blanks:[["carte"]], rule:"par carte × en espèces.", why:"Vous payez comment ? — Par carte / En espèces." },
    { task:"A : « Combien ___ ? » — B : « Ça fait 15 euros. »", blanks:[["ça coûte","ça fait","coûte-t-elle","ça coute"]], rule:"Combien ça coûte ? = Ça coûte combien ?", why:"" },
  ]},
  { id:"r5", title:"Exercice 5 — Ukazovací přídavná jména", items:[
    { task:"___ robe bleue est très élégante.", blanks:[["Cette"]], rule:"cette + f.", why:"la robe → cette robe." },
    { task:"___ pantalon noir est trop grand.", blanks:[["Ce"]], rule:"ce + m. (souhláska).", why:"le pantalon → ce pantalon." },
    { task:"___ homme habite dans mon quartier.", blanks:[["Cet"]], rule:"cet + m. před samohláskou / němým h.", why:"homme začíná němým h → cet homme." },
    { task:"___ chaussures neuves sont confortables.", blanks:[["Ces"]], rule:"ces + množné číslo.", why:"" },
  ]},
  { id:"r6", title:"Exercice 6 — Zvratná slovesa (denní režim)", items:[
    { task:"Tous les matins, je me ___ (lever) à 6 heures et demie.", blanks:[["lève"]], rule:"lever: je lève (è v tvarech je/tu/il/ils).", why:"je me lève." },
    { task:"Mon père se ___ (raser) dans la salle de bains.", blanks:[["rase"]], rule:"il se rase.", why:"" },
    { task:"Ma sœur se ___ (coiffer) devant le miroir.", blanks:[["coiffe"]], rule:"elle se coiffe.", why:"" },
    { task:"Après le sport, nous nous ___ (laver) rapidement.", blanks:[["lavons"]], rule:"nous nous lavons.", why:"" },
    { task:"Le soir, les enfants s'___ (endormir) vers 21h.", blanks:[["endorment"]], rule:"s'endormir jako dormir: ils dorment → ils s'endorment.", why:"" },
  ]},
  { id:"r7", title:"Exercice 7 — Pozvání: přijmout / odmítnout", items:[
    { task:"— Tu veux venir au cinéma avec moi ce soir ? — (Accepter) :", wide:true, blanks:[{ re:/(oui|d'accord|avec plaisir|volontiers|je veux bien|bonne idee|super)/, show:"Oui, je veux bien ! / Avec plaisir ! / D'accord, j'adore le cinéma !" }], rule:"Přijmout: Oui, je veux bien · Avec plaisir · D'accord · Bonne idée !", why:"Pozor: „Oui, je veux“ zní česky-francouzsky; správně „Oui, je veux bien !“." },
    { task:"— On va prendre un café samedi après-midi ? — (Refuser) :", wide:true, blanks:[{ re:/(non|desole|je ne peux pas|impossible|pas possible)/, show:"Non, désolé(e), je ne peux pas, je dois travailler." }], rule:"Odmítnout: Désolé(e), je ne peux pas… + důvod (je dois + infinitiv).", why:"" },
  ]},
  { id:"r9", title:"Exercice 9 (bonus) — Překlad", items:[
    { task:"Zítra půjde Jenda do obchodu.", wide:true, blanks:[{ re:/demain,? jenda va (aller )?(au magasin|au supermarche|a la boutique|faire les courses|faire des courses)/, show:"Demain, Jenda va aller au magasin." }], rule:"futur proche = aller (présent) + infinitiv.", why:"Jenda va aller au magasin." },
    { task:"Minulý týden jsme jeli do Španělska.", wide:true, blanks:[{ re:/(la semaine derniere,? )?(nous sommes alle(e)?s|on est alle(e)?s) en espagne/, show:"La semaine dernière, nous sommes allés en Espagne." }], rule:"aller → passé composé s être + shoda; en + Espagne (f.).", why:"nous sommes allés (+s)." },
    { task:"Co dělali minulý týden?", wide:true, blanks:[{ re:/qu'est-ce qu'(ils|elles) ont fait la semaine derniere|(ils|elles) ont fait quoi la semaine derniere/, show:"Qu'est-ce qu'ils ont fait la semaine dernière ?" }], rule:"faire → j'ai fait (passé composé s avoir).", why:"Viz banka R7A, semaine 2–3: Qu'est-ce qu'ils ont fait la semaine dernière ?" },
    { task:"Co budete dělat příští týden?", wide:true, blanks:[{ re:/qu'est-ce que vous allez faire la semaine prochaine|vous allez faire quoi la semaine prochaine/, show:"Qu'est-ce que vous allez faire la semaine prochaine ?" }], rule:"futur proche: vous allez + faire.", why:"" },
    { task:"Co jsi dělal včera?", wide:true, blanks:[{ re:/qu'est-ce que tu as fait hier|tu as fait quoi hier|qu'as-tu fait hier/, show:"Qu'est-ce que tu as fait hier ?" }], rule:"tu as fait.", why:"" },
  ]},
  { id:"s1", title:"Révision 13–23 · 1. Zákaz, povinnost, žádost", note:"Box ze str. 123 (L'obligation et l'interdiction).", items:[
    { task:"___ fumer ou de vapoter dans les parties communes.", blanks:[["Interdiction de","Il est interdit de","Défense de"]], rule:"Zákaz: Interdiction de / Il est interdit de / Défense de + INF.", why:"„…ou DE vapoter“ → hodí se tvar s de (Interdiction de)." },
    { task:"___ fermer la porte d'entrée après votre passage.", blanks:[DEMANDE], rule:"Žádost: Merci de / Prière de + INF.", why:"Zdvořilá žádost: Merci de fermer la porte." },
    { task:"___ laisser votre vélo dans le couloir.", blanks:[INTERDIT], rule:"Zákaz.", why:"V učebnici: Ne pas laisser votre vélo dans les couloirs." },
    { task:"___ marcher sur la pelouse du jardin.", blanks:[INTERDIT], rule:"Zákaz.", why:"V učebnici: Défense de marcher sur la pelouse." },
    { task:"___ trier vos déchets dans le local à poubelles.", blanks:[DEMANDE], rule:"Žádost / povinnost.", why:"V učebnici: Prière de trier vos déchets." },
  ]},
  { id:"s2", title:"Révision 13–23 · 2. Zájmena COD (le, la, l', les)", items:[
    { task:"Tu as vu mon appartement ? Oui, je ___ trouve très beau !", blanks:[["le"]], rule:"le + m.", why:"l'appartement (m.), ale sloveso trouve začíná souhláskou → le." },
    { task:"Ma voisine est très sympa, je ___ aide souvent.", blanks:[["l'"]], rule:"la → l' před samohláskou.", why:"aide začíná samohláskou." },
    { task:"Tes clés ? Tu ___ oublies toujours sur la table !", blanks:[["les"]], rule:"les + pl.", why:"" },
    { task:"J'ai une fuite d'eau, je cherche un plombier pour ___ réparer.", blanks:[["la"]], rule:"COD před infinitivem.", why:"la fuite d'eau → la réparer." },
    { task:"Ce petit jardin, tu ___ vois depuis le balcon ?", blanks:[["le"]], rule:"le + m.", why:"" },
  ]},
  { id:"s3", title:"Révision 13–23 · 3. Ukazovací (ce, cet, cette, ces)", note:"V listu jsou nazvané „pronoms démonstratifs“; gramaticky jsou to přídavná jména (stojí před podstatným jménem).", items:[
    { task:"___ chat est à moi.", blanks:[["Ce"]], rule:"ce + m.", why:"Tahle kočka je moje." },
    { task:"___ voiture est très vieille.", blanks:[["Cette"]], rule:"cette + f.", why:"" },
    { task:"___ oranges sont pourries.", blanks:[["Ces"]], rule:"ces + pl.", why:"" },
    { task:"___ homme habite dans mon immeuble.", blanks:[["Cet"]], rule:"cet + m. před samohláskou / h.", why:"" },
    { task:"___ endroit est magnifique pour passer des vacances.", blanks:[["Cet"]], rule:"cet + m. před samohláskou.", why:"l'endroit (m.) → cet endroit." },
  ]},
  { id:"s4", title:"Révision 13–23 · 4. Země a národnosti", note:"Tohle cvičení v listu ještě nemáš vyplněné.", items:[
    { task:"Pierre habite en ___ (France), il est ___ .", blanks:[["France"],["français"]], rule:"en + f. · -ais.", why:"il est français (malé písmeno — je to přídavné jméno)." },
    { task:"Marco vient d'___ (Italie), il est ___ .", blanks:[["Italie"],["italien"]], rule:"d' + samohláska · -ien.", why:"" },
    { task:"Anna vit en ___ (Tchéquie), elle est ___ .", blanks:[["Tchéquie","République tchèque"],["tchèque"]], rule:"-e se nemění.", why:"elle est tchèque (stejné pro m. i f.)." },
    { task:"Yuki habite au ___ (Japon), elle est ___ .", blanks:[["Japon"],["japonaise"]], rule:"au + m. · -ais → -aise.", why:"Yuki je žena → japonaise." },
    { task:"Sarah vit en ___ (Belgique), elle est ___ .", blanks:[["Belgique"],["belge"]], rule:"-e se nemění.", why:"belge = belgický i belgická." },
  ]},
];

const NAT_RE = "francais|francaise|italien|italienne|espagnol|espagnole|allemand|allemande|anglais|anglaise|americain|americaine|tcheque|belge|suisse|russe|polonais|polonaise|chinois|chinoise|japonais|japonaise|marocain|marocaine|egyptien|egyptienne|neerlandais|neerlandaise|coreen|coreenne|algerien|algerienne|ivoirien|ivoirienne|ecossais|ecossaise|irlandais|irlandaise|liechtensteinois|liechtensteinoise|portugais|portugaise";
const PAYS_RE = "france|italie|espagne|allemagne|angleterre|royaume-uni|etats-unis|tchequie|republique tcheque|belgique|suisse|russie|pologne|chine|japon|maroc|egypte|pays-bas|coree|algerie|cote d ivoire|liechtenstein|portugal|grece|croatie|autriche";
const PC_ETRE_RE = "(suis|es|est|sommes|etes|sont) (alle|allee|alles|allees|parti|partie|partis|parties|arrive|arrivee|arrives|arrivees|rentre|rentree|rentres|rentrees|reste|restee|restes|restees|sorti|sortie|sortis|sorties|venu|venue|venus|venues|revenu|revenue|revenus|revenues|monte|montee|montes|montees|descendu|descendue|descendus|descendues|tombe|tombee|tombes|tombees|ne|nee|retourne|retournee)";

const FICHE_WRITING = [
  {
    title:"Exercice 8 — Popis cesty turistovi",
    brief:"Turista se tě ptá na cestu. Napiš 4 celé věty se slovesy tourner, continuer, traverser, prendre…",
    need:[
      { lab:"tournez / tourne (à gauche / à droite)", re:"tourne|tournez", min:1 },
      { lab:"continuez (tout droit)", re:"continue|continuez", min:1 },
      { lab:"traversez (le pont, la place…)", re:"traverse|traversez", min:1 },
      { lab:"prenez (la première / deuxième rue…)", re:"prenez|prends", min:1 },
      { lab:"aspoň 4 věty", sentences:[4, 99] },
    ],
    model:[
      "Excusez-moi, où est la gare, s'il vous plaît ?",
      "— Alors, continuez tout droit jusqu'à la place.",
      "Traversez la place, puis tournez à gauche.",
      "Prenez la deuxième rue à droite et traversez le pont.",
      "La gare est en face du musée, à côté de la poste.",
    ],
  },
  {
    title:"Partie 2 · 1. Pravidla ideálního domu",
    brief:"2 zákazy (Interdiction de… / Ne pas…), 2 povinnosti (infinitiv nebo rozkazovací způsob), 2 zdvořilé žádosti (Merci de… / Prière de…).",
    need:[
      { lab:"2 zákazy (Interdiction de / Il est interdit de / Défense de / Ne pas)", re:"interdiction de|interdit de|defense de|ne pas", min:2 },
      { lab:"2 žádosti (Merci de / Prière de)", re:"merci de|priere de", min:2 },
      { lab:"povinnosti (infinitiv nebo rozkaz — zaškrtni sám)", manual:true },
      { lab:"slovní zásoba domu (hall, couloir, escalier, ascenseur, balcon, pelouse, local à vélos…)", re:"hall|couloir|escalier|ascenseur|balcon|pelouse|local a|porte d entree|voisin|residence|appartement", min:2 },
    ],
    model:[
      "Le règlement de la résidence « Les Tilleuls »",
      "1. Interdiction de fumer dans le hall et dans l'ascenseur.",
      "2. Ne pas laisser les vélos dans le couloir : utilisez le local à vélos.",
      "3. Respecter les voisins après 22 heures.",
      "4. Fermez la porte d'entrée à clé le soir.",
      "5. Merci de trier vos déchets dans le local à poubelles.",
      "6. Prière de ne pas marcher sur la pelouse.",
    ],
  },
  {
    title:"Partie 2 · 2. Srovnání dvou destinací",
    brief:"5–8 vět: srovnej dvě místa na dovolenou. Aspoň 2× zájmeno y, srovnání (plus / moins / aussi … que), národnosti.",
    need:[
      { lab:"zájmeno y aspoň 2× (j'y vais, on y mange…)", yCount:true, min:2 },
      { lab:"srovnání: plus / moins / aussi … que, meilleur, mieux", re:"plus [a-z]+ que|moins [a-z]+ que|aussi [a-z]+ que|meilleur|mieux|pire", min:1 },
      { lab:"národnost(i)", re:NAT_RE, word:true, min:1 },
      { lab:"5–8 vět", sentences:[5, 8] },
    ],
    model:[
      "Je compare la montagne en Suisse et la plage en Italie.",
      "En Suisse, la montagne est très belle et j'y vais souvent en hiver.",
      "Les Suisses sont plus calmes que les Italiens, mais la cuisine suisse est moins variée que la cuisine italienne.",
      "En Italie, la plage est magnifique : on y mange des glaces et on y bronze tous les jours.",
      "La mer est aussi agréable que le lac, mais elle est plus chaude.",
      "Pour moi, les vacances à la plage sont meilleures parce que j'adore nager.",
    ],
  },
  {
    title:"Partie 2 · 3. Můj byt a sousedé (80+ slov)",
    brief:"1 zákaz, 1 zdvořilá žádost, 2 národnosti nebo země u sousedů, 1 ukazovací ce/cet/cette/ces, 2 COD (le, la, l', les), 1× zájmeno y.",
    need:[
      { lab:"aspoň 80 slov", words:80 },
      { lab:"1 zákaz", re:"interdiction de|interdit de|defense de|ne pas", min:1 },
      { lab:"1 zdvořilá žádost (Merci de / Prière de)", re:"merci de|priere de", min:1 },
      { lab:"2 národnosti / země", re:NAT_RE + "|" + PAYS_RE, word:true, min:2 },
      { lab:"ukazovací ce / cet / cette / ces", re:"ce|cet|cette|ces", word:true, min:1 },
      { lab:"2 COD (je le / la / l' / les + sloveso)", re:"(je|tu|il|elle|on|nous|vous|ils|elles) (ne )?(le|la|les|l) [a-z]+", min:2 },
      { lab:"zájmeno y (j'y habite…)", yCount:true, min:1 },
    ],
    model:[
      "Salut Tom !",
      "J'habite dans un petit appartement au troisième étage. J'y habite depuis un mois et je l'adore ! Cet appartement a un balcon et une jolie vue sur le parc.",
      "Mon voisin s'appelle Giuseppe. Il habite en France, mais il est italien. Je l'aime bien parce qu'il est très sympa. Ma voisine Yuki est japonaise ; elle fait de la musique et je la trouve très drôle.",
      "Il y a aussi des règles dans l'immeuble : interdiction de fumer dans le hall, et merci de fermer la porte d'entrée le soir.",
      "Viens me voir bientôt !",
      "Bisous, Jonas",
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════════
   DATA — 5) PSANÍ: obraz (str. 136 + 139) a pohlednice (str. 138)
   ═══════════════════════════════════════════════════════════════════ */

const PEINTRES = [
  { reg:"La Franche-Comté", who:"Gustave Courbet (1819–1877)", fr:"Gustave Courbet est né en Franche-Comté. À 20 ans, il est allé à Paris, mais il est revenu dans cette région à 30 ans. Sur ce tableau, il y a une rivière, des maisons et de l'herbe verte. Avec ses forêts et sa nature, c'est une belle région !", cz:"Courbet se narodil ve Franche-Comté. Ve 20 letech odjel do Paříže, ale ve 30 se do kraje vrátil. Na obraze je řeka, domy a zelená tráva." },
  { reg:"La Provence", who:"Paul Cézanne (1839–1906)", fr:"Paul Cézanne est né en Provence. Après ses études, il est parti à Paris, mais il est souvent retourné dans sa région. Sur cette peinture, on voit des arbres, des champs et la montagne Sainte-Victoire. C'est un endroit parfait pour la randonnée !", cz:"Cézanne se narodil v Provence, po studiích odjel do Paříže, ale často se vracel. Na malbě vidíme stromy, pole a horu Sainte-Victoire." },
  { reg:"La Normandie", who:"Claude Monet (1840–1926)", fr:"Claude Monet a habité plusieurs années en Normandie. Il est mort dans un petit village normand, Giverny. Sur ce tableau, on voit un chemin, des fleurs, la plage et la mer. En Normandie, la mer est froide, mais c'est très joli !", cz:"Monet bydlel několik let v Normandii, zemřel v Giverny. Na obraze vidíme cestu, květiny, pláž a moře." },
  { reg:"La région parisienne", who:"Berthe Morisot (1841–1895)", fr:"Berthe Morisot a fait beaucoup de peintures de la campagne près de Paris. Ici, c'est un lac dans le bois de Boulogne. Deux femmes font du bateau. Il y a aussi deux canards. Ce bois est très agréable pour se promener !", cz:"Morisot malovala venkov u Paříže. Tady je jezero v Boulogneském lesíku, dvě ženy jedou na lodi a jsou tam dvě kachny." },
];

const TABLEAU_TASK = {
  title:"Popiš obraz (Raoul Dufy, La rivière — str. 139, nebo jakýkoli jiný)",
  brief:"Napiš popis obrazu krajiny, jako bys ho sdílel na sociální síti (str. 136, cv. 6). Kdo ho namaloval, co na něm je, kde to je, barvy a tvůj názor.",
  need:[
    { lab:"il y a … (aspoň 2×)", re:"il y a", min:2 },
    { lab:"on voit …", re:"on voit", min:1 },
    { lab:"předložky místa (à gauche, à droite, devant, derrière, entre, sur, sous, à côté de, en face de)", re:"a gauche|a droite|devant|derriere|entre|sur|sous|a cote|en face", word:true, min:2 },
    { lab:"slovíčka „La nature“ — aspoň 5 (champ, chemin, forêt, lac, rivière, arbre, fleur, herbe, vache…)", re:"champ|champs|chemin|foret|lac|plage|riviere|arbre|arbres|fleur|fleurs|herbe|plante|plantes|canard|canards|chat|cheval|chevaux|chien|lapin|oiseau|oiseaux|poisson|poule|vache|vaches|montagne|montagnes|mer|ciel|nuage|nuages|maison|maisons|village|campagne", word:true, min:5 },
    { lab:"barvy (vert, bleu, rouge, jaune, blanc…)", re:"vert|verte|verts|vertes|bleu|bleue|bleus|bleues|rouge|rouges|jaune|jaunes|blanc|blanche|blancs|blanches|noir|noire|gris|grise|orange|rose|marron|violet", word:true, min:2 },
    { lab:"názor (C'est très joli ! / J'aime… / Je trouve ce tableau…)", re:"c est (tres |vraiment )?(joli|beau|belle|magnifique|agreable|genial|parfait)|j aime|j adore|je trouve", min:1 },
    { lab:"aspoň 50 slov", words:50 },
  ],
  model:[
    "Voici « La rivière », un tableau de Raoul Dufy, un peintre français.",
    "Sur ce tableau, on voit un paysage de campagne. Il y a une grande maison blanche avec un toit rouge.",
    "Derrière la maison, il y a des arbres verts et deux montagnes bleues. Le ciel est jaune.",
    "Devant la maison, on voit une rivière et beaucoup d'herbe verte. À gauche, il y a des arbres et des plantes.",
    "Il n'y a pas d'animaux, mais c'est un endroit parfait pour pique-niquer ou se promener !",
    "J'aime beaucoup les couleurs. C'est très joli !",
  ],
};

const CARTE_TASK = {
  title:"Napiš pohlednici z prázdnin (str. 138, cv. 6 — DELF, min. 40 slov)",
  brief:"Jsi na prázdninách. Napiš kamarádovi/kamarádce: kde jsi, co děláš (dnes), co jsi dělal(a) včera (počasí + akce), co budeš dělat zítra.",
  need:[
    { lab:"oslovení: Salut / Bonjour / Cher… / Chère…", re:"salut|bonjour|coucou|cher|chere", word:true, min:1 },
    { lab:"kde jsi: Je suis en vacances à / en / au…", re:"je suis en vacances|je suis (a|en|au|aux|chez)", min:1 },
    { lab:"imparfait: il faisait / il y avait / c'était", re:"il faisait|il y avait|c etait", min:1 },
    { lab:"passé composé s être (je suis allé(e), nous sommes partis…)", re:PC_ETRE_RE, word:true, min:1 },
    { lab:"passé composé s avoir (j'ai visité, j'ai pris…)", re:"(j ai|on a|nous avons|il a|elle a) [a-z]+(e|i|is|it|u)", min:1 },
    { lab:"zítra: futur proche (Demain, je vais + infinitiv)", re:"(je vais|on va|nous allons) [a-z]+(er|ir|re)", min:1 },
    { lab:"rozloučení: À bientôt / Bisous / Je t'embrasse", re:"a bientot|bisous|je t embrasse|grosses bises|bises", min:1 },
    { lab:"aspoň 40 slov (lépe 60–80)", words:40 },
  ],
  model:[
    "Salut Tom !",
    "Je suis en vacances en Italie, à Rome, avec ma famille. C'est génial ! Les gens sont sympas et la cuisine italienne est délicieuse.",
    "Hier, il faisait très beau et il y avait du soleil. Alors, nous sommes allés à la plage : je me suis baigné et j'ai bronzé. Le soir, nous avons goûté la cuisine locale. C'était super !",
    "Aujourd'hui, je visite le Colisée et je prends des photos.",
    "Demain, je vais faire une randonnée à la campagne et on va pique-niquer au bord d'un lac.",
    "À bientôt !",
    "Bisous, Jonas",
  ],
};

/* ═══════════════════════════════════════════════════════════════════
   DATA — 6) KVÍZ
   ═══════════════════════════════════════════════════════════════════ */

const QUIZ = [
  { question:"Yuki habite ___ Japon.", type:"single", options:["au","en","à","aux"], correct:[0],
    explanation:"le Japon je mužského rodu → au Japon.", tip:"Země končící na -e bývají ženské (en), ostatní mužské (au). Výjimka: le Mexique → au Mexique." },
  { question:"Nathan vient ___ États-Unis.", type:"single", options:["des","du","de","aux"], correct:[0],
    explanation:"ODKUD + množné číslo: de + les = des États-Unis (str. 132)." },
  { question:"Il vient ___ Irak.", type:"single", options:["d'","du","de l'","des"], correct:[0],
    explanation:"Remarque str. 132: de / du → d' před a, e, i, o, u. l'Irak je m., ale píše se d'Irak." },
  { question:"Které věty jsou SPRÁVNĚ? (vyber všechny)", type:"multi",
    options:["Je vais en Belgique.","Elle habite au Maroc.","Ils viennent de la France.","Nous partons aux Pays-Bas.","Je reviens du Chine."], correct:[0,1,3],
    explanation:"en Belgique ✓, au Maroc ✓, aux Pays-Bas ✓. Chyby: „de la France“ → de France (u ženských zemí ODKUD bez členu); „du Chine“ → de Chine (la Chine je ženská)." },
  { question:"Jak se řekne „Italka“ (Je suis …)?", type:"single", options:["italienne","italiene","italianne","italienn"], correct:[0],
    explanation:"-ien → -ienne (zdvojené n): italien → italienne, égyptien → égyptienne, algérien → algérienne." },
  { question:"Která přídavná jména národnosti mají STEJNÝ tvar pro muže i ženu? (vyber všechny)", type:"multi",
    options:["belge","suisse","russe","tchèque","chinois","allemand"], correct:[0,1,2,3],
    explanation:"Končí-li tvar na -e, ženský rod se nemění: belge, suisse, russe, tchèque. chinois → chinoise, allemand → allemande." },
  { question:"„Il est français.“ vs. „C'est un Français.“ — proč jednou malé a jednou velké F?", type:"single",
    options:["Přídavné jméno = malé, podstatné jméno (obyvatel) = velké","Je to jedno","Velké jen na začátku věty","Velké vždy u mužského rodu"], correct:[0],
    explanation:"il est français (přídavné jméno) · un Français, une Française (obyvatel = podstatné jméno). Názvy jazyků malé: le français." },
  { question:"Jaká národnost patří k „les Pays-Bas“?", type:"single", options:["néerlandais","hollandien","paysbasien","danois"], correct:[0],
    explanation:"les Pays-Bas (Nizozemsko) → néerlandais(e). Pozor: danois = dánský (le Danemark)." },
  { question:"Hier, Marie ___ partie en vacances.", type:"single", options:["est","a","était","sont"], correct:[0],
    explanation:"partir patří mezi slovesa s être → elle est partie (+ e kvůli ženskému rodu)." },
  { question:"Které věty jsou správně v passé composé? (vyber všechny)", type:"multi",
    options:["Nous sommes allés à Nice.","Elle est arrivée à la plage.","Ils sont rentré hier.","J'ai visité le musée.","Elle a tombée."], correct:[0,1,3],
    explanation:"Se être je shoda s podmětem: ils sont rentrés (+s), elle est tombée (s être, ne avoir!). visiter se pojí s avoir → j'ai visité." },
  { question:"Která slovesa tvoří passé composé s ÊTRE? (vyber všechna)", type:"multi",
    options:["aller","naître","manger","tomber","faire","rester"], correct:[0,1,3,5],
    explanation:"Pohybová a „stavová“ slovesa: aller, venir, arriver, partir, entrer, sortir, monter, descendre, naître, mourir, tomber, rester, (re)venir, rentrer, retourner. manger a faire → avoir.",
    tip:"DR & MRS VANDERTRAMP: Devenir, Revenir, Monter, Rester, Sortir, Venir, Aller, Naître, Descendre, Entrer, Rentrer, Tomber, Retourner, Arriver, Mourir, Partir." },
  { question:"„Il est né / il est mort“ — od kterých sloves jsou tato příčestí?", type:"single",
    options:["naître, mourir","nager, mordre","naître, montrer","nommer, mourir"], correct:[0],
    explanation:"naître → né, mourir → mort. Obě s être (Claude Monet est mort à Giverny)." },
  { question:"Aujourd'hui, il fait beau. → Hier, ___ mauvais.", type:"single",
    options:["il faisait","il a fait","il était","il y avait"], correct:[0],
    explanation:"Popis počasí v minulosti = imparfait slovesa faire: il faisait (str. 138)." },
  { question:"Přiřaď: c'est → ?", type:"single", options:["c'était","c'étais","c'est été","c'avait"], correct:[0],
    explanation:"être v imparfait: c'était. Tabulka str. 138: c'est → c'était · il y a → il y avait · il fait → il faisait." },
  { question:"Proč na pohlednici Carole píše „Hier, il ne faisait pas beau… Alors, j'ai visité le Mucem“?", type:"single",
    options:["Popis/počasí = imparfait, jednorázová akce = passé composé","Obojí je imparfait","Obojí je passé composé","Je to budoucí čas"], correct:[0],
    explanation:"Kulisa (počasí, jaké to bylo) → imparfait; co se stalo → passé composé. C'était très intéressant = hodnocení (imparfait)." },
  { question:"Je parle et tu ___ écoutes.", type:"single", options:["m'","me","moi","te"], correct:[0],
    explanation:"COD me → m' před samohláskou (écoutes). Str. 145, cv. 2b." },
  { question:"Qu'est-ce que vous dites ? Je ne ___ comprends pas.", type:"single", options:["vous","te","les","nous"], correct:[0],
    explanation:"Nerozumím VÁM → je ne vous comprends pas. COD stojí před slovesem i v záporu." },
  { question:"Kde stojí zájmena COD me, te, nous, vous?", type:"single",
    options:["Před slovesem","Za slovesem","Na konci věty","Za „pas“"], correct:[0],
    explanation:"Modrý box str. 145: Ils sont placés avant le verbe. Tu m'aides ? Le professeur nous corrige." },
  { question:"Pierre a étudié le droit ___ deux ans.", type:"single", options:["pendant","longtemps","toujours","depuis longtemps"], correct:[0],
    explanation:"pendant + podstatné jméno = po (omezenou) dobu. pendant deux ans." },
  { question:"Les études de droit durent ___ .", type:"single", options:["longtemps","pendant","toujours","pendant longtemps ans"], correct:[0],
    explanation:"sloveso + longtemps = dlouho (bez podstatného jména)." },
  { question:"Je n'ai pas fini mon master, je suis ___ à l'université.", type:"single", options:["toujours","pendant","longtemps","jamais"], correct:[0],
    explanation:"présent + toujours = pořád ještě (děj začal v minulosti a trvá)." },
  { question:"Co znamená „la chambre d'hôtes“?", type:"single", options:["pokoj u lidí doma (penzion)","hotelový pokoj pro hosty","ložnice","stan v kempu"], correct:[0],
    explanation:"Str. 133, cv. 2d: C'est une chambre chez des personnes → une chambre d'hôtes." },
  { question:"On dort sous une tente dans cet hébergement. → ?", type:"single", options:["un camping","une location","une ferme","un hôtel"], correct:[0],
    explanation:"Str. 133, cv. 2a: tente = stan → le camping." },
  { question:"Které z těchto slov je z lekce „La nature“ a znamená „pole“?", type:"single", options:["le champ","le chemin","le chant","la plage"], correct:[0],
    explanation:"le champ = pole · le chemin = cesta · la plage = pláž." },
  { question:"J'aime nager avec les poissons. — O jaké činnosti je řeč?", type:"single", options:["faire de la plongée","faire du bateau","pique-niquer","faire du cheval"], correct:[0],
    explanation:"Str. 139, cv. 3a: plavat s rybami = potápět se → faire de la plongée." },
  { question:"Které z těchto zvířat jsou v seznamu str. 139 ŽENSKÉHO rodu? (vyber všechna)", type:"multi",
    options:["la vache","la poule","le lapin","l'oiseau","le canard"], correct:[0,1],
    explanation:"la vache, la poule. Ostatní jsou mužská: le lapin, l'oiseau (m.), le canard, le cheval, le chien, le chat, le poisson." },
  { question:"Ahmed est ___ . Il est en troisième année de licence.", type:"single", options:["étudiant","étudier","études","enseignant"], correct:[0],
    explanation:"Str. 147, cv. 2: Ahmed est étudiant. Il a de bonnes notes. Il va avoir son diplôme à la fin de l'année." },
  { question:"„le resto U“ je hovorově…", type:"single", options:["le restaurant universitaire (menza)","le logement étudiant","la salle de cours","le secrétariat"], correct:[0],
    explanation:"le restaurant universitaire = le resto U (fam.) = menza." },
  { question:"Které obory (les disciplines) jsou v seznamu str. 147? (vyber všechny)", type:"multi",
    options:["le droit","l'informatique","les lettres","la plongée","le commerce"], correct:[0,1,2,4],
    explanation:"le commerce, le droit, l'économie, l'informatique, les langues, les lettres, les mathématiques, les sciences. la plongée je činnost (str. 139)." },
  { question:"Jak správně ZAČÍT pohlednici kamarádce Marii?", type:"single", options:["Chère Marie,","Cher Marie,","Madame,","Bonjour Madame Marie"], correct:[0],
    explanation:"„Pour écrire une carte postale“ str. 138: Cher + jméno muže, Chère + jméno ženy, nebo Salut / Bonjour." },
  { question:"Kterými frázemi můžeš pohlednici UKONČIT? (vyber všechny)", type:"multi",
    options:["À bientôt !","Bisous","Je t'embrasse","Cordialement, Monsieur","Bienvenue !"], correct:[0,1,2],
    explanation:"Str. 138: À bientôt ! / Bisous / Je t'embrasse. „Cordialement“ je do formálního mailu; „Bienvenue“ = vítejte." },
  { question:"Jak začneš popis obrazu?", type:"single",
    options:["Sur ce tableau, il y a / on voit…","Dans ce tableau, je suis…","Ce tableau a fait…","Il était une fois…"], correct:[0],
    explanation:"„Pour décrire un paysage“ str. 136: Il y a une rivière, des maisons… · On voit des arbres, des champs… · C'est très joli !" },
  { question:"Le tapis est ___ la table. (koberec je pod stolem)", type:"single", options:["sous","sur","devant","entre"], correct:[0],
    explanation:"sous = pod · sur = na · devant = před · derrière = za · entre = mezi · à côté de = vedle · en face de = naproti." },
  { question:"La lampe est à droite ___ canapé.", type:"single", options:["du","de le","de","des"], correct:[0],
    explanation:"Rappel: de + le = du, de + les = des → à droite du canapé, à côté des fenêtres." },
];

/* ═══════════════════════════════════════════════════════════════════
   SPOLEČNÉ KOMPONENTY
   ═══════════════════════════════════════════════════════════════════ */

function Acc({ title, badge, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="acc">
      <button className={"acc-head" + (open ? " open" : "")} onClick={() => setOpen(o => !o)}>
        <span className="t">{title}</span>
        <span style={{ display:"flex", gap:"12px", alignItems:"center" }}>
          {badge && <span className="badge">{badge}</span>}
          <span className="chev">▶</span>
        </span>
      </button>
      {open && <div className="acc-body">{children}</div>}
    </div>
  );
}

function SectionHead({ no, title, lede }) {
  return (
    <>
      <div className="sect-title"><span className="no">{no}</span><h2>{title}</h2></div>
      <p className="sect-lede">{lede}</p>
    </>
  );
}

function BlueBox({ title, children }) {
  return <div className="bluebox"><div className="bh">{title}</div><div className="bb">{children}</div></div>;
}

function PourBox({ title, children }) {
  return <div className="pour"><div className="ph"><span>Pour</span>{title}</div><div className="pb">{children}</div></div>;
}

const DIFF = { e:["e","Snadné ✨"], m:["m","Střední ⚡"], h:["h","Těžké 🔥"], b:["b","Učebnice 📘"] };

/** Jedna doplňovačka s kontrolou a skrytým řešením. */
function GapItem({ it, n, showDiff = true }) {
  const [vals, setVals] = useState(it.blanks.map(() => ""));
  const [res, setRes] = useState(null);
  const [open, setOpen] = useState(false);
  const parts = it.task.split("___");

  const check = () => setRes(it.blanks.map((b, i) => checkBlank(vals[i], b)));
  const set = (i, v) => { const nv = [...vals]; nv[i] = v; setVals(nv); setRes(null); };
  const cls = i => "blank" + (it.wide ? " wide" : "") + (res ? (res[i] === "bad" ? " bad" : " ok") : "");
  const allOk = res && res.every(x => x !== "bad");
  const accent = res && res.some(x => x === "accent");

  const input = i => (
    <input key={"b" + i} className={cls(i)} value={vals[i]} placeholder={it.wide ? "napiš francouzsky…" : "…"}
      onChange={e => set(i, e.target.value)} onKeyDown={e => e.key === "Enter" && check()}
      autoCapitalize="off" autoCorrect="off" spellCheck={false} aria-label={"Mezera " + (i + 1)} />
  );

  return (
    <div className="gap">
      {(n != null || showDiff || it.hint) && (
        <div className="gap-head">
          {n != null && <span className="n">{n}.</span>}
          {showDiff && it.diff && <span className={"diff " + DIFF[it.diff][0]}>{DIFF[it.diff][1]}</span>}
          {it.hint && <span className="hint">{it.hint}</span>}
        </div>
      )}
      {it.wide ? (
        <div className="gap-line"><div>{it.task}</div>{input(0)}</div>
      ) : (
        <div className="gap-line">
          {parts.map((p, i) => <span key={i}>{p}{i < parts.length - 1 && input(i)}</span>)}
        </div>
      )}
      <div className="gap-actions">
        <button className="mini" onClick={check}>Zkontrolovat</button>
        <button className="mini red" onClick={() => setOpen(o => !o)}>{open ? "Skrýt řešení" : "Ukázat řešení"}</button>
      </div>
      {res && (
        <div className="verdict-line" style={{ color: allOk ? "var(--ok)" : "var(--bad)" }}>
          {allOk ? (accent ? "✓ Správně — ale pozor na diakritiku (é, è, ç…)." : "✓ Správně!") : "✗ Ještě ne — zkus to znovu, nebo si odkryj řešení."}
        </div>
      )}
      {open && (
        <div className="sol">
          <div className="step"><div className="lab">Pravidlo</div>{it.rule}</div>
          {it.why && <div className="step"><div className="lab">Proč</div>{it.why}</div>}
          <div className="res">{it.blanks.map(shownAnswer).join("  ·  ")}</div>
        </div>
      )}
    </div>
  );
}

/** Psací úkol s automatickou kontrolou zadání a skrytým vzorem. */
function WritingTask({ t }) {
  const [text, setText] = useState("");
  const [checked, setChecked] = useState(false);
  const [manual, setManual] = useState({});
  const [model, setModel] = useState(false);

  const n = normText(text);
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const sentences = text.split(/[.!?\n]+/).filter(x => x.trim().length > 3).length;

  const hits = t.need.map((r, i) => {
    if (r.manual) return { ...r, ok: !!manual[i] };
    if (r.words) return { ...r, ok: words >= r.words, extra: words + " slov" };
    if (r.sentences) return { ...r, ok: sentences >= r.sentences[0] && sentences <= r.sentences[1], extra: sentences + " vět" };
    let count;
    if (r.yCount) {
      count = (n.match(/\sy\s/g) || []).length - (n.match(/\sil y a(vait)?\s/g) || []).length - (n.match(/\sn y a(vait)? pas\s/g) || []).length;
    } else {
      const re = new RegExp(r.word ? "\\s(" + r.re + ")(?=\\s)" : "(" + r.re + ")", "g");
      count = (n.match(re) || []).length;
    }
    return { ...r, ok: count >= r.min, extra: Math.max(0, count) + "×" };
  });
  const done = hits.filter(h => h.ok).length;

  return (
    <div className="card">
      <h3>{t.title}</h3>
      <p className="lede">{t.brief}</p>
      <textarea className="textarea" rows={7} value={text} onChange={e => setText(e.target.value)} placeholder="piš sem francouzsky…" />
      <div className="scorebar">
        <span className="chip">Slov: <b>{words}</b></span>
        <span className="chip">Vět: <b>{sentences}</b></span>
      </div>
      <div style={{ display:"flex", gap:"10px", flexWrap:"wrap" }}>
        <button className="btn" onClick={() => setChecked(true)}>Zkontrolovat zadání</button>
        <button className="btn red" onClick={() => setModel(m => !m)}>{model ? "Skrýt vzor" : "Vzorové řešení"}</button>
      </div>
      {checked && (
        <div style={{ marginTop:"16px" }}>
          <div className="prog"><i style={{ width: (done / t.need.length) * 100 + "%" }} /></div>
          <ul className="checklist">
            {hits.map((h, i) => (
              <li key={i} style={{ color: h.ok ? "var(--ok)" : "var(--muted)" }}>
                {h.manual ? (
                  <label><input type="checkbox" checked={!!manual[i]} onChange={e => setManual(m => ({ ...m, [i]: e.target.checked }))} />{h.lab}</label>
                ) : (
                  <><b>{h.ok ? "✓" : "○"}</b><span>{h.lab}{h.extra ? " — " + h.extra : ""}</span></>
                )}
              </li>
            ))}
          </ul>
          <p style={{ fontSize:"14px", color:"var(--muted)" }}>Kontrola hledá jen to, jestli jsi daný obrat použil. Gramatiku (shodu, členy) si porovnej se vzorem.</p>
        </div>
      )}
      {model && <div className="model" style={{ marginTop:"14px" }}>{t.model.map((m, i) => <div key={i}>{m}</div>)}</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   I) PLÁN TESTU
   ═══════════════════════════════════════════════════════════════════ */

const PLAN = [
  { n:"1", fr:"Les pays et nationalités dans la banque (noms et adjectifs), puis aussi les prépositions correctes (en France, au Japon, venir de…, cf. manuel p. 132).",
    cz:"21 zemí z banky + národnosti (muž / žena) + předložky KDE/KAM (en, au, aux, à) a ODKUD (de, d', du, des).", tabs:["pays"],
    checks:["Znám všech 21 zemí se členem (le / la / les)","Umím národnost v mužském i ženském rodě","en / au / aux / à — kam a kde","de / d' / du / des — odkud (str. 132)"] },
  { n:"2", fr:"Le vocabulaire sur les pages 133, 139 et 147.",
    cz:"Les vacances (str. 133), La nature (str. 139), L'université, les études (str. 147).", tabs:["vocab"],
    checks:["Str. 133 — dovolená, ubytování, rezervace","Str. 139 — příroda, rostliny, zvířata","Str. 147 — kampus, studium, obory"] },
  { n:"3", fr:"La grammaire (cases bleues) sur les pages 137, 138, 145 et 146.",
    cz:"Passé composé s être (137) · il faisait / c'était / il y avait (138) · COD me, te, nous, vous (145) · pendant / longtemps / toujours (146).", tabs:["gram"],
    checks:["Passé composé s être + shoda (str. 137)","Imparfait: il faisait, c'était, il y avait (str. 138)","COD me / te / nous / vous (str. 145)","pendant / longtemps / toujours (str. 146)"] },
  { n:"4", fr:"Soyez préparés à produire une description d'un tableau et une lettre de vos vacances (pages 136 et 138 comme inspiration).",
    cz:"Popis obrazu krajiny (str. 136 + obraz na str. 139) a pohlednice z prázdnin (str. 138).", tabs:["ecrit"],
    checks:["Umím popsat obraz (il y a, on voit, předložky místa, barvy, názor)","Umím napsat pohlednici (Salut… / včera / dnes / zítra / À bientôt)"] },
  { n:"+", fr:"Voici le document promis. Veuillez compléter les exercices restants…",
    cz:"List od profesora (Révision.docx): cvičení z minulého roku + slohové úkoly. Tvoje vyplněné odpovědi jsem zkontroloval.", tabs:["fiche"],
    checks:["Doplnil jsem zbývající cvičení (země, cesta, překlady)","Prošel jsem opravy svých odpovědí"] },
];

function PlanTab({ go }) {
  const [done, setDone] = useState(() => loadLS("fr-r7a-plan", {}));
  const toggle = k => setDone(d => { const nd = { ...d, [k]: !d[k] }; saveLS("fr-r7a-plan", nd); return nd; });
  const total = PLAN.reduce((s, p) => s + p.checks.length, 0);
  const count = Object.values(done).filter(Boolean).length;
  const LABEL = { pays:"🌍 Země", vocab:"📚 Slovíčka", gram:"📐 Gramatika", ecrit:"🖼️ Psaní", fiche:"📄 List" };

  return (
    <div>
      <SectionHead no="Partie I" title="Co bude v testu"
        lede="Zadání od profesora rozdělené na čtyři části + jeho opakovací list. U každé části je seznam věcí, které musíš umět — odškrtávej si je (zůstanou uložené v prohlížeči)." />
      <div className="scorebar">
        <span className="chip">Hotovo: <b>{count} / {total}</b></span>
        <span className="chip">Test: <b>pátek 23. 10.</b></span>
      </div>
      <div className="prog"><i style={{ width: (count / total) * 100 + "%" }} /></div>
      <div className="plan">
        {PLAN.map((p, pi) => (
          <div key={pi} className={"card" + (pi % 2 ? " red" : "")}>
            <div className="num">{p.n}</div>
            <div className="fr-q">« {p.fr} »</div>
            <div>{p.cz}</div>
            <ul className="checklist" style={{ marginTop:"10px" }}>
              {p.checks.map((c, ci) => {
                const k = pi + "-" + ci;
                return <li key={k}><label><input type="checkbox" checked={!!done[k]} onChange={() => toggle(k)} />{c}</label></li>;
              })}
            </ul>
            <div className="go">{p.tabs.map(t => <button key={t} className="mini" onClick={() => go(t)}>{LABEL[t]} →</button>)}</div>
          </div>
        ))}
      </div>
      <div className="note" style={{ marginTop:"22px" }}>
        <b>Plán na dnešní večer:</b> 1) Země — tabulka + dril národností. 2) Gramatika — 4 modré boxy, u každého cvičení z učebnice. 3) Slovíčka přes kartičky. 4) Napiš jednou popis obrazu a jednou pohlednici a nech je zkontrolovat. 5) Kvíz na závěr. Ráno projdi Tahák.
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   II) ZEMĚ A NÁRODNOSTI
   ═══════════════════════════════════════════════════════════════════ */

function NatDrill() {
  const [seed, setSeed] = useState(0);
  const [val, setVal] = useState("");
  const [res, setRes] = useState(null);
  const [stats, setStats] = useState({ ok:0, all:0 });
  const card = useMemo(() => {
    const p = PAYS[Math.floor(Math.random() * PAYS.length)];
    const fem = Math.random() < 0.5;
    const mode = Math.random() < 0.5 ? "nat" : "prep";
    return { p, fem, mode };
  }, [seed]);
  const { p, fem, mode } = card;
  const who = fem ? "Elle" : "Il";
  const answer = mode === "nat" ? (fem ? p.f : p.m) : p.en;
  const prompt = mode === "nat" ? <>{p.pays} → {who} est …</> : <>{who} habite … ({p.pays})</>;
  const ctx = mode === "nat" ? "napiš národnost (" + (fem ? "žena" : "muž") + ")" : "napiš předložku + zemi (kde bydlí)";

  const check = () => {
    if (res) return;
    let ok;
    if (mode === "nat") {
      const alts = p.natAlts ? p.natAlts[fem ? "f" : "m"] : [answer];
      ok = alts.some(a => strip(a) === strip(val)) ? (alts.some(a => clean(a) === clean(val)) ? "ok" : "accent") : "bad";
    } else {
      const alts = [p.en].concat(p.alt ? ["en Tchéquie"] : []);
      ok = checkBlank(val, alts);
    }
    setRes(ok);
    setStats(s => ({ ok: s.ok + (ok !== "bad" ? 1 : 0), all: s.all + 1 }));
  };
  const next = () => { setVal(""); setRes(null); setSeed(s => s + 1); };

  return (
    <div className="card red">
      <h3>🎲 Dril: národnost a předložka</h3>
      <p className="lede">Náhodná země z banky. Enter = zkontrolovat, druhý Enter = další.</p>
      <div className="scorebar"><span className="chip">Správně: <b>{stats.ok} / {stats.all}</b></span></div>
      <div className="drill">
        <div className="prompt">{prompt}</div>
        <div className="ctx">{p.cz} · {ctx}</div>
        <input className={"blank wide" + (res ? (res === "bad" ? " bad" : " ok") : "")} value={val}
          onChange={e => setVal(e.target.value)} onKeyDown={e => { if (e.key === "Enter") res ? next() : check(); }}
          autoCapitalize="off" autoCorrect="off" spellCheck={false} placeholder="…" style={{ margin:"0 auto" }} />
        <div className="fbk" style={{ color: res === "bad" ? "var(--bad)" : "var(--ok)" }}>
          {res === "ok" && "✓ Správně!"}
          {res === "accent" && "✓ Správně — pozor na diakritiku: " + answer}
          {res === "bad" && "✗ Správně: " + answer}
        </div>
        <div className="gap-actions" style={{ justifyContent:"center" }}>
          <button className="mini" onClick={check}>Zkontrolovat</button>
          <button className="mini red" onClick={next}>Další →</button>
        </div>
      </div>
    </div>
  );
}

function PaysTab() {
  const [q, setQ] = useState("");
  const rows = PAYS.filter(p => !q || strip(p.pays + " " + p.cz + " " + p.m + " " + p.f).includes(strip(q)));
  return (
    <div>
      <SectionHead no="Partie II" title="Země a národnosti"
        lede="Seznam z banky (semaine 23) a předložky ze str. 132. Barva členu: le = modrá, la = červená, les = černá. Rod země rozhoduje o předložce." />

      <div className="grid2">
        <BlueBox title="KDE / KAM — habiter, être, aller">
          <table className="tbl" style={{ margin:0 }}>
            <tbody>
              <tr><td><b>à</b> + město</td><td>à Paris, à Rome</td></tr>
              <tr><td><b>en</b> + ženský rod / samohláska</td><td>en <span className="g-f">France</span>, en Italie, en Égypte</td></tr>
              <tr><td><b>au</b> + mužský rod</td><td>au <span className="g-m">Japon</span>, au Maroc</td></tr>
              <tr><td><b>aux</b> + množné číslo</td><td>aux États-Unis, aux Pays-Bas</td></tr>
            </tbody>
          </table>
        </BlueBox>
        <BlueBox title="ODKUD — venir de, arriver de, revenir de (str. 132)">
          <table className="tbl" style={{ margin:0 }}>
            <tbody>
              <tr><td><b>de / d'</b> + město</td><td>Je reviens de Copenhague. J'arrive d'Amsterdam.</td></tr>
              <tr><td><b>de / d'</b> + ženský rod</td><td>J'arrive de Nouvelle-Zélande. Yvonne vient d'Irlande.</td></tr>
              <tr><td><b>du / d'</b> + mužský rod</td><td>Je reviens du Danemark. Il vient d'Irak.</td></tr>
              <tr><td><b>des</b> + množné číslo</td><td>Nathan vient des États-Unis.</td></tr>
            </tbody>
          </table>
          <div style={{ marginTop:"8px" }}><b style={{ color:"var(--rouge)" }}>Remarque :</b> de / du → <b>d'</b> devant a, e, i, o, u.</div>
        </BlueBox>
      </div>

      <div className="rule">
        <b>Jak poznat rod země?</b> Končí-li na <b>-e</b>, je skoro vždy <span className="g-f">ženská</span> (la France, la Belgique, la Chine). Ostatní jsou <span className="g-m">mužské</span> (le Japon, le Maroc, le Liechtenstein). Mnohotvar = <b>les</b> (les États-Unis, les Pays-Bas).
        <br /><b>Pozor:</b> ODKUD u ženských zemí <b>bez členu</b> — de France, ne „de la France“.
      </div>

      <h3 className="sub-h">Tvoření národností</h3>
      <div className="tblwrap">
        <table className="tbl">
          <thead><tr><th>Pravidlo</th><th>Muž</th><th>Žena</th></tr></thead>
          <tbody>
            <tr><td>+ e</td><td>français, allemand, chinois, marocain, polonais</td><td>français<span className="red-e">e</span>, allemand<span className="red-e">e</span>, chinois<span className="red-e">e</span></td></tr>
            <tr><td>-ien → -ienne, -éen → -éenne</td><td>italien, égyptien, algérien, ivoirien, coréen</td><td>italien<span className="red-e">ne</span>, égyptien<span className="red-e">ne</span>, coréen<span className="red-e">ne</span></td></tr>
            <tr><td>-e → beze změny</td><td>belge, suisse, russe, tchèque</td><td>belge, suisse, russe, tchèque</td></tr>
          </tbody>
        </table>
      </div>
      <div className="note">Přídavné jméno = malé písmeno: <i>Il est français.</i> Obyvatel = velké: <i>C'est un Français, une Française.</i> Jazyk = malé: <i>Je parle français.</i></div>

      <h3 className="sub-h">Tabulka z banky ({PAYS.length} zemí)</h3>
      <input className="search" placeholder="Hledat zemi / národnost / česky…" value={q} onChange={e => setQ(e.target.value)} />
      <div className="tblwrap">
        <table className="tbl">
          <thead><tr><th>Pays</th><th>Kde / kam</th><th>Odkud</th><th>Il est…</th><th>Elle est…</th><th>Česky</th></tr></thead>
          <tbody>
            {rows.map(p => (
              <tr key={p.pays}>
                <td><Fr t={p.pays} g={p.g} />{p.alt && <div style={{ fontSize:"13px", color:"var(--muted)" }}>{p.alt}</div>}{p.pron && <div style={{ fontSize:"13px", color:"var(--muted)" }}>{p.pron}</div>}</td>
                <td>{p.en}</td><td>{p.de}</td><td>{p.m}</td><td>{p.f}</td><td>{p.cz}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <NatDrill />

      <h3 className="sub-h">Doplňovačky — předložky u zemí a měst</h3>
      {PREP_GAPS.map((it, i) => <GapItem key={i} it={it} n={i + 1} />)}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   III) SLOVÍČKA
   ═══════════════════════════════════════════════════════════════════ */

function VocabRow({ it }) {
  return <div className="vrow"><span className="fr"><Fr t={it.fr} g={it.g} /></span><span className="cz">{it.cz}</span></div>;
}

function Flashcards({ page }) {
  const [dir, setDir] = useState("fr");
  const [seed, setSeed] = useState(0);
  const [i, setI] = useState(0);
  const [flip, setFlip] = useState(false);
  const deck = useMemo(() => {
    const d = ALL_WORDS.filter(w => page === "all" || w.page === page);
    return seed ? shuffleArray(d) : d;
  }, [page, seed]);
  useEffect(() => { setI(0); setFlip(false); }, [page]);
  const c = deck[Math.min(i, deck.length - 1)];
  const go = n => { setFlip(false); setTimeout(() => setI(n), flip ? 220 : 0); };
  const front = dir === "fr" ? <Fr t={c.fr} g={c.g} /> : c.cz;
  const back = dir === "fr" ? c.cz : <Fr t={c.fr} g={c.g} />;
  const start = Math.max(0, Math.min(i - 15, deck.length - 30));
  const dots = deck.slice(start, start + 30);

  return (
    <div>
      <div className="modes">
        <button className={"mode" + (dir === "fr" ? " on" : "")} onClick={() => { setDir("fr"); setFlip(false); }}>FR → CZ</button>
        <button className={"mode" + (dir === "cz" ? " on" : "")} onClick={() => { setDir("cz"); setFlip(false); }}>CZ → FR</button>
        <button className="mode" onClick={() => { setSeed(s => s + 1); setI(0); setFlip(false); }}>🔀 Zamíchat</button>
      </div>
      <div className="fcwrap">
        <div className={"fc" + (flip ? " flip" : "")} onClick={() => setFlip(f => !f)}>
          <div className="fc-face"><div className="big">{front}</div><div className="small">str. {c.page} · {dir === "fr" ? "français" : "česky"} · klikni</div></div>
          <div className="fc-face back"><div className="big">{back}</div><div className="small">{c.cat}</div></div>
        </div>
      </div>
      <div className="fcdots">{dots.map((_, k) => <i key={start + k} className={start + k === i ? "on" : ""} onClick={() => go(start + k)} />)}</div>
      <div className="navrow" style={{ maxWidth:"540px", margin:"10px auto 0" }}>
        <button className="btn" onClick={() => go(i - 1)} disabled={i === 0}>← Předchozí</button>
        <span style={{ alignSelf:"center", color:"var(--muted)" }}>{i + 1} / {deck.length}</span>
        <button className="btn" onClick={() => go(i + 1)} disabled={i >= deck.length - 1}>Další →</button>
      </div>
    </div>
  );
}

/** Psaní slovíček CZ → FR, bez nápověd; člen a diakritika se tolerují. */
function WriteDrill({ page }) {
  const [seed, setSeed] = useState(0);
  const deck = useMemo(() => shuffleArray(ALL_WORDS.filter(w => page === "all" || w.page === page)), [page, seed]);
  const [i, setI] = useState(0);
  const [val, setVal] = useState("");
  const [res, setRes] = useState(null);
  const [score, setScore] = useState({ ok:0, all:0, byPage:{} });
  useEffect(() => { setI(0); setVal(""); setRes(null); }, [page, seed]);
  const w = deck[i % deck.length];
  const answers = w.ans || [w.fr];

  const check = () => {
    if (res || !val.trim()) return;
    const ok = answers.some(a => bare(a) === bare(val)) || answers.some(a => a.split(/\s*[\/,]\s*/).some(x => bare(x) === bare(val)));
    const ART = /^((les|le|la|un|une|des)\s+|l')/;
    const art = ok && ART.test(strip(answers[0])) && !ART.test(strip(val));
    setRes(ok ? (art ? "art" : "ok") : "bad");
    setScore(s => {
      const bp = { ...s.byPage }; const cur = bp[w.page] || [0, 0];
      bp[w.page] = [cur[0] + (ok ? 1 : 0), cur[1] + 1];
      return { ok: s.ok + (ok ? 1 : 0), all: s.all + 1, byPage: bp };
    });
  };
  const next = () => { setVal(""); setRes(null); setI(n => n + 1); };

  return (
    <div className="card">
      <div className="scorebar">
        <span className="chip">Celkem: <b>{score.ok} / {score.all}</b></span>
        {Object.entries(score.byPage).map(([p, [o, a]]) => <span key={p} className="chip">str. {p}: <b>{o}/{a}</b></span>)}
        <button className="mini" onClick={() => { setSeed(s => s + 1); setScore({ ok:0, all:0, byPage:{} }); }}>↺ Znovu</button>
      </div>
      <div className="drill">
        <div className="ctx">str. {w.page} · {w.cat}</div>
        <div className="prompt">{w.cz}</div>
        <input className={"blank wide" + (res ? (res === "bad" ? " bad" : " ok") : "")} value={val}
          onChange={e => setVal(e.target.value)} onKeyDown={e => { if (e.key === "Enter") res ? next() : check(); }}
          autoCapitalize="off" autoCorrect="off" spellCheck={false} placeholder="francouzsky (se členem)…" style={{ margin:"0 auto" }} />
        <div className="fbk" style={{ color: res === "bad" ? "var(--bad)" : "var(--ok)" }}>
          {res === "ok" && <>✓ Správně! <Fr t={w.fr} g={w.g} /></>}
          {res === "art" && <>✓ Správně — ale nauč se i člen: <Fr t={w.fr} g={w.g} /></>}
          {res === "bad" && <>✗ Správně: <Fr t={w.fr} g={w.g} /></>}
        </div>
        <div className="gap-actions" style={{ justifyContent:"center" }}>
          <button className="mini" onClick={check}>Zkontrolovat</button>
          <button className="mini red" onClick={next}>Další →</button>
        </div>
      </div>
    </div>
  );
}

const VOCAB_EX = [
  { page:"133", task:"(cv. 1) Où les Français veulent aller en vacances l'été ? 54 % à la ___ · 24 % à la ___ · 12 % à la ___ · 9 % en ___", blanks:[["mer"],["campagne"],["montagne"],["ville"]], rule:"Slova: campagne, ville, mer, montagne.", why:"Nejvíc Francouzů jezdí k moři (54 %), pak na venkov, do hor a nejméně do města (en ville)." },
  { page:"133", task:"(cv. 2a) On dort sous une tente dans cet hébergement. → un ___", blanks:[["camping"]], rule:"tente = stan.", why:"→ un camping." },
  { page:"133", task:"(cv. 2b) On paie pour passer une semaine dans un appartement. → une ___", blanks:[["location"]], rule:"louer = pronajmout.", why:"→ une location." },
  { page:"133", task:"(cv. 2c) C'est une maison avec des animaux à la campagne. → une ___", blanks:[["ferme"]], rule:"zvířata + venkov.", why:"→ une ferme." },
  { page:"133", task:"(cv. 2d) C'est une chambre chez des personnes. → une ___", blanks:[["chambre d'hôtes"]], rule:"chez des personnes = u lidí doma.", why:"→ une chambre d'hôtes." },
  { page:"133", task:"(cv. 2e) On paie une chambre pour une ou plusieurs nuits. → un ___", blanks:[["hôtel"]], rule:"plusieurs nuits = několik nocí.", why:"→ un hôtel." },
  { page:"133", task:"(cv. 3) Je voudrais réserver ___ dans votre hôtel pour ___ le 13 mai et ___ le 16 mai. Est-ce qu'il y a ___ pour les voitures ? Est-ce que le petit déjeuner est ___ ?", blanks:[["une chambre double"],["une arrivée"],["un départ"],["un parking"],["compris"]], rule:"Slova: un départ, compris, une chambre double, un parking, une arrivée.", why:"13. května příjezd, 16. odjezd; parkoviště pro auta; snídaně v ceně." },
  { page:"139", task:"(cv. 2) Associez : 1 (kůň) = un ___ · 2 (králík) = un ___ · 3 (kráva) = une ___ · 4 (pták) = un ___", blanks:[["cheval"],["lapin"],["vache"],["oiseau"]], rule:"Obrázky: 1 kůň, 2 králík, 3 kráva, 4 stehlík.", why:"1-b cheval, 2-a lapin, 3-d vache, 4-c oiseau." },
  { page:"139", task:"(cv. 3a) J'aime nager avec les poissons. → ___", blanks:[["faire de la plongée"]], rule:"plavat s rybami.", why:"→ faire de la plongée." },
  { page:"139", task:"(cv. 3b) J'aime manger dans la nature. → ___", blanks:[["pique-niquer","pique niquer"]], rule:"jíst venku.", why:"→ pique-niquer." },
  { page:"139", task:"(cv. 3c) J'aime me promener en mer. → ___", blanks:[["faire du bateau"]], rule:"po moři.", why:"→ faire du bateau." },
  { page:"147", task:"(cv. 2) Ahmed est ___ . Il est en troisième année de ___ . Il a de bonnes ___ . Il va avoir son ___ à la fin de l'année.", blanks:[["étudiant"],["licence"],["notes"],["diplôme"]], rule:"Slova: licence, étudiant, diplôme, notes.", why:"Ahmed je student 3. ročníku bakaláře, má dobré známky, na konci roku dostane diplom." },
];

function VocabTab() {
  const [page, setPage] = useState("all");
  const [mode, setMode] = useState("list");
  const [q, setQ] = useState("");
  const pages = VOCAB.filter(p => page === "all" || p.page === page);
  const match = it => !q || strip(it.fr + " " + it.cz).includes(strip(q));

  return (
    <div>
      <SectionHead no="Partie III" title="Slovíčka — str. 133, 139, 147"
        lede={ALL_WORDS.length + " výrazů ze tří slovníčků učebnice. Barva členu ukazuje rod (le / la / les). Nejdřív si projdi seznam, pak kartičky, nakonec psaní bez nápovědy."} />
      <div className="modes">
        <button className={"mode" + (page === "all" ? " on" : "")} onClick={() => setPage("all")}>Všechny stránky</button>
        {VOCAB.map(p => <button key={p.page} className={"mode" + (page === p.page ? " on" : "")} onClick={() => setPage(p.page)}>str. {p.page} · {p.title}</button>)}
      </div>
      <div className="modes">
        {[["list","📖 Seznam"],["cards","🃏 Kartičky"],["write","✍️ Psaní CZ → FR"],["ex","📘 Cvičení z učebnice"]].map(([k, l]) =>
          <button key={k} className={"mode" + (mode === k ? " on" : "")} onClick={() => setMode(k)}>{l}</button>)}
      </div>

      {mode === "list" && (
        <>
          <input className="search" placeholder="Hledat francouzsky nebo česky…" value={q} onChange={e => setQ(e.target.value)} />
          {pages.map(p => (
            <div key={p.page} className="card">
              <h3>{p.title} <span style={{ fontSize:"14px", color:"var(--muted)", fontFamily:"Montserrat" }}>· {p.sub}</span></h3>
              {p.groups.map(g => {
                const items = g.items.filter(match);
                if (!items.length) return null;
                return (
                  <div key={g.cat}>
                    <div className="cat">{g.cat}</div>
                    <div className="vgrid">{items.map(it => <VocabRow key={it.fr} it={it} />)}</div>
                  </div>
                );
              })}
              {p.page === "147" && <div className="note">V učebnici je u <i>l'informatique</i> chybně „(m.)“ — správně je <b>ženský rod</b>: <i>l'informatique est intéressante</i>.</div>}
            </div>
          ))}
        </>
      )}
      {mode === "cards" && <Flashcards page={page} />}
      {mode === "write" && <WriteDrill page={page} />}
      {mode === "ex" && VOCAB_EX.filter(e => page === "all" || e.page === page).map((it, i) =>
        <GapItem key={it.page + it.task} it={{ ...it, diff:"b", hint:"učebnice str. " + it.page }} n={i + 1} />)}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   IV) GRAMATIKA — modré boxy str. 137, 138, 145, 146
   ═══════════════════════════════════════════════════════════════════ */

function GramTheory({ id }) {
  if (id === "pc") return (
    <>
      <BlueBox title="Le passé composé avec être">
        Au passé composé, quelques verbes se conjuguent avec l'auxiliaire <b>être</b>.<br />
        <i>Exemples : il <b>est né</b>, il <b>est arrivé</b></i><br />
        Avec l'auxiliaire <b>être</b>, le participe passé s'accorde en genre et en nombre avec le sujet.<br />
        <i>Exemples : il <b>est sorti</b>, elle <b>est sortie</b>, ils <b>sont sortis</b>, elles <b>sont sorties</b></i>
      </BlueBox>
      <div className="rule">Česky: některá slovesa (hlavně <b>pohyb</b> a <b>změna stavu</b>) mají v minulém čase pomocné sloveso <b>être</b> místo avoir. Příčestí se pak <b>shoduje s podmětem</b> jako přídavné jméno: ženský rod <span className="red-e">+e</span>, množné číslo <span className="red-e">+s</span>.</div>
      <div className="grid2">
        <BlueBox title="Aller">
          <div className="mono" style={{ lineHeight:1.9 }}>
            Je <b>suis allé</b><span className="red-e">(e)</span><br />
            Tu <b>es allé</b><span className="red-e">(e)</span><br />
            Il/Elle <b>est allé</b><span className="red-e">(e)</span><br />
            Nous <b>sommes allé</b><span className="red-e">(e)s</span><br />
            Vous <b>êtes allé</b><span className="red-e">(e)s</span><br />
            Ils/Elles <b>sont allé</b><span className="red-e">(e)s</span>
          </div>
        </BlueBox>
        <div>
          <h4 style={{ margin:"14px 0 6px", color:"var(--bleu)" }}>Slovesa s être</h4>
          <div className="tblwrap">
            <table className="tbl">
              <tbody>
                <tr><td>aller → allé</td><td>venir → venu</td></tr>
                <tr><td>arriver → arrivé</td><td>partir → parti</td></tr>
                <tr><td>entrer → entré</td><td>sortir → sorti</td></tr>
                <tr><td>monter → monté</td><td>descendre → descendu</td></tr>
                <tr><td>naître → <b>né</b></td><td>mourir → <b>mort</b></td></tr>
                <tr><td>rester → resté</td><td>tomber → tombé</td></tr>
                <tr><td>rentrer → rentré</td><td>revenir → revenu</td></tr>
                <tr><td>retourner → retourné</td><td>+ všechna zvratná (se baigner…)</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="ex">
        <div>a. Il <u>est parti</u> à Paris. <span className="cz">(on → bez koncovky)</span></div>
        <div>b. Il <u>est revenu</u> dans cette région à 30 ans.</div>
        <div>c. Tu <u>es rentrée</u> de Martinique ? <span className="cz">(tu = žena → +e)</span></div>
        <div>d. Nous <u>sommes allées</u> dans le sud de l'île. <span className="cz">(nous = samé ženy → +es)</span></div>
      </div>
      <div className="note">Ostatní slovesa mají <b>avoir</b> a <b>nemění se</b>: j'ai visité, elle a pris, nous avons mangé. Ve smíšené skupině (muži + ženy) platí mužský tvar: <i>Paul et Marie sont partis.</i></div>
    </>
  );
  if (id === "imp") return (
    <>
      <BlueBox title="Les verbes impersonnels à l'imparfait">
        Pour faire une description au passé, on utilise <b>l'imparfait</b>.
        <table className="tbl" style={{ marginBottom:0 }}>
          <thead><tr><th></th><th>Au présent</th><th>À l'imparfait</th></tr></thead>
          <tbody>
            <tr><td><b>Être</b></td><td>c'est</td><td><b>c'était</b></td></tr>
            <tr><td><b>Avoir</b></td><td>il y a</td><td><b>il y avait</b></td></tr>
            <tr><td><b>Faire</b></td><td>il fait</td><td><b>il faisait</b></td></tr>
          </tbody>
        </table>
      </BlueBox>
      <div className="rule">Česky: když v minulosti <b>popisuješ</b> (počasí, jaké to bylo, co tam bylo), použij imparfait. Když říkáš, co se <b>stalo</b> (jednorázová akce), použij passé composé.</div>
      <div className="ex">
        <div>Hier, il ne <u>faisait</u> pas beau. Il y <u>avait</u> des nuages. <span className="cz">(popis → imparfait)</span></div>
        <div>Alors, j'<u>ai visité</u> le Mucem. <span className="cz">(akce → passé composé)</span></div>
        <div><u>C'était</u> très intéressant ! <span className="cz">(hodnocení → imparfait)</span></div>
      </div>
      <div className="tblwrap">
        <table className="tbl">
          <thead><tr><th>Počasí dnes</th><th>Počasí včera</th></tr></thead>
          <tbody>
            <tr><td>il fait beau / mauvais / chaud / froid</td><td>il faisait beau / mauvais / chaud / froid</td></tr>
            <tr><td>il y a du soleil / des nuages / du vent</td><td>il y avait du soleil / des nuages / du vent</td></tr>
            <tr><td>c'est génial / calme / animé</td><td>c'était génial / calme / animé</td></tr>
          </tbody>
        </table>
      </div>
    </>
  );
  if (id === "cod") return (
    <>
      <div className="grid2">
        <BlueBox title="Les pronoms COD (1re et 2e personnes)">
          Les pronoms COD <b>me</b>, <b>te</b>, <b>nous</b>, <b>vous</b> remplacent des personnes. Ils sont placés <b>avant</b> le verbe.<br />
          <i>Exemple : Tu <b>m'</b>aides à faire cet exercice ?</i><br />
          <span style={{ color:"var(--rouge)", fontWeight:700 }}>Remarque :</span> Devant une voyelle ou un h muet, <b>me</b>, <b>te</b> → <b>m'</b>, <b>t'</b>.
        </BlueBox>
        <BlueBox title="Přehled COD (str. 145 + COD (1))">
          <table className="tbl" style={{ margin:0 }}>
            <tbody>
              <tr><td>mě</td><td><b>me (m')</b></td><td>nás</td><td><b>nous</b></td></tr>
              <tr><td>tě</td><td><b>te (t')</b></td><td>vás</td><td><b>vous</b></td></tr>
              <tr><td>ho / to</td><td><b className="g-m">le (l')</b></td><td>je</td><td><b>les</b></td></tr>
              <tr><td>ji / to</td><td><b className="g-f">la (l')</b></td><td></td><td></td></tr>
            </tbody>
          </table>
        </BlueBox>
      </div>
      <div className="ex">
        <div>a. Le droit <u>m'</u>intéresse. <span className="cz">Právo mě zajímá.</span></div>
        <div>b. Je <u>te</u> comprends. <span className="cz">Rozumím ti.</span></div>
        <div>c. Les futurs étudiants <u>nous</u> interrogent sur beaucoup de sujets.</div>
        <div>d. Ils <u>vous</u> écoutent.</div>
        <div>Zápor: Je <u>ne</u> vous comprends <u>pas</u>. · Je <u>ne</u> la connais <u>pas</u>.</div>
      </div>
      <div className="note">Pozor na češtinu: „rozumím TI“ / „poslouchám TĚ“ — ve francouzštině je to vždy COD (comprendre qqn, écouter qqn, regarder qqn, aider qqn) → <b>te</b>.</div>
    </>
  );
  return (
    <>
      <BlueBox title="La durée, la continuation">
        • Pour donner la <b>durée</b> d'une action, on utilise :<br />
        – <b>pendant</b> + nom (durée limitée). <i>Exemple : Je vais partir aux États-Unis <b>pendant</b> deux ans.</i><br />
        – verbe + <b>longtemps</b> (durée longue). <i>Exemple : Les études de droit durent <b>longtemps</b>.</i><br />
        • L'action a commencé dans le passé et <b>continue dans le présent</b>, on utilise :<br />
        – verbe au présent + <b>toujours</b>. <i>Exemple : Je n'ai pas fini mon master, je suis <b>toujours</b> à l'université.</i>
      </BlueBox>
      <div className="timeline">
        <div><div className="h">longtemps</div><div className="arrow"><i style={{ left:0, width:"88%" }} /></div>dlouho — <b>za slovesem</b>, bez podstatného jména<div className="mono" style={{ fontSize:"14px", marginTop:"4px" }}>La césure dure longtemps ?</div></div>
        <div><div className="h">pendant</div><div className="arrow"><i style={{ left:"20%", width:"45%" }} /></div>po dobu (omezenou) — <b>+ podstatné jméno</b><div className="mono" style={{ fontSize:"14px", marginTop:"4px" }}>pendant les études, pendant deux ans</div></div>
        <div><div className="h">toujours</div><div className="arrow"><i style={{ left:"10%", width:"80%" }} /></div>pořád ještě — <b>přítomný čas</b>, děj trvá<div className="mono" style={{ fontSize:"14px", marginTop:"4px" }}>Nous avons toujours le statut étudiant.</div></div>
      </div>
      <div className="note">Rychlé rozhodnutí: je za mezerou <b>číslo / podstatné jméno</b> (deux ans, les vacances)? → <b>pendant</b>. Konec věty po slovese? → <b>longtemps</b>. Děj <b>pořád trvá</b> (je suis…, il est…)? → <b>toujours</b>.</div>
    </>
  );
}

function GramTab() {
  return (
    <div>
      <SectionHead no="Partie IV" title="Gramatika — modré boxy"
        lede="Přesně čtyři boxy, které profesor uvedl: str. 137, 138, 145 a 146. U každého je text boxu z učebnice, české vysvětlení, cvičení z učebnice (📘) a další procvičení. Řešení jsou vždy schovaná." />
      {GRAM.map((g, gi) => (
        <Acc key={g.id} title={(gi + 1) + " · " + g.title} badge={"str. " + g.page} defaultOpen={gi === 0}>
          <GramTheory id={g.id} />
          <h4 style={{ margin:"20px 0 10px", color:"var(--rouge)" }}>Procvičování</h4>
          {g.gaps.map((it, i) => <GapItem key={i} it={it} n={i + 1} />)}
        </Acc>
      ))}
      <Acc title="Bonus · Předložky místa (k popisu obrazu)" badge="banque · str. 13–14">
        <BlueBox title="Les prépositions de lieu">
          <div className="tblwrap">
            <table className="tbl" style={{ margin:0 }}>
              <tbody>
                <tr><td><b>à gauche (de)</b> — vlevo (od)</td><td><b>à droite (de)</b> — vpravo (od)</td></tr>
                <tr><td><b>sur</b> — na</td><td><b>sous</b> — pod</td></tr>
                <tr><td><b>devant</b> — před</td><td><b>derrière</b> — za</td></tr>
                <tr><td><b>à côté (de)</b> — vedle</td><td><b>en face (de)</b> — naproti</td></tr>
                <tr><td><b>entre</b> — mezi</td><td></td></tr>
              </tbody>
            </table>
          </div>
          <div style={{ marginTop:"8px" }}><b style={{ color:"var(--rouge)" }}>Rappel :</b> de + le = <b>du</b>, de + les = <b>des</b> → à droite <b>du</b> canapé, à côté <b>des</b> fenêtres.</div>
        </BlueBox>
        <p>Při popisu obrazu: <i>Devant la maison, il y a une rivière. Derrière les arbres, on voit la montagne. À gauche du chemin, il y a des fleurs.</i></p>
      </Acc>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   V) PSANÍ — popis obrazu + pohlednice
   ═══════════════════════════════════════════════════════════════════ */

function EcritTab() {
  const [part, setPart] = useState("tableau");
  return (
    <div>
      <SectionHead no="Partie V" title="Psaní — obraz a pohlednice"
        lede="Část 4 testu. Inspirace ze str. 136 (Visitez la France avec ses peintres) a 138 (Bonjour de Marseille). Napiš si každý text aspoň jednou celý — automatická kontrola ti řekne, jestli máš všechny povinné obraty." />
      <div className="modes">
        <button className={"mode" + (part === "tableau" ? " on" : "")} onClick={() => setPart("tableau")}>🖼️ Popis obrazu</button>
        <button className={"mode" + (part === "lettre" ? " on" : "")} onClick={() => setPart("lettre")}>✉️ Pohlednice z prázdnin</button>
      </div>

      {part === "tableau" && (
        <>
          <PourBox title="décrire un paysage (str. 136)">
            <ul style={{ margin:"4px 0" }}>
              <li>Il y a une rivière, des maisons et de l'herbe verte.</li>
              <li>On voit des arbres, des champs et la montagne.</li>
              <li>C'est très joli !</li>
              <li>C'est un lac.</li>
            </ul>
          </PourBox>
          <h3 className="sub-h">Struktura popisu</h3>
          <ol className="steps">
            <li><b>Co a kdo</b><span className="fr">Voici « La rivière », un tableau de Raoul Dufy, un peintre français.</span></li>
            <li><b>Kde to je / celkový dojem</b><span className="fr">Sur ce tableau, on voit un paysage de campagne / la mer / une région de France.</span></li>
            <li><b>Co tam je</b> (il y a / on voit + slovíčka ze str. 139)<span className="fr">Il y a une rivière, des arbres et des champs. On voit deux canards.</span></li>
            <li><b>Kde přesně</b> (předložky místa)<span className="fr">Devant la maison, il y a… · Derrière les arbres, on voit… · À gauche, il y a…</span></li>
            <li><b>Barvy</b> (shoda přídavného jména!)<span className="fr">Le ciel est bleu, l'herbe est verte, les fleurs sont rouges.</span></li>
            <li><b>Tvůj názor</b><span className="fr">C'est très joli ! · C'est un endroit parfait pour la randonnée / pour se promener. · J'aime les couleurs.</span></li>
          </ol>
          <Acc title="Čtyři texty z učebnice (str. 136) — vzor stylu" badge="4 malíři">
            {PEINTRES.map(p => (
              <div key={p.who} className="painting">
                <div className="reg">{p.reg}</div>
                <div className="who">{p.who}</div>
                <p style={{ margin:"4px 0" }}>{p.fr}</p>
                <p style={{ margin:"4px 0", fontSize:"14px", color:"var(--muted)" }}>{p.cz}</p>
              </div>
            ))}
            <div className="note">Všimni si: v textech je hodně <b>passé composé s être</b> (il est né, il est allé, il est revenu, il est parti, il est retourné, il est mort) — přesně gramatika ze str. 137!</div>
          </Acc>
          <Acc title="Otázky k textu ze str. 136 (cv. 2–4)" badge="řešení skryté">
            <GapItem showDiff={false} it={{ task:"(2) Que propose ce document ? a. Une exposition de peinture. b. La découverte des régions de peintres célèbres. c. Des livres sur des peintres. → ___", blanks:[["b"]], rule:"Titulek: Visitez la France avec ses peintres.", why:"Dokument představuje regiony, které malovali slavní malíři." }} />
            <GapItem showDiff={false} it={{ task:"(3) Qui a peint la Provence ? ___ · la Normandie ? ___ · la région parisienne ? ___ · la Franche-Comté ? ___", blanks:[["Cézanne","Paul Cézanne"],["Monet","Claude Monet"],["Morisot","Berthe Morisot"],["Courbet","Gustave Courbet"]], rule:"Viz nadpisy čtyř textů.", why:"" }} />
            <GapItem showDiff={false} it={{ task:"(4) Dans quelle région on peut aller pour marcher dans la montagne ? en ___ · pour voir la mer ? en ___", blanks:[["Provence"],["Normandie"]], rule:"Cézanne: parfait pour la randonnée · Monet: la plage et la mer.", why:"" }} />
          </Acc>
          <WritingTask t={TABLEAU_TASK} />
        </>
      )}

      {part === "lettre" && (
        <>
          <h3 className="sub-h" style={{ marginTop:"6px" }}>Vzor z učebnice — pohlednice od Carole (str. 138)</h3>
          <div className="postcard">
            <div>
              <p>Salut Mehdi !</p>
              <p>Je suis en vacances chez des amis à Marseille. C'est génial ! Je vais à la plage, je me baigne dans les Calanques et je bronze !</p>
              <p>Hier, il ne faisait pas beau. Il y avait des nuages. Ce n'est pas normal à Marseille ! Alors, j'ai visité le Mucem. C'était très intéressant !</p>
              <p>Aujourd'hui, j'ai pris le bateau. J'ai visité le château d'If. Tu sais, c'est la prison du « Comte de Monte-Cristo », le roman d'Alexandre Dumas.</p>
            </div>
            <div>
              <p>Il se trouve sur une île à 4 kilomètres de Marseille.</p>
              <p>Et demain, je vais faire une randonnée à cheval avec mes amis pour découvrir la Provence. On va pique-niquer, je suis très contente !</p>
              <p>À bientôt,</p>
              <p>Carole</p>
            </div>
          </div>
          <PourBox title="écrire une carte postale (str. 138)">
            <div className="grid2">
              <div><b>Pour commencer :</b><ul style={{ margin:"4px 0" }}><li>Salut / Bonjour</li><li>Cher (+ prénom masculin) / Chère (+ prénom féminin)</li></ul></div>
              <div><b>Pour finir :</b><ul style={{ margin:"4px 0" }}><li>À bientôt !</li><li>Bisous / Je t'embrasse</li></ul></div>
            </div>
          </PourBox>
          <h3 className="sub-h">Kostra pohlednice — 3 časy</h3>
          <ol className="steps">
            <li><b>Pozdrav</b><span className="fr">Salut Tom ! / Chère Léa,</span></li>
            <li><b>Kde jsi teď — présent</b><span className="fr">Je suis en vacances en Italie / au Japon / à Marseille. C'est génial !</span></li>
            <li><b>Co děláš každý den — présent</b><span className="fr">Je vais à la plage, je me baigne et je bronze.</span></li>
            <li><b>Včera — imparfait (popis) + passé composé (akce)</b><span className="fr">Hier, il faisait beau / il y avait des nuages. Je suis allé(e) au musée. J'ai visité… C'était super !</span></li>
            <li><b>Zítra — futur proche</b><span className="fr">Demain, je vais faire une randonnée. On va pique-niquer.</span></li>
            <li><b>Rozloučení</b><span className="fr">À bientôt ! Bisous, …</span></li>
          </ol>
          <Acc title="Otázky k pohlednici (str. 138, cv. 2–5)" badge="řešení skryté">
            <GapItem showDiff={false} it={{ task:"(2) Qui écrit ? ___ · À qui ? ___", blanks:[["Carole"],["Mehdi","à Mehdi"]], rule:"Podpis a oslovení.", why:"" }} />
            <GapItem showDiff={false} it={{ task:"(3) Où Carole passe ses vacances ? À ___ , chez des amis.", blanks:[["Marseille"]], rule:"Je suis en vacances chez des amis à Marseille.", why:"" }} />
            <GapItem showDiff={false} it={{ task:"(5) Pourquoi Carole a visité le Mucem ? Parce qu'il ___ beau.", blanks:[["ne faisait pas"]], rule:"Hier, il ne faisait pas beau. Il y avait des nuages.", why:"Kvůli špatnému počasí šla místo pláže do muzea." }} />
            <div className="gap">
              <b>(4) Tous les jours / hier / demain:</b>
              <RevealBlock>
                <ul>
                  <li><b>Tous les jours (présent):</b> elle va à la plage, elle se baigne dans les Calanques, elle bronze.</li>
                  <li><b>Hier (imparfait + PC):</b> il ne faisait pas beau, il y avait des nuages → elle a visité le Mucem; c'était très intéressant.</li>
                  <li><b>Aujourd'hui (PC):</b> elle a pris le bateau, elle a visité le château d'If.</li>
                  <li><b>Demain (futur proche):</b> elle va faire une randonnée à cheval; on va pique-niquer.</li>
                </ul>
              </RevealBlock>
            </div>
          </Acc>
          <WritingTask t={CARTE_TASK} />
        </>
      )}
    </div>
  );
}

function RevealBlock({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="gap-actions"><button className="mini red" onClick={() => setOpen(o => !o)}>{open ? "Skrýt řešení" : "Ukázat řešení"}</button></div>
      {open && <div className="sol">{children}</div>}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   VI) LIST OD PROFESORA
   ═══════════════════════════════════════════════════════════════════ */

function FicheTab() {
  return (
    <div>
      <SectionHead no="Partie VI" title="List od profesora (Révision)"
        lede="Všechna cvičení z dokumentu „3ABC_R7A – Révision“ — jak ta, co už máš vyplněná, tak ta zbývající. Napiš odpověď, dej Zkontrolovat; řešení s vysvětlením je schované." />
      <div className="card red">
        <h3>✍️ Kontrola tvých vyplněných odpovědí</h3>
        <p className="lede">Většina je správně. Tady jsou místa, kde bych to opravil nebo vylepšil:</p>
        <ul>
          <li><b>Ex. 2/1</b> — napsal jsi „un / du café“: v cvičení na dělivé členy se čeká <b>du café</b> (un café = jeden šálek, to by šlo jen při objednávání).</li>
          <li><b>Ex. 4/1</b> — „un imperméable“ je <b>pláštěnka do deště</b>. Na sníh a mráz: <i>un manteau, un bonnet, une écharpe, des gants, des bottes</i> (bottes máš dobře).</li>
          <li><b>Ex. 7/1</b> — „Oui, je veux“ → správně <b>„Oui, je veux bien !“</b> nebo „Avec plaisir !“, „D'accord !“.</li>
          <li><b>Ex. 7/2</b> — „Non, je ne peux pas, désolé, je dois travailler“ ✓ (žena by psala désolée).</li>
          <li><b>Révision 13–23 / 1</b> — „Il faut“ vyjadřuje <b>povinnost</b>, ne zdvořilou žádost; pro žádost použij <b>Merci de / Prière de</b>. Zákaz: Interdiction de / Il est interdit de / Défense de / Ne pas.</li>
          <li><b>Révision 13–23 / 3</b> — v listu se jmenují „pronoms démonstratifs“, ale <i>ce, cet, cette, ces</i> + podstatné jméno jsou <b>přídavná jména</b> ukazovací. Odpovědi máš správně.</li>
          <li><b>Chybí doplnit:</b> Ex. 8 (cesta), Ex. 9/3–5 (překlady), Révision 13–23 / 4 (země) a tři slohové úkoly — všechno je níže.</li>
        </ul>
      </div>

      <h3 className="sub-h">Récapitulation de l'année dernière</h3>
      {FICHE.filter(s => s.id.startsWith("r")).map(s => (
        <Acc key={s.id} title={s.title} badge={s.items.length + " úloh"} defaultOpen={s.id === "r9"}>
          {s.note && <p className="lede">{s.note}</p>}
          {s.items.map((it, i) => <GapItem key={i} it={it} n={i + 1} showDiff={false} />)}
        </Acc>
      ))}
      <WritingTask t={FICHE_WRITING[0]} />

      <h3 className="sub-h">Révision semaines 13–23</h3>
      {FICHE.filter(s => s.id.startsWith("s")).map(s => (
        <Acc key={s.id} title={s.title} badge={s.items.length + " úloh"} defaultOpen={s.id === "s4"}>
          {s.note && <p className="lede">{s.note}</p>}
          {s.items.map((it, i) => <GapItem key={i} it={it} n={i + 1} showDiff={false} />)}
        </Acc>
      ))}

      <h3 className="sub-h">Partie 2 : Exercices créatifs</h3>
      {FICHE_WRITING.slice(1).map(t => <WritingTask key={t.title} t={t} />)}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   VII) KVÍZ (engine z assets/quiz-engine.jsx, restylovaný do Affiche)
   ═══════════════════════════════════════════════════════════════════ */

function QuizEngine({ questions, accentColor = "#1b3a8f" }) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState({});
  const [pendingMulti, setPendingMulti] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [shuffleKey, setShuffleKey] = useState(0);

  const qs = useMemo(() => shuffleQuestions(questions), [questions, shuffleKey]);
  const q = qs[idx];
  const isMulti = q.type === "multi";
  const isRevealed = !!revealed[idx];
  const myAnswer = answers[idx] || [];
  const isCorrect = isRevealed && arrEqual(myAnswer, q.correct);
  const score = qs.filter((qq, i) => revealed[i] && arrEqual(answers[i] || [], qq.correct)).length;
  const pct = Math.round((score / qs.length) * 100);

  const goTo = useCallback((i) => {
    setIdx(i);
    setPendingMulti(qs[i].type === "multi" ? (answers[i] || []) : []);
  }, [answers, qs]);

  const single = useCallback((o) => {
    if (isRevealed) return;
    setAnswers(p => ({ ...p, [idx]: [o] }));
    setRevealed(p => ({ ...p, [idx]: true }));
  }, [idx, isRevealed]);

  const toggleMulti = useCallback((o) => {
    if (isRevealed) return;
    setPendingMulti(p => p.includes(o) ? p.filter(i => i !== o) : [...p, o]);
  }, [isRevealed]);

  const submitMulti = useCallback(() => {
    if (!pendingMulti.length) return;
    setAnswers(p => ({ ...p, [idx]: [...pendingMulti] }));
    setRevealed(p => ({ ...p, [idx]: true }));
  }, [idx, pendingMulti]);

  const restart = useCallback(() => {
    setIdx(0); setAnswers({}); setRevealed({}); setPendingMulti([]);
    setShowResults(false); setShuffleKey(k => k + 1);
  }, []);

  if (showResults) {
    const msg = pct >= 90 ? "Výborně! Na pátek jsi připravený."
      : pct >= 70 ? "Dobře! Skoro všechno ti sedí."
      : pct >= 50 ? "Mohlo by to být lepší, ale jdeš správným směrem."
      : "Ještě opakuj — projdi gramatiku a země a zkus to znovu.";
    return (
      <div className="card">
        <div className="results">
          <div className="score">{score} / {qs.length}</div>
          <div className="pct">{pct} %</div>
          <div className="msg">{msg}</div>
          <button className="btn red" onClick={restart}>Začít znovu</button>
        </div>
      </div>
    );
  }

  const activeSet = isMulti ? (isRevealed ? myAnswer : pendingMulti) : myAnswer;

  return (
    <div>
      <div className="dotbar">
        {qs.map((qq, i) => {
          let bg = "#e2dacb";
          if (i === idx) bg = accentColor;
          else if (revealed[i]) bg = arrEqual(answers[i] || [], qq.correct) ? "var(--ok)" : "var(--bad)";
          return <div key={i} className="dot" style={{ background: bg }} onClick={() => goTo(i)} title={"Otázka " + (i + 1)} />;
        })}
      </div>
      <div className="card">
        <div className="qnum">Otázka {idx + 1} / {qs.length}{isMulti ? " · více správných odpovědí" : ""}</div>
        <div className="qtext">{q.question}</div>
        {q.options.map((opt, i) => {
          let border = "1px solid var(--line)", bg = "#fff";
          if (isRevealed) {
            if (q.correct.includes(i)) { bg = "#eef7f1"; border = "2px solid var(--ok)"; }
            else if (activeSet.includes(i)) { bg = "#fbeeee"; border = "2px solid var(--bad)"; }
          } else if (activeSet.includes(i)) { bg = "#eef1fa"; border = "2px solid " + accentColor; }
          return (
            <div key={i} className="opt" style={{ background: bg, border }} onClick={() => isMulti ? toggleMulti(i) : single(i)}>
              {isMulti && <span style={{ fontSize:"18px" }}>{activeSet.includes(i) ? "☑" : "☐"}</span>}
              <span>{opt}</span>
            </div>
          );
        })}
        {isMulti && !isRevealed && (
          <button className="btn" style={{ marginTop:"8px" }} onClick={submitMulti} disabled={!pendingMulti.length}>Potvrdit</button>
        )}
        {isRevealed && (
          <div className="fb" style={{ borderColor: isCorrect ? "var(--ok)" : "var(--bad)" }}>
            <div className="h" style={{ color: isCorrect ? "var(--ok)" : "var(--bad)" }}>{isCorrect ? "Správně !" : "Špatně"}</div>
            {!isCorrect && <div className="corr">Správná odpověď: {q.correct.map(i => q.options[i]).join(" · ")}</div>}
            <div className="exp">{q.explanation}</div>
            {q.tip && <div className="tip">Tip: {q.tip}</div>}
          </div>
        )}
        <div className="navrow">
          <button className="btn" onClick={() => goTo(idx - 1)} disabled={idx === 0}>← Předchozí</button>
          {idx < qs.length - 1
            ? <button className="btn" onClick={() => goTo(idx + 1)}>Další →</button>
            : <button className="btn red" onClick={() => setShowResults(true)}>Výsledky →</button>}
        </div>
      </div>
    </div>
  );
}

function QuizTab() {
  return (
    <div>
      <SectionHead no="Partie VII" title="Kvíz"
        lede={QUIZ.length + " otázek přes všechny čtyři části testu, pořadí odpovědí se pokaždé zamíchá. U otázek s ☐ je víc správných možností — vyber všechny a potvrď."} />
      <QuizEngine questions={QUIZ} accentColor="#1b3a8f" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   VIII) TAHÁK
   ═══════════════════════════════════════════════════════════════════ */

function CheatTab() {
  return (
    <div>
      <SectionHead no="Partie VIII" title="Tahák — naučit nazpaměť"
        lede="Celý test na jedné stránce. Projdi ho dnes večer a v pátek ráno." />
      <div className="cheat">
        <div>
          <h4>🌍 Země — kde / kam</h4>
          <div className="mono">à + město · à Paris</div>
          <div className="mono">en + f. / samohl. · en France, en Italie</div>
          <div className="mono">au + m. · au Japon, au Maroc</div>
          <div className="mono">aux + pl. · aux États-Unis</div>
        </div>
        <div>
          <h4>🌍 Země — odkud (str. 132)</h4>
          <div className="mono">de / d' + město · de Berlin, d'Amsterdam</div>
          <div className="mono">de / d' + f. · de Chine, d'Irlande</div>
          <div className="mono">du / d' + m. · du Maroc, d'Irak</div>
          <div className="mono">des + pl. · des Pays-Bas</div>
        </div>
        <div>
          <h4>Národnosti</h4>
          <div className="mono">+e: français → française</div>
          <div className="mono">-ien → -ienne: italienne, égyptienne</div>
          <div className="mono">-éen → -éenne: coréenne</div>
          <div className="mono">beze změny: belge, suisse, russe, tchèque</div>
          <div style={{ fontSize:"14px", marginTop:"4px" }}>Pays-Bas → néerlandais · Côte d'Ivoire → ivoirien · Liechtenstein → liechtensteinois</div>
        </div>
        <div>
          <h4>Passé composé s être (str. 137)</h4>
          <div className="mono">je suis allé(e) · nous sommes allé(e)s</div>
          <div className="mono">elle est partie · ils sont rentrés</div>
          <div style={{ fontSize:"14px", marginTop:"4px" }}>aller, venir, arriver, partir, entrer, sortir, monter, descendre, naître (né), mourir (mort), rester, tomber, rentrer, revenir, retourner + zvratná</div>
        </div>
        <div>
          <h4>Imparfait — popis (str. 138)</h4>
          <div className="mono">c'est → c'était</div>
          <div className="mono">il y a → il y avait</div>
          <div className="mono">il fait → il faisait</div>
          <div style={{ fontSize:"14px", marginTop:"4px" }}>popis = imparfait · akce = passé composé</div>
        </div>
        <div>
          <h4>COD (str. 145)</h4>
          <div className="mono">me (m') · te (t') · nous · vous</div>
          <div className="mono"><span className="g-m">le</span> · <span className="g-f">la</span> · l' · les</div>
          <div className="mono">Tu m'aides ? · Je ne vous comprends pas.</div>
        </div>
        <div>
          <h4>Trvání (str. 146)</h4>
          <div className="mono">pendant + nom · pendant deux ans</div>
          <div className="mono">verbe + longtemps · ça dure longtemps</div>
          <div className="mono">présent + toujours · je suis toujours là</div>
        </div>
        <div>
          <h4>Popis obrazu (str. 136)</h4>
          <div className="mono">Sur ce tableau, il y a… / on voit…</div>
          <div className="mono">devant, derrière, à gauche, à droite, entre, sur, sous, à côté de</div>
          <div className="mono">C'est très joli ! C'est un endroit parfait pour…</div>
        </div>
        <div>
          <h4>Pohlednice (str. 138)</h4>
          <div className="mono">Salut / Cher Paul / Chère Léa</div>
          <div className="mono">Je suis en vacances à… C'est génial !</div>
          <div className="mono">Hier, il faisait… J'ai visité… Je suis allé(e)…</div>
          <div className="mono">Demain, je vais + inf.</div>
          <div className="mono">À bientôt ! Bisous / Je t'embrasse</div>
        </div>
        <div>
          <h4>Str. 133 — Les vacances</h4>
          <div style={{ fontSize:"14px" }}>campagne, île, mer, montagne, village · camping, chambre d'hôtes, échange d'appartements, ferme, hôtel, location, tente · l'arrivée ≠ le départ, chambre simple/double/familiale, lit bébé, parking, petit déjeuner compris, animaux acceptés · avion, van, voiture · se baigner, bronzer, faire de la randonnée, faire du surf, goûter la cuisine locale, prendre des photos</div>
        </div>
        <div>
          <h4>Str. 139 — La nature</h4>
          <div style={{ fontSize:"14px" }}>champ, chemin, forêt, lac, plage, rivière · arbre, fleur, herbe, plante · canard, chat, cheval, chien, lapin, oiseau, poisson, <span className="g-f">poule</span>, <span className="g-f">vache</span> · faire du bateau, faire de la plongée, pique-niquer</div>
        </div>
        <div>
          <h4>Str. 147 — L'université</h4>
          <div style={{ fontSize:"14px" }}>amphi, bibliothèque, logement étudiant, resto U, salle de cours, secrétariat · cours, diplôme (licence, master, doctorat), enseignant, professeur, études, étudiant, étudier, faire des études, faire un stage, s'inscrire, formation, note · commerce, droit, économie, informatique, langues, lettres, mathématiques, sciences</div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   APP
   ═══════════════════════════════════════════════════════════════════ */

const TABS = [
  { id:"plan", rn:"I", label:"🎯 Co bude v testu", comp:PlanTab },
  { id:"pays", rn:"II", label:"🌍 Země a národnosti", comp:PaysTab },
  { id:"vocab", rn:"III", label:"📚 Slovíčka", comp:VocabTab },
  { id:"gram", rn:"IV", label:"📐 Gramatika", comp:GramTab },
  { id:"ecrit", rn:"V", label:"🖼️ Obraz a pohlednice", comp:EcritTab },
  { id:"fiche", rn:"VI", label:"📄 List od profesora", comp:FicheTab },
  { id:"quiz", rn:"VII", label:"✅ Kvíz", comp:QuizTab },
  { id:"cheat", rn:"VIII", label:"📋 Tahák", comp:CheatTab },
];

export default function App() {
  const [tab, setTab] = useState("plan");
  const Active = TABS.find(t => t.id === tab).comp;
  const go = id => { setTab(id); window.scrollTo({ top:0, behavior:"smooth" }); };

  return (
    <div className="root">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet" />
      <style>{CSS}</style>
      <div className="tricolore" />
      <div className="shell">
        <header className="affiche">
          <div className="affiche-in">
            <div>
              <div className="kicker">3ABC · R7A · Édito A1, unités 9–10</div>
              <h1>Le dernier test <em>de révision</em></h1>
              <div className="sub">Pays et nationalités · vocabulaire p. 133, 139, 147 · grammaire p. 137, 138, 145, 146 · description d'un tableau · lettre de vacances</div>
            </div>
            <div className="ticket">
              <div className="l"><div className="m">Vendredi</div><div className="d">23</div><div className="m">octobre</div></div>
              <div className="r"><div className="a">Test</div><div className="b">4 parties<br />+ fiche de révision</div></div>
            </div>
          </div>
        </header>
        <div className="layout">
          <nav className="registre">
            <div className="cap">Sommaire</div>
            {TABS.map(t => (
              <button key={t.id} className={"reg-btn" + (tab === t.id ? " on" : "")} onClick={() => go(t.id)}>
                <span className="rn">{t.rn}</span><span>{t.label}</span>
              </button>
            ))}
          </nav>
          <main key={tab} className="fade"><Active go={go} /></main>
        </div>
      </div>
    </div>
  );
}
