/**
 * MatchdayStrip — Horizontally scrollable row of match chips.
 * One chip per confirmed fixture. Scroll-snap. Fades on right edge.
 * Max 14 chips + "See all" chip. Opens fixture tab on tap.
 * Reads time exclusively from fixtures data.
 */

import React, { useRef, useEffect } from 'react';
import TeamLogo from './TeamLogo';
import { fixtures } from '../data/tournamentData';
import { getStoredMatchState } from '../utils/matchStateManager';

const MAX_CHIPS = 14;

function statusChip(match, matchState) {
  const isLive =
    matchState.status !== 'UPCOMING' &&
    matchState.status !== 'FULL_TIME' &&
    matchState.status !== null;
  if (isLive && match.id === 'm1') return 'LIVE';
  if (matchState.status === 'FULL_TIME' && match.id === 'm1') return 'FT';
  return 'Upcoming';
}

export default function MatchdayStrip({ lang, isDarkMode, onNavigate }) {
  const scrollRef = useRef(null);
  const matchState = React.useMemo(() => getStoredMatchState(), []);
  const confirmed = fixtures.filter((f) => f.confirmed).slice(0, MAX_CHIPS);
  const scoreHome = matchState.officialScoreHome ?? 0;
  const scoreAway = matchState.officialScoreAway ?? 0;

  // Scroll to featured match chip on mount
  useEffect(() => {
    if (!scrollRef.current) return;
    const featured = scrollRef.current.querySelector('[data-featured="true"]');
    if (featured) {
      featured.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, []);

  if (!confirmed.length) return null;

  return (
    <div className="relative">
      {/* Fade-out on right edge */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-full w-10 z-10"
        style={{
          background: isDarkMode
            ? 'linear-gradient(to right, transparent, #0f1729)'
            : 'linear-gradient(to right, transparent, #f8f9ff)',
        }}
        aria-hidden="true"
      />

      <div
        ref={scrollRef}
        className="flex gap-2.5 overflow-x-auto pb-1 scroll-snap-x mandatory"
        style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
        role="list"
        aria-label={lang === 'ml' ? 'മത്സര ചിപ്പുകൾ' : 'Match chips'}
      >
        {confirmed.map((match) => {
          const status = statusChip(match, matchState);
          const isLive = status === 'LIVE';
          const isFT = status === 'FT';
          const isFeatured = match.id === 'm1'; // first confirmed

          return (
            <button
              key={match.id}
              data-featured={isFeatured ? 'true' : undefined}
              onClick={() => onNavigate('live')}
              className={`shrink-0 scroll-snap-align-start flex flex-col items-center gap-1 p-2.5 rounded-xl border transition active:scale-95 min-w-[88px] max-w-[104px] text-left ${
                isLive
                  ? 'border-red-500/60 bg-red-500/10 dark:bg-red-900/20'
                  : isFT
                  ? 'border-surface-border dark:border-navy-700 bg-surface-light dark:bg-navy-800/60'
                  : 'border-surface-border dark:border-navy-700 bg-white dark:bg-navy-800'
              }`}
              role="listitem"
              aria-label={`${match.team1} vs ${match.team2}, ${status}`}
            >
              {/* Teams row */}
              <div className="flex items-center gap-1 w-full">
                <div className="w-6 h-6 rounded-full bg-white border border-slate-200 dark:border-navy-700 flex items-center justify-center overflow-hidden shrink-0">
                  <TeamLogo teamName={match.team1} className="w-full h-full object-contain" />
                </div>
                <span className="text-[9px] font-bold text-card-title truncate flex-1">
                  {match.team1.split(' ')[0]}
                </span>
              </div>

              {/* Score or time */}
              <div className="text-[11px] font-black font-mono text-card-title">
                {isFT
                  ? `${scoreHome} – ${scoreAway}`
                  : isLive
                  ? `${scoreHome} – ${scoreAway}`
                  : match.time?.replace(':00', '') || '8:45 PM'}
              </div>

              <div className="flex items-center gap-1 w-full">
                <div className="w-6 h-6 rounded-full bg-white border border-slate-200 dark:border-navy-700 flex items-center justify-center overflow-hidden shrink-0">
                  <TeamLogo teamName={match.team2} className="w-full h-full object-contain" />
                </div>
                <span className="text-[9px] font-bold text-card-title truncate flex-1">
                  {match.team2.split(' ')[0]}
                </span>
              </div>

              {/* Status chip */}
              <span
                className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                  isLive
                    ? 'bg-red-600 text-white'
                    : isFT
                    ? 'bg-slate-200 dark:bg-navy-700 text-card-muted'
                    : 'bg-blue-100 dark:bg-navy-700 text-blue-700 dark:text-sky-400'
                }`}
              >
                {isLive ? '● LIVE' : isFT ? 'FT' : lang === 'ml' ? 'വരുന്നു' : 'Soon'}
              </span>
            </button>
          );
        })}

        {/* See all chip */}
        <button
          onClick={() => onNavigate('fixtures')}
          className="shrink-0 scroll-snap-align-start flex flex-col items-center justify-center gap-1 p-2.5 rounded-xl border border-dashed border-gold/50 bg-gold/5 min-w-[72px] text-center active:scale-95 transition"
          aria-label={lang === 'ml' ? 'എല്ലാ ഫിക്സ്ചറുകളും' : 'See all fixtures'}
        >
          <span className="text-gold font-black text-lg">→</span>
          <span className="text-[9px] font-bold text-gold uppercase leading-tight">
            {lang === 'ml' ? 'എല്ലാം' : 'All'}
          </span>
        </button>
      </div>
    </div>
  );
}
