import React from 'react';
import { Shield, ChevronRight } from 'lucide-react';
import { participatingTeams } from '../data/tournamentData';
import TeamLogo from './TeamLogo';

export const SHOW_SFA_CLAIMS = false;

const getShortClubName = (name) => {
  return name
    .replace(' MANNARKKAD', '')
    .replace(' MALAPPURAM', '')
    .replace(' CHERPULASSERI', '')
    .replace(' PARAMBIL PEEDIKA', '')
    .replace(' PALAKKAD', '')
    .replace(' THRISSUR', '')
    .replace(' NELLIKKUTH', '')
    .replace(' KUPPOOTH', '')
    .replace(' KOZHIKKODE', '')
    .replace(' SHORNUR', '')
    .replace(' THENNALA', '')
    .trim();
};

const getTownName = (cityString) => {
  if (!cityString) return '';
  return cityString.split(',')[0].trim();
};

export default function HomeClubsStrip({ lang, isDarkMode, onNavigateToTeams }) {
  return (
    <section id="home-clubs-strip" className="space-y-3">
      {/* Header with Title and "View all 24" Action Button (Rule 4: Neutral claims) */}
      <div className="flex items-center justify-between pb-1 border-b border-surface-border dark:border-navy-700 gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-navy-800 text-gold flex items-center justify-center font-bold shadow-xs shrink-0">
            <Shield className="w-4 h-4 text-gold" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black font-sports uppercase tracking-wider text-card-title leading-[1.3]">
              {SHOW_SFA_CLAIMS
                ? (lang === 'ml' ? '24 ഔദ്യോഗിക ക്ലബ്ബുകൾ' : 'SFA CLUBS & TEAMS')
                : (lang === 'ml' ? '24 ക്ലബ്ബുകൾ' : 'TOURNAMENT CLUBS (24)')}
            </h3>
            <p className="text-[11px] text-card-muted font-medium leading-[1.4]">
              {SHOW_SFA_CLAIMS
                ? (lang === 'ml' ? 'സീസൺ 7 ടൂർണ്ണമെന്റ് ക്ലബ്ബുകൾ' : '24 Confirmed SFA Tournament Clubs')
                : (lang === 'ml' ? 'സീസൺ 7 ടീമുകൾ' : 'Season 7 Clubs')}
            </p>
          </div>
        </div>

        {/* "View all 24" Button (Rule 1: Minimum 44x44px target) */}
        <button
          onClick={onNavigateToTeams}
          className="min-h-[44px] px-3 py-1.5 rounded-xl btn-royal text-white font-bold text-xs uppercase transition active:scale-95 flex items-center gap-1 shadow-xs shrink-0 whitespace-nowrap"
          aria-label="View all 24 clubs"
        >
          <span>{lang === 'ml' ? 'എല്ലാം (24)' : 'View all 24'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Horizontal Scrollable Row with Soft Fade on Right Edge (Rule 7) */}
      <div className="relative">
        <div className="flex items-start gap-3 overflow-x-auto snap-x snap-mandatory horizontal-scroll-container py-2 px-1 pr-8">
          {participatingTeams.map((team) => (
            <div
              key={team.id}
              onClick={onNavigateToTeams}
              className="w-[84px] sm:w-[92px] shrink-0 snap-start flex flex-col items-center text-center group cursor-pointer active:scale-95 transition-transform"
            >
              {/* 48px Circular Logo Container */}
              <div className="w-12 h-12 rounded-full bg-white p-1 border border-surface-border dark:border-navy-700 shadow-xs flex items-center justify-center group-hover:border-royal dark:group-hover:border-sky transition-colors shrink-0">
                <TeamLogo
                  teamName={team.name}
                  className="w-full h-full rounded-full object-contain"
                />
              </div>

              {/* Short Club Name (Max 2 lines, >=11px, 2-line wrap without ellipsis) */}
              <span className="mt-1.5 text-[11px] sm:text-xs font-sports font-bold line-clamp-2 leading-tight text-card-title group-hover:text-royal dark:group-hover:text-sky transition-colors break-words">
                {getShortClubName(team.name)}
              </span>

              {/* Town Underneath (Rule 2: Never truncated with ellipsis) */}
              <span className="text-[10px] text-card-muted font-medium mt-0.5 max-w-full leading-tight">
                {getTownName(team.city)}
              </span>
            </div>
          ))}
        </div>
        {/* Soft fade on right edge indicating scrollability */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-surface-light dark:from-navy-900 to-transparent" />
      </div>
    </section>
  );
}
