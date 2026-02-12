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
