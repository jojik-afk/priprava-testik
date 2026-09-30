// @title Matematika T1 — Opakování 2. ročníku (test s řešením)
// @subject Math
// @topic Vektory, přímka, kružnice, sinová věta, goniometrické rovnice
// @template practice

import { useState, useMemo, useCallback } from 'react';

// ══════════════════════════════════════════════════════════════════
// BARVY / DROBNÉ MATEMATICKÉ KOMPONENTY
// ══════════════════════════════════════════════════════════════════
const BLUE = "#1d3fa8";
const RED = "#d12b2b";
const INK = "#1a2233";

const F = ({ n, d }) => (
  <span className="frac"><span className="num">{n}</span><span className="den">{d}</span></span>
);
const V = ({ c }) => <span className="vec">{c}</span>;
const Rt = ({ children }) => <span className="sqrt">√<span className="rad">{children}</span></span>;
const M = ({ children }) => <span className="m">{children}</span>;
const Res = ({ children }) => <span className="res">{children}</span>;
const Calc = ({ children }) => <div className="calc">{children}</div>;

// ══════════════════════════════════════════════════════════════════
// ŘEŠENÍ (skryté) + KONTROLA VÝSLEDKU
// ══════════════════════════════════════════════════════════════════
function Solution({ given, formula, steps, result, pitfall, label = "Zobrazit řešení" }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button className="btn" onClick={() => setOpen(o => !o)}>
        {open ? "▲ Skrýt řešení" : "▼ " + label}
      </button>
      {open && (
        <div className="sol">
          {given && (<><h5>Zadáno</h5><div className="given">{given}</div></>)}
          {formula && (<><h5>Vzorec / věta</h5><div className="formula">{formula}</div></>)}
          <h5>Postup</h5>
          <ol className="steps">
            {steps.map((s, i) => (
              <li key={i} style={{ animationDelay: (i * 0.12) + "s" }}>
                {s.t && <div className="st">{s.t}</div>}
                {s.c && <Calc>{s.c}</Calc>}
              </li>
            ))}
          </ol>
          <h5>Výsledek</h5>
          <div className="resrow">{result}</div>
          {pitfall && (
            <div className="pit">
              <b>⚠️ Kde se ztrácejí body:</b> {pitfall}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function parseNum(s) {
  if (s == null) return NaN;
  const t = String(s).trim().replace(",", ".").replace("−", "-").replace(/\s/g, "");
  if (t === "") return NaN;
  return Number(t);
}

function Check({ fields, tol = 0.01, hint }) {
  const [vals, setVals] = useState(fields.map(() => ""));
  const [state, setState] = useState(null);
  const verify = () => {
    const ok = fields.every((f, i) => {
      const x = parseNum(vals[i]);
      return !isNaN(x) && Math.abs(x - f.v) <= (f.tol ?? tol);
    });
    setState(ok ? "ok" : "bad");
  };
  return (
    <div className="check">
      <span className="checkLbl">✏️ Zkontroluj si výsledek:</span>
      <div className="checkRow">
        {fields.map((f, i) => (
          <label key={i} className="checkField">
            <span>{f.label}</span>
            <input
              inputMode="decimal"
              value={vals[i]}
              onChange={e => { const nv = [...vals]; nv[i] = e.target.value; setVals(nv); setState(null); }}
              onKeyDown={e => e.key === "Enter" && verify()}
            />
            {f.unit && <span className="unit">{f.unit}</span>}
          </label>
        ))}
        <button className="btn small" onClick={verify}>Ověřit</button>
      </div>
      {state === "ok" && <div className="ok">✔ Správně!</div>}
      {state === "bad" && <div className="bad">✘ Ještě ne. {hint || "Zkus to znovu a hlídej znaménka."}</div>}
    </div>
  );
}

function Problem({ num, badge, title, children, check, solution }) {
  return (
    <section className="entry">
      <div className="entryHead">
        <span className="pnum">{num}</span>
        <h3>{title}</h3>
        {badge && <span className={"badge b-" + badge}>{badge === "easy" ? "Lehké ✨" : badge === "medium" ? "Střední ⚡" : "Těžké 🔥"}</span>}
      </div>
      <div className="stmt">{children}</div>
      {check}
      <Solution {...solution} />
    </section>
  );
}

function Collapse({ title, icon, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className={"coll" + (open ? " open" : "")}>
      <button className="collHead" onClick={() => setOpen(o => !o)}>
        <span className="collIcon">{icon}</span>
        <span className="collTitle">{title}</span>
        <span className="collArrow">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="collBody">{children}</div>}
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════
// OBRÁZEK Z TESTU — čtvercová síť s body A, B a vektory u, n
// ══════════════════════════════════════════════════════════════════
const GX = x => 20 + (x + 5) * 30;
const GY = y => 20 + (5 - y) * 30;

function Arrow({ x1, y1, x2, y2, color, width = 2.5 }) {
  const X1 = GX(x1), Y1 = GY(y1), X2 = GX(x2), Y2 = GY(y2);
  const ang = Math.atan2(Y2 - Y1, X2 - X1);
  const L = 11, W = 0.42;
  const p1 = [X2 - L * Math.cos(ang - W), Y2 - L * Math.sin(ang - W)];
  const p2 = [X2 - L * Math.cos(ang + W), Y2 - L * Math.sin(ang + W)];
  return (
    <g>
      <line x1={X1} y1={Y1} x2={X2 - 6 * Math.cos(ang)} y2={Y2 - 6 * Math.sin(ang)} stroke={color} strokeWidth={width} />
      <polygon points={`${X2},${Y2} ${p1[0]},${p1[1]} ${p2[0]},${p2[1]}`} fill={color} />
    </g>
  );
}

function LineXY({ f, color, dash }) {
  // f: x -> y ; nakreslí přímku přes celý rozsah
  return <line x1={GX(-5)} y1={GY(f(-5))} x2={GX(5)} y2={GY(f(5))} stroke={color} strokeWidth="2" strokeDasharray={dash} />;
}

function GridFigure() {
  const [show, setShow] = useState({ p: false, q: false, r: false, k: false });
  const tog = key => setShow(s => ({ ...s, [key]: !s[key] }));
  const ticks = [];
  for (let i = -5; i <= 5; i++) ticks.push(i);
  return (
    <div className="figure">
      <svg viewBox="0 0 340 340" className="gridSvg" role="img" aria-label="Čtvercová síť s body A, B a vektory u, n">
        <defs><clipPath id="clipG"><rect x="20" y="20" width="300" height="300" /></clipPath></defs>
        <rect x="20" y="20" width="300" height="300" fill="#fff" />
        {ticks.map(i => (
          <g key={i}>
            <line x1={GX(i)} y1={20} x2={GX(i)} y2={320} stroke="#c9d3e3" strokeWidth="1" />
            <line x1={20} y1={GY(i)} x2={320} y2={GY(i)} stroke="#c9d3e3" strokeWidth="1" />
          </g>
        ))}
        <line x1={20} y1={GY(0)} x2={326} y2={GY(0)} stroke={INK} strokeWidth="1.5" />
        <line x1={GX(0)} y1={326} x2={GX(0)} y2={14} stroke={INK} strokeWidth="1.5" />
        <text x={328} y={GY(0) + 4} fontSize="13" fill={INK} fontStyle="italic">x</text>
        <text x={GX(0) + 6} y={16} fontSize="13" fill={INK} fontStyle="italic">y</text>
        <text x={GX(1) - 3} y={GY(0) + 15} fontSize="11" fill={INK}>1</text>
        <text x={GX(0) + 5} y={GY(1) + 4} fontSize="11" fill={INK}>1</text>
        <text x={GX(0) - 13} y={GY(0) + 15} fontSize="11" fill={INK} fontStyle="italic">O</text>
        <g clipPath="url(#clipG)">
          {show.p && <LineXY f={x => (3 * x + 7) / 2} color="#7a3fb0" />}
          {show.q && <LineXY f={x => (2 * x + 8) / 3} color="#0f8a5f" />}
          {show.r && <LineXY f={x => (1 - 3 * x) / 2} color="#c46a00" />}
          {show.k && <circle cx={GX(1)} cy={GY(-1)} r={Math.sqrt(13) * 30} fill="none" stroke={RED} strokeWidth="2" strokeDasharray="6 4" />}
        </g>
        <Arrow x1={0} y1={2} x2={3} y2={4} color={BLUE} />
        <Arrow x1={-2} y1={-1} x2={1} y2={-3} color={BLUE} />
        <text x={GX(1.6)} y={GY(3.55)} fontSize="15" fill={BLUE} fontStyle="italic" fontWeight="700">u</text>
        <text x={GX(1.6) - 1} y={GY(3.55) - 11} fontSize="11" fill={BLUE}>→</text>
        <text x={GX(-0.9)} y={GY(-1.55)} fontSize="15" fill={BLUE} fontStyle="italic" fontWeight="700">n</text>
        <text x={GX(-0.9) - 1} y={GY(-1.55) - 11} fontSize="11" fill={BLUE}>→</text>
        {[[-1, 2, "A"], [1, -1, "B"]].map(([x, y, l]) => (
          <g key={l}>
            <line x1={GX(x) - 5} y1={GY(y) - 5} x2={GX(x) + 5} y2={GY(y) + 5} stroke={INK} strokeWidth="2" />
            <line x1={GX(x) - 5} y1={GY(y) + 5} x2={GX(x) + 5} y2={GY(y) - 5} stroke={INK} strokeWidth="2" />
            <text x={GX(x) + 4} y={GY(y) + 18} fontSize="14" fontStyle="italic" fill={INK}>{l}</text>
          </g>
        ))}
      </svg>
      <div className="figSide">
        <div className="readout">
          <div><b>A</b> = [−1; 2]</div>
          <div><b>B</b> = [1; −1]</div>
          <div><V c="u" />: z [0; 2] do [3; 4] → <b>(3; 2)</b></div>
          <div><V c="n" />: z [−2; −1] do [1; −3] → <b>(3; −2)</b></div>
        </div>
        <div className="toggles">
          <button className={"tg" + (show.p ? " on" : "")} style={{ "--c": "#7a3fb0" }} onClick={() => tog("p")}>přímka p</button>
          <button className={"tg" + (show.q ? " on" : "")} style={{ "--c": "#0f8a5f" }} onClick={() => tog("q")}>přímka q</button>
          <button className={"tg" + (show.r ? " on" : "")} style={{ "--c": "#c46a00" }} onClick={() => tog("r")}>přímka r</button>
          <button className={"tg" + (show.k ? " on" : "")} style={{ "--c": RED }} onClick={() => tog("k")}>kružnice k</button>
        </div>
        <p className="small">Zapni si přímky a kružnici z úloh 3 a 5 a podívej se, že opravdu procházejí body A a B.</p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// OBRÁZEK ÚLOHY 6 — trojúhelník + dva čtverce
// ══════════════════════════════════════════════════════════════════
function TriangleFigure({ labels = true }) {
  const L = [150, 270], R = [350, 270], T = [223.2, 143.2];
  const pts = a => a.map(p => p.join(",")).join(" ");
  return (
    <svg viewBox="0 0 500 300" className="triSvg" role="img" aria-label="Trojúhelník s úhly 60° a 45° a čtverci Malých a Pokorných">
      <polygon points={pts([L, T, [96.4, 70], [23.2, 196.8]])} fill="#eef2fb" stroke={INK} strokeWidth="2" />
      <polygon points={pts([T, R, [476.8, 143.2], [350, 16.4]])} fill="#eef2fb" stroke={INK} strokeWidth="2" />
      <polygon points={pts([L, R, T])} fill="#fff" stroke={INK} strokeWidth="2" />
      <text x="62" y="140" fontSize="15" fill={INK}>Malých</text>
      <text x="310" y="150" fontSize="15" fill={INK}>Pokorných</text>
      <path d={`M ${L[0] + 28} ${L[1]} A 28 28 0 0 0 ${L[0] + 14} ${L[1] - 24.2}`} fill="none" stroke={INK} strokeWidth="1.5" />
      <text x={L[0] + 24} y={L[1] - 8} fontSize="12" fill={INK}>60°</text>
      <path d={`M ${R[0] - 28} ${R[1]} A 28 28 0 0 1 ${R[0] - 19.8} ${R[1] - 19.8}`} fill="none" stroke={INK} strokeWidth="1.5" />
      <text x={R[0] - 52} y={R[1] - 8} fontSize="12" fill={INK}>45°</text>
      {labels && (
        <g>
          <text x={T[0] - 4} y={T[1] + 26} fontSize="12" fill={BLUE}>75°</text>
          <text x="418" y="60" fontSize="15" fill={RED} fontWeight="700">70 m</text>
          <text x="295" y="222" fontSize="14" fill={BLUE} fontStyle="italic" fontWeight="700">a = 70</text>
          <text x="140" y="212" fontSize="14" fill={BLUE} fontStyle="italic" fontWeight="700">b = ?</text>
          <text x="232" y="290" fontSize="14" fill={BLUE} fontStyle="italic">c</text>
        </g>
      )}
    </svg>
  );
}

// ══════════════════════════════════════════════════════════════════
// JEDNOTKOVÁ KRUŽNICE — výběr úhlu, hodnoty sin/cos/tg/cotg
// ══════════════════════════════════════════════════════════════════
const ANGLES = [
  [0, "0", "0°"], [1, "π/6", "30°"], [1.5, "π/4", "45°"], [2, "π/3", "60°"], [3, "π/2", "90°"],
  [4, "2π/3", "120°"], [4.5, "3π/4", "135°"], [5, "5π/6", "150°"], [6, "π", "180°"],
  [7, "7π/6", "210°"], [7.5, "5π/4", "225°"], [8, "4π/3", "240°"], [9, "3π/2", "270°"],
  [10, "5π/3", "300°"], [10.5, "7π/4", "315°"], [11, "11π/6", "330°"],
];
function exact(v) {
  if (!isFinite(v) || Math.abs(v) > 1e6) return "není def.";
  const s = v < -1e-9 ? "−" : "";
  const a = Math.abs(v);
  const tab = [[0, "0"], [0.5, "1/2"], [Math.SQRT2 / 2, "√2/2"], [Math.sqrt(3) / 2, "√3/2"], [1, "1"], [Math.sqrt(3) / 3, "√3/3"], [Math.sqrt(3), "√3"]];
  for (const [x, str] of tab) if (Math.abs(a - x) < 1e-9) return x === 0 ? "0" : s + str;
  return v.toFixed(3);
}

function UnitCircle() {
  const [sel, setSel] = useState(6);
  const C = 150, Rr = 110;
  const [k, lbl, deg] = ANGLES[sel];
  const t = k * Math.PI / 6;
  const cx = Math.cos(t), sy = Math.sin(t);
  const px = C + Rr * cx, py = C - Rr * sy;
  const tg = Math.abs(cx) < 1e-9 ? Infinity : sy / cx;
  const cotg = Math.abs(sy) < 1e-9 ? Infinity : cx / sy;
  return (
    <div className="figure">
      <svg viewBox="0 0 300 300" className="ucSvg" role="img" aria-label="Jednotková kružnice">
        <rect x="0" y="0" width="300" height="300" fill="#fff" />
        <line x1="20" y1={C} x2="280" y2={C} stroke={INK} strokeWidth="1.2" />
        <line x1={C} y1="280" x2={C} y2="20" stroke={INK} strokeWidth="1.2" />
        <circle cx={C} cy={C} r={Rr} fill="none" stroke={BLUE} strokeWidth="1.8" />
        <line x1="20" y1={C - Rr} x2="280" y2={C - Rr} stroke="#9fb0d8" strokeDasharray="4 4" />
        <text x="236" y={C - Rr - 5} fontSize="10" fill="#6b7a99">osa cotg</text>
        {ANGLES.map(([kk], i) => {
          const tt = kk * Math.PI / 6;
          return <circle key={i} cx={C + Rr * Math.cos(tt)} cy={C - Rr * Math.sin(tt)} r={i === sel ? 0 : 3.2} fill="#9fb0d8" onClick={() => setSel(i)} style={{ cursor: "pointer" }} />;
        })}
        <line x1={C} y1={C} x2={px} y2={py} stroke={BLUE} strokeWidth="2" />
        <line x1={px} y1={py} x2={px} y2={C} stroke={RED} strokeWidth="2.5" />
        <line x1={C} y1={C} x2={px} y2={C} stroke="#0f8a5f" strokeWidth="3.5" />
        {isFinite(cotg) && Math.abs(cotg) < 1.25 && sy > 0 && (
          <g>
            <line x1={C} y1={C} x2={C + Rr * cotg} y2={C - Rr} stroke="#c46a00" strokeWidth="1.2" strokeDasharray="3 3" />
            <circle cx={C + Rr * cotg} cy={C - Rr} r="4" fill="#c46a00" />
          </g>
        )}
        {isFinite(cotg) && Math.abs(cotg) < 1.25 && sy < 0 && (
          <g>
            <line x1={px} y1={py} x2={C + Rr * cotg} y2={C - Rr} stroke="#c46a00" strokeWidth="1.2" strokeDasharray="3 3" />
            <circle cx={C + Rr * cotg} cy={C - Rr} r="4" fill="#c46a00" />
          </g>
        )}
        <circle cx={px} cy={py} r="6" fill={BLUE} />
        <text x="272" y={C + 14} fontSize="11" fill={INK}>1</text>
        <text x={C + 5} y="34" fontSize="11" fill={INK}>1</text>
      </svg>
      <div className="figSide">
        <div className="angleBtns">
          {ANGLES.map(([, l], i) => (
            <button key={i} className={"ab" + (i === sel ? " on" : "")} onClick={() => setSel(i)}>{l}</button>
          ))}
        </div>
        <div className="readout">
          <div>úhel <b>{lbl}</b> = {deg}</div>
          <div><span style={{ color: "#0f8a5f", fontWeight: 700 }}>cos</span> = {exact(cx)}</div>
          <div><span style={{ color: RED, fontWeight: 700 }}>sin</span> = {exact(sy)}</div>
          <div>tg = {exact(tg)}</div>
          <div><span style={{ color: "#c46a00", fontWeight: 700 }}>cotg</span> = {exact(cotg)}</div>
        </div>
        <p className="small">Klikni na <b>3π/4</b> a pak na <b>7π/4</b>: oba body mají cotg = −1. Leží proti sobě přes střed — proto se u tg a cotg přičítá jen <M>kπ</M>.</p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// ÚLOHY Z TESTU (verze spolužáka)
// ══════════════════════════════════════════════════════════════════
function TestTab() {
  return (
    <div>
      <div className="intro">
        <p><b>T1: Opakování látky 2. ročníku</b> — přesné zadání ze spolužákova testu (psal ho 16. 9.). Vpravo nahoře má písmeno <b>„Y“</b>, takže je to nejspíš <b>skupina Y</b>. Ty můžeš dostat jinou skupinu: <b>stejné typy úloh, jiná čísla</b>. Proto nestačí naučit se výsledky — pochop postup a pak si projdi záložku <b>🏋️ Trénink</b>.</p>
        <p>Každá úloha: nejdřív ji zkus sám na papír, výsledek si ověř v políčku a teprve pak otevři řešení. U každého řešení je napsáno, kde spolužák ztratil body.</p>
      </div>

      <div className="entry">
        <div className="entryHead"><span className="pnum">📐</span><h3>Výchozí obrázek k úlohám 1–5</h3></div>
        <p>V mřížových bodech čtvercové sítě leží body <i>A</i>, <i>B</i> a počáteční i koncové body orientovaných úseček, které představují umístění vektorů <V c="u" />, <V c="n" />.</p>
        <GridFigure />
        <div className="pit" style={{ marginTop: 12 }}>
          <b>První krok v testu:</b> hned si ke každému bodu a vektoru napiš souřadnice. Vektor = <b>konec − začátek</b>. Na tomhle se staví všech 5 úloh, takže chyba tady = chyba všude.
        </div>
      </div>

      <Problem num="1" badge="medium" title="Odchylka vektorů u a n"
        check={<Check fields={[{ label: "φ ≈", v: 67.38, tol: 0.02, unit: "° (desetinně)" }]} hint="Počítej cos φ = (u·n)/(|u|·|n|)." />}
        solution={{
          given: <>Z obrázku: <V c="u" /> = (3; 2), <V c="n" /> = (3; −2).</>,
          formula: <>cos φ = <F n={<><V c="u" /> · <V c="n" /></>} d={<>|<V c="u" />| · |<V c="n" />|</>} />, φ ∈ ⟨0°; 180°⟩</>,
          steps: [
            { t: "Skalární součin — násobíš x se x, y se y a sečteš:", c: <><V c="u" /> · <V c="n" /> = 3·3 + 2·(−2) = 9 − 4 = 5</> },
            { t: "Velikosti vektorů (Pythagorova věta):", c: <>|<V c="u" />| = <Rt>3² + 2²</Rt> = <Rt>13</Rt>,&nbsp;&nbsp; |<V c="n" />| = <Rt>3² + (−2)²</Rt> = <Rt>13</Rt></> },
            { t: "Dosazení do vzorce:", c: <>cos φ = <F n="5" d={<><Rt>13</Rt> · <Rt>13</Rt></>} /> = <F n="5" d="13" /> ≈ 0,384 6</> },
            { t: "Kalkulačka v režimu DEG: cos⁻¹(5 ÷ 13):", c: <>φ ≈ 67,380 1°</> },
            { t: "Převod desetinné části na minuty (1° = 60′):", c: <>0,380 1 · 60 ≈ 22,8′ → zaokrouhleno 23′</> },
          ],
          result: <Res>φ ≈ 67°23′</Res>,
          pitfall: <>Spolužák tuhle úlohu vůbec neřešil (0 b). Pozor: kalkulačka musí být ve stupních (DEG), ne v radiánech. Výsledek „67,38°“ bez převodu na minuty není podle zadání. Na kalkulačce Casio jde převést tlačítkem <M>°′″</M>.</>
        }}>
        <p>Spočítejte odchylku vektorů <V c="u" /> a <V c="n" />. Zaokrouhlete na minuty.</p>
      </Problem>

      <Problem num="2" badge="easy" title="Čtvrtý vrchol rovnoběžníku"
        check={<Check fields={[{ label: "D = [", v: -6 }, { label: ";", v: -12, unit: "]" }]} />}
        solution={{
          given: <>A[−1; 2], B[1; −1], C[−4; −15]; hledáme D, aby ABCD byl rovnoběžník (vrcholy v tomto pořadí dokola).</>,
          formula: <>V rovnoběžníku ABCD platí <V c="AD" /> = <V c="BC" />, tedy <b>D = A + C − B</b>.</>,
          steps: [
            { t: "Vektor BC (konec − začátek):", c: <><V c="BC" /> = C − B = (−4 − 1; −15 − (−1)) = (−5; −14)</> },
            { t: "Stejný posun uděláme z bodu A:", c: <>D = A + <V c="BC" /> = [−1 + (−5); 2 + (−14)] = [−6; −12]</> },
            { t: "Kontrola: úhlopříčky rovnoběžníku se navzájem půlí → středy AC a BD musí vyjít stejně.", c: <>S<sub>AC</sub> = [<F n="−1−4" d="2" />; <F n="2−15" d="2" />] = [−2,5; −6,5],&nbsp; S<sub>BD</sub> = [<F n="1−6" d="2" />; <F n="−1−12" d="2" />] = [−2,5; −6,5] ✔</> },
          ],
          result: <Res>D[−6; −12]</Res>,
          pitfall: <>Spolužák to měl dobře (zápis <M>D = C + <V c="BA" /></M> je totéž). Nejčastější chyba: <M>D = A + B − C</M> nebo <M>B + C − A</M> — to jsou jiné vrcholy jiných rovnoběžníků. Vždy si načrtni pořadí A → B → C → D dokola.</>
        }}>
        <p>Přidáme bod <i>C</i>[−4; −15]. Určete souřadnice bodu <i>D</i> tak, aby <i>ABCD</i> byl rovnoběžník.</p>
      </Problem>

      <Problem num="3" badge="medium" title="Přiřaďte k přímkám obecné rovnice"
        solution={{
          given: <>A[−1; 2], B[1; −1], <V c="n" /> = (3; −2), <V c="u" /> = (3; 2).</>,
          formula: <>Obecná rovnice <M>ax + by + c = 0</M>, kde <M>(a; b)</M> je <b>normálový</b> vektor (kolmý na přímku). Ze směrového vektoru (u₁; u₂) uděláš normálový: <b>prohoď souřadnice a u jedné změň znaménko</b> → (u₂; −u₁).</>,
          steps: [
            { t: "Přímka p: normálový vektor máme přímo, n = (3; −2):", c: <>3x − 2y + c = 0; dosadím A: 3·(−1) − 2·2 + c = 0 → c = 7 → <b>3x − 2y + 7 = 0 … (A)</b></> },
            { t: "Přímka q: směrový vektor u = (3; 2) → normálový (2; −3):", c: <>2x − 3y + c = 0; dosadím A: 2·(−1) − 3·2 + c = 0 → c = 8 → <b>2x − 3y + 8 = 0 … (E)</b></> },
            { t: "Přímka r: směrový vektor je AB = B − A = (2; −3) → normálový (3; 2):", c: <>3x + 2y + c = 0; dosadím A: −3 + 4 + c = 0 → c = −1 → <b>3x + 2y − 1 = 0 … (B)</b></> },
            { t: "Kontrola r: bod B musí vyhovovat taky:", c: <>3·1 + 2·(−1) − 1 = 0 ✔</> },
            { t: "Proč ne C a D? To jsou chytáky:", c: <>(C) 2x + 3y − 4 = 0 prochází A, ale má normálový vektor (2; 3) — nesedí k ničemu. (D) 2x − 3y − 5 = 0 je rovnoběžná s q, ale prochází bodem B, ne A.</> },
          ],
          result: <Res>p → A,&nbsp; q → E,&nbsp; r → B</Res>,
          pitfall: <>Spolužák měl plný počet (3 b). Rychlá kontrola každé odpovědi: dosaď bod A (a u r i bod B) — musí vyjít 0. Pak zkontroluj, že koeficienty (a; b) jsou správný normálový vektor.</>
        }}>
        <p>Přiřaďte ke každé přímce její obecnou rovnici:</p>
        <ul>
          <li>přímka <i>p</i> určená bodem <i>A</i> a normálovým vektorem <V c="n" /></li>
          <li>přímka <i>q</i> určená bodem <i>A</i> a směrovým vektorem <V c="u" /></li>
          <li>přímka <i>r</i> procházející body <i>A</i>, <i>B</i></li>
        </ul>
        <div className="opts">
          <div>A) 3x − 2y + 7 = 0</div><div>B) 3x + 2y − 1 = 0</div><div>C) 2x + 3y − 4 = 0</div>
          <div>D) 2x − 3y − 5 = 0</div><div>E) 2x − 3y + 8 = 0</div>
        </div>
      </Problem>

      <Problem num="4" badge="medium" title="Vzdálenost bodu C od přímky r"
        check={<Check fields={[{ label: "v(C, r) ≈", v: 11.93, tol: 0.01 }]} hint="Použij vzorec |ax₀ + by₀ + c| / √(a² + b²), zaokrouhli až na konci." />}
        solution={{
          given: <>C[−4; −15], r: 3x + 2y − 1 = 0 (z úlohy 3).</>,
          formula: <>v(C, r) = <F n={<>|a·x₀ + b·y₀ + c|</>} d={<Rt>a² + b²</Rt>} /></>,
          steps: [
            { t: "Dosadím souřadnice C do levé strany rovnice r:", c: <>3·(−4) + 2·(−15) − 1 = −12 − 30 − 1 = −43</> },
            { t: "Absolutní hodnota (vzdálenost je vždy kladná):", c: <>|−43| = 43</> },
            { t: "Jmenovatel = velikost normálového vektoru (3; 2):", c: <><Rt>3² + 2²</Rt> = <Rt>13</Rt></> },
            { t: "Výsledek přesně a pak číselně:", c: <>v = <F n="43" d={<Rt>13</Rt>} /> = <F n={<>43<Rt>13</Rt></>} d="13" /> ≈ 11,926</> },
            { t: "Náhradní varianta (když neumíš r) — přímka m: y = −2x − 5 → převedu na obecný tvar:", c: <>2x + y + 5 = 0 → v(C, m) = <F n="|2·(−4) + (−15) + 5|" d={<Rt>4 + 1</Rt>} /> = <F n="18" d={<Rt>5</Rt>} /> ≈ 8,05</> },
          ],
          result: <><Res>v(C, r) = 43/√13 ≈ 11,93</Res> <span className="small" style={{ marginLeft: 8 }}>(náhradní: v(C, m) ≈ 8,05)</span></>,
          pitfall: <>Spolužák šel přes patu kolmice (princip učitelka uznala), ale zaokrouhloval mezivýsledky a v rovnici kolmice měl chybnou konstantu → vyšlo mu 12,82 ≈ 13. Poznámka učitelky: <i>„moc zaokrouhleno, takže jste vedle; princip ok“</i> → 1 b. <b>Vzorec je rychlejší a bez zaokrouhlování.</b> Pokud jdeš přes patu kolmice, počítej se zlomky: pata vyjde P[77/13; −109/13].</>
        }}>
        <p>Vypočítejte vzdálenost bodu <i>C</i> z úlohy 2 od přímky <i>r</i> z úlohy 3. (Pokud jste přímku <i>r</i> nedokázali určit, spočítejte vzdálenost bodu <i>C</i> od přímky <i>m</i>: <i>y</i> = −2<i>x</i> − 5.)</p>
      </Problem>

      <Problem num="5" badge="medium" title="Středová a obecná rovnice kružnice"
        check={<Check fields={[{ label: "r² =", v: 13, tol: 0 }]} hint="r = |AB| = vzdálenost středu B od bodu A." />}
        solution={{
          given: <>Střed S = B[1; −1], kružnice prochází bodem A[−1; 2].</>,
          formula: <>Středová rovnice: (x − m)² + (y − n)² = r², kde S[m; n]. Obecná rovnice: x² + y² + ax + by + c = 0.</>,
          steps: [
            { t: "Poloměr = vzdálenost středu od bodu na kružnici:", c: <>r² = |AB|² = (−1 − 1)² + (2 − (−1))² = 4 + 9 = 13 → r = <Rt>13</Rt></> },
            { t: "Středová rovnice (pozor na znaménka: y − (−1) = y + 1):", c: <>(x − 1)² + (y + 1)² = 13</> },
            { t: "Roznásobím závorky podle (a ± b)² = a² ± 2ab + b²:", c: <>x² − 2x + 1 + y² + 2y + 1 = 13</> },
            { t: "Všechno převedu na levou stranu a sečtu čísla: 1 + 1 − 13 = −11", c: <>x² + y² − 2x + 2y − 11 = 0</> },
            { t: "Kontrola dosazením bodu A[−1; 2]:", c: <>1 + 4 + 2 + 4 − 11 = 0 ✔</> },
          ],
          result: <><Res>k: (x − 1)² + (y + 1)² = 13</Res>&nbsp; <Res>k: x² + y² − 2x + 2y − 11 = 0</Res></>,
          pitfall: <>Spolužák měl středovou rovnici správně, ale v obecné rovnici prohodil znaménka (u 2x a u 11) → celá úloha 0 b. <b>Obecnou rovnici vždy zkontroluj dosazením bodu A</b> — stojí to 10 sekund.</>
        }}>
        <p>Napište středovou i obecnou rovnici kružnice <i>k</i>, která má střed v bodě <i>B</i> a prochází bodem <i>A</i>.</p>
      </Problem>

      <Problem num="6" badge="medium" title="Pozemky Malých a Pokorných (sinová věta)"
        check={<Check fields={[{ label: "rozdíl ≈", v: 1633, tol: 0.5, unit: "m²" }]} />}
        solution={{
          given: <>Trojúhelník: úhel 60° u levého dolního vrcholu, 45° u pravého dolního. Strana u čtverce Pokorných = 70 m.</>,
          formula: <>Sinová věta: <F n="a" d="sin α" /> = <F n="b" d="sin β" /> = <F n="c" d="sin γ" /> (strana a úhel <b>naproti</b> sobě).</>,
          steps: [
            { t: "Najdi protilehlé úhly: strana 70 m (Pokorných) leží naproti úhlu 60°. Strana Malých leží naproti úhlu 45°. (Třetí úhel je 180° − 60° − 45° = 75°.)", c: <>a = 70 m ↔ α = 60°;&nbsp; b = ? ↔ β = 45°</> },
            { t: "Sinová věta a vyjádření b:", c: <><F n="b" d="sin 45°" /> = <F n="70" d="sin 60°" /> → b = <F n="70 · sin 45°" d="sin 60°" /> = <F n={<>70 · <Rt>2</Rt>/2</>} d={<><Rt>3</Rt>/2</>} /> = 70<Rt>2/3</Rt> ≈ 57,155 m</> },
            { t: "Obsahy čtverců (S = strana²):", c: <>S<sub>P</sub> = 70² = 4 900 m²;&nbsp; S<sub>M</sub> = b² = 4 900 · <F n="2" d="3" /> ≈ 3 266,67 m²</> },
            { t: "Rozdíl:", c: <>4 900 − 3 266,67 = <F n="4 900" d="3" /> ≈ 1 633,33 m²</> },
          ],
          result: <Res>≈ 1 633 m²</Res>,
          pitfall: <>Spolužák měl plný počet (2 b) se zápisem <M>70² − (70/sin 60° · sin 45°)²</M>. Nejčastější chyba: přiřadit stranu ke špatnému úhlu. <b>Strana a její úhel se „nedotýkají“ — úhel je v protějším vrcholu.</b> Nezaokrouhluj b před umocněním.</>
        }}>
        <p>Na trojúhelníkový pozemek navazují čtvercové pozemky Malých a Pokorných.</p>
        <TriangleFigure labels={false} />
        <p>O kolik m² je výměra pozemku Pokorných větší než výměra pozemku Malých? Zaokrouhlete na celé m².</p>
      </Problem>

      <Problem num="7" badge="hard" title="Goniometrická rovnice (vyber si jednu)"
        solution={{
          given: <>Varianta a) cotg(x/2 + π) = −1;&nbsp; varianta b) −7·cos x = 5·cos x + <Rt>3</Rt>;&nbsp; x ∈ ℝ.</>,
          formula: <>cotg má periodu π: cotg(t + π) = cotg t. cotg t = −1 ⇔ t = 3π/4 + kπ. Rovnice cos x = a má (pro |a| &lt; 1) dvě řešení v periodě: x = ±arccos a + 2kπ.</>,
          steps: [
            { t: "a) Díky periodě π můžu „+ π“ vynechat:", c: <>cotg(x/2 + π) = cotg(x/2) = −1</> },
            { t: "a) Substituce t = x/2. Kde je cotg t = −1? Referenční úhel π/4 (cotg π/4 = 1), cotg je záporná ve II. kvadrantu:", c: <>t = π − π/4 = 3π/4 → t = 3π/4 + kπ, k ∈ ℤ</> },
            { t: "a) Zpět x = 2t — násobí se CELÁ perioda:", c: <>x/2 = 3π/4 + kπ &nbsp;|· 2&nbsp; → &nbsp;x = 3π/2 + 2kπ, k ∈ ℤ</> },
            { t: "a) Zkouška pro x = 3π/2 a podmínka (sin(x/2 + π) ≠ 0):", c: <>x/2 + π = 3π/4 + π = 7π/4; cotg 7π/4 = <F n={<><Rt>2</Rt>/2</>} d={<>−<Rt>2</Rt>/2</>} /> = −1 ✔</> },
            { t: "b) Převedu cos x na jednu stranu (−7 − 5 = −12!):", c: <>−7 cos x − 5 cos x = <Rt>3</Rt> → −12 cos x = <Rt>3</Rt> → cos x = −<F n={<Rt>3</Rt>} d="12" /> ≈ −0,144 3</> },
            { t: "b) Hodnota není tabulková, ale |−0,144| ≤ 1 → řešení existují. Kalkulačka (RAD):", c: <>arccos(−√3/12) ≈ 1,716 rad ≈ 98°18′</> },
            { t: "b) cos je sudá → druhé řešení je záporný úhel, perioda 2π:", c: <>x ≈ ±1,716 + 2kπ, k ∈ ℤ</> },
          ],
          result: <><Res>a) x = 3π/2 + 2kπ, k ∈ ℤ</Res>&nbsp; <Res>b) x = ±arccos(−√3/12) + 2kπ</Res></>,
          pitfall: <><b>Doporučuju variantu a)</b> — vyjde „hezky“ a je bez kalkulačky. Spolužák zvolil b) a spletl se hned v prvním kroku: napsal −2 cos x místo −12 cos x, pak smíchal stupně s radiány (165° + 2kπ) → 0 b. <b>Nikdy nemíchej ° a π v jednom výsledku.</b> U a) nezapomeň: když x/2 = … + kπ, pak x = … + 2kπ.</>
        }}>
        <p>Vyberte si jednu z rovnic a vyřešte ji pro <i>x</i> ∈ ℝ.</p>
        <div className="opts two">
          <div>a) cotg(<F n="x" d="2" /> + π) = −1</div>
          <div>b) −7 · cos x = 5 · cos x + <Rt>3</Rt></div>
        </div>
      </Problem>

      <div className="entry summary">
        <h3>📊 Jak dopadl spolužák a co z toho plyne</h3>
        <div className="tblWrap"><table className="tbl">
          <thead><tr><th>Úloha</th><th>Téma</th><th>Spolužák</th><th>Pro tebe</th></tr></thead>
          <tbody>
            <tr><td>1</td><td>odchylka vektorů</td><td className="r">nevyřešeno</td><td>naučit vzorec + převod na minuty</td></tr>
            <tr><td>2</td><td>rovnoběžník</td><td className="g">✔</td><td>D = A + C − B</td></tr>
            <tr><td>3</td><td>obecné rovnice přímek</td><td className="g">✔ 3 b</td><td>normálový vs. směrový vektor</td></tr>
            <tr><td>4</td><td>vzdálenost bodu od přímky</td><td className="r">1 b (zaokrouhlování)</td><td>použít vzorec, zlomky</td></tr>
            <tr><td>5</td><td>kružnice</td><td className="r">znaménka v obecné rovnici</td><td>kontrola dosazením bodu</td></tr>
            <tr><td>6</td><td>sinová věta</td><td className="g">✔ 2 b</td><td>strana ↔ protější úhel</td></tr>
            <tr><td>7</td><td>goniometrická rovnice</td><td className="r">0 b</td><td>zvolit cotg, perioda π</td></tr>
          </tbody>
        </table></div>
        <p>Spolužák dostal za 7 bodů trojku. Kdyby udělal úlohu 1 a nezkazil znaménka a zaokrouhlení, měl by jedničku. Tyhle body jsou lehce k mání.</p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// TEORIE
// ══════════════════════════════════════════════════════════════════
function TheoryTab() {
  return (
    <div>
      <div className="intro">
        <p>Tady je všechno, co musíš <b>chápat</b>, abys test napsal na jedničku. Témata jdou ve stejném pořadí jako úlohy. Každá kapitola končí krátkým <b>„Na testu“</b> — přesně to, co se po tobě bude chtít.</p>
      </div>

      <Collapse icon="➡️" title="1. Vektory v rovině — souřadnice, velikost, skalární součin, odchylka" defaultOpen>
        <h4>Bod vs. vektor</h4>
        <p><b>Bod</b> je místo v rovině, píšeme ho s hranatými závorkami: <M>A[−1; 2]</M>. <b>Vektor</b> je posunutí (směr + délka), píšeme ho s kulatými závorkami: <M><V c="u" /> = (3; 2)</M> znamená „o 3 doprava a o 2 nahoru“. Jeden vektor můžeš nakreslit kamkoliv — všechny šipky se stejným směrem a délkou jsou <i>umístění</i> téhož vektoru.</p>
        <h4>Jak zjistit souřadnice vektoru</h4>
        <p>Vektor určený body <i>P</i> (začátek) a <i>Q</i> (konec): <b><V c="PQ" /> = Q − P</b>, tedy <b>konec minus začátek</b>.</p>
        <Calc>P[2; −1], Q[−1; 3] → <V c="PQ" /> = (−1 − 2; 3 − (−1)) = (−3; 4)</Calc>
        <p>Z mřížky v testu: <V c="u" /> začíná v [0; 2] a končí v [3; 4] → <V c="u" /> = (3; 2). <V c="n" /> začíná v [−2; −1] a končí v [1; −3] → <V c="n" /> = (3; −2). Počítej čtverečky: kolik doprava (+) / doleva (−), kolik nahoru (+) / dolů (−).</p>
        <h4>Operace s vektory</h4>
        <ul>
          <li>Součet: <M>(u₁; u₂) + (v₁; v₂) = (u₁ + v₁; u₂ + v₂)</M></li>
          <li>Násobek číslem: <M>k · (u₁; u₂) = (k·u₁; k·u₂)</M></li>
          <li>Bod + vektor = bod (posunutí): <M>A + <V c="u" /> = [a₁ + u₁; a₂ + u₂]</M></li>
          <li>Vektory jsou <b>rovnoběžné (kolineární)</b>, když je jeden násobkem druhého: (2; −3) a (−4; 6).</li>
        </ul>
        <h4>Velikost vektoru</h4>
        <p>Je to délka šipky — Pythagorova věta: <b>|<V c="u" />| = <Rt>u₁² + u₂²</Rt></b>. Např. |(3; 2)| = <Rt>9 + 4</Rt> = <Rt>13</Rt>. Vzdálenost dvou bodů je velikost vektoru mezi nimi: |AB| = <Rt>(b₁ − a₁)² + (b₂ − a₂)²</Rt>.</p>
        <h4>Skalární součin</h4>
        <p><b><V c="u" /> · <V c="v" /> = u₁v₁ + u₂v₂</b> — výsledek je <b>číslo</b>, ne vektor. Co říká:</p>
        <ul>
          <li><M>&gt; 0</M> → úhel mezi vektory je ostrý (&lt; 90°)</li>
          <li><M>= 0</M> → vektory jsou na sebe <b>kolmé</b> (to budeš potřebovat u přímek!)</li>
          <li><M>&lt; 0</M> → úhel je tupý (&gt; 90°)</li>
        </ul>
        <h4>Odchylka (úhel) dvou vektorů</h4>
        <p>Ze vztahu <V c="u" />·<V c="v" /> = |<V c="u" />|·|<V c="v" />|·cos φ dostaneme:</p>
        <Calc>cos φ = <F n={<><V c="u" /> · <V c="v" /></>} d={<>|<V c="u" />| · |<V c="v" />|</>} />,&nbsp;&nbsp; φ ∈ ⟨0°; 180°⟩</Calc>
        <p>Postup: 1) skalární součin, 2) obě velikosti, 3) podělit, 4) na kalkulačce <M>cos⁻¹</M> (v režimu <b>DEG</b>), 5) převést na stupně a minuty.</p>
        <h4>Převod na minuty</h4>
        <p>1° = 60′. Desetinnou část stupňů vynásob 60: 67,380 1° → 0,380 1 · 60 = 22,8′ → <b>67°23′</b>. Pozor: 67,38° <b>není</b> 67°38′!</p>
        <div className="pit"><b>Odchylka vektorů</b> může být až 180° (vzorec bez absolutní hodnoty). <b>Odchylka přímek</b> je jen 0°–90° — tam se dává absolutní hodnota do čitatele.</div>
        <div className="exam"><b>Na testu:</b> přečíst vektory z obrázku, spočítat cos φ, převést na °′.</div>
      </Collapse>

      <Collapse icon="▱" title="2. Body a rovnoběžník — střed úsečky, čtvrtý vrchol">
        <h4>Střed úsečky</h4>
        <p>Průměr souřadnic: <b>S<sub>AB</sub> = [<F n="a₁ + b₁" d="2" />; <F n="a₂ + b₂" d="2" />]</b>.</p>
        <h4>Rovnoběžník ABCD</h4>
        <p>Vrcholy se píšou <b>dokola</b> (A → B → C → D → A). Protější strany jsou rovnoběžné a stejně dlouhé, takže jsou to stejné vektory:</p>
        <Calc><V c="AB" /> = <V c="DC" />&nbsp;&nbsp;a&nbsp;&nbsp;<V c="AD" /> = <V c="BC" /></Calc>
        <p>Z <V c="AD" /> = <V c="BC" /> plyne D − A = C − B, tedy <b>D = A + C − B</b>. Stejně by šlo C = B + D − A atd. Chytrá pomůcka: <b>hledaný vrchol = součet dvou sousedních − protější</b> (protější k D je B).</p>
        <h4>Kontrola přes úhlopříčky</h4>
        <p>Úhlopříčky rovnoběžníku se navzájem půlí → střed AC = střed BD. Z toho zase A + C = B + D.</p>
        <div className="pit">Pokud zadání řekne jen „rovnoběžník s vrcholy A, B, C“ bez pořadí, existují <b>tři</b> možná D. „ABCD“ ale pořadí určuje → jen jedno řešení.</div>
        <div className="exam"><b>Na testu:</b> D = A + C − B, pak kontrola středem úhlopříček.</div>
      </Collapse>

      <Collapse icon="📏" title="3. Přímka — normálový a směrový vektor, obecná rovnice">
        <h4>Dva důležité vektory přímky</h4>
        <ul>
          <li><b>Směrový vektor <V c="u" /></b> — leží ve směru přímky (šipka „po přímce“). Když přímka prochází body A, B, je <V c="AB" /> směrový.</li>
          <li><b>Normálový vektor <V c="n" /></b> — je na přímku <b>kolmý</b>.</li>
        </ul>
        <p>Převod mezi nimi: <b>prohoď souřadnice a u jedné změň znaménko</b>. Směrový (3; 2) → normálový (2; −3) (nebo (−2; 3), je to jedno). Proč: (3; 2)·(2; −3) = 6 − 6 = 0 → jsou kolmé.</p>
        <h4>Obecná rovnice přímky</h4>
        <Calc>p: ax + by + c = 0,&nbsp;&nbsp; kde (a; b) je NORMÁLOVÝ vektor</Calc>
        <p>Postup: 1) sežeň normálový vektor (a; b), 2) napiš <M>ax + by + c = 0</M>, 3) dosaď známý bod a dopočítej <M>c</M>.</p>
        <Calc>přímka přes A[−1; 2] s normálou (3; −2): 3x − 2y + c = 0 → −3 − 4 + c = 0 → c = 7 → 3x − 2y + 7 = 0</Calc>
        <h4>Parametrické vyjádření</h4>
        <p><M>X = A + t·<V c="u" /></M>, t ∈ ℝ, tedy <M>x = a₁ + t·u₁, y = a₂ + t·u₂</M>. Zde se používá <b>směrový</b> vektor. Na obecnou rovnici se převede vyloučením t.</p>
        <h4>Směrnicový tvar</h4>
        <p><M>y = kx + q</M> (k = směrnice). Převod na obecný tvar: všechno na jednu stranu. <M>y = −2x − 5</M> → <M>2x + y + 5 = 0</M>. Normálový vektor je pak (2; 1).</p>
        <h4>Leží bod na přímce?</h4>
        <p>Dosaď souřadnice do rovnice — pokud vyjde 0, leží. Tohle je nejlepší <b>kontrola</b> a nejrychlejší způsob, jak řešit přiřazovací úlohy.</p>
        <h4>Vzájemná poloha</h4>
        <ul>
          <li>Rovnoběžné přímky mají stejný normálový vektor (nebo násobek), liší se jen c: 2x − 3y + 8 = 0 ∥ 2x − 3y − 5 = 0.</li>
          <li>Kolmé přímky: normálový vektor jedné je směrovým vektorem druhé.</li>
        </ul>
        <div className="exam"><b>Na testu:</b> přiřadit obecné rovnice — rozlišit normálový/směrový vektor, dosadit bod.</div>
      </Collapse>

      <Collapse icon="↕️" title="4. Vzdálenost bodu od přímky">
        <p>Vzdálenost bodu od přímky je délka <b>kolmice</b> spuštěné z bodu na přímku (nejkratší spojnice).</p>
        <Calc>M[x₀; y₀], p: ax + by + c = 0&nbsp;&nbsp;→&nbsp;&nbsp;v(M, p) = <F n="|a·x₀ + b·y₀ + c|" d={<Rt>a² + b²</Rt>} /></Calc>
        <h4>Jak na to</h4>
        <ol>
          <li>Přímku měj v <b>obecném tvaru</b> (když je y = kx + q, převeď!).</li>
          <li>Do čitatele dosaď bod do levé strany rovnice, vezmi absolutní hodnotu.</li>
          <li>Jmenovatel je velikost normálového vektoru.</li>
          <li>Nech výsledek jako zlomek (43/√13) a zaokrouhli <b>až na konci</b>.</li>
        </ol>
        <h4>Proč funguje (pro pochopení)</h4>
        <p>Výraz a·x₀ + b·y₀ + c měří, „jak moc“ bod nevyhovuje rovnici. Je úměrný vzdálenosti; dělením |<V c="n" />| ho převedeme na skutečnou délku.</p>
        <h4>Druhý způsob — pata kolmice</h4>
        <ol>
          <li>Kolmice k p přes M: normálový vektor p se stane jejím směrovým.</li>
          <li>Průsečík P obou přímek (soustava rovnic).</li>
          <li>v = |MP|.</li>
        </ol>
        <p>Je to delší a snadno se nasbírají zaokrouhlovací chyby — přesně na tom ztratil body spolužák.</p>
        <div className="exam"><b>Na testu:</b> vzorec, převod směrnicového tvaru, přesný výpočet.</div>
      </Collapse>

      <Collapse icon="⭕" title="5. Kružnice — středová a obecná rovnice">
        <p><b>Kružnice</b> = všechny body, které mají od středu S stejnou vzdálenost r.</p>
        <h4>Středová rovnice</h4>
        <Calc>S[m; n], poloměr r:&nbsp;&nbsp; (x − m)² + (y − n)² = r²</Calc>
        <p>Pozor na znaménka: střed [1; −1] → <M>(x − 1)² + (y + 1)²</M>. V závorce je vždy <b>opačné znaménko</b> než ve středu.</p>
        <p>Když kružnice prochází bodem A, pak <b>r = |SA|</b> a r² spočítáš bez odmocňování: r² = (a₁ − m)² + (a₂ − n)².</p>
        <h4>Obecná rovnice</h4>
        <Calc>x² + y² + ax + by + c = 0</Calc>
        <p><b>Ze středové na obecnou:</b> roznásob obě závorky pomocí (a − b)² = a² − 2ab + b², převeď r² doleva a sečti čísla.</p>
        <Calc>(x − 1)² + (y + 1)² = 13 → x² − 2x + 1 + y² + 2y + 1 − 13 = 0 → x² + y² − 2x + 2y − 11 = 0</Calc>
        <p><b>Z obecné na středovou (doplnění na čtverec):</b> seskup x a y, přidej „polovinu koeficientu na druhou“.</p>
        <Calc>x² + y² − 6x + 4y − 3 = 0 → (x² − 6x + 9) + (y² + 4y + 4) = 3 + 9 + 4 → (x − 3)² + (y + 2)² = 16 → S[3; −2], r = 4</Calc>
        <p>Rychlá kontrola: v obecné rovnici je koeficient u x rovný <b>−2m</b> a u y <b>−2n</b>. Takže x² + y² − 2x + 2y … má střed [1; −1] ✔. Pokud by pravá strana po doplnění vyšla ≤ 0, není to kružnice.</p>
        <div className="exam"><b>Na testu:</b> r² = |SA|², středová rovnice, roznásobit, <b>zkouška dosazením bodu</b>.</div>
      </Collapse>

      <Collapse icon="△" title="6. Obecný trojúhelník — sinová a kosinová věta">
        <p>Pro trojúhelník, který <b>není pravoúhlý</b>, nestačí sin/cos z pravoúhlého trojúhelníku. Značení: strana <i>a</i> leží <b>naproti</b> úhlu α (ve vrcholu A), b naproti β, c naproti γ. Součet úhlů je 180°.</p>
        <TriangleFigure />
        <h4>Sinová věta</h4>
        <Calc><F n="a" d="sin α" /> = <F n="b" d="sin β" /> = <F n="c" d="sin γ" /></Calc>
        <p>Použiješ ji, když znáš <b>stranu a úhel naproti ní</b> + ještě jeden údaj (typicky dva úhly a stranu — jako v úloze 6).</p>
        <h4>Kosinová věta</h4>
        <Calc>c² = a² + b² − 2ab · cos γ</Calc>
        <p>Použiješ ji, když znáš <b>dvě strany a úhel mezi nimi</b> (sus), nebo <b>všechny tři strany</b> (sss) a hledáš úhel. Pro γ = 90° z ní vyjde Pythagorova věta.</p>
        <h4>Jak číst obrázek v úloze 6</h4>
        <ol>
          <li>Každý čtverec „sedí“ na jedné straně trojúhelníku. Jeho obsah = strana².</li>
          <li>Ke každé straně najdi úhel <b>ve vrcholu, který na té straně neleží</b>.</li>
          <li>Strana Pokorných (70 m) → naproti 60°. Strana Malých → naproti 45°.</li>
          <li>Sinová věta, pak umocnit, odečíst.</li>
        </ol>
        <h4>Tabulkové hodnoty, které tu potřebuješ</h4>
        <p>sin 30° = 1/2, sin 45° = √2/2, sin 60° = √3/2. Díky nim vyjde b² = 70² · (√2/2)² / (√3/2)² = 4 900 · (1/2)/(3/4) = 4 900 · 2/3 — dá se spočítat přesně.</p>
        <div className="exam"><b>Na testu:</b> správně spárovat strany s protějšími úhly, sinová věta, obsah čtverce.</div>
      </Collapse>

      <Collapse icon="🔄" title="7. Goniometrické funkce — jednotková kružnice a tabulka">
        <h4>Radiány</h4>
        <p>180° = π rad. Převod: stupně · π/180. Takže 30° = π/6, 45° = π/4, 60° = π/3, 90° = π/2, 360° = 2π.</p>
        <h4>Jednotková kružnice</h4>
        <p>Bod na kružnici s poloměrem 1 pod úhlem t má souřadnice <b>[cos t; sin t]</b>. Z toho: tg t = sin t / cos t, cotg t = cos t / sin t = 1 / tg t.</p>
        <UnitCircle />
        <h4>Tabulka, kterou musíš umět zpaměti</h4>
        <div className="tblWrap">
          <table className="tbl center">
            <thead><tr><th>x</th><th>0</th><th>π/6 (30°)</th><th>π/4 (45°)</th><th>π/3 (60°)</th><th>π/2 (90°)</th></tr></thead>
            <tbody>
              <tr><th>sin</th><td>0</td><td>1/2</td><td>√2/2</td><td>√3/2</td><td>1</td></tr>
              <tr><th>cos</th><td>1</td><td>√3/2</td><td>√2/2</td><td>1/2</td><td>0</td></tr>
              <tr><th>tg</th><td>0</td><td>√3/3</td><td>1</td><td>√3</td><td>—</td></tr>
              <tr><th>cotg</th><td>—</td><td>√3</td><td>1</td><td>√3/3</td><td>0</td></tr>
            </tbody>
          </table>
        </div>
        <p>Trik pro sin: <M>√0/2, √1/2, √2/2, √3/2, √4/2</M>. Cos je totéž pozpátku.</p>
        <h4>Znaménka v kvadrantech</h4>
        <div className="tblWrap">
          <table className="tbl center">
            <thead><tr><th></th><th>I. (0; π/2)</th><th>II. (π/2; π)</th><th>III. (π; 3π/2)</th><th>IV. (3π/2; 2π)</th></tr></thead>
            <tbody>
              <tr><th>sin</th><td>+</td><td>+</td><td>−</td><td>−</td></tr>
              <tr><th>cos</th><td>+</td><td>−</td><td>−</td><td>+</td></tr>
              <tr><th>tg, cotg</th><td>+</td><td>−</td><td>+</td><td>−</td></tr>
            </tbody>
          </table>
        </div>
        <h4>Periody a vlastnosti</h4>
        <ul>
          <li><b>sin, cos</b>: perioda <b>2π</b>. cos je sudá (cos(−x) = cos x), sin lichá.</li>
          <li><b>tg, cotg</b>: perioda <b>π</b> → tg(t + π) = tg t, cotg(t + π) = cotg t.</li>
          <li>tg není definován pro cos x = 0 (x = π/2 + kπ), cotg pro sin x = 0 (x = kπ).</li>
        </ul>
        <div className="exam"><b>Na testu:</b> umět tabulku, kvadranty a periody — bez toho úlohu 7 nevyřešíš.</div>
      </Collapse>

      <Collapse icon="🧮" title="8. Goniometrické rovnice — postup krok za krokem">
        <h4>Základní rovnice a jejich řešení</h4>
        <div className="tblWrap">
          <table className="tbl">
            <thead><tr><th>Rovnice</th><th>Kolik řešení v periodě</th><th>Obecné řešení</th></tr></thead>
            <tbody>
              <tr><td>sin x = a</td><td>2 (pro |a| &lt; 1)</td><td>x₁ + 2kπ, x₂ = π − x₁ + 2kπ</td></tr>
              <tr><td>cos x = a</td><td>2 (pro |a| &lt; 1)</td><td>±x₁ + 2kπ</td></tr>
              <tr><td>tg x = a</td><td>1</td><td>x₁ + kπ</td></tr>
              <tr><td>cotg x = a</td><td>1</td><td>x₁ + kπ</td></tr>
            </tbody>
          </table>
        </div>
        <p>Pro |a| &gt; 1 nemá sin x = a ani cos x = a řešení. tg a cotg nabývají všech hodnot.</p>
        <h4>Obecný postup</h4>
        <ol>
          <li><b>Uprav rovnici</b> tak, aby na jedné straně byla jen jedna goniometrická funkce: <M>cos x = …</M>. Sčítáš „cos x“ jako proměnnou: −7 cos x − 5 cos x = −12 cos x.</li>
          <li><b>Referenční úhel</b>: najdi v tabulce úhel v I. kvadrantu pro kladnou hodnotu (pro −1 u cotg → π/4).</li>
          <li><b>Kvadranty</b>: podle znaménka urči, kde řešení leží (cotg &lt; 0 → II. a IV. kvadrant).</li>
          <li><b>Přičti periodu</b>: 2kπ u sin/cos, kπ u tg/cotg. Napiš k ∈ ℤ.</li>
          <li>Pokud byl argument složitější (x/2 + π), <b>vyjádři x</b> — perioda se násobí/dělí spolu s ním.</li>
        </ol>
        <h4>Rovnice se složitějším argumentem — substituce</h4>
        <Calc>cotg(x/2 + π) = −1 → t = x/2 + π → cotg t = −1 → t = 3π/4 + kπ<br />x/2 + π = 3π/4 + kπ → x/2 = −π/4 + kπ → x = −π/2 + 2kπ</Calc>
        <p>To je stejná množina jako 3π/2 + 2kπ (liší se o 2π, tj. jiné k). Oba zápisy jsou správně. Kratší cesta: nejdřív si všimni, že „+ π“ u cotg nic nemění (perioda π).</p>
        <h4>Když hodnota není v tabulce</h4>
        <p>cos x = −√3/12 ≈ −0,144: použij kalkulačku, x₁ = arccos(−0,144) ≈ 1,716 rad (98,3°). Řešení x = ±1,716 + 2kπ. Buď celé v radiánech, nebo celé ve stupních (±98°18′ + k·360°) — <b>nikdy ne napůl</b>.</p>
        <h4>Zkouška</h4>
        <p>Dosaď jedno řešení (k = 0) do původní rovnice a zkontroluj, že argument nespadne do bodu, kde funkce není definovaná.</p>
        <div className="pit">Nejčastější chyby: zapomenout druhé řešení u sin/cos; napsat 2kπ u tg/cotg (správně kπ); po vynásobení x/2 → x zapomenout vynásobit i periodu (kπ → 2kπ).</div>
        <div className="exam"><b>Na testu:</b> vyber si rovnici, kterou vyřešíš přesně (typicky tg/cotg s tabulkovou hodnotou), a udělej zkoušku.</div>
      </Collapse>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// TRÉNINK — podobné úlohy s jinými čísly
// ══════════════════════════════════════════════════════════════════
function TrainTab() {
  return (
    <div>
      <div className="intro">
        <p>Stejné typy úloh jako v testu, jen s jinými čísly — přesně to tě čeká, pokud dostaneš jinou skupinu. Počítej na papír, výsledek ověř a teprve pak otevři řešení.</p>
      </div>

      <Problem num="T1" badge="easy" title="Odchylka vektorů"
        check={<Check fields={[{ label: "φ ≈", v: 98.13, tol: 0.02, unit: "° (desetinně)" }]} />}
        solution={{
          given: <><V c="u" /> = (2; −1), <V c="v" /> = (1; 3)</>,
          formula: <>cos φ = <V c="u" />·<V c="v" /> / (|<V c="u" />|·|<V c="v" />|)</>,
          steps: [
            { t: "Skalární součin:", c: <><V c="u" />·<V c="v" /> = 2·1 + (−1)·3 = 2 − 3 = −1</> },
            { t: "Velikosti:", c: <>|<V c="u" />| = <Rt>4 + 1</Rt> = <Rt>5</Rt>,&nbsp; |<V c="v" />| = <Rt>1 + 9</Rt> = <Rt>10</Rt></> },
            { t: "Dosazení a kalkulačka (DEG):", c: <>cos φ = −1/<Rt>50</Rt> ≈ −0,141 4 → φ ≈ 98,130°</> },
            { t: "Minuty:", c: <>0,130 · 60 ≈ 7,8′ → 8′</> },
          ],
          result: <Res>φ ≈ 98°8′</Res>,
          pitfall: <>Záporný skalární součin → tupý úhel. U vektorů je to v pořádku (odchylka přímek by byla 81°52′).</>
        }}>
        <p>Spočítej odchylku vektorů <V c="u" /> = (2; −1) a <V c="v" /> = (1; 3). Zaokrouhli na minuty.</p>
      </Problem>

      <Problem num="T2" badge="easy" title="Odchylka vektorů z bodů"
        check={<Check fields={[{ label: "φ ≈", v: 116.57, tol: 0.02, unit: "° (desetinně)" }]} />}
        solution={{
          given: <>P[1; 1], Q[3; 1], R[0; 3]; vektory <V c="PQ" /> a <V c="PR" /></>,
          formula: <>vektor = konec − začátek; cos φ = <V c="u" />·<V c="v" /> / (|<V c="u" />|·|<V c="v" />|)</>,
          steps: [
            { c: <><V c="PQ" /> = (2; 0), <V c="PR" /> = (−1; 2)</> },
            { c: <>součin = −2 + 0 = −2; |<V c="PQ" />| = 2, |<V c="PR" />| = <Rt>5</Rt></> },
            { c: <>cos φ = −2 / (2<Rt>5</Rt>) = −1/<Rt>5</Rt> ≈ −0,447 2 → φ ≈ 116,57° = 116°34′</> },
          ],
          result: <Res>φ ≈ 116°34′</Res>,
        }}>
        <p>Body P[1; 1], Q[3; 1], R[0; 3]. Urči odchylku vektorů <V c="PQ" /> a <V c="PR" />.</p>
      </Problem>

      <Problem num="T3" badge="easy" title="Rovnoběžník"
        check={<Check fields={[{ label: "D = [", v: -2 }, { label: ";", v: 2, unit: "]" }]} />}
        solution={{
          given: <>A[2; −1], B[5; 3], C[1; 6]</>,
          formula: <>D = A + C − B</>,
          steps: [
            { c: <>D = [2 + 1 − 5; −1 + 6 − 3] = [−2; 2]</> },
            { t: "Kontrola středů úhlopříček:", c: <>S<sub>AC</sub> = [1,5; 2,5], S<sub>BD</sub> = [1,5; 2,5] ✔</> },
          ],
          result: <Res>D[−2; 2]</Res>,
        }}>
        <p>Urči bod D tak, aby ABCD byl rovnoběžník: A[2; −1], B[5; 3], C[1; 6].</p>
      </Problem>

      <Problem num="T4" badge="medium" title="Tři přímky"
        solution={{
          given: <>A[1; 2], B[4; −2], <V c="n" /> = (4; 1), <V c="u" /> = (2; 5)</>,
          formula: <>ax + by + c = 0, (a; b) = normálový vektor</>,
          steps: [
            { t: "p (bod A, normála n):", c: <>4x + y + c = 0 → 4 + 2 + c = 0 → c = −6 → 4x + y − 6 = 0</> },
            { t: "q (bod A, směr u = (2; 5) → normála (5; −2)):", c: <>5x − 2y + c = 0 → 5 − 4 + c = 0 → c = −1 → 5x − 2y − 1 = 0</> },
            { t: "r (body A, B): AB = (3; −4) → normála (4; 3):", c: <>4x + 3y + c = 0 → 4 + 6 + c = 0 → c = −10 → 4x + 3y − 10 = 0</> },
            { t: "Kontrola B v r:", c: <>16 − 6 − 10 = 0 ✔</> },
          ],
          result: <><Res>p: 4x + y − 6 = 0</Res> <Res>q: 5x − 2y − 1 = 0</Res> <Res>r: 4x + 3y − 10 = 0</Res></>,
        }}>
        <p>Napiš obecné rovnice přímek: p (bod A[1; 2], normálový vektor (4; 1)), q (bod A, směrový vektor (2; 5)), r (body A a B[4; −2]).</p>
      </Problem>

      <Problem num="T5" badge="easy" title="Vzdálenost bodu od přímky"
        check={<Check fields={[{ label: "v =", v: 4, tol: 0.001 }]} />}
        solution={{
          given: <>P[3; −2], p: 4x − 3y + 2 = 0</>,
          formula: <>v = |ax₀ + by₀ + c| / <Rt>a² + b²</Rt></>,
          steps: [
            { c: <>|4·3 − 3·(−2) + 2| = |12 + 6 + 2| = 20</> },
            { c: <><Rt>16 + 9</Rt> = 5</> },
            { c: <>v = 20 / 5 = 4</> },
          ],
          result: <Res>v(P, p) = 4</Res>,
        }}>
        <p>Urči vzdálenost bodu P[3; −2] od přímky p: 4x − 3y + 2 = 0.</p>
      </Problem>

      <Problem num="T6" badge="medium" title="Vzdálenost od přímky ve směrnicovém tvaru"
        check={<Check fields={[{ label: "v ≈", v: 2.85, tol: 0.01 }]} />}
        solution={{
          given: <>Q[−1; 4], m: y = 3x − 2</>,
          formula: <>nejdřív převést na obecný tvar</>,
          steps: [
            { c: <>y = 3x − 2 → 3x − y − 2 = 0</> },
            { c: <>|3·(−1) − 4 − 2| = |−9| = 9;&nbsp; <Rt>9 + 1</Rt> = <Rt>10</Rt></> },
            { c: <>v = 9/<Rt>10</Rt> ≈ 2,846</> },
          ],
          result: <Res>v ≈ 2,85</Res>,
          pitfall: <>Častá chyba: dosadit do y = 3x − 2 přímo bez převodu. Vzorec funguje jen pro ax + by + c = 0.</>
        }}>
        <p>Urči vzdálenost bodu Q[−1; 4] od přímky m: y = 3x − 2.</p>
      </Problem>

      <Problem num="T7" badge="medium" title="Kružnice ze středu a bodu"
        check={<Check fields={[{ label: "c =", v: -12, tol: 0 }]} hint="Obecná rovnice x² + y² + ax + by + c = 0 — zadej číslo c." />}
        solution={{
          given: <>S[−2; 3], bod M[1; −1] leží na kružnici</>,
          formula: <>(x − m)² + (y − n)² = r², r² = |SM|²</>,
          steps: [
            { c: <>r² = (1 + 2)² + (−1 − 3)² = 9 + 16 = 25</> },
            { c: <>(x + 2)² + (y − 3)² = 25</> },
            { c: <>x² + 4x + 4 + y² − 6y + 9 − 25 = 0</> },
            { c: <>x² + y² + 4x − 6y − 12 = 0</> },
            { t: "Kontrola bodem M:", c: <>1 + 1 + 4 + 6 − 12 = 0 ✔</> },
          ],
          result: <><Res>(x + 2)² + (y − 3)² = 25</Res> <Res>x² + y² + 4x − 6y − 12 = 0</Res></>,
        }}>
        <p>Napiš středovou i obecnou rovnici kružnice se středem S[−2; 3], která prochází bodem M[1; −1].</p>
      </Problem>

      <Problem num="T8" badge="medium" title="Z obecné rovnice na střed a poloměr"
        check={<Check fields={[{ label: "S = [", v: 3 }, { label: ";", v: -2, unit: "]" }, { label: "r =", v: 4 }]} />}
        solution={{
          given: <>x² + y² − 6x + 4y − 3 = 0</>,
          formula: <>doplnění na čtverec: x² − 2mx = (x − m)² − m²</>,
          steps: [
            { c: <>(x² − 6x) + (y² + 4y) = 3</> },
            { c: <>(x² − 6x + 9) + (y² + 4y + 4) = 3 + 9 + 4</> },
            { c: <>(x − 3)² + (y + 2)² = 16</> },
          ],
          result: <Res>S[3; −2], r = 4</Res>,
        }}>
        <p>Urči střed a poloměr kružnice x² + y² − 6x + 4y − 3 = 0.</p>
      </Problem>

      <Problem num="T9" badge="medium" title="Pozemky — jiná čísla"
        check={<Check fields={[{ label: "rozdíl =", v: 1250, tol: 0.5, unit: "m²" }]} />}
        solution={{
          given: <>Strana většího čtverce 50 m leží naproti úhlu 45°, strana menšího čtverce naproti úhlu 30°.</>,
          formula: <>b = a · sin β / sin α</>,
          steps: [
            { c: <>b = 50 · sin 30° / sin 45° = 50 · (1/2) / (√2/2) = 50/√2 ≈ 35,36 m</> },
            { c: <>b² = 2 500 / 2 = 1 250 m²</> },
            { c: <>rozdíl = 50² − 1 250 = 2 500 − 1 250 = 1 250 m²</> },
          ],
          result: <Res>1 250 m²</Res>,
        }}>
        <p>Trojúhelník má úhly 30° a 45°. Na stranu naproti 45° navazuje čtverec o straně 50 m, na stranu naproti 30° jiný čtverec. O kolik m² je větší čtverec větší?</p>
      </Problem>

      <Problem num="T10" badge="medium" title="Kosinová věta"
        check={<Check fields={[{ label: "c ≈", v: 6.24, tol: 0.01 }]} />}
        solution={{
          given: <>a = 5, b = 7, γ = 60°</>,
          formula: <>c² = a² + b² − 2ab cos γ</>,
          steps: [
            { c: <>c² = 25 + 49 − 2·5·7·(1/2) = 74 − 35 = 39</> },
            { c: <>c = <Rt>39</Rt> ≈ 6,245</> },
          ],
          result: <Res>c ≈ 6,24</Res>,
        }}>
        <p>V trojúhelníku je a = 5 cm, b = 7 cm a úhel mezi nimi γ = 60°. Urči c.</p>
      </Problem>

      <Problem num="T11" badge="medium" title="Lineární rovnice s cos"
        solution={{
          given: <>3 cos x = cos x − <Rt>2</Rt></>,
          formula: <>cos x = a → x = ±x₁ + 2kπ</>,
          steps: [
            { c: <>3 cos x − cos x = −<Rt>2</Rt> → 2 cos x = −<Rt>2</Rt> → cos x = −<Rt>2</Rt>/2</> },
            { t: "Referenční úhel π/4, cos záporný → II. a III. kvadrant:", c: <>x₁ = π − π/4 = 3π/4,&nbsp; x₂ = π + π/4 = 5π/4</> },
            { c: <>x = 3π/4 + 2kπ ∨ x = 5π/4 + 2kπ (= ±3π/4 + 2kπ)</> },
          ],
          result: <Res>x = ±3π/4 + 2kπ, k ∈ ℤ</Res>,
        }}>
        <p>Vyřeš v ℝ: 3 cos x = cos x − √2.</p>
      </Problem>

      <Problem num="T12" badge="medium" title="Lineární rovnice se sin"
        solution={{
          given: <>5 sin x + <Rt>2</Rt> = 3 sin x</>,
          formula: <>sin x = a → x₁ + 2kπ, π − x₁ + 2kπ</>,
          steps: [
            { c: <>2 sin x = −<Rt>2</Rt> → sin x = −<Rt>2</Rt>/2</> },
            { t: "Referenční úhel π/4, sin záporný → III. a IV. kvadrant:", c: <>x = π + π/4 = 5π/4,&nbsp; x = 2π − π/4 = 7π/4</> },
          ],
          result: <Res>x = 5π/4 + 2kπ ∨ x = 7π/4 + 2kπ</Res>,
        }}>
        <p>Vyřeš v ℝ: 5 sin x + √2 = 3 sin x.</p>
      </Problem>

      <Problem num="T13" badge="hard" title="tg se složeným argumentem"
        solution={{
          given: <>tg(x/3 − π) = <Rt>3</Rt></>,
          formula: <>tg má periodu π → tg(t − π) = tg t</>,
          steps: [
            { c: <>tg(x/3) = <Rt>3</Rt></> },
            { c: <>x/3 = π/3 + kπ</> },
            { t: "Vynásobím třemi — i periodu:", c: <>x = π + 3kπ</> },
            { t: "Zkouška k = 0: x = π:", c: <>tg(π/3 − π) = tg(−2π/3) = tg(π/3) = <Rt>3</Rt> ✔</> },
          ],
          result: <Res>x = π + 3kπ, k ∈ ℤ</Res>,
        }}>
        <p>Vyřeš v ℝ: tg(x/3 − π) = √3.</p>
      </Problem>

      <Problem num="T14" badge="hard" title="cotg s posunutým argumentem"
        solution={{
          given: <>cotg(2x + π) = <Rt>3</Rt>/3</>,
          formula: <>cotg t = √3/3 ⇔ t = π/3 + kπ</>,
          steps: [
            { c: <>cotg(2x + π) = cotg(2x) = <Rt>3</Rt>/3</> },
            { c: <>2x = π/3 + kπ</> },
            { t: "Vydělím dvěma — i periodu:", c: <>x = π/6 + kπ/2</> },
          ],
          result: <Res>x = π/6 + kπ/2, k ∈ ℤ</Res>,
          pitfall: <>Tady se perioda <b>dělí</b> (2x → x), takže vyjde kπ/2. V testu (x/2) se naopak <b>násobila</b>.</>
        }}>
        <p>Vyřeš v ℝ: cotg(2x + π) = √3/3.</p>
      </Problem>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// KVÍZ
// ══════════════════════════════════════════════════════════════════
const QUESTIONS = [
  { question: "Vektor z bodu P[2; −1] do bodu Q[−1; 3] má souřadnice:", type: "single", options: ["(−3; 4)", "(3; −4)", "(1; 2)", "(−3; 2)"], correct: [0], explanation: "Konec minus začátek: (−1 − 2; 3 − (−1)) = (−3; 4).", tip: "Vektor = KONEC − ZAČÁTEK." },
  { question: "Skalární součin vektorů u = (3; 2) a n = (3; −2) je:", type: "single", options: ["5", "13", "0", "(9; −4)"], correct: [0], explanation: "3·3 + 2·(−2) = 9 − 4 = 5. Skalární součin je číslo, ne vektor." },
  { question: "Dva nenulové vektory jsou na sebe kolmé, právě když:", type: "single", options: ["jejich skalární součin je 0", "mají stejnou velikost", "jeden je násobkem druhého", "jejich skalární součin je 1"], correct: [0], explanation: "cos 90° = 0, takže u·v = |u|·|v|·0 = 0. Násobek znamená rovnoběžnost." },
  { question: "Odchylka vektorů (1; 0) a (−1; 1) je:", type: "single", options: ["135°", "45°", "90°", "225°"], correct: [0], explanation: "cos φ = −1 / (1·√2) = −√2/2 → φ = 135°. Odchylka vektorů je v ⟨0°; 180°⟩, 225° nemůže vyjít." },
  { question: "Jak převedeš 67,38° na stupně a minuty?", type: "single", options: ["67°23′", "67°38′", "67°3′", "67°22′48″ se zaokrouhlí na 67°22′"], correct: [0], explanation: "0,38 · 60 = 22,8′ → zaokrouhleno 23′. 67°38′ je častý omyl — desetinná čárka není minuta." },
  { question: "ABCD je rovnoběžník. Který vztah platí pro vrchol D?", type: "single", options: ["D = A + C − B", "D = A + B − C", "D = B + C − A", "D = (A + C) / 2"], correct: [0], explanation: "AD = BC → D − A = C − B → D = A + C − B. (A + C)/2 je střed úhlopříčky." },
  { question: "Normálový vektor přímky 2x − 5y + 3 = 0 je:", type: "single", options: ["(2; −5)", "(5; 2)", "(2; 5)", "(−5; 3)"], correct: [0], explanation: "V obecné rovnici ax + by + c = 0 je (a; b) normálový vektor → (2; −5). (5; 2) je směrový." },
  { question: "Které vektory jsou SMĚROVÉ vektory přímky 3x + 2y − 1 = 0?", type: "multi", options: ["(2; −3)", "(−2; 3)", "(4; −6)", "(3; 2)"], correct: [0, 1, 2], explanation: "Normálový je (3; 2). Směrový je na něj kolmý: (2; −3) a všechny jeho nenulové násobky — (−2; 3) i (4; −6). (3; 2) je normálový, ne směrový." },
  { question: "Přímka q prochází bodem A[−1; 2] a má směrový vektor (3; 2). Její obecná rovnice je:", type: "single", options: ["2x − 3y + 8 = 0", "3x + 2y − 1 = 0", "3x − 2y + 7 = 0", "2x + 3y − 4 = 0"], correct: [0], explanation: "Směrový (3; 2) → normálový (2; −3). 2x − 3y + c = 0, dosadím A: −2 − 6 + c = 0 → c = 8." },
  { question: "Přímku y = −2x − 5 v obecném tvaru zapíšeš jako:", type: "single", options: ["2x + y + 5 = 0", "2x − y − 5 = 0", "−2x + y + 5 = 0", "x + 2y + 5 = 0"], correct: [0], explanation: "Převedu vše doleva: 2x + y + 5 = 0. Kontrola: y = −2x − 5 ✔." },
  { question: "Vzdálenost počátku O[0; 0] od přímky 3x + 4y − 10 = 0 je:", type: "single", options: ["2", "10", "10/7", "5"], correct: [0], explanation: "|0 + 0 − 10| / √(9 + 16) = 10 / 5 = 2." },
  { question: "Proč spolužák v úloze 4 ztratil body, i když měl správný princip?", type: "single", options: ["Zaokrouhloval mezivýsledky", "Použil špatný vzorec", "Spočítal vzdálenost od jiné přímky", "Zapomněl absolutní hodnotu"], correct: [0], explanation: "Učitelka napsala: „moc zaokrouhleno, takže jste vedle; princip ok“. Zaokrouhluj až na konci." },
  { question: "Kružnice x² + y² − 4x + 6y − 3 = 0 má:", type: "single", options: ["S[2; −3], r = 4", "S[−2; 3], r = 4", "S[2; −3], r = √3", "S[4; −6], r = 3"], correct: [0], explanation: "(x − 2)² + (y + 3)² = 3 + 4 + 9 = 16 → S[2; −3], r = 4. Koeficient u x je −2m → m = 2." },
  { question: "Obecný tvar kružnice (x − 1)² + (y + 1)² = 13 je:", type: "single", options: ["x² + y² − 2x + 2y − 11 = 0", "x² + y² + 2x − 2y − 11 = 0", "x² + y² − 2x + 2y + 11 = 0", "x² + y² − 2x + 2y − 13 = 0"], correct: [0], explanation: "x² − 2x + 1 + y² + 2y + 1 − 13 = 0 → x² + y² − 2x + 2y − 11 = 0. Přesně tady spolužák prohodil znaménka." },
  { question: "Sinová věta zní:", type: "single", options: ["a / sin α = b / sin β", "a / sin β = b / sin α", "a · sin α = b · sin β", "a² = b² + c² − 2bc · cos α"], correct: [0], explanation: "Strana dělená sinem PROTĚJŠÍHO úhlu je pro všechny strany stejná. Poslední možnost je kosinová věta." },
  { question: "Ve kterých situacích použiješ kosinovou větu?", type: "multi", options: ["Znáš dvě strany a úhel mezi nimi", "Znáš všechny tři strany a hledáš úhel", "Znáš dva úhly a jednu stranu", "Znáš stranu a úhel naproti ní"], correct: [0, 1], explanation: "sus a sss → kosinová věta. Dva úhly + strana nebo strana + protější úhel → sinová věta." },
  { question: "V úloze 6 leží strana 70 m (Pokorných) naproti úhlu:", type: "single", options: ["60°", "45°", "75°", "90°"], correct: [0], explanation: "Strana Pokorných spojuje horní vrchol s pravým dolním (45°). Naproti ní je levý dolní vrchol s úhlem 60°." },
  { question: "Perioda funkce cotg je:", type: "single", options: ["π", "2π", "π/2", "4π"], correct: [0], explanation: "tg a cotg mají periodu π, sin a cos 2π. Proto cotg(x/2 + π) = cotg(x/2)." },
  { question: "Řešení rovnice cotg(x/2) = −1 je:", type: "single", options: ["x = 3π/2 + 2kπ", "x = 3π/4 + kπ", "x = 3π/2 + kπ", "x = 3π/8 + 2kπ"], correct: [0], explanation: "x/2 = 3π/4 + kπ → vynásobím 2 → x = 3π/2 + 2kπ. Násobí se i perioda!" },
  { question: "Úpravou −7·cos x = 5·cos x + √3 dostaneš:", type: "single", options: ["cos x = −√3/12", "cos x = −√3/2", "cos x = √3/12", "cos x = −12√3"], correct: [0], explanation: "−7 cos x − 5 cos x = −12 cos x = √3 → cos x = −√3/12. Spolužák chybně napsal −2 cos x." },
  { question: "Která čísla jsou řešením cos x = −√2/2 v intervalu ⟨0; 2π)?", type: "multi", options: ["3π/4", "5π/4", "π/4", "7π/4"], correct: [0, 1], explanation: "cos je záporný ve II. a III. kvadrantu: π − π/4 = 3π/4 a π + π/4 = 5π/4." },
  { question: "sin(5π/4) = ?", type: "single", options: ["−√2/2", "√2/2", "−1/2", "−√3/2"], correct: [0], explanation: "5π/4 je ve III. kvadrantu (sin záporný), referenční úhel π/4 → −√2/2." },
];

function QuizEngine({ questions, accentColor = BLUE }) {
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
    setIdx(0); setAnswers({}); setRevealed({}); setPendingMulti([]); setShowResults(false); setShuffleKey(k => k + 1);
  }, []);

  if (showResults) {
    const msg =
      pct >= 90 ? "Výborně! Máš to perfektně zvládnuté!"
      : pct >= 70 ? "Dobře! Téměř máš vše zvládnuté."
      : pct >= 50 ? "Mohlo by to být lepší, ale jdeš správným směrem."
      : "Potřebuješ více přípravy. Opakuj a bude to!";
    return (
      <div style={S.resultsWrap}>
        <div style={S.resultsCard}>
          <div style={S.resultsScore}>{score} / {shuffledQuestions.length}</div>
          <div style={S.resultsPct}>{pct} %</div>
          <div style={S.resultsMsg}>{msg}</div>
          <button className="btn" onClick={restart}>Začít znovu</button>
        </div>
      </div>
    );
  }

  const activeSet = isMulti ? (isRevealed ? myAnswer : pendingMulti) : myAnswer;

  return (
    <div style={S.wrap}>
      <div style={S.dotBar}>
        {shuffledQuestions.map((_, i) => {
          let bg = "#c9d3e3";
          if (i === idx) bg = accentColor;
          else if (revealed[i]) bg = arrEqual(answers[i] || [], shuffledQuestions[i].correct) ? "#1f9d55" : RED;
          return <div key={i} onClick={() => goTo(i)} title={`Otázka ${i + 1}`} style={{ ...S.dot, background: bg }} />;
        })}
      </div>
      <div style={S.card}>
        <div style={S.qNum}>Otázka {idx + 1} / {shuffledQuestions.length}{isMulti ? " · více správných odpovědí" : ""}</div>
        <div style={S.qText}>{q.question}</div>
        <div style={S.optionsList}>
          {q.options.map((opt, i) => {
            let border = "1.5px solid #c9d3e3";
            let bg = "#fff";
            if (isRevealed) {
              if (q.correct.includes(i)) { bg = "#e8f6ee"; border = "1.5px solid #1f9d55"; }
              else if (activeSet.includes(i)) { bg = "#fdecec"; border = `1.5px solid ${RED}`; }
            } else if (activeSet.includes(i)) {
              bg = "#eef2fb"; border = `1.5px solid ${accentColor}`;
            }
            return (
              <div key={i} style={{ ...S.option, background: bg, border }} onClick={() => isMulti ? toggleMulti(i) : handleSingleSelect(i)}>
                {isMulti && <span style={S.checkbox}>{activeSet.includes(i) ? "☑" : "☐"}</span>}
                <span>{opt}</span>
              </div>
            );
          })}
        </div>
        {isMulti && !isRevealed && (
          <button className="btn" style={{ marginTop: 14, opacity: pendingMulti.length === 0 ? 0.4 : 1 }} onClick={submitMulti} disabled={pendingMulti.length === 0}>Potvrdit</button>
        )}
        {isRevealed && (
          <div style={{ ...S.feedback, borderColor: isCorrect ? "#1f9d55" : RED }}>
            <div style={{ ...S.feedbackHeader, color: isCorrect ? "#1f9d55" : RED }}>{isCorrect ? "Správně!" : "Špatně"}</div>
            {!isCorrect && <div style={S.feedbackCorrect}>Správná odpověď: {q.correct.map(i => q.options[i]).join(", ")}</div>}
            <div style={S.feedbackExplanation}>{q.explanation}</div>
            {q.tip && <div style={S.feedbackTip}>Tip: {q.tip}</div>}
          </div>
        )}
      </div>
      <div style={S.navRow}>
        <button className="btn" onClick={() => goTo(idx - 1)} disabled={idx === 0} style={{ opacity: idx === 0 ? 0.4 : 1 }}>← Předchozí</button>
        {idx < shuffledQuestions.length - 1
          ? <button className="btn" onClick={() => goTo(idx + 1)}>Další →</button>
          : <button className="btn solid" onClick={() => setShowResults(true)}>Výsledky →</button>}
      </div>
    </div>
  );
}

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
    return { ...q, options: shuffledIndices.map(i => q.options[i]), correct: q.correct.map(o => shuffledIndices.indexOf(o)) };
  });
}
function arrEqual(a, b) {
  if (!a || !b) return false;
  const sa = [...a].sort((x, y) => x - y);
  const sb = [...b].sort((x, y) => x - y);
  return sa.length === sb.length && sa.every((v, i) => v === sb[i]);
}

const S = {
  wrap: { display: "flex", flexDirection: "column", gap: "16px", maxWidth: "720px", margin: "0 auto" },
  dotBar: { display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" },
  dot: { width: "22px", height: "22px", borderRadius: "50%", cursor: "pointer", transition: "background 0.4s ease" },
  card: { background: "rgba(255,255,255,0.94)", borderLeft: `2px solid ${BLUE}`, padding: "22px 22px", transition: "all 0.4s ease" },
  qNum: { color: "#6b7a99", fontSize: "13px", marginBottom: "6px", fontFamily: "'JetBrains Mono', monospace" },
  qText: { color: INK, fontSize: "18px", fontWeight: 600, lineHeight: 1.55, marginBottom: "18px", fontFamily: "'Libre Baskerville', Georgia, serif" },
  optionsList: { display: "flex", flexDirection: "column", gap: "10px" },
  option: { padding: "12px 16px", minHeight: "44px", color: INK, cursor: "pointer", transition: "all 0.4s ease", display: "flex", alignItems: "center", gap: "10px", userSelect: "none", fontSize: "16px", fontFamily: "'JetBrains Mono', monospace" },
  checkbox: { fontSize: "18px", minWidth: "20px", color: BLUE },
  feedback: { marginTop: "18px", padding: "14px 16px", borderLeft: "3px solid", background: "#fafbfe" },
  feedbackHeader: { fontWeight: 700, fontSize: "16px", marginBottom: "6px" },
  feedbackCorrect: { color: "#1f9d55", fontSize: "15px", marginBottom: "6px" },
  feedbackExplanation: { color: "#33415c", fontSize: "16px", lineHeight: 1.6 },
  feedbackTip: { color: RED, fontSize: "15px", marginTop: "8px", fontStyle: "italic" },
  navRow: { display: "flex", justifyContent: "space-between", gap: "10px" },
  resultsWrap: { display: "flex", alignItems: "center", justifyContent: "center", minHeight: "280px" },
  resultsCard: { textAlign: "center", background: "#fff", borderLeft: `2px solid ${BLUE}`, padding: "36px 40px" },
  resultsScore: { color: RED, fontSize: "52px", fontWeight: 800, lineHeight: 1.1, fontFamily: "'Libre Baskerville', Georgia, serif" },
  resultsPct: { color: "#6b7a99", fontSize: "22px", marginBottom: "16px" },
  resultsMsg: { color: INK, fontSize: "17px", lineHeight: 1.5, maxWidth: "340px", margin: "0 auto 20px" },
};

// ══════════════════════════════════════════════════════════════════
// KARTIČKY
// ══════════════════════════════════════════════════════════════════
const CARDS = [
  ["Souřadnice vektoru AB", "B − A (konec minus začátek)"],
  ["Velikost vektoru u = (u₁; u₂)", "|u| = √(u₁² + u₂²)"],
  ["Skalární součin", "u · v = u₁v₁ + u₂v₂ (výsledek je číslo)"],
  ["Odchylka vektorů", "cos φ = u·v / (|u|·|v|), φ ∈ ⟨0°; 180°⟩"],
  ["Kolmost vektorů", "u · v = 0"],
  ["Převod 0,38° na minuty", "0,38 · 60 = 22,8′ ≈ 23′"],
  ["Čtvrtý vrchol rovnoběžníku ABCD", "D = A + C − B"],
  ["Střed úsečky AB", "S = [(a₁ + b₁)/2; (a₂ + b₂)/2]"],
  ["Obecná rovnice přímky", "ax + by + c = 0, (a; b) = normálový vektor"],
  ["Směrový (u₁; u₂) → normálový", "(u₂; −u₁) — prohodit a změnit jedno znaménko"],
  ["Vzdálenost bodu [x₀; y₀] od přímky", "|ax₀ + by₀ + c| / √(a² + b²)"],
  ["Středová rovnice kružnice", "(x − m)² + (y − n)² = r², S[m; n]"],
  ["Obecná rovnice kružnice", "x² + y² + ax + by + c = 0; a = −2m, b = −2n"],
  ["Sinová věta", "a/sin α = b/sin β = c/sin γ"],
  ["Kosinová věta", "c² = a² + b² − 2ab·cos γ"],
  ["sin 30°, sin 45°, sin 60°", "1/2, √2/2, √3/2"],
  ["cotg π/6, π/4, π/3", "√3, 1, √3/3"],
  ["Perioda sin, cos / tg, cotg", "2π / π"],
  ["cotg t = −1", "t = 3π/4 + kπ"],
  ["cos x = a (|a| < 1)", "x = ±arccos a + 2kπ"],
  ["sin x = a", "x = x₁ + 2kπ ∨ x = π − x₁ + 2kπ"],
  ["x/2 = α + kπ → x = ?", "x = 2α + 2kπ (násobí se i perioda)"],
];

function Flashcards() {
  const [i, setI] = useState(0);
  const [flip, setFlip] = useState(false);
  const go = n => { setFlip(false); setI((n + CARDS.length) % CARDS.length); };
  return (
    <div className="fcWrap">
      <div className="fcScene" onClick={() => setFlip(f => !f)}>
        <div className={"fcCard" + (flip ? " flipped" : "")}>
          <div className="fcFace front"><span className="fcTag">otázka</span><div>{CARDS[i][0]}</div><span className="fcHint">klikni pro otočení</span></div>
          <div className="fcFace back"><span className="fcTag">odpověď</span><div className="m">{CARDS[i][1]}</div></div>
        </div>
      </div>
      <div className="fcNav">
        <button className="btn" onClick={() => go(i - 1)}>← Předchozí</button>
        <span className="fcCount">{i + 1} / {CARDS.length}</span>
        <button className="btn" onClick={() => go(i + 1)}>Další →</button>
      </div>
      <div className="fcDots">
        {CARDS.map((_, k) => <span key={k} className={"fcDot" + (k === i ? " on" : "")} onClick={() => go(k)} />)}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// VZORCE
// ══════════════════════════════════════════════════════════════════
function FormulaTab() {
  const groups = [
    ["➡️ Vektory", [
      ["vektor AB", "AB = B − A"],
      ["velikost", "|u| = √(u₁² + u₂²)"],
      ["vzdálenost bodů", "|AB| = √((b₁ − a₁)² + (b₂ − a₂)²)"],
      ["skalární součin", "u·v = u₁v₁ + u₂v₂"],
      ["odchylka", "cos φ = u·v / (|u|·|v|)"],
      ["kolmost", "u·v = 0"],
      ["stupně → minuty", "desetinná část · 60"],
    ]],
    ["▱ Body", [
      ["střed úsečky", "S = [(a₁+b₁)/2; (a₂+b₂)/2]"],
      ["rovnoběžník ABCD", "D = A + C − B"],
    ]],
    ["📏 Přímka", [
      ["obecná rovnice", "ax + by + c = 0, n = (a; b)"],
      ["směrový → normálový", "(u₁; u₂) → (u₂; −u₁)"],
      ["parametrická", "x = a₁ + t·u₁, y = a₂ + t·u₂"],
      ["směrnicový tvar", "y = kx + q → kx − y + q = 0"],
      ["vzdálenost bodu", "v = |ax₀ + by₀ + c| / √(a² + b²)"],
    ]],
    ["⭕ Kružnice", [
      ["středová", "(x − m)² + (y − n)² = r²"],
      ["obecná", "x² + y² + ax + by + c = 0"],
      ["střed z obecné", "m = −a/2, n = −b/2"],
      ["poloměr z obecné", "r² = m² + n² − c"],
    ]],
    ["△ Trojúhelník", [
      ["sinová věta", "a/sin α = b/sin β = c/sin γ"],
      ["kosinová věta", "c² = a² + b² − 2ab·cos γ"],
      ["součet úhlů", "α + β + γ = 180°"],
      ["obsah čtverce", "S = a²"],
    ]],
    ["🔄 Goniometrie", [
      ["radiány", "180° = π"],
      ["sin 30° / 45° / 60°", "1/2 / √2/2 / √3/2"],
      ["cos 30° / 45° / 60°", "√3/2 / √2/2 / 1/2"],
      ["tg 30° / 45° / 60°", "√3/3 / 1 / √3"],
      ["cotg", "cotg x = cos x / sin x = 1 / tg x"],
      ["periody", "sin, cos: 2π;  tg, cotg: π"],
      ["sin x = a", "x₁ + 2kπ, π − x₁ + 2kπ"],
      ["cos x = a", "±x₁ + 2kπ"],
      ["tg x = a, cotg x = a", "x₁ + kπ"],
    ]],
  ];
  return (
    <div>
      <div className="intro"><p>Všechno, co si musíš pamatovat, na jednom místě. Před testem si to přečti dvakrát a zkus to napsat zpaměti.</p></div>
      <div className="fgrid">
        {groups.map(([title, rows]) => (
          <section key={title} className="entry fg">
            <h3>{title}</h3>
            {rows.map(([k, v]) => (
              <div key={k} className="frow"><span className="fk">{k}</span><span className="fv">{v}</span></div>
            ))}
          </section>
        ))}
      </div>
      <section className="entry">
        <h3>✅ Checklist na test</h3>
        <ol>
          <li>Nejdřív si z obrázku vypiš souřadnice A, B, <V c="u" />, <V c="n" />.</li>
          <li>Kalkulačka v režimu <b>DEG</b> pro odchylku, výsledek na <b>°′</b>.</li>
          <li>Každou rovnici přímky a kružnice ověř dosazením bodu.</li>
          <li>Vzdálenost počítej vzorcem, zaokrouhli až na konci.</li>
          <li>V sinové větě páruj stranu s <b>protějším</b> úhlem.</li>
          <li>Goniometrická rovnice: vyber tu s tabulkovou hodnotou, hlídej periodu (kπ vs. 2kπ) a nemíchej ° s π.</li>
        </ol>
      </section>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// APP
// ══════════════════════════════════════════════════════════════════
const TABS = [
  ["test", "📝 Test + řešení"],
  ["teorie", "📖 Teorie"],
  ["trenink", "🏋️ Trénink"],
  ["kviz", "❓ Kvíz"],
  ["karty", "🃏 Kartičky"],
  ["vzorce", "📐 Vzorce"],
];

export default function App() {
  const [tab, setTab] = useState("test");
  return (
    <div className="nb">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet" />
      <style>{CSS}</style>
      <div className="wrap">
        <header className="hdr">
          <div className="hdrKicker">T1 · Matematika · 3. ročník</div>
          <h1>Opakování látky 2. ročníku</h1>
          <p className="hdrSub">vektory · přímka · vzdálenost bodu od přímky · kružnice · sinová věta · goniometrické rovnice</p>
        </header>
        <nav className="tabs">
          {TABS.map(([k, l]) => (
            <button key={k} className={"tab" + (tab === k ? " on" : "")} onClick={() => setTab(k)}>{l}</button>
          ))}
        </nav>
        <main key={tab} className="fade">
          {tab === "test" && <TestTab />}
          {tab === "teorie" && <TheoryTab />}
          {tab === "trenink" && <TrainTab />}
          {tab === "kviz" && <QuizEngine questions={QUESTIONS} accentColor={BLUE} />}
          {tab === "karty" && <Flashcards />}
          {tab === "vzorce" && <FormulaTab />}
        </main>
      </div>
    </div>
  );
}

const CSS = `
.nb{min-height:100vh;color:${INK};font-family:'Inter',system-ui,sans-serif;font-size:16px;line-height:1.65;
  background-color:#fbfbfd;
  background-image:linear-gradient(#dfe6f0 1px,transparent 1px),linear-gradient(90deg,#dfe6f0 1px,transparent 1px);
  background-size:24px 24px;position:relative;overflow-x:hidden}
.nb::before{content:"";position:fixed;top:0;bottom:0;left:44px;width:2px;background:rgba(209,43,43,.55);pointer-events:none;z-index:0}
.nb *{box-sizing:border-box}
.wrap{position:relative;z-index:1;max-width:980px;margin:0 auto;padding:28px 24px 80px 72px}
.nb p{margin:10px 0}
.nb ul{list-style:disc;padding-left:22px;margin:10px 0}
.nb ol{list-style:decimal;padding-left:24px;margin:10px 0}
.nb li{margin:4px 0}
.nb h3{font-family:'Libre Baskerville',Georgia,serif;font-size:19px;font-weight:700;margin:0;color:${INK};line-height:1.35}
.nb h4{font-family:'Libre Baskerville',Georgia,serif;font-size:16px;font-weight:700;color:${BLUE};margin:18px 0 6px}
.hdr{margin-bottom:18px}
.hdrKicker{font-family:'JetBrains Mono',monospace;font-size:13px;color:${RED};letter-spacing:.06em;text-transform:uppercase}
.hdr h1{font-family:'Libre Baskerville',Georgia,serif;font-size:32px;font-weight:700;margin:4px 0 6px;color:${BLUE};line-height:1.2}
.hdrSub{color:#4a5873;font-style:italic;margin:0}
.tabs{display:flex;gap:0;overflow-x:auto;border-bottom:2px solid ${BLUE};margin-bottom:22px;-webkit-overflow-scrolling:touch;scrollbar-width:thin}
.tab{flex:0 0 auto;min-height:44px;padding:10px 16px;background:rgba(255,255,255,.8);border:1px solid #c9d3e3;border-bottom:none;margin-right:-1px;color:${INK};font:600 15px 'Inter',sans-serif;cursor:pointer;transition:all .4s ease;white-space:nowrap}
.tab:hover{background:#eef2fb}
.tab.on{background:${BLUE};color:#fff;border-color:${BLUE}}
.fade{animation:fadeIn .4s ease}
@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
@keyframes stepIn{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:none}}
.intro{background:rgba(255,255,255,.9);padding:12px 18px;border-left:2px solid ${RED};margin-bottom:8px}
.entry{border-left:2px solid ${BLUE};padding:14px 18px;margin:26px 0;background:rgba(255,255,255,.92)}
.entryHead{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:8px}
.pnum{font-family:'Libre Baskerville',serif;font-weight:700;color:${RED};font-size:20px;min-width:34px;height:34px;display:inline-flex;align-items:center;justify-content:center;border:2px solid ${RED};border-radius:50%;padding:0 4px}
.badge{font-size:13px;font-weight:600;padding:2px 10px;border:1.5px solid}
.b-easy{color:#1f7a45;border-color:#1f7a45}
.b-medium{color:#b86b00;border-color:#b86b00}
.b-hard{color:${RED};border-color:${RED}}
.stmt{margin-bottom:10px}
.btn{min-height:44px;padding:10px 18px;border:1.5px solid ${BLUE};background:#fff;color:${BLUE};font:600 15px 'Inter',sans-serif;cursor:pointer;transition:all .4s ease;border-radius:0}
.btn:hover{background:${BLUE};color:#fff}
.btn.solid{background:${BLUE};color:#fff}
.btn.small{min-height:44px;padding:8px 14px}
.btn:disabled{cursor:default}
.sol{margin-top:14px;padding:6px 18px 16px;background:#fff;border:1px dashed #9fb0d8;animation:fadeIn .4s ease}
.sol h5{font-family:'Libre Baskerville',serif;font-size:15px;color:${BLUE};margin:14px 0 6px;font-weight:700}
.given,.formula{padding-left:2px}
.formula{font-family:'JetBrains Mono',monospace;font-size:15px}
.steps{list-style:none !important;padding-left:40px !important;margin:6px 0;counter-reset:s}
.steps li{position:relative;margin:10px 0;opacity:0;animation:stepIn .4s ease forwards;counter-increment:s}
.steps li::before{content:counter(s) ".";position:absolute;left:-40px;width:30px;text-align:right;color:${RED};font-family:'Libre Baskerville',serif;font-weight:700}
.st{color:#33415c}
.calc{font-family:'JetBrains Mono',monospace;font-size:15px;line-height:2;background:#f5f7fc;padding:6px 12px;margin:4px 0;overflow-x:auto;color:${INK}}
.resrow{display:flex;flex-wrap:wrap;gap:12px;align-items:center;padding:6px 0}
.res{display:inline-block;border:4px double ${RED};padding:4px 14px;color:${RED};font-family:'JetBrains Mono',monospace;font-weight:700;font-size:16px;transform:rotate(-.7deg);border-radius:3px 7px 4px 6px/6px 3px 7px 4px;background:#fff}
.pit{border-left:3px solid ${RED};background:#fff4f4;padding:10px 14px;margin:12px 0 4px}
.exam{border-left:3px solid ${BLUE};background:#eef2fb;padding:10px 14px;margin:14px 0 4px}
.m{font-family:'JetBrains Mono',monospace;font-size:.95em}
.frac{display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;margin:0 3px;line-height:1.25;font-size:.95em}
.frac .num{padding:0 3px}
.frac .den{border-top:1.5px solid currentColor;padding:0 3px}
.vec{position:relative;display:inline-block;font-style:italic;font-weight:600;padding-top:.35em;line-height:1}
.vec::before{content:"→";position:absolute;top:-.25em;left:0;right:0;text-align:center;font-size:.72em;font-style:normal}
.sqrt{white-space:nowrap}
.sqrt .rad{border-top:1.5px solid currentColor;padding:0 2px;margin-left:1px}
.check{margin:10px 0 12px;padding:10px 14px;background:#fafbfe;border:1px solid #dfe6f0}
.checkLbl{font-weight:600;font-size:15px;color:#33415c}
.checkRow{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-top:6px}
.checkField{display:flex;align-items:center;gap:6px;font-family:'JetBrains Mono',monospace}
.checkField input{width:96px;min-height:44px;padding:6px 10px;border:1.5px solid #9fb0d8;font:16px 'JetBrains Mono',monospace;background:#fff;color:${INK}}
.checkField input:focus{outline:none;border-color:${BLUE}}
.unit{font-size:14px;color:#4a5873}
.ok{color:#1f9d55;font-weight:700;margin-top:6px}
.bad{color:${RED};font-weight:600;margin-top:6px}
.opts{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:6px 18px;font-family:'JetBrains Mono',monospace;font-size:15px;margin:10px 0;padding:8px 12px;background:#f5f7fc}
.opts.two{grid-template-columns:repeat(auto-fill,minmax(260px,1fr));font-size:16px}
.figure{display:grid;grid-template-columns:minmax(0,340px) minmax(0,1fr);gap:18px;align-items:start;margin:10px 0}
.gridSvg,.ucSvg{width:100%;max-width:340px;height:auto;border:1px solid #c9d3e3;background:#fff}
.triSvg{width:100%;max-width:520px;height:auto;display:block;margin:10px 0;background:#fff;border:1px solid #dfe6f0}
.figSide{min-width:0}
.readout{font-family:'JetBrains Mono',monospace;font-size:15px;background:#f5f7fc;padding:10px 14px;line-height:1.9}
.toggles{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}
.tg{min-height:44px;padding:8px 12px;border:1.5px solid var(--c);color:var(--c);background:#fff;font:600 14px 'Inter',sans-serif;cursor:pointer;transition:all .4s ease}
.tg.on{background:var(--c);color:#fff}
.angleBtns{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;margin-bottom:10px}
.ab{min-height:44px;border:1px solid #c9d3e3;background:#fff;font:500 14px 'JetBrains Mono',monospace;color:${INK};cursor:pointer;transition:all .4s ease}
.ab.on{background:${BLUE};color:#fff;border-color:${BLUE}}
.small{font-size:14px;color:#4a5873}
.tblWrap{overflow-x:auto;margin:8px 0}
.tbl{border-collapse:collapse;width:100%;font-size:15px;background:#fff}
.tbl th,.tbl td{border:1px solid #c9d3e3;padding:6px 10px;text-align:left}
.tbl th{background:#eef2fb;font-weight:600}
.tbl.center td,.tbl.center th{text-align:center;font-family:'JetBrains Mono',monospace}
.tbl td.g{color:#1f7a45;font-weight:600}
.tbl td.r{color:${RED};font-weight:600}
.summary .tbl{margin:10px 0}
.coll{margin:14px 0;border-left:2px solid ${BLUE};background:rgba(255,255,255,.92)}
.collHead{width:100%;display:flex;align-items:center;gap:12px;min-height:52px;padding:10px 16px;background:transparent;border:none;cursor:pointer;text-align:left;color:${INK};transition:background .4s ease}
.collHead:hover{background:#eef2fb}
.collIcon{font-size:20px;width:28px;text-align:center}
.collTitle{flex:1;font:700 17px 'Libre Baskerville',Georgia,serif}
.collArrow{font:700 22px 'JetBrains Mono',monospace;color:${RED}}
.collBody{padding:2px 18px 16px;animation:fadeIn .4s ease}
.fgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:0 22px}
.fgrid .entry{margin:14px 0}
.fg h3{margin-bottom:8px}
.frow{display:flex;justify-content:space-between;gap:12px;padding:6px 0;border-bottom:1px dotted #c9d3e3;flex-wrap:wrap}
.fk{color:#4a5873;font-size:15px}
.fv{font-family:'JetBrains Mono',monospace;font-size:15px;color:${BLUE};font-weight:600;text-align:right}
.fcWrap{max-width:560px;margin:10px auto}
.fcScene{perspective:1000px;height:240px;cursor:pointer}
.fcCard{position:relative;width:100%;height:100%;transition:transform .4s ease;transform-style:preserve-3d}
.fcCard.flipped{transform:rotateY(180deg)}
.fcFace{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;text-align:center;background:#fff;border-left:2px solid ${BLUE};font:700 20px 'Libre Baskerville',Georgia,serif;box-shadow:0 1px 0 #dfe6f0}
.fcFace.back{transform:rotateY(180deg);border-left-color:${RED};color:${RED};font-size:19px}
.fcTag{position:absolute;top:10px;left:14px;font:500 12px 'JetBrains Mono',monospace;color:#6b7a99;text-transform:uppercase;letter-spacing:.06em}
.fcHint{position:absolute;bottom:10px;font:400 13px 'Inter',sans-serif;color:#6b7a99}
.fcNav{display:flex;justify-content:space-between;align-items:center;margin-top:14px;gap:10px}
.fcCount{font-family:'JetBrains Mono',monospace;color:#4a5873}
.fcDots{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin-top:14px}
.fcDot{width:14px;height:14px;border-radius:50%;background:#c9d3e3;cursor:pointer;transition:background .4s ease}
.fcDot.on{background:${BLUE}}
@media (max-width:640px){
  .nb::before{left:10px}
  .wrap{padding:16px 16px 60px 22px}
  .hdr h1{font-size:25px}
  .figure{grid-template-columns:minmax(0,1fr)}
  .entry{padding:12px 12px}
  .sol{padding:4px 10px 14px}
  .steps{padding-left:30px !important}
  .steps li::before{left:-30px;width:24px}
  .calc{font-size:14px}
  .fgrid{grid-template-columns:minmax(0,1fr)}
  .opts{grid-template-columns:minmax(0,1fr)}
  .fcScene{height:260px}
}
`;
