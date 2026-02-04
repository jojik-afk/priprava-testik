// @title Francouzština - Časování sloves
// @subject Languages
// @topic French
// @template practice

import React, { useState, useEffect } from 'react';

const verbData = {
  avoir: {
    type: 'nepravidelné',
    meaning: 'mít',
    present: ['ai', 'as', 'a', 'avons', 'avez', 'ont'],
    imperative: ['—', 'aie', '—', 'ayons', 'ayez', '—'],
    notes: 'Pomocné sloveso pro tvorbu složených časů.'
  },
  être: {
    type: 'nepravidelné',
    meaning: 'být',
    present: ['suis', 'es', 'est', 'sommes', 'êtes', 'sont'],
    imperative: ['—', 'sois', '—', 'soyons', 'soyez', '—'],
    notes: 'Pomocné sloveso. Pozor: vous êtes (koncovka -es).'
  },
  aller: {
    type: 'nepravidelné',
    meaning: 'jít, jet',
    present: ['vais', 'vas', 'va', 'allons', 'allez', 'vont'],
    imperative: ['—', 'va', '—', 'allons', 'allez', '—'],
    notes: 'Zcela nepravidelné sloveso, používá se i pro tvorbu blízké budoucnosti.'
  },
  parler: {
    type: '1. třída (-er)',
    meaning: 'mluvit',
    present: ['parle', 'parles', 'parle', 'parlons', 'parlez', 'parlent'],
    imperative: ['—', 'parle', '—', 'parlons', 'parlez', '—'],
    notes: 'Vzorové sloveso 1. třídy. Koncovky: -e, -es, -e, -ons, -ez, -ent.'
  },
  habiter: {
    type: '1. třída (-er)',
    meaning: 'bydlet',
    present: ['habite', 'habites', 'habite', 'habitons', 'habitez', 'habitent'],
    imperative: ['—', 'habite', '—', 'habitons', 'habitez', '—'],
    notes: 'Pravidelné sloveso 1. třídy.'
  },
  aimer: {
    type: '1. třída (-er)',
    meaning: 'milovat, mít rád',
    present: ['aime', 'aimes', 'aime', 'aimons', 'aimez', 'aiment'],
    imperative: ['—', 'aime', '—', 'aimons', 'aimez', '—'],
    notes: 'Pravidelné sloveso 1. třídy.'
  },
  acheter: {
    type: '1. třída (-er) + změna',
    meaning: 'kupovat',
    present: ['achète', 'achètes', 'achète', 'achetons', 'achetez', 'achètent'],
    imperative: ['—', 'achète', '—', 'achetons', 'achetez', '—'],
    notes: 'Systém bota: e → è v osobách je, tu, il/elle, ils/elles.'
  },
  payer: {
    type: '1. třída (-er) + změna',
    meaning: 'platit',
    present: ['paie', 'paies', 'paie', 'payons', 'payez', 'paient'],
    imperative: ['—', 'paie', '—', 'payons', 'payez', '—'],
    notes: 'Systém bota: y → i. Možný i tvar paye/payes/payent.'
  },
  manger: {
    type: '1. třída (-er) + změna',
    meaning: 'jíst',
    present: ['mange', 'manges', 'mange', 'mangeons', 'mangez', 'mangent'],
    imperative: ['—', 'mange', '—', 'mangeons', 'mangez', '—'],
    notes: 'V osobě nous vkládáme e: mangeons (zachování výslovnosti g).'
  },
  faire: {
    type: 'nepravidelné',
    meaning: 'dělat',
    present: ['fais', 'fais', 'fait', 'faisons', 'faites', 'font'],
    imperative: ['—', 'fais', '—', 'faisons', 'faites', '—'],
    notes: 'Pozor: vous faites (koncovka -es, nevyslovuje se).'
  },
  choisir: {
    type: '2. třída (-ir)',
    meaning: 'vybrat',
    present: ['choisis', 'choisis', 'choisit', 'choisissons', 'choisissez', 'choisissent'],
    imperative: ['—', 'choisis', '—', 'choisissons', 'choisissez', '—'],
    notes: 'Vzorové sloveso 2. třídy. V množném čísle -iss-.'
  },
  finir: {
    type: '2. třída (-ir)',
    meaning: 'končit',
    present: ['finis', 'finis', 'finit', 'finissons', 'finissez', 'finissent'],
    imperative: ['—', 'finis', '—', 'finissons', 'finissez', '—'],
    notes: 'Vzorové sloveso 2. třídy. Koncovky: -is, -is, -it, -issons, -issez, -issent.'
  },
  prendre: {
    type: 'nepravidelné',
    meaning: 'brát, vzít',
    present: ['prends', 'prends', 'prend', 'prenons', 'prenez', 'prennent'],
    imperative: ['—', 'prends', '—', 'prenons', 'prenez', '—'],
    notes: 'Stejně se časují: apprendre, comprendre, surprendre.'
  },
  monter: {
    type: '1. třída (-er)',
    meaning: 'stoupat, nastoupit',
    present: ['monte', 'montes', 'monte', 'montons', 'montez', 'montent'],
    imperative: ['—', 'monte', '—', 'montons', 'montez', '—'],
    notes: 'Pravidelné sloveso 1. třídy.'
  },
  vouloir: {
    type: 'nepravidelné',
    meaning: 'chtít',
    present: ['veux', 'veux', 'veut', 'voulons', 'voulez', 'veulent'],
    imperative: ['—', 'veuille', '—', 'veuillons', 'veuillez', '—'],
    notes: 'Modální sloveso. Imperativ se používá zřídka (zdvořilostní forma).'
  },
  pouvoir: {
    type: 'nepravidelné',
    meaning: 'moci',
    present: ['peux', 'peux', 'peut', 'pouvons', 'pouvez', 'peuvent'],
    imperative: ['—', '—', '—', '—', '—', '—'],
    notes: 'Modální sloveso. Nemá imperativ!'
  },
  vendre: {
    type: '3. třída (-re)',
    meaning: 'prodávat',
    present: ['vends', 'vends', 'vend', 'vendons', 'vendez', 'vendent'],
    imperative: ['—', 'vends', '—', 'vendons', 'vendez', '—'],
    notes: 'Vzorové sloveso 3. třídy. Koncovky: -s, -s, —, -ons, -ez, -ent.'
  },
  mettre: {
    type: 'nepravidelné',
    meaning: 'dát, položit',
    present: ['mets', 'mets', 'met', 'mettons', 'mettez', 'mettent'],
    imperative: ['—', 'mets', '—', 'mettons', 'mettez', '—'],
    notes: 'Stejně: admettre, permettre, promettre, transmettre.'
  }
};

const pronouns = ['je', 'tu', 'il/elle/on', 'nous', 'vous', 'ils/elles'];
const imperativePronouns = ['—', '(tu)', '—', '(nous)', '(vous)', '—'];

export default function App() {
  const [activeTab, setActiveTab] = useState('theory');
  const [selectedVerb, setSelectedVerb] = useState('avoir');
  const [quizMode, setQuizMode] = useState('present');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showHint, setShowHint] = useState(false);
  const [studiedVerbs, setStudiedVerbs] = useState([]);
  const [testQuestions, setTestQuestions] = useState([]);
  const [testIndex, setTestIndex] = useState(0);
  const [testScore, setTestScore] = useState(0);
  const [testFinished, setTestFinished] = useState(false);
  const [testAnswers, setTestAnswers] = useState([]);

  const verbs = Object.keys(verbData);

  const generateQuestion = () => {
    const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];
    const data = verbData[randomVerb];
    
    if (quizMode === 'present') {
      const randomIndex = Math.floor(Math.random() * 6);
      return {
        verb: randomVerb,
        pronoun: pronouns[randomIndex],
        correctAnswer: data.present[randomIndex],
        mode: 'present'
      };
    } else {
      const validIndices = [1, 3, 4].filter(i => data.imperative[i] !== '—');
      if (validIndices.length === 0) {
        return generateQuestion();
      }
      const randomIndex = validIndices[Math.floor(Math.random() * validIndices.length)];
      return {
        verb: randomVerb,
        pronoun: imperativePronouns[randomIndex],
        correctAnswer: data.imperative[randomIndex],
        mode: 'imperative'
      };
    }
  };

  const startQuiz = () => {
    const q = generateQuestion();
    setCurrentQuestion(q);
    setUserAnswer('');
    setFeedback(null);
    setShowHint(false);
  };

  const checkAnswer = () => {
    if (!currentQuestion) return;
    
    const isCorrect = userAnswer.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase();
    setFeedback({
      correct: isCorrect,
      correctAnswer: currentQuestion.correctAnswer
    });
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));
  };

  const generateTest = () => {
    const questions = [];
    verbs.forEach(verb => {
      const data = verbData[verb];
      const randomIndex = Math.floor(Math.random() * 6);
      questions.push({
        verb,
        pronoun: pronouns[randomIndex],
        correctAnswer: data.present[randomIndex],
        mode: 'present'
      });
      
      const validImperativeIndices = [1, 3, 4].filter(i => data.imperative[i] !== '—');
      if (validImperativeIndices.length > 0) {
        const impIndex = validImperativeIndices[Math.floor(Math.random() * validImperativeIndices.length)];
        questions.push({
          verb,
          pronoun: imperativePronouns[impIndex],
          correctAnswer: data.imperative[impIndex],
          mode: 'imperative'
        });
      }
    });
    
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }
    
    return questions.slice(0, 20);
  };

  const startTest = () => {
    const questions = generateTest();
    setTestQuestions(questions);
    setTestIndex(0);
    setTestScore(0);
    setTestFinished(false);
    setTestAnswers([]);
    setUserAnswer('');
    setFeedback(null);
  };

  const submitTestAnswer = () => {
    const current = testQuestions[testIndex];
    const isCorrect = userAnswer.toLowerCase().trim() === current.correctAnswer.toLowerCase();
    
    setTestAnswers(prev => [...prev, {
      ...current,
      userAnswer: userAnswer.trim(),
      isCorrect
    }]);
    
    if (isCorrect) setTestScore(prev => prev + 1);
    
    if (testIndex + 1 < testQuestions.length) {
      setTestIndex(prev => prev + 1);
      setUserAnswer('');
    } else {
      setTestFinished(true);
    }
  };

  const markAsStudied = (verb) => {
    if (!studiedVerbs.includes(verb)) {
      setStudiedVerbs(prev => [...prev, verb]);
    }
  };

  const TheoryTab = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">📚 Tři třídy pravidelných sloves</h2>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-bold text-green-700 text-lg mb-2">1. třída (-er)</h3>
            <p className="text-sm text-gray-600 mb-2">Nejpočetnější skupina</p>
            <div className="text-sm font-mono bg-green-50 p-2 rounded">
              <div>je parl<span className="text-green-600 font-bold">e</span></div>
              <div>tu parl<span className="text-green-600 font-bold">es</span></div>
              <div>il parl<span className="text-green-600 font-bold">e</span></div>
              <div>nous parl<span className="text-green-600 font-bold">ons</span></div>
              <div>vous parl<span className="text-green-600 font-bold">ez</span></div>
              <div>ils parl<span className="text-green-600 font-bold">ent</span></div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-bold text-purple-700 text-lg mb-2">2. třída (-ir)</h3>
            <p className="text-sm text-gray-600 mb-2">Vložka -iss- v mn. čísle</p>
            <div className="text-sm font-mono bg-purple-50 p-2 rounded">
              <div>je fin<span className="text-purple-600 font-bold">is</span></div>
              <div>tu fin<span className="text-purple-600 font-bold">is</span></div>
              <div>il fin<span className="text-purple-600 font-bold">it</span></div>
              <div>nous fin<span className="text-purple-600 font-bold">issons</span></div>
              <div>vous fin<span className="text-purple-600 font-bold">issez</span></div>
              <div>ils fin<span className="text-purple-600 font-bold">issent</span></div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-bold text-orange-700 text-lg mb-2">3. třída (-re)</h3>
            <p className="text-sm text-gray-600 mb-2">3. os. j.č. bez koncovky</p>
            <div className="text-sm font-mono bg-orange-50 p-2 rounded">
              <div>je vend<span className="text-orange-600 font-bold">s</span></div>
              <div>tu vend<span className="text-orange-600 font-bold">s</span></div>
              <div>il vend<span className="text-orange-600 font-bold">—</span></div>
              <div>nous vend<span className="text-orange-600 font-bold">ons</span></div>
              <div>vous vend<span className="text-orange-600 font-bold">ez</span></div>
              <div>ils vend<span className="text-orange-600 font-bold">ent</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-xl border border-amber-200">
        <h2 className="text-2xl font-bold text-amber-800 mb-4">👢 Systém bota</h2>
        <p className="text-gray-700 mb-4">U některých sloves 1. třídy dochází ke změnám v základu. Tyto změny se týkají osob ve tvaru "boty":</p>
        
        <div className="flex flex-wrap gap-6 items-center">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="grid grid-cols-2 gap-2 text-center font-mono">
              <div className="bg-amber-100 p-2 rounded font-bold">je</div>
              <div className="bg-gray-100 p-2 rounded opacity-50">nous</div>
              <div className="bg-amber-100 p-2 rounded font-bold">tu</div>
              <div className="bg-gray-100 p-2 rounded opacity-50">vous</div>
              <div className="bg-amber-100 p-2 rounded font-bold">il/elle</div>
              <div className="bg-amber-100 p-2 rounded font-bold">ils/elles</div>
            </div>
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="bg-white p-3 rounded-lg">
              <span className="font-bold text-amber-700">acheter:</span> e → è (j'ach<span className="text-red-600 font-bold">è</span>te)
            </div>
            <div className="bg-white p-3 rounded-lg">
              <span className="font-bold text-amber-700">payer:</span> y → i (je pa<span className="text-red-600 font-bold">i</span>e)
            </div>
            <div className="bg-white p-3 rounded-lg">
              <span className="font-bold text-amber-700">manger:</span> nous mang<span className="text-red-600 font-bold">e</span>ons (vložené e)
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-6 rounded-xl border border-rose-200">
        <h2 className="text-2xl font-bold text-rose-800 mb-4">⚡ Imperativ (rozkazovací způsob)</h2>
        <p className="text-gray-700 mb-4">Imperativ má pouze 3 osoby: tu, nous, vous. U sloves 1. třídy se v osobě tu <strong>vypouští -s</strong>!</p>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-bold mb-2">1. třída (parler):</h4>
            <div className="font-mono text-sm">
              <div>Parl<span className="text-rose-600 font-bold">e</span> ! (ty)</div>
              <div>Parl<span className="text-rose-600 font-bold">ons</span> ! (my)</div>
              <div>Parl<span className="text-rose-600 font-bold">ez</span> ! (vy)</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-bold mb-2">2. třída (finir):</h4>
            <div className="font-mono text-sm">
              <div>Fini<span className="text-rose-600 font-bold">s</span> ! (ty)</div>
              <div>Finiss<span className="text-rose-600 font-bold">ons</span> ! (my)</div>
              <div>Finiss<span className="text-rose-600 font-bold">ez</span> ! (vy)</div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 bg-rose-100 p-3 rounded-lg">
          <span className="font-bold">⚠️ Pozor:</span> avoir → aie, ayons, ayez | être → sois, soyons, soyez | pouvoir nemá imperativ!
        </div>
      </div>

      <div className="bg-gradient-to-r from-violet-50 to-purple-50 p-6 rounded-xl border border-violet-200">
        <h2 className="text-2xl font-bold text-violet-800 mb-4">🎯 Důležité výjimky</h2>
        <div className="bg-white p-4 rounded-lg">
          <p className="font-bold text-violet-700 mb-2">Slovesa s koncovkou -es v osobě vous:</p>
          <div className="flex gap-4 font-mono text-lg">
            <span className="bg-violet-100 px-3 py-1 rounded">vous <span className="text-violet-600 font-bold">êtes</span></span>
            <span className="bg-violet-100 px-3 py-1 rounded">vous <span className="text-violet-600 font-bold">faites</span></span>
            <span className="bg-violet-100 px-3 py-1 rounded">vous <span className="text-violet-600 font-bold">dites</span></span>
          </div>
          <p className="text-sm text-gray-600 mt-2">Tato koncovka se nevyslovuje!</p>
        </div>
      </div>
    </div>
  );

  const VerbsTab = () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-4">
        {verbs.map(verb => (
          <button
            key={verb}
            onClick={() => {
              setSelectedVerb(verb);
              markAsStudied(verb);
            }}
            className={`px-3 py-2 rounded-lg font-medium transition-all ${
              selectedVerb === verb 
                ? 'bg-blue-600 text-white shadow-lg' 
                : studiedVerbs.includes(verb)
                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {verb} {studiedVerbs.includes(verb) && '✓'}
          </button>
        ))}
      </div>
      
      <div className="text-sm text-gray-600 mb-4">
        Prostudováno: {studiedVerbs.length}/{verbs.length} sloves
        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all"
            style={{ width: `${(studiedVerbs.length / verbs.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {selectedVerb && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <h2 className="text-3xl font-bold">{selectedVerb}</h2>
            <p className="text-blue-100 text-lg">{verbData[selectedVerb].meaning}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-sm">
              {verbData[selectedVerb].type}
            </span>
          </div>
          
          <div className="p-6 grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">P</span>
                Přítomný čas (Présent)
              </h3>
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                {pronouns.map((pronoun, i) => (
                  <div key={i} className={`flex justify-between p-3 ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                    <span className="text-gray-600">{pronoun}</span>
                    <span className="font-mono font-bold text-blue-700">
                      {pronoun === 'je' && verbData[selectedVerb].present[i].match(/^[aeiouéèêë]/i) 
                        ? `j'${verbData[selectedVerb].present[i]}`
                        : verbData[selectedVerb].present[i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center text-rose-600">I</span>
                Imperativ (Impératif)
              </h3>
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                {imperativePronouns.map((pronoun, i) => (
                  <div key={i} className={`flex justify-between p-3 ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                    <span className="text-gray-600">{pronoun}</span>
                    <span className={`font-mono font-bold ${verbData[selectedVerb].imperative[i] === '—' ? 'text-gray-400' : 'text-rose-700'}`}>
                      {verbData[selectedVerb].imperative[i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="px-6 pb-6">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <span className="font-bold text-amber-800">💡 Poznámka:</span>
              <p className="text-amber-900 mt-1">{verbData[selectedVerb].notes}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const PracticeTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🎯 Procvičování</h2>
        
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setQuizMode('present')}
            className={`flex-1 py-3 rounded-lg font-medium transition-all ${
              quizMode === 'present' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Přítomný čas
          </button>
          <button
            onClick={() => setQuizMode('imperative')}
            className={`flex-1 py-3 rounded-lg font-medium transition-all ${
              quizMode === 'imperative' 
                ? 'bg-rose-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Imperativ
          </button>
        </div>

        <div className="text-center mb-4">
          <span className="text-lg">Skóre: </span>
          <span className="text-2xl font-bold text-green-600">{score.correct}</span>
          <span className="text-gray-500"> / {score.total}</span>
          {score.total > 0 && (
            <span className="ml-2 text-gray-600">
              ({Math.round((score.correct / score.total) * 100)}%)
            </span>
          )}
        </div>

        {!currentQuestion ? (
          <button
            onClick={startQuiz}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-bold text-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
          >
            Začít procvičovat
          </button>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <p className="text-gray-600 mb-2">
                {currentQuestion.mode === 'present' ? 'Doplň přítomný čas:' : 'Doplň imperativ:'}
              </p>
              <p className="text-3xl font-bold text-gray-800">
                <span className="text-blue-600">{currentQuestion.pronoun}</span>
                {' '}
                <span className="text-purple-600">({currentQuestion.verb})</span>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {verbData[currentQuestion.verb].meaning}
              </p>
            </div>

            {showHint && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
                <p className="text-amber-800">
                  💡 Typ: <strong>{verbData[currentQuestion.verb].type}</strong>
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !feedback && checkAnswer()}
                placeholder="Napiš odpověď..."
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                disabled={feedback !== null}
                autoFocus
              />
              {!feedback && (
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="px-4 py-3 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200"
                >
                  💡
                </button>
              )}
            </div>

            {feedback ? (
              <div className={`p-4 rounded-lg ${feedback.correct ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'}`}>
                <p className={`font-bold text-lg ${feedback.correct ? 'text-green-700' : 'text-red-700'}`}>
                  {feedback.correct ? '✅ Správně!' : '❌ Špatně!'}
                </p>
                {!feedback.correct && (
                  <p className="text-red-600 mt-1">
                    Správná odpověď: <strong>{feedback.correctAnswer}</strong>
                  </p>
                )}
                <button
                  onClick={startQuiz}
                  className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Další otázka →
                </button>
              </div>
            ) : (
              <button
                onClick={checkAnswer}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
              >
                Zkontrolovat
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const TestTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">📝 Test</h2>
        
        {testQuestions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              Test obsahuje 20 náhodných otázek z přítomného času a imperativu všech sloves.
            </p>
            <button
              onClick={startTest}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-bold text-lg hover:from-purple-700 hover:to-indigo-700 shadow-lg"
            >
              Zahájit test
            </button>
          </div>
        ) : testFinished ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">
              {testScore / testQuestions.length >= 0.9 ? '🏆' : 
               testScore / testQuestions.length >= 0.7 ? '👍' : 
               testScore / testQuestions.length >= 0.5 ? '📚' : '💪'}
            </div>
            <h3 className="text-3xl font-bold text-gray-800">
              {testScore} / {testQuestions.length}
            </h3>
            <p className="text-xl text-gray-600 mt-2">
              {Math.round((testScore / testQuestions.length) * 100)}%
            </p>
            <p className="text-gray-500 mt-2">
              {testScore / testQuestions.length >= 0.9 ? 'Výborně! Skvěle ovládáš časování!' : 
               testScore / testQuestions.length >= 0.7 ? 'Dobrá práce! Ještě trochu procvičuj.' : 
               testScore / testQuestions.length >= 0.5 ? 'Jde to, ale potřebuješ více praxe.' : 'Nevzdávej to! Vrať se ke studiu a zkus to znovu.'}
            </p>
            
            <div className="mt-6 text-left max-h-60 overflow-y-auto bg-gray-50 rounded-lg p-4">
              <h4 className="font-bold mb-2">Přehled odpovědí:</h4>
              {testAnswers.map((answer, i) => (
                <div key={i} className={`p-2 rounded mb-1 ${answer.isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                  <span className={answer.isCorrect ? 'text-green-700' : 'text-red-700'}>
                    {answer.isCorrect ? '✓' : '✗'} {answer.pronoun} {answer.verb}: 
                    {' '}{answer.isCorrect ? answer.correctAnswer : `${answer.userAnswer} → ${answer.correctAnswer}`}
                  </span>
                </div>
              ))}
            </div>
            
            <button
              onClick={startTest}
              className="mt-6 px-8 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700"
            >
              Nový test
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">
                Otázka {testIndex + 1} / {testQuestions.length}
              </span>
              <span className="text-green-600 font-bold">
                Správně: {testScore}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all"
                style={{ width: `${((testIndex) / testQuestions.length) * 100}%` }}
              ></div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <p className="text-gray-600 mb-2">
                {testQuestions[testIndex].mode === 'present' ? 'Přítomný čas:' : 'Imperativ:'}
              </p>
              <p className="text-3xl font-bold text-gray-800">
                <span className="text-blue-600">{testQuestions[testIndex].pronoun}</span>
                {' '}
                <span className="text-purple-600">({testQuestions[testIndex].verb})</span>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {verbData[testQuestions[testIndex].verb].meaning}
              </p>
            </div>

            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && submitTestAnswer()}
              placeholder="Napiš odpověď..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-lg"
              autoFocus
            />

            <button
              onClick={submitTestAnswer}
              className="w-full py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700"
            >
              {testIndex + 1 < testQuestions.length ? 'Další otázka →' : 'Dokončit test'}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const tabs = [
    { id: 'theory', label: '📚 Teorie', component: TheoryTab },
    { id: 'verbs', label: '📖 Slovesa', component: VerbsTab },
    { id: 'practice', label: '🎯 Procvičování', component: PracticeTab },
    { id: 'test', label: '📝 Test', component: TestTab },
  ];

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component || TheoryTab;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🇫🇷 Francouzská slovesa
          </h1>
          <p className="text-gray-600">Časování v přítomném čase a imperativu</p>
        </header>

        <nav className="flex gap-2 mb-6 bg-white rounded-xl p-2 shadow-md overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-max px-4 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <ActiveComponent />
      </div>
    </div>
  );
}
