// @title Srovnávací test z matematiky — kompletní příprava
// @subject Math
// @topic Výrazy, nerovnice, absolutní hodnota, funkce, goniometrie, geometrie, analytická geometrie
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
          return <div key={i} onClick={() => goTo(i)} title={`Otázka ${i + 1}`} style={{ width: "20px", height: "20px", borderRadius: "50%", cursor: "pointer", transition: "background 0.4s ease", background: bg }} />;
        })}
      </div>
      <div style={{ ...glass, padding: "24px" }}>
        <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", marginBottom: "6px" }}>Otázka {idx + 1} / {shuffledQuestions.length}{isMulti && " · více správných"}</div>
        <div style={{ color: "#fff", fontSize: "18px", fontWeight: 600, lineHeight: 1.5, marginBottom: "20px", whiteSpace: "pre-wrap" }}>{q.question}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {q.options.map((opt, i) => {
            let border = "1px solid rgba(255,255,255,0.12)";
            let bg = "rgba(255,255,255,0.04)";
            if (isRevealed) {
              if (q.correct.includes(i)) { bg = "rgba(34,197,94,0.15)"; border = "1px solid #22c55e"; }
              else if (activeSet.includes(i)) { bg = "rgba(239,68,68,0.15)"; border = "1px solid #ef4444"; }
            } else if (activeSet.includes(i)) { bg = accentColor + "18"; border = `1px solid ${accentColor}`; }
            return (
              <div key={i} style={{ padding: "12px 16px", borderRadius: "12px", color: "#fff", cursor: "pointer", transition: "all 0.4s ease", display: "flex", alignItems: "center", gap: "10px", userSelect: "none", fontSize: "15px", fontFamily: "'JetBrains Mono', monospace", background: bg, border }}
                onClick={() => isMulti ? toggleMulti(i) : handleSingleSelect(i)}>
                {isMulti && <span style={{ fontSize: "18px", minWidth: "20px", color: "rgba(255,255,255,0.7)" }}>{activeSet.includes(i) ? "☑" : "☐"}</span>}
                <span>{opt}</span>
              </div>
            );
          })}
        </div>
        {isMulti && !isRevealed && (
          <button style={{ ...btnS, marginTop: "16px", opacity: pendingMulti.length === 0 ? 0.4 : 1 }} onClick={submitMulti} disabled={pendingMulti.length === 0}>Potvrdit</button>
        )}
        {isRevealed && (
          <div style={{ marginTop: "18px", padding: "16px", borderRadius: "12px", background: "rgba(0,0,0,0.25)", border: `1px solid ${isCorrect ? "#22c55e" : "#ef4444"}` }}>
            <div style={{ color: isCorrect ? "#22c55e" : "#ef4444", fontWeight: 700, marginBottom: "6px" }}>{isCorrect ? "Správně!" : "Špatně"}</div>
            {!isCorrect && <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", marginBottom: "6px" }}>Správně: {q.correct.map(i => q.options[i]).join(", ")}</div>}
            <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "14.5px", lineHeight: 1.6 }}>{q.explanation}</div>
            {q.tip && <div style={{ color: "#fbbf24", fontSize: "13.5px", marginTop: "8px" }}>💡 {q.tip}</div>}
          </div>
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
        <button style={{ ...btnS, opacity: idx === 0 ? 0.4 : 1 }} onClick={() => goTo(Math.max(0, idx - 1))} disabled={idx === 0}>← Zpět</button>
        {idx < shuffledQuestions.length - 1
          ? <button style={btnS} onClick={() => goTo(idx + 1)}>Další →</button>
          : <button style={{ ...btnS, background: accentColor + "66", border: `1px solid ${accentColor}` }} onClick={() => setShowResults(true)}>Výsledky</button>}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// STYLE
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
  fontFamily: "'Exo 2', sans-serif",
  transition: "all 0.4s ease"
};
const PINK = "#ec4899";
const CYAN = "#22d3ee";
const YELLOW = "#fbbf24";
const GREEN = "#34d399";
const PURPLE = "#a855f7";

const pS = { color: "rgba(255,255,255,0.82)", fontSize: "15px", lineHeight: 1.7, margin: "8px 0" };
const hS = { color: "#fff", fontSize: "16px", fontWeight: 700, margin: "14px 0 6px", fontFamily: "'Audiowide', sans-serif" };

const TABS = [
  { id: "prehled", label: "Přehled" },
  { id: "vyrazy", label: "Výrazy" },
  { id: "nerovnice", label: "Nerovnice" },
  { id: "abs", label: "Abs. hodnota" },
  { id: "funkce", label: "Funkce" },
  { id: "iracionalni", label: "Odmocniny" },
  { id: "gonio", label: "Goniometrie" },
  { id: "geometrie", label: "Geometrie" },
  { id: "analyticka", label: "Analytická" },
  { id: "quiz", label: "Kvíz" },
  { id: "flashcards", label: "Kartičky" },
  { id: "formulas", label: "Vzorce" },
];

// ══════════════════════════════════════════════════════════════════
// HELPERS
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

function MBlock({ children, color = CYAN }) {
  return <div style={{ fontFamily: "'JetBrains Mono', monospace", color, fontSize: "14.5px", padding: "12px 16px", background: "rgba(34,211,238,0.06)", borderRadius: "10px", margin: "8px 0", lineHeight: 1.9, overflowX: "auto", whiteSpace: "pre-wrap", border: "1px solid rgba(255,255,255,0.06)" }}>{children}</div>;
}

function Mono({ children, color = CYAN }) {
  return <span style={{ fontFamily: "'JetBrains Mono', monospace", color, fontSize: "0.96em" }}>{children}</span>;
}

const DIFF = {
  easy: { label: "✨ Lehké", bg: "rgba(34,197,94,0.2)", col: "#4ade80" },
  medium: { label: "⚡ Střední", bg: "rgba(234,179,8,0.2)", col: "#fbbf24" },
  hard: { label: "🔥 Těžké", bg: "rgba(239,68,68,0.2)", col: "#f87171" },
};

function SolvedProblem({ n, title, difficulty = "medium", given, steps, result, graph }) {
  const [open, setOpen] = useState(false);
  const d = DIFF[difficulty];
  return (
    <div style={{ ...glass, padding: "0", marginBottom: "14px", overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", background: "rgba(255,255,255,0.03)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <span style={{ color: PINK, fontWeight: 700, fontSize: "14px" }}>{n}.</span>
            <span style={{ color: "#fff", fontSize: "15.5px", fontWeight: 600 }}>{title}</span>
            <span style={{ fontSize: "12px", padding: "2px 10px", borderRadius: "20px", background: d.bg, color: d.col }}>{d.label}</span>
          </div>
          <button style={{ ...btnS, fontSize: "13px", padding: "6px 16px", background: open ? PINK + "22" : "rgba(255,255,255,0.06)", border: open ? `1px solid ${PINK}` : "1px solid rgba(255,255,255,0.15)" }} onClick={() => setOpen(!open)}>
            {open ? "Skrýt řešení" : "Zobrazit řešení"}
          </button>
        </div>
        <div style={{ marginTop: "12px", display: "flex", gap: "8px", alignItems: "baseline", flexWrap: "wrap" }}>
          <span style={{ color: GREEN, fontWeight: 700, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>Zadání:</span>
          <div style={{ ...pS, margin: 0, flex: "1 1 220px", fontFamily: "'JetBrains Mono', monospace", color: "#fff" }}>{given}</div>
        </div>
      </div>
      {open && (
        <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          {graph}
          <div style={{ marginBottom: "10px" }}>
            <span style={{ color: YELLOW, fontWeight: 700, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Postup krok za krokem</span>
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
// FUNCTION GRAPH (SVG) — integer labels by default
// ══════════════════════════════════════════════════════════════════
function FunctionGraph({ funcs, xMin = -7, xMax = 7, yMin = -5, yMax = 5, width = 480, height = 320, title, keyPoints, vlines, hlines, piLabels = false }) {
  const pad = { top: 26, bottom: 30, left: 34, right: 16 };
  const w = width - pad.left - pad.right;
  const h = height - pad.top - pad.bottom;
  const toX = (x) => pad.left + ((x - xMin) / (xMax - xMin)) * w;
  const toY = (y) => pad.top + ((yMax - y) / (yMax - yMin)) * h;

  const gridLines = [];
  for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) gridLines.push(<line key={`h${y}`} x1={pad.left} x2={width - pad.right} y1={toY(y)} y2={toY(y)} stroke="rgba(255,255,255,0.07)" strokeWidth="1" />);
  if (piLabels) {
    const step = Math.PI / 2;
    for (let x = Math.ceil(xMin / step) * step; x <= xMax; x += step) gridLines.push(<line key={`v${x.toFixed(2)}`} x1={toX(x)} x2={toX(x)} y1={pad.top} y2={height - pad.bottom} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />);
  } else {
    for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) gridLines.push(<line key={`v${x}`} x1={toX(x)} x2={toX(x)} y1={pad.top} y2={height - pad.bottom} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />);
  }

  const xLabels = [];
  if (piLabels) {
    const step = Math.PI / 2;
    for (let x = Math.ceil(xMin / step) * step; x <= xMax + 0.01; x += step) {
      const nn = Math.round(x / (Math.PI / 2));
      let label = nn === 0 ? "0" : nn === 1 ? "π/2" : nn === -1 ? "−π/2" : nn === 2 ? "π" : nn === -2 ? "−π" : nn === 4 ? "2π" : nn === -4 ? "−2π" : (nn % 2 === 0 ? `${nn/2}π` : `${nn}π/2`);
      xLabels.push(<text key={`xl${nn}`} x={toX(x)} y={height - pad.bottom + 16} fill="rgba(255,255,255,0.4)" fontSize="10" textAnchor="middle" fontFamily="'JetBrains Mono', monospace">{label}</text>);
    }
  } else {
    for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) if (x !== 0) xLabels.push(<text key={`xl${x}`} x={toX(x)} y={height - pad.bottom + 16} fill="rgba(255,255,255,0.4)" fontSize="10" textAnchor="middle" fontFamily="'JetBrains Mono', monospace">{x}</text>);
  }
  const yLabels = [];
  for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) if (y !== 0) yLabels.push(<text key={`yl${y}`} x={pad.left - 6} y={toY(y) + 3} fill="rgba(255,255,255,0.4)" fontSize="10" textAnchor="end" fontFamily="'JetBrains Mono', monospace">{y}</text>);

  const curves = funcs.map((f, fi) => {
    const step = (xMax - xMin) / 600;
    let segments = [], cur = [];
    for (let x = xMin; x <= xMax + step / 2; x += step) {
      const y = f.fn(x);
      if (y === undefined || y === null || !isFinite(y) || Math.abs(y) > 60) { if (cur.length > 1) segments.push(cur); cur = []; }
      else cur.push([toX(x), toY(y)]);
    }
    if (cur.length > 1) segments.push(cur);
    return segments.map((seg, si) => <polyline key={`f${fi}s${si}`} points={seg.map(([px, py]) => `${px},${py}`).join(" ")} fill="none" stroke={f.color || PINK} strokeWidth={f.strokeWidth || 2.5} strokeLinecap="round" strokeDasharray={f.dash || "none"} />);
  });

  const asym = [];
  (vlines || []).forEach((x, i) => asym.push(<line key={`vl${i}`} x1={toX(x)} x2={toX(x)} y1={pad.top} y2={height - pad.bottom} stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" strokeDasharray="6 5" />));
  (hlines || []).forEach((y, i) => asym.push(<line key={`hl${i}`} x1={pad.left} x2={width - pad.right} y1={toY(y)} y2={toY(y)} stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" strokeDasharray="6 5" />));

  const pointMarkers = (keyPoints || []).map((p, i) => (
    <g key={`kp${i}`}>
      <circle cx={toX(p.x)} cy={toY(p.y)} r={4} fill={p.color || GREEN} stroke="#fff" strokeWidth="1.5" />
      {p.label && <text x={toX(p.x) + (p.dx || 8)} y={toY(p.y) + (p.dy || -8)} fill={p.color || GREEN} fontSize="11" fontFamily="'JetBrains Mono', monospace">{p.label}</text>}
    </g>
  ));

  return (
    <div style={{ margin: "12px 0", overflowX: "auto" }}>
      {title && <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", marginBottom: "4px", fontStyle: "italic" }}>{title}</div>}
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", maxWidth: `${width}px`, height: "auto", background: "rgba(0,0,0,0.3)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)" }}>
        {gridLines}
        <line x1={pad.left} x2={width - pad.right} y1={toY(0)} y2={toY(0)} stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" />
        <line x1={toX(0)} x2={toX(0)} y1={pad.top} y2={height - pad.bottom} stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" />
        {asym}
        {curves}
        {pointMarkers}
        {xLabels}{yLabels}
        {funcs.length > 1 && funcs.filter(f => f.label).map((f, i) => (
          <g key={`leg${i}`}>
            <line x1={pad.left + i * 120} x2={pad.left + i * 120 + 18} y1={12} y2={12} stroke={f.color || PINK} strokeWidth="2.5" strokeDasharray={f.dash || "none"} />
            <text x={pad.left + i * 120 + 24} y={16} fill={f.color || PINK} fontSize="11" fontFamily="'JetBrains Mono', monospace">{f.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// Number-line interval picture
function NumberLine({ from = -8, to = 8, marks = [], regions = [] }) {
  const W = 480, H = 70, padX = 24;
  const toX = (v) => padX + ((v - from) / (to - from)) * (W - 2 * padX);
  const y = 38;
  return (
    <div style={{ margin: "10px 0", overflowX: "auto" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: `${W}px`, background: "rgba(0,0,0,0.3)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)" }}>
        {regions.map((r, i) => <line key={`r${i}`} x1={toX(r.a)} x2={toX(r.b)} y1={y} y2={y} stroke={r.color || GREEN} strokeWidth="6" strokeLinecap="round" opacity="0.85" />)}
        <line x1={padX - 10} x2={W - padX + 10} y1={y} y2={y} stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
        <polygon points={`${W - padX + 10},${y} ${W - padX + 2},${y - 4} ${W - padX + 2},${y + 4}`} fill="rgba(255,255,255,0.4)" />
        {marks.map((m, i) => (
          <g key={`m${i}`}>
            <circle cx={toX(m.v)} cy={y} r={5} fill={m.filled ? (m.color || YELLOW) : "#0a0a1a"} stroke={m.color || YELLOW} strokeWidth="2" />
            <text x={toX(m.v)} y={y + 22} fill="rgba(255,255,255,0.75)" fontSize="12" textAnchor="middle" fontFamily="'JetBrains Mono', monospace">{m.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function Flashcards({ cards }) {
  const [i, setI] = useState(0);
  const [flip, setFlip] = useState(false);
  const c = cards[i];
  const go = (d) => { setFlip(false); setI((i + d + cards.length) % cards.length); };
  return (
    <div style={{ maxWidth: "640px", margin: "0 auto" }}>
      <div onClick={() => setFlip(!flip)} style={{ ...glass, minHeight: "240px", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px", cursor: "pointer", textAlign: "center", background: flip ? "rgba(34,211,238,0.08)" : "rgba(236,72,153,0.06)" }}>
        <div>
          <div style={{ color: flip ? CYAN : PINK, fontSize: "12px", fontWeight: 700, letterSpacing: "1px", marginBottom: "14px", textTransform: "uppercase" }}>{flip ? "Odpověď" : "Otázka"}</div>
          <div style={{ color: flip ? CYAN : "#fff", fontSize: flip ? "17px" : "19px", fontWeight: 600, lineHeight: 1.6, whiteSpace: "pre-wrap", fontFamily: flip ? "'JetBrains Mono', monospace" : "'Exo 2', sans-serif" }}>{flip ? c.b : c.f}</div>
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", marginTop: "18px" }}>klikni pro otočení</div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px" }}>
        <button style={btnS} onClick={() => go(-1)}>← Předchozí</button>
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>{i + 1} / {cards.length}</span>
        <button style={btnS} onClick={() => go(1)}>Další →</button>
      </div>
    </div>
  );
}

function SectionTitle({ children, color = PINK }) {
  return <h2 style={{ fontFamily: "'Audiowide', sans-serif", color: "#fff", fontSize: "20px", margin: "6px 0 14px", textShadow: `0 0 16px ${color}55` }}>{children}</h2>;
}
function Lead({ children }) {
  return <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", lineHeight: 1.6, marginBottom: "16px" }}>{children}</p>;
}

// ══════════════════════════════════════════════════════════════════
// TAB: PŘEHLED
// ══════════════════════════════════════════════════════════════════
function PrehledTab() {
  const topics = [
    ["Výrazy", "Mocniny a odmocniny, úpravy výrazů, počítání s exponenty"],
    ["Nerovnice", "Kvadratické, v součinovém a podílovém tvaru, metoda nulových bodů"],
    ["Absolutní hodnota", "Definice, rovnice a nerovnice, funkce s |x|, zápis množin intervalem"],
    ["Funkce", "Lineární lomená (hyperbola), kvadratická (parabola), průsečík přímky a paraboly"],
    ["Rovnice s odmocninou", "Iracionální rovnice — definiční obor, umocňování, zkouška"],
    ["Goniometrie", "Hodnoty funkcí, jednotková kružnice, grafy, gonio rovnice a výrazy"],
    ["Geometrie — výpočty", "Pythagorova a Euklidovy věty, sinová a kosinová věta"],
    ["Analytická geometrie", "Bod, vektor, přímka, kružnice"],
  ];
  return (
    <div>
      <SectionTitle>Srovnávací test z matematiky — kompletní příprava</SectionTitle>
      <Lead>Tahle aplikace tě provede vším, co se může na srovnávacím testu objevit. U každého tématu najdeš stručnou teorii, vyřešené příklady (řešení je schované — zkus to nejdřív sám!) a na konci kvíz, kartičky a přehled vzorců. Obsah je postavený na tvých materiálech a mock testu.</Lead>
      <div style={{ ...glass, padding: "18px 20px", marginBottom: "16px", borderLeft: `3px solid ${YELLOW}` }}>
        <div style={{ color: YELLOW, fontWeight: 700, marginBottom: "8px", fontFamily: "'Audiowide', sans-serif" }}>Jak na to</div>
        <p style={pS}>1. Projdi <b>teorii</b> u každého tématu (rozklikávací panely).<br />2. Zkus si <b>příklady</b> — nejdřív sám, pak odhal řešení.<br />3. Otestuj se v <b>kvízu</b> a zopakuj přes <b>kartičky</b>.<br />4. Před testem si projeď záložku <b>Vzorce</b>.</p>
      </div>
      <div style={hS}>Co tě na testu čeká</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px" }}>
        {topics.map(([t, d], i) => (
          <div key={i} style={{ ...glass, padding: "16px 18px" }}>
            <div style={{ color: PINK, fontWeight: 700, fontSize: "15px", marginBottom: "5px" }}>{t}</div>
            <div style={{ color: "rgba(255,255,255,0.65)", fontSize: "13.5px", lineHeight: 1.55 }}>{d}</div>
          </div>
        ))}
      </div>
      <div style={{ ...glass, padding: "18px 20px", marginTop: "16px", borderLeft: `3px solid ${GREEN}` }}>
        <div style={{ color: GREEN, fontWeight: 700, marginBottom: "8px", fontFamily: "'Audiowide', sans-serif" }}>Tři pravidla, na která se nejvíc zapomíná</div>
        <p style={pS}>• U <b>podílových</b> nerovnic a lomených funkcí vždy vyřaď jmenovatel = 0 z definičního oboru.<br />• U <b>rovnic s odmocninou</b> je <b>zkouška povinná</b> — umocňování může přidat falešné kořeny.<br />• Krajní bod intervalu je <b>uzavřený</b> ⟨ ⟩ jen pro ≤, ≥; pro &lt;, &gt; a u nulových bodů jmenovatele je <b>otevřený</b> ( ).</p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// TAB: VÝRAZY
// ══════════════════════════════════════════════════════════════════
function VyrazyTab() {
  return (
    <div>
      <SectionTitle>Výrazy — mocniny a odmocniny</SectionTitle>
      <Lead>Úprava výrazů s mocninami a odmocninami stojí na jednom triku: každou odmocninu přepíšeš jako mocninu se zlomkovým exponentem a pak už jen sčítáš/odčítáš exponenty podle pravidel.</Lead>

      <Collapsible title="Pravidla pro počítání s mocninami" defaultOpen accent={CYAN}>
        <MBlock>{`aᵐ · aⁿ = aᵐ⁺ⁿ          (stejný základ → exponenty SČÍTÁM)
aᵐ : aⁿ = aᵐ⁻ⁿ          (stejný základ → exponenty ODČÍTÁM)
(aᵐ)ⁿ = aᵐ·ⁿ            (mocnina mocniny → NÁSOBÍM)
(a·b)ⁿ = aⁿ · bⁿ
(a/b)ⁿ = aⁿ / bⁿ
a⁰ = 1   (a ≠ 0)
a⁻ⁿ = 1/aⁿ              (záporný exponent → převrácená hodnota)`}</MBlock>
        <p style={pS}>Tahle tři podtržená pravidla z tvého zápisku: <Mono>(aᵐ)ⁿ = aᵐ·ⁿ</Mono> a <Mono>aᵐ · aⁿ = aᵐ⁺ⁿ</Mono> jsou jádro všeho.</p>
      </Collapsible>

      <Collapsible title="Odmocnina jako mocnina se zlomkem" accent={CYAN}>
        <MBlock>{`ⁿ√a = a^(1/n)            n-tá odmocnina = exponent 1/n
ⁿ√(aᵐ) = a^(m/n)
√a = a^(1/2)            druhá odmocnina
³√a = a^(1/3)            třetí (krychlová) odmocnina
√(aᵐ) = (a^m)^(1/2) = a^(m/2)`}</MBlock>
        <p style={pS}>Plán úpravy: <b>1)</b> všechno přepiš na mocniny se zlomkovým exponentem, <b>2)</b> uvnitř použij pravidla (násobení → sčítání exponentů), <b>3)</b> nakonec poděl čitatele jmenovatelem (odečti exponenty).</p>
      </Collapsible>

      <div style={hS}>Vyřešené příklady</div>

      <SolvedProblem
        n={1} difficulty="hard"
        title="Zjednodušení výrazu z odmocnin (tvůj test)"
        given={"³√(a · √(a³)) / √(a · ³√(a²))"}
        steps={`Vše přepiš na mocniny se zlomkovým exponentem.

ČITATEL: ³√(a · √(a³))
   uvnitř: a · a^(3/2) = a^(1 + 3/2) = a^(5/2)
   celý čitatel = (a^(5/2))^(1/3) = a^(5/6)

JMENOVATEL: √(a · ³√(a²))
   uvnitř: a · a^(2/3) = a^(1 + 2/3) = a^(5/3)
   celý jmenovatel = (a^(5/3))^(1/2) = a^(5/6)

CELÝ VÝRAZ: a^(5/6) : a^(5/6) = a^(5/6 − 5/6) = a⁰ = 1`}
        result={"Výraz se rovná 1"}
      />

      <SolvedProblem
        n={2} difficulty="easy"
        title="Mocnina mocniny a součin"
        given={"(x² · x³)⁴ : x⁵"}
        steps={`Uvnitř závorky sčítám exponenty: x² · x³ = x^(2+3) = x⁵
Mocnina mocniny → násobím: (x⁵)⁴ = x^(5·4) = x²⁰
Dělení → odčítám: x²⁰ : x⁵ = x^(20−5) = x¹⁵`}
        result={"x¹⁵"}
      />

      <SolvedProblem
        n={3} difficulty="medium"
        title="Záporný a zlomkový exponent"
        given={"(8 · a⁻³) ^ (2/3)"}
        steps={`Roznásobím exponent na oba činitele:
   = 8^(2/3) · (a⁻³)^(2/3)
8^(2/3) = (³√8)² = 2² = 4
(a⁻³)^(2/3) = a^(−3 · 2/3) = a⁻²
Výsledek: 4 · a⁻² = 4/a²`}
        result={"4 / a²"}
      />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// TAB: NEROVNICE
// ══════════════════════════════════════════════════════════════════
function NerovniceTab() {
  return (
    <div>
      <SectionTitle>Nerovnice & množiny</SectionTitle>
      <Lead>Kvadratické, součinové a podílové nerovnice se řeší stejnou logikou: dostaň nulu na jednu stranu, rozlož na součin/podíl a urči znaménka přes <b>tabulku nulových bodů</b> (sign table) nebo přes <b>parabolu</b>.</Lead>

      <Collapsible title="Metoda 1 — parabola (kvadratická nerovnice)" defaultOpen accent={CYAN}>
        <p style={pS}>Najdi kořeny (nulové body) a nakresli parabolu. Pro <Mono>a &gt; 0</Mono> jde nahoru (mimo kořeny je <b>+</b>, mezi nimi <b>−</b>).</p>
        <MBlock>{`x² + 4x + 3 ≤ 0
(x+1)(x+3) ≤ 0      kořeny: −3 a −1
Parabola jde nahoru → záporná MEZI kořeny
Hledáme ≤ 0 (záporná část a kořeny):
K = ⟨−3, −1⟩`}</MBlock>
        <NumberLine from={-6} to={2} marks={[{ v: -3, label: "−3", filled: true }, { v: -1, label: "−1", filled: true }]} regions={[{ a: -3, b: -1, color: GREEN }]} />
      </Collapsible>

      <Collapsible title="Metoda 2 — tabulka nulových bodů (univerzální)" accent={CYAN}>
        <p style={pS}>Funguje pro součin i podíl libovolně mnoha závorek. Postup:</p>
        <MBlock color={YELLOW}>{`1) Nulu na jednu stranu, druhá strana = 0.
2) Čitatel i jmenovatel rozlož na součin kořenových činitelů.
3) Vypiš nulové body a seřaď je na ose.
4) Pro každý činitel urči znaménko v každém intervalu.
5) Znaménka ve sloupci VYNÁSOB → znaménko výsledku.
6) Vyber intervaly podle žádaného znaménka nerovnosti.
POZOR: nulový bod JMENOVATELE je vždy otevřený ( ).`}</MBlock>
      </Collapsible>

      <div style={hS}>Vyřešené příklady</div>

      <SolvedProblem
        n={1} difficulty="medium"
        title="Kvadratická nerovnice ≥ 0"
        given={"x² + 2x ≥ 0"}
        steps={`Vytknu: x(x + 2) ≥ 0
Nulové body: x = 0 a x = −2
Parabola jde nahoru → kladná VNĚ kořenů:
K = (−∞, −2⟩ ∪ ⟨0, ∞)
   = ℝ \\ (−2, 0)`}
        result={"K = (−∞, −2⟩ ∪ ⟨0, ∞)"}
        graph={<NumberLine from={-5} to={3} marks={[{ v: -2, label: "−2", filled: true }, { v: 0, label: "0", filled: true }]} regions={[{ a: -5, b: -2, color: GREEN }, { a: 0, b: 3, color: GREEN }]} />}
      />

      <SolvedProblem
        n={2} difficulty="hard"
        title="Podílová nerovnice (tvůj zápisek, 1. skupina)"
        given={"(x³ − 16x) / (x² − 2x − 8) ≥ 0"}
        steps={`Rozlož čitatel: x³ − 16x = x(x² − 16) = x(x+4)(x−4)
Rozlož jmenovatel: x² − 2x − 8 = (x−4)(x+2)
Zkrátíme (x−4), ale PODMÍNKA: x ≠ 4 !
   → x(x+4) / (x+2) ≥ 0
Nulové body: −4, −2, 0   (a vyloučené 4)
Tabulka znamének dá kladné/nulové úseky:
K = ⟨−4, −2) ∪ ⟨0, 4) ∪ (4, ∞)`}
        result={"K = ⟨−4, −2) ∪ ⟨0, 4) ∪ (4, ∞)"}
        graph={<NumberLine from={-6} to={6} marks={[{ v: -4, label: "−4", filled: true }, { v: -2, label: "−2", filled: false }, { v: 0, label: "0", filled: true }, { v: 4, label: "4", filled: false, color: PINK }]} regions={[{ a: -4, b: -2, color: GREEN }, { a: 0, b: 4, color: GREEN }, { a: 4, b: 6, color: GREEN }]} />}
      />

      <SolvedProblem
        n={3} difficulty="medium"
        title="Podílová nerovnice — převod na jeden zlomek"
        given={"(2x + 3) / (x − 1) < 1"}
        steps={`Vše na jednu stranu (nesmím násobit (x−1), neznám znaménko!):
   (2x+3)/(x−1) − 1 < 0
   (2x + 3 − (x − 1)) / (x − 1) < 0
   (x + 4) / (x − 1) < 0
Nulové body: −4 (čitatel), 1 (jmenovatel, x ≠ 1)
Zlomek je záporný MEZI nimi:
K = (−4, 1)`}
        result={"K = (−4, 1)"}
        graph={<NumberLine from={-7} to={4} marks={[{ v: -4, label: "−4", filled: false }, { v: 1, label: "1", filled: false, color: PINK }]} regions={[{ a: -4, b: 1, color: GREEN }]} />}
      />

      <SolvedProblem
        n={4} difficulty="medium"
        title="Množiny zadané nerovnicí + průnik/sjednocení"
        given={"A = {x∈ℝ; (x²−5x+6)/(x²+x−2) < 0},  B = {x∈ℝ; |2x+5| ≥ 10}"}
        steps={`A: rozlož → (x−3)(x−2) / ((x+2)(x−1)) < 0
   nulové body: −2, 1, 2, 3 → tabulka znamének → záporné:
   A = (−2, 1) ∪ (2, 3)
B: |2x+5| ≥ 10 → |x + 5/2| ≥ 5
   x + 5/2 ≥ 5  nebo  x + 5/2 ≤ −5
   x ≥ 5/2  nebo  x ≤ −15/2
   B = (−∞, −15/2⟩ ∪ ⟨5/2, ∞)

A ∩ B = ⟨5/2, 3)          (společná část)
A ∪ B = (−∞,−15/2⟩ ∪ (−2,1) ∪ (2,∞)
A' (doplněk v ℝ) = (−∞,−2⟩ ∪ ⟨1,2⟩ ∪ ⟨3,∞)`}
        result={"A = (−2,1) ∪ (2,3);  B = (−∞,−15/2⟩ ∪ ⟨5/2,∞)"}
      />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// TAB: ABSOLUTNÍ HODNOTA
// ══════════════════════════════════════════════════════════════════
function AbsTab() {
  return (
    <div>
      <SectionTitle color={PURPLE}>Absolutní hodnota</SectionTitle>
      <Lead>Absolutní hodnota je „vzdálenost od nuly" — vždy nezáporná. Klíč ke všem úlohám je <b>rozdělit osu podle nulových bodů</b> každé absolutní hodnoty a v každém úseku ji „odbouráte" podle definice.</Lead>

      <Collapsible title="Definice a základní fakta" defaultOpen accent={PURPLE}>
        <MBlock color={PURPLE}>{`        ⎧  x    pro x ≥ 0
|x| =   ⎨
        ⎩ −x    pro x < 0

|x| = √(x²)        (vždy ≥ 0)
|5| = 5    |−5| = 5    |0| = 0
|x| = a (a>0)  ⟺  x = a  nebo  x = −a
|x| ≤ a (a>0)  ⟺  −a ≤ x ≤ a
|x| ≥ a (a>0)  ⟺  x ≤ −a  nebo  x ≥ a`}</MBlock>
        <FunctionGraph funcs={[{ fn: x => Math.abs(x), color: PURPLE, label: "y=|x|" }]} xMin={-5} xMax={5} yMin={-1} yMax={5} height={240} />
      </Collapsible>

      <Collapsible title="Funkce s absolutní hodnotou — rozdělení na intervaly" accent={PURPLE}>
        <p style={pS}>U funkce s více absolutními hodnotami najdi <b>nulové body</b> každé z nich, rozděl osu a v každém úseku napiš předpis bez absolutní hodnoty. Graf je pak po částech lineární (lomená čára).</p>
        <MBlock color={YELLOW}>{`f: y = 2x + |x−1| − |x|
Nulové body: |x−1|→ x=1,  |x|→ x=0
Osa: (−∞,0) | ⟨0,1) | ⟨1,∞)

(−∞,0):  |x−1|=−(x−1)=−x+1,  |x|=−x
   y = 2x + (−x+1) − (−x) = 2x + 1
⟨0,1):   |x−1|=−x+1,  |x|=x
   y = 2x + (−x+1) − x = 1
⟨1,∞):   |x−1|=x−1,  |x|=x
   y = 2x + (x−1) − x = 2x − 1`}</MBlock>
        <FunctionGraph funcs={[{ fn: x => x < 0 ? 2 * x + 1 : (x < 1 ? 1 : 2 * x - 1), color: CYAN, label: "f(x)" }, { fn: () => 1, color: "rgba(255,255,255,0.4)", label: "y=1", dash: "5 5", strokeWidth: 1.5 }]} xMin={-4} xMax={4} yMin={-3} yMax={5} height={260} />
      </Collapsible>

      <div style={hS}>Vyřešené příklady</div>

      <SolvedProblem
        n={1} difficulty="medium"
        title="Grafické i algebraické řešení nerovnice"
        given={"Pro f: y = 2x + |x−1| − |x| vyřeš f(x) ≤ 1"}
        steps={`Použij předpisy z rozdělení (viz teorie):
(−∞,0):  2x+1 ≤ 1 → 2x ≤ 0 → x ≤ 0 → K₁=(−∞,0)
⟨0,1):   1 ≤ 1 → platí vždy → K₂=⟨0,1)
⟨1,∞):   2x−1 ≤ 1 → 2x ≤ 2 → x ≤ 1 → K₃={1}
Sjednocení: K = K₁ ∪ K₂ ∪ K₃ = (−∞, 1⟩
Graficky: část grafu pod/na přímce y=1 je právě x ≤ 1. ✓`}
        result={"K = (−∞, 1⟩"}
      />

      <SolvedProblem
        n={2} difficulty="easy"
        title="Zápis množin intervalem"
        given={"A = {x∈ℤ; |x+5| ≤ 3},  B = {x∈ℝ; |3x−2| ≤ 6}"}
        steps={`A: |x+5| ≤ 3 ⟺ −3 ≤ x+5 ≤ 3 ⟺ −8 ≤ x ≤ −2
   Ale x ∈ ℤ → výčet: A = {−8,−7,−6,−5,−4,−3,−2}

B: |3x−2| ≤ 6 ⟺ −6 ≤ 3x−2 ≤ 6
   −4 ≤ 3x ≤ 8 ⟺ −4/3 ≤ x ≤ 8/3
   B = ⟨−4/3, 8/3⟩`}
        result={"A = {−8,…,−2} (7 prvků);  B = ⟨−4/3, 8/3⟩"}
      />

      <SolvedProblem
        n={3} difficulty="medium"
        title="Nerovnice typu ≥ s absolutní hodnotou"
        given={"B = {x∈ℝ; |2x+5| ≥ 10}"}
        steps={`Vytkni 2: |2x+5| = 2·|x + 5/2| ≥ 10  / :2
|x + 5/2| ≥ 5
„vzdálenost x od −5/2 je aspoň 5"
x + 5/2 ≥ 5  →  x ≥ 5/2
nebo  x + 5/2 ≤ −5  →  x ≤ −15/2
B = (−∞, −15/2⟩ ∪ ⟨5/2, ∞)`}
        result={"B = (−∞, −15/2⟩ ∪ ⟨5/2, ∞)"}
        graph={<NumberLine from={-9} to={5} marks={[{ v: -7.5, label: "−15/2", filled: true }, { v: 2.5, label: "5/2", filled: true }]} regions={[{ a: -9, b: -7.5, color: GREEN }, { a: 2.5, b: 5, color: GREEN }]} />}
      />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// TAB: FUNKCE
// ══════════════════════════════════════════════════════════════════
function FunkceTab() {
  return (
    <div>
      <SectionTitle color={CYAN}>Funkce — lomená & kvadratická</SectionTitle>
      <Lead>Dvě hlavní funkce z testu: <b>lineární lomená</b> (graf = hyperbola, má asymptoty) a <b>kvadratická</b> (graf = parabola, má vrchol). U obou se ptá na definiční obor, obor hodnot, průsečíky s osami a graf.</Lead>

      <Collapsible title="Lineární lomená funkce (hyperbola)" defaultOpen accent={CYAN}>
        <MBlock>{`y = (ax + b)/(cx + d),  c ≠ 0
Definiční obor: D(f) = ℝ \\ {bod, kde jmenovatel = 0}
SVISLÁ asymptota: x = (kořen jmenovatele)
VODOROVNÁ asymptota: y = a/c   (limita pro x→±∞)
Obor hodnot: H(f) = ℝ \\ {vodorovná asymptota}
Průsečíky:  Py: dosaď x=0     Px: polož y=0`}</MBlock>
        <p style={pS}>Trik na vodorovnou asymptotu (z tvého zápisku): vytkni nejvyšší mocninu a pošli x→∞. U <Mono>y=(−2x−3)/(x+3)</Mono> vyjde <Mono>y → −2</Mono>.</p>
      </Collapsible>

      <Collapsible title="Kvadratická funkce (parabola)" accent={CYAN}>
        <MBlock>{`y = ax² + bx + c,  a ≠ 0
a > 0 → parabola otevřená NAHORU (vrchol = minimum)
a < 0 → otevřená DOLŮ (vrchol = maximum)
Py: [0, c]
Px: řeš ax² + bx + c = 0 (rozklad / vzorec / diskriminant)
Vrchol V[v₁, v₂]:
   v₁ = (x₁ + x₂)/2   (průměr kořenů)  nebo  v₁ = −b/(2a)
   v₂ = f(v₁)         (dosadím v₁ do předpisu)
Doplnění na čtverec: y = a(x − v₁)² + v₂`}</MBlock>
      </Collapsible>

      <Collapsible title="Přímka a parabola — tečna, sečna, vnější přímka" accent={CYAN}>
        <p style={pS}>Když hledáš průsečíky přímky <Mono>g</Mono> a paraboly <Mono>f</Mono>, polož <Mono>f = g</Mono> a vznikne kvadratická rovnice. Počet řešení (diskriminant) rozhodne o vzájemné poloze:</p>
        <MBlock color={YELLOW}>{`D > 0 → 2 průsečíky → SEČNA
D = 0 → 1 dotykový bod → TEČNA
D < 0 → 0 průsečíků → VNĚJŠÍ přímka`}</MBlock>
      </Collapsible>

      <div style={hS}>Vyřešené příklady</div>

      <SolvedProblem
        n={1} difficulty="hard"
        title="Lineární lomená funkce — vše (tvůj test)"
        given={"y = (−2x − 3)/(x + 3): D(f), H(f), asymptoty, průsečíky, graf"}
        steps={`Jmenovatel = 0:  x + 3 = 0 → x = −3
D(f) = ℝ \\ {−3}
Svislá asymptota: x = −3
Vodorovná asymptota: a/c = −2/1 = −2
   (limita: (−2x−3)/(x+3) → −2 pro x→±∞)
H(f) = ℝ \\ {−2}
Py: x=0 → y = −3/3 = −1 → Py[0, −1]
Px: y=0 → −2x−3 = 0 → x = −3/2 → Px[−3/2, 0]`}
        result={"D=ℝ\\{−3}, H=ℝ\\{−2}, as. x=−3 a y=−2, Py[0,−1], Px[−3/2,0]"}
        graph={<FunctionGraph funcs={[{ fn: x => (-2 * x - 3) / (x + 3), color: CYAN, label: "f" }]} xMin={-9} xMax={3} yMin={-7} yMax={4} vlines={[-3]} hlines={[-2]} keyPoints={[{ x: 0, y: -1, label: "Py" }, { x: -1.5, y: 0, label: "Px" }]} height={300} />}
      />

      <SolvedProblem
        n={2} difficulty="medium"
        title="Kvadratická funkce — průsečíky a vrchol"
        given={"f: y = ½x² − 2x + 3/2"}
        steps={`Py: x=0 → y = 3/2 → Py[0, 3/2]
Px: ½x² − 2x + 3/2 = 0  / ·2
   x² − 4x + 3 = 0 → (x−1)(x−3)=0 → x=1, x=3
   Px[1,0] a [3,0]
Vrchol: v₁ = (1+3)/2 = 2
   v₂ = f(2) = ½·4 − 2·2 + 3/2 = 2 − 4 + 1,5 = −1/2
   V[2, −1/2]`}
        result={"Py[0,3/2], Px[1,0] a [3,0], V[2,−1/2]"}
        graph={<FunctionGraph funcs={[{ fn: x => 0.5 * x * x - 2 * x + 1.5, color: GREEN, label: "f" }]} xMin={-2} xMax={6} yMin={-2} yMax={5} keyPoints={[{ x: 1, y: 0, label: "Px" }, { x: 3, y: 0, label: "Px" }, { x: 2, y: -0.5, label: "V", color: PINK }]} height={280} />}
      />

      <SolvedProblem
        n={3} difficulty="hard"
        title="Vrchol doplněním na čtverec"
        given={"f: y = (3/2)x² + 3x + 5/2 — urči vrchol"}
        steps={`Vytkni 3/2 z prvních dvou členů:
   y = (3/2)(x² + 2x) + 5/2
Doplň na čtverec: x² + 2x = (x+1)² − 1
   y = (3/2)[(x+1)² − 1] + 5/2
   y = (3/2)(x+1)² − 3/2 + 5/2
   y = (3/2)(x+1)² + 1
Z tvaru a(x−v₁)²+v₂ čtu vrchol:
   V[−1, 1]`}
        result={"V[−1, 1]"}
      />

      <SolvedProblem
        n={4} difficulty="medium"
        title="Přímka × parabola — sečna/tečna/vnější"
        given={"f: y = x²/2,  g: y = x/2 + 1 — urči polohu a průsečíky"}
        steps={`Polož f = g:  x²/2 = x/2 + 1  / ·2
   x² = x + 2 → x² − x − 2 = 0
   D = 1 + 8 = 9 > 0  → SEČNA (2 průsečíky)
   x = (1 ± 3)/2 → x₁=−1, x₂=2
Dosadím do g:
   x=−1: y = −1/2+1 = 1/2 → P₁[−1, 1/2]
   x=2:  y = 1+1 = 2     → P₂[2, 2]`}
        result={"Sečna; průsečíky P₁[−1, 1/2] a P₂[2, 2]"}
        graph={<FunctionGraph funcs={[{ fn: x => x * x / 2, color: YELLOW, label: "f" }, { fn: x => x / 2 + 1, color: GREEN, label: "g" }]} xMin={-4} xMax={4} yMin={-1} yMax={6} keyPoints={[{ x: -1, y: 0.5, label: "P₁" }, { x: 2, y: 2, label: "P₂" }]} height={280} />}
      />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// TAB: IRACIONÁLNÍ ROVNICE
// ══════════════════════════════════════════════════════════════════
function IracionalniTab() {
  return (
    <div>
      <SectionTitle color={YELLOW}>Rovnice s odmocninou (iracionální)</SectionTitle>
      <Lead>Neznámá je pod odmocninou. Plán: <b>1)</b> urči definiční obor (výraz pod sudou odmocninou ≥ 0), <b>2)</b> osamostatni odmocninu a umocni, <b>3)</b> vyřeš, <b>4)</b> udělej <b>zkoušku</b> — umocňování může přidat falešné kořeny!</Lead>

      <Collapsible title="Postup + na co dát pozor" defaultOpen accent={YELLOW}>
        <MBlock color={YELLOW}>{`1) DEFINIČNÍ OBOR: každý výraz pod √ musí být ≥ 0
   (víc odmocnin → soustava podmínek, průnik)
2) Osamostatni JEDNU odmocninu na jednu stranu.
3) Umocni obě strany na druhou (²).
4) Zůstala-li ještě odmocnina, opakuj 2)–3).
5) Vyřeš výslednou rovnici.
6) ZKOUŠKA je POVINNÁ — kořen musí být v D
   a musí vyhovovat původní rovnici.`}</MBlock>
        <p style={pS}>Pozor na vzorec: <Mono>(a + √b)² = a² + 2a√b + b</Mono> — prostřední člen nesmíš zapomenout.</p>
      </Collapsible>

      <div style={hS}>Vyřešené příklady</div>

      <SolvedProblem
        n={1} difficulty="hard"
        title="Dvě odmocniny (tvůj mock test)"
        given={"√(x+5) − √(x−3) = 2"}
        steps={`Definiční obor: x+5 ≥ 0 ∧ x−3 ≥ 0
   x ≥ −5 ∧ x ≥ 3 → D = ⟨3, ∞)
Osamostatni: √(x+5) = 2 + √(x−3)   / ²
   x+5 = 4 + 4√(x−3) + (x−3)
   x+5 = x+1 + 4√(x−3)
   4 = 4√(x−3)   / :4
   1 = √(x−3)   / ²
   1 = x−3 → x = 4
ZKOUŠKA: x=4 ∈ D ✓
   L = √9 − √1 = 3 − 1 = 2 = P ✓`}
        result={"x = 4  (K = {4})"}
      />

      <SolvedProblem
        n={2} difficulty="medium"
        title="Jedna odmocnina"
        given={"√(2x + 3) = x"}
        steps={`D: 2x+3 ≥ 0 → x ≥ −3/2; navíc pravá strana x ≥ 0 (= odmocnina)
Umocni: 2x + 3 = x²
   x² − 2x − 3 = 0 → (x−3)(x+1) = 0
   x = 3  nebo  x = −1
ZKOUŠKA:
   x=3:  √9 = 3 ✓
   x=−1: √1 = 1 ≠ −1  ✗  (falešný kořen!)`}
        result={"x = 3"}
      />

      <SolvedProblem
        n={3} difficulty="medium"
        title="Odmocnina = výraz, kontrola podmínky"
        given={"√(x + 7) = x + 1"}
        steps={`D: x+7 ≥ 0 → x ≥ −7; pravá strana x+1 ≥ 0 → x ≥ −1
Umocni: x + 7 = (x+1)² = x² + 2x + 1
   0 = x² + x − 6 = (x+3)(x−2)
   x = −3  nebo  x = 2
ZKOUŠKA:
   x=2:  √9 = 3 = 2+1 ✓
   x=−3: nevyhovuje podmínce x ≥ −1 ✗`}
        result={"x = 2"}
      />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// TAB: GONIOMETRIE
// ══════════════════════════════════════════════════════════════════
function GonioTab() {
  const rows = [
    ["0°  (0)", "0", "1", "0", "—"],
    ["30° (π/6)", "1/2", "√3/2", "√3/3", "√3"],
    ["45° (π/4)", "√2/2", "√2/2", "1", "1"],
    ["60° (π/3)", "√3/2", "1/2", "√3", "√3/3"],
    ["90° (π/2)", "1", "0", "—", "0"],
  ];
  return (
    <div>
      <SectionTitle color={PINK}>Goniometrie</SectionTitle>
      <Lead>Goniometrické funkce sin, cos, tg, cotg — hodnoty v základních úhlech, jednotková kružnice, grafy, vztahy a rovnice. Základ, který musíš mít „v ruce", je tabulka hodnot a vzorec <Mono>sin²x + cos²x = 1</Mono>.</Lead>

      <Collapsible title="Tabulka hodnot základních úhlů" defaultOpen accent={PINK}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px", fontFamily: "'JetBrains Mono', monospace" }}>
            <thead>
              <tr style={{ color: PINK }}>
                {["úhel", "sin", "cos", "tg", "cotg"].map(h => <th key={h} style={{ padding: "8px 6px", borderBottom: "1px solid rgba(255,255,255,0.15)", textAlign: "left" }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} style={{ color: "rgba(255,255,255,0.85)" }}>
                  {r.map((c, j) => <td key={j} style={{ padding: "7px 6px", borderBottom: "1px solid rgba(255,255,255,0.06)", color: j === 0 ? CYAN : "rgba(255,255,255,0.85)" }}>{c}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Collapsible>

      <Collapsible title="Důležité vztahy a vzorce" accent={PINK}>
        <MBlock color={PINK}>{`sin²x + cos²x = 1
tg x = sin x / cos x      cotg x = cos x / sin x
tg x · cotg x = 1
sin(−x) = −sin x   (lichá)    cos(−x) = cos x  (sudá)
Součtové: sin(a±b) = sin a cos b ± cos a sin b
          cos(a±b) = cos a cos b ∓ sin a sin b
Dvojnásobný: sin 2x = 2 sin x cos x
             cos 2x = cos²x − sin²x`}</MBlock>
      </Collapsible>

      <Collapsible title="Grafy goniometrických funkcí" accent={PINK}>
        <FunctionGraph piLabels funcs={[{ fn: Math.sin, color: PINK, label: "sin x" }, { fn: Math.cos, color: CYAN, label: "cos x" }]} xMin={-2 * Math.PI} xMax={2 * Math.PI} yMin={-1.5} yMax={1.5} height={240} />
        <p style={pS}>sin i cos mají periodu <Mono>2π</Mono>, obor hodnot <Mono>⟨−1, 1⟩</Mono>. Funkce tg má periodu <Mono>π</Mono> a svislé asymptoty v <Mono>π/2 + kπ</Mono>.</p>
      </Collapsible>

      <div style={hS}>Vyřešené příklady</div>

      <SolvedProblem
        n={1} difficulty="medium"
        title="Goniometrická rovnice"
        given={"2 sin x − 1 = 0  na ⟨0, 2π)"}
        steps={`sin x = 1/2
Základní řešení: x = π/6 (sin = 1/2 v 30°)
sin je kladný v I. a II. kvadrantu:
   x₁ = π/6
   x₂ = π − π/6 = 5π/6
Obecně: x = π/6 + 2kπ  nebo  x = 5π/6 + 2kπ, k∈ℤ`}
        result={"x ∈ {π/6, 5π/6}  na ⟨0,2π)"}
      />

      <SolvedProblem
        n={2} difficulty="hard"
        title="Úprava goniometrického výrazu"
        given={"Zjednoduš: (1 − cos²x) / sin x"}
        steps={`Z hlavní identity: sin²x + cos²x = 1
   → 1 − cos²x = sin²x
Dosadím: sin²x / sin x = sin x   (pro sin x ≠ 0)`}
        result={"sin x"}
      />

      <SolvedProblem
        n={3} difficulty="easy"
        title="Dopočítej zbylé funkce"
        given={"cos x = 3/5, x v I. kvadrantu — urči sin x a tg x"}
        steps={`sin²x = 1 − cos²x = 1 − 9/25 = 16/25
   sin x = 4/5 (I. kvadrant → kladné)
tg x = sin x / cos x = (4/5)/(3/5) = 4/3`}
        result={"sin x = 4/5,  tg x = 4/3"}
      />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// TAB: GEOMETRIE (výpočty)
// ══════════════════════════════════════════════════════════════════
function GeometrieTab() {
  return (
    <div>
      <SectionTitle color={GREEN}>Geometrie — výpočty v trojúhelníku</SectionTitle>
      <Lead>Čtyři nástroje na počítání stran a úhlů: <b>Pythagorova věta</b> a <b>Euklidovy věty</b> (jen pravoúhlý trojúhelník) a <b>sinová</b> a <b>kosinová věta</b> (libovolný trojúhelník).</Lead>

      <Collapsible title="Pythagorova a Euklidovy věty (pravoúhlý △)" defaultOpen accent={GREEN}>
        <MBlock color={GREEN}>{`Pravoúhlý △: přepona c, odvěsny a, b; výška na přeponu v
patí cₐ, c_b (úseky přepony pod odvěsnami a, b)

Pythagorova věta:    c² = a² + b²
Euklidova o výšce:   v² = cₐ · c_b
Euklidova o odvěsně: a² = c · cₐ
                     b² = c · c_b`}</MBlock>
      </Collapsible>

      <Collapsible title="Sinová a kosinová věta (libovolný △)" accent={GREEN}>
        <MBlock color={GREEN}>{`Strany a, b, c leží proti úhlům α, β, γ.

Sinová věta:
   a/sin α = b/sin β = c/sin γ = 2r
   (r = poloměr opsané kružnice)
   → použij, když znáš stranu a protilehlý úhel

Kosinová věta:
   c² = a² + b² − 2ab·cos γ
   → použij, když znáš dvě strany a úhel mezi nimi
     (nebo všechny tři strany a hledáš úhel)

Obsah: S = ½·a·b·sin γ`}</MBlock>
      </Collapsible>

      <div style={hS}>Vyřešené příklady</div>

      <SolvedProblem
        n={1} difficulty="easy"
        title="Pythagorova věta"
        given={"Odvěsny a = 6, b = 8. Urči přeponu c."}
        steps={`c² = a² + b² = 6² + 8² = 36 + 64 = 100
c = √100 = 10`}
        result={"c = 10"}
      />

      <SolvedProblem
        n={2} difficulty="medium"
        title="Euklidova věta o odvěsně"
        given={"Přepona c = 25, úsek cₐ = 9. Urči odvěsnu a a výšku v."}
        steps={`Euklidova o odvěsně: a² = c · cₐ = 25 · 9 = 225
   a = 15
Druhý úsek: c_b = c − cₐ = 25 − 9 = 16
Euklidova o výšce: v² = cₐ · c_b = 9 · 16 = 144
   v = 12`}
        result={"a = 15,  v = 12"}
      />

      <SolvedProblem
        n={3} difficulty="hard"
        title="Kosinová věta"
        given={"Strany a = 5, b = 8, úhel γ = 60° mezi nimi. Urči c."}
        steps={`c² = a² + b² − 2ab·cos γ
   = 25 + 64 − 2·5·8·cos 60°
   = 89 − 80·(1/2)
   = 89 − 40 = 49
c = √49 = 7`}
        result={"c = 7"}
      />

      <SolvedProblem
        n={4} difficulty="medium"
        title="Sinová věta"
        given={"a = 10, α = 30°, β = 45°. Urči stranu b."}
        steps={`Sinová věta: a/sin α = b/sin β
   b = a · sin β / sin α
   = 10 · sin 45° / sin 30°
   = 10 · (√2/2) / (1/2)
   = 10 · √2 = 10√2 ≈ 14,14`}
        result={"b = 10√2 ≈ 14,14"}
      />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// TAB: ANALYTICKÁ GEOMETRIE
// ══════════════════════════════════════════════════════════════════
function AnalytickaTab() {
  return (
    <div>
      <SectionTitle color={PURPLE}>Analytická geometrie</SectionTitle>
      <Lead>Body, vektory, přímky a kružnice v souřadnicích. Vše stojí na pár vzorcích — vzdálenost, střed, vektor jako rozdíl bodů a skalární součin.</Lead>

      <Collapsible title="Bod a vektor" defaultOpen accent={PURPLE}>
        <MBlock color={PURPLE}>{`Vektor z A do B:  u = B − A = (b₁−a₁, b₂−a₂)
Velikost:  |u| = √(u₁² + u₂²)
Vzdálenost bodů: |AB| = √((b₁−a₁)² + (b₂−a₂)²)
Střed úsečky: S = ((a₁+b₁)/2, (a₂+b₂)/2)
Skalární součin: u·v = u₁v₁ + u₂v₂
Úhel: cos φ = (u·v)/(|u|·|v|)
Kolmost: u ⟂ v  ⟺  u·v = 0
Rovnoběžnost: u ∥ v  ⟺  u₁v₂ − u₂v₁ = 0`}</MBlock>
      </Collapsible>

      <Collapsible title="Přímka" accent={PURPLE}>
        <MBlock color={PURPLE}>{`Parametrická: X = A + t·u   (u = směrový vektor)
   x = a₁ + t·u₁
   y = a₂ + t·u₂
Obecná: ax + by + c = 0   (n = (a,b) = normálový vektor)
Směrnicová: y = kx + q   (k = směrnice)
Ze směrového u=(u₁,u₂): normála n=(u₂, −u₁) nebo (−u₂, u₁)
Vzdálenost bodu M od přímky ax+by+c=0:
   d = |a·m₁ + b·m₂ + c| / √(a² + b²)`}</MBlock>
      </Collapsible>

      <Collapsible title="Kružnice" accent={PURPLE}>
        <MBlock color={PURPLE}>{`Středová rovnice: (x − m)² + (y − n)² = r²
   střed S[m, n],  poloměr r
Obecná rovnice: x² + y² + Dx + Ey + F = 0
   → na středový tvar převedeš DOPLNĚNÍM NA ČTVEREC`}</MBlock>
      </Collapsible>

      <div style={hS}>Vyřešené příklady</div>

      <SolvedProblem
        n={1} difficulty="easy"
        title="Vzdálenost a střed"
        given={"A[1, 2], B[7, 10]. Urči |AB| a střed S."}
        steps={`u = B − A = (6, 8)
|AB| = √(6² + 8²) = √100 = 10
S = ((1+7)/2, (2+10)/2) = (4, 6)`}
        result={"|AB| = 10,  S = [4, 6]"}
      />

      <SolvedProblem
        n={2} difficulty="medium"
        title="Kolmost vektorů / skalární součin"
        given={"u = (3, −2), v = (4, 6). Jsou kolmé? Urči úhel."}
        steps={`u·v = 3·4 + (−2)·6 = 12 − 12 = 0
Skalární součin = 0 → vektory jsou KOLMÉ.
cos φ = 0 → φ = 90°`}
        result={"u ⟂ v,  φ = 90°"}
      />

      <SolvedProblem
        n={3} difficulty="medium"
        title="Obecná rovnice přímky"
        given={"Přímka prochází A[1, 2] se směrovým vektorem u = (2, 3)."}
        steps={`Normálový vektor: n = (3, −2)  (z u=(2,3))
Obecná: 3x − 2y + c = 0
Dosaď A[1,2]: 3·1 − 2·2 + c = 0 → 3 − 4 + c = 0 → c = 1
Přímka: 3x − 2y + 1 = 0`}
        result={"3x − 2y + 1 = 0"}
      />

      <SolvedProblem
        n={4} difficulty="hard"
        title="Kružnice — z obecné na středovou"
        given={"x² + y² − 6x + 4y − 12 = 0. Urči střed a poloměr."}
        steps={`Seskup a doplň na čtverec:
   (x² − 6x) + (y² + 4y) = 12
   (x−3)² − 9 + (y+2)² − 4 = 12
   (x−3)² + (y+2)² = 25
Střed S[3, −2],  r = √25 = 5`}
        result={"S[3, −2],  r = 5"}
      />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// FORMULA SHEET
// ══════════════════════════════════════════════════════════════════
function FormulaSheet() {
  const groups = [
    ["Mocniny a odmocniny", `aᵐ·aⁿ = aᵐ⁺ⁿ      aᵐ:aⁿ = aᵐ⁻ⁿ
(aᵐ)ⁿ = aᵐ·ⁿ       a⁻ⁿ = 1/aⁿ
ⁿ√a = a^(1/n)      ⁿ√(aᵐ) = a^(m/n)
a⁰ = 1  (a≠0)`, CYAN],
    ["Nerovnice", `Postup: nulu na jednu stranu → rozklad → tabulka znamének
Nulový bod JMENOVATELE je vždy otevřený ( )
Kvadr.: parabola a>0 kladná VNĚ kořenů
|x| ≤ a ⟺ −a ≤ x ≤ a
|x| ≥ a ⟺ x ≤ −a ∨ x ≥ a`, GREEN],
    ["Absolutní hodnota", `|x| = x (x≥0), −x (x<0);  |x| = √(x²)
Funkce s |·|: rozděl osu podle nulových bodů,
v každém úseku napiš předpis bez absolutní hodnoty
⟨ ⟩ uzavřený (pro ≤,≥),  ( ) otevřený (pro <,>)`, PURPLE],
    ["Kvadratická funkce", `y = ax²+bx+c (a≠0), graf = parabola
a>0 ↑ (minimum), a<0 ↓ (maximum)
Px: ax²+bx+c=0;  Py: [0,c]
V[v₁,v₂]: v₁=−b/(2a)=(x₁+x₂)/2,  v₂=f(v₁)
Doplnění na čtverec: y = a(x−v₁)²+v₂`, CYAN],
    ["Lineární lomená funkce", `y = (ax+b)/(cx+d), graf = hyperbola
D = ℝ\\{kořen jmenovatele}
svislá as.: x = kořen jmenovatele
vodorovná as.: y = a/c;  H = ℝ\\{a/c}`, CYAN],
    ["Přímka × parabola", `f=g → kvadratická rovnice, diskriminant D:
D>0 sečna (2 body), D=0 tečna (1), D<0 vnější (0)`, YELLOW],
    ["Rovnice s odmocninou", `1) D: pod √ musí být ≥ 0
2) osamostatni √, umocni (²)
3) vyřeš
4) ZKOUŠKA POVINNÁ (falešné kořeny!)
(a+√b)² = a² + 2a√b + b`, YELLOW],
    ["Goniometrie", `sin²x+cos²x = 1
tg x = sin/cos,  cotg x = cos/sin
sin 2x = 2 sin x cos x
cos 2x = cos²x − sin²x
úhly: 30°→1/2,√3/2 ; 45°→√2/2,√2/2 ; 60°→√3/2,1/2`, PINK],
    ["Trojúhelník — věty", `Pythagoras: c² = a²+b²
Euklid odvěsna: a² = c·cₐ ;  o výšce: v² = cₐ·c_b
Sinová: a/sin α = b/sin β = c/sin γ = 2r
Kosinová: c² = a²+b² − 2ab·cos γ
Obsah: S = ½ ab sin γ`, GREEN],
    ["Analytická geometrie", `u = B−A;  |u| = √(u₁²+u₂²)
S = ((a₁+b₁)/2, (a₂+b₂)/2)
u·v = u₁v₁+u₂v₂;  kolmost ⟺ u·v=0
přímka obecná: ax+by+c=0, n=(a,b)
d(M,p) = |am₁+bm₂+c| / √(a²+b²)
kružnice: (x−m)²+(y−n)² = r²`, PURPLE],
  ];
  return (
    <div>
      <SectionTitle color={CYAN}>Přehled vzorců — tahák</SectionTitle>
      <Lead>Všechno na jednom místě. Projeď si před testem.</Lead>
      {groups.map(([t, body, col], i) => (
        <div key={i} style={{ ...glass, padding: "0", marginBottom: "12px", overflow: "hidden" }}>
          <div style={{ padding: "12px 18px", background: "rgba(255,255,255,0.03)", color: col, fontWeight: 700, fontFamily: "'Audiowide', sans-serif", fontSize: "15px" }}>{t}</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(255,255,255,0.85)", fontSize: "13.5px", padding: "12px 18px", lineHeight: 1.85, whiteSpace: "pre-wrap", borderTop: "1px solid rgba(255,255,255,0.06)" }}>{body}</div>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// QUIZ DATA
// ══════════════════════════════════════════════════════════════════
const quizQuestions = [
  {
    question: "Zjednoduš: (a² · a³)⁴",
    type: "single",
    options: ["a²⁰", "a²⁴", "a⁹", "a¹⁴"],
    correct: [0],
    explanation: "Uvnitř a²·a³ = a⁵ (sčítám exponenty), pak (a⁵)⁴ = a²⁰ (násobím).",
    tip: "Součin → sčítám, mocnina mocniny → násobím."
  },
  {
    question: "Vyřeš kvadratickou nerovnici: x² + 2x ≥ 0",
    type: "single",
    options: ["(−∞,−2⟩ ∪ ⟨0,∞)", "⟨−2, 0⟩", "(−2, 0)", "ℝ"],
    correct: [0],
    explanation: "x(x+2) ≥ 0, kořeny −2 a 0. Parabola jde nahoru → kladná vně kořenů.",
    tip: "Pro a>0 je parabola kladná VNĚ kořenů."
  },
  {
    question: "U podílové nerovnice (x+4)/(x−1) < 0 je výsledek:",
    type: "single",
    options: ["(−4, 1)", "⟨−4, 1⟩", "(−∞,−4) ∪ (1,∞)", "(−4, 1⟩"],
    correct: [0],
    explanation: "Zlomek je záporný mezi nulovými body −4 a 1. Oba otevřené: −4 kvůli <, 1 kvůli jmenovateli.",
    tip: "Bod jmenovatele je VŽDY otevřený."
  },
  {
    question: "Co znamená |x| ≥ 5?",
    type: "single",
    options: ["x ≤ −5 nebo x ≥ 5", "−5 ≤ x ≤ 5", "x ≥ 5", "−5 < x < 5"],
    correct: [0],
    explanation: "Vzdálenost x od nuly je aspoň 5 → x je vlevo od −5 nebo vpravo od 5.",
    tip: "≥ → 'ven' (sjednocení); ≤ → 'dovnitř' (interval)."
  },
  {
    question: "Funkce f: y=2x+|x−1|−|x|. Jaké jsou nulové body pro rozdělení osy?",
    type: "multi",
    options: ["x = 0", "x = 1", "x = 2", "x = −1"],
    correct: [0, 1],
    explanation: "Nulové body absolutních hodnot: |x| → 0, |x−1| → 1. Podle nich dělíme osu.",
    tip: "Každá |výraz| dává jeden nulový bod = kde je výraz nula."
  },
  {
    question: "Definiční obor lineární lomené funkce y = (−2x−3)/(x+3) je:",
    type: "single",
    options: ["ℝ \\ {−3}", "ℝ \\ {−2}", "ℝ \\ {3}", "ℝ"],
    correct: [0],
    explanation: "Jmenovatel x+3 = 0 → x = −3 musí být vyloučeno.",
    tip: "D vyřazuje nulu jmenovatele; H vyřazuje vodorovnou asymptotu."
  },
  {
    question: "Vodorovná asymptota funkce y = (−2x−3)/(x+3) je:",
    type: "single",
    options: ["y = −2", "y = −3", "x = −3", "y = 2"],
    correct: [0],
    explanation: "Vodorovná asymptota = a/c = −2/1 = −2 (limita pro x→±∞).",
    tip: "Podíl vedoucích koeficientů u lineární lomené."
  },
  {
    question: "Kvadratická f má kořeny x₁=1, x₂=3. x-ová souřadnice vrcholu je:",
    type: "single",
    options: ["2", "4", "1,5", "3"],
    correct: [0],
    explanation: "v₁ = (x₁+x₂)/2 = (1+3)/2 = 2. Vrchol leží uprostřed mezi kořeny.",
    tip: "v₁ = průměr kořenů."
  },
  {
    question: "f = g dá kvadratickou rovnici s D = 0. Přímka je vůči parabole:",
    type: "single",
    options: ["tečna", "sečna", "vnější přímka", "rovnoběžka"],
    correct: [0],
    explanation: "D=0 → jedno (dvojnásobné) řešení → jeden dotykový bod → tečna.",
    tip: "D>0 sečna, D=0 tečna, D<0 vnější."
  },
  {
    question: "Co je u rovnic s odmocninou NEZBYTNÉ udělat na konci?",
    type: "single",
    options: ["zkoušku", "derivaci", "graf", "vytknutí"],
    correct: [0],
    explanation: "Umocňování může přidat falešné kořeny, proto je zkouška povinná.",
    tip: "Falešné kořeny vznikají umocněním obou stran."
  },
  {
    question: "Řeš √(2x+3) = x. Který kořen vyhovuje?",
    type: "single",
    options: ["x = 3", "x = −1", "x = 3 i x = −1", "žádný"],
    correct: [0],
    explanation: "Umocněním x²−2x−3=0 → x=3 nebo x=−1. Zkouška: √9=3 ✓, √1=1≠−1 ✗.",
    tip: "Odmocnina je nezáporná, takže pravá strana musí být ≥ 0."
  },
  {
    question: "Čemu se rovná 1 − cos²x?",
    type: "single",
    options: ["sin²x", "tg²x", "2sin x", "cos²x − 1"],
    correct: [0],
    explanation: "Z identity sin²x + cos²x = 1 plyne 1 − cos²x = sin²x.",
    tip: "Hlavní goniometrická identita — uč se nazpaměť."
  },
  {
    question: "Které věty platí JEN v pravoúhlém trojúhelníku?",
    type: "multi",
    options: ["Pythagorova", "Euklidovy", "Sinová", "Kosinová"],
    correct: [0, 1],
    explanation: "Pythagorova a Euklidovy věty platí jen pro pravoúhlý △. Sinová a kosinová pro libovolný.",
    tip: "Sinová/kosinová věta = univerzální nástroje."
  },
  {
    question: "Kosinová věta: c² = a² + b² − 2ab·cos γ. Kdy ji použiješ?",
    type: "single",
    options: ["znám 2 strany a úhel mezi nimi", "znám stranu a protilehlý úhel", "jen v pravoúhlém △", "pro výpočet obsahu"],
    correct: [0],
    explanation: "Kosinová věta spojuje dvě strany, úhel mezi nimi a třetí stranu (nebo 3 strany → úhel).",
    tip: "Strana a protilehlý úhel → sinová věta."
  },
  {
    question: "Vektory u=(3,−2), v=(4,6). Jejich skalární součin je:",
    type: "single",
    options: ["0 (jsou kolmé)", "24", "12", "−24"],
    correct: [0],
    explanation: "u·v = 3·4 + (−2)·6 = 12 − 12 = 0 → vektory jsou kolmé.",
    tip: "u·v = 0 ⟺ kolmost."
  },
  {
    question: "Kružnice x²+y²−6x+4y−12=0 má po doplnění na čtverec střed a poloměr:",
    type: "single",
    options: ["S[3,−2], r=5", "S[−3,2], r=5", "S[3,−2], r=25", "S[6,−4], r=12"],
    correct: [0],
    explanation: "(x−3)²+(y+2)²=25 → S[3,−2], r=√25=5.",
    tip: "Polovina koeficientu u x a y (s opačným znaménkem) dá střed."
  },
];

const flashcards = [
  { f: "Pravidlo: aᵐ · aⁿ = ?", b: "aᵐ⁺ⁿ  (stejný základ → exponenty sčítám)" },
  { f: "Pravidlo: (aᵐ)ⁿ = ?", b: "aᵐ·ⁿ  (mocnina mocniny → exponenty násobím)" },
  { f: "ⁿ√(aᵐ) přepíšu jako mocninu jak?", b: "a^(m/n)" },
  { f: "Postup u podílové nerovnice?", b: "Nulu na jednu stranu → rozklad → tabulka nulových bodů → vyber znaménko.\nBod jmenovatele je vždy otevřený." },
  { f: "|x| ≤ a (a>0) je ekvivalentní…?", b: "−a ≤ x ≤ a  (interval 'dovnitř')" },
  { f: "|x| ≥ a (a>0) je ekvivalentní…?", b: "x ≤ −a  nebo  x ≥ a  (sjednocení 'ven')" },
  { f: "Jak řešit funkci s více |·|?", b: "Najdi nulové body, rozděl osu, v každém úseku napiš předpis bez absolutní hodnoty." },
  { f: "Definiční obor lineární lomené funkce?", b: "D = ℝ \\ {kořen jmenovatele}" },
  { f: "Vodorovná asymptota y=(ax+b)/(cx+d)?", b: "y = a/c  (podíl vedoucích koeficientů)" },
  { f: "Souřadnice vrcholu paraboly?", b: "v₁ = −b/(2a) = (x₁+x₂)/2;  v₂ = f(v₁)" },
  { f: "Přímka × parabola: co rozhoduje D?", b: "D>0 sečna (2 body), D=0 tečna (1), D<0 vnější (0)" },
  { f: "Co NESMÍŠ zapomenout u rovnic s odmocninou?", b: "Zkoušku! Umocnění může přidat falešné kořeny." },
  { f: "Hlavní goniometrická identita?", b: "sin²x + cos²x = 1" },
  { f: "Hodnoty sin a cos pro 45°?", b: "sin 45° = cos 45° = √2/2" },
  { f: "Euklidova věta o odvěsně?", b: "a² = c·cₐ  (odvěsna² = přepona × přilehlý úsek)" },
  { f: "Kosinová věta?", b: "c² = a² + b² − 2ab·cos γ" },
  { f: "Sinová věta?", b: "a/sin α = b/sin β = c/sin γ = 2r" },
  { f: "Skalární součin u·v a kolmost?", b: "u·v = u₁v₁ + u₂v₂;  u ⟂ v ⟺ u·v = 0" },
  { f: "Středová rovnice kružnice?", b: "(x−m)² + (y−n)² = r², střed S[m,n], poloměr r" },
];

// ══════════════════════════════════════════════════════════════════
// APP
// ══════════════════════════════════════════════════════════════════
export default function App() {
  const [tab, setTab] = useState("prehled");
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a1a", fontFamily: "'Exo 2', sans-serif", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", bottom: 0, left: "-50%", width: "200%", height: "50%", backgroundImage: `linear-gradient(${PINK}15 1px, transparent 1px), linear-gradient(90deg, ${PINK}15 1px, transparent 1px)`, backgroundSize: "60px 60px", transform: "perspective(500px) rotateX(60deg)", transformOrigin: "center bottom" }} />
        <div style={{ position: "absolute", top: "6%", left: "50%", transform: "translateX(-50%)", width: "220px", height: "220px", borderRadius: "50%", background: `radial-gradient(circle, ${PINK}44, ${CYAN}22, transparent)`, filter: "blur(40px)" }} />
        {[...Array(14)].map((_, i) => (
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
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 3px; }
        input[type=range] { height: 4px; }
      `}</style>

      <div style={{ position: "relative", zIndex: 1, maxWidth: "920px", margin: "0 auto", padding: "20px 16px 60px" }}>
        <div style={{ textAlign: "center", marginBottom: "22px" }}>
          <h1 style={{ fontFamily: "'Audiowide', sans-serif", fontSize: "clamp(18px, 5vw, 32px)", color: "#fff", marginBottom: "6px", textShadow: `0 0 20px ${PINK}66` }}>Srovnávací test z matematiky</h1>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "14px" }}>Výrazy · nerovnice · absolutní hodnota · funkce · goniometrie · geometrie · analytická geometrie</p>
        </div>

        <div style={{ display: "flex", gap: "6px", justifyContent: "center", flexWrap: "wrap", marginBottom: "22px" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "8px 16px", borderRadius: "20px", border: tab === t.id ? `1px solid ${PINK}` : "1px solid rgba(255,255,255,0.12)", background: tab === t.id ? PINK + "22" : "rgba(255,255,255,0.04)", color: tab === t.id ? "#fff" : "rgba(255,255,255,0.6)", fontFamily: "'Exo 2', sans-serif", fontSize: "13.5px", fontWeight: 600, cursor: "pointer", transition: "all 0.4s ease" }}>{t.label}</button>
          ))}
        </div>

        {tab === "prehled" && <PrehledTab />}
        {tab === "vyrazy" && <VyrazyTab />}
        {tab === "nerovnice" && <NerovniceTab />}
        {tab === "abs" && <AbsTab />}
        {tab === "funkce" && <FunkceTab />}
        {tab === "iracionalni" && <IracionalniTab />}
        {tab === "gonio" && <GonioTab />}
        {tab === "geometrie" && <GeometrieTab />}
        {tab === "analyticka" && <AnalytickaTab />}
        {tab === "quiz" && <QuizEngine questions={quizQuestions} accentColor={PINK} />}
        {tab === "flashcards" && <Flashcards cards={flashcards} />}
        {tab === "formulas" && <FormulaSheet />}
      </div>
    </div>
  );
}
