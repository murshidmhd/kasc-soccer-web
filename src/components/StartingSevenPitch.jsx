import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  X, 
  Info,
  Calendar
} from 'lucide-react';
import TeamLogo from './TeamLogo';
import { getStoredMatchState } from '../utils/matchStateManager';
import { SHOW_LINEUPS } from '../config/siteConfig';

// Inline SVG Shirt Icon with Shirt Number (Rule 8)
function JerseyShirtIcon({ 
  number, 
  color = '#1D4ED8', 
  numberColor = '#FFFFFF', 
  isGK = false, 
  captain = false,
  className = "w-10 h-10"
}) {
  const shirtFill = isGK ? '#D97706' : color; // Amber/Gold for GK, Club color for outfield
  const collarColor = isGK ? '#B45309' : '#0F172A';

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full drop-shadow-md select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Shirt Body with Sleeves */}
        <path
          d="M 32 16 L 12 34 L 24 46 L 34 38 L 34 84 L 66 84 L 66 38 L 76 46 L 88 34 L 68 16 C 62 25 38 25 32 16 Z"
          fill={shirtFill}
          stroke="#FFFFFF"
          strokeWidth="3"
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

      {/* Small Captain "C" Badge (Rule 8) */}
      {captain && (
        <span 
          className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-gold text-navy-900 text-[9px] font-black font-sports flex items-center justify-center border border-white shadow-2xs"
          title="Team Captain"
        >
          C
        </span>
      )}
    </div>
  );
}

export default function StartingSevenPitch({ lang, isDarkMode }) {
  const [selectedTeam, setSelectedTeam] = useState('home'); // 'home' | 'away'
  const [activePlayer, setActivePlayer] = useState(null);
  const [matchEvents, setMatchEvents] = useState([]);

  // Read real match events on mount & listen to live updates (Data Rule 1)
  useEffect(() => {
    const currentState = getStoredMatchState();
    if (currentState?.events) {
      setMatchEvents(currentState.events);
    }

    const handleMatchUpdate = (e) => {
      if (e.detail?.events) {
        setMatchEvents(e.detail.events);
      }
    };

    window.addEventListener('kasc_match_state_updated', handleMatchUpdate);
    return () => window.removeEventListener('kasc_match_state_updated', handleMatchUpdate);
  }, []);

  // Early return if constant SHOW_LINEUPS is false (Data Rule 3)
  if (!SHOW_LINEUPS) return null;

  // Clean Lineups without personal details or static ratings (Data Rules 2 & 5)
  // Lineup status field per team: "unconfirmed" or "confirmed" with confirmedAt (Data Rule 3)
  const homeSquad = {
    name: 'UDAYA PARAMBIL PEEDIKA',
    shortName: 'UDAYA',
    shirtColor: '#7C3AED', // Purple
    status: 'unconfirmed', // 'unconfirmed' | 'confirmed'
    confirmedAt: null,
    formation: '1-2-2-2',
    starting: [
      { num: 1, name: 'Shamseer', pos: 'GK', captain: false, isGK: true },
      { num: 4, name: 'Shameer K.', pos: 'CB', captain: false },
      { num: 3, name: 'Faisal M.', pos: 'RB', captain: false },
      { num: 7, name: 'Riyas K.', pos: 'CM', captain: true },
      { num: 8, name: 'Suhail P.', pos: 'AM', captain: false },
      { num: 9, name: 'Ibrahim Soumahoro', pos: 'ST', captain: false },
      { num: 10, name: 'Asif Ali', pos: 'CF', captain: false }
    ],
    subs: [
      { num: 13, name: 'Junaid' },
      { num: 11, name: 'Salman' },
      { num: 14, name: 'Anas' },
      { num: 15, name: 'Haris' },
      { num: 18, name: 'Rahul' }
    ]
  };

  const awaySquad = {
    name: 'NEW MALAYA MALABAR FC',
    shortName: 'NEW MALAYA',
    shirtColor: '#1E293B', // Dark Navy/Black
    status: 'unconfirmed',
    confirmedAt: null,
    formation: '1-2-2-2',
    starting: [
      { num: 1, name: 'Aneesh', pos: 'GK', captain: false, isGK: true },
      { num: 5, name: 'Musthafa', pos: 'CB', captain: false },
      { num: 6, name: 'Jameel', pos: 'SW', captain: false },
      { num: 8, name: 'Nabeel', pos: 'CM', captain: false },
      { num: 10, name: 'Rashid', pos: 'AM', captain: true },
      { num: 11, name: 'Basith', pos: 'WF', captain: false },
      { num: 9, name: 'Usman', pos: 'ST', captain: false }
    ],
    subs: [
      { num: 22, name: 'Suhair' },
      { num: 7, name: 'Shafeeq' },
      { num: 14, name: 'Nizar' },
      { num: 17, name: 'Ajmal' },
      { num: 19, name: 'Irfan' }
    ]
  };

  const currentSquad = selectedTeam === 'home' ? homeSquad : awaySquad;

  // Helper to compute goals & cards strictly from REAL MATCH EVENTS (Data Rule 1)
  const getPlayerEventStats = (playerName, playerNum) => {
    if (!matchEvents || matchEvents.length === 0) {
      return { goals: 0, yellowCards: 0, redCards: 0 };
    }

    let goals = 0;
    let yellowCards = 0;
    let redCards = 0;

    const lowerName = playerName.toLowerCase();
    const numStr = String(playerNum);

    matchEvents.forEach((evt) => {
      const evtPlayer = (evt.player || evt.scorerName || '').toLowerCase();
      // Match by exact name or number
      if (evtPlayer.includes(lowerName) || evtPlayer.includes(`#${numStr}`)) {
        if (evt.type === 'goal') goals += 1;
        if (evt.type === 'yellow_card' || evt.type === 'yellow') yellowCards += 1;
        if (evt.type === 'red_card' || evt.type === 'red') redCards += 1;
      }
    });

    return { goals, yellowCards, redCards };
  };

  // Group 7 players by Tactical Rows for 1-2-2-2 (Rule 9)
  const attackers = currentSquad.starting.filter(p => ['ST', 'CF', 'WF'].includes(p.pos));
  const midfielders = currentSquad.starting.filter(p => ['CM', 'AM', 'MF'].includes(p.pos));
  const defenders = currentSquad.starting.filter(p => ['CB', 'RB', 'LB', 'SW'].includes(p.pos));
  const goalkeepers = currentSquad.starting.filter(p => p.isGK || p.pos === 'GK');

  const isValidSeven = currentSquad.starting.length === 7;

  return (
    <section id="pitch-lineup" className="rounded-3xl border border-surface-border dark:border-navy-700 surface-card p-3 sm:p-5 shadow-card space-y-4">
      {/* 1. Header with Title & Lineup Status (Data Rule 3) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-border dark:border-navy-700 pb-3">
        <div>
          <h3 className="text-base sm:text-lg font-black font-sports uppercase tracking-wider text-card-title leading-tight">
            {lang === 'ml' ? 'സ്റ്റാർട്ടിംഗ് 7 ലൈനപ്പ്' : 'STARTING 7'}
          </h3>
          {/* Status Line: Lineup unconfirmed in muted style OR confirmed with time (Data Rule 3) */}
          <p className="text-xs text-card-muted font-medium mt-0.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
            <span>
              {currentSquad.status === 'confirmed' 
                ? (lang === 'ml' ? `ലൈനപ്പ് സ്ഥിരീകരിച്ചു (${currentSquad.confirmedAt})` : `Lineup confirmed (${currentSquad.confirmedAt})`)
                : (lang === 'ml' ? 'ലൈനപ്പ് സ്ഥിരീകരിച്ചിട്ടില്ല • റഫറി ഡെസ്ക് പരിശോധിക്കുന്നു' : 'Lineup unconfirmed')}
            </span>
          </p>
        </div>

        {/* Legend Row above Pitch (Rule 10: Slim row with text >= 12px) */}
        <div className="flex items-center gap-3 text-xs text-card-muted font-sports font-semibold">
          <span className="flex items-center gap-1">
            <span className="text-xs">⚽</span>
            <span>Goal</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-3.5 rounded-xs bg-amber-400 inline-block border border-amber-600" />
            <span>Card</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3.5 h-3.5 rounded-full bg-gold text-navy-900 text-[8px] font-black inline-flex items-center justify-center">C</span>
            <span>Captain</span>
          </span>
        </div>
      </div>

      {/* 2. Team Switcher (Rule 6: Segmented control with club logos, tap targets >= 44px) */}
      <div className="p-1 rounded-2xl bg-surface-light dark:bg-navy-800 border border-surface-border dark:border-navy-700 grid grid-cols-2 gap-1.5">
        <button
          onClick={() => { setSelectedTeam('home'); setActivePlayer(null); }}
          className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 active:scale-95 ${
            selectedTeam === 'home'
              ? 'btn-royal text-white shadow-xs font-black'
              : 'text-card-muted hover:text-card-title'
          }`}
          aria-label="View Udaya Parambil Peedika Lineup"
        >
          <div className="w-5 h-5 rounded-full bg-white p-0.5 border border-surface-border dark:border-navy-700 shadow-2xs flex items-center justify-center shrink-0">
            <TeamLogo teamName="UDAYA PARAMBIL PEEDIKA" className="w-full h-full rounded-full object-contain" />
          </div>
          <span className="truncate">{homeSquad.shortName}</span>
        </button>

        <button
          onClick={() => { setSelectedTeam('away'); setActivePlayer(null); }}
          className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 active:scale-95 ${
            selectedTeam === 'away'
              ? 'btn-royal text-white shadow-xs font-black'
              : 'text-card-muted hover:text-card-title'
          }`}
          aria-label="View New Malaya Malabar FC Lineup"
        >
          <div className="w-5 h-5 rounded-full bg-white p-0.5 border border-surface-border dark:border-navy-700 shadow-2xs flex items-center justify-center shrink-0">
            <TeamLogo teamName="NEW MALAYA MALABAR FC" className="w-full h-full rounded-full object-contain" />
          </div>
          <span className="truncate">{awaySquad.shortName}</span>
        </button>
      </div>

      {/* 3. Tactical Pitch (Rule 7: Lighter green with horizontal stripes, height 340-360px at 375px) */}
      {isValidSeven ? (
        <div 
          className="relative w-full rounded-3xl overflow-hidden border-2 border-emerald-800/80 shadow-md h-[350px] flex flex-col justify-between py-3 px-2 select-none"
          style={{
            background: 'repeating-linear-gradient(180deg, #15803D 0px, #15803D 35px, #16A34A 35px, #16A34A 70px)'
          }}
        >
          {/* Pitch Markings (Clear white lines: centre circle, halfway line, penalty boxes) */}
          <div className="absolute inset-2 border border-white/70 rounded-2xl pointer-events-none" />
          <div className="absolute top-1/2 left-2 right-2 h-px bg-white/70 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border border-white/70 rounded-full pointer-events-none" />
          {/* Top Penalty Box */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-36 h-12 border border-t-0 border-white/70 rounded-b-lg pointer-events-none" />
          {/* Bottom Penalty Box */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-36 h-12 border border-b-0 border-white/70 rounded-t-lg pointer-events-none" />

          {/* Formation Row 1: Attackers (2 players) */}
          <div className="relative z-10 flex items-center justify-around px-6">
            {attackers.map((player) => {
              const stats = getPlayerEventStats(player.name, player.num);
              return (
                <PitchPlayerNode
                  key={player.num}
                  player={player}
                  stats={stats}
                  shirtColor={currentSquad.shirtColor}
                  onClick={() => setActivePlayer(player)}
                />
              );
            })}
          </div>

          {/* Formation Row 2: Midfielders (2 players) */}
          <div className="relative z-10 flex items-center justify-around px-10">
            {midfielders.map((player) => {
              const stats = getPlayerEventStats(player.name, player.num);
              return (
                <PitchPlayerNode
                  key={player.num}
                  player={player}
                  stats={stats}
                  shirtColor={currentSquad.shirtColor}
                  onClick={() => setActivePlayer(player)}
                />
              );
            })}
          </div>

          {/* Formation Row 3: Defenders (2 players) */}
          <div className="relative z-10 flex items-center justify-around px-6">
            {defenders.map((player) => {
              const stats = getPlayerEventStats(player.name, player.num);
              return (
                <PitchPlayerNode
                  key={player.num}
                  player={player}
                  stats={stats}
                  shirtColor={currentSquad.shirtColor}
                  onClick={() => setActivePlayer(player)}
                />
              );
            })}
          </div>

          {/* Formation Row 4: Goalkeeper (1 player) */}
          <div className="relative z-10 flex items-center justify-center">
            {goalkeepers.map((player) => {
              const stats = getPlayerEventStats(player.name, player.num);
              return (
                <PitchPlayerNode
                  key={player.num}
                  player={player}
                  stats={stats}
                  isGK={true}
                  shirtColor={currentSquad.shirtColor}
                  onClick={() => setActivePlayer(player)}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center rounded-2xl bg-surface-light dark:bg-navy-800 border border-surface-border text-card-muted">
          <p className="text-xs font-bold">Starting lineup must contain exactly 7 players (1-2-2-2).</p>
        </div>
      )}

      {/* 4. Substitutes List (Rule 4 & Rule 12: Plain list titled "Substitutes" with number and name only) */}
      <div className="space-y-1.5 pt-1">
        <h4 className="text-xs font-black font-sports uppercase tracking-wider text-card-title">
          {lang === 'ml' ? 'പകരക്കാർ (Substitutes)' : 'Substitutes'}
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {currentSquad.subs.map((sub) => (
            <div
              key={sub.num}
              className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-navy-800 border border-surface-border dark:border-navy-700 text-xs font-bold text-card-title flex items-center gap-1.5 shadow-2xs"
            >
              <span className="font-mono text-royal dark:text-sky font-black">#{sub.num}</span>
              <span>{sub.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Player Details Bottom Sheet / Modal (Rule 11: name, shirt number, position, real events only) */}
      {activePlayer && (
        <div 
          onClick={() => setActivePlayer(null)}
          className="fixed inset-0 z-[70] flex flex-col justify-end bg-navy-950/70 animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full surface-navy-card border-t border-navy-700 rounded-t-3xl p-4 sm:p-6 text-white shadow-2xl space-y-4"
            style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom, 16px))' }}
          >
            {/* Handle Bar */}
            <div className="w-12 h-1.5 rounded-full bg-navy-600/80 mx-auto mb-1" />

            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-navy-700">
              <div className="flex items-center gap-3">
                <JerseyShirtIcon
                  number={activePlayer.num}
                  color={currentSquad.shirtColor}
                  isGK={activePlayer.isGK}
                  captain={activePlayer.captain}
                  className="w-12 h-12"
                />
                <div>
                  <h4 className="text-base sm:text-lg font-black font-sports uppercase text-white leading-tight">
                    {activePlayer.name}
                  </h4>
                  <p className="text-xs text-gold font-sports font-bold mt-0.5">
                    #{activePlayer.num} • {activePlayer.pos} {activePlayer.captain ? '(Captain)' : ''}
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

            {/* Real Match Events Only (Rule 11: hidden if none) */}
            {(() => {
              const stats = getPlayerEventStats(activePlayer.name, activePlayer.num);
              const hasEvents = stats.goals > 0 || stats.yellowCards > 0 || stats.redCards > 0;

              if (!hasEvents) {
                return (
                  <p className="text-xs text-navy-muted font-medium py-1">
                    {lang === 'ml' ? 'ഈ മത്സരത്തിൽ ഗോളുകളോ കാർഡുകളോ രേഖപ്പെടുത്തിയിട്ടില്ല.' : 'No match events recorded for this player.'}
                  </p>
                );
              }

              return (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {stats.goals > 0 && (
                    <div className="p-3 rounded-2xl bg-navy-800 border border-navy-700 flex items-center gap-2">
                      <span className="text-lg">⚽</span>
                      <div>
                        <span className="text-[10px] text-navy-muted uppercase font-bold block">Goals</span>
                        <span className="text-base font-black font-mono text-emerald-400">{stats.goals}</span>
                      </div>
                    </div>
                  )}

                  {(stats.yellowCards > 0 || stats.redCards > 0) && (
                    <div className="p-3 rounded-2xl bg-navy-800 border border-navy-700 flex items-center gap-2">
                      <div className="flex gap-1">
                        {stats.yellowCards > 0 && <span className="w-3 h-4 rounded-xs bg-amber-400 border border-amber-600 inline-block" />}
                        {stats.redCards > 0 && <span className="w-3 h-4 rounded-xs bg-red-600 border border-red-700 inline-block" />}
                      </div>
                      <div>
                        <span className="text-[10px] text-navy-muted uppercase font-bold block">Cards</span>
                        <span className="text-xs font-bold text-white">
                          {stats.yellowCards > 0 ? `${stats.yellowCards} Yellow` : ''}
                          {stats.redCards > 0 ? ` ${stats.redCards} Red` : ''}
                        </span>
                      </div>
                    </div>
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

// Player Node on Pitch (Rule 8: Shirt icon with number, 2-line name label >= 12px, events only from real events)
function PitchPlayerNode({ player, stats, shirtColor, isGK = false, onClick }) {
  const shortName = player.name.split(' ')[0] || player.name;

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center group cursor-pointer focus:outline-hidden min-h-[44px] min-w-[44px] transition active:scale-95"
      aria-label={`${player.name} #${player.num} ${player.pos}`}
    >
      <div className="relative">
        <JerseyShirtIcon
          number={player.num}
          color={shirtColor}
          isGK={isGK}
          captain={player.captain}
          className="w-9 h-9 sm:w-10 sm:h-10 transition-transform group-hover:scale-105"
        />

        {/* Real Goal Badge (Data Rule 1: Only if player has real goal events) */}
        {stats?.goals > 0 && (
          <div className="absolute -bottom-1 -right-2 px-1 rounded-full text-[9px] font-mono bg-emerald-600 text-white font-black border border-white shadow-2xs">
            ⚽ {stats.goals}
          </div>
        )}

        {/* Real Card Badge (Data Rule 1: Only if player has real card events) */}
        {stats?.yellowCards > 0 && (
          <div className="absolute -top-1 -right-1 w-2.5 h-3.5 rounded-2xs bg-amber-400 border border-amber-600 shadow-2xs" />
        )}
        {stats?.redCards > 0 && (
          <div className="absolute -top-1 -right-1 w-2.5 h-3.5 rounded-2xs bg-red-600 border border-red-700 shadow-2xs" />
        )}
      </div>

      {/* 2-Line Name Label with Plain Background (Rule 8: >= 12px, no ellipsis) */}
      <div className="mt-1 px-1.5 py-0.5 rounded-md bg-navy-950/90 text-white text-[12px] font-sports font-bold tracking-tight text-center leading-tight shadow-xs max-w-[85px]">
        {shortName}
      </div>
    </button>
  );
}
