// @title Goniometrické funkce — příprava na test
// @subject Math
// @topic Goniometrie: orientovaný úhel, oblouková míra, jednotková kružnice
// @template study

import { useState, useCallback, useMemo } from "react";

// ── Shuffle utils ─────────────────────────────────────────────────────────
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function shuffleQs(qs) {
  return qs.map(q => {
    const si = shuffleArray(q.options.map((_, i) => i));
    return { ...q, options: si.map(i => q.options[i]), correct: q.correct.map(o => si.indexOf(o)) };
  });
}
function arrEq(a, b) {
  if (!a || !b) return false;
  const sa = [...a].sort((x, y) => x - y), sb = [...b].sort((x, y) => x - y);
  return sa.length === sb.length && sa.every((v, i) => v === sb[i]);
}

// ── Quiz Engine ───────────────────────────────────────────────────────────
function QuizEngine({ questions, accentColor = "#ff2d9b" }) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState({});
  const [pending, setPending] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [sk, setSk] = useState(0);
  const sqs = useMemo(() => shuffleQs(questions), [questions, sk]);
  const q = sqs[idx];
  const isMulti = q.type === "multi";
  const isRev = !!revealed[idx];
  const myAns = answers[idx] || [];
  const isOk = isRev && arrEq(myAns, q.correct);
  const score = sqs.filter((_, i) => revealed[i] && arrEq(answers[i] || [], sqs[i].correct)).length;
  const pct = Math.round((score / sqs.length) * 100);
  const goTo = useCallback((i) => { setIdx(i); setPending(sqs[i].type === "multi" ? (answers[i] || []) : []); }, [answers, sqs]);
  const handleSingle = useCallback((oi) => { if (isRev) return; setAnswers(p => ({ ...p, [idx]: [oi] })); setRevealed(p => ({ ...p, [idx]: true })); }, [idx, isRev]);
  const toggleMulti = useCallback((oi) => { if (isRev) return; setPending(p => p.includes(oi) ? p.filter(i => i !== oi) : [...p, oi]); }, [isRev]);
  const submitMulti = useCallback(() => { if (!pending.length) return; setAnswers(p => ({ ...p, [idx]: [...pending] })); setRevealed(p => ({ ...p, [idx]: true })); }, [idx, pending]);
  const restart = useCallback(() => { setIdx(0); setAnswers({}); setRevealed({}); setPending([]); setShowResults(false); setSk(k => k + 1); }, []);
  const active = isMulti ? (isRev ? myAns : pending) : myAns;

  if (showResults) {
    const msg = pct >= 90 ? "Výborně! Perfektně zvládnuté!" : pct >= 70 ? "Dobře! Téměř vše správně." : pct >= 50 ? "Slušný výkon, je co zlepšovat." : "Potřebuješ více procvičovat!";
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "300px" }}>
        <div style={{ textAlign: "center", background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "24px", padding: "40px 48px" }}>
          <div style={{ color: "#fff", fontSize: "52px", fontWeight: 800 }}>{score}/{sqs.length}</div>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "22px", marginBottom: "16px" }}>{pct}%</div>
          <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "17px", lineHeight: 1.5, marginBottom: "24px" }}>{msg}</div>
          <button style={{ padding: "10px 22px", background: accentColor + "55", border: `1px solid ${accentColor}`, borderRadius: "10px", color: "#fff", cursor: "pointer", fontSize: "15px", transition: "all 0.4s ease" }} onClick={restart}>Začít znovu</button>
        </div>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "700px", margin: "0 auto", padding: "16px" }}>
      <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
        {sqs.map((_, i) => {
          let bg = "#4b5563";
          if (i === idx) bg = accentColor;
          else if (revealed[i]) bg = arrEq(answers[i] || [], sqs[i].correct) ? "#22c55e" : "#ef4444";
          return <div key={i} onClick={() => goTo(i)} title={`Otázka ${i + 1}`} style={{ width: "22px", height: "22px", borderRadius: "50%", cursor: "pointer", background: bg, transition: "background 0.4s ease" }} />;
        })}
      </div>
      <div style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "24px", transition: "all 0.4s ease" }}>
        <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", marginBottom: "6px" }}>Otázka {idx + 1} / {sqs.length}</div>
        <div style={{ color: "#fff", fontSize: "18px", fontWeight: 600, lineHeight: 1.5, marginBottom: "20px" }}>{q.question}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {q.options.map((opt, i) => {
            let border = "1px solid rgba(255,255,255,0.12)", bg = "rgba(255,255,255,0.04)";
            if (isRev) { if (q.correct.includes(i)) { bg = "rgba(34,197,94,0.15)"; border = "1px solid #22c55e"; } else if (active.includes(i)) { bg = "rgba(239,68,68,0.15)"; border = "1px solid #ef4444"; } }
            else if (active.includes(i)) { bg = accentColor + "18"; border = `1px solid ${accentColor}`; }
            return (
              <div key={i} style={{ padding: "12px 16px", borderRadius: "12px", color: "#fff", cursor: "pointer", transition: "all 0.4s ease", background: bg, border, display: "flex", alignItems: "center", gap: "10px", userSelect: "none", fontSize: "15px" }} onClick={() => isMulti ? toggleMulti(i) : handleSingle(i)}>
                {isMulti && <span style={{ fontSize: "18px", minWidth: "20px" }}>{active.includes(i) ? "☑" : "☐"}</span>}
                <span>{opt}</span>
              </div>
            );
          })}
        </div>
        {isMulti && !isRev && <button style={{ marginTop: "12px", padding: "10px 22px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", color: "#fff", cursor: "pointer", fontSize: "15px", opacity: pending.length ? 1 : 0.4, transition: "all 0.4s ease" }} onClick={submitMulti} disabled={!pending.length}>Potvrdit</button>}
        {isRev && (
          <div style={{ marginTop: "20px", padding: "16px", borderRadius: "14px", border: `1px solid ${isOk ? "#22c55e" : "#ef4444"}`, background: "rgba(255,255,255,0.03)" }}>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: "16px", marginBottom: "8px" }}>{isOk ? "✓ Správně!" : "✗ Špatně"}</div>
            {!isOk && <div style={{ color: "#86efac", fontSize: "14px", marginBottom: "6px" }}>Správná odpověď: {q.correct.map(i => q.options[i]).join(", ")}</div>}
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", lineHeight: 1.5 }}>{q.explanation}</div>
            {q.tip && <div style={{ color: "#fbbf24", fontSize: "13px", marginTop: "8px", fontStyle: "italic" }}>💡 {q.tip}</div>}
          </div>
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button style={{ padding: "10px 22px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", color: "#fff", cursor: "pointer", fontSize: "15px", transition: "all 0.4s ease" }} onClick={() => goTo(idx - 1)} disabled={idx === 0}>← Předchozí</button>
        {idx < sqs.length - 1
          ? <button style={{ padding: "10px 22px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", color: "#fff", cursor: "pointer", fontSize: "15px", transition: "all 0.4s ease" }} onClick={() => goTo(idx + 1)}>Další →</button>
          : <button style={{ padding: "10px 22px", background: accentColor + "55", border: `1px solid ${accentColor}`, borderRadius: "10px", color: "#fff", cursor: "pointer", fontSize: "15px", transition: "all 0.4s ease" }} onClick={() => setShowResults(true)}>Výsledky →</button>}
      </div>
    </div>
  );
}

// ── Notable angles data ───────────────────────────────────────────────────
const ANGLES = [
  { deg: 0,   rad: "0",      rv: 0,                   sin: "0",       cos: "1",       tg: "0",       cotg: "—" },
  { deg: 30,  rad: "π/6",    rv: Math.PI / 6,          sin: "1/2",     cos: "√3/2",    tg: "√3/3",    cotg: "√3" },
  { deg: 45,  rad: "π/4",    rv: Math.PI / 4,          sin: "√2/2",    cos: "√2/2",    tg: "1",       cotg: "1" },
  { deg: 60,  rad: "π/3",    rv: Math.PI / 3,          sin: "√3/2",    cos: "1/2",     tg: "√3",      cotg: "√3/3" },
  { deg: 90,  rad: "π/2",    rv: Math.PI / 2,          sin: "1",       cos: "0",       tg: "—",       cotg: "0" },
  { deg: 120, rad: "2π/3",   rv: 2 * Math.PI / 3,     sin: "√3/2",    cos: "−1/2",    tg: "−√3",     cotg: "−√3/3" },
  { deg: 135, rad: "3π/4",   rv: 3 * Math.PI / 4,     sin: "√2/2",    cos: "−√2/2",   tg: "−1",      cotg: "−1" },
  { deg: 150, rad: "5π/6",   rv: 5 * Math.PI / 6,     sin: "1/2",     cos: "−√3/2",   tg: "−√3/3",   cotg: "−√3" },
  { deg: 180, rad: "π",      rv: Math.PI,              sin: "0",       cos: "−1",      tg: "0",       cotg: "—" },
  { deg: 210, rad: "7π/6",   rv: 7 * Math.PI / 6,     sin: "−1/2",    cos: "−√3/2",   tg: "√3/3",    cotg: "√3" },
  { deg: 225, rad: "5π/4",   rv: 5 * Math.PI / 4,     sin: "−√2/2",   cos: "−√2/2",   tg: "1",       cotg: "1" },
  { deg: 240, rad: "4π/3",   rv: 4 * Math.PI / 3,     sin: "−√3/2",   cos: "−1/2",    tg: "√3",      cotg: "√3/3" },
  { deg: 270, rad: "3π/2",   rv: 3 * Math.PI / 2,     sin: "−1",      cos: "0",       tg: "—",       cotg: "0" },
  { deg: 300, rad: "5π/3",   rv: 5 * Math.PI / 3,     sin: "−√3/2",   cos: "1/2",     tg: "−√3",     cotg: "−√3/3" },
  { deg: 315, rad: "7π/4",   rv: 7 * Math.PI / 4,     sin: "−√2/2",   cos: "√2/2",    tg: "−1",      cotg: "−1" },
  { deg: 330, rad: "11π/6",  rv: 11 * Math.PI / 6,    sin: "−1/2",    cos: "√3/2",    tg: "−√3/3",   cotg: "−√3" },
];

// ── Unit Circle Component ─────────────────────────────────────────────────
function UnitCircle() {
  const [sel, setSel] = useState(null);
  const cx = 175, cy = 175, r = 130;

  const a = sel !== null ? ANGLES[sel] : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
      <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", textAlign: "center" }}>
        Klikni na bod pro zobrazení hodnot
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center", alignItems: "flex-start" }}>
        {/* SVG Circle */}
        <svg width="350" height="350" viewBox="0 0 350 350" style={{ flexShrink: 0 }}>
          {/* Axes */}
          <line x1="20" y1={cy} x2="330" y2={cy} stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
          <line x1={cx} y1="20" x2={cx} y2="330" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
          {/* Axis arrows */}
          <polygon points={`330,${cy} 322,${cy-5} 322,${cy+5}`} fill="rgba(255,255,255,0.3)" />
          <polygon points={`${cx},20 ${cx-5},28 ${cx+5},28`} fill="rgba(255,255,255,0.3)" />
          {/* Axis labels */}
          <text x="332" y={cy + 4} fill="rgba(255,255,255,0.4)" fontSize="13">x</text>
          <text x={cx + 5} y="17" fill="rgba(255,255,255,0.4)" fontSize="13">y</text>
          {/* Unit markers */}
          <text x={cx + r + 3} y={cy - 5} fill="rgba(255,255,255,0.35)" fontSize="10">1</text>
          <text x={cx - r - 14} y={cy - 5} fill="rgba(255,255,255,0.35)" fontSize="10">−1</text>
          <text x={cx + 3} y={cy - r - 3} fill="rgba(255,255,255,0.35)" fontSize="10">1</text>
          <text x={cx + 3} y={cy + r + 12} fill="rgba(255,255,255,0.35)" fontSize="10">−1</text>
          {/* Quadrant labels */}
          <text x={cx + 35} y={cy - 42} fill="rgba(255,220,80,0.45)" fontSize="14" fontWeight="bold">I.</text>
          <text x={cx - 52} y={cy - 42} fill="rgba(80,200,255,0.45)" fontSize="14" fontWeight="bold">II.</text>
          <text x={cx - 57} y={cy + 58} fill="rgba(200,100,255,0.45)" fontSize="14" fontWeight="bold">III.</text>
          <text x={cx + 30} y={cy + 58} fill="rgba(80,255,180,0.45)" fontSize="14" fontWeight="bold">IV.</text>
          {/* Main circle */}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
          {/* Selected angle line + projection dashes */}
          {a && <>
            <line x1={cx} y1={cy} x2={cx + r * Math.cos(a.rv)} y2={cy - r * Math.sin(a.rv)} stroke="#ff2d9b" strokeWidth="2.5" opacity="0.9" />
            <line x1={cx + r * Math.cos(a.rv)} y1={cy - r * Math.sin(a.rv)} x2={cx + r * Math.cos(a.rv)} y2={cy} stroke="#ff2d9b" strokeWidth="1" strokeDasharray="5,3" opacity="0.5" />
            <line x1={cx + r * Math.cos(a.rv)} y1={cy - r * Math.sin(a.rv)} x2={cx} y2={cy - r * Math.sin(a.rv)} stroke="#00c8ff" strokeWidth="1" strokeDasharray="5,3" opacity="0.5" />
            {/* sin label on y-axis */}
            <text x={cx + 5} y={cy - r * Math.sin(a.rv) + 4} fill="#00c8ff" fontSize="10">sin</text>
            {/* cos label on x-axis */}
            <text x={cx + r * Math.cos(a.rv) - 6} y={cy + 14} fill="#ff2d9b" fontSize="10">cos</text>
          </>}
          {/* Angle points */}
          {ANGLES.map((ag, i) => {
            const px = cx + r * Math.cos(ag.rv);
            const py = cy - r * Math.sin(ag.rv);
            const isSel = sel === i;
            return (
              <g key={i} onClick={() => setSel(isSel ? null : i)} style={{ cursor: "pointer" }}>
                <circle cx={px} cy={py} r={isSel ? 9 : 6} fill={isSel ? "#ff2d9b" : "rgba(0,200,255,0.85)"} stroke={isSel ? "#ff90cc" : "rgba(0,200,255,0.3)"} strokeWidth="2" style={{ transition: "all 0.4s ease" }} />
              </g>
            );
          })}
          {/* Radian labels around the circle */}
          {ANGLES.map((ag, i) => {
            const lr = r + 24;
            const px = cx + lr * Math.cos(ag.rv);
            const py = cy - lr * Math.sin(ag.rv);
            const isSel = sel === i;
            return (
              <text key={i} x={px} y={py} textAnchor="middle" dominantBaseline="middle" fill={isSel ? "#ff2d9b" : "rgba(255,255,255,0.45)"} fontSize="9.5" style={{ cursor: "pointer", userSelect: "none", transition: "fill 0.4s ease" }} onClick={() => setSel(isSel ? null : i)}>
                {ag.rad}
              </text>
            );
          })}
        </svg>

        {/* Info panel */}
        <div style={{ minWidth: "220px", display: "flex", flexDirection: "column", gap: "12px" }}>
          {a ? (
            <div style={{ background: "rgba(255,45,155,0.1)", border: "1px solid rgba(255,45,155,0.45)", borderRadius: "16px", padding: "20px" }}>
              <div style={{ color: "#ff2d9b", fontWeight: 700, fontSize: "22px", marginBottom: "4px", fontFamily: "'Audiowide',sans-serif" }}>{a.rad}</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", marginBottom: "14px" }}>{a.deg}°</div>
              <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "8px 14px", fontFamily: "'JetBrains Mono',monospace", fontSize: "15px" }}>
                <span style={{ color: "rgba(255,200,200,0.7)" }}>sin =</span><span style={{ color: "#ffb0cc", fontWeight: 700 }}>{a.sin}</span>
                <span style={{ color: "rgba(200,200,255,0.7)" }}>cos =</span><span style={{ color: "#b0c8ff", fontWeight: 700 }}>{a.cos}</span>
                <span style={{ color: "rgba(200,255,200,0.7)" }}>tg =</span><span style={{ color: "#b0ffcc", fontWeight: 700 }}>{a.tg}</span>
                <span style={{ color: "rgba(255,255,200,0.7)" }}>cotg =</span><span style={{ color: "#ffffb0", fontWeight: 700 }}>{a.cotg}</span>
              </div>
              <div style={{ marginTop: "12px", padding: "8px 10px", background: "rgba(0,0,0,0.25)", borderRadius: "8px", fontFamily: "'JetBrains Mono',monospace", fontSize: "12px", color: "rgba(255,255,255,0.45)" }}>
                P = [{a.cos}, {a.sin}]
              </div>
            </div>
          ) : (
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "20px", color: "rgba(255,255,255,0.35)", textAlign: "center", fontSize: "14px", lineHeight: 1.6 }}>
              Klikni na modrý bod<br />pro zobrazení hodnot
            </div>
          )}

          {/* Quadrant signs */}
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "14px" }}>
            <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "12px", marginBottom: "10px", fontWeight: 600 }}>Znaménka v kvadrantech</div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", fontFamily: "'JetBrains Mono',monospace" }}>
              <thead>
                <tr>
                  {["", "I.", "II.", "III.", "IV."].map((h, i) => (
                    <th key={i} style={{ padding: "3px 4px", color: "rgba(255,255,255,0.5)", fontWeight: 600, textAlign: "center" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[["sin", "+", "+", "−", "−"], ["cos", "+", "−", "−", "+"], ["tg", "+", "−", "+", "−"], ["cotg", "+", "−", "+", "−"]].map(row => (
                  <tr key={row[0]}>
                    {row.map((cell, i) => (
                      <td key={i} style={{ padding: "3px 4px", textAlign: "center", color: i === 0 ? "rgba(255,255,255,0.6)" : cell === "+" ? "#4ade80" : "#f87171", fontWeight: i === 0 ? 600 : 500 }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Full values table */}
      <div style={{ width: "100%", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", minWidth: "500px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
              {["°", "rad", "sin", "cos", "tg", "cotg"].map(h => (
                <th key={h} style={{ padding: "8px 6px", color: "rgba(255,255,255,0.55)", fontWeight: 600, textAlign: "center" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ANGLES.map((ag, i) => (
              <tr key={i} onClick={() => setSel(sel === i ? null : i)} style={{ cursor: "pointer", background: sel === i ? "rgba(255,45,155,0.12)" : i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent", transition: "background 0.4s ease" }}>
                <td style={{ padding: "6px", textAlign: "center", color: sel === i ? "#ff2d9b" : "rgba(255,255,255,0.6)" }}>{ag.deg}°</td>
                <td style={{ padding: "6px", textAlign: "center", color: sel === i ? "#ff2d9b" : "rgba(255,255,255,0.8)", fontWeight: 600 }}>{ag.rad}</td>
                <td style={{ padding: "6px", textAlign: "center", color: "rgba(255,180,200,0.9)" }}>{ag.sin}</td>
                <td style={{ padding: "6px", textAlign: "center", color: "rgba(180,200,255,0.9)" }}>{ag.cos}</td>
                <td style={{ padding: "6px", textAlign: "center", color: "rgba(180,255,200,0.9)" }}>{ag.tg}</td>
                <td style={{ padding: "6px", textAlign: "center", color: "rgba(255,255,180,0.9)" }}>{ag.cotg}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Theory Tab ────────────────────────────────────────────────────────────
function TeorieTab() {
  const [open, setOpen] = useState({ orientovany: true });
  const toggle = k => setOpen(p => ({ ...p, [k]: !p[k] }));

  const sections = [
    {
      id: "orientovany",
      title: "📐 Orientovaný úhel",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", color: "rgba(255,255,255,0.85)", fontSize: "15px", lineHeight: 1.7 }}>
          <p><strong style={{ color: "#ff2d9b" }}>Orientovaný úhel</strong> je úhel, u kterého rozlišujeme <em>počáteční rameno</em> (fixní — kladná poloosa osy x) a <em>koncové rameno</em> a také <strong>směr otáčení</strong>.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: "12px", padding: "12px" }}>
              <div style={{ color: "#4ade80", fontWeight: 700, marginBottom: "6px" }}>🔄 Kladný úhel</div>
              <div style={{ fontSize: "14px" }}>Otáčíme <em>proti</em> směru hodinových ručiček</div>
            </div>
            <div style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: "12px", padding: "12px" }}>
              <div style={{ color: "#f87171", fontWeight: 700, marginBottom: "6px" }}>🕐 Záporný úhel</div>
              <div style={{ fontSize: "14px" }}>Otáčíme <em>ve</em> směru hodinových ručiček</div>
            </div>
          </div>
          <div style={{ background: "rgba(0,200,255,0.07)", border: "1px solid rgba(0,200,255,0.2)", borderRadius: "12px", padding: "14px" }}>
            <div style={{ color: "#00c8ff", fontWeight: 700, marginBottom: "8px" }}>Koterminalní úhly</div>
            <p style={{ margin: 0, fontSize: "14px" }}>Tentýž geometrický úhel lze vyjádřit nekonečně mnoha orientovanými úhly — lišícími se o celé násobky 360° (nebo 2π):</p>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "14px", marginTop: "8px", background: "rgba(0,0,0,0.25)", padding: "10px", borderRadius: "8px" }}>
              α = α₀ + k·360° = α₀ + k·2π,  k ∈ ℤ
            </div>
          </div>
          <div style={{ background: "rgba(255,45,155,0.08)", border: "1px solid rgba(255,45,155,0.2)", borderRadius: "12px", padding: "14px", fontSize: "14px" }}>
            <strong style={{ color: "#ff2d9b" }}>Příklady:</strong> Úhly 30°, 390°, −330° jsou všechny koterminalní (končí ve stejné poloze).
          </div>
        </div>
      )
    },
    {
      id: "oblourova",
      title: "🔵 Oblouková míra (radiány)",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", color: "rgba(255,255,255,0.85)", fontSize: "15px", lineHeight: 1.7 }}>
          <p><strong style={{ color: "#ff2d9b" }}>Oblouková míra (radián)</strong> vyjadřuje úhel jako délku oblouku na jednotkové kružnici (r = 1). Plný úhel = obvod = 2π.</p>
          <div style={{ background: "rgba(255,45,155,0.1)", border: "1px solid rgba(255,45,155,0.3)", borderRadius: "12px", padding: "16px" }}>
            <div style={{ color: "#ff2d9b", fontWeight: 700, marginBottom: "10px", fontFamily: "'Audiowide',sans-serif", fontSize: "15px" }}>Převodní vzorce</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontFamily: "'JetBrains Mono',monospace", fontSize: "14px" }}>
              <div style={{ background: "rgba(0,0,0,0.2)", padding: "8px 12px", borderRadius: "8px" }}>stupně → radiány:  α[rad] = α[°] · π / 180</div>
              <div style={{ background: "rgba(0,0,0,0.2)", padding: "8px 12px", borderRadius: "8px" }}>radiány → stupně:  α[°] = α[rad] · 180 / π</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", fontFamily: "'JetBrains Mono',monospace", fontSize: "13px" }}>
            {[["360°", "2π"], ["180°", "π"], ["90°", "π/2"], ["60°", "π/3"], ["45°", "π/4"], ["30°", "π/6"]].map(([d, r]) => (
              <div key={d} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "rgba(255,255,255,0.5)" }}>{d}</span>
                <span style={{ color: "#ff2d9b", fontWeight: 700 }}>= {r}</span>
              </div>
            ))}
          </div>
          <div style={{ background: "rgba(0,200,255,0.07)", border: "1px solid rgba(0,200,255,0.2)", borderRadius: "12px", padding: "14px" }}>
            <div style={{ color: "#00c8ff", fontWeight: 700, marginBottom: "6px" }}>Příklad — 300° na radiány (Wayground úloha 1)</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "14px" }}>
              300° · π/180 = 300π/180 = 5π/3 ≈ 5,236 rad
            </div>
          </div>
        </div>
      )
    },
    {
      id: "zakladni",
      title: "🎯 Základní velikost úhlu",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", color: "rgba(255,255,255,0.85)", fontSize: "15px", lineHeight: 1.7 }}>
          <p><strong style={{ color: "#ff2d9b" }}>Základní velikost úhlu α₀</strong> je zástupce z intervalu <strong>⟨0; 2π)</strong> resp. ⟨0°; 360°), koterminalní s daným úhlem.</p>
          <div style={{ background: "rgba(255,45,155,0.1)", border: "1px solid rgba(255,45,155,0.3)", borderRadius: "12px", padding: "16px" }}>
            <div style={{ color: "#ff2d9b", fontWeight: 700, marginBottom: "10px" }}>Postup — jak najít α₀</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {["Zapiš úhel ve tvaru: α = α₀ + k·2π", "Urči k ∈ ℤ tak, aby α₀ = α − k·2π patřilo do ⟨0; 2π)", "Ověř dosazením zpět"].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <span style={{ color: "#ff2d9b", fontWeight: 700, minWidth: "20px" }}>{i + 1}.</span>
                  <span style={{ fontSize: "14px" }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: "rgba(0,200,255,0.07)", border: "1px solid rgba(0,200,255,0.2)", borderRadius: "12px", padding: "16px" }}>
            <div style={{ color: "#00c8ff", fontWeight: 700, marginBottom: "10px" }}>Příklad ze sešitu: α = −22π/3</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "14px", display: "flex", flexDirection: "column", gap: "5px" }}>
              <div>Hledáme α₀ ∈ ⟨0; 2π), k ∈ ℤ</div>
              <div>−22π/3 ÷ 2π ≈ −3,67 → zkusíme k = −4</div>
              <div>α₀ = −22π/3 − (−4)·2π = −22π/3 + 8π</div>
              <div>     = −22π/3 + 24π/3 = 2π/3  ✓ (∈ ⟨0; 2π))</div>
              <div style={{ color: "#00c8ff", fontWeight: 700, marginTop: "4px" }}>α = 2π/3 + (−4)·2π</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>Ověření: 2π/3 − 4·2π = 2π/3 − 24π/3 = −22π/3 ✓</div>
            </div>
          </div>
          <div style={{ background: "rgba(74,222,128,0.07)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: "12px", padding: "14px" }}>
            <div style={{ color: "#4ade80", fontWeight: 700, marginBottom: "6px" }}>Příklad: −750° (ve stupních)</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "14px" }}>
              −750° + 3·360° = −750° + 1080° = 330°  ✓
            </div>
          </div>
        </div>
      )
    },
    {
      id: "gon-def",
      title: "📊 Goniometrické funkce — definice",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", color: "rgba(255,255,255,0.85)", fontSize: "15px", lineHeight: 1.7 }}>
          <p>Pro bod P = [x, y] na <strong>jednotkové kružnici</strong> (r = 1), odpovídající úhlu α:</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontFamily: "'JetBrains Mono',monospace" }}>
            {[
              ["sin α", "= y  (y-souřadnice P)", "#ffb0cc"],
              ["cos α", "= x  (x-souřadnice P)", "#b0c8ff"],
              ["tg α", "= sin α / cos α", "#b0ffcc"],
              ["cotg α", "= cos α / sin α = 1/tg α", "#ffffb0"],
            ].map(([fn, def, color]) => (
              <div key={fn} style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${color}33`, borderRadius: "10px", padding: "12px" }}>
                <div style={{ color, fontWeight: 700, fontSize: "16px", marginBottom: "4px" }}>{fn}</div>
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.65)" }}>{def}</div>
              </div>
            ))}
          </div>
          <div style={{ background: "rgba(255,45,155,0.1)", border: "1px solid rgba(255,45,155,0.3)", borderRadius: "12px", padding: "16px" }}>
            <div style={{ color: "#ff2d9b", fontWeight: 700, marginBottom: "10px" }}>Základní identity (musíš znát nazpaměť!)</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontFamily: "'JetBrains Mono',monospace", fontSize: "14px" }}>
              <div style={{ background: "rgba(0,0,0,0.3)", padding: "8px 12px", borderRadius: "8px", color: "#fff", fontWeight: 600 }}>sin²α + cos²α = 1</div>
              <div style={{ background: "rgba(0,0,0,0.2)", padding: "8px 12px", borderRadius: "8px", color: "rgba(255,255,255,0.8)" }}>tg α = sin α / cos α</div>
              <div style={{ background: "rgba(0,0,0,0.2)", padding: "8px 12px", borderRadius: "8px", color: "rgba(255,255,255,0.8)" }}>cotg α = cos α / sin α = 1 / tg α</div>
              <div style={{ background: "rgba(0,0,0,0.2)", padding: "8px 12px", borderRadius: "8px", color: "rgba(255,255,255,0.6)" }}>sin(−α) = −sin α  (lichá)</div>
              <div style={{ background: "rgba(0,0,0,0.2)", padding: "8px 12px", borderRadius: "8px", color: "rgba(255,255,255,0.6)" }}>cos(−α) = cos α   (sudá)</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "dopocitavani",
      title: "🔢 Dopočítávání hodnot bez určení úhlu",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", color: "rgba(255,255,255,0.85)", fontSize: "15px", lineHeight: 1.7 }}>
          <div style={{ background: "rgba(255,200,80,0.08)", border: "1px solid rgba(255,200,80,0.25)", borderRadius: "12px", padding: "12px", fontSize: "14px" }}>
            <strong style={{ color: "#fbbf24" }}>Klíčový typ testové úlohy:</strong> Znáš jednu hodnotu + kvadrant (nebo interval) → spočítáš všechny ostatní bez hledání úhlu.
          </div>
          <div style={{ background: "rgba(255,45,155,0.1)", border: "1px solid rgba(255,45,155,0.3)", borderRadius: "12px", padding: "16px" }}>
            <div style={{ color: "#ff2d9b", fontWeight: 700, marginBottom: "10px" }}>Metoda A — znáš sin nebo cos (přímá)</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "14px" }}>
              <div>1. Z kvadrantu urči znaménka (sin, cos, tg, cotg)</div>
              <div>2. Použij: <span style={{ fontFamily: "'JetBrains Mono',monospace", color: "#ff2d9b" }}>sin²x + cos²x = 1</span></div>
              <div>3. Dopočítej chybějící hodnotu s&nbsp;správným znaménkem</div>
              <div>4. tg x = sin x / cos x,  cotg x = 1 / tg x</div>
            </div>
          </div>
          <div style={{ background: "rgba(0,200,255,0.07)", border: "1px solid rgba(0,200,255,0.2)", borderRadius: "12px", padding: "16px" }}>
            <div style={{ color: "#00c8ff", fontWeight: 700, marginBottom: "10px" }}>Metoda B — znáš tg (nepřímá)</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "14px" }}>
              <div>1. Zapiš: <span style={{ fontFamily: "'JetBrains Mono',monospace" }}>sin x = tg x · cos x</span></div>
              <div>2. Dosaď do Pythagorovy identity: <span style={{ fontFamily: "'JetBrains Mono',monospace" }}>(tg x · cos x)² + cos²x = 1</span></div>
              <div>3. Vyřeš cos²x = 1 / (tg²x + 1)</div>
              <div>4. Urči znaménko cos z kvadrantu, spočítej sin x = tg x · cos x</div>
            </div>
          </div>
          <div style={{ background: "rgba(74,222,128,0.07)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: "12px", padding: "14px" }}>
            <div style={{ color: "#4ade80", fontWeight: 700, marginBottom: "8px" }}>Ze sešitu: tg x = −√2, x ∈ II. kvadrant</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", display: "flex", flexDirection: "column", gap: "4px", color: "rgba(255,255,255,0.8)" }}>
              <div>sin x = −√2 · cos x  →  dosaď do sin² + cos² = 1</div>
              <div>2cos²x + cos²x = 1  →  3cos²x = 1  →  cos²x = 1/3</div>
              <div style={{ color: "#4ade80" }}>II. kv.: cos x = −√3/3,  sin x = √6/3</div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxWidth: "800px", margin: "0 auto" }}>
      {sections.map(sec => (
        <div key={sec.id} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", overflow: "hidden" }}>
          <button onClick={() => toggle(sec.id)} style={{ width: "100%", padding: "16px 20px", background: "transparent", border: "none", color: "#fff", textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "16px", fontWeight: 600, fontFamily: "'Exo 2',sans-serif", transition: "background 0.4s ease" }}>
            <span>{sec.title}</span>
            <span style={{ color: "rgba(255,255,255,0.4)", transition: "transform 0.4s ease", display: "inline-block", transform: open[sec.id] ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
          </button>
          {open[sec.id] && (
            <div style={{ padding: "0 20px 20px" }}>
              {sec.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Worked Examples ───────────────────────────────────────────────────────
function PrikladyTab() {
  const [showSol, setShowSol] = useState({});
  const toggle = k => setShowSol(p => ({ ...p, [k]: !p[k] }));

  const problems = [
    {
      id: 0,
      badge: "⚡ Medium",
      badgeColor: "#f59e0b",
      title: "Výpočet výrazu s goniometrickými funkcemi",
      note: "Přesný typ z testu nanečisto!",
      task: "(sin(11π/3) + cos(3π/4))²",
      steps: [
        {
          label: "Zjednodušení sin(11π/3)",
          text: "11π/3 je velké → odečteme násobek 2π (= 6π/3):\n11π/3 − 2·2π = 11π/3 − 12π/3 = −π/3\n\nsin(11π/3) = sin(−π/3) = −sin(π/3) = −√3/2"
        },
        {
          label: "Hodnota cos(3π/4)",
          text: "3π/4 = 135° je ve II. kvadrantu:\ncos(3π/4) = cos(π − π/4) = −cos(π/4) = −√2/2"
        },
        {
          label: "Součet v závorce",
          text: "−√3/2 + (−√2/2) = −√3/2 − √2/2 = −(√3 + √2)/2"
        },
        {
          label: "Kvadrát výrazu",
          text: "[−(√3 + √2)/2]² = (√3 + √2)² / 4\n= (3 + 2√6 + 2) / 4\n= (5 + 2√6) / 4"
        },
      ],
      result: "(5 + 2√6) / 4"
    },
    {
      id: 1,
      badge: "✨ Easy",
      badgeColor: "#22c55e",
      title: "Základní velikost úhlu",
      note: "Přesný typ z testu nanečisto!",
      task: "Zapište α = −22π/3 ve tvaru α = α₀ + k·2π,  α₀ ∈ ⟨0; 2π),  k ∈ ℤ",
      steps: [
        {
          label: "Odhadneme k",
          text: "−22π/3 ÷ 2π = −22π/(3·2π) = −11/3 ≈ −3,67\n\nPotřebujeme k celé, aby α₀ ≥ 0 → zkusíme k = −4"
        },
        {
          label: "Výpočet α₀",
          text: "α₀ = α − k·2π = −22π/3 − (−4)·2π\n    = −22π/3 + 8π\n    = −22π/3 + 24π/3\n    = 2π/3"
        },
        {
          label: "Ověření α₀ ∈ ⟨0; 2π)",
          text: "2π/3 ≈ 2,09 ∈ ⟨0; 6,28) ✓\n\nα₀ = 2π/3 je ve II. kvadrantu (120°)"
        },
        {
          label: "Ověření dosazením",
          text: "2π/3 + (−4)·2π = 2π/3 − 8π = 2π/3 − 24π/3 = −22π/3 ✓"
        },
      ],
      result: "α = 2π/3 + (−4)·2π   →   α₀ = 2π/3, k = −4"
    },
    {
      id: 2,
      badge: "⚡ Medium",
      badgeColor: "#f59e0b",
      title: "Doplnění tabulky — znám cos, IV. kvadrant",
      note: "Přesný typ z testu nanečisto!",
      task: "cos x = √10/10, x ∈ IV. kvadrant. Doplňte: sin x, tg x, cotg x.",
      steps: [
        {
          label: "Znaménka ve IV. kvadrantu",
          text: "IV. kvadrant (3π/2 < x < 2π):\nsin x < 0,  cos x > 0,  tg x < 0,  cotg x < 0"
        },
        {
          label: "Výpočet sin x",
          text: "sin²x + cos²x = 1\nsin²x + (√10/10)² = 1\nsin²x + 10/100 = 1\nsin²x = 1 − 1/10 = 9/10\n|sin x| = 3/√10 = 3√10/10\n→ IV. kv.: sin x = −3√10/10"
        },
        {
          label: "Výpočet tg x",
          text: "tg x = sin x / cos x\n     = (−3√10/10) / (√10/10)\n     = −3"
        },
        {
          label: "Výpočet cotg x",
          text: "cotg x = 1 / tg x = 1 / (−3) = −1/3"
        },
      ],
      result: "sin x = −3√10/10,   tg x = −3,   cotg x = −1/3"
    },
    {
      id: 3,
      badge: "🔥 Hard",
      badgeColor: "#ef4444",
      title: "Dopočítávání — znám tg, II. kvadrant",
      note: "Ze sešitu p. profesora — Metoda B",
      task: "tg x = −√2, x ∈ II. kvadrant. Najděte sin x, cos x, cotg x.",
      steps: [
        {
          label: "Znaménka — kontrola konzistence",
          text: "II. kvadrant: sin > 0, cos < 0, tg < 0\ntg x = −√2 < 0 ✓ konzistentní s II. kv."
        },
        {
          label: "Vyjádříme sin přes cos",
          text: "tg x = sin x / cos x = −√2\nsin x = −√2 · cos x"
        },
        {
          label: "Dosadíme do Pythagorovy identity",
          text: "sin²x + cos²x = 1\n(−√2 · cos x)² + cos²x = 1\n2cos²x + cos²x = 1\n3cos²x = 1\ncos²x = 1/3\n|cos x| = 1/√3 = √3/3\n→ II. kv.: cos x = −√3/3"
        },
        {
          label: "Výpočet sin x",
          text: "sin x = −√2 · cos x = −√2 · (−√3/3) = √6/3\n(kladné ✓ — konzistentní s II. kv.)"
        },
        {
          label: "Výpočet cotg x",
          text: "cotg x = 1 / tg x = 1 / (−√2) = −1/√2 = −√2/2"
        },
      ],
      result: "cos x = −√3/3,   sin x = √6/3,   cotg x = −√2/2"
    },
    {
      id: 4,
      badge: "🔥 Hard",
      badgeColor: "#ef4444",
      title: "Dopočítávání — znám cos, III. kvadrant",
      note: "Typ z Wayground cvičení (úloha 10)",
      task: "cos x = −√14/4,  π < x < 3π/2 (III. kvadrant). Najděte tg x.",
      steps: [
        {
          label: "Znaménka ve III. kvadrantu",
          text: "III. kv.: sin < 0, cos < 0, tg > 0\ncos x = −√14/4 < 0 ✓"
        },
        {
          label: "Výpočet sin x",
          text: "sin²x = 1 − cos²x = 1 − 14/16 = 2/16 = 1/8\n|sin x| = 1/(2√2) = √2/4\n→ III. kv.: sin x = −√2/4"
        },
        {
          label: "Výpočet tg x",
          text: "tg x = sin x / cos x\n     = (−√2/4) / (−√14/4)\n     = √2/√14 = √2/(√2·√7) = 1/√7 = √7/7\n(kladné ✓ — konzistentní s III. kv.)"
        },
      ],
      result: "tg x = √7/7"
    },
    {
      id: 5,
      badge: "⚡ Medium",
      badgeColor: "#f59e0b",
      title: "Výpočet výrazu — varianta A, úloha 1a",
      note: "Z fotky skutečného testu — varianta A",
      task: "(sin(31π/6) + cos(9π/4))²",
      steps: [
        {
          label: "Zjednodušení sin(31π/6)",
          text: "31π/6 ÷ 2π = 31/12 ≈ 2,58  →  odečteme 2·2π = 4π:\n31π/6 − 4π = 31π/6 − 24π/6 = 7π/6\n\nsin(31π/6) = sin(7π/6) = sin(π + π/6) = −sin(π/6) = −1/2"
        },
        {
          label: "Hodnota cos(9π/4)",
          text: "9π/4 − 2π = 9π/4 − 8π/4 = π/4\n\ncos(9π/4) = cos(π/4) = √2/2"
        },
        {
          label: "Součet v závorce",
          text: "−1/2 + √2/2 = (−1 + √2)/2 = (√2 − 1)/2"
        },
        {
          label: "Kvadrát výrazu",
          text: "[(√2 − 1)/2]² = (√2 − 1)² / 4\n= (2 − 2√2 + 1) / 4\n= (3 − 2√2) / 4"
        },
      ],
      result: "(3 − 2√2) / 4"
    },
    {
      id: 6,
      badge: "🔥 Hard",
      badgeColor: "#ef4444",
      title: "Výpočet zlomkového výrazu — varianta A, úloha 1b",
      note: "Z fotky skutečného testu — varianta A",
      task: "(sin(−13π/2) − cos(5π/2)) / cotg(3π/4)",
      steps: [
        {
          label: "Zjednodušení sin(−13π/2)",
          text: "−13π/2 ÷ 2π = −13/4 = −3,25  →  přičteme 4·2π = 8π:\n−13π/2 + 8π = −13π/2 + 16π/2 = 3π/2\n\nsin(−13π/2) = sin(3π/2) = −1"
        },
        {
          label: "Hodnota cos(5π/2)",
          text: "5π/2 − 2π = π/2\n\ncos(5π/2) = cos(π/2) = 0"
        },
        {
          label: "Hodnota cotg(3π/4)",
          text: "3π/4 je ve II. kvadrantu (135°):\ncotg(3π/4) = cos(3π/4)/sin(3π/4) = (−√2/2)/(√2/2) = −1"
        },
        {
          label: "Dosazení do zlomku",
          text: "(sin(−13π/2) − cos(5π/2)) / cotg(3π/4)\n= (−1 − 0) / (−1)\n= (−1) / (−1)\n= 1"
        },
      ],
      result: "1"
    },
    {
      id: 7,
      badge: "✨ Easy",
      badgeColor: "#22c55e",
      title: "Základní velikost úhlu — α = 27π/4",
      note: "Z fotky skutečného testu — varianta A, úloha 2a",
      task: "Zapište α = 27π/4 ve tvaru α = α₀ + k·2π,  α₀ ∈ ⟨0; 2π),  k ∈ ℤ",
      steps: [
        {
          label: "Odhadneme k",
          text: "27π/4 ÷ 2π = 27/8 = 3,375\nK zaokrouhlení dolů: k = 3  (odebereme 3 plné otočky)"
        },
        {
          label: "Výpočet α₀",
          text: "α₀ = 27π/4 − 3·2π\n    = 27π/4 − 6π\n    = 27π/4 − 24π/4\n    = 3π/4"
        },
        {
          label: "Ověření α₀ ∈ ⟨0; 2π)",
          text: "3π/4 ≈ 2,36 ∈ ⟨0; 6,28) ✓\nα₀ = 3π/4 je ve II. kvadrantu (135°)"
        },
        {
          label: "Ověření dosazením",
          text: "3π/4 + 3·2π = 3π/4 + 24π/4 = 27π/4 ✓"
        },
      ],
      result: "α = 3π/4 + 3·2π   →   α₀ = 3π/4, k = 3"
    },
    {
      id: 8,
      badge: "✨ Easy",
      badgeColor: "#22c55e",
      title: "Základní velikost úhlu — α = −17π/2",
      note: "Z fotky skutečného testu — varianta A, úloha 2b",
      task: "Zapište α = −17π/2 ve tvaru α = α₀ + k·2π,  α₀ ∈ ⟨0; 2π),  k ∈ ℤ",
      steps: [
        {
          label: "Odhadneme k",
          text: "−17π/2 ÷ 2π = −17/4 = −4,25\nPotřebujeme α₀ ≥ 0, volíme k = −5 (přičteme 5 plných otáček)"
        },
        {
          label: "Výpočet α₀",
          text: "α₀ = −17π/2 − (−5)·2π\n    = −17π/2 + 10π\n    = −17π/2 + 20π/2\n    = 3π/2"
        },
        {
          label: "Ověření α₀ ∈ ⟨0; 2π)",
          text: "3π/2 ≈ 4,71 ∈ ⟨0; 6,28) ✓\nα₀ = 3π/2 je ve IV. kvadrantu (270°)"
        },
        {
          label: "Ověření dosazením",
          text: "3π/2 + (−5)·2π = 3π/2 − 10π = 3π/2 − 20π/2 = −17π/2 ✓"
        },
      ],
      result: "α = 3π/2 + (−5)·2π   →   α₀ = 3π/2, k = −5"
    },
    {
      id: 9,
      badge: "⚡ Medium",
      badgeColor: "#f59e0b",
      title: "Doplnění tabulky — dva řádky najednou",
      note: "Z fotky skutečného testu — varianta A, úloha 3",
      task: "Doplňte tabulku, aniž spočítáte úhel x.\nŘádek 1: I. kvadrant, sin x = √3/6\nŘádek 2: IV. kvadrant, tg x = −1/2",
      steps: [
        {
          label: "Řádek 1 — znaménka v I. kvadrantu",
          text: "I. kvadrant: sin > 0, cos > 0, tg > 0, cotg > 0\nDáno: sin x = √3/6"
        },
        {
          label: "Řádek 1 — výpočet cos x",
          text: "cos²x = 1 − sin²x = 1 − 3/36 = 1 − 1/12 = 11/12\n|cos x| = √(11/12) = √11/(2√3) = √33/6\nI. kv. → cos x = √33/6"
        },
        {
          label: "Řádek 1 — tg x a cotg x",
          text: "tg x = sin x / cos x = (√3/6) / (√33/6) = √3/√33 = √(1/11) = √11/11\ncotg x = 1/tg x = √11"
        },
        {
          label: "Řádek 2 — znaménka v IV. kvadrantu",
          text: "IV. kvadrant: sin < 0, cos > 0, tg < 0, cotg < 0\nDáno: tg x = −1/2 < 0 ✓"
        },
        {
          label: "Řádek 2 — výpočet cos x a sin x",
          text: "sin x = tg x · cos x = −1/2 · cos x\n(−1/2 · cos x)² + cos²x = 1\n1/4 · cos²x + cos²x = 1\n5/4 · cos²x = 1  →  cos²x = 4/5\nIV. kv. → cos x = 2/√5 = 2√5/5\nsin x = −1/2 · 2√5/5 = −1/√5 = −√5/5"
        },
        {
          label: "Řádek 2 — cotg x",
          text: "cotg x = 1/tg x = 1/(−1/2) = −2"
        },
      ],
      result: "Řádek 1: cos = √33/6, tg = √11/11, cotg = √11\nŘádek 2: sin = −√5/5, cos = 2√5/5, cotg = −2"
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ background: "rgba(255,200,80,0.08)", border: "1px solid rgba(255,200,80,0.2)", borderRadius: "12px", padding: "12px 16px", fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>
        💡 Řešení jsou skrytá — zkus nejdřív sám, pak klikni na <strong style={{ color: "#fbbf24" }}>Zobrazit řešení</strong>
      </div>
      {problems.map(p => (
        <div key={p.id} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "24px" }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", flexWrap: "wrap", marginBottom: "14px" }}>
            <span style={{ padding: "3px 10px", background: p.badgeColor + "22", border: `1px solid ${p.badgeColor}55`, borderRadius: "20px", color: p.badgeColor, fontSize: "12px", fontWeight: 700, whiteSpace: "nowrap" }}>{p.badge}</span>
            <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: "16px" }}>{p.title}</div>
              {p.note && <div style={{ color: "#ff2d9b", fontSize: "12px" }}>↳ {p.note}</div>}
            </div>
          </div>
          <div style={{ background: "rgba(0,0,0,0.35)", borderRadius: "12px", padding: "16px", fontFamily: "'JetBrains Mono',monospace", fontSize: "15px", color: "rgba(255,255,255,0.9)", marginBottom: "16px", lineHeight: 1.6 }}>
            {p.task}
          </div>
          <button onClick={() => toggle(p.id)} style={{ padding: "10px 20px", background: "rgba(255,45,155,0.1)", border: "1px solid rgba(255,45,155,0.4)", borderRadius: "10px", color: "#ff2d9b", cursor: "pointer", fontSize: "14px", fontWeight: 600, transition: "all 0.4s ease", marginBottom: showSol[p.id] ? "16px" : "0" }}>
            {showSol[p.id] ? "▲ Skrýt řešení" : "▼ Zobrazit řešení"}
          </button>
          {showSol[p.id] && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {p.steps.map((step, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "12px 14px" }}>
                  <div style={{ color: "#ff2d9b", fontWeight: 600, fontSize: "13px", marginBottom: "6px" }}>Krok {i + 1}: {step.label}</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", color: "rgba(255,255,255,0.82)", whiteSpace: "pre-line", lineHeight: 1.6 }}>{step.text}</div>
                </div>
              ))}
              <div style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.45)", borderRadius: "12px", padding: "14px 16px", fontFamily: "'JetBrains Mono',monospace", fontSize: "15px", color: "#4ade80", fontWeight: 700 }}>
                ✓ Výsledek: {p.result}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Flashcards ────────────────────────────────────────────────────────────
const CARDS = [
  { f: "Co je orientovaný úhel?", b: "Úhel s určeným počátečním a koncovým ramenem a směrem otáčení.\n\nKladný = proti hodinovým ručičkám\nZáporný = po hodinových ručičkách" },
  { f: "Jak převedeš stupně na radiány?", b: "α[rad] = α[°] · π / 180\n\nPříklad: 300° = 300 · π/180 = 5π/3" },
  { f: "Jak převedeš radiány na stupně?", b: "α[°] = α[rad] · 180 / π\n\nPříklad: 3π/4 = 3 · 180/4 = 135°" },
  { f: "Co je základní velikost úhlu α₀?", b: "Zástupce z ⟨0; 2π) takový, že:\nα = α₀ + k·2π,  k ∈ ℤ" },
  { f: "Jak najdeš α₀ pro α = −22π/3?", b: "k = −4\nα₀ = −22π/3 + 4·2π = −22π/3 + 24π/3 = 2π/3\n\nOvěření: 2π/3 − 4·2π = −22π/3 ✓" },
  { f: "Jak najdeš α₀ pro α = −750°?", b: "−750° + 3·360° = −750° + 1080° = 330°\nα₀ = 330°" },
  { f: "Jaký je bod P na jednotkové kružnici?", b: "P = [cos α, sin α]\n\nsin α = y-souřadnice\ncos α = x-souřadnice" },
  { f: "Pythagorova identita?", b: "sin²α + cos²α = 1\n\n(Platí pro každý úhel!)" },
  { f: "Znaménka goniometrických funkcí v kvadrantech?", b: "I.:   sin+  cos+  tg+  cotg+\nII.:  sin+  cos−  tg−  cotg−\nIII.: sin−  cos−  tg+  cotg+\nIV.:  sin−  cos+  tg−  cotg−\n\nPomůcka: Všichni Studenti Tancují Cotg" },
  { f: "sin(11π/3) = ?", b: "11π/3 − 2·2π = 11π/3 − 12π/3 = −π/3\nsin(−π/3) = −sin(π/3) = −√3/2" },
  { f: "cos(3π/4) = ?", b: "3π/4 = 135° → II. kvadrant\ncos(3π/4) = −cos(π/4) = −√2/2" },
  { f: "cos x = √10/10, IV. kvadrant → sin x, tg x, cotg x?", b: "sin²x = 1 − 1/10 = 9/10\nIV.: sin x = −3√10/10\n\ntg x = −3\ncotg x = −1/3" },
  { f: "tg x = −√2, II. kvadrant → cos x, sin x?", b: "3cos²x = 1 → cos x = −√3/3 (II. kv.)\nsin x = −√2 · (−√3/3) = √6/3" },
  { f: "Je sinus lichá nebo sudá funkce?", b: "LICHÁ: sin(−α) = −sin α\nGraf je středově souměrný (rot. 180° okolo O)\n\nKosinus je SUDÁ: cos(−α) = cos α" },
  { f: "Perioda sin a cos? Perioda tg a cotg?", b: "sin, cos:   T = 2π = 360°\ntg, cotg:   T = π = 180°" },
];

function FlashcardsTab() {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = CARDS[idx];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", maxWidth: "600px", margin: "0 auto", padding: "16px" }}>
      <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "14px" }}>{idx + 1} / {CARDS.length}</div>

      <div style={{ width: "100%", cursor: "pointer", perspective: "1000px" }} onClick={() => setFlipped(f => !f)}>
        <div style={{ position: "relative", width: "100%", minHeight: "220px", transformStyle: "preserve-3d", transition: "transform 0.4s ease", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}>
          {/* Front */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, backfaceVisibility: "hidden", background: "rgba(255,45,155,0.1)", border: "1px solid rgba(255,45,155,0.4)", borderRadius: "20px", padding: "32px 24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "220px", textAlign: "center" }}>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px", marginBottom: "12px", letterSpacing: "2px" }}>OTÁZKA</div>
            <div style={{ color: "#fff", fontSize: "18px", fontWeight: 600, lineHeight: 1.6 }}>{card.f}</div>
          </div>
          {/* Back */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "rgba(0,200,255,0.07)", border: "1px solid rgba(0,200,255,0.4)", borderRadius: "20px", padding: "32px 24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "220px", textAlign: "center" }}>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px", marginBottom: "12px", letterSpacing: "2px" }}>ODPOVĚĎ</div>
            <div style={{ color: "#fff", fontSize: "15px", lineHeight: 1.8, fontFamily: "'JetBrains Mono',monospace", whiteSpace: "pre-line" }}>{card.b}</div>
          </div>
        </div>
      </div>

      <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px" }}>Klikni pro otočení</div>

      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <button onClick={() => { setIdx(i => Math.max(0, i - 1)); setFlipped(false); }} disabled={idx === 0} style={{ padding: "10px 22px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", color: "#fff", cursor: "pointer", fontSize: "15px", opacity: idx === 0 ? 0.4 : 1, transition: "all 0.4s ease" }}>← Předchozí</button>
        <button onClick={() => { setIdx(i => Math.min(CARDS.length - 1, i + 1)); setFlipped(false); }} disabled={idx === CARDS.length - 1} style={{ padding: "10px 22px", background: "rgba(255,45,155,0.2)", border: "1px solid rgba(255,45,155,0.5)", borderRadius: "10px", color: "#fff", cursor: "pointer", fontSize: "15px", opacity: idx === CARDS.length - 1 ? 0.4 : 1, transition: "all 0.4s ease" }}>Další →</button>
      </div>

      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center" }}>
        {CARDS.map((_, i) => (
          <div key={i} onClick={() => { setIdx(i); setFlipped(false); }} style={{ width: "10px", height: "10px", borderRadius: "50%", cursor: "pointer", background: i === idx ? "#ff2d9b" : "rgba(255,255,255,0.2)", transition: "background 0.4s ease" }} />
        ))}
      </div>
    </div>
  );
}

// ── Formula Sheet ─────────────────────────────────────────────────────────
function FormulyTab() {
  const sections = [
    {
      title: "📐 Oblouková míra",
      color: "#ff2d9b",
      items: [
        ["stupně → rad", "α[rad] = α[°] · π/180"],
        ["rad → stupně", "α[°] = α[rad] · 180/π"],
        ["360° =", "2π ≈ 6,283"],
        ["180° =", "π ≈ 3,142"],
        ["90° =", "π/2 ≈ 1,571"],
        ["60° =", "π/3 ≈ 1,047"],
        ["45° =", "π/4 ≈ 0,785"],
        ["30° =", "π/6 ≈ 0,524"],
      ]
    },
    {
      title: "🔵 Základní identity",
      color: "#00c8ff",
      items: [
        ["Pythagorova", "sin²α + cos²α = 1"],
        ["Tangens", "tg α = sin α / cos α"],
        ["Kotangens", "cotg α = cos α / sin α"],
        ["Vztah tg-cotg", "tg α · cotg α = 1"],
        ["Lichá funkce", "sin(−α) = −sin α"],
        ["Sudá funkce", "cos(−α) = cos α"],
      ]
    },
    {
      title: "🎯 Základní velikost úhlu",
      color: "#fbbf24",
      items: [
        ["Tvar", "α = α₀ + k·2π,  k ∈ ℤ"],
        ["Interval α₀", "⟨0; 2π) tj. ⟨0°; 360°)"],
        ["−22π/3", "α₀ = 2π/3, k = −4"],
        ["−750°", "α₀ = 330°, k = −3 (v °)"],
      ]
    },
    {
      title: "📊 Znaménka v kvadrantech",
      color: "#4ade80",
      items: [
        ["I. (0–π/2)", "sin+ cos+ tg+ cotg+"],
        ["II. (π/2–π)", "sin+ cos− tg− cotg−"],
        ["III. (π–3π/2)", "sin− cos− tg+ cotg+"],
        ["IV. (3π/2–2π)", "sin− cos+ tg− cotg−"],
        ["Pomůcka", "Všichni Studenti Tancují Cotg"],
      ]
    },
    {
      title: "⭐ Tabulka hodnot — I. kvadrant",
      color: "#a855f7",
      wide: true,
      items: [
        ["0° = 0", "sin=0,  cos=1,  tg=0,  cotg=—"],
        ["30° = π/6", "sin=1/2,  cos=√3/2,  tg=√3/3,  cotg=√3"],
        ["45° = π/4", "sin=√2/2,  cos=√2/2,  tg=1,  cotg=1"],
        ["60° = π/3", "sin=√3/2,  cos=1/2,  tg=√3,  cotg=√3/3"],
        ["90° = π/2", "sin=1,  cos=0,  tg=—,  cotg=0"],
      ]
    },
    {
      title: "⭐ Tabulka hodnot — II.–IV. kvadrant",
      color: "#f87171",
      wide: true,
      items: [
        ["120° = 2π/3", "sin=√3/2,  cos=−1/2,  tg=−√3,  cotg=−√3/3"],
        ["135° = 3π/4", "sin=√2/2,  cos=−√2/2,  tg=−1,  cotg=−1"],
        ["150° = 5π/6", "sin=1/2,  cos=−√3/2,  tg=−√3/3,  cotg=−√3"],
        ["180° = π", "sin=0,  cos=−1,  tg=0,  cotg=—"],
        ["270° = 3π/2", "sin=−1,  cos=0,  tg=—,  cotg=0"],
        ["300° = 5π/3", "sin=−√3/2,  cos=1/2,  tg=−√3,  cotg=−√3/3"],
        ["315° = 7π/4", "sin=−√2/2,  cos=√2/2,  tg=−1,  cotg=−1"],
        ["330° = 11π/6", "sin=−1/2,  cos=√3/2,  tg=−√3/3,  cotg=−√3"],
      ]
    },
    {
      title: "🔢 Dopočítávání bez úhlu",
      color: "#fb923c",
      wide: true,
      items: [
        ["Znám cos → sin", "sin²x = 1 − cos²x,  znaménko z kvadrantu"],
        ["Znám sin → cos", "cos²x = 1 − sin²x,  znaménko z kvadrantu"],
        ["Znám tg → cos", "cos²x = 1/(tg²x + 1),  znaménko z kvadrantu"],
        ["cos x = √10/10, IV", "sin x = −3√10/10,  tg x = −3,  cotg x = −1/3"],
        ["tg x = −√2, II", "cos x = −√3/3,  sin x = √6/3,  cotg x = −√2/2"],
      ]
    },
  ];

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "14px" }}>
      {sections.map(sec => (
        <div key={sec.title} style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${sec.color}33`, borderRadius: "16px", padding: "18px 20px" }}>
          <div style={{ color: sec.color, fontWeight: 700, fontSize: "15px", marginBottom: "12px", fontFamily: "'Audiowide',sans-serif" }}>{sec.title}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {sec.items.map(([label, formula]) => (
              <div key={label} style={{ display: "flex", gap: "12px", alignItems: "baseline", flexWrap: "wrap" }}>
                <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "13px", minWidth: sec.wide ? "130px" : "120px", flexShrink: 0 }}>{label}</span>
                <span style={{ color: "#fff", fontFamily: "'JetBrains Mono',monospace", fontSize: "13px", fontWeight: 500 }}>{formula}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Quiz Questions ────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    question: "Jaká je základní velikost úhlu α = −750°?",
    type: "single",
    options: ["−30°", "30°", "330°", "−60°"],
    correct: [2],
    explanation: "−750° + 3·360° = −750° + 1080° = 330°. Přičítáme 360° tak dlouho, až jsme v ⟨0°; 360°).",
    tip: "Přičítej 360° (nebo odečítej), dokud nejsi v ⟨0°; 360°)."
  },
  {
    question: "Převeďte 300° na radiány.",
    type: "single",
    options: ["5π/4", "5π/3", "4π/3", "7π/6"],
    correct: [1],
    explanation: "300° · π/180 = 300π/180 = 5π/3.",
    tip: "Zkrácení: 300/60 = 5, 180/60 = 3 → 5π/3"
  },
  {
    question: "α = −22π/3. Jaká je základní velikost α₀ a hodnota k?",
    type: "single",
    options: ["α₀ = 2π/3, k = −4", "α₀ = 2π/3, k = 4", "α₀ = 4π/3, k = −4", "α₀ = π/3, k = −4"],
    correct: [0],
    explanation: "−22π/3 = 2π/3 + k·2π → k·2π = −8π → k = −4. Ověření: 2π/3 − 4·2π = 2π/3 − 24π/3 = −22π/3 ✓",
  },
  {
    question: "sin(11π/3) = ?",
    type: "single",
    options: ["√3/2", "−√3/2", "1/2", "−1/2"],
    correct: [1],
    explanation: "11π/3 − 2·2π = 11π/3 − 12π/3 = −π/3. sin(−π/3) = −sin(π/3) = −√3/2.",
    tip: "Odečti násobky 2π (= 6π/3) tak, aby výsledek byl v ⟨−π; π⟩."
  },
  {
    question: "(sin(11π/3) + cos(3π/4))² = ?",
    type: "single",
    options: ["(5+2√6)/4", "(5−2√6)/4", "(3+2√6)/4", "5/4"],
    correct: [0],
    explanation: "sin(11π/3) = −√3/2, cos(3π/4) = −√2/2. Součet = −(√3+√2)/2. Kvadrát = (√3+√2)²/4 = (3+2√6+2)/4 = (5+2√6)/4.",
  },
  {
    question: "sin(2π/3) = ?",
    type: "single",
    options: ["1/2", "√3/2", "−1/2", "−√3/2"],
    correct: [1],
    explanation: "2π/3 = 120° je ve II. kvadrantu. sin(120°) = sin(180°−60°) = sin(60°) = √3/2. V II. kv. je sin kladný.",
  },
  {
    question: "cos(7π/4) = ?",
    type: "single",
    options: ["1/2", "−1/2", "√2/2", "−√2/2"],
    correct: [2],
    explanation: "7π/4 = 315° je ve IV. kvadrantu. cos(315°) = cos(360°−45°) = cos(45°) = √2/2. V IV. kv. je cos kladný.",
  },
  {
    question: "sin(17π/2) = ?",
    type: "single",
    options: ["−1", "1", "0", "−√3/2"],
    correct: [1],
    explanation: "17π/2 = 8·2π/2 + π/2 = 4·2π + π/2. Tedy sin(17π/2) = sin(π/2) = 1.",
    tip: "Odečti násobky 2π: 17π/2 − 4·2π = 17π/2 − 8π = π/2."
  },
  {
    question: "V jakém kvadrantu platí: sin > 0 a cos < 0?",
    type: "single",
    options: ["I.", "II.", "III.", "IV."],
    correct: [1],
    explanation: "II. kvadrant (π/2 < α < π): y-souřadnice kladná (sin > 0), x-souřadnice záporná (cos < 0).",
    tip: "Pomůcka: Všichni Studenti Tancují Cotg — II. kv. = Studenti = jen sin kladný."
  },
  {
    question: "cos x = √10/10, x ∈ IV. kvadrant. Jaká je hodnota tg x?",
    type: "single",
    options: ["3", "−3", "1/3", "−1/3"],
    correct: [1],
    explanation: "sin²x = 1 − (√10/10)² = 9/10 → sin x = −3√10/10 (IV. kv.).\ntg x = sin x / cos x = (−3√10/10)/(√10/10) = −3.",
  },
  {
    question: "Doplňte: cos x = √10/10, IV. kvadrant. cotg x = ?",
    type: "single",
    options: ["3", "−3", "1/3", "−1/3"],
    correct: [3],
    explanation: "tg x = −3 (z předchozího výpočtu). cotg x = 1/tg x = 1/(−3) = −1/3.",
  },
  {
    question: "Pokud tg x = √8, potom cotg x = ?",
    type: "single",
    options: ["√2/4", "−2√2", "√2", "√2/2"],
    correct: [0],
    explanation: "cotg x = 1/tg x = 1/√8 = 1/(2√2) = √2/(2·2) = √2/4.",
  },
  {
    question: "Která tvrzení jsou správná pro II. kvadrant (π/2 < x < π)?",
    type: "multi",
    options: ["sin x > 0", "cos x > 0", "tg x < 0", "cotg x < 0"],
    correct: [0, 2, 3],
    explanation: "Ve II. kv.: sin > 0 (bod na horní polorovině), cos < 0 (záporná x-souřadnice), tg = sin/cos < 0, cotg = cos/sin < 0.",
  },
  {
    question: "Funkce cosinus je:",
    type: "single",
    options: ["lichá (cos(−α) = −cos α)", "sudá (cos(−α) = cos α)", "ani lichá, ani sudá", "periodická s T = π"],
    correct: [1],
    explanation: "Kosinus je sudá funkce: cos(−α) = cos α. Graf je osově souměrný podle osy y. Perioda je 2π, ne π.",
  },
  {
    question: "tg x = −√2, x ∈ II. kvadrant. Jaká je hodnota cos x?",
    type: "single",
    options: ["√3/3", "−√3/3", "√6/3", "−√6/3"],
    correct: [1],
    explanation: "3cos²x = 1 (po dosazení sin x = −√2·cos x do Pythagorovy identity).\ncos²x = 1/3 → cos x = −√3/3 (záporné v II. kv.).",
  },
  {
    question: "tg x = −√2, II. kv. → sin x = ?",
    type: "single",
    options: ["√6/3", "−√6/3", "√3/3", "−√3/3"],
    correct: [0],
    explanation: "cos x = −√3/3 (z předchozího). sin x = −√2 · cos x = −√2 · (−√3/3) = √6/3. Kladné — správně pro II. kv.",
  },
  {
    question: "Kolik radiánů je 45°?",
    type: "single",
    options: ["π/6", "π/4", "π/3", "π/2"],
    correct: [1],
    explanation: "45° · π/180 = 45π/180 = π/4 ≈ 0,785 rad.",
    tip: "Zapamatuj: 30°=π/6, 45°=π/4, 60°=π/3, 90°=π/2"
  },
  {
    question: "cos x = −√14/4 a π < x < 3π/2. Jaká je hodnota tg x?",
    type: "single",
    options: ["√7/14", "√7/7", "√2/8", "−√7/7"],
    correct: [1],
    explanation: "III. kv.: tg > 0. sin²x = 1 − 14/16 = 2/16 → sin x = −√2/4.\ntg x = (−√2/4)/(−√14/4) = √2/√14 = 1/√7 = √7/7.",
  },
  {
    question: "Která tvrzení o jednotkové kružnici jsou správná?",
    type: "multi",
    options: ["Poloměr je 1", "sin α je x-souřadnice bodu P", "cos α je x-souřadnice bodu P", "P = [cos α, sin α]"],
    correct: [0, 2, 3],
    explanation: "Na jednotkové kružnici P = [cos α, sin α]: cos α = x-souřadnice, sin α = y-souřadnice (NE x!). Poloměr = 1.",
  },
  {
    question: "Perioda funkce sinus a kosinus je:",
    type: "single",
    options: ["π", "2π", "π/2", "4π"],
    correct: [1],
    explanation: "Perioda sinu a kosinu je 2π (= 360°). Perioda tangens a kotangens je π (= 180°).",
  },
];

// ── Synthwave Background ──────────────────────────────────────────────────
function Background() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
      <svg style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "55%", opacity: 0.12 }} viewBox="0 0 800 440" preserveAspectRatio="none">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ff2d9b" strokeWidth="0.7" />
          </pattern>
        </defs>
        <rect width="800" height="440" fill="url(#grid)" />
        {[...Array(11)].map((_, i) => (
          <line key={i} x1={i * 80} y1={0} x2={400} y2={440} stroke="#ff2d9b" strokeWidth="0.4" opacity="0.6" />
        ))}
        {[...Array(9)].map((_, i) => (
          <line key={i} x1={0} y1={i * 52} x2={800} y2={i * 52} stroke="#ff2d9b" strokeWidth="0.4" opacity="0.6" />
        ))}
      </svg>
      <div style={{ position: "absolute", bottom: "38%", left: "50%", transform: "translateX(-50%)", width: "220px", height: "110px", background: "linear-gradient(to bottom, #ff2d9b, transparent)", borderRadius: "50% 50% 0 0", opacity: 0.12, boxShadow: "0 0 80px 40px rgba(255,45,155,0.08)" }} />
      {[...Array(14)].map((_, i) => (
        <div key={i} style={{ position: "absolute", width: `${4 + (i % 4) * 3}px`, height: `${4 + (i % 4) * 3}px`, borderRadius: "50%", background: i % 3 === 0 ? "#ff2d9b" : i % 3 === 1 ? "#00c8ff" : "#a855f7", left: `${(i * 73 + 5) % 95}%`, top: `${(i * 61 + 10) % 75}%`, opacity: 0.25 + (i % 3) * 0.1, animation: `fl${i % 3} ${14 + i % 7}s infinite ease-in-out`, animationDelay: `${i * 0.8}s` }} />
      ))}
      <style>{`
        @keyframes fl0 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-22px)} }
        @keyframes fl1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-32px)} }
        @keyframes fl2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }
      `}</style>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState(0);
  const TABS = [
    "📐 Teorie",
    "🔵 Kružnice",
    "🧮 Příklady",
    "❓ Kvíz",
    "🃏 Kartičky",
    "📋 Tahák",
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a1a", fontFamily: "'Exo 2',sans-serif", position: "relative" }}>
      <link href="https://fonts.googleapis.com/css2?family=Exo+2:wght@400;600;700&family=Audiowide&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
      <Background />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "1000px", margin: "0 auto", padding: "24px 16px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <h1 style={{ fontFamily: "'Audiowide',sans-serif", fontSize: "clamp(18px,4vw,28px)", fontWeight: 700, background: "linear-gradient(135deg,#ff2d9b,#00c8ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: "0 0 8px" }}>
            Goniometrické funkce
          </h1>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "14px", letterSpacing: "0.5px" }}>
            Orientovaný úhel · Oblouková míra · Základní velikost · Jednotková kružnice
          </div>
        </div>

        {/* Tab bar */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center", marginBottom: "28px" }}>
          {TABS.map((t, i) => (
            <button key={i} onClick={() => setTab(i)} style={{ padding: "8px 16px", borderRadius: "20px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 600, fontFamily: "'Exo 2',sans-serif", transition: "all 0.4s ease", background: tab === i ? "linear-gradient(135deg,#ff2d9b,#be185d)" : "rgba(255,255,255,0.06)", color: tab === i ? "#fff" : "rgba(255,255,255,0.55)", boxShadow: tab === i ? "0 0 24px rgba(255,45,155,0.4)" : "none" }}>{t}</button>
          ))}
        </div>

        {/* Content */}
        <div key={tab} style={{ animation: "fadeIn 0.5s ease" }}>
          {tab === 0 && <TeorieTab />}
          {tab === 1 && <UnitCircle />}
          {tab === 2 && <PrikladyTab />}
          {tab === 3 && <QuizEngine questions={QUESTIONS} accentColor="#ff2d9b" />}
          {tab === 4 && <FlashcardsTab />}
          {tab === 5 && <FormulyTab />}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing: border-box; }
        button:disabled { cursor: not-allowed; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.03); }
        ::-webkit-scrollbar-thumb { background: rgba(255,45,155,0.35); border-radius: 3px; }
      `}</style>
    </div>
  );
}
