import React, { useState, useEffect, useMemo } from 'react';
import { 
  Trophy, 
  Award, 
  Sparkles, 
  ShieldCheck, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Flame, 
  Goal, 
  ShieldAlert, 
  Info,
  Calendar,
  Medal,
  Users,
  Radio,
  TrendingUp,
  X
} from 'lucide-react';
import TeamLogo from './TeamLogo';
import { fixtures, tournamentInfo, participatingTeams } from '../data/tournamentData';
import { squadPlayers, squadClubs, clubSquadStatus, squadClubLabelsMl } from '../data/squad';
import { getStoredMatchState } from '../utils/matchStateManager';
import { calculateTournamentStats } from '../utils/statsCalculator';
import { getPlayerDisciplinaryStatus } from '../utils/disciplinaryManager';
import { 
  SHOW_NATIONALITY, 
  AWARDS_NOTE 
} from '../config/siteConfig';

export default function TopScorers({ lang, isDarkMode }) {
  const [matchState, setMatchState] = useState(getStoredMatchState);
  const [activeStatsTab, setActiveStatsTab] = useState('players'); // 'players' | 'leaders'
  const [showTopTen, setShowTopTen] = useState(false);
  const [playerSearchQuery, setPlayerSearchQuery] = useState('');
  const [selectedClubFilter, setSelectedClubFilter] = useState('All');
  const [selectedCardPlayer, setSelectedCardPlayer] = useState(null);

  // Sync matchState when referee desk updates goals or events
  useEffect(() => {
    const handleUpdate = (e) => {
      setMatchState(e.detail || getStoredMatchState());
    };
    window.addEventListener('kasc_match_state_updated', handleUpdate);
    return () => window.removeEventListener('kasc_match_state_updated', handleUpdate);
  }, []);

  // Compute all tournament stats once and memoize (Confirmed matches only)
  const stats = useMemo(() => {
    return calculateTournamentStats([], fixtures.filter((m) => m.confirmed), matchState);
  }, [matchState]);

  // Check if a final match is finished to display the tournament champion
  const finalMatch = useMemo(() => {
    return stats.finishedMatches?.find((m) => {
      const stage = (m.stage || '').toLowerCase();
      return stage.includes('final') && !stage.includes('quarter') && !stage.includes('semi');
    });
  }, [stats.finishedMatches]);

  const championTeam = useMemo(() => {
    if (!finalMatch || typeof finalMatch.score1 !== 'number' || typeof finalMatch.score2 !== 'number') {
      return null;
    }
    return finalMatch.score1 > finalMatch.score2 ? finalMatch.team1 : finalMatch.team2;
  }, [finalMatch]);

  // Filtered confirmed squad players for "All Players" section
  const isClubConfirmed = selectedClubFilter === 'All' || clubSquadStatus[selectedClubFilter] === 'confirmed';

  const visiblePlayers = useMemo(() => {
    if (!isClubConfirmed) return [];

    return squadPlayers.filter((p) => {
      const isConfirmedClub = clubSquadStatus[p.club] === 'confirmed';
      if (!isConfirmedClub) return false;

      const matchesClub = selectedClubFilter === 'All' || p.club === selectedClubFilter;
      if (!matchesClub) return false;

      if (!playerSearchQuery.trim()) return true;

      const query = playerSearchQuery.toLowerCase().trim();
      const nameEn = (p.name || '').toLowerCase();
      const nameMl = (p.nameMl || '').toLowerCase();
      const num = String(p.number || '');
      const club = (p.club || '').toLowerCase();

      return nameEn.includes(query) || nameMl.includes(query) || num.includes(query) || club.includes(query);
    });
  }, [selectedClubFilter, isClubConfirmed, playerSearchQuery]);

  const topScorerLeader = stats.rankedScorers[0] || null;
  const subsequentScorers = showTopTen ? stats.rankedScorers.slice(1, 10) : stats.rankedScorers.slice(1, 5);

  const hasLiveMatchesPlayed = stats.matchesCount > 0 || stats.totalGoals > 0;

  return (
    <div className="space-y-5 pb-28 max-w-5xl mx-auto select-none">
      {/* 1. Modern Sports Hero Header (Clean, Premium, No Bulky Trophy Image) */}
      <section className="rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-navy-900 via-navy-950 to-purple-950 text-white border border-navy-700 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold text-[11px] font-black uppercase tracking-wider shadow-xs">
              <Trophy className="w-3.5 h-3.5 text-gold" />
              <span>{tournamentInfo.season || 'SEASON 7'} • SFA AFFILIATED</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-sports uppercase tracking-wide text-white leading-tight">
              {lang === 'ml' ? 'ടൂർണ്ണമെന്റ് സ്ഥിതിവിവരക്കണക്കുകൾ' : 'OFFICIAL TOURNAMENT STATS'}
            </h2>
            <p className="text-xs text-navy-muted max-w-lg leading-relaxed">
              {lang === 'ml'
                ? 'പെരുവള്ളൂർ പഞ്ചായത്ത് സ്റ്റേഡിയം • 24 പ്രമുഖ ക്ലബ്ബുകളുടെ ഔദ്യോഗിക ടൂർണ്ണമെന്റ് റെക്കോർഡുകൾ'
                : 'Peruvallur Panchayath Stadium • Live referee scorecard records for 24 elite Sevens clubs.'}
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-navy-800/80 border border-navy-700 self-start sm:self-center">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold text-slate-200">
              {lang === 'ml' ? 'ഉദ്ഘാടനം: നവംബർ 06, രാത്രി 8:45 PM' : 'Kickoff: Nov 06, 8:45 PM'}
            </span>
          </div>
        </div>

        {/* 4-Tile Live Number Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          {/* Matches */}
          <div className="p-3 rounded-2xl bg-navy-800/60 border border-navy-700/80 text-center space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-navy-muted block">
              {lang === 'ml' ? 'മത്സരങ്ങൾ' : 'Matches'}
            </span>
            <span className="text-2xl font-black font-sports text-white">
              {stats.matchesCount}
            </span>
          </div>

          {/* Goals */}
          <div className="p-3 rounded-2xl bg-navy-800/60 border border-navy-700/80 text-center space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-navy-muted block">
              {lang === 'ml' ? 'ഗോളുകൾ' : 'Goals'}
            </span>
            <span className="text-2xl font-black font-sports text-gold">
              {stats.totalGoals}
            </span>
          </div>

          {/* Avg Goals */}
          <div className="p-3 rounded-2xl bg-navy-800/60 border border-navy-700/80 text-center space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-navy-muted block">
              {lang === 'ml' ? 'ശരാശരി' : 'Avg / Match'}
            </span>
            <span className="text-2xl font-black font-sports text-sky">
              {stats.avgGoals}
            </span>
          </div>

          {/* Clean Sheets */}
          <div className="p-3 rounded-2xl bg-navy-800/60 border border-navy-700/80 text-center space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-navy-muted block">
              {lang === 'ml' ? 'ക്ലീൻ ഷീറ്റ്' : 'Clean Sheets'}
            </span>
            <span className="text-2xl font-black font-sports text-emerald-400">
              {stats.totalCleanSheets}
            </span>
          </div>
        </div>
      </section>

      {/* 2. Sleek Section Controller: Tab Navigation between Players Directory & Leaderboards */}
      <div className="p-1.5 rounded-2xl bg-surface-light dark:bg-navy-900 border border-surface-border dark:border-navy-700 grid grid-cols-2 gap-1.5">
        <button
          onClick={() => setActiveStatsTab('players')}
          className={`min-h-[46px] px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 active:scale-95 ${
            activeStatsTab === 'players'
              ? 'btn-royal text-white font-black shadow-md'
              : 'text-card-muted hover:text-card-title'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{lang === 'ml' ? 'കളിക്കാരുടെ പട്ടിക' : 'All Players Directory'}</span>
        </button>

        <button
          onClick={() => setActiveStatsTab('leaders')}
          className={`min-h-[46px] px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 active:scale-95 ${
            activeStatsTab === 'leaders'
              ? 'btn-royal text-white font-black shadow-md'
              : 'text-card-muted hover:text-card-title'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>{lang === 'ml' ? 'ലീഡർബോർഡുകൾ & അവാർഡുകൾ' : 'Leaderboards & Awards'}</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* VIEW A: ALL PLAYERS DIRECTORY (Default, Highly Requested & Active) */}
      {/* ============================================================== */}
      {activeStatsTab === 'players' && (
        <section className="rounded-3xl p-4 sm:p-6 border border-surface-border dark:border-navy-700 surface-card shadow-card space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border dark:border-navy-700 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl btn-royal text-white shadow-xs">
                <Users className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-black font-sports uppercase tracking-wider text-card-title">
                  {lang === 'ml' ? 'കളിക്കാരുടെ പട്ടിക' : 'ALL PLAYERS DIRECTORY'}
                </h3>
                <p className="text-[11px] text-card-muted font-bold">
                  {lang === 'ml' ? 'സ്ഥിരീകരിച്ച സ്ക്വാഡുകളിലെ താരങ്ങൾ' : 'Names, numbers, positions and disciplinary records'}
                </p>
              </div>
            </div>

            <span className="text-xs font-mono font-bold text-card-muted self-start sm:self-center">
              {visiblePlayers.length} {lang === 'ml' ? 'താരങ്ങൾ' : 'Players'}
            </span>
          </div>

          {/* Club Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto horizontal-scroll-container py-1">
            {squadClubs.map((club) => {
              const isSelected = selectedClubFilter === club;
              return (
                <button
                  key={club}
                  onClick={() => setSelectedClubFilter(club)}
                  className={`min-h-[40px] px-3 py-1 rounded-xl text-xs font-bold shrink-0 transition active:scale-95 flex items-center gap-1.5 ${
                    isSelected
                      ? 'btn-royal text-white font-black shadow-xs'
                      : 'surface-light text-card-title border border-surface-border dark:border-navy-700'
                  }`}
                >
                  <span>{club === 'All' ? (lang === 'ml' ? 'എല്ലാ ക്ലബ്ബുകളും' : 'All Clubs') : (lang === 'ml' ? (squadClubLabelsMl[club] || club) : club)}</span>
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-card-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={playerSearchQuery}
              onChange={(e) => setPlayerSearchQuery(e.target.value)}
              placeholder={lang === 'ml' ? 'കളിക്കാരന്റെ പേര് അല്ലെങ്കിൽ ജേഴ്സി നമ്പർ തിരയുക...' : 'Search player by name, number or club...'}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl text-xs font-medium surface-light border border-surface-border dark:border-navy-700 text-card-title focus:outline-hidden focus:ring-2 focus:ring-royal min-h-[44px]"
            />
            {playerSearchQuery && (
              <button
                onClick={() => setPlayerSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-card-muted hover:text-card-title"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Players Grid with Live Card Status Indicators */}
          {visiblePlayers.length === 0 ? (
            <div className="py-8 px-4 rounded-2xl surface-light border border-dashed border-surface-border dark:border-navy-700 text-center text-xs text-card-muted font-medium">
              {lang === 'ml' ? 'തിരഞ്ഞെടുത്ത വിവരങ്ങളുമായി പൊരുത്തപ്പെടുന്ന കളിക്കാരെ കണ്ടെത്തിയില്ല' : 'No players found matching your query'}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {visiblePlayers.map((p) => {
                const disc = getPlayerDisciplinaryStatus(p.name, p.number, p.club);
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      if (disc.hasCard) {
                        setSelectedCardPlayer({ player: p, disciplinary: disc });
                      }
                    }}
                    className={`p-3 rounded-2xl surface-light border transition flex items-center justify-between gap-3 text-xs min-h-[52px] ${
                      disc.hasRedCard 
                        ? 'border-red-500/50 bg-red-500/5 hover:border-red-500 cursor-pointer' 
                        : disc.hasYellowCard
                        ? 'border-amber-500/50 bg-amber-500/5 hover:border-amber-500 cursor-pointer'
                        : 'border-surface-border dark:border-navy-700 hover:border-royal'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-8 h-8 rounded-xl bg-surface-card text-card-title font-black font-sports border border-surface-border dark:border-navy-700 flex items-center justify-center shrink-0 shadow-2xs">
                        #{p.number}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-white p-0.5 border border-slate-200 shrink-0">
                        <TeamLogo teamName={p.club} className="w-full h-full object-contain" />
                      </div>
                      <div className="min-w-0">
                        <h5 className="font-bold text-card-title truncate text-xs sm:text-sm">
                          {lang === 'ml' ? (p.nameMl || p.name) : p.name}
                        </h5>
                        <p className="text-[10px] text-card-muted truncate font-medium">
                          {lang === 'ml' ? (p.clubMl || p.club) : p.club}
                        </p>
                      </div>
                    </div>

                    {/* Disciplinary Card Indicator */}
                    {disc.hasRedCard && (
                      <span className="px-2 py-1 rounded-lg bg-red-600 text-white font-black text-[10px] flex items-center gap-1 shrink-0 shadow-xs animate-pulse">
                        <span>🟥</span>
                        <span>{lang === 'ml' ? 'റെഡ് കാർഡ്' : 'Red Card'}</span>
                        <span className="font-mono bg-black/20 px-1 rounded-xs">{disc.latestCard?.minute}'</span>
                      </span>
                    )}
                    {disc.hasYellowCard && !disc.hasRedCard && (
                      <span className="px-2 py-1 rounded-lg bg-amber-500 text-navy-950 font-black text-[10px] flex items-center gap-1 shrink-0 shadow-xs">
                        <span>🟨</span>
                        <span>{lang === 'ml' ? 'യെല്ലോ' : 'Yellow'}</span>
                        <span className="font-mono bg-black/20 px-1 rounded-xs">{disc.latestCard?.minute}'</span>
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* ============================================================== */}
      {/* VIEW B: OFFICIAL HONOURS & LEADERBOARDS */}
      {/* ============================================================== */}
      {activeStatsTab === 'leaders' && (
        <div className="space-y-5 animate-fadeIn">
          {/* If No Matches Played Yet: Show 1 Clean Modern Kickoff Preview instead of 4 giant empty boxes */}
          {!hasLiveMatchesPlayed ? (
            <div className="p-6 rounded-3xl surface-card border border-surface-border dark:border-navy-700 text-center space-y-4 shadow-card">
              <div className="w-14 h-14 rounded-2xl btn-royal text-white flex items-center justify-center mx-auto shadow-md">
                <Trophy className="w-7 h-7 text-gold" />
              </div>

              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-base sm:text-lg font-black font-sports uppercase text-card-title">
                  {lang === 'ml' ? 'ലീഡർബോർഡുകൾ ഉദ്ഘാടന മത്സരത്തോടെ സജീവമാകും' : 'Leaderboards Activate on Opening Match'}
                </h3>
                <p className="text-xs text-card-muted leading-relaxed">
                  {lang === 'ml'
                    ? 'നവംബർ 06 വെള്ളിയാഴ്ച രാത്രി 8:45 മണിക്ക് ഉദ്ഘാടന മത്സരം ആരംഭിക്കുന്നതോടെ ഗോൾഡൻ ബൂട്ട്, ക്ലീൻ ഷീറ്റ്, ഫെയർ പ്ലേ പട്ടികകൾ റഫറി സ്കോർ കാർഡുകളിൽ നിന്ന് തത്സമയം അപ്ഡേറ്റ് ചെയ്യപ്പെടും.'
                    : 'The Golden Boot, Golden Glove, and Fair Play standings will activate live from the referee scorer desk once Match 1 kicks off on Friday, Nov 06.'}
                </p>
              </div>

              {/* 3 Preview Honors Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-left">
                <div className="p-4 rounded-2xl surface-light border border-surface-border dark:border-navy-700 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">👟</span>
                    <h5 className="font-bold text-xs text-card-title">Golden Boot</h5>
                  </div>
                  <p className="text-[11px] text-card-muted">Top goal scorers across all tournament matches.</p>
                </div>

                <div className="p-4 rounded-2xl surface-light border border-surface-border dark:border-navy-700 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🧤</span>
                    <h5 className="font-bold text-xs text-card-title">Golden Glove</h5>
                  </div>
                  <p className="text-[11px] text-card-muted">Goalkeepers with the most clean sheets recorded.</p>
                </div>

                <div className="p-4 rounded-2xl surface-light border border-surface-border dark:border-navy-700 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🤝</span>
                    <h5 className="font-bold text-xs text-card-title">Fair Play</h5>
                  </div>
                  <p className="text-[11px] text-card-muted">Clubs disciplined with the fewest cards.</p>
                </div>
              </div>
            </div>
          ) : (
            /* Live Leaderboards when matches are played */
            <div className="space-y-5">
              {/* Golden Boot Section */}
              <section className="rounded-3xl p-5 sm:p-6 border border-surface-border dark:border-navy-700 surface-card shadow-card space-y-4">
                <div className="flex items-center gap-2.5 border-b border-surface-border dark:border-navy-700 pb-3">
                  <span className="p-2 rounded-xl bg-amber-500 text-navy-950 shadow-xs font-black">
                    <Flame className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-base sm:text-lg font-black font-sports uppercase tracking-wider text-card-title">
                      {lang === 'ml' ? 'ഗോൾഡൻ ബൂട്ട് ലീഡർബോർഡ്' : 'GOLDEN BOOT RACE'}
                    </h3>
                    <p className="text-[11px] text-card-muted font-bold">
                      {lang === 'ml' ? 'ടൂർണ്ണമെന്റിലെ മുൻനിര ഗോൾവേട്ടക്കാർ' : 'Top goal scorers of Season 7'}
                    </p>
                  </div>
                </div>

                {topScorerLeader && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/40 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-xl bg-amber-500 text-navy-950 font-black font-sports text-sm flex items-center justify-center shrink-0 shadow-sm">
                        #1
                      </span>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                          Current Leader
                        </span>
                        <h4 className="text-base font-black font-sports text-card-title leading-tight">
                          {topScorerLeader.name}
                        </h4>
                        <p className="text-xs text-card-muted font-medium">
                          {topScorerLeader.team}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black font-sports text-amber-500 leading-none block">
                        {topScorerLeader.goals}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-card-muted">Goals</span>
                    </div>
                  </div>
                )}

                {subsequentScorers.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    {subsequentScorers.map((scorer, idx) => (
                      <div
                        key={scorer.name}
                        className="p-3 rounded-xl surface-light border border-surface-border dark:border-navy-700 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="font-sports font-bold text-card-muted w-5 text-center">
                            #{idx + 2}
                          </span>
                          <div>
                            <h5 className="font-bold text-card-title">{scorer.name}</h5>
                            <p className="text-[10px] text-card-muted">{scorer.team}</p>
                          </div>
                        </div>
                        <span className="font-sports font-black text-amber-500 text-base">
                          {scorer.goals}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Golden Glove Section */}
              <section className="rounded-3xl p-5 sm:p-6 border border-surface-border dark:border-navy-700 surface-card shadow-card space-y-4">
                <div className="flex items-center gap-2.5 border-b border-surface-border dark:border-navy-700 pb-3">
                  <span className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs">
                    <ShieldCheck className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-base sm:text-lg font-black font-sports uppercase tracking-wider text-card-title">
                      {lang === 'ml' ? 'ഗോൾഡൻ ഗ്ലോവ് (ക്ലീൻ ഷീറ്റ്)' : 'GOLDEN GLOVE RACE'}
                    </h3>
                    <p className="text-[11px] text-card-muted font-bold">
                      {lang === 'ml' ? 'സ്റ്റാർട്ടിംഗ് ഗോൾകീപ്പർമാരുടെ ക്ലീൻ ഷീറ്റ്' : 'Clean sheets recorded by starting goalkeepers'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {stats.rankedGoalkeepers.slice(0, 3).map((gk, idx) => (
                    <div 
                      key={gk.name} 
                      className="p-3.5 rounded-2xl surface-light border border-surface-border dark:border-navy-700 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold font-sports text-xs flex items-center justify-center shrink-0">
                          #{idx + 1}
                        </span>
                        <div className="w-7 h-7 rounded-full bg-white p-0.5 border border-slate-200 shrink-0">
                          <TeamLogo teamName={gk.club} className="w-full h-full object-contain" />
                        </div>
                        <div className="min-w-0">
                          <h5 className="font-bold text-card-title text-xs truncate">{gk.name}</h5>
                          <p className="text-[10px] text-card-muted truncate">{gk.club}</p>
                        </div>
                      </div>
                      <span className="text-base font-black font-sports text-emerald-600 dark:text-emerald-400">
                        {gk.cleanSheets}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Fair Play Table */}
              <section className="rounded-3xl p-5 sm:p-6 border border-surface-border dark:border-navy-700 surface-card shadow-card space-y-4">
                <div className="flex items-center gap-2.5 border-b border-surface-border dark:border-navy-700 pb-3">
                  <span className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
                    <Medal className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-base sm:text-lg font-black font-sports uppercase tracking-wider text-card-title">
                      {lang === 'ml' ? 'ഫെയർ പ്ലേ പട്ടിക' : 'FAIR PLAY STANDINGS'}
                    </h3>
                    <p className="text-[11px] text-card-muted font-bold">
                      {lang === 'ml' ? 'ഏറ്റവും കുറഞ്ഞ കാർഡുകൾ നേടിയ ക്ലബ്ബുകൾ' : 'Clubs ranked by fewest disciplined cards'}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  {stats.fairPlayClubs.slice(0, 5).map((club, idx) => (
                    <div
                      key={club.club}
                      className="p-3 rounded-xl surface-light border border-surface-border dark:border-navy-700 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-sports font-bold text-card-muted w-5 text-center">
                          #{idx + 1}
                        </span>
                        <h5 className="font-bold text-card-title">{club.club}</h5>
                      </div>
                      <div className="flex items-center gap-3 font-mono font-bold">
                        <span className="text-amber-500">🟨 {club.yellow}</span>
                        <span className="text-red-500">🟥 {club.red}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      )}

      {/* Disciplinary Inspection Dialog (Triggered on Click of disciplined player) */}
      {selectedCardPlayer && (
        <div 
          onClick={() => setSelectedCardPlayer(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-3xl surface-navy-card border border-navy-700 p-5 text-white shadow-2xl space-y-4 animate-scaleUp"
          >
            <div className="flex items-center justify-between pb-3 border-b border-navy-700">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-white p-0.5 border border-slate-300 shrink-0">
                  <TeamLogo teamName={selectedCardPlayer.player?.club} className="w-full h-full object-contain" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">{selectedCardPlayer.player?.name}</h4>
                  <p className="text-[11px] text-navy-muted">#{selectedCardPlayer.player?.number} • {selectedCardPlayer.player?.club}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCardPlayer(null)}
                className="w-8 h-8 rounded-full bg-navy-800 text-white flex items-center justify-center hover:bg-navy-700 transition"
              >
                ✕
              </button>
            </div>

            {selectedCardPlayer.disciplinary?.hasRedCard ? (
              <div className="p-4 rounded-2xl bg-red-600/20 border-2 border-red-500 text-white space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl animate-pulse">🟥</span>
                    <div>
                      <span className="text-[10px] font-black uppercase text-red-400 block">
                        {lang === 'ml' ? 'റഫറി ചുവപ്പ് കാർഡ് നൽകി' : 'OFFICIAL RED CARD'}
                      </span>
                      <h5 className="text-sm font-black text-white">
                        {lang === 'ml' ? 'കളത്തിൽ നിന്ന് പുറത്തായി' : 'Match Expulsion'}
                      </h5>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-red-600 text-white font-mono font-black text-xs">
                    {selectedCardPlayer.disciplinary.latestCard?.minute}'
                  </span>
                </div>
                <div className="text-xs text-red-200 bg-navy-950/60 p-2.5 rounded-xl border border-red-500/30 space-y-1">
                  <p><span className="font-bold">{lang === 'ml' ? 'കാരണം:' : 'Reason:'}</span> {selectedCardPlayer.disciplinary.latestCard?.reason}</p>
                  <p className="text-[10px] text-emerald-400 font-bold">✓ Saved in Database</p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-500/20 border-2 border-amber-500 text-white space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🟨</span>
                    <div>
                      <span className="text-[10px] font-black uppercase text-amber-400 block">OFFICIAL YELLOW CARD</span>
                      <h5 className="text-sm font-black text-white">Caution Recorded</h5>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-navy-950 font-mono font-black text-xs">
                    {selectedCardPlayer.disciplinary.latestCard?.minute}'
                  </span>
                </div>
                <p className="text-xs text-amber-200">
                  {selectedCardPlayer.disciplinary.latestCard?.reason}
                </p>
              </div>
            )}

            <button
              onClick={() => setSelectedCardPlayer(null)}
              className="w-full py-2.5 rounded-xl btn-royal text-white font-bold text-xs uppercase transition active:scale-98"
            >
              {lang === 'ml' ? 'അടയ്ക്കുക' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
