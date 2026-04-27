// @title Obhajoba seminárky: Kvalita života v Domažlicích
// @subject Geography
// @topic Obhajoba seminární práce, zdroje a citace
// @template practice

import { useState, useMemo, useCallback } from 'react';

// ── Shuffle helpers ──
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
    const idx = q.options.map((_, i) => i);
    const sIdx = shuffleArray(idx);
    return {
      ...q,
      options: sIdx.map(i => q.options[i]),
      correct: q.correct.map(o => sIdx.indexOf(o))
    };
  });
}
function arrEqual(a, b) {
  if (!a || !b) return false;
  const sa = [...a].sort((x, y) => x - y);
  const sb = [...b].sort((x, y) => x - y);
  return sa.length === sb.length && sa.every((v, i) => v === sb[i]);
}

// ── Quiz Engine ──
function QuizEngine({ questions, accentColor = "#f59e0b" }) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState({});
  const [pendingMulti, setPendingMulti] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [shuffleKey, setShuffleKey] = useState(0);

  const sQ = useMemo(() => shuffleQuestions(questions), [questions, shuffleKey]);
  const q = sQ[idx];
  const isMulti = q.type === "multi";
  const isRevealed = !!revealed[idx];
  const myAnswer = answers[idx] || [];
  const isCorrect = isRevealed && arrEqual(myAnswer, q.correct);
  const score = sQ.filter((q, i) => revealed[i] && arrEqual(answers[i] || [], q.correct)).length;
  const pct = Math.round((score / sQ.length) * 100);

  const goTo = useCallback((i) => {
    setIdx(i);
    setPendingMulti(sQ[i].type === "multi" ? (answers[i] || []) : []);
  }, [answers, sQ]);

  const handleSingle = useCallback((o) => {
    if (isRevealed) return;
    setAnswers(p => ({ ...p, [idx]: [o] }));
    setRevealed(p => ({ ...p, [idx]: true }));
  }, [idx, isRevealed]);

  const toggleMulti = useCallback((o) => {
    if (isRevealed) return;
    setPendingMulti(p => p.includes(o) ? p.filter(i => i !== o) : [...p, o]);
  }, [isRevealed]);

  const submitMulti = useCallback(() => {
    if (pendingMulti.length === 0) return;
    setAnswers(p => ({ ...p, [idx]: [...pendingMulti] }));
    setRevealed(p => ({ ...p, [idx]: true }));
  }, [idx, pendingMulti]);

  const restart = useCallback(() => {
    setIdx(0); setAnswers({}); setRevealed({}); setPendingMulti([]); setShowResults(false);
    setShuffleKey(k => k + 1);
  }, []);

  const activeSet = isMulti ? (isRevealed ? myAnswer : pendingMulti) : myAnswer;

  if (showResults) {
    const msg = pct >= 90 ? "Skvělé! Máš to v malíčku."
      : pct >= 70 ? "Dobré! Pár drobností doladit a jsi připravený."
      : pct >= 50 ? "Slušné, ale ještě se vrať k tabu Citace a Otázky."
      : "Projdi si znovu Zdroje a Otázky obhajoby. Bude to lepší.";
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
        <div style={{ ...glass, textAlign: "center", padding: "40px 48px", maxWidth: "440px" }}>
          <div style={{ color: "#fff", fontSize: "52px", fontWeight: 800 }}>{score} / {sQ.length}</div>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "22px", marginBottom: "16px" }}>{pct} %</div>
          <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "16px", marginBottom: "24px" }}>{msg}</div>
          <button style={{ ...btn, background: accentColor + "55", border: `1px solid ${accentColor}` }} onClick={restart}>Začít znovu</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "720px", margin: "0 auto" }}>
      <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
        {sQ.map((_, i) => {
          let bg = "#4b5563";
          if (i === idx) bg = accentColor;
          else if (revealed[i]) bg = arrEqual(answers[i] || [], sQ[i].correct) ? "#22c55e" : "#ef4444";
          return <div key={i} onClick={() => goTo(i)} style={{ width: "22px", height: "22px", borderRadius: "50%", cursor: "pointer", transition: "background 0.4s ease", background: bg }} />;
        })}
      </div>
      <div style={glass}>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", marginBottom: "6px" }}>Otázka {idx + 1} / {sQ.length}</div>
        <div style={{ color: "#fff", fontSize: "18px", fontWeight: 600, lineHeight: 1.5, marginBottom: "20px" }}>{q.question}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {q.options.map((opt, i) => {
            let border = "1px solid rgba(255,255,255,0.12)";
            let bg = "rgba(255,255,255,0.04)";
            if (isRevealed) {
              if (q.correct.includes(i)) { bg = "rgba(34,197,94,0.15)"; border = "1px solid #22c55e"; }
              else if (activeSet.includes(i)) { bg = "rgba(239,68,68,0.15)"; border = "1px solid #ef4444"; }
            } else if (activeSet.includes(i)) { bg = accentColor + "20"; border = `1px solid ${accentColor}`; }
            return (
              <div key={i} style={{ padding: "12px 16px", borderRadius: "12px", color: "#fff", cursor: "pointer", transition: "all 0.4s ease", display: "flex", alignItems: "center", gap: "10px", userSelect: "none", fontSize: "15px", background: bg, border }} onClick={() => isMulti ? toggleMulti(i) : handleSingle(i)}>
                {isMulti && <span style={{ fontSize: "18px", minWidth: "20px" }}>{activeSet.includes(i) ? "\u2611" : "\u2610"}</span>}
                <span>{opt}</span>
              </div>
            );
          })}
        </div>
        {isMulti && !isRevealed && (
          <button style={{ ...btn, opacity: pendingMulti.length === 0 ? 0.4 : 1, marginTop: "16px" }} onClick={submitMulti} disabled={pendingMulti.length === 0}>Potvrdit</button>
        )}
        {isRevealed && (
          <div style={{ marginTop: "20px", padding: "16px", borderRadius: "14px", border: `1px solid ${isCorrect ? "#22c55e" : "#ef4444"}`, background: "rgba(255,255,255,0.03)" }}>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: "16px", marginBottom: "8px" }}>{isCorrect ? "Správně" : "Špatně"}</div>
            {!isCorrect && <div style={{ color: "#86efac", fontSize: "14px", marginBottom: "6px" }}>Správná odpověď: {q.correct.map(i => q.options[i]).join(", ")}</div>}
            <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", lineHeight: 1.6 }}>{q.explanation}</div>
            {q.tip && <div style={{ color: "#fbbf24", fontSize: "13px", marginTop: "8px", fontStyle: "italic" }}>Tip: {q.tip}</div>}
          </div>
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button style={btn} onClick={() => goTo(idx - 1)} disabled={idx === 0}>← Předchozí</button>
        {idx < sQ.length - 1
          ? <button style={btn} onClick={() => goTo(idx + 1)}>Další →</button>
          : <button style={{ ...btn, background: accentColor + "55", border: `1px solid ${accentColor}` }} onClick={() => setShowResults(true)}>Výsledky →</button>
        }
      </div>
    </div>
  );
}

// ── Styles ──
const glass = {
  background: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "20px",
  padding: "24px",
  transition: "all 0.4s ease"
};
const btn = {
  padding: "10px 22px",
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: "10px",
  color: "#fff",
  cursor: "pointer",
  fontSize: "15px",
  transition: "all 0.4s ease"
};

// ── Reusable: Collapsible ──
function Collapse({ title, sub, children, defaultOpen = false, accent = "#f59e0b" }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ ...glass, marginBottom: "12px", padding: "18px 22px" }}>
      <div onClick={() => setOpen(!open)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
        <div style={{ flex: 1 }}>
          <div style={{ color: "#fff", fontSize: "16px", fontWeight: 600 }}>{title}</div>
          {sub && <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", marginTop: "3px" }}>{sub}</div>}
        </div>
        <span style={{ color: accent, fontSize: "20px", transition: "transform 0.4s ease", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
      </div>
      {open && <div style={{ marginTop: "16px", color: "rgba(255,255,255,0.85)", fontSize: "14.5px", lineHeight: 1.7 }}>{children}</div>}
    </div>
  );
}

// ── DATA: SOURCES ──
const sources = [
  {
    id: "beneova-2016", type: "práce", cat: "mono",
    title: "Alternativní indexy a indikátory rozvoje v odrazu kvality života a udržitelnosti",
    authors: "Beňová, M.", year: "2016",
    detail: "Bakalářská práce, FSV UK Praha",
    whatIs: "Bakalářka mapující alternativní indexy (mimo HDP) — GNH, HDI, GPI atd. Slouží jako přehled českojazyčné literatury k tématu.",
    placesUsed: [
      { p: 6, sec: "1.3 GNH", ctx: "Zdroj pod Tab. 1 (devět domén GNH a jejich analogie pro Domažlice)." },
      { p: 18, sec: "5.2 Hypotéza H4", ctx: "Kulturní vitalita komunity jako klíčová doména KŽ — zdůvodnění H4." },
      { p: 21, sec: "Závěr", ctx: "Argument, že chodská tradice patří mezi silné stránky regionu (vychází z GNH konceptu)." }
    ],
    defense: "Jde o bakalářku — méně robustní než článek v recenzovaném časopise. Pokud se profesor zeptá: 'Český zdroj k alternativním indikátorům, kde jsem našel přehledně všech 9 domén GNH. Beňová cituje primární zdroje, takže mi to posloužilo jako rozcestník.'"
  },
  {
    id: "dragomirecka-2006", type: "kniha", cat: "mono",
    title: "WHOQOL-BREF, WHOQOL-100. Příručka pro uživatele české verze",
    authors: "Dragomirecká, E. a Bartoňová, J.", year: "2006",
    detail: "Praha: Psychiatrické centrum. ISBN 80-85121-82-4",
    whatIs: "Oficiální česká adaptace dotazníku WHO pro měření kvality života. Obsahuje definici KŽ a validovaný nástroj.",
    placesUsed: [
      { p: 4, sec: "Úvod", ctx: "Definice KŽ podle WHO: \u201Evnímání vlastní pozice v životě v kontextu kultury...\u201C" },
      { p: 19, sec: "6.1 Metodika", ctx: "Inspirace pro strukturu vlastního dotazníku — WHOQOL-BREF jako vzor." }
    ],
    defense: "Definice WHO není citována přímo z WHO, ale z české odborné literatury, která ji standardně přebírá. Pokud se zeptá: \u201ePoužil jsem české vydání, abych měl pracovní definici a zároveň jsem si ověřil, jak se v ČR měří KŽ standardizovaně. Originální definice je z WHOQOL Group 1995.\u201C"
  },
  {
    id: "havlicek-2005", type: "kniha", cat: "mono",
    title: "Vybrané teoreticko-metodologické aspekty geografického výzkumu periferních oblastí",
    authors: "Havlíček, T. a kol.", year: "2005",
    detail: "In: Novotná, M. (ed.) Problémy periferních oblastí. Praha: PřF UK",
    whatIs: "Sborník z konference k periferiím v ČR. Obsahuje příspěvek o klasifikaci periferií (vč. Strmiska 1999).",
    placesUsed: [
      { p: 8, sec: "2.3 Periferie", ctx: "Strmiska (1999, in Havlíček et al., 2005) — tři znaky periferie: vzdálenost, odlišnost, závislost." }
    ],
    defense: "POZOR — slabina: V textu (str. 8) je citováno \u201E(Havlíček a Chromý, 2001, s. 1\u201311)\u201C u definice \u201Especifická území s poruchou funkčně-prostorových vztahů\u201C, ale v seznamu literatury TENTO článek z roku 2001 NENÍ — je tam jen sborník Havlíček et al. 2005. Pokud na to profesor poukáže: \u201EUznávám, je to chyba — měl jsem do seznamu doplnit i Havlíček a Chromý (2001), odkud je převzata přímá citace. Uvedl jsem jen souhrnný sborník z roku 2005, který na tu starší práci navazuje.\u201C"
  },
  {
    id: "hendl-2005", type: "kniha", cat: "mono",
    title: "Kvalitativní výzkum: základní metody a aplikace",
    authors: "Hendl, J.", year: "2005",
    detail: "Praha: Portál. ISBN 80-7367-040-2",
    whatIs: "Standardní české kompendium k výzkumným metodám. Pokrývá kvalitativní i smíšené designy.",
    placesUsed: [
      { p: 20, sec: "6.3a Rozhovory", ctx: "Zdůvodnění smíšeného designu (kvantitativní dotazník + kvalitativní rozhovory)." }
    ],
    defense: "Klasická metodologická kniha — bezpečný zdroj. \u201ESmíšený design jsem zvolil, protože dotazník zachytí škálu, ale rozhovory dají kontext. Hendl tento přístup popisuje jako legitimní cestu, jak doplnit kvantitativní limity.\u201C"
  },
  {
    id: "hermanova-2012", type: "článek", cat: "mono",
    title: "Kvalita života a její modely v současném sociálním výzkumu",
    authors: "Heřmanová, E.", year: "2012",
    detail: "Sociológia, 44(4)",
    whatIs: "Recenzovaný článek od přední české autorky k pojetí KŽ. Definuje KŽ jako reflexi objektivních a subjektivních stránek.",
    placesUsed: [
      { p: 5, sec: "1.1 Pojem KŽ", ctx: "Interdisciplinarita pojmu (s. 408) a definice KŽ (s. 412)." },
      { p: 6, sec: "1.3 GNH", ctx: "Heřmanová hodnotí GNH jako cennou inspiraci přesto, že má bhútánský původ." }
    ],
    defense: "Heřmanová je etablovaná česká autorka — bezproblémový zdroj. \u201ECituji ji u základní definice, protože poskytuje široké geografické pojetí: KŽ není jen psychologie nebo ekonomie, ale i prostorový jev.\u201C"
  },
  {
    id: "ira-andrasko-2007", type: "článek", cat: "mono",
    title: "Kvalita života z pohľadu humánnej geografie",
    authors: "Ira, V. a Andráško, I.", year: "2007",
    detail: "Geografický časopis, 59(2), s. 159–179",
    whatIs: "Slovenský recenzovaný článek — geografický rámec pro výzkum KŽ. Rozlišuje objektivní a subjektivní dimenzi.",
    placesUsed: [
      { p: 5, sec: "1.1", ctx: "KŽ jako jev představující charakter lidského života (s. 165)." },
      { p: 5, sec: "1.2", ctx: "Klíčové rozlišení objektivní vs. subjektivní dimenze (s. 164)." }
    ],
    defense: "Klíčový teoretický zdroj pro celou strukturu práce — to, že rozdělujete kapitoly na objektivní (3.) a subjektivní (4.) ukazatele, vychází přímo odsud. \u201EIra a Andráško mi dali rámec, podle kterého jsem celou práci strukturoval.\u201C"
  },
  {
    id: "kuldova-2005", type: "článek", cat: "mono",
    title: "Podbořansko – zapomenutá periferie",
    authors: "Kuldová, S.", year: "2005",
    detail: "Geografické rozhledy, 14(5), s. 132–133",
    whatIs: "Krátký článek o periferním regionu Podbořansko — případová studie odlivu mladých.",
    placesUsed: [
      { p: 18, sec: "5.2 Hypotéza H3", ctx: "Doložený trend odlivu mladých z menších měst — opora pro hypotézu H3." }
    ],
    defense: "Krátký článek (2 strany), ale relevantní — analogická situace k Domažlicím. \u201EVyužil jsem ji jako empirickou oporu hypotézy o odlivu mladých.\u201C"
  },
  {
    id: "murgas-2019", type: "článek", cat: "mono",
    title: "Can Easterlin's paradox be applied to the development of satisfaction with life or does the explanation lie in cultural geography?",
    authors: "Murgaš, F.", year: "2019",
    detail: "Geographical Journal, 71(1), 3–14",
    whatIs: "Recenzovaný článek zpochybňující obecnou platnost Easterlinova paradoxu — důležitý pro tezi, že měřit KŽ jen přes HDP nestačí.",
    placesUsed: [
      { p: 5, sec: "1.2", ctx: "Easterlinův paradox: spokojenost neroste s příjmem nad určitou hranicí (s. 13–14)." },
      { p: 16, sec: "4.1", ctx: "Argument pro měření subjektivního vnímání, ne jen příjmů." }
    ],
    defense: "Mezinárodní recenzovaný časopis — silný zdroj. \u201EPotřeboval jsem podložit, proč objektivní data nestačí — Easterlinův paradox je standardní argument.\u201C Kdyby chtěl detail: paradox říká, že nad určitou úrovní příjmů spokojenost stagnuje nebo klesá."
  },
  {
    id: "musil-muller-2008", type: "článek", cat: "mono",
    title: "Vnitřní periferie v České republice jako mechanismus sociální exkluze",
    authors: "Musil, J. a Müller, J.", year: "2008",
    detail: "Sociologický časopis, 44(2), s. 321–348",
    whatIs: "Klíčový článek k vnitřním periferiím v ČR. Definuje typické rysy: stagnace, úbytek obyvatel, stárnutí, horší dopravní dostupnost.",
    placesUsed: [
      { p: 8, sec: "2.3", ctx: "Typické znaky periferních území (s. 330–331) — Domažlice některé z nich vykazují." },
      { p: 18, sec: "5.2 H2", ctx: "Nižší mzdové hladiny v periferiích — opora pro H2." }
    ],
    defense: "Klasická česká reference k periferiím. \u201EArgument: Domažlice vykazují některé znaky vnitřní periferie (záporná přirozená měna, stárnutí, podprůměrné mzdy), ale ne všechny — proto píši, že jsou \u201Eněkde mezi\u201C.\u201C"
  },
  {
    id: "netrdova-petkovova-2021", type: "článek", cat: "mono",
    title: "Kvalita života v regionech v návaznosti na strategii ČR 2030",
    authors: "Netrdová, P. a Petkovová, L.", year: "2021",
    detail: "Urbanismus a územní rozvoj, XXIV(2)",
    whatIs: "Aktuální článek k regionální KŽ v ČR — vazba na národní strategii.",
    placesUsed: [
      { p: 5, sec: "1.2", ctx: "Tvrzení, že objektivní KŽ přímo ovlivňuje subjektivní vnímání (s. 32)." }
    ],
    defense: "Aktuální zdroj (2021) — ukazuje, že téma neoslovili jen klasici. \u201EProtipól k Easterlinovi: tyto autorky tvrdí, že objektivní podmínky subjektivní spokojenost přece jen ovlivňují.\u201C"
  },
  {
    id: "perlin-bednarova-2020", type: "článek", cat: "mono",
    title: "Jak na rozvoj českých obcí?",
    authors: "Perlín, R. a Bednářová, H.", year: "2020",
    detail: "Geografické rozhledy, 29(4), s. 4–5",
    whatIs: "Krátký článek (Perlín je významná postava české regionální geografie) o rozvoji obcí — důraz na zapojení obyvatel.",
    placesUsed: [
      { p: 21, sec: "Závěr", ctx: "Argument: města naslouchající obyvatelům se rozvíjejí lépe — opora pro doporučení dotazníku." }
    ],
    defense: "Perlín je etablovaný geograf — bezproblémový zdroj. \u201EUžívám ho v závěru, abych odůvodnil, proč doporučuji městu provést dotazníkové šetření.\u201C"
  },
  {
    id: "prokop-2018", type: "kniha", cat: "mono",
    title: "Kvalita života: expertní studie",
    authors: "Prokop, D. a kol.", year: "2018",
    detail: "Praha: Aspen Institute CE",
    whatIs: "Velká studie Aspen Institute pod vedením D. Prokopa. Spojuje data o KŽ s volebním chováním a exekucemi.",
    placesUsed: [
      { p: 13, sec: "3.4", ctx: "Atmosféra regionu zasaženého exekucemi (s. 74–75)." },
      { p: 14, sec: "3.4", ctx: "V některých částech ČR 15–25 % populace v exekucích (s. 74–75)." },
      { p: 15, sec: "3.6", ctx: "Korelace nízké KŽ s extrémním voličským chováním (s. 84)." },
      { p: 16, sec: "4.2", ctx: "Autor interaktivní mapy KŽ na iROZHLAS." },
      { p: 21, sec: "Závěr", ctx: "Klíčový zdroj propojující objektivní data s protestním hlasováním." }
    ],
    defense: "POZOR — slabina: Na str. 13 je citováno \u201Ejak upozorňuje Prokop (2019)\u201C, ale v seznamu literatury je pouze Prokop a kol. (2018). Záznam pro \u201EProkop 2019\u201C chybí. Pokud se profesor zeptá: \u201EUznávám, je to chyba — buď jsem chybně uvedl rok (mělo být 2018), nebo jsem zapomněl doplnit pozdější článek do seznamu. V kontextu je jasné, že odkazuji na stejnou Prokopovu studii o KŽ.\u201C Jinak nejdůležitější český zdroj — Daniel Prokop je hlavní postava sociologického výzkumu KŽ v ČR."
  },
  {
    id: "simon-loquenz-2013", type: "článek", cat: "mono",
    title: "Amenitní migrace",
    authors: "Šimon, M. a Loquenz, J.", year: "2013",
    detail: "Geografické rozhledy, 23(2), s. 26–27",
    whatIs: "Krátký článek vysvětlující koncept amenitní migrace (přesun za prostředím a kulturou).",
    placesUsed: [
      { p: 11, sec: "3.2", ctx: "Definice amenitní migrace (s. 26)." },
      { p: 12, sec: "3.2", ctx: "Limity konceptu — sama amenitní migrace neřeší odliv mladých." }
    ],
    defense: "POZOR — drobná nekonzistence: V seznamu je \u201EŠimon, M. a Loquenz, J.\u201C, ale v textu na str. 11–12 je dvakrát uvedeno jako \u201ELoquenz a Šimon\u201C — pořadí autorů je obrácené. Pokud se zeptá: \u201EUznávám, formální chyba — v textu jsem prohodil pořadí autorů. Správné pořadí (podle časopisu) je Šimon a Loquenz.\u201C Jinak: \u201EAmenitní migrace vysvětluje, proč Domažlice neztrácejí obyvatele přes zápornou přirozenou měnu — kladné migrační saldo (+9,0 ‰ v 2023).\u201C"
  },
  // Statistical databases
  {
    id: "csu-okresy-2024", type: "data", cat: "data",
    title: "Charakteristiky okresů Plzeňského kraje",
    authors: "Český statistický úřad", year: "2024",
    detail: "csu.gov.cz/plk/charakteristiky-okresu",
    whatIs: "Oficiální charakteristika okresů ČSÚ — průmyslový charakter, demografie, nezaměstnanost.",
    placesUsed: [
      { p: 7, sec: "2.1", ctx: "Citace \u201Eprůmyslově zemědělský\u201C okres s výhodami z příhraničí." },
      { p: 14, sec: "3.5", ctx: "Nezaměstnanost a počty uchazečů v okrese." }
    ],
    defense: "Primární zdroj — bezproblémový. \u201EBeru z ČSÚ veřejně dostupná data o okrese.\u201C"
  },
  {
    id: "csu-demograficke-2025", type: "data", cat: "data",
    title: "Databáze demografických údajů za obce ČR",
    authors: "Český statistický úřad", year: "2025",
    detail: "csu.gov.cz/databaze-demografickych-udaju-za-obce-cr",
    whatIs: "Databáze obyvatelstva, narození, zemřelí, migrace pro každou obec ČR.",
    placesUsed: [
      { p: 7, sec: "2.1", ctx: "Počet obyvatel 11 133 k 1.1.2025, migrační saldo." },
      { p: 9, sec: "3.1", ctx: "Demografická data Domažlic — věkové skupiny, index stáří." },
      { p: 10, sec: "3.2", ctx: "Migrační saldo +9,0 ‰ v okrese 2023." }
    ],
    defense: "Primární zdroj — všechna konkrétní čísla mám odsud. \u201EJakékoliv číslo o populaci si dokážu obhájit přes ČSÚ.\u201C"
  },
  {
    id: "csu-nadeje-2025", type: "data", cat: "data",
    title: "Naděje dožití v okresech a SO ORP Plzeňského kraje",
    authors: "Český statistický úřad", year: "2025",
    detail: "csu.gov.cz/plk/nadeje_doziti_v_okresech_a_so_orp_plzenskeho_kraje",
    whatIs: "Tabulka 10.10 ČSÚ — naděje dožití po pětiletkách.",
    placesUsed: [
      { p: 12, sec: "3.3", ctx: "Tab. 3 — naděje dožití mužů v okrese Domažlice 2001–2024." }
    ],
    defense: "Primární zdroj. \u201ETabulka přímo z ČSÚ — žádná interpretace, jen převzatá data.\u201C"
  },
  {
    id: "datapaq-2024", type: "data", cat: "data",
    title: "DataPAQ — Regionální data o vzdělávání a sociálních podmínkách",
    authors: "PAQ Research", year: "2024 (data 2025)",
    detail: "datapaq.cz",
    whatIs: "Portál PAQ Research (skupina kolem D. Prokopa) — agreguje data ČSÚ, EKČR a Czech Household Panel Study do snadno čitelných grafů.",
    placesUsed: [
      { p: 9, sec: "3.1", ctx: "Obr. 1 — podíl dětí a seniorů ve srovnávaných městech." },
      { p: 10, sec: "3.1", ctx: "Obr. 2 — vývoj podílu seniorů 2018–2024." },
      { p: 11, sec: "3.2", ctx: "Obr. 3, 4 — migrační saldo a přírůstek." },
      { p: 12, sec: "3.3", ctx: "Obr. 5 — naděje dožití mužů a žen v 65 letech." },
      { p: 13, sec: "3.4", ctx: "Obr. 6 — vývoj exekucí 2017–2025." },
      { p: 14, sec: "3.5", ctx: "Obr. 7 — nezaměstnanost a exekuce." },
      { p: 15, sec: "3.6", ctx: "Obr. 8 — podíl hlasů SPD ve volbách 2025." }
    ],
    defense: "DataPAQ je sekundární zdroj — agreguje data z primárních zdrojů (ČSÚ, EKČR, volby.cz). \u201EPoužil jsem DataPAQ kvůli vizualizacím — všechna data ale původně pochází z primárních zdrojů, které DataPAQ uvádí (zdroj dat: ČSÚ atd.). Pro spolehlivost si lze každé číslo dohledat zpět.\u201C"
  },
  {
    id: "ekcr-2025", type: "data", cat: "data",
    title: "Otevřená data o exekucích — interaktivní mapa",
    authors: "Exekutorská komora ČR", year: "2025",
    detail: "statistiky.ekcr.info/mapa",
    whatIs: "Oficiální mapa exekucí — počty dlužníků, řízení, podíl populace v exekuci pro každou obec.",
    placesUsed: [
      { p: 14, sec: "3.4", ctx: "630 osob v exekuci v Domažlicích, 2 951 řízení (~5,6 % obyvatel)." }
    ],
    defense: "Primární oficiální zdroj — přímo Exekutorská komora. Bezproblémové."
  },
  {
    id: "obce-v-datech-2024", type: "data", cat: "data",
    title: "Výsledky indexu kvality života 2024",
    authors: "Obce v datech", year: "2024",
    detail: "obcevdatech.cz",
    whatIs: "Komerční index KŽ — hodnotí 206 měst ve 3 oblastech (zdraví/prostředí, materiální zabezpečení, vztahy/služby) na základě 80 datových zdrojů.",
    placesUsed: [
      { p: 16, sec: "4.2", ctx: "Domažlice 21.–40. místo z 206, krajské skóre 6,4/10 (1. v Plzeňském kraji za zdraví a prostředí)." },
      { p: 21, sec: "Závěr", ctx: "9. místo v ČR za zdraví a prostředí, ale 133. v indexu vztahy a služby." }
    ],
    defense: "\u201EObce v datech je etablovaný komerční index — používá ho většina českých měst pro benchmarking. Pro Domažlice je zajímavé, že vykazují velký rozdíl mezi prostředím (špička) a službami (133. místo).\u201C"
  },
  // Internet sources
  {
    id: "datank-2024", type: "web", cat: "web",
    title: "Místo pro život 2024",
    authors: "Datank", year: "2024",
    detail: "denik.cz/cesi-v-cislech",
    whatIs: "Průzkum Datank pro Deník — kombinuje objektivní data s anketou o subjektivní spokojenosti.",
    placesUsed: [
      { p: 16, sec: "4.2", ctx: "Plzeňský kraj 8. ze 14 v celkovém indexu, ALE 3. v subjektivní spokojenosti." },
      { p: 18, sec: "5.2 H1", ctx: "Empirická opora pro hypotézu H1 (subjektivní spokojenost vyšší než objektivní podmínky)." }
    ],
    defense: "\u201EKlíčový pro hypotézu H1 — Datank ukázal, že obyvatelé Plzeňského kraje jsou subjektivně spokojenější, než by odpovídalo statistikám.\u201C"
  },
  {
    id: "exekuceinfo-2025", type: "web", cat: "web",
    title: "Aktuální stav exekucí v ČR — statistiky a trendy",
    authors: "ExekuceInfo.cz", year: "2025",
    detail: "exekuceinfo.cz/pruvodce/aktualni-stav-exekuci",
    whatIs: "Specializovaný portál — agreguje statistiky exekucí v ČR.",
    placesUsed: [
      { p: 13, sec: "3.4", ctx: "Celostátní čísla — 607 000 dlužníků, 3,2 mil. exekucí (2025)." },
      { p: 14, sec: "3.4 Tab. 4", ctx: "Vývoj exekucí 2017–2025." }
    ],
    defense: "Zprostředkující zdroj. Pokud se zeptá na spolehlivost: \u201EProvozuje ho organizace blízko EKČR, čísla jsou veřejně dostupná.\u201C"
  },
  {
    id: "idomazlice", type: "web", cat: "web",
    title: "iDomažlice — oficiální web města",
    authors: "Město Domažlice", year: "b.d.",
    detail: "idomazlice.cz",
    whatIs: "Oficiální web — informace o městě, akcích, památkách.",
    placesUsed: [
      { p: 7, sec: "2.1", ctx: "Citace o chodských slavnostech (\u201Enejstarší a největší národopisné slavnosti v ČR\u201C)." }
    ],
    defense: "Oficiální městský web — pro popis kulturní identity bezproblémový. \u201EOficiální zdroj o tradici města.\u201C"
  },
  {
    id: "irozhlas-2018", type: "web", cat: "web",
    title: "Interaktivní mapa kvality života",
    authors: "iROZHLAS", year: "2018",
    detail: "irozhlas.cz",
    whatIs: "Interaktivní mapa KŽ na úrovni okresů — vizualizuje výsledky studie Prokop a kol. (2018).",
    placesUsed: [
      { p: 16, sec: "4.2", ctx: "Domažlice 29. místo ze 77 okresů, skóre 67,64/100 — 3. nejlepší v Plzeňském kraji." }
    ],
    defense: "Mapa na základě dat z Prokop a kol. (2018) — primárním zdrojem je tedy ta studie. \u201EiROZHLAS je redakční zpracování.\u201C"
  },
  {
    id: "klamar-gavalova-2018", type: "článek", cat: "web",
    title: "Regional application of the Gross National Happiness Index in the context of the quality of life in Slovakia",
    authors: "Klamár, R. a Gavaľová, A.", year: "2018",
    detail: "Geographical Journal, 70(4), 315–333. DOI: 10.31577/geogrcas.2018.70.4.17",
    whatIs: "Mezinárodní recenzovaný článek — aplikace GNH na regionální úrovni na Slovensku. Praktický příklad, jak se dá GNH \u201Epřevést\u201C na evropské podmínky.",
    placesUsed: [
      { p: 6, sec: "1.3", ctx: "Příklad úspěšné regionální aplikace GNH (s. 315–333)." }
    ],
    defense: "\u201EArgument proti námitce \u201EGNH je bhútánský, neaplikovatelný\u201C: ti dva už ho úspěšně aplikovali v podmínkách velmi podobných ČR.\u201C Mezinárodní recenzovaný časopis — silný zdroj."
  },
  {
    id: "zivot-v-regionech", type: "web", cat: "web",
    title: "Portál Život v regionech — Metodika",
    authors: "MMR ČR", year: "b.d.",
    detail: "zivotvregionech.cz/metodika",
    whatIs: "Portál Ministerstva pro místní rozvoj — metodika hodnocení regionálního rozvoje.",
    placesUsed: [
      { p: 16, sec: "4.1", ctx: "Argument, že většina indexů KŽ ignoruje subjektivní vnímání." }
    ],
    defense: "\u201EVládní zdroj — slouží k podpoře argumentu, že existující indexy mají slepá místa.\u201C"
  },
  {
    id: "pracomat", type: "web", cat: "web",
    title: "Region Domažlice",
    authors: "Pracomat.cz", year: "2025",
    detail: "pracomat.cz/region/domazlice",
    whatIs: "Pracovní portál — agregátor dat o trhu práce v jednotlivých regionech.",
    placesUsed: [
      { p: 14, sec: "3.5", ctx: "Nezaměstnanost 4,15 % v únoru 2025." },
      { p: 15, sec: "3.5", ctx: "Průměrná hrubá mzda 46 767 Kč v okrese." }
    ],
    defense: "Sekundární zdroj — Pracomat agreguje data ČSÚ a MPSV. Pokud se zeptá: \u201EAktuální čísla, která ČSÚ zveřejňuje s prodlevou — Pracomat je rychlejší.\u201C"
  },
  {
    id: "stastne-cesko", type: "web", cat: "web",
    title: "Co je hrubé národní štěstí?",
    authors: "Šťastné Česko", year: "b.d.",
    detail: "stastnecesko.cz/hrube-domaci-stesti",
    whatIs: "České iniciativní hnutí prosazující GNH jako alternativu k HDP. Stránka popisuje 4 pilíře a 9 domén.",
    placesUsed: [
      { p: 6, sec: "1.3", ctx: "4 pilíře GNH (udržitelnost, kultura, prostředí, dobrá správa)." },
      { p: 6, sec: "Tab. 1", ctx: "Spolu s Beňovou (2016) zdroj devíti domén." }
    ],
    defense: "Aktivistický zdroj — méně formální. Pokud se zeptá: \u201EPro stručný popis pilířů GNH je dostatečný, ale samotnou definici a teoretický rámec čerpám z odborné literatury (Beňová, Klamár a Gavaľová).\u201C"
  },
  {
    id: "espon-uur", type: "web", cat: "web",
    title: "ESPON: Teze — vnitřní periferie",
    authors: "Ústav územního rozvoje", year: "2018/2019",
    detail: "uur.cz/media/am3facor/espon-teze-vnitrni-periferie-01-2019.pdf",
    whatIs: "Oficiální zpráva ESPON / Ústavu územního rozvoje — definuje vnitřní periferie v evropském kontextu.",
    placesUsed: [
      { p: 8, sec: "2.3", ctx: "Definice vnitřních periferií jako území \u201Es obecně nižší výkonností a horší dostupností služeb\u201C." }
    ],
    defense: "Oficiální zdroj — ÚÚR je státní instituce. \u201EBezproblémový zdroj k základní definici.\u201C"
  },
  {
    id: "uzis-2023", type: "web", cat: "web",
    title: "Demografický vývoj obyvatelstva ČR",
    authors: "Ústav zdravotnických informací a statistiky ČR", year: "2023",
    detail: "uzis.cz/res/file/projekty/modely-predikce/03-demograficky-vyvoj-obyvatelstva-cr.pdf",
    whatIs: "Projekce demografického vývoje ČR do 2035 — pokles dětské populace, růst seniorů 80+.",
    placesUsed: [
      { p: 10, sec: "3.1", ctx: "Projekce — pokles mladých 0–20 o 12,9 %, růst 80+ o 68,3 % do 2035." }
    ],
    defense: "Primární odborný zdroj. \u201EÚZIS je standard pro demografické projekce.\u201C"
  }
];

// ── DATA: Citations by chapter (chronological walkthrough) ──
const citations = [
  {
    chapter: "Úvod (str. 4)",
    items: [
      { quote: "\u201Evnímání vlastní pozice v životě v kontextu kultury a hodnotového systému...\u201C", cite: "Dragomirecká a Bartoňová, 2006, s. 7", why: "Definice WHO — uvádí pojem KŽ na začátek práce. Doslovná citace, proto strana." }
    ]
  },
  {
    chapter: "1.1 Co je KŽ (str. 5)",
    items: [
      { quote: "Pojem KŽ je interdisciplinární — psychologie, ekonomie, sociologie, environmentalistika i medicína.", cite: "Heřmanová, 2012, s. 408", why: "Parafráze — uvádí, že téma má širší rámec. Strana protože konkrétní odkaz." },
      { quote: "Z pohledu geografie můžeme KŽ vnímat jako jev představující charakter lidského života.", cite: "Ira a Andráško, 2007, s. 165", why: "Parafráze — geografický pohled (důležité, je to seminárka ze ZEMĚPISU)." },
      { quote: "\u201Ereflexe objektivních environmentálních podmínek a sebereflexe vnitřního prostředí člověka...\u201C", cite: "Heřmanová, 2012, s. 412", why: "Doslovná citace — definice KŽ použitá pro celou práci." }
    ]
  },
  {
    chapter: "1.2 Objektivní vs. subjektivní (str. 5)",
    items: [
      { quote: "Objektivní dimenze = vnější podmínky, subjektivní = osobní vstupy člověka.", cite: "Ira a Andráško, 2007, s. 164", why: "Parafráze — rámec celé struktury práce (kapitoly 3 a 4)." },
      { quote: "Objektivní KŽ ovlivňuje subjektivní vnímání.", cite: "Netrdová a Petkovová, 2021, s. 32", why: "Argument PRO propojení obou dimenzí — protiváha k Easterlinovi." },
      { quote: "Easterlinův paradox: nad určitou úrovní příjmů spokojenost se životem neroste.", cite: "Murgaš, 2019, s. 13–14", why: "Argument PROTI redukci KŽ na HDP — důvod proč se zabývat i subjektivní stránkou." }
    ]
  },
  {
    chapter: "1.3 GNH (str. 6)",
    items: [
      { quote: "GNH stojí na 4 pilířích: udržitelný rozvoj, kulturní hodnoty, prostředí, dobrá správa.", cite: "Šťastné Česko, online", why: "Stručný a přehledný popis pilířů." },
      { quote: "Aplikace GNH na regionální úrovni byla úspěšná na Slovensku.", cite: "Klamár a Gavaľová, 2018, s. 315–333", why: "Důkaz, že GNH se dá aplikovat i mimo Bhútán — relevantní pro ČR." },
      { quote: "Tab. 1 — devět domén GNH a jejich analogie pro Domažlice.", cite: "Šťastné Česko (online), Beňová (2016), vlastní zpracování", why: "Vlastní syntéza — kombinace zdrojů + vlastní převod na Domažlice." }
    ]
  },
  {
    chapter: "2.1 Domažlice — poloha (str. 7)",
    items: [
      { quote: "11 133 obyvatel, 117. místo mezi českými městy, kladné migrační saldo.", cite: "ČSÚ, 2025", why: "Primární data o velikosti města." },
      { quote: "\u201Eprůmyslově zemědělský okres s výhodami v relativně zdravém prostředí a spolupráci se zahraničím\u201C", cite: "ČSÚ, Charakteristika okresu Domažlice, online", why: "Doslovná citace — oficiální charakteristika." },
      { quote: "Chodské slavnosti — \u201Enejstarší a největší národopisné slavnosti v ČR\u201C", cite: "idomazlice.cz", why: "Doslovná citace — oficiální městský zdroj o kulturní identitě." }
    ]
  },
  {
    chapter: "2.3 Periferie (str. 8)",
    items: [
      { quote: "Vnitřní periferie — \u201Eobecná výkonnost, úroveň rozvoje, dostupnost služeb a kvalita života zaostávají za zbytkem země\u201C", cite: "espon.eu, 2018", why: "Definice vnitřní periferie." },
      { quote: "\u201Especifická území s poruchou funkčně-prostorových vztahů\u201C", cite: "Havlíček a Chromý, 2001, s. 1–11", why: "POZOR: cituji v textu, ale tento záznam NENÍ v seznamu literatury — je tam jen Havlíček et al. 2005. Pravděpodobně chyba v citaci." },
      { quote: "Strmiska redukoval definici na tři znaky: vzdálenost, odlišnost, závislost.", cite: "Strmiska 1999, in Havlíček et al., 2005", why: "Sekundární citace — uvádím, že čerpám zprostředkovaně přes pozdější sborník." },
      { quote: "Periferní území typicky vykazují stagnaci, úbytek obyvatel, stárnutí, horší dopravu.", cite: "Musil a Müller, 2008, s. 330–331", why: "Argument: některé znaky Domažlice splňují (stárnutí, podprůměrné mzdy)." }
    ]
  },
  {
    chapter: "3.1 Demografie (str. 9–10)",
    items: [
      { quote: "55 914 obyvatel okresu, index stáří 131,8.", cite: "ČSÚ, 2024", why: "Primární data o věkové struktuře." },
      { quote: "Obr. 1 (podíl dětí a seniorů ve srovnávaných městech).", cite: "DataPAQ, 2025", why: "Vizualizace dat ČSÚ." },
      { quote: "Do 2035 pokles mladých 0–20 o 12,9 %, růst 80+ o 68,3 %.", cite: "ÚZIS, 2023", why: "Projekce — opora pro tezi o stárnutí." }
    ]
  },
  {
    chapter: "3.2 Migrace (str. 10–12)",
    items: [
      { quote: "Migrační saldo +9,0 ‰ v 2023 (vs. +25,3 ‰ v 2022 — vliv ukrajinských uprchlíků).", cite: "ČSÚ, 2024", why: "Vysvětlení anomálie 2022." },
      { quote: "Amenitní migrace — \u201Etrvalý přesun obyvatel za lepším životním prostředím\u201C", cite: "Loquenz a Šimon, 2013, s. 26", why: "POZOR: pořadí autorů je obrácené. V seznamu \u201EŠimon a Loquenz\u201C, v textu \u201ELoquenz a Šimon\u201C." },
      { quote: "Sama amenitní migrace ale nevyřeší odliv mladých.", cite: "Loquenz a Šimon, 2013, s. 26", why: "Limit konceptu — opora pro tezi, že je třeba dotazník." }
    ]
  },
  {
    chapter: "3.3 Naděje dožití (str. 12)",
    items: [
      { quote: "Tab. 3 — naděje dožití mužů v okrese 2001–2024.", cite: "ČSÚ, Naděje dožití (online)", why: "Tabulka 10.10 ČSÚ — primární data." }
    ]
  },
  {
    chapter: "3.4 Exekuce (str. 13–14)",
    items: [
      { quote: "\u201Etakové množství [lidí v exekucích] zcela mění atmosféru celého regionu\u201C", cite: "Prokop (2019)", why: "POZOR: \u201E2019\u201C v textu, ale v seznamu je jen Prokop a kol. (2018). Pravděpodobně chyba — měl jsem citovat jako 2018." },
      { quote: "Celostátně 3,2 mil. exekucí, 607 000 dlužníků (2025).", cite: "ExekuceInfo.cz, 2025", why: "Aktuální celostátní číslo." },
      { quote: "V Domažlicích 630 osob v exekuci, 2 951 řízení (~5,6 % obyvatel).", cite: "EKČR", why: "Primární data — Exekutorská komora." },
      { quote: "\u201Eexekucemi je zasaženo v některých částech Česka 15–25 % populace\u201C", cite: "Prokop, 2018, s. 74–75", why: "Doslovná citace — kontext nerovnoměrného rozložení KŽ v ČR." }
    ]
  },
  {
    chapter: "3.5 Ekonomika (str. 14–15)",
    items: [
      { quote: "Nezaměstnanost 3,02 % — třetí nejnižší v Plzeňském kraji.", cite: "ČSÚ, 2024", why: "Primární data o trhu práce." },
      { quote: "Únor 2025: nezaměstnanost 4,15 %, průměrná mzda 46 767 Kč.", cite: "pracomat.cz", why: "Aktuální data — rychlejší než ČSÚ." }
    ]
  },
  {
    chapter: "3.6 Volby (str. 15)",
    items: [
      { quote: "\u201Ek výraznému nárůstu extrémního voličského chování dochází zejména ve čtvrtině obyvatel s nejnižší kvalitou života\u201C", cite: "Prokop, 2018, s. 84", why: "Doslovná citace — propojení voleb a KŽ." },
      { quote: "V ORP Domažlice 10 % hlasů pro SPD (vs. 7,78 % celostátně).", cite: "DataPAQ, 2025", why: "Aktuální výsledky voleb 2025 (volby.cz)." },
      { quote: "Regiony s nižšími mzdami a vyššími exekucemi volí protestněji.", cite: "Prokop, 2018, s. 74–75", why: "Argument: SPD jako indikátor nespokojenosti." }
    ]
  },
  {
    chapter: "4.2 Existující měření KŽ (str. 16)",
    items: [
      { quote: "Domažlice 21.–40. místo z 206, krajské skóre 6,4/10.", cite: "Obce v datech, 2025", why: "Index KŽ — pozice Domažlic v žebříčku." },
      { quote: "Domažlice 29. místo ze 77 okresů, 3. nejlepší v Plzeňském kraji.", cite: "iROZHLAS, 2018", why: "Interaktivní mapa KŽ — sekundární zpracování studie Prokop a kol." },
      { quote: "Plzeňský kraj 8. ze 14 v celkovém indexu, ALE 3. ve subjektivní spokojenosti.", cite: "Datank, 2024", why: "Empirická opora pro hypotézu H1." }
    ]
  },
  {
    chapter: "5.2 Hypotézy (str. 18)",
    items: [
      { quote: "H1: 60 % obyvatel hodnotí KŽ jako dobrou — opora Datank 2024.", cite: "Datank, 2024", why: "Plzeňský kraj subjektivně spokojenější, než by odpovídalo statistikám." },
      { quote: "H2: slabé stránky = zdravotní péče a pracovní příležitosti.", cite: "ČSÚ, 2025 + Musil a Müller, 2008", why: "Kombinace dat o naději dožití (ČSÚ) a teorie periferií (Musil-Müller)." },
      { quote: "H3: mladí 18–30 odcházejí častěji.", cite: "Kuldová, 2005", why: "Doložený trend odlivu mladých z menších měst." },
      { quote: "H4: aktivní účastníci tradic hodnotí KŽ výše.", cite: "Beňová, 2016", why: "GNH zařazuje kulturní vitalitu mezi domény KŽ." }
    ]
  },
  {
    chapter: "Závěr (str. 21)",
    items: [
      { quote: "Domažlice 9. v ČR za zdraví a prostředí, ale 133. za vztahy a služby (z 206).", cite: "Obce v datech, 2025", why: "Závěrečný argument o ambivalentní pozici." },
      { quote: "Obyvatelé Domažlicka volí protestně více, než by odpovídalo objektivním podmínkám.", cite: "Prokopa a kol. (2018)", why: "Klíčový argument — statistiky neukazují všechno." },
      { quote: "Chodská tradice je silná stránka, kterou statistiky nezachytí.", cite: "Beňová, 2016", why: "GNH rámec — kulturní rozměr KŽ." },
      { quote: "Města naslouchající obyvatelům se rozvíjejí lépe.", cite: "Perlín a Bednářová, 2020", why: "Doporučení pro praxi — ospravedlnění dotazníku v kapitole 6." }
    ]
  }
];

// ── DATA: Key numbers ──
const keyData = [
  { cat: "Velikost", items: [
    { k: "Počet obyvatel města", v: "11 133", note: "k 1.1.2025, 117. místo v ČR (ČSÚ)" },
    { k: "Počet obyvatel okresu", v: "55 914", note: "k 31.12.2024 (ČSÚ)" },
    { k: "Nadmořská výška", v: "428 m n. m.", note: "v jihozáp. cípu Plzeňského kraje" },
    { k: "Vzdálenost od Plzně", v: "~50 km", note: "Folmava ~15 km od Německa" }
  ]},
  { cat: "Demografie", items: [
    { k: "Děti 0–14", v: "8 375 (14,98 %)", note: "v okrese, ČSÚ 2024" },
    { k: "Senioři 65+", v: "11 922 (21,3 %)", note: "průměr ČR 20,7 %" },
    { k: "Index stáří 2022", v: "131,8", note: "132 seniorů na 100 dětí" },
    { k: "Přirozená měna 2024", v: "−72 osob", note: "více zemřelých než narozených" },
    { k: "Migrační saldo 2023", v: "+9,0 ‰", note: "(vs. +25,3 ‰ v 2022 — Ukrajinci)" },
    { k: "Naděje dožití mužů 2020-24", v: "75,6 let", note: "+3,8 roku za 20 let" }
  ]},
  { cat: "Ekonomika", items: [
    { k: "Nezaměstnanost (úno 2025)", v: "4,15 %", note: "ČR průměr 4,38 % (pracomat.cz)" },
    { k: "Uchazeči : pracovní místa", v: "1 050 : 1 982", note: "0,6 uchazeče na místo (ČSÚ 2023)" },
    { k: "Průměrná mzda okres", v: "46 767 Kč", note: "ČR průměr 49 229 Kč (rozdíl ~2 500 Kč)" }
  ]},
  { cat: "Exekuce", items: [
    { k: "Domažlice — osob v exekuci", v: "630", note: "~5,6 % obyvatel (EKČR)" },
    { k: "Domažlice — řízení", v: "2 951", note: "(EKČR)" },
    { k: "ČR celkem 2025", v: "607 000 dlužníků / 3,2 mil. řízení", note: "(ExekuceInfo)" },
    { k: "Maximum ČR (2017)", v: "863 000 dlužníků / 4,67 mil.", note: "od té doby pokles" }
  ]},
  { cat: "Volby a indexy", items: [
    { k: "SPD v ORP Domažlice (2025)", v: "10 %", note: "ČR průměr 7,78 % — nadprůměr" },
    { k: "Index KŽ (Obce v datech 2024)", v: "21.–40. místo / 206", note: "krajské skóre 6,4/10" },
    { k: "iROZHLAS mapa KŽ (2018)", v: "29. / 77 okresů", note: "skóre 67,64/100, 3. v Plzeňském kraji" },
    { k: "Místo pro život (Datank 2024)", v: "Plz. kraj 8./14, ale 3. subj.", note: "obyvatelé spokojenější než data" }
  ]},
  { cat: "GNH a teorie", items: [
    { k: "GNH — autor", v: "Džigme Singjä Wangčhug, 1972", note: "v ústavě Bhútánu od 2008" },
    { k: "GNH — počet domén", v: "9", note: "psychická pohoda, zdraví, čas, vzdělání, kultura, správa, komunita, ekologie, životní úroveň" },
    { k: "GNH — počet pilířů", v: "4", note: "udržitelnost, kultura, prostředí, dobrá správa" },
    { k: "Easterlinův paradox", v: "1974", note: "od určité úrovně příjmů spokojenost neroste" }
  ]}
];

// ── DATA: Defense Q&A ──
const qaSections = [
  {
    cat: "O zdrojích a citacích",
    qs: [
      {
        q: "Kolik máte zdrojů a jaké typy?",
        a: "Celkem 29 zdrojů: 13 odborných článků a monografií (Heřmanová, Ira a Andráško, Murgaš, Musil a Müller, Prokop, Šimon a Loquenz...), 6 statistických databází (ČSÚ, DataPAQ, EKČR, Obce v datech) a 10 internetových zdrojů (Datank, iDomažlice, iROZHLAS, Klamár a Gavaľová, Pracomat, Šťastné Česko, ESPON/ÚÚR, ÚZIS, ExekuceInfo). Klíčové primární zdroje: ČSÚ pro demografii a ekonomiku, Exekutorská komora ČR pro exekuce, Prokop a kol. (2018) jako hlavní teoretický rámec propojující KŽ s volebním chováním."
      },
      {
        q: "Který zdroj byl pro vás nejdůležitější a proč?",
        a: "Asi tři: (1) Ira a Andráško (2007) mi dali strukturu — rozdělení na objektivní a subjektivní dimenzi je kostra celé práce. (2) Prokop a kol. (2018) je nejcitovanější český zdroj o KŽ a propojuje data s volbami a exekucemi. (3) ČSÚ + DataPAQ pro všechna konkrétní čísla."
      },
      {
        q: "Proč u některých citací uvádíte stranu a u jiných ne?",
        a: "Stranu uvádím u doslovných citací (text v uvozovkách) a u konkrétních konkrétních dat či argumentů — to je standardní harvardské pravidlo. U obecných parafrází stačí (Autor, rok). U internetových zdrojů bez stránek používám \u201Eonline\u201C nebo nic."
      },
      {
        q: "PROBLÉM: V textu citujete Havlíček a Chromý 2001, ale v seznamu je jen Havlíček et al. 2005. Vysvětlete.",
        a: "Uznávám, je to chyba v seznamu literatury. V textu na str. 8 cituji (Havlíček a Chromý, 2001, s. 1–11) u definice \u201Especifická území s poruchou funkčně-prostorových vztahů\u201C. Tento článek z roku 2001 jsem si měl do seznamu doplnit jako samostatnou položku. V seznamu je pouze pozdější sborník Havlíček et al. (2005), který na článek z 2001 odkazuje. Při finální revizi bych to opravil."
      },
      {
        q: "PROBLÉM: Citujete Prokop 2019 i Prokop 2018 — to jsou dvě práce, nebo chyba?",
        a: "V seznamu mám jen jednu Prokopovu položku — Prokop, D. a kol. (2018) Kvalita života: expertní studie. Citace \u201EProkop (2019)\u201C na str. 13 nemá v seznamu odpovídající záznam — je to pravděpodobně překlep. V kontextu je jasné, že odkazuji na stejnou studii Aspen Institute. Měl jsem to sjednotit na 2018."
      },
      {
        q: "PROBLÉM: V textu jednou píšete 'Loquenz a Šimon', jindy 'Šimon a Loquenz'. Proč?",
        a: "V seznamu literatury je správně Šimon, M. a Loquenz, J. (2013) — abecední pořadí podle příjmení v Geografických rozhledech. V textu na str. 11 a 12 jsem to ale dvakrát napsal jako \u201ELoquenz a Šimon\u201C. To je formální nekonzistence — měl jsem dodržet pořadí ze seznamu."
      },
      {
        q: "Proč jste použil DataPAQ a ne přímo ČSÚ?",
        a: "DataPAQ od PAQ Research agreguje data ČSÚ, EKČR a Czech Household Panel Study do graficky zpracovaných srovnání. Použil jsem je pro vizualizace, protože by jinak musely být tvořeny ručně. Každé číslo je ale dohledatelné v primárních zdrojích, které DataPAQ uvádí (\u201Ezdroj dat: ČSÚ\u201C). Pro spolehlivost si lze vše ověřit."
      },
      {
        q: "Proč citujete Šťastné Česko? Není to aktivistický zdroj?",
        a: "Ano, je. Použil jsem ho pro stručný popis 4 pilířů GNH, protože je to česky srozumitelné. Pro samotnou definici a teoretický rámec se ale opírám o Beňovou (2016) a Klamára a Gavaľovou (2018) — tedy o akademické zdroje. Šťastné Česko mi posloužilo jako vstupní bod, ne jako autorita."
      }
    ]
  },
  {
    cat: "O teorii a pojmech",
    qs: [
      {
        q: "Co je kvalita života podle definice WHO?",
        a: "\u201EVnímání vlastní pozice v životě v kontextu kultury a hodnotového systému, ve kterém jedinec žije, a ve vztahu k jeho cílům, očekáváním a zájmům\u201C (Dragomirecká a Bartoňová, 2006, s. 7). Klíčové slovo je VNÍMÁNÍ — definice WHO je tedy primárně subjektivní."
      },
      {
        q: "Vyjmenujte 9 domén GNH.",
        a: "1. Psychická pohoda, 2. Zdraví, 3. Využití času, 4. Vzdělávání, 5. Kulturní rozmanitost, 6. Dobrá správa, 7. Vitalita komunity, 8. Ekologická odolnost, 9. Životní úroveň. Mnemonika: \u201EZdravý vzdělaný občan má dobrou správu, čas na kulturu a komunitu, zdravé prostředí a slušný příjem.\u201C"
      },
      {
        q: "Co je Easterlinův paradox?",
        a: "Tvrzení Richarda Easterlina (1974), že od určité úrovně příjmů již spokojenost se životem neroste — v některých případech dokonce klesá. To znamená, že měřit kvalitu života jen přes HDP nestačí. Murgaš (2019) ho aktualizuje — ukazuje, že vysvětlením může být kulturní geografie."
      },
      {
        q: "Co je vnitřní periferie a jaké má znaky?",
        a: "Území uvnitř státu, jejichž obecná výkonnost, dostupnost služeb a kvalita života zaostávají (espon.eu, 2018). Strmiska je redukoval na 3 znaky: (1) vzdálenost od centra, (2) odlišnost, (3) závislost. Musil a Müller (2008) přidávají typické rysy: hospodářská stagnace, úbytek obyvatel, demografické stárnutí, horší dopravní dostupnost."
      },
      {
        q: "Plní Domažlice znaky vnitřní periferie?",
        a: "Některé ano, některé ne. ANO: leží na okraji kraje u státní hranice, mají zápornou přirozenou měnu (-3,2 ‰), stárnoucí populaci (index stáří 131,8) a podprůměrné mzdy (-2 500 Kč). NE: nezaměstnanost je pod celostátním průměrem, migrační saldo kladné, podíl exekucí pod průměrem ČR. Závěr: Domažlice nejsou klasickou periferií ani prosperujícím jádrem — leží \u201Eněkde mezi\u201C."
      },
      {
        q: "Co je amenitní migrace?",
        a: "\u201ETrvalý přesun obyvatel za lepším životním prostředím, který je nejčastěji přesunem lidí z městského do venkovského prostředí\u201C (Šimon a Loquenz, 2013, s. 26). Dvě formy: (1) migrace za přírodním prostředím, (2) migrace za kulturními zvláštnostmi. V Domažlicích sedí obojí — Český les + chodská tradice."
      }
    ]
  },
  {
    cat: "O metodice",
    qs: [
      {
        q: "Proč jste zvolil dotazníkové šetření a ne jen analýzu dat?",
        a: "Statistiky zachytí objektivní stránku, ale ne subjektivní vnímání. Existující indexy (Obce v datech, iROZHLAS, Datank) se opírají primárně o data. Já chci doplnit, jak svou kvalitu života vnímají sami obyvatelé Domažlic — to je v souladu s definicí WHO i s GNH (které měří i subjektivní spokojenost)."
      },
      {
        q: "Proč právě WHOQOL-BREF jako vzor?",
        a: "WHOQOL-BREF je standardizovaný validovaný dotazník Světové zdravotnické organizace, který má i českou verzi (Dragomirecká a Bartoňová, 2006). Použil jsem ho jako inspiraci, ne přímo — přizpůsobil jsem ho konkrétním podmínkám Domažlic (chodská identita, příhraniční dojíždění) a doplnil o devět domén GNH."
      },
      {
        q: "Proč jen 50 respondentů? Není to málo?",
        a: "Je to málo a v limitech (kapitola 6.5) to sám přiznávám. Pro reprezentativní statistické závěry by bylo třeba více (typicky stovky). Cíl mé práce ale není provést reprezentativní výzkum, ale NAVRHNOUT metodiku a sebrat orientační data jako kvalitativní doplněk. Kombinace s 10–15 terénními rozhovory dává smíšený design (Hendl, 2005), který kvantitativní limity zmírňuje."
      },
      {
        q: "Co je kvótní výběr a proč jste ho zvolil?",
        a: "Kvótní výběr je nepravděpodobnostní výběr, kde respondenti odpovídají věkové a pohlavní struktuře populace (z dat ČSÚ). Záměrně oslovuji dotazované, aby seděla kvótní struktura. Není to tak silné jako náhodný výběr (negarantuje reprezentativitu), ale realisticky proveditelné při kapacitě bakaláře/seminárky."
      },
      {
        q: "Jak budete zpracovávat data?",
        a: "Pro Likertovy škály vypočítám průměr, medián, modus pro každou otázku. Klíčová bude srovnávací analýza — odpovědi mladších vs. starších, mužů vs. žen, kratší vs. delší doby bydliště. U otevřené otázky o důvodech k odchodu provedu jednoduchou obsahovou analýzu."
      },
      {
        q: "Jaká jsou etická rizika dotazníku?",
        a: "Sociální desirabilita (lidé říkají, co zní lépe), nedobrovolnost (musí být anonymní + informovaný souhlas), ochrana osobních údajů (žádné identifikační údaje), reprezentativita (50 lidí ji negarantuje). Tyto limity v práci přiznávám v kapitole 6.5."
      }
    ]
  },
  {
    cat: "O zjištěních a hypotézách",
    qs: [
      {
        q: "Vyjmenujte 5 výzkumných otázek.",
        a: "VO1: Jak hodnotí obyvatelé celkovou kvalitu života ve srovnání s objektivními statistikami? VO2: Které oblasti považují za nejproblematičtější a nejsilnější? VO3: Liší se vnímání podle věku, pohlaví, délky bydliště? VO4: Vnímají chodskou identitu jako faktor zvyšující KŽ? VO5: Uvažují mladí 18–30 o odchodu, a pokud ano, proč?"
      },
      {
        q: "Vyjmenujte 4 hypotézy.",
        a: "H1: Více než 60 % hodnotí KŽ pozitivně i přes podprůměrné mzdy (opora: Datank 2024). H2: Slabé stránky = zdravotní péče a práce pro vysokoškoláky (opora: ČSÚ + Musil a Müller 2008). H3: Mladí 18–30 uvažují o odchodu více než starší (opora: Kuldová 2005). H4: Aktivní účastníci chodských tradic hodnotí KŽ výše (opora: Beňová 2016 / GNH)."
      },
      {
        q: "Hlavní paradox vaší práce?",
        a: "Domažlice mají v existujících indexech kvality života PROTICHŮDNÉ pozice. V indexu Obce v datech jsou 9. v ČR za zdraví a prostředí, ALE 133. (z 206) za vztahy a služby. V Plzeňském kraji jsou 8. ze 14 v celkovém indexu, ALE 3. v subjektivní spokojenosti (Datank). Současně volí SPD nadprůměrně (10 % vs. 7,78 %), což ukazuje nespokojenost. Tato ambivalence je hlavní motivací výzkumu."
      },
      {
        q: "Co dělá Domažlice unikátními oproti Sušici, Prachaticím, Boskovicím, Jeseníku, Rychnovu n. K.?",
        a: "Všechna srovnávaná města jsou podobně velká (10–13 tis.) a periferní/příhraniční. Domažlice ale vykazují (1) silnou kulturní identitu — chodská tradice, městská památková rezervace; (2) blízkost k Bavorsku — možnost práce v Německu; (3) v rámci kraje 1. místo za zdraví a prostředí (Obce v datech 2024). Žádné z ostatních srovnávaných měst nemá tak silnou živou folklorní tradici."
      },
      {
        q: "Proč zkoumáte volby SPD jako indikátor KŽ?",
        a: "Prokop (2018, s. 84) ukazuje korelaci: \u201Ek výraznému nárůstu extrémního voličského chování dochází zejména ve čtvrtině obyvatel s nejnižší kvalitou života.\u201C V ORP Domažlice je SPD 10 % (vs. 7,78 % v ČR). To není přímý ukazatel KŽ, ale signál — buď nespokojenost, nebo strach z migrace v příhraničí. Sám v textu přiznávám, že je to \u201Edoplňkový rozměr\u201C, ne hlavní indikátor."
      }
    ]
  },
  {
    cat: "Záludné a teoretické otázky",
    qs: [
      {
        q: "Není GNH jen exotická bhútánská kuriozita? Dá se vůbec aplikovat na ČR?",
        a: "V práci to sám zmiňuji: \u201Eje potřeba GNH brát s rezervou. Koncept vychází z buddhistických hodnot a bhútánské kultury\u201C (str. 6). ALE: (1) Heřmanová (2012) ho hodnotí jako cennou inspiraci. (2) V roce 2008 byl zakotven v ústavě Bhútánu, v 2011 ho přijala VS OSN nezávaznou rezolucí. (3) Klamár a Gavaľová (2018) ho úspěšně aplikovali na regionální úrovni na Slovensku — což je relevantní precedens pro ČR. Používám ho ne jako přesný měřící nástroj, ale jako STRUKTURU 9 domén pro dotazník."
      },
      {
        q: "Jaký je rozdíl mezi okresem Domažlice, ORP Domažlice a městem Domažlice?",
        a: "Tři různé jednotky. (1) Město Domažlice = obec — 11 133 obyvatel. (2) ORP Domažlice = obec s rozšířenou působností, spravuje okolní obce v rámci své pravomoci. (3) Okres Domažlice = největší územní jednotka, 55 914 obyvatel, zahrnuje 2 ORP — Domažlice a Horšovský Týn. V práci to prolínám podle dostupnosti dat — některé statistiky jsou jen za okres, jiné za ORP, jiné za město."
      },
      {
        q: "Proč v úvodu citujete WHO definici přes Dragomireckou a ne přímo z WHO?",
        a: "Dragomirecká a Bartoňová (2006) jsou oficiální česká adaptace dotazníku WHOQOL — je to zavedený způsob, jak se v české literatuře cituje WHO definice. Originál je z WHOQOL Group 1995 (\u201EThe World Health Organization Quality of Life Assessment\u201C). Pro úplnou přesnost bych mohl citovat primární zdroj — to bych v revizi opravil."
      },
      {
        q: "Co je rozdíl mezi přirozenou měnou a migračním saldem?",
        a: "Přirozená měna = narození minus zemřelí (na 1 000 obyvatel). V Domažlicích −3,2 ‰ (více lidí umírá než se rodí). Migrační saldo = přistěhovalí minus vystěhovalí (na 1 000). V Domažlicích +9,0 ‰ (2023). Dohromady určují celkový přírůstek. Domažlice jsou typický případ: kladné migrační saldo zachraňuje populaci před úbytkem."
      },
      {
        q: "Jak je vypočítán index stáří 131,8?",
        a: "Index stáří = (počet osob 65+ / počet dětí 0–14) × 100. V Domažlicích: 11 922 / 8 375 × 100 ≈ 142, ale uvedených 131,8 je za rok 2022 (data se mírně liší od 2024). Interpretace: na každých 100 dětí připadá ~132 seniorů. Vyšší než 100 znamená, že populace stárne — ČR celkem má index ~135."
      },
      {
        q: "Vaše práce je primárně rešerše a návrh. Kdy plánujete dotazník skutečně provést?",
        a: "Návrh metodiky byl cílem této seminární práce — sám výzkum přesahuje její rozsah. Pokud by mě téma dál zajímalo, dotazník bych mohl realizovat třeba v rámci ročníkové práce nebo dlouhodobého projektu — design je popsán dostatečně podrobně, aby ho šlo přímo provést."
      },
      {
        q: "Kdybyste měl práci přepisovat, co byste změnil?",
        a: "(1) Opravil bych chyby v citacích — Havlíček a Chromý 2001 doplnit do seznamu, sjednotit Prokop 2018 vs. 2019, zarovnat pořadí Šimon a Loquenz. (2) Citoval bych WHO definici primárně. (3) Možná bych zařadil aspoň pilotní mini-dotazník, ne jen návrh. (4) Doplnil bych cizojazyčný zdroj kromě Murgaše a Klamára (např. OECD Better Life Index)."
      }
    ]
  }
];

// ── DATA: Quiz ──
const quizQuestions = [
  {
    question: "Kdo definoval kvalitu života jako \u201Evnímání vlastní pozice v životě v kontextu kultury a hodnotového systému\u201C?",
    type: "single",
    options: ["Daniel Prokop", "Světová zdravotnická organizace (WHO)", "Easterlin", "Heřmanová"],
    correct: [1],
    explanation: "Definice WHO, převzatá z Dragomirecká a Bartoňová (2006, s. 7). Klíčové slovo je \u201Evnímání\u201C — definice je primárně subjektivní."
  },
  {
    question: "V kterém roce bhútánský král Wangčhug definoval GNH jako rozvojovou politiku?",
    type: "single",
    options: ["1969", "1972", "1985", "2008"],
    correct: [1],
    explanation: "1972. V roce 2008 byl GNH zakotven v ústavě Bhútánu, v roce 2011 přijala VS OSN rezoluci uznávající štěstí jako cíl politiky."
  },
  {
    question: "Kolik domén má GNH?",
    type: "single",
    options: ["4", "7", "9", "12"],
    correct: [2],
    explanation: "9 domén: psychická pohoda, zdraví, využití času, vzdělání, kulturní rozmanitost, dobrá správa, vitalita komunity, ekologická odolnost, životní úroveň. Pilíře jsou 4."
  },
  {
    question: "Které z následujících jsou DOMÉNY GNH (ne pilíře)?",
    type: "multi",
    options: ["Psychická pohoda", "Udržitelný rozvoj", "Vitalita komunity", "Ekologická odolnost", "Dobrá správa"],
    correct: [0, 2, 3, 4],
    explanation: "Pilíře GNH (4): udržitelný rozvoj, kulturní hodnoty, prostředí, dobrá správa. Domény (9) jsou konkrétnější — psychická pohoda, vitalita komunity, ekologická odolnost a další patří mezi domény. Dobrá správa je zároveň pilíř i doména."
  },
  {
    question: "Kolik obyvatel má město Domažlice (k 1.1.2025)?",
    type: "single",
    options: ["~5 000", "~11 100", "~25 000", "~55 900"],
    correct: [1],
    explanation: "11 133 obyvatel — 117. místo v ČR. Pozor: okres Domažlice má 55 914 (k 31.12.2024)."
  },
  {
    question: "Jaký je hlavní rozdíl mezi okresem a ORP Domažlice?",
    type: "single",
    options: [
      "Žádný — jsou to synonyma",
      "Okres je menší než ORP",
      "Okres je větší a zahrnuje více ORP (Domažlice + Horšovský Týn)",
      "ORP je menší než město"
    ],
    correct: [2],
    explanation: "Okres Domažlice (55 914 obyv.) zahrnuje dvě ORP — Domažlice a Horšovský Týn. ORP je obec s rozšířenou působností (administrativní jednotka)."
  },
  {
    question: "Jaké je migrační saldo okresu Domažlice v roce 2023?",
    type: "single",
    options: ["−9,9 ‰", "+9,0 ‰", "+25,3 ‰", "−3,2 ‰"],
    correct: [1],
    explanation: "+9,0 ‰. Hodnota +25,3 ‰ byla v 2022 (vliv ukrajinských uprchlíků). −3,2 ‰ je přirozená měna (úbytek)."
  },
  {
    question: "Co znamená Easterlinův paradox?",
    type: "single",
    options: [
      "Bohatší státy jsou vždy spokojenější",
      "Od určité úrovně příjmů spokojenost se životem neroste",
      "Malé státy jsou nejspokojenější",
      "HDP přesně odráží kvalitu života"
    ],
    correct: [1],
    explanation: "Richard Easterlin (1974) — od určité hranice příjmů spokojenost stagnuje, někdy klesá. Murgaš (2019) ho aktualizuje pro ČR. Argument PROTI redukci KŽ na HDP."
  },
  {
    question: "Které autoři definovali typické rysy vnitřní periferie v ČR?",
    type: "single",
    options: ["Havlíček a Chromý", "Musil a Müller (2008)", "Šimon a Loquenz", "Perlín a Bednářová"],
    correct: [1],
    explanation: "Musil a Müller (2008) v Sociologickém časopise — \u201EVnitřní periferie v ČR jako mechanismus sociální exkluze\u201C. Typické rysy: stagnace, úbytek, stárnutí, horší doprava."
  },
  {
    question: "Co je amenitní migrace podle Šimona a Loquenze (2013)?",
    type: "single",
    options: [
      "Migrace za vyššími mzdami",
      "Migrace z venkova do měst",
      "Trvalý přesun obyvatel za lepším životním prostředím (z města na venkov)",
      "Sezónní migrace turistů"
    ],
    correct: [2],
    explanation: "\u201ETrvalý přesun obyvatel za lepším životním prostředím, který je nejčastěji přesunem lidí z městského do venkovského prostředí.\u201C Dvě formy: za přírodním prostředím a za kulturními zvláštnostmi."
  },
  {
    question: "Které z těchto čísel platí pro Domažlice (město, k 2024–2025)?",
    type: "multi",
    options: [
      "Nezaměstnanost ~4,15 % (únor 2025)",
      "Průměrná mzda v okrese ~46 767 Kč",
      "Nadmořská výška 428 m n. m.",
      "Index stáří 75,6"
    ],
    correct: [0, 1, 2],
    explanation: "Nezaměstnanost 4,15 % (pracomat.cz), mzda 46 767 Kč, nadmořská výška 428 m. Hodnota 75,6 je naděje dožití mužů 2020-24, ne index stáří (ten je 131,8)."
  },
  {
    question: "Jaký podíl hlasů získala SPD v ORP Domažlice ve volbách 2025?",
    type: "single",
    options: ["7,78 %", "10 %", "12,5 %", "5 %"],
    correct: [1],
    explanation: "10 %, oproti celostátním 7,78 %. Prokop (2018) ukazuje, že vyšší podpora protestních stran koreluje s nižší kvalitou života."
  },
  {
    question: "Domažlice se v Indexu KŽ od Obce v datech (2024) umístily:",
    type: "single",
    options: [
      "Ve spodní polovině (133.+ místo)",
      "V horní sedmině žebříčku ČR (21.–40. místo z 206)",
      "Na 1. místě v ČR",
      "Pod celostátním průměrem"
    ],
    correct: [1],
    explanation: "21.–40. místo z 206 — horní sedmina. Ale POZOR: 133. místo se týká pouze sub-indexu \u201Evztahy a služby\u201C. Za zdraví a prostředí jsou 9. v ČR."
  },
  {
    question: "Kolik osob v Domažlicích je v exekuci (data EKČR)?",
    type: "single",
    options: ["~250 (~2 %)", "~630 (~5,6 %)", "~1 200 (~10 %)", "~2 951 (~25 %)"],
    correct: [1],
    explanation: "630 osob ≈ 5,6 % obyvatel. Číslo 2 951 je celkový počet ŘÍZENÍ (jeden člověk může mít více exekucí současně)."
  },
  {
    question: "Co je hlavní důvod, proč nelze měřit kvalitu života jen pomocí HDP?",
    type: "multi",
    options: [
      "Easterlinův paradox — spokojenost neroste s příjmem do nekonečna",
      "HDP nezachytí kulturní vitalitu komunity",
      "HDP ignoruje životní prostředí",
      "HDP ignoruje subjektivní spokojenost"
    ],
    correct: [0, 1, 2, 3],
    explanation: "Všechny čtyři důvody jsou v práci uvedeny. GNH a další indexy se snaží tyto rozměry doplnit."
  },
  {
    question: "Které autorství je v práci nejvíce citováno (5+ míst)?",
    type: "single",
    options: ["Heřmanová (2012)", "Prokop a kol. (2018)", "Ira a Andráško (2007)", "Beňová (2016)"],
    correct: [1],
    explanation: "Prokop a kol. (2018) je citován na str. 13, 14, 15 (dvakrát), 16 a 21 — propojení KŽ s exekucemi a volebním chováním. Klíčový český zdroj."
  },
  {
    question: "Jaký je hlavní cíl navrhované metodiky (kapitola 6)?",
    type: "single",
    options: [
      "Srovnat HDP Domažlic s celostátním průměrem",
      "Zjistit subjektivní vnímání kvality života obyvateli",
      "Vytvořit nový index kvality života",
      "Spočítat naději dožití"
    ],
    correct: [1],
    explanation: "Cílem dotazníku (50 respondentů + 10–15 rozhovorů) je doplnit objektivní data o subjektivní pohled — to v existujících indexech chybí."
  },
  {
    question: "Která města jsou v práci srovnávána s Domažlicemi?",
    type: "multi",
    options: ["Sušice", "Praha", "Prachatice", "Boskovice", "Jeseník", "Rychnov nad Kněžnou", "Tachov"],
    correct: [0, 2, 3, 4, 5],
    explanation: "Sušice, Prachatice, Boskovice, Jeseník, Rychnov nad Kněžnou — všechna mají 10–13 tis. obyvatel a jsou periferní/příhraniční. Praha (1,3 mil) je řádově jiná, Tachov ke srovnání chybí."
  }
];

// ── Reusable: Source card ──
function SourceCard({ s }) {
  const [open, setOpen] = useState(false);
  const colors = { kniha: "#a855f7", "článek": "#60a5fa", web: "#22c55e", data: "#fbbf24", "práce": "#f472b6" };
  const c = colors[s.type] || "#60a5fa";
  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${c}30`, borderRadius: "14px", padding: "16px 20px", marginBottom: "12px", transition: "all 0.4s ease" }}>
      <div onClick={() => setOpen(!open)} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
        <span style={{ background: c + "25", color: c, borderRadius: "6px", padding: "3px 10px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", flexShrink: 0 }}>{s.type}</span>
        <div style={{ flex: 1 }}>
          <div style={{ color: "#fff", fontSize: "15px", fontWeight: 600, lineHeight: 1.3 }}>{s.authors} ({s.year})</div>
          <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "13px", marginTop: "3px", lineHeight: 1.4 }}>{s.title}</div>
        </div>
        <span style={{ color: c, fontSize: "20px", transition: "transform 0.4s ease", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
      </div>
      {open && (
        <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: `1px solid ${c}25`, color: "rgba(255,255,255,0.85)", fontSize: "14px", lineHeight: 1.6 }}>
          {s.detail && <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "12.5px", marginBottom: "10px", fontFamily: "JetBrains Mono, monospace" }}>{s.detail}</div>}
          <div style={{ marginBottom: "12px" }}><strong style={{ color: c }}>O zdroji:</strong> {s.whatIs}</div>
          <div style={{ marginBottom: "12px" }}>
            <strong style={{ color: c }}>Kde v práci je citován:</strong>
            <ul style={{ margin: "8px 0 0 0", paddingLeft: "18px" }}>
              {s.placesUsed.map((p, i) => (
                <li key={i} style={{ marginBottom: "6px", color: "rgba(255,255,255,0.8)" }}>
                  <span style={{ color: "#fbbf24", fontWeight: 600 }}>str. {p.p}</span> — {p.sec}: {p.ctx}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: "10px", padding: "12px 14px", marginTop: "12px" }}>
            <div style={{ color: "#fbbf24", fontSize: "12.5px", fontWeight: 700, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Při obhajobě</div>
            <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "13.5px", lineHeight: 1.6 }}>{s.defense}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main App ──
export default function App() {
  const [tab, setTab] = useState("prehled");
  const [sourceFilter, setSourceFilter] = useState("vse");

  const filteredSources = sourceFilter === "vse"
    ? sources
    : sources.filter(s => s.cat === sourceFilter);

  const tabs = [
    { id: "prehled", label: "Přehled" },
    { id: "zdroje", label: "Zdroje (29)" },
    { id: "citace", label: "Citace v textu" },
    { id: "data", label: "Klíčová data" },
    { id: "otazky", label: "Otázky obhajoby" },
    { id: "kviz", label: "Kvíz" }
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono&display=swap');
        body { margin: 0; padding: 0; background: #0a0a1a; font-family: 'Inter', sans-serif; color: #fff; min-height: 100vh; overflow-x: hidden; }
        * { box-sizing: border-box; }
        @keyframes pulse { 0%, 100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 0.65; transform: scale(1.08); } }
        @keyframes drift { 0% { transform: translate(0, 0); } 50% { transform: translate(30px, -40px); } 100% { transform: translate(0, 0); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .bgblob { position: fixed; border-radius: 50%; filter: blur(80px); pointer-events: none; z-index: 0; }
        .content { position: relative; z-index: 1; }
        .tab-btn { padding: 10px 18px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 999px; color: rgba(255,255,255,0.7); cursor: pointer; font-size: 14.5px; font-weight: 500; transition: all 0.4s ease; white-space: nowrap; }
        .tab-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }
        .tab-btn.active { background: rgba(245,158,11,0.18); border-color: #f59e0b; color: #fbbf24; }
        .tab-content { animation: fadeIn 0.5s ease; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.03); }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }
      `}</style>

      <div className="bgblob" style={{ background: "rgba(245,158,11,0.18)", width: "500px", height: "500px", top: "-100px", left: "-100px", animation: "drift 18s ease-in-out infinite, pulse 8s ease-in-out infinite" }} />
      <div className="bgblob" style={{ background: "rgba(168,85,247,0.15)", width: "600px", height: "600px", bottom: "-150px", right: "-150px", animation: "drift 22s ease-in-out infinite reverse, pulse 10s ease-in-out infinite" }} />
      <div className="bgblob" style={{ background: "rgba(96,165,250,0.12)", width: "400px", height: "400px", top: "40%", left: "60%", animation: "drift 26s ease-in-out infinite, pulse 12s ease-in-out infinite" }} />

      <div className="content" style={{ maxWidth: "920px", margin: "0 auto", padding: "32px 20px 80px" }}>
        {/* Header */}
        <header style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ color: "#fbbf24", fontSize: "13px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>Obhajoba seminární práce · Zeměpis · GJK</div>
          <h1 style={{ fontSize: "34px", fontWeight: 800, margin: "0 0 12px", lineHeight: 1.2, color: "#fff" }}>Úroveň kvality života v Domažlicích</h1>
          <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "15px" }}>Jonáš Stupka · 2.B · 24 stran · 29 zdrojů</div>
        </header>

        {/* Tab navigation */}
        <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "28px", flexWrap: "wrap" }}>
          {tabs.map(t => (
            <button key={t.id} className={`tab-btn ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>{t.label}</button>
          ))}
        </div>

        {/* PŘEHLED TAB */}
        {tab === "prehled" && (
          <div className="tab-content">
            <div style={{ ...glass, marginBottom: "20px", borderColor: "rgba(245,158,11,0.4)" }}>
              <div style={{ color: "#fbbf24", fontSize: "13px", fontWeight: 700, marginBottom: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>⚠ Kritické slabiny — pamatuj!</div>
              <ul style={{ margin: 0, paddingLeft: "20px", color: "rgba(255,255,255,0.85)", fontSize: "14.5px", lineHeight: 1.7 }}>
                <li><strong>Havlíček a Chromý 2001</strong> citováno v textu (str. 8), ale v seznamu literatury je jen Havlíček et al. 2005.</li>
                <li><strong>Prokop (2019)</strong> citováno na str. 13, ale v seznamu je jen Prokop a kol. (2018) — pravděpodobně překlep.</li>
                <li><strong>Pořadí autorů</strong> u Šimon/Loquenz nekonzistentní — v seznamu „Šimon a Loquenz“, v textu „Loquenz a Šimon“.</li>
                <li>WHO definici (str. 4) cituji přes Dragomireckou — bylo by lépe citovat primární zdroj WHOQOL Group 1995.</li>
              </ul>
              <div style={{ color: "rgba(255,255,255,0.65)", fontSize: "13px", marginTop: "12px", fontStyle: "italic" }}>Pokud na to profesor poukáže: přiznat, vysvětlit a říct, jak bys to opravil. Ne se hájit.</div>
            </div>

            <Collapse title="Hlavní teze a struktura práce" defaultOpen={true}>
              <p><strong>Cíl práce:</strong> Podívat se na kvalitu života v Domažlicích z více úhlů — objektivní statistiky, koncept GNH jako inspirace a návrh dotazníku pro zjištění subjektivního vnímání.</p>
              <p><strong>Hlavní paradox / argument:</strong> Domažlice mají v indexech kvality života protichůdné pozice — 9. v ČR za zdraví/prostředí, ALE 133. (z 206) za vztahy/služby. Současně volí SPD nadprůměrně. Statistiky neukazují všechno — je třeba ptát se obyvatel.</p>
              <p><strong>Struktura (6 kapitol):</strong></p>
              <ol style={{ paddingLeft: "20px" }}>
                <li>Teoretický rámec — pojem KŽ, objektivní vs. subjektivní, GNH</li>
                <li>Domažlice — poloha, srovnání s podobnými městy, periferní kontext</li>
                <li>Objektivní ukazatele — demografie, migrace, naděje dožití, exekuce, ekonomika, volby</li>
                <li>Subjektivní vnímání — proč ho měřit, existující měření v ČR</li>
                <li>Výzkumné otázky a hypotézy</li>
                <li>Návrh metodiky — dotazníkové šetření</li>
              </ol>
            </Collapse>

            <Collapse title="Tvůj vlastní úhel pohledu (čím se práce liší od jiných)">
              <ul style={{ paddingLeft: "20px", lineHeight: 1.7 }}>
                <li>Spojuje DVA pohledy: tvrdá data (ČSÚ, EKČR) + GNH jako alternativní rámec.</li>
                <li>Konkrétní převod 9 GNH domén na podmínky Domažlic (Tab. 1, str. 6) — vlastní syntéza.</li>
                <li>Srovnání Domažlic se 5 podobně velkými městy (Sušice, Prachatice, Boskovice, Jeseník, Rychnov n. K.) — záměrně periferními.</li>
                <li>Důraz na chodskou kulturní identitu jako proměnnou, kterou indexy nezachycují.</li>
                <li>Návrh metodiky inspirovaný WHOQOL-BREF + 9 doménami GNH — kombinace mezinárodních standardů.</li>
              </ul>
            </Collapse>

            <Collapse title="Co říct, když se zeptá obecně 'Vyprávějte mi o své práci'">
              <p>Stručný 60sekundový pitch:</p>
              <p style={{ background: "rgba(255,255,255,0.04)", padding: "14px 18px", borderRadius: "12px", borderLeft: "3px solid #f59e0b", lineHeight: 1.7, fontStyle: "italic" }}>
                „Chtěl jsem zjistit, jak se v Domažlicích skutečně žije. Domažlice jsou zajímavý případ, protože leží na periferii Plzeňského kraje, ale mají silnou chodskou tradici. V práci jsem analyzoval objektivní data — demografii, exekuce, ekonomiku, volby — a srovnal je s pěti podobně velkými městy. Zjistil jsem, že se Domažlice pohybují někde mezi: nejsou ani prosperující, ani zapomenutá periferie. Pak jsem představil koncept GNH z Bhútánu jako inspiraci a navrhl dotazníkové šetření, které by zjistilo, jak svou KŽ vnímají sami obyvatelé. Hlavní poznatek je, že existující indexy nezachytí kulturní vitalitu a chodskou identitu — proto je třeba ptát se obyvatel přímo.“
              </p>
            </Collapse>

            <Collapse title="Klíčové pojmy — rychlá nápověda">
              <ul style={{ paddingLeft: "20px", lineHeight: 1.8 }}>
                <li><strong>Kvalita života (KŽ):</strong> vnímání pozice v životě (WHO) — má objektivní (vnější podmínky) i subjektivní (osobní) dimenzi.</li>
                <li><strong>GNH (Gross National Happiness):</strong> hrubé národní štěstí — bhútánský koncept, alternativa k HDP. 4 pilíře, 9 domén.</li>
                <li><strong>Easterlinův paradox:</strong> nad určitou úrovní příjmů spokojenost neroste.</li>
                <li><strong>Vnitřní periferie:</strong> území uvnitř státu se zaostávajícími podmínkami (Musil a Müller, 2008).</li>
                <li><strong>Amenitní migrace:</strong> přesun za prostředím a kulturou (Šimon a Loquenz, 2013).</li>
                <li><strong>Index stáří:</strong> seniorů 65+ na 100 dětí 0–14. V Domažlicích 131,8 (2022).</li>
                <li><strong>Přirozená měna:</strong> narození minus zemřelí. V okrese −3,2 ‰.</li>
                <li><strong>Migrační saldo:</strong> přistěhovalí minus vystěhovalí. V okrese +9,0 ‰ (2023).</li>
                <li><strong>WHOQOL-BREF:</strong> standardizovaný dotazník WHO pro KŽ, česká verze Dragomirecká a Bartoňová (2006).</li>
                <li><strong>ORP:</strong> Obec s rozšířenou působností. Okres Domažlice = 2 ORP (Domažlice + Horšovský Týn).</li>
              </ul>
            </Collapse>
          </div>
        )}

        {/* ZDROJE TAB */}
        {tab === "zdroje" && (
          <div className="tab-content">
            <div style={{ ...glass, marginBottom: "20px" }}>
              <div style={{ color: "#fff", fontSize: "16px", fontWeight: 600, marginBottom: "12px" }}>Filtr podle typu</div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {[
                  { id: "vse", label: "Všechny (29)" },
                  { id: "mono", label: "Odborné články a knihy (13)" },
                  { id: "data", label: "Statistické databáze (6)" },
                  { id: "web", label: "Internetové zdroje (10)" }
                ].map(f => (
                  <button key={f.id} className={`tab-btn ${sourceFilter === f.id ? "active" : ""}`} onClick={() => setSourceFilter(f.id)}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "13px", marginBottom: "16px", textAlign: "center" }}>
              Klikni na zdroj pro detailní popis: kde je v práci, proč ho cituji a co říct profesorovi.
            </div>
            {filteredSources.map(s => <SourceCard key={s.id} s={s} />)}
          </div>
        )}

        {/* CITACE TAB */}
        {tab === "citace" && (
          <div className="tab-content">
            <div style={{ ...glass, marginBottom: "16px", background: "rgba(96,165,250,0.08)", borderColor: "rgba(96,165,250,0.3)" }}>
              <div style={{ color: "#60a5fa", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>Jak to funguje</div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", lineHeight: 1.6 }}>
                Postupný průchod prací po kapitolách. Každá citace má vysvětlení, proč tam je. Zelené citace = parafráze (Autor, rok). Modré = doslovné s uvozovkami a stranou. Žluté ⚠ = potenciální problém.
              </div>
            </div>
            {citations.map((ch, ci) => (
              <Collapse key={ci} title={ch.chapter} sub={`${ch.items.length} citace`} defaultOpen={ci === 0}>
                {ch.items.map((it, ii) => {
                  const isProblem = it.why.includes("POZOR") || it.why.includes("chyba");
                  const accent = isProblem ? "#fbbf24" : (it.quote.includes("\u201E") ? "#60a5fa" : "#22c55e");
                  return (
                    <div key={ii} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${accent}30`, borderRadius: "12px", padding: "14px 16px", marginBottom: "10px" }}>
                      <div style={{ color: "rgba(255,255,255,0.9)", fontSize: "14px", lineHeight: 1.6, marginBottom: "8px" }}>{it.quote}</div>
                      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                        <span style={{ background: accent + "20", color: accent, fontSize: "12px", fontWeight: 600, padding: "3px 10px", borderRadius: "6px", fontFamily: "JetBrains Mono, monospace" }}>{it.cite}</span>
                        {isProblem && <span style={{ color: "#fbbf24", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>⚠ Slabina</span>}
                      </div>
                      <div style={{ color: "rgba(255,255,255,0.65)", fontSize: "13px", lineHeight: 1.5, fontStyle: "italic" }}>→ {it.why}</div>
                    </div>
                  );
                })}
              </Collapse>
            ))}
          </div>
        )}

        {/* DATA TAB */}
        {tab === "data" && (
          <div className="tab-content">
            <div style={{ ...glass, marginBottom: "16px", background: "rgba(34,197,94,0.06)", borderColor: "rgba(34,197,94,0.25)" }}>
              <div style={{ color: "#4ade80", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>Tahák čísel</div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", lineHeight: 1.6 }}>
                Všechna konkrétní čísla, na která se profesor může zeptat. Zopakuj si je den před obhajobou — zejména velikost, exekuce, voličské podíly a Index KŽ.
              </div>
            </div>
            {keyData.map((cat, ci) => (
              <div key={ci} style={{ ...glass, marginBottom: "16px", padding: "20px 24px" }}>
                <div style={{ color: "#fbbf24", fontSize: "16px", fontWeight: 700, marginBottom: "14px", textTransform: "uppercase", letterSpacing: "1px" }}>{cat.cat}</div>
                <div style={{ display: "grid", gap: "10px" }}>
                  {cat.items.map((item, ii) => (
                    <div key={ii} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "12px", alignItems: "baseline", padding: "10px 0", borderBottom: ii < cat.items.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
                      <div>
                        <div style={{ color: "rgba(255,255,255,0.9)", fontSize: "14px", fontWeight: 500 }}>{item.k}</div>
                        {item.note && <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "12.5px", marginTop: "3px" }}>{item.note}</div>}
                      </div>
                      <div style={{ color: "#fbbf24", fontWeight: 700, fontSize: "15px", fontFamily: "JetBrains Mono, monospace", whiteSpace: "nowrap" }}>{item.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* OTÁZKY TAB */}
        {tab === "otazky" && (
          <div className="tab-content">
            <div style={{ ...glass, marginBottom: "16px", background: "rgba(168,85,247,0.07)", borderColor: "rgba(168,85,247,0.3)" }}>
              <div style={{ color: "#c084fc", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>Cvičná obhajoba</div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", lineHeight: 1.6 }}>
                Klikni na otázku, zkus si v duchu odpovědět, pak otevři. Zaměř se zejména na blok „O zdrojích a citacích“ — profesor řekl, že na tom bude nejvíce.
              </div>
            </div>
            {qaSections.map((sec, si) => (
              <div key={si} style={{ marginBottom: "24px" }}>
                <div style={{ color: "#fbbf24", fontSize: "15px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "12px", paddingLeft: "4px" }}>{sec.cat}</div>
                {sec.qs.map((qa, qi) => (
                  <Collapse key={qi} title={qa.q} sub="Klikni pro modelovou odpověď">
                    <div style={{ whiteSpace: "pre-wrap" }}>{qa.a}</div>
                  </Collapse>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* KVÍZ TAB */}
        {tab === "kviz" && (
          <div className="tab-content">
            <div style={{ ...glass, marginBottom: "20px", textAlign: "center" }}>
              <div style={{ color: "#fff", fontSize: "18px", fontWeight: 600, marginBottom: "6px" }}>Test sebe sama</div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", lineHeight: 1.6 }}>{quizQuestions.length} otázek o pojmech, číslech, autorech a metodice tvé práce. Každá otázka má vysvětlení.</div>
            </div>
            <QuizEngine questions={quizQuestions} accentColor="#f59e0b" />
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: "48px", color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>
          Dýchej zhluboka. Práci jsi psal ty — odpovědi jsi měl ve hlavě, jen je třeba si je vytáhnout. · GJK 2026
        </div>
      </div>
    </>
  );
}
