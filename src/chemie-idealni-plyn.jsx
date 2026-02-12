// @title Chemie - Ideální plyn
// @subject Chemistry
// @topic Chemistry
// @template practice

import React, { useState, useEffect } from 'react';

const sections = {
  FORMULAS: 'formulas',
  THEORY: 'theory',
  PROBLEMS: 'problems',
  QUIZ: 'quiz',
  FLASHCARDS: 'flashcards'
};

// Všechny vzorečky
const formulas = [
  {
    category: 'Látkové množství',
    items: [
      { name: 'Látkové množství (z počtu částic)', formula: 'n = N / Nₐ', desc: 'N - počet atomů, Nₐ - Avogadrova konstanta (6,022·10²³ mol⁻¹)' },
      { name: 'Látkové množství (z hmotnosti)', formula: 'n = m / Mₘ', desc: 'm - hmotnost vzorku, Mₘ - molární hmotnost' },
      { name: 'Molární hmotnost', formula: 'Mₘ = Mᵣ [g/mol]', desc: 'Mᵣ - relativní molekulová hmotnost' },
    ]
  },
  {
    category: 'Kinetická teorie',
    items: [
      { name: 'Střední kinetická energie molekuly', formula: 'Ēₖ = (3/2)kT', desc: 'k - Boltzmannova konstanta (1,38·10⁻²³ J/K), T - termodynamická teplota' },
      { name: 'Střední kvadratická rychlost (s R)', formula: 'vₖᵥ = √(3RT/M)', desc: 'R - molární plynová konstanta (8,31 J·mol⁻¹·K⁻¹), M - molární hmotnost v kg/mol' },
      { name: 'Střední kvadratická rychlost (s k)', formula: 'vₖ = √(3kT/m₀)', desc: 'm₀ - hmotnost jedné molekuly' },
      { name: 'Úhrnná kinetická energie', formula: 'Eₖ = (3/2)nRT', desc: 'Celková kinetická energie všech molekul' },
    ]
  },
  {
    category: 'Stavová rovnice',
    items: [
      { name: 'Stavová rovnice (N, k)', formula: 'pV = NkT', desc: 'N - počet molekul' },
      { name: 'Stavová rovnice (n, R)', formula: 'pV = nRT', desc: 'n - látkové množství' },
      { name: 'Stavová rovnice (m, Mₘ)', formula: 'pV = (m/Mₘ)RT', desc: 'm - hmotnost plynu' },
      { name: 'Stavová rovnice (1 mol)', formula: 'pVₘ = RT', desc: 'Vₘ - molární objem' },
      { name: 'Přechod mezi stavy', formula: 'p₁V₁/T₁ = p₂V₂/T₂', desc: 'Pro stálé množství plynu' },
    ]
  },
  {
    category: 'Speciální děje',
    items: [
      { name: 'Izotermický děj (T = konst.)', formula: 'p₁V₁ = p₂V₂', desc: 'Boyleův-Mariottův zákon' },
      { name: 'Izobarický děj (p = konst.)', formula: 'V₁/T₁ = V₂/T₂', desc: 'Gay-Lussacův zákon' },
      { name: 'Izochorický děj (V = konst.)', formula: 'p₁/T₁ = p₂/T₂', desc: 'Charlesův zákon' },
    ]
  },
  {
    category: 'Termodynamika',
    items: [
      { name: 'I. termodynamický princip', formula: 'Q = ΔU + W', desc: 'Q - dodané teplo, ΔU - změna vnitřní energie, W - práce plynu' },
      { name: 'Účinnost tepelného stroje', formula: 'η = W/Q₁ = (Q₁-Q₂)/Q₁', desc: 'Q₁ - teplo od ohřívače, Q₂ - teplo odevzdané chladiči' },
      { name: 'Carnotova účinnost', formula: 'η = (T₁-T₂)/T₁ = ΔT/T₁', desc: 'Maximální teoretická účinnost' },
    ]
  },
  {
    category: 'Konstanty',
    items: [
      { name: 'Avogadrova konstanta', formula: 'Nₐ = 6,022·10²³ mol⁻¹', desc: 'Počet částic v 1 molu' },
      { name: 'Boltzmannova konstanta', formula: 'k = 1,38·10⁻²³ J/K', desc: 'Konstanta pro jednu molekulu' },
      { name: 'Molární plynová konstanta', formula: 'R = 8,31 J·mol⁻¹·K⁻¹', desc: 'R = k·Nₐ' },
      { name: 'Normální podmínky', formula: 'T₀ = 273 K, p₀ = 101 325 Pa', desc: '0°C a normální atmosférický tlak' },
    ]
  }
];

// Teorie - podrobná
const theoryContent = [
  {
    title: 'Model ideálního plynu',
    content: `Ideální plyn je teoretický model, který zjednodušuje chování reálných plynů. Tento model je velmi užitečný, protože umožňuje matematicky popsat chování plynů pomocí jednoduchých rovnic.

ZÁKLADNÍ PŘEDPOKLADY MODELU:

1. Molekuly jsou bodové částice
   → Jejich vlastní objem je zanedbatelný vzhledem k objemu nádoby
   → Ve skutečnosti molekuly mají rozměry řádově 10⁻¹⁰ m

2. Mezi molekulami nepůsobí přitažlivé ani odpudivé síly
   → Molekuly na sebe působí pouze při srážkách
   → Reálné molekuly mají slabé Van der Waalsovy síly

3. Srážky molekul jsou dokonale pružné
   → Při srážce se zachovává kinetická energie
   → Molekuly si pouze vymění hybnosti

4. Pohyb molekul je zcela chaotický (neuspořádaný)
   → Molekuly se pohybují všemi směry s různými rychlostmi
   → Střední rychlost v každém směru je nulová

KDY SE REÁLNÝ PLYN CHOVÁ JAKO IDEÁLNÍ?
• Při nízkých tlacích (molekuly jsou daleko od sebe)
• Při vysokých teplotách (kinetická energie >> přitažlivé síly)
• Vzduch za normálních podmínek se chová téměř jako ideální plyn

KDY MODEL SELHÁVÁ?
• Při velmi vysokých tlacích
• Při nízkých teplotách (blízko ke zkapalnění)
• Pro polární molekuly s velkými přitažlivými silami`
  },
  {
    title: 'Látkové množství a mol',
    content: `Látkové množství n je základní veličina, která udává "počet molů" látky ve vzorku. Je to způsob, jak počítat s obrovským množstvím molekul.

CO JE MOL?
Mol je jednotka látkového množství. 1 mol jakékoliv látky obsahuje vždy stejný počet částic:

Nₐ = 6,022 · 10²³ mol⁻¹  (Avogadrova konstanta)

To je obrovské číslo! Pro představu:
• 1 mol vody (18 g) obsahuje 602 200 000 000 000 000 000 000 molekul
• Kdybychom počítali 1 miliardu molekul za sekundu, trvalo by nám to 19 milionů let

VÝPOČET LÁTKOVÉHO MNOŽSTVÍ:

Z počtu částic:     n = N / Nₐ
Z hmotnosti:        n = m / Mₘ

kde:
• N = počet částic (molekul, atomů)
• Nₐ = Avogadrova konstanta = 6,022·10²³ mol⁻¹
• m = hmotnost vzorku
• Mₘ = molární hmotnost

MOLÁRNÍ HMOTNOST Mₘ:
• Hmotnost jednoho molu látky
• Jednotka: g/mol (nebo kg/mol v SI)
• Číselně se rovná relativní molekulové hmotnosti Mᵣ

Příklady molárních hmotností:
• H₂: Mₘ = 2 g/mol (2 × 1)
• O₂: Mₘ = 32 g/mol (2 × 16)
• N₂: Mₘ = 28 g/mol (2 × 14)
• Ar: Mₘ = 40 g/mol
• CO₂: Mₘ = 44 g/mol (12 + 2×16)
• H₂O: Mₘ = 18 g/mol (2×1 + 16)

DŮLEŽITÝ POZNATEK:
Mᵣ gramů libovolné látky obsahuje vždy stejný počet částic Nₐ!
• 2 g vodíku = 32 g kyslíku = 28 g dusíku = 1 mol = 6,022·10²³ molekul`
  },
  {
    title: 'Kinetická teorie plynů',
    content: `Kinetická teorie vysvětluje makroskopické vlastnosti plynů (tlak, teplota) pomocí pohybu molekul na mikroskopické úrovni.

STŘEDNÍ KINETICKÁ ENERGIE MOLEKULY:

Ēₖ = (3/2) · k · T

kde:
• Ēₖ = střední kinetická energie jedné molekuly [J]
• k = Boltzmannova konstanta = 1,38·10⁻²³ J/K
• T = termodynamická (absolutní) teplota [K]

⚠️ KLÍČOVÝ POZNATEK:
Všechny molekuly ideálního plynu mají při dané teplotě STEJNOU střední kinetickou energii, bez ohledu na jejich hmotnost!

To znamená:
• Molekula vodíku (lehká) má stejnou Ēₖ jako molekula kyslíku (těžká)
• Aby to platilo, lehčí molekuly se musí pohybovat RYCHLEJI

STŘEDNÍ KVADRATICKÁ RYCHLOST:

S molární plynovou konstantou:    vₖᵥ = √(3RT/M)
S Boltzmannovou konstantou:       vₖᵥ = √(3kT/m₀)

kde:
• R = 8,31 J·mol⁻¹·K⁻¹ (molární plynová konstanta)
• M = molární hmotnost v kg/mol (POZOR na jednotky!)
• m₀ = hmotnost jedné molekuly v kg

VZTAH KONSTANT:  R = k · Nₐ

POMĚR RYCHLOSTÍ RŮZNÝCH PLYNŮ:
Při stejné teplotě platí:

v₁/v₂ = √(M₂/M₁)

Příklad: Vodík vs. kyslík
vH₂/vO₂ = √(32/2) = √16 = 4

→ Molekuly vodíku se pohybují 4× rychleji než molekuly kyslíku!

TYPICKÉ RYCHLOSTI PŘI 20°C:
• H₂: ~1 900 m/s
• He: ~1 350 m/s
• N₂: ~510 m/s
• O₂: ~480 m/s
• CO₂: ~410 m/s

ÚHRNNÁ KINETICKÁ ENERGIE (všech molekul):

Eₖ = N · Ēₖ = N · (3/2)kT = (3/2)nRT

kde n je látkové množství v molech.`
  },
  {
    title: 'Stavová rovnice ideálního plynu',
    content: `Stavová rovnice je základní rovnice popisující vztah mezi stavovými veličinami plynu: tlakem p, objemem V a teplotou T.

RŮZNÉ TVARY STAVOVÉ ROVNICE:

1. S počtem molekul N:
   pV = NkT
   
2. S látkovým množstvím n:
   pV = nRT
   
3. S hmotností m:
   pV = (m/Mₘ)RT
   
4. Pro 1 mol (n = 1):
   pVₘ = RT
   (Vₘ je molární objem)

VÝZNAM VELIČIN:
• p = tlak [Pa]
• V = objem [m³]
• T = termodynamická teplota [K] ⚠️ VŽDY V KELVINECH!
• N = počet molekul
• n = látkové množství [mol]
• k = Boltzmannova konstanta = 1,38·10⁻²³ J/K
• R = molární plynová konstanta = 8,31 J·mol⁻¹·K⁻¹

PŘEVOD TEPLOTY:
T [K] = t [°C] + 273,15 ≈ t [°C] + 273

Příklady:
• 0°C = 273 K
• 20°C = 293 K
• 27°C = 300 K (často v úlohách!)
• 100°C = 373 K
• -273°C = 0 K (absolutní nula)

PŘECHOD MEZI DVĚMA STAVY:
Pro stálé množství plynu (m = konst.) platí:

p₁V₁/T₁ = p₂V₂/T₂

Toto je velmi užitečný vztah pro výpočty!

NORMÁLNÍ PODMÍNKY:
• Teplota: T₀ = 273,15 K (0°C)
• Tlak: p₀ = 101 325 Pa (1 atm)
• Molární objem: Vₘ = 22,4 dm³/mol

Za normálních podmínek má 1 mol jakéhokoliv ideálního plynu objem 22,4 litrů!

PRAKTICKÝ POSTUP ŘEŠENÍ ÚLOH:
1. Zapiš všechny dané hodnoty
2. Převeď jednotky (zejména T do Kelvinů, V do m³)
3. Vyber správný tvar stavové rovnice
4. Dosaď a vypočítej
5. Zkontroluj jednotky výsledku`
  },
  {
    title: 'Izotermický děj (T = konst.)',
    content: `Izotermický děj je děj, při kterém se NEMĚNÍ TEPLOTA plynu.

PODMÍNKA: T = konstantní

PLATÍ (Boyleův-Mariottův zákon):
pV = konst.
p₁V₁ = p₂V₂

→ Tlak je nepřímo úměrný objemu
→ Když objem roste 2×, tlak klesá na polovinu

GRAF V p-V DIAGRAMU:
Hyperbola (rovnoosá) - čím vyšší teplota, tím dál od os

ENERGETICKÁ BILANCE:
• ΔU = 0 (vnitřní energie závisí jen na teplotě)
• Q = W
• Veškeré dodané teplo se přemění na práci (nebo naopak)

PRVNÍ TERMODYNAMICKÝ PRINCIP:
Q = ΔU + W
Q = 0 + W
Q = W

CO SE DĚJE FYZIKÁLNĚ?

Při izotermické EXPANZI (rozpínání):
• Objem roste, tlak klesá
• Plyn koná práci (W > 0)
• Aby teplota zůstala stejná, musíme DODÁVAT teplo
• Q > 0 (teplo přijímáme)

Při izotermické KOMPRESI (stlačování):
• Objem klesá, tlak roste
• Okolí koná práci na plynu (W < 0)
• Aby teplota zůstala stejná, musíme ODVÁDĚT teplo
• Q < 0 (teplo odevzdáváme)

PŘÍKLAD Z PRAXE:
Pomalé stlačování vzduchu v pumpě, kdy má teplo čas uniknout do okolí.`
  },
  {
    title: 'Izobarický děj (p = konst.)',
    content: `Izobarický děj je děj, při kterém se NEMĚNÍ TLAK plynu.

PODMÍNKA: p = konstantní

PLATÍ (Gay-Lussacův zákon):
V/T = konst.
V₁/T₁ = V₂/T₂

→ Objem je přímo úměrný teplotě
→ Když teplota roste 2×, objem roste také 2×

GRAF V p-V DIAGRAMU:
Vodorovná přímka (rovnoběžná s osou V)

ENERGETICKÁ BILANCE:
• ΔU ≠ 0 (mění se teplota → mění se vnitřní energie)
• W ≠ 0 (mění se objem → plyn koná nebo přijímá práci)
• Q = ΔU + W

PRÁCE PLYNU PŘI IZOBARICKÉM DĚJI:
W = p · ΔV = p · (V₂ - V₁)

(V p-V diagramu je to plocha obdélníku pod přímkou)

PRVNÍ TERMODYNAMICKÝ PRINCIP:
Q = ΔU + W

CO SE DĚJE FYZIKÁLNĚ?

Při izobarickém OHŘEVU:
• Teplota roste → roste vnitřní energie (ΔU > 0)
• Objem roste → plyn koná práci (W > 0)
• Musíme dodávat teplo na OBĚ změny
• Q = ΔU + W > 0

Při izobarickém OCHLAZENÍ:
• Teplota klesá → klesá vnitřní energie (ΔU < 0)
• Objem klesá → okolí koná práci na plynu (W < 0)
• Teplo se uvolňuje
• Q = ΔU + W < 0

PŘÍKLAD Z PRAXE:
Ohřívání vzduchu v otevřené nádobě (atmosférický tlak je konstantní).
Píst v cylindru zatížený stálým závažím.`
  },
  {
    title: 'Izochorický děj (V = konst.)',
    content: `Izochorický děj je děj, při kterém se NEMĚNÍ OBJEM plynu.

PODMÍNKA: V = konstantní

PLATÍ (Charlesův zákon):
p/T = konst.
p₁/T₁ = p₂/T₂

→ Tlak je přímo úměrný teplotě
→ Když teplota roste 2×, tlak roste také 2×

GRAF V p-V DIAGRAMU:
Svislá přímka (rovnoběžná s osou p)

ENERGETICKÁ BILANCE:
• ΔU ≠ 0 (mění se teplota)
• W = 0 (objem se nemění → plyn nekoná práci!)
• Q = ΔU

PROČ JE PRÁCE NULOVÁ?
Práce W = ∫p dV
Když se objem nemění (dV = 0), tak W = 0.

PRVNÍ TERMODYNAMICKÝ PRINCIP:
Q = ΔU + W
Q = ΔU + 0
Q = ΔU

→ Veškeré dodané teplo jde na zvýšení vnitřní energie!

CO SE DĚJE FYZIKÁLNĚ?

Při izochorickém OHŘEVU:
• Teplota roste → roste vnitřní energie (ΔU > 0)
• Objem je stejný → tlak roste
• Práce se nekoná (W = 0)
• Q = ΔU > 0 (dodáváme teplo)

Při izochorickém OCHLAZENÍ:
• Teplota klesá → klesá vnitřní energie (ΔU < 0)
• Objem je stejný → tlak klesá
• Práce se nekoná (W = 0)
• Q = ΔU < 0 (odebíráme teplo)

PŘÍKLAD Z PRAXE:
Ohřívání plynu v uzavřené pevné nádobě (tlaková láhev).
Vaření v papiňáku (objem je konstantní).

⚠️ POZOR: Zvýšení tlaku při ohřevu v uzavřené nádobě může být nebezpečné!`
  },
  {
    title: 'První termodynamický princip (I. TDP)',
    content: `První termodynamický princip je zákon zachování energie pro tepelné děje.

FORMULACE:
Q = ΔU + W

kde:
• Q = teplo dodané soustavě [J]
• ΔU = změna vnitřní energie soustavy [J]
• W = práce vykonaná soustavou (plynem) [J]

ZNAMÉNKOVÁ KONVENCE:
Q > 0 ... soustava teplo PŘIJÍMÁ
Q < 0 ... soustava teplo ODEVZDÁVÁ

ΔU > 0 ... vnitřní energie ROSTE (teplota roste)
ΔU < 0 ... vnitřní energie KLESÁ (teplota klesá)

W > 0 ... plyn KONÁ práci (rozpíná se)
W < 0 ... okolí koná práci NA plynu (plyn je stlačován)

SLOVNÍ VYJÁDŘENÍ:
"Teplo dodané soustavě se spotřebuje na zvýšení vnitřní energie a na vykonání práce."

APLIKACE NA JEDNOTLIVÉ DĚJE:

Izotermický (T = konst.):
• ΔU = 0 (teplota se nemění)
• Q = W

Izobarický (p = konst.):
• Q = ΔU + W
• W = pΔV

Izochorický (V = konst.):
• W = 0 (objem se nemění)
• Q = ΔU

Adiabatický (Q = 0):
• Žádná výměna tepla s okolím
• 0 = ΔU + W
• W = -ΔU
• Při expanzi plyn chladne, při kompresi se ohřívá

VNITŘNÍ ENERGIE IDEÁLNÍHO PLYNU:
U = (3/2)nRT (pro jednoatomový plyn)

Vnitřní energie závisí POUZE na teplotě!
ΔU = (3/2)nRΔT`
  },
  {
    title: 'Kruhové (cyklické) děje',
    content: `Kruhový děj je posloupnost termodynamických dějů, při které se soustava vrátí do původního stavu.

VLASTNOSTI KRUHOVÉHO DĚJE:
• Počáteční stav = koncový stav
• ΔU = 0 (celková změna vnitřní energie je nulová)
• Q = W (celkové dodané teplo = celková práce)

V p-V DIAGRAMU:
• Kruhový děj tvoří uzavřenou křivku
• Práce = plocha uvnitř křivky
• Směr po směru hodinových ručiček → plyn koná práci (W > 0)
• Směr proti směru hodinových ručiček → okolí koná práci (W < 0)

ANALÝZA CYKLU ABCA (příklad z testu):

Cyklus 1 (V-T diagram: A dole, B vpravo nahoře, C vlevo nahoře):
Překreslení do p-V: A vlevo dole, B vpravo, C vlevo nahoře

AB - izobarický děj (p = konst.):
• V roste, T roste
• Plyn se rozpíná → koná práci (W > 0)
• Teplota roste → ΔU > 0
• Musíme dodávat teplo: Q = ΔU + W > 0

BC - izochorický děj (V = konst.):
• p klesá, T klesá
• Objem se nemění → W = 0
• Teplota klesá → ΔU < 0
• Teplo se odevzdává: Q = ΔU < 0

CA - izotermický děj (T = konst.):
• V klesá, p roste
• Plyn je stlačován → okolí koná práci (W < 0)
• Teplota je konstantní → ΔU = 0
• Teplo se odevzdává: Q = W < 0

SHRNUTÍ PRO CYKLUS:
• Teplo přijímáno: v části AB
• Teplo odevzdáváno: v částech BC a CA
• Práce plynu: v části AB
• Práce okolí: v části CA`
  },
  {
    title: 'Tepelné stroje a II. termodynamický princip',
    content: `Tepelný stroj je zařízení, které cyklicky přeměňuje tepelnou energii na mechanickou práci.

PRINCIP ČINNOSTI:
1. Stroj odebírá teplo Q₁ od OHŘÍVAČE (teplota T₁)
2. Část energie se přemění na práci W
3. Zbytek Q₂ se odevzdá CHLADIČI (teplota T₂)

Platí: Q₁ = W + Q₂

ÚČINNOST TEPELNÉHO STROJE:

η = W/Q₁ = (Q₁ - Q₂)/Q₁ = 1 - Q₂/Q₁

• η je vždy menší než 1 (100%)
• Účinnost udává, jaká část přijatého tepla se přemění na práci

CARNOTŮV (IDEÁLNÍ) STROJ:
Pracuje pouze s reverzibilními (vratnými) ději.
Má maximální možnou účinnost:

η_max = (T₁ - T₂)/T₁ = 1 - T₂/T₁ = ΔT/T₁

kde T₁ a T₂ jsou absolutní teploty v Kelvinech!

⚠️ DŮLEŽITÉ:
• Carnotova účinnost je TEORETICKÉ MAXIMUM
• Žádný reálný stroj ji nemůže překročit
• Čím větší teplotní rozdíl, tím vyšší účinnost

II. TERMODYNAMICKÝ PRINCIP:
"Není možné sestrojit periodicky pracující tepelný stroj, který by pouze odebíral teplo od jednoho tělesa a měnil ho v práci."

→ Vždy potřebujeme chladič!
→ Část tepla se vždy "ztratí" do chladiče

ÚČINNOST REÁLNÝCH MOTORŮ:

Zážehové (benzínové) motory: 20-35%
• Nižší kompresní poměr
• Zapalování jiskrou

Vznětové (dieselové) motory: 30-50%
• Vyšší kompresní poměr
• Samovznícení paliva
• Efektivnější spalování

PŘÍKLAD VÝPOČTU:
Ohřívač: 927°C = 1200 K
Chladič: 447°C = 720 K

Carnotova účinnost:
η = 1 - 720/1200 = 1 - 0,6 = 0,4 = 40%

Skutečný motor má účinnost např. 25%.
Rozdíl: 40% - 25% = 15 procentních bodů`
  },
  {
    title: 'Atmosféra Měsíce a únik plynů',
    content: `Astronomové předpokládají, že Měsíc měl původně atmosféru podobnou Zemi. Proč ji dnes nemá?

HLAVNÍ PŘÍČINA: MALÁ GRAVITACE

Měsíc má hmotnost pouze 1/81 hmotnosti Země.
Gravitační zrychlení na povrchu: g_Měsíc ≈ 1,6 m/s² (asi 1/6 zemského)

ÚNIKOVÁ RYCHLOST:
• Země: v_únik ≈ 11,2 km/s
• Měsíc: v_únik ≈ 2,4 km/s

MECHANISMUS ÚNIKU ATMOSFÉRY:

1. Molekuly plynu mají různé rychlosti (Maxwellovo rozdělení)
2. Některé molekuly mají rychlost vyšší než únikovou
3. Pokud jsou v horních vrstvách atmosféry, mohou uniknout do vesmíru
4. Postupně všechny molekuly uniknou

ROLE STŘEDNÍ KVADRATICKÉ RYCHLOSTI:

Při teplotě T je střední kvadratická rychlost: vₖᵥ = √(3RT/M)

Pro různé plyny při 300 K:
• H₂: vₖᵥ ≈ 1 900 m/s
• He: vₖᵥ ≈ 1 350 m/s
• N₂: vₖᵥ ≈ 510 m/s
• O₂: vₖᵥ ≈ 480 m/s

SROVNÁNÍ S ÚNIKOVOU RYCHLOSTÍ:

Pravidlo: Pokud vₖᵥ > v_únik/6, atmosféra postupně unikne.

Pro Měsíc (v_únik ≈ 2 400 m/s):
• Kritická rychlost: 2400/6 = 400 m/s
• H₂, He, N₂, O₂ - všechny překračují tuto hranici!

Pro Zemi (v_únik ≈ 11 200 m/s):
• Kritická rychlost: 11200/6 ≈ 1 900 m/s
• H₂ a He mohou unikat (a skutečně unikají!)
• N₂ a O₂ zůstávají (proto máme atmosféru)

ČASOVÝ PRŮBĚH:
• Lehké plyny (H₂, He) unikly velmi rychle
• Těžší plyny (N₂, O₂) unikaly pomaleji
• Za miliardy let unikly všechny

DALŠÍ FAKTORY:
• Sluneční vítr (proud nabitých částic)
• Absence magnetického pole Měsíce
• Vysoké denní teploty (až 127°C)

ZÁVĚR:
Kombinace malé gravitace, vysokých teplot a absence magnetického pole vedla k úplné ztrátě atmosféry Měsíce.`
  }
];

// Řešené příklady
const problems = [
  {
    id: 1,
    question: 'Vypočítejte střední kvadratickou rychlost molekul kyslíku při pokojové teplotě.',
    given: ['T = 293 K (pokojová teplota)', 'M(O₂) = 0,032 kg·mol⁻¹', 'R = 8,31 J·mol⁻¹·K⁻¹'],
    solution: [
      'Použijeme vzorec: vₖᵥ = √(3RT/M)',
      'vₖᵥ = √(3 · 8,31 · 293 / 0,032)',
      'vₖᵥ = √(7303,89 / 0,032)',
      'vₖᵥ = √228247',
      'vₖᵥ ≈ 478 m/s ≈ 4,8·10² m/s'
    ],
    answer: 'vₖᵥ ≈ 480 m/s',
    tip: 'Nezapomeň převést molární hmotnost na kg/mol!'
  },
  {
    id: 2,
    question: 'Určete poměr středních kvadratických rychlostí molekul vodíku a kyslíku při stejných teplotách.',
    given: ['M(H₂) = 2 g/mol', 'M(O₂) = 32 g/mol'],
    solution: [
      'Střední kvadratická rychlost: v = √(3RT/M)',
      'Poměr rychlostí: vH₂/vO₂ = √(MO₂/MH₂)',
      'vH₂/vO₂ = √(32/2)',
      'vH₂/vO₂ = √16 = 4'
    ],
    answer: 'Molekuly vodíku se pohybují 4× rychleji než molekuly kyslíku',
    tip: 'Lehčí molekuly se pohybují rychleji! Poměr rychlostí je nepřímo úměrný odmocnině z poměru hmotností.'
  },
  {
    id: 3,
    question: 'Vzorek argonu o hmotnosti 100 g má teplotu 20°C. Vypočítejte úhrnnou kinetickou energii všech jeho molekul.',
    given: ['m = 0,1 kg = 100 g', 'M(Ar) = 0,04 kg/mol = 40 g/mol', 't = 20°C → T = 293 K', 'R = 8,31 J·mol⁻¹·K⁻¹'],
    solution: [
      'Nejprve spočítáme látkové množství: n = m/Mₘ',
      'n = 100/40 = 2,5 mol',
      'Úhrnná kinetická energie: Eₖ = (3/2)nRT',
      'Eₖ = (3/2) · 2,5 · 8,31 · 293',
      'Eₖ = 1,5 · 2,5 · 8,31 · 293',
      'Eₖ ≈ 9124 J ≈ 9,1 kJ'
    ],
    answer: 'Eₖ ≈ 9,1 kJ',
    tip: 'Převeď °C na K a nezapomeň na vzorec Eₖ = (3/2)nRT'
  },
  {
    id: 4,
    question: 'V nádobě o objemu 2,0 l je 6,0·10²⁰ molekul plynu. Tlak plynu je 2,6·10³ Pa. Jaká je jeho teplota?',
    given: ['V = 2,0 l = 2,0·10⁻³ m³', 'N = 6,0·10²⁰', 'p = 2,6·10³ Pa', 'k = 1,38·10⁻²³ J/K'],
    solution: [
      'Použijeme stavovou rovnici: pV = NkT',
      'Vyjádříme teplotu: T = pV/(Nk)',
      'T = (2,6·10³ · 2,0·10⁻³) / (6,0·10²⁰ · 1,38·10⁻²³)',
      'T = 5,2 / (8,28·10⁻³)',
      'T ≈ 628 K ≈ 630 K'
    ],
    answer: 'T ≈ 630 K (≈ 357°C)',
    tip: 'Když znáš počet molekul N, použij tvar pV = NkT s Boltzmannovou konstantou.'
  },
  {
    id: 5,
    question: 'Kolik molekul je za normálních podmínek obsaženo v ideálním plynu o objemu 1 cm³? Jak dlouho by trvalo jeho čerpání, kdybychom každou sekundu ubrali 10⁶ molekul?',
    given: ['V = 1 cm³ = 10⁻⁶ m³', 'p₀ = 101325 Pa', 'T₀ = 273 K', 'k = 1,38·10⁻²³ J/K'],
    solution: [
      'Ze stavové rovnice: N = pV/(kT)',
      'N = (101325 · 10⁻⁶) / (1,38·10⁻²³ · 273)',
      'N ≈ 2,69·10¹⁹ molekul',
      '',
      'Doba čerpání: t = N / (10⁶ molekul/s)',
      't = 2,69·10¹⁹ / 10⁶ = 2,69·10¹³ s',
      't = 2,69·10¹³ / (3,15·10⁷) s/rok',
      't ≈ 8,5·10⁵ roků ≈ 9·10⁵ roků'
    ],
    answer: 'N ≈ 2,7·10¹⁹ molekul; čerpání by trvalo asi 900 000 let!',
    tip: 'Normální podmínky: T₀ = 273 K (0°C), p₀ = 101 325 Pa'
  },
  {
    id: 6,
    question: 'V nádobě o objemu 3,0 litry je dusík N₂ o hmotnosti 56 g a teplotě 27°C. Jaký je jeho tlak?',
    given: ['V = 3,0 l = 3,0·10⁻³ m³', 'm = 56 g', 'M(N₂) = 28 g/mol', 't = 27°C → T = 300 K', 'R = 8,31 J·mol⁻¹·K⁻¹'],
    solution: [
      'Látkové množství: n = m/Mₘ = 56/28 = 2 mol',
      'Ze stavové rovnice: pV = nRT',
      'p = nRT/V',
      'p = (2 · 8,31 · 300) / (3,0·10⁻³)',
      'p = 4986 / (3,0·10⁻³)',
      'p = 1,662·10⁶ Pa ≈ 1,7·10⁶ Pa ≈ 1,7 MPa'
    ],
    answer: 'p ≈ 1,7·10⁶ Pa = 1,7 MPa (asi 17 atmosfér)',
    tip: 'Dusík N₂ má molární hmotnost 28 g/mol (2×14)'
  },
  {
    id: 7,
    question: 'Plyn uzavřený v nádobě má při teplotě 15°C tlak 4·10⁵ Pa. Při jaké teplotě bude mít tlak 5·10⁵ Pa? (V = konst.)',
    given: ['t₁ = 15°C → T₁ = 288 K', 'p₁ = 4·10⁵ Pa', 'p₂ = 5·10⁵ Pa', 'V = konst. (izochorický děj)'],
    solution: [
      'Pro izochorický děj platí: p₁/T₁ = p₂/T₂',
      'T₂ = T₁ · p₂/p₁',
      'T₂ = 288 · (5·10⁵)/(4·10⁵)',
      'T₂ = 288 · 1,25',
      'T₂ = 360 K',
      't₂ = 360 - 273 = 87°C'
    ],
    answer: 't₂ = 87°C (T₂ = 360 K)',
    tip: 'Při konstantním objemu je tlak přímo úměrný teplotě.'
  },
  {
    id: 8,
    question: 'Teplota plynu se při stálém tlaku zvětšila z 27°C na 39°C. O kolik procent se při tom zvětšil objem?',
    given: ['t₁ = 27°C → T₁ = 300 K', 't₂ = 39°C → T₂ = 312 K', 'p = konst. (izobarický děj)'],
    solution: [
      'Pro izobarický děj platí: V₁/T₁ = V₂/T₂',
      'V₂/V₁ = T₂/T₁',
      'V₂/V₁ = 312/300 = 1,04',
      'Objem se zvětšil na 104% původního',
      'Nárůst: 104% - 100% = 4%'
    ],
    answer: 'Objem se zvětšil o 4%',
    tip: 'Při konstantním tlaku je objem přímo úměrný teplotě (Gay-Lussacův zákon).'
  },
  {
    id: 9,
    question: 'Tepelný motor pracuje s účinností 25%, má teplotu ohřívače 927°C a chladiče 447°C. Vypočtěte účinnost ideálního tepelného stroje a o kolik % je větší než skutečná účinnost.',
    given: ['η_skutečná = 25%', 'T₁ = 927°C + 273 = 1200 K (ohřívač)', 'T₂ = 447°C + 273 = 720 K (chladič)'],
    solution: [
      'Carnotova účinnost: η = 1 - T₂/T₁',
      'η = 1 - 720/1200',
      'η = 1 - 0,6 = 0,4 = 40%',
      '',
      'Rozdíl účinností:',
      'Δη = 40% - 25% = 15%'
    ],
    answer: 'Ideální účinnost = 40%; je o 15 procentních bodů větší než skutečná',
    tip: 'Carnotova účinnost je teoretické maximum! Reálné motory ho nikdy nedosáhnou.'
  }
];

// Kvízové otázky - správná odpověď je vždy první, zamíchá se při zobrazení
const quizQuestionsRaw = [
  {
    question: 'Jaký je vzorec pro střední kinetickou energii jedné molekuly ideálního plynu?',
    options: ['Ēₖ = (3/2)kT', 'Ēₖ = (1/2)mv²', 'Ēₖ = nRT', 'Ēₖ = pV'],
  },
  {
    question: 'Kolik je Avogadrova konstanta?',
    options: ['6,022·10²³ mol⁻¹', '1,38·10⁻²³ J/K', '8,31 J·mol⁻¹·K⁻¹', '3·10⁸ m/s'],
  },
  {
    question: 'Při izochorickém ději platí:',
    options: ['V = konst., p/T = konst.', 'p = konst., V/T = konst.', 'T = konst., pV = konst.', 'pV/T = konst.'],
  },
  {
    question: 'Jak se změní střední kvadratická rychlost molekul, když zvýšíme teplotu 4×?',
    options: ['Zvýší se 2×', 'Zvýší se 4×', 'Zvýší se 16×', 'Nezmění se'],
  },
  {
    question: 'Která veličina je STEJNÁ pro všechny molekuly ideálního plynu při dané teplotě?',
    options: ['Střední kinetická energie', 'Střední rychlost', 'Hmotnost', 'Hybnost'],
  },
  {
    question: 'Proč Měsíc nemá atmosféru?',
    options: ['Malá gravitace - molekuly unikly', 'Příliš nízká teplota', 'Nikdy atmosféru neměl', 'Sluneční vítr'],
  },
  {
    question: 'Jaká je Carnotova účinnost stroje s ohřívačem 600 K a chladičem 300 K?',
    options: ['50%', '25%', '75%', '100%'],
  },
  {
    question: 'Při izobarickém ději Q = ?',
    options: ['ΔU + W', 'ΔU', 'W', '0'],
  },
  {
    question: 'Kolikrát rychleji se pohybují molekuly H₂ než O₂ při stejné teplotě?',
    options: ['4×', '2×', '8×', '16×'],
  },
  {
    question: 'Stavová rovnice ideálního plynu s látkovým množstvím je:',
    options: ['pV = nRT', 'pV = NkT', 'pV = mRT', 'p = ρRT'],
  },
  {
    question: 'Při izotermickém ději platí pro vnitřní energii:',
    options: ['ΔU = 0', 'ΔU = Q', 'ΔU = W', 'ΔU = Q + W'],
  },
  {
    question: 'Jaká je hodnota molární plynové konstanty R?',
    options: ['8,31 J·mol⁻¹·K⁻¹', '1,38·10⁻²³ J/K', '6,022·10²³ mol⁻¹', '101 325 Pa'],
  }
];

// Funkce pro zamíchání pole (Fisher-Yates shuffle)
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Vytvoření zamíchaných otázek - správná odpověď je vždy na indexu 0 v původním poli
const createShuffledQuestions = () => {
  return quizQuestionsRaw.map(q => {
    const correctAnswer = q.options[0]; // Správná odpověď je vždy první
    const shuffledOptions = shuffleArray(q.options);
    const correctIndex = shuffledOptions.indexOf(correctAnswer);
    return {
      question: q.question,
      options: shuffledOptions,
      correct: correctIndex
    };
  });
};

// Flashcards
const flashcards = [
  { front: 'n = ?', back: 'n = N/Nₐ = m/Mₘ\n(látkové množství)' },
  { front: 'Ēₖ = ?', back: 'Ēₖ = (3/2)kT\n(střední kin. energie molekuly)' },
  { front: 'vₖᵥ = ?', back: 'vₖᵥ = √(3RT/M)\n(střední kvadratická rychlost)' },
  { front: 'pV = ? (s n)', back: 'pV = nRT\n(stavová rovnice)' },
  { front: 'pV = ? (s N)', back: 'pV = NkT\n(stavová rovnice)' },
  { front: 'η (Carnot) = ?', back: 'η = (T₁-T₂)/T₁ = 1 - T₂/T₁' },
  { front: 'I. TDP', back: 'Q = ΔU + W' },
  { front: 'Izotermický děj', back: 'T = konst.\npV = konst.\nΔU = 0, Q = W' },
  { front: 'Izobarický děj', back: 'p = konst.\nV/T = konst.\nQ = ΔU + W' },
  { front: 'Izochorický děj', back: 'V = konst.\np/T = konst.\nW = 0, Q = ΔU' },
  { front: 'k = ?', back: 'k = 1,38·10⁻²³ J/K\n(Boltzmannova konstanta)' },
  { front: 'Nₐ = ?', back: 'Nₐ = 6,022·10²³ mol⁻¹\n(Avogadrova konstanta)' },
  { front: 'R = ?', back: 'R = 8,31 J·mol⁻¹·K⁻¹\n(molární plynová konstanta)' },
  { front: 'Eₖ (celková) = ?', back: 'Eₖ = (3/2)nRT\n(úhrnná kinetická energie)' },
  { front: 'Normální podmínky', back: 'T₀ = 273 K (0°C)\np₀ = 101 325 Pa' },
];

export default function App() {
  const [activeSection, setActiveSection] = useState(sections.FORMULAS);
  const [expandedProblem, setExpandedProblem] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);
  const [particles, setParticles] = useState([]);

  // Animated particles background
  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 20 + 10,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);
  }, []);

  const handleQuizAnswer = (index) => {
    setSelectedAnswer(index);
    if (index === quizQuestions[currentQuestion].correct) {
      setScore(score + 1);
    }
    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 1000);
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizQuestions([]);
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
  };

  const startQuiz = () => {
    setQuizQuestions(createShuffledQuestions());
    setQuizStarted(true);
  };

  const nextFlashcard = () => {
    setFlashcardFlipped(false);
    setTimeout(() => {
      setFlashcardIndex((prev) => (prev + 1) % flashcards.length);
    }, 200);
  };

  const prevFlashcard = () => {
    setFlashcardFlipped(false);
    setTimeout(() => {
      setFlashcardIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    }, 200);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 50%, #0f0f2f 100%)',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      color: '#e0e0ff',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated particles */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {particles.map(p => (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(100, 200, 255, 0.8), rgba(150, 100, 255, 0.4))`,
              boxShadow: '0 0 10px rgba(100, 200, 255, 0.5)',
              animation: `float ${p.speed}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.6; }
          25% { transform: translateY(-30px) translateX(15px); opacity: 1; }
          50% { transform: translateY(-10px) translateX(-10px); opacity: 0.8; }
          75% { transform: translateY(-40px) translateX(5px); opacity: 0.9; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(100, 200, 255, 0.3); }
          50% { box-shadow: 0 0 40px rgba(100, 200, 255, 0.6), 0 0 60px rgba(150, 100, 255, 0.3); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        @keyframes flip {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(180deg); }
        }
      `}</style>

      {/* Header */}
      <header style={{
        background: 'linear-gradient(90deg, rgba(30, 30, 80, 0.9), rgba(50, 30, 100, 0.9))',
        backdropFilter: 'blur(10px)',
        borderBottom: '2px solid rgba(100, 200, 255, 0.3)',
        padding: '20px',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{
            margin: 0,
            fontSize: '2.5rem',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #64c8ff 0%, #a855f7 50%, #ff6b9d 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 30px rgba(100, 200, 255, 0.3)',
            letterSpacing: '2px'
          }}>
            ⚛️ IDEÁLNÍ PLYN
          </h1>
          <p style={{ margin: '8px 0 0', opacity: 0.8, fontSize: '1.1rem' }}>
            Kompletní příprava na test z fyziky
          </p>
        </div>
      </header>

      {/* Navigation */}
      <nav style={{
        background: 'rgba(20, 20, 50, 0.8)',
        backdropFilter: 'blur(10px)',
        padding: '15px 20px',
        position: 'sticky',
        top: 90,
        zIndex: 99,
        borderBottom: '1px solid rgba(100, 200, 255, 0.2)'
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {[
            { id: sections.FORMULAS, label: '📐 Vzorce', icon: '📐' },
            { id: sections.THEORY, label: '📖 Teorie', icon: '📖' },
            { id: sections.PROBLEMS, label: '✏️ Příklady', icon: '✏️' },
            { id: sections.QUIZ, label: '🎯 Kvíz', icon: '🎯' },
            { id: sections.FLASHCARDS, label: '🃏 Kartičky', icon: '🃏' },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              style={{
                padding: '12px 24px',
                border: activeSection === id ? '2px solid #64c8ff' : '2px solid rgba(100, 200, 255, 0.3)',
                borderRadius: '12px',
                background: activeSection === id 
                  ? 'linear-gradient(135deg, rgba(100, 200, 255, 0.3), rgba(150, 100, 255, 0.3))'
                  : 'rgba(30, 30, 60, 0.6)',
                color: '#e0e0ff',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 600,
                transition: 'all 0.3s ease',
                boxShadow: activeSection === id ? '0 0 20px rgba(100, 200, 255, 0.4)' : 'none'
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '30px 20px', position: 'relative', zIndex: 10 }}>
        
        {/* FORMULAS SECTION */}
        {activeSection === sections.FORMULAS && (
          <div style={{ animation: 'slideIn 0.5s ease' }}>
            <h2 style={{ 
              fontSize: '2rem', 
              marginBottom: '30px',
              color: '#64c8ff',
              textShadow: '0 0 20px rgba(100, 200, 255, 0.3)'
            }}>
              📐 Souhrn vzorců
            </h2>
            
            {formulas.map((category, catIdx) => (
              <div key={catIdx} style={{
                marginBottom: '30px',
                background: 'linear-gradient(135deg, rgba(30, 30, 70, 0.8), rgba(40, 30, 80, 0.8))',
                borderRadius: '20px',
                padding: '25px',
                border: '1px solid rgba(100, 200, 255, 0.2)',
                backdropFilter: 'blur(10px)'
              }}>
                <h3 style={{
                  color: '#a855f7',
                  fontSize: '1.4rem',
                  marginBottom: '20px',
                  paddingBottom: '10px',
                  borderBottom: '2px solid rgba(168, 85, 247, 0.3)'
                }}>
                  {category.category}
                </h3>
                <div style={{ display: 'grid', gap: '15px' }}>
                  {category.items.map((item, itemIdx) => (
                    <div key={itemIdx} style={{
                      background: 'rgba(20, 20, 50, 0.6)',
                      borderRadius: '12px',
                      padding: '18px',
                      border: '1px solid rgba(100, 200, 255, 0.15)',
                      transition: 'all 0.3s ease'
                    }}>
                      <div style={{ 
                        fontWeight: 600, 
                        color: '#ff6b9d',
                        marginBottom: '8px',
                        fontSize: '0.95rem'
                      }}>
                        {item.name}
                      </div>
                      <div style={{
                        fontFamily: "'Courier New', monospace",
                        fontSize: '1.4rem',
                        color: '#64c8ff',
                        padding: '12px 16px',
                        background: 'rgba(100, 200, 255, 0.1)',
                        borderRadius: '8px',
                        display: 'inline-block',
                        marginBottom: '10px',
                        border: '1px solid rgba(100, 200, 255, 0.2)'
                      }}>
                        {item.formula}
                      </div>
                      <div style={{ 
                        fontSize: '0.9rem', 
                        color: 'rgba(224, 224, 255, 0.7)',
                        fontStyle: 'italic'
                      }}>
                        {item.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* THEORY SECTION */}
        {activeSection === sections.THEORY && (
          <div style={{ animation: 'slideIn 0.5s ease' }}>
            <h2 style={{ 
              fontSize: '2rem', 
              marginBottom: '30px',
              color: '#64c8ff',
              textShadow: '0 0 20px rgba(100, 200, 255, 0.3)'
            }}>
              📖 Teorie
            </h2>
            
            {theoryContent.map((section, idx) => (
              <div key={idx} style={{
                marginBottom: '25px',
                background: 'linear-gradient(135deg, rgba(30, 30, 70, 0.8), rgba(40, 30, 80, 0.8))',
                borderRadius: '20px',
                padding: '25px',
                border: '1px solid rgba(100, 200, 255, 0.2)',
                backdropFilter: 'blur(10px)'
              }}>
                <h3 style={{
                  color: '#ff6b9d',
                  fontSize: '1.4rem',
                  marginBottom: '15px'
                }}>
                  {section.title}
                </h3>
                <div style={{
                  whiteSpace: 'pre-line',
                  lineHeight: 1.8,
                  color: 'rgba(224, 224, 255, 0.9)',
                  fontSize: '1.05rem'
                }}>
                  {section.content}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PROBLEMS SECTION */}
        {activeSection === sections.PROBLEMS && (
          <div style={{ animation: 'slideIn 0.5s ease' }}>
            <h2 style={{ 
              fontSize: '2rem', 
              marginBottom: '30px',
              color: '#64c8ff',
              textShadow: '0 0 20px rgba(100, 200, 255, 0.3)'
            }}>
              ✏️ Řešené příklady
            </h2>
            
            {problems.map((problem, idx) => (
              <div key={problem.id} style={{
                marginBottom: '20px',
                background: 'linear-gradient(135deg, rgba(30, 30, 70, 0.8), rgba(40, 30, 80, 0.8))',
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1px solid rgba(100, 200, 255, 0.2)',
                backdropFilter: 'blur(10px)'
              }}>
                <button
                  onClick={() => setExpandedProblem(expandedProblem === idx ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '20px 25px',
                    background: 'transparent',
                    border: 'none',
                    color: '#e0e0ff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <span style={{ 
                      color: '#a855f7', 
                      fontWeight: 700, 
                      marginRight: '12px',
                      fontSize: '1.2rem'
                    }}>
                      #{problem.id}
                    </span>
                    <span style={{ fontSize: '1.1rem' }}>{problem.question}</span>
                  </div>
                  <span style={{
                    fontSize: '1.5rem',
                    transform: expandedProblem === idx ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.3s ease',
                    color: '#64c8ff'
                  }}>
                    ▼
                  </span>
                </button>
                
                {expandedProblem === idx && (
                  <div style={{
                    padding: '0 25px 25px',
                    borderTop: '1px solid rgba(100, 200, 255, 0.2)',
                    animation: 'slideIn 0.3s ease'
                  }}>
                    {/* Given */}
                    <div style={{
                      background: 'rgba(168, 85, 247, 0.15)',
                      borderRadius: '12px',
                      padding: '15px',
                      marginTop: '15px',
                      border: '1px solid rgba(168, 85, 247, 0.3)'
                    }}>
                      <div style={{ fontWeight: 600, color: '#a855f7', marginBottom: '10px' }}>
                        📋 Zadáno:
                      </div>
                      {problem.given.map((g, i) => (
                        <div key={i} style={{ 
                          fontFamily: "'Courier New', monospace",
                          marginLeft: '15px',
                          marginBottom: '5px'
                        }}>
                          • {g}
                        </div>
                      ))}
                    </div>

                    {/* Solution */}
                    <div style={{
                      background: 'rgba(100, 200, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '15px',
                      marginTop: '15px',
                      border: '1px solid rgba(100, 200, 255, 0.3)'
                    }}>
                      <div style={{ fontWeight: 600, color: '#64c8ff', marginBottom: '10px' }}>
                        🔢 Řešení:
                      </div>
                      {problem.solution.map((step, i) => (
                        <div key={i} style={{ 
                          fontFamily: step ? "'Courier New', monospace" : 'inherit',
                          marginLeft: '15px',
                          marginBottom: '8px',
                          fontSize: step ? '1.05rem' : 'inherit'
                        }}>
                          {step || <br />}
                        </div>
                      ))}
                    </div>

                    {/* Answer */}
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(16, 185, 129, 0.2))',
                      borderRadius: '12px',
                      padding: '15px',
                      marginTop: '15px',
                      border: '2px solid rgba(34, 197, 94, 0.5)'
                    }}>
                      <div style={{ fontWeight: 700, color: '#22c55e', fontSize: '1.2rem' }}>
                        ✓ Výsledek: {problem.answer}
                      </div>
                    </div>

                    {/* Tip */}
                    <div style={{
                      background: 'rgba(255, 107, 157, 0.15)',
                      borderRadius: '12px',
                      padding: '15px',
                      marginTop: '15px',
                      border: '1px solid rgba(255, 107, 157, 0.3)'
                    }}>
                      <div style={{ color: '#ff6b9d' }}>
                        💡 <strong>TIP:</strong> {problem.tip}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* QUIZ SECTION */}
        {activeSection === sections.QUIZ && (
          <div style={{ animation: 'slideIn 0.5s ease' }}>
            <h2 style={{ 
              fontSize: '2rem', 
              marginBottom: '30px',
              color: '#64c8ff',
              textShadow: '0 0 20px rgba(100, 200, 255, 0.3)'
            }}>
              🎯 Kvíz
            </h2>

            {!quizStarted ? (
              <div style={{
                textAlign: 'center',
                background: 'linear-gradient(135deg, rgba(30, 30, 70, 0.8), rgba(40, 30, 80, 0.8))',
                borderRadius: '20px',
                padding: '50px',
                border: '1px solid rgba(100, 200, 255, 0.2)'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎯</div>
                <h3 style={{ color: '#ff6b9d', marginBottom: '15px', fontSize: '1.5rem' }}>
                  Připraven otestovat své znalosti?
                </h3>
                <p style={{ marginBottom: '30px', opacity: 0.8 }}>
                  Kvíz obsahuje {quizQuestionsRaw.length} otázek z celé látky.
                </p>
                <button
                  onClick={() => startQuiz()}
                  style={{
                    padding: '15px 50px',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #64c8ff, #a855f7)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: 'pointer',
                    boxShadow: '0 0 30px rgba(100, 200, 255, 0.4)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Spustit kvíz 🚀
                </button>
              </div>
            ) : showResult ? (
              <div style={{
                textAlign: 'center',
                background: 'linear-gradient(135deg, rgba(30, 30, 70, 0.8), rgba(40, 30, 80, 0.8))',
                borderRadius: '20px',
                padding: '50px',
                border: '1px solid rgba(100, 200, 255, 0.2)'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>
                  {score >= quizQuestions.length * 0.8 ? '🏆' : score >= quizQuestions.length * 0.5 ? '👍' : '📚'}
                </div>
                <h3 style={{ color: '#ff6b9d', marginBottom: '15px', fontSize: '1.8rem' }}>
                  Výsledek: {score} / {quizQuestions.length}
                </h3>
                <p style={{ marginBottom: '10px', fontSize: '1.2rem' }}>
                  {Math.round((score / quizQuestions.length) * 100)}% správně
                </p>
                <p style={{ marginBottom: '30px', opacity: 0.8 }}>
                  {score >= quizQuestions.length * 0.8 
                    ? 'Výborně! Látku ovládáš skvěle! 🎉' 
                    : score >= quizQuestions.length * 0.5 
                    ? 'Dobrá práce! Ještě trochu procvič teorii.' 
                    : 'Nevadí! Projdi si znovu teorii a vzorce.'}
                </p>
                <button
                  onClick={resetQuiz}
                  style={{
                    padding: '15px 50px',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #a855f7, #ff6b9d)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Zkusit znovu
                </button>
              </div>
            ) : (
              <div style={{
                background: 'linear-gradient(135deg, rgba(30, 30, 70, 0.8), rgba(40, 30, 80, 0.8))',
                borderRadius: '20px',
                padding: '40px',
                border: '1px solid rgba(100, 200, 255, 0.2)'
              }}>
                {/* Progress */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '30px',
                  alignItems: 'center'
                }}>
                  <span style={{ color: '#a855f7', fontWeight: 600 }}>
                    Otázka {currentQuestion + 1} / {quizQuestions.length}
                  </span>
                  <span style={{ color: '#22c55e' }}>
                    Skóre: {score}
                  </span>
                </div>

                {/* Progress bar */}
                <div style={{
                  height: '8px',
                  background: 'rgba(100, 200, 255, 0.2)',
                  borderRadius: '4px',
                  marginBottom: '30px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%`,
                    background: 'linear-gradient(90deg, #64c8ff, #a855f7)',
                    borderRadius: '4px',
                    transition: 'width 0.3s ease'
                  }} />
                </div>

                {/* Question */}
                <h3 style={{ 
                  fontSize: '1.4rem', 
                  marginBottom: '30px',
                  color: '#e0e0ff'
                }}>
                  {quizQuestions[currentQuestion].question}
                </h3>

                {/* Options */}
                <div style={{ display: 'grid', gap: '15px' }}>
                  {quizQuestions[currentQuestion].options.map((option, idx) => {
                    const isCorrect = idx === quizQuestions[currentQuestion].correct;
                    const isSelected = selectedAnswer === idx;
                    let bg = 'rgba(100, 200, 255, 0.1)';
                    let border = '2px solid rgba(100, 200, 255, 0.3)';
                    
                    if (selectedAnswer !== null) {
                      if (isCorrect) {
                        bg = 'rgba(34, 197, 94, 0.3)';
                        border = '2px solid #22c55e';
                      } else if (isSelected && !isCorrect) {
                        bg = 'rgba(239, 68, 68, 0.3)';
                        border = '2px solid #ef4444';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => selectedAnswer === null && handleQuizAnswer(idx)}
                        disabled={selectedAnswer !== null}
                        style={{
                          padding: '18px 25px',
                          background: bg,
                          border: border,
                          borderRadius: '12px',
                          color: '#e0e0ff',
                          cursor: selectedAnswer === null ? 'pointer' : 'default',
                          textAlign: 'left',
                          fontSize: '1.1rem',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <span style={{ 
                          marginRight: '12px',
                          color: '#a855f7',
                          fontWeight: 700
                        }}>
                          {String.fromCharCode(65 + idx)})
                        </span>
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* FLASHCARDS SECTION */}
        {activeSection === sections.FLASHCARDS && (
          <div style={{ animation: 'slideIn 0.5s ease' }}>
            <h2 style={{ 
              fontSize: '2rem', 
              marginBottom: '30px',
              color: '#64c8ff',
              textShadow: '0 0 20px rgba(100, 200, 255, 0.3)'
            }}>
              🃏 Flashcards
            </h2>

            <div style={{ textAlign: 'center' }}>
              <p style={{ marginBottom: '20px', opacity: 0.8 }}>
                Kartička {flashcardIndex + 1} z {flashcards.length} • Klikni pro otočení
              </p>

              {/* Flashcard */}
              <div
                onClick={() => setFlashcardFlipped(!flashcardFlipped)}
                style={{
                  width: '100%',
                  maxWidth: '500px',
                  height: '300px',
                  margin: '0 auto 30px',
                  perspective: '1000px',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.6s ease',
                  transform: flashcardFlipped ? 'rotateY(180deg)' : 'rotateY(0)'
                }}>
                  {/* Front */}
                  <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    background: 'linear-gradient(135deg, rgba(100, 200, 255, 0.2), rgba(168, 85, 247, 0.2))',
                    borderRadius: '20px',
                    border: '2px solid rgba(100, 200, 255, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '30px',
                    boxShadow: '0 0 40px rgba(100, 200, 255, 0.2)'
                  }}>
                    <div style={{
                      fontSize: '2rem',
                      fontFamily: "'Courier New', monospace",
                      color: '#64c8ff',
                      textAlign: 'center'
                    }}>
                      {flashcards[flashcardIndex].front}
                    </div>
                  </div>

                  {/* Back */}
                  <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(255, 107, 157, 0.2))',
                    borderRadius: '20px',
                    border: '2px solid rgba(168, 85, 247, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '30px',
                    transform: 'rotateY(180deg)',
                    boxShadow: '0 0 40px rgba(168, 85, 247, 0.2)'
                  }}>
                    <div style={{
                      fontSize: '1.5rem',
                      fontFamily: "'Courier New', monospace",
                      color: '#ff6b9d',
                      textAlign: 'center',
                      whiteSpace: 'pre-line'
                    }}>
                      {flashcards[flashcardIndex].back}
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                <button
                  onClick={prevFlashcard}
                  style={{
                    padding: '12px 30px',
                    background: 'rgba(100, 200, 255, 0.2)',
                    border: '2px solid rgba(100, 200, 255, 0.4)',
                    borderRadius: '10px',
                    color: '#64c8ff',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    transition: 'all 0.3s ease'
                  }}
                >
                  ← Předchozí
                </button>
                <button
                  onClick={nextFlashcard}
                  style={{
                    padding: '12px 30px',
                    background: 'linear-gradient(135deg, #64c8ff, #a855f7)',
                    border: 'none',
                    borderRadius: '10px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    transition: 'all 0.3s ease'
                  }}
                >
                  Další →
                </button>
              </div>

              {/* Progress dots */}
              <div style={{ marginTop: '30px', display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {flashcards.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setFlashcardIndex(idx); setFlashcardFlipped(false); }}
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      border: 'none',
                      background: idx === flashcardIndex 
                        ? 'linear-gradient(135deg, #64c8ff, #a855f7)' 
                        : 'rgba(100, 200, 255, 0.3)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '30px',
        borderTop: '1px solid rgba(100, 200, 255, 0.2)',
        marginTop: '50px',
        color: 'rgba(224, 224, 255, 0.6)'
      }}>
        <p>Připraveno na test z fyziky • Ideální plyn ⚛️</p>
        <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>
          Hodně štěstí! 🍀
        </p>
      </footer>
    </div>
  );
}
