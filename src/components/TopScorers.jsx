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
  const [activeStatsTab, setActiveStatsTab] = useState('mvp'); // 'mvp' | 'players' | 'leaders'
  const [mvpSortMode, setMvpSortMode] = useState('points'); // 'points' | 'goals' | 'motm'
  const [mvpSearchQuery, setMvpSearchQuery] = useState('');
  const [showAllMvp, setShowAllMvp] = useState(false);
  const [showTopTen, setShowTopTen] = useState(false);
  const [playerSearchQuery, setPlayerSearchQuery] = useState('');
  const [selectedClubFilter, setSelectedClubFilter] = useState('All');
  const [selectedCardPlayer, setSelectedCardPlayer] = useState(null);
  const [lineupTactics, setLineupTactics] = useState(getLineupTactics);
  const [showAllPerformance, setShowAllPerformance] = useState(false);
  const [selectedStatsMatchId, setSelectedStatsMatchId] = useState('m1');

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

  // Official Tournament Top Players & MVP Leaderboard aggregated dynamically from all matches
  const tournamentTopPlayers = useMemo(() => {
    const playerMap = new Map();

    const findSfaId = (teamName) => {
      if (!teamName) return null;
      const lower = teamName.toLowerCase().trim();
      const club = participatingTeams.find((c) => {
        const cName = (c.name || '').toLowerCase().trim();
        return cName === lower || cName.includes(lower) || lower.includes(cName);
      });
      return club?.sfaTeamId || null;
    };

    const findPhoto = (playerName, teamName) => {
      const sfaId = findSfaId(teamName);
      if (sfaId && sfaPlayersByTeam[String(sfaId)]) {
        const found = sfaPlayersByTeam[String(sfaId)].find(
          (p) => p.name && (p.name.toLowerCase() === playerName.toLowerCase() || p.name.toLowerCase().includes(playerName.toLowerCase()))
        );
        if (found?.image_url && !found.image_url.includes('default')) {
          return found.image_url;
        }
      }
      const squadP = squadPlayers.find(
        (p) => p.name && (p.name.toLowerCase() === playerName.toLowerCase() || p.name.toLowerCase().includes(playerName.toLowerCase()))
      );
      return squadP?.photoUrl || null;
    };

    const completedMatches = fixtures.filter((f) => f.confirmed || f.status === 'Completed' || (f.score1 != null && f.score2 != null));

    completedMatches.forEach((f) => {
      const events = f.events || [];
      events.forEach((ev) => {
        if (!ev.player) return;
        const pName = ev.player.trim();
        const pTeam = ev.team || f.team1;
        const key = `${pName.toLowerCase()}__${(pTeam || '').toLowerCase()}`;

        if (!playerMap.has(key)) {
          playerMap.set(key, {
            name: pName,
            team: pTeam,
            goals: 0,
            yellowCards: 0,
            redCards: 0,
            motmCount: 0,
            matches: new Set(),
            photoUrl: findPhoto(pName, pTeam)
          });
        }
        const record = playerMap.get(key);
        record.matches.add(f.id);
        if (ev.type === 'goal' && !ev.isOwnGoal) record.goals++;
        if (ev.type === 'yellow_card') record.yellowCards++;
        if (ev.type === 'red_card') record.redCards++;
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
          const sameTeam = !motmTeam || (p.team && p.team.toLowerCase().includes(motmTeam.toLowerCase())) ||
            (motmTeam && motmTeam.toLowerCase().includes(p.team?.toLowerCase() || ''));

          if (sameName && (sameTeam || !p.team)) {
            p.motmCount++;
            p.matches.add(f.id);
            if (!p.photoUrl) p.photoUrl = findPhoto(p.name, p.team);
            matched = true;
            break;
          }
        }

        if (!matched) {
          const key = `${motmName.toLowerCase()}__${(motmTeam || '').toLowerCase()}`;
          playerMap.set(key, {
            name: motmName,
            team: motmTeam,
            goals: 0,
            yellowCards: 0,
            redCards: 0,
            motmCount: 1,
            matches: new Set([f.id]),
            photoUrl: findPhoto(motmName, motmTeam)
          });
        }
      }
    });

    officialTournamentGoalScorers.forEach((ts) => {
      let found = false;
      for (const [k, p] of playerMap.entries()) {
        if (p.name.toLowerCase() === ts.name.toLowerCase() || p.name.toLowerCase().includes(ts.name.toLowerCase())) {
          if (ts.goals > p.goals) p.goals = ts.goals;
          found = true;
          break;
        }
      }
      if (!found) {
        const key = `${ts.name.toLowerCase()}__${(ts.team || '').toLowerCase()}`;
        playerMap.set(key, {
          name: ts.name,
          team: ts.team,
          goals: ts.goals,
          yellowCards: 0,
          redCards: 0,
          motmCount: 0,
          matches: new Set(),
          photoUrl: findPhoto(ts.name, ts.team)
        });
      }
    });

    return Array.from(playerMap.values())
      .filter((p) => p.goals > 0 || p.motmCount > 0)
      .map((p) => {
        const matchesCount = Math.max(p.matches.size, 1);
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
          matchesCount,
          points,
          badge
        };
      });
  }, []);

  const filteredMvpPlayers = useMemo(() => {
    let list = [...tournamentTopPlayers];
    if (mvpSearchQuery.trim()) {
      const q = mvpSearchQuery.toLowerCase().trim();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || (p.team && p.team.toLowerCase().includes(q)));
    }
    list.sort((a, b) => {
      if (mvpSortMode === 'goals') {
        if (b.goals !== a.goals) return b.goals - a.goals;
        if (b.motmCount !== a.motmCount) return b.motmCount - a.motmCount;
        return b.points - a.points;
      }
      if (mvpSortMode === 'motm') {
        if (b.motmCount !== a.motmCount) return b.motmCount - a.motmCount;
        if (b.goals !== a.goals) return b.goals - a.goals;
        return b.points - a.points;
      }
      // Default: MVP points
      if (b.points !== a.points) return b.points - a.points;
      if (b.goals !== a.goals) return b.goals - a.goals;
      return b.motmCount - a.motmCount;
    });
    return list;
  }, [tournamentTopPlayers, mvpSortMode, mvpSearchQuery]);

  const selectableMatches = useMemo(() => {
    return fixtures.filter((f) => f.confirmed || f.status === 'Completed' || f.status === 'Live' || f.id === 'pq-malabar');
  }, []);

  const currentMatchFixture = useMemo(() => {
    return fixtures.find((f) => f.id === selectedStatsMatchId) || fixtures[0];
  }, [selectedStatsMatchId]);

  const matchdayPlayerStats = useMemo(() => {
    const fixture = currentMatchFixture;
    if (!fixture) return [];

    const isLiveMatch = matchState?.matchId === fixture.id;
    const events = [...(fixture.events || []), ...(isLiveMatch ? (matchState?.events || []) : [])];
    const motm = fixture.motm || '';

    // Helper to find SFA club id
    const findSfaId = (teamName) => {
      if (!teamName) return null;
      const lower = teamName.toLowerCase().trim();
      const club = participatingTeams.find((c) => {
        const cName = (c.name || '').toLowerCase().trim();
        return cName === lower || cName.includes(lower) || lower.includes(cName);
      });
      return club?.sfaTeamId || null;
    };

    const team1Name = fixture.team1;
    const team2Name = fixture.team2;
    const team1Id = findSfaId(team1Name);
    const team2Id = findSfaId(team2Name);

    const winnerName = fixture.winner || (fixture.score1 > fixture.score2 ? team1Name : fixture.score2 > fixture.score1 ? team2Name : null);

    // Build player array for both teams
    const playersList = [];
    const squadMap = lineupTactics?.squads || {};

    const addTeamPlayers = (teamName, sfaId, isTeam1) => {
      if (!teamName) return;
      const isWinner = winnerName && teamName && winnerName.toLowerCase().includes(teamName.toLowerCase());
      const lower = teamName.toLowerCase();

      // If KRSC
      if (lower.includes('krsc') && squadMap.krsc) {
        const squad = squadMap.krsc;
        const all = [...(squad.starting || []), ...(squad.subs || [])];
        all.forEach((p) => {
          const isStarter = (squad.starting || []).some((s) => s.num === p.num);
          const pName = p.displayName || p.name;
          if (pName && !['none', 'null'].includes(pName.toLowerCase())) {
            playersList.push({
              key: `krsc-${p.num}`,
              name: pName,
              number: p.num,
              position: p.pos || (isStarter ? 'XI' : 'SUB'),
              team: teamName,
              photoUrl: p.photoUrl,
              baseRating: Number(p.baseRating) || 7.0,
              isStarter,
              isWinner
            });
          }
        });
        return;
      }

      // If Base Perumbavur
      if (lower.includes('base') && squadMap.base) {
        const squad = squadMap.base;
        const all = [...(squad.starting || []), ...(squad.subs || [])];
        all.forEach((p) => {
          const isStarter = (squad.starting || []).some((s) => s.num === p.num);
          const pName = p.displayName || p.name;
          if (pName && !['none', 'null'].includes(pName.toLowerCase())) {
            playersList.push({
              key: `base-${p.num}`,
              name: pName,
              number: p.num,
              position: p.pos || (isStarter ? 'XI' : 'SUB'),
              team: teamName,
              photoUrl: p.photoUrl,
              baseRating: Number(p.baseRating) || 7.0,
              isStarter,
              isWinner
            });
          }
        });
        return;
      }

      // From SFA database
      const sfaPlayers = (sfaId && sfaPlayersByTeam[String(sfaId)]) || [];
      if (sfaPlayers.length > 0) {
        sfaPlayers.slice(0, 14).forEach((p, idx) => {
          const num = p.jersey_number || (idx + 1);
          playersList.push({
            key: `sfa-${sfaId}-${p.id || idx}`,
            name: p.name || `Player ${num}`,
            number: num,
            position: p.position || (idx < 7 ? 'XI' : 'SUB'),
            team: teamName,
            photoUrl: p.image_url && !p.image_url.includes('default') ? p.image_url : null,
            baseRating: 7.0,
            isStarter: idx < 7,
            isWinner
          });
        });
      } else {
        // Fallback squad players from squad.js matching club
        const fallback = squadPlayers.filter((p) => p.club && p.club.toLowerCase().includes(teamName.toLowerCase()));
        if (fallback.length > 0) {
          fallback.forEach((p, idx) => {
            playersList.push({
              key: `fallback-${p.id || idx}`,
              name: p.name,
              number: p.number || (idx + 1),
              position: p.position || 'XI',
              team: teamName,
              photoUrl: p.posterUrl,
              baseRating: 7.0,
              isStarter: idx < 7,
              isWinner
            });
          });
        }
      }
    };

    addTeamPlayers(team1Name, team1Id, true);
    addTeamPlayers(team2Name, team2Id, false);

    // Make sure any player in events (goals/cards) or MOTM is in playersList
    events.forEach((ev) => {
      const evName = (ev.player || '').trim();
      if (!evName || ['none', 'null', 'unknown'].includes(evName.toLowerCase())) return;
      const exists = playersList.some((p) => p.name.toLowerCase().includes(evName.toLowerCase()) || evName.toLowerCase().includes(p.name.toLowerCase()));
      if (!exists) {
        playersList.push({
          key: `ev-${evName}`,
          name: evName,
          number: ev.playerNumber || 10,
          position: ev.type === 'goal' ? 'FWD' : 'MID',
          team: ev.team || team1Name,
          photoUrl: null,
          baseRating: 7.5,
          isStarter: true,
          isWinner: winnerName && ev.team ? winnerName.toLowerCase().includes(ev.team.toLowerCase()) : false
        });
      }
    });

    if (motm) {
      const motmPlayerName = motm.split('(')[0].trim();
      if (motmPlayerName && !['none', 'null', 'unknown'].includes(motmPlayerName.toLowerCase())) {
        const exists = playersList.some((p) => p.name.toLowerCase().includes(motmPlayerName.toLowerCase()) || motmPlayerName.toLowerCase().includes(p.name.toLowerCase()));
        if (!exists) {
          playersList.push({
            key: `motm-${motmPlayerName}`,
            name: motmPlayerName,
            number: 10,
            position: 'FWD',
            team: team1Name,
            photoUrl: null,
            baseRating: 8.5,
            isStarter: true,
            isWinner: true
          });
        }
      }
    }

    // Now calculate goals, cards, and realistic rating for each player
    const processed = playersList.map((player) => {
      const pName = (player.name || '').trim().toLowerCase();
      const pNum = String(player.number || '');

      const playerEvents = events.filter((ev) => {
        const evName = (ev.player || '').trim().toLowerCase();
        const evNum = ev.playerNumber != null ? String(ev.playerNumber) : '';
        const sameNum = evNum && evNum === pNum;
        const sameName = evName && (evName === pName || pName.includes(evName) || evName.includes(pName));
        return sameNum || sameName;
      });

      const goals = playerEvents.filter((e) => e.type === 'goal' && !e.isOwnGoal).length;
      const yellowCards = playerEvents.filter((e) => e.type === 'yellow_card').length;
      const redCards = playerEvents.filter((e) => e.type === 'red_card').length;

      const isMotm = Boolean(motm && (motm.toLowerCase().includes(pName) || (pName.length > 3 && motm.toLowerCase().includes(pName.slice(0, 4)))));

      // Calculate realistic match rating
      let rating = player.baseRating || 6.8;
      if (player.isStarter) rating += 0.3;
      if (player.isWinner) rating += 0.4;
      rating += goals * 1.4;
      if (isMotm) rating = Math.max(rating + 1.2, 9.6);
      rating -= yellowCards * 0.5;
      rating -= redCards * 1.5;

      // Clean name: never "None"
      let cleanName = player.name;
      if (!cleanName || ['none', 'null', 'undefined', 'unknown'].includes(cleanName.toLowerCase())) {
        cleanName = `Player #${player.number}`;
      }

      return {
        ...player,
        name: cleanName,
        goals,
        yellowCards,
        redCards,
        isMotm,
        rating: Math.min(Math.max(rating, 6.0), 9.9)
      };
    });

    // Deduplicate by name + team
    const seen = new Set();
    const unique = [];
    for (const p of processed) {
      const key = `${p.team}-${p.name.toLowerCase()}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(p);
      }
    }

    // Sort: MOTM first, then goals desc, then rating desc, then cards
    return unique.sort((a, b) => {
      if (a.isMotm && !b.isMotm) return -1;
      if (!a.isMotm && b.isMotm) return 1;
      if (b.goals !== a.goals) return b.goals - a.goals;
      if (b.rating !== a.rating) return b.rating - a.rating;
      return (b.yellowCards + b.redCards) - (a.yellowCards + a.redCards);
    });
  }, [currentMatchFixture, lineupTactics, matchState]);

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

      {/* 2. Sleek Section Controller: Tab Navigation between Top Players (MVP), Players Directory & Leaderboards */}
      <div className="p-1.5 rounded-2xl bg-surface-light dark:bg-navy-900 border border-surface-border dark:border-navy-700 grid grid-cols-3 gap-1.5">
        <button
          onClick={() => setActiveStatsTab('mvp')}
          className={`min-h-[46px] px-2 py-2 rounded-xl text-[11px] sm:text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95 ${
            activeStatsTab === 'mvp'
              ? 'btn-royal text-white font-black shadow-md ring-2 ring-royal/30'
              : 'text-card-muted hover:text-card-title'
          }`}
        >
          <Crown className={`w-3.5 h-3.5 ${activeStatsTab === 'mvp' ? 'text-gold' : ''}`} />
          <span className="truncate">{lang === 'ml' ? 'ടോപ്പ് താരങ്ങൾ (MVP)' : 'Top Players (MVP)'}</span>
        </button>

        <button
          onClick={() => setActiveStatsTab('players')}
          className={`min-h-[46px] px-2 py-2 rounded-xl text-[11px] sm:text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95 ${
            activeStatsTab === 'players'
              ? 'btn-royal text-white font-black shadow-md ring-2 ring-royal/30'
              : 'text-card-muted hover:text-card-title'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span className="truncate">{lang === 'ml' ? 'മാച്ച് & സ്ക്വാഡ്' : 'Match & Squad'}</span>
        </button>

        <button
          onClick={() => setActiveStatsTab('leaders')}
          className={`min-h-[46px] px-2 py-2 rounded-xl text-[11px] sm:text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95 ${
            activeStatsTab === 'leaders'
              ? 'btn-royal text-white font-black shadow-md ring-2 ring-royal/30'
              : 'text-card-muted hover:text-card-title'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span className="truncate">{lang === 'ml' ? 'ലീഡർബോർഡ്' : 'Standings'}</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* VIEW MVP: CURRENT TOP PLAYERS & MVP LEADERBOARD */}
      {/* ============================================================== */}
      {activeStatsTab === 'mvp' && (
        <section className="space-y-4 animate-fadeIn">
          {/* Header Card */}
          <div className="rounded-3xl p-4 sm:p-5 border border-surface-border dark:border-navy-700 surface-card shadow-card space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border dark:border-navy-700 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl btn-gold text-navy-950 shadow-xs">
                  <Crown className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-black font-sports uppercase tracking-wider text-card-title flex items-center gap-1.5">
                    <span>{lang === 'ml' ? 'ടൂർണ്ണമെന്റ് ടോപ്പ് താരങ്ങൾ' : 'CURRENT TOP PLAYERS'}</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-gold/15 text-gold border border-gold/30">
                      MVP
                    </span>
                  </h3>
                  <p className="text-[11px] text-card-muted">
                    {lang === 'ml' 
                      ? 'ഗോളുകൾ (⚽), മാൻ ഓഫ് ദി മാച്ച് (🏆), MVP ഇംപാക്ട് പോയിന്റുകൾ അടിസ്ഥാനമാക്കി'
                      : 'Ranked by Goals (⚽), Man of the Match (🏆), and Overall MVP Impact Rating'}
                  </p>
                </div>
              </div>

              <span className="shrink-0 px-2.5 py-1 rounded-xl bg-surface-light dark:bg-navy-800 text-[11px] font-mono font-bold text-card-muted border border-surface-border self-start sm:self-center">
                {filteredMvpPlayers.length} {lang === 'ml' ? 'താരങ്ങൾ' : 'players'}
              </span>
            </div>

            {/* Sort & Search Controls */}
            <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
              {/* Sort Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                <button
                  onClick={() => setMvpSortMode('points')}
                  className={`min-h-[36px] px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 active:scale-95 shrink-0 ${
                    mvpSortMode === 'points'
                      ? 'btn-royal text-white font-black shadow-xs'
                      : 'surface-light text-card-muted border border-surface-border dark:border-navy-700 hover:text-card-title'
                  }`}
                >
                  <Star className="w-3.5 h-3.5 text-gold" />
                  <span>{lang === 'ml' ? 'MVP പോയിന്റുകൾ' : 'MVP Points'}</span>
                </button>

                <button
                  onClick={() => setMvpSortMode('goals')}
                  className={`min-h-[36px] px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 active:scale-95 shrink-0 ${
                    mvpSortMode === 'goals'
                      ? 'btn-royal text-white font-black shadow-xs'
                      : 'surface-light text-card-muted border border-surface-border dark:border-navy-700 hover:text-card-title'
                  }`}
                >
                  <span>⚽</span>
                  <span>{lang === 'ml' ? 'കൂടുതൽ ഗോളുകൾ' : 'Most Goals'}</span>
                </button>

                <button
                  onClick={() => setMvpSortMode('motm')}
                  className={`min-h-[36px] px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 active:scale-95 shrink-0 ${
                    mvpSortMode === 'motm'
                      ? 'btn-royal text-white font-black shadow-xs'
                      : 'surface-light text-card-muted border border-surface-border dark:border-navy-700 hover:text-card-title'
                  }`}
                >
                  <span>🏆</span>
                  <span>{lang === 'ml' ? 'മാൻ ഓഫ് ദി മാച്ച്' : 'Most MOTMs'}</span>
                </button>
              </div>

              {/* Search input */}
              <div className="relative min-w-[200px]">
                <Search className="w-3.5 h-3.5 text-card-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={mvpSearchQuery}
                  onChange={(e) => setMvpSearchQuery(e.target.value)}
                  placeholder={lang === 'ml' ? 'പേര് അല്ലെങ്കിൽ ക്ലബ്...' : 'Search player or club...'}
                  className="w-full h-9 pl-8 pr-7 rounded-xl text-xs surface-light text-card-title border border-surface-border dark:border-navy-700 focus:outline-hidden focus:ring-1 focus:ring-royal/40"
                />
                {mvpSearchQuery && (
                  <button
                    onClick={() => setMvpSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-card-muted hover:text-card-title"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Top 3 Podium Cards (when no search query or top 3 available) */}
            {!mvpSearchQuery && filteredMvpPlayers.length >= 3 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                {/* 1st Place (Gold) */}
                {filteredMvpPlayers[0] && (
                  <div className="p-3.5 rounded-2xl bg-gradient-to-b from-amber-500/15 to-transparent border border-amber-500/40 relative space-y-2 order-1 sm:order-2 ring-1 ring-amber-500/20">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-navy-950 uppercase tracking-wider shadow-xs">
                        <Crown className="w-3 h-3" /> #1 Rank
                      </span>
                      <span className="text-xs font-black font-sports text-gold">
                        ⭐ {filteredMvpPlayers[0].points} PTS
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="relative w-12 h-12 rounded-2xl bg-white p-0.5 border-2 border-amber-500/60 overflow-hidden shrink-0 shadow-md">
                        {filteredMvpPlayers[0].photoUrl ? (
                          <img 
                            src={filteredMvpPlayers[0].photoUrl} 
                            alt={filteredMvpPlayers[0].name}
                            className="w-full h-full object-cover rounded-xl"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        ) : (
                          <TeamLogo teamName={filteredMvpPlayers[0].team} className="w-full h-full object-contain p-1" />
                        )}
                        <span className="absolute -top-1 -right-1 text-xs">👑</span>
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-black text-card-title truncate">
                          {filteredMvpPlayers[0].name}
                        </h4>
                        <p className="text-[10px] text-card-muted truncate font-medium flex items-center gap-1">
                          <TeamLogo teamName={filteredMvpPlayers[0].team} className="w-3 h-3 inline object-contain" />
                          <span>{filteredMvpPlayers[0].team}</span>
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 pt-1 text-center text-[10px] font-bold">
                      <div className="p-1.5 rounded-lg bg-surface-card border border-surface-border">
                        <span className="text-card-muted block text-[9px] uppercase">ഗോളുകൾ</span>
                        <span className="text-emerald-400 font-sports font-black text-sm">⚽ {filteredMvpPlayers[0].goals}</span>
                      </div>
                      <div className="p-1.5 rounded-lg bg-surface-card border border-surface-border">
                        <span className="text-card-muted block text-[9px] uppercase">MOTM</span>
                        <span className="text-amber-400 font-sports font-black text-sm">🏆 {filteredMvpPlayers[0].motmCount}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2nd Place (Silver) */}
                {filteredMvpPlayers[1] && (
                  <div className="p-3.5 rounded-2xl bg-gradient-to-b from-slate-400/10 to-transparent border border-slate-400/30 relative space-y-2 order-2 sm:order-1">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                        🥈 #2 Rank
                      </span>
                      <span className="text-xs font-black font-sports text-slate-300">
                        ⭐ {filteredMvpPlayers[1].points} PTS
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="relative w-11 h-11 rounded-2xl bg-white p-0.5 border-2 border-slate-400/40 overflow-hidden shrink-0 shadow-xs">
                        {filteredMvpPlayers[1].photoUrl ? (
                          <img 
                            src={filteredMvpPlayers[1].photoUrl} 
                            alt={filteredMvpPlayers[1].name}
                            className="w-full h-full object-cover rounded-xl"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        ) : (
                          <TeamLogo teamName={filteredMvpPlayers[1].team} className="w-full h-full object-contain p-1" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-black text-card-title truncate">
                          {filteredMvpPlayers[1].name}
                        </h4>
                        <p className="text-[10px] text-card-muted truncate font-medium flex items-center gap-1">
                          <TeamLogo teamName={filteredMvpPlayers[1].team} className="w-3 h-3 inline object-contain" />
                          <span>{filteredMvpPlayers[1].team}</span>
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 pt-1 text-center text-[10px] font-bold">
                      <div className="p-1.5 rounded-lg bg-surface-card border border-surface-border">
                        <span className="text-card-muted block text-[9px] uppercase">ഗോളുകൾ</span>
                        <span className="text-emerald-400 font-sports font-black text-sm">⚽ {filteredMvpPlayers[1].goals}</span>
                      </div>
                      <div className="p-1.5 rounded-lg bg-surface-card border border-surface-border">
                        <span className="text-card-muted block text-[9px] uppercase">MOTM</span>
                        <span className="text-amber-400 font-sports font-black text-sm">🏆 {filteredMvpPlayers[1].motmCount}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3rd Place (Bronze) */}
                {filteredMvpPlayers[2] && (
                  <div className="p-3.5 rounded-2xl bg-gradient-to-b from-amber-700/10 to-transparent border border-amber-700/30 relative space-y-2 order-3">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-800/60 text-amber-200 uppercase tracking-wider">
                        🥉 #3 Rank
                      </span>
                      <span className="text-xs font-black font-sports text-amber-400">
                        ⭐ {filteredMvpPlayers[2].points} PTS
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="relative w-11 h-11 rounded-2xl bg-white p-0.5 border-2 border-amber-700/40 overflow-hidden shrink-0 shadow-xs">
                        {filteredMvpPlayers[2].photoUrl ? (
                          <img 
                            src={filteredMvpPlayers[2].photoUrl} 
                            alt={filteredMvpPlayers[2].name}
                            className="w-full h-full object-cover rounded-xl"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        ) : (
                          <TeamLogo teamName={filteredMvpPlayers[2].team} className="w-full h-full object-contain p-1" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-black text-card-title truncate">
                          {filteredMvpPlayers[2].name}
                        </h4>
                        <p className="text-[10px] text-card-muted truncate font-medium flex items-center gap-1">
                          <TeamLogo teamName={filteredMvpPlayers[2].team} className="w-3 h-3 inline object-contain" />
                          <span>{filteredMvpPlayers[2].team}</span>
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 pt-1 text-center text-[10px] font-bold">
                      <div className="p-1.5 rounded-lg bg-surface-card border border-surface-border">
                        <span className="text-card-muted block text-[9px] uppercase">ഗോളുകൾ</span>
                        <span className="text-emerald-400 font-sports font-black text-sm">⚽ {filteredMvpPlayers[2].goals}</span>
                      </div>
                      <div className="p-1.5 rounded-lg bg-surface-card border border-surface-border">
                        <span className="text-card-muted block text-[9px] uppercase">MOTM</span>
                        <span className="text-amber-400 font-sports font-black text-sm">🏆 {filteredMvpPlayers[2].motmCount}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Full Table / Card List */}
          <div className="rounded-3xl p-4 sm:p-5 border border-surface-border dark:border-navy-700 surface-card shadow-card space-y-3">
            <div className="flex items-center justify-between gap-2 border-b border-surface-border dark:border-navy-700 pb-2.5">
              <h4 className="text-xs font-black font-sports uppercase tracking-wider text-card-title">
                {lang === 'ml' ? 'മുഴുവൻ താരങ്ങളുടെ ലീഡർബോർഡ്' : 'COMPLETE TOURNAMENT LEADERBOARD'}
              </h4>
              <span className="text-[10px] text-card-muted">
                {mvpSortMode === 'goals' 
                  ? (lang === 'ml' ? 'ഗോളുകൾ മുൻഗണനയിൽ' : 'Sorted by Goals') 
                  : mvpSortMode === 'motm' 
                  ? (lang === 'ml' ? 'MOTM മുൻഗണനയിൽ' : 'Sorted by MOTMs') 
                  : (lang === 'ml' ? 'MVP റേറ്റിംഗ് മുൻഗണനയിൽ' : 'Sorted by MVP Impact Rating')}
              </span>
            </div>

            {filteredMvpPlayers.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <Users className="w-8 h-8 text-card-muted mx-auto" />
                <p className="text-xs font-bold text-card-title">
                  {lang === 'ml' ? 'താരങ്ങളെ കണ്ടെത്തിയില്ല' : 'No players found'}
                </p>
                {mvpSearchQuery && (
                  <button
                    onClick={() => setMvpSearchQuery('')}
                    className="text-[11px] text-royal dark:text-sky underline font-bold"
                  >
                    Clear search filter
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-1.5">
                {(showAllMvp ? filteredMvpPlayers : filteredMvpPlayers.slice(0, 10)).map((player, idx) => {
                  const rank = idx + 1;
                  return (
                    <div
                      key={`${player.team}-${player.name}-${idx}`}
                      className={`flex items-center gap-2.5 p-2.5 rounded-2xl surface-light border transition ${
                        rank === 1
                          ? 'border-amber-500/60 bg-amber-500/5 shadow-2xs'
                          : rank === 2
                          ? 'border-slate-400/40 bg-slate-500/5'
                          : rank === 3
                          ? 'border-amber-700/40 bg-amber-700/5'
                          : 'border-surface-border dark:border-navy-700/80 hover:border-royal/40'
                      }`}
                    >
                      {/* Rank Number */}
                      <div className="w-7 text-center shrink-0">
                        {rank === 1 ? (
                          <span className="w-6 h-6 rounded-lg bg-amber-500 text-navy-950 font-black font-sports text-xs inline-flex items-center justify-center shadow-xs">
                            1
                          </span>
                        ) : rank === 2 ? (
                          <span className="w-6 h-6 rounded-lg bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-black font-sports text-xs inline-flex items-center justify-center">
                            2
                          </span>
                        ) : rank === 3 ? (
                          <span className="w-6 h-6 rounded-lg bg-amber-800/80 text-amber-200 font-black font-sports text-xs inline-flex items-center justify-center">
                            3
                          </span>
                        ) : (
                          <span className="text-xs font-black font-sports text-card-muted">
                            #{rank}
                          </span>
                        )}
                      </div>

                      {/* Photo / Avatar */}
                      <div className="relative w-10 h-10 rounded-full bg-white border border-surface-border dark:border-navy-700 overflow-hidden shrink-0 flex items-center justify-center shadow-2xs">
                        {player.photoUrl ? (
                          <img 
                            src={player.photoUrl} 
                            alt="" 
                            className="w-full h-full object-cover" 
                            onError={(e) => { e.currentTarget.style.display = 'none'; }} 
                          />
                        ) : (
                          <TeamLogo teamName={player.team} className="w-6 h-6 object-contain" />
                        )}
                        {player.motmCount > 0 && (
                          <span className="absolute -top-1 -right-1 text-[10px]">👑</span>
                        )}
                      </div>

                      {/* Name & Club */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="text-xs font-black text-card-title truncate">
                            {player.name}
                          </p>
                          {player.badge && (
                            <span className="px-1.5 py-0.2 rounded-md text-[9px] font-black bg-gold/15 text-gold border border-gold/30 shrink-0">
                              {player.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-card-muted truncate flex items-center gap-1 mt-0.5">
                          <TeamLogo teamName={player.team} className="w-3 h-3 inline object-contain shrink-0" />
                          <span className="truncate">{player.team}</span>
                          <span className="text-card-muted/60">•</span>
                          <span className="shrink-0">{player.matchesCount} {lang === 'ml' ? 'മത്സരം' : 'matches'}</span>
                        </p>
                      </div>

                      {/* Metrics: Goals, MOTM, MVP Points */}
                      <div className="flex items-center gap-1.5 shrink-0 text-[10px] font-black">
                        {/* Goals */}
                        <div 
                          title="Total Goals"
                          className={`px-2 py-1 rounded-lg flex items-center gap-1 ${
                            player.goals > 0 
                              ? 'bg-emerald-500/20 text-emerald-400 font-black' 
                              : 'bg-surface-card text-card-muted'
                          }`}
                        >
                          <span>⚽</span>
                          <span className="font-sports text-xs">{player.goals}</span>
                        </div>

                        {/* MOTM */}
                        <div 
                          title="Man of the Match awards"
                          className={`px-2 py-1 rounded-lg flex items-center gap-1 ${
                            player.motmCount > 0 
                              ? 'bg-amber-500/20 text-amber-400 font-black ring-1 ring-amber-500/30' 
                              : 'bg-surface-card text-card-muted'
                          }`}
                        >
                          <span>🏆</span>
                          <span className="font-sports text-xs">{player.motmCount}</span>
                        </div>

                        {/* Total MVP Points */}
                        <div 
                          title="Overall MVP Impact Points"
                          className="min-w-[48px] text-center px-2 py-1 rounded-lg btn-royal text-white font-black font-sports text-xs shadow-xs"
                        >
                          {player.points} <span className="text-[8px] font-sans font-bold opacity-80">PTS</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {filteredMvpPlayers.length > 10 && (
              <button 
                type="button" 
                onClick={() => setShowAllMvp((v) => !v)} 
                className="w-full min-h-10 rounded-xl bg-surface-light dark:bg-navy-800 text-xs font-bold text-royal dark:text-sky hover:bg-surface-subtle transition flex items-center justify-center gap-1"
              >
                <span>
                  {showAllMvp 
                    ? (lang === 'ml' ? 'കുറച്ച് കാണിക്കുക' : 'Show less') 
                    : (lang === 'ml' ? `എല്ലാ ${filteredMvpPlayers.length} താരങ്ങളെയും കാണുക` : `Show all ${filteredMvpPlayers.length} players`)}
                </span>
                {showAllMvp ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            )}

            {/* Explanatory Scoring Note */}
            <div className="p-3 rounded-2xl bg-surface-light/60 dark:bg-navy-800/40 border border-surface-border text-[11px] text-card-muted flex items-center gap-2">
              <Info className="w-4 h-4 text-royal dark:text-sky shrink-0" />
              <span>
                {lang === 'ml'
                  ? 'MVP കണക്കുകൂട്ടൽ രീതി: ഗോൾ = +3 PTS, മാൻ ഓഫ് ദി മാച്ച് = +5 PTS, മഞ്ഞ കാർഡ് = -1 PTS, ചുവപ്പ് കാർഡ് = -3 PTS'
                  : 'MVP Scoring: Goal = +3 pts | Man of the Match = +5 pts | Yellow Card = -1 pt | Red Card = -3 pts'}
              </span>
            </div>
          </div>
        </section>
      )}

      {activeStatsTab === 'players' && (
        <section className="rounded-3xl p-4 sm:p-5 border border-surface-border dark:border-navy-700 surface-card shadow-card space-y-3.5">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 border-b border-surface-border dark:border-navy-700 pb-3">
            <div className="min-w-0">
              <h3 className="text-sm font-black font-sports uppercase tracking-wider text-card-title">
                {lang === 'ml' ? 'മാച്ച് പ്ലെയർ സ്റ്റാറ്റ്സ് & റേറ്റിംഗ്' : 'MATCH PLAYER STATS'}
              </h3>
              <p className="text-[10px] text-card-muted">
                {currentMatchFixture ? `${currentMatchFixture.team1} vs ${currentMatchFixture.team2}` : 'Goals, cards and performance ratings'}
              </p>
            </div>
            <span className="shrink-0 px-2 py-1 rounded-lg bg-surface-light dark:bg-navy-800 text-[10px] font-bold text-card-muted">
              {matchdayPlayerStats.length} {lang === 'ml' ? 'താരങ്ങൾ' : 'players'}
            </span>
          </div>

          {/* Matchday Selector Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto horizontal-scroll-container pb-1 pt-0.5 -mx-1 px-1">
            {selectableMatches.map((m, idx) => {
              const isSelected = selectedStatsMatchId === m.id || (!selectedStatsMatchId && idx === 0);
              const t1Short = (m.team1 || '').split(' ')[0];
              const t2Short = (m.team2 || '').split(' ')[0];
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    setSelectedStatsMatchId(m.id);
                    setShowAllPerformance(false);
                  }}
                  className={`min-h-[34px] px-2.5 py-1 rounded-xl text-[11px] font-bold shrink-0 transition active:scale-95 flex items-center gap-1.5 ${
                    isSelected
                      ? 'btn-royal text-white font-black shadow-xs'
                      : 'surface-light text-card-title border border-surface-border dark:border-navy-700 hover:border-royal/50'
                  }`}
                >
                  <span className="font-sports font-black">M{idx + 1}</span>
                  <span className="text-[10px] text-card-muted truncate max-w-[85px]">{t1Short} vs {t2Short}</span>
                </button>
              );
            })}
          </div>

          {/* Selected Match Overview Banner */}
          {currentMatchFixture && (
            <div className="p-3 rounded-2xl bg-surface-light dark:bg-navy-800/60 border border-surface-border dark:border-navy-700/80 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex items-center -space-x-2 shrink-0">
                    <div className="w-7 h-7 rounded-full bg-white p-0.5 border border-surface-border shadow-2xs z-10">
                      <TeamLogo teamName={currentMatchFixture.team1} className="w-full h-full object-contain" />
                    </div>
                    <div className="w-7 h-7 rounded-full bg-white p-0.5 border border-surface-border shadow-2xs">
                      <TeamLogo teamName={currentMatchFixture.team2} className="w-full h-full object-contain" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-black font-sports text-card-title truncate">
                      {currentMatchFixture.team1} vs {currentMatchFixture.team2}
                    </h4>
                    <p className="text-[10px] text-card-muted font-medium">
                      {currentMatchFixture.date} • {currentMatchFixture.time || '9:00 PM'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-xs font-mono font-black text-card-title px-2 py-0.5 rounded-lg bg-surface-card border border-surface-border">
                    {currentMatchFixture.score1 != null && currentMatchFixture.score2 != null
                      ? `${currentMatchFixture.score1} - ${currentMatchFixture.score2}${currentMatchFixture.penaltyScore ? ` (${currentMatchFixture.penaltyScore})` : ''}`
                      : 'Upcoming'}
                  </span>
                  <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    currentMatchFixture.status === 'Completed' || (currentMatchFixture.score1 != null && currentMatchFixture.score2 != null)
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-surface-subtle text-card-muted border border-surface-border'
                  }`}>
                    {currentMatchFixture.status === 'Completed' ? 'FT' : currentMatchFixture.status || 'FT'}
                  </span>
                </div>
              </div>

              {currentMatchFixture.motm && (
                <div className="flex items-center gap-1.5 pt-1.5 border-t border-surface-border/60 dark:border-navy-700/60 text-[11px] text-gold font-bold">
                  <span>🏆</span>
                  <span className="font-sports uppercase text-[10px] text-card-muted">Man of the Match:</span>
                  <span className="truncate">{currentMatchFixture.motm}</span>
                </div>
              )}
            </div>
          )}

          {/* Player Cards */}
          <div className="space-y-1.5">
            {(showAllPerformance ? matchdayPlayerStats : matchdayPlayerStats.slice(0, 6)).map((player) => (
              <div 
                key={player.key || `${player.team}-${player.number}-${player.name}`} 
                className={`flex items-center gap-2.5 p-2 rounded-xl surface-light border transition min-w-0 ${
                  player.isMotm 
                    ? 'border-amber-500/60 bg-amber-500/5 shadow-2xs' 
                    : 'border-surface-border dark:border-navy-700'
                }`}
              >
                <div className="relative w-9 h-9 rounded-full bg-white border border-surface-border dark:border-navy-700 overflow-hidden shrink-0 flex items-center justify-center">
                  {player.photoUrl ? (
                    <img 
                      src={player.photoUrl} 
                      alt="" 
                      className="w-full h-full object-cover" 
                      onError={(e) => { e.currentTarget.style.display = 'none'; }} 
                    />
                  ) : (
                    <TeamLogo teamName={player.team} className="w-6 h-6 object-contain" />
                  )}
                  {player.isMotm && (
                    <span className="absolute -top-1 -right-1 text-[10px]">👑</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-card-title truncate">#{player.number} {player.name}</p>
                    {player.isMotm && (
                      <span className="px-1.5 py-0.2 rounded text-[8px] font-black bg-amber-500 text-navy-950 uppercase tracking-wider shrink-0 shadow-2xs">
                        MOTM
                      </span>
                    )}
                  </div>
                  <p className="text-[9px] text-card-muted truncate">{player.team} · {player.position}{player.isStarter ? ' · XI' : ' · SUB'}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 text-[10px] font-black">
                  <span className={`px-1.5 py-1 rounded-md ${player.goals > 0 ? 'bg-emerald-500/20 text-emerald-500 font-black' : 'bg-surface-card text-card-muted'}`}>
                    ⚽ {player.goals}
                  </span>
                  <span className={`px-1.5 py-1 rounded-md ${player.yellowCards > 0 ? 'bg-amber-500/20 text-amber-500 font-black' : 'bg-surface-card text-card-muted'}`}>
                    🟨 {player.yellowCards}
                  </span>
                  <span className={`px-1.5 py-1 rounded-md ${player.redCards > 0 ? 'bg-rose-500/20 text-rose-500 font-black' : 'bg-surface-card text-card-muted'}`}>
                    🟥 {player.redCards}
                  </span>
                  <span title="Lineup rating" className={`w-11 text-center px-1 py-1 rounded-md ${
                    player.isMotm 
                      ? 'bg-amber-500/20 text-amber-500 font-black ring-1 ring-amber-500/40' 
                      : 'bg-sky-500/10 text-sky-700 dark:text-sky-300'
                  }`}>
                    ⭐ {player.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {matchdayPlayerStats.length > 6 && (
            <button 
              type="button" 
              onClick={() => setShowAllPerformance((value) => !value)} 
              className="w-full min-h-10 rounded-xl bg-surface-light dark:bg-navy-800 text-xs font-bold text-royal dark:text-sky hover:bg-surface-subtle transition"
            >
              {showAllPerformance 
                ? (lang === 'ml' ? 'കുറച്ച് കാണിക്കുക' : 'Show less') 
                : (lang === 'ml' ? `എല്ലാ താരങ്ങളെയും കാണുക (${matchdayPlayerStats.length})` : `Show all match players (${matchdayPlayerStats.length})`)}
            </button>
          )}
        </section>
      )}

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
                        <span>Red Card</span>
                        <span className="font-mono bg-black/20 px-1 rounded-xs">{disc.latestCard?.minute}'</span>
                      </span>
                    )}
                    {disc.hasYellowCard && !disc.hasRedCard && (
                      <span className="px-2 py-1 rounded-lg bg-amber-500 text-navy-950 font-black text-[10px] flex items-center gap-1 shrink-0 shadow-xs">
                        <span>🟨</span>
                        <span>Yellow Card</span>
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
