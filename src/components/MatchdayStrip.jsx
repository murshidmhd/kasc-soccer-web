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
  const activeFixtureId = matchState.activeFixtureId || 'm1';
  const isLive = ['1ST_HALF', 'HALF_TIME', '2ND_HALF'].includes(matchState.status);
  if (match.id === activeFixtureId && isLive) return 'LIVE';
  if (match.id === activeFixtureId && ['FULL_TIME', 'COMPLETED'].includes(matchState.status)) return 'FT';
  return match.status === 'Completed' ? 'FT' : 'Upcoming';
}

export default function MatchdayStrip({ lang, isDarkMode, onNavigate }) {
  const scrollRef = useRef(null);
  const [matchState, setMatchState] = React.useState(getStoredMatchState);
  React.useEffect(() => {
    const sync = (event) => setMatchState(event.detail || getStoredMatchState());
    window.addEventListener('kasc_match_state_updated', sync);
    return () => window.removeEventListener('kasc_match_state_updated', sync);
  }, []);
  const confirmed = fixtures.filter((f) => f.confirmed).slice(0, MAX_CHIPS);
  const isAnyMatchLive = ['1ST_HALF', 'HALF_TIME', '2ND_HALF'].includes(matchState.status);
  const activeFixture = confirmed.find((match) => match.id === matchState.activeFixtureId);
  const featuredMatch = isAnyMatchLive
    ? activeFixture || confirmed[0]
    : confirmed.find((match) => match.status === 'Upcoming' || match.score1 == null) || activeFixture || confirmed[0];

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
          background: 'linear-gradient(to right, transparent, #1a1030)',
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
          const isFeatured = match.id === featuredMatch?.id;
          const isCurrentMatch = match.id === (matchState.activeFixtureId || 'm1');
          const scoreHome = isCurrentMatch ? (matchState.officialScoreHome ?? 0) : (match.score1 ?? 0);
          const scoreAway = isCurrentMatch ? (matchState.officialScoreAway ?? 0) : (match.score2 ?? 0);

          return (
            <button
              key={match.id}
              data-featured={isFeatured ? 'true' : undefined}
              onClick={() => onNavigate('live')}
              className={`shrink-0 scroll-snap-align-start flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition active:scale-95 min-w-[96px] max-w-[112px] text-left ${
                isLive
                  ? 'border-red-400/40 bg-red-500/10'
                  : isFeatured
                  ? 'border-purple-300/30 bg-purple-500/15 shadow-[0_8px_24px_rgba(112,43,224,0.15)]'
                  : isFT
                  ? 'border-white/[0.08] bg-white/[0.04]'
                  : 'border-white/[0.08] bg-white/[0.06]'
              }`}
              role="listitem"
              aria-label={`${match.team1} vs ${match.team2}, ${status}`}
            >
              {/* Teams row */}
              <div className="flex items-center gap-1 w-full">
                <div className="w-6 h-6 rounded-full bg-white border border-slate-200 dark:border-navy-700 flex items-center justify-center overflow-hidden shrink-0">
                  <TeamLogo teamName={match.team1} className="w-full h-full object-contain" />
                </div>
                <span className="text-[10px] font-bold text-white/85 truncate flex-1">
                  {match.team1.split(' ')[0]}
                </span>
              </div>

              {/* Score or time */}
              <div className="text-xs font-black font-mono text-white">
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
                <span className="text-[10px] font-bold text-white/85 truncate flex-1">
                  {match.team2.split(' ')[0]}
                </span>
              </div>

              {/* Status chip */}
              <span
                className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                  isLive
                  ? 'bg-red-600 text-white'
                    : isFT
                    ? 'bg-white/10 text-white/60'
                    : 'bg-purple-500/20 text-purple-200'
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
          className="shrink-0 scroll-snap-align-start flex flex-col items-center justify-center gap-1 p-2.5 rounded-xl border border-dashed border-purple-300/30 bg-purple-500/10 min-w-[72px] text-center active:scale-95 transition"
          aria-label={lang === 'ml' ? 'എല്ലാ ഫിക്സ്ചറുകളും' : 'See all fixtures'}
        >
          <span className="text-purple-200 font-black text-lg">→</span>
          <span className="text-[9px] font-bold text-purple-200 uppercase leading-tight">
            {lang === 'ml' ? 'എല്ലാം' : 'All'}
          </span>
        </button>
      </div>
    </div>
  );
}
