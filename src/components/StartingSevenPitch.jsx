import React, { useState, useEffect, useMemo } from 'react';
import { 
  Trophy, 
  X, 
  Info,
  Calendar,
  AlertTriangle,
  ShieldAlert,
  Star,
  Award,
  Sparkles,
  Flame,
  ChevronDown
} from 'lucide-react';
import TeamLogo from './TeamLogo';
import { getStoredMatchState } from '../utils/matchStateManager';
import { 
  getPlayerDisciplinaryStatus, 
  getAllDisciplinaryRecords,
  normalizePlayerName,
  isPlayerMatch
} from '../utils/disciplinaryManager';
import { 
  getLineupTactics, 
  SEVENS_FORMATIONS, 
  DEFAULT_TOURNAMENT_SQUADS 
} from '../utils/lineupManager';
import { SHOW_LINEUPS } from '../config/siteConfig';
import { openingMatch } from '../data/tournamentData';

// Fallback Opening Match & Tournament Squads
export const TOURNAMENT_SQUADS = DEFAULT_TOURNAMENT_SQUADS;
export function JerseyShirtIcon({ 
  number, 
  color = '#1D4ED8', 
  numberColor = '#FFFFFF', 
  isGK = false, 
  captain = false,
  hasRedCard = false,
  className = "w-10 h-10"
}) {
  const shirtFill = isGK ? '#D97706' : color;
  const collarColor = isGK ? '#B45309' : '#0F172A';

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className} ${hasRedCard ? 'opacity-75' : ''}`}>
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full drop-shadow-md select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Shirt Body with Sleeves */}
        <path
          d="M 32 16 L 12 34 L 24 46 L 34 38 L 34 84 L 66 84 L 66 38 L 76 46 L 88 34 L 68 16 C 62 25 38 25 32 16 Z"
          fill={shirtFill}
          stroke={hasRedCard ? '#DC2626' : '#FFFFFF'}
          strokeWidth={hasRedCard ? '4' : '3'}
          strokeLinejoin="round"
        />
        {/* Collar Accent */}
        <path
          d="M 38 18 C 44 26 56 26 62 18"
          fill="none"
          stroke={collarColor}
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Drawn Jersey Number */}
        <text
          x="50"
          y="62"
          textAnchor="middle"
          fontSize="30"
          fontWeight="900"
          fontFamily="monospace, sans-serif"
          fill={numberColor}
        >
          {number}
        </text>
      </svg>

      {/* Small Captain "C" Badge */}
      {captain && (
        <span 
          className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-gold text-navy-900 text-[9px] font-black font-sports flex items-center justify-center border border-white shadow-2xs z-10"
          title="Team Captain"
        >
          C
        </span>
      )}
    </div>
  );
}

// Available 7-a-side formations (Notation excludes Goalkeeper: 6 outfielders)
export { SEVENS_FORMATIONS };

/**
 * 7-A-Side Dynamic Formation Coordinates Generator
 * Calculates balanced percentage coordinates (X, Y) for 7 players on each half.
 * Home Team (Upper Half): Y ranges 8% (GK) to 43% (Attackers).
 * Away Team (Lower Half): Y ranges 57% (Attackers) to 92% (GK).
 */
export function getSevensFormationPositions(formationStr = '2-2-2', side = 'home') {
  const lines = (formationStr || '2-2-2').split('-').map(Number).filter(n => !isNaN(n) && n > 0);
  const totalOutfield = lines.reduce((sum, n) => sum + n, 0);
  const validLines = totalOutfield === 6 ? lines : [2, 2, 2];

  const positions = [];

  const getXs = (count) => {
    if (count === 1) return [50];
    if (count === 2) return [28, 72];
    if (count === 3) return [18, 50, 82];
    if (count === 4) return [14, 38, 62, 86];
    return [50];
  };

  if (side === 'home') {
    // HOME: GK at top, lines progressing down towards center line (Y: 50%)
    positions.push({ role: 'GK', x: 50, y: 8 });
    const numLines = validLines.length;
    const yStep = 24 / Math.max(1, numLines - 1);

    validLines.forEach((count, lineIdx) => {
      const y = numLines === 1 ? 30 : Math.round(19 + lineIdx * yStep);
      const xs = getXs(count);
      xs.forEach((x) => {
        const role = lineIdx === 0 ? 'DEF' : lineIdx === numLines - 1 ? 'FWD' : 'MID';
        positions.push({ role, x, y });
      });
    });
  } else {
    // AWAY: Attackers at Y: 57%, Midfielders at Y: 69%, Defenders at Y: 81%, GK at Y: 92%
    const numLines = validLines.length;
    const yStep = 24 / Math.max(1, numLines - 1);

    validLines.slice().reverse().forEach((count, lineIdx) => {
      const originalIdx = numLines - 1 - lineIdx;
      const y = numLines === 1 ? 70 : Math.round(57 + lineIdx * yStep);
      const xs = getXs(count);
      xs.forEach((x) => {
        const role = originalIdx === 0 ? 'DEF' : originalIdx === numLines - 1 ? 'FWD' : 'MID';
        positions.push({ role, x, y });
      });
    });

    // Goalkeeper at bottom goal
    positions.push({ role: 'GK', x: 50, y: 92 });
  }

  return positions;
}

// Helper to match an event with a squad player safely across all variations
function matchesPlayer(evt, player, teamKey) {
  if (!evt || !player) return false;

  // 1. Team check (prevent cross-team pollution)
  if (evt.team) {
    const isHome = teamKey === 'krsc';
    const isEvtHome = evt.team === 'home' || evt.team === 'krsc' || (evt.teamName && evt.teamName.toLowerCase().includes('krsc'));
    const isEvtAway = evt.team === 'away' || evt.team === 'base' || (evt.teamName && evt.teamName.toLowerCase().includes('base'));
    if (isHome && isEvtAway) return false;
    if (!isHome && isEvtHome) return false;
  }

  // 2. Check by Jersey Number (if both have number)
  const evtNum = evt.playerNumber || evt.num;
  if (evtNum && player.num && String(evtNum) === String(player.num)) {
    return true;
  }

  // 3. Normalized Name Matching
  const evtName = normalizePlayerName(evt.player || evt.playerName || evt.scorerName || '');
  const targetName = normalizePlayerName(player.name || '');
  if (!evtName || !targetName) return false;

  // Exact or Substring
  if (evtName === targetName || evtName.includes(targetName) || targetName.includes(evtName)) {
    return true;
  }

  // Token match (e.g. "Vahid" matching "Abdul Vahid C", "Ashik" matching "Ashik Usman")
  const evtTokens = evtName.split(' ').filter(t => t.length >= 3);
  const targetTokens = targetName.split(' ').filter(t => t.length >= 3);
  const hasSharedToken = evtTokens.some(t => targetTokens.includes(t));
  if (hasSharedToken) {
    return true;
  }

  return false;
}

// Maps 7 squad players into 7 formation coordinate slots by tactical positions
function mapSquadToPositions(squad, positions, side = 'home') {
  const gk = squad.starting.find(p => p.isGK || p.pos === 'GK') || squad.starting[0];
  const outfielders = squad.starting.filter(p => p !== gk);
  
  const roleCategory = (pos) => {
    if (['CB', 'RB', 'LB', 'SW', 'DEF'].includes(pos)) return 'DEF';
    if (['CM', 'AM', 'MF', 'MID', 'DM', 'LM', 'RM'].includes(pos)) return 'MID';
    if (['ST', 'CF', 'WF', 'FWD', 'LW', 'RW', 'SS'].includes(pos)) return 'FWD';
    return 'MID';
  };

  const gkSlot = positions.find(pos => pos.role === 'GK') || positions[0];
  const outfieldSlots = positions.filter(pos => pos.role !== 'GK');

  // Order outfieldSlots from DEF (closest to team's own goal) to FWD (closest to halfway line)
  // For 'home': own goal is at top (y = 8), so DEF is smaller y, FWD is larger y
  // For 'away': own goal is at bottom (y = 92), so DEF is larger y, FWD is smaller y
  const sortedOutfieldSlots = [...outfieldSlots].sort((a, b) => {
    if (side === 'home') {
      return a.y - b.y;
    } else {
      return b.y - a.y;
    }
  });

  // Group players by category: DEF, MID, FWD
  const defPlayers = [];
  const midPlayers = [];
  const fwdPlayers = [];

  outfielders.forEach(p => {
    const cat = roleCategory(p.pos);
    if (cat === 'DEF') defPlayers.push(p);
    else if (cat === 'MID') midPlayers.push(p);
    else fwdPlayers.push(p);
  });

  // For forwards: order WF first (so WF can take wide/attacking midfield slot if midfield has fewer players),
  // then ST, then CF (so CF takes the frontline attacking slot!)
  const sortedFwd = [...fwdPlayers].sort((a, b) => {
    if (a.pos === 'WF' && b.pos !== 'WF') return -1;
    if (b.pos === 'WF' && a.pos !== 'WF') return 1;
    if (a.pos === 'ST' && b.pos === 'CF') return -1;
    if (b.pos === 'ST' && a.pos === 'CF') return 1;
    return 0;
  });

  const tacticallyOrderedPlayers = [...defPlayers, ...midPlayers, ...sortedFwd];

  const result = [];
  if (gk) result.push({ player: gk, posData: gkSlot });

  tacticallyOrderedPlayers.forEach((player, idx) => {
    const slot = sortedOutfieldSlots[idx] || { x: 50, y: side === 'home' ? 30 : 70 };
    result.push({ player, posData: slot });
  });

  return result;
}

export default function StartingSevenPitch({ lang, isDarkMode }) {
  const [activePlayer, setActivePlayer] = useState(null);
  const [matchState, setMatchState] = useState(getStoredMatchState);
  const [matchEvents, setMatchEvents] = useState([]);
  const [disciplinaryCards, setDisciplinaryCards] = useState(() => getAllDisciplinaryRecords());
  const [lineupTactics, setLineupTactics] = useState(getLineupTactics);
  const [showSubstitutes, setShowSubstitutes] = useState(false);

  // Synchronize with Match State, Disciplinary DB, and Lineup Tactics
  useEffect(() => {
    const syncAll = () => {
      const currentState = getStoredMatchState();
      setMatchState(currentState);
      setMatchEvents([...(currentState?.events || [])]);
      setDisciplinaryCards([...getAllDisciplinaryRecords()]);
      setLineupTactics(getLineupTactics());
    };

    syncAll();

    window.addEventListener('kasc_match_state_updated', syncAll);
    window.addEventListener('kasc_disciplinary_updated', syncAll);
    window.addEventListener('kasc_lineup_tactics_updated', syncAll);

    const handleStorage = (e) => {
      if (
        !e.key || 
        e.key === 'kasc_official_match_state_v2' || 
        e.key === 'kasc_player_disciplinary_records_v1' ||
        e.key === 'kasc_lineup_tactics_v1'
      ) {
        syncAll();
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('kasc_match_state_updated', syncAll);
      window.removeEventListener('kasc_disciplinary_updated', syncAll);
      window.removeEventListener('kasc_lineup_tactics_updated', syncAll);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  if (!SHOW_LINEUPS) return null;

  // Formations and squads strictly governed by Admin Desk
  const homeFormation = lineupTactics?.formations?.home || '2-2-2';
  const awayFormation = lineupTactics?.formations?.away || '2-2-2';
  const krscSquad = lineupTactics?.squads?.krsc || DEFAULT_TOURNAMENT_SQUADS.krsc;
  const baseSquad = lineupTactics?.squads?.base || DEFAULT_TOURNAMENT_SQUADS.base;
  const manOfTheMatch = lineupTactics?.manOfTheMatch;

  // Helper to compute goals & cards strictly from REAL MATCH EVENTS & DISCIPLINARY DB
  const getPlayerStatsAndDisciplinary = (playerOrName, teamKey = 'krsc') => {
    const playerObj = typeof playerOrName === 'object' && playerOrName !== null
      ? playerOrName
      : { name: playerOrName, num: null };

    let goals = 0;
    let yellowCardsCount = 0;
    let redCardsCount = 0;
    let latestCard = null;

    (matchEvents || []).forEach((evt) => {
      if (matchesPlayer(evt, playerObj, teamKey)) {
        if (evt.type === 'goal') {
          goals += 1;
        } else if (evt.type === 'red_card' || evt.type === 'red') {
          redCardsCount += 1;
          if (!latestCard || latestCard.cardType !== 'red_card') {
            latestCard = {
              minute: evt.minute || 1,
              reason: evt.text || 'Red Card Dismissal',
              cardType: 'red_card'
            };
          }
        } else if (evt.type === 'yellow_card' || evt.type === 'yellow') {
          yellowCardsCount += 1;
          if (!latestCard) {
            latestCard = {
              minute: evt.minute || 1,
              reason: evt.text || 'Caution',
              cardType: 'yellow_card'
            };
          }
        }
      }
    });

    const clubName = teamKey === 'base' ? baseSquad.name : krscSquad.name;
    const disciplinary = getPlayerDisciplinaryStatus(playerObj.name, playerObj.num, clubName);
    if (disciplinary.hasRedCard) {
      redCardsCount = Math.max(redCardsCount, disciplinary.redCardsCount || 1);
      if (!latestCard || latestCard.cardType !== 'red_card') {
        latestCard = disciplinary.latestCard || latestCard;
      }
    }
    if (disciplinary.hasYellowCard) {
      yellowCardsCount = Math.max(yellowCardsCount, disciplinary.yellowCardsCount || 1);
      if (!latestCard) {
        latestCard = disciplinary.latestCard;
      }
    }

    const hasRedCard = redCardsCount > 0 || yellowCardsCount >= 2;
    const hasYellowCard = yellowCardsCount > 0 && !hasRedCard;
    const isSuspended = hasRedCard;

    return {
      goals,
      hasRedCard,
      hasYellowCard,
      redCardsCount,
      yellowCardsCount,
      isSuspended,
      latestCard,
      disciplinary
    };
  };

  // Generate tactical coordinates for both teams
  const homePositions = useMemo(() => getSevensFormationPositions(homeFormation, 'home'), [homeFormation]);
  const awayPositions = useMemo(() => getSevensFormationPositions(awayFormation, 'away'), [awayFormation]);

  // Positioned player nodes
  const homePositionedPlayers = useMemo(() => mapSquadToPositions(krscSquad, homePositions, 'home'), [krscSquad, homePositions]);
  const awayPositionedPlayers = useMemo(() => mapSquadToPositions(baseSquad, awayPositions, 'away'), [baseSquad, awayPositions]);

  // Winning team / Leader computation
  const leadingTeam = useMemo(() => {
    const homeScore = matchState?.officialScoreHome ?? 0;
    const awayScore = matchState?.officialScoreAway ?? 0;
    if (homeScore > awayScore) {
      return {
        ...krscSquad,
        scoreHome: homeScore,
        scoreAway: awayScore,
        side: 'home'
      };
    } else if (awayScore > homeScore) {
      return {
        ...baseSquad,
        scoreHome: homeScore,
        scoreAway: awayScore,
        side: 'away'
      };
    }
    return null;
  }, [matchState, krscSquad, baseSquad]);

  const isMatchFinished = matchState?.status === 'FULL_TIME' || matchState?.status === 'COMPLETED';

  return (
    <section id="pitch-lineup" className="rounded-3xl border border-surface-border dark:border-navy-700 surface-card p-3 sm:p-6 shadow-card space-y-6">
      {/* 1. Header with Match Details & 7-A-Side Confirmation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border dark:border-navy-700 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-mono font-black text-[10px] uppercase shadow-xs">
              7-A-SIDE BATTLE
            </span>
            <span className="text-xs text-card-muted font-bold">
              14 PLAYERS ON TURF
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black font-sports uppercase tracking-wider text-card-title leading-tight mt-1">
            {lang === 'ml' ? 'സ്റ്റാർട്ടിംഗ് 7 ലൈനപ്പ്' : 'STARTING 7 LINEUPS'}
          </h3>
          <p className="text-xs text-card-muted font-medium mt-0.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span>
              {lang === 'ml' ? 'ഇരു ടീമുകളുടെയും ലൈനപ്പ് സ്ഥിരീകരിച്ചു (06 Nov 7:00 PM)' : 'Confirmed Official Lineups (06 Nov 7:00 PM)'}
            </span>
          </p>
        </div>

        {/* Legend Row */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-card-muted font-sports font-semibold bg-surface-light dark:bg-navy-800 px-3 py-1.5 rounded-2xl border border-surface-border dark:border-navy-700">
          <span className="flex items-center gap-1">
            <span className="text-xs">⚽</span>
            <span>Goal</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-3.5 rounded-xs bg-amber-400 inline-block border border-amber-600" />
            <span>Yellow</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-3.5 rounded-xs bg-rose-600 inline-block border border-rose-700" />
            <span>Red</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3.5 h-3.5 rounded-full bg-gold text-navy-900 text-[8px] font-black inline-flex items-center justify-center">C</span>
            <span>Captain</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="px-1 py-0.2 rounded-md bg-emerald-600 text-white text-[8px] font-mono font-bold">8.8</span>
            <span>Rating</span>
          </span>
        </div>
      </div>

      {/* 2. Official Match Formations (Governed by Referee / Committee Admin) */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4 p-2 sm:p-2.5 rounded-2xl bg-surface-light dark:bg-navy-800 border border-surface-border dark:border-navy-700">
        {/* KRSC Kozhikkode (Home Team - Upper Half) */}
        <div className="flex items-center justify-between gap-1 sm:gap-2 p-1.5 sm:p-2 rounded-xl bg-surface-card border border-surface-border dark:border-navy-700">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white p-0.5 border border-surface-border shadow-xs flex items-center justify-center shrink-0">
              <TeamLogo teamName={krscSquad.name} className="w-full h-full object-contain rounded-full" />
            </div>
            <div className="min-w-0 leading-tight">
              <span className="text-[11px] sm:text-xs font-black font-sports text-card-title block">KRSC</span>
              <span className="text-[8px] sm:text-[9px] text-amber-500 font-bold uppercase block">TOP</span>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-1">
            <span className="px-2 py-0.5 text-[11px] sm:text-xs font-black font-mono rounded-lg bg-surface-light dark:bg-navy-900 border border-surface-border dark:border-navy-700 text-card-title shadow-2xs" title="Official Formation (Set by Committee Admin)">
              {homeFormation}
            </span>
          </div>
        </div>

        {/* BASE Perumbavur (Away Team - Lower Half) */}
        <div className="flex items-center justify-between gap-1 sm:gap-2 p-1.5 sm:p-2 rounded-xl bg-surface-card border border-surface-border dark:border-navy-700">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white p-0.5 border border-surface-border shadow-xs flex items-center justify-center shrink-0">
              <TeamLogo teamName={baseSquad.name} className="w-full h-full object-contain rounded-full" />
            </div>
            <div className="min-w-0 leading-tight">
              <span className="text-[11px] sm:text-xs font-black font-sports text-card-title block">BASE</span>
              <span className="text-[8px] sm:text-[9px] text-blue-500 font-bold uppercase block">BOT</span>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-1">
            <span className="px-2 py-0.5 text-[11px] sm:text-xs font-black font-mono rounded-lg bg-surface-light dark:bg-navy-900 border border-surface-border dark:border-navy-700 text-card-title shadow-2xs" title="Official Formation (Set by Committee Admin)">
              {awayFormation}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Professional Vertical 7-A-Side Tactical Turf Pitch (Both Teams on Turf) */}
      <div 
        className="relative w-full max-w-xl mx-auto rounded-3xl overflow-hidden shadow-2xl border-2 border-emerald-900 select-none h-[640px] sm:h-[720px]"
        style={{
          background: 'repeating-linear-gradient(to bottom, #23593b 0px, #23593b 35px, #276442 35px, #276442 70px)'
        }}
      >
        {/* Stadium Floodlight Radial Spotlight Glow */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, rgba(56, 189, 248, 0.08) 0%, rgba(0, 0, 0, 0.35) 100%)'
          }}
        />

        {/* Clean SVG Pitch Field Markings (Rule 3) */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none" 
          viewBox="0 0 100 145" 
          preserveAspectRatio="none"
        >
          {/* Outer Boundary Touchlines */}
          <rect x="4" y="3" width="92" height="139" fill="none" stroke="rgba(255,255,255,0.38)" strokeWidth="0.8" rx="2" />
          
          {/* Halfway Line */}
          <line x1="4" y1="72.5" x2="96" y2="72.5" stroke="rgba(255,255,255,0.48)" strokeWidth="0.9" />
          
          {/* Centre Circle & Centre Spot */}
          <circle cx="50" cy="72.5" r="14" fill="none" stroke="rgba(255,255,255,0.42)" strokeWidth="0.8" />
          <circle cx="50" cy="72.5" r="0.9" fill="rgba(255,255,255,0.7)" />

          {/* Top Penalty Box & Goal Area (KRSC Kozhikkode Goal) */}
          <rect x="22" y="3" width="56" height="17" fill="none" stroke="rgba(255,255,255,0.36)" strokeWidth="0.75" />
          <rect x="36" y="3" width="28" height="7" fill="none" stroke="rgba(255,255,255,0.36)" strokeWidth="0.75" />
          <circle cx="50" cy="14" r="0.8" fill="rgba(255,255,255,0.6)" />
          <path d="M 40 20 A 10 10 0 0 0 60 20" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.7" />

          {/* Bottom Penalty Box & Goal Area (BASE Perumbavur Goal) */}
          <rect x="22" y="125" width="56" height="17" fill="none" stroke="rgba(255,255,255,0.36)" strokeWidth="0.75" />
          <rect x="36" y="135" width="28" height="7" fill="none" stroke="rgba(255,255,255,0.36)" strokeWidth="0.75" />
          <circle cx="50" cy="131" r="0.8" fill="rgba(255,255,255,0.6)" />
          <path d="M 40 125 A 10 10 0 0 1 60 125" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.7" />

          {/* 4 Corner Kick Arcs */}
          <path d="M 4 6 A 3 3 0 0 0 7 3" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.7" />
          <path d="M 96 6 A 3 3 0 0 1 93 3" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.7" />
          <path d="M 4 139 A 3 3 0 0 1 7 142" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.7" />
          <path d="M 96 139 A 3 3 0 0 0 93 142" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.7" />
        </svg>

        {/* Halfway Watermark Badges */}
        <div className="absolute top-[48.5%] left-3 -translate-y-1/2 flex items-center gap-1.5 opacity-60 pointer-events-none">
          <span className="text-[10px] font-black font-sports tracking-wider text-amber-300">
            KRSC ({homeFormation})
          </span>
        </div>
        <div className="absolute top-[48.5%] right-3 -translate-y-1/2 flex items-center gap-1.5 opacity-60 pointer-events-none">
          <span className="text-[10px] font-black font-sports tracking-wider text-sky-300">
            BASE ({awayFormation})
          </span>
        </div>

        {/* --- UPPER HALF: KRSC KOZHIKKODE (7 PLAYERS) --- */}
        {homePositionedPlayers.map(({ player, posData }) => (
          <DualPitchPlayerNode
            key={`krsc-${player.num}-${player.name}`}
            player={player}
            teamKey="krsc"
            posData={posData}
            playerInfo={getPlayerStatsAndDisciplinary(player, 'krsc')}
            shirtColor={krscSquad.shirtColor}
            onClick={() => setActivePlayer({ ...player, clubName: krscSquad.name, shirtColor: krscSquad.shirtColor, teamKey: 'krsc' })}
          />
        ))}

        {/* --- LOWER HALF: BASE PERUMBAVUR (7 PLAYERS) --- */}
        {awayPositionedPlayers.map(({ player, posData }) => (
          <DualPitchPlayerNode
            key={`base-${player.num}-${player.name}`}
            player={player}
            teamKey="base"
            posData={posData}
            playerInfo={getPlayerStatsAndDisciplinary(player, 'base')}
            shirtColor={baseSquad.shirtColor}
            onClick={() => setActivePlayer({ ...player, clubName: baseSquad.name, shirtColor: baseSquad.shirtColor, teamKey: 'base' })}
          />
        ))}
      </div>

      {/* 4. Dedicated Substitutes Bench Section with Toggle Button */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h4 className="text-xs sm:text-sm font-black font-sports uppercase tracking-wider text-card-title flex items-center gap-1.5">
            <span>{lang === 'ml' ? 'പകരക്കാർ (സബ്സ്റ്റിറ്റ്യൂട്ട്സ്)' : 'SUBSTITUTES BENCH'}</span>
            <span className="text-[10px] text-card-muted font-mono font-normal">
              (KRSC: {krscSquad.subs?.length || 0} • BASE: {baseSquad.subs?.length || 0})
            </span>
          </h4>

          {/* Toggle Button for Substitutes */}
          <button
            type="button"
            onClick={() => setShowSubstitutes((prev) => !prev)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold font-sports flex items-center gap-1.5 transition active:scale-95 bg-surface-light dark:bg-navy-800 border border-surface-border dark:border-navy-700 text-card-title hover:border-royal shadow-2xs cursor-pointer"
            aria-expanded={showSubstitutes}
            aria-label="Toggle substitutes bench"
          >
            <span>
              {showSubstitutes 
                ? (lang === 'ml' ? 'സബ്സ്റ്റിറ്റ്യൂട്ടുകൾ മറയ്ക്കുക' : 'Hide Substitutes') 
                : (lang === 'ml' ? 'സബ്സ്റ്റിറ്റ്യൂട്ടുകൾ കാണിക്കുക' : 'Show Substitutes')}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showSubstitutes ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {showSubstitutes && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-fadeIn">
          {/* KRSC Bench */}
          <div className="p-3 rounded-2xl bg-surface-light dark:bg-navy-800 border border-surface-border dark:border-navy-700 space-y-2">
            <div className="flex items-center justify-between pb-1.5 border-b border-surface-border dark:border-navy-700">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-white p-0.5 border border-surface-border shadow-2xs flex items-center justify-center">
                  <TeamLogo teamName={krscSquad.name} className="w-full h-full object-contain" />
                </div>
                <span className="text-[11px] font-black font-sports text-card-title">
                  {krscSquad.shortName} BENCH
                </span>
              </div>
              <span className="text-[10px] text-card-muted font-bold">{krscSquad.subs?.length || 0} Players</span>
            </div>

            <div className="space-y-1.5">
              {(krscSquad.subs || []).map((sub) => {
                const info = getPlayerStatsAndDisciplinary(sub, 'krsc');
                return (
                  <button
                    key={`sub-${sub.num}-${sub.name}`}
                    onClick={() => setActivePlayer({ ...sub, clubName: krscSquad.name, shirtColor: krscSquad.shirtColor, teamKey: 'krsc' })}
                    className="w-full p-2 rounded-xl bg-surface-card border border-surface-border dark:border-navy-700 hover:border-royal flex items-center justify-between text-left transition active:scale-98"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg overflow-hidden border border-amber-500/30 bg-amber-500/15 text-amber-600 dark:text-amber-400 font-mono font-black text-xs flex items-center justify-center shrink-0 relative">
                        <span className="absolute inset-0 flex items-center justify-center">#{sub.num}</span>
                        {sub.photoUrl && (
                          <img
                            src={sub.photoUrl}
                            alt={sub.name}
                            className="w-full h-full object-cover absolute inset-0 z-10"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        )}
                      </div>
                      <div>
                        <span className="text-xs font-bold font-sports text-card-title block leading-tight">
                          {sub.name}
                        </span>
                        <span className="text-[9px] text-card-muted uppercase font-bold">
                          {sub.pos || 'SUB'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {info.goals > 0 && <span className="text-xs font-mono font-black text-emerald-500">⚽ {info.goals}</span>}
                      {info.hasRedCard && <span className="text-xs">🟥</span>}
                      {info.hasYellowCard && !info.hasRedCard && <span className="text-xs">🟨</span>}
                      <span className="px-1.5 py-0.5 rounded-md text-[9px] font-mono font-bold bg-surface-light dark:bg-navy-900 border border-surface-border dark:border-navy-700 text-card-muted">
                        {Number(sub.baseRating || 0.0).toFixed(1)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* BASE Bench */}
          <div className="p-3 rounded-2xl bg-surface-light dark:bg-navy-800 border border-surface-border dark:border-navy-700 space-y-2">
            <div className="flex items-center justify-between pb-1.5 border-b border-surface-border dark:border-navy-700">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-white p-0.5 border border-surface-border shadow-2xs flex items-center justify-center">
                  <TeamLogo teamName={baseSquad.name} className="w-full h-full object-contain" />
                </div>
                <span className="text-[11px] font-black font-sports text-card-title">
                  {baseSquad.shortName} BENCH
                </span>
              </div>
              <span className="text-[10px] text-card-muted font-bold">{baseSquad.subs?.length || 0} Players</span>
            </div>

            <div className="space-y-1.5">
              {(baseSquad.subs || []).map((sub) => {
                const info = getPlayerStatsAndDisciplinary(sub, 'base');
                return (
                  <button
                    key={`sub-${sub.num}-${sub.name}`}
                    onClick={() => setActivePlayer({ ...sub, clubName: baseSquad.name, shirtColor: baseSquad.shirtColor, teamKey: 'base' })}
                    className="w-full p-2 rounded-xl bg-surface-card border border-surface-border dark:border-navy-700 hover:border-royal flex items-center justify-between text-left transition active:scale-98"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg overflow-hidden border border-blue-500/30 bg-blue-500/15 text-blue-600 dark:text-blue-400 font-mono font-black text-xs flex items-center justify-center shrink-0 relative">
                        <span className="absolute inset-0 flex items-center justify-center">#{sub.num}</span>
                        {sub.photoUrl && (
                          <img
                            src={sub.photoUrl}
                            alt={sub.name}
                            className="w-full h-full object-cover absolute inset-0 z-10"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        )}
                      </div>
                      <div>
                        <span className="text-xs font-bold font-sports text-card-title block leading-tight">
                          {sub.name}
                        </span>
                        <span className="text-[9px] text-card-muted uppercase font-bold">
                          {sub.pos || 'SUB'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {info.goals > 0 && <span className="text-xs font-mono font-black text-emerald-500">⚽ {info.goals}</span>}
                      {info.hasRedCard && <span className="text-xs">🟥</span>}
                      {info.hasYellowCard && !info.hasRedCard && <span className="text-xs">🟨</span>}
                      <span className="px-1.5 py-0.5 rounded-md text-[9px] font-mono font-bold bg-surface-light dark:bg-navy-900 border border-surface-border dark:border-navy-700 text-card-muted">
                        {Number(sub.baseRating || 0.0).toFixed(1)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        )}
      </div>

      {/* 5. Man of the Match (Player of the Match) Section - Only Visible when Awarded by Admin */}
      {manOfTheMatch && manOfTheMatch.enabled && (
        <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-surface-card to-amber-900/10 p-4 sm:p-5 shadow-card space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-surface-border dark:border-navy-700">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gold text-navy-950 flex items-center justify-center font-black shadow-sm">
                <Star className="w-4 h-4 fill-current" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black font-sports uppercase tracking-wider text-card-title flex items-center gap-1.5">
                  <span>{lang === 'ml' ? 'മാൻ ഓഫ് ദ മാച്ച് (MVP)' : 'MAN OF THE MATCH'}</span>
                  <span className="px-1.5 py-0.2 rounded-md bg-gold text-navy-950 text-[9px] font-black uppercase">
                    {manOfTheMatch.awardTitle || 'Official MVP'}
                  </span>
                </h4>
                <p className="text-[11px] text-card-muted">
                  {lang === 'ml' ? 'റഫറി കമ്മിറ്റി തിരഞ്ഞെടുത്ത മികച്ച കളിക്കാരൻ' : 'Official Player of the Match Awarded by Committee'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-mono font-black text-xs shadow-xs">
                <span>⭐</span>
                <span>{manOfTheMatch.rating || '9.0'}</span>
              </div>
              <span className="block text-[9px] text-card-muted font-bold mt-0.5">Sofascore MVP</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
            {/* Player Photo */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-lg shadow-amber-500/20 bg-slate-900">
                {manOfTheMatch.photoUrl ? (
                  <img
                    src={manOfTheMatch.photoUrl}
                    alt={manOfTheMatch.playerName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <JerseyShirtIcon
                    number={manOfTheMatch.playerNum || 10}
                    color={manOfTheMatch.teamKey === 'krsc' ? krscSquad.shirtColor : baseSquad.shirtColor}
                    className="w-full h-full"
                  />
                )}
              </div>
              <div className="absolute -bottom-2 inset-x-0 mx-auto w-max px-2 py-0.5 rounded-full bg-gold text-navy-950 font-sports font-black text-[9px] border border-white shadow-2xs">
                #{manOfTheMatch.playerNum || 10} {manOfTheMatch.pos || 'STAR'}
              </div>
            </div>

            {/* Player Bio & Stats */}
            <div className="flex-1 text-center sm:text-left space-y-2 min-w-0">
              <div>
                <h5 className="text-base sm:text-lg font-black font-sports text-card-title leading-tight">
                  {manOfTheMatch.playerName}
                </h5>
                <p className="text-xs text-amber-500 font-sports font-bold">
                  {manOfTheMatch.teamName || (manOfTheMatch.teamKey === 'krsc' ? krscSquad.name : baseSquad.name)} • {manOfTheMatch.pos || 'Player of the Match'}
                </p>
              </div>

              {/* Performance Stats Strip */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2 rounded-xl bg-surface-light dark:bg-navy-800 border border-surface-border dark:border-navy-700">
                  <span className="block text-[10px] text-card-muted font-bold">Goals</span>
                  <span className="text-xs sm:text-sm font-black font-mono text-emerald-500">
                    {manOfTheMatch.goals ?? 1}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-surface-light dark:bg-navy-800 border border-surface-border dark:border-navy-700">
                  <span className="block text-[10px] text-card-muted font-bold">Shots</span>
                  <span className="text-xs sm:text-sm font-black font-mono text-card-title">
                    {manOfTheMatch.shots ?? 4}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-surface-light dark:bg-navy-800 border border-surface-border dark:border-navy-700">
                  <span className="block text-[10px] text-card-muted font-bold">Dribbles</span>
                  <span className="text-xs sm:text-sm font-black font-mono text-card-title">
                    {manOfTheMatch.dribbles ?? 3}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-surface-light dark:bg-navy-800 border border-surface-border dark:border-navy-700">
                  <span className="block text-[10px] text-card-muted font-bold">Rating</span>
                  <span className="text-xs sm:text-sm font-black font-mono text-emerald-400">
                    {manOfTheMatch.rating || '9.0'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Today's Winner Showcase Section */}
      <div className={`rounded-3xl border p-4 sm:p-5 transition shadow-card ${
        isMatchFinished || leadingTeam
          ? 'border-gold/40 bg-gradient-to-br from-gold/15 via-surface-card to-amber-950/20'
          : 'border-surface-border dark:border-navy-700 surface-card'
      }`}>
        <div className="flex items-center justify-between pb-3 border-b border-surface-border dark:border-navy-700">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black shadow-sm ${
              isMatchFinished || leadingTeam ? 'bg-gold text-navy-950' : 'bg-surface-light dark:bg-navy-800 text-card-muted'
            }`}>
              <Trophy className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black font-sports uppercase tracking-wider text-card-title flex items-center gap-1.5">
                <span>{lang === 'ml' ? 'ഇന്നത്തെ വിജയികൾ (MATCH WINNER)' : "TODAY'S WINNING TEAM"}</span>
                <span className={`px-1.5 py-0.2 rounded-md text-[9px] font-black uppercase ${
                  isMatchFinished 
                    ? 'bg-emerald-600 text-white' 
                    : leadingTeam 
                      ? 'bg-amber-500 text-navy-950' 
                      : 'bg-surface-border dark:bg-navy-700 text-card-muted'
                }`}>
                  {isMatchFinished ? 'FINAL RESULT' : leadingTeam ? 'LIVE LEADER' : 'MATCHDAY 1'}
                </span>
              </h4>
              <p className="text-[11px] text-card-muted">
                {lang === 'ml' 
                  ? 'വിജയിക്കുന്ന ടീം ക്വാർട്ടർ ഫൈനലിലേക്ക് യോഗ്യത നേടുന്നു' 
                  : 'Winner advances directly to the All India Sevens Quarter-Finals'}
              </p>
            </div>
          </div>
        </div>

        {/* Winner Presentation */}
        {leadingTeam ? (
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-white p-1.5 border border-gold shadow-md flex items-center justify-center shrink-0">
                <TeamLogo teamName={leadingTeam.name} className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-gold block">
                  {isMatchFinished ? '🏆 MATCH 1 CHAMPION' : '⚡ CURRENTLY IN THE LEAD'}
                </span>
                <h5 className="text-base sm:text-lg font-black font-sports text-card-title uppercase leading-tight">
                  {leadingTeam.name}
                </h5>
                <p className="text-xs text-card-muted font-medium mt-0.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>{isMatchFinished ? 'Qualified for Quarter-Final' : 'On Track to Advance'}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-surface-light dark:bg-navy-800 border border-surface-border dark:border-navy-700 text-card-title">
              <span className="text-xs font-bold font-sports">{openingMatch.teamHome.shortName}</span>
              <span className="text-lg font-black font-sports font-mono px-2 py-0.5 rounded-lg bg-surface-card border border-surface-border dark:border-navy-700">
                {matchState.officialScoreHome} - {matchState.officialScoreAway}
              </span>
              <span className="text-xs font-bold font-sports">{openingMatch.teamAway.shortName}</span>
            </div>
          </div>
        ) : (
          <div className="pt-3 text-center py-4 bg-surface-light/40 dark:bg-navy-800/40 rounded-2xl border border-surface-border/50 dark:border-navy-700/50 space-y-1">
            <p className="text-xs font-bold text-card-title">
              {lang === 'ml' 
                ? 'മത്സരം ആരംഭിക്കാൻ കാത്തിരിക്കുന്നു (Kickoff: 8:45 PM IST)' 
                : 'Waiting for Match Kickoff (8:45 PM IST)'}
            </p>
            <p className="text-[11px] text-card-muted">
              {lang === 'ml'
                ? 'റഫറി ഡെസ്കിൽ സ്കോർ രേഖപ്പെടുത്തുമ്പോൾ ഇന്നത്തെ വിജയികൾ ഇവിടെ തത്സമയം കാണാം.'
                : 'The leading/winning club will update here dynamically as goals are recorded.'}
            </p>
          </div>
        )}
      </div>

      {/* 7. Player Details Bottom Sheet Modal (Triggered on Click) */}
      {activePlayer && (
        <div 
          onClick={() => setActivePlayer(null)}
          className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-xs animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md surface-navy-card border-t sm:border border-navy-700 rounded-t-3xl sm:rounded-3xl p-5 pb-8 sm:pb-5 text-white shadow-2xl space-y-4 animate-slideUp"
            style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom, 24px))' }}
          >
            {/* Handle Bar */}
            <div className="w-12 h-1.5 rounded-full bg-navy-600/80 mx-auto mb-1 sm:hidden" />

            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-navy-700">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/20 bg-slate-900 shadow-md shrink-0 relative">
                  <JerseyShirtIcon
                    number={activePlayer.num}
                    color={activePlayer.shirtColor || '#1D4ED8'}
                    isGK={activePlayer.isGK}
                    captain={activePlayer.captain}
                    hasRedCard={getPlayerStatsAndDisciplinary(activePlayer, activePlayer.teamKey).hasRedCard}
                    className="w-full h-full absolute inset-0"
                  />
                  {activePlayer.photoUrl && (
                    <img
                      src={activePlayer.photoUrl}
                      alt={activePlayer.name}
                      className="w-full h-full object-cover absolute inset-0 z-10"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-black font-sports uppercase text-white leading-tight">
                    {activePlayer.name}
                  </h4>
                  <p className="text-xs text-gold font-sports font-bold mt-0.5">
                    #{activePlayer.num} • {activePlayer.pos} {activePlayer.captain ? '(Captain)' : ''}
                  </p>
                  <p className="text-[11px] text-navy-muted">
                    {activePlayer.clubName || 'All India Sevens Season 7'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActivePlayer(null)}
                className="w-9 h-9 rounded-full bg-navy-800 hover:bg-navy-700 text-white flex items-center justify-center transition active:scale-95"
                aria-label="Close player details"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Disciplinary & Match Events Box */}
            {(() => {
              const info = getPlayerStatsAndDisciplinary(activePlayer, activePlayer.teamKey);
              const { disciplinary, goals, hasRedCard, hasYellowCard, latestCard } = info;
              const hasAnyEvents = goals > 0 || hasRedCard || hasYellowCard;

              return (
                <div className="space-y-3">
                  {/* RED CARD BANNER */}
                  {hasRedCard && (
                    <div className="p-4 rounded-2xl bg-rose-600/20 border-2 border-rose-500/80 text-white space-y-2.5 shadow-lg shadow-rose-950/50 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl animate-pulse">🟥</span>
                          <div>
                            <span className="text-[11px] font-black uppercase text-rose-400 block tracking-wider">
                              {lang === 'ml' ? 'റഫറി ചുവപ്പ് കാർഡ് നൽകി' : 'OFFICIAL RED CARD BOOKING'}
                            </span>
                            <h5 className="text-sm font-black text-white">
                              {lang === 'ml' ? 'കളത്തിൽ നിന്ന് പുറത്തായി (Suspension)' : 'Expelled & Match Suspended'}
                            </h5>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-mono font-black text-xs shadow-xs">
                          {latestCard?.minute}'
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-navy-950/60 border border-rose-500/30 text-xs space-y-1">
                        <div className="flex items-center justify-between text-rose-200">
                          <span className="font-bold">{lang === 'ml' ? 'കാരണം:' : 'Reason:'}</span>
                          <span>{latestCard?.reason || 'Tactical foul dismissal'}</span>
                        </div>
                        <div className="flex items-center justify-between text-navy-muted text-[10px]">
                          <span>{lang === 'ml' ? 'റഫറി ഡെസ്ക് രേഖപ്പെടുത്തിയത്' : 'Logged by Match Referee Desk'}</span>
                          <span className="font-mono text-emerald-400 font-bold">✓ Stored in Database</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* YELLOW CARD BANNER */}
                  {hasYellowCard && !hasRedCard && (
                    <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-white space-y-1 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🟨</span>
                          <span className="text-xs font-black uppercase text-amber-400">
                            {lang === 'ml' ? 'മഞ്ഞ കാർഡ് (മുന്നറിയിപ്പ്)' : 'Yellow Card Caution'}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded-md bg-amber-500 text-navy-950 font-mono font-black text-xs">
                          {latestCard?.minute}'
                        </span>
                      </div>
                      <p className="text-xs text-amber-200">
                        {latestCard?.reason || 'Caution for tactical challenge'}
                      </p>
                    </div>
                  )}

                  {/* GOALS COUNTER */}
                  {goals > 0 && (
                    <div className="p-3 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">⚽</span>
                        <span className="text-xs font-bold text-white">
                          {lang === 'ml' ? 'സ്കോർ ചെയ്ത ഗോളുകൾ' : 'Goals Scored'}
                        </span>
                      </div>
                      <span className="text-lg font-black font-mono text-emerald-400">
                        {goals}
                      </span>
                    </div>
                  )}

                  {/* Match Performance Rating */}
                  <div className="p-3 rounded-2xl bg-navy-800/60 border border-navy-700 flex items-center justify-between">
                    <span className="text-xs font-bold text-navy-muted">
                      {lang === 'ml' ? 'മാച്ച് റേറ്റിംഗ്' : 'Official Match Rating'}
                    </span>
                    {(() => {
                      const base = Number(activePlayer.baseRating || 0.0);
                      const finalRating = base > 0 
                        ? Math.min(9.9, Math.max(1.0, base + (goals * 0.8) - (hasRedCard ? 1.8 : hasYellowCard ? 0.4 : 0)))
                        : (goals > 0 ? Math.min(9.9, 6.0 + goals * 0.8) : 0.0);
                      return (
                        <span className={`px-2 py-0.5 rounded-md font-mono font-black text-xs ${
                          finalRating >= 7.0 
                            ? 'bg-emerald-600 text-white' 
                            : finalRating >= 6.0 
                              ? 'bg-amber-500 text-navy-950 font-black' 
                              : finalRating > 0 
                                ? 'bg-rose-600 text-white'
                                : 'bg-slate-700 text-white/90 border border-white/20'
                        }`}>
                          {finalRating.toFixed(1)} / 10 {finalRating === 0 ? (lang === 'ml' ? '(പെൻഡിംഗ്)' : '(Pending)') : ''}
                        </span>
                      );
                    })()}
                  </div>

                  {!hasAnyEvents && (
                    <p className="text-xs text-navy-muted font-medium py-2 text-center bg-navy-800/40 rounded-2xl border border-navy-700">
                      {lang === 'ml' ? 'ഈ കളിക്കാരന് കാർഡുകളോ ഗോളുകളോ ഇല്ല.' : 'No disciplinary cards or goals recorded for this player.'}
                    </p>
                  )}
                </div>
              );
            })()}

            <button
              onClick={() => setActivePlayer(null)}
              className="w-full min-h-[44px] py-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-gold font-bold text-xs uppercase transition active:scale-98"
            >
              {lang === 'ml' ? 'അടയ്ക്കുക' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

// Player Card Node on Vertical Pitch (Live-Score / Sofascore Style)
function DualPitchPlayerNode({
  player,
  teamKey,
  posData,
  playerInfo,
  shirtColor,
  onClick
}) {
  const shortName = player.displayName || (() => {
    const raw = (player.name || '').trim();
    const lower = raw.toLowerCase();
    if (lower.startsWith('muhammed ')) return raw.slice(9).trim();
    if (lower.startsWith('mohammed ')) return raw.slice(9).trim();
    if (lower.startsWith('abdul ')) return raw.slice(6).trim();
    return raw.split(' ')[0] || raw;
  })();
  const hasRedCard = playerInfo?.hasRedCard;
  const hasYellowCard = playerInfo?.hasYellowCard;

  // Calculate dynamic rating with match performance (Defaults to 0.0 until rated)
  const dynamicRating = useMemo(() => {
    let r = Number(player.baseRating || 0.0);
    if (r === 0) {
      if (playerInfo?.goals > 0) r = 6.0 + playerInfo.goals * 0.8;
      else return 0.0;
    }
    if (playerInfo?.goals > 0 && r > 0) r += playerInfo.goals * 0.8;
    if (playerInfo?.hasYellowCard && r > 0) r -= 0.4;
    if (playerInfo?.hasRedCard && r > 0) r -= 1.8;
    return Math.min(9.9, Math.max(0.0, r));
  }, [player.baseRating, playerInfo]);

  const ratingColor = dynamicRating >= 7.0 
    ? 'bg-emerald-600 text-white' 
    : dynamicRating >= 6.0 
      ? 'bg-amber-500 text-navy-950 font-black' 
      : dynamicRating > 0
        ? 'bg-rose-600 text-white'
        : 'bg-slate-700/85 text-white/90 border border-white/20';

  return (
    <button
      onClick={onClick}
      style={{
        position: 'absolute',
        left: `${posData.x}%`,
        top: `${posData.y}%`,
        transform: 'translate(-50%, -50%)'
      }}
      className={`group flex flex-col items-center justify-center cursor-pointer focus:outline-hidden transition active:scale-90 z-20 ${
        hasRedCard ? 'opacity-85' : ''
      }`}
      aria-label={`${player.name} #${player.num} ${player.pos}`}
    >
      <div className="relative">
        {/* Player Avatar or High-Quality Photo */}
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden shadow-lg transition-transform group-hover:scale-105 relative ${
          hasRedCard 
            ? 'ring-2 ring-rose-500 border-2 border-rose-600 bg-rose-950/60' 
            : 'border border-white/30 bg-slate-900/90'
        }`}>
          {/* Fallback Jersey Shirt Icon always present underneath */}
          <JerseyShirtIcon
            number={player.num}
            color={shirtColor}
            isGK={player.isGK}
            captain={player.captain}
            hasRedCard={hasRedCard}
            className="w-full h-full absolute inset-0"
          />

          {player.photoUrl && (
            <img
              src={player.photoUrl}
              alt={player.name}
              className="w-full h-full object-cover absolute inset-0 z-10"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}

          {/* Captain Badge if with photo */}
          {player.captain && (
            <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-gold text-navy-950 font-sports font-black text-[9px] flex items-center justify-center border border-white shadow-2xs z-10">
              C
            </span>
          )}
        </div>

        {/* Live Rating Badge (Sofascore style) */}
        <div className={`absolute -bottom-1 -left-1.5 px-1 py-0.2 rounded-md font-mono font-black text-[8px] sm:text-[9px] shadow-xs border border-white/20 z-10 ${ratingColor}`}>
          {dynamicRating.toFixed(1)}
        </div>

        {/* Goal Badge */}
        {playerInfo?.goals > 0 && (
          <div className="absolute -bottom-1 -right-2 px-1 py-0.2 rounded-full text-[8px] sm:text-[9px] font-mono bg-emerald-600 text-white font-black border border-white shadow-xs z-10 animate-bounce">
            ⚽ {playerInfo.goals}
          </div>
        )}

        {/* Red Card Dismissal Badge */}
        {hasRedCard && (
          <div className="absolute -top-1.5 -right-1.5 w-3.5 h-4.5 rounded-xs bg-rose-600 border border-white shadow-md flex items-center justify-center animate-pulse z-10">
            <span className="text-[8px] font-black text-white">R</span>
          </div>
        )}

        {/* Yellow Card Caution Badge */}
        {!hasRedCard && hasYellowCard && (
          <div className="absolute -top-1.5 -right-1.5 w-2.5 h-3.5 rounded-2xs bg-amber-400 border border-amber-600 shadow-xs z-10" />
        )}
      </div>

      {/* Shirt Number & Player Name Pill */}
      <div className={`mt-0.5 px-1.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-sports font-bold tracking-tight text-center leading-tight shadow-sm max-w-[76px] sm:max-w-[85px] truncate ${
        hasRedCard
          ? 'bg-rose-700 text-white border border-rose-500'
          : 'bg-navy-950/85 text-white border border-white/10'
      }`}>
        <span className="opacity-75 mr-0.5 text-[9px] font-mono">#{player.num}</span>
        <span>{shortName}</span>
        {hasRedCard && <span className="block text-[7px] uppercase tracking-wider text-amber-200">OUT</span>}
      </div>
    </button>
  );
}
