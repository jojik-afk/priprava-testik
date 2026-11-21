// @title Mocninné a lineární lomené funkce — písemka 23. 11.
// @subject Math
// @topic Mocninné funkce, lineární lomená funkce, nerovnice, vlastnosti funkcí
// @template mixed

import { useState, useCallback, useMemo, useId, useEffect, Children, cloneElement, isValidElement, Fragment } from 'react';

// ══════════════════════════════════════════════════════════════════
// BARVY + CSS (téma „Čtverečkovaný sešit“, tentokrát s horní lištou)
// ══════════════════════════════════════════════════════════════════
const PEN = "#1d3fa8";
const RED = "#d12b2b";
const INK = "#1b2333";
const MUTED = "#5b6578";
const GREEN = "#1f8a4c";
const ORANGE = "#b7791f";

const CSS = `
.mf{min-height:100vh;color:${INK};font-family:'Inter',system-ui,sans-serif;font-size:16px;line-height:1.65;
  background-color:#fbfbfd;
  background-image:linear-gradient(#dfe6f0 1px,transparent 1px),linear-gradient(90deg,#dfe6f0 1px,transparent 1px);
  background-size:24px 24px;}
.mf *{box-sizing:border-box}
.mf p{margin:10px 0}
.mf ul{list-style:disc;padding-left:22px;margin:10px 0}
.mf ol{list-style:decimal;padding-left:24px;margin:10px 0}
.mf li{margin:4px 0}
.mf button{font-family:inherit}
.mf h1,.mf h2,.mf h3,.mf h4{font-family:'Libre Baskerville',Georgia,serif;color:${INK};margin:0}
.mf .mono{font-family:'JetBrains Mono',ui-monospace,monospace;font-size:.93em}
.mf .top{position:sticky;top:0;z-index:30;background:rgba(251,251,253,.97);border-bottom:2px solid ${PEN};box-shadow:0 2px 0 #fff}
.mf .topIn{max-width:1060px;margin:0 auto;padding:10px 16px 0 16px}
.mf .brandRow{display:flex;align-items:baseline;gap:14px;flex-wrap:wrap;padding-left:60px}
.mf .brand{font-family:'Libre Baskerville',serif;font-size:18px;font-weight:700;color:${PEN}}
.mf .brandSub{font-size:13px;color:${MUTED}}
.mf .tabs{display:flex;gap:2px;overflow-x:auto;margin-top:6px;padding-left:52px;scrollbar-width:thin}
.mf .tab{flex:0 0 auto;min-height:44px;padding:8px 14px;border:none;border-bottom:3px solid transparent;background:transparent;color:${INK};font-size:15px;cursor:pointer;white-space:nowrap;transition:all .4s ease}
.mf .tab:hover{background:#eef2fb}
.mf .tab.on{border-bottom-color:${RED};background:#fff;color:${PEN};font-weight:600}
.mf .main{position:relative;max-width:1060px;margin:0 auto;padding:28px 24px 90px 84px;min-width:0}
.mf .main::before{content:"";position:absolute;top:0;bottom:0;left:58px;width:2px;background:#e9a3a3}
.mf .pageHead{margin-bottom:22px}
.mf .pageHead .kicker{font-size:12.5px;letter-spacing:.12em;text-transform:uppercase;color:${RED};font-weight:600}
.mf .pageHead h1{font-size:28px;line-height:1.25;margin-top:4px}
.mf .pageHead h1 span{border-bottom:3px double ${PEN};padding-bottom:2px}
.mf .lead{color:${MUTED};max-width:72ch}
.mf .entry{border-left:2px solid ${PEN};padding:4px 0 4px 18px;margin:22px 0;background:rgba(251,251,253,.88)}
.mf .entry.red{border-left-color:${RED}}
.mf .entry h3{font-size:19px;margin-bottom:6px}
.mf .chip{display:inline-flex;align-items:center;gap:6px;min-height:40px;padding:5px 12px;border:1px solid #b9c4d8;background:#fff;color:${INK};font-size:14.5px;cursor:pointer;transition:all .4s ease;margin:3px 6px 3px 0;font-family:'JetBrains Mono',monospace}
.mf .chip.on{border-color:${PEN};background:${PEN};color:#fff}
.mf .btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:44px;padding:8px 18px;border:1.5px solid ${PEN};background:#fff;color:${PEN};font-size:15px;font-weight:600;cursor:pointer;transition:all .4s ease}
.mf .btn:hover{background:#eef2fb}
.mf .btn.solid{background:${PEN};color:#fff}
.mf .btn.solid:hover{background:#16328a}
.mf .btn.redb{border-color:${RED};color:${RED}}
.mf .btn:disabled{opacity:.4;cursor:default}
.mf .coll{margin:14px 0;border-left:2px solid ${PEN};background:rgba(255,255,255,.9)}
.mf .collHead{display:flex;align-items:center;gap:12px;width:100%;min-height:52px;padding:10px 16px;border:none;background:transparent;cursor:pointer;text-align:left;font-family:'Libre Baskerville',serif;font-size:17px;font-weight:700;color:${INK}}
.mf .collHead .arr{margin-left:auto;color:${PEN};transition:transform .4s ease}
.mf .collBody{padding:2px 18px 16px 18px;animation:mfFade .4s ease}
@keyframes mfFade{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}
@keyframes mfStep{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:none}}
.mf .eq{font-family:'JetBrains Mono',monospace;background:#fff;border:1px dashed #b9c4d8;padding:10px 14px;margin:10px 0;overflow-x:auto}
.mf .note{border-left:3px solid ${RED};background:#fff6f5;padding:10px 14px;margin:12px 0;font-size:15.5px}
.mf .tip{border-left:3px solid ${PEN};background:#f1f4fc;padding:10px 14px;margin:12px 0;font-size:15.5px}
.mf .tbl{width:100%;border-collapse:collapse;background:#fff;font-size:15px;margin:10px 0}
.mf .tbl th,.mf .tbl td{border:1px solid #c9d2e3;padding:7px 10px;text-align:left;vertical-align:top}
.mf .tbl th{background:#eef2fb;color:${PEN};font-weight:600}
.mf .tbl.sgn td,.mf .tbl.sgn th{text-align:center;font-family:'JetBrains Mono',monospace;white-space:nowrap}
.mf .tbl.sgn td:first-child{text-align:left}
.mf .tbl.sgn tr.tot td{border-top:2px solid ${INK};font-weight:700}
.mf .tblWrap{overflow-x:auto;margin:10px 0;max-width:100%}
.mf .frac{display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;margin:0 2px;line-height:1.15;font-size:.92em}
.mf .frac .num{border-bottom:1.3px solid currentColor;padding:0 3px}
.mf .frac .den{padding:0 3px}
.mf .badge{display:inline-block;font-size:12.5px;font-weight:600;padding:2px 9px;border:1px solid;margin-left:8px;white-space:nowrap}
.mf .src{font-size:12.5px;color:${MUTED};letter-spacing:.04em;text-transform:uppercase}
.mf .part{margin:14px 0 6px;padding-top:10px;border-top:1px dotted #c3cbe0}
.mf .partQ{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px}
.mf .partL{font-family:'Libre Baskerville',serif;font-weight:700;color:${PEN};min-width:26px}
.mf .partTxt{font-size:16.5px}
.mf .sol{margin-top:10px;background:#fff;padding:12px 14px 14px 0;border:1px solid #dfe6f0}
.mf .solLbl{font-size:12.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${PEN};padding-left:14px;margin:8px 0 2px}
.mf .solTxt{padding-left:14px}
.mf .step{display:grid;grid-template-columns:40px minmax(0,1fr);opacity:0;animation:mfStep .4s ease forwards}
.mf .stepN{text-align:right;padding-right:10px;color:${RED};font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:700;border-right:2px solid #e9a3a3;padding-top:3px}
.mf .stepT{padding:2px 0 6px 12px;overflow-x:auto;min-width:0}
.mf .result{display:inline-block;margin:10px 0 2px 14px;padding:7px 14px;border:3px double ${RED};outline:1px solid rgba(209,43,43,.35);outline-offset:3px;color:${RED};font-weight:600;font-family:'JetBrains Mono',monospace;font-size:15px;transform:rotate(-.4deg);max-width:calc(100% - 24px)}
.mf .result.static{margin-left:0}
.mf .grid2{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:18px}
.mf .grid2>*{min-width:0}
.mf .graphBox{background:#fff;border:1px solid #cfd8e6;padding:4px;max-width:100%}
.mf .graphCap{font-size:13px;color:${MUTED};text-align:center;margin-top:2px}
.mf .inp{min-height:44px;width:90px;padding:6px 8px;border:1.5px solid #b9c4d8;background:#fff;font-family:'JetBrains Mono',monospace;font-size:16px;color:${INK};text-align:center}
.mf .inp:focus{outline:none;border-color:${PEN}}
.mf .opt{display:flex;align-items:center;gap:10px;width:100%;min-height:46px;padding:10px 14px;margin:6px 0;background:#fff;border:1.5px solid #c9d2e3;color:${INK};font-size:15.5px;text-align:left;cursor:pointer;transition:all .4s ease}
.mf .opt:hover{border-color:${PEN}}
.mf .card3d{perspective:1200px;max-width:580px;margin:0 auto}
.mf .cardIn{position:relative;height:300px;transition:transform .4s ease;transform-style:preserve-3d;cursor:pointer}
.mf .cardFace{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:24px;background:#fff;border:1px solid #c9d2e3;border-left:4px solid ${PEN};overflow:auto}
.mf .cardBack{transform:rotateY(180deg);border-left-color:${RED}}
.mf .dots{display:flex;flex-wrap:wrap;gap:7px;justify-content:center;margin:14px 0}
.mf .dot{width:14px;height:14px;border-radius:50%;border:none;cursor:pointer;padding:0;transition:background .4s ease}
.mf .fs h3{font-size:18px;margin:4px 0 8px;color:${PEN}}
.mf .fsRow{display:grid;grid-template-columns:minmax(150px,230px) minmax(0,1fr);gap:4px 16px;padding:7px 0;border-bottom:1px dotted #c3cbe0}
.mf .fsRow .k{color:${MUTED};font-size:14.5px}
.mf .fsRow .v{font-family:'JetBrains Mono',monospace;font-size:15px;overflow-x:auto}
.mf .score{font-family:'JetBrains Mono',monospace;color:${PEN};font-weight:700}
.mf .hero{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);gap:26px;align-items:center}
.mf .stamp{display:inline-block;padding:14px 22px;border:3px double ${RED};outline:1px solid rgba(209,43,43,.35);outline-offset:4px;color:${RED};font-family:'JetBrains Mono',monospace;transform:rotate(-1.5deg);background:#fff}
.mf .stamp b{display:block;font-size:30px;line-height:1.2}
.mf .topicGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;margin:14px 0}
.mf .topicCard{display:block;width:100%;text-align:left;background:#fff;border:none;border-left:3px solid ${PEN};padding:12px 14px;cursor:pointer;transition:all .4s ease;font-size:15px;color:${INK}}
.mf .topicCard:hover{background:#eef2fb;transform:translateX(3px)}
.mf .topicCard b{display:block;font-family:'Libre Baskerville',serif;color:${PEN};margin-bottom:2px}
.mf .check{display:flex;align-items:flex-start;gap:10px;min-height:44px;padding:8px 6px;cursor:pointer;border-bottom:1px dotted #c3cbe0}
.mf .check input{width:20px;height:20px;margin-top:3px;accent-color:${PEN};flex:0 0 auto}
.mf .rangeRow{display:grid;grid-template-columns:120px minmax(0,1fr) 56px;align-items:center;gap:10px;margin:6px 0}
.mf .rangeRow input[type=range]{width:100%;accent-color:${PEN};height:32px}
.mf .rangeRow .val{font-family:'JetBrains Mono',monospace;font-weight:700;color:${PEN};text-align:right}
.mf .propGrid{display:grid;grid-template-columns:minmax(110px,170px) minmax(0,1fr);gap:2px 12px;font-size:15px}
.mf .propGrid .k{color:${MUTED}}
.mf .propGrid .v{font-family:'JetBrains Mono',monospace;overflow-x:auto}
.mf .stageBtns{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0}
@media (max-width:820px){
  .mf .brandRow,.mf .tabs{padding-left:0}
  .mf .brandSub{display:none}
  .mf .main{padding:20px 16px 70px 34px}
  .mf .main::before{left:20px}
  .mf .pageHead h1{font-size:23px}
  .mf .hero{grid-template-columns:minmax(0,1fr)}
}
@media (max-width:640px){
  .mf .grid2{grid-template-columns:minmax(0,1fr)}
  .mf .fsRow{grid-template-columns:minmax(0,1fr)}
  .mf .step{grid-template-columns:30px minmax(0,1fr)}
  .mf .entry{padding-left:12px}
  .mf .rangeRow{grid-template-columns:78px minmax(0,1fr) 48px}
  .mf .propGrid{grid-template-columns:minmax(0,1fr)}
  .mf .propGrid .v{margin-bottom:6px}
}
`;

// ══════════════════════════════════════════════════════════════════
// SAZBA: `mono` úseky a zlomky [[čitatel||jmenovatel]]
// ══════════════════════════════════════════════════════════════════
function fracParts(s, keyBase) {
  const out = [];
  const re = /\[\[(.+?)\|\|(.+?)\]\]/g;
  let last = 0, m, i = 0;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push(s.slice(last, m.index));
    out.push(<span key={keyBase + "f" + i++} className="frac"><span className="num">{m[1]}</span><span className="den">{m[2]}</span></span>);
    last = re.lastIndex;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
}
function T({ children }) {
  if (typeof children !== "string") return children;
  const segs = children.split("`");
  return <>{segs.map((seg, i) => i % 2 ? <span key={i} className="mono">{fracParts(seg, i)}</span> : <span key={i}>{fracParts(seg, i)}</span>)}</>;
}
const Eq = ({ children }) => <div className="eq">{fracParts(children, "e")}</div>;
// projde strom DOM elementů a všechny textové uzly s `…` nebo [[…||…]] vysází přes T
function deepT(node) {
  if (typeof node === "string") return node.includes("`") || node.includes("[[") ? <T>{node}</T> : node;
  if (isValidElement(node) && typeof node.type === "string" && node.props.children != null) {
    return cloneElement(node, undefined, ...Children.toArray(node.props.children).map(deepT));
  }
  return node;
}
const R = ({ children }) => <>{Children.toArray(children).map(deepT)}</>;

// ══════════════════════════════════════════════════════════════════
// ČÍSLA A ZÁPIS
// ══════════════════════════════════════════════════════════════════
const SUPS = { "-": "⁻", "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" };
const sup = n => String(n).split("").map(c => SUPS[c] || c).join("");
const fmt = v => {
  if (Math.abs(v) < 1e-12) v = 0;
  const s = Number.isInteger(v) ? String(Math.abs(v)) : String(Math.round(Math.abs(v) * 100) / 100).replace(".", ",");
  return (v < 0 ? "−" : "") + s;
};
const fmt2 = v => {
  if (Math.abs(v) < 5e-3) return "0";
  const r = Math.round(v * 100) / 100;
  return (r < 0 ? "−" : "") + String(Math.abs(r)).replace(".", ",");
};
const randInt = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
function fracStr(n, d) {
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(n, d); n /= g; d /= g;
  return (n < 0 ? "−" : "") + (d === 1 ? Math.abs(n) : Math.abs(n) + "/" + d);
}
function parseNum(s) {
  if (s == null) return NaN;
  const t = String(s).trim().replace(/−/g, "-").replace(/,/g, ".").replace(/\s/g, "");
  if (t === "") return NaN;
  if (t.includes("/")) { const [a, b] = t.split("/"); return parseFloat(a) / parseFloat(b); }
  return Number(t);
}
// „x − m“ nebo „x + |m|“
const xm = m => m === 0 ? "x" : (m > 0 ? "x − " + fmt(m) : "x + " + fmt(-m));
const plusN = n => n === 0 ? "" : (n > 0 ? " + " + fmt(n) : " − " + fmt(-n));

// ══════════════════════════════════════════════════════════════════
// GRAF FUNKCE: vzorkování s přerušením u asymptot, vybarvení řešení
// ══════════════════════════════════════════════════════════════════
function FnGraph({ fns = [], asymV = [], asymH = [], pts = [], shade = [], view = [-5, 5, -5, 5], w = 340, hh, caption }) {
  const uid = "c" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const [x0, x1, y0, y1] = view;
  const h = hh || Math.round(w * (y1 - y0) / (x1 - x0));
  const sx = x => (x - x0) / (x1 - x0) * w;
  const sy = y => h - (y - y0) / (y1 - y0) * h;

  const paths = fns.map(fn => {
    const N = 800, dx = (x1 - x0) / N;
    const lo = y0 - (y1 - y0), hi = y1 + (y1 - y0);
    let d = "", pen = false, px = 0, py = 0;
    for (let i = 0; i <= N; i++) {
      const x = x0 + i * dx;
      let y;
      try { y = fn.f(x); } catch (e) { y = NaN; }
      if (!isFinite(y)) { pen = false; continue; }
      if (pen && asymV.some(v => (px - v) * (x - v) <= 0)) pen = false;
      if (pen && ((py > hi && y < lo) || (py < lo && y > hi))) pen = false;
      const yc = Math.max(lo, Math.min(hi, y));
      d += (pen ? "L" : "M") + sx(x).toFixed(1) + " " + sy(yc).toFixed(1);
      pen = true; px = x; py = y;
    }
    return d;
  });

  const nice = sp => sp <= 12 ? 1 : sp <= 24 ? 2 : sp <= 60 ? 5 : sp <= 120 ? 10 : sp <= 300 ? 25 : 50;
  const stepX = nice(x1 - x0), stepY = nice(y1 - y0);
  const lX = (x1 - x0) / stepX > 9 ? stepX * 2 : stepX, lY = (y1 - y0) / stepY > 9 ? stepY * 2 : stepY;
  const step = stepX;
  const grid = [];
  for (let gx = Math.ceil(x0 / step) * step; gx <= x1; gx += step) grid.push(<line key={"gx" + gx} x1={sx(gx)} x2={sx(gx)} y1={0} y2={h} stroke={gx === 0 ? "#6b7690" : "#e3e8f1"} strokeWidth={gx === 0 ? 1.3 : 1} />);
  for (let gy = Math.ceil(y0 / stepY) * stepY; gy <= y1; gy += stepY) grid.push(<line key={"gy" + gy} y1={sy(gy)} y2={sy(gy)} x1={0} x2={w} stroke={gy === 0 ? "#6b7690" : "#e3e8f1"} strokeWidth={gy === 0 ? 1.3 : 1} />);
  const lbl = [];
  for (let gx = Math.ceil(x0 / lX) * lX; gx <= x1; gx += lX) if (gx !== 0 && gx > x0 + 1e-9 && gx < x1 - 1e-9 && y0 < 0 && y1 > 0) lbl.push(<text key={"lx" + gx} x={sx(gx)} y={sy(0) + 13} fontSize="10" textAnchor="middle" fill="#6b7690" fontFamily="JetBrains Mono">{fmt(gx)}</text>);
  for (let gy = Math.ceil(y0 / lY) * lY; gy <= y1; gy += lY) if (gy !== 0 && gy > y0 + 1e-9 && gy < y1 - 1e-9 && x0 < 0 && x1 > 0) lbl.push(<text key={"ly" + gy} x={sx(0) - 4} y={sy(gy) + 3.5} fontSize="10" textAnchor="end" fill="#6b7690" fontFamily="JetBrains Mono">{fmt(gy)}</text>);

  const cl = x => Math.max(x0, Math.min(x1, x));
  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="graphBox" style={{ width: "100%", maxWidth: w + 10, height: "auto", display: "block" }}>
        <defs><clipPath id={uid}><rect x="0" y="0" width={w} height={h} /></clipPath></defs>
        {shade.map(([a, b], i) => <rect key={"sh" + i} x={sx(cl(a))} y={0} width={Math.max(0, sx(cl(b)) - sx(cl(a)))} height={h} fill={GREEN} opacity=".09" />)}
        {grid}
        {lbl}
        <text x={w - 6} y={sy(0) - 5} fontSize="11" textAnchor="end" fill="#6b7690" fontStyle="italic">x</text>
        <text x={sx(0) + 6} y={12} fontSize="11" fill="#6b7690" fontStyle="italic">y</text>
        {asymV.map((v, i) => <line key={"av" + i} x1={sx(v)} x2={sx(v)} y1={0} y2={h} stroke={ORANGE} strokeWidth="1.3" strokeDasharray="6 5" />)}
        {asymH.map((v, i) => <line key={"ah" + i} y1={sy(v)} y2={sy(v)} x1={0} x2={w} stroke={ORANGE} strokeWidth="1.3" strokeDasharray="6 5" />)}
        <g clipPath={`url(#${uid})`}>
          {fns.map((fn, i) => <path key={"f" + i} d={paths[i]} stroke={fn.color || PEN} strokeWidth={fn.dash ? 1.5 : 2.5} strokeDasharray={fn.dash ? "5 4" : undefined} fill="none" strokeLinejoin="round" strokeLinecap="round" />)}
        </g>
        {shade.map(([a, b, ca, cb], i) => (
          <g key={"sl" + i}>
            <line x1={sx(cl(a))} x2={sx(cl(b))} y1={sy(0)} y2={sy(0)} stroke={GREEN} strokeWidth="5" opacity=".85" />
            {isFinite(a) && a >= x0 && <circle cx={sx(a)} cy={sy(0)} r="4.5" fill={ca ? GREEN : "#fff"} stroke={GREEN} strokeWidth="2" />}
            {isFinite(b) && b <= x1 && <circle cx={sx(b)} cy={sy(0)} r="4.5" fill={cb ? GREEN : "#fff"} stroke={GREEN} strokeWidth="2" />}
          </g>
        ))}
        {pts.map((p, i) => (
          <g key={"p" + i}>
            <circle cx={sx(p.x)} cy={sy(p.y)} r={p.r || 4} fill={p.hollow ? "#fff" : (p.color || INK)} stroke={p.color || INK} strokeWidth="1.6" />
            {p.label && <text x={sx(p.x) + 6} y={sy(p.y) - 6} fontSize="11.5" fontWeight="700" fill={p.color || INK} fontFamily="JetBrains Mono">{p.label}</text>}
          </g>
        ))}
      </svg>
      {caption && <div className="graphCap">{caption}</div>}
    </div>
  );
}

const pw = e => x => Math.pow(x, e);

// ══════════════════════════════════════════════════════════════════
// SPOLEČNÉ UI PRVKY
// ══════════════════════════════════════════════════════════════════
function Coll({ icon, title, children, open: initOpen = false }) {
  const [open, setOpen] = useState(initOpen);
  return (
    <div className="coll">
      <button className="collHead" onClick={() => setOpen(o => !o)}>
        <span>{icon}</span><span>{title}</span>
        <span className="arr" style={{ transform: open ? "rotate(90deg)" : "none" }}>▸</span>
      </button>
      {open && <div className="collBody"><R>{children}</R></div>}
    </div>
  );
}

const DIFF = {
  1: { t: "Lehká ✨", c: GREEN },
  2: { t: "Střední ⚡", c: ORANGE },
  3: { t: "Těžká 🔥", c: RED },
};
const Badge = ({ d }) => <span className="badge" style={{ color: DIFF[d].c, borderColor: DIFF[d].c }}>{DIFF[d].t}</span>;

function SignTable({ cols, rows }) {
  const col = s => s === "+" || s === "✓" ? GREEN : s === "−" || s === "✗" ? RED : INK;
  return (
    <div className="tblWrap">
      <table className="tbl sgn">
        <thead><tr><th></th>{cols.map((c, i) => <th key={i}>{c}</th>)}</tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={r.tot ? "tot" : ""}>
              <td><T>{r.n}</T></td>
              {r.s.map((s, j) => <td key={j} style={{ color: col(s) }}>{s}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Steps({ steps }) {
  return (
    <div>
      {steps.map((s, i) => (
        <div key={i} className="step" style={{ animationDelay: (i * 0.12) + "s" }}>
          <div className="stepN">{i + 1}</div>
          <div className="stepT">{typeof s === "string" ? <T>{s}</T> : <SignTable {...s.table} />}</div>
        </div>
      ))}
    </div>
  );
}

function Solution({ given, formula, steps, result, graph }) {
  return (
    <div className="sol">
      {given && <><div className="solLbl">Zadáno</div><div className="solTxt"><T>{given}</T></div></>}
      {formula && <><div className="solLbl">Vzorec / postup</div><div className="solTxt"><T>{formula}</T></div></>}
      <div className="solLbl">Řešení krok za krokem</div>
      <Steps steps={steps} />
      <div className="solLbl">Výsledek</div>
      <div className="result"><T>{result}</T></div>
      {graph && <div style={{ padding: "14px 0 0 14px", maxWidth: 400 }}><FnGraph {...graph} w={graph.w || 340} /></div>}
    </div>
  );
}

function Part({ part }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="part">
      <div className="partQ">
        <span className="partL">{part.l})</span>
        <span className="partTxt"><T>{part.q}</T></span>
        {part.d && <Badge d={part.d} />}
        <button className="btn" style={{ marginLeft: "auto" }} onClick={() => setOpen(o => !o)}>{open ? "Skrýt řešení" : "Ukázat řešení"}</button>
      </div>
      {open && <Solution {...part} />}
    </div>
  );
}

function Problem({ p }) {
  return (
    <div className={"entry" + (p.red ? " red" : "")}>
      <div className="src">{p.src}</div>
      <h3>{p.title}</h3>
      <p style={{ margin: "4px 0 6px" }}><T>{p.text}</T></p>
      {p.parts.map(pt => <Part key={pt.l} part={pt} />)}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// QUIZ ENGINE (logika z assets/quiz-engine.jsx, vzhled sešitu)
// ══════════════════════════════════════════════════════════════════
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
function shuffleQuestions(questions) {
  return questions.map(q => {
    const indices = q.options.map((_, i) => i);
    const shuffledIndices = shuffleArray(indices);
    const shuffledOptions = shuffledIndices.map(i => q.options[i]);
    const newCorrect = q.correct.map(oldIdx => shuffledIndices.indexOf(oldIdx));
    return { ...q, options: shuffledOptions, correct: newCorrect };
  });
}
function arrEqual(a, b) {
  if (!a || !b) return false;
  const sa = [...a].sort((x, y) => x - y);
  const sb = [...b].sort((x, y) => x - y);
  return sa.length === sb.length && sa.every((v, i) => v === sb[i]);
}

function QuizEngine({ questions, accentColor = PEN }) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState({});
  const [pendingMulti, setPendingMulti] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [shuffleKey, setShuffleKey] = useState(0);

  const shuffledQuestions = useMemo(() => shuffleQuestions(questions), [questions, shuffleKey]);
  const q = shuffledQuestions[idx];
  const isMulti = q.type === "multi";
  const isRevealed = !!revealed[idx];
  const myAnswer = answers[idx] || [];
  const isCorrect = isRevealed && arrEqual(myAnswer, q.correct);
  const score = shuffledQuestions.filter((q, i) => revealed[i] && arrEqual(answers[i] || [], q.correct)).length;
  const pct = Math.round((score / shuffledQuestions.length) * 100);

  const goTo = useCallback((i) => {
    setIdx(i);
    setPendingMulti(shuffledQuestions[i].type === "multi" ? (answers[i] || []) : []);
  }, [answers, shuffledQuestions]);

  const handleSingleSelect = useCallback((optionIdx) => {
    if (isRevealed) return;
    setAnswers(prev => ({ ...prev, [idx]: [optionIdx] }));
    setRevealed(prev => ({ ...prev, [idx]: true }));
  }, [idx, isRevealed]);

  const toggleMulti = useCallback((optionIdx) => {
    if (isRevealed) return;
    setPendingMulti(prev => prev.includes(optionIdx) ? prev.filter(i => i !== optionIdx) : [...prev, optionIdx]);
  }, [isRevealed]);

  const submitMulti = useCallback(() => {
    if (pendingMulti.length === 0) return;
    setAnswers(prev => ({ ...prev, [idx]: [...pendingMulti] }));
    setRevealed(prev => ({ ...prev, [idx]: true }));
  }, [idx, pendingMulti]);

  const restart = useCallback(() => {
    setIdx(0); setAnswers({}); setRevealed({}); setPendingMulti([]); setShowResults(false);
    setShuffleKey(k => k + 1);
  }, []);

  if (showResults) {
    const msg = pct >= 90 ? "Výborně! Na písemku jsi připravený." : pct >= 70 ? "Dobře! Pár detailů doladit a bude to." : pct >= 50 ? "Základ je, ale projdi si znovu teorii a vyřešené úlohy." : "Ještě to chce zabrat — vrať se k teorii a úlohám z Petákové.";
    return (
      <div className="entry red" style={{ textAlign: "center", padding: "30px 18px" }}>
        <div className="result static" style={{ fontSize: 40 }}>{score} / {shuffledQuestions.length}</div>
        <div style={{ color: MUTED, fontSize: 20, margin: "12px 0" }}>{pct} %</div>
        <p style={{ maxWidth: 380, margin: "0 auto 18px" }}>{msg}</p>
        <button className="btn solid" onClick={restart}>Začít znovu</button>
      </div>
    );
  }

  const activeSet = isMulti ? (isRevealed ? myAnswer : pendingMulti) : myAnswer;
  return (
    <div style={{ maxWidth: 740 }}>
      <div className="dots" style={{ justifyContent: "flex-start" }}>
        {shuffledQuestions.map((_, i) => {
          let bg = "#c3cbe0";
          if (i === idx) bg = accentColor;
          else if (revealed[i]) bg = arrEqual(answers[i] || [], shuffledQuestions[i].correct) ? GREEN : RED;
          return <button key={i} className="dot" onClick={() => goTo(i)} title={`Otázka ${i + 1}`} style={{ background: bg, width: 18, height: 18 }} />;
        })}
      </div>
      <div className="entry">
        <div className="src">Otázka {idx + 1} / {shuffledQuestions.length}{isMulti && " · více správných odpovědí"}</div>
        <div style={{ fontSize: 18, fontWeight: 600, margin: "6px 0 14px" }}><T>{q.question}</T></div>
        {q.options.map((opt, i) => {
          let border = "#c9d2e3", bg = "#fff";
          if (isRevealed) {
            if (q.correct.includes(i)) { bg = "#eaf6ef"; border = GREEN; }
            else if (activeSet.includes(i)) { bg = "#fdeeee"; border = RED; }
          } else if (activeSet.includes(i)) { bg = "#eef2fb"; border = accentColor; }
          return (
            <button key={i} className="opt" style={{ background: bg, borderColor: border }} onClick={() => isMulti ? toggleMulti(i) : handleSingleSelect(i)}>
              {isMulti && <span style={{ fontSize: 18, minWidth: 20 }}>{activeSet.includes(i) ? "☑" : "☐"}</span>}
              <span><T>{opt}</T></span>
            </button>
          );
        })}
        {isMulti && !isRevealed && (
          <button className="btn solid" style={{ marginTop: 10 }} onClick={submitMulti} disabled={pendingMulti.length === 0}>Potvrdit</button>
        )}
        {isRevealed && (
          <div style={{ marginTop: 16, padding: "12px 14px", background: "#fff", borderLeft: `3px solid ${isCorrect ? GREEN : RED}` }}>
            <div style={{ color: isCorrect ? GREEN : RED, fontWeight: 700, marginBottom: 4 }}>{isCorrect ? "Správně!" : "Špatně"}</div>
            {!isCorrect && <div style={{ fontSize: 15, marginBottom: 6 }}>Správně: <T>{q.correct.map(i => q.options[i]).join(" | ")}</T></div>}
            <div style={{ fontSize: 15.5 }}><T>{q.explanation}</T></div>
            {q.tip && <div style={{ fontSize: 15, marginTop: 8, color: PEN }}>💡 <T>{q.tip}</T></div>}
          </div>
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
        <button className="btn" onClick={() => goTo(Math.max(0, idx - 1))} disabled={idx === 0}>← Předchozí</button>
        {idx < shuffledQuestions.length - 1
          ? <button className="btn" onClick={() => goTo(idx + 1)}>Další →</button>
          : <button className="btn solid" onClick={() => setShowResults(true)}>Výsledky →</button>}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// PŘEHLED
// ══════════════════════════════════════════════════════════════════
const CHECKS = [
  "Z grafu i z předpisu určím D(f), H(f), sudost/lichost, monotonii, omezenost, extrémy, prostost.",
  "Nakreslím graf y = xⁿ pro n kladné i záporné, sudé i liché, a vím, kudy prochází ([1; 1], [−1; ±1]).",
  "Umím posunout, překlopit a natáhnout graf: f(x − m) + n, a·f(x), −f(x), |f(x)|, f(|x|).",
  "Vím, proč |x⁻⁴| = x⁻⁴ a že |x⁻³| je sudá funkce.",
  "Převedu (ax + b)/(cx + d) na tvar k/(x − m) + n a určím asymptoty a střed S[m; n].",
  "Spočítám průsečíky s osami (s kalkulačkou na 2 desetinná místa).",
  "Vyřeším nerovnici graficky: najdu průsečíky grafů a čtu, kde je který graf výš.",
  "Vyřeším nerovnici početně metodou nulových bodů a nezapomenu vyloučit body mimo D.",
];

function Prehled({ go }) {
  const today = new Date();
  const t0 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const days = Math.round((new Date(2026, 10, 23) - t0) / 864e5);
  const when = days < 0 ? "už proběhla" : days === 0 ? "je DNES" : days === 1 ? "je ZÍTRA" : days <= 4 ? `za ${days} dny` : `za ${days} dní`;
  const [done, setDone] = useState(() => {
    try { return JSON.parse(localStorage.getItem("mf-checks") || "[]"); } catch (e) { return []; }
  });
  useEffect(() => { try { localStorage.setItem("mf-checks", JSON.stringify(done)); } catch (e) { /* ignore */ } }, [done]);
  const toggle = i => setDone(d => d.includes(i) ? d.filter(x => x !== i) : [...d, i]);

  const topics = [
    { t: "Vlastnosti funkcí", d: "D, H, sudá/lichá, monotonie, omezenost, extrémy, prostá", tab: "teorie" },
    { t: "Mocninné funkce a transformace", d: "y = xⁿ, posuny, |f(x)|, f(|x|)", tab: "teorie" },
    { t: "Lineární lomené funkce", d: "asymptoty, střed S[m; n], průsečíky", tab: "teorie" },
    { t: "Nerovnice s mocninami", d: "graficky i početně — metoda nulových bodů", tab: "teorie" },
  ];
  return (
    <div>
      <div className="hero">
        <div>
          <p style={{ fontSize: 17, marginTop: 0 }}>Písemka z matematiky v <b>pondělí 23. listopadu 2026</b>. <b>Kalkulačka je povolená</b> — počítej průsečíky na 2 desetinná místa.</p>
          <p className="lead">Tahle aplikace pokrývá všechna čtyři témata, má vyřešené všechny zadané úlohy z Petákové (str. 57/1, 2, 3 bez g₄, 4 bez h₄, 8 a str. 58/9) a k tomu neomezený trenažér.</p>
        </div>
        <div style={{ textAlign: "center" }}>
          <div className="stamp"><span style={{ fontSize: 13, letterSpacing: ".1em" }}>PÍSEMKA</span><b>{when}</b><span style={{ fontSize: 13 }}>po 23. 11. 2026</span></div>
        </div>
      </div>

      <h3 style={{ marginTop: 28, fontSize: 19 }}>Co bude v písemce</h3>
      <div className="topicGrid">
        {topics.map(t => <button key={t.t} className="topicCard" onClick={() => go(t.tab)}><b>{t.t}</b>{t.d}</button>)}
      </div>

      <div className="entry red">
        <h3>Plán na víkend</h3>
        <ol>
          <li><b>Sobota:</b> <a href="#" onClick={e => { e.preventDefault(); go("teorie"); }}>Teorie</a> → pohraj si v <a href="#" onClick={e => { e.preventDefault(); go("lab"); }}>Laboratoři</a> s posuny grafů → Petáková 57/1–4 (nejdřív sám, pak rozbal řešení).</li>
          <li><b>Neděle:</b> Petáková 57/8 a 58/9 → <a href="#" onClick={e => { e.preventDefault(); go("dalsi"); }}>Další příklady</a> (početní nerovnice!) → <a href="#" onClick={e => { e.preventDefault(); go("trenazer"); }}>Trenažér</a>, dokud nemáš 10 v řadě.</li>
          <li><b>Pondělí ráno:</b> <a href="#" onClick={e => { e.preventDefault(); go("kviz"); }}>Kvíz</a>, <a href="#" onClick={e => { e.preventDefault(); go("karticky"); }}>Kartičky</a> a <a href="#" onClick={e => { e.preventDefault(); go("vzorce"); }}>Vzorce</a>.</li>
        </ol>
      </div>

      <div className="entry">
        <h3>Checklist: Umím…</h3>
        <p className="lead" style={{ marginTop: 0 }}>Odškrtej, co máš jisté. Hotovo: <span className="score">{done.length} / {CHECKS.length}</span></p>
        {CHECKS.map((c, i) => (
          <label key={i} className="check">
            <input type="checkbox" checked={done.includes(i)} onChange={() => toggle(i)} />
            <span style={{ textDecoration: done.includes(i) ? "line-through" : "none", color: done.includes(i) ? MUTED : INK }}>{c}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// TEORIE
// ══════════════════════════════════════════════════════════════════
const STAGE_EXAMPLES = [
  {
    name: "y = |x⁻³ + 2|",
    src: "jako 57/3 g₆",
    view: [-4, 4, -4, 5],
    stages: [
      { t: "`y = x⁻³` — základní hyperbola 3. stupně (lichá).", f: pw(-3), aV: [0], aH: [0] },
      { t: "`y = x⁻³ + 2` — posun o 2 nahoru. Asymptota `y = 2`.", f: x => Math.pow(x, -3) + 2, aV: [0], aH: [2] },
      { t: "`y = |x⁻³ + 2|` — co je pod osou x, překlopíme nahoru. Asymptota `y = 2` zůstává, graf se dotkne osy x v `x = −∛0,5 ≈ −0,79`.", f: x => Math.abs(Math.pow(x, -3) + 2), aV: [0], aH: [2] },
    ],
  },
  {
    name: "y = (x − 1)⁻² − 3",
    src: "Petáková 57/6 k₁",
    view: [-3, 5, -5, 3],
    stages: [
      { t: "`y = x⁻²` — sudá, oba kusy nad osou x.", f: pw(-2), aV: [0], aH: [0] },
      { t: "`y = (x − 1)⁻²` — za `x` dosadíme `x − 1` ⇒ posun o 1 **doprava** (opačné znaménko!).", f: x => Math.pow(x - 1, -2), aV: [1], aH: [0] },
      { t: "`y = (x − 1)⁻² − 3` — posun o 3 dolů. Asymptoty `x = 1`, `y = −3`.", f: x => Math.pow(x - 1, -2) - 3, aV: [1], aH: [-3] },
    ],
  },
  {
    name: "y = 2 − (x − 3)⁵",
    src: "Petáková 57/6 k₂",
    view: [-1, 7, -4, 6],
    stages: [
      { t: "`y = x⁵` — lichá, rostoucí.", f: pw(5), aV: [], aH: [] },
      { t: "`y = (x − 3)⁵` — posun o 3 doprava.", f: x => Math.pow(x - 3, 5), aV: [], aH: [] },
      { t: "`y = −(x − 3)⁵` — překlopení podle osy x ⇒ funkce je teď klesající.", f: x => -Math.pow(x - 3, 5), aV: [], aH: [] },
      { t: "`y = 2 − (x − 3)⁵` — posun o 2 nahoru. Střed souměrnosti `[3; 2]`.", f: x => 2 - Math.pow(x - 3, 5), aV: [], aH: [] },
    ],
  },
];

function StageViewer() {
  const [ex, setEx] = useState(0);
  const [st, setSt] = useState(0);
  const E = STAGE_EXAMPLES[ex];
  const S = E.stages[st];
  const prev = st > 0 ? E.stages[st - 1] : null;
  return (
    <div className="tip" style={{ background: "#fff" }}>
      <b>Krokovač transformací</b> — postupuj od vnitřku ven.
      <div className="stageBtns">
        {STAGE_EXAMPLES.map((e, i) => <button key={i} className={"chip" + (i === ex ? " on" : "")} onClick={() => { setEx(i); setSt(0); }}>{e.name}</button>)}
      </div>
      <div className="grid2">
        <div>
          <div className="src">{E.src} · krok {st + 1} / {E.stages.length}</div>
          <p><T>{S.t.replace(/\*\*/g, "")}</T></p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="btn" disabled={st === 0} onClick={() => setSt(s => s - 1)}>← Zpět</button>
            <button className="btn solid" disabled={st === E.stages.length - 1} onClick={() => setSt(s => s + 1)}>Další krok →</button>
          </div>
        </div>
        <FnGraph view={E.view} w={320} asymV={S.aV} asymH={S.aH}
          fns={[...(prev ? [{ f: prev.f, color: MUTED, dash: true }] : []), { f: S.f }]}
          caption={prev ? "čárkovaně předchozí krok, plně aktuální" : null} />
      </div>
    </div>
  );
}

function Teorie() {
  return (
    <div>
      <p className="lead">Pět bloků. Rozbal, přečti, a hned si to zkus v Laboratoři nebo na úlohách.</p>

      <Coll icon="🧭" title="1 · Vlastnosti funkcí" open>
        <div className="tblWrap"><table className="tbl">
          <thead><tr><th>Vlastnost</th><th>Definice</th><th>Jak to poznám z grafu</th></tr></thead>
          <tbody>
            <tr><td><b>Definiční obor</b> D(f)</td><td>všechna x, pro která má předpis smysl (jmenovatel ≠ 0, …)</td><td>průmět grafu na osu x</td></tr>
            <tr><td><b>Obor hodnot</b> H(f)</td><td>všechna y, kterých funkce nabývá</td><td>průmět grafu na osu y</td></tr>
            <tr><td><b>Sudá</b></td><td>D souměrný podle 0 a <span className="mono">f(−x) = f(x)</span></td><td>souměrný podle osy y</td></tr>
            <tr><td><b>Lichá</b></td><td>D souměrný podle 0 a <span className="mono">f(−x) = −f(x)</span></td><td>souměrný podle počátku O</td></tr>
            <tr><td><b>Rostoucí</b> na M</td><td><span className="mono">x₁ &lt; x₂ ⇒ f(x₁) &lt; f(x₂)</span></td><td>zleva doprava stoupá</td></tr>
            <tr><td><b>Klesající</b> na M</td><td><span className="mono">x₁ &lt; x₂ ⇒ f(x₁) &gt; f(x₂)</span></td><td>zleva doprava klesá</td></tr>
            <tr><td><b>Prostá</b></td><td><span className="mono">x₁ ≠ x₂ ⇒ f(x₁) ≠ f(x₂)</span></td><td>každá vodorovná přímka protne graf nejvýš 1×</td></tr>
            <tr><td><b>Omezená zdola / shora</b></td><td>existuje d: <span className="mono">f(x) ≥ d</span> / h: <span className="mono">f(x) ≤ h</span> pro všechna x ∈ D</td><td>graf leží nad / pod nějakou vodorovnou přímkou</td></tr>
            <tr><td><b>Maximum / minimum</b></td><td>v bodě x₀: <span className="mono">f(x) ≤ f(x₀)</span> / <span className="mono">f(x) ≥ f(x₀)</span> pro všechna x ∈ D</td><td>nejvyšší / nejnižší bod grafu (musí existovat!)</td></tr>
          </tbody>
        </table></div>
        <div className="note"><b>Monotonie se píše na intervalech.</b> `y = [[1||x]]` je klesající na `(−∞; 0)` a na `(0; ∞)`, ale <b>ne</b> na celém `D`: `−1 &lt; 1`, a přitom `f(−1) = −1 &lt; f(1) = 1`. Proto nepiš „klesající na `(−∞; 0) ∪ (0; ∞)`“.</div>
        <div className="note"><b>Omezená ≠ má extrém.</b> `y = (x − 1)⁻² − 3` je zdola omezená (`y &gt; −3`), ale minimum nemá — hodnoty −3 nikdy nedosáhne.</div>
        <div className="tip"><b>Jak dokázat sudost/lichost početně:</b> dosaď `−x`. Např. `f(x) = x⁴ − 3x²`: `f(−x) = (−x)⁴ − 3(−x)² = x⁴ − 3x² = f(x)` ⇒ sudá. `g(x) = x³ + x⁻¹`: `g(−x) = −x³ − x⁻¹ = −g(x)` ⇒ lichá. Funkce s `D = R ∖ {2}` nemůže být sudá ani lichá (D není souměrný).</div>
        <p><b>Checklist „vlastnosti funkce“</b> (přesně tohle chce úloha „určete vlastnosti“): D, H, sudá/lichá/ani jedno, intervaly monotonie, prostá, omezenost, maximum/minimum, průsečíky s osami, asymptoty.</p>
      </Coll>

      <Coll icon="📈" title="2 · Mocninné funkce y = xⁿ">
        <p>Mocninná funkce s celým exponentem `n`. Chování určují dvě otázky: <b>je n kladné, nebo záporné?</b> a <b>je n sudé, nebo liché?</b></p>
        <div className="grid2">
          <div><FnGraph view={[-3, 3, -2, 4]} w={300} fns={[{ f: pw(2) }, { f: pw(4), color: RED }]} pts={[{ x: 1, y: 1, label: "[1;1]" }, { x: -1, y: 1, label: "[−1;1]" }]} caption="n sudé kladné: x² (modře), x⁴ (červeně)" /></div>
          <div><FnGraph view={[-3, 3, -3, 3]} w={300} fns={[{ f: pw(3) }, { f: pw(5), color: RED }]} pts={[{ x: 1, y: 1, label: "[1;1]" }, { x: -1, y: -1 }]} caption="n liché kladné: x³, x⁵" /></div>
          <div><FnGraph view={[-3, 3, -2, 4]} w={300} asymV={[0]} asymH={[0]} fns={[{ f: pw(-2) }, { f: pw(-4), color: RED }]} pts={[{ x: 1, y: 1, label: "[1;1]" }, { x: -1, y: 1 }]} caption="n sudé záporné: x⁻², x⁻⁴" /></div>
          <div><FnGraph view={[-3, 3, -3, 3]} w={300} asymV={[0]} asymH={[0]} fns={[{ f: pw(-1) }, { f: pw(-3), color: RED }]} pts={[{ x: 1, y: 1, label: "[1;1]" }, { x: -1, y: -1 }]} caption="n liché záporné: x⁻¹, x⁻³ (hyperboly)" /></div>
        </div>
        <div className="tblWrap"><table className="tbl">
          <thead><tr><th></th><th>n sudé, n &gt; 0</th><th>n liché, n &gt; 0</th><th>n sudé, n &lt; 0</th><th>n liché, n &lt; 0</th></tr></thead>
          <tbody>
            <tr><td>příklad</td><td className="mono">x², x⁴</td><td className="mono">x³, x⁵</td><td className="mono">x⁻², x⁻⁴</td><td className="mono">x⁻¹, x⁻³</td></tr>
            <tr><td>D(f)</td><td className="mono">R</td><td className="mono">R</td><td className="mono">R ∖ {"{0}"}</td><td className="mono">R ∖ {"{0}"}</td></tr>
            <tr><td>H(f)</td><td className="mono">⟨0; ∞)</td><td className="mono">R</td><td className="mono">(0; ∞)</td><td className="mono">R ∖ {"{0}"}</td></tr>
            <tr><td>parita</td><td>sudá</td><td>lichá</td><td>sudá</td><td>lichá</td></tr>
            <tr><td>monotonie</td><td>klesá na (−∞; 0⟩, roste na ⟨0; ∞)</td><td>rostoucí na R</td><td>roste na (−∞; 0), klesá na (0; ∞)</td><td>klesá na (−∞; 0) i na (0; ∞)</td></tr>
            <tr><td>prostá</td><td>ne</td><td>ano</td><td>ne</td><td>ano</td></tr>
            <tr><td>omezenost</td><td>zdola</td><td>ne</td><td>zdola</td><td>ne</td></tr>
            <tr><td>extrém</td><td>min. 0 v x = 0</td><td>není</td><td>není</td><td>není</td></tr>
            <tr><td>asymptoty</td><td>—</td><td>—</td><td>x = 0, y = 0</td><td>x = 0, y = 0</td></tr>
            <tr><td>prochází</td><td className="mono">[0;0], [1;1], [−1;1]</td><td className="mono">[0;0], [1;1], [−1;−1]</td><td className="mono">[1;1], [−1;1]</td><td className="mono">[1;1], [−1;−1]</td></tr>
          </tbody>
        </table></div>
        <div className="tip"><b>Čím větší |n|:</b> u kladných exponentů je graf na `(−1; 1)` blíž ose x a za `|x| &gt; 1` strmější. U záporných exponentů je pro `|x| &gt; 1` graf blíž ose x a u nuly vystřelí rychleji. Všechny grafy se protínají v `[1; 1]` — proto jsou u nerovnic typu `x⁶ &gt; x⁵` klíčové body `0, 1, −1`.</div>
        <p>Speciálně: `x⁰ = 1` pro `x ≠ 0` (vodorovná přímka bez bodu `[0; 1]`), `x¹ = x` (přímka).</p>
      </Coll>

      <Coll icon="🔀" title="3 · Transformace grafů">
        <div className="tblWrap"><table className="tbl">
          <thead><tr><th>Předpis</th><th>Co se stane s grafem y = f(x)</th></tr></thead>
          <tbody>
            <tr><td className="mono">y = f(x) + n</td><td>posun o n <b>nahoru</b> (n &lt; 0 dolů)</td></tr>
            <tr><td className="mono">y = f(x − m)</td><td>posun o m <b>doprava</b> (m &lt; 0 doleva) — pozor na znaménko: <span className="mono">(x + 2)</span> ⇒ doleva o 2</td></tr>
            <tr><td className="mono">y = a · f(x)</td><td>|a| &gt; 1 natažení, 0 &lt; |a| &lt; 1 stlačení ve směru osy y (body na ose x zůstanou)</td></tr>
            <tr><td className="mono">y = −f(x)</td><td>překlopení podle osy x</td></tr>
            <tr><td className="mono">y = f(−x)</td><td>překlopení podle osy y</td></tr>
            <tr><td className="mono">y = |f(x)|</td><td>části grafu <b>pod osou x</b> překlopíme nahoru, zbytek beze změny ⇒ H ⊂ ⟨0; ∞)</td></tr>
            <tr><td className="mono">y = f(|x|)</td><td>část pro <b>x ≥ 0</b> necháme, levou zahodíme a nahradíme zrcadlením pravé podle osy y ⇒ sudá funkce</td></tr>
          </tbody>
        </table></div>
        <Eq>{"y = a · (x − m)ⁿ + n₀   …  vrchol / střed se posune z [0; 0] do [m; n₀]"}</Eq>
        <StageViewer />
        <div className="note"><b>Absolutní hodnota u sudé mocniny nic nedělá:</b> `x⁻⁴ &gt; 0` vždy, takže `|x⁻⁴| = x⁻⁴` a `|x⁻⁴ + 2| = x⁻⁴ + 2` (proto v 57/4 vyjde `h₅ = h₆`). U liché mocniny `|x⁻³|` naopak překlopí levou větev nahoru a vznikne sudá funkce.</div>
        <div className="tip"><b>Pořadí kroků:</b> čti předpis „zevnitř ven“ — nejdřív to, co se děje s `x` (posun doprava/doleva, `|x|`), pak mocnina, pak násobení `a`, pak `+ n`, nakonec vnější `| |`. Např. `|x⁻³ − 1|` (posun dolů, pak překlopit) ≠ `|x⁻³| − 1` (překlopit, pak posun dolů).</div>
      </Coll>

      <Coll icon="➗" title="4 · Lineární lomená funkce">
        <Eq>{"y = [[ax + b||cx + d]],   c ≠ 0,   ad − bc ≠ 0"}</Eq>
        <p>Když `c = 0`, je to lineární funkce. Když `ad − bc = 0`, zlomek se zkrátí na konstantu (např. `[[2x + 4||x + 2]] = 2` pro `x ≠ −2`) — to už lineární lomená funkce není.</p>
        <p><b>Převod na středový tvar</b> (dělení se zbytkem):</p>
        <Eq>{"y = [[k||x − m]] + n      asymptoty x = m, y = n;  střed S[m; n]"}</Eq>
        <div className="tip"><b>Postup:</b> čitatel přepiš pomocí jmenovatele. `[[2x + 1||x − 3]]`: `2x + 1 = 2(x − 3) + 7` ⇒ `y = 2 + [[7||x − 3]]`. Takže `m = 3`, `n = 2`, `k = 7`.<br /><b>Kontrola zpaměti:</b> `n = [[a||c]]`, `m = −[[d||c]]` (kořen jmenovatele), `k = [[bc − ad||c²]]`.</div>
        <div className="grid2">
          <div>
            <ul>
              <li>{"`D = R ∖ {m}`, `H = R ∖ {n}`"}</li>
              <li>graf = rovnoosá hyperbola, střed souměrnosti `S[m; n]`</li>
              <li><b>k &gt; 0</b>: větve v I. a III. „kvadrantu“ vůči asymptotám, funkce <b>klesá</b> na `(−∞; m)` i na `(m; ∞)`</li>
              <li><b>k &lt; 0</b>: větve ve II. a IV., funkce <b>roste</b> na obou intervalech</li>
              <li>prostá, neomezená, bez maxima a minima; lichá jen pro `S = [0; 0]`</li>
              <li>průsečík s osou x: čitatel `= 0` ⇒ `x = −[[b||a]]`</li>
              <li>průsečík s osou y: dosaď `x = 0` ⇒ `y = [[b||d]]` (pokud `0 ∈ D`)</li>
            </ul>
          </div>
          <FnGraph view={[-4, 10, -5, 9]} w={320} asymV={[3]} asymH={[2]} fns={[{ f: x => (2 * x + 1) / (x - 3) }]}
            pts={[{ x: 3, y: 2, label: "S[3;2]", color: RED }, { x: -0.5, y: 0, label: "[−½;0]" }, { x: 0, y: -1 / 3 }]}
            caption="y = (2x + 1)/(x − 3) = 2 + 7/(x − 3)" />
        </div>
      </Coll>

      <Coll icon="⚖️" title="5 · Nerovnice s mocninnými funkcemi — graficky i početně">
        <h4 style={{ fontSize: 16, margin: "6px 0" }}>A) Graficky</h4>
        <ol>
          <li>Nakresli do jedné soustavy graf levé strany a graf pravé strany.</li>
          <li>Najdi jejich průsečíky (u mocnin `xᵃ = xᵇ` typicky `x = 0, 1, −1`) a body mimo D (u záporných exponentů `x = 0`).</li>
          <li>Pro `L &gt; P` hledáš x, kde je graf levé strany <b>nad</b> grafem pravé; pro `L &lt; P` pod ním.</li>
          <li>Neostrá nerovnost (`≤, ≥`) ⇒ průsečíky patří do řešení (plné kolečko), bod mimo D nikdy.</li>
        </ol>
        <div className="grid2">
          <FnGraph view={[-1.8, 1.8, -1.6, 2.2]} w={300} fns={[{ f: pw(6) }, { f: pw(5), color: RED }]} shade={[[-Infinity, 0, false, false], [1, Infinity, false, false]]} pts={[{ x: 1, y: 1 }]} caption="x⁶ > x⁵ (modře levá, červeně pravá strana) ⇒ (−∞; 0) ∪ (1; ∞)" />
          <div>
            <h4 style={{ fontSize: 16, margin: "6px 0" }}>B) Početně — metoda nulových bodů</h4>
            <ol>
              <li>Vše převeď na jednu stranu: `výraz ⋚ 0`.</li>
              <li>Vytkni / převeď na společný jmenovatel → součin nebo podíl.</li>
              <li>Najdi nulové body čitatele i jmenovatele.</li>
              <li>Tabulka znamének na intervalech (nebo dosaď testovací bod).</li>
              <li>Vyber intervaly se správným znaménkem. Nulové body jmenovatele <b>nikdy</b> nepatří do řešení.</li>
            </ol>
          </div>
        </div>
        <SignTable cols={["(−∞; 0)", "(0; 1)", "(1; ∞)"]} rows={[{ n: "`x⁵`", s: ["−", "+", "+"] }, { n: "`x − 1`", s: ["−", "−", "+"] }, { n: "`x⁵(x − 1)`", s: ["+", "−", "+"], tot: true }]} />
        <h4 style={{ fontSize: 16, margin: "14px 0 6px" }}>C) Typ `xⁿ ⋚ c`</h4>
        <ul>
          <li><b>n liché kladné</b>: `xⁿ` je rostoucí ⇒ znak nerovnosti zůstane: `x³ &gt; 8 ⇔ x &gt; 2`.</li>
          <li><b>n sudé kladné</b> (c &gt; 0): `x⁴ ≤ 16 ⇔ |x| ≤ 2 ⇔ x ∈ ⟨−2; 2⟩`; `x⁴ &gt; 16 ⇔ x &lt; −2 ∨ x &gt; 2`.</li>
          <li><b>n záporné</b>: rozděl na `x &gt; 0` a `x &lt; 0`, nebo vynásob kladnou sudou mocninou. `x⁻² ≥ 4` ⇒ (·x² &gt; 0) `1 ≥ 4x²` ⇒ `|x| ≤ ½`, `x ≠ 0`.</li>
        </ul>
        <div className="note"><b>Smíš násobit jen výrazem se známým znaménkem.</b> `x², x⁴, x⁶` jsou pro `x ≠ 0` kladné ⇒ znak nerovnosti se nemění. Nikdy nenásob `x` nebo `(x − 2)` bez rozboru případů — nevíš, jestli je kladné.</div>
        <div className="tip"><b>Kalkulačka:</b> `x⁵ = 2 ⇒ x = ⁵√2 = 2^(1/5) ≈ 1,15`. U sudé odmocniny nezapomeň na `±`: `x⁴ = 0,5 ⇒ x ≈ ±0,84`.</div>
      </Coll>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// PETÁKOVÁ — ZADANÉ ÚLOHY
// ══════════════════════════════════════════════════════════════════
const sh = (a, b, ca = false, cb = false) => [a, b, ca, cb];
const INF = Infinity;

function llfPart({ l, q, d, conv, k, kS, m, mS, n, nS, px, py, view, pts = [] }) {
  const dec = k > 0;
  return {
    l, q, d,
    given: "Lineární lomená funkce — převedeme na tvar `y = [[k||x − m]] + n`.",
    formula: "`D = R ∖ {m}`, `H = R ∖ {n}`, asymptoty `x = m`, `y = n`, střed `S[m; n]`.",
    steps: [
      ...conv,
      `\`k = ${kS}\`, \`m = ${mS}\`, \`n = ${nS}\`.`,
      `\`D = R ∖ {${mS}}\` (jmenovatel ≠ 0), \`H = R ∖ {${nS}}\` (zlomek s k ≠ 0 nikdy není 0).`,
      `Asymptoty: \`x = ${mS}\`, \`y = ${nS}\`; střed souměrnosti \`S[${mS}; ${nS}]\`.`,
      dec ? `\`k > 0\` ⇒ větve v I. a III. kvadrantu vůči asymptotám, funkce klesá na \`(−∞; ${mS})\` i na \`(${mS}; ∞)\`.` : `\`k < 0\` ⇒ větve ve II. a IV. kvadrantu, funkce roste na obou intervalech.`,
      "Průsečík s osou x: " + px,
      "Průsečík s osou y: " + py,
    ],
    result: `S[${mS}; ${nS}], D = R ∖ {${mS}}, H = R ∖ {${nS}}`,
    graph: { view, asymV: [m], asymH: [n], fns: [{ f: x => k / (x - m) + n }], pts: [{ x: m, y: n, color: RED, label: "S" }, ...pts] },
  };
}

const PETAKOVA = [
  {
    src: "Petáková str. 57 (PDF 29) · úloha 1",
    title: "Grafy f a g v jedné soustavě — vzájemný vztah",
    text: "V jednotlivých případech vždy nakreslete graf funkce f a g v jedné soustavě souřadnic a určete jejich vzájemný vztah.",
    parts: [
      {
        l: "a", d: 1, q: "`f₁(x) = [[1||x²]]`,  `g₁(x) = [[1||(x − 0,5)²]]`",
        given: "`f₁(x) = x⁻²` (sudá, záporný sudý exponent), `g₁` má místo `x` výraz `x − 0,5`.",
        formula: "`y = f(x − m)` ⇒ posun o `m` doprava.",
        steps: ["`g₁(x) = f₁(x − 0,5)`.", "Graf `g₁` je graf `f₁` posunutý o `0,5` doprava.", "Asymptoty `f₁`: `x = 0`, `y = 0`. Asymptoty `g₁`: `x = 0,5`, `y = 0`.", "`D(f₁) = R ∖ {0}`, `D(g₁) = R ∖ {0,5}`, obor hodnot obou: `(0; ∞)`."],
        result: "g₁ = f₁ posunutá o 0,5 doprava",
        graph: { view: [-3, 3.5, -1, 5], asymV: [0, 0.5], fns: [{ f: pw(-2), color: MUTED, dash: true }, { f: x => Math.pow(x - 0.5, -2) }], caption: "čárkovaně f₁, plně g₁" },
      },
      {
        l: "b", d: 1, q: "`f₂(x) = [[1||x³]]`,  `g₂(x) = [[1||x³]] + 2`",
        given: "`f₂(x) = x⁻³` (lichá hyperbola), `g₂ = f₂ + 2`.",
        formula: "`y = f(x) + n` ⇒ posun o `n` nahoru.",
        steps: ["`g₂(x) = f₂(x) + 2`.", "Graf `g₂` je graf `f₂` posunutý o 2 nahoru.", "Vodorovná asymptota se posune z `y = 0` na `y = 2`, svislá zůstává `x = 0`.", "`H(f₂) = R ∖ {0}`, `H(g₂) = R ∖ {2}`; `g₂` protne osu x v `x⁻³ = −2 ⇒ x = −∛0,5 ≈ −0,79`."],
        result: "g₂ = f₂ posunutá o 2 nahoru",
        graph: { view: [-4, 4, -3, 5], asymV: [0], asymH: [2], fns: [{ f: pw(-3), color: MUTED, dash: true }, { f: x => Math.pow(x, -3) + 2 }], caption: "čárkovaně f₂, plně g₂" },
      },
      {
        l: "c", d: 1, q: "`f₃(x) = [[1||x⁵]]`,  `g₃(x) = [[2||x⁵]]`",
        given: "`g₃(x) = 2 · f₃(x)`.",
        formula: "`y = a · f(x)` ⇒ každá y-ová souřadnice se vynásobí `a`.",
        steps: ["`g₃(x) = 2 · [[1||x⁵]] = 2 · f₃(x)`.", "Graf `g₃` vznikne z `f₃` natažením 2× ve směru osy y.", "Bod `[1; 1]` grafu `f₃` přejde na `[1; 2]`, bod `[−1; −1]` na `[−1; −2]`.", "Asymptoty i obory jsou stejné: `x = 0`, `y = 0`, `D = H = R ∖ {0}`; obě funkce jsou liché."],
        result: "g₃ = 2·f₃ (natažení 2× ve směru y)",
        graph: { view: [-3, 3, -4, 4], asymV: [0], asymH: [0], fns: [{ f: pw(-5), color: MUTED, dash: true }, { f: x => 2 * Math.pow(x, -5) }], pts: [{ x: 1, y: 2, label: "[1;2]" }, { x: 1, y: 1, color: MUTED }], caption: "čárkovaně f₃, plně g₃" },
      },
      {
        l: "d", d: 2, q: "`f₄(x) = [[1||x⁴]]`,  `g₄(x) = [[1||(x + 2)⁴]] − 1`",
        given: "`g₄(x) = f₄(x + 2) − 1 = f₄(x − (−2)) − 1`.",
        formula: "`f(x − m) + n` ⇒ posun o `m` ve směru x a o `n` ve směru y.",
        steps: ["`x + 2 = x − (−2)` ⇒ posun o 2 **doleva**.".replace(/\*\*/g, ""), "`− 1` ⇒ posun o 1 dolů.", "Asymptoty `g₄`: `x = −2`, `y = −1`.", "`D(g₄) = R ∖ {−2}`, `H(g₄) = (−1; ∞)`; osa souměrnosti `x = −2`."],
        result: "g₄ = f₄ posunutá o 2 doleva a o 1 dolů",
        graph: { view: [-5, 3, -3, 4], asymV: [0, -2], asymH: [-1], fns: [{ f: pw(-4), color: MUTED, dash: true }, { f: x => Math.pow(x + 2, -4) - 1 }], caption: "čárkovaně f₄, plně g₄" },
      },
    ],
  },
  {
    src: "Petáková str. 57 (PDF 29) · úloha 2",
    title: "Grafy f₁ až f₆ — D, H, průsečíky (kalkulačka, 2 des. místa)",
    text: "Načrtněte grafy mocninných funkcí f₁ až f₆. Určete definiční obor, obor funkčních hodnot, vypočítejte souřadnice průsečíků grafu funkce s osou x a s osou y.",
    parts: [
      {
        l: "f₁", d: 1, q: "`y = (x − 1)⁴`",
        formula: "Základ `x⁴`, posun o 1 doprava.",
        steps: ["Graf `x⁴` (tvar paraboly, „plošší“ u vrcholu) posuneme o 1 doprava, vrchol `[1; 0]`.", "`D = R`, `H = ⟨0; ∞)` (sudá mocnina ≥ 0).", "Osa x: `(x − 1)⁴ = 0 ⇒ x = 1` → `[1; 0]`.", "Osa y: `y(0) = (−1)⁴ = 1` → `[0; 1]`."],
        result: "D = R, H = ⟨0; ∞), Pₓ[1; 0], Pᵧ[0; 1]",
        graph: { view: [-2, 4, -1, 5], fns: [{ f: x => Math.pow(x - 1, 4) }], pts: [{ x: 1, y: 0, label: "[1;0]" }, { x: 0, y: 1, label: "[0;1]" }] },
      },
      {
        l: "f₂", d: 1, q: "`y = x⁵ − 2`",
        formula: "Základ `x⁵` (lichá, rostoucí), posun o 2 dolů.",
        steps: ["`D = R`, `H = R` (lichá mocnina nabývá všech hodnot).", "Osa x: `x⁵ − 2 = 0 ⇒ x⁵ = 2 ⇒ x = ⁵√2 ≈ 1,15` → `[1,15; 0]`.", "Kalkulačka: `2^(1/5) = 1,1487 ≈ 1,15`.", "Osa y: `y(0) = −2` → `[0; −2]`."],
        result: "D = R, H = R, Pₓ[1,15; 0], Pᵧ[0; −2]",
        graph: { view: [-3, 3, -5, 3], fns: [{ f: x => Math.pow(x, 5) - 2 }], pts: [{ x: 1.1487, y: 0, label: "[1,15;0]" }, { x: 0, y: -2, label: "[0;−2]" }] },
      },
      {
        l: "f₃", d: 2, q: "`y = (x − 2)⁻²`",
        formula: "Základ `x⁻²`, posun o 2 doprava.",
        steps: ["Asymptoty `x = 2`, `y = 0`.", "`D = R ∖ {2}`, `H = (0; ∞)` (sudá záporná mocnina je vždy kladná).", "Osa x: `[[1||(x − 2)²]] = 0` nemá řešení → průsečík neexistuje.", "Osa y: `y(0) = (−2)⁻² = [[1||4]] = 0,25` → `[0; 0,25]`."],
        result: "D = R ∖ {2}, H = (0; ∞), Pₓ neex., Pᵧ[0; 0,25]",
        graph: { view: [-2, 6, -1, 5], asymV: [2], asymH: [0], fns: [{ f: x => Math.pow(x - 2, -2) }], pts: [{ x: 0, y: 0.25, label: "[0;0,25]" }] },
      },
      {
        l: "f₄", d: 2, q: "`y = x⁻³ − 1`",
        formula: "Základ `x⁻³`, posun o 1 dolů.",
        steps: ["Asymptoty `x = 0`, `y = −1`.", "`D = R ∖ {0}`, `H = R ∖ {−1}`.", "Osa x: `x⁻³ = 1 ⇒ x³ = 1 ⇒ x = 1` → `[1; 0]`.", "Osa y: `x = 0 ∉ D` → průsečík neexistuje."],
        result: "D = R ∖ {0}, H = R ∖ {−1}, Pₓ[1; 0], Pᵧ neex.",
        graph: { view: [-4, 4, -5, 3], asymV: [0], asymH: [-1], fns: [{ f: x => Math.pow(x, -3) - 1 }], pts: [{ x: 1, y: 0, label: "[1;0]" }] },
      },
      {
        l: "f₅", d: 1, q: "`y = 2x³ − 4`",
        formula: "Základ `x³`, natažení 2×, posun o 4 dolů.",
        steps: ["`D = R`, `H = R`.", "Osa x: `2x³ = 4 ⇒ x³ = 2 ⇒ x = ∛2 ≈ 1,26` → `[1,26; 0]`.", "Osa y: `y(0) = −4` → `[0; −4]`."],
        result: "D = R, H = R, Pₓ[1,26; 0], Pᵧ[0; −4]",
        graph: { view: [-3, 3, -6, 3], fns: [{ f: x => 2 * Math.pow(x, 3) - 4 }], pts: [{ x: 1.26, y: 0, label: "[1,26;0]" }, { x: 0, y: -4, label: "[0;−4]" }] },
      },
      {
        l: "f₆", d: 3, q: "`y = −x⁻⁴ + 2`",
        formula: "Základ `x⁻⁴`, překlopení podle osy x (`−`), posun o 2 nahoru.",
        steps: ["`x⁻⁴ > 0` ⇒ `−x⁻⁴ < 0` ⇒ `−x⁻⁴ + 2 < 2`.", "`D = R ∖ {0}`, `H = (−∞; 2)`; asymptoty `x = 0`, `y = 2`.", "Osa x: `x⁻⁴ = 2 ⇒ x⁴ = [[1||2]] ⇒ x = ±⁴√0,5 ≈ ±0,84` → `[−0,84; 0]`, `[0,84; 0]`.", "Osa y: `x = 0 ∉ D` → neexistuje."],
        result: "D = R ∖ {0}, H = (−∞; 2), Pₓ[±0,84; 0], Pᵧ neex.",
        graph: { view: [-4, 4, -5, 4], asymV: [0], asymH: [2], fns: [{ f: x => -Math.pow(x, -4) + 2 }], pts: [{ x: 0.8409, y: 0, label: "0,84" }, { x: -0.8409, y: 0 }] },
      },
    ],
  },
  {
    src: "Petáková str. 57 (PDF 29) · úloha 3 (bez g₄)",
    title: "Grafy g₁ až g₆ s absolutní hodnotou (x⁻³)",
    text: "Načrtněte grafy mocninných funkcí g₁ až g₆. Určete definiční obor, obor funkčních hodnot, vypočítejte souřadnice průsečíků grafu funkce s osou x a s osou y.",
    parts: [
      {
        l: "g₁", d: 2, q: "`y = |x⁻³| − 1`",
        formula: "`x⁻³` → `|x⁻³|` (levá větev nahoru) → posun o 1 dolů.",
        steps: ["`|x⁻³| = [[1|||x|³]]` — levá větev (pod osou x) se překlopí nahoru, vznikne sudá funkce.", "Posun o 1 dolů, asymptoty `x = 0`, `y = −1`.", "`D = R ∖ {0}`, `H = (−1; ∞)`.", "Osa x: `|x⁻³| = 1 ⇒ |x|³ = 1 ⇒ x = ±1` → `[−1; 0]`, `[1; 0]`.", "Osa y: `0 ∉ D` → neexistuje."],
        result: "D = R ∖ {0}, H = (−1; ∞), Pₓ[±1; 0]",
        graph: { view: [-4, 4, -3, 4], asymV: [0], asymH: [-1], fns: [{ f: x => Math.abs(Math.pow(x, -3)) - 1 }], pts: [{ x: 1, y: 0 }, { x: -1, y: 0 }] },
      },
      {
        l: "g₂", d: 2, q: "`y = |(x − 1)⁻³|`",
        formula: "`x⁻³` → posun o 1 doprava → `| |`.",
        steps: ["`(x − 1)⁻³`: hyperbola se středem `[1; 0]`.", "Absolutní hodnota překlopí levou větev nahoru ⇒ obě větve nad osou x.", "`D = R ∖ {1}`, `H = (0; ∞)`; asymptoty `x = 1`, `y = 0`.", "Osa x: zlomek `≠ 0` → neexistuje.", "Osa y: `y(0) = |(−1)⁻³| = |−1| = 1` → `[0; 1]`."],
        result: "D = R ∖ {1}, H = (0; ∞), Pᵧ[0; 1]",
        graph: { view: [-3, 5, -1, 5], asymV: [1], asymH: [0], fns: [{ f: x => Math.abs(Math.pow(x - 1, -3)) }], pts: [{ x: 0, y: 1, label: "[0;1]" }] },
      },
      {
        l: "g₃", d: 3, q: "`y = |x⁻³ − 1|`",
        formula: "`x⁻³` → posun o 1 dolů → `| |` (překlop jen to, co je pod osou x).",
        steps: ["`x⁻³ − 1` má asymptoty `x = 0`, `y = −1` a protíná osu x v `x = 1`.", "Pod osou x je: celá levá větev a pravá větev pro `x > 1` → ty překlopíme nahoru.", "Asymptota `y = −1` se překlopí na `y = 1`.", "`D = R ∖ {0}`, `H = ⟨0; ∞)` (hodnota 0 v `x = 1`).", "Osa x: `x⁻³ = 1 ⇒ x = 1` → `[1; 0]`. Osa y: neexistuje."],
        result: "D = R ∖ {0}, H = ⟨0; ∞), Pₓ[1; 0]",
        graph: { view: [-4, 4, -2, 5], asymV: [0], asymH: [1], fns: [{ f: x => Math.pow(x, -3) - 1, color: MUTED, dash: true }, { f: x => Math.abs(Math.pow(x, -3) - 1) }], pts: [{ x: 1, y: 0, label: "[1;0]" }], caption: "čárkovaně x⁻³ − 1, plně |x⁻³ − 1|" },
      },
      {
        l: "g₅", d: 1, q: "`y = |x⁻³| + 2`",
        formula: "`|x⁻³|` (sudá) → posun o 2 nahoru.",
        steps: ["`|x⁻³| > 0` ⇒ `y > 2`.", "`D = R ∖ {0}`, `H = (2; ∞)`; asymptoty `x = 0`, `y = 2`.", "Osa x: `|x⁻³| = −2` nemá řešení → neexistuje.", "Osa y: `0 ∉ D` → neexistuje."],
        result: "D = R ∖ {0}, H = (2; ∞), bez průsečíků",
        graph: { view: [-4, 4, -1, 6], asymV: [0], asymH: [2], fns: [{ f: x => Math.abs(Math.pow(x, -3)) + 2 }] },
      },
      {
        l: "g₆", d: 3, q: "`y = |x⁻³ + 2|`",
        formula: "`x⁻³` → posun o 2 nahoru → `| |`.",
        steps: ["`x⁻³ + 2` má asymptoty `x = 0`, `y = 2`.", "Pod osou x je jen kus levé větve pro `x ∈ (−∛0,5; 0)` → překlopíme ho nahoru.", "`D = R ∖ {0}`, `H = ⟨0; ∞)`.", "Osa x: `x⁻³ = −2 ⇒ x³ = −[[1||2]] ⇒ x = −∛0,5 ≈ −0,79` → `[−0,79; 0]`.", "Osa y: neexistuje."],
        result: "D = R ∖ {0}, H = ⟨0; ∞), Pₓ[−0,79; 0]",
        graph: { view: [-4, 4, -2, 6], asymV: [0], asymH: [2], fns: [{ f: x => Math.pow(x, -3) + 2, color: MUTED, dash: true }, { f: x => Math.abs(Math.pow(x, -3) + 2) }], pts: [{ x: -0.7937, y: 0, label: "−0,79" }], caption: "čárkovaně x⁻³ + 2, plně |x⁻³ + 2|" },
      },
    ],
  },
  {
    src: "Petáková str. 57 (PDF 29) · úloha 4 (bez h₄)",
    title: "Grafy h₁ až h₆ s absolutní hodnotou (x⁻⁴)",
    text: "Načrtněte grafy mocninných funkcí h₁ až h₆. Určete definiční obor, obor funkčních hodnot, vypočítejte souřadnice průsečíků grafu funkce s osou x a s osou y.",
    parts: [
      {
        l: "h₁", d: 1, q: "`y = |x⁻⁴| − 1`",
        formula: "`x⁻⁴ > 0` ⇒ `|x⁻⁴| = x⁻⁴`. Tedy `y = x⁻⁴ − 1`.",
        steps: ["Absolutní hodnota nic nemění (sudá mocnina je kladná).", "Posun `x⁻⁴` o 1 dolů: asymptoty `x = 0`, `y = −1`.", "`D = R ∖ {0}`, `H = (−1; ∞)`.", "Osa x: `x⁻⁴ = 1 ⇒ x⁴ = 1 ⇒ x = ±1` → `[±1; 0]`. Osa y: neexistuje."],
        result: "D = R ∖ {0}, H = (−1; ∞), Pₓ[±1; 0]",
        graph: { view: [-4, 4, -3, 4], asymV: [0], asymH: [-1], fns: [{ f: x => Math.pow(x, -4) - 1 }], pts: [{ x: 1, y: 0 }, { x: -1, y: 0 }] },
      },
      {
        l: "h₂", d: 1, q: "`y = |(x − 1)⁻⁴|`",
        formula: "`|(x − 1)⁻⁴| = (x − 1)⁻⁴` — posun `x⁻⁴` o 1 doprava.",
        steps: ["Asymptoty `x = 1`, `y = 0`.", "`D = R ∖ {1}`, `H = (0; ∞)`.", "Osa x: neexistuje.", "Osa y: `y(0) = (−1)⁻⁴ = 1` → `[0; 1]`."],
        result: "D = R ∖ {1}, H = (0; ∞), Pᵧ[0; 1]",
        graph: { view: [-3, 5, -1, 5], asymV: [1], asymH: [0], fns: [{ f: x => Math.pow(x - 1, -4) }], pts: [{ x: 0, y: 1, label: "[0;1]" }] },
      },
      {
        l: "h₃", d: 2, q: "`y = |x⁻⁴ − 1|`",
        formula: "`x⁻⁴ − 1` → překlopit část pod osou x.",
        steps: ["`x⁻⁴ − 1 < 0` pro `|x| > 1` → tyto části překlopíme nahoru.", "Asymptota `y = −1` se překlopí na `y = 1` (pro `|x| → ∞` se graf blíží k 1 zdola).", "`D = R ∖ {0}`, `H = ⟨0; ∞)`.", "Osa x: `x⁻⁴ = 1 ⇒ x = ±1` → `[±1; 0]`. Osa y: neexistuje."],
        result: "D = R ∖ {0}, H = ⟨0; ∞), Pₓ[±1; 0]",
        graph: { view: [-4, 4, -2, 5], asymV: [0], asymH: [1], fns: [{ f: x => Math.pow(x, -4) - 1, color: MUTED, dash: true }, { f: x => Math.abs(Math.pow(x, -4) - 1) }], pts: [{ x: 1, y: 0 }, { x: -1, y: 0 }], caption: "čárkovaně x⁻⁴ − 1, plně |x⁻⁴ − 1|" },
      },
      {
        l: "h₅", d: 1, q: "`y = |x⁻⁴| + 2`",
        formula: "`|x⁻⁴| = x⁻⁴` ⇒ `y = x⁻⁴ + 2`.",
        steps: ["Posun `x⁻⁴` o 2 nahoru: asymptoty `x = 0`, `y = 2`.", "`D = R ∖ {0}`, `H = (2; ∞)`.", "Průsečíky s osami neexistují."],
        result: "D = R ∖ {0}, H = (2; ∞), bez průsečíků",
        graph: { view: [-4, 4, -1, 6], asymV: [0], asymH: [2], fns: [{ f: x => Math.pow(x, -4) + 2 }] },
      },
      {
        l: "h₆", d: 2, q: "`y = |x⁻⁴ + 2|`",
        formula: "`x⁻⁴ + 2 > 0` vždy ⇒ `|x⁻⁴ + 2| = x⁻⁴ + 2`.",
        steps: ["Výraz uvnitř je vždy kladný → absolutní hodnota nic nemění.", "Tedy `h₆ = h₅`: `D = R ∖ {0}`, `H = (2; ∞)`.", "Průsečíky s osami neexistují."],
        result: "h₆ = h₅  (D = R ∖ {0}, H = (2; ∞))",
        graph: { view: [-4, 4, -1, 6], asymV: [0], asymH: [2], fns: [{ f: x => Math.abs(Math.pow(x, -4) + 2) }] },
      },
    ],
  },
  {
    src: "Petáková str. 57 (PDF 29) · úloha 8",
    title: "Řešte v R graficky následující nerovnice",
    red: true,
    text: "V grafech je modře levá strana, červeně pravá strana, zeleně řešení na ose x (plné kolečko = patří, prázdné = nepatří). Postup ukazuje i početní ověření.",
    parts: [
      {
        l: "a", d: 1, q: "`x⁶ > x⁵`",
        formula: "Průsečíky grafů: `x⁶ = x⁵ ⇒ x⁵(x − 1) = 0 ⇒ x = 0, x = 1`.",
        steps: ["Graficky: `x⁶` je nad `x⁵` vlevo od 0 (tam je `x⁵` záporné) a vpravo od 1.", "Početně: `x⁶ − x⁵ > 0 ⇒ x⁵(x − 1) > 0`.", { table: { cols: ["(−∞; 0)", "(0; 1)", "(1; ∞)"], rows: [{ n: "`x⁵`", s: ["−", "+", "+"] }, { n: "`x − 1`", s: ["−", "−", "+"] }, { n: "součin", s: ["+", "−", "+"], tot: true }] } }, "Nerovnost je ostrá ⇒ body 0 a 1 nepatří."],
        result: "x ∈ (−∞; 0) ∪ (1; ∞)",
        graph: { view: [-1.8, 1.8, -1.6, 2.2], fns: [{ f: pw(6) }, { f: pw(5), color: RED }], shade: [sh(-INF, 0), sh(1, INF)] },
      },
      {
        l: "b", d: 2, q: "`−x³ ≤ x⁴`",
        formula: "Průsečíky: `x⁴ + x³ = 0 ⇒ x³(x + 1) = 0 ⇒ x = 0, x = −1`.",
        steps: ["Graficky: `−x³` je pod (nebo na) `x⁴` vlevo od −1 a vpravo od 0.", "Početně: `0 ≤ x⁴ + x³ = x³(x + 1)`.", { table: { cols: ["(−∞; −1)", "(−1; 0)", "(0; ∞)"], rows: [{ n: "`x³`", s: ["−", "−", "+"] }, { n: "`x + 1`", s: ["−", "+", "+"] }, { n: "součin", s: ["+", "−", "+"], tot: true }] } }, "Neostrá nerovnost ⇒ body −1 a 0 patří do řešení."],
        result: "x ∈ (−∞; −1⟩ ∪ ⟨0; ∞)",
        graph: { view: [-2, 1.6, -1.5, 2.5], fns: [{ f: x => -Math.pow(x, 3) }, { f: pw(4), color: RED }], shade: [sh(-INF, -1, false, true), sh(0, INF, true, false)] },
      },
      {
        l: "c", d: 2, q: "`x⁻² > x⁵`",
        formula: "`D: x ≠ 0`. Násobíme `x² > 0` → znak se nemění.",
        steps: ["`x⁻² · x² > x⁵ · x² ⇒ 1 > x⁷ ⇒ x < 1`.", "Graficky: pro `x < 0` je `x⁻² > 0 > x⁵` vždy; pro `x > 0` se grafy protnou v `[1; 1]`.", "Vyloučíme `x = 0`."],
        result: "x ∈ (−∞; 0) ∪ (0; 1)",
        graph: { view: [-2, 2, -2, 3], asymV: [0], fns: [{ f: pw(-2) }, { f: pw(5), color: RED }], shade: [sh(-INF, 0), sh(0, 1)] },
      },
      {
        l: "d", d: 3, q: "`x⁻⁴ ≤ x⁻⁵`",
        formula: "`D: x ≠ 0`. Násobíme `x⁶ > 0`.",
        steps: ["`x⁻⁴ · x⁶ ≤ x⁻⁵ · x⁶ ⇒ x² ≤ x ⇒ x(x − 1) ≤ 0`.", "Řešení `x ∈ ⟨0; 1⟩`, ale `0 ∉ D`.", "Graficky: pro `x < 0` je `x⁻⁵ < 0 < x⁻⁴` → nevyhovuje; pro `0 < x ≤ 1` je `x⁻⁵` výš."],
        result: "x ∈ (0; 1⟩",
        graph: { view: [-2, 2.5, -2, 4], asymV: [0], fns: [{ f: pw(-4) }, { f: pw(-5), color: RED }], shade: [sh(0, 1, false, true)] },
      },
      {
        l: "e", d: 2, q: "`x⁻³ ≤ −x⁷`",
        formula: "Rozbor znamének: `x⁻³` a `x⁷` mají stejné znaménko jako `x`.",
        steps: ["`x > 0`: vlevo kladné, vpravo `−x⁷ < 0` → nevyhovuje.", "`x < 0`: vlevo záporné, vpravo `−x⁷ > 0` → vyhovuje vždy.", "(Početně: · `x⁴ > 0` ⇒ `x ≤ −x¹¹ ⇒ x(1 + x¹⁰) ≤ 0 ⇒ x ≤ 0`, bez nuly.)"],
        result: "x ∈ (−∞; 0)",
        graph: { view: [-2, 2, -3, 3], asymV: [0], fns: [{ f: pw(-3) }, { f: x => -Math.pow(x, 7), color: RED }], shade: [sh(-INF, 0)] },
      },
      {
        l: "f", d: 1, q: "`x⁻⁶ > −x⁶`",
        formula: "Levá strana `> 0`, pravá `≤ 0`.",
        steps: ["`x⁻⁶ > 0` pro každé `x ≠ 0`.", "`−x⁶ ≤ 0` pro každé `x`.", "Kladné číslo je vždy větší než nekladné ⇒ platí pro všechna `x ∈ D`."],
        result: "x ∈ (−∞; 0) ∪ (0; ∞)",
        graph: { view: [-2, 2, -3, 3], asymV: [0], fns: [{ f: pw(-6) }, { f: x => -Math.pow(x, 6), color: RED }], shade: [sh(-INF, 0), sh(0, INF)] },
      },
      {
        l: "g", d: 3, q: "`−x³ ≥ x⁻⁶`",
        formula: "Pravá strana `> 0` ⇒ musí být `−x³ > 0 ⇒ x < 0`.",
        steps: ["Násobíme `x⁶ > 0`: `−x⁹ ≥ 1 ⇒ x⁹ ≤ −1`.", "`x⁹` je rostoucí ⇒ `x ≤ −1`.", "Graficky: grafy se protnou v `[−1; 1]`, vlevo od něj je `−x³` výš."],
        result: "x ∈ (−∞; −1⟩",
        graph: { view: [-2.5, 2, -2, 4], asymV: [0], fns: [{ f: x => -Math.pow(x, 3) }, { f: pw(-6), color: RED }], shade: [sh(-INF, -1, false, true)] },
      },
      {
        l: "h", d: 3, q: "`−x⁻² ≤ x⁵`",
        formula: "`D: x ≠ 0`. Násobíme `x² > 0`.",
        steps: ["`−1 ≤ x⁷ ⇒ x ≥ −1`.", "Vyloučíme `x = 0`.", "Graficky: `−x⁻²` je celá pod osou x; `x⁵` je nad ní pro `x > 0`, a pro `x < 0` je nad `−x⁻²` až od průsečíku `[−1; −1]`."],
        result: "x ∈ ⟨−1; 0) ∪ (0; ∞)",
        graph: { view: [-2.5, 2, -3, 2], asymV: [0], fns: [{ f: x => -Math.pow(x, -2) }, { f: pw(5), color: RED }], shade: [sh(-1, 0, true, false), sh(0, INF)] },
      },
    ],
  },
  {
    src: "Petáková str. 58 (PDF 30) · úloha 9",
    title: "Grafy lineárních lomených funkcí f₁ až f₁₂",
    text: "Nakreslete grafy funkcí f₁ až f₁₂. Vždy určete definiční obor, obor funkčních hodnot, asymptoty grafu, střed souměrnosti grafu, průsečíky s osou x i s osou y.",
    parts: [
      llfPart({ l: "f₁", d: 1, q: "`y = [[1||x]]`", conv: ["Už je ve tvaru `[[k||x − m]] + n`."], k: 1, kS: "1", m: 0, mS: "0", n: 0, nS: "0", px: "`[[1||x]] ≠ 0` → neexistuje.", py: "`0 ∉ D` → neexistuje.", view: [-5, 5, -5, 5] }),
      llfPart({ l: "f₂", d: 1, q: "`y = [[1||x]] + 3`", conv: ["Už je ve středovém tvaru: posun `[[1||x]]` o 3 nahoru."], k: 1, kS: "1", m: 0, mS: "0", n: 3, nS: "3", px: "`[[1||x]] = −3 ⇒ x = −[[1||3]]` → `[−1/3; 0]`.", py: "`0 ∉ D` → neexistuje.", view: [-5, 5, -2, 8], pts: [{ x: -1 / 3, y: 0 }] }),
      llfPart({ l: "f₃", d: 1, q: "`y = [[1||x − 4]]`", conv: ["Posun `[[1||x]]` o 4 doprava."], k: 1, kS: "1", m: 4, mS: "4", n: 0, nS: "0", px: "neexistuje.", py: "`y(0) = [[1||−4]] = −[[1||4]]` → `[0; −1/4]`.", view: [-1, 9, -5, 5], pts: [{ x: 0, y: -0.25 }] }),
      llfPart({ l: "f₄", d: 2, q: "`y = [[1||x − 4]] + 3`", conv: ["Posun `[[1||x]]` o 4 doprava a o 3 nahoru."], k: 1, kS: "1", m: 4, mS: "4", n: 3, nS: "3", px: "`[[1||x − 4]] = −3 ⇒ x − 4 = −[[1||3]] ⇒ x = [[11||3]]` → `[11/3; 0]`.", py: "`y(0) = −[[1||4]] + 3 = [[11||4]]` → `[0; 11/4]`.", view: [-1, 9, -2, 8], pts: [{ x: 11 / 3, y: 0 }, { x: 0, y: 2.75 }] }),
      llfPart({ l: "f₅", d: 2, q: "`y = [[x + 3||x − 4]]`", conv: ["`x + 3 = (x − 4) + 7`", "`y = [[(x − 4) + 7||x − 4]] = 1 + [[7||x − 4]]`"], k: 7, kS: "7", m: 4, mS: "4", n: 1, nS: "1", px: "čitatel `x + 3 = 0 ⇒ x = −3` → `[−3; 0]`.", py: "`y(0) = [[3||−4]] = −[[3||4]]` → `[0; −3/4]`.", view: [-6, 12, -8, 10], pts: [{ x: -3, y: 0 }, { x: 0, y: -0.75 }] }),
      llfPart({ l: "f₆", d: 2, q: "`y = [[1 − x||x + 3]]`", conv: ["`1 − x = −(x + 3) + 4`", "`y = −1 + [[4||x + 3]]`"], k: 4, kS: "4", m: -3, mS: "−3", n: -1, nS: "−1", px: "čitatel `1 − x = 0 ⇒ x = 1` → `[1; 0]`.", py: "`y(0) = [[1||3]]` → `[0; 1/3]`.", view: [-10, 4, -8, 6], pts: [{ x: 1, y: 0 }, { x: 0, y: 1 / 3 }] }),
      llfPart({ l: "f₇", d: 1, q: "`y = [[x + 3||x]]`", conv: ["`[[x + 3||x]] = [[x||x]] + [[3||x]] = 1 + [[3||x]]`"], k: 3, kS: "3", m: 0, mS: "0", n: 1, nS: "1", px: "`x + 3 = 0 ⇒ x = −3` → `[−3; 0]`.", py: "`0 ∉ D` → neexistuje.", view: [-7, 7, -6, 8], pts: [{ x: -3, y: 0 }] }),
      llfPart({ l: "f₈", d: 1, q: "`y = [[x||x − 2]]`", conv: ["`x = (x − 2) + 2`", "`y = 1 + [[2||x − 2]]`"], k: 2, kS: "2", m: 2, mS: "2", n: 1, nS: "1", px: "`x = 0` → `[0; 0]`.", py: "`y(0) = 0` → `[0; 0]` (graf prochází počátkem).", view: [-4, 8, -5, 7], pts: [{ x: 0, y: 0 }] }),
      llfPart({ l: "f₉", d: 1, q: "`y = [[2||x]]`", conv: ["Už je ve středovém tvaru, `k = 2` (oproti `[[1||x]]` natažená)."], k: 2, kS: "2", m: 0, mS: "0", n: 0, nS: "0", px: "neexistuje.", py: "neexistuje.", view: [-5, 5, -5, 5], pts: [{ x: 1, y: 2 }, { x: 2, y: 1 }] }),
      llfPart({ l: "f₁₀", d: 3, q: "`y = [[−4x||x + 3]]`", conv: ["`−4x = −4(x + 3) + 12`", "`y = −4 + [[12||x + 3]]`"], k: 12, kS: "12", m: -3, mS: "−3", n: -4, nS: "−4", px: "`−4x = 0 ⇒ x = 0` → `[0; 0]`.", py: "`y(0) = 0` → `[0; 0]`.", view: [-14, 8, -15, 7], pts: [{ x: 0, y: 0 }] }),
      llfPart({ l: "f₁₁", d: 2, q: "`y = [[2x + 1||x − 3]]`", conv: ["`2x + 1 = 2(x − 3) + 7`", "`y = 2 + [[7||x − 3]]`"], k: 7, kS: "7", m: 3, mS: "3", n: 2, nS: "2", px: "`2x + 1 = 0 ⇒ x = −[[1||2]]` → `[−1/2; 0]`.", py: "`y(0) = [[1||−3]] = −[[1||3]]` → `[0; −1/3]`.", view: [-5, 11, -6, 10], pts: [{ x: -0.5, y: 0 }, { x: 0, y: -1 / 3 }] }),
      llfPart({ l: "f₁₂", d: 3, q: "`y = [[3x + 4||2x + 1]]`", conv: ["Vytkneme 2 ze jmenovatele: `y = [[3x + 4||2(x + ½)]]`.", "`3x + 4 = 3(x + ½) + [[5||2]]`", "`y = [[3||2]] + [[5/2||2(x + ½)]] = [[3||2]] + [[5/4||x + ½]]`", "Kontrola vzorcem: `n = [[a||c]] = [[3||2]]`, `m = −[[d||c]] = −[[1||2]]`."], k: 1.25, kS: "5/4", m: -0.5, mS: "−1/2", n: 1.5, nS: "3/2", px: "`3x + 4 = 0 ⇒ x = −[[4||3]]` → `[−4/3; 0]`.", py: "`y(0) = [[4||1]] = 4` → `[0; 4]`.", view: [-5, 4, -3, 6], pts: [{ x: -4 / 3, y: 0 }, { x: 0, y: 4 }] }),
    ],
  },
];

function Ulohy() {
  const [f, setF] = useState(0);
  const list = f === 0 ? PETAKOVA : [PETAKOVA[f - 1]];
  return (
    <div>
      <p className="lead">Všechny úlohy zadané učitelem z Petákové. Nejdřív to zkus na papír, pak rozbal řešení — kroky se odkrývají postupně.</p>
      <div style={{ margin: "8px 0 4px" }}>
        {["Vše", "57/1", "57/2", "57/3", "57/4", "57/8", "58/9"].map((t, i) => <button key={t} className={"chip" + (f === i ? " on" : "")} onClick={() => setF(i)}>{t}</button>)}
      </div>
      {list.map(p => <Problem key={p.src} p={p} />)}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// DALŠÍ PŘÍKLADY (početní nerovnice, vlastnosti)
// ══════════════════════════════════════════════════════════════════
const DALSI = [
  {
    src: "Početní nerovnice · typ xⁿ ⋚ c",
    title: "Nerovnice s jednou mocninou",
    text: "Řešte v R. Rozhoduje sudost/lichost exponentu a jeho znaménko.",
    parts: [
      { l: "a", d: 1, q: "`x³ > 8`", formula: "Lichá mocnina je rostoucí ⇒ znak nerovnosti zůstane.", steps: ["`x³ = 8 ⇒ x = 2`.", "`x³` roste ⇒ `x³ > 8 ⇔ x > 2`."], result: "x ∈ (2; ∞)", graph: { view: [-3, 4, -3, 12], fns: [{ f: pw(3) }, { f: () => 8, color: RED }], shade: [sh(2, INF)] } },
      { l: "b", d: 1, q: "`x⁴ ≤ 16`", formula: "Sudá mocnina: `xⁿ ≤ c ⇔ |x| ≤ ⁿ√c`.", steps: ["`x⁴ = 16 ⇒ x = ±2` (sudá mocnina ⇒ dva kořeny!).", "`x⁴ ≤ 16 ⇔ |x| ≤ 2`."], result: "x ∈ ⟨−2; 2⟩", graph: { view: [-4, 4, -2, 20], fns: [{ f: pw(4) }, { f: () => 16, color: RED }], shade: [sh(-2, 2, true, true)] } },
      { l: "c", d: 2, q: "`x⁻² ≥ 4`", formula: "`D: x ≠ 0`. Násobíme `x² > 0`.", steps: ["`1 ≥ 4x² ⇒ x² ≤ [[1||4]] ⇒ |x| ≤ [[1||2]]`.", "Vyloučíme `x = 0`."], result: "x ∈ ⟨−1/2; 0) ∪ (0; 1/2⟩", graph: { view: [-2, 2, -1, 7], asymV: [0], fns: [{ f: pw(-2) }, { f: () => 4, color: RED }], shade: [sh(-0.5, 0, true, false), sh(0, 0.5, false, true)] } },
      { l: "d", d: 3, q: "`x⁻³ < 8`", formula: "Rozdělíme na `x < 0` a `x > 0` (nesmíme bez rozboru násobit `x³`).", steps: ["`x < 0`: `x⁻³ < 0 < 8` → vyhovuje vždy.", "`x > 0`: násobíme `x³ > 0`: `1 < 8x³ ⇒ x³ > [[1||8]] ⇒ x > [[1||2]]`.", "Sjednotíme obě části."], result: "x ∈ (−∞; 0) ∪ (1/2; ∞)", graph: { view: [-2, 3, -3, 12], asymV: [0], fns: [{ f: pw(-3) }, { f: () => 8, color: RED }], shade: [sh(-INF, 0), sh(0.5, INF)] } },
      { l: "e", d: 2, q: "`(x − 1)⁴ < 16`", formula: "Substituce `t = x − 1`: `t⁴ < 16 ⇔ |t| < 2`.", steps: ["`|x − 1| < 2 ⇔ −2 < x − 1 < 2`.", "`−1 < x < 3`."], result: "x ∈ (−1; 3)", graph: { view: [-3, 5, -2, 20], fns: [{ f: x => Math.pow(x - 1, 4) }, { f: () => 16, color: RED }], shade: [sh(-1, 3)] } },
      { l: "f", d: 2, q: "`x⁻⁴ > [[1||16]]`", formula: "`D: x ≠ 0`. Násobíme `16x⁴ > 0`.", steps: ["`16 > x⁴ ⇒ |x| < 2`.", "Vyloučíme `x = 0`."], result: "x ∈ (−2; 0) ∪ (0; 2)", graph: { view: [-4, 4, -0.5, 1.5], asymV: [0], fns: [{ f: pw(-4) }, { f: () => 1 / 16, color: RED }], shade: [sh(-2, 0), sh(0, 2)] } },
      { l: "g", d: 2, q: "`2x⁵ − 4 ≥ 0` (kalkulačka)", formula: "Lichá mocnina ⇒ jeden kořen, znak zůstává.", steps: ["`x⁵ ≥ 2 ⇒ x ≥ ⁵√2`.", "`⁵√2 = 2^(1/5) ≈ 1,15`."], result: "x ∈ ⟨⁵√2; ∞) ≈ ⟨1,15; ∞)", graph: { view: [-2, 2.5, -6, 4], fns: [{ f: x => 2 * Math.pow(x, 5) - 4 }], shade: [sh(Math.pow(2, 0.2), INF, true, false)] } },
    ],
  },
  {
    src: "Početní nerovnice · metoda nulových bodů",
    title: "Nerovnice se součinem a podílem",
    text: "Převeď na tvar `výraz ⋚ 0`, rozlož a sestav tabulku znamének. Nulové body jmenovatele nikdy nepatří do řešení.",
    red: true,
    parts: [
      { l: "a", d: 2, q: "`x³ ≥ x`", formula: "`x³ − x ≥ 0 ⇒ x(x − 1)(x + 1) ≥ 0`.", steps: ["Nulové body: `−1, 0, 1`.", { table: { cols: ["(−∞; −1)", "(−1; 0)", "(0; 1)", "(1; ∞)"], rows: [{ n: "`x + 1`", s: ["−", "+", "+", "+"] }, { n: "`x`", s: ["−", "−", "+", "+"] }, { n: "`x − 1`", s: ["−", "−", "−", "+"] }, { n: "součin", s: ["−", "+", "−", "+"], tot: true }] } }, "Neostrá ⇒ nulové body patří."], result: "x ∈ ⟨−1; 0⟩ ∪ ⟨1; ∞)", graph: { view: [-2, 2, -2, 2], fns: [{ f: pw(3) }, { f: x => x, color: RED }], shade: [sh(-1, 0, true, true), sh(1, INF, true, false)] } },
      { l: "b", d: 2, q: "`[[2x + 1||3x − 6]] ≥ 0`  (Petáková 58/11a)", formula: "Nulové body: čitatel `x = −[[1||2]]`, jmenovatel `x = 2`.", steps: [{ table: { cols: ["(−∞; −½)", "(−½; 2)", "(2; ∞)"], rows: [{ n: "`2x + 1`", s: ["−", "+", "+"] }, { n: "`3x − 6`", s: ["−", "−", "+"] }, { n: "podíl", s: ["+", "−", "+"], tot: true }] } }, "`x = −½`: zlomek `= 0` → patří (≥).", "`x = 2`: jmenovatel `= 0` → nepatří."], result: "x ∈ (−∞; −1/2⟩ ∪ (2; ∞)", graph: { view: [-5, 8, -4, 5], asymV: [2], asymH: [2 / 3], fns: [{ f: x => (2 * x + 1) / (3 * x - 6) }], shade: [sh(-INF, -0.5, false, true), sh(2, INF)] } },
      { l: "c", d: 3, q: "`[[2x + 1||3x − 6]] ≤ [[1||3]]`  (Petáková 58/11b)", formula: "Nenásob jmenovatelem! Převeď vše doleva na společný jmenovatel.", steps: ["`[[2x + 1||3x − 6]] − [[1||3]] ≤ 0`", "`[[3(2x + 1) − (3x − 6)||3(3x − 6)]] ≤ 0 ⇒ [[3x + 9||3(3x − 6)]] ≤ 0 ⇒ [[x + 3||3x − 6]] ≤ 0`", { table: { cols: ["(−∞; −3)", "(−3; 2)", "(2; ∞)"], rows: [{ n: "`x + 3`", s: ["−", "+", "+"] }, { n: "`3x − 6`", s: ["−", "−", "+"] }, { n: "podíl", s: ["+", "−", "+"], tot: true }] } }, "`x = −3` patří, `x = 2` ne."], result: "x ∈ ⟨−3; 2)", graph: { view: [-6, 6, -3, 3], asymV: [2], asymH: [2 / 3], fns: [{ f: x => (2 * x + 1) / (3 * x - 6) }, { f: () => 1 / 3, color: RED }], shade: [sh(-3, 2, true, false)] } },
      { l: "d", d: 3, q: "`[[x + 3||x − 4]] > 2`", formula: "`[[x + 3||x − 4]] − 2 > 0`.", steps: ["`[[x + 3 − 2(x − 4)||x − 4]] > 0 ⇒ [[11 − x||x − 4]] > 0`.", { table: { cols: ["(−∞; 4)", "(4; 11)", "(11; ∞)"], rows: [{ n: "`11 − x`", s: ["+", "+", "−"] }, { n: "`x − 4`", s: ["−", "+", "+"] }, { n: "podíl", s: ["−", "+", "−"], tot: true }] } }, "Ostrá nerovnost ⇒ krajní body nepatří."], result: "x ∈ (4; 11)", graph: { view: [-4, 16, -6, 10], asymV: [4], asymH: [1], fns: [{ f: x => (x + 3) / (x - 4) }, { f: () => 2, color: RED }], shade: [sh(4, 11)] } },
      { l: "e", d: 3, q: "`[[1||x − 2]] ≤ 3`", formula: "`[[1||x − 2]] − 3 ≤ 0`.", steps: ["`[[1 − 3(x − 2)||x − 2]] ≤ 0 ⇒ [[7 − 3x||x − 2]] ≤ 0`.", "Nulové body: `x = [[7||3]]` (čitatel), `x = 2` (jmenovatel).", { table: { cols: ["(−∞; 2)", "(2; 7/3)", "(7/3; ∞)"], rows: [{ n: "`7 − 3x`", s: ["+", "+", "−"] }, { n: "`x − 2`", s: ["−", "+", "+"] }, { n: "podíl", s: ["−", "+", "−"], tot: true }] } }, "`x = 7/3` patří, `x = 2` ne."], result: "x ∈ (−∞; 2) ∪ ⟨7/3; ∞)", graph: { view: [-2, 6, -4, 6], asymV: [2], asymH: [0], fns: [{ f: x => 1 / (x - 2) }, { f: () => 3, color: RED }], shade: [sh(-INF, 2), sh(7 / 3, INF, true, false)] } },
    ],
  },
  {
    src: "Vlastnosti funkcí",
    title: "Sudost, lichost, monotonie a celé „vlastnosti“",
    text: "Typ úlohy „Určete definiční obor, obor hodnot a vlastnosti funkce“.",
    parts: [
      { l: "a", d: 1, q: "Rozhodni, zda je sudá/lichá: `f(x) = x⁴ − 3x²`, `g(x) = x³ + x⁻¹`, `h(x) = (x − 1)²`", formula: "Dosaď `−x` a porovnej s `f(x)` a `−f(x)`. Nejdřív zkontroluj, že D je souměrný.", steps: ["`f(−x) = x⁴ − 3x² = f(x)` ⇒ `f` je sudá.", "`D(g) = R ∖ {0}` souměrný; `g(−x) = −x³ − x⁻¹ = −g(x)` ⇒ `g` je lichá.", "`h(−x) = (−x − 1)² = (x + 1)²`; to není `h(x)` ani `−h(x)` (např. `h(1) = 0`, `h(−1) = 4`) ⇒ ani sudá, ani lichá."], result: "f sudá, g lichá, h ani jedno" },
      { l: "b", d: 3, q: "Vlastnosti `k₁(x) = (x − 1)⁻² − 3`  (Petáková 57/6)", formula: "Základ `x⁻²`, posun o 1 doprava a o 3 dolů.", steps: ["`D = R ∖ {1}`, `H = (−3; ∞)`, asymptoty `x = 1`, `y = −3`.", "Ani sudá, ani lichá (D není souměrný podle 0).", "Rostoucí na `(−∞; 1)`, klesající na `(1; ∞)`.", "Není prostá (např. `k₁(0) = k₁(2) = −2`).", "Zdola omezená (`y > −3`), shora ne; maximum ani minimum nemá.", "Pₓ: `(x − 1)² = [[1||3]] ⇒ x = 1 ± [[1||√3]] ≈ 0,42; 1,58`. Pᵧ: `[0; −2]`."], result: "D = R∖{1}, H = (−3; ∞), roste na (−∞;1), klesá na (1;∞)", graph: { view: [-3, 5, -5, 3], asymV: [1], asymH: [-3], fns: [{ f: x => Math.pow(x - 1, -2) - 3 }], pts: [{ x: 0, y: -2, label: "[0;−2]" }, { x: 2, y: -2 }] } },
      { l: "c", d: 2, q: "Vlastnosti `k₂(x) = 2 − (x − 3)⁵`  (Petáková 57/6)", formula: "Základ `x⁵`, posun o 3 doprava, překlopení podle x, posun o 2 nahoru.", steps: ["`D = R`, `H = R`.", "Klesající na celém `R` (kvůli znaménku mínus) ⇒ prostá.", "Neomezená, bez extrémů, ani sudá ani lichá; střed souměrnosti `[3; 2]`.", "Pₓ: `(x − 3)⁵ = 2 ⇒ x = 3 + ⁵√2 ≈ 4,15`.", "Pᵧ: `k₂(0) = 2 − (−3)⁵ = 2 + 243 = 245` → `[0; 245]`."], result: "D = H = R, klesající, prostá, Pₓ[4,15; 0], Pᵧ[0; 245]", graph: { view: [-1, 7, -4, 6], fns: [{ f: x => 2 - Math.pow(x - 3, 5) }], pts: [{ x: 3, y: 2, label: "[3;2]", color: RED }, { x: 4.1487, y: 0 }] } },
      { l: "d", d: 2, q: "Monotonie a prostost `y = [[2x + 1||x − 3]]`", formula: "`y = 2 + [[7||x − 3]]`, `k = 7 > 0`.", steps: ["`k > 0` ⇒ klesající na `(−∞; 3)` a na `(3; ∞)` zvlášť.", "Na celém D klesající není: `f(2) = −5 < f(4) = 9`, i když `2 < 4`.", "Prostá je: každou hodnotu kromě `y = 2` nabývá právě jednou.", "Není omezená, nemá extrémy."], result: "klesá na (−∞; 3) a na (3; ∞), prostá, neomezená" },
    ],
  },
];

function Dalsi() {
  return (
    <div>
      <p className="lead">Úlohy navíc k tomu, co bylo zadáno — hlavně <b>početní</b> řešení nerovnic a „určete vlastnosti“. Ty v Petákové str. 57 skoro nejsou, ale v písemce budou.</p>
      {DALSI.map(p => <Problem key={p.src} p={p} />)}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// LABORATOŘ: y = a·(x − m)ᵉ + n s vlastnostmi
// ══════════════════════════════════════════════════════════════════
function powerFormula(a, e, m, n, absOut, absIn) {
  const inner = absIn ? (m === 0 ? "|x|" : `(|x| ${m > 0 ? "−" : "+"} ${fmt(Math.abs(m))})`) : (m === 0 ? "x" : `(${xm(m)})`);
  const coef = a === 1 ? "" : a === -1 ? "−" : fmt(a) + "·";
  const core = `${coef}${inner}${sup(e)}${plusN(n)}`;
  return "y = " + (absOut ? `|${core}|` : core);
}

function powerProps(a, e, m, n) {
  const mS = fmt(m), nS = fmt(n);
  const neg = e < 0, even = e % 2 === 0;
  const rows = [];
  rows.push(["D(f)", neg ? `R ∖ {${mS}}` : "R"]);
  let H;
  if (!even) H = neg ? `R ∖ {${nS}}` : "R";
  else if (neg) H = a > 0 ? `(${nS}; ∞)` : `(−∞; ${nS})`;
  else H = a > 0 ? `⟨${nS}; ∞)` : `(−∞; ${nS}⟩`;
  rows.push(["H(f)", H]);
  let par = "ani sudá, ani lichá";
  if (even && m === 0) par = "sudá";
  if (!even && m === 0 && n === 0) par = "lichá";
  rows.push(["parita", par]);
  let mono;
  if (!even) {
    const inc = neg ? a < 0 : a > 0;
    mono = neg ? `${inc ? "rostoucí" : "klesající"} na (−∞; ${mS}) i na (${mS}; ∞)` : `${inc ? "rostoucí" : "klesající"} na R`;
  } else {
    const leftInc = neg ? a > 0 : a < 0;
    const l = neg ? `(−∞; ${mS})` : `(−∞; ${mS}⟩`, r = neg ? `(${mS}; ∞)` : `⟨${mS}; ∞)`;
    mono = `${leftInc ? "rostoucí" : "klesající"} na ${l}, ${leftInc ? "klesající" : "rostoucí"} na ${r}`;
  }
  rows.push(["monotonie", mono]);
  rows.push(["prostá", even ? "ne" : "ano"]);
  rows.push(["omezenost", even ? (a > 0 ? "zdola omezená" : "shora omezená") : "neomezená"]);
  rows.push(["extrém", even && !neg ? (a > 0 ? `minimum ${nS} v x = ${mS}` : `maximum ${nS} v x = ${mS}`) : "není"]);
  rows.push(["asymptoty", neg ? `x = ${mS}, y = ${nS}` : "nemá"]);
  rows.push([even ? "osa souměrnosti" : "střed souměrnosti", even ? `x = ${mS}` : `[${mS}; ${nS}]`]);
  // průsečíky
  const q = -n / a;
  let px = [];
  if (!even) { if (!(neg && q === 0)) px = [m + Math.sign(q) * Math.pow(Math.abs(q), 1 / e)]; }
  else if (q > 0) { const r = Math.pow(q, 1 / e); px = [m - r, m + r]; }
  else if (q === 0 && !neg) px = [m];
  rows.push(["průsečík s osou x", px.length ? px.map(x => `[${fmt2(x)}; 0]`).join(", ") : "neexistuje"]);
  const y0ok = !(neg && m === 0);
  rows.push(["průsečík s osou y", y0ok ? `[0; ${fmt2(a * Math.pow(-m, e) + n)}]` : "neexistuje"]);
  return rows;
}

function RangeRow({ label, value, set, min, max, step }) {
  return (
    <div className="rangeRow">
      <span>{label}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => set(Number(e.target.value))} aria-label={label} />
      <span className="val">{fmt(value)}</span>
    </div>
  );
}

function Lab() {
  const [e, setE] = useState(-3);
  const [a, setA] = useState(1);
  const [m, setM] = useState(0);
  const [n, setN] = useState(0);
  const [absOut, setAbsOut] = useState(false);
  const [absIn, setAbsIn] = useState(false);
  const aa = a === 0 ? 0.5 : a;
  const base = x => aa * Math.pow((absIn ? Math.abs(x) : x) - m, e) + n;
  const f = x => absOut ? Math.abs(base(x)) : base(x);
  const neg = e < 0;
  const asymV = neg ? (absIn ? (m > 0 ? [m, -m] : m === 0 ? [0] : []) : [m]) : [];
  const asymH = neg ? [absOut ? Math.abs(n) : n] : [];
  const span = 6;
  const view = [Math.min(-span, m - span), Math.max(span, m + span), Math.min(-span, n - span), Math.max(span, n + span)];
  const fancy = absOut || absIn;
  const props = fancy ? null : powerProps(aa, e, m, n);
  return (
    <R><div>
      <p className="lead">Nastav exponent a parametry funkce `y = a·(x − m)ᵉ + n` a sleduj, jak se graf hýbe. Čárkovaně je základní `y = xᵉ`. Vlastnosti se přepočítávají živě — zkus si je nejdřív odhadnout.</p>
      <div className="grid2" style={{ alignItems: "start" }}>
        <div>
          <div className="src">Exponent e</div>
          <div>{[-4, -3, -2, -1, 1, 2, 3, 4, 5].map(v => <button key={v} className={"chip" + (v === e ? " on" : "")} onClick={() => setE(v)}>{"x" + sup(v)}</button>)}</div>
          <div style={{ marginTop: 10 }}>
            <RangeRow label="a (natažení)" value={aa} set={v => setA(v === 0 ? 0.5 : v)} min={-3} max={3} step={0.5} />
            <RangeRow label="m (doprava)" value={m} set={setM} min={-4} max={4} step={0.5} />
            <RangeRow label="n (nahoru)" value={n} set={setN} min={-4} max={4} step={0.5} />
          </div>
          <label className="check"><input type="checkbox" checked={absOut} onChange={() => setAbsOut(v => !v)} /><span>`|f(x)|` — překlopit části pod osou x</span></label>
          <label className="check"><input type="checkbox" checked={absIn} onChange={() => setAbsIn(v => !v)} /><span>`f(|x|)` — zrcadlit pravou polovinu podle osy y</span></label>
          <button className="btn" style={{ marginTop: 10 }} onClick={() => { setA(1); setM(0); setN(0); setAbsIn(false); setAbsOut(false); }}>↺ Vynulovat</button>
          {e === -1 && !fancy && <div className="tip">`e = −1` je <b>lineární lomená funkce</b> `y = [[a||x − m]] + n` — tady `k = a`, střed `S[m; n]`.</div>}
        </div>
        <div>
          <Eq>{powerFormula(aa, e, m, n, absOut, absIn)}</Eq>
          <FnGraph view={view} w={340} asymV={asymV} asymH={asymH} fns={[{ f: pw(e), color: MUTED, dash: true }, { f }]} pts={!neg && !fancy ? [{ x: m, y: n, color: RED }] : neg && !fancy ? [{ x: m, y: n, color: RED, hollow: true }] : []} />
        </div>
      </div>
      <div className="entry" style={{ marginTop: 18 }}>
        <h3>Vlastnosti</h3>
        {props ? (
          <div className="propGrid">{props.map(([k, v]) => <Fragment key={k}><div className="k">{k}</div><div className="v">{v}</div></Fragment>)}</div>
        ) : (
          <p>S absolutní hodnotou vlastnosti odečti z grafu — to je přesně dovednost z úloh 57/3 a 57/4. Kontrola: `|f(x)|` má vždy `H ⊂ ⟨0; ∞)`; `f(|x|)` je vždy sudá.</p>
        )}
      </div>
    </div></R>
  );
}

// ══════════════════════════════════════════════════════════════════
// TRENAŽÉR
// ══════════════════════════════════════════════════════════════════
const relTest = rel => v => rel === "<" ? v < -1e-9 : rel === "≤" ? v <= 1e-9 : rel === ">" ? v > 1e-9 : v >= -1e-9;
// crits: [{x, lab, pole}] seřazené; vrátí {str, atoms}
function solveIneq(f, rel, crits) {
  const test = relTest(rel);
  const K = crits.length;
  const atoms = [];
  for (let i = 0; i <= K; i++) {
    const lo = i === 0 ? crits[0].x - 1 : crits[i - 1].x;
    const hi = i === K ? crits[K - 1].x + 1 : crits[i].x;
    atoms.push({ t: "I", i, ok: test(f((lo + hi) / 2)) });
    if (i < K) atoms.push({ t: "P", c: crits[i], ok: crits[i].pole ? false : test(0) });
  }
  if (atoms.every(a => a.ok)) return { str: "R", atoms };
  const out = [];
  let i = 0;
  while (i < atoms.length) {
    if (!atoms[i].ok) { i++; continue; }
    let j = i;
    while (j + 1 < atoms.length && atoms[j + 1].ok) j++;
    const A = atoms[i], B = atoms[j];
    if (i === j && A.t === "P") out.push(`{${A.c.lab}}`);
    else {
      const s = i === 0 ? "(−∞" : A.t === "I" ? "(" + crits[A.i - 1].lab : "⟨" + A.c.lab;
      const e = j === atoms.length - 1 ? "∞)" : B.t === "I" ? crits[B.i].lab + ")" : B.c.lab + "⟩";
      out.push(s + "; " + e);
    }
    i = j + 1;
  }
  return { str: out.length ? out.join(" ∪ ") : "∅", atoms };
}
function shadeFromAtoms(atoms, crits) {
  const out = [];
  let i = 0;
  while (i < atoms.length) {
    if (!atoms[i].ok) { i++; continue; }
    let j = i;
    while (j + 1 < atoms.length && atoms[j + 1].ok) j++;
    const A = atoms[i], B = atoms[j];
    const a = i === 0 ? -Infinity : A.t === "I" ? crits[A.i - 1].x : A.c.x;
    const b = j === atoms.length - 1 ? Infinity : B.t === "I" ? crits[B.i].x : B.c.x;
    out.push([a, b, A.t === "P", B.t === "P"]);
    i = j + 1;
  }
  return out;
}
const FLIP = { "<": "≥", "≤": ">", ">": "≤", "≥": "<" };
const STRICT = { "<": "≤", "≤": "<", ">": "≥", "≥": ">" };

function genIneq() {
  for (let guard = 0; guard < 200; guard++) {
    const e = pick([2, 3, 4, 5, -1, -2, -3, -4]);
    const t = pick([{ p: 1, q: 1 }, { p: 2, q: 1 }, { p: 3, q: 1 }, { p: 1, q: 2 }]);
    const even = e % 2 === 0;
    const sg = even ? 1 : pick([1, -1]);
    const rp = sg * t.p, rq = t.q;
    let cn, cd;
    if (e > 0) { cn = Math.pow(rp, e); cd = Math.pow(rq, e); }
    else { cn = Math.pow(rq, -e); cd = Math.pow(rp, -e); if (cd < 0) { cn = -cn; cd = -cd; } }
    if (Math.abs(cn) > 250 || cd > 16) continue;
    if (t.p === 1 && t.q === 1 && Math.random() < 0.6) continue;
    const c = cn / cd;
    const rel = pick(["<", "≤", ">", "≥"]);
    const tl = t.q === 1 ? String(t.p) : "1/" + t.q;
    const crits = [];
    if (even) { crits.push({ x: -t.p / t.q, lab: "−" + tl }, { x: t.p / t.q, lab: tl }); }
    else crits.push({ x: rp / rq, lab: (sg < 0 ? "−" : "") + tl });
    if (e < 0) crits.push({ x: 0, lab: "0", pole: true });
    crits.sort((u, v) => u.x - v.x);
    const f = x => Math.pow(x, e) - c;
    const sol = solveIneq(f, rel, crits);
    const r1 = crits.filter(k => !k.pole);
    const rootX = r1[r1.length - 1];
    const cands = [
      solveIneq(f, FLIP[rel], crits).str,
      solveIneq(f, STRICT[rel], crits).str,
      solveIneq(x => x - rootX.x, rel, [rootX]).str,
      solveIneq(x => x - rootX.x, FLIP[rel], [rootX]).str,
      e < 0 ? solveIneq(x => Math.pow(x, -e) - 1 / c, rel, crits.filter(k => !k.pole)).str : solveIneq(x => -(Math.pow(x, e) - c), rel, crits).str,
      "R", "∅",
    ];
    const opts = [];
    for (const s of shuffleArray(cands.slice(0, 5)).concat(["R", "∅"])) if (s !== sol.str && !opts.includes(s) && opts.length < 3) opts.push(s);
    if (opts.length < 3) continue;
    const cS = cd === 1 ? fmt(cn) : (cn < 0 ? "−" : "") + `[[${Math.abs(cn)}||${cd}]]`;
    return { e, c, cS, rel, crits, f, sol, options: shuffleArray([sol.str, ...opts]) };
  }
  return null;
}

function genLLF() {
  const m = randInt(-4, 4), n = randInt(-3, 3);
  const k = pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
  const c = pick([1, 1, 2]);
  const a = c * n, b = c * (k - n * m), d = -c * m;
  const lin = (p, q) => {
    let s = p === 0 ? "" : p === 1 ? "x" : p === -1 ? "−x" : fmt(p) + "x";
    if (q !== 0) s += s ? (q > 0 ? " + " + q : " − " + -q) : fmt(q);
    return s || "0";
  };
  return { m, n, k, a, b, c, d, num: lin(a, b), den: lin(c, d) };
}

function fmtLLF(k, m, n) {
  const sgn = k < 0 ? "−" : "";
  return `y = ${sgn}[[${Math.abs(k)}||${xm(m)}]]${plusN(n)}`;
}
function genGraphQ() {
  const m = randInt(-3, 3), n = randInt(-3, 3), k = pick([-4, -3, -2, -1, 1, 2, 3, 4]);
  const correct = fmtLLF(k, m, n);
  const pool = [fmtLLF(k, -m, n), fmtLLF(k, m, -n), fmtLLF(-k, m, n), fmtLLF(k, n, m), fmtLLF(-k, -m, n), fmtLLF(k, -m, -n)];
  const opts = [];
  for (const s of shuffleArray(pool)) if (s !== correct && !opts.includes(s) && opts.length < 3) opts.push(s);
  return { m, n, k, correct, options: shuffleArray([correct, ...opts]) };
}

function Score({ s }) { return <span className="score">✔ {s.ok} / {s.all}{s.streak > 1 ? ` · série ${s.streak}` : ""}</span>; }
const bump = (s, ok) => ({ ok: s.ok + (ok ? 1 : 0), all: s.all + 1, streak: ok ? s.streak + 1 : 0 });

function DrillIneq() {
  const [t, setT] = useState(() => genIneq());
  const [ans, setAns] = useState(null);
  const [s, setS] = useState({ ok: 0, all: 0, streak: 0 });
  const next = () => { setT(genIneq()); setAns(null); };
  const choose = o => { if (ans) return; setAns(o); setS(p => bump(p, o === t.sol.str)); };
  const { e, cS, rel, crits, sol } = t;
  const ivLab = i => {
    const K = crits.length;
    const lo = i === 0 ? "−∞" : crits[i - 1].lab, hi = i === K ? "∞" : crits[i].lab;
    return `(${lo}; ${hi})`;
  };
  const roots = crits.filter(k => !k.pole);
  const X = Math.max(2.5, 2 * Math.max(...crits.map(k => Math.abs(k.x))));
  const Y = Math.max(3, Math.abs(t.c) * 1.6);
  const gView = [-X, X, -Y, Y];
  const steps = [];
  if (e < 0) steps.push("Definiční obor: `x ≠ 0` (0 je kritický bod, ale do řešení nikdy nepatří).");
  steps.push(`Rovnice \`x${sup(e)} = c\` má ${roots.length === 2 ? "dva kořeny (sudý exponent)" : "jeden kořen (lichý exponent)"}: \`x = ${roots.map(r => r.lab).join(", ")}\`.`);
  steps.push("Kritické body dělí osu na intervaly; v každém dosadíme testovací bod:");
  steps.push({ table: { cols: sol.atoms.filter(a => a.t === "I").map(a => ivLab(a.i)), rows: [{ n: "platí?", s: sol.atoms.filter(a => a.t === "I").map(a => a.ok ? "✓" : "✗") }] } });
  steps.push(rel === "≤" || rel === "≥" ? "Neostrá nerovnost ⇒ kořeny patří do řešení." : "Ostrá nerovnost ⇒ kořeny do řešení nepatří.");
  return (
    <div className="entry">
      <div className="src">Řeš v R · vyber správný interval · <Score s={s} /></div>
      <div style={{ fontSize: 22, margin: "10px 0" }}><T>{`\`x${sup(e)} ${rel} ${cS}\``}</T></div>
      {t.options.map(o => {
        let bc = "#c9d2e3", bg = "#fff";
        if (ans) { if (o === sol.str) { bc = GREEN; bg = "#eaf6ef"; } else if (o === ans) { bc = RED; bg = "#fdeeee"; } }
        return <button key={o} className="opt mono" style={{ borderColor: bc, background: bg }} onClick={() => choose(o)}>{o}</button>;
      })}
      {ans && (
        <div className="grid2" style={{ marginTop: 10 }}>
          <div><Steps steps={steps} /><div className="result">x ∈ {sol.str}</div></div>
          <FnGraph view={gView} w={300} hh={260} asymV={e < 0 ? [0] : []} fns={[{ f: pw(e) }, { f: () => t.c, color: RED }]} shade={shadeFromAtoms(sol.atoms, crits)} />
        </div>
      )}
      {ans && <button className="btn solid" style={{ marginTop: 12 }} onClick={next}>Další nerovnice →</button>}
    </div>
  );
}

function DrillLLF() {
  const [t, setT] = useState(() => genLLF());
  const [mi, setMi] = useState("");
  const [ni, setNi] = useState("");
  const [res, setRes] = useState(null);
  const [s, setS] = useState({ ok: 0, all: 0, streak: 0 });
  const check = () => {
    const okM = Math.abs(parseNum(mi) - t.m) < 1e-9, okN = Math.abs(parseNum(ni) - t.n) < 1e-9;
    setRes({ okM, okN });
    setS(p => bump(p, okM && okN));
  };
  const next = () => { setT(genLLF()); setMi(""); setNi(""); setRes(null); };
  const { a, b, c, d, m, n, k } = t;
  return (
    <div className="entry">
      <div className="src">Urči asymptoty a střed souměrnosti · <Score s={s} /></div>
      <div style={{ fontSize: 22, margin: "10px 0" }}><T>{`\`y = [[${t.num}||${t.den}]]\``}</T></div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center" }}>
        <label>svislá asymptota <T>{"`x =`"}</T> <input className="inp" value={mi} onChange={e => setMi(e.target.value)} disabled={!!res} inputMode="decimal" /></label>
        <label>vodorovná <T>{"`y =`"}</T> <input className="inp" value={ni} onChange={e => setNi(e.target.value)} disabled={!!res} inputMode="decimal" /></label>
        {!res && <button className="btn solid" onClick={check} disabled={mi === "" || ni === ""}>Zkontrolovat</button>}
      </div>
      {res && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 700, color: res.okM && res.okN ? GREEN : RED }}>{res.okM && res.okN ? "Správně!" : `Špatně: ${!res.okM && !res.okN ? "obě asymptoty" : !res.okM ? "svislá asymptota" : "vodorovná asymptota"}`}</div>
          <div className="grid2" style={{ marginTop: 8 }}>
            <div>
              <Steps steps={[
                `Svislá asymptota = kořen jmenovatele: \`${t.den} = 0 ⇒ x = ${fmt(m)}\` (\`m = −[[d||c]]\`).`,
                `Vodorovná asymptota: \`n = [[a||c]] = [[${fmt(a)}||${fmt(c)}]] = ${fmt(n)}\`.`,
                `Středový tvar: \`${fmtLLF(k, m, n)}\` (\`k = [[bc − ad||c²]] = ${fmt(k)}\`).`,
                `Střed \`S[${fmt(m)}; ${fmt(n)}]\`, \`k ${k > 0 ? "> 0 ⇒ klesající" : "< 0 ⇒ rostoucí"}\` na obou intervalech.`,
                m !== 0 ? `Průsečík s osou y: \`y(0) = [[${fmt(b)}||${fmt(d)}]] = ${fracStr(b, d)}\`.` : "Průsečík s osou y neexistuje (`0 ∉ D`).",
              ]} />
              <div className="result">x = {fmt(m)}, y = {fmt(n)}; S[{fmt(m)}; {fmt(n)}]</div>
            </div>
            <FnGraph view={[m - 7, m + 7, n - 7, n + 7]} w={300} asymV={[m]} asymH={[n]} fns={[{ f: x => k / (x - m) + n }]} pts={[{ x: m, y: n, color: RED, label: "S" }]} />
          </div>
          <button className="btn solid" style={{ marginTop: 12 }} onClick={next}>Další funkce →</button>
        </div>
      )}
    </div>
  );
}

function DrillGraph() {
  const [t, setT] = useState(() => genGraphQ());
  const [ans, setAns] = useState(null);
  const [s, setS] = useState({ ok: 0, all: 0, streak: 0 });
  const choose = o => { if (ans) return; setAns(o); setS(p => bump(p, o === t.correct)); };
  const next = () => { setT(genGraphQ()); setAns(null); };
  return (
    <div className="entry">
      <div className="src">Který předpis patří ke grafu? · <Score s={s} /></div>
      <div className="grid2" style={{ marginTop: 8 }}>
        <FnGraph view={[-7, 7, -7, 7]} w={320} asymV={[t.m]} asymH={[t.n]} fns={[{ f: x => t.k / (x - t.m) + t.n }]} pts={[{ x: 1, y: t.k / (1 - t.m) + t.n }].filter(p => t.m !== 1 && Math.abs(p.y) < 7).map(p => ({ ...p, label: `[1; ${fmt2(p.y)}]` }))} />
        <div>
          {t.options.map(o => {
            let bc = "#c9d2e3", bg = "#fff";
            if (ans) { if (o === t.correct) { bc = GREEN; bg = "#eaf6ef"; } else if (o === ans) { bc = RED; bg = "#fdeeee"; } }
            return <button key={o} className="opt" style={{ borderColor: bc, background: bg }} onClick={() => choose(o)}><span className="mono">{fracParts(o, "o")}</span></button>;
          })}
          {ans && <div className="tip"><T>{`Asymptoty \`x = ${fmt(t.m)}\`, \`y = ${fmt(t.n)}\` ⇒ \`m = ${fmt(t.m)}\`, \`n = ${fmt(t.n)}\`. Větve jsou ${t.k > 0 ? "vpravo nahoře a vlevo dole ⇒ `k > 0`" : "vlevo nahoře a vpravo dole ⇒ `k < 0`"}; |k| určíš z vyznačeného bodu (nebo dosaď x = 1).`}</T></div>}
          {ans && <button className="btn solid" onClick={next}>Další graf →</button>}
        </div>
      </div>
    </div>
  );
}

function Trenazer() {
  const [m, setM] = useState(0);
  const modes = ["⚖️ Nerovnice xⁿ ⋚ c", "➗ Asymptoty a střed", "📉 Předpis z grafu"];
  return (
    <div>
      <p className="lead">Neomezené generované příklady. Cíl: série 10 správně za sebou v každém režimu.</p>
      <div style={{ marginBottom: 6 }}>{modes.map((t, i) => <button key={t} className={"chip" + (m === i ? " on" : "")} style={{ fontFamily: "Inter" }} onClick={() => setM(i)}>{t}</button>)}</div>
      {m === 0 && <DrillIneq />}
      {m === 1 && <DrillLLF />}
      {m === 2 && <DrillGraph />}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// KVÍZ
// ══════════════════════════════════════════════════════════════════
const QUIZ = [
  { question: "Graf které funkce prochází body `[1; 1]` a `[−1; 1]` a má `D = R ∖ {0}`?", type: "single", options: ["`y = x⁻²`", "`y = x⁻³`", "`y = x²`", "`y = x³`"], correct: [0], explanation: "Sudý exponent ⇒ `[−1; 1]`; záporný exponent ⇒ `x ≠ 0`. `x²` má `D = R`.", tip: "Sudý exponent = sudá funkce = souměrná podle osy y." },
  { question: "Které funkce jsou liché?", type: "multi", options: ["`y = x³`", "`y = x⁻¹`", "`y = x⁴`", "`y = (x − 1)³`", "`y = x⁻⁵`"], correct: [0, 1, 4], explanation: "Lichý exponent bez posunu ⇒ lichá. `(x − 1)³` je posunutá, střed je `[1; 0]`, ne počátek." },
  { question: "Asymptoty grafu `y = [[2x + 1||x − 3]]` jsou:", type: "single", options: ["`x = 3`, `y = 2`", "`x = −3`, `y = 2`", "`x = 3`, `y = −1/3`", "`x = 2`, `y = 3`"], correct: [0], explanation: "Jmenovatel `= 0` ⇒ `x = 3`; `n = [[a||c]] = [[2||1]] = 2`.", tip: "y-asymptota = podíl koeficientů u x." },
  { question: "Střed souměrnosti grafu `y = [[1 − x||x + 3]]` je:", type: "single", options: ["`S[−3; −1]`", "`S[3; −1]`", "`S[−3; 1]`", "`S[1; −3]`"], correct: [0], explanation: "`1 − x = −(x + 3) + 4` ⇒ `y = −1 + [[4||x + 3]]` ⇒ `m = −3`, `n = −1`." },
  { question: "Čemu se rovná `|x⁻⁴ + 2|`?", type: "single", options: ["`x⁻⁴ + 2` pro všechna `x ≠ 0`", "`x⁻⁴ − 2` pro `x < 0`", "`|x|⁻⁴ − 2`", "nelze zjednodušit"], correct: [0], explanation: "`x⁻⁴ > 0`, takže `x⁻⁴ + 2 > 0` a absolutní hodnota nic nemění (Petáková 57/4: `h₅ = h₆`)." },
  { question: "Obor hodnot funkce `y = −x⁻⁴ + 2` je:", type: "single", options: ["`(−∞; 2)`", "`(−∞; 2⟩`", "`(2; ∞)`", "`R ∖ {2}`"], correct: [0], explanation: "`−x⁻⁴ < 0` vždy (ne ≤, protože `x⁻⁴ ≠ 0`) ⇒ `y < 2`." },
  { question: "Řešení nerovnice `x⁶ > x⁵` je:", type: "single", options: ["`(−∞; 0) ∪ (1; ∞)`", "`(1; ∞)`", "`(0; 1)`", "`R ∖ {0; 1}`"], correct: [0], explanation: "`x⁵(x − 1) > 0`: obě záporné pro `x < 0`, obě kladné pro `x > 1`.", tip: "Nezapomeň na záporná x — tam je lichá mocnina záporná." },
  { question: "Řešení nerovnice `x⁻² > x⁵` je:", type: "single", options: ["`(−∞; 0) ∪ (0; 1)`", "`(−∞; 1)`", "`(0; 1)`", "`(1; ∞)`"], correct: [0], explanation: "· `x² > 0`: `1 > x⁷ ⇒ x < 1`; nula není v D." },
  { question: "Proč nesmíme nerovnici `[[1||x]] < 2` jen tak vynásobit `x`?", type: "single", options: ["Neznáme znaménko `x`; pro `x < 0` by se otočil znak nerovnosti", "Protože by vznikla kvadratická nerovnice", "Smíme, je to v pořádku", "Protože `x` může být 2"], correct: [0], explanation: "Násobit lze jen výrazem se známým znaménkem (např. `x² > 0`). Jinak rozdělit na případy nebo převést na `výraz ⋚ 0`." },
  { question: "Graf `y = (x + 2)⁴ − 1` vznikne z grafu `y = x⁴`:", type: "single", options: ["posunem o 2 doleva a o 1 dolů", "posunem o 2 doprava a o 1 dolů", "posunem o 2 doleva a o 1 nahoru", "posunem o 1 doleva a o 2 dolů"], correct: [0], explanation: "`x + 2 = x − (−2)` ⇒ `m = −2` (doleva); `−1` ⇒ dolů.", tip: "Uvnitř závorky to platí „naopak“." },
  { question: "Které vlastnosti má `y = [[1||x]]`?", type: "multi", options: ["lichá", "klesající na `(−∞; 0)`", "klesající na celém `D`", "prostá", "omezená"], correct: [0, 1, 3], explanation: "Klesá na každém z intervalů zvlášť, ale ne na celém D (`f(−1) < f(1)`). Prostá ano, omezená ne." },
  { question: "Funkce `y = [[2x + 4||x + 2]]` je:", type: "single", options: ["konstantní funkce 2 s `D = R ∖ {−2}`", "lineární lomená s asymptotou `x = −2`", "lineární funkce `y = 2x`", "nedefinovaná"], correct: [0], explanation: "`ad − bc = 2·2 − 4·1 = 0` ⇒ zlomek se zkrátí: `[[2(x + 2)||x + 2]] = 2`." },
  { question: "Množina řešení `x⁴ ≤ 16` je:", type: "single", options: ["`⟨−2; 2⟩`", "`(−∞; 2⟩`", "`⟨2; ∞)`", "`(−∞; −2⟩ ∪ ⟨2; ∞)`"], correct: [0], explanation: "Sudá mocnina: `x⁴ ≤ 16 ⇔ |x| ≤ 2`." },
  { question: "Je funkce `y = (x − 1)²` sudá?", type: "single", options: ["Ne, graf je souměrný podle přímky `x = 1`, ne podle osy y", "Ano, protože exponent je sudý", "Ano, protože `H = ⟨0; ∞)`", "Je lichá"], correct: [0], explanation: "`f(−1) = 4 ≠ f(1) = 0`. Sudý exponent nestačí, posun parity ruší." },
  { question: "Graf `y = f(|x|)` dostaneme tak, že:", type: "single", options: ["pravou část (x ≥ 0) necháme a zrcadlíme ji podle osy y", "části pod osou x překlopíme nahoru", "celý graf překlopíme podle osy y", "levou část necháme a zrcadlíme ji doprava"], correct: [0], explanation: "`f(|x|)` záleží jen na `|x|` ⇒ hodnoty vlevo jsou kopie hodnot vpravo; výsledek je sudá funkce." },
  { question: "Obor hodnot `y = |x⁻³| − 1` je:", type: "single", options: ["`(−1; ∞)`", "`⟨−1; ∞)`", "`R ∖ {−1}`", "`(0; ∞)`"], correct: [0], explanation: "`|x⁻³| > 0` (nikdy 0) ⇒ `y > −1`." },
  { question: "Které nerovnice mají řešení `(−∞; 0)`?", type: "multi", options: ["`x⁻³ ≤ −x⁷`", "`x⁻¹ < 0`", "`x³ > 0`", "`x⁻² < 0`"], correct: [0, 1], explanation: "`x⁻³ ≤ −x⁷` platí právě pro záporná x (Petáková 57/8e). `x⁻¹ < 0 ⇔ x < 0`. `x³ > 0 ⇔ x > 0`; `x⁻² < 0` nemá řešení." },
  { question: "Lineární lomená funkce `y = [[k||x − m]] + n` s `k < 0` je:", type: "single", options: ["rostoucí na `(−∞; m)` i na `(m; ∞)`", "klesající na `(−∞; m)` i na `(m; ∞)`", "rostoucí na celém D", "sudá"], correct: [0], explanation: "Záporné k = větve ve II. a IV. kvadrantu vůči asymptotám ⇒ na každém intervalu roste." },
  { question: "Průsečíky grafu `y = [[x||x − 2]]` s osami jsou:", type: "single", options: ["jen `[0; 0]`", "`[2; 0]` a `[0; 1]`", "`[0; 0]` a `[2; 1]`", "žádné"], correct: [0], explanation: "Čitatel `x = 0` ⇒ `[0; 0]`, a `y(0) = 0` ⇒ tentýž bod." },
  { question: "Která funkce má maximum?", type: "single", options: ["`y = −(x − 1)⁴ + 2`", "`y = (x − 1)⁻² − 3`", "`y = x⁵ − 2`", "`y = −x⁻⁴ + 2`"], correct: [0], explanation: "`−(x − 1)⁴ ≤ 0` ⇒ `y ≤ 2`, rovnost v `x = 1`. `−x⁻⁴ + 2 < 2`, hodnoty 2 nedosáhne ⇒ maximum nemá." },
];

// ══════════════════════════════════════════════════════════════════
// KARTIČKY
// ══════════════════════════════════════════════════════════════════
const CARDS = [
  { f: "Sudá funkce", b: "D souměrný podle 0 a `f(−x) = f(x)`. Graf souměrný podle osy y. Např. `x², x⁻⁴, |x⁻³|`." },
  { f: "Lichá funkce", b: "D souměrný podle 0 a `f(−x) = −f(x)`. Graf souměrný podle počátku. Např. `x³, x⁻¹, [[2||x]]`." },
  { f: "Prostá funkce", b: "Různým x odpovídají různá y. Test: vodorovná přímka protne graf nejvýš jednou. Ryze monotónní ⇒ prostá." },
  { f: "Omezená zdola", b: "Existuje `d` takové, že `f(x) ≥ d` pro všechna `x ∈ D`. Neznamená, že má minimum!" },
  { f: "`y = xⁿ`, n sudé kladné", b: "`D = R`, `H = ⟨0; ∞)`, sudá, min. 0 v `x = 0`, klesá na `(−∞; 0⟩`, roste na `⟨0; ∞)`." },
  { f: "`y = xⁿ`, n liché kladné", b: "`D = H = R`, lichá, rostoucí, prostá, neomezená." },
  { f: "`y = xⁿ`, n sudé záporné", b: "`D = R ∖ {0}`, `H = (0; ∞)`, sudá, roste na `(−∞; 0)`, klesá na `(0; ∞)`, asymptoty os." },
  { f: "`y = xⁿ`, n liché záporné", b: "`D = H = R ∖ {0}`, lichá, klesá na `(−∞; 0)` i na `(0; ∞)` (ne na celém D!), prostá." },
  { f: "`y = f(x − m) + n`", b: "Posun o m doprava (m < 0 doleva) a o n nahoru. Střed/vrchol z `[0; 0]` do `[m; n]`." },
  { f: "`y = |f(x)|`", b: "Části grafu pod osou x překlopit nahoru. Výsledek má `H ⊂ ⟨0; ∞)`." },
  { f: "`y = f(|x|)`", b: "Pravou polovinu (`x ≥ 0`) ponechat a zrcadlit podle osy y. Výsledek je vždy sudý." },
  { f: "Lineární lomená funkce — podmínky", b: "`y = [[ax + b||cx + d]]`, `c ≠ 0` a `ad − bc ≠ 0`." },
  { f: "Středový tvar lineární lomené funkce", b: "`y = [[k||x − m]] + n`; asymptoty `x = m`, `y = n`, střed `S[m; n]`." },
  { f: "Rychlé m, n, k z `[[ax + b||cx + d]]`", b: "`m = −[[d||c]]`, `n = [[a||c]]`, `k = [[bc − ad||c²]]`." },
  { f: "Znaménko k u lineární lomené", b: "`k > 0`: větve I. + III., klesá na obou intervalech. `k < 0`: II. + IV., roste." },
  { f: "Grafické řešení nerovnice", b: "Nakresli obě strany, najdi průsečíky a body mimo D, vyber x, kde je levá strana nad/pod pravou." },
  { f: "Metoda nulových bodů", b: "Vše na jednu stranu → rozložit → nulové body čitatele i jmenovatele → tabulka znamének. Jmenovatel nikdy nepatří." },
  { f: "Čím smím násobit nerovnici?", b: "Jen výrazem se známým znaménkem: `x², x⁴, x⁶ > 0` (pro `x ≠ 0`). Nikdy `x` ani `x − 2` bez rozboru." },
  { f: "`|x⁻⁴|` vs. `|x⁻³|`", b: "`|x⁻⁴| = x⁻⁴` (nic se nemění). `|x⁻³|` překlopí levou větev nahoru ⇒ sudá funkce." },
];

function Karticky() {
  const [i, setI] = useState(0);
  const [flip, setFlip] = useState(false);
  const go = j => { setFlip(false); setI((j + CARDS.length) % CARDS.length); };
  const c = CARDS[i];
  return (
    <div>
      <p className="lead">Klepni na kartičku → otočí se. Zkus si odpověď nejdřív říct nahlas.</p>
      <div className="card3d">
        <div className="cardIn" style={{ transform: flip ? "rotateY(180deg)" : "none" }} onClick={() => setFlip(f => !f)}>
          <div className="cardFace">
            <div className="src" style={{ marginBottom: 10 }}>Kartička {i + 1} / {CARDS.length}</div>
            <div style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 21, fontWeight: 700, lineHeight: 1.4 }}><T>{c.f}</T></div>
            <div style={{ marginTop: 16, fontSize: 13, color: MUTED }}>klepni pro odpověď ↻</div>
          </div>
          <div className="cardFace cardBack">
            <div style={{ fontSize: 18, lineHeight: 1.6 }}><T>{c.b}</T></div>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 16 }}>
        <button className="btn" onClick={() => go(i - 1)}>← Předchozí</button>
        <button className="btn solid" onClick={() => go(i + 1)}>Další →</button>
      </div>
      <div className="dots">
        {CARDS.map((_, j) => <button key={j} className="dot" aria-label={`Kartička ${j + 1}`} onClick={() => go(j)} style={{ background: j === i ? RED : "#c3cbe0" }} />)}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// VZORCE
// ══════════════════════════════════════════════════════════════════
const FS = [
  { h: "Vlastnosti funkcí", rows: [["sudá", "D souměrný, f(−x) = f(x) — osa y"], ["lichá", "D souměrný, f(−x) = −f(x) — počátek"], ["rostoucí na M", "x₁ < x₂ ⇒ f(x₁) < f(x₂)"], ["klesající na M", "x₁ < x₂ ⇒ f(x₁) > f(x₂)"], ["prostá", "x₁ ≠ x₂ ⇒ f(x₁) ≠ f(x₂)"], ["omezená zdola/shora", "f(x) ≥ d / f(x) ≤ h pro všechna x ∈ D"], ["maximum v x₀", "f(x) ≤ f(x₀) pro všechna x ∈ D"]] },
  { h: "Mocninné funkce y = xⁿ", rows: [["n sudé > 0", "D = R, H = ⟨0; ∞), sudá, min v 0"], ["n liché > 0", "D = H = R, lichá, rostoucí"], ["n sudé < 0", "D = R∖{0}, H = (0; ∞), sudá, asympt. x = 0, y = 0"], ["n liché < 0", "D = H = R∖{0}, lichá, klesá na (−∞;0) i (0;∞)"], ["společné body", "[1; 1] vždy; [−1; 1] sudé, [−1; −1] liché; [0; 0] jen n > 0"], ["x⁻ⁿ", "x⁻ⁿ = [[1||xⁿ]]"]] },
  { h: "Transformace", rows: [["f(x) + n", "posun o n nahoru"], ["f(x − m)", "posun o m doprava  (x + 2 ⇒ doleva o 2)"], ["a · f(x)", "natažení / stlačení ve směru y"], ["−f(x)", "překlopení podle osy x"], ["f(−x)", "překlopení podle osy y"], ["|f(x)|", "části pod osou x nahoru"], ["f(|x|)", "pravá půlka + zrcadlo podle y"]] },
  { h: "Lineární lomená funkce", rows: [["obecný tvar", "y = [[ax + b||cx + d]],  c ≠ 0, ad − bc ≠ 0"], ["středový tvar", "y = [[k||x − m]] + n"], ["rychle", "m = −d/c,  n = a/c,  k = (bc − ad)/c²"], ["D, H", "D = R∖{m},  H = R∖{n}"], ["asymptoty, střed", "x = m,  y = n,  S[m; n]"], ["k > 0 / k < 0", "klesá / roste na (−∞; m) i (m; ∞)"], ["průsečíky", "Pₓ: ax + b = 0;  Pᵧ: [0; b/d]"]] },
  { h: "Nerovnice", rows: [["n liché", "xⁿ < c ⇔ x < ⁿ√c"], ["n sudé, c > 0", "xⁿ ≤ c ⇔ |x| ≤ ⁿ√c;   xⁿ ≥ c ⇔ |x| ≥ ⁿ√c"], ["záporný exponent", "x ≠ 0; násob xᵏ s k sudým (> 0) nebo rozděl x < 0 / x > 0"], ["podíl", "L − P ⋚ 0 → společný jmenovatel → tabulka znamének"], ["krajní body", "≤, ≥ ⇒ kořeny čitatele patří; jmenovatel nikdy"], ["kalkulačka", "ⁿ√c = c^(1/n), 2 desetinná místa"]] },
  { h: "Zápis intervalů", rows: [["uzavřený", "⟨a; b⟩  … a ≤ x ≤ b"], ["otevřený", "(a; b)  … a < x < b"], ["nekonečno", "vždy otevřeně: (−∞; a⟩, (b; ∞)"], ["bez bodu", "R ∖ {0} = (−∞; 0) ∪ (0; ∞)"]] },
];

function Vzorce() {
  return (
    <div className="fs">
      <p className="lead">Všechno, co musíš umět zpaměti, na jednom místě. Projdi si to v pondělí ráno.</p>
      {FS.map(g => (
        <div key={g.h} className="entry">
          <h3>{g.h}</h3>
          {g.rows.map(([k, v]) => <div key={k} className="fsRow"><div className="k">{k}</div><div className="v">{fracParts(v, k)}</div></div>)}
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// APP
// ══════════════════════════════════════════════════════════════════
const SECTIONS = [
  { id: "prehled", i: "🗺️", t: "Přehled", k: "Písemka po 23. 11. 2026", h: "Mocninné a lineární lomené funkce" },
  { id: "teorie", i: "📖", t: "Teorie", k: "Teorie", h: "Vlastnosti, mocniny, transformace, lomené funkce, nerovnice" },
  { id: "ulohy", i: "📘", t: "Petáková", k: "Zadané úlohy s řešením", h: "Petáková 57/1, 2, 3, 4, 8 a 58/9" },
  { id: "dalsi", i: "✏️", t: "Další příklady", k: "Procvičení navíc", h: "Početní nerovnice a vlastnosti funkcí" },
  { id: "lab", i: "🧪", t: "Laboratoř", k: "Interaktivní graf", h: "Laboratoř transformací" },
  { id: "trenazer", i: "🎯", t: "Trenažér", k: "Neomezené procvičování", h: "Trenažér" },
  { id: "kviz", i: "❓", t: "Kvíz", k: "Ověř si to", h: "Kvíz" },
  { id: "karticky", i: "🃏", t: "Kartičky", k: "Pojmy a pravidla", h: "Kartičky" },
  { id: "vzorce", i: "📐", t: "Vzorce", k: "Tahák", h: "Vzorce a pravidla" },
];

export default function App() {
  const [tab, setTab] = useState("prehled");
  const sec = SECTIONS.find(s => s.id === tab);
  const go = id => { setTab(id); try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch (e) { /* ignore */ } };
  return (
    <div className="mf">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet" />
      <style>{CSS}</style>
      <div className="top">
        <div className="topIn">
          <div className="brandRow">
            <span className="brand">{fracParts("xⁿ · [[ax + b||cx + d]]", "br")}</span>
            <span className="brandSub">mocninné funkce · lineární lomené funkce · nerovnice · vlastnosti</span>
          </div>
          <nav className="tabs">
            {SECTIONS.map(s => (
              <button key={s.id} className={"tab" + (tab === s.id ? " on" : "")} onClick={() => go(s.id)}>{s.i} {s.t}</button>
            ))}
          </nav>
        </div>
      </div>
      <main className="main">
        <header className="pageHead">
          <div className="kicker">{sec.k}</div>
          <h1><span>{sec.h}</span></h1>
        </header>
        {tab === "prehled" && <Prehled go={go} />}
        {tab === "teorie" && <Teorie />}
        {tab === "ulohy" && <Ulohy />}
        {tab === "dalsi" && <Dalsi />}
        {tab === "lab" && <Lab />}
        {tab === "trenazer" && <Trenazer />}
        {tab === "kviz" && <QuizEngine questions={QUIZ} accentColor={PEN} />}
        {tab === "karticky" && <Karticky />}
        {tab === "vzorce" && <Vzorce />}
      </main>
    </div>
  );
}
