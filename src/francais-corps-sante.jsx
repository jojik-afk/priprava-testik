// @title Le corps et la santé - Francouzská slovíčka
// @subject Languages
// @topic French
// @template practice

import React, { useState, useEffect } from 'react';

const vocabulary = {
  "Pour demander/dire le poids et la taille": [
    { fr: "Quel est votre poids ? / Vous pesez combien ?", cz: "Jaká je vaše hmotnost? / Kolik vážíte?", hint: "⚖️" },
    { fr: "Je pèse 60 kg (soixante kilos).", cz: "Vážím 60 kg (šedesát kilogramů).", hint: "📊" },
    { fr: "Quelle est votre taille ? / Vous mesurez combien ?", cz: "Jaká je vaše výška? / Kolik měříte?", hint: "📏" },
    { fr: "Je mesure 1,68 m (1 mètre 68).", cz: "Měřím 1,68 m (1 metr 68).", hint: "📐" },
  ],
  "Pour parler de sa santé - Le médecin": [
    { fr: "Qu'est-ce qui vous arrive ?", cz: "Co se vám stalo?", hint: "❓" },
    { fr: "Vous vous sentez comment ?", cz: "Jak se cítíte?", hint: "🤔" },
    { fr: "Vous avez (encore) de la fièvre ?", cz: "Máte (ještě) horečku?", hint: "🤒" },
  ],
  "Pour parler de sa santé - Le malade": [
    { fr: "Je suis malade.", cz: "Jsem nemocný/á.", hint: "😷" },
    { fr: "J'ai un rhume.", cz: "Mám rýmu.", hint: "🤧" },
    { fr: "J'ai mal à la.../à l'.../au.../aux...", cz: "Bolí mě... (hlava/krk/břicho/nohy...)", hint: "😣" },
    { fr: "J'ai 39°C.", cz: "Mám 39°C.", hint: "🌡️" },
  ],
  "Les parties du corps": [
    { fr: "le bras", cz: "paže", hint: "🦾" },
    { fr: "le dos", cz: "záda", hint: "🔙" },
    { fr: "le genou", cz: "koleno", hint: "🦵" },
    { fr: "la gorge", cz: "hrdlo/krk", hint: "😮" },
    { fr: "la jambe", cz: "noha (celá)", hint: "🦿" },
    { fr: "la main", cz: "ruka (dlaň)", hint: "✋" },
    { fr: "le pied", cz: "chodidlo/noha", hint: "🦶" },
    { fr: "la tête", cz: "hlava", hint: "🗣️" },
    { fr: "le ventre", cz: "břicho", hint: "🫃" },
  ],
  "Le visage": [
    { fr: "la bouche", cz: "ústa", hint: "👄" },
    { fr: "la dent", cz: "zub", hint: "🦷" },
    { fr: "le nez", cz: "nos", hint: "👃" },
    { fr: "l'œil (m.) / les yeux", cz: "oko / oči", hint: "👁️" },
    { fr: "l'oreille (f.)", cz: "ucho", hint: "👂" },
  ],
  "La taille et le poids": [
    { fr: "mesurer", cz: "měřit (výšku)", hint: "📏" },
    { fr: "le mètre (m)", cz: "metr", hint: "📐" },
    { fr: "peser", cz: "vážit", hint: "⚖️" },
    { fr: "le kilo (kg)", cz: "kilogram", hint: "🏋️" },
  ],
  "Les symptômes, les maladies": [
    { fr: "la fièvre", cz: "horečka", hint: "🤒" },
    { fr: "la grippe", cz: "chřipka", hint: "🤧" },
    { fr: "malade", cz: "nemocný/á", hint: "😷" },
    { fr: "le rhume", cz: "rýma/nachlazení", hint: "🤧" },
    { fr: "tousser", cz: "kašlat", hint: "😤" },
    { fr: "la toux", cz: "kašel", hint: "💨" },
  ],
  "Les lieux, les médicaments, les examens": [
    { fr: "l'hôpital (m.)", cz: "nemocnice", hint: "🏥" },
    { fr: "la pharmacie", cz: "lékárna", hint: "💊" },
    { fr: "le paracétamol", cz: "paracetamol", hint: "💊" },
    { fr: "la radio", cz: "rentgen", hint: "🩻" },
    { fr: "le sirop", cz: "sirup", hint: "🍯" },
    { fr: "la visite à domicile", cz: "návštěva u pacienta doma", hint: "🏠" },
    { fr: "la vitamine C", cz: "vitamín C", hint: "🍊" },
  ],
  "Les professions médicales": [
    { fr: "le dentiste", cz: "zubař", hint: "🦷" },
    { fr: "le/la docteur(e), le médecin", cz: "doktor/ka, lékař", hint: "👨‍⚕️" },
    { fr: "l'infirmier (m.), l'infirmière (f.)", cz: "zdravotní bratr, zdravotní sestra", hint: "👩‍⚕️" },
    { fr: "le pharmacien, la pharmacienne", cz: "lékárník, lékárnice", hint: "💊" },
  ],
  "Passé composé - slovesa": [
    { fr: "être → j'ai été", cz: "být → byl/a jsem", hint: "🔹" },
    { fr: "être → tu as été", cz: "být → byl/a jsi", hint: "🔹" },
    { fr: "être → il/elle a été", cz: "být → byl/a", hint: "🔹" },
    { fr: "être → nous avons été", cz: "být → byli/y jsme", hint: "🔹" },
    { fr: "être → vous avez été", cz: "být → byli/y jste", hint: "🔹" },
    { fr: "être → ils/elles ont été", cz: "být → byli/y", hint: "🔹" },
    { fr: "avoir → j'ai eu", cz: "mít → měl/a jsem", hint: "🔸" },
    { fr: "avoir → tu as eu", cz: "mít → měl/a jsi", hint: "🔸" },
    { fr: "avoir → il/elle a eu", cz: "mít → měl/a", hint: "🔸" },
    { fr: "avoir → nous avons eu", cz: "mít → měli/y jsme", hint: "🔸" },
    { fr: "avoir → vous avez eu", cz: "mít → měli/y jste", hint: "🔸" },
    { fr: "avoir → ils/elles ont eu", cz: "mít → měli/y", hint: "🔸" },
    { fr: "faire → j'ai fait", cz: "dělat → udělal/a jsem", hint: "🛠️" },
    { fr: "faire → tu as fait", cz: "dělat → udělal/a jsi", hint: "🛠️" },
    { fr: "faire → il/elle a fait", cz: "dělat → udělal/a", hint: "🛠️" },
    { fr: "faire → nous avons fait", cz: "dělat → udělali/y jsme", hint: "🛠️" },
    { fr: "faire → vous avez fait", cz: "dělat → udělali/y jste", hint: "🛠️" },
    { fr: "faire → ils/elles ont fait", cz: "dělat → udělali/y", hint: "🛠️" },
    { fr: "dormir → j'ai dormi", cz: "spát → spal/a jsem", hint: "😴" },
    { fr: "dormir → tu as dormi", cz: "spát → spal/a jsi", hint: "😴" },
    { fr: "dormir → il/elle a dormi", cz: "spát → spal/a", hint: "😴" },
    { fr: "dormir → nous avons dormi", cz: "spát → spali/y jsme", hint: "😴" },
    { fr: "dormir → vous avez dormi", cz: "spát → spali/y jste", hint: "😴" },
    { fr: "dormir → ils/elles ont dormi", cz: "spát → spali/y", hint: "😴" },
    { fr: "pouvoir → j'ai pu", cz: "moci → mohl/a jsem", hint: "💪" },
    { fr: "pouvoir → tu as pu", cz: "moci → mohl/a jsi", hint: "💪" },
    { fr: "pouvoir → il/elle a pu", cz: "moci → mohl/a", hint: "💪" },
    { fr: "pouvoir → nous avons pu", cz: "moci → mohli/y jsme", hint: "💪" },
    { fr: "pouvoir → vous avez pu", cz: "moci → mohli/y jste", hint: "💪" },
    { fr: "pouvoir → ils/elles ont pu", cz: "moci → mohli/y", hint: "💪" },
    { fr: "prendre → j'ai pris", cz: "vzít → vzal/a jsem", hint: "✋" },
    { fr: "prendre → tu as pris", cz: "vzít → vzal/a jsi", hint: "✋" },
    { fr: "prendre → il/elle a pris", cz: "vzít → vzal/a", hint: "✋" },
    { fr: "prendre → nous avons pris", cz: "vzít → vzali/y jsme", hint: "✋" },
    { fr: "prendre → vous avez pris", cz: "vzít → vzali/y jste", hint: "✋" },
    { fr: "prendre → ils/elles ont pris", cz: "vzít → vzali/y", hint: "✋" },
    { fr: "voir → j'ai vu", cz: "vidět → viděl/a jsem", hint: "👁️" },
    { fr: "voir → tu as vu", cz: "vidět → viděl/a jsi", hint: "👁️" },
    { fr: "voir → il/elle a vu", cz: "vidět → viděl/a", hint: "👁️" },
    { fr: "voir → nous avons vu", cz: "vidět → viděli/y jsme", hint: "👁️" },
    { fr: "voir → vous avez vu", cz: "vidět → viděli/y jste", hint: "👁️" },
    { fr: "voir → ils/elles ont vu", cz: "vidět → viděli/y", hint: "👁️" },
    { fr: "apprendre → j'ai appris", cz: "učit se → naučil/a jsem se", hint: "📚" },
    { fr: "apprendre → tu as appris", cz: "učit se → naučil/a jsi se", hint: "📚" },
    { fr: "apprendre → il/elle a appris", cz: "učit se → naučil/a se", hint: "📚" },
    { fr: "apprendre → nous avons appris", cz: "učit se → naučili/y jsme se", hint: "📚" },
    { fr: "apprendre → vous avez appris", cz: "učit se → naučili/y jste se", hint: "📚" },
    { fr: "apprendre → ils/elles ont appris", cz: "učit se → naučili/y se", hint: "📚" },
  ],
  "Les émotions positives et négatives": [
    { fr: "content(e)", cz: "spokojený/á", hint: "😊" },
    { fr: "fatigué(e)", cz: "unavený/á", hint: "😫" },
    { fr: "heureux, heureuse ≠ malheureux, malheureuse", cz: "šťastný/á ≠ nešťastný/á", hint: "😄" },
    { fr: "inquiet, inquiète", cz: "znepokojený/á", hint: "😰" },
    { fr: "stressé(e)", cz: "vystresovaný/á", hint: "😣" },
    { fr: "triste", cz: "smutný/á", hint: "😢" },
  ],
};

const allWords = Object.entries(vocabulary).flatMap(([category, words]) =>
  words.map(w => ({ ...w, category }))
);

export default function App() {
  const [mode, setMode] = useState('menu');
  const [currentCategory, setCurrentCategory] = useState(null);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizWords, setQuizWords] = useState([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [direction, setDirection] = useState('fr-cz');
  const [matchPairs, setMatchPairs] = useState([]);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [matchScore, setMatchScore] = useState(0);
  const [learnedWords, setLearnedWords] = useState(new Set());

  const currentWords = currentCategory ? vocabulary[currentCategory] : allWords;

  const shuffleArray = (arr) => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const startFlashcards = (category = null) => {
    setCurrentCategory(category);
    setFlashcardIndex(0);
    setShowAnswer(false);
    setMode('flashcards');
  };

  const startQuiz = (category = null) => {
    setCurrentCategory(category);
    const words = category ? vocabulary[category] : allWords;
    setQuizWords(shuffleArray(words));
    setQuizIndex(0);
    setUserAnswer('');
    setFeedback(null);
    setScore(0);
    setTotalAnswered(0);
    setMode('quiz');
  };

  const startMatching = (category = null) => {
    setCurrentCategory(category);
    const words = category ? vocabulary[category] : allWords;
    const selected = shuffleArray(words).slice(0, 6);
    const leftSide = shuffleArray(selected.map((w, i) => ({ id: i, text: w.fr, pairId: i })));
    const rightSide = shuffleArray(selected.map((w, i) => ({ id: i + 6, text: w.cz, pairId: i })));
    setMatchPairs({ left: leftSide, right: rightSide });
    setSelectedLeft(null);
    setMatchedPairs([]);
    setMatchScore(0);
    setMode('matching');
  };

  const handleFlashcardNext = () => {
    if (flashcardIndex < currentWords.length - 1) {
      setFlashcardIndex(flashcardIndex + 1);
      setShowAnswer(false);
    }
  };

  const handleFlashcardPrev = () => {
    if (flashcardIndex > 0) {
      setFlashcardIndex(flashcardIndex - 1);
      setShowAnswer(false);
    }
  };

  const markAsLearned = (word) => {
    setLearnedWords(prev => new Set([...prev, word.fr]));
  };

  const checkQuizAnswer = () => {
    const currentWord = quizWords[quizIndex];
    const correctAnswer = direction === 'fr-cz' ? currentWord.cz : currentWord.fr;
    const isCorrect = userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim() ||
      correctAnswer.toLowerCase().includes(userAnswer.toLowerCase().trim()) && userAnswer.length > 2;
    
    if (isCorrect) {
      setScore(score + 1);
      setFeedback({ type: 'correct', message: 'Správně! 🎉' });
      markAsLearned(currentWord);
    } else {
      setFeedback({ 
        type: 'incorrect', 
        message: `Špatně. Správná odpověď: ${correctAnswer}` 
      });
    }
    setTotalAnswered(totalAnswered + 1);
  };

  const nextQuizQuestion = () => {
    if (quizIndex < quizWords.length - 1) {
      setQuizIndex(quizIndex + 1);
      setUserAnswer('');
      setFeedback(null);
    } else {
      setMode('results');
    }
  };

  const handleMatchClick = (side, item) => {
    if (matchedPairs.includes(item.pairId)) return;

    if (side === 'left') {
      setSelectedLeft(item);
    } else if (selectedLeft) {
      if (selectedLeft.pairId === item.pairId) {
        setMatchedPairs([...matchedPairs, item.pairId]);
        setMatchScore(matchScore + 1);
      }
      setSelectedLeft(null);
    }
  };

  const MenuButton = ({ onClick, children, color }) => (
    <button
      onClick={onClick}
      className={`w-full p-4 rounded-xl text-white font-semibold text-lg transition-all transform hover:scale-105 shadow-lg ${color}`}
    >
      {children}
    </button>
  );

  const CategorySelector = ({ onSelect, onBack }) => (
    <div className="space-y-3">
      <h3 className="text-xl font-bold text-gray-700 mb-4">Vyber kategorii:</h3>
      <button
        onClick={() => onSelect(null)}
        className="w-full p-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90"
      >
        🌟 Všechna slovíčka ({allWords.length})
      </button>
      {Object.entries(vocabulary).map(([category, words]) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className="w-full p-3 rounded-lg bg-white border-2 border-purple-200 text-purple-700 font-medium hover:bg-purple-50"
        >
          {category} ({words.length})
        </button>
      ))}
      <button
        onClick={onBack}
        className="w-full p-3 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 mt-4"
      >
        ← Zpět
      </button>
    </div>
  );

  if (mode === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Le corps et la santé
            </h1>
            <p className="text-gray-600 mt-2">Tělo a zdraví – francouzská slovíčka</p>
            <div className="mt-4 p-3 bg-white rounded-xl shadow-sm">
              <p className="text-sm text-gray-500">
                📚 {allWords.length} slovíček • ✅ {learnedWords.size} naučených
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <MenuButton 
              onClick={() => setMode('select-flashcards')} 
              color="bg-gradient-to-r from-blue-500 to-cyan-500"
            >
              📇 Kartičky
            </MenuButton>
            <MenuButton 
              onClick={() => setMode('select-quiz')} 
              color="bg-gradient-to-r from-green-500 to-emerald-500"
            >
              ✍️ Psaní slovíček
            </MenuButton>
            <MenuButton 
              onClick={() => setMode('select-matching')} 
              color="bg-gradient-to-r from-orange-500 to-yellow-500"
            >
              🔗 Spojování párů
            </MenuButton>
            <MenuButton 
              onClick={() => setMode('vocabulary')} 
              color="bg-gradient-to-r from-purple-500 to-pink-500"
            >
              📖 Přehled slovíček
            </MenuButton>
          </div>

          <div className="mt-8 p-4 bg-white rounded-xl shadow-sm">
            <h3 className="font-semibold text-gray-700 mb-2">Směr procvičování:</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setDirection('fr-cz')}
                className={`flex-1 p-2 rounded-lg font-medium transition-all ${
                  direction === 'fr-cz' 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                FR → CZ
              </button>
              <button
                onClick={() => setDirection('cz-fr')}
                className={`flex-1 p-2 rounded-lg font-medium transition-all ${
                  direction === 'cz-fr' 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                CZ → FR
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'select-flashcards') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
        <div className="max-w-md mx-auto">
          <CategorySelector onSelect={startFlashcards} onBack={() => setMode('menu')} />
        </div>
      </div>
    );
  }

  if (mode === 'select-quiz') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
        <div className="max-w-md mx-auto">
          <CategorySelector onSelect={startQuiz} onBack={() => setMode('menu')} />
        </div>
      </div>
    );
  }

  if (mode === 'select-matching') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
        <div className="max-w-md mx-auto">
          <CategorySelector onSelect={startMatching} onBack={() => setMode('menu')} />
        </div>
      </div>
    );
  }

  if (mode === 'vocabulary') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-purple-700 mb-6">📖 Přehled slovíček</h2>
          
          {Object.entries(vocabulary).map(([category, words]) => (
            <div key={category} className="mb-6 bg-white rounded-xl shadow-sm overflow-hidden">
              <h3 className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 font-semibold">
                {category}
              </h3>
              <div className="divide-y">
                {words.map((word, i) => (
                  <div key={i} className="p-3 flex items-center justify-between hover:bg-purple-50">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{word.hint}</span>
                      <div>
                        <p className="font-semibold text-purple-700">{word.fr}</p>
                        <p className="text-gray-600">{word.cz}</p>
                      </div>
                    </div>
                    {learnedWords.has(word.fr) && (
                      <span className="text-green-500 text-xl">✓</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <button
            onClick={() => setMode('menu')}
            className="w-full p-4 rounded-xl bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300"
          >
            ← Zpět do menu
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'flashcards') {
    const word = currentWords[flashcardIndex];
    const displayFront = direction === 'fr-cz' ? word.fr : word.cz;
    const displayBack = direction === 'fr-cz' ? word.cz : word.fr;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => setMode('menu')}
              className="text-purple-600 font-medium"
            >
              ← Menu
            </button>
            <span className="text-gray-600">
              {flashcardIndex + 1} / {currentWords.length}
            </span>
          </div>

          <div
            onClick={() => setShowAnswer(!showAnswer)}
            className="bg-white rounded-2xl shadow-xl p-8 min-h-64 flex flex-col items-center justify-center cursor-pointer transform transition-all hover:scale-102"
          >
            <span className="text-4xl mb-4">{word.hint}</span>
            <p className="text-3xl font-bold text-purple-700 text-center">
              {displayFront}
            </p>
            {showAnswer && (
              <div className="mt-6 pt-6 border-t-2 border-purple-100 w-full text-center">
                <p className="text-2xl text-pink-600 font-semibold">{displayBack}</p>
                {word.category && (
                  <p className="text-sm text-gray-400 mt-2">{word.category}</p>
                )}
              </div>
            )}
            {!showAnswer && (
              <p className="text-gray-400 mt-6 text-sm">Klikni pro zobrazení odpovědi</p>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleFlashcardPrev}
              disabled={flashcardIndex === 0}
              className="flex-1 p-4 rounded-xl bg-gray-200 text-gray-700 font-semibold disabled:opacity-50"
            >
              ← Předchozí
            </button>
            <button
              onClick={() => {
                markAsLearned(word);
                handleFlashcardNext();
              }}
              className="p-4 rounded-xl bg-green-500 text-white font-semibold"
            >
              ✓ Umím
            </button>
            <button
              onClick={handleFlashcardNext}
              disabled={flashcardIndex === currentWords.length - 1}
              className="flex-1 p-4 rounded-xl bg-purple-500 text-white font-semibold disabled:opacity-50"
            >
              Další →
            </button>
          </div>

          <div className="mt-4 bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
              style={{ width: `${((flashcardIndex + 1) / currentWords.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'quiz') {
    const word = quizWords[quizIndex];
    const displayQuestion = direction === 'fr-cz' ? word.fr : word.cz;
    const displayHint = direction === 'fr-cz' ? 'Napiš český překlad:' : 'Napiš francouzsky:';

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => setMode('menu')}
              className="text-purple-600 font-medium"
            >
              ← Menu
            </button>
            <span className="text-gray-600">
              {quizIndex + 1} / {quizWords.length}
            </span>
            <span className="text-green-600 font-semibold">
              {score} ✓
            </span>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <p className="text-gray-500 text-sm mb-2">{displayHint}</p>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">{word.hint}</span>
              <p className="text-2xl font-bold text-purple-700">{displayQuestion}</p>
            </div>

            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !feedback && checkQuizAnswer()}
              placeholder="Tvoje odpověď..."
              disabled={feedback !== null}
              className="w-full p-4 text-lg border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none disabled:bg-gray-100"
              autoFocus
            />

            {feedback && (
              <div className={`mt-4 p-4 rounded-xl ${
                feedback.type === 'correct' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {feedback.message}
              </div>
            )}

            <div className="mt-6">
              {!feedback ? (
                <button
                  onClick={checkQuizAnswer}
                  className="w-full p-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold"
                >
                  Zkontrolovat
                </button>
              ) : (
                <button
                  onClick={nextQuizQuestion}
                  className="w-full p-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold"
                >
                  {quizIndex < quizWords.length - 1 ? 'Další slovíčko →' : 'Zobrazit výsledky'}
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all"
              style={{ width: `${((quizIndex + 1) / quizWords.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'matching') {
    const allMatched = matchedPairs.length === 6;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => setMode('menu')}
              className="text-purple-600 font-medium"
            >
              ← Menu
            </button>
            <span className="text-green-600 font-semibold text-lg">
              {matchScore} / 6 spojeno
            </span>
          </div>

          {!allMatched ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                {matchPairs.left?.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleMatchClick('left', item)}
                    disabled={matchedPairs.includes(item.pairId)}
                    className={`w-full p-4 rounded-xl font-semibold transition-all ${
                      matchedPairs.includes(item.pairId)
                        ? 'bg-green-100 text-green-600 opacity-50'
                        : selectedLeft?.id === item.id
                        ? 'bg-purple-500 text-white scale-105'
                        : 'bg-white text-purple-700 hover:bg-purple-50 shadow-sm'
                    }`}
                  >
                    {item.text}
                  </button>
                ))}
              </div>
              <div className="space-y-3">
                {matchPairs.right?.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleMatchClick('right', item)}
                    disabled={matchedPairs.includes(item.pairId)}
                    className={`w-full p-4 rounded-xl font-semibold transition-all ${
                      matchedPairs.includes(item.pairId)
                        ? 'bg-green-100 text-green-600 opacity-50'
                        : 'bg-white text-pink-700 hover:bg-pink-50 shadow-sm'
                    }`}
                  >
                    {item.text}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <span className="text-6xl">🎉</span>
              <h3 className="text-2xl font-bold text-purple-700 mt-4">Výborně!</h3>
              <p className="text-gray-600 mt-2">Všechny páry spojeny správně!</p>
              <button
                onClick={() => startMatching(currentCategory)}
                className="mt-6 px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold"
              >
                Hrát znovu
              </button>
            </div>
          )}

          <p className="text-center text-gray-500 mt-4 text-sm">
            Vyber slovíčko vlevo, pak jeho překlad vpravo
          </p>
        </div>
      </div>
    );
  }

  if (mode === 'results') {
    const percentage = Math.round((score / totalAnswered) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <span className="text-6xl">
              {percentage >= 80 ? '🏆' : percentage >= 50 ? '👍' : '💪'}
            </span>
            <h2 className="text-2xl font-bold text-purple-700 mt-4">Výsledky</h2>
            
            <div className="mt-6 p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
              <p className="text-4xl font-bold text-purple-700">
                {score} / {totalAnswered}
              </p>
              <p className="text-lg text-gray-600 mt-2">{percentage}% správně</p>
            </div>

            <p className="mt-6 text-gray-600">
              {percentage >= 80 
                ? 'Skvělá práce! Máš to výborně naučené! 🌟'
                : percentage >= 50
                ? 'Dobrá práce! Ještě trochu procvičuj. 📚'
                : 'Nevzdávej to! Zkus si projít kartičky. 💪'}
            </p>

            <div className="space-y-3 mt-8">
              <button
                onClick={() => startQuiz(currentCategory)}
                className="w-full p-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold"
              >
                Zkusit znovu
              </button>
              <button
                onClick={() => setMode('menu')}
                className="w-full p-4 rounded-xl bg-gray-200 text-gray-700 font-semibold"
              >
                Zpět do menu
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
