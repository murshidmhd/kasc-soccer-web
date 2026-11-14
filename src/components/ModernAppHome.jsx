import React, { useState } from 'react';
import { 
  ArrowRight, 
  Calendar, 
  Trophy, 
  Flame, 
  Shield, 
  ChevronRight, 
  Sparkles, 
  X, 
  Share2, 
  CheckCircle2, 
  Clock, 
  Play,
  Eye,
  Radio,
  Tv,
  Film
} from 'lucide-react';
import TeamLogo from './TeamLogo';
import StartingSevenPitch from './StartingSevenPitch';
import LiveViewingSection from './LiveViewingSection';
import { fixtures, nextMatch } from '../data/tournamentData';

const SquadSpotlightSection = React.lazy(() => import('./SquadSpotlightSection'));

export default function ModernAppHome({ lang, isDarkMode, onNavigate }) {
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [activeMediaTab, setActiveMediaTab] = useState('formation'); // 'formation' | 'video' | 'spotlight'

  // Completed matches in reverse chronological order (most recent first)
  const completedMatches = fixtures.filter(m => m.status === 'Completed').reverse();

  return (
    <div className="w-full max-w-xl mx-auto px-4 pt-4 pb-36 space-y-6 animate-fadeIn">
      {/* 1. App Greeting (Clean, no duplicate logos) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Day 8 • Pre-Quarter
          </span>

          <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
            8:45 PM IST
          </span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-sports tracking-tight text-slate-900 dark:text-white leading-tight">
            {lang === 'ml' ? 'ഹലോ, ഫുട്ബോൾ പ്രേമി!' : 'Hello, Football Fan!'}
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mt-1 leading-snug">
            {lang === 'ml' 
              ? 'പെരുവള്ളൂർ പഞ്ചായത്ത് സ്റ്റേഡിയത്തിൽ പ്രീ-ക്വാർട്ടർ പോരാട്ടം.' 
              : 'Pre-Quarter knockout battle tonight at Peruvallur Stadium.'}
          </p>
        </div>

        {/* Primary Action Button */}
        <div>
          <button
            onClick={() => onNavigate('fixtures')}
            className="w-full inline-flex items-center justify-between gap-3 px-5 py-3.5 rounded-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-purple-400 dark:text-purple-600 text-base font-black">+</span>
              <span className="truncate">
                {lang === 'ml' 
                  ? 'ഇന്നത്തെ മത്സരം: X8 ടൂർസ് vs റിയൽ തെന്നല' 
                  : "Tonight: X8 Tours vs Real Thennala"}
              </span>
            </div>
            <div className="w-6 h-6 rounded-full bg-white/20 dark:bg-slate-900/10 flex items-center justify-center shrink-0">
              <ArrowRight className="w-3.5 h-3.5 text-white dark:text-slate-950" />
            </div>
          </button>
        </div>
      </div>

      {/* 2. Full-Width Segment Switcher: Lineup & Formation vs Live Stream vs Reels */}
      <div className="space-y-4">
        {/* Modern Segmented Navigation Tabs */}
        <div className="w-full grid grid-cols-3 gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 shadow-xs">
          <button
            onClick={() => setActiveMediaTab('formation')}
            className={`py-2 px-1 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 active:scale-95 ${
              activeMediaTab === 'formation'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>⚽</span>
            <span className="truncate">{lang === 'ml' ? 'ഫോർമേഷൻ' : 'Formation'}</span>
          </button>

          <button
            onClick={() => setActiveMediaTab('video')}
            className={`py-2 px-1 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 active:scale-95 ${
              activeMediaTab === 'video'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>🔴</span>
            <span className="truncate">{lang === 'ml' ? 'ലൈവ് സ്ട്രീം' : 'Live Video'}</span>
          </button>

          <button
            onClick={() => setActiveMediaTab('spotlight')}
            className={`py-2 px-1 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 active:scale-95 ${
              activeMediaTab === 'spotlight'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>🌟</span>
            <span className="truncate">{lang === 'ml' ? 'റീൽസ്' : 'Reels'}</span>
          </button>
        </div>

        {/* Tab 1: Starting 7 Tactical Turf Pitch & Formation */}
        {activeMediaTab === 'formation' && (
          <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-900/70 shadow-lg animate-fadeIn">
            <StartingSevenPitch
              lang={lang}
              isDarkMode={isDarkMode}
            />
          </div>
        )}

        {/* Tab 2: Official YouTube Live Stream & Match Highlights */}
        {activeMediaTab === 'video' && (
          <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-lg animate-fadeIn">
            <LiveViewingSection lang={lang} />
          </div>
        )}

        {/* Tab 3: Squad Video Spotlight Reels */}
        {activeMediaTab === 'spotlight' && (
          <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-lg animate-fadeIn">
            <React.Suspense fallback={<div className="h-48 skeleton-box rounded-3xl animate-pulse"></div>}>
              <SquadSpotlightSection lang={lang} isDarkMode={isDarkMode} />
            </React.Suspense>
          </div>
        )}
      </div>

      {/* 3. Recent Match Results Carousel (Horizontal Cards with Circle Arrows) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 font-sports">
            {lang === 'ml' ? 'സമീപകാല മത്സരങ്ങൾ & റിസൾട്ടുകൾ' : 'Recent Match Results'}
          </h2>
          <button 
            onClick={() => onNavigate('fixtures')}
            className="text-[11px] font-bold text-purple-600 dark:text-purple-400 flex items-center gap-0.5 hover:underline"
          >
            <span>{lang === 'ml' ? 'എല്ലാം' : 'View all'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Horizontal Cards (Side-by-Side Snap Carousel) */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
          {/* Card 1: Tonight's Match */}
          <div 
            onClick={() => onNavigate('fixtures')}
            className="min-w-[250px] max-w-[270px] p-4 rounded-3xl bg-gradient-to-br from-purple-700 via-indigo-800 to-indigo-950 text-white shadow-md cursor-pointer hover:shadow-xl transition-all active:scale-[0.98] snap-start flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-7 h-7 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center">
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gold text-slate-950">
                TONIGHT • 8:45 PM
              </span>
            </div>

            <div>
              <span className="text-[11px] font-medium text-purple-200">
                Pre-Quarter (Round of 16)
              </span>
              <h3 className="text-sm font-black font-sports mt-0.5 line-clamp-2 leading-snug">
                X8 TOURS CALICUT vs REAL FC THENNALA
              </h3>
            </div>
          </div>

          {/* Card 2: Match 7 (Usha vs I-NOV) */}
          {completedMatches[0] && (
            <div 
              onClick={() => {
                if (completedMatches[0].winnerPosterUrl) {
                  setSelectedPoster(completedMatches[0]);
                } else {
                  onNavigate('fixtures');
                }
              }}
              className="min-w-[250px] max-w-[270px] p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.98] snap-start flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  FULL TIME
                </span>
              </div>

              <div>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  {completedMatches[0].day} • Match 7
                </span>
                <h3 className="text-sm font-black font-sports text-slate-900 dark:text-white mt-0.5 leading-snug">
                  USHA FC {completedMatches[0].score1} – {completedMatches[0].score2} I NOV FC
                </h3>
                <p className="text-[10px] text-purple-600 dark:text-purple-400 font-bold mt-1">
                  Winner: {completedMatches[0].winner} • Tap for Poster
                </p>
              </div>
            </div>
          )}

          {/* Card 3: Match 6 (Linsha vs Wayanad) */}
          {completedMatches[1] && (
            <div 
              onClick={() => {
                if (completedMatches[1].winnerPosterUrl) {
                  setSelectedPoster(completedMatches[1]);
                } else {
                  onNavigate('fixtures');
                }
              }}
              className="min-w-[250px] max-w-[270px] p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.98] snap-start flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  FULL TIME
                </span>
              </div>

              <div>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  {completedMatches[1].day} • Match 6
                </span>
                <h3 className="text-sm font-black font-sports text-slate-900 dark:text-white mt-0.5 leading-snug">
                  LINSHA {completedMatches[1].score1} – {completedMatches[1].score2} WAYANAD
                </h3>
                <p className="text-[10px] text-purple-600 dark:text-purple-400 font-bold mt-1">
                  Winner: {completedMatches[1].winner} • Tap for Poster
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Pre-Quarter Knockout Bracket Card */}
      <div 
        onClick={() => onNavigate('fixtures')}
        className="w-full p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-purple-700 via-indigo-700 to-purple-900 text-white shadow-xl cursor-pointer hover:shadow-2xl transition-all active:scale-[0.99] relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform"></div>

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[10px] font-black uppercase tracking-wider text-purple-200">
            <Trophy className="w-3 h-3 text-gold" />
            <span>PRE-QUARTER KNOCKOUT BRACKET</span>
          </div>

          <h2 className="text-lg sm:text-xl font-black font-sports tracking-wide leading-tight">
            {lang === 'ml' 
              ? 'പ്രീ-ക്വാർട്ടർ ഘട്ടവും ടൂർണമെന്റ് ബ്രാക്കറ്റും' 
              : 'Explore Pre-Quarter Tournament Bracket'}
          </h2>

          <p className="text-xs font-medium text-purple-100/90 leading-relaxed">
            {lang === 'ml' 
              ? 'സൂപ്പർ സ്റ്റുഡിയോ മലപ്പുറം, അൽ മദീന ചെറുപ്പുളശ്ശേരി, ഉദയ പറമ്പിൽ പീടിക എന്നിവർ നേരിട്ട് പ്രീ-ക്വാർട്ടറിലേക്ക് യോഗ്യത നേടി.' 
              : 'Super Studio Malappuram, Al Madeena & Udaya qualified directly into Round of 16.'}
          </p>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] font-bold text-white/80 group-hover:text-white transition-colors">
              {lang === 'ml' ? 'പൂർണ്ണ ബ്രാക്കറ്റ് പരിശോധിക്കുക' : 'View Full Bracket'}
            </span>
            <div className="w-9 h-9 rounded-full bg-white text-slate-950 flex items-center justify-center shadow-md group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-4 h-4 text-purple-900 font-bold" />
            </div>
          </div>
        </div>
      </div>

      {/* 5. Quick Action Cards (2-Card Clean Grid) */}
      <div className="grid grid-cols-2 gap-3">
        {/* Card A: Clubs */}
        <div 
          onClick={() => onNavigate('teams')}
          className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md cursor-pointer transition-all active:scale-[0.98] flex flex-col justify-between"
        >
          <div className="w-9 h-9 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase text-slate-900 dark:text-white font-sports">
              {lang === 'ml' ? '24 ക്ലബ്ബുകൾ' : '24 SFA Clubs'}
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              {lang === 'ml' ? 'ഔദ്യോഗിക ലോഗോകൾ & ടീമുകൾ' : 'Official logos & squads'}
            </p>
          </div>
        </div>

        {/* Card B: Live Stream / Predict */}
        <div 
          onClick={() => onNavigate('predict')}
          className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md cursor-pointer transition-all active:scale-[0.98] flex flex-col justify-between"
        >
          <div className="w-9 h-9 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase text-slate-900 dark:text-white font-sports">
              {lang === 'ml' ? 'ഫാൻ വോട്ടിംഗ്' : 'Fan Zone & Vote'}
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              {lang === 'ml' ? 'വിജയിയെ പ്രവചിക്കുക & വോട്ട്' : 'Predict winner & vote'}
            </p>
          </div>
        </div>
      </div>

      {/* Official Poster Modal */}
      {selectedPoster && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedPoster(null)}
        >
          <div 
            className="relative max-w-sm w-full bg-slate-900 rounded-3xl overflow-hidden border border-white/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3.5 border-b border-white/10">
              <div>
                <span className="text-[10px] font-black uppercase text-purple-400">
                  OFFICIAL RESULT POSTER
                </span>
                <h4 className="text-xs font-bold text-white">
                  {selectedPoster.team1} vs {selectedPoster.team2}
                </h4>
              </div>
              <button 
                onClick={() => setSelectedPoster(null)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-black/60 flex items-center justify-center">
              <img 
                src={selectedPoster.winnerPosterUrl} 
                alt="Match Result Poster" 
                className="w-full h-auto rounded-2xl max-h-[60vh] object-contain shadow-lg"
              />
            </div>

            <div className="p-3 bg-slate-900 flex items-center justify-between text-xs">
              <span className="text-slate-400">
                Score: <strong className="text-white">{selectedPoster.score1} – {selectedPoster.score2}</strong>
              </span>
              <span className="text-emerald-400 font-bold">
                Winner: {selectedPoster.winner}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
