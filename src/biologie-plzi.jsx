// @title Biologie - Plži
// @subject Science
// @topic Biology
// @template quiz

import React, { useState, useEffect } from 'react';

const testData = [
  {
    id: 1,
    question: "Tělo plžů se člení na:",
    options: [
      { letter: "a", text: "Hlavu, nohu a útrobní vak", correct: true },
      { letter: "b", text: "Hlavohruď a plášť", correct: false },
      { letter: "c", text: "Lasturu, útrobní vak a hlavu", correct: false },
      { letter: "d", text: "Svalnatou nohu, hlavu, ulitu", correct: false }
    ],
    explanation: "Tělo plžů se skládá ze tří základních částí: hlavy (obsahuje smyslové orgány a ústní otvor s radulou), nohy (svalnatý orgán sloužící k pohybu) a útrobního vaku (obsahuje vnitřní orgány a je krytý ulitou). Hlavohruď je typická pro korýše, ne pro měkkýše.",
    tip: "Zapamatuj si: Hlava → Noha → Útrobní vak = HNU (jako 'hnu se')"
  },
  {
    id: 2,
    question: "Ulita je produkována:",
    options: [
      { letter: "a", text: "Nohou", correct: false },
      { letter: "b", text: "Hlavou", correct: false },
      { letter: "c", text: "Pláštěm", correct: true },
      { letter: "d", text: "Radulou", correct: false }
    ],
    explanation: "Plášť je kožní záhyb, který pokrývá útrobní vak a produkuje vápenatou ulitu. Buňky pláště vylučují uhličitan vápenatý (CaCO₃), který tvoří schránku. Noha slouží k pohybu, hlava obsahuje smysly a radula je struhadlo na potravu.",
    tip: "Plášť = 'továrna na ulitu'. Vylučuje vápník → vzniká schránka."
  },
  {
    id: 3,
    question: "Vnitřní orgány plžů jsou umístěny:",
    options: [
      { letter: "a", text: "V plášťové dutině", correct: false },
      { letter: "b", text: "V útrobním vaku", correct: true },
      { letter: "c", text: "V osrdečníku", correct: false },
      { letter: "d", text: "V kloace", correct: false }
    ],
    explanation: "Útrobní vak (viscerální hmota) obsahuje většinu vnitřních orgánů: trávicí soustavu, vylučovací orgány, pohlavní žlázy a část nervové soustavy. Plášťová dutina je prostor mezi pláštěm a tělem, kde jsou žábry. Osrdečník je pouze obal srdce, kloaka je vyústění u obratlovců.",
    tip: "Útrobní vak = 'batoh s orgány' schovaný v ulitě."
  },
  {
    id: 4,
    question: "Dýchacím ústrojím plžů mohou být:",
    options: [
      { letter: "a", text: "Žábry", correct: true },
      { letter: "b", text: "Ulita", correct: false },
      { letter: "c", text: "Prokrvená stěna plášťové dutiny", correct: true },
      { letter: "d", text: "Spodní strana nohy", correct: false }
    ],
    multipleCorrect: true,
    explanation: "Plži mají dva typy dýchání: Vodní plži (předožábří) dýchají žábrami. Suchozemští a někteří sladkovodní plži (plicnatí) dýchají prokrvenou stěnou plášťové dutiny, která funguje jako primitivní plíce. Ulita je ochranná schránka, nedýchá se jí!",
    tip: "Vodní = žábry 🐟 | Suchozemští = 'plicní vak' (plášťová dutina) 🐌"
  },
  {
    id: 5,
    question: "Cévní soustava plžů:",
    options: [
      { letter: "a", text: "Je otevřená", correct: true },
      { letter: "b", text: "Je uzavřená", correct: false },
      { letter: "c", text: "Mají srdce", correct: true },
      { letter: "d", text: "Ještě nemají vytvořené srdce", correct: false }
    ],
    multipleCorrect: true,
    explanation: "Plži mají OTEVŘENOU cévní soustavu – krev (hemolymfa) volně omývá orgány v tělních dutinách (není stále v cévách). Přesto MAJÍ srdce (obvykle s jednou komorou a 1–2 předsíněmi), které hemolymfu pumpuje. Uzavřenou soustavu mají hlavonožci.",
    tip: "Otevřená soustava + srdce = krev teče 'volně', ale srdce ji pumpuje."
  },
  {
    id: 6,
    question: "Radula je:",
    options: [
      { letter: "a", text: "Forma nervové soustavy hlemýždě", correct: false },
      { letter: "b", text: "Chitinová pilníkovitá páska v ústech plžů", correct: true },
      { letter: "c", text: "Slouží k rozmnožování", correct: false },
      { letter: "d", text: "Slouží k strouhání potravy", correct: true }
    ],
    multipleCorrect: true,
    explanation: "Radula je chitinový pásek pokrytý drobnými zoubky (jako pilník nebo struhadlo). Nachází se v ústech plžů a slouží ke strouhání a rozmělňování potravy – především řas a rostlinných pletiv. Není to nervová soustava ani rozmnožovací orgán!",
    tip: "Radula = 'struhadlo na sýr' v puse šneka 🧀"
  },
  {
    id: 7,
    question: "Okružák ploský je:",
    options: [
      { letter: "a", text: "Předožábrý plž", correct: false },
      { letter: "b", text: "Sladkovodní mlž", correct: false },
      { letter: "c", text: "Plicnatý vodní plž", correct: true },
      { letter: "d", text: "Fosilní suchozemský plž", correct: false }
    ],
    explanation: "Okružák ploský (Planorbarius corneus) je PLICNATÝ plž, který žije ve sladké vodě. I když žije ve vodě, dýchá vzduchem pomocí plášťové dutiny – musí se vynořovat k hladině. Má charakteristickou plochou, spirálovitě stočenou ulitu. Není to mlž (ti mají dvě lastury)!",
    tip: "Okružák = vodní, ale PLICNATÝ (vynoří se nadechnout). Plochá ulita jako 'kroužek'."
  },
  {
    id: 8,
    question: "Pojmenuj plže na obrázcích (přiřazení):",
    isImageQuestion: true,
    images: [
      { id: 1, name: "Plovatka bahenní", description: "Protáhlá špičatá ulita, vodní plicnatý plž" },
      { id: 2, name: "Bahenka živorodá", description: "Kuželovitá ulita s víčkem, předožábrý vodní plž" },
      { id: 3, name: "Okružák ploský", description: "Plochá spirálovitá ulita, plicnatý vodní plž" },
      { id: 4, name: "Páskovka keřová", description: "Kulovitá ulita s pruhy, suchozemský plicnatý plž" }
    ],
    explanation: "Každý druh má charakteristický tvar ulity: Plovatka má protáhlou špičatou ulitu a žije v rybnících. Bahenka má kuželovitou ulitu s víčkem (operculum) a je živorodá. Okružák má plochou spirálu. Páskovka má kulovitou ulitu s barevnými pruhy."
  }
];

const snailSpecies = [
  {
    name: "Plovatka bahenní",
    latin: "Lymnaea stagnalis",
    type: "Plicnatý vodní plž",
    habitat: "Stojaté a pomalu tekoucí vody",
    shell: "Protáhlá, špičatá, pravotočivá",
    size: "4–6 cm",
    features: "Největší evropský sladkovodní plž, dýchá plícemi"
  },
  {
    name: "Bahenka živorodá",
    latin: "Viviparus viviparus",
    type: "Předožábrý vodní plž",
    habitat: "Řeky, rybníky, jezera",
    shell: "Kuželovitá s víčkem (operculum)",
    size: "3–4 cm",
    features: "Živorodá (rodí živá mláďata), dýchá žábrami"
  },
  {
    name: "Okružák ploský",
    latin: "Planorbarius corneus",
    type: "Plicnatý vodní plž",
    habitat: "Stojaté vody s vegetací",
    shell: "Plochá, spirálovitá, levotočivá",
    size: "2–3 cm",
    features: "Hemoglobin v krvi (červená krev), dýchá plícemi"
  },
  {
    name: "Páskovka keřová",
    latin: "Cepaea hortensis",
    type: "Plicnatý suchozemský plž",
    habitat: "Křoviny, zahrady, lesy",
    shell: "Kulovitá s barevnými pruhy",
    size: "1,5–2 cm",
    features: "Variabilní zbarvení (polymorfismus), hermafrodit"
  },
  {
    name: "Hlemýžď zahradní",
    latin: "Helix pomatia",
    type: "Plicnatý suchozemský plž",
    habitat: "Lesy, zahrady, křoviny",
    shell: "Velká kulovitá, hnědavá",
    size: "4–5 cm",
    features: "Největší český suchozemský plž, jedlý druh"
  },
  {
    name: "Slimák popelavý",
    latin: "Limax cinereus",
    type: "Plicnatý suchozemský plž (nahý)",
    habitat: "Vlhké lesy, sklepy",
    shell: "Redukovaná (pod kůží)",
    size: "10–20 cm",
    features: "Nahý plž bez viditelné ulity, noční aktivita"
  }
];

const anatomyTerms = [
  { term: "Útrobní vak", definition: "Část těla obsahující vnitřní orgány, krytá ulitou" },
  { term: "Plášť", definition: "Kožní záhyb produkující ulitu a ohraničující plášťovou dutinu" },
  { term: "Plášťová dutina", definition: "Prostor mezi pláštěm a tělem, obsahuje dýchací orgány" },
  { term: "Radula", definition: "Chitinové struhadlo v ústech pro rozmělňování potravy" },
  { term: "Noha", definition: "Svalnatý orgán na spodní straně těla, slouží k pohybu" },
  { term: "Ulita", definition: "Vápenatá schránka chránící měkké tělo, spirálovitě stočená" },
  { term: "Operculum", definition: "Vápenité nebo rohové víčko uzavírající ústí ulity (u některých druhů)" },
  { term: "Tykadla", definition: "Smyslové orgány na hlavě, obvykle 2 páry (oči na horních)" },
  { term: "Hemolymfa", definition: "Tělní tekutina (krev) proudící v otevřené cévní soustavě" },
  { term: "Hepatopankreas", definition: "Trávicí žláza (játra + slinivka v jednom orgánu)" }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('intro');
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);
  }, []);

  const handleQuizAnswer = (questionId, optionLetter) => {
    const question = testData.find(q => q.id === questionId);
    if (question.multipleCorrect) {
      setSelectedAnswers(prev => {
        if (prev.includes(optionLetter)) {
          return prev.filter(l => l !== optionLetter);
        }
        return [...prev, optionLetter];
      });
    } else {
      setQuizAnswers(prev => ({ ...prev, [questionId]: optionLetter }));
      setTimeout(() => {
        if (currentQuizQuestion < testData.length - 1) {
          setCurrentQuizQuestion(prev => prev + 1);
          setSelectedAnswers([]);
        } else {
          setShowQuizResults(true);
        }
      }, 800);
    }
  };

  const confirmMultipleAnswer = (questionId) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: selectedAnswers }));
    setTimeout(() => {
      if (currentQuizQuestion < testData.length - 1) {
        setCurrentQuizQuestion(prev => prev + 1);
        setSelectedAnswers([]);
      } else {
        setShowQuizResults(true);
      }
    }, 500);
  };

  const calculateScore = () => {
    let correct = 0;
    testData.forEach(question => {
      if (question.isImageQuestion) {
        correct += 1;
        return;
      }
      const userAnswer = quizAnswers[question.id];
      if (question.multipleCorrect) {
        const correctOptions = question.options.filter(o => o.correct).map(o => o.letter);
        if (Array.isArray(userAnswer) && 
            userAnswer.length === correctOptions.length && 
            userAnswer.every(a => correctOptions.includes(a))) {
          correct++;
        }
      } else {
        const correctOption = question.options.find(o => o.correct);
        if (userAnswer === correctOption?.letter) {
          correct++;
        }
      }
    });
    return correct;
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setCurrentQuizQuestion(0);
    setQuizAnswers({});
    setShowQuizResults(false);
    setSelectedAnswers([]);
  };

  const GlassCard = ({ children, className = "", onClick = null, hover = true }) => (
    <div 
      onClick={onClick}
      className={`
        relative backdrop-blur-xl bg-white/10 
        border border-white/20 rounded-2xl
        shadow-[0_8px_32px_rgba(0,0,0,0.12)]
        ${hover ? 'hover:bg-white/15 hover:border-white/30 hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:scale-[1.02]' : ''}
        transition-all duration-300 ease-out
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );

  const TabButton = ({ id, label, icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`
        relative px-4 py-3 rounded-xl font-medium text-sm
        transition-all duration-300 ease-out
        ${activeTab === id 
          ? 'bg-white/20 text-white shadow-lg border border-white/30' 
          : 'text-white/70 hover:text-white hover:bg-white/10'}
      `}
    >
      <span className="flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <span className="hidden sm:inline">{label}</span>
      </span>
      {activeTab === id && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full" />
      )}
    </button>
  );

  const renderIntro = () => (
    <div className="space-y-6">
      <GlassCard className="p-6" hover={false}>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
          <span className="text-3xl">🐌</span>
          Vítej ve studiu plžů!
        </h2>
        <p className="text-white/80 leading-relaxed mb-4">
          Tato aplikace tě kompletně připraví na test z biologie o plžích (Gastropoda). 
          Najdeš zde vzorové řešení testu, podrobná vysvětlení každé odpovědi, přehled druhů a anatomie, 
          a interaktivní kvíz na procvičení.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {[
            { icon: "📝", label: "8 otázek", desc: "v testu" },
            { icon: "🔬", label: "6 druhů", desc: "k poznání" },
            { icon: "🧠", label: "10 pojmů", desc: "anatomie" },
            { icon: "✅", label: "Kvíz", desc: "procvičení" }
          ].map((item, i) => (
            <div key={i} className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-2xl mb-1">{item.icon}</div>
              <div className="text-white font-semibold">{item.label}</div>
              <div className="text-white/50 text-xs">{item.desc}</div>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="p-6" hover={false}>
        <h3 className="text-xl font-bold text-white mb-4">📚 Klíčové informace o plžích</h3>
        <div className="space-y-4 text-white/80">
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30">
            <h4 className="font-semibold text-emerald-300 mb-2">Stavba těla</h4>
            <p>Tělo se člení na <strong className="text-white">hlavu</strong> (smyslové orgány, radula), 
            <strong className="text-white"> nohu</strong> (pohyb) a <strong className="text-white">útrobní vak</strong> (vnitřní orgány v ulitě).</p>
          </div>
          
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
            <h4 className="font-semibold text-blue-300 mb-2">Dýchání</h4>
            <p><strong className="text-white">Předožábří</strong> (vodní) – žábry | <strong className="text-white">Plicnatí</strong> (suchozemští + někteří vodní) – plášťová dutina jako plíce</p>
          </div>
          
          <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
            <h4 className="font-semibold text-purple-300 mb-2">Cévní soustava</h4>
            <p><strong className="text-white">Otevřená</strong> – hemolymfa omývá orgány volně v dutinách. 
            Přesto <strong className="text-white">mají srdce</strong> (1 komora, 1–2 předsíně).</p>
          </div>
          
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30">
            <h4 className="font-semibold text-amber-300 mb-2">Radula & Ulita</h4>
            <p><strong className="text-white">Radula</strong> = chitinové struhadlo na potravu. 
            <strong className="text-white"> Ulita</strong> = vápenatá schránka produkovaná <strong className="text-white">pláštěm</strong>.</p>
          </div>
        </div>
      </GlassCard>

      <div className="flex justify-center">
        <button
          onClick={() => setActiveTab('solutions')}
          className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-2xl
                     shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105
                     transition-all duration-300"
        >
          Začít studovat →
        </button>
      </div>
    </div>
  );

  const renderSolutions = () => (
    <div className="space-y-4">
      <GlassCard className="p-4 mb-6" hover={false}>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span>📝</span> Vzorové řešení testu
        </h2>
        <p className="text-white/60 text-sm mt-1">Klikni na otázku pro zobrazení vysvětlení</p>
      </GlassCard>

      {testData.map((question, index) => (
        <GlassCard 
          key={question.id}
          className="overflow-hidden"
          onClick={() => setExpandedCard(expandedCard === question.id ? null : question.id)}
        >
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 
                            flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {question.id}
              </div>
              <div className="flex-1">
                <h3 className="text-white font-medium">{question.question}</h3>
                
                {question.isImageQuestion ? (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {question.images.map((img, i) => (
                      <div key={i} className="p-2 rounded-lg bg-white/5 border border-white/10">
                        <div className="text-emerald-400 font-semibold text-sm">{i + 1}. {img.name}</div>
                        <div className="text-white/50 text-xs">{img.description}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {question.options.map(option => (
                      <span
                        key={option.letter}
                        className={`
                          px-3 py-1 rounded-lg text-sm font-medium
                          ${option.correct 
                            ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50' 
                            : 'bg-white/5 text-white/50 border border-white/10'}
                        `}
                      >
                        {option.letter}) {option.text}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className={`transform transition-transform duration-300 ${expandedCard === question.id ? 'rotate-180' : ''}`}>
                <svg className="w-5 h-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className={`
            overflow-hidden transition-all duration-300 ease-out
            ${expandedCard === question.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
          `}>
            <div className="p-4 pt-0 border-t border-white/10">
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                <h4 className="text-blue-300 font-semibold mb-2 flex items-center gap-2">
                  <span>💡</span> Vysvětlení
                </h4>
                <p className="text-white/80 text-sm leading-relaxed">{question.explanation}</p>
                {question.tip && (
                  <div className="mt-3 p-2 rounded-lg bg-amber-500/20 border border-amber-500/30">
                    <span className="text-amber-300 text-sm font-medium">🎯 Tip: </span>
                    <span className="text-white/80 text-sm">{question.tip}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  );

  const renderSpecies = () => (
    <div className="space-y-4">
      <GlassCard className="p-4 mb-6" hover={false}>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span>🔬</span> Přehled druhů plžů
        </h2>
        <p className="text-white/60 text-sm mt-1">Druhy, které se objevují v testu a které bys měl znát</p>
      </GlassCard>

      <div className="grid gap-4">
        {snailSpecies.map((species, index) => (
          <GlassCard key={index} className="p-4" hover={false}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400/30 to-teal-500/30 
                            flex items-center justify-center text-2xl flex-shrink-0">
                🐌
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold">{species.name}</h3>
                <p className="text-emerald-400 text-sm italic">{species.latin}</p>
                
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="p-2 rounded-lg bg-white/5">
                    <span className="text-white/50">Typ:</span>
                    <span className="text-white ml-1">{species.type}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5">
                    <span className="text-white/50">Velikost:</span>
                    <span className="text-white ml-1">{species.size}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 col-span-2">
                    <span className="text-white/50">Ulita:</span>
                    <span className="text-white ml-1">{species.shell}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 col-span-2">
                    <span className="text-white/50">Biotop:</span>
                    <span className="text-white ml-1">{species.habitat}</span>
                  </div>
                </div>
                
                <div className="mt-2 p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                  <span className="text-purple-300 text-sm">✨ {species.features}</span>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );

  const renderAnatomy = () => (
    <div className="space-y-4">
      <GlassCard className="p-4 mb-6" hover={false}>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span>🧠</span> Anatomické pojmy
        </h2>
        <p className="text-white/60 text-sm mt-1">Důležité pojmy ze stavby těla plžů</p>
      </GlassCard>

      <div className="grid gap-3">
        {anatomyTerms.map((item, index) => (
          <GlassCard key={index} className="p-4" hover={true}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/30 to-cyan-500/30 
                            flex items-center justify-center text-lg flex-shrink-0">
                {index + 1}
              </div>
              <div>
                <h3 className="text-white font-semibold">{item.term}</h3>
                <p className="text-white/70 text-sm">{item.definition}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );

  const renderQuiz = () => {
    if (!quizStarted) {
      return (
        <GlassCard className="p-8 text-center" hover={false}>
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-2xl font-bold text-white mb-2">Kvíz na procvičení</h2>
          <p className="text-white/70 mb-6">
            Ověř si svoje znalosti! Kvíz obsahuje všech 8 otázek z testu v náhodném pořadí.
          </p>
          <button
            onClick={() => setQuizStarted(true)}
            className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-2xl
                       shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105
                       transition-all duration-300"
          >
            Spustit kvíz →
          </button>
        </GlassCard>
      );
    }

    if (showQuizResults) {
      const score = calculateScore();
      const percentage = Math.round((score / testData.length) * 100);
      
      return (
        <GlassCard className="p-8 text-center" hover={false}>
          <div className="text-6xl mb-4">
            {percentage >= 80 ? '🏆' : percentage >= 60 ? '👍' : '📚'}
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Výsledky kvízu</h2>
          
          <div className="my-6">
            <div className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              {score}/{testData.length}
            </div>
            <div className="text-white/60 mt-1">{percentage}% správně</div>
          </div>

          <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden mb-6">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-1000"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <p className="text-white/80 mb-6">
            {percentage >= 80 
              ? 'Výborně! Jsi skvěle připraven/a na test! 🎉' 
              : percentage >= 60 
                ? 'Dobrá práce! Zkus si ještě projít slabší témata.' 
                : 'Nevadí! Projdi si znovu teorii a zkus to znovu.'}
          </p>

          <div className="flex gap-4 justify-center">
            <button
              onClick={resetQuiz}
              className="px-6 py-3 bg-white/10 text-white font-medium rounded-xl
                         border border-white/20 hover:bg-white/20 transition-all"
            >
              Zkusit znovu
            </button>
            <button
              onClick={() => { resetQuiz(); setActiveTab('solutions'); }}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl
                         shadow-lg hover:scale-105 transition-all"
            >
              Zpět k teorii
            </button>
          </div>
        </GlassCard>
      );
    }

    const question = testData[currentQuizQuestion];
    
    if (question.isImageQuestion) {
      return (
        <GlassCard className="p-6" hover={false}>
          <div className="flex items-center justify-between mb-6">
            <span className="text-white/60 text-sm">Otázka {currentQuizQuestion + 1} z {testData.length}</span>
            <div className="flex gap-1">
              {testData.map((_, i) => (
                <div 
                  key={i} 
                  className={`w-2 h-2 rounded-full ${i === currentQuizQuestion ? 'bg-emerald-400' : i < currentQuizQuestion ? 'bg-emerald-400/50' : 'bg-white/20'}`}
                />
              ))}
            </div>
          </div>

          <h3 className="text-xl font-bold text-white mb-4">{question.question}</h3>
          
          <div className="p-4 rounded-xl bg-amber-500/20 border border-amber-500/30 mb-4">
            <p className="text-amber-200 text-sm">
              ℹ️ Toto je otázka na přiřazení obrázků. V testu budeš mít obrázky 4 plžů a musíš je správně pojmenovat.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {question.images.map((img, i) => (
              <div key={i} className="p-3 rounded-xl bg-white/10 border border-white/20">
                <div className="text-emerald-400 font-bold">{i + 1}. {img.name}</div>
                <div className="text-white/60 text-xs mt-1">{img.description}</div>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              setQuizAnswers(prev => ({ ...prev, [question.id]: 'viewed' }));
              if (currentQuizQuestion < testData.length - 1) {
                setCurrentQuizQuestion(prev => prev + 1);
              } else {
                setShowQuizResults(true);
              }
            }}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl"
          >
            Pokračovat →
          </button>
        </GlassCard>
      );
    }

    return (
      <GlassCard className="p-6" hover={false}>
        <div className="flex items-center justify-between mb-6">
          <span className="text-white/60 text-sm">Otázka {currentQuizQuestion + 1} z {testData.length}</span>
          <div className="flex gap-1">
            {testData.map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full ${i === currentQuizQuestion ? 'bg-emerald-400' : i < currentQuizQuestion ? 'bg-emerald-400/50' : 'bg-white/20'}`}
              />
            ))}
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-2">{question.question}</h3>
        
        {question.multipleCorrect && (
          <p className="text-amber-400 text-sm mb-4">⚠️ Více správných odpovědí – vyber všechny správné</p>
        )}

        <div className="space-y-3 mt-6">
          {question.options.map(option => {
            const isSelected = question.multipleCorrect 
              ? selectedAnswers.includes(option.letter)
              : quizAnswers[question.id] === option.letter;
            
            return (
              <button
                key={option.letter}
                onClick={() => handleQuizAnswer(question.id, option.letter)}
                disabled={!question.multipleCorrect && quizAnswers[question.id]}
                className={`
                  w-full p-4 rounded-xl text-left transition-all duration-300
                  ${isSelected 
                    ? 'bg-emerald-500/30 border-emerald-500/50 text-white' 
                    : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'}
                  border
                `}
              >
                <span className="font-semibold mr-2">{option.letter})</span>
                {option.text}
              </button>
            );
          })}
        </div>

        {question.multipleCorrect && selectedAnswers.length > 0 && (
          <button
            onClick={() => confirmMultipleAnswer(question.id)}
            className="w-full mt-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl"
          >
            Potvrdit výběr ({selectedAnswers.length} vybraných)
          </button>
        )}
      </GlassCard>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-emerald-400/20"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animation: `float ${particle.duration}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`
            }}
          />
        ))}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.2; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.5; }
        }
      `}</style>

      {/* Header */}
      <header className="relative z-10 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-4xl">🐌</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Plži <span className="text-emerald-400">(Gastropoda)</span>
            </h1>
          </div>
          
          {/* Navigation */}
          <div className="flex justify-center gap-2 flex-wrap">
            <TabButton id="intro" label="Úvod" icon="🏠" />
            <TabButton id="solutions" label="Řešení" icon="📝" />
            <TabButton id="species" label="Druhy" icon="🔬" />
            <TabButton id="anatomy" label="Anatomie" icon="🧠" />
            <TabButton id="quiz" label="Kvíz" icon="🎯" />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 p-4 sm:p-6 pb-20">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'intro' && renderIntro()}
          {activeTab === 'solutions' && renderSolutions()}
          {activeTab === 'species' && renderSpecies()}
          {activeTab === 'anatomy' && renderAnatomy()}
          {activeTab === 'quiz' && renderQuiz()}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-4 text-center">
        <p className="text-white/40 text-sm">
          Vytvořeno pro přípravu na test z biologie • {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
