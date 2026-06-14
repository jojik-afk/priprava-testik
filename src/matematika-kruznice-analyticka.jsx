// @title Analytická geometrie — Kružnice (kompletní příprava na test)
// @subject Math
// @topic Analytická geometrie: kružnice
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
    const msg = pct >= 90 ? "Výborně! Kružnici máš v malíku." : pct >= 70 ? "Dobré! Pár detailů doladit a jsi za vodou." : pct >= 50 ? "Slušný základ, ale projeď si ještě teorii a úlohy." : "Ještě to chce zabrat — vrať se na teorii a vyřešené úlohy.";
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
        <div style={{ color: "#fff", fontSize: "18px", fontWeight: 600, lineHeight: 1.5, marginBottom: "20px", whiteSpace: "pre-wrap", fontFamily: "'JetBrains Mono', monospace" }}>{q.question}</div>
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
            {!isCorrect && <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", marginBottom: "6px", fontFamily: "'JetBrains Mono', monospace" }}>Správně: {q.correct.map(i => q.options[i]).join(", ")}</div>}
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

function SolvedProblem({ n, title, difficulty = "medium", tag, given, steps, result, graph }) {
  const [open, setOpen] = useState(false);
  const d = DIFF[difficulty];
  return (
    <div style={{ ...glass, padding: "0", marginBottom: "14px", overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", background: "rgba(255,255,255,0.03)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <span style={{ color: PINK, fontWeight: 700, fontSize: "14px" }}>{n}</span>
            <span style={{ color: "#fff", fontSize: "15.5px", fontWeight: 600 }}>{title}</span>
            <span style={{ fontSize: "12px", padding: "2px 10px", borderRadius: "20px", background: d.bg, color: d.col }}>{d.label}</span>
            {tag && <span style={{ fontSize: "11.5px", padding: "2px 10px", borderRadius: "20px", background: "rgba(168,85,247,0.18)", color: "#c4b5fd" }}>{tag}</span>}
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
// CIRCLE GRAPH (SVG) — circles, lines (ax+by+c=0), points
// ══════════════════════════════════════════════════════════════════
function CircleGraph({ circles = [], lines = [], points = [], xMin = -8, xMax = 8, yMin = -8, yMax = 8, width = 360, height = 360, title }) {
  const pad = 26;
  const w = width - 2 * pad;
  const h = height - 2 * pad;
  const toX = (x) => pad + ((x - xMin) / (xMax - xMin)) * w;
  const toY = (y) => pad + ((yMax - y) / (yMax - yMin)) * h;
  const sx = w / (xMax - xMin); // px per unit x
  const sy = h / (yMax - yMin);

  const grid = [];
  for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) grid.push(<line key={`gv${x}`} x1={toX(x)} x2={toX(x)} y1={pad} y2={height - pad} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />);
  for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) grid.push(<line key={`gh${y}`} x1={pad} x2={width - pad} y1={toY(y)} y2={toY(y)} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />);

  const labels = [];
  for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) if (x !== 0 && x % 2 === 0) labels.push(<text key={`lx${x}`} x={toX(x)} y={toY(0) + 13} fill="rgba(255,255,255,0.4)" fontSize="9" textAnchor="middle" fontFamily="'JetBrains Mono', monospace">{x}</text>);
  for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) if (y !== 0 && y % 2 === 0) labels.push(<text key={`ly${y}`} x={toX(0) - 6} y={toY(y) + 3} fill="rgba(255,255,255,0.4)" fontSize="9" textAnchor="end" fontFamily="'JetBrains Mono', monospace">{y}</text>);

  const lineEls = lines.map((L, i) => {
    // a x + b y + c = 0
    const { a, b, c, color = CYAN } = L;
    let p1, p2;
    if (Math.abs(b) > 1e-9) {
      p1 = [xMin, (-a * xMin - c) / b];
      p2 = [xMax, (-a * xMax - c) / b];
    } else {
      const xv = -c / a;
      p1 = [xv, yMin]; p2 = [xv, yMax];
    }
    return <line key={`ln${i}`} x1={toX(p1[0])} y1={toY(p1[1])} x2={toX(p2[0])} y2={toY(p2[1])} stroke={color} strokeWidth="2.2" strokeLinecap="round" />;
  });

  const circleEls = circles.map((C, i) => (
    <g key={`ci${i}`}>
      <ellipse cx={toX(C.m)} cy={toY(C.n)} rx={C.r * sx} ry={C.r * sy} fill={(C.color || PINK) + "14"} stroke={C.color || PINK} strokeWidth="2.4" />
      <circle cx={toX(C.m)} cy={toY(C.n)} r={3.2} fill={C.color || PINK} />
      <text x={toX(C.m) + 6} y={toY(C.n) - 6} fill={C.color || PINK} fontSize="11" fontFamily="'JetBrains Mono', monospace">{C.label || "S"}</text>
    </g>
  ));

  const pointEls = points.map((P, i) => (
    <g key={`pt${i}`}>
      <circle cx={toX(P.x)} cy={toY(P.y)} r={4} fill={P.color || GREEN} stroke="#fff" strokeWidth="1.4" />
      {P.label && <text x={toX(P.x) + (P.dx || 7)} y={toY(P.y) + (P.dy || -7)} fill={P.color || GREEN} fontSize="11" fontFamily="'JetBrains Mono', monospace">{P.label}</text>}
    </g>
  ));

  return (
    <div style={{ margin: "4px 0 14px", overflowX: "auto", textAlign: "center" }}>
      {title && <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", marginBottom: "4px", fontStyle: "italic" }}>{title}</div>}
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", maxWidth: `${width}px`, height: "auto", background: "rgba(0,0,0,0.3)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)" }}>
        {grid}
        <line x1={pad} x2={width - pad} y1={toY(0)} y2={toY(0)} stroke="rgba(255,255,255,0.3)" strokeWidth="1.4" />
        <line x1={toX(0)} x2={toX(0)} y1={pad} y2={height - pad} stroke="rgba(255,255,255,0.3)" strokeWidth="1.4" />
        {labels}
        {lineEls}
        {circleEls}
        {pointEls}
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
function H3({ children, color = CYAN }) {
  return <h3 style={{ color, fontSize: "16px", fontWeight: 700, margin: "16px 0 6px", fontFamily: "'Exo 2', sans-serif" }}>{children}</h3>;
}

// ══════════════════════════════════════════════════════════════════
// TAB: PŘEHLED
// ══════════════════════════════════════════════════════════════════
function PrehledTab() {
  const topics = [
    ["Co je kružnice", "Kuželosečka, definice k(S, r), množina bodů ve vzdálenosti r od středu S."],
    ["Středová rovnice", "(x − m)² + (y − n)² = r² — okamžitě z ní přečteš střed S[m, n] a poloměr r."],
    ["Obecná rovnice", "x² + y² + Ax + By + C = 0 — převod tam i zpět přes doplnění na čtverec."],
    ["Je to vůbec kružnice?", "Po doplnění na čtverec musí být pravá strana r² > 0. Jinak bod nebo prázdná množina."],
    ["Přímka a kružnice", "Vnější přímka / tečna / sečna — podle vzdálenosti d středu od přímky vs. poloměr r."],
    ["Tečna v bodě kružnice", "Vektor S→T je normálový vektor tečny. Klíčový typ úlohy na test."],
    ["Kružnice ze zadání", "Z průměru AB, ze středu a bodu, z dotyku s přímkou, opsaná trojúhelníku…"],
  ];
  return (
    <div>
      <SectionTitle>Přehled tématu</SectionTitle>
      <Lead>Zítřejší test je z analytické geometrie kružnice. Tahle appka tě tím provede kompletně — od definice přes všech 5 typů úloh od pana profesora až po kvíz. Pan profesor řekl, že „tam bude všechno až na úlohu 5" (tečna z vnějšího bodu) — tu máš taky uvnitř, jen označenou jako navíc.</Lead>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px" }}>
        {topics.map(([t, d], i) => (
          <div key={i} style={{ ...glass, padding: "16px 18px" }}>
            <div style={{ color: PINK, fontWeight: 700, fontSize: "15px", marginBottom: "6px" }}>{t}</div>
            <div style={{ color: "rgba(255,255,255,0.65)", fontSize: "13.5px", lineHeight: 1.55 }}>{d}</div>
          </div>
        ))}
      </div>

      <div style={{ ...glass, padding: "18px 20px", marginTop: "18px" }}>
        <div style={{ color: CYAN, fontWeight: 700, fontSize: "15px", marginBottom: "10px", fontFamily: "'Audiowide', sans-serif" }}>Doporučený postup učení</div>
        <ol style={{ color: "rgba(255,255,255,0.8)", fontSize: "14.5px", lineHeight: 1.9, paddingLeft: "20px" }}>
          <li>Projdi <b>Teorii</b> — hlavně doplnění na čtverec a tečnu v bodě.</li>
          <li>Otevři <b>Úlohy</b> — zkus je nejdřív sám, pak rozbal řešení (úlohy 1–4 jsou přesně typy na test).</li>
          <li>Otestuj se v <b>Kvízu</b> a procvič rychlé reakce na <b>Kartičkách</b>.</li>
          <li>Před testem si projdi <b>Vzorce</b> — to je tvůj tahák do hlavy.</li>
        </ol>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// TAB: TEORIE
// ══════════════════════════════════════════════════════════════════
function TeorieTab() {
  return (
    <div>
      <SectionTitle color={CYAN}>Teorie</SectionTitle>
      <Lead>Rozbal si jednotlivé části. Vzorce jsou ve fontu JetBrains Mono, ať se dobře čtou.</Lead>

      <Collapsible title="1. Co je kružnice (kuželosečka)" defaultOpen accent={CYAN}>
        <p style={pS}>Kružnice je jedna ze <b>čtyř kuželoseček</b> (řez kuželem): <Mono color={PINK}>kružnice, elipsa, parabola, hyperbola</Mono>. Vznikne, když rovina řízne kužel kolmo na osu.</p>
        <p style={pS}>Definice: kružnice <Mono>k(S, r)</Mono> je množina všech bodů <Mono>X</Mono> v rovině, které mají od středu <Mono>S</Mono> stejnou vzdálenost <Mono>r</Mono> (poloměr):</p>
        <MBlock color={PINK}>k(S, r) = {'{'} X ; |SX| = r {'}'}</MBlock>
        <p style={pS}>Z téhle definice (vzdálenost <Mono>|SX| = r</Mono>) se odvodí rovnice kružnice — viz další část.</p>
      </Collapsible>

      <Collapsible title="2. Středová rovnice kružnice" accent={CYAN}>
        <p style={pS}>Z definice <Mono>|SX| = r</Mono> dosadíme vzorec pro vzdálenost dvou bodů a celé umocníme na druhou:</p>
        <MBlock color={PINK}>S[m, n], X[x, y]:
√((x − m)² + (y − n)²) = r   / ²
────────────────────────────
(x − m)² + (y − n)² = r²   ← STŘEDOVÁ ROVNICE</MBlock>
        <p style={pS}>Ze středové rovnice <b>okamžitě přečteš</b> střed <Mono>S[m, n]</Mono> a poloměr <Mono>r</Mono>. Pozor na znaménka: <Mono>(x − m)</Mono> → souřadnice je <b>+m</b>.</p>
        <H3>Příklady čtení</H3>
        <MBlock>(x − 1)² + (y − 2)² = 9    →  S[1, 2],  r = 3
(x + 1)² + (y + 1)² = 25   →  S[−1, −1], r = 5
x² + (y − 7)² = 100        →  S[0, 7],  r = 10</MBlock>
        <p style={pS}>Speciální případ — střed v počátku <Mono>S[0, 0]</Mono>:</p>
        <MBlock color={PINK}>x² + y² = r²</MBlock>
        <CircleGraph circles={[{ m: 1, n: 2, r: 3, color: PINK, label: "S[1,2]" }]} points={[]} title="(x − 1)² + (y − 2)² = 9" xMin={-4} xMax={6} yMin={-3} yMax={7} />
      </Collapsible>

      <Collapsible title="3. Obecná rovnice + doplnění na čtverec ⭐" accent={CYAN}>
        <p style={pS}>Když středovou rovnici roznásobíš, dostaneš <b>obecnou rovnici</b>:</p>
        <MBlock color={PINK}>x² + y² + Ax + By + C = 0</MBlock>
        <p style={pS}>Poznáš ji takto: u <Mono>x²</Mono> a <Mono>y²</Mono> je <b>stejný koeficient</b> (po úpravě 1) a <b>chybí člen xy</b>.</p>
        <H3>Středová → obecná (roznásobení)</H3>
        <MBlock>(x − 1)² + (y − 6)² = 5
x² − 2x + 1 + y² − 12y + 36 − 5 = 0
x² + y² − 2x − 12y + 32 = 0</MBlock>
        <H3 color={YELLOW}>Obecná → středová (DOPLNĚNÍ NA ČTVEREC)</H3>
        <p style={pS}>Tohle je klíčová dovednost. Trik: <Mono color={YELLOW}>x² + px = (x + p/2)² − (p/2)²</Mono>. Vezmeš půlku koeficientu u x, dáš do závorky a odečteš její druhou mocninu.</p>
        <MBlock color={YELLOW}>x² + y² − 2x + 2y − 2 = 0
(x² − 2x) + (y² + 2y) − 2 = 0
(x − 1)² − 1 + (y + 1)² − 1 − 2 = 0
(x − 1)² + (y + 1)² = 4      →  S[1, −1], r = 2</MBlock>
        <p style={pS}>Postup: seskup x-ové a y-ové členy, každou skupinu doplň na čtverec, odečtené konstanty přesuň na pravou stranu.</p>
      </Collapsible>

      <Collapsible title="4. Je daná rovnice vůbec kružnice?" accent={CYAN}>
        <p style={pS}>Po doplnění na čtverec dostaneš tvar <Mono>(x − m)² + (y − n)² = K</Mono>. Rozhoduje pravá strana <Mono>K</Mono>:</p>
        <MBlock color={PINK}>K {'>'} 0   →  kružnice,  r = √K
K = 0   →  jediný bod  [m, n]   (není kružnice)
K {'<'} 0   →  prázdná množina  (žádný bod nevyhovuje)</MBlock>
        <p style={pS}>Příklady z tabule:</p>
        <MBlock>(x + 5)² + (y − 2)² = 0   →  jen bod [−5, 2], není kružnice
x² + (y + 4)² = −25       →  nesplňuje žádný bod (prázdná množina)</MBlock>
        <p style={pS}>„Dokažte, že jde o rovnici kružnice" tedy znamená: <b>doplň na čtverec a ukaž, že pravá strana je kladná</b> — pak rovnou napiš střed a poloměr.</p>
      </Collapsible>

      <Collapsible title="5. Vzájemná poloha přímky a kružnice" accent={CYAN}>
        <p style={pS}>Přímka může vůči kružnici ležet třemi způsoby. Rozhoduje <b>vzdálenost d</b> středu <Mono>S</Mono> od přímky v porovnání s poloměrem <Mono>r</Mono>:</p>
        <MBlock color={PINK}>d {'>'} r   →  VNĚJŠÍ přímka  (0 společných bodů)
d = r   →  TEČNA          (1 bod dotyku T)
d {'<'} r   →  SEČNA          (2 průsečíky)</MBlock>
        <H3>Vzdálenost bodu od přímky</H3>
        <p style={pS}>Pro přímku <Mono>p: ax + by + c = 0</Mono> a bod <Mono>A[a₁, a₂]</Mono>:</p>
        <MBlock color={YELLOW}>|Ap| = |a·a₁ + b·a₂ + c| / √(a² + b²)</MBlock>
        <H3>Druhý způsob — dosazení</H3>
        <p style={pS}>Z přímky vyjádříš jednu proměnnou a dosadíš do kružnice → kvadratická rovnice. Podle diskriminantu <Mono>D</Mono>: <Mono>D {'>'} 0</Mono> sečna, <Mono>D = 0</Mono> tečna, <Mono>D {'<'} 0</Mono> vnější přímka. Kořeny rovnou dají souřadnice průsečíků / bodu dotyku.</p>
        <CircleGraph circles={[{ m: 0, n: 0, r: 3, color: PINK }]} lines={[{ a: 0, b: 1, c: -3, color: CYAN }, { a: 0, b: 1, c: 0, color: GREEN }, { a: 0, b: 1, c: 5, color: YELLOW }]} title="žlutá = vnější · azurová = tečna · zelená = sečna" xMin={-6} xMax={6} yMin={-6} yMax={6} />
      </Collapsible>

      <Collapsible title="6. Tečna v bodě ležícím na kružnici ⭐" accent={CYAN}>
        <p style={pS}>Nejčastější typ tečny na test. <b>Klíčová myšlenka:</b> tečna je kolmá na poloměr v bodě dotyku. Vektor <Mono>S→T</Mono> je proto <b>normálový vektor</b> tečny.</p>
        <MBlock color={YELLOW}>1) Najdi střed S (doplněním na čtverec, je-li třeba)
2) normálový vektor n = T − S = (t₁ − m, t₂ − n)
3) tečna: n₁·x + n₂·y + c = 0
4) c dopočítáš dosazením bodu T</MBlock>
        <p style={pS}>Příklad z tabule: <Mono>k: x² + y² − 6x − 4y + 3 = 0</Mono>, bod <Mono>A[2, 5]</Mono> na kružnici. Po doplnění <Mono>S[3, 2]</Mono>. Normála <Mono>S→A = (−1, 3)</Mono> → použij <Mono>x − 3y + c = 0</Mono>, dosaď A: <Mono>2 − 15 + c = 0 → c = 13</Mono>.</p>
        <MBlock color={PINK}>tečna: x − 3y + 13 = 0</MBlock>
        <p style={pS}>💡 Existuje i vzorec přímo: <Mono>(t₁ − m)(x − m) + (t₂ − n)(y − n) = r²</Mono>, ale postup s normálovým vektorem je spolehlivější.</p>
      </Collapsible>

      <Collapsible title="7. Bod a kružnice — uvnitř / na / vně" accent={CYAN}>
        <p style={pS}>Spočítáš vzdálenost bodu <Mono>M</Mono> od středu <Mono>S</Mono> a porovnáš s poloměrem:</p>
        <MBlock color={PINK}>|MS| {'<'} r   →  M leží UVNITŘ kružnice
|MS| = r   →  M leží NA kružnici
|MS| {'>'} r   →  M leží VNĚ kružnice</MBlock>
        <p style={pS}>Z vnějšího bodu lze ke kružnici vést <b>dvě tečny</b> (body dotyku T₁, T₂) — to je úloha 5 (pan profesor řekl, že na testu nebude).</p>
      </Collapsible>

      <Collapsible title="8. Jak sestavit kružnici z různých zadání" accent={CYAN}>
        <H3>Z průměru AB</H3>
        <p style={pS}>Střed = <b>střed úsečky AB</b> (průměr stranách): <Mono>S = ((a₁+b₁)/2, (a₂+b₂)/2)</Mono>. Poloměr <Mono>r = |SA|</Mono> (polovina průměru).</p>
        <H3>Ze středu a bodu na kružnici</H3>
        <p style={pS}>Znáš <Mono>S</Mono> a bod <Mono>K</Mono> → <Mono>r = |SK|</Mono>, hotovo.</p>
        <H3>Dotyk s přímkou</H3>
        <p style={pS}>Kružnice se dotýká přímky <Mono>p</Mono> → poloměr <Mono>r =</Mono> vzdálenost středu od přímky <Mono>p</Mono>.</p>
        <H3>Opsaná kružnice trojúhelníku (3 body)</H3>
        <p style={pS}>Buď dosadíš 3 body do obecné rovnice <Mono>x²+y²+Ax+By+C=0</Mono> a vyřešíš soustavu, nebo najdeš střed jako <b>průsečík os stran</b> (osa = kolmice procházející středem strany).</p>
      </Collapsible>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// TAB: ÚLOHY (worked problems)
// ══════════════════════════════════════════════════════════════════
function UlohyTab() {
  return (
    <div>
      <SectionTitle color={GREEN}>Vyřešené úlohy</SectionTitle>
      <Lead>Úlohy 1–5 jsou přesně zadání z testu od pana profesora (řešení jsou jeho z tabule). Zkus každou nejdřív sám, pak rozbal řešení. Dole máš ještě 4 úlohy navíc na procvičení typů, které „tam budou".</Lead>

      <div style={{ color: PINK, fontWeight: 700, fontSize: "14px", margin: "8px 0 10px", fontFamily: "'Audiowide', sans-serif" }}>★ Úlohy z testu</div>

      <SolvedProblem
        n="1." difficulty="easy" tag="z testu"
        title="Středová i obecná rovnice z průměru AB"
        given="Úsečka AB je průměrem kružnice. A[−1, 5], B[3, 7]."
        graph={<CircleGraph circles={[{ m: 1, n: 6, r: Math.sqrt(5), color: PINK, label: "S[1,6]" }]} points={[{ x: -1, y: 5, label: "A", color: GREEN }, { x: 3, y: 7, label: "B", color: CYAN }]} xMin={-4} xMax={6} yMin={2} yMax={10} />}
        steps={`Průměr → střed S je STŘED úsečky AB:
S = ((−1+3)/2 , (5+7)/2) = (1, 6)   →  S[1, 6]

Poloměr = vzdálenost středu od krajního bodu:
S→A = (−1−1, 5−6) = (−2, −1)
r = |S→A| = √((−2)² + (−1)²) = √(4+1) = √5

Středová rovnice:
(x − 1)² + (y − 6)² = 5

Obecná (roznásobíme):
x² − 2x + 1 + y² − 12y + 36 − 5 = 0
x² + y² − 2x − 12y + 32 = 0`}
        result="S[1, 6], r = √5 ; (x−1)² + (y−6)² = 5 ; obecná: x² + y² − 2x − 12y + 32 = 0"
      />

      <SolvedProblem
        n="2." difficulty="medium" tag="z testu"
        title="Vzájemná poloha přímky a kružnice"
        given="p: x − 2y − 1 = 0,  k: (x − 4)² + (y + 1)² = 5"
        graph={<CircleGraph circles={[{ m: 4, n: -1, r: Math.sqrt(5), color: PINK, label: "S[4,−1]" }]} lines={[{ a: 1, b: -2, c: -1, color: CYAN }]} points={[{ x: 3, y: 1, label: "T", color: GREEN }]} xMin={-1} xMax={9} yMin={-5} yMax={5} />}
        steps={`Z kružnice: S[4, −1], r = √5.

Vzdálenost středu S od přímky p:
d = |1·4 + (−2)·(−1) + (−1)| / √(1² + (−2)²)
d = |4 + 2 − 1| / √5 = 5 / √5 = √5

d = √5 = r   →  přímka je TEČNA.

Bod dotyku — dosadíme z p: x = 2y + 1 do k:
(2y+1−4)² + (y+1)² = 5
(2y−3)² + (y+1)² = 5
4y² − 12y + 9 + y² + 2y + 1 = 5
5y² − 10y + 5 = 0  / :5
y² − 2y + 1 = 0  →  (y − 1)² = 0  →  y = 1
x = 2·1 + 1 = 3`}
        result="Přímka p je TEČNA kružnice k, bod dotyku T[3, 1]."
      />

      <SolvedProblem
        n="3." difficulty="medium" tag="z testu"
        title="Důkaz kružnice + bod na ní + tečna v bodě"
        given="x² + y² − 6x − 10y + 9 = 0 ;  a) dokaž kružnici, S a r  b) leží M[−1, 2] na k?  c) tečna v M"
        graph={<CircleGraph circles={[{ m: 3, n: 5, r: 5, color: PINK, label: "S[3,5]" }]} lines={[{ a: 4, b: 3, c: -2, color: CYAN }]} points={[{ x: -1, y: 2, label: "M", color: GREEN }]} xMin={-4} xMax={9} yMin={-2} yMax={11} />}
        steps={`a) Doplnění na čtverec:
(x² − 6x) + (y² − 10y) + 9 = 0
(x − 3)² − 9 + (y − 5)² − 25 + 9 = 0
(x − 3)² + (y − 5)² = 25
Pravá strana 25 > 0  →  JE to kružnice. S[3, 5], r = 5.

b) Dosadíme M[−1, 2] do levé strany:
(−1 − 3)² + (2 − 5)² = (−4)² + (−3)² = 16 + 9 = 25 = r²
→  M LEŽÍ na kružnici. ✓

c) Tečna v bodě M: normálový vektor n = S→M:
n = M − S = (−1−3, 2−5) = (−4, −3)  ~  (4, 3)
tečna: 4x + 3y + c = 0
dosaď M[−1, 2]: 4·(−1) + 3·2 + c = 0
−4 + 6 + c = 0  →  c = −2`}
        result="a) S[3,5], r = 5  b) M leží na k  c) tečna: 4x + 3y − 2 = 0"
      />

      <SolvedProblem
        n="4." difficulty="medium" tag="z testu"
        title="Důkaz kružnice s koeficientem 16"
        given="16x² + 16y² + 16x − 8y − 59 = 0"
        steps={`Vytkneme 16 u kvadratických členů a seskupíme:
16(x² + x) + 16(y² − ½y) − 59 = 0

Doplnění na čtverec uvnitř závorek:
16[(x + ½)² − ¼] + 16[(y − ¼)² − 1/16] − 59 = 0
16(x + ½)² − 4 + 16(y − ¼)² − 1 − 59 = 0
16(x + ½)² + 16(y − ¼)² = 64   / :16
(x + ½)² + (y − ¼)² = 4

Pravá strana 4 > 0  →  je to kružnice.`}
        graph={<CircleGraph circles={[{ m: -0.5, n: 0.25, r: 2, color: PINK, label: "S[−½,¼]" }]} xMin={-5} xMax={5} yMin={-5} yMax={5} />}
        result="JE to kružnice. S[−½, ¼], r = 2."
      />

      <SolvedProblem
        n="5." difficulty="hard" tag="navíc — NEBUDE na testu"
        title="Poloha bodu + tečny z vnějšího bodu"
        given="M[−7, −2],  k: x² + y² + 3x + 4y − 6 = 0"
        graph={<CircleGraph circles={[{ m: -1.5, n: -2, r: 3.5, color: PINK, label: "S[−1.5,−2]" }]} points={[{ x: -7, y: -2, label: "M", color: GREEN }]} xMin={-9} xMax={4} yMin={-7} yMax={4} />}
        steps={`Doplnění na čtverec:
(x² + 3x) + (y² + 4y) − 6 = 0
(x + 3/2)² − 9/4 + (y + 2)² − 4 − 6 = 0
(x + 3/2)² + (y + 2)² = 9/4 + 10 = 49/4
→  S[−3/2, −2], r = 7/2.

Poloha bodu M:
|MS| = √((−7 + 3/2)² + (−2 + 2)²) = √((−11/2)²) = 11/2
11/2 > 7/2 = r  →  M leží VNĚ kružnice.

Tečny z vnějšího bodu (princip — na test nebude):
Přímka M: y + 2 = k(x + 7), tj. kx − y + (7k − 2) = 0.
Žádáme vzdálenost od S = r:
|11k/2| / √(k²+1) = 7/2  →  121k² = 49(k²+1)
72k² = 49  →  k = ±7√2 / 12
(z M lze vést dvě tečny — dosazením k zpět dostaneš jejich rovnice)`}
        result="M leží VNĚ kružnice (|MS| = 11/2 > r = 7/2). Z M vedou dvě tečny."
      />

      <div style={{ color: CYAN, fontWeight: 700, fontSize: "14px", margin: "24px 0 10px", fontFamily: "'Audiowide', sans-serif" }}>★ Úlohy navíc — typy „co tam budou"</div>

      <SolvedProblem
        n="6." difficulty="easy" tag="procvičení"
        title="Obecná → středová rovnice"
        given="x² + y² − 2x = 0"
        steps={`Seskupíme a doplníme na čtverec (u y nic není):
(x² − 2x) + y² = 0
(x − 1)² − 1 + y² = 0
(x − 1)² + y² = 1

Pravá strana 1 > 0  →  kružnice. S[1, 0], r = 1.
(všimni si: prochází počátkem, protože pro [0,0] sedí.)`}
        graph={<CircleGraph circles={[{ m: 1, n: 0, r: 1, color: PINK, label: "S[1,0]" }]} points={[{ x: 0, y: 0, label: "O", color: GREEN }]} xMin={-3} xMax={4} yMin={-3} yMax={3} />}
        result="(x − 1)² + y² = 1 ; S[1, 0], r = 1"
      />

      <SolvedProblem
        n="7." difficulty="medium" tag="procvičení"
        title="Kružnice ze středu a bodu + průsečíky s osami"
        given="Střed S[2, 1], prochází bodem K[6, −2]. Najdi rovnici a průsečíky s osami x a y."
        graph={<CircleGraph circles={[{ m: 2, n: 1, r: 5, color: PINK, label: "S[2,1]" }]} points={[{ x: 6, y: -2, label: "K", color: GREEN }]} xMin={-5} xMax={9} yMin={-6} yMax={8} />}
        steps={`Poloměr = |SK|:
S→K = (6−2, −2−1) = (4, −3)
r = √(4² + (−3)²) = √(16+9) = √25 = 5

Rovnice: (x − 2)² + (y − 1)² = 25

Průsečíky s osou x (y = 0):
(x − 2)² + 1 = 25  →  (x − 2)² = 24  →  x = 2 ± 2√6
→  [2 − 2√6, 0],  [2 + 2√6, 0]

Průsečíky s osou y (x = 0):
4 + (y − 1)² = 25  →  (y − 1)² = 21  →  y = 1 ± √21
→  [0, 1 − √21],  [0, 1 + √21]`}
        result="(x−2)² + (y−1)² = 25 ; osa x: [2 ± 2√6, 0] ; osa y: [0, 1 ± √21]"
      />

      <SolvedProblem
        n="8." difficulty="medium" tag="procvičení"
        title="Kružnice se středem v bodě a dotykem s přímkou"
        given="Střed S[−5, 4], kružnice se dotýká přímky p: 3x − 4y + 6 = 0."
        graph={<CircleGraph circles={[{ m: -5, n: 4, r: 5, color: PINK, label: "S[−5,4]" }]} lines={[{ a: 3, b: -4, c: 6, color: CYAN }]} xMin={-11} xMax={3} yMin={-2} yMax={10} />}
        steps={`Dotyk s přímkou  →  poloměr = vzdálenost středu od přímky p:
r = |3·(−5) − 4·4 + 6| / √(3² + (−4)²)
r = |−15 − 16 + 6| / √25
r = |−25| / 5 = 25 / 5 = 5

Rovnice: (x + 5)² + (y − 4)² = 25`}
        result="(x + 5)² + (y − 4)² = 25 ; r = 5"
      />

      <SolvedProblem
        n="9." difficulty="hard" tag="procvičení"
        title="Kružnice opsaná trojúhelníku (3 body)"
        given="A[−5, 0], B[2, −1], C[1, 2]. Najdi opsanou kružnici."
        graph={<CircleGraph circles={[{ m: -1.5, n: -0.5, r: Math.sqrt(50) / 2, color: PINK, label: "S" }]} points={[{ x: -5, y: 0, label: "A", color: GREEN }, { x: 2, y: -1, label: "B", color: CYAN }, { x: 1, y: 2, label: "C", color: YELLOW }]} xMin={-8} xMax={6} yMin={-5} yMax={5} />}
        steps={`Hledáme S[m, n] tak, aby |SA| = |SB| = |SC| = r.
Dosadíme do (x−m)² + (y−n)² = r² všechny tři body:
I.   (−5−m)² + (0−n)² = r²
II.  ( 2−m)² + (−1−n)² = r²
III. ( 1−m)² + ( 2−n)² = r²

Odečteme rovnice (r² se vyruší):
I − II:  25 + 10m − (4 − 4m) − (1 + 2n) = 0  →  14m − 2n = −20  / :2
         →  7m − n = −10
I − III: 25 + 10m − (1 − 2m) − (4 − 4n) = 0  →  12m + 4n = −20

Z první: n = 7m + 10. Dosadíme:
12m + 4(7m + 10) = −20  →  40m = −60  →  m = −3/2
n = 7·(−3/2) + 10 = −1/2   →  S[−3/2, −1/2]

r = |SA|:  S→A = (−5 + 3/2, 0 + 1/2) = (−7/2, 1/2)
r² = 49/4 + 1/4 = 50/4  →  r = √50 / 2 = 5√2 / 2`}
        result="S[−3/2, −1/2], r = 5√2/2 ; (x + 3/2)² + (y + 1/2)² = 50/4"
      />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// TAB: VZORCE
// ══════════════════════════════════════════════════════════════════
function FormulaSheet() {
  const groups = [
    {
      t: "Rovnice kružnice", c: PINK, rows: [
        ["Středová rovnice", "(x − m)² + (y − n)² = r²"],
        ["Střed v počátku", "x² + y² = r²"],
        ["Obecná rovnice", "x² + y² + Ax + By + C = 0"],
        ["Definice", "k(S, r) = { X ; |SX| = r }"],
      ]
    },
    {
      t: "Doplnění na čtverec", c: YELLOW, rows: [
        ["Základní trik", "x² + px = (x + p/2)² − (p/2)²"],
        ["Je to kružnice?", "(x−m)²+(y−n)² = K :  K>0 ano, K=0 bod, K<0 nic"],
        ["Poloměr", "r = √K  (po doplnění)"],
      ]
    },
    {
      t: "Vzdálenosti", c: CYAN, rows: [
        ["Dva body", "|AB| = √((b₁−a₁)² + (b₂−a₂)²)"],
        ["Střed úsečky", "S = ((a₁+b₁)/2 , (a₂+b₂)/2)"],
        ["Bod od přímky", "|Ap| = |a·a₁ + b·a₂ + c| / √(a²+b²)"],
      ]
    },
    {
      t: "Přímka a kružnice", c: GREEN, rows: [
        ["d > r", "vnější přímka (0 bodů)"],
        ["d = r", "tečna (1 bod dotyku)"],
        ["d < r", "sečna (2 průsečíky)"],
        ["přes diskriminant", "D>0 sečna · D=0 tečna · D<0 vnější"],
      ]
    },
    {
      t: "Tečna a poloha bodu", c: PURPLE, rows: [
        ["Tečna v bodě T", "normála n = T − S, pak n₁x + n₂y + c = 0"],
        ["Vzorec tečny", "(t₁−m)(x−m) + (t₂−n)(y−n) = r²"],
        ["Bod uvnitř", "|MS| < r"],
        ["Bod na kružnici", "|MS| = r"],
        ["Bod vně", "|MS| > r"],
      ]
    },
  ];
  return (
    <div>
      <SectionTitle color={YELLOW}>Vzorce — tahák do hlavy</SectionTitle>
      <Lead>Tohle si projeď těsně před testem. Když si zapamatuješ jen jednu věc: <b>doplnění na čtverec</b> řeší skoro všechno.</Lead>
      {groups.map((g, i) => (
        <div key={i} style={{ ...glass, padding: "16px 18px", marginBottom: "12px" }}>
          <div style={{ color: g.c, fontWeight: 700, fontSize: "15px", marginBottom: "10px", fontFamily: "'Audiowide', sans-serif" }}>{g.t}</div>
          {g.rows.map(([k, v], j) => (
            <div key={j} style={{ display: "flex", gap: "12px", padding: "7px 0", borderTop: j === 0 ? "none" : "1px solid rgba(255,255,255,0.06)", flexWrap: "wrap" }}>
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "13.5px", flex: "0 0 150px" }}>{k}</span>
              <span style={{ color: "#fff", fontSize: "14px", fontFamily: "'JetBrains Mono', monospace", flex: "1 1 200px" }}>{v}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// DATA: QUIZ
// ══════════════════════════════════════════════════════════════════
const quizQuestions = [
  {
    question: "Jaký střed a poloměr má kružnice (x + 3)² + (y − 1)² = 16 ?",
    type: "single",
    options: ["S[−3, 1], r = 4", "S[3, −1], r = 4", "S[−3, 1], r = 16", "S[3, 1], r = 8"],
    correct: [0],
    explanation: "Ze (x − m)² čteš m s opačným znaménkem: (x + 3) → m = −3. Pravá strana je r², takže r = √16 = 4.",
    tip: "(x + 3) znamená m = −3. Závorka klame znaménkem!"
  },
  {
    question: "Která z rovnic MŮŽE být obecnou rovnicí kružnice?",
    type: "single",
    options: ["x² + y² − 4x + 2y − 1 = 0", "x² + 2y² − 4x = 0", "x² + y² + xy − 3 = 0", "2x² + y² − 5 = 0"],
    correct: [0],
    explanation: "Kružnice má u x² a y² stejný koeficient a NEMÁ člen xy. Jen první rovnice to splňuje. Druhá a čtvrtá mají různé koeficienty (elipsa), třetí má člen xy.",
    tip: "Stejný koeficient u x² a y², žádné xy."
  },
  {
    question: "Po doplnění na čtverec vyjde (x − 2)² + (y + 1)² = 0. Co to je?",
    type: "single",
    options: ["Jediný bod [2, −1]", "Kružnice s r = 0,5", "Prázdná množina", "Kružnice se středem [−2, 1]"],
    correct: [0],
    explanation: "Pravá strana = 0 znamená, že rovnici vyhovuje jen jeden bod — střed [2, −1]. Není to kružnice.",
    tip: "K = 0 → bod, K < 0 → nic, K > 0 → kružnice."
  },
  {
    question: "Úsečka AB je průměrem kružnice, A[−1, 5], B[3, 7]. Jaký je střed?",
    type: "single",
    options: ["S[1, 6]", "S[2, 12]", "S[4, 2]", "S[−2, −1]"],
    correct: [0],
    explanation: "Střed kružnice = střed úsečky AB = ((−1+3)/2, (5+7)/2) = (1, 6).",
    tip: "Průměr → střed je střed úsečky."
  },
  {
    question: "Vzdálenost středu S od přímky p je d = 3, poloměr r = 3. Jaká je poloha?",
    type: "single",
    options: ["Tečna (1 bod dotyku)", "Sečna (2 průsečíky)", "Vnější přímka (0 bodů)", "Přímka prochází středem"],
    correct: [0],
    explanation: "Při d = r je přímka tečnou — dotýká se kružnice v jednom bodě.",
    tip: "d = r ⇒ tečna."
  },
  {
    question: "Vyber všechna pravdivá tvrzení o vzájemné poloze přímky a kružnice.",
    type: "multi",
    options: ["d < r znamená sečna (2 průsečíky)", "d > r znamená vnější přímka", "d = r znamená tečna", "d < r znamená vnější přímka"],
    correct: [0, 1, 2],
    explanation: "Platí: d < r sečna, d = r tečna, d > r vnější přímka. Poslední tvrzení je špatně (zaměňuje sečnu a vnější přímku).",
    tip: "Čím blíž je střed, tím víc protíná: malé d = sečna."
  },
  {
    question: "Bod M má od středu vzdálenost |MS| = 11/2, poloměr je r = 7/2. Kde M leží?",
    type: "single",
    options: ["Vně kružnice", "Uvnitř kružnice", "Na kružnici", "Ve středu"],
    correct: [0],
    explanation: "|MS| = 11/2 > 7/2 = r, takže bod leží vně kružnice. (Z vnějšího bodu lze vést dvě tečny.)",
    tip: "|MS| > r ⇒ vně."
  },
  {
    question: "Tečna se dotýká kružnice se středem S v bodě T. Jaký je normálový vektor tečny?",
    type: "single",
    options: ["Vektor S→T (tj. T − S)", "Vektor kolmý na S→T", "Vždy (1, 0)", "Nulový vektor"],
    correct: [0],
    explanation: "Tečna je kolmá na poloměr, proto poloměr S→T je normálovým vektorem tečny. Z něj sestavíš rovnici tečny.",
    tip: "Poloměr ⊥ tečna ⇒ S→T je normála tečny."
  },
  {
    question: "Jaký poloměr má kružnice se středem S[2, 1] procházející bodem K[6, −2]?",
    type: "single",
    options: ["r = 5", "r = 7", "r = √7", "r = 25"],
    correct: [0],
    explanation: "r = |SK| = √((6−2)² + (−2−1)²) = √(16 + 9) = √25 = 5.",
    tip: "r = vzdálenost středu od bodu na kružnici."
  },
  {
    question: "Doplň na čtverec: x² + y² − 6x − 10y + 9 = 0. Co dostaneš?",
    type: "single",
    options: ["(x−3)² + (y−5)² = 25", "(x−3)² + (y−5)² = 9", "(x+3)² + (y+5)² = 25", "(x−6)² + (y−10)² = 9"],
    correct: [0],
    explanation: "(x²−6x) → (x−3)²−9, (y²−10y) → (y−5)²−25. Celkem: (x−3)²+(y−5)² − 9 − 25 + 9 = 0 → = 25. Tedy S[3,5], r = 5.",
    tip: "Půlka koeficientu u x: −6/2 = −3 → (x−3)²."
  },
  {
    question: "Mezi kuželosečky NEPATŘÍ:",
    type: "single",
    options: ["Přímka", "Kružnice", "Parabola", "Hyperbola"],
    correct: [0],
    explanation: "Kuželosečky (řezy kuželem) jsou kružnice, elipsa, parabola a hyperbola. Přímka mezi ně nepatří.",
    tip: "4 kuželosečky: kružnice, elipsa, parabola, hyperbola."
  },
  {
    question: "Kde kružnice (x − 2)² + (y − 1)² = 25 protíná osu x?",
    type: "single",
    options: ["[2 ± 2√6, 0]", "[0, 1 ± √21]", "[2 ± 5, 0]", "[±5, 0]"],
    correct: [0],
    explanation: "Na ose x je y = 0: (x−2)² + 1 = 25 → (x−2)² = 24 → x = 2 ± √24 = 2 ± 2√6.",
    tip: "Osa x ⇒ dosaď y = 0."
  },
];

// ══════════════════════════════════════════════════════════════════
// DATA: FLASHCARDS
// ══════════════════════════════════════════════════════════════════
const flashcards = [
  { f: "Středová rovnice kružnice se středem S[m, n] a poloměrem r?", b: "(x − m)² + (y − n)² = r²" },
  { f: "Obecná rovnice kružnice — jak vypadá?", b: "x² + y² + Ax + By + C = 0\n(stejný koef. u x² a y², žádné xy)" },
  { f: "Definice kružnice k(S, r)?", b: "k(S, r) = { X ; |SX| = r }\nmnožina bodů ve vzdálenosti r od S" },
  { f: "Trik na doplnění na čtverec?", b: "x² + px = (x + p/2)² − (p/2)²\n(půlka koef. u x do závorky, odečti její druhou mocninu)" },
  { f: "Kdy je (x−m)²+(y−n)² = K kružnice?", b: "K > 0 → kružnice, r = √K\nK = 0 → bod\nK < 0 → prázdná množina" },
  { f: "Vzdálenost bodu A[a₁,a₂] od přímky ax+by+c=0?", b: "|Ap| = |a·a₁ + b·a₂ + c| / √(a² + b²)" },
  { f: "Vzájemná poloha přímky a kružnice — kritéria?", b: "d > r vnější (0)\nd = r tečna (1)\nd < r sečna (2)" },
  { f: "Jak najít tečnu v bodě T na kružnici?", b: "Normála n = T − S (vektor S→T).\nTečna: n₁x + n₂y + c = 0, c z dosazení T." },
  { f: "Poloha bodu M vůči kružnici?", b: "|MS| < r uvnitř\n|MS| = r na kružnici\n|MS| > r vně" },
  { f: "Kružnice z průměru AB — střed a poloměr?", b: "S = střed úsečky AB = ((a₁+b₁)/2, (a₂+b₂)/2)\nr = |SA| (polovina průměru)" },
  { f: "Kružnice se dotýká přímky p. Čemu se rovná r?", b: "r = vzdálenost středu S od přímky p" },
  { f: "Vzdálenost dvou bodů A, B?", b: "|AB| = √((b₁−a₁)² + (b₂−a₂)²)" },
  { f: "Čtyři kuželosečky?", b: "kružnice, elipsa, parabola, hyperbola" },
  { f: "Jak zjistit polohu přímky a kružnice přes dosazení?", b: "Dosaď přímku do kružnice → kvadratická rovnice.\nD>0 sečna · D=0 tečna · D<0 vnější" },
];

// ══════════════════════════════════════════════════════════════════
// TABS + APP
// ══════════════════════════════════════════════════════════════════
const TABS = [
  { id: "prehled", label: "Přehled" },
  { id: "teorie", label: "Teorie" },
  { id: "ulohy", label: "Úlohy" },
  { id: "quiz", label: "Kvíz" },
  { id: "flashcards", label: "Kartičky" },
  { id: "formulas", label: "Vzorce" },
];

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
      `}</style>

      <div style={{ position: "relative", zIndex: 1, maxWidth: "920px", margin: "0 auto", padding: "20px 16px 60px" }}>
        <div style={{ textAlign: "center", marginBottom: "22px" }}>
          <h1 style={{ fontFamily: "'Audiowide', sans-serif", fontSize: "clamp(18px, 5vw, 32px)", color: "#fff", marginBottom: "6px", textShadow: `0 0 20px ${PINK}66` }}>Kružnice — analytická geometrie</h1>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "14px" }}>Kompletní příprava na test · středová & obecná rovnice · tečna · poloha přímky a bodu</p>
        </div>

        <div style={{ display: "flex", gap: "6px", justifyContent: "center", flexWrap: "wrap", marginBottom: "22px" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "8px 16px", borderRadius: "20px", border: tab === t.id ? `1px solid ${PINK}` : "1px solid rgba(255,255,255,0.12)", background: tab === t.id ? PINK + "22" : "rgba(255,255,255,0.04)", color: tab === t.id ? "#fff" : "rgba(255,255,255,0.6)", fontFamily: "'Exo 2', sans-serif", fontSize: "13.5px", fontWeight: 600, cursor: "pointer", transition: "all 0.4s ease" }}>{t.label}</button>
          ))}
        </div>

        {tab === "prehled" && <PrehledTab />}
        {tab === "teorie" && <TeorieTab />}
        {tab === "ulohy" && <UlohyTab />}
        {tab === "quiz" && <QuizEngine questions={quizQuestions} accentColor={PINK} />}
        {tab === "flashcards" && <Flashcards cards={flashcards} />}
        {tab === "formulas" && <FormulaSheet />}
      </div>
    </div>
  );
}
