// @title Kuželosečky — poměr vzdáleností, rovnice, graf a přímka
// @subject Math
// @topic Analytická geometrie: kuželosečky
// @template mixed

import { useState, useCallback, useMemo } from 'react';

// ══════════════════════════════════════════════════════════════════
// BARVY + CSS (téma „Čtverečkovaný sešit“)
// ══════════════════════════════════════════════════════════════════
const PEN = "#1d3fa8";
const RED = "#d12b2b";
const INK = "#1b2333";
const MUTED = "#5b6578";
const GREEN = "#1f8a4c";

const CSS = `
.kz{min-height:100vh;color:${INK};font-family:'Inter',system-ui,sans-serif;font-size:16px;line-height:1.65;
  background-color:#fbfbfd;
  background-image:linear-gradient(#dfe6f0 1px,transparent 1px),linear-gradient(90deg,#dfe6f0 1px,transparent 1px);
  background-size:24px 24px;}
.kz *{box-sizing:border-box}
.kz p{margin:10px 0}
.kz ul{list-style:disc;padding-left:22px;margin:10px 0}
.kz ol{list-style:decimal;padding-left:24px;margin:10px 0}
.kz li{margin:4px 0}
.kz button{font-family:inherit}
.kz h1,.kz h2,.kz h3,.kz h4{font-family:'Libre Baskerville',Georgia,serif;color:${INK};margin:0}
.kz .mono{font-family:'JetBrains Mono',ui-monospace,monospace;font-size:.93em}
.kz .layout{display:grid;grid-template-columns:232px minmax(0,1fr);min-height:100vh}
.kz .side{position:sticky;top:0;align-self:start;height:100vh;overflow-y:auto;background:rgba(243,245,250,.94);border-right:1px solid #cfd8e6;padding:22px 14px}
.kz .brand{font-family:'Libre Baskerville',serif;font-size:17px;font-weight:700;line-height:1.3;color:${PEN};margin:0 6px 4px}
.kz .brandSub{font-size:12.5px;color:${MUTED};margin:0 6px 18px}
.kz .navBtn{display:flex;align-items:center;gap:10px;width:100%;min-height:44px;padding:8px 12px;margin:2px 0;border:none;background:transparent;color:${INK};font-size:15px;text-align:left;cursor:pointer;border-left:3px solid transparent;transition:all .4s ease}
.kz .navBtn:hover{background:#e6ebf5}
.kz .navBtn.on{border-left-color:${RED};background:#fff;color:${PEN};font-weight:600}
.kz .main{position:relative;padding:28px 36px 80px 84px;min-width:0}
.kz .main::before{content:"";position:absolute;top:0;bottom:0;left:58px;width:2px;background:#e9a3a3}
.kz .wrap{max-width:900px}
.kz .pageHead{margin-bottom:26px}
.kz .pageHead .kicker{font-size:12.5px;letter-spacing:.12em;text-transform:uppercase;color:${RED};font-weight:600}
.kz .pageHead h1{font-size:30px;line-height:1.25;margin-top:4px}
.kz .pageHead h1 span{border-bottom:3px double ${PEN};padding-bottom:2px}
.kz .lead{color:${MUTED};max-width:70ch}
.kz .entry{border-left:2px solid ${PEN};padding:4px 0 4px 18px;margin:22px 0;background:rgba(251,251,253,.86)}
.kz .entry.red{border-left-color:${RED}}
.kz .entry h3{font-size:19px;margin-bottom:6px}
.kz .chip{display:inline-flex;align-items:center;gap:6px;min-height:36px;padding:5px 12px;border:1px solid #b9c4d8;background:#fff;color:${INK};font-size:14px;cursor:pointer;transition:all .4s ease;margin:3px 6px 3px 0}
.kz .chip.on{border-color:${PEN};background:${PEN};color:#fff}
.kz .btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:44px;padding:8px 18px;border:1.5px solid ${PEN};background:#fff;color:${PEN};font-size:15px;font-weight:600;cursor:pointer;transition:all .4s ease}
.kz .btn:hover{background:#eef2fb}
.kz .btn.solid{background:${PEN};color:#fff}
.kz .btn.solid:hover{background:#16328a}
.kz .btn:disabled{opacity:.4;cursor:default}
.kz .coll{margin:14px 0;border-left:2px solid ${PEN};background:rgba(255,255,255,.88)}
.kz .collHead{display:flex;align-items:center;gap:12px;width:100%;min-height:52px;padding:10px 16px;border:none;background:transparent;cursor:pointer;text-align:left;font-family:'Libre Baskerville',serif;font-size:17px;font-weight:700;color:${INK}}
.kz .collHead .arr{margin-left:auto;color:${PEN};transition:transform .4s ease}
.kz .collBody{padding:2px 18px 16px 18px;animation:kzFade .4s ease}
@keyframes kzFade{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}
@keyframes kzStep{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:none}}
.kz .eq{font-family:'JetBrains Mono',monospace;background:#fff;border:1px dashed #b9c4d8;padding:10px 14px;margin:10px 0;overflow-x:auto;white-space:nowrap}
.kz .eqBig{font-size:17px}
.kz .note{border-left:3px solid ${RED};background:#fff6f5;padding:10px 14px;margin:12px 0;font-size:15px}
.kz .tip{border-left:3px solid ${PEN};background:#f1f4fc;padding:10px 14px;margin:12px 0;font-size:15px}
.kz .tbl{width:100%;border-collapse:collapse;background:#fff;font-size:15px;margin:10px 0}
.kz .tbl th,.kz .tbl td{border:1px solid #c9d2e3;padding:7px 10px;text-align:left;vertical-align:top}
.kz .tbl th{background:#eef2fb;color:${PEN};font-weight:600}
.kz .tblWrap{overflow-x:auto;margin:10px 0}
.kz .frac{display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;margin:0 2px;line-height:1.15;font-size:.92em}
.kz .frac .num{border-bottom:1.3px solid currentColor;padding:0 3px}
.kz .frac .den{padding:0 3px}
.kz .badge{display:inline-block;font-size:12.5px;font-weight:600;padding:2px 9px;border:1px solid;margin-left:8px;white-space:nowrap}
.kz .src{font-size:12.5px;color:${MUTED};letter-spacing:.04em;text-transform:uppercase}
.kz .part{margin:14px 0 6px;padding-top:10px;border-top:1px dotted #c3cbe0}
.kz .part:first-of-type{border-top:none}
.kz .partQ{display:flex;flex-wrap:wrap;align-items:center;gap:10px}
.kz .partL{font-family:'Libre Baskerville',serif;font-weight:700;color:${PEN};min-width:24px}
.kz .sol{margin-top:10px;background:#fff;padding:12px 14px 14px 0;border:1px solid #dfe6f0}
.kz .solLbl{font-size:12.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${PEN};padding-left:14px;margin:6px 0 2px}
.kz .solTxt{padding-left:14px}
.kz .step{display:grid;grid-template-columns:40px minmax(0,1fr);opacity:0;animation:kzStep .4s ease forwards}
.kz .stepN{text-align:right;padding-right:10px;color:${RED};font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:700;border-right:2px solid #e9a3a3;padding-top:3px}
.kz .stepT{padding:2px 0 6px 12px;overflow-x:auto}
.kz .result{display:inline-block;margin:10px 0 2px 14px;padding:7px 14px;border:3px double ${RED};outline:1px solid rgba(209,43,43,.35);outline-offset:3px;color:${RED};font-weight:600;font-family:'JetBrains Mono',monospace;font-size:15px;transform:rotate(-.4deg)}
.kz .result.static{margin-left:0}
.kz .grid2{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:18px}
.kz .graphBox{background:#fff;border:1px solid #cfd8e6;padding:6px;max-width:100%}
.kz .graphCap{font-size:13px;color:${MUTED};text-align:center;margin-top:2px}
.kz .inp{min-height:44px;width:76px;padding:6px 8px;border:1.5px solid #b9c4d8;background:#fff;font-family:'JetBrains Mono',monospace;font-size:16px;color:${INK};text-align:center}
.kz .inp:focus{outline:none;border-color:${PEN}}
.kz .opt{display:flex;align-items:center;gap:10px;width:100%;min-height:46px;padding:10px 14px;margin:6px 0;background:#fff;border:1.5px solid #c9d2e3;color:${INK};font-size:15.5px;text-align:left;cursor:pointer;transition:all .4s ease}
.kz .opt:hover{border-color:${PEN}}
.kz .card3d{perspective:1200px;max-width:560px;margin:0 auto}
.kz .cardIn{position:relative;height:280px;transition:transform .4s ease;transform-style:preserve-3d;cursor:pointer}
.kz .cardFace{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:24px;background:#fff;border:1px solid #c9d2e3;border-left:4px solid ${PEN}}
.kz .cardBack{transform:rotateY(180deg);border-left-color:${RED}}
.kz .dots{display:flex;flex-wrap:wrap;gap:7px;justify-content:center;margin:14px 0}
.kz .dot{width:14px;height:14px;border-radius:50%;border:none;cursor:pointer;padding:0;transition:background .4s ease}
.kz .fs h3{font-size:18px;margin:22px 0 8px;color:${PEN}}
.kz .fsRow{display:grid;grid-template-columns:minmax(150px,220px) minmax(0,1fr);gap:4px 16px;padding:7px 0;border-bottom:1px dotted #c3cbe0}
.kz .fsRow .k{color:${MUTED};font-size:14.5px}
.kz .fsRow .v{font-family:'JetBrains Mono',monospace;font-size:15px;overflow-x:auto}
.kz .score{font-family:'JetBrains Mono',monospace;color:${PEN};font-weight:700}
@media (max-width:820px){
  .kz .layout{grid-template-columns:minmax(0,1fr)}
  .kz .side{position:sticky;top:0;z-index:20;height:auto;display:flex;align-items:center;gap:4px;overflow-x:auto;padding:6px 8px;border-right:none;border-bottom:1px solid #cfd8e6}
  .kz .brand,.kz .brandSub{display:none}
  .kz .navBtn{width:auto;flex:0 0 auto;white-space:nowrap;border-left:none;border-bottom:3px solid transparent;padding:8px 12px}
  .kz .navBtn.on{border-bottom-color:${RED}}
  .kz .main{padding:20px 16px 70px 34px}
  .kz .main::before{left:20px}
  .kz .pageHead h1{font-size:24px}
}
@media (max-width:640px){
  .kz .grid2{grid-template-columns:minmax(0,1fr)}
  .kz .fsRow{grid-template-columns:minmax(0,1fr)}
  .kz .step{grid-template-columns:30px minmax(0,1fr)}
  .kz .entry{padding-left:12px}
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
const M = ({ children }) => <span className="mono">{fracParts(children, "m")}</span>;
const Eq = ({ children, big }) => <div className={"eq" + (big ? " eqBig" : "")}>{fracParts(children, "e")}</div>;

// ══════════════════════════════════════════════════════════════════
// GRAF: implicitní křivka (marching squares) + přímky + body
// ══════════════════════════════════════════════════════════════════
function Graph({ curves = [], lines = [], pts = [], view = [-6, 6, -6, 6], w = 340, fill, caption }) {
  const [x0, x1, y0, y1] = view;
  const h = Math.round(w * (y1 - y0) / (x1 - x0));
  const sx = x => (x - x0) / (x1 - x0) * w;
  const sy = y => h - (y - y0) / (y1 - y0) * h;

  const paths = useMemo(() => curves.map(cv => {
    const N = 170;
    const dx = (x1 - x0) / N, dy = (y1 - y0) / N;
    const v = [];
    for (let i = 0; i <= N; i++) { v[i] = []; for (let j = 0; j <= N; j++) { let val = cv.f(x0 + i * dx, y0 + j * dy); if (val === 0) val = 1e-12; v[i][j] = val; } }
    let d = "";
    const P = (x, y) => sx(x).toFixed(1) + " " + sy(y).toFixed(1);
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
      const a = v[i][j], b = v[i + 1][j], c = v[i + 1][j + 1], e = v[i][j + 1];
      const X = x0 + i * dx, Y = y0 + j * dy;
      const cr = [];
      if (a * b < 0) cr.push([X + dx * a / (a - b), Y]);
      if (b * c < 0) cr.push([X + dx, Y + dy * b / (b - c)]);
      if (c * e < 0) cr.push([X + dx * e / (e - c), Y + dy]);
      if (e * a < 0) cr.push([X, Y + dy * a / (a - e)]);
      if (cr.length >= 2) d += "M" + P(...cr[0]) + "L" + P(...cr[1]);
      if (cr.length === 4) d += "M" + P(...cr[2]) + "L" + P(...cr[3]);
    }
    return d;
  }), [curves, x0, x1, y0, y1, w, h]);

  const fillRects = useMemo(() => {
    if (!fill) return null;
    const N = 70, dx = (x1 - x0) / N, dy = (y1 - y0) / N, out = [];
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
      if (fill(x0 + (i + .5) * dx, y0 + (j + .5) * dy)) out.push(<rect key={i + "_" + j} x={sx(x0 + i * dx)} y={sy(y0 + (j + 1) * dy)} width={w / N + .4} height={h / N + .4} fill="#1d3fa8" opacity=".13" />);
    }
    return out;
  }, [fill, x0, x1, y0, y1, w, h]);

  const span = x1 - x0;
  const step = span > 30 ? 5 : span > 16 ? 2 : 1;
  const grid = [];
  for (let gx = Math.ceil(x0 / step) * step; gx <= x1; gx += step) grid.push(<line key={"gx" + gx} x1={sx(gx)} x2={sx(gx)} y1={0} y2={h} stroke={gx === 0 ? "#6b7690" : "#e3e8f1"} strokeWidth={gx === 0 ? 1.3 : 1} />);
  for (let gy = Math.ceil(y0 / step) * step; gy <= y1; gy += step) grid.push(<line key={"gy" + gy} y1={sy(gy)} y2={sy(gy)} x1={0} x2={w} stroke={gy === 0 ? "#6b7690" : "#e3e8f1"} strokeWidth={gy === 0 ? 1.3 : 1} />);
  const lbl = [];
  const lstep = step * (span > 16 ? 1 : 2);
  for (let gx = Math.ceil(x0 / lstep) * lstep; gx <= x1; gx += lstep) if (gx !== 0 && y0 < 0 && y1 > 0) lbl.push(<text key={"lx" + gx} x={sx(gx)} y={sy(0) + 13} fontSize="10" textAnchor="middle" fill="#6b7690" fontFamily="JetBrains Mono">{gx}</text>);
  for (let gy = Math.ceil(y0 / lstep) * lstep; gy <= y1; gy += lstep) if (gy !== 0 && x0 < 0 && x1 > 0) lbl.push(<text key={"ly" + gy} x={sx(0) - 4} y={sy(gy) + 3.5} fontSize="10" textAnchor="end" fill="#6b7690" fontFamily="JetBrains Mono">{gy}</text>);

  const clipLine = ({ a, b, c }) => {
    const res = [];
    if (Math.abs(b) > 1e-12) { for (const X of [x0, x1]) { const Y = -(a * X + c) / b; if (Y >= y0 - 1e-9 && Y <= y1 + 1e-9) res.push([X, Y]); } }
    if (Math.abs(a) > 1e-12) { for (const Y of [y0, y1]) { const X = -(b * Y + c) / a; if (X >= x0 - 1e-9 && X <= x1 + 1e-9) res.push([X, Y]); } }
    return res.length >= 2 ? res : null;
  };

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="graphBox" style={{ width: "100%", maxWidth: w + 14, height: "auto", display: "block" }}>
        {fillRects}
        {grid}
        {lbl}
        <text x={w - 6} y={sy(0) - 5} fontSize="11" textAnchor="end" fill="#6b7690" fontStyle="italic">x</text>
        <text x={sx(0) + 6} y={12} fontSize="11" fill="#6b7690" fontStyle="italic">y</text>
        {curves.map((cv, i) => <path key={"c" + i} d={paths[i]} stroke={cv.color || PEN} strokeWidth={cv.dash ? 1.4 : 2.4} strokeDasharray={cv.dash ? "5 4" : undefined} fill="none" strokeLinecap="round" />)}
        {lines.map((ln, i) => { const s = clipLine(ln); if (!s) return null; return <line key={"l" + i} x1={sx(s[0][0])} y1={sy(s[0][1])} x2={sx(s[1][0])} y2={sy(s[1][1])} stroke={ln.color || RED} strokeWidth={ln.dash ? 1.3 : 2} strokeDasharray={ln.dash ? "6 5" : undefined} />; })}
        {pts.map((p, i) => (
          <g key={"p" + i}>
            <circle cx={sx(p.x)} cy={sy(p.y)} r={p.r || 4} fill={p.hollow ? "#fff" : (p.color || INK)} stroke={p.color || INK} strokeWidth="1.6" />
            {p.label && <text x={sx(p.x) + 6} y={sy(p.y) - 6} fontSize="12" fontWeight="700" fill={p.color || INK} fontFamily="Inter">{p.label}</text>}
          </g>
        ))}
      </svg>
      {caption && <div className="graphCap">{caption}</div>}
    </div>
  );
}

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
      {open && <div className="collBody">{children}</div>}
    </div>
  );
}

const DIFF = {
  1: { t: "Lehká ✨", c: "#1f8a4c" },
  2: { t: "Střední ⚡", c: "#b7791f" },
  3: { t: "Těžká 🔥", c: RED },
};
const Badge = ({ d }) => <span className="badge" style={{ color: DIFF[d].c, borderColor: DIFF[d].c }}>{DIFF[d].t}</span>;

function Steps({ steps }) {
  return (
    <div>
      {steps.map((s, i) => (
        <div key={i} className="step" style={{ animationDelay: (i * 0.12) + "s" }}>
          <div className="stepN">{i + 1}</div>
          <div className="stepT"><T>{s}</T></div>
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
      {graph && <div style={{ padding: "12px 0 0 14px", maxWidth: 380 }}><Graph {...graph} w={graph.w || 320} /></div>}
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
    const msg = pct >= 90 ? "Výborně! Kuželosečky máš v malíku." : pct >= 70 ? "Dobře! Pár detailů doladit a jsi připravený." : pct >= 50 ? "Základ je, ale projdi si znovu teorii a úlohy." : "Ještě to chce zabrat — vrať se k teorii a vyřešeným úlohám.";
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
    <div style={{ maxWidth: 720 }}>
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
// MATEMATIKA: zlomky, odmocniny, rozbor obecné rovnice
// ══════════════════════════════════════════════════════════════════
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
function Q(n, d = 1) { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d); return { n: n / g, d: d / g }; }
const qadd = (a, b) => Q(a.n * b.d + b.n * a.d, a.d * b.d);
const qsub = (a, b) => Q(a.n * b.d - b.n * a.d, a.d * b.d);
const qmul = (a, b) => Q(a.n * b.n, a.d * b.d);
const qdiv = (a, b) => Q(a.n * b.d, a.d * b.n);
const qv = q => q.n / q.d;
const MINUS = "−";
const fmtN = v => (v < 0 ? MINUS : "") + Math.abs(v);
const fmtQ = q => q.d === 1 ? fmtN(q.n) : (q.n < 0 ? MINUS : "") + Math.abs(q.n) + "/" + q.d;
const fmtDec = v => { const r = Math.round(v * 100) / 100; return (r < 0 ? MINUS : "") + String(Math.abs(r)).replace(".", ","); };
const isSq = n => n >= 0 && Math.round(Math.sqrt(n)) ** 2 === n;

// √(q) jako text: "3", "√13", "2√5", "√2/2" …
function sqrtStr(q) {
  if (q.n === 0) return "0";
  if (isSq(q.n) && isSq(q.d)) return fmtQ(Q(Math.round(Math.sqrt(q.n)), Math.round(Math.sqrt(q.d))));
  let N = q.n * q.d, k = 1;
  for (let f = 2; f * f <= N; f++) while (N % (f * f) === 0) { N /= f * f; k *= f; }
  const g = gcd(k, q.d), kk = k / g, dd = q.d / g;
  return (kk === 1 ? "" : kk) + "√" + N + (dd === 1 ? "" : "/" + dd);
}
const sqrtIsRat = q => isSq(q.n) && isSq(q.d);
const sqrtQ = q => Q(Math.round(Math.sqrt(q.n)), Math.round(Math.sqrt(q.d)));

// „(x − 3)²“, „(y + 1/2)²“, „x²“
const sqTerm = (v, m) => m.n === 0 ? v + "²" : `(${v} ${m.n > 0 ? MINUS : "+"} ${fmtQ(Q(Math.abs(m.n), m.d))})²`;
const linTerm = (v, m) => m.n === 0 ? v : `(${v} ${m.n > 0 ? MINUS : "+"} ${fmtQ(Q(Math.abs(m.n), m.d))})`;
const den = q => q.d === 1 && q.n > 0 ? fmtQ(q) : "(" + fmtQ(q) + ")";
const bareTerm = (v, m) => m.n === 0 ? v : `${v} ${m.n > 0 ? MINUS : "+"} ${fmtQ(Q(Math.abs(m.n), m.d))}`;
const coefStr = q => (q.n === q.d ? "" : (q.n === -q.d ? MINUS : fmtQ(q)));

// mnohočlen s celými / zlomkovými koeficienty: [[koef, "x²"], …]
function fmtPoly(terms) {
  let s = "";
  for (const [c0, v] of terms) {
    const c = typeof c0 === "number" ? Q(c0) : c0;
    if (c.n === 0) continue;
    const neg = c.n < 0, abs = Q(Math.abs(c.n), c.d);
    const body = (abs.n === 1 && abs.d === 1 && v) ? v : fmtQ(abs) + v;
    s += s === "" ? (neg ? MINUS : "") + body : (neg ? " − " : " + ") + body;
  }
  return s || "0";
}
const genEq = (A, C, D, E, F) => fmtPoly([[A, "x²"], [C, "y²"], [D, "x"], [E, "y"], [F, ""]]) + " = 0";
const coordStr = (x, y) => `[${typeof x === "string" ? x : fmtQ(x)}; ${typeof y === "string" ? y : fmtQ(y)}]`;
// m ± √s jako dvojice textů
function pmStr(m, s2) {
  if (sqrtIsRat(s2)) { const s = sqrtQ(s2); return [fmtQ(qsub(m, s)), fmtQ(qadd(m, s))]; }
  const r = sqrtStr(s2);
  if (m.n === 0) return [MINUS + r, r];
  return [fmtQ(m) + " − " + r, fmtQ(m) + " + " + r];
}

// řídicí přímky elipsy/hyperboly: v = střed ± a²/e ; číselná výstřednost ε = e/a
function dirStr(v, mq, a2, e2) {
  const k = sqrtStr(qdiv(qmul(a2, a2), e2));
  return mq.n === 0 ? `${v} = ±${k}` : `${v} = ${fmtQ(mq)} ± ${k}`;
}
const epsStr = (a2, e2) => sqrtStr(qdiv(e2, a2));

const TYPE_NAMES = {
  kruznice: "Kružnice", elipsa: "Elipsa", hyperbola: "Hyperbola", parabola: "Parabola",
  ruznobezky: "Dvojice různoběžek", rovnobezky: "Dvojice rovnoběžek", primka: "Jedna (dvojnásobná) přímka",
  bod: "Bod", prazdna: "Prázdná množina", none: "Není kuželosečka",
};

// Rozbor rovnice Ax² + Cy² + Dx + Ey + F = 0 (celá čísla)
function analyze(A, C, D, E, F) {
  const steps = [], params = [];
  const f = (x, y) => A * x * x + C * y * y + D * x + E * y + F;
  let type = "none", std = "", center = null, ref = null, view = [-8, 8, -8, 8], extra = {}, geo = null;
  const eq = genEq(A, C, D, E, F);
  steps.push(`Rovnice: \`${eq}\``);
  const mkView = (cx, cy, half) => { half = Math.min(Math.max(half, 3), 40); return [cx - half, cx + half, cy - half, cy + half]; };

  if (A === 0 && C === 0) {
    steps.push("Chybí kvadratické členy x² i y² → rovnice je lineární (přímka), nebo nemá smysl. Nejde o kuželosečku.");
    return { type, name: TYPE_NAMES[type], steps, params, std, f, view, center, ref, eq };
  }

  if (A !== 0 && C !== 0) {
    steps.push(`Rychlý test: u x² je \`${A}\`, u y² je \`${C}\` → součin \`${A * C > 0 ? "> 0" : "< 0"}\` → ${A * C > 0 ? (A === C ? "kružnice" : "elipsa") : "hyperbola"} (pokud nevyjde singulární případ).`);
    const m = Q(-D, 2 * A), n = Q(-E, 2 * C);
    const R = qadd(qadd(Q(-F), Q(D * D, 4 * A)), Q(E * E, 4 * C));
    if (D !== 0 || E !== 0) {
      const parts = [];
      if (D !== 0) parts.push(`\`${fmtPoly([[A, "x²"], [D, "x"]])} = ${coefStr(Q(A))}[${sqTerm("x", m)} − ${fmtQ(qmul(m, m))}]\``);
      if (E !== 0) parts.push(`\`${fmtPoly([[C, "y²"], [E, "y"]])} = ${coefStr(Q(C))}[${sqTerm("y", n)} − ${fmtQ(qmul(n, n))}]\``);
      steps.push("Doplnění na čtverec: " + parts.join(", "));
    }
    const left = `${coefStr(Q(A))}${sqTerm("x", m)} ${C > 0 ? "+" : MINUS} ${coefStr(Q(Math.abs(C)))}${sqTerm("y", n)}`;
    steps.push(`Konstanty převedu doprava: \`${left} = ${fmtQ(R)}\``);
    center = [qv(m), qv(n)];
    const S = coordStr(m, n);

    if (R.n === 0) {
      if (A * C > 0) {
        type = "bod";
        steps.push(`Součet dvou nezáporných čísel (stejného znaménka) je 0 jen když obě závorky = 0 → jediný bod \`${S}\`.`);
        std = `${left} = 0`;
        params.push(["Bod", S]);
      } else {
        type = "ruznobezky";
        const k2 = Q(-A, C);
        const k = sqrtStr(k2);
        std = `${bareTerm("y", n)} = ±${k}·${linTerm("x", m)}`;
        steps.push(`Pravá strana je 0 a znaménka se liší → rozklad (a² − b² = (a − b)(a + b)): \`${std}\` → dvě různoběžky (singulární kuželosečka, „zdegenerovaná hyperbola“).`);
        params.push(["Průsečík přímek", S], ["Přímky", std]);
      }
      return { type, name: TYPE_NAMES[type], steps, params, std, f, view: mkView(center[0], center[1], 6), center, ref, eq };
    }

    const al2 = qdiv(R, Q(A)), be2 = qdiv(R, Q(C));
    steps.push(`Vydělím pravou stranou \`${fmtQ(R)}\`: \`${sqTerm("x", m)}/${den(al2)} + ${sqTerm("y", n)}/${den(be2)} = 1\``);

    if (al2.n < 0 && be2.n < 0) {
      type = "prazdna";
      steps.push("Oba jmenovatele záporné → levá strana ≥ 0 nikdy nedá zápornou pravou stranu. Žádný bod nevyhovuje.");
      std = `${left} = ${fmtQ(R)} (< 0)`;
      params.push(["Množina", "∅"]);
      return { type, name: TYPE_NAMES[type], steps, params, std, f, view: mkView(center[0], center[1], 6), center, ref, eq };
    }

    if (al2.n > 0 && be2.n > 0) {
      if (A === C) {
        type = "kruznice";
        std = `${sqTerm("x", m)} + ${sqTerm("y", n)} = ${fmtQ(al2)}`;
        steps.push(`Stejné koeficienty u x² a y² → kružnice: \`${std}\`.`);
        params.push(["Střed", "S" + S], ["Poloměr", "r = " + sqrtStr(al2)]);
        ref = center;
        geo = { kind: "kruznice", cx: center[0], cy: center[1], r: Math.sqrt(qv(al2)) };
        view = mkView(center[0], center[1], Math.sqrt(qv(al2)) * 1.5 + 1);
      } else {
        type = "elipsa";
        const horiz = qv(al2) > qv(be2);
        const a2 = horiz ? al2 : be2, b2 = horiz ? be2 : al2, e2 = qsub(a2, b2);
        std = `${sqTerm("x", m)}/${den(al2)} + ${sqTerm("y", n)}/${den(be2)} = 1`;
        steps.push(`Oba jmenovatele kladné a různé → elipsa. Větší jmenovatel je pod ${horiz ? "x" : "y"} → hlavní osa ∥ s osou ${horiz ? "x" : "y"}: \`a² = ${fmtQ(a2)}, b² = ${fmtQ(b2)}\`.`);
        steps.push(`Excentricita: \`e² = a² − b² = ${fmtQ(e2)}\` → \`e = ${sqrtStr(e2)}\`.`);
        const [ma, pa] = pmStr(horiz ? m : n, a2), [mb, pb] = pmStr(horiz ? n : m, b2), [me, pe] = pmStr(horiz ? m : n, e2);
        params.push(["Střed", "S" + S], ["Poloosy", `a = ${sqrtStr(a2)}, b = ${sqrtStr(b2)}, e = ${sqrtStr(e2)}`]);
        if (horiz) {
          params.push(["Hlavní vrcholy", `A[${ma}; ${fmtQ(n)}], B[${pa}; ${fmtQ(n)}]`], ["Vedlejší vrcholy", `C[${fmtQ(m)}; ${pb}], D[${fmtQ(m)}; ${mb}]`], ["Ohniska", `F₁[${me}; ${fmtQ(n)}], F₂[${pe}; ${fmtQ(n)}]`]);
        } else {
          params.push(["Hlavní vrcholy", `A[${fmtQ(m)}; ${ma}], B[${fmtQ(m)}; ${pa}]`], ["Vedlejší vrcholy", `C[${mb}; ${fmtQ(n)}], D[${pb}; ${fmtQ(n)}]`], ["Ohniska", `F₁[${fmtQ(m)}; ${me}], F₂[${fmtQ(m)}; ${pe}]`]);
        }
        params.push(["Hlavní osa", horiz ? `y = ${fmtQ(n)}` : `x = ${fmtQ(m)}`], ["Číselná výstřednost", `ε = e/a = ${epsStr(a2, e2)}  (< 1)`], ["Řídicí přímky", horiz ? dirStr("x", m, a2, e2) : dirStr("y", n, a2, e2)]);
        ref = center;
        geo = { kind: "elipsa", cx: center[0], cy: center[1], a: Math.sqrt(qv(a2)), b: Math.sqrt(qv(b2)), e: Math.sqrt(qv(e2)), horiz };
        view = mkView(center[0], center[1], Math.sqrt(qv(a2)) * 1.4 + 1);
      }
      return { type, name: TYPE_NAMES[type], steps, params, std, f, view, center, ref, eq, geo };
    }

    // hyperbola
    type = "hyperbola";
    const horiz = al2.n > 0;
    const a2 = horiz ? al2 : be2, b2 = horiz ? Q(-be2.n, be2.d) : Q(-al2.n, al2.d), e2 = qadd(a2, b2);
    std = horiz ? `${sqTerm("x", m)}/${den(a2)} − ${sqTerm("y", n)}/${den(b2)} = 1` : `${sqTerm("y", n)}/${den(a2)} − ${sqTerm("x", m)}/${den(b2)} = 1`;
    steps.push(`Jmenovatele mají opačná znaménka → hyperbola. Kladný člen je s ${horiz ? "x" : "y"} → hlavní osa ∥ s osou ${horiz ? "x" : "y"}: \`${std}\`.`);
    steps.push(`Excentricita: \`e² = a² + b² = ${fmtQ(e2)}\` → \`e = ${sqrtStr(e2)}\`.`);
    const [ma, pa] = pmStr(horiz ? m : n, a2), [me, pe] = pmStr(horiz ? m : n, e2);
    const slope2 = horiz ? qdiv(b2, a2) : qdiv(a2, b2);
    params.push(["Střed", "S" + S], ["Poloosy", `a = ${sqrtStr(a2)}, b = ${sqrtStr(b2)}, e = ${sqrtStr(e2)}`]);
    if (horiz) params.push(["Vrcholy", `A[${ma}; ${fmtQ(n)}], B[${pa}; ${fmtQ(n)}]`], ["Ohniska", `F₁[${me}; ${fmtQ(n)}], F₂[${pe}; ${fmtQ(n)}]`]);
    else params.push(["Vrcholy", `A[${fmtQ(m)}; ${ma}], B[${fmtQ(m)}; ${pa}]`], ["Ohniska", `F₁[${fmtQ(m)}; ${me}], F₂[${fmtQ(m)}; ${pe}]`]);
    params.push(["Asymptoty", `${bareTerm("y", n)} = ±${sqrtStr(slope2)}·${linTerm("x", m)}`], ["Hlavní osa", horiz ? `y = ${fmtQ(n)}` : `x = ${fmtQ(m)}`], ["Číselná výstřednost", `ε = e/a = ${epsStr(a2, e2)}  (> 1)`], ["Řídicí přímky", horiz ? dirStr("x", m, a2, e2) : dirStr("y", n, a2, e2)]);
    geo = { kind: "hyperbola", cx: center[0], cy: center[1], a: Math.sqrt(qv(a2)), b: Math.sqrt(qv(b2)), e: Math.sqrt(qv(e2)), horiz };
    const ev = Math.sqrt(qv(e2));
    ref = horiz ? [center[0] + ev, center[1]] : [center[0], center[1] + ev];
    extra.asym = Math.sqrt(qv(slope2));
    view = mkView(center[0], center[1], (Math.sqrt(qv(a2)) + Math.sqrt(qv(b2))) * 1.6 + 1);
    return { type, name: TYPE_NAMES[type], steps, params, std, f, view, center, ref, eq, extra, geo };
  }

  // jeden kvadratický člen → parabola (nebo rovnoběžky)
  const xSq = A !== 0;
  const K2 = xSq ? A : C, L1 = xSq ? D : E, L2 = xSq ? E : D;
  const v = xSq ? "x" : "y", w = xSq ? "y" : "x";
  steps.push(`Rychlý test: kvadratický je jen člen \`${v}²\` (u \`${w}²\` je 0) → parabola s osou ∥ s osou ${w} (pokud nechybí i lineární člen s ${w}).`);
  const m = Q(-L1, 2 * K2);
  const K = qsub(Q(F), qmul(Q(K2), qmul(m, m)));
  if (L1 !== 0) steps.push(`Doplnění na čtverec: \`${fmtPoly([[K2, v + "²"], [L1, v]])} = ${coefStr(Q(K2))}[${sqTerm(v, m)} − ${fmtQ(qmul(m, m))}]\``);
  if (L2 !== 0) {
    type = "parabola";
    const q = Q(-L2, K2);           // (v − m)² = q(w − n)
    const n = Q(-K.n, K.d * L2);    // n = −K/L2
    std = `${sqTerm(v, m)} = ${fmtQ(q)}${linTerm(w, n)}`;
    steps.push(`Po úpravě: \`${coefStr(Q(K2))}${sqTerm(v, m)} ${L2 > 0 ? "+" : MINUS} ${fmtQ(Q(Math.abs(L2)))}${w} ${K.n >= 0 ? "+" : MINUS} ${fmtQ(Q(Math.abs(K.n), K.d))} = 0\` → \`${std}\``);
    const p = Q(Math.abs(q.n), 2 * q.d), half = qdiv(q, Q(4));
    steps.push(`Porovnám s \`${v === "x" ? "(x − m)² = ±2p(y − n)" : "(y − n)² = ±2p(x − m)"}\`: \`2p = ${fmtQ(Q(Math.abs(q.n), q.d))}\` → \`p = ${fmtQ(p)}\`, ${q.n > 0 ? "znaménko +" : "znaménko −"} → otevřená ${xSq ? (q.n > 0 ? "nahoru" : "dolů") : (q.n > 0 ? "doprava" : "doleva")}.`);
    const V = xSq ? coordStr(m, n) : coordStr(n, m);
    const Fp = xSq ? coordStr(m, qadd(n, half)) : coordStr(qadd(n, half), m);
    const dir = `${w} = ${fmtQ(qsub(n, half))}`;
    params.push(["Vrchol", "V" + V], ["Parametr", "p = " + fmtQ(p) + "  (vzdálenost ohniska od řídicí přímky)"], ["Ohnisko", "F" + Fp], ["Řídicí přímka", "d: " + dir], ["Osa", `o: ${v} = ${fmtQ(m)}`], ["Číselná výstřednost", "ε = 1"]);
    const vx = xSq ? qv(m) : qv(n), vy = xSq ? qv(n) : qv(m), hq = qv(half);
    geo = { kind: "parabola", vx, vy, h: hq, xSq };
    center = [vx, vy];
    ref = xSq ? [vx, vy + hq] : [vx + hq, vy];
    const span = Math.max(Math.abs(qv(q)) * 1.1, 4);
    view = xSq ? mkView(vx, vy + Math.sign(qv(q)) * span * .6, span) : mkView(vx + Math.sign(qv(q)) * span * .6, vy, span);
    return { type, name: TYPE_NAMES[type], steps, params, std, f, view, center, ref, eq, geo };
  }
  const Lr = Q(-K.n, K.d * K2);
  steps.push(`Chybí lineární člen s ${w} → \`${sqTerm(v, m)} = ${fmtQ(Lr)}\`.`);
  if (Lr.n > 0) {
    type = "rovnobezky";
    const [a1, a2] = pmStr(m, Lr);
    std = `${v} = ${a1}  nebo  ${v} = ${a2}`;
    steps.push(`Kladná pravá strana → \`${linTerm(v, m)} = ±${sqrtStr(Lr)}\` → dvě rovnoběžky \`${std}\`.`);
    params.push(["Přímky", std]);
  } else if (Lr.n === 0) {
    type = "primka";
    std = `${v} = ${fmtQ(m)}`;
    steps.push(`Pravá strana 0 → jediná (dvojnásobná) přímka \`${std}\`.`);
    params.push(["Přímka", std]);
  } else {
    type = "prazdna";
    steps.push("Druhá mocnina nemůže být záporná → prázdná množina.");
    params.push(["Množina", "∅"]);
  }
  const cm = qv(m);
  return { type, name: TYPE_NAMES[type], steps, params, std, f, view: xSq ? mkView(cm, 0, 6) : mkView(0, cm, 6), center, ref, eq };
}

// Přímka ax + by + c = 0 a obecná kuželosečka (celá čísla) → poloha
function lineConic(K, ln) {
  const { A, C, D, E, F } = K, { a, b, c } = ln;
  let varName, al, be, ga, other;
  const useY = b !== 0 && (Math.abs(b) === 1 || Math.abs(a) !== 1);
  if (useY) {   // y = −(ax + c)/b, násobím b²
    varName = "x";
    al = A * b * b + C * a * a; be = 2 * C * a * c + D * b * b - E * a * b; ga = C * c * c - E * b * c + F * b * b;
    other = t => -(a * t + c) / b;
  } else {      // x = −(by + c)/a, násobím a²
    varName = "y";
    al = A * b * b + C * a * a; be = 2 * A * b * c - D * a * b + E * a * a; ga = A * c * c - D * a * c + F * a * a;
    other = t => -(b * t + c) / a;
  }
  const g = gcd(gcd(al, be), ga) || 1;
  const sg = (al < 0 || (al === 0 && be < 0)) ? -1 : 1;
  al = al / g * sg; be = be / g * sg; ga = ga / g * sg;
  const res = { varName, al, be, ga, useY, pts: [] };
  const mk = t => (useY ? [t, other(t)] : [other(t), t]);
  if (al === 0) {
    if (be === 0) { res.kind = ga === 0 ? "inside" : "asymptote"; return res; }
    res.kind = "parallel";
    const t = -ga / be; res.pts.push(mk(t)); res.exact = [Q(-ga, be)];
    return res;
  }
  res.D = be * be - 4 * al * ga;
  if (res.D < 0) { res.kind = "exterior"; return res; }
  if (res.D === 0) { res.kind = "tangent"; const t = -be / (2 * al); res.pts.push(mk(t)); res.exact = [Q(-be, 2 * al)]; return res; }
  res.kind = "secant";
  const sD = Math.sqrt(res.D);
  res.pts.push(mk((-be - sD) / (2 * al)), mk((-be + sD) / (2 * al)));
  if (isSq(res.D)) res.exact = [Q(-be - Math.round(sD), 2 * al), Q(-be + Math.round(sD), 2 * al)];
  return res;
}
const KIND_NAMES = {
  secant: "Sečna (2 společné body)",
  tangent: "Tečna (1 bod, D = 0)",
  exterior: "Vnější přímka (0 bodů)",
  parallel: "1 bod, ale není tečna (∥ s asymptotou / osou)",
  asymptote: "Asymptota (0 bodů)",
  inside: "Přímka leží v kuželosečce",
};
// hezký zápis přímky
const lineEq = ({ a, b, c }) => fmtPoly([[a, "x"], [b, "y"], [c, ""]]) + " = 0";
// převod bodu na text (přesně, je-li to možné)
function ptStr(res, i, ln) {
  const p = res.pts[i];
  if (res.exact && res.exact[i]) {
    const t = res.exact[i];
    // druhá souřadnice přesně
    const { a, b, c } = ln;
    const o = res.useY ? qdiv(qadd(qmul(Q(-a), t), Q(-c)), Q(b)) : qdiv(qadd(qmul(Q(-b), t), Q(-c)), Q(a));
    return res.useY ? coordStr(t, o) : coordStr(o, t);
  }
  return `[${fmtDec(p[0])}; ${fmtDec(p[1])}] (přibližně)`;
}

// ══════════════════════════════════════════════════════════════════
// NÁHODA + GENERÁTORY
// ══════════════════════════════════════════════════════════════════
const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const rnz = (a, b) => { let v = 0; while (v === 0) v = ri(a, b); return v; };
const fromCentered = (A, C, m, n, R) => ({ A, C, D: -2 * A * m, E: -2 * C * n, F: A * m * m + C * n * n - R });

function genTypeTask() {
  const t = pick(["kruznice", "kruznice", "elipsa", "elipsa", "elipsa", "hyperbola", "hyperbola", "hyperbola", "parabola", "parabola", "parabola", "ruznobezky", "bod", "prazdna"]);
  const m = ri(-4, 4), n = ri(-4, 4);
  let K;
  if (t === "kruznice") { const k = pick([1, 1, 1, 2, 3]), r = ri(1, 5); K = fromCentered(k, k, m, n, k * r * r); }
  else if (t === "elipsa") { let A = ri(1, 5), C = ri(1, 5); while (C === A) C = ri(1, 5); K = fromCentered(A, C, m, n, A * C * ri(1, 3)); }
  else if (t === "hyperbola") { const A = ri(1, 4), C = -ri(1, 4); K = fromCentered(A, C, m, n, A * -C * ri(1, 3) * pick([1, -1])); }
  else if (t === "ruznobezky") K = fromCentered(ri(1, 4), -ri(1, 4), m, n, 0);
  else if (t === "bod") K = fromCentered(ri(1, 4), ri(1, 4), m, n, 0);
  else if (t === "prazdna") { const A = ri(1, 4), C = pick([A, ri(1, 4)]); K = fromCentered(A, C, m, n, -A * C * ri(1, 3)); }
  else {
    const k = pick([1, 1, 2, -1]), q = rnz(-8, 8);
    if (Math.random() < .5) K = { A: k, C: 0, D: -2 * k * m, E: q, F: k * m * m - q * n };
    else K = { A: 0, C: k, D: q, E: -2 * k * n, F: k * n * n - q * m };
  }
  if (Math.random() < .25) K = { A: -K.A, C: -K.C, D: -K.D, E: -K.E, F: -K.F };
  return K;
}

// kuželosečka (elipsa/kružnice/hyperbola/parabola) procházející celočíselným bodem T
function genConicThrough(kind) {
  for (let tries = 0; tries < 200; tries++) {
    const m = ri(-3, 3), n = ri(-3, 3);
    if (kind === "elipsa" || kind === "kruznice") {
      const A = ri(1, 4), C = kind === "kruznice" ? A : ri(1, 4);
      const T = [m + ri(-3, 3), n + ri(-3, 3)];
      if (T[0] === m && T[1] === n) continue;
      const R = A * (T[0] - m) ** 2 + C * (T[1] - n) ** 2;
      return { K: fromCentered(A, C, m, n, R), T, kind: A === C ? "kruznice" : "elipsa" };
    }
    if (kind === "hyperbola") {
      const k = ri(1, 3), l = ri(1, 3), sg = pick([1, -1]);
      const A = sg * k * k, C = -sg * l * l;
      const T = [m + ri(-4, 4), n + ri(-4, 4)];
      const R = A * (T[0] - m) ** 2 + C * (T[1] - n) ** 2;
      if (R === 0) continue;
      return { K: fromCentered(A, C, m, n, R), T, kind, k, l, m, n };
    }
    // parabola
    const t = ri(-3, 3);
    const divs = []; for (let d = 1; d <= Math.max(1, t * t); d++) if (t === 0 || (t * t) % d === 0) divs.push(d);
    const q = pick(divs) * pick([1, -1]) * (t === 0 ? ri(1, 4) : 1);
    if (Math.random() < .5) return { K: { A: 1, C: 0, D: -2 * m, E: -q, F: m * m + q * n }, T: [m + t, n + (t * t) / q], kind, vert: true };
    return { K: { A: 0, C: 1, D: -q, E: -2 * n, F: n * n + q * m }, T: [m + (t * t) / q, n + t], kind, vert: false };
  }
  return genConicThrough("kruznice");
}

const normLine = (a, b, c) => { const g = gcd(gcd(a, b), c); let s = (a < 0 || (a === 0 && b < 0)) ? -1 : 1; return { a: a / g * s, b: b / g * s, c: c / g * s }; };

function genLineTask() {
  const kind = pick(["elipsa", "elipsa", "kruznice", "hyperbola", "hyperbola", "parabola", "parabola"]);
  const targets = kind === "hyperbola" || kind === "parabola" ? ["secant", "tangent", "exterior", "parallel"] : ["secant", "tangent", "exterior"];
  const target = pick(targets);
  for (let attempt = 0; attempt < 40; attempt++) {
    const g = genConicThrough(kind);
    const { A, C, D, E, F } = g.K;
    const [x0, y0] = g.T;
    let ln = null;
    if (target === "tangent") ln = normLine(2 * A * x0 + D, 2 * C * y0 + E, D * x0 + E * y0 + 2 * F);
    else if (target === "secant") {
      for (let i = 0; i < 60 && !ln; i++) {
        const u1 = ri(-3, 3), u2 = ri(-3, 3); if (!u1 && !u2) continue;
        const cand = normLine(u2, -u1, -(u2 * x0 - u1 * y0));
        if (lineConic(g.K, cand).kind === "secant") ln = cand;
      }
    } else if (target === "exterior") {
      for (let i = 0; i < 400 && !ln; i++) {
        const a = ri(-3, 3), b = ri(-3, 3); if (!a && !b) continue;
        const cand = normLine(a, b, ri(-15, 15));
        if (lineConic(g.K, cand).kind === "exterior") ln = cand;
      }
    } else if (kind === "hyperbola") {
      const s = pick([1, -1]);
      const base = -g.k * g.m - s * g.l * g.n;   // k(x − m) = −s·l(y − n) … asymptota kx + s·l·y + base = 0
      ln = normLine(g.k, s * g.l, base + rnz(-5, 5));
    } else {
      ln = g.vert ? normLine(1, 0, -ri(-4, 4)) : normLine(0, 1, -ri(-4, 4));
    }
    if (!ln || (ln.a === 0 && ln.b === 0)) continue;
    const res = lineConic(g.K, ln);
    if (res.kind !== target) continue;
    return { K: g.K, ln, res };
  }
  return genLineTask();
}

// normalizace obecné rovnice: vykrátit, kladný první kvadratický koeficient
function normK(K) {
  const g = [K.A, K.C, K.D, K.E, K.F].reduce((a, b) => gcd(a, b), 0) || 1;
  const sg = (K.A < 0 || (K.A === 0 && K.C < 0)) ? -1 : 1;
  return { A: K.A / g * sg, C: K.C / g * sg, D: K.D / g * sg, E: K.E / g * sg, F: K.F / g * sg };
}
const sameK = (a, b) => a.A === b.A && a.C === b.C && a.D === b.D && a.E === b.E && a.F === b.F;

// ── Poměr vzdáleností |PF| : |Pd| = num : den, d ∥ s osou y (x = c) nebo s osou x (y = c)
function ratioK(f1, f2, c, vert, en, ed) {
  if (vert) return { A: ed - en, C: ed, D: -2 * ed * f1 + 2 * en * c, E: -2 * ed * f2, F: ed * (f1 * f1 + f2 * f2) - en * c * c };
  return { A: ed, C: ed - en, D: -2 * ed * f1, E: -2 * ed * f2 + 2 * en * c, F: ed * (f1 * f1 + f2 * f2) - en * c * c };
}
const RATIOS = [[1, 2], [1, 2], [1, 1], [1, 1], [2, 1], [2, 1], [1, 3], [3, 1], [2, 3], [3, 2]];
function genRatioTask() {
  for (;;) {
    const [num, den] = pick(RATIOS), vert = Math.random() < .5;
    const f1 = ri(-4, 4), f2 = ri(-4, 4), c = ri(-6, 6);
    if ((vert ? f1 : f2) === c) continue;
    const K = normK(ratioK(f1, f2, c, vert, num * num, den * den));
    const wrong = [
      ratioK(f1, f2, c, vert, num, den),                 // zapomenuté umocnění poměru
      ratioK(f1, f2, c, vert, den * den, num * num),     // obrácený poměr
      ratioK(f1, f2, -c, vert, num * num, den * den),    // špatná rovnice přímky
      ratioK(-f1, -f2, c, vert, num * num, den * den),   // špatné znaménko u ohniska
    ].map(normK).filter(k => (k.A || k.C) && !sameK(k, K));
    const opts = [K];
    for (const k of shuffleArray(wrong)) if (!opts.some(o => sameK(o, k)) && opts.length < 4) opts.push(k);
    if (opts.length < 4) continue;
    const phr = num === den ? "stejnou vzdálenost od bodu F a od přímky d"
      : num < den && num === 1 ? `vzdálenost od přímky d ${den === 2 ? "dvojnásobnou" : "trojnásobnou"} než od bodu F`
      : den === 1 ? `vzdálenost od bodu F ${num === 2 ? "dvojnásobnou" : "trojnásobnou"} než od přímky d`
      : `poměr vzdáleností |PF| : |Pd| = ${num} : ${den}`;
    return { f1, f2, c, vert, num, den, K, opts: shuffleArray(opts), phr };
  }
}
function ratioSteps(t) {
  const { f1, f2, c, vert, num, den, K } = t;
  const v = vert ? "x" : "y", eps = Q(num, den), e2 = qmul(eps, eps);
  const raw = ratioK(f1, f2, c, vert, num * num, den * den);
  const kind = num < den ? "ε < 1 → elipsa" : num === den ? "ε = 1 → parabola" : "ε > 1 → hyperbola";
  const st = [
    `Obecný bod \`P[x; y]\`. \`|PF| = √(${sqTerm("x", Q(f1))} + ${sqTerm("y", Q(f2))})\`, \`|Pd| = |${bareTerm(v, Q(c))}|\``,
    `Podmínka \`|PF| = ${fmtQ(eps)}·|Pd|\`, obě strany umocním na druhou: \`${sqTerm("x", Q(f1))} + ${sqTerm("y", Q(f2))} = ${num === den ? "" : fmtQ(e2) + "·"}${sqTerm(v, Q(c))}\``,
  ];
  if (den !== 1) st.push(`Zbavím se zlomku (·${den * den}): \`${den * den}[${sqTerm("x", Q(f1))} + ${sqTerm("y", Q(f2))}] = ${num * num === 1 ? "" : num * num}${sqTerm(v, Q(c))}\``);
  st.push(`Roznásobím a převedu vše doleva: \`${genEq(raw.A, raw.C, raw.D, raw.E, raw.F)}\`${sameK(raw, K) ? "" : ` → po vykrácení \`${genEq(K.A, K.C, K.D, K.E, K.F)}\``}`);
  st.push(`Poměr \`ε = |PF| : |Pd| = ${fmtQ(eps)}\` je číselná výstřednost: ${kind}.`);
  return st;
}

// ── Převody obecný ↔ středový/vrcholový tvar
const DEN = [2, 3, 4, 5, 8, 9, 12, 16, 25];
function convStd(t) {
  const { kind, m, n } = t, X = sqTerm("x", Q(m)), Y = sqTerm("y", Q(n));
  if (kind === "kruznice") return `${X} + ${Y} = ${t.r2}`;
  if (kind === "elipsa") return `${X}/${t.X} + ${Y}/${t.Y} = 1`;
  if (kind === "hyperbola") return t.horiz ? `${X}/${t.X} − ${Y}/${t.Y} = 1` : `${Y}/${t.Y} − ${X}/${t.X} = 1`;
  return t.vert ? `${X} = ${fmtQ(Q(t.q))}${linTerm("y", Q(n))}` : `${Y} = ${fmtQ(Q(t.q))}${linTerm("x", Q(m))}`;
}
function convRaw(t) {
  const { kind, m, n } = t;
  if (kind === "kruznice") return fromCentered(1, 1, m, n, t.r2);
  if (kind === "elipsa") return fromCentered(t.Y, t.X, m, n, t.X * t.Y);
  if (kind === "hyperbola") return t.horiz ? fromCentered(t.Y, -t.X, m, n, t.X * t.Y) : fromCentered(-t.Y, t.X, m, n, t.X * t.Y);
  return t.vert ? { A: 1, C: 0, D: -2 * m, E: -t.q, F: m * m + t.q * n } : { A: 0, C: 1, D: -t.q, E: -2 * n, F: n * n + t.q * m };
}
function genConvTask() {
  const kind = pick(["kruznice", "elipsa", "elipsa", "hyperbola", "hyperbola", "parabola", "parabola"]);
  const m = rnz(-5, 5), n = rnz(-5, 5);
  let t = { kind, m, n };
  if (kind === "kruznice") t.r2 = pick([1, 4, 9, 16, 25, 2, 5, 8, 10, 13]);
  else if (kind === "elipsa" || kind === "hyperbola") { t.X = pick(DEN); do t.Y = pick(DEN); while (t.Y === t.X); t.horiz = Math.random() < .5; }
  else { t.q = pick([2, 3, 4, 6, 8, 10, 12]) * pick([1, -1]); t.vert = Math.random() < .5; }
  const variants = [{ ...t, m: -m }, { ...t, n: -n }, { ...t, m: -m, n: -n }];
  if (t.X) variants.push({ ...t, X: t.Y, Y: t.X });
  if (kind === "hyperbola") variants.push({ ...t, horiz: !t.horiz });
  if (kind === "parabola") variants.push({ ...t, q: -t.q }, { ...t, vert: !t.vert });
  if (kind === "kruznice") variants.push({ ...t, r2: t.r2 + m * m + n * n });
  const toGen = !!(Math.random() < .5);   // true: středový → obecný
  const K = normK(convRaw(t));
  const label = v => toGen ? (k => genEq(k.A, k.C, k.D, k.E, k.F))(normK(convRaw(v))) : convStd(v);
  const right = toGen ? genEq(K.A, K.C, K.D, K.E, K.F) : analyze(K.A, K.C, K.D, K.E, K.F).std;
  const opts = [right];
  for (const v of shuffleArray(variants)) { const l = label(v); if (!opts.includes(l) && opts.length < 4) opts.push(l); }
  return { t, K, toGen, right, opts: shuffleArray(opts) };
}
function convSteps(task) {
  const { t, K } = task;
  const raw = convRaw(t);
  const st = [];
  if (t.kind === "elipsa" || t.kind === "hyperbola") st.push(`Vynásobím společným jmenovatelem \`${t.X * t.Y}\`: \`${fmtPoly([[raw.A, sqTerm("x", Q(t.m))], [raw.C, sqTerm("y", Q(t.n))]])} = ${t.X * t.Y}\``);
  st.push("Roznásobím závorky podle `(a ± b)² = a² ± 2ab + b²` a vše převedu na levou stranu.");
  st.push(`\`${genEq(raw.A, raw.C, raw.D, raw.E, raw.F)}\`${sameK(raw, K) ? "" : ` → vykrátím / vynásobím −1: \`${genEq(K.A, K.C, K.D, K.E, K.F)}\``}`);
  st.push("Kontrola: dosaď do výsledku libovolný bod kuželosečky (třeba vrchol) → musí vyjít 0.");
  return st;
}

// ══════════════════════════════════════════════════════════════════
// PŘEHLED
// ══════════════════════════════════════════════════════════════════
const fEl = (m, n, a2, b2) => (x, y) => (x - m) ** 2 / a2 + (y - n) ** 2 / b2 - 1;
const fHy = (m, n, a2, b2) => (x, y) => (x - m) ** 2 / a2 - (y - n) ** 2 / b2 - 1;

function Prehled({ go }) {
  const mini = [
    { t: "Kružnice", eq: "(x − m)² + (y − n)² = r²", K: [1, 1, 0, 0, -9] },
    { t: "Elipsa", eq: "(x − m)²/a² + (y − n)²/b² = 1", K: [9, 16, 0, 0, -144] },
    { t: "Hyperbola", eq: "(x − m)²/a² − (y − n)²/b² = 1", K: [1, -1, 0, 0, -4] },
    { t: "Parabola", eq: "(y − n)² = 2p(x − m)", K: [0, 1, -4, 0, -8] },
  ];
  return (
    <div>
      <div className="entry red">
        <h3>Co bude v testu (zadání od učitelky)</h3>
        <ol>
          <li><b>Rovnice kuželosečky z poměru vzdáleností</b> od bodu (ohniska) a přímky (řídicí přímky). <span className="src">Teorie 3 · Úlohy „Poměr vzdáleností“</span></li>
          <li><b>Vyčíst informace z rovnice</b> (střed/vrchol, poloosy, vrcholy, ohniska, asymptoty, řídicí přímka, parametr) <b>a naopak</b> ze zadaných informací sestavit rovnici. <span className="src">Teorie 2, 6 · Úlohy „Z rovnice → prvky“, „Z prvků → rovnice“</span></li>
          <li><b>Převody oběma směry</b> mezi obecným a středovým/vrcholovým tvarem. <span className="src">Teorie 4, 5 · Úlohy „Převody tvarů“</span></li>
          <li><b>Zakreslit kuželosečku do KSS</b> a vyznačit její význačné prvky. <span className="src">Teorie 7 · Úlohy „Zakreslení do KSS“</span></li>
          <li><b>Vzájemná poloha přímky a kuželosečky</b> + výpočet společných bodů. <span className="src">Teorie 8 · Úlohy „Přímka a kuželosečka“</span></li>
        </ol>
        <div className="note">Rovnice tečen v testu <b>nebudou</b>, proto tu nejsou. Slovo „tečna“ potkáš jen jako jeden z výsledků vzájemné polohy (D = 0 → 1 společný bod).</div>
      </div>

      <div className="entry">
        <h3>Jak se učit (doporučené pořadí)</h3>
        <ol>
          <li>📖 <b>Teorie</b>: projdi sekce 1–9, hlavně 3 (poměr vzdáleností) a 7 (kreslení), ty jsou nové.</li>
          <li>✍️ <b>Úlohy</b>: příklady z tvých pracovních listů + nové úlohy na poměr, převody a kreslení. Nejdřív počítej sám, pak si rozbal řešení.</li>
          <li>🧪 <b>Rozpoznávač</b>: zadej libovolnou rovnici a uvidíš celý rozbor, všechny prvky a graf. Hodí se na kontrolu.</li>
          <li>🎯 <b>Trenažér</b>: neomezený počet náhodných příkladů na všech pět bodů zadání.</li>
          <li>❓ <b>Kvíz</b> a 🃏 <b>kartičky</b> na pojmy, nakonec 📐 <b>vzorce</b> těsně před testem.</li>
        </ol>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 10 }}>
          <button className="btn solid" onClick={() => go("teorie")}>Začít teorií →</button>
          <button className="btn" onClick={() => go("trenazer")}>Rovnou trénovat 🎯</button>
        </div>
      </div>

      <div className="entry">
        <h3>Čtyři regulární kuželosečky s význačnými prvky</h3>
        <div className="grid2" style={{ marginTop: 10 }}>
          {mini.map(c => (
            <div key={c.t}>
              <div style={{ fontFamily: "'Libre Baskerville',serif", fontWeight: 700, color: PEN }}>{c.t}</div>
              <div className="mono" style={{ fontSize: 14, margin: "2px 0 6px" }}>{c.eq}</div>
              <Graph {...conicGraphProps(analyze(...c.K))} w={260} />
            </div>
          ))}
        </div>
        <p className="graphCap" style={{ textAlign: "left" }}>{LEGEND}</p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// TEORIE
// ══════════════════════════════════════════════════════════════════
function Teorie() {
  return (
    <div>
      <Coll icon="🍦" title="1. Co jsou kuželosečky" open>
        <p>Kuželosečky jsou křivky, které vzniknou jako <b>řez rotační kuželové plochy rovinou</b>: <b>kružnice, elipsa, parabola a hyperbola</b> (tzv. <i>regulární</i> kuželosečky).</p>
        <p>Když rovina prochází vrcholem kužele, vznikne <b>bod, přímka nebo dvojice přímek</b>. To jsou <i>singulární</i> (zdegenerované) kuželosečky. V testu se objevují jako chytáky při rozpoznávání typu.</p>
        <p>V rovině je každá kuželosečka (s osami rovnoběžnými s osami souřadnic) popsána <b>obecnou rovnicí</b></p>
        <Eq big>Ax² + Cy² + Dx + Ey + F = 0</Eq>
        <div className="tip">Člen se součinem <M>xy</M> znamená, že kuželosečka je „pootočená“ (např. <M>(x − 2)(y + 3) + 16 = 0</M> z PL úl. 1c* je hyperbola s asymptotami <M>x = 2</M>, <M>y = −3</M>). Ve středoškolských úlohách je to výjimka; běžně <M>xy</M> chybí.</div>
      </Coll>

      <Coll icon="📏" title="2. Definice a rovnice: kružnice, elipsa, hyperbola, parabola">
        <h4 style={{ margin: "8px 0 4px" }}>Kružnice</h4>
        <p>Množina bodů, které mají od středu <M>S[m; n]</M> vzdálenost <M>r</M>.</p>
        <Eq>(x − m)² + (y − n)² = r²</Eq>

        <h4 style={{ margin: "16px 0 4px" }}>Elipsa</h4>
        <p>Množina bodů, které mají od dvou ohnisek <M>F₁, F₂</M> <b>součet</b> vzdáleností <M>2a</M> (větší než <M>|F₁F₂|</M>).</p>
        <div className="grid2">
          <div>
            <Eq>[[(x − m)²||a²]] + [[(y − n)²||b²]] = 1</Eq>
            <p style={{ fontSize: 15 }}>hlavní osa ∥ x (větší jmenovatel pod x)</p>
            <Eq>[[(x − m)²||b²]] + [[(y − n)²||a²]] = 1</Eq>
            <p style={{ fontSize: 15 }}>hlavní osa ∥ y (větší jmenovatel pod y)</p>
            <ul style={{ fontSize: 15 }}>
              <li><M>a</M> = hlavní poloosa, <M>b</M> = vedlejší poloosa, <M>a &gt; b</M></li>
              <li><M>e</M> = výstřednost (vzdálenost ohniska od středu)</li>
              <li><b><M>e² = a² − b²</M></b></li>
              <li>hlavní vrcholy <M>A, B</M> (vzdálené <M>a</M> od S), vedlejší <M>C, D</M> (vzdálené <M>b</M>)</li>
            </ul>
          </div>
          <Graph curves={[{ f: fEl(0, 0, 25, 9) }]} lines={[{ a: 0, b: 1, c: 0, dash: true, color: MUTED }]} pts={[{ x: -5, y: 0, label: "A" }, { x: 5, y: 0, label: "B" }, { x: 0, y: 3, label: "C" }, { x: 0, y: -3, label: "D" }, { x: -4, y: 0, label: "F₁", color: RED }, { x: 4, y: 0, label: "F₂", color: RED }, { x: 0, y: 0, label: "S", r: 3 }]} view={[-6.5, 6.5, -4.5, 4.5]} caption="x²/25 + y²/9 = 1: a = 5, b = 3, e = 4" w={300} />
        </div>

        <h4 style={{ margin: "16px 0 4px" }}>Hyperbola</h4>
        <p>Množina bodů, které mají od dvou ohnisek <b>absolutní hodnotu rozdílu</b> vzdáleností <M>2a</M> (menší než <M>|F₁F₂|</M>).</p>
        <div className="grid2">
          <div>
            <Eq>[[(x − m)²||a²]] − [[(y − n)²||b²]] = 1</Eq>
            <p style={{ fontSize: 15 }}>hlavní osa ∥ x (kladný člen s x)</p>
            <Eq>[[(y − n)²||a²]] − [[(x − m)²||b²]] = 1</Eq>
            <p style={{ fontSize: 15 }}>hlavní osa ∥ y (kladný člen s y)</p>
            <ul style={{ fontSize: 15 }}>
              <li><M>a</M> = hlavní poloosa: <b>vždy pod kladným členem</b> (a může být menší než b!)</li>
              <li><b><M>e² = a² + b²</M></b></li>
              <li>asymptoty (osa ∥ x): <M>y − n = ±[[b||a]](x − m)</M></li>
              <li>asymptoty (osa ∥ y): <M>y − n = ±[[a||b]](x − m)</M></li>
              <li>rovnoosá hyperbola: <M>a = b</M> → <M>x² − y² = a²</M>, <M>e² = 2a²</M></li>
            </ul>
          </div>
          <Graph curves={[{ f: fHy(0, 0, 9, 4) }]} lines={[{ a: 2, b: -3, c: 0, dash: true, color: MUTED }, { a: 2, b: 3, c: 0, dash: true, color: MUTED }]} pts={[{ x: -3, y: 0, label: "A" }, { x: 3, y: 0, label: "B" }, { x: -Math.sqrt(13), y: 0, label: "F₁", color: RED }, { x: Math.sqrt(13), y: 0, label: "F₂", color: RED }]} view={[-7, 7, -5, 5]} caption="x²/9 − y²/4 = 1: a = 3, b = 2, e = √13, asymptoty y = ±⅔x" w={300} />
        </div>

        <h4 style={{ margin: "16px 0 4px" }}>Parabola</h4>
        <p>Množina bodů, které mají <b>stejnou vzdálenost</b> od ohniska <M>F</M> a od řídicí přímky <M>d</M>. <M>p</M> = parametr = vzdálenost <M>F</M> od <M>d</M>. Vrchol <M>V</M> leží v polovině, ohnisko je od vrcholu <M>[[p||2]]</M>.</p>
        <div className="tblWrap"><table className="tbl">
          <thead><tr><th>Rovnice</th><th>Otevřená</th><th>Ohnisko F</th><th>Řídicí přímka d</th></tr></thead>
          <tbody>
            <tr><td className="mono">(y − n)² = 2p(x − m)</td><td>doprava →</td><td className="mono">[m + p/2; n]</td><td className="mono">x = m − p/2</td></tr>
            <tr><td className="mono">(y − n)² = −2p(x − m)</td><td>doleva ←</td><td className="mono">[m − p/2; n]</td><td className="mono">x = m + p/2</td></tr>
            <tr><td className="mono">(x − m)² = 2p(y − n)</td><td>nahoru ↑</td><td className="mono">[m; n + p/2]</td><td className="mono">y = n − p/2</td></tr>
            <tr><td className="mono">(x − m)² = −2p(y − n)</td><td>dolů ↓</td><td className="mono">[m; n − p/2]</td><td className="mono">y = n + p/2</td></tr>
          </tbody>
        </table></div>
        <div className="note">Pozor: v rovnici je <b>2p</b>, ne p. <M>y² = 8x</M> → <M>2p = 8</M>, <M>p = 4</M>, <M>F[2; 0]</M>, <M>d: x = −2</M> (PL Parabola 3a).</div>
      </Coll>

      <Coll icon="⚖️" title="3. Kuželosečka z poměru vzdáleností od bodu a přímky">
        <p>Elipsu, parabolu i hyperbolu jde popsat <b>jednou společnou definicí</b>. Dán je bod <M>F</M> (ohnisko), přímka <M>d</M> (řídicí přímka, <M>F ∉ d</M>) a kladné číslo <M>ε</M>. Kuželosečka je množina všech bodů <M>P</M>, pro které</p>
        <Eq big>|PF| : |Pd| = ε   tj.   |PF| = ε·|Pd|</Eq>
        <div className="tblWrap"><table className="tbl">
          <thead><tr><th>Poměr ε = |PF| : |Pd|</th><th>Kuželosečka</th><th>Slovně</th></tr></thead>
          <tbody>
            <tr><td className="mono">0 &lt; ε &lt; 1</td><td><b>elipsa</b></td><td>bod je blíž k ohnisku než k přímce</td></tr>
            <tr><td className="mono">ε = 1</td><td><b>parabola</b></td><td>stejně daleko od ohniska i od přímky</td></tr>
            <tr><td className="mono">ε &gt; 1</td><td><b>hyperbola</b></td><td>bod je blíž k přímce než k ohnisku</td></tr>
          </tbody>
        </table></div>
        <p>Číslo <M>ε</M> se jmenuje <b>číselná výstřednost</b>. Pro elipsu a hyperbolu platí <M>ε = [[e||a]]</M> (e = vzdálenost ohniska od středu). Kružnice má <M>ε = 0</M> a řídicí přímku nemá.</p>

        <h4 style={{ margin: "14px 0 4px" }}>Postup výpočtu (pořád stejný)</h4>
        <ol>
          <li>Vezmi obecný bod <M>P[x; y]</M>.</li>
          <li>Vzdálenost od bodu: <M>|PF| = √((x − f₁)² + (y − f₂)²)</M>.</li>
          <li>Vzdálenost od přímky: <M>|Pd| = [[|ax + by + c| ||√(a² + b²)]]</M>; pro <M>d: x = c</M> je to jen <M>|x − c|</M>, pro <M>d: y = c</M> jen <M>|y − c|</M>.</li>
          <li>Napiš podmínku <M>|PF| = ε·|Pd|</M> a <b>obě strany umocni</b> (obě jsou nezáporné, takže se nic neztratí). Absolutní hodnota i odmocnina zmizí, <b>ε se umocní na ε²</b>!</li>
          <li>Roznásob, převeď vše doleva → <b>obecná rovnice</b>. Pak doplň na čtverec → středový/vrcholový tvar a prvky.</li>
        </ol>
        <div className="entry" style={{ margin: "12px 0" }}>
          <div className="src">Vzor — F[3; 0], d: x = 12, |PF| : |Pd| = 1 : 2</div>
          <div className="grid2" style={{ alignItems: "start" }}>
            <div>
              <Steps steps={[
                "`|PF| = [[1||2]]·|Pd|` → `√((x − 3)² + y²) = [[1||2]]·|x − 12|`",
                "Umocním: `(x − 3)² + y² = [[1||4]](x − 12)²` | ·4",
                "`4x² − 24x + 36 + 4y² = x² − 24x + 144`",
                "`3x² + 4y² − 108 = 0` (obecný tvar)",
                "Vydělím 108: `[[x²||36]] + [[y²||27]] = 1`, `a = 6`, `b = 3√3`, `e = √(36 − 27) = 3`",
                "Kontrola: `ε = e/a = 3/6 = 1/2` ✓, ohnisko `[3; 0]` ✓, řídicí přímka `x = a²/e = 12` ✓",
              ]} />
              <div className="result">elipsa x²/36 + y²/27 = 1</div>
            </div>
            <Graph {...conicGraphProps(analyze(3, 4, 0, 0, -108), { view: [-13, 13, -10, 10] })} w={280} caption="zadané ohnisko F₂[3; 0] a řídicí přímka x = 12 (oranžově vpravo)" />
          </div>
        </div>
        <div className="note"><b>Pozor na formulaci!</b> „Vzdálenost od přímky je dvakrát větší než od bodu“ znamená <M>|Pd| = 2·|PF|</M>, tedy <M>ε = |PF| : |Pd| = 1 : 2</M> → elipsa. „Vzdálenost od bodu je dvakrát větší než od přímky“ je <M>ε = 2</M> → hyperbola. Vždy si napiš <M>|PF| = …</M> a teprve pak počítej.</div>

        <h4 style={{ margin: "14px 0 4px" }}>Opačný směr: z rovnice ohnisko, řídicí přímka a ε</h4>
        <div className="tblWrap"><table className="tbl">
          <thead><tr><th>Kuželosečka (osa ∥ x)</th><th>ε</th><th>Řídicí přímky</th></tr></thead>
          <tbody>
            <tr><td>elipsa <M>[[(x − m)²||a²]] + [[(y − n)²||b²]] = 1</M></td><td className="mono">e/a &lt; 1</td><td className="mono">x = m ± a²/e</td></tr>
            <tr><td>hyperbola <M>[[(x − m)²||a²]] − [[(y − n)²||b²]] = 1</M></td><td className="mono">e/a &gt; 1</td><td className="mono">x = m ± a²/e</td></tr>
            <tr><td>parabola <M>(y − n)² = 2p(x − m)</M></td><td className="mono">1</td><td className="mono">x = m − p/2</td></tr>
          </tbody>
        </table></div>
        <p style={{ fontSize: 15 }}>Elipsa i hyperbola mají <b>dvě</b> řídicí přímky (každá patří k „svému“ ohnisku, leží na stejné straně od středu). U osy ∥ y zaměň x ↔ y: <M>y = n ± a²/e</M>. U elipsy leží řídicí přímky <b>vně</b> elipsy (<M>a²/e &gt; a</M>), u hyperboly <b>mezi</b> vrcholy (<M>a²/e &lt; a</M>).</p>
        <div className="tip">Když řídicí přímka není rovnoběžná s osou souřadnic (např. <M>x + y = 0</M>), vyjde v rovnici člen <M>xy</M> → pootočená kuželosečka. Postup je stejný, jen u <M>|Pd|</M> nezapomeň dělit <M>√(a² + b²)</M>.</div>
      </Coll>

      <Coll icon="🧮" title="4. Převody: obecný ↔ středový / vrcholový tvar">
        <h4 style={{ margin: "8px 0 4px" }}>Z obecného tvaru do středového / vrcholového (doplnění na čtverec)</h4>
        <p>Postup, který budeš dělat v testu pořád dokola:</p>
        <ol>
          <li>Seskup členy s <M>x</M> a s <M>y</M>; konstantu nech stranou.</li>
          <li>Z každé skupiny vytkni koeficient u druhé mocniny.</li>
          <li>Doplň na čtverec: <M>x² + kx = (x + [[k||2]])² − ([[k||2]])²</M></li>
          <li>Konstanty převeď doprava, vyděl pravou stranou → středový (vrcholový) tvar.</li>
        </ol>
        <div className="entry" style={{ margin: "12px 0" }}>
          <div className="src">Vzor — PL Kuželosečka a přímka 1e</div>
          <Eq>x² − 3y² − 4x + 24y − 32 = 0</Eq>
          <Steps steps={[
            "`(x² − 4x) − 3(y² − 8y) − 32 = 0`",
            "`(x − 2)² − 4 − 3[(y − 4)² − 16] − 32 = 0`",
            "`(x − 2)² − 3(y − 4)² − 4 + 48 − 32 = 0` → `(x − 2)² − 3(y − 4)² = −12`",
            "Vydělím −12: `(y − 4)²/4 − (x − 2)²/12 = 1`",
          ]} />
          <div className="result">hyperbola, S[2; 4], hlavní osa ∥ y, a = 2, b = 2√3, e = 4</div>
        </div>
        <div className="note">Nejčastější chyba: při vytýkání záporného čísla zapomeneš otočit znaménko. <M>−3y² + 24y = −3(y² − 8y)</M>, ne <M>−3(y² + 8y)</M>. A doplněnou konstantu musíš vynásobit vytknutým číslem: <M>−3·(−16) = +48</M>.</div>
        <h4 style={{ margin: "16px 0 4px" }}>Opačně: ze středového tvaru do obecného</h4>
        <ol>
          <li>Vynásob rovnici <b>společným jmenovatelem</b> (u elipsy/hyperboly <M>a²·b²</M>, stačí i nejmenší společný násobek).</li>
          <li>Roznásob závorky: <M>(x − m)² = x² − 2mx + m²</M>.</li>
          <li>Vše převeď na levou stranu, sečti konstanty a uspořádej <M>Ax² + Cy² + Dx + Ey + F = 0</M>.</li>
        </ol>
        <div className="entry" style={{ margin: "12px 0" }}>
          <div className="src">Vzor — elipsa a parabola</div>
          <Steps steps={[
            "`[[(x − 2)²||9]] + [[(y + 1)²||4]] = 1` | ·36 → `4(x − 2)² + 9(y + 1)² = 36`",
            "`4x² − 16x + 16 + 9y² + 18y + 9 − 36 = 0`",
            "`4x² + 9y² − 16x + 18y − 11 = 0`",
            "Parabola: `(x + 3)² = −6(y − 2)` → `x² + 6x + 9 = −6y + 12` → `x² + 6x + 6y − 3 = 0`",
          ]} />
          <div className="result">4x² + 9y² − 16x + 18y − 11 = 0 · x² + 6x + 6y − 3 = 0</div>
        </div>
        <div className="tip">Rychlá kontrola obou směrů: v obecném tvaru musí být u <M>x²</M> a <M>y²</M> stejná znaménka jako ve středovém tvaru (elipsa stejná, hyperbola opačná, parabola jen jeden kvadratický člen).</div>
      </Coll>

      <Coll icon="🔍" title="5. Rozpoznání typu kuželosečky">
        <p>Podívej se na koeficienty <b>A</b> (u <M>x²</M>) a <b>C</b> (u <M>y²</M>). Ty určují „kandidáta“, ale konečné slovo má až pravá strana po doplnění na čtverec.</p>
        <div className="tblWrap"><table className="tbl">
          <thead><tr><th>Koeficienty</th><th>Kandidát</th><th>Po úpravě na <M>A(x−m)² + C(y−n)² = R</M></th></tr></thead>
          <tbody>
            <tr><td className="mono">A = C ≠ 0</td><td><b>kružnice</b></td><td>R/A &gt; 0 kružnice · R = 0 bod · R/A &lt; 0 ∅</td></tr>
            <tr><td className="mono">A·C &gt; 0, A ≠ C</td><td><b>elipsa</b></td><td>R/A &gt; 0 elipsa · R = 0 bod · R/A &lt; 0 ∅</td></tr>
            <tr><td className="mono">A·C &lt; 0</td><td><b>hyperbola</b></td><td>R ≠ 0 hyperbola · R = 0 <b>dvojice různoběžek</b></td></tr>
            <tr><td className="mono">A·C = 0 (jen jeden kvadr. člen)</td><td><b>parabola</b></td><td>je-li lineární člen druhé proměnné ≠ 0 → parabola; chybí-li → 2 rovnoběžky / 1 přímka / ∅</td></tr>
          </tbody>
        </table></div>
        <div className="grid2">
          <div>
            <p><b>Singulární chytáky z PL:</b></p>
            <ul>
              <li><M>x² − 4x − 2y² − 4y + 2 = 0</M> → <M>(x − 2)² − 2(y + 1)² = 0</M> → <b>dvě různoběžky</b> <M>x − 2 = ±√2(y + 1)</M> (PL 1f)</li>
              <li><M>x² + y² + 1 = 0</M> → <b>prázdná množina</b> (PL 2a)</li>
              <li><M>(x − 1)² + (y + 2)² = 0</M> → jediný <b>bod</b> <M>[1; −2]</M></li>
            </ul>
          </div>
          <Graph curves={[{ f: (x, y) => (x - 2) ** 2 - 2 * (y + 1) ** 2 }]} pts={[{ x: 2, y: -1, label: "[2; −1]", r: 3 }]} view={[-3, 7, -6, 4]} caption="PL 1f: dvojice různoběžek" w={260} />
        </div>
        <div className="tip">Rychlá kontrola znamének: když vyjde <M>[[(x−m)²||kladné]] + [[(y−n)²||kladné]] = 1</M> → elipsa; jeden jmenovatel záporný → hyperbola; oba záporné → ∅.</div>
      </Coll>

      <Coll icon="🧾" title="6. Z rovnice vyčíst informace ↔ z informací sestavit rovnici">
        <p><b>Z rovnice → prvky.</b> Nejdřív vždy středový/vrcholový tvar, pak čti:</p>
        <div className="tblWrap"><table className="tbl">
          <thead><tr><th>Kuželosečka</th><th>Co vyčteš</th></tr></thead>
          <tbody>
            <tr><td>kružnice</td><td>střed <M>S[m; n]</M>, poloměr <M>r</M></td></tr>
            <tr><td>elipsa</td><td><M>S</M>; <M>a</M> = odmocnina z <b>většího</b> jmenovatele (určí směr hlavní osy), <M>b</M>; <M>e = √(a² − b²)</M>; hlavní vrcholy <M>A, B</M> (±a), vedlejší <M>C, D</M> (±b), ohniska <M>F₁, F₂</M> (±e); <M>ε = e/a</M>; řídicí přímky</td></tr>
            <tr><td>hyperbola</td><td><M>S</M>; <M>a</M> = odmocnina z jmenovatele u <b>kladného</b> členu; <M>b</M>; <M>e = √(a² + b²)</M>; vrcholy <M>A, B</M>, ohniska <M>F₁, F₂</M>; asymptoty; <M>ε = e/a</M>; řídicí přímky</td></tr>
            <tr><td>parabola</td><td>vrchol <M>V[m; n]</M>; <M>2p</M> = číslo před závorkou → <M>p</M>; směr otevření (znaménko + proměnná v 1. mocnině); ohnisko <M>F</M> (p/2 od V); řídicí přímka <M>d</M> (p/2 za V); osa <M>o</M></td></tr>
          </tbody>
        </table></div>

        <p style={{ marginTop: 14 }}><b>Z prvků → rovnice.</b> Pořád stejná kostra:</p>
        <ol>
          <li><b>Střed / vrchol:</b> střed úsečky <M>AB</M>, <M>F₁F₂</M> nebo <M>CD</M>; u paraboly vrchol leží v polovině mezi <M>F</M> a <M>d</M>.</li>
          <li><b>Směr hlavní osy:</b> v jakém směru leží vrcholy / ohniska vůči středu (stejné <M>y</M> → osa ∥ x).</li>
          <li><b>Délky:</b> <M>a, b, e</M> nebo <M>p</M> ze vzdáleností bodů; chybějící dopočítej z <M>e² = a² − b²</M> (elipsa) / <M>e² = a² + b²</M> (hyperbola). Asymptota dává poměr <M>b/a</M>.</li>
          <li><b>Dosaď</b> do středového tvaru, případně převeď na obecný.</li>
        </ol>
        <div className="entry" style={{ margin: "12px 0" }}>
          <div className="src">Vzor — elipsa s ohnisky F₁[−1; 2], F₂[5; 2] a vrcholem A[−2; 2]</div>
          <Steps steps={[
            "Střed = střed `F₁F₂` = `[2; 2]`; ohniska mají stejné y → hlavní osa ∥ x",
            "`e = |SF₂| = 3`, `a = |SA| = 4` (A leží na hlavní ose)",
            "`b² = a² − e² = 16 − 9 = 7`",
            "`[[(x − 2)²||16]] + [[(y − 2)²||7]] = 1` | ·112 → `7(x − 2)² + 16(y − 2)² = 112`",
            "`7x² + 16y² − 28x − 64y − 20 = 0`",
          ]} />
          <div className="result">(x − 2)²/16 + (y − 2)²/7 = 1</div>
        </div>
        <div className="note">Když zadání nedává směr otevření paraboly (jen V a p), existují <b>dvě</b> řešení (<M>±2p</M>). Napiš obě.</div>
      </Coll>

      <Coll icon="✏️" title="7. Zakreslení do KSS a vyznačení význačných prvků">
        <p>Nikdy nekresli „od oka“ rovnou křivku. Nejdřív převeď rovnici na středový/vrcholový tvar, vypiš prvky a <b>vyznač je</b>, teprve potom protáhni křivku přes vrcholy.</p>
        <div className="grid2" style={{ alignItems: "start" }}>
          <div>
            <h4 style={{ margin: "8px 0 4px" }}>Elipsa</h4>
            <ol style={{ fontSize: 15 }}>
              <li>Střed <M>S</M>, hlavní a vedlejší osa (čárkovaně).</li>
              <li>4 vrcholy: <M>A, B</M> ve vzdálenosti <M>a</M>, <M>C, D</M> ve vzdálenosti <M>b</M>.</li>
              <li>Ohniska <M>F₁, F₂</M> ve vzdálenosti <M>e</M> na hlavní ose. Trik: <M>|CF₁| = a</M>, takže kružítkem z <M>C</M> o poloměru <M>a</M>.</li>
              <li>Hladká oválná křivka přes 4 vrcholy (ve vrcholech je kolmá na osy).</li>
            </ol>
          </div>
          <Graph {...conicGraphProps(analyze(9, 16, -18, 64, -71), { dir: false })} w={280} caption="(x − 1)²/16 + (y + 2)²/9 = 1" />
        </div>
        <div className="grid2" style={{ alignItems: "start", marginTop: 14 }}>
          <div>
            <h4 style={{ margin: "8px 0 4px" }}>Hyperbola</h4>
            <ol style={{ fontSize: 15 }}>
              <li>Střed <M>S</M>, hlavní osa, vrcholy <M>A, B</M> (±a).</li>
              <li><b>Charakteristický obdélník</b> <M>2a × 2b</M> se středem v <M>S</M>; jeho úhlopříčky = <b>asymptoty</b>.</li>
              <li>Ohniska: kružnice se středem <M>S</M> přes rohy obdélníku protne hlavní osu v <M>F₁, F₂</M> (poloměr <M>√(a² + b²) = e</M>).</li>
              <li>Větve začínají ve vrcholech a přimykají se k asymptotám.</li>
            </ol>
          </div>
          <Graph {...conicGraphProps(analyze(1, -4, 2, 8, -7), { dir: false, lines: [vLine(-3, { color: "#c3cbe0" }), vLine(1, { color: "#c3cbe0" }), hLine(0, { color: "#c3cbe0" }), hLine(2, { color: "#c3cbe0" })] })} w={280} caption="(x + 1)²/4 − (y − 1)² = 1 s obdélníkem 2a × 2b" />
        </div>
        <div className="grid2" style={{ alignItems: "start", marginTop: 14 }}>
          <div>
            <h4 style={{ margin: "8px 0 4px" }}>Parabola</h4>
            <ol style={{ fontSize: 15 }}>
              <li>Vrchol <M>V</M>, osa <M>o</M>, směr otevření.</li>
              <li>Ohnisko <M>F</M> ve vzdálenosti <M>p/2</M> od <M>V</M> směrem dovnitř, řídicí přímka <M>d</M> ve vzdálenosti <M>p/2</M> na druhé straně.</li>
              <li>Pomocné body: v úrovni ohniska je parabola široká <M>2p</M> → body <M>F ± p</M> kolmo na osu.</li>
              <li>Křivka přes tyto 3 body, ve vrcholu kolmá na osu.</li>
            </ol>
          </div>
          <Graph {...conicGraphProps(analyze(0, 1, -8, 4, 20), { view: [-2, 10, -8, 4] })} w={280} caption="(y + 2)² = 8(x − 2): V[2; −2], F[4; −2], d: x = 0" />
        </div>
        <div className="tip">Co znamená „vyznačit význačné prvky“: elipsa S, A, B, C, D, F₁, F₂ (+ osy); hyperbola S, A, B, F₁, F₂, asymptoty (+ osa); parabola V, F, d, o; kružnice S, r. Popiš je písmeny i souřadnicemi.</div>
      </Coll>

      <Coll icon="✂️" title="8. Vzájemná poloha přímky a kuželosečky a společné body">
        <p><b>Algoritmus</b> (stejný pro všechny kuželosečky):</p>
        <ol>
          <li>Z rovnice přímky vyjádři jednu proměnnou (tu, která jde snadno, ideálně s koeficientem ±1).</li>
          <li>Dosaď do rovnice kuželosečky, roznásob a uprav na <M>αt² + βt + γ = 0</M>.</li>
          <li>Rozhodni podle diskriminantu <M>D = β² − 4αγ</M>:</li>
        </ol>
        <div className="tblWrap"><table className="tbl">
          <thead><tr><th>Výsledek dosazení</th><th>Počet společných bodů</th><th>Přímka je</th></tr></thead>
          <tbody>
            <tr><td className="mono">kvadratická, D &gt; 0</td><td>2</td><td><b>sečna</b></td></tr>
            <tr><td className="mono">kvadratická, D = 0</td><td>1 (dvojnásobný kořen)</td><td><b>tečna</b></td></tr>
            <tr><td className="mono">kvadratická, D &lt; 0</td><td>0</td><td><b>vnější přímka</b> (nesečna)</td></tr>
            <tr><td className="mono">lineární (α = 0), β ≠ 0</td><td>1</td><td><b>sečna rovnoběžná s asymptotou</b> (hyperbola) / <b>s osou</b> (parabola). <u>Není to tečna!</u></td></tr>
            <tr><td className="mono">0 = nenulové číslo</td><td>0</td><td>u hyperboly: přímka je <b>asymptota</b></td></tr>
          </tbody>
        </table></div>
        <div className="grid2">
          <Graph curves={[{ f: (x, y) => 4 * x * x + y * y - 20 }]} lines={[{ a: 2, b: 1, c: -6 }]} pts={[{ x: 1, y: 4, label: "[1; 4]", color: RED }, { x: 2, y: 2, label: "[2; 2]", color: RED }]} view={[-5, 5, -5.5, 5.5]} caption="PL 4a: sečna" w={240} />
          <Graph curves={[{ f: (x, y) => y * y - 2 * x + 3 }]} lines={[{ a: 1, b: -1, c: -1 }]} pts={[{ x: 2, y: 1, label: "T[2; 1]", color: RED }]} view={[-1, 7, -4, 4]} caption="PL 4c: tečna" w={240} />
          <Graph curves={[{ f: (x, y) => 4 * x * x - y * y - 4 }]} lines={[{ a: 2, b: -1, c: 4 }, { a: 2, b: -1, c: 0, dash: true, color: MUTED }, { a: 2, b: 1, c: 0, dash: true, color: MUTED }]} pts={[{ x: -1.25, y: 1.5, label: "P", color: RED }]} view={[-5, 5, -5, 5]} caption="PL 4d: ∥ s asymptotou → 1 bod, není tečna" w={240} />
        </div>
        <h4 style={{ margin: "14px 0 4px" }}>Společné body</h4>
        <ol>
          <li>Kořeny <M>t₁, t₂</M> kvadratické rovnice dosaď zpátky do vyjádřené proměnné z přímky → druhá souřadnice.</li>
          <li>Zapiš body jako <M>P₁[x₁; y₁]</M>, <M>P₂[x₂; y₂]</M>.</li>
          <li><b>Zkouška:</b> dosaď každý bod do rovnice přímky i kuželosečky.</li>
        </ol>
        <div className="tip">Výraz „tečna“ tu znamená jen výsledek polohy (D = 0, jediný společný bod). Sestavovat rovnice tečen v testu nebudeš.</div>
        <div className="note">Proč „1 bod“ ještě neznamená tečnu: přímka rovnoběžná s osou paraboly (např. <M>y = −4</M> u <M>y² = x</M>, PL Parabola 14d) parabolu „propíchne“ v jednom bodě a pokračuje dovnitř. Tečna se křivky jen dotkne a zůstane celá vně.</div>
      </Coll>

      <Coll icon="⚠️" title="9. Nejčastější chyby v testu">
        <ul>
          <li>U poměru vzdáleností zapomene <b>umocnit ε</b>: z <M>|PF| = [[1||2]]|Pd|</M> je <M>|PF|² = [[1||4]]|Pd|²</M>.</li>
          <li>Obrátí poměr: „od přímky dvakrát dál než od bodu“ je <M>ε = 1/2</M> (elipsa), ne 2.</li>
          <li>U elipsy plete <M>e² = a² − b²</M> s hyperbolou <M>e² = a² + b²</M>.</li>
          <li>U hyperboly bere <M>a</M> jako „větší poloosu“. Správně: <M>a</M> je vždy pod <b>kladným</b> členem.</li>
          <li>U paraboly zapomene, že v rovnici je <M>2p</M>. Ohnisko je od vrcholu <M>p/2</M>, ne <M>p</M>.</li>
          <li>Při převodu do obecného tvaru vynásobí jen jeden zlomek, nebo zapomene vynásobit pravou stranu (<M>= 1</M> → <M>= a²b²</M>).</li>
          <li>Při doplnění na čtverec vytkne záporné číslo a neotočí znaménko uvnitř závorky.</li>
          <li>Na obrázku chybí ohniska nebo asymptoty, nebo jsou vrcholy na špatné ose.</li>
          <li>Po dosazení přímky zapomene roznásobit celou závorku: <M>(2x − 3)² = 4x² − 12x + 9</M>, ne <M>4x² + 9</M>.</li>
          <li>Najde jen <M>x</M> a zapomene dopočítat <M>y</M> společného bodu. Neudělá zkoušku do <b>obou</b> rovnic.</li>
        </ul>
      </Coll>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// ÚLOHY (z pracovních listů + MFF portál)
// ══════════════════════════════════════════════════════════════════
const CATS = [
  { id: "all", t: "Vše" },
  { id: "pomer", t: "⚖️ Poměr vzdáleností" },
  { id: "cteni", t: "🔍 Z rovnice → prvky" },
  { id: "sestaveni", t: "🧩 Z prvků → rovnice" },
  { id: "prevod", t: "🔁 Převody tvarů" },
  { id: "graf", t: "✏️ Zakreslení do KSS" },
  { id: "primka", t: "✂️ Přímka a kuželosečka" },
];

const PROBLEMS = [
  // ───────────── POMĚR VZDÁLENOSTÍ ─────────────
  {
    cat: "pomer", src: "Zadání testu · bod 1", diff: 2,
    task: "Napište rovnici množiny všech bodů `P`, pro které platí daný poměr vzdáleností od bodu `F` a přímky `d`. Určete typ a prvky.",
    formula: "`|PF| = ε·|Pd|` → umocnit → roznásobit → doplnit na čtverec. `ε < 1` elipsa, `ε = 1` parabola, `ε > 1` hyperbola.",
    parts: [
      { l: "a)", q: "`F[3; 0]`, `d: x = 12`, `|PF| : |Pd| = 1 : 2`", steps: [
        "`√((x − 3)² + y²) = [[1||2]]·|x − 12|` | ²",
        "`(x − 3)² + y² = [[1||4]](x − 12)²` | ·4",
        "`4x² − 24x + 36 + 4y² = x² − 24x + 144` → `3x² + 4y² − 108 = 0`",
        "`[[x²||36]] + [[y²||27]] = 1` → `a = 6`, `b = 3√3`, `e = 3`, `ε = 3/6 = 1/2` ✓",
      ], res: "elipsa 3x² + 4y² − 108 = 0, tj. x²/36 + y²/27 = 1", K: [3, 4, 0, 0, -108] },
      { l: "b)", q: "`F[0; 2]`, `d: y = −2`, bod má od F i od d stejnou vzdálenost", steps: [
        "`ε = 1` → parabola. `√(x² + (y − 2)²) = |y + 2|` | ²",
        "`x² + y² − 4y + 4 = y² + 4y + 4`",
        "`x² − 8y = 0` → `x² = 8y`: `V[0; 0]`, `2p = 8`, `p = 4`, otevřená nahoru",
      ], res: "parabola x² = 8y (x² − 8y = 0)", K: [1, 0, 0, -8, 0] },
      { l: "c)", q: "`F[4; 0]`, `d: x = 1`, vzdálenost od F je dvojnásobkem vzdálenosti od d", steps: [
        "`|PF| = 2·|Pd|` → `ε = 2` → hyperbola",
        "`(x − 4)² + y² = 4(x − 1)²`",
        "`x² − 8x + 16 + y² = 4x² − 8x + 4` → `3x² − y² − 12 = 0`",
        "`[[x²||4]] − [[y²||12]] = 1`: `a = 2`, `b = 2√3`, `e = 4`, `ε = 4/2 = 2` ✓, řídicí přímka `x = a²/e = 1` ✓",
      ], res: "hyperbola 3x² − y² − 12 = 0, tj. x²/4 − y²/12 = 1", K: [3, -1, 0, 0, -12] },
      { l: "d)", q: "`F[2; −1]`, `d: x = −4`, `|PF| = |Pd|`", steps: [
        "`(x − 2)² + (y + 1)² = (x + 4)²`",
        "`x² − 4x + 4 + (y + 1)² = x² + 8x + 16` → `(y + 1)² = 12x + 12`",
        "`(y + 1)² = 12(x + 1)`: `V[−1; −1]` (leží v půlce mezi F a d ✓), `p = 6`, otevřená doprava",
        "Obecný tvar: `y² − 12x + 2y − 11 = 0`",
      ], res: "parabola (y + 1)² = 12(x + 1)", K: [0, 1, -12, 2, -11] },
      { l: "e)", q: "`F[1; 4]`, `d: y = 1`, `|PF| : |Pd| = 2 : 1`", steps: [
        "`(x − 1)² + (y − 4)² = 4(y − 1)²`",
        "`(x − 1)² + y² − 8y + 16 = 4y² − 8y + 4` → `(x − 1)² − 3y² + 12 = 0`",
        "`3y² − (x − 1)² = 12` → `[[y²||4]] − [[(x − 1)²||12]] = 1`",
        "Hlavní osa ∥ y: `S[1; 0]`, `a = 2`, `e = 4` → ohnisko `[1; 4]` ✓, `ε = 2` ✓",
        "Obecný tvar: `x² − 3y² − 2x + 13 = 0`",
      ], res: "hyperbola y²/4 − (x − 1)²/12 = 1", K: [1, -3, -2, 0, 13] },
      { l: "f)", q: "`F[1; 2]`, `d: x = −3`, vzdálenost od přímky je dvakrát větší než od bodu F", d: 3, steps: [
        "`|Pd| = 2·|PF|` → `|PF| = [[1||2]]|Pd|` → `ε = 1/2` → elipsa",
        "`4[(x − 1)² + (y − 2)²] = (x + 3)²`",
        "`4x² − 8x + 4 + 4y² − 16y + 16 = x² + 6x + 9` → `3x² + 4y² − 14x − 16y + 11 = 0`",
        "Doplním: `3(x − 7/3)² − 49/3 + 4(y − 2)² − 16 + 11 = 0` → `3(x − 7/3)² + 4(y − 2)² = 64/3`",
        "`[[(x − 7/3)²||64/9]] + [[(y − 2)²||16/3]] = 1`: `a = 8/3`, `e² = 64/9 − 48/9 = 16/9`, `e = 4/3`, `ε = 1/2` ✓",
      ], res: "elipsa 3x² + 4y² − 14x − 16y + 11 = 0, S[7/3; 2]", K: [3, 4, -14, -16, 11] },
    ],
  },
  {
    cat: "pomer", src: "Zadání testu · bod 1 (opačný směr)", diff: 2,
    task: "Určete číselnou výstřednost `ε` a řídicí přímky kuželosečky. Ověřte poměr na jednom vrcholu.",
    formula: "`ε = e/a`, řídicí přímky (osa ∥ x) `x = m ± a²/e`; parabola: `d` je `p/2` za vrcholem.",
    parts: [
      { l: "a)", q: "`[[x²||25]] + [[y²||9]] = 1`", steps: [
        "`a = 5`, `b = 3`, `e = √(25 − 9) = 4`",
        "`ε = 4/5`, řídicí přímky `x = ±25/4`",
        "Ověření ve vrcholu `B[5; 0]`: `|BF₂| = 5 − 4 = 1`, `|Bd₂| = 25/4 − 5 = 5/4` → poměr `1 : 5/4 = 4/5` ✓",
      ], res: "ε = 4/5, d₁,₂: x = ±25/4", K: [9, 25, 0, 0, -225] },
      { l: "b)", q: "`[[x²||9]] − [[y²||16]] = 1`", steps: [
        "`a = 3`, `b = 4`, `e = √(9 + 16) = 5`",
        "`ε = 5/3`, řídicí přímky `x = ±9/5`",
        "Ověření ve vrcholu `B[3; 0]`: `|BF₂| = 5 − 3 = 2`, `|Bd₂| = 3 − 9/5 = 6/5` → `2 : 6/5 = 5/3` ✓",
      ], res: "ε = 5/3, d₁,₂: x = ±9/5", K: [16, -9, 0, 0, -144] },
      { l: "c)", q: "`(y − 1)² = −8(x − 3)`", steps: [
        "`V[3; 1]`, `2p = 8`, `p = 4`, otevřená doleva",
        "`F[3 − 2; 1] = [1; 1]`, řídicí přímka `x = 3 + 2 = 5`, `ε = 1`",
        "Ověření ve vrcholu: `|VF| = 2 = |Vd|` ✓",
      ], res: "ε = 1, F[1; 1], d: x = 5", K: [0, 1, 8, -2, -23] },
    ],
  },

  // ───────────── PŘEVODY ─────────────
  {
    cat: "prevod", src: "Zadání testu · bod 3", diff: 1,
    task: "Převeďte ze středového / vrcholového tvaru na obecný tvar.",
    formula: "Vynásob společným jmenovatelem → roznásob `(x − m)² = x² − 2mx + m²` → vše doleva.",
    parts: [
      { l: "a)", q: "`[[(x − 2)²||9]] + [[(y + 1)²||4]] = 1`", steps: ["·36: `4(x − 2)² + 9(y + 1)² = 36`", "`4x² − 16x + 16 + 9y² + 18y + 9 − 36 = 0`"], res: "4x² + 9y² − 16x + 18y − 11 = 0" },
      { l: "b)", q: "`[[(y − 3)²||4]] − [[(x + 1)²||5]] = 1`", steps: ["·20: `5(y − 3)² − 4(x + 1)² = 20`", "`5y² − 30y + 45 − 4x² − 8x − 4 − 20 = 0`", "`−4x² + 5y² − 8x − 30y + 21 = 0` | ·(−1)"], res: "4x² − 5y² + 8x + 30y − 21 = 0" },
      { l: "c)", q: "`(x + 3)² = −6(y − 2)`", steps: ["`x² + 6x + 9 = −6y + 12`", "Vše doleva: `x² + 6x + 6y + 9 − 12 = 0`"], res: "x² + 6x + 6y − 3 = 0" },
      { l: "d)", q: "`(x − 4)² + (y + 2)² = 10`", steps: ["`x² − 8x + 16 + y² + 4y + 4 − 10 = 0`"], res: "x² + y² − 8x + 4y + 10 = 0" },
    ],
  },
  {
    cat: "prevod", src: "Zadání testu · bod 3", diff: 2,
    task: "Převeďte z obecného tvaru na středový / vrcholový tvar a určete typ.",
    formula: "Seskup, vytkni koeficient u druhé mocniny, doplň na čtverec, konstanty doprava, vyděl pravou stranou.",
    parts: [
      { l: "a)", q: "`4x² + y² + 24x − 2y + 21 = 0`", steps: ["`4(x² + 6x) + (y² − 2y) + 21 = 0`", "`4[(x + 3)² − 9] + [(y − 1)² − 1] + 21 = 0`", "`4(x + 3)² + (y − 1)² = 36 + 1 − 21 = 16`", "Vydělím 16: `[[(x + 3)²||4]] + [[(y − 1)²||16]] = 1`"], res: "elipsa, S[−3; 1], a = 4 (osa ∥ y), b = 2, e = 2√3", K: [4, 1, 24, -2, 21] },
      { l: "b)", q: "`9x² − 4y² − 18x − 16y − 43 = 0`", steps: ["`9(x² − 2x) − 4(y² + 4y) − 43 = 0`", "`9[(x − 1)² − 1] − 4[(y + 2)² − 4] − 43 = 0`", "`9(x − 1)² − 4(y + 2)² = 9 − 16 + 43 = 36`", "Vydělím 36: `[[(x − 1)²||4]] − [[(y + 2)²||9]] = 1`"], res: "hyperbola, S[1; −2], a = 2, b = 3, e = √13", K: [9, -4, -18, -16, -43] },
      { l: "c)", q: "`2y² − 8y + 3x + 2 = 0`", d: 3, steps: ["`2(y² − 4y) + 3x + 2 = 0` → `2[(y − 2)² − 4] + 3x + 2 = 0`", "`2(y − 2)² = −3x + 6 = −3(x − 2)`", "Vydělím 2: `(y − 2)² = −[[3||2]](x − 2)`", "`2p = 3/2` → `p = 3/4`, otevřená doleva; `F[2 − 3/8; 2] = [13/8; 2]`, `d: x = 2 + 3/8 = 19/8`"], res: "parabola, V[2; 2], p = 3/4, F[13/8; 2], d: x = 19/8", K: [0, 2, 3, -8, 2] },
    ],
  },

  // ───────────── ZAKRESLENÍ ─────────────
  {
    cat: "graf", src: "Zadání testu · bod 4", diff: 2,
    task: "Zakreslete kuželosečku do kartézské soustavy souřadnic a vyznačte všechny její význačné prvky.",
    formula: "Středový/vrcholový tvar → vypiš prvky → vyznač body a přímky → teprve pak křivka.",
    parts: [
      { l: "a)", q: "`9x² + 16y² − 18x + 64y − 71 = 0`", steps: ["`9(x − 1)² + 16(y + 2)² = 144` → `[[(x − 1)²||16]] + [[(y + 2)²||9]] = 1`", "`S[1; −2]`, `a = 4` (osa ∥ x), `b = 3`, `e = √7 ≈ 2,65`", "Hlavní vrcholy `A[−3; −2]`, `B[5; −2]`; vedlejší `C[1; 1]`, `D[1; −5]`", "Ohniska `F₁,₂[1 ± √7; −2]` ≈ `[−1,65; −2]`, `[3,65; −2]`"], res: "elipsa: S, A, B, C, D, F₁, F₂ + osy y = −2, x = 1", K: [9, 16, -18, 64, -71] },
      { l: "b)", q: "`x² − 4y² + 2x + 8y − 7 = 0`", steps: ["`(x + 1)² − 4(y − 1)² = 4` → `[[(x + 1)²||4]] − (y − 1)² = 1`", "`S[−1; 1]`, `a = 2`, `b = 1`, `e = √5 ≈ 2,24`, osa ∥ x", "Vrcholy `A[−3; 1]`, `B[1; 1]`, ohniska `F₁,₂[−1 ± √5; 1]`", "Obdélník `x ∈ [−3; 1]`, `y ∈ [0; 2]`; asymptoty `y − 1 = ±[[1||2]](x + 1)`"], res: "hyperbola: S, A, B, F₁, F₂, asymptoty, osa y = 1", K: [1, -4, 2, 8, -7] },
      { l: "c)", q: "`y² + 4y − 8x + 20 = 0`", steps: ["`(y + 2)² = 8x − 16 = 8(x − 2)`", "`V[2; −2]`, `2p = 8`, `p = 4`, otevřená doprava, osa `y = −2`", "`F[4; −2]`, `d: x = 0` (osa y!)", "Pomocné body v úrovni ohniska: `[4; −2 ± 4]` = `[4; 2]`, `[4; −6]`"], res: "parabola: V, F, d: x = 0, osa o: y = −2", K: [0, 1, -8, 4, 20] },
      { l: "d)", q: "`x² + y² − 6x + 2y + 6 = 0`", d: 1, steps: ["`(x − 3)² + (y + 1)² = 9 + 1 − 6 = 4`", "`S[3; −1]`, `r = 2`; body na kružnici `[1; −1]`, `[5; −1]`, `[3; 1]`, `[3; −3]`"], res: "kružnice: S[3; −1], r = 2", K: [1, 1, -6, 2, 6] },
    ],
  },

  // ───────────── Z ROVNICE → PRVKY ─────────────
  {
    cat: "cteni", src: "PL Kuželosečka a přímka · úl. 1", diff: 2,
    task: "Rozhodněte a zdůvodněte, jaké kuželosečky jsou dány následujícími rovnicemi.",
    formula: "Doplnění na čtverec → středový/vrcholový tvar. Kandidáta určí znaménka koeficientů A (u x²) a C (u y²).",
    parts: [
      { l: "a)", q: "`x² − 2y² + 4x + 6y = 0`", steps: [
        "A = 1, C = −2 → A·C < 0 → kandidát hyperbola.",
        "`(x² + 4x) − 2(y² − 3y) = 0`",
        "`(x + 2)² − 4 − 2[(y − 3/2)² − 9/4] = 0`",
        "`(x + 2)² − 2(y − 3/2)² − 4 + 9/2 = 0` → `(x + 2)² − 2(y − 3/2)² = −1/2`",
        "Vynásobím −2: `4(y − 3/2)² − 2(x + 2)² = 1` → `[[(y − 3/2)²||1/4]] − [[(x + 2)²||1/2]] = 1`",
      ], res: "hyperbola, S[−2; 3/2], hlavní osa ∥ y, a = 1/2, b = √2/2",
        graph: { curves: [{ f: (x, y) => x * x - 2 * y * y + 4 * x + 6 * y }], pts: [{ x: -2, y: 1.5, label: "S", r: 3 }], view: [-6, 2, -2.5, 5.5] } },
      { l: "b)", q: "`x² + 4x + 6y = 0`", steps: [
        "Kvadratický je jen člen x² (C = 0) a člen s y nechybí → parabola s osou ∥ y.",
        "`(x + 2)² − 4 + 6y = 0`",
        "`(x + 2)² = −6y + 4 = −6(y − 2/3)`",
        "`2p = 6` → `p = 3`; znaménko − → otevřená dolů. Ohnisko `[−2; 2/3 − 3/2] = [−2; −5/6]`.",
      ], res: "parabola, V[−2; 2/3], p = 3, otevřená dolů",
        graph: { curves: [{ f: (x, y) => x * x + 4 * x + 6 * y }], pts: [{ x: -2, y: 2 / 3, label: "V", r: 3 }], view: [-8, 4, -6, 2] } },
      { l: "c*)", q: "`(x − 2)(y + 3) + 16 = 0`", d: 3, steps: [
        "Roznásobím: `xy + 3x − 2y − 6 + 16 = 0`. Je tam člen `xy` → kuželosečka je pootočená, doplnění na čtverec nefunguje.",
        "Vyjádřím y: `y + 3 = −16/(x − 2)` → `y = −16/(x − 2) − 3`",
        "To je graf nepřímé úměrnosti `y = −16/x` posunutý o 2 doprava a o 3 dolů.",
        "Grafem nepřímé úměrnosti je rovnoosá hyperbola, asymptoty jsou osy souřadnic. Po posunutí: asymptoty `x = 2`, `y = −3`.",
      ], res: "rovnoosá hyperbola se středem S[2; −3], asymptoty x = 2 a y = −3",
        graph: { curves: [{ f: (x, y) => (x - 2) * (y + 3) + 16 }], lines: [{ a: 1, b: 0, c: -2, dash: true, color: MUTED }, { a: 0, b: 1, c: 3, dash: true, color: MUTED }], pts: [{ x: 2, y: -3, label: "S", r: 3 }], view: [-12, 16, -17, 11] } },
      { l: "d)", q: "`2x² + 4x + y² − 8 = 0`", steps: [
        "A = 2, C = 1 → A·C > 0, A ≠ C → kandidát elipsa.",
        "`2(x² + 2x) + y² − 8 = 0` → `2[(x + 1)² − 1] + y² − 8 = 0`",
        "`2(x + 1)² + y² = 10`",
        "Vydělím 10: `[[(x + 1)²||5]] + [[y²||10]] = 1`",
        "Větší jmenovatel je pod y → hlavní osa ∥ y: `a² = 10`, `b² = 5`, `e² = a² − b² = 5`.",
      ], res: "elipsa, S[−1; 0], a = √10, b = √5, e = √5, hlavní osa ∥ y",
        graph: { curves: [{ f: (x, y) => 2 * x * x + 4 * x + y * y - 8 }], pts: [{ x: -1, y: 0, label: "S", r: 3 }], view: [-5, 3, -4, 4] } },
      { l: "e)", q: "`x² − 3y² − 4x + 24y − 32 = 0`", steps: [
        "A = 1, C = −3 → kandidát hyperbola.",
        "`(x² − 4x) − 3(y² − 8y) − 32 = 0`",
        "`(x − 2)² − 4 − 3[(y − 4)² − 16] − 32 = 0`",
        "`(x − 2)² − 3(y − 4)² − 4 + 48 − 32 = 0` → `(x − 2)² − 3(y − 4)² = −12`",
        "Vydělím −12: `[[(y − 4)²||4]] − [[(x − 2)²||12]] = 1`, `e² = 4 + 12 = 16`",
      ], res: "hyperbola, S[2; 4], hlavní osa ∥ y, a = 2, b = 2√3, e = 4",
        graph: { curves: [{ f: (x, y) => x * x - 3 * y * y - 4 * x + 24 * y - 32 }], pts: [{ x: 2, y: 4, label: "S", r: 3 }], view: [-7, 11, -5, 13] } },
      { l: "f)", q: "`x² − 4x − 2y² − 4y + 2 = 0`", steps: [
        "A = 1, C = −2 → kandidát hyperbola.",
        "`(x − 2)² − 4 − 2[(y + 1)² − 1] + 2 = 0`",
        "`(x − 2)² − 2(y + 1)² − 4 + 2 + 2 = 0` → `(x − 2)² − 2(y + 1)² = 0`",
        "Pravá strana je 0 → rozklad podle `a² − b² = (a − b)(a + b)`: `[(x − 2) − √2(y + 1)]·[(x − 2) + √2(y + 1)] = 0`",
        "Součin je 0, když je 0 aspoň jedna závorka → dvě přímky, které se protínají v [2; −1].",
      ], res: "dvojice různoběžek x − 2 = ±√2(y + 1), singulární kuželosečka",
        graph: { curves: [{ f: (x, y) => (x - 2) ** 2 - 2 * (y + 1) ** 2 }], pts: [{ x: 2, y: -1, r: 3 }], view: [-3, 7, -6, 4] } },
    ],
  },
  {
    cat: "sestaveni", src: "PL Kuželosečka a přímka · úl. 2", diff: 1,
    task: "Napište rovnici nějaké a) prázdné množiny, b) kružnice.",
    parts: [
      { l: "a)", q: "prázdná množina", steps: [
        "Potřebuju rovnici, kterou nesplní žádný bod: součet druhých mocnin (≥ 0) se má rovnat zápornému číslu.",
        "`x² + y² = −1` ⇔ `x² + y² + 1 = 0`",
        "Levá strana je vždy ≥ 1 > 0 → žádné řešení.",
      ], res: "např. x² + y² + 1 = 0" },
      { l: "b)", q: "kružnice", steps: [
        "Zvolím střed a poloměr, třeba `S[1; −2]`, `r = 3`: `(x − 1)² + (y + 2)² = 9`",
        "Roznásobím: `x² − 2x + 1 + y² + 4y + 4 − 9 = 0`",
        "Pozor na chyták: `x² + y² − 2x + 4y + 5 = 0` by byl jen bod [1; −2], protože vyjde `(x − 1)² + (y + 2)² = 0`.",
      ], res: "např. x² + y² − 2x + 4y − 4 = 0" },
    ],
  },
  {
    cat: "cteni", src: "MFF portál · Úlohy III", diff: 2,
    task: "Určete typ kuželosečky a její charakteristické prvky.",
    parts: [
      { l: "1)", q: "`y² − 8y − 4x + 36 = 0`", steps: [
        "Kvadratický je jen `y²` → parabola s osou ∥ x.",
        "`(y − 4)² − 16 − 4x + 36 = 0` → `(y − 4)² = 4x − 20 = 4(x − 5)`",
        "`2p = 4` → `p = 2`, otevřená doprava; ohnisko je `p/2 = 1` od vrcholu.",
      ], res: "parabola, V[5; 4], F[6; 4], d: x = 4" },
      { l: "2)", q: "`9x² − 54x + 4y² + 40y + 145 = 0`", steps: [
        "A = 9, C = 4 → elipsa.",
        "`9(x − 3)² − 81 + 4(y + 5)² − 100 + 145 = 0` → `9(x − 3)² + 4(y + 5)² = 36`",
        "`[[(x − 3)²||4]] + [[(y + 5)²||9]] = 1` → hlavní osa ∥ y, `a = 3`, `b = 2`, `e² = 9 − 4 = 5`",
      ], res: "elipsa, S[3; −5], a = 3, b = 2, e = √5" },
      { l: "3)", q: "`x² + 8x − 4y² − 8y − 4 = 0`", steps: [
        "A = 1, C = −4 → hyperbola.",
        "`(x + 4)² − 16 − 4[(y + 1)² − 1] − 4 = 0` → `(x + 4)² − 4(y + 1)² = 16`",
        "`[[(x + 4)²||16]] − [[(y + 1)²||4]] = 1`, `e² = 16 + 4 = 20`",
      ], res: "hyperbola, S[−4; −1], a = 4, b = 2, e = 2√5, osa ∥ x" },
      { l: "4)", q: "`x² − 4x + y² + 2y − 11 = 0`", steps: [
        "A = C = 1 → kružnice.",
        "`(x − 2)² − 4 + (y + 1)² − 1 − 11 = 0` → `(x − 2)² + (y + 1)² = 16`",
      ], res: "kružnice, S[2; −1], r = 4" },
    ],
  },

  // ───────────── PŘÍMKA ─────────────
  {
    cat: "primka", src: "PL Kuželosečka a přímka · úl. 4", diff: 2,
    task: "Vyšetřete vzájemnou polohu přímky `p` a kuželosečky.",
    formula: "Vyjádři z přímky jednu proměnnou → dosaď → kvadratická rovnice → diskriminant. Pozor, když se kvadratické členy odečtou (lineární rovnice)!",
    parts: [
      { l: "a)", q: "`p: 2x + y − 6 = 0`, `4x² + y² = 20`", steps: [
        "Z přímky: `y = 6 − 2x`",
        "Dosadím: `4x² + (6 − 2x)² = 20`",
        "`4x² + 36 − 24x + 4x² − 20 = 0` → `8x² − 24x + 16 = 0` → `x² − 3x + 2 = 0`",
        "`D = 9 − 8 = 1 > 0` → sečna",
        "`x₁ = 1 → y₁ = 4`; `x₂ = 2 → y₂ = 2`. Zkouška: `4 + 16 = 20` ✓, `16 + 4 = 20` ✓",
      ], res: "sečna, P₁[1; 4], P₂[2; 2]",
        graph: { curves: [{ f: (x, y) => 4 * x * x + y * y - 20 }], lines: [{ a: 2, b: 1, c: -6 }], pts: [{ x: 1, y: 4, label: "P₁", color: RED }, { x: 2, y: 2, label: "P₂", color: RED }], view: [-5, 5, -5.5, 5.5] } },
      { l: "b)", q: "`p: 3x − y − 5 = 0`, `2x² − y² − 2x − 5 = 0`", steps: [
        "Z přímky: `y = 3x − 5`",
        "Dosadím: `2x² − (3x − 5)² − 2x − 5 = 0`",
        "`2x² − 9x² + 30x − 25 − 2x − 5 = 0` → `−7x² + 28x − 30 = 0` → `7x² − 28x + 30 = 0`",
        "`D = 28² − 4·7·30 = 784 − 840 = −56 < 0`",
      ], res: "vnější přímka, žádný společný bod",
        graph: { curves: [{ f: (x, y) => 2 * x * x - y * y - 2 * x - 5 }], lines: [{ a: 3, b: -1, c: -5 }], view: [-6, 6, -6, 6] } },
      { l: "c)", q: "`p: x − y − 1 = 0`, `y² − 2x + 3 = 0`", steps: [
        "Z přímky: `x = y + 1`",
        "Dosadím: `y² − 2(y + 1) + 3 = 0` → `y² − 2y + 1 = 0`",
        "`D = 4 − 4 = 0` → dvojnásobný kořen `y = 1`, `x = 2`",
        "Parabola `y² = 2(x − 3/2)` má osu ∥ x. Přímka má směr `(1; 1)`, s osou rovnoběžná není → je to opravdu tečna.",
      ], res: "tečna, T[2; 1]",
        graph: { curves: [{ f: (x, y) => y * y - 2 * x + 3 }], lines: [{ a: 1, b: -1, c: -1 }], pts: [{ x: 2, y: 1, label: "T", color: RED }], view: [-1, 7, -4, 4] } },
      { l: "d)", q: "`p: 2x − y + 4 = 0`, `4x² − y² − 4 = 0`", d: 3, steps: [
        "Z přímky: `y = 2x + 4`",
        "Dosadím: `4x² − (2x + 4)² − 4 = 0`",
        "`4x² − 4x² − 16x − 16 − 4 = 0` → `−16x − 20 = 0`. Kvadratické členy se odečetly!",
        "Lineární rovnice → jediný bod: `x = −5/4`, `y = 2·(−5/4) + 4 = 3/2`",
        "Hyperbola `x² − y²/4 = 1` má asymptoty `y = ±2x`. Přímka `y = 2x + 4` je s asymptotou rovnoběžná → není to tečna.",
      ], res: "1 společný bod P[−5/4; 3/2], sečna ∥ s asymptotou",
        graph: { curves: [{ f: (x, y) => 4 * x * x - y * y - 4 }], lines: [{ a: 2, b: -1, c: 4 }, { a: 2, b: -1, c: 0, dash: true, color: MUTED }, { a: 2, b: 1, c: 0, dash: true, color: MUTED }], pts: [{ x: -1.25, y: 1.5, label: "P", color: RED }], view: [-5, 5, -5, 5] } },
    ],
  },
  {
    cat: "primka", src: "PL Elipsa · úl. 15", diff: 1,
    task: "Určete vzájemnou polohu přímky `p` a elipsy `E` (společné body neurčujte).",
    parts: [
      { l: "a)", q: "`p: y = x + 1`, `E: 2x² + 3y² = 6`", steps: ["`2x² + 3(x + 1)² = 6`", "`2x² + 3x² + 6x + 3 − 6 = 0` → `5x² + 6x − 3 = 0`", "`D = 36 + 60 = 96 > 0`"], res: "sečna" },
      { l: "b)", q: "`p: x + 3y + 6 = 0`, `E: x² + 9y² = 18`", steps: ["`x = −3y − 6`", "`(3y + 6)² + 9y² = 18` → `9y² + 36y + 36 + 9y² − 18 = 0`", "`18y² + 36y + 18 = 0` → `y² + 2y + 1 = 0`, `D = 0`"], res: "tečna (T[−3; −1])" },
      { l: "c)", q: "`p: y = x + 5`, `E: x² + 2y² = 4`", steps: ["`x² + 2(x + 5)² = 4`", "`x² + 2x² + 20x + 50 − 4 = 0` → `3x² + 20x + 46 = 0`", "`D = 400 − 552 = −152 < 0`"], res: "vnější přímka" },
      { l: "d)", q: "`p: x − y − 3 = 0`, `E: 2x² + 3y² = 6`", steps: ["`y = x − 3`", "`2x² + 3(x − 3)² = 6` → `5x² − 18x + 21 = 0`", "`D = 324 − 420 = −96 < 0`"], res: "vnější přímka" },
    ],
  },
  {
    cat: "primka", src: "PL Elipsa · úl. 16", diff: 2,
    task: "Vypočítejte souřadnice společných bodů přímky `p` a elipsy `E`.",
    parts: [
      { l: "a)", q: "`p: y = 2x + 1`, `E: x² + 9y² = 9`", steps: [
        "`x² + 9(2x + 1)² = 9`",
        "`x² + 36x² + 36x + 9 − 9 = 0` → `37x² + 36x = 0` → `x(37x + 36) = 0`",
        "`x₁ = 0 → y₁ = 1`",
        "`x₂ = −36/37 → y₂ = −72/37 + 1 = −35/37`",
      ], res: "M₁[0; 1], M₂[−36/37; −35/37]" },
      { l: "b)", q: "`p: 2x + 3y − 7 = 0`, `E: x² + 3y² = 7`", steps: [
        "`x = (7 − 3y)/2`",
        "`(7 − 3y)²/4 + 3y² = 7` | ·4 → `49 − 42y + 9y² + 12y² − 28 = 0`",
        "`21y² − 42y + 21 = 0` → `(y − 1)² = 0` → `D = 0`",
        "`y = 1`, `x = (7 − 3)/2 = 2`",
      ], res: "jediný bod T[2; 1], přímka je tečna" },
    ],
  },
  {
    cat: "primka", src: "PL Hyperbola · úl. 10", diff: 2,
    task: "Rozhodněte o vzájemné poloze hyperboly `h` a přímky `p` a určete souřadnice jejich společných bodů.",
    parts: [
      { l: "a)", q: "`h: 9x² − y² = 9`, `p: y = 1`", steps: ["`9x² − 1 = 9` → `x² = 10/9`", "`x = ±√10/3`", "Přímka `y = 1` není rovnoběžná s asymptotami `y = ±3x`."], res: "sečna, P[√10/3; 1], Q[−√10/3; 1]" },
      { l: "b)", q: "`h: x² − y² = 36`, `p: x + y − 2 = 0`", steps: ["`y = 2 − x`", "`x² − (2 − x)² = 36` → `x² − 4 + 4x − x² = 36`", "`4x = 40` → `x = 10`, `y = −8`. Rovnice vyšla lineární!", "Směrnice přímky −1 = směrnice asymptoty `y = −x` → přímka je rovnoběžná s asymptotou."], res: "1 bod P[10; −8], sečna ∥ s asymptotou" },
      { l: "c)", q: "`h: x² − y² = 9`, `p: y = 1,25x − 2,25`", steps: ["`y = (5x − 9)/4`", "`x² − (5x − 9)²/16 = 9` | ·16 → `16x² − 25x² + 90x − 81 = 144`", "`−9x² + 90x − 225 = 0` → `x² − 10x + 25 = 0` → `(x − 5)² = 0`", "`D = 0` → `x = 5`, `y = 4`"], res: "tečna, T[5; 4]" },
      { l: "d)", q: "`h: 4x² − 25y² = 100`, `p: 2x − y − 3 = 0`", steps: ["`y = 2x − 3`", "`4x² − 25(4x² − 12x + 9) = 100` → `−96x² + 300x − 325 = 0`", "`D = 300² − 4·96·325 = 90 000 − 124 800 < 0`"], res: "vnější přímka" },
      { l: "e)", q: "`h: 3x² − y² − 3 = 0`, `p: x − y + 1 = 0`", steps: ["`y = x + 1`", "`3x² − (x + 1)² − 3 = 0` → `2x² − 2x − 4 = 0` → `x² − x − 2 = 0`", "`x₁ = 2 → y₁ = 3`; `x₂ = −1 → y₂ = 0`"], res: "sečna, P[2; 3], Q[−1; 0]" },
      { l: "f)", q: "`h: 4x² − y² = 16`, `p: 2x + y + 4 = 0`", steps: ["`y = −2x − 4`", "`4x² − (2x + 4)² = 16` → `−16x − 16 = 16`", "`x = −2`, `y = 0`, rovnice je lineární", "Asymptoty `y = ±2x`; přímka má směrnici −2 → ∥ s asymptotou."], res: "1 bod P[−2; 0], sečna ∥ s asymptotou" },
      { l: "g)", q: "`h: 4x² − 9y² − 24x + 36y − 36 = 0`, `p: 2x − 3y = 0`", d: 3, steps: [
        "Upravím hyperbolu: `4(x − 3)² − 36 − 9(y − 2)² + 36 − 36 = 0` → `4(x − 3)² − 9(y − 2)² = 36`, S[3; 2]",
        "Asymptoty: `y − 2 = ±(2/3)(x − 3)`. Pro + vyjde `y = (2/3)x`.",
        "Přímka `p: y = (2/3)x` je tedy přímo asymptota!",
        "Kontrola dosazením: `4x² − 9·(4/9)x² − 24x + 36·(2/3)x − 36 = 0` → `−36 = 0` → spor.",
      ], res: "žádný společný bod, přímka je asymptota",
        graph: { curves: [{ f: (x, y) => 4 * x * x - 9 * y * y - 24 * x + 36 * y - 36 }], lines: [{ a: 2, b: -3, c: 0 }, { a: 2, b: 3, c: -12, dash: true, color: MUTED }], view: [-6, 12, -7, 11] } },
    ],
  },
  {
    cat: "primka", src: "PL Parabola · úl. 14", diff: 1,
    task: "Rozhodněte o vzájemné poloze paraboly `p: y² = x` a přímky `q` a určete souřadnice jejich společných bodů.",
    parts: [
      { l: "a)", q: "`q: x − y − 2 = 0`", steps: ["`x = y + 2`", "`y² = y + 2` → `y² − y − 2 = 0`", "`y₁ = 2 → x₁ = 4`; `y₂ = −1 → x₂ = 1`"], res: "sečna, P[4; 2], Q[1; −1]" },
      { l: "b)", q: "`q: x − 2y + 1 = 0`", steps: ["`x = 2y − 1`", "`y² − 2y + 1 = 0` → `D = 0`, `y = 1`, `x = 1`", "Osa paraboly je osa x, přímka s ní není rovnoběžná → tečna."], res: "tečna, T[1; 1]" },
      { l: "c)", q: "`q: 2x + y + 1 = 0`", steps: ["`x = −(y + 1)/2`", "`y² = −(y + 1)/2` → `2y² + y + 1 = 0`", "`D = 1 − 8 = −7 < 0`"], res: "vnější přímka, ∅" },
      { l: "d)", q: "`q: y + 4 = 0`", d: 2, steps: ["`y = −4` → `16 = x`", "Jediné řešení, ale rovnice byla lineární: přímka `y = −4` je rovnoběžná s osou paraboly (osou x)."], res: "1 bod P[16; −4], sečna ∥ s osou (není tečna)",
        graph: { curves: [{ f: (x, y) => y * y - x }], lines: [{ a: 0, b: 1, c: 4 }], pts: [{ x: 16, y: -4, label: "P", color: RED }], view: [-2, 20, -8, 8] } },
    ],
  },
  {
    cat: "primka", src: "MFF portál · příklady 5.11, 5.15–5.16, 5.21, úlohy", diff: 2,
    task: "Vyšetřete vzájemnou polohu přímky a kuželosečky.",
    parts: [
      { l: "a)", q: "`p: x − 3y + 1 = 0`, `E: [[x²||4]] + y² = 1`", steps: ["`x = 3y − 1`", "`(3y − 1)²/4 + y² = 1` | ·4 → `9y² − 6y + 1 + 4y² − 4 = 0`", "`13y² − 6y − 3 = 0`", "`D = 36 + 156 = 192 > 0`"], res: "sečna" },
      { l: "b)", q: "`p: x = 3 + t, y = 2 − 2t` (parametricky), elipsa `[[x²||4]] + [[y²||9]] = 1`", steps: ["Parametrickou přímku dosadím rovnou: `(3 + t)²/4 + (2 − 2t)²/9 = 1` | ·36", "`9(9 + 6t + t²) + 4(4 − 8t + 4t²) = 36`", "`25t² + 22t + 61 = 0`", "`D = 484 − 6100 = −5616 < 0`"], res: "vnější přímka" },
      { l: "c)", q: "`r: −x + 2y + 2 = 0`, parabola `(y − 1)² = −4x`", steps: ["`x = 2y + 2`", "`(y − 1)² = −8y − 8` → `y² + 6y + 9 = 0` → `D = 0`", "`y = −3`, `x = −4`", "Normála přímky `(−1; 2)`, osa paraboly má směr `(1; 0)` → přímka s osou není rovnoběžná."], res: "tečna, T[−4; −3]" },
      { l: "d)", q: "`3x − y + 1 = 0` a parabola `x² + 4x − 4y + 16 = 0`, určete i ohnisko a řídicí přímku", steps: ["`(x + 2)² = 4y − 12 = 4(y − 3)` → V[−2; 3], `2p = 4`, `p = 2`", "Ohnisko `[−2; 3 + 1] = [−2; 4]`, řídicí přímka `y = 2` (na webu MFF jsou tu chybně hodnoty [−2; 5] a y = 1)", "`y = 3x + 1`: `x² + 4x − 12x − 4 + 16 = 0` → `x² − 8x + 12 = 0`", "`x₁ = 2 → y₁ = 7`, `x₂ = 6 → y₂ = 19`"], res: "F[−2; 4], d: y = 2; sečna, P₁[2; 7], P₂[6; 19]" },
      { l: "e)", q: "`4x − 15y − 4 = 0`, hyperbola `[[(x − 1)²||81]] − [[y²||9]] = 1`", d: 3, steps: ["`x = (15y + 4)/4` → `x − 1 = 15y/4`", "`[[225y²/16||81]] − [[y²||9]] = 1` | ·1296 → `225y² − 144y² = 1296`", "`81y² = 1296` → `y² = 16` → `y = ±4`", "`y = 4 → x = 16`; `y = −4 → x = −14`"], res: "sečna, P₁[16; 4], P₂[−14; −4]" },
    ],
  },

  // ───────────── ELIPSA ─────────────
  {
    cat: "sestaveni", src: "PL Elipsa · úl. 1", diff: 1,
    task: "Napište osovou rovnici elipsy, která má hlavní osu v ose x a vedlejší osu v ose y.",
    formula: "`[[x²||a²]] + [[y²||b²]] = 1`, `e² = a² − b²`",
    parts: [
      { l: "a)", q: "`a = 6, b = 4`", steps: ["Dosadím přímo: `a² = 36`, `b² = 16`"], res: "x²/36 + y²/16 = 1" },
      { l: "e)", q: "`a = 13, e = 5`", steps: ["`b² = a² − e² = 169 − 25 = 144`"], res: "x²/169 + y²/144 = 1" },
      { l: "g)", q: "`b = 9, e = 40`", steps: ["`a² = b² + e² = 81 + 1600 = 1681`"], res: "x²/1681 + y²/81 = 1" },
      { l: "i)", q: "`a + b = 23, e = 15`", d: 3, steps: ["`a² − b² = e² = 225` → `(a − b)(a + b) = 225`", "S `a + b = 23` vyjde `a − b = 225/23`, což nevede na výsledek v listu.", "Výsledek v listu `x²/289 + y²/64` odpovídá `a + b = 25`: `a − b = 9` → `a = 17`, `b = 8`. V zadání je nejspíš překlep."], res: "x²/289 + y²/64 = 1 (pro a + b = 25)" },
      { l: "j)", q: "`a + b = 7, e = √21`", d: 2, steps: ["`a² − b² = 21` → `(a − b)(a + b) = 21` → `a − b = 3`", "Soustava `a + b = 7`, `a − b = 3` → `a = 5`, `b = 2`"], res: "x²/25 + y²/4 = 1" },
      { l: "k)", q: "`a − b = 2, e = 4`", d: 2, steps: ["`(a − b)(a + b) = 16` → `a + b = 8`", "`a = 5`, `b = 3`"], res: "x²/25 + y²/9 = 1" },
      { l: "l)", q: "`a − b = 3, e = √33`", d: 2, steps: ["`(a − b)(a + b) = 33` → `a + b = 11`", "`a = 7`, `b = 4`"], res: "x²/49 + y²/16 = 1" },
    ],
  },
  {
    cat: "cteni", src: "PL Elipsa · úl. 2", diff: 1,
    task: "Určete souřadnice vrcholů a ohnisek elipsy.",
    parts: [
      { l: "a)", q: "`[[x²||16]] + [[y²||9]] = 1`", steps: ["`a = 4`, `b = 3`, `e = √(16 − 9) = √7`, hlavní osa = osa x"], res: "A[−4; 0], B[4; 0], C[0; 3], D[0; −3], F₁,₂[±√7; 0]" },
      { l: "d)", q: "`x² + 49y² = 49`", steps: ["Vydělím 49: `[[x²||49]] + [[y²||1]] = 1`", "`a = 7`, `b = 1`, `e² = 48` → `e = 4√3`"], res: "A,B[±7; 0], C,D[0; ±1], F₁,₂[±4√3; 0]" },
      { l: "h)", q: "`36x² + 11y² = 396`", d: 2, steps: ["Vydělím 396: `[[x²||11]] + [[y²||36]] = 1`", "Větší jmenovatel je pod y → hlavní osa = osa y: `a = 6`, `b = √11`, `e = √(36 − 11) = 5`"], res: "A,B[0; ±6], C,D[±√11; 0], F₁,₂[0; ±5]" },
    ],
  },
  {
    cat: "sestaveni", src: "PL Elipsa · úl. 4–11", diff: 2,
    task: "Napište obecnou rovnici elipsy z daných prvků.",
    formula: "Najdi S, a, b (e² = a² − b²) → středový tvar → vynásob společným jmenovatelem → roznásob.",
    parts: [
      { l: "4a)", q: "`S[1; −4]`, `a = 6`, `b = 2`, `oₐ ∥ x`", steps: ["`[[(x − 1)²||36]] + [[(y + 4)²||4]] = 1` | ·36", "`(x − 1)² + 9(y + 4)² = 36`", "`x² − 2x + 1 + 9y² + 72y + 144 − 36 = 0`"], res: "x² + 9y² − 2x + 72y + 109 = 0" },
      { l: "5a)", q: "`S[0; 6]`, `a = 5`, `e = 4`, `oₐ ∥ x`", steps: ["`b² = 25 − 16 = 9`", "`[[x²||25]] + [[(y − 6)²||9]] = 1` | ·225 → `9x² + 25(y − 6)² = 225`", "`9x² + 25y² − 300y + 900 − 225 = 0`"], res: "9x² + 25y² − 300y + 675 = 0" },
      { l: "6a)", q: "dotýká se souřadnicových os ve vrcholech, `S[3; 2]`", steps: ["Vzdálenost S od osy y je 3 → poloosa ve směru x je 3; od osy x je 2 → poloosa ve směru y je 2", "`[[(x − 3)²||9]] + [[(y − 2)²||4]] = 1` | ·36 → `4(x − 3)² + 9(y − 2)² = 36`", "`4x² − 24x + 36 + 9y² − 36y + 36 − 36 = 0`"], res: "4x² + 9y² − 24x − 36y + 36 = 0" },
      { l: "6c)", q: "dotýká se os ve vrcholech, `S[2; −4]`", steps: ["Poloosa ve směru x: 2, ve směru y: 4 (hlavní osa ∥ y)", "`[[(x − 2)²||4]] + [[(y + 4)²||16]] = 1` | ·16 → `4(x − 2)² + (y + 4)² = 16`", "`4x² − 16x + 16 + y² + 8y + 16 − 16 = 0`"], res: "4x² + y² − 16x + 8y + 16 = 0" },
      { l: "7a)", q: "hlavní vrcholy `A[1; 3]`, `B[7; 3]`, `b = 2`", steps: ["S = střed AB = [4; 3], `a = |AB|/2 = 3`", "`[[(x − 4)²||9]] + [[(y − 3)²||4]] = 1` | ·36 → `4(x − 4)² + 9(y − 3)² = 36`", "`4x² − 32x + 64 + 9y² − 54y + 81 − 36 = 0`"], res: "4x² + 9y² − 32x − 54y + 109 = 0" },
      { l: "8a)", q: "hlavní vrcholy `A[−5; 4]`, `B[7; 4]`, `e = 4`", steps: ["S[1; 4], `a = 6`, `b² = 36 − 16 = 20`", "`[[(x − 1)²||36]] + [[(y − 4)²||20]] = 1` | ·180 → `5(x − 1)² + 9(y − 4)² = 180`", "`5x² − 10x + 5 + 9y² − 72y + 144 − 180 = 0`"], res: "5x² + 9y² − 10x − 72y − 31 = 0" },
      { l: "9a)", q: "vedlejší vrcholy `C[7; −1]`, `D[7; 7]`, `a = 8`", steps: ["S = střed CD = [7; 3], `b = |CD|/2 = 4`; vedlejší osa ∥ y → hlavní ∥ x", "`[[(x − 7)²||64]] + [[(y − 3)²||16]] = 1` | ·64 → `(x − 7)² + 4(y − 3)² = 64`", "`x² − 14x + 49 + 4y² − 24y + 36 − 64 = 0`"], res: "x² + 4y² − 14x − 24y + 21 = 0" },
      { l: "10a)", q: "ohniska `F₁[0; 2]`, `F₂[8; 2]`, `a = 5`", steps: ["S[4; 2], `e = 4`, `b² = 25 − 16 = 9`", "`[[(x − 4)²||25]] + [[(y − 2)²||9]] = 1` | ·225 → `9(x − 4)² + 25(y − 2)² = 225`", "`9x² − 72x + 144 + 25y² − 100y + 100 − 225 = 0`"], res: "9x² + 25y² − 72x − 100y + 19 = 0" },
      { l: "11a)", q: "ohniska `F₁[−9; 6]`, `F₂[−1; 6]`, `b = 1`", steps: ["S[−5; 6], `e = 4`, `a² = b² + e² = 17`", "`[[(x + 5)²||17]] + (y − 6)² = 1` | ·17 → `(x + 5)² + 17(y − 6)² = 17`", "`x² + 10x + 25 + 17y² − 204y + 612 − 17 = 0`"], res: "x² + 17y² + 10x − 204y + 620 = 0" },
    ],
  },

  // ───────────── HYPERBOLA ─────────────
  {
    cat: "sestaveni", src: "PL Hyperbola · úl. 1–2", diff: 1,
    task: "Napište osovou rovnici hyperboly (hlavní osa v ose x, resp. v ose y).",
    formula: "osa x: `[[x²||a²]] − [[y²||b²]] = 1` · osa y: `[[y²||a²]] − [[x²||b²]] = 1` · `e² = a² + b²`",
    parts: [
      { l: "1a)", q: "osa x, `a = 2, b = 3`", steps: ["Dosadím přímo (b smí být větší než a!)"], res: "x²/4 − y²/9 = 1" },
      { l: "1d)", q: "osa x, `a = √13, e = 7`", steps: ["`b² = e² − a² = 49 − 13 = 36`"], res: "x²/13 − y²/36 = 1" },
      { l: "1e)", q: "osa x, `b = 8, e = 17`", steps: ["`a² = 289 − 64 = 225`"], res: "x²/225 − y²/64 = 1" },
      { l: "1f)", q: "osa x, `b = 3, e = √13`", steps: ["`a² = 13 − 9 = 4`"], res: "x²/4 − y²/9 = 1" },
      { l: "2a)", q: "osa y, `a = 6, b = 5`", steps: ["Kladný člen je s y, pod ním `a² = 36`"], res: "−x²/25 + y²/36 = 1" },
      { l: "2d)", q: "osa y, `a = √5, e = 3`", steps: ["`b² = 9 − 5 = 4`"], res: "−x²/4 + y²/5 = 1" },
    ],
  },
  {
    cat: "cteni", src: "PL Hyperbola · úl. 5", diff: 1,
    task: "Určete vrcholy, ohniska a rovnice asymptot hyperboly.",
    parts: [
      { l: "a)", q: "`[[x²||9]] − [[y²||4]] = 1`", steps: ["`a = 3`, `b = 2`, `e = √13`, osa x", "Asymptoty `y = ±(b/a)x`"], res: "A,B[±3; 0], F₁,₂[±√13; 0], y = ±(2/3)x",
        graph: { curves: [{ f: fHy(0, 0, 9, 4) }], lines: [{ a: 2, b: -3, c: 0, dash: true, color: MUTED }, { a: 2, b: 3, c: 0, dash: true, color: MUTED }], pts: [{ x: -Math.sqrt(13), y: 0, label: "F₁", color: RED }, { x: Math.sqrt(13), y: 0, label: "F₂", color: RED }], view: [-7, 7, -5, 5] } },
      { l: "c)", q: "`[[x²||36]] − [[y²||16]] = 1`", steps: ["`a = 6`, `b = 4`, `e² = 52` → `e = 2√13`", "`b/a = 4/6 = 2/3`"], res: "A,B[±6; 0], F₁,₂[±2√13; 0], y = ±(2/3)x" },
      { l: "e)", q: "`−[[x²||16]] + [[y²||49]] = 1`", d: 2, steps: ["Kladný člen je s y → hlavní osa = osa y, `a = 7`, `b = 4`, `e = √65`", "Pro osu y jsou asymptoty `y = ±(a/b)x`"], res: "A,B[0; ±7], F₁,₂[0; ±√65], y = ±(7/4)x" },
    ],
  },
  {
    cat: "sestaveni", src: "PL Hyperbola · úl. 6–8", diff: 2,
    task: "Napište obecnou rovnici hyperboly z daných prvků.",
    parts: [
      { l: "6a)", q: "rovnoosá, střed v počátku, osa x, `a = 1,5`", steps: ["Rovnoosá → `a = b`: `x² − y² = 2,25`", "·4 → `4x² − 4y² = 9`"], res: "4x² − 4y² − 9 = 0" },
      { l: "6c)", q: "rovnoosá, střed v počátku, `e = 32`", steps: ["`e² = a² + b² = 2a²` → `a² = 1024/2 = 512`"], res: "x² − y² − 512 = 0" },
      { l: "7a)", q: "vrcholy `A[−5; 4]`, `B[7; 4]`, `e = √40`", steps: ["S[1; 4], `a = 6`, `b² = 40 − 36 = 4`", "`[[(x − 1)²||36]] − [[(y − 4)²||4]] = 1` | ·36 → `(x − 1)² − 9(y − 4)² = 36`", "`x² − 2x + 1 − 9y² + 72y − 144 − 36 = 0`"], res: "x² − 9y² − 2x + 72y − 179 = 0" },
      { l: "7b)", q: "vrcholy `A[−2; 0]`, `B[−2; 8]`, `e = 10`", d: 3, steps: ["S[−2; 4], `a = 4`, hlavní osa ∥ y, `b² = 100 − 16 = 84`", "`[[(y − 4)²||16]] − [[(x + 2)²||84]] = 1` | ·336 → `21(y − 4)² − 4(x + 2)² = 336`", "`21y² − 168y + 336 − 4x² − 16x − 16 − 336 = 0` | ·(−1)"], res: "4x² − 21y² + 16x + 168y + 16 = 0" },
      { l: "8a)", q: "ohniska `F₁[−2; 2]`, `F₂[8; 2]`, `a = 4`", steps: ["S[3; 2], `e = 5`, `b² = 25 − 16 = 9`", "`[[(x − 3)²||16]] − [[(y − 2)²||9]] = 1` | ·144 → `9(x − 3)² − 16(y − 2)² = 144`", "`9x² − 54x + 81 − 16y² + 64y − 64 − 144 = 0`"], res: "9x² − 16y² − 54x + 64y − 127 = 0" },
      { l: "8b)", q: "ohniska `F₁[4; −3]`, `F₂[4; 1]`, `a = 1`", d: 3, steps: ["S[4; −1], `e = 2`, `b² = 4 − 1 = 3`, hlavní osa ∥ y", "`(y + 1)² − [[(x − 4)²||3]] = 1` | ·3 → `3(y + 1)² − (x − 4)² = 3`", "`3y² + 6y + 3 − x² + 8x − 16 − 3 = 0` | ·(−1)"], res: "x² − 3y² − 8x − 6y + 16 = 0" },
    ],
  },

  // ───────────── PARABOLA ─────────────
  {
    cat: "sestaveni", src: "PL Parabola · úl. 1–2", diff: 1,
    task: "Napište rovnici paraboly s vrcholem v počátku, je-li dáno ohnisko F, resp. řídicí přímka d.",
    formula: "Ohnisko i řídicí přímka jsou od vrcholu ve vzdálenosti `p/2`. Parabola se otevírá směrem k ohnisku (od řídicí přímky).",
    parts: [
      { l: "1a)", q: "`F[7; 0]`", steps: ["`p/2 = 7` → `p = 14`, otevřená doprava"], res: "y² = 28x" },
      { l: "1b)", q: "`F[−5,5; 0]`", steps: ["`p = 11`, otevřená doleva"], res: "y² = −22x" },
      { l: "1c)", q: "`F[0; 4]`", steps: ["`p = 8`, otevřená nahoru"], res: "x² = 16y" },
      { l: "1d)", q: "`F[0; −3]`", steps: ["`p = 6`, otevřená dolů"], res: "x² = −12y" },
      { l: "2a)", q: "`d: x = 5`", steps: ["`p/2 = 5` → `p = 10`; řídicí přímka vpravo → otevřená doleva"], res: "y² = −20x" },
      { l: "2b)", q: "`d: x = −2,5`", steps: ["`p = 5`, otevřená doprava"], res: "y² = 10x" },
      { l: "2c)", q: "`d: y = 2`", steps: ["`p = 4`, řídicí přímka nahoře → otevřená dolů"], res: "x² = −8y" },
      { l: "2d)", q: "`d: y = −6`", steps: ["`p = 12`, otevřená nahoru"], res: "x² = 24y" },
    ],
  },
  {
    cat: "cteni", src: "PL Parabola · úl. 3", diff: 1,
    task: "Určete souřadnice ohniska F a rovnici řídicí přímky d paraboly.",
    parts: [
      { l: "a)", q: "`y² = 8x`", steps: ["`2p = 8` → `p = 4`, `p/2 = 2`"], res: "F[2; 0], d: x = −2" },
      { l: "b)", q: "`y² = −5x`", steps: ["`2p = 5` → `p/2 = 1,25`, otevřená doleva"], res: "F[−1,25; 0], d: x = 1,25" },
      { l: "c)", q: "`x² = 6y`", steps: ["`2p = 6` → `p/2 = 1,5`"], res: "F[0; 1,5], d: y = −1,5" },
      { l: "d)", q: "`x² = −10y`", steps: ["`2p = 10` → `p/2 = 2,5`, otevřená dolů"], res: "F[0; −2,5], d: y = 2,5" },
    ],
  },
  {
    cat: "sestaveni", src: "PL Parabola · úl. 6–10", diff: 2,
    task: "Napište obecnou rovnici paraboly z daných prvků.",
    parts: [
      { l: "6a)", q: "`V[2; 3]`, `p = 4`, osa ∥ x", steps: ["Dvě možnosti: `(y − 3)² = ±8(x − 2)`", "`+`: `y² − 6y + 9 − 8x + 16 = 0`", "`−`: `y² − 6y + 9 + 8x − 16 = 0`"], res: "y² − 8x − 6y + 25 = 0 nebo y² + 8x − 6y − 7 = 0" },
      { l: "7a)", q: "`V[1; −3]`, `p = 2`, osa ∥ y", steps: ["`(x − 1)² = ±4(y + 3)`", "`+`: `x² − 2x + 1 − 4y − 12 = 0`", "`−`: `x² − 2x + 1 + 4y + 12 = 0`"], res: "x² − 2x − 4y − 11 = 0 nebo x² − 2x + 4y + 13 = 0" },
      { l: "8a)", q: "`V[3; 4]`, `F[6; 4]`", steps: ["F je vpravo od V → otevřená doprava, `p/2 = 3` → `p = 6`", "`(y − 4)² = 12(x − 3)` → `y² − 8y + 16 − 12x + 36 = 0`"], res: "y² − 12x − 8y + 52 = 0" },
      { l: "8b)", q: "`V[−1; −2]`, `F[−5; −2]`", steps: ["F vlevo → doleva, `p/2 = 4`, `p = 8`", "`(y + 2)² = −16(x + 1)` → `y² + 4y + 4 + 16x + 16 = 0`"], res: "y² + 16x + 4y + 20 = 0" },
      { l: "9a)", q: "`V[1; 2]`, `d: y = 4`", steps: ["d je nad V → otevřená dolů, `p/2 = 2`, `p = 4`", "`(x − 1)² = −8(y − 2)` → `x² − 2x + 1 + 8y − 16 = 0`"], res: "x² − 2x + 8y − 15 = 0" },
      { l: "10a)", q: "`F[4; 2]`, `d: x = 0`", steps: ["`p = ` vzdálenost F od d `= 4`; V leží uprostřed: `V[2; 2]`; otevřená doprava", "`(y − 2)² = 8(x − 2)` → `y² − 4y + 4 − 8x + 16 = 0`"], res: "y² − 8x − 4y + 20 = 0" },
      { l: "10b)", q: "`F[2; 1]`, `d: y = −7`", steps: ["`p = 8`, `V[2; −3]`, otevřená nahoru", "`(x − 2)² = 16(y + 3)` → `x² − 4x + 4 − 16y − 48 = 0`"], res: "x² − 4x − 16y − 44 = 0" },
    ],
  },
  {
    cat: "cteni", src: "PL Parabola · úl. 13", diff: 2,
    task: "Určete vrchol, ohnisko a rovnici řídicí přímky paraboly.",
    parts: [
      { l: "a)", q: "`y² − 4x + 12 = 0`", steps: ["`y² = 4(x − 3)` → `V[3; 0]`, `2p = 4`, `p/2 = 1`, doprava"], res: "V[3; 0], F[4; 0], d: x = 2" },
      { l: "c)", q: "`y² − 5x + 20 = 0`", steps: ["`y² = 5(x − 4)` → `V[4; 0]`, `2p = 5`, `p/2 = 5/4`"], res: "V[4; 0], F[21/4; 0], d: x = 11/4" },
      { l: "e)", q: "`y² − 3x − 4y − 8 = 0`", steps: ["`(y − 2)² − 4 − 3x − 8 = 0` → `(y − 2)² = 3(x + 4)`", "`V[−4; 2]`, `2p = 3`, `p/2 = 0,75`, doprava"], res: "V[−4; 2], F[−3,25; 2], d: x = −4,75" },
      { l: "g)", q: "`x² − 6x − 6y − 15 = 0`", steps: ["`(x − 3)² − 9 − 6y − 15 = 0` → `(x − 3)² = 6(y + 4)`", "`V[3; −4]`, `2p = 6`, `p/2 = 1,5`, nahoru"], res: "V[3; −4], F[3; −2,5], d: y = −5,5" },
    ],
  },
];

function ProblemPart({ part, formula, onlyOne }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="part">
      <div className="partQ">
        {!onlyOne && <span className="partL">{part.l}</span>}
        <span><T>{part.q}</T></span>
        {part.d && <Badge d={part.d} />}
        <button className="btn" style={{ marginLeft: "auto", minHeight: 40, padding: "6px 14px", fontSize: 14 }} onClick={() => setOpen(o => !o)}>
          {open ? "Skrýt řešení ▴" : "Ukázat řešení ▾"}
        </button>
      </div>
      {open && <Solution given={part.q} formula={part.formula || formula} steps={part.steps} result={part.res} graph={part.graph || (part.K && conicGraphProps(analyze(...part.K)))} />}
    </div>
  );
}

function Ulohy() {
  const [cat, setCat] = useState("all");
  const list = PROBLEMS.filter(p => cat === "all" || p.cat === cat);
  const nParts = list.reduce((s, p) => s + p.parts.length, 0);
  return (
    <div>
      <div style={{ margin: "0 0 10px" }}>
        {CATS.map(c => <button key={c.id} className={"chip" + (cat === c.id ? " on" : "")} onClick={() => setCat(c.id)}>{c.t}</button>)}
      </div>
      <p className="lead">{list.length} úloh · {nParts} příkladů. Nejdřív to spočítej na papír, potom si rozbal řešení. Úlohy z PL jsou ověřené s výsledkovými listy; nové úlohy podle zadání testu (poměr, převody, kreslení) jsou dopočítané a zkontrolované.</p>
      {list.map((p, i) => (
        <div key={p.src + i} className={"entry" + (p.diff === 3 ? " red" : "")}>
          <div className="src">{p.src}</div>
          <h3 style={{ marginTop: 4 }}><T>{p.task}</T><Badge d={p.diff} /></h3>
          {p.parts.map((part, j) => <ProblemPart key={j} part={part} formula={p.formula} onlyOne={p.parts.length === 1} />)}
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// SPOLEČNÉ: graf kuželosečky z rozboru, řešení polohy přímky
// ══════════════════════════════════════════════════════════════════
// význačné prvky kuželosečky jako body a přímky pro graf
const AXIS = "#9aa6bf", DIRC = "#b7791f";
const vLine = (k, o = {}) => ({ a: 1, b: 0, c: -k, ...o });
const hLine = (k, o = {}) => ({ a: 0, b: 1, c: -k, ...o });
function conicElements(an, { dir = true, axes = true } = {}) {
  const g = an.geo, pts = [], lines = [];
  if (an.type === "bod") pts.push({ x: an.center[0], y: an.center[1], label: "bod", r: 4 });
  if (!g) return { pts, lines };
  const P = (x, y, label, o = {}) => pts.push({ x, y, label, r: 3.2, ...o });
  if (g.kind === "kruznice") {
    P(g.cx, g.cy, "S");
    if (axes) lines.push(hLine(g.cy, { dash: true, color: AXIS }), vLine(g.cx, { dash: true, color: AXIS }));
  }
  if (g.kind === "elipsa" || g.kind === "hyperbola") {
    const { cx, cy, a, b, e, horiz } = g;
    const at = (t, u) => horiz ? [cx + t, cy + u] : [cx + u, cy + t];   // t = podél hlavní osy
    P(cx, cy, "S");
    P(...at(-a, 0), "A"); P(...at(a, 0), "B");
    if (g.kind === "elipsa") { P(...at(0, b), "C"); P(...at(0, -b), "D"); }
    P(...at(-e, 0), "F₁", { color: RED }); P(...at(e, 0), "F₂", { color: RED });
    if (axes) lines.push(horiz ? hLine(cy, { dash: true, color: AXIS }) : vLine(cx, { dash: true, color: AXIS }));
    if (axes && g.kind === "elipsa") lines.push(horiz ? vLine(cx, { dash: true, color: AXIS }) : hLine(cy, { dash: true, color: AXIS }));
    if (g.kind === "hyperbola") {
      const k = horiz ? b / a : a / b;   // směrnice asymptot
      lines.push({ a: k, b: -1, c: cy - k * cx, dash: true, color: MUTED }, { a: -k, b: -1, c: cy + k * cx, dash: true, color: MUTED });
    }
    if (dir) { const dd = a * a / e; lines.push(...[-dd, dd].map(t => horiz ? vLine(cx + t, { dash: true, color: DIRC }) : hLine(cy + t, { dash: true, color: DIRC }))); }
  }
  if (g.kind === "parabola") {
    const { vx, vy, h, xSq } = g, w = 2 * Math.abs(h);   // v úrovni ohniska je parabola široká ±p
    P(vx, vy, "V");
    if (xSq) { P(vx, vy + h, "F", { color: RED }); pts.push({ x: vx - w, y: vy + h, r: 2.6, color: MUTED }, { x: vx + w, y: vy + h, r: 2.6, color: MUTED }); }
    else { P(vx + h, vy, "F", { color: RED }); pts.push({ x: vx + h, y: vy - w, r: 2.6, color: MUTED }, { x: vx + h, y: vy + w, r: 2.6, color: MUTED }); }
    if (axes) lines.push(xSq ? vLine(vx, { dash: true, color: AXIS }) : hLine(vy, { dash: true, color: AXIS }));
    lines.push(xSq ? hLine(vy - h, { dash: true, color: DIRC }) : vLine(vx - h, { dash: true, color: DIRC }));
  }
  return { pts, lines };
}
// rozumný výřez: aby byly vidět všechny body
function fitView(view, pts) {
  let [x0, x1, y0, y1] = view;
  for (const p of pts) { x0 = Math.min(x0, p.x - 1); x1 = Math.max(x1, p.x + 1); y0 = Math.min(y0, p.y - 1); y1 = Math.max(y1, p.y + 1); }
  const half = Math.max(x1 - x0, y1 - y0) / 2, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  return [cx - half, cx + half, cy - half, cy + half];
}
function conicGraphProps(an, extra = {}) {
  const el = conicElements(an, extra);
  const pts = [...el.pts, ...(extra.pts || [])];
  return { curves: [{ f: an.f }], pts, lines: [...el.lines, ...(extra.lines || [])], view: extra.view || fitView(an.view, pts) };
}
const LEGEND = "Plná modrá = kuželosečka · čárkovaně šedá = osy · tmavší čárkovaná = asymptoty · oranžová čárkovaná = řídicí přímky · červeně ohniska";

function lineSolutionSteps(K, ln, res) {
  const { a, b, c } = ln;
  const steps = [];
  const eq = genEq(K.A, K.C, K.D, K.E, K.F);
  if (res.useY) {
    const ex = Math.abs(b) === 1 ? fmtPoly([[-a * b, "x"], [-c * b, ""]]) : `(${fmtPoly([[-a, "x"], [-c, ""]])})/${b}`;
    steps.push(`Z přímky vyjádřím y: \`y = ${ex}\``);
    steps.push(`Dosadím do \`${eq}\`${Math.abs(b) !== 1 ? `, vynásobím ${b * b}` : ""}, roznásobím a upravím (případně vykrátím).`);
  } else {
    const ex = Math.abs(a) === 1 ? fmtPoly([[-b * a, "y"], [-c * a, ""]]) : `(${fmtPoly([[-b, "y"], [-c, ""]])})/${a}`;
    steps.push(`Z přímky vyjádřím x: \`x = ${ex}\``);
    steps.push(`Dosadím do \`${eq}\`${Math.abs(a) !== 1 ? `, vynásobím ${a * a}` : ""}, roznásobím a upravím (případně vykrátím).`);
  }
  const v = res.varName;
  steps.push(`Vyjde: \`${fmtPoly([[res.al, v + "²"], [res.be, v], [res.ga, ""]])} = 0\``);
  if (res.kind === "parallel") {
    steps.push(`Kvadratický člen zmizel → lineární rovnice s jediným řešením. Přímka je rovnoběžná s asymptotou (hyperbola) nebo s osou (parabola), takže to není tečna.`);
    steps.push(`Společný bod: \`${ptStr(res, 0, ln)}\``);
  } else if (res.kind === "asymptote") {
    steps.push("Vyšlo `0 = číslo ≠ 0` → žádné řešení; přímka je asymptota hyperboly.");
  } else {
    steps.push(`\`D = ${fmtN(res.be)}² − 4·${res.al}·${res.ga < 0 ? "(" + fmtN(res.ga) + ")" : res.ga} = ${fmtN(res.D)}\` ${res.D > 0 ? "> 0 → dva průsečíky" : res.D === 0 ? "→ dvojnásobný kořen" : "< 0 → žádný reálný kořen"}`);
    if (res.kind === "tangent") steps.push(`Bod dotyku: \`${ptStr(res, 0, ln)}\``);
    if (res.kind === "secant") steps.push(`Průsečíky: \`${ptStr(res, 0, ln)}\`, \`${ptStr(res, 1, ln)}\``);
  }
  return steps;
}

// ══════════════════════════════════════════════════════════════════
// ROZPOZNÁVAČ (laboratoř)
// ══════════════════════════════════════════════════════════════════
const PRESETS = [
  { t: "PL 1a", v: [1, -2, 4, 6, 0] },
  { t: "PL 1b", v: [1, 0, 4, 6, 0] },
  { t: "PL 1d", v: [2, 1, 4, 0, -8] },
  { t: "PL 1e", v: [1, -3, -4, 24, -32] },
  { t: "PL 1f", v: [1, -2, -4, -4, 2] },
  { t: "PL 2a (∅)", v: [1, 1, 0, 0, 1] },
  { t: "PL 4b", v: [2, -1, -2, 0, -5] },
  { t: "Par. 13e", v: [0, 1, -3, -4, -8] },
];

function NumIn({ value, onChange, label }) {
  return (
    <label style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 2, fontSize: 13, color: MUTED, marginRight: 8 }}>
      <input className="inp" inputMode="numeric" value={value} onChange={e => onChange(e.target.value.replace(/[^0-9\-]/g, "").slice(0, 5))} />
      <span className="mono">{label}</span>
    </label>
  );
}
const toInt = s => { const v = parseInt(s, 10); return isNaN(v) ? 0 : v; };

function Lab() {
  const [co, setCo] = useState(["1", "-3", "-4", "24", "-32"]);
  const [ln, setLn] = useState(["1", "-1", "2"]);
  const [showDir, setShowDir] = useState(true);
  const [A, C, D, E, F] = co.map(toInt);
  const an = useMemo(() => analyze(A, C, D, E, F), [A, C, D, E, F]);
  const L = { a: toInt(ln[0]), b: toInt(ln[1]), c: toInt(ln[2]) };
  const K = { A, C, D, E, F };
  const regular = ["kruznice", "elipsa", "hyperbola", "parabola"].includes(an.type);
  const lineOk = L.a !== 0 || L.b !== 0;
  const lres = regular && lineOk ? lineConic(K, L) : null;
  const set = (i, v) => setCo(c => c.map((x, j) => j === i ? v : x));

  return (
    <div>
      <p className="lead">Zadej koeficienty obecné rovnice. Rozpoznávač udělá doplnění na čtverec, určí typ a všechny význačné prvky, nakreslí graf a vyšetří polohu přímky. Hodí se na kontrolu úloh z pracovních listů.</p>
      <div className="entry">
        <h3>Rovnice kuželosečky</h3>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", margin: "8px 0" }}>
          <NumIn value={co[0]} onChange={v => set(0, v)} label="·x²" />
          <NumIn value={co[1]} onChange={v => set(1, v)} label="·y²" />
          <NumIn value={co[2]} onChange={v => set(2, v)} label="·x" />
          <NumIn value={co[3]} onChange={v => set(3, v)} label="·y" />
          <NumIn value={co[4]} onChange={v => set(4, v)} label="konst." />
        </div>
        <div style={{ margin: "4px 0 8px" }}>
          {PRESETS.map(p => <button key={p.t} className="chip" onClick={() => setCo(p.v.map(String))}>{p.t}</button>)}
          <button className="chip" onClick={() => { const k = genTypeTask(); setCo([k.A, k.C, k.D, k.E, k.F].map(String)); }}>🎲 náhodná</button>
        </div>
        <Eq big>{an.eq}</Eq>
      </div>

      <div className="grid2" style={{ alignItems: "start" }}>
        <div className="entry" style={{ margin: "8px 0" }}>
          <h3>Rozbor</h3>
          <Steps key={an.eq} steps={an.steps.slice(1)} />
          <div className="result">{an.name}</div>
          {an.std && <div className="mono" style={{ margin: "10px 0 0 14px", fontSize: 14.5 }}>{an.std}</div>}
        </div>
        <div style={{ paddingTop: 8 }}>
          <Graph {...conicGraphProps(an, {
            dir: showDir,
            pts: lres ? lres.pts.map(p => ({ x: p[0], y: p[1], color: RED, r: 4.5 })) : [],
            lines: lineOk ? [{ ...L }] : [],
          })} w={360} caption={LEGEND + " · plná červená = přímka p"} />
          {(an.type === "elipsa" || an.type === "hyperbola") && <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, marginTop: 6, minHeight: 44, cursor: "pointer" }}><input type="checkbox" checked={showDir} onChange={e => setShowDir(e.target.checked)} /> ukázat řídicí přímky</label>}
        </div>
      </div>

      {an.params.length > 0 && (
        <div className="entry">
          <h3>Parametry</h3>
          <div className="tblWrap"><table className="tbl"><tbody>
            {an.params.map(([k, v]) => <tr key={k}><th style={{ width: 170 }}>{k}</th><td className="mono">{v}</td></tr>)}
          </tbody></table></div>
        </div>
      )}

      {regular && (
        <div>
          <div className="entry">
            <h3>Přímka ax + by + c = 0</h3>
            <div style={{ display: "flex", alignItems: "flex-start", margin: "6px 0" }}>
              <NumIn value={ln[0]} onChange={v => setLn([v, ln[1], ln[2]])} label="a" />
              <NumIn value={ln[1]} onChange={v => setLn([ln[0], v, ln[2]])} label="b" />
              <NumIn value={ln[2]} onChange={v => setLn([ln[0], ln[1], v])} label="c" />
            </div>
            {lres ? <>
              <div className="mono" style={{ margin: "4px 0 8px" }}>p: {lineEq(L)}</div>
              <Steps key={ln.join() + an.eq} steps={lineSolutionSteps(K, L, lres)} />
              <div className="result">{KIND_NAMES[lres.kind]}</div>
            </> : <p className="lead">Zadej přímku (a, b nesmí být obě 0).</p>}
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// TRENAŽÉR
// ══════════════════════════════════════════════════════════════════
function Score({ s }) {
  return <span className="score">✔ {s.ok} / {s.n}</span>;
}

function DrillType() {
  const [K, setK] = useState(genTypeTask);
  const [ans, setAns] = useState(null);
  const [s, setS] = useState({ ok: 0, n: 0 });
  const an = useMemo(() => analyze(K.A, K.C, K.D, K.E, K.F), [K]);
  const opts = ["kruznice", "elipsa", "hyperbola", "parabola", "ruznobezky", "bod", "prazdna"];
  const choose = o => { if (ans) return; setAns(o); setS(p => ({ ok: p.ok + (o === an.type ? 1 : 0), n: p.n + 1 })); };
  const next = () => { setK(genTypeTask()); setAns(null); };
  return (
    <div className="entry">
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}><span className="src">Jaká kuželosečka je dána rovnicí?</span><Score s={s} /></div>
      <Eq big>{an.eq}</Eq>
      <div className="grid2" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 4 }}>
        {opts.map(o => {
          let bc = "#c9d2e3", bg = "#fff";
          if (ans) { if (o === an.type) { bc = GREEN; bg = "#eaf6ef"; } else if (o === ans) { bc = RED; bg = "#fdeeee"; } }
          return <button key={o} className="opt" style={{ borderColor: bc, background: bg }} onClick={() => choose(o)}>{TYPE_NAMES[o]}</button>;
        })}
      </div>
      {ans && (
        <div style={{ marginTop: 10 }}>
          <div style={{ fontWeight: 700, color: ans === an.type ? GREEN : RED }}>{ans === an.type ? "Správně!" : `Špatně, je to: ${an.name}`}</div>
          <div className="grid2" style={{ alignItems: "start" }}>
            <div className="sol"><Steps steps={an.steps.slice(1)} /><div className="result">{an.name}</div></div>
            <Graph {...conicGraphProps(an)} w={300} />
          </div>
        </div>
      )}
      <button className="btn solid" style={{ marginTop: 12 }} onClick={next}>Další rovnice →</button>
    </div>
  );
}

function DrillLine() {
  const [task, setTask] = useState(genLineTask);
  const [ans, setAns] = useState(null);
  const [s, setS] = useState({ ok: 0, n: 0 });
  const { K, ln, res } = task;
  const an = useMemo(() => analyze(K.A, K.C, K.D, K.E, K.F), [K]);
  const opts = ["secant", "tangent", "exterior", "parallel"];
  const choose = o => { if (ans) return; setAns(o); setS(p => ({ ok: p.ok + (o === res.kind ? 1 : 0), n: p.n + 1 })); };
  const next = () => { setTask(genLineTask()); setAns(null); };
  return (
    <div className="entry">
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}><span className="src">Urči vzájemnou polohu přímky a kuželosečky</span><Score s={s} /></div>
      <Eq big>{an.eq}</Eq>
      <Eq big>{"p: " + lineEq(ln)}</Eq>
      {opts.map(o => {
        let bc = "#c9d2e3", bg = "#fff";
        if (ans) { if (o === res.kind) { bc = GREEN; bg = "#eaf6ef"; } else if (o === ans) { bc = RED; bg = "#fdeeee"; } }
        return <button key={o} className="opt" style={{ borderColor: bc, background: bg }} onClick={() => choose(o)}>{KIND_NAMES[o]}</button>;
      })}
      {ans && (
        <div style={{ marginTop: 10 }}>
          <div style={{ fontWeight: 700, color: ans === res.kind ? GREEN : RED }}>{ans === res.kind ? "Správně!" : "Špatně"}</div>
          <div className="grid2" style={{ alignItems: "start" }}>
            <div className="sol"><Steps steps={lineSolutionSteps(K, ln, res)} /><div className="result">{KIND_NAMES[res.kind]}</div></div>
            <Graph {...conicGraphProps(an, { lines: [ln], pts: res.pts.map(p => ({ x: p[0], y: p[1], color: RED, r: 4 })) })} w={300} />
          </div>
        </div>
      )}
      <button className="btn solid" style={{ marginTop: 12 }} onClick={next}>Další příklad →</button>
    </div>
  );
}

function OptList({ opts, truth, ans, onPick, render = o => <T>{"`" + o + "`"}</T> }) {
  return opts.map((o, i) => {
    let bc = "#c9d2e3", bg = "#fff";
    if (ans !== null) { if (i === truth) { bc = GREEN; bg = "#eaf6ef"; } else if (i === ans) { bc = RED; bg = "#fdeeee"; } }
    return <button key={i} className="opt" style={{ borderColor: bc, background: bg }} onClick={() => onPick(i)}>{render(o)}</button>;
  });
}

function DrillRatio() {
  const [t, setT] = useState(genRatioTask);
  const [ans, setAns] = useState(null);
  const [s, setS] = useState({ ok: 0, n: 0 });
  const truth = t.opts.findIndex(k => sameK(k, t.K));
  const an = useMemo(() => analyze(t.K.A, t.K.C, t.K.D, t.K.E, t.K.F), [t]);
  const choose = i => { if (ans !== null) return; setAns(i); setS(p => ({ ok: p.ok + (i === truth ? 1 : 0), n: p.n + 1 })); };
  const next = () => { setT(genRatioTask()); setAns(null); };
  const dEq = (t.vert ? "x = " : "y = ") + fmtN(t.c);
  return (
    <div className="entry">
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}><span className="src">Kuželosečka z poměru vzdáleností</span><Score s={s} /></div>
      <p style={{ fontSize: 17 }}>Najdi rovnici množiny všech bodů <M>P</M>, které mají {t.phr}, je-li <M>{`F[${fmtN(t.f1)}; ${fmtN(t.f2)}]`}</M> a <M>{"d: " + dEq}</M>.</p>
      <OptList opts={t.opts} truth={truth} ans={ans} onPick={choose} render={k => <T>{"`" + genEq(k.A, k.C, k.D, k.E, k.F) + "`"}</T>} />
      {ans !== null && (
        <div style={{ marginTop: 10 }}>
          <div style={{ fontWeight: 700, color: ans === truth ? GREEN : RED }}>{ans === truth ? "Správně!" : "Špatně"}</div>
          <div className="grid2" style={{ alignItems: "start" }}>
            <div className="sol">
              <Steps steps={[...ratioSteps(t), ...an.steps.slice(1)]} />
              <div className="result">{an.name}: {an.std}</div>
            </div>
            <Graph {...conicGraphProps(an, { pts: [{ x: t.f1, y: t.f2, color: RED, r: 7, hollow: true }, t.vert ? { x: t.c, y: t.f2, r: 0 } : { x: t.f1, y: t.c, r: 0 }], lines: [t.vert ? vLine(t.c, { color: DIRC }) : hLine(t.c, { color: DIRC })] })} w={300} caption="zadané ohnisko F zakroužkované, zadaná přímka d plně oranžově" />
          </div>
        </div>
      )}
      <button className="btn solid" style={{ marginTop: 12 }} onClick={next}>Další příklad →</button>
    </div>
  );
}

function DrillConv() {
  const [t, setT] = useState(genConvTask);
  const [ans, setAns] = useState(null);
  const [s, setS] = useState({ ok: 0, n: 0 });
  const an = useMemo(() => analyze(t.K.A, t.K.C, t.K.D, t.K.E, t.K.F), [t]);
  const truth = t.opts.indexOf(t.right);
  const choose = i => { if (ans !== null) return; setAns(i); setS(p => ({ ok: p.ok + (i === truth ? 1 : 0), n: p.n + 1 })); };
  const next = () => { setT(genConvTask()); setAns(null); };
  return (
    <div className="entry">
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}><span className="src">{t.toGen ? "Převeď na obecný tvar" : "Převeď na středový / vrcholový tvar"}</span><Score s={s} /></div>
      <Eq big>{t.toGen ? convStd(t.t) : an.eq}</Eq>
      <OptList opts={t.opts} truth={truth} ans={ans} onPick={choose} />
      {ans !== null && (
        <div style={{ marginTop: 10 }}>
          <div style={{ fontWeight: 700, color: ans === truth ? GREEN : RED }}>{ans === truth ? "Správně!" : "Špatně"}</div>
          <div className="grid2" style={{ alignItems: "start" }}>
            <div className="sol"><Steps steps={t.toGen ? convSteps(t) : an.steps.slice(1)} /><div className="result">{t.right}</div></div>
            <Graph {...conicGraphProps(an)} w={300} />
          </div>
        </div>
      )}
      <button className="btn solid" style={{ marginTop: 12 }} onClick={next}>Další příklad →</button>
    </div>
  );
}

const DRAW_CHECK = {
  kruznice: ["střed S", "poloměr r (4 body na kružnici ve směru os)"],
  elipsa: ["střed S", "hlavní osa ve správném směru", "hlavní vrcholy A, B", "vedlejší vrcholy C, D", "ohniska F₁, F₂"],
  hyperbola: ["střed S", "hlavní osa ve správném směru", "vrcholy A, B", "asymptoty (úhlopříčky obdélníku 2a × 2b)", "ohniska F₁, F₂"],
  parabola: ["vrchol V", "osa o a směr otevření", "ohnisko F", "řídicí přímka d", "pomocné body [F ± p] (šířka v úrovni ohniska)"],
};
function DrillDraw() {
  const gen = () => { const c = genConvTask(); return c.K; };
  const [K, setK] = useState(gen);
  const [open, setOpen] = useState(false);
  const [chk, setChk] = useState({});
  const [s, setS] = useState({ ok: 0, n: 0 });
  const an = useMemo(() => analyze(K.A, K.C, K.D, K.E, K.F), [K]);
  const items = DRAW_CHECK[an.type] || [];
  const next = () => {
    if (open) setS(p => ({ ok: p.ok + items.filter(it => chk[it]).length, n: p.n + items.length }));
    setK(gen()); setOpen(false); setChk({});
  };
  return (
    <div className="entry">
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}><span className="src">Zakresli do KSS a vyznač význačné prvky</span><Score s={s} /></div>
      <Eq big>{an.eq}</Eq>
      <p className="lead">Na čtverečkovaný papír: převeď na středový/vrcholový tvar, vyznač prvky a teprve potom nakresli křivku. Pak si to porovnej.</p>
      {!open ? <button className="btn" onClick={() => setOpen(true)}>Ukázat správný obrázek ▾</button> : (
        <div className="grid2" style={{ alignItems: "start" }}>
          <div>
            <div className="sol"><Steps steps={an.steps.slice(1)} /><div className="result">{an.std}</div></div>
            <div className="tblWrap"><table className="tbl"><tbody>
              {an.params.map(([k, v]) => <tr key={k}><th style={{ width: 150 }}>{k}</th><td className="mono">{v}</td></tr>)}
            </tbody></table></div>
          </div>
          <div>
            <Graph {...conicGraphProps(an)} w={320} caption={LEGEND} />
            <div className="solLbl" style={{ paddingLeft: 0, marginTop: 10 }}>Co jsi měl na obrázku správně?</div>
            {items.map(it => (
              <label key={it} style={{ display: "flex", alignItems: "center", gap: 10, minHeight: 44, cursor: "pointer", fontSize: 15 }}>
                <input type="checkbox" checked={!!chk[it]} onChange={e => setChk(c => ({ ...c, [it]: e.target.checked }))} style={{ width: 20, height: 20 }} /> {it}
              </label>
            ))}
          </div>
        </div>
      )}
      <button className="btn solid" style={{ marginTop: 12 }} onClick={next}>{open ? "Započítat a další →" : "Přeskočit →"}</button>
    </div>
  );
}

function Trenazer() {
  const [mode, setMode] = useState("pomer");
  const modes = [["pomer", "📏 Poměr vzdáleností"], ["typ", "🔍 Typ kuželosečky"], ["prevod", "🔁 Převody tvarů"], ["graf", "✏️ Zakreslení do KSS"], ["primka", "✂️ Přímka a kuželosečka"]];
  return (
    <div>
      <p className="lead">Náhodně generované příklady na všech pět bodů zadání testu. Nejdřív to spočítej na papír a pak klikni na odpověď. Ukáže se postup i graf.</p>
      <div style={{ marginBottom: 6 }}>{modes.map(([id, t]) => <button key={id} className={"chip" + (mode === id ? " on" : "")} onClick={() => setMode(id)}>{t}</button>)}</div>
      {mode === "typ" && <DrillType />}
      {mode === "pomer" && <DrillRatio />}
      {mode === "prevod" && <DrillConv />}
      {mode === "graf" && <DrillDraw />}
      {mode === "primka" && <DrillLine />}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// KVÍZ
// ══════════════════════════════════════════════════════════════════
const QUIZ = [
  { question: "Množina bodů P, pro které `|PF| : |Pd| = 3 : 4` (F ohnisko, d řídicí přímka), je…", type: "single", options: ["elipsa", "parabola", "hyperbola", "kružnice"], correct: [0], explanation: "`ε = 3/4 < 1` → elipsa. `ε = 1` parabola, `ε > 1` hyperbola." },
  { question: "Bod má od přímky d dvakrát větší vzdálenost než od bodu F. Jaký je poměr ε = |PF| : |Pd|?", type: "single", options: ["1/2 → elipsa", "2 → hyperbola", "1 → parabola", "1/4 → elipsa"], correct: [0], explanation: "`|Pd| = 2|PF|` → `|PF| : |Pd| = 1 : 2`. Pozor na pořadí v definici: v čitateli je vždy vzdálenost od ohniska.", tip: "Napiš si vždy nejdřív |PF| = …·|Pd|." },
  { question: "Kuželosečka: `|PF| = 2|Pd|`, `F[4; 0]`, `d: x = 1`. Po umocnění dostaneš:", type: "single", options: ["(x − 4)² + y² = 4(x − 1)²", "(x − 4)² + y² = 2(x − 1)²", "(x − 4)² + y² = 4(x + 1)²", "(x + 4)² + y² = 4(x − 1)²"], correct: [0], explanation: "Umocňuje se celá pravá strana, tedy i ε: `2² = 4`. Vzdálenost od `x = 1` je `|x − 1|`. Vyjde `3x² − y² − 12 = 0`, hyperbola." },
  { question: "Množina bodů stejně vzdálených od `F[0; 2]` a od přímky `y = −2` má rovnici:", type: "single", options: ["x² = 8y", "x² = 4y", "y² = 8x", "x² = −8y"], correct: [0], explanation: "`x² + (y − 2)² = (y + 2)²` → `x² = 8y`. Parabola s vrcholem v počátku, `p = 4` (vzdálenost F od d)." },
  { question: "Jaká je číselná výstřednost elipsy `x²/25 + y²/16 = 1`?", type: "single", options: ["3/5", "4/5", "3", "5/3"], correct: [0], explanation: "`e = √(25 − 16) = 3`, `ε = e/a = 3/5`. Číselná výstřednost elipsy je vždy mezi 0 a 1." },
  { question: "Řídicí přímky hyperboly `x²/4 − y²/12 = 1` jsou:", type: "single", options: ["x = ±1", "x = ±4", "x = ±2", "y = ±1"], correct: [0], explanation: "`e² = 4 + 12 = 16` → `e = 4`, `x = ±a²/e = ±4/4 = ±1`. Leží mezi vrcholy (`±2`), jak to u hyperboly má být." },
  { question: "Jakou kuželosečku popisuje rovnice `4x² + 9y² − 8x + 36y + 4 = 0`?", type: "single", options: ["elipsu", "kružnici", "hyperbolu", "parabolu"], correct: [0], explanation: "`4(x − 1)² + 9(y + 2)² = 36` → `(x − 1)²/9 + (y + 2)²/4 = 1`: kladné a různé jmenovatele → elipsa se středem [1; −2]." },
  { question: "Co je množina bodů daná rovnicí `x² − y² = 0`?", type: "single", options: ["dvojice různoběžek y = ±x", "rovnoosá hyperbola", "bod [0; 0]", "prázdná množina"], correct: [0], explanation: "`(x − y)(x + y) = 0` → `y = x` nebo `y = −x`. Je to singulární kuželosečka, „zdegenerovaná hyperbola“.", tip: "A·C < 0 a pravá strana 0 → vždy dvojice různoběžek." },
  { question: "Co popisuje rovnice `x² + y² − 4x + 6y + 13 = 0`?", type: "single", options: ["bod [2; −3]", "kružnici se středem [2; −3] a r = 13", "kružnici s r = √13", "prázdnou množinu"], correct: [0], explanation: "`(x − 2)² + (y + 3)² = 4 + 9 − 13 = 0` → jediný bod [2; −3]." },
  { question: "Středový tvar rovnice `x² + 4y² − 6x + 8y − 3 = 0` je:", type: "single", options: ["(x − 3)²/16 + (y + 1)²/4 = 1", "(x + 3)²/16 + (y − 1)²/4 = 1", "(x − 3)²/4 + (y + 1)²/16 = 1", "(x − 3)²/16 + (y + 1)² = 1"], correct: [0], explanation: "`(x − 3)² − 9 + 4[(y + 1)² − 1] − 3 = 0` → `(x − 3)² + 4(y + 1)² = 16` → vydělím 16." },
  { question: "Obecný tvar rovnice `(x + 1)²/4 − (y − 2)²/9 = 1` je:", type: "single", options: ["9x² − 4y² + 18x + 16y − 43 = 0", "9x² − 4y² − 18x − 16y − 43 = 0", "4x² − 9y² + 8x + 36y − 68 = 0", "9x² − 4y² + 18x + 16y − 7 = 0"], correct: [0], explanation: "·36: `9(x + 1)² − 4(y − 2)² = 36` → `9x² + 18x + 9 − 4y² + 16y − 16 − 36 = 0` → `9x² − 4y² + 18x + 16y − 43 = 0`." },
  { question: "Jaký typ kuželosečky je `y² − 6x + 4y = 0`?", type: "single", options: ["parabola s osou ∥ x", "parabola s osou ∥ y", "hyperbola", "elipsa"], correct: [0], explanation: "Kvadratický je jen `y²` → parabola; osa je rovnoběžná s osou x (s tou proměnnou, která je v 1. mocnině). `(y + 2)² = 6(x + 2/3)`." },
  { question: "Který vztah platí pro hyperbolu?", type: "single", options: ["e² = a² + b²", "e² = a² − b²", "e = a + b", "a² = b² + e²"], correct: [0], explanation: "U hyperboly je excentricita největší ze tří čísel: `e² = a² + b²`. U elipsy je největší a: `e² = a² − b²`.", tip: "Hyperbola = plus (rozdíl vzdáleností, ale součet ve vzorci)." },
  { question: "Elipsa `x²/9 + y²/25 = 1` má hlavní osu…", type: "single", options: ["v ose y, a = 5", "v ose x, a = 3", "v ose x, a = 5", "v ose y, a = 3"], correct: [0], explanation: "Větší jmenovatel (25) je pod `y` → hlavní osa leží v ose y, `a = 5`, `b = 3`, `e = 4`." },
  { question: "Jaké jsou asymptoty hyperboly `x²/16 − y²/9 = 1`?", type: "single", options: ["y = ±(3/4)x", "y = ±(4/3)x", "y = ±(9/16)x", "y = ±12x"], correct: [0], explanation: "Hlavní osa v ose x → asymptoty `y = ±(b/a)x = ±(3/4)x`." },
  { question: "Parabola `x² = −12y` má ohnisko a řídicí přímku:", type: "single", options: ["F[0; −3], d: y = 3", "F[0; −6], d: y = 6", "F[−3; 0], d: x = 3", "F[0; 3], d: y = −3"], correct: [0], explanation: "`2p = 12` → `p/2 = 3`; znaménko − u osy y → otevřená dolů → ohnisko pod vrcholem." },
  { question: "Elipsa má ohniska `F₁[−1; 2]`, `F₂[5; 2]` a hlavní poloosu `a = 4`. Její rovnice je:", type: "single", options: ["(x − 2)²/16 + (y − 2)²/7 = 1", "(x − 2)²/16 + (y − 2)²/25 = 1", "(x − 2)²/7 + (y − 2)²/16 = 1", "(x + 2)²/16 + (y + 2)²/7 = 1"], correct: [0], explanation: "S = střed F₁F₂ = [2; 2], `e = 3`, `b² = 16 − 9 = 7`; ohniska mají stejné y → hlavní osa ∥ x, `a²` pod x." },
  { question: "Parabola má vrchol `V[1; −2]` a ohnisko `F[1; 1]`. Její rovnice je:", type: "single", options: ["(x − 1)² = 12(y + 2)", "(x − 1)² = 6(y + 2)", "(y + 2)² = 12(x − 1)", "(x − 1)² = −12(y + 2)"], correct: [0], explanation: "F je 3 nad V → `p/2 = 3`, `p = 6`, `2p = 12`, otevřená nahoru." },
  { question: "Které prvky musíš vyznačit u hyperboly v KSS?", type: "multi", options: ["střed S", "vrcholy A, B", "ohniska F₁, F₂", "asymptoty", "vedlejší vrcholy C, D na křivce"], correct: [0, 1, 2, 3], explanation: "Hyperbola nemá vedlejší vrcholy na křivce. Body `[m; n ± b]` slouží jen k sestrojení obdélníku pro asymptoty." },
  { question: "Jak nejrychleji sestrojíš ohniska elipsy, když máš vrcholy?", type: "single", options: ["kružnicí z vedlejšího vrcholu C o poloměru a", "kružnicí ze středu o poloměru b", "průsečíkem asymptot", "kružnicí ze středu přes rohy obdélníku"], correct: [0], explanation: "Pro každý bod elipsy je `|PF₁| + |PF₂| = 2a`, pro vedlejší vrchol C jsou obě vzdálenosti stejné → `|CF₁| = a`. Poslední možnost je trik pro hyperbolu." },
  { question: "U paraboly `y² = 8x` jsou pomocné body v úrovni ohniska:", type: "single", options: ["[2; 4] a [2; −4]", "[2; 2] a [2; −2]", "[4; 2] a [4; −2]", "[4; 8] a [4; −8]"], correct: [0], explanation: "`F[2; 0]`; dosadím `x = 2`: `y² = 16` → `y = ±4 = ±p`. V úrovni ohniska je parabola široká `2p`." },
  { question: "Po dosazení přímky do rovnice hyperboly vyšla LINEÁRNÍ rovnice s jedním řešením. Přímka je…", type: "single", options: ["rovnoběžná s asymptotou, má 1 společný bod", "tečna", "vnější přímka", "asymptota"], correct: [0], explanation: "Kvadratické členy se odečtou právě tehdy, když má přímka směr asymptoty. Protne pak jen jednu větev v jednom bodě (PL 4d, Hyperbola 10b, f)." },
  { question: "Přímka `y = 3` a parabola `(y − 1)² = 4(x + 2)` mají…", type: "single", options: ["1 společný bod [−1; 3], přímka je ∥ s osou", "1 společný bod, přímka je tečna", "2 společné body", "žádný společný bod"], correct: [0], explanation: "`4 = 4(x + 2)` → `x = −1`, jediný bod [−1; 3]. Osa paraboly je `y = 1` ∥ x, přímka y = 3 je s ní rovnoběžná → nejde o tečnu." },
  { question: "Společné body přímky `y = x + 1` a hyperboly `3x² − y² − 3 = 0` jsou:", type: "single", options: ["[2; 3] a [−1; 0]", "[2; 3] a [1; 2]", "[−2; −1] a [1; 2]", "žádné"], correct: [0], explanation: "`3x² − (x + 1)² − 3 = 0` → `2x² − 2x − 4 = 0` → `x² − x − 2 = 0` → `x = 2` nebo `x = −1`; `y = x + 1` → 3 a 0." },
  { question: "Kolik společných bodů může mít přímka s elipsou?", type: "single", options: ["0, 1 nebo 2", "jen 0 nebo 2", "0, 1, 2 nebo 3", "vždy aspoň 1"], correct: [0], explanation: "Dosazením vznikne vždy kvadratická rovnice (u elipsy se kvadratické členy nemůžou odečíst) → 0, 1 nebo 2 řešení." },
  { question: "Které rovnice popisují (regulární) hyperbolu?", type: "multi", options: ["x² − 4y² − 2x = 0", "3y² − x² + 6y + 3 = 0", "x² − y² + 4 = 0", "xy = 4", "2x² + y² − 1 = 0"], correct: [0, 2, 3], explanation: "1) `(x − 1)² − 4y² = 1` ✓. 2) `3(y + 1)² − x² = 0` → dvojice přímek ✗. 3) `y² − x² = 4` ✓ (osa y). 4) nepřímá úměrnost → rovnoosá hyperbola ✓. 5) elipsa ✗." },
  { question: "Elipsa má `a = 5` a `e = 3`. Kolik je `b`?", type: "single", options: ["4", "√34", "2", "8"], correct: [0], explanation: "`b² = a² − e² = 25 − 9 = 16` → `b = 4`." },
  { question: "Vrcholy hyperboly `−x²/9 + y²/16 = 1` jsou:", type: "single", options: ["[0; ±4]", "[±3; 0]", "[±4; 0]", "[0; ±3]"], correct: [0], explanation: "Kladný člen je s y → hlavní osa v ose y, `a = 4` (pod kladným členem)." },
];

// ══════════════════════════════════════════════════════════════════
// KARTIČKY
// ══════════════════════════════════════════════════════════════════
const CARDS = [
  { f: "Kuželosečka z poměru vzdáleností", b: "Množina bodů P, pro které `|PF| : |Pd| = ε` (F ohnisko, d řídicí přímka)." },
  { f: "ε < 1 / ε = 1 / ε > 1", b: "elipsa / parabola / hyperbola" },
  { f: "Postup u poměru vzdáleností", b: "P[x; y] → `|PF| = ε·|Pd|` → umocnit (ε²!) → roznásobit → obecná rovnice → doplnit na čtverec" },
  { f: "Vzdálenost bodu P[x; y] od přímky ax + by + c = 0", b: "`|ax + by + c| / √(a² + b²)`; pro `x = c` jen `|x − c|`" },
  { f: "Číselná výstřednost elipsy a hyperboly", b: "`ε = e/a` (elipsa < 1, hyperbola > 1)" },
  { f: "Řídicí přímky elipsy/hyperboly (osa ∥ x)", b: "`x = m ± a²/e`" },
  { f: "Ohnisková definice elipsy", b: "Množina bodů, které mají od dvou ohnisek součet vzdáleností 2a." },
  { f: "Ohnisková definice hyperboly", b: "Množina bodů, které mají od dvou ohnisek absolutní hodnotu rozdílu vzdáleností 2a." },
  { f: "Definice paraboly", b: "Množina bodů, které mají stejnou vzdálenost od ohniska F a od řídicí přímky d. p = |Fd|." },
  { f: "Vztah a, b, e u elipsy", b: "`e² = a² − b²` (a je největší)" },
  { f: "Vztah a, b, e u hyperboly", b: "`e² = a² + b²` (e je největší)" },
  { f: "Asymptoty hyperboly `x²/a² − y²/b² = 1`", b: "`y = ±(b/a)·x`" },
  { f: "Asymptoty hyperboly `y²/a² − x²/b² = 1`", b: "`y = ±(a/b)·x`" },
  { f: "Ohnisko a řídicí přímka `y² = 2px`", b: "`F[p/2; 0]`, `d: x = −p/2`" },
  { f: "Středový → obecný tvar", b: "vynásobit společným jmenovatelem, roznásobit závorky, vše doleva" },
  { f: "Obecný → středový tvar", b: "seskupit, vytknout koeficient u x² / y², doplnit na čtverec, konstanty doprava, vydělit" },
  { f: "Rozpoznání: A·C > 0", b: "elipsa (A = C → kružnice), nebo bod / ∅ podle pravé strany" },
  { f: "Rozpoznání: A·C < 0", b: "hyperbola, při pravé straně 0 dvojice různoběžek" },
  { f: "Rozpoznání: A·C = 0", b: "parabola; chybí-li lineární člen druhé proměnné → rovnoběžky / přímka / ∅" },
  { f: "Význačné prvky elipsy v KSS", b: "S, hlavní vrcholy A, B, vedlejší C, D, ohniska F₁, F₂, osy" },
  { f: "Význačné prvky hyperboly v KSS", b: "S, vrcholy A, B, ohniska F₁, F₂, asymptoty (úhlopříčky obdélníku 2a × 2b), hlavní osa" },
  { f: "Význačné prvky paraboly v KSS", b: "V, F, řídicí přímka d, osa o; pomocné body F ± p" },
  { f: "Přímka a kuželosečka: D > 0 / D = 0 / D < 0", b: "2 společné body (sečna) / 1 bod / 0 bodů (vnější přímka)" },
  { f: "Po dosazení vyšla lineární rovnice", b: "1 bod: přímka ∥ s asymptotou (hyperbola) nebo s osou (parabola)." },
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
  { h: "Poměr vzdáleností od bodu a přímky", rows: [["definice", "|PF| : |Pd| = ε"], ["typ", "ε < 1 elipsa · ε = 1 parabola · ε > 1 hyperbola"], ["vzdálenost od bodu", "|PF| = √((x − f₁)² + (y − f₂)²)"], ["vzdálenost od přímky", "|Pd| = |ax + by + c| / √(a² + b²);  d: x = c → |x − c|"], ["po umocnění", "(x − f₁)² + (y − f₂)² = ε²·|Pd|²"], ["ε z rovnice", "ε = e/a  (parabola ε = 1)"], ["řídicí přímky (osa ∥ x)", "x = m ± a²/e"]] },
  { h: "Kružnice", rows: [["středový tvar", "(x − m)² + (y − n)² = r²"], ["obecný tvar", "x² + y² + Dx + Ey + F = 0"]] },
  { h: "Elipsa", rows: [["osa ∥ x", "[[(x − m)²||a²]] + [[(y − n)²||b²]] = 1"], ["osa ∥ y", "[[(x − m)²||b²]] + [[(y − n)²||a²]] = 1"], ["excentricita", "e² = a² − b²   (a > b, a > e)"], ["vrcholy (osa ∥ x)", "A,B[m ± a; n], C,D[m; n ± b], F[m ± e; n]"], ["ε, řídicí přímky", "ε = e/a < 1,  x = m ± a²/e"]] },
  { h: "Hyperbola", rows: [["osa ∥ x", "[[(x − m)²||a²]] − [[(y − n)²||b²]] = 1"], ["osa ∥ y", "[[(y − n)²||a²]] − [[(x − m)²||b²]] = 1"], ["excentricita", "e² = a² + b²   (a je pod kladným členem)"], ["asymptoty (osa ∥ x)", "y − n = ±[[b||a]](x − m)"], ["asymptoty (osa ∥ y)", "y − n = ±[[a||b]](x − m)"], ["rovnoosá", "a = b, e² = 2a², asymptoty ⊥"], ["ε, řídicí přímky", "ε = e/a > 1,  x = m ± a²/e"]] },
  { h: "Parabola", rows: [["osa ∥ x", "(y − n)² = ±2p(x − m)   + doprava, − doleva"], ["osa ∥ y", "(x − m)² = ±2p(y − n)   + nahoru, − dolů"], ["ohnisko, řídicí přímka", "|VF| = |Vd| = p/2,  |Fd| = p"], ["y² = 2px", "F[p/2; 0], d: x = −p/2"], ["šířka v úrovni F", "2p (body F ± p kolmo na osu)"]] },
  { h: "Převody tvarů", rows: [["doplnění na čtverec", "x² + kx = (x + k/2)² − k²/4"], ["s koeficientem", "Ax² + Dx = A[(x + D/2A)² − (D/2A)²]"], ["středový → obecný", "· společný jmenovatel, roznásobit, vše doleva"], ["rozpoznání A·C", "> 0 elipsa/kružnice · < 0 hyperbola · = 0 parabola"]] },
  { h: "Přímka a kuželosečka", rows: [["postup", "vyjádři proměnnou z přímky → dosaď → αt² + βt + γ = 0"], ["D > 0", "2 společné body (sečna)"], ["D = 0", "1 společný bod (dvojnásobný kořen)"], ["D < 0", "žádný společný bod (vnější přímka)"], ["α = 0 (lineární)", "∥ s asymptotou / osou → 1 bod"], ["společné body", "kořen dosadit zpět do přímky, zkouška do obou rovnic"]] },
];

function Vzorce() {
  return (
    <div className="fs">
      <p className="lead">Všechno, co musíš umět zpaměti, na jednom místě. Projdi si to těsně před testem.</p>
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
  { id: "prehled", i: "🗺️", t: "Přehled", k: "Kuželosečky · příprava na test", h: "Co tě čeká a jak se připravit" },
  { id: "teorie", i: "📖", t: "Teorie", k: "Teorie", h: "Kuželosečky od definice po společné body" },
  { id: "ulohy", i: "✍️", t: "Úlohy", k: "Pracovní listy s řešením", h: "Vyřešené úlohy krok za krokem" },
  { id: "lab", i: "🧪", t: "Rozpoznávač", k: "Laboratoř", h: "Rozpoznávač kuželoseček" },
  { id: "trenazer", i: "🎯", t: "Trenažér", k: "Neomezené procvičování", h: "Trenažér: poměr, převody, graf, přímka" },
  { id: "kviz", i: "❓", t: "Kvíz", k: "Ověř si to", h: "Kvíz" },
  { id: "karticky", i: "🃏", t: "Kartičky", k: "Pojmy a vzorce", h: "Kartičky" },
  { id: "vzorce", i: "📐", t: "Vzorce", k: "Tahák", h: "Vzorce a pravidla" },
];

export default function App() {
  const [tab, setTab] = useState("prehled");
  const sec = SECTIONS.find(s => s.id === tab);
  const go = id => { setTab(id); try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch (e) { /* ignore */ } };
  return (
    <div className="kz">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet" />
      <style>{CSS}</style>
      <div className="layout">
        <nav className="side">
          <div className="brand">Kuželosečky</div>
          <div className="brandSub">poměr vzdáleností · rovnice · graf · přímka</div>
          {SECTIONS.map(s => (
            <button key={s.id} className={"navBtn" + (tab === s.id ? " on" : "")} onClick={() => go(s.id)}>
              <span>{s.i}</span><span>{s.t}</span>
            </button>
          ))}
        </nav>
        <main className="main">
          <div className="wrap">
            <header className="pageHead">
              <div className="kicker">{sec.k}</div>
              <h1><span>{sec.h}</span></h1>
            </header>
            {tab === "prehled" && <Prehled go={go} />}
            {tab === "teorie" && <Teorie />}
            {tab === "ulohy" && <Ulohy />}
            {tab === "lab" && <Lab />}
            {tab === "trenazer" && <Trenazer />}
            {tab === "kviz" && <QuizEngine questions={QUIZ} accentColor={PEN} />}
            {tab === "karticky" && <Karticky />}
            {tab === "vzorce" && <Vzorce />}
          </div>
        </main>
      </div>
    </div>
  );
}
