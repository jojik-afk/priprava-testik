// @title Chemie - Chemické rovnováhy
// @subject Chemistry
// @topic Chemistry
// @template practice

import React, { useState, useEffect } from 'react';

const App = () => {
  const [activeTab, setActiveTab] = useState('theory');
  const [activeTheorySection, setActiveTheorySection] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showResults, setShowResults] = useState({});
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [calculatorValues, setCalculatorValues] = useState({
    c1: '', c2: '', c3: '', c4: '', exp1: '1', exp2: '1', exp3: '1', exp4: '1'
  });
  const [calculatedK, setCalculatedK] = useState(null);

  const theorySections = [
    {
      title: "Základy chemické rovnováhy",
      icon: "⚗️",
      content: [
        {
          subtitle: "Co je chemická rovnováha?",
          text: "Chemická rovnováha je dynamický stav, kdy rychlost přímé reakce se rovná rychlosti zpětné reakce. Koncentrace reaktantů a produktů se nemění, ale reakce stále probíhá oběma směry.",
          formula: "v₁ = v₂ (rychlost přímé = rychlost zpětné)"
        },
        {
          subtitle: "Zákon chemické rovnováhy (Guldberg-Waageův zákon)",
          text: "Pro obecnou reakci aA + bB ⇌ cC + dD platí, že rovnovážná konstanta K je podíl součinu koncentrací produktů a reaktantů, každá umocněná na příslušný stechiometrický koeficient.",
          formula: "K = [C]ᶜ · [D]ᵈ / [A]ᵃ · [B]ᵇ"
        },
        {
          subtitle: "Důležité pravidlo",
          text: "Do výrazu pro K zahrnujeme pouze plyny (g) a rozpuštěné látky (aq). Pevné látky (s) a čisté kapaliny (l) se do výrazu pro K nezahrnují, protože jejich 'koncentrace' je konstantní.",
          formula: "Příklad: CaCO₃(s) ⇌ CaO(s) + CO₂(g) → K = [CO₂]"
        }
      ]
    },
    {
      title: "Význam hodnoty K",
      icon: "📊",
      content: [
        {
          subtitle: "K >> 1 (velká hodnota)",
          text: "Rovnováha je posunuta ve prospěch produktů. V rovnovážné směsi převažují produkty nad reaktanty. Reakce probíhá téměř úplně.",
          formula: "Příklad: SO₂ + ½O₂ ⇌ SO₃, K = 1,2·10²² → převažuje SO₃"
        },
        {
          subtitle: "K << 1 (malá hodnota)",
          text: "Rovnováha je posunuta ve prospěch reaktantů. V rovnovážné směsi převažují reaktanty nad produkty. Reakce téměř neprobíhá.",
          formula: "Příklad: HF ⇌ H₂ + F₂, K = 1,1·10⁻¹³ → převažuje HF"
        },
        {
          subtitle: "K ≈ 1",
          text: "Koncentrace reaktantů a produktů jsou srovnatelné. Ani jedna strana výrazně nepřevažuje.",
          formula: "K = 1 → [produkty] ≈ [reaktanty]"
        }
      ]
    },
    {
      title: "Le Chatelierův princip",
      icon: "⚖️",
      content: [
        {
          subtitle: "Základní formulace",
          text: "Jestliže na systém v rovnováze působí vnější změna, systém se snaží této změně čelit tak, aby její účinek zmenšil. Rovnováha se posune ve směru, který změnu kompenzuje.",
          formula: "Změna → Systém reaguje proti změně"
        },
        {
          subtitle: "Vnější podmínky ovlivňující rovnováhu",
          text: "Rovnovážný stav závisí na: a) teplotě, b) tlaku (u plynů), c) koncentraci reaktantů/produktů, d) objemu nádoby. Katalyzátor rovnováhu NEOVLIVŇUJE - pouze urychlí její dosažení.",
          formula: "Katalyzátor → zrychlí v₁ i v₂ stejně → K se nemění"
        }
      ]
    },
    {
      title: "Vliv koncentrace",
      icon: "🧪",
      content: [
        {
          subtitle: "Přidání látky",
          text: "Přidáme-li reaktant, rovnováha se posune doprava (k produktům). Přidáme-li produkt, rovnováha se posune doleva (k reaktantům).",
          formula: "A + B ⇌ C: přidání A → více C"
        },
        {
          subtitle: "Odebrání látky",
          text: "Odebereme-li reaktant, rovnováha se posune doleva. Odebereme-li produkt, rovnováha se posune doprava.",
          formula: "A + B ⇌ C: odebrání C → více C se tvoří"
        },
        {
          subtitle: "Praktický příklad",
          text: "CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O: Odebíráme-li vodu, množství esteru se ZVĚTŠÍ, protože rovnováha se posune doprava.",
          formula: "Odebrání produktu → posun doprava → více esteru"
        }
      ]
    },
    {
      title: "Vliv tlaku a objemu",
      icon: "📈",
      content: [
        {
          subtitle: "Základní pravidlo",
          text: "Změna tlaku ovlivňuje pouze rovnováhy, kde se mění počet molů plynných látek. Zvýšení tlaku posune rovnováhu na stranu s MÉNĚ moly plynu.",
          formula: "↑p → posun k menšímu počtu molů plynu"
        },
        {
          subtitle: "Kdy tlak NEMÁ vliv",
          text: "Pokud je stejný počet molů plynu na obou stranách rovnice, změna tlaku rovnováhu neovlivní.",
          formula: "H₂(g) + I₂(g) ⇌ 2HI(g): 2 moly ↔ 2 moly → tlak nemá vliv"
        },
        {
          subtitle: "Příklady",
          text: "2SO₂(g) + O₂(g) ⇌ 2SO₃(g): 3 moly → 2 moly. Zvýšení tlaku posune rovnováhu DOPRAVA (k SO₃). N₂O₄(g) ⇌ 2NO₂(g): 1 mol → 2 moly. Zvýšení tlaku posune rovnováhu DOLEVA (k N₂O₄).",
          formula: "↑p → méně molů plynu"
        }
      ]
    },
    {
      title: "Vliv teploty",
      icon: "🌡️",
      content: [
        {
          subtitle: "Exotermická reakce (Q < 0, ΔH < 0)",
          text: "Teplo je 'produktem' reakce. Zvýšení teploty posune rovnováhu DOLEVA (zpětná reakce). Hodnota K při vyšší teplotě KLESÁ.",
          formula: "A + B ⇌ C + teplo: ↑T → posun doleva, K klesá"
        },
        {
          subtitle: "Endotermická reakce (Q > 0, ΔH > 0)",
          text: "Teplo je 'reaktantem'. Zvýšení teploty posune rovnováhu DOPRAVA (přímá reakce). Hodnota K při vyšší teplotě ROSTE.",
          formula: "A + B + teplo ⇌ C: ↑T → posun doprava, K roste"
        },
        {
          subtitle: "Jak určit typ reakce z K",
          text: "Pokud K při vyšší teplotě klesá → reakce je exotermická. Pokud K při vyšší teplotě roste → reakce je endotermická.",
          formula: "H₂ + I₂ ⇌ 2HI: K(633K)=66,5 > K(713K)=50,6 → exotermická"
        }
      ]
    },
    {
      title: "Výpočty s K",
      icon: "🔢",
      content: [
        {
          subtitle: "Výpočet K z koncentrací",
          text: "Dosadíme rovnovážné koncentrace do výrazu pro K a vypočítáme.",
          formula: "C(s) + CO₂(g) ⇌ 2CO(g): K = p(CO)²/p(CO₂) = 810,6²/405,3 = 1621,2"
        },
        {
          subtitle: "Zpětná reakce",
          text: "Rovnovážná konstanta zpětné reakce je PŘEVRÁCENÁ hodnota K přímé reakce.",
          formula: "K(zpětná) = 1/K(přímá)"
        },
        {
          subtitle: "Násobení reakce koeficientem",
          text: "Vynásobíme-li celou rovnici číslem n, K se umocní na n.",
          formula: "Původní: K₁, nová reakce: K = K₁ⁿ"
        },
        {
          subtitle: "Příklad: H₂ + Br₂ ⇌ 2HBr, K = 1,6·10⁵",
          text: "a) Rozklad HBr (zpětná): K = 1/(1,6·10⁵) = 6,25·10⁻⁶\nb) Reakce 0,5H₂ + 0,5Br₂ ⇌ HBr: K = √(1,6·10⁵) = 400",
          formula: "½ reakce → K = √K₁"
        }
      ]
    },
    {
      title: "Rychlost reakce",
      icon: "⚡",
      content: [
        {
          subtitle: "Kinetická rovnice",
          text: "Rychlost reakce závisí na koncentracích reaktantů umocněných na příslušné koeficienty.",
          formula: "v = k · [A]ᵃ · [B]ᵇ"
        },
        {
          subtitle: "Příklad z pracovního listu",
          text: "H₂ + Br₂ ⇌ 2HBr: Zvýšíme-li 2× koncentraci H₂ i Br₂, jak se změní rychlost?",
          formula: "v = k·[H₂]·[Br₂] → v' = k·(2[H₂])·(2[Br₂]) = 4v → rychlost se zvýší 4×"
        }
      ]
    }
  ];

  const quizQuestions = [
    {
      id: 1,
      category: "Výraz pro K",
      question: "Napište rovnovážnou konstantu pro reakci: NH₃ + H₃O⁺ ⇌ NH₄⁺ + H₂O",
      options: [
        "K = [NH₄⁺]/([NH₃]·[H₃O⁺])",
        "K = [NH₄⁺]·[H₂O]/([NH₃]·[H₃O⁺])",
        "K = [NH₃]·[H₃O⁺]/[NH₄⁺]",
        "K = [NH₄⁺]·[NH₃]/[H₃O⁺]"
      ],
      correct: 0,
      explanation: "H₂O je čistá kapalina, nezahrnuje se do K. Produkty jsou v čitateli, reaktanty ve jmenovateli."
    },
    {
      id: 2,
      category: "Výraz pro K",
      question: "Napište rovnovážnou konstantu pro reakci: 2H₂ + O₂ ⇌ 2H₂O",
      options: [
        "K = [H₂O]/([H₂]·[O₂])",
        "K = [H₂O]²/([H₂]²·[O₂])",
        "K = [H₂]²·[O₂]/[H₂O]²",
        "K = 2[H₂O]/(2[H₂]·[O₂])"
      ],
      correct: 1,
      explanation: "Koncentrace se umocňují na stechiometrické koeficienty: [H₂O]² v čitateli, [H₂]²·[O₂] ve jmenovateli."
    },
    {
      id: 3,
      category: "Význam K",
      question: "SO₂ + ½O₂ ⇌ SO₃, K = 1,2·10²². Jaký je převažující směr reakce?",
      options: [
        "Převažuje zpětná reakce (rozklad SO₃)",
        "Převažuje přímá reakce (vznik SO₃)",
        "Reaktanty a produkty jsou v rovnováze",
        "Nelze určit bez dalších údajů"
      ],
      correct: 1,
      explanation: "K >> 1 znamená, že v rovnováze převažují produkty (SO₃). Reakce probíhá téměř úplně doprava."
    },
    {
      id: 4,
      category: "Význam K",
      question: "HF ⇌ H₂ + F₂, K = 1,1·10⁻¹³. Jaký je převažující směr reakce?",
      options: [
        "Převažuje přímá reakce (rozklad HF)",
        "Převažuje zpětná reakce (HF se téměř nerozkládá)",
        "Reakce je v úplné rovnováze",
        "Reakce vůbec neprobíhá"
      ],
      correct: 1,
      explanation: "K << 1 znamená, že v rovnováze převažují reaktanty (HF). HF se téměř nerozkládá."
    },
    {
      id: 5,
      category: "Le Chatelier",
      question: "CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O. Začneme-li odebírat vodu, množství esteru se:",
      options: [
        "Zmenší",
        "Nezmění",
        "Zvětší",
        "Nejprve zmenší, pak zvětší"
      ],
      correct: 2,
      explanation: "Odebíráním produktu (vody) se rovnováha posune doprava, vzniká více esteru."
    },
    {
      id: 6,
      category: "Výpočet K",
      question: "C(s) + CO₂(g) ⇌ 2CO(g). Při rovnováze: p(CO) = 810,6 kPa, p(CO₂) = 405,3 kPa. Jaká je K?",
      options: [
        "K = 2,0",
        "K = 0,5",
        "K = 1621,2",
        "K = 810,6"
      ],
      correct: 2,
      explanation: "K = p(CO)²/p(CO₂) = (810,6)²/405,3 = 657072,36/405,3 ≈ 1621,2. Uhlík je pevná látka, nezahrnuje se."
    },
    {
      id: 7,
      category: "Vlastnosti K",
      question: "Které tvrzení o rovnovážné konstantě je SPRÁVNÉ?",
      options: [
        "K není závislá na teplotě",
        "Katalyzátor změní hodnotu K",
        "K je závislá na teplotě, katalyzátor ji nezmění",
        "Prohozením reaktantů a produktů se K nezmění"
      ],
      correct: 2,
      explanation: "K závisí na teplotě. Katalyzátor pouze urychlí dosažení rovnováhy, ale hodnotu K nezmění."
    },
    {
      id: 8,
      category: "Vliv tlaku",
      question: "Na kterou rovnováhu NEMÁ vliv změna tlaku?",
      options: [
        "2NO₂(g) ⇌ N₂O₄(g)",
        "H₂(g) + I₂(g) ⇌ 2HI(g)",
        "2SO₂(g) + O₂(g) ⇌ 2SO₃(g)",
        "2HgO(s) ⇌ 2Hg(l) + O₂(g)"
      ],
      correct: 1,
      explanation: "H₂ + I₂ ⇌ 2HI má stejný počet molů plynu na obou stranách (2 = 2), proto tlak nemá vliv."
    },
    {
      id: 9,
      category: "Vliv teploty",
      question: "CaCO₃(s) ⇌ CaO(s) + CO₂(g), Q = 178 kJ/mol. Jak zvýšíme výtěžek CaO?",
      options: [
        "Přidáním dalšího vápence",
        "Snížením teploty",
        "Odváděním CO₂ z nádoby",
        "Zmenšením objemu nádoby"
      ],
      correct: 2,
      explanation: "Reakce je endotermická (Q > 0). Odváděním CO₂ se rovnováha posune doprava. Přidání vápence (pevná látka) nemá vliv."
    },
    {
      id: 10,
      category: "Výpočet K",
      question: "H₂ + Br₂ ⇌ 2HBr, K = 1,6·10⁵. Jaká je K pro rozklad bromovodíku?",
      options: [
        "K = 1,6·10⁵",
        "K = 6,25·10⁻⁶",
        "K = 400",
        "K = 2,56·10¹⁰"
      ],
      correct: 1,
      explanation: "Rozklad je zpětná reakce. K(zpětná) = 1/K(přímá) = 1/(1,6·10⁵) = 6,25·10⁻⁶"
    },
    {
      id: 11,
      category: "Výpočet K",
      question: "H₂ + Br₂ ⇌ 2HBr, K = 1,6·10⁵. Jaká je K pro reakci: 0,5H₂ + 0,5Br₂ ⇌ HBr?",
      options: [
        "K = 8·10⁴",
        "K = 3,2·10⁵",
        "K = 400",
        "K = 2,56·10¹⁰"
      ],
      correct: 2,
      explanation: "Když vynásobíme reakci ½, K se odmocní: K' = √K = √(1,6·10⁵) = √160000 = 400"
    },
    {
      id: 12,
      category: "Rychlost reakce",
      question: "H₂ + Br₂ ⇌ 2HBr. Jak se změní rychlost, zvýšíme-li 2× koncentraci H₂ i Br₂?",
      options: [
        "Zvýší se 2×",
        "Zvýší se 4×",
        "Sníží se 4×",
        "Nezmění se"
      ],
      correct: 1,
      explanation: "v = k·[H₂]·[Br₂]. Po zdvojnásobení: v' = k·(2[H₂])·(2[Br₂]) = 4·k·[H₂]·[Br₂] = 4v"
    },
    {
      id: 13,
      category: "Vliv teploty",
      question: "H₂ + I₂ ⇌ 2HI: K(633K) = 66,5, K(713K) = 50,6. Je reakce exo- nebo endotermická?",
      options: [
        "Endotermická (Q > 0)",
        "Exotermická (Q < 0)",
        "Ani jedno",
        "Nelze určit"
      ],
      correct: 1,
      explanation: "K klesá se zvyšující teplotou → reakce je exotermická. Vyšší teplota posouvá rovnováhu doleva."
    },
    {
      id: 14,
      category: "Le Chatelier",
      question: "2SO₂ + O₂ ⇌ 2SO₃, ΔH = -190 kJ/mol. Jak zvýšit koncentraci SO₃?",
      options: [
        "Přidat O₂, snížit teplotu, zvýšit tlak",
        "Přidat O₂, zvýšit teplotu, snížit tlak",
        "Odebrat SO₂, zvýšit teplotu, zvýšit tlak",
        "Snížit tlak, snížit teplotu, odebrat O₂"
      ],
      correct: 0,
      explanation: "Exotermická reakce → snížení T posune doprava. Přidání O₂ posune doprava. 3 moly → 2 moly → ↑p posune doprava."
    },
    {
      id: 15,
      category: "Vliv teploty",
      question: "2NaHCO₃ ⇌ Na₂CO₃ + H₂O + CO₂, Q = 84,9 kJ/mol. Kam se posune rovnováha při zvýšení T?",
      options: [
        "Doleva (k NaHCO₃)",
        "Doprava (k produktům)",
        "Neposune se",
        "Závisí na tlaku"
      ],
      correct: 1,
      explanation: "Q > 0 → endotermická reakce. Zvýšení teploty podporuje endotermické děje → posun doprava."
    },
    {
      id: 16,
      category: "Vliv teploty",
      question: "N₂O₄ ⇌ 2NO₂, Q = 57,1 kJ/mol. Kam se posune rovnováha při zvýšení T?",
      options: [
        "Doleva (k N₂O₄)",
        "Doprava (k NO₂)",
        "Neposune se",
        "Závisí na tlaku"
      ],
      correct: 1,
      explanation: "Q > 0 → endotermická reakce. Teplo je 'reaktantem'. Zvýšení T → více NO₂."
    },
    {
      id: 17,
      category: "Le Chatelier",
      question: "H₂ + I₂ ⇌ 2HI, Q = +12,5 kJ. Co se stane při snížení tlaku?",
      options: [
        "Posun doleva",
        "Posun doprava",
        "Nic (bez změny)",
        "Rozklad systému"
      ],
      correct: 2,
      explanation: "Na obou stranách jsou 2 moly plynu (1+1 = 2). Změna tlaku nemá vliv na tuto rovnováhu."
    },
    {
      id: 18,
      category: "Le Chatelier",
      question: "H₂ + I₂ ⇌ 2HI, Q = +12,5 kJ. Co se stane při zvýšení teploty?",
      options: [
        "Posun doleva (k H₂ a I₂)",
        "Posun doprava (k HI)",
        "Nic",
        "Nelze určit"
      ],
      correct: 0,
      explanation: "Q > 0 znamená, že přímá reakce je exotermická. Zvýšení T posune rovnováhu doleva (k reaktantům)."
    },
    {
      id: 19,
      category: "Le Chatelier",
      question: "CO + 2H₂ ⇌ CH₃OH, Q = 256 kJ/mol. Kam se posune při zvýšení tlaku?",
      options: [
        "Doleva (k CO a H₂)",
        "Doprava (k CH₃OH)",
        "Bez změny",
        "Závisí na teplotě"
      ],
      correct: 1,
      explanation: "3 moly plynu → 1 mol plynu. Zvýšení tlaku posune rovnováhu na stranu s méně moly → doprava."
    },
    {
      id: 20,
      category: "Tabulka K",
      question: "H₂(g) + F₂(g) ⇌ 2HF(g). [H₂]=2,33·10⁻³, [F₂]=3,73·10⁻³, [HF]=15,29·10⁻³. Jaká je K?",
      options: [
        "K = 26,9",
        "K = 53,8",
        "K = 26,2",
        "K = 107,6"
      ],
      correct: 0,
      explanation: "K = [HF]²/([H₂]·[F₂]) = (15,29·10⁻³)²/(2,33·10⁻³ · 3,73·10⁻³) = 2,34·10⁻⁴/8,69·10⁻⁶ ≈ 26,9"
    },
    {
      id: 21,
      category: "Vliv teploty",
      question: "Při rovnováze tuhá látka ⇌ kapalina (tání) způsobí dodání tepla:",
      options: [
        "Snížení množství tuhé látky (posun doprava)",
        "Snížení množství kapaliny",
        "Pokles teploty",
        "Žádnou změnu"
      ],
      correct: 0,
      explanation: "Tání je endotermický děj. Dodání tepla posune rovnováhu doprava → více kapaliny, méně pevné látky."
    },
    {
      id: 22,
      category: "Le Chatelier",
      question: "SO₂ + O₂ ⇌ SO₃, Q = -190 kJ/mol. Jak dosáhnout největšího výtěžku SO₃?",
      options: [
        "Zvýšit teplotu, zmenšit objem",
        "Snížit teplotu, odstraňovat SO₃",
        "Zvýšit teplotu, odstraňovat SO₃",
        "Snížit teplotu, zvětšit objem"
      ],
      correct: 1,
      explanation: "Exotermická → snížení T posune doprava. Odstraňování SO₃ také posune doprava."
    },
    {
      id: 23,
      category: "Dynamická rovnováha",
      question: "Který systém je v dynamické rovnováze?",
      options: [
        "Otevřená láhev neperlivé vody",
        "Pevný NaCl v jeho nasyceném roztoku při konstantní T",
        "Zinek v kádince se zředěnou HCl",
        "Všechny uvedené"
      ],
      correct: 1,
      explanation: "Nasycený roztok při konstantní T je v dynamické rovnováze - rozpouštění a krystalizace probíhají stejnou rychlostí."
    },
    {
      id: 24,
      category: "Definice rovnováhy",
      question: "Které tvrzení o chemické rovnováze je SPRÁVNÉ?",
      options: [
        "Rychlost přímé reakce je větší než počáteční rychlost",
        "Koncentrace eduktů = koncentrace produktů",
        "Koncentrace produktů se nemění",
        "Koncentrace produktů stále roste"
      ],
      correct: 2,
      explanation: "V rovnováze se koncentrace nemění (jsou konstantní), i když reakce stále probíhá oběma směry."
    }
  ];

  const handleAnswer = (questionId, answerIndex) => {
    if (showResults[questionId]) return;
    
    setQuizAnswers(prev => ({...prev, [questionId]: answerIndex}));
    setShowResults(prev => ({...prev, [questionId]: true}));
    
    const question = quizQuestions.find(q => q.id === questionId);
    if (answerIndex === question.correct) {
      setScore(prev => prev + 1);
    }
    setTotalAnswered(prev => prev + 1);
  };

  const resetQuiz = () => {
    setQuizAnswers({});
    setShowResults({});
    setScore(0);
    setTotalAnswered(0);
  };

  const calculateK = () => {
    const { c1, c2, c3, c4, exp1, exp2, exp3, exp4 } = calculatorValues;
    if (!c1 || !c2) return;
    
    const numerator = (c1 ? Math.pow(parseFloat(c1), parseInt(exp1) || 1) : 1) * 
                     (c2 ? Math.pow(parseFloat(c2), parseInt(exp2) || 1) : 1);
    const denominator = (c3 ? Math.pow(parseFloat(c3), parseInt(exp3) || 1) : 1) * 
                       (c4 ? Math.pow(parseFloat(c4), parseInt(exp4) || 1) : 1);
    
    if (denominator !== 0) {
      setCalculatedK(numerator / denominator);
    }
  };

  const categories = [...new Set(quizQuestions.map(q => q.category))];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0c0c1e 0%, #1a1a3e 25%, #0d2847 50%, #1a3a5c 75%, #0c0c1e 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 40s ease infinite',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      color: '#e0e6ed',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <style>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          transition: all 0.5s ease;
        }
        .glass-card:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }
        .tab-btn {
          padding: 14px 28px;
          border: none;
          background: rgba(255, 255, 255, 0.05);
          color: #8892a0;
          border-radius: 12px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 500;
          transition: all 0.4s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .tab-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }
        .tab-btn.active {
          background: linear-gradient(135deg, #4f46e5, #6366f1);
          color: #fff;
          box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
        }
        .theory-nav {
          padding: 10px 16px;
          border: none;
          background: transparent;
          color: #8892a0;
          border-radius: 10px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.4s;
          text-align: left;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .theory-nav:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #c4cad3;
        }
        .theory-nav.active {
          background: rgba(99, 102, 241, 0.2);
          color: #a5b4fc;
        }
        .quiz-option {
          padding: 14px 18px;
          border: 2px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.4s;
          font-size: 14px;
          line-height: 1.5;
        }
        .quiz-option:hover:not(.disabled) {
          border-color: rgba(99, 102, 241, 0.5);
          background: rgba(99, 102, 241, 0.1);
        }
        .quiz-option.correct {
          border-color: #22c55e;
          background: rgba(34, 197, 94, 0.15);
        }
        .quiz-option.incorrect {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.15);
        }
        .quiz-option.disabled {
          cursor: default;
          opacity: 0.7;
        }
        .formula-box {
          background: rgba(0, 0, 0, 0.3);
          border-left: 4px solid #6366f1;
          padding: 16px 20px;
          border-radius: 0 12px 12px 0;
          font-family: 'Courier New', monospace;
          font-size: 15px;
          color: #a5b4fc;
          margin: 12px 0;
        }
        .calc-input {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 10px 14px;
          color: #fff;
          font-size: 14px;
          width: 100%;
          outline: none;
          transition: all 0.4s;
        }
        .calc-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
        }
        .calc-btn {
          background: linear-gradient(135deg, #4f46e5, #6366f1);
          border: none;
          padding: 12px 24px;
          border-radius: 10px;
          color: #fff;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.4s;
        }
        .calc-btn:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
        }
        .molecule {
          position: absolute;
          font-size: 24px;
          opacity: 0.15;
          animation: float 15s ease-in-out infinite;
          pointer-events: none;
        }
        .progress-bar {
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #22c55e, #4ade80);
          transition: width 0.8s ease;
          border-radius: 3px;
        }
      `}</style>

      {/* Floating molecules background */}
      {['⚗️', '🧪', '⚛️', '🔬', '💎', '🌡️'].map((emoji, i) => (
        <div key={i} className="molecule" style={{
          top: `${10 + i * 15}%`,
          left: `${5 + i * 16}%`,
          animationDelay: `${i * 1.5}s`,
          fontSize: `${20 + i * 4}px`
        }}>{emoji}</div>
      ))}

      {/* Header */}
      <div style={{
        padding: '30px 40px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #fff, #a5b4fc)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: 0
        }}>
          ⚗️ Chemická rovnováha
        </h1>
        <p style={{ color: '#8892a0', marginTop: '8px', fontSize: '15px' }}>
          Kompletní průvodce pro přípravu na test
        </p>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '12px',
        padding: '20px 40px',
        flexWrap: 'wrap'
      }}>
        <button 
          className={`tab-btn ${activeTab === 'theory' ? 'active' : ''}`}
          onClick={() => setActiveTab('theory')}
        >
          📚 Teorie
        </button>
        <button 
          className={`tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
          onClick={() => setActiveTab('quiz')}
        >
          ✅ Kvíz ({totalAnswered}/{quizQuestions.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'calculator' ? 'active' : ''}`}
          onClick={() => setActiveTab('calculator')}
        >
          🔢 Kalkulačka K
        </button>
        <button 
          className={`tab-btn ${activeTab === 'summary' ? 'active' : ''}`}
          onClick={() => setActiveTab('summary')}
        >
          📋 Shrnutí
        </button>
      </div>

      {/* Progress bar for quiz */}
      {activeTab === 'quiz' && (
        <div style={{ padding: '0 40px', marginBottom: '10px' }}>
          <div className="progress-bar">
            <div className="progress-fill" style={{ 
              width: `${(totalAnswered / quizQuestions.length) * 100}%` 
            }} />
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginTop: '8px',
            fontSize: '13px',
            color: '#8892a0'
          }}>
            <span>Skóre: {score}/{totalAnswered}</span>
            <span>Úspěšnost: {totalAnswered > 0 ? Math.round((score/totalAnswered) * 100) : 0}%</span>
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ padding: '20px 40px', paddingBottom: '60px' }}>
        
        {/* THEORY TAB */}
        {activeTab === 'theory' && (
          <div style={{ display: 'flex', gap: '30px' }}>
            {/* Theory Navigation */}
            <div style={{ 
              width: '280px', 
              flexShrink: 0,
              position: 'sticky',
              top: '20px',
              alignSelf: 'flex-start'
            }}>
              <div className="glass-card" style={{ padding: '20px' }}>
                <h3 style={{ 
                  fontSize: '14px', 
                  color: '#8892a0', 
                  marginBottom: '16px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  Kapitoly
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {theorySections.map((section, idx) => (
                    <button
                      key={idx}
                      className={`theory-nav ${activeTheorySection === idx ? 'active' : ''}`}
                      onClick={() => setActiveTheorySection(idx)}
                    >
                      <span>{section.icon}</span>
                      <span>{section.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Theory Content */}
            <div style={{ flex: 1, maxWidth: '800px' }}>
              <div className="glass-card" style={{ 
                padding: '40px',
                animation: 'slideIn 0.6s ease'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '30px' }}>
                  <span style={{ fontSize: '40px' }}>{theorySections[activeTheorySection].icon}</span>
                  <h2 style={{ 
                    fontSize: '26px', 
                    fontWeight: '600',
                    color: '#fff'
                  }}>
                    {theorySections[activeTheorySection].title}
                  </h2>
                </div>

                {theorySections[activeTheorySection].content.map((item, idx) => (
                  <div key={idx} style={{ marginBottom: '28px' }}>
                    <h3 style={{ 
                      fontSize: '18px', 
                      fontWeight: '600', 
                      color: '#c4cad3',
                      marginBottom: '12px'
                    }}>
                      {item.subtitle}
                    </h3>
                    <p style={{ 
                      fontSize: '15px', 
                      lineHeight: '1.7', 
                      color: '#a0a8b3',
                      marginBottom: '12px'
                    }}>
                      {item.text}
                    </p>
                    <div className="formula-box">
                      {item.formula}
                    </div>
                  </div>
                ))}

                {/* Navigation buttons */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginTop: '40px',
                  paddingTop: '20px',
                  borderTop: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <button
                    onClick={() => setActiveTheorySection(Math.max(0, activeTheorySection - 1))}
                    disabled={activeTheorySection === 0}
                    style={{
                      padding: '10px 20px',
                      background: activeTheorySection === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.08)',
                      border: 'none',
                      borderRadius: '8px',
                      color: activeTheorySection === 0 ? '#555' : '#fff',
                      cursor: activeTheorySection === 0 ? 'default' : 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    ← Předchozí
                  </button>
                  <button
                    onClick={() => setActiveTheorySection(Math.min(theorySections.length - 1, activeTheorySection + 1))}
                    disabled={activeTheorySection === theorySections.length - 1}
                    style={{
                      padding: '10px 20px',
                      background: activeTheorySection === theorySections.length - 1 ? 'rgba(255,255,255,0.03)' : 'linear-gradient(135deg, #4f46e5, #6366f1)',
                      border: 'none',
                      borderRadius: '8px',
                      color: activeTheorySection === theorySections.length - 1 ? '#555' : '#fff',
                      cursor: activeTheorySection === theorySections.length - 1 ? 'default' : 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Další →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* QUIZ TAB */}
        {activeTab === 'quiz' && (
          <div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h2 style={{ fontSize: '22px', color: '#fff' }}>Testové otázky z pracovních listů</h2>
              <button className="calc-btn" onClick={resetQuiz}>
                🔄 Reset kvízu
              </button>
            </div>

            <div style={{ 
              display: 'grid', 
              gap: '20px',
              maxWidth: '900px'
            }}>
              {quizQuestions.map((q, idx) => (
                <div 
                  key={q.id} 
                  className="glass-card" 
                  style={{ 
                    padding: '28px',
                    animation: `slideIn 0.5s ease ${idx * 0.08}s both`
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    marginBottom: '16px'
                  }}>
                    <span style={{
                      background: 'rgba(99, 102, 241, 0.2)',
                      color: '#a5b4fc',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {q.category}
                    </span>
                    <span style={{ color: '#666', fontSize: '14px' }}>#{q.id}</span>
                  </div>
                  
                  <h3 style={{ 
                    fontSize: '16px', 
                    fontWeight: '500', 
                    color: '#e0e6ed',
                    marginBottom: '20px',
                    lineHeight: '1.5'
                  }}>
                    {q.question}
                  </h3>

                  <div style={{ display: 'grid', gap: '10px' }}>
                    {q.options.map((option, optIdx) => (
                      <div
                        key={optIdx}
                        className={`quiz-option ${
                          showResults[q.id] 
                            ? optIdx === q.correct 
                              ? 'correct' 
                              : quizAnswers[q.id] === optIdx 
                                ? 'incorrect' 
                                : 'disabled'
                            : ''
                        } ${showResults[q.id] ? 'disabled' : ''}`}
                        onClick={() => handleAnswer(q.id, optIdx)}
                      >
                        <span style={{ 
                          display: 'inline-block',
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: 'rgba(255,255,255,0.1)',
                          textAlign: 'center',
                          lineHeight: '24px',
                          marginRight: '12px',
                          fontSize: '13px'
                        }}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        {option}
                      </div>
                    ))}
                  </div>

                  {showResults[q.id] && (
                    <div style={{
                      marginTop: '16px',
                      padding: '14px 18px',
                      background: 'rgba(99, 102, 241, 0.1)',
                      borderRadius: '10px',
                      fontSize: '14px',
                      color: '#a5b4fc',
                      lineHeight: '1.6'
                    }}>
                      💡 {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CALCULATOR TAB */}
        {activeTab === 'calculator' && (
          <div style={{ maxWidth: '700px' }}>
            <div className="glass-card" style={{ padding: '40px' }}>
              <h2 style={{ fontSize: '24px', marginBottom: '8px', color: '#fff' }}>
                🔢 Kalkulačka rovnovážné konstanty
              </h2>
              <p style={{ color: '#8892a0', marginBottom: '30px', fontSize: '14px' }}>
                Výpočet K pro reakci: aA + bB ⇌ cC + dD → K = [C]ᶜ·[D]ᵈ / [A]ᵃ·[B]ᵇ
              </p>

              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ fontSize: '16px', color: '#a5b4fc', marginBottom: '16px' }}>
                  Produkty (čitatel)
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 1fr 80px', gap: '12px', alignItems: 'end' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: '#8892a0' }}>[Produkt 1]</label>
                    <input
                      type="number"
                      className="calc-input"
                      placeholder="koncentrace"
                      value={calculatorValues.c1}
                      onChange={(e) => setCalculatorValues({...calculatorValues, c1: e.target.value})}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#8892a0' }}>exponent</label>
                    <input
                      type="number"
                      className="calc-input"
                      value={calculatorValues.exp1}
                      onChange={(e) => setCalculatorValues({...calculatorValues, exp1: e.target.value})}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#8892a0' }}>[Produkt 2]</label>
                    <input
                      type="number"
                      className="calc-input"
                      placeholder="koncentrace"
                      value={calculatorValues.c2}
                      onChange={(e) => setCalculatorValues({...calculatorValues, c2: e.target.value})}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#8892a0' }}>exponent</label>
                    <input
                      type="number"
                      className="calc-input"
                      value={calculatorValues.exp2}
                      onChange={(e) => setCalculatorValues({...calculatorValues, exp2: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ fontSize: '16px', color: '#a5b4fc', marginBottom: '16px' }}>
                  Reaktanty (jmenovatel)
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 1fr 80px', gap: '12px', alignItems: 'end' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: '#8892a0' }}>[Reaktant 1]</label>
                    <input
                      type="number"
                      className="calc-input"
                      placeholder="koncentrace"
                      value={calculatorValues.c3}
                      onChange={(e) => setCalculatorValues({...calculatorValues, c3: e.target.value})}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#8892a0' }}>exponent</label>
                    <input
                      type="number"
                      className="calc-input"
                      value={calculatorValues.exp3}
                      onChange={(e) => setCalculatorValues({...calculatorValues, exp3: e.target.value})}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#8892a0' }}>[Reaktant 2]</label>
                    <input
                      type="number"
                      className="calc-input"
                      placeholder="koncentrace"
                      value={calculatorValues.c4}
                      onChange={(e) => setCalculatorValues({...calculatorValues, c4: e.target.value})}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#8892a0' }}>exponent</label>
                    <input
                      type="number"
                      className="calc-input"
                      value={calculatorValues.exp4}
                      onChange={(e) => setCalculatorValues({...calculatorValues, exp4: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <button className="calc-btn" onClick={calculateK} style={{ width: '100%' }}>
                Vypočítat K
              </button>

              {calculatedK !== null && (
                <div style={{
                  marginTop: '24px',
                  padding: '24px',
                  background: 'rgba(34, 197, 94, 0.1)',
                  borderRadius: '12px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '14px', color: '#8892a0', marginBottom: '8px' }}>
                    Rovnovážná konstanta
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#4ade80' }}>
                    K = {calculatedK.toExponential(3)}
                  </div>
                  <div style={{ fontSize: '13px', color: '#8892a0', marginTop: '12px' }}>
                    {calculatedK > 1 
                      ? '→ Převažují produkty' 
                      : calculatedK < 1 
                        ? '→ Převažují reaktanty'
                        : '→ Rovnovážný stav'}
                  </div>
                </div>
              )}
            </div>

            {/* Quick examples */}
            <div className="glass-card" style={{ padding: '30px', marginTop: '20px' }}>
              <h3 style={{ fontSize: '18px', color: '#fff', marginBottom: '20px' }}>
                📝 Příklady z pracovních listů
              </h3>
              
              <div style={{ display: 'grid', gap: '16px' }}>
                <div style={{ 
                  padding: '16px', 
                  background: 'rgba(0,0,0,0.2)', 
                  borderRadius: '10px' 
                }}>
                  <div style={{ fontWeight: '500', marginBottom: '8px', color: '#e0e6ed' }}>
                    C(s) + CO₂(g) ⇌ 2CO(g)
                  </div>
                  <div style={{ fontSize: '14px', color: '#8892a0' }}>
                    p(CO) = 810,6 kPa, p(CO₂) = 405,3 kPa<br/>
                    K = (810,6)² / 405,3 = <strong style={{ color: '#4ade80' }}>1621,2</strong>
                  </div>
                </div>

                <div style={{ 
                  padding: '16px', 
                  background: 'rgba(0,0,0,0.2)', 
                  borderRadius: '10px' 
                }}>
                  <div style={{ fontWeight: '500', marginBottom: '8px', color: '#e0e6ed' }}>
                    SO₂(g) + NO₂(g) ⇌ SO₃(g) + NO(g)
                  </div>
                  <div style={{ fontSize: '14px', color: '#8892a0' }}>
                    [SO₂]=0,002, [SO₃]=0,003, [NO₂]=0,005, [NO]=0,003<br/>
                    K = (0,003 × 0,003) / (0,002 × 0,005) = <strong style={{ color: '#4ade80' }}>0,9</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUMMARY TAB */}
        {activeTab === 'summary' && (
          <div style={{ maxWidth: '900px' }}>
            <div className="glass-card" style={{ padding: '40px' }}>
              <h2 style={{ fontSize: '24px', marginBottom: '30px', color: '#fff' }}>
                📋 Rychlé shrnutí - Tahák
              </h2>

              <div style={{ display: 'grid', gap: '24px' }}>
                {/* K expression */}
                <div style={{ 
                  padding: '24px', 
                  background: 'rgba(99, 102, 241, 0.1)', 
                  borderRadius: '16px',
                  borderLeft: '4px solid #6366f1'
                }}>
                  <h3 style={{ color: '#a5b4fc', marginBottom: '12px', fontSize: '16px' }}>
                    Rovnovážná konstanta K
                  </h3>
                  <div className="formula-box" style={{ margin: '0 0 12px 0' }}>
                    aA + bB ⇌ cC + dD → K = [C]ᶜ·[D]ᵈ / [A]ᵃ·[B]ᵇ
                  </div>
                  <ul style={{ fontSize: '14px', color: '#a0a8b3', paddingLeft: '20px', lineHeight: '1.8' }}>
                    <li>Do K se nezahrnují pevné látky (s) a čisté kapaliny (l)</li>
                    <li>K {'>'} 1 → převažují produkty</li>
                    <li>K {'<'} 1 → převažují reaktanty</li>
                    <li>K závisí na teplotě, katalyzátor K nezmění</li>
                  </ul>
                </div>

                {/* Le Chatelier */}
                <div style={{ 
                  padding: '24px', 
                  background: 'rgba(34, 197, 94, 0.1)', 
                  borderRadius: '16px',
                  borderLeft: '4px solid #22c55e'
                }}>
                  <h3 style={{ color: '#4ade80', marginBottom: '12px', fontSize: '16px' }}>
                    Le Chatelierův princip
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '14px' }}>
                    <div>
                      <strong style={{ color: '#e0e6ed' }}>Koncentrace:</strong>
                      <ul style={{ color: '#a0a8b3', paddingLeft: '20px', lineHeight: '1.8', marginTop: '8px' }}>
                        <li>↑ reaktantu → posun doprava</li>
                        <li>↑ produktu → posun doleva</li>
                        <li>↓ reaktantu → posun doleva</li>
                        <li>↓ produktu → posun doprava</li>
                      </ul>
                    </div>
                    <div>
                      <strong style={{ color: '#e0e6ed' }}>Tlak (jen plyny!):</strong>
                      <ul style={{ color: '#a0a8b3', paddingLeft: '20px', lineHeight: '1.8', marginTop: '8px' }}>
                        <li>↑ tlaku → k méně molům plynu</li>
                        <li>↓ tlaku → k více molům plynu</li>
                        <li>Stejný počet molů → bez vlivu</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Temperature */}
                <div style={{ 
                  padding: '24px', 
                  background: 'rgba(239, 68, 68, 0.1)', 
                  borderRadius: '16px',
                  borderLeft: '4px solid #ef4444'
                }}>
                  <h3 style={{ color: '#f87171', marginBottom: '12px', fontSize: '16px' }}>
                    Vliv teploty
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '14px' }}>
                    <div style={{ 
                      padding: '16px', 
                      background: 'rgba(0,0,0,0.2)', 
                      borderRadius: '10px' 
                    }}>
                      <strong style={{ color: '#ef4444' }}>Exotermická (Q {'<'} 0, ΔH {'<'} 0)</strong>
                      <div style={{ color: '#a0a8b3', marginTop: '8px', lineHeight: '1.6' }}>
                        • ↑T → posun doleva<br/>
                        • ↑T → K klesá<br/>
                        • Teplo je "produktem"
                      </div>
                    </div>
                    <div style={{ 
                      padding: '16px', 
                      background: 'rgba(0,0,0,0.2)', 
                      borderRadius: '10px' 
                    }}>
                      <strong style={{ color: '#f97316' }}>Endotermická (Q {'>'} 0, ΔH {'>'} 0)</strong>
                      <div style={{ color: '#a0a8b3', marginTop: '8px', lineHeight: '1.6' }}>
                        • ↑T → posun doprava<br/>
                        • ↑T → K roste<br/>
                        • Teplo je "reaktantem"
                      </div>
                    </div>
                  </div>
                </div>

                {/* Calculations */}
                <div style={{ 
                  padding: '24px', 
                  background: 'rgba(168, 85, 247, 0.1)', 
                  borderRadius: '16px',
                  borderLeft: '4px solid #a855f7'
                }}>
                  <h3 style={{ color: '#c084fc', marginBottom: '12px', fontSize: '16px' }}>
                    Výpočetní triky
                  </h3>
                  <div style={{ fontSize: '14px', color: '#a0a8b3', lineHeight: '2' }}>
                    <div className="formula-box" style={{ margin: '8px 0' }}>
                      Zpětná reakce: K' = 1/K
                    </div>
                    <div className="formula-box" style={{ margin: '8px 0' }}>
                      Reakce × n: K' = Kⁿ
                    </div>
                    <div className="formula-box" style={{ margin: '8px 0' }}>
                      Reakce × ½: K' = √K
                    </div>
                  </div>
                </div>

                {/* Important reactions from worksheets */}
                <div style={{ 
                  padding: '24px', 
                  background: 'rgba(6, 182, 212, 0.1)', 
                  borderRadius: '16px',
                  borderLeft: '4px solid #06b6d4'
                }}>
                  <h3 style={{ color: '#22d3ee', marginBottom: '16px', fontSize: '16px' }}>
                    Důležité reakce z pracovních listů
                  </h3>
                  <div style={{ 
                    display: 'grid', 
                    gap: '12px',
                    fontSize: '13px'
                  }}>
                    <div style={{ padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                      <code style={{ color: '#22d3ee' }}>2SO₂ + O₂ ⇌ 2SO₃</code>
                      <span style={{ color: '#8892a0', marginLeft: '12px' }}>ΔH = -190 kJ/mol (exo), tlak má vliv</span>
                    </div>
                    <div style={{ padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                      <code style={{ color: '#22d3ee' }}>H₂ + I₂ ⇌ 2HI</code>
                      <span style={{ color: '#8892a0', marginLeft: '12px' }}>tlak NEMÁ vliv (2=2)</span>
                    </div>
                    <div style={{ padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                      <code style={{ color: '#22d3ee' }}>N₂O₄ ⇌ 2NO₂</code>
                      <span style={{ color: '#8892a0', marginLeft: '12px' }}>Q = +57,1 kJ (endo), tlak má vliv</span>
                    </div>
                    <div style={{ padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                      <code style={{ color: '#22d3ee' }}>CO + 2H₂ ⇌ CH₃OH</code>
                      <span style={{ color: '#8892a0', marginLeft: '12px' }}>Q = 256 kJ (exo), tlak má vliv</span>
                    </div>
                    <div style={{ padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                      <code style={{ color: '#22d3ee' }}>CaCO₃ ⇌ CaO + CO₂</code>
                      <span style={{ color: '#8892a0', marginLeft: '12px' }}>Q = 178 kJ (endo)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
