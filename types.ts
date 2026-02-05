
export enum GameMode {
  HOME = 'HOME',
  QUIZ = 'QUIZ',
  MATCHING = 'MATCHING',
  SUMMARY = 'SUMMARY',
  AI_TUTOR = 'AI_TUTOR',
  REFLECTION = 'REFLECTION'
}

// Korthagen Reflectiecyclus
export enum ReflectionPhase {
  HANDELEN = 'HANDELEN',           // 1. Ervaring/Actie
  TERUGBLIKKEN = 'TERUGBLIKKEN',   // 2. Terugkijken
  BEWUSTWORDING = 'BEWUSTWORDING', // 3. Bewustwording essentiële aspecten
  ALTERNATIEVEN = 'ALTERNATIEVEN', // 4. Alternatieven ontwikkelen
  UITPROBEREN = 'UITPROBEREN'      // 5. Uitproberen
}

export interface ReflectionQuestion {
  phase: ReflectionPhase;
  question: string;
  placeholder: string;
  helpText?: string;
}

export interface ReflectionState {
  currentPhaseIndex: number;
  answers: Record<ReflectionPhase, string>;
  isComplete: boolean;
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface OrganizerMatch {
  id: string;
  type: string;
  description: string;
}

export interface QuizState {
  currentQuestionIndex: number;
  score: number;
  showFeedback: boolean;
  selectedOption: number | null;
  isFinished: boolean;
}
