import { GoogleGenAI } from '@google/genai';

/**
 * Get AI feedback based on quiz performance
 * @param score - The quiz score (e.g., "3/5 op de quiz")
 * @param topic - The topic being assessed (e.g., "Algemene beheersing van Bouwsteen 1")
 * @returns AI-generated feedback or error message
 */
export async function getAIFeedback(score: string, topic: string): Promise<string> {
  try {
    // Validate API key exists
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      console.error('Gemini API key is missing. Please set GEMINI_API_KEY in your .env.local file.');
      return 'AI feedback is momenteel niet beschikbaar. Controleer de API-configuratie.';
    }

    // Validate input parameters
    if (!score || !topic) {
      console.error('Invalid parameters for getAIFeedback:', { score, topic });
      return 'Kan geen feedback genereren: ongeldige parameters.';
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenAI({ apiKey });

    const prompt = `
Je bent een pedagogisch deskundige gespecialiseerd in "Wijze Lessen: Bouwsteen 1" van David Ausubel.
Een docent heeft net ${score} behaald op een quiz over ${topic}.

Geef in maximaal 3 zinnen:
1. Een korte felicitatie of bemoediging
2. Een kernadvies over hoe de docent dit beter kan toepassen in de klas
3. Een motiverende slotzin

Wees vriendelijk, concreet en praktisch. Gebruik geen emoji's.
    `.trim();

    const result = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });
    const text = result.text;

    if (!text || text.trim().length === 0) {
      console.warn('Gemini API returned empty response');
      return 'AI kon geen feedback genereren. Probeer het later opnieuw.';
    }

    return text.trim();
  } catch (error) {
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        console.error('API key error:', error.message);
        return 'AI feedback is niet beschikbaar: ongeldige API-sleutel.';
      } else if (error.message.includes('quota') || error.message.includes('rate limit')) {
        console.error('API quota exceeded:', error.message);
        return 'AI feedback is tijdelijk niet beschikbaar vanwege limieten. Probeer het later opnieuw.';
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        console.error('Network error:', error.message);
        return 'Kan geen verbinding maken met AI-service. Controleer je internetverbinding.';
      }
    }

    // Generic error fallback
    console.error('Error generating AI feedback:', error);
    return 'Er is een fout opgetreden bij het genereren van feedback. Probeer het later opnieuw.';
  }
}

/**
 * Ask the AI tutor a question about Bouwsteen 1
 * @param query - The user's question
 * @returns AI-generated answer or error message
 */
export async function askTutor(query: string): Promise<string> {
  try {
    // Validate API key exists
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      console.error('Gemini API key is missing. Please set GEMINI_API_KEY in your .env.local file.');
      return 'AI Tutor is momenteel niet beschikbaar. Controleer de API-configuratie.';
    }

    // Validate input
    if (!query || query.trim().length === 0) {
      console.error('Invalid query for askTutor: empty or undefined');
      return 'Geef alsjeblieft een vraag op.';
    }

    if (query.trim().length > 500) {
      console.warn('Query too long:', query.length, 'characters');
      return 'Je vraag is te lang. Probeer deze te verkorten tot maximaal 500 karakters.';
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenAI({ apiKey });

    const prompt = `
Je bent een AI tutor die docenten helpt met "Wijze Lessen: Bouwsteen 1" van David Ausubel.
Focus op: activeren van voorkennis, advance organizers, misconcepties, spiraalaanpak, en de kapstok-theorie.

Vraag van de docent: "${query}"

Geef een helder, praktisch antwoord in maximaal 4 zinnen. Wees concreet en actionable. Gebruik geen emoji's.
    `.trim();

    const result = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });
    const text = result.text;

    if (!text || text.trim().length === 0) {
      console.warn('Gemini API returned empty response for query:', query);
      return 'AI Tutor kon geen antwoord genereren. Probeer een andere vraag of probeer het later opnieuw.';
    }

    return text.trim();
  } catch (error) {
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        console.error('API key error:', error.message);
        return 'AI Tutor is niet beschikbaar: ongeldige API-sleutel.';
      } else if (error.message.includes('quota') || error.message.includes('rate limit')) {
        console.error('API quota exceeded:', error.message);
        return 'AI Tutor is tijdelijk niet beschikbaar vanwege limieten. Probeer het later opnieuw.';
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        console.error('Network error:', error.message);
        return 'Kan geen verbinding maken met AI Tutor. Controleer je internetverbinding.';
      } else if (error.message.includes('safety') || error.message.includes('blocked')) {
        console.error('Content safety filter triggered:', error.message);
        return 'Je vraag kon niet worden verwerkt. Probeer een andere formulering.';
      }
    }

    // Generic error fallback
    console.error('Error in askTutor:', error);
    return 'Er is een fout opgetreden. Probeer het later opnieuw.';
  }
}
