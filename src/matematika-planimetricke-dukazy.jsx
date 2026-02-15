// @title Planimetrické důkazy — Kompletní příprava
// @subject Math
// @topic Planimetrické důkazy
// @template study-app

import { useState, useCallback, useMemo } from 'react';

/* ════════════════════════════════════════════════════════════════
   QUIZ ENGINE (from assets/quiz-engine.jsx)
   ════════════════════════════════════════════════════════════════ */
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

function QuizEngine({ questions, accentColor = "#ff2d95" }) {
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
  const score = shuffledQuestions.filter((q2, i) => revealed[i] && arrEqual(answers[i] || [], q2.correct)).length;
  const pct = Math.round((score / shuffledQuestions.length) * 100);

  const goTo = useCallback((i) => { setIdx(i); setPendingMulti(shuffledQuestions[i].type === "multi" ? (answers[i] || []) : []); }, [answers, shuffledQuestions]);
  const handleSingleSelect = useCallback((optionIdx) => { if (isRevealed) return; setAnswers(prev => ({ ...prev, [idx]: [optionIdx] })); setRevealed(prev => ({ ...prev, [idx]: true })); }, [idx, isRevealed]);
  const toggleMulti = useCallback((optionIdx) => { if (isRevealed) return; setPendingMulti(prev => prev.includes(optionIdx) ? prev.filter(i => i !== optionIdx) : [...prev, optionIdx]); }, [isRevealed]);
  const submitMulti = useCallback(() => { if (pendingMulti.length === 0) return; setAnswers(prev => ({ ...prev, [idx]: [...pendingMulti] })); setRevealed(prev => ({ ...prev, [idx]: true })); }, [idx, pendingMulti]);
  const restart = useCallback(() => { setIdx(0); setAnswers({}); setRevealed({}); setPendingMulti([]); setShowResults(false); setShuffleKey(k => k + 1); }, []);

  const activeSet = isMulti ? (isRevealed ? myAnswer : pendingMulti) : myAnswer;

  if (showResults) {
    const msg = pct >= 90 ? "Výborně! Máš to perfektně zvládnuté!" : pct >= 70 ? "Dobře! Téměř máš vše zvládnuté." : pct >= 50 ? "Mohlo by to být lepší, ale jdeš správným směrem." : "Potřebuješ více přípravy. Opakuj a bude to!";
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "280px" }}>
        <div style={{ textAlign: "center", ...cardStyle, padding: "40px 48px" }}>
          <div style={{ color: "#fff", fontSize: "52px", fontWeight: 800, lineHeight: 1.1 }}>{score} / {shuffledQuestions.length}</div>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "22px", marginBottom: "16px" }}>{pct} %</div>
          <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "17px", lineHeight: 1.5, marginBottom: "24px", maxWidth: "340px", margin: "0 auto 24px" }}>{msg}</div>
          <button style={{ ...btnStyle, background: accentColor + "66", border: `1px solid ${accentColor}` }} onClick={restart}>Začít znovu</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "720px", margin: "0 auto", padding: "16px" }}>
      <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
        {shuffledQuestions.map((_, i) => {
          let bg = "#4b5563";
          if (i === idx) bg = accentColor;
          else if (revealed[i]) bg = arrEqual(answers[i] || [], shuffledQuestions[i].correct) ? "#22c55e" : "#ef4444";
          return <div key={i} onClick={() => goTo(i)} title={`Otázka ${i + 1}`} style={{ width: "22px", height: "22px", borderRadius: "50%", cursor: "pointer", transition: "background 0.4s ease", background: bg }} />;
        })}
      </div>
      <div style={cardStyle}>
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
              <div key={i} style={{ padding: "12px 16px", borderRadius: "12px", color: "#fff", cursor: "pointer", transition: "all 0.4s ease", display: "flex", alignItems: "center", gap: "10px", userSelect: "none", fontSize: "15px", background: bg, border }} onClick={() => isMulti ? toggleMulti(i) : handleSingleSelect(i)}>
                {isMulti && <span style={{ fontSize: "18px", minWidth: "20px", color: "rgba(255,255,255,0.7)" }}>{activeSet.includes(i) ? "☑" : "☐"}</span>}
                <span>{opt}</span>
              </div>
            );
          })}
        </div>
        {isMulti && !isRevealed && <button style={{ ...btnStyle, opacity: pendingMulti.length === 0 ? 0.4 : 1 }} onClick={submitMulti} disabled={pendingMulti.length === 0}>Potvrdít</button>}
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
        <button style={btnStyle} onClick={() => goTo(idx - 1)} disabled={idx === 0}>← Předchozí</button>
        {idx < shuffledQuestions.length - 1
          ? <button style={btnStyle} onClick={() => goTo(idx + 1)}>Další →</button>
          : <button style={{ ...btnStyle, background: accentColor + "55", border: `1px solid ${accentColor}` }} onClick={() => setShowResults(true)}>Výsledky →</button>}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   SHARED STYLES
   ════════════════════════════════════════════════════════════════ */
const PINK = "#ff2d95";
const CYAN = "#00d4ff";

const cardStyle = {
  background: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "20px",
  padding: "24px",
  transition: "all 0.4s ease",
};

const btnStyle = {
  marginTop: "12px",
  padding: "10px 22px",
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: "10px",
  color: "#fff",
  cursor: "pointer",
  fontSize: "15px",
  transition: "all 0.4s ease",
  fontFamily: "'Exo 2', sans-serif",
};

const mono = { fontFamily: "'JetBrains Mono', monospace" };

/* ════════════════════════════════════════════════════════════════
   ANIMATED SVG DIAGRAMS
   ════════════════════════════════════════════════════════════════ */
const RAD = Math.PI / 180;
const ptOn = (cx, cy, r, deg) => [cx + r * Math.cos(deg * RAD), cy + r * Math.sin(deg * RAD)];
const svgArc = (cx, cy, r, a1, a2) => {
  const [x1, y1] = ptOn(cx, cy, r, a1), [x2, y2] = ptOn(cx, cy, r, a2);
  let d = ((a2 - a1) % 360 + 360) % 360;
  return `M${x1.toFixed(1)},${y1.toFixed(1)}A${r},${r},0,${d > 180 ? 1 : 0},1,${x2.toFixed(1)},${y2.toFixed(1)}`;
};
const angOf = (cx, cy, px, py) => Math.atan2(py - cy, px - cx) / RAD;
const angleArc = (cx, cy, r, p1x, p1y, p2x, p2y) => {
  const a1 = angOf(cx, cy, p1x, p1y), a2 = angOf(cx, cy, p2x, p2y);
  const [x1, y1] = ptOn(cx, cy, r, a1), [x2, y2] = ptOn(cx, cy, r, a2);
  const cross = (p1x - cx) * (p2y - cy) - (p1y - cy) * (p2x - cx);
  return `M${x1.toFixed(1)},${y1.toFixed(1)}A${r},${r},0,0,${cross > 0 ? 1 : 0},${x2.toFixed(1)},${y2.toFixed(1)}`;
};
const Txt = ({ x, y, children, fill = "#fff", size = 13, anchor = "middle", f }) => (
  <text x={x} y={y} fill={fill} fontSize={size} textAnchor={anchor} fontFamily="'Exo 2', sans-serif" fontWeight={600} style={f}>{children}</text>
);
const MTxt = ({ x, y, children, fill = CYAN, size = 13, anchor = "middle", f }) => (
  <text x={x} y={y} fill={fill} fontSize={size} textAnchor={anchor} fontFamily="'JetBrains Mono', monospace" fontWeight={500} style={f}>{children}</text>
);
const Eq = ({ y, children, f }) => (
  <g style={f}><rect x={80} y={y - 18} width={240} height={26} rx={8} fill="rgba(0,0,0,0.7)" stroke={PINK} strokeWidth={1} />
    <MTxt x={200} y={y} fill="#fff" size={12}>{children}</MTxt></g>
);

function StepDiagram({ maxSteps, labels, children }) {
  const [step, setStep] = useState(0);
  const sb = { padding: "4px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.07)", color: "#fff", cursor: "pointer", fontSize: 13, fontFamily: "'Exo 2', sans-serif", transition: "all 0.4s ease" };
  return (
    <div style={{ marginBottom: 14, borderRadius: 14, padding: "14px 8px 8px", background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <svg viewBox="0 0 400 280" style={{ width: "100%", maxWidth: 440, display: "block", margin: "0 auto" }}>{children(step)}</svg>
      {labels && labels[step] && <div style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 6, fontStyle: "italic", minHeight: 16 }}>{labels[step]}</div>}
      <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "center", marginTop: 8 }}>
        <button style={sb} onClick={() => setStep(0)}>⟲</button>
        <button style={{ ...sb, opacity: step === 0 ? 0.3 : 1 }} onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>←</button>
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontFamily: "'JetBrains Mono', monospace", minWidth: 48, textAlign: "center" }}>{step + 1}/{maxSteps}</span>
        <button style={{ ...sb, opacity: step >= maxSteps - 1 ? 0.3 : 1 }} onClick={() => setStep(s => Math.min(maxSteps - 1, s + 1))} disabled={step >= maxSteps - 1}>→</button>
      </div>
    </div>
  );
}
const V = (step, min) => ({ opacity: step >= min ? 1 : 0, transition: "all 0.5s ease" });

/* ── Diagram renderers ── */
const DIAG = {};

// #1 — Součet úhlů trojúhelníku
DIAG[1] = { steps: 4, labels: ["Trojúhelník ABC s úhly α, β, γ", "Rovnoběžka p ∥ AB bodem C", "Střídavé úhly α a β na rovnoběžce", "α + γ + β = 180° (přímý úhel)"],
  render: (s) => {
    const A = [60, 230], B = [340, 230], C = [200, 55];
    return <g>
      <polygon points={`${A} ${B} ${C}`} fill="rgba(255,255,255,0.03)" stroke="#fff" strokeWidth={2} />
      <Txt x={A[0] - 14} y={A[1] + 18}>A</Txt><Txt x={B[0] + 14} y={B[1] + 18}>B</Txt><Txt x={C[0]} y={C[1] - 12}>C</Txt>
      <path d={angleArc(A[0], A[1], 32, C[0], C[1], B[0], B[1])} fill="none" stroke={PINK} strokeWidth={2} />
      <MTxt x={A[0] + 40} y={A[1] - 10} fill={PINK} size={12}>α</MTxt>
      <path d={angleArc(B[0], B[1], 32, A[0], A[1], C[0], C[1])} fill="none" stroke={PINK} strokeWidth={2} />
      <MTxt x={B[0] - 40} y={B[1] - 10} fill={PINK} size={12}>β</MTxt>
      <path d={angleArc(C[0], C[1], 28, B[0], B[1], A[0], A[1])} fill="none" stroke={CYAN} strokeWidth={2} />
      <MTxt x={C[0]} y={C[1] + 38} fill={CYAN} size={12}>γ</MTxt>
      <g style={V(s, 1)}><line x1={25} y1={C[1]} x2={375} y2={C[1]} stroke={CYAN} strokeWidth={1.5} strokeDasharray="8,4" /><Txt x={378} y={C[1] - 8} fill={CYAN} size={11} anchor="start">p</Txt></g>
      <g style={V(s, 2)}>
        <path d={angleArc(C[0], C[1], 38, A[0], A[1], 25, C[1])} fill="none" stroke={PINK} strokeWidth={2.5} />
        <MTxt x={C[0] - 52} y={C[1] - 8} fill={PINK} size={12}>α</MTxt>
        <path d={angleArc(C[0], C[1], 38, 375, C[1], B[0], B[1])} fill="none" stroke={PINK} strokeWidth={2.5} />
        <MTxt x={C[0] + 52} y={C[1] - 8} fill={PINK} size={12}>β</MTxt>
      </g>
      <Eq y={18} f={V(s, 3)}>α + γ + β = 180°</Eq>
    </g>;
  }
};

// #2 — Pythagorova věta
DIAG[2] = { steps: 4, labels: ["Čtverec o straně (a + b)", "4 pravoúhlé trojúhelníky s odvěsnami a, b", "Vnitřní čtverec o straně c", "(a+b)² = c² + 4·½ab → a²+b²=c²"],
  render: (s) => {
    const a = 90, b = 150, L = 80, T = 20, S = a + b;
    const sq = [[L, T], [L + S, T], [L + S, T + S], [L, T + S]];
    const m = [[L + a, T + S], [L + S, T + S - a], [L + S - a, T], [L, T + a]];
    const tris = [[sq[3], m[0], m[3]], [m[0], sq[2], m[1]], [m[1], sq[1], m[2]], [m[2], sq[0], m[3]]];
    const cols = ["rgba(255,45,149,0.15)", "rgba(0,212,255,0.15)", "rgba(255,45,149,0.15)", "rgba(0,212,255,0.15)"];
    return <g>
      <rect x={L} y={T} width={S} height={S} fill="none" stroke="#fff" strokeWidth={2} />
      <Txt x={L + S / 2} y={T + S + 18} size={11} fill="rgba(255,255,255,0.5)">a + b</Txt>
      {tris.map((t, i) => <polygon key={i} points={t.map(p => p.join(",")).join(" ")} fill={s >= 1 ? cols[i] : "none"} stroke={s >= 1 ? (i % 2 === 0 ? PINK : CYAN) : "none"} strokeWidth={1.5} style={{ transition: "all 0.5s ease" }} />)}
      <g style={V(s, 1)}>
        <Txt x={L + a / 2} y={T + S + 5} size={10} fill={PINK}>a</Txt><Txt x={L + a + b / 2} y={T + S + 5} size={10} fill={CYAN}>b</Txt>
        <Txt x={L + S + 8} y={T + S - a / 2} size={10} fill={PINK} anchor="start">a</Txt><Txt x={L + S + 8} y={T + a / 2 + 10} size={10} fill={CYAN} anchor="start">b</Txt>
      </g>
      <g style={V(s, 2)}>
        <polygon points={m.map(p => p.join(",")).join(" ")} fill="rgba(255,255,255,0.06)" stroke="#fbbf24" strokeWidth={2} />
        <MTxt x={200} y={145} fill="#fbbf24" size={14}>c²</MTxt>
      </g>
      <Eq y={18} f={V(s, 3)}>a² + b² = c²</Eq>
    </g>;
  }
};

// #3 — Eukleidova věta o výšce
DIAG[3] = { steps: 5, labels: ["Pravoúhlý △ABC, pravý úhel při C", "Výška v_c z C na AB, pata P", "△APC zvýrazněn (pravoúhlý)", "△BPC zvýrazněn (pravoúhlý)", "Podobnost: c_b/v_c = v_c/c_a → v_c² = c_a·c_b"],
  render: (s) => {
    const A = [50, 235], B = [350, 235], C = [130, 60], P = [130, 235];
    return <g>
      <polygon points={`${A} ${B} ${C}`} fill="rgba(255,255,255,0.03)" stroke="#fff" strokeWidth={2} />
      <Txt x={A[0] - 12} y={A[1] + 18}>A</Txt><Txt x={B[0] + 12} y={B[1] + 18}>B</Txt><Txt x={C[0] - 5} y={C[1] - 12}>C</Txt>
      <path d={`M${C[0] + 12},${C[1]} L${C[0] + 12},${C[1] + 12} L${C[0]},${C[1] + 12}`} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={1} />
      <g style={V(s, 1)}>
        <line x1={C[0]} y1={C[1]} x2={P[0]} y2={P[1]} stroke={CYAN} strokeWidth={2} strokeDasharray="6,3" />
        <Txt x={P[0]} y={P[1] + 18} fill={CYAN}>P</Txt>
        <path d={`M${P[0] + 10},${P[1]} L${P[0] + 10},${P[1] - 10} L${P[0]},${P[1] - 10}`} fill="none" stroke={CYAN} strokeWidth={1} />
        <MTxt x={C[0] - 16} y={(C[1] + P[1]) / 2} fill={CYAN} size={11}>v_c</MTxt>
        <MTxt x={(A[0] + P[0]) / 2} y={P[1] + 18} fill="#fbbf24" size={10}>c_b</MTxt>
        <MTxt x={(B[0] + P[0]) / 2} y={P[1] + 18} fill="#fbbf24" size={10}>c_a</MTxt>
      </g>
      <g style={V(s, 2)}>
        <polygon points={`${A} ${P} ${C}`} fill="rgba(255,45,149,0.12)" stroke={PINK} strokeWidth={2} />
        <MTxt x={75} y={155} fill={PINK} size={11}>△APC</MTxt>
      </g>
      <g style={V(s, 3)}>
        <polygon points={`${B} ${P} ${C}`} fill="rgba(0,212,255,0.12)" stroke={CYAN} strokeWidth={2} />
        <MTxt x={250} y={155} fill={CYAN} size={11}>△BPC</MTxt>
      </g>
      <Eq y={18} f={V(s, 4)}>v_c² = c_a · c_b</Eq>
    </g>;
  }
};

// #4 — Eukleidova věta o odvěsně
DIAG[4] = { steps: 5, labels: ["Pravoúhlý △ABC, pravý úhel při C", "Výška v_c, pata P — úseky c_a, c_b", "△BPC ~ △ABC (sdílejí úhel β)", "Poměr stran → a² = c · c_a", "Analogicky b² = c · c_b"],
  render: (s) => {
    const A = [50, 235], B = [350, 235], C = [130, 60], P = [130, 235];
    return <g>
      <polygon points={`${A} ${B} ${C}`} fill="rgba(255,255,255,0.03)" stroke="#fff" strokeWidth={2} />
      <Txt x={A[0] - 12} y={A[1] + 18}>A</Txt><Txt x={B[0] + 12} y={B[1] + 18}>B</Txt><Txt x={C[0] - 5} y={C[1] - 12}>C</Txt>
      <MTxt x={(A[0] + B[0]) / 2} y={A[1] + 18} fill="rgba(255,255,255,0.5)" size={11}>c</MTxt>
      <g style={V(s, 1)}>
        <line x1={C[0]} y1={C[1]} x2={P[0]} y2={P[1]} stroke={CYAN} strokeWidth={1.5} strokeDasharray="6,3" />
        <Txt x={P[0]} y={P[1] + 18} fill={CYAN}>P</Txt>
        <MTxt x={(A[0] + P[0]) / 2} y={P[1] + 18} fill="#fbbf24" size={10}>c_b</MTxt>
        <MTxt x={(B[0] + P[0]) / 2} y={P[1] + 18} fill="#fbbf24" size={10}>c_a</MTxt>
        <MTxt x={(B[0] + C[0]) / 2 + 15} y={(B[1] + C[1]) / 2} fill="rgba(255,255,255,0.5)" size={11}>a</MTxt>
        <MTxt x={(A[0] + C[0]) / 2 - 15} y={(A[1] + C[1]) / 2} fill="rgba(255,255,255,0.5)" size={11}>b</MTxt>
      </g>
      <g style={V(s, 2)}>
        <polygon points={`${B} ${P} ${C}`} fill="rgba(255,45,149,0.12)" stroke={PINK} strokeWidth={2} />
        <MTxt x={260} y={155} fill={PINK} size={11}>△BPC</MTxt>
        <polygon points={`${A} ${B} ${C}`} fill="none" stroke={CYAN} strokeWidth={2.5} strokeDasharray="8,4" />
        <MTxt x={140} y={120} fill={CYAN} size={11}>△ABC</MTxt>
      </g>
      <g style={V(s, 3)}><Eq y={18}>a² = c · c_a</Eq></g>
      <g style={V(s, 4)}>
        <polygon points={`${A} ${P} ${C}`} fill="rgba(0,212,255,0.12)" stroke={CYAN} strokeWidth={2} />
        <rect x={80} y={35} width={240} height={26} rx={8} fill="rgba(0,0,0,0.7)" stroke={CYAN} strokeWidth={1} />
        <MTxt x={200} y={53} fill="#fff" size={12}>b² = c · c_b</MTxt>
      </g>
    </g>;
  }
};

// #5 — Středový a obvodový úhel
DIAG[5] = { steps: 5, labels: ["Kružnice k, body A, B, X, střed S", "Středový úhel ∠ASB", "Obvodový úhel ∠AXB", "Pomocná přímka XD přes S", "Rovnoramenné △: ∠ASB = 2·∠AXB"],
  render: (s) => {
    const cx = 200, cy = 145, r = 110;
    const A = ptOn(cx, cy, r, 150), B = ptOn(cx, cy, r, 30), X = ptOn(cx, cy, r, 270), D = ptOn(cx, cy, r, 90);
    return <g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} />
      <circle cx={cx} cy={cy} r={3} fill={CYAN} /><Txt x={cx + 10} y={cy - 8} fill={CYAN} size={11}>S</Txt>
      <circle cx={A[0]} cy={A[1]} r={4} fill={PINK} /><Txt x={A[0] - 16} y={A[1] + 4} fill={PINK} size={12}>A</Txt>
      <circle cx={B[0]} cy={B[1]} r={4} fill={PINK} /><Txt x={B[0] + 14} y={B[1] + 4} fill={PINK} size={12}>B</Txt>
      <circle cx={X[0]} cy={X[1]} r={4} fill="#fbbf24" /><Txt x={X[0]} y={X[1] + 18} fill="#fbbf24" size={12}>X</Txt>
      <g style={V(s, 1)}>
        <line x1={cx} y1={cy} x2={A[0]} y2={A[1]} stroke={PINK} strokeWidth={2} />
        <line x1={cx} y1={cy} x2={B[0]} y2={B[1]} stroke={PINK} strokeWidth={2} />
        <path d={angleArc(cx, cy, 20, A[0], A[1], B[0], B[1])} fill="none" stroke={PINK} strokeWidth={2} />
      </g>
      <g style={V(s, 2)}>
        <line x1={X[0]} y1={X[1]} x2={A[0]} y2={A[1]} stroke="#fbbf24" strokeWidth={1.5} />
        <line x1={X[0]} y1={X[1]} x2={B[0]} y2={B[1]} stroke="#fbbf24" strokeWidth={1.5} />
        <path d={angleArc(X[0], X[1], 24, A[0], A[1], B[0], B[1])} fill="none" stroke="#fbbf24" strokeWidth={2} />
      </g>
      <g style={V(s, 3)}>
        <line x1={X[0]} y1={X[1]} x2={D[0]} y2={D[1]} stroke={CYAN} strokeWidth={1.5} strokeDasharray="6,3" />
        <circle cx={D[0]} cy={D[1]} r={3} fill={CYAN} /><Txt x={D[0]} y={D[1] - 12} fill={CYAN} size={11}>D</Txt>
      </g>
      <g style={V(s, 4)}>
        <line x1={cx} y1={cy} x2={A[0]} y2={A[1]} stroke="rgba(255,255,255,0.3)" strokeWidth={1} strokeDasharray="4,3" />
        <line x1={cx} y1={cy} x2={B[0]} y2={B[1]} stroke="rgba(255,255,255,0.3)" strokeWidth={1} strokeDasharray="4,3" />
        <line x1={cx} y1={cy} x2={X[0]} y2={X[1]} stroke="rgba(255,255,255,0.3)" strokeWidth={1} strokeDasharray="4,3" />
        <Eq y={18}>∠ASB = 2 · ∠AXB</Eq>
      </g>
    </g>;
  }
};

// #6 — Sinová věta
DIAG[6] = { steps: 4, labels: ["Trojúhelník ABC", "Výška v_c z C na AB, pata P", "sin α = v_c/b → v_c = b·sin α", "sin β = v_c/a → b·sin α = a·sin β"],
  render: (s) => {
    const A = [50, 230], B = [350, 230], C = [220, 50], P = [220, 230];
    return <g>
      <polygon points={`${A} ${B} ${C}`} fill="rgba(255,255,255,0.03)" stroke="#fff" strokeWidth={2} />
      <Txt x={A[0] - 12} y={A[1] + 18}>A</Txt><Txt x={B[0] + 12} y={B[1] + 18}>B</Txt><Txt x={C[0] + 5} y={C[1] - 12}>C</Txt>
      <path d={angleArc(A[0], A[1], 30, C[0], C[1], B[0], B[1])} fill="none" stroke={PINK} strokeWidth={2} />
      <MTxt x={A[0] + 38} y={A[1] - 8} fill={PINK} size={11}>α</MTxt>
      <path d={angleArc(B[0], B[1], 30, A[0], A[1], C[0], C[1])} fill="none" stroke={CYAN} strokeWidth={2} />
      <MTxt x={B[0] - 38} y={B[1] - 12} fill={CYAN} size={11}>β</MTxt>
      <MTxt x={(B[0] + C[0]) / 2 + 14} y={(B[1] + C[1]) / 2} size={11} fill="rgba(255,255,255,0.5)">a</MTxt>
      <MTxt x={(A[0] + C[0]) / 2 - 14} y={(A[1] + C[1]) / 2 - 5} size={11} fill="rgba(255,255,255,0.5)">b</MTxt>
      <g style={V(s, 1)}>
        <line x1={C[0]} y1={C[1]} x2={P[0]} y2={P[1]} stroke="#fbbf24" strokeWidth={2} strokeDasharray="6,3" />
        <Txt x={P[0]} y={P[1] + 18} fill="#fbbf24">P</Txt>
        <MTxt x={C[0] + 16} y={(C[1] + P[1]) / 2} fill="#fbbf24" size={11}>v_c</MTxt>
      </g>
      <g style={V(s, 2)}>
        <polygon points={`${A} ${P} ${C}`} fill="rgba(255,45,149,0.1)" stroke={PINK} strokeWidth={1.5} />
        <MTxt x={135} y={170} fill={PINK} size={10}>v_c = b·sin α</MTxt>
      </g>
      <g style={V(s, 3)}>
        <polygon points={`${B} ${P} ${C}`} fill="rgba(0,212,255,0.1)" stroke={CYAN} strokeWidth={1.5} />
        <Eq y={18}>a/sin α = b/sin β</Eq>
      </g>
    </g>;
  }
};

// #7 — Poloměr opsané kružnice
DIAG[7] = { steps: 4, labels: ["△ABC vepsaný do kružnice k (poloměr r)", "Průměr BD kružnice", "△BDA: pravý úhel při A (Thales), ∠BDA = α", "sin α = a/(2r) → r = a/(2 sin α)"],
  render: (s) => {
    const cx = 200, cy = 148, r = 110;
    const B = ptOn(cx, cy, r, 140), D = ptOn(cx, cy, r, 320);
    const A = ptOn(cx, cy, r, 10), C = ptOn(cx, cy, r, 220);
    return <g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={1.5} />
      <circle cx={cx} cy={cy} r={3} fill="rgba(255,255,255,0.4)" />
      <polygon points={`${A} ${B} ${C}`} fill="rgba(255,255,255,0.03)" stroke="#fff" strokeWidth={2} />
      <Txt x={A[0] + 14} y={A[1] + 5}>A</Txt><Txt x={B[0] - 16} y={B[1] + 5}>B</Txt><Txt x={C[0] - 14} y={C[1] + 5}>C</Txt>
      <MTxt x={(B[0] + C[0]) / 2 - 18} y={(B[1] + C[1]) / 2 + 2} size={11} fill="rgba(255,255,255,0.5)">a</MTxt>
      <g style={V(s, 1)}>
        <line x1={B[0]} y1={B[1]} x2={D[0]} y2={D[1]} stroke={CYAN} strokeWidth={2} />
        <circle cx={D[0]} cy={D[1]} r={4} fill={CYAN} /><Txt x={D[0] + 14} y={D[1] - 8} fill={CYAN}>D</Txt>
        <MTxt x={cx + 8} y={cy - 10} fill={CYAN} size={10}>2r</MTxt>
      </g>
      <g style={V(s, 2)}>
        <polygon points={`${B} ${D} ${A}`} fill="rgba(255,45,149,0.1)" stroke={PINK} strokeWidth={1.5} />
        <path d={`M${A[0] - 8},${A[1] - 5} L${A[0] - 5},${A[1] - 13} L${A[0] + 3},${A[1] - 10}`} fill="none" stroke="#22c55e" strokeWidth={1.5} />
        <MTxt x={A[0] - 16} y={A[1] - 14} fill="#22c55e" size={10}>90°</MTxt>
        <path d={angleArc(D[0], D[1], 20, B[0], B[1], A[0], A[1])} fill="none" stroke={PINK} strokeWidth={2} />
        <MTxt x={D[0] - 8} y={D[1] + 28} fill={PINK} size={11}>α</MTxt>
      </g>
      <Eq y={18} f={V(s, 3)}>r = a / (2·sin α)</Eq>
    </g>;
  }
};

// #8 — Kosinová věta (postup pana profesora)
DIAG[8] = { steps: 6, labels: ["Trojúhelník ABC", "Výška v_c z C, pata P", "Úseky: |AP| = x, |PB| = c − x", "PV: x²+v_c²=b² a (c−x)²+v_c²=a²", "Odečtení: c²−2cx = a²−b²", "cos α = x/b → b²+c²−2bc·cos α = a²"],
  render: (s) => {
    const A = [50, 235], B = [350, 235], C = [140, 50], P = [140, 235];
    return <g>
      <polygon points={`${A} ${B} ${C}`} fill="rgba(255,255,255,0.03)" stroke="#fff" strokeWidth={2} />
      <Txt x={A[0] - 12} y={A[1] + 18}>A</Txt><Txt x={B[0] + 12} y={B[1] + 18}>B</Txt><Txt x={C[0] - 5} y={C[1] - 12}>C</Txt>
      <path d={angleArc(A[0], A[1], 28, C[0], C[1], B[0], B[1])} fill="none" stroke={PINK} strokeWidth={2} />
      <MTxt x={A[0] + 36} y={A[1] - 8} fill={PINK} size={11}>α</MTxt>
      <MTxt x={(B[0] + C[0]) / 2 + 14} y={(B[1] + C[1]) / 2} size={11} fill="rgba(255,255,255,0.4)">a</MTxt>
      <MTxt x={(A[0] + C[0]) / 2 - 14} y={(A[1] + C[1]) / 2 - 8} size={11} fill="rgba(255,255,255,0.4)">b</MTxt>
      <MTxt x={(A[0] + B[0]) / 2} y={A[1] + 18} size={11} fill="rgba(255,255,255,0.4)">c</MTxt>
      <g style={V(s, 1)}>
        <line x1={C[0]} y1={C[1]} x2={P[0]} y2={P[1]} stroke="#fbbf24" strokeWidth={2} strokeDasharray="6,3" />
        <Txt x={P[0]} y={P[1] + 18} fill="#fbbf24">P</Txt>
        <path d={`M${P[0] + 10},${P[1]} L${P[0] + 10},${P[1] - 10} L${P[0]},${P[1] - 10}`} fill="none" stroke="#fbbf24" strokeWidth={1} />
        <MTxt x={C[0] + 16} y={(C[1] + P[1]) / 2} fill="#fbbf24" size={11}>v_c</MTxt>
      </g>
      <g style={V(s, 2)}>
        <line x1={A[0]} y1={A[1] - 4} x2={P[0]} y2={P[1] - 4} stroke={PINK} strokeWidth={3} />
        <MTxt x={(A[0] + P[0]) / 2} y={A[1] - 10} fill={PINK} size={11}>x</MTxt>
        <line x1={P[0]} y1={A[1] - 4} x2={B[0]} y2={B[1] - 4} stroke={CYAN} strokeWidth={3} />
        <MTxt x={(P[0] + B[0]) / 2} y={B[1] - 10} fill={CYAN} size={11}>c − x</MTxt>
      </g>
      <g style={V(s, 3)}>
        <polygon points={`${A} ${P} ${C}`} fill="rgba(255,45,149,0.08)" stroke={PINK} strokeWidth={1.5} />
        <polygon points={`${P} ${B} ${C}`} fill="rgba(0,212,255,0.08)" stroke={CYAN} strokeWidth={1.5} />
        <MTxt x={85} y={160} fill={PINK} size={9}>x²+v²=b²</MTxt>
        <MTxt x={260} y={160} fill={CYAN} size={9}>(c−x)²+v²=a²</MTxt>
      </g>
      <g style={V(s, 4)}><Eq y={18}>c² − 2cx = a² − b²</Eq></g>
      <g style={V(s, 5)}>
        <rect x={55} y={2} width={290} height={26} rx={8} fill="rgba(0,0,0,0.7)" stroke="#22c55e" strokeWidth={1} />
        <MTxt x={200} y={20} fill="#22c55e" size={12}>b² + c² − 2bc·cos α = a²</MTxt>
      </g>
    </g>;
  }
};

// #9 — S = ½cv_c
DIAG[9] = { steps: 3, labels: ["Trojúhelník ABC se základnou c a výškou v_c", "Doplníme na obdélník (c × v_c)", "Trojúhelník = ½ obdélníku → S = ½·c·v_c"],
  render: (s) => {
    const A = [70, 235], B = [330, 235], C = [210, 55];
    const P = [210, 235];
    return <g>
      <polygon points={`${A} ${B} ${C}`} fill="rgba(255,255,255,0.05)" stroke="#fff" strokeWidth={2} />
      <Txt x={A[0] - 12} y={A[1] + 18}>A</Txt><Txt x={B[0] + 12} y={B[1] + 18}>B</Txt><Txt x={C[0] + 5} y={C[1] - 12}>C</Txt>
      <line x1={C[0]} y1={C[1]} x2={P[0]} y2={P[1]} stroke="rgba(255,255,255,0.3)" strokeWidth={1} strokeDasharray="4,3" />
      <MTxt x={(A[0] + B[0]) / 2} y={A[1] + 18} size={11} fill="rgba(255,255,255,0.5)">c</MTxt>
      <MTxt x={P[0] + 14} y={(C[1] + P[1]) / 2} size={11} fill="rgba(255,255,255,0.5)">v_c</MTxt>
      <g style={V(s, 1)}>
        <rect x={A[0]} y={C[1]} width={B[0] - A[0]} height={A[1] - C[1]} fill="none" stroke={CYAN} strokeWidth={2} strokeDasharray="8,4" />
        <MTxt x={B[0] + 5} y={(C[1] + A[1]) / 2} fill={CYAN} size={10} anchor="start">c × v_c</MTxt>
      </g>
      <g style={V(s, 2)}>
        <polygon points={`${A} ${B} ${C}`} fill="rgba(255,45,149,0.15)" stroke={PINK} strokeWidth={2} />
        <Eq y={18}>S = ½ · c · v_c</Eq>
      </g>
    </g>;
  }
};

// #10 — S = ½ab·sin γ
DIAG[10] = { steps: 3, labels: ["Trojúhelník ABC se stranami a, b a úhlem γ", "Výška v z B: sin γ = v/a → v = a·sin γ", "S = ½·b·v = ½·a·b·sin γ"],
  render: (s) => {
    const A = [70, 235], B = [330, 235], C = [160, 55];
    const foot = [330, 55];
    return <g>
      <polygon points={`${A} ${B} ${C}`} fill="rgba(255,255,255,0.03)" stroke="#fff" strokeWidth={2} />
      <Txt x={A[0] - 12} y={A[1] + 18}>A</Txt><Txt x={B[0] + 12} y={B[1] + 18}>B</Txt><Txt x={C[0] - 5} y={C[1] - 12}>C</Txt>
      <path d={angleArc(C[0], C[1], 28, A[0], A[1], B[0], B[1])} fill="none" stroke="#fbbf24" strokeWidth={2} />
      <MTxt x={C[0] + 10} y={C[1] + 36} fill="#fbbf24" size={11}>γ</MTxt>
      <MTxt x={(C[0] + B[0]) / 2 + 14} y={(C[1] + B[1]) / 2} size={11} fill="rgba(255,255,255,0.5)">a</MTxt>
      <MTxt x={(A[0] + C[0]) / 2 - 14} y={(A[1] + C[1]) / 2 - 5} size={11} fill="rgba(255,255,255,0.5)">b</MTxt>
      <g style={V(s, 1)}>
        <line x1={B[0]} y1={B[1]} x2={B[0]} y2={C[1]} stroke={PINK} strokeWidth={2} strokeDasharray="6,3" />
        <line x1={C[0]} y1={C[1]} x2={B[0]} y2={C[1]} stroke="rgba(255,255,255,0.2)" strokeWidth={1} strokeDasharray="4,3" />
        <MTxt x={B[0] + 14} y={(B[1] + C[1]) / 2} fill={PINK} size={11} anchor="start">v</MTxt>
        <MTxt x={250} y={C[1] - 8} fill={PINK} size={10}>v = a·sin γ</MTxt>
      </g>
      <Eq y={18} f={V(s, 2)}>S = ½ · a · b · sin γ</Eq>
    </g>;
  }
};

// #11 — S = oρ/2
DIAG[11] = { steps: 4, labels: ["Trojúhelník ABC s vepsanou kružnicí (ρ)", "Střed I spojen s vrcholy A, B, C", "3 menší trojúhelníky, každý s výškou ρ", "S = ½aρ + ½bρ + ½cρ = oρ/2"],
  render: (s) => {
    const A = [60, 250], B = [340, 250], C = [200, 45];
    const I = [200, 178], rho = 72;
    return <g>
      <polygon points={`${A} ${B} ${C}`} fill="rgba(255,255,255,0.03)" stroke="#fff" strokeWidth={2} />
      <Txt x={A[0] - 12} y={A[1] + 18}>A</Txt><Txt x={B[0] + 12} y={B[1] + 18}>B</Txt><Txt x={C[0]} y={C[1] - 12}>C</Txt>
      <circle cx={I[0]} cy={I[1]} r={rho} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={1.5} />
      <circle cx={I[0]} cy={I[1]} r={3} fill={CYAN} /><Txt x={I[0] + 12} y={I[1] - 8} fill={CYAN} size={11}>I</Txt>
      <MTxt x={(A[0] + B[0]) / 2} y={A[1] + 18} size={10} fill="rgba(255,255,255,0.4)">a (= c)</MTxt>
      <g style={V(s, 1)}>
        <line x1={I[0]} y1={I[1]} x2={A[0]} y2={A[1]} stroke={PINK} strokeWidth={1.5} />
        <line x1={I[0]} y1={I[1]} x2={B[0]} y2={B[1]} stroke={PINK} strokeWidth={1.5} />
        <line x1={I[0]} y1={I[1]} x2={C[0]} y2={C[1]} stroke={PINK} strokeWidth={1.5} />
      </g>
      <g style={V(s, 2)}>
        <polygon points={`${A} ${B} ${I}`} fill="rgba(255,45,149,0.1)" stroke={PINK} strokeWidth={1} />
        <polygon points={`${B} ${C} ${I}`} fill="rgba(0,212,255,0.1)" stroke={CYAN} strokeWidth={1} />
        <polygon points={`${C} ${A} ${I}`} fill="rgba(251,191,36,0.1)" stroke="#fbbf24" strokeWidth={1} />
        <line x1={I[0]} y1={I[1]} x2={I[0]} y2={250} stroke="#22c55e" strokeWidth={1.5} strokeDasharray="4,3" />
        <MTxt x={I[0] + 12} y={215} fill="#22c55e" size={10}>ρ</MTxt>
      </g>
      <Eq y={18} f={V(s, 3)}>S = o · ρ / 2</Eq>
    </g>;
  }
};

// #12 — S = abc/(4r)
DIAG[12] = { steps: 3, labels: ["△ABC s opsanou kružnicí (poloměr r)", "S = ½ab·sin γ a sin γ = c/(2r)", "Dosadíme → S = abc/(4r)"],
  render: (s) => {
    const cx = 200, cy = 148, r = 110;
    const A = ptOn(cx, cy, r, 200), B = ptOn(cx, cy, r, 330), C = ptOn(cx, cy, r, 80);
    return <g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={1.5} />
      <polygon points={`${A} ${B} ${C}`} fill="rgba(255,255,255,0.03)" stroke="#fff" strokeWidth={2} />
      <Txt x={A[0] - 14} y={A[1] + 5}>A</Txt><Txt x={B[0] + 12} y={B[1] + 5}>B</Txt><Txt x={C[0] + 5} y={C[1] - 12}>C</Txt>
      <MTxt x={(A[0] + B[0]) / 2} y={(A[1] + B[1]) / 2 + 18} size={11} fill="rgba(255,255,255,0.5)">c</MTxt>
      <MTxt x={(B[0] + C[0]) / 2 + 14} y={(B[1] + C[1]) / 2} size={11} fill="rgba(255,255,255,0.5)">a</MTxt>
      <MTxt x={(A[0] + C[0]) / 2 - 14} y={(A[1] + C[1]) / 2} size={11} fill="rgba(255,255,255,0.5)">b</MTxt>
      <g style={V(s, 1)}>
        <line x1={cx} y1={cy} x2={B[0]} y2={B[1]} stroke={CYAN} strokeWidth={1} strokeDasharray="4,3" />
        <MTxt x={cx + 8} y={cy - 8} fill={CYAN} size={10}>r</MTxt>
        <path d={angleArc(C[0], C[1], 22, A[0], A[1], B[0], B[1])} fill="none" stroke="#fbbf24" strokeWidth={2} />
        <MTxt x={C[0] - 5} y={C[1] + 32} fill="#fbbf24" size={11}>γ</MTxt>
        <MTxt x={200} y={270} fill="rgba(255,255,255,0.5)" size={10}>sin γ = c/(2r)</MTxt>
      </g>
      <Eq y={18} f={V(s, 2)}>S = abc / (4r)</Eq>
    </g>;
  }
};

// #13 — Počet úhlopříček
DIAG[13] = { steps: 4, labels: ["Šestiúhelník (n = 6)", "Z jednoho vrcholu: (n−3) = 3 úhlopříčky", "Z každého ze 6 vrcholů: 6·3 = 18", "Každá počítána 2× → p = 18/2 = 9"],
  render: (s) => {
    const cx = 200, cy = 140, r = 105;
    const vs = [0, 60, 120, 180, 240, 300].map(a => ptOn(cx, cy, r, a));
    const pts = vs.map(v => v.join(",")).join(" ");
    return <g>
      <polygon points={pts} fill="rgba(255,255,255,0.03)" stroke="#fff" strokeWidth={2} />
      {vs.map((v, i) => <g key={i}><circle cx={v[0]} cy={v[1]} r={4} fill={i === 0 ? PINK : "#fff"} /><Txt x={v[0] + (v[0] > cx ? 12 : -12)} y={v[1] + (v[1] > cy ? 16 : -8)} size={11}>{i + 1}</Txt></g>)}
      <g style={V(s, 1)}>
        {[2, 3, 4].map(i => <line key={i} x1={vs[0][0]} y1={vs[0][1]} x2={vs[i][0]} y2={vs[i][1]} stroke={PINK} strokeWidth={2} />)}
        <MTxt x={340} y={30} fill={PINK} size={11} anchor="end">3 úhlopříčky</MTxt>
      </g>
      <g style={V(s, 2)}>
        {vs.map((v1, i) => vs.filter((_, j) => j !== i && j !== (i + 1) % 6 && j !== (i + 5) % 6).map((v2, k) => <line key={`${i}-${k}`} x1={v1[0]} y1={v1[1]} x2={v2[0]} y2={v2[1]} stroke="rgba(0,212,255,0.3)" strokeWidth={1} />))}
      </g>
      <Eq y={265} f={V(s, 3)}>p = n(n−3)/2 = 9</Eq>
    </g>;
  }
};

// #14 — Součet vnitřních úhlů n-úhelníku
DIAG[14] = { steps: 3, labels: ["Pětiúhelník (n = 5)", "Triangulace z jednoho vrcholu → (n−2) = 3 trojúhelníky", "3 × 180° = 540°"],
  render: (s) => {
    const cx = 200, cy = 140, r = 110;
    const vs = [270, 342, 54, 126, 198].map(a => ptOn(cx, cy, r, a));
    const cols = ["rgba(255,45,149,0.12)", "rgba(0,212,255,0.12)", "rgba(251,191,36,0.12)"];
    const strk = [PINK, CYAN, "#fbbf24"];
    return <g>
      <polygon points={vs.map(v => v.join(",")).join(" ")} fill="rgba(255,255,255,0.03)" stroke="#fff" strokeWidth={2} />
      {vs.map((v, i) => <circle key={i} cx={v[0]} cy={v[1]} r={3} fill={i === 0 ? PINK : "#fff"} />)}
      <g style={V(s, 1)}>
        <line x1={vs[0][0]} y1={vs[0][1]} x2={vs[2][0]} y2={vs[2][1]} stroke={PINK} strokeWidth={1.5} />
        <line x1={vs[0][0]} y1={vs[0][1]} x2={vs[3][0]} y2={vs[3][1]} stroke={PINK} strokeWidth={1.5} />
        {[[0, 1, 2], [0, 2, 3], [0, 3, 4]].map((t, i) => <polygon key={i} points={t.map(j => vs[j].join(",")).join(" ")} fill={cols[i]} stroke={strk[i]} strokeWidth={1} />)}
        {[[0, 1, 2], [0, 2, 3], [0, 3, 4]].map((t, i) => {
          const mx = (vs[t[0]][0] + vs[t[1]][0] + vs[t[2]][0]) / 3;
          const my = (vs[t[0]][1] + vs[t[1]][1] + vs[t[2]][1]) / 3;
          return <MTxt key={i} x={mx} y={my + 4} fill={strk[i]} size={11}>180°</MTxt>;
        })}
      </g>
      <Eq y={265} f={V(s, 2)}>(n−2)·180° = 540°</Eq>
    </g>;
  }
};

// #15 — Obsah pravidelného n-úhelníku
DIAG[15] = { steps: 4, labels: ["Pravidelný šestiúhelník", "Rozklad na 6 rovnoramenných △ ze středu", "Apotéma v_a = a/(2·tg(30°))", "S jednoho △ = a²/(4·tg(30°)), celkem ×6"],
  render: (s) => {
    const cx = 200, cy = 140, r = 105;
    const vs = [0, 60, 120, 180, 240, 300].map(a => ptOn(cx, cy, r, a));
    const cols = ["rgba(255,45,149,0.1)", "rgba(0,212,255,0.1)", "rgba(251,191,36,0.1)", "rgba(255,45,149,0.1)", "rgba(0,212,255,0.1)", "rgba(251,191,36,0.1)"];
    const midA = 30;
    const ap = ptOn(cx, cy, r * Math.cos(30 * RAD), midA);
    return <g>
      <polygon points={vs.map(v => v.join(",")).join(" ")} fill="rgba(255,255,255,0.03)" stroke="#fff" strokeWidth={2} />
      <g style={V(s, 1)}>
        {vs.map((v, i) => <line key={i} x1={cx} y1={cy} x2={v[0]} y2={v[1]} stroke="rgba(255,255,255,0.4)" strokeWidth={1} />)}
        {vs.map((v, i) => <polygon key={i} points={`${cx},${cy} ${v.join(",")} ${vs[(i + 1) % 6].join(",")}`} fill={cols[i]} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />)}
        <circle cx={cx} cy={cy} r={3} fill={CYAN} />
      </g>
      <g style={V(s, 2)}>
        <polygon points={`${cx},${cy} ${vs[0].join(",")} ${vs[1].join(",")}`} fill="rgba(255,45,149,0.2)" stroke={PINK} strokeWidth={2} />
        <line x1={cx} y1={cy} x2={ap[0]} y2={ap[1]} stroke="#22c55e" strokeWidth={2} strokeDasharray="5,3" />
        <MTxt x={ap[0] + 14} y={ap[1] + 4} fill="#22c55e" size={10}>v_a</MTxt>
        <MTxt x={(vs[0][0] + vs[1][0]) / 2 + 14} y={(vs[0][1] + vs[1][1]) / 2} fill="rgba(255,255,255,0.6)" size={10}>a</MTxt>
      </g>
      <Eq y={265} f={V(s, 3)}>S = n·a²/(4·tg(180°/n))</Eq>
    </g>;
  }
};

// #16 — Obsah lichoběžníku
DIAG[16] = { steps: 4, labels: ["Lichoběžník ABCD, základny a, c, výška v", "Úhlopříčka AC rozdělí na 2 trojúhelníky", "S₁ = ½av (△ABC), S₂ = ½cv (△ACD)", "S = S₁ + S₂ = (a+c)·v/2"],
  render: (s) => {
    const A = [60, 230], B = [340, 230], C2 = [270, 70], D = [130, 70];
    return <g>
      <polygon points={`${A} ${B} ${C2} ${D}`} fill="rgba(255,255,255,0.03)" stroke="#fff" strokeWidth={2} />
      <Txt x={A[0] - 12} y={A[1] + 18}>A</Txt><Txt x={B[0] + 12} y={B[1] + 18}>B</Txt><Txt x={C2[0] + 12} y={C2[1] - 5}>C</Txt><Txt x={D[0] - 12} y={D[1] - 5}>D</Txt>
      <MTxt x={(A[0] + B[0]) / 2} y={A[1] + 18} size={11} fill="rgba(255,255,255,0.5)">a</MTxt>
      <MTxt x={(D[0] + C2[0]) / 2} y={D[1] - 12} size={11} fill="rgba(255,255,255,0.5)">c</MTxt>
      <line x1={350} y1={70} x2={350} y2={230} stroke="rgba(255,255,255,0.2)" strokeWidth={1} strokeDasharray="4,3" />
      <MTxt x={362} y={150} fill="rgba(255,255,255,0.4)" size={10} anchor="start">v</MTxt>
      <g style={V(s, 1)}>
        <line x1={A[0]} y1={A[1]} x2={C2[0]} y2={C2[1]} stroke={CYAN} strokeWidth={2} />
      </g>
      <g style={V(s, 2)}>
        <polygon points={`${A} ${B} ${C2}`} fill="rgba(255,45,149,0.12)" stroke={PINK} strokeWidth={1.5} />
        <polygon points={`${A} ${C2} ${D}`} fill="rgba(0,212,255,0.12)" stroke={CYAN} strokeWidth={1.5} />
        <MTxt x={220} y={190} fill={PINK} size={10}>½av</MTxt>
        <MTxt x={150} y={140} fill={CYAN} size={10}>½cv</MTxt>
      </g>
      <Eq y={18} f={V(s, 3)}>S = (a + c) · v / 2</Eq>
    </g>;
  }
};

/* ════════════════════════════════════════════════════════════════
   PROOF DATA — all 16 proofs
   ════════════════════════════════════════════════════════════════ */
const proofGroups = [
  {
    title: "Trojúhelník — základní",
    proofs: [
      {
        id: 1,
        name: "Součet vnitřních úhlů trojúhelníku = 180°",
        statement: "Součet vnitřních úhlů libovolného trojúhelníku je 180°.",
        difficulty: "easy",
        steps: [
          "Mějme trojúhelník ABC s vnitřními úhly α, β, γ.",
          "Bodem C vedeme rovnoběžku p s přímkou AB.",
          "Rovnoběžka p vytvoří s přímkami CA a CB střídavé úhly.",
          "Úhel mezi CA a rovnoběžkou p na jedné straně = α (střídavé úhly u rovnoběžek).",
          "Úhel mezi CB a rovnoběžkou p na druhé straně = β (střídavé úhly u rovnoběžek).",
          "Tyto dva úhly spolu s úhlem γ tvoří přímý úhel (leží na rovnoběžce p kolem bodu C).",
          "Přímý úhel = 180°, tedy α + β + γ = 180°. □",
        ],
        keyIdea: "Rovnoběžka vedená vrcholem + střídavé úhly u rovnoběžek.",
      },
      {
        id: 2,
        name: "Pythagorova věta (bez kosinové a Eukleidových vět)",
        statement: "Je dán pravoúhlý trojúhelník ABC se stranami a, b, c. Dokažte, že platí a² + b² = c².",
        difficulty: "medium",
        steps: [
          "Sestrojíme čtverec o straně (a + b). Jeho obsah je (a + b)².",
          "Dovnitř vepíšeme čtverec o straně c tak, že v každém rohu velkého čtverce vznikne pravoúhlý trojúhelník s odvěsnami a, b.",
          "Obsah velkého čtverce = obsah vnitřního čtverce + 4 × obsah trojúhelníku:",
          "(a + b)² = c² + 4 · (½ab)",
          "a² + 2ab + b² = c² + 2ab",
          "Odečteme 2ab z obou stran:",
          "a² + b² = c² □",
        ],
        keyIdea: "Geometrický důkaz pomocí dvou rozkladů obsahu čtverce o straně (a + b).",
      },
      {
        id: 3,
        name: "Eukleidova věta o výšce: v_c² = c_a · c_b",
        statement: "V pravoúhlém trojúhelníku ABC s pravým úhlem při C je P pata výšky v_c. Pak platí v_c² = c_a · c_b.",
        difficulty: "medium",
        steps: [
          "Výškou v_c z C na AB vzniknou dva menší trojúhelníky: △APC a △BPC.",
          "△APC ~ △BPC (oba pravoúhlé, sdílejí úhel při P, třetí úhly jsou komplementární).",
          "Z podobnosti: |AP|/|CP| = |CP|/|BP|, tj. c_b/v_c = v_c/c_a.",
          "Vynásobíme křížem: v_c² = c_a · c_b. □",
        ],
        keyIdea: "Podobnost dvou dílčích trojúhelníků vzniklých spuštěním výšky na přeponu.",
      },
      {
        id: 4,
        name: "Eukleidova věta o odvěsně: a² = c · c_a",
        statement: "V pravoúhlém trojúhelníku ABC s pravým úhlem při C platí a² = c · c_a a b² = c · c_b.",
        difficulty: "medium",
        steps: [
          "Opět spustíme výšku v_c z C na AB, pata P.",
          "△BPC ~ △ABC (oba pravoúhlé, sdílejí úhel β).",
          "Z podobnosti: a/c = c_a/a → a² = c · c_a.",
          "Analogicky △APC ~ △ABC (sdílejí úhel α).",
          "Z podobnosti: b/c = c_b/b → b² = c · c_b. □",
        ],
        keyIdea: "Podobnost dílčího trojúhelníku s celým trojúhelníkem ABC.",
      },
      {
        id: 5,
        name: "Středový a obvodový úhel: |∠ASB| = 2·|∠AXB|",
        statement: "Na kružnici k se středem S je oblouk AB. Bod X leží na opačném oblouku. Pak |∠ASB| = 2·|∠AXB|.",
        difficulty: "hard",
        steps: [
          "Vedeme polopřímku XS a prodloužíme ji přes S na kružnici — průsečík nazveme D.",
          "Trojúhelník XSA je rovnoramenný (|XS| = |SA| = r), proto ∠SXA = ∠SAX = φ.",
          "Vnější úhel △XSA při S: ∠ASD = 2φ (vnější úhel = součet nesousedních vnitřních).",
          "Analogicky trojúhelník XSB je rovnoramenný, ∠SXB = ∠SBX = ψ, vnější úhel ∠BSD = 2ψ.",
          "∠AXB = φ + ψ (nebo |φ − ψ| podle polohy X).",
          "∠ASB = ∠ASD + ∠DSB = 2φ + 2ψ = 2(φ + ψ) = 2·∠AXB. □",
        ],
        keyIdea: "Pomocná úsečka přes střed + rovnoramenné trojúhelníky (poloměr = poloměr) + vnější úhel.",
      },
    ],
  },
  {
    title: "Sinová a kosinová věta",
    proofs: [
      {
        id: 6,
        name: "Sinová věta: a/sin α = b/sin β",
        statement: "V ostroúhlém trojúhelníku ABC platí a/sin α = b/sin β.",
        difficulty: "medium",
        steps: [
          "Z vrcholu C spustíme výšku v_c na stranu AB (nebo její prodloužení). Označíme patu P.",
          "V pravoúhlém △APC: sin α = v_c / b → v_c = b · sin α.",
          "V pravoúhlém △BPC: sin β = v_c / a → v_c = a · sin β.",
          "Oba výrazy se rovnají v_c, proto: b · sin α = a · sin β.",
          "Vydělíme sin α · sin β: b/sin β = a/sin α. □",
        ],
        keyIdea: "Výška trojúhelníku vyjádřená dvěma způsoby pomocí sinu úhlu.",
      },
      {
        id: 7,
        name: "Poloměr opsané kružnice: r = a/(2 sin α)",
        statement: "Kružnice opsaná ostroúhlému trojúhelníku ABC má poloměr r = a/(2 sin α).",
        difficulty: "hard",
        steps: [
          "Sestrojíme průměr BD kružnice opsané (B na kružnici, D diametrálně protilehlý).",
          "∠BDA je obvodový úhel nad tětivou BA → ∠BDA = α (stejný oblouk jako ∠BCA).",
          "Trojúhelník BDA má pravý úhel při A (Thaletova věta — BD je průměr).",
          "V pravoúhlém △BDA: sin(∠BDA) = |BA|/|BD| → sin α = a/(2r).",
          "Vyjádříme: r = a/(2 sin α). □",
        ],
        keyIdea: "Thaletova věta (úhel v půlkruhu = 90°) + obvodový úhel nad stejným obloukem.",
      },
      {
        id: 8,
        name: "Kosinová věta: c² = a² + b² − 2ab·cos γ",
        statement: "V ostroúhlém trojúhelníku ABC platí c² = a² + b² − 2ab · cos γ.",
        difficulty: "hard",
        steps: [
          "Spustíme výšku v_c z vrcholu C na stranu c (stranu AB). Patu označíme P.",
          "Označíme |AP| = x, potom |PB| = c − x.",
          "Trojúhelníky △APC a △CPB jsou pravoúhlé (v_c je výška). Aplikujeme Pythagorovu větu:",
          "I. △APC: x² + v_c² = b²",
          "II. △CPB: (c − x)² + v_c² = a²",
          "Odečteme rovnici I od rovnice II:",
          "(c − x)² − x² = a² − b²",
          "Roznásobíme: c² − 2cx + x² − x² = a² − b²",
          "Členy x² se odečtou: c² − 2cx = a² − b²  … (*)",
          "Potřebujeme vyjádřit x. Z pravoúhlého △APC: cos α = x/b, tedy x = b · cos α.",
          "Dosadíme do (*): c² − 2·(b cos α)·c = a² − b²",
          "Přeneseme b² na levou stranu: b² + c² − 2bc · cos α = a²",
          "Což je kosinová věta (pro stranu a protilehlou úhlu α). Analogicky pro jakýkoliv úhel. □",
        ],
        keyIdea: "Výška na stranu c → dva pravoúhlé trojúhelníky → PV → odečtení rovnic → substituce cos α = x/b.",
        professorNote: "Toto je přesný postup, který ukázal pan profesor ve vzorovém řešení.",
      },
    ],
  },
  {
    title: "Obsahy trojúhelníku",
    proofs: [
      {
        id: 9,
        name: "S = ½ · c · v_c (z obsahu obdélníku)",
        statement: "Odvoďte vztah pro obsah trojúhelníku S = ½ c · v_c z obsahu obdélníku.",
        difficulty: "easy",
        steps: [
          "Sestrojíme obdélník, jehož jedna strana je strana c trojúhelníku a výška je v_c.",
          "Obsah obdélníku = c · v_c.",
          "Úhlopříčka obdélníku by ho rozdělila na dva shodné pravoúhlé trojúhelníky.",
          "Náš trojúhelník ABC se stranou c a výškou v_c má přesně poloviční obsah oproti obdélníku (lze ukázat doplněním na obdélník).",
          "Proto S = ½ · c · v_c. □",
        ],
        keyIdea: "Trojúhelník = polovina obdélníku se stejnou základnou a výškou.",
      },
      {
        id: 10,
        name: "S = ½ · a · b · sin γ",
        statement: "Obsah trojúhelníku ABC se vypočítá podle vzorce S = ½ ab · sin γ.",
        difficulty: "medium",
        steps: [
          "Víme, že S = ½ · a · v_a (základna a, příslušná výška v_a).",
          "Výšku v_a (z vrcholu A na stranu a) lze vyjádřit z pravoúhlého trojúhelníku:",
          "sin γ = v_a / b → v_a = b · sin γ.",
          "Dosadíme: S = ½ · a · (b · sin γ) = ½ ab · sin γ. □",
        ],
        keyIdea: "Výška vyjádřená pomocí sinu protilehlého úhlu.",
      },
      {
        id: 11,
        name: "S = o·ρ/2 (kružnice vepsaná)",
        statement: "Pro trojúhelník s obvodem o a poloměrem vepsané kružnice ρ platí S = o·ρ/2.",
        difficulty: "medium",
        steps: [
          "Střed vepsané kružnice I spojíme s vrcholy A, B, C. Vzniknou tři menší trojúhelníky: △AIB, △BIC, △CIA.",
          "Výška každého menšího trojúhelníku z I na příslušnou stranu = ρ (poloměr vepsané kružnice, protože I je středem kružnice tečné ke všem stranám).",
          "S(△BIC) = ½ · a · ρ",
          "S(△CIA) = ½ · b · ρ",
          "S(△AIB) = ½ · c · ρ",
          "S(△ABC) = S(△BIC) + S(△CIA) + S(△AIB) = ½ρ(a + b + c) = ½ · o · ρ = o·ρ/2. □",
        ],
        keyIdea: "Rozklad trojúhelníku na tři díly se společným vrcholem ve středu vepsané kružnice.",
      },
      {
        id: 12,
        name: "S = abc/(4r) (kružnice opsaná)",
        statement: "Pro trojúhelník ABC s opsanou kružnicí o poloměru r platí S = abc/(4r).",
        difficulty: "medium",
        steps: [
          "Z důkazu #10 víme: S = ½ ab · sin γ.",
          "Ze sinové věty: a/sin α = 2r, tedy sin α = a/(2r).",
          "Ale potřebujeme sin γ. Ze sinové věty: c/sin γ = 2r → sin γ = c/(2r).",
          "Dosadíme do vzorce pro obsah: S = ½ · a · b · (c/(2r)) = abc/(4r). □",
        ],
        keyIdea: "Kombinace vzorce S = ½ab·sin γ se sinovou větou (sin γ = c/2r).",
      },
    ],
  },
  {
    title: "Mnohoúhelníky a lichoběžník",
    proofs: [
      {
        id: 13,
        name: "Počet úhlopříček: p = n(n−3)/2",
        statement: "Konvexní n-úhelník má p = n(n−3)/2 úhlopříček.",
        difficulty: "easy",
        steps: [
          "Z každého vrcholu vedeme úhlopříčky ke všem ostatním vrcholům kromě sebe a dvou sousedních.",
          "Z jednoho vrcholu tedy vede (n − 3) úhlopříček.",
          "Vrcholů je n, celkem bychom napočítali n · (n − 3) úhlopříček.",
          "Každou úhlopříčku jsme ale počítali dvakrát (jednou z každého jejího koncového bodu).",
          "Proto p = n(n − 3)/2. □",
        ],
        keyIdea: "Každý vrchol → (n−3) úhlopříček, dělíme 2 (každá počítána dvakrát).",
      },
      {
        id: 14,
        name: "Součet vnitřních úhlů n-úhelníku: (n−2)·180°",
        statement: "Součet vnitřních úhlů konvexního n-úhelníku je (n − 2) · 180°.",
        difficulty: "easy",
        steps: [
          "Zvolíme jeden vrchol konvexního n-úhelníku.",
          "Z tohoto vrcholu vedeme úhlopříčky ke všem ostatním nesousedním vrcholům.",
          "Tím se n-úhelník rozloží na (n − 2) trojúhelníků.",
          "Součet vnitřních úhlů v každém trojúhelníku je 180°.",
          "Celkový součet = (n − 2) · 180°. □",
        ],
        keyIdea: "Triangulace z jednoho vrcholu → (n−2) trojúhelníků.",
      },
      {
        id: 15,
        name: "Obsah pravidelného n-úhelníku: S = na²/(4·tg(180°/n))",
        statement: "Pravidelný n-úhelník o straně a má obsah S = na²/(4·tg(180°/n)).",
        difficulty: "hard",
        steps: [
          "Spojíme střed pravidelného n-úhelníku se všemi vrcholy. Vznikne n shodných rovnoramenných trojúhelníků.",
          "Každý trojúhelník má základnu a (strana n-úhelníku) a úhel při středu = 360°/n.",
          "Potřebujeme výšku (apotéma) takového trojúhelníku. Výška rozdělí základnu na a/2 a úhel na 180°/n.",
          "tg(180°/n) = (a/2)/v_a → v_a = a/(2·tg(180°/n)).",
          "Obsah jednoho trojúhelníku = ½ · a · v_a = ½ · a · a/(2·tg(180°/n)) = a²/(4·tg(180°/n)).",
          "Celkový obsah = n · a²/(4·tg(180°/n)). □",
        ],
        keyIdea: "Rozklad na n rovnoramenných trojúhelníků + apotéma pomocí tangenty.",
      },
      {
        id: 16,
        name: "Obsah lichoběžníku: S = (a+c)·v/2",
        statement: "Lichoběžník se základnami a, c a výškou v má obsah S = (a + c) · v / 2.",
        difficulty: "easy",
        steps: [
          "Lichoběžník ABCD má rovnoběžné základny AB = a a CD = c, výška = v.",
          "Vedeme úhlopříčku AC (nebo BD). Tím se lichoběžník rozdělí na dva trojúhelníky.",
          "△ABC má základnu a a výšku v (vzdálenost D od AB = vzdálenost C od AB = v): S₁ = ½ · a · v.",
          "△ACD má základnu c a výšku v (vzdálenost A od CD = v): S₂ = ½ · c · v.",
          "S = S₁ + S₂ = ½av + ½cv = (a + c) · v / 2. □",
        ],
        keyIdea: "Úhlopříčka rozdělí lichoběžník na dva trojúhelníky se stejnou výškou.",
      },
    ],
  },
];

/* ════════════════════════════════════════════════════════════════
   QUIZ QUESTIONS
   ════════════════════════════════════════════════════════════════ */
const quizQuestions = [
  {
    question: "Jak dokážeme, že součet vnitřních úhlů trojúhelníku je 180°?",
    type: "single",
    options: [
      "Vedeme rovnoběžku s jednou stranou přes protější vrchol a použijeme střídavé úhly",
      "Rozložíme trojúhelník na dva pravoúhlé trojúhelníky",
      "Použijeme sinovou větu",
      "Měříme úhly úhloměrem ve více trojúhelnících",
    ],
    correct: [0],
    explanation: "Klíčem je vedení rovnoběžky s jednou stranou přes protější vrchol. Střídavé úhly u rovnoběžek pak dají α a β po stranách úhlu γ, a dohromady tvoří přímý úhel 180°.",
  },
  {
    question: "V důkazu Pythagorovy věty (čtverec o straně a+b) se po roznásobení a odečtení 2ab dostaneme k:",
    type: "single",
    options: [
      "a² + b² = c²",
      "a² − b² = c²",
      "(a − b)² = c²",
      "2ab = c²",
    ],
    correct: [0],
    explanation: "(a + b)² = c² + 4·(½ab) → a² + 2ab + b² = c² + 2ab → a² + b² = c².",
  },
  {
    question: "Eukleidova věta o výšce říká, že v_c² = c_a · c_b. Na čem je založen důkaz?",
    type: "single",
    options: [
      "Podobnost trojúhelníků △APC a △BPC",
      "Pythagorova věta aplikovaná dvakrát",
      "Sinová věta",
      "Obsah trojúhelníku vyjádřený dvěma způsoby",
    ],
    correct: [0],
    explanation: "Oba trojúhelníky △APC a △BPC jsou pravoúhlé a mají společný úhel, takže jsou si podobné. Z poměru stran: c_b/v_c = v_c/c_a → v_c² = c_a · c_b.",
  },
  {
    question: "Co je klíčovým krokem v důkazu věty o středovém a obvodovém úhlu?",
    type: "single",
    options: [
      "Vedení polopřímky přes střed kružnice a využití rovnoramenných trojúhelníků",
      "Použití sinové věty",
      "Thaletova věta",
      "Rozložení na dva pravoúhlé trojúhelníky",
    ],
    correct: [0],
    explanation: "Vedeme polopřímku z X přes střed S. Vzniknou rovnoramenné trojúhelníky (poloměr = poloměr), kde vnější úhel = 2× základnový úhel.",
  },
  {
    question: "V důkazu sinové věty vyjádříme výšku v_c dvěma způsoby. Které to jsou?",
    type: "single",
    options: [
      "v_c = b · sin α a v_c = a · sin β",
      "v_c = a · cos α a v_c = b · cos β",
      "v_c = c · sin α a v_c = c · sin β",
      "v_c = a · sin α a v_c = b · sin β",
    ],
    correct: [0],
    explanation: "Z △APC: sin α = v_c/b → v_c = b·sin α. Z △BPC: sin β = v_c/a → v_c = a·sin β. Porovnáním: b·sin α = a·sin β.",
  },
  {
    question: "Jaký trik používáme v důkazu r = a/(2 sin α)?",
    type: "single",
    options: [
      "Sestrojíme průměr kružnice a využijeme Thaletovu větu",
      "Použijeme kosinovou větu",
      "Vypočítáme obsah trojúhelníku dvěma způsoby",
      "Aplikujeme Eukleidovu větu o odvěsně",
    ],
    correct: [0],
    explanation: "Průměr BD vytvoří trojúhelník BDA s pravým úhlem při A (Thales). Obvodový úhel ∠BDA = α. Pak sin α = a/(2r).",
  },
  {
    question: "V důkazu kosinové věty (postup pana profesora) — co odečítáme?",
    type: "single",
    options: [
      "Pythagorovu větu pro △APC od Pythagorovy věty pro △CPB",
      "Kosinovou větu pro jeden trojúhelník od druhého",
      "Sinovou větu od Pythagorovy věty",
      "Obsah △APC od obsahu △CPB",
    ],
    correct: [0],
    explanation: "Z PV pro △APC: x² + v_c² = b². Z PV pro △CPB: (c−x)² + v_c² = a². Odečtením první od druhé eliminujeme v_c² a dostaneme c² − 2cx = a² − b².",
  },
  {
    question: "Po odečtení rovnic v důkazu kosinové věty dostaneme c² − 2cx = a² − b². Jak vyjádříme x?",
    type: "single",
    options: [
      "x = b · cos α (z pravoúhlého △APC)",
      "x = a · cos β (z pravoúhlého △BPC)",
      "x = c/2 (střed přepony)",
      "x = v_c · sin α",
    ],
    correct: [0],
    explanation: "V pravoúhlém △APC je cos α = x/b, tedy x = b·cos α. Dosadíme do (*) a po úpravě dostaneme b² + c² − 2bc·cos α = a².",
  },
  {
    question: "Proč má konvexní n-úhelník právě n(n−3)/2 úhlopříček?",
    type: "single",
    options: [
      "Z každého vrcholu vede (n−3) úhlopříček, celkem n(n−3), ale každá je počítána dvakrát",
      "Z Eulerova vzorce pro mnohoúhelníky",
      "Protože úhlopříček je vždy o 3 méně než počet stran",
      "Z kombinatorického vzorce pro kombinace bez opakování",
    ],
    correct: [0],
    explanation: "Z každého z n vrcholů vedeme úhlopříčky do (n−3) vrcholů (ne do sebe a dvou sousedních). Každá úhlopříčka je počítána ze dvou konců → n(n−3)/2.",
    tip: "Pro kontrolu: šestiúhelník (n=6) → 6·3/2 = 9 úhlopříček.",
  },
  {
    question: "Vzorec pro obsah trojúhelníku S = abc/(4r) kombinuje které dva vztahy?",
    type: "single",
    options: [
      "S = ½ab·sin γ a sinovou větu (sin γ = c/2r)",
      "Pythagorovu větu a Eukleidovu větu",
      "Kosinovou větu a vzorec S = ½cv_c",
      "Héronův vzorec a sinovou větu",
    ],
    correct: [0],
    explanation: "Začneme S = ½ab·sin γ. Ze sinové věty c/sin γ = 2r → sin γ = c/(2r). Dosadíme: S = ½·a·b·c/(2r) = abc/(4r).",
  },
  {
    question: "Jak dokážeme vzorec pro obsah trojúhelníku S = o·ρ/2?",
    type: "single",
    options: [
      "Rozložíme trojúhelník na 3 menší se společným vrcholem ve středu vepsané kružnice",
      "Použijeme Héronův vzorec a dosadíme ρ",
      "Z kosinové věty odvodíme obsah",
      "Z Pythagorovy věty pro pravoúhlý trojúhelník",
    ],
    correct: [0],
    explanation: "Spojíme střed vepsané kružnice I se všemi vrcholy. Každý z 3 trojúhelníků má výšku ρ. Součet obsahů = ½aρ + ½bρ + ½cρ = ρ(a+b+c)/2 = oρ/2.",
  },
  {
    question: "Jak se odvozuje vzorec pro obsah pravidelného n-úhelníku?",
    type: "single",
    options: [
      "Rozklad na n rovnoramenných trojúhelníků + výpočet apotémy pomocí tangenty",
      "Postupné přidávání trojúhelníků od jedné strany",
      "Z obsahu opsané kružnice",
      "Limita obdélníků",
    ],
    correct: [0],
    explanation: "Ze středu vedeme spojnice ke všem vrcholům → n shodných rovnoramenných △. Apotéma (výška △) = a/(2·tg(180°/n)). Obsah jednoho △ = a²/(4·tg(180°/n)), celkem × n.",
  },
];

/* ════════════════════════════════════════════════════════════════
   FLASHCARDS
   ════════════════════════════════════════════════════════════════ */
const flashcards = [
  { front: "Součet vnitřních úhlů △", back: "α + β + γ = 180°\n\nDůkaz: rovnoběžka přes vrchol + střídavé úhly" },
  { front: "Pythagorova věta", back: "a² + b² = c²\n\nDůkaz: čtverec o straně (a+b) s vepsaným čtvercem o straně c" },
  { front: "Eukleidova věta o výšce", back: "v_c² = c_a · c_b\n\nDůkaz: podobnost △APC ~ △BPC" },
  { front: "Eukleidova věta o odvěsně", back: "a² = c · c_a, b² = c · c_b\n\nDůkaz: podobnost △BPC ~ △ABC" },
  { front: "Středový a obvodový úhel", back: "∠ASB = 2 · ∠AXB\n\nDůkaz: polopřímka přes S + rovnoramenné △" },
  { front: "Sinová věta", back: "a/sin α = b/sin β\n\nDůkaz: výška v_c = b·sin α = a·sin β" },
  { front: "Poloměr opsané kružnice", back: "r = a/(2 sin α)\n\nDůkaz: průměr kružnice + Thales + obvodový úhel" },
  { front: "Kosinová věta", back: "c² = a² + b² − 2ab·cos γ\n\nDůkaz: výška na stranu c → dva pravoúhlé △ → PV → odečtení → substituce x = b·cos α" },
  { front: "S = ½ · c · v_c", back: "Trojúhelník = polovina obdélníku\nse stejnou základnou a výškou" },
  { front: "S = ½ ab · sin γ", back: "Z S = ½ · a · v_a\na v_a = b · sin γ" },
  { front: "S = o·ρ/2", back: "Rozklad na 3 △ ze středu vepsané kružnice\nKaždý má výšku ρ" },
  { front: "S = abc/(4r)", back: "S = ½ab·sin γ + sinová věta\nsin γ = c/(2r)" },
  { front: "Úhlopříčky n-úhelníku", back: "p = n(n−3)/2\n\nKaždý vrchol → (n−3) úhlopříček, dělíme 2" },
  { front: "Součet úhlů n-úhelníku", back: "(n−2) · 180°\n\nTriangulace z jednoho vrcholu → (n−2) trojúhelníků" },
  { front: "Obsah pravidelného n-úhelníku", back: "S = na²/(4·tg(180°/n))\n\nn trojúhelníků, apotéma = a/(2·tg(180°/n))" },
  { front: "Obsah lichoběžníku", back: "S = (a+c)·v/2\n\nÚhlopříčka → 2 trojúhelníky se stejnou výškou v" },
];

/* ════════════════════════════════════════════════════════════════
   MAIN APP
   ════════════════════════════════════════════════════════════════ */
export default function App() {
  const [tab, setTab] = useState("proofs");
  const [openProof, setOpenProof] = useState(null);
  const [showSolution, setShowSolution] = useState({});
  const [flashIdx, setFlashIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [proofGroupIdx, setProofGroupIdx] = useState(0);

  const tabs = [
    { id: "proofs", label: "Důkazy" },
    { id: "quiz", label: "Kvíz" },
    { id: "flashcards", label: "Kartičky" },
    { id: "formulas", label: "Vzorce" },
  ];

  const diffBadge = (d) => {
    const map = { easy: { label: "Easy ✨", color: "#22c55e" }, medium: { label: "Medium ⚡", color: "#f59e0b" }, hard: { label: "Hard 🔥", color: "#ef4444" } };
    const { label, color } = map[d] || map.easy;
    return (
      <span style={{ fontSize: "11px", padding: "2px 10px", borderRadius: "20px", background: color + "22", color, border: `1px solid ${color}44`, fontWeight: 600 }}>{label}</span>
    );
  };

  const toggleSolution = (id) => setShowSolution(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a1a", color: "#fff", fontFamily: "'Exo 2', sans-serif", position: "relative", overflow: "hidden" }}>
      {/* Synthwave background */}
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", bottom: "30%", left: "50%", transform: "translateX(-50%)", width: "300px", height: "300px", borderRadius: "50%", background: "linear-gradient(180deg, #ff6b35 0%, #ff2d95 50%, #b829dd 100%)", boxShadow: "0 0 60px #ff2d9544, 0 0 120px #b829dd33", opacity: 0.4, animation: "pulseSun 20s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "50%", background: "linear-gradient(180deg, transparent 0%, #0a0a1a 40%)", zIndex: 1 }} />
        {[...Array(8)].map((_, i) => (
          <div key={i} style={{ position: "absolute", width: `${6 + i * 2}px`, height: `${6 + i * 2}px`, borderRadius: "50%", background: i % 2 === 0 ? PINK : CYAN, opacity: 0.15, top: `${10 + i * 11}%`, left: `${5 + i * 12}%`, animation: `floatParticle ${12 + i * 2}s ease-in-out infinite`, animationDelay: `${i * 1.5}s` }} />
        ))}
      </div>

      <style>{`
        @keyframes pulseSun { 0%, 100% { opacity: 0.35; transform: translateX(-50%) scale(1); } 50% { opacity: 0.5; transform: translateX(-50%) scale(1.05); } }
        @keyframes floatParticle { 0%, 100% { transform: translateY(0) translateX(0); } 33% { transform: translateY(-30px) translateX(20px); } 66% { transform: translateY(15px) translateX(-15px); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes flipIn { from { transform: rotateY(90deg); } to { transform: rotateY(0deg); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button { font-family: 'Exo 2', sans-serif; }
        button:disabled { opacity: 0.4; cursor: not-allowed; }
      `}</style>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2, maxWidth: "900px", margin: "0 auto", padding: "24px 16px 60px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px", animation: "fadeIn 0.6s ease" }}>
          <h1 style={{ fontFamily: "'Audiowide', cursive", fontSize: "clamp(22px, 5vw, 36px)", background: `linear-gradient(135deg, ${PINK}, ${CYAN})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "8px" }}>
            Planimetrické důkazy
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>16 důkazů — kompletní příprava na písemku</p>
        </div>

        {/* Tab bar */}
        <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap", marginBottom: "28px" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "10px 22px", borderRadius: "30px", border: tab === t.id ? `1px solid ${PINK}` : "1px solid rgba(255,255,255,0.12)", background: tab === t.id ? PINK + "33" : "rgba(255,255,255,0.05)", color: tab === t.id ? "#fff" : "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: "14px", fontWeight: 600, transition: "all 0.4s ease", fontFamily: "'Exo 2', sans-serif" }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ─── PROOFS TAB ─── */}
        {tab === "proofs" && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            {/* Sub-tabs for proof groups */}
            <div style={{ display: "flex", gap: "6px", justifyContent: "center", flexWrap: "wrap", marginBottom: "20px" }}>
              {proofGroups.map((g, gi) => (
                <button key={gi} onClick={() => setProofGroupIdx(gi)} style={{ padding: "7px 16px", borderRadius: "20px", border: proofGroupIdx === gi ? `1px solid ${CYAN}` : "1px solid rgba(255,255,255,0.08)", background: proofGroupIdx === gi ? CYAN + "22" : "rgba(255,255,255,0.03)", color: proofGroupIdx === gi ? CYAN : "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "12px", fontWeight: 500, transition: "all 0.4s ease", fontFamily: "'Exo 2', sans-serif" }}>
                  {g.title}
                </button>
              ))}
            </div>

            {/* Proofs list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {proofGroups[proofGroupIdx].proofs.map((proof, pi) => {
                const isOpen = openProof === proof.id;
                const solutionVisible = showSolution[proof.id];
                return (
                  <div key={proof.id} style={{ ...cardStyle, animation: `fadeIn 0.5s ease ${pi * 0.08}s both` }}>
                    {/* Proof header */}
                    <div onClick={() => setOpenProof(isOpen ? null : proof.id)} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                      <span style={{ ...mono, fontSize: "13px", color: CYAN, fontWeight: 600, minWidth: "28px" }}>#{proof.id}</span>
                      <span style={{ flex: 1, fontSize: "15px", fontWeight: 600, minWidth: "200px" }}>{proof.name}</span>
                      {diffBadge(proof.difficulty)}
                      <span style={{ fontSize: "18px", transition: "transform 0.4s ease", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", color: "rgba(255,255,255,0.4)" }}>▼</span>
                    </div>

                    {/* Expanded content */}
                    {isOpen && (
                      <div style={{ marginTop: "16px", animation: "fadeIn 0.4s ease" }}>
                        {/* Animated diagram */}
                        {DIAG[proof.id] && (
                          <StepDiagram maxSteps={DIAG[proof.id].steps} labels={DIAG[proof.id].labels}>
                            {(step) => DIAG[proof.id].render(step)}
                          </StepDiagram>
                        )}
                        {/* Statement */}
                        <div style={{ padding: "14px 18px", borderRadius: "14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", marginBottom: "14px" }}>
                          <div style={{ fontSize: "11px", color: PINK, fontWeight: 700, textTransform: "uppercase", marginBottom: "6px", letterSpacing: "0.5px" }}>Zadání</div>
                          <div style={{ fontSize: "14px", lineHeight: 1.6, color: "rgba(255,255,255,0.85)" }}>{proof.statement}</div>
                        </div>

                        {/* Key idea */}
                        <div style={{ padding: "10px 16px", borderRadius: "12px", background: CYAN + "0d", border: `1px solid ${CYAN}22`, marginBottom: "14px", display: "flex", gap: "8px", alignItems: "flex-start" }}>
                          <span style={{ fontSize: "16px" }}>💡</span>
                          <div>
                            <div style={{ fontSize: "11px", color: CYAN, fontWeight: 700, textTransform: "uppercase", marginBottom: "3px" }}>Klíčová myšlenka</div>
                            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>{proof.keyIdea}</div>
                          </div>
                        </div>

                        {/* Professor note */}
                        {proof.professorNote && (
                          <div style={{ padding: "10px 16px", borderRadius: "12px", background: "#f59e0b0d", border: "1px solid #f59e0b22", marginBottom: "14px", display: "flex", gap: "8px", alignItems: "flex-start" }}>
                            <span style={{ fontSize: "16px" }}>📝</span>
                            <div style={{ fontSize: "13px", color: "#fbbf24", lineHeight: 1.5, fontStyle: "italic" }}>{proof.professorNote}</div>
                          </div>
                        )}

                        {/* Solution toggle */}
                        <button onClick={() => toggleSolution(proof.id)} style={{ ...btnStyle, marginTop: "0", background: solutionVisible ? PINK + "22" : "rgba(255,255,255,0.07)", border: solutionVisible ? `1px solid ${PINK}44` : "1px solid rgba(255,255,255,0.15)", width: "100%", textAlign: "center" }}>
                          {solutionVisible ? "Skrýt řešení ▲" : "Zobrazit řešení ▼"}
                        </button>

                        {/* Solution steps */}
                        {solutionVisible && (
                          <div style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "8px", animation: "fadeIn 0.4s ease" }}>
                            {proof.steps.map((step, si) => (
                              <div key={si} style={{ display: "flex", gap: "12px", alignItems: "flex-start", padding: "10px 14px", borderRadius: "12px", background: "rgba(255,255,255,0.02)", borderLeft: `3px solid ${si === proof.steps.length - 1 ? "#22c55e" : PINK + "66"}` }}>
                                <span style={{ ...mono, fontSize: "12px", color: PINK, fontWeight: 600, minWidth: "20px" }}>{si + 1}.</span>
                                <span style={{ fontSize: "14px", lineHeight: 1.6, color: "rgba(255,255,255,0.8)" }}>{step}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── QUIZ TAB ─── */}
        {tab === "quiz" && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <QuizEngine questions={quizQuestions} accentColor={PINK} />
          </div>
        )}

        {/* ─── FLASHCARDS TAB ─── */}
        {tab === "flashcards" && (
          <div style={{ animation: "fadeIn 0.5s ease", maxWidth: "520px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "12px", color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>
              {flashIdx + 1} / {flashcards.length} — klikni pro otočení
            </div>

            <div onClick={() => setFlipped(!flipped)} style={{ ...cardStyle, minHeight: "220px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", textAlign: "center", animation: "flipIn 0.4s ease", padding: "32px 24px" }}>
              {!flipped ? (
                <div>
                  <div style={{ fontSize: "11px", color: CYAN, fontWeight: 700, textTransform: "uppercase", marginBottom: "12px", letterSpacing: "1px" }}>Pojem / Věta</div>
                  <div style={{ fontSize: "20px", fontWeight: 700, lineHeight: 1.4 }}>{flashcards[flashIdx].front}</div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: "11px", color: PINK, fontWeight: 700, textTransform: "uppercase", marginBottom: "12px", letterSpacing: "1px" }}>Vzorec + klíč důkazu</div>
                  <div style={{ ...mono, fontSize: "15px", lineHeight: 1.8, whiteSpace: "pre-line", color: "rgba(255,255,255,0.85)" }}>{flashcards[flashIdx].back}</div>
                </div>
              )}
            </div>

            {/* Dot nav */}
            <div style={{ display: "flex", gap: "6px", justifyContent: "center", marginTop: "16px", flexWrap: "wrap" }}>
              {flashcards.map((_, i) => (
                <div key={i} onClick={() => { setFlashIdx(i); setFlipped(false); }} style={{ width: "14px", height: "14px", borderRadius: "50%", cursor: "pointer", background: i === flashIdx ? PINK : "rgba(255,255,255,0.15)", transition: "background 0.4s ease" }} />
              ))}
            </div>

            {/* Prev / Next */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "16px" }}>
              <button style={btnStyle} disabled={flashIdx === 0} onClick={() => { setFlashIdx(flashIdx - 1); setFlipped(false); }}>← Předchozí</button>
              <button style={btnStyle} disabled={flashIdx === flashcards.length - 1} onClick={() => { setFlashIdx(flashIdx + 1); setFlipped(false); }}>Další →</button>
            </div>
          </div>
        )}

        {/* ─── FORMULAS TAB ─── */}
        {tab === "formulas" && (
          <div style={{ animation: "fadeIn 0.5s ease", display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Group 1: Triangle basics */}
            <div style={cardStyle}>
              <h3 style={{ fontFamily: "'Audiowide', cursive", fontSize: "16px", color: PINK, marginBottom: "16px" }}>Trojúhelník — základní vztahy</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { label: "Součet úhlů", formula: "α + β + γ = 180°" },
                  { label: "Pythagorova věta", formula: "a² + b² = c²" },
                  { label: "Eukleidova věta o výšce", formula: "v_c² = c_a · c_b" },
                  { label: "Eukleidova věta o odvěsně", formula: "a² = c · c_a  ;  b² = c · c_b" },
                  { label: "Středový vs. obvodový úhel", formula: "∠ASB = 2 · ∠AXB" },
                ].map((f, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderRadius: "10px", background: "rgba(255,255,255,0.03)", gap: "12px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>{f.label}</span>
                    <span style={{ ...mono, fontSize: "14px", color: CYAN, fontWeight: 500 }}>{f.formula}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Group 2: Sine & cosine rule */}
            <div style={cardStyle}>
              <h3 style={{ fontFamily: "'Audiowide', cursive", fontSize: "16px", color: PINK, marginBottom: "16px" }}>Sinová a kosinová věta</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { label: "Sinová věta", formula: "a/sin α = b/sin β = c/sin γ" },
                  { label: "Poloměr opsané kružnice", formula: "r = a / (2·sin α)" },
                  { label: "Kosinová věta", formula: "c² = a² + b² − 2ab·cos γ" },
                ].map((f, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderRadius: "10px", background: "rgba(255,255,255,0.03)", gap: "12px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>{f.label}</span>
                    <span style={{ ...mono, fontSize: "14px", color: CYAN, fontWeight: 500 }}>{f.formula}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Group 3: Area formulas */}
            <div style={cardStyle}>
              <h3 style={{ fontFamily: "'Audiowide', cursive", fontSize: "16px", color: PINK, marginBottom: "16px" }}>Obsahy</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { label: "Základna × výška", formula: "S = ½ · c · v_c" },
                  { label: "Dvě strany a úhel", formula: "S = ½ · a · b · sin γ" },
                  { label: "Obvod a vepsaná kružnice", formula: "S = o · ρ / 2" },
                  { label: "Strany a opsaná kružnice", formula: "S = a·b·c / (4r)" },
                  { label: "Obsah lichoběžníku", formula: "S = (a + c) · v / 2" },
                ].map((f, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderRadius: "10px", background: "rgba(255,255,255,0.03)", gap: "12px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>{f.label}</span>
                    <span style={{ ...mono, fontSize: "14px", color: CYAN, fontWeight: 500 }}>{f.formula}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Group 4: Polygons */}
            <div style={cardStyle}>
              <h3 style={{ fontFamily: "'Audiowide', cursive", fontSize: "16px", color: PINK, marginBottom: "16px" }}>Mnohoúhelníky</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { label: "Počet úhlopříček", formula: "p = n·(n − 3) / 2" },
                  { label: "Součet vnitřních úhlů", formula: "S = (n − 2) · 180°" },
                  { label: "Obsah pravidelného n-úhelníku", formula: "S = n·a² / (4·tg(180°/n))" },
                ].map((f, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderRadius: "10px", background: "rgba(255,255,255,0.03)", gap: "12px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>{f.label}</span>
                    <span style={{ ...mono, fontSize: "14px", color: CYAN, fontWeight: 500 }}>{f.formula}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick reference: proof techniques */}
            <div style={cardStyle}>
              <h3 style={{ fontFamily: "'Audiowide', cursive", fontSize: "16px", color: "#f59e0b", marginBottom: "16px" }}>Důkazové techniky — tahák</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[
                  "Rovnoběžka + střídavé úhly → součet úhlů trojúhelníku",
                  "Čtverec o straně (a+b) → Pythagorova věta",
                  "Podobnost dílčích △ (výška na přeponu) → Eukleidovy věty",
                  "Polopřímka přes střed kružnice + rovnoramenné △ → středový/obvodový úhel",
                  "Výška trojúhelníku vyjádřená dvěma způsoby → sinová věta",
                  "Průměr opsané kružnice + Thales → r = a/(2 sin α)",
                  "Dva pravoúhlé △ + odečtení PV + cos substituce → kosinová věta",
                  "Doplnění na obdélník / rozklad na △ → vzorce pro obsahy",
                  "Triangulace z jednoho vrcholu → součet úhlů n-úhelníku",
                  "Rozklad na n rovnoramenných △ + apotéma → obsah pravidelného n-úhelníku",
                ].map((t, i) => (
                  <div key={i} style={{ padding: "8px 14px", borderRadius: "8px", background: "rgba(255,255,255,0.02)", borderLeft: `3px solid ${PINK}44`, fontSize: "13px", lineHeight: 1.5, color: "rgba(255,255,255,0.75)" }}>
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
