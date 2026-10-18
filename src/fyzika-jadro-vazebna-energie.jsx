// @title Fyzika jádra — Hmotnostní schodek · Vazebná energie · Štěpení a syntéza
// @subject Physics
// @topic Parametry atomu · Hmotnostní schodek · Vazebná energie · Vazebná energie na nukleon · Jaderné reakce · Štěpení · Slučování jader
// @template study-app

import { useState, useCallback, useMemo } from 'react';

/* ═══════════════════════════════════════════════════════════════════
   KONSTANTY (stejné jako v pracovním listu)
   ═══════════════════════════════════════════════════════════════════ */
const MP = 1.007276, MN = 1.008665, ME = 0.000549, K_U = 931.5;

const CY = '#5ac8fa', YL = '#ffd166', OK = '#4ade80', BAD = '#f87171';

function fmt(x, d = 2) {
  if (!isFinite(x)) return '—';
  return x.toFixed(d).replace('.', ',');
}
function sci(x, d = 3) {
  if (!isFinite(x) || x === 0) return fmt(x, d);
  const e = Math.floor(Math.log10(Math.abs(x)));
  const m = x / Math.pow(10, e);
  const sup = String(e).replace('-', '⁻').replace(/\d/g, c => '⁰¹²³⁴⁵⁶⁷⁸⁹'[c]);
  return `${fmt(m, d - 1)} · 10${sup}`;
}
function parseNum(s) {
  if (s == null) return NaN;
  let t = String(s).trim().replace(/\s/g, '').replace(/−/g, '-').replace(',', '.');
  if (!t) return NaN;
  const m = t.match(/^([-+]?\d*\.?\d+)(?:(?:[eE]|[x×*·]10\^?)([-+]?\d+))?$/);
  if (!m) return NaN;
  return parseFloat(m[1]) * (m[2] ? Math.pow(10, parseInt(m[2], 10)) : 1);
}

/* ═══════════════════════════════════════════════════════════════════
   ZÁPIS NUKLIDU  ᴬ_Z X
   ═══════════════════════════════════════════════════════════════════ */
function Nuc({ A, Z, s }) {
  return (
    <span className="nuc">
      <span className="az"><span>{A}</span><span>{Z}</span></span>{s}
    </span>
  );
}
function Eq({ children, note }) {
  return (
    <div className="eq">
      <div className="eqin">{children}</div>
      {note && <div className="eqnote">{note}</div>}
    </div>
  );
}
const Arr = () => <span className="arr">→</span>;
const Plus = () => <span className="pl">+</span>;

/* Veličina v technickém stylu: symbol = hodnota jednotka */
function Q({ s, v, u }) {
  return <span className="qty"><span className="qs">{s}</span>{v != null && <> = <span className="qv">{v}</span></>}{u && <span className="qu"> {u}</span>}</span>;
}

/* ═══════════════════════════════════════════════════════════════════
   QUIZ ENGINE (logika z assets/quiz-engine.jsx, vzhled Blueprint)
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
    const si = shuffleArray(q.options.map((_, i) => i));
    return { ...q, options: si.map(i => q.options[i]), correct: q.correct.map(o => si.indexOf(o)) };
  });
}
function arrEqual(a, b) {
  if (!a || !b) return false;
  const sa = [...a].sort((x, y) => x - y), sb = [...b].sort((x, y) => x - y);
  return sa.length === sb.length && sa.every((v, i) => v === sb[i]);
}

function QuizEngine({ questions, accentColor = CY }) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState({});
  const [pending, setPending] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [shuffleKey, setShuffleKey] = useState(0);
  const sq = useMemo(() => shuffleQuestions(questions), [questions, shuffleKey]);
  const q = sq[idx];
  const isMulti = q.type === 'multi';
  const isRev = !!revealed[idx];
  const myAns = answers[idx] || [];
  const isOk = isRev && arrEqual(myAns, q.correct);
  const score = sq.filter((_, i) => revealed[i] && arrEqual(answers[i] || [], sq[i].correct)).length;
  const pct = Math.round(score / sq.length * 100);
  const activeSet = isMulti ? (isRev ? myAns : pending) : myAns;

  const goTo = useCallback(i => {
    setIdx(i);
    setPending(sq[i].type === 'multi' ? (answers[i] || []) : []);
  }, [answers, sq]);
  const handleSingle = useCallback(oi => {
    if (isRev) return;
    setAnswers(p => ({ ...p, [idx]: [oi] }));
    setRevealed(p => ({ ...p, [idx]: true }));
  }, [idx, isRev]);
  const toggleMulti = useCallback(oi => {
    if (isRev) return;
    setPending(p => p.includes(oi) ? p.filter(x => x !== oi) : [...p, oi]);
  }, [isRev]);
  const submitMulti = useCallback(() => {
    if (!pending.length) return;
    setAnswers(p => ({ ...p, [idx]: [...pending] }));
    setRevealed(p => ({ ...p, [idx]: true }));
  }, [idx, pending]);
  const restart = useCallback(() => {
    setIdx(0); setAnswers({}); setRevealed({}); setPending([]);
    setShowResults(false); setShuffleKey(k => k + 1);
  }, []);

  if (showResults) {
    const msg = pct >= 90 ? 'Výborně! Na písemku jsi připravený. ⚛️'
      : pct >= 70 ? 'Dobře! Dolaď slabá místa a bude to.'
      : pct >= 50 ? 'Základ máš — projdi znovu teorii a příklady.'
      : 'Potřebuješ víc opakování. Vrať se k teorii a zkus to znovu!';
    return (
      <div className="box tk qres">
        <div className="mono qresScore">{score} / {sq.length}</div>
        <div className="mono qresPct">{pct} %</div>
        <div className="qresMsg">{msg}</div>
        <button className="btn btnA" onClick={restart}>↻ Začít znovu</button>
      </div>
    );
  }

  return (
    <div className="quiz">
      <div className="dots">
        {sq.map((_, i) => {
          let bg = '#3b4f63';
          if (i === idx) bg = accentColor;
          else if (revealed[i]) bg = arrEqual(answers[i] || [], sq[i].correct) ? OK : BAD;
          return <button key={i} aria-label={`Otázka ${i + 1}`} onClick={() => goTo(i)} className="dot" style={{ background: bg }} />;
        })}
      </div>
      <div className="box tk qcard">
        <div className="mono qnum">OTÁZKA {String(idx + 1).padStart(2, '0')} / {sq.length}{isMulti && ' · více správných odpovědí'}</div>
        <div className="qtext">{q.question}</div>
        <div className="opts">
          {q.options.map((opt, i) => {
            let cls = 'opt';
            if (isRev) {
              if (q.correct.includes(i)) cls += ' optOk';
              else if (activeSet.includes(i)) cls += ' optBad';
            } else if (activeSet.includes(i)) cls += ' optSel';
            return (
              <div key={i} className={cls} onClick={() => isMulti ? toggleMulti(i) : handleSingle(i)}>
                {isMulti && <span className="mono">{activeSet.includes(i) ? '☑' : '☐'}</span>}
                <span>{opt}</span>
              </div>
            );
          })}
        </div>
        {isMulti && !isRev && (
          <button className="btn" style={{ marginTop: 14, opacity: pending.length ? 1 : 0.4 }} onClick={submitMulti} disabled={!pending.length}>Potvrdit</button>
        )}
        {isRev && (
          <div className="fb" style={{ borderColor: isOk ? OK : BAD }}>
            <div className="fbH" style={{ color: isOk ? OK : BAD }}>{isOk ? '✓ Správně' : '✗ Špatně'}</div>
            {!isOk && <div className="fbC">Správná odpověď: {q.correct.map(i => q.options[i]).join(' · ')}</div>}
            <div className="fbE">{q.explanation}</div>
            {q.tip && <div className="fbT">💡 {q.tip}</div>}
          </div>
        )}
      </div>
      <div className="navRow">
        <button className="btn" onClick={() => goTo(idx - 1)} disabled={idx === 0} style={{ opacity: idx === 0 ? 0.4 : 1 }}>← Předchozí</button>
        {idx < sq.length - 1
          ? <button className="btn" onClick={() => goTo(idx + 1)}>Další →</button>
          : <button className="btn btnA" onClick={() => setShowResults(true)}>Výsledky →</button>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   GRAF  ε(A)
   ═══════════════════════════════════════════════════════════════════ */
const CURVE = [[2,1.11],[3,2.83],[6,5.33],[7,5.61],[9,6.46],[11,6.93],[14,7.48],[20,8.03],[28,8.45],[40,8.55],[56,8.79],[62,8.79],[84,8.72],[120,8.50],[138,8.39],[184,8.01],[208,7.87],[238,7.57]];
const POINTS = [
  { s: 'H', A: 2, e: 1.11, n: 'deuterium — nejslaběji vázané složené jádro' },
  { s: 'He', A: 4, e: 7.07, n: 'částice α — výjimečně stabilní, leží vysoko nad křivkou' },
  { s: 'Li', A: 7, e: 5.61, n: 'lehké jádro — syntézou získá energii' },
  { s: 'C', A: 12, e: 7.68, n: 'uhlík — také nad okolní křivkou (3 × α)' },
  { s: 'O', A: 16, e: 7.98, n: 'kyslík (4 × α)' },
  { s: 'Fe', A: 56, e: 8.79, n: 'MAXIMUM — nejpevněji vázané jádro, nic se z něj nezíská' },
  { s: 'Kr', A: 92, e: 8.71, n: 'typický produkt štěpení uranu' },
  { s: 'Ba', A: 141, e: 8.33, n: 'typický produkt štěpení uranu' },
  { s: 'Pb', A: 208, e: 7.87, n: 'nejtěžší stabilní jádro' },
  { s: 'U', A: 235, e: 7.59, n: 'štěpitelné palivo reaktorů' },
  { s: 'U', A: 238, e: 7.57, n: 'těžké jádro — štěpením získá energii' },
];

function BindingGraph() {
  const [sel, setSel] = useState(5);
  const W = 640, H = 330, L = 52, R = 18, T = 18, B = 46;
  const x = A => L + A / 240 * (W - L - R);
  const y = e => H - B - e / 9 * (H - T - B);
  const path = CURVE.map(([A, e], i) => `${i ? 'L' : 'M'}${x(A).toFixed(1)},${y(e).toFixed(1)}`).join(' ');
  const p = POINTS[sel];
  return (
    <div className="box tk graphBox">
      <div className="mono label">OBR. 1 — VAZEBNÁ ENERGIE NA NUKLEON ε V ZÁVISLOSTI NA A · klikni na bod</div>
      <svg viewBox={`0 0 ${W} ${H}`} className="graph" role="img" aria-label="Graf vazebné energie na nukleon">
        {[0, 2, 4, 6, 8].map(e => (
          <g key={e}>
            <line x1={L} x2={W - R} y1={y(e)} y2={y(e)} stroke="rgba(120,180,255,0.15)" />
            <text x={L - 8} y={y(e) + 4} textAnchor="end" className="ax">{e}</text>
          </g>
        ))}
        {[0, 50, 100, 150, 200, 238].map(A => (
          <text key={A} x={x(A)} y={H - B + 18} textAnchor="middle" className="ax">{A}</text>
        ))}
        <line x1={L} x2={L} y1={T} y2={H - B} stroke={CY} />
        <line x1={L} x2={W - R} y1={H - B} y2={H - B} stroke={CY} />
        <text x={14} y={T + 8} className="ax" fill={CY}>ε [MeV]</text>
        <text x={W - R} y={H - 6} textAnchor="end" className="ax" fill={CY}>A (nukleonové číslo)</text>
        {/* oblasti */}
        <rect x={L} y={T} width={x(56) - L} height={H - T - B} fill="rgba(90,200,250,0.05)" />
        <rect x={x(56)} y={T} width={W - R - x(56)} height={H - T - B} fill="rgba(255,209,102,0.05)" />
        <line x1={x(56)} x2={x(56)} y1={T} y2={H - B} stroke={YL} strokeDasharray="4 4" />
        <text x={x(56) + 8} y={y(6.9)} className="ax" fill={YL}>max ≈ 8,8 MeV (Fe, Ni)</text>
        <g className="regionLbl">
          <text x={x(31)} y={y(2.9)} textAnchor="middle" fill={CY}>SYNTÉZA →</text>
          <text x={x(31)} y={y(2.9) + 16} textAnchor="middle" className="ax">lehká jádra</text>
          <text x={x(31)} y={y(2.9) + 30} textAnchor="middle" className="ax">se slučují</text>
          <text x={x(150)} y={y(5.2)} textAnchor="middle" fill={YL}>← ŠTĚPENÍ</text>
          <text x={x(150)} y={y(5.2) + 16} textAnchor="middle" className="ax">těžká jádra se dělí</text>
        </g>
        <path d={path} pathLength="1" className="curve" fill="none" stroke={CY} strokeWidth="2.2" strokeLinejoin="round" />
        {POINTS.map((pt, i) => (
          <g key={i} onClick={() => setSel(i)} style={{ cursor: 'pointer' }}>
            <circle cx={x(pt.A)} cy={y(pt.e)} r="14" fill="transparent" />
            <circle cx={x(pt.A)} cy={y(pt.e)} r={i === sel ? 6 : 4} fill={i === sel ? YL : '#0d1b2a'} stroke={i === sel ? YL : CY} strokeWidth="2" />
            {(i === sel || [0, 1, 5, 10].includes(i)) && (
              <text x={x(pt.A) + (pt.A > 200 ? -8 : 8)} y={y(pt.e) + (pt.A === 4 ? 20 : -9)} textAnchor={pt.A > 200 ? 'end' : 'start'} className="ax" fill={i === sel ? YL : '#cfe3f5'}>{pt.A}{pt.s}</text>
            )}
          </g>
        ))}
        {/* kótovací šipka pro vybraný bod */}
        <line x1={x(p.A)} x2={x(p.A)} y1={H - B} y2={y(p.e) + 8} stroke={YL} strokeWidth="1" markerStart="url(#ah)" markerEnd="url(#ah)" />
        <defs>
          <marker id="ah" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill={YL} />
          </marker>
        </defs>
      </svg>
      <div className="readout">
        <div><span className="mono dim">NUKLID</span><br /><span className="big"><Nuc A={p.A} s={p.s} /></span></div>
        <div><span className="mono dim">ε</span><br /><span className="mono yl">{fmt(p.e, 2)} MeV/nukleon</span></div>
        <div><span className="mono dim">Ev ≈ A · ε</span><br /><span className="mono yl">{fmt(p.A * p.e, 0)} MeV</span></div>
        <div className="readNote">{p.n}</div>
      </div>
    </div>
  );
}

/* Měřítko atom vs. jádro */
function ScaleDiagram() {
  return (
    <div className="box tk scaleBox">
      <div className="mono label">OBR. 2 — ROZMĚRY (nejsou v měřítku — jádro by bylo neviditelné)</div>
      <svg viewBox="0 0 600 190" className="graph scaleSvg">
        <defs>
          <marker id="ah2" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill={CY} />
          </marker>
        </defs>
        <circle cx="180" cy="95" r="70" fill="none" stroke={CY} strokeDasharray="3 5" className="draw" />
        <circle cx="180" cy="95" r="4" fill={YL} />
        <circle cx="240" cy="60" r="3" fill={CY} /><circle cx="128" cy="140" r="3" fill={CY} />
        <line x1="110" x2="250" y1="178" y2="178" stroke={CY} markerStart="url(#ah2)" markerEnd="url(#ah2)" />
        <text x="180" y="172" textAnchor="middle" className="ax" fill={CY}>atom d ≈ 10⁻¹⁰ m</text>
        <line x1="180" x2="292" y1="95" y2="95" stroke={YL} strokeDasharray="2 3" />
        <text x="300" y="91" className="ax" fill={YL}>jádro d ≈ 10⁻¹⁵ – 10⁻¹⁴ m</text>
        <text x="300" y="111" className="ax">p⁺ + n⁰ = nukleony · &gt; 99,9 % hmotnosti</text>
        <text x="300" y="58" className="ax" fill={CY}>e⁻ obal · určuje chemii</text>
        <text x="300" y="150" className="ax">poměr ≈ 1 : 100 000</text>
        <text x="300" y="168" className="ax">jádro = kulička 1 cm → atom 1 km</text>
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TEORIE
   ═══════════════════════════════════════════════════════════════════ */
const THEORY = [
  {
    id: 'atom', title: 'Parametry atomu a jádra',
    body: (
      <>
        <p>Atom = <b>jádro</b> (protony + neutrony, společně <b>nukleony</b>) + <b>elektronový obal</b>. Téměř celá hmotnost je v jádře, ale jádro je asi 100 000× menší než atom.</p>
        <ScaleDiagram />
        <table className="tbl">
          <thead><tr><th>Značka</th><th>Název</th><th>Význam</th></tr></thead>
          <tbody>
            <tr><td className="mono yl">Z</td><td>protonové (atomové) číslo</td><td>počet protonů = počet e⁻ v neutrálním atomu; náboj jádra je <span className="mono">Z·e</span>; určuje prvek</td></tr>
            <tr><td className="mono yl">N</td><td>neutronové číslo</td><td>počet neutronů</td></tr>
            <tr><td className="mono yl">A</td><td>nukleonové (hmotnostní) číslo</td><td><span className="mono">A = Z + N</span>, počet všech nukleonů</td></tr>
          </tbody>
        </table>
        <p>Zápis nuklidu: <span className="big"><Nuc A="A" Z="Z" s="X" /></span> např. <span className="big"><Nuc A={56} Z={26} s="Fe" /></span> → 26 protonů, 56 − 26 = <b>30 neutronů</b>, 26 elektronů.</p>
        <ul>
          <li><b>Nuklid</b> — konkrétní druh atomu (dané Z i A).</li>
          <li><b>Izotopy</b> — stejné Z, různé N (¹H, ²H, ³H; ²³⁵U a ²³⁸U). Stejný prvek, stejná chemie.</li>
          <li><b>Izobary</b> — stejné A (¹⁴C a ¹⁴N). <b>Izotony</b> — stejné N.</li>
        </ul>
        <p><b>Poloměr jádra:</b> <span className="mono yl">R = r₀ · ∛A</span>, kde <span className="mono">r₀ ≈ 1,2 · 10⁻¹⁵ m</span> (= 1,2 fm; některé učebnice 1,3–1,4 fm). Objem jádra je tedy úměrný A → <b>hustota jaderné hmoty je pro všechna jádra stejná</b>, asi 2,3 · 10¹⁷ kg/m³.</p>
        <table className="tbl">
          <thead><tr><th>Částice</th><th>Hmotnost [u]</th><th>Hmotnost [kg]</th><th>Náboj</th></tr></thead>
          <tbody>
            <tr><td>proton p</td><td className="mono">1,007 276</td><td className="mono">1,673 · 10⁻²⁷</td><td className="mono">+e</td></tr>
            <tr><td>neutron n</td><td className="mono">1,008 665</td><td className="mono">1,675 · 10⁻²⁷</td><td className="mono">0</td></tr>
            <tr><td>elektron e⁻</td><td className="mono">0,000 549</td><td className="mono">9,11 · 10⁻³¹</td><td className="mono">−e</td></tr>
          </tbody>
        </table>
        <p><b>Atomová hmotnostní jednotka</b> <span className="mono">u = 1/12 hmotnosti atomu ¹²C ≈ 1,6605 · 10⁻²⁷ kg</span>. Hmotnost atomu v u je přibližně rovna A. Neutron je o trochu těžší než proton.</p>
      </>
    ),
  },
  {
    id: 'sily', title: 'Jaderné síly a stabilita jádra',
    body: (
      <>
        <p>Protony se elektricky odpuzují — přesto jádro drží. Drží ho <b>jaderné (silné) síly</b>:</p>
        <ul>
          <li><b>přitažlivé</b> a na krátkou vzdálenost mnohem silnější než elektrické odpuzování,</li>
          <li><b>krátký dosah</b> ≈ 10⁻¹⁵ m (pár fm) — za hranicí jádra prakticky nepůsobí,</li>
          <li><b>nezávislé na náboji</b> — p–p, n–n i p–n se přitahují stejně,</li>
          <li><b>nasycené</b> — nukleon působí jen na své nejbližší sousedy. Proto Ev roste zhruba úměrně A a ε je u většiny jader podobná (7–9 MeV).</li>
        </ul>
        <p><b>Stabilita:</b> lehká stabilní jádra mají N ≈ Z, těžká mají neutronů víc (N &gt; Z) — neutrony „ředí“ odpuzování protonů. Elektrické odpuzování má dlouhý dosah a působí mezi všemi protony, proto u velkých jader ε klesá. Všechna jádra se Z &gt; 83 jsou radioaktivní.</p>
      </>
    ),
  },
  {
    id: 'schodek', title: 'Hmotnostní schodek (úbytek) Δm',
    body: (
      <>
        <p>Když změříme hmotnost jádra, vyjde <b>menší</b>, než je součet hmotností jeho volných protonů a neutronů. Rozdíl je <b>hmotnostní schodek</b> (úbytek, defekt):</p>
        <div className="formula">Δm = (Z · m<sub>p</sub> + N · m<sub>n</sub>) − m<sub>j</sub></div>
        <p><b>Proč hmotnost „zmizí“?</b> Při spojení nukleonů do jádra se uvolní energie (vazebná energie) a podle Einsteinova vztahu <span className="mono">E = m·c²</span> s ní odejde i odpovídající hmotnost. Δm je vždy kladné.</p>
        <div className="warn">
          <b>⚠ Pozor na hmotnost atomu vs. jádra.</b> Tabulky často uvádějí hmotnost celého <i>atomu</i> m<sub>a</sub> (včetně elektronů). Pak buď
          <ul>
            <li>odečti elektrony: <span className="mono">m<sub>j</sub> = m<sub>a</sub> − Z · m<sub>e</sub></span>, nebo</li>
            <li>místo protonu dosaď atom vodíku <span className="mono">m<sub>H</sub> = 1,007 825 u</span>: <span className="mono">Δm = Z·m<sub>H</sub> + N·m<sub>n</sub> − m<sub>a</sub></span> (elektrony se odečtou samy).</li>
          </ul>
          V pracovním listu jsou zadány přímo hmotnosti <b>jader</b> m<sub>j</sub>, takže se počítá s m<sub>p</sub>.
        </div>
        <p><b>Postup:</b> 1) z ᴬ_Z X urči Z a N = A − Z, 2) spočítej Z·m<sub>p</sub> a N·m<sub>n</sub>, 3) sečti, 4) odečti m<sub>j</sub>. Počítej s co nejvíc desetinnými místy — Δm je malý rozdíl dvou velkých čísel!</p>
      </>
    ),
  },
  {
    id: 'ev', title: 'Vazebná energie jádra Ev',
    body: (
      <>
        <p><b>Vazebná energie</b> = energie, která se <b>uvolní při vzniku jádra</b> z volných nukleonů = energie, kterou musíme dodat, abychom jádro <b>rozložili</b> na jednotlivé nukleony.</p>
        <div className="formula">E<sub>v</sub> = Δm · c²</div>
        <p>Dva způsoby výpočtu:</p>
        <ol>
          <li><b>V joulech:</b> převeď Δm na kg (<span className="mono">× 1,6605·10⁻²⁷</span>) a vynásob <span className="mono">c² = 9·10¹⁶ m²/s²</span>. Na MeV pak vyděl <span className="mono">1,602·10⁻¹³ J</span>.</li>
          <li><b>Rychle v MeV:</b> <span className="mono yl">E<sub>v</sub> [MeV] = Δm [u] · 931,5</span> — protože 1 u · c² ≈ 931,5 MeV.</li>
        </ol>
        <div className="note">Proč 931,5? 1,6605·10⁻²⁷ kg · (2,998·10⁸ m/s)² = 1,492·10⁻¹⁰ J = 931,5 MeV. S zaokrouhleným c = 3·10⁸ vyjde ≈ 933 MeV — proto se výsledky obou postupů liší v desetinách procenta. To je v pořádku.</div>
        <p><b>Jednotky:</b> <span className="mono">1 eV = 1,602·10⁻¹⁹ J</span>, <span className="mono">1 MeV = 10⁶ eV = 1,602·10⁻¹³ J</span>.</p>
        <p><b>Představa o velikosti:</b> deuteron 2,2 MeV, ⁴He 28,3 MeV, ²³⁸U ≈ 1 800 MeV. Chemická vazba má jen jednotky eV → jaderné energie jsou asi <b>milionkrát větší</b>.</p>
      </>
    ),
  },
  {
    id: 'eps', title: 'Vazebná energie na nukleon ε a stabilita',
    body: (
      <>
        <div className="formula">ε = E<sub>v</sub> / A &nbsp;&nbsp;[MeV/nukleon]</div>
        <p>ε říká, jak pevně je v jádře vázán <b>jeden</b> nukleon. Je to <b>míra stability</b>: čím větší ε, tím je jádro stabilnější.</p>
        <BindingGraph />
        <ul>
          <li>U lehkých jader ε prudce roste (výjimka: <b>⁴He</b> leží vysoko — proto je částice α tak stabilní).</li>
          <li><b>Maximum ≈ 8,8 MeV</b> kolem A ≈ 56–62 (<b>⁵⁶Fe</b>, ⁶²Ni) — nejstabilnější jádra.</li>
          <li>U těžkých jader ε pomalu klesá (≈ 7,6 MeV u uranu), protože roste elektrické odpuzování protonů.</li>
        </ul>
        <div className="warn"><b>Paradox celkové vs. měrné energie (PL úkol B):</b> ²³⁸U má mnohem větší <i>celkovou</i> Ev než ⁵⁶Fe jen proto, že má víc nukleonů (238 vs. 56). O stabilitě rozhoduje energie připadající na <b>jeden</b> nukleon — a ta je u železa větší (8,8 vs. 7,6 MeV), takže železo je stabilnější.</div>
        <p><b>Kdy se uvolní energie?</b> Vždy, když reakcí vzniknou jádra s <b>větším ε</b> (posun k maximu): lehká jádra <b>slučováním</b>, těžká <b>štěpením</b>. Energie reakce = rozdíl vazebných energií:</p>
        <div className="formula">E = ΣE<sub>v</sub>(produkty) − ΣE<sub>v</sub>(výchozí jádra)</div>
      </>
    ),
  },
  {
    id: 'reakce', title: 'Jaderné reakce a zákony zachování',
    body: (
      <>
        <p>Při jaderné reakci se zachovává:</p>
        <ul>
          <li><b>nukleonové číslo A</b> — součet horních čísel vlevo = vpravo,</li>
          <li><b>náboj (protonové číslo Z)</b> — součet dolních čísel vlevo = vpravo,</li>
          <li>energie (včetně klidové m·c²) a hybnost.</li>
        </ul>
        <table className="tbl">
          <thead><tr><th>Částice</th><th>Zápis</th><th>Poznámka</th></tr></thead>
          <tbody>
            <tr><td>neutron</td><td className="big"><Nuc A={1} Z={0} s="n" /></td><td>bez náboje — snadno vnikne do jádra</td></tr>
            <tr><td>proton</td><td className="big"><Nuc A={1} Z={1} s="p" /> = <Nuc A={1} Z={1} s="H" /></td><td>jádro vodíku</td></tr>
            <tr><td>částice α</td><td className="big"><Nuc A={4} Z={2} s="He" /></td><td>jádro helia</td></tr>
            <tr><td>elektron (β⁻)</td><td className="big"><Nuc A={0} Z="−1" s="e" /></td><td>v jádře: n → p + e⁻ + ν̄ → Z o 1 vzroste</td></tr>
            <tr><td>pozitron (β⁺)</td><td className="big"><Nuc A={0} Z="+1" s="e" /></td><td>v jádře: p → n + e⁺ + ν → Z o 1 klesne</td></tr>
            <tr><td>neutrino, foton γ</td><td className="big"><Nuc A={0} Z={0} s="ν" />, <Nuc A={0} Z={0} s="γ" /></td><td>A = 0, Z = 0 — na bilanci nemají vliv</td></tr>
          </tbody>
        </table>
        <p><b>Přeměna α:</b> Z − 2, A − 4. <b>β⁻:</b> Z + 1, A stejné. <b>β⁺:</b> Z − 1, A stejné. <b>γ:</b> nic se nemění.</p>
        <p><b>Slavné reakce:</b></p>
        <Eq note="Rutherford 1919 — první umělá přeměna jádra">
          <Nuc A={14} Z={7} s="N" /><Plus /><Nuc A={4} Z={2} s="He" /><Arr /><Nuc A={17} Z={8} s="O" /><Plus /><Nuc A={1} Z={1} s="p" />
        </Eq>
        <Eq note="Chadwick 1932 — objev neutronu">
          <Nuc A={9} Z={4} s="Be" /><Plus /><Nuc A={4} Z={2} s="He" /><Arr /><Nuc A={12} Z={6} s="C" /><Plus /><Nuc A={1} Z={0} s="n" />
        </Eq>
        <Eq note="manželé Joliot-Curieovi 1934 — umělá radioaktivita (PL příklad 1)">
          <Nuc A={27} Z={13} s="Al" /><Plus /><Nuc A={4} Z={2} s="He" /><Arr /><Nuc A={30} Z={15} s="P" /><Plus /><Nuc A={1} Z={0} s="n" />
        </Eq>
        <p><b>Energie reakce:</b> <span className="mono yl">E = (Σm<sub>před</sub> − Σm<sub>po</sub>) · c²</span>. Je-li E &gt; 0, energie se uvolňuje (exoenergetická reakce).</p>
        <p><b>Jak doplnit neznámou částici:</b> spočítej, kolik chybí v horní řadě (A) a v dolní řadě (Z) → podle Z najdi prvek v periodické tabulce.</p>
      </>
    ),
  },
  {
    id: 'stepeni', title: 'Štěpení jader',
    body: (
      <>
        <p><b>Štěpení</b> = rozdělení <b>těžkého</b> jádra (²³⁵U, ²³⁹Pu) na dvě středně těžká jádra. Spouští ho pohlcení <b>pomalého (tepelného) neutronu</b>.</p>
        <Eq note="≈ 200 MeV na jedno jádro (většinou kinetická energie úlomků → teplo)">
          <Nuc A={1} Z={0} s="n" /><Plus /><Nuc A={235} Z={92} s="U" /><Arr /><Nuc A={141} Z={56} s="Ba" /><Plus /><Nuc A={92} Z={36} s="Kr" /><Plus />3 <Nuc A={1} Z={0} s="n" />
        </Eq>
        <Eq note="jiná možnost — úlomky jsou pokaždé jiné">
          <Nuc A={1} Z={0} s="n" /><Plus /><Nuc A={235} Z={92} s="U" /><Arr /><Nuc A={140} Z={54} s="Xe" /><Plus /><Nuc A={94} Z={38} s="Sr" /><Plus />2 <Nuc A={1} Z={0} s="n" />
        </Eq>
        <ul>
          <li><b>Proč se uvolní energie:</b> úlomky (A ≈ 90–140) mají ε ≈ 8,5 MeV, uran jen 7,6 MeV. Odhad: <span className="mono">235 · (8,5 − 7,6) ≈ 200 MeV</span>.</li>
          <li><b>Řetězová reakce:</b> uvolní se 2–3 neutrony, které mohou štěpit další jádra. Multiplikační faktor <span className="mono">k</span>: k = 1 řízená reakce (reaktor), k &gt; 1 lavinovitá (bomba), k &lt; 1 reakce zaniká.</li>
          <li><b>Kritické množství</b> — minimální hmotnost paliva, při které se řetězová reakce udrží (neutrony neutečou povrchem).</li>
          <li><b>Úlomky jsou radioaktivní</b> (mají přebytek neutronů → přeměna β⁻) → jaderný odpad.</li>
        </ul>
        <p><b>Jaderný reaktor</b> (Temelín, Dukovany — tlakovodní VVER):</p>
        <ul>
          <li><b>palivo</b> — uran obohacený na 3–5 % ²³⁵U,</li>
          <li><b>moderátor</b> (voda, grafit) — zpomaluje neutrony, aby je ²³⁵U lépe pohlcoval,</li>
          <li><b>regulační tyče</b> (bor, kadmium) — pohlcují neutrony a řídí výkon (k = 1),</li>
          <li><b>chladivo</b> odvádí teplo → pára → turbína → generátor. Účinnost ≈ 33 %.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'synteza', title: 'Slučování (syntéza, fúze) jader',
    body: (
      <>
        <p><b>Syntéza</b> = spojení <b>lehkých</b> jader v těžší. Produkt má větší ε → energie se uvolní.</p>
        <Eq note="nejnadějnější reakce pro fúzní elektrárny: Q ≈ 17,6 MeV">
          <Nuc A={2} Z={1} s="H" /><Plus /><Nuc A={3} Z={1} s="H" /><Arr /><Nuc A={4} Z={2} s="He" /><Plus /><Nuc A={1} Z={0} s="n" />
        </Eq>
        <Eq note="Slunce a hvězdy — protonový cyklus, celkem ≈ 26,7 MeV">
          4 <Nuc A={1} Z={1} s="H" /><Arr /><Nuc A={4} Z={2} s="He" /><Plus />2 <Nuc A={0} Z="+1" s="e" /><Plus />2 ν
        </Eq>
        <ul>
          <li><b>Problém:</b> obě jádra jsou kladná a odpuzují se. Aby se přiblížila na dosah jaderných sil, musí mít obrovskou rychlost → teplota <b>10⁷–10⁸ K</b> (<b>termojaderná reakce</b>), látka je ve stavu <b>plazmatu</b>.</li>
          <li>Ve hvězdách drží plazma gravitace; na Zemi magnetické pole — <b>tokamak</b> (ITER ve Francii). Neřízená syntéza = vodíková bomba.</li>
          <li><b>Výhody:</b> deuterium je ve vodě téměř neomezeně, méně radioaktivního odpadu, nehrozí nekontrolovaná řetězová reakce.</li>
          <li><b>Na jeden nukleon</b> uvolní syntéza víc energie než štěpení: D+T 17,6 MeV / 5 ≈ 3,5 MeV, štěpení ²³⁵U ≈ 200 MeV / 236 ≈ 0,85 MeV.</li>
        </ul>
        <table className="tbl">
          <thead><tr><th></th><th>Štěpení</th><th>Syntéza</th></tr></thead>
          <tbody>
            <tr><td>jádra</td><td>těžká (A &gt; 56) se dělí</td><td>lehká (A &lt; 56) se spojují</td></tr>
            <tr><td>na grafu ε</td><td>zprava doleva k maximu</td><td>zleva doprava k maximu</td></tr>
            <tr><td>podmínka</td><td>pomalý neutron, kritické množství</td><td>teplota 10⁷–10⁸ K</td></tr>
            <tr><td>energie</td><td>≈ 200 MeV / jádro U</td><td>17,6 MeV / reakci D+T</td></tr>
            <tr><td>využití</td><td>jaderné elektrárny, atomová bomba</td><td>Slunce, H-bomba, výzkum (ITER)</td></tr>
          </tbody>
        </table>
      </>
    ),
  },
];

/* ═══════════════════════════════════════════════════════════════════
   ŘEŠENÉ PŘÍKLADY
   ═══════════════════════════════════════════════════════════════════ */
const DIFF = { e: ['Lehký ✨', '#4ade80'], m: ['Střední ⚡', YL], h: ['Těžký 🔥', '#fb923c'] };

const PROBLEMS = [
  /* ── PL Hmotnostní úbytek ── */
  {
    g: 'PL — Hmotnostní úbytek a vazebná energie', t: 'Tabulka: helium ⁴₂He (lehký prvek)', d: 'e',
    task: <>Doplň Z, N, vypočítej Δm, E<sub>v</sub> a ε pro <span className="big"><Nuc A={4} Z={2} s="He" /></span>, m<sub>j</sub> = 4,001 500 u.</>,
    given: [['Z', '2'], ['A', '4'], ['m_j', '4,001 500 u'], ['m_p', '1,007 276 u'], ['m_n', '1,008 665 u']],
    formula: 'N = A − Z ;  Δm = Z·mp + N·mn − mj ;  Ev = Δm · 931,5 ;  ε = Ev / A',
    steps: [
      'N = 4 − 2 = 2',
      'Z · mp = 2 · 1,007 276 = 2,014 552 u',
      'N · mn = 2 · 1,008 665 = 2,017 330 u',
      'součet = 4,031 882 u',
      'Δm = 4,031 882 − 4,001 500 = 0,030 382 u',
      'Ev = 0,030 382 · 931,5 = 28,30 MeV',
      'ε = 28,30 / 4 = 7,08 MeV/nukleon',
    ],
    result: 'Z = 2, N = 2, Δm = 0,030 382 u, Ev ≈ 28,3 MeV, ε ≈ 7,08 MeV/nukl.',
    checks: [{ l: 'Δm', u: 'u', v: 0.030382, tol: 0.01 }, { l: 'Ev', u: 'MeV', v: 28.30, tol: 0.01 }, { l: 'ε', u: 'MeV', v: 7.075, tol: 0.01 }],
  },
  {
    g: 'PL — Hmotnostní úbytek a vazebná energie', t: 'Tabulka: železo ⁵⁶₂₆Fe (stabilní prvek)', d: 'm',
    task: <>Doplň Z, N, vypočítej Δm, E<sub>v</sub> a ε pro <span className="big"><Nuc A={56} Z={26} s="Fe" /></span>, m<sub>j</sub> = 55,849 000 u (hodnota z pracovního listu).</>,
    given: [['Z', '26'], ['A', '56'], ['m_j', '55,849 000 u']],
    formula: 'Δm = Z·mp + N·mn − mj ;  Ev = Δm · 931,5 ;  ε = Ev / A',
    steps: [
      'N = 56 − 26 = 30',
      'Z · mp = 26 · 1,007 276 = 26,189 176 u',
      'N · mn = 30 · 1,008 665 = 30,259 950 u',
      'součet = 56,449 126 u',
      'Δm = 56,449 126 − 55,849 000 = 0,600 126 u',
      'Ev = 0,600 126 · 931,5 = 559,0 MeV',
      'ε = 559,0 / 56 = 9,98 MeV/nukleon',
    ],
    result: 'Z = 26, N = 30, Δm = 0,600 126 u, Ev ≈ 559 MeV, ε ≈ 9,98 MeV/nukl.',
    note: 'Pozor: 55,849 je průměrná relativní atomová hmotnost železa z periodické tabulky, ne hmotnost jádra ⁵⁶Fe (ta je 55,920 7 u). Se skutečnou hodnotou vyjde Δm = 0,528 u, Ev = 492 MeV a ε = 8,79 MeV/nukleon — to je správná hodnota z grafu. V písemce počítej se zadanými čísly; závěr (Fe je nejstabilnější) platí v obou případech.',
    checks: [{ l: 'Δm', u: 'u', v: 0.600126, tol: 0.01 }, { l: 'Ev', u: 'MeV', v: 559.0, tol: 0.01 }, { l: 'ε', u: 'MeV', v: 9.982, tol: 0.01 }],
  },
  {
    g: 'PL — Hmotnostní úbytek a vazebná energie', t: 'Tabulka: uran ²³⁸₉₂U (těžký prvek)', d: 'm',
    task: <>Doplň Z, N, vypočítej Δm, E<sub>v</sub> a ε pro <span className="big"><Nuc A={238} Z={92} s="U" /></span>, m<sub>j</sub> = 238,000 300 u.</>,
    given: [['Z', '92'], ['A', '238'], ['m_j', '238,000 300 u']],
    formula: 'Δm = Z·mp + N·mn − mj ;  Ev = Δm · 931,5 ;  ε = Ev / A',
    steps: [
      'N = 238 − 92 = 146',
      'Z · mp = 92 · 1,007 276 = 92,669 392 u',
      'N · mn = 146 · 1,008 665 = 147,265 090 u',
      'součet = 239,934 482 u',
      'Δm = 239,934 482 − 238,000 300 = 1,934 182 u',
      'Ev = 1,934 182 · 931,5 = 1 801,7 MeV',
      'ε = 1 801,7 / 238 = 7,57 MeV/nukleon',
    ],
    result: 'Z = 92, N = 146, Δm = 1,934 182 u, Ev ≈ 1 802 MeV, ε ≈ 7,57 MeV/nukl.',
    checks: [{ l: 'Δm', u: 'u', v: 1.934182, tol: 0.005 }, { l: 'Ev', u: 'MeV', v: 1801.7, tol: 0.005 }, { l: 'ε', u: 'MeV', v: 7.570, tol: 0.01 }],
  },
  {
    g: 'PL — Hmotnostní úbytek a vazebná energie', t: 'Úkol A: Které jádro je nejstabilnější?', d: 'e',
    task: 'Na základě tabulky a grafu urči, které ze tří jader (⁴He, ⁵⁶Fe, ²³⁸U) je nejstabilnější, a vysvětli proč.',
    given: [['ε(He)', '7,08 MeV'], ['ε(Fe)', '9,98 (reálně 8,79) MeV'], ['ε(U)', '7,57 MeV']],
    formula: 'stabilita ↔ vazebná energie na nukleon ε',
    steps: [
      'Porovnáme ε, ne celkovou Ev.',
      'ε(Fe) > ε(U) > ε(He).',
      'Železo leží v maximu křivky ε(A) — každý jeho nukleon je vázán nejpevněji, k rozbití jádra je potřeba na jeden nukleon nejvíc energie.',
    ],
    result: 'Nejstabilnější je ⁵⁶Fe, protože má největší vazebnou energii na jeden nukleon (leží na maximu grafu).',
  },
  {
    g: 'PL — Hmotnostní úbytek a vazebná energie', t: 'Úkol B: Paradox celkové vs. měrné energie', d: 'e',
    task: 'Jádro ²³⁸U má mnohem vyšší celkovou vazebnou energii než ⁵⁶Fe. Přesto je železo stabilnější. Vysvětli 1–2 větami.',
    given: [['Ev(U)', '≈ 1 802 MeV'], ['Ev(Fe)', '≈ 559 MeV']],
    formula: 'ε = Ev / A',
    steps: [
      'Celková Ev roste s počtem nukleonů — uran jich má 238, železo jen 56.',
      'Rozhodující je energie na jeden nukleon: ε(U) ≈ 7,6 MeV < ε(Fe).',
    ],
    result: 'Uran má větší Ev jen proto, že má víc nukleonů; na jeden nukleon připadá menší vazebná energie než u železa, takže jeho nukleony jsou vázány slaběji a jádro je méně stabilní.',
  },
  {
    g: 'PL — Hmotnostní úbytek a vazebná energie', t: 'Úkol C: Syntéza vs. štěpení — odkud se bere energie', d: 'm',
    task: 'Vysvětli pomocí grafu ε(A), proč se energie uvolňuje při syntéze lehkých jader i při štěpení těžkých jader.',
    given: [['maximum ε', 'A ≈ 56 (Fe)']],
    formula: 'E = ΣEv(produkty) − ΣEv(výchozí)',
    steps: [
      'Energie se uvolní, když vznikají jádra s větším ε (pevněji vázaná) — rozdíl vazebných energií odejde jako energie (Δm·c²).',
      'Lehká jádra (vlevo od Fe): spojením vznikne těžší jádro s větším ε → SYNTÉZA (např. ²H + ³H → ⁴He + n, 17,6 MeV).',
      'Těžká jádra (vpravo od Fe): rozdělením vzniknou středně těžká jádra s větším ε → ŠTĚPENÍ (²³⁵U → Ba + Kr, ≈ 200 MeV).',
      'Železo je „konečná stanice“: z jeho slučování ani štěpení energii nezískáme.',
    ],
    result: 'Obojí posouvá jádra směrem k maximu křivky (Fe), kde je ε největší; zvýšení vazebné energie se uvolní.',
  },
  /* ── PL Jaderné reakce ── */
  {
    g: 'PL — Jaderné reakce a fyzika jádra', t: '1: Ostřelování hliníku částicí α', d: 'e',
    task: <>Jádro <Nuc A={27} Z={13} s="Al" /> pohltí částici α a uvolní jeden neutron. 1A) Zapiš rovnici. 1B) Urči vzniklý nuklid (Z, N, značka).</>,
    given: [['vlevo', '²⁷₁₃Al + ⁴₂He'], ['vpravo', 'X + ¹₀n']],
    formula: 'zachování A (horní čísla) a Z (dolní čísla)',
    steps: [
      'A: 27 + 4 = A + 1 → A = 30',
      'Z: 13 + 2 = Z + 0 → Z = 15 → fosfor P',
      <Eq key="e"><Nuc A={27} Z={13} s="Al" /><Plus /><Nuc A={4} Z={2} s="He" /><Arr /><Nuc A={30} Z={15} s="P" /><Plus /><Nuc A={1} Z={0} s="n" /></Eq>,
      'N = 30 − 15 = 15',
    ],
    result: 'Vznikl ³⁰₁₅P (fosfor-30): Z = 15, N = 15. Je radioaktivní — první uměle vyrobený radionuklid (Joliot-Curie 1934).',
  },
  {
    g: 'PL — Jaderné reakce a fyzika jádra', t: '2: Přeměna β⁺ fluoru-18 (PET)', d: 'e',
    task: <>Izotop <Nuc A={18} Z={9} s="F" /> se přeměňuje β⁺ — vyletí pozitron e⁺ a neutrino ν<sub>e</sub>. 2A) Zapiš rovnici. 2B) Jaký nuklid vznikne?</>,
    given: [['pozitron', '⁰₊₁e'], ['neutrino', '⁰₀ν']],
    formula: 'β⁺: p → n + e⁺ + ν  ⇒  Z − 1, A beze změny',
    steps: [
      'A: 18 = A + 0 + 0 → A = 18',
      'Z: 9 = Z + 1 + 0 → Z = 8 → kyslík O',
      <Eq key="e"><Nuc A={18} Z={9} s="F" /><Arr /><Nuc A={18} Z={8} s="O" /><Plus /><Nuc A={0} Z="+1" s="e" /><Plus /><Nuc A={0} Z={0} s="ν" /></Eq>,
    ],
    result: 'Vznikne ¹⁸₈O (kyslík-18, stabilní). Pozitron anihiluje s elektronem → 2 fotony γ, které detekuje PET.',
  },
  {
    g: 'PL — Jaderné reakce a fyzika jádra', t: '3: Řetězová reakce dusíku (X a Y)', d: 'm',
    task: <><Nuc A={14} Z={7} s="N" /> ostřelován neutronem uvolní proton a vznikne X. X se přemění β⁺ na Y. 3A) Rovnice + X. 3B) Rovnice + Y.</>,
    given: [['1. krok', '¹⁴₇N + ¹₀n → X + ¹₁p'], ['2. krok', 'X → Y + ⁰₊₁e + ν']],
    formula: 'zachování A a Z v každém kroku',
    steps: [
      '3A — A: 14 + 1 = A + 1 → A = 14;  Z: 7 + 0 = Z + 1 → Z = 6 → uhlík',
      <Eq key="a"><Nuc A={14} Z={7} s="N" /><Plus /><Nuc A={1} Z={0} s="n" /><Arr /><Nuc A={14} Z={6} s="C" /><Plus /><Nuc A={1} Z={1} s="p" /></Eq>,
      '3B — β⁺: A zůstává 14, Z = 6 − 1 = 5 → bor',
      <Eq key="b"><Nuc A={14} Z={6} s="C" /><Arr /><Nuc A={14} Z={5} s="B" /><Plus /><Nuc A={0} Z="+1" s="e" /><Plus /><Nuc A={0} Z={0} s="ν" /></Eq>,
    ],
    result: 'X = ¹⁴₆C (uhlík-14), Y = ¹⁴₅B (bor-14) — podle zadání.',
    note: 'Fyzikální poznámka: první reakce je skutečná — takhle vzniká ¹⁴C v atmosféře. Ve skutečnosti se ale ¹⁴C přeměňuje β⁻ (ne β⁺): ¹⁴₆C → ¹⁴₇N + e⁻ + ν̄ (radiouhlíková metoda), a ¹⁴B stabilní není. V písemce ale piš to, co chce zadání (β⁺ → Z − 1 → bor); případně můžeš poznámku připsat.',
  },
  {
    g: 'PL — Jaderné reakce a fyzika jádra', t: '4A: Tepelný výkon reaktoru', d: 'e',
    task: 'Elektrický výkon bloku Pe = 1 000 MW, účinnost η = 33 %. Jaký tepelný výkon Pt musí reaktor vyrábět?',
    given: [['Pe', '1 000 MW'], ['η', '0,33']],
    formula: 'η = Pe / Pt  ⇒  Pt = Pe / η',
    steps: ['Pt = 1 000 MW / 0,33', 'Pt = 3 030 MW ≈ 3,03 · 10⁹ W'],
    result: 'Pt ≈ 3 030 MW = 3,03 · 10⁹ W',
    checks: [{ l: 'Pt', u: 'MW', v: 3030.3, tol: 0.01 }],
  },
  {
    g: 'PL — Jaderné reakce a fyzika jádra', t: '4B: Energie z jednoho štěpení v joulech', d: 'e',
    task: 'Při štěpení jednoho jádra ²³⁵U se uvolní E₁ = 200 MeV. Kolik je to joulů? (1 eV = 1,602 · 10⁻¹⁹ J)',
    given: [['E₁', '200 MeV = 200 · 10⁶ eV']],
    formula: 'E [J] = E [eV] · 1,602 · 10⁻¹⁹',
    steps: ['E₁ = 200 · 10⁶ · 1,602 · 10⁻¹⁹ J', 'E₁ = 3,204 · 10⁻¹¹ J'],
    result: 'E₁ ≈ 3,20 · 10⁻¹¹ J',
    checks: [{ l: 'E₁', u: 'J', v: 3.204e-11, tol: 0.01 }],
  },
  {
    g: 'PL — Jaderné reakce a fyzika jádra', t: '4C: Spotřeba ²³⁵U za 1 den', d: 'h',
    task: 'Kolik kg ²³⁵U se v reaktoru spotřebuje (rozštěpí) za 24 h nepřetržitého provozu? M = 235 g/mol, Nₐ = 6,022 · 10²³ mol⁻¹.',
    given: [['Pt', '3,03 · 10⁹ W'], ['t', '24 h = 86 400 s'], ['E₁', '3,204 · 10⁻¹¹ J'], ['M', '0,235 kg/mol'], ['Nₐ', '6,022 · 10²³ mol⁻¹']],
    formula: 'Q = Pt · t ;  N = Q / E₁ ;  n = N / Nₐ ;  m = n · M',
    steps: [
      'Q = 3,030 · 10⁹ W · 86 400 s = 2,618 · 10¹⁴ J',
      'N = Q / E₁ = 2,618 · 10¹⁴ / 3,204 · 10⁻¹¹ = 8,17 · 10²⁴ jader',
      'n = N / Nₐ = 8,17 · 10²⁴ / 6,022 · 10²³ = 13,57 mol',
      'm = n · M = 13,57 mol · 235 g/mol = 3 189 g',
    ],
    result: 'm ≈ 3,19 kg ²³⁵U za den',
    note: 'Pozor na past: počítá se s TEPELNÝM výkonem (3 030 MW), ne s elektrickým — teplo vzniká štěpením, elektřina je jen jeho třetina. S 1 000 MW by vyšlo jen 1,05 kg.',
    checks: [{ l: 'm', u: 'kg', v: 3.189, tol: 0.02 }],
  },
  /* ── Další typové příklady ── */
  {
    g: 'Další typové příklady', t: 'Složení atomu a iontu', d: 'e',
    task: <>Kolik protonů, neutronů a elektronů má <Nuc A={235} Z={92} s="U" /> a kolik iont <Nuc A={40} Z={20} s="Ca" /><sup>2+</sup>?</>,
    given: [['U', 'Z = 92, A = 235'], ['Ca²⁺', 'Z = 20, A = 40, náboj +2']],
    formula: 'N = A − Z ;  počet e⁻ = Z − náboj iontu',
    steps: ['U: p = 92, n = 235 − 92 = 143, e⁻ = 92', 'Ca²⁺: p = 20, n = 40 − 20 = 20, e⁻ = 20 − 2 = 18'],
    result: '²³⁵U: 92 p, 143 n, 92 e⁻ · ⁴⁰Ca²⁺: 20 p, 20 n, 18 e⁻',
  },
  {
    g: 'Další typové příklady', t: 'Poloměr jádra a hustota jaderné hmoty', d: 'm',
    task: 'Urči poloměr jádra ²³⁸U (r₀ = 1,2 · 10⁻¹⁵ m) a hustotu jaderné hmoty. Kolikrát je atom (d ≈ 10⁻¹⁰ m) větší?',
    given: [['A', '238'], ['r₀', '1,2 · 10⁻¹⁵ m'], ['m', '≈ A · u']],
    formula: 'R = r₀ · ∛A ;  ρ = m / V = A·u / (4/3 · π · r₀³ · A)',
    steps: [
      '∛238 = 6,20',
      'R = 1,2 · 10⁻¹⁵ · 6,20 = 7,4 · 10⁻¹⁵ m',
      'ρ = u / (4/3 · π · r₀³) = 1,66 · 10⁻²⁷ / (4,19 · 1,73 · 10⁻⁴⁵) = 2,3 · 10¹⁷ kg/m³ (A se vykrátí!)',
      'd_atom / d_jádro = 10⁻¹⁰ / (2 · 7,4 · 10⁻¹⁵) ≈ 7 000 (u lehkých jader až 10⁵)',
    ],
    result: 'R ≈ 7,4 · 10⁻¹⁵ m, ρ ≈ 2,3 · 10¹⁷ kg/m³ (pro všechna jádra stejná)',
    checks: [{ l: 'R', u: 'm', v: 7.44e-15, tol: 0.02 }],
  },
  {
    g: 'Další typové příklady', t: 'Vazebná energie ⁴He v joulech (přes kg)', d: 'm',
    task: 'Hmotnostní schodek ⁴He je Δm = 0,030 382 u. Spočítej Ev v joulech pomocí E = Δm·c² a převeď na MeV.',
    given: [['Δm', '0,030 382 u'], ['u', '1,6605 · 10⁻²⁷ kg'], ['c', '3 · 10⁸ m/s']],
    formula: 'Ev = Δm · c²',
    steps: [
      'Δm = 0,030 382 · 1,6605 · 10⁻²⁷ = 5,045 · 10⁻²⁹ kg',
      'Ev = 5,045 · 10⁻²⁹ · (3 · 10⁸)² = 5,045 · 10⁻²⁹ · 9 · 10¹⁶ = 4,54 · 10⁻¹² J',
      'Ev = 4,54 · 10⁻¹² / 1,602 · 10⁻¹³ = 28,3 MeV ✓ (stejně jako přes 931,5)',
    ],
    result: 'Ev ≈ 4,54 · 10⁻¹² J ≈ 28,3 MeV',
    checks: [{ l: 'Ev', u: 'J', v: 4.54e-12, tol: 0.01 }],
  },
  {
    g: 'Další typové příklady', t: 'Deuteron — nejslabší jádro', d: 'e',
    task: 'Hmotnost jádra deuteria ²₁H je mⱼ = 2,013 553 u. Urči Δm, Ev a ε.',
    given: [['Z', '1'], ['N', '1'], ['m_j', '2,013 553 u']],
    formula: 'Δm = mp + mn − mj',
    steps: ['mp + mn = 1,007 276 + 1,008 665 = 2,015 941 u', 'Δm = 2,015 941 − 2,013 553 = 0,002 388 u', 'Ev = 0,002 388 · 931,5 = 2,22 MeV', 'ε = 2,22 / 2 = 1,11 MeV'],
    result: 'Δm = 0,002 388 u, Ev ≈ 2,22 MeV, ε ≈ 1,11 MeV/nukl.',
    checks: [{ l: 'Ev', u: 'MeV', v: 2.224, tol: 0.01 }],
  },
  {
    g: 'Další typové příklady', t: 'Lithium — z hmotnosti ATOMU', d: 'h',
    task: 'Tabulka udává hmotnost atomu ⁷₃Li: mₐ = 7,016 003 u. Urči ε. (mₑ = 0,000 549 u)',
    given: [['Z', '3'], ['N', '4'], ['m_a', '7,016 003 u'], ['m_e', '0,000 549 u']],
    formula: 'mj = ma − Z·me ;  Δm = Z·mp + N·mn − mj',
    steps: [
      'mj = 7,016 003 − 3 · 0,000 549 = 7,014 356 u',
      'Z·mp + N·mn = 3,021 828 + 4,034 660 = 7,056 488 u',
      'Δm = 7,056 488 − 7,014 356 = 0,042 132 u',
      'Ev = 0,042 132 · 931,5 = 39,25 MeV',
      'ε = 39,25 / 7 = 5,61 MeV',
    ],
    result: 'ε ≈ 5,61 MeV/nukleon',
    note: 'Kdybys elektrony neodečetl, vyšlo by Δm o 0,001 647 u menší (chyba ≈ 4 %).',
    checks: [{ l: 'ε', u: 'MeV', v: 5.607, tol: 0.01 }],
  },
  {
    g: 'Další typové příklady', t: 'Doplň chybějící částici', d: 'e',
    task: <>Doplň: a) <Nuc A={9} Z={4} s="Be" /> + <Nuc A={4} Z={2} s="He" /> → <Nuc A={12} Z={6} s="C" /> + ?  b) <Nuc A={235} Z={92} s="U" /> + n → <Nuc A={144} Z={56} s="Ba" /> + <Nuc A={89} Z={36} s="Kr" /> + ? n  c) <Nuc A={226} Z={88} s="Ra" /> → ? + α</>,
    given: [['zachování', 'A i Z']],
    formula: 'ΣA vlevo = ΣA vpravo ;  ΣZ vlevo = ΣZ vpravo',
    steps: [
      'a) A: 13 − 12 = 1, Z: 6 − 6 = 0 → ¹₀n (neutron)',
      'b) A: 236 − 144 − 89 = 3, Z: 92 − 56 − 36 = 0 → 3 neutrony',
      'c) A: 226 − 4 = 222, Z: 88 − 2 = 86 → ²²²₈₆Rn (radon)',
    ],
    result: 'a) neutron · b) 3 n · c) ²²²₈₆Rn',
  },
  {
    g: 'Další typové příklady', t: 'Energie syntézy D + T', d: 'm',
    task: <>Spočítej energii reakce <Nuc A={2} Z={1} s="H" /> + <Nuc A={3} Z={1} s="H" /> → <Nuc A={4} Z={2} s="He" /> + n. Hmotnosti jader: m(D) = 2,013 553 u, m(T) = 3,015 501 u, m(He) = 4,001 505 u, mₙ = 1,008 665 u.</>,
    given: [['před', 'D + T'], ['po', 'He + n']],
    formula: 'E = (Σm před − Σm po) · 931,5 MeV',
    steps: [
      'Σm před = 2,013 553 + 3,015 501 = 5,029 054 u',
      'Σm po = 4,001 505 + 1,008 665 = 5,010 170 u',
      'Δm = 0,018 884 u',
      'E = 0,018 884 · 931,5 = 17,6 MeV',
    ],
    result: 'E ≈ 17,6 MeV (uvolní se)',
    checks: [{ l: 'E', u: 'MeV', v: 17.59, tol: 0.01 }],
  },
  {
    g: 'Další typové příklady', t: 'Energie štěpení ²³⁵U z hmotností', d: 'h',
    task: <>Reakce n + <Nuc A={235} Z={92} s="U" /> → <Nuc A={141} Z={56} s="Ba" /> + <Nuc A={92} Z={36} s="Kr" /> + 3n. Hmotnosti atomů: U 235,043 930 u, Ba 140,914 411 u, Kr 91,926 156 u, mₙ = 1,008 665 u. Kolik energie se uvolní?</>,
    given: [['elektrony', '92 = 56 + 36 → se vyruší, lze počítat s atomy']],
    formula: 'E = (Σm před − Σm po) · 931,5',
    steps: [
      'Σm před = 235,043 930 + 1,008 665 = 236,052 595 u',
      'Σm po = 140,914 411 + 91,926 156 + 3 · 1,008 665 = 235,866 562 u',
      'Δm = 0,186 033 u',
      'E = 0,186 033 · 931,5 = 173 MeV',
    ],
    result: 'E ≈ 173 MeV (spolu s následnými přeměnami úlomků celkem ≈ 200 MeV)',
    checks: [{ l: 'E', u: 'MeV', v: 173.3, tol: 0.01 }],
  },
  {
    g: 'Další typové příklady', t: 'Odhad energie štěpení z grafu ε', d: 'm',
    task: 'Uran ²³⁵U (ε ≈ 7,6 MeV) se rozštěpí na dvě jádra s ε ≈ 8,5 MeV. Odhadni uvolněnou energii.',
    given: [['A', '235'], ['ε před', '7,6 MeV'], ['ε po', '8,5 MeV']],
    formula: 'E ≈ A · (ε_po − ε_před)',
    steps: ['Ev(před) = 235 · 7,6 = 1 786 MeV', 'Ev(po) ≈ 235 · 8,5 = 1 998 MeV', 'E ≈ 1 998 − 1 786 ≈ 210 MeV'],
    result: 'E ≈ 200 MeV na jedno jádro',
    checks: [{ l: 'E', u: 'MeV', v: 211.5, tol: 0.06 }],
  },
  {
    g: 'Další typové příklady', t: 'Energie ze vzniku 1 molu helia', d: 'h',
    task: 'Kolik energie se uvolní, když z volných nukleonů vznikne 1 mol (4 g) jader ⁴He? Ev(He) = 4,54 · 10⁻¹² J. Kolik kg uhlí by to nahradilo (výhřevnost 30 MJ/kg)?',
    given: [['Nₐ', '6,022 · 10²³'], ['Ev', '4,54 · 10⁻¹² J'], ['H', '3 · 10⁷ J/kg']],
    formula: 'E = Nₐ · Ev ;  m_uhlí = E / H',
    steps: ['E = 6,022 · 10²³ · 4,54 · 10⁻¹² = 2,73 · 10¹² J', 'm = 2,73 · 10¹² / 3 · 10⁷ = 91 000 kg'],
    result: 'E ≈ 2,7 · 10¹² J — tolik jako spálení ≈ 91 tun uhlí',
    checks: [{ l: 'E', u: 'J', v: 2.734e12, tol: 0.02 }],
  },
];

function CheckInput({ c }) {
  const [val, setVal] = useState('');
  const [st, setSt] = useState(null);
  const check = () => {
    const n = parseNum(val);
    if (isNaN(n)) { setSt('nan'); return; }
    setSt(Math.abs(n - c.v) <= Math.abs(c.v) * c.tol ? 'ok' : 'bad');
  };
  const col = st === 'ok' ? OK : st === 'bad' ? BAD : st === 'nan' ? YL : 'var(--line)';
  return (
    <div className="chk">
      <span className="mono chkL">{c.l} =</span>
      <input className="inp" style={{ borderColor: col }} value={val} inputMode="decimal"
        onChange={e => { setVal(e.target.value); setSt(null); }}
        onKeyDown={e => e.key === 'Enter' && check()} placeholder="výsledek" />
      <span className="mono dim">{c.u}</span>
      <button className="btn btnS" onClick={check}>Ověřit</button>
      {st === 'ok' && <span style={{ color: OK }} className="mono">✓</span>}
      {st === 'bad' && <span style={{ color: BAD }} className="mono">✗ zkus znovu</span>}
      {st === 'nan' && <span style={{ color: YL }} className="mono">číslo?</span>}
    </div>
  );
}

function Problem({ p, i }) {
  const [open, setOpen] = useState(false);
  const [dl, dc] = DIFF[p.d];
  return (
    <div className="box tk prob">
      <div className="probHead">
        <span className="mono pnum">Př. {String(i + 1).padStart(2, '0')}</span>
        <span className="probT">{p.t}</span>
        <span className="badge" style={{ color: dc, borderColor: dc }}>{dl}</span>
      </div>
      <div className="probTask">{p.task}</div>
      {p.checks && (
        <div className="chks">
          <div className="mono dim small">ZKUS SÁM — zadej výsledek (tolerance ±{Math.round(Math.max(...p.checks.map(c => c.tol)) * 100)} %):</div>
          {p.checks.map((c, k) => <CheckInput key={k} c={c} />)}
        </div>
      )}
      <button className="btn" onClick={() => setOpen(o => !o)}>{open ? '▲ Skrýt řešení' : '▼ Zobrazit řešení'}</button>
      {open && (
        <div className="sol">
          <div className="solSec"><div className="mono solL">1 · ZADÁNO</div>
            <div className="given">{p.given.map(([s, v], k) => <span key={k} className="gv"><span className="qs">{s.replace('_', '')}</span> = <span className="qv">{v}</span></span>)}</div>
          </div>
          <div className="solSec"><div className="mono solL">2 · VZOREC</div><div className="formula sm">{p.formula}</div></div>
          <div className="solSec"><div className="mono solL">3 · POSTUP</div>
            <ol className="steps">{p.steps.map((s, k) => <li key={k} style={{ animationDelay: `${k * 0.08}s` }}>{s}</li>)}</ol>
          </div>
          <div className="solSec"><div className="mono solL">4 · VÝSLEDEK</div><div className="result">{p.result}</div></div>
          {p.note && <div className="warn">⚠ {p.note}</div>}
        </div>
      )}
    </div>
  );
}

function ProblemsTab() {
  const groups = [...new Set(PROBLEMS.map(p => p.g))];
  const [g, setG] = useState(groups[0]);
  return (
    <div>
      <div className="seg">
        {groups.map(x => <button key={x} className={'segB' + (g === x ? ' on' : '')} onClick={() => setG(x)}>{x}</button>)}
      </div>
      {PROBLEMS.map((p, i) => p.g === g && <Problem key={i} p={p} i={i} />)}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TRENAŽÉR + KALKULAČKA
   ═══════════════════════════════════════════════════════════════════ */
const NUCLIDES = [
  ['H', 1, 2, 2.014102], ['H', 1, 3, 3.016049], ['He', 2, 3, 3.016029], ['He', 2, 4, 4.002603],
  ['Li', 3, 6, 6.015123], ['Li', 3, 7, 7.016003], ['Be', 4, 9, 9.012183], ['C', 6, 12, 12.000000],
  ['N', 7, 14, 14.003074], ['O', 8, 16, 15.994915], ['Ne', 10, 20, 19.992440], ['Na', 11, 23, 22.989769],
  ['Al', 13, 27, 26.981538], ['Si', 14, 28, 27.976927], ['Ca', 20, 40, 39.962591], ['Fe', 26, 56, 55.934936],
  ['Ni', 28, 62, 61.928345], ['Cu', 29, 63, 62.929598], ['Kr', 36, 84, 83.911498], ['Zr', 40, 90, 89.904698],
  ['Ag', 47, 107, 106.905092], ['Sn', 50, 120, 119.902202], ['Ba', 56, 138, 137.905247], ['Pb', 82, 208, 207.976652],
  ['U', 92, 235, 235.043930], ['U', 92, 238, 238.050788],
].map(([s, Z, A, ma]) => ({ s, Z, A, mj: +(ma - Z * ME).toFixed(6) }));

function calc(Z, A, mj) {
  const N = A - Z, sum = Z * MP + N * MN, dm = sum - mj, Ev = dm * K_U;
  return { N, sum, dm, Ev, eps: Ev / A };
}

function Trainer() {
  const [k, setK] = useState(() => Math.floor(Math.random() * NUCLIDES.length));
  const [inp, setInp] = useState({ N: '', dm: '', Ev: '', eps: '' });
  const [shown, setShown] = useState(false);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState({ ok: 0, all: 0 });
  const nu = NUCLIDES[k];
  const r = calc(nu.Z, nu.A, nu.mj);
  const fields = [
    { id: 'N', l: 'N', u: '', v: r.N, tol: 0 },
    { id: 'dm', l: 'Δm', u: 'u', v: r.dm, tol: 0.01 },
    { id: 'Ev', l: 'Ev', u: 'MeV', v: r.Ev, tol: 0.01 },
    { id: 'eps', l: 'ε', u: 'MeV/nukl.', v: r.eps, tol: 0.015 },
  ];
  const good = f => { const n = parseNum(inp[f.id]); return !isNaN(n) && Math.abs(n - f.v) <= Math.abs(f.v) * f.tol + (f.tol === 0 ? 0.01 : 0); };
  const doCheck = () => {
    if (checked) return;
    setChecked(true);
    const all = fields.every(good);
    setScore(s => ({ ok: s.ok + (all ? 1 : 0), all: s.all + 1 }));
  };
  const next = () => {
    let n; do { n = Math.floor(Math.random() * NUCLIDES.length); } while (n === k);
    setK(n); setInp({ N: '', dm: '', Ev: '', eps: '' }); setShown(false); setChecked(false);
  };
  return (
    <div className="box tk pad">
      <div className="mono label">TRENAŽÉR — náhodné jádro, počítej jako v písemce (kalkulačka v ruce!)</div>
      <div className="trainHead">
        <span className="huge"><Nuc A={nu.A} Z={nu.Z} s={nu.s} /></span>
        <div className="mono">
          <div><Q s="mⱼ" v={fmt(nu.mj, 6)} u="u" /></div>
          <div className="dim small">mp = 1,007 276 u · mn = 1,008 665 u · 1 u ≙ 931,5 MeV</div>
        </div>
        <div className="mono yl scoreBox">{score.ok} / {score.all}</div>
      </div>
      <div className="trainGrid">
        {fields.map(f => (
          <label key={f.id} className="tfield">
            <span className="mono">{f.l} {f.u && <span className="dim">[{f.u}]</span>}</span>
            <input className="inp" inputMode="decimal" value={inp[f.id]}
              style={{ borderColor: checked ? (good(f) ? OK : BAD) : 'var(--line)' }}
              onChange={e => setInp(p => ({ ...p, [f.id]: e.target.value }))} />
            {checked && !good(f) && <span className="mono small" style={{ color: BAD }}>správně: {f.id === 'N' ? f.v : fmt(f.v, f.id === 'dm' ? 6 : f.id === 'Ev' ? 2 : 3)}</span>}
          </label>
        ))}
      </div>
      <div className="btnRow">
        <button className="btn btnA" onClick={doCheck} disabled={checked} style={{ opacity: checked ? 0.4 : 1 }}>Zkontrolovat</button>
        <button className="btn" onClick={() => setShown(s => !s)}>{shown ? 'Skrýt postup' : 'Ukázat postup'}</button>
        <button className="btn" onClick={next}>Další jádro →</button>
      </div>
      {shown && (
        <ol className="steps sol">
          <li>N = {nu.A} − {nu.Z} = {r.N}</li>
          <li>Z·mp + N·mn = {nu.Z} · 1,007 276 + {r.N} · 1,008 665 = {fmt(r.sum, 6)} u</li>
          <li>Δm = {fmt(r.sum, 6)} − {fmt(nu.mj, 6)} = {fmt(r.dm, 6)} u</li>
          <li>Ev = {fmt(r.dm, 6)} · 931,5 = {fmt(r.Ev, 2)} MeV</li>
          <li>ε = {fmt(r.Ev, 2)} / {nu.A} = {fmt(r.eps, 3)} MeV/nukleon</li>
        </ol>
      )}
    </div>
  );
}

function Calculator() {
  const [Z, setZ] = useState('26'); const [A, setA] = useState('56'); const [mj, setMj] = useState('55,849');
  const z = parseInt(Z, 10), a = parseInt(A, 10), m = parseNum(mj);
  const ok = z > 0 && a >= z && m > 0;
  const r = ok ? calc(z, a, m) : null;
  return (
    <div className="box tk pad">
      <div className="mono label">KALKULAČKA — ověř si vlastní výpočet (hmotnost JÁDRA)</div>
      <div className="trainGrid">
        <label className="tfield"><span className="mono">Z</span><input className="inp" value={Z} inputMode="numeric" onChange={e => setZ(e.target.value)} /></label>
        <label className="tfield"><span className="mono">A</span><input className="inp" value={A} inputMode="numeric" onChange={e => setA(e.target.value)} /></label>
        <label className="tfield"><span className="mono">mⱼ [u]</span><input className="inp" value={mj} inputMode="decimal" onChange={e => setMj(e.target.value)} /></label>
      </div>
      {r ? (
        <div className="calcOut">
          <Q s="N" v={r.N} /><Q s="Σm" v={fmt(r.sum, 6)} u="u" /><Q s="Δm" v={fmt(r.dm, 6)} u="u" />
          <Q s="Δm" v={sci(r.dm * 1.6605e-27)} u="kg" /><Q s="Ev" v={fmt(r.Ev, 2)} u="MeV" />
          <Q s="Ev" v={sci(r.Ev * 1.602e-13)} u="J" /><Q s="ε" v={fmt(r.eps, 3)} u="MeV/nukl." />
        </div>
      ) : <div className="dim">Zadej Z, A (A ≥ Z) a hmotnost jádra.</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   KVÍZ
   ═══════════════════════════════════════════════════════════════════ */
const QUESTIONS = [
  { question: 'Kolik neutronů má jádro ⁵⁶₂₆Fe?', type: 'single', options: ['30', '26', '56', '82'], correct: [0], explanation: 'N = A − Z = 56 − 26 = 30.' },
  { question: 'Co udává protonové číslo Z?', type: 'single', options: ['počet protonů v jádře (a tím prvek)', 'počet nukleonů', 'počet neutronů', 'hmotnost atomu v u'], correct: [0], explanation: 'Z = počet protonů = náboj jádra v násobcích e; v neutrálním atomu i počet elektronů. Určuje, o jaký prvek jde.' },
  { question: 'Izotopy jednoho prvku se liší v…', type: 'single', options: ['počtu neutronů', 'počtu protonů', 'počtu elektronů v neutrálním atomu', 'chemických vlastnostech'], correct: [0], explanation: 'Izotopy mají stejné Z (stejný prvek, stejná chemie), ale různé N, a tedy různé A.' },
  { question: 'Jaký je řádově průměr atomového jádra?', type: 'single', options: ['10⁻¹⁵ m', '10⁻¹⁰ m', '10⁻⁶ m', '10⁻²⁰ m'], correct: [0], explanation: 'Jádro má 10⁻¹⁵–10⁻¹⁴ m, celý atom 10⁻¹⁰ m — asi 100 000× víc.', tip: 'Jádro = kulička 1 cm → atom 1 km.' },
  { question: 'Poloměr jádra roste s nukleonovým číslem jako…', type: 'single', options: ['R = r₀ · ∛A', 'R = r₀ · A', 'R = r₀ · A²', 'R = r₀ · √A'], correct: [0], explanation: 'Objem jádra je úměrný A (nukleony jsou „natěsnané“), proto R ~ ∛A a hustota všech jader je stejná.' },
  { question: 'Která vlastnost NEPLATÍ pro jaderné síly?', type: 'single', options: ['mají nekonečný dosah', 'jsou přitažlivé', 'nezávisí na náboji', 'jsou nasycené'], correct: [0], explanation: 'Jaderné síly mají velmi krátký dosah ≈ 10⁻¹⁵ m. Nekonečný dosah má elektrická (a gravitační) síla.' },
  { question: 'Hmotnostní schodek Δm je…', type: 'single', options: ['rozdíl mezi součtem hmotností volných nukleonů a hmotností jádra', 'rozdíl hmotností protonu a neutronu', 'hmotnost elektronového obalu', 'hmotnost, o kterou je jádro těžší než nukleony'], correct: [0], explanation: 'Δm = Z·mp + N·mn − mj > 0. Jádro je LEHČÍ než jeho volné nukleony.' },
  { question: 'Proč je hmotnost jádra menší než součet hmotností nukleonů?', type: 'single', options: ['při vzniku jádra se uvolní vazebná energie a s ní hmotnost E = mc²', 'nukleony v jádře ztratí elektrony', 'část neutronů se rozpadne', 'jádro je stlačené gravitací'], correct: [0], explanation: 'Energie a hmotnost jsou ekvivalentní. Uvolněná vazebná energie Ev odnese hmotnost Δm = Ev/c².' },
  { question: 'Vazebná energie jádra je energie, která…', type: 'single', options: ['se uvolní při vzniku jádra z volných nukleonů', 'se uvolní při rozpadu jádra na nukleony', 'drží elektrony v obalu', 'odpovídá klidové energii celého jádra'], correct: [0], explanation: 'Ev se uvolní při vzniku jádra; stejnou energii musíme dodat, abychom jádro rozložili na nukleony.' },
  { question: 'Hmotnostnímu schodku 1 u odpovídá energie přibližně…', type: 'single', options: ['931,5 MeV', '1,602 · 10⁻¹⁹ J', '931,5 eV', '9 · 10¹⁶ J'], correct: [0], explanation: '1 u · c² = 1,6605·10⁻²⁷ kg · c² ≈ 1,49·10⁻¹⁰ J ≈ 931,5 MeV.' },
  { question: 'Δm = 0,030 382 u. Jaká je vazebná energie?', type: 'single', options: ['28,3 MeV', '2,83 MeV', '283 MeV', '0,0283 MeV'], correct: [0], explanation: 'Ev = 0,030 382 · 931,5 ≈ 28,3 MeV (to je ⁴He).' },
  { question: 'Ev = 1 802 MeV, A = 238. Jaká je ε?', type: 'single', options: ['7,57 MeV/nukleon', '8,79 MeV/nukleon', '428 GeV/nukleon', '0,13 MeV/nukleon'], correct: [0], explanation: 'ε = Ev / A = 1 802 / 238 ≈ 7,57 MeV na nukleon.' },
  { question: 'Které jádro má největší vazebnou energii na nukleon?', type: 'single', options: ['⁵⁶Fe', '²³⁸U', '⁴He', '²H'], correct: [0], explanation: 'Maximum křivky ε(A) ≈ 8,8 MeV leží u A ≈ 56–62 (Fe, Ni).' },
  { question: '²³⁸U má větší celkovou Ev než ⁵⁶Fe. Které jádro je stabilnější?', type: 'single', options: ['⁵⁶Fe — má větší ε', '²³⁸U — má větší Ev', 'obě stejně', 'nelze rozhodnout'], correct: [0], explanation: 'O stabilitě rozhoduje ε = Ev/A. Uran má velkou Ev jen kvůli velkému počtu nukleonů.' },
  { question: 'Proč ε u těžkých jader klesá?', type: 'single', options: ['roste elektrické odpuzování protonů, jaderné síly jsou nasycené', 'těžká jádra nemají neutrony', 'jaderné síly rostou s A', 'elektronový obal je větší'], correct: [0], explanation: 'Jaderné síly působí jen na sousedy (nasycené), elektrické odpuzování působí mezi všemi protony a s Z roste.' },
  { question: 'Energii lze získat… (vyber všechny správné)', type: 'multi', options: ['štěpením těžkých jader', 'slučováním lehkých jader', 'štěpením železa', 'slučováním dvou jader uranu'], correct: [0, 1], explanation: 'Energie se uvolní, když se jádra posunou k maximu ε (Fe): lehká syntézou, těžká štěpením. Z Fe se nezíská nic.' },
  { question: 'Které veličiny se zachovávají při jaderné reakci? (vyber všechny)', type: 'multi', options: ['nukleonové číslo A', 'náboj (Z)', 'celková energie', 'počet neutronů'], correct: [0, 1, 2], explanation: 'Zachovává se A, náboj, energie i hybnost. Počet neutronů se měnit může (např. při β přeměně n → p).' },
  { question: '²⁷₁₃Al + ⁴₂He → X + ¹₀n. Co je X?', type: 'single', options: ['³⁰₁₅P', '³¹₁₅P', '³⁰₁₄Si', '²⁶₁₂Mg'], correct: [0], explanation: 'A: 27 + 4 − 1 = 30; Z: 13 + 2 − 0 = 15 → fosfor.' },
  { question: 'Při přeměně β⁺ se protonové číslo…', type: 'single', options: ['zmenší o 1, A se nemění', 'zvětší o 1, A se nemění', 'zmenší o 2, A o 4', 'nemění'], correct: [0], explanation: 'β⁺: p → n + e⁺ + ν. Jeden proton se změní na neutron → Z − 1. Např. ¹⁸F → ¹⁸O.' },
  { question: 'Co spouští štěpení ²³⁵U v reaktoru?', type: 'single', options: ['pohlcení pomalého neutronu', 'vysoká teplota 10⁸ K', 'srážka s elektronem', 'záření γ'], correct: [0], explanation: 'Jádro ²³⁵U pohltí pomalý (tepelný) neutron, stane se nestabilním a rozštěpí se.' },
  { question: 'K čemu slouží moderátor v reaktoru?', type: 'single', options: ['zpomaluje neutrony', 'pohlcuje neutrony a zastavuje reakci', 'odvádí teplo z turbíny', 'obohacuje uran'], correct: [0], explanation: 'Moderátor (voda, grafit) zpomaluje neutrony. Pohlcování je úkol regulačních tyčí (bor, kadmium).' },
  { question: 'Řízená řetězová reakce v reaktoru má multiplikační faktor…', type: 'single', options: ['k = 1', 'k > 1', 'k < 1', 'k = 0'], correct: [0], explanation: 'k = 1: každé štěpení vyvolá právě jedno další → stálý výkon. k > 1 = lavina (bomba).' },
  { question: 'Kolik energie se přibližně uvolní při rozštěpení jednoho jádra ²³⁵U?', type: 'single', options: ['200 MeV', '17,6 MeV', '2 MeV', '931,5 MeV'], correct: [0], explanation: 'Asi 200 MeV ≈ 3,2·10⁻¹¹ J. 17,6 MeV je syntéza D+T.' },
  { question: 'Proč syntéza vyžaduje teploty 10⁷–10⁸ K?', type: 'single', options: ['kladná jádra se odpuzují a musí se přiblížit na dosah jaderných sil', 'aby se roztavil kov', 'aby vznikly neutrony', 'aby se jádra zpomalila'], correct: [0], explanation: 'Jádra potřebují obrovskou kinetickou energii, aby překonala elektrické odpuzování — proto „termojaderná“ reakce.' },
  { question: 'Která reakce pohání Slunce?', type: 'single', options: ['syntéza vodíku na helium', 'štěpení uranu', 'hoření vodíku s kyslíkem', 'rozpad radia'], correct: [0], explanation: 'Protonový cyklus: 4 ¹H → ⁴He + 2 e⁺ + 2 ν + 26,7 MeV.' },
  { question: 'Proč je částice α (⁴He) tak stabilní?', type: 'single', options: ['má na lehké jádro neobvykle velkou ε (≈ 7,1 MeV)', 'nemá žádné protony', 'je nejtěžší z lehkých jader', 'má záporný náboj'], correct: [0], explanation: 'V grafu ε(A) leží ⁴He výrazně nad sousedními jádry — je mimořádně pevně vázaná.' },
];

/* ═══════════════════════════════════════════════════════════════════
   KARTIČKY
   ═══════════════════════════════════════════════════════════════════ */
const CARDS = [
  ['Z, N, A', 'Z = protonové číslo, N = neutronové, A = Z + N nukleonové číslo'],
  ['Nuklid / izotop / izobar', 'nuklid = daný Z i A · izotopy = stejné Z · izobary = stejné A'],
  ['Rozměr atomu × jádra', 'atom ≈ 10⁻¹⁰ m, jádro ≈ 10⁻¹⁵ m (poměr ~10⁵)'],
  ['Poloměr jádra', 'R = r₀ · ∛A, r₀ ≈ 1,2 · 10⁻¹⁵ m'],
  ['Hustota jádra', '≈ 2,3 · 10¹⁷ kg/m³ — pro všechna jádra stejná'],
  ['Atomová hmotnostní jednotka', 'u = 1/12 m(¹²C) ≈ 1,6605 · 10⁻²⁷ kg ≙ 931,5 MeV'],
  ['mp a mn', 'mp = 1,007 276 u · mn = 1,008 665 u (neutron je těžší)'],
  ['4 vlastnosti jaderných sil', 'přitažlivé · krátký dosah 10⁻¹⁵ m · nezávislé na náboji · nasycené'],
  ['Hmotnostní schodek', 'Δm = Z·mp + N·mn − mj (vždy > 0)'],
  ['Vazebná energie', 'Ev = Δm · c² — uvolní se při vzniku jádra / nutná k jeho rozbití'],
  ['Rychlý převod', 'Ev [MeV] = Δm [u] · 931,5'],
  ['1 MeV v joulech', '1 MeV = 1,602 · 10⁻¹³ J (1 eV = 1,602 · 10⁻¹⁹ J)'],
  ['Vazebná energie na nukleon', 'ε = Ev / A — míra stability jádra'],
  ['Maximum ε', '≈ 8,8 MeV u A ≈ 56–62 (⁵⁶Fe, ⁶²Ni)'],
  ['Typické ε', '²H 1,1 · ⁴He 7,1 · ⁵⁶Fe 8,8 · ²³⁸U 7,6 MeV'],
  ['Paradox U vs. Fe', 'U má větší celkovou Ev (víc nukleonů), ale menší ε → méně stabilní'],
  ['Zákony zachování v reakci', 'A (horní čísla), Z / náboj (dolní čísla), energie, hybnost'],
  ['Přeměna α / β⁻ / β⁺', 'α: Z−2, A−4 · β⁻: Z+1 · β⁺: Z−1 (A se u β nemění)'],
  ['Štěpení', 'těžké jádro + pomalý n → 2 úlomky + 2–3 n + ≈ 200 MeV'],
  ['Řetězová reakce', 'k = 1 reaktor, k > 1 bomba; kritické množství'],
  ['Části reaktoru', 'palivo (3–5 % ²³⁵U) · moderátor · regulační tyče · chladivo'],
  ['Syntéza', 'lehká jádra se spojují; nutná teplota 10⁷–10⁸ K (plazma)'],
  ['D + T', '²H + ³H → ⁴He + n + 17,6 MeV'],
  ['Slunce', '4 ¹H → ⁴He + 2 e⁺ + 2 ν + 26,7 MeV'],
];

function Flashcards() {
  const [i, setI] = useState(0);
  const [flip, setFlip] = useState(false);
  const go = n => { setFlip(false); setI((n + CARDS.length) % CARDS.length); };
  return (
    <div className="fcWrap">
      <div className="fcScene" onClick={() => setFlip(f => !f)}>
        <div className={'fcCard' + (flip ? ' flipped' : '')}>
          <div className="fcFace box tk"><div className="mono dim small">POJEM {i + 1}/{CARDS.length} · klikni</div><div className="fcFront">{CARDS[i][0]}</div></div>
          <div className="fcFace fcBack box tk"><div className="mono dim small">ODPOVĚĎ</div><div className="fcBackT">{CARDS[i][1]}</div></div>
        </div>
      </div>
      <div className="navRow">
        <button className="btn" onClick={() => go(i - 1)}>← Předchozí</button>
        <button className="btn" onClick={() => go(i + 1)}>Další →</button>
      </div>
      <div className="dots">
        {CARDS.map((_, k) => <button key={k} aria-label={`Kartička ${k + 1}`} className="dot sm" style={{ background: k === i ? CY : '#3b4f63' }} onClick={() => go(k)} />)}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   VZORCE
   ═══════════════════════════════════════════════════════════════════ */
const SHEET = [
  { h: 'Parametry atomu', rows: [['A = Z + N', 'nukleonové číslo'], ['N = A − Z', 'neutronové číslo'], ['R = r₀ · ∛A', 'r₀ ≈ 1,2 · 10⁻¹⁵ m'], ['ρ ≈ 2,3 · 10¹⁷ kg/m³', 'hustota jádra'], ['mj = ma − Z · me', 'jádro z hmotnosti atomu']] },
  { h: 'Schodek a vazebná energie', rows: [['Δm = Z·mp + N·mn − mj', 'hmotnostní schodek'], ['Ev = Δm · c²', 'v kg a J'], ['Ev [MeV] = Δm [u] · 931,5', 'rychlý výpočet'], ['ε = Ev / A', 'na 1 nukleon, míra stability'], ['E = (Σm před − Σm po) · c²', 'energie reakce']] },
  { h: 'Reaktor a energie', rows: [['Pt = Pe / η', 'tepelný výkon'], ['Q = P · t', 'energie za čas t'], ['N = Q / E₁', 'počet rozštěpených jader'], ['n = N / Nₐ ;  m = n · M', 'látkové množství a hmotnost']] },
  { h: 'Konstanty', rows: [['mp = 1,007 276 u', '1,673 · 10⁻²⁷ kg'], ['mn = 1,008 665 u', '1,675 · 10⁻²⁷ kg'], ['me = 0,000 549 u', '9,11 · 10⁻³¹ kg'], ['mH = 1,007 825 u', 'atom vodíku'], ['1 u = 1,6605 · 10⁻²⁷ kg', '≙ 931,5 MeV'], ['c = 3 · 10⁸ m/s', 'c² = 9 · 10¹⁶ m²/s²'], ['e = 1,602 · 10⁻¹⁹ C', '1 eV = 1,602 · 10⁻¹⁹ J'], ['Nₐ = 6,022 · 10²³ mol⁻¹', 'Avogadrova konstanta']] },
  { h: 'Typické hodnoty', rows: [['ε(²H) ≈ 1,1 MeV', ''], ['ε(⁴He) ≈ 7,1 MeV', ''], ['ε(⁵⁶Fe) ≈ 8,8 MeV', 'maximum'], ['ε(²³⁸U) ≈ 7,6 MeV', ''], ['štěpení ²³⁵U ≈ 200 MeV', '≈ 3,2 · 10⁻¹¹ J'], ['D + T → He + n: 17,6 MeV', '']] },
  { h: 'Přeměny a částice', rows: [['α = ⁴₂He', 'Z − 2, A − 4'], ['β⁻ = ⁰₋₁e', 'Z + 1'], ['β⁺ = ⁰₊₁e', 'Z − 1'], ['n = ¹₀n, p = ¹₁p', ''], ['γ, ν: A = 0, Z = 0', 'neovlivní bilanci']] },
];

/* ═══════════════════════════════════════════════════════════════════
   APP
   ═══════════════════════════════════════════════════════════════════ */
const TABS = [
  ['teorie', '📐 Teorie'], ['priklady', '🧮 Příklady'], ['trenazer', '🎯 Trenažér'],
  ['kviz', '❓ Kvíz'], ['karticky', '🃏 Kartičky'], ['vzorce', '📋 Vzorce'],
];

export default function App() {
  const [tab, setTab] = useState('teorie');
  const [open, setOpen] = useState({ atom: true });
  return (
    <div className="bp">
      <style>{CSS}</style>
      <header className="hdr">
        <div className="titleBlock">
          <div className="tbMain">
            <div className="mono dim small">FYZIKA · 2. ROČNÍK · PŘÍPRAVA NA HODINOVOU PRÁCI</div>
            <h1>⚛️ Fyzika jádra</h1>
            <div className="sub">parametry atomu · hmotnostní schodek · vazebná energie · ε · štěpení a slučování</div>
          </div>
          <div className="tbCell mono"><span className="dim">MĚŘÍTKO</span><br />1 : 10⁻¹⁵</div>
          <div className="tbCell mono"><span className="dim">JEDNOTKA</span><br />MeV · u</div>
        </div>
        <nav className="tabs">
          {TABS.map(([id, l]) => <button key={id} className={'tab' + (tab === id ? ' on' : '')} onClick={() => setTab(id)}>{l}</button>)}
        </nav>
      </header>

      <main className="main" key={tab}>
        {tab === 'teorie' && (
          <>
            <div className="box tk pad intro">
              <div className="mono label">CO PŘIJDE V PÍSEMCE</div>
              <div className="chips">
                {['Parametry atomu', 'Hmotnostní schodek', 'Vazebná energie', 'Vazebná energie / nukleon', 'Štěpení a slučování jader'].map((t, i) =>
                  <span key={i} className="chip"><span className="mono yl">{String(i + 1).padStart(2, '0')}</span> {t}</span>)}
              </div>
              <p className="small dim">Typicky: výpočet Δm → Ev → ε z tabulky (jako v pracovním listu), doplnění jaderné reakce, vysvětlení grafu ε(A) a výpočet spotřeby paliva. Všechny úlohy z obou pracovních listů jsou vyřešené v záložce Příklady.</p>
            </div>
            {THEORY.map((s, i) => (
              <section key={s.id} className="box tk sect">
                <button className="sectH" onClick={() => setOpen(o => ({ ...o, [s.id]: !o[s.id] }))}>
                  <span className="mono pnum">{String(i + 1).padStart(2, '0')}</span>
                  <span className="sectT">{s.title}</span>
                  <span className="mono cy">{open[s.id] ? '−' : '+'}</span>
                </button>
                {open[s.id] && <div className="sectB">{s.body}</div>}
              </section>
            ))}
          </>
        )}
        {tab === 'priklady' && <ProblemsTab />}
        {tab === 'trenazer' && (<><Trainer /><Calculator /></>)}
        {tab === 'kviz' && <QuizEngine questions={QUESTIONS} accentColor={CY} />}
        {tab === 'karticky' && <Flashcards />}
        {tab === 'vzorce' && (
          <div className="sheet">
            {SHEET.map(g => (
              <div key={g.h} className="box tk pad">
                <div className="mono label">{g.h.toUpperCase()}</div>
                {g.rows.map(([f, n], k) => (
                  <div key={k} className="srow"><span className="mono sf">{f}</span><span className="sn">{n}</span></div>
                ))}
              </div>
            ))}
          </div>
        )}
      </main>
      <footer className="foot mono">Podklady: PL „Hmotnostní úbytek a vazebná energie“ · PL „Jaderné reakce a fyzika jádra“</footer>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   STYL — „Blueprint“
   ═══════════════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
:root{--bg:#0d1b2a;--line:#2f6f9f;--cy:${CY};--yl:${YL};--tx:#e3eef8;--mut:#9fb6cc}
html,body{background:var(--bg)}
.bp{min-height:100vh;color:var(--tx);font-family:'IBM Plex Sans',sans-serif;font-size:16px;line-height:1.65;
  background-color:var(--bg);
  background-image:linear-gradient(rgba(120,180,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(120,180,255,.12) 1px,transparent 1px),
  linear-gradient(rgba(120,180,255,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(120,180,255,.07) 1px,transparent 1px);
  background-size:200px 200px,200px 200px,40px 40px,40px 40px;background-attachment:fixed}
.bp *{box-sizing:border-box}
.bp p{margin:10px 0}
.bp ul{list-style:disc;padding-left:22px;margin:10px 0}
.bp ol{list-style:decimal;padding-left:24px;margin:10px 0}
.bp li{margin:4px 0}
.bp b{color:#fff;font-weight:600}
.bp button{font-family:inherit;color:inherit;background:transparent}
.mono{font-family:'IBM Plex Mono',monospace}
.dim{color:var(--mut)} .small{font-size:14px} .yl{color:var(--yl)} .cy{color:var(--cy)}
.big{font-size:1.2em} .huge{font-size:2.4em;line-height:1}

/* outlined box s rohovými značkami */
.box{border:1px solid var(--line);position:relative;background-color:rgba(13,27,42,.72)}
.tk{background-image:
  linear-gradient(var(--cy),var(--cy)),linear-gradient(var(--cy),var(--cy)),
  linear-gradient(var(--cy),var(--cy)),linear-gradient(var(--cy),var(--cy)),
  linear-gradient(var(--cy),var(--cy)),linear-gradient(var(--cy),var(--cy)),
  linear-gradient(var(--cy),var(--cy)),linear-gradient(var(--cy),var(--cy));
  background-repeat:no-repeat;
  background-size:12px 2px,2px 12px,12px 2px,2px 12px,12px 2px,2px 12px,12px 2px,2px 12px;
  background-position:-1px -1px,-1px -1px,calc(100% + 1px) -1px,calc(100% + 1px) -1px,-1px calc(100% + 1px),-1px calc(100% + 1px),calc(100% + 1px) calc(100% + 1px),calc(100% + 1px) calc(100% + 1px)}
.pad{padding:20px;margin-bottom:18px}
.label{color:var(--cy);font-size:13px;letter-spacing:.06em;margin-bottom:12px}

/* header = rohové razítko výkresu */
.hdr{position:sticky;top:0;z-index:5;background:rgba(13,27,42,.94);border-bottom:1px solid var(--line);backdrop-filter:blur(6px)}
.titleBlock{max-width:1000px;margin:0 auto;display:grid;grid-template-columns:1fr auto auto;border-left:1px solid var(--line);border-right:1px solid var(--line)}
.tbMain{padding:12px 18px;min-width:0}
.tbMain h1{font-size:28px;font-weight:700;margin:2px 0;letter-spacing:.01em;color:#fff}
.sub{color:var(--mut);font-size:14px}
.tbCell{border-left:1px solid var(--line);padding:12px 16px;font-size:14px;color:var(--yl);display:flex;flex-direction:column;justify-content:center}
.tabs{max-width:1000px;margin:0 auto;display:flex;overflow-x:auto;border-top:1px solid var(--line);border-left:1px solid var(--line)}
.tab{flex:0 0 auto;padding:12px 18px;min-height:46px;border-right:1px solid var(--line);font-size:15px;cursor:pointer;transition:background .4s linear,color .4s linear;color:var(--mut);white-space:nowrap}
.tab:hover{color:#fff}
.tab.on{background:rgba(90,200,250,.14);color:var(--cy);box-shadow:inset 0 -3px 0 var(--cy)}
.main{max-width:1000px;margin:0 auto;padding:22px 16px 40px;animation:fade .4s linear}
@keyframes fade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.foot{max-width:1000px;margin:0 auto;padding:0 16px 30px;font-size:12px;color:var(--mut)}

.chips{display:flex;flex-wrap:wrap;gap:8px}
.chip{border:1px solid var(--line);padding:6px 12px;font-size:15px}

/* teorie */
.sect{margin-bottom:14px}
.sectH{width:100%;display:flex;align-items:center;gap:14px;padding:14px 18px;min-height:52px;cursor:pointer;text-align:left}
.sectT{flex:1;font-size:19px;font-weight:600;color:#fff}
.pnum{color:var(--yl);font-size:14px;border:1px solid var(--yl);padding:2px 6px}
.sectB{padding:0 20px 20px;border-top:1px dashed rgba(47,111,159,.6);animation:fade .4s linear}
.formula{font-family:'IBM Plex Mono',monospace;color:var(--yl);font-size:18px;border:1px solid var(--yl);border-left-width:4px;padding:10px 16px;margin:12px 0;background:rgba(255,209,102,.05);overflow-x:auto}
.formula.sm{font-size:15px;margin:4px 0}
.warn{border:1px solid #fb923c;border-left-width:4px;padding:10px 14px;margin:12px 0;background:rgba(251,146,60,.07);font-size:15px}
.note{border-left:3px solid var(--line);padding:6px 12px;color:var(--mut);font-size:14px;margin:10px 0}
.tbl{width:100%;border-collapse:collapse;margin:12px 0;font-size:15px;display:block;overflow-x:auto}
.tbl th{font-family:'IBM Plex Mono',monospace;font-weight:500;color:var(--cy);text-align:left;font-size:13px;letter-spacing:.04em}
.tbl th,.tbl td{border:1px solid rgba(47,111,159,.7);padding:7px 10px;vertical-align:top}
.nuc{display:inline-flex;align-items:center;white-space:nowrap;font-weight:500}
.az{display:inline-flex;flex-direction:column;align-items:flex-end;font-size:.6em;line-height:1.05;margin-right:1px;font-family:'IBM Plex Mono',monospace}
.eq{border-top:1px solid var(--line);border-bottom:1px solid var(--line);background:rgba(90,200,250,.05);padding:10px 14px;margin:10px 0;overflow-x:auto}
.eqin{display:flex;align-items:center;flex-wrap:wrap;gap:4px;font-size:20px}
.arr{color:var(--yl);margin:0 8px} .pl{color:var(--cy);margin:0 4px}
.eqnote{font-size:13px;color:var(--mut);font-family:'IBM Plex Mono',monospace;margin-top:4px}
.qty{font-family:'IBM Plex Mono',monospace;margin-right:14px;white-space:nowrap}
.qs{color:var(--cy)} .qv{color:var(--yl)} .qu{color:var(--mut)}

/* grafy */
.graphBox,.scaleBox{padding:16px;margin:14px 0}
.graph{width:100%;height:auto;display:block}
.scaleSvg{max-width:620px;margin:0 auto}
.ax{font-family:'IBM Plex Mono',monospace;font-size:12px;fill:#9fb6cc}
.regionLbl text{font-family:'IBM Plex Mono',monospace;font-size:14px;font-weight:600}
.regionLbl text.ax{font-size:11px;font-weight:400}
.curve{stroke-dasharray:1;stroke-dashoffset:1;animation:draw 1.6s linear forwards}
.draw{animation:spin 30s linear infinite;transform-origin:180px 95px}
@keyframes draw{to{stroke-dashoffset:0}}
@keyframes spin{to{transform:rotate(360deg)}}
.readout{display:grid;grid-template-columns:auto auto auto 1fr;gap:18px;align-items:center;border-top:1px dashed var(--line);padding-top:12px;margin-top:6px}
.readNote{color:var(--mut);font-size:14px}

/* příklady */
.seg{display:flex;flex-wrap:wrap;border:1px solid var(--line);margin-bottom:18px}
.segB{flex:1 1 200px;padding:12px;min-height:46px;cursor:pointer;border-right:1px solid var(--line);font-size:15px;color:var(--mut);transition:background .4s linear}
.segB.on{background:rgba(90,200,250,.14);color:var(--cy)}
.prob{padding:18px;margin-bottom:16px}
.probHead{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:8px}
.probT{flex:1;font-weight:600;font-size:17px;color:#fff;min-width:180px}
.badge{border:1px solid;padding:2px 8px;font-size:13px;font-family:'IBM Plex Mono',monospace}
.probTask{margin-bottom:12px}
.btn{border:1px solid var(--line)!important;padding:10px 18px;min-height:44px;cursor:pointer;font-size:15px;transition:background .4s linear,border-color .4s linear}
.btn:hover{background:rgba(90,200,250,.1)!important;border-color:var(--cy)!important}
.btnA{border-color:var(--cy)!important;color:var(--cy)!important;background:rgba(90,200,250,.12)!important}
.btnS{padding:6px 12px;min-height:40px;font-size:14px}
.btnRow{display:flex;flex-wrap:wrap;gap:10px;margin-top:14px}
.chks{border:1px dashed var(--line);padding:10px 12px;margin-bottom:12px}
.chk{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:8px}
.chkL{color:var(--cy);min-width:48px}
.inp{background:rgba(0,0,0,.25);border:1px solid var(--line);color:#fff;font-family:'IBM Plex Mono',monospace;font-size:16px;padding:8px 10px;min-height:42px;width:160px;outline:none;transition:border-color .4s linear}
.inp:focus{border-color:var(--cy)}
.sol{margin-top:14px;border-top:1px dashed var(--line);padding-top:6px;animation:fade .4s linear}
.solSec{margin:12px 0}
.solL{color:var(--cy);font-size:12px;letter-spacing:.08em;margin-bottom:4px}
.given{display:flex;flex-wrap:wrap;gap:6px 18px;font-family:'IBM Plex Mono',monospace;font-size:15px}
.gv{white-space:nowrap}
.steps li{font-family:'IBM Plex Mono',monospace;font-size:15px;margin:6px 0;animation:fade .4s linear both}
.steps li::marker{color:var(--yl)}
.result{display:inline-block;border:2px solid var(--yl);color:var(--yl);padding:8px 14px;font-weight:600;font-family:'IBM Plex Mono',monospace}

/* trenažér */
.trainHead{display:flex;align-items:center;gap:22px;flex-wrap:wrap;margin-bottom:14px}
.scoreBox{margin-left:auto;font-size:22px;border:1px solid var(--yl);padding:4px 12px}
.trainGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:14px}
.tfield{display:flex;flex-direction:column;gap:4px;min-width:0}
.tfield .inp{width:100%}
.calcOut{display:flex;flex-wrap:wrap;gap:10px 0;margin-top:16px;border-top:1px dashed var(--line);padding-top:12px}

/* kvíz */
.quiz{max-width:720px;margin:0 auto;display:flex;flex-direction:column;gap:16px}
.dots{display:flex;gap:6px;justify-content:center;flex-wrap:wrap}
.dot{width:20px;height:20px;border:none;cursor:pointer;transition:background .4s linear;padding:0}
.dot.sm{width:14px;height:14px}
.qcard{padding:22px}
.qnum{color:var(--mut);font-size:13px;margin-bottom:6px}
.qtext{font-size:19px;font-weight:600;color:#fff;margin-bottom:18px}
.opts{display:flex;flex-direction:column;gap:10px}
.opt{border:1px solid rgba(47,111,159,.8);padding:12px 16px;min-height:44px;cursor:pointer;display:flex;gap:10px;align-items:center;transition:all .4s linear;user-select:none}
.opt:hover{border-color:var(--cy)}
.optSel{border-color:var(--cy);background:rgba(90,200,250,.1)}
.optOk{border-color:${OK};background:rgba(74,222,128,.12)}
.optBad{border-color:${BAD};background:rgba(248,113,113,.12)}
.fb{margin-top:18px;border:1px solid;border-left-width:4px;padding:14px}
.fbH{font-weight:700;font-family:'IBM Plex Mono',monospace;margin-bottom:6px}
.fbC{color:${OK};font-size:15px;margin-bottom:6px}
.fbE{color:var(--tx);font-size:15px}
.fbT{color:var(--yl);font-size:14px;margin-top:8px}
.navRow{display:flex;justify-content:space-between;gap:10px}
.qres{max-width:420px;margin:30px auto;padding:36px;text-align:center}
.qresScore{font-size:52px;color:var(--yl);line-height:1.1}
.qresPct{font-size:22px;color:var(--mut);margin-bottom:12px}
.qresMsg{margin-bottom:22px}

/* kartičky */
.fcWrap{max-width:600px;margin:0 auto;display:flex;flex-direction:column;gap:16px}
.fcScene{perspective:1200px;cursor:pointer;height:260px}
.fcCard{position:relative;width:100%;height:100%;transition:transform .4s linear;transform-style:preserve-3d}
.fcCard.flipped{transform:rotateY(180deg)}
.fcFace{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;padding:22px;display:flex;flex-direction:column}
.fcBack{transform:rotateY(180deg);border-color:var(--yl)}
.fcFront{flex:1;display:flex;align-items:center;justify-content:center;text-align:center;font-size:26px;font-weight:600;color:#fff}
.fcBackT{flex:1;display:flex;align-items:center;justify-content:center;text-align:center;font-size:19px;font-family:'IBM Plex Mono',monospace;color:var(--yl)}

/* vzorce */
.sheet{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px}
.sheet>.box{margin:0;min-width:0}
.srow{display:flex;justify-content:space-between;gap:12px;padding:7px 0;border-bottom:1px dashed rgba(47,111,159,.5);flex-wrap:wrap}
.sf{color:var(--yl);font-size:15px}
.sn{color:var(--mut);font-size:14px}

@media (max-width:640px){
  .titleBlock{grid-template-columns:1fr}
  .tbCell{display:none}
  .tbMain>.mono,.sub{display:none}
  .tbMain h1{font-size:23px}
  .main{padding:16px 12px 30px}
  .readout{grid-template-columns:1fr 1fr}
  .readNote{grid-column:1/-1}
  .eqin{font-size:17px}
  .sheet{grid-template-columns:1fr}
  .huge{font-size:2em}
  .fcFront{font-size:22px}
  .sectT{font-size:17px}
}
`;
