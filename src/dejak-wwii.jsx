// @title Dějepis - 2. světová válka (1939–1945)
// @subject History
// @topic 2. světová válka, fronty, Velká trojka, šoa
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
      summary: `🔑 ZAČÁTEK: 1.9.1939 přepadení Polska (blitzkrieg), 3.9. VB+FR vyhlásily válku, 17.9. SSSR z východu
🔑 1940: pád Dánska, Norska, Beneluxu a Francie (22.6.); bitva o Británii (Hitler invazi odpískal)
🔑 BARBAROSSA: 22.6.1941 útok na SSSR; bitva o Moskvu (zima 1941) = první velký neúspěch
🔑 GLOBÁLNÍ VÁLKA: 7.12.1941 Pearl Harbor → vstup USA
🔑 ZLOM 1942–43: Midway (VI/1942), El Alamein (XI/1942), Stalingrad (do 2.2.1943)`,
      content: `
ROZPOUTÁNÍ VÁLKY (1939):
• 1.9.1939: Německo přepadlo Polsko (záminka – inscenovaný přepad vysílačky v Glivicích) – nasazení taktiky blitzkrieg (bleskové války: tanky + letectvo + rychlý postup)
• 3.9.1939: Velká Británie a Francie vyhlásily Německu válku
• 17.9.1939: SSSR podle paktu Ribbentrop–Molotov obsadil východní Polsko → Polsko rozděleno
• Podzim 1939 – jaro 1940: „podivná válka" (Sitzkrieg) na západní frontě – Spojenci nezahájili ofenzivu
• 30.11.1939: SSSR napadl Finsko (zimní válka) – Finové kladli statečný odpor

NĚMECKÉ ÚSPĚCHY 1940:
• Duben 1940: obsazení Dánska a Norska (operace Weserübung) – přístup k surovinám a základnám
• 10.5.1940: útok na západě – Nizozemsko, Belgie, Lucembursko, Francie (obchvat Maginotovy linie přes Ardeny)
• Evakuace britských a francouzských vojsk z Dunkerque (květen–červen 1940)
• 22.6.1940: kapitulace Francie (podepsána ve stejném vagonu jako 1918) – sever okupován, na jihu kolaborantský režim ve Vichy (maršál Pétain)
• Bitva o Británii (léto–podzim 1940): Luftwaffe vs. RAF; vyznamenali se i českoslovenští letci; Němci nezískali vzdušnou převahu → Hitler odložil (a nakonec zrušil) invazi (operace Lvoun / Seelöwe)

ROZŠÍŘENÍ KONFLIKTU (1940–41):
• Severní Afrika: italská ofenziva selhala → na pomoc poslán německý Afrikakorps (Erwin Rommel)
• Balkán (jaro 1941): Německo obsadilo Jugoslávii a Řecko, aby zajistilo jižní křídlo před útokem na SSSR

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
"Druhá světová válka začala 1. září 1939 přepadením Polska, které Německo dobylo bleskovou válkou (blitzkrieg); 17. září vpadl podle paktu Ribbentrop–Molotov i SSSR. Po 'podivné válce' Německo na jaře 1940 obsadilo Dánsko, Norsko a Benelux a 22. června donutilo ke kapitulaci Francii. V bitvě o Británii (1940) ale Luftwaffe nezískala vzdušnou převahu – vyznamenali se i českoslovenští letci – a Hitler invazi odpískal. 22. června 1941 zahájil operaci Barbarossa proti SSSR; první velký neúspěch přišel v bitvě o Moskvu (zima 1941). Válka se stala světovou 7. prosince 1941, kdy Japonsko přepadlo Pearl Harbor a do války vstoupily USA. Zlom nastal v letech 1942–43: u Midway (červen 1942) v Pacifiku, u El Alameinu (listopad 1942) v severní Africe a především u Stalingradu (kapitulace 2. února 1943), čímž iniciativa definitivně přešla ke spojencům."
      `
    },
    {
      id: 3,
      title: "Válečné fronty a operace 1943–1945",
      summary: `🔑 KURSK (VII/1943): největší tanková bitva, iniciativa definitivně u SSSR
🔑 ITÁLIE: vylodění na Sicílii (VII/1943), pád Mussoliniho, kapitulace Itálie (IX/1943)
🔑 NORMANDIE: 6.6.1944 (Overlord) = západní fronta; osvobození Paříže (VIII/1944)
🔑 POVSTÁNÍ: Slovenské nár. povstání (VIII/1944), Varšavské povstání (VIII–X/1944)
🔑 KONEC: pád Berlína, kapitulace 8.5.1945; Hirošima/Nagasaki, Japonsko 2.9.1945`,
      content: `
VÝCHODNÍ FRONTA – SOVĚTSKÝ POSTUP:
• Bitva u Kurska (červenec 1943): největší tanková bitva dějin; Hitler musel přerušit postup kvůli přesunu jednotek na Sicílii → iniciativa definitivně přešla k Rudé armádě
• Operace Bagration (léto 1944): zničení německé skupiny armád Střed, rychlý postup Rudé armády na západ

ITÁLIE – „MĚKKÉ PODBŘIŠÍ EVROPY":
• Červenec 1943: vylodění Spojenců na Sicílii, poté v jižní Itálii
• Pád Mussoliniho (červenec 1943), kapitulace Itálie (září 1943) – Němci ale obsadili sever, boje pokračovaly (Monte Cassino)

ZÁPADNÍ FRONTA – DEN D:
• 6.6.1944: vylodění v Normandii (operace Overlord) – největší kombinovaná výsadková operace dějin; otevření plnohodnotné fronty v západní Evropě
• Klíčová byla absolutní vzdušná převaha Spojenců a počasí (viz samostatný text Normandie)
• Srpen 1944: osvobození Paříže; postup Spojenců k německým hranicím

POVSTÁNÍ A ZÁVĚR NA VÝCHODĚ:
• Slovenské národní povstání (srpen 1944) – potlačeno, ale významný odbojový akt
• Varšavské povstání (srpen–říjen 1944) – Armija krajowa; krvavě potlačeno, Rudá armáda zůstala stát za Vislou
• Ardenská ofenziva (prosinec 1944 – leden 1945): poslední velká německá ofenziva na západě – neúspěšná

PORÁŽKA NĚMECKA:
• Únor 1945: Jaltská konference (viz téma 4)
• Duben 1945: bitva o Berlín; 30.4.1945 Hitler spáchal sebevraždu
• Pražské povstání (5.–9.5.1945)
• 8.5.1945 (v Moskvě 9.5.): bezpodmínečná kapitulace Německa – konec války v Evropě

PORÁŽKA JAPONSKA:
• Pacifik: americká taktika „přeskakování ostrovů" (Iwo Džima, Okinawa) za cenu těžkých ztrát
• 6.8.1945: svržení atomové bomby na Hirošimu; 9.8.1945 na Nagasaki
• 8.8.1945: SSSR vyhlásil válku Japonsku a vpadl do Mandžuska
• 2.9.1945: kapitulace Japonska (na palubě USS Missouri) – konec 2. světové války

PŘÍKLAD SPRÁVNÉ ODPOVĚDI:
"V letech 1943–45 přešli spojenci do ofenzivy na všech frontách. Na východě sovětské vítězství u Kurska (červenec 1943), největší tankové bitvě dějin, definitivně přeneslo iniciativu na Rudou armádu, která operací Bagration (1944) postupovala na západ. Spojenci se v červenci 1943 vylodili na Sicílii a v Itálii, padl Mussolini a Itálie kapitulovala. Klíčovým okamžikem bylo vylodění v Normandii 6. června 1944 (operace Overlord) – otevření plnohodnotné západní fronty a osvobození Paříže. Proběhla povstání (slovenské i varšavské) a poslední německá ofenziva v Ardenách (zima 1944/45) selhala. Po Jaltě následovala bitva o Berlín, 30. dubna 1945 Hitlerova sebevražda a 8. května (v Moskvě 9. května) kapitulace Německa. V Pacifiku ukončily válku atomové bomby na Hirošimu a Nagasaki (6. a 9. srpna 1945) spolu se vstupem SSSR; Japonsko kapitulovalo 2. září 1945, čímž skončila druhá světová válka."
      `
    },
    {
      id: 4,
      title: "Velká trojka + TEXT: Jaltská konference a její mýtus (Smetana)",
      summary: `🔑 KONFERENCE: Teherán (1943), Jalta (2/1945), Postupim (7–8/1945)
🔑 VELKÁ TROJKA: Roosevelt (USA), Churchill (VB), Stalin (SSSR)
🔑 JALTA: okupační zóny, zóna pro Francii, OSN, vstup SSSR proti Japonsku, Polsko
🔑 MÝTUS: Jalta NEROZDĚLILA sféry vlivu – Deklarace o osvobozené Evropě (bez sankcí)
🔑 ČSR: do sovětské sféry vstoupila dobrovolně (smlouva XII/1943), na Jaltě se neřešila`,
      content: `
KONFERENCE VELKÉ TROJKY:
• Teherán (listopad–prosinec 1943): první setkání Roosevelta, Churchilla a Stalina; dohoda o otevření druhé fronty ve Francii, o Curzonově linii jako budoucí hranici Polska
• Jalta (4.–11.2.1945, Krym): klíčové uspořádání poválečné Evropy
• Postupim (červenec–srpen 1945): Truman (místo zemřelého Roosevelta), Attlee (vystřídal Churchilla) a Stalin; „4 D" pro Německo (denacifikace, demilitarizace, demokratizace, decentralizace/dekartelizace), hranice na Odře–Nise, odsun Němců

VÝSLEDKY JALTY:
• Vznik okupačních zón v Německu; Churchill prosadil samostatnou zónu i pro Francii (protiváha SSSR)
• Reparace: rámcová částka 20 mld. dolarů (polovina pro SSSR), Britové proti → postoupeno komisi
• Za příslib vstupu do války proti Japonsku (do 3 měsíců po skončení bojů v Evropě) si Stalin vyjednal zisky na Dálném východě (jižní Sachalin, Kurily, práva v Číně)
• Deklarace o osvobozené Evropě: garance práva národů svobodně si zvolit vládní formu (odvolání na Atlantickou chartu 1941)
• Polsko: reorganizace prozatímní (lublinské) vlády „na širším demokratickém základě" + příslib svobodných voleb

JALTSKÝ MÝTUS (Vít Smetana, LN 2010):
• Mýtus tvrdí, že velmoci si na Jaltě rozdělily sféry vlivu – ve skutečnosti to není pravda
• Původ omylu už v goebbelsovské propagandě (jaro 1945); v ČR živná půda ve zkušenosti Mnichova (obraz „proradného Západu")
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
• Hlavní motiv: Roosevelt chtěl udržet poválečnou spolupráci a hlavně sovětskou účast v OSN (osa jeho úvah); chřadnoucí prezident se nechtěl spolčovat s Churchillem

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
"Poválečné uspořádání řešila Velká trojka – Roosevelt, Churchill a Stalin – na třech konferencích. V Teheránu (1943) se dohodli na otevření druhé fronty a na Curzonově linii jako budoucí hranici Polska. Na Jaltě (únor 1945) byly stanoveny okupační zóny v Německu (včetně zóny pro Francii), reparace, vstup SSSR do války proti Japonsku, reorganizace polské vlády a Deklarace o osvobozené Evropě. V Postupimi (léto 1945) Truman, Attlee a Stalin rozhodli o 'čtyřech D' pro Německo, hranici na Odře–Nise a odsunu Němců. Vít Smetana ve svém textu vyvrací rozšířený 'jaltský mýtus', podle něhož si velmoci na Jaltě rozdělily sféry vlivu – ve skutečnosti Deklarace o osvobozené Evropě vznik sfér vlivu odmítala, jen postrádala kontrolní a sankční mechanismy. Mýtus má původ už v goebbelsovské propagandě a v českém prostředí živnou půdu ve zkušenosti Mnichova. Klíčové je, že Československo se do sovětské sféry dostalo dobrovolně už čs.-sovětskou smlouvou z prosince 1943 a na Jaltě se o něm vůbec nejednalo."
      `
    },
    {
      id: 5,
      title: "Výsledky a důsledky 2. světové války",
      summary: `🔑 ZTRÁTY: nejkrvavější konflikt dějin (~50–70 mil mrtvých, většinou civilisté; SSSR ~27 mil)
🔑 NORIMBERK: proces s nacistickými zločinci (1945–46), „zločiny proti lidskosti"
🔑 OSN: založena 1945 (San Francisco); Rada bezpečnosti, 5 stálých členů + právo veta
🔑 ROZDĚLENÍ: Německo 4 okupační zóny → SRN a NDR (1949); bipolární svět USA × SSSR
🔑 NÁSLEDKY: studená válka, dekolonizace, odsun Němců, posun hranic, atomový věk`,
      content: `
LIDSKÉ A MATERIÁLNÍ ZTRÁTY:
• Nejkrvavější konflikt v dějinách lidstva – odhady 50 až 70 milionů mrtvých
• Poprvé v moderních dějinách převažovaly civilní oběti nad vojenskými (bombardování měst, holocaust, vyhlazovací politika)
• Nejvíce obětí: SSSR (~27 mil.), Čína, Polsko, Německo
• Rozsáhlá devastace evropských a asijských měst a hospodářství

POTRESTÁNÍ VÁLEČNÝCH ZLOČINCŮ:
• Norimberský proces (1945–1946): mezinárodní tribunál s vůdčími představiteli nacistického Německa
• Nově definovány „zločiny proti míru", „válečné zločiny" a „zločiny proti lidskosti"
• Podobné procesy probíhaly i s japonskými představiteli (Tokijský proces)

NOVÉ MEZINÁRODNÍ USPOŘÁDÁNÍ:
• Organizace spojených národů (OSN) – založena 1945 (konference v San Franciscu); cíl: zachování míru a kolektivní bezpečnosti
• Rada bezpečnosti s 5 stálými členy (USA, SSSR, VB, Francie, Čína) a právem veta
• Nahradila neúspěšnou Společnost národů

ROZDĚLENÍ EVROPY A POČÁTEK STUDENÉ VÁLKY:
• Německo rozděleno na 4 okupační zóny (USA, VB, Francie, SSSR), Berlín taktéž → 1949 vznik SRN a NDR
• Svět se stal bipolárním – dvě supervelmoci USA a SSSR
• „Železná opona" rozdělila Evropu na západní (demokratický) a východní (sovětský) blok → počátek studené války
• Sovětizace střední a východní Evropy (včetně Československa – únor 1948)

DALŠÍ DŮSLEDKY:
• Posun hranic: Polsko posunuto na západ (hranice na Odře–Nise), SSSR si ponechal zisky z let 1939–1941
• Odsun (transfer) německého obyvatelstva z Československa, Polska a dalších zemí
• Urychlení dekolonizace – oslabené koloniální mocnosti, vzestup národně osvobozeneckých hnutí
• Atomový věk – jaderné zbraně se staly faktorem mezinárodní politiky (jaderné odstrašení)
• Zkušenost holocaustu vedla mj. ke vzniku státu Izrael (1948) a k rozvoji ochrany lidských práv

PŘÍKLAD SPRÁVNÉ ODPOVĚDI:
"Druhá světová válka byla nejkrvavějším konfliktem dějin – zahynulo 50 až 70 milionů lidí, poprvé převážně civilistů (nejvíce v SSSR, kolem 27 milionů). Váleční zločinci byli souzeni v Norimberském procesu (1945–46), kde byly nově definovány zločiny proti lidskosti. V roce 1945 vznikla OSN s Radou bezpečnosti jako nástupce neúspěšné Společnosti národů. Německo bylo rozděleno na čtyři okupační zóny (roku 1949 vznikly SRN a NDR) a svět se stal bipolárním – se dvěma supervelmocemi, USA a SSSR. 'Železná opona' rozdělila Evropu a začala studená válka; střední a východní Evropa byla sovětizována (v Československu únor 1948). Hranice se posunuly (Polsko na západ k Odře–Nise), proběhl odsun Němců, urychlila se dekolonizace a začal atomový věk. Zkušenost holocaustu navíc přispěla ke vzniku Izraele (1948) i k rozvoji mezinárodní ochrany lidských práv."
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
🔑 OBĚTI: ~6 mil Židů (2/3 evropských), nejvíce Polsko (3 mil); + Romové, Slované, ZSSR-zajatci aj.
🔑 ENDLÖSUNG: „konečné řešení židovské otázky" – průmyslové vyvražďování (Cyklon B)
🔑 TÁBORY: 6 vyhlazovacích táborů v dnešním Polsku (Osvětim, Treblinka, Bełżec, Sobibór, Majdanek, Chełmno)
🔑 SPORY: popírání holocaustu (trestné), „holocaustový průmysl" (Finkelstein)`,
      content: `
TERMINOLOGIE:
• Holocaust (z řeckého holokauston – „celopal", náboženská obětina spalovaná celá); autorem novodobého užití je Elie Wiesel (román Noc, 1958)
• Šoa (hebrejsky „zničení, záhuba") – výraz preferovaný Židy, omezený na 2. světovou válku
• Porajmos (romsky „zničení") – pro genocidu Romů
• Holocaust = systematické a státem provozované pronásledování a vyvražďování Židů nacistickým Německem a jeho spojenci

OBĚTI:
• Hlavní obětí byli Židé – praktická aplikace „konečného řešení židovské otázky" (Endlösung der Judenfrage)
• Obvykle uváděný počet: 6 milionů (Raul Hilberg uvádí 5,2 milionu) – zhruba 2/3 evropských Židů
• Nejvíce obětí z Polska (cca 3 miliony mrtvých)
• Další vyvražďované skupiny: sovětští zajatci (2–3 mil.), Poláci (1,8–2 mil.), političtí vězni (1–1,5 mil.), Srbové, Romové (220–500 tis., čtvrtina až polovina jejich populace), hendikepovaní, svobodní zednáři, Svědkové Jehovovi, homosexuálové, Slované
• Při širším pojetí (i další skupiny) bývá celkový počet uváděn až ~30 milionů

PRŮBĚH A PROVEDENÍ:
• Postup: protižidovské zákony → ghetta → pogromy a polovojenská komanda (Einsatzgruppen) → transporty → koncentrační a vyhlazovací tábory
• Nejhrůznějším prostředkem byly vyhlazovací tábory – „továrny na smrt" (zastřelení, oběšení, plyn – nejčastěji Cyklon B; mrtvoly spalovány)
• Po přepadení SSSR (22.6.1941) zřízeno na území Polska šest vyhlazovacích táborů:
- Chełmno (Kulmhof)
- Osvětim (Auschwitz-Birkenau) – velitel Rudolf Höß, 630 tis. – 1,4 mil. obětí
- Majdanek
- Bełżec
- Sobibór
- Treblinka (nejméně 870 tis. obětí)
• Osvobození Osvětimi Rudou armádou 27.1.1945 → 27. leden = Mezinárodní den památky obětí holocaustu

ŠOA V ČESKÝCH ZEMÍCH:
• Před válkou žilo na území dnešní ČR přes 120 tisíc Židů; ~26 tisícům se podařilo emigrovat (do roku 1941, kdy začaly transporty)
• Přes 80 tisíc osob bylo během holocaustu zavražděno
• Kritizováno bývá rozhodnutí Československa z roku 1938 zakázat vstup rakouským Židům a vracet uprchlíky do rukou nacistů

RŮZNÝ PŘÍSTUP ZEMÍ:
• Slovenský štát – Židy vydával z vlastní iniciativy a za jejich odvoz dokonce platil
• Maďarsko – masové deportace až 1944 pod nátlakem nacistů
• Itálie – velmi vlažný přístup, byť přijala protižidovské zákony
• Finsko – odmítlo přijmout protižidovské zákony i vydat Židy
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
• Maďarsko (příp. Bulharsko): k masovým deportacím došlo až 1944 pod nátlakem nacistů; Bulharsko naopak ochránilo většinu Židů z vlastního území, ale vydalo Židy z okupovaných oblastí

OTÁZKA 5: Proč, kým a jak je holocaust zpochybňován?
• Kdo: popírači jako Ernst Zündel, David Irving, Robert Faurisson, Fred Leuchter
• Jak: od popírání existence přes zlehčování až po zbavování nacistů odpovědnosti („osvětimská lež")
• Proč: snaha o revizi výsledků WWII, antisemitismus, odpor ke státu Izrael; v ČR je popírání trestným činem

OTÁZKA 6: Vysvětlete pojem „holocaustový průmysl".
• Pojem Normana Finkelsteina (sám židovského původu) z knihy Průmysl holocaustu
• Nezpochybňuje holocaust, ale kritizuje zneužívání jeho památky – kapitalizaci utrpení, pózu ublíženectví, argumentaci holocaustem v politických zájmech (zejména Izraele)
• V některých bodech se překrývá s antisionismem

PŘÍKLAD SPRÁVNÉ ODPOVĚDI:
"Šoa (holocaust) bylo systematické, státem organizované pronásledování a vyvražďování Židů nacistickým Německem jako praktická aplikace 'konečného řešení židovské otázky'. Zahynulo přibližně 6 milionů Židů, tedy zhruba dvě třetiny evropské židovské populace, nejvíce z Polska (asi 3 miliony). Vedle Židů byly vyvražďovány i další skupiny – sovětští zajatci, Poláci, Romové (porajmos), hendikepovaní, političtí odpůrci či homosexuálové. Postup vedl od protižidovských zákonů přes ghetta a polovojenská komanda (Einsatzgruppen) až k vyhlazovacím táborům, jichž šest vzniklo na území dnešního Polska (Osvětim, Treblinka, Bełżec, Sobibór, Majdanek, Chełmno) a kde se vraždilo plynem Cyklon B. V českých zemích bylo zavražděno přes 80 tisíc Židů. Jednotlivé země se zachovaly různě – Dánsko své Židy zachránilo, zatímco Slovenský štát je vydával z vlastní iniciativy. Holocaust je dnes terčem popírání (v ČR trestný čin), které vychází z antisemitismu a snahy revidovat výsledky války; samostatným jevem je 'holocaustový průmysl' Normana Finkelsteina, jenž kritizuje zneužívání památky obětí, aniž by holocaust zpochybňoval."
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
      explanation: "V Katyni byli povražděni polští důstojníci. Masový hrob odhalen 1943; zodpovědnost NKVD přiznal SSSR teprve v roce 1990."
    },
    {
      question: "Čím bylo zahájeno přepadení Polska 1.9.1939?",
      options: ["Vyhlášením války ze strany VB", "Inscenovaným přepadem vysílačky v Glivicích", "Bombardováním Londýna", "Vyloděním v Gdaňsku"],
      correct: 1,
      explanation: "Záminkou pro útok na Polsko 1.9.1939 byl inscenovaný (předstíraný) přepad německé vysílačky v Glivicích."
    },
    {
      question: "Proč Hitler nakonec odložil a zrušil invazi do Británie (operace Lvoun)?",
      options: ["Kvůli útoku na SSSR", "Luftwaffe nezískala v bitvě o Británii vzdušnou převahu", "Kvůli vstupu USA do války", "Kvůli vylodění v Normandii"],
      correct: 1,
      explanation: "V bitvě o Británii (1940) Luftwaffe nezískala absolutní vzdušnou převahu nad RAF, takže Hitler invazi odpískal. Vyznamenali se i čs. letci."
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
      question: "Která bitva znamenala zlom v Tichomoří ve prospěch USA?",
      options: ["Pearl Harbor", "Midway (1942)", "Okinawa", "Iwo Džima"],
      correct: 1,
      explanation: "Bitva u Midway (červen 1942) zastavila japonskou expanzi a byla zlomem v pacifické válce."
    },
    {
      question: "Co bylo zvláštního na bitvě u Kurska (červenec 1943)?",
      options: ["První použití tanků", "Největší tanková bitva; Hitler ji přerušil kvůli Sicílii", "Vylodění Spojenců", "Poslední německá ofenziva"],
      correct: 1,
      explanation: "Kursk byl největší tankovou bitvou dějin. Hitler musel přerušit postup a přesunout jednotky na Sicílii → iniciativa definitivně u SSSR."
    },
    {
      question: "Pod jakým krycím názvem proběhlo vylodění v Normandii 6.6.1944?",
      options: ["Barbarossa", "Overlord", "Weserübung", "Bagration"],
      correct: 1,
      explanation: "Vylodění v Normandii (Den D, 6.6.1944) probíhalo pod názvem operace Overlord – největší kombinovaná výsadková operace dějin."
    },
    {
      question: "Která byla poslední velká německá ofenziva na západní frontě?",
      options: ["Bitva o Británii", "Ardenská ofenziva (1944–45)", "Operace Overlord", "Bitva o Berlín"],
      correct: 1,
      explanation: "Ardenská ofenziva (prosinec 1944 – leden 1945) byla poslední velkou německou ofenzivou na západě a skončila neúspěchem."
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
      question: "Jaká byla hlavní slabina Deklarace o osvobozené Evropě (Jalta)?",
      options: ["Nebyla nikdy podepsána", "Postrádala kontrolní a sankční mechanismy", "Týkala se jen Německa", "Odmítl ji Roosevelt"],
      correct: 1,
      explanation: "Deklarace slibovala svobodnou volbu vlády, ale postrádala kontrolní i sankční mechanismy, takže ji Stalin mohl beztrestně ignorovat."
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
      question: "Kolik Židů přibližně zahynulo během holocaustu?",
      options: ["Asi 600 tisíc", "Asi 1 milion", "Asi 6 milionů (cca 2/3 evropských Židů)", "Asi 30 milionů"],
      correct: 2,
      explanation: "Obvykle se uvádí cca 6 milionů zavražděných Židů (Hilberg 5,2 mil.) – zhruba dvě třetiny evropských Židů. Nejvíce z Polska (~3 mil.)."
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
              2. světová válka • Fronty • Velká trojka • Šoa • 1939–1945
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
                Test pokrývá <strong>7 témat</strong> z období 2. světové války (1939–1945). U témat <strong style={{color: '#4CAF50'}}>1, 4, 6 a 7</strong> jsou navíc <strong style={{color: '#4CAF50'}}>OTÁZKY Z TEXTU (OTAZ)</strong> – nauč se strukturu a klíčové vzorové odpovědi. Každé téma má rychlé shrnutí (🔑) i podrobný výklad.
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
              <p style={{ color: '#888', margin: 0 }}>Klíčové body ze všech 7 témat na jednom místě</p>
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
                <p style={{ color: '#aaa', marginBottom: '2rem', fontSize: '1.1rem' }}>{studyData.quizQuestions.length} otázek ze všech 7 témat</p>
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
                { title: '📅 Klíčová data k zapamatování', text: '23.8.1939 – pakt Ribbentrop–Molotov\n1.9.1939 – přepadení Polska = začátek WWII\n3.9.1939 – VB a Francie vyhlásily válku\n17.9.1939 – SSSR obsadil východní Polsko\n22.6.1940 – kapitulace Francie\nléto–podzim 1940 – bitva o Británii\n27.9.1940 – Pakt tří (osa Berlín–Řím–Tokio)\n22.6.1941 – operace Barbarossa (útok na SSSR)\n7.12.1941 – Pearl Harbor → vstup USA\nVI/1942 – Midway; XI/1942 – El Alamein\n2.2.1943 – kapitulace u Stalingradu\nVII/1943 – Kursk + vylodění na Sicílii\nXI–XII/1943 – Teheránská konference\n6.6.1944 – vylodění v Normandii (Overlord)\n4.–11.2.1945 – Jaltská konference\n30.4.1945 – sebevražda Hitlera\n8.5.1945 – kapitulace Německa\n6. a 9.8.1945 – Hirošima a Nagasaki\n2.9.1945 – kapitulace Japonska = konec WWII' },
                { title: '👤 Klíčové osobnosti', text: 'Adolf Hitler – vůdce nacistického Německa\nJosif Stalin – sovětský diktátor (Velká trojka)\nF. D. Roosevelt – prezident USA (Velká trojka), zemřel IV/1945\nWinston Churchill – britský premiér (Velká trojka)\nHarry Truman – prezident USA po Rooseveltovi (Postupim, atom. bomba)\nVjačeslav Molotov – sovětský ministr zahraničí\nDwight Eisenhower – vrchní velitel spojeneckých sil (Normandie)\nErwin Rommel – velitel Afrikakorpsu („pouštní liška")\nFriedrich Paulus – velitel německé 6. armády u Stalingradu\nJiří Rajlich – historik (text o Normandii a „druhé frontě")\nVít Smetana – historik (text o jaltském mýtu)\nNorman Finkelstein – pojem „holocaustový průmysl"' },
                { title: '📝 Klíčové pojmy', text: 'Blitzkrieg = bleskové války (tanky + letectvo)\nPakt tří = osa Berlín–Řím–Tokio (1940)\nBarbarossa = útok na SSSR (22.6.1941)\nOverlord = vylodění v Normandii (6.6.1944)\nReichskommissariat = německá okupační správa (Ostland, Ukrajina)\nUPA = Ukrajinská povstalecká armáda\nArmija krajowa (AK) = polská Domácí armáda\nLend-lease = americké dodávky spojencům (i SSSR)\nVelká trojka = Roosevelt, Churchill, Stalin\nDeklarace o osvobozené Evropě = Jalta (bez sankcí)\nEndlösung = „konečné řešení židovské otázky"\nŠoa / holocaust = vyvražďování Židů\nCyklon B = plyn používaný ve vyhlazovacích táborech\n„Holocaustový průmysl" = pojem N. Finkelsteina' },
                { title: '🤝 Konference Velké trojky', text: 'Teherán (XI–XII/1943) – Roosevelt, Churchill, Stalin; dohoda o druhé frontě, Curzonova linie\nJalta (II/1945) – okupační zóny, zóna pro Francii, OSN, vstup SSSR proti Japonsku, reorganizace polské vlády, Deklarace o osvobozené Evropě\nPostupim (VII–VIII/1945) – Truman, Attlee, Stalin; „4 D" pro Německo, hranice Odra–Nisa, odsun Němců' },
                { title: '🗺️ Zlomové bitvy a fronty', text: 'Bitva o Británii (1940) – Hitler invazi odpískal\nBitva o Moskvu (zima 1941) – první velký neúspěch\nMidway (VI/1942) – zlom v Pacifiku\nEl Alamein (XI/1942) – zlom v severní Africe\nStalingrad (do 2.2.1943) – zlom na východní frontě\nKursk (VII/1943) – největší tanková bitva\nNormandie (6.6.1944) – západní fronta\nArdeny (zima 1944/45) – poslední německá ofenziva' },
                { title: '🕯️ Šoa – co si zapamatovat', text: '~6 milionů zavražděných Židů (2/3 evropských)\nNejvíce obětí z Polska (~3 miliony)\n6 vyhlazovacích táborů – všechny v dnešním Polsku\n(Osvětim, Treblinka, Bełżec, Sobibór, Majdanek, Chełmno)\nEndlösung = „konečné řešení"; plyn Cyklon B\n27.1. = Den památky obětí (osvobození Osvětimi)\nRůzný přístup zemí: Dánsko zachránilo své Židy × Slovenský štát je vydával\nPopírání holocaustu = trestný čin\n„Holocaustový průmysl" (Finkelstein) ≠ popírání' },
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
