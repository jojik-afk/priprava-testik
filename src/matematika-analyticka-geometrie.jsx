// @title Analytická geometrie — kompletní příprava na test
// @subject Math
// @topic Souřadnice, úsečka, vektory, přímky
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
    const msg = pct >= 90 ? "Výborně! Máš to perfektně zvládnuté!" : pct >= 70 ? "Dobře! Téměř máš vše zvládnuté." : pct >= 50 ? "Mohlo by to být lepší, ale jdeš správným směrem." : "Potřebuješ více přípravy. Opakuj a bude to!";
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "280px" }}>
        <div style={{ textAlign: "center", ...glass, padding: "40px 48px" }}>
          <div style={{ color: "#fff", fontSize: "52px", fontWeight: 800 }}>{score} / {shuffledQuestions.length}</div>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "22px", marginBottom: "16px" }}>{pct} %</div>
          <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "17px", lineHeight: 1.5, marginBottom: "24px", maxWidth: "340px", margin: "0 auto 24px" }}>{msg}</div>
          <button style={{ ...btnS, background: accentColor + "66", border: `1px solid ${accentColor}` }} onClick={restart}>Začít znovu</button>
        </div>
      </div>
    );
  }

  const activeSet = isMulti ? (isRevealed ? myAnswer : pendingMulti) : myAnswer;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "680px", margin: "0 auto", padding: "16px" }}>
      <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
        {shuffledQuestions.map((_, i) => {
          let bg = "#4b5563";
          if (i === idx) bg = accentColor;
          else if (revealed[i]) bg = arrEqual(answers[i] || [], shuffledQuestions[i].correct) ? "#22c55e" : "#ef4444";
          return <div key={i} onClick={() => goTo(i)} title={`Otázka ${i + 1}`} style={{ width: "22px", height: "22px", borderRadius: "50%", cursor: "pointer", transition: "background 0.4s ease", background: bg }} />;
        })}
      </div>
      <div style={{ ...glass, padding: "24px" }}>
        <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", marginBottom: "6px" }}>Otázka {idx + 1} / {shuffledQuestions.length}</div>
        <div style={{ color: "#fff", fontSize: "18px", fontWeight: 600, lineHeight: 1.5, marginBottom: "20px" }}>{q.question}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {q.options.map((opt, i) => {
            let border = "1px solid rgba(255,255,255,0.12)";
            let bg = "rgba(255,255,255,0.04)";
            if (isRevealed) {
              if (q.correct.includes(i)) { bg = "rgba(34,197,94,0.15)"; border = "1px solid #22c55e"; }
              else if (activeSet.includes(i)) { bg = "rgba(239,68,68,0.15)"; border = "1px solid #ef4444"; }
            } else if (activeSet.includes(i)) { bg = accentColor + "18"; border = `1px solid ${accentColor}`; }
            return (
              <div key={i} style={{ padding: "12px 16px", borderRadius: "12px", color: "#fff", cursor: "pointer", transition: "all 0.4s ease", display: "flex", alignItems: "center", gap: "10px", userSelect: "none", fontSize: "15px", background: bg, border }}
                onClick={() => isMulti ? toggleMulti(i) : handleSingleSelect(i)}>
                {isMulti && <span style={{ fontSize: "18px", minWidth: "20px", color: "rgba(255,255,255,0.7)" }}>{activeSet.includes(i) ? "☑" : "☐"}</span>}
                <span>{opt}</span>
              </div>
            );
          })}
        </div>
        {isMulti && !isRevealed && (
          <button style={{ ...btnS, opacity: pendingMulti.length === 0 ? 0.4 : 1, marginTop: "12px" }} onClick={submitMulti} disabled={pendingMulti.length === 0}>Potvrdit</button>
        )}
        {isRevealed && (
          <div style={{ marginTop: "20px", padding: "16px", borderRadius: "14px", border: `1px solid ${isCorrect ? "#22c55e" : "#ef4444"}`, background: "rgba(255,255,255,0.03)" }}>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: "16px", marginBottom: "8px" }}>{isCorrect ? "Správně!" : "Špatně"}</div>
            {!isCorrect && <div style={{ color: "#86efac", fontSize: "14px", marginBottom: "6px" }}>Správná odpověď: {q.correct.map(i => q.options[i]).join(", ")}</div>}
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", lineHeight: 1.5 }}>{q.explanation}</div>
            {q.tip && <div style={{ color: "#fbbf24", fontSize: "13px", marginTop: "8px", fontStyle: "italic" }}>Tip: {q.tip}</div>}
          </div>
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button style={btnS} onClick={() => goTo(idx - 1)} disabled={idx === 0}>← Předchozí</button>
        {idx < shuffledQuestions.length - 1
          ? <button style={btnS} onClick={() => goTo(idx + 1)}>Další →</button>
          : <button style={{ ...btnS, background: accentColor + "55", border: `1px solid ${accentColor}` }} onClick={() => setShowResults(true)}>Výsledky →</button>}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// SHARED STYLES
// ══════════════════════════════════════════════════════════════════
const glass = {
  background: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "20px",
  transition: "all 0.4s ease"
};
const btnS = {
  padding: "10px 22px",
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: "10px",
  color: "#fff",
  cursor: "pointer",
  fontSize: "15px",
  transition: "all 0.4s ease"
};
const PINK = "#ec4899";
const CYAN = "#22d3ee";
const YELLOW = "#fbbf24";
const GREEN = "#34d399";

const pS = { color: "rgba(255,255,255,0.82)", fontSize: "15px", lineHeight: 1.7, margin: "8px 0" };

const TABS = [
  { id: "theory", label: "Teorie" },
  { id: "problems", label: "Příklady" },
  { id: "grid", label: "Mřížka" },
  { id: "quiz", label: "Kvíz" },
  { id: "flashcards", label: "Kartičky" },
  { id: "formulas", label: "Vzorce" },
];

// ══════════════════════════════════════════════════════════════════
// SMALL HELPERS
// ══════════════════════════════════════════════════════════════════
function Collapsible({ title, children, defaultOpen = false, accent = PINK }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ ...glass, padding: "0", marginBottom: "12px", overflow: "hidden" }}>
      <div onClick={() => setOpen(!open)} style={{ padding: "16px 20px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.03)" }}>
        <span style={{ color: "#fff", fontSize: "16px", fontWeight: 600 }}>{title}</span>
        <span style={{ color: accent, fontSize: "20px", transition: "transform 0.4s ease", transform: open ? "rotate(180deg)" : "rotate(0)" }}>▼</span>
      </div>
      {open && <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>{children}</div>}
    </div>
  );
}

// Formula / monospace block
function MBlock({ children, color = CYAN }) {
  return <div style={{ fontFamily: "'JetBrains Mono', monospace", color, fontSize: "14.5px", padding: "12px 16px", background: "rgba(34,211,238,0.06)", borderRadius: "10px", margin: "8px 0", lineHeight: 1.9, overflowX: "auto", whiteSpace: "pre-wrap", border: "1px solid rgba(255,255,255,0.06)" }}>{children}</div>;
}

const DIFF = {
  easy: { label: "✨ Easy", bg: "rgba(34,197,94,0.2)", col: "#4ade80" },
  medium: { label: "⚡ Medium", bg: "rgba(234,179,8,0.2)", col: "#fbbf24" },
  hard: { label: "🔥 Hard", bg: "rgba(239,68,68,0.2)", col: "#f87171" },
};

// Worked problem with hidden solution
function SolvedProblem({ n, title, difficulty = "medium", given, formula, steps, result }) {
  const [open, setOpen] = useState(false);
  const d = DIFF[difficulty];
  return (
    <div style={{ ...glass, padding: "0", marginBottom: "14px", overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", flexWrap: "wrap", background: "rgba(255,255,255,0.03)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <span style={{ color: PINK, fontWeight: 700, fontSize: "14px" }}>{n}.</span>
          <span style={{ color: "#fff", fontSize: "15.5px", fontWeight: 600 }}>{title}</span>
          <span style={{ fontSize: "12px", padding: "2px 10px", borderRadius: "20px", background: d.bg, color: d.col }}>{d.label}</span>
        </div>
        <button style={{ ...btnS, fontSize: "13px", padding: "6px 16px", background: open ? PINK + "22" : "rgba(255,255,255,0.06)", border: open ? `1px solid ${PINK}` : "1px solid rgba(255,255,255,0.15)" }} onClick={() => setOpen(!open)}>
          {open ? "Skrýt řešení" : "Zobrazit řešení"}
        </button>
      </div>
      {open && (
        <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ marginBottom: "10px" }}>
            <span style={{ color: GREEN, fontWeight: 700, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Zadáno</span>
            <div style={{ ...pS, margin: "4px 0 0" }}>{given}</div>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <span style={{ color: CYAN, fontWeight: 700, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Vzorec / postup</span>
            <MBlock>{formula}</MBlock>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <span style={{ color: YELLOW, fontWeight: 700, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Krok za krokem</span>
            <MBlock color={YELLOW}>{steps}</MBlock>
          </div>
          <div style={{ padding: "12px 16px", borderRadius: "12px", background: "rgba(52,211,153,0.1)", border: `1px solid ${GREEN}` }}>
            <span style={{ color: GREEN, fontWeight: 700, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Výsledek</span>
            <div style={{ color: "#fff", fontSize: "15.5px", fontWeight: 600, marginTop: "4px", fontFamily: "'JetBrains Mono', monospace" }}>{result}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// SVG GRID — coordinate plane helpers
// ══════════════════════════════════════════════════════════════════
const RANGE = 7;
const SIZE = 460;
const sc = (SIZE / 2) / RANGE;
const toX = (x) => SIZE / 2 + x * sc;
const toY = (y) => SIZE / 2 - y * sc;

function Arrow({ x1, y1, x2, y2, color, width = 3, dash }) {
  const px1 = toX(x1), py1 = toY(y1), px2 = toX(x2), py2 = toY(y2);
  const ang = Math.atan2(py2 - py1, px2 - px1);
  const len = 11;
  const a1 = ang - Math.PI / 7, a2 = ang + Math.PI / 7;
  return (
    <g>
      <line x1={px1} y1={py1} x2={px2} y2={py2} stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={dash || "none"} />
      {!dash && <polygon points={`${px2},${py2} ${px2 - len * Math.cos(a1)},${py2 - len * Math.sin(a1)} ${px2 - len * Math.cos(a2)},${py2 - len * Math.sin(a2)}`} fill={color} />}
    </g>
  );
}

function GridSvg({ children }) {
  const lines = [];
  for (let i = -RANGE; i <= RANGE; i++) {
    lines.push(<line key={`v${i}`} x1={toX(i)} y1={toY(-RANGE)} x2={toX(i)} y2={toY(RANGE)} stroke="rgba(255,255,255,0.07)" strokeWidth="1" />);
    lines.push(<line key={`h${i}`} x1={toX(-RANGE)} y1={toY(i)} x2={toX(RANGE)} y2={toY(i)} stroke="rgba(255,255,255,0.07)" strokeWidth="1" />);
  }
  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ width: "100%", maxWidth: `${SIZE}px`, height: "auto", background: "rgba(0,0,0,0.35)", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.08)", display: "block", margin: "0 auto" }}>
      {lines}
      <line x1={toX(-RANGE)} y1={toY(0)} x2={toX(RANGE)} y2={toY(0)} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      <line x1={toX(0)} y1={toY(-RANGE)} x2={toX(0)} y2={toY(RANGE)} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      <text x={toX(RANGE) - 10} y={toY(0) - 6} fill="rgba(255,255,255,0.4)" fontSize="12" fontFamily="'JetBrains Mono', monospace">x</text>
      <text x={toX(0) + 7} y={toY(RANGE) + 14} fill="rgba(255,255,255,0.4)" fontSize="12" fontFamily="'JetBrains Mono', monospace">y</text>
      {children}
    </svg>
  );
}

function Slider({ label, value, set, min = -6, max = 6, step = 1, color = CYAN }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "5px 0" }}>
      <span style={{ color, fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", minWidth: "54px" }}>{label} = {value}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => set(Number(e.target.value))} style={{ flex: 1, accentColor: color }} />
    </div>
  );
}

// ── Vector playground ──────────────────────────────────────────────
function VectorPlayground() {
  const [u1, setU1] = useState(3), [u2, setU2] = useState(1);
  const [v1, setV1] = useState(-2), [v2, setV2] = useState(2);
  const [k, setK] = useState(2);
  const [mode, setMode] = useState("add");

  const dot = u1 * v1 + u2 * v2;
  const mu = Math.hypot(u1, u2), mv = Math.hypot(v1, v2);
  const cos = (mu && mv) ? dot / (mu * mv) : 0;
  const ang = (mu && mv) ? Math.acos(Math.max(-1, Math.min(1, cos))) * 180 / Math.PI : 0;

  let res = null, resLabel = "", resColor = YELLOW, extra = null;
  if (mode === "add") {
    res = [u1 + v1, u2 + v2]; resLabel = "u⃗ + v⃗";
    extra = <Arrow x1={u1} y1={u2} x2={u1 + v1} y2={u2 + v2} color={PINK} width={2} dash="5 5" />;
  } else if (mode === "sub") {
    res = [v1 - u1, v2 - u2]; resLabel = "v⃗ − u⃗";
  } else if (mode === "scalar") {
    res = [k * u1, k * u2]; resLabel = `${k}·u⃗`;
  }

  const modes = [["add", "Sčítání"], ["sub", "Odčítání"], ["scalar", "k · u⃗"], ["dot", "Skalární součin & úhel"]];

  return (
    <div>
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px", justifyContent: "center" }}>
        {modes.map(([id, lbl]) => (
          <button key={id} onClick={() => setMode(id)} style={{ ...btnS, fontSize: "13px", padding: "6px 14px", background: mode === id ? PINK + "33" : "rgba(255,255,255,0.05)", border: mode === id ? `1px solid ${PINK}` : "1px solid rgba(255,255,255,0.12)" }}>{lbl}</button>
        ))}
      </div>

      <GridSvg>
        <Arrow x1={0} y1={0} x2={u1} y2={u2} color={CYAN} />
        <text x={toX(u1) + 6} y={toY(u2) - 4} fill={CYAN} fontSize="13" fontFamily="'JetBrains Mono', monospace">u</text>
        <Arrow x1={0} y1={0} x2={v1} y2={v2} color={PINK} />
        <text x={toX(v1) + 6} y={toY(v2) - 4} fill={PINK} fontSize="13" fontFamily="'JetBrains Mono', monospace">v</text>
        {res && <Arrow x1={0} y1={0} x2={res[0]} y2={res[1]} color={resColor} width={3.5} />}
        {extra}
      </GridSvg>

      <div style={{ marginTop: "14px", padding: "12px 16px", background: "rgba(255,255,255,0.04)", borderRadius: "12px" }}>
        <Slider label="u₁" value={u1} set={setU1} color={CYAN} />
        <Slider label="u₂" value={u2} set={setU2} color={CYAN} />
        <Slider label="v₁" value={v1} set={setV1} color={PINK} />
        <Slider label="v₂" value={v2} set={setV2} color={PINK} />
        {mode === "scalar" && <Slider label="k" value={k} set={setK} min={-3} max={3} color={YELLOW} />}
      </div>

      <MBlock>
        {`u⃗ = (${u1}; ${u2})    |u⃗| = √${u1 * u1 + u2 * u2} ≈ ${mu.toFixed(2)}\n`}
        {`v⃗ = (${v1}; ${v2})    |v⃗| = √${v1 * v1 + v2 * v2} ≈ ${mv.toFixed(2)}\n`}
        {res ? `${resLabel} = (${res[0]}; ${res[1]})` : ""}
        {mode === "dot" ? `u⃗·v⃗ = ${u1}·${v1} + ${u2}·${v2} = ${dot}\ncos φ = ${dot} / (√${u1*u1+u2*u2}·√${v1*v1+v2*v2}) ≈ ${cos.toFixed(3)}\nφ ≈ ${ang.toFixed(1)}°${Math.abs(dot) < 1e-9 ? "   (kolmé!)" : ""}` : ""}
      </MBlock>
    </div>
  );
}

// ── Lines playground ────────────────────────────────────────────────
function LinesPlayground() {
  const [pax, setPax] = useState(-2), [pay, setPay] = useState(1);   // bod přímky p
  const [psx, setPsx] = useState(1), [psy, setPsy] = useState(2);    // směr p
  const [qax, setQax] = useState(0), [qay, setQay] = useState(5);    // bod přímky q
  const [qsx, setQsx] = useState(2), [qsy, setQsy] = useState(-1);   // směr q

  const detDir = psx * qsy - psy * qsx;
  const dx = qax - pax, dy = qay - pay;
  let poloha, P = null, color = PINK;
  if (detDir !== 0) {
    poloha = "různoběžné";
    const t = (dx * qsy - dy * qsx) / detDir;
    P = [pax + t * psx, pay + t * psy];
  } else {
    // směry rovnoběžné → totožné, pokud (q.bod − p.bod) ∥ s_p
    const cross = dx * psy - dy * psx;
    poloha = (cross === 0) ? "splývající (totožné)" : "rovnoběžné (různé)";
    color = cross === 0 ? GREEN : CYAN;
  }

  // úhel přímek (z absolutní hodnoty)
  const dotS = psx * qsx + psy * qsy;
  const mp = Math.hypot(psx, psy), mq = Math.hypot(qsx, qsy);
  const angL = (mp && mq) ? Math.acos(Math.min(1, Math.abs(dotS) / (mp * mq))) * 180 / Math.PI : 0;

  // přímka jako úsečka přes celou mřížku: bod ± big·směr
  const big = 40;
  const lineP = [[pax - big * psx, pay - big * psy], [pax + big * psx, pay + big * psy]];
  const lineQ = [[qax - big * qsx, qay - big * qsy], [qax + big * qsx, qay + big * qsy]];

  return (
    <div>
      <GridSvg>
        <line x1={toX(lineP[0][0])} y1={toY(lineP[0][1])} x2={toX(lineP[1][0])} y2={toY(lineP[1][1])} stroke={CYAN} strokeWidth="2.5" />
        <line x1={toX(lineQ[0][0])} y1={toY(lineQ[0][1])} x2={toX(lineQ[1][0])} y2={toY(lineQ[1][1])} stroke={PINK} strokeWidth="2.5" />
        <Arrow x1={pax} y1={pay} x2={pax + psx} y2={pay + psy} color={CYAN} width={3} />
        <Arrow x1={qax} y1={qay} x2={qax + qsx} y2={qay + qsy} color={PINK} width={3} />
        <circle cx={toX(pax)} cy={toY(pay)} r={3.5} fill={CYAN} />
        <circle cx={toX(qax)} cy={toY(qay)} r={3.5} fill={PINK} />
        <text x={toX(pax) + 6} y={toY(pay) + 16} fill={CYAN} fontSize="12" fontFamily="'JetBrains Mono', monospace">p</text>
        <text x={toX(qax) + 6} y={toY(qay) + 16} fill={PINK} fontSize="12" fontFamily="'JetBrains Mono', monospace">q</text>
        {P && Math.abs(P[0]) <= RANGE && Math.abs(P[1]) <= RANGE && (
          <g>
            <circle cx={toX(P[0])} cy={toY(P[1])} r={5} fill={YELLOW} stroke="#fff" strokeWidth="1.5" />
            <text x={toX(P[0]) + 8} y={toY(P[1]) - 8} fill={YELLOW} fontSize="12" fontFamily="'JetBrains Mono', monospace">P</text>
          </g>
        )}
      </GridSvg>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "14px" }}>
        <div style={{ flex: "1 1 200px", padding: "12px 16px", background: "rgba(34,211,238,0.06)", borderRadius: "12px" }}>
          <div style={{ color: CYAN, fontWeight: 700, fontSize: "13px", marginBottom: "4px" }}>Přímka p</div>
          <Slider label="A_p x" value={pax} set={setPax} color={CYAN} />
          <Slider label="A_p y" value={pay} set={setPay} color={CYAN} />
          <Slider label="s_p x" value={psx} set={setPsx} color={CYAN} />
          <Slider label="s_p y" value={psy} set={setPsy} color={CYAN} />
        </div>
        <div style={{ flex: "1 1 200px", padding: "12px 16px", background: "rgba(236,72,153,0.06)", borderRadius: "12px" }}>
          <div style={{ color: PINK, fontWeight: 700, fontSize: "13px", marginBottom: "4px" }}>Přímka q</div>
          <Slider label="A_q x" value={qax} set={setQax} color={PINK} />
          <Slider label="A_q y" value={qay} set={setQay} color={PINK} />
          <Slider label="s_q x" value={qsx} set={setQsx} color={PINK} />
          <Slider label="s_q y" value={qsy} set={setQsy} color={PINK} />
        </div>
      </div>

      <MBlock color={color}>
        {`s_p = (${psx}; ${psy})   s_q = (${qsx}; ${qsy})\n`}
        {`det(s_p, s_q) = ${psx}·${qsy} − ${psy}·${qsx} = ${detDir}\n`}
        {`→ ${poloha}`}
        {P ? `\nprůsečík P = (${fmt(P[0])}; ${fmt(P[1])})\núhel přímek φ ≈ ${angL.toFixed(1)}°${Math.abs(dotS) < 1e-9 ? " (kolmé)" : ""}` : ""}
      </MBlock>
    </div>
  );
}
function fmt(x) {
  const r = Math.round(x * 100) / 100;
  return Number.isInteger(r) ? String(r) : r.toFixed(2);
}

// ══════════════════════════════════════════════════════════════════
// TABS
// ══════════════════════════════════════════════════════════════════
function TheoryTab() {
  return (
    <div style={{ maxWidth: "760px", margin: "0 auto" }}>
      <Collapsible title="1 · Vektory — základ" defaultOpen>
        <p style={pS}><strong>Vektor</strong> = „posun" / „cesta". Má <strong>velikost</strong> a <strong>směr</strong> (šipka). Jeden vektor lze umístit nekonečně mnoha způsoby — všechna umístění reprezentují <em>tentýž</em> vektor.</p>
        <p style={pS}>Souřadnice vektoru ze dvou bodů a jeho velikost:</p>
        <MBlock>{"A[a₁; a₂], B[b₁; b₂]\nAB⃗ = (b₁ − a₁ ; b₂ − a₂)\n|u⃗| = √(u₁² + u₂²)"}</MBlock>
        <p style={pS}><strong>Opačné vektory:</strong> AB⃗ a BA⃗ — stejná velikost, opačný směr. Obecně −u⃗ = (−u₁; −u₂).</p>
        <p style={pS}>Příklad: A[2;1], B[5;5] → AB⃗ = (3;4), |AB⃗| = √(9+16) = 5.</p>
      </Collapsible>

      <Collapsible title="2 · Střed úsečky a těžiště">
        <MBlock>{"Střed úsečky AB:  S = [ (a₁+b₁)/2 ; (a₂+b₂)/2 ]\n\nTěžiště △ABC:     T = [ (a₁+b₁+c₁)/3 ; (a₂+b₂+c₂)/3 ]"}</MBlock>
        <p style={pS}>Těžiště se odvozuje jako T = A + ⅔·AS⃗, kde S je střed protější strany. Příklad: A[−1;−3], B[5;2], C[2;5] → T = [6/3; 4/3] = [2; 4/3].</p>
      </Collapsible>

      <Collapsible title="3 · Operace s vektory">
        <MBlock>{"u⃗ + v⃗ = (u₁+v₁ ; u₂+v₂)\nv⃗ − u⃗ = (v₁−u₁ ; v₂−u₂)\nk · u⃗ = (k·u₁ ; k·u₂)     k ∈ ℝ\n−u⃗ = (−u₁ ; −u₂)"}</MBlock>
        <p style={pS}>Sčítání graficky: vektory se kladou „za sebe" (hlava–pata). Fyzika: skládání sil F⃗ = F⃗₁ + F⃗₂.</p>
      </Collapsible>

      <Collapsible title="4 · Lineární (ne)závislost a kolinearita">
        <p style={pS}>Dva vektory v rovině jsou <strong>lineárně závislé (LZ)</strong>, pokud je lze posunutím umístit na jednu přímku.</p>
        <MBlock>{"LZ ⟺ ∃ k ≠ 0 :  v⃗ = k · u⃗\n     ⟺ det(u⃗, v⃗) = 0"}</MBlock>
        <p style={pS}><strong>Kolineární body</strong> = body ležící na jedné přímce. Test: AB⃗ a AC⃗ jsou násobky (det = 0).</p>
        <p style={pS}>Příklad: K[−4;6], L[2;3], M[4;2] → KL⃗=(6;−3), LM⃗=(2;−1), LM⃗ = ⅓·KL⃗ → kolineární.</p>
      </Collapsible>

      <Collapsible title="5 · Lineární kombinace">
        <MBlock>{"w⃗ = a · u⃗ + b · v⃗     a, b ∈ ℝ (aspoň jedno ≠ 0)\nNulový vektor:  O⃗ = (0; 0)"}</MBlock>
        <p style={pS}>Zápis vektoru jako LK = řeší se <strong>soustavou dvou rovnic</strong> (jedna pro x-ové, jedna pro y-ové složky). Příklad: w⃗=(−1;−1), u⃗=(1;3), v⃗=(2;5) → w⃗ = 3u⃗ − 2v⃗.</p>
      </Collapsible>

      <Collapsible title="6 · Skalární součin + kolmost">
        <MBlock>{"u⃗ · v⃗ = u₁·v₁ + u₂·v₂      (výsledek je ČÍSLO)\n\nu⃗ ⊥ v⃗  ⟺  u⃗ · v⃗ = 0"}</MBlock>
        <p style={pS}>Znaménko podle úhlu φ: φ=90° → součin 0; φ ostrý → součin kladný; φ tupý → součin záporný.</p>
        <p style={pS}>Příklad: u⃗=(3;6), v⃗=(−4;2) → 3·(−4)+6·2 = 0 → kolmé.</p>
      </Collapsible>

      <Collapsible title="7 · Odchylka vektorů (úhel)">
        <MBlock>{"cos φ = (u₁v₁ + u₂v₂) / (|u⃗| · |v⃗|)\n      = (u⃗ · v⃗) / (|u⃗| · |v⃗|)"}</MBlock>
        <p style={pS}>Příklad: u⃗=(3;−2), v⃗=(6;5): cos φ = 8/(√13·√61) = 8/√793 → φ ≈ 73°30′.</p>
      </Collapsible>

      <Collapsible title="8 · Determinant a obsah">
        <MBlock>{"det(u⃗, v⃗) = | u₁  u₂ |\n            | v₁  v₂ | = u₁·v₂ − u₂·v₁\n\nObsah trojúhelníku:    S△ = ½ · |det(u⃗, v⃗)|\nObsah rovnoběžníku:    S  = |det(u⃗, v⃗)|"}</MBlock>
        <p style={pS}>Pravidlo: hlavní diagonála minus vedlejší. Vektory u⃗, v⃗ jsou dvě strany vycházející ze stejného vrcholu.</p>
        <p style={pS}>Příklad: A[1;2], B[3;−1], C[7;4] → AC⃗=(6;2), AB⃗=(2;−3), det=6·(−3)−2·2=−22 → S△ = ½·22 = 11.</p>
      </Collapsible>

      <Collapsible title="9 · Přímka — tři tvary rovnice">
        <MBlock>{"Směrnicový:    y = a·x + b           (a = směrnice)\nObecný:        a·x + b·y + c = 0\nParametrický:  X = A + t·u⃗,  t ∈ ℝ\n               x = a₁ + t·u₁\n               y = a₂ + t·u₂"}</MBlock>
        <p style={pS}>Směrnice ze dvou bodů: a = (b₂ − a₂) / (b₁ − a₁). Mezi tvary se převádí — z parametrického vyloučíš t, ze směrnicového vynásobíš a převedeš na nulu.</p>
        <p style={pS}>Příklad: A[3;4], B[5;−1] → y = −5/2 x + 23/2 → (×2) → 5x + 2y − 23 = 0.</p>
      </Collapsible>

      <Collapsible title="10 · Směrový a normálový vektor">
        <MBlock>{"Přímka a·x + b·y + c = 0:\n   normálový vektor   n⃗ = (a; b)   (kolmý na přímku)\n   směrový vektor     s⃗ = (b; −a)  (rovnoběžný s přímkou)\n\ns⃗ ⊥ n⃗   (jejich skalární součin = 0)"}</MBlock>
        <p style={pS}>Z bodů: s⃗ = AB⃗. Z normály získáš směr „prohozením a změnou znaménka". Příklad: A[1;5], B[3;−4] → s⃗=(2;−9), n⃗=(9;2) → 9x + 2y − 19 = 0.</p>
      </Collapsible>

      <Collapsible title="11 · Vzájemná poloha dvou přímek">
        <p style={pS}>Tři případy: <strong>různoběžné</strong> (jeden průsečík) · <strong>rovnoběžné</strong> (žádný společný bod) · <strong>splývající/totožné</strong> (stejná přímka).</p>
        <MBlock>{"det(s_p, s_q) ≠ 0   → různoběžné → najdi průsečík\ndet(s_p, s_q) = 0   → rovnoběžné NEBO totožné\n   (rozliš dosazením bodu jedné přímky do druhé)"}</MBlock>
        <p style={pS}>Příklad: p={"{[−2+t; 1+2t]}"}, q={"{[2k; 5−k]}"}: s_p=(1;2), s_q=(2;−1), det=−5 ≠ 0 → různoběžné, P[0;5], a navíc s_p·s_q=0 → kolmé (úhel 90°).</p>
      </Collapsible>

      <Collapsible title="12 · Vzdálenost bodu od přímky" accent={YELLOW}>
        <p style={{ ...pS, color: YELLOW }}>⚠️ Tohle nebylo v zápiscích z hodin, ale je na procvičovacím listu — zařazeno dle domluvy.</p>
        <MBlock color={YELLOW}>{"A[x₀; y₀],  p: a·x + b·y + c = 0\n\nd(A, p) = |a·x₀ + b·y₀ + c| / √(a² + b²)"}</MBlock>
        <p style={pS}>Je-li přímka zadaná parametricky, převeď ji nejdřív na obecný tvar. Příklad: A[7;−1], p: 3x−y−2=0 → d = |21+1−2|/√10 = 20/√10 = 2√10.</p>
      </Collapsible>
    </div>
  );
}

function ProblemsTab() {
  return (
    <div style={{ maxWidth: "760px", margin: "0 auto" }}>
      <p style={{ ...pS, textAlign: "center", marginBottom: "16px" }}>Vzorové úlohy z hodin, samostatné práce a obou procvičovacích listů. Řešení je skryté — nejdřív si zkus spočítat sám.</p>

      <SolvedProblem n={1} difficulty="easy" title="Vektor ze dvou bodů a jeho velikost"
        given="A[2; 1], B[5; 5]. Urči AB⃗ a |AB⃗|."
        formula={"AB⃗ = (b₁−a₁ ; b₂−a₂)\n|u⃗| = √(u₁² + u₂²)"}
        steps={"AB⃗ = (5−2 ; 5−1) = (3 ; 4)\n|AB⃗| = √(3² + 4²) = √(9+16) = √25 = 5"}
        result="AB⃗ = (3; 4),   |AB⃗| = 5" />

      <SolvedProblem n={2} difficulty="easy" title="Těžiště trojúhelníku"
        given="A[−1; −3], B[5; 2], C[2; 5]. Urči těžiště T."
        formula={"T = [ (a₁+b₁+c₁)/3 ; (a₂+b₂+c₂)/3 ]"}
        steps={"T = [ (−1+5+2)/3 ; (−3+2+5)/3 ]\n  = [ 6/3 ; 4/3 ]"}
        result="T = [2 ; 4/3]" />

      <SolvedProblem n={3} difficulty="medium" title="Zápis vektoru jako lineární kombinace"
        given="Zapiš w⃗ = (−1; −1) jako LK vektorů u⃗ = (1; 3), v⃗ = (2; 5)."
        formula={"w⃗ = a·u⃗ + b·v⃗\n(−1; −1) = a(1;3) + b(2;5) = (a+2b ; 3a+5b)"}
        steps={"−1 = a + 2b      /·(−3)\n−1 = 3a + 5b\n———————————————\n 3 = −3a − 6b\n−1 = 3a + 5b\nsečíst:  2 = −b → b = −2\na = −1 − 2·(−2) = 3"}
        result="w⃗ = 3·u⃗ − 2·v⃗" />

      <SolvedProblem n={4} difficulty="medium" title="Tvoří body trojúhelník? (test kolinearity)"
        given="A[1; −2], B[−3; −14], C[4; 7]."
        formula={"AB⃗, AC⃗ → det(AB⃗, AC⃗) = ?\ndet = 0 → kolineární (NEtvoří trojúhelník)"}
        steps={"AB⃗ = (−3−1 ; −14−(−2)) = (−4 ; −12)\nAC⃗ = (4−1 ; 7−(−2)) = (3 ; 9)\ndet = (−4)·9 − (−12)·3 = −36 + 36 = 0"}
        result="det = 0 → body jsou KOLINEÁRNÍ → netvoří trojúhelník" />

      <SolvedProblem n={5} difficulty="medium" title="Skalární součin a odchylka vektorů"
        given="u⃗ = (3; −2), v⃗ = (6; 5). Urči odchylku φ."
        formula={"cos φ = (u₁v₁ + u₂v₂) / (|u⃗|·|v⃗|)"}
        steps={"u⃗·v⃗ = 3·6 + (−2)·5 = 18 − 10 = 8\n|u⃗| = √13,  |v⃗| = √61\ncos φ = 8 / (√13·√61) = 8/√793 ≈ 0,284"}
        result="φ ≈ 73°30′" />

      <SolvedProblem n={6} difficulty="medium" title="Obsah trojúhelníku přes determinant"
        given="A[1; 2], B[3; −1], C[7; 4]."
        formula={"S△ = ½ · |det(u⃗, v⃗)|,  u⃗ = AC⃗, v⃗ = AB⃗"}
        steps={"AC⃗ = (6 ; 2),  AB⃗ = (2 ; −3)\ndet = 6·(−3) − 2·2 = −18 − 4 = −22\nS△ = ½·|−22| = ½·22"}
        result="S△ = 11" />

      <SolvedProblem n={7} difficulty="medium" title="Přímka dvěma body — všechny tři tvary"
        given="A[3; 4], B[5; −1]. Urči parametrický, směrnicový a obecný tvar."
        formula={"u⃗ = AB⃗ ;  a = (b₂−a₂)/(b₁−a₁) ;  ax+by+c=0"}
        steps={"u⃗ = AB⃗ = (2 ; −5)\nparametricky:  x = 3 + 2t,  y = 4 − 5t\nsměrnice a = (−1−4)/(5−3) = −5/2\n4 = 3·(−5/2) + b → b = 23/2\nsměrnicový:  y = −5/2 x + 23/2   /·2\nobecný:  2y = −5x + 23"}
        result="x=3+2t, y=4−5t  ·  y = −5/2 x + 23/2  ·  5x + 2y − 23 = 0" />

      <SolvedProblem n={8} difficulty="hard" title="Vzájemná poloha + průsečík + úhel"
        given={"p = {[−2+t; 1+2t]; t∈ℝ},  q = {[2k; 5−k]; k∈ℝ}."}
        formula={"det(s_p, s_q) ≠ 0 → různoběžné → soustava → P\nÚhel: cos φ = |s_p·s_q| / (|s_p|·|s_q|)"}
        steps={"s_p = (1; 2),  s_q = (2; −1)\ndet = 1·(−1) − 2·2 = −5 ≠ 0 → různoběžné\n−2+t = 2k  /·(−2)  → 4−2t = −4k\n 1+2t = 5−k\nsečíst: 5 = 5 − 5k → k = 0 → P[0; 5]\ns_p·s_q = 1·2 + 2·(−1) = 0 → kolmé"}
        result="různoběžné · P[0; 5] · úhel φ = 90°" />

      <SolvedProblem n={9} difficulty="medium" title="Vzdálenost bodu od přímky"
        given="A[7; −1], p: 3x − y − 2 = 0."
        formula={"d = |a·x₀ + b·y₀ + c| / √(a² + b²)"}
        steps={"d = |3·7 + (−1)·(−1) − 2| / √(3² + (−1)²)\n  = |21 + 1 − 2| / √10\n  = 20/√10 = 20√10/10 = 2√10"}
        result="d = 2√10 ≈ 6,32" />

      <SolvedProblem n={10} difficulty="hard" title="Samostatná práce — vektor jako LK"
        given="w⃗ = (4; 8) zapiš jako LK u⃗ = (−2; 1), v⃗ = (4; 2)."
        formula={"(4; 8) = a(−2;1) + b(4;2) = (−2a+4b ; a+2b)"}
        steps={"−2a + 4b = 4\n  a + 2b = 8   → a = 8 − 2b\ndosadit: −2(8−2b) + 4b = 4\n−16 + 4b + 4b = 4 → 8b = 20 → b = 5/2\na = 8 − 2·(5/2) = 3"}
        result="w⃗ = 3·u⃗ + (5/2)·v⃗" />

      <SolvedProblem n={11} difficulty="hard" title="Samostatná práce — dopočet vrcholů rovnoběžníku"
        given="Rovnoběžník ABCD: A[−2; 0], B[2; 3], střed úhlopříček S[3/2; −2]. Urči C, D a dokaž, že nejde o obdélník, čtverec ani kosočtverec."
        formula={"S je střed obou úhlopříček:\nC = 2S − A,  D = 2S − B"}
        steps={"C = (2·3/2 − (−2) ; 2·(−2) − 0) = (5 ; −4)\nD = (3 − 2 ; −4 − 3) = (1 ; −7)\nAB⃗ = (4; 3) → |AB| = 5\nAD⃗ = (3; −7) → |AD| = √58\n|AB| ≠ |AD| → ne kosočtverec, ne čtverec\nAB⃗·AD⃗ = 4·3 + 3·(−7) = −9 ≠ 0 → ne kolmé → ne obdélník"}
        result="C[5; −4], D[1; −7] → obecný rovnoběžník (ani obdélník, ani čtverec, ani kosočtverec)" />

      <SolvedProblem n={12} difficulty="hard" title="Samostatná práce — vektor pod daným úhlem"
        given="u⃗ = (√3; −1). Urči v⃗ tak, aby svíral s u⃗ úhel 60° a měl velikost 4."
        formula={"|u⃗| = 2 ;  u⃗·v⃗ = |u⃗|·|v⃗|·cos 60° = 2·4·½ = 4\nv⃗ = (x; y):  √3·x − y = 4  a  x² + y² = 16"}
        steps={"y = √3·x − 4\nx² + (√3x − 4)² = 16\n4x² − 8√3·x = 0 → 4x(x − 2√3) = 0\nx = 0 → y = −4         (v⃗ = (0; −4))\nx = 2√3 → y = 2        (v⃗ = (2√3; 2))"}
        result="v⃗ = (2√3; 2)  nebo  v⃗ = (0; −4)" />

      <SolvedProblem n={13} difficulty="hard" title="Procvičovací list — těžnice a výška v trojúhelníku"
        given="△ABC: A[−6; 1], B[−1; −3], C[3; 4]. Obecná rovnice přímky s těžnicí na stranu c; parametrické vyjádření přímky s výškou na stranu a."
        formula={"Těžnice na c: z C do středu S_c úsečky AB.\nVýška na a (= BC): bodem A, kolmá na BC⃗ → směr ⊥ BC⃗."}
        steps={"S_c = střed AB = [(−6−1)/2 ; (1−3)/2] = [−7/2 ; −1]\nsměr CS_c ~ (13 ; 10) → normála (10 ; −13)\ntěžnice: 10x − 13y + c = 0, bodem C[3;4]: 30 − 52 + c = 0 → c = 22\n\nBC⃗ = (4 ; 7) → směr výšky ⊥ BC⃗ = (7 ; −4)\nvýška bodem A[−6;1]:  x = −6 + 7t,  y = 1 − 4t"}
        result="těžnice na c:  10x − 13y + 22 = 0     výška na a:  x = −6 + 7t,  y = 1 − 4t" />
    </div>
  );
}

function GridTab() {
  const [sub, setSub] = useState("vectors");
  return (
    <div style={{ maxWidth: "760px", margin: "0 auto" }}>
      <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "16px" }}>
        {[["vectors", "Vektory"], ["lines", "Přímky"]].map(([id, lbl]) => (
          <button key={id} onClick={() => setSub(id)} style={{ ...btnS, background: sub === id ? CYAN + "22" : "rgba(255,255,255,0.05)", border: sub === id ? `1px solid ${CYAN}` : "1px solid rgba(255,255,255,0.12)" }}>{lbl}</button>
        ))}
      </div>
      <div style={{ ...glass, padding: "18px" }}>
        <p style={{ ...pS, textAlign: "center", marginTop: 0 }}>
          {sub === "vectors"
            ? "Posuvníky mění složky vektorů u⃗ (modrý) a v⃗ (růžový). Žlutý vektor je výsledek operace."
            : "Posuvníky mění bod a směrový vektor každé přímky. Vlevo dole se počítá jejich vzájemná poloha a průsečík."}
        </p>
        {sub === "vectors" ? <VectorPlayground /> : <LinesPlayground />}
      </div>
    </div>
  );
}

const quizQuestions = [
  { question: "Jaké jsou souřadnice vektoru AB⃗ pro A[2; 1], B[5; 5]?", type: "single",
    options: ["(3; 4)", "(7; 6)", "(−3; −4)", "(2; 5)"], correct: [0],
    explanation: "AB⃗ = (b₁−a₁; b₂−a₂) = (5−2; 5−1) = (3; 4).", tip: "Vždy KONEC mínus ZAČÁTEK." },
  { question: "Jaká je velikost vektoru u⃗ = (−3; 5)?", type: "single",
    options: ["√34", "√16", "8", "2"], correct: [0],
    explanation: "|u⃗| = √((−3)² + 5²) = √(9+25) = √34." },
  { question: "Vzorec pro těžiště trojúhelníku ABC je:", type: "single",
    options: ["[(a₁+b₁+c₁)/3 ; (a₂+b₂+c₂)/3]", "[(a₁+b₁)/2 ; (a₂+b₂)/2]", "[(a₁+b₁+c₁)/2 ; (a₂+b₂+c₂)/2]", "[a₁+b₁+c₁ ; a₂+b₂+c₂]"], correct: [0],
    explanation: "Těžiště = aritmetický průměr souřadnic všech tří vrcholů (děleno 3)." },
  { question: "Kolik je skalární součin u⃗·v⃗ pro u⃗ = (1; 5), v⃗ = (4; 3)?", type: "single",
    options: ["19", "9", "23", "(4; 15)"], correct: [0],
    explanation: "u⃗·v⃗ = 1·4 + 5·3 = 4 + 15 = 19. Výsledek je číslo, ne vektor!" },
  { question: "Dva vektory jsou na sebe kolmé právě tehdy, když:", type: "single",
    options: ["u⃗·v⃗ = 0", "u⃗·v⃗ = 1", "det(u⃗, v⃗) = 0", "|u⃗| = |v⃗|"], correct: [0],
    explanation: "Kolmost ⟺ skalární součin = 0 (protože cos 90° = 0). Pozor: det = 0 znamená rovnoběžnost, ne kolmost!" },
  { question: "Jsou vektory u⃗ = (3; 6) a v⃗ = (−4; 2) kolmé?", type: "single",
    options: ["Ano, jejich skalární součin je 0", "Ne, součin je 24", "Ne, jsou rovnoběžné", "Nelze určit"], correct: [0],
    explanation: "u⃗·v⃗ = 3·(−4) + 6·2 = −12 + 12 = 0 → kolmé." },
  { question: "Kolik je det(u⃗, v⃗) pro u⃗ = (6; 2), v⃗ = (2; −3)?", type: "single",
    options: ["−22", "22", "14", "−14"], correct: [0],
    explanation: "det = u₁v₂ − u₂v₁ = 6·(−3) − 2·2 = −18 − 4 = −22." },
  { question: "Obsah trojúhelníku daného vektory u⃗, v⃗ se počítá jako:", type: "single",
    options: ["½·|det(u⃗, v⃗)|", "|det(u⃗, v⃗)|", "½·(u⃗·v⃗)", "|u⃗|·|v⃗|"], correct: [0],
    explanation: "S△ = ½·|det|. Bez poloviny (|det|) je to obsah rovnoběžníku." },
  { question: "Jaký je normálový vektor přímky 5x + 2y − 23 = 0?", type: "single",
    options: ["(5; 2)", "(2; −5)", "(−23; 0)", "(2; 5)"], correct: [0],
    explanation: "U přímky ax+by+c=0 je normálový vektor n⃗ = (a; b) = (5; 2)." },
  { question: "Přímka má normálový vektor n⃗ = (a; b). Jaký je její směrový vektor?", type: "single",
    options: ["(b; −a)", "(a; b)", "(−a; −b)", "(a; −b)"], correct: [0],
    explanation: "Směrový vektor je kolmý na normálu: s⃗ = (b; −a). Ověř: (a;b)·(b;−a) = ab − ab = 0." },
  { question: "Které z následujících jsou platné tvary rovnice přímky? (více odpovědí)", type: "multi",
    options: ["Směrnicový y = ax + b", "Obecný ax + by + c = 0", "Parametrický X = A + t·u⃗", "Determinantový det(x) = 0"], correct: [0, 1, 2],
    explanation: "Přímku zapisujeme směrnicově, obecně a parametricky. Žádný »determinantový« tvar neexistuje." },
  { question: "Co platí pro body A[1; −2], B[−3; −14], C[4; 7]?", type: "single",
    options: ["Jsou kolineární — netvoří trojúhelník", "Tvoří pravoúhlý trojúhelník", "Tvoří rovnostranný trojúhelník", "Tvoří rovnoběžník"], correct: [0],
    explanation: "AB⃗=(−4;−12), AC⃗=(3;9), det = −36 + 36 = 0 → leží na jedné přímce." },
  { question: "Vzdálenost bodu A[x₀;y₀] od přímky ax+by+c=0 je:", type: "single",
    options: ["|ax₀+by₀+c| / √(a²+b²)", "(ax₀+by₀+c) / (a²+b²)", "√(a²+b²) / |ax₀+by₀+c|", "|ax₀+by₀+c|"], correct: [0],
    explanation: "d = |ax₀+by₀+c| / √(a²+b²). V čitateli je absolutní hodnota (vzdálenost je nezáporná)." },
  { question: "Dvě přímky mají rovnoběžné směrové vektory a sdílejí jeden bod. Jaká je jejich poloha?", type: "single",
    options: ["Splývající (totožné)", "Různoběžné", "Rovnoběžné různé", "Kolmé"], correct: [0],
    explanation: "Rovnoběžné směry + společný bod = jde o stejnou přímku → splývající." },
  { question: "Vzorec pro kosinus úhlu mezi vektory je:", type: "single",
    options: ["(u₁v₁+u₂v₂) / (|u⃗|·|v⃗|)", "(u₁v₁+u₂v₂) · |u⃗| · |v⃗|", "(u₁v₂−u₂v₁) / (|u⃗|·|v⃗|)", "|u⃗| · |v⃗|"], correct: [0],
    explanation: "cos φ = (u⃗·v⃗)/(|u⃗|·|v⃗|). V čitateli skalární součin, ve jmenovateli součin velikostí." },
  { question: "Jak zapíšeš w⃗ = (−1; −1) jako LK u⃗ = (1; 3), v⃗ = (2; 5)?", type: "single",
    options: ["3u⃗ − 2v⃗", "2u⃗ − 3v⃗", "−3u⃗ + 2v⃗", "u⃗ + v⃗"], correct: [0],
    explanation: "Soustava a+2b=−1, 3a+5b=−1 → a=3, b=−2 → w⃗ = 3u⃗ − 2v⃗." },
  { question: "Jaký je opačný vektor k u⃗ = (1; 2)?", type: "single",
    options: ["(−1; −2)", "(2; 1)", "(−2; −1)", "(1; −2)"], correct: [0],
    explanation: "−u⃗ = (−u₁; −u₂) = (−1; −2)." },
];

function Flashcards() {
  const cards = [
    { f: "Souřadnice vektoru AB⃗", b: "(b₁ − a₁ ; b₂ − a₂)\nKONEC mínus ZAČÁTEK" },
    { f: "Velikost vektoru |u⃗|", b: "√(u₁² + u₂²)" },
    { f: "Střed úsečky AB", b: "[ (a₁+b₁)/2 ; (a₂+b₂)/2 ]" },
    { f: "Těžiště trojúhelníku T", b: "[ (a₁+b₁+c₁)/3 ; (a₂+b₂+c₂)/3 ]" },
    { f: "Skalární součin u⃗·v⃗", b: "u₁v₁ + u₂v₂\n(výsledek je ČÍSLO)" },
    { f: "Kdy jsou vektory kolmé?", b: "u⃗ ⊥ v⃗  ⟺  u⃗·v⃗ = 0" },
    { f: "Kosinus úhlu vektorů", b: "cos φ = (u₁v₁+u₂v₂) / (|u⃗|·|v⃗|)" },
    { f: "Determinant det(u⃗, v⃗)", b: "u₁·v₂ − u₂·v₁" },
    { f: "Obsah trojúhelníku ze 2 vektorů", b: "S△ = ½ · |det(u⃗, v⃗)|" },
    { f: "Obsah rovnoběžníku", b: "S = |det(u⃗, v⃗)|" },
    { f: "Směrnice přímky ze 2 bodů", b: "a = (b₂ − a₂) / (b₁ − a₁)" },
    { f: "Tři tvary rovnice přímky", b: "směrnicový y=ax+b\nobecný ax+by+c=0\nparametrický X=A+t·u⃗" },
    { f: "Normálový vektor přímky ax+by+c=0", b: "n⃗ = (a; b)" },
    { f: "Směrový vektor z normály (a;b)", b: "s⃗ = (b; −a)" },
    { f: "Vzdálenost bodu od přímky", b: "d = |ax₀+by₀+c| / √(a²+b²)" },
    { f: "Vzájemná poloha přímek", b: "det(s_p,s_q)≠0 → různoběžné\ndet=0 → rovnoběžné / splývající" },
  ];
  const [idx, setIdx] = useState(0);
  const [flip, setFlip] = useState(false);
  const go = (d) => { setFlip(false); setIdx((idx + d + cards.length) % cards.length); };
  const c = cards[idx];
  return (
    <div style={{ maxWidth: "560px", margin: "0 auto" }}>
      <div style={{ color: "rgba(255,255,255,0.4)", textAlign: "center", fontSize: "13px", marginBottom: "10px" }}>Kartička {idx + 1} / {cards.length}</div>
      <div onClick={() => setFlip(!flip)} style={{ ...glass, padding: "44px 28px", minHeight: "190px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", background: flip ? "rgba(34,211,238,0.08)" : "rgba(255,255,255,0.05)" }}>
        <div style={{ color: flip ? CYAN : "#fff", fontSize: flip ? "18px" : "19px", fontWeight: 600, lineHeight: 1.6, whiteSpace: "pre-wrap", fontFamily: flip ? "'JetBrains Mono', monospace" : "'Exo 2', sans-serif" }}>{flip ? c.b : c.f}</div>
        <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px", marginTop: "16px" }}>{flip ? "↩ klikni pro otázku" : "klikni pro odpověď"}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "16px" }}>
        <button style={btnS} onClick={() => go(-1)}>← Předchozí</button>
        <button style={{ ...btnS, background: CYAN + "22", border: `1px solid ${CYAN}` }} onClick={() => setFlip(!flip)}>{flip ? "Otočit zpět" : "Zobrazit odpověď"}</button>
        <button style={btnS} onClick={() => go(1)}>Další →</button>
      </div>
      <div style={{ display: "flex", gap: "6px", justifyContent: "center", flexWrap: "wrap", marginTop: "16px" }}>
        {cards.map((_, i) => <div key={i} onClick={() => { setIdx(i); setFlip(false); }} style={{ width: "16px", height: "16px", borderRadius: "50%", background: i === idx ? CYAN : "#4b5563", cursor: "pointer", transition: "background 0.4s ease" }} />)}
      </div>
    </div>
  );
}

function FormulaSheet() {
  const sec = (title, body, color = CYAN) => (
    <div style={{ ...glass, padding: "16px 20px", marginBottom: "14px" }}>
      <div style={{ color: color, fontWeight: 700, fontSize: "15px", marginBottom: "8px", fontFamily: "'Audiowide', sans-serif" }}>{title}</div>
      <MBlock color={color}>{body}</MBlock>
    </div>
  );
  return (
    <div style={{ maxWidth: "720px", margin: "0 auto" }}>
      <p style={{ ...pS, textAlign: "center", marginBottom: "16px" }}>Vše, co musíš umět zpaměti. Vektory značíme šipkou (u⃗).</p>
      {sec("Vektory a body", "AB⃗ = (b₁−a₁ ; b₂−a₂)\n|u⃗| = √(u₁² + u₂²)\n−u⃗ = (−u₁ ; −u₂)\nStřed AB:  S = [(a₁+b₁)/2 ; (a₂+b₂)/2]\nTěžiště:   T = [(a₁+b₁+c₁)/3 ; (a₂+b₂+c₂)/3]")}
      {sec("Operace", "u⃗ + v⃗ = (u₁+v₁ ; u₂+v₂)\nv⃗ − u⃗ = (v₁−u₁ ; v₂−u₂)\nk·u⃗  = (k·u₁ ; k·u₂)\nLin. kombinace:  w⃗ = a·u⃗ + b·v⃗", PINK)}
      {sec("Závislost / kolinearita", "LZ (kolineární) ⟺ v⃗ = k·u⃗ ⟺ det(u⃗,v⃗) = 0", GREEN)}
      {sec("Skalární součin & úhel", "u⃗·v⃗ = u₁v₁ + u₂v₂\nu⃗ ⊥ v⃗ ⟺ u⃗·v⃗ = 0\ncos φ = (u₁v₁+u₂v₂) / (|u⃗|·|v⃗|)", CYAN)}
      {sec("Determinant & obsah", "det(u⃗,v⃗) = u₁v₂ − u₂v₁\nS△ = ½·|det(u⃗,v⃗)|\nS rovnoběžníku = |det(u⃗,v⃗)|", YELLOW)}
      {sec("Přímka — tvary", "Směrnicový:    y = a·x + b,   a = (b₂−a₂)/(b₁−a₁)\nObecný:        a·x + b·y + c = 0\nParametrický:  x = a₁ + t·u₁,  y = a₂ + t·u₂", PINK)}
      {sec("Směrový a normálový vektor", "ax + by + c = 0:\n   n⃗ = (a; b)   (normála, ⊥ přímce)\n   s⃗ = (b; −a)  (směr, ∥ přímce)\ns⃗ = AB⃗ (ze dvou bodů)", CYAN)}
      {sec("Vzájemná poloha přímek", "det(s_p,s_q) ≠ 0 → různoběžné (→ průsečík)\ndet(s_p,s_q) = 0 → rovnoběžné NEBO splývající\nÚhel: cos φ = |s_p·s_q| / (|s_p|·|s_q|)", GREEN)}
      {sec("Vzdálenost bodu od přímky", "A[x₀;y₀], p: ax+by+c=0\nd = |a·x₀ + b·y₀ + c| / √(a² + b²)", YELLOW)}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════════════
export default function App() {
  const [tab, setTab] = useState("theory");
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a1a", fontFamily: "'Exo 2', sans-serif", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", bottom: 0, left: "-50%", width: "200%", height: "50%", backgroundImage: `linear-gradient(${PINK}15 1px, transparent 1px), linear-gradient(90deg, ${PINK}15 1px, transparent 1px)`, backgroundSize: "60px 60px", transform: "perspective(500px) rotateX(60deg)", transformOrigin: "center bottom" }} />
        <div style={{ position: "absolute", top: "8%", left: "50%", transform: "translateX(-50%)", width: "200px", height: "200px", borderRadius: "50%", background: `radial-gradient(circle, ${PINK}44, ${CYAN}22, transparent)`, filter: "blur(40px)" }} />
        {[...Array(12)].map((_, i) => (
          <div key={i} style={{ position: "absolute", width: `${3 + (i % 4)}px`, height: `${3 + (i % 4)}px`, borderRadius: "50%", background: i % 2 === 0 ? PINK + "66" : CYAN + "66", left: `${(i * 53) % 100}%`, top: `${(i * 37) % 100}%`, animation: `float${i % 3} ${12 + (i % 8)}s ease-in-out infinite`, filter: "blur(1px)" }} />
        ))}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;600;700;800&family=Audiowide&family=JetBrains+Mono:wght@400;600;700&display=swap');
        @keyframes float0 { 0%,100% { transform: translateY(0) translateX(0);} 50% { transform: translateY(-30px) translateX(15px);} }
        @keyframes float1 { 0%,100% { transform: translateY(0) translateX(0);} 50% { transform: translateY(20px) translateX(-20px);} }
        @keyframes float2 { 0%,100% { transform: translateY(0) translateX(0);} 50% { transform: translateY(-15px) translateX(-10px);} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button:disabled { opacity: 0.4; cursor: not-allowed; }
        button:hover:not(:disabled) { filter: brightness(1.2); }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 3px; }
        input[type=range] { height: 4px; }
      `}</style>

      <div style={{ position: "relative", zIndex: 1, maxWidth: "920px", margin: "0 auto", padding: "20px 16px 60px" }}>
        <div style={{ textAlign: "center", marginBottom: "22px" }}>
          <h1 style={{ fontFamily: "'Audiowide', sans-serif", fontSize: "clamp(20px, 5vw, 34px)", color: "#fff", marginBottom: "6px", textShadow: `0 0 20px ${PINK}66` }}>Analytická geometrie</h1>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "14px" }}>Souřadnice · úsečka · vektory · přímky — kompletní příprava na test</p>
        </div>

        <div style={{ display: "flex", gap: "6px", justifyContent: "center", flexWrap: "wrap", marginBottom: "22px" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "8px 18px", borderRadius: "20px", border: tab === t.id ? `1px solid ${PINK}` : "1px solid rgba(255,255,255,0.12)", background: tab === t.id ? PINK + "22" : "rgba(255,255,255,0.04)", color: tab === t.id ? "#fff" : "rgba(255,255,255,0.6)", fontFamily: "'Exo 2', sans-serif", fontSize: "14px", fontWeight: 600, cursor: "pointer", transition: "all 0.4s ease" }}>{t.label}</button>
          ))}
        </div>

        {tab === "theory" && <TheoryTab />}
        {tab === "problems" && <ProblemsTab />}
        {tab === "grid" && <GridTab />}
        {tab === "quiz" && <QuizEngine questions={quizQuestions} accentColor={PINK} />}
        {tab === "flashcards" && <Flashcards />}
        {tab === "formulas" && <FormulaSheet />}
      </div>
    </div>
  );
}
