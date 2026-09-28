// @title Français – Test semaines 1–12 (slovní zásoba + gramatika)
// @subject Languages
// @topic Francouzština – opakování banque semaines 1–12
// @template mixed

import { useState, useCallback, useMemo, useEffect } from "react";

/* ═══════════════════════════════════════════════════════════════════
   TÉMA "AFFICHE" — ivory plakát, trikolóra, dvojitý rámeček
   Rody barevně: le/un = bleu, la/une = rouge, les/des = noir
   ═══════════════════════════════════════════════════════════════════ */

const CSS = `
.root {
  --ivory:#fbf7f0; --paper:#ffffff; --ink:#1a1a1a; --muted:#5b5750;
  --bleu:#1b3a8f; --rouge:#c8102e; --line:#d8d0c2;
  --ok:#1f7a45; --bad:#b32020;
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

/* trikolóra u levého okraje */
.tricolore{
  position:fixed; left:0; top:0; bottom:0; width:6px; z-index:50;
  background:linear-gradient(to bottom,var(--bleu) 0 33.33%,#fff 33.33% 66.66%,var(--rouge) 66.66% 100%);
}

.shell{ padding-left:6px; max-width:1180px; margin:0 auto; }

/* ── hlavička plakátu ── */
.affiche{
  padding:34px 22px 22px; text-align:center;
  border-bottom:3px double var(--bleu);
  background:var(--ivory);
}
.affiche .kicker{
  font-size:12px; letter-spacing:.24em; text-transform:uppercase;
  color:var(--rouge); font-weight:700; margin-bottom:12px;
}
.affiche h1{ font-size:clamp(28px,5.5vw,50px); letter-spacing:.01em; }
.affiche .hairline{ width:120px; height:0; border-top:2px solid var(--rouge); margin:14px auto; }
.affiche .sub{ font-size:14px; color:var(--muted); letter-spacing:.1em; text-transform:uppercase; }

/* ── layout: sommaire vlevo + obsah ── */
.body{ display:grid; grid-template-columns:230px 1fr; gap:26px; padding:24px 22px 70px; align-items:start; }
.body > *{ min-width:0; }
.sommaire{ position:sticky; top:16px; }
.sommaire .lbl{
  font-size:11px; letter-spacing:.2em; text-transform:uppercase;
  color:var(--muted); margin-bottom:10px; border-bottom:1px solid var(--line); padding-bottom:6px;
}
.navbtn{
  display:block; width:100%; text-align:left; background:transparent;
  border:none; border-left:3px solid transparent; padding:11px 12px;
  font-size:15px; color:var(--ink); cursor:pointer; transition:all .45s ease;
  min-height:44px;
}
.navbtn:hover{ background:#fff; border-left-color:var(--line); }
.navbtn.on{ background:#fff; border-left-color:var(--rouge); font-weight:700; color:var(--bleu); }
.navbtn .n{ font-family:'Playfair Display',serif; color:var(--rouge); margin-right:8px; }

/* ── karty ── */
.card{ background:var(--paper); border:3px double var(--bleu); padding:20px 22px; margin-bottom:18px; }
.card.red{ border-color:var(--rouge); }
.card h2{ font-size:24px; margin-bottom:4px; }
.card h3{ font-size:19px; margin:0 0 8px; }
.lede{ color:var(--muted); font-size:15px; margin:0 0 16px; }

.sect-title{ display:flex; align-items:baseline; gap:12px; margin:0 0 6px; }
.sect-title h2{ font-size:clamp(22px,3.4vw,30px); }
.sect-title .no{ font-family:'Playfair Display',serif; font-size:15px; color:var(--rouge); letter-spacing:.14em; text-transform:uppercase; }
.sect-lede{ color:var(--muted); margin:0 0 20px; border-bottom:1px solid var(--line); padding-bottom:14px; }

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

/* ── slovíčka ── */
.vgrid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(250px,1fr)); gap:0 22px; }
.vrow{ display:flex; gap:10px; align-items:baseline; padding:7px 0; border-bottom:1px dotted var(--line); }
.vrow .fr{ font-weight:600; }
.vrow .cz{ color:var(--muted); margin-left:auto; text-align:right; font-size:14px; }
.g-m{ color:var(--bleu); }
.g-f{ color:var(--rouge); }
.g-p{ color:#1a1a1a; }
.cat{ font-size:12px; letter-spacing:.18em; text-transform:uppercase; color:var(--rouge); margin:18px 0 6px; font-weight:700; }
.cat:first-child{ margin-top:4px; }

.phrase{ border-left:3px solid var(--bleu); padding:6px 0 6px 14px; margin:10px 0; }
.phrase .f{ font-weight:600; }
.phrase .c{ color:var(--muted); font-size:14px; }

.swatches{ display:flex; flex-wrap:wrap; gap:10px; margin:8px 0 2px; }
.sw{ display:flex; align-items:center; gap:8px; border:1px solid var(--line); padding:6px 10px; font-size:14px; }
.sw i{ width:18px; height:18px; display:block; border:1px solid #999; }

/* ── vyhledávání ── */
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
.tbl{ width:100%; border-collapse:collapse; margin:12px 0; font-size:15px; }
.tbl th,.tbl td{ border:1px solid var(--line); padding:8px 10px; text-align:left; }
.tbl th{ background:#f2ece1; font-family:'Playfair Display',serif; font-size:14px; letter-spacing:.06em; }
.tbl td.mono{ font-family:'Courier New',monospace; }
.tbl tr:nth-child(even) td{ background:#fcfaf6; }

/* ── řešené úlohy ── */
.prob{ border:1px solid var(--line); background:#fff; padding:16px; margin-bottom:14px; }
.prob-head{ display:flex; gap:10px; align-items:center; flex-wrap:wrap; margin-bottom:8px; }
.diff{ font-size:11px; letter-spacing:.1em; text-transform:uppercase; padding:3px 9px; border:1px solid; font-weight:700; }
.diff.e{ color:var(--ok); border-color:var(--ok); }
.diff.m{ color:#a86a00; border-color:#a86a00; }
.diff.h{ color:var(--rouge); border-color:var(--rouge); }
.prob .task{ font-size:17px; font-weight:600; margin:6px 0 12px; }
.reveal-btn{
  background:#fff; border:2px solid var(--bleu); color:var(--bleu); padding:9px 18px;
  font-size:14px; font-weight:700; letter-spacing:.08em; text-transform:uppercase;
  cursor:pointer; transition:all .45s ease; min-height:44px;
}
.reveal-btn:hover{ background:var(--bleu); color:#fff; }
.sol{ margin-top:14px; border-top:1px solid var(--line); padding-top:12px; }
.sol .step{ margin:10px 0; }
.sol .step .lab{ font-size:11px; letter-spacing:.16em; text-transform:uppercase; color:var(--rouge); font-weight:700; }
.sol .res{ border:2px solid var(--rouge); padding:10px 14px; margin-top:12px; font-weight:700; }

/* ── tlačítka / módy ── */
.modes{ display:flex; flex-wrap:wrap; gap:8px; margin-bottom:18px; }
.mode{
  background:#fff; border:1px solid var(--line); padding:10px 16px; font-size:14px;
  cursor:pointer; transition:all .45s ease; min-height:44px;
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
.fb .tip{ margin-top:8px; font-size:14px; font-style:italic; color:#a86a00; }
.navrow{ display:flex; justify-content:space-between; gap:10px; margin-top:18px; }
.results{ text-align:center; padding:40px 20px; }
.results .score{ font-family:'Playfair Display',serif; font-size:56px; font-weight:700; color:var(--bleu); }
.results .pct{ font-size:22px; color:var(--rouge); margin-bottom:12px; }
.results .msg{ font-size:17px; max-width:420px; margin:0 auto 22px; }

/* ── cvičení ── */
.drill-input{
  width:100%; padding:13px 15px; border:2px solid var(--bleu); background:#fff;
  font-size:17px; font-family:inherit; margin:12px 0;
}
.drill-input:focus{ outline:2px solid var(--rouge); outline-offset:-2px; }
.prompt-big{ font-family:'Playfair Display',serif; font-size:clamp(22px,4vw,30px); text-align:center; margin:16px 0 6px; }
.prompt-sub{ text-align:center; color:var(--muted); font-size:13px; letter-spacing:.16em; text-transform:uppercase; margin-bottom:12px; }
.verdict{ padding:12px 16px; border:2px solid; margin-top:12px; }
.verdict.ok{ border-color:var(--ok); color:var(--ok); }
.verdict.bad{ border-color:var(--bad); color:var(--bad); }
.verdict .sol2{ color:var(--ink); margin-top:6px; font-size:15px; }

/* párování */
.pairs{ display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.pair-item{
  border:1px solid var(--line); background:#fff; padding:11px 13px; cursor:pointer;
  transition:all .45s ease; font-size:15px; min-height:44px; display:flex; align-items:center;
}
.pair-item:hover{ border-color:var(--bleu); }
.pair-item.sel{ border:2px solid var(--bleu); background:#eef1f9; }
.pair-item.done{ border-color:var(--ok); background:#eef7f1; color:var(--ok); cursor:default; }
.pair-item.err{ border:2px solid var(--bad); background:#fbeeee; }

/* skóre */
.scorebar{ display:flex; flex-wrap:wrap; gap:14px; align-items:center; margin-bottom:16px; font-size:14px; }
.scorebar .chip{ border:1px solid var(--line); padding:6px 12px; background:#fff; }
.scorebar .chip b{ color:var(--bleu); }
.prog{ height:8px; background:#eae3d6; margin:6px 0 2px; }
.prog i{ display:block; height:100%; background:var(--rouge); transition:width .8s ease; }

/* ── kartičky ── */
.fcwrap{ perspective:1400px; margin:0 auto 16px; max-width:520px; }
.fc{ position:relative; width:100%; height:240px; transform-style:preserve-3d; transition:transform .45s ease; cursor:pointer; }
.fc.flip{ transform:rotateY(180deg); }
.fc-face{
  position:absolute; inset:0; backface-visibility:hidden; background:#fff;
  border:3px double var(--bleu); display:flex; flex-direction:column;
  align-items:center; justify-content:center; padding:24px; text-align:center;
}
.fc-face.back{ transform:rotateY(180deg); border-color:var(--rouge); }
.fc-face .big{ font-family:'Playfair Display',serif; font-size:clamp(20px,4vw,30px); }
.fc-face .small{ font-size:12px; letter-spacing:.18em; text-transform:uppercase; color:var(--muted); margin-top:14px; }

/* ── tahák ── */
.cheat{ column-count:2; column-gap:22px; }
.cheat > div{ break-inside:avoid; margin-bottom:16px; }
.mono{ font-family:'Courier New',monospace; }

/* ── mobil ── */
@media (max-width:900px){
  .body{ grid-template-columns:1fr; gap:14px; padding:16px 14px 60px; }
  .sommaire{ position:static; display:flex; gap:6px; overflow-x:auto; padding-bottom:6px; }
  .sommaire .lbl{ display:none; }
  .navbtn{ white-space:nowrap; width:auto; border-left:none; border-bottom:3px solid transparent; }
  .navbtn.on{ border-left:none; border-bottom-color:var(--rouge); }
  .vgrid{ grid-template-columns:1fr; }
  .cheat{ column-count:1; }
  .pairs{ grid-template-columns:1fr; }
  .card{ padding:16px 14px; }
  .tbl{ display:block; overflow-x:auto; }
  .tbl th,.tbl td{ min-width:88px; }
}
`;

/* ═══════════════════════════════════════════════════════════════════
   POMOCNÉ FUNKCE
   ═══════════════════════════════════════════════════════════════════ */

function shuffleArray(a){ const s=[...a]; for(let i=s.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [s[i],s[j]]=[s[j],s[i]]; } return s; }

function shuffleQuestions(qs){
  return qs.map(q=>{
    const idxs=q.options.map((_,i)=>i);
    const sh=shuffleArray(idxs);
    return { ...q, options: sh.map(i=>q.options[i]), correct: q.correct.map(o=>sh.indexOf(o)) };
  });
}

function arrEqual(a,b){
  if(!a||!b) return false;
  const sa=[...a].sort((x,y)=>x-y), sb=[...b].sort((x,y)=>x-y);
  return sa.length===sb.length && sa.every((v,i)=>v===sb[i]);
}

/** Normalizace odpovědi: bez diakritiky, bez členů, bez interpunkce. */
function norm(s){
  if(!s) return "";
  let t = s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
  t = t.replace(/[.,!?;:"'`()«»’‘“”]/g," ");
  t = t.replace(/\s+/g," ").trim();
  t = t.replace(/^(le|la|les|l|un|une|des|du|de la|de l|de)\s+/,"");
  t = t.replace(/\s+/g," ").trim();
  return t;
}

/** Velkorysé porovnání: hlavní odpověď + varianty za / a , */
function answerOk(user, accepted){
  const u = norm(user);
  if(!u) return false;
  const pool = [];
  accepted.forEach(a=>{
    if(!a) return;
    a.split(/\s*\/\s*|\s*,\s*/).forEach(p=>{
      const n = norm(p);
      if(n) pool.push(n);
      // varianta bez závorek a bez rodového (e)/(m.)/(f.)
      const stripped = norm(p.replace(/\([^)]*\)/g,""));
      if(stripped) pool.push(stripped);
    });
    const whole = norm(a);
    if(whole) pool.push(whole);
  });
  return pool.some(p => p === u || (p.length>5 && u.length>5 && (p===u.replace(/\s+/g," "))));
}

/** Rozpozná člen a obarví ho podle rodu (le/un = modrá, la/une = červená, les/des = černá). */
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

/* ═══════════════════════════════════════════════════════════════════
   SLOVNÍ ZÁSOBA — banque, semaines 1–12
   ═══════════════════════════════════════════════════════════════════ */

const WEEKS = [
  {
    id: "s1",
    label: "Semaine 1",
    title: "V restauraci I + množství",
    groups: [
      { cat: "Slovíčka", items: [
        { fr:"la mer", cz:"moře", g:"f" },
        { fr:"le poisson", cz:"ryba", g:"m" },
        { fr:"la voiture", cz:"auto", g:"f" },
        { fr:"peut-être", cz:"možná" },
        { fr:"le plat du jour", cz:"pokrm dne", g:"m" },
        { fr:"une formule", cz:"denní menu (předkrm+hlavní, nebo hlavní+dezert)", g:"f" },
        { fr:"une entrée", cz:"předkrm / vchod (do budovy)", g:"f" },
        { fr:"le veau", cz:"tele, telecí", g:"m" },
        { fr:"le sel", cz:"sůl", g:"m" },
        { fr:"le poivre", cz:"pepř", g:"m" },
        { fr:"l'eau (f.)", cz:"voda", g:"f" },
        { fr:"l'argent (m.)", cz:"peníze", g:"m" },
        { fr:"un ami", cz:"kamarád", g:"m" },
      ]},
    ],
    phrases: [
      { f:"J'ai beaucoup d'amis.", c:"Mám hodně kamarádů." },
      { f:"Tu bois un peu d'eau.", c:"Piješ trochu vody." },
      { f:"Elle n'a pas d'argent.", c:"Nemá peníze." },
      { f:"Ils ont beaucoup de voitures.", c:"Mají hodně aut." },
      { f:"Tu me donnes un peu de sel ?", c:"Podáš mi trochu soli?" },
      { f:"Désolé, je n'ai pas de sel.", c:"Promiň, sůl nemám." },
      { f:"Encore du sel et du poivre, s'il vous plaît.", c:"Ještě sůl a pepř, prosím." },
    ],
  },
  {
    id: "s2",
    label: "Semaine 2",
    title: "V restauraci II + město + čísla",
    groups: [
      { cat: "V restauraci", items: [
        { fr:"un dessert", cz:"dezert", g:"m" },
        { fr:"commander", cz:"objednat (si)" },
        { fr:"une commande", cz:"objednávka", g:"f" },
        { fr:"à la fin", cz:"na konci" },
        { fr:"la même chose", cz:"to samé", g:"f" },
        { fr:"bienvenue !", cz:"vítejte!" },
      ]},
      { cat: "Město – ulice a prostor", items: [
        { fr:"l'avenue (f.)", cz:"třída (široká ulice)", g:"f" },
        { fr:"le boulevard", cz:"bulvár", g:"m" },
        { fr:"le fleuve", cz:"(velká) řeka – teče do moře", g:"m" },
        { fr:"la place", cz:"náměstí", g:"f" },
        { fr:"le pont", cz:"most", g:"m" },
        { fr:"le quai", cz:"nábřeží, nástupiště", g:"m" },
        { fr:"la rue", cz:"ulice", g:"f" },
        { fr:"la banlieue", cz:"předměstí", g:"f" },
        { fr:"le centre-ville", cz:"centrum města", g:"m" },
        { fr:"le quartier", cz:"čtvrť", g:"m" },
      ]},
      { cat: "Město – budovy a místa", items: [
        { fr:"la banque", cz:"banka", g:"f" },
        { fr:"le bâtiment", cz:"budova", g:"m" },
        { fr:"la bibliothèque", cz:"knihovna", g:"f" },
        { fr:"le commissariat", cz:"policejní stanice", g:"m" },
        { fr:"l'école (f.)", cz:"škola", g:"f" },
        { fr:"l'église (f.)", cz:"kostel", g:"f" },
        { fr:"la fontaine", cz:"kašna, fontána", g:"f" },
        { fr:"la gare", cz:"nádraží", g:"f" },
        { fr:"le jardin", cz:"zahrada", g:"m" },
        { fr:"la mairie", cz:"radnice", g:"f" },
        { fr:"le musée", cz:"muzeum", g:"m" },
        { fr:"le parc", cz:"park", g:"m" },
        { fr:"la poste", cz:"pošta", g:"f" },
        { fr:"le théâtre", cz:"divadlo", g:"m" },
        { fr:"les habitants", cz:"obyvatelé", g:"p" },
        { fr:"les touristes", cz:"turisté", g:"p" },
      ]},
      { cat: "Doprava", items: [
        { fr:"à pied (m.)", cz:"pěšky" },
        { fr:"à trottinette (f.)", cz:"na koloběžce" },
        { fr:"à vélo (m.)", cz:"na kole" },
        { fr:"en bus (m.)", cz:"autobusem" },
        { fr:"en métro (m.)", cz:"metrem" },
        { fr:"en train (m.)", cz:"vlakem" },
        { fr:"en tramway (m.)", cz:"tramvají" },
        { fr:"en voiture (f.)", cz:"autem" },
        { fr:"le covoiturage", cz:"spolujízda", g:"m" },
        { fr:"les transports en commun (m.)", cz:"městská hromadná doprava", g:"p" },
        { fr:"se déplacer", cz:"přemísťovat se, dopravovat se" },
        { fr:"l'arrêt (m.)", cz:"zastávka", g:"m" },
        { fr:"la carte de transport", cz:"dopravní karta", g:"f" },
        { fr:"l'itinéraire (m.)", cz:"trasa, itinerář", g:"m" },
        { fr:"la ligne", cz:"linka", g:"f" },
        { fr:"la station", cz:"stanice (metra)", g:"f" },
        { fr:"le ticket", cz:"jízdenka", g:"m" },
      ]},
    ],
    phrases: [
      { f:"Combien ça coûte ? / Ça coûte combien ?", c:"Kolik to stojí?" },
      { f:"Qu'est-ce que tu choisis ? – Je choisis…", c:"Co si vybíráš? – Vybírám si…" },
      { f:"Je voudrais le plat du jour, s'il vous plaît.", c:"Chtěl(a) bych pokrm dne, prosím." },
      { f:"Je prends la même chose.", c:"Dám si to samé." },
    ],
    numbers: [
      { n:"100", f:"cent" },
      { n:"200", f:"deux cents" },
      { n:"352", f:"trois cent cinquante-deux" },
      { n:"1 000", f:"mille" },
      { n:"2 000", f:"deux mille" },
      { n:"10 000", f:"dix mille" },
      { n:"1 000 000", f:"un million" },
      { n:"2 000 000", f:"deux millions" },
      { n:"1 000 000 000", f:"un milliard" },
      { n:"2 000 000 000", f:"deux milliards" },
    ],
  },
  {
    id: "s3",
    label: "Semaine 3",
    title: "Frekvence + spojovací výrazy",
    groups: [
      { cat: "Slovíčka", items: [
        { fr:"l'argent (m.)", cz:"peníze", g:"m" },
        { fr:"un devoir", cz:"úkol, povinnost", g:"m" },
        { fr:"prêt(e)", cz:"připravený / připravená" },
        { fr:"la forêt", cz:"les", g:"f" },
        { fr:"travailler", cz:"pracovat" },
        { fr:"une sœur", cz:"sestra", g:"f" },
      ]},
      { cat: "Frekvence (jak často)", items: [
        { fr:"toujours", cz:"vždy, pořád" },
        { fr:"souvent", cz:"často" },
        { fr:"parfois", cz:"někdy, občas" },
        { fr:"jamais (ne… jamais)", cz:"nikdy" },
      ]},
      { cat: "Spojovací výrazy (connecteurs)", items: [
        { fr:"avec", cz:"s, se" },
        { fr:"sans", cz:"bez" },
        { fr:"mais", cz:"ale" },
        { fr:"parce que", cz:"protože" },
        { fr:"pour", cz:"pro, aby (+ infinitiv)" },
      ]},
    ],
    phrases: [
      { f:"Je n'ai pas d'argent.", c:"Nemám peníze." },
      { f:"J'aime travailler sans ma sœur.", c:"Rád(a) pracuji bez sestry." },
      { f:"J'aime les croissants sans chocolat.", c:"Mám rád(a) croissanty bez čokolády." },
      { f:"Je vais souvent au parc parce que j'aime la nature.", c:"Chodím často do parku, protože mám rád(a) přírodu." },
    ],
  },
  {
    id: "s4",
    label: "Semaine 4",
    title: "Cesta a orientace ve městě",
    groups: [
      { cat: "Slovíčka", items: [
        { fr:"comment", cz:"jak" },
        { fr:"où", cz:"kde, kam" },
        { fr:"vite / rapide", cz:"rychle / rychlý" },
        { fr:"tout droit", cz:"rovně" },
        { fr:"à gauche", cz:"vlevo" },
        { fr:"à droite", cz:"vpravo" },
        { fr:"traverser", cz:"přejít, překročit" },
        { fr:"continuer", cz:"pokračovat" },
        { fr:"tourner", cz:"zatočit" },
        { fr:"la boucherie", cz:"řeznictví", g:"f" },
        { fr:"la boulangerie", cz:"pekařství", g:"f" },
        { fr:"la viande", cz:"maso", g:"f" },
        { fr:"par carte", cz:"kartou" },
        { fr:"en espèces", cz:"hotově" },
      ]},
      { cat: "Světové strany", items: [
        { fr:"le nord", cz:"sever", g:"m" },
        { fr:"le sud", cz:"jih", g:"m" },
        { fr:"l'ouest (m.)", cz:"západ", g:"m" },
        { fr:"l'est (m.)", cz:"východ", g:"m" },
      ]},
    ],
    phrases: [
      { f:"Excusez-moi, je / on cherche la gare.", c:"Promiňte, hledám / hledáme nádraží." },
      { f:"Où est l'arrêt de bus, s'il vous plaît ?", c:"Kde je autobusová zastávka, prosím?" },
      { f:"Tournez à gauche, puis tournez à droite.", c:"Zahněte vlevo, potom vpravo." },
      { f:"Prenez la rue Victor Hugo, puis continuez tout droit.", c:"Dejte se ulicí Victora Huga a pak pokračujte rovně." },
      { f:"Prenez la première / deuxième rue à droite.", c:"Dejte se první / druhou ulicí vpravo." },
      { f:"Traversez le Pont Neuf, puis tournez à gauche.", c:"Přejděte Pont Neuf a potom zahněte vlevo." },
      { f:"Je vais à la boucherie pour acheter de la viande.", c:"Jdu do řeznictví koupit maso." },
      { f:"Je vais à la gare pour prendre le train.", c:"Jdu na nádraží, abych jel vlakem." },
      { f:"Comment tu te déplaces ? – Je me déplace à vélo.", c:"Jak se přepravuješ? – Jezdím na kole." },
      { f:"Vous payez comment ? – Par carte. / En espèces.", c:"Jak budete platit? – Kartou. / Hotově." },
      { f:"C'est le plus vite / le plus rapide.", c:"Je to nejrychlejší." },
    ],
  },
  {
    id: "s5",
    label: "Semaine 5",
    title: "Oblečení, barvy, materiály, počasí",
    groups: [
      { cat: "Slovíčka týdne", items: [
        { fr:"le trottoir", cz:"chodník", g:"m" },
        { fr:"la porte", cz:"dveře", g:"f" },
        { fr:"un ordinateur (un ordi)", cz:"počítač", g:"m" },
        { fr:"un colis", cz:"balík", g:"m" },
        { fr:"un gilet", cz:"vesta", g:"m" },
        { fr:"la livraison", cz:"doručení, dodávka", g:"f" },
      ]},
      { cat: "Oblečení (les vêtements)", items: [
        { fr:"la chemise", cz:"košile", g:"f" },
        { fr:"le costume", cz:"oblek", g:"m" },
        { fr:"le gilet", cz:"vesta", g:"m" },
        { fr:"l'imperméable (m.)", cz:"nepromokavý plášť", g:"m" },
        { fr:"la jupe", cz:"sukně", g:"f" },
        { fr:"le manteau", cz:"kabát", g:"m" },
        { fr:"le pantalon", cz:"kalhoty", g:"m" },
        { fr:"le jean", cz:"džíny", g:"m" },
        { fr:"le pull", cz:"svetr", g:"m" },
        { fr:"la robe", cz:"šaty", g:"f" },
        { fr:"le short", cz:"šortky", g:"m" },
        { fr:"le tee-shirt", cz:"tričko", g:"m" },
        { fr:"la veste", cz:"sako, bunda", g:"f" },
      ]},
      { cat: "Doplňky (les accessoires)", items: [
        { fr:"le(s) bijou(x)", cz:"šperk(y)", g:"m" },
        { fr:"la ceinture", cz:"pásek", g:"f" },
        { fr:"le chapeau", cz:"klobouk", g:"m" },
        { fr:"les chaussures (f.)", cz:"boty", g:"p" },
        { fr:"les baskets (f.)", cz:"tenisky", g:"p" },
        { fr:"les bottes (f.)", cz:"holínky, kozačky", g:"p" },
        { fr:"la cravate", cz:"kravata", g:"f" },
        { fr:"les lunettes de soleil (f.)", cz:"sluneční brýle", g:"p" },
        { fr:"le parapluie", cz:"deštník", g:"m" },
        { fr:"le sac à main", cz:"kabelka", g:"m" },
      ]},
      { cat: "Materiály (les matières)", items: [
        { fr:"en coton (m.)", cz:"bavlněný / z bavlny" },
        { fr:"en jean (m.)", cz:"džínový / z džínoviny" },
        { fr:"en cuir (m.)", cz:"kožený / z kůže" },
        { fr:"en laine (f.)", cz:"vlněný / z vlny" },
      ]},
      { cat: "Počasí (la météo)", items: [
        { fr:"le(s) degré(s) (m.)", cz:"stupeň, stupně", g:"m" },
        { fr:"la neige", cz:"sníh", g:"f" },
        { fr:"le nuage", cz:"mrak", g:"m" },
        { fr:"l'orage (m.)", cz:"bouřka", g:"m" },
        { fr:"la pluie", cz:"déšť", g:"f" },
        { fr:"le soleil", cz:"slunce", g:"m" },
        { fr:"le vent", cz:"vítr", g:"m" },
      ]},
    ],
    colors: [
      { fr:"blanc", cz:"bílá", hex:"#ffffff" },
      { fr:"bleu", cz:"modrá", hex:"#2b6cd4" },
      { fr:"gris", cz:"šedá", hex:"#9aa0a6" },
      { fr:"jaune", cz:"žlutá", hex:"#f5c518" },
      { fr:"marron", cz:"hnědá", hex:"#7b4a2a" },
      { fr:"noir", cz:"černá", hex:"#111111" },
      { fr:"rose", cz:"růžová", hex:"#e94f9a" },
      { fr:"rouge", cz:"červená", hex:"#d42b2b" },
      { fr:"vert", cz:"zelená", hex:"#3aa655" },
    ],
    phrases: [
      { f:"« Veuillez le / la lire. »", c:"Přečtěte si to, prosím." },
      { f:"« Vous avez terminé ? »", c:"Skončil(a) jste? / Máte hotovo?" },
      { f:"Il pleut. / Il neige.", c:"Prší. / Sněží." },
      { f:"Il fait beau. / Il y a du soleil.", c:"Je hezky. / Svítí slunce." },
      { f:"Il fait froid. / Il fait -10 °C.", c:"Je zima. / Je -10 °C." },
      { f:"Il fait chaud. / Il fait 30 °C.", c:"Je horko. / Je 30 °C." },
      { f:"Il y a du vent. / Il y a de l'orage.", c:"Je vítr. / Je bouřka." },
      { f:"En hiver, au printemps, en été, en automne…", c:"V zimě, na jaře, v létě, na podzim…" },
      { f:"En janvier, en avril, en juillet…", c:"V lednu, v dubnu, v červenci…" },
      { f:"Début septembre, mi-septembre, fin septembre.", c:"Začátkem, v polovině, koncem září." },
      { f:"Tu chausses du combien ? / Quelle est ta pointure ? – Je chausse / Je fais du 39.", c:"Jakou máš velikost bot? – Nosím 39." },
      { f:"Vous faites quelle taille ? – Je fais du 38.", c:"Jakou máte velikost (oblečení)? – Nosím 38." },
      { f:"C'est à la mode. ≠ Ce n'est pas à la mode.", c:"Je to módní. ≠ Není to módní." },
      { f:"Il me plaît. ≠ Il ne me plaît pas.", c:"Líbí se mi. ≠ Nelíbí se mi." },
      { f:"Je trouve ça joli. ≠ Je déteste la couleur. / Quelle horreur !", c:"Přijde mi to hezké. ≠ Nesnáším tu barvu. / Hrůza!" },
      { f:"Il te va bien.", c:"Sluší ti to." },
    ],
  },
  {
    id: "s6",
    label: "Semaine 6",
    title: "Shoda přídavných jmen (rod a číslo)",
    groups: [
      { cat: "Vzorové spojení z banque", items: [
        { fr:"une / la robe blanche", cz:"bílé šaty", g:"f" },
        { fr:"des baskets bleues", cz:"modré tenisky", g:"p" },
        { fr:"un pantalon bleu", cz:"modré kalhoty", g:"m" },
        { fr:"des parapluies bleus", cz:"modré deštníky", g:"p" },
        { fr:"une chemise bleue", cz:"modrá košile", g:"f" },
        { fr:"des chemises bleues", cz:"modré košile", g:"p" },
        { fr:"un pull noir", cz:"černý svetr", g:"m" },
        { fr:"une jupe noire", cz:"černá sukně", g:"f" },
        { fr:"une montre rose", cz:"růžové hodinky", g:"f" },
        { fr:"des bottes blanches", cz:"bílé kozačky", g:"p" },
        { fr:"un chapeau rouge", cz:"červený klobouk", g:"m" },
        { fr:"des chapeaux rouges", cz:"červené klobouky", g:"p" },
        { fr:"des cravates grises", cz:"šedé kravaty", g:"p" },
        { fr:"des crevettes grises", cz:"šedé krevety", g:"p" },
      ]},
    ],
    phrases: [
      { f:"Elle porte une robe blanche et des baskets bleues.", c:"Má na sobě bílé šaty a modré tenisky." },
      { f:"Il met un pull noir avec un pantalon bleu.", c:"Obléká si černý svetr a modré kalhoty." },
    ],
  },
  {
    id: "s7",
    label: "Semaine 7",
    title: "Co se děje? + záliby a výslovnost",
    groups: [
      { cat: "Slovíčka", items: [
        { fr:"tricoter", cz:"plést" },
        { fr:"dormir", cz:"spát" },
        { fr:"la couture", cz:"šití", g:"f" },
        { fr:"la haute-couture", cz:"luxusní móda", g:"f" },
        { fr:"une fille [fij]", cz:"dcera, dívka", g:"f" },
        { fr:"un fils [fis]", cz:"syn", g:"m" },
        { fr:"rien", cz:"nic" },
        { fr:"un événement", cz:"událost", g:"m" },
        { fr:"quand", cz:"kdy / když" },
        { fr:"se passer", cz:"odehrát se, dít se" },
      ]},
    ],
    phrases: [
      { f:"« Ça y est ? »", c:"Hotovo? / Je to?" },
      { f:"« Qu'est-ce qui se passe ? »", c:"Co se děje?" },
      { f:"Quand est-ce que l'événement se passe ?", c:"Kdy se ta událost koná?" },
      { f:"Je ne fais rien, je dors.", c:"Nedělám nic, spím." },
    ],
  },
  {
    id: "s8",
    label: "Semaine 8",
    title: "Věci denní potřeby + půjčování",
    groups: [
      { cat: "Slovíčka týdne", items: [
        { fr:"un stylo", cz:"pero", g:"m" },
        { fr:"un crayon", cz:"tužka", g:"m" },
        { fr:"un feutre", cz:"fix", g:"m" },
        { fr:"emprunter", cz:"půjčit si (od někoho)" },
        { fr:"prêter", cz:"půjčit (někomu)" },
        { fr:"une cagnotte", cz:"společná kasa, složené peníze", g:"f" },
        { fr:"un anniversaire", cz:"narozeniny", g:"m" },
        { fr:"bientôt", cz:"brzy" },
        { fr:"utile", cz:"užitečný" },
      ]},
      { cat: "Objets du quotidien (učebnice s. 83)", items: [
        { fr:"les clés (f.)", cz:"klíče", g:"p" },
        { fr:"le portefeuille", cz:"peněženka", g:"m" },
        { fr:"le sac", cz:"taška", g:"m" },
        { fr:"le téléphone / le portable", cz:"telefon / mobil", g:"m" },
        { fr:"le chargeur", cz:"nabíječka", g:"m" },
        { fr:"les écouteurs (m.)", cz:"sluchátka", g:"p" },
        { fr:"la montre", cz:"hodinky", g:"f" },
        { fr:"le mouchoir", cz:"kapesník", g:"m" },
        { fr:"la trousse", cz:"penál", g:"f" },
        { fr:"le cahier", cz:"sešit", g:"m" },
        { fr:"la gomme", cz:"guma", g:"f" },
        { fr:"les ciseaux (m.)", cz:"nůžky", g:"p" },
        { fr:"la colle", cz:"lepidlo", g:"f" },
        { fr:"la bouteille", cz:"láhev", g:"f" },
      ]},
    ],
    phrases: [
      { f:"« Est-ce que je peux emprunter un stylo ? »", c:"Můžu si půjčit pero?" },
      { f:"« Est-ce que tu peux me prêter un stylo ? »", c:"Můžeš mi půjčit pero?" },
      { f:"« C'est pas grave. / Pas de souci. / C'est ok. / Comme tu veux. »", c:"To nevadí. / Žádný problém. / V pohodě. / Jak chceš." },
      { f:"« Ça sert à quoi ? / À quoi ça sert ? »", c:"K čemu to slouží?" },
      { f:"« Ça sert à téléphoner. / C'est pour téléphoner. / C'est très utile. »", c:"Slouží to k telefonování. / Je to na telefonování. / Je to velmi užitečné." },
      { f:"On fait une cagnotte pour son anniversaire.", c:"Uděláme složenku (společnou kasu) na jeho/její narozeniny." },
    ],
  },
  {
    id: "s9",
    label: "Semaines 9 + 10",
    title: "Denní režim + zvratná slovesa",
    groups: [
      { cat: "Slovíčka týdne", items: [
        { fr:"s'endormir", cz:"usnout" },
        { fr:"à haute voix", cz:"nahlas" },
        { fr:"apprendre", cz:"učit se" },
      ]},
      { cat: "La routine quotidienne (učebnice s. 91)", items: [
        { fr:"se réveiller", cz:"probudit se" },
        { fr:"se lever", cz:"vstát" },
        { fr:"se laver", cz:"mýt se" },
        { fr:"se doucher / prendre une douche", cz:"sprchovat se" },
        { fr:"se brosser les dents", cz:"čistit si zuby" },
        { fr:"se coiffer", cz:"česat se" },
        { fr:"se raser", cz:"holit se" },
        { fr:"s'habiller", cz:"oblékat se" },
        { fr:"se maquiller", cz:"líčit se" },
        { fr:"prendre le petit-déjeuner", cz:"snídat" },
        { fr:"se dépêcher", cz:"pospíchat" },
        { fr:"rentrer à la maison", cz:"vrátit se domů" },
        { fr:"se reposer", cz:"odpočívat" },
        { fr:"se coucher", cz:"jít spát, lehnout si" },
      ]},
      { cat: "Navrhnout / přijmout / odmítnout program", items: [
        { fr:"On va au théâtre ?", cz:"Půjdeme do divadla?" },
        { fr:"Tu veux aller au théâtre ?", cz:"Chceš jít do divadla?" },
        { fr:"Ça te / vous dit ?", cz:"Co ty na to? / Máte chuť?" },
        { fr:"D'accord !", cz:"Platí! / Souhlasím!" },
        { fr:"Pourquoi pas !", cz:"Proč ne!" },
        { fr:"Avec plaisir !", cz:"S radostí!" },
        { fr:"Je ne peux pas, je suis désolé(e).", cz:"Nemůžu, je mi líto." },
        { fr:"Je n'ai pas envie.", cz:"Nemám chuť." },
      ]},
    ],
    phrases: [
      { f:"« Apprenez ça. »", c:"Naučte se tohle." },
      { f:"Lisez le texte à haute voix.", c:"Čtěte text nahlas." },
      { f:"Je me lève à sept heures, puis je me brosse les dents.", c:"Vstávám v sedm, potom si čistím zuby." },
      { f:"Le soir, je me couche et je m'endors vite.", c:"Večer jdu spát a rychle usnu." },
    ],
  },
  {
    id: "s11",
    label: "Semaines 11 + 12",
    title: "Bydlení + předložky místa",
    groups: [
      { cat: "Le logement (bydlení)", items: [
        { fr:"déménager", cz:"stěhovat se" },
        { fr:"l'étage (m.)", cz:"patro", g:"m" },
        { fr:"la fenêtre", cz:"okno", g:"f" },
        { fr:"le jardin", cz:"zahrada", g:"m" },
        { fr:"la maison", cz:"dům", g:"f" },
        { fr:"la pièce", cz:"místnost", g:"f" },
        { fr:"le rez-de-chaussée", cz:"přízemí", g:"m" },
        { fr:"la surface", cz:"plocha, rozloha", g:"f" },
        { fr:"la terrasse", cz:"terasa", g:"f" },
      ]},
      { cat: "Les pièces (místnosti)", items: [
        { fr:"la chambre", cz:"ložnice, pokoj", g:"f" },
        { fr:"la cuisine", cz:"kuchyně", g:"f" },
        { fr:"la salle à manger", cz:"jídelna", g:"f" },
        { fr:"la salle de bains", cz:"koupelna", g:"f" },
        { fr:"le salon", cz:"obývací pokoj", g:"m" },
        { fr:"les toilettes (f.)", cz:"toaleta, záchod", g:"p" },
      ]},
      { cat: "Les meubles (nábytek)", items: [
        { fr:"l'armoire (f.)", cz:"skříň", g:"f" },
        { fr:"le bureau", cz:"psací stůl", g:"m" },
        { fr:"le canapé", cz:"pohovka", g:"m" },
        { fr:"la chaise", cz:"židle", g:"f" },
        { fr:"le fauteuil", cz:"křeslo", g:"m" },
        { fr:"le lit", cz:"postel", g:"m" },
        { fr:"la table (basse)", cz:"(konferenční) stůl", g:"f" },
      ]},
      { cat: "L'électroménager (spotřebiče)", items: [
        { fr:"la cuisinière", cz:"sporák", g:"f" },
        { fr:"le four (à micro-ondes)", cz:"trouba (mikrovlnná)", g:"m" },
        { fr:"le lave-linge", cz:"pračka", g:"m" },
        { fr:"le réfrigérateur / le frigo", cz:"lednice", g:"m" },
      ]},
      { cat: "Les objets et la décoration", items: [
        { fr:"l'aquarium (m.)", cz:"akvárium", g:"m" },
        { fr:"décorer", cz:"zdobit" },
        { fr:"la lampe", cz:"lampa", g:"f" },
        { fr:"la plante", cz:"rostlina", g:"f" },
        { fr:"le tableau", cz:"obraz", g:"m" },
        { fr:"le tapis", cz:"koberec", g:"m" },
        { fr:"la télévision", cz:"televize", g:"f" },
      ]},
      { cat: "Les prépositions de lieu", items: [
        { fr:"à gauche (de)", cz:"nalevo (od)" },
        { fr:"à droite (de)", cz:"napravo (od)" },
        { fr:"sur", cz:"na" },
        { fr:"sous", cz:"pod" },
        { fr:"devant", cz:"před" },
        { fr:"derrière", cz:"za" },
        { fr:"à côté (de)", cz:"vedle" },
        { fr:"en face (de)", cz:"naproti" },
        { fr:"entre", cz:"mezi" },
      ]},
    ],
    phrases: [
      { f:"Je place la télé en face du canapé.", c:"Dávám televizi naproti pohovce." },
      { f:"Je place la table basse devant le canapé.", c:"Dávám konferenční stolek před pohovku." },
      { f:"Je place la table derrière le canapé avec les chaises.", c:"Dávám stůl za pohovku spolu se židlemi." },
      { f:"Je place le tapis sous la table.", c:"Dávám koberec pod stůl." },
      { f:"On met la lampe à gauche ou à droite du meuble ?", c:"Dáme lampu nalevo, nebo napravo od nábytku?" },
      { f:"On place le tableau entre les deux fenêtres.", c:"Obraz dáme mezi dvě okna." },
    ],
  },
];

/* ── Bonus: letošní banque 3ABC/R7A, semaines 1–3 ── */
const BONUS = {
  id: "bonus",
  label: "Bonus",
  title: "Letošní banque (3ABC/R7A) – semaines 1–3",
  groups: [
    { cat: "Semaine 1 – prezentace a projev", items: [
      { fr:"Attendez !", cz:"Počkejte!" },
      { fr:"une erreur grave", cz:"závažná chyba", g:"f" },
      { fr:"l'argumentation (f.)", cz:"argumentace", g:"f" },
      { fr:"un auditoire", cz:"obecenstvo, publikum", g:"m" },
      { fr:"capter l'attention", cz:"zachytit pozornost" },
      { fr:"maintenir l'attention", cz:"udržet pozornost" },
      { fr:"le regard", cz:"pohled", g:"m" },
      { fr:"le discours", cz:"projev, proslov", g:"m" },
      { fr:"le saumon", cz:"losos", g:"m" },
    ]},
    { cat: "Semaines 2–3 – minulost a budoucnost", items: [
      { fr:"comprendre", cz:"rozumět" },
      { fr:"entendre", cz:"slyšet" },
      { fr:"la prochaine fois", cz:"příště", g:"f" },
      { fr:"une fois / deux fois / trois fois", cz:"jednou / dvakrát / třikrát" },
      { fr:"un voyage", cz:"cesta, výlet", g:"m" },
      { fr:"le passé", cz:"minulost", g:"m" },
      { fr:"le futur", cz:"budoucnost", g:"m" },
      { fr:"la semaine dernière", cz:"minulý týden", g:"f" },
      { fr:"la semaine prochaine", cz:"příští týden", g:"f" },
    ]},
  ],
  phrases: [
    { f:"Je suis allé au Mexique. / Je suis allé en Italie.", c:"Byl jsem v Mexiku. / Byl jsem v Itálii." },
    { f:"« Est-ce que ça t'a plu ? »", c:"Líbilo se ti to?" },
    { f:"Qu'est-ce que tu as fait la semaine dernière ?", c:"Co jsi dělal(a) minulý týden?" },
    { f:"Qu'est-ce que vous avez fait la semaine dernière ?", c:"Co jste dělali minulý týden?" },
    { f:"Qu'est-ce qu'ils ont fait la semaine dernière ?", c:"Co dělali minulý týden?" },
    { f:"Qu'est-ce que tu vas faire la semaine prochaine ?", c:"Co budeš dělat příští týden?" },
    { f:"Qu'est-ce qu'on va faire la semaine prochaine ?", c:"Co budeme dělat příští týden?" },
    { f:"Tu es allé où cet été ? / Où est-ce que tu es allé cet été ?", c:"Kam jsi jel(a) tohle léto?" },
    { f:"Quand est-ce que tu es allé en Italie ?", c:"Kdy jsi jel(a) do Itálie?" },
    { f:"Comment est-ce que tu es allé en Italie ?", c:"Jak jsi jel(a) do Itálie?" },
    { f:"Avec qui est-ce que tu es allé en Italie ?", c:"S kým jsi jel(a) do Itálie?" },
    { f:"À vous aussi !", c:"Vám také!" },
  ],
};

/* ═══════════════════════════════════════════════════════════════════
   ČASOVÁNÍ — seznam sloves, který profesor vyžaduje znát
   ═══════════════════════════════════════════════════════════════════ */

const CONJ = [
  { inf:"avoir", cz:"mít", forms:["j'ai","tu as","il / elle a","nous avons","vous avez","ils / elles ont"], imp:["aie","ayons","ayez"], note:"Nepravidelné. Pomocné sloveso passé composé." },
  { inf:"être", cz:"být", forms:["je suis","tu es","il / elle est","nous sommes","vous êtes","ils / elles sont"], imp:["sois","soyons","soyez"], note:"Nepravidelné. Pomocné sloveso u sloves pohybu (je suis allé)." },
  { inf:"aller", cz:"jít, jet", forms:["je vais","tu vas","il / elle va","nous allons","vous allez","ils / elles vont"], imp:["va","allons","allez"], note:"Nepravidelné. aller + infinitiv = blízká budoucnost." },
  { inf:"parler", cz:"mluvit", forms:["je parle","tu parles","il / elle parle","nous parlons","vous parlez","ils / elles parlent"], note:"Vzor 1. skupiny (-er)." },
  { inf:"habiter", cz:"bydlet", forms:["j'habite","tu habites","il / elle habite","nous habitons","vous habitez","ils / elles habitent"], note:"1. skupina, h je němé → j'habite." },
  { inf:"aimer", cz:"mít rád, milovat", forms:["j'aime","tu aimes","il / elle aime","nous aimons","vous aimez","ils / elles aiment"], note:"1. skupina, po ní člen určitý: j'aime le café." },
  { inf:"acheter", cz:"kupovat", forms:["j'achète","tu achètes","il / elle achète","nous achetons","vous achetez","ils / elles achètent"], note:"Pozor na è ve všech tvarech kromě nous/vous." },
  { inf:"payer", cz:"platit", forms:["je paie (paye)","tu paies","il / elle paie","nous payons","vous payez","ils / elles paient"], note:"y → i před němým e (je paie)." },
  { inf:"manger", cz:"jíst", forms:["je mange","tu manges","il / elle mange","nous mangeons","vous mangez","ils / elles mangent"], note:"nous mange<b>o</b>ns – e se drží kvůli výslovnosti [ž]." },
  { inf:"faire", cz:"dělat", forms:["je fais","tu fais","il / elle fait","nous faisons","vous faites","ils / elles font"], note:"Nepravidelné. Pozor: vous faites (ne „faisez“)." },
  { inf:"choisir", cz:"vybrat si", forms:["je choisis","tu choisis","il / elle choisit","nous choisissons","vous choisissez","ils / elles choisissent"], note:"2. skupina (-ir), vsuvka -iss- v množném čísle." },
  { inf:"finir", cz:"skončit", forms:["je finis","tu finis","il / elle finit","nous finissons","vous finissez","ils / elles finissent"], note:"2. skupina, stejně jako choisir." },
  { inf:"prendre", cz:"vzít si, jet čím", forms:["je prends","tu prends","il / elle prend","nous prenons","vous prenez","ils / elles prennent"], imp:["prends","prenons","prenez"], note:"Prenez la rue… / Je prends le bus." },
  { inf:"monter", cz:"jít nahoru, nastoupit", forms:["je monte","tu montes","il / elle monte","nous montons","vous montez","ils / elles montent"], imp:["monte","montons","montez"], note:"1. skupina; v passé composé s être." },
  { inf:"vouloir", cz:"chtít", forms:["je veux","tu veux","il / elle veut","nous voulons","vous voulez","ils / elles veulent"], note:"Nepravidelné. Zdvořile: je voudrais." },
  { inf:"pouvoir", cz:"moci", forms:["je peux","tu peux","il / elle peut","nous pouvons","vous pouvez","ils / elles peuvent"], note:"Nepravidelné. Otázka: Est-ce que je peux… ?" },
  { inf:"vendre", cz:"prodávat", forms:["je vends","tu vends","il / elle vend","nous vendons","vous vendez","ils / elles vendent"], note:"3. skupina (-re), ve 3. os. j. č. bez koncovky." },
  { inf:"mettre", cz:"dát, obléct si", forms:["je mets","tu mets","il / elle met","nous mettons","vous mettez","ils / elles mettent"], note:"Zdvojení t v množném čísle." },
  { inf:"venir", cz:"přijít", forms:["je viens","tu viens","il / elle vient","nous venons","vous venez","ils / elles viennent"], note:"Nepravidelné, ie/e střídání." },
  { inf:"connaître", cz:"znát (osobu, místo)", forms:["je connais","tu connais","il / elle connaît","nous connaissons","vous connaissez","ils / elles connaissent"], note:"î jen ve 3. os. j. č." },
  { inf:"savoir", cz:"vědět, umět", forms:["je sais","tu sais","il / elle sait","nous savons","vous savez","ils / elles savent"], note:"savoir = vědět fakt / umět něco dělat." },
  { inf:"boire", cz:"pít", forms:["je bois","tu bois","il / elle boit","nous buvons","vous buvez","ils / elles boivent"], note:"Kmen se mění: boi- / buv- / boiv-." },
];

const PRONOUNS = ["je","tu","il / elle","nous","vous","ils / elles"];

/* ═══════════════════════════════════════════════════════════════════
   ŘEŠENÉ ÚLOHY — řešení skryté, odkryje se kliknutím
   ═══════════════════════════════════════════════════════════════════ */

const PROBLEMS = [
  {
    d:"e", topic:"Množství (partitiv)",
    task:"Doplň: « Tu me donnes ___ sel ? » – « Désolé, je n'ai ___ sel. »",
    given:"Věta 1 je kladná s určením malého množství, věta 2 je záporná.",
    rule:"Po výrazu množství (un peu de, beaucoup de) i po záporu (ne… pas) se dává jen DE / D', nikdy du / de la / des.",
    steps:["Věta 1: „trochu soli“ = un peu de + sel → un peu de sel.","Věta 2: zápor je n'ai pas → člen zmizí a zůstane pas de.","Kdyby věta 1 byla bez určení množství, bylo by du sel (partitiv)."],
    res:"Tu me donnes un peu de sel ? – Désolé, je n'ai pas de sel.",
  },
  {
    d:"e", topic:"Množství (partitiv)",
    task:"Přelož: „Mám hodně kamarádů, ale nemám peníze.“",
    given:"„hodně“ = výraz množství, „nemám“ = zápor.",
    rule:"beaucoup de + podstatné jméno; ne… pas de + podstatné jméno. Před samohláskou de → d'.",
    steps:["hodně kamarádů → beaucoup de amis → před samohláskou: beaucoup d'amis.","nemám peníze → je n'ai pas de argent → je n'ai pas d'argent.","Spojka „ale“ = mais."],
    res:"J'ai beaucoup d'amis, mais je n'ai pas d'argent.",
  },
  {
    d:"m", topic:"Shoda přídavných jmen",
    task:"Dej do správného tvaru: une robe (blanc), des baskets (bleu), un chapeau (rouge), des bottes (blanc).",
    given:"Přídavné jméno se řídí rodem a číslem podstatného jména, u kterého stojí.",
    rule:"Ž. rod: + -e. Množné číslo: + -s. Ž. rod mn. č.: + -es. Slova končící na -e (rose, jaune, rouge) se v ž. rodě nemění.",
    steps:["une robe = ž. rod j. č. → blanc + e = blanche (nepravidelné, c → ch).","des baskets = ž. rod mn. č. → bleu + es = bleues.","un chapeau = m. rod j. č. → rouge zůstává rouge (končí na -e).","des bottes = ž. rod mn. č. → blanc → blanches."],
    res:"une robe blanche · des baskets bleues · un chapeau rouge · des bottes blanches",
  },
  {
    d:"m", topic:"Shoda přídavných jmen",
    task:"Oprav chyby: « Il porte un pantalon bleue et des chapeaux rouge. »",
    given:"pantalon je mužského rodu jednotného čísla, chapeaux je mužského rodu množného čísla.",
    rule:"Koncovka -e patří jen k ženskému rodu, koncovka -s / -x k množnému číslu.",
    steps:["un pantalon = m. rod j. č. → bleu (bez -e).","des chapeaux = m. rod mn. č. → rouge + s = rouges.","Pozor: chapeau má množné číslo chapeaux (-x)."],
    res:"Il porte un pantalon bleu et des chapeaux rouges.",
  },
  {
    d:"e", topic:"Předložky s místy",
    task:"Doplň à la / au / à l' : Je vais ___ boucherie, ___ supermarché, ___ école.",
    given:"Předložka à se slučuje s určitým členem podstatného jména.",
    rule:"à + le = au · à + les = aux · à + la = à la · à + l' = à l'.",
    steps:["la boucherie → à la boucherie.","le supermarché → à + le = au supermarché.","l'école (f., začíná samohláskou) → à l'école."],
    res:"Je vais à la boucherie, au supermarché, à l'école.",
  },
  {
    d:"m", topic:"Účelový infinitiv (pour)",
    task:"Spoj do jedné věty: Je vais à la gare. + Je prends le train.",
    given:"Druhá věta vyjadřuje účel té první.",
    rule:"Účel se vyjadřuje POUR + infinitiv (nikdy pour + časované sloveso).",
    steps:["Zachovej první větu: Je vais à la gare.","Přidej pour a dej druhé sloveso do infinitivu: prends → prendre.","Spoj: Je vais à la gare pour prendre le train."],
    res:"Je vais à la gare pour prendre le train.",
  },
  {
    d:"m", topic:"Dopravní prostředky",
    task:"Doplň à nebo en: Je me déplace ___ vélo, ___ bus, ___ pied, ___ voiture.",
    given:"Rozhoduje, jestli do prostředku nastupuji dovnitř, nebo ne.",
    rule:"EN = jsem uvnitř (en bus, en métro, en train, en tramway, en voiture). À = sedím na něčem nebo jdu (à vélo, à trottinette, à pied).",
    steps:["vélo → sedím na kole, nejsem uvnitř → à vélo.","bus → jsem uvnitř → en bus.","pied → chůze → à pied.","voiture → jsem uvnitř → en voiture."],
    res:"Je me déplace à vélo, en bus, à pied, en voiture.",
  },
  {
    d:"m", topic:"Zvratná slovesa",
    task:"Vyčasuj sloveso se lever ve všech osobách.",
    given:"se lever je zvratné sloveso 1. skupiny s přízvučným è.",
    rule:"Zvratné zájmeno se mění podle osoby: me, te, se, nous, vous, se. Před samohláskou me → m', te → t', se → s'.",
    steps:["je + me + lève → je me lève","tu te lèves · il / elle se lève","nous nous levons · vous vous levez (v 1. a 2. os. mn. č. bez è)","ils / elles se lèvent"],
    res:"je me lève · tu te lèves · il se lève · nous nous levons · vous vous levez · ils se lèvent",
  },
  {
    d:"h", topic:"Zvratná slovesa + zápor",
    task:"Dej do záporu: « Il se rase tous les jours. » a « Je m'endors vite. »",
    given:"Zápor obklopuje časované sloveso, ne zvratné zájmeno.",
    rule:"ne + [zvratné zájmeno + sloveso] + pas. Zvratné zájmeno zůstává těsně před slovesem.",
    steps:["Najdi časované sloveso: se rase → rase, m'endors → endors.","Zvratné zájmeno se / m' zůstane před slovesem.","ne dej PŘED zvratné zájmeno, pas ZA sloveso.","Před samohláskou: ne → n'."],
    res:"Il ne se rase pas tous les jours. · Je ne m'endors pas vite.",
  },
  {
    d:"m", topic:"Předložky místa + stažení",
    task:"Doplň: Je place la télé en face ___ canapé et le tableau à côté ___ fenêtres.",
    given:"Obě předložky končí na de a následuje určitý člen.",
    rule:"de + le = du · de + les = des · de + la = de la · de + l' = de l'.",
    steps:["le canapé → en face de + le = en face du canapé.","les fenêtres → à côté de + les = à côté des fenêtres.","Pozor: sur, sous, devant, derrière, entre se s členem NEslučují (sur la table)."],
    res:"Je place la télé en face du canapé et le tableau à côté des fenêtres.",
  },
  {
    d:"e", topic:"Rozkazovací způsob (směr)",
    task:"Poraď cestu: zahnout vlevo, pak pokračovat rovně a přejít most.",
    given:"Radíme cizímu člověku → vykání (vous).",
    rule:"Rozkaz pro vous = tvar vous bez zájmena: vous tournez → Tournez !",
    steps:["tourner → Tournez à gauche.","continuer → continuez tout droit (spojíme spojkou puis).","traverser → Traversez le pont."],
    res:"Tournez à gauche, puis continuez tout droit et traversez le pont.",
  },
  {
    d:"h", topic:"Otázky (3 způsoby)",
    task:"Zeptej se třemi způsoby: „Kolik to stojí?“ a „Kde je zastávka?“",
    given:"Francouzština má intonační otázku, otázku s est-ce que a inverzi.",
    rule:"1) intonace: Ça coûte combien ? 2) est-ce que: Combien est-ce que ça coûte ? 3) inverze / tázací slovo vpředu: Combien ça coûte ?",
    steps:["Tázací slovo může být na konci (mluvený jazyk) i na začátku.","U místa: Où est l'arrêt de bus ? (inverze sloveso–podmět).","Zdvořilostní dodatek: s'il vous plaît na konci."],
    res:"Combien ça coûte ? / Ça coûte combien ? · Où est l'arrêt de bus, s'il vous plaît ?",
  },
  {
    d:"h", topic:"Číslovky",
    field:"num",
    task:"Napiš slovy: 100, 200, 352, 2 000, 2 000 000.",
    given:"Pozor na koncové -s u cent a na neměnné mille.",
    rule:"cent dostane -s jen v násobcích, po kterých už nic nenásleduje (deux cents, ALE deux cent cinquante). mille je vždy neměnné. million a milliard jsou podstatná jména → deux millions.",
    steps:["100 = cent (bez un).","200 = deux cents (násobek, nic nenásleduje → -s).","352 = trois cent cinquante-deux (po cent následuje číslo → bez -s).","2 000 = deux mille (mille nikdy -s).","2 000 000 = deux millions (podstatné jméno → -s)."],
    res:"cent · deux cents · trois cent cinquante-deux · deux mille · deux millions",
  },
  {
    d:"m", topic:"Frekvence a spojky",
    task:"Přelož: „Nikdy nejezdím autem, protože často jezdím na kole.“",
    given:"„nikdy“ je záporný výraz, „protože“ spojka příčiny.",
    rule:"ne… jamais obklopuje sloveso stejně jako ne… pas. Příslovce frekvence (souvent, toujours, parfois) stojí za časovaným slovesem.",
    steps:["nejezdím autem → je ne vais pas en voiture → s „nikdy“: je ne vais jamais en voiture.","protože = parce que.","často jezdím na kole → je vais souvent à vélo (souvent za slovesem)."],
    res:"Je ne vais jamais en voiture parce que je vais souvent à vélo.",
  },
  {
    d:"h", topic:"emprunter × prêter",
    task:"Doplň správné sloveso: « Est-ce que je peux ___ un stylo ? » × « Est-ce que tu peux me ___ un stylo ? »",
    given:"Obě slovesa se do češtiny překládají jako „půjčit“.",
    rule:"emprunter = půjčit si OD někoho (beru). prêter = půjčit někomu (dávám), často s me / te / lui.",
    steps:["V první větě mluvčí bere → emprunter.","V druhé větě to druhý člověk dává mně (me) → prêter.","Zapamatuj: prêter = přenechat, emprunter = uzmout."],
    res:"Est-ce que je peux emprunter un stylo ? × Est-ce que tu peux me prêter un stylo ?",
  },
  {
    d:"m", topic:"Počasí",
    task:"Popiš čtyřmi větami: prší, je 30 °C, fouká vítr, sněží.",
    given:"Popis počasí je neosobní – podmět je vždy il nebo il y a.",
    rule:"Sloveso samotné: Il pleut. / Il neige. Teplota a pocit: Il fait + přídavné jméno / číslo. Jev jako věc: Il y a du / de la / de l' + podstatné jméno.",
    steps:["prší → Il pleut.","30 °C → Il fait 30 degrés. (nebo Il fait chaud.)","vítr je podstatné jméno → Il y a du vent.","sněží → Il neige."],
    res:"Il pleut. · Il fait 30 degrés. · Il y a du vent. · Il neige.",
  },
];

/* ═══════════════════════════════════════════════════════════════════
   VĚTY K PŘEKLADU (obousměrně)
   ═══════════════════════════════════════════════════════════════════ */

const SENTENCES = [
  { fr:"J'ai beaucoup d'amis.", cz:"Mám hodně kamarádů.", topic:"Množství" },
  { fr:"Elle n'a pas d'argent.", cz:"Nemá peníze.", topic:"Množství" },
  { fr:"Tu me donnes un peu de sel ?", cz:"Podáš mi trochu soli?", topic:"Množství" },
  { fr:"Encore du sel et du poivre, s'il vous plaît.", cz:"Ještě sůl a pepř, prosím.", topic:"Restaurace" },
  { fr:"Je voudrais le plat du jour.", cz:"Chtěl bych pokrm dne.", topic:"Restaurace" },
  { fr:"Combien ça coûte ?", cz:"Kolik to stojí?", topic:"Restaurace" },
  { fr:"Je vais à la boucherie pour acheter de la viande.", cz:"Jdu do řeznictví koupit maso.", topic:"Město" },
  { fr:"Je vais au musée avec ma sœur.", cz:"Jdu do muzea se sestrou.", topic:"Město" },
  { fr:"Où est l'arrêt de bus, s'il vous plaît ?", cz:"Kde je autobusová zastávka, prosím?", topic:"Cesta" },
  { fr:"Tournez à gauche, puis continuez tout droit.", cz:"Zahněte vlevo a pak pokračujte rovně.", topic:"Cesta" },
  { fr:"Je me déplace à vélo.", cz:"Jezdím na kole.", topic:"Doprava" },
  { fr:"Nous prenons les transports en commun.", cz:"Jezdíme městskou hromadnou dopravou.", topic:"Doprava" },
  { fr:"Je ne vais jamais en voiture.", cz:"Nikdy nejezdím autem.", topic:"Frekvence" },
  { fr:"J'aime travailler sans ma sœur.", cz:"Rád pracuji bez sestry.", topic:"Spojky" },
  { fr:"Elle porte une robe blanche et des baskets bleues.", cz:"Má na sobě bílé šaty a modré tenisky.", topic:"Oblečení" },
  { fr:"Il met un pull noir et un pantalon bleu.", cz:"Obléká si černý svetr a modré kalhoty.", topic:"Oblečení" },
  { fr:"Il fait froid et il y a du vent.", cz:"Je zima a fouká vítr.", topic:"Počasí" },
  { fr:"En été, il fait chaud et il y a du soleil.", cz:"V létě je horko a svítí slunce.", topic:"Počasí" },
  { fr:"Est-ce que je peux emprunter un stylo ?", cz:"Můžu si půjčit pero?", topic:"Věci" },
  { fr:"Ça sert à téléphoner.", cz:"Slouží to k telefonování.", topic:"Věci" },
  { fr:"Je me lève à sept heures.", cz:"Vstávám v sedm hodin.", topic:"Denní režim" },
  { fr:"Le soir, je me couche et je m'endors vite.", cz:"Večer jdu spát a rychle usnu.", topic:"Denní režim" },
  { fr:"Qu'est-ce qui se passe ?", cz:"Co se děje?", topic:"Fráze" },
  { fr:"Je place la télé en face du canapé.", cz:"Dávám televizi naproti pohovce.", topic:"Bydlení" },
  { fr:"Le tapis est sous la table basse.", cz:"Koberec je pod konferenčním stolkem.", topic:"Bydlení" },
  { fr:"On place le tableau entre les deux fenêtres.", cz:"Obraz dáme mezi dvě okna.", topic:"Bydlení" },
  { fr:"On va au théâtre ? – Avec plaisir !", cz:"Půjdeme do divadla? – S radostí!", topic:"Program" },
  { fr:"Je ne peux pas, je suis désolé.", cz:"Nemůžu, je mi líto.", topic:"Program" },
];

/* ═══════════════════════════════════════════════════════════════════
   KVÍZ — slovní zásoba i gramatika, semaines 1–12
   ═══════════════════════════════════════════════════════════════════ */

const QUIZ = [
  {
    question: "Doplň: « Tu bois ___ eau. » (piješ trochu vody)",
    type:"single",
    options:["un peu d'","un peu de l'","un peu de la","un peu des"],
    correct:[0],
    explanation:"Po výrazu množství stojí vždy jen DE, a před samohláskou se krátí na D'. Člen (de la, de l') se po množství vypouští.",
    tip:"Množství + DE. Vždy. Bez výjimky.",
  },
  {
    question: "Která věta je gramaticky správně?",
    type:"single",
    options:["Je n'ai pas de sel.","Je n'ai pas du sel.","Je n'ai pas le sel.","Je n'ai pas de la sel."],
    correct:[0],
    explanation:"V záporu se dělivý i neurčitý člen mění na pouhé DE / D'. Kladně by bylo: J'ai du sel.",
    tip:"Zápor smaže člen: pas de.",
  },
  {
    question: "Co znamená « une entrée » v jídelním lístku?",
    type:"single",
    options:["předkrm","hlavní chod","dezert","účet"],
    correct:[0],
    explanation:"une entrée = předkrm. Mimo restauraci to znamená také vchod do budovy. Hlavní chod je le plat, dezert le dessert.",
    tip:"Entrée = vstup do jídla i do domu.",
  },
  {
    question: "« une formule » v restauraci znamená:",
    type:"single",
    options:["denní menu: buď předkrm + hlavní, nebo hlavní + dezert","recept kuchaře","matematický vzorec na účtence","nápojový lístek"],
    correct:[0],
    explanation:"Une formule je zvýhodněná kombinace dvou chodů — soit entrée / plat, soit plat / dessert.",
  },
  {
    question: "Vyber VŠECHNA slova, která označují místo ve městě.",
    type:"multi",
    options:["la mairie","le quai","le veau","la banlieue","le poivre","le commissariat"],
    correct:[0,1,3,5],
    explanation:"la mairie = radnice, le quai = nábřeží, la banlieue = předměstí, le commissariat = policejní stanice. Le veau (telecí) a le poivre (pepř) patří k jídlu.",
  },
  {
    question: "Jak se řekne « nábřeží »?",
    type:"single",
    options:["le quai","le pont","le fleuve","le trottoir"],
    correct:[0],
    explanation:"le quai = nábřeží (i nástupiště). le pont = most, le fleuve = velká řeka, le trottoir = chodník.",
  },
  {
    question: "Doplň správnou předložku: « Je me déplace ___ métro. »",
    type:"single",
    options:["en","à","au","dans le"],
    correct:[0],
    explanation:"Do metra nastupuji dovnitř → EN métro. Stejně en bus, en train, en tramway, en voiture. Naopak à vélo, à trottinette, à pied.",
    tip:"Jsem uvnitř → EN. Sedím na tom nebo jdu → À.",
  },
  {
    question: "Vyber VŠECHNY dopravní prostředky, které se pojí s « à ».",
    type:"multi",
    options:["vélo","trottinette","bus","pied","train"],
    correct:[0,1,3],
    explanation:"à vélo, à trottinette, à pied — nesedím uvnitř. Bus i train berou EN.",
  },
  {
    question: "Jak se napíše číslo 352 slovy?",
    type:"single",
    options:["trois cent cinquante-deux","trois cents cinquante-deux","trois cent cinquante et deux","troix cent cinquante-deux"],
    correct:[0],
    explanation:"Cent dostane -s jen tehdy, je-li násobkem a nic za ním nenásleduje (deux cents). Když za ním číslo pokračuje, -s mizí.",
    tip:"Cent si vezme -s, jen když je na konci.",
  },
  {
    question: "Které zápisy čísel jsou správné?",
    type:"multi",
    options:["deux cents","deux mille","deux milles","deux millions","deux million"],
    correct:[0,1,3],
    explanation:"deux cents (násobek na konci → -s), deux mille (mille je vždy neměnné), deux millions (million je podstatné jméno → -s).",
  },
  {
    question: "Doplň: « Je vais ___ supermarché et ___ boulangerie. »",
    type:"single",
    options:["au … à la","à le … à la","au … au","à la … au"],
    correct:[0],
    explanation:"à + le = au (le supermarché), à + la zůstává à la (la boulangerie). Tvar „à le“ ve francouzštině neexistuje.",
    tip:"à + le = au, à + les = aux.",
  },
  {
    question: "Jak vyjádříš účel: „Jdu na nádraží, abych jel vlakem“?",
    type:"single",
    options:["Je vais à la gare pour prendre le train.","Je vais à la gare pour je prends le train.","Je vais à la gare parce que prendre le train.","Je vais à la gare pour que le train."],
    correct:[0],
    explanation:"Účel = POUR + infinitiv. Po pour nikdy nestojí časované sloveso.",
    tip:"pour + infinitiv, parce que + celá věta.",
  },
  {
    question: "Vyber správný tvar: « une robe ___ » (bílá)",
    type:"single",
    options:["blanche","blanc","blancs","blanches"],
    correct:[0],
    explanation:"Robe je ženského rodu jednotného čísla → blanc se mění na blanche. Tvar blanches je ženský rod množného čísla (des bottes blanches).",
  },
  {
    question: "Vyber VŠECHNA správně shodnutá spojení.",
    type:"multi",
    options:["des baskets bleues","un pantalon bleu","une chemise bleu","des parapluies bleus","une jupe noire"],
    correct:[0,1,3,4],
    explanation:"Chybné je „une chemise bleu“ — chemise je ženského rodu, musí být bleue.",
  },
  {
    question: "Proč zůstává « une montre rose » beze změny v ženském rodě?",
    type:"single",
    options:["protože přídavné jméno už končí na -e","protože rose je podstatné jméno","protože montre je mužského rodu","protože barvy se nikdy neshodují"],
    correct:[0],
    explanation:"Přídavná jména končící na -e (rose, jaune, rouge) mají stejný tvar v mužském i ženském rodě. V množném čísle ale přibude -s: des montres roses.",
    tip:"Končí na -e? V ženském rodě klid.",
  },
  {
    question: "Co znamená « un colis »?",
    type:"single",
    options:["balík","obojek","chodník","lepidlo"],
    correct:[0],
    explanation:"un colis = balík (souvisí s la livraison = doručení). Chodník je le trottoir.",
  },
  {
    question: "Jak se řekne « nepromokavý plášť »?",
    type:"single",
    options:["l'imperméable","le manteau","le gilet","la veste"],
    correct:[0],
    explanation:"l'imperméable (m.) = nepromokavý plášť. le manteau = kabát, le gilet = vesta, la veste = sako/bunda.",
  },
  {
    question: "Vyber VŠECHNY věty, kterými lze popsat počasí správně.",
    type:"multi",
    options:["Il y a du vent.","Il pleut.","Il fait du soleil froid.","Il fait -10 °C.","Il est neige."],
    correct:[0,1,3],
    explanation:"Jev jako podstatné jméno → Il y a du vent / de l'orage. Sloveso samotné → Il pleut, Il neige. Teplota → Il fait -10 °C. „Il est neige“ neexistuje.",
    tip:"Il fait + jaké / kolik · Il y a du + co · Il pleut / il neige.",
  },
  {
    question: "Co znamená « tricoter »?",
    type:"single",
    options:["plést","třídit","podvádět","krájet"],
    correct:[0],
    explanation:"tricoter = plést. Souvisí s la couture = šití (la haute-couture = luxusní móda).",
  },
  {
    question: "Kterou dvojici čteme [fij] a [fis]?",
    type:"single",
    options:["une fille × un fils","une file × un fil","une fiche × un fisc","une ville × un vis"],
    correct:[0],
    explanation:"une fille [fij] = dcera/dívka, un fils [fis] = syn. Ve slově fils se -l- nevyslovuje, ale -s ano.",
    tip:"Fille zní měkce, fils tvrdě na konci.",
  },
  {
    question: "« Est-ce que tu peux me ___ un stylo ? » (můžeš mi půjčit)",
    type:"single",
    options:["prêter","emprunter","donner à","apporter de"],
    correct:[0],
    explanation:"prêter = půjčit někomu (já dávám). emprunter = půjčit si od někoho: Est-ce que je peux emprunter un stylo ?",
    tip:"Prêter = přenechat. Emprunter = uzmout si.",
  },
  {
    question: "Co znamená « une cagnotte »?",
    type:"single",
    options:["společná kasa, složené peníze","dárkový koš","narozeninový dort","pokladní blok"],
    correct:[0],
    explanation:"une cagnotte = společná kasa, do níž se skládají peníze (třeba na dárek k narozeninám — un anniversaire).",
  },
  {
    question: "Jaká je správná odpověď na « Ça sert à quoi ? »",
    type:"single",
    options:["Ça sert à téléphoner.","Ça sert téléphoner.","Ça sert de téléphoner.","Ça sert pour téléphone."],
    correct:[0],
    explanation:"servir À + infinitiv. Alternativy: C'est pour téléphoner. / C'est très utile.",
  },
  {
    question: "Vyčasuj: « Nous ___ » (se raser)",
    type:"single",
    options:["nous nous rasons","nous se rasons","nous nous rasez","nous rasons nous"],
    correct:[0],
    explanation:"Zvratná zájmena: me, te, se, nous, vous, se. V 1. os. mn. č. se tvar nous objeví dvakrát — jednou jako podmět, podruhé jako zvratné zájmeno.",
    tip:"Nous nous, vous vous — zdvojení je správně.",
  },
  {
    question: "Vyber VŠECHNA zvratná slovesa denního režimu.",
    type:"multi",
    options:["se réveiller","se brosser les dents","déménager","s'habiller","tricoter","se coucher"],
    correct:[0,1,3,5],
    explanation:"se réveiller (probudit se), se brosser les dents (čistit si zuby), s'habiller (oblékat se), se coucher (jít spát). Déménager a tricoter zvratná nejsou.",
  },
  {
    question: "Dej do záporu: « Il se rase. »",
    type:"single",
    options:["Il ne se rase pas.","Il se ne rase pas.","Il ne rase se pas.","Il se rase ne pas."],
    correct:[0],
    explanation:"Zápor obklopuje blok [zvratné zájmeno + sloveso]: ne se rase pas.",
    tip:"NE jde před zájmeno, PAS za sloveso.",
  },
  {
    question: "Doplň: « Je place la télé en face ___ canapé. »",
    type:"single",
    options:["du","de le","de la","des"],
    correct:[0],
    explanation:"de + le = du. Stejně de + les = des (à côté des fenêtres). Tvar „de le“ neexistuje.",
    tip:"du = de + le, des = de + les.",
  },
  {
    question: "Které předložky místa se pojí s « de »?",
    type:"multi",
    options:["à côté (de)","en face (de)","sous","à droite (de)","entre"],
    correct:[0,1,3],
    explanation:"à côté de, en face de, à droite de, à gauche de. Naopak sur, sous, devant, derrière a entre se pojí přímo s podstatným jménem.",
  },
  {
    question: "Co je « le rez-de-chaussée »?",
    type:"single",
    options:["přízemí","podkroví","sklep","schodiště"],
    correct:[0],
    explanation:"le rez-de-chaussée = přízemí. Patro je l'étage — francouzské „premier étage“ je naše druhé podlaží.",
  },
  {
    question: "Vyber VŠECHNY spotřebiče (l'électroménager).",
    type:"multi",
    options:["le lave-linge","la cuisinière","le fauteuil","le four à micro-ondes","le tapis"],
    correct:[0,1,3],
    explanation:"le lave-linge (pračka), la cuisinière (sporák), le four à micro-ondes (mikrovlnka). Le fauteuil (křeslo) je nábytek, le tapis (koberec) dekorace.",
  },
  {
    question: "Kam patří příslovce ve větě « Je vais ___ au parc ___ » (často)?",
    type:"single",
    options:["Je vais souvent au parc.","Je souvent vais au parc.","Souvent je vais au parc que.","Je vais au parc souvent que."],
    correct:[0],
    explanation:"Příslovce frekvence (souvent, toujours, parfois) stojí hned ZA časovaným slovesem.",
    tip:"Za slovesem, ne před ním.",
  },
  {
    question: "Přelož: „Nikdy nemám peníze.“",
    type:"single",
    options:["Je n'ai jamais d'argent.","Je n'ai pas jamais argent.","Je jamais ai de l'argent.","Je n'ai jamais de l'argent."],
    correct:[0],
    explanation:"ne… jamais nahrazuje ne… pas a člen se po záporu mění na DE / D'.",
  },
  {
    question: "Vyber správný tvar slovesa: « Vous ___ » (faire)",
    type:"single",
    options:["faites","faisez","faitez","fassez"],
    correct:[0],
    explanation:"faire je nepravidelné: je fais, tu fais, il fait, nous faisons, vous faites, ils font.",
    tip:"vous faites, vous êtes, vous dites — tři výjimky bez -ez.",
  },
  {
    question: "Vyber správný tvar: « Ils ___ » (boire)",
    type:"single",
    options:["boivent","boient","buvent","boisent"],
    correct:[0],
    explanation:"boire: je bois, tu bois, il boit, nous buvons, vous buvez, ils boivent.",
  },
  {
    question: "Vyber VŠECHNA slovesa, která jsou ve 2. skupině (s vsuvkou -iss-).",
    type:"multi",
    options:["choisir","finir","venir","dormir","partir"],
    correct:[0,1],
    explanation:"choisir → nous choisissons, finir → nous finissons. Venir, dormir a partir jsou nepravidelná slovesa 3. skupiny, vsuvku -iss- nemají.",
  },
  {
    question: "Jak se zdvořile objedná: „Chtěl bych pokrm dne“?",
    type:"single",
    options:["Je voudrais le plat du jour.","Je veux le plat du jour.","J'ai voulu le plat du jour.","Je vais vouloir le plat du jour."],
    correct:[0],
    explanation:"Je voudrais je zdvořilá podmiňovací forma slovesa vouloir. „Je veux“ zní v restauraci hrubě.",
    tip:"Voudrais = prosím hezky.",
  },
];

/* ═══════════════════════════════════════════════════════════════════
   ODVOZENÁ DATA
   ═══════════════════════════════════════════════════════════════════ */

const ALL_ITEMS = WEEKS.flatMap(w =>
  w.groups.flatMap(g => g.items.map(it => ({ ...it, week:w.id, weekLabel:w.label, cat:g.cat })))
);

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
      <div className="sect-title">
        <span className="no">{no}</span>
        <h2>{title}</h2>
      </div>
      <p className="sect-lede">{lede}</p>
    </>
  );
}

/* ── Kvíz (engine z assets/quiz-engine.jsx, restylovaný do tématu Affiche) ── */
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
    const msg = pct >= 90 ? "Výborně! Máš to perfektně zvládnuté."
      : pct >= 70 ? "Dobře! Skoro všechno ti sedí."
      : pct >= 50 ? "Mohlo by to být lepší, ale jdeš správným směrem."
      : "Potřebuješ ještě opakovat. Projdi si slovník a gramatiku a zkus to znovu.";
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
        {qs.map((_, i) => {
          let bg = "#eae3d6";
          if (i === idx) bg = accentColor;
          else if (revealed[i]) bg = arrEqual(answers[i] || [], qs[i].correct) ? "#1f7a45" : "#b32020";
          return <div key={i} className="dot" style={{ background:bg }} onClick={() => goTo(i)} title={"Otázka " + (i+1)} />;
        })}
      </div>

      <div className="card">
        <div className="qnum">Otázka {idx + 1} / {qs.length}</div>
        <div className="qtext">{q.question}</div>
        <div>
          {q.options.map((opt, i) => {
            let style = {};
            if (isRevealed) {
              if (q.correct.includes(i)) style = { borderColor:"#1f7a45", borderWidth:"2px", background:"#eef7f1" };
              else if (activeSet.includes(i)) style = { borderColor:"#b32020", borderWidth:"2px", background:"#fbeeee" };
            } else if (activeSet.includes(i)) {
              style = { borderColor:accentColor, borderWidth:"2px", background:"#eef1f9" };
            }
            return (
              <div key={i} className="opt" style={style} onClick={() => isMulti ? toggleMulti(i) : single(i)}>
                {isMulti && <span style={{ fontSize:"18px" }}>{activeSet.includes(i) ? "☑" : "☐"}</span>}
                <span>{opt}</span>
              </div>
            );
          })}
        </div>

        {isMulti && !isRevealed && (
          <button className="btn" style={{ marginTop:"12px" }} onClick={submitMulti} disabled={!pendingMulti.length}>Potvrdit</button>
        )}

        {isRevealed && (
          <div className="fb" style={{ borderColor: isCorrect ? "#1f7a45" : "#b32020" }}>
            <div className="h" style={{ color: isCorrect ? "#1f7a45" : "#b32020" }}>{isCorrect ? "Správně!" : "Špatně"}</div>
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

/* ═══════════════════════════════════════════════════════════════════
   1) SLOVNÍK
   ═══════════════════════════════════════════════════════════════════ */

function VocabRow({ it }) {
  return (
    <div className="vrow">
      <span className="fr"><Fr t={it.fr} g={it.g} /></span>
      <span className="cz">{it.cz}</span>
    </div>
  );
}

function WeekBlock({ w, open }) {
  const count = w.groups.reduce((s, g) => s + g.items.length, 0);
  return (
    <Acc title={w.label + " — " + w.title} badge={count + " výrazů"} defaultOpen={open}>
      {w.groups.map((g, gi) => (
        <div key={gi}>
          <div className="cat">{g.cat}</div>
          <div className="vgrid">
            {g.items.map((it, i) => <VocabRow key={i} it={it} />)}
          </div>
        </div>
      ))}

      {w.colors && (
        <div>
          <div className="cat">Barvy (les couleurs)</div>
          <div className="swatches">
            {w.colors.map((c, i) => (
              <div key={i} className="sw"><i style={{ background:c.hex }} /><b>{c.fr}</b> <span style={{ color:"#5b5750" }}>{c.cz}</span></div>
            ))}
          </div>
        </div>
      )}

      {w.numbers && (
        <div>
          <div className="cat">Číslovky (les nombres)</div>
          <table className="tbl">
            <tbody>
              {w.numbers.map((n, i) => (
                <tr key={i}><td className="mono" style={{ width:"40%" }}>{n.n}</td><td><b>{n.f}</b></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {w.phrases && w.phrases.length > 0 && (
        <div>
          <div className="cat">Věty a fráze</div>
          {w.phrases.map((p, i) => (
            <div key={i} className="phrase"><div className="f">{p.f}</div><div className="c">{p.c}</div></div>
          ))}
        </div>
      )}
    </Acc>
  );
}

function VocabTab() {
  const [q, setQ] = useState("");
  const query = norm(q);

  const hits = useMemo(() => {
    if (!query || query.length < 2) return null;
    return ALL_ITEMS.filter(it => norm(it.fr).includes(query) || norm(it.cz).includes(query));
  }, [query]);

  return (
    <div>
      <SectionHead no="Partie I" title="Slovník — semaines 1–12"
        lede="Celá slovní zásoba z banque, rozdělená po týdnech. Rody poznáš podle barvy členu: le / un je modrý, la / une červený, les / des černý. Hledej francouzsky i česky — diakritika je jedno." />

      <input className="search" placeholder="Hledej slovíčko (např. pont, deštník, se lever)…" value={q} onChange={e => setQ(e.target.value)} />

      {hits && (
        <div className="card red">
          <h3>Výsledky hledání — {hits.length}</h3>
          {hits.length === 0
            ? <p className="lede">Nic nenalezeno. Zkus kratší výraz.</p>
            : <div className="vgrid">{hits.map((it, i) => (
                <div key={i} className="vrow">
                  <span className="fr"><Fr t={it.fr} g={it.g} /></span>
                  <span className="cz">{it.cz} <span style={{ opacity:.6 }}>· {it.weekLabel}</span></span>
                </div>
              ))}</div>}
        </div>
      )}

      {WEEKS.map((w, i) => <WeekBlock key={w.id} w={w} open={i === 0 && !hits} />)}

      <div className="card red" style={{ marginTop:"22px" }}>
        <h3>{BONUS.title}</h3>
        <p className="lede">Letošní banque — v testu na semaines 1–12 být nemusí, ale profesor ji probíral. Projdi ji, až budeš mít zbytek hotový.</p>
        <Acc title="Bonusová slovní zásoba" badge="navíc">
          {BONUS.groups.map((g, gi) => (
            <div key={gi}>
              <div className="cat">{g.cat}</div>
              <div className="vgrid">{g.items.map((it, i) => <VocabRow key={i} it={it} />)}</div>
            </div>
          ))}
          <div className="cat">Věty a fráze</div>
          {BONUS.phrases.map((p, i) => (
            <div key={i} className="phrase"><div className="f">{p.f}</div><div className="c">{p.c}</div></div>
          ))}
        </Acc>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   2) GRAMATIKA
   ═══════════════════════════════════════════════════════════════════ */

function GrammarTab() {
  return (
    <div>
      <SectionHead no="Partie II" title="Gramatika — co se v testu objeví"
        lede="Deset jevů z banque semaines 1–12. Každý blok má pravidlo, příklady z banque a nejčastější chybu. Rozklikni jen to, co ti nesedí." />

      <Acc title="1 · Množství a dělivý člen" badge="un peu de · beaucoup de · pas de" defaultOpen>
        <div className="rule">
          Po každém výrazu množství a po záporu se člen zjednoduší na <b>DE</b> (před samohláskou <b>D'</b>).
          Nikdy ne du / de la / des.
        </div>
        <div className="ex">
          <div>J'ai <b>beaucoup d'</b>amis.</div>
          <div>Tu bois <b>un peu d'</b>eau.</div>
          <div>Elle n'a <b>pas d'</b>argent.</div>
          <div>Ils ont <b>beaucoup de</b> voitures.</div>
          <div>Tu me donnes <b>un peu de</b> sel ? — Désolé, je n'ai <b>pas de</b> sel.</div>
        </div>
        <p>Bez určení množství se používá dělivý člen (partitif): <b>du</b> sel, <b>du</b> poivre, <b>de la</b> viande, <b>de l'</b>eau.</p>
        <div className="ex"><div>Encore <b>du</b> sel et <b>du</b> poivre, s'il vous plaît.</div></div>
        <div className="rule"><b>Nejčastější chyba:</b> „je n'ai pas <span style={{ textDecoration:"line-through" }}>du</span> sel“. Zápor člen smaže.</div>
      </Acc>

      <Acc title="2 · Předložky u míst: à la / au / aux" badge="à + le = au">
        <table className="tbl">
          <thead><tr><th>Podstatné jméno</th><th>Spojení</th><th>Příklad z banque</th></tr></thead>
          <tbody>
            <tr><td>la boucherie (ž.)</td><td className="mono">à la</td><td>Je vais <b>à la</b> boucherie.</td></tr>
            <tr><td>le supermarché (m.)</td><td className="mono">à + le = au</td><td>Je vais <b>au</b> supermarché.</td></tr>
            <tr><td>l'école (samohláska)</td><td className="mono">à l'</td><td>Je vais <b>à l'</b>école.</td></tr>
            <tr><td>les toilettes (mn. č.)</td><td className="mono">à + les = aux</td><td>Je vais <b>aux</b> toilettes.</td></tr>
          </tbody>
        </table>
        <div className="rule"><b>Nikdy nepiš „à le“ ani „à les“.</b> Stažený tvar je povinný.</div>
      </Acc>

      <Acc title="3 · Dopravní prostředky: à × en" badge="à vélo · en bus">
        <div className="rule">
          <b>EN</b> = jsem uvnitř (en bus, en métro, en train, en tramway, en voiture).<br />
          <b>À</b> = sedím na tom nebo jdu po svých (à vélo, à trottinette, à pied).
        </div>
        <div className="ex">
          <div>Comment tu <b>te déplaces</b> ? — Je me déplace <b>à</b> vélo.</div>
          <div>Comment elle <b>se déplace</b> ? — Elle prend <b>les transports en commun</b>.</div>
        </div>
      </Acc>

      <Acc title="4 · Shoda přídavných jmen (rod a číslo)" badge="semaine 6">
        <table className="tbl">
          <thead><tr><th></th><th>mužský rod</th><th>ženský rod</th><th>mn. č. m.</th><th>mn. č. ž.</th></tr></thead>
          <tbody>
            <tr><td>bleu</td><td className="mono">bleu</td><td className="mono">bleue</td><td className="mono">bleus</td><td className="mono">bleues</td></tr>
            <tr><td>noir</td><td className="mono">noir</td><td className="mono">noire</td><td className="mono">noirs</td><td className="mono">noires</td></tr>
            <tr><td>blanc</td><td className="mono">blanc</td><td className="mono">blanche</td><td className="mono">blancs</td><td className="mono">blanches</td></tr>
            <tr><td>gris</td><td className="mono">gris</td><td className="mono">grise</td><td className="mono">gris</td><td className="mono">grises</td></tr>
            <tr><td>vert</td><td className="mono">vert</td><td className="mono">verte</td><td className="mono">verts</td><td className="mono">vertes</td></tr>
            <tr><td>rouge / rose / jaune</td><td className="mono">rouge</td><td className="mono">rouge</td><td className="mono">rouges</td><td className="mono">rouges</td></tr>
          </tbody>
        </table>
        <div className="rule">
          Přídavné jméno končící na <b>-e</b> se v ženském rodě nemění (une montre rose).<br />
          Přídavné jméno končící na <b>-s</b> už -s v množném čísle nepřidává (gris → gris).<br />
          <b>marron</b> a <b>orange</b> jsou neměnné: des chaussures marron.
        </div>
        <div className="ex">
          <div>une robe <b>blanche</b> · des baskets <b>bleues</b> · un pantalon <b>bleu</b></div>
          <div>des parapluies <b>bleus</b> · une chemise <b>bleue</b> · des chemises <b>bleues</b></div>
          <div>un pull <b>noir</b> · une jupe <b>noire</b> · une montre <b>rose</b></div>
          <div>des bottes <b>blanches</b> · un chapeau <b>rouge</b> → des chapeaux <b>rouges</b></div>
          <div>des cravates <b>grises</b> · des crevettes <b>grises</b></div>
        </div>
      </Acc>

      <Acc title="5 · Zvratná slovesa (verbes pronominaux)" badge="se déplacer · se raser · s'endormir">
        <table className="tbl">
          <thead><tr><th>Osoba</th><th>se raser (holit se)</th><th>se déplacer</th><th>s'endormir</th></tr></thead>
          <tbody>
            <tr><td>je</td><td className="mono">je me rase</td><td className="mono">je me déplace</td><td className="mono">je m'endors</td></tr>
            <tr><td>tu</td><td className="mono">tu te rases</td><td className="mono">tu te déplaces</td><td className="mono">tu t'endors</td></tr>
            <tr><td>il / elle / on</td><td className="mono">il se rase</td><td className="mono">elle se déplace</td><td className="mono">on s'endort</td></tr>
            <tr><td>nous</td><td className="mono">nous nous rasons</td><td className="mono">nous nous déplaçons</td><td className="mono">nous nous endormons</td></tr>
            <tr><td>vous</td><td className="mono">vous vous rasez</td><td className="mono">vous vous déplacez</td><td className="mono">vous vous endormez</td></tr>
            <tr><td>ils / elles</td><td className="mono">ils se rasent</td><td className="mono">elles se déplacent</td><td className="mono">ils s'endorment</td></tr>
          </tbody>
        </table>
        <div className="rule">
          Zvratné zájmeno se mění podle osoby: <b>me, te, se, nous, vous, se</b>. Před samohláskou m', t', s'.<br />
          Zápor obklopí celý blok: <b>Il ne se rase pas.</b> · <b>Je ne m'endors pas.</b>
        </div>
      </Acc>

      <Acc title="6 · Rozkazovací způsob (l'impératif)" badge="Tournez ! · Prenez ! · Veuillez…">
        <div className="rule">
          Rozkaz = tvar slovesa bez zájmena. Tři osoby: <b>tu</b>, <b>nous</b>, <b>vous</b>.<br />
          U sloves na -er zmizí v osobě „tu“ koncové -s: tu tournes → <b>Tourne !</b>
        </div>
        <table className="tbl">
          <thead><tr><th>Sloveso</th><th>tu</th><th>nous</th><th>vous</th></tr></thead>
          <tbody>
            <tr><td>tourner</td><td className="mono">tourne</td><td className="mono">tournons</td><td className="mono">tournez</td></tr>
            <tr><td>prendre</td><td className="mono">prends</td><td className="mono">prenons</td><td className="mono">prenez</td></tr>
            <tr><td>monter</td><td className="mono">monte</td><td className="mono">montons</td><td className="mono">montez</td></tr>
            <tr><td>avoir</td><td className="mono">aie</td><td className="mono">ayons</td><td className="mono">ayez</td></tr>
            <tr><td>être</td><td className="mono">sois</td><td className="mono">soyons</td><td className="mono">soyez</td></tr>
          </tbody>
        </table>
        <div className="ex">
          <div><b>Tournez</b> à gauche, puis <b>tournez</b> à droite.</div>
          <div><b>Prenez</b> la rue Victor Hugo, puis <b>continuez</b> tout droit.</div>
          <div><b>Traversez</b> le Pont Neuf.</div>
          <div><b>Apprenez</b> ça. · <b>Veuillez</b> le / la lire. (velmi zdvořilý rozkaz)</div>
        </div>
      </Acc>

      <Acc title="7 · Předložky místa + stažení s de" badge="semaines 11 + 12">
        <div className="rule">
          Bez de: <b>sur, sous, devant, derrière, entre</b>.<br />
          S de: <b>à gauche de, à droite de, à côté de, en face de</b> → a tady platí <b>de + le = du</b>, <b>de + les = des</b>.
        </div>
        <div className="ex">
          <div>Je place la télé <b>en face du</b> canapé.</div>
          <div>On place le tableau <b>entre</b> les deux fenêtres.</div>
          <div>Je place le tapis <b>sous</b> la table.</div>
          <div>La lampe est <b>à droite du</b> meuble, <b>à côté des</b> fenêtres.</div>
        </div>
      </Acc>

      <Acc title="8 · Frekvence a spojovací výrazy" badge="semaine 3">
        <div className="rule">
          Příslovce frekvence stojí <b>hned za časovaným slovesem</b>: souvent, toujours, parfois.<br />
          <b>jamais</b> funguje jako zápor: ne… jamais (a člen se pak mění na de).
        </div>
        <div className="ex">
          <div>Je vais <b>souvent</b> au parc.</div>
          <div>Il n'a <b>jamais</b> d'argent.</div>
          <div>J'aime travailler <b>sans</b> ma sœur, <b>mais</b> je vais au parc <b>avec</b> mes amis <b>parce que</b> j'aime la nature.</div>
          <div>Je vais à la gare <b>pour</b> prendre le train. (pour + infinitiv!)</div>
        </div>
      </Acc>

      <Acc title="9 · Otázky a číslovky" badge="Combien ? Où ? Comment ?">
        <div className="rule">
          Tři způsoby otázky: intonací (<b>Ça coûte combien ?</b>), s <b>est-ce que</b> (<b>Combien est-ce que ça coûte ?</b>), inverzí (<b>Où est l'arrêt ?</b>).
        </div>
        <div className="ex">
          <div><b>Combien</b> ça coûte ? / Ça coûte <b>combien</b> ?</div>
          <div><b>Où</b> est l'arrêt de bus, s'il vous plaît ?</div>
          <div><b>Comment</b> tu te déplaces ? · Vous payez <b>comment</b> ? — Par carte / En espèces.</div>
          <div><b>Qu'est-ce que</b> tu choisis ? — Je choisis le plat du jour.</div>
        </div>
        <div className="rule">
          Číslovky: <b>cent</b> má -s jen jako násobek na konci (deux cents × trois cent cinquante-deux).
          <b> mille</b> je vždy neměnné. <b>million</b> a <b>milliard</b> jsou podstatná jména → deux millions, deux milliards.
        </div>
      </Acc>

      <Acc title="10 · Počasí a roční období" badge="semaine 5">
        <table className="tbl">
          <thead><tr><th>Konstrukce</th><th>Kdy</th><th>Příklad</th></tr></thead>
          <tbody>
            <tr><td className="mono">Il + sloveso</td><td>jev je sloveso</td><td>Il pleut. Il neige.</td></tr>
            <tr><td className="mono">Il fait + přídavné jméno / číslo</td><td>pocit, teplota</td><td>Il fait beau. Il fait -10 °C.</td></tr>
            <tr><td className="mono">Il y a du / de la / de l' + podst. jm.</td><td>jev je věc</td><td>Il y a du vent. Il y a du soleil.</td></tr>
          </tbody>
        </table>
        <div className="rule">
          Roční období: <b>en</b> hiver, <b>au</b> printemps, <b>en</b> été, <b>en</b> automne (jaro má jako jediné „au“).<br />
          Měsíce: <b>en</b> janvier, <b>en</b> avril. Části měsíce: début / mi- / fin septembre.
        </div>
      </Acc>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   3) ŘEŠENÉ ÚLOHY
   ═══════════════════════════════════════════════════════════════════ */

const DIFF = { e:{ c:"e", t:"Lehké ✨" }, m:{ c:"m", t:"Střední ⚡" }, h:{ c:"h", t:"Těžké 🔥" } };

function Problem({ p, n }) {
  const [open, setOpen] = useState(false);
  const d = DIFF[p.d];
  return (
    <div className="prob">
      <div className="prob-head">
        <span className={"diff " + d.c}>{d.t}</span>
        <span className="badge" style={{ fontSize:"11px", letterSpacing:".14em", textTransform:"uppercase", color:"#5b5750" }}>{p.topic}</span>
      </div>
      <div className="task"><b style={{ color:"#c8102e" }}>{n}.</b> {p.task}</div>
      <button className="reveal-btn" onClick={() => setOpen(o => !o)}>{open ? "Skrýt řešení" : "Ukázat řešení"}</button>
      {open && (
        <div className="sol">
          <div className="step"><div className="lab">Zadání říká</div>{p.given}</div>
          <div className="step"><div className="lab">Pravidlo</div>{p.rule}</div>
          <div className="step">
            <div className="lab">Postup</div>
            <ol>{p.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
          </div>
          <div className="res">Výsledek: {p.res}</div>
        </div>
      )}
    </div>
  );
}

function ProblemsTab() {
  const [filter, setFilter] = useState("all");
  const list = filter === "all" ? PROBLEMS : PROBLEMS.filter(p => p.d === filter);
  return (
    <div>
      <SectionHead no="Partie III" title="Řešené úlohy"
        lede="Šestnáct typových úloh přesně toho druhu, jaký bývá v testu. Nejdřív si je zkus vyřešit na papír, teprve potom odkryj řešení — každé má pravidlo, postup krok za krokem a výsledek." />
      <div className="modes">
        {[["all","Všechny"],["e","Lehké ✨"],["m","Střední ⚡"],["h","Těžké 🔥"]].map(([k, t]) => (
          <button key={k} className={"mode" + (filter === k ? " on" : "")} onClick={() => setFilter(k)}>{t}</button>
        ))}
      </div>
      {list.map((p, i) => <Problem key={p.task} p={p} n={i + 1} />)}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   4) CVIČENÍ — pět režimů
   ═══════════════════════════════════════════════════════════════════ */

function syllables(fr) {
  const t = (fr || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const m = t.match(/[aeiouy]+/g);
  return m ? m.length : 1;
}

function stripPron(s) {
  return (s || "")
    .replace(/^(j['’]|je |tu |il \/ elle |ils \/ elles |il |elle |on |nous |vous |ils |elles )/i, "")
    .trim();
}

function conjOk(user, form) {
  const base = stripPron(form);
  const variants = [base.replace(/\([^)]*\)/g, "").trim()];
  const parens = base.match(/\(([^)]*)\)/g);
  if (parens) parens.forEach(p => variants.push(p.replace(/[()]/g, "").trim()));
  const u = stripPron(user).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ").trim();
  return variants.some(v => {
    const n = v.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ").trim();
    return n === u;
  });
}

/* ── 4a) Výběr z možností ── */
function ModeChoice({ items, record }) {
  const [order, setOrder] = useState(() => shuffleArray(items.map((_, i) => i)));
  const [i, setI] = useState(0);
  const [pick, setPick] = useState(null);
  const [dir, setDir] = useState("fr-cz");

  useEffect(() => { setOrder(shuffleArray(items.map((_, i) => i))); setI(0); setPick(null); }, [items]);

  const it = items[order[i % order.length]];
  const opts = useMemo(() => {
    if (!it) return [];
    const others = shuffleArray(items.filter(x => x.cz !== it.cz && x.fr !== it.fr)).slice(0, 3);
    return shuffleArray([it, ...others]);
  }, [it, items]);

  if (!it) return <p className="lede">Pro tento výběr nejsou slovíčka.</p>;
  const ask = dir === "fr-cz" ? it.fr : it.cz;
  const key = dir === "fr-cz" ? "cz" : "fr";

  const choose = (o) => {
    if (pick !== null) return;
    setPick(o);
    record(it.cat, opts[o][key] === it[key]);
  };
  const next = () => { setPick(null); setI(v => v + 1); if ((i + 1) % order.length === 0) setOrder(shuffleArray(items.map((_, i2) => i2))); };

  return (
    <div className="card">
      <div className="modes">
        <button className={"mode" + (dir === "fr-cz" ? " on" : "")} onClick={() => { setDir("fr-cz"); setPick(null); }}>FR → CZ</button>
        <button className={"mode" + (dir === "cz-fr" ? " on" : "")} onClick={() => { setDir("cz-fr"); setPick(null); }}>CZ → FR</button>
      </div>
      <div className="prompt-sub">{it.cat}</div>
      <div className="prompt-big">{dir === "fr-cz" ? <Fr t={ask} g={it.g} /> : ask}</div>
      <div style={{ marginTop:"14px" }}>
        {opts.map((o, oi) => {
          let style = {};
          if (pick !== null) {
            if (o[key] === it[key]) style = { borderColor:"#1f7a45", borderWidth:"2px", background:"#eef7f1" };
            else if (oi === pick) style = { borderColor:"#b32020", borderWidth:"2px", background:"#fbeeee" };
          }
          return (
            <div key={oi} className="opt" style={style} onClick={() => choose(oi)}>
              {key === "fr" ? <Fr t={o.fr} g={o.g} /> : o.cz}
            </div>
          );
        })}
      </div>
      {pick !== null && (
        <div className="navrow">
          <span style={{ alignSelf:"center", color:"#5b5750", fontSize:"14px" }}>
            {opts[pick][key] === it[key] ? "Správně." : "Správně je: " + it[key]}
          </span>
          <button className="btn red" onClick={next}>Další →</button>
        </div>
      )}
    </div>
  );
}

/* ── 4b) Psaní slovíček ── */
function ModeWrite({ items, record }) {
  const [order, setOrder] = useState(() => shuffleArray(items.map((_, i) => i)));
  const [i, setI] = useState(0);
  const [val, setVal] = useState("");
  const [res, setRes] = useState(null);
  const [hint, setHint] = useState(false);
  const [dir, setDir] = useState("cz-fr");

  useEffect(() => { setOrder(shuffleArray(items.map((_, i) => i))); setI(0); setVal(""); setRes(null); setHint(false); }, [items]);

  const it = items[order[i % order.length]];
  if (!it) return <p className="lede">Pro tento výběr nejsou slovíčka.</p>;

  const ask = dir === "cz-fr" ? it.cz : it.fr;
  const solution = dir === "cz-fr" ? it.fr : it.cz;

  const check = () => {
    if (res) return;
    const ok = answerOk(val, [solution]);
    setRes(ok ? "ok" : "bad");
    record(it.cat, ok);
  };
  const next = () => { setVal(""); setRes(null); setHint(false); setI(v => v + 1); };

  return (
    <div className="card">
      <div className="modes">
        <button className={"mode" + (dir === "cz-fr" ? " on" : "")} onClick={() => { setDir("cz-fr"); setVal(""); setRes(null); setHint(false); }}>CZ → FR</button>
        <button className={"mode" + (dir === "fr-cz" ? " on" : "")} onClick={() => { setDir("fr-cz"); setVal(""); setRes(null); setHint(false); }}>FR → CZ</button>
      </div>
      <div className="prompt-sub">Napiš překlad — členy, diakritiku i velká písmena beru velkoryse</div>
      <div className="prompt-big">{dir === "fr-cz" ? <Fr t={ask} g={it.g} /> : ask}</div>
      <input className="drill-input" value={val} autoComplete="off" spellCheck="false"
        onChange={e => setVal(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter") { res ? next() : check(); } }}
        placeholder={dir === "cz-fr" ? "odpověď francouzsky…" : "odpověď česky…"} />
      <div style={{ display:"flex", gap:"10px", flexWrap:"wrap" }}>
        {!res && <button className="btn" onClick={check}>Zkontrolovat</button>}
        {!res && <button className="btn red" onClick={() => setHint(true)}>Nápověda</button>}
        {res && <button className="btn red" onClick={next}>Další →</button>}
      </div>
      {hint && !res && (
        <div className="verdict" style={{ borderColor:"#a86a00", color:"#a86a00" }}>
          Nápověda: {syllables(solution)} {syllables(solution) === 1 ? "slabika" : syllables(solution) < 5 ? "slabiky" : "slabik"} · kategorie „{it.cat}“
        </div>
      )}
      {res && (
        <div className={"verdict " + (res === "ok" ? "ok" : "bad")}>
          {res === "ok" ? "Správně!" : "Ještě ne."}
          <div className="sol2">Správně: <b>{solution}</b></div>
        </div>
      )}
    </div>
  );
}

/* ── 4c) Párování ── */
function ModePairs({ items, record }) {
  const SIZE = 6;
  const build = useCallback(() => shuffleArray(items).slice(0, SIZE), [items]);
  const [round, setRound] = useState(build);
  const [left, setLeft] = useState(() => shuffleArray(round));
  const [right, setRight] = useState(() => shuffleArray(round));
  const [selL, setSelL] = useState(null);
  const [selR, setSelR] = useState(null);
  const [done, setDone] = useState([]);
  const [err, setErr] = useState(null);

  const reset = useCallback(() => {
    const r = shuffleArray(items).slice(0, SIZE);
    setRound(r); setLeft(shuffleArray(r)); setRight(shuffleArray(r));
    setSelL(null); setSelR(null); setDone([]); setErr(null);
  }, [items]);

  useEffect(() => { reset(); }, [reset]);

  useEffect(() => {
    if (selL === null || selR === null) return;
    const ok = left[selL].fr === right[selR].fr;
    record(left[selL].cat, ok);
    if (ok) {
      setDone(d => [...d, left[selL].fr]);
      setSelL(null); setSelR(null); setErr(null);
    } else {
      setErr([selL, selR]);
      const t = setTimeout(() => { setSelL(null); setSelR(null); setErr(null); }, 700);
      return () => clearTimeout(t);
    }
  }, [selL, selR, left, right, record]);

  const finished = done.length === round.length && round.length > 0;

  return (
    <div className="card">
      <div className="prompt-sub">Spoj francouzský výraz s českým významem — {done.length} / {round.length}</div>
      <div className="prog"><i style={{ width: (round.length ? (done.length / round.length) * 100 : 0) + "%" }} /></div>
      <div className="pairs" style={{ marginTop:"14px" }}>
        <div>
          {left.map((it, i) => {
            const isDone = done.includes(it.fr);
            const cls = "pair-item" + (isDone ? " done" : selL === i ? " sel" : "") + (err && err[0] === i ? " err" : "");
            return <div key={"l" + i} className={cls} onClick={() => !isDone && setSelL(i)}><Fr t={it.fr} g={it.g} /></div>;
          })}
        </div>
        <div>
          {right.map((it, i) => {
            const isDone = done.includes(it.fr);
            const cls = "pair-item" + (isDone ? " done" : selR === i ? " sel" : "") + (err && err[1] === i ? " err" : "");
            return <div key={"r" + i} className={cls} onClick={() => !isDone && setSelR(i)}>{it.cz}</div>;
          })}
        </div>
      </div>
      {finished && (
        <div className="verdict ok" style={{ marginTop:"14px" }}>
          Hotovo — všech {round.length} dvojic sedí.
          <div style={{ marginTop:"10px" }}><button className="btn red" onClick={reset}>Další kolo →</button></div>
        </div>
      )}
      {!finished && <div style={{ marginTop:"14px" }}><button className="btn" onClick={reset}>Nové kolo</button></div>}
    </div>
  );
}

/* ── 4d) Překlad vět ── */
function ModeSentences({ record }) {
  const [order, setOrder] = useState(() => shuffleArray(SENTENCES.map((_, i) => i)));
  const [i, setI] = useState(0);
  const [dir, setDir] = useState("fr-cz");
  const [val, setVal] = useState("");
  const [shown, setShown] = useState(false);

  const s = SENTENCES[order[i % order.length]];
  const ask = dir === "fr-cz" ? s.fr : s.cz;
  const solution = dir === "fr-cz" ? s.cz : s.fr;

  const next = () => {
    setVal(""); setShown(false); setI(v => v + 1);
    if ((i + 1) % order.length === 0) setOrder(shuffleArray(SENTENCES.map((_, k) => k)));
  };

  return (
    <div className="card">
      <div className="modes">
        <button className={"mode" + (dir === "fr-cz" ? " on" : "")} onClick={() => { setDir("fr-cz"); setVal(""); setShown(false); }}>FR → CZ</button>
        <button className={"mode" + (dir === "cz-fr" ? " on" : "")} onClick={() => { setDir("cz-fr"); setVal(""); setShown(false); }}>CZ → FR</button>
      </div>
      <div className="prompt-sub">{s.topic} · přelož celou větu</div>
      <div className="prompt-big" style={{ fontSize:"clamp(19px,3.2vw,26px)" }}>{ask}</div>
      <textarea className="drill-input" rows={2} value={val} onChange={e => setVal(e.target.value)} placeholder="tvůj překlad…" />
      <div style={{ display:"flex", gap:"10px", flexWrap:"wrap" }}>
        {!shown && <button className="btn" onClick={() => { const ok = answerOk(val, [solution]); setShown(true); record(s.topic, ok); }}>Porovnat s řešením</button>}
        {shown && <button className="btn red" onClick={next}>Další věta →</button>}
      </div>
      {shown && (
        <div className={"verdict " + (answerOk(val, [solution]) ? "ok" : "bad")}>
          {answerOk(val, [solution]) ? "Sedí to." : "Porovnej se vzorem — u vět stačí, když se význam i stavba shodují."}
          <div className="sol2">Vzorové řešení: <b>{solution}</b></div>
        </div>
      )}
    </div>
  );
}

/* ── 4e) Časování sloves ── */
function ModeConj({ record }) {
  const pick = useCallback(() => ({
    v: Math.floor(Math.random() * CONJ.length),
    p: Math.floor(Math.random() * 6),
  }), []);
  const [cur, setCur] = useState(pick);
  const [val, setVal] = useState("");
  const [res, setRes] = useState(null);

  const verb = CONJ[cur.v];
  const form = verb.forms[cur.p];

  const check = () => {
    if (res) return;
    const ok = conjOk(val, form);
    setRes(ok ? "ok" : "bad");
    record("Časování sloves", ok);
  };
  const next = () => { setCur(pick()); setVal(""); setRes(null); };

  return (
    <div className="card">
      <div className="prompt-sub">Napiš tvar slovesa — zájmeno psát nemusíš</div>
      <div className="prompt-big">{PRONOUNS[cur.p]} … <span style={{ color:"#c8102e" }}>({verb.inf})</span></div>
      <div style={{ textAlign:"center", color:"#5b5750", fontSize:"14px" }}>{verb.cz}</div>
      <input className="drill-input" value={val} autoComplete="off" spellCheck="false"
        onChange={e => setVal(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter") { res ? next() : check(); } }}
        placeholder="tvar slovesa…" />
      <div style={{ display:"flex", gap:"10px", flexWrap:"wrap" }}>
        {!res && <button className="btn" onClick={check}>Zkontrolovat</button>}
        {res && <button className="btn red" onClick={next}>Další →</button>}
      </div>
      {res && (
        <div className={"verdict " + (res === "ok" ? "ok" : "bad")}>
          {res === "ok" ? "Správně!" : "Ještě ne."}
          <div className="sol2">Správný tvar: <b>{form}</b></div>
          {verb.note && <div className="sol2" style={{ fontSize:"14px", color:"#5b5750" }} dangerouslySetInnerHTML={{ __html: verb.note }} />}
        </div>
      )}
    </div>
  );
}

/* ── Zastřešující záložka cvičení se skóre ── */
function DrillTab() {
  const [mode, setMode] = useState("mc");
  const [week, setWeek] = useState("all");
  const [stats, setStats] = useState({});

  const record = useCallback((cat, ok) => {
    setStats(s => ({ ...s, [cat]: { ok: (s[cat] ? s[cat].ok : 0) + (ok ? 1 : 0), n: (s[cat] ? s[cat].n : 0) + 1 } }));
  }, []);

  const items = useMemo(() => week === "all" ? ALL_ITEMS : ALL_ITEMS.filter(it => it.week === week), [week]);

  const totals = Object.values(stats).reduce((a, v) => ({ ok: a.ok + v.ok, n: a.n + v.n }), { ok:0, n:0 });
  const pct = totals.n ? Math.round((totals.ok / totals.n) * 100) : 0;
  const msg = !totals.n ? "" : pct >= 90 ? "Výborně! Máš to perfektně zvládnuté."
    : pct >= 70 ? "Dobře! Skoro všechno ti sedí."
    : pct >= 50 ? "Mohlo by to být lepší, ale jdeš správným směrem."
    : "Potřebuješ ještě opakovat. Vrať se do slovníku a zkus to znovu.";

  const needsWeek = mode === "mc" || mode === "write" || mode === "pairs";

  return (
    <div>
      <SectionHead no="Partie IV" title="Cvičení"
        lede="Pět režimů: výběr z možností, psaní slovíček, párování, překlad vět a časování sloves. Skóre se počítá napříč všemi režimy podle kategorií." />

      <div className="modes">
        {[["mc","Výběr z možností"],["write","Psaní slovíček"],["pairs","Párování"],["sent","Překlad vět"],["conj","Časování sloves"]].map(([k, t]) => (
          <button key={k} className={"mode" + (mode === k ? " on" : "")} onClick={() => setMode(k)}>{t}</button>
        ))}
      </div>

      {needsWeek && (
        <div className="modes">
          <button className={"mode" + (week === "all" ? " on" : "")} onClick={() => setWeek("all")}>Všechny týdny</button>
          {WEEKS.map(w => (
            <button key={w.id} className={"mode" + (week === w.id ? " on" : "")} onClick={() => setWeek(w.id)}>{w.label}</button>
          ))}
        </div>
      )}

      {mode === "mc" && <ModeChoice items={items} record={record} />}
      {mode === "write" && <ModeWrite items={items} record={record} />}
      {mode === "pairs" && <ModePairs items={items} record={record} />}
      {mode === "sent" && <ModeSentences record={record} />}
      {mode === "conj" && <ModeConj record={record} />}

      <div className="card red">
        <h3>Skóre</h3>
        {!totals.n ? <p className="lede">Zatím žádná odpověď. Skóre se objeví po první otázce.</p> : (
          <>
            <div className="scorebar">
              <span className="chip">Celkem: <b>{totals.ok} / {totals.n}</b></span>
              <span className="chip">Úspěšnost: <b>{pct} %</b></span>
            </div>
            <div className="prog"><i style={{ width: pct + "%" }} /></div>
            <p style={{ marginTop:"12px" }}>{msg}</p>
            <div className="cat">Podle kategorií</div>
            <table className="tbl">
              <tbody>
                {Object.entries(stats).sort((a, b) => b[1].n - a[1].n).map(([k, v]) => (
                  <tr key={k}>
                    <td>{k}</td>
                    <td className="mono" style={{ width:"90px" }}>{v.ok} / {v.n}</td>
                    <td className="mono" style={{ width:"70px" }}>{Math.round((v.ok / v.n) * 100)} %</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="btn" onClick={() => setStats({})}>Vynulovat skóre</button>
          </>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   5) KARTIČKY
   ═══════════════════════════════════════════════════════════════════ */

function FlashTab() {
  const [week, setWeek] = useState(WEEKS[0].id);
  const [deck, setDeck] = useState(() => ALL_ITEMS.filter(it => it.week === WEEKS[0].id));
  const [i, setI] = useState(0);
  const [flip, setFlip] = useState(false);
  const [back, setBack] = useState("cz");

  useEffect(() => {
    setDeck(ALL_ITEMS.filter(it => it.week === week));
    setI(0); setFlip(false);
  }, [week]);

  const card = deck[i];
  const go = (d) => { setFlip(false); setI(v => (v + d + deck.length) % deck.length); };

  return (
    <div>
      <SectionHead no="Partie VI" title="Kartičky"
        lede="Klikni na kartičku a otoč ji. Projdi týden po týdnu — co ti sedne napoprvé, můžeš přeskočit, zbytek si zamíchej a dej znovu." />

      <div className="modes">
        {WEEKS.map(w => (
          <button key={w.id} className={"mode" + (week === w.id ? " on" : "")} onClick={() => setWeek(w.id)}>{w.label}</button>
        ))}
      </div>
      <div className="modes">
        <button className={"mode" + (back === "cz" ? " on" : "")} onClick={() => { setBack("cz"); setFlip(false); }}>Vpředu FR</button>
        <button className={"mode" + (back === "fr" ? " on" : "")} onClick={() => { setBack("fr"); setFlip(false); }}>Vpředu CZ</button>
        <button className="mode" onClick={() => { setDeck(d => shuffleArray(d)); setI(0); setFlip(false); }}>Zamíchat</button>
      </div>

      {card && (
        <>
          <div className="fcwrap">
            <div className={"fc" + (flip ? " flip" : "")} onClick={() => setFlip(f => !f)}>
              <div className="fc-face">
                <div className="big">{back === "cz" ? <Fr t={card.fr} g={card.g} /> : card.cz}</div>
                <div className="small">{card.cat}</div>
              </div>
              <div className="fc-face back">
                <div className="big">{back === "cz" ? card.cz : <Fr t={card.fr} g={card.g} />}</div>
                <div className="small">klikni pro otočení</div>
              </div>
            </div>
          </div>

          <div className="dotbar">
            {deck.map((_, di) => (
              <div key={di} className="dot" style={{ width:"12px", height:"12px", background: di === i ? "#c8102e" : "#eae3d6" }}
                onClick={() => { setI(di); setFlip(false); }} title={"Kartička " + (di + 1)} />
            ))}
          </div>

          <div className="navrow" style={{ maxWidth:"520px", margin:"14px auto 0" }}>
            <button className="btn" onClick={() => go(-1)}>← Předchozí</button>
            <span style={{ alignSelf:"center", color:"#5b5750" }}>{i + 1} / {deck.length}</span>
            <button className="btn" onClick={() => go(1)}>Další →</button>
          </div>
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   6) TAHÁK
   ═══════════════════════════════════════════════════════════════════ */

function CheatTab() {
  return (
    <div>
      <SectionHead no="Partie VII" title="Tahák — co se musíš naučit nazpaměť"
        lede="Všechna pravidla a tvary na jednom místě. Tohle si projdi ráno před testem." />

      <div className="card">
        <div className="cheat">
          <div>
            <div className="cat">Množství a členy</div>
            <div className="ex">
              <div>un peu <b>de</b> / beaucoup <b>de</b> / pas <b>de</b></div>
              <div>před samohláskou → <b>d'</b> (beaucoup d'amis)</div>
              <div>partitiv: <b>du</b> sel · <b>de la</b> viande · <b>de l'</b>eau · <b>des</b> croissants</div>
            </div>
          </div>
          <div>
            <div className="cat">Stažené členy</div>
            <div className="ex">
              <div>à + le = <b>au</b> · à + les = <b>aux</b></div>
              <div>de + le = <b>du</b> · de + les = <b>des</b></div>
              <div>à la / à l' a de la / de l' se nestahují</div>
            </div>
          </div>
          <div>
            <div className="cat">Doprava</div>
            <div className="ex">
              <div><b>en</b> bus, en métro, en train, en tramway, en voiture</div>
              <div><b>à</b> vélo, à trottinette, à pied</div>
            </div>
          </div>
          <div>
            <div className="cat">Shoda přídavných jmen</div>
            <div className="ex">
              <div>ž. rod + <b>e</b> · mn. č. + <b>s</b> · ž. mn. č. + <b>es</b></div>
              <div>blanc → <b>blanche</b> / blanches</div>
              <div>gris → <b>grise</b> / gris / grises</div>
              <div>rouge, rose, jaune → beze změny v ž. rodě</div>
              <div>marron, orange → <b>neměnné</b></div>
            </div>
          </div>
          <div>
            <div className="cat">Zvratná zájmena</div>
            <div className="ex">
              <div>me · te · se · nous · vous · se</div>
              <div>před samohláskou m' · t' · s'</div>
              <div>zápor: il <b>ne</b> se rase <b>pas</b></div>
            </div>
          </div>
          <div>
            <div className="cat">Předložky místa</div>
            <div className="ex">
              <div>bez de: sur · sous · devant · derrière · entre</div>
              <div>s de: à gauche de · à droite de · à côté de · en face de</div>
              <div>→ en face <b>du</b> canapé · à côté <b>des</b> fenêtres</div>
            </div>
          </div>
          <div>
            <div className="cat">Počasí</div>
            <div className="ex">
              <div>Il pleut. / Il neige.</div>
              <div>Il fait beau / froid / chaud / 30 °C.</div>
              <div>Il y a du vent / du soleil / de l'orage.</div>
              <div>en hiver · <b>au</b> printemps · en été · en automne</div>
            </div>
          </div>
          <div>
            <div className="cat">Frekvence a spojky</div>
            <div className="ex">
              <div>toujours · souvent · parfois · ne… jamais</div>
              <div>stojí <b>za</b> časovaným slovesem</div>
              <div>avec · sans · mais · parce que · pour (+ infinitiv)</div>
            </div>
          </div>
          <div>
            <div className="cat">Číslovky</div>
            <div className="ex">
              <div>cent · deux cent<b>s</b> · trois cent cinquante-deux</div>
              <div>mille · deux mille (nikdy -s)</div>
              <div>un million · deux million<b>s</b> · deux milliard<b>s</b></div>
            </div>
          </div>
          <div>
            <div className="cat">Otázky</div>
            <div className="ex">
              <div>Combien ça coûte ? / Ça coûte combien ?</div>
              <div>Où est… ? · Comment tu te déplaces ?</div>
              <div>Qu'est-ce que tu choisis ?</div>
              <div>Est-ce que je peux emprunter… ?</div>
            </div>
          </div>
          <div>
            <div className="cat">Zrádná dvojice</div>
            <div className="ex">
              <div><b>emprunter</b> = půjčit si OD někoho</div>
              <div><b>prêter</b> = půjčit někomu (me prêter)</div>
              <div><b>une fille</b> [fij] × <b>un fils</b> [fis]</div>
            </div>
          </div>
          <div>
            <div className="cat">Rozkaz (vous)</div>
            <div className="ex">
              <div>Tournez · Prenez · Continuez · Traversez</div>
              <div>Apprenez ça. · Veuillez le lire.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card red">
        <h3>Časování sloves — seznam od profesora</h3>
        <p className="lede">Tato slovesa profesor v banque výslovně uvádí jako „connaître les formes de“. Přítomný čas, u vybraných i rozkazovací způsob.</p>
        <table className="tbl">
          <thead>
            <tr><th>Infinitiv</th><th>je</th><th>tu</th><th>il / elle</th><th>nous</th><th>vous</th><th>ils / elles</th></tr>
          </thead>
          <tbody>
            {CONJ.map(v => (
              <tr key={v.inf}>
                <td><b>{v.inf}</b><div style={{ fontSize:"13px", color:"#5b5750" }}>{v.cz}</div></td>
                {v.forms.map((f, i) => <td key={i} className="mono">{stripPron(f)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="cat">Rozkazovací způsob</div>
        <table className="tbl">
          <thead><tr><th>Sloveso</th><th>tu</th><th>nous</th><th>vous</th></tr></thead>
          <tbody>
            {CONJ.filter(v => v.imp).map(v => (
              <tr key={v.inf}><td><b>{v.inf}</b></td>{v.imp.map((f, i) => <td key={i} className="mono">{f}</td>)}</tr>
            ))}
          </tbody>
        </table>

        <div className="cat">Poznámky k jednotlivým slovesům</div>
        <ul>
          {CONJ.filter(v => v.note).map(v => (
            <li key={v.inf}><b>{v.inf}</b> — <span dangerouslySetInnerHTML={{ __html: v.note }} /></li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   APP
   ═══════════════════════════════════════════════════════════════════ */

const TABS = [
  { id:"vocab", n:"I",   label:"Slovník",      comp: VocabTab },
  { id:"gram",  n:"II",  label:"Gramatika",    comp: GrammarTab },
  { id:"prob",  n:"III", label:"Řešené úlohy", comp: ProblemsTab },
  { id:"drill", n:"IV",  label:"Cvičení",      comp: DrillTab },
  { id:"quiz",  n:"V",   label:"Kvíz",         comp: null },
  { id:"flash", n:"VI",  label:"Kartičky",     comp: FlashTab },
  { id:"cheat", n:"VII", label:"Tahák",        comp: CheatTab },
];

export default function App() {
  const [tab, setTab] = useState("vocab");
  const Active = TABS.find(t => t.id === tab);

  return (
    <div className="root">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet" />
      <style>{CSS}</style>

      <div className="tricolore" />
      <div className="shell">
        <header className="affiche">
          <div className="kicker">Banque · semaines 1–12</div>
          <h1>Français — příprava na test</h1>
          <div className="hairline" />
          <div className="sub">Slovní zásoba · gramatika · cvičení</div>
        </header>

        <div className="body">
          <nav className="sommaire">
            <div className="lbl">Sommaire</div>
            {TABS.map(t => (
              <button key={t.id} className={"navbtn" + (tab === t.id ? " on" : "")} onClick={() => setTab(t.id)}>
                <span className="n">{t.n}</span>{t.label}
              </button>
            ))}
          </nav>

          <main key={tab}>
            {tab === "quiz" ? (
              <div>
                <SectionHead no="Partie V" title="Kvíz"
                  lede={QUIZ.length + " otázek ze slovní zásoby i gramatiky, pořadí odpovědí se pokaždé zamíchá. Otázky s ☐ mají víc správných možností — vyber všechny a potvrď."} />
                <QuizEngine questions={QUIZ} accentColor="#1b3a8f" />
              </div>
            ) : Active && Active.comp ? <Active.comp /> : null}
          </main>
        </div>
      </div>
    </div>
  );
}
