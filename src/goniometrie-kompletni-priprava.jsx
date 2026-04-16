// @title Goniometrie — kompletní příprava na písemku
// @subject Math
// @topic Goniometrie: hodnoty, kružnice, grafy, rovnice, výrazy
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

function arrEqual(a, b) {
  if (!a || !b) return false;
  const sa = [...a].sort((x, y) => x - y);
  const sb = [...b].sort((x, y) => x - y);
  return sa.length === sb.length && sa.every((v, i) => v === sb[i]);
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

const TABS = [
  { id: "theory", label: "Teorie" },
  { id: "problems", label: "Příklady" },
  { id: "quiz", label: "Kvíz" },
  { id: "flashcards", label: "Kartičky" },
  { id: "formulas", label: "Vzorce" },
];

// ══════════════════════════════════════════════════════════════════
// COLLAPSIBLE SECTION
// ══════════════════════════════════════════════════════════════════
function Collapsible({ title, children, defaultOpen = false, badge }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ ...glass, padding: "0", marginBottom: "12px", overflow: "hidden" }}>
      <div onClick={() => setOpen(!open)} style={{ padding: "16px 20px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.03)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ color: "#fff", fontSize: "16px", fontWeight: 600 }}>{title}</span>
          {badge && <span style={{ fontSize: "12px", padding: "2px 10px", borderRadius: "20px", background: badge === "Easy" ? "rgba(34,197,94,0.2)" : badge === "Medium" ? "rgba(234,179,8,0.2)" : "rgba(239,68,68,0.2)", color: badge === "Easy" ? "#4ade80" : badge === "Medium" ? "#fbbf24" : "#f87171" }}>
            {badge === "Easy" ? "✨ Easy" : badge === "Medium" ? "⚡ Medium" : "🔥 Hard"}</span>}
        </div>
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "20px", transition: "transform 0.4s ease", transform: open ? "rotate(180deg)" : "rotate(0)" }}>▼</span>
      </div>
      {open && <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>{children}</div>}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// FUNCTION GRAPH (SVG)
// ══════════════════════════════════════════════════════════════════
function FunctionGraph({ funcs, xMin = -Math.PI * 2, xMax = Math.PI * 2, yMin = -3, yMax = 3, width = 520, height = 280, showPiLabels = true, title, keyPoints }) {
  const pad = { top: 28, bottom: 36, left: 42, right: 16 };
  const w = width - pad.left - pad.right;
  const h = height - pad.top - pad.bottom;
  const toX = (x) => pad.left + ((x - xMin) / (xMax - xMin)) * w;
  const toY = (y) => pad.top + ((yMax - y) / (yMax - yMin)) * h;

  // Grid lines
  const gridLines = [];
  // Horizontal
  for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
    gridLines.push(<line key={`h${y}`} x1={pad.left} x2={width - pad.right} y1={toY(y)} y2={toY(y)} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />);
  }
  // Vertical — pi multiples or integers
  if (showPiLabels) {
    const step = Math.PI / 2;
    for (let x = Math.ceil(xMin / step) * step; x <= xMax; x += step) {
      gridLines.push(<line key={`v${x.toFixed(3)}`} x1={toX(x)} x2={toX(x)} y1={pad.top} y2={height - pad.bottom} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />);
    }
  }

  // X-axis labels
  const xLabels = [];
  if (showPiLabels) {
    const step = Math.PI / 2;
    for (let x = Math.ceil(xMin / step) * step; x <= xMax + 0.01; x += step) {
      const n = Math.round(x / (Math.PI / 2));
      let label = "";
      if (n === 0) label = "0";
      else if (n === 1) label = "π/2";
      else if (n === -1) label = "−π/2";
      else if (n === 2) label = "π";
      else if (n === -2) label = "−π";
      else if (n === 4) label = "2π";
      else if (n === -4) label = "−2π";
      else if (n % 2 === 0) label = `${n/2}π`;
      else label = `${n}π/2`;
      xLabels.push(<text key={`xl${n}`} x={toX(x)} y={height - pad.bottom + 18} fill="rgba(255,255,255,0.4)" fontSize="11" textAnchor="middle" fontFamily="'JetBrains Mono', monospace">{label}</text>);
    }
  }

  // Y-axis labels
  const yLabels = [];
  for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
    yLabels.push(<text key={`yl${y}`} x={pad.left - 8} y={toY(y) + 4} fill="rgba(255,255,255,0.4)" fontSize="11" textAnchor="end" fontFamily="'JetBrains Mono', monospace">{y}</text>);
  }

  // Plot functions
  const curves = funcs.map((f, fi) => {
    const step = (xMax - xMin) / 400;
    let segments = [];
    let currentPath = [];

    for (let x = xMin; x <= xMax + step / 2; x += step) {
      const y = f.fn(x);
      if (y === undefined || y === null || !isFinite(y) || Math.abs(y) > 50) {
        if (currentPath.length > 1) segments.push(currentPath);
        currentPath = [];
      } else {
        currentPath.push([toX(x), toY(y)]);
      }
    }
    if (currentPath.length > 1) segments.push(currentPath);

    return segments.map((seg, si) => (
      <polyline
        key={`f${fi}s${si}`}
        points={seg.map(([px, py]) => `${px},${py}`).join(" ")}
        fill="none"
        stroke={f.color || PINK}
        strokeWidth={f.strokeWidth || 2.5}
        strokeLinecap="round"
        strokeDasharray={f.dash || "none"}
      />
    ));
  });

  // Key points
  const pointMarkers = (keyPoints || []).map((p, i) => {
    const px = toX(p.x);
    const py = toY(p.y);
    return (
      <g key={`kp${i}`}>
        <circle cx={px} cy={py} r={4} fill={p.color || "#22c55e"} stroke="#fff" strokeWidth="1.5" />
        {p.label && <text x={px + (p.labelOffset?.[0] || 8)} y={py + (p.labelOffset?.[1] || -8)} fill={p.color || "#22c55e"} fontSize="11" fontFamily="'JetBrains Mono', monospace">{p.label}</text>}
      </g>
    );
  });

  return (
    <div style={{ margin: "12px 0", overflowX: "auto" }}>
      {title && <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", marginBottom: "4px", fontStyle: "italic" }}>{title}</div>}
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", maxWidth: `${width}px`, height: "auto", background: "rgba(0,0,0,0.3)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)" }}>
        {gridLines}
        {/* Axes */}
        <line x1={pad.left} x2={width - pad.right} y1={toY(0)} y2={toY(0)} stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
        <line x1={toX(0)} x2={toX(0)} y1={pad.top} y2={height - pad.bottom} stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
        {curves}
        {pointMarkers}
        {xLabels}
        {yLabels}
        {/* Legend */}
        {funcs.length > 1 && funcs.map((f, i) => (
          <g key={`leg${i}`}>
            <line x1={pad.left + i * 140} x2={pad.left + i * 140 + 20} y1={12} y2={12} stroke={f.color || PINK} strokeWidth="2.5" strokeDasharray={f.dash || "none"} />
            <text x={pad.left + i * 140 + 26} y={16} fill={f.color || PINK} fontSize="12" fontFamily="'JetBrains Mono', monospace">{f.label || `f${i+1}`}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// SOLUTION REVEAL
// ══════════════════════════════════════════════════════════════════
function Solution({ children }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ marginTop: "12px" }}>
      <button onClick={() => setShow(!show)} style={{ ...btnS, fontSize: "13px", padding: "6px 16px", background: show ? "rgba(236,72,153,0.15)" : "rgba(255,255,255,0.05)", border: show ? "1px solid #ec4899" : "1px solid rgba(255,255,255,0.15)" }}>
        {show ? "Skrýt řešení" : "Zobrazit řešení"}
      </button>
      {show && <div style={{ marginTop: "12px", padding: "16px", borderRadius: "14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.85)", fontSize: "15px", lineHeight: 1.7 }}>{children}</div>}
    </div>
  );
}

function M({ children }) {
  return <span style={{ fontFamily: "'JetBrains Mono', monospace", color: CYAN, fontSize: "inherit" }}>{children}</span>;
}

function MBlock({ children }) {
  return <div style={{ fontFamily: "'JetBrains Mono', monospace", color: CYAN, fontSize: "15px", padding: "12px 16px", background: "rgba(34,211,238,0.06)", borderRadius: "10px", margin: "8px 0", lineHeight: 1.8, overflowX: "auto", whiteSpace: "pre-wrap" }}>{children}</div>;
}

function Step({ n, title, children }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <div style={{ color: PINK, fontSize: "13px", fontWeight: 700, marginBottom: "2px" }}>Krok {n}: {title}</div>
      <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "14px", lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// UNIT CIRCLE INTERACTIVE
// ══════════════════════════════════════════════════════════════════
function UnitCircle() {
  const [selectedAngle, setSelectedAngle] = useState(null);
  const angles = [
    { deg: 0, rad: "0", sin: "0", cos: "1", tg: "0", cotg: "—" },
    { deg: 30, rad: "π/6", sin: "1/2", cos: "√3/2", tg: "√3/3", cotg: "√3" },
    { deg: 45, rad: "π/4", sin: "√2/2", cos: "√2/2", tg: "1", cotg: "1" },
    { deg: 60, rad: "π/3", sin: "√3/2", cos: "1/2", tg: "√3", cotg: "√3/3" },
    { deg: 90, rad: "π/2", sin: "1", cos: "0", tg: "—", cotg: "0" },
    { deg: 120, rad: "2π/3", sin: "√3/2", cos: "−1/2", tg: "−√3", cotg: "−√3/3" },
    { deg: 135, rad: "3π/4", sin: "√2/2", cos: "−√2/2", tg: "−1", cotg: "−1" },
    { deg: 150, rad: "5π/6", sin: "1/2", cos: "−√3/2", tg: "−√3/3", cotg: "−√3" },
    { deg: 180, rad: "π", sin: "0", cos: "−1", tg: "0", cotg: "—" },
    { deg: 210, rad: "7π/6", sin: "−1/2", cos: "−√3/2", tg: "√3/3", cotg: "√3" },
    { deg: 225, rad: "5π/4", sin: "−√2/2", cos: "−√2/2", tg: "1", cotg: "1" },
    { deg: 240, rad: "4π/3", sin: "−√3/2", cos: "−1/2", tg: "√3", cotg: "√3/3" },
    { deg: 270, rad: "3π/2", sin: "−1", cos: "0", tg: "—", cotg: "0" },
    { deg: 300, rad: "5π/3", sin: "−√3/2", cos: "1/2", tg: "−√3", cotg: "−√3/3" },
    { deg: 315, rad: "7π/4", sin: "−√2/2", cos: "√2/2", tg: "−1", cotg: "−1" },
    { deg: 330, rad: "11π/6", sin: "−1/2", cos: "√3/2", tg: "−√3/3", cotg: "−√3" },
  ];

  const r = 110;
  const cx = 150, cy = 150;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", alignItems: "flex-start" }}>
      <svg viewBox="0 0 300 300" style={{ width: "280px", height: "280px", flexShrink: 0 }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        <line x1={cx - r - 15} y1={cy} x2={cx + r + 15} y2={cy} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <line x1={cx} y1={cy - r - 15} x2={cx} y2={cy + r + 15} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <text x={cx + 50} y={cy - 50} fill="rgba(255,255,255,0.15)" fontSize="14" fontWeight="bold">I.</text>
        <text x={cx - 65} y={cy - 50} fill="rgba(255,255,255,0.15)" fontSize="14" fontWeight="bold">II.</text>
        <text x={cx - 65} y={cy + 60} fill="rgba(255,255,255,0.15)" fontSize="14" fontWeight="bold">III.</text>
        <text x={cx + 50} y={cy + 60} fill="rgba(255,255,255,0.15)" fontSize="14" fontWeight="bold">IV.</text>
        {angles.map((a, i) => {
          const rad = (a.deg * Math.PI) / 180;
          const x = cx + r * Math.cos(rad);
          const y = cy - r * Math.sin(rad);
          const isSel = selectedAngle === i;
          return (
            <g key={i} onClick={() => setSelectedAngle(isSel ? null : i)} style={{ cursor: "pointer" }}>
              {isSel && <line x1={cx} y1={cy} x2={x} y2={y} stroke={PINK} strokeWidth="2" />}
              <circle cx={x} cy={y} r={isSel ? 7 : 5} fill={isSel ? PINK : CYAN} style={{ transition: "all 0.4s ease" }} />
            </g>
          );
        })}
      </svg>
      <div style={{ flex: "1 1 200px", minWidth: "200px" }}>
        {selectedAngle !== null ? (
          <div style={{ ...glass, padding: "16px" }}>
            <div style={{ color: PINK, fontWeight: 700, fontSize: "18px", marginBottom: "8px" }}>{angles[selectedAngle].deg}° = {angles[selectedAngle].rad}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
              {[["sin", angles[selectedAngle].sin], ["cos", angles[selectedAngle].cos], ["tg", angles[selectedAngle].tg], ["cotg", angles[selectedAngle].cotg]].map(([fn, val]) => (
                <div key={fn} style={{ padding: "8px", borderRadius: "8px", background: "rgba(255,255,255,0.04)", textAlign: "center" }}>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>{fn}</div>
                  <div style={{ color: "#fff", fontFamily: "'JetBrains Mono', monospace", fontSize: "16px", fontWeight: 600 }}>{val === "—" ? "nedef." : val}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", padding: "20px" }}>Klikni na bod na kružnici pro zobrazení hodnot.</div>
        )}
        <div style={{ marginTop: "12px", color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>
          <div>I. kvadrant: sin+, cos+, tg+, cotg+</div>
          <div>II. kvadrant: sin+, cos−, tg−, cotg−</div>
          <div>III. kvadrant: sin−, cos−, tg+, cotg+</div>
          <div>IV. kvadrant: sin−, cos+, tg−, cotg−</div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// THEORY TAB
// ══════════════════════════════════════════════════════════════════
function TheoryTab() {
  return (
    <div>
      <Collapsible title="1. Jednotková kružnice a hodnoty" defaultOpen={true}>
        <p style={pS}>Na jednotkové kružnici je bod <M>[cos α; sin α]</M>. Úhel měříme od kladné poloosy x proti směru hodinových ručiček.</p>
        <UnitCircle />
        <div style={{ marginTop: "16px" }}>
          <div style={{ color: PINK, fontWeight: 600, marginBottom: "8px" }}>Základní tabulka hodnot:</div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", fontFamily: "'JetBrains Mono', monospace" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
                  {["", "0", "π/6", "π/4", "π/3", "π/2"].map(h => <th key={h} style={{ padding: "8px", color: CYAN, textAlign: "center" }}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {[
                  ["sin", "0", "1/2", "√2/2", "√3/2", "1"],
                  ["cos", "1", "√3/2", "√2/2", "1/2", "0"],
                  ["tg", "0", "√3/3", "1", "√3", "—"],
                  ["cotg", "—", "√3", "1", "√3/3", "0"],
                ].map(row => (
                  <tr key={row[0]} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <td style={{ padding: "8px", color: PINK, fontWeight: 600 }}>{row[0]}</td>
                    {row.slice(1).map((v, i) => <td key={i} style={{ padding: "8px", color: v === "—" ? "rgba(255,255,255,0.3)" : "#fff", textAlign: "center" }}>{v === "—" ? "ndef." : v}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Collapsible>

      <Collapsible title="2. Převod na základní úhel">
        <p style={pS}>Velký úhel převedeme odečtením celých násobků 2π:</p>
        <MBlock>{"sin(23π/6) = sin(23π/6 − 2·2π) = sin(23π/6 − 24π/6) = sin(−π/6) = −1/2"}</MBlock>
        <p style={pS}>Záporné úhly: <M>sin(−α) = −sin α</M>, <M>cos(−α) = cos α</M></p>
        <p style={pS}>Znaménko určujeme podle kvadrantu, kde úhel leží.</p>
      </Collapsible>

      <Collapsible title="3. Dopočítávání hodnot z jedné funkce">
        <p style={pS}>Známe jednu funkci + kvadrant → dopočítáme ostatní pomocí:</p>
        <MBlock>{"sin²x + cos²x = 1\ntg x = sin x / cos x\ncotg x = cos x / sin x = 1 / tg x"}</MBlock>
        <p style={pS}><strong>Postup:</strong> Z dané funkce a identity <M>sin²x + cos²x = 1</M> určíme druhou funkci. Znaménko vybereme podle kvadrantu. Pak dopočítáme tg a cotg jako podíl.</p>
      </Collapsible>

      <Collapsible title="4. Goniometrické rovnice">
        <p style={pS}><strong>Elementární:</strong> <M>sin x = a</M> → na kružnici najdeme úhly kde sinus = a</p>
        <p style={pS}><strong>Se složeným argumentem:</strong> <M>{"cos(π/3 − 2x) = −1/2"}</M> → substituujeme <M>α = π/3 − 2x</M>, vyřešíme <M>{"cos α = −1/2"}</M>, pak zpětně dosadíme.</p>
        <p style={pS}><strong>Kvadratické (substituce):</strong> Např. <M>{"2cos²x + cos x − 1 = 0"}</M> → substituce <M>y = cos x</M> → <M>{"2y² + y − 1 = 0"}</M> → vyřešíme KR → zpětně dosadíme.</p>
        <p style={pS}><strong>Vždy:</strong> zapsat obecné řešení s parametrem <M>{"k ∈ ℤ"}</M>!</p>
      </Collapsible>

      <Collapsible title="5. Transformace grafů">
        <p style={pS}>Obecný tvar: <M>y = a · sin(b(x + c)) + d</M></p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "8px" }}>
          {[
            ["a", "Amplituda (výška)", "Násobí y-ové hodnoty, |a|"],
            ["b", "Změna periody", "Perioda = 2π/|b| (sin, cos); π/|b| (tg, cotg)"],
            ["c", "Posun po ose x", "+ doleva, − doprava"],
            ["d", "Posun po ose y", "+ nahoru, − dolů"],
          ].map(([param, name, desc]) => (
            <div key={param} style={{ padding: "10px", borderRadius: "10px", background: "rgba(255,255,255,0.04)" }}>
              <div style={{ color: PINK, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{param}</div>
              <div style={{ color: "#fff", fontSize: "13px", fontWeight: 600 }}>{name}</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>{desc}</div>
            </div>
          ))}
        </div>

        <p style={{ ...pS, marginTop: "16px", fontWeight: 600, color: "#fff" }}>Vliv parametru a (amplituda):</p>
        <FunctionGraph
          funcs={[
            { fn: (x) => Math.sin(x), color: "rgba(255,255,255,0.3)", label: "sin x", dash: "6,4" },
            { fn: (x) => 2 * Math.sin(x), color: PINK, label: "2·sin x" },
            { fn: (x) => 0.5 * Math.sin(x), color: CYAN, label: "0.5·sin x" },
          ]}
          yMin={-2.5} yMax={2.5}
          title="Amplituda mění výšku vlny"
        />

        <p style={{ ...pS, marginTop: "16px", fontWeight: 600, color: "#fff" }}>Vliv parametru b (perioda):</p>
        <FunctionGraph
          funcs={[
            { fn: (x) => Math.sin(x), color: "rgba(255,255,255,0.3)", label: "sin x", dash: "6,4" },
            { fn: (x) => Math.sin(2 * x), color: PINK, label: "sin 2x (T=π)" },
            { fn: (x) => Math.sin(x / 2), color: CYAN, label: "sin x/2 (T=4π)" },
          ]}
          yMin={-1.5} yMax={1.5}
          title="Větší b = kratší perioda, menší b = delší perioda"
        />

        <p style={{ ...pS, marginTop: "16px", fontWeight: 600, color: "#fff" }}>Vliv parametru c (posun po ose x):</p>
        <FunctionGraph
          funcs={[
            { fn: (x) => Math.sin(x), color: "rgba(255,255,255,0.3)", label: "sin x", dash: "6,4" },
            { fn: (x) => Math.sin(x + Math.PI / 2), color: PINK, label: "sin(x+π/2)" },
            { fn: (x) => Math.sin(x - Math.PI / 3), color: CYAN, label: "sin(x−π/3)" },
          ]}
          yMin={-1.5} yMax={1.5}
          title="+c posouvá doleva, −c doprava"
        />

        <p style={{ ...pS, marginTop: "16px", fontWeight: 600, color: "#fff" }}>Vliv parametru d (posun po ose y):</p>
        <FunctionGraph
          funcs={[
            { fn: (x) => Math.sin(x), color: "rgba(255,255,255,0.3)", label: "sin x", dash: "6,4" },
            { fn: (x) => Math.sin(x) + 1, color: PINK, label: "sin x + 1" },
            { fn: (x) => Math.sin(x) - 1, color: CYAN, label: "sin x − 1" },
          ]}
          yMin={-2.5} yMax={2.5}
          title="+d nahoru, −d dolů"
        />

        <p style={{ ...pS, marginTop: "12px" }}><strong>Čtení grafu:</strong> Najdi amplitudu (max−min)/2, periodu (vzdálenost dvou maxim), posun (kde je maximum místo π/2 pro sin).</p>
      </Collapsible>

      <Collapsible title="6. Úprava výrazů">
        <p style={pS}>Používáme vzorce pro dvojnásobný úhel a základní identity k zjednodušení. Často:</p>
        <MBlock>{"sin 2x = 2 sin x cos x\ncos 2x = cos²x − sin²x = 1 − 2sin²x = 2cos²x − 1\nsin²x = (1 − cos 2x)/2\ncos²x = (1 + cos 2x)/2"}</MBlock>
        <p style={pS}>Typický postup: rozložit, dosadit identity, zkrátit. Pozor na definiční obor!</p>
      </Collapsible>
    </div>
  );
}

const pS = { color: "rgba(255,255,255,0.75)", fontSize: "15px", lineHeight: 1.7, marginBottom: "8px" };

// ══════════════════════════════════════════════════════════════════
// PROBLEMS TAB
// ══════════════════════════════════════════════════════════════════
function ProblemsTab() {
  const [section, setSection] = useState(0);
  const sections = [
    "Hodnoty a kružnice",
    "Dopočítávání",
    "Rovnice (lin. arg.)",
    "Rovnice (substituce)",
    "Graf → předpis",
    "Předpis → graf",
    "Úprava výrazů",
  ];

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
        {sections.map((s, i) => (
          <button key={i} onClick={() => setSection(i)} style={{ ...btnS, fontSize: "13px", padding: "6px 14px", background: section === i ? PINK + "33" : "rgba(255,255,255,0.05)", border: section === i ? `1px solid ${PINK}` : "1px solid rgba(255,255,255,0.12)" }}>{s}</button>
        ))}
      </div>

      {section === 0 && <ProblemsHodnoty />}
      {section === 1 && <ProblemsDopocitavani />}
      {section === 2 && <ProblemsRovniceLinArg />}
      {section === 3 && <ProblemsRovniceSubstituce />}
      {section === 4 && <ProblemsGrafNaPredpis />}
      {section === 5 && <ProblemsPredpisNaGraf />}
      {section === 6 && <ProblemsVyrazy />}
    </div>
  );
}

function ProblemsHodnoty() {
  return (
    <div>
      <Collapsible title="Př. 1: Vypočítejte sin(23π/6)" badge="Easy" defaultOpen={true}>
        <MBlock>{"sin(23π/6) = ?"}</MBlock>
        <Solution>
          <Step n={1} title="Převod na základní úhel">
            <MBlock>{"23π/6 − 2π = 23π/6 − 12π/6 = 11π/6\n11π/6 − 2π = 11π/6 − 12π/6 = −π/6"}</MBlock>
          </Step>
          <Step n={2} title="Vyhodnocení">
            <MBlock>{"sin(−π/6) = −sin(π/6) = −1/2"}</MBlock>
          </Step>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>Výsledek: sin(23π/6) = −1/2</div>
        </Solution>
      </Collapsible>

      <Collapsible title="Př. 2: Vypočítejte (sin(11π/3) + cos(3π/4))²" badge="Medium">
        <MBlock>{"(sin(11π/3) + cos(3π/4))² = ?"}</MBlock>
        <Solution>
          <Step n={1} title="Převod úhlů">
            <MBlock>{"11π/3 − 2π = 11π/3 − 6π/3 = 5π/3\nsin(5π/3) = −√3/2\n\ncos(3π/4) = −√2/2"}</MBlock>
          </Step>
          <Step n={2} title="Dosazení a výraz">
            <MBlock>{"(−√3/2 + (−√2/2))² = (−√3/2 − √2/2)²\n= ((√3 + √2)/2)²\n= (3 + 2√6 + 2)/4\n= (5 + 2√6)/4"}</MBlock>
          </Step>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>Výsledek: (5 + 2√6)/4</div>
        </Solution>
      </Collapsible>

      <Collapsible title="Př. 3: Vypočítejte (sin(23π/6) − 1) / cotg(−π/3)" badge="Hard">
        <p style={pS}>Toto je příklad z cvičného testu!</p>
        <MBlock>{"(sin(23π/6) − 1) / cotg(−π/3) = ?"}</MBlock>
        <Solution>
          <Step n={1} title="Čitatel">
            <MBlock>{"sin(23π/6) = −1/2 (viz předchozí)\nčitatel = −1/2 − 1 = −3/2"}</MBlock>
          </Step>
          <Step n={2} title="Jmenovatel">
            <MBlock>{"cotg(−π/3) = −cotg(π/3) = −√3/3"}</MBlock>
          </Step>
          <Step n={3} title="Podíl">
            <MBlock>{"(−3/2) / (−√3/3) = (−3/2) · (−3/√3)\n= 9/(2√3) = 9√3/6 = 3√3/2"}</MBlock>
          </Step>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>Výsledek: 3√3/2</div>
        </Solution>
      </Collapsible>

      <Collapsible title="Př. 4: sin(7π/6) · cos(π/3)" badge="Easy">
        <MBlock>{"sin(7π/6) · cos(π/3) = ?"}</MBlock>
        <Solution>
          <Step n={1} title="Hodnoty">
            <MBlock>{"sin(7π/6) = −1/2  (III. kvadrant, ref. úhel π/6)\ncos(π/3) = 1/2"}</MBlock>
          </Step>
          <Step n={2} title="Součin">
            <MBlock>{"(−1/2) · (1/2) = −1/4"}</MBlock>
          </Step>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>Výsledek: −1/4</div>
        </Solution>
      </Collapsible>

      <Collapsible title="Př. 5: Určete úhel α = −22π/3 na kružnici" badge="Medium">
        <MBlock>{"α = −22π/3, najděte referenční úhel a k"}</MBlock>
        <Solution>
          <Step n={1} title="Převod">
            <MBlock>{"α = 2π/3 + k·2π\n−22π/3 = 2π/3 + k·2π\n−22π/3 − 2π/3 = k·2π\n−24π/3 = k·2π\n−8π = k·2π\nk = −4"}</MBlock>
          </Step>
          <Step n={2} title="Ověření">
            <MBlock>{"2π/3 + (−4)·2π = 2π/3 − 8π = 2π/3 − 24π/3 = −22π/3 ✓"}</MBlock>
          </Step>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>Úhel leží na 2π/3 (120°), k = −4</div>
        </Solution>
      </Collapsible>
    </div>
  );
}

function ProblemsDopocitavani() {
  return (
    <div>
      <Collapsible title="Př. 1: cotg x = √39/6, x ∈ (π, 3π/2)" badge="Hard" defaultOpen={true}>
        <p style={pS}>Z cvičného testu! Aniž spočítáte x, určete sin x, cos x, tg x.</p>
        <MBlock>{"cotg x = √39/6,  π < x < 3π/2  (III. kvadrant)"}</MBlock>
        <Solution>
          <Step n={1} title="tg x z cotg x">
            <MBlock>{"tg x = 1/cotg x = 6/√39 = 6√39/39"}</MBlock>
          </Step>
          <Step n={2} title="Použijeme 1 + cotg²x = 1/sin²x">
            <MBlock>{"1 + (√39/6)² = 1/sin²x\n1 + 39/36 = 1/sin²x\n75/36 = 1/sin²x\nsin²x = 36/75 = 12/25"}</MBlock>
          </Step>
          <Step n={3} title="Znaménko z kvadrantu">
            <MBlock>{"III. kvadrant: sin < 0, cos < 0\nsin x = −2√3/5"}</MBlock>
          </Step>
          <Step n={4} title="cos x z identity">
            <MBlock>{"cos²x = 1 − 12/25 = 13/25\ncos x = −√13/5  (III. kvadrant, záporné)"}</MBlock>
          </Step>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>sin x = −2√3/5, cos x = −√13/5, tg x = 6√39/39</div>
        </Solution>
      </Collapsible>

      <Collapsible title="Př. 2: tg x = −√2, x ∈ II. kvadrant" badge="Medium">
        <MBlock>{"tg x = −√2, x ∈ II. kv. Určete sin x, cos x, cotg x."}</MBlock>
        <Solution>
          <Step n={1} title="cotg x">
            <MBlock>{"cotg x = 1/tg x = −1/√2 = −√2/2"}</MBlock>
          </Step>
          <Step n={2} title="Z identity sin²x + cos²x = 1 a tg x = sin x/cos x">
            <MBlock>{"sin x = −√2 · cos x\n(−√2 cos x)² + cos²x = 1\n2cos²x + cos²x = 1\n3cos²x = 1\ncos x = −√3/3  (II. kv. → cos < 0)"}</MBlock>
          </Step>
          <Step n={3} title="sin x">
            <MBlock>{"sin x = −√2 · (−√3/3) = √6/3"}</MBlock>
          </Step>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>sin x = √6/3, cos x = −√3/3, cotg x = −√2/2</div>
        </Solution>
      </Collapsible>

      <Collapsible title="Př. 3: cotg x = −1/3, x ∈ IV. kvadrant" badge="Medium">
        <MBlock>{"cotg x = −1/3, x ∈ IV. kv. Určete sin x, cos x."}</MBlock>
        <Solution>
          <Step n={1} title="tg x a vyjádříme cos x přes sin x">
            <MBlock>{"tg x = −3, tj. sin x / cos x = −3\ncos x = (−1/3) · sin x"}</MBlock>
          </Step>
          <Step n={2} title="Dosazení do identity">
            <MBlock>{"sin²x + (1/9)sin²x = 1\n(10/9)sin²x = 1\nsin²x = 9/10\nsin x = −3√10/10  (IV. kv. → sin < 0)"}</MBlock>
          </Step>
          <Step n={3} title="cos x">
            <MBlock>{"cos x = √10/10  (IV. kv. → cos > 0)"}</MBlock>
          </Step>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>sin x = −3√10/10, cos x = √10/10</div>
        </Solution>
      </Collapsible>
    </div>
  );
}

function ProblemsRovniceLinArg() {
  return (
    <div>
      <Collapsible title="Př. 1: cos(π/4 − x) = 1" badge="Easy" defaultOpen={true}>
        <p style={pS}>Z cvičného testu!</p>
        <MBlock>{"cos(π/4 − x) = 1 v ℝ"}</MBlock>
        <Solution>
          <Step n={1} title="Kdy cos = 1?">
            <MBlock>{"cos α = 1 ⇔ α = 2kπ, k ∈ ℤ"}</MBlock>
          </Step>
          <Step n={2} title="Dosazení">
            <MBlock>{"π/4 − x = 2kπ\n−x = −π/4 + 2kπ\nx = π/4 − 2kπ"}</MBlock>
          </Step>
          <Step n={3} title="Ekvivalentní zápis">
            <MBlock>{"x = π/4 + 2kπ, k ∈ ℤ"}</MBlock>
            <p style={pS}>(protože −2kπ a +2kπ pokrývají stejná čísla při k ∈ ℤ)</p>
          </Step>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>x = π/4 + 2kπ, k ∈ ℤ</div>
        </Solution>
      </Collapsible>

      <Collapsible title="Př. 2: cos(π/3 − 2x) = −1/2" badge="Medium">
        <MBlock>{"cos(π/3 − 2x) = −1/2 v ℝ"}</MBlock>
        <Solution>
          <Step n={1} title="Substituce">
            <MBlock>{"α = π/3 − 2x\ncos α = −1/2\nα₁ = 2π/3 + 2kπ\nα₂ = 4π/3 + 2kπ"}</MBlock>
          </Step>
          <Step n={2} title="Zpětná substituce (větev 1)">
            <MBlock>{"π/3 − 2x = 2π/3 + 2kπ\n−2x = π/3 + 2kπ\nx = −π/6 − kπ"}</MBlock>
          </Step>
          <Step n={3} title="Zpětná substituce (větev 2)">
            <MBlock>{"π/3 − 2x = 4π/3 + 2kπ\n−2x = π + 2kπ\nx = −π/2 − kπ"}</MBlock>
          </Step>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>x₁ = −π/6 − kπ, x₂ = −π/2 − kπ, k ∈ ℤ</div>
          <p style={pS}>Ekvivalentně: x₁ = 5π/6 + kπ, x₂ = π/2 + kπ</p>
        </Solution>
      </Collapsible>

      <Collapsible title="Př. 3: sin(2x) = √3/2 na ⟨0, 2π)" badge="Medium">
        <MBlock>{"sin(2x) = √3/2, x ∈ ⟨0, 2π)"}</MBlock>
        <Solution>
          <Step n={1} title="Substituce α = 2x">
            <MBlock>{"sin α = √3/2\nα₁ = π/3 + 2kπ\nα₂ = 2π/3 + 2kπ"}</MBlock>
          </Step>
          <Step n={2} title="Zpět na x">
            <MBlock>{"x₁ = π/6 + kπ\nx₂ = π/3 + kπ"}</MBlock>
          </Step>
          <Step n={3} title="Výběr z intervalu ⟨0, 2π)">
            <MBlock>{"k=0: x = π/6, π/3\nk=1: x = 7π/6, 4π/3"}</MBlock>
          </Step>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{"K = {π/6, π/3, 7π/6, 4π/3}"}</div>
        </Solution>
      </Collapsible>

      <Collapsible title="Př. 4: tg(2x + π/4) = √3/3" badge="Hard">
        <MBlock>{"tg(2x + π/4) = √3/3 v ℝ"}</MBlock>
        <Solution>
          <Step n={1} title="Substituce a řešení">
            <MBlock>{"tg α = √3/3 ⇔ α = π/6 + kπ\n(perioda tg je π)"}</MBlock>
          </Step>
          <Step n={2} title="Zpětná substituce">
            <MBlock>{"2x + π/4 = π/6 + kπ\n2x = π/6 − π/4 + kπ\n2x = (2π − 3π)/12 + kπ\n2x = −π/12 + kπ\nx = −π/24 + kπ/2"}</MBlock>
          </Step>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>x = −π/24 + kπ/2 = π(12k − 1)/24, k ∈ ℤ</div>
        </Solution>
      </Collapsible>

      <Collapsible title="Př. 5: cos(x + π/6) = −1 v ℝ" badge="Easy">
        <MBlock>{"cos(x + π/6) = −1"}</MBlock>
        <Solution>
          <Step n={1} title="Kdy cos = −1?">
            <MBlock>{"cos α = −1 ⇔ α = π + 2kπ"}</MBlock>
          </Step>
          <Step n={2} title="Dosazení">
            <MBlock>{"x + π/6 = π + 2kπ\nx = 5π/6 + 2kπ"}</MBlock>
          </Step>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>x = 5π/6 + 2kπ, k ∈ ℤ</div>
        </Solution>
      </Collapsible>

      <Collapsible title="Př. 6: sin(x − π/4) = 1/2 v ℝ" badge="Medium">
        <MBlock>{"sin(x − π/4) = 1/2"}</MBlock>
        <Solution>
          <Step n={1} title="Řešení pro sin α = 1/2">
            <MBlock>{"α₁ = π/6 + 2kπ\nα₂ = 5π/6 + 2kπ"}</MBlock>
          </Step>
          <Step n={2} title="Zpětná substituce">
            <MBlock>{"x − π/4 = π/6 + 2kπ → x = 5π/12 + 2kπ\nx − π/4 = 5π/6 + 2kπ → x = 13π/12 + 2kπ"}</MBlock>
          </Step>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>x₁ = 5π/12 + 2kπ, x₂ = 13π/12 + 2kπ, k ∈ ℤ</div>
        </Solution>
      </Collapsible>
    </div>
  );
}

function ProblemsRovniceSubstituce() {
  return (
    <div>
      <Collapsible title="Př. 1: 2 + cos 2x = −5 sin x" badge="Hard" defaultOpen={true}>
        <p style={pS}>Z cvičného testu!</p>
        <MBlock>{"2 + cos 2x = −5 sin x"}</MBlock>
        <Solution>
          <Step n={1} title="Použijeme cos 2x = 1 − 2sin²x">
            <MBlock>{"2 + 1 − 2sin²x = −5 sin x\n−2sin²x + 5 sin x + 3 = 0\n2sin²x − 5 sin x − 3 = 0"}</MBlock>
          </Step>
          <Step n={2} title="Substituce y = sin x">
            <MBlock>{"2y² − 5y − 3 = 0\nD = 25 + 24 = 49\ny = (5 ± 7)/4\ny₁ = 3, y₂ = −1/2"}</MBlock>
          </Step>
          <Step n={3} title="Zpětná substituce">
            <MBlock>{"sin x = 3 → nemá řešení (|sin x| ≤ 1)\nsin x = −1/2\nx₁ = 7π/6 + 2kπ\nx₂ = 11π/6 + 2kπ"}</MBlock>
          </Step>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>x₁ = 7π/6 + 2kπ, x₂ = 11π/6 + 2kπ, k ∈ ℤ</div>
        </Solution>
      </Collapsible>

      <Collapsible title="Př. 2: 2cos²x + cos x − 1 = 0" badge="Medium">
        <MBlock>{"2cos²x + cos x − 1 = 0"}</MBlock>
        <Solution>
          <Step n={1} title="Substituce y = cos x">
            <MBlock>{"2y² + y − 1 = 0\nD = 1 + 8 = 9\ny = (−1 ± 3)/4\ny₁ = 1/2, y₂ = −1"}</MBlock>
          </Step>
          <Step n={2} title="Zpětná substituce">
            <MBlock>{"cos x = 1/2: x₁ = π/3 + 2kπ, x₂ = 5π/3 + 2kπ\ncos x = −1: x₃ = π + 2kπ"}</MBlock>
          </Step>
          <Step n={3} title="Ověření na ⟨0, 2π)">
            <MBlock>{"K = {π/3, π, 5π/3}"}</MBlock>
          </Step>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>x = π/3 + 2kπ, 5π/3 + 2kπ, π + 2kπ, k ∈ ℤ</div>
        </Solution>
      </Collapsible>

      <Collapsible title="Př. 3: sin²x = 2 sin x" badge="Easy">
        <MBlock>{"sin²x = 2 sin x"}</MBlock>
        <Solution>
          <Step n={1} title="Úprava a substituce a = sin x">
            <MBlock>{"a² − 2a = 0\na(a − 2) = 0\na₁ = 0, a₂ = 2"}</MBlock>
          </Step>
          <Step n={2} title="Zpětná substituce">
            <MBlock>{"sin x = 0 → x = kπ\nsin x = 2 → nemá řešení"}</MBlock>
          </Step>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>x = kπ, k ∈ ℤ</div>
        </Solution>
      </Collapsible>

      <Collapsible title="Př. 4: 6sin²x − 7cos x − 1 = 0" badge="Hard">
        <MBlock>{"6sin²x − 7cos x − 1 = 0"}</MBlock>
        <Solution>
          <Step n={1} title="Převod sin²x = 1 − cos²x">
            <MBlock>{"6(1 − cos²x) − 7cos x − 1 = 0\n−6cos²x − 7cos x + 5 = 0\n6cos²x + 7cos x − 5 = 0"}</MBlock>
          </Step>
          <Step n={2} title="Substituce a = cos x">
            <MBlock>{"6a² + 7a − 5 = 0\nD = 49 + 120 = 169\na = (−7 ± 13)/12\na₁ = 1/2, a₂ = −20/12 (✗, mimo rozsah)"}</MBlock>
          </Step>
          <Step n={3} title="Zpětná substituce">
            <MBlock>{"cos x = 1/2\nx₁ = π/3 + 2kπ\nx₂ = 5π/3 + 2kπ"}</MBlock>
          </Step>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>x = ±π/3 + 2kπ, k ∈ ℤ</div>
        </Solution>
      </Collapsible>

      <Collapsible title="Př. 5: sin²x + 5 sin x + 4 = 0" badge="Medium">
        <MBlock>{"sin²x + 5 sin x + 4 = 0"}</MBlock>
        <Solution>
          <Step n={1} title="Substituce y = sin x">
            <MBlock>{"y² + 5y + 4 = 0\n(y + 1)(y + 4) = 0\ny₁ = −1, y₂ = −4"}</MBlock>
          </Step>
          <Step n={2} title="Zpětná substituce">
            <MBlock>{"sin x = −1 → x = 3π/2 + 2kπ\nsin x = −4 → nemá řešení"}</MBlock>
          </Step>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>x = 3π/2 + 2kπ, k ∈ ℤ</div>
        </Solution>
      </Collapsible>

      <Collapsible title="Př. 6: cos 2x + sin x = 0" badge="Medium">
        <MBlock>{"cos 2x + sin x = 0"}</MBlock>
        <Solution>
          <Step n={1} title="cos 2x = 1 − 2sin²x">
            <MBlock>{"1 − 2sin²x + sin x = 0\n2sin²x − sin x − 1 = 0"}</MBlock>
          </Step>
          <Step n={2} title="Substituce y = sin x">
            <MBlock>{"2y² − y − 1 = 0\ny = (1 ± 3)/4\ny₁ = 1, y₂ = −1/2"}</MBlock>
          </Step>
          <Step n={3} title="Zpětná substituce">
            <MBlock>{"sin x = 1 → x = π/2 + 2kπ\nsin x = −1/2 → x = 7π/6 + 2kπ nebo x = 11π/6 + 2kπ"}</MBlock>
          </Step>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>x = π/2 + 2kπ, 7π/6 + 2kπ, 11π/6 + 2kπ</div>
        </Solution>
      </Collapsible>

      <Collapsible title="Př. 7: sin 2x · cos x + sin²x = 1" badge="Hard">
        <MBlock>{"sin 2x · cos x + sin²x = 1"}</MBlock>
        <Solution>
          <Step n={1} title="sin 2x = 2 sin x cos x">
            <MBlock>{"2 sin x cos²x + sin²x = 1\nAle sin²x + cos²x = 1, tak přepis:\n2 sin x cos²x + sin²x = sin²x + cos²x\n2 sin x cos²x = cos²x\ncos²x(2 sin x − 1) = 0"}</MBlock>
          </Step>
          <Step n={2} title="Rozklad na součin">
            <MBlock>{"cos²x = 0 → cos x = 0 → x = π/2 + kπ\n2 sin x − 1 = 0 → sin x = 1/2 → x = π/6 + 2kπ, 5π/6 + 2kπ"}</MBlock>
          </Step>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>x = π/2 + kπ, π/6 + 2kπ, 5π/6 + 2kπ, k ∈ ℤ</div>
        </Solution>
      </Collapsible>
    </div>
  );
}

function ProblemsGrafNaPredpis() {
  return (
    <div>
      <Collapsible title="Př. 1: Sinusoida z cvičného testu" badge="Medium" defaultOpen={true}>
        <p style={pS}>Graf z testu: sinusoida, minima v −2, maxima v 0, neprocházím počátkem, perioda = π.</p>
        <FunctionGraph
          funcs={[{ fn: (x) => -Math.cos(2 * x) - 1, color: PINK, label: "y = −cos(2x) − 1" }]}
          yMin={-2.5} yMax={0.8}
          keyPoints={[
            { x: 0, y: -2, label: "(0, −2)", color: "#fbbf24", labelOffset: [8, 14] },
            { x: Math.PI / 4, y: 0, label: "(π/4, 0)", color: "#22c55e", labelOffset: [6, -8] },
            { x: Math.PI / 2, y: -2, label: "(π/2, −2)", color: "#fbbf24", labelOffset: [6, 14] },
            { x: 3 * Math.PI / 4, y: 0, label: "(3π/4, 0)", color: "#22c55e", labelOffset: [-60, -8] },
          ]}
          title="Zadaný graf — urči předpis"
        />
        <Solution>
          <Step n={1} title="Amplituda">
            <MBlock>{"a = (max − min)/2 = (0 − (−2))/2 = 1"}</MBlock>
          </Step>
          <Step n={2} title="Vertikální posun">
            <MBlock>{"d = (max + min)/2 = (0 + (−2))/2 = −1"}</MBlock>
          </Step>
          <Step n={3} title="Perioda a b">
            <MBlock>{"T = π, b = 2π/T = 2"}</MBlock>
          </Step>
          <Step n={4} title="Fáze (horizontální posun)">
            <MBlock>{"Maximum je v x = π/4 (místo 0 pro −cos)\ny = −cos(2x) − 1  nebo  y = cos(2x + π) − 1"}</MBlock>
          </Step>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>y = −cos(2x) − 1</div>
        </Solution>
      </Collapsible>

      <Collapsible title="Př. 2: Sinusoida s body (−π/3, 4) a (5π/3, −4)" badge="Hard">
        <p style={pS}>Maximum 4, minimum −4, nulové body v 2π/3 a 8π/3.</p>
        <FunctionGraph
          funcs={[{ fn: (x) => 4 * Math.cos(x / 2 + Math.PI / 6), color: PINK, label: "y = 4cos(x/2 + π/6)" }]}
          xMin={-Math.PI * 2} xMax={Math.PI * 3} yMin={-5} yMax={5}
          keyPoints={[
            { x: -Math.PI / 3, y: 4, label: "(−π/3, 4)", color: "#22c55e", labelOffset: [6, -10] },
            { x: 5 * Math.PI / 3, y: -4, label: "(5π/3, −4)", color: "#ef4444", labelOffset: [6, 14] },
          ]}
          title="Zadaný graf — urči předpis"
        />
        <Solution>
          <Step n={1} title="Amplituda a perioda">
            <MBlock>{"a = 4\nVzdálenost dvou po sobě jdoucích maxim: 11π/3 − (−π/3) = 4π\nT = 4π, b = 2π/T = 1/2"}</MBlock>
          </Step>
          <Step n={2} title="Posun">
            <MBlock>{"Max v x = −π/3. Pro cos je max při arg = 0:\nx/2 + c = 0 → (−π/3)/2 + c = 0\n−π/6 + c = 0 → c = π/6\ny = 4cos(x/2 + π/6)"}</MBlock>
          </Step>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>y = 4cos(x/2 + π/6)</div>
        </Solution>
      </Collapsible>

      <Collapsible title="Př. 3: Obecný postup čtení grafu" badge="Easy">
        <p style={pS}>Jak rozpoznat y = a·sin(b(x+c)) + d z grafu:</p>
        <Solution>
          <Step n={1} title="Amplituda a = (max − min) / 2">
            <MBlock>{"Přečteme maximum a minimum z grafu."}</MBlock>
          </Step>
          <Step n={2} title="Vertikální posun d = (max + min) / 2">
            <MBlock>{"Pokud d = 0, graf osciluje symetricky kolem osy x."}</MBlock>
          </Step>
          <Step n={3} title="Perioda T a koeficient b">
            <MBlock>{"T = vzdálenost dvou po sobě jdoucích maxim\nb = 2π / T (pro sin, cos)\nb = π / T (pro tg, cotg)"}</MBlock>
          </Step>
          <Step n={4} title="Fáze c">
            <MBlock>{"Najdi x-ovou souřadnici maxima.\nPro y = sin: max je v b(x+c) = π/2\nPro y = cos: max je v b(x+c) = 0\nZ toho vypočtete c."}</MBlock>
          </Step>
        </Solution>
      </Collapsible>
    </div>
  );
}

function ProblemsPredpisNaGraf() {
  return (
    <div>
      <Collapsible title="Př. 1: y = sin(x + 2π/3)" badge="Easy" defaultOpen={true}>
        <MBlock>{"y = sin(x + 2π/3)"}</MBlock>
        <Solution>
          <Step n={1} title="Identifikace transformací">
            <MBlock>{"Základní funkce: y = sin x\nPosun o 2π/3 DOLEVA (vnitřní +)\nAmplituda = 1, perioda = 2π"}</MBlock>
          </Step>
          <Step n={2} title="Klíčové body">
            <MBlock>{"sin x má max v π/2.\nPosunutý max: π/2 − 2π/3 = −π/6\nNuly: −2π/3 (start), π/3 (střed), 4π/3\nMin: −π/6 + π = 5π/6"}</MBlock>
          </Step>
          <FunctionGraph
            funcs={[
              { fn: (x) => Math.sin(x), color: "rgba(255,255,255,0.25)", label: "sin x", dash: "6,4" },
              { fn: (x) => Math.sin(x + 2 * Math.PI / 3), color: PINK, label: "sin(x + 2π/3)" },
            ]}
            yMin={-1.5} yMax={1.5}
            keyPoints={[
              { x: -Math.PI / 6, y: 1, label: "(−π/6, 1)", color: "#22c55e", labelOffset: [6, -8] },
              { x: Math.PI / 3, y: 0, label: "(π/3, 0)", color: "#fbbf24", labelOffset: [6, -8] },
              { x: 5 * Math.PI / 6, y: -1, label: "(5π/6, −1)", color: "#ef4444", labelOffset: [6, 14] },
            ]}
            title="Výsledný graf — posun sin x doleva o 2π/3"
          />
        </Solution>
      </Collapsible>

      <Collapsible title="Př. 2: y = −cos(2x)" badge="Easy">
        <MBlock>{"y = −cos(2x)"}</MBlock>
        <Solution>
          <Step n={1} title="Transformace">
            <MBlock>{"1. cos(x) → cos(2x): perioda 2π/2 = π\n2. −cos(2x): zrcadlení přes osu x\nAmplituda = 1"}</MBlock>
          </Step>
          <Step n={2} title="Klíčové body">
            <MBlock>{"cos(2x) má max v x=0.\n−cos(2x) má MIN v x=0: (0, −1)\nNuly: π/4, 3π/4\nMax: π/2: (π/2, 1)"}</MBlock>
          </Step>
          <FunctionGraph
            funcs={[
              { fn: (x) => Math.cos(x), color: "rgba(255,255,255,0.25)", label: "cos x", dash: "6,4" },
              { fn: (x) => -Math.cos(2 * x), color: PINK, label: "−cos(2x)" },
            ]}
            yMin={-1.5} yMax={1.5}
            keyPoints={[
              { x: 0, y: -1, label: "(0, −1)", color: "#ef4444", labelOffset: [6, 14] },
              { x: Math.PI / 4, y: 0, label: "(π/4, 0)", color: "#fbbf24", labelOffset: [6, -8] },
              { x: Math.PI / 2, y: 1, label: "(π/2, 1)", color: "#22c55e", labelOffset: [6, -8] },
            ]}
            title="Výsledný graf — perioda π, zrcadlení přes osu x"
          />
        </Solution>
      </Collapsible>

      <Collapsible title="Př. 3: y = 2cos(2x − π/4)" badge="Medium">
        <MBlock>{"y = 2cos(2x − π/4) = 2cos(2(x − π/8))"}</MBlock>
        <Solution>
          <Step n={1} title="Rozklad parametrů">
            <MBlock>{"a = 2 (amplituda)\nb = 2 → T = π\nc = −π/8 (posun doprava o π/8)\nd = 0"}</MBlock>
          </Step>
          <Step n={2} title="Klíčové body">
            <MBlock>{"Max (cos arg = 0): 2(x − π/8) = 0 → x = π/8: (π/8, 2)\nNula: x = π/8 + π/4 = 3π/8\nMin: x = π/8 + π/2 = 5π/8: (5π/8, −2)"}</MBlock>
          </Step>
          <FunctionGraph
            funcs={[
              { fn: (x) => Math.cos(x), color: "rgba(255,255,255,0.25)", label: "cos x", dash: "6,4" },
              { fn: (x) => 2 * Math.cos(2 * x - Math.PI / 4), color: PINK, label: "2cos(2x−π/4)" },
            ]}
            yMin={-2.5} yMax={2.5}
            keyPoints={[
              { x: Math.PI / 8, y: 2, label: "(π/8, 2)", color: "#22c55e", labelOffset: [6, -8] },
              { x: 3 * Math.PI / 8, y: 0, label: "(3π/8, 0)", color: "#fbbf24", labelOffset: [6, -8] },
              { x: 5 * Math.PI / 8, y: -2, label: "(5π/8, −2)", color: "#ef4444", labelOffset: [6, 14] },
            ]}
            title="Výsledný graf — amplituda 2, perioda π, posun doprava π/8"
          />
        </Solution>
      </Collapsible>

      <Collapsible title="Př. 4: y = −tg(x/2)" badge="Medium">
        <MBlock>{"y = −tg(x/2)"}</MBlock>
        <Solution>
          <Step n={1} title="Transformace">
            <MBlock>{"tg(x/2): perioda = π/(1/2) = 2π\n−tg: zrcadlení přes osu x\nAsymptoty kde x/2 = π/2 + kπ → x = π + 2kπ"}</MBlock>
          </Step>
          <Step n={2} title="Klíčové body">
            <MBlock>{"Nula: x = 0 (a každých 2π)\nAsymptoty: x = ±π, ±3π, ...\nKlesající (protože mínus) na (−π, π)"}</MBlock>
          </Step>
          <FunctionGraph
            funcs={[
              { fn: (x) => { const v = -Math.tan(x / 2); return Math.abs(v) > 8 ? undefined : v; }, color: PINK, label: "−tg(x/2)" },
            ]}
            yMin={-4} yMax={4}
            keyPoints={[
              { x: 0, y: 0, label: "(0, 0)", color: "#fbbf24", labelOffset: [8, -8] },
            ]}
            title="Výsledný graf — perioda 2π, asymptoty v x = ±π"
          />
        </Solution>
      </Collapsible>

      <Collapsible title="Př. 5: y = cotg(2x + π) − 1" badge="Hard">
        <MBlock>{"y = cotg(2x + π) − 1 = cotg(2(x + π/2)) − 1"}</MBlock>
        <Solution>
          <Step n={1} title="Transformace">
            <MBlock>{"cotg(2x): perioda = π/2\nPozn: cotg(x + π) = cotg x (perioda cotg je π)\nTakže cotg(2x + π) = cotg(2x)\ny = cotg(2x) − 1"}</MBlock>
          </Step>
          <Step n={2} title="Klíčové body">
            <MBlock>{"Asymptoty: 2x = kπ → x = kπ/2\nNula cotg: 2x = π/2 + kπ → x = π/4 + kπ/2\nPosun −1 posouvá celý graf dolů o 1"}</MBlock>
          </Step>
          <FunctionGraph
            funcs={[
              { fn: (x) => { const v = 1 / Math.tan(2 * x) - 1; return Math.abs(v) > 8 ? undefined : v; }, color: PINK, label: "cotg(2x) − 1" },
            ]}
            xMin={-Math.PI} xMax={Math.PI} yMin={-5} yMax={5}
            keyPoints={[
              { x: Math.PI / 4, y: -1, label: "(π/4, −1)", color: "#fbbf24", labelOffset: [6, 14] },
            ]}
            title="Výsledný graf — perioda π/2, posun dolů o 1"
          />
        </Solution>
      </Collapsible>
    </div>
  );
}

function ProblemsVyrazy() {
  return (
    <div>
      <Collapsible title="Př. 1: (sin x + sin 2x) / (1 + cos x + cos 2x)" badge="Hard" defaultOpen={true}>
        <p style={pS}>Z cvičného testu!</p>
        <MBlock>{"(sin x + sin 2x) / (1 + cos x + cos 2x) = ?"}</MBlock>
        <Solution>
          <Step n={1} title="Rozepsání dvojnásobných úhlů">
            <MBlock>{"Čitatel: sin x + 2 sin x cos x = sin x(1 + 2 cos x)\nJmenovatel: 1 + cos x + (2cos²x − 1) = cos x + 2cos²x = cos x(1 + 2 cos x)"}</MBlock>
          </Step>
          <Step n={2} title="Zkrácení">
            <MBlock>{"sin x(1 + 2 cos x) / (cos x(1 + 2 cos x))\n= sin x / cos x = tg x"}</MBlock>
          </Step>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>Výsledek: tg x</div>
          <p style={pS}>Podmínka: cos x ≠ 0 a 1 + 2cos x ≠ 0, tj. x ≠ π/2 + kπ a x ≠ ±2π/3 + 2kπ</p>
        </Solution>
      </Collapsible>

      <Collapsible title="Př. 2: (cotg x − tg x) / (cotg x + tg x)" badge="Hard">
        <p style={pS}>Z cvičného testu!</p>
        <MBlock>{"(cotg x − tg x) / (cotg x + tg x) = ?"}</MBlock>
        <Solution>
          <Step n={1} title="Přepis na sin a cos">
            <MBlock>{"cotg x = cos x/sin x, tg x = sin x/cos x\n\nČitatel: cos x/sin x − sin x/cos x\n= (cos²x − sin²x)/(sin x cos x)\n= cos 2x / (sin x cos x)\n\nJmenovatel: cos x/sin x + sin x/cos x\n= (cos²x + sin²x)/(sin x cos x)\n= 1/(sin x cos x)"}</MBlock>
          </Step>
          <Step n={2} title="Podíl">
            <MBlock>{"[cos 2x/(sin x cos x)] / [1/(sin x cos x)]\n= cos 2x"}</MBlock>
          </Step>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>Výsledek: cos 2x</div>
        </Solution>
      </Collapsible>

      <Collapsible title="Př. 3: (cos²x − cos 2x) / sin 2x = (1/2) tg x" badge="Medium">
        <p style={pS}>Dokažte rovnost a určete podmínku.</p>
        <MBlock>{"(cos²x − cos 2x) / sin 2x = (1/2) tg x"}</MBlock>
        <Solution>
          <Step n={1} title="Levá strana">
            <MBlock>{"cos 2x = cos²x − sin²x\nL = (cos²x − (cos²x − sin²x)) / (2 sin x cos x)\n= sin²x / (2 sin x cos x)\n= sin x / (2 cos x)\n= (1/2) tg x ✓"}</MBlock>
          </Step>
          <Step n={2} title="Podmínka">
            <MBlock>{"sin 2x ≠ 0 → x ≠ kπ/2\nD = ℝ \\ {k·π/2; k ∈ ℤ}"}</MBlock>
          </Step>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>Dokázáno. D: x ≠ kπ/2</div>
        </Solution>
      </Collapsible>

      <Collapsible title="Př. 4: sin 2x/(1 + cos 2x) + (1 − cos 2x)/sin 2x = 2 tg x" badge="Hard">
        <MBlock>{"sin 2x/(1 + cos 2x) + (1 − cos 2x)/sin 2x = 2 tg x"}</MBlock>
        <Solution>
          <Step n={1} title="Dosazení vzorců">
            <MBlock>{"sin 2x = 2 sin x cos x\ncos 2x = cos²x − sin²x\n1 + cos 2x = 1 + cos²x − sin²x = 2cos²x\n1 − cos 2x = 1 − cos²x + sin²x = 2sin²x"}</MBlock>
          </Step>
          <Step n={2} title="Dosazení do zlomků">
            <MBlock>{"2 sin x cos x / (2cos²x) + 2sin²x / (2 sin x cos x)\n= sin x/cos x + sin x/cos x\n= tg x + tg x = 2 tg x ✓"}</MBlock>
          </Step>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>Dokázáno. D: x ≠ kπ/2</div>
        </Solution>
      </Collapsible>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// QUIZ DATA
// ══════════════════════════════════════════════════════════════════
const quizQuestions = [
  {
    question: "Kolik je sin(5π/6)?",
    type: "single",
    options: ["1/2", "−1/2", "√3/2", "−√3/2"],
    correct: [0],
    explanation: "5π/6 je v II. kvadrantu, referenční úhel je π/6. Sin je v II. kv. kladný, sin(π/6) = 1/2.",
    tip: "II. kvadrant = sin kladný, cos záporný."
  },
  {
    question: "Kolik je cos(7π/4)?",
    type: "single",
    options: ["√2/2", "−√2/2", "1/2", "−1/2"],
    correct: [0],
    explanation: "7π/4 = 2π − π/4 je v IV. kvadrantu. Cos je kladný v IV. kv., cos(π/4) = √2/2.",
  },
  {
    question: "Jaká je perioda funkce y = sin(3x)?",
    type: "single",
    options: ["2π/3", "3π", "6π", "π/3"],
    correct: [0],
    explanation: "Pro sin(bx) je perioda T = 2π/b. Tady b = 3, takže T = 2π/3.",
    tip: "T = 2π/b pro sin a cos, T = π/b pro tg a cotg."
  },
  {
    question: "Jaká je perioda funkce y = −2sin(x/2)?",
    type: "single",
    options: ["4π", "2π", "π", "π/2"],
    correct: [0],
    explanation: "b = 1/2, T = 2π/(1/2) = 4π. Záporný koeficient a amplituda nemění periodu.",
  },
  {
    question: "Jaká je perioda funkce y = −(1/2)tg(4x)?",
    type: "single",
    options: ["π/4", "4π", "π/2", "2π"],
    correct: [0],
    explanation: "Pro tg(bx) je T = π/b. Tady b = 4, T = π/4.",
  },
  {
    question: "Rovnice cos x = −1 má řešení:",
    type: "single",
    options: ["x = π + 2kπ", "x = 3π/2 + 2kπ", "x = 0 + 2kπ", "x = π/2 + kπ"],
    correct: [0],
    explanation: "cos x = −1 nastává pouze v bodě π na jednotkové kružnici, s periodou 2π.",
  },
  {
    question: "sin²x + cos²x = ?",
    type: "single",
    options: ["1", "0", "2", "sin 2x"],
    correct: [0],
    explanation: "Základní goniometrická identita (Pythagorova věta na jednotkové kružnici).",
    tip: "Toto je nejdůležitější identita v goniometrii!"
  },
  {
    question: "cos 2x se rovná:",
    type: "multi",
    options: ["cos²x − sin²x", "1 − 2sin²x", "2cos²x − 1", "2sin x cos x"],
    correct: [0, 1, 2],
    explanation: "Všechny tři první tvary jsou správné (ekvivalentní). 2sin x cos x = sin 2x, ne cos 2x.",
  },
  {
    question: "sin 2x = ?",
    type: "single",
    options: ["2 sin x cos x", "sin²x + cos²x", "cos²x − sin²x", "2 sin²x"],
    correct: [0],
    explanation: "Vzorec pro dvojnásobný úhel: sin 2x = 2 sin x cos x.",
  },
  {
    question: "Funkce y = 3sin(2(x − π/6)) má amplitudu a periodu:",
    type: "single",
    options: ["a = 3, T = π", "a = 3, T = 2π", "a = 2, T = 3π", "a = 6, T = π/2"],
    correct: [0],
    explanation: "Amplituda = |a| = 3. Perioda = 2π/b = 2π/2 = π.",
  },
  {
    question: "Ve kterých kvadrantech je tg x kladný?",
    type: "multi",
    options: ["I. kvadrant", "II. kvadrant", "III. kvadrant", "IV. kvadrant"],
    correct: [0, 2],
    explanation: "tg = sin/cos. V I. kv. oba kladné (+/+), v III. kv. oba záporné (−/− = +).",
    tip: "tg a cotg mají stejné znaménko — kladné v I. a III. kv."
  },
  {
    question: "Rovnice 2cos²x − cos x − 1 = 0: jaká je správná substituce?",
    type: "single",
    options: ["y = cos x, pak 2y² − y − 1 = 0", "y = cos²x, pak 2y − y − 1 = 0", "y = sin x, pak 2y² − y − 1 = 0", "y = 2cos x, pak y² − y − 1 = 0"],
    correct: [0],
    explanation: "Substituujeme y = cos x. Rovnice 2y² − y − 1 = 0 je standardní kvadratická rovnice.",
  },
  {
    question: "cotg(π/4) = ?",
    type: "single",
    options: ["1", "0", "√3", "√3/3"],
    correct: [0],
    explanation: "cotg(π/4) = cos(π/4)/sin(π/4) = (√2/2)/(√2/2) = 1.",
  },
  {
    question: "Když x je v III. kvadrantu a cotg x = 2, pak:",
    type: "multi",
    options: ["sin x < 0", "cos x < 0", "tg x > 0", "tg x < 0"],
    correct: [0, 1, 2],
    explanation: "V III. kv.: sin < 0, cos < 0. tg = sin/cos = (−)/(−) > 0. cotg > 0 souhlasí.",
  },
  {
    question: "Jak se změní graf funkce y = sin x při transformaci y = sin(x + π/2)?",
    type: "single",
    options: ["Posune se o π/2 DOLEVA", "Posune se o π/2 DOPRAVA", "Posune se o π/2 NAHORU", "Změní se perioda"],
    correct: [0],
    explanation: "Vnitřní transformace +c posouvá graf DOLEVA o c. sin(x + π/2) = cos x.",
    tip: "Vnitřní + = DOLEVA, vnitřní − = DOPRAVA (opak intuice!)"
  },
  {
    question: "tg x = sin x / cos x. Kdy tg x není definován?",
    type: "single",
    options: ["Když cos x = 0, tj. x = π/2 + kπ", "Když sin x = 0, tj. x = kπ", "Když x = 2kπ", "tg x je vždy definován"],
    correct: [0],
    explanation: "tg x = sin x / cos x, takže není definován kde cos x = 0, tj. v x = π/2 + kπ.",
  },
];

// ══════════════════════════════════════════════════════════════════
// FLASHCARDS DATA
// ══════════════════════════════════════════════════════════════════
const flashcardsData = [
  { front: "sin²x + cos²x = ?", back: "1\n(Pythagorova identita)" },
  { front: "sin 2x = ?", back: "2 sin x cos x" },
  { front: "cos 2x = ? (3 tvary)", back: "cos²x − sin²x\n= 1 − 2sin²x\n= 2cos²x − 1" },
  { front: "tg x = ?", back: "sin x / cos x" },
  { front: "cotg x = ?", back: "cos x / sin x = 1 / tg x" },
  { front: "Perioda sin(bx), cos(bx)?", back: "T = 2π / |b|" },
  { front: "Perioda tg(bx), cotg(bx)?", back: "T = π / |b|" },
  { front: "sin(π/6) = ?", back: "1/2" },
  { front: "cos(π/6) = ?", back: "√3/2" },
  { front: "sin(π/4) = ?", back: "√2/2" },
  { front: "cos(π/4) = ?", back: "√2/2" },
  { front: "sin(π/3) = ?", back: "√3/2" },
  { front: "cos(π/3) = ?", back: "1/2" },
  { front: "tg(π/3) = ?", back: "√3" },
  { front: "tg(π/6) = ?", back: "√3/3" },
  { front: "Znaménko sin ve III. kv.?", back: "ZÁPORNÉ (sin < 0)" },
  { front: "Znaménko cos ve II. kv.?", back: "ZÁPORNÉ (cos < 0)" },
  { front: "y = a sin(b(x+c)) + d\nCo je a?", back: "Amplituda — násobí y-ové hodnoty\nRozsah: ⟨−|a|, |a|⟩ (bez d)" },
  { front: "y = a sin(b(x+c)) + d\nCo je c?", back: "Horizontální posun\n+c = doleva, −c = doprava" },
  { front: "sin²x = ? (přes cos 2x)", back: "(1 − cos 2x) / 2" },
  { front: "cos²x = ? (přes cos 2x)", back: "(1 + cos 2x) / 2" },
  { front: "sin(−α) = ?", back: "−sin α (lichá funkce)" },
  { front: "cos(−α) = ?", back: "cos α (sudá funkce)" },
  { front: "1 + tg²x = ?", back: "1 / cos²x" },
  { front: "1 + cotg²x = ?", back: "1 / sin²x" },
];

// ══════════════════════════════════════════════════════════════════
// FLASHCARDS COMPONENT
// ══════════════════════════════════════════════════════════════════
function Flashcards() {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = flashcardsData[idx];

  return (
    <div style={{ maxWidth: "540px", margin: "0 auto" }}>
      <div onClick={() => setFlipped(!flipped)} style={{ ...glass, padding: "40px 32px", minHeight: "200px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", transition: "all 0.4s ease", background: flipped ? "rgba(236,72,153,0.08)" : "rgba(255,255,255,0.05)" }}>
        <div>
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", marginBottom: "12px" }}>{flipped ? "ODPOVĚĎ" : "OTÁZKA"} ({idx + 1}/{flashcardsData.length})</div>
          <div style={{ color: "#fff", fontSize: "22px", fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", whiteSpace: "pre-line", lineHeight: 1.6 }}>{flipped ? card.back : card.front}</div>
          {!flipped && <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px", marginTop: "16px" }}>Klikni pro otočení</div>}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "16px", flexWrap: "wrap" }}>
        <button style={btnS} onClick={() => { setIdx(Math.max(0, idx - 1)); setFlipped(false); }} disabled={idx === 0}>← Předchozí</button>
        <button style={{ ...btnS, background: PINK + "22", border: `1px solid ${PINK}` }} onClick={() => setFlipped(!flipped)}>{flipped ? "Otočit zpět" : "Zobrazit odpověď"}</button>
        <button style={btnS} onClick={() => { setIdx(Math.min(flashcardsData.length - 1, idx + 1)); setFlipped(false); }} disabled={idx === flashcardsData.length - 1}>Další →</button>
      </div>
      <div style={{ display: "flex", gap: "6px", justifyContent: "center", flexWrap: "wrap", marginTop: "12px" }}>
        {flashcardsData.map((_, i) => (
          <div key={i} onClick={() => { setIdx(i); setFlipped(false); }} style={{ width: "18px", height: "18px", borderRadius: "50%", background: i === idx ? PINK : "#4b5563", cursor: "pointer", transition: "background 0.4s ease" }} />
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// FORMULA SHEET
// ══════════════════════════════════════════════════════════════════
function FormulaSheet() {
  return (
    <div>
      <div style={{ ...glass, padding: "20px", marginBottom: "16px" }}>
        <div style={{ color: PINK, fontWeight: 700, fontSize: "18px", marginBottom: "12px" }}>Základní identity</div>
        <MBlock>{"sin²x + cos²x = 1\ntg x = sin x / cos x\ncotg x = cos x / sin x\ntg x · cotg x = 1\n1 + tg²x = 1/cos²x\n1 + cotg²x = 1/sin²x"}</MBlock>
      </div>

      <div style={{ ...glass, padding: "20px", marginBottom: "16px" }}>
        <div style={{ color: PINK, fontWeight: 700, fontSize: "18px", marginBottom: "12px" }}>Dvojnásobný úhel</div>
        <MBlock>{"sin 2x = 2 sin x cos x\ncos 2x = cos²x − sin²x\n       = 1 − 2sin²x\n       = 2cos²x − 1"}</MBlock>
      </div>

      <div style={{ ...glass, padding: "20px", marginBottom: "16px" }}>
        <div style={{ color: PINK, fontWeight: 700, fontSize: "18px", marginBottom: "12px" }}>Poloviční úhel</div>
        <MBlock>{"sin²(x/2) = (1 − cos x)/2\ncos²(x/2) = (1 + cos x)/2"}</MBlock>
      </div>

      <div style={{ ...glass, padding: "20px", marginBottom: "16px" }}>
        <div style={{ color: PINK, fontWeight: 700, fontSize: "18px", marginBottom: "12px" }}>Sudost a lichost</div>
        <MBlock>{"sin(−x) = −sin x  (lichá)\ncos(−x) = cos x   (sudá)\ntg(−x) = −tg x    (lichá)\ncotg(−x) = −cotg x (lichá)"}</MBlock>
      </div>

      <div style={{ ...glass, padding: "20px", marginBottom: "16px" }}>
        <div style={{ color: PINK, fontWeight: 700, fontSize: "18px", marginBottom: "12px" }}>Periody</div>
        <MBlock>{"sin(bx), cos(bx): T = 2π/|b|\ntg(bx), cotg(bx): T = π/|b|"}</MBlock>
      </div>

      <div style={{ ...glass, padding: "20px", marginBottom: "16px" }}>
        <div style={{ color: PINK, fontWeight: 700, fontSize: "18px", marginBottom: "12px" }}>Transformace y = a·f(b(x + c)) + d</div>
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "4px 16px", fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", color: "#fff" }}>
          <span style={{ color: CYAN }}>|a|</span><span>amplituda (násobení y)</span>
          <span style={{ color: CYAN }}>a &lt; 0</span><span>zrcadlení přes osu x</span>
          <span style={{ color: CYAN }}>b</span><span>změna periody (T = 2π/b)</span>
          <span style={{ color: CYAN }}>c &gt; 0</span><span>posun DOLEVA o c</span>
          <span style={{ color: CYAN }}>c &lt; 0</span><span>posun DOPRAVA o |c|</span>
          <span style={{ color: CYAN }}>d &gt; 0</span><span>posun NAHORU o d</span>
          <span style={{ color: CYAN }}>d &lt; 0</span><span>posun DOLŮ o |d|</span>
        </div>
      </div>

      <div style={{ ...glass, padding: "20px", marginBottom: "16px" }}>
        <div style={{ color: PINK, fontWeight: 700, fontSize: "18px", marginBottom: "12px" }}>Tabulka hodnot (I. kvadrant)</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'JetBrains Mono', monospace", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid rgba(255,255,255,0.2)" }}>
                {["", "0°", "30° (π/6)", "45° (π/4)", "60° (π/3)", "90° (π/2)"].map(h => <th key={h} style={{ padding: "10px 6px", color: CYAN, textAlign: "center", fontSize: "12px" }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {[
                ["sin", "0", "1/2", "√2/2", "√3/2", "1"],
                ["cos", "1", "√3/2", "√2/2", "1/2", "0"],
                ["tg", "0", "√3/3", "1", "√3", "ndef."],
                ["cotg", "ndef.", "√3", "1", "√3/3", "0"],
              ].map(row => (
                <tr key={row[0]} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <td style={{ padding: "10px 6px", color: PINK, fontWeight: 700, textAlign: "center" }}>{row[0]}</td>
                  {row.slice(1).map((v, i) => <td key={i} style={{ padding: "10px 6px", color: v === "ndef." ? "rgba(255,255,255,0.3)" : "#fff", textAlign: "center" }}>{v}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ ...glass, padding: "20px" }}>
        <div style={{ color: PINK, fontWeight: 700, fontSize: "18px", marginBottom: "12px" }}>Znaménko v kvadrantech</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", maxWidth: "360px", margin: "0 auto" }}>
          {[
            ["II.", "sin +", "cos −", "tg −", "cotg −"],
            ["I.", "sin +", "cos +", "tg +", "cotg +"],
            ["III.", "sin −", "cos −", "tg +", "cotg +"],
            ["IV.", "sin −", "cos +", "tg −", "cotg −"],
          ].map((q, i) => (
            <div key={i} style={{ padding: "12px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", textAlign: "center" }}>
              <div style={{ color: CYAN, fontWeight: 700, marginBottom: "4px" }}>{q[0]}</div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
                {q.slice(1).map(v => <div key={v} style={{ color: v.includes("+") ? "#4ade80" : "#f87171" }}>{v}</div>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════════════
export default function App() {
  const [tab, setTab] = useState("problems");

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a1a", fontFamily: "'Exo 2', sans-serif", position: "relative", overflow: "hidden" }}>
      {/* Synthwave background */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", bottom: 0, left: "-50%", width: "200%", height: "50%", background: `linear-gradient(transparent 0%, ${PINK}11 100%)`, backgroundSize: "60px 60px", backgroundImage: `linear-gradient(${PINK}15 1px, transparent 1px), linear-gradient(90deg, ${PINK}15 1px, transparent 1px)`, transform: "perspective(500px) rotateX(60deg)", transformOrigin: "center bottom" }} />
        <div style={{ position: "absolute", top: "8%", left: "50%", transform: "translateX(-50%)", width: "200px", height: "200px", borderRadius: "50%", background: `radial-gradient(circle, ${PINK}44, ${CYAN}22, transparent)`, filter: "blur(40px)" }} />
        {[...Array(12)].map((_, i) => (
          <div key={i} style={{ position: "absolute", width: `${3 + Math.random() * 4}px`, height: `${3 + Math.random() * 4}px`, borderRadius: "50%", background: i % 2 === 0 ? PINK + "66" : CYAN + "66", left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animation: `float${i % 3} ${12 + Math.random() * 8}s ease-in-out infinite`, filter: "blur(1px)" }} />
        ))}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;600;700;800&family=Audiowide&family=JetBrains+Mono:wght@400;600;700&display=swap');
        @keyframes float0 { 0%, 100% { transform: translateY(0) translateX(0); } 50% { transform: translateY(-30px) translateX(15px); } }
        @keyframes float1 { 0%, 100% { transform: translateY(0) translateX(0); } 50% { transform: translateY(20px) translateX(-20px); } }
        @keyframes float2 { 0%, 100% { transform: translateY(0) translateX(0); } 50% { transform: translateY(-15px) translateX(-10px); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button:disabled { opacity: 0.4; cursor: not-allowed; }
        button:hover:not(:disabled) { filter: brightness(1.2); }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 3px; }
      `}</style>

      <div style={{ position: "relative", zIndex: 1, maxWidth: "900px", margin: "0 auto", padding: "20px 16px" }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h1 style={{ fontFamily: "'Audiowide', sans-serif", fontSize: "clamp(22px, 5vw, 36px)", color: "#fff", marginBottom: "6px", textShadow: `0 0 20px ${PINK}66` }}>Goniometrie</h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>Kompletní příprava na písemku — 20. 4. 2026</p>
        </div>

        <div style={{ display: "flex", gap: "6px", justifyContent: "center", flexWrap: "wrap", marginBottom: "20px" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "8px 20px", borderRadius: "20px", border: tab === t.id ? `1px solid ${PINK}` : "1px solid rgba(255,255,255,0.12)", background: tab === t.id ? PINK + "22" : "rgba(255,255,255,0.04)", color: tab === t.id ? "#fff" : "rgba(255,255,255,0.6)", fontFamily: "'Exo 2', sans-serif", fontSize: "14px", fontWeight: 600, cursor: "pointer", transition: "all 0.4s ease" }}>{t.label}</button>
          ))}
        </div>

        {tab === "theory" && <TheoryTab />}
        {tab === "problems" && <ProblemsTab />}
        {tab === "quiz" && <QuizEngine questions={quizQuestions} accentColor={PINK} />}
        {tab === "flashcards" && <Flashcards />}
        {tab === "formulas" && <FormulaSheet />}
      </div>
    </div>
  );
}
