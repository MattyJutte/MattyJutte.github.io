# Portfolio — Matty Jutte

Een Nederlands- en Engelstalige portfolio met Next.js App Router, TypeScript en Tailwind CSS. Donker thema als standaard, een opgeslagen licht/donker-voorkeur, responsive navigatie en subtiele scrollanimaties. De website wordt volledig statisch naar `out/` geëxporteerd. GitHub Pages houdt de site online, ook als je laptop uitstaat.

## Lokaal starten

Installeer Node.js 24 (zie `.nvmrc`). Met nvm: `nvm install && nvm use`.

```bash
npm ci
npm run dev
```

Open <http://localhost:3000>. Je wijzigingen worden direct zichtbaar.

```bash
npm run lint        # Controleer de code
npm run typecheck   # Controleer TypeScript (na de eerste build of npm run dev)
npm run build       # Bouw de statische website in out/
npm run preview     # Bekijk de gebouwde site op http://localhost:3000
```

Gebruik voor deze statische site `npm run preview` en niet `next start`. Stop de ontwikkelserver voordat je de preview op dezelfde poort start.

## Inhoud aanpassen

Alle website-inhoud staat in **[`data/content.ts`](data/content.ts)**. Je hoeft componenten niet aan te passen om teksten, links, skills of ervaring te veranderen.

| Wat wil je wijzigen?                   | Waar in `data/content.ts`?        |
| -------------------------------------- | --------------------------------- |
| Naam, e-mail, LinkedIn en GitHub       | `profile`                         |
| Beschikbaarheidsbadge verbergen        | `profile.availableForWork: false` |
| Introductie                            | `hero`                            |
| Persoonlijke introductie               | `about`                           |
| Stageperiode en technische basis       | `internship`                      |
| Skills toevoegen of verwijderen        | `skills.groups[].items`           |
| Profielfoto en alt-tekst               | `profile.photo`                   |
| Werkervaring en opleiding              | `experience`                      |
| Hobby’s                                | `personal.hobbies`                |
| Contacttekst                           | `contact`                         |
| Paginatitel en zoekmachinebeschrijving | `meta`                            |

De opleidingsgegevens vermelden dat je in 2024 je havo hebt afgerond bij Dalton en in 2024 met Software Engineering bent begonnen. Je huidige studiejaar staat op het derde jaar; pas dit zelf aan zodra je naar een volgend studiejaar gaat. De stage bij Competa IT staat op 31 augustus 2026 tot heden; pas die periode ook bij `experience.jobs[0]` aan wanneer je stage eindigt. Een lege LinkedIn-link wordt verborgen. Je GitHub-profiel is overgenomen uit de bestaande Git-remote van deze repository.

### Nederlands en Engels

De **EN/NL-knop** naast de themawisselaar vertaalt de website direct, ook op mobiel. De browser onthoudt de taal via `localStorage`. Wisselen werkt ook als browseropslag is geblokkeerd; alleen het onthouden is dan niet mogelijk. De taal voor schermlezers en de paginabeschrijving veranderen mee. Ook de 404-pagina ondersteunt beide talen.

Beide versies staan in `data/content.ts`: **`content`** bevat Nederlands en **`englishContent`** bevat Engels. Pas teksten en periodes in beide objecten aan. Voeg je een skillcategorie, baan of hobby toe? Werk dan ook de Engelse lijst bij. Gedeelde gegevens zoals e-mail, profiel-URL’s en de bestaande skilllijsten worden overgenomen uit de Nederlandse versie via `...content`.

De teksten zijn vooraf vertaald: er is geen externe vertaaldienst of API nodig. Zonder JavaScript toont de statische site Nederlands.

### CV toevoegen

1. Sla je CV op als PDF met de naam **`cv.pdf`** (kleine letters).
2. Kopieer het naar **`public/cv.pdf`**, naast je profielfoto. Gebruik geen lokaal Windows-pad als link.
3. Start `npm run dev` om de downloadknop bovenaan te bekijken. Herstart de ontwikkelserver als je het bestand net hebt toegevoegd en de melding nog zichtbaar is.
4. Bouw met `npm run build` en push zowel het PDF-bestand als de code naar GitHub. De bestaande workflow publiceert alles samen.

De build controleert of het bestand bestaat. Zonder PDF staat er “CV binnenkort beschikbaar”; met PDF verschijnt automatisch “Download CV” (ook vertaald naar Engels). Het pad staat in `profile.cvPath` in `data/content.ts` en werkt ook met een GitHub Pages-subpad. Je kunt later gewoon het PDF-bestand vervangen en opnieuw pushen. Het CV is publiek downloadbaar: gebruik een versie zonder je thuisadres of telefoonnummer als je die niet openbaar wilt maken.

### Interactieve effecten

Rond de profielfoto staat een interactieve sterrenbol. Beweeg de muis om de punten opzij te duwen of tik op de foto voor een golf door de sterren. Met “Ontdek mijn signatuur” vormen de punten de letters MJ; dezelfde knop brengt de sterrenbol terug. De animatie heeft een pauzeknop, stopt buiten beeld en in een verborgen tabblad en toont een stilstaand patroon bij een voorkeur voor minder beweging. Mobiel scrollen blijft normaal werken. Teksten en initialen staan in `hero.constellation`; de implementatie staat in `components/signature-constellation.tsx`, zonder extra bibliotheken.

Een dunne balk bovenaan volgt de leesvoortgang. Skill- en hobbykaartjes en de foto reageren subtiel op de muis; op touchscreens wordt de muisgloed uitgeschakeld. De contactsectie heeft een kopieerknop met een toegankelijke succes- of foutmelding. De effecten respecteren de systeemvoorkeur voor minder beweging. De componenten staan in `components/interactive-effects.tsx` en `components/copy-email.tsx`; de stijlen staan in `app/globals.css`.

### Profielfoto aanpassen

Je foto staat in **`public/matty-jutte.jpg`** en verschijnt naast je naam bovenaan de website. Het is een kopie van je originele foto; de weergave schaalt mee met het scherm. Het bestand wordt met de statische site meegepubliceerd, zodat je laptop en OneDrive niet nodig zijn om de foto te laden.

Vervang het bestand om een andere foto te gebruiken. Via `profile.photo` in `data/content.ts` kun je de bestandsnaam, afmetingen en Nederlandse alt-tekst aanpassen. De Engelse alt-tekst staat in `englishContent.profile.photo.alt`.

Het jaartal in de footer wordt bij elke build bijgewerkt. De lettertypes worden lokaal meegeleverd; bezoekers hoeven geen Google Fonts te laden.

## Stap voor stap naar GitHub Pages

### 1. Maak de repository aan (als die nog niet bestaat)

Log in op GitHub als `MattyJutte`. Kies **New repository**, geef de naam **`MattyJutte.github.io`** op en kies **Public** voor gratis hosting met GitHub Free. Laat het toevoegen van een README, `.gitignore` en licentie uit als je de lokale bestanden gaat pushen.

Deze lokale repository heeft al de remote `https://github.com/MattyJutte/MattyJutte.github.io.git`. Je kunt dat controleren met:

```bash
git remote -v
```

Als je met een nieuwe lokale map begint die nog geen Git-repository of remote heeft, voer je eenmalig uit:

```bash
git init -b main
git remote add origin https://github.com/MattyJutte/MattyJutte.github.io.git
```

### 2. Controleer de site

```bash
npm ci
npm run lint
npm run build
```

Controleer voordat je publiceert of je teksten, links, studiejaar en werkperiodes nog actueel zijn.

### 3. Push je bestanden

Voer vanuit deze projectmap uit:

```bash
git add .
git commit -m "Bouw persoonlijke portfolio"
git branch -M main
git push -u origin main
```

De broncode en `package-lock.json` worden gepusht. `node_modules`, `.next` en `out` blijven via `.gitignore` lokaal. De workflow bouwt `out` zelf; je hebt geen `gh-pages`-branch nodig.

### 4. Zet GitHub Pages aan

Open de repository op GitHub en ga naar **Settings → Pages → Build and deployment**. Kies bij **Source** de optie **GitHub Actions**. Je hoeft geen nieuwe voorbeeldworkflow toe te voegen; **[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)** staat al klaar.

### 5. Start en controleer de deployment

Elke push naar `main` start de workflow. Is de eerste poging mislukt omdat Pages nog niet aanstond? Ga na stap 4 naar **Actions → Portfolio naar GitHub Pages → Run workflow**, selecteer `main` en klik op **Run workflow**. Je kunt ook de mislukte run opnieuw uitvoeren.

Wacht tot zowel `build` als `deploy` groen zijn. Open daarna **<https://mattyjutte.github.io>**. De deploymentjob en **Settings → Pages** tonen ook de gepubliceerde URL. Je laptop is niet nodig om de gepubliceerde site bereikbaar te houden.

### 6. Later iets wijzigen

Pas `data/content.ts` of je andere bestanden aan en voer uit:

```bash
npm run lint
npm run build
git add .
git commit -m "Werk portfolio bij"
git push
```

GitHub Actions bouwt en publiceert de nieuwe versie automatisch. `workflow_dispatch` maakt handmatig opnieuw publiceren ook mogelijk.

## GitHub Pages en basePath

Voor **`MattyJutte.github.io`** is `basePath` leeg: de site staat op het hoofddomein, niet op `/MattyJutte.github.io`. `next.config.ts` herkent dit tijdens GitHub Actions automatisch, ongeacht hoofdletters in de repositorynaam.

Gebruik je later een gewone projectrepository, bijvoorbeeld `portfolio`? Dan stelt dezelfde configuratie tijdens Actions `basePath: "/portfolio"` in. De URL wordt `https://mattyjutte.github.io/portfolio/`. Ook de fonts, scripts, favicon en profielfoto krijgen dat pad. De workflow voegt niets toe aan de Next.js-configuratie: die logica staat op één plek.

Voor een eigen domein of een handmatig afwijkend pad kun je **`NEXT_PUBLIC_BASE_PATH`** meegeven bij het bouwen. Bijvoorbeeld `NEXT_PUBLIC_BASE_PATH='' npm run build` voor het hoofddomein of `NEXT_PUBLIC_BASE_PATH=/portfolio npm run build` voor een projectpad. Voeg bij een eigen domein dezelfde `env`-waarde toe aan de buildstap van de workflow. Dit pad wordt tijdens de build vastgelegd; bouw opnieuw wanneer het verandert.

## Projectindeling

```text
app/                       Pagina, layout, 404-pagina en stijlen
components/                Navigatie, iconen en scrollanimatie
data/content.ts            Alle aanpasbare website-inhoud
lib/asset-path.ts          Correcte paden voor bestanden uit public/
public/matty-jutte.jpg      Je profielfoto
public/favicon.svg         Eigen MJ-favicon
.github/workflows/deploy.yml Automatisch bouwen en publiceren
```

Kleuren, afmetingen en responsive regels staan in `app/globals.css`. De kleurvariabelen bovenaan hebben een donkere en lichte variant. Tailwind verzorgt onder andere de responsive rasters. De Nederlandse inhoud wordt als HTML geëxporteerd; de taalwisselaar, navigatie, themawisselaar en scrollanimatie werken met JavaScript in de browser. Bij een voorkeur voor minder beweging worden animaties en smooth scroll uitgeschakeld.

Officiële documentatie: [Next.js static export](https://nextjs.org/docs/app/guides/static-exports), [Tailwind met Next.js](https://tailwindcss.com/docs/installation/framework-guides/nextjs) en [GitHub Pages met een eigen workflow](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
