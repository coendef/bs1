
import React, { useState, useEffect, useCallback } from 'react';
import { GameMode, QuizState } from './types';
import { QUESTIONS, ORGANIZERS } from './constants';
import { getAIFeedback, askTutor } from './services/geminiService';
import { 
  BookOpen, 
  BrainCircuit, 
  CheckCircle2, 
  ChevronRight, 
  Home, 
  Lightbulb, 
  RotateCcw, 
  Trophy, 
  HelpCircle,
  MessageSquare,
  LayoutGrid
} from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<GameMode>(GameMode.HOME);
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    score: 0,
    showFeedback: false,
    selectedOption: null,
    isFinished: false,
  });
  
  const [matchingItems, setMatchingItems] = useState<{ id: string; type: string; description: string; matched: boolean }[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [aiMessage, setAiMessage] = useState<string>("");
  const [loadingAi, setLoadingAi] = useState(false);

  // Initialize matching game
  const initMatching = useCallback(() => {
    const items = ORGANIZERS.map(o => ({ ...o, matched: false }));
    setMatchingItems(items);
    setMode(GameMode.MATCHING);
  }, []);

  const handleQuizAnswer = (optionIndex: number) => {
    if (quizState.showFeedback) return;

    // Validate current question index is within bounds
    if (quizState.currentQuestionIndex < 0 || quizState.currentQuestionIndex >= QUESTIONS.length) {
      console.error('Invalid question index:', quizState.currentQuestionIndex);
      return;
    }

    const currentQuestion = QUESTIONS[quizState.currentQuestionIndex];

    // Validate option index is within bounds
    if (optionIndex < 0 || optionIndex >= currentQuestion.options.length) {
      console.error('Invalid option index:', optionIndex);
      return;
    }

    const isCorrect = optionIndex === currentQuestion.correctAnswer;
    setQuizState(prev => ({
      ...prev,
      selectedOption: optionIndex,
      showFeedback: true,
      score: isCorrect ? prev.score + 1 : prev.score
    }));
  };

  const nextQuestion = () => {
    // Validate current question index
    if (quizState.currentQuestionIndex < 0 || quizState.currentQuestionIndex >= QUESTIONS.length) {
      console.error('Invalid question index in nextQuestion:', quizState.currentQuestionIndex);
      return;
    }

    if (quizState.currentQuestionIndex < QUESTIONS.length - 1) {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        showFeedback: false,
        selectedOption: null
      }));
    } else {
      setQuizState(prev => ({ ...prev, isFinished: true }));
      // Call generateAiSummary but don't await it (fire and forget with error handling)
      generateAiSummary().catch(error => {
        console.error('Failed to generate AI summary:', error);
      });
    }
  };

  const generateAiSummary = async () => {
    try {
      setLoadingAi(true);
      const feedback = await getAIFeedback(
        `${quizState.score}/${QUESTIONS.length} op de quiz`,
        "Algemene beheersing van Bouwsteen 1"
      );
      setAiMessage(feedback || "Er kon geen feedback worden gegenereerd.");
    } catch (error) {
      console.error('Error generating AI summary:', error);
      setAiMessage('Er is een fout opgetreden bij het laden van AI feedback. Probeer het later opnieuw.');
    } finally {
      setLoadingAi(false);
    }
  };

  const resetQuiz = () => {
    setQuizState({
      currentQuestionIndex: 0,
      score: 0,
      showFeedback: false,
      selectedOption: null,
      isFinished: false,
    });
    setMode(GameMode.QUIZ);
  };

  const handleMatch = (type: string, desc: string) => {
    // Validate input parameters
    if (!type || !desc) {
      console.error('Invalid match parameters:', { type, desc });
      return;
    }

    const item = ORGANIZERS.find(o => o.type === type && o.description === desc);
    if (item) {
      setMatchingItems(prev => prev.map(i => i.id === item.id ? { ...i, matched: true } : i));
      setSelectedType(null);
    } else {
      console.warn('No matching organizer found for:', { type, desc });
      // Reset selected type so user can try again
      setSelectedType(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setMode(GameMode.HOME)}>
            <div className="bg-amber-600 p-2 rounded-lg text-white">
              <BrainCircuit size={24} />
            </div>
            <h1 className="font-bold text-xl tracking-tight hidden sm:block">Bouwsteen 1 Master</h1>
          </div>
          <nav className="flex items-center gap-1 sm:gap-4">
            <button 
              onClick={() => setMode(GameMode.SUMMARY)}
              className={`p-2 rounded-md transition ${mode === GameMode.SUMMARY ? 'bg-amber-50 text-amber-700' : 'hover:bg-slate-100 text-slate-600'}`}
              title="Samenvatting"
            >
              <BookOpen size={20} />
            </button>
            <button 
              onClick={() => setMode(GameMode.AI_TUTOR)}
              className={`p-2 rounded-md transition ${mode === GameMode.AI_TUTOR ? 'bg-amber-50 text-amber-700' : 'hover:bg-slate-100 text-slate-600'}`}
              title="AI Tutor"
            >
              <MessageSquare size={20} />
            </button>
            <button 
              onClick={() => setMode(GameMode.HOME)}
              className={`p-2 rounded-md transition ${mode === GameMode.HOME ? 'bg-amber-50 text-amber-700' : 'hover:bg-slate-100 text-slate-600'}`}
              title="Home"
            >
              <Home size={20} />
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6">
        {mode === GameMode.HOME && (
          <div className="space-y-8 py-8 animate-in fade-in duration-500">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-extrabold text-slate-800">Welkom bij Bouwsteen 1</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                "Activeer relevante voorkennis." Ontdek waarom wat de leerling al weet de belangrijkste factor is voor succesvol leren.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card 
                icon={<HelpCircle className="text-blue-500" />}
                title="De Kennis Quiz"
                description="Test je basiskennis over Bouwsteen 1 met 5 uitdagende vragen."
                onClick={resetQuiz}
                color="border-blue-200 hover:bg-blue-50"
              />
              <Card 
                icon={<LayoutGrid className="text-purple-500" />}
                title="Advance Organizer Match"
                description="Kun jij de 4 types advance organizers koppelen aan hun juiste functie?"
                onClick={initMatching}
                color="border-purple-200 hover:bg-purple-50"
              />
              <Card 
                icon={<BookOpen className="text-amber-500" />}
                title="Snelle Samenvatting"
                description="Een handig overzicht van de theorie en de 'kapstok' voor leren."
                onClick={() => setMode(GameMode.SUMMARY)}
                color="border-amber-200 hover:bg-amber-50"
              />
              <Card 
                icon={<MessageSquare className="text-emerald-500" />}
                title="Vraag de AI Tutor"
                description="Heb je een specifieke vraag over misconcepties of de spiraalaanpak?"
                onClick={() => setMode(GameMode.AI_TUTOR)}
                color="border-emerald-200 hover:bg-emerald-50"
              />
            </div>

            <div className="bg-amber-100 p-6 rounded-2xl border border-amber-200">
              <h3 className="font-bold text-amber-900 flex items-center gap-2 mb-2">
                <Lightbulb size={20} /> Wist je dat?
              </h3>
              <p className="text-amber-800">
                Het introduceren van een 'advance organizer' bij het begin van de les zorgt voor gemiddeld betere resultaten dan een puur historisch of motiverend verhaal? Structuur is de sleutel!
              </p>
            </div>
          </div>
        )}

        {mode === GameMode.QUIZ && !quizState.isFinished && (
          <div className="max-w-2xl mx-auto space-y-6 py-4 animate-in slide-in-from-bottom-4 duration-300">
            {/* Safety check: ensure valid question index */}
            {quizState.currentQuestionIndex >= 0 && quizState.currentQuestionIndex < QUESTIONS.length ? (
              <>
                <div className="flex justify-between items-center mb-8">
                  <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                    Vraag {quizState.currentQuestionIndex + 1} van {QUESTIONS.length}
                  </span>
                  <div className="h-2 w-32 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${((quizState.currentQuestionIndex + 1) / QUESTIONS.length) * 100}%` }}
                    />
                  </div>
                </div>

                <h3 className="text-2xl font-bold leading-tight">
                  {QUESTIONS[quizState.currentQuestionIndex].text}
                </h3>

            <div className="space-y-3">
              {QUESTIONS[quizState.currentQuestionIndex].options.map((option, idx) => {
                let bgColor = "bg-white border-slate-200 hover:border-blue-400";
                if (quizState.showFeedback) {
                  if (idx === QUESTIONS[quizState.currentQuestionIndex].correctAnswer) {
                    bgColor = "bg-green-50 border-green-500 ring-1 ring-green-500";
                  } else if (idx === quizState.selectedOption) {
                    bgColor = "bg-red-50 border-red-500 ring-1 ring-red-500";
                  } else {
                    bgColor = "bg-slate-50 border-slate-100 opacity-50";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleQuizAnswer(idx)}
                    disabled={quizState.showFeedback}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between group ${bgColor}`}
                  >
                    <span className="text-lg font-medium">{option}</span>
                    {quizState.showFeedback && idx === QUESTIONS[quizState.currentQuestionIndex].correctAnswer && (
                      <CheckCircle2 size={20} className="text-green-600" />
                    )}
                  </button>
                );
              })}
            </div>

            {quizState.showFeedback && (
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-200 animate-in fade-in zoom-in duration-300">
                <p className="text-blue-900 font-medium mb-3">
                  {quizState.selectedOption === QUESTIONS[quizState.currentQuestionIndex].correctAnswer 
                    ? "🎉 Helemaal juist!" 
                    : "💡 Net niet!"}
                </p>
                <p className="text-blue-800 text-sm leading-relaxed">
                  {QUESTIONS[quizState.currentQuestionIndex].explanation}
                </p>
                <button 
                  onClick={nextQuestion}
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                >
                  {quizState.currentQuestionIndex < QUESTIONS.length - 1 ? "Volgende vraag" : "Bekijk resultaat"}
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
              </>
            ) : (
              <div className="max-w-md mx-auto py-12 text-center space-y-4">
                <p className="text-red-600 font-semibold">Er is een fout opgetreden met de quiz.</p>
                <button
                  onClick={resetQuiz}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition"
                >
                  Quiz opnieuw starten
                </button>
              </div>
            )}
          </div>
        )}

        {mode === GameMode.QUIZ && quizState.isFinished && (
          <div className="max-w-md mx-auto py-12 text-center space-y-8 animate-in zoom-in duration-500">
            <div className="relative inline-block">
              <Trophy size={80} className="text-amber-500 mx-auto" />
              <div className="absolute top-0 right-0 -mr-2 -mt-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                {Math.round((quizState.score / QUESTIONS.length) * 100)}%
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-3xl font-extrabold">Super gedaan!</h3>
              <p className="text-slate-600">Je hebt {quizState.score} van de {QUESTIONS.length} vragen goed beantwoord.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200 text-left">
              <h4 className="font-bold flex items-center gap-2 mb-4 text-emerald-700">
                <BrainCircuit size={18} /> AI Mentor Feedback
              </h4>
              {loadingAi ? (
                <div className="space-y-3">
                  <div className="h-4 bg-slate-100 rounded w-full animate-pulse" />
                  <div className="h-4 bg-slate-100 rounded w-5/6 animate-pulse" />
                  <div className="h-4 bg-slate-100 rounded w-4/6 animate-pulse" />
                </div>
              ) : (
                <p className="text-slate-700 italic leading-relaxed">"{aiMessage}"</p>
              )}
            </div>

            <div className="flex gap-4">
              <button 
                onClick={resetQuiz}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-4 rounded-xl transition flex items-center justify-center gap-2"
              >
                <RotateCcw size={20} /> Opnieuw
              </button>
              <button 
                onClick={() => setMode(GameMode.HOME)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition"
              >
                Terug naar Home
              </button>
            </div>
          </div>
        )}

        {mode === GameMode.MATCHING && (
          <div className="max-w-4xl mx-auto py-4 space-y-8">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold">Advance Organizer Matching</h3>
              <p className="text-slate-600">Combineer de types met hun beschrijving.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="font-bold text-slate-400 uppercase text-xs tracking-widest">Types</h4>
                {ORGANIZERS.map(org => {
                  const isMatched = matchingItems.find(i => i.type === org.type)?.matched;
                  return (
                    <button
                      key={org.type}
                      onClick={() => !isMatched && setSelectedType(org.type)}
                      disabled={isMatched}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        isMatched 
                          ? 'bg-green-50 border-green-200 text-green-700 opacity-60' 
                          : selectedType === org.type 
                            ? 'bg-blue-100 border-blue-500 shadow-md ring-2 ring-blue-200 scale-105' 
                            : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{org.type}</span>
                        {isMatched && <CheckCircle2 size={18} />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-slate-400 uppercase text-xs tracking-widest">Functies</h4>
                {ORGANIZERS.map((_, idx) => {
                  // Shuffle slightly or just use descriptions
                  const descObj = ORGANIZERS[(idx + 1) % ORGANIZERS.length];
                  const isMatched = matchingItems.find(i => i.description === descObj.description)?.matched;
                  
                  return (
                    <button
                      key={descObj.description}
                      onClick={() => selectedType && handleMatch(selectedType, descObj.description)}
                      disabled={isMatched || !selectedType}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all min-h-[5rem] ${
                        isMatched 
                          ? 'bg-green-50 border-green-200 text-green-700 opacity-60' 
                          : !selectedType 
                            ? 'bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-white border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      <p className="text-sm">{descObj.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {matchingItems.every(i => i.matched) && (
              <div className="bg-green-100 p-8 rounded-2xl border border-green-200 text-center space-y-4 animate-in bounce-in duration-500">
                <h4 className="text-2xl font-bold text-green-800">Perfect Gematcht!</h4>
                <p className="text-green-700">Je kent de advance organizers nu als je broekzak.</p>
                <button 
                  onClick={() => setMode(GameMode.HOME)}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl transition"
                >
                  Ga Verder
                </button>
              </div>
            )}
          </div>
        )}

        {mode === GameMode.SUMMARY && (
          <div className="max-w-3xl mx-auto py-4 space-y-8 animate-in fade-in duration-300">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 space-y-8">
              <section className="space-y-4">
                <h2 className="text-3xl font-extrabold text-slate-800 border-l-4 border-amber-500 pl-4">De Kapstok-theorie</h2>
                <p className="text-lg leading-relaxed text-slate-700">
                  Wat je al weet, bepaalt wat en hoe snel je leert. Door voorkennis actief op te halen, geef je leerlingen een <strong>kapstok</strong> om nieuwe leerstof aan te verbinden. 
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <h4 className="font-bold text-blue-800 mb-1">Veranker</h4>
                    <p className="text-sm text-blue-700">Nieuwe informatie 'kleeft' aan bestaande kennis in het geheugen.</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                    <h4 className="font-bold text-purple-800 mb-1">Organiseer</h4>
                    <p className="text-sm text-purple-700">Plaats nieuwe stof binnen een abstract en omvattend kader.</p>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-2xl font-bold text-slate-800">Krachtige Werkvormen</h3>
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <div className="mt-1 bg-amber-500 rounded-full h-2 w-2 shrink-0" />
                    <p><span className="font-bold text-amber-700">Kleine Quiz:</span> Maak lacunes zichtbaar aan het begin van de les.</p>
                  </li>
                  <li className="flex gap-3">
                    <div className="mt-1 bg-amber-500 rounded-full h-2 w-2 shrink-0" />
                    <p><span className="font-bold text-amber-700">Advance Organizers:</span> Bied mentale kapstokken (Grafisch, Narratief, etc.).</p>
                  </li>
                  <li className="flex gap-3">
                    <div className="mt-1 bg-amber-500 rounded-full h-2 w-2 shrink-0" />
                    <p><span className="font-bold text-amber-700">Spiraalaanpak:</span> Bouw structureel voort op kennis van vorige jaren.</p>
                  </li>
                  <li className="flex gap-3">
                    <div className="mt-1 bg-amber-500 rounded-full h-2 w-2 shrink-0" />
                    <p><span className="font-bold text-amber-700">Misconcepties weerleggen:</span> Benoem de fout expliciet en zet er de waarheid tegenover.</p>
                  </li>
                </ul>
              </section>

              <div className="bg-slate-900 text-white p-8 rounded-2xl relative overflow-hidden">
                <div className="relative z-10 space-y-4">
                  <p className="text-xl italic font-medium leading-relaxed">
                    "De belangrijkste factor die het leren beïnvloedt, is wat de leerling al weet."
                  </p>
                  <p className="text-slate-400 font-bold">— David Ausubel (1968)</p>
                </div>
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <BrainCircuit size={120} />
                </div>
              </div>
            </div>
            <div className="text-center pb-8">
              <button 
                onClick={() => setMode(GameMode.HOME)}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-10 rounded-full transition shadow-lg shadow-amber-200"
              >
                Terug naar het spel
              </button>
            </div>
          </div>
        )}

        {mode === GameMode.AI_TUTOR && (
          <AiTutorScreen />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-500">
            Gebaseerd op <strong>Wijze Lessen: Bouwsteen 1</strong>. Ontwikkeld voor docenten die hun lessen krachtiger willen maken.
          </p>
        </div>
      </footer>
    </div>
  );
};

// Sub-components defined outside for performance
const Card: React.FC<{ icon: React.ReactNode; title: string; description: string; onClick: () => void; color: string }> = ({ 
  icon, title, description, onClick, color 
}) => (
  <button 
    onClick={onClick}
    className={`p-6 rounded-2xl border-2 text-left transition-all group active:scale-95 flex flex-col gap-4 bg-white ${color}`}
  >
    <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 w-fit group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div>
      <h3 className="font-bold text-xl mb-1">{title}</h3>
      <p className="text-slate-500 text-sm">{description}</p>
    </div>
  </button>
);

const AiTutorScreen: React.FC = () => {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      const result = await askTutor(query);
      setAnswer(result || "Er kon geen antwoord worden gegenereerd.");
    } catch (error) {
      console.error('Error asking AI tutor:', error);
      setAnswer('Er is een fout opgetreden bij het verwerken van je vraag. Probeer het later opnieuw.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-8 animate-in fade-in duration-300">
      <div className="text-center space-y-2">
        <h3 className="text-3xl font-extrabold">Praat met je AI Tutor</h3>
        <p className="text-slate-600">Heb je vragen over Bouwsteen 1? Ik heb het boek Wijze Lessen bestudeerd.</p>
      </div>

      <form onSubmit={handleAsk} className="relative group">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Stel een vraag (bijv. 'Wat is een narratieve organizer?')"
          className="w-full p-5 pr-16 rounded-2xl border-2 border-slate-200 focus:border-emerald-500 outline-none transition-all shadow-sm"
        />
        <button 
          type="submit"
          disabled={loading || !query.trim()}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-emerald-600 text-white p-3 rounded-xl disabled:bg-slate-300 transition-colors"
        >
          {loading ? (
            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <ChevronRight size={20} />
          )}
        </button>
      </form>

      {answer && (
        <div className="bg-white p-6 rounded-2xl border-2 border-emerald-100 shadow-md animate-in slide-in-from-top-4 duration-300">
          <div className="flex gap-3 items-start">
            <div className="bg-emerald-100 p-2 rounded-lg text-emerald-700 shrink-0">
              <BrainCircuit size={20} />
            </div>
            <div className="space-y-3">
              <p className="text-slate-800 leading-relaxed font-medium">
                {answer}
              </p>
              <div className="pt-2 border-t border-slate-100">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Powered by Gemini AI - Bouwsteen 1 Expert</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button 
          onClick={() => setQuery("Hoe werkt de boom-misconceptie?")}
          className="p-3 text-sm text-left border rounded-xl hover:bg-slate-50 transition"
        >
          "Hoe werkt de boom-misconceptie?"
        </button>
        <button 
          onClick={() => setQuery("Wat is de spiraalaanpak?")}
          className="p-3 text-sm text-left border rounded-xl hover:bg-slate-50 transition"
        >
          "Wat is de spiraalaanpak?"
        </button>
      </div>
    </div>
  );
};

export default App;
