// @title Anglické členy — příprava na test
// @subject Languages
// @topic Anglické členy (Articles)
// @template study-app

import { useState, useMemo, useCallback } from "react";

// ════════════════════════════════════════════════════════════════
// QUIZ ENGINE (inline copy)
// ════════════════════════════════════════════════════════════════

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function shuffleQuestions(qs) {
  return qs.map(q => {
    const idx = shuffleArray(q.options.map((_, i) => i));
    return { ...q, options: idx.map(i => q.options[i]), correct: q.correct.map(o => idx.indexOf(o)) };
  });
}

function arrEq(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  return [...a].sort().every((v, i) => v === [...b].sort()[i]);
}

function QuizEngine({ questions, accentColor = "#22c55e" }) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState({});
  const [pending, setPending] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [sk, setSk] = useState(0);

  const sqs = useMemo(() => shuffleQuestions(questions), [questions, sk]);
  const q = sqs[idx];
  const isMulti = q.type === "multi";
  const isRev = !!revealed[idx];
  const myAns = answers[idx] || [];
  const isOk = isRev && arrEq(myAns, q.correct);
  const score = sqs.filter((_, i) => revealed[i] && arrEq(answers[i] || [], sqs[i].correct)).length;
  const pct = Math.round(score / sqs.length * 100);

  const goTo = useCallback(i => {
    setIdx(i);
    setPending(sqs[i].type === "multi" ? (answers[i] || []) : []);
  }, [answers, sqs]);

  const pick1 = useCallback(i => {
    if (isRev) return;
    setAnswers(p => ({ ...p, [idx]: [i] }));
    setRevealed(p => ({ ...p, [idx]: true }));
  }, [idx, isRev]);

  const toggleM = useCallback(i => {
    if (isRev) return;
    setPending(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i]);
  }, [isRev]);

  const submitM = useCallback(() => {
    if (!pending.length) return;
    setAnswers(p => ({ ...p, [idx]: [...pending] }));
    setRevealed(p => ({ ...p, [idx]: true }));
  }, [idx, pending]);

  const restart = useCallback(() => {
    setIdx(0); setAnswers({}); setRevealed({}); setPending([]);
    setShowResults(false); setSk(k => k + 1);
  }, []);

  const active = isMulti ? (isRev ? myAns : pending) : myAns;
  const ac = accentColor;

  const btnBase = { padding: "10px 22px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", color: "#fff", cursor: "pointer", fontSize: "15px", transition: "all 0.4s ease" };

  if (showResults) {
    const msg = pct >= 90 ? "Výborně! Máš to perfektně!" : pct >= 70 ? "Dobře! Skoro tam." : pct >= 50 ? "Jdeš správným směrem." : "Potřebuješ více opakování.";
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "300px" }}>
        <div style={{ textAlign: "center", background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "24px", padding: "40px 48px" }}>
          <div style={{ color: "#fff", fontSize: "56px", fontWeight: 800, lineHeight: 1 }}>{score}/{sqs.length}</div>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "24px", margin: "8px 0 16px" }}>{pct}%</div>
          <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "17px", marginBottom: "24px" }}>{msg}</div>
          <button style={{ ...btnBase, background: ac + "55", border: `1px solid ${ac}` }} onClick={restart}>Začít znovu</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "680px", margin: "0 auto" }}>
      <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
        {sqs.map((_, i) => {
          let bg = "#374151";
          if (i === idx) bg = ac;
          else if (revealed[i]) bg = arrEq(answers[i] || [], sqs[i].correct) ? "#22c55e" : "#ef4444";
          return <div key={i} onClick={() => goTo(i)} title={`Otázka ${i + 1}`} style={{ width: 22, height: 22, borderRadius: "50%", cursor: "pointer", background: bg, transition: "background 0.4s ease" }} />;
        })}
      </div>
      <div style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "24px", transition: "all 0.4s ease" }}>
        <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", marginBottom: "6px" }}>Otázka {idx + 1} / {sqs.length}</div>
        <div style={{ color: "#fff", fontSize: "18px", fontWeight: 600, lineHeight: 1.5, marginBottom: "20px" }}>{q.question}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {q.options.map((opt, i) => {
            let border = "1px solid rgba(255,255,255,0.12)", bg = "rgba(255,255,255,0.04)";
            if (isRev) {
              if (q.correct.includes(i)) { bg = "rgba(34,197,94,0.15)"; border = "1px solid #22c55e"; }
              else if (active.includes(i)) { bg = "rgba(239,68,68,0.15)"; border = "1px solid #ef4444"; }
            } else if (active.includes(i)) { bg = ac + "18"; border = `1px solid ${ac}`; }
            return (
              <div key={i} style={{ padding: "12px 16px", borderRadius: "12px", color: "#fff", cursor: "pointer", transition: "all 0.4s ease", display: "flex", alignItems: "center", gap: "10px", userSelect: "none", fontSize: "15px", background: bg, border }}
                onClick={() => isMulti ? toggleM(i) : pick1(i)}>
                {isMulti && <span style={{ fontSize: "18px", minWidth: "20px" }}>{active.includes(i) ? "☑" : "☐"}</span>}
                <span>{opt}</span>
              </div>
            );
          })}
        </div>
        {isMulti && !isRev && (
          <button style={{ ...btnBase, marginTop: "12px", opacity: pending.length ? 1 : 0.4 }} onClick={submitM} disabled={!pending.length}>Potvrdit</button>
        )}
        {isRev && (
          <div style={{ marginTop: "20px", padding: "16px", borderRadius: "14px", border: `1px solid ${isOk ? "#22c55e" : "#ef4444"}`, background: "rgba(255,255,255,0.03)" }}>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: "16px", marginBottom: "8px" }}>{isOk ? "✓ Správně!" : "✗ Špatně"}</div>
            {!isOk && <div style={{ color: "#86efac", fontSize: "14px", marginBottom: "6px" }}>Správná odpověď: {q.correct.map(i => q.options[i]).join(", ")}</div>}
            <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "14px", lineHeight: 1.6 }}>{q.explanation}</div>
            {q.tip && <div style={{ color: "#fbbf24", fontSize: "13px", marginTop: "8px", fontStyle: "italic" }}>💡 {q.tip}</div>}
          </div>
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button style={{ ...btnBase, opacity: idx === 0 ? 0.4 : 1 }} onClick={() => goTo(idx - 1)} disabled={idx === 0}>← Předchozí</button>
        {idx < sqs.length - 1
          ? <button style={btnBase} onClick={() => goTo(idx + 1)}>Další →</button>
          : <button style={{ ...btnBase, background: ac + "55", border: `1px solid ${ac}` }} onClick={() => setShowResults(true)}>Výsledky →</button>
        }
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// DATA
// ════════════════════════════════════════════════════════════════

const questions = [
  // — LIDÉ —
  {
    question: "Doplňte: 'His mom thinks he's ___ Einstein.' (přirovnání)",
    type: "single",
    options: ["a", "an", "the", "(žádný člen)"],
    correct: [1],
    explanation: "Před slavné jméno použité jako přirovnání patří neurčitý člen a/an. 'An Einstein' = někdo stejně chytrý jako Einstein. Platí standardní pravidlo a/an před samohláskou.",
    tip: "Slavné jméno jako přirovnání → a/an (Einstein začíná samohláskou → an)"
  },
  {
    question: "Doplňte: '___ Smiths invited us to dinner.' (celá rodina)",
    type: "single",
    options: ["A", "An", "The", "(žádný člen)"],
    correct: [2],
    explanation: "Pro celou rodinu jako skupinu používáme 'the' + příjmení v množném čísle. 'The Smiths' = celá rodina Smithových.",
    tip: "Celá rodina = The + příjmení v mn. č."
  },
  {
    question: "Doplňte: '___ Mr. Brown is waiting for you.' (neznámá osoba)",
    type: "single",
    options: ["A", "An", "The", "(žádný člen)"],
    correct: [0],
    explanation: "Neurčitý člen před titulem a příjmením signalizuje neznámou osobu — nevíme, kdo to je. 'A Mr. Brown' = jakýsi pan Brown.",
    tip: "Neznámá osoba = a/an + titul + příjmení"
  },
  {
    question: "Jak se správně říká 'spisovatel Stephen King'?",
    type: "single",
    options: ["a writer Stephen King", "the writer Stephen King", "writer Stephen King", "Stephen King the writer"],
    correct: [1],
    explanation: "Před označení povolání stojící před jménem patří 'the'. Povolání ≠ titul. Tituly (Doctor, King, Mrs.) člen nemají; povolání (writer, actor) ho mají.",
    tip: "Povolání + jméno = THE; titul + jméno = bez členu"
  },
  {
    question: "Které spojení je správně?",
    type: "single",
    options: ["famous Jared Leto", "a famous Jared Leto", "the famous Jared Leto", "an famous Jared Leto"],
    correct: [2],
    explanation: "Přídavné jméno stojící před jménem osoby vyžaduje určitý člen 'the'. 'The famous Jared Leto', 'the young Mozart'.",
    tip: "Přídavné jméno + jméno osoby → THE"
  },
  {
    question: "Romeo byl příslušníkem rodu Montaguů. Jak to řekneme anglicky?",
    type: "single",
    options: ["Romeo was the Montague.", "Romeo was Montague.", "Romeo was a Montague.", "Romeo was an Montague."],
    correct: [2],
    explanation: "Neurčitý člen 'a' vyjadřuje příslušnost k rodu/dynastii. 'Romeo was a Montague' = Romeo byl (příslušník) Montaguů, patřil k tomuto rodu.",
    tip: "Příslušnost k rodu = a + jméno rodu (Romeo was a Montague)"
  },
  {
    question: "Co znamená věta 'What, THE Dan Brown?'",
    type: "single",
    options: ["Mluvíme o neznámém člověku jménem Dan Brown", "Zdůrazňujeme, že jde o TEN slavný Dan Brown", "Dan Brown je povolání, ne jméno", "Věta je gramaticky chybná"],
    correct: [1],
    explanation: "'The' s důrazem u jména znamená 'ten slavný/specifický člověk'. 'THE Dan Brown' = opravdu ten slavný spisovatel, ne jiný člověk se stejným jménem.",
    tip: "THE + jméno (s důrazem) = ten pravý, ten slavný"
  },
  {
    question: "Jak správně řekneme, že někdo vlastní obraz od Picassa?",
    type: "single",
    options: ["He owns a Picasso.", "He owns the Picasso.", "He owns Picasso.", "He owns an Picasso."],
    correct: [0],
    explanation: "Jméno umělce zastupující jeho dílo (metonimie) funguje jako běžné podstatné jméno. 'A Picasso' = jeden obraz od Picassa. Dodržují se standardní pravidla pro členy.",
    tip: "Jméno umělce = název díla → a Picasso, a Monet (jeden obraz)"
  },
  // — ZVÍŘATA —
  {
    question: "Která věta SPRÁVNĚ popisuje druh sněžného levharta?",
    type: "single",
    options: ["Snow leopard is an endangered species.", "The snow leopard is an endangered species.", "A snow leopards are endangered.", "Snow the leopard is endangered."],
    correct: [1],
    explanation: "'The snow leopard' = sněžný levhart jako druh (encyklopedicky). 'The + druh zvířete v jednotném čísle' označuje celý druh.",
    tip: "The + zvíře (jedn. č.) = celý druh encyklopedicky"
  },
  {
    question: "Vyberte VŠECHNY správné způsoby jak říct, že šimpanzi obecně umí znakovou řeč:",
    type: "multi",
    options: ["A chimpanzee can learn sign language.", "The chimpanzee can learn sign language.", "Chimpanzees can learn sign language.", "Chimpanzee can learn sign language."],
    correct: [0, 1, 2],
    explanation: "Druh obecně lze vyjádřit 3 správnými způsoby: 'A chimpanzee' (zástupce druhu), 'The chimpanzee' (druh jako celek), 'Chimpanzees' (mn. č. bez členu). Bez členu v jednotném čísle ('Chimpanzee can...') je chybně.",
    tip: "Druh obecně: a/the + jedn. č., nebo mn. č. bez členu — všechny 3 formy jsou OK"
  },
  {
    question: "Doplňte: 'I bought some ___ for dinner.' (maso z kuřete)",
    type: "single",
    options: ["a chicken", "the chicken", "chicken", "chickens"],
    correct: [2],
    explanation: "Zvíře použité jako maso/jídlo je nepočitatelné podstatné jméno a nepoužívá člen. 'Some chicken' = kuřecí maso (ne živé zvíře).",
    tip: "Zvíře jako jídlo = nepočitatelné → bez členu (chicken, beef, shark)"
  },
  // — MÍSTA —
  {
    question: "Které zeměpisné názvy NEPOUŽÍVAJÍ člen 'the'? (vyberte více)",
    type: "multi",
    options: ["the Pacific Ocean", "Mount Everest", "the Alps", "Lake Victoria"],
    correct: [1, 3],
    explanation: "Jednotlivé hory (Mount Everest) a jezera (Lake Victoria) člen nemají. Oceány (the Pacific) a pohoří (the Alps) 'the' mají.",
    tip: "Jednotlivá hora/jezero = bez členu; oceán/pohoří = the"
  },
  {
    question: "Proč říkáme 'the Czech Republic' ale 'France'?",
    type: "single",
    options: ["Czech Republic má více slabik", "'Czech Republic' obsahuje obecné podstatné jméno (Republic)", "France je starší stát", "Jde o výjimku bez pravidla"],
    correct: [1],
    explanation: "Státy obsahující obecné podstatné jméno (Republic, Kingdom, Union, States) vyžadují 'the'. Jednoslovné nebo víceslovné názvy bez takového slova člen nemají.",
    tip: "Republic / Kingdom / Union / States v názvu → THE"
  },
  {
    question: "Doplňte: '___ Netherlands announced new policies.'",
    type: "single",
    options: ["A", "The", "(žádný člen)", "An"],
    correct: [1],
    explanation: "Státy s názvem v množném čísle vyžadují 'the'. The Netherlands, the Philippines, the Bahamas jsou všechna v množném čísle.",
    tip: "Název státu v mn. č. → the Netherlands, the Philippines"
  },
  {
    question: "Které z těchto názvů správně POUŽÍVAJÍ 'the'? (vyberte více)",
    type: "multi",
    options: ["the Sahara", "the Mississippi", "the Paris", "the Ritz"],
    correct: [0, 1, 3],
    explanation: "Pouště (the Sahara), řeky (the Mississippi) a hotely (the Ritz) mají 'the'. Města (Paris, Rome, Prague) nikdy člen nemají.",
    tip: "Poušť/řeka/hotel → the; město → nikdy"
  },
  {
    question: "Doplňte: '___ White House is in Washington D.C.'",
    type: "single",
    options: ["A", "The", "(žádný člen)", "An"],
    correct: [1],
    explanation: "Budovy, jejichž název začíná přídavným jménem nebo obecným slovem (ne vlastním jménem), používají 'the'. The White House, the National Museum.",
    tip: "Přídavné/obecné slovo v názvu budovy → the"
  },
  {
    question: "Jak správně řekneme název hradu?",
    type: "single",
    options: ["the Prague Castle", "a Prague Castle", "Prague Castle", "an Prague Castle"],
    correct: [2],
    explanation: "Hrady začínající vlastním jménem člen nemají. Prague Castle, Edinburgh Castle, Windsor Castle — bez 'the'.",
    tip: "Hrad + vlastní jméno = bez členu (Prague Castle)"
  },
  {
    question: "Která z těchto konstrukcí VYŽADUJE člen 'the'?",
    type: "single",
    options: ["Harvard University", "MIT", "University of California", "Oxford University"],
    correct: [2],
    explanation: "Konstrukce 'University of [místo]' vyžaduje 'the University of California'. Naopak '[Vlastní jméno] University' (Harvard University) člen nemá.",
    tip: "University of... → the; [Jméno] University → bez členu"
  },
  {
    question: "Doplňte: 'We sailed across ___ Atlantic.'",
    type: "single",
    options: ["a", "an", "the", "(žádný člen)"],
    correct: [2],
    explanation: "Oceány a moře vždy vyžadují 'the'. The Atlantic, the Pacific, the North Sea, the Mediterranean — bez výjimky.",
    tip: "Oceán/moře → VŽDY the"
  },
  {
    question: "Které z těchto výrazů NEPOUŽÍVAJÍ člen 'the'? (vyberte více)",
    type: "multi",
    options: ["Europe (kontinent)", "Broadway (ulice)", "Buckingham Palace", "the Bronx (čtvrť NY)"],
    correct: [0, 1, 2],
    explanation: "Kontinenty (Europe), ulice (Broadway) a paláce začínající vlastním jménem (Buckingham Palace) člen nemají. The Bronx je výjimka — tato čtvrť člen používá.",
    tip: "Kontinent/ulice/palác = bez členu; výjimky: the Bronx, the Hague"
  },
  {
    question: "Doplňte: '___ Eiffel Tower is a symbol of France.'",
    type: "single",
    options: ["A", "The", "(žádný člen)", "An"],
    correct: [1],
    explanation: "Eiffelova věž je výjimka — i přes vlastní jméno Eiffel v názvu používá 'the'. Podobně: the Statue of Liberty. Je třeba si je zapamatovat.",
    tip: "the Eiffel Tower, the Statue of Liberty — výjimky!"
  },
  {
    question: "Doplňte: '___ Alps are a popular skiing destination.'",
    type: "single",
    options: ["A", "The", "(žádný člen)", "An"],
    correct: [1],
    explanation: "Pohoří vždy používají 'the'. The Alps, the Himalayas, the Sierra Nevada, the Rockies.",
    tip: "Pohoří = THE (the Alps, the Himalayas)"
  },
  {
    question: "Jak se správně jmenuje populární hotel?",
    type: "single",
    options: ["Ritz", "a Ritz", "the Ritz", "an Ritz"],
    correct: [2],
    explanation: "Hotely vždy používají 'the'. The Ritz, the Hilton, the Marriott — i když název je vlastní jméno.",
    tip: "Hotel → vždy THE (the Ritz, the Hilton)"
  },
  {
    question: "Vyberte VŠECHNA pravdivá tvrzení o použití členů u zvířat:",
    type: "multi",
    options: ["'The tiger' může popisovat celý druh.", "'A tiger' může popisovat celý druh.", "'Tigers' bez členu může popisovat celý druh.", "Zvíře jako maso je vždy počitatelné."],
    correct: [0, 1, 2],
    explanation: "Pro popis druhu obecně jsou správné 3 formy. Zvíře jako maso (chicken, beef, pork) je naopak nepočitatelné — bez členu.",
  },
  {
    question: "Co platí pro jméno TITULU před jménem osoby?",
    type: "single",
    options: ["Vždy 'the' (the Doctor Smith)", "Vždy 'a' (a Doctor Smith)", "Bez členu (Doctor Smith)", "Záleží na kontextu"],
    correct: [2],
    explanation: "Společenské, profesní, vojenské a náboženské tituly před jménem se používají bez členu. Doctor Smith, King James, Colonel Sheppard, Father Cavanaugh — vše bez členu.",
    tip: "Titul + jméno = VŽDY bez členu"
  },
];

const flashcards = [
  { front: "Standardní jméno osoby\n→ jaký člen?", back: "Žádný člen\n\n✦ He married Sarah.\n✦ Spielberg is a great director.\n✦ Jméno samo o sobě = bez členu" },
  { front: "Celá rodina\nThe + příjmení v mn. č.", back: "Celá rodina jako skupina\n\n✦ The Smiths invited us over.\n✦ The Simpsons live in Springfield.\n✦ I met the Browns this morning." },
  { front: "Neznámá osoba\na/an + titul + příjmení", back: "Nevíme, kdo to je\n\n✦ A Mr. Brown was asking for you.\n✦ A Mary Golding is on the phone.\n✦ (= jakýsi/jistý pan Brown)" },
  { front: "Přirovnání ke slavné osobě\na/an + slavné jméno", back: "Přirovnání k vlastnostem slavné osoby\n\n✦ He's an Einstein. (je chytrý)\n✦ She's no Mozart. (není tak talentovaná)\n✦ His mom thinks he's an Einstein." },
  { front: "Povolání vs. titul před jménem", back: "Povolání → THE\n✦ the writer Stephen King\n✦ the actor Tom Hanks\n\nTitul → bez členu\n✦ Doctor Richards\n✦ King James\n✦ Colonel Sheppard" },
  { front: "Přídavné jméno + jméno osoby\n→ THE", back: "Přídavné jméno před jménem vyžaduje 'the'\n\n✦ the famous Jared Leto\n✦ the young Mozart\n✦ the dying John Smith" },
  { front: "Příslušnost k rodu\na + jméno rodu", back: "Vyjadřuje, že někdo patří k rodu\n\n✦ Romeo was a Montague.\n✦ Juliet was a Capulet." },
  { front: "Zdůraznění slavné osoby\nTHE + jméno", back: "Ten pravý, ten slavný (s důrazem)\n\n✦ What, THE Dan Brown?\n  = Ten slavný spisovatel?\n✦ Odlišuje ho od jiných se stejným jménem" },
  { front: "Metonimie (jméno umělce = dílo)\n→ a/an + jméno", back: "Jméno zastupuje dílo, funguje jako b. j.\n\n✦ He owns a Picasso. (obraz)\n✦ She bought a Monet. (obraz)\n✦ Standard rules for articles apply." },
  { front: "Druh zvířete — 3 způsoby", back: "Všechny 3 formy jsou správně:\n\n✦ The snow leopard is endangered.\n✦ A chimpanzee can learn signs.\n✦ Snow leopards live in Asia." },
  { front: "Zvíře jako maso/jídlo", back: "Nepočitatelné → bez členu\n\n✦ I had some chicken. (maso)\n✦ Have you tried shark? (jídlo)\n✦ We served beef / pork / fish." },
  { front: "Oceány, moře, řeky, průplavy\n→ THE", back: "Vždy THE\n\n✦ the Pacific, the Atlantic\n✦ the North Sea, the Mediterranean\n✦ the Mississippi, the Thames\n✦ the Panama Canal, the Bering Strait" },
  { front: "Pohoří, souostroví, pouště\n→ THE", back: "Vždy THE\n\n✦ the Alps, the Himalayas, the Rockies\n✦ the Shetlands, the Channel Islands\n✦ the Sahara, the Mojave Desert" },
  { front: "Hory, jezera, ostrovy\n→ BEZ členu", back: "Jednotlivé → BEZ členu\n\n✦ Mount Everest, Ben Nevis, Half Dome\n✦ Lake Victoria, Lake Erie, Loch Ness\n✦ Madagascar, Java, Holy Island" },
  { front: "Státy → pravidlo", back: "BEZ členu:\n✦ France, Italy, Russia, New Zealand\n\nTHE — mn. č. nebo obecné slovo v názvu:\n✦ the Netherlands, the Philippines\n✦ the Czech Republic, the USA, the UK" },
  { front: "Kontinenty → BEZ členu", back: "Vždy BEZ členu\n\n✦ Europe, Asia, Africa, Australia\n✦ South America, Central Asia\n✦ (výjimka: 'the continent of Africa')" },
  { front: "Ulice, náměstí, parky\n→ BEZ členu", back: "Vždy BEZ členu\n\n✦ Wall Street, Broadway\n✦ Trafalgar Square, Times Square\n✦ Hyde Park, Yosemite National Park" },
  { front: "Budovy → pravidlo", back: "Vlastní jméno v názvu → BEZ členu\n✦ Westminster Abbey, Prague Castle\n✦ Buckingham Palace\n\nPřídavné/obecné slovo → THE\n✦ the White House, the National Museum\n✦ the Eiffel Tower (výjimka!)" },
  { front: "Hotely, divadla, muzea\n→ THE", back: "Vždy THE\n\n✦ the Ritz, the Hilton, the Marriott\n✦ the Odeon, the Globe Theatre\n✦ the Prado, the Tate Gallery" },
  { front: "Univerzity → pravidlo", back: "'University of...' → THE\n✦ the University of California\n\n'[Jméno] University' → BEZ členu\n✦ Harvard University\n✦ Oxford University" },
];

// ════════════════════════════════════════════════════════════════
// SHARED STYLES
// ════════════════════════════════════════════════════════════════

const glassCard = { background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", transition: "all 0.4s ease" };
const greenCard = { background: "rgba(34,197,94,0.07)", backdropFilter: "blur(20px)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "16px" };
const yellowCard = { background: "rgba(234,179,8,0.07)", backdropFilter: "blur(20px)", border: "1px solid rgba(234,179,8,0.2)", borderRadius: "16px" };

function Tag({ children, color = "#22c55e" }) {
  return (
    <span style={{ background: color + "22", color, borderRadius: "6px", padding: "2px 8px", fontSize: "12px", fontWeight: 700, whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
}

function RuleRow({ tag, tagColor, rule, warn, examples }) {
  return (
    <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <Tag color={tagColor || "#22c55e"}>{tag}</Tag>
      <div style={{ flex: 1 }}>
        <div style={{ color: "#fff", fontSize: "15px", lineHeight: 1.5 }}>{rule}</div>
        {warn && <div style={{ color: "#eab308", fontSize: "13px", marginTop: "4px" }}>⚠️ {warn}</div>}
        {examples && (
          <div style={{ marginTop: "8px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {examples.map((e, i) => (
              <span key={i} style={{ background: "rgba(255,255,255,0.06)", borderRadius: "8px", padding: "3px 10px", color: "rgba(255,255,255,0.7)", fontSize: "13px", fontFamily: "'JetBrains Mono', monospace" }}>{e}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ ...glassCard, overflow: "hidden", marginBottom: "12px" }}>
      <div onClick={() => setOpen(o => !o)} style={{ padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", borderBottom: open ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: "16px" }}>{title}</span>
        <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "14px" }}>{open ? "▲" : "▼"}</span>
      </div>
      {open && <div style={{ padding: "4px 20px 16px" }}>{children}</div>}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// TAB CONTENTS
// ════════════════════════════════════════════════════════════════

function OverviewTab() {
  const types = [
    { article: "a / an", color: "#22c55e", when: "Neurčitý člen — poprvé zmíněný, nekonkrétní, jeden z mnoha", examples: ["a dog", "an apple", "a Mr. Brown (neznámý)", "an Einstein (přirovnání)"] },
    { article: "the", color: "#eab308", when: "Určitý člen — konkrétní, jedinečný, oba víme o čem mluvíme, dříve zmíněný", examples: ["the dog I saw", "the Smiths (rodina)", "the Alps (pohoří)", "the Ritz (hotel)"] },
    { article: "Ø (žádný)", color: "#a78bfa", when: "Nulový člen — vlastní jména, množná podst. jm. obecně, nepočitatelná podst. jm., jídlo ze zvířat", examples: ["France", "Prague", "Lake Victoria", "chicken (maso)"] },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <div style={{ ...glassCard, padding: "20px" }}>
        <h3 style={{ color: "#fff", margin: "0 0 16px", fontSize: "17px" }}>Tři typy členů</h3>
        {types.map(t => (
          <div key={t.article} style={{ padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ background: t.color + "22", color: t.color, borderRadius: "8px", padding: "4px 14px", fontSize: "18px", fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" }}>{t.article}</span>
              <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", lineHeight: 1.4 }}>{t.when}</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", paddingLeft: "4px" }}>
              {t.examples.map((e, i) => (
                <span key={i} style={{ background: "rgba(255,255,255,0.06)", borderRadius: "8px", padding: "3px 10px", color: "rgba(255,255,255,0.65)", fontSize: "13px", fontFamily: "'JetBrains Mono', monospace" }}>{e}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
        {[
          { title: "Jména lidí", desc: "Rodiny, povolání, přirovnání, neznámé osoby, metonimie", emoji: "👤", tab: 1 },
          { title: "Zvířata", desc: "Druh vs. jednotlivec, zvíře jako jídlo", emoji: "🐾", tab: 2 },
          { title: "Zeměpisné názvy", desc: "Vodní plochy, pohoří, státy, budovy…", emoji: "🗺️", tab: 3 },
        ].map(c => (
          <div key={c.title} style={{ ...greenCard, padding: "16px", textAlign: "center" }}>
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>{c.emoji}</div>
            <div style={{ color: "#22c55e", fontWeight: 700, fontSize: "15px", marginBottom: "6px" }}>{c.title}</div>
            <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "13px", lineHeight: 1.4 }}>{c.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PeopleTab() {
  return (
    <div>
      <Section title="👤 Standardní jméno osoby">
        <RuleRow tag="Ø člen" rule="Vlastní jméno osoby se používá bez členu." examples={["He married Sarah.", "Spielberg is a great director.", "I spoke to John."]} />
      </Section>
      <Section title="👨‍👩‍👦 Celá rodina — The + příjmení (mn. č.)">
        <RuleRow tag="THE" tagColor="#eab308" rule="Pro celou rodinu jako skupinu: the + příjmení v množném čísle." examples={["The Smiths invited us.", "The Simpsons live in Springfield.", "I met the Browns."]} />
      </Section>
      <Section title="🎭 Tituly vs. povolání před jménem">
        <RuleRow tag="Ø člen" rule="Společenské, profesní, vojenské a náboženské TITULY před jménem — bez členu." examples={["Doctor Richards", "King James", "Colonel Sheppard", "Father Cavanaugh", "Mrs. Smith"]} />
        <RuleRow tag="THE" tagColor="#eab308" rule="POVOLÁNÍ (ne titul) před jménem — s 'the'." warn="Povolání ≠ titul! Writer, actor, singer = povolání." examples={["the writer Stephen King", "the actor Tom Hanks", "the teacher John Barnes"]} />
      </Section>
      <Section title="✨ Přídavné jméno před jménem — The">
        <RuleRow tag="THE" tagColor="#eab308" rule="Přídavné jméno stojící před jménem osoby vyžaduje 'the'." examples={["the famous Jared Leto", "the young Mozart", "the dying John Smith"]} />
        <RuleRow tag="výjimka" tagColor="#a78bfa" rule="Některé ustálené výrazy jdou bez členu." examples={["Bloody Mary", "Good King Wenceslas"]} />
      </Section>
      <Section title="❓ Neznámá osoba — a/an + titul + příjmení">
        <RuleRow tag="a / an" rule="Neznámá osoba = neurčitý člen před titulem a příjmením." examples={["A Mr. Brown was asking for you.", "A Mary Golding is on the phone."]} />
      </Section>
      <Section title="🌟 Přirovnání ke slavné osobě — a/an + jméno">
        <RuleRow tag="a / an" rule="Přirovnání k vlastnostem slavné osoby — neurčitý člen." examples={["He's an Einstein.", "She's no Mozart.", "His mom thinks he's an Einstein."]} />
      </Section>
      <Section title="💥 Zdůraznění = THE + jméno">
        <RuleRow tag="THE" tagColor="#eab308" rule="Určitý člen s důrazem zdůrazňuje, že jde o TU slavnou osobu (ne jiného se stejným jménem)." examples={["What, THE Dan Brown?", "You mean THE Taylor Swift?"]} />
      </Section>
      <Section title="🏰 Příslušnost k rodu — a + jméno rodu">
        <RuleRow tag="a / an" rule="Vyjadřuje, že někdo patří k určité rodině/dynastii." examples={["Romeo was a Montague.", "Juliet was a Capulet."]} />
      </Section>
      <Section title="🖼️ Metonimie — jméno umělce = jeho dílo">
        <RuleRow tag="a / an" rule="Jméno umělce zastupující dílo funguje jako běžné podstatné jméno — standardní pravidla." examples={["He owns a Picasso.", "She bought a Monet.", "They have a Warhol."]} />
      </Section>
    </div>
  );
}

function AnimalsTab() {
  return (
    <div>
      <Section title="🐆 Druh zvířete obecně — 3 správné formy">
        <div style={{ ...greenCard, padding: "14px 16px", margin: "10px 0 4px" }}>
          <div style={{ color: "#22c55e", fontWeight: 700, fontSize: "14px", marginBottom: "10px" }}>Všechny 3 formy jsou gramaticky správné:</div>
          {[
            ["THE + jedn. č.", "the", "The snow leopard is endangered.", "Druh jako celek (encyklopedicky)"],
            ["A/AN + jedn. č.", "a/an", "A chimpanzee can learn sign language.", "Jeden zástupce druhu"],
            ["Mn. č. bez členu", "Ø", "Snow leopards live in Asia.", "Druh obecně — nejuniverzálnější"],
          ].map(([label, art, ex, note]) => (
            <div key={label} style={{ display: "flex", gap: "12px", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", alignItems: "flex-start" }}>
              <span style={{ minWidth: "130px", color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>{label}</span>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", color: "#fff", fontSize: "14px" }}>{ex}</div>
                <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "12px", marginTop: "2px" }}>{note}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>
      <Section title="🍗 Zvíře jako maso / jídlo — nulový člen">
        <RuleRow tag="Ø člen" rule="Zvíře použité jako maso nebo jídlo je nepočitatelné podstatné jméno — bez členu." warn="'A chicken' = živé kuře; 'some chicken' = kuřecí maso" examples={["I bought some chicken.", "Have you tried shark?", "We had beef for dinner.", "She doesn't eat pork."]} />
      </Section>
      <Section title="📝 Další poznámky">
        <RuleRow tag="it / its" rule="Pro zvířata se běžně používají neutrální zájmena it/its (ne he/she), pokud pohlaví není relevantní." examples={["The dog wagged its tail.", "Look at it — it's huge!"]} />
        <RuleRow tag="pravopis" rule="Názvy zvířat se píší malým písmenem (pokud neobsahují vlastní jméno)." examples={["a snow leopard ✓", "a Golden Retriever ✓ (vlastní jméno)", "a Tiger ✗ (velké T je chyba)"]} />
      </Section>
    </div>
  );
}

function PlacesTab() {
  return (
    <div>
      <Section title="🌊 Oceány, moře, řeky, průplavy, zálivy — THE">
        <RuleRow tag="THE" tagColor="#eab308" rule="Všechny vodní plochy tohoto typu používají 'the'." examples={["the Pacific", "the Atlantic Ocean", "the North Sea", "the Mediterranean", "the Mississippi", "the River Thames", "the Panama Canal", "the Gulf of Mexico", "the Bering Strait"]} />
        <RuleRow tag="výjimka" tagColor="#a78bfa" rule="Jezera NEPOUŽÍVAJÍ člen 'the'." examples={["Lake Erie", "Lake Michigan", "Lake Victoria", "Loch Ness"]} />
      </Section>
      <Section title="⛰️ Pohoří, souostroví, pouště — THE">
        <RuleRow tag="THE" tagColor="#eab308" rule="Skupiny / řady geografických objektů používají 'the'." examples={["the Alps", "the Himalayas", "the Sierra Nevada", "the Rockies", "the Shetlands", "the Channel Islands", "the British Isles", "the Sahara", "the Mojave Desert"]} />
      </Section>
      <Section title="🏔️ Jednotlivé hory a ostrovy — BEZ členu">
        <RuleRow tag="Ø člen" rule="Jednotlivé hory a ostrovy — bez členu." examples={["Mount Everest", "Half Dome", "Ben Nevis", "Madagascar", "Java", "Holy Island"]} />
      </Section>
      <Section title="🌍 Kontinenty — BEZ členu">
        <RuleRow tag="Ø člen" rule="Kontinenty nikdy nepoužívají člen (ani s přídavnými jmény)." examples={["Europe", "Asia", "Africa", "Australia", "South America", "Central Asia", "medieval Europe"]} />
        <RuleRow tag="výjimka" tagColor="#a78bfa" rule="S obecným slovem 'continent' se člen používá." examples={["the continent of Africa"]} />
      </Section>
      <Section title="🏳️ Státy a území — pravidlo">
        <RuleRow tag="Ø člen" rule="Jednoslovné nebo víceslovné názvy BEZ obecného podstatného jména — bez členu." examples={["France", "Italy", "Russia", "New Zealand", "New Mexico", "Great Britain"]} />
        <RuleRow tag="THE" tagColor="#eab308" rule="Název v MNOŽNÉM ČÍSLE nebo obsahující obecné slovo (Republic, Kingdom, Union, States) — s 'the'." examples={["the Netherlands", "the Philippines", "the Czech Republic", "the USA", "the United Kingdom", "the Republic of Ireland"]} />
      </Section>
      <Section title="🏙️ Města, čtvrti, ulice, náměstí, parky — BEZ členu">
        <RuleRow tag="Ø člen" rule="Města a obce — bez členu." examples={["New York", "Paris", "Prague", "Sydney", "Washington DC"]} />
        <RuleRow tag="Ø člen" rule="Ulice, náměstí, parky, bulváry — bez členu." examples={["Wall Street", "Broadway", "Madison Avenue", "Trafalgar Square", "Times Square", "Hyde Park", "Yosemite National Park"]} />
        <RuleRow tag="výjimky" tagColor="#a78bfa" rule="Některé čtvrti a speciální oblasti člen mají." examples={["the Bronx", "the Riviera", "the Hague", "the City (of London)"]} />
      </Section>
      <Section title="🏛️ Budovy a stavby — pravidlo">
        <RuleRow tag="Ø člen" rule="Název začíná VLASTNÍM JMÉNEM — bez členu." examples={["Westminster Abbey", "Buckingham Palace", "Prague Castle", "Edinburgh Castle", "St. Paul's Cathedral"]} />
        <RuleRow tag="THE" tagColor="#eab308" rule="Název začíná PŘÍDAVNÝM JMÉNEM nebo OBECNÝM SLOVEM — s 'the'." examples={["the White House", "the National Museum", "the World Trade Center", "the Statue of Liberty"]} />
        <RuleRow tag="výjimky" tagColor="#a78bfa" rule="Výjimky je třeba si zapamatovat." examples={["the Eiffel Tower ← výjimka!", "Big Ben (bez the) ← výjimka!"]} />
      </Section>
      <Section title="🏨 Hotely, divadla, muzea, galerie — THE">
        <RuleRow tag="THE" tagColor="#eab308" rule="Hotely, divadla, muzea a galerie vždy s 'the'." examples={["the Ritz", "the Hilton", "the Odeon", "the Globe Theatre", "the Prado", "the Tate Gallery", "the British Museum"]} />
      </Section>
      <Section title="🎓 Univerzity — pravidlo">
        <RuleRow tag="THE" tagColor="#eab308" rule="Konstrukce 'University of [místo]' → the." examples={["the University of California", "the University of Oxford (formálně)"]} />
        <RuleRow tag="Ø člen" rule="Konstrukce '[Jméno] University' nebo '[Jméno] College' → bez členu." examples={["Harvard University", "Oxford University (neformálně)", "MIT", "Eton College"]} />
      </Section>
    </div>
  );
}

function FlashcardsTab() {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = flashcards[idx];

  const nav = (dir) => { setIdx(i => Math.min(Math.max(0, i + dir), flashcards.length - 1)); setFlipped(false); };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>{idx + 1} / {flashcards.length}</div>
      <div style={{ width: "100%", perspective: "1000px", cursor: "pointer" }} onClick={() => setFlipped(f => !f)}>
        <div style={{ position: "relative", width: "100%", minHeight: "240px", transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)", transition: "transform 0.4s ease" }}>
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", ...greenCard, padding: "32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ color: "#fff", fontSize: "19px", fontWeight: 700, textAlign: "center", whiteSpace: "pre-line", lineHeight: 1.5 }}>{card.front}</div>
          </div>
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", ...yellowCard, padding: "24px 28px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ color: "rgba(255,255,255,0.9)", fontSize: "15px", textAlign: "left", whiteSpace: "pre-line", lineHeight: 1.7, width: "100%" }}>{card.back}</div>
          </div>
        </div>
      </div>
      <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>Klikni na kartu pro otočení</div>
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <button onClick={() => nav(-1)} disabled={idx === 0} style={{ padding: "10px 20px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", color: "#fff", cursor: "pointer", fontSize: "15px", opacity: idx === 0 ? 0.4 : 1, transition: "all 0.4s ease" }}>←</button>
        <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", maxWidth: "300px", justifyContent: "center" }}>
          {flashcards.map((_, i) => (
            <div key={i} onClick={() => { setIdx(i); setFlipped(false); }} style={{ width: 9, height: 9, borderRadius: "50%", cursor: "pointer", background: i === idx ? "#22c55e" : "rgba(255,255,255,0.2)", transition: "background 0.4s ease" }} />
          ))}
        </div>
        <button onClick={() => nav(1)} disabled={idx === flashcards.length - 1} style={{ padding: "10px 20px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", color: "#fff", cursor: "pointer", fontSize: "15px", opacity: idx === flashcards.length - 1 ? 0.4 : 1, transition: "all 0.4s ease" }}>→</button>
      </div>
    </div>
  );
}

function CheatSheet() {
  const rows = [
    { cat: "Standardní jméno osoby", the: "—", aan: "—", zero: "✓", note: "He married Sarah." },
    { cat: "Celá rodina", the: "✓", aan: "—", zero: "—", note: "The Smiths" },
    { cat: "Neznámá osoba", the: "—", aan: "✓", zero: "—", note: "a Mr. Brown" },
    { cat: "Přirovnání ke slavné osobě", the: "—", aan: "✓", zero: "—", note: "an Einstein" },
    { cat: "Povolání + jméno", the: "✓", aan: "—", zero: "—", note: "the writer King" },
    { cat: "Titul + jméno", the: "—", aan: "—", zero: "✓", note: "Doctor Richards" },
    { cat: "Adj. + jméno osoby", the: "✓", aan: "—", zero: "—", note: "the famous Leto" },
    { cat: "Zdůraznění slavné osoby", the: "✓", aan: "—", zero: "—", note: "THE Dan Brown" },
    { cat: "Příslušnost k rodu", the: "—", aan: "✓", zero: "—", note: "a Montague" },
    { cat: "Metonimie (dílo umělce)", the: "—", aan: "✓", zero: "—", note: "a Picasso" },
    { cat: "---", the: "", aan: "", zero: "", note: "" },
    { cat: "Druh zvířete (obecně)", the: "✓", aan: "✓", zero: "✓ (mn. č.)", note: "Všechny 3 OK" },
    { cat: "Zvíře jako jídlo/maso", the: "—", aan: "—", zero: "✓", note: "some chicken" },
    { cat: "---", the: "", aan: "", zero: "", note: "" },
    { cat: "Oceány / moře / řeky", the: "✓", aan: "—", zero: "—", note: "the Pacific" },
    { cat: "Pohoří / souostroví / pouště", the: "✓", aan: "—", zero: "—", note: "the Alps" },
    { cat: "Jezera", the: "—", aan: "—", zero: "✓", note: "Lake Victoria" },
    { cat: "Jednotlivé hory / ostrovy", the: "—", aan: "—", zero: "✓", note: "Mount Everest" },
    { cat: "Kontinenty", the: "—", aan: "—", zero: "✓", note: "Europe" },
    { cat: "Stát — jednoduchý název", the: "—", aan: "—", zero: "✓", note: "France, Russia" },
    { cat: "Stát — mn. č. / obecné slovo", the: "✓", aan: "—", zero: "—", note: "the Czech Republic" },
    { cat: "Města / ulice / parky", the: "—", aan: "—", zero: "✓", note: "Prague, Broadway" },
    { cat: "Čtvrti (výjimky)", the: "✓", aan: "—", zero: "—", note: "the Bronx, the Hague" },
    { cat: "Budova — vlastní jméno", the: "—", aan: "—", zero: "✓", note: "Prague Castle" },
    { cat: "Budova — adj./obecné slovo", the: "✓", aan: "—", zero: "—", note: "the White House" },
    { cat: "Hotely / divadla / muzea", the: "✓", aan: "—", zero: "—", note: "the Ritz" },
    { cat: "University of [místo]", the: "✓", aan: "—", zero: "—", note: "the Univ. of CA" },
    { cat: "[Jméno] University", the: "—", aan: "—", zero: "✓", note: "Harvard University" },
  ];

  const hStyle = { padding: "10px 12px", color: "rgba(255,255,255,0.5)", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" };
  const cStyle = { padding: "9px 12px", color: "rgba(255,255,255,0.8)", fontSize: "14px", borderTop: "1px solid rgba(255,255,255,0.06)" };

  return (
    <div style={{ ...glassCard, overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <h3 style={{ color: "#fff", margin: 0, fontSize: "17px" }}>📋 Přehled pravidel — rychlý tahák</h3>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "500px" }}>
          <thead>
            <tr style={{ background: "rgba(34,197,94,0.08)" }}>
              <th style={{ ...hStyle, textAlign: "left" }}>Kategorie</th>
              <th style={{ ...hStyle, textAlign: "center", color: "#eab308" }}>THE</th>
              <th style={{ ...hStyle, textAlign: "center", color: "#22c55e" }}>A/AN</th>
              <th style={{ ...hStyle, textAlign: "center", color: "#a78bfa" }}>Ø</th>
              <th style={{ ...hStyle, textAlign: "left" }}>Příklad</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => r.cat === "---" ? (
              <tr key={i}><td colSpan={5} style={{ padding: "4px 0", background: "rgba(255,255,255,0.03)" }} /></tr>
            ) : (
              <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }}>
                <td style={{ ...cStyle, fontWeight: 500 }}>{r.cat}</td>
                <td style={{ ...cStyle, textAlign: "center", color: r.the === "✓" ? "#eab308" : "rgba(255,255,255,0.2)" }}>{r.the || "—"}</td>
                <td style={{ ...cStyle, textAlign: "center", color: r.aan === "✓" ? "#22c55e" : "rgba(255,255,255,0.2)" }}>{r.aan || "—"}</td>
                <td style={{ ...cStyle, textAlign: "center", color: r.zero.startsWith("✓") ? "#a78bfa" : "rgba(255,255,255,0.2)" }}>{r.zero || "—"}</td>
                <td style={{ ...cStyle, color: "rgba(255,255,255,0.45)", fontSize: "13px", fontFamily: "'JetBrains Mono', monospace" }}>{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ color: "#eab308", fontSize: "13px", fontWeight: 700, marginBottom: "8px" }}>⚠️ Výjimky k zapamatování</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {["the Eiffel Tower (vlastní jméno, přesto the)", "Big Ben (bez the)", "the Bronx / the Hague (čtvrti s the)", "the Riviera (turistická oblast s the)"].map(e => (
            <span key={e} style={{ background: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.25)", borderRadius: "8px", padding: "4px 10px", color: "#eab308", fontSize: "13px" }}>{e}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// MAIN APP
// ════════════════════════════════════════════════════════════════

export default function App() {
  const [tab, setTab] = useState(0);
  const tabs = [
    { id: 0, label: "📖 Přehled" },
    { id: 1, label: "👤 Lidé" },
    { id: 2, label: "🐾 Zvířata" },
    { id: 3, label: "🗺️ Místa" },
    { id: 4, label: "🃏 Flashkarty" },
    { id: 5, label: "🧪 Quiz" },
    { id: 6, label: "📋 Tahák" },
  ];

  return (
    <div style={{ background: "#040e06", minHeight: "100vh", fontFamily: "'Inter', 'Segoe UI', sans-serif", position: "relative", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
        @keyframes f1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(50px,40px) scale(1.05)} }
        @keyframes f2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-40px,50px) scale(0.95)} }
        @keyframes f3 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(30px,-40px) scale(1.03)} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(34,197,94,0.3); border-radius: 3px; }
      `}</style>

      {/* Animated background orbs */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", width: "700px", height: "700px", borderRadius: "50%", background: "radial-gradient(circle, rgba(34,197,94,0.14) 0%, transparent 70%)", top: "-150px", left: "-150px", animation: "f1 20s ease-in-out infinite" }} />
        <div style={{ position: "absolute", width: "550px", height: "550px", borderRadius: "50%", background: "radial-gradient(circle, rgba(234,179,8,0.11) 0%, transparent 70%)", top: "25%", right: "-100px", animation: "f2 25s ease-in-out infinite" }} />
        <div style={{ position: "absolute", width: "450px", height: "450px", borderRadius: "50%", background: "radial-gradient(circle, rgba(132,204,22,0.09) 0%, transparent 70%)", bottom: "-80px", left: "35%", animation: "f3 17s ease-in-out infinite" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: "880px", margin: "0 auto", padding: "28px 16px 48px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ display: "inline-block", background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "20px", padding: "4px 16px", color: "#22c55e", fontSize: "13px", fontWeight: 600, marginBottom: "14px", letterSpacing: "0.04em" }}>
            ANGLICKÁ GRAMATIKA
          </div>
          <h1 style={{ color: "#fff", fontSize: "clamp(26px, 5vw, 40px)", fontWeight: 800, margin: 0, lineHeight: 1.15 }}>
            Anglické členy{" "}
            <span style={{ background: "linear-gradient(135deg, #22c55e 0%, #eab308 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              a / an · the · Ø
            </span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", marginTop: "10px", fontSize: "15px" }}>
            Jména lidí · Zvířata · Zeměpisné názvy
          </p>
        </div>

        {/* Tab bar */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center", marginBottom: "28px" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: "9px 18px", borderRadius: "999px", cursor: "pointer", fontSize: "14px", fontWeight: tab === t.id ? 700 : 400, transition: "all 0.4s ease",
              border: tab === t.id ? "1px solid #22c55e" : "1px solid rgba(255,255,255,0.12)",
              background: tab === t.id ? "rgba(34,197,94,0.18)" : "rgba(255,255,255,0.04)",
              color: tab === t.id ? "#22c55e" : "rgba(255,255,255,0.6)",
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {tab === 0 && <OverviewTab />}
        {tab === 1 && <PeopleTab />}
        {tab === 2 && <AnimalsTab />}
        {tab === 3 && <PlacesTab />}
        {tab === 4 && <FlashcardsTab />}
        {tab === 5 && <div style={{ paddingTop: "8px" }}><QuizEngine questions={questions} accentColor="#22c55e" /></div>}
        {tab === 6 && <CheatSheet />}
      </div>
    </div>
  );
}
