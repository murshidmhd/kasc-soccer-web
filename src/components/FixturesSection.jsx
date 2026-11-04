import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Trophy, ListFilter } from 'lucide-react';
import { fixtures } from '../data/tournamentData';
import TeamLogo from './TeamLogo';
import TournamentBracket from './TournamentBracket';

export default function FixturesSection({ lang, isDarkMode }) {
  // In-memory toggle between list and tree view (no localStorage per rules)
  const [viewMode, setViewMode] = useState('list');

  const getShortTag = (match) => {
    if (match.id === 'm1') {
      return lang === 'ml' ? 'ഉദ്ഘാടന മത്സരം' : 'Opening match';
    }
    if (match.stage?.includes('Final') && !match.stage?.includes('Semi') && !match.stage?.includes('Quarter')) {
      return lang === 'ml' ? 'ഫൈനൽ' : 'Final';
    }
    if (match.stage?.includes('Semi')) {
      return lang === 'ml' ? 'സെമി ഫൈനൽ' : 'Semi Final';
    }
    if (match.stage?.includes('Quarter')) {
      return lang === 'ml' ? 'ക്വാർട്ടർ' : 'Quarter Final';
    }
    return lang === 'ml' ? 'റൗണ്ട് 1' : 'Round 1';
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
            <span>{lang === 'ml' ? 'മത്സരക്രമം & ബ്രാക്കറ്റ്' : 'SCHEDULE & BRACKET'}</span>
          </div>

          <h2 className={`text-2xl sm:text-4xl font-black font-sports tracking-wide uppercase leading-[1.3] ${
            isDarkMode ? 'text-white' : 'text-navy-900'
          }`}>
            {lang === 'ml' ? 'ഫിക്സ്ചറുകളും ടൂർണ്ണമെന്റ് ട്രീയും' : 'OFFICIAL SFA FIXTURES & BRACKET'}
          </h2>

          {/* Change 2, Rule 2: Venue shown once at the top of the page, not on every card */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-royal dark:text-sky mt-1.5">
            <MapPin className="w-3.5 h-3.5 text-royal dark:text-sky shrink-0" />
            <span>
              {lang === 'ml' 
                ? 'പെരുവള്ളൂർ പഞ്ചായത്ത് സ്റ്റേഡിയം, പറമ്പിൽ പീടിക • രാത്രി 8:00 PM IST' 
                : 'Peruvallur Panjayath Stadium, Parambil Peedika • 8:00 PM IST Floodlit'}
            </span>
          </div>
        </div>

        {/* View Switcher: List View vs Knockout Bracket (Rule 6: in-memory state only) */}
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
            <span>{lang === 'ml' ? 'ലിസ്റ്റ് വ്യൂ' : 'Match List'}</span>
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
            <span>{lang === 'ml' ? 'ടൂർണ്ണമെന്റ് ട്രീ' : 'Knockout Tree'}</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: TOURNAMENT BRACKET */}
      {viewMode === 'bracket' && (
        <div className="animate-fadeIn">
          <TournamentBracket lang={lang} isDarkMode={isDarkMode} />
        </div>
      )}

      {/* VIEW 2: FIXTURES LIST GRID (FotMob style) */}
      {viewMode === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 animate-fadeIn">
          {fixtures.map((match) => {
            const isNextMatch = match.id === 'm1' && match.status === 'Upcoming';
            const isMatchLive = match.status === 'LIVE';
            const isCompleted = match.status === 'Completed';

            const score1 = match.score1 !== null ? Number(match.score1) : null;
            const score2 = match.score2 !== null ? Number(match.score2) : null;
            const team1Won = isCompleted && score1 !== null && score2 !== null && score1 > score2;
            const team2Won = isCompleted && score1 !== null && score2 !== null && score2 > score1;

            return (
              <div
                key={match.id}
                className={`rounded-2xl p-4 sm:p-5 transition-all duration-200 relative shadow-card ${
                  isNextMatch
                    ? 'border-2 border-gold ring-1 ring-gold/40 bg-white dark:bg-navy-800'
                    : isDarkMode 
                      ? 'bg-navy-800 border border-navy-700 text-white hover:border-navy-600' 
                      : 'bg-white border border-surface-border text-navy-900 hover:border-navy-700/30'
                }`}
              >
                {/* Top Match Info: Shortened tag & kickoff/date */}
                <div className={`flex items-center justify-between text-xs pb-3 mb-3 border-b ${
                  isDarkMode ? 'border-navy-700 text-navy-muted' : 'border-surface-border text-card-muted'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      isNextMatch
                        ? 'btn-gold'
                        : isDarkMode
                          ? 'bg-navy-700 text-navy-muted'
                          : 'bg-surface-light text-navy-900 border border-surface-border'
                    }`}>
                      {getShortTag(match)}
                    </span>
                    <span className="text-card-muted font-mono text-[11px]">{match.day}</span>
                  </div>

                  <div className="flex items-center gap-1.5 font-bold">
                    {isMatchLive ? (
                      <span className="inline-flex items-center gap-1 bg-gold text-navy-900 px-2 py-0.5 rounded-full font-black text-xs uppercase animate-pulse shadow-xs">
                        <span className="w-2 h-2 rounded-full bg-navy-900 animate-ping"></span>
                        <span>LIVE</span>
                      </span>
                    ) : (
                      <div className="flex items-center gap-1 text-card-muted text-xs">
                        <Clock className="w-3.5 h-3.5 text-royal dark:text-sky" />
                        <span>{match.date} • {match.time}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Team Rows: 40px circular logos, 2-line wrapped names, clean scores/time */}
                <div className="space-y-2">
                  {/* Team 1 */}
                  <div className={`flex items-center justify-between p-2.5 rounded-xl border transition ${
                    isDarkMode ? 'bg-navy-900/60 border-navy-700' : 'bg-surface-light border-surface-border'
                  }`}>
                    <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                      <div className="w-10 h-10 rounded-full bg-white p-0.5 border border-surface-border dark:border-navy-700 shrink-0 flex items-center justify-center">
                        <TeamLogo 
                          teamName={match.team1} 
                          className="w-full h-full rounded-full object-contain" 
                        />
                      </div>
                      <span className={`text-xs sm:text-sm line-clamp-2 leading-snug font-sports ${
                        team1Won 
                          ? 'font-black text-card-title' 
                          : isCompleted 
                            ? 'font-medium text-card-muted' 
                            : 'font-bold text-card-title'
                      }`}>
                        {match.team1}
                      </span>
                    </div>

                    <div className="shrink-0 text-right pl-2">
                      {isCompleted ? (
                        <span className={`text-base sm:text-lg font-sports ${
                          team1Won 
                            ? 'font-black text-card-title' 
                            : 'font-medium text-card-muted'
                        }`}>
                          {score1}
                        </span>
                      ) : isMatchLive ? (
                        <span className="text-base sm:text-lg font-black font-sports text-gold">
                          {score1 ?? 0}
                        </span>
                      ) : (
                        <span className="text-xs font-mono font-bold text-royal dark:text-sky">
                          {match.time}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Team 2 */}
                  <div className={`flex items-center justify-between p-2.5 rounded-xl border transition ${
                    isDarkMode ? 'bg-navy-900/60 border-navy-700' : 'bg-surface-light border-surface-border'
                  }`}>
                    <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                      <div className="w-10 h-10 rounded-full bg-white p-0.5 border border-surface-border dark:border-navy-700 shrink-0 flex items-center justify-center">
                        <TeamLogo 
                          teamName={match.team2} 
                          className="w-full h-full rounded-full object-contain" 
                        />
                      </div>
                      <span className={`text-xs sm:text-sm line-clamp-2 leading-snug font-sports ${
                        team2Won 
                          ? 'font-black text-card-title' 
                          : isCompleted 
                            ? 'font-medium text-card-muted' 
                            : 'font-bold text-card-title'
                      }`}>
                        {match.team2}
                      </span>
                    </div>

                    <div className="shrink-0 text-right pl-2">
                      {isCompleted ? (
                        <span className={`text-base sm:text-lg font-sports ${
                          team2Won 
                            ? 'font-black text-card-title' 
                            : 'font-medium text-card-muted'
                        }`}>
                          {score2}
                        </span>
                      ) : isMatchLive ? (
                        <span className="text-base sm:text-lg font-black font-sports text-gold">
                          {score2 ?? 0}
                        </span>
                      ) : (
                        <span className="text-xs font-mono font-bold text-royal dark:text-sky">
                          {match.time}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
