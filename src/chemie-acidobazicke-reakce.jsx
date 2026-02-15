// @title Acidobazické reakce – Příprava na test
// @subject Chemistry
// @topic Acidobazické reakce
// @template mixed

import { useState, useCallback, useMemo } from 'react';

/* ═══════════════════════════════════════════════════════════════
   QuizEngine (copied from assets/quiz-engine.jsx)
   ═══════════════════════════════════════════════════════════════ */
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

function QuizEngine({ questions, accentColor = "#22d3ee" }) {
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

  if (showResults) {
    const msg = pct >= 90 ? "Výborně! Máš to perfektně zvládnuté!" : pct >= 70 ? "Dobře! Téměř máš vše zvládnuté." : pct >= 50 ? "Mohlo by to být lepší, ale jdeš správným směrem." : "Potřebuješ více přípravy. Opakuj a bude to!";
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "280px" }}>
        <div style={{ textAlign: "center", ...glass, padding: "40px 48px" }}>
          <div style={{ color: "#fff", fontSize: "52px", fontWeight: 800, lineHeight: 1.1 }}>{score} / {shuffledQuestions.length}</div>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "22px", marginBottom: "16px" }}>{pct} %</div>
          <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "17px", lineHeight: 1.5, marginBottom: "24px", maxWidth: "340px", margin: "0 auto 24px" }}>{msg}</div>
          <button style={{ ...btnStyle, background: accentColor + "66", border: `1px solid ${accentColor}` }} onClick={restart}>Začít znovu</button>
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
              <div key={i} style={{ padding: "12px 16px", borderRadius: "12px", color: "#fff", cursor: "pointer", transition: "all 0.4s ease", display: "flex", alignItems: "center", gap: "10px", userSelect: "none", fontSize: "15px", background: bg, border }} onClick={() => isMulti ? toggleMulti(i) : handleSingleSelect(i)}>
                {isMulti && <span style={{ fontSize: "18px", minWidth: "20px", color: "rgba(255,255,255,0.7)" }}>{activeSet.includes(i) ? "☑" : "☐"}</span>}
                <span>{opt}</span>
              </div>
            );
          })}
        </div>
        {isMulti && !isRevealed && <button style={{ ...btnStyle, opacity: pendingMulti.length === 0 ? 0.4 : 1, marginTop: "12px" }} onClick={submitMulti} disabled={pendingMulti.length === 0}>Potvrdit</button>}
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

/* ═══════════════════════════════════════════════════════════════
   Shared styles
   ═══════════════════════════════════════════════════════════════ */
const ACCENT = "#22d3ee";
const ACCENT2 = "#a78bfa";
const glass = { background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", transition: "all 0.4s ease" };
const btnStyle = { padding: "10px 22px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", color: "#fff", cursor: "pointer", fontSize: "15px", transition: "all 0.4s ease" };

/* ═══════════════════════════════════════════════════════════════
   DATA — Quiz Questions
   ═══════════════════════════════════════════════════════════════ */
const quizQuestions = [
  {
    question: "Co je kyselina podle Arrheniovy teorie?",
    type: "single",
    options: [
      "Látka uvolňující H⁺ ve vodném roztoku",
      "Látka přijímající H⁺",
      "Donor elektronového páru",
      "Akceptor elektronového páru"
    ],
    correct: [0],
    explanation: "Arrhenius definuje kyselinu jako látku, která ve vodném roztoku uvolňuje vodíkové kationty H⁺. Např. HCl → H⁺ + Cl⁻.",
    tip: "Arrhenius = vodné roztoky, H⁺ a OH⁻"
  },
  {
    question: "Co je zásada podle Brønsted-Lowryho teorie?",
    type: "single",
    options: [
      "Akceptor (příjemce) protonu H⁺",
      "Donor (dárce) protonu H⁺",
      "Látka uvolňující OH⁻ ve vodě",
      "Akceptor elektronového páru"
    ],
    correct: [0],
    explanation: "Brønsted-Lowry definuje zásadu jako akceptor (příjemce) protonu H⁺. Tato definice je obecnější než Arrheniova — platí i mimo vodné roztoky.",
    tip: "Brønsted: kyselina = donor H⁺, zásada = akceptor H⁺"
  },
  {
    question: "Proč NH₃ (amoniak) nesplňuje Arrheniovu definici zásady?",
    type: "single",
    options: [
      "Ve svém skupenství neobsahuje OH⁻ skupinu",
      "Neobsahuje vodík",
      "Nerozpouští se ve vodě",
      "Nemá volné elektronové páry"
    ],
    correct: [0],
    explanation: "Arrhenius vyžaduje, aby zásada uvolňovala OH⁻ ionty. NH₃ ve svém vzorci nemá OH skupinu, proto podle Arrhenius není zásadou. Podle Brønsteda je však zásadou, protože přijímá H⁺: NH₃ + H⁺ → NH₄⁺."
  },
  {
    question: "Jaká je konjugovaná báze kyseliny sírové H₂SO₄?",
    type: "single",
    options: [
      "HSO₄⁻",
      "SO₄²⁻",
      "H₃SO₄⁺",
      "H₂S"
    ],
    correct: [0],
    explanation: "Konjugovaná báze vznikne odštěpením jednoho protonu H⁺ z kyseliny. H₂SO₄ → HSO₄⁻ + H⁺. (SO₄²⁻ by vznikl po odštěpení dvou protonů — to je 2. stupeň disociace.)",
    tip: "Konjugovaná báze = kyselina minus jeden H⁺"
  },
  {
    question: "Jaká je konjugovaná kyselina vody H₂O?",
    type: "single",
    options: [
      "H₃O⁺ (oxoniový kation)",
      "OH⁻ (hydroxidový anion)",
      "H₂ (vodík)",
      "O²⁻ (oxidový anion)"
    ],
    correct: [0],
    explanation: "Konjugovaná kyselina vznikne přijetím jednoho protonu H⁺. H₂O + H⁺ → H₃O⁺. Oxoniový (hydroxoniový) kation H₃O⁺ je konjugovanou kyselinou vody."
  },
  {
    question: "Které z následujících látek jsou amfolyty (mohou se chovat jako kyselina i zásada)?",
    type: "multi",
    options: [
      "HPO₄²⁻",
      "ClO₃⁻",
      "HS⁻",
      "NH₄⁺"
    ],
    correct: [0, 2],
    explanation: "HPO₄²⁻ může přijmout H⁺ (→ H₂PO₄⁻) i odštěpit H⁺ (→ PO₄³⁻). HS⁻ může přijmout H⁺ (→ H₂S) i odštěpit H⁺ (→ S²⁻). ClO₃⁻ nemá odštěpitelný H⁺. NH₄⁺ může jen odštěpit H⁺ (je kyselina).",
    tip: "Amfolyt = má H k odštěpení A ZÁROVEŇ může přijmout další H⁺"
  },
  {
    question: "Jaká je hodnota iontového součinu vody Kw při 25 °C?",
    type: "single",
    options: [
      "10⁻¹⁴",
      "10⁻⁷",
      "14",
      "10⁻¹"
    ],
    correct: [0],
    explanation: "Kw = [H₃O⁺] · [OH⁻] = 10⁻¹⁴ při 25 °C. V čisté vodě: [H₃O⁺] = [OH⁻] = 10⁻⁷ mol/dm³.",
    tip: "Kw = 10⁻¹⁴ → odtud pH + pOH = 14"
  },
  {
    question: "Jaké je pH roztoku, kde c(H₃O⁺) = 10⁻³ mol/dm³?",
    type: "single",
    options: [
      "3",
      "11",
      "0,001",
      "-3"
    ],
    correct: [0],
    explanation: "pH = −log[H₃O⁺] = −log(10⁻³) = 3. Roztok je kyselý (pH < 7)."
  },
  {
    question: "Jaké je pH roztoku, kde c(OH⁻) = 10⁻⁵ mol/dm³?",
    type: "single",
    options: [
      "9",
      "5",
      "14",
      "-5"
    ],
    correct: [0],
    explanation: "pOH = −log[OH⁻] = −log(10⁻⁵) = 5. pH = 14 − pOH = 14 − 5 = 9. Roztok je zásaditý (pH > 7)."
  },
  {
    question: "Jaký vztah platí při 25 °C pro pH a pOH?",
    type: "single",
    options: [
      "pH + pOH = 14",
      "pH + pOH = 7",
      "pH · pOH = 14",
      "pH − pOH = 0"
    ],
    correct: [0],
    explanation: "Z iontového součinu vody: Kw = [H₃O⁺]·[OH⁻] = 10⁻¹⁴. Logaritmováním: pH + pOH = 14 (při 25 °C)."
  },
  {
    question: "Které částice vznikají autoprotolýzou vody?",
    type: "multi",
    options: [
      "H₃O⁺ (oxoniový kation)",
      "OH⁻ (hydroxidový anion)",
      "H₂ (vodík)",
      "O₂ (kyslík)"
    ],
    correct: [0, 1],
    explanation: "Autoprotolýza vody: H₂O + H₂O ⇌ H₃O⁺ + OH⁻. Jedna molekula vody předá proton druhé. Nevzniká H₂ ani O₂ — to by byla elektrolýza."
  },
  {
    question: "Co se stane s pH roztoku, když koncentrace H₃O⁺ klesne 100×?",
    type: "single",
    options: [
      "pH se zvýší o 2",
      "pH se sníží o 2",
      "pH se zvýší o 100",
      "pH se nezmění"
    ],
    correct: [0],
    explanation: "Pokles 100× = dělení 10². pH = −log[H₃O⁺]. Pokud [H₃O⁺] klesne 10²×, pH se zvýší o log(10²) = 2.",
    tip: "Každý 10× pokles c(H₃O⁺) = pH se zvýší o 1"
  },
  {
    question: "Jaký typ reakce je: NaOH + HCl → NaCl + H₂O?",
    type: "single",
    options: [
      "Neutralizace",
      "Autoprotolýza",
      "Oxidace",
      "Redukce"
    ],
    correct: [0],
    explanation: "Neutralizace = reakce kyseliny se zásadou za vzniku soli a vody. Iontově: H⁺ + OH⁻ → H₂O."
  },
  {
    question: "Který výraz správně vyjadřuje disociační konstantu kyseliny octové CH₃COOH?",
    type: "single",
    options: [
      "Ka = [CH₃COO⁻]·[H₃O⁺] / [CH₃COOH]",
      "Ka = [CH₃COOH] / [CH₃COO⁻]·[H₃O⁺]",
      "Ka = [CH₃COO⁻] + [H₃O⁺]",
      "Ka = [CH₃COOH]·[H₂O]"
    ],
    correct: [0],
    explanation: "CH₃COOH + H₂O ⇌ CH₃COO⁻ + H₃O⁺. Ka = produkty / reaktanty = [CH₃COO⁻]·[H₃O⁺] / [CH₃COOH]. Voda se do Ka nezahrnuje."
  },
  {
    question: "V reakci NH₄⁺ + H₂O ⇌ NH₃ + H₃O⁺ se voda chová jako:",
    type: "single",
    options: [
      "Zásada (přijímá H⁺ od NH₄⁺)",
      "Kyselina (odevzdává H⁺)",
      "Amfolyt (ani jedno)",
      "Neutralizační činidlo"
    ],
    correct: [0],
    explanation: "NH₄⁺ odevzdává H⁺ vodě → H₂O + H⁺ → H₃O⁺. Voda přijímá proton, tedy se chová jako Brønstedova zásada."
  },
  {
    question: "V reakci F⁻ + H₂O ⇌ HF + OH⁻ se voda chová jako:",
    type: "single",
    options: [
      "Kyselina (odevzdává H⁺ fluoridovému aniontu)",
      "Zásada (přijímá H⁺)",
      "Neutrální rozpouštědlo",
      "Katalyzátor"
    ],
    correct: [0],
    explanation: "H₂O odevzdává proton F⁻ (→ HF) a sama se mění na OH⁻. Voda tedy odevzdává H⁺ = chová se jako Brønstedova kyselina. Proto je voda amfolyt — v různých reakcích se chová různě."
  },
  {
    question: "Jaká je rovnice autoprotolýzy kyseliny sírové?",
    type: "single",
    options: [
      "H₂SO₄ + H₂SO₄ ⇌ H₃SO₄⁺ + HSO₄⁻",
      "H₂SO₄ → 2H⁺ + SO₄²⁻",
      "H₂SO₄ + H₂O ⇌ HSO₄⁻ + H₃O⁺",
      "2H₂SO₄ → H₂ + 2SO₄²⁻"
    ],
    correct: [0],
    explanation: "Autoprotolýza = přenos H⁺ mezi dvěma stejnými molekulami. Jedna molekula H₂SO₄ odevzdá H⁺ druhé: H₂SO₄ + H₂SO₄ ⇌ H₃SO₄⁺ + HSO₄⁻."
  },
  {
    question: "Jaké je pH roztoku HCl o koncentraci c(HCl) = 0,001 mol/dm³?",
    type: "single",
    options: [
      "3",
      "1",
      "11",
      "0,001"
    ],
    correct: [0],
    explanation: "HCl je silná kyselina → úplná disociace: HCl → H⁺ + Cl⁻. c(H₃O⁺) = c(HCl) = 0,001 = 10⁻³. pH = −log(10⁻³) = 3."
  },
  {
    question: "Lewisova kyselina je definována jako:",
    type: "single",
    options: [
      "Akceptor elektronového páru",
      "Donor elektronového páru",
      "Donor protonu H⁺",
      "Akceptor protonu H⁺"
    ],
    correct: [0],
    explanation: "Lewis rozšířil definici: kyselina = akceptor elektronového páru (má volný/vakantní orbital). Báze = donor elektronového páru. Tato teorie je nejobecnější ze všech tří.",
    tip: "Lewis: kyselina = AKCEPTOR e⁻ páru (volný orbital), báze = DONOR e⁻ páru"
  },
  {
    question: "Kolik volných elektronových párů má molekula sulfanu (H₂S)?",
    type: "single",
    options: [
      "2",
      "0",
      "1",
      "3"
    ],
    correct: [0],
    explanation: "Síra v H₂S má 6 valenčních elektronů. Dva páry tvoří vazby S–H, zbývají 2 volné (nevazebné) elektronové páry."
  },
  {
    question: "V reakci FeCl₃ + Cl₂ → FeCl₄⁻ + Cl⁺ je FeCl₃:",
    type: "single",
    options: [
      "Lewisova kyselina (akceptor e⁻ páru)",
      "Lewisova báze (donor e⁻ páru)",
      "Brønstedova kyselina",
      "Brønstedova báze"
    ],
    correct: [0],
    explanation: "FeCl₃ přijímá elektronový pár od Cl₂ a tvoří FeCl₄⁻. Proto je FeCl₃ Lewisova kyselina (akceptor elektronového páru). Cl₂ je v této reakci Lewisova báze."
  },
  {
    question: "Při pH = 12, jaká je koncentrace hydroxidových aniontů c(OH⁻)?",
    type: "single",
    options: [
      "10⁻² mol/dm³",
      "10⁻¹² mol/dm³",
      "12 mol/dm³",
      "10² mol/dm³"
    ],
    correct: [0],
    explanation: "pH = 12 → pOH = 14 − 12 = 2 → c(OH⁻) = 10⁻² mol/dm³ = 0,01 mol/dm³."
  },
  {
    question: "Který z těchto iontů NENÍ amfolyt?",
    type: "single",
    options: [
      "NH₄⁺ (kation amonný)",
      "HPO₄²⁻ (hydrogenfosforečnanový)",
      "HS⁻ (hydrogensulfidový)",
      "HCO₃⁻ (hydrogenuhličitanový)"
    ],
    correct: [0],
    explanation: "NH₄⁺ může pouze odevzdat H⁺ (→ NH₃), ale nemůže snadno přijmout další H⁺. Proto není amfolyt, je to jen kyselina. Ostatní mohou jak přijmout, tak odevzdat H⁺."
  },
  {
    question: "Pro slabou kyselinu platí: čím větší hodnota Ka, tím:",
    type: "single",
    options: [
      "Silnější kyselina (více disociuje)",
      "Slabší kyselina (méně disociuje)",
      "Vyšší pH roztoku",
      "Ka nemá vliv na sílu kyseliny"
    ],
    correct: [0],
    explanation: "Ka = disociační konstanta kyseliny. Čím větší Ka, tím více kyselina disociuje (uvolňuje H⁺), a tím je silnější. Silné kyseliny (HCl, HNO₃) mají Ka → ∞."
  }
];

/* ═══════════════════════════════════════════════════════════════
   DATA — Flashcards
   ═══════════════════════════════════════════════════════════════ */
const flashcards = [
  { front: "Kyselina (Arrhenius)", back: "Látka, která ve vodném roztoku uvolňuje vodíkové kationty H⁺.\nPříklad: HCl → H⁺ + Cl⁻" },
  { front: "Zásada (Arrhenius)", back: "Látka, která ve vodném roztoku uvolňuje hydroxidové anionty OH⁻.\nPříklad: NaOH → Na⁺ + OH⁻" },
  { front: "Kyselina (Brønsted-Lowry)", back: "Donor (dárce) protonu H⁺.\nObecnější definice — platí i mimo vodné roztoky." },
  { front: "Zásada (Brønsted-Lowry)", back: "Akceptor (příjemce) protonu H⁺.\nPříklad: NH₃ + H⁺ → NH₄⁺ (NH₃ přijímá H⁺)" },
  { front: "Konjugovaný pár", back: "Kyselina a její konjugovaná báze se liší o jeden H⁺.\nPříklad: HCl / Cl⁻, H₂O / OH⁻, NH₄⁺ / NH₃" },
  { front: "Amfolyt", back: "Látka, která může být kyselina i zásada.\nPříklady: H₂O, HPO₄²⁻, HS⁻, HCO₃⁻, HSO₄⁻" },
  { front: "Autoprotolýza vody", back: "H₂O + H₂O ⇌ H₃O⁺ + OH⁻\nPřenos protonu mezi dvěma molekulami vody.\nKw = [H₃O⁺]·[OH⁻] = 10⁻¹⁴ (25 °C)" },
  { front: "pH", back: "pH = −log [H₃O⁺]\npH < 7 → kyselý roztok\npH = 7 → neutrální\npH > 7 → zásaditý roztok" },
  { front: "pOH", back: "pOH = −log [OH⁻]\npH + pOH = 14 (při 25 °C)\npOH < 7 → zásaditý, pOH > 7 → kyselý" },
  { front: "Disociační konstanta Ka", back: "Ka = [A⁻]·[H₃O⁺] / [HA]\nČím větší Ka → tím silnější kyselina.\nVoda se do Ka nezahrnuje." },
  { front: "Neutralizace", back: "Reakce kyseliny se zásadou → sůl + voda.\nH⁺ + OH⁻ → H₂O\nPříklad: NaOH + HCl → NaCl + H₂O" },
  { front: "Lewisova kyselina", back: "Akceptor elektronového páru.\nMá volný (vakantní) orbital.\nPříklady: H⁺, Fe³⁺, BF₃, AlCl₃" },
  { front: "Lewisova báze", back: "Donor elektronového páru.\nMá volný elektronový pár.\nPříklady: NH₃, H₂O, Cl⁻, F⁻" },
  { front: "Oxoniový kation H₃O⁺", back: "Vzniká přijetím protonu H⁺ molekulou vody.\nH₂O + H⁺ → H₃O⁺\nJe konjugovanou kyselinou vody.\nMá 1 volný elektronový pár." },
  { front: "Iontový součin vody Kw", back: "Kw = [H₃O⁺] · [OH⁻] = 10⁻¹⁴ (25 °C)\nV čisté vodě: [H₃O⁺] = [OH⁻] = 10⁻⁷ mol/dm³\npH čisté vody = 7" }
];

/* ═══════════════════════════════════════════════════════════════
   DATA — Worked Examples
   ═══════════════════════════════════════════════════════════════ */
const workedExamples = [
  {
    id: 1, difficulty: "easy", emoji: "✨",
    title: "Disociace HNO₃, NaOH a HF",
    problem: "Zapište disociaci uvedených látek, rozhodněte, která se chová jako kyselina a která jako zásada. Pojmenujte vzniklé ionty.",
    solution: [
      "HNO₃ ⇌ H⁺ + NO₃⁻  →  kyselina",
      "• H⁺ = kation vodíkový (vodíkový proton)",
      "• NO₃⁻ = anion dusičnanový",
      "",
      "NaOH ⇌ Na⁺ + OH⁻  →  zásada",
      "• Na⁺ = kation sodný",
      "• OH⁻ = anion hydroxidový",
      "",
      "HF ⇌ H⁺ + F⁻  →  kyselina",
      "• F⁻ = anion fluoridový",
      "",
      "Použitá teorie: Arrhenius — kyselina uvolňuje H⁺, zásada uvolňuje OH⁻."
    ]
  },
  {
    id: 2, difficulty: "medium", emoji: "⚡",
    title: "NH₃ a Arrhenius vs. Brønsted",
    problem: "Která z látek NH₃ a NH₄OH nesplňuje Arrheniovu teorii zásad? Proč? Objasněte její zásaditost dle Brønstedovy teorie.",
    solution: [
      "NH₃ (amoniak) — nesplňuje Arrheniovu teorii.",
      "Důvod: Ve svém skupenství neobsahuje OH⁻ skupinu,",
      "proto ho nemůže ve vodě uvolnit.",
      "",
      "Dle Brønsteda je NH₃ ZÁSADA = akceptor (příjemce) H⁺:",
      "NH₃ + H⁺ → NH₄⁺",
      "",
      "Amoniak přijímá proton a vzniká kation amonný NH₄⁺.",
      "Konjugovaný pár: NH₃ / NH₄⁺"
    ]
  },
  {
    id: 3, difficulty: "easy", emoji: "✨",
    title: "Konjugované kyseliny a báze",
    problem: "Vytvořte vzorce konjugovaných kyselin k částicím: H₂O, Br⁻, SO₄²⁻, HCO₃⁻.\nVytvořte vzorce konjugovaných zásad k částicím: H₂SO₄, HBr, H₃O⁺, H₃PO₄.",
    solution: [
      "Konjugovaná KYSELINA = původní částice + H⁺:",
      "• H₂O → H₃O⁺",
      "• Br⁻ → HBr",
      "• SO₄²⁻ → HSO₄⁻",
      "• HCO₃⁻ → H₂CO₃",
      "",
      "Konjugovaná BÁZE = původní částice − H⁺:",
      "• H₂SO₄ → HSO₄⁻",
      "• HBr → Br⁻",
      "• H₃O⁺ → H₂O",
      "• H₃PO₄ → H₂PO₄⁻",
      "",
      "Pravidlo: konjugovaný pár se liší vždy o jeden proton H⁺."
    ]
  },
  {
    id: 4, difficulty: "medium", emoji: "⚡",
    title: "Disociace s konstantou Ka",
    problem: "Zapište rovnici disociace ve vodě a odvoďte disociační konstantu Ka:\na) kyselina chloristá HClO₄\nb) kyselina chromová H₂CrO₄ (pozn.: v PL bylo místo dichromové omylem chromová)",
    solution: [
      "a) HClO₄ + H₂O ⇌ ClO₄⁻ + H₃O⁺",
      "",
      "   Ka = [ClO₄⁻] · [H₃O⁺] / [HClO₄]",
      "",
      "b) H₂CrO₄ — dvouprotonová kyselina, disociace po stupních:",
      "",
      "   1. stupeň: H₂CrO₄ + H₂O ⇌ HCrO₄⁻ + H₃O⁺",
      "   Ka₁ = [HCrO₄⁻] · [H₃O⁺] / [H₂CrO₄]",
      "",
      "   2. stupeň: HCrO₄⁻ + H₂O ⇌ CrO₄²⁻ + H₃O⁺",
      "   Ka₂ = [CrO₄²⁻] · [H₃O⁺] / [HCrO₄⁻]",
      "",
      "   Celkově: H₂CrO₄ + 2 H₂O ⇌ CrO₄²⁻ + 2 H₃O⁺",
      "",
      "Pozn.: Voda se do Ka nezahrnuje (je rozpouštědlem)."
    ]
  },
  {
    id: 5, difficulty: "medium", emoji: "⚡",
    title: "Konjugované páry v rovnici",
    problem: "Určete, zda se voda chová jako kyselina nebo zásada, a vyznačte konjugované páry:\na) NH₄⁺ + H₂O ⇌ NH₃ + H₃O⁺\nb) F⁻ + H₂O ⇌ HF + OH⁻",
    solution: [
      "a) NH₄⁺ + H₂O ⇌ NH₃ + H₃O⁺",
      "   • NH₄⁺ = kyselina₁ (odevzdává H⁺)",
      "   • H₂O = zásada₂ (přijímá H⁺ → H₃O⁺)",
      "   • NH₃ = konjugovaná báze₁ (pár s NH₄⁺)",
      "   • H₃O⁺ = konjugovaná kyselina₂ (pár s H₂O)",
      "   Voda se chová jako ZÁSADA.",
      "   Páry: NH₄⁺/NH₃ a H₂O/H₃O⁺",
      "",
      "b) F⁻ + H₂O ⇌ HF + OH⁻",
      "   • F⁻ = zásada₁ (přijímá H⁺ → HF)",
      "   • H₂O = kyselina₂ (odevzdává H⁺ → OH⁻)",
      "   • HF = konjugovaná kyselina₁ (pár s F⁻)",
      "   • OH⁻ = konjugovaná báze₂ (pár s H₂O)",
      "   Voda se chová jako KYSELINA.",
      "   Páry: F⁻/HF a H₂O/OH⁻",
      "",
      "→ Voda je AMFOLYT — v různých reakcích různá role."
    ]
  },
  {
    id: 6, difficulty: "medium", emoji: "⚡",
    title: "Autoprotolýza kyseliny sírové",
    problem: "Zapište rovnici autoprotolýzy H₂SO₄.",
    solution: [
      "Autoprotolýza = přenos H⁺ mezi dvěma stejnými molekulami.",
      "",
      "H₂SO₄ + H₂SO₄ ⇌ H₃SO₄⁺ + HSO₄⁻",
      "",
      "• Jedna molekula H₂SO₄ odevzdá H⁺ (→ HSO₄⁻) = kyselina",
      "• Druhá molekula H₂SO₄ přijme H⁺ (→ H₃SO₄⁺) = zásada",
      "",
      "Srovnej s vodou: H₂O + H₂O ⇌ H₃O⁺ + OH⁻",
      "Struktura je analogická — vždy vzniká kladný a záporný ion."
    ]
  },
  {
    id: 7, difficulty: "medium", emoji: "⚡",
    title: "Identifikace amfolytů",
    problem: "Zapište vzorce látek a určete, které jsou amfolyty:\na) anion hydrogenfosforečnanový\nb) anion chlorečnanový\nc) anion hydrogensulfidový\nd) amoniak\ne) kation amonný",
    solution: [
      "a) HPO₄²⁻ — AMFOLYT ✓",
      "   Může přijmout H⁺ → H₂PO₄⁻",
      "   Může odevzdat H⁺ → PO₄³⁻",
      "",
      "b) ClO₃⁻ — není amfolyt ✗",
      "   Nemá odštěpitelný H⁺ (může jen přijmout → HClO₃).",
      "",
      "c) HS⁻ — AMFOLYT ✓",
      "   Může přijmout H⁺ → H₂S",
      "   Může odevzdat H⁺ → S²⁻",
      "",
      "d) NH₃ — AMFOLYT ✓",
      "   Může přijmout H⁺ → NH₄⁺",
      "   Může odevzdat H⁺ → NH₂⁻",
      "",
      "e) NH₄⁺ — není amfolyt ✗",
      "   Může pouze odevzdat H⁺ → NH₃ (je jen kyselina)."
    ]
  },
  {
    id: 8, difficulty: "easy", emoji: "✨",
    title: "pH z koncentrace HCl",
    problem: "Určete pH roztoku kyseliny chlorovodíkové, když:\na) c(HCl) = 0,001 mol/dm³\nb) c(HCl) = 10⁻⁴ mol/dm³\nc) c(HCl) = 0,01 mol/dm³",
    solution: [
      "HCl je silná kyselina → úplná disociace:",
      "HCl → H⁺ + Cl⁻",
      "Proto: c(H₃O⁺) = c(HCl)",
      "",
      "a) c(HCl) = 0,001 = 10⁻³ mol/dm³",
      "   pH = −log(10⁻³) = 3",
      "",
      "b) c(HCl) = 10⁻⁴ mol/dm³",
      "   pH = −log(10⁻⁴) = 4",
      "",
      "c) c(HCl) = 0,01 = 10⁻² mol/dm³",
      "   pH = −log(10⁻²) = 2",
      "",
      "Pozn.: V testu je koncentrace zadána — nepočítáte ji!"
    ]
  },
  {
    id: 9, difficulty: "hard", emoji: "🔥",
    title: "Výpočet pH z hmotnosti NaOH",
    problem: "Na přípravu 20 dm³ roztoku hydroxidu sodného bylo naváženo 12,68 g pevné látky. Vypočítejte pH.",
    solution: [
      "Dáno: V = 20 dm³, m(NaOH) = 12,68 g",
      "",
      "1) Molární hmotnost NaOH:",
      "   M = 23 + 16 + 1 = 40 g/mol",
      "",
      "2) Látkové množství:",
      "   n = m / M = 12,68 / 40 = 0,317 mol",
      "",
      "3) Látková koncentrace:",
      "   c = n / V = 0,317 / 20 = 0,01585 mol/dm³",
      "",
      "4) NaOH je silná zásada → úplná disociace:",
      "   NaOH → Na⁺ + OH⁻",
      "   c(OH⁻) = c(NaOH) = 0,01585 mol/dm³",
      "",
      "5) Výpočet pOH:",
      "   pOH = −log(0,01585) = −log(1,585 · 10⁻²)",
      "   pOH = 2 − log(1,585) ≈ 2 − 0,2 = 1,8",
      "",
      "6) Výpočet pH:",
      "   pH = 14 − pOH = 14 − 1,8 = 12,2",
      "",
      "pH = 12,2 (roztok je silně zásaditý)"
    ]
  },
  {
    id: 10, difficulty: "easy", emoji: "✨",
    title: "Neutralizace — příprava NaF",
    problem: "V zubních pastách se vyskytuje fluorid sodný. Zapište rovnici přípravy NaF a pojmenujte typ reakce.",
    solution: [
      "NaOH + HF → NaF + H₂O",
      "",
      "Typ reakce: NEUTRALIZACE",
      "(reakce zásady s kyselinou za vzniku soli a vody)",
      "",
      "Iontový zápis:",
      "Na⁺ + OH⁻ + H⁺ + F⁻ → Na⁺ + F⁻ + H₂O",
      "",
      "Zkrácený iontový zápis:",
      "OH⁻ + H⁺ → H₂O",
      "",
      "Sůl: NaF = fluorid sodný"
    ]
  }
];

/* ═══════════════════════════════════════════════════════════════
   DATA — Theory Sections
   ═══════════════════════════════════════════════════════════════ */
const theorySections = [
  {
    title: "Arrheniova teorie",
    icon: "⚗️",
    items: [
      { label: "Kyselina", text: "Látka, která ve vodném roztoku uvolňuje vodíkové kationty H⁺." },
      { label: "Zásada", text: "Látka, která ve vodném roztoku uvolňuje hydroxidové anionty OH⁻." },
      { label: "Omezení", text: "Platí POUZE pro vodné roztoky. Neumí vysvětlit zásaditost NH₃ (amoniak neobsahuje OH⁻ skupinu)." },
      { label: "Neutralizace", text: "Podstata neutralizace podle Arrhenius: reakce H⁺ + OH⁻ → H₂O (vznik vody z iontů)." }
    ]
  },
  {
    title: "Brønsted-Lowryho teorie",
    icon: "🔬",
    items: [
      { label: "Kyselina", text: "Donor (dárce) protonu H⁺. Odevzdává proton jiné částici." },
      { label: "Zásada", text: "Akceptor (příjemce) protonu H⁺. Přijímá proton od jiné částice." },
      { label: "Výhoda", text: "Obecnější než Arrhenius — platí i mimo vodné roztoky. Vysvětluje zásaditost NH₃: NH₃ + H⁺ → NH₄⁺ (přijímá proton)." },
      { label: "Klíčový princip", text: "Každá acidobazická reakce = přenos protonu H⁺ od kyseliny k zásadě." }
    ]
  },
  {
    title: "Konjugované páry",
    icon: "🔗",
    items: [
      { label: "Definice", text: "Konjugovaný pár = kyselina a její konjugovaná báze (nebo naopak). Liší se o jeden proton H⁺." },
      { label: "Kyselina → báze", text: "Kyselina odevzdá H⁺ → vznikne konjugovaná báze. Např. HCl → Cl⁻, H₂O → OH⁻, NH₄⁺ → NH₃" },
      { label: "Báze → kyselina", text: "Báze přijme H⁺ → vznikne konjugovaná kyselina. Např. NH₃ → NH₄⁺, H₂O → H₃O⁺, OH⁻ → H₂O" },
      { label: "Příklad v rovnici", text: "NH₄⁺ + H₂O ⇌ NH₃ + H₃O⁺ → Páry: NH₄⁺/NH₃ a H₂O/H₃O⁺" }
    ]
  },
  {
    title: "Amfolyty",
    icon: "⚖️",
    items: [
      { label: "Definice", text: "Amfolyt = látka, která se může chovat jako kyselina I jako zásada (může odštěpit i přijmout H⁺)." },
      { label: "Nejznámější", text: "VODA (H₂O) — jako kyselina: H₂O → OH⁻ + H⁺; jako zásada: H₂O + H⁺ → H₃O⁺" },
      { label: "Další příklady", text: "HPO₄²⁻, HS⁻, HCO₃⁻, HSO₄⁻, NH₃ (může odevzdat i přijmout H⁺)" },
      { label: "Jak poznat", text: "Musí mít odštěpitelný H⁺ A zároveň musí být schopen přijmout další H⁺. ClO₃⁻ nemá H → není amfolyt. NH₄⁺ může jen odevzdat → není amfolyt." }
    ]
  },
  {
    title: "Autoprotolýza",
    icon: "🔄",
    items: [
      { label: "Definice", text: "Přenos protonu H⁺ mezi dvěma stejnými molekulami. Jedna se chová jako kyselina, druhá jako zásada." },
      { label: "Voda", text: "H₂O + H₂O ⇌ H₃O⁺ + OH⁻ (iontový součin Kw = 10⁻¹⁴ při 25 °C)" },
      { label: "Kyselina sírová", text: "H₂SO₄ + H₂SO₄ ⇌ H₃SO₄⁺ + HSO₄⁻" },
      { label: "Amoniak a kys. octová", text: "NH₃ + NH₃ ⇌ NH₄⁺ + NH₂⁻\nCH₃COOH + CH₃COOH ⇌ CH₃COOH₂⁺ + CH₃COO⁻" }
    ]
  },
  {
    title: "pH a pOH",
    icon: "📊",
    items: [
      { label: "pH", text: "pH = −log [H₃O⁺]. Míra kyselosti roztoku." },
      { label: "pOH", text: "pOH = −log [OH⁻]. Míra zásaditosti roztoku." },
      { label: "Vztah", text: "pH + pOH = 14 (při 25 °C). Odtud: pH = 14 − pOH a naopak." },
      { label: "Stupnice", text: "pH < 7 → kyselý roztok | pH = 7 → neutrální | pH > 7 → zásaditý roztok" },
      { label: "Koncentrace", text: "[H₃O⁺] = 10⁻ᵖᴴ a [OH⁻] = 10⁻ᵖᴼᴴ. Např. pH = 3 → [H₃O⁺] = 10⁻³ mol/dm³" },
      { label: "Změny", text: "10× pokles [H₃O⁺] → pH +1. 100× pokles → pH +2. 1000× nárůst [H₃O⁺] → pH −3." }
    ]
  },
  {
    title: "Disociační konstanta Ka, Kb",
    icon: "📐",
    items: [
      { label: "Ka (kyseliny)", text: "Pro HA + H₂O ⇌ A⁻ + H₃O⁺:\nKa = [A⁻]·[H₃O⁺] / [HA]\nVoda se do výrazu nezahrnuje (je rozpouštědlem)." },
      { label: "Kb (zásady)", text: "Pro B + H₂O ⇌ BH⁺ + OH⁻:\nKb = [BH⁺]·[OH⁻] / [B]" },
      { label: "Síla", text: "Čím větší Ka → tím silnější kyselina (více disociuje).\nČím větší Kb → tím silnější zásada." },
      { label: "Vztah Ka · Kb", text: "Pro konjugovaný pár: Ka · Kb = Kw = 10⁻¹⁴\nSilná kyselina → slabá konjugovaná báze (malé Kb) a naopak." }
    ]
  },
  {
    title: "Neutralizace a síla kyselin",
    icon: "⚡",
    items: [
      { label: "Neutralizace", text: "Kyselina + zásada → sůl + voda.\nIontově: H⁺ + OH⁻ → H₂O\nPříklad: NaOH + HCl → NaCl + H₂O" },
      { label: "Silné kyseliny", text: "Úplná disociace: HCl, HBr, HI, HNO₃, H₂SO₄, HClO₄.\nc(H₃O⁺) = c(kyseliny) → přímý výpočet pH." },
      { label: "Silné zásady", text: "Úplná disociace: NaOH, KOH, Ca(OH)₂, Ba(OH)₂.\nc(OH⁻) = c(zásady) → pOH → pH = 14 − pOH." },
      { label: "Slabé kyseliny", text: "Částečná disociace: CH₃COOH, HF, H₂CO₃, H₃PO₄.\nc(H₃O⁺) < c(kyseliny), nutno použít Ka." }
    ]
  },
  {
    title: "Lewisova teorie ⭐ bonus",
    icon: "🧲",
    items: [
      { label: "Upozornění", text: "Lewisova teorie dosud nebyla probírána v hodině. Na testu nemusí být, ale je v pracovním listu." },
      { label: "Lewis kyselina", text: "Akceptor elektronového páru. Poskytuje volný (vakantní) orbital.\nPříklady: H⁺, Fe³⁺, BF₃, AlCl₃, FeCl₃" },
      { label: "Lewis báze", text: "Donor elektronového páru. Má volný elektronový pár.\nPříklady: NH₃, H₂O, Cl⁻, F⁻, OH⁻" },
      { label: "Příklady reakcí", text: "FeCl₃ + Cl₂ → FeCl₄⁻ + Cl⁺ (FeCl₃ = LK, Cl₂ = LB)\nH⁺ + H₂O → H₃O⁺ (H⁺ = LK, H₂O = LB)" },
      { label: "Elektrofil", text: "Částice s volným (vakantním) orbitalem, která přijímá elektronový pár = Lewisova kyselina. Např. H⁺, Al³⁺." }
    ]
  }
];

/* ═══════════════════════════════════════════════════════════════
   Components
   ═══════════════════════════════════════════════════════════════ */

function Collapsible({ title, children, defaultOpen = false, badge }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ ...glass, padding: 0, marginBottom: "12px", overflow: "hidden" }}>
      <div onClick={() => setOpen(!open)} style={{ padding: "16px 20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "background 0.4s ease", background: open ? "rgba(255,255,255,0.03)" : "transparent" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {badge && <span style={{ fontSize: "12px", padding: "2px 8px", borderRadius: "8px", background: badge === "✨" ? "rgba(34,197,94,0.2)" : badge === "⚡" ? "rgba(251,191,36,0.2)" : "rgba(239,68,68,0.2)", color: badge === "✨" ? "#86efac" : badge === "⚡" ? "#fbbf24" : "#fca5a5" }}>{badge === "✨" ? "Easy ✨" : badge === "⚡" ? "Medium ⚡" : "Hard 🔥"}</span>}
          <span style={{ color: "#fff", fontSize: "16px", fontWeight: 600 }}>{title}</span>
        </div>
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "20px", transition: "transform 0.4s ease", transform: open ? "rotate(180deg)" : "rotate(0)" }}>▾</span>
      </div>
      {open && <div style={{ padding: "0 20px 20px", animation: "fadeIn 0.4s ease" }}>{children}</div>}
    </div>
  );
}

function TheoryTab() {
  const [activeSection, setActiveSection] = useState(0);
  return (
    <div style={{ maxWidth: "780px", margin: "0 auto" }}>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px", justifyContent: "center" }}>
        {theorySections.map((s, i) => (
          <button key={i} onClick={() => setActiveSection(i)} style={{ padding: "8px 16px", borderRadius: "20px", border: i === activeSection ? `1px solid ${ACCENT}` : "1px solid rgba(255,255,255,0.12)", background: i === activeSection ? ACCENT + "22" : "rgba(255,255,255,0.04)", color: i === activeSection ? ACCENT : "rgba(255,255,255,0.7)", cursor: "pointer", fontSize: "13px", transition: "all 0.4s ease", whiteSpace: "nowrap" }}>
            {s.icon} {s.title}
          </button>
        ))}
      </div>
      <div style={{ ...glass, padding: "24px" }}>
        <h2 style={{ color: "#fff", fontSize: "22px", fontWeight: 700, marginBottom: "20px", fontFamily: "'Audiowide', cursive" }}>
          {theorySections[activeSection].icon} {theorySections[activeSection].title}
        </h2>
        {theorySections[activeSection].items.map((item, i) => (
          <div key={i} style={{ marginBottom: "16px", padding: "14px 18px", borderRadius: "14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ color: ACCENT, fontSize: "14px", fontWeight: 700, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{item.label}</div>
            <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "15px", lineHeight: 1.7, whiteSpace: "pre-line" }}>{item.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExamplesTab() {
  return (
    <div style={{ maxWidth: "780px", margin: "0 auto" }}>
      <div style={{ ...glass, padding: "16px 20px", marginBottom: "16px", textAlign: "center" }}>
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>
          📝 Příklady vycházejí z pracovního listu od profesorky a učebnice (str. 99). Řešení se zobrazí kliknutím.
        </div>
      </div>
      {workedExamples.map(ex => (
        <Collapsible key={ex.id} title={`${ex.id}. ${ex.title}`} badge={ex.emoji}>
          <div style={{ marginBottom: "16px" }}>
            <div style={{ color: ACCENT, fontSize: "13px", fontWeight: 700, marginBottom: "6px", textTransform: "uppercase" }}>Zadání</div>
            <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "15px", lineHeight: 1.6, whiteSpace: "pre-line" }}>{ex.problem}</div>
          </div>
          <Collapsible title="🔓 Zobrazit řešení" defaultOpen={false}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", lineHeight: 1.8, color: "rgba(255,255,255,0.85)" }}>
              {ex.solution.map((line, i) => (
                <div key={i} style={{ minHeight: line === "" ? "12px" : "auto", color: line.startsWith("Pozn") || line.startsWith("→") ? "#fbbf24" : line.includes("AMFOLYT ✓") || line.includes("pH =") || line.includes("pOH =") ? "#86efac" : "rgba(255,255,255,0.85)" }}>
                  {line}
                </div>
              ))}
            </div>
          </Collapsible>
        </Collapsible>
      ))}
    </div>
  );
}

function FlashcardsTab() {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = flashcards[idx];
  const go = (dir) => { setFlipped(false); setTimeout(() => setIdx(i => (i + dir + flashcards.length) % flashcards.length), 150); };
  return (
    <div style={{ maxWidth: "560px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>Kartička {idx + 1} / {flashcards.length} — klikni pro otočení</div>
      <div onClick={() => setFlipped(!flipped)} style={{ width: "100%", minHeight: "260px", perspective: "1000px", cursor: "pointer" }}>
        <div style={{ position: "relative", width: "100%", minHeight: "260px", transition: "transform 0.4s ease", transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0)" }}>
          <div style={{ ...glass, padding: "32px 28px", position: "absolute", width: "100%", minHeight: "260px", backfaceVisibility: "hidden", display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", marginBottom: "12px", textTransform: "uppercase" }}>Pojem</div>
              <div style={{ color: "#fff", fontSize: "24px", fontWeight: 700, fontFamily: "'Audiowide', cursive" }}>{card.front}</div>
            </div>
          </div>
          <div style={{ ...glass, padding: "32px 28px", position: "absolute", width: "100%", minHeight: "260px", backfaceVisibility: "hidden", transform: "rotateY(180deg)", display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box", background: "rgba(34,211,238,0.06)", border: `1px solid ${ACCENT}33` }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", marginBottom: "12px", textTransform: "uppercase" }}>Definice</div>
              <div style={{ color: "rgba(255,255,255,0.9)", fontSize: "16px", lineHeight: 1.7, whiteSpace: "pre-line", fontFamily: "'JetBrains Mono', monospace" }}>{card.back}</div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
        {flashcards.map((_, i) => (
          <div key={i} onClick={() => { setFlipped(false); setIdx(i); }} style={{ width: "18px", height: "18px", borderRadius: "50%", cursor: "pointer", background: i === idx ? ACCENT : "#4b5563", transition: "background 0.4s ease" }} />
        ))}
      </div>
      <div style={{ display: "flex", gap: "16px" }}>
        <button style={btnStyle} onClick={() => go(-1)}>← Předchozí</button>
        <button style={btnStyle} onClick={() => go(1)}>Další →</button>
      </div>
    </div>
  );
}

function FormulaTab() {
  const groups = [
    {
      title: "pH a pOH",
      formulas: [
        "pH = −log [H₃O⁺]",
        "pOH = −log [OH⁻]",
        "pH + pOH = 14  (při 25 °C)",
        "[H₃O⁺] = 10⁻ᵖᴴ",
        "[OH⁻] = 10⁻ᵖᴼᴴ"
      ]
    },
    {
      title: "Iontový součin vody",
      formulas: [
        "Kw = [H₃O⁺] · [OH⁻] = 10⁻¹⁴  (25 °C)",
        "V čisté vodě: [H₃O⁺] = [OH⁻] = 10⁻⁷ mol/dm³",
        "Ka · Kb = Kw  (pro konjugovaný pár)"
      ]
    },
    {
      title: "Disociační konstanty",
      formulas: [
        "Ka = [A⁻] · [H₃O⁺] / [HA]",
        "Kb = [BH⁺] · [OH⁻] / [B]",
        "Čím větší Ka → silnější kyselina",
        "Čím větší Kb → silnější zásada",
        "Voda se do Ka/Kb NEZAHRNUJE"
      ]
    },
    {
      title: "Látková koncentrace",
      formulas: [
        "c = n / V   [mol/dm³]",
        "n = m / M   [mol]",
        "V testu: c je zadána, nepočítáte ji!"
      ]
    },
    {
      title: "Teorie — shrnutí",
      formulas: [
        "Arrhenius: kys. = uvolňuje H⁺, zás. = uvolňuje OH⁻ (jen vodné r.)",
        "Brønsted: kys. = donor H⁺, zás. = akceptor H⁺",
        "Lewis: kys. = akceptor e⁻ páru, báze = donor e⁻ páru",
        "Konjug. pár: liší se o jeden H⁺",
        "Amfolyt: může být kys. i zás. (H₂O, HSO₄⁻, HCO₃⁻, HS⁻, HPO₄²⁻)"
      ]
    },
    {
      title: "Silné kyseliny a zásady",
      formulas: [
        "Silné kyseliny: HCl, HBr, HI, HNO₃, H₂SO₄, HClO₄",
        "Silné zásady: NaOH, KOH, Ca(OH)₂, Ba(OH)₂",
        "Silné = úplná disociace → c(H₃O⁺) = c(kys.)",
        "Slabé = částečná disociace → nutno použít Ka/Kb"
      ]
    },
    {
      title: "Autoprotolýza — vzorce",
      formulas: [
        "H₂O + H₂O ⇌ H₃O⁺ + OH⁻",
        "H₂SO₄ + H₂SO₄ ⇌ H₃SO₄⁺ + HSO₄⁻",
        "NH₃ + NH₃ ⇌ NH₄⁺ + NH₂⁻",
        "CH₃COOH + CH₃COOH ⇌ CH₃COOH₂⁺ + CH₃COO⁻"
      ]
    }
  ];
  return (
    <div style={{ maxWidth: "780px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px" }}>
      {groups.map((g, i) => (
        <div key={i} style={{ ...glass, padding: "20px" }}>
          <div style={{ color: ACCENT, fontSize: "14px", fontWeight: 700, marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{g.title}</div>
          {g.formulas.map((f, j) => (
            <div key={j} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: f.startsWith("Čím") || f.startsWith("V testu") || f.startsWith("Silné =") || f.startsWith("Slabé =") || f.startsWith("Voda se") ? "#fbbf24" : "rgba(255,255,255,0.85)", lineHeight: 1.8, paddingLeft: f.startsWith("•") ? "12px" : "0" }}>
              {f}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Main App
   ═══════════════════════════════════════════════════════════════ */
const tabs = [
  { id: "theory", label: "Teorie", icon: "📖" },
  { id: "examples", label: "Příklady", icon: "📝" },
  { id: "quiz", label: "Kvíz", icon: "❓" },
  { id: "flashcards", label: "Kartičky", icon: "🃏" },
  { id: "formulas", label: "Vzorce", icon: "📐" }
];

export default function App() {
  const [activeTab, setActiveTab] = useState("theory");

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a1a", fontFamily: "'Exo 2', sans-serif", color: "#fff", position: "relative", overflow: "hidden" }}>
      {/* Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;600;700;800&family=Audiowide&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes gridMove { from { transform: perspective(500px) rotateX(60deg) translateY(0); } to { transform: perspective(500px) rotateX(60deg) translateY(50px); } }
        @keyframes sunPulse { 0%, 100% { box-shadow: 0 0 80px rgba(34,211,238,0.3), 0 0 160px rgba(167,139,250,0.15); } 50% { box-shadow: 0 0 120px rgba(34,211,238,0.5), 0 0 200px rgba(167,139,250,0.25); } }
        @keyframes float1 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(30px, -40px); } }
        @keyframes float2 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-20px, 30px); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button:disabled { opacity: 0.35; cursor: not-allowed; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
      `}</style>

      {/* Synthwave background */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
        {/* Grid floor */}
        <div style={{ position: "absolute", bottom: 0, left: "-50%", right: "-50%", height: "45vh", background: `repeating-linear-gradient(90deg, ${ACCENT}08 0, ${ACCENT}08 1px, transparent 1px, transparent 50px), repeating-linear-gradient(0deg, ${ACCENT}08 0, ${ACCENT}08 1px, transparent 1px, transparent 50px)`, animation: "gridMove 4s linear infinite", transformOrigin: "bottom center" }} />
        {/* Neon sun */}
        <div style={{ position: "absolute", top: "8%", left: "50%", transform: "translateX(-50%)", width: "200px", height: "200px", borderRadius: "50%", background: `radial-gradient(circle, ${ACCENT}33, ${ACCENT2}11, transparent 70%)`, animation: "sunPulse 6s ease-in-out infinite" }} />
        {/* Floating particles */}
        <div style={{ position: "absolute", top: "20%", left: "10%", width: "120px", height: "120px", borderRadius: "50%", background: `radial-gradient(circle, ${ACCENT}15, transparent 70%)`, filter: "blur(30px)", animation: "float1 15s ease-in-out infinite" }} />
        <div style={{ position: "absolute", top: "60%", right: "15%", width: "150px", height: "150px", borderRadius: "50%", background: `radial-gradient(circle, ${ACCENT2}12, transparent 70%)`, filter: "blur(40px)", animation: "float2 18s ease-in-out infinite" }} />
        <div style={{ position: "absolute", top: "40%", left: "60%", width: "80px", height: "80px", borderRadius: "50%", background: `radial-gradient(circle, ${ACCENT}10, transparent 70%)`, filter: "blur(20px)", animation: "float1 12s ease-in-out infinite reverse" }} />
      </div>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: "960px", margin: "0 auto", padding: "20px 16px 60px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <h1 style={{ fontFamily: "'Audiowide', cursive", fontSize: "clamp(22px, 5vw, 32px)", background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "8px" }}>
            ⚗️ Acidobazické reakce
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>Kompletní příprava na pondělní test</p>
        </div>

        {/* Tab navigation */}
        <div style={{ display: "flex", gap: "6px", justifyContent: "center", flexWrap: "wrap", marginBottom: "24px" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: "10px 18px", borderRadius: "24px", border: activeTab === t.id ? `1px solid ${ACCENT}` : "1px solid rgba(255,255,255,0.1)", background: activeTab === t.id ? ACCENT + "20" : "rgba(255,255,255,0.04)", color: activeTab === t.id ? ACCENT : "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: "14px", fontWeight: activeTab === t.id ? 700 : 400, transition: "all 0.4s ease", fontFamily: "'Exo 2', sans-serif", whiteSpace: "nowrap" }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ animation: "fadeIn 0.5s ease" }} key={activeTab}>
          {activeTab === "theory" && <TheoryTab />}
          {activeTab === "examples" && <ExamplesTab />}
          {activeTab === "quiz" && <QuizEngine questions={quizQuestions} accentColor={ACCENT} />}
          {activeTab === "flashcards" && <FlashcardsTab />}
          {activeTab === "formulas" && <FormulaTab />}
        </div>
      </div>
    </div>
  );
}
