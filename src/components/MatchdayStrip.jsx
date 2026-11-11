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
              className={`shrink-0 scroll-snap-align-start flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition duration-200 active:scale-95 min-w-[100px] max-w-[116px] text-left backdrop-blur-md ${
                isLive
                  ? 'border-red-400/50 bg-red-500/15 shadow-md'
                  : isFeatured
                  ? 'border-frost/35 bg-gradient-to-b from-[#5A3B8C]/40 to-[#2A1E4D]/60 shadow-liquid-pill'
                  : isFT
                  ? 'border-frost/15 bg-gradient-to-b from-white/[0.06] to-white/[0.02]'
                  : 'border-frost/15 bg-gradient-to-b from-[#2A1E4D]/50 to-[#0E0B1D]/60'
              }`}
              role="listitem"
              aria-label={`${match.team1} vs ${match.team2}, ${status}`}
            >
              {/* Teams row */}
              <div className="flex items-center gap-1 w-full">
                <div className="w-6 h-6 rounded-full bg-white border border-frost/30 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                  <TeamLogo teamName={match.team1} className="w-full h-full object-contain" />
                </div>
                <span className="text-[10px] font-bold text-frost/90 truncate flex-1">
                  {match.team1.split(' ')[0]}
                </span>
              </div>

              {/* Score or time */}
              <div className="text-xs font-black font-mono text-white tracking-wide">
                {isFT
                  ? `${scoreHome} – ${scoreAway}`
                  : isLive
                  ? `${scoreHome} – ${scoreAway}`
                  : match.time?.replace(':00', '') || '8:45 PM'}
              </div>

              <div className="flex items-center gap-1 w-full">
                <div className="w-6 h-6 rounded-full bg-white border border-frost/30 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                  <TeamLogo teamName={match.team2} className="w-full h-full object-contain" />
                </div>
                <span className="text-[10px] font-bold text-frost/90 truncate flex-1">
                  {match.team2.split(' ')[0]}
                </span>
              </div>

              {/* Status chip */}
              <span
                className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full liquid-pill ${
                  isLive
                  ? 'bg-red-600 text-white'
                    : isFT
                    ? 'bg-white/10 text-frost/70 border-white/10'
                    : 'bg-[#5A3B8C]/40 text-frost border-frost/25'
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
          className="shrink-0 scroll-snap-align-start flex flex-col items-center justify-center gap-1 p-3 rounded-2xl border border-dashed border-frost/30 bg-[#5A3B8C]/15 backdrop-blur-md min-w-[76px] text-center active:scale-95 transition hover:bg-[#5A3B8C]/25"
          aria-label={lang === 'ml' ? 'എല്ലാ ഫിക്സ്ചറുകളും' : 'See all fixtures'}
        >
          <span className="text-frost font-black text-lg">→</span>
          <span className="text-[9px] font-bold text-frost uppercase leading-tight">
            {lang === 'ml' ? 'എല്ലാം' : 'All'}
          </span>
        </button>
      </div>
    </div>
  );
}
