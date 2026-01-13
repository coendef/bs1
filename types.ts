
export enum GameMode {
  HOME = 'HOME',
  QUIZ = 'QUIZ',
  MATCHING = 'MATCHING',
  SUMMARY = 'SUMMARY',
  AI_TUTOR = 'AI_TUTOR'
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
