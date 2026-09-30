// Alle teksten en persoonlijke gegevens staan hier, in het Nederlands en Engels.
export const content = {
  meta: {
    title: "Matty Jutte — Software Engineering student",
    description:
      "Hoi, ik ben Matty. Student Software Engineering aan De Haagse Hogeschool en stagiair bij Competa IT BV. Maak kennis met mij en ontdek mijn skills en ervaring.",
  },
  profile: {
    name: "Matty Jutte",
    firstName: "Matty",
    lastName: "Jutte",
    initials: "M.A.T J",
    role: "Software Engineering student",
    email: "Mattyjutte07@gmail.com",
    // Bevestigd door de bestaande Git-remote van deze repository.
    githubUrl: "https://github.com/MattyJutte",
    linkedinUrl: "https://www.linkedin.com/in/mattyjutte/",
    availableForWork: true, // Zet op false om de beschikbaarheidsbadge te verbergen.
    availability: "Beschikbaar voor werk",
    cvPath: "/cv.pdf",
    photo: {
      src: "/matty-jutte.jpg",
      alt: "Matty Jutte, zittend aan een tafel in de buitenlucht.",
      width: 1920,
      height: 2115,
    },
  },
  navigation: [
    { label: "Over mij", href: "#over-mij" },
    { label: "Skills", href: "#skills" },
    { label: "Ervaring", href: "#ervaring" },
    { label: "Contact", href: "#contact" },
  ],
  ui: {
    home: "Naar het begin",
    navigation: "Hoofdnavigatie",
    openMenu: "Menu openen",
    closeMenu: "Menu sluiten",
    theme: "Wissel tussen lichte en donkere modus",
    switchLanguage: "Switch to English",
    languageCode: "EN",
    skipLink: "Direct naar de inhoud",
    aboutMe: "Meer over mij",
    downloadCv: "Download CV",
    cvUnavailable: "CV binnenkort beschikbaar",
    copyEmail: "Kopieer e-mailadres",
    emailCopied: "E-mailadres gekopieerd!",
    emailCopyFailed: "Kopiëren lukt niet. Selecteer het e-mailadres hierboven.",
    getInTouch: "Neem contact op",
    github: "GitHub",
    linkedin: "LinkedIn",
    backToTop: "Terug naar boven",
  },
  hero: {
    eyebrow: "NIEUWSGIERIG VAN NATURE. BOUWER IN WORDING.",
    introduction:
      "Van een goed idee naar iets dat werkt. Ik duik graag in code, leer door te doen en bouw het liefst samen aan de volgende stap.",
    constellation: {
      initials: "MJ",
      label: "Een kleine wereld van ideeën",
      hint: "Beweeg of tik tussen de sterren",
      assemble: "Ontdek mijn signatuur",
      scatter: "Terug naar de sterren",
      pause: "Animatie pauzeren",
      play: "Animatie afspelen",
    },
    currentLabel: "Op dit moment",
    current: "Leren & bouwen bij Competa IT",
    explore: "Ontdek meer over mij",
  },

  about: {
    number: "01",
    eyebrow: "DE PERSOON ACHTER DE CODE",
    title: "Hoi, ik ben Matty.",
    lead: "Nieuwsgierig naar techniek. Energie van samenwerken.",
    paragraphs: [
      "Sinds 2024 studeer ik Software Engineering aan De Haagse Hogeschool. Ik zit nu in mijn derde studiejaar. Ik vind het leuk om uit te zoeken hoe dingen werken en die kennis om te zetten in software.",
      "In een Scrum-team voel ik me op mijn plek. Samen nadenken, ideeën delen en elkaar verder helpen: daar krijg ik energie van. Tegelijk kan ik zelfstandig mijn werk plannen en aanpakken.",
      "Buiten mijn studie en stage ben ik graag in beweging. Die afwisseling houdt me scherp, achter mijn laptop én daarbuiten.",
    ],
    traits: [
      {
        icon: "people",
        title: "Samen kom je verder",
        text: "Teamspeler met een Scrum-mentaliteit.",
      },
      {
        icon: "compass",
        title: "Zelfstandig aan de slag",
        text: "Plannen, aanpakken en blijven leren.",
      },
      {
        icon: "activity",
        title: "Graag in beweging",
        text: "Van een nieuwe uitdaging tot een potje tennis.",
      },
    ],
  },
  internship: {
    eyebrow: "VAN THEORIE NAAR PRAKTIJK",
    title: "Leren door te bouwen.",
    company: "Competa IT BV",
    role: "Stagiair Software Engineering",
    status: "Huidige stage",
    description:
      "Tijdens mijn stage bij Competa IT BV breng ik mijn opleiding in de praktijk. Een plek om te leren, samen te werken en verder te groeien als software engineer.",
    periodLabel: "Stageperiode",
    period: "31 augustus 2026 — heden",
    stackLabel: "Mijn technische basis",
    stack: ["React", "Next.js", "NestJS", "PostgreSQL", "Git", "Scrum"],
  },
  skills: {
    number: "02",
    eyebrow: "MIJN GEREEDSCHAPSKIST",
    title: "De techniek achter het werk.",
    description:
      "Van interface tot database. Dit zijn de talen, tools en werkwijzen waarmee ik aan de slag kan.",
    groups: [
      {
        icon: "code",
        title: "Frontend",
        description: "Wat je ziet en gebruikt",
        items: [
          "React",
          "Next.js",
          "JavaScript",
          "HTML",
          "CSS",
          "Tailwind CSS",
        ],
      },
      {
        icon: "terminal",
        title: "Backend",
        description: "De logica onder de motorkap",
        items: ["NestJS", "Node.js", "Java", "Python", "C#"],
      },
      {
        icon: "database",
        title: "Databases",
        description: "Structuur in de data",
        items: ["PostgreSQL", "MySQL", "Prisma (Prisma Studio)"],
      },
      {
        icon: "tools",
        title: "Tools & werkwijze",
        description: "Samen goed werk leveren",
        items: [
          "Git & GitHub",
          "Postman",
          "Swagger",
          "Linux",
          "Windows",
          "Scrum",
        ],
      },
    ],
  },
  experience: {
    number: "03",
    eyebrow: "ELKE STAP TELT",
    title: "Mijn pad tot nu toe.",
    description:
      "Ervaring opdoen, kennis opbouwen en steeds een stap verder komen.",
    workTitle: "Werkervaring",
    educationTitle: "Opleiding",
    jobs: [
      {
        title: "Stagiair",
        organization: "Competa IT BV",
        period: "31 augustus 2026 — heden",
        description:
          "Mijn kennis van Software Engineering in de praktijk brengen.",
        current: true,
        href: "#stage",
        linkLabel: "Meer over mijn stage",
      },
      {
        title: "Afwasser / kok",
        organization: "Restaurant Pex",
        period: "05-2024 — heden",
        description:
          "Omgaan met collega’s en klanten, samenwerken en het overzicht bewaren onder druk.",
        current: false,
      },
      {
        title: "Medewerker skiafdeling",
        organization: "De Uithof",
        period: "11-2022 — 04-2023",
        description:
          "Klanten voorzien van skispullen en zorgen voor het onderhoud van de skibaan.",
        current: false,
      },
    ],
    education: [
      {
        title: "Software Engineering",
        organization: "De Haagse Hogeschool · Den Haag",
        period: "2024 — heden · 3e studiejaar",
        description: "Propedeusediploma behaald en twee studiejaren afgerond.",
        detail: "Propedeuse behaald",
      },
      {
        title: "Havo",
        organization: "Dalton Den Haag",
        period: "Geslaagd in 2024",
        description:
          "Technische vakken: scheikunde, natuurkunde, wiskunde B en biologie.",
        detail: "Gemiddeld eindexamencijfer: 7,7",
      },
    ],
  },
  personal: {
    number: "04",
    eyebrow: "EVEN WEG VAN HET SCHERM. OF JUIST NIET.",
    title: "Meer dan alleen code.",
    description:
      "Mijn vrije tijd? Een fijne mix van actief bezig zijn en gewoon ontspannen.",
    hobbies: [
      {
        icon: "dumbbell",
        title: "Sportschool",
        text: "Energie kwijt, hoofd leeg.",
      },
      {
        icon: "flag",
        title: "Golf & tennis",
        text: "Graag buiten, graag in beweging.",
      },
      {
        icon: "gamepad",
        title: "Gamen",
        text: "Tijd voor een andere uitdaging.",
      },
      {
        icon: "film",
        title: "Films",
        text: "Ontspannen met een goed verhaal.",
      },
    ],
  },
  contact: {
    number: "05",
    eyebrow: "EEN GOED GESPREK IS EEN MOOI BEGIN",
    title: "Laten we kennismaken.",
    description:
      "Een interessante kans, een idee om samen aan te werken of gewoon even hallo zeggen? Ik hoor graag van je.",
    emailLabel: "Stuur me een bericht",
    socialLabel: "Je vindt me ook hier",
  },
  footer: {
    note: "Met aandacht gebouwd. Altijd in ontwikkeling.",
  },
  notFound: {
    label: "404 — PAGINA NIET GEVONDEN",
    title: "Hier valt nog niets te ontdekken.",
    description:
      "Deze pagina bestaat niet. Op mijn portfolio vind je mijn skills, ervaring en contactgegevens.",
    back: "Terug naar mijn portfolio",
  },
};

export type Language = "nl" | "en";
export type SiteContent = typeof content;

// Dezelfde gegevens, met Engelse teksten. Gedeelde profielgegevens en skills
// worden overgenomen uit de Nederlandse versie hierboven.
export const englishContent: SiteContent = {
  ...content,
  meta: {
    title: "Matty Jutte — Software Engineering student",
    description:
      "Hi, I'm Matty. A Software Engineering student at The Hague University of Applied Sciences and an intern at Competa IT BV. Get to know me and explore my skills and experience.",
  },
  profile: {
    ...content.profile,
    availability: "Available for work",
    photo: {
      ...content.profile.photo,
      alt: "Matty Jutte sitting at an outdoor table.",
    },
  },
  navigation: [
    { label: "About me", href: "#over-mij" },
    { label: "Skills", href: "#skills" },
    { label: "Experience", href: "#ervaring" },
    { label: "Contact", href: "#contact" },
  ],
  ui: {
    ...content.ui,
    home: "Back to the start",
    navigation: "Main navigation",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    theme: "Switch between light and dark mode",
    switchLanguage: "Schakel naar Nederlands",
    languageCode: "NL",
    skipLink: "Skip to content",
    aboutMe: "About me",
    downloadCv: "Download CV",
    cvUnavailable: "CV available soon",
    copyEmail: "Copy email address",
    emailCopied: "Email address copied!",
    emailCopyFailed: "Could not copy. Select the email address above.",
    getInTouch: "Get in touch",
    backToTop: "Back to top",
  },
  hero: {
    ...content.hero,
    eyebrow: "CURIOUS BY NATURE. LEARNING TO BUILD.",
    introduction:
      "From a good idea to something that works. I enjoy diving into code, learning by doing and taking the next step together.",
    constellation: {
      ...content.hero.constellation,
      label: "A little world of ideas",
      hint: "Move or tap among the stars",
      assemble: "Discover my signature",
      scatter: "Back to the stars",
      pause: "Pause animation",
      play: "Play animation",
    },
    currentLabel: "Right now",
    current: "Learning & building at Competa IT",
    explore: "Get to know me",
  },

  about: {
    number: content.about.number,
    eyebrow: "THE PERSON BEHIND THE CODE",
    title: "Hi, I'm Matty.",
    lead: "Curious about technology. Energised by teamwork.",
    paragraphs: [
      "I started studying Software Engineering at The Hague University of Applied Sciences in 2024 and am now in my third year. I enjoy figuring out how things work and turning that knowledge into software.",
      "I feel at home in a Scrum team. Thinking things through together, sharing ideas and helping each other grow give me energy. I can also plan and manage my work independently.",
      "Outside my studies and internship, I like to stay active. That balance keeps me focused, both at my laptop and away from it.",
    ],
    traits: [
      {
        icon: "people",
        title: "Better together",
        text: "A team player with a Scrum mindset.",
      },
      {
        icon: "compass",
        title: "Ready to take initiative",
        text: "Planning, getting things done and learning.",
      },
      {
        icon: "activity",
        title: "Always on the move",
        text: "From a new challenge to a game of tennis.",
      },
    ],
  },
  internship: {
    ...content.internship,
    eyebrow: "FROM THEORY TO PRACTICE",
    title: "Learning by building.",
    role: "Software Engineering intern",
    status: "Current internship",
    description:
      "During my internship at Competa IT BV, I put what I study into practice. A place to learn, collaborate and grow as a software engineer.",
    periodLabel: "Internship period",
    period: "31 August 2026 — present",
    stackLabel: "My technical foundation",
  },
  skills: {
    ...content.skills,
    eyebrow: "MY TOOLKIT",
    title: "The technology behind the work.",
    description:
      "From interface to database. These are the languages, tools and ways of working I can put to use.",
    groups: [
      {
        ...content.skills.groups[0],
        description: "What you see and interact with",
      },
      { ...content.skills.groups[1], description: "The logic under the hood" },
      {
        ...content.skills.groups[2],
        description: "Bringing structure to data",
      },
      {
        ...content.skills.groups[3],
        title: "Tools & workflow",
        description: "Doing good work together",
      },
    ],
  },
  experience: {
    ...content.experience,
    eyebrow: "EVERY STEP COUNTS",
    title: "My journey so far.",
    description:
      "Gaining experience, building knowledge and taking the next step.",
    workTitle: "Work experience",
    educationTitle: "Education",
    jobs: [
      {
        ...content.experience.jobs[0],
        title: "Intern",
        period: "31 August 2026 — present",
        description: "Putting my Software Engineering knowledge into practice.",
        href: "#stage",
        linkLabel: "More about my internship",
      },
      {
        ...content.experience.jobs[1],
        title: "Dishwasher / cook",
        period: "05-2024 — present",
        description:
          "Working with colleagues and customers, collaborating and staying organised under pressure.",
      },
      {
        ...content.experience.jobs[2],
        title: "Ski department assistant",
        description:
          "Helping customers with ski equipment and maintaining the ski slope.",
      },
    ],
    education: [
      {
        ...content.experience.education[0],
        organization: "The Hague University of Applied Sciences · The Hague",
        period: "2024 — present · Year 3",
        description:
          "Earned my first-year certificate (propedeuse) and completed two years of study.",
        detail: "First-year certificate obtained",
      },
      {
        ...content.experience.education[1],
        title: "Secondary school (HAVO)",
        period: "Graduated in 2024",
        description:
          "Science subjects: chemistry, physics, mathematics B and biology.",
        detail: "Average final exam grade: 7.7",
      },
    ],
  },
  personal: {
    ...content.personal,
    eyebrow: "AWAY FROM THE SCREEN. OR MAYBE NOT.",
    title: "More than just code.",
    description:
      "My free time? A good mix of being active and simply unwinding.",
    hobbies: [
      {
        icon: "dumbbell",
        title: "Gym",
        text: "Burning energy, clearing my head.",
      },
      {
        icon: "flag",
        title: "Golf & tennis",
        text: "Getting outdoors and staying active.",
      },
      {
        icon: "gamepad",
        title: "Gaming",
        text: "Time for a different challenge.",
      },
      { icon: "film", title: "Films", text: "Unwinding with a good story." },
    ],
  },
  contact: {
    ...content.contact,
    eyebrow: "A GOOD CONVERSATION IS A GREAT START",
    title: "Let's get to know each other.",
    description:
      "An interesting opportunity, an idea to work on together or just a quick hello? I'd love to hear from you.",
    emailLabel: "Send me a message",
    socialLabel: "You can also find me here",
  },
  footer: { note: "Built with care. Always learning." },
  notFound: {
    label: "404 — PAGE NOT FOUND",
    title: "Nothing to discover here yet.",
    description:
      "This page does not exist. You'll find my skills, experience and contact details on my portfolio.",
    back: "Back to my portfolio",
  },
};

export const translations: Record<Language, SiteContent> = {
  nl: content,
  en: englishContent,
};
