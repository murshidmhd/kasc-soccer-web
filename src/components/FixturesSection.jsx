import React, { useMemo, useState, useEffect, Suspense, lazy } from 'react';
import { Calendar, Clock, MapPin, Trophy, ListFilter, CheckCircle2, ChevronDown, ChevronUp, Image as ImageIcon } from 'lucide-react';
import { getStoredFixtures } from '../utils/fixtureManager';
import TeamLogo from './TeamLogo';

// Lazy-load Knockout Bracket to eliminate lag when opening the Fixtures tab
const TournamentBracket = lazy(() => import('./TournamentBracket'));

export default function FixturesSection({ lang, isDarkMode }) {
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'bracket'
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'completed' | 'upcoming'
  const [expandedMatch, setExpandedMatch] = useState(null);
  const [activeFixtures, setActiveFixtures] = useState(() => getStoredFixtures());

  useEffect(() => {
    const handleUpdate = (e) => {
      if (Array.isArray(e.detail)) {
        setActiveFixtures(e.detail);
      } else {
        setActiveFixtures(getStoredFixtures());
      }
    };
    window.addEventListener('kasc_fixtures_updated', handleUpdate);
    return () => window.removeEventListener('kasc_fixtures_updated', handleUpdate);
  }, []);

  const completedCount = useMemo(() => activeFixtures.filter(m => m.status === 'Completed').length, [activeFixtures]);
  const upcomingCount = useMemo(() => activeFixtures.filter(m => m.status !== 'Completed').length, [activeFixtures]);

  const displayedFixtures = useMemo(() => {
    if (filterMode === 'completed') {
      return activeFixtures.filter(m => m.status === 'Completed');
    }
    if (filterMode === 'upcoming') {
      return activeFixtures.filter(m => m.status !== 'Completed');
    }
    return activeFixtures;
  }, [activeFixtures, filterMode]);

  const fixtureGroups = useMemo(() => {
    const groups = new Map();
    displayedFixtures.forEach((match) => {
      const key = match.date || 'Date TBA';
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(match);
    });
    return [...groups.entries()];
  }, [displayedFixtures]);

  const getShortTag = (match) => {
    if (match.stage?.includes('Quarter') || match.id?.startsWith('qf')) {
      return 'Quarter Final';
    }
    if (match.stage?.includes('Semi') || match.id?.startsWith('sf')) {
      return 'Semi Final';
    }
    if (match.stage?.includes('Final') || match.id === 'final') {
      return 'Final';
    }
    if (match.id === 'm1') {
      return 'Opening Match';
    }
    return match.stage || 'Round 1';
  };

  return (
    <section id="fixtures" className="py-4 sm:py-6 max-w-4xl mx-auto space-y-5">
      {/* 1. Header with Compact Meta & Switcher */}
      <div className={`p-4 sm:p-5 rounded-3xl border transition-colors shadow-xs ${
        isDarkMode ? 'bg-navy-900 border-navy-700/80' : 'bg-white border-surface-border'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gold/15 text-gold text-[11px] font-black uppercase tracking-wider mb-1.5 border border-gold/30">
              <Calendar className="w-3 h-3 text-gold" />
              <span>{lang === 'ml' ? 'മത്സരക്രമം' : 'TOURNAMENT SCHEDULE'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-sports tracking-wide uppercase text-card-title">
              {lang === 'ml' ? 'ടൂർണ്ണമെന്റ് മത്സരങ്ങൾ' : 'Fixtures & Results'}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-card-muted mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-royal dark:text-sky shrink-0" />
              <span>Peruvallur Panjayath Stadium • 8:45 PM IST</span>
            </div>
          </div>

          {/* View Toggle (List vs Knockout Tree) */}
          <div className={`inline-flex items-center gap-1 p-1 rounded-2xl border self-start sm:self-auto ${
            isDarkMode ? 'bg-navy-950/80 border-navy-700' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => setViewMode('list')}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 active:scale-95 ${
                viewMode === 'list'
                  ? 'btn-royal text-white shadow-xs'
                  : 'text-card-muted hover:text-card-title'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>Match List</span>
            </button>
            <button
              onClick={() => setViewMode('bracket')}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 active:scale-95 ${
                viewMode === 'bracket'
                  ? 'btn-royal text-white shadow-xs'
                  : 'text-card-muted hover:text-card-title'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Bracket</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: TOURNAMENT BRACKET (Lazy Loaded for Instant Tab Switch) */}
      {viewMode === 'bracket' && (
        <Suspense fallback={
          <div className="p-12 text-center text-xs text-card-muted animate-pulse">
            Loading Tournament Bracket...
          </div>
        }>
          <div className="animate-fadeIn">
            <TournamentBracket lang={lang} isDarkMode={isDarkMode} fixturesList={activeFixtures} />
          </div>
        </Suspense>
      )}

      {/* VIEW 2: FIXTURES LIST GRID */}
      {viewMode === 'list' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Quick Filter Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setFilterMode('all')}
              className={`min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 active:scale-95 shrink-0 ${
                filterMode === 'all'
                  ? 'btn-royal text-white font-black shadow-xs'
                  : isDarkMode ? 'bg-navy-900 border border-navy-700 text-slate-300' : 'bg-white border border-surface-border text-slate-700'
              }`}
            >
              <span>{lang === 'ml' ? `എല്ലാം (${activeFixtures.length})` : `All (${activeFixtures.length})`}</span>
            </button>

            <button
              onClick={() => setFilterMode('completed')}
              className={`min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 active:scale-95 shrink-0 ${
                filterMode === 'completed'
                  ? 'btn-royal text-white font-black shadow-xs'
                  : isDarkMode ? 'bg-navy-900 border border-navy-700 text-slate-300' : 'bg-white border border-surface-border text-slate-700'
              }`}
            >
              <span>{lang === 'ml' ? `റിസൾട്ട് (${completedCount})` : `Results (${completedCount})`}</span>
            </button>

            <button
              onClick={() => setFilterMode('upcoming')}
              className={`min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 active:scale-95 shrink-0 ${
                filterMode === 'upcoming'
                  ? 'btn-royal text-white font-black shadow-xs'
                  : isDarkMode ? 'bg-navy-900 border border-navy-700 text-slate-300' : 'bg-white border border-surface-border text-slate-700'
              }`}
            >
              <span>{lang === 'ml' ? `അടുത്ത മത്സരങ്ങൾ (${upcomingCount})` : `Upcoming (${upcomingCount})`}</span>
            </button>
          </div>

          {/* Fixtures Groups */}
          <div className="space-y-4">
            {fixtureGroups.map(([date, matches]) => (
              <section key={date} aria-label={date} className="space-y-2">
                {/* Clean, Non-Lagging Solid Header */}
                <div className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-between ${
                  isDarkMode ? 'bg-navy-900/90 text-sky border border-navy-800' : 'bg-slate-100 text-royal border border-slate-200'
                }`}>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{date}</span>
                  </div>
                  <span className="text-[10px] font-mono text-card-muted font-normal">
                    {matches.length} {matches.length === 1 ? 'Match' : 'Matches'}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {matches.map((match) => {
                    const isConfirmed = Boolean(match.confirmed);
                    const team1Name = isConfirmed ? (match.team1 || 'TBD') : 'TBD';
                    const team2Name = isConfirmed ? (match.team2 || 'TBD') : 'TBD';

                    const isNextMatch = match.status === 'Upcoming' && isConfirmed && (match.id === 'm8');
                    const isMatchLive = match.status === 'LIVE';
                    const isCompleted = match.status === 'Completed';
                    const isQuarter = match.id?.startsWith('qf') || match.stage?.includes('Quarter');

                    const score1 = match.score1 !== null ? Number(match.score1) : null;
                    const score2 = match.score2 !== null ? Number(match.score2) : null;
                    const team1Won = isCompleted && score1 !== null && score2 !== null && score1 > score2;
                    const team2Won = isCompleted && score1 !== null && score2 !== null && score2 > score1;
                    const winnerName = match.winner || (team1Won ? team1Name : team2Won ? team2Name : null);
                    const isExpanded = expandedMatch === match.id;

                    return (
                      <div
                        key={match.id}
                        className={`rounded-2xl transition-all shadow-card border overflow-hidden ${
                          isNextMatch
                            ? 'border-2 border-gold ring-1 ring-gold/40 bg-white dark:bg-navy-800'
                            : isQuarter
                              ? 'border-purple-500/50 bg-white dark:bg-navy-800'
                              : isDarkMode 
                                ? 'bg-navy-800/95 border-navy-700/80 hover:border-navy-600' 
                                : 'bg-white border-surface-border hover:border-slate-300'
                        }`}
                      >
                        <div 
                          onClick={() => setExpandedMatch(isExpanded ? null : match.id)}
                          className="p-3.5 sm:p-4 cursor-pointer select-none space-y-3"
                        >
                          {/* Card Top Row: Tag, Stage, Time/Status */}
                          <div className={`flex items-center justify-between text-xs pb-2 border-b ${
                            isDarkMode ? 'border-navy-700/60 text-navy-muted' : 'border-surface-border text-card-muted'
                          }`}>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                isNextMatch
                                  ? 'bg-gold text-navy-950 font-black'
                                  : isQuarter
                                    ? 'bg-purple-700 text-white'
                                    : isCompleted
                                      ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 font-bold'
                                      : 'bg-surface-light dark:bg-navy-700 text-card-title'
                              }`}>
                                {getShortTag(match)}
                              </span>

                              {match.day && (
                                <span className="text-[10px] text-card-muted font-mono font-medium">
                                  {match.day}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              {isMatchLive ? (
                                <span className="inline-flex items-center gap-1 bg-red-600 text-white px-2 py-0.5 rounded-full font-black text-[10px] uppercase animate-pulse">
                                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                                  LIVE
                                </span>
                              ) : isCompleted ? (
                                <span className="text-[10px] font-black uppercase text-emerald-500 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Full Time
                                </span>
                              ) : (
                                <div className="flex items-center gap-1 text-card-muted text-[11px] whitespace-nowrap font-mono">
                                  <Clock className="w-3 h-3 text-royal dark:text-sky" />
                                  <span>{match.time || '8:45 PM'}</span>
                                </div>
                              )}
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-card-muted" /> : <ChevronDown className="w-3.5 h-3.5 text-card-muted" />}
                            </div>
                          </div>

                          {/* Teams & Scoreboard Grid */}
                          <div className={`grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-xl p-2.5 ${
                            isDarkMode ? 'bg-navy-950/60' : 'bg-slate-50'
                          }`}>
                            {/* Team 1 */}
                            <div className="flex flex-col items-center gap-1 text-center min-w-0">
                              <span className="w-10 h-10 rounded-full bg-white p-0.5 border border-surface-border dark:border-navy-700 flex items-center justify-center shrink-0">
                                <TeamLogo teamName={team1Name} className="w-full h-full rounded-full object-contain" />
                              </span>
                              <span className={`w-full line-clamp-2 text-xs leading-tight font-sports ${
                                team1Won ? 'font-black text-emerald-400 font-bold' : isCompleted ? 'opacity-60 text-card-muted' : 'font-bold text-card-title'
                              }`}>
                                {team1Name}
                              </span>
                            </div>

                            {/* Score / VS Center */}
                            <div className="min-w-[64px] text-center px-1">
                              {isCompleted || isMatchLive ? (
                                <div className="space-y-0.5">
                                  <span className="text-xl sm:text-2xl font-black font-sports text-card-title tracking-wider">
                                    {score1 ?? 0} <span className="text-card-muted font-normal">–</span> {score2 ?? 0}
                                  </span>
                                  {isCompleted && winnerName && (
                                    <span className="block text-[9px] font-bold uppercase tracking-wider text-emerald-400">
                                      Won
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="inline-block px-2.5 py-1 rounded-lg bg-surface-light dark:bg-navy-800 text-[11px] font-black uppercase tracking-widest text-card-muted border border-surface-border dark:border-navy-700">
                                  VS
                                </span>
                              )}
                            </div>

                            {/* Team 2 */}
                            <div className="flex flex-col items-center gap-1 text-center min-w-0">
                              <span className="w-10 h-10 rounded-full bg-white p-0.5 border border-surface-border dark:border-navy-700 flex items-center justify-center shrink-0">
                                <TeamLogo teamName={team2Name} className="w-full h-full rounded-full object-contain" />
                              </span>
                              <span className={`w-full line-clamp-2 text-xs leading-tight font-sports ${
                                team2Won ? 'font-black text-emerald-400 font-bold' : isCompleted ? 'opacity-60 text-card-muted' : 'font-bold text-card-title'
                              }`}>
                                {team2Name}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Expandable Details & Official Result Poster */}
                        {isExpanded && (
                          <div className={`px-4 pb-4 pt-2 border-t text-xs space-y-3 animate-fadeIn ${
                            isDarkMode ? 'border-navy-700/60 bg-navy-950/40' : 'border-slate-200/80 bg-slate-50/60'
                          }`}>
                            <div className="flex flex-wrap items-center justify-between gap-2 text-card-muted">
                              <span className="font-semibold">{match.stage}</span>
                              <span className="inline-flex items-center gap-1 font-mono text-[11px]">
                                <MapPin className="w-3 h-3 text-royal dark:text-sky" />
                                {match.stadium || 'Peruvallur Panjayath Stadium'}
                              </span>
                            </div>

                            {winnerName && (
                              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-bold flex items-center gap-2">
                                <Trophy className="w-4 h-4 text-gold shrink-0" />
                                <span>Winner: <strong className="text-white">{winnerName}</strong></span>
                              </div>
                            )}

                            {match.winnerPosterUrl && (
                              <div className="space-y-1.5 pt-1">
                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-card-muted uppercase">
                                  <ImageIcon className="w-3.5 h-3.5 text-royal dark:text-sky" />
                                  <span>Official Result Poster</span>
                                </div>
                                <div className="rounded-xl overflow-hidden border border-surface-border dark:border-navy-700 max-w-sm mx-auto shadow-sm">
                                  <img 
                                    src={match.winnerPosterUrl} 
                                    alt={`${match.team1} vs ${match.team2} Result`}
                                    className="w-full h-auto object-cover"
                                    loading="lazy"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
