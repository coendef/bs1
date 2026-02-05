
import { Question, OrganizerMatch, ReflectionQuestion, ReflectionPhase } from './types';

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Wat is volgens David Ausubel de belangrijkste factor die het leren beïnvloedt?",
    options: [
      "De intelligentie van de leerling",
      "Wat de leerling al weet",
      "De motivatie van de leraar",
      "De kwaliteit van het lesmateriaal"
    ],
    correctAnswer: 1,
    explanation: "Ausubel stelde in 1968: 'de belangrijkste factor die het leren beïnvloedt, is wat de leerling al weet.'"
  },
  {
    id: 2,
    text: "Wat gebeurt er met nieuwe leerstof die niet wordt gelinkt aan geactiveerde kennis in het langetermijngeheugen?",
    options: [
      "Het wordt automatisch opgeslagen",
      "Het wordt beter onthouden door herhaling",
      "Het zal snel weer vergeten worden",
      "Het vormt een nieuw kennisschema"
    ],
    correctAnswer: 2,
    explanation: "Nieuwe leerstof die geen 'greep' vindt in het langetermijngeheugen omdat het niet gelinkt is aan voorkennis, wordt snel vergeten."
  },
  {
    id: 3,
    text: "Wat is de beste manier om een misconceptie bij leerlingen aan te pakken?",
    options: [
      "Negeren en hopen dat het weggaat",
      "De juiste informatie herhaaldelijk voorlezen",
      "De misconceptie expliciet benoemen en weerleggen",
      "Een toets geven over het onderwerp"
    ],
    correctAnswer: 2,
    explanation: "Je kunt misconcepties het beste doorprikken door ze expliciet te benoemen en daarna te weerleggen."
  },
  {
    id: 4,
    text: "Je toont een visueel overzicht van de leerstof aan het begin van de les. Welk type advance organizer is dit?",
    options: [
      "Expository advance organizer",
      "Narratieve advance organizer",
      "Vergelijkende advance organizer",
      "Grafische advance organizer"
    ],
    correctAnswer: 3,
    explanation: "Een grafische advance organizer toont een visueel overzicht van de leerstof en waar de nieuwe inhoud past in het grotere geheel."
  },
  {
    id: 5,
    text: "Wat houdt de 'Think-Pair-Share' werkvorm in bij het ophalen van voorkennis?",
    options: [
      "Leerlingen denken na, overleggen in duo's en delen het dan klassikaal",
      "De leraar denkt na en deelt de kennis met de leerlingen",
      "Leerlingen zoeken informatie op internet en delen dit",
      "Een snelle quiz met stemkastjes"
    ],
    correctAnswer: 0,
    explanation: "Bij Think-Pair-Share denken leerlingen eerst individueel na, bespreken dit dan in duo's en tenslotte komt het klassikaal aan bod."
  }
];

export const ORGANIZERS: OrganizerMatch[] = [
  { id: '1', type: "Grafisch", description: "Toont een visueel overzicht van de leerstof in het grotere geheel." },
  { id: '2', type: "Expository", description: "De leraar vertelt wat de leerlingen gaan leren en wat de verwachtingen zijn." },
  { id: '3', type: "Narratief", description: "De klas wordt 'opgewarmd' met een passend verhaal of een filmpje." },
  { id: '4', type: "Vergelijkend", description: "Vergelijkt de nieuwe leerstof met wat de leerling al weet." }
];

// Korthagen Reflectiecyclus - Vragen per fase
export const REFLECTION_QUESTIONS: ReflectionQuestion[] = [
  {
    phase: ReflectionPhase.HANDELEN,
    question: "Beschrijf een concrete situatie uit je les of praktijk",
    placeholder: "Bijvoorbeeld: Vandaag gaf ik een les over breuken. Ik begon met een advance organizer door...",
    helpText: "Kies een specifieke ervaring die je wilt onderzoeken. Dit kan iets zijn dat goed ging, of juist iets waar je mee worstelde."
  },
  {
    phase: ReflectionPhase.TERUGBLIKKEN,
    question: "Wat gebeurde er precies? Wat deed jij? Wat deden de leerlingen?",
    placeholder: "De leerlingen reageerden door... Ik merkte dat... Het effect was...",
    helpText: "Probeer zo feitelijk mogelijk te beschrijven wat er gebeurde, zonder direct te oordelen."
  },
  {
    phase: ReflectionPhase.BEWUSTWORDING,
    question: "Wat dacht je op dat moment? Wat voelde je? Wat waren de essentiële aspecten?",
    placeholder: "Ik dacht op dat moment... Ik voelde me... Het essentiële aspect was...",
    helpText: "Sta stil bij je gedachten en gevoelens. Wat maakte deze situatie belangrijk of leerzaam?"
  },
  {
    phase: ReflectionPhase.ALTERNATIEVEN,
    question: "Welke alternatieven zie je? Wat zou je anders kunnen doen?",
    placeholder: "Ik zou ook kunnen... Een andere aanpak zou zijn... Op basis van Bouwsteen 1 zou ik...",
    helpText: "Bedenk concrete alternatieven. Denk aan wat je hebt geleerd over voorkennis activeren en advance organizers."
  },
  {
    phase: ReflectionPhase.UITPROBEREN,
    question: "Wat ga je de volgende keer uitproberen? Maak een concreet plan.",
    placeholder: "De volgende les ga ik... Mijn doel is... Ik wil bereiken dat...",
    helpText: "Maak je voornemen zo concreet mogelijk: wat, wanneer, hoe? Dit maakt het makkelijker om het ook echt te doen."
  }
];

// Fase metadata voor UI
export const REFLECTION_PHASE_INFO: Record<ReflectionPhase, { title: string; icon: string; color: string }> = {
  [ReflectionPhase.HANDELEN]: {
    title: "Handelen",
    icon: "play",
    color: "blue"
  },
  [ReflectionPhase.TERUGBLIKKEN]: {
    title: "Terugblikken",
    icon: "eye",
    color: "purple"
  },
  [ReflectionPhase.BEWUSTWORDING]: {
    title: "Bewustwording",
    icon: "lightbulb",
    color: "amber"
  },
  [ReflectionPhase.ALTERNATIEVEN]: {
    title: "Alternatieven",
    icon: "shuffle",
    color: "emerald"
  },
  [ReflectionPhase.UITPROBEREN]: {
    title: "Uitproberen",
    icon: "rocket",
    color: "rose"
  }
};
