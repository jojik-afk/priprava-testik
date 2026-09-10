// @title Chemie – Názvosloví, HBP a GHS (příprava na test 2.A)
// @subject Chemistry
// @topic Anorganické názvosloví, bezpečnost práce a symboly GHS
// @template mixed

import { useState, useCallback, useMemo } from "react";

/* ═══════════════════════════════════════════════════════════════════
   QUIZ ENGINE (z assets/quiz-engine.jsx)
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
    const msg =
      pct >= 90 ? "Výborně! Názvosloví máš v malíčku!"
      : pct >= 70 ? "Dobré! Ještě pár koncovek a je to."
      : pct >= 50 ? "Slušný základ, ale chce to procvičit koncovky a předpony."
      : "Vrať se k teorii a taháku – a zkus to znovu!";
    return (
      <div style={S.resultsWrap}>
        <div style={S.resultsCard}>
          <div style={S.resultsScore}>{score} / {shuffledQuestions.length}</div>
          <div style={S.resultsPct}>{pct} %</div>
          <div style={S.resultsMsg}>{msg}</div>
          <button style={{ ...S.btn, background: accentColor + "66", border: `1px solid ${accentColor}` }} onClick={restart}>
            Začít znovu
          </button>
        </div>
      </div>
    );
  }

  const activeSet = isMulti ? (isRevealed ? myAnswer : pendingMulti) : myAnswer;

  return (
    <div style={S.wrap}>
      <div style={S.dotBar}>
        {shuffledQuestions.map((_, i) => {
          let bg = "#4b5563";
          if (i === idx) bg = accentColor;
          else if (revealed[i]) bg = arrEqual(answers[i] || [], shuffledQuestions[i].correct) ? "#22c55e" : "#ef4444";
          return <div key={i} onClick={() => goTo(i)} title={`Otázka ${i + 1}`} style={{ ...S.dot, background: bg }} />;
        })}
      </div>

      <div style={S.card}>
        <div style={S.qNum}>Otázka {idx + 1} / {shuffledQuestions.length}</div>
        <div style={S.qText} dangerouslySetInnerHTML={{ __html: q.question }} />

        <div style={S.optionsList}>
          {q.options.map((opt, i) => {
            let border = "1px solid rgba(255,255,255,0.12)";
            let bg = "rgba(255,255,255,0.04)";
            if (isRevealed) {
              if (q.correct.includes(i))      { bg = "rgba(34,197,94,0.15)"; border = "1px solid #22c55e"; }
              else if (activeSet.includes(i)) { bg = "rgba(239,68,68,0.15)"; border = "1px solid #ef4444"; }
            } else if (activeSet.includes(i)) {
              bg = accentColor + "18"; border = `1px solid ${accentColor}`;
            }
            return (
              <div key={i} style={{ ...S.option, background: bg, border }} onClick={() => isMulti ? toggleMulti(i) : handleSingleSelect(i)}>
                {isMulti && <span style={S.checkbox}>{activeSet.includes(i) ? "☑" : "☐"}</span>}
                <span dangerouslySetInnerHTML={{ __html: opt }} />
              </div>
            );
          })}
        </div>

        {isMulti && !isRevealed && (
          <button style={{ ...S.btn, opacity: pendingMulti.length === 0 ? 0.4 : 1 }} onClick={submitMulti} disabled={pendingMulti.length === 0}>
            Potvrdit
          </button>
        )}

        {isRevealed && (
          <div style={{ ...S.feedback, borderColor: isCorrect ? "#22c55e" : "#ef4444" }}>
            <div style={S.feedbackHeader}>{isCorrect ? "Správně!" : "Špatně"}</div>
            {!isCorrect && (
              <div style={S.feedbackCorrect} dangerouslySetInnerHTML={{ __html: "Správná odpověď: " + q.correct.map(i => q.options[i]).join(", ") }} />
            )}
            <div style={S.feedbackExplanation} dangerouslySetInnerHTML={{ __html: q.explanation }} />
            {q.tip && <div style={S.feedbackTip}>Tip: {q.tip}</div>}
          </div>
        )}
      </div>

      <div style={S.navRow}>
        <button style={S.btn} onClick={() => goTo(idx - 1)} disabled={idx === 0}>← Předchozí</button>
        {idx < shuffledQuestions.length - 1
          ? <button style={S.btn} onClick={() => goTo(idx + 1)}>Další →</button>
          : <button style={{ ...S.btn, background: accentColor + "55", border: `1px solid ${accentColor}` }} onClick={() => setShowResults(true)}>Výsledky →</button>}
      </div>
    </div>
  );
}

const S = {
  wrap:            { display: "flex", flexDirection: "column", gap: "16px", maxWidth: "680px", margin: "0 auto", padding: "16px" },
  dotBar:          { display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" },
  dot:             { width: "22px", height: "22px", borderRadius: "50%", cursor: "pointer", transition: "background 0.4s ease" },
  card:            { background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "24px", transition: "all 0.4s ease" },
  qNum:            { color: "rgba(255,255,255,0.35)", fontSize: "13px", marginBottom: "6px" },
  qText:           { color: "#fff", fontSize: "18px", fontWeight: 600, lineHeight: 1.5, marginBottom: "20px" },
  optionsList:     { display: "flex", flexDirection: "column", gap: "10px" },
  option:          { padding: "12px 16px", borderRadius: "12px", color: "#fff", cursor: "pointer", transition: "all 0.4s ease", display: "flex", alignItems: "center", gap: "10px", userSelect: "none", fontSize: "15px" },
  checkbox:        { fontSize: "18px", minWidth: "20px", color: "rgba(255,255,255,0.7)" },
  btn:             { marginTop: "12px", padding: "10px 22px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", color: "#fff", cursor: "pointer", fontSize: "15px", transition: "all 0.4s ease" },
  feedback:        { marginTop: "20px", padding: "16px", borderRadius: "14px", border: "1px solid", background: "rgba(255,255,255,0.03)" },
  feedbackHeader:  { color: "#fff", fontWeight: 700, fontSize: "16px", marginBottom: "8px" },
  feedbackCorrect: { color: "#86efac", fontSize: "14px", marginBottom: "6px" },
  feedbackExplanation: { color: "rgba(255,255,255,0.7)", fontSize: "14px", lineHeight: 1.5 },
  feedbackTip:     { color: "#fbbf24", fontSize: "13px", marginTop: "8px", fontStyle: "italic" },
  navRow:          { display: "flex", justifyContent: "space-between" },
  resultsWrap:     { display: "flex", alignItems: "center", justifyContent: "center", minHeight: "280px" },
  resultsCard:     { textAlign: "center", background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "24px", padding: "40px 48px" },
  resultsScore:    { color: "#fff", fontSize: "52px", fontWeight: 800, lineHeight: 1.1 },
  resultsPct:      { color: "rgba(255,255,255,0.45)", fontSize: "22px", marginBottom: "16px" },
  resultsMsg:      { color: "rgba(255,255,255,0.8)", fontSize: "17px", lineHeight: 1.5, marginBottom: "24px", maxWidth: "340px", margin: "0 auto 24px" },
};

/* ═══════════════════════════════════════════════════════════════════
   FORMÁTOVÁNÍ VZORCŮ – dolní/horní indexy
   ═══════════════════════════════════════════════════════════════════ */
// Převede zápis typu "H2SO4" a "Al3+" na HTML s <sub>/<sup>.
function fmt(formula) {
  // náboje na konci: 3+, 2-, +, -
  let s = formula.replace(/([A-Za-z\)\]])(\d*)([+-])(?=$|\s)/g, (m, a, n, sign) =>
    `${a}<sup>${n}${sign}</sup>`);
  // ".18H2O" hydrátová tečka
  s = s.replace(/\.(\d+)/g, ' · $1');
  // číslice mezi/po písmenech a závorkách → dolní index
  s = s.replace(/(?<=[A-Za-z\)\]])(\d+)/g, "<sub>$1</sub>");
  return s;
}

const ACCENT = "#22d3ee";
const ACCENT2 = "#818cf8";

/* ═══════════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════════ */

// --- Koncovky podle oxidačního čísla ---
const KONCOVKY = [
  { ox: "I",    kat: "-ný",     kys: "-ná",     anion: "-nan",     pr: "chlorný / HClO / chlornan" },
  { ox: "II",   kat: "-natý",   kys: "-natá",   anion: "-natan",   pr: "vápenatý / – / –" },
  { ox: "III",  kat: "-itý",    kys: "-itá",    anion: "-itan",    pr: "hlinitý / HBO₂ / boritan" },
  { ox: "IV",   kat: "-ičitý",  kys: "-ičitá",  anion: "-ičitan",  pr: "siřičitý / H₂SO₃ / siřičitan" },
  { ox: "V",    kat: "-ičný / -ečný", kys: "-ičná / -ečná", anion: "-ičnan / -ečnan", pr: "dusičný / HNO₃ / dusičnan" },
  { ox: "VI",   kat: "-ový",    kys: "-ová",    anion: "-an",      pr: "sírový / H₂SO₄ / síran" },
  { ox: "VII",  kat: "-istý",   kys: "-istá",   anion: "-istan",   pr: "chloristý / HClO₄ / chloristan" },
  { ox: "VIII", kat: "-ičelý",  kys: "-ičelá",  anion: "-ičelan",  pr: "osmičelý / – / –" },
];

// --- Řecké číslovkové předpony ---
const PREDPONY = [
  ["mono", "1"], ["di", "2"], ["tri", "3"], ["tetra", "4"], ["penta", "5"],
  ["hexa", "6"], ["hepta", "7"], ["okta", "8"], ["nona", "9"], ["deka", "10"],
];

// --- Řešené příklady (ze zadání PL) ---
const PRIKLADY = [
  {
    dif: "easy", zadani: "AgCl", smer: "vzorec → název",
    given: "Dvouprvková sloučenina Ag a Cl. Ag je stříbro (obvykle I), Cl je chlor.",
    postup: [
      "Chlor v halogenidu má oxidační číslo −I → koncovka pro anion je <b>chlorid</b>.",
      "Ag musí náboj vyrovnat: Ag<sup>+I</sup>, jeden atom → oxidační číslo I → koncovka <b>-ný</b>.",
      "Sestavíme: chlorid stříbrný.",
    ],
    result: "chlorid stříbrný",
  },
  {
    dif: "easy", zadani: "hydroxid chromitý", smer: "název → vzorec",
    given: "Hydroxid = anion OH⁻ (oxidační číslo skupiny −I). Chromitý = Cr s oxidačním číslem III.",
    postup: [
      "Cr má náboj +III, hydroxidová skupina OH má −I.",
      "Křížové pravidlo: potřebujeme 3× OH na 1× Cr, aby se náboje vyrovnaly (3 · (−1) + 3 = 0).",
      "Skupinu OH dáme do závorky s indexem 3.",
    ],
    result: "Cr(OH)3",
  },
  {
    dif: "medium", zadani: "H2SO5", smer: "vzorec → název",
    given: "Kyselina se sírou. Běžná kyselina sírová je H₂SO₄ – zde je ale jeden kyslík navíc.",
    postup: [
      "Spočítáme oxidační číslo síry, kdyby šlo o běžnou kyselinu: H₂SO₄ → S má VI.",
      "H₂SO₅ má o jeden O navíc, ale síra zůstává VI → jde o <b>peroxokyselinu</b> (obsahuje skupinu −O−O−).",
      "Předpona <b>peroxo-</b> označuje náhradu jednoho O za peroxoskupinu O₂.",
    ],
    result: "kyselina peroxosírová",
  },
  {
    dif: "medium", zadani: "Na2S2O3", smer: "vzorec → název",
    given: "Sodná sůl. Srovnej se síranem Na₂SO₄ a disíranem – zde je S₂O₃.",
    postup: [
      "Vyjdeme ze síranu SO₄²⁻ (síra VI).",
      "V thiosíranu je jeden atom kyslíku nahrazen sírou: SO₄ → S<b>S</b>O₃, tedy S₂O₃²⁻.",
      "Předpona <b>thio-</b> = náhrada O za S. Kationt Na⁺, proto Na₂.",
    ],
    result: "thiosíran sodný",
  },
  {
    dif: "medium", zadani: "hydrogensiřičitan berylnatý", smer: "název → vzorec",
    given: "Kyselá sůl (hydrogen-). Siřičitan = SO₃²⁻ (síra IV). Berylnatý = Be s II.",
    postup: [
      "Hydrogensiřičitan vznikne odtržením jen jednoho H z H₂SO₃ → zbývá HSO₃⁻ (náboj −I).",
      "Be má +II, potřebujeme tedy 2× HSO₃⁻.",
      "Skupinu (HSO₃) dáme do závorky s indexem 2.",
    ],
    result: "Be(HSO3)2",
  },
  {
    dif: "medium", zadani: "Ba(HS)2", smer: "vzorec → název",
    given: "Baryum (II) a skupina HS. HS je hydrogensulfidový anion.",
    postup: [
      "S²⁻ je sulfid; po přidání jednoho H vznikne HS⁻ → <b>hydrogensulfid</b>.",
      "Ba má +II, proto jsou dvě skupiny HS⁻ → Ba(HS)₂.",
      "Kationt barnatý (II) → koncovka -natý.",
    ],
    result: "hydrogensulfid barnatý",
  },
  {
    dif: "medium", zadani: "difosforečnan zinečnatý", smer: "název → vzorec",
    given: "Difosforečnan = dvojjaderný anion P₂O₇⁴⁻. Zinečnatý = Zn s II.",
    postup: [
      "Fosforečnan je PO₄³⁻. Předpona <b>di-</b> = spojení dvou jednotek s odštěpením O: 2 PO₄ − O = P₂O₇, náboj −IV.",
      "Zn má +II. Křížově: 2 · (+2) = +4 vyrovná náboj jednoho P₂O₇⁴⁻.",
      "Dva atomy Zn na jednu skupinu P₂O₇.",
    ],
    result: "Zn2P2O7",
  },
  {
    dif: "hard", zadani: "H4I2O9", smer: "vzorec → název",
    given: "Kyselina se dvěma atomy jodu (I₂) a devíti kyslíky – dvojjaderná (kondenzovaná) kyselina.",
    postup: [
      "Náboj: 4·(+1) + 2·x + 9·(−2) = 0 → 4 + 2x − 18 = 0 → x = +VII. Jod má tedy VII → koncovka <b>-istá</b> (jodistá).",
      "Dva atomy jodu → předpona <b>di-</b> (di-jodistá).",
      "Čtyři vodíky → <b>tetrahydrogen-</b>.",
    ],
    result: "kyselina tetrahydrogendijodistá",
  },
  {
    dif: "hard", zadani: "kyselina dekahydrogentitaničitá", smer: "název → vzorec",
    given: "Titaničitá = Ti s oxidačním číslem IV. Deka-hydrogen = 10 atomů vodíku.",
    postup: [
      "Zapíšeme H₁₀Ti_xO_y. Titan má IV, vodík +I, kyslík −II.",
      "Předpona pro Ti není uvedena → jeden atom Ti (x = 1).",
      "Náboj: 10·(+1) + 1·(+4) + y·(−2) = 0 → 14 = 2y → y = 7.",
    ],
    result: "H10TiO7",
  },
  {
    dif: "hard", zadani: "trithiomolybdenan rutheničelý", smer: "název → vzorec",
    given: "Molybdenan = MoO₄²⁻. Trithio = 3 O nahrazeny S. Rutheničelý = Ru s VIII.",
    postup: [
      "Molybdenan MoO₄²⁻ → trithiomolybdenan: 3 kyslíky za síru → MoOS₃²⁻.",
      "Ru je rutheničelý → oxidační číslo <b>VIII</b> (koncovka -ičelý).",
      "Křížově: Ru⁺⁸ potřebuje 4× MoOS₃²⁻ (4 · (−2) = −8).",
    ],
    result: "Ru(MoOS3)4",
  },
  {
    dif: "hard", zadani: "Cu2SeO2S2", smer: "vzorec → název",
    given: "Měď (Cu₂ → Cu⁺, měďný) a anion SeO₂S₂. Vyjdi ze selenanu SeO₄²⁻.",
    postup: [
      "Selenan je SeO₄²⁻ (Se má VI).",
      "V SeO₂S₂ jsou dva kyslíky nahrazeny sírou → předpona <b>dithio-</b> (dithioselenan).",
      "Dva atomy Cu → Cu⁺ (měďný, I). Náboj sedí: 2·(+1) + (−2) = 0.",
    ],
    result: "dithioselenan měďný",
  },
  {
    dif: "hard", zadani: "bis(uhličitan) vápenato-hořečnatý", smer: "vzorec → název",
    given: "Podvojná sůl CaMg(CO₃)₂ – obsahuje dva různé kationty (Ca²⁺ a Mg²⁺).",
    postup: [
      "Anion je uhličitan CO₃²⁻, ve vzorci jsou dva → násobící předpona <b>bis(…)</b> se používá, aby nedošlo k záměně s „di“ v názvu aniontu.",
      "Dva různé kovové kationty se spojí spojovníkem: <b>vápenato-hořečnatý</b>.",
      "Náboje: Ca²⁺ + Mg²⁺ + 2·CO₃²⁻ = 0.",
    ],
    result: "bis(uhličitan) vápenato-hořečnatý",
  },
  {
    dif: "medium", zadani: "Al2(SO4)3.18H2O", smer: "vzorec → název",
    given: "Krystalická sůl s vodou (hydrát). Základ je síran hlinitý Al₂(SO₄)₃, k němu 18 molekul vody.",
    postup: [
      "Al₂(SO₄)₃ = síran hlinitý (Al má III, síran SO₄²⁻).",
      "„.18H₂O“ = 18 molekul krystalové vody → předpona <b>oktadeka-</b> (18) + slovo <b>hydrát</b>.",
      "Název hydrátu je v 2. pádě: oktadekahydrát <i>síranu hlinitého</i>.",
    ],
    result: "oktadekahydrát síranu hlinitého",
  },
  {
    dif: "easy", zadani: "ClO3⁻ a Al³⁺", smer: "ionty",
    given: "Samostatné ionty – urči náboj a název.",
    postup: [
      "ClO₃⁻: náboj −1, chlor má V (V·1 + 3·(−2) = −1) → koncovka -ečný/-ičnan → <b>anion chlorečnanový</b>.",
      "Al³⁺: náboj +3, hliník má III → <b>kation hlinitý</b>.",
      "U iontů uvádíme slovo „anion / kation“ + přídavné jméno.",
    ],
    result: "anion chlorečnanový; kation hlinitý",
  },
];

// --- Flashcards (kompletní sada z PL) ---
const FLASHCARDS = [
  { f: "H6TeO6", n: "kyselina hexahydrogentelurová" },
  { f: "Al2(SO4)3.18H2O", n: "oktadekahydrát síranu hlinitého" },
  { f: "CaMg(CO3)2", n: "bis(uhličitan) vápenato-hořečnatý" },
  { f: "H2SO5", n: "kyselina peroxosírová" },
  { f: "H4I2O9", n: "kyselina tetrahydrogendijodistá" },
  { f: "Be(HSO3)2", n: "hydrogensiřičitan berylnatý" },
  { f: "PH3", n: "fosfan" },
  { f: "ClO3-", n: "anion chlorečnanový" },
  { f: "Al3+", n: "kation hlinitý" },
  { f: "Ba(HS)2", n: "hydrogensulfid barnatý" },
  { f: "Na2S2O3", n: "thiosíran sodný" },
  { f: "AgCl", n: "chlorid stříbrný" },
  { f: "NH4NO2", n: "dusitan amonný" },
  { f: "KCN", n: "kyanid draselný" },
  { f: "KH", n: "hydrid draselný" },
  { f: "H2Se", n: "selan" },
  { f: "Pb(NO3)2", n: "dusičnan olovnatý" },
  { f: "(NH4)2Cr2O7", n: "dichroman amonný" },
  { f: "Rb2S2O5", n: "disiřičitan rubidný" },
  { f: "Cs2S2O7", n: "disíran cesný" },
  { f: "H2O2", n: "peroxid vodíku" },
  { f: "Ag2O2", n: "peroxid stříbrný" },
  { f: "NH3", n: "amoniak (azan)" },
  { f: "H2S", n: "sulfan" },
  { f: "K2MnO4", n: "manganan draselný" },
  { f: "KMnO4", n: "manganistan draselný" },
  { f: "Ca3(PO4)2", n: "tetraoxofosforečnan (fosforečnan) vápenatý" },
  { f: "Au2(HPO4)3", n: "hydrogenfosforečnan zlatitý" },
  { f: "Ni(H2PO4)2", n: "dihydrogenfosforečnan nikelnatý" },
  { f: "Zn(VO3)2", n: "vanadičnan zinečnatý" },
  { f: "Zn2P2O7", n: "difosforečnan zinečnatý" },
  { f: "Cu2SeO2S2", n: "dithioselenan měďný" },
  { f: "CdCS3", n: "trithiouhličitan kademnatý" },
  { f: "H10TiO7", n: "kyselina dekahydrogentitaničitá" },
  { f: "HgF2", n: "fluorid rtuťnatý" },
  { f: "Cr(OH)3", n: "hydroxid chromitý" },
  { f: "FeCl3", n: "chlorid železitý" },
  { f: "Ru(MoOS3)4", n: "trithiomolybdenan rutheničelý" },
  { f: "Sr3(AsO3)2", n: "trioxoarsenitan strontnatý" },
  { f: "BiSbO4", n: "tetraoxoantimoničnan bismutitý" },
];

// --- GHS piktogramy ---
const GHS = [
  { kod: "GHS01", em: "💥", nazev: "Výbušné látky", popis: "Nestabilní výbušniny, samovolně reagující látky. Příklad: TNT, dusičnany." },
  { kod: "GHS02", em: "🔥", nazev: "Hořlavé látky", popis: "Hořlavé plyny, kapaliny, pevné látky, samozápalné. Příklad: benzín, ethanol, aceton." },
  { kod: "GHS03", em: "🔥⭕", nazev: "Oxidující látky", popis: "Podporují hoření, mohou způsobit požár i bez vzduchu. Příklad: peroxid vodíku, dusičnany, KMnO₄." },
  { kod: "GHS04", em: "🫙", nazev: "Plyny pod tlakem", popis: "Stlačené, zkapalněné nebo rozpuštěné plyny; lahev může explodovat teplem. Příklad: propan-butan." },
  { kod: "GHS05", em: "🧪", nazev: "Žíravé (korozivní) látky", popis: "Poleptání kůže/očí, korozní pro kovy. Příklad: NaOH, koncentrovaná H₂SO₄, HCl." },
  { kod: "GHS06", em: "☠️", nazev: "Toxické látky", popis: "Akutní toxicita, i malé množství může usmrtit. Příklad: kyanidy, methanol, arsen." },
  { kod: "GHS07", em: "❗", nazev: "Dráždivé / zdraví škodlivé", popis: "Podráždění kůže, očí, dýchacích cest; méně závažná akutní toxicita." },
  { kod: "GHS08", em: "🫁", nazev: "Nebezpečné pro zdraví", popis: "Karcinogenní, mutagenní, toxické pro reprodukci (CMR), poškození orgánů. Příklad: benzen, formaldehyd." },
  { kod: "GHS09", em: "🐟", nazev: "Nebezpečné pro životní prostředí", popis: "Toxické pro vodní organismy. Příklad: soli těžkých kovů, ropné látky." },
];

// --- HBP: hlavní bezpečnostní pravidla v laboratoři ---
const HBP = [
  { i: "🚫🍎", t: "V laboratoři se nejí, nepije a nekouří.", d: "Chemikálie se mohou dostat do úst; jídlo a pití nikdy neodkládej na pracovní stůl." },
  { i: "🥽", t: "Používej ochranné pomůcky (OOPP).", d: "Plášť, ochranné brýle a rukavice podle druhu práce. Dlouhé vlasy sepni." },
  { i: "💧➡️🧪", t: "Kyselinu vždy lij do vody, nikdy vodu do kyseliny!", d: "Ředění je silně exotermické – opačný postup může způsobit vystříknutí a poleptání. Pomůcka: „Kdo umí, ten to lije do vody.“" },
  { i: "👋👃", t: "Čichej pouze mávnutím ruky k nosu.", d: "Nikdy nedávej nos přímo nad nádobu – páry mohou být jedovaté nebo dráždivé." },
  { i: "🚱", t: "Nepipetuj ústy a nic neochutnávej.", d: "K nasávání kapalin používej balónek nebo pipetovací nástavec." },
  { i: "🔥", t: "Pozor na otevřený oheň a horké předměty.", d: "V blízkosti hořlavin nepracuj s kahanem; zahřáté sklo vypadá stejně jako studené." },
  { i: "🧯", t: "Znej umístění bezpečnostních prvků.", d: "Lékárnička, hasicí přístroj, bezpečnostní sprcha, vypínač plynu a hlavní uzávěr vody." },
  { i: "🧤🧼", t: "Po skončení práce ukliď a umyj si ruce.", d: "Chemikálie vracej uzavřené na místo; odpad likviduj podle pokynů, ne do dřezu." },
  { i: "🗣️", t: "Každý úraz, rozlití či rozbití ihned nahlas.", d: "I drobnou nehodu oznam vyučujícímu – nikdy neřeš problém potají." },
  { i: "📋", t: "Pracuj jen podle zadání a pokynů.", d: "Nemíchej látky náhodně a nedělej „vlastní pokusy“ – neznámé reakce mohou být nebezpečné." },
];

// --- Kvízové otázky ---
const QUESTIONS = [
  { question: "Jak se nazývá <b>AgCl</b>?", type: "single",
    options: ["chlorid stříbrný", "chlornan stříbrný", "chlorid stříbrnatý", "chlorečnan stříbrný"],
    correct: [0], explanation: "Chlor v halogenidu má −I → „chlorid“. Ag má I → koncovka -ný.", tip: "Halogenidy vždy končí na -id." },
  { question: "Napiš vzorec pro <b>hydroxid chromitý</b>.", type: "single",
    options: ["Cr(OH)₃", "Cr(OH)₂", "CrOH", "Cr₂(OH)₃"],
    correct: [0], explanation: "Cr³⁺ + 3× OH⁻ → Cr(OH)₃. Náboje: +3 a 3·(−1) = 0.", tip: "Chromitý = III → tři hydroxidové skupiny." },
  { question: "Kolik znamená předpona <b>okta-</b>?", type: "single",
    options: ["8", "6", "10", "18"],
    correct: [0], explanation: "okta = 8. Pozor: oktadeka = 18 (okta + deka).", tip: "okta jako „oktáva“ = 8 tónů." },
  { question: "Co znamená předpona <b>thio-</b> v názvu aniontu?", type: "single",
    options: ["atom kyslíku nahrazen sírou", "přidání vody", "přidání vodíku", "atom síry nahrazen kyslíkem"],
    correct: [0], explanation: "thio- = náhrada O za S. Např. síran SO₄²⁻ → thiosíran S₂O₃²⁻ (jeden O nahrazen S).", tip: "Řecké „theion“ = síra." },
  { question: "Jaké oxidační číslo má síra v kyselině <b>H₂SO₅</b> (peroxosírová)?", type: "single",
    options: ["VI", "VII", "IV", "VIII"],
    correct: [0], explanation: "Peroxoskupina −O−O− nese jiný náboj; síra zůstává VI jako v H₂SO₄. Navíc je jen předpona peroxo-.", tip: "Peroxo = O navíc, ne změna oxidačního čísla centrálního atomu." },
  { question: "Vyber vzorce, kde má centrální atom oxidační číslo <b>VII</b>.", type: "multi",
    options: ["KMnO₄", "H₄I₂O₉", "K₂MnO₄", "HNO₃"],
    correct: [0, 1], explanation: "KMnO₄: Mn má VII (manganistan). H₄I₂O₉: jod má VII (jodistá). K₂MnO₄: Mn má VI (manganan). HNO₃: N má V.", tip: "Koncovka -istý/-istan = oxidační číslo VII." },
  { question: "Který název patří k <b>NH₄NO₂</b>?", type: "single",
    options: ["dusitan amonný", "dusičnan amonný", "dusitan amoniový", "nitrid amonný"],
    correct: [0], explanation: "NO₂⁻ je dusitan (N má III), kationt NH₄⁺ je amonný.", tip: "dusitan = NO₂⁻ (III), dusičnan = NO₃⁻ (V)." },
  { question: "Co označuje předpona <b>hydrogen-</b> v názvu soli (např. hydrogensiřičitan)?", type: "single",
    options: ["v aniontu zůstal jeden odtržitelný vodík (kyselá sůl)", "sůl obsahuje krystalovou vodu", "jde o hydroxid", "atom kyslíku byl nahrazen vodíkem"],
    correct: [0], explanation: "Kyselá sůl vznikne odtržením jen části vodíků kyseliny. H₂SO₃ → HSO₃⁻ = hydrogensiřičitan.", tip: "dihydrogen- = zůstaly dva H (např. H₂PO₄⁻)." },
  { question: "Napiš vzorec pro <b>chlorid železitý</b>.", type: "single",
    options: ["FeCl₃", "FeCl₂", "Fe₂Cl₃", "FeCl"],
    correct: [0], explanation: "Železitý = Fe³⁺, chlorid = Cl⁻ → FeCl₃.", tip: "-itý = oxidační číslo III." },
  { question: "Co znamená zápis <b>·18H₂O</b> na konci vzorce (Al₂(SO₄)₃·18H₂O)?", type: "single",
    options: ["18 molekul krystalové vody → oktadekahydrát", "18 atomů vodíku", "18 % vody", "reakce s vodou"],
    correct: [0], explanation: "Tečka odděluje krystalovou vodu; 18 molekul → předpona oktadeka- + slovo hydrát.", tip: "Počet molekul vody = číslovková předpona před „hydrát“." },
  { question: "Ke kterému oxidačnímu číslu patří přídavné jméno kationtu <b>-ičitý</b>?", type: "single",
    options: ["IV", "III", "V", "VI"],
    correct: [0], explanation: "Řada koncovek: -ný (I), -natý (II), -itý (III), -ičitý (IV), -ičný/-ečný (V), -ový (VI), -istý (VII), -ičelý (VIII).", tip: "Nauč se řadu koncovek nazpaměť – je základ celého názvosloví." },
  { question: "Vyber látky, které jsou <b>vodíkové sloučeniny</b> s vlastním (triviálním) názvem.", type: "multi",
    options: ["PH₃ (fosfan)", "H₂S (sulfan)", "NH₃ (amoniak)", "AgCl (chlorid stříbrný)"],
    correct: [0, 1, 2], explanation: "Fosfan, sulfan i amoniak jsou hydridy nekovů s ustáleným názvem. AgCl je halogenid.", tip: "Koncovka -an u hydridů: fosfan, sulfan, selan, silan…" },
  { question: "Kterou bezpečnostní zásadu dodržíš při <b>ředění koncentrované kyseliny</b>?", type: "single",
    options: ["kyselinu lij pomalu do vody", "vodu lij do kyseliny", "smíchej obojí najednou", "zahřej kyselinu před ředěním"],
    correct: [0], explanation: "Ředění je silně exotermické. Kyselina do vody – opačně hrozí vystříknutí a poleptání.", tip: "„Kdo umí, ten to lije do vody.“" },
  { question: "Který <b>GHS piktogram</b> označuje žíravé (korozivní) látky jako NaOH nebo koncentrovaná H₂SO₄?", type: "single",
    options: ["GHS05 – žíravost (poleptání ruky/kovu)", "GHS02 – plamen (hořlavé)", "GHS06 – lebka (toxické)", "GHS09 – ryba a strom (životní prostředí)"],
    correct: [0], explanation: "GHS05 zobrazuje poleptání ruky a kovu. NaOH i koncentrovaná H₂SO₄ jsou silně žíravé.", tip: "Lebka (GHS06) = akutní jed; vykřičník (GHS07) = dráždivé." },
  { question: "Co správně charakterizuje piktogram s <b>lebkou a zkříženými hnáty (GHS06)</b>?", type: "single",
    options: ["akutně toxická látka, i malé množství může usmrtit", "pouze dráždí kůži", "látka nebezpečná pro vodní organismy", "hořlavá kapalina"],
    correct: [0], explanation: "GHS06 = akutní toxicita (např. kyanidy, methanol). Mírnější dráždivost značí GHS07 (vykřičník).", tip: "Lebka = smrtelně jedovaté, vykřičník = „jen“ škodlivé/dráždivé." },
  { question: "Jak se jmenuje anion <b>ClO₃⁻</b>?", type: "single",
    options: ["chlorečnanový", "chlornanový", "chloristanový", "chloridový"],
    correct: [0], explanation: "Cl v ClO₃⁻ má V → chlorečnan. (I = chlornan ClO⁻, VII = chloristan ClO₄⁻, −I = chlorid Cl⁻.)", tip: "Kyslíkaté anionty chloru: chlornan(I) → chloritan(III) → chlorečnan(V) → chloristan(VII)." },
];

/* ═══════════════════════════════════════════════════════════════════
   POMOCNÉ KOMPONENTY
   ═══════════════════════════════════════════════════════════════════ */
function F({ children }) {
  return <span dangerouslySetInnerHTML={{ __html: fmt(children) }} />;
}

function Collapsible({ title, badge, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", marginBottom: "14px", overflow: "hidden", transition: "all 0.4s ease" }}>
      <div onClick={() => setOpen(o => !o)} style={{ padding: "16px 20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", userSelect: "none" }}>
        <span style={{ color: "#fff", fontWeight: 600, fontSize: "16px" }}>{title}</span>
        <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {badge}
          <span style={{ color: ACCENT, fontSize: "20px", transform: open ? "rotate(90deg)" : "none", transition: "transform 0.4s ease" }}>›</span>
        </span>
      </div>
      {open && <div style={{ padding: "0 20px 20px", color: "rgba(255,255,255,0.8)", fontSize: "15px", lineHeight: 1.65 }}>{children}</div>}
    </div>
  );
}

const DIF = {
  easy:   { label: "Lehké ✨",  color: "#22c55e" },
  medium: { label: "Střední ⚡", color: "#fbbf24" },
  hard:   { label: "Těžké 🔥",  color: "#f87171" },
};

function PrikladCard({ p, index }) {
  const [open, setOpen] = useState(false);
  const d = DIF[p.dif];
  return (
    <div style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "18px 20px", marginBottom: "14px", transition: "all 0.4s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", flexWrap: "wrap" }}>
        <div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", marginBottom: "4px" }}>Příklad {index + 1} · {p.smer}</div>
          <div style={{ color: "#fff", fontSize: "20px", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}><F>{p.zadani}</F></div>
        </div>
        <span style={{ fontSize: "12px", fontWeight: 700, color: d.color, border: `1px solid ${d.color}`, borderRadius: "20px", padding: "3px 12px", whiteSpace: "nowrap" }}>{d.label}</span>
      </div>
      <button onClick={() => setOpen(o => !o)} style={{ ...S.btn, marginTop: "14px" }}>
        {open ? "Skrýt řešení" : "Zobrazit řešení"}
      </button>
      {open && (
        <div style={{ marginTop: "16px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "16px" }}>
          <div style={{ marginBottom: "12px" }}>
            <div style={{ color: ACCENT, fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>Zadání / rozbor</div>
            <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: p.given }} />
          </div>
          <div style={{ marginBottom: "12px" }}>
            <div style={{ color: ACCENT, fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>Postup</div>
            <ol style={{ margin: 0, paddingLeft: "20px", color: "rgba(255,255,255,0.8)", fontSize: "14px", lineHeight: 1.7 }}>
              {p.postup.map((s, i) => <li key={i} style={{ marginBottom: "6px" }} dangerouslySetInnerHTML={{ __html: s }} />)}
            </ol>
          </div>
          <div style={{ background: "rgba(34,197,94,0.12)", border: "1px solid #22c55e", borderRadius: "12px", padding: "12px 16px" }}>
            <span style={{ color: "#86efac", fontSize: "13px", fontWeight: 700 }}>Výsledek: </span>
            <span style={{ color: "#fff", fontSize: "16px", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}><F>{p.result}</F></span>
          </div>
        </div>
      )}
    </div>
  );
}

function Flashcards() {
  const [order, setOrder] = useState(() => FLASHCARDS.map((_, i) => i));
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [dir, setDir] = useState("f2n"); // f2n = vzorec vpředu; n2f = název vpředu

  const card = FLASHCARDS[order[pos]];
  const go = (delta) => { setFlipped(false); setPos(p => (p + delta + order.length) % order.length); };
  const shuffle = () => { setFlipped(false); setPos(0); setOrder(shuffleArray(FLASHCARDS.map((_, i) => i))); };

  const front = dir === "f2n" ? <F>{card.f}</F> : card.n;
  const back  = dir === "f2n" ? card.n : <F>{card.f}</F>;

  return (
    <div style={{ maxWidth: "560px", margin: "0 auto" }}>
      <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "18px", flexWrap: "wrap" }}>
        <button style={{ ...S.btn, marginTop: 0, background: dir === "f2n" ? ACCENT + "44" : "rgba(255,255,255,0.07)", border: dir === "f2n" ? `1px solid ${ACCENT}` : "1px solid rgba(255,255,255,0.15)" }} onClick={() => { setDir("f2n"); setFlipped(false); }}>Vzorec → název</button>
        <button style={{ ...S.btn, marginTop: 0, background: dir === "n2f" ? ACCENT + "44" : "rgba(255,255,255,0.07)", border: dir === "n2f" ? `1px solid ${ACCENT}` : "1px solid rgba(255,255,255,0.15)" }} onClick={() => { setDir("n2f"); setFlipped(false); }}>Název → vzorec</button>
        <button style={{ ...S.btn, marginTop: 0 }} onClick={shuffle}>🔀 Zamíchat</button>
      </div>

      <div onClick={() => setFlipped(f => !f)} style={{ perspective: "1200px", cursor: "pointer", height: "220px" }}>
        <div style={{ position: "relative", width: "100%", height: "100%", transition: "transform 0.4s ease", transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "none" }}>
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", border: `1px solid ${ACCENT}55`, borderRadius: "20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", textAlign: "center" }}>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", marginBottom: "14px", textTransform: "uppercase", letterSpacing: "1px" }}>{dir === "f2n" ? "Vzorec" : "Název"}</div>
            <div style={{ color: "#fff", fontSize: "30px", fontWeight: 700, fontFamily: dir === "f2n" ? "'JetBrains Mono', monospace" : "inherit" }}>{front}</div>
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", marginTop: "18px" }}>Klikni pro otočení</div>
          </div>
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "rgba(129,140,248,0.12)", backdropFilter: "blur(20px)", border: `1px solid ${ACCENT2}`, borderRadius: "20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", textAlign: "center" }}>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", marginBottom: "14px", textTransform: "uppercase", letterSpacing: "1px" }}>{dir === "f2n" ? "Název" : "Vzorec"}</div>
            <div style={{ color: "#fff", fontSize: "26px", fontWeight: 700, fontFamily: dir === "n2f" ? "'JetBrains Mono', monospace" : "inherit" }}>{back}</div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "18px" }}>
        <button style={{ ...S.btn, marginTop: 0 }} onClick={() => go(-1)}>← Předchozí</button>
        <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>{pos + 1} / {order.length}</span>
        <button style={{ ...S.btn, marginTop: 0 }} onClick={() => go(1)}>Další →</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   HLAVNÍ APLIKACE
   ═══════════════════════════════════════════════════════════════════ */
const TABS = [
  { id: "teorie",   label: "📖 Teorie" },
  { id: "priklady", label: "🧮 Řešené příklady" },
  { id: "bezpecnost", label: "⚠️ Bezpečnost (HBP + GHS)" },
  { id: "kviz",     label: "❓ Kvíz" },
  { id: "karticky", label: "🃏 Kartičky" },
  { id: "tahak",    label: "📋 Tahák" },
];

export default function App() {
  const [tab, setTab] = useState("teorie");

  const th = { color: "#fff", textAlign: "left", padding: "8px 10px", borderBottom: `2px solid ${ACCENT}`, fontSize: "13px", position: "sticky", top: 0 };
  const td = { padding: "7px 10px", borderBottom: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.85)", fontSize: "14px" };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a1a", position: "relative", overflow: "hidden", fontFamily: "'Exo 2', 'Segoe UI', sans-serif" }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Exo+2:wght@400;600;700;800&family=Audiowide&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />

      {/* Synthwave pozadí */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "45%", background: "linear-gradient(transparent, rgba(34,211,238,0.06))", backgroundImage: "linear-gradient(rgba(129,140,248,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(129,140,248,0.25) 1px, transparent 1px)", backgroundSize: "40px 40px", transform: "perspective(400px) rotateX(60deg)", transformOrigin: "bottom" }} />
        <div style={{ position: "absolute", top: "8%", left: "50%", transform: "translateX(-50%)", width: "260px", height: "260px", borderRadius: "50%", background: "radial-gradient(circle, #f472b6, #a855f7 55%, transparent 70%)", filter: "blur(8px)", opacity: 0.5 }} />
        <style>{`@keyframes floaty{0%,100%{transform:translateY(0)}50%{transform:translateY(-18px)}}`}</style>
        {[["12%","18%","6s"],["78%","24%","8s"],["30%","70%","7s"],["85%","62%","9s"]].map(([l,t,d],i)=>(
          <div key={i} style={{ position:"absolute", left:l, top:t, width:"6px", height:"6px", borderRadius:"50%", background: i%2?ACCENT:ACCENT2, boxShadow:`0 0 12px ${i%2?ACCENT:ACCENT2}`, animation:`floaty ${d} ease-in-out infinite` }} />
        ))}
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: "860px", margin: "0 auto", padding: "28px 16px 60px" }}>
        {/* Hlavička */}
        <header style={{ textAlign: "center", marginBottom: "24px" }}>
          <h1 style={{ fontFamily: "'Audiowide', cursive", color: "#fff", fontSize: "clamp(24px, 5vw, 38px)", margin: "0 0 8px", textShadow: `0 0 20px ${ACCENT}88` }}>
            Chemie – Názvosloví
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "15px", margin: 0 }}>
            Příprava na test 2.A · anorganické názvosloví + HBP + symboly GHS
          </p>
        </header>

        {/* Navigace */}
        <nav style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap", marginBottom: "28px" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: "9px 16px", borderRadius: "999px", cursor: "pointer", fontSize: "14px", fontWeight: 600,
              transition: "all 0.4s ease", fontFamily: "inherit",
              background: tab === t.id ? `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})` : "rgba(255,255,255,0.06)",
              color: tab === t.id ? "#0a0a1a" : "rgba(255,255,255,0.8)",
              border: tab === t.id ? "1px solid transparent" : "1px solid rgba(255,255,255,0.12)",
            }}>{t.label}</button>
          ))}
        </nav>

        {/* ── TEORIE ── */}
        {tab === "teorie" && (
          <div>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", marginBottom: "18px", textAlign: "center" }}>
              Klikni na téma a rozbal si výklad. Vše potřebné pro test najdeš i v <b>Taháku</b>.
            </p>

            <Collapsible title="1 · Oxidační číslo – základní pravidla" defaultOpen>
              <ul style={{ paddingLeft: "18px", margin: 0 }}>
                <li>Volný prvek má oxidační číslo <b>0</b> (např. Fe, O₂).</li>
                <li>Vodík má obvykle <b>+I</b> (v hydridech kovů −I, např. <F>KH</F>).</li>
                <li>Kyslík má obvykle <b>−II</b> (v peroxidech −I, např. <F>H2O2</F>).</li>
                <li>Součet oxidačních čísel v neutrální sloučenině je <b>0</b>, u iontu se rovná jeho <b>náboji</b>.</li>
                <li>Oxidační číslo poznáš z <b>koncovky</b> přídavného jména (viz tabulka koncovek v taháku).</li>
              </ul>
            </Collapsible>

            <Collapsible title="2 · Koncovky podle oxidačního čísla">
              <p>Nejdůležitější řada, kterou musíš umět nazpaměť:</p>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", background: "rgba(0,0,0,0.25)", borderRadius: "10px", padding: "12px 14px", fontSize: "13px", lineHeight: 1.9 }}>
                I -ný · II -natý · III -itý · IV -ičitý · V -ičný/-ečný · VI -ový · VII -istý · VIII -ičelý
              </div>
              <p style={{ marginTop: "10px" }}>Kompletní tabulku pro kationty, kyseliny i anionty najdeš v záložce <b>Tahák</b>.</p>
            </Collapsible>

            <Collapsible title="3 · Halogenidy, oxidy, sulfidy a další dvouprvkové">
              <p>Dvouprvkové sloučeniny: <b>elektronegativnější prvek</b> (vpravo/nahoře v tabulce) dostane koncovku <b>-id</b> a záporné oxidační číslo, druhý prvek koncovku podle svého oxidačního čísla.</p>
              <ul style={{ paddingLeft: "18px" }}>
                <li><F>AgCl</F> → chlorid stříbrný (Cl −I, Ag I)</li>
                <li><F>FeCl3</F> → chlorid železitý (Fe III)</li>
                <li><F>HgF2</F> → fluorid rtuťnatý (Hg II)</li>
                <li><F>KCN</F> → kyanid draselný (CN⁻ je pseudohalogenid)</li>
              </ul>
            </Collapsible>

            <Collapsible title="4 · Kyseliny (bezkyslíkaté i kyslíkaté)">
              <p><b>Bezkyslíkaté:</b> HCl kyselina chlorovodíková, H₂S kyselina sirovodíková.</p>
              <p><b>Kyslíkaté:</b> oxidační číslo centrálního atomu určuje koncovku (-ná … -ičelá). Např. <F>H2SO4</F> kyselina sírová (S VI), <F>HNO3</F> kyselina dusičná (N V).</p>
              <p><b>Předpony:</b> <i>hydrogen-</i> u kyselin značí počet vodíků nad rámec, <i>peroxo-</i> (skupina −O−O−, <F>H2SO5</F>), <i>thio-</i> (O→S). Vícejaderné kyseliny mají předponu di-, tri- a počet H (<F>H4I2O9</F> = kyselina tetrahydrogendijodistá).</p>
            </Collapsible>

            <Collapsible title="5 · Soli, kyselé soli a podvojné soli">
              <p><b>Sůl</b> = kationt kovu + anion kyseliny. Anion má koncovku -nan/-natan/-itan/-ičitan/-ečnan/-an/-istan/-ičelan.</p>
              <ul style={{ paddingLeft: "18px" }}>
                <li><F>Pb(NO3)2</F> dusičnan olovnatý, <F>Na2S2O3</F> thiosíran sodný</li>
                <li><b>Kyselé soli</b> (hydrogen-): <F>Be(HSO3)2</F> hydrogensiřičitan berylnatý, <F>Ni(H2PO4)2</F> dihydrogenfosforečnan nikelnatý</li>
                <li><b>Podvojné soli</b> (dva kationty): <F>CaMg(CO3)2</F> bis(uhličitan) vápenato-hořečnatý</li>
              </ul>
            </Collapsible>

            <Collapsible title="6 · Hydráty, peroxidy a vodíkové sloučeniny">
              <p><b>Hydráty</b> – krystalová voda za tečkou; počet vody = číslovková předpona + „hydrát“: <F>Al2(SO4)3.18H2O</F> = oktadekahydrát síranu hlinitého.</p>
              <p><b>Peroxidy</b> – obsahují O₂²⁻ (kyslík −I): <F>H2O2</F> peroxid vodíku, <F>Ag2O2</F> peroxid stříbrný.</p>
              <p><b>Vodíkové sloučeniny nekovů</b> mají triviální/ustálené názvy: <F>NH3</F> amoniak, <F>PH3</F> fosfan, <F>H2S</F> sulfan, <F>H2Se</F> selan.</p>
            </Collapsible>

            <Collapsible title="7 · Ionty (kationty a anionty)">
              <p>U samostatného iontu uvádíme slovo <b>kation</b> / <b>anion</b> a přídavné jméno podle náboje:</p>
              <ul style={{ paddingLeft: "18px" }}>
                <li><F>Al3+</F> → kation hlinitý</li>
                <li><F>ClO3-</F> → anion chlorečnanový (Cl má V)</li>
                <li><F>NH4NO2</F> → sůl: kationt amonný NH₄⁺ + dusitan NO₂⁻</li>
              </ul>
            </Collapsible>
          </div>
        )}

        {/* ── ŘEŠENÉ PŘÍKLADY ── */}
        {tab === "priklady" && (
          <div>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", marginBottom: "18px", textAlign: "center" }}>
              Příklady přímo z pracovního listu. Zkus vyřešit sám, pak si otevři <b>postup krok za krokem</b>.
            </p>
            {PRIKLADY.map((p, i) => <PrikladCard key={i} p={p} index={i} />)}
          </div>
        )}

        {/* ── BEZPEČNOST ── */}
        {tab === "bezpecnost" && (
          <div>
            <h2 style={{ color: "#fff", fontSize: "20px", fontFamily: "'Audiowide', cursive", marginBottom: "6px" }}>Hlavní bezpečnostní pravidla (HBP)</h2>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", marginBottom: "18px" }}>Zásady bezpečné práce v chemické laboratoři.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px", marginBottom: "34px" }}>
              {HBP.map((h, i) => (
                <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", padding: "14px 16px" }}>
                  <span style={{ fontSize: "26px", lineHeight: 1, minWidth: "34px", textAlign: "center" }}>{h.i}</span>
                  <div>
                    <div style={{ color: "#fff", fontWeight: 600, fontSize: "15px", marginBottom: "3px" }}>{h.t}</div>
                    <div style={{ color: "rgba(255,255,255,0.65)", fontSize: "13px", lineHeight: 1.55 }}>{h.d}</div>
                  </div>
                </div>
              ))}
            </div>

            <h2 style={{ color: "#fff", fontSize: "20px", fontFamily: "'Audiowide', cursive", marginBottom: "6px" }}>Výstražné symboly GHS</h2>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", marginBottom: "18px" }}>
              9 piktogramů systému GHS/CLP – červeně orámovaný kosočtverec s černým symbolem na bílém poli.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: "12px", marginBottom: "24px" }}>
              {GHS.map((g, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", padding: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                    <div style={{ fontSize: "30px", width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", border: "3px solid #e11d48", borderRadius: "10px", transform: "rotate(45deg)" }}>
                      <span style={{ transform: "rotate(-45deg)" }}>{g.em}</span>
                    </div>
                    <div>
                      <div style={{ color: ACCENT, fontSize: "12px", fontFamily: "'JetBrains Mono', monospace" }}>{g.kod}</div>
                      <div style={{ color: "#fff", fontWeight: 700, fontSize: "15px" }}>{g.nazev}</div>
                    </div>
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.65)", fontSize: "13px", lineHeight: 1.5 }}>{g.popis}</div>
                </div>
              ))}
            </div>
            <div style={{ background: "rgba(129,140,248,0.1)", border: `1px solid ${ACCENT2}55`, borderRadius: "12px", padding: "14px 18px", color: "rgba(255,255,255,0.8)", fontSize: "13px", lineHeight: 1.6 }}>
              <b>Doplněk:</b> Na obalech chemikálií najdeš i <b>H-věty</b> (Hazard – popisují druh nebezpečí, např. H314 „způsobuje těžké poleptání“) a <b>P-věty</b> (Precautionary – pokyny pro bezpečné zacházení, např. P280 „používejte ochranné rukavice“). Signální slova: <b>Nebezpečí</b> (závažnější) a <b>Varování</b> (mírnější).
            </div>
          </div>
        )}

        {/* ── KVÍZ ── */}
        {tab === "kviz" && (
          <div>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", marginBottom: "8px", textAlign: "center" }}>
              {QUESTIONS.length} otázek z názvosloví i bezpečnosti. Možnosti se míchají, kvíz můžeš opakovat.
            </p>
            <QuizEngine questions={QUESTIONS} accentColor={ACCENT} />
          </div>
        )}

        {/* ── KARTIČKY ── */}
        {tab === "karticky" && (
          <div>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", marginBottom: "20px", textAlign: "center" }}>
              Všech {FLASHCARDS.length} dvojic z pracovního listu. Přepni směr učení a zamíchej pořadí.
            </p>
            <Flashcards />
          </div>
        )}

        {/* ── TAHÁK ── */}
        {tab === "tahak" && (
          <div>
            <h2 style={{ color: "#fff", fontSize: "20px", fontFamily: "'Audiowide', cursive", marginBottom: "14px" }}>Koncovky podle oxidačního čísla</h2>
            <div style={{ overflowX: "auto", background: "rgba(255,255,255,0.04)", borderRadius: "14px", padding: "12px", marginBottom: "28px" }}>
              <table style={{ borderCollapse: "collapse", width: "100%", minWidth: "560px", fontFamily: "'JetBrains Mono', monospace" }}>
                <thead>
                  <tr>
                    <th style={th}>Ox. číslo</th>
                    <th style={th}>Kation / prvek</th>
                    <th style={th}>Kyselina</th>
                    <th style={th}>Anion (sůl)</th>
                    <th style={th}>Příklad</th>
                  </tr>
                </thead>
                <tbody>
                  {KONCOVKY.map((k, i) => (
                    <tr key={i}>
                      <td style={{ ...td, color: ACCENT, fontWeight: 700 }}>{k.ox}</td>
                      <td style={td}>{k.kat}</td>
                      <td style={td}>{k.kys}</td>
                      <td style={td}>{k.anion}</td>
                      <td style={{ ...td, fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>{k.pr}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2 style={{ color: "#fff", fontSize: "20px", fontFamily: "'Audiowide', cursive", marginBottom: "14px" }}>Číslovkové předpony</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "28px" }}>
              {PREDPONY.map(([p, n]) => (
                <div key={p} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px", padding: "8px 14px", fontFamily: "'JetBrains Mono', monospace", fontSize: "14px" }}>
                  <span style={{ color: ACCENT, fontWeight: 700 }}>{n}</span> <span style={{ color: "#fff" }}>{p}-</span>
                </div>
              ))}
            </div>

            <h2 style={{ color: "#fff", fontSize: "20px", fontFamily: "'Audiowide', cursive", marginBottom: "14px" }}>Klíčové předpony a skupiny</h2>
            <div style={{ display: "grid", gap: "10px", marginBottom: "28px" }}>
              {[
                ["-id", "koncovka jednoatomového aniontu (chlorid, oxid, sulfid)"],
                ["hydrogen- / dihydrogen-", "kyselá sůl – zbylý(é) odtržitelný(é) vodík(y): HSO₃⁻, H₂PO₄⁻"],
                ["peroxo- / peroxid", "skupina −O−O−, kyslík má −I (H₂SO₅, H₂O₂)"],
                ["thio-", "atom kyslíku nahrazen sírou (thiosíran S₂O₃²⁻)"],
                ["hydrát", "krystalová voda za tečkou (·nH₂O)"],
                ["bis(…)", "násobící předpona u složitějších aniontů/podvojných solí"],
              ].map(([a, b], i) => (
                <div key={i} style={{ display: "flex", gap: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "12px 16px" }}>
                  <span style={{ color: ACCENT, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, minWidth: "150px", fontSize: "14px" }}>{a}</span>
                  <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px" }}>{b}</span>
                </div>
              ))}
            </div>

            <h2 style={{ color: "#fff", fontSize: "20px", fontFamily: "'Audiowide', cursive", marginBottom: "14px" }}>Zlatá pravidla bezpečnosti</h2>
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid #ef444455", borderRadius: "14px", padding: "16px 20px", color: "rgba(255,255,255,0.85)", fontSize: "14px", lineHeight: 1.8 }}>
              💧 Kyselinu <b>vždy do vody</b> · 👋 čichej mávnutím ruky · 🚫 v laboratoři nejíst a nepít · 🥽 nos ochranné pomůcky · 🚱 nepipetuj ústy · 🧯 znej lékárničku a hasicí přístroj · ☠️ lebka (GHS06) = jed, ❗ vykřičník (GHS07) = dráždivé, 🧪 GHS05 = žíravé.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
