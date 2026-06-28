# MyBuild — Drone-werfopvolging als dienst: validatie & haalbaarheid

## 0. Het idee in één zin

> Een abonnementsdienst die op vaste frequentie (bv. wekelijks/maandelijks) **dezelfde
> gestandaardiseerde dronevlucht** boven een werf uitvoert, daaruit **orthomosaics, 3D-
> modellen en puntenwolken** genereert, en die ontsluit via een **werfspecifieke website**
> die de bouwheer, werfleider en onderaannemers kunnen raadplegen om de voortgang op te
> volgen.

De `EmbedBlock` + `Iframe`-component die al in deze codebase zit, is precies de bouwsteen
om per werf een orthomosaic-/3D-viewer in te bedden. Het idee en de bestaande code passen
dus naadloos samen.

---

## 1. Validatie: is er een echt probleem?

Ja — en dit is een bewezen markt, geen gok.

- **De pijn is reëel.** Werfopvolging gebeurt vandaag met losse foto's, manuele metingen
  en plaatsbezoeken. Discussies over voortgang, grondverzet (cut/fill), stockvolumes en
  as-built vs. plan kosten tijd en geld. Drone-data lost dit objectief en herhaalbaar op.
- **Concrete waarde die klanten betalen:**
  - Voortgangsopvolging op afstand (bouwheer/architect moet niet ter plaatse).
  - **Volumemetingen** (grondwerk, stockpiles) — vaak dé killer-feature die het meeste
    geld bespaart.
  - As-built vs. BIM/plan-vergelijking, afwijkingen vroeg detecteren.
  - Documentatie & geschillenbeslechting (tijdgestempelde 0-meting + reeks).
  - Veiligheid en communicatie met onderaannemers.
- **De markt bestaat al** met serieuze spelers (zie §3), wat validatie is *en* een
  waarschuwing: je vindt geen leeg veld.

**Verdict §1:** Het probleem is echt en betalend. De vraag is niet *of* drone-werfopvolging
werkt, maar of **jouw uitvoering** (lokaal, service-gedreven, werfspecifiek portaal) zich
onderscheidt en rendabel is.

---

## 2. Het sterke punt: de "telkens dezelfde vlucht"

Dit is bewust een goed instinct en je belangrijkste technische troef:

- **Geautomatiseerde missieplanning** (DJI Pilot/Terra, DroneDeploy, Litchi) laat je
  exact hetzelfde vluchtpad, hoogte, overlap en camerahoek herhalen. Dat maakt elke
  dataset **direct vergelijkbaar over tijd** — een time-lapse van georefereerde modellen.
- Met vaste **grondcontrolepunten (GCP's)** of RTK/PPK-drone krijg je centimeter-
  nauwkeurigheid en blijven alle vluchten in hetzelfde coördinatenstelsel (Lambert 72 /
  EPSG:31370 voor België) liggen.
- Herhaalbaarheid = **lagere marginale kost per vlucht** (geen herplanning) en een
  product dat vanzelf beter wordt naarmate de reeks groeit.

Dit is precies waar generieke "ik kom eens filmen met mijn drone"-fotografen het laten
afweten. Het is je echte differentiator t.o.v. lokale concurrentie.

---

## 3. Concurrentie (eerlijk beeld)

| Speler | Wat ze doen | Implicatie voor jou |
|---|---|---|
| **DroneDeploy** | Reality-capture platform, vanaf ~$349/maand; flight-app, ortho's, 3D, AI-analytics, voortgang | Doet de software-laag al. Jij kan hierop **bouwen** i.p.v. concurreren. |
| **Propeller Aero** | Earthworks/grondverzet, ~$250 per map, web-portaal met metingen | Sterk in volumes; jouw recurring-portaal is een ander model. |
| **Pix4D / Agisoft Metashape** | Fotogrammetrie-verwerking (desktop/cloud) | Verwerkingsmotor; gereedschap, geen concurrent. |
| **OpenDroneMap / WebODM / Potree** | Open-source verwerking + 3D-/puntenwolk-webviewer | Laat je **zelf hosten** en marges houden; sleutel voor het werfportaal. |
| **Lokale landmeters & drone-fotografen** | Eenmalige opdrachten | Zwak in *recurring* + *werfportaal*; daar zit jouw gat. |

**De kern:** de technologie (vluchten, verwerking, viewers) is een *commodity*. Niemand
heeft een moat op "een ortho maken". Jouw onderscheid moet komen uit **dienstverlening +
het werfspecifieke portaal + lokale aanwezigheid (België/Vlaanderen) + integratie in de
workflow van de werfleider**, niet uit de drone of de software op zich.

---

## 4. Haalbaarheid

### 4a. Technisch — **hoog haalbaar** ✅
Alle bouwstenen bestaan en zijn matuur:
- Hardware: DJI Mavic 3 Enterprise / Matrice 3D/4 (RTK) — paar duizend euro.
- Verwerking: WebODM (zelf-gehost, gratis) of Pix4D/DroneDeploy (cloud, abonnement).
- Hosting/embed: Potree (puntenwolken), Cesium of een ortho-tileserver, of gewoon de
  iframe-share van Pix4Dcloud/DroneDeploy → **rechtstreeks in jouw `EmbedBlock`**.
- Het werfspecifieke portaal = exact wat MyBuild (Payload + Next.js) nu al kan: per werf
  een pagina, embed van de viewer, toegang delen, posts/updates, contactformulier.

### 4b. Regelgeving — **reëel obstakel, beheersbaar** ⚠️
België valt onder de EASA-kaders (EU 2019/947), toezicht door het **DGLV/DGTA**:
- **Operatorregistratie** verplicht (drone > 250 g of Specific category); uniek
  operator-ID gekoppeld aan eID, zichtbaar op de drone.
- Werven liggen vaak **in bebouwde omgeving / nabij mensen / soms in gecontroleerd
  luchtruim** → meestal **Specific category** → operationele machtiging nodig (SORA /
  standaardscenario STS) i.p.v. enkel Open category.
- **Piloot-bekwaamheid**: minstens A2-getuigschrift, voor Specific bijkomende training.
- **Verzekering** (BA luchtvaart) verplicht en niet triviaal in kostprijs.
- Vliegen boven niet-betrokken personen en in steden vergt mitigaties (afzetting,
  tijdslots, lagere hoogte, geofencing-uitzonderingen).

➡️ Dit is geen showstopper, maar het is **weken werk + terugkerende kosten** en het is je
eerste echte toegangsdrempel. Tegelijk is het je **bescherming**: het houdt amateurs buiten.

### 4c. Operationeel — **het echte schaalprobleem** ⚠️
- Je dienst is **fysiek**: iemand moet telkens ter plaatse. Reistijd domineert de kost.
  → Schaalt alleen als werven **geografisch clusteren** (bv. straal rond Gent/Antwerpen).
- Weersafhankelijk (wind, regen) → planning is rommelig; je hebt buffermarges nodig.
- Verwerking + portaal-update kost tijd per vlucht → standaardiseer en automatiseer dit
  pijplijn vanaf dag 1, anders eet het je marge op.

### 4d. Financieel — **plausibel als recurring** ✅/⚠️
Referentiepunten uit de markt: maandelijkse monitoring-contracten lopen typisch
**€500–€2.000 per bezoek**, met korting bij langlopende afspraken; platformkosten
(DroneDeploy) ~€349+/maand.

Illustratief rekenmodel (zelf in te vullen, niet als feit):
- Prijs per werf: bv. €400–€800/maand voor maandelijkse vlucht + portaal + verwerking.
- Marginale kost/vlucht: reistijd + ~1–2 u verwerking + hosting → laag als geclusterd.
- Break-even hardware/licenties: een handvol actieve werven dekt vaste kosten.
- **Hefboom = recurring** + meerdere werven per rit + zelf-gehoste verwerking (marge).

---

## 5. Risico's (en mitigatie)

1. **Dunne moat op de tech.** → Moat zit in service, lokale relaties, en het portaal als
   *systeem of record* voor de werf. Maak het portaal onmisbaar (alle werfdocumenten,
   updates, metingen op één plek), niet enkel een 3D-plaatje.
2. **Fysieke schaalbaarheid / reistijd.** → Geografisch clusteren; per regio uitrollen;
   eventueel later piloten-netwerk i.p.v. zelf elke werf doen.
3. **Regelgeving & verzekering.** → Vroeg in orde brengen; gebruik het als verkoopargument
   ("volledig conform & verzekerd").
4. **"Leuk maar niet essentieel".** → Koppel aan een **harde ROI**: volumemetingen die
   facturatie/grondverzet objectiveren, of geschil-documentatie. Dat verkoopt beter dan
   "mooie 3D".
5. **Afhankelijkheid van dure platformen** (DroneDeploy/Pix4D) knaagt aan marge. → Bouw de
   verwerking/hosting zelf (WebODM + Potree) zodra volume het rechtvaardigt.
6. **Verkoopcyclus in de bouw is traag/conservatief.** → Begin met 1–2 enthousiaste
   aannemers als referentie.

---

## 6. Validatiestappen (goedkoopst eerst)

1. **Eén echte pilootwerf, gratis of tegen kostprijs.** Doe de 0-meting + 2–3
   opeenvolgende vluchten en lever het werfportaal op. Eén echt voorbeeld verkoopt beter
   dan elke pitch — en test meteen je hele pijplijn.
2. **Meet of ze het gebruiken.** Logt de werfleider in? Hoe vaak? Welke laag (ortho? 3D?
   metingen?) wordt bekeken? Dat bepaalt waar de waarde echt zit.
3. **Vraag naar betalingsbereidheid per werf/maand** vóór je iets opschaalt.
4. **Regelgeving + verzekering regelen** parallel aan de piloot (registratie DGLV,
   A2/Specific, BA-verzekering).
5. **3–5 betalende werven in één regio** vóór je in software/automatisering investeert.

---

## 7. Hoe MyBuild (deze codebase) hierin past

Je hebt al de juiste fundering:
- **Payload CMS + Next.js op Vercel** = goedkoop, snel, per-werf pagina's beheersbaar.
- **`EmbedBlock` + `Iframe`** = de werf-viewer (Pix4Dcloud / Potree / DroneDeploy-share)
  inbedden in een werfpagina. De Shift-to-navigate-tooltip is al juist gedacht voor
  scroll-gevoelige 3D-embeds.
- Aan te vullen voor dit model: **per-werf toegang/login** (Payload `Users` + access
  control bestaat al), een **tijdlijn/versies** van vluchten per werf, en eventueel een
  eenvoudige **metingen/annotatie-laag**. Dat maakt het portaal van "embed" naar
  "systeem of record".

---

## 8. Eindoordeel

**Haalbaar en de moeite waard — als focusbedrijf, niet als tech-platform.**

- Het probleem is echt en wordt betaald; de "telkens dezelfde vlucht" is een genuanceerd
  sterk punt dat je onderscheidt van drone-fotografen.
- De technologie is volledig haalbaar en deels al gebouwd in MyBuild.
- De echte beperkingen zijn **regelgeving** (eenmalige drempel) en **fysieke
  schaalbaarheid/reistijd** (structureel) — beheersbaar via regionale clustering en een
  recurring-model.
- De moat ligt **niet** in de drone of de ortho (commodity, sterke incumbents zoals
  DroneDeploy/Propeller) maar in **lokale dienstverlening + een werfportaal dat het
  systeem-of-record voor de werf wordt**.

**Richtscores (indicatief):**
- Probleem/marktvraag: 8/10
- Onderscheidend vermogen: 5/10 (sterk lokaal & service-gedreven, zwak op pure tech)
- Technische haalbaarheid: 9/10
- Operationele schaalbaarheid: 5/10 (fysieke dienst, reistijd)
- Tijd-tot-eerste-omzet: sterk, mits regelgeving vooraf geregeld

**Volgende concrete stap:** zoek één aannemer met meerdere werven in dezelfde regio, doe
één werf gratis als referentie, en lever het werfportaal op via MyBuild. Dat valideert
markt, pijplijn én prijszetting in één beweging.

---

### Bronnen
- DroneDeploy pricing — https://www.dronedeploy.com/pricing
- Drone service / monitoring pricing 2026 — https://www.thedroneu.com/blog/drone-service-cost-guide/
- Belgium drone laws 2026 (EASA, DGLV/DGTA, registratie, Specific category) — https://drone-laws.com/drone-laws-in-belgium/
- EASA — National Aviation Authorities — https://www.easa.europa.eu/en/domains/civil-drones/naa
- Drone mapping software voor bouw (2025 buyer's guide) — https://dronebundle.com/blog/drone-mapping-software-construction-2025-buyers-guide

> Opmerking: regelgeving en prijzen zijn indicatief (kennis tot begin 2026). Verifieer de
> exacte DGLV-vereisten en verzekeringskosten vóór je start.
