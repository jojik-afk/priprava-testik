// @title Francouzština - Dovolená, srovnání & minulé časy (9. kapitola)
// @subject Languages
// @topic French
// @template practice

import React, { useState, useMemo, useCallback } from 'react';

// ════════════════════════════════════════════════════════════════
// DATA
// ════════════════════════════════════════════════════════════════

const vocabulary = {
  lieux: {
    title: '📍 Les lieux (Místa)',
    color: '#22d3ee',
    words: [
      { fr: 'le champ', cs: 'pole', article: 'le' },
      { fr: 'le chemin', cs: 'cesta', article: 'le' },
      { fr: 'la forêt', cs: 'les', article: 'la' },
      { fr: 'le lac', cs: 'jezero', article: 'le' },
      { fr: 'la plage', cs: 'pláž', article: 'la' },
      { fr: 'la rivière', cs: 'řeka', article: 'la' },
      { fr: 'la montagne', cs: 'hora', article: 'la' },
      { fr: 'la mer', cs: 'moře', article: 'la' },
      { fr: 'la campagne', cs: 'venkov', article: 'la' },
      { fr: 'la ville', cs: 'město', article: 'la' },
      { fr: 'le village', cs: 'vesnice', article: 'le' },
      { fr: 'la maison', cs: 'dům', article: 'la' },
      { fr: 'le ciel', cs: 'nebe', article: 'le' },
      { fr: 'le soleil', cs: 'slunce', article: 'le' },
      { fr: 'le nuage', cs: 'oblak / mrak', article: 'le' },
    ],
  },
  flore: {
    title: '🌳 La flore (Rostliny)',
    color: '#10b981',
    words: [
      { fr: "l'arbre (m.)", cs: 'strom', article: "l'" },
      { fr: 'la fleur', cs: 'květina', article: 'la' },
      { fr: "l'herbe (f.)", cs: 'tráva', article: "l'" },
      { fr: 'la plante', cs: 'rostlina', article: 'la' },
      { fr: 'la feuille', cs: 'list', article: 'la' },
    ],
  },
  animaux: {
    title: '🐴 Les animaux (Zvířata)',
    color: '#f59e0b',
    words: [
      { fr: 'le canard', cs: 'kachna', article: 'le' },
      { fr: 'le chat', cs: 'kočka', article: 'le' },
      { fr: 'le cheval', cs: 'kůň', article: 'le' },
      { fr: 'le chien', cs: 'pes', article: 'le' },
      { fr: 'le lapin', cs: 'králík', article: 'le' },
      { fr: "l'oiseau (m.)", cs: 'pták', article: "l'" },
      { fr: 'le poisson', cs: 'ryba', article: 'le' },
      { fr: 'la poule', cs: 'slepice', article: 'la' },
      { fr: 'la vache', cs: 'kráva', article: 'la' },
    ],
  },
  activites: {
    title: '🏄 Les activités (Aktivity)',
    color: '#a855f7',
    words: [
      { fr: 'faire du bateau', cs: 'plout lodí', article: '' },
      { fr: 'faire de la plongée', cs: 'potápět se', article: '' },
      { fr: 'pique-niquer', cs: 'piknikovat', article: '' },
      { fr: 'faire de la randonnée', cs: 'jít na túru', article: '' },
      { fr: 'faire du cheval', cs: 'jezdit na koni', article: '' },
      { fr: 'se baigner', cs: 'koupat se', article: '' },
      { fr: 'bronzer', cs: 'opalovat se', article: '' },
      { fr: 'nager', cs: 'plavat', article: '' },
      { fr: 'visiter un musée', cs: 'navštívit muzeum', article: '' },
      { fr: 'prendre le bateau', cs: 'jet lodí', article: '' },
      { fr: 'aller à la plage', cs: 'jít na pláž', article: '' },
      { fr: 'se promener', cs: 'procházet se', article: '' },
    ],
  },
  art: {
    title: '🎨 L\'art (Umění)',
    color: '#ec4899',
    words: [
      { fr: 'le musée', cs: 'muzeum', article: 'le' },
      { fr: 'le tableau', cs: 'obraz', article: 'le' },
      { fr: 'le peintre', cs: 'malíř', article: 'le' },
      { fr: "l'artiste (m./f.)", cs: 'umělec/umělkyně', article: "l'" },
      { fr: "l'exposition (f.)", cs: 'výstava', article: "l'" },
      { fr: 'la peinture', cs: 'malba / malování', article: 'la' },
      { fr: 'la sculpture', cs: 'socha / sochařství', article: 'la' },
      { fr: 'le château', cs: 'zámek / hrad', article: 'le' },
      { fr: 'le monument', cs: 'památka', article: 'le' },
      { fr: 'le roman', cs: 'román', article: 'le' },
      { fr: "l'écrivain (m.)", cs: 'spisovatel', article: "l'" },
      { fr: 'la prison', cs: 'vězení', article: 'la' },
    ],
  },
  nationalites: {
    title: '🌍 Les nationalités (Národnosti)',
    color: '#3b82f6',
    words: [
      { fr: 'français / française', cs: 'francouzský/á', article: '' },
      { fr: 'anglais / anglaise', cs: 'anglický/á', article: '' },
      { fr: 'allemand / allemande', cs: 'německý/á', article: '' },
      { fr: 'italien / italienne', cs: 'italský/á', article: '' },
      { fr: 'espagnol / espagnole', cs: 'španělský/á', article: '' },
      { fr: 'américain / américaine', cs: 'americký/á', article: '' },
      { fr: 'tchèque', cs: 'český/á', article: '' },
      { fr: 'belge', cs: 'belgický/á', article: '' },
      { fr: 'suisse', cs: 'švýcarský/á', article: '' },
      { fr: 'portugais / portugaise', cs: 'portugalský/á', article: '' },
      { fr: 'chinois / chinoise', cs: 'čínský/á', article: '' },
      { fr: 'japonais / japonaise', cs: 'japonský/á', article: '' },
    ],
  },
};

// ════════════════════════════════════════════════════════════════
// QUIZ ENGINE (inline copy from base.md spec)
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

function QuizEngine({ questions, accentColor = '#22d3ee' }) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState({});
  const [pendingMulti, setPendingMulti] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [shuffleKey, setShuffleKey] = useState(0);

  const shuffledQuestions = useMemo(() => shuffleQuestions(questions), [questions, shuffleKey]);

  const q = shuffledQuestions[idx];
  const isMulti = q.type === 'multi';
  const isRevealed = !!revealed[idx];
  const myAnswer = answers[idx] || [];
  const isCorrect = isRevealed && arrEqual(myAnswer, q.correct);
  const score = shuffledQuestions.filter((qq, i) => revealed[i] && arrEqual(answers[i] || [], qq.correct)).length;
  const pct = Math.round((score / shuffledQuestions.length) * 100);

  const goTo = useCallback((i) => {
    setIdx(i);
    setPendingMulti(shuffledQuestions[i].type === 'multi' ? (answers[i] || []) : []);
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
    const msg = pct >= 90 ? 'Výborně! Máš to perfektně zvládnuté!'
      : pct >= 70 ? 'Dobře! Téměř máš vše zvládnuté.'
      : pct >= 50 ? 'Mohlo by to být lepší, ale jdeš správným směrem.'
      : 'Potřebuješ více přípravy. Opakuj a bude to!';

    return (
      <div style={S.resultsWrap}>
        <div style={S.resultsCard}>
          <div style={S.resultsScore}>{score} / {shuffledQuestions.length}</div>
          <div style={S.resultsPct}>{pct} %</div>
          <div style={S.resultsMsg}>{msg}</div>
          <button style={{ ...S.btn, background: accentColor + '66', border: `1px solid ${accentColor}` }} onClick={restart}>
            Začít znovu
          </button>
        </div>
      </div>
    );
  }

  const activeSet = isMulti ? (isRevealed ? myAnswer : pendingMulti) : myAnswer;

  return (
    <div style={S.wrap}>
      <div style={S.dotBar}>
        {shuffledQuestions.map((_, i) => {
          let bg = '#4b5563';
          if (i === idx) bg = accentColor;
          else if (revealed[i]) bg = arrEqual(answers[i] || [], shuffledQuestions[i].correct) ? '#22c55e' : '#ef4444';
          return <div key={i} onClick={() => goTo(i)} title={`Otázka ${i + 1}`} style={{ ...S.dot, background: bg }} />;
        })}
      </div>

      <div style={S.card}>
        <div style={S.qNum}>Otázka {idx + 1} / {shuffledQuestions.length}</div>
        <div style={S.qText}>{q.question}</div>

        <div style={S.optionsList}>
          {q.options.map((opt, i) => {
            let border = '1px solid rgba(255,255,255,0.12)';
            let bg = 'rgba(255,255,255,0.04)';
            if (isRevealed) {
              if (q.correct.includes(i)) { bg = 'rgba(34,197,94,0.15)'; border = '1px solid #22c55e'; }
              else if (activeSet.includes(i)) { bg = 'rgba(239,68,68,0.15)'; border = '1px solid #ef4444'; }
            } else if (activeSet.includes(i)) {
              bg = accentColor + '18'; border = `1px solid ${accentColor}`;
            }
            return (
              <div key={i} style={{ ...S.option, background: bg, border }}
                onClick={() => isMulti ? toggleMulti(i) : handleSingleSelect(i)}>
                {isMulti && <span style={S.checkbox}>{activeSet.includes(i) ? '☑' : '☐'}</span>}
                <span>{opt}</span>
              </div>
            );
          })}
        </div>

        {isMulti && !isRevealed && (
          <button style={{ ...S.btn, opacity: pendingMulti.length === 0 ? 0.4 : 1 }}
            onClick={submitMulti} disabled={pendingMulti.length === 0}>
            Potvrdit
          </button>
        )}

        {isRevealed && (
          <div style={{ ...S.feedback, borderColor: isCorrect ? '#22c55e' : '#ef4444' }}>
            <div style={S.feedbackHeader}>{isCorrect ? '✅ Správně!' : '❌ Špatně'}</div>
            {!isCorrect && (
              <div style={S.feedbackCorrect}>
                Správná odpověď: {q.correct.map(i => q.options[i]).join(', ')}
              </div>
            )}
            <div style={S.feedbackExplanation}>{q.explanation}</div>
            {q.tip && <div style={S.feedbackTip}>💡 Tip: {q.tip}</div>}
          </div>
        )}
      </div>

      <div style={S.navRow}>
        <button style={S.btn} onClick={() => goTo(idx - 1)} disabled={idx === 0}>← Předchozí</button>
        {idx < shuffledQuestions.length - 1
          ? <button style={S.btn} onClick={() => goTo(idx + 1)}>Další →</button>
          : <button style={{ ...S.btn, background: accentColor + '55', border: `1px solid ${accentColor}` }} onClick={() => setShowResults(true)}>Výsledky →</button>}
      </div>
    </div>
  );
}

const S = {
  wrap: { display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '680px', margin: '0 auto', padding: '16px' },
  dotBar: { display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' },
  dot: { width: '22px', height: '22px', borderRadius: '50%', cursor: 'pointer', transition: 'background 0.4s ease' },
  card: { background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '24px', transition: 'all 0.4s ease' },
  qNum: { color: 'rgba(255,255,255,0.35)', fontSize: '13px', marginBottom: '6px' },
  qText: { color: '#fff', fontSize: '18px', fontWeight: 600, lineHeight: 1.5, marginBottom: '20px' },
  optionsList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  option: { padding: '12px 16px', borderRadius: '12px', color: '#fff', cursor: 'pointer', transition: 'all 0.4s ease', display: 'flex', alignItems: 'center', gap: '10px', userSelect: 'none', fontSize: '15px' },
  checkbox: { fontSize: '18px', minWidth: '20px', color: 'rgba(255,255,255,0.7)' },
  btn: { marginTop: '12px', padding: '10px 22px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: '#fff', cursor: 'pointer', fontSize: '15px', transition: 'all 0.4s ease' },
  feedback: { marginTop: '20px', padding: '16px', borderRadius: '14px', border: '1px solid', background: 'rgba(255,255,255,0.03)' },
  feedbackHeader: { color: '#fff', fontWeight: 700, fontSize: '16px', marginBottom: '8px' },
  feedbackCorrect: { color: '#86efac', fontSize: '14px', marginBottom: '6px' },
  feedbackExplanation: { color: 'rgba(255,255,255,0.7)', fontSize: '14px', lineHeight: 1.5 },
  feedbackTip: { color: '#fbbf24', fontSize: '13px', marginTop: '8px', fontStyle: 'italic' },
  navRow: { display: 'flex', justifyContent: 'space-between' },
  resultsWrap: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '280px' },
  resultsCard: { textAlign: 'center', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '40px 48px' },
  resultsScore: { color: '#fff', fontSize: '52px', fontWeight: 800, lineHeight: 1.1 },
  resultsPct: { color: 'rgba(255,255,255,0.45)', fontSize: '22px', marginBottom: '16px' },
  resultsMsg: { color: 'rgba(255,255,255,0.8)', fontSize: '17px', lineHeight: 1.5, marginBottom: '24px', maxWidth: '340px', margin: '0 auto 24px' },
};

// ════════════════════════════════════════════════════════════════
// QUIZ QUESTIONS
// ════════════════════════════════════════════════════════════════

const quizQuestions = [
  // Slovní zásoba
  { question: 'Jak se francouzsky řekne „pole"?', type: 'single',
    options: ['le champ', 'le chemin', 'la forêt', 'la plage'],
    correct: [0], explanation: 'le champ = pole. le chemin = cesta, la forêt = les, la plage = pláž.' },
  { question: 'Co znamená „la rivière"?', type: 'single',
    options: ['řeka', 'moře', 'jezero', 'kopec'],
    correct: [0], explanation: 'la rivière = řeka. Pozor: la mer = moře, le lac = jezero.' },
  { question: 'Vyber správný překlad: „pták"', type: 'single',
    options: ['l\'oiseau', 'le poisson', 'le canard', 'la poule'],
    correct: [0], explanation: 'l\'oiseau (m.) = pták. le poisson = ryba, le canard = kachna, la poule = slepice.' },
  { question: 'Které z těchto slov označují zvířata? (vyber všechna)', type: 'multi',
    options: ['le lapin', 'la fleur', 'le cheval', 'le chemin', 'la vache'],
    correct: [0, 2, 4], explanation: 'Zvířata (les animaux): le lapin (králík), le cheval (kůň), la vache (kráva). la fleur = květina, le chemin = cesta.' },
  { question: '„faire de la plongée" znamená:', type: 'single',
    options: ['potápět se', 'jezdit na koni', 'piknikovat', 'opalovat se'],
    correct: [0], explanation: 'faire de la plongée = potápět se. faire du cheval = jezdit na koni, pique-niquer = piknikovat, bronzer = opalovat se.' },

  // Národnosti
  { question: 'Jak se řekne francouzsky „německá" (žena)?', type: 'single',
    options: ['allemande', 'allemand', 'italienne', 'anglaise'],
    correct: [0], explanation: 'allemande = německá. Mužský rod: allemand. Národnosti se píší malým písmenem!' },
  { question: 'Co znamená „une Italienne"?', type: 'single',
    options: ['Italka', 'Ital', 'Italka i Ital', 'Itálie'],
    correct: [0], explanation: 'une Italienne = Italka. Pozor: jako podstatné jméno (osoba) se píše s velkým písmenem.' },

  // Passé composé vs Imparfait
  { question: 'Včera jsem navštívil muzeum: „Hier, j\'_____ le musée."', type: 'single',
    options: ['ai visité', 'visitais', 'vais visiter', 'visite'],
    correct: [0], explanation: 'Konkrétní ukončená činnost v minulosti → passé composé. j\'ai visité (avoir + participe passé).',
    tip: 'Klíčové slovo „Hier" + konkrétní akce → passé composé.' },
  { question: 'Bylo hezky / popisujeme počasí v minulosti: „Il _____ beau."', type: 'single',
    options: ['faisait', 'a fait', 'fait', 'va faire'],
    correct: [0], explanation: 'Popis stavu, počasí, okolností v minulosti → imparfait. il faisait beau = bylo hezky.',
    tip: 'Počasí v minulosti, popis okolností = imparfait.' },
  { question: 'Vyber slovesa, která pro passé composé používají être (vyber všechna):', type: 'multi',
    options: ['aller', 'manger', 'venir', 'visiter', 'arriver'],
    correct: [0, 2, 4], explanation: 'S être se tvoří pohybová slovesa (aller, venir, arriver, partir, monter, descendre, entrer, sortir, rester, tomber, naître, mourir) a zvratná slovesa. manger a visiter → avoir.',
    tip: 'Pamatuj na „dům dr. & paní Vandertramp" — slovesa s être tvoří dům pohybu.' },
  { question: 'Co budu dělat zítra: „Demain, je _____ une randonnée."', type: 'single',
    options: ['vais faire', 'ai fait', 'faisais', 'fais'],
    correct: [0], explanation: 'Blízká budoucnost (futur proche) = aller (v présent) + infinitiv. je vais faire = budu dělat / chystám se dělat.',
    tip: 'Demain + futur proche → aller + infinitiv.' },
  { question: 'Doplň: „Quand j\'étais petit, je _____ souvent au parc." (chodil jsem často do parku)', type: 'single',
    options: ['allais', 'suis allé', 'vais', 'irai'],
    correct: [0], explanation: 'Opakovaná, pravidelná činnost v minulosti → imparfait. „souvent" (často) je signální slovo.',
    tip: 'souvent, toujours, tous les jours, d\'habitude → imparfait.' },

  // Srovnání
  { question: 'Vlak je rychlejší než auto: „Le train est _____ rapide _____ la voiture."', type: 'single',
    options: ['plus / que', 'moins / que', 'aussi / que', 'plus / de'],
    correct: [0], explanation: 'Vyšší míra (+) = plus + adjektivum + que. „rychlejší než" = plus rapide que.' },
  { question: 'Kemping je levnější než hotel: „Le camping est _____ cher _____ l\'hôtel."', type: 'single',
    options: ['moins / que', 'plus / que', 'aussi / que', 'meilleur / que'],
    correct: [0], explanation: 'Nižší míra (–) = moins + adjektivum + que. „levnější" = méně drahý = moins cher.' },
  { question: 'Pozor na výjimku! Tento film je lepší než ten druhý: „Ce film est _____ que l\'autre."', type: 'single',
    options: ['meilleur', 'plus bon', 'plus mieux', 'mieux'],
    correct: [0], explanation: 'plus bon NEEXISTUJE! Výjimka: bon → meilleur. Ce film est meilleur que l\'autre.',
    tip: '+ bon → meilleur (NIKDY „plus bon"!)' },
  { question: 'Jak řekneš „horší"?', type: 'single',
    options: ['pire', 'plus mauvais', 'moins bon', 'plus pire'],
    correct: [0], explanation: 'Výjimka: mauvais → pire (horší). Lze říct i „plus mauvais", ale „pire" je správnější a častější.',
    tip: '+ mauvais → pire (nebo plus mauvais).' },
  { question: 'Dvě věci jsou stejně dobré: použiješ:', type: 'single',
    options: ['aussi ... que', 'plus ... que', 'moins ... que', 'meilleur que'],
    correct: [0], explanation: 'Rovnost (=) = aussi + adjektivum + que. Např. „Mon van est aussi pratique que le van de Léo."' },

  // Mix
  { question: 'Vyber věty s passé composé (vyber všechny):', type: 'multi',
    options: ['J\'ai visité le musée.', 'Il faisait beau.', 'Je suis allé à la plage.', 'Je vais nager.', 'Nous avons mangé.'],
    correct: [0, 2, 4], explanation: 'Passé composé = avoir/être (v présent) + participe passé. „J\'ai visité", „Je suis allé", „Nous avons mangé". „Il faisait" = imparfait, „Je vais nager" = futur proche.' },
  { question: '„Il y a une vache dans le champ" znamená:', type: 'single',
    options: ['Na poli je kráva.', 'Je tam kráva v cestě.', 'Vidím krávu na pláži.', 'Kráva utíká do lesa.'],
    correct: [0], explanation: '„Il y a" = je tam / jsou tam (existence). dans le champ = na poli.',
    tip: '„Il y a..." je perfektní pro popis obrázku!' },
  { question: 'Které z těchto slov NEJSOU pro pláž typická?', type: 'multi',
    options: ['la montagne', 'le sable', 'la forêt', 'la mer', 'le champ'],
    correct: [0, 2, 4], explanation: 'Na pláži: le sable (písek), la mer (moře). Hora, les a pole jsou jinde.' },
];

// ════════════════════════════════════════════════════════════════
// MAIN APP
// ════════════════════════════════════════════════════════════════

export default function App() {
  const [activeTab, setActiveTab] = useState('tahak');

  const tabs = [
    { id: 'tahak', label: '📋 Tahák', component: <TahakTab /> },
    { id: 'slovni', label: '🗣️ Slovíčka', component: <SlovniZasobaTab /> },
    { id: 'casy', label: '⏰ Časy', component: <CasyTab /> },
    { id: 'srovnani', label: '⚖️ Srovnání', component: <SrovnaniTab /> },
    { id: 'obrazek', label: '🖼️ Otázka 1', component: <ObrazekTab /> },
    { id: 'pohlednice', label: '📮 Otázka 2', component: <PohledniceTab /> },
    { id: 'kviz', label: '🎯 Kvíz', component: <QuizEngine questions={quizQuestions} accentColor="#22d3ee" /> },
  ];

  const active = tabs.find(t => t.id === activeTab);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; }
        @keyframes float1 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(40px,-30px) scale(1.1); } }
        @keyframes float2 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-50px,40px) scale(1.15); } }
        @keyframes float3 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(30px,50px) scale(0.9); } }
        @keyframes pulse { 0%,100% { opacity: 0.4; } 50% { opacity: 0.7; } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .tab-content { animation: slideIn 0.5s ease; }
        .bg-circle { position: fixed; border-radius: 50%; filter: blur(80px); pointer-events: none; z-index: 0; }
        .bg-c1 { width: 500px; height: 500px; background: rgba(34,211,238,0.3); top: -100px; left: -100px; animation: float1 18s ease-in-out infinite, pulse 8s ease-in-out infinite; }
        .bg-c2 { width: 600px; height: 600px; background: rgba(168,85,247,0.25); bottom: -150px; right: -150px; animation: float2 22s ease-in-out infinite, pulse 10s ease-in-out infinite; }
        .bg-c3 { width: 400px; height: 400px; background: rgba(251,191,36,0.2); top: 40%; left: 50%; animation: float3 15s ease-in-out infinite, pulse 12s ease-in-out infinite; }
        .glass { background: rgba(255,255,255,0.05); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; transition: all 0.4s ease; }
        .glass:hover { background: rgba(255,255,255,0.08); }
        .tab-btn { padding: 10px 18px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.04); color: #e5e7eb; cursor: pointer; font-weight: 600; transition: all 0.4s ease; font-size: 14px; white-space: nowrap; }
        .tab-btn:hover { background: rgba(255,255,255,0.08); }
        .tab-btn.active { background: rgba(34,211,238,0.25); border-color: #22d3ee; color: #fff; }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#0a0a1a', color: '#e5e7eb', position: 'relative', overflowX: 'hidden' }}>
        <div className="bg-circle bg-c1" />
        <div className="bg-circle bg-c2" />
        <div className="bg-circle bg-c3" />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1100px', margin: '0 auto', padding: '32px 20px' }}>
          <header style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ fontSize: '13px', letterSpacing: '0.3em', color: '#22d3ee', fontWeight: 700, marginBottom: '8px' }}>
              UNITÉ 9 · FRANÇAIS
            </div>
            <h1 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
              🇫🇷 Dovolená, srovnání & minulé časy
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px' }}>
              Kompletní příprava na test — slovíčka, gramatika, vzory a kvíz
            </p>
          </header>

          <nav style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '28px' }}>
            {tabs.map(t => (
              <button key={t.id} className={`tab-btn ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
                {t.label}
              </button>
            ))}
          </nav>

          <main className="tab-content" key={activeTab}>
            {active.component}
          </main>

          <footer style={{ textAlign: 'center', marginTop: '40px', color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>
            Bon courage pour ton test ! 🍀
          </footer>
        </div>
      </div>
    </>
  );
}

// ════════════════════════════════════════════════════════════════
// TAB: TAHÁK (Cheat sheet)
// ════════════════════════════════════════════════════════════════

function TahakTab() {
  const Box = ({ title, color, children }) => (
    <div className="glass" style={{ padding: '20px', borderLeft: `4px solid ${color}` }}>
      <h3 style={{ color, fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>{title}</h3>
      {children}
    </div>
  );

  const codeStyle = { fontFamily: 'JetBrains Mono, monospace', background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px', color: '#fff' };

  return (
    <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
      <Box title="📮 PASSÉ COMPOSÉ (minulý čas složený)" color="#22d3ee">
        <p style={{ marginBottom: '10px', color: 'rgba(255,255,255,0.8)' }}>
          <strong>Tvoření:</strong> avoir / être (v présent) + <em>participe passé</em>
        </p>
        <div style={{ ...codeStyle, display: 'block', marginBottom: '10px' }}>
          J'ai visité · Tu as mangé · Il a fini<br/>
          Je suis allé(e) · Elle est arrivée
        </div>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)' }}>
          <strong>Použití:</strong> konkrétní ukončená akce v minulosti.
        </p>
        <p style={{ fontSize: '13px', color: '#fbbf24', marginTop: '8px' }}>
          🔑 Signální slova: <em>hier, ce matin, soudain, une fois, ensuite</em>
        </p>
      </Box>

      <Box title={'🕰️ IMPARFAIT (minulý čas „jednoduchý")'} color="#a855f7">
        <p style={{ marginBottom: '10px', color: 'rgba(255,255,255,0.8)' }}>
          <strong>Tvoření:</strong> kmen z „nous" v présent + koncovky <span style={codeStyle}>-ais, -ais, -ait, -ions, -iez, -aient</span>
        </p>
        <div style={{ ...codeStyle, display: 'block', marginBottom: '10px' }}>
          parler → nous parl-ons → je parl<strong>ais</strong><br/>
          être (výjimka) → j'<strong>étais</strong>, tu étais, il était...
        </div>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)' }}>
          <strong>Použití:</strong> popis (počasí, vzhled, pocity), opakování, neukončený stav.
        </p>
        <p style={{ fontSize: '13px', color: '#fbbf24', marginTop: '8px' }}>
          🔑 Signální slova: <em>souvent, toujours, tous les jours, d'habitude, quand j'étais petit</em>
        </p>
      </Box>

      <Box title="🚀 FUTUR PROCHE (blízká budoucnost)" color="#10b981">
        <p style={{ marginBottom: '10px', color: 'rgba(255,255,255,0.8)' }}>
          <strong>Tvoření:</strong> aller (v présent) + infinitiv
        </p>
        <div style={{ ...codeStyle, display: 'block', marginBottom: '10px' }}>
          Je <strong>vais</strong> faire · Tu <strong>vas</strong> manger<br/>
          Il <strong>va</strong> visiter · Nous <strong>allons</strong> partir
        </div>
        <p style={{ fontSize: '13px', color: '#fbbf24', marginTop: '8px' }}>
          🔑 Signální slova: <em>demain, ce soir, la semaine prochaine, dans 2 jours</em>
        </p>
      </Box>

      <Box title="⚖️ SROVNÁNÍ (Comparaison)" color="#ec4899">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
          <div><span style={{ ...codeStyle, color: '#22c55e' }}>+ plus</span> + adj. + <span style={codeStyle}>que</span> = více</div>
          <div><span style={{ ...codeStyle, color: '#ef4444' }}>– moins</span> + adj. + <span style={codeStyle}>que</span> = méně</div>
          <div><span style={{ ...codeStyle, color: '#3b82f6' }}>= aussi</span> + adj. + <span style={codeStyle}>que</span> = stejně</div>
        </div>
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', padding: '10px', borderRadius: '8px' }}>
          <strong style={{ color: '#fca5a5' }}>⚠️ Výjimky:</strong>
          <div style={{ fontSize: '14px', marginTop: '4px' }}>
            + bon → <span style={codeStyle}>meilleur</span> (lepší)<br/>
            + mauvais → <span style={codeStyle}>pire</span> (horší)
          </div>
        </div>
      </Box>

      <Box title="🖼️ POPIS OBRÁZKU (Il y a...)" color="#f59e0b">
        <p style={{ marginBottom: '10px', color: 'rgba(255,255,255,0.8)' }}>
          Pro otázku 1 použij <strong>„Il y a..."</strong> = „Je tam..."
        </p>
        <div style={{ ...codeStyle, display: 'block', marginBottom: '10px' }}>
          Il y a une montagne.<br/>
          Il y a des arbres.<br/>
          Il y a une maison.<br/>
          Il y a un chemin.<br/>
          Il y a un ciel bleu.
        </div>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)' }}>
          <strong>Pozor na členy:</strong> un (m.) / une (f.) / des (mn.č.)
        </p>
      </Box>

      <Box title="📮 STRUKTURA POHLEDNICE" color="#3b82f6">
        <ol style={{ paddingLeft: '20px', fontSize: '14px', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)' }}>
          <li><strong>Pozdrav:</strong> Salut Mehdi !</li>
          <li><strong>Kde jsem (présent):</strong> Je suis en vacances à...</li>
          <li><strong>Včera (passé composé/imparfait):</strong> Hier, il faisait beau / j'ai visité...</li>
          <li><strong>Dnes (présent + passé composé):</strong> Aujourd'hui, je vais à... / j'ai pris...</li>
          <li><strong>Zítra (futur proche):</strong> Demain, je vais faire...</li>
          <li><strong>Závěr:</strong> À bientôt, [Tvé jméno]</li>
        </ol>
      </Box>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// TAB: SLOVÍČKA (Vocabulary with flashcards)
// ════════════════════════════════════════════════════════════════

function SlovniZasobaTab() {
  const [category, setCategory] = useState('lieux');
  const [mode, setMode] = useState('list'); // list | flashcards
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const cat = vocabulary[category];

  const next = () => { setCardIdx((cardIdx + 1) % cat.words.length); setFlipped(false); };
  const prev = () => { setCardIdx((cardIdx - 1 + cat.words.length) % cat.words.length); setFlipped(false); };

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
        {Object.entries(vocabulary).map(([key, c]) => (
          <button key={key} onClick={() => { setCategory(key); setCardIdx(0); setFlipped(false); }}
            style={{
              padding: '8px 14px', borderRadius: '999px', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
              border: `1px solid ${category === key ? c.color : 'rgba(255,255,255,0.12)'}`,
              background: category === key ? c.color + '25' : 'rgba(255,255,255,0.04)',
              color: '#fff', transition: 'all 0.4s ease',
            }}>
            {c.title}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '20px' }}>
        <button onClick={() => setMode('list')} style={modeBtnStyle(mode === 'list', cat.color)}>📋 Seznam</button>
        <button onClick={() => setMode('flashcards')} style={modeBtnStyle(mode === 'flashcards', cat.color)}>🎴 Kartičky</button>
      </div>

      {mode === 'list' ? (
        <div className="glass" style={{ padding: '24px' }}>
          <h3 style={{ color: cat.color, fontSize: '20px', marginBottom: '16px' }}>{cat.title}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px' }}>
            {cat.words.map((w, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: '#fff' }}>{w.fr}</span>
                <span style={{ color: 'rgba(255,255,255,0.6)' }}>{w.cs}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div onClick={() => setFlipped(!flipped)} style={{
            background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: `2px solid ${cat.color}55`,
            borderRadius: '24px', padding: '60px 30px', textAlign: 'center', cursor: 'pointer', minHeight: '220px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', transition: 'all 0.4s ease',
          }}>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '12px', letterSpacing: '0.2em' }}>
              {flipped ? 'ČESKY' : 'FRANCOUZSKY'}
            </div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#fff', fontFamily: flipped ? 'Inter' : 'JetBrains Mono, monospace' }}>
              {flipped ? cat.words[cardIdx].cs : cat.words[cardIdx].fr}
            </div>
            <div style={{ marginTop: '20px', fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
              (klikni pro otočení)
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
            <button onClick={prev} style={navBtnStyle}>← Předchozí</button>
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>{cardIdx + 1} / {cat.words.length}</span>
            <button onClick={next} style={navBtnStyle}>Další →</button>
          </div>
        </div>
      )}
    </div>
  );
}

const modeBtnStyle = (active, color) => ({
  padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 600,
  border: `1px solid ${active ? color : 'rgba(255,255,255,0.12)'}`,
  background: active ? color + '25' : 'rgba(255,255,255,0.04)',
  color: '#fff', transition: 'all 0.4s ease',
});

const navBtnStyle = {
  padding: '10px 18px', borderRadius: '10px', cursor: 'pointer', fontSize: '14px',
  border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', color: '#fff',
  transition: 'all 0.4s ease',
};

// ════════════════════════════════════════════════════════════════
// TAB: ČASY (Tenses)
// ════════════════════════════════════════════════════════════════

function CasyTab() {
  const [openSection, setOpenSection] = useState('pc');
  const code = { fontFamily: 'JetBrains Mono, monospace', background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px', color: '#fff' };

  const Section = ({ id, title, color, children }) => (
    <div className="glass" style={{ padding: '0', overflow: 'hidden' }}>
      <button onClick={() => setOpenSection(openSection === id ? null : id)}
        style={{ width: '100%', padding: '18px 24px', background: 'transparent', border: 'none', color: '#fff', textAlign: 'left', cursor: 'pointer', fontSize: '18px', fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color }}>{title}</span>
        <span>{openSection === id ? '−' : '+'}</span>
      </button>
      {openSection === id && (
        <div style={{ padding: '0 24px 24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ paddingTop: '18px' }}>{children}</div>
        </div>
      )}
    </div>
  );

  const ConjTable = ({ data }) => (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'JetBrains Mono, monospace', fontSize: '14px', marginTop: '10px' }}>
      <tbody>
        {data.map(([p, f], i) => (
          <tr key={i} style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent' }}>
            <td style={{ padding: '8px 12px', color: 'rgba(255,255,255,0.5)', width: '40%' }}>{p}</td>
            <td style={{ padding: '8px 12px', color: '#fff', fontWeight: 600 }}>{f}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <Section id="pc" title="📮 PASSÉ COMPOSÉ — minulý čas složený" color="#22d3ee">
        <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '12px' }}>
          Vyjadřuje <strong>ukončenou jednorázovou akci v minulosti</strong>. Tvoří se pomocí pomocného slovesa <span style={code}>avoir</span> nebo <span style={code}>être</span> v présent + <strong>participe passé</strong> (příčestí minulé).
        </p>

        <h4 style={{ color: '#22d3ee', marginTop: '14px', marginBottom: '6px' }}>🔧 Tvorba participe passé:</h4>
        <ul style={{ paddingLeft: '20px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.8 }}>
          <li>slovesa na <span style={code}>-er</span> → <span style={code}>-é</span> (parler → parlé, manger → mangé)</li>
          <li>slovesa na <span style={code}>-ir</span> → <span style={code}>-i</span> (finir → fini, choisir → choisi)</li>
          <li>slovesa na <span style={code}>-re</span> → <span style={code}>-u</span> (vendre → vendu, attendre → attendu)</li>
          <li><strong>Nepravidelná:</strong> avoir → eu, être → été, faire → fait, prendre → pris, voir → vu, mettre → mis, dire → dit, écrire → écrit, lire → lu, ouvrir → ouvert</li>
        </ul>

        <h4 style={{ color: '#22d3ee', marginTop: '14px', marginBottom: '6px' }}>Příklad s avoir — visiter (navštívit):</h4>
        <ConjTable data={[
          ['j\'', 'ai visité'], ['tu', 'as visité'], ['il/elle', 'a visité'],
          ['nous', 'avons visité'], ['vous', 'avez visité'], ['ils/elles', 'ont visité'],
        ]} />

        <h4 style={{ color: '#22d3ee', marginTop: '14px', marginBottom: '6px' }}>Příklad s être — aller (jít):</h4>
        <ConjTable data={[
          ['je', 'suis allé(e)'], ['tu', 'es allé(e)'], ['il', 'est allé'], ['elle', 'est allée'],
          ['nous', 'sommes allé(e)s'], ['vous', 'êtes allé(e)(s)'], ['ils', 'sont allés'], ['elles', 'sont allées'],
        ]} />

        <div style={{ marginTop: '14px', padding: '12px', background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.3)', borderRadius: '8px' }}>
          <strong style={{ color: '#67e8f9' }}>🔑 Slovesa s ÊTRE (DR & MRS VANDERTRAMP):</strong>
          <p style={{ marginTop: '6px', fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
            <strong>D</strong>evenir, <strong>R</strong>evenir, <strong>M</strong>onter, <strong>R</strong>ester, <strong>S</strong>ortir,
            <strong> V</strong>enir, <strong>A</strong>ller, <strong>N</strong>aître, <strong>D</strong>escendre, <strong>E</strong>ntrer,
            <strong> R</strong>entrer, <strong>T</strong>omber, <strong>R</strong>etourner, <strong>A</strong>rriver, <strong>M</strong>ourir, <strong>P</strong>artir.
            <br/>+ všechna <strong>zvratná slovesa</strong> (se laver, se baigner...).
          </p>
          <p style={{ marginTop: '8px', fontSize: '13px', color: '#fbbf24' }}>
            ⚠️ Se slovesy s ÊTRE se participe shoduje v rodě a čísle s podmětem!<br/>
            Elle est allée. Ils sont arrivés. Elles sont parties.
          </p>
        </div>
      </Section>

      <Section id="imp" title={'🕰️ IMPARFAIT — minulý čas „jednoduchý"'} color="#a855f7">
        <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '12px' }}>
          Tvoří se z <strong>kmene 1. os. mn. č. (nous) v présent</strong> + koncovky <span style={code}>-ais, -ais, -ait, -ions, -iez, -aient</span>.
        </p>

        <h4 style={{ color: '#a855f7', marginTop: '14px', marginBottom: '6px' }}>Příklad — parler (mluvit):</h4>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>
          nous <strong>parl</strong>-ons → kmen <span style={code}>parl-</span>
        </p>
        <ConjTable data={[
          ['je', 'parlais'], ['tu', 'parlais'], ['il/elle', 'parlait'],
          ['nous', 'parlions'], ['vous', 'parliez'], ['ils/elles', 'parlaient'],
        ]} />

        <h4 style={{ color: '#a855f7', marginTop: '14px', marginBottom: '6px' }}>Výjimka — être (jediná!):</h4>
        <ConjTable data={[
          ['j\'', 'étais'], ['tu', 'étais'], ['il/elle', 'était'],
          ['nous', 'étions'], ['vous', 'étiez'], ['ils/elles', 'étaient'],
        ]} />

        <h4 style={{ color: '#a855f7', marginTop: '14px', marginBottom: '6px' }}>Užitečná slovesa v imparfait:</h4>
        <ul style={{ paddingLeft: '20px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.8 }}>
          <li>il <strong>faisait</strong> beau / chaud / froid (počasí)</li>
          <li>il y <strong>avait</strong> des nuages / du soleil</li>
          <li>c'<strong>était</strong> intéressant / génial</li>
          <li>je <strong>voulais</strong>, je <strong>pouvais</strong>, je <strong>savais</strong></li>
        </ul>

        <div style={{ marginTop: '14px', padding: '12px', background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: '8px' }}>
          <strong style={{ color: '#d8b4fe' }}>📝 Použití imparfait:</strong>
          <ul style={{ marginTop: '6px', paddingLeft: '20px', fontSize: '14px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>
            <li><strong>Popis</strong> (počasí, vzhled, místo, pocity): <em>Il faisait beau. C'était joli.</em></li>
            <li><strong>Opakovaná činnost</strong>: <em>Tous les jours, je nageais.</em></li>
            <li><strong>Neukončený stav</strong>: <em>Quand j'étais petit, j'habitais à Paris.</em></li>
          </ul>
        </div>
      </Section>

      <Section id="vs" title="⚔️ PASSÉ COMPOSÉ vs. IMPARFAIT" color="#fbbf24">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
          <div style={{ padding: '14px', background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.3)', borderRadius: '12px' }}>
            <h4 style={{ color: '#67e8f9', marginBottom: '8px' }}>PASSÉ COMPOSÉ</h4>
            <ul style={{ paddingLeft: '20px', fontSize: '14px', lineHeight: 1.7, color: 'rgba(255,255,255,0.8)' }}>
              <li>Co se stalo? (akce)</li>
              <li>Jednorázová, ukončená</li>
              <li>Posloupnost událostí</li>
              <li>Hier, soudain, ce matin, une fois</li>
            </ul>
            <p style={{ marginTop: '8px', fontSize: '13px', color: '#fff', fontStyle: 'italic' }}>
              Hier, j'ai visité le château.
            </p>
          </div>
          <div style={{ padding: '14px', background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: '12px' }}>
            <h4 style={{ color: '#d8b4fe', marginBottom: '8px' }}>IMPARFAIT</h4>
            <ul style={{ paddingLeft: '20px', fontSize: '14px', lineHeight: 1.7, color: 'rgba(255,255,255,0.8)' }}>
              <li>Jaké to bylo? (popis)</li>
              <li>Stav, okolnosti, počasí</li>
              <li>Opakování, zvyk</li>
              <li>Souvent, toujours, tous les jours</li>
            </ul>
            <p style={{ marginTop: '8px', fontSize: '13px', color: '#fff', fontStyle: 'italic' }}>
              Il faisait beau. C'était génial.
            </p>
          </div>
        </div>

        <div style={{ marginTop: '14px', padding: '14px', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.3)', borderRadius: '12px' }}>
          <strong style={{ color: '#fcd34d' }}>💡 Klasické spojení obou:</strong>
          <p style={{ marginTop: '6px', fontSize: '14px', color: 'rgba(255,255,255,0.85)', fontStyle: 'italic' }}>
            „Il <span style={{ color: '#d8b4fe' }}>faisait</span> beau quand j'<span style={{ color: '#67e8f9' }}>ai visité</span> le musée."<br/>
            (kulisa = imparfait, akce = passé composé)
          </p>
        </div>
      </Section>

      <Section id="fp" title="🚀 FUTUR PROCHE — blízká budoucnost" color="#10b981">
        <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '12px' }}>
          Tvoří se: sloveso <span style={code}>aller</span> v présent + <strong>infinitiv</strong>.
        </p>
        <ConjTable data={[
          ['je vais', 'faire / manger / visiter'], ['tu vas', 'partir / nager'], ['il/elle va', 'venir / arriver'],
          ['nous allons', 'voir / prendre'], ['vous allez', 'sortir'], ['ils/elles vont', 'dormir'],
        ]} />
        <div style={{ marginTop: '14px', padding: '12px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px' }}>
          <strong style={{ color: '#6ee7b7' }}>Příklady:</strong>
          <ul style={{ marginTop: '6px', paddingLeft: '20px', fontSize: '14px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7 }}>
            <li>Demain, je <strong>vais faire</strong> une randonnée.</li>
            <li>Ce soir, nous <strong>allons pique-niquer</strong>.</li>
            <li>La semaine prochaine, ils <strong>vont visiter</strong> Paris.</li>
          </ul>
        </div>
      </Section>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// TAB: SROVNÁNÍ (Comparison)
// ════════════════════════════════════════════════════════════════

function SrovnaniTab() {
  const code = { fontFamily: 'JetBrains Mono, monospace', background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px', color: '#fff' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="glass" style={{ padding: '24px' }}>
        <h3 style={{ color: '#ec4899', fontSize: '22px', marginBottom: '12px' }}>⚖️ La comparaison — Pravidlo</h3>
        <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '14px', lineHeight: 1.6 }}>
          Pro srovnání věcí, osob nebo míst používáme komparativy <strong>moins</strong>, <strong>aussi</strong> a <strong>plus</strong>.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginTop: '16px' }}>
          <div style={{ padding: '16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '6px' }}>➖</div>
            <div style={{ ...code, fontSize: '15px', display: 'inline-block', marginBottom: '8px' }}>moins + adj. + que</div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>(méně než)</div>
          </div>
          <div style={{ padding: '16px', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '6px' }}>🟰</div>
            <div style={{ ...code, fontSize: '15px', display: 'inline-block', marginBottom: '8px' }}>aussi + adj. + que</div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>(stejně jako)</div>
          </div>
          <div style={{ padding: '16px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '6px' }}>➕</div>
            <div style={{ ...code, fontSize: '15px', display: 'inline-block', marginBottom: '8px' }}>plus + adj. + que</div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>(více než)</div>
          </div>
        </div>
      </div>

      <div className="glass" style={{ padding: '24px' }}>
        <h3 style={{ color: '#ec4899', fontSize: '20px', marginBottom: '12px' }}>📝 Příklady (z učebnice)</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { sign: '+', sentence: 'Le vélo est plus écologique que la voiture.', cs: 'Kolo je ekologičtější než auto.', color: '#22c55e' },
            { sign: '=', sentence: 'Ces logements sont aussi confortables que des locations.', cs: 'Toto ubytování je stejně pohodlné jako pronájmy.', color: '#3b82f6' },
            { sign: '−', sentence: 'Les chambres avec vue sur rue sont moins chères que les chambres avec vue sur la mer.', cs: 'Pokoje s výhledem do ulice jsou levnější než pokoje s výhledem na moře.', color: '#ef4444' },
            { sign: '+', sentence: 'La cuisine est meilleure au « Bistrot de la mer » que « Chez Albert ».', cs: 'Kuchyně je lepší v „Bistrotu u moře" než „U Alberta".', color: '#22c55e' },
            { sign: '+', sentence: 'L\'avion est plus rapide que le train.', cs: 'Letadlo je rychlejší než vlak.', color: '#22c55e' },
            { sign: '−', sentence: 'Une chambre simple est moins grande qu\'une chambre double.', cs: 'Jednolůžkový pokoj je menší než dvoulůžkový.', color: '#ef4444' },
            { sign: '=', sentence: 'Les vacances à la mer sont aussi agréables que les vacances à la montagne.', cs: 'Dovolená u moře je stejně příjemná jako dovolená na horách.', color: '#3b82f6' },
          ].map((e, i) => (
            <div key={i} style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderLeft: `3px solid ${e.color}`, borderRadius: '6px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ color: e.color, fontWeight: 700, fontSize: '18px' }}>{e.sign}</span>
                <span style={{ color: '#fff', fontStyle: 'italic' }}>{e.sentence}</span>
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', marginLeft: '24px' }}>{e.cs}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass" style={{ padding: '24px', background: 'rgba(239,68,68,0.05)', borderColor: 'rgba(239,68,68,0.3)' }}>
        <h3 style={{ color: '#fca5a5', fontSize: '20px', marginBottom: '12px' }}>⚠️ Pozor — Výjimky!</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          <div style={{ padding: '14px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px' }}>
            <div style={{ fontSize: '15px', marginBottom: '8px' }}>
              <span style={{ color: '#22c55e', fontWeight: 700 }}>+ bon</span> → <span style={{ ...code, color: '#fbbf24', fontSize: '16px' }}>meilleur(e)</span>
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>
              <strong>NIKDY</strong> neříkej „plus bon"! Vždy <strong>meilleur</strong> (lepší).
            </div>
            <div style={{ marginTop: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.85)' }}>
              Ce gâteau est <strong>meilleur</strong> que l'autre.
            </div>
          </div>
          <div style={{ padding: '14px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px' }}>
            <div style={{ fontSize: '15px', marginBottom: '8px' }}>
              <span style={{ color: '#22c55e', fontWeight: 700 }}>+ mauvais</span> → <span style={{ ...code, color: '#fbbf24', fontSize: '16px' }}>pire</span>
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>
              Lze i „plus mauvais", ale <strong>pire</strong> (horší) je správnější.
            </div>
            <div style={{ marginTop: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.85)' }}>
              Le film est <strong>pire</strong> que le livre.
            </div>
          </div>
        </div>
        <div style={{ marginTop: '14px', padding: '10px', background: 'rgba(251,191,36,0.08)', borderRadius: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.85)' }}>
          💡 <strong>meilleur</strong> se shoduje v rodě a čísle: meilleur, meilleur<strong>e</strong>, meilleur<strong>s</strong>, meilleur<strong>es</strong>.
        </div>
      </div>

      <div className="glass" style={{ padding: '24px' }}>
        <h3 style={{ color: '#ec4899', fontSize: '20px', marginBottom: '12px' }}>🎯 Procvič si — doplň</h3>
        <Procvicovani />
      </div>
    </div>
  );
}

function Procvicovani() {
  const exercises = [
    { q: 'Le train est ___ rapide ___ l\'avion. (–)', a: 'moins ... que', hint: 'méně rychlý než' },
    { q: 'Mon van est ___ pratique ___ le van de Léo. (=)', a: 'aussi ... que', hint: 'stejně praktický jako' },
    { q: 'La voiture est ___ confortable ___ le train. (+)', a: 'plus ... que', hint: 'více pohodlné než' },
    { q: 'Ce restaurant est ___ que l\'autre. (+ bon)', a: 'meilleur', hint: 'pozor, výjimka!' },
    { q: 'Cette pizza est ___ que celle d\'hier. (+ mauvais)', a: 'pire', hint: 'výjimka pro mauvais' },
    { q: 'Les vacances à la mer sont ___ agréables ___ à la montagne. (=)', a: 'aussi ... que', hint: 'stejně příjemné jako' },
  ];
  const [shown, setShown] = useState({});

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {exercises.map((e, i) => (
        <div key={i} style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
          <div style={{ color: '#fff', marginBottom: '6px' }}>{i + 1}. {e.q}</div>
          <button onClick={() => setShown({ ...shown, [i]: !shown[i] })}
            style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(236,72,153,0.4)', background: 'rgba(236,72,153,0.1)', color: '#fbcfe8', cursor: 'pointer', fontSize: '13px' }}>
            {shown[i] ? 'Skrýt' : 'Ukázat řešení'}
          </button>
          {shown[i] && (
            <div style={{ marginTop: '8px', padding: '8px 12px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '6px' }}>
              <div style={{ color: '#86efac', fontWeight: 600 }}>{e.a}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>{e.hint}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// TAB: OBRÁZEK (Question 1 — Image description)
// ════════════════════════════════════════════════════════════════

function ObrazekTab() {
  const code = { fontFamily: 'JetBrains Mono, monospace', background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px', color: '#fff' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="glass" style={{ padding: '24px' }}>
        <h3 style={{ color: '#f59e0b', fontSize: '22px', marginBottom: '12px' }}>🖼️ Otázka 1: Napiš 5 věcí, co vidíš</h3>
        <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '14px', lineHeight: 1.6 }}>
          Pro popis použij konstrukci <span style={code}>Il y a + člen + podstatné jméno</span> = „Je tam...".
        </p>
        <div style={{ padding: '14px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '10px' }}>
          <strong style={{ color: '#fcd34d' }}>📐 Vzorec:</strong>
          <div style={{ marginTop: '8px', fontFamily: 'JetBrains Mono, monospace', fontSize: '16px', color: '#fff' }}>
            Il y a <span style={{ color: '#22d3ee' }}>un</span> / <span style={{ color: '#ec4899' }}>une</span> / <span style={{ color: '#a855f7' }}>des</span> + podstatné jméno.
          </div>
          <div style={{ marginTop: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
            <span style={{ color: '#22d3ee' }}>un</span> = mužský rod (un arbre, un cheval) ·{' '}
            <span style={{ color: '#ec4899' }}>une</span> = ženský rod (une maison, une vache) ·{' '}
            <span style={{ color: '#a855f7' }}>des</span> = množné číslo (des arbres, des nuages)
          </div>
        </div>
      </div>

      <div className="glass" style={{ padding: '24px' }}>
        <h3 style={{ color: '#f59e0b', fontSize: '20px', marginBottom: '12px' }}>✏️ Vzorová odpověď (krajina s horou, stromy, domem, cestou, nebem)</h3>
        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '18px', borderRadius: '10px', fontFamily: 'JetBrains Mono, monospace', fontSize: '15px', lineHeight: 1.9, color: '#fff' }}>
          <div>1. Il y a <span style={{ color: '#ec4899' }}>une</span> montagne.</div>
          <div>2. Il y a <span style={{ color: '#a855f7' }}>des</span> arbres.</div>
          <div>3. Il y a <span style={{ color: '#ec4899' }}>une</span> maison <em style={{ color: 'rgba(255,255,255,0.6)' }}>/ une ferme</em>.</div>
          <div>4. Il y a <span style={{ color: '#22d3ee' }}>un</span> chemin.</div>
          <div>5. Il y a <span style={{ color: '#22d3ee' }}>un</span> ciel bleu <em style={{ color: 'rgba(255,255,255,0.6)' }}>/ des nuages</em>.</div>
        </div>

        <p style={{ marginTop: '14px', color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
          ✨ <strong>Tip pro vyšší známku:</strong> přidej barvu nebo adjektivum:
        </p>
        <ul style={{ marginTop: '6px', paddingLeft: '20px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, fontSize: '14px' }}>
          <li>Il y a une <strong>grande</strong> montagne.</li>
          <li>Il y a des arbres <strong>verts</strong>.</li>
          <li>Il y a une <strong>petite</strong> maison <strong>blanche</strong>.</li>
          <li>Il y a un ciel <strong>bleu</strong> avec des nuages <strong>blancs</strong>.</li>
        </ul>
      </div>

      <div className="glass" style={{ padding: '24px' }}>
        <h3 style={{ color: '#f59e0b', fontSize: '20px', marginBottom: '12px' }}>📚 Užitečná slovní zásoba pro popis krajiny</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          {[
            { fr: 'la montagne', cs: 'hora', g: 'une' },
            { fr: 'l\'arbre (m.)', cs: 'strom', g: 'un' },
            { fr: 'la maison', cs: 'dům', g: 'une' },
            { fr: 'la ferme', cs: 'statek / farma', g: 'une' },
            { fr: 'le chemin', cs: 'cesta', g: 'un' },
            { fr: 'le ciel', cs: 'nebe', g: 'un' },
            { fr: 'le nuage', cs: 'mrak', g: 'un' },
            { fr: 'le soleil', cs: 'slunce', g: 'un' },
            { fr: 'la forêt', cs: 'les', g: 'une' },
            { fr: 'le champ', cs: 'pole', g: 'un' },
            { fr: 'la rivière', cs: 'řeka', g: 'une' },
            { fr: 'l\'herbe (f.)', cs: 'tráva', g: 'une' },
            { fr: 'la fleur', cs: 'květina', g: 'une' },
            { fr: 'le lac', cs: 'jezero', g: 'un' },
          ].map((w, i) => (
            <div key={i} style={{ padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff', fontWeight: 600 }}>
                <span style={{ color: w.g === 'un' ? '#22d3ee' : '#ec4899' }}>{w.g}</span> {w.fr.replace(/^(le |la |l')/, '')}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', marginTop: '2px' }}>{w.cs}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass" style={{ padding: '24px', background: 'rgba(245,158,11,0.05)' }}>
        <h3 style={{ color: '#fcd34d', fontSize: '18px', marginBottom: '10px' }}>💪 Procvič: napiš 5 vět k libovolnému obrázku</h3>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '10px' }}>Představ si pláž a napiš si v hlavě/na papír:</p>
        <details style={{ padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', cursor: 'pointer' }}>
          <summary style={{ color: '#fcd34d', fontWeight: 600 }}>Ukázat řešení (pláž)</summary>
          <div style={{ marginTop: '10px', fontFamily: 'JetBrains Mono, monospace', fontSize: '14px', color: '#fff', lineHeight: 1.8 }}>
            1. Il y a une plage.<br/>
            2. Il y a la mer.<br/>
            3. Il y a du sable.<br/>
            4. Il y a un parasol.<br/>
            5. Il y a des gens (lidé) qui se baignent.
          </div>
        </details>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// TAB: POHLEDNICE (Question 2 — Postcard)
// ════════════════════════════════════════════════════════════════

function PohledniceTab() {
  const [step, setStep] = useState(null);
  const code = { fontFamily: 'JetBrains Mono, monospace', background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px', color: '#fff' };

  const steps = [
    {
      id: 1, title: '1️⃣ Pozdrav', color: '#3b82f6',
      content: <>
        <p>Začni jednoduše:</p>
        <div style={{ ...code, display: 'block', marginTop: '8px', fontSize: '15px' }}>Salut [jméno] !</div>
        <p style={{ marginTop: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Méně formální: Coucou ! / Cher Marc / Chère Marie</p>
      </>,
    },
    {
      id: 2, title: '2️⃣ Kde jsi (présent)', color: '#22d3ee',
      content: <>
        <p>Řekni, kde jsi a jak se máš:</p>
        <div style={{ ...code, display: 'block', marginTop: '8px', fontSize: '14px', lineHeight: 1.7 }}>
          Je suis en vacances à [město] / chez des amis.<br/>
          C'est génial / super / magnifique !<br/>
          Je m'amuse beaucoup.
        </div>
      </>,
    },
    {
      id: 3, title: '3️⃣ Včera (imparfait + passé composé)', color: '#a855f7',
      content: <>
        <p><strong>Imparfait</strong> pro popis (počasí, okolnosti) + <strong>passé composé</strong> pro konkrétní akci.</p>
        <div style={{ ...code, display: 'block', marginTop: '8px', fontSize: '14px', lineHeight: 1.7 }}>
          Hier, il <strong>faisait</strong> beau / il ne faisait pas beau.<br/>
          Il y <strong>avait</strong> des nuages / du soleil.<br/>
          J'<strong>ai visité</strong> le musée / le château.<br/>
          C'<strong>était</strong> très intéressant !
        </div>
      </>,
    },
    {
      id: 4, title: '4️⃣ Dnes (présent / passé composé)', color: '#10b981',
      content: <>
        <p>Co děláš dnes:</p>
        <div style={{ ...code, display: 'block', marginTop: '8px', fontSize: '14px', lineHeight: 1.7 }}>
          Aujourd'hui, je <strong>vais</strong> à la plage.<br/>
          Je me <strong>baigne</strong> et je <strong>bronze</strong>.<br/>
          Aujourd'hui, j'<strong>ai pris</strong> le bateau.
        </div>
      </>,
    },
    {
      id: 5, title: '5️⃣ Zítra (futur proche)', color: '#f59e0b',
      content: <>
        <p>Co budeš dělat zítra — <span style={code}>aller + infinitiv</span>:</p>
        <div style={{ ...code, display: 'block', marginTop: '8px', fontSize: '14px', lineHeight: 1.7 }}>
          Demain, je <strong>vais faire</strong> une randonnée.<br/>
          Je <strong>vais découvrir</strong> la région.<br/>
          On <strong>va pique-niquer</strong> avec mes amis.
        </div>
      </>,
    },
    {
      id: 6, title: '6️⃣ Závěr', color: '#ec4899',
      content: <>
        <p>Ukončení:</p>
        <div style={{ ...code, display: 'block', marginTop: '8px', fontSize: '14px', lineHeight: 1.7 }}>
          Je suis très content(e) !<br/>
          À bientôt,<br/>
          [Tvé jméno] / Bisous / Je t'embrasse
        </div>
      </>,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="glass" style={{ padding: '24px' }}>
        <h3 style={{ color: '#3b82f6', fontSize: '22px', marginBottom: '12px' }}>📮 Otázka 2: Napiš pohlednici / dopis</h3>
        <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>
          Napiš kamarádovi z dovolené: popíš, kde jsi a jaké to je, jaká tam jsou zvířata,
          co jsi dělal <strong>včera</strong>, co děláš <strong>dnes</strong> a co budeš dělat <strong>zítra</strong>.
        </p>
      </div>

      <div className="glass" style={{ padding: '24px' }}>
        <h3 style={{ color: '#3b82f6', fontSize: '20px', marginBottom: '14px' }}>🏗️ Struktura krok za krokem</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {steps.map(s => (
            <div key={s.id}>
              <button onClick={() => setStep(step === s.id ? null : s.id)}
                style={{ width: '100%', padding: '12px 16px', textAlign: 'left', background: step === s.id ? s.color + '20' : 'rgba(255,255,255,0.04)', border: `1px solid ${step === s.id ? s.color : 'rgba(255,255,255,0.1)'}`, borderRadius: '10px', color: '#fff', cursor: 'pointer', fontSize: '15px', fontWeight: 600, transition: 'all 0.4s ease', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{s.title}</span>
                <span>{step === s.id ? '−' : '+'}</span>
              </button>
              {step === s.id && (
                <div style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: '0 0 10px 10px', borderLeft: `3px solid ${s.color}`, color: 'rgba(255,255,255,0.85)', fontSize: '14px', lineHeight: 1.6, marginTop: '-1px' }}>
                  {s.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="glass" style={{ padding: '24px' }}>
        <h3 style={{ color: '#3b82f6', fontSize: '20px', marginBottom: '12px' }}>📝 Kompletní vzor (z učebnice — Carole z Marseille)</h3>
        <div style={{ background: 'rgba(255,255,255,0.06)', padding: '20px', borderRadius: '12px', fontFamily: 'Georgia, serif', fontStyle: 'italic', color: '#fff', lineHeight: 1.8, border: '1px solid rgba(255,255,255,0.1)' }}>
          <p><strong>Salut Mehdi !</strong></p>
          <p style={{ marginTop: '10px' }}>
            Je suis en vacances chez des amis à Marseille. <span style={{ color: '#22d3ee' }}>C'est génial !</span>
            Je vais à la plage, je me baigne dans les Calanques et je bronze !
          </p>
          <p style={{ marginTop: '10px' }}>
            <span style={{ color: '#a855f7' }}>Hier, il ne faisait pas beau. Il y avait des nuages.</span>
            Ce n'est pas normal à Marseille ! <span style={{ color: '#67e8f9' }}>Alors, j'ai visité le Mucem. C'était très intéressant !</span>
          </p>
          <p style={{ marginTop: '10px' }}>
            <span style={{ color: '#67e8f9' }}>Aujourd'hui, j'ai pris le bateau. J'ai visité le château d'If.</span>
            Tu sais, c'est la prison du « Comte de Monte-Cristo », le roman d'Alexandre Dumas.
          </p>
          <p style={{ marginTop: '10px' }}>
            Il se trouve sur une île à 4 kilomètres de Marseille.
          </p>
          <p style={{ marginTop: '10px' }}>
            <span style={{ color: '#10b981' }}>Et demain, je vais faire une randonnée à cheval avec mes amis pour découvrir la Provence.
            On va pique-niquer, je suis très contente !</span>
          </p>
          <p style={{ marginTop: '10px' }}>À bientôt,<br/><strong>Carole</strong></p>
        </div>
        <div style={{ marginTop: '12px', display: 'flex', gap: '14px', flexWrap: 'wrap', fontSize: '12px' }}>
          <span style={{ color: '#a855f7' }}>● Imparfait (popis)</span>
          <span style={{ color: '#67e8f9' }}>● Passé composé (akce)</span>
          <span style={{ color: '#10b981' }}>● Futur proche (zítra)</span>
        </div>
      </div>

      <div className="glass" style={{ padding: '24px' }}>
        <h3 style={{ color: '#3b82f6', fontSize: '20px', marginBottom: '12px' }}>🎨 Vlastní vzor — venkov se zvířaty</h3>
        <div style={{ background: 'rgba(255,255,255,0.06)', padding: '20px', borderRadius: '12px', fontFamily: 'Georgia, serif', fontStyle: 'italic', color: '#fff', lineHeight: 1.8, border: '1px solid rgba(255,255,255,0.1)' }}>
          <p><strong>Salut Lucas !</strong></p>
          <p style={{ marginTop: '10px' }}>
            Je suis en vacances à la campagne chez mes grands-parents. C'est très calme et magnifique !
            Il y a une ferme avec des vaches, des poules, un cheval et des canards. J'adore !
          </p>
          <p style={{ marginTop: '10px' }}>
            <span style={{ color: '#a855f7' }}>Hier, il faisait très beau et il y avait du soleil.</span>{' '}
            <span style={{ color: '#67e8f9' }}>J'ai fait du cheval avec mon cousin et on a pique-niqué dans la forêt. C'était super !</span>
          </p>
          <p style={{ marginTop: '10px' }}>
            <span style={{ color: '#67e8f9' }}>Aujourd'hui, je me suis promené près de la rivière et j'ai vu beaucoup d'oiseaux et de poissons.</span>
          </p>
          <p style={{ marginTop: '10px' }}>
            <span style={{ color: '#10b981' }}>Demain, je vais faire une randonnée à la montagne et nous allons pique-niquer au bord du lac.</span>
          </p>
          <p style={{ marginTop: '10px' }}>Je suis très content !<br/>À bientôt,<br/><strong>Jonas</strong></p>
        </div>
      </div>

      <div className="glass" style={{ padding: '24px', background: 'rgba(59,130,246,0.05)' }}>
        <h3 style={{ color: '#93c5fd', fontSize: '18px', marginBottom: '10px' }}>✅ Checklist před odevzdáním</h3>
        <ul style={{ paddingLeft: '20px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.9 }}>
          <li>Pozdrav na začátku (Salut...)</li>
          <li>Popis místa kde jsem (présent: Je suis...)</li>
          <li>Včera = imparfait (počasí) + passé composé (akce)</li>
          <li>Dnes = présent / passé composé pro to, co už jsem dnes udělal</li>
          <li>Zítra = futur proche (je vais + infinitiv)</li>
          <li>Zmínka o zvířatech / aktivitách</li>
          <li>Závěr (À bientôt, Bisous) + podpis</li>
          <li>Zkontroluj členy (un/une/des, le/la/les)</li>
          <li>Zkontroluj shodu participe passé se slovesy s ÊTRE</li>
        </ul>
      </div>
    </div>
  );
}
