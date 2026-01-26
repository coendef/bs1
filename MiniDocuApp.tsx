import React, { useState } from 'react';
import {
  Video,
  Mic,
  PenTool,
  Zap,
  Eye,
  Lightbulb,
  Play,
  CheckCircle2,
  Music,
  Users,
  Film,
  Hammer,
  HeartPulse,
  ShieldAlert,
  HelpCircle,
  ClipboardList,
  Sparkles,
  ArrowRight,
  Youtube,
  ExternalLink
} from 'lucide-react';

// Card component voor de verschillende secties
const Card = ({ title, icon: Icon, children, color }: { title: string; icon: React.ElementType; children: React.ReactNode; color: string }) => (
  <div className={`bg-white rounded-2xl shadow-lg p-6 border-t-4 ${color} transition-all hover:scale-[1.02] h-full flex flex-col`}>
    <div className="flex items-center gap-3 mb-4">
      <div className={`p-2 rounded-lg ${color.replace('border-', 'bg-').replace('-500', '-100')}`}>
        <Icon className={color.replace('border-', 'text-')} size={24} />
      </div>
      <h3 className="text-xl font-bold text-gray-800 text-left">{title}</h3>
    </div>
    <div className="text-gray-600 leading-relaxed text-sm text-left flex-grow">{children}</div>
  </div>
);

// Component voor concrete Klokhuis voorbeelden
const KlokhuisExample = ({ title, strategy, example, icon: Icon }: { title: string; strategy: string; example: string; icon: React.ElementType }) => (
  <div className="flex gap-4 p-5 bg-white rounded-xl border border-gray-100 shadow-sm items-start transition-colors hover:border-indigo-200">
    <div className="bg-indigo-50 p-3 rounded-full text-indigo-600 shrink-0">
      <Icon size={20} />
    </div>
    <div className="text-left">
      <h4 className="font-bold text-gray-900 text-sm mb-1">{title}</h4>
      <p className="text-xs text-indigo-600 font-semibold mb-2 uppercase tracking-wider">{strategy}</p>
      <p className="text-sm text-gray-600 italic">"{example}"</p>
    </div>
  </div>
);

// Component voor de YouTube video embeds - GEFIXTE VERSIE
const VideoEmbed = ({ title, videoId, description }: { title: string; videoId: string; description: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Gebruik altijd YouTube's eigen thumbnail
  const thumbnailUrl = imageError
    ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
    : `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 flex flex-col group transition-all hover:shadow-2xl relative">
      <div className="aspect-video w-full bg-black relative">
        {!isPlaying ? (
          <div
            className="relative w-full h-full cursor-pointer"
            onClick={() => setIsPlaying(true)}
          >
            <img
              src={thumbnailUrl}
              alt={title}
              className="w-full h-full object-cover transition-opacity group-hover:opacity-90"
              onError={() => setImageError(true)}
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <div className="bg-indigo-600/90 text-white p-4 rounded-full shadow-2xl transition-transform group-hover:scale-110">
                <Play size={44} fill="currentColor" className="ml-1" />
              </div>
            </div>
          </div>
        ) : (
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        )}
      </div>
      <div className="p-6 text-left bg-gradient-to-b from-white to-slate-50 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-bold text-gray-900 flex items-center gap-2 group-hover:text-indigo-600 transition-colors">
            <Youtube size={18} className="text-red-600" /> {title}
          </h4>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">{description}</p>
        <a
          href={`https://www.youtube.com/watch?v=${videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors mt-auto"
        >
          <ExternalLink size={14} /> Bekijk op YouTube
        </a>
      </div>
    </div>
  );
};

// Stap component voor het stappenplan
const Step = ({ number, title, desc }: { number: string; title: string; desc: string }) => (
  <div className="flex gap-4 mb-8 relative">
    <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md z-10">
      {number}
    </div>
    <div className="text-left">
      <h4 className="text-lg font-bold text-gray-800 mb-1">{title}</h4>
      <p className="text-gray-600 text-sm">{desc}</p>
    </div>
  </div>
);

const MiniDocuApp = () => {
  const [activeTab, setActiveTab] = useState('script');
  const [showBrainstorm, setShowBrainstorm] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header sectie */}
      <header className="bg-indigo-700 text-white py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute transform -rotate-12 -top-10 -left-10 text-9xl font-black select-none text-white/20">DOCU</div>
          <div className="absolute transform rotate-12 bottom-0 right-0 text-9xl font-black select-none text-white/20">KLOK</div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-indigo-500/30 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6 border border-white/20">
            <Sparkles size={14} className="text-yellow-300" /> Pabo Masterclass: Video Gids
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
            Mini-Docu <span className="text-yellow-400 drop-shadow-sm">Meesterschap</span>
          </h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto font-medium">
            Transformeer abstracte lesstof naar meeslepende verhalen met de technieken van Het Klokhuis en Sara's Mysteries.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">

        {/* Introductie over "Show, Don't Tell" */}
        <section className="mb-24 grid md:grid-cols-2 gap-16 items-center">
          <div className="text-left">
            <h2 className="text-3xl font-bold mb-8 text-gray-900 flex items-center gap-3">
              <Zap className="text-yellow-500" fill="currentColor" /> De 'Onweerstaanbare' Opening
            </h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              In de eerste 30 seconden trek je de kijker het verhaal in. Geen saaie introducties, maar direct een <strong>prikkelende ervaring</strong>.
            </p>
            <div className="space-y-6">
              <div className="flex gap-4 items-start p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                <div className="bg-green-100 p-2 rounded-xl text-green-600"><CheckCircle2 size={20} /></div>
                <p className="text-sm"><strong>De Actie-Opening:</strong> In de aflevering over <em>Vliegtuigonderhoud</em> zien we de presentator direct in een hangar bij een gigantische machine.</p>
              </div>
              <div className="flex gap-4 items-start p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                <div className="bg-blue-100 p-2 rounded-xl text-blue-600"><ShieldAlert size={20} /></div>
                <p className="text-sm"><strong>De Fictie-Laag:</strong> Gebruik een kort rollenspel (zoals de winkeldief bij de politie) om spanning op te bouwen.</p>
              </div>
              <div className="flex gap-4 items-start p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                <div className="bg-purple-100 p-2 rounded-xl text-purple-600"><Mic size={20} /></div>
                <p className="text-sm"><strong>Het Mysterie:</strong> In <em>Sara's Mysteries</em> begint het met een kind dat een 'geheimzinnige gouden tand' vond op zolder. Je móet weten wat het is.</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-indigo-200 rounded-[3rem] blur-2xl opacity-30 animate-pulse"></div>
            <div className="relative bg-white rounded-[2.5rem] p-10 border-2 border-indigo-50 shadow-xl flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center text-white mb-6 shadow-lg shadow-indigo-200">
                <Play size={48} fill="currentColor" className="ml-2" />
              </div>
              <p className="text-xl font-bold text-indigo-900 italic leading-snug">"Beeld haalt het eigenlijk nooit bij verbeelding."</p>
              <div className="mt-4 h-1 w-12 bg-yellow-400 rounded-full mx-auto"></div>
              <p className="text-sm font-semibold text-indigo-400 mt-4 uppercase tracking-widest">Sara's Mysteries</p>
            </div>
          </div>
        </section>

        {/* Video sectie: Klokhuis in Beeld */}
        <section className="mb-24">
          <div className="flex flex-col items-center mb-12 text-center">
            <h2 className="text-4xl font-black text-gray-900 mb-4 flex items-center gap-3">
               <Youtube className="text-red-600" size={40} /> Klokhuis in Beeld
            </h2>
            <p className="text-gray-600 max-w-2xl">
              Bekijk hoe de profs het doen. Deze fragmenten illustreren de technieken van actieve openingen, metaforen en technisch proces.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <VideoEmbed
              title="Vliegtuigonderhoud"
              videoId="oyzwGN9rqAU"
              description="Bekijk hoe de presentator direct in de hangar start. Let op de schaal-vergelijking met de olifanten!"
            />
            <VideoEmbed
              title="Zo verdwaal je niet op zee"
              videoId="oNT7EFg5GPI"
              description="Een schoolvoorbeeld van een proces-verhaal: hoe werkt een vuurtoren en navigatie op zee?"
            />
            <VideoEmbed
              title="Een glijbaan van karton"
              videoId="YRbrcPFD2RE"
              description="Ontdek hoe je van een simpel moodboard en karton een spectaculaire workshop en battle maakt."
            />
          </div>
        </section>

        {/* Klokhuis Voorbeelden Sectie */}
        <section className="mb-24">
          <div className="bg-slate-900 rounded-[3rem] p-10 md:p-16 text-white shadow-2xl relative overflow-hidden text-left">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <h2 className="text-3xl font-black mb-12 text-center flex items-center justify-center gap-3 relative z-10">
              <Lightbulb className="text-yellow-400" /> Geheimen Achter de Schermen
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
              <KlokhuisExample
                title="Gips & Botbreuken"
                strategy="Krachtige Metafoor"
                example="Herstel wordt vergeleken met kauwgom die hard wordt. De 'brug' tussen botten maakt het proces zichtbaar."
                icon={HeartPulse}
              />
              <KlokhuisExample
                title="Vliegtuigonderhoud"
                strategy="Begrijpelijke Schaal"
                example="Een vliegtuig weegt evenveel als 27 olifanten. Cijfers worden beelden die kinderen onthouden."
                icon={Film}
              />
              <KlokhuisExample
                title="Podcast Maken"
                strategy="Foley Art (Geluid)"
                example="Een ritselende paraplu wordt een oerbos. Kleine kistjes worden dinovleugels. Geluid IS sfeer."
                icon={Mic}
              />
              <KlokhuisExample
                title="Kartonnen Robots"
                strategy="Actieve Battle"
                example="Bouw robotpakken van karton en houd een battle. Theorie wordt een fysieke ervaring."
                icon={Hammer}
              />
              <KlokhuisExample
                title="AI & Deepfakes"
                strategy="The Battle"
                example="Presentator vs AI: wie eet het beste een banaan? Humor ontmaskert de fouten van techniek."
                icon={Zap}
              />
              <KlokhuisExample
                title="Pesten Begrijpen"
                strategy="Psychologie"
                example="Pesten als 'oergedrag' en de zucht naar applaus. Het maakt een zwaar thema bespreekbaar."
                icon={Users}
              />
            </div>
          </div>
        </section>

        {/* Tab-systeem voor Werkwijze */}
        <section className="mb-24">
          <div className="flex justify-center border-b border-gray-200 mb-12 overflow-x-auto no-scrollbar">
            <div className="flex gap-4 md:gap-8 px-2">
              {[
                { id: 'script', label: '1. Het Script', icon: PenTool },
                { id: 'content', label: '2. Educatieve Strategie', icon: Lightbulb },
                { id: 'audio', label: '3. Geluid & Montage', icon: Music }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-4 px-4 font-bold text-lg whitespace-nowrap transition-all border-b-4 flex items-center gap-2 ${activeTab === tab.id ? 'border-indigo-600 text-indigo-600 scale-105' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                >
                  <tab.icon size={20} /> {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-10 md:p-14 shadow-xl border border-gray-100 transition-all text-left">
            {activeTab === 'script' && (
              <div className="grid md:grid-cols-2 gap-16">
                <div>
                  <h3 className="text-2xl font-black text-indigo-900 mb-8 uppercase tracking-tight">Scripten als een Designer</h3>
                  <Step number="1" title="Research & Moodboard" desc="Begin bij het mysterie. Verzamel sfeerbeelden zoals de decorontwerper van het festivalpodium doet." />
                  <Step number="2" title="De Reis: A naar B" desc="Structureer je verhaal chronologisch. Van ontwerp naar bouw, of van medische klacht naar de gipskamer." />
                  <Step number="3" title="Experts Regisseren" desc="Wees niet bang om een antwoord opnieuw te vragen. 'Korter en krachtiger' is het motto in de montage." />
                  <Step number="4" title="Voice-over als Gids" desc="De voice-over is de 'lijm'. Het vult de gaten tussen interviews en vertelt wat de kijker niet ziet." />
                </div>
                <div className="bg-indigo-50 rounded-3xl p-8 border border-indigo-100 flex flex-col justify-center">
                  <h4 className="font-bold text-indigo-800 mb-4 flex items-center gap-2 uppercase tracking-wide text-sm">
                    <CheckCircle2 size={18} /> Pro-Tip: Materiaal verzamelen
                  </h4>
                  <p className="text-gray-700 italic mb-6">
                    "Neem véél meer op dan je nodig hebt. Voor een aflevering van 30 minuten nemen makers vaak 3 tot 4 uur aan materiaal op."
                  </p>
                  <div className="p-5 bg-white rounded-2xl shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">Betrouwbaarheid</p>
                    <p className="text-sm text-slate-700">Check altijd je bron. Wie is de afzender? Wetenschappers en journalisten zijn de basis van Klokhuis-educatie.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'content' && (
              <div className="space-y-10">
                <h3 className="text-2xl font-black text-indigo-900 mb-4 uppercase tracking-tight italic text-center">Hoe hou je ze bij de les?</h3>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="p-8 bg-yellow-50 rounded-[2rem] border border-yellow-100 group hover:bg-yellow-100 transition-colors">
                    <div className="w-14 h-14 bg-yellow-400 rounded-2xl flex items-center justify-center text-white mb-6 shadow-md shadow-yellow-100">
                      <Zap size={28} />
                    </div>
                    <h4 className="font-bold text-yellow-900 mb-3 text-xl">De 'Battle'</h4>
                    <p className="text-sm text-yellow-800 leading-relaxed font-medium">Daag theorie uit. Gebruik een wedstrijd (mens vs AI) om abstracte concepten zichtbaar en grappig te maken.</p>
                  </div>
                  <div className="p-8 bg-green-50 rounded-[2rem] border border-green-100 group hover:bg-green-100 transition-colors">
                    <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-md shadow-green-100">
                      <Users size={28} />
                    </div>
                    <h4 className="font-bold text-green-900 mb-3 text-xl">Stap er zelf in</h4>
                    <p className="text-sm text-green-800 leading-relaxed font-medium">De presentator IS de leerling. Ga zwemmen in sokken of speel een rollenspel. Ervaring {' > '} Uitleg.</p>
                  </div>
                  <div className="p-8 bg-pink-50 rounded-[2rem] border border-pink-100 group hover:bg-pink-100 transition-colors">
                    <div className="w-14 h-14 bg-pink-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-md shadow-pink-100">
                      <Eye size={28} />
                    </div>
                    <h4 className="font-bold text-pink-900 mb-3 text-xl">Anders Kijken</h4>
                    <p className="text-sm text-pink-800 leading-relaxed font-medium">Gebruik technologie (360° camera's) of metaforen (telescoop-spiegels) om de wereld door andere ogen te zien.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'audio' && (
              <div className="grid md:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                  <h3 className="text-2xl font-black text-indigo-900 uppercase tracking-tight">Audio: De Onzichtbare Kracht</h3>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    Geluid bepaalt voor 50% de beleving van je documentaire. Goede audio trekt de luisteraar in een andere wereld.
                  </p>
                  <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center gap-6">
                    <div className="bg-indigo-600 text-white p-4 rounded-full shadow-lg">
                      <Music size={28} />
                    </div>
                    <div>
                      <h4 className="font-bold text-indigo-900 text-lg">Audio is Emotie</h4>
                      <p className="text-sm text-indigo-700">De stilte bij de vuurtorenlamp bouwt spanning op. 'Foley' geluiden (paraplu als bos) prikkelen de verbeelding.</p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-2xl">
                  <h4 className="font-bold mb-6 text-pink-400 uppercase tracking-widest text-sm">De Audio-Checklist:</h4>
                  <div className="space-y-4">
                    <div className="flex gap-4 items-center">
                      <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400">🎤</div>
                      <span className="text-sm">Gebruik 'Foley' (huis-tuin-en-keuken geluiden)</span>
                    </div>
                    <div className="flex gap-4 items-center">
                      <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400">🎤</div>
                      <span className="text-sm">Een enthousiaste Voice-over is je gids</span>
                    </div>
                    <div className="flex gap-4 items-center">
                      <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400">🎤</div>
                      <span className="text-sm">Benoem visuele zaken voor de 'blinde' luisteraar</span>
                    </div>
                    <div className="flex gap-4 items-center">
                      <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400">🎤</div>
                      <span className="text-sm">Omgevingsgeluid (ambiance) zet direct de sfeer</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Brainstorm Kit */}
        {showBrainstorm && (
          <section id="brainstorm-kit" className="mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="bg-white rounded-[3rem] p-10 md:p-16 border-2 border-indigo-100 shadow-2xl relative overflow-hidden text-left">
              <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600"></div>
              <div className="flex justify-between items-start mb-12">
                <h2 className="text-4xl font-black text-indigo-900 flex items-center gap-4">
                  <Sparkles className="text-yellow-500" /> Jouw Brainstorm Kit
                </h2>
                <button
                  onClick={() => setShowBrainstorm(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-500 p-2 rounded-full transition-colors"
                >
                  <ArrowRight className="rotate-45" size={24} />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-16">
                <div className="space-y-8">
                  <h3 className="text-xl font-bold text-indigo-800 flex items-center gap-3">
                    <ClipboardList size={24} className="text-indigo-600" /> Aan de Slag
                  </h3>
                  <div className="space-y-6">
                    <div className="p-6 bg-slate-50 rounded-2xl border-l-4 border-indigo-500 shadow-sm transition-transform hover:-translate-x-1">
                      <p className="font-black text-gray-800 text-sm mb-2 uppercase tracking-wide">1. Kies je Focus</p>
                      <p className="text-sm text-gray-600 leading-relaxed">Ga je voor een <strong>Technisch Proces</strong> (hoe wordt iets gemaakt?) of een <strong>Maatschappelijk Vraagstuk</strong> (waarom doen we dit?).</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl border-l-4 border-indigo-500 shadow-sm transition-transform hover:-translate-x-1">
                      <p className="font-black text-gray-800 text-sm mb-2 uppercase tracking-wide">2. De 'Kauwgom' Metafoor</p>
                      <p className="text-sm text-gray-600 leading-relaxed">Welk alledaags voorwerp legt jouw moeilijke lesstof uit? Zoek een beeld dat iedereen begrijpt.</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl border-l-4 border-indigo-500 shadow-sm transition-transform hover:-translate-x-1">
                      <p className="font-black text-gray-800 text-sm mb-2 uppercase tracking-wide">3. Zoek de Expert</p>
                      <p className="text-sm text-gray-600 leading-relaxed">Zoek iemand die op een bijzondere plek werkt. Laat ze niet alleen praten, maar laat ze iets DOEN.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <h3 className="text-xl font-bold text-indigo-800 flex items-center gap-3">
                    <HelpCircle size={24} className="text-indigo-600" /> Startvragen voor het Script
                  </h3>
                  <div className="space-y-3">
                    {[
                      "Welk 'geheim' gaan we vandaag samen ontrafelen?",
                      "Als de camera uit staat, welk geluid móeten we dan opnemen?",
                      "Wat is de meest maffe locatie waar we kunnen filmen?",
                      "Hoe laten we de kijker binnen 10 seconden lachen of verbazen?",
                      "Wat zou een kind van 8 'supervet' vinden om te zien?",
                      "Welke fysieke actie kan de presentator nu direct doen?"
                    ].map((vraag, i) => (
                      <div key={i} className="flex gap-4 items-center p-4 bg-white rounded-xl border border-slate-100 transition-all hover:border-indigo-200 hover:shadow-md group">
                        <div className="text-indigo-300 group-hover:text-indigo-600 transition-colors">
                          <ArrowRight size={18} />
                        </div>
                        <span className="text-sm font-bold text-gray-700">{vraag}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 p-6 bg-yellow-400 rounded-3xl shadow-lg shadow-yellow-100 rotate-1">
                    <p className="text-sm text-yellow-950 leading-relaxed font-black">
                      💡 MEESTER-TIP: Pak je smartphone, start de memorecorder en beantwoord deze vragen hardop. Je eerste ingeving is vaak de goudmijn voor je script!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Call to Action Footer */}
        <section className="bg-indigo-900 rounded-[3rem] p-12 md:p-20 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-indigo-500 to-pink-500"></div>
          <div className="max-w-3xl mx-auto relative z-10">
            <h2 className="text-4xl font-black mb-8 text-center italic tracking-tight uppercase">Ben jij een Mini-Docu Meester?</h2>
            <div className="grid sm:grid-cols-2 gap-6 mb-12 text-left">
              {[
                "Start ik met directe actie of rollenspel?",
                "Zijn mijn metaforen raak (olifanten/kauwgom)?",
                "Heb ik een visueel moodboard gemaakt?",
                "Is de voice-over mijn enthousiaste gids?",
                "Zit er een actieve 'battle' of uitdaging in?",
                "Is mijn expert bevlogen en actiegericht?"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-indigo-800/40 p-3 rounded-2xl border border-indigo-700/50">
                  <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center shrink-0 shadow-sm text-indigo-900">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="text-indigo-50 text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
            <div className="text-center">
              <button
                onClick={() => {
                  setShowBrainstorm(true);
                  setTimeout(() => {
                    const el = document.getElementById('brainstorm-kit');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="bg-yellow-400 hover:bg-white text-indigo-900 font-black py-6 px-12 rounded-full text-2xl transition-all transform hover:scale-105 active:scale-95 shadow-2xl flex items-center gap-4 mx-auto group"
              >
                <Video size={32} className="group-hover:animate-bounce" /> START JOUW PRODUCTIE
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-16 text-center text-gray-400 border-t border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-left">
          <p className="text-sm font-medium">&copy; 2025 Mini-Docu Gids voor de Pabo. Gemaakt voor de leerkrachten van morgen.</p>
          <div className="flex gap-4">
             <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"><Youtube size={16} /></div>
             <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"><ExternalLink size={16} /></div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MiniDocuApp;
