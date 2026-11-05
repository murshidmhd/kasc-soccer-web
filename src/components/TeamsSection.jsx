import React, { useState } from 'react';
import { Search, Eye, X } from 'lucide-react';
import { participatingTeams } from '../data/tournamentData';
import TeamLogo from './TeamLogo';
import { EmptyState } from './SkeletonLoader';
import ClubBottomSheet from './ClubBottomSheet';
import teamsOfficialPoster from '../assets/teams_official_poster.jpg';

export const SHOW_SFA_CLAIMS = false;

const getTownName = (cityString) => {
  if (!cityString) return '';
  return cityString.split(',')[0].trim();
};

export default function TeamsSection({ lang, isDarkMode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all' | 'malappuram' | 'other'
  const [isPosterModalOpen, setIsPosterModalOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);

  const filteredTeams = participatingTeams.filter((team) => {
    const matchesSearch =
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.nameMl.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.manager.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (team.asstManager && team.asstManager.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedFilter === 'malappuram') {
      return team.city.toLowerCase().includes('malappuram') || team.name.toLowerCase().includes('malappuram');
    }
    if (selectedFilter === 'other') {
      return !team.city.toLowerCase().includes('malappuram') && !team.name.toLowerCase().includes('malappuram');
    }
    return true;
  });

  return (
    <section id="teams" className="py-2 px-3 sm:px-6 max-w-6xl mx-auto space-y-3 sm:space-y-4">
      {/* 1. Slim Header: Title and One Line of Text (Rule 4: Neutral claims) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-surface-border dark:border-navy-700 pb-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black font-sports tracking-wide uppercase leading-[1.3] text-card-title">
            {SHOW_SFA_CLAIMS
              ? (lang === 'ml' ? '24 ഔദ്യോഗിക ക്ലബ്ബുകൾ' : 'SFA REGISTERED CLUBS (24)')
              : (lang === 'ml' ? '24 ക്ലബ്ബുകൾ' : 'TOURNAMENT CLUBS (24)')}
          </h2>
          <p className="text-xs text-card-muted leading-[1.5] mt-0.5">
            {SHOW_SFA_CLAIMS
              ? (lang === 'ml' ? 'സെവൻസ് ഫുട്ബോൾ അസോസിയേഷൻ അംഗീകൃത 24 ടീമുകൾ' : 'Official confirmed tournament squads')
              : (lang === 'ml' ? 'സീസൺ 7 ൽ പങ്കെടുക്കുന്ന 24 ടീമുകൾ' : '24 participating clubs • Season 7')}
          </p>
        </div>

        {/* 2. Slim Poster Row: Thumbnail + Short Label + View Poster Button */}
        <div className="flex items-center justify-between sm:justify-end gap-3 p-2 rounded-xl bg-surface-light dark:bg-navy-800 border border-surface-border dark:border-navy-700">
          <div className="flex items-center gap-2 min-w-0">
            <div 
              onClick={() => setIsPosterModalOpen(true)}
              className="w-9 h-9 rounded-lg overflow-hidden border border-gold shrink-0 cursor-pointer shadow-xs"
            >
              <img 
                src={teamsOfficialPoster} 
                alt="Poster Thumbnail" 
                width="36"
                height="36"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-[11px] font-bold text-card-title truncate">
              {lang === 'ml' ? 'ടൂർണ്ണമെന്റ് പോസ്റ്റർ' : 'Tournament Poster'}
            </span>
          </div>

          <button
            onClick={() => setIsPosterModalOpen(true)}
            className="min-h-[44px] px-3 py-1.5 rounded-lg btn-royal text-white font-bold text-[11px] uppercase tracking-wider shadow-xs flex items-center gap-1.5 transition active:scale-95 shrink-0"
            aria-label="View tournament poster"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{lang === 'ml' ? 'പോസ്റ്റർ കാണുക' : 'View Poster'}</span>
          </button>
        </div>
      </div>

      {/* 3. Sticky Search Box and Filter Chips Bar with Soft Fade on Right Edge (Rule 7) */}
      <div className="sticky top-14 sm:top-16 z-20 py-2 space-y-2 bg-surface-light dark:bg-navy-900 border-b border-surface-border dark:border-navy-800 -mx-3 px-3 sm:mx-0 sm:px-0">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-card-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'ml' ? 'ക്ലബ്ബ് അല്ലെങ്കിൽ സ്ഥലം തിരയുക...' : 'Search club, city or district...'}
            className="w-full pl-10 pr-4 min-h-[44px] py-2 rounded-xl border text-xs sm:text-sm surface-card border-surface-border dark:border-navy-700 text-card-title placeholder-card-muted transition focus:outline-hidden focus:ring-2 focus:ring-royal"
          />
        </div>

        {/* Filter chip container with soft edge fade */}
        <div className="relative">
          <div className="flex items-center gap-1.5 overflow-x-auto horizontal-scroll-container py-0.5 pr-8">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 whitespace-nowrap shrink-0 ${
                selectedFilter === 'all'
                  ? 'btn-royal text-white font-black shadow-xs'
                  : 'surface-card text-card-title border border-surface-border dark:border-navy-700'
              }`}
            >
              {lang === 'ml' ? 'എല്ലാം (24)' : 'All 24'}
            </button>
            <button
              onClick={() => setSelectedFilter('malappuram')}
              className={`min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 whitespace-nowrap shrink-0 ${
                selectedFilter === 'malappuram'
                  ? 'btn-royal text-white font-black shadow-xs'
                  : 'surface-card text-card-title border border-surface-border dark:border-navy-700'
              }`}
            >
              {lang === 'ml' ? 'മലപ്പുറം ബെൽറ്റ്' : 'Malappuram Belt'}
            </button>
            <button
              onClick={() => setSelectedFilter('other')}
              className={`min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 whitespace-nowrap shrink-0 ${
                selectedFilter === 'other'
                  ? 'btn-royal text-white font-black shadow-xs'
                  : 'surface-card text-card-title border border-surface-border dark:border-navy-700'
              }`}
            >
              {lang === 'ml' ? 'മറ്റു ജില്ലകൾ' : 'Other Districts'}
            </button>
          </div>
          {/* Soft fade on right edge indicating scrollability */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-surface-light dark:from-navy-900 to-transparent" />
        </div>
      </div>

      {/* 4. Compact 2-Column Grid (Rule 5: ~130px tall, logo 44px, name max 2 lines, town only, no gold stars per Rule 3) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {filteredTeams.map((team) => {
          const town = getTownName(team.city);
          return (
            <div
              key={team.id}
              onClick={() => setSelectedClub(team)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedClub(team);
                }
              }}
              className="h-[128px] p-2.5 sm:p-3 rounded-2xl border border-surface-border dark:border-navy-700 surface-card shadow-card hover:border-royal dark:hover:border-sky transition duration-150 flex flex-col justify-between cursor-pointer active:scale-95 group text-left relative focus:outline-hidden focus:ring-2 focus:ring-royal"
            >
              {/* Top row: 44px Logo in clean circle */}
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-full bg-white p-1 border border-surface-border dark:border-navy-700 shadow-xs flex items-center justify-center shrink-0">
                  <TeamLogo teamName={team.name} className="w-full h-full rounded-full object-contain" />
                </div>
              </div>

              {/* Club name (max 2 lines, no ellipsis) & Town (Rule 2: town only, never truncated) */}
              <div className="min-w-0 mt-1">
                <h3 className="text-xs sm:text-sm font-bold font-sports line-clamp-2 leading-tight text-card-title group-hover:text-royal dark:group-hover:text-sky transition-colors">
                  {team.name}
                </h3>
                <p className="text-[11px] text-card-muted font-medium mt-0.5 leading-none">
                  📍 {town}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTeams.length === 0 && (
        <EmptyState
          title={lang === 'ml' ? 'ടീമുകൾ ഒന്നും കണ്ടെത്തിയില്ല' : 'No clubs found'}
          subtitle={lang === 'ml' ? 'നിങ്ങൾ തിരഞ്ഞ പേരിൽ ക്ലബ്ബുകൾ ലഭ്യമല്ല.' : 'No teams match your search or filter.'}
          actionLabel={lang === 'ml' ? 'ഫിൽട്ടർ മാറ്റുക' : 'Clear search'}
          onAction={() => { setSearchQuery(''); setSelectedFilter('all'); }}
        />
      )}

      {/* 5. Club Bottom Sheet Details Viewer */}
      <ClubBottomSheet
        isOpen={!!selectedClub}
        club={selectedClub}
        onClose={() => setSelectedClub(null)}
        lang={lang}
        isDarkMode={isDarkMode}
      />

      {/* 6. Tournament Poster Lightbox Modal (No backdrop-filter/blur) */}
      {isPosterModalOpen && (
        <div 
          onClick={() => setIsPosterModalOpen(false)}
          className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6 bg-navy-900/95 animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-navy-900 border border-navy-700 shadow-2xl overflow-hidden"
          >
            <div className="p-3.5 bg-navy-800 border-b border-navy-700 flex items-center justify-between text-white">
              <h4 className="font-sports font-black text-xs sm:text-sm uppercase tracking-wider text-white">
                {lang === 'ml' ? '24 ടീമുകൾ • ഉദയ & കാസ്ക് ഫുട്ബോൾ സീസൺ 7' : '24 Teams • UDAYA & KASC Football Season 7'}
              </h4>
              <button
                onClick={() => setIsPosterModalOpen(false)}
                className="w-11 h-11 rounded-xl bg-navy-700 hover:bg-navy-600 text-white flex items-center justify-center transition active:scale-95"
                aria-label="Close poster view"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-auto p-2 sm:p-4 flex items-center justify-center bg-navy-950">
              <img 
                src={teamsOfficialPoster} 
                alt="24 Teams Poster" 
                className="max-h-[78vh] w-auto rounded-xl object-contain shadow-2xl border border-navy-800"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
