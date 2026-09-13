// @title Opakování 2. ročníku — geometrie, goniometrie, analytická geometrie
// @subject Math
// @topic Souhrnné opakování: planimetrie, goniometrie, analytická geometrie
// @template mixed

import { useState, useCallback, useMemo } from 'react';

// ══════════════════════════════════════════════════════════════════
// QUIZ ENGINE
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

function QuizEngine({ questions, accentColor = "#ec4899" }) {
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
  const score = shuffledQuestions.filter((qq, i) => revealed[i] && arrEqual(answers[i] || [], qq.correct)).length;
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
    setIdx(0); setAnswers({}); setRevealed({}); setPendingMulti([]);
    setShowResults(false); setShuffleKey(k => k + 1);
  }, []);

  if (showResults) {
    const msg = pct >= 90 ? "Výborně! Máš to perfektně zvládnuté!"
      : pct >= 70 ? "Dobře! Téměř máš vše zvládnuté."
      : pct >= 50 ? "Mohlo by to být lepší, ale jdeš správným směrem."
      : "Potřebuješ více přípravy. Opakuj a bude to!";
    return (
      <div style={S.resultsWrap}>
        <div style={S.resultsCard}>
          <div style={S.resultsScore}>{score} / {shuffledQuestions.length}</div>
          <div style={S.resultsPct}>{pct} %</div>
          <div style={S.resultsMsg}>{msg}</div>
          <button style={{ ...S.btn, background: accentColor + "66", border: `1px solid ${accentColor}` }} onClick={restart}>Začít znovu</button>
        </div>
      </div>
    );
  }

  const activeSet = isMulti ? (isRevealed ? myAnswer : pendingMulti) : myAnswer;

  return (
    <div style={S.wrap}>
      <div style={S.dotBar}>
        {shuffledQuestions.map((_, i) => {
          let bg = "#4b5563";
          if (i === idx) bg = accentColor;
          else if (revealed[i]) bg = arrEqual(answers[i] || [], shuffledQuestions[i].correct) ? "#22c55e" : "#ef4444";
          return <div key={i} onClick={() => goTo(i)} title={`Otázka ${i + 1}`} style={{ ...S.dot, background: bg }} />;
        })}
      </div>

      <div style={S.card}>
        <div style={S.qNum}>Otázka {idx + 1} / {shuffledQuestions.length}{isMulti ? " · více správných" : ""}</div>
        <div style={S.qText}>{q.question}</div>
        <div style={S.optionsList}>
          {q.options.map((opt, i) => {
            let border = "1px solid rgba(255,255,255,0.12)";
            let bg = "rgba(255,255,255,0.04)";
            if (isRevealed) {
              if (q.correct.includes(i)) { bg = "rgba(34,197,94,0.15)"; border = "1px solid #22c55e"; }
              else if (activeSet.includes(i)) { bg = "rgba(239,68,68,0.15)"; border = "1px solid #ef4444"; }
            } else if (activeSet.includes(i)) {
              bg = accentColor + "18"; border = `1px solid ${accentColor}`;
            }
            return (
              <div key={i} style={{ ...S.option, background: bg, border }} onClick={() => isMulti ? toggleMulti(i) : handleSingleSelect(i)}>
                {isMulti && <span style={S.checkbox}>{activeSet.includes(i) ? "☑" : "☐"}</span>}
                <span>{opt}</span>
              </div>
            );
          })}
        </div>
        {isMulti && !isRevealed && (
          <button style={{ ...S.btn, opacity: pendingMulti.length === 0 ? 0.4 : 1 }} onClick={submitMulti} disabled={pendingMulti.length === 0}>Potvrdit</button>
        )}
        {isRevealed && (
          <div style={{ ...S.feedback, borderColor: isCorrect ? "#22c55e" : "#ef4444" }}>
            <div style={S.feedbackHeader}>{isCorrect ? "Správně!" : "Špatně"}</div>
            {!isCorrect && <div style={S.feedbackCorrect}>Správná odpověď: {q.correct.map(i => q.options[i]).join(", ")}</div>}
            <div style={S.feedbackExplanation}>{q.explanation}</div>
            {q.tip && <div style={S.feedbackTip}>Tip: {q.tip}</div>}
          </div>
        )}
      </div>

      <div style={S.navRow}>
        <button style={S.btn} onClick={() => goTo(idx - 1)} disabled={idx === 0}>← Předchozí</button>
        {idx < shuffledQuestions.length - 1
          ? <button style={S.btn} onClick={() => goTo(idx + 1)}>Další →</button>
          : <button style={{ ...S.btn, background: accentColor + "55", border: `1px solid ${accentColor}` }} onClick={() => setShowResults(true)}>Výsledky →</button>}
      </div>
    </div>
  );
}

const S = {
  wrap: { display: "flex", flexDirection: "column", gap: "16px", maxWidth: "680px", margin: "0 auto", padding: "16px" },
  dotBar: { display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" },
  dot: { width: "22px", height: "22px", borderRadius: "50%", cursor: "pointer", transition: "background 0.4s ease" },
  card: { background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "24px", transition: "all 0.4s ease" },
  qNum: { color: "rgba(255,255,255,0.35)", fontSize: "13px", marginBottom: "6px" },
  qText: { color: "#fff", fontSize: "18px", fontWeight: 600, lineHeight: 1.5, marginBottom: "20px" },
  optionsList: { display: "flex", flexDirection: "column", gap: "10px" },
  option: { padding: "12px 16px", borderRadius: "12px", color: "#fff", cursor: "pointer", transition: "all 0.4s ease", display: "flex", alignItems: "center", gap: "10px", userSelect: "none", fontSize: "15px" },
  checkbox: { fontSize: "18px", minWidth: "20px", color: "rgba(255,255,255,0.7)" },
  btn: { marginTop: "12px", padding: "10px 22px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", color: "#fff", cursor: "pointer", fontSize: "15px", transition: "all 0.4s ease", fontFamily: "inherit" },
  feedback: { marginTop: "20px", padding: "16px", borderRadius: "14px", border: "1px solid", background: "rgba(255,255,255,0.03)" },
  feedbackHeader: { color: "#fff", fontWeight: 700, fontSize: "16px", marginBottom: "8px" },
  feedbackCorrect: { color: "#86efac", fontSize: "14px", marginBottom: "6px" },
  feedbackExplanation: { color: "rgba(255,255,255,0.7)", fontSize: "14px", lineHeight: 1.5 },
  feedbackTip: { color: "#fbbf24", fontSize: "13px", marginTop: "8px", fontStyle: "italic" },
  navRow: { display: "flex", justifyContent: "space-between" },
  resultsWrap: { display: "flex", alignItems: "center", justifyContent: "center", minHeight: "280px" },
  resultsCard: { textAlign: "center", background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "24px", padding: "40px 48px" },
  resultsScore: { color: "#fff", fontSize: "52px", fontWeight: 800, lineHeight: 1.1 },
  resultsPct: { color: "rgba(255,255,255,0.45)", fontSize: "22px", marginBottom: "16px" },
  resultsMsg: { color: "rgba(255,255,255,0.8)", fontSize: "17px", lineHeight: 1.5, marginBottom: "24px", maxWidth: "340px", margin: "0 auto 24px" },
};

// ══════════════════════════════════════════════════════════════════
// PALETA A SDÍLENÉ KOMPONENTY
// ══════════════════════════════════════════════════════════════════
const PINK = "#ec4899";
const CYAN = "#22d3ee";
const VIOLET = "#a855f7";
const AMBER = "#fbbf24";
const GREEN = "#22c55e";
const MONO = "'JetBrains Mono', monospace";
const HEAD = "'Audiowide', sans-serif";

const glass = {
  background: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "20px",
  transition: "all 0.4s ease",
};

function H2({ children, color = PINK }) {
  return <h2 style={{ fontFamily: HEAD, color: "#fff", fontSize: "clamp(16px,4vw,21px)", margin: "8px 0 16px", textShadow: `0 0 16px ${color}55` }}>{children}</h2>;
}

function Fx({ children, color = CYAN, block }) {
  return (
    <span style={{
      fontFamily: MONO, color, background: "rgba(255,255,255,0.05)",
      border: `1px solid ${color}33`, borderRadius: "8px",
      padding: block ? "10px 14px" : "2px 7px", fontSize: block ? "14px" : "13.5px",
      display: block ? "block" : "inline-block", margin: block ? "8px 0" : "1px 2px",
      lineHeight: 1.7, overflowX: "auto", whiteSpace: block ? "pre-wrap" : "normal",
    }}>{children}</span>
  );
}

function Collapse({ title, subtitle, color = PINK, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ ...glass, marginBottom: "14px", overflow: "hidden", borderColor: open ? color + "55" : "rgba(255,255,255,0.1)" }}>
      <div onClick={() => setOpen(o => !o)} style={{
        padding: "16px 20px", cursor: "pointer", display: "flex", alignItems: "center",
        gap: "12px", userSelect: "none", transition: "all 0.4s ease",
      }}>
        <span style={{ color, fontSize: "18px", transform: open ? "rotate(90deg)" : "none", transition: "transform 0.4s ease", display: "inline-block" }}>▸</span>
        <div style={{ flex: 1 }}>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: "15.5px" }}>{title}</div>
          {subtitle && <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "12.5px", marginTop: "3px" }}>{subtitle}</div>}
        </div>
      </div>
      {open && <div style={{ padding: "0 20px 20px", color: "rgba(255,255,255,0.78)", fontSize: "14.5px", lineHeight: 1.75 }}>{children}</div>}
    </div>
  );
}

const BADGES = {
  easy: { t: "Lehká ✨", c: GREEN },
  med: { t: "Střední ⚡", c: AMBER },
  hard: { t: "Těžká 🔥", c: "#f87171" },
};

function Badge({ level }) {
  const b = BADGES[level];
  return <span style={{
    fontSize: "11.5px", fontWeight: 700, color: b.c, background: b.c + "18",
    border: `1px solid ${b.c}55`, borderRadius: "999px", padding: "3px 10px", whiteSpace: "nowrap",
  }}>{b.t}</span>;
}

// ══════════════════════════════════════════════════════════════════
// OBRÁZKY (inline SVG)
// ══════════════════════════════════════════════════════════════════
const svgBox = { width: "100%", maxWidth: "340px", height: "auto", display: "block", margin: "12px auto" };
const sTxt = { fill: "#fff", fontSize: "11", fontFamily: "'Exo 2', sans-serif", fontWeight: 600 };
const sDim = { fill: CYAN, fontSize: "10", fontFamily: "'Exo 2', sans-serif" };
const sLine = { stroke: "rgba(255,255,255,0.75)", strokeWidth: 1.6, fill: "none" };

function FigCircleBisector() {
  // kružnice opsaná, △ABC, osa úhlu ACB protíná kružnici v D
  return (
    <svg viewBox="0 0 220 200" style={svgBox}>
      <circle cx="110" cy="100" r="72" stroke={VIOLET} strokeWidth="1.4" fill="none" opacity="0.8" />
      <polygon points="46,132 150,52 166,120" style={sLine} />
      <line x1="150" y1="52" x2="97" y2="171" stroke={PINK} strokeWidth="1.6" strokeDasharray="4 3" />
      <circle cx="46" cy="132" r="3" fill={CYAN} /><text x="30" y="142" style={sTxt}>A</text>
      <circle cx="166" cy="120" r="3" fill={CYAN} /><text x="174" y="124" style={sTxt}>B</text>
      <circle cx="150" cy="52" r="3" fill={CYAN} /><text x="154" y="44" style={sTxt}>C</text>
      <circle cx="97" cy="171" r="3" fill={PINK} /><text x="88" y="187" style={sTxt}>D</text>
      <text x="58" y="124" style={sDim}>46°</text>
      <text x="132" y="76" style={sDim}>60°</text>
      <text x="149" y="108" style={{ ...sDim, fill: PINK }}>φ</text>
    </svg>
  );
}

function FigRectTriangle() {
  // obdélník ABDE se stranami a, a-6; trojúhelník ABC
  return (
    <svg viewBox="0 0 240 150" style={svgBox}>
      <rect x="40" y="30" width="150" height="90" style={sLine} />
      <polygon points="40,120 190,120 100,30" fill={PINK} opacity="0.28" stroke={PINK} strokeWidth="1.6" />
      <text x="30" y="134" style={sTxt}>A</text><text x="192" y="134" style={sTxt}>B</text>
      <text x="192" y="26" style={sTxt}>D</text><text x="30" y="26" style={sTxt}>E</text>
      <text x="96" y="24" style={sTxt}>C</text>
      <text x="110" y="140" style={sDim}>a</text>
      <text x="4" y="78" style={sDim}>a − 6</text>
      <text x="98" y="90" style={{ ...sDim, fill: PINK }}>S = 20 cm²</text>
    </svg>
  );
}

function FigParcela() {
  return (
    <svg viewBox="0 0 250 160" style={svgBox}>
      <polygon points="25,135 200,140 165,35 60,60" style={sLine} />
      <line x1="25" y1="135" x2="165" y2="35" stroke={PINK} strokeWidth="1.7" strokeDasharray="5 3" />
      <text x="12" y="148" style={sTxt}>A</text><text x="204" y="150" style={sTxt}>B</text>
      <text x="168" y="30" style={sTxt}>C</text><text x="44" y="58" style={sTxt}>D</text>
      <text x="8" y="100" style={sDim}>31 m</text>
      <text x="98" y="42" style={sDim}>47 m</text>
      <text x="192" y="92" style={sDim}>55 m</text>
      <text x="63" y="80" style={{ ...sDim, fill: AMBER }}>120°</text>
      <text x="168" y="132" style={{ ...sDim, fill: AMBER }}>40°</text>
      <text x="78" y="105" style={{ ...sDim, fill: PINK }}>? </text>
    </svg>
  );
}

function FigTower() {
  return (
    <svg viewBox="0 0 260 150" style={svgBox}>
      <line x1="10" y1="130" x2="250" y2="130" stroke="rgba(255,255,255,0.5)" strokeWidth="1.4" />
      <path d="M40 130 L46 40 L44 26 L50 26 L50 34 L56 34 L56 26 L62 26 L62 34 L68 34 L68 26 L74 26 L72 40 L80 130 Z" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.6)" strokeWidth="1.3" />
      <line x1="74" y1="34" x2="200" y2="130" stroke={CYAN} strokeWidth="1.6" />
      <line x1="74" y1="34" x2="235" y2="130" stroke={CYAN} strokeWidth="1.6" />
      <text x="70" y="24" style={sTxt}>M</text>
      <text x="34" y="145" style={sTxt}>P</text><text x="76" y="145" style={sTxt}>Q</text>
      <text x="194" y="145" style={sTxt}>K</text><text x="236" y="145" style={sTxt}>L</text>
      <text x="212" y="145" style={sDim}>6 m</text>
      <text x="150" y="70" style={sDim}>55 m</text>
      <text x="176" y="122" style={{ ...sDim, fill: AMBER }}>55°</text>
      <text x="86" y="52" style={{ ...sDim, fill: PINK }}>φ</text>
    </svg>
  );
}

function FigRectCDE() {
  return (
    <svg viewBox="0 0 230 150" style={svgBox}>
      <rect x="30" y="30" width="165" height="95" style={sLine} />
      <polygon points="30,30 195,30 108,72" fill={PINK} opacity="0.28" stroke={PINK} strokeWidth="1.6" />
      <text x="18" y="26" style={sTxt}>D</text><text x="198" y="26" style={sTxt}>C</text>
      <text x="198" y="138" style={sTxt}>B</text><text x="18" y="138" style={sTxt}>A</text>
      <text x="104" y="88" style={sTxt}>E</text>
      <text x="52" y="60" style={sDim}>3 cm</text>
      <text x="146" y="60" style={sDim}>5 cm</text>
      <text x="200" y="82" style={sDim}>4 cm</text>
      <text x="98" y="46" style={{ ...sDim, fill: PINK }}>φ</text>
      <text x="82" y="115" style={{ ...sDim, fill: AMBER }}>S(ABCD) = 28 cm²</text>
    </svg>
  );
}

function FigClock() {
  const pts = {};
  [3, 6, 8].forEach(h => {
    const th = (90 - 30 * h) * Math.PI / 180;
    pts[h] = [100 + 70 * Math.cos(th), 100 - 70 * Math.sin(th)];
  });
  const nums = [];
  for (let h = 1; h <= 12; h++) {
    const th = (90 - 30 * h) * Math.PI / 180;
    nums.push(<text key={h} x={100 + 84 * Math.cos(th)} y={100 - 84 * Math.sin(th) + 4}
      textAnchor="middle" style={{ ...sTxt, fontSize: 10, fill: [3, 6, 8].includes(h) ? PINK : "rgba(255,255,255,0.4)" }}>{h}</text>);
  }
  return (
    <svg viewBox="0 0 200 200" style={{ ...svgBox, maxWidth: "260px" }}>
      <circle cx="100" cy="100" r="70" stroke="rgba(255,255,255,0.35)" strokeWidth="1.4" fill="none" />
      {nums}
      <polygon points={`${pts[3]} ${pts[6]} ${pts[8]}`} fill={CYAN} opacity="0.16" stroke={CYAN} strokeWidth="1.7" />
      {[3, 6, 8].map(h => <circle key={h} cx={pts[h][0]} cy={pts[h][1]} r="3.5" fill={PINK} />)}
      <circle cx="100" cy="100" r="2.5" fill="rgba(255,255,255,0.5)" />
    </svg>
  );
}

function FigTriSSA() {
  return (
    <svg viewBox="0 0 250 140" style={svgBox}>
      <polygon points="25,115 205,115 175,32" style={sLine} />
      <text x="14" y="128" style={sTxt}>A</text>
      <text x="208" y="128" style={sTxt}>B</text>
      <text x="178" y="26" style={sTxt}>C</text>
      <text x="105" y="130" style={sDim}>c = |AB| = 7 cm</text>
      <text x="196" y="80" style={sDim}>a = 5</text>
      <text x="84" y="72" style={sDim}>b = ?</text>
      <text x="32" y="107" style={{ ...sDim, fill: AMBER }}>α</text>
      <text x="188" y="108" style={{ ...sDim, fill: AMBER }}>β</text>
      <text x="170" y="48" style={{ ...sDim, fill: PINK }}>γ = 30°</text>
    </svg>
  );
}

function FigVyska() {
  return (
    <svg viewBox="0 0 250 140" style={svgBox}>
      <polygon points="45,115 215,115 100,40" style={sLine} />
      <line x1="100" y1="40" x2="100" y2="115" stroke={PINK} strokeWidth="1.5" strokeDasharray="4 3" />
      <rect x="100" y="106" width="9" height="9" fill="none" stroke={PINK} strokeWidth="1" />
      <text x="34" y="128" style={sTxt}>B</text>
      <text x="218" y="128" style={sTxt}>C</text>
      <text x="96" y="34" style={sTxt}>A</text>
      <text x="118" y="130" style={sDim}>a = |BC| = 7 cm</text>
      <text x="52" y="72" style={sDim}>c = |BA| = 6</text>
      <text x="104" y="84" style={{ ...sDim, fill: PINK }}>vₐ = 4</text>
    </svg>
  );
}

// ══════════════════════════════════════════════════════════════════
// KOMPONENTA ŘEŠENÉ ÚLOHY
// ══════════════════════════════════════════════════════════════════
function Problem({ p, accent = PINK }) {
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState("");
  const [state, setState] = useState(null); // 'ok' | 'no'

  const check = () => {
    if (!p.answer) return;
    const num = parseFloat(val.replace(",", ".").trim());
    if (isNaN(num)) { setState("no"); return; }
    setState(Math.abs(num - p.answer.value) <= p.answer.tol ? "ok" : "no");
  };

  return (
    <div style={{ ...glass, padding: "18px 20px", marginBottom: "16px", borderColor: open ? accent + "44" : "rgba(255,255,255,0.1)" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", flexWrap: "wrap", marginBottom: "10px" }}>
        <span style={{ fontFamily: HEAD, color: accent, fontSize: "13px" }}>{p.id}</span>
        <Badge level={p.badge} />
        <span style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.35)", marginLeft: "auto" }}>{p.source}</span>
      </div>

      <div style={{ color: "#fff", fontSize: "15px", lineHeight: 1.65, fontWeight: 500 }}>{p.text}</div>
      {p.fig}

      {p.answer && (
        <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "14px", flexWrap: "wrap" }}>
          <input
            value={val}
            onChange={e => { setVal(e.target.value); setState(null); }}
            onKeyDown={e => { if (e.key === "Enter") check(); }}
            placeholder={p.answer.label || "výsledek"}
            style={{
              flex: "1 1 130px", minWidth: 0, padding: "9px 12px", borderRadius: "10px", fontFamily: MONO,
              background: "rgba(255,255,255,0.06)", color: "#fff", fontSize: "14px",
              border: `1px solid ${state === "ok" ? GREEN : state === "no" ? "#ef4444" : "rgba(255,255,255,0.15)"}`,
              outline: "none", transition: "all 0.4s ease",
            }}
          />
          {p.answer.unit && <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "13px" }}>{p.answer.unit}</span>}
          <button onClick={check} style={{ ...S.btn, marginTop: 0, padding: "9px 16px", fontSize: "13.5px" }}>Zkontrolovat</button>
          {state === "ok" && <span style={{ color: GREEN, fontSize: "14px", fontWeight: 700 }}>✓ Správně</span>}
          {state === "no" && <span style={{ color: "#f87171", fontSize: "14px", fontWeight: 700 }}>✗ Zkus to znovu</span>}
        </div>
      )}

      <button onClick={() => setOpen(o => !o)} style={{
        ...S.btn, marginTop: "14px", width: "100%", padding: "10px",
        background: open ? accent + "22" : "rgba(255,255,255,0.07)",
        border: `1px solid ${open ? accent + "66" : "rgba(255,255,255,0.15)"}`, fontSize: "14px",
      }}>{open ? "▲ Skrýt řešení" : "▼ Zobrazit řešení"}</button>

      {open && (
        <div style={{ marginTop: "14px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "14px", fontSize: "14px", lineHeight: 1.75, color: "rgba(255,255,255,0.78)" }}>
          <div style={{ marginBottom: "10px" }}>
            <span style={{ color: CYAN, fontWeight: 700, fontSize: "12.5px", letterSpacing: "0.5px" }}>ZADÁNO</span>
            <div>{p.given}</div>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <span style={{ color: VIOLET, fontWeight: 700, fontSize: "12.5px", letterSpacing: "0.5px" }}>POUŽIJEME</span>
            <div>{p.formula}</div>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <span style={{ color: AMBER, fontWeight: 700, fontSize: "12.5px", letterSpacing: "0.5px" }}>POSTUP</span>
            <ol style={{ margin: "6px 0 0", paddingLeft: "20px" }}>
              {p.steps.map((s, i) => <li key={i} style={{ marginBottom: "7px" }}>{s}</li>)}
            </ol>
          </div>
          <div style={{
            marginTop: "14px", padding: "12px 14px", borderRadius: "12px",
            background: GREEN + "14", border: `1px solid ${GREEN}55`, color: "#fff", fontWeight: 600,
          }}>
            <span style={{ color: GREEN, fontSize: "12.5px", fontWeight: 700, letterSpacing: "0.5px", display: "block", marginBottom: "4px" }}>VÝSLEDEK</span>
            {p.result}
          </div>
          {p.note && <div style={{ marginTop: "10px", color: AMBER, fontSize: "13px", fontStyle: "italic" }}>Pozor: {p.note}</div>}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// TEORIE
// ══════════════════════════════════════════════════════════════════
function TeorieTab() {
  return (
    <div style={{ maxWidth: "760px", margin: "0 auto", padding: "16px" }}>
      <div style={{ ...glass, padding: "16px 20px", marginBottom: "18px", borderColor: PINK + "44" }}>
        <div style={{ fontFamily: HEAD, color: PINK, fontSize: "14px", marginBottom: "8px" }}>Co bude v písemce</div>
        <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "14px", lineHeight: 1.7 }}>
          Tři okruhy: <b style={{ color: "#fff" }}>planimetrie</b> (pravoúhlý i obecný trojúhelník, podobnost, obvodový úhel),
          {" "}<b style={{ color: "#fff" }}>goniometrie</b> (vzorce, výrazy, rovnice, funkce) a
          {" "}<b style={{ color: "#fff" }}>analytická geometrie</b> (body, vektory, přímka, kružnice).
          Povolené pomůcky: kalkulačka, papír se vzorci, tabulky. Rýsování jen jako bonus.
        </div>
      </div>

      <H2 color={CYAN}>1 · Pravoúhlý trojúhelník</H2>
      <Collapse title="Pythagorova věta" subtitle="vztah mezi odvěsnami a přeponou" color={CYAN} defaultOpen>
        V pravoúhlém trojúhelníku s pravým úhlem u vrcholu C (odvěsny <i>a</i>, <i>b</i>, přepona <i>c</i>) platí:
        <Fx block>a² + b² = c²</Fx>
        Platí i obráceně: pokud v trojúhelníku platí a² + b² = c², je trojúhelník pravoúhlý (obrácená Pythagorova věta) — tím se ověřuje pravoúhlost.
        <div style={{ marginTop: "10px" }}>
          <b style={{ color: "#fff" }}>Pythagorejské trojice</b> (vyplatí se znát nazpaměť, ušetří čas):
          <Fx block color={AMBER}>3–4–5 · 5–12–13 · 8–15–17 · 7–24–25{"\n"}a jejich násobky: 6–8–10, 9–12–15, 10–24–26 …</Fx>
        </div>
      </Collapse>

      <Collapse title="Euklidovy věty" subtitle="věta o výšce a věta o odvěsně" color={CYAN}>
        Výška <i>v<sub>c</sub></i> z pravého úhlu rozdělí přeponu <i>c</i> na úseky <i>c<sub>a</sub></i> (přiléhá k <i>a</i>) a <i>c<sub>b</sub></i> (přiléhá k <i>b</i>).
        <Fx block>Věta o výšce:    v_c² = c_a · c_b{"\n"}Věta o odvěsně:  a² = c_a · c     b² = c_b · c{"\n"}Navíc platí:     c = c_a + c_b   a  a·b = c·v_c</Fx>
        <b style={{ color: "#fff" }}>Jak si je zapamatovat:</b> výška je geometrickým průměrem obou úseků přepony; odvěsna je geometrickým průměrem „svého" úseku a celé přepony. Vzorec <Fx>a·b = c·v_c</Fx> plyne z toho, že obsah lze spočítat dvěma způsoby.
      </Collapse>

      <Collapse title="Goniometrické poměry v pravoúhlém trojúhelníku" color={CYAN}>
        Pro ostrý úhel α v pravoúhlém trojúhelníku:
        <Fx block>sin α = protilehlá / přepona{"\n"}cos α = přilehlá  / přepona{"\n"}tg  α = protilehlá / přilehlá{"\n"}cotg α = přilehlá / protilehlá</Fx>
        Mnemotechnika: <b style={{ color: AMBER }}>SOH-CAH-TOA</b>. Pozor — tyto poměry platí <b>jen</b> v pravoúhlém trojúhelníku. V obecném trojúhelníku musíš použít sinovou nebo kosinovou větu.
      </Collapse>

      <H2 color={VIOLET}>2 · Podobnost</H2>
      <Collapse title="Věty o podobnosti a poměr podobnosti" color={VIOLET}>
        Dva trojúhelníky jsou podobné, pokud mají shodné úhly a poměry odpovídajících stran jsou stejné. Stačí ověřit jednu z vět:
        <Fx block>sss — poměry všech tří dvojic stran jsou stejné{"\n"}sus — poměr dvou stran + shodný úhel jimi sevřený{"\n"}uu  — shodují se ve dvou úhlech</Fx>
        <b style={{ color: "#fff" }}>Poměr podobnosti k</b> = poměr odpovídajících stran. Potom:
        <Fx block color={AMBER}>délky (obvod, výšky, těžnice) …  k{"\n"}obsahy …                        k²{"\n"}objemy (u těles) …              k³</Fx>
        Nejčastější úlohy: výška stromu ze stínu, měření nepřístupné vzdálenosti, dělení úsečky v daném poměru.
      </Collapse>

      <Collapse title="Thaletova věta" color={VIOLET}>
        Všechny úhly nad průměrem kružnice jsou pravé. Přesněji: je-li AB průměr kružnice k a bod C leží na k (C ≠ A, B), pak úhel ACB je pravý.
        <Fx block>|∠ACB| = 90°  ⟺  C leží na Thaletově kružnici nad AB</Fx>
        Je to speciální případ věty o obvodovém úhlu — středový úhel nad průměrem je 180°, obvodový tedy 90°. Používá se hlavně v konstrukčních úlohách (sestrojit pravoúhlý trojúhelník, tečnu z bodu ke kružnici).
      </Collapse>

      <H2 color={AMBER}>3 · Obvodový a středový úhel</H2>
      <Collapse title="Věta o obvodovém a středovém úhlu" color={AMBER} defaultOpen>
        <Fx block>Středový úhel je dvojnásobkem obvodového úhlu{"\n"}příslušejícího témuž oblouku:   ω = 2 · φ</Fx>
        Důsledky, které se na testu hodí nejvíc:
        <ul style={{ paddingLeft: "20px", margin: "8px 0" }}>
          <li><b style={{ color: "#fff" }}>Všechny obvodové úhly nad stejným obloukem jsou shodné.</b> Pokud dva vrcholy „vidí" tutéž tětivu ze stejné strany, mají stejný úhel.</li>
          <li>Obvodový úhel nad průměrem = 90° (Thales).</li>
          <li><b style={{ color: "#fff" }}>Tětivový čtyřúhelník:</b> součet protilehlých úhlů = 180°. Každý čtyřúhelník vepsaný do kružnice tuto vlastnost má.</li>
          <li>Delšímu oblouku odpovídá větší obvodový úhel.</li>
        </ul>
        <div style={{ color: AMBER, fontSize: "13.5px", fontStyle: "italic" }}>
          Postup u úloh: najdi oblouk, kterému úhel přísluší → spočítej jeho středový úhel → vyděl dvěma. Nebo: dva úhly nad stejnou tětivou jsou shodné.
        </div>
      </Collapse>

      <H2 color={PINK}>4 · Obecný trojúhelník</H2>
      <Collapse title="Sinová věta" color={PINK} defaultOpen>
        <Fx block>a / sin α = b / sin β = c / sin γ = 2r</Fx>
        (<i>r</i> je poloměr kružnice opsané — proto se sinová věta často objevuje v úlohách s kružnicí opsanou.)
        <div style={{ marginTop: "8px" }}>
          <b style={{ color: "#fff" }}>Kdy použít:</b> znám <b>stranu a protilehlý úhel</b> (tvoří dvojici) a k tomu ještě jednu stranu nebo úhel. Tedy případy <b>usu / Ssu</b>.
        </div>
        <div style={{ marginTop: "10px", padding: "12px 14px", borderRadius: "12px", background: "#f8717115", border: "1px solid #f8717155" }}>
          <b style={{ color: "#f87171" }}>Past — dvě řešení (případ SSA):</b> pokud počítáš úhel ze sinu, existují v intervalu (0°; 180°) <b>dvě</b> hodnoty se stejným sinem: α a 180° − α.
          Vždy ověř, zda i ta druhá dává součet úhlů menší než 180°. Pokud ano, úloha má <b>dvě řešení</b>.
          Když je hledaná strana <b>delší</b> než ta protilehlá známému úhlu, řešení je jediné.
        </div>
      </Collapse>

      <Collapse title="Kosinová věta" color={PINK}>
        <Fx block>a² = b² + c² − 2bc · cos α{"\n"}b² = a² + c² − 2ac · cos β{"\n"}c² = a² + b² − 2ab · cos γ</Fx>
        <b style={{ color: "#fff" }}>Kdy použít:</b> případy <b>sus</b> (dvě strany a úhel mezi nimi → dopočítám třetí stranu) a <b>sss</b> (tři strany → dopočítám úhel).
        <div style={{ marginTop: "8px" }}>Vyjádření úhlu ze tří stran:</div>
        <Fx block color={AMBER}>cos α = (b² + c² − a²) / (2bc)</Fx>
        <div style={{ color: CYAN, fontSize: "13.5px" }}>
          Výhoda proti sinové větě: kosinus rozliší ostrý a tupý úhel jednoznačně (záporný kosinus = tupý úhel), takže tu <b>žádná dvojznačnost není</b>. Pro γ = 90° se vzorec redukuje na Pythagorovu větu.
        </div>
      </Collapse>

      <Collapse title="Obsah trojúhelníku — všechny vzorce" color={PINK}>
        <Fx block>S = ½ · a · v_a                (základna × výška){"\n"}S = ½ · a · b · sin γ         (dvě strany a úhel mezi nimi){"\n"}S = abc / (4r)                (r … kružnice opsaná){"\n"}S = ρ · s,  s = (a+b+c)/2     (ρ … kružnice vepsaná){"\n"}S = √(s(s−a)(s−b)(s−c))       (Heronův vzorec)</Fx>
        Vzorec <Fx>S = ½ab·sin γ</Fx> je hlavní pracovní nástroj — často je zadaný obsah a hledá se úhel, nebo naopak.
      </Collapse>

      <H2 color={CYAN}>5 · Goniometrie</H2>
      <Collapse title="Jednotková kružnice a znaménka" color={CYAN} defaultOpen>
        Na jednotkové kružnici je <Fx>cos x</Fx> x-ová souřadnice a <Fx>sin x</Fx> y-ová souřadnice bodu.
        <Fx block>I. kvadrant   (0 – 90°)     vše kladné{"\n"}II. kvadrant  (90 – 180°)   jen sin kladný{"\n"}III. kvadrant (180 – 270°)  sin i cos záporné, tg kladná{"\n"}IV. kvadrant  (270 – 360°)  jen cos kladný</Fx>
        <b style={{ color: AMBER }}>Vztahy pro převod (nejčastější zdroj chyb):</b>
        <Fx block>sin(180° − x) = sin x        cos(180° − x) = −cos x{"\n"}sin(−x) = −sin x             cos(−x) = cos x{"\n"}sin(90° − x) = cos x         cos(90° − x) = sin x</Fx>
      </Collapse>

      <Collapse title="Základní identity a vzorce" color={CYAN}>
        <Fx block>sin²x + cos²x = 1        ⟹  sin²x = 1 − cos²x{"\n"}tg x = sin x / cos x     cotg x = cos x / sin x{"\n"}tg x · cotg x = 1</Fx>
        <b style={{ color: "#fff" }}>Dvojnásobný argument:</b>
        <Fx block>sin 2x = 2 · sin x · cos x{"\n"}cos 2x = cos²x − sin²x = 1 − 2sin²x = 2cos²x − 1</Fx>
        <b style={{ color: "#fff" }}>Součtové vzorce:</b>
        <Fx block>sin(x ± y) = sin x·cos y ± cos x·sin y{"\n"}cos(x ± y) = cos x·cos y ∓ sin x·sin y</Fx>
      </Collapse>

      <Collapse title="Úprava goniometrických výrazů" color={CYAN}>
        Postup, který funguje skoro vždy:
        <ol style={{ paddingLeft: "20px" }}>
          <li>Rozšiř / roznásob zlomky, hledej vzorec <Fx>(a−b)(a+b) = a² − b²</Fx>.</li>
          <li>Nahraď <Fx>1 − sin²x → cos²x</Fx> nebo <Fx>1 − cos²x → sin²x</Fx>.</li>
          <li>Převeď tg a cotg na sin a cos.</li>
          <li>Krať.</li>
        </ol>
        <b style={{ color: "#f87171" }}>Podmínky nezapomeň!</b> Jmenovatel ≠ 0. Typicky:
        <Fx block color={AMBER}>cos x ≠ 0  ⟹  x ≠ π/2 + kπ{"\n"}sin x ≠ 0  ⟹  x ≠ kπ{"\n"}1 − sin x ≠ 0 ⟹ x ≠ π/2 + 2kπ{"\n"}1 + sin x ≠ 0 ⟹ x ≠ 3π/2 + 2kπ</Fx>
        Podmínky se určují <b>ze zadání před úpravou</b>, ne z výsledku!
      </Collapse>

      <Collapse title="Goniometrické rovnice" color={CYAN}>
        <b style={{ color: "#fff" }}>Typ 1 — základní:</b> <Fx>sin x = a</Fx>. Najdi základní řešení, pak přidej periodu.
        <Fx block>sin x = a → x = x₀ + 2kπ  a  x = π − x₀ + 2kπ{"\n"}cos x = a → x = ±x₀ + 2kπ{"\n"}tg  x = a → x = x₀ + kπ</Fx>
        <b style={{ color: "#fff" }}>Typ 2 — kvadratická v jedné funkci:</b> je-li v rovnici <Fx>sin²x</Fx> i <Fx>cos x</Fx>, převeď vše na jednu funkci pomocí <Fx>sin²x = 1 − cos²x</Fx>, substituuj <Fx>t = cos x</Fx> a řeš kvadratickou rovnici.
        <div style={{ marginTop: "8px", color: "#f87171" }}>Po vyřešení <b>vždy ověř, že |t| ≤ 1</b> — kořen mimo ⟨−1; 1⟩ nedává žádné x.</div>
        <b style={{ color: "#fff", display: "block", marginTop: "10px" }}>Typ 3 — součin = 0:</b> rozlož na součin a řeš každý činitel zvlášť.
        <div style={{ marginTop: "10px", color: AMBER, fontSize: "13.5px" }}>
          Řešíš-li na daném intervalu (např. ⟨2π; 4π⟩), napiš nejdřív obecné řešení s <i>k</i> a pak dosazuj k = 0, 1, 2 … a vybírej ta x, která do intervalu padnou.
        </div>
      </Collapse>

      <Collapse title="Goniometrické funkce — vlastnosti a grafy" color={CYAN}>
        <Fx block>funkce   D(f)              H(f)         perioda{"\n"}sin x    ℝ                 ⟨−1; 1⟩      2π{"\n"}cos x    ℝ                 ⟨−1; 1⟩      2π{"\n"}tg  x    ℝ \ {"{"}π/2 + kπ{"}"}     ℝ            π{"\n"}cotg x   ℝ \ {"{"}kπ{"}"}          ℝ            π</Fx>
        <b style={{ color: "#fff" }}>Transformace</b> u <Fx>y = a · sin(bx + c) + d</Fx>:
        <Fx block color={AMBER}>a … amplituda, H(f) = ⟨d − |a|; d + |a|⟩{"\n"}b … mění periodu na 2π / |b|{"\n"}c … posun doleva o c/b{"\n"}d … posun nahoru o d</Fx>
        sin je lichá (<Fx>sin(−x) = −sin x</Fx>, souměrná podle počátku), cos je sudá (<Fx>cos(−x) = cos x</Fx>, souměrná podle osy y).
      </Collapse>

      <H2 color={VIOLET}>6 · Analytická geometrie — body a vektory</H2>
      <Collapse title="Body: vzdálenost, střed, dělicí poměr" color={VIOLET} defaultOpen>
        <Fx block>Vektor:        u = B − A = (b₁ − a₁ ; b₂ − a₂){"\n"}Vzdálenost:    |AB| = √((b₁−a₁)² + (b₂−a₂)²){"\n"}Střed úsečky:  S = ((a₁+b₁)/2 ; (a₂+b₂)/2)</Fx>
        <b style={{ color: "#fff" }}>Zpětný výpočet:</b> znám-li střed S a jeden krajní bod B, druhý dopočítám jako
        <Fx block color={AMBER}>A = 2S − B</Fx>
        <b style={{ color: "#fff" }}>Rovnoběžník ABCD:</b> platí <Fx>B − A = C − D</Fx>, tedy
        <Fx block color={AMBER}>D = A + C − B</Fx>
        (Pozor na pořadí vrcholů! U ABCD jsou protilehlé strany AB a DC.) Ekvivalentně: úhlopříčky se půlí, takže střed AC = střed BD.
      </Collapse>

      <Collapse title="Skalární součin, odchylka vektorů, kolmost" color={VIOLET}>
        <Fx block>u · v = u₁v₁ + u₂v₂ = |u| · |v| · cos φ</Fx>
        <b style={{ color: "#fff" }}>Kolmost:</b> <Fx>u ⊥ v ⟺ u · v = 0</Fx>. To je nejrychlejší způsob, jak najít neznámý parametr — dosaď do skalárního součinu a polož ho rovný nule.
        <div style={{ marginTop: "8px" }}><b style={{ color: "#fff" }}>Odchylka dvou vektorů:</b></div>
        <Fx block>cos φ = (u · v) / (|u| · |v|)</Fx>
        <div style={{ color: "#f87171", fontSize: "13.5px", marginTop: "6px" }}>
          Rozlišuj: <b>odchylka vektorů</b> může být 0°–180° (může vyjít tupý úhel), ale <b>odchylka přímek</b> je vždy 0°–90°, proto se tam bere absolutní hodnota.
        </div>
        <div style={{ marginTop: "8px" }}>Kolmý vektor k <Fx>u = (u₁; u₂)</Fx> je <Fx>n = (−u₂; u₁)</Fx> — prohodíš souřadnice a u jedné změníš znaménko.</div>
      </Collapse>

      <H2 color={PINK}>7 · Analytická geometrie — přímka</H2>
      <Collapse title="Tři tvary rovnice přímky" color={PINK} defaultOpen>
        <Fx block>Parametrické:  x = a₁ + s₁·t ,  y = a₂ + s₂·t ,  t ∈ ℝ{"\n"}               A … bod na přímce, s = (s₁; s₂) … směrový vektor{"\n\n"}Obecná:        ax + by + c = 0{"\n"}               n = (a; b) … NORMÁLOVÝ vektor (kolmý k přímce){"\n"}               s = (−b; a) … směrový vektor{"\n\n"}Směrnicová:    y = kx + q ,  k = tg α (α … úhel s osou x)</Fx>
        <b style={{ color: "#fff" }}>Převody:</b> z parametrických na obecnou → vyjádři <i>t</i> z jedné rovnice a dosaď do druhé (nebo použij normálový vektor kolmý ke směrovému). Z obecné na směrnicovou → vyjádři <i>y</i>.
        <div style={{ marginTop: "8px", color: AMBER }}>
          Přímka rovnoběžná s osou x: <Fx color={AMBER}>y = konstanta</Fx> (směr (1; 0)).
          Přímka rovnoběžná s osou y: <Fx color={AMBER}>x = konstanta</Fx> (směr (0; 1)).
        </div>
      </Collapse>

      <Collapse title="Vzdálenost bodu od přímky, osa úsečky" color={PINK}>
        <Fx block>d(A, p) = |a·x₀ + b·y₀ + c| / √(a² + b²){"\n"}kde A = [x₀; y₀] a p: ax + by + c = 0</Fx>
        <b style={{ color: "#f87171" }}>Nutná podmínka:</b> přímka musí být v <b>obecném tvaru s nulou na pravé straně</b>. Jinak vzorec nefunguje.
        <div style={{ marginTop: "10px" }}>
          <b style={{ color: "#fff" }}>Vzdálenost dvou rovnoběžek:</b> zvol libovolný bod na jedné a spočítej jeho vzdálenost od druhé.
        </div>
        <div style={{ marginTop: "10px" }}>
          <b style={{ color: "#fff" }}>Osa úsečky AB</b> = množina bodů stejně vzdálených od A i B. Prochází středem S a je kolmá na AB, takže:
          <Fx block color={AMBER}>normálový vektor osy = vektor AB{"\n"}bod osy = střed úsečky S</Fx>
        </div>
      </Collapse>

      <Collapse title="Vzájemná poloha dvou přímek a odchylka" color={PINK}>
        Porovnej směrové (nebo normálové) vektory:
        <Fx block>s₁ ∦ s₂  →  RŮZNOBĚŽNÉ  (jeden průsečík){"\n"}s₁ ∥ s₂  →  a) bod jedné leží na druhé → TOTOŽNÉ{"\n"}            b) neleží → ROVNOBĚŽNÉ RŮZNÉ (žádný průsečík)</Fx>
        Rovnoběžnost poznáš i z obecných rovnic: koeficienty u <i>x</i> a <i>y</i> jsou ve stejném poměru (např. 3x − y + 5 = 0 a 6x − 2y − 13 = 0).
        <div style={{ marginTop: "10px" }}><b style={{ color: "#fff" }}>Průsečík:</b> vyřeš soustavu obou rovnic. U parametrické + obecné stačí dosadit <i>x</i>, <i>y</i> z parametrických do obecné a vypočítat <i>t</i>.</div>
        <div style={{ marginTop: "10px" }}><b style={{ color: "#fff" }}>Odchylka přímek:</b></div>
        <Fx block>cos φ = |s₁ · s₂| / (|s₁| · |s₂|)      (nebo stejně s normálovými vektory)</Fx>
        <div style={{ color: CYAN, fontSize: "13.5px" }}>Absolutní hodnota zaručí φ ∈ ⟨0°; 90°⟩. Rovnoběžky mají odchylku 0°, kolmice 90°.</div>
        <div style={{ marginTop: "8px" }}><b style={{ color: "#fff" }}>Úhel přímky s osou x</b> = arctg |k|, kde k je směrnice.</div>
      </Collapse>

      <H2 color={GREEN}>8 · Analytická geometrie — kružnice</H2>
      <Collapse title="Rovnice kružnice a doplnění na čtverec" color={GREEN} defaultOpen>
        <Fx block>Středová:  (x − m)² + (y − n)² = r²      S = [m; n], poloměr r{"\n"}Obecná:    x² + y² + Dx + Ey + F = 0</Fx>
        <b style={{ color: "#fff" }}>Z obecné na středovou — doplnění na čtverec:</b>
        <Fx block color={AMBER}>x² − 4x  =  (x − 2)² − 4{"\n"}(polovinu koeficientu u x dáš do závorky, její druhou{"\n"} mocninu zase odečteš)</Fx>
        Příklad: <Fx>x² + y² − 4x + 6y − 12 = 0</Fx> → <Fx>(x−2)² − 4 + (y+3)² − 9 − 12 = 0</Fx> → <Fx>(x−2)² + (y+3)² = 25</Fx>, tedy S = [2; −3], r = 5.
        <div style={{ marginTop: "8px", color: "#f87171" }}>Vyjde-li vpravo <b>záporné číslo</b>, není to kružnice (prázdná množina); vyjde-li <b>nula</b>, je to jediný bod.</div>
      </Collapse>

      <Collapse title="Vzájemná poloha přímky a kružnice, tečna" color={GREEN}>
        Spočítej vzdálenost středu od přímky a porovnej s poloměrem:
        <Fx block>d &lt; r  →  SEČNA   (dva průsečíky){"\n"}d = r  →  TEČNA   (jeden dotykový bod){"\n"}d &gt; r  →  VNĚJŠÍ PŘÍMKA (žádný průsečík)</Fx>
        <b style={{ color: "#fff" }}>Tečna v bodě T ležícím na kružnici:</b> normálový vektor tečny je vektor <Fx>ST</Fx>, tečna prochází bodem T.
        <Fx block color={AMBER}>t: (t₁ − m)(x − t₁) + (t₂ − n)(y − t₂) = 0</Fx>
        Nezapomeň nejdřív ověřit, že T na kružnici opravdu leží (dosaď do rovnice).
      </Collapse>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// ŘEŠENÉ ÚLOHY
// ══════════════════════════════════════════════════════════════════
const PLANIM = [
  {
    id: "P1", badge: "hard", source: "PL 3. roč. — úloha 1",
    text: "V trojúhelníku ABC platí |∠BAC| = 46° a |∠ACB| = 60°. Osa vnitřního úhlu ACB protíná kružnici trojúhelníku ABC opsanou v bodech C, D. Vypočtěte velikost úhlu φ = |∠CBD|.",
    fig: <FigCircleBisector />,
    answer: { value: 104, tol: 0.5, unit: "°", label: "φ ve stupních" },
    given: "α = |∠BAC| = 46°, γ = |∠ACB| = 60°; CD je osa úhlu γ, D leží na kružnici opsané.",
    formula: "Součet úhlů v trojúhelníku + věta o obvodovém úhlu (obvodové úhly nad stejnou tětivou jsou shodné).",
    steps: [
      <>Osa úhlu γ ho půlí: <Fx>|∠ACD| = |∠DCB| = 60° / 2 = 30°</Fx></>,
      <>Body A a D leží na kružnici na téže straně tětivy CB, takže úhly <Fx>∠CAB</Fx> a <Fx>∠CDB</Fx> jsou obvodové úhly nad stejným obloukem CB, tedy shodné: <Fx>|∠CDB| = |∠CAB| = 46°</Fx></>,
      <>V trojúhelníku BCD teď znám dva úhly: u vrcholu C je 30°, u vrcholu D je 46°.</>,
      <><Fx>φ = |∠CBD| = 180° − 30° − 46° = 104°</Fx></>,
    ],
    result: "φ = 104°",
    note: "Alternativní postup: β = 180° − 46° − 60° = 74°; D je střed oblouku AB, takže |∠ABD| = 30° a φ = 74° + 30° = 104°. Vyjde totéž.",
  },
  {
    id: "P2", badge: "med", source: "PL 3. roč. — úloha 2",
    text: "Obsah vyznačeného trojúhelníku ABC je 20 cm². Určete obvod obdélníku ABDE.",
    fig: <FigRectTriangle />,
    answer: { value: 28, tol: 0.01, unit: "cm", label: "obvod v cm" },
    given: "Obdélník ABDE má strany |AB| = a a |AE| = a − 6. Trojúhelník ABC má základnu AB a vrchol C na protilehlé straně, tedy jeho výška je rovna výšce obdélníku. S = 20 cm².",
    formula: "S = ½ · základna · výška, pak kvadratická rovnice.",
    steps: [
      <>Výška trojúhelníku ke straně AB = výška obdélníku = <Fx>a − 6</Fx>.</>,
      <><Fx>S = ½ · a · (a − 6) = 20</Fx></>,
      <><Fx>a(a − 6) = 40  ⟹  a² − 6a − 40 = 0</Fx></>,
      <>Diskriminant: <Fx>D = 36 + 160 = 196, √D = 14</Fx></>,
      <><Fx>a = (6 ± 14) / 2 ⟹ a₁ = 10, a₂ = −4</Fx>. Záporná délka nedává smysl, takže <b>a = 10 cm</b>.</>,
      <>Strany obdélníku: <Fx>10 cm</Fx> a <Fx>10 − 6 = 4 cm</Fx></>,
      <><Fx>o = 2 · (10 + 4) = 28 cm</Fx></>,
    ],
    result: "Obvod obdélníku ABDE je 28 cm (strany 10 cm a 4 cm).",
    note: "Nezapomeň záporný kořen vyloučit a odpovědět na to, co se ptá — tj. na obvod, ne na stranu a.",
  },
  {
    id: "P3", badge: "easy", source: "PL 3. roč. — úloha 5",
    text: "Na obrázku je plán stavební parcely ABCD s některými údaji. Vypočtěte vzdálenost bodů A a C.",
    fig: <FigParcela />,
    answer: { value: 68.02, tol: 0.3, unit: "m", label: "|AC| v metrech" },
    given: "|AD| = 31 m, |DC| = 47 m, |∠ADC| = 120°. (Údaje |CB| = 55 m a 40° u vrcholu B se pro tuto podotázku nepoužijí.)",
    formula: "Kosinová věta v trojúhelníku ACD — znám dvě strany a úhel jimi sevřený (případ sus).",
    steps: [
      <>Úhlopříčka AC rozdělí čtyřúhelník na trojúhelníky ACD a ABC. Pracuji s ACD, kde znám sus.</>,
      <><Fx>|AC|² = |AD|² + |DC|² − 2·|AD|·|DC|·cos 120°</Fx></>,
      <><Fx>|AC|² = 31² + 47² − 2 · 31 · 47 · cos 120°</Fx></>,
      <><Fx>cos 120° = −0,5</Fx>, takže poslední člen je <b>kladný</b>: <Fx>−2 · 31 · 47 · (−0,5) = +1457</Fx></>,
      <><Fx>|AC|² = 961 + 2209 + 1457 = 4627</Fx></>,
      <><Fx>|AC| = √4627 ≐ 68,02 m</Fx></>,
    ],
    result: "|AC| ≐ 68,0 m",
    note: "Tupý úhel → záporný kosinus → člen se přičítá a strana vyjde delší než obě zadané. Když ti vyjde méně než 47 m, máš chybu ve znaménku.",
  },
  {
    id: "P4", badge: "hard", source: "PL 3. roč. — úloha 13",
    text: "Z místa pozorování M je možné zaměřit body K, L na obou krajích silnice v zorném úhlu φ. Platí: |ML| = 55 m, |KL| = 6 m, |∠QKM| = 55°, |∠KML| = φ; body Q, K a L leží na jedné přímce. Jaká je velikost zorného úhlu φ? (Výsledek zaokrouhlete na desetiny stupně.)",
    fig: <FigTower />,
    answer: { value: 5.1, tol: 0.15, unit: "°", label: "φ ve stupních" },
    given: "|ML| = 55 m, |KL| = 6 m, |∠QKM| = 55°, body Q, K, L kolineární.",
    formula: "Vedlejší úhly + sinová věta v trojúhelníku KML.",
    steps: [
      <>Body Q, K, L leží na jedné přímce, přičemž K je mezi Q a L. Úhly <Fx>∠QKM</Fx> a <Fx>∠MKL</Fx> jsou proto <b>vedlejší</b>:</>,
      <><Fx>|∠MKL| = 180° − 55° = 125°</Fx></>,
      <>V trojúhelníku KML znám stranu KL, protilehlý úhel φ, a stranu ML s protilehlým úhlem 125° — dvojice pro sinovou větu.</>,
      <><Fx>|KL| / sin φ = |ML| / sin|∠MKL|</Fx></>,
      <><Fx>sin φ = |KL| · sin 125° / |ML| = 6 · 0,8192 / 55 = 0,08936</Fx></>,
      <><Fx>φ = arcsin 0,08936 ≐ 5,13°</Fx></>,
    ],
    result: "φ ≐ 5,1°",
    note: "Druhé řešení arcsinu (180° − 5,13° = 174,87°) je nesmysl — s úhlem 125° by součet přesáhl 180°. Zde tedy jediné řešení. Nejčastější chyba je použít rovnou 55° místo vedlejšího úhlu 125°.",
  },
  {
    id: "P5", badge: "med", source: "PL 3. roč. — úloha 14",
    text: "V obdélníku ABCD o obsahu 28 cm² je umístěn trojúhelník CDE. Oba obrazce mají společnou stranu CD. Platí: |BC| = 4 cm, |CE| = 5 cm, |DE| = 3 cm. Vypočtěte velikost úhlu φ = |∠DEC|.",
    fig: <FigRectCDE />,
    answer: { value: 120, tol: 0.5, unit: "°", label: "φ ve stupních" },
    given: "S(ABCD) = 28 cm², |BC| = 4 cm, |CE| = 5 cm, |DE| = 3 cm.",
    formula: "Obsah obdélníku → strana CD; pak kosinová věta v trojúhelníku CDE (případ sss).",
    steps: [
      <>Z obsahu obdélníku: <Fx>S = |CD| · |BC| ⟹ 28 = |CD| · 4 ⟹ |CD| = 7 cm</Fx></>,
      <>V trojúhelníku CDE znám všechny tři strany: <Fx>DE = 3, CE = 5, DC = 7</Fx>. Hledaný úhel φ je u vrcholu E, tedy protilehlý ke straně DC.</>,
      <><Fx>|DC|² = |DE|² + |CE|² − 2·|DE|·|CE|·cos φ</Fx></>,
      <><Fx>49 = 9 + 25 − 30 · cos φ</Fx></>,
      <><Fx>30 · cos φ = 34 − 49 = −15 ⟹ cos φ = −0,5</Fx></>,
      <><Fx>φ = 120°</Fx></>,
    ],
    result: "φ = 120°",
    note: "Trojice 3–5–7 s úhlem 120° je klasika — vyplatí se ji poznat. Záporný kosinus správně signalizuje tupý úhel, což sedí i s obrázkem.",
  },
  {
    id: "P6", badge: "med", source: "Zápisky — úloha 1",
    text: "Je dána úsečka AB, |AB| = 7 cm. Zkonstruujte trojúhelník ABC, kde |BC| = 5 cm a γ = 30°. Dopočítejte zbývající délky stran a velikosti úhlů.",
    fig: <FigTriSSA />,
    answer: { value: 10.87, tol: 0.15, unit: "cm", label: "b = |AC| v cm" },
    given: "c = |AB| = 7 cm, a = |BC| = 5 cm, γ = |∠ACB| = 30°.",
    formula: "Sinová věta (znám stranu a k ní protilehlý úhel: c ↔ γ), pak součet úhlů.",
    steps: [
      <>Dvojice strana–protilehlý úhel je <Fx>c = 7</Fx> a <Fx>γ = 30°</Fx>. Ke straně <Fx>a = 5</Fx> hledám úhel α.</>,
      <><Fx>a / sin α = c / sin γ ⟹ sin α = a · sin γ / c</Fx></>,
      <><Fx>sin α = 5 · 0,5 / 7 = 0,3571</Fx></>,
      <><Fx>α ≐ 20,92° = 20°55′</Fx></>,
      <>Ověření druhého řešení: <Fx>180° − 20,92° = 159,08°</Fx>, ale <Fx>159,08° + 30° &gt; 180°</Fx> — nemožné. Řešení je tedy <b>jediné</b>.</>,
      <><Fx>β = 180° − 30° − 20,92° ≐ 129,08° = 129°5′</Fx></>,
      <><Fx>b = c · sin β / sin γ = 7 · sin 129,08° / 0,5 = 7 · 0,7766 / 0,5</Fx></>,
      <><Fx>b ≐ 10,87 cm</Fx></>,
    ],
    result: "b = |AC| ≐ 10,87 cm; α ≐ 20°55′; β ≐ 129°5′; γ = 30°",
    note: "Proč je řešení jediné: strana c = 7 protilehlá zadanému úhlu γ je delší než strana a = 5. Kdyby to bylo naopak, hrozila by dvě řešení.",
  },
  {
    id: "P7", badge: "hard", source: "Zápisky — úloha 2",
    text: "Je dána úsečka BC, |BC| = 7 cm. Zkonstruujte trojúhelník ABC, kde |BA| = 6 cm a vₐ = 4 cm. Dopočítejte zbývající délky stran a velikosti úhlů.",
    fig: <FigVyska />,
    given: "a = |BC| = 7 cm, c = |BA| = 6 cm, vₐ = 4 cm (výška na stranu a).",
    formula: "Výška jako kolmá vzdálenost: vₐ = c · sin β. Pak kosinová věta.",
    steps: [
      <>Výška z vrcholu A na stranu BC je kolmá vzdálenost bodu A od přímky BC. V pravoúhlém trojúhelníku s přeponou <Fx>BA = c</Fx> platí <Fx>vₐ = c · sin β</Fx>.</>,
      <><Fx>4 = 6 · sin β ⟹ sin β = 2/3 ≐ 0,6667</Fx></>,
      <>Zde <b>obě</b> hodnoty vyhovují: <Fx>β₁ ≐ 41,81°</Fx> i <Fx>β₂ ≐ 138,19°</Fx>. Při konstrukci to odpovídá dvěma průsečíkům kružnice k(B; 6 cm) s rovnoběžkou ve vzdálenosti 4 cm — <b>úloha má dvě řešení</b>.</>,
      <><b>1. řešení, β ≐ 41,81° = 41°49′:</b> <Fx>b² = a² + c² − 2ac·cos β = 49 + 36 − 84 · 0,7454 = 22,39</Fx> ⟹ <Fx>b ≐ 4,73 cm</Fx></>,
      <>Úhly: <Fx>cos α = (b² + c² − a²)/(2bc) = (22,39 + 36 − 49)/(2·4,73·6) ⟹ α ≐ 80,48° = 80°29′</Fx>, <Fx>γ ≐ 57,71° = 57°43′</Fx></>,
      <><b>2. řešení, β ≐ 138,19° = 138°11′:</b> <Fx>b² = 49 + 36 + 84 · 0,7454 = 147,61</Fx> ⟹ <Fx>b ≐ 12,15 cm</Fx></>,
      <>Úhly: <Fx>α ≐ 22,59° = 22°35′</Fx>, <Fx>γ ≐ 19,22° = 19°13′</Fx></>,
      <>Kontrola obou: <Fx>S = ½ · a · vₐ = ½ · 7 · 4 = 14 cm²</Fx>, a zároveň <Fx>S = ½ · a · c · sin β = ½ · 7 · 6 · 0,6667 = 14 cm² ✓</Fx></>,
    ],
    result: "Dvě řešení. 1) b ≐ 4,73 cm, α ≐ 80°29′, β ≐ 41°49′, γ ≐ 57°43′.  2) b ≐ 12,15 cm, α ≐ 22°35′, β ≐ 138°11′, γ ≐ 19°13′. Obě mají obsah 14 cm².",
    note: "Klasická past: ze sinu vždy plynou dvě možné hodnoty úhlu. Tady obě dávají platný trojúhelník, takže obě musíš uvést, jinak přijdeš o body.",
  },
  {
    id: "P8", badge: "med", source: "Zápisky — úloha 4",
    text: "Na ciferníku hodin spojte číslice 3, 6 a 8 a v takto vzniklém trojúhelníku určete velikosti vnitřních úhlů.",
    fig: <FigClock />,
    given: "Vrcholy trojúhelníku leží na kružnici (ciferníku) v místech číslic 3, 6 a 8.",
    formula: "Ciferník má 12 dílků po 30°; věta o obvodovém a středovém úhlu: obvodový úhel = polovina středového úhlu příslušného oblouku.",
    steps: [
      <>Jeden dílek ciferníku odpovídá středovému úhlu <Fx>360° / 12 = 30°</Fx>.</>,
      <>Středové úhly (oblouky) mezi vrcholy: <Fx>3→6 = 3 dílky = 90°</Fx>, <Fx>6→8 = 2 dílky = 60°</Fx>, <Fx>8→3 = 7 dílků = 210°</Fx>. Kontrola: <Fx>90 + 60 + 210 = 360° ✓</Fx></>,
      <>Obvodový úhel u vrcholu <b>3</b> přísluší protilehlému oblouku 6→8: <Fx>60° / 2 = 30°</Fx></>,
      <>Obvodový úhel u vrcholu <b>6</b> přísluší oblouku 8→3: <Fx>210° / 2 = 105°</Fx></>,
      <>Obvodový úhel u vrcholu <b>8</b> přísluší oblouku 3→6: <Fx>90° / 2 = 45°</Fx></>,
      <>Kontrola součtu: <Fx>30° + 105° + 45° = 180° ✓</Fx></>,
    ],
    result: "Úhel u číslice 3 je 30°, u číslice 6 je 105°, u číslice 8 je 45°.",
    note: "Každý vrchol „vidí\" oblouk, který u něj NENÍ. Nejčastější chyba je vzít oblouk sousedící s vrcholem.",
  },
  {
    id: "P9", badge: "easy", source: "Úloha navíc — Pythagoras + Euklid",
    text: <>V pravoúhlém trojúhelníku ABC s pravým úhlem u vrcholu C platí c = 13 cm a a = 5 cm. Vypočtěte odvěsnu b, výšku v<sub>c</sub> a oba úseky přepony c<sub>a</sub>, c<sub>b</sub>.</>,
    answer: { value: 12, tol: 0.01, unit: "cm", label: "b v cm" },
    given: "c = 13 cm (přepona), a = 5 cm, pravý úhel u C.",
    formula: "Pythagorova věta + Euklidova věta o odvěsně + Euklidova věta o výšce.",
    steps: [
      <>Pythagorova věta: <Fx>b² = c² − a² = 169 − 25 = 144 ⟹ b = 12 cm</Fx> (známá trojice 5–12–13).</>,
      <>Euklidova věta o odvěsně: <Fx>a² = c_a · c ⟹ c_a = a²/c = 25/13 ≐ 1,92 cm</Fx></>,
      <>Stejně pro druhý úsek: <Fx>c_b = b²/c = 144/13 ≐ 11,08 cm</Fx></>,
      <>Kontrola: <Fx>c_a + c_b = 25/13 + 144/13 = 169/13 = 13 = c ✓</Fx></>,
      <>Výška — buď z Euklidovy věty o výšce <Fx>v_c = √(c_a · c_b) = √(1,923 · 11,077) ≐ 4,62 cm</Fx>,</>,
      <>nebo rychleji z obsahu: <Fx>a · b = c · v_c ⟹ v_c = 5 · 12 / 13 = 60/13 ≐ 4,62 cm ✓</Fx></>,
    ],
    result: "b = 12 cm, c_a = 25/13 ≐ 1,92 cm, c_b = 144/13 ≐ 11,08 cm, v_c = 60/13 ≐ 4,62 cm",
  },
  {
    id: "P10", badge: "easy", source: "Úloha navíc — podobnost",
    text: "Tyč vysoká 1,8 m vrhá ve stejném okamžiku stín dlouhý 2,4 m. Strom vedle ní vrhá stín dlouhý 14 m. Jak je strom vysoký?",
    answer: { value: 10.5, tol: 0.05, unit: "m", label: "výška stromu v m" },
    given: "Tyč: výška 1,8 m, stín 2,4 m. Strom: stín 14 m.",
    formula: "Podobnost trojúhelníků (věta uu) — sluneční paprsky svírají se zemí stejný úhel, oba trojúhelníky jsou pravoúhlé.",
    steps: [
      <>Trojúhelník tyč–stín a trojúhelník strom–stín jsou podobné (oba pravoúhlé, shodný úhel dopadu paprsků).</>,
      <>Poměry odpovídajících stran jsou tedy stejné: <Fx>h / 14 = 1,8 / 2,4</Fx></>,
      <><Fx>h = 14 · 1,8 / 2,4 = 25,2 / 2,4</Fx></>,
      <><Fx>h = 10,5 m</Fx></>,
    ],
    result: "Strom je vysoký 10,5 m.",
    note: "Poměr podobnosti je k = 14 / 2,4 ≐ 5,83. Kdyby se ptali na obsahy, násobily by se k², ne k.",
  },
];

const GONIO = [
  {
    id: "G1", badge: "med", source: "Zápisky — úloha 3",
    text: "Řešte rovnici 2sin²x + 3cos x = 3.  a) na intervalu ⟨2π; 4π⟩,  b) na ℝ.",
    given: "Rovnice obsahuje sin²x i cos x — tedy dvě různé funkce.",
    formula: "Základní identita sin²x = 1 − cos²x, pak substituce t = cos x a kvadratická rovnice.",
    steps: [
      <>Nahradím <Fx>sin²x = 1 − cos²x</Fx>: <Fx>2(1 − cos²x) + 3cos x = 3</Fx></>,
      <>Roznásobím a převedu na nulu: <Fx>2 − 2cos²x + 3cos x − 3 = 0</Fx> ⟹ <Fx>−2cos²x + 3cos x − 1 = 0</Fx></>,
      <>Vynásobím (−1): <Fx>2cos²x − 3cos x + 1 = 0</Fx></>,
      <>Substituce <Fx>t = cos x</Fx>: <Fx>2t² − 3t + 1 = 0</Fx>, <Fx>D = 9 − 8 = 1</Fx>, <Fx>t = (3 ± 1)/4</Fx></>,
      <><Fx>t₁ = 1</Fx> a <Fx>t₂ = ½</Fx>. Obě leží v ⟨−1; 1⟩, takže obě jsou použitelné.</>,
      <><b>b) Obecné řešení na ℝ:</b> <Fx>cos x = 1 ⟹ x = 2kπ</Fx>; <Fx>cos x = ½ ⟹ x = π/3 + 2kπ  ∨  x = 5π/3 + 2kπ</Fx>, k ∈ ℤ</>,
      <><b>a) Výběr z ⟨2π; 4π⟩:</b> z <Fx>x = 2kπ</Fx> pro k = 1, 2 dostanu <Fx>2π</Fx> a <Fx>4π</Fx> (oba konce jsou v uzavřeném intervalu).</>,
      <>Z <Fx>x = π/3 + 2kπ</Fx> pro k = 1: <Fx>π/3 + 2π = 7π/3</Fx> ✓ (leží v intervalu).</>,
      <>Z <Fx>x = 5π/3 + 2kπ</Fx> pro k = 1: <Fx>5π/3 + 2π = 11π/3</Fx> ✓</>,
    ],
    result: "a) x ∈ {2π; 7π/3; 11π/3; 4π}   b) x = 2kπ  ∨  x = π/3 + 2kπ  ∨  x = 5π/3 + 2kπ,  k ∈ ℤ",
    note: "Řešení cos x = ½ lze zapsat i jako x = ±π/3 + 2kπ. Zkouška: pro x = 7π/3 je cos = ½, sin² = 3/4, tedy 2·0,75 + 3·0,5 = 1,5 + 1,5 = 3 ✓",
  },
  {
    id: "G2", badge: "med", source: "Zápisky — úloha 4′",
    text: "Upravte a určete podmínky výrazu:  (3·cos x)/(1 − sin x) · (cos x)/(1 + sin x)",
    given: "Součin dvou zlomků s goniometrickými funkcemi.",
    formula: "Vzorec (a − b)(a + b) = a² − b² a základní identita sin²x + cos²x = 1.",
    steps: [
      <><b>Nejdřív podmínky — ze zadání, před úpravou:</b> jmenovatele nesmí být nulové.</>,
      <><Fx>1 − sin x ≠ 0 ⟹ sin x ≠ 1 ⟹ x ≠ π/2 + 2kπ</Fx></>,
      <><Fx>1 + sin x ≠ 0 ⟹ sin x ≠ −1 ⟹ x ≠ 3π/2 + 2kπ</Fx></>,
      <>Obě podmínky dohromady lze zapsat jako <Fx>x ≠ π/2 + kπ</Fx>, k ∈ ℤ.</>,
      <>Vynásobím zlomky: <Fx>(3cos x · cos x) / ((1 − sin x)(1 + sin x)) = 3cos²x / (1 − sin²x)</Fx></>,
      <>Ve jmenovateli použiji <Fx>1 − sin²x = cos²x</Fx>: <Fx>= 3cos²x / cos²x</Fx></>,
      <>Zkrátím (cos²x ≠ 0 díky podmínce): <Fx>= 3</Fx></>,
    ],
    result: "Výraz se rovná konstantě 3 pro všechna x ≠ π/2 + kπ, k ∈ ℤ.",
    note: "Podmínky se určují ze zadaného tvaru, ne z výsledku. Výsledek „3\" sám o sobě žádnou podmínku nemá, ale platit může jen tam, kde byl původní výraz definován.",
  },
  {
    id: "G3", badge: "easy", source: "Úloha navíc — základní rovnice",
    text: "Řešte rovnici 2cos x − √3 = 0 na intervalu ⟨0; 2π⟩.",
    given: "Základní goniometrická rovnice s kosinem.",
    formula: "Osamostatnit cos x, najít základní úhel, přidat řešení z druhého kvadrantu podle znaménka.",
    steps: [
      <><Fx>2cos x = √3 ⟹ cos x = √3/2</Fx></>,
      <>Základní úhel z tabulky: <Fx>cos(π/6) = √3/2</Fx>.</>,
      <>Kosinus je kladný v I. a IV. kvadrantu, obecně <Fx>x = ±π/6 + 2kπ</Fx>.</>,
      <>Na ⟨0; 2π⟩: z I. kvadrantu <Fx>x = π/6</Fx>; ze IV. kvadrantu <Fx>x = 2π − π/6 = 11π/6</Fx>.</>,
    ],
    result: "x ∈ {π/6; 11π/6}, tj. 30° a 330°",
    note: "U kosinu jsou řešení souměrná podle osy x (±x₀), u sinu podle osy y (x₀ a π − x₀). Nepleť si to.",
  },
  {
    id: "G4", badge: "med", source: "Úloha navíc — vlastnosti funkce",
    text: "Určete obor hodnot, periodu a maximum funkce y = 2·sin(3x) − 1.",
    given: "Funkce ve tvaru y = a·sin(bx + c) + d, kde a = 2, b = 3, c = 0, d = −1.",
    formula: "Amplituda mění rozsah, koeficient u x mění periodu, konstanta posouvá graf svisle.",
    steps: [
      <>Základní <Fx>sin(3x)</Fx> nabývá hodnot z <Fx>⟨−1; 1⟩</Fx>.</>,
      <>Vynásobení dvěma: <Fx>2sin(3x) ∈ ⟨−2; 2⟩</Fx> — amplituda je 2.</>,
      <>Posun o −1: <Fx>H(f) = ⟨−3; 1⟩</Fx></>,
      <>Perioda: <Fx>T = 2π / |b| = 2π / 3</Fx></>,
      <>Maximum <Fx>y = 1</Fx> nastane, když <Fx>sin(3x) = 1</Fx>, tedy <Fx>3x = π/2 + 2kπ ⟹ x = π/6 + 2kπ/3</Fx></>,
    ],
    result: "D(f) = ℝ, H(f) = ⟨−3; 1⟩, perioda T = 2π/3, maximum y = 1 pro x = π/6 + 2kπ/3",
    note: "Číslo u x periodu ZKRACUJE (3× rychleji), i když se to zdá naopak. Číslo před sinem naopak graf natahuje svisle.",
  },
];

const ANALYT = [
  {
    id: "A1", badge: "easy", source: "PL Analytická geometrie — 1",
    text: "Bod M[5/2; 1] dělí úsečku AB v poměru 1 : 1. Bod B má souřadnice B[3/2; −2]. Určete souřadnice bodu A.",
    given: "M = [5/2; 1] je střed úsečky AB (poměr 1 : 1), B = [3/2; −2].",
    formula: "Vzorec pro střed úsečky S = ((a₁+b₁)/2; (a₂+b₂)/2), vyjádřený zpětně: A = 2M − B.",
    steps: [
      <>Poměr 1 : 1 znamená, že M je <b>střed</b> úsečky AB.</>,
      <>Ze vzorce pro střed: <Fx>m₁ = (a₁ + b₁)/2 ⟹ a₁ = 2m₁ − b₁</Fx></>,
      <><Fx>a₁ = 2 · 5/2 − 3/2 = 5 − 1,5 = 3,5 = 7/2</Fx></>,
      <><Fx>a₂ = 2 · 1 − (−2) = 2 + 2 = 4</Fx></>,
      <>Zkouška: střed úsečky s krajními body [7/2; 4] a [3/2; −2] je <Fx>((7/2 + 3/2)/2; (4 − 2)/2) = (5/2; 1) ✓</Fx></>,
    ],
    result: "A = [7/2; 4] = [3,5; 4]",
  },
  {
    id: "A2", badge: "med", source: "PL Analytická geometrie — 2",
    text: "Jsou dány body A[1; 4], B[3; −5], C[−6; −8]. Určete souřadnice bodu D tak, aby čtyřúhelník ABCD byl rovnoběžník.",
    given: "A = [1; 4], B = [3; −5], C = [−6; −8].",
    formula: "V rovnoběžníku ABCD platí AB = DC (protilehlé strany jsou rovnoběžné a stejně dlouhé) ⟹ D = A + C − B.",
    steps: [
      <>Pozor na pořadí vrcholů: v ABCD jsou protilehlé strany <b>AB a DC</b>, ne AB a CD.</>,
      <>Vektor <Fx>AB = B − A = (3 − 1; −5 − 4) = (2; −9)</Fx></>,
      <>Musí platit <Fx>DC = AB</Fx>, tedy <Fx>C − D = (2; −9)</Fx></>,
      <><Fx>D = C − (2; −9) = (−6 − 2; −8 + 9) = (−8; 1)</Fx></>,
      <>Kontrola úhlopříčkami (musí mít společný střed): střed AC = <Fx>((1−6)/2; (4−8)/2) = (−2,5; −2)</Fx>, střed BD = <Fx>((3−8)/2; (−5+1)/2) = (−2,5; −2) ✓</Fx></>,
    ],
    result: "D = [−8; 1]",
    note: "Kdyby se ptali na ABDC nebo jiné pořadí, vyšel by jiný bod. Vždy si nakresli náčrtek a zkontroluj středy úhlopříček.",
  },
  {
    id: "A3", badge: "med", source: "PL Analytická geometrie — 3",
    text: "Jsou dány body A[6; 5] a B[2; −3]. Zapište obecnou rovnici osy úsečky AB.",
    given: "A = [6; 5], B = [2; −3].",
    formula: "Osa úsečky prochází jejím středem a je kolmá na ni ⟹ normálový vektor osy = vektor AB.",
    steps: [
      <>Střed úsečky: <Fx>S = ((6 + 2)/2; (5 − 3)/2) = (4; 1)</Fx></>,
      <>Vektor <Fx>AB = B − A = (2 − 6; −3 − 5) = (−4; −8)</Fx>, zjednoduším na <Fx>(1; 2)</Fx> (vydělím −4).</>,
      <>Osa je na AB kolmá, takže <Fx>n = (1; 2)</Fx> je jejím <b>normálovým</b> vektorem: <Fx>o: 1x + 2y + c = 0</Fx></>,
      <>Dosadím střed S[4; 1]: <Fx>4 + 2 · 1 + c = 0 ⟹ c = −6</Fx></>,
      <>Kontrola: vzdálenost A i B od osy musí být stejná — <Fx>|6 + 10 − 6|/√5 = 10/√5</Fx> a <Fx>|2 − 6 − 6|/√5 = 10/√5 ✓</Fx></>,
    ],
    result: "o: x + 2y − 6 = 0",
  },
  {
    id: "A4", badge: "med", source: "PL Analytická geometrie — 4",
    text: "Určete reálné číslo c tak, aby vzdálenost počátku souřadnicové soustavy od přímky p: x + y + c = 0 byla rovna pěti.",
    given: "Přímka p: x + y + c = 0, bod O = [0; 0], požadovaná vzdálenost d = 5.",
    formula: "d(A, p) = |a·x₀ + b·y₀ + c| / √(a² + b²)",
    steps: [
      <>Zde <Fx>a = 1, b = 1</Fx>, bod <Fx>O = [0; 0]</Fx>.</>,
      <><Fx>d = |1·0 + 1·0 + c| / √(1² + 1²) = |c| / √2</Fx></>,
      <>Podmínka: <Fx>|c| / √2 = 5 ⟹ |c| = 5√2</Fx></>,
      <>Absolutní hodnota dává <b>dvě</b> řešení: <Fx>c = 5√2 ≐ 7,07</Fx> nebo <Fx>c = −5√2 ≐ −7,07</Fx></>,
      <>Geometricky: jsou to dvě rovnoběžky, každá na jedné straně počátku.</>,
    ],
    result: "c = 5√2  nebo  c = −5√2  (tj. přibližně ±7,07)",
    note: "Na absolutní hodnotu nezapomeň — uvést jen jedno řešení je nejčastější chyba u tohoto typu úlohy.",
  },
  {
    id: "A5", badge: "hard", source: "PL Analytická geometrie — 5",
    text: "Najděte průsečík přímek p: y = 3x + 5 a q: 6x − 2y − 13 = 0 a určete velikost úhlu, který přímky p a q svírají.",
    given: "p: y = 3x + 5, q: 6x − 2y − 13 = 0.",
    formula: "Porovnání směrových / normálových vektorů → vzájemná poloha; teprve pak průsečík a odchylka.",
    steps: [
      <>Převedu p na obecný tvar: <Fx>y = 3x + 5 ⟹ 3x − y + 5 = 0</Fx>, normálový vektor <Fx>n_p = (3; −1)</Fx>.</>,
      <>Přímka q má <Fx>n_q = (6; −2) = 2 · (3; −1)</Fx>.</>,
      <>Normálové vektory jsou <b>násobky</b>, přímky jsou tedy <b>rovnoběžné</b>.</>,
      <>Jsou totožné? Vydělím q dvěma: <Fx>3x − y − 6,5 = 0</Fx>. Absolutní členy <Fx>+5</Fx> a <Fx>−6,5</Fx> se liší ⟹ přímky jsou <b>rovnoběžné různé</b>.</>,
      <>Průsečík tedy <b>neexistuje</b> — soustava nemá řešení. (Zkusíš-li dosadit y = 3x + 5 do q: <Fx>6x − 2(3x + 5) − 13 = −23 = 0</Fx>, což je spor.)</>,
      <>Odchylka rovnoběžných přímek je <Fx>φ = 0°</Fx>.</>,
      <>Navíc jejich vzdálenost: bod [0; 5] leží na p, <Fx>d = |6·0 − 2·5 − 13| / √(36 + 4) = 23 / √40 ≐ 3,64</Fx></>,
    ],
    result: "Přímky jsou rovnoběžné různé — nemají žádný průsečík. Jejich odchylka je 0°. (Vzdálenost ≐ 3,64.)",
    note: "Chyták! Vždy si nejdřív ověř vzájemnou polohu, než začneš řešit soustavu. Kdo se rovnou pustí do počítání, dojde ke sporu a neví proč.",
  },
  {
    id: "A6", badge: "easy", source: "PL Analytická geometrie — 6",
    text: "Určete velikost úhlu, který přímka p: 3x − 4y + 10 = 0 svírá s osou x.",
    given: "p: 3x − 4y + 10 = 0.",
    formula: "Směrnice k = tg α, kde α je úhel přímky s kladnou poloosou x. Ze směrnicového tvaru y = kx + q.",
    steps: [
      <>Převedu na směrnicový tvar: <Fx>−4y = −3x − 10 ⟹ y = (3/4)x + 5/2</Fx></>,
      <>Směrnice <Fx>k = 3/4 = 0,75</Fx></>,
      <><Fx>tg α = 0,75 ⟹ α = arctg 0,75</Fx></>,
      <><Fx>α ≐ 36,87° = 36°52′</Fx></>,
      <>Alternativně přes vektory: osa x má směr <Fx>(1; 0)</Fx>, přímka p má směr <Fx>s = (4; 3)</Fx>; <Fx>cos φ = |4| / (5 · 1) = 0,8 ⟹ φ ≐ 36,87° ✓</Fx></>,
    ],
    result: "α ≐ 36,87° = 36°52′",
    note: "Odchylka přímek je vždy z ⟨0°; 90°⟩. Kdyby vyšla směrnice záporná, bereš arctg z absolutní hodnoty.",
  },
  {
    id: "A7", badge: "med", source: "PL Analytická geometrie — 7",
    text: "Napište obecnou rovnici přímky m, která prochází průsečíkem přímek p: x = 5 − 2t, y = −3 + 3t, t ∈ ℝ a q: 3x + 4y − 3 = 0 a je rovnoběžná se souřadnicovou osou x.",
    given: "p v parametrickém tvaru, q v obecném tvaru, m ∥ osa x.",
    formula: "Dosazení parametrických rovnic do obecné → parametr t → průsečík. Přímka rovnoběžná s osou x má rovnici y = konst.",
    steps: [
      <>Dosadím x a y z p do rovnice q: <Fx>3(5 − 2t) + 4(−3 + 3t) − 3 = 0</Fx></>,
      <>Roznásobím: <Fx>15 − 6t − 12 + 12t − 3 = 0</Fx></>,
      <>Sečtu: <Fx>6t + 0 = 0 ⟹ t = 0</Fx></>,
      <>Dosadím t = 0 zpět do p: <Fx>x = 5 − 0 = 5</Fx>, <Fx>y = −3 + 0 = −3</Fx>. Průsečík je <Fx>P = [5; −3]</Fx>.</>,
      <>Kontrola v q: <Fx>3·5 + 4·(−3) − 3 = 15 − 12 − 3 = 0 ✓</Fx></>,
      <>Přímka rovnoběžná s osou x má směrový vektor <Fx>(1; 0)</Fx>, tedy normálový <Fx>(0; 1)</Fx>, a její rovnice má tvar <Fx>y = konstanta</Fx>.</>,
      <>Prochází bodem P[5; −3], takže <Fx>y = −3</Fx>.</>,
    ],
    result: "m: y + 3 = 0  (tj. y = −3)",
    note: "Nezaměň: rovnoběžka s osou x je y = konst, rovnoběžka s osou y je x = konst.",
  },
  {
    id: "A8", badge: "easy", source: "PL Analytická geometrie — 8",
    text: "Jsou dány vektory u = (−1; 7) a v = (k; 4). Určete reálné číslo k tak, aby vektory u a v byly navzájem kolmé.",
    answer: { value: 28, tol: 0.01, unit: "", label: "k" },
    given: "u = (−1; 7), v = (k; 4).",
    formula: "Dva vektory jsou kolmé právě tehdy, když je jejich skalární součin nulový: u · v = 0.",
    steps: [
      <><Fx>u · v = u₁v₁ + u₂v₂ = (−1)·k + 7·4 = −k + 28</Fx></>,
      <>Podmínka kolmosti: <Fx>−k + 28 = 0</Fx></>,
      <><Fx>k = 28</Fx></>,
      <>Kontrola: <Fx>v = (28; 4)</Fx>, <Fx>u · v = −28 + 28 = 0 ✓</Fx></>,
    ],
    result: "k = 28",
    note: "Kdyby se místo kolmosti ptali na rovnoběžnost, řešil bys úměru −1/k = 7/4, tedy k = −4/7.",
  },
  {
    id: "A9", badge: "med", source: "Úloha navíc — odchylka vektorů",
    text: "Určete odchylku vektorů u = (2; 3) a v = (−1; 5).",
    answer: { value: 45, tol: 0.5, unit: "°", label: "φ ve stupních" },
    given: "u = (2; 3), v = (−1; 5).",
    formula: "cos φ = (u · v) / (|u| · |v|)",
    steps: [
      <>Skalární součin: <Fx>u · v = 2·(−1) + 3·5 = −2 + 15 = 13</Fx></>,
      <>Velikosti: <Fx>|u| = √(4 + 9) = √13</Fx>, <Fx>|v| = √(1 + 25) = √26</Fx></>,
      <><Fx>cos φ = 13 / (√13 · √26) = 13 / √338 = 13 / 18,385</Fx></>,
      <><Fx>cos φ ≐ 0,7071 = √2/2 ⟹ φ = 45°</Fx></>,
    ],
    result: "φ = 45°",
    note: "U vektorů se absolutní hodnota NEBERE — odchylka může být i tupá. Kdyby šlo o odchylku dvou přímek určených těmito vektory, byla by také 45°, protože výsledek je ostrý.",
  },
  {
    id: "A10", badge: "med", source: "Úloha navíc — kružnice",
    text: "Je dána kružnice k: x² + y² − 4x + 6y − 12 = 0. Určete její střed a poloměr a rozhodněte o vzájemné poloze kružnice k a přímky p: 3x − 4y − 10 = 0.",
    given: "k: x² + y² − 4x + 6y − 12 = 0, p: 3x − 4y − 10 = 0.",
    formula: "Doplnění na čtverec → středová rovnice. Pak porovnání vzdálenosti středu od přímky s poloměrem.",
    steps: [
      <>Seskupím členy: <Fx>(x² − 4x) + (y² + 6y) − 12 = 0</Fx></>,
      <>Doplním na čtverec: <Fx>x² − 4x = (x − 2)² − 4</Fx> a <Fx>y² + 6y = (y + 3)² − 9</Fx></>,
      <><Fx>(x − 2)² − 4 + (y + 3)² − 9 − 12 = 0</Fx></>,
      <><Fx>(x − 2)² + (y + 3)² = 25</Fx> ⟹ <Fx>S = [2; −3]</Fx>, <Fx>r = 5</Fx></>,
      <>Vzdálenost středu od přímky: <Fx>d = |3·2 − 4·(−3) − 10| / √(9 + 16) = |6 + 12 − 10| / 5 = 8/5 = 1,6</Fx></>,
      <>Porovnám: <Fx>d = 1,6 &lt; 5 = r</Fx></>,
    ],
    result: "S = [2; −3], r = 5. Protože d = 1,6 < r = 5, je přímka p SEČNOU kružnice k (dva průsečíky).",
    note: "Znaménka: z (x − 2)² plyne m = +2, z (y + 3)² plyne n = −3. Je snadné se tu splést.",
  },
  {
    id: "A11", badge: "med", source: "Úloha navíc — tečna",
    text: "Napište rovnici tečny ke kružnici k: (x − 2)² + (y + 3)² = 25 v jejím bodě T[5; 1].",
    given: "k: S = [2; −3], r = 5; bod T = [5; 1].",
    formula: "Tečna je kolmá na poloměr ST, takže vektor ST je jejím normálovým vektorem.",
    steps: [
      <>Nejdřív ověřím, že T leží na kružnici: <Fx>(5 − 2)² + (1 + 3)² = 9 + 16 = 25 ✓</Fx></>,
      <>Normálový vektor tečny: <Fx>n = ST = T − S = (5 − 2; 1 + 3) = (3; 4)</Fx></>,
      <>Rovnice tečny: <Fx>3x + 4y + c = 0</Fx>, dosadím T: <Fx>3·5 + 4·1 + c = 0 ⟹ c = −19</Fx></>,
      <>Kontrola: vzdálenost středu od tečny musí být rovna r — <Fx>|3·2 + 4·(−3) − 19| / 5 = |6 − 12 − 19|/5 = 25/5 = 5 = r ✓</Fx></>,
    ],
    result: "t: 3x + 4y − 19 = 0",
  },
  {
    id: "A12", badge: "hard", source: "Úloha navíc — vzájemná poloha",
    text: "Rozhodněte o vzájemné poloze přímek p: 2x − y + 1 = 0 a q: x = 1 + t, y = 3 + 2t, t ∈ ℝ.",
    given: "p v obecném tvaru, q v parametrickém tvaru.",
    formula: "Porovnání směrových vektorů, pak test bodu.",
    steps: [
      <>Směrový vektor q: <Fx>s_q = (1; 2)</Fx>. Normálový vektor p: <Fx>n_p = (2; −1)</Fx>, tedy směrový <Fx>s_p = (1; 2)</Fx>.</>,
      <>Směrové vektory jsou <b>stejné</b> ⟹ přímky jsou rovnoběžné (nebo totožné).</>,
      <>Test: leží bod <Fx>[1; 3]</Fx> z přímky q na přímce p? <Fx>2·1 − 3 + 1 = 0 ✓</Fx></>,
      <>Bod přímky q leží na p, a protože jsou rovnoběžné, jsou přímky <b>totožné</b>.</>,
      <>Ověření dosazením: <Fx>2(1 + t) − (3 + 2t) + 1 = 2 + 2t − 3 − 2t + 1 = 0</Fx> — platí pro každé t, tedy každý bod q leží na p ✓</>,
    ],
    result: "Přímky p a q jsou TOTOŽNÉ (mají nekonečně mnoho společných bodů).",
    note: "Když po dosazení parametrických rovnic do obecné vyjde identita 0 = 0, jsou přímky totožné. Když vyjde spor (např. −23 = 0), jsou rovnoběžné různé. Když vyjde konkrétní t, jsou různoběžné.",
  },
];

function UlohyTab() {
  const [group, setGroup] = useState("planim");
  const groups = [
    { k: "planim", t: "Planimetrie", n: PLANIM.length, c: PINK, data: PLANIM },
    { k: "gonio", t: "Goniometrie", n: GONIO.length, c: CYAN, data: GONIO },
    { k: "analyt", t: "Analytická geo.", n: ANALYT.length, c: VIOLET, data: ANALYT },
  ];
  const g = groups.find(x => x.k === group);

  return (
    <div style={{ maxWidth: "760px", margin: "0 auto", padding: "16px" }}>
      <div style={{ ...glass, padding: "14px 18px", marginBottom: "18px", borderColor: AMBER + "44" }}>
        <div style={{ color: "rgba(255,255,255,0.72)", fontSize: "13.5px", lineHeight: 1.65 }}>
          Všech 18 úloh ze zadání od profesorky (oba pracovní listy i zápisky) a k tomu 8 doplňkových na témata, která v listech chybí.
          Zkus úlohu nejdřív sám na papír — u některých můžeš výsledek rovnou zkontrolovat v políčku.
        </div>
      </div>

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "18px" }}>
        {groups.map(x => (
          <button key={x.k} onClick={() => setGroup(x.k)} style={{
            padding: "9px 16px", borderRadius: "999px", cursor: "pointer", fontSize: "13.5px", fontFamily: "inherit",
            background: group === x.k ? x.c + "26" : "rgba(255,255,255,0.05)",
            border: `1px solid ${group === x.k ? x.c : "rgba(255,255,255,0.12)"}`,
            color: group === x.k ? "#fff" : "rgba(255,255,255,0.6)",
            fontWeight: group === x.k ? 700 : 500, transition: "all 0.4s ease",
          }}>{x.t} <span style={{ opacity: 0.6 }}>({x.n})</span></button>
        ))}
      </div>

      {g.data.map(p => <Problem key={p.id} p={p} accent={g.c} />)}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// KVÍZ
// ══════════════════════════════════════════════════════════════════
const QUESTIONS = [
  {
    question: "V trojúhelníku znáš strany a = 8, b = 5 a úhel γ = 40° mezi nimi. Kterou větu použiješ pro výpočet strany c?",
    type: "single",
    options: ["Kosinovou větu", "Sinovou větu", "Pythagorovu větu", "Euklidovu větu o výšce"],
    correct: [0],
    explanation: "Znám dvě strany a úhel jimi sevřený (případ sus) — to je přesně situace pro kosinovou větu c² = a² + b² − 2ab·cos γ. Sinová věta by nešla, protože nemám žádnou dvojici strana + protilehlý úhel.",
    tip: "sus a sss → kosinová věta. usu a Ssu → sinová věta.",
  },
  {
    question: "Ze sinové věty ti vyšlo sin α = 0,6. Co musíš zkontrolovat, než odpovíš?",
    type: "single",
    options: [
      "Zda i druhá hodnota 180° − α dává součet úhlů menší než 180°",
      "Zda je α menší než 45°",
      "Zda je trojúhelník pravoúhlý",
      "Nic, arcsin dává vždy jednu odpověď",
    ],
    correct: [0],
    explanation: "V intervalu (0°; 180°) mají stejný sinus dvě hodnoty: α ≐ 36,87° a 180° − 36,87° ≐ 143,13°. Pokud i ta druhá dává platný trojúhelník (součet úhlů < 180°), má úloha dvě řešení.",
    tip: "Kosinová věta tuto dvojznačnost nemá — záporný kosinus jednoznačně určí tupý úhel.",
  },
  {
    question: "Středový úhel příslušný k oblouku AB měří 140°. Jak velký je obvodový úhel nad stejným obloukem?",
    type: "single",
    options: ["70°", "140°", "280°", "40°"],
    correct: [0],
    explanation: "Středový úhel je dvojnásobkem obvodového: ω = 2φ, tedy φ = 140° / 2 = 70°.",
    tip: "Střed je „blíž\", tak vidí úhel dvakrát tak velký.",
  },
  {
    question: "Které z následujících tvrzení o obvodových úhlech platí?",
    type: "multi",
    options: [
      "Všechny obvodové úhly nad stejným obloukem jsou shodné",
      "Obvodový úhel nad průměrem kružnice měří 90°",
      "V tětivovém čtyřúhelníku je součet protilehlých úhlů 180°",
      "Obvodový úhel je dvojnásobkem středového úhlu",
    ],
    correct: [0, 1, 2],
    explanation: "První tři jsou správné důsledky věty o obvodovém a středovém úhlu. Poslední je obrácené — STŘEDOVÝ úhel je dvojnásobkem obvodového, ne naopak.",
  },
  {
    question: "V pravoúhlém trojúhelníku s přeponou c a odvěsnou a platí Euklidova věta o odvěsně ve tvaru:",
    type: "single",
    options: ["a² = c_a · c", "a² = c_a · c_b", "a² = v_c · c", "a² = c_b · c"],
    correct: [0],
    explanation: "Věta o odvěsně: druhá mocnina odvěsny se rovná součinu přepony a úseku přepony, který k té odvěsně přiléhá. Tedy a² = c_a · c. Tvar v_c² = c_a · c_b je věta o výšce.",
    tip: "Odvěsna „si bere\" svůj úsek a celou přeponu. Výška si bere oba úseky.",
  },
  {
    question: "Dva trojúhelníky jsou podobné s poměrem podobnosti k = 3. V jakém poměru jsou jejich obsahy?",
    type: "single",
    options: ["9 : 1", "3 : 1", "27 : 1", "1,73 : 1"],
    correct: [0],
    explanation: "Obsahy podobných útvarů jsou v poměru k² = 3² = 9. Délky jsou v poměru k, objemy těles v poměru k³.",
    tip: "Obsah je „dvourozměrný\" → druhá mocnina.",
  },
  {
    question: "Rovnici 2sin²x + 3cos x = 3 řešíš tak, že:",
    type: "single",
    options: [
      "nahradíš sin²x = 1 − cos²x a dostaneš kvadratickou rovnici pro cos x",
      "nahradíš cos x = 1 − sin x",
      "vydělíš celou rovnici výrazem cos x",
      "použiješ vzorec pro sin 2x",
    ],
    correct: [0],
    explanation: "Cíl je dostat v rovnici jen jednu goniometrickou funkci. Protože sin je v rovnici na druhou, převedeš ho na cos pomocí sin²x = 1 − cos²x. Vznikne 2cos²x − 3cos x + 1 = 0, což je kvadratická rovnice v t = cos x.",
    tip: "Substituce t = cos x, ale nezapomeň ověřit, že |t| ≤ 1.",
  },
  {
    question: "Při řešení goniometrické rovnice ti ze substituce vyšlo t = cos x = 1,4. Co to znamená?",
    type: "single",
    options: [
      "Tento kořen je nepřípustný, žádné x mu neodpovídá",
      "x = arccos 1,4 ≐ 1,4 rad",
      "Rovnice má nekonečně mnoho řešení",
      "Musíš přejít na sin x",
    ],
    correct: [0],
    explanation: "Obor hodnot kosinu je ⟨−1; 1⟩. Hodnota 1,4 je mimo, takže tento kořen kvadratické rovnice se zahodí. Pokud jsou nepřípustné oba kořeny, nemá rovnice řešení.",
  },
  {
    question: "Jaké jsou podmínky výrazu (3cos x)/(1 − sin x) · (cos x)/(1 + sin x)?",
    type: "single",
    options: [
      "x ≠ π/2 + kπ",
      "x ≠ kπ",
      "x ≠ 0",
      "Žádné, výraz je roven 3 pro všechna x",
    ],
    correct: [0],
    explanation: "Jmenovatele nesmí být nulové: 1 − sin x ≠ 0 dává x ≠ π/2 + 2kπ, 1 + sin x ≠ 0 dává x ≠ 3π/2 + 2kπ. Dohromady x ≠ π/2 + kπ. Výraz se sice zjednoduší na 3, ale definován je jen tam, kde původní tvar dával smysl.",
    tip: "Podmínky se určují ZE ZADÁNÍ, ne z výsledku.",
  },
  {
    question: "Jaká je perioda funkce y = 2sin(3x) − 1?",
    type: "single",
    options: ["2π/3", "2π", "6π", "3π"],
    correct: [0],
    explanation: "Perioda funkce sin(bx) je 2π/|b|. Zde b = 3, tedy T = 2π/3. Koeficienty 2 a −1 mění amplitudu a svislý posun, ale periodu ne.",
    tip: "Číslo u x periodu zkracuje, i když se to zdá naopak.",
  },
  {
    question: "Jaký je obor hodnot funkce y = 2sin(3x) − 1?",
    type: "single",
    options: ["⟨−3; 1⟩", "⟨−1; 1⟩", "⟨−2; 2⟩", "⟨−1; 3⟩"],
    correct: [0],
    explanation: "sin(3x) ∈ ⟨−1; 1⟩, po vynásobení dvěma ⟨−2; 2⟩, po posunu o −1 dostaneme ⟨−3; 1⟩.",
  },
  {
    question: "Které vztahy jsou správné?",
    type: "multi",
    options: [
      "sin(180° − x) = sin x",
      "cos(180° − x) = −cos x",
      "sin²x + cos²x = 1",
      "cos(−x) = −cos x",
    ],
    correct: [0, 1, 2],
    explanation: "První tři jsou základní identity. Poslední je špatně: kosinus je SUDÁ funkce, takže cos(−x) = +cos x. Lichý je sinus: sin(−x) = −sin x.",
    tip: "coS je Sudý (souměrný podle osy y), sin je lichý.",
  },
  {
    question: "Střed úsečky AB je M[4; 1], bod B = [1; −2]. Jaké jsou souřadnice bodu A?",
    type: "single",
    options: ["[7; 4]", "[2,5; −0,5]", "[−2; −5]", "[5; −1]"],
    correct: [0],
    explanation: "A = 2M − B = (2·4 − 1; 2·1 − (−2)) = (7; 4). Kontrola: střed [7;4] a [1;−2] je ((7+1)/2; (4−2)/2) = (4; 1) ✓",
    tip: "Ze středu zpět: A = 2M − B (ne M − B!).",
  },
  {
    question: "Pro body A[1; 4], B[3; −5], C[−6; −8] hledáš bod D tak, aby ABCD byl rovnoběžník. Který vzorec použiješ?",
    type: "single",
    options: ["D = A + C − B", "D = A + B − C", "D = B + C − A", "D = (A + C) / 2"],
    correct: [0],
    explanation: "V rovnoběžníku ABCD platí AB = DC, tedy B − A = C − D, odkud D = A + C − B = (1 − 6 − 3; 4 − 8 + 5) = (−8; 1).",
    tip: "Můžeš ověřit přes úhlopříčky: střed AC musí být totožný se středem BD.",
  },
  {
    question: "Vektory u = (−1; 7) a v = (k; 4) mají být kolmé. Jaká podmínka to zajistí?",
    type: "single",
    options: ["u · v = 0, tedy −k + 28 = 0", "|u| = |v|", "u = λ·v pro nějaké λ", "u₁/v₁ = u₂/v₂"],
    correct: [0],
    explanation: "Kolmost ⟺ nulový skalární součin. (−1)·k + 7·4 = −k + 28 = 0, tedy k = 28. Poslední dvě možnosti jsou podmínky ROVNOBĚŽNOSTI, ne kolmosti.",
  },
  {
    question: "Jaký je normálový vektor přímky p: 3x − 4y + 10 = 0?",
    type: "single",
    options: ["(3; −4)", "(−4; 3)", "(4; 3)", "(3; 4)"],
    correct: [0],
    explanation: "V obecné rovnici ax + by + c = 0 tvoří koeficienty u x a y přímo NORMÁLOVÝ vektor n = (a; b) = (3; −4). Směrový vektor by byl s = (−b; a) = (4; 3).",
    tip: "Obecná rovnice → koeficienty jsou normála. Prohodíš a jednu otočíš → směr.",
  },
  {
    question: "Přímky p: 3x − y + 5 = 0 a q: 6x − 2y − 13 = 0 jsou:",
    type: "single",
    options: [
      "rovnoběžné různé — nemají průsečík",
      "různoběžné, protínají se v jednom bodě",
      "totožné",
      "kolmé",
    ],
    correct: [0],
    explanation: "n_q = (6; −2) = 2·(3; −1) = 2·n_p, takže jsou rovnoběžné. Po vydělení q dvěma: 3x − y − 6,5 = 0 — absolutní člen se od p (+5) liší, takže nejsou totožné. Odchylka je 0°, průsečík neexistuje.",
    tip: "Vždy si ověř vzájemnou polohu, než začneš řešit soustavu.",
  },
  {
    question: "Vzdálenost bodu A[x₀; y₀] od přímky p: ax + by + c = 0 se počítá jako:",
    type: "single",
    options: [
      "|a·x₀ + b·y₀ + c| / √(a² + b²)",
      "(a·x₀ + b·y₀ + c) / √(a² + b²)",
      "|a·x₀ + b·y₀ + c| / (a² + b²)",
      "√((x₀ − a)² + (y₀ − b)²)",
    ],
    correct: [0],
    explanation: "V čitateli je ABSOLUTNÍ hodnota dosazení bodu do levé strany rovnice, ve jmenovateli ODMOCNINA ze součtu druhých mocnin koeficientů. Přímka musí být v obecném tvaru s nulou vpravo.",
  },
  {
    question: "Jak najdeš obecnou rovnici osy úsečky AB?",
    type: "multi",
    options: [
      "Vektor AB je normálovým vektorem osy",
      "Osa prochází středem úsečky AB",
      "Vektor AB je směrovým vektorem osy",
      "Osa prochází bodem A",
    ],
    correct: [0, 1],
    explanation: "Osa úsečky je kolmá na AB (proto je AB její NORMÁLOVÝ vektor) a prochází jejím středem. Bodem A neprochází — od A i B má stejnou nenulovou vzdálenost.",
  },
  {
    question: "Kružnice x² + y² − 4x + 6y − 12 = 0 má střed a poloměr:",
    type: "single",
    options: ["S = [2; −3], r = 5", "S = [−2; 3], r = 5", "S = [2; −3], r = 25", "S = [4; −6], r = 12"],
    correct: [0],
    explanation: "Doplněním na čtverec: (x − 2)² − 4 + (y + 3)² − 9 − 12 = 0, tedy (x − 2)² + (y + 3)² = 25. Odtud S = [2; −3] a r = √25 = 5.",
    tip: "Ze závorky (y + 3)² plyne souřadnice −3, ne +3. A vpravo je r², ne r.",
  },
  {
    question: "Vzdálenost středu kružnice od přímky je d = 1,6, poloměr je r = 5. Jaká je jejich vzájemná poloha?",
    type: "single",
    options: ["Sečna — dva průsečíky", "Tečna — jeden dotykový bod", "Vnější přímka — žádný průsečík", "Nelze určit"],
    correct: [0],
    explanation: "Platí d < r (1,6 < 5), přímka tedy prochází „skrz\" kružnici a protne ji ve dvou bodech — je to sečna.",
    tip: "d < r sečna · d = r tečna · d > r vnější přímka.",
  },
  {
    question: "Hledáš tečnu ke kružnici se středem S v jejím bodě T. Jaký je normálový vektor tečny?",
    type: "single",
    options: ["Vektor ST = T − S", "Vektor kolmý na ST", "Vektor OS", "Nelze určit bez poloměru"],
    correct: [0],
    explanation: "Tečna je kolmá na poloměr v bodě dotyku, takže vektor ST je přímo normálovým vektorem tečny. Dosadíš bod T do rovnice a dopočítáš absolutní člen.",
    tip: "Kontrola: vzdálenost středu od nalezené tečny musí vyjít přesně r.",
  },
  {
    question: "Odchylka dvou PŘÍMEK se počítá se vzorcem cos φ = |s₁ · s₂| / (|s₁|·|s₂|). Proč je tam absolutní hodnota?",
    type: "single",
    options: [
      "Aby odchylka vyšla vždy z intervalu ⟨0°; 90°⟩",
      "Aby se předešlo dělení nulou",
      "Protože skalární součin je vždy kladný",
      "Je tam navíc, výsledek se nezmění",
    ],
    correct: [0],
    explanation: "Přímka nemá orientaci — směrový vektor lze vzít i opačný. Absolutní hodnota zaručí, že vždy dostaneš ostrý (nebo pravý) úhel. U odchylky VEKTORŮ se absolutní hodnota nebere, tam může vyjít i tupý úhel.",
  },
  {
    question: "V trojúhelníku CDE platí DE = 3, CE = 5, DC = 7. Jaký je úhel u vrcholu E?",
    type: "single",
    options: ["120°", "60°", "90°", "150°"],
    correct: [0],
    explanation: "Kosinová věta: 7² = 3² + 5² − 2·3·5·cos φ → 49 = 34 − 30cos φ → cos φ = −0,5 → φ = 120°. Záporný kosinus správně signalizuje tupý úhel.",
    tip: "Trojice 3–5–7 dává vždy 120° — vyplatí se ji poznat.",
  },
  {
    question: "Na ciferníku spojíš číslice 3, 6 a 8. Jaký je úhel u vrcholu 6?",
    type: "single",
    options: ["105°", "45°", "30°", "60°"],
    correct: [0],
    explanation: "Vrchol 6 „vidí\" protilehlý oblouk 8 → 3, což je 7 dílků, tedy středový úhel 7 · 30° = 210°. Obvodový úhel je jeho polovina: 105°.",
    tip: "Vrchol vždy vidí ten oblouk, na kterém sám NELEŽÍ.",
  },
  {
    question: "Úhel, který přímka p: 3x − 4y + 10 = 0 svírá s osou x, spočítáš jako:",
    type: "single",
    options: ["arctg(3/4) ≐ 36,87°", "arctg(4/3) ≐ 53,13°", "arctg(−4) ≐ −75,96°", "arcsin(3/5) ≐ 36,87°"],
    correct: [0],
    explanation: "Ze směrnicového tvaru y = (3/4)x + 5/2 je směrnice k = 3/4 = tg α, tedy α = arctg 0,75 ≐ 36,87° = 36°52′.",
    tip: "Nejdřív osamostatni y, pak koeficient u x je směrnice.",
  },
];

// ══════════════════════════════════════════════════════════════════
// KARTIČKY
// ══════════════════════════════════════════════════════════════════
const CARDS = [
  { g: "Planimetrie", f: "Pythagorova věta", b: "a² + b² = c² (c je přepona). Obráceně: platí-li to, je trojúhelník pravoúhlý." },
  { g: "Planimetrie", f: "Euklidova věta o výšce", b: "v_c² = c_a · c_b — výška je geometrickým průměrem obou úseků přepony." },
  { g: "Planimetrie", f: "Euklidova věta o odvěsně", b: "a² = c_a · c  a  b² = c_b · c — odvěsna na druhou = její úsek přepony × celá přepona." },
  { g: "Planimetrie", f: "Vztah mezi výškou a odvěsnami", b: "a · b = c · v_c (plyne z dvojího výpočtu obsahu). Nejrychlejší cesta k v_c." },
  { g: "Planimetrie", f: "Věta o obvodovém a středovém úhlu", b: "ω = 2φ — středový úhel je dvojnásobkem obvodového nad stejným obloukem." },
  { g: "Planimetrie", f: "Obvodové úhly nad stejným obloukem", b: "Jsou shodné. Dva body na kružnici, které vidí tutéž tětivu ze stejné strany, ji vidí pod stejným úhlem." },
  { g: "Planimetrie", f: "Thaletova věta", b: "Úhel nad průměrem kružnice je pravý. Speciální případ obvodového úhlu (180° / 2 = 90°)." },
  { g: "Planimetrie", f: "Tětivový čtyřúhelník", b: "Čtyřúhelník vepsaný do kružnice — součet protilehlých úhlů je 180°." },
  { g: "Planimetrie", f: "Věty o podobnosti", b: "sss (poměry tří stran), sus (poměr dvou stran + úhel mezi nimi), uu (dva shodné úhly)." },
  { g: "Planimetrie", f: "Poměr podobnosti k — co se čím násobí?", b: "Délky … k, obsahy … k², objemy … k³." },
  { g: "Planimetrie", f: "Sinová věta", b: "a/sin α = b/sin β = c/sin γ = 2r. Použij, když máš dvojici strana + protilehlý úhel (usu, Ssu)." },
  { g: "Planimetrie", f: "Kosinová věta", b: "a² = b² + c² − 2bc·cos α. Použij u sus (hledám stranu) a sss (hledám úhel)." },
  { g: "Planimetrie", f: "Kdy má úloha se sinovou větou dvě řešení?", b: "Když ze sin α = k vyjde i druhý úhel 180° − α, se kterým je součet úhlů stále < 180°. Typicky případ SSA." },
  { g: "Planimetrie", f: "Obsah trojúhelníku ze dvou stran a úhlu", b: "S = ½ · a · b · sin γ, kde γ je úhel mezi stranami a, b." },
  { g: "Planimetrie", f: "Heronův vzorec", b: "S = √(s(s−a)(s−b)(s−c)), kde s = (a+b+c)/2. Pro obsah ze tří stran." },
  { g: "Goniometrie", f: "Základní identita", b: "sin²x + cos²x = 1  ⟹  sin²x = 1 − cos²x  a  cos²x = 1 − sin²x." },
  { g: "Goniometrie", f: "sin 2x a cos 2x", b: "sin 2x = 2·sin x·cos x;  cos 2x = cos²x − sin²x = 1 − 2sin²x = 2cos²x − 1." },
  { g: "Goniometrie", f: "Sudost a lichost", b: "sin(−x) = −sin x (lichá funkce), cos(−x) = cos x (sudá funkce)." },
  { g: "Goniometrie", f: "Vztahy pro doplněk do 180°", b: "sin(180° − x) = sin x, ale cos(180° − x) = −cos x. Proto sinus nerozliší ostrý a tupý úhel." },
  { g: "Goniometrie", f: "Řešení sin x = a", b: "x = x₀ + 2kπ  ∨  x = π − x₀ + 2kπ (souměrné podle osy y)." },
  { g: "Goniometrie", f: "Řešení cos x = a", b: "x = ±x₀ + 2kπ (souměrné podle osy x)." },
  { g: "Goniometrie", f: "Řešení tg x = a", b: "x = x₀ + kπ — perioda tangenty je π, ne 2π." },
  { g: "Goniometrie", f: "Postup u kvadratické gonio. rovnice", b: "Převeď vše na jednu funkci (sin²x = 1 − cos²x), substituuj t, vyřeš kvadratickou rovnici, ověř |t| ≤ 1, pak zpět." },
  { g: "Goniometrie", f: "Periody funkcí", b: "sin, cos … 2π;  tg, cotg … π. U sin(bx) je perioda 2π/|b|." },
  { g: "Goniometrie", f: "Obor hodnot y = a·sin(bx) + d", b: "H(f) = ⟨d − |a|; d + |a|⟩. Např. y = 2sin(3x) − 1 → ⟨−3; 1⟩." },
  { g: "Goniometrie", f: "Definiční obor tg a cotg", b: "tg x: x ≠ π/2 + kπ (cos ≠ 0). cotg x: x ≠ kπ (sin ≠ 0)." },
  { g: "Goniometrie", f: "Kdy určuji podmínky výrazu?", b: "Vždy ze ZADANÉHO tvaru, před úpravou. Po zkrácení už podmínky nevidíš, ale platí dál." },
  { g: "Analytická", f: "Vzdálenost dvou bodů", b: "|AB| = √((b₁ − a₁)² + (b₂ − a₂)²)" },
  { g: "Analytická", f: "Střed úsečky a zpětný výpočet", b: "S = ((a₁+b₁)/2; (a₂+b₂)/2). Zpětně: A = 2S − B." },
  { g: "Analytická", f: "Čtvrtý vrchol rovnoběžníku ABCD", b: "D = A + C − B (protože AB = DC). Kontrola: středy úhlopříček AC a BD splynou." },
  { g: "Analytická", f: "Skalární součin", b: "u · v = u₁v₁ + u₂v₂ = |u|·|v|·cos φ" },
  { g: "Analytická", f: "Podmínka kolmosti vektorů", b: "u ⊥ v  ⟺  u · v = 0. Kolmý vektor k (u₁; u₂) je (−u₂; u₁)." },
  { g: "Analytická", f: "Odchylka vektorů vs. odchylka přímek", b: "Vektory: cos φ = (u·v)/(|u||v|), může vyjít tupý úhel. Přímky: cos φ = |u·v|/(|u||v|), vždy ⟨0°; 90°⟩." },
  { g: "Analytická", f: "Obecná rovnice přímky — co je co?", b: "ax + by + c = 0. Vektor n = (a; b) je NORMÁLOVÝ (kolmý). Směrový je s = (−b; a)." },
  { g: "Analytická", f: "Parametrické rovnice přímky", b: "x = a₁ + s₁t, y = a₂ + s₂t, t ∈ ℝ. A je bod na přímce, s je směrový vektor." },
  { g: "Analytická", f: "Směrnicový tvar", b: "y = kx + q, kde k = tg α je směrnice a α je úhel přímky s osou x." },
  { g: "Analytická", f: "Vzdálenost bodu od přímky", b: "d = |a·x₀ + b·y₀ + c| / √(a² + b²). Přímka musí být v obecném tvaru s nulou vpravo!" },
  { g: "Analytická", f: "Osa úsečky AB — jak ji sestavit?", b: "Normálový vektor = vektor AB, prochází středem úsečky. Dosadíš střed a dopočítáš c." },
  { g: "Analytická", f: "Vzájemná poloha dvou přímek", b: "Různé směrové vektory → různoběžné. Stejné + bod jedné leží na druhé → totožné. Stejné + neleží → rovnoběžné různé." },
  { g: "Analytická", f: "Vzdálenost dvou rovnoběžek", b: "Vezmi libovolný bod na jedné přímce a spočítej jeho vzdálenost od druhé." },
  { g: "Analytická", f: "Středová rovnice kružnice", b: "(x − m)² + (y − n)² = r², střed S = [m; n]. Pozor na znaménka: (y + 3)² znamená n = −3." },
  { g: "Analytická", f: "Doplnění na čtverec", b: "x² − 4x = (x − 2)² − 4. Polovinu koeficientu u x dáš do závorky, její druhou mocninu odečteš." },
  { g: "Analytická", f: "Vzájemná poloha přímky a kružnice", b: "Spočítej d(S, p) a porovnej s r: d < r sečna, d = r tečna, d > r vnější přímka." },
  { g: "Analytická", f: "Tečna kružnice v bodě T", b: "Normálový vektor tečny je ST = T − S. Nejdřív ověř, že T na kružnici leží." },
];

function KartickyTab() {
  const [i, setI] = useState(0);
  const [flip, setFlip] = useState(false);
  const [filter, setFilter] = useState("Vše");
  const cats = ["Vše", "Planimetrie", "Goniometrie", "Analytická"];
  const list = useMemo(() => filter === "Vše" ? CARDS : CARDS.filter(c => c.g === filter), [filter]);
  const card = list[Math.min(i, list.length - 1)];
  const go = (d) => { setFlip(false); setI(p => (p + d + list.length) % list.length); };
  const colorOf = g => g === "Planimetrie" ? PINK : g === "Goniometrie" ? CYAN : VIOLET;
  const c = colorOf(card.g);

  return (
    <div style={{ maxWidth: "620px", margin: "0 auto", padding: "16px" }}>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "18px", justifyContent: "center" }}>
        {cats.map(x => (
          <button key={x} onClick={() => { setFilter(x); setI(0); setFlip(false); }} style={{
            padding: "7px 14px", borderRadius: "999px", cursor: "pointer", fontSize: "13px", fontFamily: "inherit",
            background: filter === x ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.05)",
            border: `1px solid ${filter === x ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.12)"}`,
            color: filter === x ? "#fff" : "rgba(255,255,255,0.55)", transition: "all 0.4s ease",
          }}>{x}</button>
        ))}
      </div>

      <div style={{ perspective: "1400px", marginBottom: "18px" }}>
        <div onClick={() => setFlip(f => !f)} style={{
          position: "relative", width: "100%", minHeight: "230px", cursor: "pointer",
          transformStyle: "preserve-3d", transition: "transform 0.4s ease",
          transform: flip ? "rotateY(180deg)" : "none",
        }}>
          {[false, true].map(back => (
            <div key={String(back)} style={{
              ...glass, position: back ? "absolute" : "relative", inset: back ? 0 : undefined,
              width: "100%", minHeight: "230px", padding: "28px 26px",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              textAlign: "center", backfaceVisibility: "hidden",
              transform: back ? "rotateY(180deg)" : "none",
              borderColor: c + "55", boxShadow: `0 0 40px ${c}18`,
            }}>
              <div style={{ fontSize: "11.5px", color: c, letterSpacing: "1px", marginBottom: "14px", fontFamily: HEAD }}>{card.g.toUpperCase()}</div>
              <div style={{
                color: "#fff", fontSize: back ? "15px" : "19px", fontWeight: back ? 400 : 700,
                lineHeight: 1.65, fontFamily: back ? "inherit" : HEAD,
              }}>{back ? card.b : card.f}</div>
              <div style={{ marginTop: "18px", fontSize: "11.5px", color: "rgba(255,255,255,0.3)" }}>
                {back ? "klikni pro otočení zpět" : "klikni pro odpověď"}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
        <button style={{ ...S.btn, marginTop: 0 }} onClick={() => go(-1)}>← Zpět</button>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", fontFamily: MONO }}>{Math.min(i, list.length - 1) + 1} / {list.length}</div>
        <button style={{ ...S.btn, marginTop: 0 }} onClick={() => go(1)}>Další →</button>
      </div>

      <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", justifyContent: "center", marginTop: "18px" }}>
        {list.map((cc, k) => (
          <div key={k} onClick={() => { setI(k); setFlip(false); }} style={{
            width: "9px", height: "9px", borderRadius: "50%", cursor: "pointer", transition: "all 0.4s ease",
            background: k === Math.min(i, list.length - 1) ? colorOf(cc.g) : "rgba(255,255,255,0.18)",
          }} />
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// VZORCE (tahák)
// ══════════════════════════════════════════════════════════════════
const SHEET = [
  {
    t: "Pravoúhlý trojúhelník", c: CYAN, rows: [
      ["Pythagorova věta", "a² + b² = c²"],
      ["Euklidova v. o výšce", "v_c² = c_a · c_b"],
      ["Euklidova v. o odvěsně", "a² = c_a · c      b² = c_b · c"],
      ["Výška z obsahu", "a · b = c · v_c"],
      ["Gonio. poměry", "sin α = protilehlá/přepona,  cos α = přilehlá/přepona,  tg α = protilehlá/přilehlá"],
      ["Trojice k zapamatování", "3-4-5 · 5-12-13 · 8-15-17 · 7-24-25"],
    ]
  },
  {
    t: "Obecný trojúhelník", c: PINK, rows: [
      ["Sinová věta", "a/sin α = b/sin β = c/sin γ = 2r"],
      ["Kosinová věta", "a² = b² + c² − 2bc·cos α"],
      ["Úhel ze tří stran", "cos α = (b² + c² − a²) / (2bc)"],
      ["Obsah — základna", "S = ½ · a · v_a"],
      ["Obsah — sus", "S = ½ · a · b · sin γ"],
      ["Obsah — Heron", "S = √(s(s−a)(s−b)(s−c)),  s = (a+b+c)/2"],
      ["Obsah — opsaná/vepsaná", "S = abc/(4r)      S = ρ·s"],
      ["Součet úhlů", "α + β + γ = 180°"],
    ]
  },
  {
    t: "Kružnice a podobnost", c: AMBER, rows: [
      ["Obvodový a středový úhel", "ω = 2 · φ"],
      ["Thaletova věta", "úhel nad průměrem = 90°"],
      ["Tětivový čtyřúhelník", "součet protilehlých úhlů = 180°"],
      ["Poměr podobnosti", "délky ~ k,  obsahy ~ k²,  objemy ~ k³"],
      ["Věty o podobnosti", "sss · sus · uu"],
      ["Obvod / obsah kruhu", "o = 2πr      S = πr²"],
      ["Délka oblouku / výseč", "l = r·α(rad)      S = ½·r²·α(rad)"],
    ]
  },
  {
    t: "Goniometrie — identity", c: CYAN, rows: [
      ["Základní", "sin²x + cos²x = 1"],
      ["Tangens a kotangens", "tg x = sin x / cos x,   cotg x = cos x / sin x,   tg x·cotg x = 1"],
      ["Dvojnásobný argument", "sin 2x = 2 sin x cos x"],
      ["", "cos 2x = cos²x − sin²x = 1 − 2sin²x = 2cos²x − 1"],
      ["Součtové vzorce", "sin(x ± y) = sin x cos y ± cos x sin y"],
      ["", "cos(x ± y) = cos x cos y ∓ sin x sin y"],
      ["Sudost / lichost", "sin(−x) = −sin x,   cos(−x) = cos x"],
      ["Doplněk do 180°", "sin(180° − x) = sin x,   cos(180° − x) = −cos x"],
      ["Doplněk do 90°", "sin(90° − x) = cos x,   cos(90° − x) = sin x"],
    ]
  },
  {
    t: "Goniometrie — hodnoty a funkce", c: CYAN, rows: [
      ["x", "0°     30°      45°      60°      90°"],
      ["sin x", "0     1/2     √2/2     √3/2      1"],
      ["cos x", "1    √3/2     √2/2      1/2      0"],
      ["tg x", "0    √3/3      1        √3      —"],
      ["Řešení sin x = a", "x = x₀ + 2kπ  ∨  x = π − x₀ + 2kπ"],
      ["Řešení cos x = a", "x = ±x₀ + 2kπ"],
      ["Řešení tg x = a", "x = x₀ + kπ"],
      ["Periody", "sin, cos … 2π      tg, cotg … π      sin(bx) … 2π/|b|"],
      ["y = a·sin(bx+c)+d", "H(f) = ⟨d−|a|; d+|a|⟩,  T = 2π/|b|,  posun o c/b vlevo a d nahoru"],
      ["Radiány ↔ stupně", "π rad = 180°,   1 rad ≐ 57,3°"],
    ]
  },
  {
    t: "Body a vektory", c: VIOLET, rows: [
      ["Vektor z bodů", "u = B − A = (b₁−a₁; b₂−a₂)"],
      ["Velikost vektoru", "|u| = √(u₁² + u₂²)"],
      ["Vzdálenost bodů", "|AB| = √((b₁−a₁)² + (b₂−a₂)²)"],
      ["Střed úsečky", "S = ((a₁+b₁)/2; (a₂+b₂)/2)      zpětně: A = 2S − B"],
      ["Rovnoběžník ABCD", "D = A + C − B"],
      ["Skalární součin", "u · v = u₁v₁ + u₂v₂ = |u||v| cos φ"],
      ["Kolmost", "u ⊥ v  ⟺  u · v = 0"],
      ["Kolmý vektor", "k u = (u₁; u₂) je n = (−u₂; u₁)"],
      ["Odchylka vektorů", "cos φ = (u·v) / (|u|·|v|)      φ ∈ ⟨0°; 180°⟩"],
    ]
  },
  {
    t: "Přímka", c: PINK, rows: [
      ["Parametrické", "x = a₁ + s₁t,  y = a₂ + s₂t,  t ∈ ℝ"],
      ["Obecná", "ax + by + c = 0,  n = (a; b) normálový,  s = (−b; a) směrový"],
      ["Směrnicová", "y = kx + q,  k = tg α"],
      ["Vzdálenost bodu od přímky", "d = |a·x₀ + b·y₀ + c| / √(a² + b²)"],
      ["Odchylka přímek", "cos φ = |s₁·s₂| / (|s₁|·|s₂|)      φ ∈ ⟨0°; 90°⟩"],
      ["Osa úsečky AB", "n = AB, prochází středem S"],
      ["Rovnoběžka s osou x / y", "y = konst.  /  x = konst."],
      ["Vzájemná poloha", "s₁ ∦ s₂ různoběžné · s₁ ∥ s₂ + bod leží totožné · jinak rovnoběžné různé"],
    ]
  },
  {
    t: "Kružnice analyticky", c: GREEN, rows: [
      ["Středová rovnice", "(x − m)² + (y − n)² = r²,  S = [m; n]"],
      ["Obecná rovnice", "x² + y² + Dx + Ey + F = 0"],
      ["Doplnění na čtverec", "x² − 4x = (x − 2)² − 4"],
      ["Poloha přímky a kružnice", "d < r sečna · d = r tečna · d > r vnější přímka"],
      ["Tečna v bodě T", "n = ST = T − S, prochází bodem T"],
    ]
  },
];

function VzorceTab() {
  return (
    <div style={{ maxWidth: "820px", margin: "0 auto", padding: "16px" }}>
      <div style={{ ...glass, padding: "14px 18px", marginBottom: "18px", borderColor: GREEN + "44" }}>
        <div style={{ color: "rgba(255,255,255,0.72)", fontSize: "13.5px", lineHeight: 1.65 }}>
          Kompletní tahák. Goniometrické vzorce si smíš vzít na papíře — tuhle sekci si můžeš vytisknout nebo opsat.
          Zbytek (planimetrie, analytická geometrie) musíš umět zpaměti, pokud nebude v dodaných tabulkách.
        </div>
      </div>

      {SHEET.map((sec, i) => (
        <div key={i} style={{ ...glass, padding: "18px 20px", marginBottom: "16px", borderColor: sec.c + "38" }}>
          <div style={{ fontFamily: HEAD, color: sec.c, fontSize: "14.5px", marginBottom: "14px", textShadow: `0 0 14px ${sec.c}44` }}>{sec.t}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
            {sec.rows.map((r, j) => (
              <div key={j} style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "baseline", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "8px" }}>
                <div style={{ flex: "0 0 165px", color: "rgba(255,255,255,0.55)", fontSize: "13px" }}>{r[0]}</div>
                <div style={{ flex: "1 1 240px", fontFamily: MONO, color: sec.c, fontSize: "13.5px", lineHeight: 1.6, wordBreak: "break-word" }}>{r[1]}</div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ ...glass, padding: "18px 20px", borderColor: "#f8717144" }}>
        <div style={{ fontFamily: HEAD, color: "#f87171", fontSize: "14.5px", marginBottom: "12px" }}>Nejčastější chyby — přečti si těsně před testem</div>
        <ul style={{ margin: 0, paddingLeft: "20px", color: "rgba(255,255,255,0.75)", fontSize: "14px", lineHeight: 1.8 }}>
          <li>Sinová věta → <b style={{ color: "#fff" }}>vždy ověř druhé řešení</b> 180° − α.</li>
          <li>Kosinus tupého úhlu je záporný → člen <Fx>−2ab·cos α</Fx> se pak <b style={{ color: "#fff" }}>přičítá</b>.</li>
          <li>Obvodový úhel přísluší oblouku, na kterém vrchol <b style={{ color: "#fff" }}>neleží</b>.</li>
          <li>Kořen kvadratické rovnice mimo <Fx>⟨−1; 1⟩</Fx> se zahazuje.</li>
          <li>Podmínky výrazu se určují <b style={{ color: "#fff" }}>ze zadání</b>, ne z výsledku po zkrácení.</li>
          <li>Vzorec pro vzdálenost bodu od přímky vyžaduje <b style={{ color: "#fff" }}>obecný tvar s nulou vpravo</b>.</li>
          <li>V obecné rovnici je <Fx>(a; b)</Fx> <b style={{ color: "#fff" }}>normálový</b>, ne směrový vektor.</li>
          <li>Ze středu zpět na krajní bod: <Fx>A = 2S − B</Fx>, ne <Fx>S − B</Fx>.</li>
          <li>Nejdřív ověř <b style={{ color: "#fff" }}>vzájemnou polohu</b> přímek, pak teprve počítej průsečík.</li>
          <li>U kružnice je vpravo <Fx>r²</Fx>, ne <Fx>r</Fx>; a <Fx>(y + 3)²</Fx> znamená <Fx>n = −3</Fx>.</li>
          <li>Absolutní hodnota u vzdálenosti a odchylky přímek → dvě řešení, resp. ostrý úhel.</li>
          <li>Odpověz na to, na co se ptají (obvod, ne strana; úhel, ne jeho sinus).</li>
        </ul>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// APLIKACE
// ══════════════════════════════════════════════════════════════════
const TABS = [
  { k: "teorie", t: "📐 Teorie", c: CYAN },
  { k: "ulohy", t: "✏️ Řešené úlohy", c: PINK },
  { k: "kviz", t: "🎯 Kvíz", c: VIOLET },
  { k: "karticky", t: "🃏 Kartičky", c: AMBER },
  { k: "vzorce", t: "📋 Vzorce", c: GREEN },
];

export default function App() {
  const [tab, setTab] = useState("teorie");

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a1a", position: "relative",
      overflowX: "hidden", fontFamily: "'Exo 2', 'Segoe UI', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;600;700;800&family=Audiowide&family=JetBrains+Mono:wght@400;600;700&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; background: #0a0a1a; }
        @keyframes gridMove { from { background-position: 0 0; } to { background-position: 0 60px; } }
        @keyframes sunGlow { 0%, 100% { opacity: 0.55; transform: translateX(-50%) scale(1); } 50% { opacity: 0.8; transform: translateX(-50%) scale(1.05); } }
        @keyframes floatUp { 0% { transform: translateY(0); opacity: 0; } 12% { opacity: 0.7; } 88% { opacity: 0.7; } 100% { transform: translateY(-100vh); opacity: 0; } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        .fadeIn { animation: slideIn 0.55s ease both; }
        button:disabled { opacity: 0.35; cursor: not-allowed; }
        input::placeholder { color: rgba(255,255,255,0.28); }
        ::-webkit-scrollbar { width: 9px; height: 9px; }
        ::-webkit-scrollbar-thumb { background: rgba(236,72,153,0.35); border-radius: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
      `}</style>

      {/* ── Synthwave pozadí ── */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        {/* neonové slunce */}
        <div style={{
          position: "absolute", left: "50%", top: "14%", width: "340px", height: "340px",
          borderRadius: "50%", transform: "translateX(-50%)",
          background: `radial-gradient(circle, ${PINK}55 0%, ${VIOLET}22 45%, transparent 70%)`,
          filter: "blur(24px)", animation: "sunGlow 24s ease-in-out infinite",
        }} />
        {/* mřížková podlaha */}
        <div style={{
          position: "absolute", left: 0, right: 0, bottom: 0, height: "42vh",
          backgroundImage: `linear-gradient(${CYAN}2e 1px, transparent 1px), linear-gradient(90deg, ${CYAN}2e 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          transform: "perspective(320px) rotateX(62deg)", transformOrigin: "bottom",
          animation: "gridMove 3.2s linear infinite", opacity: 0.55,
        }} />
        {/* částice */}
        {[...Array(16)].map((_, i) => (
          <div key={i} style={{
            position: "absolute", left: `${(i * 6.3 + 3) % 100}%`, bottom: "-12px",
            width: i % 3 === 0 ? "3px" : "2px", height: i % 3 === 0 ? "3px" : "2px", borderRadius: "50%",
            background: i % 2 ? CYAN : PINK, boxShadow: `0 0 8px ${i % 2 ? CYAN : PINK}`,
            animation: `floatUp ${13 + (i % 7) * 1.4}s linear ${i * 0.9}s infinite`,
          }} />
        ))}
      </div>

      {/* ── Obsah ── */}
      <div style={{ position: "relative", zIndex: 1, paddingBottom: "60px" }}>
        <header style={{ textAlign: "center", padding: "34px 18px 10px" }}>
          <h1 style={{
            fontFamily: HEAD, fontSize: "clamp(17px, 4.6vw, 30px)", color: "#fff",
            margin: "0 0 10px", textShadow: `0 0 22px ${PINK}77`, lineHeight: 1.35,
          }}>Opakování 2. ročníku</h1>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "clamp(12.5px, 3vw, 14.5px)", maxWidth: "560px", margin: "0 auto", lineHeight: 1.6 }}>
            Geometrie · Goniometrie · Analytická geometrie
          </div>
          <div style={{
            display: "inline-block", marginTop: "14px", padding: "6px 16px", borderRadius: "999px",
            background: PINK + "18", border: `1px solid ${PINK}55`, color: PINK, fontSize: "12.5px", fontWeight: 600,
          }}>Písemka příští středu · 26 řešených úloh</div>
        </header>

        <nav style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap", padding: "18px 14px 6px" }}>
          {TABS.map(t => (
            <button key={t.k} onClick={() => setTab(t.k)} style={{
              padding: "10px 18px", borderRadius: "999px", cursor: "pointer",
              fontSize: "clamp(12.5px, 3vw, 14px)", fontFamily: "inherit", whiteSpace: "nowrap",
              background: tab === t.k ? t.c + "26" : "rgba(255,255,255,0.05)",
              border: `1px solid ${tab === t.k ? t.c : "rgba(255,255,255,0.12)"}`,
              color: tab === t.k ? "#fff" : "rgba(255,255,255,0.6)",
              fontWeight: tab === t.k ? 700 : 500, transition: "all 0.4s ease",
              boxShadow: tab === t.k ? `0 0 22px ${t.c}33` : "none",
            }}>{t.t}</button>
          ))}
        </nav>

        <main key={tab} className="fadeIn" style={{ marginTop: "10px" }}>
          {tab === "teorie" && <TeorieTab />}
          {tab === "ulohy" && <UlohyTab />}
          {tab === "kviz" && (
            <div>
              <div style={{ maxWidth: "680px", margin: "0 auto", padding: "0 16px" }}>
                <div style={{ ...glass, padding: "14px 18px", borderColor: VIOLET + "44" }}>
                  <div style={{ color: "rgba(255,255,255,0.72)", fontSize: "13.5px", lineHeight: 1.65 }}>
                    {QUESTIONS.length} otázek ze všech tří okruhů. Zaměřují se na <b style={{ color: "#fff" }}>volbu správného postupu</b> a na typické chyby, ne na počítání.
                    Možnosti se míchají, takže kvíz můžeš opakovat.
                  </div>
                </div>
              </div>
              <QuizEngine questions={QUESTIONS} accentColor={VIOLET} />
            </div>
          )}
          {tab === "karticky" && <KartickyTab />}
          {tab === "vzorce" && <VzorceTab />}
        </main>
      </div>
    </div>
  );
}
