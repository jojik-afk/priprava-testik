// @title Kapaliny — kompletní příprava na test
// @subject Physics
// @topic Hydrostatika · Hydrodynamika · Povrchová vrstva · Kapilarita · Roztažnost
// @template study-app

import { useState, useCallback, useMemo } from 'react';

/* ═══════════════════════════════════════════════════════════════════
   QUIZ ENGINE (copied from assets/quiz-engine.jsx)
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
    const si = shuffleArray(indices);
    return { ...q, options: si.map(i => q.options[i]), correct: q.correct.map(o => si.indexOf(o)) };
  });
}

function arrEqual(a, b) {
  if (!a || !b) return false;
  const sa = [...a].sort((x, y) => x - y);
  const sb = [...b].sort((x, y) => x - y);
  return sa.length === sb.length && sa.every((v, i) => v === sb[i]);
}

function QuizEngine({ questions, accentColor = '#06b6d4' }) {
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

  const btn = {
    padding: '10px 22px', background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px',
    color: '#fff', cursor: 'pointer', fontSize: '15px', transition: 'all 0.4s ease'
  };

  if (showResults) {
    const msg = pct >= 90 ? 'Výborně! Jsi připraven/a na test! 🎉'
      : pct >= 70 ? 'Dobře! Ještě trochu procvič slabá místa.'
      : pct >= 50 ? 'Mohlo by být lepší — projdi teorii znovu.'
      : 'Potřebuješ více přípravy. Čti teorii a opakuj!';
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
        <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '40px 48px' }}>
          <div style={{ color: '#fff', fontSize: '52px', fontWeight: 800 }}>{score}/{sq.length}</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '22px', marginBottom: '12px' }}>{pct}%</div>
          <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '17px', lineHeight: 1.5, marginBottom: '24px', maxWidth: '320px' }}>{msg}</div>
          <button style={{ ...btn, background: accentColor + '55', border: `1px solid ${accentColor}` }} onClick={restart}>Začít znovu</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '680px', margin: '0 auto', padding: '16px' }}>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {sq.map((_, i) => {
          let bg = '#4b5563';
          if (i === idx) bg = accentColor;
          else if (revealed[i]) bg = arrEqual(answers[i] || [], sq[i].correct) ? '#22c55e' : '#ef4444';
          return <div key={i} onClick={() => goTo(i)} title={`Otázka ${i + 1}`} style={{ width: '20px', height: '20px', borderRadius: '50%', cursor: 'pointer', transition: 'background 0.4s ease', background: bg }} />;
        })}
      </div>
      <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '24px' }}>
        <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px', marginBottom: '6px' }}>Otázka {idx + 1} / {sq.length}</div>
        <div style={{ color: '#fff', fontSize: '18px', fontWeight: 600, lineHeight: 1.5, marginBottom: '20px' }}>{q.question}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {q.options.map((opt, i) => {
            let border = '1px solid rgba(255,255,255,0.12)', bg = 'rgba(255,255,255,0.04)';
            if (isRev) {
              if (q.correct.includes(i)) { bg = 'rgba(34,197,94,0.15)'; border = '1px solid #22c55e'; }
              else if (activeSet.includes(i)) { bg = 'rgba(239,68,68,0.15)'; border = '1px solid #ef4444'; }
            } else if (activeSet.includes(i)) { bg = accentColor + '18'; border = `1px solid ${accentColor}`; }
            return (
              <div key={i} style={{ padding: '12px 16px', borderRadius: '12px', color: '#fff', cursor: 'pointer', transition: 'all 0.4s ease', display: 'flex', alignItems: 'center', gap: '10px', userSelect: 'none', fontSize: '15px', background: bg, border }}
                onClick={() => isMulti ? toggleMulti(i) : handleSingle(i)}>
                {isMulti && <span style={{ fontSize: '18px', minWidth: '20px' }}>{activeSet.includes(i) ? '☑' : '☐'}</span>}
                <span>{opt}</span>
              </div>
            );
          })}
        </div>
        {isMulti && !isRev && (
          <button style={{ ...btn, marginTop: '12px', opacity: pending.length ? 1 : 0.4 }} onClick={submitMulti} disabled={!pending.length}>Potvrdit</button>
        )}
        {isRev && (
          <div style={{ marginTop: '20px', padding: '16px', borderRadius: '14px', border: `1px solid ${isOk ? '#22c55e' : '#ef4444'}`, background: 'rgba(255,255,255,0.03)' }}>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '16px', marginBottom: '8px' }}>{isOk ? '✅ Správně!' : '❌ Špatně'}</div>
            {!isOk && <div style={{ color: '#86efac', fontSize: '14px', marginBottom: '6px' }}>Správná odpověď: {q.correct.map(i => q.options[i]).join(', ')}</div>}
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', lineHeight: 1.5 }}>{q.explanation}</div>
            {q.tip && <div style={{ color: '#fbbf24', fontSize: '13px', marginTop: '8px', fontStyle: 'italic' }}>💡 {q.tip}</div>}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button style={btn} onClick={() => goTo(idx - 1)} disabled={idx === 0}>← Předchozí</button>
        {idx < sq.length - 1
          ? <button style={btn} onClick={() => goTo(idx + 1)}>Další →</button>
          : <button style={{ ...btn, background: accentColor + '55', border: `1px solid ${accentColor}` }} onClick={() => setShowResults(true)}>Výsledky →</button>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════════ */

const THEORY = [
  {
    id: 'tekutiny', title: '1. Tekutiny — základní vlastnosti', icon: '💧',
    blocks: [
      { type: 'def', text: 'Kapaliny a plyny = TEKUTINY. Základní vlastnost: TEKUTOST — neschopnost udržet stálý tvar.' },
      { type: 'subheading', text: 'Kapaliny:' },
      { type: 'list', items: ['Zachovávají stálý objem (za konstantní teploty)', 'Mají vodorovný povrch v tíhovém poli Země', 'Jsou velmi málo stlačitelné (malé vzdálenosti mezi částicemi)', 'Vykazují kapilární jevy', 'Mají vnitřní tření (viskozitu) — různé u různých kapalin (voda vs. med)'] },
      { type: 'subheading', text: 'Plyny:' },
      { type: 'list', items: ['Nemají stálý tvar ani objem (jsou rozpínavé)', 'Vzájemné síly mezi molekulami jsou zanedbatelné', 'Jsou snadno stlačitelné'] },
      { type: 'highlight', text: 'Ideální kapalina = nestlačitelná + bez vnitřního tření (model pro výpočty)' },
      { type: 'highlight', text: 'Ideální plyn = bez vnitřního tření + dokonale stlačitelný' },
    ]
  },
  {
    id: 'hydrostatika', title: '2. Hydrostatika — tlak v kapalinách', icon: '⚖️',
    blocks: [
      { type: 'def', text: 'Hydrostatický tlak = tlak způsobený vlastní tíhou kapaliny.' },
      { type: 'formula', text: 'p = h · ρ · g' },
      { type: 'list', items: ['h … hloubka pod hladinou [m]', 'ρ … hustota kapaliny [kg/m³]', 'g … tíhové zrychlení = 9,81 m/s²', 'p … tlak [Pa = N/m²]'] },
      { type: 'note', text: 'Hydrostatický tlak nezávisí na tvaru nádoby — zákon spojených nádob: ve spojených nádobách je hladina stejné kapaliny ve stejné výšce.' },
      { type: 'subheading', text: 'Pascalův zákon:' },
      { type: 'def', text: 'Tlak vyvolaný vnější silou na kapalné těleso v uzavřené nádobě je ve všech místech kapaliny stejný. (p = konst.)' },
      { type: 'formula', text: 'Hydraulický lis: F₁/S₁ = F₂/S₂  →  F₂/F₁ = S₂/S₁' },
      { type: 'note', text: 'Malou silou F₁ na malém pístu S₁ → velká síla F₂ na velkém pístu S₂. Využívají: hydraulický lis, brzdy auta, jeřáby.' },
    ]
  },
  {
    id: 'archimedes', title: '3. Archimédův zákon', icon: '🛁',
    blocks: [
      { type: 'def', text: 'Těleso ponořené v kapalině je nadlehčováno hydrostatickou vztlakovou silou, jejíž velikost se rovná tíze kapaliny stejného objemu, jako je objem ponořené části tělesa.' },
      { type: 'formula', text: 'F_vz = V · ρ_k · g' },
      { type: 'list', items: ['V … objem ponořené části tělesa [m³]', 'ρ_k … hustota kapaliny [kg/m³]', 'g … tíhové zrychlení [m/s²]'] },
      { type: 'subheading', text: 'Tři případy (závisí na hustotě):' },
      { type: 'list', items: ['F_G > F_vz → těleso klesá ke dnu → ρ_T > ρ_K', 'F_G = F_vz → těleso se vznáší v kapalině → ρ_T = ρ_K', 'F_G < F_vz → těleso stoupá k hladině, částečně se vynoří → ρ_T < ρ_K'] },
      { type: 'note', text: 'Platí i v plynech! (balóny, bubliny vzduchu). Hustota ledu ≈ 920 kg/m³, vody = 1000 kg/m³ → 92 % ledovce je pod vodou.' },
    ]
  },
  {
    id: 'hydrodynamika', title: '4. Hydrodynamika — proudění kapalin', icon: '🌊',
    blocks: [
      { type: 'def', text: 'Hydrodynamika = věda o mechanickém pohybu (proudění) kapalin. Tekutina proudí, je-li mezi dvěma místy rozdíl tlaků.' },
      { type: 'subheading', text: 'Typy proudění:' },
      { type: 'list', items: ['Ustálené (stacionární) — okamžitá rychlost v daném místě se s časem NEMĚNÍ. Při malých rychlostech → laminární proudění (hladké vrstvy).', 'Neustálené (nestacionární) — rychlost v daném místě se s časem MĚNÍ. Při velkých rychlostech → turbulentní proudění (víry, chaos).'] },
      { type: 'subheading', text: 'Proudnice:' },
      { type: 'note', text: 'Trajektorie částic při ustáleném proudění. Tečna v každém bodě proudnice = směr rychlosti. Proudnice se nepříkají!' },
      { type: 'subheading', text: 'Objemový tok Q_V:' },
      { type: 'formula', text: 'Q_V = V/t = S · v   [m³/s]' },
      { type: 'subheading', text: 'Hmotnostní tok Q_m:' },
      { type: 'formula', text: 'Q_m = m/t = ρ · S · v   [kg/s]' },
    ]
  },
  {
    id: 'rovnice', title: '5. Rovnice spojitosti', icon: '🔄',
    blocks: [
      { type: 'def', text: 'Při ustáleném proudění ideální kapaliny je objemový průtok Q_V v každém místě trubice stejný.' },
      { type: 'formula', text: 'S₁ · v₁ = S₂ · v₂  (Q_V = konst.)' },
      { type: 'list', items: ['S … průřez trubice [m²]', 'v … rychlost proudění [m/s]'] },
      { type: 'highlight', text: 'Důsledek: V užší části trubice teče kapalina RYCHLEJI, v širší POMALEJI!' },
      { type: 'note', text: 'Příklady: řeka v úžině teče rychleji, krev v zúžené cévě teče rychleji, fontána (zmenšení průřezu = větší rychlost = větší výška).' },
      { type: 'note', text: 'Platí pouze pro nestlačitelné kapaliny (ideální kapalina). Pro stlačitelné plyny platí Q_m = konst.' },
    ]
  },
  {
    id: 'bernoulli', title: '6. Bernoulliho rovnice', icon: '✈️',
    blocks: [
      { type: 'def', text: 'Součet kinetické a tlakové potenciální energie kapaliny o jednotkovém objemu je ve všech částech vodorovné trubice stejný. (Zákon zachování mechanické energie pro kapaliny.)' },
      { type: 'formula', text: '½ · ρ · v₁² + p₁ = ½ · ρ · v₂² + p₂ = konst.' },
      { type: 'list', items: ['½ρv² … dynamický tlak (kinetická energie na objem) [Pa]', 'p … statický tlak [Pa]', 'ρ … hustota kapaliny [kg/m³]'] },
      { type: 'highlight', text: 'Hydrodynamický paradox: Kde je větší rychlost → MENŠÍ tlak. Zúžení trubice způsobí snížení statického tlaku!' },
      { type: 'subheading', text: 'Praktické aplikace:' },
      { type: 'list', items: ['Křídlo letadla — vzduch nad křídlem jde rychleji (delší cesta) → nižší tlak → vztlak', 'Rozprašovač (atomizér) — proud vzduchu snižuje tlak, nasává kapalinu', 'Clonka na zahradní hadici — stlačením = zúžení = větší rychlost', 'Venturiho trubice — měření průtoku', 'Ejektory a injektory'] },
    ]
  },
  {
    id: 'turbulentni', title: '7. Turbulentní proudění a odpor prostředí', icon: '🌀',
    blocks: [
      { type: 'def', text: 'Turbulentní proudění nastane při překročení kritické rychlosti — kapalina se pohybuje chaoticky, tvoří víry za tělesem.' },
      { type: 'formula', text: 'F = ½ · C · ρ · S · v²' },
      { type: 'list', items: ['C … součinitel odporu (bezrozměrný, závisí na tvaru tělesa)', 'ρ … hustota tekutiny [kg/m³]', 'S … průřez tělesa [m²]', 'v … rychlost tělesa vůči tekutině [m/s]'] },
      { type: 'subheading', text: 'Hodnoty součinitele C:' },
      { type: 'list', items: ['Konvexní polokruh (špatný směr): C ≈ 1,33', 'Deska kolmo k proudu: C ≈ 1,12', 'Konkávní polokruh: C ≈ 0,48', 'Koule: C ≈ 0,34', 'Kapkovitý (aerodynamický) tvar: C ≈ 0,03'] },
      { type: 'highlight', text: 'Čím menší C, tím menší odpor → aerodynamická/hydrodynamická tělesa. Proto mají auta, letadla a ryby kapkovitý tvar!' },
    ]
  },
  {
    id: 'povrchova', title: '8. Povrchová vrstva kapaliny', icon: '🫧',
    blocks: [
      { type: 'def', text: 'Povrchová vrstva = tenká vrstva (~10⁻⁹ m) u volného povrchu kapaliny. Molekuly v ní mají nevykompenzované síly → výslednice míří dovnitř kapaliny.' },
      { type: 'subheading', text: 'Povrchová síla F a povrchové napětí σ:' },
      { type: 'formula', text: 'σ = F / l   [N/m]' },
      { type: 'list', items: ['F … povrchová síla [N]', 'l … délka okraje povrchové blány [m]', 'σ … povrchové napětí (závisí na druhu kapaliny a teplotě, s teplotou klesá)'] },
      { type: 'subheading', text: 'Povrchová energie E:' },
      { type: 'formula', text: 'E = σ · ΔS   [J]' },
      { type: 'list', items: ['ΔS … změna plochy povrchu [m²]', 'E … energie potřebná ke zvětšení povrchu'] },
      { type: 'highlight', text: 'Kapalina se snaží mít nejmenší povrch → kapky jsou kulové (minimum povrchu pro daný objem)!' },
      { type: 'note', text: 'Mýdlová blána má DVA povrchy → F_s = σ · 2l a E = σ · 2·l·Δx. Povrchové napětí vody při 20°C: σ ≈ 72–73 mN/m.' },
    ]
  },
  {
    id: 'kapilarita', title: '9. Kapilarita a jevy na rozhraní', icon: '🌿',
    blocks: [
      { type: 'def', text: 'Kapilarita = jev, kdy kapalina v úzké trubici (kapiláře) vystoupí nebo poklesne oproti volné hladině.' },
      { type: 'list', items: ['Adheze = přitažlivost kapaliny ke stěně trubice (jiná látka)', 'Koheze = soudržnost molekul kapaliny navzájem'] },
      { type: 'subheading', text: 'Kapilární elevace (vystoupání):' },
      { type: 'note', text: 'Nastane, pokud adheze > koheze → kapalina smáčí stěnu (kontaktní úhel θ < 90°). Příklad: voda ve skleněné trubici.' },
      { type: 'subheading', text: 'Kapilární deprese (pokles):' },
      { type: 'note', text: 'Nastane, pokud koheze > adheze → kapalina nesmáčí stěnu (θ > 90°). Příklad: rtuť ve skleněné trubici.' },
      { type: 'formula', text: 'h = 2σ / (r · ρ · g)   nebo   h·ρ·g = 2σ/R' },
      { type: 'list', items: ['h … výška vystoupání/poklesnutí [m]', 'σ … povrchové napětí [N/m]', 'r … poloměr kapiláry [m]', 'R … poloměr zakřivení meniska [m]'] },
      { type: 'highlight', text: 'Čím užší kapilára (menší r) → tím větší výška h! (h ~ 1/r)' },
      { type: 'note', text: 'Kapilárními jevy se šíří voda v rostlinách (xylém), saje papír, pohybuje se voda v půdě.' },
    ]
  },
  {
    id: 'roztaznost', title: '10. Teplotní objemová roztažnost kapalin', icon: '🌡️',
    blocks: [
      { type: 'def', text: 'Kapaliny se při zahřátí roztahují (obecně výrazněji než pevné látky, závisí na druhu kapaliny).' },
      { type: 'formula', text: 'V = V₁ · (1 + β · Δt)' },
      { type: 'list', items: ['V … objem po zahřátí [m³]', 'V₁ … počáteční objem [m³]', 'β … teplotní součinitel objemové roztažnosti [K⁻¹]', 'Δt = t₂ − t₁ … rozdíl teplot [K nebo °C]'] },
      { type: 'formula', text: 'Hustota: ρ ≈ ρ₁ · (1 − β · Δt)' },
      { type: 'subheading', text: 'Hodnoty β při 20°C:' },
      { type: 'list', items: ['β_voda = 1,8 · 10⁻⁴ K⁻¹', 'β_petrolej = 9,6 · 10⁻⁴ K⁻¹', 'β_líh = 11 · 10⁻⁴ K⁻¹'] },
      { type: 'highlight', text: 'Anomálie vody: Maximum hustoty při 4°C. Pod 4°C se voda při ochlazování ROZTAHUJE → led je lehčí než voda (ρ_led ≈ 920 kg/m³). Jezera zamrzají od hladiny, ryby přežívají u dna při 4°C.' },
    ]
  },
];

const PROBLEMS = [
  {
    title: 'Hydrostatický tlak na dně bazénu',
    difficulty: 'Easy ✨',
    statement: 'Vypočítejte hydrostatický tlak na dně bazénu hloubky h = 2,5 m naplněného vodou (ρ = 1000 kg/m³). Použijte g = 9,81 m/s².',
    given: ['h = 2,5 m', 'ρ = 1000 kg/m³', 'g = 9,81 m/s²'],
    formula: 'p = h · ρ · g',
    steps: ['p = 2,5 · 1000 · 9,81', 'p = 24 525 Pa'],
    result: 'p ≈ 24 525 Pa ≈ 24,5 kPa',
  },
  {
    title: 'Hydraulický lis — Pascalův zákon',
    difficulty: 'Easy ✨',
    statement: 'Hydraulický lis má malý píst průměru d₁ = 3,8 cm a velký píst průměru d₂ = 53,0 cm. Jakou silou F₁ na malém pístu vyváží sílu F₂ = 20,0 kN na velkém pístu?',
    given: ['d₁ = 3,8 cm → r₁ = 0,019 m', 'd₂ = 53,0 cm → r₂ = 0,265 m', 'F₂ = 20 000 N'],
    formula: 'F₁/S₁ = F₂/S₂  →  F₁ = F₂ · S₁/S₂',
    steps: [
      'S₁ = π·r₁² = π·(0,019)² ≈ 1,134·10⁻³ m²',
      'S₂ = π·r₂² = π·(0,265)² ≈ 0,2207 m²',
      'F₁ = F₂ · S₁/S₂ = 20000 · (1,134·10⁻³/0,2207)',
      'F₁ ≈ 102,8 N',
    ],
    result: 'F₁ ≈ 103 N  (malou silou vytvoříme velkou sílu!)',
  },
  {
    title: 'Archimédův zákon — ledová kra',
    difficulty: 'Medium ⚡',
    statement: 'Ledová kra má tvar čtvercové desky, obsah plochy 1 m² a tloušťku 20 cm. ρ_led = 920 kg/m³, ρ_voda = 1000 kg/m³. Jaká část kry je pod hladinou a jaká nad?',
    given: ['S = 1 m²', 'h_celk = 0,20 m', 'ρ_led = 920 kg/m³', 'ρ_voda = 1000 kg/m³'],
    formula: 'F_G = F_vz  →  m·g = V_pod · ρ_voda · g',
    steps: [
      'V_celk = S·h = 1·0,20 = 0,20 m³',
      'm = ρ_led · V = 920 · 0,20 = 184 kg',
      'V_pod = m / ρ_voda = 184/1000 = 0,184 m³',
      'h_pod = V_pod/S = 0,184/1 = 0,184 m = 18,4 cm',
      'h_nad = 20 − 18,4 = 1,6 cm',
      'Podíl pod hladinou: 18,4/20 = 92 %',
    ],
    result: '92 % kry je pod hladinou, 8 % nad hladinou',
  },
  {
    title: 'Rovnice spojitosti — Honza a hadice',
    difficulty: 'Medium ⚡',
    statement: 'Honza napustil 10litrovou konev za 20 s z hadice s průměrem 19 mm. a) Jakou rychlostí tekla voda? b) Honza zacpal prstem polovinu průřezu hadice — jakou rychlostí pak vytékala?',
    given: ['V = 10 l = 0,010 m³', 't = 20 s', 'd = 19 mm → r = 0,0095 m'],
    formula: 'Q_V = V/t = S·v;  S₁·v₁ = S₂·v₂',
    steps: [
      'Q_V = V/t = 0,010/20 = 5·10⁻⁴ m³/s',
      'S₁ = π·r² = π·(0,0095)² ≈ 2,835·10⁻⁴ m²',
      'a) v₁ = Q_V/S₁ = 5·10⁻⁴ / 2,835·10⁻⁴ ≈ 1,76 m/s',
      'b) S₂ = S₁/2 = 1,418·10⁻⁴ m²',
      'v₂ = Q_V/S₂ = 5·10⁻⁴ / 1,418·10⁻⁴ ≈ 3,53 m/s',
    ],
    result: 'a) v₁ ≈ 1,76 m/s   b) v₂ ≈ 3,53 m/s',
  },
  {
    title: 'Bernoulliho rovnice — manometrické trubice',
    difficulty: 'Medium ⚡',
    statement: 'Do vodorovného potrubí jsou vloženy dvě manometrické trubice: rovná (h₁ = 10 cm, statický tlak) a ohnutá otvorem proti proudu (h₂ = 30 cm, celkový tlak). Jaká je rychlost proudění?',
    given: ['h₁ = 0,10 m', 'h₂ = 0,30 m', 'g = 9,81 m/s²', 'ρ = 1000 kg/m³'],
    formula: '½ρv² = ρ·g·(h₂ − h₁)  →  v = √[2g·(h₂−h₁)]',
    steps: [
      'Diferenční výška: Δh = h₂ − h₁ = 0,30 − 0,10 = 0,20 m',
      'v² = 2·g·Δh = 2·9,81·0,20 = 3,924 m²/s²',
      'v = √3,924 ≈ 1,98 m/s',
    ],
    result: 'v ≈ 2,0 m/s',
  },
  {
    title: 'Povrchové napětí — hliníkový prstenec',
    difficulty: 'Hard 🔥',
    statement: 'Hliníkový prstenec poloměru r = 7,8 cm a hmotnosti m = 7 g se dotýká povrchu mýdlového roztoku (σ = 40 mN/m). Jakou celkovou silou ho musíme odtrhnout?',
    given: ['r = 0,078 m', 'm = 0,007 kg', 'σ = 0,04 N/m', 'g = 9,81 m/s²'],
    formula: 'F = F_G + F_s = m·g + σ·4πr  (prstenec má 2 povrchy → délka okraje = 4πr)',
    steps: [
      'F_G = m·g = 0,007·9,81 ≈ 0,0687 N',
      'l = 2·(2πr) = 4πr = 4·π·0,078 ≈ 0,9801 m  (dva okraje: vnější + vnitřní)',
      'F_s = σ·l = 0,04·0,9801 ≈ 0,0392 N',
      'F = F_G + F_s = 0,0687 + 0,0392 ≈ 0,1079 N',
    ],
    result: 'F ≈ 0,108 N',
  },
  {
    title: 'Kapilární elevace — výška petroleje',
    difficulty: 'Hard 🔥',
    statement: 'O jakou výšku vystoupí petrolej (σ = 27 mN/m, ρ = 800 kg/m³) v kapiláře s vnitřním průměrem 0,8 mm oproti volné hladině? (g = 9,81 m/s²)',
    given: ['σ = 0,027 N/m', 'ρ = 800 kg/m³', 'd = 0,8 mm → r = 0,4·10⁻³ m', 'g = 9,81 m/s²'],
    formula: 'h = 2σ / (r · ρ · g)',
    steps: [
      'h = 2·0,027 / (0,4·10⁻³ · 800 · 9,81)',
      'h = 0,054 / 3,139',
      'h ≈ 0,0172 m',
    ],
    result: 'h ≈ 17,2 mm',
  },
  {
    title: 'Teplotní roztažnost — kanystr s naftou',
    difficulty: 'Medium ⚡',
    statement: 'Kovový kanystr má objem 10 l. Jaký největší objem nafty (β = 0,9·10⁻³ K⁻¹) o teplotě 8 °C lze načerpat, aby při zahřátí na 25 °C nepřetekl?',
    given: ['V_kanystr = 10 l', 'β = 0,9·10⁻³ K⁻¹', 't₁ = 8°C, t₂ = 25°C → Δt = 17 K'],
    formula: 'V_t = V₀·(1 + β·Δt)  →  V₀ = V_t / (1 + β·Δt)',
    steps: [
      'Hledáme V₀ tak, aby V_t ≤ 10 l',
      'V₀ = 10 / (1 + 0,9·10⁻³·17)',
      'V₀ = 10 / (1 + 0,0153) = 10 / 1,0153',
      'V₀ ≈ 9,85 l',
    ],
    result: 'Načerpat maximálně 9,85 litrů nafty',
  },
];

const QUESTIONS = [
  {
    question: 'Co je hydrostatický tlak?',
    type: 'single',
    options: ['Tlak způsobený vnější silou na uzavřenou kapalinu', 'Tlak způsobený vlastní tíhou kapaliny', 'Tlak na dno nádoby nezávislý na hloubce', 'Tlak způsobený pohybem kapaliny'],
    correct: [1],
    explanation: 'Hydrostatický tlak p = h·ρ·g je tlak způsobený vlastní tíhou klidné kapaliny. Závisí pouze na hloubce h, hustotě ρ a tíhovém zrychlení g. Nezávisí na tvaru nádoby.',
    tip: 'HYDRO-STATIKA = stojící voda → tlak z vlastní tíhy'
  },
  {
    question: 'Pascalův zákon říká, že tlak vyvolaný vnější silou v uzavřené nádobě s kapalinou je...',
    type: 'single',
    options: ['Největší u dna nádoby', 'Ve všech místech kapaliny stejný', 'Závislý na tvaru nádoby', 'Přenášen pouze kolmo dolů'],
    correct: [1],
    explanation: 'Pascalův zákon: tlak vyvolaný vnější silou na kapalné těleso v uzavřené nádobě je ve všech místech kapaliny stejný (p = konst.). To je princip hydraulického lisu — silou na malém pístu vytvoříme velkou sílu na velkém pístu.',
  },
  {
    question: 'Těleso se vznáší v kapalině. Jaký je vztah hustot?',
    type: 'single',
    options: ['ρ_T > ρ_K', 'ρ_T < ρ_K', 'ρ_T = ρ_K', 'Závisí na objemu tělesa, ne hustotě'],
    correct: [2],
    explanation: 'Těleso se vznáší (F_G = F_vz), pokud ρ_T = ρ_K. Pokud ρ_T > ρ_K → klesá ke dnu. Pokud ρ_T < ρ_K → stoupá k hladině a vynoří se.',
    tip: 'Ponorka reguluje hustotu přijímáním/vypouštěním balastní vody'
  },
  {
    question: 'Na čem závisí vztlaková síla F_vz = V·ρ_k·g? Vyber vše správné.',
    type: 'multi',
    options: ['Hustotě kapaliny ρ_K', 'Hustotě tělesa ρ_T', 'Objemu ponořené části V', 'Tíhovém zrychlení g'],
    correct: [0, 2, 3],
    explanation: 'F_vz = V·ρ_K·g závisí na hustotě KAPALINY (ne tělesa!), objemu ponořené části a g. Hustota tělesa určuje jen výsledek porovnání F_G a F_vz, samotnou vztlakovou sílu ale neovlivňuje.',
  },
  {
    question: 'Co říká rovnice spojitosti S₁·v₁ = S₂·v₂?',
    type: 'single',
    options: ['Tlak kapaliny je v celé trubici stejný', 'Rychlost kapaliny je v celé trubici stejná', 'Objemový průtok kapaliny je v každém místě trubice stejný', 'Hmotnostní průtok závisí na teplotě'],
    correct: [2],
    explanation: 'Rovnice spojitosti: Q_V = S·v = konst. V užší části (menší S) je kapalina rychlejší (větší v), v širší části pomalejší. Je to zákon zachování hmoty pro nestlačitelnou kapalinu.',
    tip: 'Řeka v úžině teče rychleji — klasický příklad rovnice spojitosti'
  },
  {
    question: 'Bernoulliho rovnice říká, že kde kapalina proudí rychleji...',
    type: 'single',
    options: ['Je větší statický tlak', 'Je menší statický tlak', 'Statický tlak se nemění', 'Závisí to na hustotě kapaliny'],
    correct: [1],
    explanation: 'Bernoulli: ½ρv² + p = konst. Větší rychlost → větší dynamický tlak ½ρv² → menší statický tlak p. To je "hydrodynamický paradox" — zúžení trubice způsobí snížení statického tlaku.',
    tip: 'Letadlo: vzduch nad křídlem jde rychleji → nižší tlak → vztlak'
  },
  {
    question: 'Povrchové napětí σ je definováno jako:',
    type: 'single',
    options: ['Energie na zvýšení povrchu o 1 m', 'Podíl povrchové síly a délky okraje povrchové blány: σ = F/l', 'Tlak uvnitř vzduchové bubliny v kapalině', 'Součin hustoty a rychlosti proudění'],
    correct: [1],
    explanation: 'σ = F/l [N/m], kde F je povrchová síla a l je délka okraje povrchové blány. Lze také vyjádřit jako E/ΔS [J/m²] = energie potřebná ke zvětšení povrchu o 1 m². Hodnoty jsou stejné.',
  },
  {
    question: 'Co je kapilární elevace?',
    type: 'single',
    options: ['Pokles hladiny v kapiláře u rtuťového teploměru', 'Vystoupání kapaliny v úzké trubici u smáčivých kapalin', 'Nárůst tlaku kapaliny při zúžení průřezu', 'Tok kapaliny proti gravitaci způsobený teplotním gradientem'],
    correct: [1],
    explanation: 'Kapilární elevace nastane u kapalin smáčejících stěnu (adheze > koheze, kontaktní úhel < 90°) — kapalina vystoupí. Příklad: voda ve skle. Kapilární deprese (pokles): rtuť ve skle (nesmáčí).',
  },
  {
    question: 'Anomálie vody: maximum hustoty vody je při teplotě...',
    type: 'single',
    options: ['0°C', '4°C', '20°C', '100°C'],
    correct: [1],
    explanation: 'Anomálie vody: hustota roste od 0°C do 4°C (maximum), pak klesá. Pod 4°C se voda při ochlazování roztahuje → led (0°C) je méně hustý než voda (4°C). Jezera zamrzají od hladiny. Ryby přežívají u dna.',
    tip: 'Pamatuj: 4°C = maximum hustoty, voda se "chová naopak" než jiné kapaliny'
  },
  {
    question: 'Hydraulický lis: malý píst průměr 2 cm, velký 10 cm. Silou 100 N na malý píst vytvoříme na velkém:',
    type: 'single',
    options: ['500 N', '1 000 N', '2 500 N', '250 N'],
    correct: [2],
    explanation: 'F₂/F₁ = S₂/S₁ = (r₂/r₁)² = (5/1)² = 25. F₂ = 25·100 = 2500 N. Poměr sil = poměr ploch průřezů = čtverec poměru poloměrů (nebo průměrů).',
    tip: 'Poměr sil = (d₂/d₁)² = (poměr průměrů)²'
  },
  {
    question: 'Trubice se zužuje na čtvrtinu průřezu (S₂ = S₁/4). Co se stane s rychlostí kapaliny?',
    type: 'single',
    options: ['Rychlost se sníží na čtvrtinu', 'Rychlost se zdvojnásobí', 'Rychlost zůstane stejná', 'Rychlost se čtyřnásobí'],
    correct: [3],
    explanation: 'Rovnice spojitosti: S₁·v₁ = S₂·v₂ → v₂ = v₁·S₁/S₂ = v₁·4 = 4v₁. Pokud se průřez zmenší na čtvrtinu, rychlost se čtyřnásobí.',
  },
  {
    question: 'Jaký tvar má nejmenší součinitel odporu C v turbulentním proudění?',
    type: 'single',
    options: ['Koule (C ≈ 0,34)', 'Deska kolmo k proudu (C ≈ 1,12)', 'Kapkovitý (aerodynamický) tvar (C ≈ 0,03)', 'Konvexní polokruh (C ≈ 1,33)'],
    correct: [2],
    explanation: 'Kapkovitý (aerodynamický/hydrodynamický) tvar má nejmenší odpor C ≈ 0,03. Tvar kopíruje proudnice → minimální turbulence. Nejhorší je konvexní polokruh (C ≈ 1,33) — proudnice se odtrhují hned.',
  },
  {
    question: 'Výška kapilární elevace h = 2σ/(r·ρ·g). Pokud použijeme kapiláru s polovičním poloměrem, výška...',
    type: 'single',
    options: ['Se sníží na polovinu', 'Zůstane stejná', 'Se zdvojnásobí', 'Se čtyřnásobí'],
    correct: [2],
    explanation: 'h = 2σ/(r·ρ·g). Pokud r → r/2, pak h → 2·2σ/(2r·ρ·g) = 2h. Výška se zdvojnásobí. Čím užší kapilára, tím výše kapalina vystoupí (h ~ 1/r).',
  },
  {
    question: 'Která tělísa/jevy jsou příklady VYUŽITÍ Bernoulliho rovnice?',
    type: 'multi',
    options: ['Vztlak křídla letadla', 'Rozprašovač parfému (atomizér)', 'Hydraulický lis', 'Manometrická trubice (Pitotova sonda)'],
    correct: [0, 1, 3],
    explanation: 'Bernoulliho rovnici využívá: vztlak křídla (rychlejší vzduch nad křídlem = nižší tlak), atomizér (proud vzduchu snižuje tlak → nasává kapalinu), Pitotova sonda (měří rychlost proudění). Hydraulický lis využívá Pascalův zákon.',
  },
  {
    question: 'Ideální kapalina se vyznačuje tím, že je:',
    type: 'multi',
    options: ['Nestlačitelná', 'Bez vnitřního tření (bez viskozity)', 'Bez povrchového napětí', 'Dokonale smáčivá'],
    correct: [0, 1],
    explanation: 'Ideální kapalina je nestlačitelná a bez vnitřního tření (nulová viskozita). Povrchové napětí a smáčivost nejsou součástí definice ideální kapaliny. Slouží jako zjednodušený model pro hydrodynamické výpočty.',
  },
  {
    question: 'V jaké hloubce je hydrostatický tlak vody 50 kPa? (ρ = 1000 kg/m³, g = 10 m/s²)',
    type: 'single',
    options: ['2,5 m', '5 m', '10 m', '50 m'],
    correct: [1],
    explanation: 'p = h·ρ·g → h = p/(ρ·g) = 50 000/(1000·10) = 5 m. Na každých 10 m hloubky ve vodě přibude tlak přibližně 100 kPa (1 atm).',
  },
  {
    question: 'Co je hydrodynamický paradox?',
    type: 'single',
    options: ['Kapalina přestane téct, pokud tlak poklesne', 'Zúžení trubice způsobí snížení statického tlaku kapaliny', 'V kapiláře kapalina stoupá bez vnějšího tlaku', 'Vztlaková síla závisí jen na hustotě tekutiny, ne na hustotě tělesa'],
    correct: [1],
    explanation: 'Hydrodynamický paradox = v místě zúžení trubice je kapalina rychlejší → z Bernoulliho rovnice plyne, že statický tlak je tam NIŽŠÍ (ne vyšší). Je to "paradox", protože intuice říká, že v zúžení bude větší tlak.',
  },
  {
    question: 'Povrchová energie mýdlové blány se změní o ΔE při zvětšení plochy o ΔS. Jaký je vzorec?',
    type: 'single',
    options: ['ΔE = σ / ΔS', 'ΔE = σ · ΔS', 'ΔE = 2σ · ΔS', 'ΔE = σ² · ΔS'],
    correct: [1],
    explanation: 'E = σ · ΔS [J], kde ΔS je celková změna plochy. Pozor: mýdlová blána má DVA povrchy. Pokud se příčka posune o Δx na délce l, změní se plocha o ΔS = 2·l·Δx (oba povrchy), takže ΔE = σ·2·l·Δx.',
  },
  {
    question: 'Z jakých faktorů závisí výška kapilárního vystoupání h = 2σ/(r·ρ·g)? Vyber vše správné.',
    type: 'multi',
    options: ['Povrchové napětí kapaliny σ', 'Poloměr kapiláry r', 'Hustota kapaliny ρ', 'Délka kapiláry'],
    correct: [0, 1, 2],
    explanation: 'h = 2σ/(r·ρ·g) závisí na σ (povrchové napětí), r (poloměr kapiláry) a ρ (hustota). Délka kapiláry na výšku vystoupání nemá vliv — kapalina vystoupí na výšku h bez ohledu na délku trubice.',
  },
  {
    question: 'Rychlost výtoku kapaliny z otvoru ve stěně nádoby ve hloubce h pod hladinou (Torricelliho vzorec):',
    type: 'single',
    options: ['v = h·g', 'v = √(2gh)', 'v = √(gh)', 'v = 2gh'],
    correct: [1],
    explanation: 'Z Bernoulliho rovnice: p₀ + ρgh = p₀ + ½ρv² → v = √(2gh). Torricelliho vzorec — kapalina vytéká stejnou rychlostí, jakou by padalo těleso z výšky h (volný pád).',
    tip: 'Jako volný pád: v = √(2gh)'
  },
];

const FLASHCARDS = [
  { front: 'Hydrostatický tlak', back: 'p = h · ρ · g\nh = hloubka [m], ρ = hustota [kg/m³], g = 9,81 m/s²\nNezávisí na tvaru nádoby!' },
  { front: 'Pascalův zákon', back: 'Tlak vnější silou v uzavřené nádobě\nje ve VŠECH místech kapaliny stejný.\nHydraulický lis: F₁/S₁ = F₂/S₂' },
  { front: 'Archimédův zákon', back: 'F_vz = V · ρ_k · g\nV = objem ponořené části [m³]\nρ_k = hustota KAPALINY (ne tělesa!)\n\nρ_T > ρ_K → klesá\nρ_T = ρ_K → vznáší se\nρ_T < ρ_K → plave' },
  { front: 'Rovnice spojitosti', back: 'S₁ · v₁ = S₂ · v₂\n(Q_V = konst.)\n\nUžší trubice → rychleji\nŠirší trubice → pomaleji' },
  { front: 'Bernoulliho rovnice', back: '½ρv₁² + p₁ = ½ρv₂² + p₂\n\nVětší rychlost → MENŠÍ tlak\n(hydrodynamický paradox)' },
  { front: 'Objemový tok Q_V', back: 'Q_V = V/t = S · v   [m³/s]\n\nHmotnostní tok:\nQ_m = ρ · S · v   [kg/s]' },
  { front: 'Turbulentní odpor', back: 'F = ½ · C · ρ · S · v²\n\nC = součinitel odporu:\nKapkovitý tvar: C ≈ 0,03\nKoule: C ≈ 0,34\nDeska: C ≈ 1,12' },
  { front: 'Povrchové napětí σ', back: 'σ = F / l   [N/m]\n\nPovrchová energie:\nE = σ · ΔS   [J]\n\nσ_voda ≈ 72 mN/m (20°C)\nS teplotou klesá!' },
  { front: 'Mýdlová blána — dva povrchy', back: 'Blána má DVA povrchy!\nPovrchová síla: F = σ · 2l\nPovrchová energie při posunutí Δx:\nΔE = σ · 2 · l · Δx' },
  { front: 'Kapilární elevace/deprese', back: 'h = 2σ / (r · ρ · g)\n\nSmáčení (adheze > koheze):\n→ elevace (voda ve skle)\nNesmáčení (koheze > adheze):\n→ deprese (rtuť ve skle)\n\nMenší r → větší h' },
  { front: 'Kapilární tlak', back: 'h · ρ · g = 2σ / R\n\nR = poloměr zakřivení meniska\nPlatí pro kulovou kapičku/bublinu' },
  { front: 'Teplotní roztažnost kapalin', back: 'V = V₁ · (1 + β · Δt)\nρ ≈ ρ₁ · (1 – β · Δt)\n\nβ_voda = 1,8·10⁻⁴ K⁻¹\nβ_petrolej = 9,6·10⁻⁴ K⁻¹\nβ_líh = 11·10⁻⁴ K⁻¹' },
  { front: 'Anomálie vody', back: 'Maximum hustoty při 4°C!\nPod 4°C → roztahuje se při ochlazování\nLed je LEHČÍ než voda\nρ_led ≈ 920 kg/m³  <  ρ_voda = 1000 kg/m³\n\n→ Jezera zamrzají od hladiny' },
  { front: 'Ideální kapalina', back: 'Nestlačitelná + bez vnitřního tření\n(nulová viskozita)\n\nModel pro hydrodynamiku:\n→ Rovnice spojitosti\n→ Bernoulliho rovnice' },
  { front: 'Tři typy proudění', back: 'Ustálené (stacionární):\n→ rychlost v daném místě se nemění\n→ proudnice (trajektorie)\n\nLaminární: hladké vrstvy, malé v\nTurbulentní: víry, velké v' },
];

const FORMULAS = [
  {
    group: 'Hydrostatika', color: '#06b6d4',
    items: [
      { name: 'Hydrostatický tlak', f: 'p = h · ρ · g', note: 'h [m], ρ [kg/m³], g = 9,81 m/s²' },
      { name: 'Pascalův zákon — hydraulický lis', f: 'F₁/S₁ = F₂/S₂', note: 'F₂/F₁ = S₂/S₁' },
    ]
  },
  {
    group: 'Archimédův zákon', color: '#8b5cf6',
    items: [
      { name: 'Vztlaková síla', f: 'F_vz = V · ρ_k · g', note: 'V = objem ponořené části' },
      { name: 'Podmínka plovoucího tělesa', f: 'ρ_T · V_T = ρ_K · V_pod', note: 'ρ_T < ρ_K → plave' },
    ]
  },
  {
    group: 'Hydrodynamika', color: '#10b981',
    items: [
      { name: 'Objemový tok', f: 'Q_V = S · v = V/t', note: '[m³/s]' },
      { name: 'Hmotnostní tok', f: 'Q_m = ρ · S · v', note: '[kg/s]' },
      { name: 'Rovnice spojitosti', f: 'S₁ · v₁ = S₂ · v₂', note: 'Q_V = konst.' },
      { name: 'Bernoulliho rovnice', f: '½ρv₁² + p₁ = ½ρv₂² + p₂', note: 'konst. pro vodorovnou trubici' },
      { name: 'Výtok z nádoby (Torricelli)', f: 'v = √(2 · g · h)', note: 'h = hloubka pod hladinou' },
      { name: 'Turbulentní odpor', f: 'F = ½ · C · ρ · S · v²', note: 'C závisí na tvaru tělesa' },
    ]
  },
  {
    group: 'Povrchová vrstva', color: '#f59e0b',
    items: [
      { name: 'Povrchové napětí', f: 'σ = F / l', note: '[N/m]; l = délka okraje blány' },
      { name: 'Povrchová energie', f: 'E = σ · ΔS', note: '[J]; ΔS = změna plochy' },
      { name: 'Mýdlová blána (2 povrchy)', f: 'F = σ · 2l,  E = σ · 2·l·Δx', note: '' },
    ]
  },
  {
    group: 'Kapilarita', color: '#ec4899',
    items: [
      { name: 'Výška kapilárního vystoupání', f: 'h = 2σ / (r · ρ · g)', note: 'r = poloměr kapiláry' },
      { name: 'Kapilární tlakový vztah', f: 'h · ρ · g = 2σ / R', note: 'R = poloměr zakřivení meniska' },
    ]
  },
  {
    group: 'Teplotní roztažnost', color: '#f97316',
    items: [
      { name: 'Objem po zahřátí', f: 'V = V₁ · (1 + β · Δt)', note: 'β [K⁻¹], Δt = t₂ − t₁' },
      { name: 'Hustota po zahřátí', f: 'ρ ≈ ρ₁ · (1 − β · Δt)', note: '' },
    ]
  },
  {
    group: 'Konstanty', color: '#6b7280',
    items: [
      { name: 'Tíhové zrychlení', f: 'g = 9,81 m/s²', note: '(pro odhady: g ≈ 10 m/s²)' },
      { name: 'Hustota vody', f: 'ρ_voda = 1 000 kg/m³', note: 'při 4 °C (maximum)' },
      { name: 'Hustota ledu', f: 'ρ_led ≈ 920 kg/m³', note: 'při 0 °C' },
      { name: 'Povrch. napětí vody (20 °C)', f: 'σ_voda ≈ 72–73 mN/m', note: '' },
      { name: 'β vody (20 °C)', f: 'β_voda = 1,8 · 10⁻⁴ K⁻¹', note: '' },
    ]
  },
];

/* ═══════════════════════════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════════════════════════ */

const TABS = [
  { id: 'teorie', label: '📚 Teorie' },
  { id: 'priklady', label: '🧮 Příklady' },
  { id: 'kviz', label: '🎯 Kvíz' },
  { id: 'karticky', label: '🃏 Kartičky' },
  { id: 'vzorce', label: '📐 Vzorce' },
];

function TheoryBlock({ block }) {
  const mono = { fontFamily: "'JetBrains Mono', monospace", fontSize: '15px' };
  if (block.type === 'formula') return (
    <div style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.3)', borderRadius: '10px', padding: '12px 18px', margin: '10px 0', textAlign: 'center', color: '#67e8f9', ...mono, fontWeight: 600, fontSize: '17px' }}>
      {block.text}
    </div>
  );
  if (block.type === 'highlight') return (
    <div style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.35)', borderRadius: '10px', padding: '10px 16px', margin: '10px 0', color: '#c4b5fd', fontSize: '14px', lineHeight: 1.6 }}>
      ⚡ {block.text}
    </div>
  );
  if (block.type === 'def') return (
    <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, margin: '8px 0', fontSize: '15px' }}>{block.text}</p>
  );
  if (block.type === 'note') return (
    <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, margin: '6px 0', fontSize: '13px', fontStyle: 'italic' }}>{block.text}</p>
  );
  if (block.type === 'subheading') return (
    <p style={{ color: '#06b6d4', fontWeight: 700, margin: '14px 0 4px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{block.text}</p>
  );
  if (block.type === 'list') return (
    <ul style={{ margin: '6px 0', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {block.items.map((item, i) => (
        <li key={i} style={{ color: 'rgba(255,255,255,0.75)', fontSize: '14px', lineHeight: 1.6 }}>{item}</li>
      ))}
    </ul>
  );
  return null;
}

export default function App() {
  const [tab, setTab] = useState('teorie');
  const [openSection, setOpenSection] = useState('tekutiny');
  const [openProblem, setOpenProblem] = useState(null);
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const glass = {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '20px',
    transition: 'all 0.4s ease',
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@0,300;0,400;0,600;0,700;0,800;1,400&family=Audiowide&family=JetBrains+Mono:wght@400;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a1a; font-family: 'Exo 2', sans-serif; color: #fff; min-height: 100vh; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: rgba(255,255,255,0.03); } ::-webkit-scrollbar-thumb { background: rgba(6,182,212,0.4); border-radius: 3px; }
        @keyframes gridMove { from { transform: perspective(400px) rotateX(60deg) translateY(0); } to { transform: perspective(400px) rotateX(60deg) translateY(60px); } }
        @keyframes sunPulse { 0%,100% { opacity: 0.85; transform: scale(1); } 50% { opacity: 1; transform: scale(1.03); } }
        @keyframes floatUp { 0% { transform: translateY(100vh) scale(0); opacity: 0; } 10% { opacity: 0.6; } 90% { opacity: 0.3; } 100% { transform: translateY(-20vh) scale(1.5); opacity: 0; } }
        @keyframes fadeSlide { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes tabGlow { 0%,100% { box-shadow: 0 0 8px rgba(6,182,212,0.4); } 50% { box-shadow: 0 0 18px rgba(6,182,212,0.7); } }
        .app-tab:hover { background: rgba(255,255,255,0.1) !important; transform: translateY(-2px); }
        .app-tab.active { background: rgba(6,182,212,0.2) !important; border-color: rgba(6,182,212,0.5) !important; color: #67e8f9 !important; animation: tabGlow 3s ease infinite; }
        .theory-section:hover { background: rgba(255,255,255,0.08) !important; }
        .problem-card { transition: all 0.4s ease; } .problem-card:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(6,182,212,0.1); }
        .flip-card { perspective: 1000px; cursor: pointer; } .flip-inner { transition: transform 0.4s ease; transform-style: preserve-3d; position: relative; } .flip-inner.flipped { transform: rotateY(180deg); } .flip-front, .flip-back { backface-visibility: hidden; -webkit-backface-visibility: hidden; } .flip-back { transform: rotateY(180deg); }
        .formula-item { transition: all 0.4s ease; } .formula-item:hover { background: rgba(255,255,255,0.08) !important; }
      `}</style>

      {/* ── SYNTHWAVE BACKGROUND ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {/* Grid floor */}
        <div style={{
          position: 'absolute', bottom: 0, left: '-50%', right: '-50%', height: '55%',
          backgroundImage: 'linear-gradient(rgba(6,182,212,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(6,182,212,0.15) 1px,transparent 1px)',
          backgroundSize: '60px 60px',
          animation: 'gridMove 4s linear infinite',
          maskImage: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
        }} />
        {/* Neon sun */}
        <div style={{
          position: 'absolute', bottom: '28%', left: '50%', transform: 'translateX(-50%)',
          width: '260px', height: '260px', borderRadius: '50%',
          background: 'radial-gradient(circle, #ff6b35 0%, #f7931e 30%, #8b5cf6 60%, transparent 75%)',
          filter: 'blur(2px)', opacity: 0.55, animation: 'sunPulse 5s ease infinite',
        }} />
        {/* Horizontal scan lines on sun */}
        {[0,1,2,3,4,5,6].map(i => (
          <div key={i} style={{
            position: 'absolute', bottom: `${28 + i * 2.5}%`, left: '50%', transform: 'translateX(-50%)',
            width: `${260 - i * 25}px`, height: '3px',
            background: '#0a0a1a', opacity: 0.9,
          }} />
        ))}
        {/* Floating particles */}
        {[...Array(14)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${5 + (i * 7) % 90}%`,
            width: `${3 + (i % 4)}px`, height: `${3 + (i % 4)}px`,
            borderRadius: '50%',
            background: i % 3 === 0 ? '#06b6d4' : i % 3 === 1 ? '#8b5cf6' : '#f59e0b',
            opacity: 0.5,
            animation: `floatUp ${12 + (i % 8)}s ease-in ${i * 0.9}s infinite`,
          }} />
        ))}
        {/* Gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, #0a0a1a 0%, transparent 30%, transparent 70%, #0a0a1a 100%)' }} />
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px', margin: '0 auto', padding: '24px 16px 60px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontFamily: "'Audiowide', sans-serif", fontSize: 'clamp(22px,5vw,36px)', fontWeight: 700, background: 'linear-gradient(135deg, #67e8f9 0%, #a78bfa 50%, #f9a8d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '6px' }}>
            💧 KAPALINY
          </div>
          <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Kompletní příprava na test · Fyzika
          </div>
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {TABS.map(t => (
            <button
              key={t.id}
              className={`app-tab${tab === t.id ? ' active' : ''}`}
              onClick={() => setTab(t.id)}
              style={{
                padding: '10px 18px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)',
                cursor: 'pointer', fontSize: '14px', fontFamily: 'inherit', transition: 'all 0.4s ease',
                fontWeight: tab === t.id ? 700 : 400,
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── TAB: TEORIE ── */}
        {tab === 'teorie' && (
          <div style={{ animation: 'fadeSlide 0.5s ease', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {THEORY.map(section => {
              const isOpen = openSection === section.id;
              return (
                <div key={section.id} className="theory-section" style={{ ...glass, padding: 0, overflow: 'hidden', borderColor: isOpen ? 'rgba(6,182,212,0.3)' : 'rgba(255,255,255,0.1)' }}>
                  <button
                    onClick={() => setOpenSection(isOpen ? null : section.id)}
                    style={{
                      width: '100%', padding: '18px 22px', background: 'transparent', border: 'none',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px',
                      color: isOpen ? '#67e8f9' : 'rgba(255,255,255,0.85)', fontFamily: 'inherit',
                    }}>
                    <span style={{ fontSize: '20px' }}>{section.icon}</span>
                    <span style={{ fontSize: '16px', fontWeight: 700, flex: 1, textAlign: 'left' }}>{section.title}</span>
                    <span style={{ fontSize: '20px', transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.4s ease', opacity: 0.6 }}>›</span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 22px 20px', borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '16px' }}>
                      {section.blocks.map((block, i) => <TheoryBlock key={i} block={block} />)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── TAB: PŘÍKLADY ── */}
        {tab === 'priklady' && (
          <div style={{ animation: 'fadeSlide 0.5s ease', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textAlign: 'center', marginBottom: '4px' }}>Klikni na příklad pro zobrazení řešení</p>
            {PROBLEMS.map((prob, idx) => {
              const isOpen = openProblem === idx;
              const diffColor = prob.difficulty.includes('Hard') ? '#ef4444' : prob.difficulty.includes('Medium') ? '#f59e0b' : '#22c55e';
              return (
                <div key={idx} className="problem-card" style={{ ...glass }}>
                  <div style={{ padding: '20px 22px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '10px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: diffColor, background: diffColor + '22', border: `1px solid ${diffColor}44`, borderRadius: '20px', padding: '3px 10px', whiteSpace: 'nowrap' }}>{prob.difficulty}</span>
                      <span style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>{prob.title}</span>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '14px', lineHeight: 1.7 }}>{prob.statement}</p>
                    <button
                      onClick={() => setOpenProblem(isOpen ? null : idx)}
                      style={{
                        marginTop: '14px', padding: '8px 18px', background: isOpen ? 'rgba(6,182,212,0.15)' : 'rgba(255,255,255,0.06)',
                        border: `1px solid ${isOpen ? 'rgba(6,182,212,0.4)' : 'rgba(255,255,255,0.15)'}`,
                        borderRadius: '8px', color: isOpen ? '#67e8f9' : 'rgba(255,255,255,0.6)',
                        cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit', transition: 'all 0.4s ease',
                      }}>
                      {isOpen ? '▲ Skrýt řešení' : '▼ Zobrazit řešení'}
                    </button>
                  </div>
                  {isOpen && (
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {/* Given */}
                      <div>
                        <div style={{ color: '#06b6d4', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Zadáno</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {prob.given.map((g, i) => (
                            <span key={i} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '4px 10px', fontSize: '13px', fontFamily: "'JetBrains Mono', monospace", color: 'rgba(255,255,255,0.75)' }}>{g}</span>
                          ))}
                        </div>
                      </div>
                      {/* Formula */}
                      <div>
                        <div style={{ color: '#8b5cf6', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Vzorec</div>
                        <div style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '8px', padding: '10px 14px', fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', color: '#c4b5fd' }}>{prob.formula}</div>
                      </div>
                      {/* Steps */}
                      <div>
                        <div style={{ color: '#f59e0b', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Postup</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {prob.steps.map((step, i) => (
                            <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                              <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '12px', minWidth: '16px', marginTop: '2px' }}>{i + 1}.</span>
                              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Result */}
                      <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.35)', borderRadius: '10px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '18px' }}>✅</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '15px', fontWeight: 700, color: '#86efac' }}>{prob.result}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── TAB: KVÍZ ── */}
        {tab === 'kviz' && (
          <div style={{ animation: 'fadeSlide 0.5s ease' }}>
            <QuizEngine questions={QUESTIONS} accentColor="#06b6d4" />
          </div>
        )}

        {/* ── TAB: KARTIČKY ── */}
        {tab === 'karticky' && (
          <div style={{ animation: 'fadeSlide 0.5s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
              Kartička {cardIdx + 1} / {FLASHCARDS.length} — klikni pro otočení
            </div>

            {/* Progress dots */}
            <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {FLASHCARDS.map((_, i) => (
                <div key={i} onClick={() => { setCardIdx(i); setFlipped(false); }}
                  style={{ width: '10px', height: '10px', borderRadius: '50%', cursor: 'pointer', transition: 'background 0.4s ease', background: i === cardIdx ? '#06b6d4' : 'rgba(255,255,255,0.2)' }} />
              ))}
            </div>

            {/* Flip card */}
            <div className="flip-card" style={{ width: '100%', maxWidth: '560px', height: '260px' }} onClick={() => setFlipped(f => !f)}>
              <div className={`flip-inner${flipped ? ' flipped' : ''}`} style={{ width: '100%', height: '100%' }}>
                {/* Front */}
                <div className="flip-front" style={{ ...glass, position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '28px', borderColor: 'rgba(6,182,212,0.3)' }}>
                  <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Pojem / Zákon</div>
                  <div style={{ color: '#fff', fontSize: '22px', fontWeight: 700, textAlign: 'center', fontFamily: "'Audiowide', sans-serif", lineHeight: 1.4 }}>
                    {FLASHCARDS[cardIdx].front}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px', marginTop: '18px' }}>klikni pro otočení →</div>
                </div>
                {/* Back */}
                <div className="flip-back" style={{ ...glass, position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'rgba(6,182,212,0.07)', borderColor: 'rgba(6,182,212,0.4)' }}>
                  <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Odpověď</div>
                  <div style={{ color: '#67e8f9', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', textAlign: 'center', lineHeight: 1.9, whiteSpace: 'pre-wrap' }}>
                    {FLASHCARDS[cardIdx].back}
                  </div>
                </div>
              </div>
            </div>

            {/* Nav buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => { setCardIdx(i => Math.max(0, i - 1)); setFlipped(false); }}
                disabled={cardIdx === 0}
                style={{ padding: '10px 22px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: '#fff', cursor: 'pointer', fontSize: '15px', transition: 'all 0.4s ease', opacity: cardIdx === 0 ? 0.3 : 1 }}>
                ← Předchozí
              </button>
              <button
                onClick={() => { setCardIdx(i => Math.min(FLASHCARDS.length - 1, i + 1)); setFlipped(false); }}
                disabled={cardIdx === FLASHCARDS.length - 1}
                style={{ padding: '10px 22px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: '#fff', cursor: 'pointer', fontSize: '15px', transition: 'all 0.4s ease', opacity: cardIdx === FLASHCARDS.length - 1 ? 0.3 : 1 }}>
                Další →
              </button>
            </div>
          </div>
        )}

        {/* ── TAB: VZORCE ── */}
        {tab === 'vzorce' && (
          <div style={{ animation: 'fadeSlide 0.5s ease', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {FORMULAS.map(group => (
              <div key={group.group} style={{ ...glass, padding: '20px 22px' }}>
                <div style={{ color: group.color, fontFamily: "'Audiowide', sans-serif", fontSize: '15px', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '4px', height: '18px', background: group.color, borderRadius: '2px', display: 'inline-block' }} />
                  {group.group}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {group.items.map((item, i) => (
                    <div key={i} className="formula-item" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '12px 16px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
                      <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', minWidth: '180px', flex: '1' }}>{item.name}</span>
                      <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '15px', fontWeight: 600, color: group.color, background: group.color + '15', borderRadius: '6px', padding: '4px 10px' }}>{item.f}</code>
                      {item.note && <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', fontStyle: 'italic', flex: '2' }}>{item.note}</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </>
  );
}
