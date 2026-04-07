// @title Světová populace — příprava na písemku
// @subject Geography
// @topic Obyvatelstvo světa: rozložení, demografická revoluce, struktura
// @template study

import { useState, useCallback, useMemo } from "react";

// ─── Quiz Engine ──────────────────────────────────────────────
function shuffleArray(array) {
  const s = [...array];
  for (let i = s.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [s[i], s[j]] = [s[j], s[i]];
  }
  return s;
}
function shuffleQuestions(questions) {
  return questions.map(q => {
    const idx = q.options.map((_, i) => i);
    const si = shuffleArray(idx);
    return { ...q, options: si.map(i => q.options[i]), correct: q.correct.map(o => si.indexOf(o)) };
  });
}
function arrEqual(a, b) {
  if (!a || !b) return false;
  const sa = [...a].sort((x, y) => x - y), sb = [...b].sort((x, y) => x - y);
  return sa.length === sb.length && sa.every((v, i) => v === sb[i]);
}

function QuizEngine({ questions: qs, accentColor = "#38bdf8" }) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState({});
  const [pendingMulti, setPendingMulti] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [shuffleKey, setShuffleKey] = useState(0);
  const sq = useMemo(() => shuffleQuestions(qs), [qs, shuffleKey]);
  const q = sq[idx];
  const isMulti = q.type === "multi";
  const isRevealed = !!revealed[idx];
  const myAnswer = answers[idx] || [];
  const isCorrect = isRevealed && arrEqual(myAnswer, q.correct);
  const score = sq.filter((_, i) => revealed[i] && arrEqual(answers[i] || [], sq[i].correct)).length;
  const pct = Math.round((score / sq.length) * 100);
  const goTo = useCallback((i) => { setIdx(i); setPendingMulti(sq[i].type === "multi" ? (answers[i] || []) : []); }, [answers, sq]);
  const handleSingle = useCallback((oi) => { if (isRevealed) return; setAnswers(p => ({ ...p, [idx]: [oi] })); setRevealed(p => ({ ...p, [idx]: true })); }, [idx, isRevealed]);
  const toggleMulti = useCallback((oi) => { if (isRevealed) return; setPendingMulti(p => p.includes(oi) ? p.filter(i => i !== oi) : [...p, oi]); }, [isRevealed]);
  const submitMulti = useCallback(() => { if (!pendingMulti.length) return; setAnswers(p => ({ ...p, [idx]: [...pendingMulti] })); setRevealed(p => ({ ...p, [idx]: true })); }, [idx, pendingMulti]);
  const restart = useCallback(() => { setIdx(0); setAnswers({}); setRevealed({}); setPendingMulti([]); setShowResults(false); setShuffleKey(k => k + 1); }, []);
  const Q = {
    wrap: { display: "flex", flexDirection: "column", gap: "16px", maxWidth: "680px", margin: "0 auto", padding: "8px" },
    dotBar: { display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" },
    dot: { width: "22px", height: "22px", borderRadius: "50%", cursor: "pointer", transition: "background 0.4s ease" },
    card: { background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "24px", transition: "all 0.4s ease" },
    qNum: { color: "rgba(255,255,255,0.35)", fontSize: "13px", marginBottom: "6px" },
    qText: { color: "#fff", fontSize: "17px", fontWeight: 600, lineHeight: 1.5, marginBottom: "20px" },
    opts: { display: "flex", flexDirection: "column", gap: "10px" },
    opt: { padding: "12px 16px", borderRadius: "12px", color: "#fff", cursor: "pointer", transition: "all 0.4s ease", display: "flex", alignItems: "center", gap: "10px", userSelect: "none", fontSize: "15px" },
    cb: { fontSize: "18px", minWidth: "20px" },
    btn: { marginTop: "12px", padding: "10px 22px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", color: "#fff", cursor: "pointer", fontSize: "15px", transition: "all 0.4s ease" },
    fb: { marginTop: "20px", padding: "16px", borderRadius: "14px", border: "1px solid", background: "rgba(255,255,255,0.03)" },
    fbH: { color: "#fff", fontWeight: 700, fontSize: "15px", marginBottom: "6px" },
    fbC: { color: "#86efac", fontSize: "14px", marginBottom: "6px" },
    fbE: { color: "rgba(255,255,255,0.7)", fontSize: "14px", lineHeight: 1.5 },
    fbT: { color: "#fb923c", fontSize: "13px", marginTop: "8px", fontStyle: "italic" },
    navRow: { display: "flex", justifyContent: "space-between" },
    rw: { display: "flex", alignItems: "center", justifyContent: "center", minHeight: "280px" },
    rc: { textAlign: "center", background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "24px", padding: "40px 48px" },
    rs: { color: "#fff", fontSize: "52px", fontWeight: 800, lineHeight: 1.1 },
    rp: { color: "rgba(255,255,255,0.45)", fontSize: "22px", marginBottom: "16px" },
    rm: { color: "rgba(255,255,255,0.8)", fontSize: "16px", lineHeight: 1.5, marginBottom: "24px", maxWidth: "340px", margin: "0 auto 24px" },
  };
  if (showResults) {
    const msg = pct >= 90 ? "Výborně! Máš to perfektně zvládnuté!" : pct >= 70 ? "Dobře! Téměř máš vše zvládnuté." : pct >= 50 ? "Mohlo by to být lepší, ale jdeš správným směrem." : "Potřebuješ více přípravy. Opakuj a bude to!";
    return <div style={Q.rw}><div style={Q.rc}><div style={Q.rs}>{score} / {sq.length}</div><div style={Q.rp}>{pct} %</div><div style={Q.rm}>{msg}</div><button style={{ ...Q.btn, background: accentColor + "66", border: `1px solid ${accentColor}` }} onClick={restart}>Začít znovu</button></div></div>;
  }
  const activeSet = isMulti ? (isRevealed ? myAnswer : pendingMulti) : myAnswer;
  return (
    <div style={Q.wrap}>
      <div style={Q.dotBar}>{sq.map((_, i) => { let bg = "#4b5563"; if (i === idx) bg = accentColor; else if (revealed[i]) bg = arrEqual(answers[i] || [], sq[i].correct) ? "#22c55e" : "#ef4444"; return <div key={i} onClick={() => goTo(i)} title={`Otázka ${i+1}`} style={{ ...Q.dot, background: bg }} />; })}</div>
      <div style={Q.card}>
        <div style={Q.qNum}>Otázka {idx+1} / {sq.length}</div>
        <div style={Q.qText}>{q.question}</div>
        <div style={Q.opts}>{q.options.map((opt, i) => { let border = "1px solid rgba(255,255,255,0.12)", bg = "rgba(255,255,255,0.04)"; if (isRevealed) { if (q.correct.includes(i)) { bg = "rgba(34,197,94,0.15)"; border = "1px solid #22c55e"; } else if (activeSet.includes(i)) { bg = "rgba(239,68,68,0.15)"; border = "1px solid #ef4444"; } } else if (activeSet.includes(i)) { bg = accentColor+"18"; border = `1px solid ${accentColor}`; } return <div key={i} style={{ ...Q.opt, background: bg, border }} onClick={() => isMulti ? toggleMulti(i) : handleSingle(i)}>{isMulti && <span style={Q.cb}>{activeSet.includes(i) ? "☑" : "☐"}</span>}<span>{opt}</span></div>; })}</div>
        {isMulti && !isRevealed && <button style={{ ...Q.btn, opacity: pendingMulti.length === 0 ? 0.4 : 1 }} onClick={submitMulti} disabled={!pendingMulti.length}>Potvrdit</button>}
        {isRevealed && <div style={{ ...Q.fb, borderColor: isCorrect ? "#22c55e" : "#ef4444" }}><div style={Q.fbH}>{isCorrect ? "Správně!" : "Špatně"}</div>{!isCorrect && <div style={Q.fbC}>Správná odpověď: {q.correct.map(i => q.options[i]).join(", ")}</div>}<div style={Q.fbE}>{q.explanation}</div>{q.tip && <div style={Q.fbT}>Tip: {q.tip}</div>}</div>}
      </div>
      <div style={Q.navRow}>
        <button style={Q.btn} onClick={() => goTo(idx-1)} disabled={idx===0}>← Předchozí</button>
        {idx < sq.length-1 ? <button style={Q.btn} onClick={() => goTo(idx+1)}>Další →</button> : <button style={{ ...Q.btn, background: accentColor+"55", border: `1px solid ${accentColor}` }} onClick={() => setShowResults(true)}>Výsledky →</button>}
      </div>
    </div>
  );
}

// ─── Collapsible ──────────────────────────────────────────────
function Collapsible({ title, children, defaultOpen = false, accent = "#38bdf8" }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom: "10px", borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div onClick={() => setOpen(o => !o)} style={{ padding: "13px 18px", background: open ? accent+"1a" : "rgba(255,255,255,0.03)", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.4s ease" }}>
        <span style={{ color: open ? accent : "rgba(255,255,255,0.8)", fontWeight: 600, fontSize: "14px" }}>{title}</span>
        <span style={{ color: accent, fontSize: "18px", transition: "transform 0.4s ease", transform: open ? "rotate(180deg)" : "none" }}>▾</span>
      </div>
      {open && <div style={{ padding: "14px 18px", background: "rgba(255,255,255,0.02)", color: "rgba(255,255,255,0.75)", fontSize: "14px", lineHeight: 1.7 }}>{children}</div>}
    </div>
  );
}

// ─── Flashcards ───────────────────────────────────────────────
function Flashcards({ cards, accent }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const go = (dir) => { setFlipped(false); setTimeout(() => setIdx(i => (i + dir + cards.length) % cards.length), 150); };
  const btnBase = { padding: "10px 22px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", color: "#fff", cursor: "pointer", fontSize: "15px", transition: "all 0.4s ease" };
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", padding: "12px" }}>
      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>{idx+1} / {cards.length}</div>
      <div onClick={() => setFlipped(f => !f)} style={{ width: "100%", maxWidth: "520px", minHeight: "190px", cursor: "pointer", perspective: "1000px" }}>
        <div style={{ position: "relative", width: "100%", minHeight: "190px", transformStyle: "preserve-3d", transition: "transform 0.4s ease", transform: flipped ? "rotateY(180deg)" : "none" }}>
          <div style={{ position: "absolute", width: "100%", minHeight: "190px", backfaceVisibility: "hidden", background: "rgba(255,255,255,0.05)", border: `1px solid ${accent}44`, borderRadius: "20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", boxSizing: "border-box" }}>
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>Pojem</div>
            <div style={{ color: "#fff", fontSize: "22px", fontWeight: 700, textAlign: "center" }}>{cards[idx].front}</div>
            <div style={{ color: "rgba(255,255,255,0.25)", fontSize: "12px", marginTop: "16px" }}>klikni pro otočení</div>
          </div>
          <div style={{ position: "absolute", width: "100%", minHeight: "190px", backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: accent+"15", border: `1px solid ${accent}55`, borderRadius: "20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", boxSizing: "border-box" }}>
            <div style={{ color: accent, fontSize: "11px", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>Vysvětlení</div>
            <div style={{ color: "#fff", fontSize: "15px", textAlign: "center", lineHeight: 1.6 }}>{cards[idx].back}</div>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: "12px" }}>
        <button onClick={() => go(-1)} style={btnBase}>← Předchozí</button>
        <button onClick={() => go(1)} style={{ ...btnBase, background: accent+"22", border: `1px solid ${accent}`, color: accent }}>Další →</button>
      </div>
    </div>
  );
}

// ─── Answer reveal card ───────────────────────────────────────
function AnswerCard({ popis, odpoved, color }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "14px", marginBottom: "8px" }}>
      <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", lineHeight: 1.6, marginBottom: "10px" }}>{popis}</div>
      <button onClick={() => setOpen(o => !o)} style={{ padding: "6px 14px", background: open ? color+"22" : "rgba(255,255,255,0.05)", border: `1px solid ${color}55`, borderRadius: "8px", color: open ? color : "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "13px", transition: "all 0.4s ease" }}>
        {open ? "Skrýt" : "Zobrazit odpověď"}
      </button>
      {open && <div style={{ marginTop: "10px", padding: "10px 14px", background: color+"15", border: `1px solid ${color}44`, borderRadius: "10px", color: color, fontWeight: 600, fontSize: "14px" }}>{odpoved}</div>}
    </div>
  );
}

// ─── Constants ────────────────────────────────────────────────
const ACCENT = "#38bdf8";
const ORANGE = "#fb923c";
const GREY = "#94a3b8";
const PURPLE = "#a78bfa";
const GREEN = "#34d399";

// ─── Religion data ────────────────────────────────────────────
const RELIGIONS = [
  { name: "Judaismus", emoji: "✡️", color: "#fbbf24", share: "~0,2 %", distribution: "Izrael, USA, diaspora v Evropě", believe: "Jeden Bůh (Jahve/JHVH), Tóra jako zákon, čekání na Mesiáše. Nejstarší z abrahamitských náboženství.", structure: "Ortodoxní, konzervativní, reformní; charedim = ultraortodoxní (zcela oddělená komunita)", hierarchy: "Rabíni (učenci, vedoucí komunity), velekněz — jen historicky", holyPlaces: "Jeruzalém (Zeď nářků, Chrámová hora), Hebron (Jeskyně patriarchů — snímek F)", symbols: "Davidova hvězda ✡️, menora, Tóra", texts: "Tóra (Pět knih Mojžíšových), Talmud, Mišna", holidays: "Sabbat (každý týden), Pesach (Pascha), Jom Kipur (den smíření), Chanuka, Roš Hašana", radical: "Charedim — ultraortodoxní separatismus (populace se zdvojnásobuje každých 16 let). Strana Kach — rasová segregace, zakázána 1988. Sionismus × ortodoxní odmítání (jen Mesiáš může založit Izrael)." },
  { name: "Křesťanství", emoji: "✝️", color: "#60a5fa", share: "~31,5 %", distribution: "Evropa, Severní a Jižní Amerika, subsaharská Afrika, Austrálie — největší světové náboženství", believe: "Trojice (Otec, Syn Ježíš Kristus, Duch Svatý). Ježíš = Mesiáš, jeho smrtí a vzkříšením přichází spása. Starý i Nový zákon.", structure: "Katolíci (~50 % křesťanů), protestanti/evangelíci (různé církve), pravoslavní (V Evropa, Blízký Východ, Etiopie)", hierarchy: "Papež (katolíci — Vatikán), patriarchové (pravoslavní), pastoři / faráři (protestanti)", holyPlaces: "Jeruzalém (Boží hrob), Řím/Vatikán, Lurdy (Francie — snímek C), Santiago de Compostela", symbols: "Kříž ✝️, ichthys (ryba), alfa a omega", texts: "Bible: Starý zákon + Nový zákon", holidays: "Vánoce (25.12.), Velikonoce, Letnice (Svátky Ducha sv.)", radical: "IRA (Severní Irsko: katolíci × anglikáni, terorismus 20. stol.). Ku Klux Klan (USA, bílý supremacismus). Anti-balaka (Střední Afrika, původně domobrana → radikalizace). Nová křesťanská pravice v USA (kulturní války: interrupce, LGBTQ+)." },
  { name: "Islám", emoji: "☪️", color: "#34d399", share: "~23,2 %", distribution: "Blízký Východ, severní Afrika, JV Asie (Indonésie = největší muslimský stát!), Střední Asie, Pakistan", believe: "Alláh = jediný Bůh, Mohamed = poslední prorok, Korán = přímé Boží slovo. 5 pilířů: šahada, salát, zakát, sawm, hadž.", structure: "Sunité (~85 %), šíité (~15 % — Írán, Irák), ostatní (alávité, ibádité, ismáílité)", hierarchy: "Imámové (vedoucí modlitby), muftí (vydávají náboženské výnosy — fatwy), chalífa — jen historicky", holyPlaces: "Mekka (Kaaba — snímek D), Medína (hrob Mohameda), Jeruzalém (Skalní dóm — 3. nejsvětější)", symbols: "Půlměsíc a hvězda ☪️, arabská kaligrafie", texts: "Korán (zjevení Mohamedovi), Hadísy (výroky Mohameda), Sunna", holidays: "Ramadán (měsíc půstu), Íd al-Fitr (konec ramadánu), Íd al-Adhá (svátek oběti)", radical: "Al-Káida: útok WTC 11. 9. 2001, vlaky Madrid 2004. IS/ISIS: chalífát v Iráku a Sýrii 2014–2019, Paříž 2015 (Bataclan, Charlie Hebdo), Nice 2016. Šaría = islámský zákon." },
  { name: "Hinduismus", emoji: "🕉️", color: "#f97316", share: "~15 %", distribution: "Indie, Nepál, Bali (Indonésie); diaspora: Mauritius, Fidži, Karibik, Jihoafrická republika", believe: "Karma (zákon příčiny a důsledku), reinkarnace (koloběh zrození), dharma (mravní zákon), mokša (osvobození). Trimurti: Brahma (stvořitel), Višna (udržovatel), Šiva (ničitel).", structure: "Kastovní systém: bráhmani (kněží) → kšatrijové (bojovníci) → vaišjové (obchodníci) → šúdrové (služebníci) → dalité (nedotknutelní). Moderní právo kastu formálně ruší.", hierarchy: "Bráhmani (kněží a vzdělaní), gurové (duchovní průvodci)", holyPlaces: "Váránasí/Benáres (řeka Ganga — snímek B), Mathura (rodiště Kršny), Ajódhja (rodiště Rámy)", symbols: "Óm / Aum (ॐ), svastika (původně symbol štěstí), lotosový květ", texts: "Védy (nejstarší), Upanišady, Bhagavadgíta, eposy Mahábhárata a Rámájana", holidays: "Díválí (svátek světel), Hólí (festival barev), Navratri, Dussehra", radical: "Hinduistický nacionalismus (Hindutva, BJP v Indii) — násilí vůči muslimům a křesťanům, napětí kolem mešity Babri." },
  { name: "Buddhismus", emoji: "☸️", color: PURPLE, share: "~7,1 %", distribution: "JV Asie (Thajsko, Myanmar, Laos, Kambodža), Tibet, Čína, Japonsko, Korea, Mongolsko", believe: "4 ušlechtilé pravdy (vše je utrpení, příčinou je touha, utrpení lze ukončit, cesta je osmičlenná stezka). Cíl: nirvána = osvobození z koloběhu reinkarnací.", structure: "Théravádový — Pálijský kánon (Thajsko, Sri Lanka). Mahájánový — Čína, Japonsko, Korea. Lámaismus/Vadžrajána — Tibet, Mongolsko.", hierarchy: "Mniši (sangha) jsou jádrem komunity; dalajláma (duchovní vůdce tibetského buddhismu)", holyPlaces: "Bodh Gajá (místo Buddhova osvícení — snímek E), Lumbíní (rodiště — snímek H, Nepál), Sárnáth (první kázání)", symbols: "Dharmačakra ☸️ (kolo dharmy), lotosový květ, obraz Buddhy", texts: "Tipitaka / Trojí koš (théraváda), Prajňápáramitá-sútry (mahájána)", holidays: "Vesak (narozeniny, osvícení a smrt Buddhy), Loy Krathong (Thajsko)", radical: "Buddhistický nacionalismus v Myanmaru (pronásledování muslimů Rohingů). Aum Šinrikjó (Japonsko — útok sarinem v tokijském metru 1995)." },
];

// ─── Flashcard data ───────────────────────────────────────────
const FLASHCARDS = [
  { front: "Ekumena × anekumena", back: "Ekumena = trvale osídlená část pevniny. Anekumena = trvale neobydlená oblast (Antarktida, Sahara, velehorská pásma, Sibiř)." },
  { front: "90 % obyvatel žije na… % souše", back: "90 % světové populace žije na pouhých 20 % souše. Polovina lidstva na 5 % souše — extrémní nerovnoměrnost!" },
  { front: "Hustota zalidnění 0–200 m n.m.", back: "90 ob./km² — s nadmořskou výškou klesá: 201–500 m = 36, 501–1000 m = 23, 1001–1500 m = 14, nad 2000 m = jen 3 ob./km²." },
  { front: "Hustota zalidnění u pobřeží", back: "0–50 km od moře = 110 ob./km². Se vzdáleností klesá: nad 1500 km = jen 5 ob./km². 54 % lidstva žije do 200 km od moře." },
  { front: "Faktory rozložení obyvatel", back: "PŘÍRODNÍ: nadmořská výška, vzdálenost od moře, klima, dostupnost vody. SOCIOEKONOMICKÉ: politický vývoj, hospodářský vývoj, urbanizace." },
  { front: "Světová populace — milníky", back: "1 mld ≈ 1804 | 2 mld 1927 | 3 mld 1960 | 4 mld 1974 | 5 mld 1987 | 6 mld 1999 | 7 mld 2011 | 8 mld 2022 | 10 mld ~2057" },
  { front: "Demografická revoluce", back: "Přechod od vysoké porodnosti + vysoké úmrtnosti → nízká porodnost + nízká úmrtnost. Provází industrializaci a modernizaci." },
  { front: "Přirozený přírůstek", back: "Porodnost − Úmrtnost (na 1 000 obyvatel). Záporný = zemřelých > narozených. Česko: záporný — populace roste jen migrací." },
  { front: "Úhrnná plodnost", back: "Průměrný počet dětí na ženu za celý život. Reprodukční hranice = 2,1 (bez migrace udržuje populaci stabilní). Česko ~1,7." },
  { front: "Fáze 2 demografické revoluce", back: "Vysoká porodnost + klesající úmrtnost → POPULAČNÍ EXPLOZE. Typické pro subsaharskou Afriku, Sahel. Příčina: zlepšení hygieny a medicíny, porodnost ještě neklesla." },
  { front: "Fáze 4 demografické revoluce", back: "Nízká porodnost + nízká úmrtnost → stagnace nebo přirozený pokles. Vyspělé země (Japonsko, Česko, Německo). Stárnutí populace." },
  { front: "Regresivní věková pyramida", back: "Základna užší než střed → stárnutí populace. Typická pro vyspělé země. Regresivní ≠ progresivní (základna nejširší = vysoká porodnost, rozvojové země)." },
  { front: "Modrý banán", back: "Hustě zalidněný průmyslový pás Evropy: Londýn → Benelux → Porúří → severní Itálie. Tvar připomíná banán, modrý = Evropa na mapách." },
  { front: "Křesťanství — základy", back: "31,5 % světové populace. Trojice, Bible (Starý + Nový zákon). Větve: katolíci (největší), pravoslavní (V Evropa), protestanti/evangelíci." },
  { front: "Islám — 5 pilířů", back: "1. Šahada (vyznání víry) 2. Salát (5× modlitba denně k Mekce) 3. Zakát (almužna) 4. Sawm (půst v ramadánu) 5. Hadž (pouť do Mekky)" },
  { front: "Islám sunité × šíité", back: "Sunité ~85 % — uznávají první 4 chalífy. Šíité ~15 % (Írán, Irák, Libanon) — uznávají pouze Alího jako Mohamedova nástupce. Historické schizma 661 n.l." },
  { front: "Hinduismus — kastovní systém", back: "Bráhmani (kněží) → kšatrijové (bojovníci/vládci) → vaišjové (obchodníci) → šúdrové (řemeslníci) → dalité (nedotknutelní). Dnes formálně zakázáno, ale přetrvává." },
  { front: "Buddhismus — větve", back: "Théravádový (JV Asie, Pálijský kánon). Mahájánový (Čína, Japonsko, Korea). Lámaismus (Tibet, Mongolsko — dalajláma)." },
  { front: "Judaismus — charedim", back: "Ultraortodoxní Židé. Žijí odděleně, vlastní vzdělávání, přísné dodržování Tóry. Populace se zdvojnásobuje každých 16 let. V Izraeli nevykonávají vojenskou službu." },
  { front: "Míra religiozity — extrémy", back: "NEJVYŠŠÍ: Indonésie, Saúdská Arábie, Egypt (~98–99 %). NEJNIŽŠÍ: Japonsko (~20 %), Česko (~23 %), Švédsko (~30 %)." },
  { front: "Abrahamitská náboženství", back: "Tři náboženství se společným základem — víra v Boha Abrahámova: Judaismus → Křesťanství → Islám. Všechna uznávají Jeruzalém jako posvátné město." },
  { front: "Indoevropská jazyková rodina", back: "Největší jazyková rodina (~3 mld mluvčích). Zahrnuje: angličtinu, španělštinu, hindštinu, ruštinu, němčinu, francouzštinu, češtinu, perštinu (fársí)." },
];

// ─── Quiz data ────────────────────────────────────────────────
const QUESTIONS = [
  { question: "Jaký podíl světové populace žije na severní polokouli?", type: "single", options: ["~60 %", "~75 %", "~90 %", "~95 %"], correct: [2], explanation: "Přibližně 90 % světové populace žije na severní polokouli. Jižní polokoule má méně pevniny a velká neobydlená území (Antarktida, patagonie, oceány).", tip: "90 % na S polokouli, 90 % na 20 % souše — snadno zapamatuješ jako dvě devadesátky." },
  { question: "Kolik procent světové populace žije v Asii?", type: "single", options: ["~40 %", "~50 %", "~60 %", "~70 %"], correct: [2], explanation: "Přibližně 60 % světové populace žije v Asii. Čína a Indie dohromady tvoří přes 2,8 miliardy obyvatel — každá je světový rekordman.", tip: "Polovina světa = Čína + Indie + JV Asie." },
  { question: "Co je to ekumena?", type: "single", options: ["Neobydlená oblast Antarktidy", "Trvale osídlená část zemského povrchu", "Řídce zalidněná oblast tropů", "Hustota zalidnění pod 1 ob./km²"], correct: [1], explanation: "Ekumena je trvale osídlená část zemského povrchu. Opakem je anekumena — trvale neobydlená oblast (Antarktida, vysoké hory, pouště, tundra)." },
  { question: "Jaká je hustota zalidnění v nadmořské výšce 0–200 m n.m.?", type: "single", options: ["~23 ob./km²", "~55 ob./km²", "~90 ob./km²", "~110 ob./km²"], correct: [2], explanation: "V nejnižším pásmu (0–200 m n.m.) je hustota zalidnění přibližně 90 ob./km². Se stoupající nadmořskou výškou hustota prudce klesá — na výšce nad 2000 m jsou jen 3 ob./km²." },
  { question: "Ve které fázi demografické revoluce dochází k největšímu populačnímu nárůstu?", type: "single", options: ["Fáze 1 (předindustriální)", "Fáze 2 (raná industrializace)", "Fáze 3 (pozdní industrializace)", "Fáze 4 (postindustriální)"], correct: [1], explanation: "Fáze 2: Klesá úmrtnost (díky hygieně a medicíně), ale porodnost zůstává vysoká — výsledkem je populační exploze. Dnes typická pro subsaharskou Afriku.", tip: "Fáze 2 = zlepšila se medicína, porodnost ještě neklesla → boom." },
  { question: "Jaká úhrnná plodnost je potřebná pro přirozenou reprodukci populace?", type: "single", options: ["1,5", "2,1", "2,5", "3,0"], correct: [1], explanation: "Reprodukční hranice je 2,1 dítěte na ženu. Hodnota >2 (ne přesně 2) kvůli kojenecké a dětské úmrtnosti. Česko má ~1,7 — přirozený pokles.", tip: "2,1 = magické číslo demografů. Méně = populace přirozeně klesá." },
  { question: "Které makroregiony patří mezi nejhustěji zalidněné na světě? (vyber všechny)", type: "multi", options: ["Čínsko-japonský (V Asie)", "Indický (J Asie)", "Skandinávie", "Modrý banán (Evropa)", "Střední Asie"], correct: [0, 1, 3], explanation: "Tři hlavní centra: Čínsko-japonský (V Asie), Indický (J Asie) a Modrý banán (průmyslové jádro Evropy: Londýn–Benelux–Porúří–sev. Itálie). Skandinávie a Střední Asie jsou naopak řídce osídleny." },
  { question: "Jaký je podíl křesťanů na světové populaci?", type: "single", options: ["~16 %", "~23 %", "~31,5 %", "~40 %"], correct: [2], explanation: "Křesťanství je největší světové náboženství s podílem ~31,5 %. Muslimů je ~23,2 %, bez vyznání ~16,3 %, hinduistů ~15 %, buddhistů ~7,1 %.", tip: "Pořadí: Křesťanství > Islám > Bez vyznání > Hinduismus > Buddhismus" },
  { question: "Které město je posvátné pro všechna tři abrahamitská náboženství?", type: "single", options: ["Řím", "Mekka", "Jeruzalém", "Váránasí"], correct: [2], explanation: "Jeruzalém je posvátný pro judaismus (Zeď nářků, Chrámová hora), křesťanství (Boží hrob) i islám (Skalní dóm, mešita al-Aksá — 3. nejsvětější místo islámu)." },
  { question: "Jak se nazývá 5 základních povinností každého muslima?", type: "single", options: ["Pět knih Mohameda", "Pět pilířů islámu", "Pět věků islámu", "Pět směrů modlitby"], correct: [1], explanation: "Pět pilířů islámu: 1. Šahada (vyznání víry), 2. Salát (5× modlitba denně), 3. Zakát (almužna), 4. Sawm (půst v ramadánu), 5. Hadž (pouť do Mekky).", tip: "Šahada, Salát, Zakát, Sawm, Hadž — ŠŠZSH" },
  { question: "S jakým makroregionem je hinduismus nejvíce spojen?", type: "single", options: ["Arabský poloostrov a severní Afrika", "Subsaharská Afrika", "Indický subkontinent (Indie, Nepál)", "Jihovýchodní Asie a Oceánie"], correct: [2], explanation: "Hinduismus je etnické náboženství silně vázané na indický subkontinent (Indie, Nepál, Bali). Díky diaspoře je rozšířen i v Mauritiu, Jihoafrické republice nebo Karibiku." },
  { question: "Co jsou charedim?", type: "single", options: ["Šíitská sekta v Íránu", "Ultraortodoxní Židé žijící odděleně od sekulární společnosti", "Buddhistický mnišský řád v Tibetu", "Křesťanský fundamentalistický spolek"], correct: [1], explanation: "Charedim jsou ultraortodoxní Židé. Žijí odděleně, dodržují přísně Tóru, vlastní vzdělávání. Populace se zdvojnásobuje každých ~16 let. V Izraeli jsou osvobozeni od vojenské služby." },
  { question: "Jaká je největší jazyková rodina na světě?", type: "single", options: ["Afroasijská (arabská)", "Čínsko-tibetská", "Indoevropská", "Austronéská"], correct: [2], explanation: "Indoevropská jazyková rodina (~3 mld mluvčích) zahrnuje angličtinu, španělštinu, hindštinu, ruštinu, němčinu, češtinu, fársí a stovky dalších jazyků.", tip: "Téměř celá Evropa + Írán + Indie = indoevropská rodina." },
  { question: "Česko se z demografického hlediska nachází v:", type: "single", options: ["Fázi 1 — vysoká porodnost, vysoká úmrtnost", "Fázi 2 — populační exploze", "Fázi 3 — zpomalující se růst", "Fázi 4 — stagnace, populace roste jen migrací"], correct: [3], explanation: "Česko je ve fázi 4. Přirozený přírůstek je záporný od 90. let. Celková populace roste díky migraci — enormní skok v roce 2022 kvůli ukrajinským uprchlíkům." },
  { question: "Které buddhismus není správně spárován s regionem?", type: "single", options: ["Théravádový — JV Asie (Thajsko, Myanmar)", "Mahájánový — Čína, Japonsko, Korea", "Lámaismus — Tibet, Mongolsko", "Théravádový — Irán, Irák"], correct: [3], explanation: "Théravádový buddhismus je rozšířen v JV Asii (Thajsko, Myanmar/Barma, Laos, Kambodža, Srí Lanka). Írán a Irák jsou naopak z velké části muslimské (šíitské) země.", tip: "Irán = šíitský islám, ne buddhismus!" },
  { question: "Které země patří mezi nejméně religiózní? (vyber správné)", type: "multi", options: ["Japonsko (~20 %)", "Indonésie (~99 %)", "Česko (~23 %)", "Saúdská Arábie (~99 %)", "Švédsko (~30 %)"], correct: [0, 2, 4], explanation: "Japonsko, Česko a Švédsko patří mezi nejméně religiózní země světa. Indonésie a Saúdská Arábie jsou naopak mezi nejvíce věřícími (kolem 99 %). Česko je v globálním srovnání výjimečně sekulární." },
  { question: "Jaký jazyk je úředním jazykem Íránu a hovoří jím postava Zari?", type: "single", options: ["Arabština", "Turečtina", "Fársí (perština)", "Hindština"], correct: [2], explanation: "Zari z textového cvičení pochází z Íránu — úředním jazykem je fársí (perština), která se zapisuje upravenou arabskou abecedou (zprava doleva). Írán ≠ arabsky mluvící země, i když jsou muslimové." },
];

// ─── TAB: Rozložení ───────────────────────────────────────────
function TabRozlozeni() {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px", marginBottom: "20px" }}>
        {[
          { val: "~8,2 mld", label: "Světová populace (2026)", color: ACCENT },
          { val: "90 %", label: "na severní polokouli", color: ACCENT },
          { val: "60 %", label: "lidí v Asii", color: ORANGE },
          { val: "90 % na 20 %", label: "souše (nerovnoměrnost)", color: PURPLE },
        ].map((s, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${s.color}44`, borderRadius: "14px", padding: "14px", textAlign: "center" }}>
            <div style={{ color: s.color, fontSize: "22px", fontWeight: 800 }}>{s.val}</div>
            <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "12px", marginTop: "4px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <Collapsible title="Faktory rozložení obyvatelstva" defaultOpen accent={ACCENT}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          <div>
            <div style={{ color: ACCENT, fontWeight: 700, marginBottom: "8px" }}>🌍 Přírodní faktory</div>
            <ul style={{ margin: 0, paddingLeft: "18px", lineHeight: 2 }}>
              <li><b>Nadmořská výška</b> — 58 % lidí pod 200 m n.m.</li>
              <li><b>Vzdálenost od moře</b> — 54 % do 200 km</li>
              <li><b>Klima</b> — mírné pásy, monsunové oblasti</li>
              <li><b>Dostupnost vody</b> — řeky, povodí, oázy</li>
            </ul>
          </div>
          <div>
            <div style={{ color: ORANGE, fontWeight: 700, marginBottom: "8px" }}>🏭 Socioekonomické faktory</div>
            <ul style={{ margin: 0, paddingLeft: "18px", lineHeight: 2 }}>
              <li><b>Politický vývoj</b> — státy, hranice, války</li>
              <li><b>Hospodářský vývoj</b> — průmysl, trh práce</li>
              <li><b>Historické osídlení</b></li>
              <li><b>Urbanizace</b> — přesun do měst</li>
            </ul>
          </div>
        </div>
      </Collapsible>

      <Collapsible title="Hustota zalidnění dle nadmořské výšky" accent={ACCENT}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {[["0–200 m", 90, ACCENT], ["201–500 m", 36, ACCENT], ["501–1 000 m", 23, GREY], ["1 001–1 500 m", 14, GREY], ["1 501–2 000 m", 9, GREY], ["2 001+ m", 3, "#ef4444"]].map(([h, d, c]) => (
            <div key={h} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "rgba(255,255,255,0.03)", borderRadius: "8px" }}>
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px" }}>{h}</span>
              <span style={{ color: c, fontWeight: 700, fontSize: "14px", fontFamily: "monospace" }}>{d} ob./km²</span>
            </div>
          ))}
        </div>
      </Collapsible>

      <Collapsible title="Hustota zalidnění dle vzdálenosti od pobřeží" accent={ORANGE}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {[["0–50 km", 110, ORANGE], ["51–200 km", 58, ORANGE], ["201–500 km", 38, GREY], ["501–1 000 km", 27, GREY], ["1 001–1 500 km", 17, GREY], ["1 501+ km", 5, "#ef4444"]].map(([h, d, c]) => (
            <div key={h} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "rgba(255,255,255,0.03)", borderRadius: "8px" }}>
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px" }}>{h}</span>
              <span style={{ color: c, fontWeight: 700, fontSize: "14px", fontFamily: "monospace" }}>{d} ob./km²</span>
            </div>
          ))}
        </div>
      </Collapsible>

      <Collapsible title="Vývoj světové populace — milníky" accent={ACCENT}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "8px" }}>
          {[["1804","1 mld"], ["1927","2 mld"], ["1960","3 mld"], ["1974","4 mld"], ["1987","5 mld"], ["1999","6 mld"], ["2011","7 mld"], ["2022","8 mld"], ["~2057","10 mld ⚑"]].map(([rok, val]) => (
            <div key={rok} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "8px 12px", textAlign: "center" }}>
              <div style={{ color: GREY, fontSize: "12px" }}>{rok}</div>
              <div style={{ color: ACCENT, fontWeight: 700, fontSize: "15px" }}>{val}</div>
            </div>
          ))}
        </div>
        <p style={{ margin: "12px 0 0", color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>
          Populace roste absolutně, ale <b style={{ color: ACCENT }}>meziroční relativní přírůstek od 70. let klesá</b> — vrchol byl ~2 % (1968), dnes ~0,9 %.
        </p>
      </Collapsible>

      <Collapsible title="Ekumena × Anekumena" accent={ACCENT}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div style={{ background: ACCENT+"11", border: `1px solid ${ACCENT}33`, borderRadius: "12px", padding: "14px" }}>
            <div style={{ color: ACCENT, fontWeight: 700, marginBottom: "6px" }}>Ekumena</div>
            <p style={{ margin: 0, fontSize: "13px" }}>Trvale osídlená část zemského povrchu. Mírné klima, nízká nadmořská výška, blízkost vody.</p>
          </div>
          <div style={{ background: ORANGE+"11", border: `1px solid ${ORANGE}33`, borderRadius: "12px", padding: "14px" }}>
            <div style={{ color: ORANGE, fontWeight: 700, marginBottom: "6px" }}>Anekumena</div>
            <p style={{ margin: 0, fontSize: "13px" }}>Trvale neobydlená oblast: Antarktida, velehorská pásma, Sahara, Sibiř, polární oblasti.</p>
          </div>
        </div>
      </Collapsible>
    </div>
  );
}

// ─── TAB: Demografická revoluce ───────────────────────────────
// ─── Demographic transition chart ────────────────────────────
function DemoRevoluceChart() {
  const W = 580, H = 268;
  const PL = 44, PR = 10, PT = 38, PB = 46;
  const PW = W - PL - PR, PH = H - PT - PB;
  const MAX_V = 44;
  const rc = n => Math.round(n * 10) / 10;
  const vx = f => PL + f * PW;
  const vy = v => PT + PH - (v / MAX_V) * PH;
  const toXY = data => data.map(([f, v]) => [vx(f), vy(v)]);

  // Catmull-Rom body (no leading M)
  const body = pts => {
    let d = "";
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i-1)], p1 = pts[i], p2 = pts[i+1], p3 = pts[Math.min(pts.length-1, i+2)];
      const c1x = p1[0]+(p2[0]-p0[0])/6, c1y = p1[1]+(p2[1]-p0[1])/6;
      const c2x = p2[0]-(p3[0]-p1[0])/6, c2y = p2[1]-(p3[1]-p1[1])/6;
      d += ` C ${rc(c1x)} ${rc(c1y)},${rc(c2x)} ${rc(c2y)},${rc(p2[0])} ${rc(p2[1])}`;
    }
    return d;
  };
  const mkPath = pts => `M ${rc(pts[0][0])} ${rc(pts[0][1])}${body(pts)}`;

  // Curve data [fraction 0–1, value ‰]
  const bFV = [[0,40],[0.18,40],[0.27,39],[0.36,34],[0.47,24],[0.57,16],[0.67,12],[0.79,10.5],[1,10]];
  const dFV = [[0,36],[0.14,35],[0.24,28],[0.34,18],[0.44,12],[0.52,10],[0.68,10],[1,10]];
  const pFV = [[0,2],[0.18,3],[0.33,7],[0.5,17],[0.65,28],[0.8,36],[1,40]];

  const bPts = toXY(bFV), dPts = toXY(dFV), pPts = toXY(pFV);
  const dRev = [...dPts].reverse();

  const birthLine = mkPath(bPts);
  const deathLine = mkPath(dPts);
  const popLine   = mkPath(pPts);

  // Filled areas
  const popFill = `${popLine} L ${rc(vx(1))} ${rc(vy(0))} L ${rc(vx(0))} ${rc(vy(0))} Z`;
  const niPath  = `M ${rc(bPts[0][0])} ${rc(bPts[0][1])}${body(bPts)} L ${rc(dRev[0][0])} ${rc(dRev[0][1])}${body(dRev)} Z`;

  const phaseBounds = [0.25, 0.5, 0.75];
  const phaseBg = ["rgba(148,163,184,0.06)","rgba(251,146,60,0.07)","rgba(56,189,248,0.07)","rgba(167,139,250,0.06)"];
  const phaseNames = ["1. FÁZE","2. FÁZE","3. FÁZE","4. FÁZE"];

  return (
    <div style={{ width:"100%", overflowX:"auto", marginBottom:"4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", minWidth:"380px", height:"auto", display:"block" }}>
        {/* Phase background bands */}
        {phaseNames.map((_, i) => {
          const x1 = i===0 ? vx(0) : vx(phaseBounds[i-1]);
          const x2 = i===3 ? vx(1) : vx(phaseBounds[i]);
          return <rect key={i} x={rc(x1)} y={PT} width={rc(x2-x1)} height={PH} fill={phaseBg[i]} />;
        })}

        {/* Y gridlines + tick labels */}
        {[0,10,20,30,40].map(v => (
          <g key={v}>
            <line x1={PL} y1={rc(vy(v))} x2={PL+PW} y2={rc(vy(v))} stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
            <text x={PL-5} y={rc(vy(v))+4} fill="rgba(255,255,255,0.3)" fontSize="9.5" textAnchor="end">{v}</text>
          </g>
        ))}

        {/* Phase dividers */}
        {phaseBounds.map(f => (
          <line key={f} x1={rc(vx(f))} y1={PT} x2={rc(vx(f))} y2={PT+PH} stroke="rgba(255,255,255,0.22)" strokeWidth="1" strokeDasharray="4,3"/>
        ))}

        {/* Fills */}
        <path d={popFill} fill="rgba(251,191,36,0.15)"/>
        <path d={niPath}  fill="rgba(56,189,248,0.13)"/>

        {/* Population dashed line */}
        <path d={popLine} fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="5,3" opacity="0.7"/>
        {/* Birth rate */}
        <path d={birthLine} fill="none" stroke="#4ade80" strokeWidth="2.5"/>
        {/* Death rate */}
        <path d={deathLine} fill="none" stroke="#fb923c" strokeWidth="2.5"/>

        {/* Axes */}
        <line x1={PL} y1={PT} x2={PL} y2={PT+PH} stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
        <line x1={PL} y1={PT+PH} x2={PL+PW} y2={PT+PH} stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>

        {/* Y-axis label */}
        <text transform={`translate(13,${PT+PH/2}) rotate(-90)`} fill="rgba(255,255,255,0.28)" fontSize="9" textAnchor="middle">
          NA 1000 OBYVATEL / ROK
        </text>

        {/* Phase labels */}
        {phaseNames.map((name, i) => {
          const x1 = i===0 ? vx(0) : vx(phaseBounds[i-1]);
          const x2 = i===3 ? vx(1) : vx(phaseBounds[i]);
          return <text key={name} x={rc((x1+x2)/2)} y={H-8} fill="rgba(255,255,255,0.62)" fontSize="11" textAnchor="middle" fontWeight="700">{name}</text>;
        })}

        {/* Legend */}
        {[
          [0,    "#4ade80",                 false, "PORODNOST"],
          [115,  "#fb923c",                 false, "ÚMRTNOST"],
          [226,  "rgba(56,189,248,0.45)",   true,  "PŘIROZENÝ PŘÍRŮSTEK"],
          [406,  "rgba(251,191,36,0.45)",   true,  "SVĚTOVÁ POPULACE"],
        ].map(([xOff, clr, isRect, lbl]) => (
          <g key={lbl}>
            {isRect
              ? <rect x={PL+xOff} y={6} width={13} height={10} fill={clr} rx="2"/>
              : <line x1={PL+xOff} y1={11} x2={PL+xOff+18} y2={11} stroke={clr} strokeWidth="2.5"/>
            }
            <text x={PL+xOff+(isRect?17:22)} y={16} fill="rgba(255,255,255,0.62)" fontSize="9.5">{lbl}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function TabDemoRevoluce() {
  return (
    <div>
      <div style={{ background: ACCENT+"12", border: `1px solid ${ACCENT}44`, borderRadius: "16px", padding: "16px 18px", marginBottom: "14px" }}>
        <div style={{ color: ACCENT, fontWeight: 700, fontSize: "15px", marginBottom: "6px" }}>Demografická revoluce</div>
        <p style={{ margin: 0, color: "rgba(255,255,255,0.75)", fontSize: "14px", lineHeight: 1.7 }}>
          Přechod od <b>vysoké porodnosti + vysoké úmrtnosti</b> k <b>nízkým hodnotám obou</b>, provázející industrializaci a modernizaci. Populace nejprve exploduje (fáze 2), poté se stabilizuje (fáze 4).
        </p>
      </div>

      <DemoRevoluceChart />

      <Collapsible title="Klíčové pojmy" defaultOpen accent={ACCENT}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "8px" }}>
          {[
            ["Přirozený přírůstek", "Porodnost − Úmrtnost (‰). Kladný = roste přirozeně.", ACCENT],
            ["Porodnost (natalita)", "Počet živě narozených na 1 000 obyvatel ročně.", ORANGE],
            ["Úmrtnost (mortalita)", "Počet zemřelých na 1 000 obyvatel ročně.", ORANGE],
            ["Úhrnná plodnost", "Průměrný počet dětí na ženu. Hranice = 2,1.", GREEN],
            ["Naděje dožití", "Průměrná délka života při narození. Ženy > muži.", GREEN],
            ["Kojenecká úmrtnost", "Zemřelí do 1 roku na 1 000 živě narozených. Ukazatel vyspělosti.", GREY],
            ["Věková pyramida", "Graf věkové a pohlavní struktury. Typ pyramidy → fáze demografické revoluce.", PURPLE],
            ["Přírůstek stěhováním", "Přistěhovalí − Vystěhovalí. Pro Česko klíčový zdroj populačního růstu.", ACCENT],
          ].map(([t, d, c]) => (
            <div key={t} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${c}22`, borderRadius: "10px", padding: "10px 12px" }}>
              <div style={{ color: c, fontWeight: 600, fontSize: "13px", marginBottom: "3px" }}>{t}</div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px" }}>{d}</div>
            </div>
          ))}
        </div>
      </Collapsible>

      <Collapsible title="4 fáze demografické revoluce" defaultOpen accent={ACCENT}>
        {[
          { faze: "Fáze 1", nazev: "Předindustriální", porod: "Vysoká", umrt: "Vysoká", prir: "Stagnace / mírný růst", ex: "Středověká Evropa, preindustriální společnosti", color: GREY, icon: "⚖️" },
          { faze: "Fáze 2", nazev: "Raná industrializace", porod: "Vysoká", umrt: "↓ Klesající", prir: "POPULAČNÍ EXPLOZE", ex: "Subsaharská Afrika, Sahel (dnes)", color: ORANGE, icon: "💥" },
          { faze: "Fáze 3", nazev: "Pozdní industrializace", porod: "↓ Klesající", umrt: "Nízká", prir: "Zpomalující se růst", ex: "Latinská Amerika, JV Asie", color: ACCENT, icon: "📉" },
          { faze: "Fáze 4", nazev: "Postindustriální", porod: "Nízká", umrt: "Nízká", prir: "Stagnace / přirozený pokles", ex: "Japonsko, Česko, Německo, celá EU", color: PURPLE, icon: "🏙️" },
        ].map(f => (
          <div key={f.faze} style={{ background: f.color+"0f", border: `1px solid ${f.color}33`, borderRadius: "12px", padding: "14px 16px", marginBottom: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <span style={{ color: f.color, fontWeight: 700 }}>{f.icon} {f.faze}: {f.nazev}</span>
              <span style={{ background: f.color+"22", border: `1px solid ${f.color}44`, borderRadius: "8px", padding: "2px 10px", color: f.color, fontSize: "12px" }}>{f.prir}</span>
            </div>
            <div style={{ display: "flex", gap: "20px", fontSize: "13px", color: "rgba(255,255,255,0.65)", marginBottom: "4px" }}>
              <span>Porodnost: <b style={{ color: "#fff" }}>{f.porod}</b></span>
              <span>Úmrtnost: <b style={{ color: "#fff" }}>{f.umrt}</b></span>
            </div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>Příklad: {f.ex}</div>
          </div>
        ))}
      </Collapsible>

      <Collapsible title="Typy věkových pyramid" accent={ACCENT}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(185px, 1fr))", gap: "10px" }}>
          {[
            { typ: "Progresivní", sym: "▽", popis: "Základna nejširší — hodně dětí, málo starých. Rychlý populační růst. Rozvojové země (Nigérie, Mali).", color: ORANGE },
            { typ: "Stacionární", sym: "⬡", popis: "Přibližně stejná šířka základny a středu. Stabilní populace, přechod.", color: ACCENT },
            { typ: "Regresivní", sym: "△", popis: "Základna užší než střed — stárnutí populace. Pokles / stagnace. Japonsko, Česko, Německo.", color: PURPLE },
          ].map(p => (
            <div key={p.typ} style={{ background: p.color+"11", border: `1px solid ${p.color}33`, borderRadius: "12px", padding: "14px", textAlign: "center" }}>
              <div style={{ fontSize: "34px", marginBottom: "6px" }}>{p.sym}</div>
              <div style={{ color: p.color, fontWeight: 700, marginBottom: "6px" }}>{p.typ}</div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", lineHeight: 1.5 }}>{p.popis}</div>
            </div>
          ))}
        </div>
      </Collapsible>

      <Collapsible title="Česko — demografický vývoj" accent={ACCENT}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
          {[
            ["Přirozený přírůstek", "Záporný od 90. let — zemřelých > narozených", "#ef4444"],
            ["Přírůstek stěhováním", "Kladný — migrace zachraňuje populaci", "#22c55e"],
            ["Úhrnná plodnost (ČR)", "~1,7 — pod reprodukční hranicí 2,1", ORANGE],
            ["Rok 2022 — skok", "Příchod Ukrajinců zvýšil celkový přírůstek ~330 tis.", ACCENT],
          ].map(([t, d, c]) => (
            <div key={t} style={{ background: "rgba(255,255,255,0.03)", borderRadius: "10px", padding: "12px", borderLeft: `3px solid ${c}` }}>
              <div style={{ color: c, fontWeight: 600, fontSize: "13px", marginBottom: "3px" }}>{t}</div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px" }}>{d}</div>
            </div>
          ))}
        </div>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", margin: 0 }}>
          Od poloviny 70. let porodnost v Česku klesá (s výjimkou přelomu tisíciletí). Česko je ve fázi 4 — regresivní věková pyramida, průměrný věk obyvatel roste.
        </p>
      </Collapsible>
    </div>
  );
}

// ─── RaceMap SVG ──────────────────────────────────────────────
function RaceMap() {
  const W = 700, H = 340;
  // Coordinate helpers: equirectangular projection
  // x = (lon + 180) * W / 360,  y = (90 - lat) * H / 180
  const races = [
    {
      label: "Europoidní", color: "#60a5fa",
      regions: [
        // Europe
        "M330,57 L390,38 L428,47 L428,94 L398,104 L340,104 L332,87 Z",
        // N Africa + Middle East
        "M315,104 L428,94 L476,98 L476,142 L428,147 L321,142 Z",
        // South Asia
        "M476,98 L525,104 L505,161 L476,161 Z",
      ],
    },
    {
      label: "Mongoloidní", color: "#fbbf24",
      regions: [
        // N America (indigenous)
        "M23,47 L232,40 L236,92 L206,132 L168,150 L120,113 L38,68 Z",
        // S America
        "M195,147 L281,155 L278,246 L224,274 L195,237 Z",
        // Russia + Siberia
        "M428,47 L700,19 L700,76 L544,66 L476,98 L428,94 Z",
        // East Asia (China, Korea, Japan)
        "M544,66 L630,66 L622,123 L573,132 L544,104 Z",
        // SE Asia
        "M527,123 L622,123 L622,179 L564,185 L527,151 Z",
      ],
    },
    {
      label: "Negroidní", color: "#f97316",
      regions: [
        // Sub-Saharan Africa
        "M315,142 L456,142 L456,185 L437,236 L389,236 L315,200 Z",
        // Papua / Melanesia
        "M630,168 L660,163 L663,193 L633,197 Z",
      ],
    },
    {
      label: "Australoidní", color: "#a78bfa",
      regions: [
        // Australia
        "M572,198 L648,198 L646,245 L572,236 Z",
      ],
    },
  ];

  return (
    <div style={{ margin: "16px 0" }}>
      <div style={{ color: GREY, fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>Rozšíření lidských ras — schematická mapa</div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: `${W}px`, display: "block", borderRadius: "12px" }}>
        <rect width={W} height={H} fill="rgba(10,20,50,0.55)" rx="12" />
        {/* Subtle grid */}
        {[1,2,3].map(i => <line key={`h${i}`} x1="0" y1={H*i/4} x2={W} y2={H*i/4} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />)}
        {[1,2,3,4,5,6,7].map(i => <line key={`v${i}`} x1={W*i/8} y1="0" x2={W*i/8} y2={H} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />)}
        {/* Equator */}
        <line x1="0" y1={H/2} x2={W} y2={H/2} stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="5,4" />
        <text x="6" y={H/2-4} fill="rgba(255,255,255,0.22)" fontSize="8" fontFamily="Inter,sans-serif">ROVNÍK</text>
        {/* Regions */}
        {races.map(race => race.regions.map((d, j) => (
          <path key={`${race.label}-${j}`} d={d} fill={race.color} fillOpacity="0.38" stroke={race.color} strokeWidth="1.5" strokeOpacity="0.7" />
        )))}
        {/* Continent labels */}
        {[
          [120, 85, "SEVERNÍ AMERIKA"],
          [235, 205, "JIŽNÍ AMERIKA"],
          [378, 73, "EVROPA"],
          [383, 190, "AFRIKA"],
          [570, 88, "ASIE"],
          [610, 224, "AUSTRÁLIE"],
        ].map(([x, y, t]) => (
          <text key={t} x={x} y={y} fill="rgba(255,255,255,0.22)" fontSize="9" textAnchor="middle" fontFamily="Inter,sans-serif">{t}</text>
        ))}
        {/* Legend */}
        {races.map((race, i) => (
          <g key={race.label} transform={`translate(${8 + i * 170}, ${H - 26})`}>
            <rect width="12" height="12" fill={race.color} fillOpacity="0.6" stroke={race.color} strokeWidth="1" rx="2" />
            <text x="16" y="10" fill="rgba(255,255,255,0.78)" fontSize="11" fontFamily="Inter,sans-serif">{race.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// ─── PieChartNabozenstvi SVG ───────────────────────────────────
function PieChartNabozenstvi() {
  const data = [
    { label: "Křesťanství",  pct: 31.5, color: "#60a5fa" },
    { label: "Islám",         pct: 23.2, color: "#34d399" },
    { label: "Bez vyznání",   pct: 16.3, color: "#94a3b8" },
    { label: "Hinduismus",    pct: 15.0, color: "#fb923c" },
    { label: "Buddhismus",    pct:  7.1, color: "#a78bfa" },
    { label: "Lidové víry",   pct:  5.9, color: "#fbbf24" },
    { label: "Ostatní",       pct:  0.8, color: "#f472b6" },
    { label: "Judaismus",     pct:  0.2, color: "#6ee7b7" },
  ];
  const cx = 115, cy = 115, r = 96;
  let cum = 0;
  const slices = data.map(d => {
    const a0 = (cum / 100) * 2 * Math.PI - Math.PI / 2;
    cum += d.pct;
    const a1 = (cum / 100) * 2 * Math.PI - Math.PI / 2;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const large = d.pct > 50 ? 1 : 0;
    return { ...d, path: `M${cx},${cy} L${x0.toFixed(1)},${y0.toFixed(1)} A${r},${r} 0 ${large} 1 ${x1.toFixed(1)},${y1.toFixed(1)} Z` };
  });

  return (
    <div style={{ margin: "0 0 20px" }}>
      <div style={{ color: GREY, fontSize: "13px", fontWeight: 600, marginBottom: "10px" }}>Podíl světové populace dle náboženství (zdroj: Worldometers)</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center" }}>
        <svg viewBox="0 0 230 230" style={{ width: "200px", flexShrink: 0 }}>
          {slices.map((s, i) => (
            <path key={i} d={s.path} fill={s.color} fillOpacity="0.82" stroke="#0a0a1a" strokeWidth="1.5" />
          ))}
        </svg>
        <div style={{ flex: 1, minWidth: "170px" }}>
          {data.map((d, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "7px" }}>
              <div style={{ width: "12px", height: "12px", borderRadius: "3px", background: d.color, flexShrink: 0 }} />
              <div style={{ color: "rgba(255,255,255,0.72)", fontSize: "13px", flex: 1 }}>{d.label}</div>
              <div style={{ color: d.color, fontWeight: 700, fontSize: "13px" }}>{d.pct}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── TAB: Struktura ───────────────────────────────────────────
function TabStruktura() {
  return (
    <div>
      <Collapsible title="Rasová struktura" defaultOpen accent={ACCENT}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(195px, 1fr))", gap: "10px" }}>
          {[
            { rasa: "Europoidní (kavkazská)", oblast: "Evropa, S Amerika, Blízký Východ, S Indie, Austrálie (osadníci)", color: "#60a5fa" },
            { rasa: "Mongoloidní", oblast: "Asie (Čína, Japonsko...), domorodí Američané (Indiáni, Eskymáci)", color: "#fbbf24" },
            { rasa: "Negroidní", oblast: "Subsaharská Afrika, Melanésie, části JV Asie", color: "#f97316" },
            { rasa: "Australoidní", oblast: "Domorodí Australané (Aboriginci), Melanésie, Papuánci", color: PURPLE },
          ].map(r => (
            <div key={r.rasa} style={{ background: r.color+"11", border: `1px solid ${r.color}33`, borderRadius: "12px", padding: "12px" }}>
              <div style={{ color: r.color, fontWeight: 700, fontSize: "13px", marginBottom: "5px" }}>{r.rasa}</div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px" }}>{r.oblast}</div>
            </div>
          ))}
        </div>
        <RaceMap />
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px", margin: "4px 0 0" }}>Poznámka: Rasová kategorizace je vědecky zpochybňovaná — genetické variace jsou kontinuální.</p>
      </Collapsible>

      <Collapsible title="Jazyková struktura — rodiny a písma" defaultOpen accent={ACCENT}>
        <div style={{ marginBottom: "14px" }}>
          <div style={{ color: ORANGE, fontWeight: 700, marginBottom: "8px" }}>Největší jazykové rodiny</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "8px" }}>
            {[
              ["🌍 Indoevropská", "Angličtina, španělština, hindština, ruština, němčina, čeština, fársí — ~3 mld mluvčích", ACCENT],
              ["🀄 Čínsko-tibetská", "Čínština (mandarínština) = největší počet rodilých mluvčích (1,1 mld)", ORANGE],
              ["☪️ Afroasijská", "Arabština, hebrejština, amharština (Etiopie)", "#fbbf24"],
              ["🌺 Austronéská", "Malajština, filipínština, maorština, havajština, indonéština", GREEN],
              ["🌿 Nigersko-kongžská", "Svahilština, jorubština, zulština — subsaharská Afrika", "#f97316"],
              ["🕉️ Drávidská", "Tamilština, telugština, kannadština — jižní Indie", PURPLE],
            ].map(([n, d, c]) => (
              <div key={n} style={{ background: "rgba(255,255,255,0.03)", borderRadius: "10px", padding: "10px 12px" }}>
                <div style={{ color: c, fontWeight: 600, fontSize: "13px", marginBottom: "3px" }}>{n}</div>
                <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "12px" }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ color: ACCENT, fontWeight: 700, marginBottom: "8px" }}>Typy písma</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {[
            ["Latinka", "nejrozšířenější"],
            ["Cyrilice", "ruština, srbština"],
            ["Arabské", "zprava doleva"],
            ["Devanágarí", "hindština"],
            ["Čínské znaky", "logografické"],
            ["Japonské", "3 systémy: hiragana + katakana + kandži"],
            ["Hebrejské", "zprava doleva"],
          ].map(([p, d]) => (
            <div key={p} style={{ background: ACCENT+"11", border: `1px solid ${ACCENT}22`, borderRadius: "8px", padding: "5px 11px", fontSize: "12px" }}>
              <span style={{ color: ACCENT, fontWeight: 600 }}>{p}</span>
              <span style={{ color: "rgba(255,255,255,0.45)" }}> — {d}</span>
            </div>
          ))}
        </div>
      </Collapsible>

      <Collapsible title="Cvičení — Poznej zemi z textu" accent={ORANGE}>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", marginBottom: "12px" }}>
          Na základě nápovědy urči zemi. Klikni pro zobrazení odpovědi.
        </p>
        {[
          { popis: "Didier: jazyk bývalých kolonizátorů + latinka, ⅓ muslimů + ⅕ křesťanů + zbytek animisté, důležitá plodina: kakao, plantáže.", odpoved: "Pobřeží slonoviny (Côte d'Ivoire) — frankofonní, islám + křesťanství + tradiční víra.", color: ORANGE },
          { popis: "Zari: fársí (upravená arabská abeceda), šíitský islám provázaný s politikou, demonstrace proti autoritativnímu režimu.", odpoved: "Írán — perština (fársí), šíitský islám, teokratická republika.", color: ACCENT },
          { popis: "Dayto: nejsložitější písmo na světě, buddhismus + šintoismus (animismus), technologicky vyspělá postindustriální společnost.", odpoved: "Japonsko — japonské písmo (3 systémy), buddhismus + šintoismus.", color: PURPLE },
          { popis: "Maria: největší země světadílu, jméno z křesťanství kolonizátorů, africký + indiánský (Jagua) původ rodičů, chodí do kostela.", odpoved: "Brazílie — portugalština, křesťanství (převážně katolické), afrobrazilský + indiánský původ.", color: GREEN },
          { popis: "Jere: nedávno zrušena vojenská neutralita, ugrofinský jazyk (příbuzný jen s estonštinou a maďarštinou), luteránství.", odpoved: "Finsko — finština (ugrofinská rodina), vstup do NATO 2023, luteránské křesťanství.", color: "#fbbf24" },
          { popis: "Michael: velké město s afroamerickou většinou, tátova rodina z Irska (= katolík), mamka z jihu, zpívá gospel (= evangelík/baptista).", odpoved: "USA — město s afroamerickou majoritu (>50 %), katolická vs. evangelická tradice rodiny.", color: ORANGE },
        ].map((c, i) => <AnswerCard key={i} popis={c.popis} odpoved={c.odpoved} color={c.color} />)}
      </Collapsible>
    </div>
  );
}

// ─── TAB: Náboženství ─────────────────────────────────────────
function TabNabozenstvi() {
  const [sel, setSel] = useState(null);
  const rel = sel !== null ? RELIGIONS[sel] : null;

  return (
    <div>
      <PieChartNabozenstvi />
      {/* religion cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "10px", marginBottom: "20px" }}>
        {RELIGIONS.map((r, i) => (
          <button key={i} onClick={() => setSel(sel === i ? null : i)} style={{ background: sel === i ? r.color+"22" : "rgba(255,255,255,0.04)", border: `1px solid ${sel === i ? r.color : "rgba(255,255,255,0.07)"}`, borderRadius: "14px", padding: "14px 10px", cursor: "pointer", textAlign: "center", transition: "all 0.4s ease" }}>
            <div style={{ fontSize: "26px", marginBottom: "4px" }}>{r.emoji}</div>
            <div style={{ color: r.color, fontWeight: 700, fontSize: "13px" }}>{r.name}</div>
            <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "12px", marginTop: "2px" }}>{r.share}</div>
          </button>
        ))}
      </div>

      {/* míra religiozity */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "14px 16px", marginBottom: "16px" }}>
        <div style={{ color: ORANGE, fontWeight: 700, marginBottom: "10px" }}>Míra religiozity ve světě</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {[
            ["Indonésie, Saúd. Arábie, Egypt", "~98–99 %", "#22c55e"],
            ["Nigérie, Chorvatsko, Polsko", "~92–96 %", "#84cc16"],
            ["Itálie, USA, Brazílie", "~76–80 %", ACCENT],
            ["Česko", "~23 %", PURPLE],
            ["Japonsko", "~20 %", "#fbbf24"],
          ].map(([z, p, c]) => (
            <div key={z} style={{ background: c+"11", border: `1px solid ${c}33`, borderRadius: "8px", padding: "6px 12px", fontSize: "13px" }}>
              <span style={{ color: "rgba(255,255,255,0.65)" }}>{z}: </span>
              <span style={{ color: c, fontWeight: 700 }}>{p}</span>
            </div>
          ))}
        </div>
      </div>

      {/* detail panel */}
      {rel && (
        <div style={{ background: rel.color+"0f", border: `2px solid ${rel.color}55`, borderRadius: "20px", padding: "20px", marginBottom: "16px", transition: "all 0.4s ease" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <span style={{ fontSize: "34px" }}>{rel.emoji}</span>
            <div>
              <div style={{ color: rel.color, fontWeight: 800, fontSize: "20px" }}>{rel.name}</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>{rel.share} světové populace</div>
            </div>
            <button onClick={() => setSel(null)} style={{ marginLeft: "auto", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "8px", color: "rgba(255,255,255,0.5)", cursor: "pointer", padding: "4px 12px", fontSize: "12px" }}>✕ Zavřít</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "10px" }}>
            {[["🌍 Rozmístění", rel.distribution], ["🙏 Věří v...", rel.believe], ["🏛️ Struktura", rel.structure], ["👑 Hierarchie", rel.hierarchy], ["📍 Svatá místa", rel.holyPlaces], ["🔣 Symboly", rel.symbols], ["📖 Svaté texty", rel.texts], ["🎉 Svátky", rel.holidays], ["⚠️ Radikální projevy", rel.radical]].map(([t, d]) => (
              <div key={t} style={{ background: "rgba(255,255,255,0.03)", borderRadius: "10px", padding: "11px", borderLeft: `3px solid ${rel.color}` }}>
                <div style={{ color: rel.color, fontWeight: 600, fontSize: "12px", marginBottom: "4px" }}>{t}</div>
                <div style={{ color: "rgba(255,255,255,0.72)", fontSize: "13px", lineHeight: 1.5 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comparative table */}
      <Collapsible title="Srovnávací tabulka 5 světových náboženství" accent={ACCENT}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", minWidth: "580px" }}>
            <thead>
              <tr>
                {["Kategorie", "✡️ Judaismus", "✝️ Křesťanství", "☪️ Islám", "🕉️ Hinduismus", "☸️ Buddhismus"].map((h, i) => (
                  <th key={i} style={{ padding: "8px 10px", borderBottom: "1px solid rgba(255,255,255,0.1)", color: i === 0 ? GREY : RELIGIONS[i-1]?.color, textAlign: i === 0 ? "left" : "center", fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Podíl svět. pop.", "~0,2 %", "~31,5 %", "~23,2 %", "~15 %", "~7,1 %"],
                ["Typ náboženství", "Etnické / monoteismus", "Světové / monoteismus", "Světové / monoteismus", "Etnické / polyteismus", "Světové / non-teistické"],
                ["Zakladatel / prorok", "Mojžíš (zákon)", "Ježíš Kristus", "Mohamed", "— (bez zakladatele)", "Siddhártha Gautama"],
                ["Svatá kniha", "Tóra + Talmud", "Bible (ST + NT)", "Korán", "Védy, Bhagavadgíta", "Tipitaka"],
                ["Hlavní oblast", "Izrael + diaspora", "Evropa, Amerika", "Blízký Vých., S Afrika", "Indie, Nepál", "JV Asie, Tibet"],
                ["Posvátné město", "Jeruzalém", "Jeruzalém, Řím", "Mekka, Medína", "Váránasí", "Bodh Gajá, Lumbíní"],
              ].map((row, ri) => (
                <tr key={ri} style={{ background: ri % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                  {row.map((cell, ci) => (
                    <td key={ci} style={{ padding: "7px 10px", color: ci === 0 ? GREY : "rgba(255,255,255,0.72)", fontWeight: ci === 0 ? 600 : 400, textAlign: ci === 0 ? "left" : "center", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: "12px" }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Collapsible>

      <Collapsible title="Abrahamitská náboženství — co mají společného" accent={ACCENT}>
        <p style={{ margin: 0, color: "rgba(255,255,255,0.72)", fontSize: "14px", lineHeight: 1.7 }}>
          Judaismus, křesťanství a islám sdílejí společného praotce — <b style={{ color: ORANGE }}>Abraháma</b>. Všechna tři jsou <b style={{ color: ACCENT }}>monoteistická</b> (jeden Bůh), uznávají Starý zákon a považují <b style={{ color: "#fbbf24" }}>Jeruzalém</b> za posvátné město. Historicky navazují: judaismus → křesťanství → islám. Islám uznává Ježíše jako proroka, ale ne jako Boha.
        </p>
      </Collapsible>

      <Collapsible title="Definice náboženství — teoretické přístupy" accent={GREY}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "10px" }}>
          {[
            { typ: "Substantivní", otazka: "Čím náboženství JE?", predstavitel: "E.B. Tylor, R. Otto, M. Eliade", podstata: "Víra v duchovní bytosti, vztah k posvátnu a nadpřirozenému.", color: ACCENT },
            { typ: "Funkcionalistické", otazka: "Co náboženství DĚLÁ?", predstavitel: "É. Durkheim, B. Malinowski", podstata: "Sociální tmel — udržuje komunitu, vytváří solidaritu a morální řád.", color: ORANGE },
            { typ: "Symbolické", otazka: "Co náboženství ZNAMENÁ?", predstavitel: "C. Geertz", podstata: "Systém symbolů dávající lidskému životu smysl, vysvětlující utrpení a smrt.", color: PURPLE },
          ].map(d => (
            <div key={d.typ} style={{ background: d.color+"0f", border: `1px solid ${d.color}33`, borderRadius: "12px", padding: "13px" }}>
              <div style={{ color: d.color, fontWeight: 700, fontSize: "14px", marginBottom: "4px" }}>{d.typ}</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", fontStyle: "italic", marginBottom: "6px" }}>"{d.otazka}"</div>
              <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "11px", marginBottom: "4px" }}>Představitelé: {d.predstavitel}</div>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px" }}>{d.podstata}</div>
            </div>
          ))}
        </div>
      </Collapsible>
    </div>
  );
}

// ─── TAB: Tahák ───────────────────────────────────────────────
function TabTahak() {
  const block = (title, rows, color = ACCENT) => (
    <div style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${color}33`, borderRadius: "14px", padding: "14px 16px", marginBottom: "12px" }}>
      <div style={{ color: color, fontWeight: 700, fontSize: "14px", paddingBottom: "8px", marginBottom: "8px", borderBottom: `1px solid ${color}22` }}>{title}</div>
      {rows.map(([k, v, c], i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid rgba(255,255,255,0.03)", gap: "10px" }}>
          <span style={{ color: GREY, fontSize: "13px", minWidth: "160px" }}>{k}</span>
          <span style={{ color: c || "rgba(255,255,255,0.75)", fontSize: "13px", textAlign: "right", lineHeight: 1.4, fontFamily: k.includes("vzorec") || k.includes("Vzorec") ? "monospace" : "inherit" }}>{v}</span>
        </div>
      ))}
    </div>
  );
  return (
    <div style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>
      {block("Klíčová čísla — rozložení populace", [
        ["Světová populace (2022)", "8 miliard", ACCENT],
        ["Prognóza 10 mld", "~2057–2058"],
        ["Populace na S polokouli", "~90 %", ACCENT],
        ["Populace v Asii", "~60 %", ACCENT],
        ["90 % obyvatel na", "20 % souše", ORANGE],
        ["½ obyvatel na", "5 % souše"],
        ["Hustota 0–200 m n.m.", "90 ob./km²"],
        ["Hustota 201–500 m n.m.", "36 ob./km²"],
        ["Hustota 0–50 km od moře", "110 ob./km²"],
        ["Hustota 51–200 km od moře", "58 ob./km²"],
        ["Nejhust. makroregiony", "Čínsko-japonský, Indický, Modrý banán"],
      ], ACCENT)}

      {block("Demografická revoluce — rychlý přehled", [
        ["Fáze 1", "Vysoká porodnost + Vysoká úmrtnost → stagnace"],
        ["Fáze 2", "Vysoká porodnost + ↓ Úmrtnost → EXPLOZE", ORANGE],
        ["Fáze 3", "↓ Porodnost + Nízká úmrtnost → zpomalení"],
        ["Fáze 4", "Nízká porodnost + Nízká úmrtnost → pokles", PURPLE],
        ["Reprodukční hranice", "2,1 dítěte na ženu"],
        ["Česko — fáze", "4 — roste jen díky migraci", PURPLE],
        ["Česko — ÚF", "~1,7"],
        ["Progresivní pyramida", "rozvojové země (Nigérie, Mali)"],
        ["Regresivní pyramida", "vyspělé země (Japonsko, Česko)"],
      ], ORANGE)}

      {block("Světová náboženství — klíčová data", [
        ["Křesťanství", "~31,5 % — největší", "#60a5fa"],
        ["Islám", "~23,2 % — nejrychleji roste", "#34d399"],
        ["Bez vyznání", "~16,3 %"],
        ["Hinduismus", "~15 %", "#f97316"],
        ["Buddhismus", "~7,1 %", PURPLE],
        ["Judaismus", "~0,2 % — nejméně početné", "#fbbf24"],
        ["Nejméně religiózní", "Japonsko ~20 %, Česko ~23 %"],
        ["Nejvíce religiózní", "Indonésie, Saúd. Arábie, Egypt ~99 %"],
        ["Abrahamitská nábož.", "Judaismus, Křesťanství, Islám"],
        ["Posvátné pro všechny 3", "Jeruzalém"],
      ], GREEN)}

      {block("Světová náboženství — rychlá reference", [
        ["✡️ Judaismus", "Tóra + Talmud | Jeruzalém | Zeď nářků"],
        ["✝️ Křesťanství", "Bible | Jeruzalém, Řím | kříž | 3 větve"],
        ["☪️ Islám", "Korán | Mekka, Medína | 5 pilířů | S+Š"],
        ["🕉️ Hinduismus", "Védy | Váránasí | kasty | karma"],
        ["☸️ Buddhismus", "Tipitaka | Bodh Gajá | nirvána | 3 větve"],
      ], "#fbbf24")}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState(0);
  const TABS = ["🌍 Rozložení", "📈 Dem. revoluce", "👥 Struktura", "✝️ Náboženství", "📋 Tahák", "🃏 Kartičky", "❓ Kvíz"];

  const renderTab = () => {
    if (tab === 0) return <TabRozlozeni />;
    if (tab === 1) return <TabDemoRevoluce />;
    if (tab === 2) return <TabStruktura />;
    if (tab === 3) return <TabNabozenstvi />;
    if (tab === 4) return <TabTahak />;
    if (tab === 5) return <Flashcards cards={FLASHCARDS} accent={ACCENT} />;
    if (tab === 6) return <QuizEngine questions={QUESTIONS} accentColor={ACCENT} />;
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a1a", fontFamily: "'Segoe UI', system-ui, sans-serif", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');
        @keyframes fl1{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(28px,-18px) scale(1.06)}}
        @keyframes fl2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-18px,26px) scale(0.94)}}
        @keyframes fl3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(18px,18px) scale(1.07)}}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-thumb{background:rgba(56,189,248,0.28);border-radius:3px}
        button:hover{opacity:0.83}
      `}</style>

      {/* Floating background circles */}
      {[
        { sz: 420, top:"-80px",  left:"-100px", c:"rgba(56,189,248,0.06)",  an:"fl1", dur:"16s" },
        { sz: 340, top:"35%",   right:"-70px",  c:"rgba(251,146,60,0.05)",  an:"fl2", dur:"20s" },
        { sz: 480, bottom:"-120px",left:"18%",  c:"rgba(56,189,248,0.04)",  an:"fl3", dur:"24s" },
        { sz: 220, top:"55%",   left:"4%",      c:"rgba(167,139,250,0.05)", an:"fl1", dur:"18s" },
      ].map((c, i) => (
        <div key={i} style={{ position:"fixed", width:c.sz, height:c.sz, borderRadius:"50%", background:c.c, filter:"blur(55px)", top:c.top, left:c.left, right:c.right, bottom:c.bottom, animation:`${c.an} ${c.dur} ease-in-out infinite`, pointerEvents:"none", zIndex:0 }} />
      ))}

      <div style={{ position:"relative", zIndex:1, maxWidth:"920px", margin:"0 auto", padding:"24px 16px" }}>
        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:"26px" }}>
          <div style={{ display:"inline-block", background:ACCENT+"18", border:`1px solid ${ACCENT}44`, borderRadius:"20px", padding:"3px 14px", color:ACCENT, fontSize:"11px", fontWeight:600, marginBottom:"10px", letterSpacing:"1px", textTransform:"uppercase" }}>
            Zeměpis · 2. ročník · Příprava na písemku
          </div>
          <h1 style={{ margin:0, color:"#fff", fontSize:"clamp(20px,5vw,30px)", fontWeight:800, lineHeight:1.2 }}>Světová populace</h1>
          <p style={{ color:"rgba(255,255,255,0.4)", fontSize:"13px", margin:"7px 0 0" }}>
            Rozložení · Demografická revoluce · Struktura (rasová, jazyková, náboženská)
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", flexWrap:"wrap", gap:"7px", justifyContent:"center", marginBottom:"20px" }}>
          {TABS.map((t, i) => (
            <button key={i} onClick={() => setTab(i)} style={{ padding:"8px 14px", borderRadius:"11px", border:"none", background: tab===i ? `linear-gradient(135deg, ${ACCENT}, #7dd3fc)` : "rgba(255,255,255,0.07)", color: tab===i ? "#0a0a1a" : "rgba(255,255,255,0.6)", fontWeight: tab===i ? 700 : 400, fontSize:"13px", cursor:"pointer", transition:"all 0.4s ease" }}>
              {t}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ background:"rgba(255,255,255,0.03)", backdropFilter:"blur(20px)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"22px", padding:"22px", minHeight:"400px" }}>
          {renderTab()}
        </div>
      </div>
    </div>
  );
}
