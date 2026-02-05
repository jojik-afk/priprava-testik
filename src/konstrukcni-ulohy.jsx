// @title Konstrukční úlohy
// @subject Math
// @topic Konstrukční úlohy - trojúhelníky a čtyřúhelníky
// @template practice

import { useState, useCallback, useMemo } from 'react';

// ══════════════════════════════════════════════════════════════════════════════
// QUIZ ENGINE (from base.md spec) - with randomized options
// ══════════════════════════════════════════════════════════════════════════════

// Shuffle array using Fisher-Yates algorithm
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Shuffle options for each question and update correct indices
function shuffleQuestions(questions) {
  return questions.map(q => {
    // Create array of indices and shuffle them
    const indices = q.options.map((_, i) => i);
    const shuffledIndices = shuffleArray(indices);

    // Reorder options according to shuffled indices
    const shuffledOptions = shuffledIndices.map(i => q.options[i]);

    // Map old correct indices to new positions
    const newCorrect = q.correct.map(oldIdx => shuffledIndices.indexOf(oldIdx));

    return {
      ...q,
      options: shuffledOptions,
      correct: newCorrect
    };
  });
}

function QuizEngine({ questions, accentColor = "#a855f7" }) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState({});
  const [pendingMulti, setPendingMulti] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [shuffleKey, setShuffleKey] = useState(0); // Key to trigger re-shuffle

  // Shuffle questions when component mounts or shuffleKey changes
  const shuffledQuestions = useMemo(() => {
    return shuffleQuestions(questions);
  }, [questions, shuffleKey]);

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
    setPendingMulti(prev =>
      prev.includes(optionIdx)
        ? prev.filter(i => i !== optionIdx)
        : [...prev, optionIdx]
    );
  }, [isRevealed]);

  const submitMulti = useCallback(() => {
    if (pendingMulti.length === 0) return;
    setAnswers(prev => ({ ...prev, [idx]: [...pendingMulti] }));
    setRevealed(prev => ({ ...prev, [idx]: true }));
  }, [idx, pendingMulti]);

  const restart = useCallback(() => {
    setIdx(0);
    setAnswers({});
    setRevealed({});
    setPendingMulti([]);
    setShowResults(false);
    setShuffleKey(k => k + 1); // Trigger new shuffle
  }, []);

  function arrEqual(a, b) {
    if (!a || !b) return false;
    const sa = [...a].sort((x, y) => x - y);
    const sb = [...b].sort((x, y) => x - y);
    return sa.length === sb.length && sa.every((v, i) => v === sb[i]);
  }

  if (showResults) {
    const msg =
      pct >= 90 ? "Vynikající! Máš konstrukční úlohy zvládnuté!"
      : pct >= 70 ? "Dobře! Téměř zvládáš vše."
      : pct >= 50 ? "Mohlo by to být lepší. Opakuj si teorii."
      : "Potřebuješ více přípravy. Prostuduj si znovu teorii!";

    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "280px" }}>
        <div style={{ textAlign: "center", background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "24px", padding: "40px 48px" }}>
          <div style={{ color: "#fff", fontSize: "52px", fontWeight: 800, lineHeight: 1.1 }}>{score} / {shuffledQuestions.length}</div>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "22px", marginBottom: "16px" }}>{pct} %</div>
          <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "17px", lineHeight: 1.5, marginBottom: "24px", maxWidth: "340px", margin: "0 auto 24px" }}>{msg}</div>
          <button style={{ padding: "10px 22px", background: accentColor + "66", border: `1px solid ${accentColor}`, borderRadius: "10px", color: "#fff", cursor: "pointer", fontSize: "15px" }} onClick={restart}>
            Začít znovu
          </button>
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
          return (
            <div
              key={i}
              onClick={() => goTo(i)}
              title={`Otázka ${i + 1}`}
              style={{ width: "22px", height: "22px", borderRadius: "50%", cursor: "pointer", transition: "background 0.4s ease", background: bg }}
            />
          );
        })}
      </div>

      <div style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "24px", transition: "all 0.4s ease" }}>
        <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", marginBottom: "6px" }}>Otázka {idx + 1} / {shuffledQuestions.length}</div>
        <div style={{ color: "#fff", fontSize: "18px", fontWeight: 600, lineHeight: 1.5, marginBottom: "20px" }}>{q.question}</div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
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
              <div
                key={i}
                style={{ padding: "12px 16px", borderRadius: "12px", color: "#fff", cursor: "pointer", transition: "all 0.4s ease", display: "flex", alignItems: "center", gap: "10px", userSelect: "none", fontSize: "15px", background: bg, border }}
                onClick={() => isMulti ? toggleMulti(i) : handleSingleSelect(i)}
              >
                {isMulti && <span style={{ fontSize: "18px", minWidth: "20px", color: "rgba(255,255,255,0.7)" }}>{activeSet.includes(i) ? "☑" : "☐"}</span>}
                <span>{opt}</span>
              </div>
            );
          })}
        </div>

        {isMulti && !isRevealed && (
          <button
            style={{ marginTop: "12px", padding: "10px 22px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", color: "#fff", cursor: "pointer", fontSize: "15px", opacity: pendingMulti.length === 0 ? 0.4 : 1 }}
            onClick={submitMulti}
            disabled={pendingMulti.length === 0}
          >
            Potvrdít
          </button>
        )}

        {isRevealed && (
          <div style={{ marginTop: "20px", padding: "16px", borderRadius: "14px", border: `1px solid ${isCorrect ? "#22c55e" : "#ef4444"}`, background: "rgba(255,255,255,0.03)" }}>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: "16px", marginBottom: "8px" }}>{isCorrect ? "Správně!" : "Špatně"}</div>
            {!isCorrect && (
              <div style={{ color: "#86efac", fontSize: "14px", marginBottom: "6px" }}>
                Správná odpověď: {q.correct.map(i => q.options[i]).join(", ")}
              </div>
            )}
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", lineHeight: 1.5 }}>{q.explanation}</div>
            {q.tip && <div style={{ color: "#fbbf24", fontSize: "13px", marginTop: "8px", fontStyle: "italic" }}>Tip: {q.tip}</div>}
          </div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button style={{ padding: "10px 22px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", color: "#fff", cursor: "pointer", fontSize: "15px" }} onClick={() => goTo(idx - 1)} disabled={idx === 0}>← Předchozí</button>
        {idx < shuffledQuestions.length - 1
          ? <button style={{ padding: "10px 22px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", color: "#fff", cursor: "pointer", fontSize: "15px" }} onClick={() => goTo(idx + 1)}>Další →</button>
          : <button style={{ padding: "10px 22px", background: accentColor + "55", border: `1px solid ${accentColor}`, borderRadius: "10px", color: "#fff", cursor: "pointer", fontSize: "15px" }} onClick={() => setShowResults(true)}>Výsledky →</button>
        }
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// DATA
// ══════════════════════════════════════════════════════════════════════════════

const quizQuestions = [
  {
    question: "Jaká je struktura řešení konstrukční úlohy?",
    type: "single",
    options: [
      "Náčrt a rozbor → Postup konstrukce → Konstrukce → Diskuze",
      "Zadání → Výpočet → Konstrukce → Kontrola",
      "Rozbor → Konstrukce → Náčrt → Zápis",
      "Postup → Náčrt → Diskuze → Konstrukce"
    ],
    correct: [0],
    explanation: "Správná struktura je: 1. Náčrt a rozbor (analýza situace), 2. Postup konstrukce (seznam kroků), 3. Konstrukce (samotné rýsování), 4. Diskuze (počet řešení).",
    tip: "Pamatuj: NRKD = Náčrt, Rozbor (v jednom), Konstrukce s Postupem, Diskuze"
  },
  {
    question: "Co označuje zápis k(S; r)?",
    type: "single",
    options: [
      "Kružnice se středem S a poloměrem r",
      "Kulová plocha se středem S",
      "Kolmice k přímce S",
      "Kružnice o průměru r"
    ],
    correct: [0],
    explanation: "Zápis k(S; r) označuje kružnici se středem S a poloměrem r. Je to standardní geometrické značení.",
    tip: "k jako kružnice, první parametr střed, druhý poloměr"
  },
  {
    question: "Co je Thaletova kružnice?",
    type: "single",
    options: [
      "Množina bodů, ze kterých je úsečka AB vidět pod pravým úhlem",
      "Kružnice opsaná trojúhelníku",
      "Množina bodů stejně vzdálených od dvou bodů",
      "Kružnice vepsaná trojúhelníku"
    ],
    correct: [0],
    explanation: "Thaletova kružnice je množina všech bodů X, ze kterých je úsečka AB vidět pod úhlem 90°. Její střed leží ve středu úsečky AB a prochází body A i B.",
    tip: "Thaletova věta: úhel nad průměrem = 90°"
  },
  {
    question: "Jak zapíšeme osu úhlu α?",
    type: "single",
    options: [
      "o; o je osa úhlu α",
      "α/2",
      "osa(α)",
      "o ⊥ α"
    ],
    correct: [0],
    explanation: "Osu úhlu α zapisujeme jako 'o; o je osa úhlu α' nebo zkráceně jen 'o' s vyznačením v náčrtu. Osa úhlu je množina bodů stejně vzdálených od obou ramen úhlu.",
  },
  {
    question: "Co je osa úsečky AB?",
    type: "single",
    options: [
      "Množina bodů X, pro které platí |AX| = |BX|",
      "Přímka procházející body A a B",
      "Kolmice k AB v bodě A",
      "Úhlopříčka spojující A a B"
    ],
    correct: [0],
    explanation: "Osa úsečky AB je množina všech bodů, které mají stejnou vzdálenost od bodu A jako od bodu B. Zapisujeme: o = {X; |AX| = |BX|}.",
    tip: "Osa úsečky prochází středem úsečky a je na ni kolmá"
  },
  {
    question: "Jak zapíšeme kružnici o(150°)?",
    type: "single",
    options: [
      "ε = {X; |∠AXB| = 150°}",
      "k(S; 150°)",
      "o(A, B, 150)",
      "ε ⊥ 150°"
    ],
    correct: [0],
    explanation: "Kružnici, ze které je úsečka AB vidět pod úhlem 150°, zapisujeme jako ε = {X; |∠AXB| = 150°}. Je to zobecnění Thaletovy kružnice.",
  },
  {
    question: "Co je to polohová konstrukční úloha?",
    type: "single",
    options: [
      "Úloha, kde je známa poloha alespoň jednoho prvku",
      "Úloha bez zadaných rozměrů",
      "Úloha s jedním řešením",
      "Úloha na konstrukci polohy bodu"
    ],
    correct: [0],
    explanation: "Polohová KÚ je taková, kde známe polohu alespoň jednoho prvku (např. úsečka AB je dána). Začínáme prvkem, který je dán svou polohou. Výsledkem jsou všechna sestrojitelná řešení.",
    tip: "Polohová = je dána POLOha něčeho"
  },
  {
    question: "Jaký je rozdíl mezi polohovou a nepolohovou konstrukční úlohou?",
    type: "single",
    options: [
      "U nepolohové nejsou známy polohy prvků, pouze vlastnosti útvaru",
      "Nepolohová úloha nemá řešení",
      "Polohová má více řešení než nepolohová",
      "Není mezi nimi rozdíl"
    ],
    correct: [0],
    explanation: "U nepolohové KÚ nejsou známy polohy žádných prvků, pouze vlastnosti útvaru (délky, úhly). Začínáme libovolným prvkem a bereme v úvahu jen tvarově odlišná řešení.",
  },
  {
    question: "Co označuje zápis tₐ v trojúhelníku ABC?",
    type: "single",
    options: [
      "Těžnice z vrcholu A",
      "Tečna ke kružnici v bodě A",
      "Třetina strany a",
      "Thaletova kružnice nad AB"
    ],
    correct: [0],
    explanation: "tₐ označuje těžnici z vrcholu A, která spojuje vrchol A se středem protilehlé strany BC. Střed strany BC značíme Sbc.",
    tip: "tₐ = úsečka A→Sbc (střed strany BC)"
  },
  {
    question: "Co označuje zápis vₐ v trojúhelníku ABC?",
    type: "single",
    options: [
      "Výška z vrcholu A na stranu a (BC)",
      "Vnitřní úhel u vrcholu A",
      "Vzdálenost bodu A od těžiště",
      "Vnější úhel u vrcholu A"
    ],
    correct: [0],
    explanation: "vₐ označuje výšku z vrcholu A, kolmou na stranu a (tedy BC). Pata výšky je bod C₀ na přímce BC.",
    tip: "Výška = kolmice z vrcholu na protilehlou stranu"
  },
  {
    question: "Co znamená zápis p ⊥ q?",
    type: "single",
    options: [
      "Přímka p je kolmá na přímku q",
      "Přímka p je rovnoběžná s q",
      "Přímka p protíná q",
      "Přímka p leží na q"
    ],
    correct: [0],
    explanation: "Symbol ⊥ značí kolmost. Zápis p ⊥ q tedy znamená, že přímka p je kolmá na přímku q.",
  },
  {
    question: "Co znamená zápis p ∥ q?",
    type: "single",
    options: [
      "Přímka p je rovnoběžná s přímkou q",
      "Přímka p je kolmá na q",
      "Přímka p protíná q",
      "Přímky p a q jsou totožné"
    ],
    correct: [0],
    explanation: "Symbol ∥ značí rovnoběžnost. Zápis p ∥ q znamená, že přímky p a q jsou rovnoběžné (nemají společný bod, nebo jsou totožné).",
  },
  {
    question: "Co označuje zápis A ∈ p?",
    type: "single",
    options: [
      "Bod A leží na přímce p",
      "Bod A je středem přímky p",
      "Bod A je kolmý k přímce p",
      "Bod A neleží na přímce p"
    ],
    correct: [0],
    explanation: "Symbol ∈ značí náležení (příslušnost). A ∈ p znamená, že bod A leží na přímce p (je prvkem přímky).",
  },
  {
    question: "Co označuje zápis p ∩ q = {X}?",
    type: "single",
    options: [
      "Průnik přímek p a q je bod X",
      "Přímky p a q jsou rovnoběžné",
      "Přímka p je kolmá na q v bodě X",
      "Bod X leží mimo obě přímky"
    ],
    correct: [0],
    explanation: "Symbol ∩ značí průnik. p ∩ q = {X} znamená, že přímky p a q se protínají právě v bodě X.",
  },
  {
    question: "Pro úhel φ ∈ (0°; 90°) platí, že kružnice ε(φ) nad úsečkou AB:",
    type: "single",
    options: [
      "Je obloukem, kde střed leží na ose úsečky AB",
      "Je přímkou procházející body A a B",
      "Je úsečkou AB",
      "Neexistuje"
    ],
    correct: [0],
    explanation: "Pro ostrý úhel φ ∈ (0°; 90°) je množina bodů, ze kterých je AB vidět pod úhlem φ, tvořena dvěma oblouky symetrickými podle osy úsečky AB. Středy oblouků leží na ose úsečky.",
  },
  {
    question: "Co zapisujeme v kroku konstrukce, když hledáme průsečík dvou objektů?",
    type: "single",
    options: [
      "Název bodu; bod ∈ objekt₁ ∩ objekt₂",
      "Pouze název bodu",
      "Pouze průsečík",
      "Objekt₁ + objekt₂"
    ],
    correct: [0],
    explanation: "Když hledáme průsečík (např. bod A), zapíšeme: A; A ∈ p ∩ ε, což znamená, že bod A je prvkem průniku přímky p a kružnice ε.",
  }
];

const flashcards = [
  { front: "k(S; r)", back: "Kružnice se středem S a poloměrem r" },
  { front: "p ⊥ q", back: "Přímka p je kolmá na přímku q" },
  { front: "p ∥ q", back: "Přímka p je rovnoběžná s přímkou q" },
  { front: "A ∈ p", back: "Bod A leží na přímce p" },
  { front: "p ∩ q = {X}", back: "Průnik přímek p a q je bod X" },
  { front: "vₐ", back: "Výška z vrcholu A na stranu a (BC)" },
  { front: "tₐ", back: "Těžnice z vrcholu A ke středu strany BC" },
  { front: "Sbc", back: "Střed strany BC" },
  { front: "C₀", back: "Pata výšky z vrcholu C (na přímce AB)" },
  { front: "o (osa úsečky AB)", back: "Množina bodů X, kde |AX| = |BX|" },
  { front: "o (osa úhlu α)", back: "Množina bodů stejně vzdálených od obou ramen úhlu" },
  { front: "Thaletova kružnice", back: "Množina bodů X, ze kterých je AB vidět pod úhlem 90°" },
  { front: "ε = {X; |∠AXB| = φ}", back: "Množina bodů, ze kterých je AB vidět pod úhlem φ" },
  { front: "rv", back: "Poloměr kružnice vepsané trojúhelníku" },
  { front: "ro", back: "Poloměr kružnice opsané trojúhelníku" },
  { front: "|AB| = c", back: "Délka úsečky AB je c" },
  { front: "|∠ABC| = α", back: "Velikost úhlu ABC je α" },
  { front: "△ABC", back: "Trojúhelník s vrcholy A, B, C" },
];

const problems = [
  {
    id: 1,
    title: "Trojúhelník ABC: c = 7 cm, b = 4 cm, γ = 30°",
    difficulty: "easy",
    zadani: "Je dána úsečka AB; |AB| = c = 7 cm. Sestrojte všechny △ABC, kde b = 4 cm a γ = 30°.",
    nacrt: "Načrtneme trojúhelník ABC s vyznačením úsečky AB (strana c), strany b = AC a úhlu γ u vrcholu C.",
    rozbor: [
      "Úsečka AB je dána → začínáme úsečkou c",
      "Bod C leží na kružnici k(A; 4cm) — vzdálenost od A je b",
      "Bod C leží na kružnici ε(30°) — množina bodů, ze kterých je AB vidět pod úhlem 30°",
      "C je průsečík těchto dvou množin"
    ],
    postup: [
      "AB; |AB| = 7 cm",
      "k; k(A; 4 cm)",
      "ε; ε = {X; |∠AXB| = 30°}",
      "C; C ∈ k ∩ ε",
      "△ABC"
    ],
    diskuze: "Počet řešení závisí na vzájemné poloze kružnice k a oblouku ε. Může být 0, 1, 2 nebo 4 řešení (dva oblouky ε nad a pod AB, každý může mít 0-2 průsečíky s k)."
  },
  {
    id: 2,
    title: "Trojúhelník ABC: c = 6 cm, tᴄ = 4 cm, α = 45°",
    difficulty: "medium",
    zadani: "Sestrojte trojúhelník ABC, je-li dáno: c = 6 cm, tᴄ = 4 cm, α = 45°.",
    nacrt: "Načrtneme trojúhelník ABC, vyznačíme stranu c = AB, těžnici tᴄ ze strany c a úhel α u vrcholu A.",
    rozbor: [
      "Strana c = AB je zadána → začneme úsečkou AB délky 6 cm",
      "Těžnice tᴄ vychází ze středu Sc strany AB a má délku 4 cm",
      "Střed Sc úsečky AB najdeme jako střed",
      "Bod C leží na kružnici k(Sc; 4 cm)",
      "Bod C leží na rameni úhlu α od bodu A",
      "Sestrojíme polopřímku z A pod úhlem 45° od AB"
    ],
    postup: [
      "AB; |AB| = 6 cm",
      "Sc; Sc je střed úsečky AB",
      "k; k(Sc; 4 cm)",
      "p; polopřímka z A, |∠BAp| = 45°",
      "C; C ∈ k ∩ p",
      "△ABC"
    ],
    diskuze: "Řešení závisí na poloze polopřímky p vůči kružnici k. Může být 0, 1 nebo 2 řešení."
  },
  {
    id: 3,
    title: "Trojúhelník ABC: c = 6 cm, vᴄ = 5,3 cm, a = 7 cm",
    difficulty: "medium",
    zadani: "Sestrojte trojúhelník ABC, je-li dáno: c = 6 cm, vᴄ = 5,3 cm, a = 7 cm.",
    nacrt: "Trojúhelník ABC s vyznačením strany c = AB, výšky vᴄ z bodu C kolmo na AB a strany a = BC.",
    rozbor: [
      "Strana c = AB je zadána → úsečka délky 6 cm",
      "Výška vᴄ = 5,3 cm je kolmá vzdálenost C od přímky AB",
      "Bod C leží na přímce rovnoběžné s AB ve vzdálenosti 5,3 cm",
      "Bod C leží na kružnici k(B; 7 cm) — vzdálenost od B je a",
      "C je průsečík rovnoběžky s kružnicí"
    ],
    postup: [
      "AB; |AB| = 6 cm",
      "p; p ∥ AB ∧ vzdálenost p od AB je 5,3 cm",
      "k; k(B; 7 cm)",
      "C; C ∈ p ∩ k",
      "△ABC"
    ],
    diskuze: "Existují dvě rovnoběžky p (nad a pod AB), každá může mít 0, 1 nebo 2 průsečíky s kružnicí k."
  },
  {
    id: 4,
    title: "Trojúhelník ABC: a = 6 cm, tₐ = 3,5 cm, α = 75°",
    difficulty: "medium",
    zadani: "Sestrojte trojúhelník ABC, je-li dáno: a = 6 cm, tₐ = 3,5 cm, α = 75°.",
    nacrt: "Trojúhelník ABC, strana a = BC, těžnice tₐ z vrcholu A do středu strany BC, úhel α u vrcholu A.",
    rozbor: [
      "Strana a = BC je zadána → úsečka délky 6 cm",
      "Střed Sa strany BC určíme",
      "Těžnice tₐ má délku 3,5 cm → A leží na kružnici k(Sa; 3,5 cm)",
      "Úhel α = 75° je úhel ∠BAC → A leží na kružnici ε(75°) nad BC",
      "A je průsečík kružnic k a ε"
    ],
    postup: [
      "BC; |BC| = 6 cm",
      "Sa; Sa je střed úsečky BC",
      "k; k(Sa; 3,5 cm)",
      "ε; ε = {X; |∠BXC| = 75°}",
      "A; A ∈ k ∩ ε",
      "△ABC"
    ],
    diskuze: "Počet řešení závisí na průniku kružnice k a oblouků ε."
  },
  {
    id: 5,
    title: "Trojúhelník ABC: vₐ = 3,8 cm, vᴄ = 4,2 cm, γ = 30°",
    difficulty: "hard",
    zadani: "Sestrojte trojúhelník ABC, je-li dáno: vₐ = 3,8 cm, vᴄ = 4,2 cm, γ = 30°.",
    nacrt: "Trojúhelník ABC s vyznačením výšek vₐ (z A na BC) a vᴄ (z C na AB), a úhlu γ = 30° u vrcholu C.",
    rozbor: [
      "Začneme konstrukcí úhlu γ = 30° pomocí ramen CX a CY",
      "Bod A leží na jednom rameni a B na druhém",
      "A leží ve vzdálenosti vₐ od přímky BC → na rovnoběžce s CY",
      "Použijeme Thaletovu kružnici pro konstrukci pravoúhlého trojúhelníku",
      "Bod B najdeme pomocí podmínky vᴄ a kružnice ε"
    ],
    postup: [
      "CX (polopřímka z C)",
      "CY; |∠XCY| = 30°",
      "p; p ∥ CX ∧ vzdálenost = vₐ = 3,8 cm",
      "A; A ∈ p ∩ CY",
      "k; k(C; vᴄ) = k(C; 4,2 cm)",
      "T; T = {X; |∠AXC| = 90°} — Thaletova kružnice nad AC",
      "C₀; C₀ ∈ k ∩ T",
      "q; q = AC₀ (přímka obsahující výšku)",
      "B; B ∈ q ∩ CX",
      "△ABC"
    ],
    diskuze: "Úloha má více kroků a podmínek. Počet řešení závisí na vzájemné poloze všech konstruovaných objektů."
  },
  {
    id: 6,
    title: "Trojúhelník ABC: α = 60°, rᵥ = 2 cm, vᴄ = 5 cm",
    difficulty: "hard",
    zadani: "Sestrojte trojúhelník ABC, je-li dáno: α = 60°, rᵥ = 2 cm (kružnice vepsaná), vᴄ = 5 cm.",
    nacrt: "Trojúhelník ABC s vepsanou kružnicí o poloměru 2 cm, úhlem α = 60° u vrcholu A a výškou vᴄ z C.",
    rozbor: [
      "Začneme konstrukcí výšky vᴄ jako úsečky CC₀ délky 5 cm",
      "Sestrojíme kružnici ε = {X; |∠C₀XC| = 60°} — body, ze kterých je CC₀ vidět pod 60°",
      "Sestrojíme kolmici p k CC₀ v bodě C₀ — na ní leží strana AB",
      "A je průsečík p a ε",
      "Osa úhlu α je množina bodů pro střed vepsané kružnice",
      "Střed vepsané kružnice S leží ve vzdálenosti rᵥ od všech stran"
    ],
    postup: [
      "CC₀; |CC₀| = vᴄ = 5 cm",
      "ε; ε = {X; |∠C₀XC| = 60°}",
      "p; p ⊥ CC₀ ∧ C₀ ∈ p",
      "A; A ∈ p ∩ ε",
      "o; o je osa úhlu α (osa ∠CAp)",
      "q; q ∥ AC ∧ vzdálenost q od AC = 2 cm",
      "S; S ∈ o ∩ q",
      "kᵥ; kᵥ(S; 2 cm) — kružnice vepsaná",
      "M; M = {X; |∠SXC| = 90°}",
      "T; T ∈ M ∩ kᵥ",
      "B; B ∈ p ∩ CT",
      "△ABC"
    ],
    diskuze: "Složitá úloha s mnoha kroky. Existence řešení závisí na splnění všech podmínek současně."
  },
  {
    id: 7,
    title: "Rovnoběžník ABCD: |AC| = 10 cm, vₐ = 4 cm, |AB| = 7 cm",
    difficulty: "medium",
    zadani: "Sestrojte rovnoběžník ABCD, je-li |AC| = 10 cm, vₐ = 4 cm, |AB| = 7 cm.",
    nacrt: "Rovnoběžník ABCD s úhlopříčkou AC, výškou vₐ na stranu a (BC nebo AD) a stranou AB.",
    rozbor: [
      "Úhlopříčka AC má délku 10 cm → začneme úsečkou AC",
      "Strana AB má délku 7 cm → B leží na kružnici k(A; 7 cm)",
      "Výška vₐ = 4 cm → vzdálenost mezi rovnoběžnými stranami AD a BC",
      "B leží ve vzdálenosti 4 cm od přímky AD",
      "D je obraz B podle středu S úhlopříčky AC"
    ],
    postup: [
      "AC; |AC| = 10 cm",
      "S; S je střed AC",
      "k; k(A; 7 cm)",
      "p; p ∥ AC (přímka pro AD)",
      "q; q ∥ p ve vzdálenosti 4 cm",
      "B; B ∈ k ∩ q",
      "D; D je obraz B podle S",
      "ABCD"
    ],
    diskuze: "Rovnoběžník má střed úhlopříček totožný. Řešení závisí na průniku kružnice k s rovnoběžkou q."
  },
  {
    id: 8,
    title: "Podle postupu konstrukce určete zadání",
    difficulty: "medium",
    zadani: "Podle následujícího postupu zkonstruujte trojúhelník. Jak znělo zadání úlohy?\n\n1) BC; |BC| = 6 cm\n2) S₁; (S₁ ∈ BC) ∧ (|S₁B| = |S₁C|)\n3) o; o = {X; |CX| = |BX|}\n4) k₁; k₁(C; 4 cm)\n5) S₂; S₂ ∈ o ∩ k₁\n6) k₂; k₂(S₂; 4 cm)\n7) k₃; k₃(S₁; 6 cm)\n8) A; A ∈ k₂ ∩ k₃\n9) △ABC",
    nacrt: "Trojúhelník ABC s vyznačením: strana a = BC = 6 cm, středy S₁ (úsečky BC) a S₂, kružnice k₁, k₂, k₃.",
    rozbor: [
      "Krok 1: BC = 6 cm → strana a = 6 cm",
      "Krok 2-3: Osa úsečky BC → budeme hledat body stejně vzdálené od B a C",
      "Krok 4-5: S₂ leží na ose BC a na kružnici k(C; 4cm) → S₂ je střed kružnice opsané? Ne, je to pomocný bod.",
      "Krok 6: k₂(S₂; 4cm) — A leží na této kružnici → |AS₂| = 4 cm",
      "Krok 7: k₃(S₁; 6cm) — A leží na této kružnici → |AS₁| = 6 cm → tₐ = 6 cm (těžnice z A)",
      "Krok 8: A je průsečík k₂ a k₃",
      "Závěr: a = 6 cm, tₐ = 6 cm, a ještě nějaká podmínka na vzdálenost od C"
    ],
    postup: [
      "Zadání: a = 6 cm, tₐ = 6 cm, k = 4 cm (nějaká další podmínka)"
    ],
    diskuze: "Úloha ukazuje zpětnou analýzu konstrukce. Zadání bylo pravděpodobně: △ABC, kde a = 6 cm, tₐ = 6 cm a další podmínka."
  }
];

// ══════════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ══════════════════════════════════════════════════════════════════════════════

function TheorySection() {
  const [openSection, setOpenSection] = useState(null);

  const toggle = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const sections = [
    {
      id: "struktura",
      title: "Struktura řešení konstrukční úlohy",
      content: (
        <div>
          <p style={styles.p}>Každá konstrukční úloha se řeší ve <strong>čtyřech krocích</strong>:</p>
          <div style={styles.stepBox}>
            <div style={styles.stepNum}>1</div>
            <div>
              <strong>Náčrt a rozbor</strong>
              <p style={{...styles.p, marginTop: 8}}>Analýza vyřešené situace. Črtáme obrazec, zvýrazníme zadané prvky a hledáme vztahy mezi nimi. Nalezení cesty od zadaných prvků k prvkům hledaným.</p>
            </div>
          </div>
          <div style={styles.stepBox}>
            <div style={styles.stepNum}>2</div>
            <div>
              <strong>Postup konstrukce</strong>
              <p style={{...styles.p, marginTop: 8}}>Seznam kroků konstrukce. Pojmenování prvku v rozboru musí být shodné s pojmenováním v postupu. Žádný krok nesmí používat objekt, který ještě nebyl sestrojen.</p>
            </div>
          </div>
          <div style={styles.stepBox}>
            <div style={styles.stepNum}>3</div>
            <div>
              <strong>Konstrukce</strong>
              <p style={{...styles.p, marginTop: 8}}>Samotné rýsování podle postupu. Postup konstrukce by měl předcházet nebo být psán současně s konstrukcí.</p>
            </div>
          </div>
          <div style={styles.stepBox}>
            <div style={styles.stepNum}>4</div>
            <div>
              <strong>Diskuze</strong>
              <p style={{...styles.p, marginTop: 8}}>Určení počtu řešení a podmínek existence. Analyzujeme, za jakých podmínek má úloha 0, 1, 2 nebo více řešení.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "typy",
      title: "Polohové vs. nepolohové úlohy",
      content: (
        <div>
          <div style={styles.comparisonBox}>
            <div style={{...styles.comparisonCol, borderRight: "1px solid rgba(255,255,255,0.1)"}}>
              <h4 style={styles.comparisonTitle}>Polohové úlohy</h4>
              <ul style={styles.ul}>
                <li>Je známa poloha alespoň jednoho prvku</li>
                <li>Začínáme prvkem, který je dán svou polohou</li>
                <li>Výsledkem jsou <strong>všechny</strong> sestrojitelné možnosti</li>
                <li>Např.: "Je dána úsečka AB..."</li>
              </ul>
            </div>
            <div style={styles.comparisonCol}>
              <h4 style={styles.comparisonTitle}>Nepolohové úlohy</h4>
              <ul style={styles.ul}>
                <li>Nejsou známy polohy prvků, jen vlastnosti</li>
                <li>Začínáme libovolným prvkem</li>
                <li>Bereme v úvahu jen <strong>tvarově odlišná</strong> řešení</li>
                <li>Např.: "Sestrojte trojúhelník, kde c = 7 cm..."</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "mnoziny",
      title: "Množiny bodů dané vlastnosti",
      content: (
        <div>
          <div style={styles.conceptCard}>
            <h4 style={styles.conceptTitle}>Osa úsečky AB</h4>
            <div style={styles.formula}>o = {"{X; |AX| = |BX|}"}</div>
            <p style={styles.p}>Množina všech bodů, které mají stejnou vzdálenost od A jako od B. Osa úsečky prochází jejím středem a je na ni kolmá.</p>
          </div>

          <div style={styles.conceptCard}>
            <h4 style={styles.conceptTitle}>Osa úhlu α</h4>
            <div style={styles.formula}>o = {"{M; vzdálenost M od obou ramen je stejná}"}</div>
            <p style={styles.p}>Množina všech bodů stejně vzdálených od obou ramen úhlu. Osa úhlu půlí úhel.</p>
          </div>

          <div style={styles.conceptCard}>
            <h4 style={styles.conceptTitle}>Kružnice ε(φ) — zobecněná Thaletova</h4>
            <div style={styles.formula}>ε = {"{X; |∠AXB| = φ}"}</div>
            <p style={styles.p}>Množina bodů, ze kterých je úsečka AB vidět pod úhlem φ.</p>
            <ul style={styles.ul}>
              <li><strong>φ = 90°</strong> → Thaletova kružnice (průměr = AB)</li>
              <li><strong>φ ∈ (0°; 90°)</strong> → dva oblouky nad a pod AB (ostrý úhel)</li>
              <li><strong>φ ∈ (90°; 180°)</strong> → dva oblouky, středy mezi A a B (tupý úhel)</li>
            </ul>
          </div>

          <div style={styles.conceptCard}>
            <h4 style={styles.conceptTitle}>Rovnoběžka ve vzdálenosti d</h4>
            <div style={styles.formula}>p ∥ q ∧ vzdálenost(p, q) = d</div>
            <p style={styles.p}>Množina bodů ve vzdálenosti d od přímky tvoří dvě rovnoběžné přímky (jednu na každé straně).</p>
          </div>
        </div>
      )
    },
    {
      id: "thaletova",
      title: "Thaletova kružnice podrobně",
      content: (
        <div>
          <div style={styles.highlightBox}>
            <strong>Thaletova věta:</strong> Každý obvodový úhel nad průměrem kružnice je pravý (90°).
          </div>
          <p style={styles.p}>Pro úsečku AB platí:</p>
          <ul style={styles.ul}>
            <li>Střed Thaletovy kružnice je <strong>střed S úsečky AB</strong></li>
            <li>Poloměr je <strong>|AB|/2</strong></li>
            <li>Každý bod X na kružnici (kromě A, B) splňuje: |∠AXB| = 90°</li>
          </ul>

          <p style={{...styles.p, marginTop: 16}}>Zobecnění pro úhel φ:</p>
          <ul style={styles.ul}>
            <li>Pokud φ = 90°, je to právě Thaletova kružnice</li>
            <li>Pro ostrý úhel φ jsou oblouky "vyduté" od středu</li>
            <li>Pro tupý úhel φ (např. 150°) jsou oblouky "prohnuté" dovnitř</li>
          </ul>

          <div style={{...styles.formula, marginTop: 16}}>
            Zápis: ε = {"{X; |∠AXB| = 90°}"} — Thaletova kružnice
          </div>
        </div>
      )
    },
    {
      id: "trojuhelnik",
      title: "Prvky trojúhelníku",
      content: (
        <div>
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Značka</th>
                  <th style={styles.th}>Název</th>
                  <th style={styles.th}>Popis</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={styles.td}>a, b, c</td>
                  <td style={styles.td}>Strany</td>
                  <td style={styles.td}>a = BC, b = AC, c = AB (protilehlé vrcholům A, B, C)</td>
                </tr>
                <tr>
                  <td style={styles.td}>α, β, γ</td>
                  <td style={styles.td}>Vnitřní úhly</td>
                  <td style={styles.td}>α u vrcholu A, β u B, γ u C</td>
                </tr>
                <tr>
                  <td style={styles.td}>vₐ, vᵦ, vᴄ</td>
                  <td style={styles.td}>Výšky</td>
                  <td style={styles.td}>Kolmice z vrcholu na protilehlou stranu</td>
                </tr>
                <tr>
                  <td style={styles.td}>tₐ, tᵦ, tᴄ</td>
                  <td style={styles.td}>Těžnice</td>
                  <td style={styles.td}>Spojnice vrcholu se středem protilehlé strany</td>
                </tr>
                <tr>
                  <td style={styles.td}>Sₐ, Sᵦ, Sᴄ</td>
                  <td style={styles.td}>Středy stran</td>
                  <td style={styles.td}>Sₐ střed BC, Sᵦ střed AC, Sᴄ střed AB</td>
                </tr>
                <tr>
                  <td style={styles.td}>A₀, B₀, C₀</td>
                  <td style={styles.td}>Paty výšek</td>
                  <td style={styles.td}>Body na stranách, kde výška dopadá</td>
                </tr>
                <tr>
                  <td style={styles.td}>rᵥ</td>
                  <td style={styles.td}>Poloměr vepsané kružnice</td>
                  <td style={styles.td}>Kružnice dotýkající se všech tří stran zevnitř</td>
                </tr>
                <tr>
                  <td style={styles.td}>rₒ</td>
                  <td style={styles.td}>Poloměr opsané kružnice</td>
                  <td style={styles.td}>Kružnice procházející všemi třemi vrcholy</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )
    }
  ];

  return (
    <div>
      {sections.map(section => (
        <div key={section.id} style={styles.accordionItem}>
          <div
            style={styles.accordionHeader}
            onClick={() => toggle(section.id)}
          >
            <span>{section.title}</span>
            <span style={{transform: openSection === section.id ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.4s ease'}}>▼</span>
          </div>
          {openSection === section.id && (
            <div style={styles.accordionContent}>
              {section.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function NotationSection() {
  return (
    <div>
      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>Základní symboly</h3>
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Symbol</th>
                <th style={styles.th}>Význam</th>
                <th style={styles.th}>Příklad</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={styles.td}>∈</td><td style={styles.td}>náleží, je prvkem</td><td style={styles.td}>A ∈ p (bod A leží na přímce p)</td></tr>
              <tr><td style={styles.td}>∉</td><td style={styles.td}>nenáleží</td><td style={styles.td}>A ∉ p (bod A neleží na p)</td></tr>
              <tr><td style={styles.td}>∩</td><td style={styles.td}>průnik</td><td style={styles.td}>p ∩ q = {"{X}"} (průsečík p a q je X)</td></tr>
              <tr><td style={styles.td}>∪</td><td style={styles.td}>sjednocení</td><td style={styles.td}>p ∪ q (všechny body p nebo q)</td></tr>
              <tr><td style={styles.td}>⊥</td><td style={styles.td}>kolmý na</td><td style={styles.td}>p ⊥ q (p je kolmá na q)</td></tr>
              <tr><td style={styles.td}>∥</td><td style={styles.td}>rovnoběžný s</td><td style={styles.td}>p ∥ q (p je rovnoběžná s q)</td></tr>
              <tr><td style={styles.td}>∧</td><td style={styles.td}>a zároveň (logické "a")</td><td style={styles.td}>A ∈ p ∧ A ∈ k</td></tr>
              <tr><td style={styles.td}>|AB|</td><td style={styles.td}>délka úsečky AB</td><td style={styles.td}>|AB| = 5 cm</td></tr>
              <tr><td style={styles.td}>|∠ABC|</td><td style={styles.td}>velikost úhlu ABC</td><td style={styles.td}>|∠ABC| = 60°</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>Zápis objektů</h3>
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Zápis</th>
                <th style={styles.th}>Význam</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={styles.td}>k(S; r)</td><td style={styles.td}>Kružnice se středem S a poloměrem r</td></tr>
              <tr><td style={styles.td}>AB</td><td style={styles.td}>Úsečka s koncovými body A a B</td></tr>
              <tr><td style={styles.td}>↔AB</td><td style={styles.td}>Přímka procházející body A a B</td></tr>
              <tr><td style={styles.td}>→AB</td><td style={styles.td}>Polopřímka z A směrem k B</td></tr>
              <tr><td style={styles.td}>△ABC</td><td style={styles.td}>Trojúhelník s vrcholy A, B, C</td></tr>
              <tr><td style={styles.td}>□ABCD</td><td style={styles.td}>Čtyřúhelník ABCD</td></tr>
              <tr><td style={styles.td}>∠ABC</td><td style={styles.td}>Úhel s vrcholem B, ramena BA a BC</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>Zápis kroků konstrukce</h3>
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Příklad zápisu</th>
                <th style={styles.th}>Význam</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={styles.td}>AB; |AB| = 5 cm</td><td style={styles.td}>Sestrojíme úsečku AB délky 5 cm</td></tr>
              <tr><td style={styles.td}>k; k(A; 3 cm)</td><td style={styles.td}>Sestrojíme kružnici k se středem A a poloměrem 3 cm</td></tr>
              <tr><td style={styles.td}>p; p ⊥ AB ∧ A ∈ p</td><td style={styles.td}>Sestrojíme přímku p kolmou na AB procházející bodem A</td></tr>
              <tr><td style={styles.td}>q; q ∥ p ∧ |q, p| = 4 cm</td><td style={styles.td}>Sestrojíme přímku q rovnoběžnou s p ve vzdálenosti 4 cm</td></tr>
              <tr><td style={styles.td}>C; C ∈ k ∩ p</td><td style={styles.td}>Bod C je průsečíkem kružnice k a přímky p</td></tr>
              <tr><td style={styles.td}>S; S je střed AB</td><td style={styles.td}>S je střed úsečky AB</td></tr>
              <tr><td style={styles.td}>o; o je osa úhlu α</td><td style={styles.td}>o je osa úhlu α</td></tr>
              <tr><td style={styles.td}>ε; ε = {"{X; |∠AXB| = 60°}"}</td><td style={styles.td}>Množina bodů, ze kterých je AB vidět pod 60°</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ProblemsSection() {
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [showSolution, setShowSolution] = useState(false);

  const difficultyColors = {
    easy: { bg: "#22c55e33", border: "#22c55e", label: "Easy" },
    medium: { bg: "#f59e0b33", border: "#f59e0b", label: "Medium" },
    hard: { bg: "#ef444433", border: "#ef4444", label: "Hard" }
  };

  if (selectedProblem) {
    const problem = problems.find(p => p.id === selectedProblem);
    const diff = difficultyColors[problem.difficulty];

    return (
      <div>
        <button
          style={styles.backButton}
          onClick={() => { setSelectedProblem(null); setShowSolution(false); }}
        >
          ← Zpět na seznam
        </button>

        <div style={styles.card}>
          <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16}}>
            <span style={{...styles.diffBadge, background: diff.bg, borderColor: diff.border}}>{diff.label}</span>
            <h3 style={{...styles.problemTitle, margin: 0}}>{problem.title}</h3>
          </div>

          <div style={styles.zadaniBox}>
            <strong>Zadání:</strong>
            <p style={{margin: '8px 0 0 0', whiteSpace: 'pre-wrap'}}>{problem.zadani}</p>
          </div>

          <button
            style={styles.revealButton}
            onClick={() => setShowSolution(!showSolution)}
          >
            {showSolution ? "Skrýt řešení" : "Zobrazit řešení"}
          </button>

          {showSolution && (
            <div style={styles.solutionBox}>
              <div style={styles.solutionSection}>
                <h4 style={styles.solutionTitle}>I. Náčrt</h4>
                <p style={styles.p}>{problem.nacrt}</p>
              </div>

              <div style={styles.solutionSection}>
                <h4 style={styles.solutionTitle}>II. Rozbor</h4>
                <ul style={styles.ul}>
                  {problem.rozbor.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div style={styles.solutionSection}>
                <h4 style={styles.solutionTitle}>III. Postup konstrukce</h4>
                <ol style={styles.ol}>
                  {problem.postup.map((step, i) => (
                    <li key={i} style={styles.constructionStep}>{step}</li>
                  ))}
                </ol>
              </div>

              <div style={styles.solutionSection}>
                <h4 style={styles.solutionTitle}>IV. Diskuze</h4>
                <p style={styles.p}>{problem.diskuze}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.problemsGrid}>
      {problems.map(problem => {
        const diff = difficultyColors[problem.difficulty];
        return (
          <div
            key={problem.id}
            style={styles.problemCard}
            onClick={() => setSelectedProblem(problem.id)}
          >
            <span style={{...styles.diffBadge, background: diff.bg, borderColor: diff.border}}>{diff.label}</span>
            <h4 style={styles.problemCardTitle}>{problem.title}</h4>
            <p style={styles.problemCardDesc}>{problem.zadani.substring(0, 80)}...</p>
          </div>
        );
      })}
    </div>
  );
}

function FlashcardsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const next = () => {
    setFlipped(false);
    setCurrentIndex((currentIndex + 1) % flashcards.length);
  };

  const prev = () => {
    setFlipped(false);
    setCurrentIndex((currentIndex - 1 + flashcards.length) % flashcards.length);
  };

  return (
    <div style={styles.flashcardsWrap}>
      <div style={styles.dotBar}>
        {flashcards.map((_, i) => (
          <div
            key={i}
            style={{
              ...styles.dot,
              background: i === currentIndex ? "#06b6d4" : "#4b5563"
            }}
            onClick={() => { setFlipped(false); setCurrentIndex(i); }}
          />
        ))}
      </div>

      <div
        style={styles.flashcard}
        onClick={() => setFlipped(!flipped)}
      >
        <div style={{
          ...styles.flashcardInner,
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}>
          <div style={styles.flashcardFront}>
            <div style={styles.flashcardContent}>{flashcards[currentIndex].front}</div>
            <div style={styles.flashcardHint}>Klikni pro odpověď</div>
          </div>
          <div style={styles.flashcardBack}>
            <div style={styles.flashcardContent}>{flashcards[currentIndex].back}</div>
          </div>
        </div>
      </div>

      <div style={styles.flashcardNav}>
        <button style={styles.navButton} onClick={prev}>← Předchozí</button>
        <span style={styles.flashcardCounter}>{currentIndex + 1} / {flashcards.length}</span>
        <button style={styles.navButton} onClick={next}>Další →</button>
      </div>
    </div>
  );
}

function FormulaSheet() {
  return (
    <div>
      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>Množiny bodů dané vlastnosti</h3>
        <div style={styles.formulaGrid}>
          <div style={styles.formulaItem}>
            <div style={styles.formulaName}>Osa úsečky AB</div>
            <div style={styles.formula}>o = {"{X; |AX| = |BX|}"}</div>
          </div>
          <div style={styles.formulaItem}>
            <div style={styles.formulaName}>Osa úhlu</div>
            <div style={styles.formula}>o = {"{M; dist(M, rameno₁) = dist(M, rameno₂)}"}</div>
          </div>
          <div style={styles.formulaItem}>
            <div style={styles.formulaName}>Thaletova kružnice</div>
            <div style={styles.formula}>T = {"{X; |∠AXB| = 90°}"}</div>
          </div>
          <div style={styles.formulaItem}>
            <div style={styles.formulaName}>Kružnice ε(φ)</div>
            <div style={styles.formula}>ε = {"{X; |∠AXB| = φ}"}</div>
          </div>
          <div style={styles.formulaItem}>
            <div style={styles.formulaName}>Kružnice</div>
            <div style={styles.formula}>k(S; r) = {"{X; |SX| = r}"}</div>
          </div>
          <div style={styles.formulaItem}>
            <div style={styles.formulaName}>Rovnoběžka ve vzdálenosti d</div>
            <div style={styles.formula}>p ∥ q ∧ dist(p, q) = d</div>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>Prvky trojúhelníku</h3>
        <div style={styles.formulaGrid}>
          <div style={styles.formulaItem}>
            <div style={styles.formulaName}>Strany</div>
            <div style={styles.formula}>a = BC, b = AC, c = AB</div>
          </div>
          <div style={styles.formulaItem}>
            <div style={styles.formulaName}>Vnitřní úhly</div>
            <div style={styles.formula}>α + β + γ = 180°</div>
          </div>
          <div style={styles.formulaItem}>
            <div style={styles.formulaName}>Výška vₐ</div>
            <div style={styles.formula}>vₐ ⊥ BC, A ∈ vₐ</div>
          </div>
          <div style={styles.formulaItem}>
            <div style={styles.formulaName}>Těžnice tₐ</div>
            <div style={styles.formula}>tₐ = ASbc (A → střed BC)</div>
          </div>
          <div style={styles.formulaItem}>
            <div style={styles.formulaName}>Těžiště</div>
            <div style={styles.formula}>T = tₐ ∩ tᵦ ∩ tᴄ, dělí těžnice 2:1</div>
          </div>
          <div style={styles.formulaItem}>
            <div style={styles.formulaName}>Trojúhelníková nerovnost</div>
            <div style={styles.formula}>a {"<"} b + c, b {"<"} a + c, c {"<"} a + b</div>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>Postup při řešení KÚ</h3>
        <div style={styles.procedureBox}>
          <div style={styles.procedureStep}>
            <span style={styles.procedureNum}>1</span>
            <span><strong>Náčrt a rozbor</strong> — nakresli hotový obrazec, vyznač známé prvky, analyzuj vztahy</span>
          </div>
          <div style={styles.procedureStep}>
            <span style={styles.procedureNum}>2</span>
            <span><strong>Postup konstrukce</strong> — sepiš kroky, každý objekt pojmenuj, nepoužívej nesestrojené</span>
          </div>
          <div style={styles.procedureStep}>
            <span style={styles.procedureNum}>3</span>
            <span><strong>Konstrukce</strong> — rýsuj podle postupu (nebo současně s ním)</span>
          </div>
          <div style={styles.procedureStep}>
            <span style={styles.procedureNum}>4</span>
            <span><strong>Diskuze</strong> — urči počet řešení (0, 1, 2, ..., ∞)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════════════════════════

export default function App() {
  const [activeTab, setActiveTab] = useState('theory');

  const tabs = [
    { id: 'theory', label: 'Teorie' },
    { id: 'notation', label: 'Značení' },
    { id: 'problems', label: 'Příklady' },
    { id: 'quiz', label: 'Kvíz' },
    { id: 'flashcards', label: 'Kartičky' },
    { id: 'formulas', label: 'Vzorce' }
  ];

  return (
    <div style={styles.container}>
      {/* Background */}
      <div style={styles.bgGrid}></div>
      <div style={styles.bgSun}></div>
      <div style={styles.bgParticle1}></div>
      <div style={styles.bgParticle2}></div>
      <div style={styles.bgParticle3}></div>

      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>Konstrukční úlohy</h1>
        <p style={styles.subtitle}>Kompletní příprava na písemku</p>
      </header>

      {/* Navigation */}
      <nav style={styles.nav}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            style={{
              ...styles.tabButton,
              ...(activeTab === tab.id ? styles.tabButtonActive : {})
            }}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main style={styles.main}>
        {activeTab === 'theory' && <TheorySection />}
        {activeTab === 'notation' && <NotationSection />}
        {activeTab === 'problems' && <ProblemsSection />}
        {activeTab === 'quiz' && <QuizEngine questions={quizQuestions} accentColor="#06b6d4" />}
        {activeTab === 'flashcards' && <FlashcardsSection />}
        {activeTab === 'formulas' && <FormulaSheet />}
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Audiowide&family=Exo+2:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes gridMove {
          0% { transform: perspective(500px) rotateX(60deg) translateY(0); }
          100% { transform: perspective(500px) rotateX(60deg) translateY(50px); }
        }

        @keyframes sunPulse {
          0%, 100% { box-shadow: 0 0 60px #ff006640, 0 0 120px #ff006620; }
          50% { box-shadow: 0 0 80px #ff006660, 0 0 160px #ff006630; }
        }

        @keyframes float1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -30px); }
        }

        @keyframes float2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-30px, 20px); }
        }

        @keyframes float3 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(15px, 25px); }
        }
      `}</style>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// STYLES
// ══════════════════════════════════════════════════════════════════════════════

const styles = {
  container: {
    minHeight: '100vh',
    background: '#0a0a1a',
    color: '#fff',
    fontFamily: "'Exo 2', sans-serif",
    position: 'relative',
    overflow: 'hidden'
  },

  // Background elements (synthwave)
  bgGrid: {
    position: 'fixed',
    bottom: 0,
    left: '-50%',
    right: '-50%',
    height: '40vh',
    background: 'repeating-linear-gradient(90deg, #06b6d420 0px, transparent 1px, transparent 50px), repeating-linear-gradient(0deg, #06b6d420 0px, transparent 1px, transparent 50px)',
    animation: 'gridMove 20s linear infinite',
    transformOrigin: 'center bottom',
    zIndex: 0
  },
  bgSun: {
    position: 'fixed',
    bottom: '15vh',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '300px',
    height: '150px',
    borderRadius: '300px 300px 0 0',
    background: 'linear-gradient(180deg, #ff0066 0%, #ff006600 100%)',
    animation: 'sunPulse 4s ease-in-out infinite',
    zIndex: 0
  },
  bgParticle1: {
    position: 'fixed',
    top: '20%',
    left: '10%',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#06b6d4',
    boxShadow: '0 0 20px #06b6d4',
    animation: 'float1 15s ease-in-out infinite',
    zIndex: 0
  },
  bgParticle2: {
    position: 'fixed',
    top: '40%',
    right: '15%',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#ff0066',
    boxShadow: '0 0 15px #ff0066',
    animation: 'float2 18s ease-in-out infinite',
    zIndex: 0
  },
  bgParticle3: {
    position: 'fixed',
    top: '60%',
    left: '20%',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: '#a855f7',
    boxShadow: '0 0 25px #a855f7',
    animation: 'float3 12s ease-in-out infinite',
    zIndex: 0
  },

  // Header
  header: {
    position: 'relative',
    zIndex: 1,
    textAlign: 'center',
    padding: '40px 20px 20px'
  },
  title: {
    fontFamily: "'Audiowide', cursive",
    fontSize: 'clamp(28px, 5vw, 42px)',
    background: 'linear-gradient(90deg, #06b6d4, #ff0066)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '8px'
  },
  subtitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '16px'
  },

  // Navigation
  nav: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '8px',
    padding: '0 20px 20px'
  },
  tabButton: {
    padding: '10px 18px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '20px',
    color: 'rgba(255,255,255,0.7)',
    cursor: 'pointer',
    fontSize: '14px',
    fontFamily: "'Exo 2', sans-serif",
    transition: 'all 0.4s ease'
  },
  tabButtonActive: {
    background: 'rgba(6,182,212,0.2)',
    borderColor: '#06b6d4',
    color: '#fff'
  },

  // Main content
  main: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '900px',
    margin: '0 auto',
    padding: '0 20px 40px'
  },

  // Cards
  card: {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '20px',
    padding: '24px',
    marginBottom: '20px',
    transition: 'all 0.4s ease'
  },

  // Typography
  sectionTitle: {
    fontFamily: "'Audiowide', cursive",
    fontSize: '20px',
    color: '#06b6d4',
    marginBottom: '16px'
  },
  p: {
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 1.6,
    marginBottom: '12px'
  },
  ul: {
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 1.8,
    paddingLeft: '24px',
    marginBottom: '12px'
  },
  ol: {
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 1.8,
    paddingLeft: '24px',
    marginBottom: '12px'
  },

  // Accordion
  accordionItem: {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '16px',
    marginBottom: '12px',
    overflow: 'hidden',
    transition: 'all 0.4s ease'
  },
  accordionHeader: {
    padding: '16px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    color: '#fff',
    fontWeight: 600,
    fontSize: '16px'
  },
  accordionContent: {
    padding: '0 20px 20px',
    borderTop: '1px solid rgba(255,255,255,0.1)'
  },

  // Steps
  stepBox: {
    display: 'flex',
    gap: '16px',
    padding: '16px',
    background: 'rgba(6,182,212,0.1)',
    borderRadius: '12px',
    marginBottom: '12px',
    border: '1px solid rgba(6,182,212,0.2)'
  },
  stepNum: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: '#06b6d4',
    color: '#0a0a1a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    flexShrink: 0
  },

  // Comparison boxes
  comparisonBox: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '0'
  },
  comparisonCol: {
    padding: '16px'
  },
  comparisonTitle: {
    color: '#06b6d4',
    marginBottom: '12px',
    fontWeight: 600
  },

  // Concept cards
  conceptCard: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '12px'
  },
  conceptTitle: {
    color: '#ff0066',
    marginBottom: '8px',
    fontWeight: 600
  },

  // Formula
  formula: {
    fontFamily: "'JetBrains Mono', monospace",
    background: 'rgba(6,182,212,0.1)',
    padding: '12px 16px',
    borderRadius: '8px',
    color: '#06b6d4',
    fontSize: '15px',
    marginBottom: '12px'
  },

  // Highlight box
  highlightBox: {
    background: 'rgba(255,0,102,0.15)',
    border: '1px solid rgba(255,0,102,0.3)',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '16px',
    color: '#fff'
  },

  // Table
  tableWrap: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px'
  },
  th: {
    textAlign: 'left',
    padding: '12px',
    background: 'rgba(6,182,212,0.2)',
    color: '#06b6d4',
    fontWeight: 600,
    borderBottom: '1px solid rgba(255,255,255,0.1)'
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    color: 'rgba(255,255,255,0.8)',
    fontFamily: "'JetBrains Mono', monospace"
  },

  // Problems
  problemsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px'
  },
  problemCard: {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '16px',
    padding: '20px',
    cursor: 'pointer',
    transition: 'all 0.4s ease'
  },
  problemCardTitle: {
    color: '#fff',
    fontSize: '16px',
    fontWeight: 600,
    marginTop: '8px',
    marginBottom: '8px'
  },
  problemCardDesc: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '13px',
    lineHeight: 1.5
  },
  diffBadge: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase',
    border: '1px solid'
  },
  backButton: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    color: '#fff',
    padding: '10px 16px',
    cursor: 'pointer',
    fontSize: '14px',
    marginBottom: '16px',
    fontFamily: "'Exo 2', sans-serif"
  },
  problemTitle: {
    fontSize: '18px',
    fontWeight: 700
  },
  zadaniBox: {
    background: 'rgba(6,182,212,0.1)',
    border: '1px solid rgba(6,182,212,0.2)',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '16px',
    color: 'rgba(255,255,255,0.9)'
  },
  revealButton: {
    background: 'rgba(255,0,102,0.2)',
    border: '1px solid #ff0066',
    borderRadius: '10px',
    color: '#fff',
    padding: '12px 24px',
    cursor: 'pointer',
    fontSize: '15px',
    fontFamily: "'Exo 2', sans-serif",
    transition: 'all 0.4s ease'
  },
  solutionBox: {
    marginTop: '20px',
    padding: '20px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.08)'
  },
  solutionSection: {
    marginBottom: '20px'
  },
  solutionTitle: {
    color: '#06b6d4',
    fontFamily: "'Audiowide', cursive",
    fontSize: '14px',
    marginBottom: '12px'
  },
  constructionStep: {
    fontFamily: "'JetBrains Mono', monospace",
    background: 'rgba(6,182,212,0.08)',
    padding: '8px 12px',
    borderRadius: '6px',
    marginBottom: '6px'
  },

  // Flashcards
  flashcardsWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
    padding: '20px'
  },
  dotBar: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  dot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'background 0.4s ease'
  },
  flashcard: {
    width: '100%',
    maxWidth: '400px',
    height: '250px',
    perspective: '1000px',
    cursor: 'pointer'
  },
  flashcardInner: {
    position: 'relative',
    width: '100%',
    height: '100%',
    transition: 'transform 0.4s ease',
    transformStyle: 'preserve-3d'
  },
  flashcardFront: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px'
  },
  flashcardBack: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    background: 'rgba(6,182,212,0.1)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(6,182,212,0.3)',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    transform: 'rotateY(180deg)'
  },
  flashcardContent: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '24px',
    textAlign: 'center',
    color: '#fff'
  },
  flashcardHint: {
    position: 'absolute',
    bottom: '20px',
    color: 'rgba(255,255,255,0.4)',
    fontSize: '13px'
  },
  flashcardNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  navButton: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    color: '#fff',
    padding: '10px 16px',
    cursor: 'pointer',
    fontSize: '14px',
    fontFamily: "'Exo 2', sans-serif"
  },
  flashcardCounter: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '14px'
  },

  // Formula sheet
  formulaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '12px'
  },
  formulaItem: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    padding: '16px'
  },
  formulaName: {
    color: '#ff0066',
    fontSize: '13px',
    fontWeight: 600,
    marginBottom: '8px'
  },
  procedureBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  procedureStep: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '12px',
    background: 'rgba(6,182,212,0.08)',
    borderRadius: '10px'
  },
  procedureNum: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: '#06b6d4',
    color: '#0a0a1a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '14px',
    flexShrink: 0
  }
};
