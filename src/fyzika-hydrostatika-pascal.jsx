// @title Hydrostatika — Pascalův zákon, hydraulická zařízení, Archimédův zákon
// @subject Physics
// @topic Hydrostatika, Pascalův zákon
// @template practice

import { useState, useCallback, useMemo } from 'react';

/* ═══════════════════════════════════════════════════════════════════
   QUIZ ENGINE (from assets/quiz-engine.jsx)
   ═══════════════════════════════════════════════════════════════════ */
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
  const score = shuffledQuestions.filter((q2, i) => revealed[i] && arrEqual(answers[i] || [], q2.correct)).length;
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
    const msg = pct >= 90 ? "Vynikající! Hydrostatiku máš v malíčku!" : pct >= 70 ? "Dobře! Ještě pár detailů a budeš expert." : pct >= 50 ? "Solidní základ, ale opakování se vyplatí." : "Potřebuješ více přípravy. Projdi si teorii znovu!";
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "280px" }}>
        <div style={{ textAlign: "center", ...glass, padding: "40px 48px" }}>
          <div style={{ color: "#fff", fontSize: "52px", fontWeight: 800, lineHeight: 1.1 }}>{score} / {shuffledQuestions.length}</div>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "22px", marginBottom: "16px" }}>{pct} %</div>
          <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "17px", lineHeight: 1.5, marginBottom: "24px", maxWidth: "340px", margin: "0 auto 24px" }}>{msg}</div>
          <button style={{ ...btnStyle, background: accentColor + "66", border: `1px solid ${accentColor}` }} onClick={restart}>Znovu</button>
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
        {isMulti && !isRevealed && (
          <button style={{ ...btnStyle, marginTop: "12px", opacity: pendingMulti.length === 0 ? 0.4 : 1 }} onClick={submitMulti} disabled={pendingMulti.length === 0}>Potvrdit</button>
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
          : <button style={{ ...btnStyle, background: accentColor + "55", border: `1px solid ${accentColor}` }} onClick={() => setShowResults(true)}>Výsledky →</button>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SHARED STYLES
   ═══════════════════════════════════════════════════════════════════ */
const ACCENT = "#06b6d4";
const ACCENT2 = "#8b5cf6";

const glass = {
  background: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "20px",
  transition: "all 0.4s ease",
};

const btnStyle = {
  padding: "10px 22px",
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: "10px",
  color: "#fff",
  cursor: "pointer",
  fontSize: "15px",
  transition: "all 0.4s ease",
};

/* ═══════════════════════════════════════════════════════════════════
   DATA — THEORY
   ═══════════════════════════════════════════════════════════════════ */
const theoryData = [
  {
    title: "Tekutiny a jejich vlastnosti",
    icon: "💧",
    content: [
      { subtitle: "Co je tekutina?", text: "Tekutina je společný název pro kapaliny a plyny. Jejich významnou společnou vlastností je tekutost — neschopnost udržet stálý tvar díky snadnému vzájemnému pohybu částic. K tekutinám se řadí také sypké látky (pevné skupenství, ale splňují kritérium tekutosti)." },
      { subtitle: "Vlastnosti kapalin", text: "• Zachovávají stálý objem (za konstantní teploty)\n• Mají vodorovný povrch v tíhovém poli Země (v klidu)\n• Jsou velmi málo stlačitelné (malé vzdálenosti mezi částicemi)\n• Vykazují kapilární jevy\n• Mají vnitřní tření" },
      { subtitle: "Vlastnosti plynů", text: "• Nemají stálý tvar ani objem (jsou rozpínavé)\n• Vzájemné síly mezi molekulami jsou zanedbatelné\n• Jsou velmi snadno stlačitelné" },
      { subtitle: "Ideální kapalina", text: "Ideální kapalina je teoretický model — je dokonale tekutá, nestlačitelná a bez vnitřního tření. Používá se pro zjednodušení výpočtů v hydrostatice." },
    ]
  },
  {
    title: "Hydrostatický tlak",
    icon: "🌊",
    content: [
      { subtitle: "Definice", text: "Hydrostatický tlak je tlak způsobený vlastní tíhou kapaliny. Čím hlouběji se potápíme, tím větší je tlak — protože nad námi je větší sloupec kapaliny." },
      { subtitle: "Odvození vzorce", text: "Vycházíme z obecného vzorce pro tlak:\n\np = F/S = F_G/S = m·g/S\n\nHmotnost sloupce kapaliny: m = ρ·V = ρ·S·h\n\nDosadíme:\np = ρ·S·h·g / S = h·ρ·g\n\nHydrostatický tlak tedy závisí na:\n• h — hloubce pod hladinou [m]\n• ρ — hustotě kapaliny [kg/m³]\n• g — tíhovém zrychlení [m/s²]" },
      { subtitle: "Důležité poznatky", text: "• Hydrostatický tlak NEZÁVISÍ na tvaru nádoby ani na množství kapaliny — závisí pouze na hloubce\n• Na dně všech spojených nádob je stejný tlak (za předpokladu stejné kapaliny)\n• Hladina kapaliny se v spojených nádobách ustálí ve stejné výšce\n• Celkový tlak v hloubce h = atmosférický tlak + hydrostatický tlak" },
      { subtitle: "Spojené nádoby", text: "V spojených nádobách se hladina stejnorodé kapaliny ustálí ve stejné výšce, bez ohledu na tvar a průřez nádob. Pokud jsou v ramenech různé kapaliny (např. voda a olej), výšky sloupců se liší — lehčí kapalina stoupá výš:\n\nρ₁ · h₁ = ρ₂ · h₂" },
    ]
  },
  {
    title: "Pascalův zákon",
    icon: "⚖️",
    content: [
      { subtitle: "Znění zákona", text: "Tlak vyvolaný vnější silou, která působí na kapalné těleso v uzavřené nádobě, je ve všech místech kapaliny stejný.\n\np = konst. (v celém objemu uzavřené kapaliny)" },
      { subtitle: "Vysvětlení", text: "Když na kapalinu v uzavřené nádobě zatlačíme (např. pístem), kapalina tento tlak přenáší rovnoměrně do všech směrů a na všechny stěny nádoby. To je klíčový rozdíl oproti pevným látkám — kapalina \"neteče\" jedním směrem, ale tlačí všude stejně." },
      { subtitle: "Blaise Pascal", text: "Blaise Pascal (19. června 1623, Clermont – 19. srpna 1662, Paříž) byl francouzský matematik, fyzik, spisovatel, teolog a náboženský filosof. Kromě hydrostatiky se zabýval pravděpodobností, kombinatorikou a filozofií." },
    ]
  },
  {
    title: "Hydraulická zařízení",
    icon: "🔧",
    content: [
      { subtitle: "Princip hydraulického lisu", text: "Hydraulický lis využívá Pascalův zákon. Skládá se z dvou válců spojených trubkou, vyplněných kapalinou. Malý píst (plocha S₁) a velký píst (plocha S₂).\n\nProtože tlak je v celé kapalině stejný:\np = F₁/S₁ = F₂/S₂\n\nZ toho plyne:\nF₂/F₁ = S₂/S₁\n\nSíla se zesiluje v poměru ploch pístů!" },
      { subtitle: "Zachování objemu", text: "Co získáme na síle, ztratíme na dráze. Objem kapaliny je konstantní:\n\nS₁ · h₁ = S₂ · h₂\n\nKdyž malý píst stlačíme o velkou vzdálenost h₁, velký píst se posune jen o malou vzdálenost h₂." },
      { subtitle: "Příklady využití", text: "• Hydraulické brzdy v autě\n• Hydraulický zvedák (autoservis)\n• Hydraulický lis (lisování, tvarování)\n• Hydraulické bagry a jeřáby\n• Zubařské křeslo" },
    ]
  },
  {
    title: "Archimédův zákon",
    icon: "🚢",
    content: [
      { subtitle: "Znění zákona", text: "Těleso ponořené v kapalině je nadlehčováno hydrostatickou vztlakovou silou, jejíž velikost se rovná tíze kapaliny stejného objemu, jako je objem ponořené části tělesa.\n\nF_vz = ρ_K · V · g\n\nkde V je objem ponořené části tělesa." },
      { subtitle: "Odvození", text: "Na ponořené těleso působí kapalina ze všech stran. Tlak na spodní stěnu je větší než na horní (protože spodní stěna je hlouběji). Výsledná síla směřuje vzhůru:\n\nF_vz = F_dolní - F_horní = ρ_K · g · h₂ · S - ρ_K · g · h₁ · S\nF_vz = ρ_K · g · S · (h₂ - h₁) = ρ_K · g · V" },
      { subtitle: "Tři případy chování tělesa", text: "1. ρ_T > ρ_K → F_G > F_vz → těleso KLESÁ ke dnu\n2. ρ_T = ρ_K → F_G = F_vz → těleso se VZNÁŠÍ v kapalině\n3. ρ_T < ρ_K → F_G < F_vz → těleso STOUPÁ k hladině a částečně se vynoří (plave)" },
      { subtitle: "Archimédés ze Syrakus", text: "Řecký matematik, fyzik, filosof a vynálezce (287–212 př. n. l.). Je považován za jednoho z nejvýznamnějších vědců starověku. Jeho slavný výrok: \"Dejte mi opěrný bod a já pohnu Zemí.\" A samozřejmě: \"Heuréka!\" — když prý objevil svůj zákon ve vaně." },
    ]
  },
];

/* ═══════════════════════════════════════════════════════════════════
   DATA — WORKED PROBLEMS
   ═══════════════════════════════════════════════════════════════════ */
const problems = [
  {
    title: "Hydrostatický tlak v hloubce 10 m",
    difficulty: "easy",
    topic: "Hydrostatický tlak",
    statement: "Určete hydrostatický tlak v hloubce 10 m pod vodní hladinou.",
    checkAnswer: { value: 98100, tolerance: 500, unit: "Pa" },
    solution: {
      given: "h = 10 m, ρ = 1 000 kg·m⁻³, g = 9,81 m·s⁻²",
      formula: "p = h · ρ · g",
      steps: [
        "p = 10 · 1 000 · 9,81",
        "p = 98 100 Pa",
        "p ≈ 98,1 kPa"
      ],
      result: "p ≈ 98,1 kPa"
    }
  },
  {
    title: "Potápěč — z jaké hloubky se vynořil?",
    difficulty: "easy",
    topic: "Hydrostatický tlak",
    statement: "Potápěč se v bazénu plně nadechl ze své potápěčské bomby a vyplouvá k hladině. Ignoruje instrukci, že se má při stoupání vydechovat. Když se vynoří, je rozdíl mezi vnějším tlakem a vnitřním tlakem v jeho plicích 9,3 kPa. Z jaké hloubky se vynořil? Jaké nebezpečné hrozbě se vystavil?",
    checkAnswer: { value: 0.95, tolerance: 0.03, unit: "m" },
    solution: {
      given: "Δp = 9,3 kPa = 9 300 Pa, ρ = 1 000 kg·m⁻³, g = 9,81 m·s⁻²",
      formula: "p = h · ρ · g → h = p / (ρ · g)",
      steps: [
        "h = 9 300 / (1 000 × 9,81)",
        "h = 9 300 / 9 810",
        "h ≈ 0,948 m ≈ 95 cm"
      ],
      result: "h ≈ 95 cm. Nebezpečí: barotrauma — přetlak v plicích může způsobit prasknutí plicních sklípků, vzduchovou embolii nebo pneumotorax. Proto se při výstupu VŽDY vydechuje!"
    }
  },
  {
    title: "U-trubice — hustota oleje",
    difficulty: "medium",
    topic: "Spojené nádoby",
    statement: "U-trubice obsahuje dvě kapaliny ve statické rovnováze. Voda s hustotou 998 kg·m⁻³ je v pravém rameni, olej s neznámou hustotou v levém. Měřením zjistíme, že výška vodního sloupce nad rozhraním l = 135,0 mm a olej stoupá o d = 12,3 mm výše než voda. Jaká je hustota oleje?",
    checkAnswer: { value: 915, tolerance: 3, unit: "kg·m⁻³" },
    solution: {
      given: "ρ_voda = 998 kg·m⁻³, l = 135,0 mm (výška vodního sloupce), d = 12,3 mm (o kolik je olej výše)",
      formula: "V rovnováze: ρ_olej · h_olej = ρ_voda · h_voda\nh_olej = l + d, h_voda = l\nρ_olej = ρ_voda · l / (l + d)",
      steps: [
        "h_olej = 135,0 + 12,3 = 147,3 mm",
        "h_voda = l = 135,0 mm",
        "ρ_olej = 998 × 135,0 / 147,3",
        "ρ_olej = 998 × 0,9165",
        "ρ_olej ≈ 914,7 kg·m⁻³"
      ],
      result: "ρ_olej ≈ 915 kg·m⁻³"
    }
  },
  {
    title: "Hydraulický lis — síla na malém pístu",
    difficulty: "medium",
    topic: "Pascalův zákon",
    statement: "Jak velká síla F₁ působící na malý píst vyváží na velkém pístu sílu 20,0 kN? Malý píst má průměr 3,8 cm a velký 53,0 cm.",
    checkAnswer: { value: 103, tolerance: 3, unit: "N" },
    solution: {
      given: "F₂ = 20,0 kN = 20 000 N, d₁ = 3,8 cm, d₂ = 53,0 cm",
      formula: "F₁/S₁ = F₂/S₂ → F₁ = F₂ · (S₁/S₂) = F₂ · (d₁/d₂)²\n(protože S = π·(d/2)² a π se zkrátí)",
      steps: [
        "F₁ = F₂ · (d₁/d₂)²",
        "F₁ = 20 000 · (3,8/53,0)²",
        "F₁ = 20 000 · (0,07170)²",
        "F₁ = 20 000 · 0,005141",
        "F₁ ≈ 102,8 N"
      ],
      result: "F₁ ≈ 103 N"
    }
  },
  {
    title: "Hydraulický lis — tlak, síla, posun",
    difficulty: "medium",
    topic: "Pascalův zákon",
    statement: "Na píst hydraulického lisu o obsahu 25 cm² působí síla 100 N.\na) Jaký tlak vyvolá v kapalině?\nb) Jak velká síla působí na píst o obsahu 1 000 cm²?\nc) O jakou vzdálenost se posune velký píst, posune-li se malý o 8 cm?",
    solution: {
      given: "S₁ = 25 cm² = 25 × 10⁻⁴ m², F₁ = 100 N, S₂ = 1 000 cm² = 0,1 m², h₁ = 8 cm",
      formula: "a) p = F₁/S₁\nb) F₂ = p · S₂\nc) S₁ · h₁ = S₂ · h₂ → h₂ = S₁ · h₁ / S₂",
      steps: [
        "a) p = 100 / (25 × 10⁻⁴) = 100 / 0,0025 = 40 000 Pa = 40 kPa",
        "b) F₂ = 40 000 × 0,1 = 4 000 N = 4 kN",
        "c) h₂ = (25 × 8) / 1 000 = 200 / 1 000 = 0,2 cm = 2 mm"
      ],
      result: "a) p = 40 kPa, b) F₂ = 4 kN, c) h₂ = 2 mm"
    }
  },
  {
    title: "Hydraulický zvedák — zdvihnout auto",
    difficulty: "medium",
    topic: "Pascalův zákon",
    statement: "Písty hydraulického zvedáku mají průměr 3 cm a 15 cm. Jak velkou silou musíme působit na menší píst, chceme-li zvedat těleso o hmotnosti 200 kg?",
    checkAnswer: { value: 78.5, tolerance: 2, unit: "N" },
    solution: {
      given: "d₁ = 3 cm, d₂ = 15 cm, m = 200 kg, g = 9,81 m·s⁻²",
      formula: "F₂ = m · g\nF₁ = F₂ · (d₁/d₂)²",
      steps: [
        "F₂ = 200 × 9,81 = 1 962 N",
        "F₁ = 1 962 × (3/15)²",
        "F₁ = 1 962 × (1/5)²",
        "F₁ = 1 962 × 1/25",
        "F₁ = 78,5 N"
      ],
      result: "F₁ ≈ 78,5 N"
    }
  },
  {
    title: "Tlak v pneumatice — síla na plochu",
    difficulty: "medium",
    topic: "Pascalův zákon",
    statement: "V pneumatice kola automobilu byl naměřen tlak 500 kPa. Jak velká tlaková síla působí na část stěny pneumatiky o obsahu a) 1 cm², b) 1 dm²?",
    solution: {
      given: "p = 500 kPa = 500 000 Pa\na) S = 1 cm² = 10⁻⁴ m²\nb) S = 1 dm² = 10⁻² m²",
      formula: "F = p · S",
      steps: [
        "a) F = 500 000 × 10⁻⁴ = 50 N",
        "b) F = 500 000 × 10⁻² = 5 000 N = 5 kN"
      ],
      result: "a) F = 50 N, b) F = 5 kN"
    }
  },
  {
    title: "Ledovec — kolik procent je nad hladinou?",
    difficulty: "medium",
    topic: "Archimédův zákon",
    statement: "Hustota ledu je přibližně 920 kg·m⁻³. Urči, jaká část kry je pod hladinou a jaká část je nad hladinou.",
    checkAnswer: { value: 8, tolerance: 1, unit: "%" },
    solution: {
      given: "ρ_led = 920 kg·m⁻³, ρ_voda = 1 000 kg·m⁻³",
      formula: "Při plovení: F_G = F_vz → ρ_led · V_celk · g = ρ_voda · V_ponoř · g\nV_ponoř/V_celk = ρ_led/ρ_voda",
      steps: [
        "V_ponoř/V_celk = 920/1 000 = 0,92 = 92 %",
        "Pod hladinou je 92 % objemu ledovce",
        "Nad hladinou: 100 % − 92 % = 8 %"
      ],
      result: "Pod hladinou: 92 %, nad hladinou: 8 %"
    }
  },
  {
    title: "Ledová kra — závaží pro úplné ponoření",
    difficulty: "hard",
    topic: "Archimédův zákon",
    statement: "Ledová kra má tvar čtvercové desky o obsahu plochy 1 m² a tloušťce 20 cm. Jaká je minimální hmotnost závaží, které je třeba položit na střed kry, aby se celá ponořila do vody? (ρ_led ≈ 900 kg·m⁻³)",
    checkAnswer: { value: 20, tolerance: 1, unit: "kg" },
    solution: {
      given: "S = 1 m², h = 0,2 m, ρ_led = 900 kg·m⁻³, ρ_voda = 1 000 kg·m⁻³",
      formula: "Pro úplné ponoření: F_vz = F_G(kra) + F_G(závaží)\nρ_voda · V · g = (m_kra + m_z) · g",
      steps: [
        "V_kra = S · h = 1 × 0,2 = 0,2 m³",
        "m_kra = ρ_led · V = 900 × 0,2 = 180 kg",
        "Vztlaková síla při úplném ponoření:",
        "F_vz = ρ_voda · V · g = 1 000 × 0,2 × g",
        "Hmotnost kapaliny vytlačené krou: 200 kg",
        "Podmínka: 200 = 180 + m_z",
        "m_z = 200 − 180 = 20 kg"
      ],
      result: "m_z = 20 kg"
    }
  },
  {
    title: "Vztlaková síla na krychli v různých kapalinách",
    difficulty: "hard",
    topic: "Archimédův zákon",
    statement: "Určete velikost vztlakové síly, která působí na krychli o hraně 10 cm ponořenou:\na) ve vodě (ρ = 1 000 kg·m⁻³)\nb) v oleji (ρ = 900 kg·m⁻³)\nc) v glycerinu (ρ = 1 200 kg·m⁻³)",
    solution: {
      given: "a = 10 cm = 0,1 m → V = a³ = 10⁻³ m³, g = 9,81 m·s⁻²",
      formula: "F_vz = ρ_K · V · g",
      steps: [
        "a) F_vz = 1 000 × 10⁻³ × 9,81 = 9,81 N",
        "b) F_vz = 900 × 10⁻³ × 9,81 = 8,83 N",
        "c) F_vz = 1 200 × 10⁻³ × 9,81 = 11,77 N"
      ],
      result: "a) 9,81 N  b) 8,83 N  c) 11,77 N\nVztlaková síla závisí na hustotě kapaliny — čím hustější kapalina, tím větší vztlaková síla."
    }
  },
];

/* ═══════════════════════════════════════════════════════════════════
   DATA — QUIZ QUESTIONS
   ═══════════════════════════════════════════════════════════════════ */
const quizQuestions = [
  {
    question: "Co je to tekutina?",
    type: "single",
    options: ["Společný název pro kapaliny a plyny", "Pouze kapaliny", "Pouze plyny", "Pouze sypké látky"],
    correct: [0],
    explanation: "Tekutina je společný název pro kapaliny a plyny, jejichž společnou vlastností je tekutost — neschopnost udržet stálý tvar."
  },
  {
    question: "Která vlastnost NEPATŘÍ mezi vlastnosti kapalin?",
    type: "single",
    options: ["Jsou snadno stlačitelné", "Zachovávají stálý objem", "Jsou velmi málo stlačitelné", "Vykazují kapilární jevy"],
    correct: [0],
    explanation: "Kapaliny jsou velmi málo stlačitelné, nikoliv snadno. Snadná stlačitelnost je vlastností plynů."
  },
  {
    question: "Jaký je vzorec pro hydrostatický tlak?",
    type: "single",
    options: ["p = h · ρ · g", "p = m · g", "p = F · S", "p = V · ρ · g"],
    correct: [0],
    explanation: "Hydrostatický tlak p = h · ρ · g, kde h je hloubka, ρ hustota kapaliny a g tíhové zrychlení.",
    tip: "Pamatuj: HRoG — Hloubka × Ró × Gé"
  },
  {
    question: "Na čem NEZÁVISÍ hydrostatický tlak?",
    type: "single",
    options: ["Na tvaru nádoby", "Na hloubce pod hladinou", "Na hustotě kapaliny", "Na tíhovém zrychlení"],
    correct: [0],
    explanation: "Hydrostatický tlak závisí na hloubce, hustotě kapaliny a tíhovém zrychlení, ale NEZÁVISÍ na tvaru nádoby. Toto je známý hydrostatický paradox."
  },
  {
    question: "Pascalův zákon říká, že:",
    type: "single",
    options: [
      "Tlak v uzavřené kapalině je ve všech místech stejný",
      "Těleso ponořené v kapalině je nadlehčováno",
      "Hydrostatický tlak závisí na hloubce",
      "Kapaliny jsou nestlačitelné"
    ],
    correct: [0],
    explanation: "Pascalův zákon: Tlak vyvolaný vnější silou na kapalinu v uzavřené nádobě je ve všech místech kapaliny stejný."
  },
  {
    question: "V hydraulickém lisu je poměr sil roven:",
    type: "single",
    options: ["Poměru ploch pístů (S₂/S₁)", "Poměru objemů pístů", "Součtu ploch pístů", "Rozdílu průměrů pístů"],
    correct: [0],
    explanation: "Z Pascalova zákona: F₁/S₁ = F₂/S₂, tedy F₂/F₁ = S₂/S₁. Síla se zesiluje v poměru ploch."
  },
  {
    question: "Jaký je hydrostatický tlak v hloubce 5 m ve vodě? (ρ = 1 000 kg/m³, g ≈ 10 m/s²)",
    type: "single",
    options: ["50 000 Pa = 50 kPa", "5 000 Pa", "500 Pa", "500 000 Pa"],
    correct: [0],
    explanation: "p = h · ρ · g = 5 × 1 000 × 10 = 50 000 Pa = 50 kPa."
  },
  {
    question: "Archimédova vztlaková síla se rovná:",
    type: "single",
    options: [
      "Tíze kapaliny o objemu ponořené části tělesa",
      "Hmotnosti ponořeného tělesa",
      "Tíze celého tělesa",
      "Objemu ponořené části tělesa"
    ],
    correct: [0],
    explanation: "Archimédův zákon: Vztlaková síla = tíže kapaliny stejného objemu, jako je objem ponořené části tělesa. F_vz = ρ_K · V · g."
  },
  {
    question: "Těleso se v kapalině vznáší, pokud:",
    type: "single",
    options: [
      "Hustota tělesa se rovná hustotě kapaliny (ρ_T = ρ_K)",
      "Hustota tělesa je větší než hustota kapaliny",
      "Hustota tělesa je menší než hustota kapaliny",
      "Gravitační síla je větší než vztlaková"
    ],
    correct: [0],
    explanation: "Vznášení nastane, když ρ_T = ρ_K → F_G = F_vz. Těleso zůstává v klidu kdekoliv v kapalině.",
    tip: "Vznáší = rovnováha sil = stejné hustoty"
  },
  {
    question: "V hydraulickém lisu má malý píst plochu 10 cm² a velký 200 cm². Na malý píst působíme silou 50 N. Jaká síla vznikne na velkém pístu?",
    type: "single",
    options: ["1 000 N", "500 N", "100 N", "2 000 N"],
    correct: [0],
    explanation: "F₂ = F₁ × S₂/S₁ = 50 × 200/10 = 50 × 20 = 1 000 N."
  },
  {
    question: "Ideální kapalina je:",
    type: "single",
    options: [
      "Dokonale tekutá, nestlačitelná a bez vnitřního tření",
      "Stlačitelná a s velkým vnitřním třením",
      "Rozpínavá, bez stálého objemu",
      "Reálná kapalina při pokojové teplotě"
    ],
    correct: [0],
    explanation: "Ideální kapalina je teoretický model — dokonale tekutá, nestlačitelná a bez vnitřního tření."
  },
  {
    question: "Kolik procent ledovce (ρ = 920 kg/m³) je NAD hladinou vody?",
    type: "single",
    options: ["Přibližně 8 %", "Přibližně 92 %", "Přibližně 20 %", "Přibližně 50 %"],
    correct: [0],
    explanation: "Pod hladinou: ρ_led/ρ_voda = 920/1 000 = 92 %. Nad hladinou zůstává 100 − 92 = 8 %.",
    tip: "Proto je ledovec tak nebezpečný — vidíme jen špičku!"
  },
  {
    question: "Který z těchto přístrojů využívá Pascalův zákon?",
    type: "single",
    options: ["Hydraulické brzdy automobilu", "Rtuťový teploměr", "Aneroidový barometr", "Kuchyňská váha"],
    correct: [0],
    explanation: "Hydraulické brzdy využívají Pascalův zákon — tlak z brzdového pedálu se rovnoměrně přenáší kapalinou ke všem brzdovým válečkům."
  },
  {
    question: "Ve spojených nádobách se hladina stejnorodé kapaliny ustálí:",
    type: "single",
    options: [
      "Ve stejné výšce ve všech ramenech",
      "Výše v užším rameni",
      "Výše v širším rameni",
      "Závisí to na tvaru nádob"
    ],
    correct: [0],
    explanation: "V spojených nádobách se hladina stejnorodé kapaliny ustálí ve stejné výšce, bez ohledu na tvar a průřez nádob."
  },
  {
    question: "Které veličiny přímo ovlivňují velikost vztlakové síly?",
    type: "multi",
    options: [
      "Hustota kapaliny (ρ_K)",
      "Objem ponořené části tělesa (V)",
      "Tíhové zrychlení (g)",
      "Hmotnost tělesa"
    ],
    correct: [0, 1, 2],
    explanation: "F_vz = ρ_K · V · g. Vztlaková síla závisí na hustotě kapaliny, objemu ponořené části a tíhovém zrychlení. Hmotnost tělesa do vzorce nevstupuje."
  },
];

/* ═══════════════════════════════════════════════════════════════════
   DATA — FLASHCARDS
   ═══════════════════════════════════════════════════════════════════ */
const flashcardsData = [
  { front: "Tekutina", back: "Společný název pro kapaliny a plyny; charakterizuje je tekutost — neschopnost udržet svůj stálý tvar." },
  { front: "Hydrostatický tlak", back: "p = h · ρ · g\n\nTlak způsobený vlastní tíhou kapaliny. Závisí na hloubce, hustotě kapaliny a tíhovém zrychlení." },
  { front: "Pascalův zákon", back: "Tlak vyvolaný vnější silou na kapalinu v uzavřené nádobě je ve všech místech kapaliny stejný.\n\np = konst." },
  { front: "Hydraulické zařízení", back: "F₁/S₁ = F₂/S₂\nF₂/F₁ = S₂/S₁\n\nSíla se zesiluje v poměru ploch pístů. Co získáme na síle, ztratíme na dráze." },
  { front: "Archimédův zákon", back: "F_vz = ρ_K · V · g\n\nVztlaková síla = tíže kapaliny o objemu ponořené části tělesa." },
  { front: "Ideální kapalina", back: "Teoretický model:\n• Dokonale tekutá\n• Nestlačitelná\n• Bez vnitřního tření" },
  { front: "Těleso klesá ke dnu, když…", back: "ρ_tělesa > ρ_kapaliny\n→ F_G > F_vz\n\nGravitační síla převažuje nad vztlakovou." },
  { front: "Těleso plave, když…", back: "ρ_tělesa < ρ_kapaliny\n→ F_G < F_vz (pro celé ponoření)\n→ Těleso se částečně vynoří a F_G = F_vz" },
  { front: "Těleso se vznáší, když…", back: "ρ_tělesa = ρ_kapaliny\n→ F_G = F_vz\n\nTěleso zůstává v klidu kdekoliv v kapalině." },
  { front: "Zachování objemu\nv hydraulickém lisu", back: "S₁ · h₁ = S₂ · h₂\n\nCo získáme na síle, ztratíme na dráze.\nMalý píst se posune více, velký píst méně." },
  { front: "Spojené nádoby", back: "Hladina stejnorodé kapaliny se ustálí ve stejné výšce.\n\nPro různé kapaliny:\nρ₁ · h₁ = ρ₂ · h₂" },
  { front: "Blaise Pascal\n(1623–1662)", back: "Francouzský matematik, fyzik, spisovatel, teolog a filosof.\n\nFormuloval zákon o přenosu tlaku v kapalinách." },
];

/* ═══════════════════════════════════════════════════════════════════
   DATA — FORMULA SHEET
   ═══════════════════════════════════════════════════════════════════ */
const formulaGroups = [
  {
    title: "Tlak",
    items: [
      { formula: "p = F / S", desc: "Obecný vzorec pro tlak [Pa = N/m²]" },
      { formula: "p = h · ρ · g", desc: "Hydrostatický tlak" },
      { formula: "1 Pa = 1 N/m²", desc: "Jednotka tlaku v SI" },
    ]
  },
  {
    title: "Pascalův zákon a hydraulický lis",
    items: [
      { formula: "p = F₁/S₁ = F₂/S₂", desc: "Tlak je v celé kapalině stejný" },
      { formula: "F₂/F₁ = S₂/S₁", desc: "Poměr sil = poměr ploch" },
      { formula: "S₁ · h₁ = S₂ · h₂", desc: "Zachování objemu kapaliny" },
      { formula: "S = π · (d/2)²", desc: "Obsah kruhového pístu" },
    ]
  },
  {
    title: "Archimédův zákon",
    items: [
      { formula: "F_vz = ρ_K · V · g", desc: "Vztlaková (Archimédova) síla" },
      { formula: "ρ_T > ρ_K → klesá", desc: "Těleso klesá ke dnu" },
      { formula: "ρ_T = ρ_K → vznáší se", desc: "Těleso se vznáší v kapalině" },
      { formula: "ρ_T < ρ_K → plave", desc: "Těleso stoupá a plave na hladině" },
    ]
  },
  {
    title: "Důležité konstanty",
    items: [
      { formula: "g = 9,81 m·s⁻²", desc: "Tíhové zrychlení (≈ 10 m·s⁻²)" },
      { formula: "ρ_voda = 1 000 kg·m⁻³", desc: "Hustota vody" },
      { formula: "ρ_led ≈ 920 kg·m⁻³", desc: "Hustota ledu" },
      { formula: "ρ_rtuť = 13 600 kg·m⁻³", desc: "Hustota rtuti" },
      { formula: "ρ_moř.voda ≈ 1 020 kg·m⁻³", desc: "Hustota mořské vody" },
      { formula: "1 atm = 101 325 Pa", desc: "Normální atmosférický tlak" },
    ]
  },
  {
    title: "Převody jednotek",
    items: [
      { formula: "1 cm² = 10⁻⁴ m²", desc: "Centimetry čtvereční na metry" },
      { formula: "1 dm² = 10⁻² m²", desc: "Decimetry čtvereční na metry" },
      { formula: "1 kPa = 1 000 Pa", desc: "Kilopascaly na pascaly" },
      { formula: "1 hPa = 100 Pa", desc: "Hektopascaly na pascaly" },
    ]
  }
];

/* ═══════════════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════════════ */

function TheorySection() {
  const [openIdx, setOpenIdx] = useState(0);
  const [openSub, setOpenSub] = useState({});

  return (
    <div style={{ maxWidth: 740, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12, padding: "0 16px" }}>
      {theoryData.map((topic, i) => (
        <div key={i} style={{ ...glass, padding: 0, overflow: "hidden" }}>
          <div
            onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
            style={{ padding: "18px 24px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", userSelect: "none" }}
          >
            <span style={{ color: "#fff", fontSize: 17, fontWeight: 700, fontFamily: "'Audiowide', sans-serif" }}>
              {topic.icon} {topic.title}
            </span>
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 22, transition: "transform 0.4s ease", transform: openIdx === i ? "rotate(180deg)" : "rotate(0)" }}>▾</span>
          </div>
          {openIdx === i && (
            <div style={{ padding: "0 24px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
              {topic.content.map((item, j) => (
                <div key={j}>
                  <div
                    onClick={() => setOpenSub(prev => ({ ...prev, [`${i}-${j}`]: !prev[`${i}-${j}`] }))}
                    style={{ cursor: "pointer", padding: "10px 14px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                  >
                    <span style={{ color: ACCENT, fontSize: 15, fontWeight: 600 }}>{item.subtitle}</span>
                    <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>{openSub[`${i}-${j}`] ? "−" : "+"}</span>
                  </div>
                  {openSub[`${i}-${j}`] && (
                    <div style={{ padding: "12px 14px 4px", color: "rgba(255,255,255,0.8)", fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-line" }}>
                      {item.text}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ProblemCard({ problem }) {
  const [showSolution, setShowSolution] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [checkResult, setCheckResult] = useState(null);

  const diffColors = { easy: { bg: "rgba(34,197,94,0.15)", border: "#22c55e", label: "Snadné ✨" }, medium: { bg: "rgba(234,179,8,0.15)", border: "#eab308", label: "Střední ⚡" }, hard: { bg: "rgba(239,68,68,0.15)", border: "#ef4444", label: "Obtížné 🔥" } };
  const d = diffColors[problem.difficulty] || diffColors.medium;

  const handleCheck = () => {
    if (!problem.checkAnswer) return;
    const val = parseFloat(userInput.replace(",", "."));
    if (isNaN(val)) { setCheckResult("invalid"); return; }
    const diff = Math.abs(val - problem.checkAnswer.value);
    setCheckResult(diff <= problem.checkAnswer.tolerance ? "correct" : "wrong");
  };

  return (
    <div style={{ ...glass, padding: "20px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
        <span style={{ padding: "3px 10px", borderRadius: 8, fontSize: 12, fontWeight: 600, background: d.bg, border: `1px solid ${d.border}`, color: d.border }}>{d.label}</span>
        <span style={{ padding: "3px 10px", borderRadius: 8, fontSize: 12, background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.3)", color: ACCENT }}>{problem.topic}</span>
      </div>
      <div style={{ color: "#fff", fontSize: 16, fontWeight: 700, marginBottom: 10, fontFamily: "'Audiowide', sans-serif" }}>{problem.title}</div>
      <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-line", marginBottom: 16 }}>{problem.statement}</div>

      {problem.checkAnswer && !showSolution && (
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14, flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder={`Tvůj výsledek (${problem.checkAnswer.unit})`}
            value={userInput}
            onChange={e => { setUserInput(e.target.value); setCheckResult(null); }}
            onKeyDown={e => e.key === "Enter" && handleCheck()}
            style={{ padding: "8px 14px", borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: 14, fontFamily: "'JetBrains Mono', monospace", outline: "none", flex: "1 1 140px", minWidth: 100 }}
          />
          <button onClick={handleCheck} style={{ ...btnStyle, marginTop: 0, padding: "8px 18px", fontSize: 14 }}>Ověřit</button>
          {checkResult === "correct" && <span style={{ color: "#22c55e", fontWeight: 700, fontSize: 14 }}>Správně!</span>}
          {checkResult === "wrong" && <span style={{ color: "#ef4444", fontWeight: 700, fontSize: 14 }}>Špatně — zkus to znovu nebo se podívej na řešení</span>}
          {checkResult === "invalid" && <span style={{ color: "#eab308", fontSize: 14 }}>Zadej číslo</span>}
        </div>
      )}

      <button
        onClick={() => setShowSolution(!showSolution)}
        style={{ ...btnStyle, marginTop: 0, background: showSolution ? "rgba(6,182,212,0.15)" : "rgba(255,255,255,0.07)", border: showSolution ? "1px solid rgba(6,182,212,0.4)" : "1px solid rgba(255,255,255,0.15)" }}
      >
        {showSolution ? "Skrýt řešení ▲" : "Zobrazit řešení ▼"}
      </button>

      {showSolution && (
        <div style={{ marginTop: 16, padding: 16, borderRadius: 14, background: "rgba(6,182,212,0.05)", border: "1px solid rgba(6,182,212,0.15)" }}>
          <div style={{ marginBottom: 10 }}>
            <span style={{ color: ACCENT, fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: 1 }}>Dáno:</span>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, fontFamily: "'JetBrains Mono', monospace", marginTop: 4, whiteSpace: "pre-line" }}>{problem.solution.given}</div>
          </div>
          <div style={{ marginBottom: 10 }}>
            <span style={{ color: ACCENT, fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: 1 }}>Vzorec:</span>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, fontFamily: "'JetBrains Mono', monospace", marginTop: 4, whiteSpace: "pre-line" }}>{problem.solution.formula}</div>
          </div>
          <div style={{ marginBottom: 10 }}>
            <span style={{ color: ACCENT, fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: 1 }}>Postup:</span>
            {problem.solution.steps.map((step, i) => (
              <div key={i} style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, fontFamily: "'JetBrains Mono', monospace", padding: "4px 0 4px 12px", borderLeft: "2px solid rgba(6,182,212,0.2)" }}>{step}</div>
            ))}
          </div>
          <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 10, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)" }}>
            <span style={{ color: "#22c55e", fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: 1 }}>Výsledek: </span>
            <span style={{ color: "#fff", fontSize: 14, fontFamily: "'JetBrains Mono', monospace", whiteSpace: "pre-line" }}>{problem.solution.result}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function ProblemsSection() {
  const [filter, setFilter] = useState("all");
  const topics = ["all", ...new Set(problems.map(p => p.topic))];
  const filtered = filter === "all" ? problems : problems.filter(p => p.topic === filter);

  return (
    <div style={{ maxWidth: 740, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16, padding: "0 16px" }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
        {topics.map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{ ...btnStyle, marginTop: 0, padding: "6px 14px", fontSize: 13, background: filter === t ? ACCENT + "33" : "rgba(255,255,255,0.05)", border: filter === t ? `1px solid ${ACCENT}` : "1px solid rgba(255,255,255,0.1)" }}>
            {t === "all" ? "Vše" : t}
          </button>
        ))}
      </div>
      {filtered.map((p, i) => <ProblemCard key={i} problem={p} />)}
    </div>
  );
}

function FlashcardsSection() {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const goTo = (i) => { setIdx(i); setFlipped(false); };
  const card = flashcardsData[idx];

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: "0 16px" }}>
      <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 16 }}>
        {flashcardsData.map((_, i) => (
          <div key={i} onClick={() => goTo(i)} style={{ width: 18, height: 18, borderRadius: "50%", cursor: "pointer", transition: "background 0.4s ease", background: i === idx ? ACCENT : "rgba(255,255,255,0.15)" }} />
        ))}
      </div>

      <div onClick={() => setFlipped(!flipped)} style={{ cursor: "pointer", perspective: "1000px", height: 320 }}>
        <div style={{
          position: "relative", width: "100%", height: "100%", transition: "transform 0.4s ease",
          transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)"
        }}>
          {/* Front */}
          <div style={{
            position: "absolute", width: "100%", height: "100%", backfaceVisibility: "hidden",
            ...glass, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32
          }}>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, marginBottom: 12 }}>Klikni pro otočení</div>
            <div style={{ color: "#fff", fontSize: 22, fontWeight: 700, textAlign: "center", fontFamily: "'Audiowide', sans-serif", whiteSpace: "pre-line" }}>{card.front}</div>
          </div>
          {/* Back */}
          <div style={{
            position: "absolute", width: "100%", height: "100%", backfaceVisibility: "hidden",
            transform: "rotateY(180deg)", ...glass,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32,
            background: "rgba(6,182,212,0.06)", border: "1px solid rgba(6,182,212,0.15)"
          }}>
            <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 16, lineHeight: 1.7, textAlign: "center", fontFamily: "'JetBrains Mono', monospace", whiteSpace: "pre-line" }}>{card.back}</div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
        <button style={btnStyle} onClick={() => goTo((idx - 1 + flashcardsData.length) % flashcardsData.length)}>← Předchozí</button>
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, alignSelf: "center" }}>{idx + 1} / {flashcardsData.length}</span>
        <button style={btnStyle} onClick={() => goTo((idx + 1) % flashcardsData.length)}>Další →</button>
      </div>
    </div>
  );
}

function FormulaSheet() {
  return (
    <div style={{ maxWidth: 740, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16, padding: "0 16px" }}>
      {formulaGroups.map((group, i) => (
        <div key={i} style={{ ...glass, padding: "20px 24px" }}>
          <div style={{ color: ACCENT, fontSize: 16, fontWeight: 700, marginBottom: 14, fontFamily: "'Audiowide', sans-serif" }}>{group.title}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {group.items.map((item, j) => (
              <div key={j} style={{ display: "flex", alignItems: "baseline", gap: 14, padding: "6px 0", borderBottom: j < group.items.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                <span style={{ color: "#fff", fontFamily: "'JetBrains Mono', monospace", fontSize: 15, fontWeight: 600, minWidth: 200, flexShrink: 0 }}>{item.formula}</span>
                <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 13 }}>{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════════════════════════ */
const tabs = [
  { id: "theory", label: "Teorie", icon: "📚" },
  { id: "problems", label: "Příklady", icon: "📝" },
  { id: "quiz", label: "Kvíz", icon: "🧪" },
  { id: "flashcards", label: "Kartičky", icon: "🃏" },
  { id: "formulas", label: "Vzorce", icon: "📋" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("theory");

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a1a", fontFamily: "'Exo 2', sans-serif", position: "relative", overflow: "hidden" }}>
      {/* ── Google Fonts + Keyframes ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@400;600;700;800&family=Audiowide&family=JetBrains+Mono:wght@400;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes gridMove {
          0% { transform: perspective(400px) rotateX(60deg) translateY(0); }
          100% { transform: perspective(400px) rotateX(60deg) translateY(50px); }
        }
        @keyframes sunPulse {
          0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.75; transform: translate(-50%, -50%) scale(1.02); }
        }
        @keyframes float1 { 0%, 100% { transform: translateY(0) translateX(0); } 50% { transform: translateY(-15px) translateX(8px); } }
        @keyframes float2 { 0%, 100% { transform: translateY(0) translateX(0); } 50% { transform: translateY(10px) translateX(-10px); } }
        @keyframes float3 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .tab-content-enter { animation: fadeSlideIn 0.5s ease forwards; }
        button:hover { filter: brightness(1.15); }
        button:disabled { opacity: 0.4; cursor: not-allowed; filter: none; }
        input:focus { border-color: ${ACCENT} !important; }

        @media (max-width: 600px) {
          .tab-bar { gap: 4px !important; }
          .tab-btn { padding: 8px 10px !important; font-size: 12px !important; }
          .tab-label { display: none; }
        }
      `}</style>

      {/* ── Synthwave Background ── */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
        {/* Grid floor */}
        <div style={{
          position: "absolute", bottom: 0, left: "-50%", width: "200%", height: "55%",
          backgroundImage: "linear-gradient(rgba(6,182,212,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.06) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
          animation: "gridMove 30s linear infinite",
        }} />
        {/* Neon sun */}
        <div style={{
          position: "absolute", top: "18%", left: "50%", width: 280, height: 280,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.25) 0%, rgba(6,182,212,0.15) 40%, transparent 70%)",
          animation: "sunPulse 30s ease-in-out infinite",
          filter: "blur(40px)",
        }} />
        {/* Floating particles */}
        <div style={{ position: "absolute", top: "10%", left: "15%", width: 140, height: 140, borderRadius: "50%", background: "rgba(6,182,212,0.04)", filter: "blur(50px)", animation: "float1 18s ease-in-out infinite" }} />
        <div style={{ position: "absolute", top: "35%", right: "10%", width: 180, height: 180, borderRadius: "50%", background: "rgba(139,92,246,0.04)", filter: "blur(60px)", animation: "float2 22s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: "25%", left: "60%", width: 120, height: 120, borderRadius: "50%", background: "rgba(236,72,153,0.03)", filter: "blur(45px)", animation: "float3 20s ease-in-out infinite" }} />
      </div>

      {/* ── Content ── */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto", padding: "24px 8px 60px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 800, fontFamily: "'Audiowide', sans-serif", marginBottom: 8, lineHeight: 1.3 }}>
            Hydrostatika
          </h1>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14 }}>
            Pascalův zákon · Hydraulická zařízení · Archimédův zákon
          </p>
        </div>

        {/* Tab bar */}
        <div className="tab-bar" style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 24, flexWrap: "wrap", padding: "0 8px" }}>
          {tabs.map(t => (
            <button
              key={t.id}
              className="tab-btn"
              onClick={() => setActiveTab(t.id)}
              style={{
                padding: "10px 18px", borderRadius: 14, border: "none", cursor: "pointer",
                fontSize: 14, fontWeight: 600, fontFamily: "'Exo 2', sans-serif",
                transition: "all 0.4s ease", display: "flex", alignItems: "center", gap: 6,
                background: activeTab === t.id ? ACCENT + "33" : "rgba(255,255,255,0.05)",
                color: activeTab === t.id ? ACCENT : "rgba(255,255,255,0.55)",
                boxShadow: activeTab === t.id ? `0 0 20px ${ACCENT}22` : "none",
                border: activeTab === t.id ? `1px solid ${ACCENT}55` : "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <span>{t.icon}</span>
              <span className="tab-label">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div key={activeTab} className="tab-content-enter">
          {activeTab === "theory" && <TheorySection />}
          {activeTab === "problems" && <ProblemsSection />}
          {activeTab === "quiz" && <QuizEngine questions={quizQuestions} accentColor={ACCENT} />}
          {activeTab === "flashcards" && <FlashcardsSection />}
          {activeTab === "formulas" && <FormulaSheet />}
        </div>
      </div>
    </div>
  );
}
