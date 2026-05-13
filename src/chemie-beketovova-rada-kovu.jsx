// @title Chemie — Beketovova řada napětí kovů
// @subject Chemistry
// @topic Elektrochemická řada napětí kovů
// @template practice

import React, { useState, useMemo, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════
// QUIZ ENGINE (zkopírováno z assets/quiz-engine.jsx)
// ═══════════════════════════════════════════════════════════════

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

function QuizEngine({ questions, accentColor = "#8b5cf6" }) {
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
    setIdx(0); setAnswers({}); setRevealed({}); setPendingMulti([]);
    setShowResults(false); setShuffleKey(k => k + 1);
  }, []);

  if (showResults) {
    const msg = pct >= 90 ? "Výborně! Máš to perfektně zvládnuté!"
      : pct >= 70 ? "Dobře! Téměř máš vše zvládnuté."
      : pct >= 50 ? "Mohlo by to být lepší, ale jdeš správným směrem."
      : "Potřebuješ více přípravy. Opakuj a bude to!";
    return (
      <div style={QS.resultsWrap}>
        <div style={QS.resultsCard}>
          <div style={QS.resultsScore}>{score} / {shuffledQuestions.length}</div>
          <div style={QS.resultsPct}>{pct} %</div>
          <div style={QS.resultsMsg}>{msg}</div>
          <button style={{ ...QS.btn, background: accentColor + "66", border: `1px solid ${accentColor}` }} onClick={restart}>
            Začít znovu
          </button>
        </div>
      </div>
    );
  }

  const activeSet = isMulti ? (isRevealed ? myAnswer : pendingMulti) : myAnswer;

  return (
    <div style={QS.wrap}>
      <div style={QS.dotBar}>
        {shuffledQuestions.map((_, i) => {
          let bg = "#4b5563";
          if (i === idx) bg = accentColor;
          else if (revealed[i]) bg = arrEqual(answers[i] || [], shuffledQuestions[i].correct) ? "#22c55e" : "#ef4444";
          return <div key={i} onClick={() => goTo(i)} title={`Otázka ${i + 1}`} style={{ ...QS.dot, background: bg }} />;
        })}
      </div>

      <div style={QS.card}>
        <div style={QS.qNum}>Otázka {idx + 1} / {shuffledQuestions.length}</div>
        <div style={QS.qText}>{q.question}</div>

        <div style={QS.optionsList}>
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
              <div key={i} style={{ ...QS.option, background: bg, border }}
                onClick={() => isMulti ? toggleMulti(i) : handleSingleSelect(i)}>
                {isMulti && <span style={QS.checkbox}>{activeSet.includes(i) ? "☑" : "☐"}</span>}
                <span dangerouslySetInnerHTML={{ __html: opt }} />
              </div>
            );
          })}
        </div>

        {isMulti && !isRevealed && (
          <button style={{ ...QS.btn, opacity: pendingMulti.length === 0 ? 0.4 : 1 }}
            onClick={submitMulti} disabled={pendingMulti.length === 0}>
            Potvrdit
          </button>
        )}

        {isRevealed && (
          <div style={{ ...QS.feedback, borderColor: isCorrect ? "#22c55e" : "#ef4444" }}>
            <div style={QS.feedbackHeader}>{isCorrect ? "Správně!" : "Špatně"}</div>
            {!isCorrect && (
              <div style={QS.feedbackCorrect}>
                Správná odpověď: <span dangerouslySetInnerHTML={{ __html: q.correct.map(i => q.options[i]).join(", ") }} />
              </div>
            )}
            <div style={QS.feedbackExplanation} dangerouslySetInnerHTML={{ __html: q.explanation }} />
            {q.tip && <div style={QS.feedbackTip}>Tip: {q.tip}</div>}
          </div>
        )}
      </div>

      <div style={QS.navRow}>
        <button style={QS.btn} onClick={() => goTo(idx - 1)} disabled={idx === 0}>← Předchozí</button>
        {idx < shuffledQuestions.length - 1
          ? <button style={QS.btn} onClick={() => goTo(idx + 1)}>Další →</button>
          : <button style={{ ...QS.btn, background: accentColor + "55", border: `1px solid ${accentColor}` }} onClick={() => setShowResults(true)}>Výsledky →</button>
        }
      </div>
    </div>
  );
}

const QS = {
  wrap: { display: "flex", flexDirection: "column", gap: "16px", maxWidth: "780px", margin: "0 auto", padding: "16px" },
  dotBar: { display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" },
  dot: { width: "22px", height: "22px", borderRadius: "50%", cursor: "pointer", transition: "background 0.4s ease" },
  card: { background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "24px", transition: "all 0.4s ease" },
  qNum: { color: "rgba(255,255,255,0.35)", fontSize: "13px", marginBottom: "6px" },
  qText: { color: "#fff", fontSize: "18px", fontWeight: 600, lineHeight: 1.5, marginBottom: "20px" },
  optionsList: { display: "flex", flexDirection: "column", gap: "10px" },
  option: { padding: "12px 16px", borderRadius: "12px", color: "#fff", cursor: "pointer", transition: "all 0.4s ease", display: "flex", alignItems: "center", gap: "10px", userSelect: "none", fontSize: "15px" },
  checkbox: { fontSize: "18px", minWidth: "20px", color: "rgba(255,255,255,0.7)" },
  btn: { marginTop: "12px", padding: "10px 22px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", color: "#fff", cursor: "pointer", fontSize: "15px", transition: "all 0.4s ease" },
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

// ═══════════════════════════════════════════════════════════════
// DATA — Beketovova řada
// ═══════════════════════════════════════════════════════════════

const METAL_SERIES = [
  { symbol: 'K',  ion: 'K⁺',    name: 'draslík',  group: 'water', noble: false },
  { symbol: 'Na', ion: 'Na⁺',   name: 'sodík',    group: 'water', noble: false },
  { symbol: 'Ca', ion: 'Ca²⁺',  name: 'vápník',   group: 'water', noble: false },
  { symbol: 'Mg', ion: 'Mg²⁺',  name: 'hořčík',   group: 'acid',  noble: false },
  { symbol: 'Al', ion: 'Al³⁺',  name: 'hliník',   group: 'acid',  noble: false },
  { symbol: 'Zn', ion: 'Zn²⁺',  name: 'zinek',    group: 'acid',  noble: false },
  { symbol: 'Fe', ion: 'Fe²⁺',  name: 'železo',   group: 'acid',  noble: false },
  { symbol: 'Pb', ion: 'Pb²⁺',  name: 'olovo',    group: 'acid',  noble: false },
  { symbol: 'H',  ion: 'H⁺',    name: 'vodík',    group: 'hydrogen', noble: null },
  { symbol: 'Cu', ion: 'Cu²⁺',  name: 'měď',      group: 'noble', noble: true },
  { symbol: 'Ag', ion: 'Ag⁺',   name: 'stříbro',  group: 'noble', noble: true },
  { symbol: 'Hg', ion: 'Hg²⁺',  name: 'rtuť',     group: 'noble', noble: true },
  { symbol: 'Au', ion: 'Au³⁺',  name: 'zlato',    group: 'noble', noble: true },
  { symbol: 'Pt', ion: 'Pt²⁺',  name: 'platina',  group: 'noble', noble: true },
];

const ACCENT = '#8b5cf6';   // violet (chemistry)
const ACCENT2 = '#06b6d4';  // cyan
const NOBLE_COLOR = '#f59e0b';

// ═══════════════════════════════════════════════════════════════
// HLAVNÍ KOMPONENTA
// ═══════════════════════════════════════════════════════════════

export default function App() {
  const [tab, setTab] = useState('theory');

  return (
    <div style={mainStyles.app}>
      <Synthwave />
      <div style={mainStyles.container}>
        <Header />
        <Tabs tab={tab} setTab={setTab} />
        <div style={mainStyles.content}>
          {tab === 'theory' && <TheoryTab />}
          {tab === 'series' && <SeriesExplorer />}
          {tab === 'problems' && <ProblemsTab />}
          {tab === 'quiz' && <QuizTab />}
          {tab === 'flashcards' && <FlashcardsTab />}
          {tab === 'cheatsheet' && <CheatSheet />}
        </div>
      </div>
    </div>
  );
}

// ─── Header ────────────────────────────────────────────────────

function Header() {
  return (
    <div style={mainStyles.header}>
      <div style={mainStyles.titleRow}>
        <span style={mainStyles.titleIcon}>⚡</span>
        <h1 style={mainStyles.title}>Beketovova řada napětí kovů</h1>
      </div>
      <div style={mainStyles.subtitle}>Elektrochemická řada — kompletní příprava na test</div>
    </div>
  );
}

// ─── Tabs ──────────────────────────────────────────────────────

const TABS = [
  { id: 'theory',     label: 'Teorie',        icon: '📚' },
  { id: 'series',     label: 'Řada',          icon: '⚛️' },
  { id: 'problems',   label: 'Příklady',      icon: '✏️' },
  { id: 'quiz',       label: 'Kvíz',          icon: '🎯' },
  { id: 'flashcards', label: 'Kartičky',      icon: '🃏' },
  { id: 'cheatsheet', label: 'Taháček',       icon: '📋' },
];

function Tabs({ tab, setTab }) {
  return (
    <div style={mainStyles.tabBar}>
      {TABS.map(t => (
        <button
          key={t.id}
          onClick={() => setTab(t.id)}
          style={{
            ...mainStyles.tab,
            ...(tab === t.id ? mainStyles.tabActive : {}),
          }}
        >
          <span style={{ marginRight: 6 }}>{t.icon}</span>{t.label}
        </button>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// THEORY TAB
// ═══════════════════════════════════════════════════════════════

const THEORY = [
  {
    title: 'Co je Beketovova řada?',
    icon: '🔬',
    body: [
      { sub: 'Definice', text: 'Beketovova řada (elektrochemická řada napětí kovů) je seřazení kovů podle jejich <b>redukčních schopností</b> — tedy podle ochoty odevzdávat elektrony a tvořit kationty. Vlevo stojí kovy nejreaktivnější, vpravo nejméně reaktivní.' },
      { sub: 'Hlavní pravidlo', text: 'Kov stojící v řadě <b>vlevo</b> vždy <b>vytěsní</b> (vyredukuje) kov stojící <b>vpravo</b> z jeho soli. Opačně to neplatí.', formula: 'Fe + CuSO₄ → Cu + FeSO₄    (Fe stojí vlevo od Cu)\nCu + FeSO₄ → neprobíhá       (Cu stojí vpravo od Fe)' },
      { sub: 'Co se mění zleva doprava', text: '<b>Klesá</b> redukční schopnost kovů (ochota oxidovat se).<br/><b>Roste</b> oxidační schopnost jejich iontů (ochota přijímat elektrony zpět).' },
    ]
  },
  {
    title: 'Neušlechtilé vs. ušlechtilé kovy',
    icon: '⚖️',
    body: [
      { sub: 'Vodík jako hranice', text: 'Předěl mezi neušlechtilými a ušlechtilými kovy tvoří <b>vodík (H)</b>. Vše vlevo od H = neušlechtilé, vše vpravo = ušlechtilé.' },
      { sub: 'Neušlechtilé kovy (vlevo od H)', text: 'K, Na, Ca, Mg, Al, Zn, Fe, Pb. Snadno se oxidují, ochotně tvoří kationty, reagují se zředěnými kyselinami za vzniku <b>vodíku H₂</b>.' },
      { sub: 'Ušlechtilé kovy (vpravo od H)', text: 'Cu, Ag, Hg, Au, Pt. Špatně se oxidují, neradi tvoří kationty. Se zředěnými kyselinami <b>nereagují</b>. Reagují pouze s oxidujícími kyselinami: koncentrovanou H₂SO₄ a HNO₃ (zředěnou i koncentrovanou).' },
    ]
  },
  {
    title: 'Reakce s vodou',
    icon: '💧',
    body: [
      { sub: 'Které kovy reagují s vodou?', text: 'Pouze nejreaktivnější kovy — <b>K, Na, Ca</b> (alkalické kovy a vápník). Reagují za studena a vzniká <b>vodík (H₂)</b> + hydroxid kovu.' },
      { sub: 'Obecné rovnice', text: 'Vznikají dvouatomové molekuly vodíku H₂.', formula: '2 Na + 2 H₂O → 2 NaOH + H₂↑\n2 K  + 2 H₂O → 2 KOH  + H₂↑\nCa  + 2 H₂O → Ca(OH)₂ + H₂↑' },
      { sub: 'Mg a další', text: 'Mg reaguje pouze s horkou vodní párou, Al je pasivován oxidovou vrstvou. Kovy od Zn dál již s běžnou vodou prakticky nereagují.' },
    ]
  },
  {
    title: 'Reakce s kyselinami',
    icon: '🧪',
    body: [
      { sub: 'Se zředěnými kyselinami (HCl, zř. H₂SO₄)', text: 'Reagují <b>všechny kovy vlevo od vodíku</b>. Vzniká <b>sůl + vodík H₂</b>.', formula: 'Mg + 2 HCl → MgCl₂ + H₂↑\nZn + 2 HCl → ZnCl₂ + H₂↑\nFe + 2 HCl → FeCl₂ + H₂↑\nCu + HCl → neprobíhá  (Cu je vpravo od H)' },
      { sub: 'Pořadí reaktivity (pokus z PL)', text: 'Mg &gt; Zn &gt; Fe &gt;&gt; Cu — hořčík reaguje nejbouřlivěji, měď s HCl vůbec nereaguje.' },
      { sub: 'S oxidujícími kyselinami', text: 'Koncentrovaná <b>H₂SO₄</b> a kyselina <b>HNO₃</b> reagují i s ušlechtilými kovy (Cu, Ag, Hg). Vodík se v tomto případě <b>NEUVOLŇUJE</b> — místo něj vzniká SO₂, NO, NO₂ apod.', formula: 'Cu + 4 HNO₃(konc.) → Cu(NO₃)₂ + 2 NO₂ + 2 H₂O' },
      { sub: 'Au a Pt', text: 'Zlato a platina nereagují ani s HNO₃ samostatně. Rozpouští je pouze <b>lučavka královská</b> (HNO₃ + 3 HCl).' },
    ]
  },
  {
    title: 'Reakce kovů se solemi (vytěsňování)',
    icon: '🔁',
    body: [
      { sub: 'Pravidlo vytěsnění', text: 'Kov <b>vlevo</b> v řadě vytěsní kov <b>vpravo</b> z roztoku jeho soli. Reakce <b>probíhá</b>. Opačná reakce <b>neprobíhá</b>.' },
      { sub: 'Příklady', text: '', formula: 'Fe + CuSO₄    → FeSO₄ + Cu        (Fe vlevo od Cu) ✓\nZn + Pb(NO₃)₂ → Zn(NO₃)₂ + Pb      ("Saturnův strom") ✓\nZn + 2 AgNO₃  → Zn(NO₃)₂ + 2 Ag    (Zn vlevo od Ag) ✓\nCu + ZnSO₄    → neprobíhá          (Cu vpravo od Zn) ✗' },
      { sub: 'Alchymistické "stromy"', text: 'Při těchto reakcích vznikají krystalické dendritické útvary připomínající stromy:<br/>• <b>Saturnův strom</b> — Pb (Saturn = olovo v alchymii)<br/>• <b>Jupiterův strom</b> — Sn (Jupiter = cín)<br/>• <b>Dianin strom</b> — Ag (Diana = stříbro)' },
    ]
  },
  {
    title: 'Oxidace a redukce v řadě',
    icon: '🔄',
    body: [
      { sub: 'Co se děje při vytěsnění', text: 'Reaktivnější kov (vlevo) <b>odevzdává elektrony</b> → <b>oxiduje se</b>. Iont méně reaktivního kovu (vpravo) <b>přijímá elektrony</b> → <b>redukuje se</b>.' },
      { sub: 'Příklad rozboru', text: 'Mg⁰ + 2 Ag⁺ → Mg²⁺ + 2 Ag⁰', formula: 'Mg⁰ → Mg²⁺ + 2 e⁻        (oxidace, Mg odevzdal 2 e⁻)\n2 Ag⁺ + 2 e⁻ → 2 Ag⁰      (redukce, Ag⁺ přijal e⁻)\n\nMg je redukční činidlo (sám se oxiduje, redukuje stříbro)\nAg⁺ je oxidační činidlo (sám se redukuje, oxiduje hořčík)' },
      { sub: 'Užitečná mnemotechnika', text: 'OIL RIG — <b>O</b>xidation <b>I</b>s <b>L</b>oss (of electrons), <b>R</b>eduction <b>I</b>s <b>G</b>ain.<br/>Zkráceně česky: <b>oxid</b>uje se ten, kdo ztrácí elektrony.' },
    ]
  },
];

function TheoryTab() {
  const [open, setOpen] = useState(0);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 880, margin: '0 auto' }}>
      {THEORY.map((section, i) => {
        const isOpen = open === i;
        return (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, overflow: 'hidden',
            transition: 'all 0.4s ease'
          }}>
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              style={{
                width: '100%', padding: '18px 22px', display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', background: 'transparent', border: 'none',
                cursor: 'pointer', color: '#fff', fontSize: 17, fontWeight: 600, textAlign: 'left',
                transition: 'all 0.4s ease'
              }}>
              <span><span style={{ marginRight: 10, fontSize: 22 }}>{section.icon}</span>{section.title}</span>
              <span style={{ fontSize: 18, color: ACCENT, transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.4s ease' }}>▼</span>
            </button>
            {isOpen && (
              <div style={{ padding: '0 22px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                {section.body.map((b, j) => (
                  <div key={j}>
                    <div style={{ color: ACCENT2, fontWeight: 600, fontSize: 14, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>{b.sub}</div>
                    <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, lineHeight: 1.6 }}
                      dangerouslySetInnerHTML={{ __html: b.text }} />
                    {b.formula && (
                      <pre style={{
                        marginTop: 10, padding: '12px 14px',
                        background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.25)',
                        borderRadius: 10, color: '#a5f3fc', fontSize: 14, fontFamily: 'JetBrains Mono, monospace',
                        whiteSpace: 'pre-wrap', overflow: 'auto'
                      }}>{b.formula}</pre>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SERIES EXPLORER — interaktivní řada
// ═══════════════════════════════════════════════════════════════

function SeriesExplorer() {
  const [selected, setSelected] = useState(null);
  const sel = selected !== null ? METAL_SERIES[selected] : null;

  return (
    <div style={{ maxWidth: 980, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{
        background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 22
      }}>
        <div style={{ color: '#fff', fontSize: 17, fontWeight: 600, marginBottom: 6 }}>Interaktivní řada kovů</div>
        <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, marginBottom: 18 }}>
          Klikni na kov pro detail. Barva = skupina podle reakce s vodou / kyselinou.
        </div>

        {/* Řada */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 18 }}>
          {METAL_SERIES.map((m, i) => {
            const isHydrogen = m.symbol === 'H';
            const isSelected = selected === i;
            let bg = 'rgba(139,92,246,0.15)';
            let border = '1px solid rgba(139,92,246,0.4)';
            if (m.group === 'water')    { bg = 'rgba(34,211,238,0.18)';  border = '1px solid #22d3ee'; }
            if (m.group === 'acid')     { bg = 'rgba(139,92,246,0.18)';  border = '1px solid #8b5cf6'; }
            if (m.group === 'hydrogen') { bg = 'rgba(74,222,128,0.22)';  border = '1px solid #4ade80'; }
            if (m.group === 'noble')    { bg = 'rgba(245,158,11,0.18)';  border = '1px solid #f59e0b'; }
            if (isSelected) { bg = '#fff'; border = '2px solid #fff'; }

            return (
              <button key={i} onClick={() => setSelected(isSelected ? null : i)} style={{
                minWidth: 58, padding: '10px 6px', borderRadius: 10,
                background: bg, border, cursor: 'pointer',
                color: isSelected ? '#0a0a1a' : '#fff', fontWeight: 700,
                transition: 'all 0.4s ease', textAlign: 'center',
                fontFamily: 'JetBrains Mono, monospace'
              }}>
                <div style={{ fontSize: 17 }}>{m.symbol}</div>
                <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>{m.ion}</div>
              </button>
            );
          })}
        </div>

        {/* Šipka */}
        <div style={{
          padding: '8px 14px', borderRadius: 10,
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          color: 'rgba(255,255,255,0.7)', fontSize: 13, textAlign: 'center'
        }}>
          ⇽ rostoucí oxidační schopnost iontů  |  klesající redukční schopnost kovů ⇾
        </div>

        {/* Legenda barev */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 14, fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
          <LegendDot color="#22d3ee" label="reagují s vodou (K, Na, Ca)" />
          <LegendDot color="#8b5cf6" label="reagují se zř. kyselinou + HCl" />
          <LegendDot color="#4ade80" label="vodík (hranice)" />
          <LegendDot color="#f59e0b" label="ušlechtilé (jen ox. kyseliny)" />
        </div>
      </div>

      {/* Detail */}
      {sel && (
        <div style={{
          background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)',
          border: `1px solid ${sel.group === 'noble' ? NOBLE_COLOR : ACCENT}`, borderRadius: 20, padding: 22
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 14 }}>
            <div style={{ fontSize: 44, fontWeight: 800, color: '#fff', fontFamily: 'JetBrains Mono, monospace' }}>{sel.symbol}</div>
            <div>
              <div style={{ color: '#fff', fontSize: 22, fontWeight: 600 }}>{sel.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>iont: <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{sel.ion}</span></div>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <span style={{
                padding: '5px 12px', borderRadius: 999, fontSize: 12,
                background: sel.noble ? 'rgba(245,158,11,0.2)' : (sel.symbol === 'H' ? 'rgba(74,222,128,0.2)' : 'rgba(139,92,246,0.2)'),
                color: sel.noble ? '#fbbf24' : (sel.symbol === 'H' ? '#86efac' : '#c4b5fd'),
                border: `1px solid ${sel.noble ? NOBLE_COLOR : (sel.symbol === 'H' ? '#4ade80' : ACCENT)}`
              }}>{sel.noble ? 'ušlechtilý' : (sel.symbol === 'H' ? 'hranice' : 'neušlechtilý')}</span>
            </div>
          </div>
          <MetalDetail metal={sel} index={selected} />
        </div>
      )}
    </div>
  );
}

function LegendDot({ color, label }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span style={{ width: 12, height: 12, borderRadius: 4, background: color, display: 'inline-block' }} />
      {label}
    </span>
  );
}

function MetalDetail({ metal, index }) {
  const facts = [];
  if (metal.symbol === 'H') {
    facts.push('Vodík je hranice mezi neušlechtilými a ušlechtilými kovy.');
    facts.push('Kovy vlevo od H reagují se zředěnými kyselinami za vzniku H₂.');
    facts.push('Kovy vpravo od H se zředěnými kyselinami nereagují.');
  } else {
    // Reakce s vodou
    if (metal.group === 'water') {
      facts.push(`Reaguje s vodou již za studena: ${metal.symbol === 'Ca' ? 'Ca + 2 H₂O → Ca(OH)₂ + H₂↑' : `2 ${metal.symbol} + 2 H₂O → 2 ${metal.symbol}OH + H₂↑`}`);
    } else {
      facts.push('S vodou za běžných podmínek nereaguje.');
    }
    // Reakce s kyselinou
    if (!metal.noble) {
      facts.push(`Se zředěnou HCl reaguje: ${metal.symbol} + HCl → sůl + H₂↑`);
    } else {
      facts.push('Se zředěnými kyselinami NEREAGUJE.');
      facts.push('Reaguje s koncentrovanou H₂SO₄ a s HNO₃ (vodík se neuvolňuje).');
    }
    // Vytěsní
    const rightOf = METAL_SERIES.slice(index + 1).filter(m => m.symbol !== 'H').map(m => m.symbol).join(', ');
    const leftOf = METAL_SERIES.slice(0, index).filter(m => m.symbol !== 'H').map(m => m.symbol).join(', ');
    if (rightOf) facts.push(`Vytěsní z roztoku solí: ${rightOf}`);
    if (leftOf) facts.push(`NEVYTĚSNÍ (kovy vlevo): ${leftOf}`);
  }
  return (
    <ul style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, lineHeight: 1.7, paddingLeft: 20, margin: 0 }}>
      {facts.map((f, i) => <li key={i} dangerouslySetInnerHTML={{ __html: f }} />)}
    </ul>
  );
}

// ═══════════════════════════════════════════════════════════════
// PROBLEMS TAB — pracovní list
// ═══════════════════════════════════════════════════════════════

const PROBLEMS = [
  {
    title: 'Příklad 1 — Seřaďte podle reaktivity',
    difficulty: 'Easy',
    icon: '✨',
    question: 'Seřaďte kovy podle schopnosti tvořit kationty, od nejreaktivnějšího k méně reaktivnímu:<br/><span style="font-family:JetBrains Mono,monospace;color:#a5f3fc;">Cu, Na, Zn, Hg, Mg, Ag, Fe</span>',
    solution: [
      { label: 'Postup', text: 'Najdeme každý kov v Beketovově řadě a uspořádáme je zleva doprava (od nejreaktivnějšího)<br/><br/>Pořadí v řadě: <b>K, Na</b>, Ca, <b>Mg</b>, Al, <b>Zn</b>, <b>Fe</b>, Pb, [H], <b>Cu</b>, <b>Ag</b>, <b>Hg</b>, Au, Pt' },
      { label: 'Výsledek', text: '<b>Na, Mg, Zn, Fe, Cu, Ag, Hg</b>', highlight: true }
    ]
  },
  {
    title: 'Příklad 2a — Doplňte: Pb + CuSO₄ →',
    difficulty: 'Easy',
    icon: '✨',
    question: 'Doplňte pravou stranu, vyčíslete, vyznačte oxidaci a redukci.<br/><span style="font-family:JetBrains Mono,monospace;color:#a5f3fc;">Pb + CuSO₄ → ?</span>',
    solution: [
      { label: 'Probíhá?', text: 'Pb stojí <b>vlevo</b> od Cu → reakce <b>probíhá</b>, Pb vytěsní Cu.' },
      { label: 'Rovnice', text: 'Pb⁰ + Cu²⁺SO₄²⁻ → Cu⁰ + Pb²⁺SO₄²⁻', formula: true },
      { label: 'Redox', text: '• Pb⁰ → Pb²⁺ + 2 e⁻ ... <b>oxidace</b> (olovo se oxiduje)<br/>• Cu²⁺ + 2 e⁻ → Cu⁰ ... <b>redukce</b> (měď se redukuje)', highlight: true }
    ]
  },
  {
    title: 'Příklad 2b — Fe + H₂SO₄ →',
    difficulty: 'Easy',
    icon: '✨',
    question: 'Doplňte, vyčíslete, vyznačte oxidaci a redukci.<br/><span style="font-family:JetBrains Mono,monospace;color:#a5f3fc;">Fe + H₂SO₄ → ?</span>',
    solution: [
      { label: 'Probíhá?', text: 'Fe stojí <b>vlevo</b> od H → reakce <b>probíhá</b> (se zředěnou H₂SO₄), vzniká H₂.' },
      { label: 'Rovnice', text: 'Fe⁰ + H₂⁺¹SO₄²⁻ → H₂⁰ + Fe²⁺SO₄²⁻', formula: true },
      { label: 'Redox', text: '• Fe⁰ → Fe²⁺ + 2 e⁻ ... <b>oxidace</b> (železo se oxiduje)<br/>• 2 H⁺ + 2 e⁻ → H₂⁰ ... <b>redukce</b> (vodík se redukuje)', highlight: true }
    ]
  },
  {
    title: 'Příklad 2c — Mg + AgNO₃ →',
    difficulty: 'Medium',
    icon: '⚡',
    question: 'Doplňte, vyčíslete, vyznačte oxidaci a redukci.<br/><span style="font-family:JetBrains Mono,monospace;color:#a5f3fc;">Mg + AgNO₃ → ?</span>',
    solution: [
      { label: 'Probíhá?', text: 'Mg stojí <b>vlevo</b> od Ag → reakce <b>probíhá</b>.' },
      { label: 'Vyčíslení', text: 'Mg odevzdává 2 e⁻, Ag⁺ přijímá 1 e⁻ → musíme stříbro vynásobit 2.', },
      { label: 'Rovnice', text: 'Mg⁰ + 2 Ag⁺NO₃⁻ → 2 Ag⁰ + Mg²⁺(NO₃⁻)₂', formula: true },
      { label: 'Redox', text: '• Mg⁰ → Mg²⁺ + 2 e⁻ ... <b>oxidace</b> (hořčík se oxiduje)<br/>• 2 Ag⁺ + 2 e⁻ → 2 Ag⁰ ... <b>redukce</b> (stříbro se redukuje)', highlight: true }
    ]
  },
  {
    title: 'Příklad 2d — K + H₂O →',
    difficulty: 'Medium',
    icon: '⚡',
    question: 'Doplňte, vyčíslete, vyznačte oxidaci a redukci.<br/><span style="font-family:JetBrains Mono,monospace;color:#a5f3fc;">K + H₂O → ?</span>',
    solution: [
      { label: 'Probíhá?', text: 'K je alkalický kov nalevo v řadě → reaguje s vodou, vzniká KOH + H₂.' },
      { label: 'Vyčíslení', text: 'K odevzdává 1 e⁻, voda potřebuje 2 e⁻ na H₂ → 2 K před H₂O.', },
      { label: 'Rovnice', text: '2 K⁰ + 2 H₂⁺¹O⁻² → H₂⁰ + 2 K⁺¹O⁻²H⁺¹', formula: true },
      { label: 'Redox', text: '• K⁰ → K⁺ + e⁻ ... <b>oxidace</b> (draslík se oxiduje)<br/>• 2 H⁺ + 2 e⁻ → H₂⁰ ... <b>redukce</b> (vodík se redukuje)', highlight: true }
    ]
  },
  {
    title: 'Příklad 2e — Cu + AgNO₃ →',
    difficulty: 'Medium',
    icon: '⚡',
    question: 'Doplňte, vyčíslete, vyznačte oxidaci a redukci.<br/><span style="font-family:JetBrains Mono,monospace;color:#a5f3fc;">Cu + AgNO₃ → ?</span>',
    solution: [
      { label: 'Probíhá?', text: 'Cu stojí <b>vlevo</b> od Ag → reakce <b>probíhá</b> (oba ušlechtilé, ale Cu je reaktivnější).' },
      { label: 'Vyčíslení', text: 'Cu odevzdává 2 e⁻, Ag⁺ přijímá 1 e⁻ → 2× stříbro.' },
      { label: 'Rovnice', text: 'Cu⁰ + 2 Ag⁺NO₃⁻ → 2 Ag⁰ + Cu²⁺(NO₃⁻)₂', formula: true },
      { label: 'Redox', text: '• Cu⁰ → Cu²⁺ + 2 e⁻ ... <b>oxidace</b> (měď se oxiduje)<br/>• 2 Ag⁺ + 2 e⁻ → 2 Ag⁰ ... <b>redukce</b> (stříbro se redukuje)', highlight: true }
    ]
  },
  {
    title: 'Příklad 2f — Hg + AuCl₃ →',
    difficulty: 'Hard',
    icon: '🔥',
    question: 'Doplňte, vyčíslete, vyznačte oxidaci a redukci.<br/><span style="font-family:JetBrains Mono,monospace;color:#a5f3fc;">Hg + AuCl₃ → ?</span>',
    solution: [
      { label: 'Probíhá?', text: 'Hg stojí <b>vlevo</b> od Au → reakce <b>probíhá</b>.' },
      { label: 'Vyčíslení', text: 'Hg odevzdává 2 e⁻ (Hg²⁺), Au³⁺ přijímá 3 e⁻. Nejmenší společný násobek: 6.<br/>→ 3 Hg odevzdá 6 e⁻, 2 Au³⁺ přijme 6 e⁻.' },
      { label: 'Rovnice', text: '3 Hg⁰ + 2 Au³⁺Cl₃⁻¹ → 2 Au⁰ + 3 Hg²⁺Cl₂⁻¹', formula: true },
      { label: 'Redox', text: '• 3 Hg⁰ → 3 Hg²⁺ + 6 e⁻ ... <b>oxidace</b> (rtuť se oxiduje)<br/>• 2 Au³⁺ + 6 e⁻ → 2 Au⁰ ... <b>redukce</b> (zlato se redukuje)', highlight: true }
    ]
  },
  {
    title: 'Příklad 3a — Cu + ZnSO₄ →',
    difficulty: 'Easy',
    icon: '✨',
    question: 'Rozhodněte, zda reakce probíhá. Pokud ano, doplňte a vyčíslete.<br/><span style="font-family:JetBrains Mono,monospace;color:#a5f3fc;">Cu + ZnSO₄ → ?</span>',
    solution: [
      { label: 'Rozhodnutí', text: '<b>NEPROBÍHÁ</b>' },
      { label: 'Vysvětlení', text: 'Cu stojí v řadě <b>vpravo</b> od Zn. Měně reaktivní kov (Cu) nemůže vytěsnit reaktivnější (Zn) z jeho soli.', highlight: true }
    ]
  },
  {
    title: 'Příklad 3b — Pb + AlCl₃ →',
    difficulty: 'Easy',
    icon: '✨',
    question: 'Rozhodněte, zda reakce probíhá.<br/><span style="font-family:JetBrains Mono,monospace;color:#a5f3fc;">Pb + AlCl₃ → ?</span>',
    solution: [
      { label: 'Rozhodnutí', text: '<b>NEPROBÍHÁ</b>' },
      { label: 'Vysvětlení', text: 'Pb stojí v řadě <b>vpravo</b> od Al. Olovo nevytěsní hliník.', highlight: true }
    ]
  },
  {
    title: 'Příklad 3c — Hg + H₂SO₄ (zř.) →',
    difficulty: 'Medium',
    icon: '⚡',
    question: 'Rozhodněte, zda reakce probíhá.<br/><span style="font-family:JetBrains Mono,monospace;color:#a5f3fc;">Hg + H₂SO₄ (zř.) → ?</span>',
    solution: [
      { label: 'Rozhodnutí', text: '<b>NEPROBÍHÁ</b>' },
      { label: 'Vysvětlení', text: 'Hg stojí v řadě <b>vpravo</b> od H. Rtuť (ušlechtilý kov) nevytěsní vodík ze zředěné kyseliny. Reagovala by pouze s <b>koncentrovanou</b> H₂SO₄ nebo s HNO₃.', highlight: true }
    ]
  },
  {
    title: 'Příklad 3d — Zn + AgNO₃ →',
    difficulty: 'Medium',
    icon: '⚡',
    question: 'Rozhodněte, zda reakce probíhá. Pokud ano, doplňte a vyčíslete.<br/><span style="font-family:JetBrains Mono,monospace;color:#a5f3fc;">Zn + AgNO₃ → ?</span>',
    solution: [
      { label: 'Rozhodnutí', text: '<b>PROBÍHÁ</b> — Zn stojí <b>vlevo</b> od Ag.' },
      { label: 'Vyčíslení', text: 'Zn odevzdává 2 e⁻, Ag⁺ přijímá 1 e⁻ → 2× stříbro.' },
      { label: 'Rovnice', text: 'Zn + 2 AgNO₃ → 2 Ag + Zn(NO₃)₂', formula: true, highlight: true }
    ]
  },
  {
    title: 'Příklad 4a — Mg do 10% HCl',
    difficulty: 'Easy',
    icon: '✨',
    question: 'Do 10% kyseliny chlorovodíkové vložíme kousek hořčíku. Bude reakce probíhat?',
    solution: [
      { label: 'Odpověď', text: '<b>ANO</b>' },
      { label: 'Vysvětlení', text: 'Mg stojí v řadě <b>vlevo</b> od H, je to neušlechtilý kov, který reaguje se zředěnými kyselinami za vzniku H₂.' },
      { label: 'Rovnice', text: 'Mg + 2 HCl → MgCl₂ + H₂↑', formula: true, highlight: true }
    ]
  },
  {
    title: 'Příklad 4b — Železný hřebík do Pb(NO₃)₂',
    difficulty: 'Medium',
    icon: '⚡',
    question: 'Do 5% roztoku dusičnanu olovnatého vložíme železný hřebík. Bude reakce probíhat?',
    solution: [
      { label: 'Odpověď', text: '<b>ANO</b>' },
      { label: 'Vysvětlení', text: 'Fe stojí v řadě <b>vlevo</b> od Pb → Fe vytěsní Pb z roztoku.' },
      { label: 'Rovnice', text: 'Fe + Pb(NO₃)₂ → Fe(NO₃)₂ + Pb↓', formula: true, highlight: true }
    ]
  },
  {
    title: 'Příklad 4c — Měděný drát do MgSO₄',
    difficulty: 'Easy',
    icon: '✨',
    question: 'Do 10% roztoku síranu hořečnatého ponoříme měděný drát. Bude reakce probíhat?',
    solution: [
      { label: 'Odpověď', text: '<b>NE</b>' },
      { label: 'Vysvětlení', text: 'Cu stojí v řadě <b>vpravo</b> od Mg → měď nemůže vytěsnit hořčík. Mg je mnohem reaktivnější.', highlight: true }
    ]
  },
];

function ProblemsTab() {
  const [open, setOpen] = useState({});
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 880, margin: '0 auto' }}>
      <div style={{
        background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.25)',
        borderRadius: 14, padding: '12px 16px', color: 'rgba(255,255,255,0.75)', fontSize: 13
      }}>
        💡 Řešené příklady z pracovního listu paní profesorky. Klikni na příklad pro zobrazení řešení.
      </div>

      {PROBLEMS.map((p, i) => {
        const isOpen = !!open[i];
        const diffColor = p.difficulty === 'Easy' ? '#4ade80' : p.difficulty === 'Medium' ? '#fbbf24' : '#f87171';
        return (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, overflow: 'hidden',
            transition: 'all 0.4s ease'
          }}>
            <button
              onClick={() => setOpen(prev => ({ ...prev, [i]: !prev[i] }))}
              style={{
                width: '100%', padding: '14px 20px', display: 'flex', alignItems: 'center',
                gap: 12, background: 'transparent', border: 'none', cursor: 'pointer',
                color: '#fff', textAlign: 'left', transition: 'all 0.4s ease'
              }}>
              <span style={{
                padding: '3px 10px', borderRadius: 999, fontSize: 11,
                background: `${diffColor}22`, color: diffColor,
                border: `1px solid ${diffColor}55`, fontWeight: 600
              }}>{p.icon} {p.difficulty}</span>
              <span style={{ flex: 1, fontWeight: 600, fontSize: 15 }}>{p.title}</span>
              <span style={{ color: ACCENT, transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.4s ease' }}>▼</span>
            </button>

            <div style={{ padding: '0 20px 4px', color: 'rgba(255,255,255,0.85)', fontSize: 15, lineHeight: 1.6 }}
              dangerouslySetInnerHTML={{ __html: p.question }} />

            {isOpen && (
              <div style={{ padding: '14px 20px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {p.solution.map((s, j) => (
                  <div key={j} style={{
                    padding: 14, borderRadius: 12,
                    background: s.highlight ? 'rgba(34,197,94,0.08)' : 'rgba(6,182,212,0.06)',
                    border: `1px solid ${s.highlight ? 'rgba(34,197,94,0.3)' : 'rgba(6,182,212,0.2)'}`
                  }}>
                    <div style={{ color: s.highlight ? '#86efac' : '#67e8f9', fontWeight: 600, fontSize: 12, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.label}</div>
                    <div style={{
                      color: 'rgba(255,255,255,0.9)', fontSize: 14, lineHeight: 1.7,
                      fontFamily: s.formula ? 'JetBrains Mono, monospace' : 'inherit'
                    }} dangerouslySetInnerHTML={{ __html: s.text }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// QUIZ TAB
// ═══════════════════════════════════════════════════════════════

const QUIZ_QUESTIONS = [
  {
    question: 'Která dvojice kovů patří mezi <b>neušlechtilé</b>?',
    type: 'single',
    options: ['Cu a Ag', 'Zn a Fe', 'Hg a Au', 'Pt a Cu'],
    correct: [1],
    explanation: 'Neušlechtilé kovy stojí v řadě <b>vlevo od vodíku</b>. Z nabízených dvojic jsou neušlechtilé jen Zn a Fe.',
    tip: 'Hranicí je vodík: vlevo neušlechtilé, vpravo ušlechtilé.'
  },
  {
    question: 'Proběhne reakce <span style="font-family:JetBrains Mono,monospace">Cu + ZnSO₄ →</span>?',
    type: 'single',
    options: ['Ano, vznikne CuSO₄ a Zn', 'Ne, Cu stojí vpravo od Zn', 'Ano, ale jen při zahřátí', 'Ano, vznikne CuZn slitina'],
    correct: [1],
    explanation: 'Cu je v řadě vpravo od Zn, takže <b>méně reaktivní kov nemůže vytěsnit reaktivnější</b> ze soli. Reakce neprobíhá.',
    tip: 'Pravidlo: pouze kov VLEVO vytěsní kov VPRAVO.'
  },
  {
    question: 'Které z následujících kovů reagují <b>se zředěnou HCl</b> za vzniku H₂?',
    type: 'multi',
    options: ['Mg', 'Cu', 'Zn', 'Fe', 'Ag', 'Hg'],
    correct: [0, 2, 3],
    explanation: 'Se zředěnou HCl reagují všechny kovy <b>vlevo od vodíku</b>. Z nabídky: Mg, Zn, Fe. Cu, Ag a Hg jsou ušlechtilé a nereagují.',
    tip: 'Vzpomeň si na pokus z pracovního listu: Mg > Zn > Fe >> Cu.'
  },
  {
    question: 'Které kovy reagují <b>již s vodou za studena</b>?',
    type: 'multi',
    options: ['K', 'Mg', 'Na', 'Fe', 'Ca', 'Cu'],
    correct: [0, 2, 4],
    explanation: 'S vodou již za studena reagují <b>K, Na, Ca</b> (alkalické kovy + vápník). Vznikají hydroxidy a vodík H₂.',
    tip: 'Mg reaguje až s horkou parou, ne s vodou za studena.'
  },
  {
    question: 'Co se děje při reakci <span style="font-family:JetBrains Mono,monospace">Mg + 2 AgNO₃ → 2 Ag + Mg(NO₃)₂</span>?',
    type: 'single',
    options: [
      'Mg se redukuje, Ag⁺ se oxiduje',
      'Mg se oxiduje, Ag⁺ se redukuje',
      'Mg i Ag⁺ se oxidují',
      'Reakce neprobíhá'
    ],
    correct: [1],
    explanation: 'Mg⁰ → Mg²⁺ + 2 e⁻ (ztráta elektronů = <b>oxidace</b>). Ag⁺ + e⁻ → Ag⁰ (zisk elektronů = <b>redukce</b>).',
    tip: 'OIL RIG: Oxidation Is Loss, Reduction Is Gain (of electrons).'
  },
  {
    question: 'Vyber správně vyčíslenou rovnici reakce hliníku s kyselinou chlorovodíkovou.',
    type: 'single',
    options: [
      'Al + 3 HCl → AlCl₃ + H₂',
      '2 Al + 6 HCl → 2 AlCl₃ + 3 H₂',
      'Al + HCl → AlCl + H',
      '2 Al + 3 HCl → Al₂Cl₃ + 3 H'
    ],
    correct: [1],
    explanation: 'Al má oxidační číslo +III, odevzdává 3 e⁻; H⁺ přijímá 1 e⁻. Pro vyrovnání elektronů: 2 Al (6 e⁻ celkem) ↔ 6 H⁺ → 3 H₂.',
    tip: 'Vždy si zkontroluj počty atomů na obou stranách rovnice.'
  },
  {
    question: 'Šipka v Beketovově řadě (zleva doprava) značí směr:',
    type: 'single',
    options: [
      'rostoucích redukčních schopností kovů',
      'klesajících redukčních schopností kovů (rostoucích oxidačních schopností iontů)',
      'klesající hustoty kovů',
      'rostoucích atomových hmotností'
    ],
    correct: [1],
    explanation: 'Zleva doprava <b>klesá redukční schopnost</b> kovů (méně ochotně odevzdávají elektrony) a <b>roste oxidační schopnost</b> jejich kationtů.',
    tip: 'Vlevo = nejvíc reaktivní kov, vpravo = nejvíc reaktivní iont.'
  },
  {
    question: 'Železný hřebík vložíme do roztoku Pb(NO₃)₂. Co se stane?',
    type: 'single',
    options: [
      'Nic, reakce neprobíhá',
      'Hřebík se rozpustí, vznikne Fe(NO₃)₂ a vyloučí se Pb',
      'Vznikne Fe₂(NO₃)₃ a olovnatá rtuť',
      'Vznikne FePb slitina'
    ],
    correct: [1],
    explanation: 'Fe stojí <b>vlevo</b> od Pb v řadě → železo vytěsní olovo z roztoku.<br/>Fe + Pb(NO₃)₂ → Fe(NO₃)₂ + Pb↓',
    tip: 'Fe stojí vlevo od Pb (vedle sebe, ale Fe je reaktivnější).'
  },
  {
    question: 'Měděný drát ponoříme do roztoku síranu hořečnatého (MgSO₄). Proběhne reakce?',
    type: 'single',
    options: [
      'Ano, vznikne CuSO₄ a Mg',
      'Ano, ale jen po zahřátí',
      'Ne, protože Cu stojí vpravo od Mg',
      'Ne, MgSO₄ je nerozpustný'
    ],
    correct: [2],
    explanation: 'Cu je <b>vpravo</b> od Mg (Cu je ušlechtilá, Mg neušlechtilý). Měně reaktivní Cu nemůže vytěsnit reaktivnější Mg. Reakce neprobíhá.',
  },
  {
    question: 'Které kovy reagují <b>s koncentrovanou HNO₃</b>, ale NE se zředěnou HCl?',
    type: 'multi',
    options: ['Cu', 'Mg', 'Ag', 'Zn', 'Hg', 'Fe'],
    correct: [0, 2, 4],
    explanation: 'Ušlechtilé kovy (Cu, Ag, Hg) se zředěnou HCl nereagují, ale reagují s oxidujícími kyselinami — koncentrovanou H₂SO₄ a HNO₃.',
    tip: 'Au a Pt nereagují ani s HNO₃ samostatně — pouze s lučavkou královskou.'
  },
  {
    question: 'Reakce <span style="font-family:JetBrains Mono,monospace">3 Hg + 2 AuCl₃ → 2 Au + 3 HgCl₂</span>. Kdo je <b>redukční činidlo</b>?',
    type: 'single',
    options: ['Au³⁺', 'Cl⁻', 'Hg⁰', 'HgCl₂'],
    correct: [2],
    explanation: 'Hg⁰ odevzdává elektrony (oxiduje se), čímž <b>redukuje</b> Au³⁺ → Au⁰. Redukční činidlo je tedy <b>Hg</b>.',
    tip: 'Redukční činidlo = to, co druhého redukuje (samo se přitom oxiduje).'
  },
  {
    question: 'Jakému kovu odpovídá v alchymii <b>Saturn</b> (Saturnův strom při reakci se Zn)?',
    type: 'single',
    options: ['Stříbro (Ag)', 'Olovo (Pb)', 'Cín (Sn)', 'Rtuť (Hg)'],
    correct: [1],
    explanation: 'V alchymii Saturn = <b>olovo</b>. Saturnův strom vzniká reakcí Zn + Pb(NO₃)₂ → Zn(NO₃)₂ + Pb (krystalky Pb tvoří strom).',
    tip: 'Jupiter = cín (Sn), Saturn = olovo (Pb), Mars = železo (Fe), Diana = stříbro (Ag).'
  },
  {
    question: 'Vyber všechny <b>správné</b> výroky o Beketovově řadě:',
    type: 'multi',
    options: [
      'Kov vlevo vytěsní kov vpravo z roztoku jeho soli.',
      'Vodík tvoří hranici mezi ušlechtilými a neušlechtilými kovy.',
      'Zlato (Au) je nejreaktivnější kov v řadě.',
      'S vodou za studena reagují K, Na, Ca.',
      'Měď reaguje se zředěnou HCl za vzniku vodíku.'
    ],
    correct: [0, 1, 3],
    explanation: 'První tři správné výroky odpovídají pravidlům řady. Au je naopak <b>nejméně</b> reaktivní (krajně vpravo). Cu je ušlechtilá, s HCl nereaguje.',
  },
  {
    question: 'Kolik elektronů celkem si vymění hořčík a stříbrné kationty v rovnici <span style="font-family:JetBrains Mono,monospace">Mg + 2 AgNO₃ → Mg(NO₃)₂ + 2 Ag</span>?',
    type: 'single',
    options: ['1 e⁻', '2 e⁻', '3 e⁻', '6 e⁻'],
    correct: [1],
    explanation: 'Mg⁰ → Mg²⁺ odevzdá <b>2 e⁻</b>. Dva ionty Ag⁺ je přijmou (každý 1 e⁻). Celkem se vymění 2 elektrony.',
    tip: 'Počet vyměněných elektronů = oxidační číslo × počet atomů.'
  },
  {
    question: 'Která reakce <b>neprobíhá</b>?',
    type: 'single',
    options: [
      'Zn + CuSO₄ →',
      'Fe + 2 HCl →',
      'Cu + 2 AgNO₃ →',
      'Ag + ZnSO₄ →'
    ],
    correct: [3],
    explanation: 'Ag stojí v řadě <b>vpravo</b> od Zn, takže nemůže vytěsnit zinek z jeho síranu. Reakce neprobíhá.',
    tip: 'Stačí najít kovy v řadě a porovnat jejich polohu.'
  },
];

function QuizTab() {
  return <QuizEngine questions={QUIZ_QUESTIONS} accentColor={ACCENT} />;
}

// ═══════════════════════════════════════════════════════════════
// FLASHCARDS TAB
// ═══════════════════════════════════════════════════════════════

const FLASHCARDS = [
  { front: 'Pořadí kovů v Beketovově řadě (zleva)', back: 'K, Na, Ca, Mg, Al, Zn, Fe, Pb, [H], Cu, Ag, Hg, Au, Pt' },
  { front: 'Mnemotechnika pro pořadí', back: '"Kdo Najde Cíl, Má Auto, Že Fest Pojede, [Hned] Cestou Ale Honem Auto Prodá"\n(K, Na, Ca, Mg, Al, Zn, Fe, Pb, H, Cu, Ag, Hg, Au, Pt)' },
  { front: 'Co znamená "neušlechtilý" kov?', back: 'Kov stojící v Beketovově řadě VLEVO od vodíku.\nReaguje se zředěnými kyselinami za vzniku H₂.\nSnadno se oxiduje, ochotně tvoří kationty.' },
  { front: 'Co znamená "ušlechtilý" kov?', back: 'Kov stojící VPRAVO od vodíku (Cu, Ag, Hg, Au, Pt).\nNereaguje se zředěnými kyselinami.\nReaguje pouze s oxidujícími kyselinami (konc. H₂SO₄, HNO₃) — bez vzniku H₂.' },
  { front: 'Které kovy reagují s vodou za studena?', back: 'K, Na, Ca (alkalické kovy + vápník).\nNapř.: 2 Na + 2 H₂O → 2 NaOH + H₂↑\nVznikají dvouatomové molekuly H₂.' },
  { front: 'Hlavní pravidlo Beketovovy řady', back: 'Kov VLEVO v řadě VYTĚSNÍ (vyredukuje) kov VPRAVO z roztoku jeho soli.\nOpačná reakce NEPROBÍHÁ.' },
  { front: 'Co probíhá při vytěsnění?', back: 'Reaktivnější kov (vlevo) se OXIDUJE — odevzdá elektrony.\nIont méně reaktivního kovu (vpravo) se REDUKUJE — přijme elektrony.' },
  { front: 'Reakce Fe + CuSO₄ →', back: 'Fe + CuSO₄ → FeSO₄ + Cu\n(Probíhá, protože Fe stojí vlevo od Cu.)\nFe se oxiduje, Cu²⁺ se redukuje.' },
  { front: 'Reakce Cu + FeSO₄ →', back: 'NEPROBÍHÁ.\nCu stojí vpravo od Fe, takže Cu (méně reaktivní) nemůže vytěsnit Fe.' },
  { front: 'Cu + HCl (zř.) →', back: 'NEPROBÍHÁ.\nMěď je ušlechtilý kov (vpravo od H), s zředěnou HCl nereaguje.\nReagovala by ale s konc. H₂SO₄ nebo s HNO₃.' },
  { front: 'Au a Pt — s čím reagují?', back: 'Zlato a platina NEREAGUJÍ s běžnými kyselinami ani s HNO₃ samostatně.\nRozpouští je pouze LUČAVKA KRÁLOVSKÁ (HNO₃ + 3 HCl).' },
  { front: 'Pořadí reaktivity z pokusu s HCl', back: 'Mg > Zn > Fe >> Cu\nHořčík reaguje nejbouřlivěji, měď s HCl vůbec nereaguje.' },
  { front: 'Saturnův strom — co a jak?', back: 'Reakce: Zn + Pb(NO₃)₂ → Zn(NO₃)₂ + Pb\nVznikají dendritické krystalky olova — strom.\n(V alchymii Saturn = olovo Pb.)' },
  { front: 'Jupiterův strom', back: 'Reakce: Zn + SnCl₂ → ZnCl₂ + Sn (v ethanolu)\nVznikají krystalky cínu — Jupiterův strom.\n(Jupiter = cín Sn.)' },
  { front: 'OIL RIG (mnemotechnika)', back: 'Oxidation Is Loss (of electrons)\nReduction Is Gain (of electrons)\n\nOxidace = ztráta e⁻\nRedukce = zisk e⁻' },
  { front: 'Co je redukční činidlo?', back: 'Látka, která DRUHÉHO redukuje, a sama se přitom OXIDUJE (odevzdává elektrony).\nV Beketovově řadě = kov VLEVO.' },
  { front: 'Co je oxidační činidlo?', back: 'Látka, která DRUHÉHO oxiduje, a sama se přitom REDUKUJE (přijímá elektrony).\nV Beketovově řadě = iont kovu VPRAVO.' },
  { front: 'Jaké šipky platí v řadě?', back: '⇽ rostoucí oxidační schopnost IONTŮ\n⇾ klesající redukční schopnost KOVŮ\n(Vlevo = nejreaktivnější kov, vpravo = nejreaktivnější iont.)' },
];

function FlashcardsTab() {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const next = () => { setFlipped(false); setIdx(i => (i + 1) % FLASHCARDS.length); };
  const prev = () => { setFlipped(false); setIdx(i => (i - 1 + FLASHCARDS.length) % FLASHCARDS.length); };

  const card = FLASHCARDS[idx];

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ color: 'rgba(255,255,255,0.55)', textAlign: 'center', fontSize: 14 }}>
        Karta {idx + 1} z {FLASHCARDS.length} — klikni pro otočení
      </div>

      <div onClick={() => setFlipped(f => !f)} style={{
        perspective: '1000px', cursor: 'pointer', minHeight: 280
      }}>
        <div style={{
          position: 'relative', width: '100%', minHeight: 280,
          transformStyle: 'preserve-3d', transition: 'transform 0.4s ease',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)'
        }}>
          {/* Front */}
          <div style={{
            position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
            background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.15)', borderRadius: 24,
            padding: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
            textAlign: 'center', color: '#fff', fontSize: 22, fontWeight: 600, lineHeight: 1.5
          }}>
            <div>
              <div style={{ fontSize: 13, color: ACCENT, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>Otázka</div>
              <div dangerouslySetInnerHTML={{ __html: card.front }} />
            </div>
          </div>
          {/* Back */}
          <div style={{
            position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'rgba(139,92,246,0.12)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(139,92,246,0.4)', borderRadius: 24,
            padding: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
            textAlign: 'center', color: '#fff', fontSize: 17, lineHeight: 1.6, fontFamily: 'inherit'
          }}>
            <div>
              <div style={{ fontSize: 13, color: '#67e8f9', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>Odpověď</div>
              <div style={{ whiteSpace: 'pre-wrap', fontFamily: card.back.includes('→') || card.back.includes('H₂') ? 'JetBrains Mono, monospace' : 'inherit' }}>{card.back}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
        <button onClick={prev} style={navBtnStyle}>← Předchozí</button>
        <button onClick={() => setFlipped(f => !f)} style={{ ...navBtnStyle, background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.5)' }}>Otočit</button>
        <button onClick={next} style={navBtnStyle}>Další →</button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginTop: 6 }}>
        {FLASHCARDS.map((_, i) => (
          <div key={i} onClick={() => { setFlipped(false); setIdx(i); }} style={{
            width: 14, height: 14, borderRadius: '50%', cursor: 'pointer',
            background: i === idx ? ACCENT : 'rgba(255,255,255,0.15)',
            transition: 'all 0.4s ease'
          }} />
        ))}
      </div>
    </div>
  );
}

const navBtnStyle = {
  flex: 1, padding: '10px 18px', background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, color: '#fff',
  cursor: 'pointer', fontSize: 14, transition: 'all 0.4s ease'
};

// ═══════════════════════════════════════════════════════════════
// CHEAT SHEET
// ═══════════════════════════════════════════════════════════════

function CheatSheet() {
  return (
    <div style={{ maxWidth: 920, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Velká řada */}
      <CheatCard title="📜 Beketovova řada — pořadí" color={ACCENT}>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 16, color: '#fff',
          padding: '14px 16px', background: 'rgba(0,0,0,0.3)', borderRadius: 10,
          textAlign: 'center', letterSpacing: 1.5, lineHeight: 1.8
        }}>
          <div style={{ color: '#22d3ee', marginBottom: 4, fontSize: 12 }}>neušlechtilé →</div>
          K  Na  Ca  Mg  Al  Zn  Fe  Pb  <span style={{ color: '#4ade80', fontWeight: 700 }}>|H|</span>  <span style={{ color: '#f59e0b' }}>Cu  Ag  Hg  Au  Pt</span>
          <div style={{ color: '#f59e0b', marginTop: 4, fontSize: 12 }}>← ušlechtilé</div>
        </div>
      </CheatCard>

      {/* Pravidla */}
      <CheatCard title="🔑 Klíčová pravidla" color={ACCENT}>
        <ul style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, lineHeight: 1.8, paddingLeft: 22, margin: 0 }}>
          <li>Kov <b>vlevo</b> vytěsní kov <b>vpravo</b> z roztoku jeho soli.</li>
          <li><b>Vodík</b> tvoří hranici mezi neušlechtilými a ušlechtilými kovy.</li>
          <li>Zleva doprava: <b>klesá</b> redukční schopnost kovů, <b>roste</b> oxidační schopnost iontů.</li>
          <li>Kov vytěsňuje → kov se <b>oxiduje</b> (ztrácí e⁻), iont se <b>redukuje</b> (přijímá e⁻).</li>
          <li>Katalyzátorem nelze obrátit směr (méně reaktivní kov nikdy nevytěsní reaktivnější).</li>
        </ul>
      </CheatCard>

      {/* Reakce s vodou */}
      <CheatCard title="💧 Reakce s vodou (za studena)" color="#22d3ee">
        <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, marginBottom: 8 }}>Reagují pouze: <b>K, Na, Ca</b></div>
        <pre style={preStyle}>{`2 Na + 2 H₂O → 2 NaOH + H₂↑
2 K  + 2 H₂O → 2 KOH  + H₂↑
Ca   + 2 H₂O → Ca(OH)₂ + H₂↑`}</pre>
      </CheatCard>

      {/* Reakce s kyselinou */}
      <CheatCard title="🧪 Reakce se zředěnými kyselinami" color={ACCENT}>
        <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, marginBottom: 8 }}>
          Reagují všechny kovy <b>vlevo od H</b>. Produkt: <b>sůl + H₂↑</b>
        </div>
        <pre style={preStyle}>{`Mg + 2 HCl → MgCl₂ + H₂↑
Zn + 2 HCl → ZnCl₂ + H₂↑
Fe + 2 HCl → FeCl₂ + H₂↑
2 Al + 6 HCl → 2 AlCl₃ + 3 H₂↑
Cu + HCl → NEPROBÍHÁ`}</pre>
      </CheatCard>

      {/* Ušlechtilé kovy */}
      <CheatCard title="🥇 Ušlechtilé kovy (Cu, Ag, Hg, Au, Pt)" color={NOBLE_COLOR}>
        <ul style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, lineHeight: 1.8, paddingLeft: 22, margin: 0 }}>
          <li>Se zředěnými kyselinami <b>NEREAGUJÍ</b>.</li>
          <li>Reagují s <b>koncentrovanou H₂SO₄</b> a s <b>HNO₃</b> (vodík se neuvolňuje, místo něj SO₂, NO, NO₂).</li>
          <li>Au a Pt rozpouští pouze <b>lučavka královská</b> (HNO₃ + 3 HCl).</li>
        </ul>
        <pre style={{ ...preStyle, marginTop: 10 }}>{`Cu + 4 HNO₃(konc.) → Cu(NO₃)₂ + 2 NO₂ + 2 H₂O
Ag + 2 HNO₃(konc.) → AgNO₃ + NO₂ + H₂O`}</pre>
      </CheatCard>

      {/* Vytěsnění */}
      <CheatCard title="🔁 Vytěsnění z roztoků solí" color={ACCENT}>
        <pre style={preStyle}>{`Fe + CuSO₄    → FeSO₄ + Cu          ✓ (Fe vlevo od Cu)
Zn + Pb(NO₃)₂ → Zn(NO₃)₂ + Pb       ✓ Saturnův strom
Zn + 2 AgNO₃  → Zn(NO₃)₂ + 2 Ag     ✓ (Zn vlevo od Ag)
Cu + ZnSO₄    → NEPROBÍHÁ           ✗ (Cu vpravo od Zn)
Pb + AlCl₃    → NEPROBÍHÁ           ✗ (Pb vpravo od Al)`}</pre>
      </CheatCard>

      {/* Oxidace/redukce */}
      <CheatCard title="🔄 Oxidace a redukce (rozbor)" color="#06b6d4">
        <div style={{ color: '#fff', fontSize: 14, marginBottom: 8 }}>Příklad: <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>Mg + 2 AgNO₃ → 2 Ag + Mg(NO₃)₂</span></div>
        <pre style={preStyle}>{`Mg⁰  → Mg²⁺ + 2 e⁻       (OXIDACE — ztráta e⁻)
2 Ag⁺ + 2 e⁻ → 2 Ag⁰     (REDUKCE — zisk e⁻)

Mg = redukční činidlo (samo se oxiduje)
Ag⁺ = oxidační činidlo (sám se redukuje)`}</pre>
        <div style={{ marginTop: 10, padding: '10px 12px', background: 'rgba(251,191,36,0.1)', borderRadius: 8, color: '#fde68a', fontSize: 13 }}>
          💡 OIL RIG: <b>O</b>xidation <b>I</b>s <b>L</b>oss, <b>R</b>eduction <b>I</b>s <b>G</b>ain (of electrons)
        </div>
      </CheatCard>

      {/* Alchymie */}
      <CheatCard title="🧙 Alchymistické stromy" color={NOBLE_COLOR}>
        <ul style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, lineHeight: 1.8, paddingLeft: 22, margin: 0 }}>
          <li><b>Saturnův strom</b> — olovo (Pb): <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>Zn + Pb(NO₃)₂</span></li>
          <li><b>Jupiterův strom</b> — cín (Sn): <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>Zn + SnCl₂</span></li>
          <li><b>Dianin strom</b> — stříbro (Ag): <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>Cu + AgNO₃</span></li>
          <li><b>Mars</b> = železo (Fe), <b>Venuše</b> = měď (Cu), <b>Slunce</b> = zlato (Au), <b>Měsíc</b> = stříbro (Ag)</li>
        </ul>
      </CheatCard>

      {/* Co určitě umět */}
      <CheatCard title="⭐ Co určitě umět na test" color="#4ade80">
        <ol style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, lineHeight: 1.8, paddingLeft: 22, margin: 0 }}>
          <li>Vyjmenovat celou řadu zpaměti (K, Na, Ca, Mg, Al, Zn, Fe, Pb, H, Cu, Ag, Hg, Au, Pt).</li>
          <li>Vědět, kde stojí <b>vodík</b> a co to znamená.</li>
          <li>Rozhodnout u libovolné reakce kovu se solí, zda <b>probíhá / neprobíhá</b>, a zdůvodnit.</li>
          <li>Doplnit a vyčíslit rovnici (typu Pb + CuSO₄, Mg + AgNO₃, K + H₂O).</li>
          <li>Vyznačit u rovnice <b>oxidaci a redukci</b> (kdo se oxiduje, kdo redukuje).</li>
          <li>Pamatovat si: <b>K, Na, Ca</b> reagují s vodou za studena.</li>
          <li>Vědět, že <b>Cu, Ag, Hg, Au, Pt</b> nereagují se zředěnou HCl/H₂SO₄.</li>
        </ol>
      </CheatCard>

    </div>
  );
}

function CheatCard({ title, color, children }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)',
      border: `1px solid ${color}55`, borderRadius: 18, padding: 22,
      transition: 'all 0.4s ease'
    }}>
      <div style={{ color, fontWeight: 700, fontSize: 16, marginBottom: 12 }}>{title}</div>
      {children}
    </div>
  );
}

const preStyle = {
  padding: '12px 14px', background: 'rgba(0,0,0,0.3)',
  border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10,
  color: '#a5f3fc', fontSize: 13.5, fontFamily: 'JetBrains Mono, monospace',
  whiteSpace: 'pre-wrap', overflow: 'auto', margin: 0
};

// ═══════════════════════════════════════════════════════════════
// SYNTHWAVE BACKGROUND
// ═══════════════════════════════════════════════════════════════

function Synthwave() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;600;700;800&family=Audiowide&family=JetBrains+Mono:wght@400;600&display=swap');

        @keyframes sungrad {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes particle {
          0%   { transform: translate(0,0); opacity: 0; }
          10%  { opacity: 0.7; }
          90%  { opacity: 0.5; }
          100% { transform: translate(var(--dx, 100px), -120vh); opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50%      { opacity: 0.9; }
        }

        .sw-grid {
          position: fixed; left: 0; right: 0; bottom: 0; height: 50vh;
          background-image:
            linear-gradient(rgba(139,92,246,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px);
          background-size: 60px 60px;
          transform: perspective(400px) rotateX(60deg);
          transform-origin: center bottom;
          pointer-events: none; z-index: 0;
        }
        .sw-sun {
          position: fixed; left: 50%; bottom: 38vh; transform: translateX(-50%);
          width: 320px; height: 320px; border-radius: 50%;
          background: linear-gradient(180deg, #f0abfc 0%, #ec4899 35%, #a855f7 65%, #6366f1 100%);
          background-size: 200% 200%; animation: sungrad 18s ease-in-out infinite;
          filter: blur(0.5px); box-shadow: 0 0 100px rgba(236,72,153,0.4);
          opacity: 0.55; pointer-events: none; z-index: 0;
        }
        .sw-sun::before {
          content: ''; position: absolute; inset: 0; border-radius: 50%;
          background: repeating-linear-gradient(0deg, transparent 0 16px, rgba(10,10,26,0.85) 16px 22px);
          mask: linear-gradient(180deg, transparent 0%, transparent 50%, #000 60%, #000 100%);
          -webkit-mask: linear-gradient(180deg, transparent 0%, transparent 50%, #000 60%, #000 100%);
        }
        .sw-particles { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
        .sw-p { position: absolute; bottom: -20px; width: 3px; height: 3px;
          background: #fff; border-radius: 50%; box-shadow: 0 0 6px #a5f3fc;
          animation: particle linear infinite; opacity: 0;
        }

        body { margin: 0; background: #0a0a1a; font-family: 'Exo 2', sans-serif; }
        * { box-sizing: border-box; }
        h1, h2, h3 { font-family: 'Audiowide', 'Exo 2', sans-serif; }

        button:hover { background: rgba(255,255,255,0.12) !important; }
      `}</style>
      <div className="sw-grid" />
      <div className="sw-sun" />
      <div className="sw-particles">
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} className="sw-p" style={{
            left: `${(i * 3.3 + Math.random() * 3) % 100}%`,
            animationDuration: `${10 + Math.random() * 10}s`,
            animationDelay: `${Math.random() * 12}s`,
            '--dx': `${(Math.random() - 0.5) * 200}px`,
          }} />
        ))}
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════

const mainStyles = {
  app: {
    minHeight: '100vh', background: '#0a0a1a',
    color: '#fff', fontFamily: "'Exo 2', sans-serif",
    position: 'relative', overflow: 'hidden auto', paddingBottom: 40
  },
  container: { position: 'relative', zIndex: 1, padding: '32px 16px', maxWidth: 1100, margin: '0 auto' },
  header: { textAlign: 'center', marginBottom: 28 },
  titleRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 },
  titleIcon: { fontSize: 40, filter: 'drop-shadow(0 0 14px #a855f7)' },
  title: {
    margin: 0, fontSize: 'clamp(24px, 5vw, 40px)', fontWeight: 700,
    background: 'linear-gradient(90deg, #f0abfc 0%, #c4b5fd 50%, #67e8f9 100%)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    letterSpacing: 1, fontFamily: "'Audiowide', sans-serif"
  },
  subtitle: {
    marginTop: 8, color: 'rgba(255,255,255,0.55)', fontSize: 14,
    letterSpacing: 2, textTransform: 'uppercase'
  },
  tabBar: {
    display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center',
    marginBottom: 28, padding: '6px',
    background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14,
    maxWidth: 700, margin: '0 auto 28px'
  },
  tab: {
    padding: '10px 16px', background: 'transparent', border: 'none',
    borderRadius: 10, color: 'rgba(255,255,255,0.65)',
    cursor: 'pointer', fontSize: 14, fontWeight: 600,
    transition: 'all 0.4s ease', fontFamily: "'Exo 2', sans-serif"
  },
  tabActive: {
    background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(6,182,212,0.2))',
    color: '#fff', boxShadow: '0 0 18px rgba(139,92,246,0.3)'
  },
  content: { animation: 'slidein 0.6s ease' }
};
