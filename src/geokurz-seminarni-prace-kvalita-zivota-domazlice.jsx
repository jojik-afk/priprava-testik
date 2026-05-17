// @title Geokurz: Seminární práce – Kvalita života v Domažlicích
// @subject Geography
// @topic Kvalita života, regionální geografie, Domažlice
// @template practice

import { useState, useMemo, useCallback, useEffect } from 'react';

// ── Shuffle utilities (from quiz engine) ──
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

// ── Quiz Engine Component ──
function QuizEngine({ questions, accentColor = "#a855f7" }) {
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

  const activeSet = isMulti ? (isRevealed ? myAnswer : pendingMulti) : myAnswer;

  if (showResults) {
    const msg = pct >= 90 ? "Výborně! Máš to perfektně zvládnuté!" : pct >= 70 ? "Dobře! Téměř máš vše zvládnuté." : pct >= 50 ? "Mohlo by to být lepší." : "Potřebuješ více přípravy.";
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "280px" }}>
        <div style={{ textAlign: "center", ...glassCard, padding: "40px 48px" }}>
          <div style={{ color: "#fff", fontSize: "52px", fontWeight: 800 }}>{score} / {shuffledQuestions.length}</div>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "22px", marginBottom: "16px" }}>{pct} %</div>
          <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "17px", marginBottom: "24px", maxWidth: "340px" }}>{msg}</div>
          <button style={{ ...btnStyle, background: accentColor + "66", border: `1px solid ${accentColor}` }} onClick={restart}>Začít znovu</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "680px", margin: "0 auto" }}>
      <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
        {shuffledQuestions.map((_, i) => {
          let bg = "#4b5563";
          if (i === idx) bg = accentColor;
          else if (revealed[i]) bg = arrEqual(answers[i] || [], shuffledQuestions[i].correct) ? "#22c55e" : "#ef4444";
          return <div key={i} onClick={() => goTo(i)} style={{ width: "22px", height: "22px", borderRadius: "50%", cursor: "pointer", transition: "background 0.4s ease", background: bg }} />;
        })}
      </div>
      <div style={glassCard}>
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
        {isMulti && !isRevealed && (
          <button style={{ ...btnStyle, opacity: pendingMulti.length === 0 ? 0.4 : 1, marginTop: "12px" }} onClick={submitMulti} disabled={pendingMulti.length === 0}>Potvrdít</button>
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
        <button style={btnStyle} onClick={() => goTo(idx - 1)} disabled={idx === 0}>← Předchozí</button>
        {idx < shuffledQuestions.length - 1
          ? <button style={btnStyle} onClick={() => goTo(idx + 1)}>Další →</button>
          : <button style={{ ...btnStyle, background: accentColor + "55", border: `1px solid ${accentColor}` }} onClick={() => setShowResults(true)}>Výsledky →</button>
        }
      </div>
    </div>
  );
}

// ── Collapsible Section ──
function Section({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ ...glassCard, marginBottom: "16px" }}>
      <div onClick={() => setOpen(!open)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", color: "#fff", fontSize: "17px", fontWeight: 600 }}>
        <span>{title}</span>
        <span style={{ fontSize: "20px", transition: "transform 0.4s ease", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
      </div>
      {open && <div style={{ marginTop: "16px", color: "rgba(255,255,255,0.85)", fontSize: "15px", lineHeight: 1.7 }}>{children}</div>}
    </div>
  );
}

// ── Tip Box ──
function TipBox({ children, color = "#60a5fa" }) {
  return (
    <div style={{ background: color + "15", border: `1px solid ${color}40`, borderRadius: "12px", padding: "14px 18px", margin: "12px 0", color: "rgba(255,255,255,0.9)", fontSize: "14px", lineHeight: 1.6 }}>
      {children}
    </div>
  );
}

// ── Citation Example ──
function CitationExample({ type, example }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "12px 16px", margin: "8px 0", fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "rgba(255,255,255,0.8)", lineHeight: 1.6 }}>
      <div style={{ color: "#fbbf24", fontSize: "12px", marginBottom: "6px", fontFamily: "inherit" }}>{type}</div>
      {example}
    </div>
  );
}

// ── Outline Item ──
function OutlineItem({ number, title, description, pages, children }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "16px 20px", marginBottom: "12px" }}>
      <div onClick={() => setExpanded(!expanded)} style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer" }}>
        <span style={{ background: "#60a5fa30", color: "#60a5fa", borderRadius: "8px", padding: "4px 10px", fontSize: "14px", fontWeight: 700, minWidth: "36px", textAlign: "center" }}>{number}</span>
        <div style={{ flex: 1 }}>
          <div style={{ color: "#fff", fontWeight: 600, fontSize: "16px" }}>{title}</div>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", marginTop: "4px" }}>{description}</div>
          {pages && <div style={{ color: "#60a5fa", fontSize: "12px", marginTop: "4px" }}>Doporučený rozsah: {pages}</div>}
        </div>
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "18px", transition: "transform 0.4s ease", transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
      </div>
      {expanded && <div style={{ marginTop: "14px", paddingTop: "14px", borderTop: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.8)", fontSize: "14px", lineHeight: 1.7 }}>{children}</div>}
    </div>
  );
}

// ── Source Card ──
function SourceCard({ type, title, author, detail, how }) {
  const colors = { kniha: "#a855f7", článek: "#60a5fa", web: "#22c55e", data: "#fbbf24", práce: "#f472b6" };
  const c = colors[type] || "#60a5fa";
  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${c}30`, borderRadius: "12px", padding: "14px 18px", marginBottom: "10px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
        <span style={{ background: c + "25", color: c, borderRadius: "6px", padding: "2px 8px", fontSize: "11px", fontWeight: 600, textTransform: "uppercase" }}>{type}</span>
        <span style={{ color: "#fff", fontSize: "15px", fontWeight: 600 }}>{title}</span>
      </div>
      {author && <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px" }}>{author}</div>}
      {detail && <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", marginTop: "4px" }}>{detail}</div>}
      {how && <div style={{ color: c, fontSize: "13px", marginTop: "6px", fontStyle: "italic" }}>{how}</div>}
    </div>
  );
}

// ── Checklist ──
function Checklist({ items }) {
  const [checked, setChecked] = useState({});
  const toggle = (i) => setChecked(prev => ({ ...prev, [i]: !prev[i] }));
  const done = Object.values(checked).filter(Boolean).length;
  return (
    <div>
      <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", marginBottom: "12px" }}>{done} / {items.length} splněno</div>
      <div style={{ background: `linear-gradient(90deg, #60a5fa ${(done / items.length) * 100}%, rgba(255,255,255,0.1) ${(done / items.length) * 100}%)`, height: "6px", borderRadius: "3px", marginBottom: "16px", transition: "all 0.8s ease" }} />
      {items.map((item, i) => (
        <div key={i} onClick={() => toggle(i)} style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "10px 14px", borderRadius: "10px", marginBottom: "6px", cursor: "pointer", background: checked[i] ? "rgba(34,197,94,0.08)" : "rgba(255,255,255,0.03)", border: `1px solid ${checked[i] ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.06)"}`, transition: "all 0.4s ease" }}>
          <span style={{ fontSize: "18px", minWidth: "24px" }}>{checked[i] ? "☑" : "☐"}</span>
          <span style={{ color: checked[i] ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.85)", fontSize: "14px", lineHeight: 1.5, textDecoration: checked[i] ? "line-through" : "none", transition: "all 0.4s ease" }}>{item}</span>
        </div>
      ))}
    </div>
  );
}

// ── Styles ──
const glassCard = {
  background: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "20px",
  padding: "24px",
  transition: "all 0.4s ease"
};

const btnStyle = {
  padding: "10px 22px",
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: "10px",
  color: "#fff",
  cursor: "pointer",
  fontSize: "15px",
  transition: "all 0.4s ease"
};

// ── Quiz Questions ──
const quizQuestions = [
  {
    question: "Co musí obsahovat úvod seminární práce podle pravidel GJK?",
    type: "multi",
    options: [
      "Uvedení do problematiky",
      "Cíle práce",
      "Naznačenou strukturu práce",
      "Výsledky výzkumu"
    ],
    correct: [0, 1, 2],
    explanation: "Úvod obsahuje uvedení do problematiky, cíle práce a naznačenou strukturu práce. Výsledky výzkumu patří do praktické/analytické části."
  },
  {
    question: "Jaký font a velikost se používá pro text seminární práce?",
    type: "single",
    options: ["Arial – 12", "Times New Roman – 12", "Calibri – 11", "Times New Roman – 14"],
    correct: [1],
    explanation: "Podle pravidel GJK se pro text používá Times New Roman velikost 12, řádkování 1,5, zarovnání do bloku."
  },
  {
    question: "Jak se správně cituje parafráze v harvardském systému?",
    type: "single",
    options: [
      "(Hampl 1996, s. 13)",
      "(Hampl, 1996)",
      "(Blažek 1996)",
      "[1]"
    ],
    correct: [2],
    explanation: "Při parafrázi (ne doslovné citaci) se uvádí jen příjmení a rok: (Blažek 1996). Číslo strany se uvádí pouze u doslovných citací."
  },
  {
    question: "Jaký je požadovaný rozsah seminární práce pro geokurz?",
    type: "single",
    options: ["5–8 normostran", "8–15 normostran", "10–20 normostran", "15–25 normostran"],
    correct: [1],
    explanation: "Podle zadání geokurzu je rozsah seminární práce 8–15 normostran. Hodnotí se formální (30 %) i obsahová (70 %) stránka."
  },
  {
    question: "Co je Index kvality života (IKŽ)?",
    type: "single",
    options: [
      "Ukazatel měřící pouze HDP na obyvatele",
      "Komplexní hodnocení 206 měst ve 3 oblastech na základě 80 datových zdrojů",
      "Subjektivní dotazníkové šetření obyvatel",
      "Index OSN pro rozvojové země"
    ],
    correct: [1],
    explanation: "Index kvality života od Obce v datech porovnává 206 českých měst ve třech oblastech: zdraví a životní prostředí, materiální zabezpečení a vzdělání, vztahy a služby – na základě 80 datových zdrojů a 29 sub-indexů."
  },
  {
    question: "Kde se Domažlice umístily v IKŽ 2024 v rámci Plzeňského kraje?",
    type: "single",
    options: ["1. místo", "3. místo", "7. místo", "12. místo"],
    correct: [2],
    explanation: "Domažlice obsadily 7. místo v rámci Plzeňského kraje. První místo získala Plzeň, druhé Přeštice, třetí Klatovy (skóre 5,3 z 10)."
  },
  {
    question: "Které z těchto zdrojů jsou vhodné pro seminární práci na úrovni gymnázia? (minimum = diplomové práce)",
    type: "multi",
    options: [
      "Bakalářská práce z ČVUT",
      "Diplomová práce z PřF UK",
      "Článek v Geografických rozhledech",
      "Wikipedie"
    ],
    correct: [1, 2],
    explanation: "Podle zadání jsou minimální úrovní zdrojů diplomové práce (ne bakalářské). Geografické rozhledy jsou odborný recenzovaný časopis. Wikipedie není akademický zdroj, bakalářská práce nesplňuje minimum."
  },
  {
    question: "Co patří do teoretické části seminární práce?",
    type: "single",
    options: [
      "Vlastní měření a dotazníky",
      "Zpracování poznatků jiných autorů, srovnání a kritické hodnocení zdrojů",
      "Osobní názory na téma",
      "Pouze citace bez vlastního komentáře"
    ],
    correct: [1],
    explanation: "Teoretická část rozpracovává vybraný problém podle toho, co o něm napsali jiní autoři. Informace z dohledaných zdrojů se navzájem srovnávají, konfrontují a kriticky hodnotí."
  },
  {
    question: "Jakou výzkumnou metodu bys mohl použít pro analýzu kvality života v Domažlicích?",
    type: "multi",
    options: [
      "Dotazníkové šetření mezi obyvateli",
      "Analýza statistických dat z ČSÚ",
      "Terénní pozorování infrastruktury",
      "Rozhovory s představiteli města"
    ],
    correct: [0, 1, 2, 3],
    explanation: "Všechny uvedené metody jsou legitimní výzkumné metody pro analýzu kvality života. V práci je třeba navrhnout metodu a zdůvodnit její výběr. Kombinace kvantitativních (statistiky) a kvalitativních (rozhovory, pozorování) metod je ideální."
  },
  {
    question: "Kolik obyvatel má město Domažlice?",
    type: "single",
    options: ["Přibližně 5 000", "Přibližně 11 000", "Přibližně 25 000", "Přibližně 55 000"],
    correct: [1],
    explanation: "Město Domažlice má přibližně 11 010 obyvatel, což představuje 19,7 % obyvatel celého okresu Domažlice (55 796 obyvatel)."
  },
  {
    question: "Co znamená pojem \u201Evnitřní periferie\u201C v české geografii?",
    type: "single",
    options: [
      "Oblasti na hranicích státu",
      "Území s ekonomickým zaostáváním uvnitř státu, daleko od velkých center",
      "Pražský okraj",
      "Horské oblasti nad 800 m n. m."
    ],
    correct: [1],
    explanation: "Vnitřní periferie jsou území uvnitř státu, která ekonomicky zaostávají kvůli vzdálenosti od velkých center, slabé dopravní dostupnosti a odlivu obyvatel. Koncept rozpracovali Musil a Müller (2008)."
  },
  {
    question: "Jak se v textu správně odkazuje na internetový zdroj?",
    type: "single",
    options: [
      "Celá URL adresa v textu",
      "Pouze název webu v textu, celá URL do seznamu zdrojů",
      "Poznámka pod čarou s odkazem",
      "Hypertextový odkaz v textu"
    ],
    correct: [1],
    explanation: "Podle pravidel GJK se do textu uvádí pouze název webu (např. cs.wikipedia.org). Všechny internetové odkazy musí být uvedeny v prosté formě (ne jako hypertextový odkaz) v samostatné kapitole \u201ESeznam internetových zdrojů\u201C."
  }
];

// ── Data for Domažlice profile ──
const domazliceData = [
  { label: "Počet obyvatel", value: "~11 010", detail: "19,7 % obyvatel okresu" },
  { label: "Okres", value: "Domažlice", detail: "Plzeňský kraj" },
  { label: "ORP", value: "Domažlice", detail: "+ ORP Horšovský Týn v okrese" },
  { label: "Rozloha města", value: "2 461 ha", detail: "z toho 1 599 ha zemědělská půda" },
  { label: "Obyvatelstvo okresu", value: "55 796", detail: "2. nejméně lidnatý v kraji (9,2 %)" },
  { label: "Uchazeči o zaměstnání", value: "1 074", detail: "0,5 uchazeče na 1 pracovní místo" },
  { label: "IKŽ 2024 (kraj)", value: "7. místo", detail: "Skóre 4,7 z 10" },
  { label: "Nadmořská výška", value: "~450 m n. m.", detail: "Čerchov 1 042 m (Český les)" },
  { label: "Hranice", value: "Německo (Bavorsko)", detail: "Hraniční přechod Folmava" },
  { label: "Památky", value: "Městská památková rezervace", detail: "Historické centrum, Chodsko" }
];

// ── Main App ──
export default function App() {
  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.background = "#0a0a1a";
  }, []);
  const [tab, setTab] = useState("osnova");
  const tabs = [
    { id: "osnova", label: "Osnova práce" },
    { id: "profil", label: "Profil Domažlic" },
    { id: "teorie", label: "Teorie KŽ" },
    { id: "zdroje", label: "Zdroje" },
    { id: "metody", label: "Metodika" },
    { id: "forma", label: "Formální pravidla" },
    { id: "checklist", label: "Checklist" },
    { id: "kviz", label: "Kvíz" }
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a1a", color: "#fff", fontFamily: "'Segoe UI', 'Inter', sans-serif", position: "relative", overflow: "hidden" }}>
      {/* Animated background circles */}
      <div style={{ position: "fixed", top: "-20%", left: "-10%", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(96,165,250,0.12) 0%, transparent 70%)", filter: "blur(40px)", animation: "float1 18s ease-in-out infinite", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "-15%", right: "-5%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(168,85,247,0.10) 0%, transparent 70%)", filter: "blur(40px)", animation: "float2 22s ease-in-out infinite", zIndex: 0 }} />
      <div style={{ position: "fixed", top: "40%", right: "20%", width: "350px", height: "350px", borderRadius: "50%", background: "radial-gradient(circle, rgba(251,191,36,0.08) 0%, transparent 70%)", filter: "blur(40px)", animation: "float3 15s ease-in-out infinite", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{ color: "#fff", fontSize: "28px", fontWeight: 800, marginBottom: "8px", lineHeight: 1.3 }}>
            Seminární práce: Kvalita života v Domažlicích
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "15px", margin: 0 }}>
            Geokurz 2026 — Gymnázium Jana Keplera — Odevzdání do 6. 3. 2026
          </p>
        </div>

        {/* Tab bar */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center", marginBottom: "28px" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: "8px 18px", borderRadius: "20px", border: "1px solid " + (tab === t.id ? "#60a5fa" : "rgba(255,255,255,0.12)"),
              background: tab === t.id ? "#60a5fa25" : "rgba(255,255,255,0.04)", color: tab === t.id ? "#60a5fa" : "rgba(255,255,255,0.6)",
              cursor: "pointer", fontSize: "14px", fontWeight: tab === t.id ? 600 : 400, transition: "all 0.4s ease"
            }}>{t.label}</button>
          ))}
        </div>

        {/* Tab content */}
        {tab === "osnova" && <OsnovaTab />}
        {tab === "profil" && <ProfilTab />}
        {tab === "teorie" && <TeorieTab />}
        {tab === "zdroje" && <ZdrojeTab />}
        {tab === "metody" && <MetodyTab />}
        {tab === "forma" && <FormaTab />}
        {tab === "checklist" && <ChecklistTab />}
        {tab === "kviz" && <KvizTab />}
      </div>

      <style>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, -40px); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-25px, 35px); }
        }
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(15px, 25px); }
        }
      `}</style>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// TAB 1: OSNOVA PRÁCE
// ════════════════════════════════════════════════════════════════
function OsnovaTab() {
  return (
    <div>
      <TipBox color="#60a5fa">
        Tvoje téma: <strong>„Úroveň kvality života v Domažlicích: jak se žije v regionálním centru?"</strong><br />
        Cíl: analyzovat, porovnat, navrhnout řešení. Otázky: jak a proč (ne kdy, kde).<br />
        Rozsah: 8–15 normostran. Hodnocení: formální 30 % + obsahová 70 %.
      </TipBox>

      <OutlineItem number="0" title="Titulní strana" description="Gymnázium Jana Keplera, název práce, jméno, třída, rok, předmět" pages="1 strana">
        <div>
          <strong>Vzor:</strong>
          <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "12px", padding: "20px", marginTop: "10px", textAlign: "center", lineHeight: 2 }}>
            <div style={{ fontSize: "14px" }}>Gymnázium Jana Keplera</div>
            <div style={{ fontSize: "20px", fontWeight: 700, margin: "16px 0" }}>ÚROVEŇ KVALITY ŽIVOTA V DOMAŽLICÍCH:<br />JAK SE ŽIJE V REGIONÁLNÍM CENTRU?</div>
            <div style={{ fontSize: "14px", fontStyle: "italic" }}>Seminární práce<br />k předmětu Zeměpis</div>
            <div style={{ marginTop: "24px", fontSize: "14px" }}>
              <span>Jonas [příjmení]</span>
              <span style={{ marginLeft: "40px" }}>2.A</span>
            </div>
            <div style={{ fontSize: "14px" }}>Praha 2026</div>
          </div>
        </div>
      </OutlineItem>

      <OutlineItem number="1" title="Úvod" description="Uvedení do problematiky, cíle práce, struktura" pages="1–1,5 strany">
        <p><strong>Co sem patří:</strong></p>
        <ul style={{ paddingLeft: "20px", margin: "8px 0" }}>
          <li style={{ marginBottom: "6px" }}>Proč je téma důležité? — Kvalita života je klíčový ukazatel rozvoje regionů. Malá města jako Domažlice čelí specifickým výzvám (odliv mladých, stárnutí, dostupnost služeb).</li>
          <li style={{ marginBottom: "6px" }}>Existují publikace na toto téma? — Index kvality života (Obce v datech), práce Ouředníčka, Temelové a dalších o periferiích.</li>
          <li style={{ marginBottom: "6px" }}>Cíl práce — Analyzovat kvalitu života v Domažlicích pomocí objektivních indikátorů, porovnat s podobnými regionálními centry, navrhnout opatření pro zlepšení.</li>
          <li style={{ marginBottom: "6px" }}>Výzkumné otázky (formuluj JAK a PROČ):</li>
        </ul>
        <TipBox color="#fbbf24">
          <strong>Navrhované výzkumné otázky:</strong><br />
          1. Jak se liší kvalita života v Domažlicích od srovnatelných regionálních center?<br />
          2. Jaké faktory nejvíce ovlivňují kvalitu života v Domažlicích?<br />
          3. Proč dochází k odlivu mladých lidí z regionu a jak to ovlivňuje kvalitu života?<br />
          4. Jak mohou Domažlice zlepšit svou pozici v oblasti kvality života?
        </TipBox>
        <p>Stručně nastínit strukturu práce — „V první kapitole definuji pojem kvalita života..."</p>
      </OutlineItem>

      <OutlineItem number="2" title="Teoretická část: Kvalita života" description="Definice, indikátory, přístupy, rešerše literatury" pages="2–3 strany">
        <p><strong>Hlavní body:</strong></p>
        <ul style={{ paddingLeft: "20px", margin: "8px 0" }}>
          <li style={{ marginBottom: "6px" }}><strong>2.1 Definice kvality života</strong> — pojem je multidimenzionální, subjektivní vs. objektivní složka, historický vývoj konceptu (WHO, UNDP)</li>
          <li style={{ marginBottom: "6px" }}><strong>2.2 Měření kvality života</strong> — HDI (Index lidského rozvoje), Index kvality života (Obce v datech), Index prosperity regionů, STEM databáze, objektivní indikátory (zaměstnanost, zdraví, vzdělání) vs. subjektivní (spokojenost, pocit bezpečí)</li>
          <li style={{ marginBottom: "6px" }}><strong>2.3 Kvalita života v regionálních centrech ČR</strong> — rozdíly centrum–periferie (Hampl 2000), vnitřní periferie (Musil, Müller 2008), polarizace malých měst (Ouředníček, Temelová), příhraniční oblasti</li>
        </ul>
        <TipBox color="#22c55e">
          <strong>Klíčové:</strong> Nesměšuj vlastní názory s informacemi ze zdrojů. V teoretické části prezentuješ, co zjistili jiní autoři. Konfrontuj různé přístupy — např. objektivní indikátory nemusí odpovídat subjektivnímu vnímání obyvatel.
        </TipBox>
      </OutlineItem>

      <OutlineItem number="3" title="Charakteristika města Domažlice" description="Geografické, demografické a socioekonomické vymezení" pages="2–3 strany">
        <p><strong>Hlavní body:</strong></p>
        <ul style={{ paddingLeft: "20px", margin: "8px 0" }}>
          <li style={{ marginBottom: "6px" }}><strong>3.1 Poloha a administrativní zařazení</strong> — Plzeňský kraj, okres Domažlice, ORP Domažlice, příhraniční poloha (Bavorsko), dopravní spojení (Plzeň–Folmava, železnice Praha–Mnichov)</li>
          <li style={{ marginBottom: "6px" }}><strong>3.2 Demografický vývoj</strong> — počet obyvatel (~11 000), struktura (věková pyramida, index stáří), přirozený a migrační přírůstek, trend stárnutí</li>
          <li style={{ marginBottom: "6px" }}><strong>3.3 Ekonomika a trh práce</strong> — průmyslově-zemědělský charakter, nezaměstnanost (0,5 uchazeče na 1 místo = nízká), zaměstnavatelé, dojížďka</li>
          <li style={{ marginBottom: "6px" }}><strong>3.4 Občanská vybavenost a služby</strong> — zdravotnictví, školství, kultura (Chodské slavnosti), sport, doprava</li>
        </ul>
        <TipBox color="#60a5fa">
          Data čerpej z ČSÚ (Statistická ročenka Plzeňského kraje, Charakteristika okresu Domažlice), webu města Domažlice a Strategického plánu města.
        </TipBox>
      </OutlineItem>

      <OutlineItem number="4" title="Analýza kvality života v Domažlicích" description="Jádro práce — objektivní hodnocení podle indikátorů" pages="2–3 strany">
        <p><strong>Hlavní body:</strong></p>
        <ul style={{ paddingLeft: "20px", margin: "8px 0" }}>
          <li style={{ marginBottom: "6px" }}><strong>4.1 Zdraví a životní prostředí</strong> — kvalita ovzduší, dostupnost zdravotní péče, čistota přírody (Český les)</li>
          <li style={{ marginBottom: "6px" }}><strong>4.2 Materiální zabezpečení a vzdělání</strong> — průměrné příjmy, nezaměstnanost, dostupnost bydlení, školy</li>
          <li style={{ marginBottom: "6px" }}><strong>4.3 Vztahy a služby</strong> — komunitní život, kulturní vyžití (Chodské slavnosti), sportovní infrastruktura, bezpečnost</li>
          <li style={{ marginBottom: "6px" }}><strong>4.4 Srovnání</strong> — porovnání s podobnými ORP centry (Klatovy, Sušice, Přeštice) v IKŽ, identifikace silných a slabých stránek</li>
        </ul>
        <TipBox color="#f472b6">
          <strong>Metoda porovnání:</strong> Vyber 3–4 srovnatelná města (podobná velikost, periferní poloha) a porovnej klíčové indikátory v tabulce. Vizualizuj formou grafu nebo mapy.
        </TipBox>
      </OutlineItem>

      <OutlineItem number="5" title="Metodika terénního výzkumu" description="Návrh metod pro praktickou část v terénu" pages="1 strana">
        <p><strong>V této kapitole navrhneš, jak budeš zkoumat kvalitu života přímo v Domažlicích při terénním cvičení:</strong></p>
        <ul style={{ paddingLeft: "20px", margin: "8px 0" }}>
          <li style={{ marginBottom: "6px" }}>Dotazníkové šetření — 10–15 otázek na spokojenost obyvatel (subjektivní KŽ)</li>
          <li style={{ marginBottom: "6px" }}>Terénní pozorování — stav infrastruktury, veřejných prostranství, dostupnost služeb</li>
          <li style={{ marginBottom: "6px" }}>Polostrukturované rozhovory — s obyvateli, představiteli města, podnikateli</li>
          <li style={{ marginBottom: "6px" }}>Analýza dat — porovnání statistik ČSÚ s vlastními zjištěními</li>
        </ul>
        <TipBox color="#fbbf24">
          <strong>Formuluj hypotézy k ověření v terénu:</strong><br />
          H1: Obyvatelé Domažlic vnímají kvalitu života pozitivněji, než ukazují objektivní indikátory.<br />
          H2: Hlavním problémem je omezená dostupnost vyššího vzdělání a specializované zdravotní péče.<br />
          H3: Příhraniční poloha přináší ekonomické výhody (pracovní příležitosti v Bavorsku), ale i nevýhody (odliv obyvatel).
        </TipBox>
      </OutlineItem>

      <OutlineItem number="6" title="Závěr" description="Shrnutí poznatků, odpovědi na výzkumné otázky" pages="1 strana">
        <p>Závěr shrnuje:</p>
        <ul style={{ paddingLeft: "20px", margin: "8px 0" }}>
          <li style={{ marginBottom: "6px" }}>Hlavní zjištění z teoretické a analytické části</li>
          <li style={{ marginBottom: "6px" }}>Odpovědi na výzkumné otázky z úvodu</li>
          <li style={{ marginBottom: "6px" }}>Návrhy řešení — konkrétní opatření pro zlepšení kvality života</li>
          <li style={{ marginBottom: "6px" }}>Co se ověří v terénu a jak mohou výsledky přispět k diskusi</li>
        </ul>
      </OutlineItem>

      <OutlineItem number="7" title="Seznam použité literatury + Seznam internetových zdrojů" description="Abecedně řazené, na samostatných stránkách" pages="1–2 strany">
        <p>Musí být na <strong>samostatných stránkách</strong>:</p>
        <ul style={{ paddingLeft: "20px", margin: "8px 0" }}>
          <li style={{ marginBottom: "6px" }}>„Seznam použité literatury" — knihy, články, práce (abecedně dle příjmení)</li>
          <li style={{ marginBottom: "6px" }}>„Seznam internetových zdrojů" — URL v prosté formě (ne hypertextové odkazy)</li>
        </ul>
      </OutlineItem>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// TAB 2: PROFIL DOMAŽLIC
// ════════════════════════════════════════════════════════════════
function ProfilTab() {
  return (
    <div>
      <div style={glassCard}>
        <h2 style={{ color: "#fff", fontSize: "22px", fontWeight: 700, marginBottom: "20px", marginTop: 0 }}>Domažlice v datech</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "12px" }}>
          {domazliceData.map((d, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "14px 18px" }}>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", marginBottom: "4px" }}>{d.label}</div>
              <div style={{ color: "#60a5fa", fontSize: "20px", fontWeight: 700 }}>{d.value}</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", marginTop: "2px" }}>{d.detail}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <Section title="Geografická poloha a doprava" defaultOpen={true}>
          <ul style={{ paddingLeft: "20px", margin: 0 }}>
            <li style={{ marginBottom: "8px" }}>Plzeňský kraj, jihozápadní Čechy, přímo na hranici s Německem (Bavorsko)</li>
            <li style={{ marginBottom: "8px" }}>Silniční spojení: Plzeň–Folmava (E53), dálniční přivaděč na D5</li>
            <li style={{ marginBottom: "8px" }}>Železnice: Praha–Plzeň–Domažlice–Furth im Wald–Mnichov (mezinárodní rychlík)</li>
            <li style={{ marginBottom: "8px" }}>Vzdálenost od Plzně: ~60 km, od Prahy: ~180 km, od Řezna (Regensburg): ~100 km</li>
            <li style={{ marginBottom: "8px" }}>Hraniční přechod Folmava — významný obchodní a tranzitní bod</li>
          </ul>
        </Section>

        <Section title="Demografie a socioekonomika">
          <ul style={{ paddingLeft: "20px", margin: 0 }}>
            <li style={{ marginBottom: "8px" }}>~11 000 obyvatel ve městě, ~55 800 v celém okrese</li>
            <li style={{ marginBottom: "8px" }}>Trend stárnutí populace — 11 653 obyvatel okresu ve věku 65+ (2022)</li>
            <li style={{ marginBottom: "8px" }}>Nízká nezaměstnanost — 0,5 uchazeče na 1 pracovní místo (2022)</li>
            <li style={{ marginBottom: "8px" }}>Průmyslově-zemědělský charakter okresu</li>
            <li style={{ marginBottom: "8px" }}>Pozitivní migrační saldo: 27,6 ‰ (2022) — přistěhovalí převyšují vystěhovalé</li>
            <li style={{ marginBottom: "8px" }}>Ale: 2. nejméně lidnatý okres v kraji (9,2 % populace kraje)</li>
          </ul>
        </Section>

        <Section title="Kultura a cestovní ruch">
          <ul style={{ paddingLeft: "20px", margin: 0 }}>
            <li style={{ marginBottom: "8px" }}>Chodské slavnosti — nejvýznamnější folklorní festival, každoročně v srpnu</li>
            <li style={{ marginBottom: "8px" }}>Městská památková rezervace — zachovalé historické centrum</li>
            <li style={{ marginBottom: "8px" }}>Tradice Chodska — jedinečný národopisný region (chodský kroj, dudák, Kozina)</li>
            <li style={{ marginBottom: "8px" }}>Český les — čistá příroda, turistika, cykloturistika, lyžování (Čerchov)</li>
            <li style={{ marginBottom: "8px" }}>Kulturní infrastruktura: Městské kulturní středisko, kino, muzeum</li>
          </ul>
        </Section>

        <Section title="SWOT analýza pro seminární práci">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div style={{ background: "rgba(34,197,94,0.08)", borderRadius: "12px", padding: "14px" }}>
              <div style={{ color: "#22c55e", fontWeight: 700, marginBottom: "8px" }}>Silné stránky</div>
              <ul style={{ paddingLeft: "16px", margin: 0, fontSize: "13px" }}>
                <li>Nízká nezaměstnanost</li>
                <li>Čisté životní prostředí</li>
                <li>Bohatá kulturní tradice</li>
                <li>Příhraniční poloha (Bavorsko)</li>
                <li>Železniční spojení Praha–Mnichov</li>
              </ul>
            </div>
            <div style={{ background: "rgba(239,68,68,0.08)", borderRadius: "12px", padding: "14px" }}>
              <div style={{ color: "#ef4444", fontWeight: 700, marginBottom: "8px" }}>Slabé stránky</div>
              <ul style={{ paddingLeft: "16px", margin: 0, fontSize: "13px" }}>
                <li>Vzdálenost od velkých center</li>
                <li>Omezené vyšší vzdělávání</li>
                <li>Stárnutí populace</li>
                <li>Nižší IKŽ v rámci kraje (7. místo)</li>
                <li>Omezená specializovaná péče</li>
              </ul>
            </div>
            <div style={{ background: "rgba(96,165,250,0.08)", borderRadius: "12px", padding: "14px" }}>
              <div style={{ color: "#60a5fa", fontWeight: 700, marginBottom: "8px" }}>Příležitosti</div>
              <ul style={{ paddingLeft: "16px", margin: 0, fontSize: "13px" }}>
                <li>Přeshraniční spolupráce</li>
                <li>Rozvoj cestovního ruchu</li>
                <li>Remote work — návrat mladých</li>
                <li>EU fondy pro rozvoj periferie</li>
                <li>Modernizace železnice</li>
              </ul>
            </div>
            <div style={{ background: "rgba(251,191,36,0.08)", borderRadius: "12px", padding: "14px" }}>
              <div style={{ color: "#fbbf24", fontWeight: 700, marginBottom: "8px" }}>Hrozby</div>
              <ul style={{ paddingLeft: "16px", margin: 0, fontSize: "13px" }}>
                <li>Pokračující odliv mladých</li>
                <li>Centralizace služeb do Plzně</li>
                <li>Ekonomická závislost na málo odvětvích</li>
                <li>Prohlubování nerovností centrum–periferie</li>
                <li>Omezování veřejné dopravy</li>
              </ul>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// TAB 3: TEORIE KVALITY ŽIVOTA
// ════════════════════════════════════════════════════════════════
function TeorieTab() {
  return (
    <div>
      <Section title="Co je kvalita života?" defaultOpen={true}>
        <p>Kvalita života (KŽ) je <strong>multidimenzionální koncept</strong> zahrnující materiální podmínky, zdraví, vzdělání, sociální vztahy, životní prostředí a subjektivní spokojenost jedince či komunity.</p>
        <p>Základní charakteristiky konceptu:</p>
        <ul style={{ paddingLeft: "20px" }}>
          <li style={{ marginBottom: "6px" }}><strong>Komplikovanost</strong> — neexistuje jednoznačná definice</li>
          <li style={{ marginBottom: "6px" }}><strong>Dualita</strong> — objektivní měřitelné podmínky vs. subjektivní vnímání</li>
          <li style={{ marginBottom: "6px" }}><strong>Multidimenzionalita</strong> — zahrnuje ekonomické, sociální, environmentální i kulturní aspekty</li>
          <li style={{ marginBottom: "6px" }}><strong>Interdisciplinarita</strong> — studuje ji geografie, sociologie, ekonomie, psychologie</li>
          <li style={{ marginBottom: "6px" }}><strong>Variabilita</strong> — mění se v čase i prostoru</li>
        </ul>
      </Section>

      <Section title="Objektivní vs. subjektivní indikátory">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div style={{ background: "rgba(96,165,250,0.08)", borderRadius: "12px", padding: "16px" }}>
            <div style={{ color: "#60a5fa", fontWeight: 700, fontSize: "16px", marginBottom: "10px" }}>Objektivní indikátory</div>
            <ul style={{ paddingLeft: "16px", margin: 0, fontSize: "14px" }}>
              <li>HDP na obyvatele / průměrný příjem</li>
              <li>Míra nezaměstnanosti</li>
              <li>Naděje dožití</li>
              <li>Úroveň vzdělání</li>
              <li>Dostupnost služeb</li>
              <li>Kvalita ovzduší</li>
              <li>Kriminalita</li>
              <li>Dopravní dostupnost</li>
            </ul>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", marginTop: "10px" }}>Měří třetí strana, statistiky</div>
          </div>
          <div style={{ background: "rgba(168,85,247,0.08)", borderRadius: "12px", padding: "16px" }}>
            <div style={{ color: "#a855f7", fontWeight: 700, fontSize: "16px", marginBottom: "10px" }}>Subjektivní indikátory</div>
            <ul style={{ paddingLeft: "16px", margin: 0, fontSize: "14px" }}>
              <li>Spokojenost se životem</li>
              <li>Pocit bezpečí</li>
              <li>Vnímání kvality okolí</li>
              <li>Sounáležitost s komunitou</li>
              <li>Spokojenost se službami</li>
              <li>Hodnocení vlastního zdraví</li>
              <li>Vnímání budoucnosti</li>
              <li>Sociální důvěra</li>
            </ul>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", marginTop: "10px" }}>Dotazníky, rozhovory, šetření</div>
          </div>
        </div>
        <TipBox color="#fbbf24">
          <strong>Klíčový argument pro práci:</strong> Objektivní data z ČSÚ a IKŽ nemusí odpovídat tomu, jak obyvatelé Domažlic skutečně vnímají svůj život. To je prostor pro tvůj terénní výzkum!
        </TipBox>
      </Section>

      <Section title="Index kvality života (IKŽ) — Obce v datech">
        <p>Nejpoužívanější český nástroj pro srovnávání kvality života ve 206 městech.</p>
        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: "12px", padding: "16px", margin: "12px 0" }}>
          <div style={{ fontWeight: 600, marginBottom: "10px" }}>3 hlavní oblasti:</div>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {[
              { name: "Zdraví a životní prostředí", items: "naděje dožití, kvalita ovzduší, znečištění, hluk" },
              { name: "Materiální zabezpečení a vzdělání", items: "nezaměstnanost, příjmy, dostupnost bydlení, školy" },
              { name: "Vztahy a služby", items: "bezpečnost, kultura, sport, komunita, doprava" }
            ].map((area, i) => (
              <div key={i} style={{ flex: "1 1 200px", background: "rgba(96,165,250,0.06)", borderRadius: "10px", padding: "12px" }}>
                <div style={{ color: "#60a5fa", fontWeight: 600, fontSize: "14px", marginBottom: "6px" }}>{area.name}</div>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px" }}>{area.items}</div>
              </div>
            ))}
          </div>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", marginTop: "12px" }}>Celkem 80 datových zdrojů → 29 sub-indexů → 1 finální skóre (0–10)</div>
        </div>
      </Section>

      <Section title="Index lidského rozvoje (HDI)">
        <p>Mezinárodní měřítko UNDP (od 1990) založené na třech komponentech:</p>
        <div style={{ display: "flex", gap: "12px", margin: "12px 0", flexWrap: "wrap" }}>
          {[
            { name: "Zdraví", desc: "Naděje dožití při narození", icon: "♥" },
            { name: "Vzdělání", desc: "Průměrná a očekávaná délka školní docházky", icon: "📖" },
            { name: "Životní úroveň", desc: "HND na osobu (PPP)", icon: "💰" }
          ].map((c, i) => (
            <div key={i} style={{ flex: "1 1 150px", background: "rgba(255,255,255,0.04)", borderRadius: "12px", padding: "14px", textAlign: "center" }}>
              <div style={{ fontSize: "28px", marginBottom: "8px" }}>{c.icon}</div>
              <div style={{ color: "#fff", fontWeight: 600, fontSize: "15px" }}>{c.name}</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", marginTop: "4px" }}>{c.desc}</div>
            </div>
          ))}
        </div>
        <TipBox color="#60a5fa">HDI je vhodné zmínit v teoretické části jako mezinárodní referenční rámec, ale pro analýzu Domažlic je relevantnější český IKŽ nebo Index prosperity regionů.</TipBox>
      </Section>

      <Section title="Centrum–periferie v české geografii">
        <p>Klíčové koncepty pro zasazení Domažlic do širšího kontextu:</p>
        <ul style={{ paddingLeft: "20px" }}>
          <li style={{ marginBottom: "8px" }}><strong>Hampl (2000)</strong> — koncept vnějších periferií: příhraniční oblasti jako typické periferie ČR</li>
          <li style={{ marginBottom: "8px" }}><strong>Musil, Müller (2008)</strong> — vnitřní periferie: propojení periferality se sociálním vyloučením, ekonomické zaostávání omezuje rozvoj dopravy a vede k odlivu obyvatel</li>
          <li style={{ marginBottom: "8px" }}><strong>Ouředníček, Temelová, Pospíšilová (2011)</strong> — Atlas sociálně-prostorové diferenciace ČR, mapování regionálních nerovností</li>
          <li style={{ marginBottom: "8px" }}><strong>Index prosperity regionů</strong> — hodnotí 206 mikroregionů dle 37 indikátorů</li>
        </ul>
        <TipBox color="#a855f7">
          Domažlice jsou zajímavý případ: leží na vnější periferii (hranice), ale díky mezinárodnímu železničnímu spojení a hraniční ekonomice mají specifické výhody, které typické periferie nemají.
        </TipBox>
      </Section>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// TAB 4: ZDROJE
// ════════════════════════════════════════════════════════════════
function ZdrojeTab() {
  return (
    <div>
      <TipBox color="#ef4444">
        <strong>Pravidla zdrojů pro tvou práci:</strong> Minimální úroveň = diplomové práce (ne bakalářské). Upřednostni: Google Scholar, Geografické rozhledy, odborné články, diplomové/disertační práce.
      </TipBox>

      <Section title="Odborné knihy a monografie" defaultOpen={true}>
        <SourceCard type="kniha" title="Teorie regionálního rozvoje" author="BLAŽEK, J., UHLÍŘ, D. (2011)" detail="Karolinum, Praha, 309 s." how="Teoretický rámec pro pochopení regionálních nerovností, centrum-periferie" />
        <SourceCard type="kniha" title="Regionální struktura a vývoj systému osídlení ČSR" author="HAMPL, M., GARDAVSKÝ, V., KÜHNL, K. (1987)" detail="Univerzita Karlova, Praha, 236 s." how="Klasické dílo o systému osídlení — kontextualizace role malých měst" />
        <SourceCard type="kniha" title="Atlas sociálně-prostorové diferenciace ČR" author="OUŘEDNÍČEK, M., TEMELOVÁ, J., POSPÍŠILOVÁ, L. (2011)" detail="Karolinum, Praha" how="Mapy a analýzy regionálních nerovností, vizualizace dat o kvalitě života" />
      </Section>

      <Section title="Odborné články">
        <SourceCard type="článek" title="Prostorové vzorce sociálně-ekonomické diferenciace obcí v ČR" author="Ouředníček, M. a kol." detail="ResearchGate / Geografie – Sborník ČGS" how="Metodika analýzy regionálních rozdílů aplikovatelná na tvé téma" />
        <SourceCard type="článek" title="Vnitřní periferie ČR jako mechanismus sociální exkluze" author="MUSIL, J., MÜLLER, J. (2008)" detail="Sociologický časopis" how="Klíčový koncept vnitřní periferie — Domažlice jako hraniční případ" />
        <SourceCard type="článek" title="Geografické rozhledy — různé články" author="Např. NOVOTNÝ, J. a další" detail="Odborný časopis ČGS" how="Hledej články o kvalitě života, regionálním rozvoji, malých městech v ČR" />
        <TipBox color="#60a5fa">
          <strong>Jak hledat v Geografických rozhledech:</strong> Jdi na geo.cuni.cz nebo geograficke-rozhledy.cz a prohledej archiv. Klíčová slova: „kvalita života", „regionální rozvoj", „periferie", „malá města".
        </TipBox>
      </Section>

      <Section title="Diplomové a disertační práce">
        <SourceCard type="práce" title="Typologie venkova Plzeňského kraje a hodnocení měkkých faktorů rozvoje" author="Diplomová práce, PřF UK" detail="dspace.cuni.cz" how="Přímo o Plzeňském kraji — metodika hodnocení měkkých faktorů rozvoje" />
        <SourceCard type="práce" title="Regionální diferenciace populačního vývoje v Plzeňském kraji" author="Diplomová práce, PedF JČU" detail="theses.cz" how="Demografická analýza mikroregionů Plzeňského kraje včetně Domažlicka" />
        <TipBox color="#22c55e">
          <strong>Kde hledat další práce:</strong><br />
          • theses.cz — centrální databáze závěrečných prací<br />
          • dspace.cuni.cz — repozitář Univerzity Karlovy<br />
          • is.muni.cz — Masarykova univerzita<br />
          Hledej: „kvalita života" + „malé město" / „regionální centrum" / „Plzeňský kraj" / „periferie"
        </TipBox>
      </Section>

      <Section title="Datové zdroje a weby">
        <SourceCard type="data" title="Český statistický úřad (ČSÚ)" author="czso.cz" detail="Statistická ročenka Plzeňského kraje, Charakteristika okresů, data o obyvatelstvu" how="Hlavní zdroj tvrdých dat: demografie, zaměstnanost, ekonomika" />
        <SourceCard type="data" title="Obce v datech — Index kvality života" author="obcevdatech.cz" detail="IKŽ 2024: Domažlice = 7. místo v Plzeňském kraji, skóre 4,7/10" how="Srovnání s ostatními městy, 29 sub-indexů, vizualizace" />
        <SourceCard type="data" title="Index prosperity regionů" author="indexprosperity.cz" detail="206 mikroregionů, 37 indikátorů" how="Širší kontext prosperity ORP Domažlice" />
        <SourceCard type="data" title="STEM — Databáze kvality života v obcích" author="stem.cz" detail="160+ ukazatelů v 11 oblastech" how="Alternativní pohled, detailnější data" />
        <SourceCard type="web" title="Město Domažlice — oficiální web" author="domazlice.eu" detail="Domažlice v číslech, strategický plán, zprávy" how="Lokální pohled, plány rozvoje města" />
        <SourceCard type="web" title="Charakteristika okresu Domažlice" author="ČSÚ (csu.gov.cz)" detail="PDF dokument — komplexní profil okresu" how="Souhrnná charakteristika pro kapitolu 3" />
      </Section>

      <Section title="Jak citovat — vzory">
        <p style={{ marginBottom: "12px" }}>Používej <strong>harvardský systém</strong> (jméno–datum). Buď konzistentní v celé práci.</p>
        <CitationExample type="Citace knihy v textu (parafráze):" example="Jedním z klíčových konceptů regionální geografie je polarizace prostoru (Blažek, Uhlíř 2011)." />
        <CitationExample type="Doslovná citace v textu:" example={<span>Hampl (1996, s. 13) tvrdí, že „vědecké poznání směřuje k vytváření teoretických systémů".</span>} />
        <CitationExample type="Citace knihy v seznamu literatury:" example="BLAŽEK, J., UHLÍŘ, D. (2011): Teorie regionálního rozvoje. Karolinum, Praha, 309 s." />
        <CitationExample type="Citace článku v seznamu literatury:" example="NOVOTNÝ, J. (2018): Strukturální proměny Afriky. Geografické rozhledy, 27, č. 3, s. 4–7" />
        <CitationExample type="Citace internetového zdroje v textu:" example={<span>Nezaměstnanost v okrese Domažlice dosáhla v roce 2022 hodnoty 0,5 uchazeče na 1 pracovní místo (czso.cz).</span>} />
        <CitationExample type="Internetový zdroj v seznamu:" example="Český statistický úřad: https://www.czso.cz/" />
      </Section>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// TAB 5: METODIKA
// ════════════════════════════════════════════════════════════════
function MetodyTab() {
  return (
    <div>
      <TipBox color="#fbbf24">
        V práci je třeba navrhnout <strong>metodu, jak problém řešit</strong> (měření, dotazování, pozorování, rozhovory). Tato kapitola ti pomůže navrhnout terénní výzkum.
      </TipBox>

      <Section title="1. Analýza sekundárních dat" defaultOpen={true}>
        <p><strong>Co:</strong> Sběr a vyhodnocení existujících statistických dat</p>
        <p><strong>Zdroje:</strong> ČSÚ, Obce v datech, STEM databáze, Úřad práce</p>
        <p><strong>Indikátory k porovnání:</strong></p>
        <ul style={{ paddingLeft: "20px" }}>
          <li>Míra nezaměstnanosti (Domažlice vs. Klatovy, Sušice, Přeštice)</li>
          <li>Index stáří (poměr 65+ / 0–14)</li>
          <li>Migrační saldo</li>
          <li>Průměrný příjem</li>
          <li>Dostupnost zdravotní péče (počet lékařů na 1 000 obyvatel)</li>
        </ul>
        <TipBox color="#60a5fa">
          <strong>Tip:</strong> Udělej srovnávací tabulku 4 měst (Domažlice, Klatovy, Sušice, Horšovský Týn) podle 5–6 indikátorů. Vizualizuj grafem.
        </TipBox>
      </Section>

      <Section title="2. Dotazníkové šetření (pro terén)">
        <p><strong>Co:</strong> Krátký strukturovaný dotazník pro obyvatele Domažlic</p>
        <p><strong>Vzorek:</strong> 30–50 respondentů, různé věkové skupiny</p>
        <p><strong>Navrhované otázky:</strong></p>
        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: "12px", padding: "16px", margin: "12px 0" }}>
          <ol style={{ paddingLeft: "20px", margin: 0, fontSize: "14px" }}>
            <li style={{ marginBottom: "8px" }}>Jak hodnotíte kvalitu života v Domažlicích na škále 1–10?</li>
            <li style={{ marginBottom: "8px" }}>Co považujete za největší výhodu života v Domažlicích?</li>
            <li style={{ marginBottom: "8px" }}>Co vám v Domažlicích nejvíce chybí?</li>
            <li style={{ marginBottom: "8px" }}>Jak hodnotíte dostupnost: zdravotní péče / vzdělání / kultury / dopravy? (1–5)</li>
            <li style={{ marginBottom: "8px" }}>Plánujete v Domažlicích zůstat dlouhodobě? Proč ano/ne?</li>
            <li style={{ marginBottom: "8px" }}>Jak vnímáte blízkost hranice s Německem? (výhoda / nevýhoda / neutrální)</li>
            <li style={{ marginBottom: "8px" }}>Cítíte se v Domažlicích bezpečně? (1–5)</li>
            <li style={{ marginBottom: "8px" }}>Jak hodnotíte kulturní a sportovní vyžití? (1–5)</li>
            <li style={{ marginBottom: "8px" }}>Váš věk, pohlaví, délka pobytu v Domažlicích</li>
          </ol>
        </div>
        <TipBox color="#22c55e">
          <strong>Metodická poznámka:</strong> V práci uveď typ dotazníku (strukturovaný, uzavřené + otevřené otázky), způsob sběru (osobně na ulici / online), velikost vzorku a způsob vyhodnocení (průměry, grafy).
        </TipBox>
      </Section>

      <Section title="3. Terénní pozorování">
        <p><strong>Co:</strong> Systematické pozorování stavu veřejných prostranství a infrastruktury</p>
        <p><strong>Na co se zaměřit:</strong></p>
        <ul style={{ paddingLeft: "20px" }}>
          <li style={{ marginBottom: "6px" }}>Stav komunikací a chodníků</li>
          <li style={{ marginBottom: "6px" }}>Dostupnost obchodů a služeb v centru vs. na okraji</li>
          <li style={{ marginBottom: "6px" }}>Stav veřejných prostranství (parky, náměstí, dětská hřiště)</li>
          <li style={{ marginBottom: "6px" }}>Dopravní infrastruktura (zastávky MHD, parkoviště, cyklostezky)</li>
          <li style={{ marginBottom: "6px" }}>Stav bytové zástavby (nová výstavba vs. zanedbané oblasti)</li>
        </ul>
      </Section>

      <Section title="4. Polostrukturované rozhovory (pro terén)">
        <p><strong>S kým:</strong> 3–5 rozhovorů s klíčovými aktéry</p>
        <ul style={{ paddingLeft: "20px" }}>
          <li style={{ marginBottom: "6px" }}>Představitel města (místostarosta, radní)</li>
          <li style={{ marginBottom: "6px" }}>Místní podnikatel</li>
          <li style={{ marginBottom: "6px" }}>Ředitel školy nebo lékaře</li>
          <li style={{ marginBottom: "6px" }}>Mladý člověk (18–25) — pohled na budoucnost v regionu</li>
          <li style={{ marginBottom: "6px" }}>Senior — srovnání minulost vs. současnost</li>
        </ul>
        <TipBox color="#fbbf24">
          <strong>Okruhy pro rozhovor:</strong> Jak vnímáte vývoj města za posledních 10 let? Co je podle vás největší problém? Jaké změny by zlepšily kvalitu života? Jak ovlivňuje hranice s Německem váš život?
        </TipBox>
      </Section>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// TAB 6: FORMÁLNÍ PRAVIDLA
// ════════════════════════════════════════════════════════════════
function FormaTab() {
  return (
    <div>
      <Section title="Základní formátování" defaultOpen={true}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          {[
            { label: "Font textu", value: "Times New Roman – 12" },
            { label: "Font nadpisů", value: "Arial – 12 až 16" },
            { label: "Řádkování", value: "1,5" },
            { label: "Zarovnání", value: "Do bloku" },
            { label: "Rozsah", value: "8–15 normostran" },
            { label: "Číslování stran", value: "Ano (titulní strana bez čísla)" },
            { label: "Úrovně nadpisů", value: "Max. 3" },
            { label: "Tisk", value: "Možno oboustranně" }
          ].map((item, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.04)", borderRadius: "10px", padding: "12px 16px", display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>{item.label}</span>
              <span style={{ color: "#60a5fa", fontSize: "14px", fontWeight: 600 }}>{item.value}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Struktura práce (povinné části)">
        <ol style={{ paddingLeft: "20px" }}>
          <li style={{ marginBottom: "8px" }}><strong>Titulní strana</strong> — název školy, název práce, jméno, ročník, rok, předmět</li>
          <li style={{ marginBottom: "8px" }}><strong>Obsah</strong> — s čísly stránek (u rozsáhlejších prací)</li>
          <li style={{ marginBottom: "8px" }}><strong>Úvod</strong> — problematika, cíle, struktura</li>
          <li style={{ marginBottom: "8px" }}><strong>Teoretická část</strong> — rešerše zdrojů, kritické hodnocení</li>
          <li style={{ marginBottom: "8px" }}><strong>Metodika</strong> — popis postupu výzkumu</li>
          <li style={{ marginBottom: "8px" }}><strong>Praktická/analytická část</strong> — vlastní zjištění, data, interpretace</li>
          <li style={{ marginBottom: "8px" }}><strong>Závěr</strong> — shrnutí, odpovědi na otázky, návrhy</li>
          <li style={{ marginBottom: "8px" }}><strong>Seznam použité literatury</strong> — samostatná stránka</li>
          <li style={{ marginBottom: "8px" }}><strong>Seznam internetových zdrojů</strong> — samostatná stránka</li>
        </ol>
      </Section>

      <Section title="Nejčastější chyby (varování z pravidel GJK)">
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {[
            { rule: "Zkratka s tečkou na konci věty", wrong: "Patří sem sport, kultura, atd..", right: "Patří sem sport, kultura, atd." },
            { rule: "Mezera před závorkou", wrong: "cestovní ruch(CR)", right: "cestovní ruch (CR)" },
            { rule: "Procenta", wrong: "7% obyvatel, sedmiprocentní", right: "7 % obyvatel, 7% (přídavné jméno)" },
            { rule: "Viz", wrong: "Viz.", right: "Viz (není zkratka, bez tečky)" },
            { rule: "Pevná mezera", wrong: "k nim (na konci řádku)", right: "k\u00a0nim (pevná mezera: Ctrl+Shift+Space)" },
            { rule: "Nadpis", wrong: "1. Úvod.", right: "1 Úvod (bez tečky za nadpisem)" },
            { rule: "Internetové odkazy", wrong: "Klikatelný hypertextový odkaz", right: "Prostá URL: https://www.czso.cz/" }
          ].map((item, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.04)", borderRadius: "10px", padding: "12px 16px" }}>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", marginBottom: "6px" }}>{item.rule}</div>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <div><span style={{ color: "#ef4444", fontSize: "13px" }}>✗ </span><span style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>{item.wrong}</span></div>
                <div><span style={{ color: "#22c55e", fontSize: "13px" }}>✓ </span><span style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px" }}>{item.right}</span></div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Obrázky, tabulky, grafy">
        <ul style={{ paddingLeft: "20px" }}>
          <li style={{ marginBottom: "8px" }}>Všechny musí mít <strong>název a číslo</strong> (Tab. 1, Graf 1, Obr. 1)</li>
          <li style={{ marginBottom: "8px" }}>Musí být <strong>propojené s textem</strong> — ne pouze ilustrativní</li>
          <li style={{ marginBottom: "8px" }}>U převzatých uvádět <strong>zdroj</strong></li>
          <li style={{ marginBottom: "8px" }}>Vysvětlivky do poznámky pod tabulkou</li>
        </ul>
        <CitationExample type="Vzor tabulky:" example={
          <div>
            Tab. 1: Srovnání vybraných indikátorů kvality života (2024)<br /><br />
            | město | IKŽ | nezaměstnanost | index stáří |<br />
            |---|---|---|---|<br />
            | Domažlice | 4,7 | 2,1 % | ... |<br />
            | Klatovy | 5,3 | ... | ... |<br /><br />
            zdroj: Obce v datech (2024), ČSÚ (2024)
          </div>
        } />
      </Section>

      <Section title="Hodnocení práce">
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 200px", background: "rgba(96,165,250,0.08)", borderRadius: "12px", padding: "16px", textAlign: "center" }}>
            <div style={{ color: "#60a5fa", fontSize: "36px", fontWeight: 800 }}>30 %</div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>Formální stránka</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", marginTop: "4px" }}>Formátování, citace, struktura, pravopis</div>
          </div>
          <div style={{ flex: "1 1 200px", background: "rgba(168,85,247,0.08)", borderRadius: "12px", padding: "16px", textAlign: "center" }}>
            <div style={{ color: "#a855f7", fontSize: "36px", fontWeight: 800 }}>70 %</div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>Obsahová stránka</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", marginTop: "4px" }}>Analýza, argumentace, zdroje, originalita</div>
          </div>
        </div>
      </Section>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// TAB 7: CHECKLIST
// ════════════════════════════════════════════════════════════════
function ChecklistTab() {
  return (
    <div>
      <div style={glassCard}>
        <h3 style={{ color: "#fff", fontSize: "18px", fontWeight: 700, marginTop: 0, marginBottom: "16px" }}>Postup psaní seminární práce</h3>
        <Checklist items={[
          "Vytvořit osnovu práce (kapitoly + podkapitoly)",
          "Nasbírat a prostudovat min. 5 odborných zdrojů (knihy, články, dipl. práce)",
          "Stáhnout data z ČSÚ pro okres Domažlice (demografie, zaměstnanost)",
          "Zjistit IKŽ skóre Domažlic na obcevdatech.cz a porovnat s dalšími městy",
          "Napsat teoretickou část — definice KŽ, indikátory, centrum-periferie",
          "Napsat charakteristiku Domažlic — poloha, demografie, ekonomika",
          "Napsat analytickou část — hodnocení KŽ podle indikátorů, srovnání měst",
          "Navrhnout metodiku terénního výzkumu — dotazník, pozorování, rozhovory",
          "Zformulovat výzkumné otázky a hypotézy pro terén",
          "Napsat úvod (cíl, otázky, struktura) a závěr (shrnutí, návrhy)",
          "Sestavit seznam literatury a internetových zdrojů (abecedně)",
          "Vytvořit titulní stranu dle vzoru GJK",
          "Zkontrolovat formátování (TNR 12, řádkování 1,5, blok, číslování)",
          "Zkontrolovat citace — je každý odkaz v textu i v seznamu literatury?",
          "Zkontrolovat tabulky a grafy — mají čísla, názvy, zdroje?",
          "Zkontrolovat pravopis a stylistiku — žádná dlouhá souvětí",
          "Nechat si práci přečíst někým jiným (peer review)",
          "Finální revize a odevzdání (deadline: 6. 3. 2026)"
        ]} />
      </div>

      <div style={{ ...glassCard, marginTop: "20px" }}>
        <h3 style={{ color: "#fff", fontSize: "18px", fontWeight: 700, marginTop: 0, marginBottom: "16px" }}>Kontrola formálních pravidel před odevzdáním</h3>
        <Checklist items={[
          "Titulní strana — škola, název, jméno, třída, rok, předmět",
          "Stránky číslované (první strana bez viditelného čísla)",
          "Font: Times New Roman 12, nadpisy Arial 12–16",
          "Řádkování 1,5, zarovnání do bloku",
          "Max. 3 úrovně nadpisů, číslované kapitoly",
          "Citace v harvardském systému (příjmení rok) — konzistentně",
          "Seznam literatury — abecedně dle příjmení, na samostatné stránce",
          "Seznam internetových zdrojů — prostá URL, samostatná stránka",
          "Žádné hypertextové odkazy v textu",
          "Pevné mezery za předložkami (k, v, s, z, u)",
          "Viz bez tečky, zkratky s tečkou na konci věty (jedna tečka)",
          "Obrázky/tabulky/grafy — číslo, název, zdroj, propojení s textem"
        ]} />
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// TAB 8: KVÍZ
// ════════════════════════════════════════════════════════════════
function KvizTab() {
  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: "20px", color: "rgba(255,255,255,0.6)", fontSize: "15px" }}>
        Ověř si znalosti pravidel psaní prací, kvality života a Domažlic
      </div>
      <QuizEngine questions={quizQuestions} accentColor="#60a5fa" />
    </div>
  );
}
