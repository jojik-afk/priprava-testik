// @title Sociologie — kompletní příprava na test (Keller & klasici)
// @subject Humanities
// @topic Sociologie — kultura, socializace, klasici, sociální nerovnost
// @template mixed

import { useState, useCallback, useMemo } from "react";

// ════════════════════════════════════════════════════════════════
// QUIZ ENGINE (inline copy — per assets/quiz-engine.jsx)
// ════════════════════════════════════════════════════════════════

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

  const score = shuffledQuestions.filter((qq, i) => revealed[i] && arrEqual(answers[i] || [], qq.correct)).length;
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
      prev.includes(optionIdx) ? prev.filter(i => i !== optionIdx) : [...prev, optionIdx]
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
    setShuffleKey(k => k + 1);
  }, []);

  if (showResults) {
    const msg =
      pct >= 90 ? "Výborně! Máš to perfektně zvládnuté!"
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
          return (
            <div key={i} onClick={() => goTo(i)} title={`Otázka ${i + 1}`} style={{ ...QS.dot, background: bg }} />
          );
        })}
      </div>

      <div style={QS.card}>
        <div style={QS.qNum}>Otázka {idx + 1} / {shuffledQuestions.length}{isMulti ? " — více správných odpovědí" : ""}</div>
        <div style={QS.qText}>{q.question}</div>

        <div style={QS.optionsList}>
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
              <div key={i} style={{ ...QS.option, background: bg, border }}
                onClick={() => isMulti ? toggleMulti(i) : handleSingleSelect(i)}>
                {isMulti && <span style={QS.checkbox}>{activeSet.includes(i) ? "☑" : "☐"}</span>}
                <span>{opt}</span>
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
                Správná odpověď: {q.correct.map(i => q.options[i]).join(", ")}
              </div>
            )}
            <div style={QS.feedbackExplanation}>{q.explanation}</div>
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

// ════════════════════════════════════════════════════════════════
// DESIGN TOKENS — humanities → amber/orange accent
// ════════════════════════════════════════════════════════════════

const ACCENT = "#f59e0b";
const ACCENT2 = "#fb923c";

const glass = {
  background: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "20px",
  transition: "all 0.4s ease",
};

const T = {
  h2: { color: "#fff", fontSize: "22px", fontWeight: 700, margin: "0 0 12px" },
  h3: { color: ACCENT, fontSize: "16px", fontWeight: 700, margin: "18px 0 8px" },
  p:  { color: "rgba(255,255,255,0.78)", fontSize: "15px", lineHeight: 1.65, margin: "0 0 10px" },
  li: { color: "rgba(255,255,255,0.78)", fontSize: "15px", lineHeight: 1.6, marginBottom: "6px" },
  strong: { color: "#fff", fontWeight: 600 },
  term: { color: ACCENT, fontWeight: 600 },
};

function Term({ children }) { return <span style={T.term}>{children}</span>; }
function B({ children }) { return <strong style={T.strong}>{children}</strong>; }

// ── Collapsible section ─────────────────────────────────────────
function Collapse({ title, badge, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ ...glass, marginBottom: "14px", overflow: "hidden" }}>
      <div onClick={() => setOpen(o => !o)}
        style={{ padding: "16px 20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", userSelect: "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: "16.5px" }}>{title}</span>
          {badge && <span style={{ fontSize: "12px", color: ACCENT, background: ACCENT + "1d", border: `1px solid ${ACCENT}55`, borderRadius: "999px", padding: "2px 10px" }}>{badge}</span>}
        </div>
        <span style={{ color: ACCENT, fontSize: "18px", transform: open ? "rotate(90deg)" : "none", transition: "transform 0.4s ease" }}>▸</span>
      </div>
      {open && <div style={{ padding: "0 20px 20px" }}>{children}</div>}
    </div>
  );
}

// ── Hidden answer / solution reveal ─────────────────────────────
function Reveal({ label = "Zobrazit odpověď", children }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginTop: "10px" }}>
      {!open ? (
        <button onClick={() => setOpen(true)}
          style={{ padding: "8px 18px", background: ACCENT + "22", border: `1px solid ${ACCENT}66`, borderRadius: "10px", color: ACCENT, cursor: "pointer", fontSize: "14px", transition: "all 0.4s ease" }}>
          👁 {label}
        </button>
      ) : (
        <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.35)", borderRadius: "12px", padding: "14px 16px", marginTop: "4px" }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ── Two-column comparison table ─────────────────────────────────
function CompareTable({ leftTitle, rightTitle, rows }) {
  const cell = { padding: "10px 14px", fontSize: "14px", color: "rgba(255,255,255,0.8)", lineHeight: 1.5, verticalAlign: "top", borderBottom: "1px solid rgba(255,255,255,0.07)" };
  return (
    <div style={{ overflowX: "auto", margin: "10px 0" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "440px" }}>
        <thead>
          <tr>
            {rows[0].length === 3 && <th style={{ ...cell, color: "rgba(255,255,255,0.45)", fontSize: "12px", textTransform: "uppercase" }}></th>}
            <th style={{ ...cell, color: ACCENT, fontWeight: 700, fontSize: "14px" }}>{leftTitle}</th>
            <th style={{ ...cell, color: "#60a5fa", fontWeight: 700, fontSize: "14px" }}>{rightTitle}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.length === 3 && <td style={{ ...cell, color: "#fff", fontWeight: 600, whiteSpace: "nowrap" }}>{r[0]}</td>}
              <td style={cell}>{r[r.length - 2]}</td>
              <td style={cell}>{r[r.length - 1]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// DATA — quiz questions
// ════════════════════════════════════════════════════════════════

const quizQuestions = [
  // ── typové otázky přímo z prezentace ──
  {
    question: "Které z následujících hledisek bylo dominantní v Marxově rozdělení společnosti do tříd? (typová otázka z testu)",
    type: "single",
    options: ["míra politického vlivu", "prestiž povolání", "míra vzdělanosti", "vztah k výrobním prostředkům"],
    correct: [3],
    explanation: "Marx dělí společnost na třídy podle vztahu k výrobním prostředkům: buržoazie výrobní prostředky (továrny, půdu, kapitál) vlastní, proletariát vlastní jen svou pracovní sílu, kterou musí prodávat.",
    tip: "Marx = ekonomika především. Vlastníš výrobní prostředky → buržoazie; nevlastníš → proletariát."
  },
  {
    question: "„Řád a do značné míry schopnost jednat získáváme teprve při jednání s druhými lidmi, protože v kontaktu s druhými se učíme rozumět nejen tomu, jak jednat a které chování je ‚správné‘, ale i nejzákladnější představu o tom, co věci jsou a jaké je jejich místo ve světě.“ — Jaký proces popisuje výchozí text? (typová otázka z testu)",
    type: "single",
    options: ["socializaci", "vznik legitimity vlády", "sociální kontrolu", "vznik veřejného mínění"],
    correct: [0],
    explanation: "Text popisuje socializaci — proces, při kterém se z biologického tvora stává kulturní bytost: v kontaktu s druhými se učíme normám, hodnotám a chápání světa.",
    tip: "Klíčová slova „\1“ = socializace."
  },
  {
    question: "Kdo napsal spis Kapitál?",
    type: "single",
    options: ["Karel Marx", "Max Weber", "Auguste Comte", "Émile Durkheim"],
    correct: [0],
    explanation: "Kapitál (Das Kapital) je hlavní dílo Karla Marxe — analýza kapitalismu, nadhodnoty a odcizení práce.",
    tip: "Typová otázka z testu: Kapitál → Marx, chápající sociologie → Weber, pozitivní věda → Comte."
  },
  {
    question: "S kým je spojen pojem „\1“?",
    type: "single",
    options: ["Max Weber", "Auguste Comte", "Talcott Parsons", "Ferdinand Tönnies"],
    correct: [0],
    explanation: "Chápající (verstehende) sociologie je koncept Maxe Webera: sociolog má porozumět smyslu, který lidé svému jednání sami přikládají, ne jen měřit vnější fakta. S Weberem souvisí i pojem ideální typ a hodnotová neutralita vědy.",
  },
  {
    question: "Kdo je autorem pojmu „\1“ a konceptu pozitivní vědy o společnosti?",
    type: "single",
    options: ["Auguste Comte", "Herbert Spencer", "Karel Marx", "T. G. Masaryk"],
    correct: [0],
    explanation: "Auguste Comte (1798–1857) je „\1“ — zavedl samotný název oboru a v Kursu pozitivní filosofie požadoval, aby se společnost zkoumala pozitivně, tj. vědecky: ne PROČ věci jsou, ale JAK spolu jevy souvisejí (zákony, vztahy).",
  },
  {
    question: "Pojem anomie označuje:",
    type: "single",
    options: [
      "stav, kdy přestávají platit staré normy a nové ještě nejsou ustaveny",
      "úplné ztotožnění člověka se sociální rolí",
      "odpor ke všemu cizímu",
      "proces přijetí norem za své"
    ],
    correct: [0],
    explanation: "Anomie (Émile Durkheim) = stav bezzákonnosti či beznormnosti; staré normy tradiční společnosti přestaly platit a nové se ještě neustavily. Typické pro období rychlé společenské změny (např. průmyslová revoluce).",
    tip: "a-nomos = řecky „\1“."
  },
  {
    question: "Které složky tvoří podle Kellera sociální status? (více odpovědí)",
    type: "multi",
    options: ["majetek", "moc", "prestiž", "národnost", "věk"],
    correct: [0, 1, 2],
    explanation: "Sociální status má tři složky: majetek, moc a prestiž. Národnost a věk jsou připsané charakteristiky, ne složky statusu.",
    tip: "MMP: Majetek – Moc – Prestiž."
  },
  {
    question: "Dělník se vypracuje na ředitele firmy. O jaký typ sociální mobility jde?",
    type: "single",
    options: [
      "vertikální vzestupná",
      "horizontální",
      "nepravá",
      "vertikální sestupná"
    ],
    correct: [0],
    explanation: "Vertikální mobilita = pohyb mezi vrstvami nahoru či dolů (zde vzestup). Horizontální mobilita = změna pozice na stejné úrovni (např. změna zaměstnání ve stejné pozici, stěhování). Nepravá mobilita = status se zdánlivě mění, aniž by se reálně změnilo postavení (posune se celá struktura).",
  },
  {
    question: "Civilizace (v užším smyslu) vzniká, když společnost má: (více odpovědí)",
    type: "multi",
    options: ["písmo", "město", "stát", "náboženství", "peníze"],
    correct: [0, 1, 2],
    explanation: "Tři znaky civilizace podle Kellera: písmo (umožňuje skladovat informace), město (dává vztahům prostorové vymezení — hradby, tržiště, fórum) a stát (monopol na legitimní použití násilí). Náboženství a směna existují i v necivilizovaných kulturách.",
    tip: "Písmo – Město – Stát. Civilizace = užší pojem, kultura = širší (vše, čím se lišíme od zvířat)."
  },
  {
    question: "Osvojování profesních znalostí pro trh práce je příkladem:",
    type: "single",
    options: ["sekundární socializace", "primární socializace", "resocializace", "internalizace"],
    correct: [0],
    explanation: "Sekundární socializace = osvojení profesních znalostí a dovedností pro uplatnění na trhu práce. Primární socializace = základní kulturní normy (slušné chování, respekt k druhým). Resocializace = nové osvojení norem, např. po návratu z vězení.",
  },
  {
    question: "Internalizace znamená, že člověk:",
    type: "single",
    options: [
      "přijme normy „\1“ a dodržuje je dobrovolně",
      "je k dodržování norem otevřeně donucen",
      "normy odmítá a vymezuje se proti nim",
      "se vrací do společnosti po dlouhém vyloučení"
    ],
    correct: [0],
    explanation: "Internalizace = zvnitřnění norem; člověk je přijme za vlastní a dodržuje je dobrovolně, bez vnějšího donucení. Je to nejúčinnější forma sociální kontroly — moderní společnost ji doplňuje skrytými formami manipulace (reklama, média).",
  },
  {
    question: "Role „\1“ nebo „\1“ je podle Kellera role:",
    type: "single",
    options: ["vnucená", "připsaná", "získaná", "referenční"],
    correct: [0],
    explanation: "Vnucené role jsou přiděleny bez našeho přičinění (nezaměstnaný, bezdomovec). Připsané role nemůžeme odmítnout (věk, pohlaví, národnost). Získané role jsme si vydobyli (uznání, majetek).",
    tip: "Připsaná = narodíš se s ní. Získaná = vydobudeš si ji. Vnucená = přidělí ti ji okolnosti."
  },
  {
    question: "Váleční zločinci, kteří se hájili slovy „\1“, jsou v učebnici příkladem:",
    type: "single",
    options: [
      "naprostého ztotožnění s rolí",
      "rolové distance",
      "konfliktu mezi rolemi",
      "odmítnutí role"
    ],
    correct: [0],
    explanation: "Naprosté ztotožnění s rolí = člověk ztrácí svobodnou vůli a odpovědnost. Opačný extrém (naprosté odmítání rolí) by rozložil společnost. Řešením je přiměřená rolová distance: roli plním, ale nenechám se jí zcela pohltit.",
  },
  {
    question: "Skupina, v níž člověk není členem, ale orientuje se na její hodnoty a normy, se nazývá:",
    type: "single",
    options: ["referenční skupina", "členská skupina", "out-group", "formální skupina"],
    correct: [0],
    explanation: "Referenční skupina = vztažná skupina, jejíž hodnoty přejímám, i když do ní nepatřím (např. teenager napodobující profesionální sportovce). Out-group je skupina, vůči níž se vymezuji.",
  },
  {
    question: "Které dvojice patří k dělení skupin? (více odpovědí)",
    type: "multi",
    options: [
      "malé × velké",
      "formální × neformální",
      "členské × referenční",
      "připsané × získané",
      "primární × sekundární"
    ],
    correct: [0, 1, 2, 4],
    explanation: "Skupiny dělíme podle velikosti (malé × velké), formálnosti (formální × neformální), vztahu člověka ke skupině (členská × referenční × out-group) a na primární × sekundární. „\1“ je dělení rolí, ne skupin.",
  },
  {
    question: "Dvoustupňový model komunikace říká, že:",
    type: "single",
    options: [
      "vliv médií na publikum filtrují názoroví vůdci a malé skupiny",
      "média působí na publikum přímo a bez prostředníků",
      "informace se šíří nejprve psaným a poté mluveným slovem",
      "publikum se dělí na optimisty a kritiky"
    ],
    correct: [0],
    explanation: "Média předávají publiku informace, ale postoje se utvářejí přes názorové vůdce v malých skupinách. Proto nejsme vůči médiím bezbranní — jejich vliv je filtrován.",
    tip: "Stupeň 1: média → názoroví vůdci. Stupeň 2: názoroví vůdci → publikum (postoje)."
  },
  {
    question: "Hodnocení všeho pouze z pozice vlastní kultury, kterou považujeme za jedinou správnou, se nazývá:",
    type: "single",
    options: ["etnocentrismus", "xenofobie", "předsudek", "kulturní pluralismus"],
    correct: [0],
    explanation: "Etnocentrismus = posuzování jiných kultur měřítky té vlastní. Xenofobie = odpor ke všemu cizímu. Předsudek = apriorní (předem vytvořený) negativní obraz o jednotlivci či skupině. Kulturní pluralismus je naopak řešení: všechny kultury jsou rovnocenné.",
  },
  {
    question: "Ferdinand Tönnies rozlišil:",
    type: "single",
    options: [
      "tradiční pospolitost (Gemeinschaft) a moderní společnost (Gesellschaft)",
      "mechanickou a organickou solidaritu",
      "teologické, metafyzické a pozitivní stadium",
      "třídu produktivní a politickou"
    ],
    correct: [0],
    explanation: "Tönnies: Gemeinschaft = tradiční pospolitost (osobní vztahy, sdílené hodnoty, vesnice) × Gesellschaft = moderní společnost (neosobní, účelové, smluvní vztahy). Solidarity jsou Durkheim, stadia Comte, produktivní/politická třída Collins.",
  },
  {
    question: "Organická solidarita podle Durkheima drží pohromadě:",
    type: "single",
    options: [
      "moderní společnost — skrze dělbu práce a vzájemnou závislost odlišných lidí",
      "tradiční společnost — skrze podobnost a sdílené normy všech členů",
      "rodinu — skrze pokrevní příbuznost",
      "církev — skrze společnou víru"
    ],
    correct: [0],
    explanation: "Mechanická solidarita (tradiční společnost) = soudržnost z podobnosti — všichni dělají a věří totéž. Organická solidarita (moderní společnost) = soudržnost z odlišnosti — dělba práce nás činí vzájemně závislými jako orgány těla.",
    tip: "Organická = jako orgány v těle: každý dělá něco jiného, ale nikdo nepřežije sám."
  },
  {
    question: "Které znaky charakterizují moderní společnost podle Kellera (kap. 2)? (více odpovědí)",
    type: "multi",
    options: ["generalizace", "individualizace", "funkční diferenciace", "racionalizace", "orientace na tradici"],
    correct: [0, 1, 2, 3],
    explanation: "Čtyři znaky moderní společnosti: generalizace (normy platí obecně pro všechny), individualizace (jedinec se vyvazuje z tradičních vazeb), funkční diferenciace (společnost se dělí na specializované subsystémy) a racionalizace (účelové, vypočitatelné jednání). Orientace na tradici je znak tradiční společnosti.",
    tip: "GIFR: Generalizace, Individualizace, Funkční diferenciace, Racionalizace."
  },
  {
    question: "Které charakteristiky patří k TRADIČNÍ společnosti? (více odpovědí)",
    type: "multi",
    options: [
      "dědičná moc",
      "cyklické chápání času",
      "připsaný (pevný) status",
      "tržní hospodářství",
      "profesionální byrokracie"
    ],
    correct: [0, 1, 2],
    explanation: "Tradiční společnost: dědičná moc, cyklické chápání času, připsaný status, stavovská struktura, zemědělství, soběstačnost domácností, mytologicko-náboženský výklad světa. Tržní hospodářství a profesionální byrokracie patří k moderní společnosti.",
  },
  {
    question: "Jaké je správné pořadí tří stadií vývoje lidského ducha podle Comta?",
    type: "single",
    options: [
      "teologické → metafyzické → pozitivní",
      "metafyzické → teologické → pozitivní",
      "pozitivní → metafyzické → teologické",
      "teologické → pozitivní → metafyzické"
    ],
    correct: [0],
    explanation: "Zákon tří stadií: 1) teologické — jevy vysvětlují bohové a nadpřirozené síly; 2) metafyzické — abstraktní principy a podstaty; 3) pozitivní — věda nezkoumá PROČ, ale JAK: hledá zákony a vztahy mezi jevy.",
    tip: "T-M-P: Tři Mušketýři Pijou."
  },
  {
    question: "Které druhy kapitálu rozlišuje Pierre Bourdieu? (více odpovědí)",
    type: "multi",
    options: ["ekonomický", "sociální", "kulturní", "biologický", "morální"],
    correct: [0, 1, 2],
    explanation: "Bourdieu (70. léta 20. století): ekonomický kapitál (majetek, příjmy), sociální kapitál (kontakty, vazby, známosti) a kulturní kapitál (vzdělání, kulturní přehled, vkus). Na kombinaci kapitálů staví i Savageova analýza tříd.",
    tip: "EKS: Ekonomický, Kulturní, Sociální."
  },
  {
    question: "Jaké jsou tři podoby kulturního kapitálu podle Bourdieua? (více odpovědí)",
    type: "multi",
    options: ["vtělený", "objektivizovaný", "institucionalizovaný", "globalizovaný", "privatizovaný"],
    correct: [0, 1, 2],
    explanation: "Vtělený (inkorporovaný) = znalosti, vkus a návyky „\1“; objektivizovaný = vlastněné kulturní předměty (knihy, obrazy, nástroje); institucionalizovaný = formální osvědčení (diplomy, tituly).",
  },
  {
    question: "Sociolog Mike Savage (Social Class in the 21st Century, Velký britský třídní výzkum) rozdělil britskou společnost na:",
    type: "single",
    options: [
      "sedm tříd podle kombinace ekonomického, sociálního a kulturního kapitálu",
      "dvě třídy podle vztahu k výrobním prostředkům",
      "tři stavy podle původu",
      "pět vrstev podle prestiže povolání"
    ],
    correct: [0],
    explanation: "Savage ukázal, že třídy nezmizely: na základě Great British Class Survey popsal 7 tříd podle kombinace tří kapitálů (Bourdieu). Na vrcholu elita (~6 %, disponuje všemi kapitály), na dně prekariát (~15 %, nedostatek všech druhů kapitálu). Konec tradiční politiky založené na konfliktu dělnické a střední třídy.",
    tip: "Pro Česko podobně Daniel Prokop: Rozděleni svobodou — šest tříd české společnosti."
  },
  {
    question: "Pojem sociálních práv jako součásti občanství rozpracoval ve spise Občanství a sociální třída (1950):",
    type: "single",
    options: ["T. H. Marshall", "Talcott Parsons", "Randall Collins", "Charles W. Mills"],
    correct: [0],
    explanation: "T. H. Marshall: občanství se vyvíjelo od práv občanských (svobody) přes politická (volit) k právům sociálním (vzdělání, zdraví, zabezpečení) — ta garantuje sociální stát a zmírňují nerovnost.",
  },
  {
    question: "Jak se na sociální nerovnost dívá strukturní funkcionalismus (Talcott Parsons)?",
    type: "single",
    options: [
      "nerovnost je užitečná — motivuje lidi obsazovat náročné a důležité pozice",
      "nerovnost je výsledkem vykořisťování a měla by být odstraněna revolucí",
      "nerovnost je čistě náhodná a nemá žádnou funkci",
      "nerovnost vzniká pouze rozdílným vzděláním"
    ],
    correct: [0],
    explanation: "Strukturní funkcionalismus (konsensuální teorie): nerovnost je funkční — odměny motivují schopné, aby zastávali náročné pozice. Teorie konfliktu naopak: nerovnost plyne z moci a privilegií, konflikt o zdroje je hnacím motorem změny (a může být i užitečný — Ch. W. Mills).",
  },
  {
    question: "V polemice o vlivu školy na nerovnost platí: Bourdieu tvrdí, že děti z vyšších vrstev zvýhodňuje ……, zatímco Boudon zdůrazňuje, že volbu školy ovlivňuje …….",
    type: "single",
    options: [
      "kulturní kapitál / ekonomický kapitál",
      "ekonomický kapitál / kulturní kapitál",
      "sociální kapitál / biologický kapitál",
      "vzdělání rodičů / počet sourozenců"
    ],
    correct: [0],
    explanation: "Bourdieu: škola odměňuje kulturní kapitál, který si děti z vyšších vrstev přinášejí z domova (jazyk, vkus, přehled). Boudon: rozhodující je ekonomický kapitál — rodiny zvažují náklady a rizika další školy. Sociální kapitál (kontakty) pak zvýhodňuje po ukončení studia.",
  },
  {
    question: "Max Weber ve spise Protestantská etika a duch kapitalismu (1905) zkoumá:",
    type: "single",
    options: [
      "jak náboženská etika (kalvinismus, predestinace) podpořila vznik moderního kapitalismu",
      "jak kapitalismus zničil náboženství",
      "ekonomické zákony akumulace kapitálu",
      "dělbu práce v protestantských zemích"
    ],
    correct: [0],
    explanation: "Weber ukazuje vztah mezi protestantskou (kalvínskou) etikou a „\1“: víra v predestinaci vedla k askezi, systematické práci a reinvestování zisku — náboženské motivy tak nezáměrně podpořily kapitalismus. Pozn.: jde o opačný směr vysvětlení než u Marxe (ideje ← ekonomika).",
  },
  {
    question: "Kdo je považován za zakladatele české sociologie (a později se stal prezidentem)?",
    type: "single",
    options: ["Tomáš Garrigue Masaryk", "Edvard Beneš", "Jan Keller", "Miloslav Petrusek"],
    correct: [0],
    explanation: "T. G. Masaryk — první profesor sociologie u nás, autor sociologické studie Sebevražda (1881), pozdější první československý prezident. Jan Keller je autor naší učebnice, Petrusek psal o postmoderních společnostech.",
  },
];

// ════════════════════════════════════════════════════════════════
// DATA — flashcards
// ════════════════════════════════════════════════════════════════

const flashcards = [
  { front: "SOCIALIZACE", back: "Proces, při kterém se z biologického tvora stává kulturní bytost — učíme se chování, normám a hodnotám své společnosti. Primární (základní normy) × sekundární (profesní znalosti)." },
  { front: "RESOCIALIZACE", back: "Opětovné osvojení norem a začlenění do společnosti — např. po návratu z vězení, po dlouhé nemoci, po emigraci." },
  { front: "ANOMIE (Durkheim)", back: "Stav „\1“: staré normy přestaly platit a nové ještě nejsou ustaveny. Typická pro období rychlých společenských změn." },
  { front: "KULTURA", back: "Širší pojem: vše, čím se lišíme od zvířat — normy, jazyk, vědění, zvyky, obřady, náboženské představy. Klíčovou roli hrají symboly." },
  { front: "CIVILIZACE", back: "Užší pojem. Vzniká, když společnost má: 1) PÍSMO (skladuje informace), 2) MĚSTO (prostorové vymezení vztahů), 3) STÁT (monopol na legitimní násilí)." },
  { front: "SOCIÁLNÍ KONTROLA", back: "Způsoby, jimiž společnost zajišťuje dodržování norem: od otevřeného donucení (tradiční spol.) po skryté formy manipulace (moderní spol.). Nejúčinnější je internalizace." },
  { front: "INTERNALIZACE", back: "Zvnitřnění norem — člověk je přijme „\1“ a dodržuje je dobrovolně, bez vnějšího nátlaku." },
  { front: "SOCIÁLNÍ ROLE", back: "Pravidelnosti v jednání spojené s pozicí člověka ve společnosti. Typy: PŘIPSANÉ (věk, pohlaví), ZÍSKANÉ (uznání, majetek), VNUCENÉ (nezaměstnaný)." },
  { front: "ROLOVÁ DISTANCE", back: "Přiměřený odstup od role: plním ji, ale nenechám se jí pohltit. Extrémy: naprosté ztotožnění („\1“) × naprosté odmítání (rozpad společnosti)." },
  { front: "SOCIÁLNÍ STATUS", back: "Postavení člověka ve společnosti. Tři složky: MAJETEK – MOC – PRESTIŽ. Připsaný × získaný status." },
  { front: "SOCIÁLNÍ MOBILITA", back: "Pohyb mezi sociálními pozicemi. VERTIKÁLNÍ (vzestup/sestup mezi vrstvami) × HORIZONTÁLNÍ (na stejné úrovni). NEPRAVÁ mobilita = zdánlivá změna statusu, reálné postavení se nemění." },
  { front: "SOCIÁLNÍ STRATIFIKACE", back: "Rozvrstvení společnosti do vrstev/tříd podle majetku, moci a prestiže. Tradiční spol.: stavovská struktura, pevný status. Moderní spol.: třídní struktura, pohyblivý status." },
  { front: "REFERENČNÍ SKUPINA", back: "Skupina, na jejíž hodnoty a normy se orientuji, i když nejsem jejím členem. (Členská = jsem v ní; out-group = vymezuji se proti ní.)" },
  { front: "DVOUSTUPŇOVÝ MODEL KOMUNIKACE", back: "Média → publikum: informace. Názoroví vůdci → publikum: postoje. Vliv médií filtrují malé skupiny a názoroví vůdci — nejsme bezbranní." },
  { front: "ETNOCENTRISMUS", back: "Hodnocení všeho jen z pozice vlastní kultury, kterou považuji za jedinou správnou. Řešení: kulturní pluralismus — všechny kultury jsou rovnocenné." },
  { front: "PŘEDSUDEK × XENOFOBIE", back: "Předsudek = apriorní (předem vytvořený) negativní obraz o jednotlivci/skupině. Xenofobie = odpor ke všemu cizímu." },
  { front: "GEMEINSCHAFT × GESELLSCHAFT (Tönnies)", back: "Pospolitost (tradiční): osobní, citové vazby, sdílené hodnoty. Společnost (moderní): neosobní, účelové, smluvní vztahy." },
  { front: "MECHANICKÁ × ORGANICKÁ SOLIDARITA (Durkheim)", back: "Mechanická (tradiční spol.): soudržnost z PODOBNOSTI. Organická (moderní spol.): soudržnost z ODLIŠNOSTI — dělba práce → vzájemná závislost." },
  { front: "ZÁKON TŘÍ STADIÍ (Comte)", back: "Vývoj lidského ducha: 1) TEOLOGICKÉ (bohové), 2) METAFYZICKÉ (abstraktní podstaty), 3) POZITIVNÍ (věda — ne PROČ, ale JAK; zákony a vztahy)." },
  { front: "ODCIZENÍ (Marx)", back: "Práce v kapitalismu vytváří odcizení: dělník nevlastní výrobní prostředky ani produkt své práce; práce ho neuskutečňuje, ale zotročuje." },
  { front: "CHÁPAJÍCÍ SOCIOLOGIE + IDEÁLNÍ TYP (Weber)", back: "Sociologie má rozumět smyslu, který lidé svému jednání přikládají. Ideální typ = myšlenkový nástroj, „\1“ model jevu pro srovnávání s realitou." },
  { front: "ZNAKY MODERNÍ SPOLEČNOSTI", back: "Generalizace, Individualizace, Funkční diferenciace, Racionalizace (GIFR)." },
  { front: "DRUHY KAPITÁLU (Bourdieu)", back: "EKONOMICKÝ (majetek), SOCIÁLNÍ (kontakty, vazby), KULTURNÍ (vzdělání, vkus). Kulturní: vtělený, objektivizovaný, institucionalizovaný." },
  { front: "MIKE SAVAGE — 7 TŘÍD", back: "Social Class in the 21st Century (2015), Great British Class Survey: 7 tříd podle kombinace kapitálů. Elita (~6 %) nahoře, prekariát (~15 %) dole. Pro ČR: Daniel Prokop — Rozděleni svobodou (6 tříd)." },
  { front: "SOCIÁLNÍ STÁT + SOCIÁLNÍ PRÁVA", back: "Stát zmírňující nerovnosti (zabezpečení, zdraví, vzdělání). T. H. Marshall: Občanství a sociální třída (1950) — občanská → politická → sociální práva." },
  { front: "STRUKTURNÍ FUNKCIONALISMUS × TEORIE KONFLIKTU", back: "Parsons (konsensus): nerovnost je funkční, motivuje. Teorie konfliktu (Mills): nerovnost plyne z moci; konflikt je motorem změny a může být užitečný." },
];

// ════════════════════════════════════════════════════════════════
// DATA — osobnosti
// ════════════════════════════════════════════════════════════════

const persons = [
  {
    name: "Auguste COMTE", years: "1798–1857", country: "🇫🇷 Francie", emoji: "🧭",
    tagline: "Otec sociologie — pozitivismus",
    points: [
      <>Zavedl pojem <Term>sociologie</Term>; dílo <B>Kurs pozitivní filosofie</B> (1830–42).</>,
      <><Term>Pozitivní věda</Term>: nezkoumá PROČ (příčiny, účely), ale JAK — zákony a vztahy mezi jevy, založené na pozorování.</>,
      <><Term>Zákon tří stadií</Term>: teologické (bohové, duchové) → metafyzické (abstraktní podstaty) → pozitivní (věda).</>,
      <>Opory společnosti, o které se podle Comta řád opírá: <B>rodina, majetek/vlastnictví, dělba práce, víra, jazyk</B>.</>,
    ]
  },
  {
    name: "Karel MARX", years: "1818–1883", country: "🇩🇪 Německo", emoji: "⚒️",
    tagline: "Konflikt, ekonomika, revoluce",
    points: [
      <>Dílo <B>Kapitál</B>. Všechny společnosti jsou založeny na <Term>konfliktu</Term>; základním motivem všech společenských změn je <Term>ekonomika</Term>.</>,
      <>Třídy podle <Term>vztahu k výrobním prostředkům</Term>: buržoazie (vlastní) × proletariát (prodává pracovní sílu). ← typová otázka!</>,
      <>Práce v kapitalismu vytváří <Term>odcizení</Term>; nadhodnota připadá vlastníkovi kapitálu.</>,
      <>„\1“ — <Term>historický materialismus</Term>: vývoj není náhodný, lze ho rozpoznat v organizaci ekonomiky.</>,
      <>Společnost lze přebudovat <B>vědeckou kritikou a revoluční akcí</B> — člověk je formován společností, ale může ji změnit.</>,
    ]
  },
  {
    name: "Émile DURKHEIM", years: "1858–1917", country: "🇫🇷 Francie", emoji: "🔗",
    tagline: "Solidarita, anomie, sociální fakta",
    points: [
      <><Term>Anomie</Term> = stav, kdy staré normy přestaly platit a nové ještě nejsou ustaveny.</>,
      <>Dílo <B>Společenská dělba práce</B>: <Term>mechanická solidarita</Term> (tradiční — soudržnost z podobnosti) × <Term>organická solidarita</Term> (moderní — soudržnost z odlišnosti skrze dělbu práce).</>,
      <>Společnost je třeba zkoumat skrze <B>sociální fakta</B> — působí na nás zvnějšku jako věci (studie Sebevražda).</>,
    ]
  },
  {
    name: "Max WEBER", years: "1864–1920", country: "🇩🇪 Německo", emoji: "📜",
    tagline: "Chápající sociologie, ideální typ",
    points: [
      <><Term>Chápající (rozumějící) sociologie</Term>: cílem je porozumět smyslu, který jednající lidé svému jednání přikládají. ← typová otázka!</>,
      <><Term>Ideální typ</Term> = myšlenkový nástroj, „\1“ model jevu (např. byrokracie), s nímž srovnáváme realitu.</>,
      <>Dílo <B>Protestantská etika a duch kapitalismu</B> (1905): kalvínská víra v predestinaci → askeze, systematická práce, reinvestice zisku → vznik moderního kapitalismu. (Ideje mohou hýbat ekonomikou — obrácený směr než Marx.)</>,
      <>Metodologie sociálních věd: věda má být <B>hodnotově neutrální</B> — popisuje, nehodnotí.</>,
    ]
  },
  {
    name: "Herbert SPENCER", years: "1820–1903", country: "🇬🇧 Anglie", emoji: "🌱",
    tagline: "Evolucionismus",
    points: [
      <>Společnost se vyvíjí <Term>evolučně</Term> jako organismus — od jednoduchých k složitým formám (organicismus).</>,
      <>Spojován se <B>sociálním darwinismem</B> („\1“ přenesené na společnost).</>,
    ]
  },
  {
    name: "Ferdinand TÖNNIES", years: "1855–1936", country: "🇩🇪 Německo", emoji: "🏘️",
    tagline: "Gemeinschaft × Gesellschaft",
    points: [
      <><Term>Gemeinschaft</Term> (pospolitost) = tradiční: osobní, citové vazby, sdílené hodnoty, vesnice.</>,
      <><Term>Gesellschaft</Term> (společnost) = moderní: neosobní, účelové, smluvní vztahy, město.</>,
    ]
  },
  {
    name: "Georg SIMMEL", years: "1858–1918", country: "🇩🇪 Německo", emoji: "💰",
    tagline: "Peníze v moderní společnosti",
    points: [
      <>Analyzoval roli <Term>peněz</Term> v moderní společnosti: peníze zneosobňují vztahy, vše činí směnitelným a vypočitatelným.</>,
    ]
  },
  {
    name: "T. G. MASARYK", years: "1850–1937", country: "🇨🇿 Česko", emoji: "🎓",
    tagline: "Zakladatel české sociologie",
    points: [
      <>První profesor sociologie u nás; sociologická studie <B>Sebevražda</B> (1881) — sebevražednost jako důsledek rozpadu náboženského rámce moderního člověka.</>,
      <>Pozdější první československý prezident.</>,
    ]
  },
];

// ════════════════════════════════════════════════════════════════
// DATA — typové otevřené otázky s modelovými odpověďmi
// ════════════════════════════════════════════════════════════════

const openQuestions = [
  {
    q: "Jaký je rozdíl mezi tradiční a moderní společností?",
    src: "otázka z prezentace (kap. 1)",
    a: <>
      <p style={T.p}><B>Moc a správa:</B> tradiční — dědičná moc, systematická kontrola celého území není možná × moderní — moc v rámci národního státu, formální organizace, jasné hranice, institucionalizace.</p>
      <p style={T.p}><B>Ekonomika:</B> tradiční — zemědělství a řemesla, soběstačnost domácností, nízká směna × moderní — tržní hospodářství, dělba práce/specializace, profesionální byrokracie.</p>
      <p style={T.p}><B>Sociální struktura:</B> tradiční — stavovská, připsaný/pevný status, stálost myšlení a identity × moderní — třídní, pohyblivý status, dynamičnost (časté změny povolání i bydliště).</p>
      <p style={T.p}><B>Výklad světa:</B> tradiční — mytologicko-náboženský rámec, cyklické chápání času, orientace na tradici × moderní — vědecký výklad, pozitivní filosofie, lineární čas, racionalizace.</p>
    </>
  },
  {
    q: "Jaký byl původní účel sociologie? Jaké sociální faktory ovlivnily její vývoj?",
    src: "otázky z prezentace (kap. 1 a 2)",
    a: <>
      <p style={T.p}>Sociologie vznikla v 19. století jako <B>reakce na rozpad tradiční společnosti</B> — průmyslová revoluce, osvícenství a Velká francouzská revoluce rozbily starý řád (komunitu, kastu, stav). Lidé se stěhovali z venkova do měst, mezi cizí lidi; oddělila se práce a volný čas („\1“ architektura továren a činžáků); slábla tradiční sociální kontrola → krize, nejistota, anomie.</p>
      <p style={T.p}>Původním účelem bylo <B>vědecky porozumět nové (moderní) společnosti</B>, vysvětlit, co ji drží pohromadě, a pomoci řešit její krize (Comte: sociologie jako pozitivní věda o společnosti; srovnej s rolí kritického realismu v literatuře — Balzac, Dickens).</p>
    </>
  },
  {
    q: "Co může změnit náš sociální status?",
    src: "otázka z prezentace (kap. 1)",
    a: <>
      <p style={T.p}>Status = majetek + moc + prestiž. Změnit ho může <B>vzdělání, povolání a kariérní postup, zbohatnutí či zchudnutí, sňatek, získání moci či prestiže</B> — tedy <Term>sociální mobilita</Term> (vertikální = vzestup/sestup, horizontální = pohyb na stejné úrovni). V moderní společnosti je status pohyblivý (získaný), v tradiční byl převážně připsaný. Pozor na <Term>nepravou mobilitu</Term>: posune-li se celá společnost, můj status se zdánlivě zvedá, ale relativní postavení se nemění.</p>
    </>
  },
  {
    q: "Dokáže člověk existovat bez společnosti?",
    src: "otázka z prezentace (kap. 3)",
    a: <>
      <p style={T.p}><B>Ne.</B> Keller to ukazuje na <B>Robinsonu Crusoe</B>: přežil sám na ostrově jen díky tomu, že si „\1“ kulturu — vědomosti, návyky a hodnoty naučené v Anglii. Kdyby tam ztroskotal jako malé dítě, stalo by se z něj <B>„\1“</B> neschopné abstraktního myšlení. Člověk se stává člověkem teprve socializací; bez společnosti by ztratil i „\1“ kultury.</p>
    </>
  },
  {
    q: "Jak probíhá proces socializace a jsou sociální role, které se v něm vytváří, prospěšné?",
    src: "otázka z prezentace (kap. 3)",
    a: <>
      <p style={T.p}>Socializací se z biologického tvora stává kulturní bytost: skrze <B>činitele socializace</B> (tradičně rodina, škola, církev; dnes i média, reklama, vrstevníci, politické strany — a ti si často protiřečí: škola říká „\1“, reklama „\1“). Rozlišujeme <B>primární</B> (základní normy) a <B>sekundární</B> (profesní znalosti) socializaci.</p>
      <p style={T.p}>Role jsou prospěšné: díky nim <B>víme, co od druhých čekat</B>, a společnost může fungovat. Mají ale rizika — konflikty mezi rolemi (očekávání učitelů × kamarádů) a krajnosti ztotožnění: naprosté ztotožnění ničí svobodnou vůli („\1“), naprosté odmítání by společnost rozložilo. Řešením je <Term>přiměřená rolová distance</Term>.</p>
    </>
  },
  {
    q: "Jaké jsou vztahy mezi jednotlivcem a skupinou a mezi skupinami navzájem?",
    src: "otázka z prezentace (kap. 3)",
    a: <>
      <p style={T.p}>Jedinec je vždy členem skupin (malé × velké, formální × neformální, primární × sekundární) a skrze ně získává <B>identitu</B>. Ke skupině může mít vztah <B>členský</B> (jsem v ní), <B>referenční</B> (orientuji se na její hodnoty, i když v ní nejsem) nebo se proti ní vymezovat (<B>out-group</B>).</p>
      <p style={T.p}>Mezi skupinami hrozí <B>etnocentrismus, předsudky a xenofobie</B>; řešením je kulturní pluralismus. Současné problémy: oslabení funkčnosti skupin (o životech rozhodují vzdálené síly — burzy, korporace) a sociální izolace (staří, nezaměstnaní, marginalizovaní).</p>
    </>
  },
  {
    q: "Jaké jsou příčiny sociální nerovnosti? Je nerovnost pro společnost ne/výhodná?",
    src: "otázka z prezentace (sociální nerovnost)",
    a: <>
      <p style={T.p}><B>Příčiny:</B> nerovné rozdělení majetku, moci a prestiže; rozdílný přístup ke kapitálům (ekonomickému, sociálnímu, kulturnímu — Bourdieu); dědění výhod v rodině; struktura trhu práce.</p>
      <p style={T.p}><B>Dva pohledy:</B> <Term>strukturní funkcionalismus</Term> (Parsons): nerovnost je funkční a výhodná — motivuje schopné, aby obsazovali náročné a důležité pozice. <Term>Teorie konfliktu</Term>: nerovnost je výsledkem moci a privilegií, plodí napětí; konflikt je ale i motorem změny (Mills: užitečné funkce konfliktu). Příliš velká nerovnost společnost rozkládá (Savage: propast mezi elitou a prekariátem) — proto ji sociální stát skrze sociální práva (Marshall) zmírňuje.</p>
    </>
  },
  {
    q: "Je vzdělání „\1“ / „\1“ proti nerovnosti? Vysvětlete.",
    src: "otázka z prezentace (vzdělání a nerovnost)",
    a: <>
      <p style={T.p}><B>Výtah:</B> demokratizace vzdělání má zajistit, aby sociální původ neměl vliv na dosažené vzdělání — vzdělanější lidé mají v průměru vyšší platy, prestižnější pozice, menší riziko nezaměstnanosti a více autonomie v práci.</p>
      <p style={T.p}><B>Ale škola nerovnost i přenáší:</B> děti z vyšších vrstev zvýhodňuje kulturní kapitál z domova (Bourdieu), volbu školy ovlivňuje ekonomický kapitál rodiny (Boudon) a po studiu pomáhá sociální kapitál (kontakty). Randall Collins: diplomy slouží „\1“ k obsazování privilegovaných pozic (kupování diplomů). Vzdělání tak funguje spíše jako <B>pojistka</B> (od 70. let ve Francii): chrání před pádem dolů, ale vzestup zaručuje méně. Česko má navíc jednu z největších nerovností ve vzdělávání mezi zeměmi OECD (vliv osmiletých gymnázií — rané rozdělování dětí).</p>
    </>
  },
];

// ── typové uzavřené úlohy (přesně podle prezentace) ──
const matchingPairs = [
  { s: "„Právě jsem se vrátil z vězení a snažím si najít práci.“", t: "RESOCIALIZACE", why: "Po vyloučení ze společnosti (vězení) si člověk musí znovu osvojit normy a začlenit se." },
  { s: "„V dnešní době je pro mě jednoduché dostat se k téměř jakékoliv informaci.“", t: "CIVILIZACE", why: "Civilizace díky písmu umožňuje skladovat (a dnes masově sdílet) informace." },
  { s: "„Vím, že se musím starat o své dítě.“", t: "SOCIÁLNÍ ROLE", why: "Očekávané pravidelné jednání spojené s pozicí rodiče." },
  { s: "„Oblékám se jako členové skateboardové komunity, i když mezi ně nepatřím.“", t: "REFERENČNÍ SKUPINA", why: "Orientace na hodnoty a styl skupiny, jejímž členem nejsem." },
  { s: "„Jsme Češi, a proto držíme při sobě.“", t: "KOLEKTIVNÍ IDENTITA", why: "Sdílené vědomí příslušnosti k velké skupině (národu), jejíž členové se navzájem neznají." },
  { s: "„Bílá holubice znamená mír.“", t: "SYMBOL", why: "Symboly umožňují mluvit o věcech, které nevidíme — jádro kultury." },
  { s: "„Jedině naše kuchyně je normální — smažený hmyz je nechutný.“", t: "ETNOCENTRISMUS", why: "Hodnocení cizí kultury výhradně měřítky kultury vlastní." },
  { s: "„Doma mě odmala učili pozdravit a poděkovat.“", t: "PRIMÁRNÍ SOCIALIZACE", why: "Osvojení základních kulturních norem v rodině." },
];

// ════════════════════════════════════════════════════════════════
// TAB: Teorie
// ════════════════════════════════════════════════════════════════

function TheoryTab() {
  return (
    <div>
      <Collapse title="1️⃣ Proč je tady vlastně sociologie" badge="Keller, kap. 1" defaultOpen>
        <h3 style={T.h3}>Vznik sociologie</h3>
        <p style={T.p}>Sociologie vznikla v 19. století jako reakce na přechod od <B>tradiční</B> k <B>moderní</B> společnosti. Průmyslová revoluce a osvícenství rozbily tradiční opory života — <B>komunitu, kastu, stav</B>. Lidé se stěhovali: <B>venkov → město</B>, od <B>domácích</B> k <B>cizím</B>; oddělila se <B>práce a volný čas</B>; vyrostla „\1“ architektura (činžáky, továrny). Slábla tradiční <Term>sociální kontrola</Term>.</p>
        <p style={T.p}>Na tuto krizi reagují zakladatelé: <B>Auguste Comte</B> (sociologie jako pozitivní věda), <B>Émile Durkheim</B> (pojem <Term>anomie</Term> — staré normy přestaly platit a nové ještě nejsou ustaveny) a <B>Karel Marx</B> (konflikt tříd).</p>

        <h3 style={T.h3}>Tradiční × moderní společnost (tabulka z pracovního listu HSt 6)</h3>
        <CompareTable leftTitle="TRADIČNÍ společnost" rightTitle="MODERNÍ společnost" rows={[
          ["Moc a správa", "dědičná moc; systematická kontrola celého území není možná", "mocenský rámec vytváří národní stát; formální organizace; jasné hranice států; institucionalizace"],
          ["Ekonomika", "zemědělství a řemeslná výroba; hospodářská soběstačnost domácností; nízká směna", "tržní hospodářství; dělba práce / specializace; profesionální byrokracie"],
          ["Sociální struktura", "stavovská struktura; připsaný / pevný status; stálost myšlení — stálá identita jedinců", "třídní struktura; pohyblivý status; dynamičnost (časté změny povolání, bydliště)"],
          ["Výklad světa", "mytologický / náboženský rámec; cyklické chápání času; orientace na tradici", "vědecký výklad; pozitivní filosofie; lineární chápání času; racionalizace"],
        ]} />

        <h3 style={T.h3}>Status, stratifikace, mobilita</h3>
        <ul style={{ paddingLeft: "20px", margin: 0 }}>
          <li style={T.li}><Term>Sociální status</Term> = postavení ve společnosti; složky: <B>majetek – moc – prestiž</B>. Připsaný × získaný.</li>
          <li style={T.li}><Term>Sociální stratifikace</Term> = rozvrstvení společnosti (vrstvy, třídy) → <Term>sociální nerovnosti</Term>.</li>
          <li style={T.li}><Term>Sociální mobilita</Term> = pohyb mezi pozicemi: <B>vertikální</B> (vzestup/sestup) × <B>horizontální</B> (stejná úroveň).</li>
          <li style={T.li}><Term>Nepravá mobilita</Term> = status se zdánlivě zvyšuje (roste celá společnost), ale relativní postavení vůči ostatním se nemění.</li>
          <li style={T.li}><Term>Sociální role</Term> = očekávané jednání spojené s pozicí (podrobně kap. 3).</li>
        </ul>
      </Collapse>

      <Collapse title="2️⃣ Jak se sociologie vyvíjela" badge="Keller, kap. 2">
        <h3 style={T.h3}>Klasická sociologie — velké teorie × empirický výzkum</h3>
        <ul style={{ paddingLeft: "20px", margin: 0 }}>
          <li style={T.li}><B>Tönnies:</B> tradiční pospolitost (<Term>Gemeinschaft</Term>) × moderní společnost (<Term>Gesellschaft</Term>).</li>
          <li style={T.li}><B>Durkheim:</B> <Term>mechanická solidarita</Term> (soudržnost z podobnosti — tradiční) × <Term>organická solidarita</Term> (soudržnost z odlišnosti díky <B>dělbě práce</B> — moderní).</li>
          <li style={T.li}><B>Simmel:</B> role <Term>peněz</Term> v moderní společnosti — zneosobňují a zvypočitatelňují vztahy.</li>
        </ul>

        <h3 style={T.h3}>Hlavní směry 20. století</h3>
        <ul style={{ paddingLeft: "20px", margin: 0 }}>
          <li style={T.li}><Term>Strukturní funkcionalismus</Term> (Talcott Parsons) — konsensuální teorie: společnost je systém, jehož části plní funkce; řád stojí na sdílených hodnotách.</li>
          <li style={T.li}><Term>Sociologie konfliktu</Term> (Ch. W. Mills) — společnost utvářejí konflikty o zdroje a moc; konflikt má i <B>užitečné funkce</B> (vynucuje změnu).</li>
          <li style={T.li}><Term>Interpretativní sociologie / symbolický interakcionismus</Term> — společnost se tvoří v každodenní interakci; klíčovou roli hraje <B>jazyk</B> a významy.</li>
          <li style={T.li}><Term>Teorie sociální směny</Term> — jednání jako výměna odměn a nákladů.</li>
          <li style={T.li}>→ Sociologie je <Term>multiparadigmatická</Term>: žádné paradigma nevysvětlí společnost samo. Zkoumá <B>normy, hodnoty, instituce</B>.</li>
        </ul>

        <h3 style={T.h3}>Znaky moderní společnosti (GIFR)</h3>
        <ul style={{ paddingLeft: "20px", margin: 0 }}>
          <li style={T.li}><Term>Generalizace</Term> — normy a pravidla platí obecně, pro všechny stejně.</li>
          <li style={T.li}><Term>Individualizace</Term> — jedinec se vyvazuje z tradičních vazeb, sám volí svou dráhu.</li>
          <li style={T.li}><Term>Funkční diferenciace</Term> — společnost se dělí na specializované subsystémy (ekonomika, právo, věda…).</li>
          <li style={T.li}><Term>Racionalizace</Term> — jednání se řídí účelností a vypočitatelností.</li>
        </ul>
      </Collapse>

      <Collapse title="3️⃣ Co (například) tvrdí sociologie" badge="Keller, kap. 3 — tvoje výpisky">
        <h3 style={T.h3}>Dokáže člověk existovat bez společnosti? NE.</h3>
        <p style={T.p}><B>Robinson Crusoe</B> přežil sám na ostrově jen proto, že si „\1“ svou kulturu — vědomosti, návyky a hodnoty z Anglie. Kdyby ztroskotal jako malé dítě, stalo by se z něj <B>„\1“</B> neschopné abstraktního myšlení.</p>

        <h3 style={T.h3}>Kultura × civilizace</h3>
        <ul style={{ paddingLeft: "20px", margin: 0 }}>
          <li style={T.li}><Term>Kultura</Term> (širší pojem) = vše, čím se lišíme od zvířat: normy, jazyk, vědění, zvyky odívání, stolování, bydlení, obřady, náboženské představy. Klíčové jsou <B>symboly</B> — umožňují mluvit o minulosti, budoucnosti a o věcech, které nevidíme.</li>
          <li style={T.li}><Term>Civilizace</Term> (užší pojem) vzniká, když společnost má: <B>1) písmo</B> (skladování informací), <B>2) město</B> (prostorové vymezení vztahů — hradby, tržiště, fórum), <B>3) stát</B> (monopol na legitimní použití násilí).</li>
          <li style={T.li}><B>Kritika civilizace:</B> dala nám mocné nástroje, ale málo moudrosti o cílech → civilizační rizika (ekologické problémy, zbraně hromadného ničení).</li>
        </ul>

        <h3 style={T.h3}>Socializace</h3>
        <ul style={{ paddingLeft: "20px", margin: 0 }}>
          <li style={T.li}>Proces, při kterém se z biologického tvora stává <B>kulturní bytost</B>. Bez ní by společnost ztratila „\1“.</li>
          <li style={T.li}><B>Činitelé:</B> tradičně rodina, škola, církev; moderně + média, reklama, politické strany, vrstevníci. Problém: činitelé si <B>protiřečí</B> (škola: „\1“ × reklama: „\1“).</li>
          <li style={T.li}><Term>Primární</Term> socializace = základní kulturní normy. <Term>Sekundární</Term> = profesní znalosti pro trh práce. <Term>Resocializace</Term> = nové začlenění (po vězení, nemoci…).</li>
        </ul>

        <h3 style={T.h3}>Sociální kontrola</h3>
        <p style={T.p}>Škála metod: <B>otevřené donucení</B> (tradiční společnosti) → <B>skryté formy manipulace</B> (moderní společnost). <Term>Internalizace</Term> = člověk přijme normy „\1“ a dodržuje je dobrovolně. Pozor na manipulativní prvky reklamy, médií a propagandy!</p>

        <h3 style={T.h3}>Sociální role</h3>
        <ul style={{ paddingLeft: "20px", margin: 0 }}>
          <li style={T.li}>Pravidelnosti v jednání spojené s pozicí — díky nim <B>víme, co od druhých čekat</B>.</li>
          <li style={T.li}><Term>Připsané</Term> (nelze odmítnout: věk, pohlaví, národnost) × <Term>získané</Term> (vydobyté: uznání, majetek) × <Term>vnucené</Term> (přidělené bez přičinění: nezaměstnaný, bezdomovec).</li>
          <li style={T.li}><B>Problémy:</B> konflikty mezi rolemi (učitelé × kamarádi); míra ztotožnění — naprosté ztotožnění = ztráta svobodné vůle („\1“) × naprosté odmítání = rozpad společnosti. Řešení: <Term>přiměřená rolová distance</Term>.</li>
        </ul>

        <h3 style={T.h3}>Skupiny</h3>
        <ul style={{ paddingLeft: "20px", margin: 0 }}>
          <li style={T.li}><B>Podle velikosti:</B> malé (do desítek členů, vztahy tváří v tvář) × velké (národ — členové se neznají, sdílejí identitu).</li>
          <li style={T.li}><B>Podle formálnosti:</B> formální (školy, firmy, úřady — psaná pravidla) × neformální (rodina, parta — nepsaná pravidla).</li>
          <li style={T.li}><B>Podle vztahu člověka:</B> členská × <Term>referenční</Term> (orientuji se na její hodnoty, i když v ní nejsem) × <Term>out-group</Term> (vymezuji se proti ní). Dále primární × sekundární. Skupiny dávají <B>identitu</B>.</li>
          <li style={T.li}><B>Současné problémy:</B> oslabení funkčnosti skupin (rozhodují vzdálené síly — burzy, nadnárodní korporace) a sociální izolace (staří, nezaměstnaní, marginalizovaní).</li>
        </ul>

        <h3 style={T.h3}>Masová média a masová kultura</h3>
        <ul style={{ paddingLeft: "20px", margin: 0 }}>
          <li style={T.li}><B>Optimisté:</B> osvěta, informace, kulturní zážitky × <B>kritici:</B> manipulace, pasivní zábava nízké kvality.</li>
          <li style={T.li}><Term>Dvoustupňový model komunikace:</Term> média → publikum (informace); <B>názoroví vůdci</B> → publikum (postoje). Nejsme bezbranní — vliv médií filtrují malé skupiny.</li>
          <li style={T.li}><B>Problémy:</B> děti znají svět celebrit lépe než realitu, která je čeká; mozaika vytržených informací bez kontextu; <Term>pseudoudálosti</Term> vytlačují podstatné zprávy; život ve virtuální realitě.</li>
        </ul>

        <h3 style={T.h3}>Předsudky a etnocentrismus</h3>
        <ul style={{ paddingLeft: "20px", margin: 0 }}>
          <li style={T.li}><Term>Etnocentrismus</Term> = hodnocení všeho jen z pozice vlastní kultury („\1“). <Term>Předsudek</Term> = apriorní negativní obraz o jednotlivci/skupině. <Term>Xenofobie</Term> = odpor ke všemu cizímu.</li>
          <li style={T.li}><B>Kdo trpí předsudky:</B> lidé nejistí vlastní pozicí, málo úspěšní, s problémy s identitou. Historicky diskriminovali bílí, majetní, vzdělaní muži (ženy, chudé, jiné rasy).</li>
          <li style={T.li}><B>Řešení — kulturní pluralismus:</B> všechny kultury jsou rovnocenné; postmodernismus zdůrazňuje relativnost pravd; hodnoty jiných kultur je třeba ocenit, ne je mít za „\1“.</li>
        </ul>
      </Collapse>

      <Collapse title="4️⃣ Sociální nerovnost a kapitály" badge="Keller, kap. 4 + článek o Savageovi (HSt 1)">
        <h3 style={T.h3}>Dva pohledy na nerovnost</h3>
        <CompareTable leftTitle="Strukturní funkcionalismus (Parsons)" rightTitle="Teorie konfliktu" rows={[
          ["nerovnost je funkční a užitečná — odměny motivují schopné k obsazení náročných pozic", "nerovnost plyne z moci a privilegií; konflikt o zdroje je motorem změny (Mills: užitečné funkce konfliktu)"],
        ]} />
        <ul style={{ paddingLeft: "20px", margin: 0 }}>
          <li style={T.li}><Term>Sociální vrstvy / třídy</Term>, <Term>střední třída</Term>, <Term>sociální status</Term> — klíčové pojmy stratifikace.</li>
          <li style={T.li}><Term>Sociální stát</Term> zmírňuje nerovnosti; opírá se o <Term>sociální práva</Term> — <B>T. H. Marshall: Občanství a sociální třída (1950)</B>: občanská → politická → sociální práva.</li>
        </ul>

        <h3 style={T.h3}>Pierre Bourdieu — druhy kapitálu (70. léta 20. stol.)</h3>
        <ul style={{ paddingLeft: "20px", margin: 0 }}>
          <li style={T.li}><Term>Ekonomický kapitál</Term> = majetek, příjmy.</li>
          <li style={T.li}><Term>Sociální kapitál</Term> = kontakty, vazby, známosti.</li>
          <li style={T.li}><Term>Kulturní kapitál</Term> = vzdělání, přehled, vkus — tři podoby: <B>vtělený</B> (v hlavě a těle), <B>objektivizovaný</B> (knihy, obrazy, nástroje), <B>institucionalizovaný</B> (diplomy, tituly).</li>
        </ul>

        <h3 style={T.h3}>Mike Savage — „\1“ (článek z Respektu)</h3>
        <ul style={{ paddingLeft: "20px", margin: 0 }}>
          <li style={T.li}>Kniha <B>Social Class in the 21st Century</B> (2015); vychází z <B>Great British Class Survey</B> (Velký britský třídní výzkum, BBC).</li>
          <li style={T.li}>Třídy <B>nezmizely</B> — jen je nelze měřit pouze příjmem. Savage popsal <B>7 tříd</B> podle kombinace ekonomického, sociálního a kulturního kapitálu (navazuje na Bourdieua).</li>
          <li style={T.li}>Na vrcholu <Term>elita</Term> (~6 % obyvatel, všechny kapitály, od ostatních ji dělí téměř nepřekonatelná propast — ředitelé, právníci, bankéři, lékaři); na dně <Term>prekariát</Term> (~15 %, nedostatek všech druhů kapitálu — nejisté úvazky, žádné úspory).</li>
          <li style={T.li}>„\1“ — skryté nerovnosti pomáhají pochopit úspěch populistů (Johnson, Trump).</li>
          <li style={T.li}>Pro Česko obdobně <B>Daniel Prokop: Rozděleni svobodou</B> — šest společenských tříd ČR podle tří druhů kapitálu.</li>
        </ul>

        <h3 style={T.h3}>Vzdělání jako pojistka proti nerovnosti?</h3>
        <ul style={{ paddingLeft: "20px", margin: 0 }}>
          <li style={T.li}><B>Vzdělanostní společnost / společnost osvědčení:</B> diplomy rozhodují o přístupu k privilegovaným pozicím. Lidé s vyšším vzděláním mají v průměru vyšší plat, prestižnější pozice, menší nezaměstnanost, více autonomie.</li>
          <li style={T.li}><B>Demokratizace vzdělání:</B> sociální původ nemá mít vliv na dosažené vzdělání — škola jako „\1“.</li>
          <li style={T.li}><B>Polemika:</B> <Term>Bourdieu</Term> — kulturní kapitál z domova zvýhodňuje děti vyšších vrstev ve škole × <Term>Boudon</Term> — ekonomický kapitál ovlivňuje volbu školy. Sociální kapitál zvýhodňuje po studiu.</li>
          <li style={T.li}><B>Randall Collins:</B> produktivní třída × politická třída (rozděluje bohatství; „\1“).</li>
          <li style={T.li}>Vzdělání od 70. let (Francie) spíš <B>pojištění</B> proti pádu než výtah vzhůru. Česko má jednu z největších nerovností ve vzdělávání v OECD (rané dělení dětí — osmiletá gymnázia).</li>
        </ul>
      </Collapse>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// TAB: Osobnosti
// ════════════════════════════════════════════════════════════════

function PersonsTab() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "14px" }}>
      {persons.map((p, i) => (
        <div key={i} style={{ ...glass, padding: "20px", animation: `slideIn 0.5s ease ${i * 0.08}s both` }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
            <span style={{ fontSize: "28px" }}>{p.emoji}</span>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: "17px" }}>{p.name}</div>
              <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "13px" }}>{p.years} · {p.country}</div>
            </div>
          </div>
          <div style={{ color: ACCENT, fontSize: "13.5px", fontWeight: 600, margin: "6px 0 10px" }}>{p.tagline}</div>
          <ul style={{ paddingLeft: "18px", margin: 0 }}>
            {p.points.map((pt, j) => <li key={j} style={{ ...T.li, fontSize: "14px" }}>{pt}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// TAB: Typové otázky
// ════════════════════════════════════════════════════════════════

function TypoveTab() {
  return (
    <div>
      <div style={{ ...glass, padding: "16px 20px", marginBottom: "16px", borderColor: ACCENT + "55" }}>
        <p style={{ ...T.p, margin: 0 }}>⚠️ <B>Tyto úlohy jsou přímo z prezentace p. profesorky</B> („\1“) + otevřené otázky z jednotlivých kapitol. Odpovědi jsou skryté — nejdřív si je zkus zodpovědět sám!</p>
      </div>

      <Collapse title="Úloha 1 — výběr z možností (Marx)" badge="přesně z prezentace" defaultOpen>
        <p style={T.p}>Které z následujících hledisek bylo dominantní v Marxově rozdělení společnosti do tříd?</p>
        <p style={T.p}>A) míra politického vlivu&nbsp;&nbsp;&nbsp;B) prestiž povolání&nbsp;&nbsp;&nbsp;C) míra vzdělanosti&nbsp;&nbsp;&nbsp;D) vztah k výrobním prostředkům</p>
        <Reveal label="Zobrazit řešení">
          <p style={{ ...T.p, margin: 0 }}><B>D) vztah k výrobním prostředkům.</B> Buržoazie výrobní prostředky vlastní, proletariát prodává svou pracovní sílu. Politický vliv, prestiž a vzdělání jsou hlediska jiných teorií stratifikace (Weber, funkcionalismus, Bourdieu).</p>
        </Reveal>
      </Collapse>

      <Collapse title="Úloha 2 — práce s výchozím textem" badge="přesně z prezentace">
        <p style={{ ...T.p, fontStyle: "italic", background: "rgba(255,255,255,0.04)", padding: "12px 14px", borderRadius: "10px" }}>„\1“ (www.socioweb.cz)</p>
        <p style={T.p}>Jaký proces popisuje výchozí text?</p>
        <p style={T.p}>A) socializaci&nbsp;&nbsp;&nbsp;B) vznik legitimity vlády&nbsp;&nbsp;&nbsp;C) sociální kontrolu&nbsp;&nbsp;&nbsp;D) vznik veřejného mínění</p>
        <Reveal label="Zobrazit řešení">
          <p style={{ ...T.p, margin: 0 }}><B>A) socializaci.</B> Klíč: „\1“ = stávání se kulturní bytostí. Sociální kontrola by zdůrazňovala vynucování norem, ne učení.</p>
        </Reveal>
      </Collapse>

      <Collapse title="Úloha 3 — přiřaď pojem/spis k sociologovi" badge="přesně z prezentace">
        <p style={T.p}>Ke každému sociologickému pojmu/názvu spisu uveď sociologa, který ho vyložil/napsal:</p>
        <ul style={{ paddingLeft: "20px", margin: 0 }}>
          <li style={T.li}>Kapitál — ?</li>
          <li style={T.li}>chápající sociologie — ?</li>
          <li style={T.li}>pozitivní věda — ?</li>
        </ul>
        <Reveal label="Zobrazit řešení">
          <ul style={{ paddingLeft: "20px", margin: 0 }}>
            <li style={T.li}><B>Kapitál → Karel Marx</B></li>
            <li style={T.li}><B>chápající sociologie → Max Weber</B></li>
            <li style={T.li}><B>pozitivní věda → Auguste Comte</B></li>
          </ul>
          <p style={{ ...T.p, marginTop: "8px", marginBottom: 0 }}>Dál se může hodit: anomie / Společenská dělba práce → Durkheim; Gemeinschaft–Gesellschaft → Tönnies; Protestantská etika a duch kapitalismu → Weber; druhy kapitálu → Bourdieu; Sebevražda (česká) → Masaryk.</p>
        </Reveal>
      </Collapse>

      <Collapse title="Úloha 4 — spoj pojem s výrokem (např. 8e)" badge="rozšířeno podle prezentace">
        <p style={T.p}>Pojmy: a) REFERENČNÍ SKUPINA · b) KOLEKTIVNÍ IDENTITA · c) SOCIÁLNÍ ROLE · d) RESOCIALIZACE · e) CIVILIZACE · f) SYMBOL · g) ETNOCENTRISMUS · h) PRIMÁRNÍ SOCIALIZACE</p>
        {matchingPairs.map((m, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "12px 14px", marginBottom: "10px" }}>
            <p style={{ ...T.p, fontStyle: "italic", marginBottom: "4px" }}>{i + 1}) {m.s}</p>
            <Reveal label="Zobrazit pojem">
              <p style={{ ...T.p, margin: 0 }}><B>{m.t}</B> — {m.why}</p>
            </Reveal>
          </div>
        ))}
      </Collapse>

      <div style={{ ...glass, padding: "16px 20px", margin: "20px 0 14px" }}>
        <h2 style={{ ...T.h2, margin: 0, fontSize: "18px" }}>✍️ Otevřené otázky z prezentace — s modelovými odpověďmi</h2>
      </div>

      {openQuestions.map((oq, i) => (
        <Collapse key={i} title={oq.q} badge={oq.src}>
          <Reveal label="Zobrazit modelovou odpověď">{oq.a}</Reveal>
        </Collapse>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// TAB: Flashcards
// ════════════════════════════════════════════════════════════════

function FlashcardsTab() {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = flashcards[idx];

  const go = (d) => {
    setFlipped(false);
    setIdx(i => (i + d + flashcards.length) % flashcards.length);
  };

  return (
    <div style={{ maxWidth: "560px", margin: "0 auto", padding: "8px" }}>
      <div onClick={() => setFlipped(f => !f)} style={{ perspective: "1200px", cursor: "pointer", minHeight: "300px" }}>
        <div style={{
          position: "relative", width: "100%", minHeight: "300px",
          transformStyle: "preserve-3d", transition: "transform 0.4s ease",
          transform: flipped ? "rotateY(180deg)" : "none",
        }}>
          <div style={{ ...glass, position: "absolute", inset: 0, backfaceVisibility: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "28px", textAlign: "center" }}>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "14px" }}>pojem — klikni pro definici</div>
            <div style={{ color: ACCENT, fontSize: "24px", fontWeight: 800, lineHeight: 1.3 }}>{card.front}</div>
          </div>
          <div style={{ ...glass, position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", display: "flex", alignItems: "center", justifyContent: "center", padding: "28px", borderColor: ACCENT + "66" }}>
            <div style={{ color: "rgba(255,255,255,0.88)", fontSize: "15.5px", lineHeight: 1.6, textAlign: "center" }}>{card.back}</div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "18px" }}>
        <button onClick={() => go(-1)} style={{ ...QS.btn, marginTop: 0 }}>← Předchozí</button>
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>{idx + 1} / {flashcards.length}</span>
        <button onClick={() => go(1)} style={{ ...QS.btn, marginTop: 0 }}>Další →</button>
      </div>

      <div style={{ display: "flex", gap: "6px", justifyContent: "center", flexWrap: "wrap", marginTop: "14px" }}>
        {flashcards.map((_, i) => (
          <div key={i} onClick={() => { setIdx(i); setFlipped(false); }}
            style={{ width: "10px", height: "10px", borderRadius: "50%", cursor: "pointer", transition: "background 0.4s ease", background: i === idx ? ACCENT : "rgba(255,255,255,0.18)" }} />
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// TAB: Tahák
// ════════════════════════════════════════════════════════════════

function CheatRow({ k, v }) {
  return (
    <div style={{ display: "flex", gap: "12px", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ minWidth: "190px", color: ACCENT, fontWeight: 700, fontSize: "13.5px", fontFamily: "'JetBrains Mono', monospace" }}>{k}</div>
      <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "13.5px", lineHeight: 1.55 }}>{v}</div>
    </div>
  );
}

function CheatBlock({ title, children }) {
  return (
    <div style={{ ...glass, padding: "18px 22px", marginBottom: "14px" }}>
      <div style={{ color: "#fff", fontWeight: 700, fontSize: "16px", marginBottom: "8px" }}>{title}</div>
      {children}
    </div>
  );
}

function CheatTab() {
  return (
    <div>
      <CheatBlock title="🧠 Pojmy, které MUSÍŠ umět">
        <CheatRow k="socializace" v="z biologického tvora kulturní bytost; primární (základní normy) × sekundární (profese); resocializace = nové začlenění (vězení)" />
        <CheatRow k="internalizace" v="přijmu normy „za své“ → dodržuji dobrovolně (nejúčinnější sociální kontrola)" />
        <CheatRow k="anomie (Durkheim)" v="staré normy už neplatí, nové ještě nejsou" />
        <CheatRow k="kultura × civilizace" v="kultura = vše, čím se lišíme od zvířat (symboly!); civilizace = PÍSMO + MĚSTO + STÁT" />
        <CheatRow k="sociální status" v="MAJETEK + MOC + PRESTIŽ; připsaný × získaný" />
        <CheatRow k="mobilita" v="vertikální (nahoru/dolů) × horizontální; nepravá = zdánlivá (posun celku)" />
        <CheatRow k="role" v="připsané (věk, pohlaví) × získané (vydobyté) × vnucené (nezaměstnaný); řešení extrémů = rolová distance" />
        <CheatRow k="skupiny" v="malé×velké; formální×neformální; členská×referenční×out-group; primární×sekundární" />
        <CheatRow k="média" v="dvoustupňový model: média→informace, názoroví vůdci→postoje; pseudoudálosti" />
        <CheatRow k="etnocentrismus" v="vlastní kultura jako jediná správná; předsudek = apriorní negativní obraz; xenofobie = odpor k cizímu; řešení = kulturní pluralismus" />
      </CheatBlock>

      <CheatBlock title="👤 Kdo – co – dílo (přiřazování!)">
        <CheatRow k="Comte (1798–1857) 🇫🇷" v="pojem sociologie, pozitivní věda, zákon tří stadií (teologické→metafyzické→pozitivní); Kurs pozitivní filosofie" />
        <CheatRow k="Marx (1818–1883) 🇩🇪" v="KAPITÁL; konflikt; třídy podle vztahu k výrobním prostředkům; odcizení; historický materialismus" />
        <CheatRow k="Durkheim (1858–1917) 🇫🇷" v="anomie; mechanická × organická solidarita; Společenská dělba práce; sociální fakta" />
        <CheatRow k="Weber (1864–1920) 🇩🇪" v="CHÁPAJÍCÍ sociologie; ideální typ; hodnotová neutralita; Protestantská etika a duch kapitalismu (1905)" />
        <CheatRow k="Spencer (1820–1903) 🇬🇧" v="evolucionismus, organicismus" />
        <CheatRow k="Tönnies 🇩🇪" v="Gemeinschaft (pospolitost) × Gesellschaft (společnost)" />
        <CheatRow k="Simmel 🇩🇪" v="peníze v moderní společnosti" />
        <CheatRow k="Masaryk 🇨🇿" v="první český sociolog; Sebevražda (1881)" />
        <CheatRow k="Parsons" v="strukturní funkcionalismus (konsensus; nerovnost motivuje)" />
        <CheatRow k="Mills" v="sociologie konfliktu (užitečné funkce konfliktu)" />
        <CheatRow k="Marshall" v="Občanství a sociální třída (1950) — sociální práva" />
        <CheatRow k="Bourdieu (70. léta)" v="kapitál ekonomický + sociální + kulturní (vtělený / objektivizovaný / institucionalizovaný)" />
        <CheatRow k="Boudon" v="volbu školy ovlivňuje ekonomický kapitál (polemika s Bourdieuem)" />
        <CheatRow k="Collins" v="produktivní × politická třída (kupování diplomů)" />
        <CheatRow k="Savage (2015)" v="Social Class in the 21st Century; Great British Class Survey; 7 tříd; elita ~6 % × prekariát ~15 %" />
        <CheatRow k="Prokop" v="Rozděleni svobodou — 6 tříd české společnosti" />
        <CheatRow k="Keller" v="autor učebnice :)" />
      </CheatBlock>

      <CheatBlock title="⚖️ Tradiční × moderní společnost (4 oblasti)">
        <CheatRow k="moc a správa" v="dědičná moc, bez kontroly území × národní stát, formální organizace, instituce" />
        <CheatRow k="ekonomika" v="zemědělství, soběstačnost, nízká směna × trh, dělba práce, byrokracie" />
        <CheatRow k="sociální struktura" v="stavy, připsaný status, stálost × třídy, pohyblivý status, dynamičnost" />
        <CheatRow k="výklad světa" v="mýtus/náboženství, cyklický čas, tradice × věda, lineární čas, racionalizace" />
        <CheatRow k="znaky moderní spol." v="GIFR: Generalizace · Individualizace · Funkční diferenciace · Racionalizace" />
      </CheatBlock>

      <CheatBlock title="💡 Mnemotechniky">
        <CheatRow k="MMP" v="status = Majetek, Moc, Prestiž" />
        <CheatRow k="Písmo–Město–Stát" v="tři znaky civilizace" />
        <CheatRow k="T-M-P" v="Comte: Teologické → Metafyzické → Pozitivní („Tři Mušketýři Pijou“)" />
        <CheatRow k="EKS" v="Bourdieu: Ekonomický, Kulturní, Sociální kapitál" />
        <CheatRow k="organická = orgány" v="Durkheim: moderní solidarita — každý dělá něco jiného, nikdo nepřežije sám" />
        <CheatRow k="Kapitál→Marx" v="chápající sociologie→Weber; pozitivní věda→Comte (typová otázka!)" />
      </CheatBlock>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// APP
// ════════════════════════════════════════════════════════════════

const TABS = [
  { id: "teorie", label: "📖 Teorie", comp: TheoryTab },
  { id: "osobnosti", label: "👤 Osobnosti", comp: PersonsTab },
  { id: "typove", label: "✍️ Typové otázky", comp: TypoveTab },
  { id: "kviz", label: "🎯 Kvíz", comp: () => <QuizEngine questions={quizQuestions} accentColor={ACCENT} /> },
  { id: "karticky", label: "🃏 Kartičky", comp: FlashcardsTab },
  { id: "tahak", label: "📋 Tahák", comp: CheatTab },
];

export default function App() {
  const [tab, setTab] = useState("teorie");
  const Active = TABS.find(t => t.id === tab).comp;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a1a", fontFamily: "'Inter', 'Segoe UI', sans-serif", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap');
        @keyframes float1 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(40px,-30px) scale(1.1); } }
        @keyframes float2 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-50px,40px) scale(0.95); } }
        @keyframes float3 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(30px,50px) scale(1.05); } }
        @keyframes pulse  { 0%,100% { opacity: 0.5; } 50% { opacity: 0.9; } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        button:disabled { opacity: 0.35; cursor: default; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }
      `}</style>

      {/* floating gradient circles background */}
      <div style={{ position: "fixed", top: "-120px", left: "-100px", width: "420px", height: "420px", borderRadius: "50%", background: "radial-gradient(circle, rgba(168,85,247,0.22), transparent 70%)", filter: "blur(60px)", animation: "float1 16s ease-in-out infinite, pulse 14s ease-in-out infinite", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "-140px", right: "-120px", width: "480px", height: "480px", borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.18), transparent 70%)", filter: "blur(70px)", animation: "float2 19s ease-in-out infinite, pulse 17s ease-in-out infinite", pointerEvents: "none" }} />
      <div style={{ position: "fixed", top: "35%", left: "55%", width: "360px", height: "360px", borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.14), transparent 70%)", filter: "blur(65px)", animation: "float3 13s ease-in-out infinite, pulse 12s ease-in-out infinite", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "960px", margin: "0 auto", padding: "28px 18px 60px" }}>
        {/* header */}
        <div style={{ textAlign: "center", marginBottom: "24px", animation: "slideIn 0.5s ease both" }}>
          <h1 style={{ color: "#fff", fontSize: "30px", fontWeight: 800, margin: "0 0 6px" }}>
            Sociologie <span style={{ background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT2})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>— příprava na test</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14.5px", margin: 0 }}>
            Keller kap. 1–4 · klasici sociologie · sociální nerovnost · typové otázky z prezentace
          </p>
        </div>

        {/* tab bar */}
        <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap", marginBottom: "26px" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{
                padding: "10px 18px", borderRadius: "999px", fontSize: "14.5px", fontWeight: 600,
                cursor: "pointer", transition: "all 0.4s ease",
                background: tab === t.id ? `linear-gradient(90deg, ${ACCENT}cc, ${ACCENT2}cc)` : "rgba(255,255,255,0.06)",
                border: tab === t.id ? `1px solid ${ACCENT}` : "1px solid rgba(255,255,255,0.12)",
                color: tab === t.id ? "#0a0a1a" : "rgba(255,255,255,0.75)",
              }}>
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ animation: "slideIn 0.5s ease both" }} key={tab}>
          <Active />
        </div>
      </div>
    </div>
  );
}
