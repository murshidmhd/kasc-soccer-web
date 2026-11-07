import React, { useMemo, useState } from 'react';
import { Calendar, Clock, MapPin, Trophy, ListFilter } from 'lucide-react';
import { fixtures } from '../data/tournamentData';
import TeamLogo from './TeamLogo';
import TournamentBracket from './TournamentBracket';

export default function FixturesSection({ lang, isDarkMode }) {
  // In-memory toggle between list and tree view
  const [viewMode, setViewMode] = useState('list');
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'confirmed'
  const [expandedMatch, setExpandedMatch] = useState(null);

  const confirmedFixtures = fixtures.filter(m => m.confirmed);
  const displayedFixtures = filterMode === 'confirmed' ? confirmedFixtures : fixtures;
  const fixtureGroups = useMemo(() => {
    const groups = new Map();
    displayedFixtures.forEach((match) => {
      const key = match.date || 'Date TBA';
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(match);
    });
    return [...groups.entries()];
  }, [displayedFixtures, lang]);

  const getShortTag = (match) => {
    if (match.id === 'm1') {
      return 'Opening Match';
    }
    if (match.stage?.includes('Final') && !match.stage?.includes('Semi') && !match.stage?.includes('Quarter')) {
      return 'Final';
    }
    if (match.stage?.includes('Semi')) {
      return 'Semi Final';
    }
    if (match.stage?.includes('Quarter')) {
      return 'Quarter Final';
    }
    return 'Round 1';
  };

  return (
    <section id="fixtures" className="py-8 px-3 sm:px-6 max-w-6xl mx-auto space-y-6">
      {/* Section Header with View Toggle & Single Venue Announcement */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 ${
        isDarkMode ? 'border-navy-700' : 'border-surface-border'
      }`}>
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-800 border border-navy-700 text-gold text-xs font-bold uppercase tracking-wider mb-2 shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-gold" />
            <span>{lang === 'ml' ? 'FIXTURES & SCHEDULE' : 'SCHEDULE & BRACKET'}</span>
          </div>

          <h2 className={`text-2xl sm:text-4xl font-black font-sports tracking-wide uppercase leading-[1.3] ${
            isDarkMode ? 'text-white' : 'text-navy-900'
          }`}>
            {lang === 'ml' ? 'Tournament Fixtures & Bracket' : 'OFFICIAL SFA FIXTURES & BRACKET'}
          </h2>

          {/* Venue shown once at the top of the page */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-royal dark:text-sky mt-1.5">
            <MapPin className="w-3.5 h-3.5 text-royal dark:text-sky shrink-0" />
            <span>
              {lang === 'ml' 
                ? 'പെരുവള്ളൂർ പഞ്ചായത്ത് സ്റ്റേഡിയം, പറമ്പിൽ പീടിക • രാത്രി 8:45 PM IST' 
                : 'Peruvallur Panjayath Stadium, Parambil Peedika • 8:45 PM IST Floodlit'}
            </span>
          </div>
        </div>

        {/* View Switcher: List View vs Knockout Bracket (Always Available) */}
        <div className={`flex items-center gap-1 p-1 rounded-2xl border self-start sm:self-auto shadow-xs ${
          isDarkMode ? 'bg-navy-900 border-navy-700' : 'bg-surface-light border-surface-border'
        }`}>
          <button
            onClick={() => setViewMode('list')}
            className={`min-h-touch px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 active:scale-95 ${
              viewMode === 'list'
                ? 'bg-royal text-white shadow-xs'
                : isDarkMode ? 'text-muted-on-navy hover:text-white' : 'text-navy-900 hover:text-royal'
            }`}
          >
            <ListFilter className="w-4 h-4" />
            <span>Match List</span>
          </button>
          <button
            onClick={() => setViewMode('bracket')}
            className={`min-h-touch px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 active:scale-95 ${
              viewMode === 'bracket'
                ? 'bg-royal text-white shadow-xs'
                : isDarkMode ? 'text-muted-on-navy hover:text-white' : 'text-navy-900 hover:text-royal'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Knockout Bracket</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: TOURNAMENT BRACKET */}
      {viewMode === 'bracket' && (
        <div className="animate-fadeIn">
          <TournamentBracket lang={lang} isDarkMode={isDarkMode} />
        </div>
      )}

      {/* VIEW 2: FIXTURES LIST GRID */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {/* Filter Bar: All Fixtures vs Confirmed Opening Match */}
          <div className={`sticky top-0 z-20 -mx-3 px-3 py-2 sm:static sm:mx-0 sm:px-0 sm:py-0 flex items-center gap-2 overflow-x-auto pb-1 backdrop-blur-md ${isDarkMode ? 'bg-navy-950/90' : 'bg-surface-light/95'}`}>
            <button
              onClick={() => setFilterMode('all')}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 active:scale-95 shrink-0 ${
                filterMode === 'all'
                  ? 'btn-royal text-white font-black shadow-xs'
                  : 'surface-card text-card-title border border-surface-border dark:border-navy-700'
              }`}
            >
              <span>{lang === 'ml' ? `All Matches (${fixtures.length})` : `All Fixtures (${fixtures.length})`}</span>
            </button>
            <button
              onClick={() => setFilterMode('confirmed')}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 active:scale-95 shrink-0 ${
                filterMode === 'confirmed'
                  ? 'btn-royal text-white font-black shadow-xs'
                  : 'surface-card text-card-title border border-surface-border dark:border-navy-700'
              }`}
            >
              <span>{lang === 'ml' ? `Confirmed Matches (${confirmedFixtures.length})` : `Confirmed Matches (${confirmedFixtures.length})`}</span>
            </button>
          </div>

          <div className="space-y-5 animate-fadeIn">
            {fixtureGroups.map(([date, matches]) => (
              <section key={date} aria-label={date}>
                <h3 className={`sticky top-[52px] z-10 mb-2 flex items-center gap-2 px-1 py-1 text-xs font-black uppercase tracking-wide backdrop-blur-md ${isDarkMode ? 'text-sky bg-navy-950/90' : 'text-royal bg-surface-light/95'}`}>
                  <Calendar className="w-3.5 h-3.5" />{date}
                </h3>
                <div className="space-y-2.5">
            {matches.map((match) => {
              const isConfirmed = Boolean(match.confirmed);
              const team1Name = isConfirmed ? match.team1 : 'TBD';
              const team2Name = isConfirmed ? match.team2 : 'TBD';

              const isUdayaMatch = isConfirmed && (match.team1?.toUpperCase().includes('UDAYA') || match.team2?.toUpperCase().includes('UDAYA'));
              const isNextMatch = match.status === 'Upcoming' && isConfirmed;
              const isMatchLive = match.status === 'LIVE';
              const isCompleted = match.status === 'Completed';

              const score1 = match.score1 !== null ? Number(match.score1) : null;
              const score2 = match.score2 !== null ? Number(match.score2) : null;
              const team1Won = isCompleted && score1 !== null && score2 !== null && score1 > score2;
              const team2Won = isCompleted && score1 !== null && score2 !== null && score2 > score1;

              return (
                <button
                  key={match.id}
                  type="button"
                  aria-expanded={expandedMatch === match.id}
                  onClick={() => setExpandedMatch(expandedMatch === match.id ? null : match.id)}
                  className={`w-full text-left rounded-2xl p-3.5 sm:p-4 transition-all duration-200 relative shadow-card ${
                    isUdayaMatch ? 'border-l-4 border-l-purple-600' : ''
                  } ${
                    isNextMatch
                      ? 'border-2 border-gold ring-1 ring-gold/40 bg-white dark:bg-navy-800'
                      : isDarkMode 
                        ? 'bg-navy-800 border border-navy-700 text-white hover:border-navy-600' 
                        : 'bg-white border border-surface-border text-navy-900 hover:border-navy-700/30'
                  }`}
                >
                  <div className={`flex items-center justify-between gap-2 text-xs pb-2.5 mb-2.5 border-b ${
                    isDarkMode ? 'border-navy-700 text-navy-muted' : 'border-surface-border text-card-muted'
                  }`}>
                    <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        isNextMatch
                          ? 'btn-gold'
                          : isConfirmed
                            ? 'bg-purple-700 text-white'
                            : isDarkMode
                              ? 'bg-navy-700 text-navy-muted'
                              : 'bg-surface-light text-navy-900 border border-surface-border'
                      }`}>
                        {isConfirmed ? getShortTag(match) : 'TBD'}
                      </span>
                      {isUdayaMatch && (
                        <span className="px-1.5 py-0.5 rounded-md bg-purple-700 text-white text-[10px] font-black uppercase tracking-wider">
                          UDAYA
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 font-bold">
                      {isMatchLive ? (
                        <span className="inline-flex items-center gap-1 bg-gold text-navy-900 px-2 py-0.5 rounded-full font-black text-xs uppercase animate-pulse shadow-xs">
                          <span className="w-2 h-2 rounded-full bg-navy-900 animate-ping"></span>
                          <span>LIVE</span>
                        </span>
                      ) : (
                        <div className="flex items-center gap-1 text-card-muted text-[11px] sm:text-xs whitespace-nowrap">
                          <Clock className="w-3.5 h-3.5 text-royal dark:text-sky" />
                          <span>{match.time}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={`grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-xl px-2 py-2.5 ${isDarkMode ? 'bg-navy-900/60' : 'bg-surface-light'}`}>
                    <div className="flex min-w-0 flex-col items-center gap-1 text-center">
                      <span className="w-10 h-10 rounded-full bg-white p-0.5 border border-surface-border dark:border-navy-700 flex items-center justify-center"><TeamLogo teamName={isConfirmed ? match.team1 : '?'} className="w-full h-full rounded-full object-contain" /></span>
                      <span className={`w-full line-clamp-2 text-[11px] sm:text-xs leading-tight font-sports ${team1Won ? 'font-black text-card-title' : isCompleted ? 'font-medium text-card-muted' : 'font-bold text-card-title'}`}>{team1Name}</span>
                    </div>
                    <div className="min-w-[62px] text-center">
                      {isCompleted || isMatchLive ? <span className={`text-xl font-black font-sports ${isMatchLive ? 'text-gold' : 'text-card-title'}`}>{score1 ?? 0} <span className="text-card-muted">–</span> {score2 ?? 0}</span> : <span className="text-[10px] font-black uppercase tracking-widest text-card-muted">VS</span>}
                    </div>
                    <div className="flex min-w-0 flex-col items-center gap-1 text-center">
                      <span className="w-10 h-10 rounded-full bg-white p-0.5 border border-surface-border dark:border-navy-700 flex items-center justify-center"><TeamLogo teamName={isConfirmed ? match.team2 : '?'} className="w-full h-full rounded-full object-contain" /></span>
                      <span className={`w-full line-clamp-2 text-[11px] sm:text-xs leading-tight font-sports ${team2Won ? 'font-black text-card-title' : isCompleted ? 'font-medium text-card-muted' : 'font-bold text-card-title'}`}>{team2Name}</span>
                    </div>
                  </div>
                  {expandedMatch === match.id && <div className="mt-2 flex flex-wrap items-center justify-between gap-1 text-[11px] text-card-muted"><span>{match.stage}</span><span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{match.stadium || 'Peruvallur Panjayath Stadium'}</span></div>}
                </button>
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
