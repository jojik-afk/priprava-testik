// @title Dějepis - 2. světová válka (1939–1945)
// @subject History
// @topic 2. světová válka, fronty, Velká trojka, šoa, Polsko, Jugoslávie
// @template practice

import React, { useState } from 'react';

const studyData = {
  hlavniOtazky: [
    {
      id: 1,
      title: "TEXT: Když národy nemají šanci (Pakt tří a vztahy Německo–SSSR)",
      summary: `🔑 PAKT TŘÍ: 27.9.1940 Berlín (Německo, Itálie, Japonsko) → osa Berlín–Řím–Tokio
🔑 SSSR: jednání o přistoupení (Molotov v Berlíně 12.–14.11.1940), návrh 4. člena „osy"
🔑 ROZKOL: zájmy se křížily (Finsko, Balkán, Bukovina) → Hitler ztratil zájem
🔑 BARBAROSSA: 22.6.1941 útok na SSSR (+ Maďarsko, Rumunsko, Slovensko, Finsko)
🔑 OKUPACE: Reichskommissariaty, zklamání národů, „rudí" vs. UPA vs. AK, Katyň 1943`,
      content: `
PAKT TŘÍ A „OSA" BERLÍN–ŘÍM–TOKIO:
• 27. září 1940 byl v Berlíně podepsán tzv. Pakt tří mezi Německem, Itálií a Japonskem – rozděloval sféry vlivu ve světě
• Japonsko uznávalo vedoucí roli Německa a Itálie v Evropě, Německo a Itálie zase vedoucí roli Japonska ve východní Asii
• Podle článku 5 pakt neměl vliv na vztahy signatářů k SSSR → otevřená otázka, zda se SSSR připojí jako čtvrtá mocnost
• K paktu později přistoupili spojenci Německa: Maďarsko (20.11.1940), Rumunsko (23.11.1940), Slovensko (24.11.1940)

JEDNÁNÍ O PŘISTOUPENÍ SSSR:
• Hitler už 31.7.1940 vydal pokyn zpracovat plány útoku na SSSR, ale zatím se nevzdával myšlenky jeho připojení k paktu
• Sondáže vyvrcholily návštěvou sovětského ministra zahraničí Vjačeslava Molotova v Berlíně (12.–14.11.1940)
• Molotov jednal s Ribbentropem i osobně s Hitlerem
• 13.11.1940 předložen návrh smlouvy: SSSR by se stal čtvrtým členem „osy", trojstranný pakt by se změnil ve čtyřstranný (s tajným dodatkem o rozdělení sfér vlivu)
• Hitler se Molotova snažil přesvědčit, aby SSSR zaměřil expanzi jižním směrem – do Íránu, případně do Indie

PROČ JIH? A PROČ TO ZKRACHOVALO:
• Důvod usměrnění sovětské expanze na jih byl jasný: oslabit britské impérium, tehdy jediného efektivního protivníka Německa
• Sověti ale chtěli zůstat evropskou mocností a nehodlali se vzdát pronikání na Balkán → Molotov se konečné odpovědi vyhýbal
• Třecí body: anexe severní Bukoviny SSSR (nebyla v tajném protokolu z 23.8.1939), přítomnost německých vojsk ve Finsku
• Sovětský protinávrh (25.11.1940): ochota vstoupit za podmínek (vliv v Bulharsku, sféra vlivu zahrnující Írán a Irák)
• Hitler se už definitivně rozhodl k válce proti SSSR a o přistoupení ztratil zájem

OPERACE BARBAROSSA A OKUPAČNÍ SPRÁVA:
• 22. června 1941 Německo bez vypovězení války zaútočilo na SSSR
• Připojily se Maďarsko, Rumunsko, Slovensko a Finsko (formálně člen paktu nebylo, ale chovalo se jako německý spojenec)
• Motivy Finska a Rumunska: získat zpět území ztracená v roce 1940; ve válce ale pokračovaly i po splnění tohoto cíle → agresivní, neospravedlnitelná válka
• Obyvatelstvo západní Ukrajiny, západního Běloruska a Pobaltí často vítalo Němce jako osvoboditele od bolševiků a doufalo v obnovu národní státnosti – velmi se zklamalo
• Když Organizace ukrajinských nacionalistů 30.6.1941 vyhlásila ve Lvově samostatnost Ukrajiny, byli protagonisté zatčeni a posláni do koncentračního tábora
• Správa: Reichskommissariat Ostland (Pobaltí + záp. Bělorusko, centrum Riga), Říšský komisariát Ukrajina (centrum Rivné), východní Halič připojena ke Generálnímu gouvernementu
• Teror: vyhubení Židů (často za pomoci místních kolaborantů), rekvírování potravin, nucené práce – nejhůře na Ukrajině

POVSTALECKÝ CHAOS A POLSKÁ OTÁZKA:
• Bezvýchodná situace národů: spolupráce s Němci = teror + diskreditace u Spojenců; boj proti Němcům = přiblížení návratu SSSR
• Proti sobě bojovali „rudí" partyzáni, oddíly za samostatnost a kolaborantské jednotky
• Na západní Ukrajině a Volyni navíc UPA (Ukrajinská povstalecká armáda) a polská Armija krajowa (AK) podřízená londýnské vládě
• Dohoda Sikorski–Majskij (30.7.1941): spojenecká smlouva Polska se SSSR, otázka hranic ponechána otevřená
• Katyň (duben 1943): odhalen masový hrob polských důstojníků → polská vláda požádala Červený kříž o vyšetření → SSSR přerušil styky a ustavil „vlastní" prosovětskou polskou vládu (1944)
• Zodpovědnost NKVD za katyňský masakr přiznal SSSR teprve v roce 1990

OTÁZKY K TEXTU (OTAZ) – VZOROVÉ ODPOVĚDI:

OTÁZKA 1: Co to byl Pakt tří a jakou roli v něm hrál SSSR?
• Pakt tří: 27.9.1940 v Berlíně (Německo, Itálie, Japonsko) – rozdělení sfér vlivu ve světě
• Přistoupili Maďarsko, Rumunsko, Slovensko
• SSSR: jednání o přistoupení (Molotov 12.–14.11.1940), návrh stát se 4. členem osy, sovětský protinávrh (25.11.1940) – Hitler ztratil zájem a rozhodl se pro válku

OTÁZKA 2: Které země byly sporné pro obě totalitní mocnosti?
• Finsko (sbližovalo se s Německem, tajná dohoda 12.9.1940)
• Bulharsko a Jugoslávie (Balkán – obě mocnosti chtěly pozice)
• Severní Bukovina (anexe SSSR, proti které Ribbentrop protestoval)

OTÁZKA 3: Kam měla podle Německa směřovat expanze SSSR?
• Jižním směrem – do Íránu, případně Indie (místo na Balkán)
• Cíl: oslabit britské impérium
• SSSR ale chtěl zůstat evropskou mocností a Balkánu se vzdát nehodlal

OTÁZKA 4: Proč se „spojenci" připojili k útoku na SSSR?
• Finsko a Rumunsko: získat zpět území ztracená v roce 1940 (Finsko později i východní Karélie, Rumunsko severní Sedmihradsko)
• Maďarsko a Slovensko: jako spojenci Německa
• Pokračováním po splnění cílů se zapojily do neospravedlnitelné agresivní války

OTÁZKA 5: Jaký byl vztah nacistické správy a místního obyvatelstva?
• Zpočátku vítání jako osvoboditelé, naděje na vlastní státnost → zklamání (zatýkání, odmítnutí státnosti)
• Reichskommissariaty (Ostland – Riga, Ukrajina – Rivné), teror, vyhlazování Židů, nucené práce
• Bezvýchodná situace: spolupráce = teror; odpor = návrat SSSR

OTÁZKA 6: Jaké ozbrojené složky působily v regionech?
• „Rudí" partyzáni (za sovětskou moc)
• Oddíly za samostatnost (proti Němcům i „rudým")
• Kolaborantské jednotky (na straně Němců)
• Na záp. Ukrajině navíc UPA a polská Armija krajowa (AK)

OTÁZKA 7: V čem bylo specifické postavení Poláků?
• Dohoda Sikorski–Majskij (30.7.1941), otázka hranic otevřená
• Katyň (1943) → SSSR přerušil styky, ustavil prosovětskou polskou vládu (1944)
• Západní spojenci se za předválečné polské hranice odmítli angažovat

OTÁZKA 8: Jaké narativy používá kremelská propaganda?
• „Velká vlastenecká válka" 1941–1945 uměle vytržená z kontextu celé WWII
• Role SSSR líčena jako výhradně pozitivní, Katyň svalena na Němce
• Rozpad SSSR (1991) prý dílo „rusofobie" a Západu – ve skutečnosti přirozený proces po diskreditaci komunismu

PŘÍKLAD SPRÁVNÉ ODPOVĚDI:
"V průběhu roku 1940 spolu nacistické Německo a SSSR formálně stále spolupracovaly, ale jejich zájmy se začaly křížit. 27. září 1940 vznikl Pakt tří (Německo, Itálie, Japonsko) – osa Berlín–Řím–Tokio – a otevřela se otázka, zda se připojí i SSSR. Při Molotovově návštěvě Berlína (12.–14. listopadu 1940) Hitler nabízel Sovětům členství ve čtyřstranném paktu, ale snažil se jejich expanzi odklonit na jih (Írán, Indie), aby oslabil Británii. Sověti ale chtěli zůstat evropskou mocností a Balkánu se vzdát nehodlali; spory vyvolávaly i Finsko a anexe severní Bukoviny. Hitler proto ztratil zájem a 22. června 1941 zahájil operaci Barbarossa, k níž se připojily Maďarsko, Rumunsko, Slovensko a Finsko. Národy západní Ukrajiny, Běloruska a Pobaltí zprvu vítaly Němce jako osvoboditele od bolševiků, ale brzy se zklamaly – Německo odmítlo jejich státnost, zřídilo Reichskommissariaty a rozpoutalo teror i vyvražďování Židů. Vznikla bezvýchodná situace, v níž proti sobě bojovali 'rudí' partyzáni, oddíly za samostatnost (UPA) i kolaboranti, na Volyni navíc polská Armija krajowa. Specifické bylo postavení Poláků: dohoda Sikorski–Majskij (1941) nechala hranice otevřené, ale po odhalení katyňského masakru (1943) SSSR přerušil styky s londýnskou vládou a ustavil vlastní prosovětskou vládu. Text tak ukazuje, že role SSSR byla rozporná a že kremelská propaganda dodnes pracuje s mýtem 'Velké vlastenecké války'."
      `
    },
    {
      id: 2,
      title: "Válečné fronty a operace 1939–1943",
      summary: `🔑 ZAČÁTEK: 1.9.1939 přepadení Polska (blitzkrieg), 3.9. VB+FR „podivná válka", 17.9. SSSR z východu
🔑 1940: Dánsko, Norsko (Narvik), Benelux; útok přes Ardeny → Dunkerque (338 256 evakuováno), pád Francie 22.6.
🔑 BITVA O ANGLII (VII–X/1940): RAF × Luftwaffe; čs. + polští letci; Londýn 40 000 mrtvých
🔑 BARBAROSSA: 22.6.1941 útok na SSSR; bitva o Moskvu (zima 1941) = první velký neúspěch
🔑 ZLOM 1942–43: Pearl Harbor (7.12.1941) → USA; Midway, El Alamein, Stalingrad (2.2.1943)`,
      content: `
ROZPOUTÁNÍ VÁLKY (1939):
• 1.9.1939: Německo přepadlo Polsko (záminka – inscenovaný přepad vysílačky v Glivicích) – nasazení taktiky blitzkrieg (bleskové války: tanky + letectvo + rychlý postup)
• 3.9.1939: Velká Británie a Francie vyhlásily Německu válku → následovala „podivná válka" (Sitzkrieg) – Spojenci na západní frontě nezahájili ofenzivu
• 17.9.1939: SSSR podle paktu Ribbentrop–Molotov obsadil východní Polsko → Polsko padlo za 4 týdny a bylo rozděleno
• Listopad 1939 – březen 1940: SSSR napadl Finsko (zimní válka) – Finové kladli statečný odpor

NĚMECKÝ PLÁN ÚTOKU NA ZÁPADĚ:
• Duben 1940: obsazení Dánska a Norska (přístav Narvik) – přístup k surovinám a základnám (operace Weserübung)
• Po vymazání Polska z mapy a obsazení Dánska a Norska obrátil Hitler pozornost a vojenskou sílu na západ
• 10.5.1940: útok na Benelux a Francii – Nizozemsko, Belgie, Lucembursko, Francie
• Francouzi počítali s německým útokem přes Belgii nebo Maginotovu linii – Němci však prošli přes „neprostupné" Ardeny (generál Guderian) a za pár dní pronikli do spojeneckého týla

ÚSTUP K DUNKERQUE (KVĚTEN–ČERVEN 1940):
• 27. května kapitulovala Belgie; oslabení Spojenci přesto bránili svůj ústup – v obranném perimetru se tísnilo na 360 000 vojáků a 250 000 civilistů
• První záchranná flotila (27.5.) čítala asi 40 plavidel všech druhů (torpédoborce, minolovky, šalupy aj.)
• Dunkerque padl 4. června – na plážích zůstalo necelých 40 000 vojáků
• Celkem se podařilo do Británie dostat 338 256 vojáků (z toho asi 139 tisíc Francouzů a Belgičanů); zachránění muži BEF se stali základem britské armády

PÁD FRANCIE A NÁSTUP CHURCHILLA:
• 22.6.1940: kapitulace Francie (podepsána ve stejném vagonu jako 1918) – sever okupován, na jihu kolaborantský režim ve Vichy (maršál Philippe Pétain, 1856–1951)
• Odpor vede z Londýna generál Charles de Gaulle (1890–1970) – Svobodní Francouzi
• 10.5.1940 se novým premiérem Velké Británie stal Winston Churchill: „Mohu vám slíbit pouze krev, pot a slzy." (jeho předchůdce: Neville Chamberlain)

BITVA O ANGLII (ČERVENEC–ŘÍJEN 1940):
• Luftwaffe (988 středních bombardérů) vs. RAF (678 stíhaček schopných nasazení – 353 Hawker Hurricane, 226 Spitfirů)
• Ztráty RAF: 1023 zničených stíhaček a 544 padlých pilotů; ztráty Luftwaffe: 1887 letadel a 2662 členů osádek
• Bojovalo zde cca 90 čs. pilotů + cca 200 Poláků aj. – Josef František: 17 sestřelů
• Němci nezískali vzdušnou převahu → Hitler odložil (a nakonec zrušil) invazi (operace Lvoun / Seelöwe)
• Londýn 1940–45: na 40 000 zabitých civilistů (nálety, později rakety V-1 a V-2)

ROZŠÍŘENÍ KONFLIKTU (1940–41):
• Severní Afrika: italská ofenziva selhala → na pomoc poslán německý Afrikakorps (Erwin Rommel)
• Balkán (jaro 1941): Německo obsadilo Jugoslávii, Krétu a Řecko, aby zajistilo jižní křídlo před útokem na SSSR
• Atlantik: konvoje a ponorková válka (bitva o Atlantik); Dálný východ: Čína, Malajsie, Indočína

OPERACE BARBAROSSA (1941):
• 22.6.1941: největší pozemní operace dějin – útok na SSSR ve třech směrech (Leningrad, Moskva, Ukrajina/Kavkaz)
• Zpočátku obrovské sovětské ztráty a německý postup
• Bitva o Moskvu (podzim/zima 1941): Němci zastaveni před Moskvou – první velký neúspěch blitzkriegu (mráz, sovětské zálohy ze Sibiře)

VÁLKA SE STÁVÁ SVĚTOVOU:
• 7.12.1941: Japonsko přepadlo americkou základnu Pearl Harbor (Havaj) → USA vstoupily do války
• Německo a Itálie vyhlásily válku USA (11.12.1941)
• Japonsko rychle obsadilo velkou část jihovýchodní Asie a Pacifiku

ZLOM VÁLKY (1942–1943):
• Midway (červen 1942): americké vítězství zastavilo japonskou expanzi v Tichomoří (zlom v Pacifiku)
• El Alamein (říjen–listopad 1942): britské vítězství (Montgomery) nad Rommelem v severní Africe
• Stalingrad (srpen 1942 – 2.2.1943): obklíčení a kapitulace německé 6. armády (Paulus) – rozhodující zlom na východní frontě, přechod iniciativy k SSSR

PŘÍKLAD SPRÁVNÉ ODPOVĚDI:
"Druhá světová válka začala 1. září 1939 přepadením Polska, které Německo dobylo bleskovou válkou (blitzkrieg); po vyhlášení války Brity a Francouzi (3.9.) následovala 'podivná válka' a 17. září vpadl podle paktu Ribbentrop–Molotov i SSSR. Na jaře 1940 Německo obsadilo Dánsko a Norsko a 10. května udeřilo na západě – přes 'neprostupné' Ardeny prorazilo do týla Spojenců, kteří se museli evakuovat z Dunkerque (zachráněno 338 256 mužů). 22. června kapitulovala Francie (jih ovládl Pétainův režim ve Vichy, odpor vedl z Londýna de Gaulle) a premiérem Británie se stal Churchill. V bitvě o Anglii (červenec–říjen 1940) ale Luftwaffe nezískala vzdušnou převahu nad RAF – vyznamenali se i českoslovenští a polští letci – a Hitler invazi odpískal. 22. června 1941 zahájil operaci Barbarossa proti SSSR; první velký neúspěch přišel v bitvě o Moskvu (zima 1941). Válka se stala světovou 7. prosince 1941, kdy Japonsko přepadlo Pearl Harbor a do války vstoupily USA. Zlom nastal v letech 1942–43: u Midway (červen 1942), u El Alameinu (listopad 1942) a především u Stalingradu (kapitulace 2. února 1943), čímž iniciativa přešla ke spojencům."
      `
    },
    {
      id: 3,
      title: "Válečné fronty a operace 1943–1945",
      summary: `🔑 KURSK (VII/1943): největší tanková bitva, iniciativa definitivně u SSSR
🔑 ITÁLIE: Sicílie (VII/1943), pád Mussoliniho, kapitulace (IX/1943), Monte Cassino, Saló; Mussolini † 28.4.1945
🔑 NORMANDIE: 6.6.1944 (Overlord); Valkýra (20.7.1944); osvobození Paříže (VIII/1944)
🔑 POVSTÁNÍ 1944: Paříž, Varšava, SNP (29.8.); Ardeny (XII/1944) = poslední něm. ofenziva
🔑 KONEC: Drážďany (II/1945), setkání na Labi, Berlín, Hitler † 30.4.; kapitulace 8.5.1945; Hirošima/Nagasaki, Japonsko 2.9.1945`,
      content: `
VÝCHODNÍ FRONTA – SOVĚTSKÝ POSTUP:
• Bitva u Kurska (červenec 1943): největší tanková bitva dějin; Hitler musel přerušit postup kvůli přesunu jednotek na Sicílii → iniciativa definitivně přešla k Rudé armádě
• Operace Bagration (léto 1944): zničení německé skupiny armád Střed, rychlý postup Rudé armády na západ

ITÁLIE – „MĚKKÉ PODBŘIŠÍ EVROPY":
• Červenec 1943: vylodění Spojenců na Sicílii a pomalý postup na sever
• Puč proti Mussolinimu (červenec 1943), pozdější kapitulace Itálie (září 1943) a přechod ke Spojencům
• Němci ale obsadili sever – boje pokračovaly (Monte Cassino 1944)
• Mussolini internován a osvobozen Němci → loutková Italská sociální republika (Saló) + Němci; partyzánská aktivita a represe
• Pokus o útěk do Švýcarska a Mussoliniho smrt 28.4.1945

ZÁPADNÍ FRONTA – DEN D (OPERACE OVERLORD):
• 6.6.1944: vylodění v Normandii – největší invaze všech dob; otevření plnohodnotné fronty v západní Evropě
• Vrchní velitel expedičních vojsk: generál Eisenhower; velitel pozemních vojsk: generál Montgomery
• Pobřeží Francie střežilo 38 německých divizí × 20 amerických, 3 kanadské, 14 britských, francouzská a 1 polská divize
• 11 000 letounů, přes 5000 dopravních letounů (vč. kluzáků), přes 6000 plavidel
• Během prvního dne se vylodilo přes 150 000 lidí (za 14 dní přes 600 000); padlo asi 9500 vojáků (pláže Omaha a Utah)
• Srpen 1944: osvobození Paříže; postup Spojenců k německým hranicím

POVSTÁNÍ A ATENTÁT (1944):
• 20. července 1944: pokus o převrat – operace „Valkýra", atentát na Hitlera ve „Vlčím doupěti" (von Stauffenberg) – neúspěšný
• Srpen 1944: povstání v Paříži, ve Varšavě a Slovenské národní povstání (SNP, 29.8.)
• Karpatsko-dukelská operace (září 1944)
• Ardenská ofenziva (prosinec 1944 – leden 1945): poslední velká německá ofenziva na západě – neúspěšná (ztráty USA a UK i Wehrmachtu v desetitisících)

ZÁVĚR VÁLKY V EVROPĚ (1945):
• Únor 1945: Jaltská konference (viz téma 4)
• 27. ledna 1945: osvobození Osvětimi Rudou armádou
• Únor 1945: bombardování Drážďan – 805 bombardérů, 2660 tun pum (45 % zápalných), 18 000–35 000 mrtvých; 14.2.1945 i nálet na Prahu (700 mrtvých)
• Duben 1945: setkání Spojenců a Rudé armády na Labi (Torgau, 25.4.); bitva o Berlín; 30.4.1945 Hitler spáchal sebevraždu
• Pražské povstání (5.–9.5.1945)
• 8.5.1945 (v Moskvě 9.5.): bezpodmínečná kapitulace Německa – konec války v Evropě

PORÁŽKA JAPONSKA:
• Pacifik: americká taktika „přeskakování ostrovů" (Iwo Džima, Okinawa) za cenu těžkých ztrát
• 6.8.1945: svržení atomové bomby na Hirošimu (90 000–166 000 obětí); 9.8.1945 na Nagasaki (60 000–80 000) – polovina obětí v první den
• 8.8.1945: SSSR vyhlásil válku Japonsku a vpadl do Mandžuska
• 2.9.1945: kapitulace Japonska (na palubě USS Missouri) – konec 2. světové války

PŘÍKLAD SPRÁVNÉ ODPOVĚDI:
"V letech 1943–45 přešli spojenci do ofenzivy na všech frontách. Na východě sovětské vítězství u Kurska (červenec 1943), největší tankové bitvě dějin, definitivně přeneslo iniciativu na Rudou armádu, která operací Bagration (1944) postupovala na západ. Spojenci se v červenci 1943 vylodili na Sicílii, padl Mussolini a Itálie kapitulovala, byť Němci obsadili sever (Monte Cassino, republika Saló). Klíčovým okamžikem bylo vylodění v Normandii 6. června 1944 (operace Overlord) pod velením Eisenhowera a Montgomeryho – největší invaze dějin a osvobození Paříže. Proběhla povstání (Paříž, Varšava, SNP) i neúspěšný atentát na Hitlera (Valkýra, 20.7.1944) a poslední německá ofenziva v Ardenách (zima 1944/45) selhala. Po Jaltě následovalo bombardování Drážďan, setkání na Labi, bitva o Berlín, 30. dubna 1945 Hitlerova sebevražda a 8. května (v Moskvě 9. května) kapitulace Německa. V Pacifiku ukončily válku atomové bomby na Hirošimu a Nagasaki (6. a 9. srpna 1945) spolu se vstupem SSSR; Japonsko kapitulovalo 2. září 1945, čímž skončila druhá světová válka."
      `
    },
    {
      id: 4,
      title: "Velká trojka + TEXT: Jaltská konference a její mýtus (Smetana)",
      summary: `🔑 OSOBNOSTI: Roosevelt (USA), Churchill (VB), Stalin (SSSR); ministři: Molotov, Byrnes, Eden→Bevin
🔑 PŘEDPOKLADY: Atlantická charta (VIII/1941), Velká aliance, deklarace 26 států (I/1942)
🔑 KONFERENCE: Casablanca (I/1943), Teherán (XI–XII/1943), Jalta (II/1945), Postupim (VII–VIII/1945)
🔑 JALTA: okupační zóny, zóna pro Francii, OSN, vstup SSSR proti Japonsku, Polsko, Deklarace o osvobozené Evropě
🔑 MÝTUS: Jalta NEROZDĚLILA sféry vlivu; ČSR do sovětské sféry vstoupila dobrovolně (smlouva XII/1943)`,
      content: `
VELKÁ TROJKA – KDO BYL KDO:
• Winston Churchill (VB): kritik politiky appeasementu; 1940–1945 válečný premiér; mobilizace armády, zvláště letectva; britská sféra vlivu v Evropě = Balkán (Řecko)
• Franklin D. Roosevelt (USA): prezident 1933–1945; podpora Francie a VB, 1941 prosadil v Kongresu zákon o půjčce a pronájmu (lend-lease); po Pearl Harboru aktivní vedení války; priorita = vést válku v Evropě
• J. V. Stalin (SSSR): od roku 1941 žádá spojence o vytvoření druhé fronty (odlehčení Rudé armádě); do roku 1943 nejsou anglo-američtí spojenci připraveni vyhovět; požadavek sílí po obratu ve válce
• Klíčoví ministři zahraničí (na nich ležela hlavní tíha jednání): sovětský Vjačeslav Molotov (úporný vyjednávač), americký James Byrnes, britský Anthony Eden (později nahrazen Ernestem Bevinem)

PŘEDPOKLADY PRO VZNIK VELKÉ TROJKY:
• Srpen 1941: Roosevelt a Churchill podepsali Atlantickou chartu (formulace válečných cílů)
• Září 1941: Atlantickou chartu podepsal i Stalin → vznik protifašistické koalice (tzv. Velká aliance)
• Leden 1942: 26 států podepsalo deklaraci – závazek boje proti státům Osy a neuzavírání separátního míru
• Počáteční nedůvěra: Churchill se obával Stalinových expanzivních záměrů; Roosevelt podezíral Stalina ze šíření komunismu; Stalin se obával potlačení komunismu i ztráty územních zisků

KONFERENCE VELKÉ TROJKY:
• Casablanca (leden 1943): jen Roosevelt a Churchill (Stalin odmítl kvůli operacím na území SSSR); otevření druhé fronty zatím odloženo, dohoda o vylodění na Sicílii
• Teherán (28.11.–1.12.1943): první schůzka Velké trojky; dohoda o otevření druhé fronty v SZ Francii na jaře 1944; Churchill prosazoval invazi na Balkáně (předstih před Sověty); o Curzonově linii jako budoucí hranici Polska; rozhodnutí o druhé frontě považoval Stalin za své vítězství
• Jalta (4.–11.2.1945, Krym): druhá konference Velké trojky – klíčové uspořádání poválečné Evropy
• Postupim (17.7.–2.8.1945, zámek Cecilienhof): poslední konference; změna složení – za USA Harry Truman (Roosevelt zemřel v dubnu 1945), za VB Churchill, v průběhu nahrazen labouristou Clementem Attleem (porážka ve volbách), za SSSR Stalin

VÝSLEDKY JALTY:
• Vznik okupačních zón v Německu; Churchill prosadil samostatnou zónu i pro Francii (protiváha SSSR)
• Reparace: diskuse o rámcové částce (polovina pro SSSR), Britové proti → postoupeno komisi
• Za příslib vstupu do války proti Japonsku si Stalin vyjednal zisky na Dálném východě (jižní Sachalin, Kurily, práva v Číně)
• Deklarace o osvobozené Evropě: garance práva národů svobodně si zvolit vládní formu (odvolání na Atlantickou chartu 1941)
• Polsko: souhlas se sovětským záborem z r. 1939, odškodnění na úkor Německa na západě; reorganizace prozatímní (lublinské) vlády „na širším demokratickém základě" + příslib svobodných voleb
• Dohoda o svolání ustavujícího zasedání OSN (duben 1945, San Francisco, 51 států)

VÝSLEDKY POSTUPIMI:
• Potvrzení rozdělení Německa a Rakouska do 4 okupačních zón
• Program „čtyř D" vůči Německu: demilitarizace, denacifikace, demokratizace a demonopolizace
• Reparace formou surovin a výrobků (každá velmoc ve své zóně)
• Polské hranice stanoveny na linii Odra–Nisa; oblast východního Pruska a Kaliningrad ve prospěch SSSR
• Rozhodnutí o odsunu německého obyvatelstva z Polska, Československa a Maďarska (aktivita Beneše)
• Ustanovena Rada ministrů zahraničí (Čína, Francie, USA, SSSR, VB) – úkol připravit mírové smlouvy s poraženými státy (Rumunsko, Bulharsko, Maďarsko, Finsko)

JALTSKÝ MÝTUS (Vít Smetana, LN 2010):
• Mýtus tvrdí, že velmoci si na Jaltě rozdělily sféry vlivu – ve skutečnosti žádná taková dohoda podepsána nebyla
• Původ omylu už v goebbelsovské propagandě (jaro 1945); v ČR živná půda ve zkušenosti Mnichova (obraz „proradného Západu")
• Roosevelt byl obviňován z odepsání východní a střední Evropy ve prospěch SSSR (očistil ho až prezident Reagan)
• ČSR vstoupila do sovětské sféry dobrovolně – už podpisem čs.-sovětské smlouvy v prosinci 1943; na Jaltě se o ní vůbec nejednalo

OTÁZKY K TEXTU (OTAZ) – VZOROVÉ ODPOVĚDI:

OTÁZKA 1: S jakými tezemi a stereotypy pracuje jaltský mýtus?
• Že na Jaltě si velmoci „rozdělily sféry vlivu" a předurčily komunistický nástup
• Komunismus jako něco dosazeného zvenčí (citát V. Klause), přirovnání k Mnichovu i k paktu Molotov–Ribbentrop (G. W. Bush)
• Stereotyp „proradného Západu" lhostejného k osudu Čechů – původ už v goebbelsovské propagandě

OTÁZKA 2: Proč a jak bylo pro Stalina výhodné „hrát na domácím hřišti"?
• Sám vybral místo (Krym), nemusel opustit území během ofenziv Rudé armády
• Psychologická výhoda: na 160 km cestě z letiště Saki nechal státníky vidět válečnou zkázu → tlak na ústupnost
• Připravená odposlouchávací zařízení, opulentní hostiny – kontrast s nádherou paláců (Livadijský, Voroncovova vila)

OTÁZKA 3: V čem byly USA ochotné Stalinovi ustupovat a proč?
• Polsko (pružná formulace dohody – admirál Leahy varoval, že ji lze „natáhnout z Jalty do Washingtonu")
• Reparace (rámec 20 mld., polovina pro SSSR), zisky na Dálném východě za vstup proti Japonsku
• Hlavní motiv: Roosevelt chtěl udržet poválečnou spolupráci a hlavně sovětskou účast v OSN; chřadnoucí prezident se nechtěl spolčovat s Churchillem

OTÁZKA 4: Jaké byly základní teze Deklarace o osvobozené Evropě a její slabá místa?
• Garantovala osvobozeným národům právo svobodně si zvolit vládní formu a slibovala pomoc při demokratickém řešení problémů
• Odvolávala se na Atlantickou chartu (1941)
• Slabina: postrádala kontrolní i sankční mechanismy → Stalin ji mohl beztrestně ignorovat („realizaci určí země, jejichž armády území obsadí")

OTÁZKA 5: Co nového a podstatného se vyjednalo ve vztahu k Polsku?
• Hranice (Curzonova linie) byla dohodnuta už v Teheránu – na Jaltě se neměnila
• Nově: územní kompenzace pro Polsko na západě (až k západní Nise)
• Reorganizace prozatímní vlády „na širším demokratickém základě" + příslib svobodných voleb (konaly se až o 23 měsíců později)

OTÁZKA 6: Jakou roli hrála jaltská konference v osudu ČSR?
• Žádnou – ČSR nebyla předmětem jednání
• SSSR ji pokládal za baštu svého vlivu už od čs.-sovětské smlouvy z prosince 1943
• Beneš i Masaryk se sami chovali vstřícně vůči Moskvě → ČSR vstoupila do sovětské sféry dobrovolně

OTÁZKA 7: Jaké další události a bizarnosti v textu zaujmou?
• Noční nájezdy hmyzu (Američané vyzbrojeni DDT), kvanta kaviáru a přípitků
• Rooseveltova metafora o Caesarově manželce a Stalinova pohotová replika
• Churchillův příměr o „polské huse, kterou netřeba naplnit německou nádivkou k prasknutí"
• Marshall odmítl „hazardovat s americkými životy pro čistě politické účely" (dobytí Berlína/Prahy)

PŘÍKLAD SPRÁVNÉ ODPOVĚDI:
"Poválečné uspořádání řešila Velká trojka – Roosevelt, Churchill a Stalin – na sérii konferencí. Předcházela jí Atlantická charta (1941) a vznik Velké aliance. Po Casablance (1943) se v Teheránu (1943) trojka poprvé sešla a dohodla otevření druhé fronty a Curzonovu linii jako hranici Polska. Na Jaltě (únor 1945) byly stanoveny okupační zóny v Německu (včetně zóny pro Francii), reparace, vstup SSSR do války proti Japonsku, reorganizace polské vlády, svolání OSN a Deklarace o osvobozené Evropě. V Postupimi (léto 1945) Truman, Attlee a Stalin rozhodli o 'čtyřech D' (demilitarizace, denacifikace, demokratizace, demonopolizace), hranici na Odře–Nise a odsunu Němců. Vít Smetana ve svém textu vyvrací rozšířený 'jaltský mýtus', podle něhož si velmoci na Jaltě rozdělily sféry vlivu – ve skutečnosti Deklarace o osvobozené Evropě vznik sfér vlivu odmítala, jen postrádala kontrolní a sankční mechanismy. Mýtus má původ už v goebbelsovské propagandě a v českém prostředí živnou půdu ve zkušenosti Mnichova. Klíčové je, že Československo se do sovětské sféry dostalo dobrovolně už čs.-sovětskou smlouvou z prosince 1943 a na Jaltě se o něm vůbec nejednalo."
      `
    },
    {
      id: 5,
      title: "Výsledky a důsledky 2. světové války",
      summary: `🔑 ZTRÁTY: ~60 mil. mrtvých (20 mil. vojáků, 40 mil. civilistů); SSSR 20–50 mil.; Pobaltí a Polsko ztratily 1/5 populace
🔑 OBĚTI: více než polovina mrtvých byli Židé; v KT 12 mil. civilistů (6 mil. Židů)
🔑 NORIMBERK: proces s nacistickými zločinci (1945–46), „zločiny proti lidskosti"; OSN (1945)
🔑 ROZDĚLENÍ: Německo 4 okupační zóny → SRN a NDR (1949); bipolární svět USA × SSSR, studená válka
🔑 NÁSLEDKY: expanze SSSR, legitimizace komunismu, dekolonizace, ženská emancipace, atomový věk`,
      content: `
LIDSKÉ A MATERIÁLNÍ ZTRÁTY:
• Nejkrvavější konflikt v dějinách lidstva – kolem 60 milionů mrtvých (asi 20 milionů vojáků a 40 milionů civilistů)
• Poprvé v moderních dějinách převažovaly civilní oběti nad vojenskými (bombardování měst, holocaust, vyhlazovací politika)
• SSSR: 20–50 milionů obětí; procentuálně největší ztráty mělo Pobaltí a Polsko – až 1/5 populace
• Více než polovina mrtvých byli Židé; v koncentračních a vyhlazovacích táborech zahynulo na 12 milionů civilistů (z toho 6 mil. Židů)
• Dalších cca 1,5 milionu zemřelo v důsledku bombardování a kolem 14,5 milionu z jiných příčin; Čína 3–10 milionů
• Rozsáhlá devastace měst a hospodářství – úpadek poražených i vítězů

VÁLEČNÉ ZLOČINY NA CIVILISTECH:
• Miriam Gebhardtová (kniha Když přišli vojáci, 2014): odhady masového znásilňování při osvobozování
• Asi 860 000 znásilněných Němek, z toho asi třetina (270 000) západními vojáky, Sověti mají na svědomí nejméně 590 000 obětí
• Odhady hovoří i o stovkách tisíc dětí narozených z těchto činů

POTRESTÁNÍ VÁLEČNÝCH ZLOČINCŮ:
• Norimberský proces (1945–1946): mezinárodní tribunál s vůdčími představiteli nacistického Německa
• Nově definovány „zločiny proti míru", „válečné zločiny" a „zločiny proti lidskosti"
• Podobné procesy probíhaly i s japonskými představiteli (Tokijský proces)

NOVÉ MEZINÁRODNÍ USPOŘÁDÁNÍ:
• Organizace spojených národů (OSN) – založena 1945 (San Francisco); cíl: zachování míru a kolektivní bezpečnosti
• Rada bezpečnosti s 5 stálými členy (USA, SSSR, VB, Francie, Čína) a právem veta
• Nahradila neúspěšnou Společnost národů

ROZDĚLENÍ EVROPY A POČÁTEK STUDENÉ VÁLKY:
• Německo rozděleno na 4 okupační zóny (USA, VB, Francie, SSSR), Berlín taktéž → 1949 vznik SRN a NDR
• Svět se stal bipolárním – dvě supervelmoci USA a SSSR; zárodek studené války
• Expanze SSSR do východní a střední Evropy → legitimizace komunismu, příklon doleva i v západní Evropě
• „Železná opona" rozdělila Evropu; sovětizace střední a východní Evropy (Československo – únor 1948)

DALŠÍ DŮSLEDKY:
• Posun hranic: Polsko posunuto na západ (Odra–Nisa), SSSR si ponechal zisky z let 1939–1941
• Odsun (transfer) německého obyvatelstva z Československa, Polska a dalších zemí
• Počátek dekolonizace – oslabené koloniální mocnosti, vzestup národně osvobozeneckých hnutí
• Ženská emancipace; rozvoj vědy a techniky
• Atomový věk – jaderné zbraně se staly faktorem mezinárodní politiky (jaderné odstrašení)
• Zkušenost holocaustu vedla mj. ke vzniku státu Izrael (1948) a k rozvoji ochrany lidských práv

PŘÍKLAD SPRÁVNÉ ODPOVĚDI:
"Druhá světová válka byla nejkrvavějším konfliktem dějin – zahynulo kolem 60 milionů lidí, poprvé převážně civilistů (zhruba 40 milionů); jen SSSR ztratil 20–50 milionů obyvatel a Pobaltí s Polskem přišly až o pětinu populace. Více než polovinu mrtvých tvořili Židé a v táborech zahynulo na 12 milionů civilistů. K hrůzám patřilo i masové znásilňování při osvobozování (M. Gebhardtová). Váleční zločinci byli souzeni v Norimberském procesu (1945–46), kde byly nově definovány zločiny proti lidskosti. V roce 1945 vznikla OSN s Radou bezpečnosti jako nástupce Společnosti národů. Německo bylo rozděleno na čtyři okupační zóny (roku 1949 vznikly SRN a NDR) a svět se stal bipolárním – se dvěma supervelmocemi, USA a SSSR. 'Železná opona' rozdělila Evropu, začala studená válka a SSSR expandoval do střední a východní Evropy (v Československu únor 1948), což legitimizovalo komunismus a posílilo levici i na Západě. Hranice se posunuly (Polsko k Odře–Nise), proběhl odsun Němců, urychlila se dekolonizace, postoupila ženská emancipace i rozvoj vědy a začal atomový věk. Zkušenost holocaustu navíc přispěla ke vzniku Izraele (1948) i k rozvoji mezinárodní ochrany lidských práv."
      `
    },
    {
      id: 6,
      title: "TEXT: Normandie a západní fronta (Rajlich)",
      summary: `🔑 MÝTUS „DRUHÉ FRONTY": sovětská dezinformace – Západ bojoval už od 1939, SSSR byl do 1941 spojencem Hitlera
🔑 LEND-LEASE: USA dodaly SSSR 350 000 nákl. aut, 15 000 letadel, tanky, celé továrny, suroviny
🔑 ČS. LETCI: nad Normandií operoval celý čs. stíhací wing; 8.6.1944 sestřelili eso Zweigarta
🔑 OPERACE: Sicílie (VII/1943) nejpřínosnější, Dieppe (VIII/1942) katastrofa, Bruneval (1942)
🔑 OVERLORD: úspěch nebyl jistý – rozhodovalo počasí a absolutní vzdušná převaha`,
      content: `
MÝTUS „DRUHÉ FRONTY":
• Podle Jiřího Rajlicha (Vojenský historický ústav) jde o jednu z největších dezinformací o 2. světové válce
• Sovětský pohled: válka začala až 22.6.1941, vše předtím byla „ta druhá fronta, kterou Moskva chtěla, ale Západ ji vypočítavě oddaloval"
• Realita: Velká Británie, Francie i Čechoslováci bojovali už dva roky, zatímco SSSR měl od 23.8.1939 s Německem pakt o neútočení
• SSSR byl fakticky spojencem Hitlera: 17.9.1939 anektoval půlku Polska; luftwaffe v bitvě o Británii létala na ruský letecký petrolej
• Skutečnou „druhou frontou" byla podle Rajlicha východní fronta – a wehrmacht zde měl největší ztráty
• Bolševická propaganda Normandii i obří dodávky odbyla jedinou větou ve filmu Osvobození (Ozerov)

OPERACE SPOJENCŮ NA ZÁPADĚ:
• Sicílie a Itálie (červenec 1943): donutilo Hitlera zastavit postup u Kurska a přesunout elitní tankové jednotky → klíčový vliv i na východní frontu; pro Normandii nejpřínosnější zkušenost (princip kombinovaných operací)
• Dieppe (srpen 1942): katastrofa – ztráta desítek letadel, všech 28 tanků, kolaps útoku; legenda o „generální zkoušce"
• Bruneval (únor 1942): úspěšný výpad – obsazení a rozebrání německého radaru Würzburg
• Nájezdy na Bordeaux – testování německé obrany

RIZIKA VYLODĚNÍ (OPERACE OVERLORD):
• Kombinovaná operace námořnictva, parašutistů, speciálních jednotek a letectva – přeprava desetitisíců vojáků, techniky a paliva přes La Manche
• Klíčová byla absolutní vzdušná převaha Spojenců (paralela s bitvou o Anglii 1940, kdy Hitler invazi odpískal)
• Rozhodovalo počasí – mohlo rozházet invazní flotilu; invaze byla o den odložena
• Eisenhower si nebyl jist – předem napsal dopis přebírající vinu za případný neúspěch
• Luftwaffe vzlétla jen ~319×, Spojenci ~14 000× – vojáky ze vzduchu dokonale ochránili
• Němci navíc očekávali hlavní útok jinde a Rommel nebyl v nejkritičtější době přítomen

OTÁZKY K TEXTU (OTAZ) – VZOROVÉ ODPOVĚDI:

OTÁZKA 1: Vysvětlete narativ o „druhé frontě" sovětské a ruské propagandy.
• Jedna z největších dezinformací: SSSR datuje válku až od 22.6.1941, Západ prý frontu „vypočítavě oddaloval"
• Realita: VB, Francie i Čechoslováci bojovali už 2 roky; SSSR byl do 1941 spojencem Hitlera (pakt, anexe Polska, petrolej pro luftwaffe)

OTÁZKA 2: Jak materiálně pomáhali Spojenci Sovětskému svazu?
• Lend-lease z USA: 350 000 nákladních automobilů, 15 000 letadel, tisíce tanků
• Celé továrny postavené Sovětům, obuv a uniformy, obrovské dodávky surovin a kovů

OTÁZKA 3: Podíleli se na vylodění a bojích v Normandii i čs. vojáci?
• Ano, hlavně letci – nad Normandií operoval celý československý stíhací wing (i u Dieppe 1942)
• V souboji nad Normandií neutrpěli ztrátu; 8.6.1944 sestřelili německé eso Ludwiga Zweigarta (69 sestřelů, pravděpodobně Otto Smik)
• Proto čs. vlajky v Arromanches a Portsmouthu; západní historici Čechy chválí

OTÁZKA 4: Které další operace Spojenců jsou zmíněny a jaký měly význam?
• Sicílie/Itálie (1943) – nejpřínosnější zkušenost pro Normandii, odčerpala německé síly od Kurska
• Dieppe (1942) – katastrofa, „generální zkouška"; Bruneval (1942) – úspěšné rozebrání radaru; nájezdy na Bordeaux

OTÁZKA 5: Jaká byla největší rizika vylodění v Normandii?
• Počasí (mohlo rozházet flotilu; invaze o den odložena)
• Nutnost absolutní vzdušné převahy, jinak by vylodění pravděpodobně selhalo
• Logistika přepravy přes La Manche; nejistota velení (Eisenhowerův dopis přebírající vinu)

PŘÍKLAD SPRÁVNÉ ODPOVĚDI:
"V rozhovoru historik Jiří Rajlich vyvrací sovětský mýtus o 'druhé frontě', podle něhož Západ vstup do války vypočítavě oddaloval. Ve skutečnosti Velká Británie, Francie i Čechoslováci bojovali už od roku 1939, zatímco SSSR byl díky paktu Ribbentrop–Molotov do června 1941 fakticky spojencem Hitlera a USA mu navíc obrovsky pomáhaly dodávkami (350 000 nákladních automobilů, 15 000 letadel, celé továrny i suroviny). Na západní frontě byla pro Normandii nejpřínosnější zkušenost z vylodění na Sicílii (1943), zatímco Dieppe (1942) skončilo katastrofou. Vylodění v Normandii (operace Overlord, 6. června 1944) přitom nebylo zdaleka jisté – rozhodovaly počasí a absolutní vzdušná převaha Spojenců, jak dokládá i Eisenhowerův předem připravený dopis přebírající vinu za případný neúspěch. Významná byla i účast československých letců, kteří nad Normandií operovali v celém stíhacím wingu a 8. června 1944 sestřelili německé eso Ludwiga Zweigarta."
      `
    },
    {
      id: 7,
      title: "Šoa (příčiny, průběh, důsledky) + TEXT Šoa",
      summary: `🔑 POJEM: holocaust (řec. „celopal") / šoa (hebr. „zničení"); systematické vyvražďování Židů
🔑 GENEZE: Hitlerovo „proroctví" (30.1.1939), RSHA (Heydrich, Himmler), „Židovský referát" Eichmanna
🔑 POSTUP: zákony → ghetta (Polsko) → Einsatzgruppen → Wannsee (20.1.1942) → vyhlazovací tábory
🔑 TÁBORY: 6 vyhlazovacích táborů v dnešním Polsku (Osvětim, Treblinka, Bełżec, Sobibór, Majdanek, Chełmno); Akce Reinhard
🔑 OBĚTI: ~6 mil. Židů (2/3 evropských), nejvíce Polsko (~3 mil.); spory: popírání (trestné), Finkelstein`,
      content: `
TERMINOLOGIE:
• Holocaust (z řeckého holokauston – „celopal", náboženská obětina spalovaná celá); autorem novodobého užití je Elie Wiesel (román Noc, 1958)
• Šoa (hebrejsky „zničení, záhuba") – výraz preferovaný Židy, omezený na 2. světovou válku
• Porajmos (romsky „zničení") – pro genocidu Romů
• Holocaust = systematické a státem provozované pronásledování a vyvražďování Židů nacistickým Německem a jeho spojenci

GENEZE NACISTICKÉHO VYHLAZOVACÍHO PROGRAMU:
• 21.1.1939: na Göringův rozkaz založena Říšská ústředna pro židovské vystěhovalectví (Reichszentrale für jüdische Auswanderung)
• 30.1.1939: Hitler před říšským sněmem „prorokuje" zničení židovské rasy v Evropě v případě nové světové války
• 27.9.1939: zřízen Hlavní úřad říšské bezpečnosti (RSHA) – v čele říšský vůdce SS Heinrich Himmler, řízení Reinhard Heydrich (šéf bezpečnostní policie SIPO a SD)
• Úřadovna Amt IV (gestapo) pod generálem SS Heinrichem Müllerem; pod ni spadal „Židovský referát" Adolfa Eichmanna (hlavička výnosů RSHA IV B-4)
• Eichmann organizoval deportační vlaky a vydávání Židů z okupovaných zemí

SOUSTŘEĎOVÁNÍ – GHETTOIZACE (POLSKO):
• První krok k systematické likvidaci; první ghetto už v říjnu 1939 v Piotrkowě Trybunalském (Generální gouvernement)
• Únor 1940: ghetto v Lodži; říjen 1940: největší ghetto ve Varšavě (téměř půl milionu Židů)
• Další velká ghetta v Krakově, Tarnowě, Sosnowci a na dalších asi 650 místech
• Funkce: shromáždění Židů před deportací do vyhlazovacích táborů + nepřímá likvidace (hladomor, nemoci, vyčerpání, otrocká práce)

EINSATZGRUPPEN – VYVRAŽĎOVÁNÍ NA VÝCHODĚ:
• SS-Einsatzgruppen (pohotovostní oddíly) působily v Polsku a SSSR – „řešit židovský problém formou popravy"
• Na konci roku 1941 měly 30 000 mužů, v lednu 1943 už 300 000
• Čtyři skupiny: Einsatzgruppe A (Stahlecker), B (Nebe), C (Rasch), D (Ohlendorf)

KONEČNÉ ŘEŠENÍ A VYHLAZOVACÍ TÁBORY:
• 27.4.1940: Himmler nařídil zřízení koncentračního tábora v Osvětimi (Birkenau 1.3.1941)
• Chełmno (Kulmhof): pojízdné plynové komory (plynové vozy)
• 20.1.1942: konference ve Wannsee (předsedal Heydrich) – koordinace „konečného řešení židovské otázky" (Endlösung)
• Akce Reinhard – tábory: Bełżec (první vyhlazovací tábor, velitel Christian Wirth, ukrajinští dozorci vyškolení v Trawnikách)
• Treblinka (velitel Franz Stangl): „továrna na smrt" – tři plynové komory 4×4 m, kapacita 300–500 lidí za hodinu, odhadem 870 000 zavražděných
• Sobibór (od března 1942): kapacita plynových komor zvýšena na 1200 osob; 12.2.1943 tábor navštívil Himmler; po vzpouře vězňů zlikvidován
• Osvětim (Auschwitz-Birkenau) – velitel Rudolf Höß; nejčastější metoda plyn Cyklon B, mrtvoly spalovány
• Osvobození Osvětimi Rudou armádou 27.1.1945 → 27. leden = Mezinárodní den památky obětí holocaustu

OBĚTI:
• Hlavní obětí byli Židé – obvykle uváděný počet 6 milionů (Raul Hilberg uvádí 5,2 milionu), zhruba 2/3 evropských Židů
• Nejvíce obětí z Polska (cca 3 miliony mrtvých)
• Další vyvražďované skupiny: sovětští zajatci (2–3 mil.), Poláci (1,8–2 mil.), političtí vězni (1–1,5 mil.), Srbové, Romové (220–500 tis.), hendikepovaní, svobodní zednáři, Svědkové Jehovovi, homosexuálové, Slované
• Při širším pojetí bývá celkový počet uváděn až ~30 milionů

ŠOA V ČESKÝCH ZEMÍCH:
• Před válkou žilo na území dnešní ČR přes 120 tisíc Židů; ~26 tisícům se podařilo emigrovat (do roku 1941, kdy začaly transporty)
• Přes 80 tisíc osob bylo během holocaustu zavražděno
• Kritizováno bývá rozhodnutí Československa z roku 1938 zakázat vstup rakouským Židům a vracet uprchlíky

RŮZNÝ PŘÍSTUP ZEMÍ:
• Dánsko: vzorné – v roce 1943 organizovaně přepravilo téměř všechny své Židy do neutrálního Švédska
• Slovenský štát: Židy vydával z vlastní iniciativy a za jejich odvoz dokonce platil
• Maďarsko: masové deportace až 1944 pod nátlakem nacistů
• Itálie: velmi vlažný přístup; Finsko: odmítlo přijmout protižidovské zákony i vydat Židy
• Diplomatické úsilí neutrálních zemí a Vatikánu (nuncius Angelo Rotta v Maďarsku 1944) deportace někde brzdilo

SPORY O HOLOCAUST:
• Standardní interpretace: holocaust jako ojedinělá historická událost a vyvrcholení staleté nenávisti
• Popírání (zpochybňování) holocaustu – v ČR a řadě zemí trestný čin („osvětimská lež"); představitelé: Ernst Zündel, Fred Leuchter, David Irving, Robert Faurisson
• „Holocaustový průmysl" – Norman Finkelstein: kritika zneužívání památky holocaustu pro finanční a politické cíle (nezpochybňuje samotný holocaust)

OTÁZKY K TEXTU (OTAZ) – VZOROVÉ ODPOVĚDI:

OTÁZKA 1: Uveďte počty povražděných Židů. Které země byly nejvíce postiženy?
• Cca 6 milionů Židů (Hilberg uvádí 5,2 mil.) – zhruba 2/3 evropských Židů
• Nejvíce postiženo Polsko (cca 3 miliony mrtvých)

OTÁZKA 2: Jaké další skupiny byly perzekuovány a kolik to stálo obětí?
• Sovětští zajatci (2–3 mil.), Poláci (1,8–2 mil.), političtí vězni (1–1,5 mil.), Srbové (330–500 tis.)
• Romové (220–500 tis.), hendikepovaní (200–250 tis.), svobodní zednáři, Svědkové Jehovovi, homosexuálové, Slované
• Celkový počet obětí německých válečných zločinů se odhaduje na 12–26 milionů

OTÁZKA 3: Jmenujte 4–5 vyhlazovacích táborů – ve kterých zemích dnes leží?
• Osvětim (Auschwitz-Birkenau), Treblinka, Bełżec, Sobibór, Majdanek, Chełmno
• Všechny se nacházejí na území dnešního Polska

OTÁZKA 4: Porovnejte přístup tří evropských zemí k holocaustu.
• Dánsko: zachovalo se vzorně – v roce 1943 organizovaně přepravilo téměř všechny své Židy do neutrálního Švédska
• Slovenský štát: jeden z nejvstřícnějších vůči nacistům – Židy vydával z vlastní iniciativy a za jejich odvoz platil
• Maďarsko (příp. Bulharsko): k masovým deportacím došlo až 1944 pod nátlakem nacistů; Bulharsko ochránilo většinu Židů z vlastního území, ale vydalo Židy z okupovaných oblastí

OTÁZKA 5: Proč, kým a jak je holocaust zpochybňován?
• Kdo: popírači jako Ernst Zündel, David Irving, Robert Faurisson, Fred Leuchter
• Jak: od popírání existence přes zlehčování až po zbavování nacistů odpovědnosti („osvětimská lež")
• Proč: snaha o revizi výsledků WWII, antisemitismus, odpor ke státu Izrael; v ČR je popírání trestným činem

OTÁZKA 6: Vysvětlete pojem „holocaustový průmysl".
• Pojem Normana Finkelsteina (sám židovského původu) z knihy Průmysl holocaustu
• Nezpochybňuje holocaust, ale kritizuje zneužívání jeho památky – kapitalizaci utrpení, pózu ublíženectví, argumentaci holocaustem v politických zájmech (zejména Izraele)
• V některých bodech se překrývá s antisionismem

PŘÍKLAD SPRÁVNÉ ODPOVĚDI:
"Šoa (holocaust) bylo systematické, státem organizované pronásledování a vyvražďování Židů nacistickým Německem jako praktická aplikace 'konečného řešení židovské otázky'. Program se rodil postupně – od Hitlerova 'proroctví' (1939) a vzniku RSHA (Himmler, Heydrich, Eichmannův 'Židovský referát') přes ghettoizaci v Polsku a vyvražďování oddíly Einsatzgruppen na východě až po konferenci ve Wannsee (20.1.1942), která vyhlazování koordinovala. Zahynulo přibližně 6 milionů Židů, tedy zhruba dvě třetiny evropské židovské populace, nejvíce z Polska (asi 3 miliony). Vedle Židů byly vyvražďovány i další skupiny – sovětští zajatci, Poláci, Romové (porajmos), hendikepovaní či homosexuálové. Šest vyhlazovacích táborů vzniklo na území dnešního Polska (Osvětim, Treblinka, Bełżec, Sobibór, Majdanek, Chełmno), kde se v rámci Akce Reinhard vraždilo plynem Cyklon B (Treblinka přes 870 tisíc obětí). V českých zemích bylo zavražděno přes 80 tisíc Židů. Jednotlivé země se zachovaly různě – Dánsko své Židy zachránilo, zatímco Slovenský štát je vydával z vlastní iniciativy. Holocaust je dnes terčem popírání (v ČR trestný čin), které vychází z antisemitismu a snahy revidovat výsledky války; samostatným jevem je 'holocaustový průmysl' Normana Finkelsteina, jenž kritizuje zneužívání památky obětí, aniž by holocaust zpochybňoval."
      `
    },
    {
      id: 8,
      title: "Polsko za války a po válce (1939–1947)",
      summary: `🔑 PIŁSUDSKI: maršál a obnovitel Polska; 1926 sanační režim („diktatura v rukavičkách"), strach ze SSSR
🔑 ROZDĚLENÍ: pakt Ribbentrop–Molotov (23.8.1939) → 1.9. útok Německa, 17.9. SSSR; Gen. gouvernement (Krakov)
🔑 ODBOJ: exilová vláda (Sikorski) v Londýně, Armija Krajowa; Varšavské ghetto (1943), Varšavské povstání (1944)
🔑 KATYŇ (jaro 1940): Berijův rozkaz, NKVD; 22–25 tis. zavražděných; odhalení 1943, přiznání SSSR až 1990
🔑 PO VÁLCE: sovětizace 1945–47, zábor území, čistky, pogrom v Kielcích; epilog – Smolensk 2010`,
      content: `
JÓZEF PIŁSUDSKI A MEZIVÁLEČNÉ POLSKO:
• Józef Klemens Piłsudski (1867–1935): maršál a obnovitel svobodného Polska, vůdce a vrchní velitel státu (1918–1922), poté autokrat (1926–1935)
• Za 1. světové války nejprve spolupráce s Němci, pak vězněn; socialista
• 1926: sanační režim – „diktatura v rukavičkách"; orientace na Francii; strach ze SSSR + smlouva s Německem
• Podstata polské situace: pokus sovětských bolševiků vyvézt revoluci do Evropy × polský nacionalismus

POLSKÉ OBAVY A ROZDĚLENÍ ZEMĚ (1939):
• Po 15.3.1939 (okupace zbytku Česko-Slovenska) obavy Polska → spojenecká dohoda s Velkou Británií a Francií
• Hitler reaguje vypovězením smlouvy o neútočení; 22.3. obsazuje litevskou Klajpedu (Memel); narůstají provokace
• Goebbelsův tisk vede kampaň o „utiskovaných" Němcích v Polsku; Hitler žádá sporný přístav Gdaňsk
• Pakt Molotov–Ribbentrop (23.8.1939): dohoda o neútočení + tajný dodatek o parcelaci Polska a Pobaltí
• 1.9.1939: záminkou zinscenované přepadení vysílače v Gliwici; časně obsazen Gdaňsk
• 3.9.1939: VB a Francie vyhlašují válku; blesková válka → za 25 dní kapitulace Varšavy
• 17.9.: sovětské jednotky překračují hranici (záminka: ochrana běloruské a ukrajinské populace)
• 28.9.: společná přehlídka německých a sovětských vojsk v Brestu Litevském → definitivní rozdělení Polska

POLÁCI ZA VÁLKY:
• 12.10.1939 zřízen Generální gouvernement (centrum Krakov); okamžitě etnické čistky (zabito cca 3 mil. Poláků a 3 mil. Židů)
• Polská exilová vláda do Londýna (Władysław Sikorski); exilová armáda cca 250 000 mužů (Francie, Norsko, UK, sev. Afrika, Itálie aj.)
• Domácí odboj: Armija Krajowa (Zemská armáda) podřízená londýnské vládě
• Po útoku na SSSR (1941): odchod polských zajatců přes Írán na Západ (gen. Władysław Anders) × vytvoření Polské lidové armády a prokomunistické Lublinské vlády

VARŠAVSKÉ GHETTO A IRENA SENDLEROWA:
• Od roku 1940 do varšavského ghetta násilně sestěhováno asi 450 000 Židů
• Ghetto tvořilo jen 4,5 % rozlohy města, ale soustředilo 37 % obyvatel; přísun jen ~1125 kalorií denně
• Většina obyvatel odvezena do vyhlazovacího tábora Treblinka; duben–květen 1943 povstání v ghettu
• Irena Sendlerowa (1910–2008): sociální pracovnice, členka dětského oddělení Rady pro pomoc Židům (Żegota)
• Za války zachránila asi 2500 židovských dětí; zatčena a mučena gestapem, odsouzena k smrti, s pomocí Żegoty popravě unikla
• Po roce 1945 pronásledována; 1965 prohlášena Jad Vašem za spravedlivou mezi národy, 2003 Řád bílého orla

VARŠAVSKÉ POVSTÁNÍ (1.8.–3.10.1944):
• Armija Krajowa zahájila povstání proti Němcům; 15 000 zabitých vojáků AK + 200 000 civilistů
• Nacistická represe + pasivita Rudé armády, která zůstala stát za Vislou

KATYŇSKÝ MASAKR (JARO 1940):
• Při útoku SSSR na Polsko (1939) zajato mnoho vojáků a civilní inteligence → deportace do Ruska, Běloruska a na Ukrajinu
• Na příkaz NKVD a přímý Berijův rozkaz („není žádoucí držet prominentní nepřátelské zajatce") povražděni
• Popravy v Katyni, Ostaškovu a Starobělsku; celkem 22 000–25 000 mužů (15 000 důstojníků + 10 000 příslušníků inteligence)
• Duben 1943: odhaleny první hroby (zajatci stříleni do týla); exilová vláda podezírá SSSR, žádá Mezinárodní červený kříž
• Smrt (vražda?) gen. Sikorského 1943; SSSR vinu popírá (i u Norimberského procesu), Spojenci důkazy zamlčují
• SSSR vinu popíral až do roku 1990; téma zpracoval i film „Katyň" (Andrzej Wajda, 2007)

POLSKO 1945–1947 (SOVĚTIZACE):
• Sovětizace + zábor území; zatčení a poprava členů londýnské exilové vlády; zákaz návratu exilového vojska
• Regionální občanská válka: komunistická Lidová armáda × prolondýnská Armia Krajowa × UPA (banderovci)
• Transfery obyvatelstva, politické a etnické čistky (80 000 mrtvých Poláků × 20 000 Ukrajinců), pogrom v Kielcích

EPILOG – SMOLENSK 2010:
• 10.4.2010 letecká tragédie u Smolenska (cesta k uctění obětí Katyně): 96 mrtvých
• Mezi oběťmi prezident Lech Kaczyński s první dámou, poslední exilový prezident Kaczorowski a celé velení polské armády

PŘÍKLAD SPRÁVNÉ ODPOVĚDI:
"Meziválečné Polsko obnovil maršál Józef Piłsudski, který od roku 1926 vládl sanačnímu režimu – 'diktatuře v rukavičkách' – orientovanému na Francii a obávajícímu se SSSR. O osudu země rozhodl pakt Ribbentrop–Molotov (23.8.1939) s tajným dodatkem o rozdělení Polska: 1. září 1939 zaútočilo Německo (záminkou byl zinscenovaný přepad vysílače v Gliwici), 17. září vpadl ze východu SSSR a Polsko bylo rozděleno. Němci zřídili Generální gouvernement a rozpoutali teror, exilová vláda Władysława Sikorského odešla do Londýna a doma vznikla Armija Krajowa. Tragédií byl katyňský masakr (jaro 1940), při němž NKVD na Berijův rozkaz povraždila 22–25 tisíc polských důstojníků a příslušníků inteligence; SSSR vinu přiznal až roku 1990. Ve varšavském ghettu zahynuly statisíce Židů (povstání 1943) – tisíce dětí ale zachránila Irena Sendlerowa. Varšavské povstání 1944 Němci krvavě potlačili, zatímco Rudá armáda zůstala stát za Vislou. Po válce (1945–47) bylo Polsko sovětizováno, jeho hranice posunuty a doprovázely je čistky a pogromy. Symbolickým epilogem se stala letecká tragédie u Smolenska (2010), při níž zahynul prezident Lech Kaczyński i velení polské armády."
      `
    },
    {
      id: 9,
      title: "Jugoslávie za 2. světové války",
      summary: `🔑 POZADÍ: Království SHS (1918) → diktatura Alexandra I. (1929) → Království Jugoslávie; atentát 1934 (Marseille)
🔑 1941: 25.3. přistoupení k Paktu tří → 27.3. převrat → 6.4. německý útok (bombardování Bělehradu); exil do Británie
🔑 OKUPACE: rozparcelování (Nedić v Srbsku, Itálie, Bulharsko, Maďarsko); NDH – ustašovci (Pavelić), Jasenovac
🔑 ODBOJ: Četnici (Mihailović, pasivní, později kolaborace) × Partyzáni (Tito) – federální idea
🔑 VÝSLEDEK: AVNOJ, Tito „nejsilnější muž na Balkáně", SFRJ (6 republik); přes 1,1 mil. padlých`,
      content: `
POZADÍ – OD KRÁLOVSTVÍ SHS K JUGOSLÁVII:
• 1.12.1918 vyhlášeno Království Srbů, Chorvatů a Slovinců (Království SHS) – regent Alexandr I. Karadjordjević
• Stát postaven na iluzi jednotného národa: „Srbové vládnou, Chorvati diskutují a Slovinci platí"
• Problémy: separatismus, napětí v Kosovu, negramotnost, slabá ekonomika
• 6.1.1929: „šestojanuarská diktatura" – Alexandr zrušil ústavu a parlament; stát přejmenován na Království Jugoslávie, rozdělen do 9 bánovin podle řek
• 9.10.1934: atentát na Alexandra I. v Marseille (člen VMRO Vlado Černozemski) → nastupuje nezletilý Petr II., vládne regentská rada (Pavel)

CESTA K ROZPADU A NĚMECKÝ ÚTOK (1941):
• Srpen 1939: zřízena Chorvatská bánovina (pakt Cvetković–Maček, tzv. „srbský Mnichov") – Chorvatům ale autonomie nestačí
• Po vypuknutí války vláda vyhlašuje neutralitu, Hitler ale tlačí na opuštění neutrality (přístup k surovinám a strategickému prostoru)
• 25.3.1941: Jugoslávie přistupuje k Paktu tří → obyvatelstvo se bouří: „Raději válku než pakt.", „Raději hrob než otroctví."
• 27.3.1941: převrat skupiny důstojníků (gen. Borivoje Mirković) – regent Pavel sesazen, Petr II. dosazen na trůn
• 6.4.1941: Hitler reaguje útokem zahájeným bombardováním Bělehradu (24 německých, 23 italských, 5 maďarských divizí); 10.4. prolomena obrana
• Petr II. s vládou odcházejí do exilu do Británie

OKUPACE A ROZPARCELOVÁNÍ:
• Němci okupují Srbsko, Banát a část Kosova; do čela dosazen germanofil Milan Nedić (opora: srbští fašisté ZBOR, kolaborantské oddíly)
• Slovinsko: dvě třetiny území připojeny k Třetí říši, rozsáhlá germanizace
• Itálie: anexe Dalmácie, černohorského pobřeží, části Slovinska, Kosova a záp. Makedonie
• Bulharsko: Vardarská Makedonie, část Kosova a jižního Srbska; Maďarsko: Bačka, Baranja, Mezimuří, Zámuří

NEZÁVISLÝ STÁT CHORVATSKO (NDH) A USTAŠA:
• 10.4.1941 vyhlášen ustašovci (Slavko Kvaternik) Nezávislý stát Chorvatsko (Nezavisna država hrvatska – NDH), v čele Ante Pavelić
• Ustaša: chorvatské ultranacionální hnutí s fašistickým programem (založeno 1930), cíl – rozbití Jugoslávie a samostatné Chorvatsko
• Diskriminace a pronásledování Srbů: zákaz cyrilice, povinné označení páskou s „P" (pravoslavný), pogromy – zabito přes 120 tisíc lidí
• Koncentrační tábory Jasenovac, Rab, Jagodno; násilná rekatolizace; vysídlení na 200 tisíc Srbů
• „Srbosjek" – zvláštní nůž používaný ustašovci k rychlému podřezávání vězňů

ČETNICI A PARTYZÁNI – DVĚ CENTRA ODBOJE:
• Četnici – Dragoljub (Draža) Mihailović (1893–1946): velkosrbský, šovinistický plán; veskrze pasivní, vyčkávací taktika (strach z represí); měli podporu exilové vlády; v opozici ke komunistům; později kolaborovali s Němci proti partyzánům
• Partyzáni: upustili od rozbití Jugoslávie, přistoupili na ideu federálního státu; ultralevicový, ale ne nacionalistický program → širší přijetí; většina partyzánů přitom nebyli komunisté
• Vrchní velitel: maršál Josip Broz Tito (1892–1980) – otec Chorvat, matka Slovinka, profesionální revolucionář a generální tajemník KSJ

POVSTÁNÍ A NĚMECKÉ OFENZIVY:
• Povstání začalo 7.7.1941 (útok na hlídku v Bela Crkvi); partyzáni získali území kolem Užice („Užická republika")
• Němci provedli za války celkem 7 velkých protipartyzánských ofenziv
• Leden 1943: Fall Weiss (80 tis. vojáků Osy × 40 tis. partyzánů) – povstalci unikli; květen 1943: Fall Schwartz (117 tis. vojáků Osy) – únik kaňonem Sutjesky, Tito raněn
• 1943: Londýn se odvrátil od pasivního Mihailoviće a uznal partyzány; Tito uznán Velkou trojkou za „samostatného spojeneckého vrchního velitele"
• Po kapitulaci Itálie (1943) získala partyzánská armáda mnoho zbraní → Tito „nejsilnějším mužem na Balkáně"

AVNOJ A VZNIK FEDERATIVNÍ JUGOSLÁVIE:
• Zasedání AVNOJ deklarovala záměr vytvořit federativní Jugoslávii ze šesti republik s rovnoprávnými národy
• Němečtí obyvatelé automaticky ztratili občanství a majetek (konfiskace)
• Zvolen Národní výbor osvobození Jugoslávie (NKOJ) jako prozatímní vláda; Tito jmenován maršálem a premiérem; exilová vláda odvolána, králi zakázán návrat do referenda
• Květen 1944: Němci se pokusili zajmout Titovo velení – ukořistili jen jeho uniformu (Tito přesunut na ostrov Vis)
• Šubašić–Tito: dohoda o uznání AVNOJ; 26.8.1944 král Petr II. uznal Tita za vrchního velitele armády
• 14.10.1944 dobyt Bělehrad (s pomocí Rudé armády, která se pak stáhla); v květnu 1945 vstup do Záhřebu, poslední Němci se vzdali 12.5.
• Král abdikoval 18.1.1945; nová vláda 7.3.1945 (Tito premiérem) → Socialistická federativní republika Jugoslávie (Srbsko, Chorvatsko, Makedonie, Černá Hora, Bosna a Hercegovina, Slovinsko)

CENA ZA OSVOBOZENÍ:
• Přes 1,1 milionu padlých: 237 tis. vojáků NOA a 200 tis. kolaborantů
• Podle národností: 530 tis. Srbů, 197 tis. Chorvatů, 103 tis. muslimů, 57 tis. Židů, 42 tis. Slovinců, 20 tis. Černohorců, 18 tis. Romů, 6 tis. Makedonců

PŘÍKLAD SPRÁVNÉ ODPOVĚDI:
"Jugoslávie vznikla roku 1918 jako Království SHS, postavené na iluzi jednotného národa; po diktatuře a přejmenování na Království Jugoslávie (1929) i atentátu na krále Alexandra (1934) zůstávala vnitřně rozervaná. Když 25. března 1941 přistoupila k Paktu tří, vyvolalo to převrat (27.3.) a Hitler 6. dubna zemi napadl (bombardováním Bělehradu); král s vládou odešli do exilu. Země byla rozparcelována mezi Německo (loutkový Nedić v Srbsku), Itálii, Bulharsko a Maďarsko a vznikl ustašovský Nezávislý stát Chorvatsko (Pavelić), který v táborech jako Jasenovac vyvraždil statisíce Srbů, Židů a Romů. Odboj se rozdělil na dvě centra: pasivní, velkosrbské a později kolaborující četniky Draži Mihailoviće a komunisty vedené partyzány Josipa Broze Tita, kteří prosazovali federální stát a získali širší podporu. Přes sedm německých ofenziv (Fall Weiss, Fall Schwartz) partyzáni přežili, byli uznáni Velkou trojkou a po kapitulaci Itálie zesílili. Na zasedáních AVNOJ vznikl základ federativní Jugoslávie šesti republik v čele s Titem. Osvobození ale stálo přes 1,1 milionu životů – velkou část obětí přitom zavinily vnitřní boje a kolaborace."
      `
    }
  ],
  quizQuestions: [
    {
      question: "Kdy byl podepsán Pakt tří (osa Berlín–Řím–Tokio)?",
      options: ["23.8.1939", "27.9.1940", "22.6.1941", "7.12.1941"],
      correct: 1,
      explanation: "Pakt tří mezi Německem, Itálií a Japonskem byl podepsán 27.9.1940 v Berlíně a rozděloval sféry vlivu ve světě."
    },
    {
      question: "Který sovětský politik jednal v listopadu 1940 v Berlíně o možném přistoupení SSSR k Paktu tří?",
      options: ["Vjačeslav Molotov", "Josif Stalin", "Ivan Majskij", "Alexandr Nekrič"],
      correct: 0,
      explanation: "Ministr zahraničí Vjačeslav Molotov jednal v Berlíně 12.–14.11.1940 s Ribbentropem i osobně s Hitlerem."
    },
    {
      question: "Kam chtěl Hitler usměrnit expanzi SSSR, aby oslabil britské impérium?",
      options: ["Na Balkán", "Do Skandinávie", "Jižním směrem – do Íránu a Indie", "Do Číny"],
      correct: 2,
      explanation: "Hitler se snažil Molotova přesvědčit, aby SSSR zaměřil expanzi na jih (Írán, Indie) – cílem bylo oslabit britské impérium."
    },
    {
      question: "Kdy začala operace Barbarossa (útok na SSSR)?",
      options: ["1.9.1939", "10.5.1940", "22.6.1941", "6.6.1944"],
      correct: 2,
      explanation: "22.6.1941 Německo bez vypovězení války zaútočilo na SSSR. Připojily se Maďarsko, Rumunsko, Slovensko a Finsko."
    },
    {
      question: "Co byla dohoda Sikorski–Majskij (1941)?",
      options: ["Smlouva o rozdělení Polska", "Spojenecká smlouva polské londýnské vlády se SSSR", "Tajný dodatek paktu Ribbentrop–Molotov", "Dohoda o vzniku UPA"],
      correct: 1,
      explanation: "Dohoda Sikorski–Majskij (30.7.1941) byla spojenecká smlouva mezi polskou londýnskou vládou a SSSR; otázku hranic nechávala otevřenou."
    },
    {
      question: "Co se stalo v Katyni a kdy SSSR přiznal odpovědnost?",
      options: ["Bitva 1943, dosud nevyřešena", "Masakr polských důstojníků; odpovědnost NKVD přiznána 1990", "Konference velmocí 1945", "Vyhlazovací tábor osvobozený 1945"],
      correct: 1,
      explanation: "V Katyni byli na Berijův rozkaz povražděni polští důstojníci a inteligence (22–25 tis.). Masový hrob odhalen 1943; zodpovědnost NKVD přiznal SSSR teprve v roce 1990."
    },
    {
      question: "Čím bylo zahájeno přepadení Polska 1.9.1939?",
      options: ["Vyhlášením války ze strany VB", "Inscenovaným přepadem vysílačky v Glivicích (Gliwicích)", "Bombardováním Londýna", "Vyloděním v Gdaňsku"],
      correct: 1,
      explanation: "Záminkou pro útok na Polsko 1.9.1939 byl inscenovaný (předstíraný) přepad německého vysílače v Gliwici (Glivicích)."
    },
    {
      question: "Kudy Němci v roce 1940 prorazili do týla francouzské obrany?",
      options: ["Přes Maginotovu linii", "Přes „neprostupné“ Ardeny", "Z moře u Dunkerque", "Přes Švýcarsko"],
      correct: 1,
      explanation: "Francouzi čekali útok přes Belgii nebo Maginotovu linii, Němci však prošli přes „neprostupné“ Ardeny (gen. Guderian) a pronikli do týla."
    },
    {
      question: "Kolik vojáků se podařilo evakuovat z Dunkerque (1940)?",
      options: ["Asi 40 000", "Asi 150 000", "Asi 338 000", "Asi 600 000"],
      correct: 2,
      explanation: "Z Dunkerque se do Británie podařilo dostat 338 256 vojáků (z toho asi 139 tisíc Francouzů a Belgičanů); na plážích zůstalo necelých 40 000."
    },
    {
      question: "Kdo se stal 10.5.1940 britským premiérem se slovy „Mohu vám slíbit pouze krev, pot a slzy“?",
      options: ["Neville Chamberlain", "Winston Churchill", "Clement Attlee", "Charles de Gaulle"],
      correct: 1,
      explanation: "Premiérem se 10.5.1940 stal Winston Churchill (vystřídal Nevilla Chamberlaina); jeho slova „krev, pot a slzy“ zazněla v prvním prohlášení."
    },
    {
      question: "Proč Hitler nakonec odložil a zrušil invazi do Británie (operace Lvoun)?",
      options: ["Kvůli útoku na SSSR", "Luftwaffe nezískala v bitvě o Británii vzdušnou převahu", "Kvůli vstupu USA do války", "Kvůli vylodění v Normandii"],
      correct: 1,
      explanation: "V bitvě o Británii (1940) Luftwaffe nezískala vzdušnou převahu nad RAF, takže Hitler invazi odpískal. Vyznamenali se i čs. letci (Josef František – 17 sestřelů)."
    },
    {
      question: "Která bitva je považována za rozhodující zlom na východní frontě?",
      options: ["Bitva o Moskvu", "Stalingrad", "Kursk", "El Alamein"],
      correct: 1,
      explanation: "Stalingrad (srpen 1942 – 2.2.1943) skončil kapitulací německé 6. armády a znamenal rozhodující zlom – iniciativa přešla k Rudé armádě."
    },
    {
      question: "Co znamenal pro USA 7. prosinec 1941?",
      options: ["Vylodění v Normandii", "Japonský útok na Pearl Harbor → vstup USA do války", "Svržení atomové bomby", "Konec války v Pacifiku"],
      correct: 1,
      explanation: "7.12.1941 Japonsko přepadlo Pearl Harbor, načež USA vstoupily do války. Německo a Itálie vyhlásily válku USA 11.12.1941."
    },
    {
      question: "Co bylo zvláštního na bitvě u Kurska (červenec 1943)?",
      options: ["První použití tanků", "Největší tanková bitva; Hitler ji přerušil kvůli Sicílii", "Vylodění Spojenců", "Poslední německá ofenziva"],
      correct: 1,
      explanation: "Kursk byl největší tankovou bitvou dějin. Hitler musel přerušit postup a přesunout jednotky na Sicílii → iniciativa definitivně u SSSR."
    },
    {
      question: "Kdo byl vrchním velitelem expedičních vojsk při vylodění v Normandii?",
      options: ["Generál Montgomery", "Generál Eisenhower", "Generál Patton", "Generál Rommel"],
      correct: 1,
      explanation: "Vrchním velitelem byl generál Eisenhower, velitelem pozemních vojsk generál Montgomery. Šlo o největší invazi všech dob (přes 150 000 vojáků první den)."
    },
    {
      question: "Co byla operace „Valkýra“ z 20. července 1944?",
      options: ["Vylodění v Normandii", "Pokus o atentát na Hitlera ve „Vlčím doupěti“", "Sovětská ofenziva", "Bombardování Drážďan"],
      correct: 1,
      explanation: "20.7.1944 proběhl neúspěšný pokus o převrat a atentát na Hitlera (von Stauffenberg) ve „Vlčím doupěti“ – operace „Valkýra“."
    },
    {
      question: "Která byla poslední velká německá ofenziva na západní frontě?",
      options: ["Bitva o Británii", "Ardenská ofenziva (1944–45)", "Operace Overlord", "Bitva o Berlín"],
      correct: 1,
      explanation: "Ardenská ofenziva (prosinec 1944 – leden 1945) byla poslední velkou německou ofenzivou na západě a skončila neúspěchem."
    },
    {
      question: "Kolik mrtvých si vyžádalo bombardování Drážďan v únoru 1945?",
      options: ["Asi 700", "18 000 – 35 000", "90 000", "Přes 100 000"],
      correct: 1,
      explanation: "Při náletu na Drážďany (805 bombardérů, 2660 tun pum, z toho 45 % zápalných) zahynulo 18 000–35 000 lidí. Téhož měsíce byla bombardována i Praha (700 mrtvých)."
    },
    {
      question: "Kdy kapitulovalo nacistické Německo?",
      options: ["2.9.1945", "8.5.1945 (v Moskvě 9.5.)", "30.4.1945", "6.8.1945"],
      correct: 1,
      explanation: "Bezpodmínečná kapitulace Německa byla podepsána 8.5.1945 (v Moskvě 9.5.1945). 30.4. spáchal Hitler sebevraždu."
    },
    {
      question: "Čím byla ukončena válka s Japonskem?",
      options: ["Kapitulací 8.5.1945", "Atomovými bombami (Hirošima, Nagasaki) → kapitulace 2.9.1945", "Bitvou u Midway", "Vyloděním na Sicílii"],
      correct: 1,
      explanation: "Po svržení atomových bomb na Hirošimu (6.8.) a Nagasaki (9.8.1945) a vstupu SSSR Japonsko kapitulovalo 2.9.1945 – konec WWII."
    },
    {
      question: "Kdo tvořil tzv. Velkou trojku?",
      options: ["Hitler, Mussolini, Hirohito", "Roosevelt, Churchill, Stalin", "Truman, Attlee, Stalin", "Wilson, Clemenceau, Lloyd George"],
      correct: 1,
      explanation: "Velkou trojku tvořili Franklin D. Roosevelt (USA), Winston Churchill (VB) a Josif Stalin (SSSR)."
    },
    {
      question: "Který dokument z roku 1941 položil základy Velké aliance?",
      options: ["Mnichovská dohoda", "Atlantická charta", "Pakt tří", "Versailleská smlouva"],
      correct: 1,
      explanation: "Atlantickou chartu podepsali v srpnu 1941 Roosevelt a Churchill, v září se připojil Stalin → vznik protifašistické Velké aliance."
    },
    {
      question: "Kde a kdy se konala Jaltská konference?",
      options: ["Teherán, 1943", "Krym, únor 1945", "Postupim, léto 1945", "Mnichov, 1938"],
      correct: 1,
      explanation: "Jaltská konference se konala na Krymu ve dnech 4.–11. února 1945."
    },
    {
      question: "Co je podle Víta Smetany jádrem „jaltského mýtu“?",
      options: ["Že Jalta zachránila Evropu", "Že si velmoci na Jaltě rozdělily sféry vlivu (ač to není pravda)", "Že Jalta nikdy neproběhla", "Že Jalta rozhodla o atomové bombě"],
      correct: 1,
      explanation: "Mýtus tvrdí, že si velmoci na Jaltě rozdělily sféry vlivu. Ve skutečnosti Jalta sféry vlivu nerozdělila – mýtus má původ už v goebbelsovské propagandě."
    },
    {
      question: "Kdy a jak vstoupilo Československo do sovětské sféry vlivu (dle Smetany)?",
      options: ["Na Jaltě 1945, z donucení", "Dobrovolně – už čs.-sovětskou smlouvou v prosinci 1943", "V Postupimi 1945", "Až v únoru 1948"],
      correct: 1,
      explanation: "Podle Smetany ČSR vstoupila do sovětské sféry dobrovolně už podpisem čs.-sovětské smlouvy v prosinci 1943; na Jaltě se o ní vůbec nejednalo."
    },
    {
      question: "Co znamenal program „čtyř D“ pro poválečné Německo (Postupim)?",
      options: ["Demilitarizace, denacifikace, demokratizace, demonopolizace", "Deportace, devalvace, demolice, deflace", "Decentralizace, deportace, denacifikace, demilitarizace", "Demografie, daně, doprava, diplomacie"],
      correct: 0,
      explanation: "Spojenecká politika vůči Německu = program „čtyř D“: demilitarizace, denacifikace, demokratizace a demonopolizace."
    },
    {
      question: "Které konference se po Jaltě zúčastnili Truman a Attlee (místo Roosevelta a Churchilla)?",
      options: ["Teheránské", "Postupimské (1945)", "Mnichovské", "Pařížské"],
      correct: 1,
      explanation: "Postupimské konference (léto 1945) se zúčastnili Truman (po Rooseveltově smrti) a Attlee (vystřídal Churchilla) a Stalin."
    },
    {
      question: "Jak Jiří Rajlich hodnotí termín „druhá fronta“ pro Normandii?",
      options: ["Jako přesný odborný pojem", "Jako sovětskou dezinformaci/propagandu", "Jako americký výmysl", "Jako termín z Versailles"],
      correct: 1,
      explanation: "Rajlich považuje narativ o „druhé frontě“ za jednu z největších dezinformací – Západ bojoval už od 1939, zatímco SSSR byl do 1941 spojencem Hitlera."
    },
    {
      question: "Jak materiálně pomáhaly USA Sovětskému svazu (lend-lease)?",
      options: ["Pouze potravinami", "350 000 nákl. aut, 15 000 letadel, tanky, celé továrny", "Jen finančními půjčkami", "Vůbec nepomáhaly"],
      correct: 1,
      explanation: "USA dodaly SSSR mj. 350 000 nákladních automobilů, 15 000 letadel a tisíce tanků, postavily celé továrny a dodávaly suroviny i uniformy."
    },
    {
      question: "Co bylo podle Rajlicha klíčovou podmínkou úspěchu vylodění v Normandii?",
      options: ["Početní převaha pěchoty", "Absolutní vzdušná převaha a příznivé počasí", "Pomoc SSSR", "Atomová bomba"],
      correct: 1,
      explanation: "Klíčová byla absolutní vzdušná převaha Spojenců a počasí – Eisenhower si nebyl jist a předem napsal dopis přebírající vinu za neúspěch."
    },
    {
      question: "Kolik lidí přibližně zahynulo ve 2. světové válce?",
      options: ["Asi 10 milionů", "Asi 25 milionů", "Asi 60 milionů (20 mil. vojáků, 40 mil. civilistů)", "Asi 100 milionů"],
      correct: 2,
      explanation: "Odhaduje se kolem 60 milionů mrtvých (asi 20 milionů vojáků a 40 milionů civilistů); jen SSSR ztratil 20–50 milionů obyvatel."
    },
    {
      question: "Kterou knihu o znásilňování při osvobozování napsala Miriam Gebhardtová?",
      options: ["Průmysl holocaustu", "Když přišli vojáci (2014)", "Katyň", "Osvobození"],
      correct: 1,
      explanation: "Miriam Gebhardtová v knize Když přišli vojáci (2014) zpracovala odhady masového znásilňování – Sověti mají na svědomí nejméně 590 000 obětí."
    },
    {
      question: "Kolik Židů přibližně zahynulo během holocaustu?",
      options: ["Asi 600 tisíc", "Asi 1 milion", "Asi 6 milionů (cca 2/3 evropských Židů)", "Asi 30 milionů"],
      correct: 2,
      explanation: "Obvykle se uvádí cca 6 milionů zavražděných Židů (Hilberg 5,2 mil.) – zhruba dvě třetiny evropských Židů. Nejvíce z Polska (~3 mil.)."
    },
    {
      question: "Co projednávala konference ve Wannsee (20.1.1942)?",
      options: ["Rozdělení Německa", "Koordinaci „konečného řešení židovské otázky“", "Otevření druhé fronty", "Reparace"],
      correct: 1,
      explanation: "Ve Wannsee (předsedal Heydrich) se 20.1.1942 koordinovaly kroky v plánu „konečného řešení židovské otázky“ – systematického vyhlazení evropských Židů."
    },
    {
      question: "Kdo měl na starosti „Židovský referát“ (RSHA IV B-4) a organizaci transportů?",
      options: ["Reinhard Heydrich", "Adolf Eichmann", "Heinrich Müller", "Christian Wirth"],
      correct: 1,
      explanation: "„Židovský referát“ (RSHA IV B-4) vedl Adolf Eichmann, který organizoval deportační vlaky a vydávání Židů z okupovaných zemí."
    },
    {
      question: "Co byly Einsatzgruppen?",
      options: ["Spojenecké výsadkové jednotky", "Pohotovostní oddíly SS vyvražďující Židy v Polsku a SSSR", "Partyzánské skupiny", "Italské tankové divize"],
      correct: 1,
      explanation: "SS-Einsatzgruppen (A–D) byly pohotovostní oddíly, které měly „řešit židovský problém formou popravy“; do ledna 1943 měly až 300 000 mužů."
    },
    {
      question: "Na území kterého dnešního státu ležely všechny nacistické vyhlazovací tábory (Osvětim, Treblinka…)?",
      options: ["Německo", "Polsko", "Rakousko", "Česko"],
      correct: 1,
      explanation: "Šest vyhlazovacích táborů (Osvětim, Treblinka, Bełżec, Sobibór, Majdanek, Chełmno) bylo zřízeno na území dnešního Polska."
    },
    {
      question: "Co znamená pojem „holocaustový průmysl“ (Norman Finkelstein)?",
      options: ["Popírání holocaustu", "Kritiku zneužívání památky holocaustu pro finanční a politické cíle", "Výrobu zbraní za války", "Provoz vyhlazovacích táborů"],
      correct: 1,
      explanation: "Finkelstein holocaust nezpochybňuje, ale kritizuje zneužívání jeho památky (kapitalizaci utrpení, politické zájmy). Pojem se místy překrývá s antisionismem."
    },
    {
      question: "Která země se zachovala vzorně a v roce 1943 přepravila téměř všechny své Židy do bezpečí?",
      options: ["Slovenský štát", "Maďarsko", "Dánsko (přeprava do Švédska)", "Itálie"],
      correct: 2,
      explanation: "Dánsko v roce 1943 organizovaně přepravilo téměř všechny své Židy do neutrálního Švédska. Naopak Slovenský štát Židy vydával z vlastní iniciativy."
    },
    {
      question: "Kdo byl Józef Piłsudski?",
      options: ["Polský komunistický vůdce", "Maršál a obnovitel svobodného Polska (sanační režim 1926)", "Velitel Armije Krajowe", "Polský exilový premiér v Londýně"],
      correct: 1,
      explanation: "Józef Piłsudski (1867–1935) byl maršál a obnovitel Polska; od roku 1926 stál v čele sanačního režimu – „diktatury v rukavičkách“."
    },
    {
      question: "Jak se jmenovala německá okupační správa zřízená v okupovaném Polsku (centrum Krakov)?",
      options: ["Reichskommissariat Ostland", "Generální gouvernement", "Lublinská vláda", "Protektorát"],
      correct: 1,
      explanation: "12.10.1939 byl zřízen Generální gouvernement s centrem v Krakově; následovaly etnické čistky (zabity miliony Poláků i Židů)."
    },
    {
      question: "Kdo byla Irena Sendlerowa?",
      options: ["Polská exilová ministryně", "Členka Żegoty, která zachránila asi 2500 židovských dětí", "Velitelka varšavského ghetta", "Sovětská partyzánka"],
      correct: 1,
      explanation: "Irena Sendlerowa (1910–2008) byla sociální pracovnice a členka Rady pro pomoc Židům (Żegota); zachránila asi 2500 židovských dětí, byla mučena gestapem."
    },
    {
      question: "Co se stalo při Varšavském povstání (1.8.–3.10.1944)?",
      options: ["Povstání ghetta proti deportacím", "Povstání Armije Krajowe; 15 tis. vojáků a 200 tis. civilistů mrtvých, Rudá armáda stála za Vislou", "Sovětské osvobození Varšavy", "Německý protiútok"],
      correct: 1,
      explanation: "Varšavské povstání zahájila Armija Krajowa; Němci ho krvavě potlačili (15 tis. vojáků AK + 200 tis. civilistů) za pasivity Rudé armády stojící za Vislou."
    },
    {
      question: "K čemu došlo u Smolenska v dubnu 2010?",
      options: ["Bitvě", "Letecké tragédii, při níž zahynul polský prezident Lech Kaczyński a velení armády", "Odhalení katyňských hrobů", "Podpisu smlouvy"],
      correct: 1,
      explanation: "10.4.2010 při cestě uctít oběti Katyně havarovalo letadlo u Smolenska – zahynulo 96 lidí včetně prezidenta Lecha Kaczyńského a celého velení polské armády."
    },
    {
      question: "Kdy a proč Hitler napadl Jugoslávii v roce 1941?",
      options: ["1.9., kvůli surovinám", "6.4. – po převratu (27.3.), který svrhl vládu přistupující k Paktu tří", "22.6., v rámci Barbarossy", "10.5., spolu s útokem na Francii"],
      correct: 1,
      explanation: "Jugoslávie 25.3.1941 přistoupila k Paktu tří, ale 27.3. proběhl převrat. Hitler reagoval 6.4.1941 útokem zahájeným bombardováním Bělehradu."
    },
    {
      question: "Co byl Nezávislý stát Chorvatsko (NDH)?",
      options: ["Demokratická republika", "Ustašovský fašistický stát (Pavelić) pronásledující Srby – tábor Jasenovac", "Italská kolonie", "Součást Maďarska"],
      correct: 1,
      explanation: "NDH (vyhlášen 10.4.1941) byl ustašovský fašistický stát v čele s Ante Pavelićem; vyvražďoval Srby, Židy a Romy (tábory Jasenovac, Rab) – nástroj „srbosjek“."
    },
    {
      question: "Jaký byl rozdíl mezi četniky a partyzány v Jugoslávii?",
      options: ["Žádný, spolupracovali", "Četnici (Mihailović) – velkosrbští, pasivní, později kolaborace; Partyzáni (Tito) – federální idea, širší podpora", "Četnici byli komunisté, partyzáni nacionalisté", "Partyzáni podporovali krále, četnici republiku"],
      correct: 1,
      explanation: "Četnici Draži Mihailoviće měli velkosrbský program, vyčkávali a později kolaborovali; Titovi partyzáni přijali ideu federální Jugoslávie a získali širší podporu."
    },
    {
      question: "Kdo byl vrchním velitelem jugoslávských partyzánů a poválečným vůdcem Jugoslávie?",
      options: ["Draža Mihailović", "Ante Pavelić", "Josip Broz Tito", "Milan Nedić"],
      correct: 2,
      explanation: "Vrchním velitelem partyzánů (Národní osvobozenecké armády) byl maršál Josip Broz Tito, který se po válce stal vůdcem federativní Jugoslávie (SFRJ)."
    },
    {
      question: "Z kolika republik se po válce skládala federativní Jugoslávie (SFRJ)?",
      options: ["Ze tří", "Ze čtyř", "Z šesti", "Z devíti"],
      correct: 2,
      explanation: "SFRJ tvořilo šest republik: Srbsko, Chorvatsko, Makedonie, Černá Hora, Bosna a Hercegovina a Slovinsko. Osvobození stálo přes 1,1 milionu životů."
    },
    {
      question: "Který mezinárodní orgán vznikl po válce (1945) jako nástupce Společnosti národů?",
      options: ["NATO", "OSN (Organizace spojených národů)", "Varšavská smlouva", "Kominterna"],
      correct: 1,
      explanation: "V roce 1945 (konference v San Franciscu) vznikla OSN s Radou bezpečnosti (5 stálých členů + právo veta) jako nástupce neúspěšné Společnosti národů."
    },
  ]
};

// ══════════════════════════════════════════════════════════════
// MAIN APP COMPONENT
// ══════════════════════════════════════════════════════════════

export default function App() {
  const [activeTab, setActiveTab] = useState('study');
  const [selectedTopic, setSelectedTopic] = useState(null);

  // Quiz state
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleTopicSelect = (topic) => setSelectedTopic(topic);
  const handleBack = () => setSelectedTopic(null);

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
    if (isCorrect) setScore(score + 1);
    setAnsweredQuestions([...answeredQuestions, { question: currentQuestion, selectedAnswer: index, correct: isCorrect }]);
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
      const t = line.trim();
      if (!t) return null;

      if (/^[A-ZČŘŽÝÁÍÉĚŠĎŤŇŮÚ0-9\s\-–\(\)„“.:,\/]+:?$/.test(t) && t.length > 3 && !t.startsWith('•') && !t.startsWith('-')) {
        return <h3 key={i} style={{ color: '#c9a227', fontSize: '1.15rem', marginTop: '1.5rem', marginBottom: '0.75rem', fontWeight: '700', borderBottom: '1px solid rgba(201,162,39,0.3)', paddingBottom: '0.5rem' }}>{t}</h3>;
      }
      if (t.includes(':') && !t.startsWith('•') && !t.startsWith('-') && !t.startsWith('"') && !t.startsWith('„') && !t.startsWith('§') && t.split(':')[0].length < 60 && t.split(':')[0].length > 1) {
        const [header, ...rest] = t.split(':');
        const restText = rest.join(':');
        if (header && restText) {
          return <p key={i} style={{ marginBottom: '0.5rem', lineHeight: 1.7 }}><strong style={{ color: '#e8c547' }}>{header}:</strong><span style={{ color: '#ccc' }}>{restText}</span></p>;
        }
      }
      if (t.startsWith('•')) {
        return <div key={i} style={{ paddingLeft: '1.5rem', marginBottom: '0.5rem', position: 'relative', lineHeight: 1.7 }}><span style={{ position: 'absolute', left: '0.5rem', color: '#c9a227' }}>•</span><span style={{ color: '#ddd' }}>{t.substring(1).trim()}</span></div>;
      }
      if (t.startsWith('-') && !t.startsWith('--')) {
        return <div key={i} style={{ paddingLeft: '2.5rem', marginBottom: '0.35rem', color: '#aaa', fontSize: '0.95rem', lineHeight: 1.6 }}>{t}</div>;
      }
      if (t.startsWith('"') || t.startsWith('„') || t.startsWith('§')) {
        return <blockquote key={i} style={{ borderLeft: '3px solid #c9a227', paddingLeft: '1rem', marginLeft: '0.5rem', marginBottom: '0.75rem', fontStyle: 'italic', color: '#bbb', lineHeight: 1.6 }}>{t}</blockquote>;
      }
      return <p key={i} style={{ marginBottom: '0.75rem', color: '#ddd', lineHeight: 1.7 }}>{t}</p>;
    });
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', fontFamily: "'Crimson Text', Georgia, serif", color: '#e8e8e8', padding: '0' }}>
      {/* Google Font */}
      <link href="https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet" />

      {/* Header */}
      <header style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '2px solid #c9a227', padding: '1.5rem 2rem', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(10px)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#c9a227', margin: 0, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              📜 Dějepis 2.B
            </h1>
            <p style={{ fontSize: '0.9rem', color: '#888', margin: '0.25rem 0 0 0', fontStyle: 'italic' }}>
              2. světová válka • Fronty • Velká trojka • Šoa • Polsko • Jugoslávie • 1939–1945
            </p>
          </div>
          <nav style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { id: 'study', label: '📖 Studium' },
              { id: 'review', label: '⚡ Rychlé opakování' },
              { id: 'quiz', label: '✍️ Kvíz' },
              { id: 'tips', label: '💡 Tipy' }
            ].map(tab => (
              <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSelectedTopic(null); if (tab.id !== 'quiz') resetQuiz(); }}
                style={{ padding: '0.75rem 1.5rem', background: activeTab === tab.id ? '#c9a227' : 'rgba(255,255,255,0.1)', color: activeTab === tab.id ? '#1a1a2e' : '#e8e8e8', border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '1rem', fontWeight: activeTab === tab.id ? '700' : '400', transition: 'all 0.2s ease' }}>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>

        {/* ═══ STUDY TAB ═══ */}
        {activeTab === 'study' && !selectedTopic && (
          <div>
            <div style={{ background: 'rgba(201, 162, 39, 0.1)', border: '1px solid #c9a227', borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem' }}>
              <h2 style={{ color: '#c9a227', margin: '0 0 0.5rem 0', fontSize: '1.3rem' }}>🎯 Jak se učit na test</h2>
              <p style={{ margin: 0, lineHeight: 1.6 }}>
                Test pokrývá <strong>9 témat</strong> z období 2. světové války (1939–1945) – látka je zpracovaná přesně podle prezentací (Polsko, holocaust, Velká trojka, Jugoslávie, západní fronta). U témat <strong style={{color: '#4CAF50'}}>1, 4, 6 a 7</strong> jsou navíc <strong style={{color: '#4CAF50'}}>OTÁZKY Z TEXTU (OTAZ)</strong> – nauč se strukturu a klíčové vzorové odpovědi. Každé téma má rychlé shrnutí (🔑), podrobný výklad i <strong style={{color: '#4CAF50'}}>příklad správné odpovědi</strong>.
              </p>
            </div>

            <h2 style={{ color: '#c9a227', borderBottom: '1px solid rgba(201,162,39,0.3)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
              Témata k procvičení ({studyData.hlavniOtazky.length})
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1rem' }}>
              {studyData.hlavniOtazky.map((topic, index) => (
                <button key={topic.id} onClick={() => handleTopicSelect(topic)}
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,162,39,0.3)', borderRadius: '8px', padding: '1.25rem', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s ease', color: '#e8e8e8', fontFamily: 'inherit' }}
                  onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(201,162,39,0.15)'; e.currentTarget.style.borderColor = '#c9a227'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(201,162,39,0.3)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <span style={{ background: '#c9a227', color: '#1a1a2e', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.9rem', flexShrink: 0 }}>{index + 1}</span>
                    <div>
                      <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', color: '#fff', lineHeight: 1.3 }}>{topic.title}</h3>
                      <span style={{ fontSize: '0.85rem', color: '#c9a227', opacity: 0.8 }}>Klikni pro detail →</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ═══ TOPIC DETAIL ═══ */}
        {activeTab === 'study' && selectedTopic && (
          <div>
            <button onClick={handleBack} style={{ background: 'rgba(201,162,39,0.2)', border: '1px solid #c9a227', color: '#c9a227', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.9rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              ← Zpět na přehled
            </button>
            <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '2rem', border: '1px solid rgba(201,162,39,0.2)' }}>
              <h2 style={{ color: '#c9a227', fontSize: '1.75rem', marginTop: 0, marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '2px solid rgba(201,162,39,0.3)' }}>{selectedTopic.title}</h2>
              {selectedTopic.summary && (
                <div style={{ background: 'linear-gradient(135deg, rgba(201,162,39,0.15) 0%, rgba(201,162,39,0.05) 100%)', border: '2px solid #c9a227', borderRadius: '12px', padding: '1.25rem', marginBottom: '2rem', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '-12px', left: '20px', background: '#16213e', padding: '0 10px', color: '#c9a227', fontWeight: 'bold', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>⚡ RYCHLÉ SHRNUTÍ</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.95rem', lineHeight: '1.8', color: '#e8e8e8', whiteSpace: 'pre-wrap' }}>{selectedTopic.summary}</div>
                </div>
              )}
              <div style={{ fontSize: '1.05rem' }}>{renderContent(selectedTopic.content)}</div>
            </div>
          </div>
        )}

        {/* ═══ QUICK REVIEW TAB ═══ */}
        {activeTab === 'review' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>⚡</div>
              <h2 style={{ color: '#c9a227', margin: '0 0 0.5rem 0' }}>Rychlé opakování před testem</h2>
              <p style={{ color: '#888', margin: 0 }}>Klíčové body ze všech 9 témat na jednom místě</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {studyData.hlavniOtazky.map((topic) => (
                <div key={topic.id} style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid rgba(201,162,39,0.3)', overflow: 'hidden' }}>
                  <div style={{ background: 'linear-gradient(135deg, rgba(201,162,39,0.2) 0%, rgba(201,162,39,0.05) 100%)', padding: '0.75rem 1.25rem', borderBottom: '1px solid rgba(201,162,39,0.2)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ background: '#c9a227', color: '#1a1a2e', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem', flexShrink: 0 }}>{topic.id}</span>
                    <span style={{ color: '#c9a227', fontWeight: '600', fontSize: '1rem' }}>{topic.title}</span>
                  </div>
                  <div style={{ padding: '1rem 1.25rem', fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: '1.7', whiteSpace: 'pre-wrap', color: '#ccc' }}>{topic.summary}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ QUIZ TAB ═══ */}
        {activeTab === 'quiz' && (
          <div>
            {!quizStarted && !quizFinished && (
              <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✍️</div>
                <h2 style={{ color: '#c9a227', margin: '0 0 1rem 0', fontSize: '2rem' }}>Kvíz – 2. světová válka</h2>
                <p style={{ color: '#aaa', marginBottom: '2rem', fontSize: '1.1rem' }}>{studyData.quizQuestions.length} otázek ze všech 9 témat</p>
                <button onClick={startQuiz} style={{ padding: '1rem 3rem', background: '#c9a227', color: '#1a1a2e', border: 'none', borderRadius: '8px', fontSize: '1.2rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>Začít kvíz</button>
              </div>
            )}

            {quizStarted && !quizFinished && (
              <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#888' }}>
                  <span>Otázka {currentQuestion + 1} / {studyData.quizQuestions.length}</span>
                  <span>Skóre: {score}</span>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '2rem', border: '1px solid rgba(201,162,39,0.2)' }}>
                  <h3 style={{ color: '#fff', fontSize: '1.3rem', marginTop: 0, marginBottom: '1.5rem', lineHeight: 1.4 }}>{studyData.quizQuestions[currentQuestion].question}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {studyData.quizQuestions[currentQuestion].options.map((opt, i) => {
                      let bg = 'rgba(255,255,255,0.05)';
                      let border = '1px solid rgba(255,255,255,0.1)';
                      if (showResult) {
                        if (i === studyData.quizQuestions[currentQuestion].correct) { bg = 'rgba(76,175,80,0.2)'; border = '1px solid #4CAF50'; }
                        else if (i === selectedAnswer) { bg = 'rgba(239,83,80,0.2)'; border = '1px solid #ef5350'; }
                      } else if (i === selectedAnswer) { bg = 'rgba(201,162,39,0.2)'; border = '1px solid #c9a227'; }
                      return (
                        <button key={i} onClick={() => handleAnswer(i)} style={{ padding: '1rem 1.25rem', background: bg, border, borderRadius: '8px', color: '#e8e8e8', textAlign: 'left', cursor: showResult ? 'default' : 'pointer', fontFamily: 'inherit', fontSize: '1rem', transition: 'all 0.2s ease', lineHeight: 1.4 }}>{opt}</button>
                      );
                    })}
                  </div>
                  {showResult && (
                    <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(201,162,39,0.1)', borderRadius: '8px', border: '1px solid rgba(201,162,39,0.3)' }}>
                      <p style={{ margin: 0, color: '#ddd', lineHeight: 1.6 }}>{studyData.quizQuestions[currentQuestion].explanation}</p>
                    </div>
                  )}
                  {showResult && (
                    <button onClick={nextQuestion} style={{ marginTop: '1rem', padding: '0.75rem 2rem', background: '#c9a227', color: '#1a1a2e', border: 'none', borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '1rem', fontWeight: '700' }}>
                      {currentQuestion < studyData.quizQuestions.length - 1 ? 'Další otázka →' : 'Zobrazit výsledky →'}
                    </button>
                  )}
                </div>
              </div>
            )}

            {quizFinished && (
              <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{score >= studyData.quizQuestions.length * 0.8 ? '🎉' : score >= studyData.quizQuestions.length * 0.5 ? '👍' : '📚'}</div>
                <h2 style={{ color: '#c9a227', margin: '0 0 0.5rem 0' }}>Výsledek kvízu</h2>
                <p style={{ fontSize: '2.5rem', fontWeight: '800', color: '#fff', margin: '1rem 0' }}>{score} / {studyData.quizQuestions.length}</p>
                <p style={{ color: '#aaa', marginBottom: '2rem' }}>{Math.round(score / studyData.quizQuestions.length * 100)}% správně</p>
                <button onClick={resetQuiz} style={{ padding: '1rem 3rem', background: '#c9a227', color: '#1a1a2e', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>Zkusit znovu</button>
              </div>
            )}
          </div>
        )}

        {/* ═══ TIPS TAB ═══ */}
        {activeTab === 'tips' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>💡</div>
              <h2 style={{ color: '#c9a227', margin: '0 0 0.5rem 0' }}>Tipy pro přípravu</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
              {[
                { title: '📅 Klíčová data k zapamatování', text: '23.8.1939 – pakt Ribbentrop–Molotov\n1.9.1939 – přepadení Polska = začátek WWII\n3.9.1939 – VB a Francie vyhlásily válku\n17.9.1939 – SSSR obsadil východní Polsko\njaro 1940 – katyňský masakr; květen–červen 1940 – Dunkerque (338 256)\n22.6.1940 – kapitulace Francie\nVII–X/1940 – bitva o Británii\n27.9.1940 – Pakt tří (osa Berlín–Řím–Tokio)\n6.4.1941 – útok na Jugoslávii; 22.6.1941 – Barbarossa\n7.12.1941 – Pearl Harbor → vstup USA\n20.1.1942 – konference ve Wannsee\nVI/1942 – Midway; XI/1942 – El Alamein\n2.2.1943 – kapitulace u Stalingradu\nVII/1943 – Kursk + vylodění na Sicílii\nXI–XII/1943 – Teheránská konference\n6.6.1944 – vylodění v Normandii (Overlord)\n20.7.1944 – atentát na Hitlera (Valkýra)\n1.8.–3.10.1944 – Varšavské povstání; 29.8. – SNP\n27.1.1945 – osvobození Osvětimi\n4.–11.2.1945 – Jaltská konference; II/1945 – Drážďany\n30.4.1945 – sebevražda Hitlera\n8.5.1945 – kapitulace Německa\n6. a 9.8.1945 – Hirošima a Nagasaki\n2.9.1945 – kapitulace Japonska = konec WWII' },
                { title: '👤 Klíčové osobnosti', text: 'Adolf Hitler – vůdce nacistického Německa\nJosif Stalin – sovětský diktátor (Velká trojka)\nF. D. Roosevelt – prezident USA (Velká trojka), zemřel IV/1945\nWinston Churchill – britský premiér (Velká trojka)\nHarry Truman / Clement Attlee – Postupim (po Rooseveltovi a Churchillovi)\nVjačeslav Molotov / James Byrnes / A. Eden → E. Bevin – ministři zahraničí\nDwight Eisenhower / B. Montgomery – velitelé v Normandii\nErwin Rommel – velitel Afrikakorpsu („pouštní liška")\nFriedrich Paulus – velitel německé 6. armády u Stalingradu\nJózef Piłsudski / Władysław Sikorski – Polsko (vůdce / exilová vláda)\nIrena Sendlerowa – zachránila ~2500 židovských dětí (Żegota)\nJosip Broz Tito / Draža Mihailović / Ante Pavelić – Jugoslávie\nR. Heydrich / H. Himmler / A. Eichmann – organizátoři holocaustu\nJiří Rajlich / Vít Smetana / Norman Finkelstein – autoři textů' },
                { title: '📝 Klíčové pojmy', text: 'Blitzkrieg = bleskové války (tanky + letectvo)\nPakt tří = osa Berlín–Řím–Tokio (1940)\nBarbarossa = útok na SSSR (22.6.1941)\nOverlord = vylodění v Normandii (6.6.1944)\nValkýra = atentát na Hitlera (20.7.1944)\nGenerální gouvernement = něm. správa okupovaného Polska\nArmija Krajowa (AK) = polská Domácí armáda; UPA = ukrajinská\nLend-lease = americké dodávky spojencům (i SSSR)\nVelká trojka = Roosevelt, Churchill, Stalin\n„4 D" = demilitarizace, denacifikace, demokratizace, demonopolizace\nEndlösung = „konečné řešení židovské otázky"; RSHA; Einsatzgruppen\nAkce Reinhard = vyhlazovací tábory (Bełżec, Treblinka, Sobibór)\nCyklon B = plyn ve vyhlazovacích táborech\nNDH / Ustaša = Nezávislý stát Chorvatsko / ustašovci\nČetnici × Partyzáni = jugoslávský odboj (Mihailović × Tito)\nAVNOJ = základ federativní Jugoslávie' },
                { title: '🤝 Konference Velké trojky', text: 'Casablanca (I/1943) – jen Roosevelt a Churchill; dohoda o Sicílii\nTeherán (XI–XII/1943) – první schůzka trojky; druhá fronta, Curzonova linie\nJalta (II/1945) – okupační zóny, zóna pro Francii, OSN, vstup SSSR proti Japonsku, reorganizace polské vlády, Deklarace o osvobozené Evropě\nPostupim (VII–VIII/1945) – Truman, Attlee, Stalin; „4 D" pro Německo, hranice Odra–Nisa, odsun Němců, Rada ministrů zahraničí' },
                { title: '🗺️ Zlomové bitvy a fronty', text: 'Dunkerque (1940) – evakuace 338 256 vojáků\nBitva o Británii (1940) – Hitler invazi odpískal; Josef František 17 sestřelů\nBitva o Moskvu (zima 1941) – první velký neúspěch\nMidway (VI/1942) – zlom v Pacifiku\nEl Alamein (XI/1942) – zlom v severní Africe\nStalingrad (do 2.2.1943) – zlom na východní frontě\nKursk (VII/1943) – největší tanková bitva\nNormandie (6.6.1944) – západní fronta (Overlord)\nArdeny (zima 1944/45) – poslední německá ofenziva\nDrážďany (II/1945) – ničivý nálet (18–35 tis. mrtvých)' },
                { title: '🇵🇱 Polsko – co si zapamatovat', text: 'Piłsudski – sanační režim 1926 („diktatura v rukavičkách")\nPakt Ribbentrop–Molotov (23.8.1939) → rozdělení Polska\n1.9. útok Německa (Gliwice), 17.9. SSSR; Gen. gouvernement (Krakov)\nExilová vláda (Sikorski) v Londýně, doma Armija Krajowa\nKatyň (jaro 1940): Berijův rozkaz, NKVD, 22–25 tis., přiznání 1990\nVaršavské ghetto (450 tis.) → Treblinka; povstání ghetta 1943\nIrena Sendlerowa – ~2500 zachráněných dětí\nVaršavské povstání 1944 – Rudá armáda stála za Vislou\nPo válce: sovětizace 1945–47, pogrom v Kielcích\nEpilog: Smolensk 2010 (smrt prezidenta Kaczyńského)' },
                { title: '🇷🇸 Jugoslávie – co si zapamatovat', text: 'Království SHS (1918) → diktatura Alexandra I. (1929) → Království Jugoslávie\nAtentát na Alexandra I. (1934, Marseille)\n25.3.1941 přistoupení k Paktu tří → 27.3. převrat → 6.4. útok Německa\nRozparcelování: Nedić (Srbsko), Itálie, Bulharsko, Maďarsko\nNDH (Pavelić, ustašovci) – vyvražďování Srbů, tábor Jasenovac\nČetnici (Mihailović – pasivní, kolaborace) × Partyzáni (Tito – federace)\n7 německých ofenziv (Fall Weiss, Fall Schwartz – Sutjeska)\nAVNOJ → SFRJ (6 republik); Tito „nejsilnější muž na Balkáně"\nPřes 1,1 milionu padlých (velká část z vnitřních bojů)' },
                { title: '🕯️ Šoa – co si zapamatovat', text: 'Geneze: Hitlerovo „proroctví" (1939), RSHA (Heydrich, Himmler), Eichmann\nPostup: zákony → ghetta (Polsko) → Einsatzgruppen → Wannsee → tábory\n~6 milionů zavražděných Židů (2/3 evropských)\nNejvíce obětí z Polska (~3 miliony)\n6 vyhlazovacích táborů – všechny v dnešním Polsku\n(Osvětim, Treblinka, Bełżec, Sobibór, Majdanek, Chełmno)\nAkce Reinhard; Endlösung = „konečné řešení"; plyn Cyklon B\n27.1. = Den památky obětí (osvobození Osvětimi)\nRůzný přístup zemí: Dánsko zachránilo své Židy × Slovenský štát je vydával\nPopírání holocaustu = trestný čin; „holocaustový průmysl" (Finkelstein) ≠ popírání' },
              ].map((tip, i) => (
                <div key={i} style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '1.5rem', border: '1px solid rgba(201,162,39,0.2)' }}>
                  <h3 style={{ color: '#c9a227', margin: '0 0 1rem 0', fontSize: '1.2rem' }}>{tip.title}</h3>
                  <pre style={{ fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: '1.7', color: '#ccc', whiteSpace: 'pre-wrap', margin: 0 }}>{tip.text}</pre>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
