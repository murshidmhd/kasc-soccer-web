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
  X,
  Crown,
  Star
} from 'lucide-react';
import TeamLogo from './TeamLogo';
import { fixtures, tournamentInfo, officialTournamentGoalkeepers, officialTournamentGoalScorers, participatingTeams } from '../data/tournamentData';
import { squadPlayers, squadClubs, clubSquadStatus, squadClubLabelsMl } from '../data/squad';
import sfaPlayersByTeam from '../data/sfa_players_by_team.json';
import { getStoredMatchState } from '../utils/matchStateManager';
import { calculateTournamentStats } from '../utils/statsCalculator';
import { getPlayerDisciplinaryStatus } from '../utils/disciplinaryManager';
import { getLineupTactics } from '../utils/lineupManager';
import { 
  SHOW_NATIONALITY, 
  AWARDS_NOTE 
} from '../config/siteConfig';

export default function TopScorers({ lang, isDarkMode }) {
  const [matchState, setMatchState] = useState(getStoredMatchState);
  const [activeStatsTab, setActiveStatsTab] = useState('players'); // 'players' | 'leaders'
  const [playerSortMode, setPlayerSortMode] = useState('mvp'); // 'mvp' | 'goals' | 'motm' | 'number'
  const [playerSearchQuery, setPlayerSearchQuery] = useState('');
  const [selectedClubFilter, setSelectedClubFilter] = useState('All');
  const [selectedCardPlayer, setSelectedCardPlayer] = useState(null);
  const [visibleCount, setVisibleCount] = useState(20);
  const [showTopTen, setShowTopTen] = useState(false);

  // Sync matchState when referee desk updates goals or events
  useEffect(() => {
    const handleUpdate = (e) => {
      setMatchState(e.detail || getStoredMatchState());
    };
    window.addEventListener('kasc_match_state_updated', handleUpdate);
    return () => window.removeEventListener('kasc_match_state_updated', handleUpdate);
  }, []);

  useEffect(() => {
    const syncLineup = (e) => setLineupTactics(e.detail || getLineupTactics());
    window.addEventListener('kasc_lineup_tactics_updated', syncLineup);
    return () => window.removeEventListener('kasc_lineup_tactics_updated', syncLineup);
  }, []);

  // Compute all tournament stats once and memoize (Confirmed matches only)
  const stats = useMemo(() => {
    return calculateTournamentStats([], fixtures.filter((m) => m.confirmed), matchState);
  }, [matchState]);

  // All Clubs List for Filter Chips
  const allClubsList = useMemo(() => {
    const list = ['All'];
    const seen = new Set(['All']);
    squadClubs.forEach((c) => {
      if (!seen.has(c)) {
        seen.add(c);
        list.push(c);
      }
    });
    participatingTeams.forEach((t) => {
      if (!seen.has(t.name)) {
        seen.add(t.name);
        list.push(t.name);
      }
    });
    return list;
  }, []);

  // SINGLE UNIFIED PLAYERS DIRECTORY & TOURNAMENT STATS
  const unifiedPlayersList = useMemo(() => {
    const playerMap = new Map();

    const getCleanKey = (name, club) => {
      return ((name || '').trim() + '__' + (club || '').trim()).toLowerCase();
    };

    // 1. Add confirmed squad players
    squadPlayers.forEach((sp, idx) => {
      const key = getCleanKey(sp.name, sp.club);
      playerMap.set(key, {
        id: sp.id || `sp-${idx}`,
        name: sp.name,
        nameMl: sp.nameMl || sp.name,
        number: sp.number,
        club: sp.club,
        clubMl: sp.clubMl || sp.club,
        position: sp.position || 'XI',
        photoUrl: sp.photoUrl || sp.posterUrl || null,
        goals: 0,
        motmCount: 0,
        yellowCards: 0,
        redCards: 0,
        matches: new Set()
      });
    });

    // 2. Add SFA players for all participating teams
    participatingTeams.forEach((t) => {
      const sfaId = t.sfaTeamId;
      if (sfaId && sfaPlayersByTeam[String(sfaId)]) {
        sfaPlayersByTeam[String(sfaId)].forEach((p, idx) => {
          const key = getCleanKey(p.name, t.name);
          if (!playerMap.has(key)) {
            playerMap.set(key, {
              id: `sfa-${sfaId}-${p.id || idx}`,
              name: p.name,
              nameMl: p.name,
              number: p.jersey_number || (idx + 1),
              club: t.name,
              clubMl: t.nameMl || t.name,
              position: p.position || 'XI',
              photoUrl: p.image_url && !p.image_url.includes('default') ? p.image_url : null,
              goals: 0,
              motmCount: 0,
              yellowCards: 0,
              redCards: 0,
              matches: new Set()
            });
          }
        });
      }
    });

    // 3. Aggregate match stats from fixtures
    const completedMatches = fixtures.filter((f) => f.confirmed || f.status === 'Completed' || (f.score1 != null && f.score2 != null));

    completedMatches.forEach((f) => {
      const events = f.events || [];
      events.forEach((ev) => {
        if (!ev.player) return;
        const pName = ev.player.trim();
        const pTeam = ev.team || f.team1;

        let matched = false;
        for (const [k, p] of playerMap.entries()) {
          const sameName = p.name.toLowerCase() === pName.toLowerCase() ||
            p.name.toLowerCase().includes(pName.toLowerCase()) ||
            pName.toLowerCase().includes(p.name.toLowerCase());
          const sameClub = !pTeam || p.club.toLowerCase().includes(pTeam.toLowerCase()) || pTeam.toLowerCase().includes(p.club.toLowerCase());
          if (sameName && (sameClub || !p.club)) {
            p.matches.add(f.id);
            if (ev.type === 'goal' && !ev.isOwnGoal) p.goals++;
            if (ev.type === 'yellow_card') p.yellowCards++;
            if (ev.type === 'red_card') p.redCards++;
            matched = true;
            break;
          }
        }

        if (!matched) {
          const key = getCleanKey(pName, pTeam);
          playerMap.set(key, {
            id: `ev-${pName}`,
            name: pName,
            nameMl: pName,
            number: ev.playerNumber || 10,
            club: pTeam,
            clubMl: pTeam,
            position: ev.type === 'goal' ? 'FWD' : 'MID',
            photoUrl: null,
            goals: ev.type === 'goal' && !ev.isOwnGoal ? 1 : 0,
            motmCount: 0,
            yellowCards: ev.type === 'yellow_card' ? 1 : 0,
            redCards: ev.type === 'red_card' ? 1 : 0,
            matches: new Set([f.id])
          });
        }
      });

      if (f.motm) {
        const match = f.motm.match(/^([^(]+)(?:\(([^)]+)\))?/);
        const motmName = match ? match[1].trim() : f.motm.trim();
        const motmTeam = match && match[2] ? match[2].trim() : (f.winner || f.team1);

        let matched = false;
        for (const [k, p] of playerMap.entries()) {
          const sameName = p.name.toLowerCase() === motmName.toLowerCase() ||
            p.name.toLowerCase().includes(motmName.toLowerCase()) ||
            motmName.toLowerCase().includes(p.name.toLowerCase());
          const sameClub = !motmTeam || p.club.toLowerCase().includes(motmTeam.toLowerCase()) || motmTeam.toLowerCase().includes(p.club.toLowerCase());
          if (sameName && (sameClub || !p.club)) {
            p.motmCount++;
            p.matches.add(f.id);
            matched = true;
            break;
          }
        }

        if (!matched) {
          const key = getCleanKey(motmName, motmTeam);
          playerMap.set(key, {
            id: `motm-${motmName}`,
            name: motmName,
            nameMl: motmName,
            number: 10,
            club: motmTeam,
            clubMl: motmTeam,
            position: 'FWD',
            photoUrl: null,
            goals: 0,
            motmCount: 1,
            yellowCards: 0,
            redCards: 0,
            matches: new Set([f.id])
          });
        }
      }
    });

    // 4. Enrich with officialTournamentGoalScorers
    officialTournamentGoalScorers.forEach((ts) => {
      for (const [k, p] of playerMap.entries()) {
        if (p.name.toLowerCase() === ts.name.toLowerCase() || p.name.toLowerCase().includes(ts.name.toLowerCase())) {
          if (ts.goals > p.goals) p.goals = ts.goals;
          break;
        }
      }
    });

    return Array.from(playerMap.values()).map((p) => {
      const points = (p.goals * 3) + (p.motmCount * 5) - (p.yellowCards * 1) - (p.redCards * 3);
      let badge = null;
      if (p.motmCount >= 2) badge = '👑 2x MOTM';
      else if (p.goals >= 4) badge = '🔥 4 Goals Top Scorer';
      else if (p.goals >= 3) badge = '⚽ Top Scorer';
      else if (p.goals >= 2 && p.motmCount >= 1) badge = '⭐ Match Winner';
      else if (p.motmCount >= 1 && p.goals === 0) badge = '🛡️ Star MOTM';
      else if (p.goals >= 1) badge = '⚽ Goal Scorer';

      return {
        ...p,
        points,
        matchCount: Math.max(p.matches.size, p.goals > 0 || p.motmCount > 0 ? 1 : 0),
        badge
      };
    });
  }, []);

  // Filtered and Sorted Players for the Single Unified Table
  const filteredUnifiedPlayers = useMemo(() => {
    let list = [...unifiedPlayersList];

    // Filter by club
    if (selectedClubFilter !== 'All') {
      const targetClub = selectedClubFilter.toLowerCase();
      list = list.filter((p) => (p.club || '').toLowerCase().includes(targetClub) || targetClub.includes((p.club || '').toLowerCase()));
    }

    // Filter by search query
    if (playerSearchQuery.trim()) {
      const q = playerSearchQuery.toLowerCase().trim();
      list = list.filter((p) => {
        const nameEn = (p.name || '').toLowerCase();
        const nameMl = (p.nameMl || '').toLowerCase();
        const num = String(p.number || '');
        const club = (p.club || '').toLowerCase();
        return nameEn.includes(q) || nameMl.includes(q) || num === q || club.includes(q);
      });
    }

    // Sort
    list.sort((a, b) => {
      if (playerSortMode === 'goals') {
        if (b.goals !== a.goals) return b.goals - a.goals;
        if (b.motmCount !== a.motmCount) return b.motmCount - a.motmCount;
        return b.points - a.points;
      }
      if (playerSortMode === 'motm') {
        if (b.motmCount !== a.motmCount) return b.motmCount - a.motmCount;
        if (b.goals !== a.goals) return b.goals - a.goals;
        return b.points - a.points;
      }
      if (playerSortMode === 'number') {
        return (Number(a.number) || 99) - (Number(b.number) || 99);
      }
      // Default: MVP points / Performance
      if (b.points !== a.points) return b.points - a.points;
      if (b.goals !== a.goals) return b.goals - a.goals;
      if (b.motmCount !== a.motmCount) return b.motmCount - a.motmCount;
      return (Number(a.number) || 99) - (Number(b.number) || 99);
    });

    return list;
  }, [unifiedPlayersList, selectedClubFilter, playerSearchQuery, playerSortMode]);

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

  const effectiveScorers = stats.rankedScorers.length > 0 ? stats.rankedScorers : officialTournamentGoalScorers;
  const topScorerLeader = effectiveScorers[0] || null;
  const subsequentScorers = showTopTen ? effectiveScorers.slice(1, 10) : effectiveScorers.slice(1, 5);

  const [showAllKeepers, setShowAllKeepers] = useState(false);
  const effectiveKeepers = officialTournamentGoalkeepers;
  const topKeeperLeader = effectiveKeepers[0] || null;
  const subsequentKeepers = showAllKeepers ? effectiveKeepers.slice(1) : effectiveKeepers.slice(1, 5);

  const hasLiveMatchesPlayed = stats.matchesCount > 0 || stats.totalGoals > 0;

  return (
    <div className="space-y-5 pb-28 max-w-5xl mx-auto select-none">
      {/* 1. Modern Sports Hero Header (Clean, Premium, No Bulky Trophy Image) */}
      <section className="rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-navy-900 via-navy-950 to-purple-950 text-white border border-navy-700 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold text-[11px] font-black uppercase tracking-wider shadow-xs">
              <Trophy className="w-3.5 h-3.5 text-gold" />
              <span>{tournamentInfo.season || 'SEASON 7'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-sports uppercase tracking-wide text-white leading-tight">
              {lang === 'ml' ? 'ടൂർണ്ണമെന്റ് സ്ഥിതിവിവരക്കണക്കുകൾ' : 'OFFICIAL TOURNAMENT STATS'}
            </h2>
            <p className="text-xs text-navy-muted max-w-lg leading-relaxed">
              {lang === 'ml'
                ? 'പെരുവള്ളൂർ പഞ്ചായത്ത് സ്റ്റേഡിയം • 24 ക്ലബ്ബുകളുടെ ടൂർണ്ണമെന്റ് റെക്കോർഡുകൾ'
                : 'Peruvallur Panchayath Stadium • Tournament records for 24 elite Sevens clubs.'}
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-navy-800/80 border border-navy-700 self-start sm:self-center">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold text-slate-200">
              {lang === 'ml' ? 'സീസൺ 7 • പെരുവള്ളൂർ' : 'Season 7 • Peruvallur'}
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

      {/* 2. Sleek Section Controller: 2 Clean Tabs (Single Unified Players Table & Standings) */}
      <div className="p-1.5 rounded-2xl bg-surface-light dark:bg-navy-900 border border-surface-border dark:border-navy-700 grid grid-cols-2 gap-1.5">
        <button
          onClick={() => setActiveStatsTab('players')}
          className={`min-h-[46px] px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 active:scale-95 ${
            activeStatsTab === 'players'
              ? 'btn-royal text-white font-black shadow-md ring-2 ring-royal/30'
              : 'text-card-muted hover:text-card-title'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{lang === 'ml' ? 'കളിക്കാരുടെ വിവരങ്ങൾ & സ്റ്റാറ്റ്സ്' : 'Players Directory & Stats'}</span>
        </button>

        <button
          onClick={() => setActiveStatsTab('leaders')}
          className={`min-h-[46px] px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 active:scale-95 ${
            activeStatsTab === 'leaders'
              ? 'btn-royal text-white font-black shadow-md ring-2 ring-royal/30'
              : 'text-card-muted hover:text-card-title'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>{lang === 'ml' ? 'പോയിന്റ് പട്ടിക & ലീഡർബോർഡ്' : 'Standings & Leaders'}</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* VIEW: SINGLE UNIFIED PLAYERS DETAILS & STATS TABLE */}
      {/* ============================================================== */}
      {activeStatsTab === 'players' && (
        <section className="space-y-4 animate-fadeIn">
          <div className="rounded-3xl p-4 sm:p-5 border border-surface-border dark:border-navy-700 surface-card shadow-card space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border dark:border-navy-700 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl btn-royal text-white shadow-xs">
                  <Users className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-black font-sports uppercase tracking-wider text-card-title">
                    {lang === 'ml' ? 'കളിക്കാരുടെ വിവരങ്ങളും ടൂർണ്ണമെന്റ് സ്റ്റാറ്റ്സും' : 'PLAYERS DIRECTORY & TOURNAMENT STATS'}
                  </h3>
                  <p className="text-[11px] text-card-muted font-medium">
                    {lang === 'ml' 
                      ? 'താരങ്ങളുടെ വിവരങ്ങൾ, ഗോളുകൾ (⚽), മാൻ ഓഫ് ദി മാച്ച് (🏆), കാർഡുകൾ'
                      : 'Verified player details, goals (⚽), MOTMs (🏆), and disciplinary records'}
                  </p>
                </div>
              </div>

              <span className="shrink-0 px-2.5 py-1 rounded-xl bg-surface-light dark:bg-navy-800 text-[11px] font-mono font-bold text-card-muted border border-surface-border self-start sm:self-center">
                {filteredUnifiedPlayers.length} {lang === 'ml' ? 'താരങ്ങൾ' : 'Players'}
              </span>
            </div>

            {/* Club Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto horizontal-scroll-container py-1 -mx-1 px-1">
              {allClubsList.map((club) => {
                const isSelected = selectedClubFilter === club;
                const clubLabel = club === 'All' 
                  ? (lang === 'ml' ? 'എല്ലാ ക്ലബ്ബുകളും' : 'All Clubs')
                  : (squadClubLabelsMl[club] || club);
                return (
                  <button
                    key={club}
                    onClick={() => {
                      setSelectedClubFilter(club);
                      setVisibleCount(20);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                      isSelected
                        ? 'btn-royal text-white shadow-xs ring-2 ring-royal/30'
                        : 'surface-light hover:bg-surface-subtle text-card-title border border-surface-border dark:border-navy-700'
                    }`}
                  >
                    {club !== 'All' && (
                      <div className="w-4 h-4 rounded-full bg-white p-0.5 shrink-0 inline-flex items-center justify-center">
                        <TeamLogo teamName={club} className="w-full h-full object-contain" />
                      </div>
                    )}
                    <span>{clubLabel}</span>
                  </button>
                );
              })}
            </div>

            {/* Sort Controls & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
              {/* Sort Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                <button
                  onClick={() => setPlayerSortMode('mvp')}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0 ${
                    playerSortMode === 'mvp'
                      ? 'btn-royal text-white shadow-xs'
                      : 'surface-light text-card-muted hover:text-card-title border border-surface-border dark:border-navy-700'
                  }`}
                >
                  <Star className="w-3.5 h-3.5 text-gold" />
                  <span>{lang === 'ml' ? 'MVP റേറ്റിംഗ്' : 'MVP Points'}</span>
                </button>

                <button
                  onClick={() => setPlayerSortMode('goals')}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0 ${
                    playerSortMode === 'goals'
                      ? 'btn-royal text-white shadow-xs'
                      : 'surface-light text-card-muted hover:text-card-title border border-surface-border dark:border-navy-700'
                  }`}
                >
                  <span>⚽</span>
                  <span>{lang === 'ml' ? 'ഗോളുകൾ' : 'Goals'}</span>
                </button>

                <button
                  onClick={() => setPlayerSortMode('motm')}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0 ${
                    playerSortMode === 'motm'
                      ? 'btn-royal text-white shadow-xs'
                      : 'surface-light text-card-muted hover:text-card-title border border-surface-border dark:border-navy-700'
                  }`}
                >
                  <span>🏆</span>
                  <span>{lang === 'ml' ? 'MOTM' : 'MOTMs'}</span>
                </button>

                <button
                  onClick={() => setPlayerSortMode('number')}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0 ${
                    playerSortMode === 'number'
                      ? 'btn-royal text-white shadow-xs'
                      : 'surface-light text-card-muted hover:text-card-title border border-surface-border dark:border-navy-700'
                  }`}
                >
                  <span>#</span>
                  <span>{lang === 'ml' ? 'ജേഴ്സി നമ്പർ' : 'Jersey #'}</span>
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative min-w-[220px]">
                <Search className="w-3.5 h-3.5 text-card-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={playerSearchQuery}
                  onChange={(e) => {
                    setPlayerSearchQuery(e.target.value);
                    setVisibleCount(20);
                  }}
                  placeholder={lang === 'ml' ? 'കളിക്കാരന്റെ പേര്, നമ്പർ...' : 'Search player by name, #, club...'}
                  className="w-full h-9 pl-8 pr-7 rounded-xl text-xs surface-light text-card-title border border-surface-border dark:border-navy-700 focus:outline-hidden focus:ring-1 focus:ring-royal/40"
                />
                {playerSearchQuery && (
                  <button
                    onClick={() => setPlayerSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-card-muted hover:text-card-title"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* The One Unified Players Table */}
            {filteredUnifiedPlayers.length === 0 ? (
              <div className="py-12 px-4 rounded-2xl surface-light border border-dashed border-surface-border dark:border-navy-700 text-center space-y-2">
                <Users className="w-8 h-8 text-card-muted mx-auto" />
                <p className="text-xs font-bold text-card-title">
                  {lang === 'ml' ? 'തിരഞ്ഞെടുത്ത വിവരങ്ങളുമായി പൊരുത്തപ്പെടുന്ന താരങ്ങളെ കണ്ടെത്തിയില്ല' : 'No players found matching your query'}
                </p>
                {playerSearchQuery && (
                  <button
                    onClick={() => setPlayerSearchQuery('')}
                    className="text-[11px] text-royal dark:text-sky underline font-bold"
                  >
                    Clear search filter
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-1.5">
                {filteredUnifiedPlayers.slice(0, visibleCount).map((p, idx) => {
                  const rank = idx + 1;
                  const disc = getPlayerDisciplinaryStatus(p.name, p.number, p.club);

                  return (
                    <div
                      key={p.id || `unified-p-${idx}`}
                      onClick={() => {
                        if (disc.hasCard) {
                          setSelectedCardPlayer({ player: p, disciplinary: disc });
                        }
                      }}
                      className={`p-3 rounded-2xl surface-light border transition flex items-center justify-between gap-3 text-xs min-h-[56px] ${
                        disc.hasRedCard
                          ? 'border-red-500/50 bg-red-500/5 hover:border-red-500 cursor-pointer'
                          : disc.hasYellowCard
                          ? 'border-amber-500/50 bg-amber-500/5 hover:border-amber-500 cursor-pointer'
                          : 'border-surface-border dark:border-navy-700 hover:border-royal'
                      }`}
                    >
                      {/* Left: Number + Avatar + Name & Club */}
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        {/* Jersey Number or Rank */}
                        <div className="w-8 h-8 rounded-xl bg-surface-card text-card-title font-black font-sports border border-surface-border dark:border-navy-700 flex items-center justify-center shrink-0 shadow-2xs text-xs">
                          {p.number ? `#${p.number}` : `#${rank}`}
                        </div>

                        {/* Photo or Team Avatar */}
                        <div className="relative w-9 h-9 rounded-full bg-white border border-surface-border dark:border-navy-700 overflow-hidden shrink-0 flex items-center justify-center shadow-2xs">
                          {p.photoUrl ? (
                            <img 
                              src={p.photoUrl} 
                              alt="" 
                              className="w-full h-full object-cover" 
                              onError={(e) => { e.currentTarget.style.display = 'none'; }} 
                            />
                          ) : (
                            <TeamLogo teamName={p.club} className="w-6 h-6 object-contain" />
                          )}
                          {p.motmCount > 0 && (
                            <span className="absolute -top-1 -right-1 text-[10px]" title="MOTM Winner">👑</span>
                          )}
                        </div>

                        {/* Player Name and Club */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h5 className="font-bold text-card-title truncate text-xs sm:text-sm">
                              {lang === 'ml' ? (p.nameMl || p.name) : p.name}
                            </h5>
                            {p.badge && (
                              <span className="px-1.5 py-0.2 rounded-md text-[9px] font-black bg-gold/15 text-gold border border-gold/30 shrink-0">
                                {p.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-card-muted truncate flex items-center gap-1 mt-0.5">
                            <TeamLogo teamName={p.club} className="w-3 h-3 inline object-contain shrink-0" />
                            <span className="truncate">{lang === 'ml' ? (p.clubMl || p.club) : p.club}</span>
                            <span className="text-card-muted/60">•</span>
                            <span className="shrink-0">{p.position || 'XI'}</span>
                          </p>
                        </div>
                      </div>

                      {/* Right: Stats Pills: Goals, MOTM, Cards, MVP */}
                      <div className="flex items-center gap-1.5 shrink-0 text-[10px] font-black">
                        {/* Goals */}
                        <span 
                          title="Total Goals"
                          className={`px-2 py-1 rounded-lg flex items-center gap-1 ${
                            p.goals > 0
                              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                              : 'bg-surface-card text-card-muted/70'
                          }`}
                        >
                          <span>⚽</span>
                          <span className="font-sports text-xs">{p.goals}</span>
                        </span>

                        {/* MOTM */}
                        {p.motmCount > 0 && (
                          <span 
                            title="Man of the Match awards"
                            className="px-2 py-1 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1"
                          >
                            <span>🏆</span>
                            <span className="font-sports text-xs">{p.motmCount}</span>
                          </span>
                        )}

                        {/* Disciplinary Cards (if any) */}
                        {disc.hasRedCard ? (
                          <span title="Red Card" className="px-1.5 py-1 rounded-lg bg-red-600 text-white font-black text-[10px]">
                            🟥 {disc.latestCard?.minute ? `${disc.latestCard.minute}'` : ''}
                          </span>
                        ) : disc.hasYellowCard ? (
                          <span title="Yellow Card" className="px-1.5 py-1 rounded-lg bg-amber-500 text-navy-950 font-black text-[10px]">
                            🟨 {disc.latestCard?.minute ? `${disc.latestCard.minute}'` : ''}
                          </span>
                        ) : null}

                        {/* Total MVP Points */}
                        {p.points > 0 && (
                          <span 
                            title="MVP Points: (Goals * 3) + (MOTM * 5) - Cards"
                            className="min-w-[42px] text-center px-1.5 py-1 rounded-lg btn-royal text-white font-black font-sports text-xs shadow-xs hidden sm:inline-block"
                          >
                            {p.points} <span className="text-[8px] font-sans font-bold opacity-80">PTS</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination / Expand Button */}
            {filteredUnifiedPlayers.length > visibleCount && (
              <button 
                type="button" 
                onClick={() => setVisibleCount((prev) => Math.min(prev + 25, filteredUnifiedPlayers.length))} 
                className="w-full min-h-10 rounded-xl bg-surface-light dark:bg-navy-800 text-xs font-bold text-royal dark:text-sky hover:bg-surface-subtle transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>
                  {lang === 'ml' 
                    ? `കൂടുതൽ താരങ്ങളെ കാണുക (${visibleCount} / ${filteredUnifiedPlayers.length})` 
                    : `Show more players (${visibleCount} of ${filteredUnifiedPlayers.length})`}
                </span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Explanatory Scoring Note */}
            <div className="p-3 rounded-2xl bg-surface-light/60 dark:bg-navy-800/40 border border-surface-border text-[11px] text-card-muted flex items-center gap-2">
              <Info className="w-4 h-4 text-royal dark:text-sky shrink-0" />
              <span>
                {lang === 'ml'
                  ? 'ടൂർണ്ണമെന്റിൽ രജിസ്റ്റർ ചെയ്ത എല്ലാ താരങ്ങളുടെയും സമ്പൂർണ്ണ പട്ടിക. ഗോളുകൾ, മാൻ ഓഫ് ദി മാച്ച്, കാർഡുകൾ എന്നിവ ഉൾപ്പെടുന്നു.'
                  : 'Official unified tournament players directory with verified squad numbers, goals, MOTMs, and cards.'}
              </span>
            </div>
          </div>
        </section>
      )}


      {/* ============================================================== */}
      {/* VIEW B: OFFICIAL HONOURS & LEADERBOARDS */}
      {/* ============================================================== */}
      {activeStatsTab === 'leaders' && (
        <div className="space-y-5 animate-fadeIn">
          <section className="rounded-3xl p-4 sm:p-5 border border-surface-border dark:border-navy-700 surface-card shadow-card space-y-3">
            <div className="border-b border-surface-border dark:border-navy-700 pb-3">
              <h3 className="text-sm font-black font-sports uppercase tracking-wider text-card-title">
                {lang === 'ml' ? 'Team Records' : 'TEAM RECORDS'}
              </h3>
              <p className="text-[10px] text-card-muted">Knockout record · W-D-L, goals and latest result</p>
            </div>

            <div className="grid grid-cols-[minmax(0,1fr)_28px_52px_34px_38px] gap-1.5 px-2 text-[8px] font-black uppercase tracking-wide text-card-muted text-center">
              <span className="text-left">Club</span><span>P</span><span>W-D-L</span><span>GD</span><span>GF</span>
            </div>
            <div className="space-y-1.5">
              {stats.teamRecords.map((team) => (
                <div key={team.team} className="grid grid-cols-[minmax(0,1fr)_28px_52px_34px_38px] items-center gap-1.5 px-2 py-2 rounded-xl surface-light border border-surface-border dark:border-navy-700 text-center">
                  <div className="flex min-w-0 items-center gap-2 text-left">
                    <div className="w-7 h-7 rounded-full bg-white p-0.5 border border-surface-border shrink-0"><TeamLogo teamName={team.team} className="w-full h-full object-contain" /></div>
                    <div className="min-w-0">
                      <p className="text-[10px] sm:text-xs font-bold text-card-title truncate">{team.team}</p>
                      <p className="text-[9px] text-card-muted">GF {team.goalsFor} · GA {team.goalsAgainst} {team.lastResult ? `· ${team.lastResult === 'W' ? 'Advanced' : team.lastResult === 'L' ? 'Eliminated' : 'Draw'}` : '· Not played'}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-card-muted">{team.played}</span>
                  <span className="text-[10px] font-mono text-card-muted">{team.wins}-{team.draws}-{team.losses}</span>
                  <span className={`text-[10px] font-mono font-bold ${team.goalDifference > 0 ? 'text-emerald-600 dark:text-emerald-300' : team.goalDifference < 0 ? 'text-rose-600 dark:text-rose-300' : 'text-card-muted'}`}>{team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}</span>
                  <span className="text-xs font-black text-card-title">{team.goalsFor}</span>
                </div>
              ))}
            </div>
          </section>

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
                    ? 'നവംബർ 06 വെള്ളിയാഴ്ച രാത്രി 8:45 മണിക്ക് Opening Match ആരംഭിക്കുന്നതോടെ Golden Boot, Clean Sheet, Fair Play പട്ടികകൾ Referee Score Cards-ൽ നിന്ന് Live ആയി അപ്ഡേറ്റ് ചെയ്യും.'
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
                      {lang === 'ml' ? 'Golden Boot Leaderboard' : 'GOLDEN BOOT RACE'}
                    </h3>
                    <p className="text-[11px] text-card-muted font-bold">
                      {lang === 'ml' ? 'Tournament-ലെ Top Goal Scorers' : 'Top goal scorers of Season 7'}
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
                        key={`${scorer.team}-${scorer.number || scorer.name}`}
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

              {/* Golden Glove & Goalkeepers Saves Section */}
              <section className="rounded-3xl p-5 sm:p-6 border border-surface-border dark:border-navy-700 surface-card shadow-card space-y-4">
                <div className="flex items-center gap-2.5 border-b border-surface-border dark:border-navy-700 pb-3">
                  <span className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs">
                    <ShieldCheck className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-base sm:text-lg font-black font-sports uppercase tracking-wider text-card-title">
                      {lang === 'ml' ? 'ഗോൾകീപ്പർമാരും സേവുകളും (Golden Glove)' : 'GOLDEN GLOVE & SAVES LEADERBOARD'}
                    </h3>
                    <p className="text-[11px] text-card-muted font-bold">
                      {lang === 'ml' ? 'ടൂർണ്ണമെന്റിലെ ഔദ്യോഗിക സേവുകളും ക്ലീൻ ഷീറ്റുകളും' : 'Official match saves and clean sheets recorded'}
                    </p>
                  </div>
                </div>

                {topKeeperLeader && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-transparent border border-emerald-500/40 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-xl bg-emerald-500 text-navy-950 font-black font-sports text-sm flex items-center justify-center shrink-0 shadow-sm">
                        #1
                      </span>
                      <div className="w-10 h-10 rounded-full bg-white p-1 border border-emerald-400/40 shrink-0 shadow-xs">
                        <TeamLogo teamName={topKeeperLeader.team} className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                          Current Leader (Most Saves)
                        </span>
                        <h4 className="text-base font-black font-sports text-card-title leading-tight">
                          {topKeeperLeader.name}
                        </h4>
                        <p className="text-xs text-card-muted font-medium">
                          {topKeeperLeader.team}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black font-sports text-emerald-500 leading-none block">
                        {topKeeperLeader.saves}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-card-muted">Saves</span>
                    </div>
                  </div>
                )}

                {subsequentKeepers.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    {subsequentKeepers.map((gk, idx) => (
                      <div
                        key={`${gk.team}-${gk.name}`}
                        className="p-3 rounded-xl surface-light border border-surface-border dark:border-navy-700 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="font-sports font-bold text-card-muted w-5 text-center">
                            #{idx + 2}
                          </span>
                          <div className="w-7 h-7 rounded-full bg-white p-0.5 border border-slate-200 dark:border-navy-700 shrink-0">
                            <TeamLogo teamName={gk.team} className="w-full h-full object-contain" />
                          </div>
                          <div className="min-w-0">
                            <h5 className="font-bold text-card-title truncate">{gk.name}</h5>
                            <p className="text-[10px] text-card-muted truncate">{gk.team}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {gk.cleanSheets > 0 && (
                            <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold">
                              Clean Sheet
                            </span>
                          )}
                          <span className="font-sports font-black text-emerald-600 dark:text-emerald-400 text-base">
                            {gk.saves} <span className="text-[10px] text-card-muted font-normal uppercase">saves</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {effectiveKeepers.length > 5 && (
                  <button
                    onClick={() => setShowAllKeepers(!showAllKeepers)}
                    className="w-full py-2.5 rounded-xl border border-surface-border dark:border-navy-700 text-xs font-bold text-card-muted hover:text-card-title surface-light transition active:scale-98 flex items-center justify-center gap-1.5"
                  >
                    <span>
                      {showAllKeepers
                        ? (lang === 'ml' ? 'കുറച്ചു കാണിക്കുക' : 'Show Top 5 Only')
                        : (lang === 'ml' ? `ബാക്കി ഗോൾകീപ്പർമാരെ കാണുക (${effectiveKeepers.length})` : `Show All ${effectiveKeepers.length} Goalkeepers`)}
                    </span>
                    {showAllKeepers ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                )}
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
                        {lang === 'ml' ? 'Referee Red Card നൽകി' : 'OFFICIAL RED CARD'}
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
