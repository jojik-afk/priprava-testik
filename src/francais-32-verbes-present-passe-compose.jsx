// @title Francouzština – 32 sloves: présent + passé composé
// @subject Languages
// @topic Francouzština – časování: přítomný čas, passé composé, impératif
// @template mixed

import { useState, useMemo, useEffect, useCallback, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════════
   TÉMA „AFFICHE“ — ivory, trikolóra, dvojitý rámeček
   Skupiny sloves barevně v celém artefaktu:
   1. třída -er = bleu, 2. třída -ir = rouge, nepravidelná = noir
   Varianta: plakát s velkým „32“, vodorovné záložky (R7A má postranní rejstřík).
   ═══════════════════════════════════════════════════════════════════ */

const CSS = `
.root{
  --ivory:#fbf7f0; --paper:#fff; --ink:#1a1a1a; --muted:#5b5750;
  --bleu:#1b3a8f; --rouge:#c8102e; --line:#d8d0c2;
  --ok:#1f7a45; --bad:#b32020; --warn:#a86a00;
  background:var(--ivory); color:var(--ink);
  font-family:'Montserrat',system-ui,sans-serif; font-size:16px; line-height:1.65;
  min-height:100vh; position:relative;
}
.root *{box-sizing:border-box;}
.root ul{list-style:disc; padding-left:22px; margin:10px 0;}
.root ol{list-style:decimal; padding-left:24px; margin:10px 0;}
.root li{margin:4px 0;}
.root p{margin:10px 0;}
.root button{font-family:inherit;}
.root h1,.root h2,.root h3,.root h4{font-family:'Playfair Display',Georgia,serif; font-weight:700; margin:0; line-height:1.25;}
.tricolore{position:fixed; left:0; top:0; bottom:0; width:6px; z-index:50;
  background:linear-gradient(to bottom,var(--bleu) 0 33.33%,#fff 33.33% 66.66%,var(--rouge) 66.66% 100%);}
.shell{padding-left:6px;}

/* plakát */
.poster{max-width:1120px; margin:0 auto; padding:28px 22px 18px; display:flex; gap:22px; align-items:center;}
.poster .big{font-family:'Playfair Display',serif; font-weight:900; font-size:clamp(76px,14vw,150px); line-height:.8; color:var(--rouge); letter-spacing:-.04em;}
.poster .kick{font-size:12px; letter-spacing:.26em; text-transform:uppercase; color:var(--bleu); font-weight:700;}
.poster h1{font-size:clamp(26px,4.6vw,46px); color:var(--bleu); font-weight:900; margin-top:4px;}
.poster h1 em{color:var(--rouge);}
.poster .sub{font-size:14px; color:var(--muted); margin-top:6px;}

/* záložky */
.tabbar{position:sticky; top:0; z-index:40; background:var(--ivory); border-top:3px double var(--bleu); border-bottom:3px double var(--bleu);}
.tabs{max-width:1120px; margin:0 auto; display:flex; overflow-x:auto; scrollbar-width:thin; padding:0 16px;}
.tab{flex-shrink:0; background:transparent; border:none; border-bottom:4px solid transparent; padding:12px 14px; min-height:48px; cursor:pointer; font-size:14px; font-weight:600; color:var(--ink); transition:all .45s ease; white-space:nowrap;}
.tab:hover{color:var(--bleu); background:#f3ede2;}
.tab.on{border-bottom-color:var(--rouge); color:var(--bleu); font-weight:700; background:#fff;}

main{max-width:1120px; margin:0 auto; padding:26px 22px 90px;}
main > *{min-width:0;}
.fade{animation:fadeIn .45s ease;}
@keyframes fadeIn{from{opacity:0; transform:translateY(8px);} to{opacity:1; transform:none;}}

.sect-title{display:flex; gap:12px; align-items:baseline; flex-wrap:wrap; margin-bottom:4px;}
.sect-title h2{font-size:clamp(23px,3.6vw,32px); color:var(--bleu);}
.sect-title .no{font-family:'Playfair Display',serif; color:var(--rouge); letter-spacing:.14em; text-transform:uppercase; font-size:14px;}
.lede{color:var(--muted); border-bottom:1px solid var(--line); padding-bottom:14px; margin:0 0 20px;}
.h3{font-size:20px; margin:24px 0 8px; color:var(--bleu);}

.card{background:var(--paper); border:3px double var(--bleu); padding:18px 20px; margin-bottom:18px;}
.card.red{border-color:var(--rouge);}
.card h3{font-size:20px; margin-bottom:8px;}
.grid2{display:grid; grid-template-columns:1fr 1fr; gap:18px;}
.grid3{display:grid; grid-template-columns:repeat(3,1fr); gap:16px;}
.grid2 > *, .grid3 > *{min-width:0;}

.g-er{color:var(--bleu);} .g-ir{color:var(--rouge);} .g-irr{color:var(--ink);}
.bd-er{border-color:var(--bleu)!important;} .bd-ir{border-color:var(--rouge)!important;} .bd-irr{border-color:var(--ink)!important;}
.end{color:var(--rouge); font-weight:700;}
.agr{color:var(--rouge); font-weight:700;}
.boot{background:#fde8ea;}
.house{font-size:14px;}

.rule{background:#f7f3ea; border-left:4px solid var(--rouge); padding:12px 16px; margin:12px 0;}
.rule b{color:var(--bleu);}
.note{background:#fff6e0; border-left:4px solid var(--warn); padding:10px 14px; margin:12px 0; font-size:15px;}
.ex{font-family:'Courier New',monospace; font-size:15.5px; background:#fff; border:1px solid var(--line); padding:10px 14px; margin:10px 0;}
.ex div{padding:2px 0;}
.ex .cz{color:var(--muted); font-family:'Montserrat',sans-serif; font-size:13.5px;}
.tblwrap{overflow-x:auto;}
.tbl{width:100%; border-collapse:collapse; margin:10px 0; font-size:15.5px;}
.tbl th,.tbl td{border:1px solid var(--line); padding:7px 10px; text-align:left; vertical-align:top;}
.tbl th{background:#f2ece1; font-family:'Playfair Display',serif; font-size:14px; letter-spacing:.05em;}
.tbl td.pr{color:var(--muted); width:1%; white-space:nowrap;}

/* vzorec */
.formula{display:flex; flex-wrap:wrap; gap:10px; align-items:stretch; margin:16px 0;}
.formula .blk{flex:1 1 150px; border:3px double var(--bleu); background:#fff; padding:12px; text-align:center;}
.formula .blk.r{border-color:var(--rouge);}
.formula .blk .k{font-size:11px; letter-spacing:.18em; text-transform:uppercase; color:var(--muted); font-weight:700;}
.formula .blk .v{font-family:'Playfair Display',serif; font-size:22px; font-weight:700; color:var(--bleu); margin-top:4px;}
.formula .blk.r .v{color:var(--rouge);}
.formula .plus{align-self:center; font-family:'Playfair Display',serif; font-size:30px; color:var(--rouge); font-weight:900;}

/* akordeon */
.acc{border:1px solid var(--line); background:#fff; margin-bottom:12px;}
.acc-head{width:100%; display:flex; gap:12px; align-items:center; justify-content:space-between; background:#fff; border:none; padding:14px 16px; min-height:50px; cursor:pointer; text-align:left; transition:background .45s ease;}
.acc-head:hover{background:#faf7f1;}
.acc-head .t{font-family:'Playfair Display',serif; font-weight:700; font-size:18px; color:var(--ink);}
.acc-head .t .n{color:var(--rouge); margin-right:8px;}
.acc-head .chev{color:var(--rouge); transition:transform .45s ease;}
.acc-head.open .chev{transform:rotate(90deg);}
.acc-body{padding:4px 18px 18px; border-top:1px solid var(--line);}

/* tlačítka */
.btn{background:#fff; border:2px solid var(--bleu); color:var(--bleu); padding:10px 18px; min-height:44px; font-size:14px; font-weight:700; letter-spacing:.05em; text-transform:uppercase; cursor:pointer; transition:all .45s ease;}
.btn:hover{background:var(--bleu); color:#fff;}
.btn.red{border-color:var(--rouge); color:var(--rouge);}
.btn.red:hover{background:var(--rouge); color:#fff;}
.btn.solid{background:var(--bleu); color:#fff;}
.btn.solid:hover{background:#13296a;}
.btn:disabled{opacity:.4; cursor:default;}
.row{display:flex; gap:8px; flex-wrap:wrap; align-items:center;}
.chip{background:#fff; border:1px solid var(--line); padding:8px 12px; min-height:44px; cursor:pointer; font-size:14px; font-weight:600; transition:all .45s ease;}
.chip:hover{border-color:var(--bleu);}
.chip.on{background:var(--bleu); color:#fff; border-color:var(--bleu);}
.chip.on.r{background:var(--rouge); border-color:var(--rouge);}

/* klikací příčestí */
.ppgrid{display:grid; grid-template-columns:repeat(auto-fill,minmax(150px,1fr)); gap:8px; margin:12px 0;}
.ppcell{border:1px solid var(--line); background:#fff; padding:8px 10px; cursor:pointer; min-height:56px; transition:all .45s ease; text-align:left;}
.ppcell:hover{border-color:var(--bleu);}
.ppcell .i{font-weight:700; font-size:15px;}
.ppcell .p{font-family:'Playfair Display',serif; font-size:18px; color:var(--rouge); font-weight:700;}
.ppcell .q{color:#b9b0a0; letter-spacing:.2em;}

/* dům être */
.maison{max-width:520px; margin:16px auto;}
.maison .roof{height:70px; background:var(--rouge); clip-path:polygon(50% 0,100% 100%,0 100%); display:flex; align-items:flex-end; justify-content:center; color:#fff; font-family:'Playfair Display',serif; font-weight:900; font-size:18px; padding-bottom:8px;}
.maison .body{border:3px double var(--rouge); border-top:none; background:#fff; padding:12px 14px; display:grid; grid-template-columns:1fr 1fr; gap:6px 14px; font-size:15px;}
.maison .body div{border-bottom:1px dotted var(--line); padding:3px 0;}
.maison .body .mine{font-weight:700; color:var(--rouge);}

/* karty sloves */
.vcards{display:grid; grid-template-columns:repeat(auto-fill,minmax(330px,1fr)); gap:16px;}
.vcard{background:#fff; border:3px double var(--bleu); padding:14px 16px; min-width:0;}
.vcard .hd{display:flex; justify-content:space-between; gap:10px; align-items:baseline; flex-wrap:wrap; border-bottom:1px solid var(--line); padding-bottom:6px; margin-bottom:8px;}
.vcard .inf{font-family:'Playfair Display',serif; font-size:24px; font-weight:700;}
.vcard .cz{color:var(--muted); font-size:14px;}
.vcard .meta{font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:var(--muted); font-weight:700;}
.vcard .cols{display:grid; grid-template-columns:1fr 1.25fr; gap:12px;}
.vcard .cols > *{min-width:0;}
.vcard .ct{font-size:11px; letter-spacing:.16em; text-transform:uppercase; color:var(--rouge); font-weight:700; margin-bottom:2px;}
.vcard .fl{font-size:15px; padding:1px 0; line-height:1.55;}
.vcard .fl .pn{color:var(--muted);}
.vcard .imp{margin-top:8px; padding-top:6px; border-top:1px dotted var(--line); font-size:15px;}
.vcard .tip{margin-top:8px; font-size:13.5px; color:var(--muted); background:#f7f3ea; padding:6px 10px;}
.hid{background:#efe9dc; color:transparent; cursor:pointer; user-select:none; border-radius:0; padding:0 4px; transition:all .45s ease;}
.hid:hover{background:#e4dccb;}
.search{width:100%; padding:12px 14px; border:1px solid var(--bleu); font-size:16px; font-family:inherit; margin-bottom:12px; background:#fff; border-radius:0;}

/* kartičky */
.fc-scene{perspective:1200px; max-width:560px; margin:0 auto;}
.fc{position:relative; height:360px; transform-style:preserve-3d; transition:transform .45s ease; cursor:pointer;}
.fc.flip{transform:rotateY(180deg);}
.fc-face{position:absolute; inset:0; backface-visibility:hidden; -webkit-backface-visibility:hidden; background:#fff; border:3px double var(--bleu); padding:18px 22px; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; overflow:auto;}
.fc-back{transform:rotateY(180deg); border-color:var(--rouge);}
.fc-face .lab{font-size:11px; letter-spacing:.2em; text-transform:uppercase; color:var(--muted); font-weight:700;}
.fc-face .w{font-family:'Playfair Display',serif; font-size:42px; font-weight:900; margin:8px 0;}
.fc-face .tbl{max-width:420px;}
.dots{display:flex; flex-wrap:wrap; gap:6px; justify-content:center; margin:14px 0;}
.dot{width:16px; height:16px; border-radius:50%; background:#cfc6b5; cursor:pointer; border:none; padding:0; transition:background .45s ease;}
.dot.cur{background:var(--bleu);} .dot.known{background:var(--ok);} .dot.unk{background:var(--rouge);}

/* drill */
.drill{background:#fff; border:3px double var(--bleu); padding:22px; max-width:680px; margin:0 auto;}
.drill .task{font-size:13px; letter-spacing:.14em; text-transform:uppercase; color:var(--muted); font-weight:700;}
.drill .verb{font-family:'Playfair Display',serif; font-size:32px; font-weight:900; margin:4px 0 2px;}
.drill .tense{display:inline-block; padding:3px 10px; font-size:13px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:#fff; background:var(--bleu); margin-top:4px;}
.drill .tense.pc{background:var(--rouge);}
.drill .tense.imp{background:var(--ink);}
.ans-line{display:flex; gap:10px; align-items:center; margin:18px 0 10px; font-size:22px; flex-wrap:wrap;}
.ans-line .pn{font-family:'Playfair Display',serif; font-weight:700; color:var(--muted);}
.inp{flex:1; min-width:160px; font-size:20px; padding:10px 12px; border:none; border-bottom:3px solid var(--bleu); background:#f5f7fc; font-family:inherit; border-radius:0;}
.inp:focus{outline:2px solid var(--rouge); outline-offset:2px;}
.inp.ok{border-color:var(--ok); background:#eef7f1;} .inp.bad{border-color:var(--bad); background:#fbeeee;}
.fb{margin-top:12px; padding:12px 14px; border-left:4px solid; font-size:15px;}
.fb.ok{border-color:var(--ok); background:#eef7f1;} .fb.bad{border-color:var(--bad); background:#fbeeee;}
.fb .big{font-size:19px; font-weight:700; margin:2px 0;}
.statline{display:flex; gap:18px; flex-wrap:wrap; font-size:14px; color:var(--muted); margin:10px 0;}
.statline b{color:var(--ink);}
.ttable{width:100%; border-collapse:collapse;}
.ttable td{padding:6px 4px; border-bottom:1px dotted var(--line);}
.ttable td.pn{width:90px; color:var(--muted); font-family:'Playfair Display',serif; font-weight:700; font-size:17px;}
.ttable .inp{font-size:17px; padding:7px 9px; width:100%;}
.ttable .sol{font-size:13.5px; color:var(--ok); font-weight:700;}

/* mastery */
.mgrid{display:grid; grid-template-columns:repeat(auto-fill,minmax(112px,1fr)); gap:6px;}
.mcell{border:1px solid var(--line); padding:6px 8px; font-size:13.5px; font-weight:600; min-height:44px; display:flex; flex-direction:column; justify-content:center;}
.mcell .s{font-size:11px; font-weight:400; opacity:.85;}
.bar{height:10px; background:#ece5d6; position:relative; margin:4px 0 10px;}
.bar i{position:absolute; left:0; top:0; bottom:0; transition:width .8s ease;}

/* řešené příklady */
.wex{border:1px solid var(--line); background:#fff; padding:14px 16px; margin-bottom:12px;}
.wex .q{font-size:18px;}
.wex .q b{color:var(--bleu);}
.diff{font-size:11px; letter-spacing:.1em; text-transform:uppercase; padding:3px 9px; border:1px solid; font-weight:700; margin-right:8px;}
.diff.e{color:var(--ok);} .diff.m{color:var(--warn);} .diff.h{color:var(--rouge);}
.sol{margin-top:10px; border-top:1px solid var(--line); padding-top:8px;}
.sol .st{margin:6px 0;}
.sol .lab{font-size:11px; letter-spacing:.16em; text-transform:uppercase; color:var(--rouge); font-weight:700; margin-right:6px;}
.sol .res{border:3px double var(--rouge); padding:8px 12px; margin-top:10px; font-weight:700; font-size:17px;}

/* tahák */
.cheat{display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:16px;}
.cheat .card{margin:0;}
.cheat .mono{font-family:'Courier New',monospace; font-size:15px; line-height:1.7;}

/* kvíz */
.qz-dots{display:flex; gap:7px; justify-content:center; flex-wrap:wrap;}
.qz-dot{width:20px; height:20px; border-radius:50%; cursor:pointer; transition:background .45s ease;}
.qz-opt{padding:12px 16px; cursor:pointer; display:flex; gap:10px; align-items:center; font-size:16px; transition:all .45s ease; user-select:none; min-height:48px;}

@media (max-width:640px){
  .poster{flex-direction:column; align-items:flex-start; gap:10px; padding:20px 16px 14px;}
  .poster .big{font-size:72px; line-height:1;}
  main{padding:20px 16px 80px;}
  .grid2,.grid3{grid-template-columns:1fr;}
  .vcards{grid-template-columns:1fr;}
  .vcard .cols{grid-template-columns:1fr;}
  .fc{height:400px;}
  .fc-face .w{font-size:34px;}
  .drill{padding:16px;}
  .maison .body{grid-template-columns:1fr;}
  .ttable td.pn{width:70px;}
}
`;

/* ═══════════════════════ DATA ═══════════════════════ */

const PRON = ["je", "tu", "il/elle", "nous", "vous", "ils/elles"];
const AV = ["ai", "as", "a", "avons", "avez", "ont"];
const ET = ["suis", "es", "est", "sommes", "êtes", "sont"];
const AGR_TBL = ["(e)", "(e)", "(e)", "(e)s", "(e)(s)", "(e)s"];
const IMP_P = ["(tu)", "(nous)", "(vous)"];

const GROUP_LABEL = { er: "1. třída · -er", ir: "2. třída · -ir", irr: "nepravidelné" };

// pres: alternativy oddělené „|“ (první se zobrazuje)
const VERBS = [
  { inf: "avoir", cz: "mít", g: "irr", pres: ["ai", "as", "a", "avons", "avez", "ont"], pp: "eu", aux: "a", imp: ["aie", "ayons", "ayez"],
    tip: "Pomocné sloveso. Ils ONT (ne „sont“). Příčestí eu – čte se [y]." },
  { inf: "être", cz: "být", g: "irr", pres: ["suis", "es", "est", "sommes", "êtes", "sont"], pp: "été", aux: "a", imp: ["sois", "soyons", "soyez"],
    tip: "Passé composé tvoří s AVOIR: j'ai été (byl jsem). Vous êtes – jeden ze 3 tvarů na -tes." },
  { inf: "aller", cz: "jít, jet", g: "irr", pres: ["vais", "vas", "va", "allons", "allez", "vont"], pp: "allé", aux: "e",
    tip: "Présent úplně nepravidelný (vais… vont), příčestí ale pravidelné: allé. PC s ÊTRE + shoda." },
  { inf: "parler", cz: "mluvit", g: "er", reg: 1, pres: ["parle", "parles", "parle", "parlons", "parlez", "parlent"], pp: "parlé", aux: "a",
    tip: "Vzor 1. třídy: -e, -es, -e, -ons, -ez, -ent. Příčestí -é." },
  { inf: "penser", cz: "myslet", g: "er", reg: 1, pres: ["pense", "penses", "pense", "pensons", "pensez", "pensent"], pp: "pensé", aux: "a",
    tip: "Jako parler. penser à qqn = myslet na někoho." },
  { inf: "habiter", cz: "bydlet", g: "er", reg: 1, pres: ["habite", "habites", "habite", "habitons", "habitez", "habitent"], pp: "habité", aux: "a",
    tip: "Jako parler. Němé h → elize: j'habite, j'ai habité." },
  { inf: "aimer", cz: "mít rád, milovat", g: "er", reg: 1, pres: ["aime", "aimes", "aime", "aimons", "aimez", "aiment"], pp: "aimé", aux: "a",
    tip: "Jako parler. j'aime, j'ai aimé." },
  { inf: "acheter", cz: "kupovat", g: "er", boot: 1, pres: ["achète", "achètes", "achète", "achetons", "achetez", "achètent"], pp: "acheté", aux: "a",
    tip: "Botička: è tam, kde je koncovka němá (j'achète, ils achètent); nous achetons, vous achetez bez čárky." },
  { inf: "payer", cz: "platit", g: "er", boot: 1, pres: ["paie|paye", "paies|payes", "paie|paye", "payons", "payez", "paient|payent"], pp: "payé", aux: "a",
    tip: "y → i před němým -e: je paie (jde i je paye). nous payons, vous payez." },
  { inf: "manger", cz: "jíst", g: "er", reg: 1, pres: ["mange", "manges", "mange", "mangeons", "mangez", "mangent"], pp: "mangé", aux: "a",
    tip: "nous mangEons – e zůstává, aby g znělo [ž]. Jinak jako parler." },
  { inf: "faire", cz: "dělat", g: "irr", pres: ["fais", "fais", "fait", "faisons", "faites", "font"], pp: "fait", aux: "a",
    tip: "vous FAITES (nikdy „faisez“), ils FONT. Příčestí fait = stejné jako il fait." },
  { inf: "choisir", cz: "vybrat si", g: "ir", reg: 1, pres: ["choisis", "choisis", "choisit", "choisissons", "choisissez", "choisissent"], pp: "choisi", aux: "a",
    tip: "2. třída: -is, -is, -it, -issons, -issez, -issent. Příčestí -i (bez s!)." },
  { inf: "finir", cz: "skončit, dokončit", g: "ir", reg: 1, pres: ["finis", "finis", "finit", "finissons", "finissez", "finissent"], pp: "fini", aux: "a",
    tip: "Vzor 2. třídy. j'ai fini – příčestí bez -s." },
  { inf: "prendre", cz: "vzít", g: "irr", boot: 1, pres: ["prends", "prends", "prend", "prenons", "prenez", "prennent"], pp: "pris", aux: "a", imp: ["prends", "prenons", "prenez"],
    tip: "V plurálu zmizí d: nous prenons, ils preNNent (2× n). Příčestí pris." },
  { inf: "monter", cz: "vystoupit, jít nahoru", g: "er", reg: 1, pres: ["monte", "montes", "monte", "montons", "montez", "montent"], pp: "monté", aux: "e", imp: ["monte", "montons", "montez"],
    tip: "PC s ÊTRE: je suis monté(e). S předmětem ale s AVOIR: j'ai monté les valises (vynesl jsem kufry)." },
  { inf: "vouloir", cz: "chtít", g: "irr", boot: 1, pres: ["veux", "veux", "veut", "voulons", "voulez", "veulent"], pp: "voulu", aux: "a",
    tip: "Botička + koncovky -x, -x, -t. Příčestí voulu." },
  { inf: "pouvoir", cz: "moci", g: "irr", boot: 1, pres: ["peux", "peux", "peut", "pouvons", "pouvez", "peuvent"], pp: "pu", aux: "a",
    tip: "Dvojče vouloir: peux, peux, peut… peuvent. Příčestí jen pu." },
  { inf: "vendre", cz: "prodávat", g: "irr", reg: 1, pres: ["vends", "vends", "vend", "vendons", "vendez", "vendent"], pp: "vendu", aux: "a",
    tip: "Pravidelné -re: -s, -s, (nic), -ons, -ez, -ent. il vend bez -t! Příčestí -u." },
  { inf: "mettre", cz: "dát, položit, obléct", g: "irr", pres: ["mets", "mets", "met", "mettons", "mettez", "mettent"], pp: "mis", aux: "a",
    tip: "Singulár jedno t (mets, met), plurál dvě t (mettons). Příčestí mis." },
  { inf: "venir", cz: "přijít", g: "irr", boot: 1, pres: ["viens", "viens", "vient", "venons", "venez", "viennent"], pp: "venu", aux: "e",
    tip: "Botička: viens… venons, venez, vieNNent. PC s ÊTRE: elle est venue." },
  { inf: "connaître", cz: "znát", g: "irr", pres: ["connais", "connais", "connaît", "connaissons", "connaissez", "connaissent"], pp: "connu", aux: "a",
    tip: "il connaît (î jen před t). Plurál -ss-. Příčestí connu." },
  { inf: "savoir", cz: "vědět, umět", g: "irr", pres: ["sais", "sais", "sait", "savons", "savez", "savent"], pp: "su", aux: "a",
    tip: "sais, sais, sait. Příčestí su (jako pu, bu, vu – jedna slabika)." },
  { inf: "boire", cz: "pít", g: "irr", boot: 1, pres: ["bois", "bois", "boit", "buvons", "buvez", "boivent"], pp: "bu", aux: "a",
    tip: "Tři kmeny: boi- / buv- / boiv-. Příčestí bu." },
  { inf: "naître", cz: "narodit se", g: "irr", pres: ["nais", "nais", "naît", "naissons", "naissez", "naissent"], pp: "né", aux: "e",
    tip: "Skoro jen v PC: je suis né(e) = narodil(a) jsem se. S ÊTRE." },
  { inf: "mourir", cz: "zemřít", g: "irr", boot: 1, pres: ["meurs", "meurs", "meurt", "mourons", "mourez", "meurent"], pp: "mort", aux: "e",
    tip: "Botička eu/ou. PC s ÊTRE: il est mort, elle est morte." },
  { inf: "tomber", cz: "spadnout", g: "er", reg: 1, pres: ["tombe", "tombes", "tombe", "tombons", "tombez", "tombent"], pp: "tombé", aux: "e",
    tip: "Présent pravidelný, PC s ÊTRE: je suis tombé(e)." },
  { inf: "regarder", cz: "dívat se", g: "er", reg: 1, pres: ["regarde", "regardes", "regarde", "regardons", "regardez", "regardent"], pp: "regardé", aux: "a",
    tip: "Jako parler. regarder la télé – bez předložky." },
  { inf: "voir", cz: "vidět", g: "irr", boot: 1, pres: ["vois", "vois", "voit", "voyons", "voyez", "voient"], pp: "vu", aux: "a",
    tip: "y jen v nous/vous: voyons, voyez; ils voient. Příčestí vu." },
  { inf: "comprendre", cz: "rozumět", g: "irr", boot: 1, pres: ["comprends", "comprends", "comprend", "comprenons", "comprenez", "comprennent"], pp: "compris", aux: "a",
    tip: "Přesně jako prendre: comprenons, compreNNent. Příčestí compris." },
  { inf: "entendre", cz: "slyšet", g: "irr", reg: 1, pres: ["entends", "entends", "entend", "entendons", "entendez", "entendent"], pp: "entendu", aux: "a",
    tip: "Jako vendre. j'entends, j'ai entendu." },
  { inf: "attendre", cz: "čekat (na)", g: "irr", reg: 1, pres: ["attends", "attends", "attend", "attendons", "attendez", "attendent"], pp: "attendu", aux: "a",
    tip: "Jako vendre. attendre le bus = čekat NA autobus (bez předložky!)." },
  { inf: "gagner", cz: "vyhrát, vydělat", g: "er", reg: 1, pres: ["gagne", "gagnes", "gagne", "gagnons", "gagnez", "gagnent"], pp: "gagné", aux: "a",
    tip: "Jako parler. gn = [ň]." },
];
const VMAP = Object.fromEntries(VERBS.map(v => [v.inf, v]));

/* ═══════════════════════ HELPERS ═══════════════════════ */

const strip = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "");
const clean = s => s.toLowerCase().replace(/[’‘`´]/g, "'").replace(/[.!?,;:«»"]/g, " ").replace(/\s+/g, " ").trim();
const PRON_RE = /^(je |j'|j |tu |il |elle |on |nous |vous |ils |elles )/;
const first = f => f.split("|")[0];
const startsVowel = w => /^[aeiouhy]/.test(strip(w.toLowerCase()));
const pronFor = (p, form) => (p === "je" && startsVowel(form) ? "j'" : p);

function checkAnswer(input, answers, stripPron = true) {
  let a = clean(input);
  if (stripPron) a = a.replace(PRON_RE, "").trim();
  if (!a) return { ok: false, empty: true };
  for (const ans of answers) if (clean(ans) === a) return { ok: true, exact: true };
  for (const ans of answers) if (strip(clean(ans)) === strip(a)) return { ok: true, exact: false };
  return { ok: false };
}

// podměty pro drill jednotlivých tvarů (shoda u être)
const SUBJ = [
  { k: "je", i: 0, suf: ["", "e"] }, { k: "tu", i: 1, suf: ["", "e"] },
  { k: "il", i: 2, suf: [""] }, { k: "elle", i: 2, suf: ["e"] },
  { k: "nous", i: 3, suf: ["s", "es"] }, { k: "vous", i: 4, suf: ["", "e", "s", "es"] },
  { k: "ils", i: 5, suf: ["s"] }, { k: "elles", i: 5, suf: ["es"] },
];
const TSUBJ = [
  { k: "je", i: 0, suf: ["", "e"] }, { k: "tu", i: 1, suf: ["", "e"] }, { k: "il/elle", i: 2, suf: ["", "e"] },
  { k: "nous", i: 3, suf: ["s", "es"] }, { k: "vous", i: 4, suf: ["", "e", "s", "es"] }, { k: "ils/elles", i: 5, suf: ["s", "es"] },
];

function answersFor(v, tense, subj) {
  if (tense === "pres") return v.pres[subj.i].split("|");
  if (tense === "imp") return [v.imp[subj.i]];
  if (v.aux === "a") return [AV[subj.i] + " " + v.pp];
  return subj.suf.map(s => ET[subj.i] + " " + v.pp + s);
}

function shuffle(a) {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; }
  return b;
}

function pickWeighted(list, stats) {
  const w = list.map(v => {
    const s = stats[v.inf] || { ok: 0, bad: 0 };
    return Math.max(0.4, 1.5 + s.bad * 2 - s.ok * 0.5);
  });
  let r = Math.random() * w.reduce((a, b) => a + b, 0);
  for (let i = 0; i < list.length; i++) { r -= w[i]; if (r <= 0) return list[i]; }
  return list[list.length - 1];
}

const loadLS = (k, d) => { try { const s = localStorage.getItem(k); return s ? JSON.parse(s) : d; } catch { return d; } };
const saveLS = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } };

// zvýrazní koncovku u pravidelných sloves
function Form({ v, f }) {
  const stem = v.reg ? v.inf.slice(0, -2) : null;
  if (stem && f.startsWith(stem) && f.length > stem.length)
    return <span>{stem}<span className="end">{f.slice(stem.length)}</span></span>;
  return <span>{f}</span>;
}
const showForm = f => f.split("|").join(" / ");

function mastery(s) {
  if (!s || s.ok + s.bad === 0) return null;
  return s.ok / (s.ok + s.bad);
}
function mColor(m) {
  if (m === null) return { background: "#fff", color: "var(--ink)" };
  if (m >= 0.85) return { background: "#1f7a45", color: "#fff" };
  if (m >= 0.6) return { background: "#cfe8d6", color: "#123" };
  if (m >= 0.35) return { background: "#f6dfa8", color: "#3a2a00" };
  return { background: "#f3c4c4", color: "#4a0d0d" };
}

/* ═══════════════════════ UI PRVKY ═══════════════════════ */

function Acc({ n, title, children, open: o = false }) {
  const [open, setOpen] = useState(o);
  return (
    <div className="acc">
      <button className={"acc-head" + (open ? " open" : "")} onClick={() => setOpen(!open)}>
        <span className="t">{n && <span className="n">{n}</span>}{title}</span>
        <span className="chev">▶</span>
      </button>
      {open && <div className="acc-body fade">{children}</div>}
    </div>
  );
}

function Title({ no, children, lede }) {
  return (
    <>
      <div className="sect-title"><span className="no">{no}</span><h2>{children}</h2></div>
      {lede && <p className="lede">{lede}</p>}
    </>
  );
}

function PresTable({ v }) {
  return (
    <table className="tbl"><tbody>
      {v.pres.map((f, i) => (
        <tr key={i} className={v.boot && [0, 1, 2, 5].includes(i) ? "boot" : ""}>
          <td className="pr">{pronFor(PRON[i], f)}</td>
          <td>{f.split("|").map((x, j) => <span key={j}>{j > 0 && " / "}<Form v={v} f={x} /></span>)}</td>
        </tr>
      ))}
    </tbody></table>
  );
}

function PcTable({ v }) {
  const aux = v.aux === "e" ? ET : AV;
  return (
    <table className="tbl"><tbody>
      {aux.map((a, i) => (
        <tr key={i}>
          <td className="pr">{pronFor(PRON[i], a)}</td>
          <td>{a} <b>{v.pp}</b>{v.aux === "e" && <span className="agr">{AGR_TBL[i]}</span>}</td>
        </tr>
      ))}
    </tbody></table>
  );
}

/* ═══════════════════════ 1. START ═══════════════════════ */

function StartTab({ stats, go, resetStats }) {
  const tried = VERBS.filter(v => mastery(stats.v[v.inf]) !== null).length;
  const solid = VERBS.filter(v => (mastery(stats.v[v.inf]) ?? 0) >= 0.85 && (stats.v[v.inf].ok >= 3)).length;
  const t = stats.t;
  const pct = k => { const s = t[k]; return s && s.ok + s.bad ? Math.round(100 * s.ok / (s.ok + s.bad)) : 0; };
  const steps = [
    ["Pochop passé composé", "Projdi výklad krok za krokem a řešené příklady. Hlavně: avoir/être + příčestí, a kdy se dělá shoda.", "pc", "20 min"],
    ["Zopakuj présent", "Tři skupiny koncovek + „botička“. Většina sloves z tvého seznamu spadá do pár vzorů.", "pres", "15 min"],
    ["Tabulky se zakrytými tvary", "V záložce Tabulky zapni „Zakrýt tvary“ a odkrývej jeden po druhém – nejdřív si řekni tvar nahlas.", "tab", "20 min"],
    ["Kartičky", "Projeď balíček Příčestí + pomocné sloveso, pak celé tabulky présent a PC.", "fc", "15 min"],
    ["Procvičování", "Piš tvary, dokud nebude mřížka níže celá zelená. Slovesa, ve kterých chybuješ, se ti budou vracet častěji.", "drill", "30+ min"],
    ["Kvíz a tahák", "Na závěr kvíz a ráno před testem jen tahák.", "quiz", "10 min"],
  ];
  return (
    <div>
      <Title no="Plan" lede="32 sloves × présent + passé composé (+ impératif u avoir, être, prendre, monter). Postup na jeden večer:">Jak se to naučit do zítřka</Title>
      <div className="grid3">
        {steps.map(([h, d, id, time], i) => (
          <div key={i} className={"card" + (i % 2 ? " red" : "")} style={{ margin: 0, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 38, fontWeight: 900, color: "var(--rouge)", lineHeight: 1 }}>{i + 1}</span>
              <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 700 }}>{time}</span>
            </div>
            <h3 style={{ marginTop: 6 }}>{h}</h3>
            <p style={{ fontSize: 15, color: "var(--muted)" }}>{d}</p>
            <div style={{ marginTop: "auto" }}><button className="btn" onClick={() => go(id)}>Otevřít →</button></div>
          </div>
        ))}
      </div>

      <h3 className="h3">Jak na tom jsi</h3>
      <div className="grid3">
        {[["Présent", "pres", "var(--bleu)"], ["Passé composé", "pc", "var(--rouge)"], ["Impératif", "imp", "var(--ink)"]].map(([l, k, c]) => (
          <div key={k}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}><b>{l}</b><span>{t[k] ? `${t[k].ok} / ${t[k].ok + t[k].bad}` : "–"} · {pct(k)} %</span></div>
            <div className="bar"><i style={{ width: pct(k) + "%", background: c }} /></div>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 15 }}>Zkoušeno <b>{tried}</b> / 32 sloves · jistě umíš <b>{solid}</b> / 32</p>
      <div className="mgrid">
        {VERBS.map(v => {
          const s = stats.v[v.inf]; const m = mastery(s);
          return (
            <div key={v.inf} className="mcell" style={mColor(m)}>
              <span>{v.inf}</span>
              <span className="s">{s ? `${s.ok}✓ ${s.bad}✗` : "zatím nic"}</span>
            </div>
          );
        })}
      </div>
      <div className="row" style={{ marginTop: 14 }}>
        <button className="btn solid" onClick={() => go("drill")}>Procvičovat →</button>
        <button className="btn red" onClick={resetStats}>Vynulovat statistiky</button>
      </div>
    </div>
  );
}

/* ═══════════════════════ 2. PASSÉ COMPOSÉ ═══════════════════════ */

function PPGrid() {
  const [open, setOpen] = useState({});
  const all = Object.keys(open).length === VERBS.length;
  return (
    <>
      <div className="row">
        <button className="btn" onClick={() => setOpen(all ? {} : Object.fromEntries(VERBS.map(v => [v.inf, 1])))}>{all ? "Zakrýt vše" : "Odkrýt vše"}</button>
        <span style={{ fontSize: 14, color: "var(--muted)" }}>Klepni na sloveso – nejdřív si příčestí řekni sám.</span>
      </div>
      <div className="ppgrid">
        {VERBS.map(v => (
          <button key={v.inf} className={"ppcell bd-" + v.g} onClick={() => setOpen(o => ({ ...o, [v.inf]: !o[v.inf] }))}>
            <div className={"i g-" + v.g}>{v.inf}{v.aux === "e" && " 🏠"}</div>
            {open[v.inf] ? <div className="p">{v.aux === "e" ? "être" : "avoir"} + {v.pp}</div> : <div className="q">• • •</div>}
          </button>
        ))}
      </div>
    </>
  );
}

const WEX = [
  { d: "e", q: <>Nous <b>(manger)</b> une pizza.</>, s: [["Pomocné", "manger není v domě être → AVOIR"], ["Tvar", "nous → avons"], ["Příčestí", "-er → -é: mangé"], ["Shoda", "s avoir žádná"]], r: "Nous avons mangé une pizza." },
  { d: "e", q: <>Elle <b>(aller)</b> à Paris.</>, s: [["Pomocné", "aller je pohyb → ÊTRE"], ["Tvar", "elle → est"], ["Příčestí", "allé"], ["Shoda", "elle = ženský rod jedn. č. → +e"]], r: "Elle est allée à Paris." },
  { d: "m", q: <>Ils <b>(prendre)</b> le train.</>, s: [["Pomocné", "AVOIR"], ["Tvar", "ils → ont"], ["Příčestí", "nepravidelné: prendre → pris"], ["Shoda", "žádná"]], r: "Ils ont pris le train." },
  { d: "m", q: <>Mes grands-parents <b>(naître)</b> en 1950.</>, s: [["Pomocné", "naître → ÊTRE"], ["Tvar", "mes grands-parents = ils → sont"], ["Příčestí", "né"], ["Shoda", "mužský rod množ. č. (smíšená skupina = mužský) → +s"]], r: "Mes grands-parents sont nés en 1950." },
  { d: "m", q: <>Je <b>(ne pas – comprendre)</b>.</>, s: [["Pomocné", "AVOIR → j'ai"], ["Zápor", "ne…pas obalí POMOCNÉ sloveso: je n'ai pas"], ["Příčestí", "comprendre → compris (jako pris)"]], r: "Je n'ai pas compris." },
  { d: "m", q: <>Marie et Sophie <b>(venir)</b> hier.</>, s: [["Pomocné", "venir → ÊTRE"], ["Tvar", "dvě ženy = elles → sont"], ["Příčestí", "venu"], ["Shoda", "ženský rod množ. č. → +es"]], r: "Marie et Sophie sont venues hier." },
  { d: "h", q: <>Tu <b>(être)</b> malade ?</>, s: [["Past!", "être samo se tvoří s AVOIR"], ["Tvar", "tu → as"], ["Příčestí", "été"]], r: "Tu as été malade ?" },
  { d: "h", q: <>Elle <b>(monter)</b> les valises.</>, s: [["Pomocné", "monter má tady předmět (les valises) → AVOIR"], ["Tvar", "elle → a"], ["Příčestí", "monté, s avoir bez shody"]], r: "Elle a monté les valises." },
  { d: "h", q: <>Madame, vous <b>(ne pas – tomber)</b> ?</>, s: [["Pomocné", "tomber → ÊTRE → vous êtes"], ["Zápor", "vous n'êtes pas"], ["Shoda", "vykáme jedné ženě → tombée (jedn. č., žen. rod)"]], r: "Madame, vous n'êtes pas tombée ?" },
];

function WorkedEx({ ex, i }) {
  const [show, setShow] = useState(false);
  const lab = { e: ["e", "Easy ✨"], m: ["m", "Medium ⚡"], h: ["h", "Hard 🔥"] }[ex.d];
  return (
    <div className="wex">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div className="q"><span className={"diff " + lab[0]}>{lab[1]}</span>{i + 1}. {ex.q}</div>
        <button className="btn" onClick={() => setShow(!show)}>{show ? "Skrýt" : "Ukázat řešení"}</button>
      </div>
      {show && (
        <div className="sol fade">
          {ex.s.map(([l, t], j) => <div key={j} className="st"><span className="lab">{j + 1}. {l}</span>{t}</div>)}
          <div className="res">{ex.r}</div>
        </div>
      )}
    </div>
  );
}

function PcTab() {
  return (
    <div>
      <Title no="Passé composé" lede="Minulý čas pro děje, které se staly a skončily. Česky: udělal jsem, šla jsem, koupili jsme. Projdi body 1–7 popořadě.">Minulý čas krok za krokem</Title>

      <div className="card red">
        <h3>Celé pravidlo na jeden řádek</h3>
        <div className="formula">
          <div className="blk"><div className="k">podmět</div><div className="v">je / elle…</div></div>
          <div className="plus">+</div>
          <div className="blk"><div className="k">avoir / être v PŘÍTOMNÉM čase</div><div className="v">ai / suis…</div></div>
          <div className="plus">+</div>
          <div className="blk r"><div className="k">příčestí minulé (participe passé)</div><div className="v">parlé / allé…</div></div>
        </div>
        <div className="ex">
          <div>J'<b>ai</b> <span className="agr">parlé</span>.</div><div className="cz">Mluvil(a) jsem. (doslova „mám mluveno“)</div>
          <div>Elle <b>est</b> <span className="agr">allée</span> à Paris.</div><div className="cz">Jela do Paříže. (doslova „je jetá“)</div>
        </div>
        <p>Je to stejné jako v češtině „<b>jsem</b> mluvil“ – také pomocné sloveso + tvar na -l. Jen francouzština má <b>dvě</b> pomocná slovesa a musíš vědět, kdy které.</p>
      </div>

      <Acc n="1" title="Pomocné sloveso: avoir, nebo être v přítomném čase" open>
        <p>Pomocné sloveso se časuje normálně v <b>přítomném čase</b> – to je jediná část, která se mění podle osoby. Tyhle dvě tabulky musíš umět nazpaměť.</p>
        <div className="grid2">
          <div><b>AVOIR</b> (většina sloves)
            <table className="tbl"><tbody>{AV.map((a, i) => <tr key={i}><td className="pr">{pronFor(PRON[i], a)}</td><td>{a} parlé</td></tr>)}</tbody></table>
          </div>
          <div><b>ÊTRE</b> (pohyb a změna stavu – „dům“)
            <table className="tbl"><tbody>{ET.map((a, i) => <tr key={i}><td className="pr">{PRON[i]}</td><td>{a} allé<span className="agr">{AGR_TBL[i]}</span></td></tr>)}</tbody></table>
          </div>
        </div>
        <div className="note">Elize: <b>j'</b>ai (ne „je ai“), ale <b>je</b> suis. Pozor na <b>ils ont</b> (avoir) × <b>ils sont</b> (être) – liší se jen písmenem s, ale význam je úplně jiný.</div>
      </Acc>

      <Acc n="2" title="Příčestí minulé (participe passé) – jak ho vytvořit">
        <div className="rule"><b>Pravidelná slovesa</b> – stačí změnit koncovku infinitivu:</div>
        <div className="tblwrap"><table className="tbl">
          <thead><tr><th>infinitiv</th><th>příčestí</th><th>z tvého seznamu</th></tr></thead>
          <tbody>
            <tr><td className="g-er"><b>-er</b> → <span className="end">-é</span></td><td>parler → parlé</td><td>aller, parler, penser, habiter, aimer, acheter, payer, manger, monter, tomber, regarder, gagner</td></tr>
            <tr><td className="g-ir"><b>-ir</b> → <span className="end">-i</span></td><td>finir → fini</td><td>choisir, finir</td></tr>
            <tr><td><b>-re</b> → <span className="end">-u</span></td><td>vendre → vendu</td><td>vendre, entendre, attendre</td></tr>
          </tbody>
        </table></div>
        <div className="rule"><b>Nepravidelná příčestí</b> – naučit nazpaměť. Seskupená podle koncovky, ať se pamatují snáz:</div>
        <div className="tblwrap"><table className="tbl">
          <thead><tr><th>koncovka</th><th>slovesa</th></tr></thead>
          <tbody>
            <tr><td><b>-u</b></td><td>avoir → <b>eu</b> · vouloir → <b>voulu</b> · pouvoir → <b>pu</b> · savoir → <b>su</b> · boire → <b>bu</b> · voir → <b>vu</b> · venir → <b>venu</b> · connaître → <b>connu</b></td></tr>
            <tr><td><b>-is</b></td><td>prendre → <b>pris</b> · comprendre → <b>compris</b> · mettre → <b>mis</b></td></tr>
            <tr><td><b>-t</b></td><td>faire → <b>fait</b> · mourir → <b>mort</b></td></tr>
            <tr><td><b>-é</b> (zvláštní)</td><td>être → <b>été</b> · naître → <b>né</b></td></tr>
          </tbody>
        </table></div>
        <div className="note">Pomůcka „<b>pu–su–bu–vu–eu</b>“: pouvoir, savoir, boire, voir, avoir mají jednoslabičné příčestí na -u. Rýmuje se to, tak si to říkej jako básničku.</div>
        <h4 className="h3">Otestuj se: jaké je příčestí a pomocné sloveso?</h4>
        <PPGrid />
      </Acc>

      <Acc n="3" title="Avoir, nebo être? „Dům slovesa être“ 🏠">
        <p><b>Skoro všechna slovesa</b> mají avoir. S <b>être</b> je jen malá skupina sloves, která znamenají <b>pohyb z místa na místo</b> nebo <b>změnu stavu</b> (narodit se, zemřít). Představ si dům: do domu se vchází, vychází, chodí nahoru, dolů, padá se ze schodů, rodí se v něm i umírá.</p>
        <div className="maison">
          <div className="roof">la maison d'être</div>
          <div className="body">
            <div className="mine">aller ↔ venir</div><div>arriver ↔ partir</div>
            <div>entrer ↔ sortir</div><div className="mine">monter ↔ descendre</div>
            <div className="mine">naître ↔ mourir</div><div className="mine">tomber</div>
            <div>rester</div><div>retourner, passer</div>
            <div>devenir, revenir</div><div>rentrer</div>
          </div>
        </div>
        <div className="rule">Z tvého seznamu jich je s être <b>šest</b>: <b>aller, venir, monter, tomber, naître, mourir</b>. Všech ostatních 26 má <b>avoir</b>. (V tabulkách mají 🏠.)</div>
        <p>Párové pomůcky: <i>aller ↔ venir</i> (jít ↔ přijít), <i>monter ↔ descendre</i> (nahoru ↔ dolů), <i>naître ↔ mourir</i> (narodit se ↔ zemřít) a <i>tomber</i> (spadnout – „dolů“ bez vůle).</p>
        <div className="note"><b>Pasti:</b><br />
          • <b>être</b> a <b>avoir</b> samy mají <b>avoir</b>: j'ai été (byl jsem), j'ai eu (měl jsem).<br />
          • <b>monter</b> s předmětem (něco vynést nahoru) má <b>avoir</b>: <i>J'ai monté les valises.</i> Bez předmětu <i>Je suis monté(e).</i><br />
          • Zvratná slovesa (se laver, se lever…) mají vždy être: <i>je me suis levé(e)</i> – v tvém seznamu nejsou, ale je dobré to vědět.</div>
      </Acc>

      <Acc n="4" title="Shoda příčestí (accord) – kdy přidat -e / -s / -es">
        <div className="rule">S <b>ÊTRE</b> se příčestí <b>shoduje s podmětem</b> jako přídavné jméno: ženský rod <b>+e</b>, množné číslo <b>+s</b>, obojí <b>+es</b>.</div>
        <div className="tblwrap"><table className="tbl">
          <thead><tr><th>podmět</th><th>mužský rod</th><th>ženský rod</th></tr></thead>
          <tbody>
            <tr><td>je / tu</td><td>je suis allé</td><td>je suis allé<span className="agr">e</span></td></tr>
            <tr><td>il / elle</td><td>il est allé</td><td>elle est allé<span className="agr">e</span></td></tr>
            <tr><td>nous</td><td>nous sommes allé<span className="agr">s</span></td><td>nous sommes allé<span className="agr">es</span></td></tr>
            <tr><td>vous</td><td>vous êtes allé / allé<span className="agr">s</span></td><td>vous êtes allé<span className="agr">e</span> / allé<span className="agr">es</span></td></tr>
            <tr><td>ils / elles</td><td>ils sont allé<span className="agr">s</span></td><td>elles sont allé<span className="agr">es</span></td></tr>
          </tbody>
        </table></div>
        <ul>
          <li>Smíšená skupina (kluci + holky) = mužský rod: <i>Pierre et Marie sont venus.</i></li>
          <li><b>vous</b> může být jeden člověk (vykání) → <i>Madame, vous êtes venue ?</i> nebo více lidí → <i>vous êtes venus</i>.</li>
          <li>U <b>mourir</b> je příčestí <i>mort</i>, takže: il est mort, elle est mor<span className="agr">te</span>, ils sont mor<span className="agr">ts</span>.</li>
          <li>Shoda se většinou <b>neslyší</b> (allé = allée = allés), ale v testu ji <b>píšeš</b>. Výjimka: mort × morte – tam ji slyšíš.</li>
        </ul>
        <div className="rule">S <b>AVOIR</b> se příčestí s podmětem <b>neshoduje</b>: <i>elle a mangé, elles ont mangé</i> – nikdy „elle a mangée“.</div>
        <div className="note">Pro zajímavost (pokročilé): s avoir se příčestí shoduje jen s předmětem, který stojí <b>před</b> slovesem: <i>Les pommes ? Je <b>les</b> ai mangé<span className="agr">es</span>.</i> Do testu to pravděpodobně nebude potřeba.</div>
      </Acc>

      <Acc n="5" title="Zápor, otázka a příslovce – kam co patří">
        <div className="rule"><b>Zápor:</b> ne … pas obalí <b>jen pomocné sloveso</b>, příčestí jde až za pas.</div>
        <div className="ex">
          <div>Je <b>n'</b>ai <b>pas</b> mangé.</div><div className="cz">Nejedl jsem.</div>
          <div>Elle <b>n'</b>est <b>pas</b> venue.</div><div className="cz">Nepřišla.</div>
          <div>Nous <b>n'</b>avons <b>jamais</b> vu Paris.</div><div className="cz">Nikdy jsme neviděli Paříž.</div>
        </div>
        <div className="rule"><b>Otázka</b> – tři způsoby, všechny správně:</div>
        <div className="ex">
          <div>Tu as mangé ?</div><div className="cz">intonace – hovorově</div>
          <div>Est-ce que tu as mangé ?</div><div className="cz">neutrální</div>
          <div>As-tu mangé ?</div><div className="cz">inverze – prohodí se podmět a POMOCNÉ sloveso</div>
          <div>A-t-elle mangé ?</div><div className="cz">u a + il/elle se vkládá -t-</div>
        </div>
        <div className="rule"><b>Krátká příslovce</b> (bien, mal, déjà, beaucoup, trop, encore, toujours) stojí <b>mezi</b> pomocným slovesem a příčestím.</div>
        <div className="ex">
          <div>J'ai <b>bien</b> dormi. · Tu as <b>déjà</b> fini ? · Il a <b>beaucoup</b> mangé.</div>
          <div>Je n'ai <b>pas encore</b> fini.</div><div className="cz">Ještě jsem nedokončil.</div>
        </div>
      </Acc>

      <Acc n="6" title="Kdy použít passé composé (a kdy ne)">
        <p>Passé composé = <b>konkrétní ukončená událost</b> v minulosti. Odpovídá na otázku <i>„Co se stalo?“</i> Česky většinou dokonavé sloveso (udělal, koupil, přišel).</p>
        <ul>
          <li>Typická slova: <b>hier</b> (včera), <b>ce matin</b>, <b>la semaine dernière</b>, <b>l'année dernière</b>, <b>il y a deux jours</b> (před dvěma dny), <b>soudain</b> (najednou), <b>une fois</b>.</li>
          <li>Řada událostí za sebou: <i>Je suis rentré, j'ai mangé et je suis allé au lit.</i></li>
        </ul>
        <div className="note">Protiklad je <b>imparfait</b> (j'étais, j'avais…) – popis, pozadí, opakované zvyky („Když jsem byl malý, chodíval jsem…“). Do tohoto testu se učíš passé composé, imparfait jen pro rozlišení: <i>Il <b>pleuvait</b> (popis) quand je <b>suis sorti</b> (událost).</i></div>
      </Acc>

      <Acc n="7" title="Postup na každou větu + řešené příklady">
        <ol>
          <li><b>Je sloveso v domě être?</b> (aller, venir, monter, tomber, naître, mourir) → être. Jinak avoir.</li>
          <li><b>Vyčasuj pomocné sloveso</b> v přítomném čase podle podmětu.</li>
          <li><b>Vytvoř příčestí</b> (-é / -i / -u, nebo nepravidelné).</li>
          <li><b>Je to être?</b> → přidej shodu podle podmětu (-e, -s, -es).</li>
          <li>Zápor? → ne/n' … pas kolem pomocného slovesa.</li>
        </ol>
        {WEX.map((ex, i) => <WorkedEx key={i} ex={ex} i={i} />)}
      </Acc>

      <Acc n="8" title="Nejčastější chyby v testu">
        <ul>
          <li>❌ <s>Elle a allé</s> → ✅ Elle <b>est</b> allé<b>e</b></li>
          <li>❌ <s>J'ai prendu</s> / <s>j'ai prendé</s> → ✅ J'ai <b>pris</b></li>
          <li>❌ <s>Je suis été</s> → ✅ J'<b>ai</b> été</li>
          <li>❌ <s>Il a mouru</s> → ✅ Il <b>est mort</b></li>
          <li>❌ <s>Elle a mangée</s> → ✅ Elle a mangé (s avoir bez shody)</li>
          <li>❌ <s>Je ne suis allé pas</s> → ✅ Je <b>ne suis pas</b> allé</li>
          <li>❌ <s>J'ai finis</s> → ✅ J'ai <b>fini</b> (-s jen v přítomném čase: je finis)</li>
          <li>❌ <s>J'ai vendé</s> → ✅ J'ai <b>vendu</b> (-re → -u)</li>
          <li>❌ <s>Il a pouvu</s> / <s>il a savu</s> → ✅ il a <b>pu</b> / il a <b>su</b></li>
        </ul>
      </Acc>
    </div>
  );
}

/* ═══════════════════════ 3. PRÉSENT ═══════════════════════ */

function PresTab() {
  return (
    <div>
      <Title no="Présent" lede="Přítomný čas. Tvých 32 sloves se dělí na tři skupiny – barvy odpovídají skupinám v celé aplikaci.">Přítomný čas – vzory</Title>

      <div className="grid3">
        <div className="card bd-er">
          <h3 className="g-er">1. třída: -er</h3>
          <PresTable v={VMAP.parler} />
          <p style={{ fontSize: 14.5 }}>Koncovky <b className="end">-e, -es, -e, -ons, -ez, -ent</b>. Tvary pro je, tu, il, ils se vyslovují <b>stejně</b> [parl].</p>
          <p style={{ fontSize: 14.5 }}>Tak i: penser, habiter, aimer, regarder, gagner, monter, tomber.</p>
        </div>
        <div className="card bd-ir">
          <h3 className="g-ir">2. třída: -ir (-iss-)</h3>
          <PresTable v={VMAP.finir} />
          <p style={{ fontSize: 14.5 }}>Koncovky <b className="end">-is, -is, -it, -issons, -issez, -issent</b>. V plurálu se přidává <b>-iss-</b>.</p>
          <p style={{ fontSize: 14.5 }}>Tak i: choisir.</p>
        </div>
        <div className="card bd-irr">
          <h3>-re (vendre)</h3>
          <PresTable v={VMAP.vendre} />
          <p style={{ fontSize: 14.5 }}>Koncovky <b className="end">-s, -s, — , -ons, -ez, -ent</b>. il ven<b>d</b> – žádné -t, d tam už je.</p>
          <p style={{ fontSize: 14.5 }}>Tak i: attendre, entendre.</p>
        </div>
      </div>

      <Acc n="A" title="-er slovesa s pravopisnou změnou: manger, acheter, payer" open>
        <div className="grid3">
          <div><b>manger</b><PresTable v={VMAP.manger} /><p style={{ fontSize: 14.5 }}>nous mang<b className="end">e</b>ons – aby g zůstalo měkké [ž].</p></div>
          <div><b>acheter</b><PresTable v={VMAP.acheter} /><p style={{ fontSize: 14.5 }}>è tam, kde je koncovka němá.</p></div>
          <div><b>payer</b><PresTable v={VMAP.payer} /><p style={{ fontSize: 14.5 }}>y → i před němým -e (obě varianty jsou správně).</p></div>
        </div>
      </Acc>

      <Acc n="B" title="Botička 👢 – trik na nepravidelná slovesa">
        <p>U spousty nepravidelných sloves mají <b>nous</b> a <b>vous</b> kmen podle infinitivu, a <b>ostatní čtyři osoby</b> (je, tu, il, ils) jiný kmen. Když si je nakreslíš do tabulky, tvoří tvar boty – v tabulkách je bota podbarvená růžově.</p>
        <div className="grid3">
          {["venir", "vouloir", "boire", "prendre", "voir", "mourir"].map(k => (
            <div key={k}><b>{k}</b> <span style={{ color: "var(--muted)", fontSize: 14 }}>– {VMAP[k].cz}</span><PresTable v={VMAP[k]} /></div>
          ))}
        </div>
        <div className="note">Do boty patří i <b>pouvoir</b> (peux / pouvons), <b>comprendre</b> (jako prendre), <b>acheter</b> a <b>payer</b>.</div>
      </Acc>

      <Acc n="C" title="Úplně nepravidelná – avoir, être, aller, faire">
        <div className="grid2">
          {["avoir", "être", "aller", "faire"].map(k => (
            <div key={k}><b>{k}</b> <span style={{ color: "var(--muted)", fontSize: 14 }}>– {VMAP[k].cz}</span><PresTable v={VMAP[k]} /></div>
          ))}
        </div>
        <div className="rule">Jen 4 slovesa mají ils na <b>-ont</b>: ils <b>ont</b>, ils <b>sont</b>, ils <b>vont</b>, ils <b>font</b>.<br />
          Jen 3 slovesa mají vous na <b>-tes</b>: vous <b>êtes</b>, vous <b>faites</b>, vous <b>dites</b>.</div>
      </Acc>

      <Acc n="D" title="Koncovky -s, -s, -t a -x, -x, -t (zbytek nepravidelných)">
        <p>Skoro všechna nepravidelná slovesa mají v jednotném čísle <b className="end">-s, -s, -t</b>:</p>
        <div className="ex">
          <div>je fai<b>s</b>, tu fai<b>s</b>, il fai<b>t</b> · je sai<b>s</b>, tu sai<b>s</b>, il sai<b>t</b> · je boi<b>s</b>, il boi<b>t</b></div>
          <div>je connai<b>s</b>, il connaî<b>t</b> · je nai<b>s</b>, il naî<b>t</b> · je meur<b>s</b>, il meur<b>t</b> · je vien<b>s</b>, il vien<b>t</b></div>
        </div>
        <p>Výjimky:</p>
        <ul>
          <li><b>vouloir, pouvoir</b>: -<b>x</b>, -<b>x</b>, -t → je veux, tu peux, il veut</li>
          <li><b>prendre, comprendre, vendre, attendre, entendre</b>: il prend, il vend – <b>bez -t</b> (končí na d)</li>
          <li><b>mettre</b>: je mets, il met – jedno t v singuláru, dvě v plurálu (nous mettons)</li>
          <li><b>connaître, naître</b>: î jen před t (il connaît, il naît)</li>
        </ul>
        <div className="grid3">
          {["savoir", "mettre", "connaître", "pouvoir", "naître", "comprendre"].map(k => (
            <div key={k}><b>{k}</b> <span style={{ color: "var(--muted)", fontSize: 14 }}>– {VMAP[k].cz}</span><PresTable v={VMAP[k]} /></div>
          ))}
        </div>
      </Acc>

      <Acc n="E" title="Impératif (avoir, être, prendre, monter)">
        <p>Rozkazovací způsob má jen 3 osoby (tu, nous, vous) a <b>bez zájmena</b>. U -er sloves se v osobě tu <b>ztrácí -s</b>: tu montes → <b>Monte !</b></p>
        <div className="tblwrap"><table className="tbl">
          <thead><tr><th></th><th>(tu)</th><th>(nous)</th><th>(vous)</th><th>poznámka</th></tr></thead>
          <tbody>
            <tr><td><b>avoir</b></td><td>aie</td><td>ayons</td><td>ayez</td><td>Aie confiance ! – Měj důvěru!</td></tr>
            <tr><td><b>être</b></td><td>sois</td><td>soyons</td><td>soyez</td><td>Sois sage ! – Buď hodný!</td></tr>
            <tr><td><b>prendre</b></td><td>prends</td><td>prenons</td><td>prenez</td><td>= tvary přítomného času</td></tr>
            <tr><td><b>monter</b></td><td>monte</td><td>montons</td><td>montez</td><td>tu montes → Monte ! (bez -s)</td></tr>
          </tbody>
        </table></div>
        <div className="note">avoir a être mají nepravidelný impératif – <b>aie, ayons, ayez · sois, soyons, soyez</b>. Zápor: <i>Ne sois pas triste !</i></div>
      </Acc>
    </div>
  );
}

/* ═══════════════════════ 4. TABULKY ═══════════════════════ */

function TablesTab() {
  const [q, setQ] = useState("");
  const [grp, setGrp] = useState("all");
  const [hide, setHide] = useState(false);
  const [rev, setRev] = useState({});
  const list = VERBS.filter(v =>
    (grp === "all" || (grp === "etre" ? v.aux === "e" : grp === "imp" ? !!v.imp : v.g === grp)) &&
    (!q || strip(v.inf + " " + v.cz).toLowerCase().includes(strip(q.toLowerCase()))));
  const H = ({ id, children }) => (hide && !rev[id])
    ? <span className="hid" onClick={() => setRev(r => ({ ...r, [id]: 1 }))}>{children}</span>
    : <span>{children}</span>;

  return (
    <div>
      <Title no="Tableaux" lede="Všech 32 sloves. Zapni „Zakrýt tvary“ a odkrývej klepnutím – nejdřív si tvar řekni nahlas, pak zkontroluj.">Tabulky sloves</Title>
      <input className="search" placeholder="Hledat sloveso (francouzsky i česky)…" value={q} onChange={e => setQ(e.target.value)} />
      <div className="row" style={{ marginBottom: 16 }}>
        {[["all", "Vše (32)"], ["er", "-er"], ["ir", "-ir"], ["irr", "nepravidelná"], ["etre", "🏠 s être"], ["imp", "s impératem"]].map(([k, l]) => (
          <button key={k} className={"chip" + (grp === k ? " on" : "")} onClick={() => setGrp(k)}>{l}</button>
        ))}
        <button className={"chip r" + (hide ? " on" : "")} onClick={() => { setHide(!hide); setRev({}); }}>{hide ? "🙈 Tvary zakryté" : "👁 Zakrýt tvary"}</button>
        {hide && <button className="chip" onClick={() => setRev({})}>Znovu zakrýt</button>}
      </div>
      <div className="vcards">
        {list.map(v => (
          <div key={v.inf} className={"vcard bd-" + v.g}>
            <div className="hd">
              <div><span className={"inf g-" + v.g}>{v.inf}</span> <span className="cz">{v.cz}</span></div>
              <span className="meta">{GROUP_LABEL[v.g]}{v.aux === "e" ? " · 🏠 être" : ""}</span>
            </div>
            <div className="cols">
              <div>
                <div className="ct">Présent</div>
                {v.pres.map((f, i) => (
                  <div key={i} className={"fl" + (v.boot && [0, 1, 2, 5].includes(i) ? " boot" : "")}>
                    <span className="pn">{(x => x.endsWith("'") ? x : x + " ")(pronFor(PRON[i], f))}</span>
                    <H id={v.inf + "p" + i}>{f.split("|").map((x, j) => <span key={j}>{j > 0 && " / "}<Form v={v} f={x} /></span>)}</H>
                  </div>
                ))}
              </div>
              <div>
                <div className="ct">Passé composé</div>
                {(v.aux === "e" ? ET : AV).map((a, i) => (
                  <div key={i} className="fl">
                    <span className="pn">{(x => x.endsWith("'") ? x : x + " ")(pronFor(PRON[i], a))}</span>
                    <H id={v.inf + "c" + i}>{a} <b>{v.pp}</b>{v.aux === "e" && <span className="agr">{AGR_TBL[i]}</span>}</H>
                  </div>
                ))}
              </div>
            </div>
            {v.imp && (
              <div className="imp"><span className="ct" style={{ marginRight: 8 }}>Impératif</span>
                {v.imp.map((f, i) => <span key={i}>{i > 0 && " · "}<H id={v.inf + "i" + i}>{f}</H> <span style={{ color: "var(--muted)", fontSize: 12 }}>{IMP_P[i]}</span></span>)}
              </div>
            )}
            <div className="tip">💡 {v.tip}</div>
          </div>
        ))}
      </div>
      {list.length === 0 && <p>Nic nenalezeno.</p>}
    </div>
  );
}

/* ═══════════════════════ 5. KARTIČKY ═══════════════════════ */

const DECKS = [
  { id: "pp", label: "Příčestí + pomocné", verbs: VERBS },
  { id: "pres", label: "Présent – tabulka", verbs: VERBS },
  { id: "pc", label: "Passé composé – tabulka", verbs: VERBS },
  { id: "imp", label: "Impératif", verbs: VERBS.filter(v => v.imp) },
];

function FlashTab() {
  const [deck, setDeck] = useState("pp");
  const [order, setOrder] = useState(() => VERBS.map(v => v.inf));
  const [i, setI] = useState(0);
  const [flip, setFlip] = useState(false);
  const [known, setKnown] = useState({});
  const [onlyUnk, setOnlyUnk] = useState(false);

  const d = DECKS.find(x => x.id === deck);
  const base = order.map(k => VMAP[k]).filter(v => d.verbs.includes(v));
  const cards = onlyUnk ? base.filter(v => known[deck + v.inf] !== true) : base;
  const v = cards[Math.min(i, cards.length - 1)];

  const move = n => { if (!cards.length) return; setFlip(false); setTimeout(() => setI(x => (x + n + cards.length) % cards.length), 120); };
  const mark = val => { setKnown(k => ({ ...k, [deck + v.inf]: val })); if (onlyUnk && val) { setFlip(false); setI(x => Math.min(x, Math.max(0, cards.length - 2))); } else move(1); };
  const doShuffle = () => { setOrder(shuffle(VERBS.map(x => x.inf))); setI(0); setFlip(false); };
  const switchDeck = id => { setDeck(id); setI(0); setFlip(false); };

  useEffect(() => {
    const h = e => {
      if (e.target.tagName === "INPUT") return;
      if (e.key === "ArrowRight") move(1);
      else if (e.key === "ArrowLeft") move(-1);
      else if (e.key === " ") { e.preventDefault(); setFlip(f => !f); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  });

  const nKnown = base.filter(x => known[deck + x.inf] === true).length;

  return (
    <div>
      <Title no="Cartes" lede="Klepni na kartičku pro otočení (nebo mezerník, šipky ← →). Označuj Umím / Ještě ne a pak projeď jen ty neumím.">Kartičky</Title>
      <div className="row" style={{ marginBottom: 12 }}>
        {DECKS.map(x => <button key={x.id} className={"chip" + (deck === x.id ? " on" : "")} onClick={() => switchDeck(x.id)}>{x.label}</button>)}
      </div>
      <div className="row" style={{ marginBottom: 16 }}>
        <button className="chip" onClick={doShuffle}>🔀 Zamíchat</button>
        <button className={"chip r" + (onlyUnk ? " on" : "")} onClick={() => { setOnlyUnk(!onlyUnk); setI(0); setFlip(false); }}>Jen neumím</button>
        <span style={{ fontSize: 14, color: "var(--muted)" }}>Umím {nKnown} / {base.length}</span>
      </div>

      {!v ? (
        <div className="card" style={{ textAlign: "center" }}>
          <h3>🎉 Celý balíček umíš!</h3>
          <button className="btn" onClick={() => setOnlyUnk(false)}>Zobrazit všechny</button>
        </div>
      ) : (
        <>
          <div className="fc-scene">
            <div className={"fc" + (flip ? " flip" : "")} onClick={() => setFlip(!flip)}>
              <div className={"fc-face bd-" + v.g}>
                <div className="lab">{d.label} · {Math.min(i, cards.length - 1) + 1} / {cards.length}</div>
                <div className={"w g-" + v.g}>{v.inf}</div>
                <div style={{ color: "var(--muted)" }}>{v.cz}</div>
                <div className="lab" style={{ marginTop: 18 }}>
                  {deck === "pp" ? "pomocné sloveso + příčestí?" : deck === "pres" ? "je, tu, il, nous, vous, ils?" : deck === "pc" ? "j'ai… / je suis…?" : "(tu) · (nous) · (vous)?"}
                </div>
              </div>
              <div className="fc-face fc-back">
                <div className="lab">{v.inf} – {v.cz}</div>
                {deck === "pp" && <>
                  <div className="w" style={{ color: "var(--rouge)" }}>{v.pp}</div>
                  <div style={{ fontSize: 20 }}>s <b>{v.aux === "e" ? "ÊTRE 🏠" : "AVOIR"}</b></div>
                  <div style={{ marginTop: 8 }}>{v.aux === "e" ? `je suis ${v.pp}(e) · elles sont ${v.pp}es` : `j'ai ${v.pp} · ils ont ${v.pp}`}</div>
                </>}
                {deck === "pres" && <PresTable v={v} />}
                {deck === "pc" && <PcTable v={v} />}
                {deck === "imp" && <div style={{ fontSize: 24, fontFamily: "'Playfair Display',serif" }}>{v.imp.map((f, j) => <div key={j}>{f} ! <span style={{ fontSize: 14, color: "var(--muted)" }}>{IMP_P[j]}</span></div>)}</div>}
                <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 8 }}>💡 {v.tip}</div>
              </div>
            </div>
          </div>
          <div className="row" style={{ justifyContent: "center", marginTop: 14 }}>
            <button className="btn" onClick={() => move(-1)}>← Předchozí</button>
            <button className="btn red" onClick={() => mark(false)}>✗ Ještě ne</button>
            <button className="btn solid" onClick={() => mark(true)}>✓ Umím</button>
            <button className="btn" onClick={() => move(1)}>Další →</button>
          </div>
          <div className="dots">
            {cards.map((c, j) => {
              const kv = known[deck + c.inf];
              return <button key={c.inf} aria-label={c.inf} className={"dot" + (j === i ? " cur" : kv === true ? " known" : kv === false ? " unk" : "")} onClick={() => { setFlip(false); setI(j); }} />;
            })}
          </div>
        </>
      )}
    </div>
  );
}

/* ═══════════════════════ 6. PROCVIČOVÁNÍ ═══════════════════════ */

const TENSE_LABEL = { pres: "présent", pc: "passé composé", imp: "impératif" };

function filterVerbs(grp) {
  if (grp === "all") return VERBS;
  if (grp === "etre") return VERBS.filter(v => v.aux === "e");
  return VERBS.filter(v => v.g === grp);
}

function SingleDrill({ stats, record }) {
  const [tenses, setTenses] = useState({ pres: true, pc: true, imp: false });
  const [grp, setGrp] = useState("all");
  const [task, setTask] = useState(null);
  const [val, setVal] = useState("");
  const [res, setRes] = useState(null);
  const [sess, setSess] = useState({ ok: 0, n: 0, streak: 0 });
  const inp = useRef(null);

  const newTask = useCallback(() => {
    const ts = Object.keys(tenses).filter(k => tenses[k]);
    if (!ts.length) return;
    let pool = filterVerbs(grp);
    const tense = ts[Math.floor(Math.random() * ts.length)];
    if (tense === "imp") pool = pool.filter(v => v.imp).length ? pool.filter(v => v.imp) : VERBS.filter(v => v.imp);
    const v = pickWeighted(pool, stats.v);
    const subj = tense === "imp"
      ? { k: IMP_P[Math.floor(Math.random() * 3)], i: 0 }
      : SUBJ[Math.floor(Math.random() * SUBJ.length)];
    if (tense === "imp") subj.i = IMP_P.indexOf(subj.k);
    setTask({ v, tense, subj, ans: answersFor(v, tense, subj) });
    setVal(""); setRes(null);
    setTimeout(() => inp.current && inp.current.focus(), 50);
  }, [tenses, grp, stats]);

  useEffect(() => { newTask(); /* eslint-disable-next-line */ }, [tenses, grp]);

  const submit = () => {
    if (res) { newTask(); return; }
    const r = checkAnswer(val, task.ans);
    if (r.empty) return;
    setRes(r);
    record(task.v.inf, task.tense, r.ok);
    setSess(s => ({ ok: s.ok + (r.ok ? 1 : 0), n: s.n + 1, streak: r.ok ? s.streak + 1 : 0 }));
  };

  if (!task) return <p>Vyber aspoň jeden čas.</p>;
  const shownPron = task.tense === "imp" ? task.subj.k : pronFor(task.subj.k, task.ans[0]);

  return (
    <div>
      <div className="row" style={{ marginBottom: 8 }}>
        {Object.keys(TENSE_LABEL).map(k => (
          <button key={k} className={"chip" + (tenses[k] ? " on" : "")} onClick={() => setTenses(t => ({ ...t, [k]: !t[k] }))}>{TENSE_LABEL[k]}</button>
        ))}
      </div>
      <div className="row" style={{ marginBottom: 16 }}>
        {[["all", "všechna"], ["er", "-er"], ["ir", "-ir"], ["irr", "nepravidelná"], ["etre", "🏠 s être"]].map(([k, l]) => (
          <button key={k} className={"chip r" + (grp === k ? " on" : "")} onClick={() => setGrp(k)}>{l}</button>
        ))}
      </div>
      <div className={"drill bd-" + task.v.g}>
        <div className="task">Napiš tvar slovesa</div>
        <div className={"verb g-" + task.v.g}>{task.v.inf} <span style={{ fontSize: 16, color: "var(--muted)", fontWeight: 400, fontFamily: "Montserrat" }}>({task.v.cz})</span></div>
        <span className={"tense " + task.tense}>{TENSE_LABEL[task.tense]}</span>
        <div className="ans-line">
          <span className="pn">{shownPron}</span>
          <input ref={inp} className={"inp" + (res ? (res.ok ? " ok" : " bad") : "")} value={val}
            onChange={e => setVal(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()}
            autoCapitalize="off" autoCorrect="off" spellCheck={false}
            placeholder={task.tense === "pc" ? "pomocné + příčestí" : task.tense === "imp" ? `rozkaz ${task.subj.k}` : "tvar"} />
          {task.tense === "imp" && <span className="pn">!</span>}
        </div>
        <div className="row">
          <button className="btn solid" onClick={submit}>{res ? "Další (Enter) →" : "Zkontrolovat (Enter)"}</button>
          {!res && <button className="btn" onClick={() => { setRes({ ok: false, skip: true }); record(task.v.inf, task.tense, false); setSess(s => ({ ...s, n: s.n + 1, streak: 0 })); }}>Nevím</button>}
        </div>
        {res && (
          <div className={"fb fade " + (res.ok ? "ok" : "bad")}>
            <div>{res.ok ? (res.exact ? "✓ Správně!" : "✓ Správně – jen pozor na diakritiku:") : res.skip ? "Správně je:" : "✗ Správně je:"}</div>
            <div className="big">{task.tense === "imp" ? "" : shownPron + (shownPron.endsWith("'") ? "" : " ")}{task.ans.length > 2 ? task.ans.slice(0, 2).join(" / ") + " …" : task.ans.join(" / ")}{task.tense === "imp" ? " !" : ""}</div>
            {task.tense === "pc" && task.v.aux === "e" && <div style={{ fontSize: 14 }}>🏠 {task.v.inf} má être → příčestí se shoduje s podmětem „{task.subj.k}“.</div>}
            <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 4 }}>💡 {task.v.tip}</div>
          </div>
        )}
        <div className="statline">
          <span>Teď: <b>{sess.ok} / {sess.n}</b></span>
          <span>Série: <b>{sess.streak}</b>{sess.streak >= 5 ? " 🔥" : ""}</span>
        </div>
      </div>
    </div>
  );
}

function TableDrill({ record }) {
  const [inf, setInf] = useState("prendre");
  const [tense, setTense] = useState("pc");
  const [vals, setVals] = useState({});
  const [checked, setChecked] = useState(null);
  const [showSol, setShowSol] = useState(false);
  const v = VMAP[inf];
  const rows = tense === "imp" ? [0, 1, 2].map(i => ({ k: IMP_P[i], i })) : TSUBJ;
  const ok = tense !== "imp" || v.imp;

  const reset = () => { setVals({}); setChecked(null); setShowSol(false); };
  const randomV = () => {
    const pool = tense === "imp" ? VERBS.filter(x => x.imp) : VERBS;
    setInf(pool[Math.floor(Math.random() * pool.length)].inf); reset();
  };
  const check = () => {
    const r = rows.map(s => checkAnswer(vals[s.k] || "", answersFor(v, tense, s)));
    setChecked(r);
    r.forEach(x => record(v.inf, tense, x.ok));
  };
  const nOk = checked ? checked.filter(x => x.ok).length : 0;

  return (
    <div>
      <div className="row" style={{ marginBottom: 8 }}>
        {["pres", "pc", "imp"].map(k => <button key={k} className={"chip" + (tense === k ? " on" : "")} onClick={() => { setTense(k); if (k === "imp" && !v.imp) setInf("avoir"); reset(); }}>{TENSE_LABEL[k]}</button>)}
        <button className="chip r on" onClick={randomV}>🎲 Náhodné sloveso</button>
      </div>
      <div className="row" style={{ marginBottom: 16, gap: 6 }}>
        {(tense === "imp" ? VERBS.filter(x => x.imp) : VERBS).map(x => (
          <button key={x.inf} className={"chip" + (inf === x.inf ? " on" : "")} style={{ padding: "6px 10px", fontSize: 13 }} onClick={() => { setInf(x.inf); reset(); }}>{x.inf}</button>
        ))}
      </div>
      {ok && (
        <div className={"drill bd-" + v.g}>
          <div className="task">Vyplň celou tabulku</div>
          <div className={"verb g-" + v.g}>{v.inf} <span style={{ fontSize: 16, color: "var(--muted)", fontWeight: 400, fontFamily: "Montserrat" }}>({v.cz})</span></div>
          <span className={"tense " + tense}>{TENSE_LABEL[tense]}</span>
          <table className="ttable" style={{ marginTop: 12 }}><tbody>
            {rows.map((s, j) => {
              const c = checked && checked[j];
              const ans = answersFor(v, tense, s);
              return (
                <tr key={s.k}>
                  <td className="pn">{tense === "imp" ? s.k : s.k === "je" ? "je / j'" : s.k}</td>
                  <td>
                    <input className={"inp" + (c ? (c.ok ? " ok" : " bad") : "")} value={vals[s.k] || ""} autoCapitalize="off" autoCorrect="off" spellCheck={false}
                      onChange={e => { setVals(o => ({ ...o, [s.k]: e.target.value })); setChecked(null); }}
                      onKeyDown={e => e.key === "Enter" && check()} />
                    {((c && !c.ok) || showSol) && <div className="sol">{ans.slice(0, 2).join(" / ")}{ans.length > 2 ? " …" : ""}</div>}
                    {c && c.ok && !c.exact && <div className="sol" style={{ color: "var(--warn)" }}>pozor na diakritiku: {ans[0]}</div>}
                  </td>
                </tr>
              );
            })}
          </tbody></table>
          <div className="row" style={{ marginTop: 12 }}>
            <button className="btn solid" onClick={check}>Zkontrolovat</button>
            <button className="btn" onClick={() => setShowSol(!showSol)}>{showSol ? "Skrýt řešení" : "Ukázat řešení"}</button>
            <button className="btn red" onClick={randomV}>Další sloveso →</button>
          </div>
          {checked && <div className={"fb fade " + (nOk === rows.length ? "ok" : "bad")}><div className="big">{nOk} / {rows.length}{nOk === rows.length ? " – perfektní! 🎉" : ""}</div><div style={{ fontSize: 14 }}>💡 {v.tip}</div></div>}
        </div>
      )}
    </div>
  );
}

function AuxDrill({ stats, record }) {
  const [v, setV] = useState(() => VERBS[Math.floor(Math.random() * VERBS.length)]);
  const [aux, setAux] = useState(null);
  const [pp, setPp] = useState("");
  const [res, setRes] = useState(null);
  const [sess, setSess] = useState({ ok: 0, n: 0 });
  const inp = useRef(null);

  const next = () => { setV(pickWeighted(VERBS, stats.v)); setAux(null); setPp(""); setRes(null); setTimeout(() => inp.current && inp.current.focus(), 50); };
  const check = () => {
    if (res) { next(); return; }
    if (!aux || !pp.trim()) return;
    const auxOk = (aux === "e") === (v.aux === "e");
    const ppOk = checkAnswer(pp, [v.pp], false);
    const ok = auxOk && ppOk.ok;
    setRes({ auxOk, ppOk, ok });
    record(v.inf, "pc", ok);
    setSess(s => ({ ok: s.ok + (ok ? 1 : 0), n: s.n + 1 }));
  };

  return (
    <div className={"drill bd-" + v.g}>
      <div className="task">Pomocné sloveso + příčestí</div>
      <div className={"verb g-" + v.g}>{v.inf} <span style={{ fontSize: 16, color: "var(--muted)", fontWeight: 400, fontFamily: "Montserrat" }}>({v.cz})</span></div>
      <div className="row" style={{ marginTop: 14 }}>
        {[["a", "avoir"], ["e", "être 🏠"]].map(([k, l]) => (
          <button key={k} className={"chip" + (aux === k ? " on" : "") + (k === "e" ? " r" : "")} style={{ minWidth: 110, fontSize: 16 }} onClick={() => !res && setAux(k)}>{l}</button>
        ))}
      </div>
      <div className="ans-line">
        <span className="pn">příčestí:</span>
        <input ref={inp} className={"inp" + (res ? (res.ppOk.ok ? " ok" : " bad") : "")} value={pp} onChange={e => setPp(e.target.value)}
          onKeyDown={e => e.key === "Enter" && check()} autoCapitalize="off" autoCorrect="off" spellCheck={false} placeholder="např. pris" />
      </div>
      <button className="btn solid" onClick={check} disabled={!res && (!aux || !pp.trim())}>{res ? "Další (Enter) →" : "Zkontrolovat"}</button>
      {res && (
        <div className={"fb fade " + (res.ok ? "ok" : "bad")}>
          <div className="big">{res.ok ? "✓ " : "✗ "}{v.aux === "e" ? "être" : "avoir"} + {v.pp}</div>
          {!res.auxOk && <div>Pomocné sloveso je <b>{v.aux === "e" ? "être (dům être 🏠)" : "avoir"}</b>.</div>}
          {res.ppOk.ok && !res.ppOk.exact && <div>Pozor na diakritiku: <b>{v.pp}</b></div>}
          <div>{v.aux === "e" ? `je suis ${v.pp}(e), elle est ${v.pp}e, ils sont ${v.pp}s` : `j'ai ${v.pp}, elle a ${v.pp}, ils ont ${v.pp}`}</div>
        </div>
      )}
      <div className="statline"><span>Teď: <b>{sess.ok} / {sess.n}</b></span></div>
    </div>
  );
}

const SENT = [
  { cz: "Mluvil jsem s Pierrem.", fr: ["J'ai parlé avec Pierre."], t: "pc" },
  { cz: "Šla do kina.", fr: ["Elle est allée au cinéma."], t: "pc" },
  { cz: "Koupili jsme chleba.", fr: ["Nous avons acheté du pain.", "On a acheté du pain."], t: "pc" },
  { cz: "Zaplatil jsi?", fr: ["Tu as payé ?", "As-tu payé ?", "Est-ce que tu as payé ?"], t: "pc" },
  { cz: "Snědli jste všechno?", fr: ["Vous avez tout mangé ?", "Avez-vous tout mangé ?", "Est-ce que vous avez tout mangé ?"], t: "pc" },
  { cz: "Udělal si domácí úkoly.", fr: ["Il a fait ses devoirs."], t: "pc" },
  { cz: "Vybrala jsem si červené šaty.", fr: ["J'ai choisi la robe rouge.", "J'ai choisi une robe rouge."], t: "pc" },
  { cz: "Vzal jsem si taxi.", fr: ["J'ai pris un taxi.", "J'ai pris le taxi."], t: "pc" },
  { cz: "Vyšla nahoru do svého pokoje.", fr: ["Elle est montée dans sa chambre."], t: "pc" },
  { cz: "Nechtěl přijít.", fr: ["Il n'a pas voulu venir."], t: "pc" },
  { cz: "Prodali svůj dům.", fr: ["Ils ont vendu leur maison."], t: "pc" },
  { cz: "Kam jsi dal klíče?", fr: ["Où as-tu mis les clés ?", "Où est-ce que tu as mis les clés ?", "Tu as mis les clés où ?"], t: "pc" },
  { cz: "(Ony) přišly pozdě.", fr: ["Elles sont venues en retard.", "Elles sont venues tard."], t: "pc" },
  { cz: "Vypili jsme kávu.", fr: ["Nous avons bu un café.", "Nous avons bu du café.", "Nous avons bu le café.", "On a bu un café."], t: "pc" },
  { cz: "Narodila se v Praze.", fr: ["Elle est née à Prague."], t: "pc" },
  { cz: "Zemřel v roce 1990.", fr: ["Il est mort en 1990."], t: "pc" },
  { cz: "Spadl jsem.", fr: ["Je suis tombé.", "Je suis tombée."], t: "pc" },
  { cz: "Viděli jste Eiffelovu věž?", fr: ["Vous avez vu la tour Eiffel ?", "Avez-vous vu la tour Eiffel ?", "Est-ce que vous avez vu la tour Eiffel ?"], t: "pc" },
  { cz: "Nerozuměl jsem.", fr: ["Je n'ai pas compris."], t: "pc" },
  { cz: "Čekali jsme na autobus.", fr: ["Nous avons attendu le bus.", "Nous avons attendu l'autobus.", "On a attendu le bus."], t: "pc" },
  { cz: "Slyšela jsem hudbu.", fr: ["J'ai entendu de la musique.", "J'ai entendu la musique."], t: "pc" },
  { cz: "Vyhrál zápas.", fr: ["Il a gagné le match."], t: "pc" },
  { cz: "Měla jsem štěstí.", fr: ["J'ai eu de la chance."], t: "pc" },
  { cz: "Byl jsem nemocný.", fr: ["J'ai été malade."], t: "pc" },
  { cz: "Myslel jsem na tebe.", fr: ["J'ai pensé à toi."], t: "pc" },
  { cz: "Bydleli jsme v Lyonu.", fr: ["Nous avons habité à Lyon.", "Nous avons habité Lyon.", "On a habité à Lyon."], t: "pc" },
  { cz: "Ten film se jí líbil.", fr: ["Elle a aimé le film.", "Elle a aimé ce film."], t: "pc" },
  { cz: "Vynesl jsem kufry nahoru.", fr: ["J'ai monté les valises."], t: "pc" },
  { cz: "Dokončili jsme práci.", fr: ["Nous avons fini le travail.", "Nous avons fini notre travail.", "On a fini le travail."], t: "pc" },
  { cz: "Poznal jsem Paula v Paříži.", fr: ["J'ai connu Paul à Paris."], t: "pc" },
  { cz: "Bydlím v Praze.", fr: ["J'habite à Prague.", "J'habite Prague."], t: "pres" },
  { cz: "Co děláte?", fr: ["Qu'est-ce que vous faites ?", "Que faites-vous ?", "Vous faites quoi ?"], t: "pres" },
  { cz: "Pijeme vodu.", fr: ["Nous buvons de l'eau.", "On boit de l'eau."], t: "pres" },
  { cz: "Nemůžu.", fr: ["Je ne peux pas."], t: "pres" },
  { cz: "Chceš kávu?", fr: ["Tu veux un café ?", "Veux-tu un café ?", "Est-ce que tu veux un café ?", "Tu veux du café ?"], t: "pres" },
  { cz: "Jezdí autobusem. (berou autobus)", fr: ["Ils prennent le bus.", "Elles prennent le bus."], t: "pres" },
  { cz: "Vidíme moře.", fr: ["Nous voyons la mer.", "On voit la mer."], t: "pres" },
  { cz: "Víš to?", fr: ["Tu le sais ?", "Le sais-tu ?", "Est-ce que tu le sais ?"], t: "pres" },
  { cz: "Přicházejí.", fr: ["Ils viennent.", "Elles viennent."], t: "pres" },
  { cz: "Dávám si svetr.", fr: ["Je mets un pull.", "Je mets mon pull."], t: "pres" },
];

function SentDrill() {
  const [filt, setFilt] = useState("pc");
  const [order, setOrder] = useState(() => shuffle(SENT.map((_, i) => i)));
  const [pos, setPos] = useState(0);
  const [val, setVal] = useState("");
  const [res, setRes] = useState(null);
  const [score, setScore] = useState({ ok: 0, n: 0 });
  const list = order.filter(i => filt === "all" || SENT[i].t === filt);
  const s = SENT[list[pos % list.length]];

  const next = () => { setPos(p => p + 1); setVal(""); setRes(null); };
  const check = () => {
    if (res) { next(); return; }
    const r = checkAnswer(val, s.fr, false);
    if (r.empty) return;
    setRes(r); setScore(x => ({ ok: x.ok + (r.ok ? 1 : 0), n: x.n + 1 }));
  };
  const accept = () => { setRes({ ok: true, exact: true, self: true }); setScore(x => ({ ...x, ok: x.ok + 1 })); };

  return (
    <div>
      <div className="row" style={{ marginBottom: 16 }}>
        {[["pc", "passé composé"], ["pres", "présent"], ["all", "obojí"]].map(([k, l]) => (
          <button key={k} className={"chip" + (filt === k ? " on" : "")} onClick={() => { setFilt(k); setPos(0); setVal(""); setRes(null); setOrder(shuffle(SENT.map((_, i) => i))); }}>{l}</button>
        ))}
      </div>
      <div className="drill">
        <div className="task">Přelož do francouzštiny · věta {(pos % list.length) + 1} / {list.length}</div>
        <span className={"tense " + s.t}>{TENSE_LABEL[s.t]}</span>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 700, margin: "12px 0" }}>{s.cz}</div>
        <input className={"inp" + (res ? (res.ok ? " ok" : " bad") : "")} style={{ width: "100%" }} value={val} onChange={e => setVal(e.target.value)}
          onKeyDown={e => e.key === "Enter" && check()} autoCapitalize="off" autoCorrect="off" spellCheck={false} placeholder="Napiš celou větu…" />
        <div className="row" style={{ marginTop: 12 }}>
          <button className="btn solid" onClick={check}>{res ? "Další (Enter) →" : "Zkontrolovat"}</button>
          {!res && <button className="btn" onClick={() => { setRes({ ok: false, skip: true }); setScore(x => ({ ...x, n: x.n + 1 })); }}>Ukázat řešení</button>}
        </div>
        {res && (
          <div className={"fb fade " + (res.ok ? "ok" : "bad")}>
            <div>{res.ok ? (res.exact ? "✓ Správně!" : "✓ Správně – jen pozor na diakritiku.") : "Vzorové řešení:"}</div>
            <div className="big">{s.fr[0]}</div>
            {s.fr.length > 1 && <div style={{ fontSize: 14, color: "var(--muted)" }}>Také správně: {s.fr.slice(1).join(" · ")}</div>}
            {!res.ok && !res.skip && <button className="btn" style={{ marginTop: 8 }} onClick={accept}>Měl(a) jsem to dobře, jen jinak</button>}
          </div>
        )}
        <div className="statline"><span>Skóre: <b>{score.ok} / {score.n}</b></span></div>
      </div>
    </div>
  );
}

function DrillTab({ stats, record }) {
  const [mode, setMode] = useState("single");
  const modes = [["single", "✍️ Jeden tvar"], ["table", "📋 Celá tabulka"], ["aux", "🏠 Avoir / être + příčestí"], ["sent", "💬 Věty"]];
  return (
    <div>
      <Title no="Exercices" lede="Píšeš jen tvar slovesa (zájmeno je předvyplněné). Velká písmena a chybějící diakritika se tolerují, ale upozorním tě na ni. Slovesa, ve kterých chybuješ, se vracejí častěji.">Procvičování</Title>
      <div className="row" style={{ marginBottom: 18, borderBottom: "1px solid var(--line)", paddingBottom: 14 }}>
        {modes.map(([k, l]) => <button key={k} className={"btn" + (mode === k ? " solid" : "")} onClick={() => setMode(k)}>{l}</button>)}
      </div>
      <div key={mode} className="fade">
        {mode === "single" && <SingleDrill stats={stats} record={record} />}
        {mode === "table" && <TableDrill record={record} />}
        {mode === "aux" && <AuxDrill stats={stats} record={record} />}
        {mode === "sent" && <SentDrill />}
      </div>
    </div>
  );
}

/* ═══════════════════════ 7. KVÍZ (Quiz Engine) ═══════════════════════ */

const QUESTIONS = [
  { question: "Jak se tvoří passé composé?", type: "single", options: ["avoir/être v přítomném čase + příčestí minulé", "avoir/être v imparfait + infinitiv", "infinitiv + koncovka -é", "aller + infinitiv"], correct: [0], explanation: "Passé composé = pomocné sloveso (avoir, nebo être) v présent + participe passé: j'ai parlé, elle est allée.", tip: "aller + infinitiv je blízká budoucnost (je vais manger)." },
  { question: "Která slovesa z tvého seznamu tvoří passé composé s ÊTRE?", type: "multi", options: ["aller", "venir", "tomber", "prendre", "naître", "faire", "mourir", "regarder"], correct: [0, 1, 2, 4, 6], explanation: "S être: aller, venir, monter, tomber, naître, mourir (dům être). prendre, faire, regarder mají avoir." },
  { question: "Příčestí minulé slovesa prendre je…", type: "single", options: ["pris", "prendu", "prendé", "prit"], correct: [0], explanation: "prendre → pris, stejně comprendre → compris." },
  { question: "Příčestí minulé slovesa voir je…", type: "single", options: ["vu", "vou", "voi", "voyé"], correct: [0], explanation: "voir → vu (j'ai vu).", tip: "pu – su – bu – vu – eu" },
  { question: "Elle ___ née en 2008.", type: "single", options: ["est", "a", "était", "es"], correct: [0], explanation: "naître má être; elle → est. Shoda: née (+e)." },
  { question: "Nous ___ fini nos devoirs.", type: "single", options: ["avons", "sommes", "avez", "ont"], correct: [0], explanation: "finir má avoir; nous → avons. Příčestí fini." },
  { question: "Marie et Julie sont ___ (venir).", type: "single", options: ["venues", "venus", "venu", "venue"], correct: [0], explanation: "S être shoda s podmětem: dvě ženy → ženský rod množného čísla → -es." },
  { question: "Který zápor je správně?", type: "single", options: ["Je n'ai pas mangé.", "Je n'ai mangé pas.", "Je ne pas ai mangé.", "Je n'ai mangé ne pas."], correct: [0], explanation: "ne…pas obaluje pomocné sloveso, příčestí jde až za pas." },
  { question: "Příčestí minulé slovesa être je…", type: "single", options: ["été", "étu", "su", "eu"], correct: [0], explanation: "être → été a tvoří se s avoir: j'ai été." },
  { question: "„Byl jsem nemocný.“ je…", type: "single", options: ["J'ai été malade.", "Je suis été malade.", "J'ai eu malade.", "Je suis malade."], correct: [0], explanation: "Sloveso être má passé composé s AVOIR: j'ai été." },
  { question: "Příčestí minulé slovesa avoir je…", type: "single", options: ["eu", "avu", "ayé", "été"], correct: [0], explanation: "avoir → eu (j'ai eu = měl jsem)." },
  { question: "Příčestí minulé slovesa faire je…", type: "single", options: ["fait", "faisé", "fai", "fu"], correct: [0], explanation: "faire → fait (j'ai fait)." },
  { question: "„Zemřela v roce 1990.“", type: "single", options: ["Elle est morte en 1990.", "Elle a mort en 1990.", "Elle est mourue en 1990.", "Elle a mouru en 1990."], correct: [0], explanation: "mourir → être + mort, shoda: morte." },
  { question: "présent: nous (manger)", type: "single", options: ["mangeons", "mangons", "mangez", "mangeons-nous"], correct: [0], explanation: "nous mangEons – e zůstává kvůli výslovnosti [ž]." },
  { question: "présent: ils (prendre)", type: "single", options: ["prennent", "prendent", "prenent", "prends"], correct: [0], explanation: "ils prennent – dvě n. nous prenons – jedno n." },
  { question: "présent: vous (faire)", type: "single", options: ["faites", "faisez", "fais", "font"], correct: [0], explanation: "vous faites – jeden ze tří tvarů na -tes (êtes, faites, dites)." },
  { question: "présent: j' (acheter)", type: "single", options: ["achète", "achete", "achètes", "achetons"], correct: [0], explanation: "Botička: j'achète, tu achètes, il achète, ils achètent, ale nous achetons." },
  { question: "présent: ils (boire)", type: "single", options: ["boivent", "buvent", "boient", "boisent"], correct: [0], explanation: "bois, bois, boit, buvons, buvez, boivent." },
  { question: "présent: tu (vouloir)", type: "single", options: ["veux", "veus", "voulez", "veut"], correct: [0], explanation: "je veux, tu veux, il veut – koncovky -x, -x, -t." },
  { question: "présent: nous (finir)", type: "single", options: ["finissons", "finons", "finisons", "finirons"], correct: [0], explanation: "2. třída: nous finissons (-iss-, dvě s)." },
  { question: "présent: il (vendre)", type: "single", options: ["vend", "vendt", "vends", "vende"], correct: [0], explanation: "-re slovesa: il vend – bez koncovky." },
  { question: "présent: il (connaître)", type: "single", options: ["connaît", "connaisse", "connaist", "connu"], correct: [0], explanation: "il connaît – î před t." },
  { question: "présent: ils (voir)", type: "single", options: ["voient", "voyent", "voyont", "voivent"], correct: [0], explanation: "nous voyons, vous voyez, ale ils voient (i)." },
  { question: "Proč je „J'ai monté les valises“ s AVOIR?", type: "single", options: ["Protože monter má tady předmět (les valises)", "Protože je to chyba, má být je suis monté", "Protože je to zápor", "Protože podmět je je"], correct: [0], explanation: "monter bez předmětu = être (je suis monté), s předmětem = avoir (j'ai monté les valises)." },
  { question: "Impératif slovesa être (tu):", type: "single", options: ["sois", "es", "soit", "sois-tu"], correct: [0], explanation: "sois, soyons, soyez. Sois sage !" },
  { question: "Impératif slovesa avoir (vous):", type: "single", options: ["ayez", "avez", "ayiez", "aies"], correct: [0], explanation: "aie, ayons, ayez." },
  { question: "Impératif slovesa monter (tu):", type: "single", options: ["Monte !", "Montes !", "Monté !", "Monter !"], correct: [0], explanation: "U -er sloves se v impérativu tu ztrácí -s: tu montes → Monte !" },
  { question: "Které věty jsou správně?", type: "multi", options: ["Il est tombé.", "Elle a allée au cinéma.", "Nous sommes venus.", "J'ai prendu le bus.", "Vous avez bu du café.", "Elles ont mangées."], correct: [0, 2, 4], explanation: "Elle EST allée; j'ai PRIS; elles ont mangÉ (s avoir bez shody)." },
  { question: "Která příčestí končí na -u?", type: "multi", options: ["vendre", "savoir", "mettre", "attendre", "finir", "pouvoir"], correct: [0, 1, 3, 5], explanation: "vendu, su, attendu, pu. mettre → mis, finir → fini." },
  { question: "présent: il (mourir)", type: "single", options: ["meurt", "mourt", "meure", "mort"], correct: [0], explanation: "je meurs, il meurt… nous mourons, ils meurent. mort je příčestí." },
  { question: "„Čekali jsme na autobus.“", type: "single", options: ["Nous avons attendu le bus.", "Nous avons attendu pour le bus.", "Nous sommes attendus le bus.", "Nous avons attendé le bus."], correct: [0], explanation: "attendre qqn/qqch – bez předložky; příčestí attendu; s avoir." },
  { question: "Kde stojí „déjà“? „Už jsi dojedl?“", type: "single", options: ["Tu as déjà fini ?", "Tu déjà as fini ?", "Tu as fini déjà ?", "Déjà tu as fini ?"], correct: [0], explanation: "Krátká příslovce stojí mezi pomocným slovesem a příčestím." },
];

function QuizEngine({ questions, accentColor = "#1b3a8f" }) {
  const shuffleQs = qs => qs.map(q => {
    const idxs = shuffle(q.options.map((_, i) => i));
    return { ...q, options: idxs.map(i => q.options[i]), correct: q.correct.map(c => idxs.indexOf(c)) };
  });
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState({});
  const [pendingMulti, setPendingMulti] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [shuffleKey, setShuffleKey] = useState(0);
  const sq = useMemo(() => shuffleQs(questions), [questions, shuffleKey]);

  const q = sq[idx];
  const isMulti = q.type === "multi";
  const isRevealed = !!revealed[idx];
  const myAnswer = answers[idx] || [];
  const isCorrect = isRevealed && arrEqual(myAnswer, q.correct);
  const score = sq.filter((qq, i) => revealed[i] && arrEqual(answers[i] || [], qq.correct)).length;
  const pct = Math.round((score / sq.length) * 100);

  const goTo = i => { setIdx(i); setPendingMulti(sq[i].type === "multi" ? (answers[i] || []) : []); };
  const single = o => { if (isRevealed) return; setAnswers(p => ({ ...p, [idx]: [o] })); setRevealed(p => ({ ...p, [idx]: true })); };
  const toggle = o => { if (isRevealed) return; setPendingMulti(p => p.includes(o) ? p.filter(x => x !== o) : [...p, o]); };
  const submitMulti = () => { if (!pendingMulti.length) return; setAnswers(p => ({ ...p, [idx]: [...pendingMulti] })); setRevealed(p => ({ ...p, [idx]: true })); };
  const restart = () => { setIdx(0); setAnswers({}); setRevealed({}); setPendingMulti([]); setShowResults(false); setShuffleKey(k => k + 1); };

  if (showResults) {
    const msg = pct >= 90 ? "Výborně! Máš to perfektně zvládnuté!" : pct >= 70 ? "Dobře! Téměř máš vše zvládnuté." : pct >= 50 ? "Mohlo by to být lepší, ale jdeš správným směrem." : "Potřebuješ více přípravy. Opakuj a bude to!";
    return (
      <div className="card" style={{ textAlign: "center", maxWidth: 520, margin: "0 auto", padding: "36px 24px" }}>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 56, fontWeight: 900, color: accentColor, lineHeight: 1 }}>{score} / {sq.length}</div>
        <div style={{ fontSize: 22, color: "var(--muted)", margin: "6px 0 14px" }}>{pct} %</div>
        <p style={{ fontSize: 17 }}>{msg}</p>
        <button className="btn solid" onClick={restart}>Začít znovu</button>
      </div>
    );
  }

  const activeSet = isMulti ? (isRevealed ? myAnswer : pendingMulti) : myAnswer;
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="qz-dots">
        {sq.map((_, i) => {
          let bg = "#cfc6b5";
          if (i === idx) bg = accentColor;
          else if (revealed[i]) bg = arrEqual(answers[i] || [], sq[i].correct) ? "#1f7a45" : "#c8102e";
          return <div key={i} className="qz-dot" style={{ background: bg }} title={`Otázka ${i + 1}`} onClick={() => goTo(i)} />;
        })}
      </div>
      <div className="card" style={{ margin: 0 }}>
        <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 4 }}>Otázka {idx + 1} / {sq.length}{isMulti ? " · více správných odpovědí" : ""}</div>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 21, fontWeight: 700, marginBottom: 16 }}>{q.question}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {q.options.map((opt, i) => {
            let border = "1px solid var(--line)", bg = "#fff";
            if (isRevealed) {
              if (q.correct.includes(i)) { bg = "#eef7f1"; border = "2px solid #1f7a45"; }
              else if (activeSet.includes(i)) { bg = "#fbeeee"; border = "2px solid #b32020"; }
            } else if (activeSet.includes(i)) { bg = "#eef1fa"; border = `2px solid ${accentColor}`; }
            return (
              <div key={i} className="qz-opt" style={{ background: bg, border }} onClick={() => isMulti ? toggle(i) : single(i)}>
                {isMulti && <span style={{ fontSize: 18 }}>{activeSet.includes(i) ? "☑" : "☐"}</span>}
                <span>{opt}</span>
              </div>
            );
          })}
        </div>
        {isMulti && !isRevealed && <button className="btn solid" style={{ marginTop: 12 }} disabled={!pendingMulti.length} onClick={submitMulti}>Potvrdit</button>}
        {isRevealed && (
          <div className={"fb fade " + (isCorrect ? "ok" : "bad")}>
            <div className="big">{isCorrect ? "Správně!" : "Špatně"}</div>
            {!isCorrect && <div style={{ fontWeight: 600 }}>Správná odpověď: {q.correct.map(i => q.options[i]).join(", ")}</div>}
            <div>{q.explanation}</div>
            {q.tip && <div style={{ color: "var(--warn)", fontStyle: "italic", marginTop: 4 }}>Tip: {q.tip}</div>}
          </div>
        )}
      </div>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <button className="btn" disabled={idx === 0} onClick={() => goTo(idx - 1)}>← Předchozí</button>
        {idx < sq.length - 1
          ? <button className="btn" onClick={() => goTo(idx + 1)}>Další →</button>
          : <button className="btn solid" onClick={() => setShowResults(true)}>Výsledky →</button>}
      </div>
    </div>
  );
}
function arrEqual(a, b) {
  if (!a || !b) return false;
  const sa = [...a].sort((x, y) => x - y), sb = [...b].sort((x, y) => x - y);
  return sa.length === sb.length && sa.every((v, i) => v === sb[i]);
}

function QuizTab() {
  return (
    <div>
      <Title no="Quiz" lede={`${QUESTIONS.length} otázek na passé composé, présent a impératif. Odpovědi se při každém spuštění zamíchají.`}>Kvíz</Title>
      <QuizEngine questions={QUESTIONS} accentColor="#1b3a8f" />
    </div>
  );
}

/* ═══════════════════════ 8. TAHÁK ═══════════════════════ */

function CheatTab() {
  return (
    <div>
      <Title no="Mémo" lede="Všechno podstatné na jedné stránce – na ráno před testem.">Tahák</Title>
      <div className="cheat">
        <div className="card red">
          <h3>Passé composé</h3>
          <div className="mono">podmět + <b>avoir/être</b> (présent) + <b>příčestí</b><br />j'ai parlé · elle est allée</div>
          <div className="mono" style={{ marginTop: 8 }}>
            <b>avoir:</b> ai, as, a, avons, avez, ont<br />
            <b>être:</b> suis, es, est, sommes, êtes, sont
          </div>
        </div>
        <div className="card red">
          <h3>🏠 S être (6 z 32)</h3>
          <div className="mono">aller · venir · monter<br />tomber · naître · mourir</div>
          <p style={{ fontSize: 14.5 }}>Shoda s podmětem: <b>+e</b> (ž. rod), <b>+s</b> (mn. č.), <b>+es</b>.<br />elles sont venu<span className="agr">es</span> · il est mort · elle est mor<span className="agr">te</span></p>
          <p style={{ fontSize: 14.5 }}>Pasti: j'<b>ai</b> été · j'<b>ai</b> eu · j'<b>ai</b> monté les valises</p>
        </div>
        <div className="card">
          <h3>Příčestí</h3>
          <div className="mono">
            <span className="g-er">-er → -é</span> · <span className="g-ir">-ir → -i</span> · -re → -u<br />
            <b>-u:</b> eu, voulu, pu, su, bu, vu, venu, connu<br />
            <b>-is:</b> pris, compris, mis<br />
            <b>-t:</b> fait, mort<br />
            <b>zvláštní:</b> été, né
          </div>
        </div>
        <div className="card">
          <h3>Zápor a otázka</h3>
          <div className="mono">je <b>n'</b>ai <b>pas</b> vu<br />elle <b>n'</b>est <b>pas</b> venue<br />As-tu fini ? · A-t-il payé ?<br />j'ai <b>déjà</b> mangé · j'ai <b>bien</b> dormi</div>
        </div>
        <div className="card">
          <h3>Présent – koncovky</h3>
          <div className="mono">
            <span className="g-er">-er: e, es, e, ons, ez, ent</span><br />
            <span className="g-ir">-ir: is, is, it, issons, issez, issent</span><br />
            -re: s, s, —, ons, ez, ent<br />
            nepravid.: s, s, t (veux/peux: x, x, t)
          </div>
          <p style={{ fontSize: 14.5 }}>nous mang<b>e</b>ons · j'ach<b>è</b>te · je pa<b>i</b>e</p>
        </div>
        <div className="card">
          <h3>Pozor na tvary</h3>
          <div className="mono">
            ils <b>ont / sont / vont / font</b><br />
            vous <b>êtes / faites</b><br />
            prenons ↔ pre<b>nn</b>ent<br />
            venons ↔ vie<b>nn</b>ent<br />
            buvons ↔ boivent · voyons ↔ voient<br />
            il ven<b>d</b>, il pren<b>d</b> (bez -t)
          </div>
        </div>
        <div className="card">
          <h3>👢 Botička</h3>
          <p style={{ fontSize: 14.5 }}>je, tu, il, ils = jeden kmen · nous, vous = kmen z infinitivu</p>
          <div className="mono">veux / voulons · peux / pouvons<br />viens / venons · bois / buvons<br />meurs / mourons · vois / voyons<br />prends / prenons · achète / achetons</div>
        </div>
        <div className="card">
          <h3>Impératif</h3>
          <div className="mono">avoir: aie, ayons, ayez<br />être: sois, soyons, soyez<br />prendre: prends, prenons, prenez<br />monter: monte, montons, montez</div>
        </div>
        <div className="card red">
          <h3>Kdy passé composé</h3>
          <p style={{ fontSize: 14.5 }}>Ukončená jednorázová událost: <b>hier, ce matin, la semaine dernière, il y a 2 jours, soudain</b>.<br />Popis / zvyk v minulosti = imparfait.</p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════ APP ═══════════════════════ */

const TABS = [
  { id: "start", label: "🎯 Plán" },
  { id: "pc", label: "📖 Passé composé" },
  { id: "pres", label: "🕐 Présent" },
  { id: "tab", label: "📋 Tabulky" },
  { id: "fc", label: "🃏 Kartičky" },
  { id: "drill", label: "✍️ Procvičování" },
  { id: "quiz", label: "❓ Kvíz" },
  { id: "cheat", label: "📌 Tahák" },
];

const LS_KEY = "fr32verbes-stats-v1";
const EMPTY = { v: {}, t: {} };

export default function App() {
  const [tab, setTab] = useState("start");
  const [stats, setStats] = useState(() => loadLS(LS_KEY, EMPTY));
  useEffect(() => { saveLS(LS_KEY, stats); }, [stats]);

  const record = useCallback((inf, tense, ok) => {
    setStats(s => {
      const v = s.v[inf] || { ok: 0, bad: 0 };
      const t = s.t[tense] || { ok: 0, bad: 0 };
      return {
        v: { ...s.v, [inf]: { ok: v.ok + (ok ? 1 : 0), bad: v.bad + (ok ? 0 : 1) } },
        t: { ...s.t, [tense]: { ok: t.ok + (ok ? 1 : 0), bad: t.bad + (ok ? 0 : 1) } },
      };
    });
  }, []);
  const resetStats = () => setStats(EMPTY);
  const go = id => { setTab(id); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <div className="root">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet" />
      <style>{CSS}</style>
      <div className="tricolore" />
      <div className="shell">
        <header className="poster">
          <div className="big">32</div>
          <div>
            <div className="kick">Grammaire · connaître les formes</div>
            <h1>verbes : <em>présent</em> &amp; passé composé</h1>
            <div className="sub">avoir · être · aller · parler · penser · habiter · aimer · acheter · payer · manger · faire · choisir · finir · prendre · monter · vouloir · pouvoir · vendre · mettre · venir · connaître · savoir · boire · naître · mourir · tomber · regarder · voir · comprendre · entendre · attendre · gagner</div>
          </div>
        </header>
        <nav className="tabbar">
          <div className="tabs">
            {TABS.map(t => <button key={t.id} className={"tab" + (tab === t.id ? " on" : "")} onClick={() => go(t.id)}>{t.label}</button>)}
          </div>
        </nav>
        <main key={tab} className="fade">
          {tab === "start" && <StartTab stats={stats} go={go} resetStats={resetStats} />}
          {tab === "pc" && <PcTab />}
          {tab === "pres" && <PresTab />}
          {tab === "tab" && <TablesTab />}
          {tab === "fc" && <FlashTab />}
          {tab === "drill" && <DrillTab stats={stats} record={record} />}
          {tab === "quiz" && <QuizTab />}
          {tab === "cheat" && <CheatTab />}
        </main>
      </div>
    </div>
  );
}
