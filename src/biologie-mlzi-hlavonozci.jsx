// @title Biologie - Mlži a hlavonožci
// @subject Biology
// @topic Biology
// @template quiz

import React, { useState, useEffect } from 'react';

const testData = [
  {
    id: 1,
    question: "Tělo mlžů se člení na:",
    options: [
      { letter: "a", text: "Nohu a útrobní vak", correct: true },
      { letter: "b", text: "Hlavohruď a plášť", correct: false },
      { letter: "c", text: "Útrobní vak a hlavu", correct: false },
      { letter: "d", text: "Svalnatou nohu a hlavu", correct: false }
    ],
    explanation: "Mlži jsou BEZHLAVÍ měkkýši (třída Bivalvia = Acephala = 'bez hlavy'). Jejich tělo se skládá pouze z NOHY (klínovitá, slouží k zahrabávání) a ÚTROBNÍHO VAKU (obsahuje vnitřní orgány). Hlavu ztratili v důsledku přizpůsobení se filtrátorskému způsobu života – nepotřebují aktivně hledat potravu, takže ani smyslové orgány na hlavě.",
    tip: "Mlži = BEZ HLAVY! Jen noha + útrobní vak. Vzpomeň si: 'Mlž nemá co přemýšlet – filtruje a hotovo.'"
  },
  {
    id: 2,
    question: "Schránka mlžů:",
    options: [
      { letter: "a", text: "Se spirálovitě stáčí a obsahuje útrobní vak", correct: false },
      { letter: "b", text: "Se skládá ze dvou částí a nazývá se lastura", correct: true },
      { letter: "c", text: "Je spojená vazem", correct: true },
      { letter: "d", text: "Roste spolu s živočichem", correct: true }
    ],
    multipleCorrect: true,
    explanation: "Schránka mlžů = LASTURA se skládá ze DVOU misek (chlopní), které jsou spojeny pružným VAZEM (ligamentem). Lastura roste spolu s živočichem – přirůstají nové vrstvy na okrajích, což vytváří charakteristické přírůstkové linie. Spirálovitě stočená schránka je typická pro PLŽE, ne pro mlže!",
    tip: "Lastura = 2 misky + vaz. Spirála = plži. Mlži mají 'knížku' (dvě chlopně)."
  },
  {
    id: 3,
    question: "Schránka mlžů se zavírá:",
    options: [
      { letter: "a", text: "V okamžiku, kdy mlž vidí blížícího se predátora", correct: false },
      { letter: "b", text: "Pomocí dvou svalů přichycených na misky schránky", correct: true },
      { letter: "c", text: "Pomocí hormonálního systému", correct: false },
      { letter: "d", text: "Reflexivně při podráždění", correct: true }
    ],
    multipleCorrect: true,
    explanation: "Lasturu zavírají DVA SVĚRACÍ SVALY (adduktory) – přední a zadní – které jsou připojeny k oběma miskám. Zavírání je REFLEXIVNÍ reakce na podráždění (dotyk, vibrace, změna světla). Mlži NEMAJÍ oči schopné vidět predátora (mají jen jednoduché světločivné buňky) a hormonální systém není zapojen do rychlého zavírání schránky.",
    tip: "2 svěrací svaly = jako 'kleště'. Reflex = rychlá obrana bez přemýšlení."
  },
  {
    id: 4,
    question: "Dýchacím ústrojím mlžů jsou:",
    options: [
      { letter: "a", text: "Lupenité žábry", correct: true },
      { letter: "b", text: "Jednoduché plíce", correct: false },
      { letter: "c", text: "Plášťová dutina", correct: false },
      { letter: "d", text: "Prokrvená stěna plášťové dutiny", correct: false }
    ],
    explanation: "Mlži dýchají LUPENITÝMI (listovými) ŽÁBRAMI – jsou velké, zploštělé a slouží nejen k dýchání, ale i k FILTRACI potravy. Voda proudí přes žábry, kde se zachycují drobné částice (fytoplankton, bakterie) a zároveň probíhá výměna plynů. Plíce ani prokrvená plášťová dutina nejsou typické pro mlže – to je dýchání suchozemských plžů.",
    tip: "Lupenité žábry = 2v1 (dýchání + filtrace). Představ si 'listy' uvnitř lastury."
  },
  {
    id: 5,
    question: "Z hlediska energie a získávání potravy jsou mlži:",
    options: [
      { letter: "a", text: "Heterotrofové", correct: true },
      { letter: "b", text: "Autotrofové", correct: false },
      { letter: "c", text: "Filtrátoři vody", correct: true },
      { letter: "d", text: "Predátoři", correct: false }
    ],
    multipleCorrect: true,
    explanation: "Mlži jsou HETEROTROFOVÉ (živí se organickou hmotou, kterou neprodukují sami) a zároveň FILTRÁTOŘI – filtrují vodu a zachycují drobné částice potravy (plankton, bakterie, detritus) na žábrách. Autotrofové jsou organismy schopné fotosyntézy (rostliny, řasy). Predátoři aktivně loví kořist – to mlži nedělají.",
    tip: "Heterotrofní filtrátor = 'sedí a čeká, co připluje'. Jako vysavač ve vodě."
  },
  {
    id: 6,
    question: "Ke vzniku perel dochází:",
    options: [
      { letter: "a", text: "V trávicím traktu perlorodky", correct: false },
      { letter: "b", text: "Mezi pláštěm a lasturou", correct: true },
      { letter: "c", text: "Z důvodu obohacení lovců perel při boji s globální sociokulturní nerovností", correct: false },
      { letter: "d", text: "Jako obraný mechanismus při vniknutí cizorodého předmětu (např. zrnička písku)", correct: true }
    ],
    multipleCorrect: true,
    explanation: "Perla vzniká jako OBRANNÝ MECHANISMUS, když mezi plášť a lasturu vnikne cizorodý předmět (zrnko písku, parazit). Plášť reaguje tím, že cizorodé těleso obaluje vrstvami PERLETI (nacre) – stejné látky, kterou vystýlá vnitřek lastury. Postupným vrstvením vzniká perla. Nejedná se o proces v trávicím traktu.",
    tip: "Perla = 'obranná bublina' z perleti kolem vetřelce. Plášť → perleť → perla."
  },
  {
    id: 7,
    question: "Hlavonožci:",
    options: [
      { letter: "a", text: "Jsou nejvyspělejší sladkovodní měkkýši", correct: false },
      { letter: "b", text: "Jsou velikostí největší měkkýši", correct: true },
      { letter: "c", text: "Jsou filtrátoři s dokonalým komorovým okem", correct: false },
      { letter: "d", text: "Nikdy nemají schránku", correct: false }
    ],
    explanation: "Hlavonožci jsou NEJVĚTŠÍ měkkýši na světě – obří krakatice (Architeuthis) dorůstají přes 10 metrů! Jsou to MOŘŠTÍ (ne sladkovodní) živočichové. Nejsou filtrátoři, ale AKTIVNÍ PREDÁTOŘI s vysoce vyvinutým nervovým systémem. Mají dokonalé KOMOROVÉ OKO (podobné lidskému), ale to nesouvisí s filtrací. Někteří MAJÍ schránku – loděnka má vnější ulitu, sépie má sépiovou kost.",
    tip: "Hlavonožci = mořští predátoři, NE filtrátoři. Největší měkkýši (obří krakatice). Loděnka MÁ schránku!"
  },
  {
    id: 8,
    question: "Mezi hlavonožce patří:",
    options: [
      { letter: "a", text: "Chobotnice", correct: true },
      { letter: "b", text: "Slávka", correct: false },
      { letter: "c", text: "Krakatice", correct: true },
      { letter: "d", text: "Motolice", correct: false }
    ],
    multipleCorrect: true,
    explanation: "CHOBOTNICE (Octopus) a KRAKATICE (kalmar, Loligo) jsou hlavonožci – mají chapadla kolem úst, komorové oko a jsou to aktivní predátoři. SLÁVKA je MLŽ (dvě chlopně lastury, filtrační způsob života). MOTOLICE je PLOŠTĚNEC (Platyhelminthes) – parazitický červ, vůbec ne měkkýš!",
    tip: "Hlavonožci = chobotnice, krakatice, sépie, loděnka. Slávka = mlž. Motolice = červ-parazit!"
  },
  {
    id: 9,
    question: "Pojmenuj mlže na obrázcích (1-4):",
    isImageQuestion: true,
    images: [
      { id: 1, name: "Škeble rybničná", latin: "Anodonta cygnea", description: "Velká hladká lastura bez zámku, sladkovodní", hasLock: false },
      { id: 2, name: "Slávka jedlá", latin: "Mytilus edulis", description: "Tmavá protáhlá lastura, mořská, bez zámku", hasLock: false },
      { id: 3, name: "Srdcovka jedlá", latin: "Cerastoderma edule", description: "Srdčitý tvar, radiální žebra, MÁ ZÁMEK", hasLock: true },
      { id: 4, name: "Hřebenatka", latin: "Pecten sp.", description: "Vějířovitý tvar, radiální žebra, MÁ ZÁMEK", hasLock: true }
    ],
    explanation: "Každý druh má charakteristický tvar lastury: Škeble má velkou hladkou lasturu. Slávka má tmavou, protáhlou lasturu (typická mušle). Srdcovka má srdčitý průřez s výraznými žebry. Hřebenatka má typický vějířovitý tvar s 'oušky' u zámku."
  },
  {
    id: 10,
    question: "Napiš, kteří jedinci (1-4) mají tzv. zámek:",
    isLockQuestion: true,
    answer: "3 a 4 (srdcovka a hřebenatka)",
    explanation: "ZÁMEK (kardium) je soustava zubů a jamek na vnitřní straně lastury, která zajišťuje správné zapadnutí obou misek do sebe. Zámek MAJÍ: srdcovka (3) a hřebenatka (4). Zámek NEMAJÍ: škeble (1) a slávka (2) – ty patří mezi mlže s redukovaným nebo chybějícím zámkem (bezzubí mlži u škeblí).",
    tip: "Zámek = 'zuby' na lastuře. Škeble = 'bezzubá'. Srdcovka a hřebenatka = 'ozubené'."
  }
];

const bivalveSpecies = [
  {
    name: "Škeble rybničná",
    latin: "Anodonta cygnea",
    type: "Sladkovodní mlž",
    habitat: "Rybníky, jezera, pomalu tekoucí řeky",
    shell: "Velká (až 20 cm), hladká, bez zámku",
    features: "Bezzubá (Unionidae), larva = glochidie (parazituje na rybách)",
    hasLock: false
  },
  {
    name: "Velevrub malířský",
    latin: "Unio pictorum",
    type: "Sladkovodní mlž",
    habitat: "Řeky, potoky s písčitým dnem",
    shell: "Protáhlá, silnostěnná, se zámkem",
    features: "Perleť se používala na výrobu knoflíků, hostitel larev",
    hasLock: true
  },
  {
    name: "Slávka jedlá",
    latin: "Mytilus edulis",
    type: "Mořský mlž",
    habitat: "Přílivová zóna, skalnaté pobřeží",
    shell: "Tmavě modrá/černá, protáhlá, bez zámku",
    features: "Přichycena byssovými vlákny, jedlá, chov v akvakultuře",
    hasLock: false
  },
  {
    name: "Srdcovka jedlá",
    latin: "Cerastoderma edule",
    type: "Mořský mlž",
    habitat: "Písčité a bahnité dno, přílivová zóna",
    shell: "Srdčitý tvar (při pohledu z boku), radiální žebra, SE ZÁMKEM",
    features: "Jedlá, dokáže 'skákat' pomocí nohy",
    hasLock: true
  },
  {
    name: "Hřebenatka",
    latin: "Pecten sp.",
    type: "Mořský mlž",
    habitat: "Písčité dno, hlubší vody",
    shell: "Vějířovitý tvar, asymetrické misky, 'ouška' u zámku, SE ZÁMKEM",
    features: "Může plavat kmitáním misek, má jednoduché oči na okraji pláště",
    hasLock: true
  },
  {
    name: "Ústřice jedlá",
    latin: "Ostrea edulis",
    type: "Mořský mlž",
    habitat: "Skalnaté dno, ústřicové lavice",
    shell: "Nepravidelná, hrubá, přisedlá",
    features: "Delikatesa, chov v akvakultuře, jedna miska plochá, druhá vypouklá",
    hasLock: false
  },
  {
    name: "Perlorodka říční",
    latin: "Margaritifera margaritifera",
    type: "Sladkovodní mlž",
    habitat: "Čisté oligotrofní potoky",
    shell: "Tmavá, ledvinovitá, silná perleťová vrstva",
    features: "Kriticky ohrožená, žije až 100 let, tvoří sladkovodní perly",
    hasLock: true
  }
];

const cephalopodSpecies = [
  {
    name: "Chobotnice pobřežní",
    latin: "Octopus vulgaris",
    type: "Hlavonožec – osmiramenný",
    habitat: "Mořské dno, skalnaté útesy",
    shell: "Bez schránky (zcela redukována)",
    features: "8 ramen s přísavkami, velmi inteligentní, mění barvu, 3 srdce",
    arms: 8
  },
  {
    name: "Krakatice obecná (kalmar)",
    latin: "Loligo vulgaris",
    type: "Hlavonožec – desetiramenný",
    habitat: "Otevřené moře, pelagická zóna",
    shell: "Vnitřní chitinová pera (gladius)",
    features: "8 ramen + 2 chapadla, rychlý plavec, loví ryby, reaktivní pohyb",
    arms: 10
  },
  {
    name: "Sépie obecná",
    latin: "Sepia officinalis",
    type: "Hlavonožec – desetiramenný",
    habitat: "Pobřežní vody, písčité dno",
    shell: "Vnitřní vápenatá sépiová kost",
    features: "Sépiová kost = zdroj vápníku pro ptáky, inkoust = sépiový pigment",
    arms: 10
  },
  {
    name: "Loděnka hlubinná",
    latin: "Nautilus pompilius",
    type: "Hlavonožec – primitivní",
    habitat: "Hluboké tropické moře",
    shell: "VNĚJŠÍ spirálovitá ulita s komorami",
    features: "Jediný žijící hlavonožec s vnější schránkou, 90+ ramen bez přísavek",
    arms: 90
  },
  {
    name: "Obří krakatice",
    latin: "Architeuthis dux",
    type: "Hlavonožec – desetiramenný",
    habitat: "Hlubiny oceánů",
    shell: "Vnitřní chitinová pera",
    features: "NEJVĚTŠÍ bezobratlý živočich (až 13 m), největší oči v říši živočichů",
    arms: 10
  }
];

const anatomyTerms = [
  { term: "Lastura", definition: "Schránka mlžů složená ze dvou misek (chlopní) spojených vazem", group: "mlži" },
  { term: "Vaz (ligament)", definition: "Pružná spojka mezi miskami lastury, pomáhá otevírat schránku", group: "mlži" },
  { term: "Zámek (kardium)", definition: "Soustava zubů a jamek na lastuře pro přesné zapadnutí misek", group: "mlži" },
  { term: "Svěrací svaly (adduktory)", definition: "Dva svaly zavírající lasturu – přední a zadní", group: "mlži" },
  { term: "Lupenité žábry", definition: "Listovité žábry mlžů sloužící k dýchání i filtraci potravy", group: "mlži" },
  { term: "Plášť", definition: "Kožní záhyb produkující lasturu a ohraničující plášťovou dutinu", group: "mlži" },
  { term: "Sifony", definition: "Trubice (přívodní a odvodní) pro proudění vody u zahrabaných mlžů", group: "mlži" },
  { term: "Byssová vlákna", definition: "Lepkavá vlákna k přichycení na podklad (slávky)", group: "mlži" },
  { term: "Perleť (nacre)", definition: "Duhová vnitřní vrstva lastury, vzniká z ní perla", group: "mlži" },
  { term: "Glochidie", definition: "Larvální stadium sladkovodních mlžů, parazituje na žábrách ryb", group: "mlži" },
  { term: "Chapadla (ramena)", definition: "Svalnaté výběžky kolem úst hlavonožců s přísavkami", group: "hlavonožci" },
  { term: "Nálevka (sifon)", definition: "Trubice pro vypuzování vody = reaktivní pohyb", group: "hlavonožci" },
  { term: "Komorové oko", definition: "Složité oko podobné lidskému, nezávislý vývoj (konvergence)", group: "hlavonožci" },
  { term: "Sépiová kost", definition: "Vnitřní vápenatá schránka sépií", group: "hlavonožci" },
  { term: "Gladius (pero)", definition: "Vnitřní chitinová výztuha těla krakatic", group: "hlavonožci" },
  { term: "Inkoustový váček", definition: "Žláza produkující tmavý inkoust pro únik před predátory", group: "hlavonožci" },
  { term: "Chromatofory", definition: "Pigmentové buňky umožňující rychlou změnu barvy", group: "hlavonožci" }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('intro');
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);
  const [anatomyFilter, setAnatomyFilter] = useState('all');
  const [particles, setParticles] = useState([]);
  const [lockAnswer, setLockAnswer] = useState('');
  
  useEffect(() => {
    const newParticles = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 2,
      duration: Math.random() * 25 + 15,
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
      if (question.isImageQuestion || question.isLockQuestion) {
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
    setLockAnswer('');
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
        relative px-3 py-3 rounded-xl font-medium text-sm
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
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full" />
      )}
    </button>
  );

  const renderIntro = () => (
    <div className="space-y-6">
      <GlassCard className="p-6" hover={false}>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
          <span className="text-3xl">🐚</span>
          Vítej ve studiu mlžů a hlavonožců!
        </h2>
        <p className="text-white/80 leading-relaxed mb-4">
          Tato aplikace tě kompletně připraví na test z biologie o mlžích (Bivalvia) a hlavonožcích (Cephalopoda). 
          Obsahuje vzorové řešení testu, podrobná vysvětlení, přehled druhů, anatomii a interaktivní kvíz.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {[
            { icon: "📝", label: "10 otázek", desc: "v testu" },
            { icon: "🐚", label: "12 druhů", desc: "k poznání" },
            { icon: "🧠", label: "17 pojmů", desc: "anatomie" },
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
        <h3 className="text-xl font-bold text-white mb-4">📚 Klíčové informace</h3>
        <div className="space-y-4 text-white/80">
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
            <h4 className="font-semibold text-blue-300 mb-2">🐚 MLŽI (Bivalvia)</h4>
            <p><strong className="text-white">Bez hlavy!</strong> Tělo = noha + útrobní vak. 
            Lastura ze 2 misek spojených vazem. Lupenité žábry (dýchání + filtrace). 
            Heterotrofní filtrátoři. Zavírání lastury = 2 svěrací svaly + reflex.</p>
          </div>
          
          <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
            <h4 className="font-semibold text-purple-300 mb-2">🦑 HLAVONOŽCI (Cephalopoda)</h4>
            <p><strong className="text-white">Největší měkkýši!</strong> Mořští predátoři (ne sladkovodní, ne filtrátoři). 
            Komorové oko. Některé druhy MAJÍ schránku (loděnka = vnější, sépie = vnitřní). 
            Chobotnice, krakatice, sépie, loděnka.</p>
          </div>
          
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30">
            <h4 className="font-semibold text-amber-300 mb-2">💎 PERLY & ZÁMEK</h4>
            <p><strong className="text-white">Perla</strong> = obranný mechanismus, mezi pláštěm a lasturou, obalení cizorodého předmětu perletí. 
            <strong className="text-white"> Zámek</strong> = zuby na lastuře. Má ho srdcovka a hřebenatka. Škeble a slávka = BEZ zámku.</p>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-6" hover={false}>
        <h3 className="text-xl font-bold text-white mb-4">⚠️ Pozor na záludnosti!</h3>
        <div className="space-y-3">
          {[
            { wrong: "Mlži mají hlavu", right: "Mlži jsou BEZHLAVÍ (Acephala)" },
            { wrong: "Hlavonožci jsou sladkovodní", right: "Hlavonožci jsou MOŘŠTÍ" },
            { wrong: "Hlavonožci nikdy nemají schránku", right: "Loděnka má VNĚJŠÍ schránku, sépie VNITŘNÍ" },
            { wrong: "Hlavonožci jsou filtrátoři", right: "Hlavonožci jsou PREDÁTOŘI" },
            { wrong: "Slávka je hlavonožec", right: "Slávka je MLŽ" },
            { wrong: "Motolice je měkkýš", right: "Motolice je PLOŠTĚNEC (parazitický červ)" }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
              <span className="text-red-400">✗</span>
              <span className="text-red-300/70 line-through text-sm">{item.wrong}</span>
              <span className="text-white/50">→</span>
              <span className="text-green-300 text-sm">{item.right}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      <div className="flex justify-center">
        <button
          onClick={() => setActiveTab('solutions')}
          className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-2xl
                     shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105
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
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 
                            flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {question.id}
              </div>
              <div className="flex-1">
                <h3 className="text-white font-medium">{question.question}</h3>
                
                {question.isImageQuestion ? (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {question.images.map((img, i) => (
                      <div key={i} className={`p-2 rounded-lg border ${img.hasLock ? 'bg-amber-500/10 border-amber-500/30' : 'bg-white/5 border-white/10'}`}>
                        <div className="text-blue-400 font-semibold text-sm">{img.id}. {img.name}</div>
                        <div className="text-white/40 text-xs italic">{img.latin}</div>
                        <div className="text-white/50 text-xs mt-1">{img.description}</div>
                      </div>
                    ))}
                  </div>
                ) : question.isLockQuestion ? (
                  <div className="mt-3 p-3 rounded-lg bg-amber-500/20 border border-amber-500/40">
                    <div className="text-amber-300 font-semibold">Správná odpověď: {question.answer}</div>
                  </div>
                ) : (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {question.options.map(option => (
                      <span
                        key={option.letter}
                        className={`
                          px-3 py-1 rounded-lg text-sm font-medium
                          ${option.correct 
                            ? 'bg-blue-500/30 text-blue-300 border border-blue-500/50' 
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
            ${expandedCard === question.id ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
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
    <div className="space-y-6">
      <GlassCard className="p-4" hover={false}>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span>🐚</span> Mlži (Bivalvia)
        </h2>
        <p className="text-white/60 text-sm mt-1">Druhy mlžů, které se objevují v testu</p>
      </GlassCard>

      <div className="grid gap-4">
        {bivalveSpecies.map((species, index) => (
          <GlassCard key={index} className="p-4" hover={false}>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0
                            ${species.hasLock 
                              ? 'bg-gradient-to-br from-amber-400/30 to-orange-500/30' 
                              : 'bg-gradient-to-br from-blue-400/30 to-cyan-500/30'}`}>
                🐚
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-white font-bold">{species.name}</h3>
                  {species.hasLock ? (
                    <span className="px-2 py-0.5 bg-amber-500/30 text-amber-300 text-xs rounded-full border border-amber-500/50">
                      MÁ ZÁMEK
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-white/10 text-white/50 text-xs rounded-full border border-white/20">
                      bez zámku
                    </span>
                  )}
                </div>
                <p className="text-blue-400 text-sm italic">{species.latin}</p>
                
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="p-2 rounded-lg bg-white/5">
                    <span className="text-white/50">Typ:</span>
                    <span className="text-white ml-1">{species.type}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5">
                    <span className="text-white/50">Biotop:</span>
                    <span className="text-white ml-1">{species.habitat}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 col-span-2">
                    <span className="text-white/50">Lastura:</span>
                    <span className="text-white ml-1">{species.shell}</span>
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

      <GlassCard className="p-4 mt-8" hover={false}>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span>🦑</span> Hlavonožci (Cephalopoda)
        </h2>
        <p className="text-white/60 text-sm mt-1">Mořští predátoři s nejvyspělejším nervovým systémem mezi bezobratlými</p>
      </GlassCard>

      <div className="grid gap-4">
        {cephalopodSpecies.map((species, index) => (
          <GlassCard key={index} className="p-4" hover={false}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400/30 to-pink-500/30 
                            flex items-center justify-center text-2xl flex-shrink-0">
                🦑
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-white font-bold">{species.name}</h3>
                  <span className="px-2 py-0.5 bg-purple-500/30 text-purple-300 text-xs rounded-full border border-purple-500/50">
                    {species.arms} ramen
                  </span>
                </div>
                <p className="text-purple-400 text-sm italic">{species.latin}</p>
                
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="p-2 rounded-lg bg-white/5">
                    <span className="text-white/50">Typ:</span>
                    <span className="text-white ml-1">{species.type}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5">
                    <span className="text-white/50">Biotop:</span>
                    <span className="text-white ml-1">{species.habitat}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 col-span-2">
                    <span className="text-white/50">Schránka:</span>
                    <span className="text-white ml-1">{species.shell}</span>
                  </div>
                </div>
                
                <div className="mt-2 p-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
                  <span className="text-cyan-300 text-sm">✨ {species.features}</span>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );

  const renderAnatomy = () => {
    const filteredTerms = anatomyFilter === 'all' 
      ? anatomyTerms 
      : anatomyTerms.filter(t => t.group === anatomyFilter);

    return (
      <div className="space-y-4">
        <GlassCard className="p-4 mb-6" hover={false}>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🧠</span> Anatomické pojmy
          </h2>
          <p className="text-white/60 text-sm mt-1">Důležité pojmy ze stavby těla mlžů a hlavonožců</p>
          
          <div className="flex gap-2 mt-4">
            {[
              { id: 'all', label: 'Vše', icon: '📚' },
              { id: 'mlži', label: 'Mlži', icon: '🐚' },
              { id: 'hlavonožci', label: 'Hlavonožci', icon: '🦑' }
            ].map(filter => (
              <button
                key={filter.id}
                onClick={(e) => { e.stopPropagation(); setAnatomyFilter(filter.id); }}
                className={`
                  px-3 py-2 rounded-lg text-sm font-medium transition-all
                  ${anatomyFilter === filter.id 
                    ? 'bg-white/20 text-white border border-white/30' 
                    : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'}
                `}
              >
                {filter.icon} {filter.label}
              </button>
            ))}
          </div>
        </GlassCard>

        <div className="grid gap-3">
          {filteredTerms.map((item, index) => (
            <GlassCard key={index} className="p-4" hover={true}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0
                              ${item.group === 'mlži' 
                                ? 'bg-gradient-to-br from-blue-500/30 to-cyan-500/30' 
                                : 'bg-gradient-to-br from-purple-500/30 to-pink-500/30'}`}>
                  {item.group === 'mlži' ? '🐚' : '🦑'}
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
  };

  const renderQuiz = () => {
    if (!quizStarted) {
      return (
        <GlassCard className="p-8 text-center" hover={false}>
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-2xl font-bold text-white mb-2">Kvíz na procvičení</h2>
          <p className="text-white/70 mb-6">
            Ověř si svoje znalosti! Kvíz obsahuje všech 10 otázek z testu včetně otázek s více správnými odpověďmi.
          </p>
          <button
            onClick={() => setQuizStarted(true)}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-2xl
                       shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105
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
            <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {score}/{testData.length}
            </div>
            <div className="text-white/60 mt-1">{percentage}% správně</div>
          </div>

          <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden mb-6">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-1000"
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

          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={resetQuiz}
              className="px-6 py-3 bg-white/10 text-white font-medium rounded-xl
                         border border-white/20 hover:bg-white/20 transition-all"
            >
              Zkusit znovu
            </button>
            <button
              onClick={() => { resetQuiz(); setActiveTab('solutions'); }}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-xl
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
                  className={`w-2 h-2 rounded-full ${i === currentQuizQuestion ? 'bg-blue-400' : i < currentQuizQuestion ? 'bg-blue-400/50' : 'bg-white/20'}`}
                />
              ))}
            </div>
          </div>

          <h3 className="text-xl font-bold text-white mb-4">{question.question}</h3>
          
          <div className="p-4 rounded-xl bg-amber-500/20 border border-amber-500/30 mb-4">
            <p className="text-amber-200 text-sm">
              ℹ️ V testu budeš mít obrázky 4 mlžů a musíš je správně pojmenovat. Zapamatuj si tvary lastur!
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {question.images.map((img, i) => (
              <div key={i} className={`p-3 rounded-xl border ${img.hasLock ? 'bg-amber-500/10 border-amber-500/30' : 'bg-white/10 border-white/20'}`}>
                <div className="text-blue-400 font-bold">{img.id}. {img.name}</div>
                <div className="text-white/50 text-xs italic">{img.latin}</div>
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
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl"
          >
            Pokračovat →
          </button>
        </GlassCard>
      );
    }

    if (question.isLockQuestion) {
      return (
        <GlassCard className="p-6" hover={false}>
          <div className="flex items-center justify-between mb-6">
            <span className="text-white/60 text-sm">Otázka {currentQuizQuestion + 1} z {testData.length}</span>
            <div className="flex gap-1">
              {testData.map((_, i) => (
                <div 
                  key={i} 
                  className={`w-2 h-2 rounded-full ${i === currentQuizQuestion ? 'bg-blue-400' : i < currentQuizQuestion ? 'bg-blue-400/50' : 'bg-white/20'}`}
                />
              ))}
            </div>
          </div>

          <h3 className="text-xl font-bold text-white mb-4">{question.question}</h3>
          
          <div className="p-4 rounded-xl bg-blue-500/20 border border-blue-500/30 mb-4">
            <p className="text-blue-200 text-sm mb-3">
              💡 Připomenutí: Zámek mají mlži s "ozubenými" lasturami pro přesné zapadnutí.
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="p-2 rounded bg-white/10">1. Škeble rybničná</div>
              <div className="p-2 rounded bg-white/10">2. Slávka jedlá</div>
              <div className="p-2 rounded bg-amber-500/20 border border-amber-500/30">3. Srdcovka jedlá</div>
              <div className="p-2 rounded bg-amber-500/20 border border-amber-500/30">4. Hřebenatka</div>
            </div>
          </div>

          <div className="mb-4">
            <input
              type="text"
              value={lockAnswer}
              onChange={(e) => setLockAnswer(e.target.value)}
              placeholder="Napiš čísla (např. 3, 4)"
              className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40
                       focus:outline-none focus:border-blue-500/50"
            />
          </div>

          <button
            onClick={() => {
              setQuizAnswers(prev => ({ ...prev, [question.id]: lockAnswer }));
              if (currentQuizQuestion < testData.length - 1) {
                setCurrentQuizQuestion(prev => prev + 1);
                setLockAnswer('');
              } else {
                setShowQuizResults(true);
              }
            }}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl"
          >
            Pokračovat →
          </button>
          
          <div className="mt-4 p-3 rounded-lg bg-green-500/20 border border-green-500/30">
            <span className="text-green-300 text-sm">✓ Správná odpověď: <strong>3 a 4</strong> (srdcovka a hřebenatka)</span>
          </div>
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
                className={`w-2 h-2 rounded-full ${i === currentQuizQuestion ? 'bg-blue-400' : i < currentQuizQuestion ? 'bg-blue-400/50' : 'bg-white/20'}`}
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
                    ? 'bg-blue-500/30 border-blue-500/50 text-white' 
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
            className="w-full mt-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl"
          >
            Potvrdit výběr ({selectedAnswers.length} vybraných)
          </button>
        )}
      </GlassCard>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-blue-400/20"
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
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.2; }
          50% { transform: translateY(-30px) translateX(15px); opacity: 0.5; }
        }
      `}</style>

      {/* Header */}
      <header className="relative z-10 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-4xl">🐚</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Mlži <span className="text-blue-400">&</span> Hlavonožci
            </h1>
            <span className="text-4xl">🦑</span>
          </div>
          
          {/* Navigation */}
          <div className="flex justify-center gap-1 sm:gap-2 flex-wrap">
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
