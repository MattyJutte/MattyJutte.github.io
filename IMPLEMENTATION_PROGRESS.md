# Implementatievoortgang

## Opdracht en aanpak

Bestaande Next.js/React/TypeScript-portfolio behouden; uitsluitend lokaal werken,
geen publicatie. Paarse accenten en bestaande NL/EN- en themakeuze hergebruiken.
Spellen laden op verzoek, gedeelde toegankelijke dialogen en veilige lokale opslag.
Geen nieuwe runtime-dependencies. Geen AGENTS.md aangetroffen; werkboom was schoon.

## Volledige checklist

- [x] Bestaande bestanden, configuratie en wijzigingen inspecteren.
- [x] Drie minigolfholes, slepen/touch, richting/kracht, alternatief toetsen/knoppen.
- [x] Betrouwbare botsingen, remmen, hole-detectie, vastloopherstel, scores/record.
- [x] Golf sluiten/hervatten, hole opnieuw en hele ronde opnieuw.
- [x] Lab gekoppeld aan skills: BFS, start/eind, muren tekenen/wissen, touch.
- [x] Lab starten/pauzeren/reset/snelheid/voorbeeld, geen-route-uitkomst.
- [x] Begrijpelijke uitleg en echte relevante codeweergave.
- [x] Bestaande sterrenbol/MJ uitbreiden: snelheid, kracht, vormen, reset/uitleg.
- [x] Drie kleine verrassingen met tikken/toetsenbord en feedback.
- [x] Konami, vijf logotikken, toegankelijk alternatief en Arcade uitzetten.
- [x] Speelbare reactietest met te vroeg, resultaat, opnieuw en record.
- [x] Ontdekkingenboekje: voortgang, hints, opnieuw openen, opslag/reset/fallback.
- [x] Mobiel 320px, rotatie, talen/thema's, focus/Escape/herstel, reduced motion.
- [x] Lazy loading, zichtbaarheidspauze en cleanup.
- [x] Gerichte logica-tests (BFS, botsingen, scores, geheimen, opslag).
- [x] Lint, TypeScript en productiebuild/statische export.
- [x] Echte browsercontrole desktop/mobiel, talen/thema's, interacties/runtime.
- [x] README met onderdelen, bediening, opbouw, opslag en controles.
- [x] Definitieve oplevering.

## Besluiten

- Ontdekkingenboekje als bescheiden vaste knop; minigolf bij Golf & tennis.
- Compacte labuitnodiging onder skills; zwaar raster alleen in spelpaneel.
- Drie verrassingen: MJ-deeltjes, skill-signaal en een eigen footerrobotje.
- Native dialog voor focus/inert/Escape, flexibele scrollhoogte voor kleine schermen.
- Spellogica in losse pure TypeScript-modules, getest met Node's test runner.

## Uitgevoerde controles

- Repository, hoofdcomponenten en configuratie gelezen; statische export aanwezig.

## Stap 1 — gebouwd

Alle verplichte ervaringen en ingangen zijn aangesloten. Golf hervat de huidige ronde
na sluiten; BFS toont code uit het echte bronbestand (kopie bij predev/prebuild).
Op verzoek geladen spelmodules, native dialog, veilige opslag en rustige weergave.

## Uitgevoerde controles (eerste ronde)

- Lint en TypeScript geslaagd.
- 11 gerichte logica-tests geslaagd, inclusief botsingen bij 72 richtingen en een
  volledig speelbaar traject door elk van de drie holes.
- Turbopack kan binnen deze omgeving geen CSS-compilerpoort openen.
- Webpack-productiebuild buiten sandbox compileert en typecheckt succesvol; export
  wordt afgerond. Geen productconfiguratie gewijzigd voor dit omgevingsprobleem.
- Playwright tijdelijk in /tmp geïnstalleerd; geen projectdependency toegevoegd.
- Chromium binnen sandbox mist systeemlibraries; browsercontrole buiten sandbox
  wordt geprobeerd.

## Stap 2 — controles en verbeteringen

- Statische Webpack-export geslaagd; buiten sandbox wegens lokale compilerpoort.
- Playwright en drie ontbrekende systeemlibraries uitsluitend in /tmp gezet.
- Echte HTTP-preview op 127.0.0.1:3107; Chromium 153.
- Desktop NL/donker visueel bekeken: hero, sterrenatelier, BFS en minigolf.
- 320px lab visueel bekeken; raster-aanraakvlak 24,8×24,8px, knoppen minimaal 44px.
- Browser bevestigt BFS pauze/route/geen-route en laden van echte code.
- Escape sluit en herstelt focus naar de oorspronkelijke labknop.
- Volledige golfronde via echte UI voltooid: alle holes, drag, toetsenbord,
  sluiten/hervatten, resultaat, record, strafslag en opnieuw proberen.
- Verbeteringen: aaneengesloten muurstreken tussen pointer-samples; lab pauzeert
  buiten beeld; reset maakt bewaarde golfronde ongeldig om gewiste records te houden.
- Code geformatteerd; lint, TypeScript en 11 logica-tests slagen.

## Openstaande problemen / volgende stap

Nieuwe definitieve export bouwen na verbeteringen. Browserflows voor Arcade,
boekje/opslag/reset, beide talen/thema's, mobiel/touch/rotatie/reduced motion afronden.
Testselectors voor knopdecoraties en witruimte aangepast; nog geen runtimefouten gevonden.

## Stap 3 — focusverbetering

Gerichte echte browsercontrole vond dat focus op BODY terechtkwam bij wisselen
van boekje naar spel. De gedeelde dialog focust nu de sluitknop bij een nieuwe titel
en zet de scrollpositie terug. Laadstatus ook naar NL/EN vertaald.
Nieuwe export en gerichte hercontrole volgen na de overige workflows.

## Stap 4 — desktop afgerond, mobiel afronden

Desktopbrowserchecks geslaagd: alle holes/resultaat/record, herstel/retry, Konami,
reactietest te vroeg en geldig resultaat, retro aan/uit, 7 ontdekkingen, rustige
weergave, focusbegrenzing, herladen, reset, invoervelden negeren, NL/EN en donker/licht.
320px: geen horizontale overflow, vijf logotikken, Arcade en lab passen, touch tekent.
Mobiele gereedschapknoppen reageren nu ook direct op pointerup van een aanraking;
dat werkt na pointercapture ook wanneer Chromium geen compatibiliteitsklik verzendt.
Focusherstel bij wisselen van paneel, paarse voortgangsbalk en MJ-logo afgerond.
Nieuwe export en laatste mobiele/hercontrole nog uitvoeren.

## Afgerond — definitieve controles

- `npm run lint`: geslaagd.
- `npm run typecheck`: geslaagd.
- `npm test` / directe testuitvoer: 11 logica-tests geslaagd.
- `npm run build -- --webpack`: definitieve statische productie-export geslaagd.
- `git diff --check`: geen witruimtefouten; broncodekopie gelijk aan echt bestand.
- `tests/browser.mjs`: 58 gecombineerde browsercontroles geslaagd, nul runtime- of
  consolefouten, met Chromium 153.0.8010.12 op de echte HTTP-statische export.
- Beide talen en thema's, 320/390px, touch, rotatie, reduced motion, Escape,
  focusbegrenzing/herstel, hervatten/reset/records en ongeldige/geblokkeerde opslag.
- `tests/lifecycle.mjs`: zes aanvullende regressiecontroles geslaagd: animatie
  pauzeert/hervat bij verborgen tab, reset wist een gecachete golfronde zonder reload,
  focus blijft in het nieuwe spel, de complete baan past in 320/390px landschap,
  touch slaat daar zonder scrollen en er zijn geen runtimefouten.
- Visueel bekeken: hero/sterrenatelier, donker NL lab en golf, Arcade/boekje,
  licht EN lab, mobiel NL lab, mobiel licht EN Arcade en complete liggende golfbaan.
- Screenshots en JSON-rapporten: `/tmp/portfolio-qa/`.
- README bevat alle ingangen, bediening, architectuur, opslag, tests en preview.
- Geen wijzigingen gepusht/gepubliceerd. Geen runtime-dependencies toegevoegd.

## Grenzen van de controle

Mobiele bediening is getest met echte Chromium-touch-events in mobiele emulatie,
geen fysiek toestel. Safari en Firefox zijn niet uitgevoerd. De standaard Turbopack
build kon door de compilerpoortbeperking van de omgeving niet worden gevalideerd;
dezelfde Next.js-productie-export is volledig met Webpack gebouwd. De bestaande
Next/GitHub Pages-configuratie en workflow zijn behouden.

## Openstaande problemen / volgende stap

Geen openstaande implementatieproblemen. Klaar voor lokale review. Start eventueel
`npm exec serve -- out --listen 3107` en bezoek `http://localhost:3107`.
