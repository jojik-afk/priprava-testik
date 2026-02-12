// @title Chemie - Reakční kinetika
// @subject Chemistry
// @topic Chemistry
// @template practice

import React, { useState, useEffect } from 'react';

// ===== DATA SECTION =====

const kineticsTheory = [
  {
    id: 1,
    title: "Reakční rychlost",
    content: `Reakční rychlost (v) vyjadřuje změnu koncentrace reaktantů nebo produktů za jednotku času.

**Vzorec:** v = Δc / Δt [mol·dm⁻³·s⁻¹]

Kde:
• Δc = změna koncentrace
• Δt = změna času

**Příklad:** Pokud se během 40 sekund změní koncentrace produktu ze 2 mol/dm³ na 4 mol/dm³:
v = (4 - 2) / 40 = 0,05 mol·dm⁻³·s⁻¹`,
    diagram: "rychlost"
  },
  {
    id: 2,
    title: "Faktory ovlivňující rychlost reakce",
    content: `Rychlost chemické reakce závisí na:

**1. Koncentraci reaktantů** - vyšší koncentrace = více srážek = rychlejší reakce
   Příklad: Zn + HCl (10%) reaguje pomaleji než Zn + HCl (35%)

**2. Teplotě** - vyšší teplota = rychlejší pohyb částic = více efektivních srážek

**3. Katalyzátorech** - snižují aktivační energii

**4. Velikosti povrchu** - větší povrch = více míst pro reakci
   (práškové látky reagují rychleji než kompaktní)

**5. Tlaku** (u plynů) - vyšší tlak = vyšší koncentrace`,
    diagram: "faktory"
  },
  {
    id: 3,
    title: "Aktivační energie (EA)",
    content: `Aktivační energie je minimální energie potřebná k tomu, aby mohla reakce proběhnout.

**Klíčové pojmy:**
• **EA** = aktivační energie
• **AK** = aktivovaný komplex (přechodný stav)
• **ΔH** = změna enthalpie (tepelné zabarvení reakce)

**Na energetickém diagramu:**
• Osa x = reakční koordináta (průběh reakce v čase)
• Osa y = potenciální energie (E)
• Vrchol křivky = aktivovaný komplex

**EA = E(AK) - E(reaktantů)**

Aktivační energie je mnohem nižší než energie potřebná k úplnému rozštěpení vazeb výchozích látek.`,
    diagram: "energia"
  },
  {
    id: 4,
    title: "Exotermické vs. Endotermické reakce",
    content: `**EXOTERMICKÁ REAKCE:**
• ΔH < 0 (záporné)
• Uvolňuje teplo do okolí
• Produkty mají nižší energii než reaktanty
• Příklad: spalování, neutralizace

**ENDOTERMICKÁ REAKCE:**
• ΔH > 0 (kladné)
• Pohlcuje teplo z okolí
• Produkty mají vyšší energii než reaktanty
• Příklad: fotosyntéza, rozklad CaCO₃

**Jak poznat z grafu:**
• Exotermická: produkty jsou NÍŽE než reaktanty
• Endotermická: produkty jsou VÝŠE než reaktanty`,
    diagram: "termo"
  },
  {
    id: 5,
    title: "Van't Hoffovo pravidlo",
    content: `Při zvýšení teploty o 10°C se rychlost reakce zvýší 2-4× (obvykle 2-3×).

**Vzorec:**
v₂/v₁ = γ^(Δt/10)

Kde:
• γ (gamma) = teplotní koeficient (2-4)
• Δt = změna teploty

**Příklad:**
Teplota se zvýšila z 20°C na 50°C, γ = 3
Δt = 50 - 20 = 30°C
v₂/v₁ = 3^(30/10) = 3³ = 27×

**Další příklad:**
Teplota z 20°C na 80°C, γ = 3
Δt = 60°C
v₂/v₁ = 3^(60/10) = 3⁶ = 729×`,
    diagram: "vanthoff"
  },
  {
    id: 6,
    title: "Guldberg-Waagův zákon (kinetická rovnice)",
    content: `Rychlost reakce je úměrná součinu koncentrací reaktantů umocněných na jejich stechiometrické koeficienty.

**Pro reakci:** aA + bB → cC + dD

**Kinetická rovnice:**
v = k · [A]ᵃ · [B]ᵇ

Kde:
• k = rychlostní konstanta (závisí na EA a teplotě)
• [A], [B] = koncentrace reaktantů
• a, b = stechiometrické koeficienty

**Příklad:**
2H₂(g) + 2NO(g) → N₂(g) + 2H₂O(g)
v = k · [H₂]² · [NO]²

**Příklad 2:**
Zn + 2HCl → H₂ + ZnCl₂
v = k · [Zn] · [HCl]²`,
    diagram: "guldberg"
  },
  {
    id: 7,
    title: "Katalyzátory",
    content: `Katalyzátor je látka, která urychluje reakci, ale sama se při ní nespotřebuje.

**Typy:**
• **Aktivátor (pozitivní katalyzátor)** - SNIŽUJE EA → URYCHLUJE reakci
• **Inhibitor (negativní katalyzátor)** - ZVYŠUJE EA → ZPOMALUJE reakci

**Jak funguje katalyzátor:**
• Snižuje aktivační energii
• Poskytuje alternativní reakční cestu
• Na konci reakce se regeneruje

**Katalytické jedy:**
• Látky, které se váží na katalyzátor a snižují/ruší jeho účinnost
• Příklad: olovo v automobilových katalyzátorech`,
    diagram: "katalyzator"
  },
  {
    id: 8,
    title: "Enzymy - biokatalyzátory",
    content: `Enzymy jsou biologické katalyzátory (bílkoviny) v živých organismech.

**Příklady enzymů a jejich výskyt:**
• **Inzulin** - slinivka břišní (reguluje hladinu cukru)
• **Pepsin** - žaludek (štěpí bílkoviny)
• **Amyláza** - slinivka břišní, ústa (štěpí škroby)
• **Thyroxin** - štítná žláza (metabolismus)

**Vlastnosti enzymů:**
• Vysoká specifita (jeden enzym = jedna reakce)
• Fungují při tělesné teplotě
• Citlivé na pH a teplotu
• Snižují EA tisíckrát více než chemické katalyzátory`,
    diagram: "enzymy"
  },
  {
    id: 9,
    title: "Aktivní a neaktivní srážka",
    content: `Pro úspěšnou reakci musí částice:
1. Se srazit
2. Mít dostatečnou energii (≥ EA)
3. Mít správnou orientaci

**AKTIVNÍ (efektivní) SRÁŽKA:**
• Dostatečná energie
• Správná orientace molekul
• Vede k produktům

**NEAKTIVNÍ (neefektivní) SRÁŽKA:**
• Nedostatečná energie NEBO
• Špatná orientace molekul
• Molekuly se odrazí bez reakce

**Příklad:**
CO + NO₂ → CO₂ + NO
Molekuly se musí srazit tak, aby atom C byl blízko atomu O z NO₂.`,
    diagram: "srazka"
  },
  {
    id: 10,
    title: "Automobilový katalyzátor",
    content: `Automobilové katalyzátory snižují množství škodlivých látek ve výfukových plynech.

**Katalyzované reakce:**
1. 2CO + O₂ → 2CO₂
   (oxid uhelnatý → oxid uhličitý)

2. 2NO → N₂ + O₂
   (oxid dusnatý → dusík + kyslík)

3. 2NO + 2CO → N₂ + 2CO₂
   (NO + CO → dusík + oxid uhličitý)

4. 4NO + CH₄ → CO₂ + 2N₂ + 2H₂O
   (reakce s methanem)

**Proč ne olovnatý benzín?**
Olovo je katalytický jed - váže se na povrch katalyzátoru a znehodnocuje ho.
Velký počet kanálků v katalyzátoru → velká reakční plocha.`,
    diagram: "auto"
  }
];

const kineticsQuestions = [
  {
    id: 1,
    question: "Co představuje EA na energetickém diagramu reakce?",
    options: ["Energii produktů", "Aktivační energii", "Změnu enthalpie", "Energii reaktantů"],
    correct: 1,
    explanation: "EA = aktivační energie, což je minimální energie potřebná k zahájení reakce."
  },
  {
    id: 2,
    question: "Reakce je EXOTERMICKÁ, pokud:",
    options: ["ΔH > 0", "ΔH < 0", "EA = 0", "Produkty jsou výše než reaktanty"],
    correct: 1,
    explanation: "Exotermická reakce má ΔH < 0 (záporné), uvolňuje teplo a produkty mají nižší energii než reaktanty."
  },
  {
    id: 3,
    question: "Při zvýšení teploty z 20°C na 50°C a γ = 3, kolikrát se zvýší rychlost reakce?",
    options: ["3×", "9×", "27×", "81×"],
    correct: 2,
    explanation: "Δt = 30°C, v₂/v₁ = 3^(30/10) = 3³ = 27×"
  },
  {
    id: 4,
    question: "Katalyzátor (aktivátor) reakci urychluje tím, že:",
    options: ["Zvyšuje aktivační energii", "Snižuje aktivační energii", "Zvyšuje teplotu", "Zvyšuje koncentraci"],
    correct: 1,
    explanation: "Aktivátor (pozitivní katalyzátor) snižuje aktivační energii, a tím urychluje reakci."
  },
  {
    id: 5,
    question: "Pro reakci 2H₂ + 2NO → N₂ + 2H₂O je kinetická rovnice:",
    options: ["v = k·[H₂]·[NO]", "v = k·[H₂]²·[NO]²", "v = k·[N₂]·[H₂O]²", "v = k·[H₂]²·[NO]"],
    correct: 1,
    explanation: "Podle Guldberg-Waagova zákona: v = k · [H₂]² · [NO]², koeficienty se stávají exponenty."
  },
  {
    id: 6,
    question: "Co je AK (aktivovaný komplex)?",
    options: ["Konečný produkt reakce", "Přechodný stav mezi reaktanty a produkty", "Katalyzátor", "Výchozí látka"],
    correct: 1,
    explanation: "AK = aktivovaný komplex je nestabilní přechodný stav s nejvyšší energií během reakce."
  },
  {
    id: 7,
    question: "Proč se nesmí používat olovnatý benzín v autech s katalyzátorem?",
    options: ["Olovo je příliš drahé", "Olovo je katalytický jed", "Olovo zvyšuje spotřebu", "Olovo způsobuje korozi"],
    correct: 1,
    explanation: "Olovo je katalytický jed - váže se na katalyzátor a znehodnocuje ho (snižuje nebo ruší jeho účinnost)."
  },
  {
    id: 8,
    question: "Který enzym se nachází v žaludku a štěpí bílkoviny?",
    options: ["Amyláza", "Inzulin", "Pepsin", "Thyroxin"],
    correct: 2,
    explanation: "Pepsin je enzym v žaludku, který štěpí bílkoviny."
  },
  {
    id: 9,
    question: "Co NENÍ podmínkou aktivní (efektivní) srážky?",
    options: ["Dostatečná energie", "Správná orientace", "Přítomnost katalyzátoru", "Kontakt molekul"],
    correct: 2,
    explanation: "Aktivní srážka vyžaduje: srážku, dostatečnou energii a správnou orientaci. Katalyzátor není nutný."
  },
  {
    id: 10,
    question: "Vypočítejte rychlost reakce: koncentrace se změnila z 2 mol/dm³ na 4 mol/dm³ za 40 s.",
    options: ["0,5 mol·dm⁻³·s⁻¹", "0,1 mol·dm⁻³·s⁻¹", "0,05 mol·dm⁻³·s⁻¹", "2 mol·dm⁻³·s⁻¹"],
    correct: 2,
    explanation: "v = Δc/Δt = (4-2)/40 = 2/40 = 0,05 mol·dm⁻³·s⁻¹"
  },
  {
    id: 11,
    question: "Co označuje ΔH na energetickém diagramu?",
    options: ["Aktivační energii", "Změnu enthalpie (tepelné zabarvení)", "Energii aktivovaného komplexu", "Rychlostní konstantu"],
    correct: 1,
    explanation: "ΔH = změna enthalpie, což je rozdíl energie produktů a reaktantů (tepelné zabarvení reakce)."
  },
  {
    id: 12,
    question: "Inhibitor je:",
    options: ["Pozitivní katalyzátor", "Negativní katalyzátor", "Enzym", "Reaktant"],
    correct: 1,
    explanation: "Inhibitor = negativní katalyzátor, který zvyšuje aktivační energii a zpomaluje reakci."
  },
  {
    id: 13,
    question: "Při zvýšení teploty z 20°C na 80°C a γ = 3, kolikrát se zvýší rychlost?",
    options: ["27×", "81×", "243×", "729×"],
    correct: 3,
    explanation: "Δt = 60°C, v₂/v₁ = 3^(60/10) = 3⁶ = 729×"
  },
  {
    id: 14,
    question: "Graf exotermické reakce má produkty:",
    options: ["Výše než reaktanty", "Níže než reaktanty", "Na stejné úrovni", "Nad aktivovaným komplexem"],
    correct: 1,
    explanation: "U exotermické reakce jsou produkty energeticky níže než reaktanty (uvolňuje se energie)."
  },
  {
    id: 15,
    question: "Jaká je jednotka reakční rychlosti?",
    options: ["mol/s", "mol·dm⁻³", "mol·dm⁻³·s⁻¹", "dm³/s"],
    correct: 2,
    explanation: "Rychlost reakce = změna koncentrace za čas, jednotka je mol·dm⁻³·s⁻¹"
  }
];

// Názvosloví - vzorce a názvy
const nomenclatureFormulas = [
  // Oxidy
  { formula: "Na₂O", name: "oxid sodný", type: "oxid", hint: "Na má ox. č. +I" },
  { formula: "CaO", name: "oxid vápenatý", type: "oxid", hint: "Ca má ox. č. +II" },
  { formula: "Fe₂O₃", name: "oxid železitý", type: "oxid", hint: "Fe má ox. č. +III" },
  { formula: "SO₂", name: "oxid siřičitý", type: "oxid", hint: "S má ox. č. +IV" },
  { formula: "SO₃", name: "oxid sírový", type: "oxid", hint: "S má ox. č. +VI" },
  { formula: "CO₂", name: "oxid uhličitý", type: "oxid", hint: "C má ox. č. +IV" },
  { formula: "CO", name: "oxid uhelnatý", type: "oxid", hint: "C má ox. č. +II" },
  { formula: "P₂O₅", name: "oxid fosforečný", type: "oxid", hint: "P má ox. č. +V" },
  { formula: "Al₂O₃", name: "oxid hlinitý", type: "oxid", hint: "Al má ox. č. +III" },
  { formula: "NO₂", name: "oxid dusičitý", type: "oxid", hint: "N má ox. č. +IV" },
  { formula: "N₂O₅", name: "oxid dusičný", type: "oxid", hint: "N má ox. č. +V" },
  { formula: "MnO₂", name: "oxid manganičitý", type: "oxid", hint: "Mn má ox. č. +IV" },
  { formula: "CuO", name: "oxid měďnatý", type: "oxid", hint: "Cu má ox. č. +II" },
  { formula: "Cu₂O", name: "oxid měďný", type: "oxid", hint: "Cu má ox. č. +I" },
  { formula: "PbO₂", name: "oxid olovičitý", type: "oxid", hint: "Pb má ox. č. +IV" },
  
  // Hydroxidy
  { formula: "NaOH", name: "hydroxid sodný", type: "hydroxid", hint: "silná zásada" },
  { formula: "KOH", name: "hydroxid draselný", type: "hydroxid", hint: "silná zásada" },
  { formula: "Ca(OH)₂", name: "hydroxid vápenatý", type: "hydroxid", hint: "hašené vápno" },
  { formula: "Ba(OH)₂", name: "hydroxid barnatý", type: "hydroxid", hint: "silná zásada" },
  { formula: "Fe(OH)₃", name: "hydroxid železitý", type: "hydroxid", hint: "Fe má ox. č. +III" },
  { formula: "Al(OH)₃", name: "hydroxid hlinitý", type: "hydroxid", hint: "amfoterní" },
  { formula: "Mg(OH)₂", name: "hydroxid hořečnatý", type: "hydroxid", hint: "Mg má ox. č. +II" },
  { formula: "Cu(OH)₂", name: "hydroxid měďnatý", type: "hydroxid", hint: "modrá sraženina" },
  
  // Kyseliny
  { formula: "HCl", name: "kyselina chlorovodíková", type: "kyselina", hint: "bezkyslíkatá" },
  { formula: "H₂SO₄", name: "kyselina sírová", type: "kyselina", hint: "S má ox. č. +VI" },
  { formula: "HNO₃", name: "kyselina dusičná", type: "kyselina", hint: "N má ox. č. +V" },
  { formula: "H₃PO₄", name: "kyselina fosforečná", type: "kyselina", hint: "P má ox. č. +V" },
  { formula: "H₂CO₃", name: "kyselina uhličitá", type: "kyselina", hint: "C má ox. č. +IV" },
  { formula: "H₂SO₃", name: "kyselina siřičitá", type: "kyselina", hint: "S má ox. č. +IV" },
  { formula: "HNO₂", name: "kyselina dusitá", type: "kyselina", hint: "N má ox. č. +III" },
  { formula: "HF", name: "kyselina fluorovodíková", type: "kyselina", hint: "leptá sklo" },
  { formula: "H₂S", name: "kyselina sulfanová (sirovodíková)", type: "kyselina", hint: "zápach zkažených vajec" },
  { formula: "HClO₄", name: "kyselina chloristá", type: "kyselina", hint: "Cl má ox. č. +VII" },
  { formula: "HClO₃", name: "kyselina chlorečná", type: "kyselina", hint: "Cl má ox. č. +V" },
  { formula: "HClO", name: "kyselina chlorná", type: "kyselina", hint: "Cl má ox. č. +I" },
  { formula: "H₂CrO₄", name: "kyselina chromová", type: "kyselina", hint: "Cr má ox. č. +VI" },
  { formula: "HMnO₄", name: "kyselina manganistá", type: "kyselina", hint: "Mn má ox. č. +VII" },
  
  // Soli
  { formula: "NaCl", name: "chlorid sodný", type: "sůl", hint: "kuchyňská sůl" },
  { formula: "CaCO₃", name: "uhličitan vápenatý", type: "sůl", hint: "vápenec, mramor" },
  { formula: "Na₂SO₄", name: "síran sodný", type: "sůl", hint: "Glauberova sůl" },
  { formula: "KNO₃", name: "dusičnan draselný", type: "sůl", hint: "ledek draselný" },
  { formula: "CaSO₄", name: "síran vápenatý", type: "sůl", hint: "sádra" },
  { formula: "MgCl₂", name: "chlorid hořečnatý", type: "sůl", hint: "Mg má ox. č. +II" },
  { formula: "FeCl₃", name: "chlorid železitý", type: "sůl", hint: "Fe má ox. č. +III" },
  { formula: "AgNO₃", name: "dusičnan stříbrný", type: "sůl", hint: "lapis" },
  { formula: "BaSO₄", name: "síran barnatý", type: "sůl", hint: "kontrastní látka RTG" },
  { formula: "K₂SO₄", name: "síran draselný", type: "sůl", hint: "hnojivo" },
  { formula: "Na₃PO₄", name: "fosforečnan sodný", type: "sůl", hint: "P má ox. č. +V" },
  { formula: "Ca₃(PO₄)₂", name: "fosforečnan vápenatý", type: "sůl", hint: "v kostech" },
  { formula: "Al₂(SO₄)₃", name: "síran hlinitý", type: "sůl", hint: "Al má ox. č. +III" },
  { formula: "CuSO₄", name: "síran měďnatý", type: "sůl", hint: "modrá skalice" },
  { formula: "ZnCl₂", name: "chlorid zinečnatý", type: "sůl", hint: "Zn má ox. č. +II" },
  { formula: "Na₂S", name: "sulfid sodný", type: "sůl", hint: "sůl H₂S" },
  { formula: "FeS", name: "sulfid železnatý", type: "sůl", hint: "Fe má ox. č. +II" },
  { formula: "PbSO₄", name: "síran olovnatý", type: "sůl", hint: "Pb má ox. č. +II" },
  { formula: "Mg(NO₃)₂", name: "dusičnan hořečnatý", type: "sůl", hint: "Mg má ox. č. +II" },
  { formula: "NH₄Cl", name: "chlorid amonný", type: "sůl", hint: "salmiak" },
  
  // Hydrogensoli
  { formula: "NaHCO₃", name: "hydrogenuhličitan sodný", type: "hydrogensůl", hint: "jedlá soda" },
  { formula: "KHCO₃", name: "hydrogenuhličitan draselný", type: "hydrogensůl", hint: "K má ox. č. +I" },
  { formula: "Ca(HCO₃)₂", name: "hydrogenuhličitan vápenatý", type: "hydrogensůl", hint: "tvrdost vody" },
  { formula: "NaHSO₄", name: "hydrogensíran sodný", type: "hydrogensůl", hint: "kyselá sůl H₂SO₄" },
  { formula: "KHSO₄", name: "hydrogensíran draselný", type: "hydrogensůl", hint: "kyselá sůl" },
  { formula: "NaHSO₃", name: "hydrogensiřičitan sodný", type: "hydrogensůl", hint: "konzervant E222" },
  { formula: "NaH₂PO₄", name: "dihydrogenfosforečnan sodný", type: "hydrogensůl", hint: "1 Na, 2 H" },
  { formula: "Na₂HPO₄", name: "hydrogenfosforečnan sodný", type: "hydrogensůl", hint: "2 Na, 1 H" },
  { formula: "KH₂PO₄", name: "dihydrogenfosforečnan draselný", type: "hydrogensůl", hint: "1 K, 2 H" },
  { formula: "CaHPO₄", name: "hydrogenfosforečnan vápenatý", type: "hydrogensůl", hint: "1 Ca, 1 H" },
  { formula: "Mg(HSO₄)₂", name: "hydrogensíran hořečnatý", type: "hydrogensůl", hint: "2 kyselé zbytky" },
  { formula: "Ba(HCO₃)₂", name: "hydrogenuhličitan barnatý", type: "hydrogensůl", hint: "Ba má ox. č. +II" }
];

// Shuffle function
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// ===== COMPONENT SECTION =====

// Energy Diagram Component
const EnergyDiagram = ({ type }) => {
  if (type === "energia" || type === "termo") {
    return (
      <div className="bg-slate-900 rounded-xl p-6 mt-4">
        <svg viewBox="0 0 400 250" className="w-full h-48">
          {/* Grid */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#334155" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="400" height="250" fill="url(#grid)" />
          
          {/* Axes */}
          <line x1="50" y1="220" x2="380" y2="220" stroke="#94a3b8" strokeWidth="2"/>
          <line x1="50" y1="220" x2="50" y2="20" stroke="#94a3b8" strokeWidth="2"/>
          
          {/* Labels */}
          <text x="200" y="245" fill="#94a3b8" textAnchor="middle" fontSize="12">Reakční koordináta</text>
          <text x="20" y="120" fill="#94a3b8" textAnchor="middle" fontSize="12" transform="rotate(-90, 20, 120)">Energie (E)</text>
          
          {/* Energy curve - exothermic */}
          <path d="M 80 150 Q 120 150 160 60 Q 200 60 240 60 Q 280 60 320 180" 
                fill="none" stroke="#f97316" strokeWidth="3"/>
          
          {/* Energy levels */}
          <line x1="60" y1="150" x2="120" y2="150" stroke="#22d3ee" strokeWidth="2" strokeDasharray="5,5"/>
          <line x1="280" y1="180" x2="360" y2="180" stroke="#22d3ee" strokeWidth="2" strokeDasharray="5,5"/>
          <line x1="160" y1="60" x2="240" y2="60" stroke="#a855f7" strokeWidth="2" strokeDasharray="5,5"/>
          
          {/* Arrows and labels */}
          <line x1="100" y1="150" x2="100" y2="60" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowhead)"/>
          <text x="75" y="105" fill="#10b981" fontSize="11" fontWeight="bold">EA</text>
          
          <line x1="340" y1="150" x2="340" y2="180" stroke="#ef4444" strokeWidth="2"/>
          <text x="355" y="170" fill="#ef4444" fontSize="11" fontWeight="bold">ΔH</text>
          
          {/* Labels */}
          <text x="90" y="165" fill="#22d3ee" fontSize="10">Reaktanty</text>
          <text x="300" y="198" fill="#22d3ee" fontSize="10">Produkty</text>
          <text x="185" y="50" fill="#a855f7" fontSize="10">AK</text>
          
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#10b981" />
            </marker>
          </defs>
        </svg>
        <p className="text-center text-sm text-slate-400 mt-2">Energetický diagram exotermické reakce (ΔH &lt; 0)</p>
      </div>
    );
  }
  
  if (type === "katalyzator") {
    return (
      <div className="bg-slate-900 rounded-xl p-6 mt-4">
        <svg viewBox="0 0 400 250" className="w-full h-48">
          {/* Grid */}
          <defs>
            <pattern id="grid2" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#334155" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="400" height="250" fill="url(#grid2)" />
          
          {/* Axes */}
          <line x1="50" y1="220" x2="380" y2="220" stroke="#94a3b8" strokeWidth="2"/>
          <line x1="50" y1="220" x2="50" y2="20" stroke="#94a3b8" strokeWidth="2"/>
          
          {/* Without catalyst - higher curve */}
          <path d="M 80 150 Q 120 150 200 40 Q 280 150 320 180" 
                fill="none" stroke="#ef4444" strokeWidth="3"/>
          
          {/* With catalyst - lower curve */}
          <path d="M 80 150 Q 120 150 200 90 Q 280 150 320 180" 
                fill="none" stroke="#22d3ee" strokeWidth="3"/>
          
          {/* Energy levels */}
          <line x1="60" y1="150" x2="100" y2="150" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5"/>
          <line x1="300" y1="180" x2="360" y2="180" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5"/>
          
          {/* EA labels */}
          <line x1="85" y1="150" x2="85" y2="40" stroke="#ef4444" strokeWidth="1" strokeDasharray="3,3"/>
          <text x="70" y="95" fill="#ef4444" fontSize="10">EA₁</text>
          
          <line x1="115" y1="150" x2="115" y2="90" stroke="#22d3ee" strokeWidth="1" strokeDasharray="3,3"/>
          <text x="120" y="120" fill="#22d3ee" fontSize="10">EA₂</text>
          
          {/* Legend */}
          <line x1="240" y1="25" x2="270" y2="25" stroke="#ef4444" strokeWidth="3"/>
          <text x="275" y="28" fill="#ef4444" fontSize="10">Bez katalyzátoru</text>
          <line x1="240" y1="45" x2="270" y2="45" stroke="#22d3ee" strokeWidth="3"/>
          <text x="275" y="48" fill="#22d3ee" fontSize="10">S katalyzátorem</text>
        </svg>
        <p className="text-center text-sm text-slate-400 mt-2">Katalyzátor snižuje aktivační energii (EA₂ &lt; EA₁)</p>
      </div>
    );
  }
  
  if (type === "srazka") {
    return (
      <div className="bg-slate-900 rounded-xl p-6 mt-4">
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center">
            <div className="bg-green-900/30 rounded-lg p-4 border border-green-500/30">
              <div className="flex justify-center items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs">CO</div>
                <ChevronRight className="text-green-400" />
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xs">NO₂</div>
              </div>
              <Check className="w-8 h-8 text-green-400 mx-auto" />
              <p className="text-green-400 font-semibold text-sm mt-1">AKTIVNÍ</p>
              <p className="text-slate-400 text-xs">Správná orientace</p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-red-900/30 rounded-lg p-4 border border-red-500/30">
              <div className="flex justify-center items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs">CO</div>
                <X className="text-red-400" />
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xs rotate-180">NO₂</div>
              </div>
              <X className="w-8 h-8 text-red-400 mx-auto" />
              <p className="text-red-400 font-semibold text-sm mt-1">NEAKTIVNÍ</p>
              <p className="text-slate-400 text-xs">Špatná orientace</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return null;
};

// Main App Component
export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [currentTheory, setCurrentTheory] = useState(0);
  const [quizState, setQuizState] = useState({
    currentQuestion: 0,
    score: 0,
    answers: [],
    showResult: false,
    selectedAnswer: null,
    isAnswered: false
  });
  const [nomenclatureState, setNomenclatureState] = useState({
    mode: null, // 'formula' or 'name'
    questions: [],
    currentIndex: 0,
    score: 0,
    userAnswer: '',
    showResult: false,
    isAnswered: false,
    feedback: null
  });
  const [shuffledQuestions, setShuffledQuestions] = useState([]);

  // Initialize quiz
  useEffect(() => {
    if (activeTab === 'quiz') {
      setShuffledQuestions(shuffleArray(kineticsQuestions));
      setQuizState({
        currentQuestion: 0,
        score: 0,
        answers: [],
        showResult: false,
        selectedAnswer: null,
        isAnswered: false
      });
    }
  }, [activeTab]);

  // Generate nomenclature questions
  const generateNomenclatureQuestions = (mode) => {
    const allItems = shuffleArray([...nomenclatureFormulas]);
    const selected = allItems.slice(0, 10);
    
    setNomenclatureState({
      mode,
      questions: selected,
      currentIndex: 0,
      score: 0,
      userAnswer: '',
      showResult: false,
      isAnswered: false,
      feedback: null
    });
  };

  // Check nomenclature answer
  const checkNomenclatureAnswer = () => {
    const current = nomenclatureState.questions[nomenclatureState.currentIndex];
    const userAns = nomenclatureState.userAnswer.trim().toLowerCase();
    
    let isCorrect = false;
    let correctAnswer = '';
    
    if (nomenclatureState.mode === 'formula') {
      // User writes name from formula
      correctAnswer = current.name;
      isCorrect = userAns === current.name.toLowerCase() || 
                  userAns.includes(current.name.toLowerCase().split(' ')[0]) && 
                  userAns.includes(current.name.toLowerCase().split(' ')[1]);
    } else {
      // User writes formula from name
      correctAnswer = current.formula;
      const normalizedUser = userAns.replace(/[₀₁₂₃₄₅₆₇₈₉]/g, (m) => '₀₁₂₃₄₅₆₇₈₉'.indexOf(m))
                                    .replace(/\s/g, '').toLowerCase();
      const normalizedCorrect = current.formula.replace(/[₀₁₂₃₄₅₆₇₈₉]/g, (m) => '₀₁₂₃₄₅₆₇₈₉'.indexOf(m))
                                              .replace(/\s/g, '').toLowerCase();
      isCorrect = normalizedUser === normalizedCorrect;
    }
    
    setNomenclatureState(prev => ({
      ...prev,
      isAnswered: true,
      feedback: { isCorrect, correctAnswer },
      score: isCorrect ? prev.score + 1 : prev.score
    }));
  };

  const nextNomenclatureQuestion = () => {
    if (nomenclatureState.currentIndex < nomenclatureState.questions.length - 1) {
      setNomenclatureState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
        userAnswer: '',
        isAnswered: false,
        feedback: null
      }));
    } else {
      setNomenclatureState(prev => ({
        ...prev,
        showResult: true
      }));
    }
  };

  // Quiz handlers
  const handleAnswerSelect = (index) => {
    if (quizState.isAnswered) return;
    
    const isCorrect = index === shuffledQuestions[quizState.currentQuestion].correct;
    setQuizState(prev => ({
      ...prev,
      selectedAnswer: index,
      isAnswered: true,
      score: isCorrect ? prev.score + 1 : prev.score,
      answers: [...prev.answers, { questionId: shuffledQuestions[quizState.currentQuestion].id, selected: index, correct: isCorrect }]
    }));
  };

  const nextQuestion = () => {
    if (quizState.currentQuestion < shuffledQuestions.length - 1) {
      setQuizState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
        selectedAnswer: null,
        isAnswered: false
      }));
    } else {
      setQuizState(prev => ({
        ...prev,
        showResult: true
      }));
    }
  };

  // Tab content
  const renderHome = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 mb-6 shadow-lg shadow-cyan-500/30">
            <FlaskConical className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
            Příprava na test z chemie
          </h1>
          <p className="text-slate-400 text-lg">Reakční kinetika & Názvosloví anorganických sloučenin</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => setActiveTab('theory')}
            className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur rounded-2xl p-8 border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 text-left overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                  <BookOpen className="w-7 h-7 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Teorie</h2>
                  <p className="text-slate-400 text-sm">Reakční kinetika</p>
                </div>
              </div>
              <p className="text-slate-400">Procházej si teorii krok za krokem s interaktivními diagramy a příklady.</p>
              <div className="mt-4 flex items-center text-cyan-400 text-sm font-medium">
                Začít studovat <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur rounded-2xl p-8 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 text-left overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Target className="w-7 h-7 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Kvíz</h2>
                  <p className="text-slate-400 text-sm">Reakční kinetika</p>
                </div>
              </div>
              <p className="text-slate-400">Otestuj své znalosti z reakční kinetiky v interaktivním kvízu.</p>
              <div className="mt-4 flex items-center text-purple-400 text-sm font-medium">
                Spustit kvíz <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('nomenclature')}
            className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur rounded-2xl p-8 border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300 text-left overflow-hidden md:col-span-2"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <Atom className="w-7 h-7 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Názvosloví</h2>
                  <p className="text-slate-400 text-sm">Anorganické sloučeniny</p>
                </div>
              </div>
              <p className="text-slate-400">Procvič si názvosloví oxidů, hydroxidů, kyselin, solí a hydrogensolí. 5 vzorců → názvy, 5 názvů → vzorce.</p>
              <div className="mt-4 flex items-center text-emerald-400 text-sm font-medium">
                Procvičovat názvosloví <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </button>
        </div>

        <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700/50">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Beaker className="w-5 h-5 text-cyan-400" />
            Co se naučíš
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-cyan-400 font-medium mb-2">Reakční kinetika:</h4>
              <ul className="text-slate-400 text-sm space-y-1">
                <li>• Reakční rychlost a její výpočet</li>
                <li>• Faktory ovlivňující rychlost reakce</li>
                <li>• Aktivační energie, aktivovaný komplex</li>
                <li>• Van't Hoffovo pravidlo</li>
                <li>• Guldberg-Waagův zákon</li>
                <li>• Katalyzátory a enzymy</li>
              </ul>
            </div>
            <div>
              <h4 className="text-emerald-400 font-medium mb-2">Názvosloví:</h4>
              <ul className="text-slate-400 text-sm space-y-1">
                <li>• Oxidy (Na₂O, SO₃, ...)</li>
                <li>• Hydroxidy (NaOH, Ca(OH)₂, ...)</li>
                <li>• Kyseliny (HCl, H₂SO₄, H₃PO₄, ...)</li>
                <li>• Soli (NaCl, CaCO₃, ...)</li>
                <li>• Hydrogensoli (NaHCO₃, NaH₂PO₄, ...)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTheory = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Zpět na hlavní menu
        </button>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Teorie - Reakční kinetika</h1>
          <span className="text-slate-400">{currentTheory + 1} / {kineticsTheory.length}</span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-slate-800 rounded-full mb-6 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500"
            style={{ width: `${((currentTheory + 1) / kineticsTheory.length) * 100}%` }}
          />
        </div>

        {/* Theory card */}
        <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-8 border border-slate-700/50 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-cyan-400" />
            </div>
            <h2 className="text-xl font-bold text-white">{kineticsTheory[currentTheory].title}</h2>
          </div>
          
          <div className="prose prose-invert max-w-none">
            {kineticsTheory[currentTheory].content.split('\n').map((line, i) => {
              if (line.startsWith('**') && line.endsWith('**')) {
                return <h3 key={i} className="text-cyan-400 font-semibold mt-4 mb-2">{line.replace(/\*\*/g, '')}</h3>;
              }
              if (line.startsWith('**')) {
                const parts = line.split('**');
                return (
                  <p key={i} className="text-slate-300 mb-2">
                    <strong className="text-white">{parts[1]}</strong>{parts[2]}
                  </p>
                );
              }
              if (line.startsWith('•')) {
                return <p key={i} className="text-slate-300 ml-4 mb-1">{line}</p>;
              }
              if (line.startsWith('Kde:') || line.startsWith('Příklad:')) {
                return <p key={i} className="text-slate-400 italic mt-2">{line}</p>;
              }
              return line ? <p key={i} className="text-slate-300 mb-2">{line}</p> : <br key={i} />;
            })}
          </div>

          {/* Diagram */}
          <EnergyDiagram type={kineticsTheory[currentTheory].diagram} />
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentTheory(prev => Math.max(0, prev - 1))}
            disabled={currentTheory === 0}
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Předchozí
          </button>

          {/* Topic pills */}
          <div className="hidden md:flex gap-2">
            {kineticsTheory.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentTheory(i)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  i === currentTheory ? 'bg-cyan-500' : 'bg-slate-700 hover:bg-slate-600'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentTheory(prev => Math.min(kineticsTheory.length - 1, prev + 1))}
            disabled={currentTheory === kineticsTheory.length - 1}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            Další
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderQuiz = () => {
    if (shuffledQuestions.length === 0) return null;
    
    if (quizState.showResult) {
      const percentage = Math.round((quizState.score / shuffledQuestions.length) * 100);
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6 flex items-center justify-center">
          <div className="max-w-md w-full">
            <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-8 border border-slate-700/50 text-center">
              <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${
                percentage >= 70 ? 'bg-green-500/20' : percentage >= 50 ? 'bg-yellow-500/20' : 'bg-red-500/20'
              }`}>
                <Trophy className={`w-12 h-12 ${
                  percentage >= 70 ? 'text-green-400' : percentage >= 50 ? 'text-yellow-400' : 'text-red-400'
                }`} />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">
                {percentage >= 70 ? 'Výborně!' : percentage >= 50 ? 'Dobrá práce!' : 'Zkus to znovu'}
              </h2>
              
              <p className="text-slate-400 mb-6">
                Tvé skóre: <span className="text-white font-bold">{quizState.score}</span> z <span className="text-white">{shuffledQuestions.length}</span> ({percentage}%)
              </p>

              <div className="w-full h-3 bg-slate-700 rounded-full mb-6 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${
                    percentage >= 70 ? 'bg-green-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setActiveTab('home')}
                  className="flex-1 px-6 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors"
                >
                  Zpět
                </button>
                <button
                  onClick={() => {
                    setShuffledQuestions(shuffleArray(kineticsQuestions));
                    setQuizState({
                      currentQuestion: 0,
                      score: 0,
                      answers: [],
                      showResult: false,
                      selectedAnswer: null,
                      isAnswered: false
                    });
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Znovu
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const currentQ = shuffledQuestions[quizState.currentQuestion];

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Ukončit kvíz
          </button>

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-white">Kvíz - Reakční kinetika</h1>
            <div className="flex items-center gap-4">
              <span className="text-slate-400">Skóre: <span className="text-purple-400 font-bold">{quizState.score}</span></span>
              <span className="text-slate-400">{quizState.currentQuestion + 1} / {shuffledQuestions.length}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-slate-800 rounded-full mb-8 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
              style={{ width: `${((quizState.currentQuestion + 1) / shuffledQuestions.length) * 100}%` }}
            />
          </div>

          {/* Question card */}
          <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-8 border border-slate-700/50 mb-6">
            <h2 className="text-xl text-white mb-8">{currentQ.question}</h2>

            <div className="space-y-3">
              {currentQ.options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswerSelect(i)}
                  disabled={quizState.isAnswered}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-300 ${
                    quizState.isAnswered
                      ? i === currentQ.correct
                        ? 'bg-green-500/20 border-2 border-green-500 text-green-400'
                        : i === quizState.selectedAnswer
                          ? 'bg-red-500/20 border-2 border-red-500 text-red-400'
                          : 'bg-slate-700/50 border-2 border-transparent text-slate-400'
                      : 'bg-slate-700/50 border-2 border-transparent text-white hover:bg-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                      quizState.isAnswered && i === currentQ.correct
                        ? 'bg-green-500 text-white'
                        : quizState.isAnswered && i === quizState.selectedAnswer
                          ? 'bg-red-500 text-white'
                          : 'bg-slate-600 text-slate-300'
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span>{option}</span>
                    {quizState.isAnswered && i === currentQ.correct && (
                      <Check className="w-5 h-5 ml-auto text-green-400" />
                    )}
                    {quizState.isAnswered && i === quizState.selectedAnswer && i !== currentQ.correct && (
                      <X className="w-5 h-5 ml-auto text-red-400" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Explanation */}
            {quizState.isAnswered && (
              <div className={`mt-6 p-4 rounded-xl ${
                quizState.selectedAnswer === currentQ.correct
                  ? 'bg-green-500/10 border border-green-500/30'
                  : 'bg-amber-500/10 border border-amber-500/30'
              }`}>
                <p className={`text-sm ${
                  quizState.selectedAnswer === currentQ.correct ? 'text-green-400' : 'text-amber-400'
                }`}>
                  {currentQ.explanation}
                </p>
              </div>
            )}
          </div>

          {/* Next button */}
          {quizState.isAnswered && (
            <button
              onClick={nextQuestion}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 font-medium"
            >
              {quizState.currentQuestion < shuffledQuestions.length - 1 ? (
                <>
                  Další otázka
                  <ChevronRight className="w-5 h-5" />
                </>
              ) : (
                <>
                  Zobrazit výsledky
                  <Trophy className="w-5 h-5" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderNomenclature = () => {
    // Mode selection
    if (!nomenclatureState.mode) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6">
          <div className="max-w-3xl mx-auto">
            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Zpět na hlavní menu
            </button>

            <h1 className="text-2xl font-bold text-white mb-8 text-center">Názvosloví anorganických sloučenin</h1>

            <div className="grid md:grid-cols-2 gap-6">
              <button
                onClick={() => generateNomenclatureQuestions('formula')}
                className="group relative bg-slate-800/50 backdrop-blur rounded-2xl p-8 border border-slate-700/50 hover:border-emerald-500/50 transition-all text-left"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                <div className="relative">
                  <div className="w-16 h-16 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4 text-2xl font-bold text-emerald-400">
                    H₂O
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">Vzorec → Název</h2>
                  <p className="text-slate-400 text-sm">Uvidíš vzorec a napíšeš jeho název.</p>
                  <p className="text-emerald-400 text-sm mt-4">10 příkladů (5 vzorců + 5 názvů)</p>
                </div>
              </button>

              <button
                onClick={() => generateNomenclatureQuestions('name')}
                className="group relative bg-slate-800/50 backdrop-blur rounded-2xl p-8 border border-slate-700/50 hover:border-amber-500/50 transition-all text-left"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                <div className="relative">
                  <div className="w-16 h-16 rounded-xl bg-amber-500/20 flex items-center justify-center mb-4 text-lg font-bold text-amber-400">
                    ABC
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">Název → Vzorec</h2>
                  <p className="text-slate-400 text-sm">Uvidíš název a napíšeš jeho vzorec.</p>
                  <p className="text-amber-400 text-sm mt-4">10 příkladů</p>
                </div>
              </button>
            </div>

            {/* Reference table */}
            <div className="mt-8 bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Přehled oxidačních čísel a přípon</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <span className="text-cyan-400 font-bold">+I</span>
                  <span className="text-slate-400 ml-2">-ný</span>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <span className="text-cyan-400 font-bold">+II</span>
                  <span className="text-slate-400 ml-2">-natý</span>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <span className="text-cyan-400 font-bold">+III</span>
                  <span className="text-slate-400 ml-2">-itý</span>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <span className="text-cyan-400 font-bold">+IV</span>
                  <span className="text-slate-400 ml-2">-ičitý</span>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <span className="text-cyan-400 font-bold">+V</span>
                  <span className="text-slate-400 ml-2">-ečný/-ičný</span>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <span className="text-cyan-400 font-bold">+VI</span>
                  <span className="text-slate-400 ml-2">-ový</span>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <span className="text-cyan-400 font-bold">+VII</span>
                  <span className="text-slate-400 ml-2">-istý</span>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <span className="text-cyan-400 font-bold">+VIII</span>
                  <span className="text-slate-400 ml-2">-ičelý</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Results
    if (nomenclatureState.showResult) {
      const percentage = Math.round((nomenclatureState.score / nomenclatureState.questions.length) * 100);
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6 flex items-center justify-center">
          <div className="max-w-md w-full">
            <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-8 border border-slate-700/50 text-center">
              <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${
                percentage >= 70 ? 'bg-green-500/20' : percentage >= 50 ? 'bg-yellow-500/20' : 'bg-red-500/20'
              }`}>
                <Atom className={`w-12 h-12 ${
                  percentage >= 70 ? 'text-green-400' : percentage >= 50 ? 'text-yellow-400' : 'text-red-400'
                }`} />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">
                {percentage >= 70 ? 'Výborně!' : percentage >= 50 ? 'Dobrá práce!' : 'Potřebuješ více procvičovat'}
              </h2>
              
              <p className="text-slate-400 mb-6">
                Tvé skóre: <span className="text-white font-bold">{nomenclatureState.score}</span> z <span className="text-white">{nomenclatureState.questions.length}</span> ({percentage}%)
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setNomenclatureState(prev => ({ ...prev, mode: null }))}
                  className="flex-1 px-6 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors"
                >
                  Zpět
                </button>
                <button
                  onClick={() => generateNomenclatureQuestions(nomenclatureState.mode)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Znovu
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Question screen
    const current = nomenclatureState.questions[nomenclatureState.currentIndex];
    const isFormulaMode = nomenclatureState.mode === 'formula';

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => setNomenclatureState(prev => ({ ...prev, mode: null }))}
            className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Ukončit procvičování
          </button>

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-white">
              {isFormulaMode ? 'Vzorec → Název' : 'Název → Vzorec'}
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-slate-400">Skóre: <span className="text-emerald-400 font-bold">{nomenclatureState.score}</span></span>
              <span className="text-slate-400">{nomenclatureState.currentIndex + 1} / {nomenclatureState.questions.length}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-slate-800 rounded-full mb-8 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500"
              style={{ width: `${((nomenclatureState.currentIndex + 1) / nomenclatureState.questions.length) * 100}%` }}
            />
          </div>

          {/* Question card */}
          <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-8 border border-slate-700/50 mb-6">
            {/* Display question */}
            <div className="text-center mb-8">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${
                current.type === 'oxid' ? 'bg-red-500/20 text-red-400' :
                current.type === 'hydroxid' ? 'bg-blue-500/20 text-blue-400' :
                current.type === 'kyselina' ? 'bg-yellow-500/20 text-yellow-400' :
                current.type === 'sůl' ? 'bg-green-500/20 text-green-400' :
                'bg-purple-500/20 text-purple-400'
              }`}>
                {current.type}
              </span>
              
              <div className="text-4xl font-bold text-white mb-2">
                {isFormulaMode ? current.formula : current.name}
              </div>
              
              <p className="text-slate-500 text-sm">
                {isFormulaMode ? 'Napiš název této sloučeniny' : 'Napiš vzorec této sloučeniny'}
              </p>
            </div>

            {/* Input */}
            <div className="relative">
              <input
                type="text"
                value={nomenclatureState.userAnswer}
                onChange={(e) => setNomenclatureState(prev => ({ ...prev, userAnswer: e.target.value }))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !nomenclatureState.isAnswered && nomenclatureState.userAnswer.trim()) {
                    checkNomenclatureAnswer();
                  }
                }}
                disabled={nomenclatureState.isAnswered}
                placeholder={isFormulaMode ? 'např. oxid sodný' : 'např. Na₂O (použij ₂ pro dolní index)'}
                className="w-full p-4 bg-slate-700/50 border-2 border-slate-600 rounded-xl text-white text-lg text-center focus:outline-none focus:border-emerald-500 disabled:opacity-50 placeholder:text-slate-500"
              />
              
              {/* Hint */}
              <p className="text-center text-slate-500 text-xs mt-2">
                💡 Nápověda: {current.hint}
              </p>
            </div>

            {/* Check button */}
            {!nomenclatureState.isAnswered && (
              <button
                onClick={checkNomenclatureAnswer}
                disabled={!nomenclatureState.userAnswer.trim()}
                className="w-full mt-6 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity font-medium"
              >
                Zkontrolovat
              </button>
            )}

            {/* Feedback */}
            {nomenclatureState.feedback && (
              <div className={`mt-6 p-4 rounded-xl ${
                nomenclatureState.feedback.isCorrect
                  ? 'bg-green-500/20 border border-green-500/30'
                  : 'bg-red-500/20 border border-red-500/30'
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  {nomenclatureState.feedback.isCorrect ? (
                    <Check className="w-6 h-6 text-green-400" />
                  ) : (
                    <X className="w-6 h-6 text-red-400" />
                  )}
                  <span className={`font-bold ${
                    nomenclatureState.feedback.isCorrect ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {nomenclatureState.feedback.isCorrect ? 'Správně!' : 'Špatně'}
                  </span>
                </div>
                {!nomenclatureState.feedback.isCorrect && (
                  <p className="text-slate-300">
                    Správná odpověď: <span className="font-bold text-white">{nomenclatureState.feedback.correctAnswer}</span>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Next button */}
          {nomenclatureState.isAnswered && (
            <button
              onClick={nextNomenclatureQuestion}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 font-medium"
            >
              {nomenclatureState.currentIndex < nomenclatureState.questions.length - 1 ? (
                <>
                  Další
                  <ChevronRight className="w-5 h-5" />
                </>
              ) : (
                <>
                  Zobrazit výsledky
                  <Trophy className="w-5 h-5" />
                </>
              )}
            </button>
          )}

          {/* Subscript helper for formula mode */}
          {!isFormulaMode && !nomenclatureState.isAnswered && (
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              <span className="text-slate-500 text-sm">Dolní indexy:</span>
              {['₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'].map(sub => (
                <button
                  key={sub}
                  onClick={() => setNomenclatureState(prev => ({ ...prev, userAnswer: prev.userAnswer + sub }))}
                  className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded text-white font-mono"
                >
                  {sub}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Main render
  return (
    <div className="font-sans">
      {activeTab === 'home' && renderHome()}
      {activeTab === 'theory' && renderTheory()}
      {activeTab === 'quiz' && renderQuiz()}
      {activeTab === 'nomenclature' && renderNomenclature()}
    </div>
  );
}
