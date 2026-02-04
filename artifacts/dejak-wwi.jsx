import React, { useState, useEffect } from 'react';

const studyData = {
  hlavniOtazky: [
    {
      id: 1,
      title: "Příčiny kolonialismu v 19. st. + TEXT Analýza kolonialismu + OTAZ",
      summary: `🔑 EKONOMICKÉ: suroviny, trhy, levná práce, investice kapitálu (Cecil Rhodes: "impérium = otázka žaludku")
🔑 POLITICKÉ: nacionalismus, prestiž, soupeření velmocí, Bismarckův oportunismus
🔑 IDEOLOGICKÉ: sociální darwinismus, "břemeno bílého muže" (Kipling), civilizační mise, křesťanství
🔑 PŘEKÁŽKY: Afrika (klima, nemoci, řeky), Asie (izolacionismus Číny/Japonska)
🔑 CAMERON: ekonomické důvody selhaly - kolonie chudé, obchod mezi průmyslovými zeměmi, emigranti šli do USA`,
      content: `
DEFINICE KOLONIALISMU:
Kolonialismus představuje rozšiřování svrchovanosti určitého národa na teritorium a lid mimo vlastních hranic, často za účelem zlepšení vlastní ekonomiky prostřednictvím využívání domorodých přírodních zdrojů, pracovní síly a místního trhu.

TYPY KOLONIALISMU:
1. Osídlovací kolonialismus (od 16. st.) - přesun velkých skupin obyvatel z mateřské země (Jižní Amerika, Severní Amerika, Austrálie)
2. Exploatační (vykořisťující) kolonialismus (od 19. st.) - vojenská a politická kontrola, zachování místních institucí (Indie, Indonésie, Afrika)
3. Hybridní kolonialismus - kombinace obou (francouzské Alžírsko)

EKONOMICKÉ PŘÍČINY:
• Suroviny - kolonie měly poskytovat suroviny pro evropský průmysl (kaučuk, bavlna, minerály, diamanty, měď)
• Nové trhy - průmyslová revoluce vedla k nadvýrobě, kapitalisté hledali odbytiště
• Levná pracovní síla - využívání domorodců jako de facto otroků
• Investice přebytečného kapitálu - podle Leninovy teorie "Imperialismus jako nejvyšší stadium kapitalismu"

CITÁT - Cecil Rhodes (1895):
"Chceme-li my, koloniální politikové, zachránit 40 milionů obyvatel Spojeného království před vražednou občanskou válkou, musíme zabírat nová území, která by pojala nadbytek obyvatelstva a vytvořila nová odbytiště pro zboží vyráběné v našich továrnách."

CITÁT - Joseph Chamberlain:
"Nyní již nikdo nepochybuje o ohromných výhodách impéria. Věřte mi, že ztratíme-li nad ním vládu, nebude Anglie s to nasytit své početné obyvatelstvo."

POLITICKÉ PŘÍČINY:
• Nacionalismus - kolonie posilovaly národní prestiž a hrdost
• Mocenská politika - kontrola strategických území (Suezský průplav, námořní základny)
• Politický oportunismus - Bismarck využíval koloniální otázky k odvádění pozornosti od domácích problémů
• Soupeření velmocí - státy získávaly kolonie, aby je nezískal někdo jiný

IDEOLOGICKÉ PŘÍČINY:
• Sociální darwinismus - teorie "přežití nejschopnějších" aplikovaná na národy a rasy (Herbert Spencer)
• Rasismus a etnocentrismus - víra v nadřazenost bílé rasy
• "Civilizační mise" - přesvědčení o povinnosti "civilizovat" "zaostalé" národy
• "Břemeno bílého muže" - báseň Rudyarda Kiplinga (1899) - poetické ospravedlnění kolonialismu
• Křesťanská misie - šíření křesťanství mezi "pohany" (misionáři jako David Livingstone)

PROČ NE DŘÍVE - PŘEKÁŽKY KOLONIZACE:
Afrika:
- Tropické klima nevhodné pro Evropany
- Neznámé smrtelné nemoci (malárie, spavá nemoc)
- Málo splavných řek - obtížný přístup do vnitrozemí
- Absence organizovaných států evropského typu

Asie:
- Čína, Japonsko, Korea považovaly západní civilizaci za podřadnou
- Odmítaly diplomatické zástupce, pronásledovaly misionáře
- Obchod povolován jen minimálně

DŮLEŽITÍ CESTOVATELÉ:
• David Livingstone (1813-1873) - skotský misionář, první běloch přešel Kalahari a Afriku napříč, objevil Viktoriiny vodopády
• Henry Morton Stanley (1841-1904) - novinář, našel Livingstona ("Dr. Livingstone, I presume?"), pomohl Leopoldovi II. získat Kongo
• Emil Holub (1847-1902) - český lékař a cestovatel, první detailní mapa Viktoriiných vodopádů

PŘÍKLAD SPRÁVNÉ ODPOVĚDI:
"Kolonialismus v 19. století měl několik vzájemně propojených příčin. Ekonomické motivy zahrnovaly hledání surovin (kaučuk v Kongu, diamanty v Jižní Africe), nových trhů pro průmyslovou nadvýrobu a levné pracovní síly. Jak řekl Cecil Rhodes: 'Impérium jest otázka žaludku.' Politické příčiny spočívaly v nacionalismu a soupeření velmocí - kolonie zvyšovaly prestiž státu. Ideologicky byl kolonialismus ospravedlňován sociálním darwinismem a 'civilizační misí' - vírou, že bílá rasa má povinnost 'civilizovat' ostatní národy, jak vyjádřil Kipling v básni 'Břemeno bílého muže'. Dřívější kolonizaci bránilo tropické klima, nemoci a izolacionismus asijských říší."

---

TEXT: ANALÝZA KOLONIALISMU (Cameron) + OTÁZKY:

O TEXTU:
Rondo Cameron: "Stručné ekonomické dějiny světa" - ekonomický pohled na imperialismus, kritická analýza údajných ekonomických přínosů kolonií.

OTÁZKA 1: Proč Asie a Afrika zůstávaly stranou?

ASIE:
• Čína, Japonsko, Korea se snažily zůstat v izolaci
• Považovaly západní civilizaci za podřadnou
• Odmítaly diplomatické zástupce Západu
• Vypovídaly nebo pronásledovaly křesťanské misionáře
• Obchod se Západem povolován jen minimálně

AFRIKA:
• Tropické klima nevhodné pro Evropany
• Neznámé a často smrtelné nemoci (malárie, žlutá zimnice, spavá nemoc)
• Málo splavných řek - obtížný přístup do vnitrozemí
• Absence organizovaných států evropského typu
• Nízká úroveň ekonomického rozvoje - "málo zajímavá pro obchodníky"

PŘÍKLAD ODPOVĚDI: "Cameron vysvětluje, proč Asie a Afrika dlouho zůstávaly mimo dosah evropské expanze. V Asii se velké říše (Čína, Japonsko, Korea) snažily zůstat v izolaci a považovaly západní civilizaci za podřadnou - odmítaly diplomatické zástupce a pronásledovaly misionáře. Afrika představovala jiný typ překážek: tropické klima Evropanům nesvědčilo, ohrožovaly je neznámé smrtelné nemoci, málo splavných řek ztěžovalo přístup do vnitrozemí a absence organizovaných států evropského typu činila kontinent 'málo zajímavým pro obchodníky'."

OTÁZKA 2: Neevropské koloniální mocnosti:

• Japonsko - po převzetí západní technologie provádělo stejnou imperialistickou politiku (Korea, Mandžusko, Čína)
• USA - kolonialistická politika před koncem 19. století (Filipíny 1898, Portoriko, Havaj)
• Britská dominia - někdy agresivnější než metropole:
  - Jižní Afrika expandovala na vlastní iniciativu, proti vůli Londýna
  - Austrálie (Queensland) prosadila anexi části Nové Guiney 1884

PŘÍKLAD ODPOVĚDI: "Cameron upozorňuje, že imperialismus nebyl výlučně evropský jev. Japonsko po modernizaci provádělo stejnou expanzivní politiku jako Evropané - v Koreji, Mandžusku a Číně. USA se vydaly cestou kolonialismu před koncem 19. století (Filipíny, Portoriko, Havaj), navzdory vnitřní kritice. Zajímavé je, že některá britská dominia byla agresivnější než metropole - expanze Jižní Afriky probíhala na místní iniciativu, někdy proti výslovným pokynům Londýna."

OTÁZKA 3: Ekonomické i neekonomické důvody:

EKONOMICKÉ DŮVODY (dle zastánců):
• Nové trhy pro průmyslovou nadvýrobu
• Investice přebytečného kapitálu (marxistická/leninská teorie)
• Zdroje surovin
• "Výpustní ventil" pro přebytek obyvatelstva

NEEKONOMICKÉ DŮVODY:
• Politický oportunismus (Disraeli, Bismarck)
• Agresivní nacionalismus - národní prestiž
• Mocenská politika a vojenská účelnost (Británie - ochrana Indie)
• Sociální darwinismus ("přežití nejschopnějších")
• Rasismus a "civilizační mise"
• Křesťanské misionářství

CITÁTY z textu:
• A. T. Mahan: "Obchod následuje za vlajkou"
• Jules Ferry obhajoval kolonie prestíží a vojenskou nezbytností, NE ekonomikou
• Theodore Roosevelt: "Zjevný osud" (Manifest Destiny)
• Kipling: "Nižší rasy bez zákona"

PŘÍKLAD ODPOVĚDI: "Cameron rozlišuje ekonomické a neekonomické důvody kolonialismu. Ekonomické zahrnovaly hledání nových trhů, investice přebytečného kapitálu (Leninova teorie), získávání surovin a 'výpustní ventil' pro přebytek obyvatelstva. Neekonomické důvody byly často důležitější: politický oportunismus (Bismarck využíval kolonie k odvádění pozornosti), nacionalismus a prestiž, mocenská politika (Británie chránila cesty do Indie), sociální darwinismus a rasismus. Jules Ferry při obhajobě kolonií v parlamentu nepoužíval ekonomické argumenty, ale zdůrazňoval prestiž Francie."

OTÁZKA 4: Jak moc se důvody (ne)naplnily?

SELHÁNÍ EKONOMICKÝCH ARGUMENTŮ:

Trhy:
• Kolonie byly příliš chudé a řídce osídlené
• Méně než 10% francouzského exportu šlo do francouzských kolonií
• Největší obchod probíhal mezi průmyslovými zeměmi navzájem
• Německo prodávalo do (britské) Indie více než do všech svých kolonií
• Francie prodávala do Indie více než do Alžírska

Obyvatelstvo:
• Emigranti preferovali USA, Argentinu, samosprávná dominia
• Kolonie měly nepříznivé klima

Suroviny:
• Hlavní dodavatelé = nezávislé země (Amerika, Austrálie)
• K získání surovin není třeba politické kontroly

Investice:
• Více než polovina britských zahraničních investic šla do nezávislých zemí
• Ani 10% francouzských investic nešlo do francouzských kolonií
• Rusko (samo imperialistické) dostalo 1/4 francouzských investic
• Německé investice v německých koloniích byly zanedbatelné
• Některé imperialistické země byly dlužníci (Rusko, Itálie, Španělsko, USA)

PŘÍKLAD ODPOVĚDI: "Cameron systematicky vyvrací ekonomické argumenty pro kolonialismus. Kolonie jako trhy selhaly - byly příliš chudé a řídce osídlené. Méně než 10% francouzského exportu směřovalo do kolonií, Německo prodávalo do britské Indie více než do všech svých kolonií. Argument o 'výpustním ventilu' pro obyvatelstvo neobstál - emigranti preferovali USA s příznivějším klimatem. Suroviny dodávaly hlavně nezávislé země. A investice? Více než polovina britských zahraničních investic šla do nezávislých zemí, francouzský kapitál proudil do Ruska, ne do kolonií. Některé imperialistické země (Rusko, Itálie) byly samy dlužníky."

OTÁZKA 5: Nacionalismus a sociální darwinismus:

NACIONALISMUS:
• Disraeli - využil imperialismus k útokům na liberála Gladstona (politický oportunismus)
• Bismarck - podporoval francouzský imperialismus, aby odvrátil myšlenky na pomstu; sám imperialismus odmítal, pak přijal kvůli posílení pozice
• Kolonie = otázka národní prestiže, nikoliv ekonomiky

SOCIÁLNÍ DARWINISMUS:
• Herbert Spencer - hlavní popularizátor, sám antiimperialista
• Jiní teoretici použili "přežití nejschopnějších" k obhajobě boje za impérium
• Theodore Roosevelt - "zjevný osud" (Manifest Destiny) - USA předurčeny ovládnout kontinent
• Kipling - "nižší rasy bez zákona" - typický postoj k nebílým rasám
• Rasismus má hlubší kořeny než darwinovská biologie

CAMERONŮV ZÁVĚR:
"Na moderní imperialismus se musí pohlížet nejen jako na politický a ekonomický jev, ale i jako na psychologický a kulturní fenomén."

PŘÍKLAD ODPOVĚDI: "Cameron zdůrazňuje roli nacionalismu a sociálního darwinismu. Nacionalismus činil z kolonií otázku prestiže - Disraeli využil imperialismus k útokům na Gladstona, Bismarck podporoval francouzský imperialismus, aby odvrátil myšlenky na pomstu za 1870. Sociální darwinismus aplikoval Spencerovu teorii 'přežití nejschopnějších' na národy a rasy - Roosevelt mluvil o 'zjevném osudu' USA, Kipling o 'nižších rasách bez zákona'. Cameron uzavírá, že imperialismus nebyl jen ekonomický a politický, ale i 'psychologický a kulturní fenomén' - odrážel hluboce zakořeněný rasismus a etnocentrismus."
      `
    },
    {
      id: 2,
      title: "Jednotlivé etapy dekolonizace a důvody",
      summary: `🔑 1. FÁZE (1945-50): Asie - Indie 1947, Indonésie 1949 (připravené, vzdělaná elita)
🔑 2. FÁZE (1956-65): Afrika - Ghana 1957 (Nkrumah), 1960 = "Rok Afriky" (18 zemí), nepřipravené státy
🔑 3. FÁZE (po 1965): Portugalsko (Angola, Mosambik 1975), Alžírsko 1962, JAR 1994
🔑 DŮVODY: oslabení metropolí po WW2, OSN, studená válka, neochota platit za kolonie, nacionalismus
🔑 NKRUMAH: panafrikanismus, socialismus → diktatura → puč 1966`,
      content: `
1. FÁZE (1945-1950) - ASIE A BLÍZKÝ VÝCHOD:
• Oblast: Jižní Asie, Dálný východ, arabský svět
• Příklady: Indie a Pákistán (1947), Izrael (1948), Indonésie (1949), Barma (1948)
• Charakteristika: Relativně připravené země s vzdělanou elitou a nacionalistickými hnutími
• Indie - nejdůležitější britská kolonie, Gándhího nenásilný odpor

2. FÁZE (1956-1965) - AFRIKA:
• Začátek: 1956 - Maroko, Tunisko (od Francie), Súdán (od Británie)
• Průkopník: Ghana (1957) - prezident Kwame Nkrumah, idea panafrické jednoty
• Vrchol: 1960 = "ROK AFRIKY" - 18 zemí získalo nezávislost
• Problém: Většina států nebyla na samostatnost připravena - chyběla vzdělaná elita, administrativa

KWAME NKRUMAH (Ghana):
- Využíval charismatickou autoritu k prosazování panafrické jednoty
- Propagoval socialistický kolektivismus jako cestu k blahobytu
- Panafrické kongresy: 1958 Akkra, 1963 Addis Abeba
- Ghana měla mezi novými státy relativně vyšší prosperitu
- Výsledek: Zavedl diktaturu, prudký pokles životní úrovně
- Únor 1966: Svržen vojenským pučem
- Zemřel v exilu 1972 - neuskutečnitelný sen o "velké Africe"

3. FÁZE (po 1965) - ZÁVĚREČNÁ:
• Portugalské kolonie: Angola, Mosambik (1975) - po pádu portugalské diktatury
• Alžírsko: 1962 - po krvavé válce za nezávislost (Evianské dohody)
• Zimbabwe: 1980
• Namibie: 1990 - poslední africká kolonie
• JAR: 1994 - konec apartheidu, první všerasové volby

DŮVODY DEKOLONIZACE:

Vnitřní faktory:
• Humanistické ideály - přirozené právo na sebeurčení národů
• Neochota občanů metropolí platit za koloniální války a tolerovat represe
• Ekonomická neudržitelnost - kolonie stály víc, než přinášely
• Morální únava - veřejnost odmítala zodpovědnost za násilí
• Snaha transformovat vztahy na hospodářskou a kulturní spolupráci

Vnější faktory:
• Druhá světová válka - oslabení koloniálních mocností
• Studená válka - USA i SSSR podporovaly dekolonizaci (z různých důvodů)
• OSN - podpora práva na sebeurčení
• Vzestup nacionalismu v koloniích - vzdělaná elita požadovala nezávislost

DEKOLONIZACE AMERIKY (pro srovnání):
• Latinská Amerika: 1810-1830 (Bolívar, San Martín)
• Důvody: Napoleonské války oslabily Španělsko a Portugalsko, inspirace americkou a francouzskou revolucí, kreolská elita chtěla moc

CO ZBYLO Z KOLONIÍ:
• Integrální součásti mateřské země: Madeira, Azory (Portugalsko), Kanárské ostrovy (Španělsko)
• Příliš malá nebo chudá území: Falklandy
• USA: 1959 - Aljaška (49. stát) a Havaj (50. stát), Portoriko = závislé území se samosprávou
• SSSR jako koloniální vládce: Střední Asie zůstala pod sovětskou kontrolou až do 1991 (pak SNS)

COMMONWEALTH (Společenství národů):
• Původně Britské společenství národů
• Transformace na volné sdružení 50 nezávislých států
• Do 1947 byl britský panovník hlavou členských států - pak jen tradice
• Spojení: hospodářské, finanční, politické a kulturní vazby

PŘÍKLAD SPRÁVNÉ ODPOVĚDI:
"Dekolonizace probíhala ve třech hlavních fázích. První fáze (1945-1950) se odehrála v Asii - nezávislost získala Indie a Pákistán (1947), Indonésie (1949). Tyto země měly vzdělanou elitu a silná nacionalistická hnutí. Druhá fáze (1956-1965) zasáhla Afriku - průkopníkem byla Ghana (1957) pod vedením Kwame Nkrumahy, který prosazoval panafrickou jednotu a socialistický kolektivismus, ale nakonec zavedl diktaturu a byl 1966 svržen. Rok 1960 je označován jako 'Rok Afriky' (18 nových států). Třetí fáze (po 1965) zahrnovala portugalské kolonie (Angola, Mosambik 1975 po demokratické revoluci v Portugalsku) a JAR (apartheid skončil 1994). Důvody dekolonizace zahrnovaly oslabení metropolí po 2. světové válce, tlak OSN, studenou válku a neochotu občanů metropolí platit za koloniální války. Z impérií zůstaly jen integrální části mateřských zemí (Madeira, Kanáry) nebo příliš malá území (Falklandy). Británie přetvořila impérium na Commonwealth - volné sdružení 50 států."
      `
    },
    {
      id: 3,
      title: "TEXT: Dekolonizace (učebnice) + OTÁZKY",
      summary: `🔑 DŮVODY: humanismus, nechuť k násilí, neochota platit, morální únava
🔑 PORTUGALSKO: jediné odmítlo odejít → partyzánská válka → revoluce 1974 → nezávislost 1975
🔑 ALŽÍRSKO: puč 1958, de Gaulle, Evianské dohody 1962 (91% pro)
🔑 JAR: apartheid, de Klerk + Mandela, volby 1994
🔑 NEZÚČASTNĚNÍ: Bandung 1955, Bělehrad 1961 (Násir, Tito, Nehrú) → úpadek po Afghánistánu 1979`,
      content: `
OTÁZKA 1: Důvody dekolonizačních procesů zmíněné v textu:

Zmíněné v textu:
• Humanistická představa o právu na svobodný státní život
• Nechuť občanů metropolí k násilnému udržování kolonií
• Neochota financovat koloniální vojska
• Odmítání morální spoluzodpovědnosti za represe
• Snaha transformovat vztahy na hospodářskou a kulturní spolupráci

Nezmíněné (můžeš doplnit):
• Druhá světová válka a oslabení metropolí
• Studená válka a soupeření velmocí
• Tlak OSN na sebeurčení národů
• Ekonomická neudržitelnost kolonií

PŘÍKLAD ODPOVĚDI: "Text uvádí několik důvodů dekolonizace: humanistickou představu o právu kolonizovaných národů na svobodný státní život, nechuť občanů metropolí tolerovat násilné udržování kolonií, neochotu financovat koloniální vojska a odmítání morální spoluzodpovědnosti za represivní akce. Text však neuvádí některé další důležité faktory jako oslabení koloniálních mocností po druhé světové válce nebo vliv studené války."

OTÁZKA 2: Specifikace dvou fází:

• 1. fáze (1945-1950): Jižní Asie (Indie, Pákistán), Dálný východ (Indonésie), arabský svět
• 2. fáze (od 1956): Afrika - začíná Marokem, Tuniskem, Súdánem, vrchol 1960 "Rok Afriky"

PŘÍKLAD ODPOVĚDI: "První fáze dekolonizace proběhla v letech 1945-1950 a týkala se především jižní Asie a Dálného východu - nezávislost získaly Indie, Pákistán (1947), Indonésie (1949). Druhá fáze začala rokem 1956 a zasáhla 'probuzenou' Afriku - Francie poskytla nezávislost Maroku a Tunisku, Británie Súdánu. Průkopníkem byla Ghana (1957), rok 1960 je označován jako 'Rok Afriky', kdy nezávislost získalo 18 zemí."

OTÁZKA 3: Dekolonizace Ameriky:

• Severní Amerika: USA 1776, Kanada postupně (dominion od 1867)
• Latinská Amerika: 1810-1830 - Simón Bolívar, José de San Martín
• Příčiny: Napoleonské války oslabily Španělsko a Portugalsko, osvícenské ideály, americká revoluce jako vzor, kreolská elita chtěla politickou moc

PŘÍKLAD ODPOVĚDI: "Dekolonizace Ameriky proběhla mnohem dříve než v Africe a Asii. USA získaly nezávislost roku 1776, Latinská Amerika se osvobodila v letech 1810-1830 díky vůdcům jako Simón Bolívar a José de San Martín. Hlavními příčinami bylo oslabení Španělska a Portugalska během napoleonských válek, vliv osvícenských ideálů a americké revoluce, a touha kreolské elity (potomků evropských osadníků) po politické moci."

OTÁZKA 4: Specifika portugalských kolonií:

• Portugalsko jako jediné odmítlo odejít z Afriky
• Od poloviny 60. let partyzánská válka v Angole a Mosambiku
• Koloniální války vedly k pádu portugalské diktatury (1974 - Karafiátová revoluce)
• Nezávislost: 1975

PŘÍKLAD ODPOVĚDI: "Portugalsko zaujímalo mezi koloniálními mocnostmi výjimečné postavení - jako jediné odmítlo z Afriky odejít. Od poloviny 60. let muselo ve svých koloniích (Angola, Mosambik) čelit partyzánské válce osvobozeneckých hnutí. Neschopnost portugalského diktátorského režimu tyto války vyhrát nakonec způsobila jeho vlastní pád - roku 1974 proběhla demokratická revoluce a roku 1975 Portugalsko poskytlo nezávislost Angole i Mosambiku."

OTÁZKA 5: Alžírsko a francouzská politika:

• Alžírsko považováno za integrální součást Francie (ne kolonii)
• Žili tam francouzští osadníci (pieds-noirs) - odmítali nezávislost
• 1958: Puč kolonistů, obsazení Korsiky, hrozba útoku na Paříž
• Charles de Gaulle povolán k moci, aby krizi vyřešil
• 1962: Evianské dohody - nezávislost Alžírska
• 91% Francouzů v referendu souhlasilo = vítězství demokracie

PŘÍKLAD ODPOVĚDI: "Alžírsko představovalo pro Francii mimořádně složitý problém, protože bylo považováno za součást Francie, ne za kolonii. Žilo tam mnoho francouzských osadníků (pieds-noirs), kteří odmítali nezávislost. V květnu 1958 provedli kolonialisté a ultrapravicové organizace protivládní puč, obsadili Korsiku a připravovali útok na Paříž. Teprve povolání generála de Gaulla do čela vlády umožnilo řešení - roku 1962 byly podepsány Evianské dohody, které Alžírsku poskytly nezávislost. V referendu je schválilo 91% Francouzů."

OTÁZKA 6: Specifika JAR:

• Do 1961 britské dominion, poté nezávislý stát
• Vláda bílé menšiny, politika apartheidu (diskriminace barevného obyvatelstva)
• Od 90. let reformy: prezident Frederik de Klerk + Nelson Mandela (ANC)
• 1994: První všerasové svobodné volby, prezidentem Mandela
• Problémy: Odpor stoupenců apartheidu + kmenové konflikty (Zulu)

PŘÍKLAD ODPOVĚDI: "Jihoafrická republika měla na africkém kontinentu zvláštní pozici. Do roku 1961 byla britským dominiem, poté vystoupila z Commonwealthu a stala se nezávislým státem, kde vládla bílá menšina a uplatňovala politiku apartheidu - diskriminace barevného obyvatelstva. Změna nastala až v 90. letech díky liberálnímu prezidentu de Klerkovi a černošskému vůdci Nelsonu Mandelovi. V květnu 1994 proběhly první všerasové svobodné volby a Mandela se stal prezidentem. Proces byl komplikován odporem stoupenců apartheidu i kmenovými konflikty."

OTÁZKA 7: Území, která zůstala u metropolí:

• Integrální součásti mateřské země: Madeira, Azory (Portugalsko), Kanárské ostrovy (Španělsko)
• Příliš malá nebo chudá území: Falklandy, malé državy v Maroku
• Commonwealth - volné sdružení 50 nezávislých států s Británií (tradice, ne právní závazky)

PŘÍKLAD ODPOVĚDI: "Ze starých koloniálních impérií zůstala především ta území, která se stala pevnou součástí mateřské země (jako portugalská Madeira a Azory, španělské Kanárské ostrovy), a dále území příliš malá nebo chudá na samostatnou existenci (britské Falklandy). Velká Británie přetvořila své impérium na Commonwealth - volné sdružení 50 nezávislých států spojených tradičními hospodářskými, politickými a kulturními vazbami."

OTÁZKA 8: Hnutí nezúčastněných:

VZNIK:
• 1955: Konference v Bandungu (Indonésie) - 29 zemí
• Účastníci včetně komunistických zemí: ČLR a Vietnamská dem. republika
• Rezoluce: hospodářská a technická pomoc, kulturní spolupráce, likvidace kolonialismu a rasové diskriminace, odzbrojení, zákaz prostředků masového ničení, právo národů na sebeurčení

ROZVOJ:
• Září 1961: Konference v Bělehradě (Jugoslávie) - signalizovala roli Titovy Jugoslávie, která odpadla od sovětského bloku
• Deklarace: Potřeba politické aktivity nezúčastněných, větší podíl na řešení světových problémů
• Říjen 1964: Konference v Káhiře - Program míru a mezinárodní spolupráce

VŮDČÍ OSOBNOSTI:
• Gamal Abdel Násir (Egypt)
• Josip Broz Tito (Jugoslávie)
• Džaváharlál Nehrú a Indira Gándhíová (Indie)

ÚPADEK (70. LÉTA):
• Vliv levicových sil - konference v Guyaně 1972, Alžírsku 1974
• Kritika "amerického imperialismu", antiamerikanismus po válce ve Vietnamu
• Kolektivistický ekonomický model neúspěšný
• Vnitřní diferenciace a rozpad "tábora chudých"
• Požadavek "nového světového hospodářského řádu" (1974 OSN) zůstal jen deklarací

KONEC:
• 1979/1980: Sovětský vojenský zásah v Afghánistánu
• 120 000 sovětských vojáků bojovalo proti mudžáhidům
• Afghánistán byl členem hnutí nezúčastněných - ukázalo limity "nezúčastněnosti"

PŘÍKLAD ODPOVĚDI: "Hnutí nezúčastněných vzniklo jako reakce na bipolární rozdělení světa během studené války. V dubnu 1955 se v indonéském Bandungu sešla afroasijská konference 29 zemí (včetně ČLR a Vietnamu), která přijala rezoluce o hospodářské spolupráci, likvidaci kolonialismu a právu národů na sebeurčení. Na tuto konferenci navázalo hnutí 'nezúčastněných' zemí (Bělehrad 1961 - signalizoval roli Titovy Jugoslávie, Káhira 1964). Vůdci byli Násir, Tito a Nehrú. V 70. letech se hnutí dostalo pod vliv levice (konference v Guyaně, Alžírsku) a zaměřilo se na kritiku 'amerického imperialismu'. Kolektivistický model hospodářství však neuspěl - na rozdíl od 'asijských tygrů' s volným trhem. O ztroskotání politiky nezúčastněnosti pomohl rozhodnout sovětský zásah v Afghánistánu 1979, kde 120 000 vojáků marně bojovalo proti mudžáhidům."

OTÁZKA 9: Státy s úspěšnou tržní ekonomikou:

"ASIJŠTÍ TYGŘI":
• Singapur - městský státní útvar
• Hongkong - městský státní útvar
• Tchaj-wan
• Jižní Korea

CHARAKTERISTIKA:
• Od konce 2. světové války uplatňovaly ekonomiku volného trhu
• Do poloviny 70. let demonstrovaly jasnou ekonomickou převahu
• Zařadily se mezi dynamické světové exportéry
• Inspirativní příklad pro ostatní rozvojové země

KONTRAST S AFRIKOU:
• Africké země inspirované socialistickým kolektivismem
• Kolektivistický model v zemědělství i průmyslu naprosto neuspěl
• Nkrumahův experiment v Ghaně - diktatura a prudký pokles životní úrovně
• Požadavek "nového světového hospodářského řádu" zůstal jen deklarativní

POUČENÍ:
• Úspěch "asijských tygrů" ukázal, že cesta k prosperitě vede přes volný trh
• Toto poznání přispělo k rozpadu "tábora chudých" zemí v 70. a 80. letech

PŘÍKLAD ODPOVĚDI: "Příkladem úspěšné aplikace volnotržní ekonomiky jsou 'asijští tygři' - městské státní útvary Singapur a Hongkong, dále Tchaj-wan a Jižní Korea. Tyto státy od konce druhé světové války uplatňovaly ekonomiku volného trhu a do poloviny 70. let se staly dynamickými světovými exportéry. Jejich úspěch ostře kontrastoval s africkými zeměmi, které se inspirovaly socialistickým kolektivismem - například Nkrumahův experiment v Ghaně vedl k diktatuře a ekonomickému úpadku. Úspěch 'tygrů' přispěl k tomu, že požadavek rozvojových zemí na 'nový světový hospodářský řád' zůstal pouze deklarací."
      `
    },
    {
      id: 4,
      title: "TEXT: Belgie a Kongo + OTÁZKY",
      summary: `🔑 HOCHSCHILD: "Duch krále Leopolda" (1998) - odhalil zločiny, zlomil mlčení
🔑 BERLÍN 1884-85: Bismarck rozdělil Afriku BEZ Afričanů, Leopold II. dostal Kongo jako SOUKROMÝ majetek
🔑 KAUČUK: "technologický hit" - pneumatiky, izolace → pohádkové zisky
🔑 ZLOČINY: sekání rukou dětem, vypalování vesnic, 5-10 milionů obětí
🔑 ODHALENÍ: misionáři, Edmund Morel (statistiky), Mark Twain → 1908 stát přebírá kolonii`,
      content: `
KONTEXT:
Adam Hochschild - americký novinář, napsal knihu "Duch krále Leopolda" (King Leopold's Ghost, 1998), která odhalila belgické zločiny v Kongu a zlomila mlčení.

OTÁZKA 1: Kdy a jak došlo k rozdělení Afriky?

• 1884-1885: Berlínská konference
• Organizátor: Německý kancléř Otto von Bismarck
• Účel: Rozdělit Afriku mezi evropské mocnosti bez vzájemné války
• DŮLEŽITÉ: Žádný Afričan nebyl přítomen!
• Důsledek: Hranice kresleny bez ohledu na etnické skupiny - jeden národ rozdělen, znepřátelené kmeny spojeny
• Leopold II. získal Kongo jako SOUKROMÝ majetek své "filantropické společnosti" (ne belgický stát)
• Kongo bylo 80x větší než Belgie
• Leopold sliboval: "humanitární misi", "civilizování Konga", "zastavení arabského obchodu s otroky"

PŘÍKLAD ODPOVĚDI: "K rozdělení Afriky došlo na Berlínské konferenci v letech 1884-1885, kterou zorganizoval německý kancléř Otto von Bismarck. Cílem bylo rozdělit Afriku mezi evropské mocnosti a vyhnout se vzájemné válce. Je třeba zdůraznit, že žádný zástupce Afriky nebyl jednání přítomen - diplomaté rýsovali hranice budoucích kolonií bez ohledu na místní národy. Belgický král Leopold II. na konferenci získal Kongo (80x větší než Belgie) jako svůj soukromý majetek pod záminkou 'humanitární mise' a 'civilizování domorodců'."

OTÁZKA 2: Hlavní vývozní komodita:

• KAUČUK (guma) - "technologický hit" doby
• Použití: pneumatiky pro automobily a jízdní kola, těsnění, izolace elektrických kabelů
• Poptávka továren byla obrovská, zisky "pohádkové"
• Stanley (1876): "Na ostrovech veletoku by bylo možno nasbírat tolik kaučuku, že by se tím zaplatily náklady na stavbu celé konžské železnice."

PŘÍKLAD ODPOVĚDI: "Hlavní vývozní komoditou z Konga byl kaučuk (guma), který byl v té době 'technologickým hitem'. Používal se na výrobu pneumatik pro rychle se rozvíjející automobilový a cyklistický průmysl, na těsnění a izolaci elektrických kabelů. Poptávka továren po gumě byla obrovská a zisky pohádkové, což motivovalo Leopolda II. k vytvoření brutálního systému nucené práce."

OTÁZKA 3: Jak se svět dozvěděl o hrůzách?

Svědci:
• Křesťanští misionáři - pašovali svědectví do nic netušícího světa
• Afroameričtí novináři - riskovali cestu do střední Afriky
• Edmund Morel - britský námořní úředník, ze statistik dovozu do Antverp odvodil existenci otrokářství (hromady surovin = výsledek nucené práce)
• Morel organizoval humanitární kampaň, vydával časopis s důkazy
• Mark Twain - americký spisovatel, aktivista v kampani proti belgickému otrokářství

Důsledky:
• Leopold II. se stal "mezinárodním vyvrhelem"
• 1908: Belgický stát převzal kolonii od krále

ZLOČINY belgické správy:
• Policisté z "Force publique" sekali ruce dětem za nesplnění norem
• Vypalování vesnic za nejmenší neposlušnost
• Napichování hlav a genitálií popravených na kůly jako varování
• Mučení žen a dětí
• Počet obětí: 5-10 milionů lidí
• Obyvatelstvo kleslo za 30 let Leopoldovy vlády na POLOVINU

PŘÍKLAD ODPOVĚDI: "O hrůzách v Kongu se svět dozvěděl díky několika odvážným jednotlivcům. Křesťanští misionáři pašovali svědectví o krutostech do Evropy, afroameričtí novináři riskovali cestu do Afriky. Klíčovou roli sehrál Edmund Morel, britský námořní úředník, který ze statistik dovozu do Antverp odvodil, že obrovské hromady surovin mohou být jen výsledkem otrokářského systému. Morel organizoval humanitární kampaň a vydával časopis s důkazy. Výsledkem bylo, že Leopold II. se stal mezinárodním vyvrhelem a roku 1908 belgický stát převzal kolonii. Odhady hovoří o 5-10 milionech obětí."

OTÁZKA 4: Další koloniální zločiny zmíněné v textu:

• Francie v Alžírsku - systematické mučení (50. léta 20. století)
• Německo v Namibii - genocida národa Hererů (25 000-100 000 obětí), ministryně se omluvila
• Británie v Keni - koncentrační tábory při potlačování povstání (50. léta)
• Itálie v Libyi - chemické zbraně proti beduínům (čeká na velkou debatu)
• Britská Indie - opakující se hladomory kvůli monokulturám (celkem 40 mil. mrtvých), povstání sipahijů 1857

PŘÍKLAD ODPOVĚDI: "Text zmiňuje několik dalších koloniálních zločinů: Francie v Alžírsku prováděla systematické mučení, aby zlomila odpor místního obyvatelstva v 50. letech. Německo spáchalo genocidu národa Hererů v dnešní Namibii - zemřelo 25 000 až 100 000 lidí. Británie zřídila koncentrační tábory v Keni při potlačování povstání v 50. letech. Itálie používala chemické zbraně proti libyjským beduínům. V Britské Indii docházelo k opakujícím se hladomorům v důsledku importovaných monokultur."

OTÁZKA 5: Kdy se začalo psát a učit o zločinech?

Přelom tisíciletí - nová generace historiků a učitelů

Hochschildova kniha (1998) - průlom v Belgii:
• Zpočátku kritika od svazů koloniálních úředníků a historiků
• Postupně změna - belgický vzdělávací systém se od základu měnil
• Generační rozdíl: starší věří "civilizační misi", mladí jsou kritičtí
• Muzeum střední Afriky v rekonstrukci - nový kritický pohled

Proč tak pozdě:
• 1. světová válka: Belgie jako oběť německé agrese - sympatie, zapomnění na Kongo
• Britští odpůrci Leopolda označeni za pacifisty, ztratili důvěru
• Koloniální úřednictvo bránilo pravdě
• "Koloniální minulost je prostě minulostí" - slova belgického premiéra

PŘÍKLAD ODPOVĚDI: "O koloniálních zločinech se začalo otevřeně psát a učit až na přelomu tisíciletí díky nové generaci historiků. Průlomem byla kniha Adama Hochschilda 'Duch krále Leopolda' z roku 1998. V Belgii to vyvolalo změnu školních osnov - dnes se Kongu věnují 4-6 hodin výuky. Důvodem pozdního vyrovnání bylo, že první světová válka učinila z Belgie oběť německé agrese a zločiny v Kongu byly zapomenuty. Jak řekl belgický premiér: 'Koloniální minulost je prostě minulostí.' Dnes je ale vidět generační rozdíl - mladí lidé jsou ke koloniální historii kritičtí."

OTÁZKA 6: Role Belgie při nezávislosti Konga (1960):

• Král Baudouin I. při vyhlášení nezávislosti: "Toto je vyvrcholení díla génia krále Leopolda II. A teď je na vás, abyste naši důvěru nezklamali."
• Kongo nepřipraveno: pouze 30 vysokoškolsky vzdělaných lidí, mezi 5000 úředníky jen 3 Konžané
• 1961: CIA a belgická tajná služba zavraždily prvního premiéra Patrice Lumumbu
  - Důvod: Strach ze znárodnění nerostných dolů a příklonu k SSSR
  - Tělo rozřezáno a rozpuštěno v kyselině
  - Jediná stopa: Lumumbův vyražený zub

PŘÍKLAD ODPOVĚDI: "Role Belgie při dekolonizaci Konga byla velmi problematická. Při vyhlášení nezávislosti roku 1960 král Baudouin I. prohlásil: 'Toto je vyvrcholení díla génia krále Leopolda II.' Kongo bylo na svobodu naprosto nepřipraveno - v zemi velikosti Německa, Francie a Itálie dohromady žilo pouze 30 vysokoškolsky vzdělaných lidí. O půl roku později belgická tajná služba spolu s CIA zavraždila prvního premiéra Patrice Lumumbu ze strachu před znárodněním dolů a příklonem k Sovětskému svazu. Jeho tělo bylo rozpuštěno v kyselině."

OTÁZKA 7: Dnešní důsledky belgického kolonialismu:

• Imigranti z Konga v Belgii (čtvrť Matonge v Bruselu)
• Budovy postavené z "konžských" peněz (vítězný oblouk, královský zámek se skleníky)
• Belgičtí miliardáři bohatnoucí na konžských diamantech
• Vincent Kompany - fotbalista, syn Konžana a Belgičanky
• Kongo zdědilo belgický způsob vlády - diktátor Mobutu pokračoval v plundrování
• Uprchlíci z rozvrácené země

PŘÍKLAD ODPOVĚDI: "Důsledky belgického kolonialismu jsou viditelné dodnes. V Belgii žijí konžští imigranti (bruselská čtvrť Matonge), budovy jako vítězný oblouk či královský zámek byly postaveny z peněz vydělaných v Kongu. Belgičtí miliardáři stále bohatnou na konžských diamantech. Ale hlavně - Kongo při nezávislosti nemělo vzdělanou elitu a diktátor Mobutu okopíroval belgický způsob vlády, takže plundrování země pokračovalo. Jak píše Hochschild, pouto mezi dvěma kontinenty 'už nejde smazat' - je to dědictví Berlínské konference, která 'Afriku rozmíchala jako vajíčka na rozpálené pánvi'."
      `
    },
    {
      id: 5,
      title: "TEXT: Horká studená válka v Africe + OTÁZKY",
      summary: `🔑 TEZE: Pro Afriku to byla "třetí světová válka" (Ferguson), oběti = rolníci
🔑 KONGO: Lumumba (socialista) zavražděn 1961 s vědomím CIA/Belgie → Mobutu (diktátor, spojenec USA)
🔑 ANGOLA: Občanská válka 1975-2002, MPLA (SSSR/Kuba) vs UNITA (USA/JAR), 500 000 mrtvých
🔑 ETIOPIE: Mengistu (marxista) - "rudý teror", hladomor 1984 (1 milion mrtvých), nucené přesídlování
🔑 MODERNIZACE: Obě strany ničily tradiční společnosti, vesnice strategických osad`,
      content: `
HLAVNÍ TEZE:
Studená válka byla "studená" jen z pohledu Evropy. Pro třetí svět to byla "třetí světová válka" (historik Niall Ferguson). Oběťmi byli především rolníci, kteří odmítali modernizační ideologie obou supervelmocí.

OTÁZKA 1: Proč se Jason dostal do ČSSR?

• Jason Haukongo - namibijské dítě, přiletěl 1985
• Poslán hnutím SWAPO (South West Africa People's Organisation)
• SWAPO bojovalo proti rasistické Jihoafrické republice, která okupovala Namibii
• Východní blok podporoval osvobozenecká hnutí
• Účel: Kvalitní vzdělání + marxistická průprava pro budoucí elitu
• Místo: Internát v Orlických horách, přísný dril
• Konec: 1990 Namibie získala nezávislost, 1991 zánik SSSR
• Jason se musel vrátit - cítil se jako Čech, neměl vztah k Namibii

PŘÍKLAD ODPOVĚDI: "Jason Haukongo se dostal do Československa v roce 1985 jako jedno z více než 50 namibijských dětí. Poslalo ho osvobozenecké hnutí SWAPO, které s podporou východního bloku bojovalo proti okupaci Namibie rasistickou Jižní Afrikou. Děti měly v internátu v Orlických horách získat kvalitní vzdělání a marxistickou průpravu, aby se staly elitou budoucí nezávislé Namibie. Plán se zhroutil s koncem studené války - Namibie získala nezávislost 1990 a děti se musely vrátit do země, ke které neměly žádný vztah."

OTÁZKA 2: Zástupné konflikty (proxy wars) zmíněné:

V textu zmíněné:
• Korea (50. léta) - 4 miliony mrtvých
• Vietnam (60.-70. léta) - 3 miliony mrtvých
• Etiopie (70.-80. léta) - přes milion mrtvých
• Mosambik - přes milion mrtvých
• Angola - 40 let války, půl milionu mrtvých
• Somálsko
• Afghánistán (sovětská invaze 1979) - 120 000 sovětských vojáků vs. mudžáhidové

Nezmíněné (můžeš doplnit):
• Kuba (1962 - raketová krize)
• Nikaragua, Chile, Guatemala (Latinská Amerika)
• Kambodža

PŘÍKLAD ODPOVĚDI: "Text zmiňuje několik zástupných konfliktů studené války: Korejská válka v 50. letech (4 miliony mrtvých), Vietnamská válka v 60.-70. letech (3 miliony mrtvých), konflikty v Etiopii a Mosambiku (přes milion mrtvých v každé zemi), občanská válka v Angole (40 let, půl milionu obětí) a sovětská invaze do Afghánistánu (1979). Text nezmiňuje například kubánskou raketovou krizi nebo konflikty v Latinské Americe (Chile, Nikaragua)."

OTÁZKA 3: Způsoby zásahů velmocí:

• Dodávky zbraní oběma stranám konfliktu
• Vysílání vojenských poradců
• Přímá vojenská intervence (kubánští vojáci v Angole - sovětský blok)
• Podpora tajných služeb (CIA, KGB, východoněmecká Stasi)
• Financování jedné strany konfliktu
• Výcvik bojovníků (ČSSR - namibijské děti)
• Diamanty a ropa jako zdroj financování (UNITA)

PŘÍKLAD ODPOVĚDI: "Velmoci zasahovaly do konfliktů ve třetím světě různými způsoby: dodávaly zbraně, vysílaly vojenské poradce, někdy i přímo intervenovaly (kubánští vojáci v Angole). Tajné služby jako CIA, KGB a východoněmecká Stasi podporovaly 'své' strany konfliktu. Východní blok také zajišťoval výcvik - například namibijské děti v ČSSR. Podle studie Wisconsinské univerzity tyto války trvaly v průměru více než dvakrát déle než konflikty z první poloviny století právě kvůli neustálé pomoci zvenčí."

OTÁZKA 4: Důvody intervencí:

ZÁPAD:
• Teorie "zadržování komunismu" (containment) - George Kennan
• Strach z "dominového efektu" - pokud padne jedna země, padnou další
• Kontrola surovin (ropa, diamanty)
• Zabránění sovětským základnám (Angola - břeh Atlantiku)
• "Étos svobody" s kořeny v 19. století

VÝCHOD:
• Šíření komunistické ideologie
• Podpora "národněosvobozeneckých hnutí"
• Získání strategických základen
• SSSR se považoval za "garanta sociální spravedlnosti"
• Kritika západního kolonialismu

OBĚ STRANY:
• Ideologický střet - obě strany věřily v univerzální platnost své ideologie
• "Civilizační mise" - export svého společenského modelu
• Ve skutečnosti pokračování imperialistického chování

PŘÍKLAD ODPOVĚDI: "Důvody intervencí se lišily podle strany. Západ se řídil teorií 'zadržování komunismu' a obával se 'dominového efektu' - že pokud jedna země padne komunismu, následují sousední. Kontrola surovin (ropa, diamanty) a zabránění sovětským základnám byly také důležité. Východ podporoval 'národněosvobozenecká hnutí' a šířil komunistickou ideologii - SSSR se považoval za garanta sociální spravedlnosti. Obě strany však fakticky pokračovaly v imperialistickém chování Evropy - snažily se o 'civilizační misi' a vývoz své ideologie."

OTÁZKA 5: Teorie zadržování komunismu (containment):

• Autor: George Kennan (americký diplomat, 1947)
• Podstata: Zabránit šíření komunismu za hranice, kde už existuje
• "Dominový efekt": Pokud jedna země padne komunismu, sousední následují jako padající kostky domina
• Aplikace: Vietnam, Korea, Latinská Amerika, Afrika
• Důsledek: USA podporovaly i diktátory, pokud byli antikomunisté

PŘÍKLAD ODPOVĚDI: "Teorie zadržování komunismu (containment) byla formulována americkým diplomatem Georgem Kennanem roku 1947. Jejím cílem bylo zabránit šíření komunismu za hranice, kde již existoval. S tím souvisela teorie 'dominového efektu' - obava, že pokud jedna země 'padne' komunismu, sousední budou následovat jako padající kostky domina. Tato teorie ospravedlňovala americké intervence ve Vietnamu, Koreji i Latinské Americe a vedla i k podpoře antikomunistických diktátorů."

OTÁZKA 6: Proč nelze aplikovat evropské hodnocení?

• V Evropě: USA = demokracie a svoboda, SSSR = komunistická diktatura
• Ve třetím světě: OBĚ strany podporovaly brutální diktátory

Příklady:
• SSSR podporoval: Haile Mengistu v Etiopii ("africký Stalin") - teror, hladomory, stovky tisíc obětí
• Západ podporoval: Idi Amin v Ugandě (britská pomoc), apartheid v JAR, Jonas Savimbi (UNITA) v Angole

Pro rolníka v rozvojové zemi nebyl rozdíl mezi velmocemi - obě přinášely válku a utrpení.

Richard Dowden: USA "měly vždy jasno, jestli chtějí spíše rasistický apartheid, nebo komunismus, kterým hrozil Africký národní kongres Nelsona Mandely."

PŘÍKLAD ODPOVĚDI: "V Evropě platilo zjednodušené hodnocení: USA prosazovaly demokracii, SSSR budoval diktatury. Z pohledu rolníka v rozvojové zemi však nebyl výrazný rozdíl. SSSR podporoval 'afrického Stalina' Mengistua v Etiopii, jehož teror si vyžádal stovky tisíc obětí. Ale USA a Západ podporovaly rasistický apartheid v JAR, ugandského tyrana Idi Amina i brutální hnutí UNITA v Angole. Jak napsal Richard Dowden, Američané 'měli vždy jasno, jestli chtějí spíše rasistický apartheid, nebo komunismus Nelsona Mandely'. Obě velmoci fakticky pokračovaly v imperialistickém chování."

OTÁZKA 7: Důležité mezníky v dějinách Afriky:

• 1878 (1884-85): Berlínská konference - rozdělení Afriky mezi evropské mocnosti
• 1960: "Rok Afriky" - masová dekolonizace (18 států)
• 1991: Konec studené války - pád diktátorů závislých na supervelmocích (Mengistu utekl, Barre svržen)
• 1994: První demokratické volby v JAR (Nelson Mandela prezidentem)

PŘÍKLAD ODPOVĚDI: "Text zmiňuje několik klíčových mezníků: Berlínská konference 1884-85 rozdělila Afriku mezi evropské mocnosti bez účasti jediného Afričana. Rok 1960 je označován jako 'Rok Afriky' - masová dekolonizace. Roku 1991 s koncem studené války padli diktátoři závislí na supervelmocích (Mengistu v Etiopii, Barre v Somálsku). Pro Afriku tak neskončila jen epocha od roku 1945, ale celé období od Berlínské konference 1878. Roku 1994 proběhly první demokratické volby v JAR."

OTÁZKA 8: Co se změnilo od 2012? (Trendy)

POZITIVNÍ TRENDY:
• Ekonomický růst ("Afrika na vzestupu", "Africa Rising")
• Demokratizace - více mírových předání moci
• Technologický skok (mobilní telefony, internet)
• Růst střední třídy

NEGATIVNÍ TRENDY / NOVÉ VÝZVY:
• Čínský vliv nahrazuje západní - nová forma závislosti?
• Islámský terorismus (Boko Haram v Nigérii, al-Shabaab v Somálsku)
• Arabské jaro a jeho následky (chaos v Libyi, Egypt)
• Migrační vlny do Evropy
• Nové konflikty (Jižní Súdán, Sahel)
• COVID-19 a jeho ekonomické dopady

PŘÍKLAD ODPOVĚDI: "Od roku 2012 zaznamenala Afrika několik trendů. Pozitivně: ekonomický růst ('Afrika na vzestupu'), demokratizace s více mírovými předáními moci, technologický skok díky mobilním telefonům. Negativně: západní vliv nahrazuje Čína (nová forma závislosti?), roste islámský terorismus (Boko Haram, al-Shabaab), arabské jaro destabilizovalo severní Afriku (chaos v Libyi), zesílily migrační vlny do Evropy. Text z roku 2012 varoval, že 'démoni minulosti řádili celé dvě dekády' po konci studené války - toto varování zůstává aktuální."
      `
    },
    {
      id: 6,
      title: "WWI – příčiny a změna koalic během války",
      summary: `🔑 MANIA: Militarismus, Aliance, Nacionalismus, Imperialismus, Atentát
🔑 TROJSPOLEK (1882): Německo + R-U + Itálie vs TROJDOHODA (1907): Francie + Rusko + Británie
🔑 KRIZE: Bosenská 1908 (anexe), Balkánské války 1912-13, Atentát 28.6.1914 (Gavrilo Princip)
🔑 ZMĚNY: Itálie 1915 → Dohoda (Londýnská smlouva), USA 1917 → Dohoda, Rusko 1918 ven (Brest-litevsk)
🔑 FRANCIE-NĚMECKO: revanche za 1870, ztráta Alsaska-Lotrinska, 5 mld reparací`,
      content: `
DLOUHODOBÉ PŘÍČINY (MANIA):

M - MILITARISMUS:
• Závody ve zbrojení (zejména námořní - Německo vs. Británie)
• Německý program námořního zbrojení 1898
• Vojenské plány (Schlieffenův plán)
• Oslavování války a vojenství
• Generál Conrad von Hötzendorf - hlavní advokát preventivní války

A - ALIANČNÍ SYSTÉM:
• Dvojspolek (1879): Německo + Rakousko-Uhersko
  - Překonané spory z minulosti (1866)
  - Společná obava z Ruska + "Drang nach Osten"
  - Shodné zájmy na Balkáně
• Trojspolek (1882): + Itálie (spor s Francií o Tunisko)
• Dvojdohoda (1894): Francie + Rusko (Francie chtěla vyjít z izolace)
• Trojdohoda (1907): + Velká Británie
  - Konec "Splendid Isolation"
  - Obavy z růstu Německa
  - Vyřešení sfér vlivu s Francií (1904 "srdečná dohoda") a Ruskem (1907)
• Problém: Konflikt dvou států automaticky vtáhl ostatní

N - NACIONALISMUS:
• Agresivní nacionalismus ve všech zemích
• Panslavismus - Rusko jako ochránce Slovanů
• Pangermanismus - sjednocení všech Němců
• Srbský nacionalismus - sen o Velkém Srbsku
• Francie - odplata "revanche" za porážku 1870 (ztráta Alsaska-Lotrinska)

I - IMPERIALISMUS:
• Soupeření o kolonie (Marocké krize 1905, 1911)
• Německo chtělo "místo na slunci"
• Dráha Berlín-Istanbul-Bagdád-Basra (německý projekt)

A - ASSASSINATION (Atentát):
• 28. 6. 1914: Atentát na Františka Ferdinanda d'Este v Sarajevu
• Atentátník: Gavrilo Princip (člen Černé ruky)
• "Sedm kulí v Sarajevu"

BALKÁNSKÉ KRIZE:
• 1908: Bosenská krize - Anexe Bosny a Hercegoviny Rakouskem
  - Faktické držení už od Berlínského kongresu 1878
  - "Dárek k jubileu Františka Josefa I."
  - Nepřátelství Srbska ("balkánský Piemont") a Ruska
• 1912-13: Balkánské války
  - 1. balkánská válka: Turecko vs. Balkánská liga (Bulharsko, Srbsko, Řecko, Černá Hora)
  - 2. balkánská válka: Bulharsko vs. bývalí spojenci + Turecko
  - Výsledek: Turecko a Bulharsko + Trojspolek, Srbsko + Trojdohoda

ČERVENCOVÁ KRIZE 1914:
• Rakousko-Uhersko dalo Srbsku ultimátum (48 hodin)
• Srbsko většinu podmínek přijalo, ale ne všechny
• 28. 7. 1914: Rakousko-Uhersko vyhlásilo válku Srbsku
• Rusko mobilizovalo na podporu Srbska
• Německo vyhlásilo válku Rusku (1. 8.) a Francii (3. 8.)
• Británie vstoupila po napadení neutrální Belgie (4. 8.)

ZMĚNY KOALIC BĚHEM VÁLKY:

DOHODA (Ententa) - postupně se rozšiřovala:
• 1914: Francie, Rusko, Británie, Srbsko, Belgie, Japonsko
• 1915: Itálie (přešla z Trojspolku! - Londýnská smlouva)
• 1916: Rumunsko, Portugalsko
• 1917: USA (duben), Řecko, Čína, Brazílie
• 1918: Rusko vystoupilo (Brestlitevský mír 3. 3. 1918)

ÚSTŘEDNÍ MOCNOSTI:
• 1914: Německo, Rakousko-Uhersko
• 1914: Osmanská říše (říjen)
• 1915: Bulharsko

PROČ ITÁLIE ZMĚNILA STRANU?
• Tajná Londýnská smlouva (1915)
• Dohoda slíbila Itálii území: Jižní Tyrolsko, Istrii, Dalmácii, část Malé Asie, kolonie
• Itálie vstoupila do války proti svým bývalým spojencům

PŘÍKLAD SPRÁVNÉ ODPOVĚDI:
"Příčiny první světové války lze shrnout zkratkou MANIA: Militarismus (závody ve zbrojení, zejména námořní mezi Německem a Británií), Alianční systém (Trojspolek 1882 vs. Trojdohoda 1907 - konflikt dvou států automaticky vtáhl ostatní), Nacionalismus (panslavismus, pangermanismus, srbský sen o Velkém Srbsku, francouzská touha po revanche za 1870), Imperialismus (soupeření o kolonie, marocké krize), a Assassination - atentát na Františka Ferdinanda 28. 6. 1914 v Sarajevu. Během války se koalice měnily: Itálie přešla roku 1915 od Trojspolku k Dohodě výměnou za příslib území (Londýnská smlouva). USA vstoupily roku 1917, Rusko naopak vystoupilo (Brestlitevský mír 1918)."
      `
    },
    {
      id: 7,
      title: "WWI – charakter války, nové zbraně, technologie",
      summary: `🔑 TOTÁLNÍ VÁLKA: celá ekonomika, propaganda, civilisté cílem
🔑 ZÁKOPOVÁ VÁLKA: pat na západní frontě, "ničí zem", bláto, krysy, šílenství
🔑 NOVÉ ZBRANĚ: kulomety, bojové plyny (Ypry 1915), tanky (Somma 1916), letadla, ponorky
🔑 BITVY: Verdun 1916 (10 měsíců, "neprojdou!"), Somma 1916 (1. den 57 000 Britů), Gallipoli
🔑 CENA: 10 mil mrtvých, 20 mil raněných, 186 mld USD, "ztracená generace"`,
      content: `
SPECIFIKA VÁLKY:

1. VÁLKA TOTÁLNÍ:
• Zapojení celé ekonomiky (válečná ekonomika)
• Nasazení všech zdrojů státu
• Mobilizace celé společnosti
• Ženy v továrnách (nahrazují muže)
• Propaganda a cenzura - očerňování protivníka
• Racionování potravin
• Válečné půjčky

2. VÁLKA GLOBÁLNÍ:
• Boje na všech kontinentech
• Kolonie zapojeny do války
• Námořní válka na všech oceánech

3. VÁLKA PRŮMYSLOVÁ:
• Technický pokrok využit k masovému zabíjení
• "Průmyslové zabíjení" - továrny na smrt
• Milionové armády (branná povinnost)
• Obrovské ztráty - "ztracená generace"

ZÁKOPOVÁ VÁLKA (od podzimu 1914):
• Západní fronta: Linie zákopů od Švýcarska k Severnímu moři (cca 700 km)
• "Země nikoho" mezi zákopy - ostnaté dráty, krátery po granátech
• Útok = obrovské ztráty pro minimální zisk území
• Pat - obrana silnější než útok
• Podmínky v zákopech: bláto, krysy, nemoci, "zákopová noha"

KLÍČOVÉ BITVY:
• Bitva na Marně (1914) - zastavení německého postupu, konec Schlieffenova plánu
• Verdun (1916) - nejdelší (10 měsíců) a nejkrvavější bitva
  - 100 000 granátů za hodinu
  - Pétain: "Neprojdou!" ("Ils ne passeront pas!")
  - Otázka prestiže, snaha "vykrvácet" nepřítele
• Somma (1916) - 1 milion mrtvých, posun fronty o pár km, první nasazení tanků

NOVÉ ZBRANĚ:

1. KULOMET:
• Devastující v obraně (Maxim, Vickers)
• Hlavní důvod zákopové války
• Jeden kulomet = síla desítek střelců

2. BOJOVÉ PLYNY:
• První použití: Němci u Yper (duben 1915) - chlor
• Později: Fosgen, yperit (hořčičný plyn - způsoboval puchýře)
• Plynové masky se staly nutností
• Zakázány Ženevským protokolem 1925

3. TANK:
• První použití: Británie na Sommě (září 1916)
• Účel: Překonat zákopy a ostnaté dráty
• Zpočátku nespolehlivé, ale budoucnost
• Název "tank" = krycí označení (nádrž)

4. LETADLA:
• Zpočátku průzkum
• Později: Stíhačky (vzdušné souboje), bombardéry
• "Esa" - Manfred von Richthofen ("Rudý baron" - 80 sestřelů)
• Vzducholodě (zeppeliny) - bombardování Londýna

5. PONORKY (U-Booty):
• Německá neomezená ponorková válka
• Potápění civilních lodí
• Lusitania (1915) - 1198 mrtvých včetně 128 Američanů
• Hlavní důvod vstupu USA do války (1917)

6. DALŠÍ ZBRANĚ:
• Plamenomety
• Granáty, minomety
• Ostnaté dráty
• Dalekonosná děla ("Velká Berta" - ostřelování Paříže)

DŮSLEDKY NOVÝCH ZBRANÍ:
• Obrana silnější než útok = pat
• Obrovské ztráty při každém útoku
• Psychické trauma vojáků ("shellshock" - válečná neuróza)
• Dehumanizace války
• Průměrně 5509 mrtvých DENNĚ (srovnání: napoleonské války 233 denně)

FRONTY:
• Západní fronta: Francie, Belgie - zákopová válka
• Východní fronta: Rusko vs. Německo a R-U - pohyblivější
• Srbská fronta: R-U porážky, masové popravy
• Italská fronta: Od 1915, horská válka
• Blízký východ: Britové vs. Turci, arabské povstání (Lawrence z Arábie)
• Gallipoli (1915): Neúspěšný pokus Dohody dobýt Dardanely

PŘÍKLAD SPRÁVNÉ ODPOVĚDI:
"První světová válka měla tři klíčové charakteristiky: byla totální (zapojení celé ekonomiky a společnosti, propaganda, racionování), globální (boje na všech kontinentech) a průmyslová (technický pokrok využit k masovému zabíjení). Na západní frontě vznikla zákopová válka - 700 km zákopů od Švýcarska k moři, kde obrana byla silnější než útok. Nové zbraně zahrnovaly kulomet (hlavní důvod zákopů), bojové plyny (první použití u Yper 1915), tanky (první na Sommě 1916), letadla a ponorky. Německá neomezená ponorková válka a potopení Lusitanie (1198 mrtvých) vedly ke vstupu USA do války 1917. Válka si vyžádala průměrně 5509 mrtvých denně."
      `
    },
    {
      id: 8,
      title: "TEXT: Slepě kráčíme do války (Clark) + OTÁZKY",
      summary: `🔑 CLARK: "Náměsíčníci" (2012) - politici jako náměsíčníci, žádný hlavní viník
🔑 NEOBVIŇUJE: Všichni viníci i oběti, rozmazané hranice mezi obranou a útokem
🔑 BALKÁN: Klíčová role, Srbsko se špinavými kontakty na atentátníky ("Černá ruka")
🔑 KRITIKA: Tradiční obvinění Německa bylo "zjednodušující"
🔑 POUČENÍ: Menší multipolarita po studené válce, stačí pár kroků ke katastrofě`,
      content: `
O KNIZE:
Christopher Clark: "Náměsíčníci. Jak Evropa v roce 1914 dospěla k válce" (The Sleepwalkers, 2012)
Australský historik působící v Cambridge, kniha vyšla česky 2014.
Helmut Schmidt (německý kancléř) přirovnal krizi na Ukrajině ke knize - varování před "náměsíčnictvím".

OTÁZKA 1: Historické paralely v textu:

• Berlínská konference 1884-85 → současné konflikty
• Atentát v Sarajevu 1914 → útok 11. září 2001 ("jediná symbolická událost může nezvratně změnit politiku")
• Černá ruka → al-Káida (nestátní, těžko kontrolovatelní aktéři)
• Válka 1914 → krize na Ukrajině (Helmut Schmidt)
• Italská válka v Libyi 1911 → intervence v Libyi 2011
• Srbský nacionalismus 1914 → války v Jugoslávii 90. let (Srebrenica, obléhání Sarajeva)
• Svět před 1914 → dnešní multipolární svět "upadajících impérií a nastupujících velmocí"

PŘÍKLAD ODPOVĚDI: "Clark v knize uvádí řadu historických paralel. Přirovnává Černou ruku k al-Káidě jako příklad nestátních aktérů. Atentát v Sarajevu srovnává s 11. zářím 2001 - 'jediná symbolická událost může nezvratně změnit politiku'. Srbský nacionalismus z roku 1914 dává do souvislosti s válkami v Jugoslávii v 90. letech (Srebrenica, obléhání Sarajeva). Italskou válku v Libyi 1911 zmiňuje v kontextu intervence 2011. Hlavně varuje, že dnešní multipolární svět 'upadajících impérií a nastupujících velmocí' se světu před 1914 podobá více, než bychom chtěli."

OTÁZKA 2: Role a ambice Srbska:

• 1903: Masakr v Bělehradě - zavražděn král Alexandr a královna Draga
  - Organizátor: Dragutin Dimitrijević "Apis" - později šéf srbské vojenské rozvědky
  - Stejná síť později stála za atentátem v Sarajevu
• Sen o "Velkém Srbsku" - sjednocení všech Srbů
• Ambice: Připojit Bosnu a Hercegovinu (anexe 1908 to zkomplikovala)
• Srbsko jako "balkánský Piemont" - chce sjednotit Jihoslovany
• Hospodářsky zaostalé, ale vojensky silné
• Ctižádostivý hráč balkánské hry
• Clark zdůrazňuje srbskou odpovědnost více než jiní historici

PŘÍKLAD ODPOVĚDI: "Clark věnuje zhruba prvních 100 stran Srbsku jako 'zdroji neklidu'. Začíná masakrem v Bělehradě 1903, kdy tajná síť důstojníků v čele s Dragutinem Dimitrijevićem 'Apisem' zavraždila krále Alexandra. Tatáž síť později organizovala atentát v Sarajevu. Srbsko snilo o 'Velkém Srbsku' - sjednocení všech Srbů včetně těch v Bosně. Bylo hospodářsky zaostalé, ale vojensky silné a ctižádostivé. Clark zdůrazňuje srbskou odpovědnost více než jiní historici a upozorňuje, že 'války v 90. letech nám připomněly, jak vražedný je balkánský nacionalismus'."

OTÁZKA 3: Ostatní státy:

RAKOUSKO-UHERSKO:
• Mnohonárodnostní stát vytvářející "robustní právní a ekonomický prostor"
• Snaha udržet stabilitu proti "běsům nacionalismu"
• Po anexi Bosny (1908) v konfliktu se Srbskem
• Conrad von Hötzendorf - hlasitý advokát preventivní války

RUSKO:
• Panslavismus - ochránce "srbských bratrů"
• Rychlá a překvapivá mobilizace
• Clark považuje Rusko za jednoho z hlavních viníků
• Car Mikuláš II. (Nicky) - kolísal mezi frakcemi

NĚMECKO:
• "Nabubřelý chaot" Vilém II. (Willy) - "slon v porcelánu"
• Dlouho se domnívali, že konflikt bude lokální a dočasný
• Profesionálové císaře odstavovali od rozhodování

FRANCIE:
• Spojenectví s Ruskem
• Snaha o odvetu za 1870 (Alsasko-Lotrinsko)
• Spolu s Ruskem se snažila shodit vinu na Německo

BRITÁNIE:
• Snaha o rovnováhu sil
• Vstup kvůli napadení neutrální Belgie

PŘÍKLAD ODPOVĚDI: "Clark ukazuje každý stát jako komplexního aktéra. Rakousko-Uhersko bylo mnohonárodnostní stát snažící se udržet stabilitu, ale generál Conrad von Hötzendorf prosazoval preventivní válku. Rusko jako ochránce 'srbských bratrů' překvapivě rychle mobilizovalo - Clark je považuje za jednoho z hlavních viníků. Německý císař Vilém II. byl 'nabubřelý chaot' a 'slon v porcelánu', kterého profesionálové odstavovali od rozhodování. Francie chtěla odvetu za 1870 a spolu s Ruskem se snažila shodit vinu na Německo, což se odrazilo v článku 231 Versailleské smlouvy."

OTÁZKA 4: Byla válka nevyhnutelná?

Clark říká: NE!
• Válka nebyla důsledkem dlouhodobého nevyhnutelného zhoršování
• Spíše výsledek "krátkodobých otřesů mezinárodního systému"
• "Prvek nepředvídatelnosti" hrál klíčovou roli
• "Mohlo to skončit úplně jinak"
• Válka byla TRAGÉDIE, ne zločin jednoho státu
• Odmítá "detektivku Agathy Christie, kde zjistíme pachatele s kouřící pistolí"

PŘÍKLAD ODPOVĚDI: "Clark tvrdí, že válka NEBYLA nevyhnutelná. Odmítá pohled na ni jako na důsledek dlouhodobého zhoršování mezinárodní situace. Byla spíše výsledkem 'krátkodobých otřesů mezinárodního systému', kde hrál důležitou roli 'prvek nepředvídatelnosti'. Mohlo to skončit jinak. Clark odmítá hledat jediného viníka - nejde o 'detektivku Agathy Christie, kde zjistíme pachatele s kouřící pistolí'. Válku považuje za tragédii, ne za zločin."

OTÁZKA 5: Kdo jsou "náměsíčníci" a proč?

• Králové, císaři, ministři zahraničí, velvyslanci, vojenští velitelé, novináři, podnikatelé
• Paradox: "Přibližovali se k číhajícímu nebezpečí bdělými, uvážlivými kroky"
• Byli při vědomí, měli informace, analyzovali je - ale jednali jako by spali
• Podlehli narativům a obrazům, které sami vytvořili
• Po atentátu: "fatalistické odevzdání se osudu"
• "Defenzivní patriotismus" - všichni se cítili jako oběti útoku nepřítele
• Převládla "stará magie praporů a vlasteneckých slov" (Stefan Zweig)

PŘÍKLAD ODPOVĚDI: "Clarkovými 'náměsíčníky' jsou králové, císaři, ministři, diplomaté, generálové a novináři - tedy ti, kdo rozhodovali. Paradox spočívá v tom, že 'se přibližovali k číhajícímu nebezpečí bdělými, uvážlivými kroky' - byli při vědomí, měli informace, ale jednali, jako by spali. Podlehli narativům, které sami vytvořili. Po atentátu je zachvátilo 'fatalistické odevzdání se osudu' a 'defenzivní patriotismus' - všichni se cítili jako oběti. Jak napsal Stefan Zweig, převládla 'stará magie praporů a vlasteneckých slov'."

OTÁZKA 6: Role korunovaných hlav:

CAR MIKULÁŠ II. (Nicky):
• "Bezkrevný car" - kolísal mezi diplomaty, vojáky a podnikateli
• Nejprve souhlasil s mobilizací
• Dostal telegram od Viléma II. ("Willy") varující před mobilizací
• Chtěl odvolat, podepsal jen částečnou mobilizaci
• Pod tlakem "válečné strany" za 24 hodin potvrdil plnou mobilizaci
• Omezený manévrovací prostor

VILÉM II. (Willy):
• "Nabubřelý chaot", "slon v porcelánu diplomacie"
• Profesionálové ho skrytě odstavovali od rozhodování
• Nakonec dotlačen k válce

FRANTIŠEK JOSEF I.:
• Starý císař (86 let), omezený vliv
• Závislý na poradcích
• Zemřel 1916, nástupce Karel I. usiloval o separátní mír

KORESPONDENCE WILLY-NICKY:
• Mohla válce zabránit
• Neudělali to - ztratili války, říše, koruny i životy

PŘÍKLAD ODPOVĚDI: "Monarchové disponovali omezeným manévrovacím prostorem a museli prosazovat rozhodnutí pomocí frakčních bojů. Car Mikuláš II. kolísal mezi frakcemi - nejprve souhlasil s mobilizací, pak po telegramu od Viléma II. chtěl odvolat, ale za 24 hodin pod tlakem 'válečné strany' potvrdil plnou mobilizaci. Vilém II. byl 'nabubřelý chaot', kterého profesionálové odstavovali od rozhodování. Ironicky právě tito dva monarchové - příbuzní, kteří si psali 'Willy' a 'Nicky' - mohli válce zabránit silou svého majestátu. Neudělali to a ztratili nejen války, ale i své říše, koruny a životy."
      `
    },
    {
      id: 9,
      title: "WWI – důsledky a poválečná Evropa",
      summary: `🔑 ZTRÁTY: 10 mil mrtvých vojáků, 20 mil raněných, 6 mil civilistů, pandemie 1918
🔑 MAPY: Rozpad R-U, Osmanů, Ruska → nové státy (ČSR 28.10.1918, Polsko, Jugoslávie)
🔑 REVOLUCE: Rusko (únor/říjen 1917), Německo (listopad 1918 → republika)
🔑 TRAUMA: "Ztracená generace", pacifismus, Remarque, PTSD
🔑 WILSONOVY BODY: Sebeurčení národů, SN, otevřená diplomacie (→ Versailles)`,
      content: `
LIDSKÉ ZTRÁTY:

Vojáci (padlí):
• Německo: 2 000 000
• Rusko: 1 700 000
• Francie: 1 358 000
• Rakousko-Uhersko: 1 200 000
• Velká Británie: 761 000
• Itálie: 460 000
• USA: 114 000
• Celkem Dohoda: cca 5,1 milionu
• Celkem Ústřední mocnosti: cca 3,4 milionu

Civilisté:
• Arméni, Židé, Syřané, Řekové - genocidy a masakry (4+ miliony)
• Rusko: 2 000 000
• Srbsko/Rakousko: 1 000 000
• Německo: 812 000 (hlad, nemoci)
• Španělská chřipka: 6 000 000 (součást válečných obětí)

Celkem: cca 17 milionů mrtvých, 20+ milionů raněných
Denně: průměrně 5509 mrtvých

"ZTRACENÁ GENERACE":
• Celá generace mladých mužů decimována
• Francie: 10% mužské populace
• Psychické trauma přeživších ("shellshock")
• Ztráta víry v pokrok a civilizaci

POLITICKÉ DŮSLEDKY:

ZÁNIK ŘÍŠÍ:
• Rakousko-Uhersko → rozpad na nástupnické státy
• Osmanská říše → Turecká republika (Atatürk)
• Ruské impérium → SSSR (po revolucích 1917)
• Německé císařství → Výmarská republika (abdikace Viléma II. 9. 11. 1918)

NOVÉ STÁTY:
• Střední Evropa: Československo (28. 10. 1918), Polsko, Jugoslávie, Maďarsko, Rakousko
• Pobaltí: Finsko, Estonsko, Lotyšsko, Litva

REVOLUCE:
• Rusko: Únorová (březen 1917) - pád cara, Říjnová (listopad 1917) - bolševici
• Německo: Listopad 1918 - abdikace císaře, republika
• Maďarsko: Republika rad (1919)

EKONOMICKÉ DŮSLEDKY:
• Obrovské válečné dluhy
• Inflace, hospodářské problémy
• Válečné reparace (Německo: 132 miliard zlatých marek)
• Přechod od volného obchodu k protekcionismu
• USA se staly věřitelem Evropy - přesun ekonomického centra

CENA VÁLKY (v USD):
• Dohoda: 125 690 500 000
• Ústřední mocnosti: 60 644 000 000
• Celkem: 186 300 500 000
• Denně: 125 000 000 (pouze přímé náklady!)

SOCIÁLNÍ DŮSLEDKY:
• Emancipace žen (práce v továrnách → volební právo)
• Rozpad tradičních hodnot
• Trauma "ztracené generace"
• Vzestup mas a masové politiky
• Veteráni jako politická síla

CHARAKTERISTIKA POVÁLEČNÉ EVROPY:
• Nestabilita nových demokracií
• Revanšismus (Německo, Maďarsko, Bulharsko)
• Hospodářské problémy a inflace
• Vzestup extremismu (komunismus, fašismus)
• Národnostní konflikty v nových státech (menšiny)
• "Dvacet let příměří" - slova maršála Focha

BRESTLITEVSKÝ MÍR (3. 3. 1918):
• Rusko vystupuje z války
• Obrovské ztráty Ruska:
  - 26% obyvatelstva
  - 27% orné půdy
  - 26% železniční sítě
  - 75% zásob uhlí
  - 33% průmyslu

PŘÍKLAD SPRÁVNÉ ODPOVĚDI:
"První světová válka měla katastrofální důsledky. Zahynulo asi 17 milionů lidí (průměrně 5509 denně), dalších 20 milionů bylo zraněno. Vznikla 'ztracená generace' - Francie ztratila 10% mužské populace. Politicky zanikly čtyři velké říše: Rakousko-Uhersko, Osmanská, Ruská a Německá. Na jejich troskách vznikly nové státy: Československo (28. 10. 1918), Polsko, Jugoslávie, pobaltské republiky. Ekonomicky válka stála 186 miliard dolarů, vedla k inflaci a dluhům. Sociálně přinesla emancipaci žen a vzestup extremismu. Poválečná Evropa byla charakterizována nestabilitou nových demokracií a revanšismem poražených. Maršál Foch prorocky nazval Versailleský mír 'dvacetiletým příměřím'."
      `
    },
    {
      id: 10,
      title: "Mezinárodní vztahy 20. let (Versailles, SN)",
      summary: `🔑 PAŘÍŽ 1919: "Velká čtyřka" (Wilson, Clemenceau, Lloyd George, Orlando), BEZ poražených
🔑 VERSAILLES: Článek 231 (vina), 132 mld marek reparací, 100 000 armáda, ztráta území/kolonií
🔑 SN 1920: Kolektivní bezpečnost, ALE bez USA, bez armády, jednomyslnost → slabá
🔑 STABILIZACE: Dawes 1924, Locarno 1925, Německo v SN 1926, Briand-Kellogg 1928
🔑 FOCH: "To není mír, to je příměří na 20 let" → předpověď 2. světové války`,
      content: `
PAŘÍŽSKÁ MÍROVÁ KONFERENCE (1919):

Účastníci:
• "Velká čtyřka": Wilson (USA), Clemenceau (Francie), Lloyd George (Británie), Orlando (Itálie)
• Poražené státy NEBYLY přizvány k jednání - "mír vítězů"

VERSAILLESKÁ SMLOUVA (28. 6. 1919) - s Německem:

Článek 231 - "Klauzule o válečné vině":
• Německo neslo veškerou odpovědnost za válku
• Psychologický dopad - ponížení, živná půda pro nacismus

Územní ztráty Německa:
• Alsasko-Lotrinsko → Francie
• Západní Prusko, Poznaňsko → Polsko ("polský koridor")
• Gdaňsk (Danzig) = svobodné město
• Sársko pod správou Společnosti národů (15 let, pak plebiscit)
• Severní Šlesvicko → Dánsko (po plebiscitu)
• Eupen-Malmédy → Belgie
• Hlučínsko → Československo
• Všechny kolonie (mandáty SN)

Vojenská omezení:
• Armáda max. 100 000 mužů (pouze profesionálové)
• Zákaz tanků, letadel, ponorek
• Demilitarizace Porýní (50 km na východ od Rýna)
• Zákaz anšlusu (spojení s Rakouskem)

Reparace:
• Původně neurčená suma
• 1921: 132 miliard zlatých marek
• Platby měly trvat do roku 1988!

DALŠÍ MÍROVÉ SMLOUVY:
• Saint-Germain (1919) - s Rakouskem
• Trianon (1920) - s Maďarskem (ztráta 2/3 území! → revanšismus)
• Neuilly (1919) - s Bulharskem
• Sèvres (1920) / Lausanne (1923) - s Tureckem

SPOLEČNOST NÁRODŮ (1920):

Základní informace:
• Wilsonova idea (14 bodů)
• Sídlo: Ženeva (Švýcarsko)
• Cíl: Kolektivní bezpečnost, mírové řešení sporů

Slabiny:
• USA NIKDY nevstoupily! (Senát odmítl ratifikovat)
• Neměla vlastní armádu
• Rozhodování vyžadovalo jednomyslnost
• Německo členem až 1926 (odchod 1933)
• SSSR členem až 1934 (vyloučen 1939)
• Neschopnost řešit krize 30. let (Mandžusko, Etiopie)

DŮLEŽITÉ SMLOUVY 20. LET:

Washingtonská konference (1921-22):
• Omezení námořního zbrojení
• Poměr válečných lodí: USA:Británie:Japonsko:Francie:Itálie = 5:5:3:1,75:1,75

Rapallská smlouva (1922):
• Německo + sovětské Rusko
• Vzájemné uznání, vzdání se reparací
• Tajná vojenská spolupráce (Německo cvičilo vojáky v SSSR)

Dawesův plán (1924):
• Reorganizace německých reparací
• Americké půjčky Německu
• Stabilizace německé ekonomiky

Locarnské smlouvy (1925):
• Německo uznalo západní hranice (s Francií a Belgií)
• Garanti: Británie, Itálie
• "Duch Locarna" - naděje na mír, smíření
• 1926: Německo přijato do Společnosti národů
• Východní hranice Německa NEBYLY garantovány!

Briand-Kelloggův pakt (1928):
• Zřeknutí se války jako nástroje politiky
• Podepsalo 62 států
• Bez mechanismu vynucování - symbolické
• Autoři: Aristide Briand (Francie), Frank Kellogg (USA)

HODNOCENÍ VERSAILLESKÉHO SYSTÉMU:
• "Mír vítězů" - ponižoval poražené
• Německo: ponížení → revanšismus → nacismus
• Maďarsko: "druhá oběť" - ztráta 2/3 území → revanšismus
• Systém nebyl schopen zabránit 2. světové válce
• "Dvacet let příměří" (maršál Foch)
• Příliš tvrdý na to, aby byl přijat, příliš měkký na to, aby byl vynucen

PŘÍKLAD SPRÁVNÉ ODPOVĚDI:
"Versailleský mírový systém vznikl na Pařížské konferenci 1919, kde jednala 'Velká čtyřka' (Wilson, Clemenceau, Lloyd George, Orlando) bez účasti poražených. Versailleská smlouva s Německem obsahovala článek 231 o válečné vině, územní ztráty (Alsasko-Lotrinsko, kolonie), vojenská omezení (100 000 vojáků, zákaz tanků a letadel) a astronomické reparace (132 miliard marek). Společnost národů (1920) měla zajistit kolektivní bezpečnost, ale byla oslabena neúčastí USA a absencí donucovacích prostředků. Ve 20. letech se situace zlepšila: Dawesův plán (1924) stabilizoval reparace, Locarnské smlouvy (1925) přinesly 'ducha smíření'. Briand-Kelloggův pakt (1928) zavrhoval válku, ale byl symbolický. Systém nakonec selhal - jak řekl maršál Foch, byl to jen 'dvacetiletý mír'."
      `
    },
    {
      id: 11,
      title: "Německo 1918-33",
      summary: `🔑 1918: Abdikace Viléma II. (9.11.), revoluce, Výmarská republika, "dýka do zad"
🔑 KRIZE: Spartakovci 1919 (Luxemburgová), Kappův puč 1920, hyperinflace 1923 (1 USD = 4,2 bil. marek)
🔑 RAPALLO 1922: Sblížení s SSSR, tajná vojenská spolupráce (obcházení Versailles)
🔑 STABILIZACE: Dawes 1924, Locarno 1925, Stresemann, vstup do SN 1926
🔑 KRACH 1929: 6 mil nezaměstnaných, vzestup NSDAP, Harzburská fronta → Hitler kancléřem 30.1.1933`,
      content: `
KONEC PRVNÍ SVĚTOVÉ VÁLKY A REVOLUCE (1918):

CITÁT - Lloyd George (britský min. zahr.):
"Vyždímáme Německo jako citrón, až budou jádra praskat."

LISTOPADOVÁ REVOLUCE:
• 3. 11. 1918: Vzpoura námořníků v Kielu - odmítli vyplout k sebevražedné bitvě
• Povstání se šířilo do dalších měst - rady dělníků a vojáků (Räte)
• 9. 11. 1918: Abdikace císaře Viléma II. - uprchl do Holandska
• Téhož dne vyhlášena republika - dvakrát!
  - Philipp Scheidemann (SPD): demokratická republika
  - Karl Liebknecht (spartakovci): socialistická republika
• 11. 11. 1918: Příměří v Compiègne - konec války

POKUSY O ŠÍŘENÍ KOMUNISMU (1919):
• Odštěpení levičáků od sociálních demokratů a jejich radikalizace
• Vznik "republik rad" - 1919:
  - Saská republika rad
  - Bavorská republika rad  
  - Maďarská republika rad (zasahovala i na Slovensko)
• Sovětsko-polská válka: 1920-21
• Založení Komunistické internacionály (Kominterna) - 1919 v Moskvě
  - Cíl: celosvětová revoluce
  - Všechna rozhodnutí závazná pro členské strany

SPARTAKOVSKÉ POVSTÁNÍ (leden 1919):
• Radikální komunisté (Karl Liebknecht, Rosa Luxemburgová) chtěli sovětskou revoluci
• Potlačeno armádou a Freikorpsy (polovojenské jednotky)
• Liebknecht a Luxemburgová zavražděni oddíly Freikorpsu 15. 1. 1919
• Důsledek: Hluboký rozkol mezi SPD a komunisty

VÝMARSKÁ REPUBLIKA (1919-1933):

VZNIK A ÚSTAVA:
• Leden 1919: Volby do Národního shromáždění (poprvé volily i ženy!)
• Únor 1919: Shromáždění zasedalo ve Výmaru (Berlín nebyl bezpečný)
• Ústava: Demokratická, prezidentská republika
• První prezident: Friedrich Ebert (SPD)
• Článek 48: Prezident mohl vládnout dekrety v "nouzi" - později zneužito

POSTIH NĚMECKA - VERSAILLESKÁ SMLOUVA ("DIKTÁT"):
• 28. 6. 1919: Německo muselo podepsat bez možnosti vyjednávat
• Článek 231: "Klauzule o válečné vině" - Německo nese veškerou odpovědnost
• Reparace: 132 mld. zlatých marek (cca 834 mld. USD dnes)
• Územní ztráty: Alsasko-Lotrinsko, polský koridor, kolonie (ztráta 1/8 území)
• Sársko na 15 let spravováno Společností národů
• Demilitarizace Porýní
• "Kapesní armáda" - max. 100 000 mužů, zákaz branné povinnosti
• Žádné těžké dělostřelectvo, tanky, ponorky, vojenské letectvo
• Zákaz spojenectví s Rakouskem (Anšlus)
• "Dolchstoßlegende" (legenda o dýce do zad): Armáda nebyla poražena, ale zrazena politiky
• Výmarská republika nesla stigma "listopadu zrádců"

KRIZOVÉ ROKY (1919-1923):

POLITICKÁ NESTABILITA:
• Kappův puč (březen 1920): Pokus pravicových Freikorpsů o převrat - potlačen generální stávkou
• Politické vraždy: Matthias Erzberger (1921), Walther Rathenau (1922) - zavražděni pravicovými extremisty
• Hitlerův pivní puč (8.-9. 11. 1923): Pokus NSDAP o převrat v Mnichově
  - Hitler odsouzen na 5 let, propuštěn po 9 měsících
  - Ve vězení napsal "Mein Kampf"

MEZINÁRODNÍ IZOLACE:
• Německo vyloučeno z mezinárodního společenství
• Sblížení se Sovětským Ruskem - Rapallo 1922:
  - Vzájemné uznání, odpuštění reparací
  - TAJNÉ vojenské dohody - Německo cvičilo vojáky v SSSR (obcházení Versailles)
• Do Společnosti národů až 1926

HYPERINFLACE 1923:
• Příčina: Německo neplatilo reparace → Francie a Belgie obsadily Porúří/Sársko (leden 1923)
• Vláda vyzvala k pasivní rezistenci, tiskla peníze na podporu stávkujících
• Inflace: V lednu 1923 = 1 USD za 18 000 marek, v listopadu 1923 = 1 USD za 4,2 BILIONU marek!
• Střední třída přišla o úspory → radikalizace
• Řešení: Nová měna Rentenmark (listopad 1923)

"ZLATÁ DVACÁTÁ LÉTA" (1924-1929):

STABILIZACE - JEDNÁNÍ O REPARACÍCH:
• Dawesův plán (1924): Reorganizace reparací, americké půjčky
• Youngův plán (1929): Další úprava reparací
• Hooverovo memorandum (1931): Roční moratorium na splátky
• Locarnské smlouvy (1925): Německo uznalo západní hranice s Francií a Belgií
  - "Duch smíření" - Briand a Stresemann dostali Nobelovu cenu za mír (1926)
  - Rýnský garanční pakt
• 1926: Německo přijato do Společnosti národů
• Briand-Kelloggův pakt (1928): Zřeknutí se války

HOSPODÁŘSKÝ ROZVOJ:
• Americké investice proudily do Německa
• Průmyslová výroba překonala předválečnou úroveň
• Modernizace, racionalizace výroby
• Pomalá stabilizace koncem 20. let

KULTURA VÝMARSKÉ REPUBLIKY:
• Expresionismus, Bauhaus (Gropius), Nová věcnost
• Film: "Kabinet doktora Caligariho", "Metropolis" (Fritz Lang)
• Divadlo: Bertolt Brecht, kabarety
• Věda: Einstein, Heisenberg - Nobelovy ceny
• Berlín jako kulturní metropole Evropy
• "Burácivá dvacátá léta" (Roaring Twenties)

KONEC REPUBLIKY (1929-1933):

VELKÁ HOSPODÁŘSKÁ KRIZE:
• Říjen 1929: Krach na newyorské burze → globální krize
• USA stáhly investice z Německa
• Nezaměstnanost: 1929 = 1,3 mil., 1932 = 6 milionů (30%!)
• Bankroty firem, krachy bank
• Chudoba, hlad, beznaděj

VZESTUP NSDAP:
• Nárůst popularity úměrně s nezaměstnaností (graf v prezentaci!)
• NSDAP v Reichstagu: 1928 = 12 poslanců, 1930 = 107, 1933 = 230
• NSDAP ve volbách: 1928 = 2,6%, 1930 = 18,3%, červenec 1932 = 37,3%
• Hitler sliboval: práci, chléb, obnovu německé velikosti, zrušení Versailles
• Propaganda: Masové mítinky, SA (úderné oddíly), "nepřátelé" (Židé, komunisté, Versailles)
• Nejednotnost levice - SPD a KPD se nenáviděly ("sociálfašismus")
• Harzburská fronta: Spojení NSDAP s podnikateli, bankéři a konzervativci
• Prezidentské volby 1932: Hitler X Hindenburg (36% vs 53%) - zatím neúspěšně

VLÁDA DEKRETŮ (1930-1933):
• Kancléř Heinrich Brüning (1930-32): Vládl pomocí článku 48
• Parlament prakticky vyřazen
• Prezident Hindenburg (od 1925): Stařec, nakonec jmenoval Hitlera

30. LEDNA 1933: HITLER KANCLÉŘEM:
• Hindenburg jmenoval Hitlera kancléřem koaliční vlády
• Konzervativci věřili, že Hitlera "zkrotí"
• Do půl roku Hitler zlikvidoval demokracii

POŽÁR REICHSTAGU (27. 2. 1933):
• Obviněn holandský komunista Marinus van der Lubbe + 3 bulharští komunisté (Georgi Dimitrov)
• Záminka k potlačení občanských práv
• Zákon o plných mocích - konec Výmarské republiky

PROČ REPUBLIKA PADLA?

Strukturální problémy:
• Nesla stigma porážky a "diktátu" Versailles
• Článek 48 umožňoval obejít parlament
• Roztříštěný stranický systém - nestabilní koalice
• Antidemokratické síly zleva (KPD) i zprava (NSDAP, DNVP)
• "Slabé rostlinky na kamenité půdě" (E. Hobsbawm o demokraciích)

Ekonomické faktory:
• Hyperinflace 1923 zničila střední třídu
• Závislost na amerických půjčkách
• Velká krize 1929 - masová nezaměstnanost

Politické chyby:
• SPD a KPD se nenáviděly - nespojily se proti nacistům
• Konzervativci podcenili Hitlera
• Hindenburg a elity preferovaly Hitlera před komunisty

PŘÍKLAD SPRÁVNÉ ODPOVĚDI:
"Výmarská republika (1918-1933) vznikla po listopadové revoluci, kdy 9. 11. 1918 abdikoval císař Vilém II. Nový stát byl od počátku zatížen stigmatem 'Versailleského diktátu' - článek 231 svaloval vinu za válku na Německo, reparace činily 132 miliard marek, armáda omezena na 100 000 mužů. Lloyd George prohlásil: 'Vyždímáme Německo jako citrón.' Republika čelila krizím: spartakovské povstání 1919 (Luxemburgová a Liebknecht zavražděni Freikorpsy), Kappův puč 1920, hyperinflace 1923 (1 USD = 4,2 bilionu marek). V izolaci se Německo sblížilo s SSSR (Rapallo 1922 - tajné vojenské dohody). Stabilizace přišla s Dawesovým plánem 1924 a Locarnskými smlouvami 1925 - Německo vstoupilo do SN 1926. Velká hospodářská krize 1929 vedla k masové nezaměstnanosti (6 milionů) a vzestupu NSDAP - z 12 poslanců (1928) na 230 (1933). Harzburská fronta spojila nacisty s konzervativci a průmyslníky. Hindenburg jmenoval Hitlera kancléřem 30. 1. 1933. Po požáru Reichstagu (27.2.1933) Hitler zlikvidoval demokracii."
      `
    }
  ],
  quizQuestions: [
    {
      question: "Kdy se konala Berlínská konference, která rozdělila Afriku?",
      options: ["1871-1872", "1884-1885", "1890-1891", "1900-1901"],
      correct: 1,
      explanation: "Berlínská konference proběhla 1884-1885 pod vedením Bismarcka. Rozdělila Afriku mezi evropské mocnosti bez přítomnosti jediného Afričana."
    },
    {
      question: "Který rok je označován jako 'Rok Afriky'?",
      options: ["1955", "1957", "1960", "1965"],
      correct: 2,
      explanation: "V roce 1960 získalo nezávislost 18 afrických zemí, proto se mu říká 'Rok Afriky'."
    },
    {
      question: "Co byla hlavní vývozní komodita z belgického Konga?",
      options: ["Diamanty", "Zlato", "Kaučuk", "Bavlna"],
      correct: 2,
      explanation: "Kaučuk (guma) byl 'technologickým hitem' doby - používal se na pneumatiky a izolace. Těžba byla spojena s brutálním otrokářstvím."
    },
    {
      question: "Kdo napsal knihu 'Duch krále Leopolda'?",
      options: ["Edmund Morel", "Adam Hochschild", "Christopher Clark", "Niall Ferguson"],
      correct: 1,
      explanation: "Adam Hochschild napsal v roce 1998 knihu, která odhalila belgické zločiny v Kongu a zlomila mlčení o této temné kapitole."
    },
    {
      question: "Co znamená teorie 'zadržování komunismu' (containment)?",
      options: ["Šíření komunismu po světě", "Zabránění šíření komunismu za stávající hranice", "Spolupráce se Sovětským svazem", "Izolacionismus USA"],
      correct: 1,
      explanation: "Teorie zadržování (George Kennan, 1947) předpokládala, že je třeba zabránit šíření komunismu za hranice, kde již existuje."
    },
    {
      question: "Kdy proběhl atentát na Františka Ferdinanda d'Este v Sarajevu?",
      options: ["28. června 1913", "28. června 1914", "28. července 1914", "1. srpna 1914"],
      correct: 1,
      explanation: "Atentát proběhl 28. června 1914. Přesně měsíc poté (28. 7.) Rakousko-Uhersko vyhlásilo válku Srbsku."
    },
    {
      question: "Která země změnila strany během 1. světové války a přešla od Trojspolku k Dohodě?",
      options: ["Bulharsko", "Rumunsko", "Itálie", "Osmanská říše"],
      correct: 2,
      explanation: "Itálie byla členem Trojspolku, ale v roce 1915 přešla na stranu Dohody výměnou za příslib území (Londýnská smlouva)."
    },
    {
      question: "Co je hlavní tezí knihy Christophera Clarka 'Náměsíčníci'?",
      options: ["Německo bylo jediným viníkem války", "Válka byla nevyhnutelná", "Všechny mocnosti nesou odpovědnost a válka nebyla nevyhnutelná", "Srbsko bylo nevinnou obětí"],
      correct: 2,
      explanation: "Clark tvrdí, že válka nebyla nevyhnutelná a všechny mocnosti nesou odpovědnost. Zpochybňuje jednostranné obviňování Německa."
    },
    {
      question: "Kdy byla založena Společnost národů?",
      options: ["1918", "1919", "1920", "1921"],
      correct: 2,
      explanation: "Společnost národů byla založena v roce 1920 na základě Wilsonových ideálů, ale USA do ní nikdy nevstoupily."
    },
    {
      question: "Co stanovil článek 231 Versailleské smlouvy?",
      options: ["Výši reparací", "Územní změny", "Válečnou vinu Německa", "Omezení armády"],
      correct: 2,
      explanation: "'Klauzule o válečné vině' (čl. 231) stanovila, že Německo nese odpovědnost za válku. Stala se zdrojem německého revanšismu."
    },
    {
      question: "Kdo byl Patrice Lumumba?",
      options: ["Belgický král", "První premiér nezávislého Konga", "Vůdce UNITA v Angole", "Prezident Ghany"],
      correct: 1,
      explanation: "Patrice Lumumba byl první premiér nezávislého Konga (1960). Byl zavražděn s pomocí CIA a belgické tajné služby v roce 1961."
    },
    {
      question: "Co bylo 'Hnutí nezúčastněných'?",
      options: ["Pacifistické hnutí v Evropě", "Spolek neutrálních států studené války", "Organizace afrických států", "Ekonomická unie třetího světa"],
      correct: 1,
      explanation: "Hnutí nezúčastněných sdružovalo státy, které nechtěly patřit ani k východnímu, ani k západnímu bloku. Vůdci: Tito, Násir, Nehrú."
    },
    {
      question: "Která nová zbraň byla poprvé použita v bitvě na Sommě (1916)?",
      options: ["Bojové plyny", "Letadla", "Tanky", "Ponorky"],
      correct: 2,
      explanation: "Britové poprvé nasadili tanky v bitvě na Sommě. Měly překonat zákopy a ostnaté dráty, zpočátku byly nespolehlivé."
    },
    {
      question: "Jaký byl Schlieffenův plán?",
      options: ["Obrana Verdunu", "Rychlý útok přes Belgii na Francii, pak na Rusko", "Ponorková válka proti Británii", "Obklíčení Paříže"],
      correct: 1,
      explanation: "Schlieffenův plán předpokládal rychlé poražení Francie útokem přes neutrální Belgii, pak přesun vojsk na východ proti pomaleji mobilizujícímu Rusku."
    },
    {
      question: "Kdy Rusko vystoupilo z první světové války?",
      options: ["1916", "1917", "1918 (Brestlitevský mír)", "1919"],
      correct: 2,
      explanation: "Rusko vystoupilo z války Brestlitevským mírem 3. března 1918 po bolševické revoluci. Ztratilo 26% obyvatelstva a 75% zásob uhlí."
    },
    {
      question: "Co byly Evianské dohody (1962)?",
      options: ["Konec války v Alžírsku", "Založení Společenství národů", "Mírová smlouva s Německem", "Dohoda o reparacích"],
      correct: 0,
      explanation: "Evianské dohody ukončily alžírskou válku za nezávislost. V referendu je schválilo 91% Francouzů."
    },
    {
      question: "Který stát Cameron uvádí jako příklad toho, že kolonie neposkytovaly hlavní trhy?",
      options: ["Británie", "Francie", "Německo", "Všechny výše uvedené"],
      correct: 3,
      explanation: "Cameron ukazuje, že Německo prodávalo více do Indie než do svých kolonií, Francie více do Indie než do Alžírska, a největší obchod probíhal mezi průmyslovými zeměmi."
    },
    {
      question: "Kdo byl 'africký Stalin' zmíněný v textu o studené válce?",
      options: ["Idi Amin", "Haile Mengistu", "Mobutu", "Nelson Mandela"],
      correct: 1,
      explanation: "Haile Mengistu v Etiopii byl podporován východním blokem včetně ČSSR. Jeho teror si vyžádal stovky tisíc obětí."
    },
    {
      question: "Co byly Locarnské smlouvy (1925)?",
      options: ["Německo uznalo západní hranice", "Omezení námořního zbrojení", "Zřeknutí se války", "Koloniální dohoda"],
      correct: 0,
      explanation: "V Locarnu Německo uznalo západní hranice s Francií a Belgií. Přineslo to 'ducha smíření' a Německo bylo přijato do Společnosti národů."
    },
    {
      question: "Kdy Nelson Mandela vyhrál první svobodné volby v JAR?",
      options: ["1990", "1991", "1994", "1999"],
      correct: 2,
      explanation: "První všerasové svobodné volby v JAR proběhly v květnu 1994. Nelson Mandela se stal prezidentem."
    },
    {
      question: "Kdy abdikoval německý císař Vilém II.?",
      options: ["28. října 1918", "9. listopadu 1918", "11. listopadu 1918", "28. června 1919"],
      correct: 1,
      explanation: "Vilém II. abdikoval 9. listopadu 1918 během listopadové revoluce. Téhož dne byla vyhlášena republika. Uprchl do Holandska."
    },
    {
      question: "Co byla 'hyperinflace' v Německu 1923?",
      options: ["Prudký pokles cen", "Extrémní znehodnocení měny", "Růst nezaměstnanosti", "Bankrot státu"],
      correct: 1,
      explanation: "Hyperinflace znamenala extrémní znehodnocení měny. V listopadu 1923 stál 1 USD 4,2 bilionu marek! Střední třída přišla o úspory."
    },
    {
      question: "Co umožňoval článek 48 Výmarské ústavy?",
      options: ["Volební právo žen", "Vládnutí prezidenta pomocí dekretů v nouzi", "Zákaz extremistických stran", "Referendum o důležitých otázkách"],
      correct: 1,
      explanation: "Článek 48 umožňoval prezidentovi vládnout dekrety v 'nouzi'. Byl později zneužit k obcházení parlamentu a nakonec k nastolení diktatury."
    },
    {
      question: "Kdy se Hitler pokusil o 'pivní puč' v Mnichově?",
      options: ["1920", "1921", "1923", "1925"],
      correct: 2,
      explanation: "Hitlerův pivní puč proběhl 8.-9. listopadu 1923. Pokus o převrat selhal, Hitler byl uvězněn a ve vězení napsal 'Mein Kampf'."
    },
    {
      question: "Jaká byla nezaměstnanost v Německu na vrcholu Velké hospodářské krize (1932)?",
      options: ["2 miliony", "4 miliony", "6 milionů", "8 milionů"],
      correct: 2,
      explanation: "V roce 1932 bylo v Německu 6 milionů nezaměstnaných (asi 30% pracovní síly). Masová nezaměstnanost přispěla k vzestupu nacistů."
    },
    {
      question: "Kdy byl Adolf Hitler jmenován německým kancléřem?",
      options: ["30. ledna 1932", "30. ledna 1933", "27. února 1933", "23. března 1933"],
      correct: 1,
      explanation: "Prezident Hindenburg jmenoval Hitlera kancléřem 30. ledna 1933. Konzervativci věřili, že ho 'zkrotí'. Do půl roku Hitler zlikvidoval demokracii."
    },
    {
      question: "Co bylo smlouvou v Rapallo (1922)?",
      options: ["Mírová smlouva s Francií", "Dohoda Německa a Sovětského Ruska", "Založení Společnosti národů", "Reparační dohoda"],
      correct: 1,
      explanation: "V Rapallu se Německo a Sovětské Rusko vzájemně uznaly a dohodly tajnou vojenskou spolupráci - Německo cvičilo vojáky v SSSR."
    },
    {
      question: "Co byla Kominterna?",
      options: ["Německá tajná policie", "Komunistická internacionála založená 1919", "Nacistická mládežnická organizace", "Spojenecká smlouva"],
      correct: 1,
      explanation: "Komunistická internacionála (Kominterna) byla založena 1919 v Moskvě s cílem řídit světovou komunistickou revoluci. Rozpuštěna 1943."
    }
  ]
};

export default function HistoryStudyApp() {
  const [activeTab, setActiveTab] = useState('study');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
  };

  const handleBack = () => {
    setSelectedTopic(null);
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnsweredQuestions([]);
    setQuizFinished(false);
  };

  const handleAnswer = (index) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);
    
    const isCorrect = index === studyData.quizQuestions[currentQuestion].correct;
    if (isCorrect) {
      setScore(score + 1);
    }
    setAnsweredQuestions([...answeredQuestions, {
      question: currentQuestion,
      selectedAnswer: index,
      correct: isCorrect
    }]);
  };

  const nextQuestion = () => {
    if (currentQuestion < studyData.quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizFinished(false);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnsweredQuestions([]);
  };

  const renderContent = (content) => {
    return content.split('\n').map((line, i) => {
      const trimmedLine = line.trim();
      
      // Main headers (ALL CAPS or ending with colon and all caps)
      if (/^[A-ZČŘŽÝÁÍÉĚŠĎŤŇŮÚ0-9\s\-\(\)„"]+:?$/.test(trimmedLine) && trimmedLine.length > 3 && !trimmedLine.startsWith('•') && !trimmedLine.startsWith('-')) {
        return (
          <h3 key={i} style={{
            color: '#c9a227',
            fontSize: '1.15rem',
            marginTop: '1.5rem',
            marginBottom: '0.75rem',
            fontWeight: '700',
            borderBottom: '1px solid rgba(201,162,39,0.3)',
            paddingBottom: '0.5rem'
          }}>
            {trimmedLine}
          </h3>
        );
      }
      
      // Subheaders with colon
      if (trimmedLine.includes(':') && !trimmedLine.startsWith('•') && !trimmedLine.startsWith('-') && !trimmedLine.startsWith('"') && trimmedLine.split(':')[0].length < 60) {
        const [header, ...rest] = trimmedLine.split(':');
        const restText = rest.join(':');
        if (header && restText) {
          return (
            <p key={i} style={{ marginBottom: '0.5rem', lineHeight: 1.7 }}>
              <strong style={{ color: '#e8c547' }}>{header}:</strong>
              <span style={{ color: '#ccc' }}>{restText}</span>
            </p>
          );
        }
      }
      
      // Bullet points
      if (trimmedLine.startsWith('•')) {
        return (
          <div key={i} style={{
            paddingLeft: '1.5rem',
            marginBottom: '0.5rem',
            position: 'relative',
            lineHeight: 1.7
          }}>
            <span style={{
              position: 'absolute',
              left: '0.5rem',
              color: '#c9a227'
            }}>•</span>
            <span style={{ color: '#ddd' }}>{trimmedLine.substring(1).trim()}</span>
          </div>
        );
      }
      
      // Sub-bullets
      if (trimmedLine.startsWith('-') && !trimmedLine.startsWith('--')) {
        return (
          <div key={i} style={{
            paddingLeft: '2.5rem',
            marginBottom: '0.35rem',
            color: '#aaa',
            fontSize: '0.95rem',
            lineHeight: 1.6
          }}>
            {trimmedLine}
          </div>
        );
      }
      
      // Quote blocks
      if (trimmedLine.startsWith('"') || trimmedLine.startsWith('„')) {
        return (
          <blockquote key={i} style={{
            borderLeft: '3px solid #c9a227',
            paddingLeft: '1rem',
            marginLeft: '0.5rem',
            marginBottom: '0.75rem',
            fontStyle: 'italic',
            color: '#bbb',
            lineHeight: 1.6
          }}>
            {trimmedLine}
          </blockquote>
        );
      }
      
      // Example answer block
      if (trimmedLine.startsWith('PŘÍKLAD ODPOVĚDI:') || trimmedLine.startsWith('PŘÍKLAD SPRÁVNÉ ODPOVĚDI:')) {
        return (
          <div key={i} style={{
            background: 'rgba(76, 175, 80, 0.1)',
            border: '1px solid rgba(76, 175, 80, 0.3)',
            borderRadius: '8px',
            padding: '1rem',
            marginTop: '1rem',
            marginBottom: '1rem'
          }}>
            <h4 style={{ color: '#4CAF50', margin: '0 0 0.5rem 0', fontSize: '1rem' }}>
              ✍️ {trimmedLine.split(':')[0]}
            </h4>
          </div>
        );
      }
      
      // Regular text
      if (trimmedLine) {
        return (
          <p key={i} style={{ marginBottom: '0.75rem', color: '#ddd', lineHeight: 1.7 }}>
            {trimmedLine}
          </p>
        );
      }
      
      return null;
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      fontFamily: "'Crimson Text', Georgia, serif",
      color: '#e8e8e8',
      padding: '0'
    }}>
      {/* Header */}
      <header style={{
        background: 'rgba(0,0,0,0.3)',
        borderBottom: '2px solid #c9a227',
        padding: '1.5rem 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#c9a227',
              margin: 0,
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}>
              📜 Dějepis 2.B
            </h1>
            <p style={{
              fontSize: '0.9rem',
              color: '#888',
              margin: '0.25rem 0 0 0',
              fontStyle: 'italic'
            }}>
              Kolonialismus • Dekolonizace • První světová válka
            </p>
          </div>
          
          <nav style={{ display: 'flex', gap: '0.5rem' }}>
            {[
              { id: 'study', label: '📖 Studium' },
              { id: 'review', label: '⚡ Rychlé opakování' },
              { id: 'quiz', label: '✍️ Kvíz' },
              { id: 'tips', label: '💡 Tipy' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSelectedTopic(null);
                  if (tab.id !== 'quiz') resetQuiz();
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: activeTab === tab.id ? '#c9a227' : 'rgba(255,255,255,0.1)',
                  color: activeTab === tab.id ? '#1a1a2e' : '#e8e8e8',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: '1rem',
                  fontWeight: activeTab === tab.id ? '700' : '400',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem'
      }}>
        
        {/* Study Tab */}
        {activeTab === 'study' && !selectedTopic && (
          <div>
            <div style={{
              background: 'rgba(201, 162, 39, 0.1)',
              border: '1px solid #c9a227',
              borderRadius: '8px',
              padding: '1.5rem',
              marginBottom: '2rem'
            }}>
              <h2 style={{ color: '#c9a227', margin: '0 0 0.5rem 0', fontSize: '1.3rem' }}>
                🎯 Jak se učit na písemku
              </h2>
              <p style={{ margin: 0, lineHeight: 1.6 }}>
                Písemka bude mít <strong>3 otázky</strong> a <strong>45 minut</strong> na odpovědi. 
                Každé téma obsahuje <strong style={{color: '#4CAF50'}}>PŘÍKLAD SPRÁVNÉ ODPOVĚDI</strong> - nauč se strukturu a klíčové body.
                U každé otázky z textu najdeš podrobné vysvětlení i vzorovou odpověď.
              </p>
            </div>

            <h2 style={{ 
              color: '#c9a227', 
              borderBottom: '1px solid rgba(201,162,39,0.3)', 
              paddingBottom: '0.5rem',
              marginBottom: '1.5rem'
            }}>
              Témata k procvičení ({studyData.hlavniOtazky.length})
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '1rem'
            }}>
              {studyData.hlavniOtazky.map((topic, index) => (
                <button
                  key={topic.id}
                  onClick={() => handleTopicSelect(topic)}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(201,162,39,0.3)',
                    borderRadius: '8px',
                    padding: '1.25rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    color: '#e8e8e8',
                    fontFamily: 'inherit'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(201,162,39,0.15)';
                    e.currentTarget.style.borderColor = '#c9a227';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.borderColor = 'rgba(201,162,39,0.3)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem'
                  }}>
                    <span style={{
                      background: '#c9a227',
                      color: '#1a1a2e',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      fontSize: '0.9rem',
                      flexShrink: 0
                    }}>
                      {index + 1}
                    </span>
                    <div>
                      <h3 style={{ 
                        margin: '0 0 0.25rem 0', 
                        fontSize: '1.1rem',
                        color: '#fff',
                        lineHeight: 1.3
                      }}>
                        {topic.title}
                      </h3>
                      <span style={{ 
                        fontSize: '0.85rem', 
                        color: '#c9a227',
                        opacity: 0.8
                      }}>
                        Klikni pro detail →
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Topic Detail */}
        {activeTab === 'study' && selectedTopic && (
          <div>
            <button
              onClick={handleBack}
              style={{
                background: 'rgba(201,162,39,0.2)',
                border: '1px solid #c9a227',
                color: '#c9a227',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '0.9rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              ← Zpět na přehled
            </button>
            
            <div style={{
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '12px',
              padding: '2rem',
              border: '1px solid rgba(201,162,39,0.2)'
            }}>
              <h2 style={{
                color: '#c9a227',
                fontSize: '1.75rem',
                marginTop: 0,
                marginBottom: '1.5rem',
                paddingBottom: '1rem',
                borderBottom: '2px solid rgba(201,162,39,0.3)'
              }}>
                {selectedTopic.title}
              </h2>
              
              {selectedTopic.summary && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(201,162,39,0.15) 0%, rgba(201,162,39,0.05) 100%)',
                  border: '2px solid #c9a227',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  marginBottom: '2rem',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '20px',
                    background: '#1a1a2e',
                    padding: '0 10px',
                    color: '#c9a227',
                    fontWeight: 'bold',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    ⚡ RYCHLÉ SHRNUTÍ
                  </div>
                  <div style={{
                    fontFamily: 'monospace',
                    fontSize: '0.95rem',
                    lineHeight: '1.8',
                    color: '#e8e8e8',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {selectedTopic.summary}
                  </div>
                </div>
              )}
              
              <div style={{
                fontSize: '1.05rem'
              }}>
                {renderContent(selectedTopic.content)}
              </div>
            </div>
          </div>
        )}

        {/* Quick Review Tab */}
        {activeTab === 'review' && (
          <div>
            <div style={{
              textAlign: 'center',
              marginBottom: '2rem'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>⚡</div>
              <h2 style={{ color: '#c9a227', margin: '0 0 0.5rem 0' }}>Rychlé opakování před testem</h2>
              <p style={{ color: '#888', margin: 0 }}>Klíčové body ze všech 11 témat na jednom místě</p>
            </div>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {studyData.hlavniOtazky.map((topic) => (
                <div key={topic.id} style={{
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: '12px',
                  border: '1px solid rgba(201,162,39,0.3)',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(201,162,39,0.2) 0%, rgba(201,162,39,0.05) 100%)',
                    padding: '0.75rem 1.25rem',
                    borderBottom: '1px solid rgba(201,162,39,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    <span style={{
                      background: '#c9a227',
                      color: '#1a1a2e',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '0.85rem',
                      flexShrink: 0
                    }}>
                      {topic.id}
                    </span>
                    <span style={{
                      color: '#c9a227',
                      fontWeight: '600',
                      fontSize: '1rem'
                    }}>
                      {topic.title}
                    </span>
                  </div>
                  <div style={{
                    padding: '1rem 1.25rem',
                    fontFamily: 'monospace',
                    fontSize: '0.9rem',
                    lineHeight: '1.7',
                    color: '#ddd',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {topic.summary}
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{
              marginTop: '2rem',
              padding: '1.5rem',
              background: 'rgba(201,162,39,0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(201,162,39,0.3)',
              textAlign: 'center'
            }}>
              <p style={{ color: '#c9a227', margin: '0 0 1rem 0', fontWeight: 'bold' }}>
                🎯 Připraven na kvíz?
              </p>
              <button
                onClick={() => setActiveTab('quiz')}
                style={{
                  background: '#c9a227',
                  color: '#1a1a2e',
                  border: 'none',
                  padding: '0.75rem 2rem',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Spustit kvíz →
              </button>
            </div>
          </div>
        )}

        {/* Quiz Tab */}
        {activeTab === 'quiz' && (
          <div>
            {!quizStarted ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem'
              }}>
                <div style={{
                  fontSize: '4rem',
                  marginBottom: '1rem'
                }}>✍️</div>
                <h2 style={{ 
                  color: '#c9a227', 
                  fontSize: '2rem',
                  marginBottom: '1rem'
                }}>
                  Procvičovací kvíz
                </h2>
                <p style={{ 
                  color: '#aaa', 
                  marginBottom: '2rem',
                  maxWidth: '500px',
                  margin: '0 auto 2rem'
                }}>
                  {studyData.quizQuestions.length} otázek z kolonialismu, dekolonizace a první světové války. 
                  Otestuj si své znalosti před písemkou!
                </p>
                <button
                  onClick={startQuiz}
                  style={{
                    background: '#c9a227',
                    color: '#1a1a2e',
                    border: 'none',
                    padding: '1rem 3rem',
                    fontSize: '1.2rem',
                    fontWeight: '700',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'transform 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  Začít kvíz →
                </button>
              </div>
            ) : quizFinished ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem'
              }}>
                <div style={{
                  fontSize: '4rem',
                  marginBottom: '1rem'
                }}>
                  {score >= studyData.quizQuestions.length * 0.8 ? '🏆' : 
                   score >= studyData.quizQuestions.length * 0.6 ? '👍' : '📚'}
                </div>
                <h2 style={{ 
                  color: '#c9a227', 
                  fontSize: '2rem',
                  marginBottom: '0.5rem'
                }}>
                  Kvíz dokončen!
                </h2>
                <p style={{
                  fontSize: '3rem',
                  fontWeight: '700',
                  color: score >= studyData.quizQuestions.length * 0.7 ? '#4CAF50' : '#ff9800',
                  margin: '1rem 0'
                }}>
                  {score} / {studyData.quizQuestions.length}
                </p>
                <p style={{ color: '#aaa', marginBottom: '2rem' }}>
                  {score >= studyData.quizQuestions.length * 0.8 
                    ? 'Výborně! Jsi skvěle připraven/a na písemku!' 
                    : score >= studyData.quizQuestions.length * 0.6 
                    ? 'Dobrá práce! Ještě trochu procvič slabší témata.'
                    : 'Doporučuji se ještě učit. Projdi si témata znovu.'}
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    onClick={resetQuiz}
                    style={{
                      background: 'transparent',
                      color: '#c9a227',
                      border: '2px solid #c9a227',
                      padding: '0.75rem 2rem',
                      fontSize: '1rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontFamily: 'inherit'
                    }}
                  >
                    Zkusit znovu
                  </button>
                  <button
                    onClick={() => { setActiveTab('study'); resetQuiz(); }}
                    style={{
                      background: '#c9a227',
                      color: '#1a1a2e',
                      border: 'none',
                      padding: '0.75rem 2rem',
                      fontSize: '1rem',
                      fontWeight: '700',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontFamily: 'inherit'
                    }}
                  >
                    Zpět ke studiu
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {/* Progress */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.5rem'
                }}>
                  <span style={{ color: '#888' }}>
                    Otázka {currentQuestion + 1} z {studyData.quizQuestions.length}
                  </span>
                  <span style={{ color: '#c9a227', fontWeight: '700' }}>
                    Skóre: {score}
                  </span>
                </div>
                
                <div style={{
                  height: '6px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '3px',
                  marginBottom: '2rem',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${((currentQuestion + 1) / studyData.quizQuestions.length) * 100}%`,
                    background: '#c9a227',
                    transition: 'width 0.3s ease'
                  }} />
                </div>

                {/* Question */}
                <div style={{
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: '12px',
                  padding: '2rem',
                  border: '1px solid rgba(201,162,39,0.2)'
                }}>
                  <h3 style={{
                    color: '#fff',
                    fontSize: '1.3rem',
                    marginTop: 0,
                    marginBottom: '1.5rem',
                    lineHeight: 1.5
                  }}>
                    {studyData.quizQuestions[currentQuestion].question}
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {studyData.quizQuestions[currentQuestion].options.map((option, index) => {
                      const isSelected = selectedAnswer === index;
                      const isCorrect = index === studyData.quizQuestions[currentQuestion].correct;
                      
                      let bgColor = 'rgba(255,255,255,0.05)';
                      let borderColor = 'rgba(255,255,255,0.1)';
                      
                      if (showResult) {
                        if (isCorrect) {
                          bgColor = 'rgba(76, 175, 80, 0.2)';
                          borderColor = '#4CAF50';
                        } else if (isSelected && !isCorrect) {
                          bgColor = 'rgba(244, 67, 54, 0.2)';
                          borderColor = '#f44336';
                        }
                      } else if (isSelected) {
                        bgColor = 'rgba(201,162,39,0.2)';
                        borderColor = '#c9a227';
                      }

                      return (
                        <button
                          key={index}
                          onClick={() => handleAnswer(index)}
                          disabled={showResult}
                          style={{
                            background: bgColor,
                            border: `2px solid ${borderColor}`,
                            borderRadius: '8px',
                            padding: '1rem 1.25rem',
                            textAlign: 'left',
                            cursor: showResult ? 'default' : 'pointer',
                            color: '#e8e8e8',
                            fontFamily: 'inherit',
                            fontSize: '1rem',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem'
                          }}
                        >
                          <span style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: showResult && isCorrect ? '#4CAF50' : 
                                        showResult && isSelected ? '#f44336' : 
                                        'rgba(255,255,255,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.85rem',
                            fontWeight: '700',
                            flexShrink: 0
                          }}>
                            {showResult && isCorrect ? '✓' : 
                             showResult && isSelected && !isCorrect ? '✗' : 
                             String.fromCharCode(65 + index)}
                          </span>
                          {option}
                        </button>
                      );
                    })}
                  </div>

                  {showResult && (
                    <div style={{
                      marginTop: '1.5rem',
                      padding: '1rem',
                      background: 'rgba(201,162,39,0.1)',
                      borderRadius: '8px',
                      borderLeft: '4px solid #c9a227'
                    }}>
                      <p style={{ margin: 0, color: '#ccc', lineHeight: 1.6 }}>
                        <strong style={{ color: '#c9a227' }}>Vysvětlení:</strong>{' '}
                        {studyData.quizQuestions[currentQuestion].explanation}
                      </p>
                    </div>
                  )}

                  {showResult && (
                    <button
                      onClick={nextQuestion}
                      style={{
                        marginTop: '1.5rem',
                        background: '#c9a227',
                        color: '#1a1a2e',
                        border: 'none',
                        padding: '0.75rem 2rem',
                        fontSize: '1rem',
                        fontWeight: '700',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        width: '100%'
                      }}
                    >
                      {currentQuestion < studyData.quizQuestions.length - 1 
                        ? 'Další otázka →' 
                        : 'Zobrazit výsledky'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tips Tab */}
        {activeTab === 'tips' && (
          <div>
            <h2 style={{ 
              color: '#c9a227', 
              borderBottom: '1px solid rgba(201,162,39,0.3)', 
              paddingBottom: '0.5rem',
              marginTop: 0
            }}>
              💡 Tipy pro písemku
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {[
                {
                  icon: '📝',
                  title: 'Struktura odpovědi',
                  content: 'Každou odpověď rozděl na jasné části: úvod (o čem budeš psát), hlavní body s konkrétními fakty, a závěr s důsledky nebo hodnocením. Používej odstavce! Podívej se na PŘÍKLADY ODPOVĚDÍ v každém tématu.'
                },
                {
                  icon: '📅',
                  title: 'Klíčová data',
                  content: '1884-85 (Berlínská konference), 1908 (Bosenská krize), 28.6.1914 (atentát), 1917 (vstup USA, ruské revoluce), 1918 (konec války, vznik ČSR), 1919 (Versailles), 1920 (Společnost národů), 1960 (Rok Afriky), 1994 (volby JAR).'
                },
                {
                  icon: '👤',
                  title: 'Klíčové osobnosti',
                  content: 'Leopold II., Hochschild, Bismarck, Wilson, Clemenceau, František Ferdinand, Gavrilo Princip, Clark, Nkrumah, Mandela, Lumumba, Mengistu, Tito, Násir, Nehrú.'
                },
                {
                  icon: '🔗',
                  title: 'Propojuj témata',
                  content: 'Ukaž souvislosti: Kolonialismus → Dekolonizace → Studená válka v Africe. Nebo: Nacionalismus + Aliance + Balkán → WWI → Versailles → Nacismus → WWII.'
                },
                {
                  icon: '📚',
                  title: 'Cituj z textů',
                  content: 'Použij citáty: "Podle Clarka byli politici náměsíčníky...", "Cameron ukazuje, že ekonomické důvody selhaly...", "Hochschild odhalil, že v Kongu zahynulo 5-10 milionů lidí..."'
                },
                {
                  icon: '⚖️',
                  title: 'Různé pohledy',
                  content: 'U kontroverzních témat uveď více interpretací: "Marxisté tvrdí, že imperialismus byl ekonomický, ale Cameron dokazuje, že šlo hlavně o prestiž a nacionalismus."'
                },
                {
                  icon: '🎯',
                  title: 'Konkrétní příklady',
                  content: 'Místo "kolonie byly brutální" piš "v belgickém Kongu policisté sekali ruce dětem za nesplnění norem na kaučuk, počet obětí se odhaduje na 5-10 milionů".'
                },
                {
                  icon: '⏱️',
                  title: 'Rozložení času',
                  content: '45 minut na 3 otázky = cca 15 minut na otázku. Začni tou, kterou umíš nejlépe. Nech si 5 minut na kontrolu. I částečná odpověď je lepší než nic!'
                }
              ].map((tip, i) => (
                <div key={i} style={{
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  border: '1px solid rgba(201,162,39,0.2)',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'flex-start'
                }}>
                  <span style={{ fontSize: '2rem' }}>{tip.icon}</span>
                  <div>
                    <h3 style={{ color: '#c9a227', margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
                      {tip.title}
                    </h3>
                    <p style={{ margin: 0, color: '#bbb', lineHeight: 1.6 }}>
                      {tip.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: '2rem',
              background: 'rgba(201, 162, 39, 0.15)',
              border: '2px solid #c9a227',
              borderRadius: '12px',
              padding: '1.5rem'
            }}>
              <h3 style={{ color: '#c9a227', margin: '0 0 1rem 0' }}>
                🏆 Chronologický přehled
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '0.75rem'
              }}>
                {[
                  '1870 – Prusko-francouzská válka (revanche)',
                  '1879 – Dvojspolek (Německo + R-U)',
                  '1882 – Trojspolek (+ Itálie)',
                  '1884-85 – Berlínská konference',
                  '1894 – Dvojdohoda (Francie + Rusko)',
                  '1907 – Trojdohoda (+ Británie)',
                  '1908 – Bosenská krize (anexe)',
                  '1912-13 – Balkánské války',
                  '28.6.1914 – Atentát v Sarajevu',
                  '1915 – Itálie mění stranu, bojové plyny',
                  '1916 – Verdun, Somma (tanky)',
                  '1917 – Vstup USA, ruské revoluce',
                  '3.3.1918 – Brestlitevský mír',
                  '9.11.1918 – Abdikace Viléma II., revoluce',
                  '28.10.1918 – Vznik Československa',
                  '11.11.1918 – Příměří (konec WWI)',
                  '1919 – Kominterna, Spartakovci, Versailles',
                  '1920 – Společnost národů, Kappův puč',
                  '1922 – Rapallo (Německo + SSSR)',
                  '1923 – Hyperinflace, pivní puč',
                  '1924 – Dawesův plán',
                  '1925 – Locarnské smlouvy',
                  '1926 – Německo v SN',
                  '1928 – Briand-Kelloggův pakt',
                  '1929 – Krach na burze, Velká krize',
                  '30.1.1933 – Hitler kancléřem (konec Výmaru)',
                  '1955 – Bandung (nezúčastnění)',
                  '1960 – Rok Afriky',
                  '1962 – Nezávislost Alžírska',
                  '1975 – Angola, Mosambik',
                  '1991 – Konec studené války',
                  '1994 – Volby v JAR (Mandela)',
                  '1998 – Hochschildova kniha o Kongu'
                ].map((item, i) => (
                  <div key={i} style={{
                    background: 'rgba(0,0,0,0.3)',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '4px',
                    fontSize: '0.9rem',
                    color: '#ddd'
                  }}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '2rem',
        color: '#666',
        fontSize: '0.85rem',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        marginTop: '2rem'
      }}>
        Studijní aplikace pro 2.B • Kolonialismus, Dekolonizace, WWI, Výmarská republika, Třetí říše
      </footer>
    </div>
  );
}
