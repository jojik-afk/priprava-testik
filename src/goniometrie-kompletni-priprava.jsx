// @title Goniometrie — kompletní příprava na písemku
// @subject Math
// @topic Goniometrie: hodnoty, kružnice, grafy, rovnice, výrazy
// @template mixed

import { useState, useCallback, useMemo, useEffect } from 'react';

// ══════════════════════════════════════════════════════════════════
// QUIZ ENGINE (from quiz-engine.jsx)
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
    const msg = pct >= 90 ? "Vyborne! Mas to perfektne zvladnute!" : pct >= 70 ? "Dobre! Temer mas vse zvladnute." : pct >= 50 ? "Mohlo by to byt lepsi, ale jdes spravnym smerem." : "Potrebujes vice pripravy. Opakuj a bude to!";
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "280px" }}>
        <div style={{ textAlign: "center", ...glass, padding: "40px 48px" }}>
          <div style={{ color: "#fff", fontSize: "52px", fontWeight: 800 }}>{score} / {shuffledQuestions.length}</div>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "22px", marginBottom: "16px" }}>{pct} %</div>
          <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "17px", lineHeight: 1.5, marginBottom: "24px", maxWidth: "340px", margin: "0 auto 24px" }}>{msg}</div>
          <button style={{ ...btnS, background: accentColor + "66", border: `1px solid ${accentColor}` }} onClick={restart}>Zacit znovu</button>
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
          return <div key={i} onClick={() => goTo(i)} title={`Otazka ${i + 1}`} style={{ width: "22px", height: "22px", borderRadius: "50%", cursor: "pointer", transition: "background 0.4s ease", background: bg }} />;
        })}
      </div>
      <div style={{ ...glass, padding: "24px" }}>
        <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", marginBottom: "6px" }}>Otazka {idx + 1} / {shuffledQuestions.length}</div>
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
                {isMulti && <span style={{ fontSize: "18px", minWidth: "20px", color: "rgba(255,255,255,0.7)" }}>{activeSet.includes(i) ? "\u2611" : "\u2610"}</span>}
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
            <div style={{ color: "#fff", fontWeight: 700, fontSize: "16px", marginBottom: "8px" }}>{isCorrect ? "Spravne!" : "Spatne"}</div>
            {!isCorrect && <div style={{ color: "#86efac", fontSize: "14px", marginBottom: "6px" }}>Spravna odpoved: {q.correct.map(i => q.options[i]).join(", ")}</div>}
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", lineHeight: 1.5 }}>{q.explanation}</div>
            {q.tip && <div style={{ color: "#fbbf24", fontSize: "13px", marginTop: "8px", fontStyle: "italic" }}>Tip: {q.tip}</div>}
          </div>
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button style={btnS} onClick={() => goTo(idx - 1)} disabled={idx === 0}>\u2190 Predchozi</button>
        {idx < shuffledQuestions.length - 1
          ? <button style={btnS} onClick={() => goTo(idx + 1)}>Dalsi \u2192</button>
          : <button style={{ ...btnS, background: accentColor + "55", border: `1px solid ${accentColor}` }} onClick={() => setShowResults(true)}>Vysledky \u2192</button>}
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

// ══════════════════════════════════════════════════════════════════
// TABS
// ══════════════════════════════════════════════════════════════════
const TABS = [
  { id: "theory", label: "Teorie" },
  { id: "problems", label: "Priklady" },
  { id: "quiz", label: "Kviz" },
  { id: "flashcards", label: "Karticky" },
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
            {badge === "Easy" ? "\u2728 Easy" : badge === "Medium" ? "\u26a1 Medium" : "\ud83d\udd25 Hard"}</span>}
        </div>
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "20px", transition: "transform 0.4s ease", transform: open ? "rotate(180deg)" : "rotate(0)" }}>\u25BC</span>
      </div>
      {open && <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>{children}</div>}
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
        {show ? "Skryt reseni" : "Zobrazit reseni"}
      </button>
      {show && <div style={{ marginTop: "12px", padding: "16px", borderRadius: "14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.85)", fontSize: "15px", lineHeight: 1.7 }}>{children}</div>}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// MATH DISPLAY HELPER
// ══════════════════════════════════════════════════════════════════
function M({ children }) {
  return <span style={{ fontFamily: "'JetBrains Mono', monospace", color: CYAN, fontSize: "inherit" }}>{children}</span>;
}

function MBlock({ children }) {
  return <div style={{ fontFamily: "'JetBrains Mono', monospace", color: CYAN, fontSize: "15px", padding: "12px 16px", background: "rgba(34,211,238,0.06)", borderRadius: "10px", margin: "8px 0", lineHeight: 1.8, overflowX: "auto" }}>{children}</div>;
}

// ══════════════════════════════════════════════════════════════════
// STEP component for solutions
// ══════════════════════════════════════════════════════════════════
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
    { deg: 0, rad: "0", sin: "0", cos: "1", tg: "0", cotg: "X" },
    { deg: 30, rad: "\u03c0/6", sin: "1/2", cos: "\u221a3/2", tg: "\u221a3/3", cotg: "\u221a3" },
    { deg: 45, rad: "\u03c0/4", sin: "\u221a2/2", cos: "\u221a2/2", tg: "1", cotg: "1" },
    { deg: 60, rad: "\u03c0/3", sin: "\u221a3/2", cos: "1/2", tg: "\u221a3", cotg: "\u221a3/3" },
    { deg: 90, rad: "\u03c0/2", sin: "1", cos: "0", tg: "X", cotg: "0" },
    { deg: 120, rad: "2\u03c0/3", sin: "\u221a3/2", cos: "-1/2", tg: "-\u221a3", cotg: "-\u221a3/3" },
    { deg: 135, rad: "3\u03c0/4", sin: "\u221a2/2", cos: "-\u221a2/2", tg: "-1", cotg: "-1" },
    { deg: 150, rad: "5\u03c0/6", sin: "1/2", cos: "-\u221a3/2", tg: "-\u221a3/3", cotg: "-\u221a3" },
    { deg: 180, rad: "\u03c0", sin: "0", cos: "-1", tg: "0", cotg: "X" },
    { deg: 210, rad: "7\u03c0/6", sin: "-1/2", cos: "-\u221a3/2", tg: "\u221a3/3", cotg: "\u221a3" },
    { deg: 225, rad: "5\u03c0/4", sin: "-\u221a2/2", cos: "-\u221a2/2", tg: "1", cotg: "1" },
    { deg: 240, rad: "4\u03c0/3", sin: "-\u221a3/2", cos: "-1/2", tg: "\u221a3", cotg: "\u221a3/3" },
    { deg: 270, rad: "3\u03c0/2", sin: "-1", cos: "0", tg: "X", cotg: "0" },
    { deg: 300, rad: "5\u03c0/3", sin: "-\u221a3/2", cos: "1/2", tg: "-\u221a3", cotg: "-\u221a3/3" },
    { deg: 315, rad: "7\u03c0/4", sin: "-\u221a2/2", cos: "\u221a2/2", tg: "-1", cotg: "-1" },
    { deg: 330, rad: "11\u03c0/6", sin: "-1/2", cos: "\u221a3/2", tg: "-\u221a3/3", cotg: "-\u221a3" },
  ];

  const r = 110;
  const cx = 150, cy = 150;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", alignItems: "flex-start" }}>
      <svg viewBox="0 0 300 300" style={{ width: "280px", height: "280px", flexShrink: 0 }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        <line x1={cx - r - 15} y1={cy} x2={cx + r + 15} y2={cy} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <line x1={cx} y1={cy - r - 15} x2={cx} y2={cy + r + 15} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        {/* Quadrant labels */}
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
            <div style={{ color: PINK, fontWeight: 700, fontSize: "18px", marginBottom: "8px" }}>{angles[selectedAngle].deg}\u00b0 = {angles[selectedAngle].rad}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
              {[["sin", angles[selectedAngle].sin], ["cos", angles[selectedAngle].cos], ["tg", angles[selectedAngle].tg], ["cotg", angles[selectedAngle].cotg]].map(([fn, val]) => (
                <div key={fn} style={{ padding: "8px", borderRadius: "8px", background: "rgba(255,255,255,0.04)", textAlign: "center" }}>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>{fn}</div>
                  <div style={{ color: "#fff", fontFamily: "'JetBrains Mono', monospace", fontSize: "16px", fontWeight: 600 }}>{val === "X" ? "nedef." : val}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", padding: "20px" }}>Klikni na bod na kruznici pro zobrazeni hodnot.</div>
        )}
        <div style={{ marginTop: "12px", color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>
          <div>I. kvadrant: sin+, cos+, tg+, cotg+</div>
          <div>II. kvadrant: sin+, cos-, tg-, cotg-</div>
          <div>III. kvadrant: sin-, cos-, tg+, cotg+</div>
          <div>IV. kvadrant: sin-, cos+, tg-, cotg-</div>
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
      <Collapsible title="1. Jednotkova kruznice a hodnoty" defaultOpen={true}>
        <p style={pS}>Na jednotkove kruznici je bod <M>[cos \u03b1; sin \u03b1]</M>. Uhel merimo od kladne poloosy x proti smeru hodinovych rucicek.</p>
        <UnitCircle />
        <div style={{ marginTop: "16px" }}>
          <div style={{ color: PINK, fontWeight: 600, marginBottom: "8px" }}>Zakladni tabulka hodnot:</div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", fontFamily: "'JetBrains Mono', monospace" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
                  {["", "0", "\u03c0/6", "\u03c0/4", "\u03c0/3", "\u03c0/2"].map(h => <th key={h} style={{ padding: "8px", color: CYAN, textAlign: "center" }}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {[
                  ["sin", "0", "1/2", "\u221a2/2", "\u221a3/2", "1"],
                  ["cos", "1", "\u221a3/2", "\u221a2/2", "1/2", "0"],
                  ["tg", "0", "\u221a3/3", "1", "\u221a3", "X"],
                  ["cotg", "X", "\u221a3", "1", "\u221a3/3", "0"],
                ].map(row => (
                  <tr key={row[0]} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <td style={{ padding: "8px", color: PINK, fontWeight: 600 }}>{row[0]}</td>
                    {row.slice(1).map((v, i) => <td key={i} style={{ padding: "8px", color: v === "X" ? "rgba(255,255,255,0.3)" : "#fff", textAlign: "center" }}>{v === "X" ? "ndef." : v}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Collapsible>

      <Collapsible title="2. Prevod na zakladni uhel">
        <p style={pS}>Velky uhel prevedeme odectenim celych nasobku <M>2\u03c0</M>:</p>
        <MBlock>sin(23\u03c0/6) = sin(23\u03c0/6 - 2\u00b72\u03c0) = sin(23\u03c0/6 - 24\u03c0/6) = sin(-\u03c0/6) = -1/2</MBlock>
        <p style={pS}>Zaporne uhly: <M>sin(-\u03b1) = -sin \u03b1</M>, <M>cos(-\u03b1) = cos \u03b1</M></p>
        <p style={pS}>Znaminko urcujeme podle kvadrantu, kde uhel lezi.</p>
      </Collapsible>

      <Collapsible title="3. Dopocitavani hodnot z jedne funkce">
        <p style={pS}>Zname jednu funkci + kvadrant \u2192 dopocitame ostatni pomoci:</p>
        <MBlock>sin\u00b2x + cos\u00b2x = 1{"\n"}tg x = sin x / cos x{"\n"}cotg x = cos x / sin x = 1 / tg x</MBlock>
        <p style={pS}><strong>Postup:</strong> Z dane funkce a identity <M>sin\u00b2x + cos\u00b2x = 1</M> urcime druhou funkci. Znaminko vybereme podle kvadrantu. Pak dopocitame tg a cotg jako podil.</p>
      </Collapsible>

      <Collapsible title="4. Goniometricke rovnice">
        <p style={pS}><strong>Elementarni:</strong> <M>sin x = a</M> \u2192 na kruznici najdeme uhly kde sinus = a</p>
        <p style={pS}><strong>Se sloz. argumentem:</strong> <M>cos(\u03c0/3 - 2x) = -1/2</M> \u2192 substituujeme <M>\u03b1 = \u03c0/3 - 2x</M>, vyresime <M>cos \u03b1 = -1/2</M>, pak zpetne dosadime.</p>
        <p style={pS}><strong>Kvadraticke (substituce):</strong> Napr. <M>2cos\u00b2x + cos x - 1 = 0</M> \u2192 substituce <M>y = cos x</M> \u2192 <M>2y\u00b2 + y - 1 = 0</M> \u2192 vyresime KR \u2192 zpetne dosadime.</p>
        <p style={pS}><strong>Vzdy:</strong> zapsat obecne reseni s parametrem <M>k \u2208 Z</M>!</p>
      </Collapsible>

      <Collapsible title="5. Transformace grafu">
        <p style={pS}>Obecny tvar: <M>y = a \u00b7 sin(b(x + c)) + d</M></p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "8px" }}>
          {[
            ["a", "Amplituda (vyska)", "Nasobi y-ove hodnoty, |a|"],
            ["b", "Zmena periody", "Perioda = 2\u03c0/|b| (sin, cos); \u03c0/|b| (tg, cotg)"],
            ["c", "Posun po ose x", "+ doleva, - doprava"],
            ["d", "Posun po ose y", "+ nahoru, - dolu"],
          ].map(([param, name, desc]) => (
            <div key={param} style={{ padding: "10px", borderRadius: "10px", background: "rgba(255,255,255,0.04)" }}>
              <div style={{ color: PINK, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{param}</div>
              <div style={{ color: "#fff", fontSize: "13px", fontWeight: 600 }}>{name}</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>{desc}</div>
            </div>
          ))}
        </div>
        <p style={{ ...pS, marginTop: "12px" }}><strong>Cteni grafu:</strong> Najdi amplitudu (max-min)/2, periodu (vzdalenost dvou maxim), posun (kde je maximum misto \u03c0/2 pro sin).</p>
      </Collapsible>

      <Collapsible title="6. Uprava vyrazu">
        <p style={pS}>Pouzivame vzorce pro dvojnasobny uhel a zakladni identity k zjednoduseni. Casto:</p>
        <MBlock>sin 2x = 2 sin x cos x{"\n"}cos 2x = cos\u00b2x - sin\u00b2x = 1 - 2sin\u00b2x = 2cos\u00b2x - 1{"\n"}sin\u00b2x = (1 - cos 2x)/2{"\n"}cos\u00b2x = (1 + cos 2x)/2</MBlock>
        <p style={pS}>Typicky postup: rozlozit, dosadit identity, zkratit. Pozor na definicni obor!</p>
      </Collapsible>
    </div>
  );
}

const pS = { color: "rgba(255,255,255,0.75)", fontSize: "15px", lineHeight: 1.7, marginBottom: "8px" };

// ══════════════════════════════════════════════════════════════════
// PROBLEMS TAB (main section — problem-heavy variant)
// ══════════════════════════════════════════════════════════════════
function ProblemsTab() {
  const [section, setSection] = useState(0);
  const sections = [
    "Hodnoty a kruznice",
    "Dopocitavani",
    "Rovnice (lin. arg.)",
    "Rovnice (substituce)",
    "Graf \u2192 predpis",
    "Predpis \u2192 graf",
    "Uprava vyrazu",
  ];

  return (
    <div>
      {/* Sub-navigation */}
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
      <Collapsible title="Pr. 1: Vypocitejte sin(23\u03c0/6)" badge="Easy" defaultOpen={true}>
        <MBlock>sin(23\u03c0/6) = ?</MBlock>
        <Solution>
          <Step n={1} title="Prevod na zakladni uhel">
            <MBlock>23\u03c0/6 = 3\u00b72\u03c0 + 5\u03c0/6{"\n"}(protoze 3\u00b72\u03c0 = 36\u03c0/6, zbyde 23-36 = ... ne){"\n"}23\u03c0/6 - 2\u03c0 = 23\u03c0/6 - 12\u03c0/6 = 11\u03c0/6{"\n"}11\u03c0/6 - 2\u03c0 = 11\u03c0/6 - 12\u03c0/6 = -\u03c0/6</MBlock>
          </Step>
          <Step n={2} title="Vyhodnoceni">
            <MBlock>sin(-\u03c0/6) = -sin(\u03c0/6) = -1/2</MBlock>
          </Step>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>Vysledek: sin(23\u03c0/6) = -1/2</div>
        </Solution>
      </Collapsible>

      <Collapsible title="Pr. 2: Vypocitejte (sin(11\u03c0/3) + cos(3\u03c0/4))\u00b2" badge="Medium">
        <MBlock>(sin(11\u03c0/3) + cos(3\u03c0/4))\u00b2 = ?</MBlock>
        <Solution>
          <Step n={1} title="Prevod uhlu">
            <MBlock>11\u03c0/3 - 2\u03c0 = 11\u03c0/3 - 6\u03c0/3 = 5\u03c0/3{"\n"}sin(5\u03c0/3) = -\u221a3/2{"\n"}{"\n"}cos(3\u03c0/4) = -\u221a2/2</MBlock>
          </Step>
          <Step n={2} title="Dosazeni a vyraz">
            <MBlock>(-\u221a3/2 + (-\u221a2/2))\u00b2 = (-\u221a3/2 - \u221a2/2)\u00b2{"\n"}= ((\u221a3 + \u221a2)/2)\u00b2{"\n"}= (3 + 2\u221a6 + 2)/4{"\n"}= (5 + 2\u221a6)/4</MBlock>
          </Step>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>Vysledek: (5 + 2\u221a6)/4</div>
        </Solution>
      </Collapsible>

      <Collapsible title="Pr. 3: Vypocitejte (sin(23\u03c0/6) - 1) / cotg(-\u03c0/3)" badge="Hard">
        <p style={pS}>Toto je priklad z cvicneho testu!</p>
        <MBlock>(sin(23\u03c0/6) - 1) / cotg(-\u03c0/3) = ?</MBlock>
        <Solution>
          <Step n={1} title="Citatel">
            <MBlock>sin(23\u03c0/6) = -1/2 (viz predchozi){"\n"}citatel = -1/2 - 1 = -3/2</MBlock>
          </Step>
          <Step n={2} title="Jmenovatel">
            <MBlock>cotg(-\u03c0/3) = -cotg(\u03c0/3) = -\u221a3/3</MBlock>
          </Step>
          <Step n={3} title="Podil">
            <MBlock>(-3/2) / (-\u221a3/3) = (-3/2) \u00b7 (-3/\u221a3){"\n"}= 9/(2\u221a3) = 9\u221a3/6 = 3\u221a3/2</MBlock>
          </Step>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>Vysledek: 3\u221a3/2</div>
        </Solution>
      </Collapsible>

      <Collapsible title="Pr. 4: sin(7\u03c0/6) \u00b7 cos(\u03c0/3)" badge="Easy">
        <MBlock>sin(7\u03c0/6) \u00b7 cos(\u03c0/3) = ?</MBlock>
        <Solution>
          <Step n={1} title="Hodnoty">
            <MBlock>sin(7\u03c0/6) = -1/2  (III. kvadrant, ref. uhel \u03c0/6){"\n"}cos(\u03c0/3) = 1/2</MBlock>
          </Step>
          <Step n={2} title="Soucin">
            <MBlock>(-1/2) \u00b7 (1/2) = -1/4</MBlock>
          </Step>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>Vysledek: -1/4</div>
        </Solution>
      </Collapsible>

      <Collapsible title="Pr. 5: Urcete uhel \u03b1 = -22\u03c0/3 na kruznici" badge="Medium">
        <MBlock>\u03b1 = -22\u03c0/3, najdete referencni uhel a k</MBlock>
        <Solution>
          <Step n={1} title="Prevod">
            <MBlock>\u03b1 = 2\u03c0/3 + k\u00b72\u03c0{"\n"}-22\u03c0/3 = 2\u03c0/3 + k\u00b72\u03c0{"\n"}-22\u03c0/3 - 2\u03c0/3 = k\u00b72\u03c0{"\n"}-24\u03c0/3 = k\u00b72\u03c0{"\n"}-8\u03c0 = k\u00b72\u03c0{"\n"}k = -4</MBlock>
          </Step>
          <Step n={2} title="Overeni">
            <MBlock>2\u03c0/3 + (-4)\u00b72\u03c0 = 2\u03c0/3 - 8\u03c0 = 2\u03c0/3 - 24\u03c0/3 = -22\u03c0/3 \u2713</MBlock>
          </Step>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>Uhel lezi na 2\u03c0/3 (120\u00b0), k = -4</div>
        </Solution>
      </Collapsible>
    </div>
  );
}

function ProblemsDopocitavani() {
  return (
    <div>
      <Collapsible title="Pr. 1: cotg x = \u221a39/6, x \u2208 (pi, 3pi/2)" badge="Hard" defaultOpen={true}>
        <p style={pS}>Z cvicneho testu! Aniž spocitate x, urcete sin x, cos x, tg x.</p>
        <MBlock>cotg x = \u221a39/6,  \u03c0 &lt; x &lt; 3\u03c0/2  (III. kvadrant)</MBlock>
        <Solution>
          <Step n={1} title="tg x z cotg x">
            <MBlock>tg x = 1/cotg x = 6/\u221a39 = 6\u221a39/39</MBlock>
          </Step>
          <Step n={2} title="Pouzijeme 1 + cotg\u00b2x = 1/sin\u00b2x">
            <MBlock>1 + (\u221a39/6)\u00b2 = 1/sin\u00b2x{"\n"}1 + 39/36 = 1/sin\u00b2x{"\n"}75/36 = 1/sin\u00b2x{"\n"}sin\u00b2x = 36/75 = 12/25</MBlock>
          </Step>
          <Step n={3} title="Znaminko z kvadrantu">
            <MBlock>III. kvadrant: sin &lt; 0, cos &lt; 0{"\n"}sin x = -2\u221a3/5</MBlock>
          </Step>
          <Step n={4} title="cos x z identity">
            <MBlock>cos\u00b2x = 1 - 12/25 = 13/25{"\n"}cos x = -\u221a13/5  (III. kvadrant, zaporne)</MBlock>
          </Step>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>sin x = -2\u221a3/5, cos x = -\u221a13/5, tg x = 6\u221a39/39</div>
        </Solution>
      </Collapsible>

      <Collapsible title="Pr. 2: tg x = -\u221a2, x \u2208 II. kvadrant" badge="Medium">
        <MBlock>tg x = -\u221a2, x \u2208 II. kv. Urcete sin x, cos x, cotg x.</MBlock>
        <Solution>
          <Step n={1} title="cotg x">
            <MBlock>cotg x = 1/tg x = -1/\u221a2 = -\u221a2/2</MBlock>
          </Step>
          <Step n={2} title="Z identity sin\u00b2x + cos\u00b2x = 1 a tg x = sin x/cos x">
            <MBlock>sin x = -\u221a2 \u00b7 cos x{"\n"}(-\u221a2 cos x)\u00b2 + cos\u00b2x = 1{"\n"}2cos\u00b2x + cos\u00b2x = 1{"\n"}3cos\u00b2x = 1{"\n"}cos x = -\u221a3/3  (II. kv. \u2192 cos &lt; 0)</MBlock>
          </Step>
          <Step n={3} title="sin x">
            <MBlock>sin x = -\u221a2 \u00b7 (-\u221a3/3) = \u221a6/3</MBlock>
          </Step>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>sin x = \u221a6/3, cos x = -\u221a3/3, cotg x = -\u221a2/2</div>
        </Solution>
      </Collapsible>

      <Collapsible title="Pr. 3: cotg x = -1/3, x \u2208 IV. kvadrant" badge="Medium">
        <MBlock>cotg x = -1/3, x \u2208 IV. kv. Urcete sin x, cos x.</MBlock>
        <Solution>
          <Step n={1} title="tg x a vyjadrime cos x pres sin x">
            <MBlock>tg x = -3, tj. sin x / cos x = -3{"\n"}cos x = (-1/3) \u00b7 sin x</MBlock>
          </Step>
          <Step n={2} title="Dosazeni do identity">
            <MBlock>sin\u00b2x + (1/9)sin\u00b2x = 1{"\n"}(10/9)sin\u00b2x = 1{"\n"}sin\u00b2x = 9/10{"\n"}sin x = -3\u221a10/10  (IV. kv. \u2192 sin &lt; 0)</MBlock>
          </Step>
          <Step n={3} title="cos x">
            <MBlock>cos x = \u221a10/10  (IV. kv. \u2192 cos &gt; 0)</MBlock>
          </Step>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>sin x = -3\u221a10/10, cos x = \u221a10/10</div>
        </Solution>
      </Collapsible>
    </div>
  );
}

function ProblemsRovniceLinArg() {
  return (
    <div>
      <Collapsible title="Pr. 1: cos(\u03c0/4 - x) = 1" badge="Easy" defaultOpen={true}>
        <p style={pS}>Z cvicneho testu!</p>
        <MBlock>cos(\u03c0/4 - x) = 1 v R</MBlock>
        <Solution>
          <Step n={1} title="Kdy cos = 1?">
            <MBlock>cos \u03b1 = 1 \u21d4 \u03b1 = 2k\u03c0, k \u2208 Z</MBlock>
          </Step>
          <Step n={2} title="Dosazeni">
            <MBlock>\u03c0/4 - x = 2k\u03c0{"\n"}-x = -\u03c0/4 + 2k\u03c0{"\n"}x = \u03c0/4 - 2k\u03c0</MBlock>
          </Step>
          <Step n={3} title="Ekvivalentni zapis">
            <MBlock>x = \u03c0/4 + 2k\u03c0, k \u2208 Z</MBlock>
            <p style={pS}>(protoze -2k\u03c0 a +2k\u03c0 pokryvaji stejna cisla pri k \u2208 Z)</p>
          </Step>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>x = \u03c0/4 + 2k\u03c0, k \u2208 Z</div>
        </Solution>
      </Collapsible>

      <Collapsible title="Pr. 2: cos(\u03c0/3 - 2x) = -1/2" badge="Medium">
        <MBlock>cos(\u03c0/3 - 2x) = -1/2 v R</MBlock>
        <Solution>
          <Step n={1} title="Substituce">
            <MBlock>\u03b1 = \u03c0/3 - 2x{"\n"}cos \u03b1 = -1/2{"\n"}\u03b1_1 = 2\u03c0/3 + 2k\u03c0{"\n"}\u03b1_2 = 4\u03c0/3 + 2k\u03c0</MBlock>
          </Step>
          <Step n={2} title="Zpetna substituce (vetev 1)">
            <MBlock>\u03c0/3 - 2x = 2\u03c0/3 + 2k\u03c0{"\n"}-2x = \u03c0/3 + 2k\u03c0{"\n"}x = -\u03c0/6 - k\u03c0</MBlock>
          </Step>
          <Step n={3} title="Zpetna substituce (vetev 2)">
            <MBlock>\u03c0/3 - 2x = 4\u03c0/3 + 2k\u03c0{"\n"}-2x = \u03c0 + 2k\u03c0{"\n"}x = -\u03c0/2 - k\u03c0</MBlock>
          </Step>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>x_1 = -\u03c0/6 - k\u03c0, x_2 = -\u03c0/2 - k\u03c0, k \u2208 Z</div>
          <p style={pS}>Ekvivalentne: x_1 = 5\u03c0/6 + k\u03c0, x_2 = \u03c0/2 + k\u03c0</p>
        </Solution>
      </Collapsible>

      <Collapsible title="Pr. 3: sin(2x) = \u221a3/2 na <0, 2\u03c0)" badge="Medium">
        <MBlock>sin(2x) = \u221a3/2, x \u2208 \u27e80, 2\u03c0)</MBlock>
        <Solution>
          <Step n={1} title="Substituce \u03b1 = 2x">
            <MBlock>sin \u03b1 = \u221a3/2{"\n"}\u03b1_1 = \u03c0/3 + 2k\u03c0{"\n"}\u03b1_2 = 2\u03c0/3 + 2k\u03c0</MBlock>
          </Step>
          <Step n={2} title="Zpet na x">
            <MBlock>x_1 = \u03c0/6 + k\u03c0{"\n"}x_2 = \u03c0/3 + k\u03c0</MBlock>
          </Step>
          <Step n={3} title="Vyber z intervalu <0, 2\u03c0)">
            <MBlock>k=0: x = \u03c0/6, \u03c0/3{"\n"}k=1: x = 7\u03c0/6, 4\u03c0/3</MBlock>
          </Step>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>K = {"{\u03c0/6, \u03c0/3, 7\u03c0/6, 4\u03c0/3}"}</div>
        </Solution>
      </Collapsible>

      <Collapsible title="Pr. 4: tg(2x + \u03c0/4) = \u221a3/3" badge="Hard">
        <MBlock>tg(2x + \u03c0/4) = \u221a3/3 v R</MBlock>
        <Solution>
          <Step n={1} title="Substituce a reseni">
            <MBlock>tg \u03b1 = \u221a3/3 \u21d4 \u03b1 = \u03c0/6 + k\u03c0{"\n"}(perioda tg je \u03c0)</MBlock>
          </Step>
          <Step n={2} title="Zpetna substituce">
            <MBlock>2x + \u03c0/4 = \u03c0/6 + k\u03c0{"\n"}2x = \u03c0/6 - \u03c0/4 + k\u03c0{"\n"}2x = (2\u03c0 - 3\u03c0)/12 + k\u03c0{"\n"}2x = -\u03c0/12 + k\u03c0{"\n"}x = -\u03c0/24 + k\u03c0/2</MBlock>
          </Step>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>x = -\u03c0/24 + k\u03c0/2 = \u03c0(12k - 1)/24, k \u2208 Z</div>
        </Solution>
      </Collapsible>

      <Collapsible title="Pr. 5: cos(x + \u03c0/6) = -1 v R" badge="Easy">
        <MBlock>cos(x + \u03c0/6) = -1</MBlock>
        <Solution>
          <Step n={1} title="Kdy cos = -1?">
            <MBlock>cos \u03b1 = -1 \u21d4 \u03b1 = \u03c0 + 2k\u03c0</MBlock>
          </Step>
          <Step n={2} title="Dosazeni">
            <MBlock>x + \u03c0/6 = \u03c0 + 2k\u03c0{"\n"}x = 5\u03c0/6 + 2k\u03c0</MBlock>
          </Step>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>x = 5\u03c0/6 + 2k\u03c0, k \u2208 Z</div>
        </Solution>
      </Collapsible>

      <Collapsible title="Pr. 6: sin(x - \u03c0/4) = 1/2 v R" badge="Medium">
        <MBlock>sin(x - \u03c0/4) = 1/2</MBlock>
        <Solution>
          <Step n={1} title="Reseni pro sin \u03b1 = 1/2">
            <MBlock>\u03b1_1 = \u03c0/6 + 2k\u03c0{"\n"}\u03b1_2 = 5\u03c0/6 + 2k\u03c0</MBlock>
          </Step>
          <Step n={2} title="Zpetna substituce">
            <MBlock>x - \u03c0/4 = \u03c0/6 + 2k\u03c0 \u2192 x = 5\u03c0/12 + 2k\u03c0{"\n"}x - \u03c0/4 = 5\u03c0/6 + 2k\u03c0 \u2192 x = 13\u03c0/12 + 2k\u03c0</MBlock>
          </Step>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>x_1 = 5\u03c0/12 + 2k\u03c0, x_2 = 13\u03c0/12 + 2k\u03c0, k \u2208 Z</div>
        </Solution>
      </Collapsible>
    </div>
  );
}

function ProblemsRovniceSubstituce() {
  return (
    <div>
      <Collapsible title="Pr. 1: 2 + cos 2x = -5 sin x" badge="Hard" defaultOpen={true}>
        <p style={pS}>Z cvicneho testu!</p>
        <MBlock>2 + cos 2x = -5 sin x</MBlock>
        <Solution>
          <Step n={1} title="Pouzijeme cos 2x = 1 - 2sin\u00b2x">
            <MBlock>2 + 1 - 2sin\u00b2x = -5 sin x{"\n"}-2sin\u00b2x + 5 sin x + 3 = 0{"\n"}2sin\u00b2x - 5 sin x - 3 = 0</MBlock>
          </Step>
          <Step n={2} title="Substituce y = sin x">
            <MBlock>2y\u00b2 - 5y - 3 = 0{"\n"}D = 25 + 24 = 49{"\n"}y = (5 \u00b1 7)/4{"\n"}y_1 = 3, y_2 = -1/2</MBlock>
          </Step>
          <Step n={3} title="Zpetna substituce">
            <MBlock>sin x = 3 \u2192 nema reseni (|sin x| \u2264 1){"\n"}sin x = -1/2{"\n"}x_1 = 7\u03c0/6 + 2k\u03c0{"\n"}x_2 = 11\u03c0/6 + 2k\u03c0</MBlock>
            <p style={pS}>Ekvivalentne: x = -\u03c0/6 + 2k\u03c0 nebo x = \u03c0 + \u03c0/6 + 2k\u03c0</p>
          </Step>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>x_1 = 7\u03c0/6 + 2k\u03c0, x_2 = 11\u03c0/6 + 2k\u03c0, k \u2208 Z</div>
        </Solution>
      </Collapsible>

      <Collapsible title="Pr. 2: 2cos\u00b2x + cos x - 1 = 0" badge="Medium">
        <MBlock>2cos\u00b2x + cos x - 1 = 0</MBlock>
        <Solution>
          <Step n={1} title="Substituce y = cos x">
            <MBlock>2y\u00b2 + y - 1 = 0{"\n"}D = 1 + 8 = 9{"\n"}y = (-1 \u00b1 3)/4{"\n"}y_1 = 1/2, y_2 = -1</MBlock>
          </Step>
          <Step n={2} title="Zpetna substituce">
            <MBlock>cos x = 1/2: x_1 = \u03c0/3 + 2k\u03c0, x_2 = 5\u03c0/3 + 2k\u03c0{"\n"}cos x = -1: x_3 = \u03c0 + 2k\u03c0</MBlock>
          </Step>
          <Step n={3} title="Overeni na <0, 2\u03c0)">
            <MBlock>K = {"{\u03c0/3, \u03c0, 5\u03c0/3}"}</MBlock>
          </Step>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>x = \u03c0/3 + 2k\u03c0, 5\u03c0/3 + 2k\u03c0, \u03c0 + 2k\u03c0, k \u2208 Z</div>
        </Solution>
      </Collapsible>

      <Collapsible title="Pr. 3: sin\u00b2x = 2 sin x" badge="Easy">
        <MBlock>sin\u00b2x = 2 sin x</MBlock>
        <Solution>
          <Step n={1} title="Uprava a substituce a = sin x">
            <MBlock>a\u00b2 - 2a = 0{"\n"}a(a - 2) = 0{"\n"}a_1 = 0, a_2 = 2</MBlock>
          </Step>
          <Step n={2} title="Zpetna substituce">
            <MBlock>sin x = 0 \u2192 x = k\u03c0{"\n"}sin x = 2 \u2192 nema reseni</MBlock>
          </Step>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>x = k\u03c0, k \u2208 Z</div>
        </Solution>
      </Collapsible>

      <Collapsible title="Pr. 4: 6sin\u00b2x - 7cos x - 1 = 0" badge="Hard">
        <MBlock>6sin\u00b2x - 7cos x - 1 = 0</MBlock>
        <Solution>
          <Step n={1} title="Prevod sin\u00b2x = 1 - cos\u00b2x">
            <MBlock>6(1 - cos\u00b2x) - 7cos x - 1 = 0{"\n"}-6cos\u00b2x - 7cos x + 5 = 0{"\n"}6cos\u00b2x + 7cos x - 5 = 0</MBlock>
          </Step>
          <Step n={2} title="Substituce a = cos x">
            <MBlock>6a\u00b2 + 7a - 5 = 0{"\n"}D = 49 + 120 = 169{"\n"}a = (-7 \u00b1 13)/12{"\n"}a_1 = 1/2, a_2 = -20/12 (X, mimo rozsah)</MBlock>
          </Step>
          <Step n={3} title="Zpetna substituce">
            <MBlock>cos x = 1/2{"\n"}x_1 = \u03c0/3 + 2k\u03c0{"\n"}x_2 = 5\u03c0/3 + 2k\u03c0</MBlock>
          </Step>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>x = \u00b1\u03c0/3 + 2k\u03c0, k \u2208 Z</div>
        </Solution>
      </Collapsible>

      <Collapsible title="Pr. 5: sin\u00b2x + 5 sin x + 4 = 0" badge="Medium">
        <MBlock>sin\u00b2x + 5 sin x + 4 = 0</MBlock>
        <Solution>
          <Step n={1} title="Substituce y = sin x">
            <MBlock>y\u00b2 + 5y + 4 = 0{"\n"}(y + 1)(y + 4) = 0{"\n"}y_1 = -1, y_2 = -4</MBlock>
          </Step>
          <Step n={2} title="Zpetna substituce">
            <MBlock>sin x = -1 \u2192 x = 3\u03c0/2 + 2k\u03c0{"\n"}sin x = -4 \u2192 nema reseni</MBlock>
          </Step>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>x = 3\u03c0/2 + 2k\u03c0, k \u2208 Z</div>
        </Solution>
      </Collapsible>

      <Collapsible title="Pr. 6: cos 2x + sin x = 0" badge="Medium">
        <MBlock>cos 2x + sin x = 0</MBlock>
        <Solution>
          <Step n={1} title="cos 2x = 1 - 2sin\u00b2x">
            <MBlock>1 - 2sin\u00b2x + sin x = 0{"\n"}2sin\u00b2x - sin x - 1 = 0</MBlock>
          </Step>
          <Step n={2} title="Substituce y = sin x">
            <MBlock>2y\u00b2 - y - 1 = 0{"\n"}y = (1 \u00b1 3)/4{"\n"}y_1 = 1, y_2 = -1/2</MBlock>
          </Step>
          <Step n={3} title="Zpetna substituce">
            <MBlock>sin x = 1 \u2192 x = \u03c0/2 + 2k\u03c0{"\n"}sin x = -1/2 \u2192 x = 7\u03c0/6 + 2k\u03c0 nebo x = 11\u03c0/6 + 2k\u03c0</MBlock>
          </Step>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>x = \u03c0/2 + 2k\u03c0, 7\u03c0/6 + 2k\u03c0, 11\u03c0/6 + 2k\u03c0</div>
        </Solution>
      </Collapsible>

      <Collapsible title="Pr. 7: sin 2x \u00b7 cos x + sin\u00b2x = 1" badge="Hard">
        <MBlock>sin 2x \u00b7 cos x + sin\u00b2x = 1</MBlock>
        <Solution>
          <Step n={1} title="sin 2x = 2 sin x cos x">
            <MBlock>2 sin x cos\u00b2x + sin\u00b2x = 1{"\n"}Ale sin\u00b2x + cos\u00b2x = 1, tak prepis:{"\n"}2 sin x cos\u00b2x + sin\u00b2x = sin\u00b2x + cos\u00b2x{"\n"}2 sin x cos\u00b2x = cos\u00b2x{"\n"}cos\u00b2x(2 sin x - 1) = 0</MBlock>
          </Step>
          <Step n={2} title="Rozklad na soucin">
            <MBlock>cos\u00b2x = 0 \u2192 cos x = 0 \u2192 x = \u03c0/2 + k\u03c0{"\n"}2 sin x - 1 = 0 \u2192 sin x = 1/2 \u2192 x = \u03c0/6 + 2k\u03c0, 5\u03c0/6 + 2k\u03c0</MBlock>
          </Step>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>x = \u03c0/2 + k\u03c0, \u03c0/6 + 2k\u03c0, 5\u03c0/6 + 2k\u03c0, k \u2208 Z</div>
        </Solution>
      </Collapsible>
    </div>
  );
}

function ProblemsGrafNaPredpis() {
  return (
    <div>
      <Collapsible title="Pr. 1: Sinusoida z cvicneho testu" badge="Medium" defaultOpen={true}>
        <p style={pS}>Graf z testu: sinusoida, minima v -2, maxima v 0, neprochazi pocatkem, perioda = \u03c0.</p>
        <p style={pS}>Popis grafu: amplituda = 1 (rozsah 0 az -2, stred = -1), perioda = \u03c0, posunuta dolu o 1.</p>
        <Solution>
          <Step n={1} title="Amplituda">
            <MBlock>a = (max - min)/2 = (0 - (-2))/2 = 1</MBlock>
          </Step>
          <Step n={2} title="Vertikalni posun">
            <MBlock>d = (max + min)/2 = (0 + (-2))/2 = -1</MBlock>
          </Step>
          <Step n={3} title="Perioda a b">
            <MBlock>T = \u03c0, b = 2\u03c0/T = 2</MBlock>
          </Step>
          <Step n={4} title="Faze (horizontalni posun)">
            <MBlock>Maximum je v x = \u03c0/4 (misto 0 pro -cos){"\n"}y = -cos(2x) - 1  nebo  y = cos(2x + \u03c0) - 1</MBlock>
          </Step>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>y = -cos(2x) - 1</div>
        </Solution>
      </Collapsible>

      <Collapsible title="Pr. 2: Sinusoida s body (-\u03c0/3, 4) a (5\u03c0/3, -4)" badge="Hard">
        <p style={pS}>Maximum 4, minimum -4, nulove body v 2\u03c0/3 a 8\u03c0/3.</p>
        <Solution>
          <Step n={1} title="Amplituda a perioda">
            <MBlock>a = 4{"\n"}Vzdalenost dvou po sobe jdoucich maxim: 11\u03c0/3 - (-\u03c0/3) = 4\u03c0{"\n"}T = 4\u03c0, b = 2\u03c0/T = 1/2</MBlock>
          </Step>
          <Step n={2} title="Posun">
            <MBlock>Max v x = -\u03c0/3. Pro sin je max v \u03c0/2b = \u03c0.{"\n"}Posun: -\u03c0/3 - \u03c0 = -4\u03c0/3, tj. c = 4\u03c0/3 vlevo? Hmm.{"\n"}{"\n"}Spis: y = 4cos(x/2 + \u03c0/6){"\n"}Max cosinusoidy pri argumentu = 0:{"\n"}x/2 + \u03c0/6 = 0 \u2192 x = -\u03c0/3 \u2713</MBlock>
          </Step>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>y = 4cos(x/2 + \u03c0/6)</div>
        </Solution>
      </Collapsible>

      <Collapsible title="Pr. 3: y = 2sin(2x + \u03c0/3) — postup cteni grafu" badge="Easy">
        <p style={pS}>Obecny postup pro rozpoznani y = a\u00b7sin(b(x+c)) + d z grafu:</p>
        <Solution>
          <Step n={1} title="Amplituda a = (max - min) / 2">
            <MBlock>Precteme maximum a minimum z grafu.</MBlock>
          </Step>
          <Step n={2} title="Vertikalni posun d = (max + min) / 2">
            <MBlock>Pokud d = 0, graf osciluje symetricky kolem osy x.</MBlock>
          </Step>
          <Step n={3} title="Perioda T a koeficient b">
            <MBlock>T = vzdalenost dvou po sobe jdoucich maxim{"\n"}b = 2\u03c0 / T (pro sin, cos){"\n"}b = \u03c0 / T (pro tg, cotg)</MBlock>
          </Step>
          <Step n={4} title="Faze c">
            <MBlock>Najdi x-ovou souradnici maxima (pro sin/cos).{"\n"}Pro y = sin: max je v b(x+c) = \u03c0/2{"\n"}Pro y = cos: max je v b(x+c) = 0{"\n"}Z toho vypoctete c.</MBlock>
          </Step>
          <div style={{ color: PINK, fontWeight: 600 }}>Priklad: max v (-\u03c0/6, 2), min v (5\u03c0/12, -2), T = \u03c0</div>
          <MBlock>a = 2, d = 0, b = 2{"\n"}Max pri x = -\u03c0/6: b(x+c) = \u03c0/2{"\n"}2(-\u03c0/6 + c) = \u03c0/2{"\n"}-\u03c0/3 + 2c = \u03c0/2{"\n"}2c = 5\u03c0/6{"\n"}c = 5\u03c0/12... ne, zkusme cos:{"\n"}b(x+c) = 0 \u2192 2(-\u03c0/6 + c) = 0 \u2192 c = \u03c0/6{"\n"}y = 2cos(2(x + \u03c0/6)) = 2cos(2x + \u03c0/3)</MBlock>
        </Solution>
      </Collapsible>
    </div>
  );
}

function ProblemsPredpisNaGraf() {
  return (
    <div>
      <Collapsible title="Pr. 1: y = sin(x + 2\u03c0/3)" badge="Easy" defaultOpen={true}>
        <MBlock>y = sin(x + 2\u03c0/3)</MBlock>
        <Solution>
          <Step n={1} title="Identifikace transformaci">
            <MBlock>Zakladni funkce: y = sin x{"\n"}Posun o 2\u03c0/3 DOLEVA (vnitrni +){"\n"}Amplituda = 1, perioda = 2\u03c0</MBlock>
          </Step>
          <Step n={2} title="Klicove body">
            <MBlock>sin x ma max v \u03c0/2.{"\n"}Posunuty max: \u03c0/2 - 2\u03c0/3 = -\u03c0/6{"\n"}Nuly: -2\u03c0/3 (start), \u03c0/3 (stred), 4\u03c0/3{"\n"}Min: -\u03c0/6 + \u03c0 = 5\u03c0/6</MBlock>
          </Step>
          <div style={{ color: PINK }}>Nakresli sinusoidu posunutou o 2\u03c0/3 doleva. Max v (-\u03c0/6, 1), nula v (\u03c0/3, 0), min v (5\u03c0/6, -1).</div>
        </Solution>
      </Collapsible>

      <Collapsible title="Pr. 2: y = -cos(2x)" badge="Easy">
        <MBlock>y = -cos(2x)</MBlock>
        <Solution>
          <Step n={1} title="Transformace">
            <MBlock>1. cos(x) \u2192 cos(2x): perioda 2\u03c0/2 = \u03c0{"\n"}2. -cos(2x): zrcadleni pres osu x{"\n"}Amplituda = 1</MBlock>
          </Step>
          <Step n={2} title="Klicove body">
            <MBlock>cos(2x) ma max v x=0.{"\n"}-cos(2x) ma MIN v x=0: (0, -1){"\n"}Nuly: \u03c0/4, 3\u03c0/4{"\n"}Max: \u03c0/2: (\u03c0/2, 1)</MBlock>
          </Step>
        </Solution>
      </Collapsible>

      <Collapsible title="Pr. 3: y = 2cos(2x - \u03c0/4)" badge="Medium">
        <MBlock>y = 2cos(2x - \u03c0/4) = 2cos(2(x - \u03c0/8))</MBlock>
        <Solution>
          <Step n={1} title="Rozklad parametru">
            <MBlock>a = 2 (amplituda){"\n"}b = 2 \u2192 T = \u03c0{"\n"}c = -\u03c0/8 (posun doprava o \u03c0/8){"\n"}d = 0</MBlock>
          </Step>
          <Step n={2} title="Klicove body">
            <MBlock>Max (cos arg = 0): 2(x - \u03c0/8) = 0 \u2192 x = \u03c0/8: (\u03c0/8, 2){"\n"}Nula: x = \u03c0/8 + \u03c0/4 = 3\u03c0/8{"\n"}Min: x = \u03c0/8 + \u03c0/2 = 5\u03c0/8: (5\u03c0/8, -2)</MBlock>
          </Step>
        </Solution>
      </Collapsible>

      <Collapsible title="Pr. 4: y = -tg(x/2)" badge="Medium">
        <MBlock>y = -tg(x/2)</MBlock>
        <Solution>
          <Step n={1} title="Transformace">
            <MBlock>tg(x/2): perioda = \u03c0/(1/2) = 2\u03c0{"\n"}-tg: zrcadleni pres osu x{"\n"}Asymptoty kde x/2 = \u03c0/2 + k\u03c0 \u2192 x = \u03c0 + 2k\u03c0</MBlock>
          </Step>
          <Step n={2} title="Klicove body">
            <MBlock>Nula: x = 0 (a kazdych 2\u03c0){"\n"}Asymptoty: x = \u00b1\u03c0, \u00b13\u03c0, ...{"\n"}Klesajici (protoze minus) na (-\u03c0, \u03c0)</MBlock>
          </Step>
        </Solution>
      </Collapsible>

      <Collapsible title="Pr. 5: y = cotg(2x + \u03c0) - 1" badge="Hard">
        <MBlock>y = cotg(2x + \u03c0) - 1 = cotg(2(x + \u03c0/2)) - 1</MBlock>
        <Solution>
          <Step n={1} title="Transformace">
            <MBlock>cotg(2x): perioda = \u03c0/2{"\n"}Posun o \u03c0/2 doleva{"\n"}Posun o 1 dolu{"\n"}{"\n"}Pozn: cotg(x + \u03c0) = cotg x (perioda cotg je \u03c0){"\n"}Takze cotg(2x + \u03c0) = cotg(2x){"\n"}y = cotg(2x) - 1</MBlock>
          </Step>
          <Step n={2} title="Klicove body">
            <MBlock>Asymptoty: 2x = k\u03c0 \u2192 x = k\u03c0/2{"\n"}Nula cotg: 2x = \u03c0/2 + k\u03c0 \u2192 x = \u03c0/4 + k\u03c0/2{"\n"}Ale -1 posun: y = 0 v jinem bode</MBlock>
          </Step>
        </Solution>
      </Collapsible>
    </div>
  );
}

function ProblemsVyrazy() {
  return (
    <div>
      <Collapsible title="Pr. 1: (sin x + sin 2x) / (1 + cos x + cos 2x)" badge="Hard" defaultOpen={true}>
        <p style={pS}>Z cvicneho testu!</p>
        <MBlock>(sin x + sin 2x) / (1 + cos x + cos 2x) = ?</MBlock>
        <Solution>
          <Step n={1} title="Rozepsani dvojnasobnych uhlu">
            <MBlock>Citatel: sin x + 2 sin x cos x = sin x(1 + 2 cos x){"\n"}Jmenovatel: 1 + cos x + (2cos\u00b2x - 1) = cos x + 2cos\u00b2x = cos x(1 + 2 cos x)</MBlock>
          </Step>
          <Step n={2} title="Zkraceni">
            <MBlock>sin x(1 + 2 cos x) / (cos x(1 + 2 cos x)){"\n"}= sin x / cos x = tg x</MBlock>
          </Step>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>Vysledek: tg x</div>
          <p style={pS}>Podminka: cos x \u2260 0 a 1 + 2cos x \u2260 0, tj. x \u2260 \u03c0/2 + k\u03c0 a x \u2260 \u00b12\u03c0/3 + 2k\u03c0</p>
        </Solution>
      </Collapsible>

      <Collapsible title="Pr. 2: (cotg x - tg x) / (cotg x + tg x)" badge="Hard">
        <p style={pS}>Z cvicneho testu!</p>
        <MBlock>(cotg x - tg x) / (cotg x + tg x) = ?</MBlock>
        <Solution>
          <Step n={1} title="Prepis na sin a cos">
            <MBlock>cotg x = cos x/sin x, tg x = sin x/cos x{"\n"}{"\n"}Citatel: cos x/sin x - sin x/cos x{"\n"}= (cos\u00b2x - sin\u00b2x)/(sin x cos x){"\n"}= cos 2x / (sin x cos x){"\n"}{"\n"}Jmenovatel: cos x/sin x + sin x/cos x{"\n"}= (cos\u00b2x + sin\u00b2x)/(sin x cos x){"\n"}= 1/(sin x cos x)</MBlock>
          </Step>
          <Step n={2} title="Podil">
            <MBlock>[cos 2x/(sin x cos x)] / [1/(sin x cos x)]{"\n"}= cos 2x</MBlock>
          </Step>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>Vysledek: cos 2x</div>
        </Solution>
      </Collapsible>

      <Collapsible title="Pr. 3: (cos\u00b2x - cos 2x) / sin 2x = (1/2) tg x" badge="Medium">
        <p style={pS}>Dokazte rovnost a urcete podminku.</p>
        <MBlock>(cos\u00b2x - cos 2x) / sin 2x = (1/2) tg x</MBlock>
        <Solution>
          <Step n={1} title="Leva strana">
            <MBlock>cos 2x = cos\u00b2x - sin\u00b2x{"\n"}L = (cos\u00b2x - (cos\u00b2x - sin\u00b2x)) / (2 sin x cos x){"\n"}= sin\u00b2x / (2 sin x cos x){"\n"}= sin x / (2 cos x){"\n"}= (1/2) tg x \u2713</MBlock>
          </Step>
          <Step n={2} title="Podminka">
            <MBlock>sin 2x \u2260 0 \u2192 x \u2260 k\u03c0/2{"\n"}D = R \ {"{k\u00b7\u03c0/2; k \u2208 Z}"}</MBlock>
          </Step>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>Dokazano. D: x \u2260 k\u03c0/2</div>
        </Solution>
      </Collapsible>

      <Collapsible title="Pr. 4: sin 2x/(1 + cos 2x) + (1 - cos 2x)/sin 2x = 2 tg x" badge="Hard">
        <MBlock>sin 2x/(1 + cos 2x) + (1 - cos 2x)/sin 2x = 2 tg x</MBlock>
        <Solution>
          <Step n={1} title="Dosazeni vzorcu">
            <MBlock>sin 2x = 2 sin x cos x{"\n"}cos 2x = cos\u00b2x - sin\u00b2x{"\n"}1 + cos 2x = 1 + cos\u00b2x - sin\u00b2x = 2cos\u00b2x{"\n"}1 - cos 2x = 1 - cos\u00b2x + sin\u00b2x = 2sin\u00b2x</MBlock>
          </Step>
          <Step n={2} title="Dosazeni do zlomku">
            <MBlock>2 sin x cos x / (2cos\u00b2x) + 2sin\u00b2x / (2 sin x cos x){"\n"}= sin x/cos x + sin x/cos x{"\n"}= tg x + tg x = 2 tg x \u2713</MBlock>
          </Step>
          <div style={{ color: "#22c55e", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>Dokazano. D: x \u2260 k\u03c0/2</div>
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
    question: "Kolik je sin(5\u03c0/6)?",
    type: "single",
    options: ["1/2", "-1/2", "\u221a3/2", "-\u221a3/2"],
    correct: [0],
    explanation: "5\u03c0/6 je v II. kvadrantu, referencni uhel je \u03c0/6. Sin je v II. kv. kladny, sin(\u03c0/6) = 1/2.",
    tip: "II. kvadrant = sin kladny, cos zaporny."
  },
  {
    question: "Kolik je cos(7\u03c0/4)?",
    type: "single",
    options: ["\u221a2/2", "-\u221a2/2", "1/2", "-1/2"],
    correct: [0],
    explanation: "7\u03c0/4 = 2\u03c0 - \u03c0/4 je v IV. kvadrantu. Cos je kladny v IV. kv., cos(\u03c0/4) = \u221a2/2.",
  },
  {
    question: "Jaka je perioda funkce y = sin(3x)?",
    type: "single",
    options: ["2\u03c0/3", "3\u03c0", "6\u03c0", "\u03c0/3"],
    correct: [0],
    explanation: "Pro sin(bx) je perioda T = 2\u03c0/b. Tady b = 3, takze T = 2\u03c0/3.",
    tip: "T = 2\u03c0/b pro sin a cos, T = \u03c0/b pro tg a cotg."
  },
  {
    question: "Jaka je perioda funkce y = -2sin(x/2)?",
    type: "single",
    options: ["4\u03c0", "2\u03c0", "\u03c0", "\u03c0/2"],
    correct: [0],
    explanation: "b = 1/2, T = 2\u03c0/(1/2) = 4\u03c0. Zaporny koeficient a amplituda nemeji periodu.",
  },
  {
    question: "Jaka je perioda funkce y = -(1/2)tg(4x)?",
    type: "single",
    options: ["\u03c0/4", "4\u03c0", "\u03c0/2", "2\u03c0"],
    correct: [0],
    explanation: "Pro tg(bx) je T = \u03c0/b. Tady b = 4, T = \u03c0/4.",
  },
  {
    question: "Rovnice cos x = -1 ma reseni:",
    type: "single",
    options: ["x = \u03c0 + 2k\u03c0", "x = 3\u03c0/2 + 2k\u03c0", "x = 0 + 2k\u03c0", "x = \u03c0/2 + k\u03c0"],
    correct: [0],
    explanation: "cos x = -1 nastava pouze v bode \u03c0 na jednotkove kruznici, s periodou 2\u03c0.",
  },
  {
    question: "sin\u00b2x + cos\u00b2x = ?",
    type: "single",
    options: ["1", "0", "2", "sin 2x"],
    correct: [0],
    explanation: "Zakladni goniometricka identita (Pythagorova veta na jednotkove kruznici).",
    tip: "Toto je nejdulezitejsi identita v goniometrii!"
  },
  {
    question: "cos 2x se rovna:",
    type: "multi",
    options: ["cos\u00b2x - sin\u00b2x", "1 - 2sin\u00b2x", "2cos\u00b2x - 1", "2sin x cos x"],
    correct: [0, 1, 2],
    explanation: "Vsechny tri prvni tvary jsou spravne (ekvivalentni). 2sin x cos x = sin 2x, ne cos 2x.",
  },
  {
    question: "sin 2x = ?",
    type: "single",
    options: ["2 sin x cos x", "sin\u00b2x + cos\u00b2x", "cos\u00b2x - sin\u00b2x", "2 sin\u00b2x"],
    correct: [0],
    explanation: "Vzorec pro dvojnasobny uhel: sin 2x = 2 sin x cos x.",
  },
  {
    question: "Funkce y = 3sin(2(x - \u03c0/6)) ma amplitudu a periodu:",
    type: "single",
    options: ["a = 3, T = \u03c0", "a = 3, T = 2\u03c0", "a = 2, T = 3\u03c0", "a = 6, T = \u03c0/2"],
    correct: [0],
    explanation: "Amplituda = |a| = 3. Perioda = 2\u03c0/b = 2\u03c0/2 = \u03c0.",
  },
  {
    question: "Ve kterych kvadrantech je tg x kladny?",
    type: "multi",
    options: ["I. kvadrant", "II. kvadrant", "III. kvadrant", "IV. kvadrant"],
    correct: [0, 2],
    explanation: "tg = sin/cos. V I. kv. oba kladne (+/+), v III. kv. oba zaporne (-/- = +).",
    tip: "tg a cotg maji stejne znaminko — kladne v I. a III. kv."
  },
  {
    question: "Rovnice 2cos\u00b2x - cos x - 1 = 0: jaka je spravna substituce?",
    type: "single",
    options: ["y = cos x, pak 2y\u00b2 - y - 1 = 0", "y = cos\u00b2x, pak 2y - y - 1 = 0", "y = sin x, pak 2y\u00b2 - y - 1 = 0", "y = 2cos x, pak y\u00b2 - y - 1 = 0"],
    correct: [0],
    explanation: "Substituujeme y = cos x. Rovnice 2y\u00b2 - y - 1 = 0 je standardni kvadraticka rovnice.",
  },
  {
    question: "cotg(\u03c0/4) = ?",
    type: "single",
    options: ["1", "0", "\u221a3", "\u221a3/3"],
    correct: [0],
    explanation: "cotg(\u03c0/4) = cos(\u03c0/4)/sin(\u03c0/4) = (\u221a2/2)/(\u221a2/2) = 1.",
  },
  {
    question: "Kdyz x je v III. kvadrantu a cotg x = 2, pak:",
    type: "multi",
    options: ["sin x < 0", "cos x < 0", "tg x > 0", "tg x < 0"],
    correct: [0, 1, 2],
    explanation: "V III. kv.: sin < 0, cos < 0. tg = sin/cos = (-)/(-) > 0. cotg > 0 souhlasi.",
  },
  {
    question: "Jak se zmeni graf funkce y = sin x pri transformaci y = sin(x + \u03c0/2)?",
    type: "single",
    options: ["Posune se o \u03c0/2 DOLEVA", "Posune se o \u03c0/2 DOPRAVA", "Posune se o \u03c0/2 NAHORU", "Zmeni se perioda"],
    correct: [0],
    explanation: "Vnitrni transformace +c posouva graf DOLEVA o c. sin(x + \u03c0/2) = cos x.",
    tip: "Vnitrni + = DOLEVA, vnitrni - = DOPRAVA (opak intuice!)"
  },
  {
    question: "tg x = sin x / cos x. Kdy tg x neni definovan?",
    type: "single",
    options: ["Kdyz cos x = 0, tj. x = \u03c0/2 + k\u03c0", "Kdyz sin x = 0, tj. x = k\u03c0", "Kdyz x = 2k\u03c0", "tg x je vzdy definovan"],
    correct: [0],
    explanation: "tg x = sin x / cos x, takze neni definovan kde cos x = 0, tj. v x = \u03c0/2 + k\u03c0.",
  },
];

// ══════════════════════════════════════════════════════════════════
// FLASHCARDS DATA
// ══════════════════════════════════════════════════════════════════
const flashcardsData = [
  { front: "sin\u00b2x + cos\u00b2x = ?", back: "1\n(Pythagorova identita)" },
  { front: "sin 2x = ?", back: "2 sin x cos x" },
  { front: "cos 2x = ? (3 tvary)", back: "cos\u00b2x - sin\u00b2x\n= 1 - 2sin\u00b2x\n= 2cos\u00b2x - 1" },
  { front: "tg x = ?", back: "sin x / cos x" },
  { front: "cotg x = ?", back: "cos x / sin x = 1 / tg x" },
  { front: "Perioda sin(bx), cos(bx)?", back: "T = 2\u03c0 / |b|" },
  { front: "Perioda tg(bx), cotg(bx)?", back: "T = \u03c0 / |b|" },
  { front: "sin(\u03c0/6) = ?", back: "1/2" },
  { front: "cos(\u03c0/6) = ?", back: "\u221a3/2" },
  { front: "sin(\u03c0/4) = ?", back: "\u221a2/2" },
  { front: "cos(\u03c0/4) = ?", back: "\u221a2/2" },
  { front: "sin(\u03c0/3) = ?", back: "\u221a3/2" },
  { front: "cos(\u03c0/3) = ?", back: "1/2" },
  { front: "tg(\u03c0/3) = ?", back: "\u221a3" },
  { front: "tg(\u03c0/6) = ?", back: "\u221a3/3" },
  { front: "Znaminko sin ve III. kv.?", back: "ZAPORNE (sin < 0)" },
  { front: "Znaminko cos ve II. kv.?", back: "ZAPORNE (cos < 0)" },
  { front: "y = a sin(b(x+c)) + d\nCo je a?", back: "Amplituda — nasobi y-ove hodnoty\nRozsah: <-|a|, |a|> (bez d)" },
  { front: "y = a sin(b(x+c)) + d\nCo je c?", back: "Horizontalni posun\n+c = doleva, -c = doprava" },
  { front: "sin\u00b2x = ? (pres cos 2x)", back: "(1 - cos 2x) / 2" },
  { front: "cos\u00b2x = ? (pres cos 2x)", back: "(1 + cos 2x) / 2" },
  { front: "sin(-\u03b1) = ?", back: "-sin \u03b1 (licha funkce)" },
  { front: "cos(-\u03b1) = ?", back: "cos \u03b1 (suda funkce)" },
  { front: "1 + tg\u00b2x = ?", back: "1 / cos\u00b2x" },
  { front: "1 + cotg\u00b2x = ?", back: "1 / sin\u00b2x" },
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
      <div onClick={() => setFlipped(!flipped)} style={{ ...glass, padding: "40px 32px", minHeight: "200px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", transition: "all 0.4s ease", transform: flipped ? "rotateY(0)" : "rotateY(0)", background: flipped ? "rgba(236,72,153,0.08)" : "rgba(255,255,255,0.05)" }}>
        <div>
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", marginBottom: "12px" }}>{flipped ? "ODPOVED" : "OTAZKA"} ({idx + 1}/{flashcardsData.length})</div>
          <div style={{ color: "#fff", fontSize: "22px", fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", whiteSpace: "pre-line", lineHeight: 1.6 }}>{flipped ? card.back : card.front}</div>
          {!flipped && <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px", marginTop: "16px" }}>Klikni pro otoceni</div>}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "16px", flexWrap: "wrap" }}>
        <button style={btnS} onClick={() => { setIdx(Math.max(0, idx - 1)); setFlipped(false); }} disabled={idx === 0}>\u2190 Predchozi</button>
        <button style={{ ...btnS, background: PINK + "22", border: `1px solid ${PINK}` }} onClick={() => setFlipped(!flipped)}>{flipped ? "Otocit zpet" : "Zobrazit odpoved"}</button>
        <button style={btnS} onClick={() => { setIdx(Math.min(flashcardsData.length - 1, idx + 1)); setFlipped(false); }} disabled={idx === flashcardsData.length - 1}>Dalsi \u2192</button>
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
        <div style={{ color: PINK, fontWeight: 700, fontSize: "18px", marginBottom: "12px" }}>Zakladni identity</div>
        <MBlock>sin\u00b2x + cos\u00b2x = 1{"\n"}tg x = sin x / cos x{"\n"}cotg x = cos x / sin x{"\n"}tg x \u00b7 cotg x = 1{"\n"}1 + tg\u00b2x = 1/cos\u00b2x{"\n"}1 + cotg\u00b2x = 1/sin\u00b2x</MBlock>
      </div>

      <div style={{ ...glass, padding: "20px", marginBottom: "16px" }}>
        <div style={{ color: PINK, fontWeight: 700, fontSize: "18px", marginBottom: "12px" }}>Dvojnasobny uhel</div>
        <MBlock>sin 2x = 2 sin x cos x{"\n"}cos 2x = cos\u00b2x - sin\u00b2x{"\n"}       = 1 - 2sin\u00b2x{"\n"}       = 2cos\u00b2x - 1</MBlock>
      </div>

      <div style={{ ...glass, padding: "20px", marginBottom: "16px" }}>
        <div style={{ color: PINK, fontWeight: 700, fontSize: "18px", marginBottom: "12px" }}>Polovicni uhel</div>
        <MBlock>sin\u00b2(x/2) = (1 - cos x)/2{"\n"}cos\u00b2(x/2) = (1 + cos x)/2</MBlock>
      </div>

      <div style={{ ...glass, padding: "20px", marginBottom: "16px" }}>
        <div style={{ color: PINK, fontWeight: 700, fontSize: "18px", marginBottom: "12px" }}>Sudost a lichost</div>
        <MBlock>sin(-x) = -sin x  (licha){"\n"}cos(-x) = cos x   (suda){"\n"}tg(-x) = -tg x    (licha){"\n"}cotg(-x) = -cotg x (licha)</MBlock>
      </div>

      <div style={{ ...glass, padding: "20px", marginBottom: "16px" }}>
        <div style={{ color: PINK, fontWeight: 700, fontSize: "18px", marginBottom: "12px" }}>Periody</div>
        <MBlock>sin(bx), cos(bx): T = 2\u03c0/|b|{"\n"}tg(bx), cotg(bx): T = \u03c0/|b|</MBlock>
      </div>

      <div style={{ ...glass, padding: "20px", marginBottom: "16px" }}>
        <div style={{ color: PINK, fontWeight: 700, fontSize: "18px", marginBottom: "12px" }}>Transformace y = a\u00b7f(b(x + c)) + d</div>
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "4px 16px", fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", color: "#fff" }}>
          <span style={{ color: CYAN }}>|a|</span><span>amplituda (nasobeni y)</span>
          <span style={{ color: CYAN }}>a &lt; 0</span><span>zrcadleni pres osu x</span>
          <span style={{ color: CYAN }}>b</span><span>zmena periody (T = 2\u03c0/b)</span>
          <span style={{ color: CYAN }}>c &gt; 0</span><span>posun DOLEVA o c</span>
          <span style={{ color: CYAN }}>c &lt; 0</span><span>posun DOPRAVA o |c|</span>
          <span style={{ color: CYAN }}>d &gt; 0</span><span>posun NAHORU o d</span>
          <span style={{ color: CYAN }}>d &lt; 0</span><span>posun DOLU o |d|</span>
        </div>
      </div>

      <div style={{ ...glass, padding: "20px", marginBottom: "16px" }}>
        <div style={{ color: PINK, fontWeight: 700, fontSize: "18px", marginBottom: "12px" }}>Tabulka hodnot (I. kvadrant)</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'JetBrains Mono', monospace", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid rgba(255,255,255,0.2)" }}>
                {["", "0\u00b0", "30\u00b0 (\u03c0/6)", "45\u00b0 (\u03c0/4)", "60\u00b0 (\u03c0/3)", "90\u00b0 (\u03c0/2)"].map(h => <th key={h} style={{ padding: "10px 6px", color: CYAN, textAlign: "center", fontSize: "12px" }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {[
                ["sin", "0", "1/2", "\u221a2/2", "\u221a3/2", "1"],
                ["cos", "1", "\u221a3/2", "\u221a2/2", "1/2", "0"],
                ["tg", "0", "\u221a3/3", "1", "\u221a3", "ndef."],
                ["cotg", "ndef.", "\u221a3", "1", "\u221a3/3", "0"],
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
        <div style={{ color: PINK, fontWeight: 700, fontSize: "18px", marginBottom: "12px" }}>Znaminko v kvadrantech</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", maxWidth: "360px", margin: "0 auto" }}>
          {[
            ["II.", "sin +", "cos -", "tg -", "cotg -"],
            ["I.", "sin +", "cos +", "tg +", "cotg +"],
            ["III.", "sin -", "cos -", "tg +", "cotg +"],
            ["IV.", "sin -", "cos +", "tg -", "cotg -"],
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
        {/* Grid floor */}
        <div style={{ position: "absolute", bottom: 0, left: "-50%", width: "200%", height: "50%", background: `linear-gradient(transparent 0%, ${PINK}11 100%)`, backgroundSize: "60px 60px", backgroundImage: `linear-gradient(${PINK}15 1px, transparent 1px), linear-gradient(90deg, ${PINK}15 1px, transparent 1px)`, transform: "perspective(500px) rotateX(60deg)", transformOrigin: "center bottom" }} />
        {/* Neon sun */}
        <div style={{ position: "absolute", top: "8%", left: "50%", transform: "translateX(-50%)", width: "200px", height: "200px", borderRadius: "50%", background: `radial-gradient(circle, ${PINK}44, ${CYAN}22, transparent)`, filter: "blur(40px)" }} />
        {/* Particles */}
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
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h1 style={{ fontFamily: "'Audiowide', sans-serif", fontSize: "clamp(22px, 5vw, 36px)", color: "#fff", marginBottom: "6px", textShadow: `0 0 20px ${PINK}66` }}>Goniometrie</h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>Kompletni priprava na pisemku — 20. 4. 2026</p>
        </div>

        {/* Tab bar */}
        <div style={{ display: "flex", gap: "6px", justifyContent: "center", flexWrap: "wrap", marginBottom: "20px" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "8px 20px", borderRadius: "20px", border: tab === t.id ? `1px solid ${PINK}` : "1px solid rgba(255,255,255,0.12)", background: tab === t.id ? PINK + "22" : "rgba(255,255,255,0.04)", color: tab === t.id ? "#fff" : "rgba(255,255,255,0.6)", fontFamily: "'Exo 2', sans-serif", fontSize: "14px", fontWeight: 600, cursor: "pointer", transition: "all 0.4s ease" }}>{t.label}</button>
          ))}
        </div>

        {/* Content */}
        {tab === "theory" && <TheoryTab />}
        {tab === "problems" && <ProblemsTab />}
        {tab === "quiz" && <QuizEngine questions={quizQuestions} accentColor={PINK} />}
        {tab === "flashcards" && <Flashcards />}
        {tab === "formulas" && <FormulaSheet />}
      </div>
    </div>
  );
}
