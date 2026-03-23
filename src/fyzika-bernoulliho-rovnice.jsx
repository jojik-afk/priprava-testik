// @title Bernoulliho rovnice — Hydrodynamika
// @subject Physics
// @topic Bernoulliho rovnice, Rovnice kontinuity, Hydrodynamika
// @template study

import { useState, useCallback, useMemo } from 'react';

/* ═══════════════════════════════════════════════════════════════════
   QUIZ ENGINE
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
    const msg = pct >= 90 ? "Výborně! Bernoulliho rovnici máš v malíčku!"
      : pct >= 70 ? "Dobře! Ještě trochu zopakuj a test zvládneš."
      : pct >= 50 ? "Solidní základ, ale opakování se vyplatí."
      : "Projdi si teorii znovu a pak to zkus!";
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "280px" }}>
        <div style={{ textAlign: "center", ...glass, padding: "40px 48px" }}>
          <div style={{ color: "#fff", fontSize: "52px", fontWeight: 800, lineHeight: 1.1 }}>{score} / {shuffledQuestions.length}</div>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "22px", marginBottom: "16px" }}>{pct} %</div>
          <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "17px", lineHeight: 1.5, marginBottom: "24px", maxWidth: "340px", margin: "0 auto 24px" }}>{msg}</div>
          <button style={{ ...btnStyle, background: ACCENT + "66", border: `1px solid ${ACCENT}` }} onClick={restart}>Znovu</button>
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
    title: "Základy hydrodynamiky",
    icon: "🌊",
    content: [
      { subtitle: "Co je hydrodynamika?", text: "Hydrodynamika je obor fyziky zabývající se mechanickým pohybem (prouděním) kapalin. Studujeme, jak kapalina proudí, jak se mění rychlost, tlak a energie při pohybu.\n\nTekutina mezi dvěma místy proudí tehdy, jestliže je mezi nimi rozdíl tlaků." },
      { subtitle: "Typy proudění", text: "Laminární proudění — klidné, vrstevnaté; proudnice jsou rovnoběžné a nezaměňují se; typické pro nízké rychlosti a úzká potrubí.\n\nTurbulentní proudění — chaotické, s víry; proudnice jsou nepravidelné; vzniká při vysokých rychlostech nebo velkých průřezech." },
      { subtitle: "Proudnice", text: "Trajektorie pohybu jednotlivých částic proudící tekutiny. Tečna sestrojená v určitém bodě k proudnici určuje směr rychlosti pohybující se částice tekutiny v tomto bodě.\n\nU laminárního proudění jsou proudnice rovnoběžné. U turbulentního jsou chaotické." },
      { subtitle: "Ideální kapalina", text: "Pro zjednodušení výpočtů pracujeme s ideální kapalinou:\n• Nestlačitelná (hustota ρ = konst.)\n• Bez vnitřního tření (bez viskozity)\n• Homogenní\n\nReálné kapaliny (voda, olej) se od modelu liší, ale pro mnoho úloh je dostačující." },
    ]
  },
  {
    title: "Objemový a hmotnostní průtok",
    icon: "💧",
    content: [
      { subtitle: "Objemový průtok QV", text: "Fyzikální veličina udávající objem V kapaliny, která proteče průřezem S za jednotku času.\n\nQV = V/t = S·v\n\nJednotka: m³/s\n\nOdvození: za dobu t projde průřezem S kapalina o délce h = v·t, tedy o objemu V = S·h = S·v·t → QV = V/t = S·v" },
      { subtitle: "Hmotnostní průtok Qm", text: "Fyzikální veličina udávající hmotnost m kapaliny, která proteče průřezem S za jednotku času.\n\nQm = m/t = ρ·V/t = ρ·S·v\n\nJednotka: kg/s\n\nVztah: Qm = ρ·QV" },
      { subtitle: "Ukázkový příklad", text: "Vodovodní potrubí má průměr d = 2 cm (r = 0,01 m). Voda protéká rychlostí v = 1,5 m/s.\n\nS = π·r² = π·(0,01)² ≈ 3,14·10⁻⁴ m²\nQV = S·v = 3,14·10⁻⁴ · 1,5 ≈ 4,7·10⁻⁴ m³/s ≈ 0,47 l/s\nQm = ρ·QV = 1000 · 4,7·10⁻⁴ ≈ 0,47 kg/s" },
    ]
  },
  {
    title: "Rovnice kontinuity",
    icon: "🔀",
    content: [
      { subtitle: "Znění zákona", text: "Při ustáleném proudění ideální kapaliny je objemový průtok v každém místě trubice stejný.\n\nQV = konst.\nQV1 = QV2\nS₁·v₁ = S₂·v₂\n\nPlatí pro nestlačitelnou kapalinu — kolik kapaliny přiteče, tolik musí odtéci." },
      { subtitle: "Důsledky pro rychlost", text: "Z rovnice S₁·v₁ = S₂·v₂ plyne:\n\n• Zužuje-li se trubice (S₂ < S₁) → rychlost roste (v₂ > v₁)\n• Rozšiřuje-li se trubice (S₂ > S₁) → rychlost klesá (v₂ < v₁)\n\nPříklad: řeka v úzké rokli teče rychle, v širokém údolí pomalu." },
      { subtitle: "Hmotnostní průtok", text: "Pro nestlačitelnou kapalinu je zachován i hmotnostní průtok:\n\nQm = ρ·S₁·v₁ = ρ·S₂·v₂ = konst.\n\nPro stlačitelné plyny platí zachování Qm (ne QV) — hustota se mění." },
      { subtitle: "Odkud bere kapalina energii?", text: "V zúžené části trubice má kapalina větší kinetickou energii:\n\nEk = ½mv², Ek/V = ½·(m/V)·v² = ½ρv²\n\nPřírůstek kinetické energie musí být roven úbytku jiné formy energie — tlakové potenciální energie. Tím se dostáváme k Bernoulliho rovnici." },
    ]
  },
  {
    title: "Bernoulliho rovnice",
    icon: "⚡",
    content: [
      { subtitle: "Zákon zachování energie pro kapaliny", text: "Bernoulliho rovnice je aplikací zákona zachování mechanické energie na proudící kapalinu.\n\nSoučet kinetické a tlakové potenciální energie kapaliny o jednotkovém objemu je ve všech částech vodorovné trubice stejný.\n\np + ½ρv² = konst.\n\np₁ + ½ρv₁² = p₂ + ½ρv₂²" },
      { subtitle: "Složky energie", text: "Dynamický tlak:  pd = ½ρv²\n(kinetická energie na jednotkový objem)\n\nStatický tlak:  ps = p\n(tlaková energie kapaliny)\n\nOdvození: tlaková pot. energie ΔEp = W = F·s = p·S·s = p·V → Ep/V = p" },
      { subtitle: "Hydrodynamický paradox", text: "Kde kapalina proudí RYCHLEJI (zúžení) → menší statický tlak.\nKde proudí POMALEJI (rozšíření) → větší statický tlak.\n\nToto je hydrodynamický paradox — zdánlivě neintuitivní, ale přesně odpovídá zachování energie.\n\nV zúžení: v↑ → ½ρv²↑ → p↓  (součet musí zůstat konstantní!)" },
      { subtitle: "Obecná Bernoulliho rovnice (s výškou)", text: "Pokud trubice není vodorovná, přidáme člen pro tíhovou potenciální energii:\n\np + ½ρv² + ρgh = konst.\n\np₁ + ½ρv₁² + ρgh₁ = p₂ + ½ρv₂² + ρgh₂\n\nh je výška bodu nad zvolenou nulovou hladinou." },
    ]
  },
  {
    title: "Aplikace",
    icon: "✈️",
    content: [
      { subtitle: "Torricelliho věta", text: "Výtok z otvoru ve stěně nádoby naplněné kapalinou.\n\nOtvor je ve hloubce h pod hladinou. Hladina klesá zanedbatelně pomalu → v_hladiny ≈ 0.\n\nBernoulli (hladina → otvor):\np_atm + 0 + ρgh = p_atm + ½ρv² + 0\nρgh = ½ρv²\n\nv = √(2gh)\n\nRychlost závisí pouze na hloubce — ne na hustotě!" },
      { subtitle: "Pitotova trubice", text: "Měřič rychlosti proudění. Dvě větve:\n\n• Rovná trubice — statický tlak: p = ρg·h₁\n• Ohnutá trubice (proti proudu) — zastaví kapalinu (v=0), měří celkový tlak: p + ½ρv² = ρg·h₂\n\nDynamický tlak: ½ρv² = ρg(h₂ − h₁)\nRychlost: v = √(2g·Δh)" },
      { subtitle: "Venturiho trubice", text: "Měřič průtoku — zúžené místo v potrubí.\n\nV zúžení: rychlost↑, tlak↓. Změřením tlakového rozdílu mezi širší a užší částí lze vypočítat průtok.\n\nPoužití: průtokoměry v chemickém průmyslu, karburátory, Bunsenův hořák." },
      { subtitle: "Další aplikace v praxi", text: "• Nosná plocha letadla — nad křídlem je vzduch rychlejší → nižší tlak → vztlak\n• Magnusův efekt — rotující míč (tenis, fotbal, golf)\n• Sprchový závěs — proudící voda strhává vzduch a závěs se přitahuje\n• Ejektory a injektory — čerpání tekutin bez pohyblivých částí\n• Karmanovy víry — kolísání tlaku za objekty v proudu" },
    ]
  },
];

/* ═══════════════════════════════════════════════════════════════════
   DATA — WORKED PROBLEMS
   ═══════════════════════════════════════════════════════════════════ */
const problems = [
  {
    title: "Zavlažovací kanál — hloubka",
    difficulty: "easy",
    topic: "Objemový průtok / Rovnice kontinuity",
    statement: "Urči, jakou hloubku musí mít 3 m široký zavlažovací kanál, aby jím při rychlosti 1,5 m·s⁻¹ protékalo 8 m³/s vody.\n(Průřez kanálu je obdélníkový.)",
    checkAnswer: { value: 1.78, tolerance: 0.03, unit: "m" },
    solution: {
      given: "šířka a = 3 m,  v = 1,5 m·s⁻¹,  QV = 8 m³·s⁻¹",
      formula: "QV = S·v = (a·h)·v  →  h = QV / (a·v)",
      steps: [
        "QV = a·h·v",
        "8 = 3 · h · 1,5",
        "8 = 4,5 · h",
        "h = 8 / 4,5",
        "h ≈ 1,78 m"
      ],
      result: "h ≈ 1,78 m ≈ 1,8 m"
    }
  },
  {
    title: "Honza a hadice — rychlost vody (a)",
    difficulty: "easy",
    topic: "Objemový průtok",
    statement: "Honza napustil desetilitrovou konev za 20 sekund. Hadice měla vnitřní průměr 19 mm a voda v ní tekla stálou rychlostí.\n\nUrčete: Jakou rychlostí tekla voda v hadici?",
    checkAnswer: { value: 1.76, tolerance: 0.06, unit: "m/s" },
    solution: {
      given: "V = 10 L = 0,010 m³,  t = 20 s,  d = 19 mm = 0,019 m  →  r = 0,0095 m",
      formula: "QV = V/t = S·v  →  v = QV / S\nS = π·r²",
      steps: [
        "QV = 0,010 / 20 = 5,0·10⁻⁴ m³/s",
        "S = π·(0,0095)² = π·9,025·10⁻⁵ ≈ 2,835·10⁻⁴ m²",
        "v = QV / S = 5,0·10⁻⁴ / 2,835·10⁻⁴",
        "v ≈ 1,76 m/s"
      ],
      result: "v ≈ 1,76 m/s ≈ 1,8 m/s"
    }
  },
  {
    title: "Honza a hadice — stříkání prstem (b)",
    difficulty: "medium",
    topic: "Rovnice kontinuity",
    statement: "Honza pak začal stříkat na brášku. Jakou rychlostí voda z hadice stříkala, když Honza polovinu průřezu hadice zacpal prstem?\n(Voda se nikde v hadici nehromadí.)",
    checkAnswer: { value: 3.52, tolerance: 0.12, unit: "m/s" },
    solution: {
      given: "v₁ ≈ 1,76 m/s (z části a),  S₂ = S₁/2  (zacpána polovina průřezu)",
      formula: "Rovnice kontinuity: S₁·v₁ = S₂·v₂  →  v₂ = v₁·(S₁/S₂)",
      steps: [
        "S₂ = S₁/2",
        "S₁·v₁ = (S₁/2)·v₂",
        "v₂ = 2·v₁",
        "v₂ = 2 · 1,76 = 3,52 m/s"
      ],
      result: "v₂ ≈ 3,52 m/s ≈ 3,5 m/s\nZmenšením průřezu na polovinu se rychlost zdvojnásobí."
    }
  },
  {
    title: "Manometrické trubice — rychlost proudění",
    difficulty: "medium",
    topic: "Bernoulliho rovnice (Pitotova trubice)",
    statement: "Do vodorovného potrubí jsou vložené dvě manometrické trubice: jedna rovná, druhá ohnutá do pravého úhlu a obrácená otvorem PROTI směru proudění kapaliny.\n\nJaká je rychlost proudění, jestliže v rovné trubici vystoupila voda do výšky h₁ = 10 cm a v ohnuté trubici do výšky h₂ = 30 cm?",
    checkAnswer: { value: 1.98, tolerance: 0.06, unit: "m/s" },
    solution: {
      given: "h₁ = 10 cm = 0,10 m  (rovná — statický tlak)\nh₂ = 30 cm = 0,30 m  (ohnutá — celkový tlak)\nρ_vody = 1 000 kg·m⁻³,  g = 9,81 m·s⁻²",
      formula: "Rovná trubice:  p = ρg·h₁\nOhnutá (zastaví kapalinu, v=0):  p + ½ρv² = ρg·h₂\n→  ½ρv² = ρg(h₂ − h₁)  →  v = √(2g·Δh)",
      steps: [
        "½ρv² = ρg·(h₂ − h₁)",
        "v² = 2g·(0,30 − 0,10) = 2·9,81·0,20",
        "v² = 3,924 m²/s²",
        "v = √3,924 ≈ 1,98 m/s"
      ],
      result: "v ≈ 1,98 m/s ≈ 2,0 m/s"
    }
  },
  {
    title: "Výtok z nádoby — Torricelliho věta",
    difficulty: "hard",
    topic: "Bernoulliho rovnice + vrh vodorovný",
    statement: "Ve stěně válcové nádoby naplněné vodou je otvor, který je 49 cm pod povrchem vody a ve výšce 9 cm nad povrchem stolu.\n\nDo jaké vzdálenosti od nádoby dopadne vodní paprsek vytékající z otvoru?",
    checkAnswer: { value: 0.42, tolerance: 0.03, unit: "m" },
    solution: {
      given: "h₁ = 49 cm = 0,49 m  (hloubka otvoru pod hladinou)\nh₂ = 9 cm = 0,09 m  (výška otvoru nad stolem)\ng = 9,81 m·s⁻²",
      formula: "1. Rychlost výtoku (Torricelli):  v = √(2g·h₁)\n2. Čas pádu na stůl:  h₂ = ½g·t²  →  t = √(2h₂/g)\n3. Vzdálenost dopadu:  x = v·t",
      steps: [
        "KROK 1 — rychlost výtoku z otvoru:",
        "v = √(2·9,81·0,49) = √9,614 ≈ 3,10 m/s",
        "",
        "KROK 2 — čas pádu na stůl:",
        "t = √(2·0,09/9,81) = √0,01835 ≈ 0,1354 s",
        "",
        "KROK 3 — vodorovná vzdálenost dopadu:",
        "x = v·t = 3,10 · 0,1354 ≈ 0,42 m"
      ],
      result: "x ≈ 0,42 m = 42 cm\nVoda dopadne přibližně 42 cm od stěny nádoby."
    }
  },
];

/* ═══════════════════════════════════════════════════════════════════
   DATA — QUIZ
   ═══════════════════════════════════════════════════════════════════ */
const quizQuestions = [
  {
    question: "Co udává objemový průtok QV?",
    type: "single",
    options: [
      "Objem kapaliny, který proteče průřezem za jednotku času",
      "Hmotnost kapaliny, která proteče průřezem za sekundu",
      "Rychlost pohybu kapaliny v trubici",
      "Tlak kapaliny na stěny trubice"
    ],
    correct: [0],
    explanation: "Objemový průtok QV = V/t = S·v udává objem kapaliny protékající průřezem S za jednotku času. Jednotka je m³/s.",
    tip: "Hmotnostní průtok Qm = ρ·QV — násobí navíc hustotou"
  },
  {
    question: "Jak zní rovnice kontinuity pro dvě místa v trubici?",
    type: "single",
    options: [
      "S₁·v₁ = S₂·v₂",
      "p₁·v₁ = p₂·v₂",
      "S₁/v₁ = S₂/v₂",
      "S₁ + v₁ = S₂ + v₂"
    ],
    correct: [0],
    explanation: "Rovnice kontinuity: S₁v₁ = S₂v₂. Objemový průtok QV je při ustáleném proudění ideální kapaliny v každém místě trubice konstantní."
  },
  {
    question: "Průřez trubice se zúží na POLOVINU. Co se stane s rychlostí proudění?",
    type: "single",
    options: [
      "Zdvojnásobí se",
      "Zůstane stejná",
      "Sníží se na polovinu",
      "Zčtyřnásobí se"
    ],
    correct: [0],
    explanation: "Z rovnice kontinuity S₁v₁ = S₂v₂: když S₂ = S₁/2, pak v₂ = v₁·(S₁/S₂) = 2v₁. Menší průřez → větší rychlost.",
    tip: "Rychlost a průřez jsou nepřímo úměrné: v ~ 1/S"
  },
  {
    question: "Co říká Bernoulliho rovnice pro proudění v horizontální trubici?",
    type: "single",
    options: [
      "Součet statického a dynamického tlaku je v každém místě konstantní",
      "Tlak kapaliny je v každém místě trubice stejný",
      "Rychlost kapaliny je v každém místě trubice stejná",
      "Hmotnostní průtok závisí na hustotě kapaliny"
    ],
    correct: [0],
    explanation: "Bernoulliho rovnice: p + ½ρv² = konst. Součet statického tlaku (p) a dynamického tlaku (½ρv²) je v každém místě vodorovné trubice konstantní."
  },
  {
    question: "Jak se nazývá veličina ½ρv²?",
    type: "single",
    options: [
      "Dynamický tlak",
      "Statický tlak",
      "Hydrostatický tlak",
      "Celkový tlak"
    ],
    correct: [0],
    explanation: "Dynamický tlak pd = ½ρv² je kinetická energie kapaliny přepočtená na jednotkový objem. Statický tlak ps = p je normální tlak kapaliny."
  },
  {
    question: "Kapalina se v zúžené části trubice zrychlí. Jak se změní statický tlak?",
    type: "single",
    options: [
      "Tlak se SNÍŽÍ",
      "Tlak se zvýší",
      "Tlak zůstane stejný",
      "Závisí na hustotě kapaliny"
    ],
    correct: [0],
    explanation: "Hydrodynamický paradox: dle Bernoulli p + ½ρv² = konst. Pokud v roste, musí p klesat. Větší rychlost = menší statický tlak.",
    tip: "Proto nosná plocha letadla vytváří vztlak — nad křídlem vzduch proudí rychleji"
  },
  {
    question: "Z jakého fyzikálního principu plyne Bernoulliho rovnice?",
    type: "single",
    options: [
      "Zákon zachování mechanické energie",
      "Zákon zachování hybnosti",
      "Newtonův druhý pohybový zákon",
      "Zákon zachování náboje"
    ],
    correct: [0],
    explanation: "Bernoulliho rovnice je aplikací zákona zachování mechanické energie na proudící kapalinu. Součet kinetické (½ρv²) a tlakové energie (p) na jednotkový objem je konstantní."
  },
  {
    question: "Torricelliho věta udává rychlost výtoku kapaliny z otvoru v nádobě jako:",
    type: "single",
    options: [
      "v = √(2gh)",
      "v = 2gh",
      "v = √(gh)",
      "v = g·h²"
    ],
    correct: [0],
    explanation: "Torricelliho věta: v = √(2gh), kde h je hloubka otvoru pod hladinou. Plyne z Bernoulliho rovnice při zanedbání poklesu hladiny (v_hladiny ≈ 0)."
  },
  {
    question: "Průřez trubice se ztrojnásobí. Co se stane s rychlostí kapaliny?",
    type: "single",
    options: [
      "Sníží se na třetinu",
      "Ztrojnásobí se",
      "Zůstane stejná",
      "Zvětší se 9×"
    ],
    correct: [0],
    explanation: "S₁v₁ = S₂v₂. Pokud S₂ = 3S₁, pak v₂ = v₁/3. Větší průřez → menší rychlost. Jsou nepřímo úměrné."
  },
  {
    question: "Jaká je jednotka objemového průtoku QV?",
    type: "single",
    options: [
      "m³·s⁻¹",
      "kg·s⁻¹",
      "m·s⁻¹",
      "Pa·s"
    ],
    correct: [0],
    explanation: "QV = V/t má jednotku m³/s = m³·s⁻¹. Hmotnostní průtok Qm = m/t má kg/s = kg·s⁻¹. Pozor na záměnu!"
  },
  {
    question: "Co je proudnice?",
    type: "single",
    options: [
      "Trajektorie pohybu částice proudící tekutiny",
      "Trubice, ve které proudí kapalina",
      "Přímka rovnoběžná s osou potrubí",
      "Veličina udávající rychlost proudění"
    ],
    correct: [0],
    explanation: "Proudnice je trajektorie, po které se pohybují částice tekutiny. Tečna k proudnici v daném bodě určuje směr rychlosti v tomto místě."
  },
  {
    question: "Otvor ve stěně nádoby je 80 cm pod hladinou vody. Jaká je rychlost výtoku? (g ≈ 9,81 m/s²)",
    type: "single",
    options: [
      "v ≈ 3,96 m/s",
      "v ≈ 7,85 m/s",
      "v ≈ 1,98 m/s",
      "v ≈ 15,7 m/s"
    ],
    correct: [0],
    explanation: "Torricelliho věta: v = √(2gh) = √(2·9,81·0,80) = √15,696 ≈ 3,96 m/s.",
    tip: "Rychlý odhad: √(2·10·0,8) = √16 = 4 m/s — pamatuj si základ"
  },
  {
    question: "Manometrická rovná trubice ukazuje h₁ = 15 cm, ohnutá (proti proudu) h₂ = 35 cm. Jaká je rychlost proudění?",
    type: "single",
    options: [
      "v = √(2g·0,20) ≈ 1,98 m/s",
      "v = √(2g·0,35) ≈ 2,62 m/s",
      "v = √(2g·0,15) ≈ 1,72 m/s",
      "v = √(2g·0,50) ≈ 3,13 m/s"
    ],
    correct: [0],
    explanation: "Dynamický tlak ½ρv² = ρg(h₂−h₁). Tedy v = √(2g·Δh) = √(2·9,81·0,20) ≈ 1,98 m/s. Klíčový je ROZDÍL výšek, ne absolutní hodnoty.",
    tip: "Δh = h₂ − h₁ = 35 − 15 = 20 cm = 0,20 m"
  },
  {
    question: "Která tvrzení o Bernoulliho rovnici jsou SPRÁVNĚ? (více odpovědí)",
    type: "multi",
    options: [
      "Platí pro nestlačitelnou kapalinu bez viskozity",
      "Plyne ze zákona zachování energie",
      "V místě větší rychlosti je větší statický tlak",
      "p + ½ρv² = konst. platí v každém místě vodorovné trubice"
    ],
    correct: [0, 1, 3],
    explanation: "Tvrzení A, B a D jsou správná. Tvrzení C je CHYBNÉ — v místě větší rychlosti je MENŠÍ statický tlak (hydrodynamický paradox). Větší v → větší ½ρv² → menší p."
  },
];

/* ═══════════════════════════════════════════════════════════════════
   DATA — FLASHCARDS
   ═══════════════════════════════════════════════════════════════════ */
const flashcards = [
  { front: "Objemový průtok QV", back: "QV = V/t = S·v\n\nJednotka: m³/s\n\nObjem kapaliny protékající průřezem S za jednotku času." },
  { front: "Hmotnostní průtok Qm", back: "Qm = m/t = ρ·S·v = ρ·QV\n\nJednotka: kg/s\n\nHmotnost kapaliny protékající průřezem S za jednotku času." },
  { front: "Rovnice kontinuity", back: "S₁·v₁ = S₂·v₂\n\nQV = konst.\n\nPři ustáleném proudění ideální kapaliny je objemový průtok v každém místě trubice stejný." },
  { front: "Bernoulliho rovnice (vodorovná trubice)", back: "p + ½ρv² = konst.\n\np₁ + ½ρv₁² = p₂ + ½ρv₂²\n\nZákon zachování mechanické energie pro proudící kapalinu." },
  { front: "Obecná Bernoulliho rovnice", back: "p + ½ρv² + ρgh = konst.\n\nPlatí i pro trubice v různých výškách.\nh = výška bodu nad nulovou hladinou." },
  { front: "Dynamický tlak", back: "pd = ½ρv²\n\nKinetická energie na jednotkový objem.\n\nVětší rychlost = větší dynamický tlak = menší statický tlak!" },
  { front: "Hydrodynamický paradox", back: "Větší rychlost → MENŠÍ statický tlak\nMenší rychlost → VĚTŠÍ statický tlak\n\nZúžení trubice: v↑ → ½ρv²↑ → p↓\n\nPříklad: nosná plocha letadla — vztlak" },
  { front: "Torricelliho věta", back: "v = √(2gh)\n\nh = hloubka otvoru pod hladinou\n\nRychlost výtoku závisí pouze na hloubce.\nNezávisí na hustotě kapaliny!" },
  { front: "Pitotova trubice", back: "Měří rychlost proudění.\n\nRovná větev: statický tlak → h₁\nOhnutá větev (proti proudu): celkový tlak → h₂\n\nv = √(2g·Δh)  kde  Δh = h₂ − h₁" },
  { front: "Proudnice & typy proudění", back: "Proudnice = trajektorie částice kapaliny\nTečna k proudnici = směr rychlosti\n\nLaminární: proudnice rovnoběžné, klidné\nTurbulentní: proudnice chaotické, víry" },
];

/* ═══════════════════════════════════════════════════════════════════
   DATA — FORMULA SHEET
   ═══════════════════════════════════════════════════════════════════ */
const formulaGroups = [
  {
    title: "Průtoky",
    icon: "💧",
    formulas: [
      { name: "Objemový průtok", formula: "QV = V/t = S·v", unit: "[m³/s]", note: "V = objem, S = průřez, v = rychlost" },
      { name: "Hmotnostní průtok", formula: "Qm = m/t = ρ·S·v", unit: "[kg/s]", note: "ρ = hustota kapaliny [kg/m³]" },
      { name: "Vztah průtoků", formula: "Qm = ρ·QV", unit: "", note: "" },
    ]
  },
  {
    title: "Rovnice kontinuity",
    icon: "🔀",
    formulas: [
      { name: "Rovnice kontinuity", formula: "S₁·v₁ = S₂·v₂", unit: "", note: "Objemový průtok je konstantní" },
      { name: "Obecně", formula: "QV = konst.", unit: "[m³/s]", note: "Platí pro nestlačitelnou kapalinu" },
    ]
  },
  {
    title: "Bernoulliho rovnice",
    icon: "⚡",
    formulas: [
      { name: "Pro vodorovnou trubici", formula: "p + ½ρv² = konst.", unit: "[Pa]", note: "Zákon zachování energie" },
      { name: "Dvě místa", formula: "p₁ + ½ρv₁² = p₂ + ½ρv₂²", unit: "[Pa]", note: "" },
      { name: "Obecná (s výškou)", formula: "p + ½ρv² + ρgh = konst.", unit: "[Pa]", note: "h = výška nad nulovou hladinou" },
      { name: "Dynamický tlak", formula: "pd = ½ρv²", unit: "[Pa]", note: "Kinetická energie / objem" },
    ]
  },
  {
    title: "Aplikace",
    icon: "✈️",
    formulas: [
      { name: "Torricelliho věta", formula: "v = √(2gh)", unit: "[m/s]", note: "h = hloubka otvoru pod hladinou" },
      { name: "Pitotova trubice", formula: "v = √(2g·Δh)", unit: "[m/s]", note: "Δh = h₂ − h₁ (ohnutá − rovná)" },
    ]
  },
  {
    title: "Důležité konstanty",
    icon: "📐",
    formulas: [
      { name: "Tíhové zrychlení", formula: "g = 9,81 m·s⁻²", unit: "", note: "≈ 10 m/s² pro rychlé odhady" },
      { name: "Hustota vody", formula: "ρ = 1 000 kg·m⁻³", unit: "", note: "Při 4 °C" },
      { name: "Atmosferický tlak", formula: "p₀ ≈ 101 325 Pa ≈ 101 kPa", unit: "", note: "= 1 atm" },
    ]
  },
];

/* ═══════════════════════════════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════════════════════════════ */
function WorkedProblem({ prob }) {
  const [open, setOpen] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [answerChecked, setAnswerChecked] = useState(false);

  const diffBadge = {
    easy: { label: "Easy ✨", color: "#22c55e" },
    medium: { label: "Medium ⚡", color: "#f59e0b" },
    hard: { label: "Hard 🔥", color: "#ef4444" }
  }[prob.difficulty];

  const numAnswer = parseFloat(userAnswer.replace(',', '.'));
  const isCorrect = prob.checkAnswer && !isNaN(numAnswer) && Math.abs(numAnswer - prob.checkAnswer.value) <= prob.checkAnswer.tolerance;

  return (
    <div style={{ ...glass, padding: "20px", marginBottom: "16px" }}>
      <div style={{ marginBottom: "12px" }}>
        <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: 600, color: diffBadge.color, border: `1px solid ${diffBadge.color}`, marginBottom: "8px" }}>{diffBadge.label}</span>
        <div style={{ fontSize: "11px", color: ACCENT, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>{prob.topic}</div>
        <div style={{ color: "#fff", fontSize: "17px", fontWeight: 600 }}>{prob.title}</div>
      </div>
      <div style={{ color: "rgba(255,255,255,0.82)", fontSize: "15px", lineHeight: 1.7, whiteSpace: "pre-line", marginBottom: "16px" }}>{prob.statement}</div>

      {prob.checkAnswer && (
        <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "12px", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder={`Tvá odpověď [${prob.checkAnswer.unit}]`}
            value={userAnswer}
            onChange={e => { setUserAnswer(e.target.value); setAnswerChecked(false); }}
            style={{ padding: "8px 14px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px", color: "#fff", fontSize: "15px", width: "180px" }}
          />
          <button style={{ ...btnStyle, padding: "8px 16px" }} onClick={() => setAnswerChecked(true)}>Zkontrolovat</button>
          {answerChecked && !isNaN(numAnswer) && (
            <span style={{ color: isCorrect ? "#22c55e" : "#ef4444", fontWeight: 600 }}>
              {isCorrect ? "✓ Správně!" : `✗ Správná hodnota: ${prob.checkAnswer.value} ${prob.checkAnswer.unit}`}
            </span>
          )}
        </div>
      )}

      <button
        style={{ ...btnStyle, background: open ? ACCENT + "22" : "rgba(255,255,255,0.07)", border: `1px solid ${open ? ACCENT : "rgba(255,255,255,0.15)"}` }}
        onClick={() => setOpen(o => !o)}
      >
        {open ? "▲ Skrýt řešení" : "▼ Zobrazit řešení"}
      </button>

      {open && (
        <div style={{ marginTop: "16px", padding: "18px", background: "rgba(6,182,212,0.05)", borderRadius: "14px", border: "1px solid rgba(6,182,212,0.2)" }}>
          <div style={{ marginBottom: "14px" }}>
            <div style={{ color: ACCENT, fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "6px" }}>Zadáno</div>
            <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "14px", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.7, whiteSpace: "pre-line" }}>{prob.solution.given}</div>
          </div>
          <div style={{ marginBottom: "14px" }}>
            <div style={{ color: ACCENT, fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "6px" }}>Vzorec</div>
            <div style={{ color: "#a5f3fc", fontSize: "14px", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.7, whiteSpace: "pre-line" }}>{prob.solution.formula}</div>
          </div>
          <div style={{ marginBottom: "14px" }}>
            <div style={{ color: ACCENT, fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "6px" }}>Postup výpočtu</div>
            {prob.solution.steps.map((s, i) => (
              <div key={i} style={{ color: "rgba(255,255,255,0.82)", fontSize: "14px", fontFamily: "'JetBrains Mono', monospace", marginBottom: "3px", paddingLeft: s.startsWith("KROK") ? "0" : "16px", fontWeight: s.startsWith("KROK") ? 600 : 400 }}>{s || "\u00A0"}</div>
            ))}
          </div>
          <div style={{ padding: "12px 16px", background: "rgba(34,197,94,0.1)", borderRadius: "10px", border: "1px solid rgba(34,197,94,0.3)" }}>
            <div style={{ color: "#22c55e", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "4px" }}>Výsledek</div>
            <div style={{ color: "#fff", fontSize: "15px", fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", whiteSpace: "pre-line" }}>{prob.solution.result}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function FlashcardsPanel({ cards }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const goTo = (i) => { setIdx(i); setFlipped(false); };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "16px" }}>
      <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap", marginBottom: "24px" }}>
        {cards.map((_, i) => (
          <div key={i} onClick={() => goTo(i)}
            style={{ width: "22px", height: "22px", borderRadius: "50%", cursor: "pointer", transition: "background 0.4s ease", background: i === idx ? ACCENT : "rgba(255,255,255,0.2)" }} />
        ))}
      </div>

      <div style={{ perspective: "1000px", height: "240px", cursor: "pointer", marginBottom: "24px" }} onClick={() => setFlipped(f => !f)}>
        <div style={{
          position: "relative", width: "100%", height: "100%",
          transition: "transform 0.4s ease", transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)"
        }}>
          <div style={{ position: "absolute", width: "100%", height: "100%", backfaceVisibility: "hidden", ...glass, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", padding: "24px", boxSizing: "border-box" }}>
            <div style={{ color: ACCENT, fontSize: "12px", textTransform: "uppercase", marginBottom: "10px" }}>Kartička {idx + 1} / {cards.length}</div>
            <div style={{ color: "#fff", fontSize: "22px", fontWeight: 700, textAlign: "center" }}>{cards[idx].front}</div>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", marginTop: "20px" }}>klikni pro otočení →</div>
          </div>
          <div style={{ position: "absolute", width: "100%", height: "100%", backfaceVisibility: "hidden", transform: "rotateY(180deg)", ...glass, background: "rgba(6,182,212,0.07)", border: "1px solid rgba(6,182,212,0.25)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", boxSizing: "border-box" }}>
            <div style={{ color: "rgba(255,255,255,0.92)", fontSize: "15px", fontFamily: "'JetBrains Mono', monospace", textAlign: "center", lineHeight: 1.75, whiteSpace: "pre-line" }}>{cards[idx].back}</div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button style={btnStyle} onClick={() => goTo((idx - 1 + cards.length) % cards.length)}>← Předchozí</button>
        <button style={btnStyle} onClick={() => goTo((idx + 1) % cards.length)}>Další →</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════════════════════════ */
export default function App() {
  const [tab, setTab] = useState(0);
  const [theoryTab, setTheoryTab] = useState(0);

  const tabs = ["📖 Teorie", "🔢 Příklady", "🧠 Kvíz", "🃏 Kartičky", "📐 Vzorce"];

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a1a", fontFamily: "'Exo 2', sans-serif", color: "#fff", position: "relative", overflowX: "hidden" }}>

      {/* Synthwave background */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "55%", backgroundImage: "linear-gradient(rgba(6,182,212,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.12) 1px, transparent 1px)", backgroundSize: "55px 55px", transform: "perspective(350px) rotateX(60deg)", transformOrigin: "bottom" }} />
        <div style={{ position: "absolute", top: "12%", left: "50%", transform: "translateX(-50%)", width: "350px", height: "350px", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.25) 0%, rgba(6,182,212,0.08) 40%, transparent 70%)", filter: "blur(50px)", animation: "sunpulse 9s ease-in-out infinite" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(6,182,212,0.012) 2px, rgba(6,182,212,0.012) 4px)" }} />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@400;600;700&family=Audiowide&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes sunpulse { 0%,100%{opacity:.6;transform:translateX(-50%) scale(1)} 50%{opacity:1;transform:translateX(-50%) scale(1.12)} }
        * { box-sizing: border-box; }
        button:hover { opacity: 0.82; }
        input:focus { outline: 1px solid #06b6d4; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(6,182,212,0.3); border-radius: 3px; }
      `}</style>

      <div style={{ position: "relative", zIndex: 1, maxWidth: "920px", margin: "0 auto", padding: "24px 16px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontFamily: "'Audiowide', cursive", fontSize: "clamp(20px, 5vw, 34px)", fontWeight: 700, background: "linear-gradient(135deg, #06b6d4, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "8px" }}>
            BERNOULLIHO ROVNICE
          </div>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "14px" }}>Hydrodynamika • Rovnice kontinuity • Zákon zachování energie</div>
        </div>

        {/* Tab navigation */}
        <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap", marginBottom: "28px" }}>
          {tabs.map((t, i) => (
            <button key={i} onClick={() => setTab(i)} style={{ ...btnStyle, background: tab === i ? ACCENT + "33" : "rgba(255,255,255,0.05)", border: `1px solid ${tab === i ? ACCENT : "rgba(255,255,255,0.1)"}`, color: tab === i ? ACCENT : "rgba(255,255,255,0.65)", fontWeight: tab === i ? 600 : 400 }}>
              {t}
            </button>
          ))}
        </div>

        {/* ─── TEORIE ─── */}
        {tab === 0 && (
          <div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
              {theoryData.map((t, i) => (
                <button key={i} onClick={() => setTheoryTab(i)} style={{ ...btnStyle, padding: "8px 14px", fontSize: "13px", background: theoryTab === i ? ACCENT + "33" : "rgba(255,255,255,0.04)", border: `1px solid ${theoryTab === i ? ACCENT : "rgba(255,255,255,0.1)"}`, color: theoryTab === i ? ACCENT : "rgba(255,255,255,0.65)" }}>
                  {t.icon} {t.title}
                </button>
              ))}
            </div>
            <div style={{ ...glass, padding: "28px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                <span style={{ fontSize: "28px" }}>{theoryData[theoryTab].icon}</span>
                <div style={{ fontFamily: "'Audiowide', cursive", fontSize: "18px", color: ACCENT }}>{theoryData[theoryTab].title}</div>
              </div>
              {theoryData[theoryTab].content.map((c, i) => (
                <div key={i} style={{ marginBottom: "24px" }}>
                  <div style={{ color: ACCENT, fontWeight: 700, fontSize: "15px", marginBottom: "8px", paddingLeft: "12px", borderLeft: `3px solid ${ACCENT}` }}>{c.subtitle}</div>
                  <div style={{ color: "rgba(255,255,255,0.82)", fontSize: "15px", lineHeight: 1.78, whiteSpace: "pre-line" }}>{c.text}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── PŘÍKLADY ─── */}
        {tab === 1 && (
          <div>
            <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "13px", marginBottom: "20px", textAlign: "center" }}>
              Zadej výsledek a zkontroluj odpověď — pak klikni na „Zobrazit řešení" pro podrobný postup.
            </div>
            {problems.map((p, i) => <WorkedProblem key={i} prob={p} />)}
          </div>
        )}

        {/* ─── KVÍZ ─── */}
        {tab === 2 && (
          <QuizEngine questions={quizQuestions} accentColor={ACCENT} />
        )}

        {/* ─── KARTIČKY ─── */}
        {tab === 3 && (
          <FlashcardsPanel cards={flashcards} />
        )}

        {/* ─── VZORCE ─── */}
        {tab === 4 && (
          <div>
            {formulaGroups.map((g, gi) => (
              <div key={gi} style={{ ...glass, padding: "20px", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                  <span style={{ fontSize: "20px" }}>{g.icon}</span>
                  <div style={{ fontFamily: "'Audiowide', cursive", fontSize: "16px", color: ACCENT }}>{g.title}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {g.formulas.map((f, fi) => (
                    <div key={fi} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "12px", alignItems: "start", padding: "12px 14px", background: "rgba(255,255,255,0.03)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div>
                        <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "12px", marginBottom: "4px" }}>{f.name}</div>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "17px", color: "#a5f3fc", fontWeight: 500 }}>{f.formula}</div>
                        {f.note && <div style={{ color: "rgba(255,255,255,0.38)", fontSize: "12px", marginTop: "4px" }}>{f.note}</div>}
                      </div>
                      {f.unit && <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: ACCENT, whiteSpace: "nowrap", paddingTop: "16px" }}>{f.unit}</div>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
