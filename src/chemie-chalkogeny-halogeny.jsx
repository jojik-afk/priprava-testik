// @title Chemie – Chalkogeny a halogeny (příprava na test)
// @subject Chemistry
// @topic Síra, sloučeniny síry, halogeny a jejich sloučeniny
// @template mixed

import { useState, useCallback, useMemo } from "react";

/* ═══════════════════════════════════════════════════════════════════
   QUIZ ENGINE (z assets/quiz-engine.jsx, restylováno do tématu Laborka)
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

function QuizEngine({ questions, accentColor = "#2ee6a8" }) {
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
      pct >= 90 ? "Výborně. Chalkogeny i halogeny máš zvládnuté – jdi si odpočinout."
      : pct >= 70 ? "Dobré. Projdi si ještě Tahák a rovnice, které ti nesedly."
      : pct >= 50 ? "Základ držíš, ale rovnice a názvosloví chtějí ještě kolo."
      : "Vrať se k teorii a kartičkám. Pak zkus kvíz znovu – půjde to líp.";
    return (
      <div className="qz-results">
        <Box>
          <div className="qz-score">{score} / {shuffledQuestions.length}</div>
          <div className="qz-pct">{pct} %</div>
          <div className="qz-msg">{msg}</div>
          <button className="btn btn-accent" onClick={restart}>Začít znovu</button>
        </Box>
      </div>
    );
  }

  const activeSet = isMulti ? (isRevealed ? myAnswer : pendingMulti) : myAnswer;

  return (
    <div className="qz">
      <div className="qz-dots">
        {shuffledQuestions.map((_, i) => {
          let cls = "qz-dot";
          if (i === idx) cls += " is-current";
          else if (revealed[i]) cls += arrEqual(answers[i] || [], shuffledQuestions[i].correct) ? " is-ok" : " is-bad";
          return <button key={i} className={cls} onClick={() => goTo(i)} title={`Otázka ${i + 1}`} />;
        })}
      </div>

      <Box>
        <div className="qz-num">Otázka {idx + 1} / {shuffledQuestions.length}{isMulti ? " · více správných" : ""}</div>
        <div className="qz-q">{q.question}</div>

        <div className="qz-opts">
          {q.options.map((opt, i) => {
            let cls = "qz-opt";
            if (isRevealed) {
              if (q.correct.includes(i)) cls += " is-ok";
              else if (activeSet.includes(i)) cls += " is-bad";
            } else if (activeSet.includes(i)) cls += " is-sel";
            return (
              <div key={i} className={cls} onClick={() => isMulti ? toggleMulti(i) : handleSingleSelect(i)}>
                {isMulti && <span className="qz-cb">{activeSet.includes(i) ? "☑" : "☐"}</span>}
                <span>{opt}</span>
              </div>
            );
          })}
        </div>

        {isMulti && !isRevealed && (
          <button className="btn" onClick={submitMulti} disabled={pendingMulti.length === 0}>Potvrdit</button>
        )}

        {isRevealed && (
          <div className={"qz-fb " + (isCorrect ? "is-ok" : "is-bad")}>
            <div className="qz-fb-h">{isCorrect ? "Správně" : "Špatně"}</div>
            {!isCorrect && (
              <div className="qz-fb-c">Správná odpověď: {q.correct.map(i => q.options[i]).join(" · ")}</div>
            )}
            <div className="qz-fb-e">{q.explanation}</div>
            {q.tip && <div className="qz-fb-t">💡 {q.tip}</div>}
          </div>
        )}
      </Box>

      <div className="qz-nav">
        <button className="btn" onClick={() => goTo(idx - 1)} disabled={idx === 0}>← Předchozí</button>
        {idx < shuffledQuestions.length - 1
          ? <button className="btn" onClick={() => goTo(idx + 1)}>Další →</button>
          : <button className="btn btn-accent" onClick={() => setShowResults(true)}>Výsledky →</button>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SDÍLENÉ KOMPONENTY — téma "Laborka"
   ═══════════════════════════════════════════════════════════════════ */

/** Zkosený (chamfer) box: vnější vrstva dělá 1px rámeček, vnitřní výplň. */
function Box({ children, className = "", tone = "" }) {
  return (
    <div className={"chamfer " + (tone ? "chamfer--" + tone + " " : "") + className}>
      <div className="chamfer-in">{children}</div>
    </div>
  );
}

/** Signature prvku tématu: rovnice na vlastním tmavém pruhu přes celou šířku.
 *  Reaktanty smaragdově, produkty fialově, podmínky nad/pod šipkou. */
function Eq({ left, right, above, below, note, rev = false, hidden = false }) {
  const [shown, setShown] = useState(!hidden);
  return (
    <div className="eq">
      <div className="eq-row">
        <span className="eq-l">{left}</span>
        <span className="eq-arrow" aria-hidden="true">
          <span className="eq-cond">{above || "\u00a0"}</span>
          <span className="eq-line"><span className="eq-head">{rev ? "⇄" : "→"}</span></span>
          <span className="eq-cond">{below || "\u00a0"}</span>
        </span>
        {shown
          ? <span className="eq-r">{right}</span>
          : <button className="eq-hide" onClick={() => setShown(true)}>? odhalit pravou stranu</button>}
      </div>
      {note && shown && <div className="eq-note">{note}</div>}
    </div>
  );
}

/** Rozbalovací sekce. */
function Fold({ title, badge, children, open = false }) {
  const [isOpen, setIsOpen] = useState(open);
  return (
    <div className={"fold " + (isOpen ? "is-open" : "")}>
      <button className="fold-h" onClick={() => setIsOpen(o => !o)}>
        <span className="fold-t">{title}</span>
        {badge && <span className="fold-b">{badge}</span>}
        <span className="fold-x">{isOpen ? "−" : "+"}</span>
      </button>
      {isOpen && <div className="fold-c">{children}</div>}
    </div>
  );
}

/** Skryté řešení – nikdy se nezobrazuje inline. */
function Reveal({ label = "Zobrazit řešení", children }) {
  const [on, setOn] = useState(false);
  if (!on) return <button className="btn btn-reveal" onClick={() => setOn(true)}>🔒 {label}</button>;
  return (
    <div className="reveal">
      {children}
      <button className="btn btn-mini" onClick={() => setOn(false)}>Skrýt</button>
    </div>
  );
}

const DIF = {
  easy:   { label: "Lehké ✨",  cls: "d-easy" },
  medium: { label: "Střední ⚡", cls: "d-med" },
  hard:   { label: "Těžké 🔥",   cls: "d-hard" },
};

/** Řešený příklad: Zadání → (skryto) Co víme / Vztah / Postup / Výsledek. */
function Problem({ n, dif, title, zadani, given, vztah, kroky, vysledek, extra }) {
  const d = DIF[dif] || DIF.medium;
  return (
    <Box className="prob">
      <div className="prob-h">
        <span className="prob-n">{n}</span>
        <span className="prob-t">{title}</span>
        <span className={"prob-d " + d.cls}>{d.label}</span>
      </div>
      <div className="prob-z">{zadani}</div>
      {extra}
      <Reveal>
        <div className="sol">
          {given && (<><div className="sol-h">Co víme</div><div className="sol-b">{given}</div></>)}
          {vztah && (<><div className="sol-h">Který vztah / pravidlo použít</div><div className="sol-b">{vztah}</div></>)}
          {kroky && (<>
            <div className="sol-h">Postup krok za krokem</div>
            <ol className="sol-steps">{kroky.map((k, i) => <li key={i}>{k}</li>)}</ol>
          </>)}
          <div className="sol-res"><span className="sol-res-l">Výsledek</span><span className="sol-res-v">{vysledek}</span></div>
        </div>
      </Reveal>
    </Box>
  );
}

/** Kontrola číselné odpovědi. */
function NumCheck({ answer, tol = 0.02, unit = "", hint }) {
  const [val, setVal] = useState("");
  const [state, setState] = useState(null);
  const check = () => {
    const x = parseFloat(val.replace(",", ".").replace(/\s/g, ""));
    if (Number.isNaN(x)) { setState("empty"); return; }
    setState(Math.abs(x - answer) <= Math.abs(answer * tol) ? "ok" : "bad");
  };
  return (
    <div className="numchk">
      <label className="numchk-l">Zkus si spočítat výsledek:</label>
      <div className="numchk-row">
        <input className="numchk-i" value={val} inputMode="decimal"
               placeholder="např. 1234,5"
               onChange={e => { setVal(e.target.value); setState(null); }}
               onKeyDown={e => { if (e.key === "Enter") check(); }} />
        <span className="numchk-u">{unit}</span>
        <button className="btn btn-mini" onClick={check}>Zkontrolovat</button>
      </div>
      {state === "ok"    && <div className="numchk-fb is-ok">Sedí! {hint}</div>}
      {state === "bad"   && <div className="numchk-fb is-bad">Ještě ne. Zkus to znovu, nebo si otevři řešení.</div>}
      {state === "empty" && <div className="numchk-fb is-bad">Zadej číslo.</div>}
    </div>
  );
}

/** Kartičky s překlápěním. */
function Flashcards({ cards }) {
  const [i, setI] = useState(0);
  const [flip, setFlip] = useState(false);
  const [order, setOrder] = useState(() => cards.map((_, k) => k));
  const go = (k) => { setFlip(false); setI(k); };
  const card = cards[order[i]];
  return (
    <div className="fc-wrap">
      <div className="fc-meta">
        <span>{i + 1} / {cards.length}</span>
        <button className="btn btn-mini" onClick={() => { setOrder(shuffleArray(order)); go(0); }}>🔀 Zamíchat</button>
      </div>
      <div className={"fc " + (flip ? "is-flip" : "")} onClick={() => setFlip(f => !f)}>
        <div className="fc-in">
          <div className="fc-face fc-front">
            <span className="fc-tag">{card.tag}</span>
            <div className="fc-text">{card.front}</div>
            <span className="fc-hint">klikni pro otočení</span>
          </div>
          <div className="fc-face fc-back">
            <div className="fc-text">{card.back}</div>
          </div>
        </div>
      </div>
      <div className="fc-nav">
        <button className="btn" onClick={() => go((i - 1 + cards.length) % cards.length)}>← Předchozí</button>
        <button className="btn" onClick={() => go((i + 1) % cards.length)}>Další →</button>
      </div>
      <div className="fc-dots">
        {cards.map((_, k) => <button key={k} className={"fc-dot " + (k === i ? "is-on" : "")} onClick={() => go(k)} />)}
      </div>
    </div>
  );
}

/** Jednoduchá tabulka. */
function Tab({ head, rows, mono = false }) {
  return (
    <div className="tw">
      <table className={"tbl " + (mono ? "tbl--mono" : "")}>
        <thead><tr>{head.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
        <tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

const K = ({ children }) => <span className="k">{children}</span>;      // klíčový pojem
const M = ({ children }) => <span className="m">{children}</span>;      // vzorec / mono
const W = ({ children }) => <div className="warn">⚠️ {children}</div>;  // častá chyba

/* ═══════════════════════════════════════════════════════════════════
   STYL — téma "Laborka" (chemie)
   ═══════════════════════════════════════════════════════════════════ */
const HEX = "url(\"data:image/svg+xml,%3Csvg width='28' height='49' viewBox='0 0 28 49' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%232ee6a8' fill-rule='evenodd'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81V33.5zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'/%3E%3C/g%3E%3C/svg%3E\")";

const CSS = `
:root{
  --bg:#101318; --surf:#171b22; --surf2:#12161c; --line:#2a3340;
  --ink:#e7ecf2; --ink2:#a6b2c2; --ink3:#778393;
  --acc:#2ee6a8; --acc2:#b06cf0; --warn:#ffcc66; --bad:#ff6b6b; --ok:#2ee6a8;
  --chamf: polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px);
  --t: 0.45s cubic-bezier(.22,.8,.3,1);
}
*{box-sizing:border-box}
/* Template načítá Tailwind CDN, jehož Preflight ruší odrážky, čísla a odsazení seznamů. */
.root ul{list-style:disc; padding-left:20px; margin:10px 0}
.root ol{list-style:decimal; padding-left:22px; margin:10px 0}
.root li{margin:5px 0; padding-left:2px}
.root li::marker{color:var(--acc)}
.root p{margin:10px 0}
.root h3{margin:0}
.root{
  min-height:100vh; background:var(--bg); color:var(--ink);
  font-family:'Inter',system-ui,sans-serif; font-size:16px; line-height:1.65;
  position:relative;
}
.hexbg{position:fixed; inset:0; background-image:${HEX}; opacity:.06; pointer-events:none; z-index:0}
.glow{position:fixed; top:-160px; left:0; right:0; height:420px;
  background:radial-gradient(ellipse 380px 210px at 50% 50%, rgba(46,230,168,.16), transparent 68%); filter:blur(30px); pointer-events:none; z-index:0}

/* ── Hlavička ───────────────────────────────────────── */
.hdr{position:relative; z-index:1; border-bottom:1px solid var(--line); background:linear-gradient(180deg,rgba(46,230,168,.05),transparent)}
.hdr-in{max-width:1180px; margin:0 auto; padding:26px 20px 22px; display:flex; gap:20px; align-items:center; flex-wrap:wrap}
.tiles{display:flex; gap:10px}
.tile{width:74px; height:82px; background:var(--surf); border:1px solid var(--line); clip-path:var(--chamf);
  display:flex; flex-direction:column; justify-content:center; align-items:center; gap:1px; flex:none}
.tile b{font-family:'Space Grotesk',sans-serif; font-size:30px; line-height:1; font-weight:700}
.tile small{font-size:10px; color:var(--ink3); font-family:'JetBrains Mono',monospace; letter-spacing:.02em}
.tile .z{font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--ink3)}
.tile--s b{color:var(--warn)} .tile--cl b{color:var(--acc)}
.hdr-txt{flex:1 1 320px; min-width:0}
h1{font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:clamp(23px,4.2vw,34px); margin:0 0 6px; letter-spacing:-.01em}
h1 .sep{color:var(--acc)}
.sub{color:var(--ink2); font-size:15px; margin:0}
.sub b{color:var(--acc)}

/* ── Rozložení: boční lišta + obsah ─────────────────── */
.shell{position:relative; z-index:1; max-width:1180px; margin:0 auto; padding:24px 20px 80px; display:flex; gap:28px; align-items:flex-start}
.rail{width:228px; flex:none; position:sticky; top:16px; display:flex; flex-direction:column; gap:4px}
.rail-h{font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:.14em; text-transform:uppercase; color:var(--ink3); padding:0 12px 8px}
.nav{display:flex; align-items:center; gap:11px; min-height:46px; padding:10px 12px; cursor:pointer; width:100%;
  background:transparent; border:1px solid transparent; color:var(--ink2); font:inherit; font-size:14.5px; text-align:left;
  transition:all var(--t); clip-path:var(--chamf)}
.nav:hover{background:rgba(46,230,168,.07); color:var(--ink)}
.nav.is-on{background:rgba(46,230,168,.12); border-color:var(--acc); color:var(--ink); font-weight:600}
.nav-n{font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--acc); min-width:18px}
.main{flex:1; min-width:0; display:flex; flex-direction:column; gap:16px; animation:slidein .5s cubic-bezier(.22,.8,.3,1)}
@keyframes slidein{from{opacity:0; transform:translateY(12px)} to{opacity:1; transform:none}}
@media (prefers-reduced-motion: reduce){
  *,*::before,*::after{animation-duration:.01ms!important; animation-iteration-count:1!important; transition-duration:.01ms!important}
}

h2{font-family:'Space Grotesk',sans-serif; font-size:23px; font-weight:700; margin:6px 0 2px; letter-spacing:-.01em}
h2 .hash{color:var(--acc); font-family:'JetBrains Mono',monospace; font-size:16px; margin-right:8px}
.lead{color:var(--ink2); font-size:15px; margin:0 0 6px; max-width:70ch}

/* ── Zkosené boxy ───────────────────────────────────── */
.chamfer{background:var(--line); clip-path:var(--chamf); padding:1px; transition:all var(--t)}
.chamfer-in{background:var(--surf); clip-path:var(--chamf); padding:18px 20px}
.chamfer--acc{background:var(--acc)} .chamfer--acc .chamfer-in{background:linear-gradient(135deg,rgba(46,230,168,.10),rgba(46,230,168,.02)),var(--surf)}
.chamfer--v{background:var(--acc2)} .chamfer--v .chamfer-in{background:linear-gradient(135deg,rgba(176,108,240,.10),rgba(176,108,240,.02)),var(--surf)}
.chamfer--warn{background:var(--warn)} .chamfer--warn .chamfer-in{background:linear-gradient(135deg,rgba(255,204,102,.10),rgba(255,204,102,.02)),var(--surf)}
.chamfer p:first-child{margin-top:0} .chamfer p:last-child{margin-bottom:0}
.grid2{display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:14px; align-items:start}
.bx-h{font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:16px; margin:0 0 8px; color:var(--acc)}
.bx-h--v{color:var(--acc2)} .bx-h--w{color:var(--warn)}

/* ── Rovnice (signature) ────────────────────────────── */
.eq{background:#0a0d11; border-left:3px solid var(--acc); margin:14px 0; padding:12px 18px;
  font-family:'JetBrains Mono',monospace; font-size:15px; overflow-x:auto; overflow-y:hidden; scrollbar-width:thin}
.eq-row{display:flex; align-items:center; gap:14px; min-width:max-content}
.eq-l{color:var(--acc)} .eq-r{color:var(--acc2)}
.eq-arrow{display:inline-flex; flex-direction:column; align-items:center; justify-content:center; gap:3px; min-width:74px; padding:0 10px; flex:none}
.eq-line{display:block; height:2px; width:64px; background:linear-gradient(90deg,var(--acc),var(--acc2));
  position:relative; transform-origin:left; animation:draw .45s cubic-bezier(.22,.8,.3,1) both}
@keyframes draw{from{transform:scaleX(0)} to{transform:scaleX(1)}}
.eq-head{position:absolute; right:-9px; top:-12px; color:var(--acc2); font-size:17px; line-height:1}
.eq-cond{font-size:11px; color:var(--ink3); white-space:nowrap; line-height:1.3; text-align:center}
.eq-hide{background:rgba(176,108,240,.12); border:1px dashed var(--acc2); color:var(--acc2); font:inherit; font-size:13px;
  padding:6px 12px; cursor:pointer; transition:all var(--t); min-height:34px}
.eq-hide:hover{background:rgba(176,108,240,.24)}
.eq-note{margin-top:10px; font-family:'Inter',sans-serif; font-size:13.5px; color:var(--ink3); line-height:1.6}

/* ── Rozbalovací sekce ──────────────────────────────── */
.fold{background:var(--line); clip-path:var(--chamf); padding:1px; transition:all var(--t)}
.fold.is-open{background:linear-gradient(135deg,var(--acc),var(--line) 60%)}
.fold-h{width:100%; display:flex; align-items:center; gap:12px; background:var(--surf); border:0; color:var(--ink);
  font:inherit; font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:16.5px; text-align:left;
  padding:15px 18px; cursor:pointer; min-height:52px; clip-path:var(--chamf); transition:background var(--t)}
.fold-h:hover{background:#1c212a}
.fold.is-open .fold-h{clip-path:polygon(16px 0,100% 0,100% 100%,0 100%,0 16px)}
.fold-t{flex:1; min-width:0}
.fold-b{font-family:'JetBrains Mono',monospace; font-size:10.5px; letter-spacing:.06em; color:var(--acc);
  border:1px solid rgba(46,230,168,.4); padding:3px 8px; white-space:nowrap; flex:none}
.fold-x{font-family:'JetBrains Mono',monospace; color:var(--acc); font-size:20px; width:18px; text-align:center}
.fold-c{background:var(--surf2); padding:4px 18px 18px; clip-path:polygon(0 0,100% 0,100% calc(100% - 16px),calc(100% - 16px) 100%,0 100%)}
.fold-c ul,.fold-c ol{padding-left:20px; margin:10px 0}
.fold-c li{margin:5px 0}
.fold-c p{margin:10px 0}

/* ── Zvýraznění v textu ─────────────────────────────── */
.k{color:var(--acc); font-weight:600}
.m{font-family:'JetBrains Mono',monospace; font-size:.94em; color:var(--ink); background:rgba(255,255,255,.05); padding:1px 5px}
.warn{background:rgba(255,204,102,.08); border-left:3px solid var(--warn); padding:10px 14px; margin:12px 0; font-size:14.5px; color:#f3e2bd}

/* ── Tabulky ────────────────────────────────────────── */
.tw{overflow-x:auto; margin:12px 0}
.tbl{border-collapse:collapse; width:100%; min-width:460px; font-size:14.5px}
.tbl th{font-family:'Space Grotesk',sans-serif; text-align:left; padding:10px 12px; border-bottom:2px solid var(--acc);
  color:var(--ink); font-size:13.5px; white-space:nowrap}
.tbl td{padding:9px 12px; border-bottom:1px solid var(--line); color:var(--ink2); vertical-align:top}
.tbl tr:hover td{background:rgba(46,230,168,.04)}
.tbl--mono td:first-child,.tbl--mono td:nth-child(2){font-family:'JetBrains Mono',monospace; color:var(--ink)}

/* ── Tlačítka ───────────────────────────────────────── */
.btn{background:rgba(255,255,255,.05); border:1px solid var(--line); color:var(--ink); font:inherit; font-size:14.5px;
  padding:10px 18px; min-height:44px; cursor:pointer; transition:all var(--t); clip-path:polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px)}
.btn:hover:not(:disabled){background:rgba(46,230,168,.12); border-color:var(--acc)}
.btn:disabled{opacity:.35; cursor:not-allowed}
.btn-accent{background:rgba(46,230,168,.16); border-color:var(--acc); color:var(--acc); font-weight:600}
.btn-mini{padding:7px 12px; min-height:36px; font-size:13px}
.btn-reveal{margin-top:12px; border-style:dashed; border-color:var(--acc2); color:var(--acc2); background:rgba(176,108,240,.07)}
.btn-reveal:hover:not(:disabled){background:rgba(176,108,240,.18); border-color:var(--acc2)}

/* ── Řešené příklady ────────────────────────────────── */
.prob{margin:0}
.prob-h{display:flex; align-items:center; gap:10px; flex-wrap:wrap; margin-bottom:10px}
.prob-n{font-family:'JetBrains Mono',monospace; font-size:12px; color:#0d1117; background:var(--acc); padding:3px 8px; font-weight:700}
.prob-t{font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:16.5px; flex:1; min-width:180px}
.prob-d{font-size:11.5px; font-family:'JetBrains Mono',monospace; padding:3px 9px; border:1px solid; white-space:nowrap}
.d-easy{color:var(--acc); border-color:rgba(46,230,168,.45)}
.d-med{color:var(--warn); border-color:rgba(255,204,102,.45)}
.d-hard{color:var(--bad); border-color:rgba(255,107,107,.45)}
.prob-z{color:var(--ink2); font-size:15px}
.prob-z ul{padding-left:20px; margin:8px 0}
.reveal{margin-top:14px; animation:slidein .45s cubic-bezier(.22,.8,.3,1)}
.sol{background:var(--surf2); border-left:3px solid var(--acc2); padding:14px 16px}
.sol-h{font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:var(--acc2); margin:14px 0 6px}
.sol-h:first-child{margin-top:0}
.sol-b{color:var(--ink2); font-size:14.5px}
.sol-steps{padding-left:22px; margin:6px 0; color:var(--ink2); font-size:14.5px}
.sol-steps li{margin:8px 0; animation:slidein .45s cubic-bezier(.22,.8,.3,1) both}
.sol-steps li:nth-child(2){animation-delay:.08s} .sol-steps li:nth-child(3){animation-delay:.16s}
.sol-steps li:nth-child(4){animation-delay:.24s} .sol-steps li:nth-child(5){animation-delay:.32s}
.sol-steps li:nth-child(6){animation-delay:.4s}
.sol-res{margin-top:16px; display:flex; align-items:center; gap:12px; flex-wrap:wrap;
  background:rgba(46,230,168,.10); border:1px solid var(--acc); padding:12px 16px}
.sol-res-l{font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:var(--acc)}
.sol-res-v{font-family:'JetBrains Mono',monospace; font-size:16px; color:var(--ink); font-weight:600}

/* ── Kontrola výsledku ──────────────────────────────── */
.numchk{margin-top:14px; background:var(--surf2); border:1px dashed var(--line); padding:12px 14px}
.numchk-l{display:block; font-size:13px; color:var(--ink3); margin-bottom:8px}
.numchk-row{display:flex; gap:8px; align-items:center; flex-wrap:wrap}
.numchk-i{background:#0a0d11; border:1px solid var(--line); color:var(--ink); font-family:'JetBrains Mono',monospace;
  font-size:15px; padding:10px 12px; min-height:44px; width:170px; transition:border-color var(--t)}
.numchk-i:focus{outline:none; border-color:var(--acc)}
.numchk-u{font-family:'JetBrains Mono',monospace; color:var(--ink3); font-size:14px}
.numchk-fb{margin-top:10px; font-size:14px}
.numchk-fb.is-ok{color:var(--ok)} .numchk-fb.is-bad{color:var(--bad)}

/* ── Kartičky ───────────────────────────────────────── */
.fc-wrap{max-width:620px; margin:0 auto; width:100%}
.fc-meta{display:flex; justify-content:space-between; align-items:center; color:var(--ink3);
  font-family:'JetBrains Mono',monospace; font-size:13px; margin-bottom:12px}
.fc{perspective:1400px; cursor:pointer; margin-bottom:16px}
.fc-in{position:relative; width:100%; min-height:250px; transform-style:preserve-3d; transition:transform .4s cubic-bezier(.22,.8,.3,1)}
.fc.is-flip .fc-in{transform:rotateY(180deg)}
.fc-face{position:absolute; inset:0; backface-visibility:hidden; display:flex; flex-direction:column;
  align-items:center; justify-content:center; gap:14px; padding:28px 26px; text-align:center;
  border:1px solid var(--line); clip-path:var(--chamf)}
.fc-front{background:var(--surf)}
.fc-back{background:linear-gradient(135deg,rgba(176,108,240,.13),rgba(46,230,168,.05)),var(--surf); border-color:var(--acc2); transform:rotateY(180deg)}
.fc-tag{font-family:'JetBrains Mono',monospace; font-size:10.5px; letter-spacing:.12em; text-transform:uppercase; color:var(--acc)}
.fc-text{font-size:19px; line-height:1.55; font-family:'Space Grotesk',sans-serif; font-weight:600}
.fc-back .fc-text{font-size:16.5px; font-family:'Inter',sans-serif; font-weight:400; color:var(--ink)}
.fc-hint{font-size:12px; color:var(--ink3)}
.fc-nav{display:flex; justify-content:space-between; gap:10px}
.fc-dots{display:flex; gap:0; flex-wrap:wrap; justify-content:center; margin-top:8px}
.fc-dot{width:24px; height:24px; border:0; padding:7px; background:var(--line); background-clip:content-box; cursor:pointer; transition:all var(--t)}
.fc-dot.is-on{background:var(--acc); transform:scale(1.35)}

/* ── Vzorový test ───────────────────────────────────── */
.ti{margin:0}
.ti-h{display:flex; align-items:flex-start; gap:12px; flex-wrap:wrap}
.ti-n{font-family:'JetBrains Mono',monospace; font-size:13px; font-weight:700; color:var(--acc);
  border:1px solid rgba(46,230,168,.45); min-width:30px; height:30px; display:flex; align-items:center;
  justify-content:center; flex:none; transition:all var(--t)}
.ti-n.is-ok{background:var(--ok); border-color:var(--ok); color:#0d1117}
.ti-n.is-bad{background:var(--bad); border-color:var(--bad); color:#0d1117}
.ti-q{flex:1; min-width:200px; font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:16.5px; line-height:1.5}
.ti-tag{font-family:'JetBrains Mono',monospace; font-size:10.5px; letter-spacing:.06em; color:var(--acc2);
  border:1px solid rgba(176,108,240,.45); padding:3px 8px; white-space:nowrap; flex:none; align-self:center}
.ti-ans{margin-bottom:12px}
.ti-ans .eq{margin:10px 0}
.ti-score{position:sticky; top:8px; z-index:4}
.ti-score-row{display:flex; align-items:center; justify-content:space-between; gap:14px; flex-wrap:wrap}
.ti-bar{margin-top:12px; height:6px; background:rgba(255,255,255,.07)}
.ti-bar-fill{height:100%; background:linear-gradient(90deg,var(--acc),var(--acc2)); transition:width .8s cubic-bezier(.22,.8,.3,1)}

/* ── Kvíz ───────────────────────────────────────────── */
.qz{display:flex; flex-direction:column; gap:16px; max-width:700px; margin:0 auto; width:100%}
.qz-dots{display:flex; gap:7px; justify-content:center; flex-wrap:wrap}
.qz-dot{width:20px; height:20px; border:1px solid var(--line); background:#1b212a; padding:0; cursor:pointer;
  transition:all var(--t); clip-path:polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%)}
.qz-dot.is-current{background:var(--acc); border-color:var(--acc); transform:scale(1.25)}
.qz-dot.is-ok{background:var(--ok); border-color:var(--ok)}
.qz-dot.is-bad{background:var(--bad); border-color:var(--bad)}
.qz-num{font-family:'JetBrains Mono',monospace; font-size:12px; color:var(--ink3); margin-bottom:8px}
.qz-q{font-family:'Space Grotesk',sans-serif; font-size:18px; font-weight:600; line-height:1.5; margin-bottom:18px}
.qz-opts{display:flex; flex-direction:column; gap:9px}
.qz-opt{display:flex; align-items:center; gap:11px; padding:13px 16px; min-height:48px; cursor:pointer; user-select:none;
  background:rgba(255,255,255,.035); border:1px solid var(--line); font-size:15px; transition:all var(--t);
  clip-path:polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px)}
.qz-opt:hover{background:rgba(46,230,168,.07)}
.qz-opt.is-sel{background:rgba(46,230,168,.12); border-color:var(--acc)}
.qz-opt.is-ok{background:rgba(46,230,168,.15); border-color:var(--ok)}
.qz-opt.is-bad{background:rgba(255,107,107,.13); border-color:var(--bad)}
.qz-cb{font-size:17px; color:var(--ink2); min-width:19px}
.qz-fb{margin-top:18px; padding:15px 16px; background:var(--surf2); border-left:3px solid}
.qz-fb.is-ok{border-color:var(--ok)} .qz-fb.is-bad{border-color:var(--bad)}
.qz-fb-h{font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:16px; margin-bottom:8px}
.qz-fb.is-ok .qz-fb-h{color:var(--ok)} .qz-fb.is-bad .qz-fb-h{color:var(--bad)}
.qz-fb-c{color:var(--acc); font-size:14px; margin-bottom:6px; font-family:'JetBrains Mono',monospace}
.qz-fb-e{color:var(--ink2); font-size:14.5px; line-height:1.6}
.qz-fb-t{color:var(--warn); font-size:13.5px; margin-top:10px; font-style:italic}
.qz-nav{display:flex; justify-content:space-between; gap:10px}
.qz-results{display:flex; justify-content:center; padding:24px 0}
.qz-results .chamfer{max-width:420px; width:100%}
.qz-results .chamfer-in{text-align:center; padding:38px 32px}
.qz-score{font-family:'Space Grotesk',sans-serif; font-size:50px; font-weight:700; line-height:1.1; color:var(--acc)}
.qz-pct{font-family:'JetBrains Mono',monospace; font-size:20px; color:var(--ink3); margin-bottom:16px}
.qz-msg{color:var(--ink2); font-size:16px; margin-bottom:24px}

/* ── Mobil ──────────────────────────────────────────── */
@media (max-width:900px){
  .shell{flex-direction:column; align-items:stretch; gap:18px; padding:18px 14px 70px}
  .rail{width:auto; min-width:0; max-width:100%; flex-direction:row; overflow-x:auto; gap:6px; top:0; padding:10px 0;
    background:var(--bg); border-bottom:1px solid var(--line); z-index:5; -webkit-overflow-scrolling:touch}
  .rail-h{display:none}
  .nav{white-space:nowrap; flex:none; min-height:44px}
  .hdr-in{padding:20px 14px 18px}
  .tile{width:62px; height:70px} .tile b{font-size:25px}
  .fc-in{min-height:280px}
  .fold-b{display:none}
  .ti-score{position:static}
  .ti-tag{display:none}
}
@media (max-width:420px){ .tiles{display:none} }
`;

/* ═══════════════════════════════════════════════════════════════════
   DATA — kvíz
   ═══════════════════════════════════════════════════════════════════ */
const QUESTIONS = [
  {
    question: "Co znamená název „chalkogeny“ a odkud pochází?",
    type: "single",
    options: [
      "Rudotvorné – z řec. chalkos = ruda, gennao = tvořím",
      "Solitvorné – z řec. hals = sůl, gennao = tvořím",
      "Kyselinotvorné – z řec. chalkos = kyselina",
      "Vodotvorné – z řec. chalkos = voda",
    ],
    correct: [0],
    explanation: "Chalkogeny = prvky VI.A skupiny (O, S, Se, Te, Po). Chalkos = ruda, gennao = tvořím → „rudotvorné“, protože tvoří rudy (sulfidy, oxidy). Solitvorné jsou halogeny (hals = sůl).",
    tip: "CHALkos = ruda → CHALkogeny. HALs = sůl → HALogeny. Liší se jedním písmenem.",
  },
  {
    question: "Jaká je valenční elektronová konfigurace chalkogenů a halogenů?",
    type: "single",
    options: [
      "chalkogeny ns² np⁴ · halogeny ns² np⁵",
      "chalkogeny ns² np⁵ · halogeny ns² np⁴",
      "chalkogeny ns² np⁶ · halogeny ns² np⁵",
      "chalkogeny ns¹ np⁴ · halogeny ns¹ np⁵",
    ],
    correct: [0],
    explanation: "VI.A má 6 valenčních elektronů → ns² np⁴ (do oktetu chybí 2). VII.A má 7 valenčních elektronů → ns² np⁵ (do oktetu chybí 1).",
    tip: "Číslo skupiny A = počet valenčních elektronů. VI.A → 6 = 2+4, VII.A → 7 = 2+5.",
  },
  {
    question: "₁₆S má v základním stavu konfiguraci [Ne] 3s² 3p⁴. Jakou má vaznost?",
    type: "single",
    options: ["II", "IV", "VI", "0"],
    correct: [0],
    explanation: "V 3p⁴ jsou dva elektrony spárované a dva nespárované. Dva nespárované elektrony = vaznost II. Příklady: H₂S, Na₂S, ZnS.",
    tip: "Počet nespárovaných elektronů = vaznost.",
  },
  {
    question: "Proč může být síra čtyř- a šestivazná, zatímco kyslík ne?",
    type: "single",
    options: [
      "Síra má ve 3. periodě volné d-orbitaly, do kterých může excitovat elektrony; kyslík ve 2. periodě žádné d-orbitaly nemá",
      "Síra má větší atomový poloměr, takže se k ní vejde více atomů",
      "Síra je méně elektronegativní, takže snadněji tvoří vazby",
      "Kyslík je plyn, a plyny nemohou tvořit více než dvě vazby",
    ],
    correct: [0],
    explanation: "Excitace 3s²3p⁴ → 3s²3p³3d¹ dá 4 nespárované elektrony (vaznost IV, např. SO₂), další excitace 3s¹3p³3d² dá 6 nespárovaných (vaznost VI, např. H₂SO₄, SO₃). Kyslík je ve 2. periodě, kde orbitaly d neexistují, proto je maximálně dvojvazný.",
    tip: "Bez d-orbitalů není excitace. Proto neexistuje „H₂OO₄“.",
  },
  {
    question: "Označ všechny minerály, ve kterých je síra vázána jako SULFID nebo DISULFID:",
    type: "multi",
    options: ["pyrit FeS₂", "galenit PbS", "sfalerit ZnS", "baryt BaSO₄", "sádrovec CaSO₄·2 H₂O"],
    correct: [0, 1, 2],
    explanation: "Pyrit FeS₂ = disulfid železnatý, galenit PbS = sulfid olovnatý, sfalerit ZnS = sulfid zinečnatý. Baryt a sádrovec jsou SÍRANY (síra v oxidačním čísle VI), ne sulfidy.",
    tip: "Je v tom kyslík? Pak je to síran, ne sulfid.",
  },
  {
    question: "Který vzorec patří Glauberově soli?",
    type: "single",
    options: ["Na₂SO₄ · 10 H₂O", "FeSO₄ · 7 H₂O", "CuSO₄ · 5 H₂O", "CaSO₄ · 2 H₂O"],
    correct: [0],
    explanation: "Glauberova sůl = dekahydrát síranu sodného Na₂SO₄·10 H₂O. FeSO₄·7 H₂O je zelená skalice, CuSO₄·5 H₂O modrá skalice, CaSO₄·2 H₂O sádrovec.",
    tip: "GLAUBER → sodná sůl. Skalice = Fe (zelená) nebo Cu (modrá).",
  },
  {
    question: "Proč není molekula S₈ rovinná (atomy jsou střídavě nad a pod rovinou kruhu)?",
    type: "single",
    options: [
      "Každý atom síry nese dva volné elektronové páry, které se odpuzují a zmenšují vazebný úhel",
      "Molekula je příliš velká, a proto se prohýbá vlastní vahou",
      "Atomy síry mají různá oxidační čísla",
      "Mezi atomy síry působí vodíkové můstky",
    ],
    correct: [0],
    explanation: "Síra je v S₈ dvojvazná, takže jí zbývají 2 volné elektronové páry. Ty se navzájem odpuzují silněji než vazebné páry, stlačují vazebný úhel na cca 108° a nutí kruh zvlnit se do tvaru „koruny“.",
    tip: "Volné páry = důvod každého nerovinného / lomeného tvaru. Stejný princip jako u H₂O a H₂S.",
  },
  {
    question: "Co se děje se sírou při zahřívání nad 160 °C?",
    type: "single",
    options: [
      "Hnědne a roste její viskozita – kruhy S₈ se otevírají a vznikají dlouhé řetězce",
      "Okamžitě sublimuje na sirný květ",
      "Viskozita prudce klesá, protože se řetězce zkracují",
      "Mění se z jednoklonné na kosočtverečnou",
    ],
    correct: [0],
    explanation: "Nad 160 °C se cyklické molekuly S₈ otevírají a spojují do řetězců až o 200 000 atomech → tavenina hnědne a houstne. Teprve při dalším zahřívání se řetězce zase trhají a viskozita klesá.",
    tip: "Pořadí teplot: 96 °C změna modifikace → 119 °C tání → 160 °C houstnutí.",
  },
  {
    question: "Jaké soli lze odvodit od kyseliny sulfanové (sirovodíkové) H₂S?",
    type: "multi",
    options: ["sulfidy (S²⁻)", "hydrogensulfidy (HS⁻)", "sírany (SO₄²⁻)", "siřičitany (SO₃²⁻)"],
    correct: [0, 1],
    explanation: "H₂S je dvojsytná kyselina, takže odštěpí buď jeden vodík (→ HS⁻ hydrogensulfid) nebo oba (→ S²⁻ sulfid). Sírany a siřičitany pocházejí z H₂SO₄ a H₂SO₃.",
    tip: "Dvojsytná kyselina = dvě řady solí: normální a hydrogen-.",
  },
  {
    question: "Proč je sulfan H₂S za normálních podmínek plynný, zatímco voda H₂O je kapalná?",
    type: "single",
    options: [
      "Mezi molekulami H₂S nevznikají vodíkové můstky, protože síra má příliš nízkou elektronegativitu",
      "H₂S má menší molární hmotnost než H₂O",
      "H₂S má lineární molekulu, H₂O lomenou",
      "Síra je nekov, zatímco kyslík je polokov",
    ],
    correct: [0],
    explanation: "Vodíkový můstek vzniká jen u vodíku vázaného na silně elektronegativní prvek (F, O, N). Síra je málo elektronegativní, takže mezi molekulami H₂S působí jen slabé van der Waalsovy síly → nízká teplota varu (−60 °C). U vody drží molekuly pohromadě vodíkové můstky.",
    tip: "Pozor na past: H₂S je TĚŽŠÍ než H₂O (34 vs. 18), a přesto plynný. Rozhoduje typ mezimolekulové síly, ne hmotnost.",
  },
  {
    question: "Jakou má sulfan molekulu a čemu se podobá?",
    type: "single",
    options: [
      "Lomenou – podobá se molekule vody",
      "Lineární – podobá se molekule CO₂",
      "Trojúhelníkovou rovinnou – podobá se BF₃",
      "Tetraedrickou – podobá se CH₄",
    ],
    correct: [0],
    explanation: "Síra je dvojvazná a nese dva volné elektronové páry, takže molekula je lomená (úhel cca 92°) – stejný tvar jako voda, jen s menším úhlem.",
  },
  {
    question: "V reakcích 2 H₂S + O₂ → 2 S + 2 H₂O a 2 H₂S + 3 O₂ → 2 SO₂ + 2 H₂O je sulfan:",
    type: "single",
    options: [
      "vždy redukčním činidlem – síra má −II, tedy nejnižší možné oxidační číslo, a může se jen oxidovat",
      "vždy oxidačním činidlem – odebírá kyslíku elektrony",
      "v první reakci oxidačním a ve druhé redukčním činidlem",
      "ani jedním – jde o reakce bez změny oxidačních čísel",
    ],
    correct: [0],
    explanation: "Síra v H₂S má oxidační číslo −II, což je pro ni minimum. Odtud může jít jen nahoru (na 0 nebo na IV), tedy se oxiduje – a látka, která se oxiduje, je redukční činidlo.",
    tip: "Nejnižší oxidační číslo = jen redukční činidlo. Nejvyšší = jen oxidační činidlo.",
  },
  {
    question: "Která z těchto reakcí odpovídá hoření sulfanu při NÍZKÉM přístupu vzduchu?",
    type: "single",
    options: [
      "2 H₂S + O₂ → 2 S + 2 H₂O",
      "2 H₂S + 3 O₂ → 2 SO₂ + 2 H₂O",
      "H₂S + 2 O₂ → H₂SO₄",
      "2 H₂S + 4 O₂ → 2 SO₃ + 2 H₂O",
    ],
    correct: [0],
    explanation: "Málo kyslíku → síra se oxiduje jen částečně, z −II na 0, a vylučuje se elementární síra. Při dostatku kyslíku se oxiduje dál až na SO₂ (oxidační číslo IV).",
    tip: "Méně kyslíku = menší oxidace = nižší oxidační číslo produktu.",
  },
  {
    question: "Jakou barvu má oxid siřičitý SO₂?",
    type: "single",
    options: ["Je bezbarvý", "Žlutozelený", "Červenohnědý", "Fialový"],
    correct: [0],
    explanation: "SO₂ je BEZBARVÝ štiplavý jedovatý plyn, těžší než vzduch. Žlutozelený je chlor, červenohnědý brom, fialový jod. Tohle je klasická chytačka z pracovního listu.",
    tip: "Barevné jsou halogeny, ne oxidy síry.",
  },
  {
    question: "Označ všechna pravdivá tvrzení o oxidu siřičitém:",
    type: "multi",
    options: [
      "Má bělicí a dezinfekční účinky – využívají ho včelaři a vinaři (sirný knot)",
      "Vzniká hořením síry na vzduchu a pražením pyritu",
      "Je příčinou vzniku kyselých dešťů a má negativní dopad na životní prostředí",
      "Nepodporuje hoření a je těžší než vzduch",
      "Do atmosféry se dostává spalováním hnědého uhlí",
      "Vzniká hořením síry v atmosféře dusíku",
    ],
    correct: [0, 1, 2, 3, 4],
    explanation: "Vše kromě poslední možnosti. Síra hoří v KYSLÍKU, ne v dusíku – s dusíkem přímo nereaguje. Také pozor: dopad SO₂ na životní prostředí je jednoznačně NEGATIVNÍ (kyselé deště ničí jehličnaté lesy, způsobují korozi).",
    tip: "Tohle je přesně cvičení „Opravte text“ z pracovního listu – pamatuj si trojici oprav: bezbarvý, kyslík, negativní, kyselé deště.",
  },
  {
    question: "Ve které rovnici vykazuje SO₂ OXIDAČNÍ účinky?",
    type: "single",
    options: [
      "SO₂ + 2 H₂S → 3 S + 2 H₂O",
      "2 SO₂ + O₂ → 2 SO₃",
      "SO₂ + H₂O → H₂SO₃",
      "Na₂SO₃ + H₂SO₄ → Na₂SO₄ + SO₂ + H₂O",
    ],
    correct: [0],
    explanation: "V reakci se sulfanem klesá oxidační číslo síry v SO₂ ze IV na 0 – SO₂ se tedy redukuje, a proto je oxidačním činidlem. Naopak s kyslíkem roste IV → VI, tam je SO₂ redukčním činidlem. Zbylé dvě reakce nejsou redoxní.",
    tip: "Oxidační činidlo se samo REDUKUJE (jeho oxidační číslo klesá).",
  },
  {
    question: "Čím se katalyzuje reakce 2 SO₂ + O₂ ⇄ 2 SO₃ při výrobě kyseliny sírové?",
    type: "single",
    options: ["V₂O₅", "MnO₂", "Pt na uhlí za vysokého tlaku vodíku", "Fe₃O₄"],
    correct: [0],
    explanation: "Kontaktní způsob výroby H₂SO₄ používá jako katalyzátor oxid vanadičný V₂O₅. MnO₂ se používá při přípravě chloru z HCl, Fe₃O₄ při syntéze amoniaku.",
    tip: "Vanad → Výroba H₂SO₄.",
  },
  {
    question: "Co je to oleum?",
    type: "single",
    options: [
      "Roztok SO₃ v koncentrované kyselině sírové (dýmavá kyselina sírová)",
      "Olejovitá směs síry a kyseliny siřičité",
      "Kyselina sírová zředěná vodou v poměru 1 : 1",
      "Průmyslový název pro thiosíran sodný",
    ],
    correct: [0],
    explanation: "SO₃ reaguje s vodou tak bouřlivě, že se místo toho rozpouští v koncentrované H₂SO₄ za vzniku olea (H₂S₂O₇, dýmavá kyselina sírová). Teprve to se pak opatrně ředí na kyselinu sírovou.",
  },
  {
    question: "Porovnej sílu kyseliny sírové a siřičité:",
    type: "single",
    options: [
      "H₂SO₄ je silnější – síra má vyšší oxidační číslo (VI) a více atomů kyslíku odtahuje elektrony od vazby O–H",
      "H₂SO₃ je silnější, protože je nestálá",
      "Jsou stejně silné, obě jsou dvojsytné",
      "H₂SO₃ je silnější, protože má nižší molární hmotnost",
    ],
    correct: [0],
    explanation: "Čím vyšší oxidační číslo centrálního atomu a čím víc kyslíků, tím silněji je vazba O–H polarizovaná a tím snáz se odštěpí H⁺. H₂SO₄ je silná kyselina, H₂SO₃ slabá a navíc nestálá (rozkládá se zpět na SO₂ a H₂O).",
    tip: "Stejné pravidlo funguje i u chloru: HClO < HClO₂ < HClO₃ < HClO₄.",
  },
  {
    question: "Které anionty tvoří kyselina sírová?",
    type: "multi",
    options: ["síranový SO₄²⁻", "hydrogensíranový HSO₄⁻", "siřičitanový SO₃²⁻", "thiosíranový S₂O₃²⁻"],
    correct: [0, 1],
    explanation: "H₂SO₄ je dvojsytná: odštěpením jednoho H⁺ vznikne HSO₄⁻ (hydrogensíranový), odštěpením obou SO₄²⁻ (síranový). Siřičitan patří k H₂SO₃, thiosíran ke kyselině thiosírové H₂S₂O₃.",
  },
  {
    question: "Jak reaguje měď s kyselinou sírovou?",
    type: "single",
    options: [
      "Se zředěnou nereaguje, s koncentrovanou ano: Cu + 2 H₂SO₄ → CuSO₄ + SO₂ + 2 H₂O",
      "S oběma reaguje za vývoje vodíku",
      "S oběma reaguje stejně, jen s koncentrovanou rychleji",
      "Nereaguje s žádnou, rozpouští se pouze v lučavce královské",
    ],
    correct: [0],
    explanation: "Měď stojí v Beketovově řadě až za vodíkem (je ušlechtilá), takže z kyseliny nevytěsní H₂ – zředěná H₂SO₄ na ni nepůsobí. Koncentrovaná H₂SO₄ ale má oxidační účinky (sama se redukuje na SO₂) a některé ušlechtilé kovy (Cu, Ag, Hg) rozpouští.",
    tip: "Zředěná = jen neušlechtilé kovy + H₂. Koncentrovaná = oxidační činidlo + SO₂. Pouze v lučavce královské se rozpouští zlato.",
  },
  {
    question: "Co se stane, když nalijeme koncentrovanou H₂SO₄ na železo nebo olovo?",
    type: "single",
    options: [
      "Nastane pasivace – vytvoří se ochranná vrstvička a reakce se zastaví, proto lze kyselinu převážet v ocelových cisternách",
      "Kov se okamžitě rozpustí za bouřlivého vývoje vodíku",
      "Kov se rozpustí a vznikne sulfan",
      "Nestane se vůbec nic, protože Fe i Pb jsou ušlechtilé kovy",
    ],
    correct: [0],
    explanation: "Koncentrovaná kyselina sírová vytvoří na povrchu Fe a Pb souvislou nerozpustnou vrstvu, která kov chrání před dalším působením – tomu se říká pasivace. Díky ní se kyselina přepravuje v ocelových cisternách. Zředěná H₂SO₄ ale železo normálně rozpouští: Fe + H₂SO₄ → FeSO₄ + H₂.",
    tip: "Pasivace = kov „se sám zabalí“. Pozor, u železa platí jen pro KONCENTROVANOU kyselinu.",
  },
  {
    question: "Přiřaď správně vzorce oxokyselin síry. Které dvojice sedí?",
    type: "multi",
    options: [
      "kyselina thiosírová – H₂S₂O₃",
      "kyselina disírová – H₂S₂O₇",
      "kyselina peroxodisírová – H₂S₂O₈",
      "kyselina disiřičitá – H₂S₂O₅",
      "kyselina peroxosírová – H₂SO₃",
    ],
    correct: [0, 1, 2, 3],
    explanation: "Peroxosírová je H₂SO₅ (v H₂SO₄ je jedno −O− nahrazeno peroxoskupinou −O−O−). H₂SO₃ je obyčejná kyselina siřičitá.",
    tip: "thio- = O nahrazeno S · peroxo- = −O− nahrazeno −O−O− · di- = dvě jádra spojená přes kyslík.",
  },
  {
    question: "Co znamená název „halogeny“ a které prvky sem patří?",
    type: "single",
    options: [
      "Solitvorné (hals = sůl, gennao = tvořím); F, Cl, Br, I, At – VII.A skupina",
      "Rudotvorné (hals = ruda); O, S, Se, Te – VI.A skupina",
      "Vzácné plyny; He, Ne, Ar, Kr – VIII.A skupina",
      "Kovy alkalických zemin; Be, Mg, Ca, Sr – II.A skupina",
    ],
    correct: [0],
    explanation: "Halogeny jsou prvky VII.A skupiny. S kovy tvoří soli (halogenidy), odtud „solitvorné“.",
  },
  {
    question: "Přiřaď skupenství a barvu halogenů za normálních podmínek. Která tvrzení jsou správná?",
    type: "multi",
    options: [
      "F₂ – nazelenalý plyn",
      "Cl₂ – žlutozelený plyn",
      "Br₂ – červenohnědá kapalina",
      "I₂ – fialová pevná látka, sublimuje",
      "I₂ – bezbarvý plyn",
    ],
    correct: [0, 1, 2, 3],
    explanation: "Se vzrůstajícím protonovým číslem sílí mezimolekulové síly, proto se skupenství mění plyn → plyn → kapalina → pevná látka a barva se prohlubuje. Jod jako jediný sublimuje (fialové páry).",
    tip: "F a Cl plyny, Br kapalina, I pevný. Barvy: nazelenalá → žlutozelená → červenohnědá → fialová.",
  },
  {
    question: "Jak se mění oxidační účinky halogenů se vzrůstajícím protonovým číslem?",
    type: "single",
    options: [
      "Klesají: F₂ > Cl₂ > Br₂ > I₂",
      "Rostou: F₂ < Cl₂ < Br₂ < I₂",
      "Nejprve rostou a pak klesají, maximum má Br₂",
      "Nemění se, všechny halogeny jsou stejně silná oxidační činidla",
    ],
    correct: [0],
    explanation: "S rostoucím Z roste atomový poloměr, klesá elektronegativita a klesá schopnost přijmout elektron – tedy oxidační účinky klesají. Fluor je nejsilnější oxidační činidlo ze všech prvků.",
    tip: "Důsledek: silnější halogen vytěsní slabší z jeho halogenidu (Cl₂ + 2 KBr → 2 KCl + Br₂).",
  },
  {
    question: "Proč nelze fluor připravit oxidací fluoridů nebo fluorovodíku?",
    type: "single",
    options: [
      "Fluor je nejsilnější oxidační činidlo, takže neexistuje látka, která by dokázala zoxidovat F⁻ – získává se jen elektrolýzou",
      "Fluor je příliš těkavý a okamžitě by unikl",
      "Fluoridy jsou nerozpustné ve vodě, takže reakce neproběhne",
      "Fluor v přírodě neexistuje, takže ho nelze připravit vůbec",
    ],
    correct: [0],
    explanation: "Oxidace X⁻ na X₂ vyžaduje činidlo silnější, než je daný halogen. Pro fluor takové činidlo neexistuje, proto se F₂ vyrábí výhradně elektrolýzou taveniny (KHF₂ v bezvodém HF). Naopak chlor se běžně připravuje oxidací: MnO₂ + 4 HCl → MnCl₂ + Cl₂ + 2 H₂O.",
    tip: "Tuhle otázku měla paní profesorka v prezentaci s třemi otazníky – bude v testu.",
  },
  {
    question: "Proč se elementární halogeny (X₂) v přírodě nevyskytují?",
    type: "single",
    options: [
      "Jsou extrémně reaktivní, takže okamžitě zreagují na halogenidy",
      "Jsou příliš lehké a unikly by do vesmíru",
      "Rozkládají se působením slunečního záření na kyslík",
      "Jsou rozpustné ve vodě, a proto zůstávají jen v moři",
    ],
    correct: [0],
    explanation: "Halogenům chybí do oktetu jediný elektron, proto ho velmi ochotně přijímají. V přírodě je tedy najdeme pouze vázané: jako halogenidové anionty X⁻ (nejhojnější zdroj je mořská voda) nebo v minerálech (halit NaCl, fluorit CaF₂, kryolit Na₃AlF₆).",
  },
  {
    question: "Jak roste síla halogenovodíkových kyselin?",
    type: "single",
    options: [
      "HF < HCl < HBr < HI",
      "HI < HBr < HCl < HF",
      "HCl < HF < HBr < HI",
      "Všechny jsou stejně silné",
    ],
    correct: [0],
    explanation: "Směrem dolů se vazba H–X prodlužuje a slábne, takže se vodík odštěpuje snáz. HF je jako jediná SLABÁ kyselina – mimo jiné proto, že mezi jejími molekulami působí vodíkové můstky.",
    tip: "Pozor na past: fluor je nejelektronegativnější, ale HF je nejSLABŠÍ kyselina. Rozhoduje pevnost vazby H–X.",
  },
  {
    question: "Čím je významný fluorovodík HF?",
    type: "single",
    options: [
      "Leptá sklo: SiO₂ + 4 HF → SiF₄ + 2 H₂O, proto se uchovává v plastu",
      "Je hlavní složkou žaludeční šťávy",
      "Používá se k bělení a dezinfekci sudů",
      "Je to jediný halogenovodík nerozpustný ve vodě",
    ],
    correct: [0],
    explanation: "HF jako jediná běžná kyselina reaguje s oxidem křemičitým, tedy se sklem – proto se skladuje v plastových (PE) nádobách a používá se k leptání skla. Žaludeční šťáva obsahuje HCl (0,3–0,4 %, pH 1–3).",
  },
  {
    question: "K čemu slouží kyselina chlorovodíková v žaludku?",
    type: "multi",
    options: [
      "Aktivuje pepsin",
      "Denaturuje bílkoviny",
      "Ničí mikroorganismy z potravy",
      "Rozkládá sacharidy na glukózu",
    ],
    correct: [0, 1, 2],
    explanation: "HCl je v žaludeční šťávě v koncentraci 0,3–0,4 % (pH 1–3). Aktivuje proenzym pepsinogen na pepsin, denaturuje bílkoviny (rozbalí je, aby je enzym mohl štěpit) a zabíjí mikroorganismy. Sacharidy štěpí amylázy, ne HCl.",
  },
  {
    question: "Který typ halogenidů má vysoké teploty tání a varu a jehož taveniny a vodné roztoky vedou elektrický proud?",
    type: "single",
    options: [
      "Iontové (např. NaCl, KBr, CaF₂)",
      "Kovalentní molekulové (např. CCl₄, SF₆)",
      "Polymerní (např. PdCl₂)",
      "Interhalogeny (např. BrF₃)",
    ],
    correct: [0],
    explanation: "Iontové halogenidy vznikají s kovy I.A a II.A. Tvoří iontové krystaly držené silnou elektrostatickou přitažlivostí → vysoké t.t. a t.v. Po roztavení nebo rozpuštění se uvolní pohyblivé ionty, proto jsou vodivé. Kovalentní halogenidy jsou molekulové, těkavé a s vodou většinou nereagují.",
  },
  {
    question: "Jak dokážeme přítomnost halogenidových aniontů v roztoku?",
    type: "single",
    options: [
      "Dusičnanem stříbrným – AgCl je bílá, AgBr nažloutlá a AgI žlutá sraženina",
      "Chloridem barnatým – vznikne bílá sraženina BaCl₂",
      "Kyselinou sírovou – vznikne bezbarvý plyn",
      "Hydroxidem sodným – roztok zmodrá",
    ],
    correct: [0],
    explanation: "AgNO₃ + NaCl → AgCl↓ + NaNO₃. Halogenidy stříbra (kromě AgF) jsou nerozpustné a liší se barvou, takže podle odstínu sraženiny poznáme, o který halogenid jde. BaCl₂ naopak slouží k důkazu SÍRANŮ (vzniká bílý BaSO₄).",
    tip: "Ag⁺ dokazuje halogenidy, Ba²⁺ dokazuje sírany.",
  },
  {
    question: "Co jsou interhalogeny?",
    type: "single",
    options: [
      "Sloučeniny dvou různých halogenů, např. ClF, BrF₃, IF₅, IF₇",
      "Sloučeniny halogenu s vodíkem",
      "Sloučeniny halogenu s kyslíkem",
      "Směsi dvou halogenidů v jednom krystalu",
    ],
    correct: [0],
    explanation: "V interhalogenu typu XYₙ je centrálním atomem těžší (méně elektronegativní) halogen s kladným oxidačním číslem, ligandem lehčí halogen se záporným. Jsou velmi reaktivní, působí jako silná oxidační a fluorační činidla a s vodou hydrolyzují.",
  },
  {
    question: "Seřaď oxokyseliny chloru podle rostoucí síly:",
    type: "single",
    options: [
      "HClO < HClO₂ < HClO₃ < HClO₄",
      "HClO₄ < HClO₃ < HClO₂ < HClO",
      "HClO₂ < HClO < HClO₄ < HClO₃",
      "Všechny jsou stejně silné",
    ],
    correct: [0],
    explanation: "S rostoucím oxidačním číslem chloru (I → III → V → VII) přibývají atomy kyslíku, které odtahují elektronovou hustotu od vazby O–H, takže se H⁺ odštěpuje snáz. HClO₄ (chloristá) je jedna z nejsilnějších známých kyselin, HClO (chlorná) je slabá.",
    tip: "Více kyslíků = silnější kyselina. Zároveň ale oxidační účinky klesají a stálost roste.",
  },
  {
    question: "Co vzniká rozpouštěním chloru ve vodě (chlorová voda) a proč se používá?",
    type: "single",
    options: [
      "Cl₂ + H₂O ⇄ HCl + HClO – vzniklá kyselina chlorná má dezinfekční a bělicí účinky",
      "Cl₂ + H₂O → 2 HCl + ½ O₂ – vzniklý kyslík ničí bakterie",
      "Cl₂ + H₂O → HClO₄ + H₂ – kyselina chloristá dezinfikuje vodu",
      "Chlor se ve vodě nerozpouští",
    ],
    correct: [0],
    explanation: "Jde o disproporcionaci: z chloru s oxidačním číslem 0 vznikne zároveň Cl⁻I (v HCl) a Cl^I (v HClO). Kyselina chlorná se snadno rozkládá a uvolňuje atomární kyslík, který oxiduje a tím dezinfikuje a bělí. Proto se chloruje pitná voda a bazény.",
    tip: "Sodná sůl kyseliny chlorné NaClO je známé SAVO.",
  },
  {
    question: "Jaký typ krystalu tvoří jod v pevném skupenství?",
    type: "single",
    options: [
      "Molekulový — v mřížce jsou celé molekuly I₂ držené slabými van der Waalsovými silami",
      "Atomový (kovalentní) — atomy jodu jsou propojené pevnými vazbami jako v diamantu",
      "Iontový — mřížku tvoří ionty I⁺ a I⁻",
      "Kovový — jod má kovový lesk, proto i kovovou mřížku",
    ],
    correct: [0],
    explanation: "Jde o molekulový krystal. Slabé van der Waalsovy síly mezi molekulami I₂ se snadno překonají, proto má jod nízkou teplotu tání a přímo SUBLIMUJE na fialové páry. Atomový krystal (diamant) má naopak extrémně vysokou teplotu tání.",
    tip: "Slabé mezimolekulové síly → sublimace. Kdyby to byl atomový krystal, jod by se nedal zahřát ani v kahanu.",
  },
  {
    question: "Jodová tinktura je:",
    type: "single",
    options: ["5% roztok jodu v ethanolu", "5% roztok jodu ve vodě", "2% roztok jodu ve vodě", "5% roztok jodidu draselného ve vodě"],
    correct: [0],
    explanation: "Jod je nepolární látka, a ta se ve vodě prakticky nerozpouští — rozpustí se ale v ethanolu nebo v sirouhlíku CS₂. Jodová tinktura je proto 5% roztok jodu v lihu (s přídavkem KI, který rozpustnost dál zvyšuje).",
    tip: "Podobné se rozpouští v podobném. Nepolární jod → líh, ne voda.",
  },
  {
    question: "Chlorové vápno je směs:",
    type: "single",
    options: [
      "chloridu a chlornanu vápenatého — CaCl₂ a Ca(ClO)₂",
      "chloridu a chlornanu sodného — NaCl a NaClO",
      "chloru a chlornanu sodného",
      "chloru a chlorečnanu draselného",
    ],
    correct: [0],
    explanation: "Chlorové vápno vzniká zaváděním chloru do hašeného vápna, takže obsahuje vápenaté soli. Chlornan SODNÝ NaClO je účinná látka SAVA — to je něco jiného. V testu bývají obě možnosti vedle sebe.",
    tip: "Vápno → vápenatý. Sodné soli tam nemají co dělat.",
  },
  {
    question: "Označ všechna pravdivá tvrzení o sulfanu:",
    type: "multi",
    options: [
      "Vzniká rozkladem (hnitím) bílkovin",
      "Jeho vodný roztok barví lakmus do červena",
      "Má pouze redukční účinky",
      "Je to toxický plyn se zápachem po zkažených vejcích",
      "Jeho vodný roztok barví lakmus do modra",
    ],
    correct: [0, 1, 2, 3],
    explanation: "Vodný roztok sulfanu je slabá kyselina sulfanová, takže lakmus barví do ČERVENA — do modra ho barví zásady. Síra je v aminokyselinách cysteinu a methioninu, proto sulfan vzniká hnitím bílkovin. Oxidační číslo −II je pro síru minimum, takže sulfan může působit jen jako redukční činidlo.",
    tip: "Kyselina → lakmus červený. Zásada → modrý.",
  },
  {
    question: "Kyselina sírová má silné dehydratační účinky. Jak vypadá rovnice její reakce s glukosou?",
    type: "single",
    options: [
      "C₆H₁₂O₆ → 6 C + 6 H₂O",
      "C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O",
      "C₆H₁₂O₆ + H₂SO₄ → C₆H₁₂SO₄ + 3 H₂O",
      "C₆H₁₂O₆ → 3 C₂H₅OH + 3 CO₂",
    ],
    correct: [0],
    explanation: "Vzorec glukosy se dá číst jako 6 C · 6 H₂O, tedy uhlík „obalený“ vodou. Koncentrovaná H₂SO₄ tu vodu odejme a zbude černý porézní uhlík. Kyselina se při tom nespotřebuje, proto se píše nad šipku. Druhá možnost je spalování, čtvrtá alkoholové kvašení.",
    tip: "Spočítej si to: 6 C + 6 H₂O dá přesně C₆H₁₂O₆.",
  },
  {
    question: "Proč má fluor ve sloučeninách VŽDY oxidační číslo −I, zatímco ostatní halogeny mohou mít i kladná?",
    type: "single",
    options: [
      "Fluor je nejelektronegativnější prvek vůbec, takže vždy přitahuje elektrony k sobě – dokonce i od kyslíku (OF₂ je fluorid kyslíku)",
      "Fluor nemá volné d-orbitaly, a proto nemůže tvořit více než jednu vazbu",
      "Fluor se v přírodě vyskytuje pouze v podobě fluoridů",
      "Fluor je plyn a plyny mívají vždy záporná oxidační čísla",
    ],
    correct: [0],
    explanation: "Kladné oxidační číslo by halogen musel získat vazbou na elektronegativnější prvek (typicky kyslík). Fluor takového partnera nemá – je nejelektronegativnější ze všech prvků. Proto neexistují oxidy fluoru, ale jen fluoridy kyslíku (OF₂).",
    tip: "Chytačka: OF₂ se NEČTE jako „oxid fluoritý“, ale jako fluorid kyslíku.",
  },
];

/* ═══════════════════════════════════════════════════════════════════
   DATA — kartičky
   ═══════════════════════════════════════════════════════════════════ */
const CARDS = [
  { tag: "Chalkogeny", front: "Chalkogeny = ?", back: "Rudotvorné prvky VI.A skupiny (chalkos = ruda, gennao = tvořím). O, S, Se, Te, Po. Konfigurace ns² np⁴." },
  { tag: "Halogeny", front: "Halogeny = ?", back: "Solitvorné prvky VII.A skupiny (hals = sůl, gennao = tvořím). F, Cl, Br, I, At. Konfigurace ns² np⁵." },
  { tag: "Síra", front: "Vaznosti síry a jejich příklady", back: "II – základní stav (H₂S, Na₂S) · IV – 1. excitace do 3d (SO₂, H₂SO₃) · VI – 2. excitace (SO₃, H₂SO₄). Umožňují to volné 3d-orbitaly." },
  { tag: "Síra", front: "Oxidační čísla síry", back: "−II, 0, II, IV, VI. Nejnižší −II (sulfidy) → jen redukční činidlo. Nejvyšší VI (sírany) → jen oxidační činidlo." },
  { tag: "Síra", front: "Alotropické modifikace síry", back: "Kosočtverečná (α, do 96 °C) · jednoklonná (β, nad 96 °C) · amorfní – sirný květ a plastická síra." },
  { tag: "Síra", front: "Proč není S₈ rovinná?", back: "Každý atom síry nese 2 volné elektronové páry. Ty se odpuzují, stlačují vazebný úhel na ~108° a kruh se zvlní do tvaru koruny – atomy střídavě nad a pod rovinou." },
  { tag: "Síra", front: "Co se děje se sírou při zahřívání?", back: "96 °C: kosočtverečná → jednoklonná · 119 °C: taje na žlutou kapalinu · nad 160 °C: hnědne, viskozita roste (kruhy S₈ se otevírají na řetězce až 200 000 atomů) · dál ↑ t: řetězce se zkracují, viskozita klesá." },
  { tag: "Minerály", front: "FeS₂ · ZnS · PbS", back: "pyrit = disulfid železnatý · sfalerit = sulfid zinečnatý · galenit = sulfid olovnatý" },
  { tag: "Minerály", front: "Na₂SO₄·10 H₂O · BaSO₄ · CaSO₄·2 H₂O", back: "Glauberova sůl · baryt · sádrovec (dihydrát síranu vápenatého)" },
  { tag: "Minerály", front: "Zelená a modrá skalice", back: "FeSO₄·7 H₂O = zelená skalice (heptahydrát síranu železnatého) · CuSO₄·5 H₂O = modrá skalice (pentahydrát síranu měďnatého)" },
  { tag: "Sulfan", front: "Sulfan H₂S – vlastnosti", back: "Bezbarvý jedovatý plyn, zápach po zkažených vejcích. Lomená molekula (jako voda, úhel ~92°). Plynný, protože nemá vodíkové můstky. Vodný roztok = slabá dvojsytná kyselina sulfanová." },
  { tag: "Sulfan", front: "Soli kyseliny sulfanové", back: "Sulfidy S²⁻ a hydrogensulfidy HS⁻. HS⁻ jsou rozpustné; S²⁻ jen u I.A, II.A a (NH₄)₂S." },
  { tag: "Sulfan", front: "Příprava sulfanu", back: "FeS + 2 HCl → FeCl₂ + H₂S (vytěsnění silnější kyselinou ze sulfidu)" },
  { tag: "SO₂", front: "Oxid siřičitý – vlastnosti", back: "BEZBARVÝ štiplavý jedovatý plyn, těžší než vzduch, nepodporuje hoření. Bělicí a dezinfekční účinky (sirný knot – úly, vinné sudy). Rozpustný ve vodě na H₂SO₃." },
  { tag: "SO₂", front: "Redukční vs. oxidační účinky SO₂", back: "Redukční (běžné): 2 SO₂ + O₂ → 2 SO₃ (kat. V₂O₅), IV → VI. Oxidační (zřídka): SO₂ + 2 H₂S → 3 S + 2 H₂O, IV → 0." },
  { tag: "SO₃", front: "Oxid sírový – co o něm víš?", back: "Za n.p. pevný, trimerní cyklické molekuly (S₃O₉), podobá se ledu. Silné oxidační účinky. Výroba 2 SO₂ + O₂ ⇄ 2 SO₃ (V₂O₅). S vodou → H₂SO₄, v konc. H₂SO₄ se rozpouští na oleum." },
  { tag: "Kyseliny", front: "Kyselina siřičitá vs. sírová", back: "H₂SO₃ – slabá, NESTÁLÁ, dvojsytná, S má IV. H₂SO₄ – SILNÁ žíravina, hygroskopická, oxidační účinky, S má VI. Sírová je silnější (více kyslíků + vyšší ox. číslo)." },
  { tag: "Kyseliny", front: "Anionty kyseliny sírové", back: "SO₄²⁻ síranový · HSO₄⁻ hydrogensíranový" },
  { tag: "Kyseliny", front: "Zředěná vs. koncentrovaná H₂SO₄", back: "Zředěná: rozpouští jen neušlechtilé kovy, vytěsňuje z nich vodík, NEMÁ oxidační účinky. Koncentrovaná: MÁ oxidační účinky, sama se redukuje (na SO₂) a reaguje i s Cu, Ag, Hg. Fe a Pb pasivuje." },
  { tag: "Oxokyseliny", front: "H₂S₂O₃ · H₂S₂O₅ · H₂S₂O₇", back: "kyselina thiosírová · disiřičitá · disírová" },
  { tag: "Oxokyseliny", front: "H₂SO₅ · H₂S₂O₈", back: "kyselina peroxosírová · peroxodisírová (obsahují skupinu −O−O−)" },
  { tag: "Názvosloví", front: "Předpony thio- · peroxo- · di-", back: "thio- = atom kyslíku nahrazen sírou · peroxo- = skupina −O− nahrazena −O−O− · di- = dvě centrální jádra spojená přes kyslík (odštěpí se H₂O)" },
  { tag: "Halogeny", front: "Skupenství a barvy halogenů", back: "F₂ nazelenalý plyn · Cl₂ žlutozelený plyn · Br₂ červenohnědá kapalina · I₂ fialová pevná látka, která sublimuje" },
  { tag: "Halogeny", front: "Jak se mění oxidační účinky halogenů?", back: "KLESAJÍ s rostoucím Z: F₂ > Cl₂ > Br₂ > I₂. Proto silnější halogen vytěsní slabší z jeho halogenidu (Cl₂ + 2 KBr → 2 KCl + Br₂)." },
  { tag: "Halogeny", front: "Minerály halogenů", back: "fluorit CaF₂ · halit NaCl (kamenná sůl) · kryolit Na₃AlF₆ · sylvín KCl. Nejhojnější zdroj X⁻ je mořská voda. Elementární halogeny X₂ příroda nezná." },
  { tag: "Halogeny", front: "Proč nelze fluor připravit oxidací?", back: "Je to nejsilnější oxidační činidlo ze všech prvků – neexistuje látka, která by F⁻ zoxidovala. Získává se výhradně elektrolýzou taveniny (KHF₂ v bezvodém HF)." },
  { tag: "Halogenovodíky", front: "Síla halogenovodíkových kyselin", back: "HF < HCl < HBr < HI. HF je jako jediná slabá – má krátkou pevnou vazbu a vodíkové můstky." },
  { tag: "Halogenovodíky", front: "Význam HF a HCl", back: "HF leptá sklo: SiO₂ + 4 HF → SiF₄ + 2 H₂O (skladuje se v plastu). HCl v žaludku 0,3–0,4 %, pH 1–3: aktivuje pepsin, denaturuje bílkoviny, ničí mikroorganismy." },
  { tag: "Halogenidy", front: "Tři typy halogenidů", back: "Iontové (NaCl, CaF₂) – vysoké t.t., taveniny a roztoky VEDOU proud. Kovalentní molekulové (CCl₄, SF₆) – těkavé, s vodou nereagují. Polymerní (PdCl₂, BeCl₂) – řetězce/vrstvy." },
  { tag: "Halogenidy", front: "Důkaz halogenidů", back: "AgNO₃: AgCl bílá, AgBr nažloutlá, AgI žlutá sraženina. AgF je jako jediný rozpustný." },
  { tag: "Halogeny", front: "Interhalogeny", back: "Sloučeniny dvou různých halogenů (ClF, BrF₃, IF₅, IF₇). Centrální je těžší halogen s kladným ox. číslem. Velmi reaktivní, silná fluorační činidla, hydrolyzují." },
  { tag: "Oxokyseliny Cl", front: "Oxokyseliny chloru a jejich soli", back: "HClO chlorná → chlornany (SAVO = NaClO) · HClO₂ chloritá → chloritany · HClO₃ chlorečná → chlorečnany · HClO₄ chloristá → chloristany. Síla roste s ox. číslem." },
  { tag: "Oxokyseliny Cl", front: "Chlorová voda", back: "Cl₂ + H₂O ⇄ HCl + HClO (disproporcionace). HClO má dezinfekční a bělicí účinky → chlorace pitné vody a bazénů." },
  { tag: "Praxe", front: "Jodová tinktura je?", back: "5% roztok jodu v ETHANOLU (s přídavkem KI). Ve vodě je jod prakticky nerozpustný — je nepolární, a podobné se rozpouští v podobném." },
  { tag: "Praxe", front: "Chlorové vápno vs. SAVO", back: "Chlorové vápno = směs CaCl₂ a Ca(ClO)₂ (chlorid a chlornan VÁPENATÝ). SAVO = NaClO, chlornan SODNÝ. V testu bývají vedle sebe." },
  { tag: "Halogeny", front: "Jaký krystal tvoří pevný jod?", back: "MOLEKULOVÝ krystal — v mřížce sedí celé molekuly I₂, drží je jen slabé van der Waalsovy síly. Proto nízká teplota tání a sublimace. (Atomový krystal je diamant.)" },
  { tag: "Halogeny", front: "Čím je nebezpečný chlor?", back: "Toxický žlutozelený plyn — leptá dýchací cesty a může vyvolat edém (otok) plic. Za 1. sv. války bojová látka." },
  { tag: "Sulfan", front: "Jak sulfan vzniká v přírodě a jak barví lakmus?", back: "Vzniká rozkladem (hnitím) bílkovin — síra je v cysteinu a methioninu. Jeho vodný roztok je KYSELINA, takže lakmus barví do ČERVENA." },
  { tag: "Kyseliny", front: "Dehydratace glukosy kyselinou sírovou", back: "C₆H₁₂O₆ → 6 C + 6 H₂O (nad šipkou H₂SO₄). Vzorec glukosy = uhlík „obalený“ vodou; kyselina vodu odejme a zbude černý uhlík." },
  { tag: "Jod", front: "Proč se jodizuje kuchyňská sůl?", back: "Jod je součástí thyroxinu, hormonu štítné žlázy. Nedostatek způsobuje strumu, proto se do soli přidává KI nebo KIO₃." },
  { tag: "Chytačka", front: "Má fluor někdy kladné oxidační číslo?", back: "Nikdy. Je nejelektronegativnější prvek vůbec, proto má vždy −I. Neexistují oxidy fluoru, jen fluoridy kyslíku (OF₂)." },
];

/* Názvosloví z pracovního listu — drilovací dvojice */
const NAZVY = [
  { a: "hydrogensulfid amonný", b: "NH₄HS", note: "Amonný kationt NH₄⁺ + hydrogensulfidový anion HS⁻." },
  { a: "heptahydrát síranu železnatého", b: "FeSO₄ · 7 H₂O", note: "Známý jako zelená skalice. Fe má II, hepta- = 7 molekul vody." },
  { a: "disíran hlinitý", b: "Al₂(S₂O₇)₃", note: "Disíranový anion S₂O₇²⁻, Al má III → křížové pravidlo 2 : 3." },
  { a: "thiosíran draselný", b: "K₂S₂O₃", note: "V síranu SO₄²⁻ nahradíme jeden kyslík sírou → S₂O₃²⁻." },
  { a: "thiosiřičitan sodný", b: "Na₂S₂O₂", note: "V siřičitanu SO₃²⁻ nahradíme jeden kyslík sírou → S₂O₂²⁻." },
  { a: "hydrogensíran hořečnatý", b: "Mg(HSO₄)₂", note: "Mg má II, HSO₄⁻ má náboj −I → dvě skupiny v závorce." },
  { a: "disiřičitan lithný", b: "Li₂S₂O₅", note: "Disiřičitanový anion S₂O₅²⁻ (dvě jádra síry s ox. číslem IV)." },
  { a: "trithiomolybdenan stříbrný", b: "Ag₂MoOS₃", note: "Molybdenan MoO₄²⁻; tri-thio = tři kyslíky nahrazeny sírou → MoOS₃²⁻." },
  { a: "kyselina trihydrogentetrathiofosforečná", b: "H₃PS₄", note: "Z H₃PO₄ nahradíme všechny čtyři kyslíky sírou → tetrathio-." },
  { a: "pentahydrát síranu měďnatého", b: "CuSO₄ · 5 H₂O", note: "Modrá skalice. Cu má II, penta- = 5 molekul vody." },
  { a: "kyselina disiřičitá", b: "H₂S₂O₅", note: "2 × H₂SO₃ − H₂O = H₂S₂O₅ (dvě jádra síry s ox. číslem IV)." },
  { a: "kyselina thiosírová", b: "H₂S₂O₃", note: "Z H₂SO₄ nahradíme jeden =O za =S." },
  { a: "kyselina disírová", b: "H₂S₂O₇", note: "2 × H₂SO₄ − H₂O = H₂S₂O₇. Je součástí olea." },
  { a: "kyselina peroxosírová", b: "H₂SO₅", note: "V H₂SO₄ nahradíme −O− skupinou −O−O−." },
  { a: "kyselina peroxodisírová", b: "H₂S₂O₈", note: "Disírová H₂S₂O₇ s peroxoskupinou navíc." },
];

/* Drilovací komponenta na názvosloví */
function NazvyDrill() {
  const [flip, setFlip] = useState(false);
  const [shown, setShown] = useState({});
  return (
    <div>
      <div className="numchk-row" style={{ marginBottom: 14 }}>
        <button className="btn btn-mini" onClick={() => { setFlip(f => !f); setShown({}); }}>
          🔁 Směr: {flip ? "vzorec → název" : "název → vzorec"}
        </button>
        <button className="btn btn-mini" onClick={() => setShown({})}>Skrýt vše</button>
      </div>
      <div className="grid2">
        {NAZVY.map((n, i) => (
          <Box key={i}>
            <div className={flip ? "m" : ""} style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>
              {flip ? n.b : n.a}
            </div>
            {shown[i]
              ? <div>
                  <div className={flip ? "" : "m"} style={{ fontSize: 17, color: "#2ee6a8", fontWeight: 600 }}>
                    {flip ? n.a : n.b}
                  </div>
                  <div style={{ fontSize: 13.5, color: "#778393", marginTop: 8, lineHeight: 1.6 }}>{n.note}</div>
                </div>
              : <button className="btn btn-mini btn-reveal" style={{ marginTop: 0 }} onClick={() => setShown(s => ({ ...s, [i]: true }))}>Odhalit</button>}
          </Box>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   APLIKACE
   ═══════════════════════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════════════════════
   VZOROVÝ TEST OD PANÍ PROFESORKY — 25 otázek, přesně v jejím pořadí
   ═══════════════════════════════════════════════════════════════════ */

/** Normalizace pro doplňovačky: malá písmena, bez diakritiky, bez interpunkce. */
function norm(s) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[.,;:!?()"'–—-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const SAMPLE = [
  {
    n: 1, type: "multi", q: "O halogenech platí:",
    options: [
      "za n.p. jsou jednoatomové",
      "mají vysokou elektronegativitu, proto ochotně tvoří halogenidy",
      "jejich schopnost tvořit anionty roste s poklesem elektronegativity",
      "za n.p. tvoří dvouatomové molekuly",
    ],
    correct: [1, 3],
    exp: <>Halogeny tvoří <b>dvouatomové molekuly X₂</b> — jednoatomové jsou vzácné plyny. Vysoká elektronegativita znamená, že ochotně přijímají elektron a tvoří halogenidy. Schopnost tvořit anionty ale s poklesem elektronegativity <b>klesá</b> (proto F₂ &gt; Cl₂ &gt; Br₂ &gt; I₂), ne roste.</>,
    tip: "Tvrzení s „roste s poklesem“ je obrácené naruby — klasická past.",
  },
  {
    n: 2, type: "fill", q: "Jedním z nejdůležitějších zdrojů halogenů je ……………… voda.",
    accept: ["morska", "morska voda"], answer: "mořská",
    exp: <>Mořská voda je nejhojnějším zdrojem halogenidových aniontů <M>X⁻</M> — hlavně chloridů. Elementární halogeny <M>X₂</M> příroda nezná.</>,
  },
  {
    n: 3, type: "multi", q: "Elektronovou konfiguraci nejbližšího vzácného plynu mohou atomy halogenů získat:",
    options: [
      "přijetím jednoho elektronu",
      "v kovalentních sloučeninách vytvořením jedné σ a jedné π vazby",
      "tvorbou dvouatomové molekuly halogenu",
      "vznikem halogenidového aniontu X⁻ v iontových sloučeninách",
    ],
    correct: [0, 2, 3],
    exp: <>Halogenu chybí do oktetu <b>jeden</b> elektron. Získá ho buď úplným přijetím (vznik aniontu <M>X⁻</M>, iontové sloučeniny), nebo sdílením jednoho elektronového páru — tedy <b>jednou σ vazbou</b> (v <M>X₂</M> i v <M>HX</M>). Dvojná vazba (σ + π) by znamenala dva sdílené páry, tedy o elektron navíc — to by oktet překročilo.</>,
    tip: "Halogen = jedna vazba. Chybí mu jeden elektron, tak tvoří jednu σ vazbu.",
  },
  {
    n: 4, type: "multi", q: "Volné halogeny se připravují:",
    options: [
      "rozkladem kyslíkatých sloučenin halogenů",
      "oxidací halogenidových aniontů",
      "elektrolýzou roztoků halogenidů",
      "elektrolýzou tavenin alkalických kovů",
    ],
    correct: [1, 2],
    exp: <>Oxidace <M>X⁻</M> na <M>X₂</M> je standardní laboratorní cesta (<M>MnO₂ + 4 HCl → MnCl₂ + Cl₂ + 2 H₂O</M>) a elektrolýza roztoku halogenidu je průmyslová výroba chloru ze solanky. Rozkladem kyslíkatých sloučenin vzniká <b>kyslík</b>, ne halogen. A „taveniny alkalických kovů“ žádný halogen neobsahují — kdyby tam stálo <b>taveniny halogenidů</b> alkalických kovů, bylo by to správně.</>,
    tip: "U poslední možnosti si přečti, co tam opravdu je: tavenina KOVŮ, ne halogenidů.",
  },
  {
    n: 5, type: "fill", q: "Jeden z halogenů a mnohé jeho sloučeniny mají bělicí a dezinfekční účinky. O který halogen se jedná?",
    accept: ["chlor", "cl", "cl2"], answer: "chlor",
    exp: <>Chlor a jeho kyslíkaté sloučeniny: <M>Cl₂ + H₂O ⇄ HCl + HClO</M> (chlorová voda), <M>NaClO</M> = SAVO, chlorové vápno. Účinnou látkou je kyselina chlorná, která uvolňuje atomární kyslík.</>,
  },
  {
    n: 6, type: "single", q: "Jodová tinktura je:",
    options: [
      "2% roztok jodu ve vodě",
      "5% roztok jodu v ethanolu",
      "5% roztok jodu ve vodě",
    ],
    correct: [1],
    exp: <>Jodová tinktura je <b>5% roztok jodu v ethanolu</b> (s přídavkem jodidu draselného, který rozpustnost zvyšuje). Ve vodě je jod prakticky nerozpustný — je to nepolární látka, a ta se rozpouští v nepolárních či méně polárních rozpouštědlech (ethanol, <M>CS₂</M>).</>,
    tip: "Podobné se rozpouští v podobném. Jod je nepolární → líh ano, voda ne.",
  },
  {
    n: 7, type: "multi", q: "Jaký typ krystalu vytváří jod v pevném skupenství a jaké vlastnosti z toho vyplývají?",
    options: [
      "molekulový krystal",
      "při zahřátí sublimuje",
      "atomový krystal",
      "slabé van der Waalsovy síly působí v pevném skupenství mezi molekulami",
    ],
    correct: [0, 1, 3],
    exp: <>V uzlových bodech mřížky sedí celé molekuly <M>I₂</M> — jde tedy o <b>molekulový krystal</b>. Drží je jen slabé van der Waalsovy síly, takže stačí málo energie a krystal se rozpadne: jod <b>sublimuje</b> (přechází rovnou na fialové páry). Atomový (kovalentní) krystal je třeba diamant — ten má naopak extrémně vysokou teplotu tání.</>,
    tip: "Slabé mezimolekulové síly = nízká teplota tání = sublimace.",
  },
  {
    n: 8, type: "multi", q: "Chlor:",
    options: [
      "je za n.p. plyn",
      "je toxický, může způsobit edém plic",
      "ve sloučeninách nabývá pouze oxidačního čísla −I",
      "není rozpustný ve vodě",
    ],
    correct: [0, 1],
    exp: <>Chlor je žlutozelený toxický plyn — za 1. světové války se použil jako bojová látka právě proto, že leptá dýchací cesty a vyvolává otok (edém) plic. Ve sloučeninách má <b>−I, ale i I, III, V a VII</b> (HClO až HClO₄) — „pouze −I“ platí jedině pro fluor. A ve vodě se rozpouští, vzniká chlorová voda.</>,
    tip: "„Pouze −I“ = fluor. U chloru je to vždycky špatně.",
  },
  {
    n: 9, type: "fill", q: "V hormonu štítné žlázy, thyroxinu, se nachází atomy halogenu, jehož správnou hladinu můžeme udržovat přijímáním kuchyňské soli obohacené o tento prvek. O který halogen se jedná?",
    accept: ["jod", "i", "i2", "iod"], answer: "jod",
    exp: <>Jod. Jeho nedostatek vede ke <b>strumě</b> (zvětšení štítné žlázy), proto se kuchyňská sůl jodizuje (přidává se <M>KI</M> nebo <M>KIO₃</M>). V přírodě je jod v chaluhách a mořských řasách.</>,
  },
  {
    n: 10, type: "multi", q: "O halogenovodících platí:",
    options: [
      "HCl (aq) se nachází v žaludku",
      "HF se používá při leptání skla",
      "HI (aq) je nejslabší halogenovodíkovou kyselinou",
      "za n.p. se jedná o bezbarvé, ostře zapáchající plyny, rozpustné ve vodě",
    ],
    correct: [0, 1, 3],
    exp: <>Síla halogenovodíkových kyselin <b>roste</b> směrem dolů: <M>HF &lt; HCl &lt; HBr &lt; HI</M>. <b>HI je tedy nejsilnější</b>, nejslabší je HF (krátká pevná vazba + vodíkové můstky). HCl je v žaludeční šťávě (0,3–0,4 %, pH 1–3), HF leptá sklo: <M>SiO₂ + 4 HF → SiF₄ + 2 H₂O</M>.</>,
    tip: "Nejelektronegativnější fluor dává NEJSLABŠÍ kyselinu. Zapamatuj si to jako výjimku.",
  },
  {
    n: 11, type: "open", q: <>Doplňte a vyčíslete:
      <div className="m" style={{ display: "block", marginTop: 10, padding: "10px 12px", lineHeight: 2 }}>
        NaCl + H₂SO₄ →<br />
        Cl₂ + KI →<br />
        MnO₂ + HCl → ……… + MnCl₂ + H₂O<br />
        I₂ + CaF₂ →
      </div></>,
    answer: <>
      <Eq left="NaCl + H₂SO₄" right="NaHSO₄ + HCl" note="Vytěsnění těkavé kyseliny netěkavou. Za vyšší teploty reaguje i druhý vodík: 2 NaCl + H₂SO₄ → Na₂SO₄ + 2 HCl." />
      <Eq left="Cl₂ + 2 KI" right="2 KCl + I₂" note="Chlor je silnější oxidační činidlo než jod, proto ho z jodidu vytěsní. Roztok zhnědne." />
      <Eq left="MnO₂ + 4 HCl" right="Cl₂ + MnCl₂ + 2 H₂O" note="Laboratorní příprava chloru oxidací chlorovodíku." />
      <Eq left="I₂ + CaF₂" right="nereaguje" note="Obráceně to nejde: jod je slabší oxidační činidlo než fluor, takže ho z fluoridu vytěsnit nedokáže." />
    </>,
    exp: <>Poslední rovnice je chyták — tři fungují, čtvrtá ne. Pravidlo: <b>silnější halogen (výš v tabulce) vytěsní slabší</b>, nikdy naopak.</>,
  },
  {
    n: 12, type: "single", q: "Chlorové vápno je směs:",
    options: [
      "chloridu a chlornanu vápenatého",
      "chloru a chlornanu sodného",
      "chloridu a chlornanu sodného",
      "chloru a chlorečnanu draselného",
    ],
    correct: [0],
    exp: <>Chlorové vápno vzniká zaváděním chloru do hašeného vápna a je to směs <M>CaCl₂</M> a <M>Ca(ClO)₂</M> — tedy <b>chloridu a chlornanu vápenatého</b>. Používá se k dezinfekci. Chlornan <b>sodný</b> <M>NaClO</M> je SAVO, to je něco jiného.</>,
    tip: "Vápno → vápenatý. Sodné soli sem nepatří.",
  },
  {
    n: 13, type: "open", q: "Seřaďte kyseliny od nejslabší po nejsilnější, zapište vzorci: kyselina chloritá · kyselina chlorná · kyselina chlorečná · kyselina chloristá",
    answer: <>
      <div className="eq"><div className="eq-row"><span className="eq-l">HClO &lt; HClO₂ &lt; HClO₃ &lt; HClO₄</span></div></div>
      <div style={{ marginTop: 10 }}>chlorná (I) → chloritá (III) → chlorečná (V) → <b>chloristá (VII)</b></div>
    </>,
    exp: <>S rostoucím oxidačním číslem chloru přibývají atomy kyslíku, které odtahují elektronovou hustotu od vazby <M>O–H</M>, takže se <M>H⁺</M> odštěpuje snáz. Kyselina chloristá patří k nejsilnějším známým kyselinám. Zároveň platí, že <b>stálost roste</b> a <b>oxidační účinky klesají</b> stejným směrem.</>,
    tip: "Víc kyslíků = silnější kyselina. Funguje to i u síry: H₂SO₃ < H₂SO₄.",
  },
  {
    n: 14, type: "fill", q: "Elektronová konfigurace valenční vrstvy chalkogenů je ……………… a počet valenčních elektronů je roven ……… .",
    accept: ["ns2 np4 6", "ns2np4 6", "ns2 np4 sest", "ns2 np4 a 6"], answer: "ns² np⁴ · 6 valenčních elektronů",
    hint: "Napiš obojí, např. „ns2 np4 6“.",
    exp: <>VI.A skupina → 6 valenčních elektronů → <M>ns² np⁴</M>. Do oktetu chybí 2 elektrony, proto je základní vaznost <b>II</b>.</>,
  },
  {
    n: 15, type: "multi", q: "O síře platí:",
    options: [
      "v přírodě se nachází pouze ve formě sloučenin",
      "za n.p. má pevné skupenství",
      "nachází se v bílkovinách, je biogenním prvkem",
      "její atomy mohou být ve sloučeninách maximálně 4-vazné",
      "rozpouští se v sirouhlíku",
    ],
    correct: [1, 2, 4],
    exp: <>Síra se v přírodě vyskytuje i <b>volná</b> (Sicílie, Polsko, Japonsko, okolí sopek), takže „pouze ve sloučeninách“ neplatí — to je pravda o halogenech. Díky volným 3d-orbitalům může být až <b>6-vazná</b> (<M>H₂SO₄</M>, <M>SO₃</M>), ne jen 4-vazná. Je žlutá pevná látka, nerozpustná ve vodě, ale rozpustná v sirouhlíku <M>CS₂</M>, a je biogenním prvkem (cystein, methionin).</>,
    tip: "Dvě pasti v jedné otázce: „pouze ve sloučeninách“ (to jsou halogeny) a „maximálně 4-vazné“ (je 6).",
  },
  {
    n: 16, type: "single", q: "Běžnými krystalografickými strukturami síry jsou:",
    options: [
      "kosočtverečná a jednoklonná s molekulami S₈",
      "plastická a kosočtverečná síra",
      "kosočtverečná a jednoklonná s molekulami S₆",
      "plastická a jednoklonná s molekulami S₈",
    ],
    correct: [0],
    exp: <>Obě <b>krystalické</b> modifikace — kosočtverečná (α, stabilní do 96 °C) i jednoklonná (β, nad 96 °C) — jsou stavěné z <b>osmiatomových</b> cyklických molekul <M>S₈</M>. Plastická síra je <b>amorfní</b>, tedy nekrystalická, a do této otázky nepatří.</>,
    tip: "Krystalografické = krystalické. Plastická síra je amorfní, hned ji vyškrtni.",
  },
  {
    n: 17, type: "fill", q: "Atomy síry mají v sulfanu a sulfidech oxidační číslo ……… .",
    accept: ["ii", "2", "ii ", "minus ii", "minus 2", "-ii", "-2"], answer: "−II",
    hint: "Stačí napsat „-II“ nebo „-2“.",
    exp: <>V <M>H₂S</M> i v sulfidech (<M>Na₂S</M>, <M>ZnS</M>) má síra <b>−II</b> — své nejnižší možné oxidační číslo. Proto můžou tyto látky působit už jen jako <b>redukční činidla</b>.</>,
  },
  {
    n: 18, type: "open", q: <>Síra existuje v různých amorfních formách. Doplňte názvy k níže uvedeným charakteristikám:
      <ul style={{ marginTop: 8 }}>
        <li>vzniká při náhlém ochlazení kapalné síry ve vodě — ………</li>
        <li>vzniká při ochlazení par vroucí síry na chladných stěnách nádoby — ………</li>
      </ul></>,
    answer: <>
      <div><b>náhlé ochlazení kapalné síry ve vodě</b> → <span className="k">plastická síra</span></div>
      <div style={{ marginTop: 8 }}><b>ochlazení par na chladných stěnách</b> → <span className="k">sirný květ</span></div>
    </>,
    exp: <>Obě jsou <b>amorfní</b> (nekrystalické) formy. Plastická síra vzniká z <b>kapaliny</b> — dlouhé řetězce se nestihnou uspořádat do kruhů a zůstanou zamotané, proto je pružná. Sirný květ vzniká z <b>par</b> — jemný žlutý prášek na studené stěně.</>,
    tip: "Kapalina → plastická. Páry → květ (jako jinovatka na okně).",
  },
  {
    n: 19, type: "multi", q: "Sulfan:",
    options: [
      "jeho vodný roztok barví lakmus do modra",
      "je toxický plyn se zápachem po zkažených vejcích",
      "je dobře rozpustný ve vodě",
      "má pouze redukční účinky",
      "vzniká rozkladem bílkovin",
    ],
    correct: [1, 2, 3, 4],
    exp: <>Vodný roztok sulfanu je <b>kyselina</b> (slabá dvojsytná kyselina sulfanová), takže lakmus barví do <b>červena</b>, ne do modra — modrý je lakmus v zásadách. Zbytek sedí: je toxický, páchne po zkažených vejcích, rozpouští se ve vodě na sulfanovou vodu, má díky oxidačnímu číslu −II pouze redukční účinky a vzniká hnitím (rozkladem) bílkovin, protože síra je v aminokyselinách cysteinu a methioninu.</>,
    tip: "Kyselina → lakmus červený. Zásada → lakmus modrý.",
  },
  {
    n: 20, type: "fill", q: "Oxid siřičitý v atmosféře je příčinou ……………………… .",
    accept: ["kyselych destu", "kyseleho deste", "kysele deste", "kyselych dest", "kyselé dešťů"], answer: "kyselých dešťů",
    exp: <>SO₂ se ve vzdušné vlhkosti rozpouští na kyselinu siřičitou, která okyseluje srážky. Kyselé deště ničí zejména <b>jehličnaté lesy</b>, způsobují korozi a ohrožují lidské zdraví. Do atmosféry se SO₂ dostává hlavně spalováním <b>hnědého uhlí</b>.</>,
  },
  {
    n: 21, type: "open", q: <>Oxid siřičitý vykazuje redukční i oxidační účinky. Zapište reakci oxidu siřičitého s <b>kyslíkem</b> a se <b>sulfanem</b>. Rovnice vyčíslete a uveďte, kde působí SO₂ jako oxidační a kde jako redukční činidlo.</>,
    answer: <>
      <Eq left="2 SO₂ + O₂" right="2 SO₃" above="kat. V₂O₅" rev note="Síra jde ze IV na VI → SO₂ se OXIDUJE → je REDUKČNÍ činidlo." />
      <Eq left="SO₂ + 2 H₂S" right="3 S + 2 H₂O" note="Síra jde ze IV na 0 → SO₂ se REDUKUJE → je OXIDAČNÍ činidlo." />
    </>,
    exp: <>Síra má v <M>SO₂</M> oxidační číslo <b>IV</b>, což je uprostřed jejího rozsahu (−II až VI). Proto může jít oběma směry. Zapamatuj si pravidlo: látka, která se <b>oxiduje</b>, je <b>redukční</b> činidlo, a naopak.</>,
    tip: "Činidlo se vždy jmenuje OPAČNĚ, než co se s ním děje.",
  },
  {
    n: 22, type: "open", q: "Která ze sloučenin má vyšší teplotu varu — voda, nebo sulfan? Vysvětlete.",
    answer: <><span className="k">Voda</span> — vře při 100 °C, sulfan už při −60 °C.</>,
    exp: <>Mezi molekulami vody působí <b>vodíkové můstky</b>, protože vodík je vázán na silně elektronegativní kyslík. Rozbít je stojí hodně energie → vysoká teplota varu. Síra má elektronegativitu nízkou, vazba <M>S–H</M> je jen slabě polární a vodíkové můstky <b>nevznikají</b> — zbývají jen slabé van der Waalsovy síly.</>,
    tip: "Past: sulfan je TĚŽŠÍ (34 g/mol) než voda (18), a přesto vře dřív. Nerozhoduje hmotnost, ale typ mezimolekulové síly.",
  },
  {
    n: 23, type: "fill", q: "Při ředění kyseliny sírové vodou postupujeme tak, že ……………… přiléváme do ……………… .",
    accept: ["kyselinu do vody", "kyselina do vody", "kyselinu vody"], answer: "kyselinu přiléváme do vody",
    hint: "Napiš to celé, např. „kyselinu do vody“.",
    exp: <>Vždy <b>kyselinu do vody</b>, nikdy naopak. Rozpouštění uvolňuje obrovské množství tepla; kdybys lil vodu do kyseliny, první kapky by se okamžitě začaly vařit a rozstříkly by kyselinu kolem.</>,
    tip: "Pomůcka: „Kyselinu do vody, ne vodu do kyseliny — jinak z tebe budou trosky.“",
  },
  {
    n: 24, type: "open", q: "Kyselina sírová má silné dehydratační účinky. Zapište rovnicí reakci glukosy s kyselinou sírovou. Vyčíslete.",
    answer: <Eq left="C₆H₁₂O₆" right="6 C + 6 H₂O" above="H₂SO₄" note="Kyselina sírová odejme z glukosy veškerou vodu a zůstane černý porézní uhlík." />,
    exp: <>Glukosa má vzorec <M>C₆H₁₂O₆</M>, což se dá číst jako <M>6 C · 6 H₂O</M> — uhlík „obalený“ vodou. Koncentrovaná kyselina sírová tu vodu odejme a zůstane <b>čistý uhlík</b>. V praxi je to známý pokus s cukrem, ze kterého vyleze černý „sloup“. Kyselina sama se při tom nespotřebuje, píše se proto nad šipku.</>,
    tip: "Spočítej si to: 6 C + 6 H₂O = C₆H₁₂O₆. Sedí to přesně.",
  },
  {
    n: 25, type: "single", q: "Které z uvedených chemických reakcí potvrzují oxidační vlastnosti kyseliny sírové?",
    options: [
      "Zn + H₂SO₄ → H₂ + ZnSO₄",
      "2 NaOH + H₂SO₄ → Na₂SO₄ + 2 H₂O",
      "Cu + H₂SO₄ → CuSO₄ + SO₂ + H₂O",
      "CaCl₂ + H₂SO₄ → CaSO₄ + 2 HCl",
    ],
    correct: [2],
    exp: <>Oxidačními účinky se u kyseliny sírové myslí to, že se <b>sama redukuje</b> — síra jde z VI na IV a vzniká <M>SO₂</M>. To se děje jen u <b>koncentrované</b> kyseliny, a jedině reakce s mědí to ukazuje (navíc měď je ušlechtilý kov, ten by se v pouhé kyselině nerozpustil). Neutralizace s NaOH a vytěsnění HCl z chloridu nejsou redoxní reakce vůbec. U zinku sice vzniká vodík, ale to umí i zředěná kyselina — a ta podle vaší definice oxidační účinky nemá.</>,
    tip: "Hledej v rovnici SO₂. Je tam? Pak kyselina oxidovala.",
  },
];

/** Jedna položka vzorového testu. */
function TestItem({ item, onResult }) {
  const [sel, setSel] = useState([]);
  const [txt, setTxt] = useState("");
  const [done, setDone] = useState(false);
  const [ok, setOk] = useState(false);

  const isChoice = item.type === "single" || item.type === "multi";
  const isMulti = item.type === "multi";

  const finish = (good) => { setDone(true); setOk(good); onResult(item.n, good); };

  const pick = (i) => {
    if (done) return;
    if (isMulti) { setSel(s => s.includes(i) ? s.filter(x => x !== i) : [...s, i]); return; }
    setSel([i]); finish(arrEqual([i], item.correct));
  };

  const submitMulti = () => { if (!sel.length) return; finish(arrEqual(sel, item.correct)); };
  const submitFill = () => {
    const v = norm(txt);
    if (!v) return;
    finish(item.accept.some(a => v.includes(norm(a)) || norm(a).includes(v)));
  };

  return (
    <Box className="ti">
      <div className="ti-h">
        <span className={"ti-n" + (done ? (ok ? " is-ok" : " is-bad") : "")}>{item.n}</span>
        <span className="ti-q">{item.q}</span>
        {isMulti && <span className="ti-tag">více správných</span>}
      </div>

      {isChoice && (
        <div className="qz-opts" style={{ marginTop: 14 }}>
          {item.options.map((o, i) => {
            let cls = "qz-opt";
            if (done) {
              if (item.correct.includes(i)) cls += " is-ok";
              else if (sel.includes(i)) cls += " is-bad";
            } else if (sel.includes(i)) cls += " is-sel";
            return (
              <div key={i} className={cls} onClick={() => pick(i)}>
                {isMulti && <span className="qz-cb">{sel.includes(i) ? "☑" : "☐"}</span>}
                <span>{o}</span>
              </div>
            );
          })}
        </div>
      )}
      {isMulti && !done && <button className="btn" onClick={submitMulti} disabled={!sel.length}>Potvrdit</button>}

      {item.type === "fill" && !done && (
        <div className="numchk" style={{ marginTop: 14 }}>
          {item.hint && <label className="numchk-l">{item.hint}</label>}
          <div className="numchk-row">
            <input className="numchk-i" style={{ width: 260 }} value={txt} placeholder="tvoje odpověď"
                   onChange={e => setTxt(e.target.value)}
                   onKeyDown={e => { if (e.key === "Enter") submitFill(); }} />
            <button className="btn btn-mini" onClick={submitFill}>Zkontrolovat</button>
            <button className="btn btn-mini" onClick={() => finish(false)}>Nevím, ukaž</button>
          </div>
        </div>
      )}

      {item.type === "open" && !done && (
        <button className="btn btn-reveal" onClick={() => finish(true)}>🔒 Zobrazit vzorovou odpověď</button>
      )}

      {done && (
        <div className={"qz-fb " + (ok ? "is-ok" : "is-bad")} style={{ marginTop: 16 }}>
          {isChoice && <div className="qz-fb-h">{ok ? "Správně" : "Špatně"}</div>}
          {item.type === "fill" && (
            <>
              <div className="qz-fb-h">{ok ? "Správně" : "Správná odpověď"}</div>
              <div className="qz-fb-c">{item.answer}</div>
            </>
          )}
          {item.type === "open" && <div className="ti-ans">{item.answer}</div>}
          {!ok && isChoice && (
            <div className="qz-fb-c">Správně je: {item.correct.map(i => item.options[i]).join(" · ")}</div>
          )}
          <div className="qz-fb-e">{item.exp}</div>
          {item.tip && <div className="qz-fb-t">💡 {item.tip}</div>}
          <button className="btn btn-mini" style={{ marginTop: 12 }}
                  onClick={() => { setDone(false); setSel([]); setTxt(""); }}>Zkusit znovu</button>
        </div>
      )}
    </Box>
  );
}

/** Celý vzorový test s počítadlem. */
function VzorovyTest() {
  const [res, setRes] = useState({});
  const onResult = useCallback((n, good) => setRes(r => ({ ...r, [n]: good })), []);
  const answered = Object.keys(res).length;
  const good = Object.values(res).filter(Boolean).length;
  const pct = answered ? Math.round((good / answered) * 100) : 0;

  return (
    <>
      <Box tone="acc" className="ti-score">
        <div className="ti-score-row">
          <div>
            <div className="bx-h" style={{ marginBottom: 4 }}>Postup testem</div>
            <div style={{ color: "#a6b2c2", fontSize: 14.5 }}>
              Vyřešeno <b style={{ color: "#e7ecf2" }}>{answered}</b> z 25
              {answered > 0 && <> · úspěšnost <b style={{ color: pct >= 70 ? "#2ee6a8" : "#ffcc66" }}>{pct} %</b></>}
            </div>
          </div>
          <button className="btn btn-mini" onClick={() => setRes({})}>Vynulovat počítadlo</button>
        </div>
        <div className="ti-bar"><div className="ti-bar-fill" style={{ width: `${(answered / 25) * 100}%` }} /></div>
      </Box>
      {SAMPLE.map(it => <TestItem key={it.n} item={it} onResult={onResult} />)}
    </>
  );
}

const SECTIONS = [
  { id: "prehled",  label: "Přehled",          icon: "◆" },
  { id: "vzorovy",  label: "Vzorový test",     icon: "✓" },
  { id: "sira",     label: "Síra",             icon: "S" },
  { id: "slouc-s",  label: "Sloučeniny síry",  icon: "S" },
  { id: "halogeny", label: "Halogeny",         icon: "X" },
  { id: "slouc-x",  label: "Sloučeniny halogenů", icon: "X" },
  { id: "rovnice",  label: "Rovnice",          icon: "→" },
  { id: "priklady", label: "Řešené příklady",  icon: "∑" },
  { id: "nazvy",    label: "Názvosloví",       icon: "A" },
  { id: "kviz",     label: "Kvíz",             icon: "?" },
  { id: "karticky", label: "Kartičky",         icon: "▭" },
  { id: "tahak",    label: "Tahák",            icon: "★" },
];

export default function App() {
  const [sec, setSec] = useState("prehled");

  return (
    <div className="root">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />
      <style>{CSS}</style>

      <div className="hexbg" />
      <div className="glow" />

      <header className="hdr">
        <div className="hdr-in">
          <div className="tiles">
            <div className="tile tile--s"><span className="z">16</span><b>S</b><small>32,07</small></div>
            <div className="tile tile--cl"><span className="z">17</span><b>Cl</b><small>35,45</small></div>
          </div>
          <div className="hdr-txt">
            <h1>Chalkogeny <span className="sep">·</span> Halogeny</h1>
            <p className="sub">
              Příprava na test z chemie · <b>vzorový test</b> od paní profesorky, obě prezentace a oba pracovní listy včetně vyplněného klíče.
            </p>
          </div>
        </div>
      </header>

      <div className="shell">
        <nav className="rail">
          <div className="rail-h">Obsah</div>
          {SECTIONS.map((s, i) => (
            <button key={s.id} className={"nav " + (sec === s.id ? "is-on" : "")} onClick={() => setSec(s.id)}>
              <span className="nav-n">{String(i + 1).padStart(2, "0")}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </nav>

        <main className="main" key={sec}>

          {/* ═══════════ 01 · PŘEHLED ═══════════ */}
          {sec === "prehled" && (
            <>
              <h2><span className="hash">01</span>Přehled — co po tobě chtějí</h2>
              <p className="lead">
                Test pokrývá dvě skupiny periodické tabulky: <K>VI.A chalkogeny</K> (prakticky celá se točí kolem síry)
                a <K>VII.A halogeny</K>. Níže je checklist podle prezentací a pracovních listů. Projdi ho odshora dolů —
                každá položka má vlastní oddíl v levém menu.
              </p>

              <Box tone="acc">
                <div className="bx-h">Plán na dnešní večer (asi 90 minut)</div>
                <ol style={{ paddingLeft: 20, margin: 0 }}>
                  <li><b>25 min</b> — <b>Vzorový test</b> nanečisto. Projdi všech 25 otázek a u každé si přečti vysvětlení.</li>
                  <li><b>20 min</b> — dolaď, co ti ve vzorovém testu nevyšlo: <b>Síra</b>, <b>Sloučeniny síry</b>, <b>Halogeny</b>, <b>Sloučeniny halogenů</b>.</li>
                  <li><b>15 min</b> — <b>Rovnice</b>: zkus si nejdřív doplnit pravou stranu z hlavy, pak odhal.</li>
                  <li><b>15 min</b> — <b>Řešené příklady</b> (hlavně výpočet SO₂ a Beketovova řada).</li>
                  <li><b>10 min</b> — <b>Názvosloví</b> — thio-, peroxo-, di-, hydráty.</li>
                  <li><b>5 min</b> — <b>Vzorový test</b> ještě jednou, tentokrát bez nápovědy.</li>
                  <li>Ráno před testem — už jen <b>Tahák</b> a <b>Kartičky</b>.</li>
                </ol>
              </Box>

              <div className="grid2">
                <Box>
                  <div className="bx-h">Chalkogeny — co musíš umět</div>
                  <ul style={{ paddingLeft: 20, margin: 0 }}>
                    <li>Význam názvu, postavení v PSP, konfigurace <M>ns² np⁴</M></li>
                    <li>Konfigurace a <b>excitace síry</b> → vaznosti II, IV, VI</li>
                    <li>Alotropické modifikace + chování při zahřívání</li>
                    <li>Výskyt: pyrit, sfalerit, galenit, baryt, sádrovec, Glauberova sůl</li>
                    <li>Sulfan — tvar molekuly, vlastnosti, soli, redukční účinky</li>
                    <li>SO₂ a SO₃ — vlastnosti, vznik, redox chování</li>
                    <li>H₂SO₃ vs. H₂SO₄, reakce kovů se zředěnou i koncentrovanou</li>
                    <li>Oxokyseliny síry: thio-, peroxo-, di-</li>
                    <li>Výpočet množství SO₂ z pracovního listu</li>
                  </ul>
                </Box>
                <Box tone="v">
                  <div className="bx-h bx-h--v">Halogeny — co musíš umět</div>
                  <ul style={{ paddingLeft: 20, margin: 0 }}>
                    <li>Význam názvu, konfigurace <M>ns² np⁵</M>, proč jsou reaktivní</li>
                    <li>Skupenství a barvy F₂, Cl₂, Br₂, I₂</li>
                    <li>Výskyt — fluorit, halit, kryolit; mořská voda</li>
                    <li>Stabilizace: kovalentní vazba vs. anion X⁻</li>
                    <li>Příprava a výroba — elektrolýza, oxidace, vytěsňování</li>
                    <li><b>Proč nelze připravit fluor oxidací</b> (otázka s třemi otazníky)</li>
                    <li>Halogenovodíky — síla kyselin, HF a sklo, HCl v žaludku</li>
                    <li>Halogenidy — iontové, kovalentní, polymerní</li>
                    <li>Interhalogeny a kyslíkaté sloučeniny halogenů</li>
                  </ul>
                </Box>
              </div>

              <Box tone="warn">
                <div className="bx-h bx-h--w">Pět chytáků, na kterých se nejčastěji ztrácejí body</div>
                <ul style={{ paddingLeft: 20, margin: 0 }}>
                  <li>SO₂ je <b>bezbarvý</b> — žlutozelený je chlor.</li>
                  <li>Síra hoří v <b>kyslíku</b>, ne v dusíku. S dusíkem přímo nereaguje.</li>
                  <li>Dopad SO₂ na životní prostředí je <b>negativní</b> a deště jsou <b>kyselé</b>, ne zásadité.</li>
                  <li><b>HF je slabá</b> kyselina, i když fluor je nejelektronegativnější. Rozhoduje pevnost vazby H–X.</li>
                  <li>Fluor má <b>vždy −I</b>. Neexistují oxidy fluoru, jen fluoridy kyslíku (OF₂).</li>
                </ul>
              </Box>
            </>
          )}

          {/* ═══════════ 02 · VZOROVÝ TEST ═══════════ */}
          {sec === "vzorovy" && (
            <>
              <h2><span className="hash">02</span>Vzorový test od paní profesorky</h2>
              <p className="lead">
                Všech 25 otázek v původním pořadí a znění. U výběrových otázek klikej na odpovědi,
                u doplňovaček piš do políčka, u otevřených si nejdřív odpověz na papír a pak odhal vzor.
                Ke každé otázce je vysvětlení — <b>i k těm, které trefíš</b>, protože v ostrém testu může být
                otázka postavená jinak.
              </p>
              <W>
                Osm otázek z 25 má <b>víc než jednu správnou odpověď</b>. Označené jsou štítkem „více správných“ —
                v papírovém testu to poznáš podle toho, že u možností nejsou písmena a), b), c).
              </W>
              <VzorovyTest />
            </>
          )}

          {/* ═══════════ 03 · SÍRA ═══════════ */}
          {sec === "sira" && (
            <>
              <h2><span className="hash">03</span>Chalkogeny a elementární síra</h2>
              <p className="lead">Klikni na téma a rozbal si výklad. Vše nejdůležitější najdeš zkráceně i v <K>Taháku</K>.</p>

              <Fold title="2.1 · Chalkogeny — co to je a proč se tak jmenují" badge="ZÁKLAD" open>
                <p><K>Chalkogeny</K> = prvky <b>VI.A skupiny</b>: kyslík <M>O</M>, síra <M>S</M>, selen <M>Se</M>, tellur <M>Te</M>, polonium <M>Po</M>.</p>
                <p>Název pochází z řečtiny: <K>chalkos</K> = ruda, <K>gennao</K> = tvořím → <b>rudotvorné prvky</b>. Tvoří totiž většinu rud, se kterými se v přírodě setkáme (sulfidy a oxidy kovů).</p>
                <ul>
                  <li>Valenční konfigurace <M>ns² np⁴</M> — 6 valenčních elektronů, do oktetu chybí <b>2</b>.</li>
                  <li>Základní vaznost je proto <b>II</b> (dva nespárované p-elektrony).</li>
                  <li>Oxidační čísla: <M>−II, 0, II, IV, VI</M>.</li>
                  <li>Shora dolů klesá elektronegativita a roste kovový charakter: O a S jsou nekovy, Se a Te polokovy, Po kov.</li>
                </ul>
                <W>Nepleť si chalkogeny s halogeny. <b>CHAL</b>kos = ruda → <b>chal</b>kogeny (VI.A). <b>HAL</b>s = sůl → <b>hal</b>ogeny (VII.A).</W>
              </Fold>

              <Fold title="2.2 · Konfigurace síry, excitace a vaznosti" badge="BUDE V TESTU">
                <p>Síra má protonové číslo <b>16</b>. Zápis pomocí zkrácené konfigurace:</p>
                <div className="eq"><div className="eq-row"><span className="eq-l">₁₆S:</span><span className="eq-r">[Ne] 3s² 3p⁴ &nbsp; → &nbsp; vaznost II</span></div></div>
                <p>V podslupce <M>3p⁴</M> jsou <b>dva nespárované elektrony</b> → síra je dvojvazná. Příklady: <M>H₂S</M>, <M>Na₂S</M>, <M>ZnS</M>.</p>
                <p>Protože je síra ve <b>3. periodě</b>, má k dispozici prázdné <K>3d-orbitaly</K>. Do nich může při dodání energie přeskočit elektron — tomu se říká <K>excitace</K>:</p>
                <div className="eq"><div className="eq-row"><span className="eq-l">1. excitace:</span><span className="eq-r">[Ne] 3s² 3p³ 3d¹ &nbsp; → &nbsp; 4 nespárované e⁻ &nbsp; → &nbsp; vaznost IV</span></div></div>
                <div className="eq"><div className="eq-row"><span className="eq-l">2. excitace:</span><span className="eq-r">[Ne] 3s¹ 3p³ 3d² &nbsp; → &nbsp; 6 nespárovaných e⁻ &nbsp; → &nbsp; vaznost VI</span></div></div>
                <Tab
                  head={["Vaznost", "Vzniká", "Příklad", "Elektronový strukturní vzorec"]}
                  rows={[
                    ["II", "základní stav", "sulfan H₂S", "H–S–H, na síře 2 volné elektronové páry"],
                    ["IV", "1. excitace", "oxid siřičitý SO₂", "O=S=O, na síře 1 volný elektronový pár → lomená molekula"],
                    ["VI", "2. excitace", "kyselina sírová H₂SO₄", "H–O–S(=O)(=O)–O–H, na síře žádný volný pár"],
                  ]}
                />
                <W>Klasická otázka: <b>proč může být síra šestivazná a kyslík ne?</b> Odpověď: kyslík je ve 2. periodě, kde orbitaly <i>d</i> vůbec neexistují, takže nemá kam excitovat. Zůstává maximálně dvojvazný.</W>
              </Fold>

              <Fold title="2.3 · Alotropické modifikace a molekula S₈" badge="OBLÍBENÁ OTÁZKA">
                <p>Elementární síra tvoří <K>osmiatomové cyklické molekuly S₈</K> ve tvaru zvlněného kruhu („koruny“).</p>
                <p><b>Proč není S₈ rovinná?</b> Každý atom síry je dvojvazný, takže mu zbývají <K>dva volné elektronové páry</K>. Volné páry se odpuzují silněji než páry vazebné, stlačují vazebný úhel přibližně na 108° a nutí kruh, aby se zvlnil — atomy proto leží střídavě nad a pod rovinou.</p>
                <p><b>Modifikace:</b></p>
                <ul>
                  <li><K>kosočtverečná (α)</K> — stabilní do 96 °C, nejběžnější žlutá síra</li>
                  <li><K>jednoklonná (β)</K> — stabilní nad 96 °C</li>
                  <li><K>amorfní</K> — <b>sirný květ</b> (rychle zchlazené páry) a <b>plastická síra</b> (tavenina vlitá do vody)</li>
                </ul>
                <p><b>Ostatní vlastnosti:</b> nekov, ve vodě nerozpustná, rozpustná v <M>CS₂</M>, elektricky nevodivá. Tvoří kovalentní polární vazby (<M>H₂S</M>) i iontové vazby (<M>Na₂S</M>). Má <b>oxidační i redukční</b> vlastnosti.</p>
              </Fold>

              <Fold title="2.4 · Chování síry při zahřívání" badge="POSLOUPNOST TEPLOT">
                <Tab
                  head={["Teplota", "Co se děje"]}
                  rows={[
                    ["> 96 °C", "kosočtverečná modifikace přechází na jednoklonnou (změna struktury)"],
                    ["119 °C", "bod tání — vzniká žlutá kapalná síra, stále tvořená kruhy S₈"],
                    ["> 160 °C", "tavenina hnědne a roste její viskozita: kruhy S₈ se otevírají a spojují do dlouhých řetězců až o 200 000 atomech"],
                    ["dále ↑ t", "řetězce se zkracují → viskozita opět klesá"],
                  ]}
                />
                <W>Nelogické na první pohled: zahříváme, a kapalina <b>houstne</b>. Důvod je strukturní — krátké kruhy se mění na dlouhé zamotané řetězce. Teprve když se řetězce zase potrhají, tekutost se vrátí.</W>
              </Fold>

              <Fold title="2.5 · Výskyt síry v přírodě" badge="MINERÁLY">
                <p><b>Volná (elementární) síra:</b> Sicílie, Polsko, Japonsko, USA, Kavkaz, Ural — typicky v okolí sopek.</p>
                <p><b>V sulfidech:</b></p>
                <Tab mono head={["Vzorec", "Minerál", "Chemický název"]} rows={[
                  ["FeS₂", "pyrit", "disulfid železnatý"],
                  ["ZnS", "sfalerit", "sulfid zinečnatý"],
                  ["PbS", "galenit", "sulfid olovnatý"],
                ]} />
                <p><b>V síranech:</b></p>
                <Tab mono head={["Vzorec", "Minerál / název", "Chemický název"]} rows={[
                  ["Na₂SO₄ · 10 H₂O", "Glauberova sůl", "dekahydrát síranu sodného"],
                  ["BaSO₄", "baryt", "síran barnatý"],
                  ["CaSO₄ · 2 H₂O", "sádrovec", "dihydrát síranu vápenatého"],
                  ["FeSO₄ · 7 H₂O", "zelená skalice", "heptahydrát síranu železnatého"],
                  ["CuSO₄ · 5 H₂O", "modrá skalice", "pentahydrát síranu měďnatého"],
                ]} />
                <p><b>Dále:</b> v menším množství v atmosféře jako <M>SO₂</M>, <M>SO₃</M>, <M>H₂S</M>; v meteoritech jako <M>FeS</M>; v zemním plynu a sopečných plynech. Síra je <K>biogenní prvek</K> — je součástí bílkovin (aminokyseliny cystein a methionin).</p>
              </Fold>

              <Fold title="2.6 · Reakce elementární síry" badge="ROVNICE">
                <Eq left="H₂ + S" right="H₂S" note="Síra zde působí jako oxidační činidlo (0 → −II)." />
                <Eq left="S + O₂" right="SO₂" note="Hoření síry — modrý plamen, vzniká bezbarvý štiplavý oxid siřičitý. Síra je redukční činidlo (0 → IV)." />
                <Eq left="Zn + S" right="ZnS" note="Sulfid zinečnatý — sfalerit." />
                <Eq left="Fe + S" right="FeS" note="Sulfid železnatý; slouží k přípravě sulfanu." />
                <W>Ve vyplněném klíči od paní profesorky je u hoření síry napsáno <M>2 S + 3 O₂ → 2 SO₃</M>. Navazující výpočet ale počítá s <M>M(SO₂) = 64 g/mol</M>, takže tam jde o SO₂. Základní a bezpečná odpověď je <b>S + O₂ → SO₂</b>; oxid sírový vzniká až následně katalyzovanou oxidací <M>2 SO₂ + O₂ → 2 SO₃</M>. Pokud se na to zeptá, můžeš zmínit obojí.</W>
              </Fold>
            </>
          )}

          {/* ═══════════ 03 · SLOUČENINY SÍRY ═══════════ */}
          {sec === "slouc-s" && (
            <>
              <h2><span className="hash">04</span>Sloučeniny síry</h2>
              <p className="lead">Od bezkyslíkatých (sulfan a sulfidy) přes oxidy až po kyseliny a jejich soli.</p>

              <Fold title="3.1 · Sulfan H₂S a jeho soli" badge="BEZKYSLÍKATÉ" open>
                <p><K>Sulfan</K> (dříve sirovodík) je <b>bezbarvý jedovatý plyn</b> se zápachem po zkažených vejcích.</p>
                <p><b>Tvar molekuly:</b> síra je dvojvazná a nese <b>dva volné elektronové páry</b>, takže molekula je <K>lomená</K> — stejný tvar jako u vody, jen s menším vazebným úhlem (~92° proti 104,5° u H₂O).</p>
                <p><b>Proč je sulfan za normálních podmínek plynný, zatímco voda je kapalná?</b> Mezi molekulami sulfanu <K>nevznikají vodíkové můstky</K> — síra má na to příliš nízkou elektronegativitu. Působí zde jen slabé van der Waalsovy síly, takže sulfan vře už při −60 °C. Vodu naproti tomu drží pohromadě síť vodíkových můstků.</p>
                <W>Past: sulfan má <b>větší</b> molární hmotnost než voda (34 vs. 18 g/mol), a přesto je plynný. O skupenství tedy nerozhoduje hmotnost molekuly, ale typ mezimolekulových sil.</W>
                <p><b>Příprava:</b></p>
                <Eq left="FeS + 2 HCl" right="FeCl₂ + H₂S" note="Silnější kyselina vytěsní slabší (sulfanovou) z její soli." hidden />
                <p><b>Vznik v přírodě:</b> sulfan vzniká <K>rozkladem (hnitím) bílkovin</K> — síra je v aminokyselinách cysteinu a methioninu. Proto páchnou zkažená vejce i bahno v rybnících.</p>
                <p><b>Vodný roztok</b> = slabá <K>dvojsytná kyselina sulfanová</K> (také sulfanová voda nebo sirovodíková kyselina). Protože je to <b>kyselina</b>, barví lakmus do <K>červena</K> — nikdy do modra. Odtud dvě řady solí:</p>
                <ul>
                  <li><K>sulfidy</K> — anion <M>S²⁻</M>; rozpustné jsou jen sulfidy I.A, II.A skupiny a <M>(NH₄)₂S</M></li>
                  <li><K>hydrogensulfidy</K> — anion <M>HS⁻</M>; ty jsou ve vodě rozpustné</li>
                </ul>
                <p><b>Redukční účinky:</b> síra má v sulfanu oxidační číslo <b>−II</b>, tedy své minimum — může se už jen oxidovat. Sulfan je proto <K>vždy redukční činidlo</K>.</p>
                <Eq left="2 H₂S + O₂" right="2 S + 2 H₂O" below="málo vzduchu" note="Nižší přístup vzduchu: síra se oxiduje jen na 0 a vylučuje se elementární." hidden />
                <Eq left="2 H₂S + 3 O₂" right="2 SO₂ + 2 H₂O" below="dostatek vzduchu" note="Vyšší přístup vzduchu: oxidace pokračuje až na oxidační číslo IV." hidden />
                <Eq left="H₂SO₄ + H₂S" right="S + SO₂ + 2 H₂O" note="Komproporcionace: síra z VI a z −II se potkají uprostřed." hidden />
              </Fold>

              <Fold title="3.2 · Oxid siřičitý SO₂" badge="NEJČASTĚJŠÍ OTÁZKA">
                <p><b>Vlastnosti:</b> <K>bezbarvý</K> štiplavý jedovatý plyn, <b>těžší než vzduch</b>, <b>nepodporuje hoření</b>. Má <K>bělicí a dezinfekční</K> účinky — proto včelaři sirným knotem dezinfikují úly a vinaři vinné sudy.</p>
                <p><b>Vznik a výroba:</b> hořením síry a jejích sloučenin <b>na vzduchu / v kyslíku</b>, v tepelných elektrárnách, pražením pyritu.</p>
                <Eq left="4 FeS₂ + 11 O₂" right="2 Fe₂O₃ + 8 SO₂" above="pražení" hidden />
                <Eq left="Na₂SO₃ + H₂SO₄" right="Na₂SO₄ + SO₂ + H₂O" note="Laboratorní příprava — vytěsnění z siřičitanu." hidden />
                <p><b>Redukční účinky</b> (S: IV → VI, běžné):</p>
                <Eq left="2 SO₂ + O₂" right="2 SO₃" above="kat. V₂O₅" rev hidden />
                <p><b>Oxidační účinky</b> (S: IV → 0, zřídka):</p>
                <Eq left="SO₂ + 2 H₂S" right="3 S + 2 H₂O" hidden />
                <Eq left="SO₂ + C" right="S + CO₂" hidden />
                <p><b>Rozpustnost:</b> ve vodě se rozpouští na kyselinu siřičitou.</p>
                <Eq left="SO₂ + H₂O" right="H₂SO₃" rev hidden />
                <p><b>Dopad na životní prostředí:</b> dráždí dýchací cesty, způsobuje <K>korozi</K> a je příčinou vzniku <K>kyselých dešťů</K>, které ničí zejména jehličnaté lesy a ohrožují lidské zdraví. Do atmosféry se dostává hlavně spalováním <b>hnědého uhlí</b>.</p>
              </Fold>

              <Fold title="3.3 · Oxid sírový SO₃" badge="OLEUM">
                <ul>
                  <li>Za normálních podmínek <b>pevná</b> látka; tvoří trimerní cyklické molekuly <M>(SO₃)₃ = S₃O₉</M>, vzhledem připomíná <b>led</b>.</li>
                  <li>Silné <K>oxidační účinky</K> — síra už je v maximálním oxidačním čísle VI, může se tedy jen redukovat.</li>
                </ul>
                <Eq left="2 SO₂ + O₂" right="2 SO₃" above="kat. V₂O₅" rev note="Kontaktní způsob výroby kyseliny sírové." />
                <Eq left="SO₃ + H₂O" right="H₂SO₄" note="Reakce je natolik bouřlivá, že se v praxi nepoužívá." hidden />
                <p>V koncentrované kyselině sírové se <M>SO₃</M> rozpouští na tzv. <K>oleum</K> (dýmavá kyselina sírová, <M>H₂S₂O₇</M>). Teprve oleum se pak opatrně ředí vodou na kyselinu sírovou.</p>
              </Fold>

              <Fold title="3.4 · Kyselina siřičitá H₂SO₃" badge="SLABÁ, NESTÁLÁ">
                <ul>
                  <li><b>Slabá</b>, <b>nestálá</b> (existuje jen v roztoku, rozkládá se zpět na SO₂ a H₂O), <b>dvojsytná</b>.</li>
                  <li>Síra má oxidační číslo <b>IV</b>.</li>
                  <li>Soli: <K>siřičitany</K> <M>SO₃²⁻</M> a <K>hydrogensiřičitany</K> <M>HSO₃⁻</M>.</li>
                  <li>Používá se (resp. její soli) jako konzervant a bělicí činidlo.</li>
                </ul>
                <Eq left="SO₂ + H₂O" right="H₂SO₃" rev />
              </Fold>

              <Fold title="3.5 · Kyselina sírová H₂SO₄ a reakce s kovy" badge="JÁDRO TESTU">
                <p><b>Vlastnosti:</b> silná dvojsytná kyselina, <K>žíravina</K> (poškozuje tkáně), <K>hygroskopická</K> — odnímá látkám vodu (cukr po jejím přilití zuhelnatí), má <K>oxidační účinky</K>.</p>
                <p><b>Anionty:</b> <M>SO₄²⁻</M> síranový a <M>HSO₄⁻</M> hydrogensíranový.</p>
                <p><b>Dehydratační účinky:</b> koncentrovaná kyselina odnímá látkám vodu. U glukosy zbude čistý uhlík — známý pokus, kdy z kádinky s cukrem vyleze černý porézní „sloup“:</p>
                <Eq left="C₆H₁₂O₆" right="6 C + 6 H₂O" above="H₂SO₄" note="Vzorec glukosy se dá číst jako 6 C · 6 H₂O — uhlík „obalený“ vodou. Kyselina se nespotřebuje, proto se píše nad šipku." hidden />
                <p><b>Porovnání síly s kyselinou siřičitou:</b> <K>H₂SO₄ je silnější</K>. Síra v ní má vyšší oxidační číslo (VI proti IV) a je obklopena více atomy kyslíku, které odtahují elektronovou hustotu od vazby O–H — vodík se tedy odštěpí snáz.</p>
                <W>Ředění: <b>vždy lijeme kyselinu do vody</b>, nikdy naopak. Rozpouštění uvolňuje velké množství tepla a voda by se rozstříkla.</W>

                <p style={{ marginTop: 18 }}><b>Zředěná H₂SO₄ (aq)</b> — nemá oxidační účinky. Reaguje jen s <b>neušlechtilými</b> kovy (ty, které stojí v Beketovově řadě před vodíkem) a vytěsňuje z nich vodík:</p>
                <Eq left="Zn + H₂SO₄ (aq)" right="ZnSO₄ + H₂" hidden />
                <Eq left="Fe + H₂SO₄ (aq)" right="FeSO₄ + H₂" hidden />
                <Eq left="Cu + H₂SO₄ (aq)" right="nereaguje" note="Měď je ušlechtilý kov, stojí za vodíkem — nemá čím ho vytěsnit." hidden />

                <p style={{ marginTop: 18 }}><b>Koncentrovaná H₂SO₄ (l)</b> — má oxidační účinky, <b>sama se redukuje</b> (na SO₂) a reaguje proto i s některými <b>ušlechtilými</b> kovy (Cu, Ag, Hg):</p>
                <Eq left="Cu + 2 H₂SO₄ (l)" right="CuSO₄ + SO₂ + 2 H₂O" hidden />
                <Eq left="Fe + H₂SO₄ (l)" right="pasivace" note="Vytvoří se ochranná vrstvička, reakce se zastaví." hidden />
                <Eq left="Pb + H₂SO₄ (l)" right="pasivace" note="Díky pasivaci lze koncentrovanou kyselinu sírovou převážet v ocelových cisternách." hidden />
                <p><b>Zlato</b> se nerozpouští ani v koncentrované H₂SO₄ — pouze v <K>lučavce královské</K>, což je směs <b>3 díly HCl : 1 díl HNO₃</b>.</p>
              </Fold>

              <Fold title="3.6 · Sírany a další soli" badge="PRAXE">
                <ul>
                  <li><M>BaSO₄</M> — <b>RTG kontrastní látka</b> („barnatá kaše“). Funguje proto, že je <b>nerozpustný ve vodě</b>, takže se z něj baryum do těla nedostane.</li>
                  <li><M>BaCl₂</M> chlorid barnatý a <M>Ba(NO₃)₂</M> dusičnan barnatý jsou naopak <b>rozpustné, a tedy jedovaté</b>.</li>
                  <li><M>CaSO₄ · 2 H₂O</M> sádrovec — výroba sádry. <M>Na₂SO₄ · 10 H₂O</M> Glauberova sůl.</li>
                  <li>Důkaz síranů: <M>BaCl₂</M> → vypadne bílá sraženina <M>BaSO₄</M>.</li>
                </ul>
              </Fold>

              <Fold title="3.7 · Oxokyseliny síry — thio-, peroxo-, di-" badge="NÁZVOSLOVÍ">
                <p>Síra tvoří mimořádně pestrou škálu oxokyselin. Umožňují to tři věci: síra se <b>bez problémů řetězí</b>, kyslík <M>=O</M> může být nahrazen sírou (vznikají <K>thiokyseliny</K>) a skupina <M>−O−</M> může být nahrazena <M>−O−O−</M> (vznikají <K>peroxokyseliny</K>).</p>
                <Tab mono head={["Vzorec", "Název", "Jak vznikne"]} rows={[
                  ["H₂SO₃", "kyselina siřičitá", "základ, S má IV"],
                  ["H₂SO₄", "kyselina sírová", "základ, S má VI"],
                  ["H₂S₂O₅", "kyselina disiřičitá", "2 × H₂SO₃ − H₂O"],
                  ["H₂S₂O₇", "kyselina disírová", "2 × H₂SO₄ − H₂O (je v oleu)"],
                  ["H₂S₂O₃", "kyselina thiosírová", "v H₂SO₄ je jeden =O nahrazen =S"],
                  ["H₂SO₅", "kyselina peroxosírová", "v H₂SO₄ je −O− nahrazeno −O−O−"],
                  ["H₂S₂O₈", "kyselina peroxodisírová", "disírová s peroxoskupinou"],
                ]} />
                <W>Počítání kyslíků u <b>di-</b> kyselin: spoj dvě molekuly a <b>odečti jednu vodu</b>. 2 × H₂SO₄ = H₄S₂O₈, minus H₂O → <M>H₂S₂O₇</M>.</W>
              </Fold>
            </>
          )}

          {/* ═══════════ 04 · HALOGENY ═══════════ */}
          {sec === "halogeny" && (
            <>
              <h2><span className="hash">05</span>Halogeny — VII.A skupina</h2>
              <p className="lead">Nejreaktivnější nekovy periodické tabulky. Prezentace končí třemi nevyplněnými snímky — ty najdeš v oddílu <K>Sloučeniny halogenů</K>.</p>

              <Fold title="4.1 · Charakteristika skupiny" badge="ZÁKLAD" open>
                <p><K>Halogeny</K> = <b>solitvorné prvky</b>, z řec. <K>hals</K> = sůl a <K>gennao</K> = tvořím. S kovy totiž tvoří soli — halogenidy.</p>
                <ul>
                  <li>Patří sem <M>F, Cl, Br, I</M> a radioaktivní <M>At</M> — skupina <b>VII.A</b>.</li>
                  <li>Valenční konfigurace <M>ns² np⁵</M> — 7 valenčních elektronů, do oktetu chybí <b>jediný</b>. Proto jsou <b>velmi reaktivní</b>.</li>
                  <li>Jsou to <b>nekovy</b>, tvoří dvouatomové molekuly <M>X₂</M> s nepolární kovalentní vazbou.</li>
                  <li>Oxidační čísla: fluor <b>vždy −I</b>; ostatní <M>−I, I, III, V, VII</M>.</li>
                </ul>
                <Tab head={["Prvek", "Skupenství za n.p.", "Barva", "Zvláštnost"]} rows={[
                  ["fluor F₂", "plyn", "nazelenalý", "nejsilnější oxidační činidlo ze všech prvků"],
                  ["chlor Cl₂", "plyn", "žlutozelený", "bojová látka za 1. sv. války, dezinfekce vody"],
                  ["brom Br₂", "kapalina", "červenohnědý", "jediný nekovový prvek kapalný za n.p."],
                  ["jod I₂", "pevná látka", "fialový", "sublimuje — fialové páry"],
                ]} />
                <p><b>Proč se mění skupenství?</b> Ve všech případech jde o <K>molekulové krystaly</K> — v mřížce sedí celé molekuly <M>X₂</M>, které drží jen slabé <K>van der Waalsovy síly</K>. S rostoucí velikostí molekuly tyto síly rostou, proto F₂ a Cl₂ plyny, Br₂ kapalina a I₂ pevná látka. U jodu stačí málo energie a krystal se rozpadne rovnou na páry — <b>sublimuje</b>.</p>
                <W>Jod tvoří <b>molekulový</b>, nikoli atomový krystal. Atomový (kovalentní) krystal je třeba diamant — ten má naopak extrémně vysokou teplotu tání.</W>
                <p><b>Trend:</b> s rostoucím protonovým číslem roste atomový poloměr a klesá elektronegativita, takže <K>oxidační účinky klesají</K>:</p>
                <div className="eq"><div className="eq-row"><span className="eq-l">F₂ &gt; Cl₂ &gt; Br₂ &gt; I₂</span><span className="eq-r">oxidační účinky klesají s rostoucím Z</span></div></div>
              </Fold>

              <Fold title="4.2 · Výskyt" badge="MINERÁLY">
                <p>Halogeny jsou tak reaktivní, že <K>příroda nezná elementární halogeny X₂</K>. Najdeme je výhradně vázané — nejčastěji jako halogenidové anionty <M>X⁻</M>.</p>
                <Tab mono head={["Vzorec", "Minerál"]} rows={[
                  ["CaF₂", "fluorit (kazivec)"],
                  ["NaCl", "halit — kamenná sůl"],
                  ["Na₃AlF₆", "kryolit"],
                  ["KCl", "sylvín"],
                ]} />
                <ul>
                  <li><b>Mořská voda</b> — nejhojnější zdroj halogenidových aniontů.</li>
                  <li><b>Fluor</b> v kostech a zubní sklovině (proto fluoridy v zubních pastách).</li>
                  <li><b>Jod</b> v chaluhách a mořských řasách; v těle je součástí <K>thyroxinu</K>, hormonu štítné žlázy. Jeho nedostatek způsobuje <b>strumu</b> (zvětšení štítné žlázy), proto se kuchyňská sůl <b>jodizuje</b> (přidává se KI nebo KIO₃).</li>
                </ul>
              </Fold>

              <Fold title="4.3 · Stabilizace — jak halogen dosáhne oktetu" badge="TEORIE VAZBY">
                <p>Halogenu chybí do oktetu jeden elektron. Získat ho může dvěma způsoby:</p>
                <ul>
                  <li><K>Kovalentní vazba</K> — sdílení elektronového páru s dalším atomem. Tak vzniká molekula <M>X₂</M> (nepolární) nebo <M>HX</M> a kovalentní halogenidy (polární).</li>
                  <li><K>Halogenidový anion X⁻</K> — halogen elektron úplně přijme a stane se z něj jednomocný anion. Tak vznikají iontové halogenidy typu <M>NaCl</M>.</li>
                </ul>
              </Fold>

              <Fold title="4.4 · Příprava a výroba halogenů" badge="POZOR NA FLUOR">
                <p><b>Elektrolýza</b> — hlavní průmyslová cesta:</p>
                <ul>
                  <li>elektrolýza <b>taveniny</b> — <M>F₂</M> z KHF₂ v bezvodém HF; <M>Cl₂</M> z taveniny NaCl</li>
                  <li>elektrolýza <b>vodného roztoku</b> — <M>Cl₂</M> ze solanky (nasyceného roztoku NaCl)</li>
                </ul>
                <p><b>Oxidace halogenidů a halogenovodíků</b> — laboratorní příprava chloru:</p>
                <Eq left="MnO₂ + 4 HCl" right="MnCl₂ + Cl₂ + 2 H₂O" hidden />
                <Box tone="warn" className="">
                  <div className="bx-h bx-h--w">??? Je možné touto cestou připravit fluor ???</div>
                  <p style={{ margin: 0 }}>
                    <b>Ne.</b> Oxidace <M>X⁻</M> na <M>X₂</M> vyžaduje činidlo silnější, než je sám halogen. Fluor je ale
                    <K> nejsilnější oxidační činidlo ze všech prvků</K> — neexistuje látka, která by ho zoxidovala.
                    Proto se <M>F₂</M> vyrábí <b>výhradně elektrolýzou</b>.
                  </p>
                </Box>
                <p style={{ marginTop: 16 }}><b>Vytěsňování — reakce halogenů s halogenidy:</b> silnější halogen (s nižším Z) vytěsní slabší z jeho soli.</p>
                <Eq left="Cl₂ + 2 KBr" right="2 KCl + Br₂" hidden />
                <Eq left="Br₂ + 2 KI" right="2 KBr + I₂" hidden />
                <Eq left="I₂ + 2 KCl" right="nereaguje" note="Jod je slabší oxidační činidlo než chlor, takže ho z chloridu nevytěsní." hidden />
              </Fold>
            </>
          )}

          {/* ═══════════ 05 · SLOUČENINY HALOGENŮ ═══════════ */}
          {sec === "slouc-x" && (
            <>
              <h2><span className="hash">06</span>Sloučeniny halogenů</h2>
              <p className="lead">
                Poslední tři snímky prezentace (Příprava halogenidů, Interhalogeny, Kyslíkaté sloučeniny) jsou prázdné —
                doplňovaly se v hodině. Tady je jejich obsah doplněný.
              </p>

              <Fold title="5.1 · Halogenovodíky HX" badge="KYSELINY" open>
                <p><b>Příprava:</b></p>
                <Eq left="H₂ + Cl₂" right="2 HCl" above="světlo" note="Přímá syntéza z prvků; na přímém světle probíhá explozivně (chlorovodíkový třaskavý plyn)." hidden />
                <Eq left="2 NaCl + H₂SO₄" right="Na₂SO₄ + 2 HCl" above="Δ" note="Vytěsnění silnou netěkavou kyselinou z halogenidu." hidden />
                <p><b>Vlastnosti:</b> bezbarvé plyny <b>pronikavého zápachu</b>, velmi dobře rozpustné ve vodě — vzniklé roztoky jsou kyseliny (např. <M>HCl (aq)</M> = kyselina chlorovodíková neboli solná).</p>
                <div className="eq"><div className="eq-row"><span className="eq-l">HF &lt; HCl &lt; HBr &lt; HI</span><span className="eq-r">síla kyseliny roste</span></div></div>
                <p>Směrem dolů se vazba <M>H–X</M> prodlužuje a slábne, takže se vodík odštěpuje snáz.</p>
                <W><b>HF je jako jediný halogenovodík slabá kyselina</b> — vazba H–F je krátká a pevná a navíc mezi molekulami působí vodíkové můstky. Nenech se zmást tím, že fluor je nejelektronegativnější.</W>
                <p><b>Význam:</b></p>
                <ul>
                  <li><K>HF leptá sklo</K> — jediná běžná kyselina, která reaguje s oxidem křemičitým. Skladuje se proto v plastových nádobách.</li>
                </ul>
                <Eq left="SiO₂ + 4 HF" right="SiF₄ + 2 H₂O" hidden />
                <ul>
                  <li><K>HCl v žaludku</K> — koncentrace <b>0,3–0,4 %</b>, <b>pH 1–3</b>. Aktivuje <b>pepsin</b>, <b>denaturuje bílkoviny</b> (rozbalí je, aby je enzym mohl štěpit) a <b>ničí mikroorganismy</b> z potravy.</li>
                </ul>
              </Fold>

              <Fold title="5.2 · Halogenidy — tři typy" badge="DOPLNĚNÝ SNÍMEK">
                <p><K>Halogenidy</K> jsou sloučeniny halogenu s prvkem o <b>nižší elektronegativitě</b>. Halogen v nich má oxidační číslo <b>−I</b>.</p>
                <Tab head={["Typ", "Vlastnosti", "Příklady"]} rows={[
                  ["Iontové", "s kovy I.A a II.A; vysoké teploty tání a varu, iontové krystaly, vodné roztoky a taveniny jsou ELEKTRICKY VODIVÉ", "NaCl, KBr, CaF₂, KI"],
                  ["Kovalentní (molekulové)", "s nekovy; nízké teploty tání, těkavé, s vodou nereagují (nebo hydrolyzují)", "CCl₄, SF₆, PCl₃, BCl₃"],
                  ["Polymerní", "atomy propojené do řetězců nebo vrstev; vlastnosti mezi oběma předchozími", "PdCl₂, BeCl₂, AlCl₃ (dimer Al₂Cl₆)"],
                ]} />
                <p><b>Příprava halogenidů</b> (prázdný snímek z prezentace):</p>
                <Eq left="2 Na + Cl₂" right="2 NaCl" note="1) Přímá syntéza z prvků." hidden />
                <Eq left="Zn + 2 HCl" right="ZnCl₂ + H₂" note="2) Reakce neušlechtilého kovu s halogenovodíkovou kyselinou." hidden />
                <Eq left="NaOH + HCl" right="NaCl + H₂O" note="3) Neutralizace." hidden />
                <Eq left="AgNO₃ + NaCl" right="AgCl↓ + NaNO₃" note="4) Srážecí reakce — zároveň důkaz halogenidů." hidden />
                <p><b>Důkaz halogenidů dusičnanem stříbrným:</b> <M>AgCl</M> bílá sraženina · <M>AgBr</M> nažloutlá · <M>AgI</M> žlutá. <M>AgF</M> je jako jediný rozpustný.</p>
              </Fold>

              <Fold title="5.3 · Praktické využití halogenů" badge="ZNÁT NAZPAMĚŤ">
                <Tab head={["Látka", "Složení", "K čemu"]} rows={[
                  ["jodová tinktura", "5% roztok jodu v ethanolu", "dezinfekce ran; ve vodě je jod prakticky nerozpustný, proto líh"],
                  ["chlorové vápno", "směs CaCl₂ a Ca(ClO)₂", "dezinfekce; vzniká zaváděním chloru do hašeného vápna"],
                  ["SAVO", "NaClO — chlornan sodný", "bělení a dezinfekce v domácnosti"],
                  ["chlorová voda", "Cl₂ + H₂O ⇄ HCl + HClO", "chlorace pitné vody a bazénů"],
                  ["fluoridy", "NaF, SnF₂", "zubní pasty — zpevňují sklovinu"],
                  ["kyselina solná", "HCl (aq)", "žaludeční šťáva 0,3–0,4 %, pH 1–3"],
                ]} />
                <W>Nepleť si <b>chlorové vápno</b> (chlorid a chlornan <b>vápenatý</b>) se <b>SAVEM</b> (chlornan <b>sodný</b>). V testu to bývá vedle sebe jako dvě možnosti.</W>
                <p><b>Toxicita chloru:</b> <M>Cl₂</M> je jedovatý — leptá dýchací cesty a může vyvolat <K>edém (otok) plic</K>. Za 1. světové války se proto použil jako bojová látka.</p>
              </Fold>

              <Fold title="5.4 · Interhalogeny" badge="DOPLNĚNÝ SNÍMEK">
                <p><K>Interhalogeny</K> jsou sloučeniny <b>dvou různých halogenů</b> obecného typu <M>XYₙ</M>, kde n = 1, 3, 5, 7.</p>
                <ul>
                  <li>Centrálním atomem je <b>těžší</b> (méně elektronegativní) halogen a má <b>kladné</b> oxidační číslo.</li>
                  <li>Ligandem je <b>lehčí</b> (elektronegativnější) halogen s oxidačním číslem <b>−I</b>.</li>
                  <li>Čím větší je rozdíl poloměrů obou halogenů, tím vyšší n může vzniknout — proto existuje <M>IF₇</M>, ale ne „ClF₇“.</li>
                </ul>
                <Tab mono head={["Typ", "Příklad", "Název"]} rows={[
                  ["XY", "ClF", "fluorid chlorný"],
                  ["XY₃", "BrF₃", "fluorid bromitý"],
                  ["XY₅", "IF₅", "fluorid jodičný"],
                  ["XY₇", "IF₇", "fluorid jodistý"],
                ]} />
                <p>Jsou <b>velmi reaktivní</b>, působí jako silná oxidační a fluorační činidla a s vodou <b>hydrolyzují</b>.</p>
              </Fold>

              <Fold title="5.5 · Kyslíkaté sloučeniny halogenů" badge="DOPLNĚNÝ SNÍMEK">
                <p>Kyslík je elektronegativnější než Cl, Br a I, takže v jejich kyslíkatých sloučeninách má halogen <K>kladné oxidační číslo</K>.</p>
                <W>U fluoru to <b>neplatí</b> — fluor je elektronegativnější než kyslík, takže <M>OF₂</M> není „oxid fluoritý“, ale <b>fluorid kyslíku</b>. Oxidy fluoru neexistují.</W>
                <p><b>Oxokyseliny chloru</b> — umět nazpaměť celou tabulku:</p>
                <Tab mono head={["Vzorec", "Ox. číslo Cl", "Název kyseliny", "Název soli"]} rows={[
                  ["HClO", "I", "chlorná", "chlornany ClO⁻"],
                  ["HClO₂", "III", "chloritá", "chloritany ClO₂⁻"],
                  ["HClO₃", "V", "chlorečná", "chlorečnany ClO₃⁻"],
                  ["HClO₄", "VII", "chloristá", "chloristany ClO₄⁻"],
                ]} />
                <div className="grid2">
                  <Box tone="acc">
                    <div className="bx-h">Roste s oxidačním číslem</div>
                    <ul style={{ paddingLeft: 20, margin: 0 }}>
                      <li>síla kyseliny (HClO₄ je jedna z nejsilnějších vůbec)</li>
                      <li>stálost</li>
                    </ul>
                  </Box>
                  <Box tone="v">
                    <div className="bx-h bx-h--v">Klesá s oxidačním číslem</div>
                    <ul style={{ paddingLeft: 20, margin: 0 }}>
                      <li>oxidační účinky (nejsilnější oxidovadlo je HClO)</li>
                    </ul>
                  </Box>
                </div>
                <p style={{ marginTop: 16 }}><b>Reakce chloru s vodou a hydroxidem</b> — ve všech jde o <K>disproporcionaci</K>: z chloru s oxidačním číslem 0 vzniká zároveň −I i kladné:</p>
                <Eq left="Cl₂ + H₂O" right="HCl + HClO" rev note="Chlorová voda. HClO uvolňuje atomární kyslík → dezinfekce pitné vody a bazénů, bělicí účinky." hidden />
                <Eq left="Cl₂ + 2 NaOH" right="NaCl + NaClO + H₂O" below="za studena" note="NaClO = chlornan sodný, účinná látka SAVA." hidden />
                <Eq left="3 Cl₂ + 6 NaOH" right="5 NaCl + NaClO₃ + 3 H₂O" below="za horka" hidden />
                <p><b>Oxidy chloru:</b> <M>Cl₂O</M> (oxid chlorný), <M>ClO₂</M> (oxid chloričitý — bělení papíru), <M>Cl₂O₇</M> (oxid chloristý). Všechny jsou nestálé až výbušné.</p>
              </Fold>
            </>
          )}

          {/* ═══════════ 06 · ROVNICE ═══════════ */}
          {sec === "rovnice" && (
            <>
              <h2><span className="hash">07</span>Rovnice — zkus si doplnit pravou stranu</h2>
              <p className="lead">
                U každé rovnice je pravá strana skrytá. Nejdřív si ji zkus napsat na papír, pak klikni na
                <b> „? odhalit pravou stranu“</b>. Zvlášť si hlídej <K>vyčíslení</K> — to je v testu polovina bodů.
              </p>

              <Box tone="acc">
                <div className="bx-h">Jak vyčíslit rovnici, když nevíš kudy</div>
                <ol style={{ paddingLeft: 20, margin: 0 }}>
                  <li>Začni prvkem, který je jen v jedné látce na každé straně (obvykle kov nebo síra).</li>
                  <li>Kyslík a vodík nech <b>nakonec</b> — bývají ve více látkách.</li>
                  <li>Vyjde-li lichý počet kyslíků proti sudému, vynásob celou látku dvěma a dopočítej zbytek.</li>
                  <li>Nakonec přepočítej <b>každý</b> prvek na obou stranách.</li>
                </ol>
              </Box>

              <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, marginTop: 24, marginBottom: 0, color: "#2ee6a8" }}>Síra a její sloučeniny</h3>
              <Eq left="S + O₂" right="SO₂" note="Hoření síry." hidden />
              <Eq left="H₂ + S" right="H₂S" hidden />
              <Eq left="Fe + S" right="FeS" hidden />
              <Eq left="FeS + 2 HCl" right="FeCl₂ + H₂S" note="Příprava sulfanu." hidden />
              <Eq left="2 H₂S + O₂" right="2 S + 2 H₂O" below="málo vzduchu" hidden />
              <Eq left="2 H₂S + 3 O₂" right="2 SO₂ + 2 H₂O" below="dostatek vzduchu" hidden />
              <Eq left="H₂SO₄ + H₂S" right="S + SO₂ + 2 H₂O" hidden />
              <Eq left="4 FeS₂ + 11 O₂" right="2 Fe₂O₃ + 8 SO₂" above="pražení pyritu" hidden />
              <Eq left="Na₂SO₃ + H₂SO₄" right="Na₂SO₄ + SO₂ + H₂O" note="Příprava SO₂." hidden />
              <Eq left="2 SO₂ + O₂" right="2 SO₃" above="kat. V₂O₅" rev note="SO₂ jako redukční činidlo." hidden />
              <Eq left="SO₂ + 2 H₂S" right="3 S + 2 H₂O" note="SO₂ jako oxidační činidlo." hidden />
              <Eq left="SO₂ + C" right="S + CO₂" note="SO₂ jako oxidační činidlo." hidden />
              <Eq left="SO₂ + H₂O" right="H₂SO₃" rev hidden />
              <Eq left="SO₃ + H₂O" right="H₂SO₄" hidden />

              <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, marginTop: 24, marginBottom: 0, color: "#2ee6a8" }}>Kovy a kyselina sírová (Beketovova řada)</h3>
              <Eq left="Zn + H₂SO₄ (aq)" right="ZnSO₄ + H₂" hidden />
              <Eq left="Fe + H₂SO₄ (aq)" right="FeSO₄ + H₂" hidden />
              <Eq left="Fe + H₂SO₄ (l)" right="pasivace — nereaguje" hidden />
              <Eq left="Pb + H₂SO₄ (l)" right="pasivace — nereaguje" hidden />
              <Eq left="Cu + H₂SO₄ (aq)" right="nereaguje" hidden />
              <Eq left="Cu + 2 H₂SO₄ (l)" right="CuSO₄ + SO₂ + 2 H₂O" hidden />

              <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, marginTop: 24, marginBottom: 0, color: "#b06cf0" }}>Halogeny a jejich sloučeniny</h3>
              <Eq left="H₂ + Cl₂" right="2 HCl" above="světlo" hidden />
              <Eq left="2 Na + Cl₂" right="2 NaCl" hidden />
              <Eq left="MnO₂ + 4 HCl" right="MnCl₂ + Cl₂ + 2 H₂O" note="Laboratorní příprava chloru oxidací." hidden />
              <Eq left="2 NaCl + H₂SO₄" right="Na₂SO₄ + 2 HCl" above="Δ" hidden />
              <Eq left="Cl₂ + 2 KBr" right="2 KCl + Br₂" note="Vytěsnění slabšího halogenu." hidden />
              <Eq left="Br₂ + 2 KI" right="2 KBr + I₂" hidden />
              <Eq left="SiO₂ + 4 HF" right="SiF₄ + 2 H₂O" note="Leptání skla." hidden />
              <Eq left="AgNO₃ + NaCl" right="AgCl↓ + NaNO₃" note="Důkaz chloridů." hidden />
              <Eq left="Cl₂ + H₂O" right="HCl + HClO" rev note="Chlorová voda — disproporcionace." hidden />
              <Eq left="Cl₂ + 2 NaOH" right="NaCl + NaClO + H₂O" below="za studena" hidden />
              <Eq left="3 Cl₂ + 6 NaOH" right="5 NaCl + NaClO₃ + 3 H₂O" below="za horka" hidden />
            </>
          )}

          {/* ═══════════ 07 · ŘEŠENÉ PŘÍKLADY ═══════════ */}
          {sec === "priklady" && (
            <>
              <h2><span className="hash">08</span>Řešené příklady z pracovních listů</h2>
              <p className="lead">
                Všechny úlohy pocházejí z obou pracovních listů. <b>Řešení je vždy skryté</b> — nejdřív si to zkus sám,
                teprve pak odhal.
              </p>

              <Problem
                n="01" dif="easy" title="Konfigurace síry a odvození vazností"
                zadani={<>Zapiš elektronovou konfiguraci ₁₆S, odvoď obecný zápis konfigurace prvků VI.A skupiny a pomocí excitace urči, jakých vazností může síra dosáhnout.</>}
                given={<>Protonové číslo síry je 16. Nejbližší předcházející vzácný plyn je neon (Z = 10), takže zbývá rozmístit 6 elektronů do 3. slupky.</>}
                vztah={<>Vaznost = počet nespárovaných elektronů. Excitace je možná jen tehdy, má-li atom v dané vrstvě volné orbitaly (u 3. periody jsou to orbitaly <M>3d</M>).</>}
                kroky={[
                  <>Základní stav: <M>₁₆S: [Ne] 3s² 3p⁴</M>. V 3p jsou tři orbitaly: jeden zaplněný párem a dva s jedním elektronem → <b>2 nespárované</b> → <b>vaznost II</b>.</>,
                  <>Obecný zápis pro celou VI.A skupinu: <M>ns² np⁴</M>.</>,
                  <>1. excitace — jeden elektron z páru v 3p přeskočí do 3d: <M>[Ne] 3s² 3p³ 3d¹</M> → <b>4 nespárované</b> → <b>vaznost IV</b>.</>,
                  <>2. excitace — navíc přeskočí jeden elektron z 3s: <M>[Ne] 3s¹ 3p³ 3d²</M> → <b>6 nespárovaných</b> → <b>vaznost VI</b>.</>,
                  <>Příklady podle vaznosti: II → sulfan <M>H₂S</M> · IV → oxid siřičitý <M>SO₂</M> · VI → kyselina sírová <M>H₂SO₄</M>.</>,
                ]}
                vysledek="Vaznosti II, IV a VI (obecně ns² np⁴)"
              />

              <Problem
                n="02" dif="easy" title="Proč nejsou molekuly S₈ rovinné?"
                zadani={<>Vysvětli, proč molekuly síry S₈ nejsou rovinné. Co způsobuje, že jsou atomy střídavě vždy nad a pod rovinou kruhu?</>}
                given={<>Síra je v S₈ vázána ke dvěma sousedním atomům, je tedy dvojvazná. Má 6 valenčních elektronů.</>}
                vztah={<>Teorie VSEPR: elektronové páry kolem atomu se rozmisťují tak, aby byly co nejdál od sebe. <b>Volné páry se odpuzují silněji</b> než vazebné.</>}
                kroky={[
                  <>Ze 6 valenčních elektronů síry jsou 2 zapojeny do vazeb, zbývají 4 — tedy <b>dva volné elektronové páry</b> na každém atomu.</>,
                  <>Kolem atomu jsou tak celkem 4 elektronové páry (2 vazebné + 2 volné) → základní uspořádání je tetraedrické.</>,
                  <>Odpuzování volných párů stlačuje vazebný úhel S–S–S přibližně na <b>108°</b>, místo 180°, které by rovinný kruh vyžadoval.</>,
                  <>Osmičlenný kruh se proto nemůže „narovnat“ a zvlní se do tvaru <b>koruny</b> — atomy leží střídavě nad a pod rovinou.</>,
                ]}
                vysledek="Dva volné elektronové páry na každém atomu síry"
              />

              <Problem
                n="03" dif="hard" title="Kolik síry smíme spálit v místnosti? (výpočet z PL)"
                zadani={<>
                  Maximální průměrná 24hodinová koncentrace <M>SO₂</M> nesmí překročit <b>150 g/m³</b>.
                  Kolik gramů síry můžeme spálit v uzavřené místnosti o rozměrech <b>3 × 5 × 3,5 m</b>, abychom této podmínce vyhověli?
                </>}
                extra={<NumCheck answer={3937.5} unit="g síry" hint="Tedy zhruba 3,94 kg." />}
                given={<>Rozměry místnosti 3 m × 5 m × 3,5 m · limit koncentrace <M>c = 150 g/m³</M> · <M>M(S) = 32 g/mol</M>, <M>M(SO₂) = 64 g/mol</M>.</>}
                vztah={<>Objem kvádru <M>V = a · b · c</M>, hmotnost z koncentrace <M>m = c · V</M>, přepočet mezi látkami přes <b>poměr molárních hmotností</b> podle rovnice <M>S + O₂ → SO₂</M> (poměr 1 : 1).</>}
                kroky={[
                  <>Objem místnosti: <M>V = 3 · 5 · 3,5 = 52,5 m³</M>.</>,
                  <>Maximální hmotnost SO₂ v místnosti: <M>m(SO₂) = 150 · 52,5 = 7 875 g</M>.</>,
                  <>Z rovnice <M>S + O₂ → SO₂</M> plyne, že z <b>1 molu</b> síry vznikne <b>1 mol</b> SO₂, tedy z 32 g síry vznikne 64 g SO₂.</>,
                  <>Trojčlenka: 32 g S … 64 g SO₂ &nbsp;|&nbsp; x g S … 7 875 g SO₂.</>,
                  <><M>x = 7 875 · 32 / 64 = 3 937,5 g</M>.</>,
                  <>Zkouška smyslu: hmotnost síry musí být <b>poloviční</b> oproti SO₂, protože kyslík tvoří přesně polovinu hmotnosti molekuly SO₂. 7 875 / 2 = 3 937,5 ✓</>,
                  <><b>Poznámka k jednotkám:</b> v zadání je limit napsaný jako <M>150 g/m³</M> a klíč s ním počítá. Skutečný hygienický limit pro SO₂ je ale <M>150 µg/m³</M> — kdyby v testu byly mikrogramy, vyjde výsledek milionkrát menší, tedy <M>3,9375 · 10⁻³ g</M>. Postup je v obou případech stejný.</>,
                ]}
                vysledek="m(S) = 3 937,5 g ≈ 3,94 kg"
              />

              <Problem
                n="04" dif="medium" title="Hoření sulfanu — vyčíslení a určení činidla"
                zadani={<>
                  Vyčísli obě rovnice a rozhodni, která vyjadřuje hoření sulfanu při <b>nižším</b> a která při <b>vyšším</b> přístupu vzduchu.
                  Urči také, zda je sulfan v těchto reakcích oxidačním, nebo redukčním činidlem.
                  <div style={{ marginTop: 10 }}><M>H₂S + O₂ → S + H₂O</M><br /><M>H₂S + O₂ → SO₂ + H₂O</M></div>
                </>}
                given={<>Síra má v <M>H₂S</M> oxidační číslo <b>−II</b>, v elementární síře <b>0</b> a v <M>SO₂</M> <b>IV</b>.</>}
                vztah={<>Vyčíslení: sleduj nejdřív síru, pak vodík, nakonec kyslík. Činidlo: látka, která se <b>oxiduje</b> (její oxidační číslo roste), je <b>redukční</b> činidlo.</>}
                kroky={[
                  <>První rovnice — síra i vodík sedí po vynásobení dvěma: <M>2 H₂S + O₂ → 2 S + 2 H₂O</M>. Kontrola kyslíku: vlevo 2, vpravo 2 ✓</>,
                  <>Druhá rovnice — vlevo 2 H₂S dá 2 SO₂ a 2 H₂O; kyslíku je vpravo 2·2 + 2 = 6, tedy vlevo 3 O₂: <M>2 H₂S + 3 O₂ → 2 SO₂ + 2 H₂O</M> ✓</>,
                  <>První rovnice spotřebuje <b>1 O₂</b> na 2 molekuly sulfanu, druhá <b>3 O₂</b> → první odpovídá <b>nižšímu</b> přístupu vzduchu, druhá <b>vyššímu</b>.</>,
                  <>Oxidační číslo síry roste v obou případech (−II → 0, resp. −II → IV), sulfan se tedy <b>oxiduje</b>.</>,
                  <>Jinak to ani nejde: −II je pro síru minimum, takže sulfan nemůže být nikdy oxidačním činidlem.</>,
                ]}
                vysledek="2 H₂S + O₂ → 2 S + 2 H₂O (málo vzduchu) · 2 H₂S + 3 O₂ → 2 SO₂ + 2 H₂O (hodně vzduchu) · sulfan je vždy redukční činidlo"
              />

              <Problem
                n="05" dif="medium" title="Opravte text o oxidu siřičitém"
                zadani={<>
                  V následujícím textu je pět chyb. Najdi je a oprav:
                  <div style={{ marginTop: 10, fontStyle: "italic", color: "#a6b2c2", lineHeight: 1.8 }}>
                    „Oxid siřičitý je žlutozelený plyn štiplavého zápachu, který má bělící a dezinfekční účinky.
                    Proto včelaři a vinaři využívají sirný knot při dezinfekci úlů a vinných sudů.
                    Vzniká hořením síry na vzduchu nebo v atmosféře dusíku, vyrábí se spalováním pyritu.
                    Používá se při výrobě kyseliny sírové, na druhé straně má pozitivní dopad na životní prostředí.
                    Do atmosféry se dostává spalováním hnědého uhlí a je příčinou vzniku zásaditých dešťů,
                    které ničí zejména jehličnaté lesy a ohrožují lidské zdraví.“
                  </div>
                </>}
                given={<>Vlastnosti SO₂: bezbarvý, štiplavý, jedovatý, těžší než vzduch, nepodporuje hoření, bělicí a dezinfekční účinky.</>}
                vztah={<>Projdi text větu po větě a u každého přídavného jména a každého plynu si polož otázku, jestli to sedí s tím, co víš.</>}
                kroky={[
                  <><b>„žlutozelený“ → bezbarvý.</b> Žlutozelený je chlor, ne oxid siřičitý.</>,
                  <><b>„v atmosféře dusíku“ → v atmosféře kyslíku.</b> Síra s dusíkem přímo nereaguje; hoření vždy vyžaduje kyslík.</>,
                  <><b>„pozitivní dopad“ → negativní dopad</b> na životní prostředí.</>,
                  <><b>„zásaditých dešťů“ → kyselých dešťů.</b> SO₂ se ve vodě rozpouští na kyselinu siřičitou, která okyseluje srážky.</>,
                  <>Věta o včelařích, vinařích i o spalování hnědého uhlí je <b>správně</b> — nech ji být. Stejně tak pražení pyritu a výroba kyseliny sírové.</>,
                ]}
                vysledek="bezbarvý · v atmosféře kyslíku · negativní dopad · kyselé deště"
              />

              <Problem
                n="06" dif="hard" title="Kovy a kyselina sírová — doplň pravé strany"
                zadani={<>
                  Doplň pravou stranu a vyčísli (využij Beketovovu řadu kovů):
                  <div style={{ marginTop: 10 }}>
                    <M>Zn + H₂SO₄ (aq) →</M> · <M>Fe + H₂SO₄ (aq) →</M> · <M>Fe + H₂SO₄ (l) →</M><br />
                    <M>Pb + H₂SO₄ (l) →</M> · <M>Cu + H₂SO₄ (aq) →</M> · <M>Cu + H₂SO₄ (l) →</M>
                  </div>
                </>}
                given={<>Beketovova řada: kovy <b>před vodíkem</b> (K, Ca, Na, Mg, Al, Zn, Fe, Pb…) jsou neušlechtilé; kovy <b>za vodíkem</b> (Cu, Ag, Hg, Pt, Au) jsou ušlechtilé.</>}
                vztah={<>
                  <b>Zředěná</b> H₂SO₄ nemá oxidační účinky — funguje jen jako zdroj H⁺, takže z ní vodík vytěsní pouze neušlechtilý kov.
                  <b> Koncentrovaná</b> H₂SO₄ má oxidační účinky, sama se redukuje na SO₂ a rozpouští i některé ušlechtilé kovy.
                </>}
                kroky={[
                  <><M>Zn + H₂SO₄ (aq) → ZnSO₄ + H₂</M> — zinek je před vodíkem, vytěsní ho.</>,
                  <><M>Fe + H₂SO₄ (aq) → FeSO₄ + H₂</M> — se zředěnou kyselinou vzniká železnatá sůl (oxidační číslo II).</>,
                  <><M>Fe + H₂SO₄ (l) → pasivace</M> — koncentrovaná kyselina vytvoří na povrchu ochrannou vrstvičku a reakce se zastaví.</>,
                  <><M>Pb + H₂SO₄ (l) → pasivace</M> — totéž u olova. Díky pasivaci se kyselina převáží v ocelových cisternách.</>,
                  <><M>Cu + H₂SO₄ (aq) → nereaguje</M> — měď je ušlechtilá, vodík z kyseliny nevytěsní.</>,
                  <><M>Cu + 2 H₂SO₄ (l) → CuSO₄ + SO₂ + 2 H₂O</M> — koncentrovaná kyselina měď zoxiduje a sama se zredukuje na SO₂.</>,
                ]}
                vysledek="Zředěná: jen Zn a Fe (+H₂). Koncentrovaná: Fe a Pb pasivuje, Cu rozpouští za vzniku SO₂."
              />

              <Problem
                n="07" dif="medium" title="Napiš vzorce oxokyselin síry"
                zadani={<>Napiš vzorce kyseliny <b>disiřičité, thiosírové, disírové, peroxosírové</b> a <b>peroxodisírové</b>.</>}
                given={<>Základní kyseliny: siřičitá <M>H₂SO₃</M> (S má IV), sírová <M>H₂SO₄</M> (S má VI).</>}
                vztah={<>
                  <b>di-</b> = spoj dvě molekuly a odečti jednu vodu ·
                  <b> thio-</b> = nahraď jeden kyslík sírou ·
                  <b> peroxo-</b> = nahraď skupinu −O− skupinou −O−O− (tedy přidej jeden kyslík navíc)
                </>}
                kroky={[
                  <><b>disiřičitá</b>: 2 × H₂SO₃ = H₄S₂O₆, minus H₂O → <M>H₂S₂O₅</M></>,
                  <><b>thiosírová</b>: v H₂SO₄ zaměň jeden O za S → <M>H₂S₂O₃</M></>,
                  <><b>disírová</b>: 2 × H₂SO₄ = H₄S₂O₈, minus H₂O → <M>H₂S₂O₇</M></>,
                  <><b>peroxosírová</b>: k H₂SO₄ přidej jeden kyslík do peroxoskupiny → <M>H₂SO₅</M></>,
                  <><b>peroxodisírová</b>: k disírové H₂S₂O₇ přidej jeden kyslík → <M>H₂S₂O₈</M></>,
                ]}
                vysledek="H₂S₂O₅ · H₂S₂O₃ · H₂S₂O₇ · H₂SO₅ · H₂S₂O₈"
              />

              <Problem
                n="08" dif="easy" title="Tvar molekuly sulfanu a jeho skupenství"
                zadani={<>Odvoď tvar molekuly sulfanu, objasni podobnost s jinou molekulou a vysvětli, proč je sulfan za normálních podmínek plynný, na rozdíl od vody.</>}
                given={<>Síra má 6 valenčních elektronů, dvě z nich použije na vazby k vodíkům.</>}
                vztah={<>Tvar určují všechny elektronové páry kolem centrálního atomu (VSEPR). Skupenství určují <b>mezimolekulové síly</b>, ne molární hmotnost.</>}
                kroky={[
                  <>Kolem síry jsou 2 vazebné a <b>2 volné</b> elektronové páry → tvar je <b>lomený</b>.</>,
                  <>Stejné uspořádání má <b>voda H₂O</b> — proto je molekula sulfanu vodě podobná. Vazebný úhel je u H₂S menší (~92° proti 104,5°).</>,
                  <>Voda je kapalná, protože mezi jejími molekulami působí <b>vodíkové můstky</b> (vodík vázaný na silně elektronegativní kyslík).</>,
                  <>Síra má nízkou elektronegativitu, takže vazba S–H je jen slabě polární a <b>vodíkové můstky nevznikají</b>.</>,
                  <>Zbývají jen slabé van der Waalsovy síly → nízká teplota varu (−60 °C) → sulfan je za n.p. plyn.</>,
                ]}
                vysledek="Lomená molekula jako u vody; plynný, protože nemá vodíkové můstky"
              />

              <Problem
                n="09" dif="medium" title="Lze připravit fluor oxidací fluoridů?"
                zadani={<>Chlor se běžně připravuje oxidací: <M>MnO₂ + 4 HCl → MnCl₂ + Cl₂ + 2 H₂O</M>. Je možné touto cestou připravit také fluor? Zdůvodni.</>}
                given={<>Oxidační účinky halogenů klesají s rostoucím protonovým číslem: F₂ &gt; Cl₂ &gt; Br₂ &gt; I₂.</>}
                vztah={<>Aby se <M>X⁻</M> zoxidoval na <M>X₂</M>, musí být použité oxidační činidlo <b>silnější</b> než daný halogen.</>}
                kroky={[
                  <>Fluor je <b>nejsilnější oxidační činidlo ze všech prvků</b> — má nejvyšší elektronegativitu a nejmenší poloměr.</>,
                  <>Neexistuje tedy žádná látka, která by dokázala fluoridový anion <M>F⁻</M> zoxidovat.</>,
                  <>Jediná cesta je dodat elektronům energii zvenčí — <b>elektrolýzou</b> taveniny (KHF₂ v bezvodém HF).</>,
                  <>Stejná logika vysvětluje i vytěsňování: <M>Cl₂ + 2 KBr → 2 KCl + Br₂</M> funguje, ale <M>I₂ + 2 KCl</M> už ne.</>,
                ]}
                vysledek="Ne — fluor lze získat pouze elektrolýzou"
              />

              <Problem
                n="10" dif="medium" title="Které soli lze odvodit od kyseliny sulfanové?"
                zadani={<>Jaké typy solí můžeme odvodit od kyseliny sulfanové? Napiš jejich anionty a řekni, jak jsou rozpustné.</>}
                given={<>Kyselina sulfanová (sirovodíková) je vodný roztok sulfanu <M>H₂S</M> — slabá <b>dvojsytná</b> kyselina.</>}
                vztah={<>n-sytná kyselina dává <b>n</b> řad solí: postupným odštěpováním vodíků.</>}
                kroky={[
                  <>Odštěpením <b>jednoho</b> H⁺ vznikne <M>HS⁻</M> → <b>hydrogensulfidy</b> (např. <M>NH₄HS</M>, <M>NaHS</M>).</>,
                  <>Odštěpením <b>obou</b> H⁺ vznikne <M>S²⁻</M> → <b>sulfidy</b> (např. <M>Na₂S</M>, <M>ZnS</M>).</>,
                  <>Rozpustnost: <b>hydrogensulfidy jsou ve vodě rozpustné</b>.</>,
                  <>Ze sulfidů jsou rozpustné jen ty od kovů <b>I.A a II.A skupiny</b> a <M>(NH₄)₂S</M>; ostatní (ZnS, PbS, CuS…) jsou nerozpustné — proto tvoří rudy.</>,
                ]}
                vysledek="Sulfidy (S²⁻) a hydrogensulfidy (HS⁻)"
              />
            </>
          )}

          {/* ═══════════ 08 · NÁZVOSLOVÍ ═══════════ */}
          {sec === "nazvy" && (
            <>
              <h2><span className="hash">09</span>Názvosloví z pracovního listu</h2>
              <p className="lead">
                Přesně ty sloučeniny, které byly v PL. Přepni směr tlačítkem a projeď si to oběma způsoby —
                v testu můžou chtít obojí.
              </p>
              <Box tone="acc">
                <div className="bx-h">Tři předpony, na kterých to celé stojí</div>
                <ul style={{ paddingLeft: 20, margin: 0 }}>
                  <li><K>thio-</K> — atom kyslíku je nahrazen sírou. <M>SO₄²⁻</M> → <M>S₂O₃²⁻</M> (thiosíran)</li>
                  <li><K>peroxo-</K> — skupina <M>−O−</M> je nahrazena <M>−O−O−</M>, tedy o kyslík navíc. <M>H₂SO₄</M> → <M>H₂SO₅</M></li>
                  <li><K>di-</K> — dvě jádra spojená přes kyslík; spoj dvě molekuly a <b>odečti vodu</b>. 2 × <M>H₂SO₄</M> − <M>H₂O</M> = <M>H₂S₂O₇</M></li>
                </ul>
                <p style={{ marginBottom: 0, marginTop: 12 }}>
                  A k tomu <K>hydráty</K>: číslovková předpona + „hydrát“ + název soli v 2. pádě.
                  <M>CuSO₄ · 5 H₂O</M> = pentahydrát síranu měďnatého.
                </p>
              </Box>
              <NazvyDrill />
            </>
          )}

          {/* ═══════════ 09 · KVÍZ ═══════════ */}
          {sec === "kviz" && (
            <>
              <h2><span className="hash">10</span>Kvíz — {QUESTIONS.length} otázek</h2>
              <p className="lead">
                Otázky pokrývají obě témata. U otázek označených <b>„více správných“</b> zaškrtni všechny správné možnosti
                a potvrď. Pořadí možností se při každém spuštění zamíchá.
              </p>
              <QuizEngine questions={QUESTIONS} accentColor="#2ee6a8" />
            </>
          )}

          {/* ═══════════ 10 · KARTIČKY ═══════════ */}
          {sec === "karticky" && (
            <>
              <h2><span className="hash">11</span>Kartičky — {CARDS.length} ks</h2>
              <p className="lead">Klikni na kartičku a otoč ji. Ideální na poslední opakování ráno před testem.</p>
              <Flashcards cards={CARDS} />
            </>
          )}

          {/* ═══════════ 11 · TAHÁK ═══════════ */}
          {sec === "tahak" && (
            <>
              <h2><span className="hash">12</span>Tahák — vše, co musíš umět nazpaměť</h2>
              <p className="lead">Jedna stránka, na které je všechno podstatné. Projeď si ji jako poslední věc před testem.</p>

              <Box tone="acc">
                  <div className="bx-h">Obě skupiny v jedné tabulce</div>
                  <Tab head={["", "VI.A chalkogeny", "VII.A halogeny"]} rows={[
                    ["název z řečtiny", "chalkos = ruda → rudotvorné", "hals = sůl → solitvorné"],
                    ["konfigurace", "ns² np⁴", "ns² np⁵"],
                    ["chybí do oktetu", "2 e⁻", "1 e⁻"],
                    ["prvky", "O, S, Se, Te, Po", "F, Cl, Br, I, At"],
                    ["ox. čísla", "−II, 0, II, IV, VI", "−I, 0, I, III, V, VII (F jen −I)"],
                  ]} />
              </Box>
              <Box tone="v">
                  <div className="bx-h bx-h--v">Vaznosti síry</div>
                  <Tab mono head={["Konfigurace", "Vaznost", "Příklad"]} rows={[
                    ["[Ne] 3s² 3p⁴", "II", "H₂S"],
                    ["[Ne] 3s² 3p³ 3d¹", "IV", "SO₂"],
                    ["[Ne] 3s¹ 3p³ 3d²", "VI", "H₂SO₄"],
                  ]} />
                  <p style={{ fontSize: 14, color: "#a6b2c2", marginBottom: 0 }}>
                    Excitace je možná jen díky volným <b>3d-orbitalům</b>. Kyslík je ve 2. periodě, žádné d nemá → max. dvojvazný.
                  </p>
              </Box>

              <Box>
                <div className="bx-h">Oxokyseliny síry</div>
                <Tab mono head={["Vzorec", "Název", "Ox. č. S", "Sůl"]} rows={[
                  ["H₂SO₃", "siřičitá", "IV", "siřičitany SO₃²⁻ · hydrogensiřičitany HSO₃⁻"],
                  ["H₂SO₄", "sírová", "VI", "sírany SO₄²⁻ · hydrogensírany HSO₄⁻"],
                  ["H₂S₂O₅", "disiřičitá", "IV", "disiřičitany S₂O₅²⁻"],
                  ["H₂S₂O₇", "disírová", "VI", "disírany S₂O₇²⁻"],
                  ["H₂S₂O₃", "thiosírová", "VI / −II", "thiosírany S₂O₃²⁻"],
                  ["H₂SO₅", "peroxosírová", "VI", "peroxosírany SO₅²⁻"],
                  ["H₂S₂O₈", "peroxodisírová", "VI", "peroxodisírany S₂O₈²⁻"],
                  ["H₂S", "sulfanová", "−II", "sulfidy S²⁻ · hydrogensulfidy HS⁻"],
                ]} />
              </Box>

              <Box>
                <div className="bx-h">Oxokyseliny chloru</div>
                <Tab mono head={["Vzorec", "Ox. č. Cl", "Kyselina", "Sůl"]} rows={[
                  ["HClO", "I", "chlorná", "chlornany ClO⁻ (SAVO = NaClO)"],
                  ["HClO₂", "III", "chloritá", "chloritany ClO₂⁻"],
                  ["HClO₃", "V", "chlorečná", "chlorečnany ClO₃⁻"],
                  ["HClO₄", "VII", "chloristá", "chloristany ClO₄⁻"],
                ]} />
                <p style={{ marginBottom: 0, fontSize: 14.5 }}>
                  Směrem dolů <b>roste síla kyseliny i stálost</b>, ale <b>klesají oxidační účinky</b>.
                </p>
              </Box>

              <Box>
                <div className="bx-h">Minerály a triviální názvy</div>
                <Tab mono head={["Vzorec", "Název"]} rows={[
                  ["FeS₂", "pyrit — disulfid železnatý"],
                  ["ZnS", "sfalerit — sulfid zinečnatý"],
                  ["PbS", "galenit — sulfid olovnatý"],
                  ["BaSO₄", "baryt — RTG kontrastní látka"],
                  ["CaSO₄ · 2 H₂O", "sádrovec"],
                  ["Na₂SO₄ · 10 H₂O", "Glauberova sůl"],
                  ["FeSO₄ · 7 H₂O", "zelená skalice"],
                  ["CuSO₄ · 5 H₂O", "modrá skalice"],
                  ["CaF₂", "fluorit (kazivec)"],
                  ["NaCl", "halit — kamenná sůl"],
                  ["Na₃AlF₆", "kryolit"],
                  ["KCl", "sylvín"],
                ]} />
              </Box>

              <div className="grid2">
                <Box>
                  <div className="bx-h">Barvy a skupenství halogenů</div>
                  <Tab head={["Prvek", "Skupenství", "Barva"]} rows={[
                    ["F₂", "plyn", "nazelenalý"],
                    ["Cl₂", "plyn", "žlutozelený"],
                    ["Br₂", "kapalina", "červenohnědý"],
                    ["I₂", "pevná látka", "fialový (sublimuje)"],
                  ]} />
                </Box>
                <Box>
                  <div className="bx-h">Klíčové trendy</div>
                  <ul style={{ paddingLeft: 20, margin: 0, fontSize: 14.5 }}>
                    <li>Oxidační účinky halogenů: <b>F₂ &gt; Cl₂ &gt; Br₂ &gt; I₂</b></li>
                    <li>Síla halogenovodíků: <b>HF &lt; HCl &lt; HBr &lt; HI</b></li>
                    <li>Síla oxokyselin roste s <b>ox. číslem</b>: H₂SO₃ &lt; H₂SO₄, HClO &lt; HClO₄</li>
                    <li>Ve skupině shora dolů roste <b>poloměr</b>, klesá <b>elektronegativita</b></li>
                  </ul>
                </Box>
              </div>

              <Box>
                <div className="bx-h">Praktické využití a triviální názvy</div>
                <Tab head={["Látka", "Složení", "K čemu"]} rows={[
                  ["jodová tinktura", "5% roztok jodu v ethanolu", "dezinfekce ran"],
                  ["chlorové vápno", "CaCl₂ + Ca(ClO)₂", "dezinfekce"],
                  ["SAVO", "NaClO", "bělení, dezinfekce"],
                  ["chlorová voda", "Cl₂ + H₂O ⇄ HCl + HClO", "chlorace vody"],
                  ["oleum", "SO₃ v konc. H₂SO₄", "meziprodukt výroby H₂SO₄"],
                  ["lučavka královská", "3 HCl : 1 HNO₃", "jediné, co rozpustí zlato"],
                  ["sirný knot", "hořící síra → SO₂", "dezinfekce úlů a vinných sudů"],
                  ["barnatá kaše", "BaSO₄ (nerozpustný)", "RTG kontrastní látka"],
                ]} />
              </Box>

              <Box tone="warn">
                <div className="bx-h bx-h--w">Deset vět, které stačí znát nazpaměť</div>
                <ol style={{ paddingLeft: 20, margin: 0, fontSize: 15 }}>
                  <li><b>SO₂ je bezbarvý</b> štiplavý jedovatý plyn, těžší než vzduch, nepodporuje hoření.</li>
                  <li>SO₂ má <b>bělicí a dezinfekční</b> účinky — sirný knot pro úly a vinné sudy.</li>
                  <li>SO₂ způsobuje <b>kyselé deště</b> a jeho dopad na životní prostředí je <b>negativní</b>.</li>
                  <li>Katalyzátorem oxidace SO₂ na SO₃ je <b>V₂O₅</b>. Oleum = SO₃ rozpuštěný v konc. H₂SO₄.</li>
                  <li>Sulfan je <b>vždy redukční</b> činidlo (S má −II). Je plynný, protože <b>nemá vodíkové můstky</b>.</li>
                  <li>S₈ není rovinná kvůli <b>dvěma volným elektronovým párům</b> na každém atomu síry.</li>
                  <li>Zředěná H₂SO₄: jen <b>neušlechtilé</b> kovy + H₂. Koncentrovaná: <b>oxiduje</b>, sama se redukuje na SO₂, Fe a Pb <b>pasivuje</b>.</li>
                  <li>Zlato rozpouští jen <b>lučavka královská</b> — 3 díly HCl : 1 díl HNO₃.</li>
                  <li><b>Fluor nelze připravit oxidací</b>, protože je nejsilnější oxidační činidlo — jen elektrolýzou.</li>
                  <li><b>HF leptá sklo</b> (SiO₂ + 4 HF → SiF₄ + 2 H₂O). <b>HCl v žaludku</b> 0,3–0,4 %, pH 1–3, aktivuje pepsin.</li>
                  <li>Jod tvoří <b>molekulový</b> krystal (van der Waalsovy síly) → <b>sublimuje</b>. Jodová tinktura = 5 % jodu <b>v ethanolu</b>.</li>
                  <li>Sulfan vzniká <b>rozkladem bílkovin</b> a jeho roztok barví lakmus <b>červeně</b> (je to kyselina).</li>
                  <li>Dehydratace glukosy: <b>C₆H₁₂O₆ → 6 C + 6 H₂O</b> (nad šipkou H₂SO₄).</li>
                  <li>Ředění: <b>kyselinu do vody</b>, nikdy naopak.</li>
                </ol>
              </Box>
            </>
          )}

        </main>
      </div>
    </div>
  );
}
