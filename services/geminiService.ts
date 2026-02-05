// Gemini AI Service voor Bouwsteen 1
// Maakt gebruik van de Gemini API indien beschikbaar

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function getAIFeedback(score: string, topic: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    // Fallback zonder API key
    return `Goed bezig met ${topic}! Je score van ${score} laat zien dat je de stof aan het beheersen bent. Blijf oefenen met de reflectiecyclus om je inzichten te verdiepen.`;
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Je bent een vriendelijke AI tutor die docenten helpt met Bouwsteen 1 van Wijze Lessen (voorkennis activeren).
              Geef korte, bemoedigende feedback (max 2 zinnen) over deze score: ${score} voor onderwerp: ${topic}.
              Focus op wat ze kunnen doen om te verbeteren.`
            }]
          }]
        })
      }
    );

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ||
      `Goed bezig! Je score van ${score} toont vooruitgang. Blijf reflecteren op je lespraktijk.`;
  } catch {
    return `Goed bezig met ${topic}! Je score van ${score} laat zien dat je de stof aan het beheersen bent.`;
  }
}

export async function askTutor(question: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    // Fallback antwoorden voor veelgestelde vragen
    const fallbackAnswers: Record<string, string> = {
      'misconceptie': 'Een misconceptie is een hardnekkige, onjuiste voorstelling van zaken die leerlingen hebben. Bijvoorbeeld: veel kinderen denken dat bomen groeien doordat ze voedsel uit de grond halen. In werkelijkheid maken bomen hun "voedsel" zelf via fotosynthese. Misconcepties moet je expliciet benoemen en weerleggen.',
      'spiraalaanpak': 'De spiraalaanpak betekent dat je leerstof steeds terugkeert, maar telkens op een hoger niveau. Denk aan concentrische cirkels: je begint met de basis en bouwt daar elk jaar op voort. Zo activeer je automatisch voorkennis.',
      'advance organizer': 'Een advance organizer is een "kapstok" die je aan het begin van de les geeft om nieuwe informatie aan te hangen. Er zijn 4 types: grafisch (visueel overzicht), expository (vertellen wat komt), narratief (verhaal/film), en vergelijkend (linken aan bekende stof).',
      'voorkennis': 'Voorkennis activeren is cruciaal omdat nieuwe informatie alleen beklijft als het kan "vastklikken" aan wat de leerling al weet. Zonder die verbinding wordt nieuwe stof snel vergeten.'
    };

    const lowerQ = question.toLowerCase();
    for (const [key, answer] of Object.entries(fallbackAnswers)) {
      if (lowerQ.includes(key)) return answer;
    }

    return 'Dat is een interessante vraag! Bouwsteen 1 draait om het activeren van voorkennis. De kern: wat de leerling al weet, bepaalt wat en hoe snel hij leert. Gebruik advance organizers als kapstok voor nieuwe informatie.';
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Je bent een expert AI tutor voor Bouwsteen 1 van "Wijze Lessen" over het activeren van voorkennis.

              Kernconcepten die je kent:
              - Ausubel: "De belangrijkste factor die het leren beinvloedt, is wat de leerling al weet"
              - Advance organizers: grafisch, expository, narratief, vergelijkend
              - Misconcepties expliciet benoemen en weerleggen
              - Spiraalaanpak: leerstof die terugkeert op steeds hoger niveau
              - Voorkennis = kapstok voor nieuwe informatie

              Beantwoord deze vraag beknopt en praktisch (max 3 zinnen): ${question}`
            }]
          }]
        })
      }
    );

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Ik kon geen antwoord genereren. Probeer je vraag anders te formuleren.';
  } catch {
    return 'Er ging iets mis met de AI. Probeer het later opnieuw.';
  }
}
