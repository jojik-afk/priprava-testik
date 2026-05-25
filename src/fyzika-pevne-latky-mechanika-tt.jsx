// @title Pevné látky & mechanika tuhého tělesa — příprava na test
// @subject Physics
// @topic Pevné látky · Krystaly · Deformace · Moment síly · Páka · Tuhé těleso
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
   DATA — TEORIE
   ═══════════════════════════════════════════════════════════════════ */

const THEORY = [
  {
    id: 'struktura', title: '1. Struktura pevných látek', icon: '🧊',
    blocks: [
      { type: 'def', text: 'Pevné látky jsou jedno ze tří základních skupenství. Částice (atomy, ionty, molekuly) jsou velmi blízko sebe, působí na sebe přitažlivými i odpudivými silami a téměř se nepohybují — pouze kmitají kolem svých rovnovážných poloh.' },
      { type: 'list', items: ['Střední vzdálenost částic je 0,2 nm až 0,3 nm', 'S rostoucí teplotou se výchylky (kmity) částic zvětšují', 'Těsně pod teplotou tání je výchylka až 1/6 vzájemné vzdálenosti částic'] },
      { type: 'highlight', text: 'Celková vnitřní POTENCIÁLNÍ energie částic je VĚTŠÍ než jejich vnitřní KINETICKÁ energie — proto pevná látka drží pohromadě a má stálý tvar.' },
      { type: 'note', text: 'Důsledek silné vazby: pevné látky mají stálý tvar i stálý objem.' },
      { type: 'subheading', text: 'Dělení pevných látek:' },
      { type: 'list', items: ['Podle pravidelnosti struktury: krystalické × amorfní', 'Podle směrové závislosti vlastností: izotropní × anizotropní'] },
    ]
  },
  {
    id: 'krystaly-amorf', title: '2. Krystalické a amorfní látky', icon: '💎',
    blocks: [
      { type: 'subheading', text: 'Krystalické látky:' },
      { type: 'list', items: ['Částice jsou uspořádané pravidelně a periodicky (dalekodosahové uspořádání)', 'Mají ostrý bod tání — tají při jediné teplotě', 'Příklady: kuchyňská sůl (NaCl), křemen, diamant, kovy, led'] },
      { type: 'subheading', text: 'Amorfní látky:' },
      { type: 'list', items: ['Částice jsou uspořádané jen krátkodosahově (nepravidelně) — připomínají „zamrzlou kapalinu“', 'Nemají ostrý bod tání — při zahřívání postupně měknou v rozmezí teplot', 'Příklady: sklo, vosk, asfalt, pryskyřice, plasty'] },
      { type: 'highlight', text: 'Hlavní rozdíl při tání: KRYSTALICKÁ látka taje při jedné teplotě, AMORFNÍ postupně měkne v širším intervalu teplot.' },
      { type: 'note', text: 'Polymery (kaučuk, dřevo, bílkoviny, plastické hmoty) tvoří velmi velké molekuly (i statisíce atomů) → patří mezi amorfní látky.' },
      { type: 'note', text: 'Kovové sklo = kov ochlazený tak rychle, že nestihne vykrystalizovat → amorfní kov. Neobsahuje poruchy mřížky, proto má vysokou pevnost a tvrdost a nekoroduje. Využití: letecký a kosmický průmysl, ochranné vrstvy (např. MP3 přehrávače proti poškrábání).' },
    ]
  },
  {
    id: 'izotropie', title: '3. Izotropie a anizotropie', icon: '🧭',
    blocks: [
      { type: 'def', text: 'Dělení podle toho, jak závisí vlastnosti (lámavost, průchod světla, tepelná roztažnost) na směru.' },
      { type: 'list', items: ['IZOTROPNÍ látky — vlastnosti jsou ve všech směrech STEJNÉ (amorfní látky, většina kovů)', 'ANIZOTROPNÍ látky — vlastnosti se v různých směrech LIŠÍ (monokrystaly, např. slída, grafit)'] },
      { type: 'note', text: 'Anizotropie je důsledek pravidelné mřížky — v různých směrech jsou částice uspořádané různě hustě.' },
    ]
  },
  {
    id: 'mrizka', title: '4. Krystalová mřížka a elementární buňky', icon: '🔷',
    blocks: [
      { type: 'def', text: 'Ideální krystalová mřížka = pravidelné, periodicky se opakující rozmístění částic v prostoru. Nejmenší opakující se část je elementární (základní) buňka.' },
      { type: 'list', items: ['Nejmenší vzdálenost částic v mřížce je řádově 10⁻¹⁰ m', 'Mřížková konstanta a = délka hrany elementární buňky'] },
      { type: 'subheading', text: 'Tři typy kubických (krychlových) mřížek:' },
      { type: 'list', items: ['PROSTÁ KUBICKÁ — částice jen ve vrcholech krychle → 8 · 1/8 = 1 atom na buňku', 'PROSTOROVĚ CENTROVANÁ (BCC) — vrcholy + 1 částice ve středu krychle → 8 · 1/8 + 1 = 2 atomy (Cr, Na, K, železo α)', 'PLOŠNĚ CENTROVANÁ (FCC) — vrcholy + částice ve středu každé stěny → 8 · 1/8 + 6 · 1/2 = 4 atomy (Al, Cu, Ag, Au)'] },
      { type: 'note', text: 'Proč zlomky? Atom ve vrcholu je společný 8 buňkám (počítá se 1/8), atom uprostřed stěny 2 buňkám (1/2), atom uvnitř buňky náleží jen jí (1/1).' },
      { type: 'formula', text: 'Hustota z mřížky:  ρ = (N · Ar · mu) / a³' },
      { type: 'note', text: 'N = počet atomů na buňku, Ar = relativní atomová hmotnost, mu = 1,66·10⁻²⁷ kg (atomová hmotnostní konstanta), a³ = objem buňky.' },
      { type: 'note', text: 'Zajímavost: NITINOL (slitina Ni-Ti, zkoumána 1962) — kov s tvarovou pamětí: po deformaci se zahřátím sám vrátí do původního tvaru.' },
    ]
  },
  {
    id: 'deformace', title: '5. Deformace, napětí a Hookův zákon', icon: '🪢',
    blocks: [
      { type: 'def', text: 'Deformace = změna tvaru nebo objemu tělesa působením vnějších sil. Může být pružná (vratná — po odlehčení zmizí) nebo tvárná/plastická (trvalá). Druhy: tah, tlak, ohyb, smyk, krut.' },
      { type: 'subheading', text: 'Normálové napětí σ:' },
      { type: 'formula', text: 'σ = F / S' },
      { type: 'list', items: ['F … síla kolmá na průřez [N]', 'S … obsah průřezu [m²]', 'σ … normálové napětí [Pa]'] },
      { type: 'subheading', text: 'Relativní (poměrné) prodloužení ε:' },
      { type: 'formula', text: 'ε = Δl / l₀' },
      { type: 'list', items: ['Δl … prodloužení [m]', 'l₀ … původní délka [m]', 'ε … bezrozměrné'] },
      { type: 'subheading', text: 'Hookův zákon:' },
      { type: 'formula', text: 'σ = E · ε' },
      { type: 'list', items: ['E … modul pružnosti v tahu (Youngův modul) [Pa] — vlastnost materiálu', 'Čím větší E, tím tužší materiál (méně se deformuje)'] },
      { type: 'highlight', text: 'Hookův zákon (napětí úměrné prodloužení) platí jen v oblasti PRUŽNÉ deformace — do meze úměrnosti, tedy v lineární části grafu σ–ε.' },
      { type: 'subheading', text: 'Diagram napětí–deformace (graf σ–ε):' },
      { type: 'list', items: ['Mez úměrnosti σu — konec lineární části, do ní platí Hookův zákon', 'Mez pružnosti σE — do ní je deformace ještě vratná (pružná)', 'Mez pevnosti σp — největší napětí, které materiál vydrží; pak se přetrhne'] },
      { type: 'note', text: 'Meze pevnosti σp: ocel 350–800 MPa, ocel pro lana až 2000 MPa, dub (po vláknech) 92 MPa, cihly 10–50 MPa, beton 5–20 MPa. U mnoha materiálů je mez pevnosti v tahu ≈ v tlaku.' },
    ]
  },
  {
    id: 'tuhe-teleso', title: '6. Tuhé těleso: posuvný × otáčivý pohyb', icon: '🔄',
    blocks: [
      { type: 'def', text: 'Tuhé těleso = idealizace tělesa, které se vlivem sil nedeformuje (vzdálenosti mezi částicemi se nemění). Může konat posuvný (translační) i otáčivý (rotační) pohyb.' },
      { type: 'subheading', text: 'Posuvný pohyb (translace):' },
      { type: 'list', items: ['Všechny body tělesa opisují stejné trajektorie a mají stejnou rychlost', 'Příčina změny pohybu: SÍLA F'] },
      { type: 'subheading', text: 'Otáčivý pohyb (rotace):' },
      { type: 'list', items: ['Body opisují kružnice kolem pevné osy otáčení', 'Rychlost bodu roste se vzdáleností od osy (v = ω·r)', 'Příčina změny pohybu: MOMENT SÍLY M'] },
      { type: 'highlight', text: 'Otáčivý pohyb popisujeme veličinami a zákony ANALOGICKÝMI k posuvnému pohybu hmotného bodu (viz sekce „Analogie veličin“).' },
    ]
  },
  {
    id: 'moment-sily', title: '7. Moment síly', icon: '🔧',
    blocks: [
      { type: 'def', text: 'Moment síly M vyjadřuje otáčivý účinek síly na tuhé těleso vzhledem k dané ose otáčení.' },
      { type: 'formula', text: 'M = F · r = F · d · sin α' },
      { type: 'list', items: ['F … velikost síly [N]', 'r = d·sin α … rameno síly = kolmá vzdálenost osy otáčení od vektorové přímky síly [m]', 'α … úhel mezi silou a spojnicí k ose', 'M … moment síly [N·m]'] },
      { type: 'highlight', text: 'Rameno síly NENÍ délka páky! Je to KOLMÁ vzdálenost osy otáčení od přímky, ve které síla působí.' },
      { type: 'list', items: ['Síla kolmo na rameno (α = 90°): sin 90° = 1 → moment je největší, M = F·r', 'Síla ve směru ramene (α = 0°): sin 0° = 0 → moment je nulový'] },
      { type: 'note', text: 'Proto se dveře snáz otevírají u kliky (velké rameno) než u pantů (malé rameno) — stejná síla, ale jiný moment. Archimédés: „Dejte mi pevný bod a pohnu Zemí.“' },
    ]
  },
  {
    id: 'znamenka', title: '8. Znaménková konvence momentů', icon: '➕',
    blocks: [
      { type: 'def', text: 'Momentu přiřazujeme znaménko podle smyslu, ve kterém by těleso roztočil.' },
      { type: 'list', items: ['KLADNÝ moment (+): otáčí PROTI směru hodinových ručiček', 'ZÁPORNÝ moment (−): otáčí PO směru hodinových ručiček'] },
      { type: 'note', text: 'V momentové větě pak součet momentů točících doleva (+) musí být roven součtu momentů točících doprava (−), tedy jejich algebraický součet je nulový.' },
    ]
  },
  {
    id: 'paka', title: '9. Páka a momentová věta', icon: '⚖️',
    blocks: [
      { type: 'def', text: 'Momentová věta: Tuhé těleso otáčivé kolem pevné osy je v rovnováze (v klidu nebo v rovnoměrném otáčení) právě tehdy, když je výsledný moment všech sil nulový.' },
      { type: 'formula', text: '∑ M = M₁ + M₂ + M₃ + … = 0' },
      { type: 'subheading', text: 'Páka v rovnováze:' },
      { type: 'formula', text: 'F₁ · r₁ = F₂ · r₂' },
      { type: 'note', text: 'Moment otáčející doleva se musí vyrušit s momentem otáčejícím doprava. Platí pro páku, houpačku, jeřáb…' },
      { type: 'highlight', text: 'Celá STATIKA tuhého tělesa: těleso je v klidu, právě když ∑F = 0 (neposouvá se) A ZÁROVEŇ ∑M = 0 (neotáčí se).' },
      { type: 'note', text: 'Tip k výpočtu: osu otáčení si můžeme zvolit libovolně. Vybíráme tu, vůči níž je moment některé neznámé síly nulový (síla prochází osou) — výpočet se zjednoduší.' },
    ]
  },
  {
    id: 'dvojice', title: '10. Dvojice sil', icon: '🌀',
    blocks: [
      { type: 'def', text: 'Dvojice sil = dvě stejně velké síly opačného směru, které neleží na jedné přímce.' },
      { type: 'list', items: ['Výslednice dvojice sil je NULOVÁ → těleso se neposouvá', 'Těleso se vlivem dvojice sil pouze otáčí (čistě rotuje)'] },
      { type: 'formula', text: 'M = F · d' },
      { type: 'list', items: ['F … velikost jedné ze sil [N]', 'd … rameno dvojice = kolmá vzdálenost mezi vektorovými přímkami obou sil [m]'] },
      { type: 'note', text: 'Příklady: ždímání hadru, otáčení volantem oběma rukama, utahování matice klíčem za oba konce.' },
    ]
  },
  {
    id: 'teziste', title: '11. Těžiště a rovnovážné polohy', icon: '🎯',
    blocks: [
      { type: 'def', text: 'Těžiště = působiště výsledné tíhové (gravitační) síly tělesa. Poloha těžiště soustavy hmotných bodů:' },
      { type: 'formula', text: 'x_T = (m₁x₁ + m₂x₂ + … + mₙxₙ) / (m₁ + m₂ + … + mₙ)' },
      { type: 'subheading', text: 'Tři druhy rovnovážných poloh:' },
      { type: 'list', items: ['STÁLÁ (stabilní) — po vychýlení se těleso vrací zpět; těžiště se při vychýlení ZVEDÁ', 'VRATKÁ (labilní) — po vychýlení se vychyluje dál; těžiště při vychýlení KLESÁ', 'VOLNÁ (indiferentní) — po vychýlení zůstává v nové poloze; těžiště zůstává ve STEJNÉ výšce (např. koule na vodorovné rovině)'] },
      { type: 'highlight', text: 'Těleso je tím stabilnější, čím NÍŽE leží jeho těžiště a čím VĚTŠÍ je jeho podstava (opěrná plocha).' },
    ]
  },
  {
    id: 'analogie', title: '12. Analogie posuvný ↔ otáčivý pohyb', icon: '🔁',
    blocks: [
      { type: 'def', text: 'Otáčivý pohyb popisujeme veličinami analogickými k posuvnému pohybu. Každé „posuvné“ veličině odpovídá jedna „úhlová/rotační“.' },
      { type: 'subheading', text: 'Kinematika (jak se to pohybuje):' },
      { type: 'list', items: ['dráha s [m]  ↔  úhel φ [rad]   (s = φ·r)', 'rychlost v [m/s]  ↔  úhlová rychlost ω [rad/s]   (v = ω·r, ω = Δφ/Δt)', 'zrychlení a [m/s²]  ↔  úhlové zrychlení ε [rad/s²]   (at = ε·r)', 'perioda T: ω = 2π/T   ·   frekvence f = 1/T: ω = 2π·f'] },
      { type: 'subheading', text: 'Dynamika (proč se to pohybuje):' },
      { type: 'list', items: ['příčina pohybu: síla F  ↔  moment síly M', 'odpor ke změně: hmotnost m  ↔  moment setrvačnosti J [kg·m²], J = m·r²', '2. Newtonův zákon: a = F/m  ↔  ε = M/J', 'hybnost p = m·v  ↔  moment hybnosti L = J·ω', 'zákon zachování: m·v = konst.  ↔  J·ω = konst.', 'kinetická energie: Ek = ½·m·v²  ↔  rotační: Ek = ½·J·ω²'] },
      { type: 'highlight', text: 'Moment setrvačnosti J = míra odporu tělesa ke změně otáčivého pohybu. Závisí na hmotnosti A na jejím rozložení vzhledem k ose (J = m·r²).' },
      { type: 'note', text: 'Zákon zachování momentu hybnosti: krasobruslař přitáhne ruce k tělu → zmenší J → musí vzrůst ω → točí se rychleji (J·ω = konst.).' },
    ]
  },
];

/* ═══════════════════════════════════════════════════════════════════
   DATA — ŘEŠENÉ PŘÍKLADY
   ═══════════════════════════════════════════════════════════════════ */

const PROBLEMS = [
  {
    title: 'Hustota hliníku z krystalové mřížky',
    difficulty: 'Hard 🔥',
    statement: 'Vypočítejte hustotu hliníku. Hliník krystalizuje v kubické plošně centrované soustavě (FCC) — na jednu elementární buňku připadají 4 atomy. Mřížková konstanta a = 0,405 nm, Ar = 26,98, mu = 1,66·10⁻²⁷ kg.',
    given: ['FCC → N = 4 atomy/buňku', 'a = 0,405 nm = 4,05·10⁻¹⁰ m', 'Ar = 26,98', 'mu = 1,66·10⁻²⁷ kg'],
    formula: 'ρ = m_buňky / V_buňky = (N · Ar · mu) / a³',
    steps: [
      'Hmotnost 1 atomu: m₀ = Ar · mu = 26,98 · 1,66·10⁻²⁷ ≈ 4,48·10⁻²⁶ kg',
      'Hmotnost buňky: m = N · m₀ = 4 · 4,48·10⁻²⁶ ≈ 1,79·10⁻²⁵ kg',
      'Objem buňky: V = a³ = (4,05·10⁻¹⁰)³ ≈ 6,64·10⁻²⁹ m³',
      'ρ = m / V = 1,79·10⁻²⁵ / 6,64·10⁻²⁹',
    ],
    result: 'ρ ≈ 2 700 kg/m³ (odpovídá tabulkové hustotě hliníku)',
  },
  {
    title: 'Mosazný drát — prodloužení a napětí',
    difficulty: 'Hard 🔥',
    statement: 'Mosazný drát dlouhý l = 140 cm o průměru d = 0,6 mm byl zatížen závažím m = 2 kg. Modul pružnosti v tahu mosazi E = 100 GPa. Vypočítejte normálové napětí, relativní prodloužení a prodloužení drátu.',
    given: ['l = 140 cm = 1,4 m', 'd = 0,6 mm → r = 0,3·10⁻³ m', 'm = 2 kg', 'E = 100 GPa = 10¹¹ Pa', 'g = 9,81 m/s²'],
    formula: 'σ = F/S ;  ε = σ/E ;  Δl = ε·l   (Hookův zákon: σ = E·ε)',
    steps: [
      'Síla: F = m·g = 2 · 9,81 = 19,62 N',
      'Průřez: S = π·r² = π·(0,3·10⁻³)² ≈ 2,83·10⁻⁷ m²',
      'Napětí: σ = F/S = 19,62 / 2,83·10⁻⁷ ≈ 6,94·10⁷ Pa ≈ 69,4 MPa',
      'Rel. prodloužení: ε = σ/E = 6,94·10⁷ / 10¹¹ ≈ 6,9·10⁻⁴',
      'Prodloužení: Δl = ε·l = 6,9·10⁻⁴ · 1,4 ≈ 9,7·10⁻⁴ m',
    ],
    result: 'σ ≈ 69,4 MPa ;  ε ≈ 6,9·10⁻⁴ ;  Δl ≈ 0,97 mm',
  },
  {
    title: 'Normálové napětí — nit a horolezec',
    difficulty: 'Medium ⚡',
    statement: 'Urči normálové napětí, kterým: a) působí závaží o hmotnosti 100 g na nit o průměru 0,5 mm; b) působí horolezec o hmotnosti 80 kg na lano o průměru 11 mm.',
    given: ['a) m = 0,1 kg, d = 0,5 mm → r = 0,25·10⁻³ m', 'b) m = 80 kg, d = 11 mm → r = 5,5·10⁻³ m', 'g = 9,81 m/s²'],
    formula: 'σ = F / S = m·g / (π·r²)',
    steps: [
      'a) F = 0,1 · 9,81 = 0,981 N ;  S = π·(0,25·10⁻³)² ≈ 1,96·10⁻⁷ m²',
      'a) σ = 0,981 / 1,96·10⁻⁷ ≈ 5,0·10⁶ Pa = 5 MPa',
      'b) F = 80 · 9,81 = 784,8 N ;  S = π·(5,5·10⁻³)² ≈ 9,50·10⁻⁵ m²',
      'b) σ = 784,8 / 9,50·10⁻⁵ ≈ 8,26·10⁶ Pa ≈ 8,3 MPa',
    ],
    result: 'a) σ ≈ 5 MPa     b) σ ≈ 8,3 MPa',
  },
  {
    title: 'Drát — úvahy o úměrnosti',
    difficulty: 'Medium ⚡',
    statement: 'Drát délky l a průřezu S napínaný silou F se prodloužil o Δl = 4 mm. O kolik se prodlouží: a) tentýž drát napínaný silou 2F? b) drát ze stejného materiálu délky l a průřezu 2S napínaný silou F? c) drát ze stejného materiálu délky 2l a průřezu S napínaný silou F?',
    given: ['Δl = 4 mm při (l, S, F)', 'Δl = F·l / (S·E)'],
    formula: 'Δl = F·l / (S·E)  → Δl ~ F,  Δl ~ l,  Δl ~ 1/S',
    steps: [
      'a) F → 2F: prodloužení je úměrné síle → Δl = 2 · 4 = 8 mm',
      'b) S → 2S: prodloužení je nepřímo úměrné průřezu → Δl = 4 / 2 = 2 mm',
      'c) l → 2l: prodloužení je úměrné délce → Δl = 2 · 4 = 8 mm',
    ],
    result: 'a) 8 mm     b) 2 mm     c) 8 mm',
  },
  {
    title: 'Minimální průměr lana výtahu',
    difficulty: 'Medium ⚡',
    statement: 'Urči minimální průměr ocelového lana výtahu, jehož kabina má nosnost 300 kg a vlastní hmotnost 500 kg. Hmotnost lana zanedbej. Uvažuj mez pevnosti oceli σp = 500 MPa.',
    given: ['m = 300 + 500 = 800 kg', 'σp = 500 MPa = 5·10⁸ Pa', 'g = 9,81 m/s²'],
    formula: 'σ = F/S ≤ σp  →  S_min = F/σp ;   d = √(4·S/π)',
    steps: [
      'Síla: F = m·g = 800 · 9,81 = 7 848 N',
      'Min. průřez: S = F/σp = 7848 / 5·10⁸ ≈ 1,57·10⁻⁵ m²',
      'Průměr: d = √(4·S/π) = √(4 · 1,57·10⁻⁵ / π)',
      'd = √(2,0·10⁻⁵) ≈ 4,5·10⁻³ m',
    ],
    result: 'd ≈ 4,5 mm (v praxi se ještě přidává bezpečnostní rezerva)',
  },
  {
    title: 'Matice šroubu — vliv ramene',
    difficulty: 'Easy ✨',
    statement: 'Matice šroubu musí být utažena momentem M = 150 N·m. Jak se změní velikost síly, kterou matici utahujeme, jestliže se rameno síly zvětší 4× a moment síly zůstane stejný?',
    given: ['M = 150 N·m = konst.', 'r → 4r'],
    formula: 'M = F · r  →  F = M / r',
    steps: [
      'Při zachování M je síla nepřímo úměrná ramenu: F = M/r',
      'Zvětšením ramene 4× (r → 4r): F → M/(4r) = F/4',
    ],
    result: 'Síla se zmenší 4× (na čtvrtinu) — proto delším klíčem utáhneme snáz',
  },
  {
    title: 'Houpačka — rovnováha páky',
    difficulty: 'Easy ✨',
    statement: 'Mirek (m₁ = 35 kg) a Petr (m₂ = 42 kg) se chtějí houpat v rovnováze. Petr si sedl na pravou stranu houpačky 2 m od osy otáčení. Do jaké vzdálenosti od osy si musí na levé straně sednout Mirek?',
    given: ['m₁ = 35 kg (Mirek)', 'm₂ = 42 kg (Petr)', 'r₂ = 2 m'],
    formula: 'Rovnováha: m₁·g·r₁ = m₂·g·r₂  →  m₁·r₁ = m₂·r₂',
    steps: [
      'r₁ = m₂·r₂ / m₁',
      'r₁ = 42 · 2 / 35 = 84 / 35',
    ],
    result: 'r₁ = 2,4 m — lehčí Mirek si musí sednout dál od osy',
  },
  {
    title: 'Stavební jeřáb — protizávaží',
    difficulty: 'Easy ✨',
    statement: 'Břemeno o tíze F₁ = 5 000 N visí na rameni jeřábu r₁ = 10 m od osy. Na druhé straně je protizávaží o tíze F₂ = 25 000 N. V jaké vzdálenosti r₂ od osy musí protizávaží být, aby byl jeřáb v rovnováze?',
    given: ['F₁ = 5 000 N, r₁ = 10 m', 'F₂ = 25 000 N'],
    formula: 'Rovnováha: F₁·r₁ = F₂·r₂  →  r₂ = F₁·r₁ / F₂',
    steps: [
      'r₂ = (5000 · 10) / 25000',
      'r₂ = 50 000 / 25 000',
    ],
    result: 'r₂ = 2 m',
  },
  {
    title: 'Záludná síla na klíči (pod úhlem)',
    difficulty: 'Medium ⚡',
    statement: 'Na konec maticového klíče délky l = 30 cm působíme silou F = 100 N. Síla ale nesvírá s klíčem pravý úhel — působí pod úhlem 30° vzhledem k rukojeti. Jaký je skutečný moment síly vzhledem k ose šroubu? (Pozor na rameno!)',
    given: ['F = 100 N', 'l = 30 cm = 0,3 m', 'α = 30°', 'sin 30° = 0,5'],
    formula: 'M = F · r ,  kde rameno r = l · sin α',
    steps: [
      'Rameno: r = l · sin α = 0,3 · sin 30° = 0,3 · 0,5 = 0,15 m',
      'Moment: M = F · r = 100 · 0,15',
    ],
    result: 'M = 15 N·m (kdyby síla působila kolmo, bylo by M = 100·0,3 = 30 N·m)',
  },
  {
    title: 'Dvojice sil — ždímání hadru',
    difficulty: 'Easy ✨',
    statement: 'Při ždímání hadru působí každá ruka silou F = 50 N na opačných stranách hadru. Kolmá vzdálenost působišť (přímek) obou sil je d = 12 cm. Jaký moment dvojice sil vzniká? (Hodnoty F a d jsou zvoleny jako příklad.)',
    given: ['F = 50 N', 'd = 12 cm = 0,12 m'],
    formula: 'Moment dvojice sil: M = F · d',
    steps: [
      'M = F · d = 50 · 0,12',
    ],
    result: 'M = 6 N·m (těleso se jen otáčí, neposouvá — výslednice dvojice je nulová)',
  },
  {
    title: 'Trojúhelníková deska — momenty sil',
    difficulty: 'Hard 🔥',
    statement: 'Deska ve tvaru pravoúhlého trojúhelníku (pravý úhel u vrcholu C) má strany CB = 0,3 m a AC = 0,4 m. Otáčí se kolem nehybné osy kolmé k desce procházející vrcholem A. Ve vrcholu B působí síla F₁ = 8 N (rovnoběžně se stranou AC), ve vrcholu C síla F₂ = 6 N (rovnoběžně se stranou CB); síly leží v rovině desky a jsou navzájem kolmé. Urči: a) výslednici sil F₁ a F₂; b) moment síly F₁; c) moment síly F₂ vzhledem k ose.',
    given: ['CB = 0,3 m, AC = 0,4 m, pravý úhel u C', 'F₁ = 8 N (ve vrcholu B), F₂ = 6 N (ve vrcholu C)', 'osa ⊥ desce, prochází vrcholem A'],
    formula: 'Kolmé síly: F = √(F₁² + F₂²) ;   Moment: M = F · r (r = kolmá vzdálenost osy od přímky síly)',
    steps: [
      'a) Síly jsou navzájem kolmé → F = √(F₁² + F₂²) = √(8² + 6²) = √100 = 10 N',
      'b) Rameno F₁ (u B, rovnoběžná s AC) = kolmá vzdálenost osy A od této přímky = strana CB = 0,3 m',
      'b) M₁ = F₁ · r₁ = 8 · 0,3 = 2,4 N·m',
      'c) Rameno F₂ (u C, rovnoběžná s CB) = kolmá vzdálenost osy A od této přímky = strana AC = 0,4 m',
      'c) M₂ = F₂ · r₂ = 6 · 0,4 = 2,4 N·m',
    ],
    result: 'a) F = 10 N     b) M₁ = 2,4 N·m     c) M₂ = 2,4 N·m',
  },
];

/* ═══════════════════════════════════════════════════════════════════
   DATA — KVÍZ
   ═══════════════════════════════════════════════════════════════════ */

const QUESTIONS = [
  {
    question: 'Čím je charakteristická vnitřní stavba pevných látek?',
    type: 'single',
    options: ['Částice se volně pohybují celým objemem', 'Částice jsou daleko od sebe a téměř na sebe nepůsobí', 'Částice jsou blízko sebe a kmitají kolem rovnovážných poloh', 'Částice nemají žádnou potenciální energii'],
    correct: [2],
    explanation: 'V pevné látce jsou částice velmi blízko sebe (0,2–0,3 nm), působí na sebe silami a jen kmitají kolem svých rovnovážných poloh. Vnitřní potenciální energie převažuje nad kinetickou → látka drží stálý tvar i objem.',
  },
  {
    question: 'Jak se liší krystalické a amorfní látky při tání?',
    type: 'single',
    options: ['Krystalické tají postupně, amorfní při jedné teplotě', 'Krystalické tají při jedné teplotě, amorfní postupně měknou', 'Obě tají při stejné teplotě', 'Amorfní látky vůbec netají'],
    correct: [1],
    explanation: 'Krystalické látky mají pravidelnou mřížku a ostrý bod tání (tají při jediné teplotě). Amorfní látky (sklo, vosk, plasty) nemají pravidelné uspořádání a při zahřívání postupně měknou v rozmezí teplot.',
    tip: 'Krystal = ostrý bod tání; amorfní = postupné měknutí',
  },
  {
    question: 'Které z těchto látek jsou amorfní?',
    type: 'multi',
    options: ['Sklo', 'Kuchyňská sůl (NaCl)', 'Vosk', 'Plasty / kaučuk'],
    correct: [0, 2, 3],
    explanation: 'Amorfní látky (krátkodosahové uspořádání, postupné měknutí): sklo, vosk, asfalt, pryskyřice, plasty, kaučuk. NaCl je naopak typická krystalická látka s pravidelnou mřížkou.',
  },
  {
    question: 'Anizotropní látka je taková, jejíž vlastnosti...',
    type: 'single',
    options: ['Jsou ve všech směrech stejné', 'Se v různých směrech liší', 'Nezávisí na teplotě', 'Se nemění při deformaci'],
    correct: [1],
    explanation: 'Anizotropní látka má vlastnosti (lámavost, průchod světla, tepelná roztažnost) závislé na směru — v různých směrech se liší. Typicky monokrystaly (slída, grafit). Izotropní látky mají vlastnosti ve všech směrech stejné.',
  },
  {
    question: 'Kolik atomů připadá na elementární buňku plošně centrované mřížky (FCC)?',
    type: 'single',
    options: ['1 atom', '2 atomy', '4 atomy', '8 atomů'],
    correct: [2],
    explanation: 'FCC: 8 vrcholů · 1/8 + 6 stěn · 1/2 = 1 + 3 = 4 atomy. (Prostá kubická = 1 atom, prostorově centrovaná BCC = 2 atomy.)',
    tip: 'FCC = 4, BCC = 2, prostá kubická = 1',
  },
  {
    question: 'Jaký je vzorec pro normálové napětí?',
    type: 'single',
    options: ['σ = S / F', 'σ = F · S', 'σ = F / S', 'σ = E / ε'],
    correct: [2],
    explanation: 'Normálové napětí σ = F/S, kde F je síla kolmá na průřez a S je obsah průřezu. Jednotka je pascal [Pa].',
  },
  {
    question: 'Co vyjadřuje Hookův zákon σ = E · ε a kde platí?',
    type: 'single',
    options: ['Napětí je úměrné prodloužení; platí v celé oblasti až do přetržení', 'Napětí je úměrné prodloužení; platí jen v oblasti pružné deformace (do meze úměrnosti)', 'Síla je úměrná hmotnosti; platí vždy', 'Prodloužení nezávisí na materiálu'],
    correct: [1],
    explanation: 'Hookův zákon: napětí σ je přímo úměrné relativnímu prodloužení ε, konstantou úměrnosti je modul pružnosti E. Platí jen v lineární (pružné) oblasti grafu σ–ε, do meze úměrnosti.',
  },
  {
    question: 'Co je mez pevnosti σp?',
    type: 'single',
    options: ['Napětí, do kterého je deformace pružná', 'Největší napětí, které materiál vydrží, než se přetrhne', 'Napětí, při kterém přestává platit Hookův zákon', 'Hustota materiálu při deformaci'],
    correct: [1],
    explanation: 'Mez pevnosti σp je největší napětí, které materiál vydrží před porušením (přetržením). Mez úměrnosti = konec platnosti Hookova zákona; mez pružnosti = hranice vratné deformace.',
  },
  {
    question: 'Vyber správný vzorec pro moment síly.',
    type: 'single',
    options: ['M = F + r', 'M = F / r', 'M = F · r · sin α', 'M = F / (r · sin α)'],
    correct: [2],
    explanation: 'Moment síly M = F·r = F·d·sin α, kde r = d·sin α je rameno síly (kolmá vzdálenost osy od přímky síly). Jednotka N·m.',
  },
  {
    question: 'Co je rameno síly?',
    type: 'single',
    options: ['Délka páky', 'Velikost působící síly', 'Kolmá vzdálenost osy otáčení od přímky, ve které síla působí', 'Vzdálenost těžiště od osy'],
    correct: [2],
    explanation: 'Rameno síly NENÍ délka páky! Je to kolmá vzdálenost osy otáčení od vektorové přímky síly. Proto u síly pod úhlem počítáme rameno jako r = d·sin α.',
    tip: 'Rameno = KOLMÁ vzdálenost osy od přímky síly',
  },
  {
    question: 'Proč se dveře snáze otevírají tlakem u kliky než blízko pantů?',
    type: 'single',
    options: ['U kliky působíme větší silou', 'U kliky je větší rameno → větší moment síly při stejné síle', 'U pantů je tření menší', 'Blízko pantů síla nepůsobí'],
    correct: [1],
    explanation: 'Moment síly M = F·r. U kliky je rameno r velké, u pantů malé. Při stejné síle vznikne u kliky mnohem větší moment, takže dveře snáz roztočíme.',
  },
  {
    question: 'Jaká je jednotka momentu síly?',
    type: 'single',
    options: ['N (newton)', 'N·m (newton metr)', 'Pa (pascal)', 'J (joule)'],
    correct: [1],
    explanation: 'Moment síly M = F·r má jednotku N·m (newton metr). Pozor: i když rozměrově je to stejné jako joule, moment síly se v joulech NEvyjadřuje.',
  },
  {
    question: 'Kdy je tuhé těleso otáčivé kolem pevné osy v rovnováze (momentová věta)?',
    type: 'single',
    options: ['Když je výsledná síla největší', 'Když je výsledný moment sil nulový (∑M = 0)', 'Když na něj nepůsobí žádná síla', 'Když se otáčí se zrychlením'],
    correct: [1],
    explanation: 'Momentová věta: těleso je v rovnováze (v klidu nebo rovnoměrném otáčení) právě tehdy, když je výsledný moment všech sil nulový: ∑M = 0. Pro úplnou statiku musí navíc platit ∑F = 0.',
  },
  {
    question: 'Na páce je v rovnováze závaží 30 kg ve vzdálenosti 2 m od osy. V jaké vzdálenosti musí být na druhé straně závaží 60 kg?',
    type: 'single',
    options: ['0,5 m', '1 m', '2 m', '4 m'],
    correct: [1],
    explanation: 'Rovnováha páky: m₁·r₁ = m₂·r₂ → 30·2 = 60·r₂ → r₂ = 60/60 = 1 m. Těžší závaží musí být blíž k ose.',
    tip: 'Těžší závaží → menší rameno (blíž k ose)',
  },
  {
    question: 'Kladný moment síly (+) podle znaménkové konvence otáčí tělesem...',
    type: 'single',
    options: ['Po směru hodinových ručiček', 'Proti směru hodinových ručiček', 'Vždy dolů', 'Nezáleží na směru'],
    correct: [1],
    explanation: 'Konvence: kladný moment (+) otáčí PROTI směru hodinových ručiček, záporný moment (−) PO směru hodinových ručiček.',
  },
  {
    question: 'Co je dvojice sil a jak působí na těleso?',
    type: 'single',
    options: ['Dvě stejné síly stejného směru — těleso se posouvá', 'Dvě stejně velké síly opačného směru na různých přímkách — těleso se jen otáčí', 'Jedna síla působící ve dvou bodech — těleso se deformuje', 'Dvě síly procházející osou — těleso je v klidu'],
    correct: [1],
    explanation: 'Dvojice sil = dvě stejně velké síly opačného směru neležící na jedné přímce. Jejich výslednice je nulová (těleso se neposouvá), ale vytvářejí moment M = F·d → těleso se čistě otáčí.',
  },
  {
    question: 'Moment setrvačnosti J je v otáčivém pohybu analogií které veličiny posuvného pohybu?',
    type: 'single',
    options: ['Síly', 'Rychlosti', 'Hmotnosti', 'Dráhy'],
    correct: [2],
    explanation: 'Moment setrvačnosti J je analogie hmotnosti m — vyjadřuje odpor tělesa ke změně otáčivého pohybu (J = m·r²). Analogie: F↔M, m↔J, v↔ω, p↔L.',
    tip: 'J je „rotační hmotnost“; J = m·r²',
  },
  {
    question: 'Krasobruslař při piruetě přitáhne ruce k tělu. Co se stane?',
    type: 'single',
    options: ['Točí se pomaleji, protože ztrácí energii', 'Točí se rychleji — zmenší moment setrvačnosti, ω vzroste (J·ω = konst.)', 'Rychlost se nezmění', 'Zvětší se jeho hmotnost'],
    correct: [1],
    explanation: 'Platí zákon zachování momentu hybnosti J·ω = konst. Přitažením rukou se zmenší moment setrvačnosti J (hmota blíž k ose), takže úhlová rychlost ω musí vzrůst → točí se rychleji.',
  },
  {
    question: 'Které vztahy jsou správné analogie posuvného a otáčivého pohybu?',
    type: 'multi',
    options: ['rychlost v ↔ úhlová rychlost ω', 'kinetická energie ½mv² ↔ ½Jω²', 'síla F ↔ moment síly M', 'hmotnost m ↔ rychlost ω'],
    correct: [0, 1, 2],
    explanation: 'Správné analogie: v↔ω, ½mv²↔½Jω², F↔M, m↔J, p=mv↔L=Jω. Poslední možnost (hmotnost ↔ rychlost) je nesmyslná — hmotnost odpovídá momentu setrvačnosti J.',
  },
  {
    question: 'Jaký je vztah mezi obvodovou rychlostí v a úhlovou rychlostí ω bodu ve vzdálenosti r od osy?',
    type: 'single',
    options: ['v = ω / r', 'v = ω · r', 'v = r / ω', 'v = ω + r'],
    correct: [1],
    explanation: 'Platí v = ω·r. Čím dál je bod od osy otáčení (větší r), tím větší má obvodovou rychlost při stejné úhlové rychlosti. Proto na okraji kola se bod pohybuje rychleji než blíž středu.',
  },
  {
    question: 'Síla působí na rameno pod úhlem α = 0° (ve směru ramene). Jaký je její moment vzhledem k ose?',
    type: 'single',
    options: ['Maximální', 'Nulový', 'Poloviční', 'Záporný'],
    correct: [1],
    explanation: 'M = F·d·sin α. Pro α = 0° je sin 0° = 0 → M = 0. Síla mířící přímo do osy (nebo od osy) nemá žádný otáčivý účinek. Maximální moment je při α = 90° (sin 90° = 1).',
  },
  {
    question: 'Kterou rovnovážnou polohu má koule ležící na vodorovné rovině?',
    type: 'single',
    options: ['Stálou (stabilní)', 'Vratkou (labilní)', 'Volnou (indiferentní)', 'Žádnou'],
    correct: [2],
    explanation: 'Koule na vodorovné rovině je ve volné (indiferentní) poloze — po posunutí zůstane v nové poloze a její těžiště je stále ve stejné výšce. Stálá: těžiště se při vychýlení zvedá; vratká: klesá.',
  },
];

/* ═══════════════════════════════════════════════════════════════════
   DATA — KARTIČKY
   ═══════════════════════════════════════════════════════════════════ */

const FLASHCARDS = [
  { front: 'Vnitřní stavba pevné látky', back: 'Částice 0,2–0,3 nm od sebe,\nkmitají kolem rovnovážných poloh.\n\nVnitřní POTENCIÁLNÍ energie\n> vnitřní KINETICKÁ energie\n→ stálý tvar i objem' },
  { front: 'Krystalické × amorfní', back: 'Krystalické: pravidelná mřížka,\nOSTRÝ bod tání (NaCl, kovy, led)\n\nAmorfní: nepravidelné uspořádání,\npostupné MĚKNUTÍ (sklo, vosk, plasty)' },
  { front: 'Izotropie × anizotropie', back: 'Izotropní: vlastnosti ve všech\nsměrech STEJNÉ (amorfní, kovy)\n\nAnizotropní: vlastnosti se podle\nsměru LIŠÍ (monokrystaly, slída)' },
  { front: 'Počet atomů v buňce', back: 'Prostá kubická: 8·1/8 = 1 atom\nProstorově centr. (BCC): +1 = 2 atomy\nPlošně centr. (FCC): +6·1/2 = 4 atomy\n\nVrchol = 1/8, stěna = 1/2, uvnitř = 1' },
  { front: 'Hustota z mřížky', back: 'ρ = (N · Ar · mu) / a³\n\nN = počet atomů/buňku\nmu = 1,66·10⁻²⁷ kg\na = mřížková konstanta (hrana buňky)' },
  { front: 'Normálové napětí', back: 'σ = F / S   [Pa]\n\nF = síla kolmá na průřez\nS = obsah průřezu' },
  { front: 'Relativní prodloužení', back: 'ε = Δl / l₀\n\nΔl = prodloužení\nl₀ = původní délka\nε je bezrozměrné' },
  { front: 'Hookův zákon', back: 'σ = E · ε\n\nE = modul pružnosti v tahu [Pa]\nPlatí jen v PRUŽNÉ oblasti\n(do meze úměrnosti)' },
  { front: 'Meze v grafu σ–ε', back: 'Mez úměrnosti σu → konec Hooke\nMez pružnosti σE → konec vratné def.\nMez pevnosti σp → přetržení\n\nocel: σp ≈ 350–800 MPa' },
  { front: 'Moment síly', back: 'M = F · r = F · d · sin α   [N·m]\n\nr = rameno = KOLMÁ vzdálenost\nosy od přímky síly\nMax při α = 90°, nula při α = 0°' },
  { front: 'Znaménková konvence', back: 'Kladný moment (+):\nproti směru hodinových ručiček\n\nZáporný moment (−):\npo směru hodinových ručiček' },
  { front: 'Momentová věta', back: '∑ M = M₁ + M₂ + … = 0\n\nPáka v rovnováze:\nF₁ · r₁ = F₂ · r₂\n\nStatika: ∑F = 0  A  ∑M = 0' },
  { front: 'Dvojice sil', back: 'Dvě stejné síly opačného směru\nna různých přímkách.\n\nVýslednice = 0 → těleso se neposouvá,\njen ROTUJE.   M = F · d' },
  { front: 'Těžiště', back: 'Působiště výsledné tíhové síly.\n\nx_T = Σ(mᵢ·xᵢ) / Σmᵢ\n\nNižší těžiště + větší podstava\n= stabilnější těleso' },
  { front: 'Rovnovážné polohy', back: 'Stálá: těžiště se zvedá (vrací se)\nVratká: těžiště klesá (převrhne se)\nVolná: těžiště stejně (koule na rovině)' },
  { front: 'Moment setrvačnosti', back: 'J = m · r²   [kg·m²]\n\n„Rotační hmotnost“ — odpor ke\nzměně otáčení.\nAnalogie: m ↔ J' },
  { front: 'Analogie kinematiky', back: 's ↔ φ   (s = φ·r)\nv ↔ ω   (v = ω·r)\na ↔ ε   (at = ε·r)\n\nω = 2π/T = 2π·f' },
  { front: 'Analogie dynamiky', back: 'F ↔ M       a = F/m ↔ ε = M/J\np = mv ↔ L = Jω\nEk = ½mv² ↔ Ek = ½Jω²\n\nZachování: mv = konst ↔ Jω = konst' },
];

/* ═══════════════════════════════════════════════════════════════════
   DATA — VZORCE
   ═══════════════════════════════════════════════════════════════════ */

const FORMULAS = [
  {
    group: 'Pevné látky — mřížka', color: '#06b6d4',
    items: [
      { name: 'Prostá kubická buňka', f: '8 · 1/8 = 1 atom', note: 'částice jen ve vrcholech' },
      { name: 'Prostorově centr. (BCC)', f: '8 · 1/8 + 1 = 2 atomy', note: 'Cr, Na, K, Fe-α' },
      { name: 'Plošně centr. (FCC)', f: '8 · 1/8 + 6 · 1/2 = 4 atomy', note: 'Al, Cu, Ag, Au' },
      { name: 'Hustota z mřížky', f: 'ρ = (N · Ar · mu) / a³', note: 'mu = 1,66·10⁻²⁷ kg' },
    ]
  },
  {
    group: 'Deformace tahem / tlakem', color: '#8b5cf6',
    items: [
      { name: 'Normálové napětí', f: 'σ = F / S', note: '[Pa]; S = π·r² pro drát' },
      { name: 'Relativní prodloužení', f: 'ε = Δl / l₀', note: 'bezrozměrné' },
      { name: 'Hookův zákon', f: 'σ = E · ε', note: 'E = modul pružnosti; jen pružná oblast' },
      { name: 'Prodloužení', f: 'Δl = F·l / (S·E)', note: 'odvozeno z Hooke' },
    ]
  },
  {
    group: 'Moment síly a rovnováha', color: '#ec4899',
    items: [
      { name: 'Moment síly', f: 'M = F · r = F · d · sin α', note: '[N·m]; r = rameno' },
      { name: 'Momentová věta', f: '∑ M = 0', note: 'podmínka rovnováhy otáčení' },
      { name: 'Páka v rovnováze', f: 'F₁ · r₁ = F₂ · r₂', note: 'houpačka, jeřáb' },
      { name: 'Statika tělesa', f: '∑F = 0  a  ∑M = 0', note: 'klid tělesa' },
      { name: 'Dvojice sil', f: 'M = F · d', note: 'd = vzdálenost přímek sil' },
      { name: 'Těžiště soustavy', f: 'x_T = Σ(mᵢ·xᵢ) / Σmᵢ', note: 'působiště tíhové síly' },
    ]
  },
  {
    group: 'Rotace — kinematika', color: '#10b981',
    items: [
      { name: 'Dráha ↔ úhel', f: 's = φ · r', note: 'φ v radiánech' },
      { name: 'Rychlost ↔ úhlová', f: 'v = ω · r', note: 'ω = Δφ/Δt [rad/s]' },
      { name: 'Zrychlení ↔ úhlové', f: 'at = ε · r', note: 'ε = Δω/Δt [rad/s²]' },
      { name: 'Perioda a frekvence', f: 'ω = 2π/T = 2π·f', note: 'f = 1/T [Hz]' },
    ]
  },
  {
    group: 'Rotace — dynamika', color: '#f59e0b',
    items: [
      { name: 'Moment setrvačnosti', f: 'J = m · r²', note: '[kg·m²]; analogie hmotnosti' },
      { name: '2. NZ pro rotaci', f: 'ε = M / J', note: 'analogie a = F/m' },
      { name: 'Moment hybnosti', f: 'L = J · ω', note: 'analogie p = mv' },
      { name: 'Zachování mom. hybnosti', f: 'J · ω = konst.', note: 'krasobruslař' },
      { name: 'Rotační kin. energie', f: 'Ek = ½ · J · ω²', note: 'analogie ½mv²' },
    ]
  },
  {
    group: 'Hodnoty a konstanty', color: '#6b7280',
    items: [
      { name: 'Tíhové zrychlení', f: 'g = 9,81 m/s²', note: 'pro odhad g ≈ 10 m/s²' },
      { name: 'Atomová hmot. konstanta', f: 'mu = 1,66·10⁻²⁷ kg', note: '' },
      { name: 'Mez pevnosti oceli', f: 'σp ≈ 350–800 MPa', note: 'lana až 2000 MPa' },
      { name: 'Vzdálenost částic', f: '≈ 0,2–0,3 nm', note: 'v pevné látce' },
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
  const [openSection, setOpenSection] = useState('struktura');
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
        <div style={{
          position: 'absolute', bottom: 0, left: '-50%', right: '-50%', height: '55%',
          backgroundImage: 'linear-gradient(rgba(6,182,212,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(6,182,212,0.15) 1px,transparent 1px)',
          backgroundSize: '60px 60px',
          animation: 'gridMove 4s linear infinite',
          maskImage: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '28%', left: '50%', transform: 'translateX(-50%)',
          width: '260px', height: '260px', borderRadius: '50%',
          background: 'radial-gradient(circle, #ff6b35 0%, #f7931e 30%, #8b5cf6 60%, transparent 75%)',
          filter: 'blur(2px)', opacity: 0.55, animation: 'sunPulse 5s ease infinite',
        }} />
        {[0,1,2,3,4,5,6].map(i => (
          <div key={i} style={{
            position: 'absolute', bottom: `${28 + i * 2.5}%`, left: '50%', transform: 'translateX(-50%)',
            width: `${260 - i * 25}px`, height: '3px',
            background: '#0a0a1a', opacity: 0.9,
          }} />
        ))}
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
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, #0a0a1a 0%, transparent 30%, transparent 70%, #0a0a1a 100%)' }} />
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px', margin: '0 auto', padding: '24px 16px 60px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontFamily: "'Audiowide', sans-serif", fontSize: 'clamp(20px,4.5vw,32px)', fontWeight: 700, background: 'linear-gradient(135deg, #67e8f9 0%, #a78bfa 50%, #f9a8d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '6px' }}>
            ⚙️ PEVNÉ LÁTKY & TUHÉ TĚLESO
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
            <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.25)', borderRadius: '20px', padding: '4px 12px' }}>🧊 Pevné látky: sekce 1–5</span>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.25)', borderRadius: '20px', padding: '4px 12px' }}>⚙️ Tuhé těleso: sekce 6–12</span>
            </div>
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
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textAlign: 'center', marginBottom: '4px' }}>Zkus nejdřív spočítat sám/sama, pak klikni na řešení. Příklady jsou převzaté z přípravy od profesorky.</p>
            {PROBLEMS.map((prob, idx) => {
              const isOpen = openProblem === idx;
              const diffColor = prob.difficulty.includes('Hard') ? '#ef4444' : prob.difficulty.includes('Medium') ? '#f59e0b' : '#22c55e';
              return (
                <div key={idx} className="problem-card" style={{ ...glass }}>
                  <div style={{ padding: '20px 22px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '10px', flexWrap: 'wrap' }}>
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
                      <div>
                        <div style={{ color: '#06b6d4', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Zadáno</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {prob.given.map((g, i) => (
                            <span key={i} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '4px 10px', fontSize: '13px', fontFamily: "'JetBrains Mono', monospace", color: 'rgba(255,255,255,0.75)' }}>{g}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div style={{ color: '#8b5cf6', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Vzorec</div>
                        <div style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '8px', padding: '10px 14px', fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', color: '#c4b5fd' }}>{prob.formula}</div>
                      </div>
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
            <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {FLASHCARDS.map((_, i) => (
                <div key={i} onClick={() => { setCardIdx(i); setFlipped(false); }}
                  style={{ width: '10px', height: '10px', borderRadius: '50%', cursor: 'pointer', transition: 'background 0.4s ease', background: i === cardIdx ? '#06b6d4' : 'rgba(255,255,255,0.2)' }} />
              ))}
            </div>
            <div className="flip-card" style={{ width: '100%', maxWidth: '560px', height: '280px' }} onClick={() => setFlipped(f => !f)}>
              <div className={`flip-inner${flipped ? ' flipped' : ''}`} style={{ width: '100%', height: '100%' }}>
                <div className="flip-front" style={{ ...glass, position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '28px', borderColor: 'rgba(6,182,212,0.3)' }}>
                  <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Pojem / Zákon</div>
                  <div style={{ color: '#fff', fontSize: '22px', fontWeight: 700, textAlign: 'center', fontFamily: "'Audiowide', sans-serif", lineHeight: 1.4 }}>
                    {FLASHCARDS[cardIdx].front}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px', marginTop: '18px' }}>klikni pro otočení →</div>
                </div>
                <div className="flip-back" style={{ ...glass, position: 'absolute', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'rgba(6,182,212,0.07)', borderColor: 'rgba(6,182,212,0.4)' }}>
                  <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Odpověď</div>
                  <div style={{ color: '#67e8f9', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', textAlign: 'center', lineHeight: 1.9, whiteSpace: 'pre-wrap' }}>
                    {FLASHCARDS[cardIdx].back}
                  </div>
                </div>
              </div>
            </div>
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
