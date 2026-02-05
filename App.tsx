
import React, { useState, useCallback } from 'react';
import { GameMode, QuizState, ReflectionState, ReflectionPhase } from './types';
import { QUESTIONS, ORGANIZERS, REFLECTION_QUESTIONS, REFLECTION_PHASE_INFO } from './constants';
import { getAIFeedback, askTutor } from './services/geminiService';
import {
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Home,
  Lightbulb,
  RotateCcw,
  Trophy,
  HelpCircle,
  MessageSquare,
  LayoutGrid,
  RefreshCw,
  Play,
  Eye,
  Shuffle,
  Rocket,
  Download,
  Sparkles
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

  // Reflectie state (Korthagen cyclus)
  const [reflectionState, setReflectionState] = useState<ReflectionState>({
    currentPhaseIndex: 0,
    answers: {
      [ReflectionPhase.HANDELEN]: '',
      [ReflectionPhase.TERUGBLIKKEN]: '',
      [ReflectionPhase.BEWUSTWORDING]: '',
      [ReflectionPhase.ALTERNATIEVEN]: '',
      [ReflectionPhase.UITPROBEREN]: ''
    },
    isComplete: false
  });

  // Initialize matching game
  const initMatching = useCallback(() => {
    const items = ORGANIZERS.map(o => ({ ...o, matched: false }));
    setMatchingItems(items);
    setMode(GameMode.MATCHING);
  }, []);

  const handleQuizAnswer = (optionIndex: number) => {
    if (quizState.showFeedback) return;
    
    const isCorrect = optionIndex === QUESTIONS[quizState.currentQuestionIndex].correctAnswer;
    setQuizState(prev => ({
      ...prev,
      selectedOption: optionIndex,
      showFeedback: true,
      score: isCorrect ? prev.score + 1 : prev.score
    }));
  };

  const nextQuestion = () => {
    if (quizState.currentQuestionIndex < QUESTIONS.length - 1) {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        showFeedback: false,
        selectedOption: null
      }));
    } else {
      setQuizState(prev => ({ ...prev, isFinished: true }));
      generateAiSummary();
    }
  };

  const generateAiSummary = async () => {
    setLoadingAi(true);
    const feedback = await getAIFeedback(
      `${quizState.score}/${QUESTIONS.length} op de quiz`,
      "Algemene beheersing van Bouwsteen 1"
    );
    setAiMessage(feedback || "");
    setLoadingAi(false);
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
    const item = ORGANIZERS.find(o => o.type === type && o.description === desc);
    if (item) {
      setMatchingItems(prev => prev.map(i => i.id === item.id ? { ...i, matched: true } : i));
      setSelectedType(null);
    }
  };

  // Reflectie functies
  const resetReflection = () => {
    setReflectionState({
      currentPhaseIndex: 0,
      answers: {
        [ReflectionPhase.HANDELEN]: '',
        [ReflectionPhase.TERUGBLIKKEN]: '',
        [ReflectionPhase.BEWUSTWORDING]: '',
        [ReflectionPhase.ALTERNATIEVEN]: '',
        [ReflectionPhase.UITPROBEREN]: ''
      },
      isComplete: false
    });
    setMode(GameMode.REFLECTION);
  };

  const updateReflectionAnswer = (phase: ReflectionPhase, answer: string) => {
    setReflectionState(prev => ({
      ...prev,
      answers: { ...prev.answers, [phase]: answer }
    }));
  };

  const nextReflectionPhase = () => {
    if (reflectionState.currentPhaseIndex < REFLECTION_QUESTIONS.length - 1) {
      setReflectionState(prev => ({
        ...prev,
        currentPhaseIndex: prev.currentPhaseIndex + 1
      }));
    } else {
      setReflectionState(prev => ({ ...prev, isComplete: true }));
    }
  };

  const prevReflectionPhase = () => {
    if (reflectionState.currentPhaseIndex > 0) {
      setReflectionState(prev => ({
        ...prev,
        currentPhaseIndex: prev.currentPhaseIndex - 1
      }));
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
              onClick={() => setMode(GameMode.REFLECTION)}
              className={`p-2 rounded-md transition ${mode === GameMode.REFLECTION ? 'bg-amber-50 text-amber-700' : 'hover:bg-slate-100 text-slate-600'}`}
              title="Reflectie"
            >
              <RefreshCw size={20} />
            </button>
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
              <Card
                icon={<RefreshCw className="text-rose-500" />}
                title="Reflectie (Korthagen)"
                description="Doorloop de reflectiecyclus om je lespraktijk te verbeteren. Van ervaring naar actie."
                onClick={resetReflection}
                color="border-rose-200 hover:bg-rose-50"
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

        {mode === GameMode.REFLECTION && (
          <ReflectionScreen
            state={reflectionState}
            onUpdateAnswer={updateReflectionAnswer}
            onNext={nextReflectionPhase}
            onPrev={prevReflectionPhase}
            onReset={resetReflection}
            onGoHome={() => setMode(GameMode.HOME)}
          />
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
    setLoading(true);
    const result = await askTutor(query);
    setAnswer(result);
    setLoading(false);
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

// Korthagen Reflectiecyclus Component
interface ReflectionScreenProps {
  state: ReflectionState;
  onUpdateAnswer: (phase: ReflectionPhase, answer: string) => void;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  onGoHome: () => void;
}

const ReflectionScreen: React.FC<ReflectionScreenProps> = ({
  state,
  onUpdateAnswer,
  onNext,
  onPrev,
  onReset,
  onGoHome
}) => {
  const phases = Object.values(ReflectionPhase);
  const currentQuestion = REFLECTION_QUESTIONS[state.currentPhaseIndex];
  const currentPhase = currentQuestion.phase;
  const phaseInfo = REFLECTION_PHASE_INFO[currentPhase];

  const getPhaseIcon = (phase: ReflectionPhase) => {
    const icons: Record<ReflectionPhase, React.ReactNode> = {
      [ReflectionPhase.HANDELEN]: <Play size={20} />,
      [ReflectionPhase.TERUGBLIKKEN]: <Eye size={20} />,
      [ReflectionPhase.BEWUSTWORDING]: <Lightbulb size={20} />,
      [ReflectionPhase.ALTERNATIEVEN]: <Shuffle size={20} />,
      [ReflectionPhase.UITPROBEREN]: <Rocket size={20} />
    };
    return icons[phase];
  };

  const getPhaseColor = (phase: ReflectionPhase, isActive: boolean, isCompleted: boolean) => {
    const colors: Record<ReflectionPhase, { bg: string; border: string; text: string }> = {
      [ReflectionPhase.HANDELEN]: { bg: 'bg-blue-500', border: 'border-blue-500', text: 'text-blue-600' },
      [ReflectionPhase.TERUGBLIKKEN]: { bg: 'bg-purple-500', border: 'border-purple-500', text: 'text-purple-600' },
      [ReflectionPhase.BEWUSTWORDING]: { bg: 'bg-amber-500', border: 'border-amber-500', text: 'text-amber-600' },
      [ReflectionPhase.ALTERNATIEVEN]: { bg: 'bg-emerald-500', border: 'border-emerald-500', text: 'text-emerald-600' },
      [ReflectionPhase.UITPROBEREN]: { bg: 'bg-rose-500', border: 'border-rose-500', text: 'text-rose-600' }
    };
    if (isActive) return colors[phase];
    if (isCompleted) return { bg: 'bg-slate-400', border: 'border-slate-400', text: 'text-slate-500' };
    return { bg: 'bg-slate-200', border: 'border-slate-200', text: 'text-slate-400' };
  };

  const canProceed = state.answers[currentPhase].trim().length > 10;

  // Reflectie is voltooid
  if (state.isComplete) {
    return (
      <div className="max-w-3xl mx-auto py-8 space-y-8 animate-in fade-in duration-500">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg">
            <Sparkles size={40} />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800">Reflectie Voltooid!</h2>
          <p className="text-slate-600 max-w-lg mx-auto">
            Je hebt de volledige Korthagen-cyclus doorlopen. Hieronder vind je een overzicht van je reflectie.
          </p>
        </div>

        {/* Overzicht van alle antwoorden */}
        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-6 text-white">
            <h3 className="font-bold text-xl flex items-center gap-2">
              <RefreshCw size={24} /> Jouw Reflectiecyclus
            </h3>
            <p className="text-slate-300 text-sm mt-1">De 5 fasen van Korthagen</p>
          </div>

          <div className="divide-y divide-slate-100">
            {REFLECTION_QUESTIONS.map((q, idx) => {
              const phase = q.phase;
              const info = REFLECTION_PHASE_INFO[phase];
              const answer = state.answers[phase];
              const colorClass = getPhaseColor(phase, true, false);

              return (
                <div key={phase} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${colorClass.bg} text-white shrink-0`}>
                      {getPhaseIcon(phase)}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Fase {idx + 1}</span>
                        <h4 className={`font-bold ${colorClass.text}`}>{info.title}</h4>
                      </div>
                      <p className="text-sm text-slate-500 italic">{q.question}</p>
                      <div className="bg-slate-50 p-4 rounded-xl mt-2">
                        <p className="text-slate-700 whitespace-pre-wrap">{answer || <span className="text-slate-400 italic">Niet ingevuld</span>}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Acties */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onReset}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition"
          >
            <RotateCcw size={20} /> Nieuwe Reflectie
          </button>
          <button
            onClick={onGoHome}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition shadow-lg"
          >
            <Home size={20} /> Terug naar Home
          </button>
        </div>

        {/* Tip */}
        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200">
          <h4 className="font-bold text-amber-800 flex items-center gap-2 mb-2">
            <Lightbulb size={18} /> Tip voor de praktijk
          </h4>
          <p className="text-amber-700 text-sm">
            Probeer regelmatig te reflecteren met deze cyclus. Door je ervaringen systematisch te analyseren, ontwikkel je je als docent en worden je lessen steeds effectiever.
          </p>
        </div>
      </div>
    );
  }

  // Actieve reflectiefase
  return (
    <div className="max-w-3xl mx-auto py-4 space-y-6 animate-in fade-in duration-300">
      {/* Header met cyclus uitleg */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800">Reflectiecyclus van Korthagen</h2>
        <p className="text-slate-600 text-sm sm:text-base">Doorloop de 5 fasen om je lespraktijk te verbeteren</p>
      </div>

      {/* Visuele cyclus indicator */}
      <div className="flex justify-center items-center gap-1 sm:gap-2 py-4">
        {phases.map((phase, idx) => {
          const isActive = idx === state.currentPhaseIndex;
          const isCompleted = idx < state.currentPhaseIndex;
          const colors = getPhaseColor(phase, isActive, isCompleted);
          const info = REFLECTION_PHASE_INFO[phase];

          return (
            <React.Fragment key={phase}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? `${colors.bg} text-white ring-4 ring-offset-2 ${colors.border} ring-opacity-30 scale-110`
                      : isCompleted
                        ? 'bg-slate-400 text-white'
                        : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 size={20} /> : getPhaseIcon(phase)}
                </div>
                <span className={`text-[10px] sm:text-xs mt-1 font-medium ${isActive ? colors.text : 'text-slate-400'}`}>
                  {info.title}
                </span>
              </div>
              {idx < phases.length - 1 && (
                <div className={`w-4 sm:w-8 h-1 rounded-full transition-colors ${idx < state.currentPhaseIndex ? 'bg-slate-400' : 'bg-slate-200'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Huidige fase content */}
      <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
        {/* Fase header */}
        <div className={`p-6 text-white bg-gradient-to-r ${
          currentPhase === ReflectionPhase.HANDELEN ? 'from-blue-500 to-blue-600' :
          currentPhase === ReflectionPhase.TERUGBLIKKEN ? 'from-purple-500 to-purple-600' :
          currentPhase === ReflectionPhase.BEWUSTWORDING ? 'from-amber-500 to-amber-600' :
          currentPhase === ReflectionPhase.ALTERNATIEVEN ? 'from-emerald-500 to-emerald-600' :
          'from-rose-500 to-rose-600'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl">
              {getPhaseIcon(currentPhase)}
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider opacity-80">Fase {state.currentPhaseIndex + 1} van 5</span>
              <h3 className="text-xl sm:text-2xl font-bold">{phaseInfo.title}</h3>
            </div>
          </div>
        </div>

        {/* Vraag en invoer */}
        <div className="p-6 space-y-4">
          <div>
            <h4 className="text-lg font-bold text-slate-800 mb-2">{currentQuestion.question}</h4>
            {currentQuestion.helpText && (
              <p className="text-sm text-slate-500 bg-slate-50 p-3 rounded-lg border-l-4 border-slate-300">
                {currentQuestion.helpText}
              </p>
            )}
          </div>

          <textarea
            value={state.answers[currentPhase]}
            onChange={(e) => onUpdateAnswer(currentPhase, e.target.value)}
            placeholder={currentQuestion.placeholder}
            rows={6}
            className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-blue-400 outline-none transition-all resize-none text-slate-700 placeholder:text-slate-400"
          />

          <div className="flex items-center justify-between text-sm">
            <span className={`${state.answers[currentPhase].length > 10 ? 'text-emerald-600' : 'text-slate-400'}`}>
              {state.answers[currentPhase].length} karakters
              {state.answers[currentPhase].length <= 10 && ' (minimaal 10)'}
            </span>
          </div>
        </div>

        {/* Navigatie */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <button
            onClick={onPrev}
            disabled={state.currentPhaseIndex === 0}
            className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-200 text-slate-600"
          >
            <ChevronLeft size={20} /> Vorige
          </button>

          <button
            onClick={onNext}
            disabled={!canProceed}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition shadow-md disabled:opacity-40 disabled:cursor-not-allowed ${
              canProceed
                ? 'bg-slate-800 hover:bg-slate-900 text-white'
                : 'bg-slate-300 text-slate-500'
            }`}
          >
            {state.currentPhaseIndex < REFLECTION_QUESTIONS.length - 1 ? (
              <>Volgende <ChevronRight size={20} /></>
            ) : (
              <>Afronden <CheckCircle2 size={20} /></>
            )}
          </button>
        </div>
      </div>

      {/* Korthagen uitleg */}
      <div className="bg-slate-800 text-white p-6 rounded-2xl">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-white/10 rounded-lg shrink-0">
            <BrainCircuit size={24} />
          </div>
          <div>
            <h4 className="font-bold mb-1">De ALACT-cyclus van Korthagen</h4>
            <p className="text-slate-300 text-sm leading-relaxed">
              Fred Korthagen ontwikkelde dit reflectiemodel om docenten te helpen systematisch te leren van hun ervaringen.
              De naam ALACT staat voor: <strong>A</strong>ction, <strong>L</strong>ooking back, <strong>A</strong>wareness,
              <strong>C</strong>reating alternatives, <strong>T</strong>rial.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
