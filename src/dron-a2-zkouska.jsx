// @title Dron A2 — Příprava na zkoušku
// @subject Drony
// @topic Meteorologie · Zmírnění rizik · Letové charakteristiky
// @template quiz

import { useState, useCallback, useMemo } from 'react';

// ── Shuffle utilities ──────────────────────────────────────────
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

// ── Quiz Engine ────────────────────────────────────────────────
function QuizEngine({ questions, accentColor = "#06b6d4" }) {
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

  const handleSingleSelect = useCallback((optIdx) => {
    if (isRevealed) return;
    setAnswers(prev => ({ ...prev, [idx]: [optIdx] }));
    setRevealed(prev => ({ ...prev, [idx]: true }));
  }, [idx, isRevealed]);

  const toggleMulti = useCallback((optIdx) => {
    if (isRevealed) return;
    setPendingMulti(prev => prev.includes(optIdx) ? prev.filter(i => i !== optIdx) : [...prev, optIdx]);
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

  const QS = {
    wrap: { display: "flex", flexDirection: "column", gap: "16px" },
    dotBar: { display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap", marginBottom: "4px" },
    dot: { width: "20px", height: "20px", borderRadius: "50%", cursor: "pointer", transition: "background 0.4s ease", flexShrink: 0 },
    card: { background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "24px", transition: "all 0.4s ease" },
    qNum: { color: "rgba(255,255,255,0.35)", fontSize: "13px", marginBottom: "6px" },
    qText: { color: "#fff", fontSize: "17px", fontWeight: 600, lineHeight: 1.55, marginBottom: "20px" },
    optionsList: { display: "flex", flexDirection: "column", gap: "10px" },
    option: { padding: "12px 16px", borderRadius: "12px", color: "#fff", cursor: "pointer", transition: "all 0.4s ease", display: "flex", alignItems: "flex-start", gap: "10px", userSelect: "none", fontSize: "15px", lineHeight: 1.45 },
    btn: { marginTop: "12px", padding: "10px 22px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", color: "#fff", cursor: "pointer", fontSize: "15px", transition: "all 0.4s ease" },
    feedback: { marginTop: "20px", padding: "16px", borderRadius: "14px", border: "1px solid", background: "rgba(255,255,255,0.03)" },
    navRow: { display: "flex", justifyContent: "space-between" },
  };

  const activeSet = isMulti ? (isRevealed ? myAnswer : pendingMulti) : myAnswer;

  if (showResults) {
    const msg = pct >= 90 ? "Výborně! Jsi připraven/á na zkoušku!" : pct >= 75 ? "Dobře! Ještě pár opakování a budeš fit." : pct >= 50 ? "Správný směr — ale ještě procvič slabší oblasti." : "Potřebuješ více procvičit. Nevzdávej to!";
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "300px" }}>
        <div style={{ textAlign: "center", background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "24px", padding: "40px 48px" }}>
          <div style={{ fontSize: "18px", color: "rgba(255,255,255,0.5)", marginBottom: "8px" }}>Výsledek</div>
          <div style={{ color: "#fff", fontSize: "56px", fontWeight: 800, lineHeight: 1 }}>{score}/{shuffledQuestions.length}</div>
          <div style={{ color: accentColor, fontSize: "26px", fontWeight: 700, margin: "8px 0 20px" }}>{pct} %</div>
          <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "16px", lineHeight: 1.5, marginBottom: "28px", maxWidth: "320px" }}>{msg}</div>
          <button style={{ ...QS.btn, background: accentColor + "33", border: `1px solid ${accentColor}`, marginTop: 0 }} onClick={restart}>Začít znovu</button>
        </div>
      </div>
    );
  }

  return (
    <div style={QS.wrap}>
      <div style={QS.dotBar}>
        {shuffledQuestions.map((_, i) => {
          let bg = "#374151";
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
            let border = "1px solid rgba(255,255,255,0.1)";
            let bg = "rgba(255,255,255,0.04)";
            if (isRevealed) {
              if (q.correct.includes(i)) { bg = "rgba(34,197,94,0.15)"; border = "1px solid #22c55e"; }
              else if (activeSet.includes(i)) { bg = "rgba(239,68,68,0.15)"; border = "1px solid #ef4444"; }
            } else if (activeSet.includes(i)) {
              bg = accentColor + "1a"; border = `1px solid ${accentColor}`;
            }
            return (
              <div key={i} style={{ ...QS.option, background: bg, border }} onClick={() => isMulti ? toggleMulti(i) : handleSingleSelect(i)}>
                {isMulti && <span style={{ fontSize: "18px", marginTop: "1px" }}>{activeSet.includes(i) ? "☑" : "☐"}</span>}
                <span>{opt}</span>
              </div>
            );
          })}
        </div>
        {isMulti && !isRevealed && (
          <button style={{ ...QS.btn, opacity: pendingMulti.length === 0 ? 0.4 : 1 }} onClick={submitMulti} disabled={pendingMulti.length === 0}>Potvrdit</button>
        )}
        {isRevealed && (
          <div style={{ ...QS.feedback, borderColor: isCorrect ? "#22c55e" : "#ef4444" }}>
            <div style={{ color: isCorrect ? "#4ade80" : "#f87171", fontWeight: 700, fontSize: "15px", marginBottom: "6px" }}>{isCorrect ? "✓ Správně!" : "✗ Špatně"}</div>
            {!isCorrect && <div style={{ color: "#86efac", fontSize: "14px", marginBottom: "8px" }}>Správná odpověď: <strong>{q.correct.map(i => q.options[i]).join(", ")}</strong></div>}
            <div style={{ color: "rgba(255,255,255,0.72)", fontSize: "14px", lineHeight: 1.55 }}>{q.explanation}</div>
            {q.tip && <div style={{ color: "#fbbf24", fontSize: "13px", marginTop: "10px", fontStyle: "italic" }}>💡 {q.tip}</div>}
          </div>
        )}
      </div>
      <div style={QS.navRow}>
        <button style={QS.btn} onClick={() => goTo(idx - 1)} disabled={idx === 0}>← Předchozí</button>
        {idx < shuffledQuestions.length - 1
          ? <button style={QS.btn} onClick={() => goTo(idx + 1)}>Další →</button>
          : <button style={{ ...QS.btn, background: accentColor + "33", border: `1px solid ${accentColor}` }} onClick={() => setShowResults(true)}>Výsledky →</button>
        }
      </div>
    </div>
  );
}

// ── Question data ──────────────────────────────────────────────
const meteorologieQ = [
  {
    question: "Jak se mění vítr s nadmořskou výškou?",
    type: "single",
    options: ["Roste", "Slábne", "Zůstává stejný", "Kolísá nahodile"],
    correct: [0],
    explanation: "S rostoucí nadmořskou výškou vítr zesiluje. Zemský povrch způsobuje tření, které zpomaluje vzduch v nižších vrstvách. Ve vyšších výškách je tření minimální a vzduch proudí rychleji.",
    tip: "Výška → méně tření → silnější vítr"
  },
  {
    question: "Co hrozí dronu na závětrné straně budov?",
    type: "single",
    options: ["Zlepšená viditelnost", "Ztráta GPS signálu", "Turbulence", "Zvýšení rychlosti letu"],
    correct: [2],
    explanation: "Na závětrné (odvrácené) straně budov vznikají turbulence — vzduch obtékající budovu vytváří víry a nestabilní proudění. Turbulence mohou způsobit nekontrolované pohyby dronu.",
  },
  {
    question: "Co udělat, když za letu pilot zjistí, že se blíží bouřka?",
    type: "single",
    options: ["Letět směrem k bouřce", "Pokračovat v létání a doufat, že to dobře dopadne", "Schovat dron pod stromem", "Okamžitě přerušit leteckou činnost"],
    correct: [3],
    explanation: "Při přiblížení bouřky musíte OKAMŽITĚ ukončit let a bezpečně přistát. Bouřky přinášejí extrémní vítr, turbulence, blesk a silné srážky. Schování pod stromem je samo o sobě nebezpečné (blesk).",
    tip: "Bouřka = okamžité přistání, bez výjimek"
  },
  {
    question: "Jaký je vliv teploty na hustotu vzduchu?",
    type: "single",
    options: ["Teplota nemá vliv na hustotu vzduchu", "Hustota vzduchu závisí jen na nadmořské výšce", "Čím je teplota vyšší, tím je vzduch řidší", "Čím je teplota nižší, tím je vzduch hustší"],
    correct: [3],
    explanation: "Nižší teplota = hustší vzduch (molekuly se méně pohybují a jsou blíže u sebe). Hustší vzduch zlepšuje výkon rotorů. Proto dron létá lépe v chladu než ve vedru.",
    tip: "Chlad → hustší vzduch → lepší výkon rotorů"
  },
  {
    question: "Jaký je vztah mezi rychlostí větru a výškou?",
    type: "single",
    options: ["Vítr je stejně rychlý v jakékoli výšce", "Čím výš, tím je vítr rychlejší", "Výška nemá vliv na rychlost větru", "Čím výš, tím je vítr slabší"],
    correct: [1],
    explanation: "S výškou rychlost větru roste. Zemský povrch způsobuje tření, které brzdí vzduch u povrchu. Ve větší výšce tato brzdná síla chybí a vítr je tak rychlejší a stálejší.",
  },
  {
    question: "Je důležité znát meteorologické podmínky před letem UA?",
    type: "single",
    options: ["Ano — počasí může výrazně ovlivnit bezpečnost a výkon UA", "Pouze pokud očekáváte bouřky", "Ano, ale jen při letu nad 100 m", "Ne — technologie UA se přizpůsobí sama"],
    correct: [0],
    explanation: "Meteorologické podmínky musíte zkontrolovat před KAŽDÝM letem. Počasí ovlivňuje výkon rotorů (hustota vzduchu), stabilitu (vítr, turbulence) i viditelnost. Pilot za toto nese plnou odpovědnost.",
  },
  {
    question: "Jak se mění vítr s rostoucí výškou nad zemí?",
    type: "single",
    options: ["Vítr je teplejší", "Vítr je slabší", "Vítr je silnější", "Vítr je nárazovitější"],
    correct: [2],
    explanation: "S rostoucí výškou nad zemí je vítr silnější. Oddalujeme se od zemského povrchu, kde tření vzduch zpomaluje. Ve výšce je proudění stálejší, ale rychlejší — počítejte s vyšší spotřebou baterie.",
  },
  {
    question: "Za větrných podmínek v blízkosti překážek lze důvodně očekávat, že:",
    type: "single",
    options: ["v místě dojde k poklesu teploty", "v místě dojde k nárůstu teploty", "bezpilotní letadlo bude standardně unášeno ve směru větru", "bude docházet k turbulencím vzduchu"],
    correct: [3],
    explanation: "Překážky (budovy, stromy, terén) narušují laminární proudění vzduchu a vytvářejí turbulentní víry. Turbulence jsou nepředvídatelné — mohou způsobit nekontrolovatelné pohyby nebo pád dronu.",
  },
  {
    question: "Při vysokých letních teplotách je třeba brát v úvahu:",
    type: "single",
    options: ["Sníženou letovou výkonnost vlivem vyšší hustoty vzduchu", "Zvýšenou letovou výkonnost vlivem nižší hustoty vzduchu", "Sníženou letovou výkonnost vlivem nižší hustoty vzduchu", "Zvýšenou letovou výkonnost vlivem vyšší hustoty vzduchu"],
    correct: [2],
    explanation: "Vysoké teploty = nižší hustota vzduchu = snížená letová výkonnost. Rotory musejí pracovat intenzivněji, baterie se rychleji zahřívají a vybíjejí. Maximální nosnost i doba letu klesají.",
    tip: "Léto → řidší vzduch → dron pracuje víc, let kratší"
  },
  {
    question: "Co byste měl dělat, pokud se k vaší oblasti provozu blíží bouřka?",
    type: "single",
    options: ["Snížit otáčky rotorů", "Zvýšit otáčky rotorů", "Nadále klidně létat", "Leteckou činnost urychleně ukončit"],
    correct: [3],
    explanation: "Leteckou činnost je třeba urychleně ukončit a přistát. Bouřka přináší extrémně nebezpečné podmínky: prudký vítr, turbulence, blesk a srážky. Každá minuta prodlevy zvyšuje riziko nehody.",
    tip: "Přibližující se bouřka = OKAMŽITĚ PŘISTÁT"
  },
];

const technikaQ = [
  {
    question: "Co je GRC a co ho určuje?",
    type: "single",
    options: ["Globální radiokomunikace závislá na frekvenci", "Geolokační režim chování dronu", "Graf rozložení elektrického náboje", "Pozemní riziko závislé na rozměrech dronu a provozním scénáři"],
    correct: [3],
    explanation: "GRC (Ground Risk Class) = Pozemní třída rizika. Závisí na charakteristickém rozměru dronu a hustotě zalidnění provozní oblasti. Čím větší dron a více lidí v okolí, tím vyšší GRC.",
    tip: "GRC = velikost dronu × zalidnění oblasti"
  },
  {
    question: "Pomocí jakého pravidla lze snížit GRC?",
    type: "single",
    options: ["Pravidlo 2:1", "Pravidlo 3:1", "Pravidlo 1:2", "Pravidlo 1:1"],
    correct: [3],
    explanation: "Pravidlo 1:1: udržuj horizontální vzdálenost od nezúčastněných osob alespoň rovnou výšce letu. Při nouzovém přistání pak dron nedopadne na osoby v okolí — tím se GRC snižuje.",
    tip: "1:1 = vzdálenost od osob (m) ≥ výška letu (m)"
  },
  {
    question: "Jak správně skladovat LiPol baterie?",
    type: "single",
    options: ["Uchovávat v plně nabitém stavu", "Nabít/vybít na jmenovité (skladovací) napětí", "Skladovat v chladu bez jakéhokoli nabití", "Skladovat na teplém a vlhkém místě"],
    correct: [1],
    explanation: "LiPol baterie se skladují na jmenovitém napětí (≈3,7–3,85 V/článek, tj. 50–60% nabití). Plně nabitá nebo úplně vybitá baterie degraduje rychleji a zvyšuje riziko vznícení.",
    tip: "Skladování = 50–60% nabití (~3,85 V/článek)"
  },
  {
    question: "Co dělat s nafouklou LiPol baterií?",
    type: "single",
    options: ["Stačí ji vyfouknout a dál používat", "Je nutné ji vyměnit", "Může být bezpečně recyklována a pak znovu použita", "Lze pokračovat v létání — nafouknutí je normální"],
    correct: [1],
    explanation: "Nafouklá LiPol baterie je NEBEZPEČNÁ a musíte ji IHNED vyřadit z provozu. Nafouknutí (bulging) signalizuje vnitřní chemické poruchy — hrozí vzplanutí nebo výbuch. Nikdy nelétejte s nafouklou baterií!",
    tip: "Nafouklá baterie → okamžitě vyměnit!"
  },
  {
    question: "Kdo odpovídá za riziko při provozu bezpilotního systému?",
    type: "single",
    options: ["Pilot (vzdálený pilot)", "Úřad pro civilní letectví (ÚCL)", "Výrobce dronu", "Obchod, kde byl dron zakoupen"],
    correct: [0],
    explanation: "Vzdálený pilot nese plnou odpovědnost za bezpečný provoz UA. Musí znát platné předpisy, zkontrolovat dron před letem, posoudit počasí a dodržovat pravidla provozu dle nařízení EU 2019/947.",
  },
  {
    question: "Je možný provoz DJI Phantom 3 (1,3 kg) v podkategorii A2?",
    type: "single",
    options: ["Je možný", "Vyžaduje zvláštní povolení od ÚCL", "Je možný jen v noci", "Je zakázán — chybí třída C2"],
    correct: [0],
    explanation: "Phantom 3 (1,3 kg) splňuje hmotnostní limit A2 (max 4 kg). Starší drony bez označení třídy C2 mohou být provozovány v A2 na základě přechodných ustanovení nařízení EU 2019/947.",
  },
  {
    question: "Jaká je minimální horizontální vzdálenost od nezúčastněných osob v podkategorii A2?",
    type: "single",
    options: ["10 m", "30 m", "50 m", "100 m"],
    correct: [1],
    explanation: "V podkategorii A2 musíte udržovat minimálně 30 m od nezúčastněných osob. Vzdálenost lze snížit na 5 m, pokud je aktivován nízkorychlostní režim (max 3 m/s) u dronu třídy C2.",
    tip: "A2 standardní vzdálenost = 30 m"
  },
  {
    question: "Na jakou vzdálenost lze zkrátit odstup od nezúčastněných osob při aktivaci nízkorychlostního režimu?",
    type: "single",
    options: ["0 m — není omezení", "5 m", "15 m", "30 m — nelze snížit"],
    correct: [1],
    explanation: "Při aktivaci nízkorychlostního režimu (max 3 m/s) lze vzdálenost snížit z 30 m na minimum 5 m. Platí pro drony třídy C2 nebo starší drony provozované v rámci přechodných ustanovení.",
    tip: "Low-speed mode (≤3 m/s) → min vzdálenost 5 m"
  },
];

const letoveQ = [
  {
    question: "Jaký je rozdíl mezi MTOM a MTOW?",
    type: "single",
    options: ["MTOW zahrnuje hmotnost paliva, MTOM ne", "MTOM je pouze pro komerční letadla", "MTOM platí pro letadla nad 25 kg", "Žádný — obě označení znamenají maximální vzletovou hmotnost"],
    correct: [3],
    explanation: "MTOM (Maximum Take-Off Mass) a MTOW (Maximum Take-Off Weight) jsou synonyma. Obě označení vyjadřují maximální povolenou hmotnost letadla při vzletu. V EASA regulacích se standardně používá MTOM.",
  },
  {
    question: "Jakou maximální rychlostí může UA létat v kategorii OPEN?",
    type: "single",
    options: ["120 km/h", "500 km/h", "250 km/h", "30 km/h"],
    correct: [0],
    explanation: "V kategorii OPEN je maximální rychlost UA omezena na 120 km/h (≈33 m/s). Toto omezení platí pro všechny třídy dronů (C0–C4) v otevřené kategorii dle nařízení EU 2019/945.",
    tip: "OPEN kategorie max rychlost = 120 km/h"
  },
  {
    question: "Kdo stanovuje provozní omezení bezpilotního letadla (max vítr, max teplota atd.)?",
    type: "single",
    options: ["Provozovatel na základě vlastního posouzení", "Výrobce dronu", "Úřad pro civilní letectví (ÚCL)", "EASA"],
    correct: [1],
    explanation: "Výrobce stanovuje provozní limity dronu — maximální povolenou rychlost větru, teplotní rozsah, maximální výšku atd. Tato omezení jsou v návodu k použití a pilot je MUSÍ respektovat.",
  },
  {
    question: "Co značí označení 'S' na LiPol baterii (např. 4S)?",
    type: "single",
    options: ["Rychlost nabíjení (Speed)", "Počet článků v sérii", "Bezpečnostní stupeň (Safety)", "Kapacitu v mAh"],
    correct: [1],
    explanation: "S = Series = počet článků zapojených v sérii. Každý LiPol článek má nominální napětí 3,7 V. Baterie 4S = 4 × 3,7 V = 14,8 V nominálně (plně nabitá: 4 × 4,2 V = 16,8 V).",
    tip: "S = Série → napětí se NÁSOBÍ (4S = 14,8 V)"
  },
  {
    question: "Co značí označení 'P' na LiPol baterii (např. 2P)?",
    type: "single",
    options: ["Výkon (Power)", "Počet článků v paralelním zapojení", "Stupeň ochrany (Protection)", "Počet nabíjecích cyklů"],
    correct: [1],
    explanation: "P = Parallel = počet článků zapojených paralelně. Paralelní zapojení zvyšuje kapacitu (mAh), ale nemění napětí. Baterie 2P má dvojnásobnou kapacitu oproti 1P při stejném napětí.",
    tip: "P = Paralelně → kapacita se NÁSOBÍ (2P = 2× mAh)"
  },
  {
    question: "Co značí označení 'C' na LiPol baterii (např. 20C)?",
    type: "single",
    options: ["Kapacitu v mAh", "Celsius — provozní teplotu baterie", "Vybíjecí/nabíjecí rychlost (C-rating)", "Počet nabíjecích cyklů"],
    correct: [2],
    explanation: "C = C-rating = vybíjecí nebo nabíjecí rychlost jako násobek kapacity. Baterie 20C s kapacitou 2000 mAh (= 2 Ah) může dodat max 20 × 2 = 40 A kontinuálně.",
    tip: "C-rating × kapacita (Ah) = maximální proud (A)"
  },
  {
    question: "Jaké je jmenovité (nominální) napětí jednoho článku LiPol baterie?",
    type: "single",
    options: ["3,7 V", "1,5 V", "12 V", "7,4 V"],
    correct: [0],
    explanation: "Jeden LiPol článek má nominální napětí 3,7 V. Plně nabitý článek má 4,2 V, minimální bezpečné napětí je cca 3,0–3,5 V. Napětí baterie = 3,7 V × počet článků S.",
    tip: "1 článek LiPol: nominál 3,7 V | max 4,2 V | min 3,0 V"
  },
  {
    question: "Jaký nabíjecí proud odpovídá hodnocení 5C pro baterii 1500 mAh?",
    type: "single",
    options: ["7,5 A", "5 A", "1,5 A", "3 A"],
    correct: [0],
    explanation: "Proud = C-rating × kapacita (Ah) = 5 × 1,5 Ah = 7,5 A. Standardní bezpečné nabíjení je 1C → pro 1500 mAh = 1,5 A. Nabíjení 5C je rychlé a mírně namáhá baterii.",
    tip: "I (A) = C × kapacita (Ah) → 5 × 1,5 = 7,5 A"
  },
  {
    question: "Jak se mění výkonnost dronu při létání v horký letní den?",
    type: "single",
    options: ["Zvyšuje se — baterie pracují efektivněji v teple", "Snižuje se — nižší hustota vzduchu zhoršuje výkon rotorů", "Nemění se — dron je teplotně kompenzovaný", "Závisí výhradně na výrobci dronu"],
    correct: [1],
    explanation: "V horkém letním dni je vzduch řidší (nižší hustota). Rotory musejí pracovat intenzivněji pro udržení výšky, baterie se zahřívají a rychleji vybíjejí. Výkonnost a nosnost klesají.",
    tip: "Teplo → řidší vzduch → horší výkon, kratší let"
  },
  {
    question: "Jak zkontrolovat baterii při podezření na nesprávné napětí článku?",
    type: "single",
    options: ["Voltmetrem nebo cell-checkerem (měřičem článků)", "Dotykem — přehřátí signalizuje problém", "Nabít baterii a sledovat indikátor na dronu", "Zvážením baterie na váze"],
    correct: [0],
    explanation: "Napětí každého článku se měří voltmetrem nebo cell-checkerem. Správné nominální napětí je 3,7 V/článek. Odchylka >0,1 V mezi články nebo napětí mimo rozsah 3,0–4,2 V signalizuje problém.",
  },
  {
    question: "Jaká je maximální rychlost letu v nízkorychlostním režimu (low-speed mode)?",
    type: "single",
    options: ["3 m/s", "10 m/s", "19 m/s", "30 m/s"],
    correct: [0],
    explanation: "Nízkorychlostní režim omezuje rychlost dronu na max 3 m/s. Aktivace tohoto režimu umožňuje létat blíže k nezúčastněným osobám (min 5 m místo standardních 30 m) v podkategorii A2.",
    tip: "Low-speed mode = max 3 m/s → přiblížit na 5 m od osob"
  },
  {
    question: "Co se děje s dobou letu LiPol baterií při létání v zimě?",
    type: "single",
    options: ["Prodlužuje se — chlad zlepšuje výkon baterie", "Zkracuje se — nízká teplota snižuje kapacitu baterie", "Nemění se — LiPol baterie jsou teplotně stabilní", "Závisí jen na výrobci baterie"],
    correct: [1],
    explanation: "Nízká teplota výrazně snižuje kapacitu LiPol baterií a zvyšuje jejich vnitřní odpor. Kapacita může klesnout i o 20–30 %. Doporučení: baterie zahřejte na pokojovou teplotu těsně před letem.",
    tip: "Zima → studená baterie → kratší let (zahřejte před letem!)"
  },
  {
    question: "Co je těžiště bezpilotního letadla?",
    type: "single",
    options: ["Bod, kde je hmotnost rovnoměrně rozložena ve všech směrech (vyvažovací bod)", "Nejnižší bod dronu při hoveru", "Geometrický střed tvaru rámu dronu", "Bod, kde jsou připevněny motory"],
    correct: [0],
    explanation: "Těžiště (Center of Gravity — CG) je bod, v němž lze soustředit veškerou hmotnost tělesa. Správně vycentrované těžiště zajišťuje stabilní let. Pokud je CG posunuté, dron se naklání a hůře reaguje na povely.",
    tip: "Těžiště = vyvažovací bod dronu → musí být centrované"
  },
];

// ── Theory content ─────────────────────────────────────────────
const theoryData = {
  meteorologie: {
    icon: "🌤",
    color: "#06b6d4",
    sections: [
      {
        title: "Vítr a výška",
        content: "S rostoucí nadmořskou výškou vítr zesiluje a stává se stálejším. Zemský povrch způsobuje tření, které brzdí vzduch v nižších vrstvách. Ve výšce nad 100 m je vítr zpravidla výrazně silnější než u povrchu."
      },
      {
        title: "Turbulence u překážek",
        content: "Budovy, stromy a terénní nerovnosti narušují laminární proudění vzduchu. Na závětrné (odvrácené) straně překážek vznikají turbulentní víry. Létat v blízkosti překážek je nebezpečné zejména za větrného počasí."
      },
      {
        title: "Hustota vzduchu a teplota",
        content: "Teplejší vzduch má nižší hustotu — molekuly se rychle pohybují a expandují. Chladnější vzduch je hustší. Hustší vzduch = lepší výkon rotorů. Při horkém počasí a ve velkých nadmořských výškách výkon dronu klesá."
      },
      {
        title: "Vliv počasí na výkon UA",
        content: "Meteorologické podmínky přímo ovlivňují: (1) výkon rotorů — hustota vzduchu; (2) spotřebu baterie — vítr nutí motory pracovat více; (3) stabilitu letu — turbulence; (4) viditelnost — mlha, déšť; (5) životnost baterie — teplota."
      },
      {
        title: "Bouřky — pravidlo",
        content: "Při přiblížení bouřky OKAMŽITĚ ukončte let a přistajte. Bouřky přinášejí: extrémní nárazový vítr, turbulence, blesk (nebezpečí pro dron i pilota), silné srážky, náhlé změny viditelnosti. Nikdy nelétejte v blízkosti bouřky."
      },
    ]
  },
  technika: {
    icon: "🛡",
    color: "#8b5cf6",
    sections: [
      {
        title: "GRC — Pozemní třída rizika",
        content: "GRC (Ground Risk Class) vyjadřuje míru rizika pro osoby na zemi. Závisí na: (1) charakteristickém rozměru dronu — větší dron = vyšší riziko; (2) provozním scénáři — hustota zalidnění oblasti. Vyšší GRC vyžaduje přísnější zmírnění rizika."
      },
      {
        title: "Pravidlo 1:1",
        content: "Pravidlo 1:1 pro snížení GRC: udržuj horizontální vzdálenost od nezúčastněných osob alespoň rovnou výšce letu. Příklad: let ve výšce 50 m → min 50 m od osob. Při nouzovém přistání pak dron nedopadne na osoby."
      },
      {
        title: "Vzdálenosti v kategorii A2",
        content: "Standardně: min 30 m od nezúčastněných osob. S nízkorychlostním režimem (max 3 m/s): min 5 m od nezúčastněných osob. Provoz nad shromažděními lidí je v kategorii OPEN zakázán vždy."
      },
      {
        title: "LiPol baterie — skladování",
        content: "Správné skladování prodlužuje životnost a zvyšuje bezpečnost: skladujte na 50–60% nabití (≈3,85 V/článek, storage charge). Plně nabitá baterie degraduje. Vybitá baterie (< 3,0 V/článek) se může poškodit nenávratně."
      },
      {
        title: "Nafouklá baterie",
        content: "Nafouknutí (bulging) LiPol baterie je vážný bezpečnostní problém. Příčiny: přebitá, přehřátá nebo poškozená baterie. Důsledky: hrozí vzplanutí nebo výbuch. Okamžitě vyřaďte takovou baterii z provozu a nevystavujte ji teplu."
      },
      {
        title: "Odpovědnost pilota",
        content: "Vzdálený pilot nese plnou právní i morální odpovědnost za: bezpečný provoz dronu, dodržení vzdáleností od osob, kontrolu technického stavu dronu, znalost a dodržení platných předpisů (nařízení EU 2019/947)."
      },
    ]
  },
  letove: {
    icon: "⚙️",
    color: "#f59e0b",
    sections: [
      {
        title: "LiPol baterie — označení S, P, C",
        content: "S (Series): počet článků v sérii — zvyšuje napětí. 1 článek = 3,7 V nominálně; 4S = 14,8 V.\nP (Parallel): počet článků paralelně — zvyšuje kapacitu (mAh), ne napětí. 2P = dvojnásobná kapacita.\nC (C-rating): vybíjecí/nabíjecí rychlost. Maximální proud = C × kapacita (Ah)."
      },
      {
        title: "Výpočty s baterií",
        content: "Napětí baterie = 3,7 V × počet článků S\nPlně nabitá = 4,2 V × S\nNabíjecí/vybíjecí proud = C-rating × kapacita (Ah)\nPříklad: 5C, 1500 mAh → 5 × 1,5 Ah = 7,5 A\nStandardní bezpečné nabíjení: 1C (pro 1500 mAh = 1,5 A)"
      },
      {
        title: "Výkon UA v různých podmínkách",
        content: "Teplota: teplo → řidší vzduch → horší výkon, kratší let. Chlad → hustší vzduch → lepší výkon rotorů, ale kratší let kvůli baterii.\nNadmořská výška: větší výška → řidší vzduch → horší výkon.\nVítr: silný vítr zvyšuje spotřebu energie rotorů."
      },
      {
        title: "MTOM / MTOW a rychlostní limity",
        content: "MTOM = MTOW = Maximum Take-Off Mass (hmotnost). Jsou to synonyma — v EASA se používá MTOM.\nKategorie A2: MTOM max 4 kg (třída C2).\nKategorie OPEN max rychlost: 120 km/h.\nNízkorychlostní režim: max 3 m/s."
      },
      {
        title: "Těžiště a vyvážení",
        content: "Těžiště (Center of Gravity) = bod, v němž lze soustředit veškerou hmotnost tělesa. Správně vycentrované těžiště je klíčové pro stabilní let. Posunuté těžiště způsobuje naklánění dronu a vyžaduje kompenzaci rotory, což zvyšuje spotřebu."
      },
      {
        title: "Provozní omezení a jejich zdroj",
        content: "Provozní limity dronu (max vítr, min/max teplota, max výška, max rychlost) stanovuje VÝROBCE v návodu k použití. Pilot je musí znát a VŽDY dodržovat. ÚCL a EASA vydávají legislativní předpisy — celkový rámec, ne konkrétní technické limity každého dronu."
      },
    ]
  }
};

// ── Flashcards ─────────────────────────────────────────────────
const flashcards = [
  { front: "GRC", back: "Ground Risk Class — Pozemní třída rizika\nZávisí na: rozměru dronu + zalidnění oblasti\nVyšší GRC → přísnější opatření" },
  { front: "Pravidlo 1:1", back: "Horizontální vzdálenost od osob ≥ výška letu\nSnižuje GRC\nPříklad: let 50 m → min 50 m od osob" },
  { front: "LiPol — S (Series)", back: "Počet článků zapojených v sérii\nZvyšuje NAPĚTÍ\n4S baterie = 4 × 3,7 V = 14,8 V nominálně" },
  { front: "LiPol — P (Parallel)", back: "Počet článků zapojených paralelně\nZvyšuje KAPACITU (mAh)\n2P = dvojnásobná kapacita, stejné napětí" },
  { front: "LiPol — C-rating", back: "Vybíjecí/nabíjecí rychlost jako násobek kapacity\nMax proud (A) = C × kapacita (Ah)\n20C, 2000 mAh → max 40 A" },
  { front: "Nominální napětí LiPol článku", back: "3,7 V nominálně\nPlně nabitý: 4,2 V\nMinimální bezpečné: 3,0–3,5 V\nSkladovací: ~3,85 V" },
  { front: "Hustota vzduchu a teplota", back: "Teplejší vzduch → nižší hustota → horší výkon\nChladnější vzduch → vyšší hustota → lepší výkon rotorů\nAle zima = kratší let kvůli baterii!" },
  { front: "Max rychlost v OPEN kategorii", back: "120 km/h (≈33 m/s)\nPlatí pro všechny třídy C0–C4\nZdroj: nařízení EU 2019/945" },
  { front: "A2 — vzdálenost od osob", back: "Standardně: min 30 m od nezúčastněných osob\nS low-speed mode (≤3 m/s): min 5 m\nNad shromážděními: vždy zakázáno" },
  { front: "Nízkorychlostní režim", back: "Omezuje rychlost dronu na max 3 m/s\nUmožňuje přiblížit se na 5 m od osob (místo 30 m)\nPlatí pro třídu C2 nebo přechodné drony" },
  { front: "MTOM / MTOW", back: "Synonyma = Maximum Take-Off Mass / Weight\nMaximální vzletová hmotnost\nA2 (C2): max MTOM 4 kg" },
  { front: "Těžiště (Center of Gravity)", back: "Bod, kde lze soustředit veškerou hmotnost\nMusí být správně vycentrováno\nPosunuté CG → naklánění, nestabilita, vyšší spotřeba" },
  { front: "Bouřka — pravidlo pilota", back: "OKAMŽITĚ ukončit let a přistát\nBouřka = extrémní vítr, turbulence, blesk, srážky\nKaždá prodleva = vyšší riziko" },
  { front: "Nafouklá LiPol baterie", back: "NEBEZPEČNÁ — ihned vyřadit z provozu\nPříčiny: přebitá, přehřátá, poškozená baterie\nHrozí vzplanutí nebo výbuch" },
];

// ── Cheat sheet ────────────────────────────────────────────────
const cheatSections = [
  {
    title: "🔢 Klíčová čísla",
    items: [
      ["Max rychlost v kategorii OPEN", "120 km/h"],
      ["Max výška v kategorii OPEN", "120 m AGL"],
      ["A2 min vzdálenost od osob", "30 m"],
      ["A2 s low-speed mode", "5 m"],
      ["Max rychlost low-speed mode", "3 m/s"],
      ["A2 MTOM max (C2 třída)", "4 kg"],
      ["Nominální napětí LiPol článku", "3,7 V"],
      ["Plně nabitý LiPol článek", "4,2 V"],
      ["Minimální napětí LiPol článku", "3,0–3,5 V"],
      ["LiPol skladovací napětí", "~3,85 V (50–60%)"],
    ]
  },
  {
    title: "📐 Výpočetní vzorce",
    items: [
      ["Napětí baterie", "3,7 V × počet článků S"],
      ["Plné napětí baterie", "4,2 V × S"],
      ["Max proud baterie", "C-rating × kapacita (Ah)"],
      ["Nabíjecí proud 1C, 1500 mAh", "1 × 1,5 = 1,5 A"],
      ["Nabíjecí proud 5C, 1500 mAh", "5 × 1,5 = 7,5 A"],
      ["Pravidlo 1:1", "vzdálenost od osob (m) ≥ výška letu (m)"],
    ]
  },
  {
    title: "📜 Klíčová pravidla",
    items: [
      ["Bouřka se blíží", "→ OKAMŽITĚ přistát"],
      ["Nafouklá baterie", "→ okamžitě vyměnit, nelétejte!"],
      ["Skladování LiPol", "→ nabít na 50–60% (storage charge)"],
      ["Vyšší výška", "→ silnější vítr, řidší vzduch"],
      ["Vyšší teplota", "→ řidší vzduch → horší výkon UA"],
      ["Nízká teplota (zima)", "→ kratší let (baterie), lepší výkon rotorů"],
      ["Odpovídá za riziko", "→ vzdálený pilot"],
      ["Provozní limity dronu", "→ stanovuje výrobce"],
      ["Za překážkami (závětrná strana)", "→ hrozí turbulence"],
    ]
  }
];

// ── Main App ───────────────────────────────────────────────────
export default function App() {
  const [mainTab, setMainTab] = useState('teorie');
  const [theoryCategory, setTheoryCategory] = useState('meteorologie');
  const [openSection, setOpenSection] = useState(null);
  const [quizCategory, setQuizCategory] = useState('vse');
  const [quizKey, setQuizKey] = useState(0);
  const [cardIdx, setCardIdx] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);

  const allQuestions = [...meteorologieQ, ...technikaQ, ...letoveQ];
  const quizQuestions = quizCategory === 'meteorologie' ? meteorologieQ
    : quizCategory === 'technika' ? technikaQ
    : quizCategory === 'letove' ? letoveQ
    : allQuestions;

  const changeQuizCategory = (cat) => {
    setQuizCategory(cat);
    setQuizKey(k => k + 1);
  };

  const nextCard = () => { setCardIdx(i => (i + 1) % flashcards.length); setCardFlipped(false); };
  const prevCard = () => { setCardIdx(i => (i - 1 + flashcards.length) % flashcards.length); setCardFlipped(false); };

  const mainTabs = [
    { id: 'teorie', label: '📚 Teorie' },
    { id: 'kviz', label: '🧠 Kvíz' },
    { id: 'karticky', label: '🃏 Kartičky' },
    { id: 'tahak', label: '📋 Tahák' },
  ];

  const cats = [
    { id: 'meteorologie', label: '🌤 Meteorologie', color: '#06b6d4' },
    { id: 'technika', label: '🛡 Zmírnění rizik', color: '#8b5cf6' },
    { id: 'letove', label: '⚙️ Letové char.', color: '#f59e0b' },
  ];

  const theoryKey = theoryData[theoryCategory];

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a1a", fontFamily: "'Inter', 'Segoe UI', sans-serif", color: "#fff", position: "relative", overflow: "hidden" }}>
      {/* Background blobs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        {[
          { w: 500, h: 500, top: "-10%", left: "-10%", c1: "#7c3aed", c2: "#06b6d4", dur: "18s" },
          { w: 400, h: 400, top: "50%", right: "-8%", c1: "#0891b2", c2: "#8b5cf6", dur: "22s" },
          { w: 350, h: 350, bottom: "-5%", left: "30%", c1: "#d97706", c2: "#7c3aed", dur: "15s" },
        ].map((b, i) => (
          <div key={i} style={{
            position: "absolute", width: b.w, height: b.h, top: b.top, left: b.left, right: b.right, bottom: b.bottom,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${b.c1}30, ${b.c2}15, transparent 70%)`,
            filter: "blur(60px)",
            animation: `pulse ${b.dur} ease-in-out infinite alternate`,
          }} />
        ))}
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes pulse { from { opacity: 0.6; transform: scale(1); } to { opacity: 1; transform: scale(1.08); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .card-flip { transition: transform 0.4s ease; transform-style: preserve-3d; }
        .card-flip.flipped { transform: rotateY(180deg); }
        .card-face { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        .card-back { transform: rotateY(180deg); }
        button:hover { opacity: 0.85; }
        button:disabled { opacity: 0.35 !important; cursor: not-allowed; }
      `}</style>

      <div style={{ position: "relative", zIndex: 1, maxWidth: "780px", margin: "0 auto", padding: "24px 16px 60px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "28px", animation: "fadeIn 0.6s ease" }}>
          <div style={{ fontSize: "36px", marginBottom: "8px" }}>🚁</div>
          <h1 style={{ fontSize: "26px", fontWeight: 800, background: "linear-gradient(135deg, #06b6d4, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Dron A2 — Příprava na zkoušku
          </h1>
          <p style={{ color: "rgba(255,255,255,0.45)", marginTop: "6px", fontSize: "14px" }}>
            Meteorologie · Zmírnění rizik na zemi · Letové charakteristiky
          </p>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "12px", flexWrap: "wrap" }}>
            <span style={{ background: "rgba(6,182,212,0.15)", border: "1px solid rgba(6,182,212,0.3)", borderRadius: "20px", padding: "3px 12px", fontSize: "13px", color: "#06b6d4" }}>
              🌤 {meteorologieQ.length} otázek
            </span>
            <span style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)", borderRadius: "20px", padding: "3px 12px", fontSize: "13px", color: "#a78bfa" }}>
              🛡 {technikaQ.length} otázek
            </span>
            <span style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: "20px", padding: "3px 12px", fontSize: "13px", color: "#fbbf24" }}>
              ⚙️ {letoveQ.length} otázek
            </span>
          </div>
        </div>

        {/* Main tab bar */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", justifyContent: "center", flexWrap: "wrap" }}>
          {mainTabs.map(t => (
            <button key={t.id} onClick={() => setMainTab(t.id)} style={{
              padding: "10px 20px", borderRadius: "50px", border: "1px solid",
              borderColor: mainTab === t.id ? "#06b6d4" : "rgba(255,255,255,0.12)",
              background: mainTab === t.id ? "rgba(6,182,212,0.18)" : "rgba(255,255,255,0.05)",
              color: mainTab === t.id ? "#06b6d4" : "rgba(255,255,255,0.6)",
              fontWeight: mainTab === t.id ? 700 : 400, cursor: "pointer",
              fontSize: "14px", transition: "all 0.4s ease",
            }}>{t.label}</button>
          ))}
        </div>

        {/* ── TEORIE ── */}
        {mainTab === 'teorie' && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            {/* Category selector */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "20px", justifyContent: "center", flexWrap: "wrap" }}>
              {cats.map(c => (
                <button key={c.id} onClick={() => { setTheoryCategory(c.id); setOpenSection(null); }} style={{
                  padding: "8px 18px", borderRadius: "50px", border: "1px solid",
                  borderColor: theoryCategory === c.id ? c.color : "rgba(255,255,255,0.1)",
                  background: theoryCategory === c.id ? c.color + "22" : "rgba(255,255,255,0.04)",
                  color: theoryCategory === c.id ? c.color : "rgba(255,255,255,0.55)",
                  fontWeight: theoryCategory === c.id ? 700 : 400,
                  cursor: "pointer", fontSize: "13px", transition: "all 0.4s ease",
                }}>{c.label}</button>
              ))}
            </div>
            {/* Collapsible sections */}
            {theoryKey.sections.map((s, i) => (
              <div key={i} style={{ marginBottom: "10px" }}>
                <button onClick={() => setOpenSection(openSection === i ? null : i)} style={{
                  width: "100%", textAlign: "left", padding: "16px 20px",
                  background: openSection === i ? theoryKey.color + "18" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${openSection === i ? theoryKey.color + "55" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: openSection === i ? "16px 16px 0 0" : "16px",
                  color: "#fff", cursor: "pointer", fontSize: "15px", fontWeight: 600,
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  transition: "all 0.4s ease",
                }}>
                  <span>{s.title}</span>
                  <span style={{ color: theoryKey.color, fontSize: "18px", transition: "transform 0.4s ease", display: "inline-block", transform: openSection === i ? "rotate(45deg)" : "rotate(0)" }}>+</span>
                </button>
                {openSection === i && (
                  <div style={{
                    padding: "16px 20px", background: "rgba(255,255,255,0.03)",
                    border: `1px solid ${theoryKey.color + "33"}`, borderTop: "none",
                    borderRadius: "0 0 16px 16px", color: "rgba(255,255,255,0.78)",
                    fontSize: "15px", lineHeight: 1.7, whiteSpace: "pre-line",
                    animation: "fadeIn 0.3s ease",
                  }}>{s.content}</div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── KVÍZ ── */}
        {mainTab === 'kviz' && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            {/* Category filter */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "20px", justifyContent: "center", flexWrap: "wrap" }}>
              {[{ id: 'vse', label: `🔀 Vše (${allQuestions.length})` }, ...cats.map(c => ({ id: c.id, label: `${c.label.split(' ')[0]} ${c.label.split(' ').slice(1).join(' ')} (${c.id === 'meteorologie' ? meteorologieQ.length : c.id === 'technika' ? technikaQ.length : letoveQ.length})`, color: c.color }))].map(f => (
                <button key={f.id} onClick={() => changeQuizCategory(f.id)} style={{
                  padding: "8px 16px", borderRadius: "50px", border: "1px solid",
                  borderColor: quizCategory === f.id ? (f.color || "#06b6d4") : "rgba(255,255,255,0.1)",
                  background: quizCategory === f.id ? (f.color || "#06b6d4") + "22" : "rgba(255,255,255,0.04)",
                  color: quizCategory === f.id ? (f.color || "#06b6d4") : "rgba(255,255,255,0.55)",
                  fontWeight: quizCategory === f.id ? 700 : 400,
                  cursor: "pointer", fontSize: "13px", transition: "all 0.4s ease",
                }}>{f.label}</button>
              ))}
            </div>
            <QuizEngine key={quizKey} questions={quizQuestions} accentColor={
              quizCategory === 'meteorologie' ? '#06b6d4' : quizCategory === 'technika' ? '#8b5cf6' : quizCategory === 'letove' ? '#f59e0b' : '#06b6d4'
            } />
          </div>
        )}

        {/* ── KARTIČKY ── */}
        {mainTab === 'karticky' && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <div style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: "13px", marginBottom: "20px" }}>
              Kartička {cardIdx + 1} / {flashcards.length} — klikni pro otočení
            </div>
            {/* Flip card */}
            <div style={{ perspective: "1000px", marginBottom: "20px" }}>
              <div
                onClick={() => setCardFlipped(f => !f)}
                style={{
                  position: "relative", height: "220px", cursor: "pointer",
                  transformStyle: "preserve-3d",
                  transform: cardFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  transition: "transform 0.4s ease",
                }}
              >
                {/* Front */}
                <div style={{
                  position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
                  background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.25)",
                  borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center",
                  padding: "30px",
                }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", marginBottom: "16px" }}>Přední strana</div>
                    <div style={{ fontSize: "24px", fontWeight: 700, color: "#06b6d4", lineHeight: 1.3 }}>
                      {flashcards[cardIdx].front}
                    </div>
                  </div>
                </div>
                {/* Back */}
                <div style={{
                  position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.25)",
                  borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center",
                  padding: "28px",
                }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", marginBottom: "14px" }}>Zadní strana</div>
                    <div style={{ fontSize: "15px", color: "rgba(255,255,255,0.88)", lineHeight: 1.65, whiteSpace: "pre-line" }}>
                      {flashcards[cardIdx].back}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Navigation */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "20px" }}>
              <button onClick={prevCard} style={{ padding: "10px 22px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", color: "#fff", cursor: "pointer", fontSize: "15px", transition: "all 0.4s ease" }}>← Předchozí</button>
              <button onClick={() => setCardFlipped(f => !f)} style={{ padding: "10px 22px", background: "rgba(6,182,212,0.15)", border: "1px solid rgba(6,182,212,0.35)", borderRadius: "10px", color: "#06b6d4", cursor: "pointer", fontSize: "14px", transition: "all 0.4s ease" }}>🔄 Otočit</button>
              <button onClick={nextCard} style={{ padding: "10px 22px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", color: "#fff", cursor: "pointer", fontSize: "15px", transition: "all 0.4s ease" }}>Další →</button>
            </div>
            {/* Dot nav */}
            <div style={{ display: "flex", gap: "7px", justifyContent: "center", marginTop: "20px", flexWrap: "wrap" }}>
              {flashcards.map((_, i) => (
                <div key={i} onClick={() => { setCardIdx(i); setCardFlipped(false); }} style={{
                  width: "10px", height: "10px", borderRadius: "50%", cursor: "pointer",
                  background: i === cardIdx ? "#06b6d4" : "rgba(255,255,255,0.2)",
                  transition: "background 0.4s ease",
                }} />
              ))}
            </div>
          </div>
        )}

        {/* ── TAHÁK ── */}
        {mainTab === 'tahak' && (
          <div style={{ animation: "fadeIn 0.5s ease", display: "flex", flexDirection: "column", gap: "20px" }}>
            {cheatSections.map((sec, si) => (
              <div key={si} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "18px", overflow: "hidden" }}>
                <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)", fontSize: "15px", fontWeight: 700, color: "#fff" }}>
                  {sec.title}
                </div>
                <div style={{ padding: "4px 0" }}>
                  {sec.items.map(([label, value], i) => (
                    <div key={i} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "baseline",
                      padding: "10px 20px", gap: "16px",
                      borderBottom: i < sec.items.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                    }}>
                      <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", flexShrink: 0 }}>{label}</span>
                      <span style={{ color: "#e2e8f0", fontSize: "14px", fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", textAlign: "right" }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div style={{ textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: "12px", marginTop: "8px" }}>
              Zdroj otázek: quizvds.it · Předpis: EU 2019/947 · EU 2019/945
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
