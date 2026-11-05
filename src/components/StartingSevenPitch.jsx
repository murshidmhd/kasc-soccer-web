import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  X, 
  Info,
  Calendar,
  AlertTriangle,
  ShieldAlert
} from 'lucide-react';
import TeamLogo from './TeamLogo';
import { getStoredMatchState } from '../utils/matchStateManager';
import { getPlayerDisciplinaryStatus, getAllDisciplinaryRecords } from '../utils/disciplinaryManager';
import { SHOW_LINEUPS } from '../config/siteConfig';
import { openingMatch } from '../data/tournamentData';

// Inline SVG Shirt Icon with Shirt Number (Rule 8)
function JerseyShirtIcon({ 
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
          className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-gold text-navy-900 text-[9px] font-black font-sports flex items-center justify-center border border-white shadow-2xs"
          title="Team Captain"
        >
          C
        </span>
      )}
    </div>
  );
}

// Official Opening Match & Tournament Squads (KRSC vs BASE PERUMBAVUR Match 1 Focus)
const TOURNAMENT_SQUADS = {
  krsc: {
    id: 'krsc',
    name: 'KRSC KOZHIKKODE',
    shortName: 'KRSC',
    nameMl: 'കെ.ആർ.എസ്.സി കോഴിക്കോട്',
    shirtColor: '#EAB308', // Gold / Yellow
    status: 'confirmed',
    confirmedAt: '06 Nov 7:00 PM',
    formation: '1-2-2-2',
    starting: [
      { num: 1, name: 'Jithin', pos: 'GK', captain: false, isGK: true },
      { num: 4, name: 'Midhun', pos: 'CB', captain: false },
      { num: 3, name: 'Rahul K.', pos: 'RB', captain: false },
      { num: 7, name: 'Favas', pos: 'CM', captain: false },
      { num: 8, name: 'Vysakh', pos: 'AM', captain: false },
      { num: 11, name: 'Arjun', pos: 'WF', captain: false },
      { num: 10, name: 'Rujeesh K.', pos: 'ST', captain: true }
    ],
    subs: [
      { num: 14, name: 'Abhijith' },
      { num: 15, name: 'Sarath' },
      { num: 18, name: 'Nithin' }
    ]
  },
  base: {
    id: 'base',
    name: 'BASE PERUMBAVUR',
    shortName: 'BASE',
    nameMl: 'ബേസ് പെരുമ്പാവൂർ',
    shirtColor: '#1E3A8A', // Deep Blue
    status: 'confirmed',
    confirmedAt: '06 Nov 7:00 PM',
    formation: '1-2-2-2',
    starting: [
      { num: 1, name: 'Aneesh', pos: 'GK', captain: false, isGK: true },
      { num: 4, name: 'Shibil', pos: 'CB', captain: false },
      { num: 5, name: 'Musthafa', pos: 'SW', captain: false },
      { num: 11, name: 'Ajmal', pos: 'CM', captain: false },
      { num: 7, name: 'Bilal', pos: 'WF', captain: false },
      { num: 9, name: 'Musthu', pos: 'ST', captain: false },
      { num: 10, name: 'Usman K. P.', pos: 'CF', captain: true }
    ],
    subs: [
      { num: 22, name: 'Suhair' },
      { num: 6, name: 'Jameel' },
      { num: 8, name: 'Nabeel' },
      { num: 14, name: 'Nizar' },
      { num: 17, name: 'Ajmal Jr' }
    ]
  },
  udaya: {
    id: 'udaya',
    name: 'UDAYA PARAMBIL PEEDIKA',
    shortName: 'UDAYA',
    nameMl: 'ഉദയ പറമ്പിൽ പീടിക',
    shirtColor: '#7C3AED', // Purple
    status: 'confirmed',
    confirmedAt: '06 Nov 6:30 PM',
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
  }
};

export default function StartingSevenPitch({ lang, isDarkMode }) {
  const [selectedTeamKey, setSelectedTeamKey] = useState('base'); // Default to BASE PERUMBAVUR / Usman
  const [activePlayer, setActivePlayer] = useState(null);
  const [matchEvents, setMatchEvents] = useState([]);
  const [disciplinaryCards, setDisciplinaryCards] = useState(() => getAllDisciplinaryRecords());

  // Listen to match updates and disciplinary card updates
  useEffect(() => {
    const currentState = getStoredMatchState();
    if (currentState?.events) {
      setMatchEvents(currentState.events);
    }

    const handleMatchUpdate = (e) => {
      if (e.detail?.events) {
        setMatchEvents(e.detail.events);
      }
      setDisciplinaryCards(getAllDisciplinaryRecords());
    };

    const handleDisciplinaryUpdate = () => {
      setDisciplinaryCards(getAllDisciplinaryRecords());
    };

    window.addEventListener('kasc_match_state_updated', handleMatchUpdate);
    window.addEventListener('kasc_disciplinary_updated', handleDisciplinaryUpdate);
    return () => {
      window.removeEventListener('kasc_match_state_updated', handleMatchUpdate);
      window.removeEventListener('kasc_disciplinary_updated', handleDisciplinaryUpdate);
    };
  }, []);

  if (!SHOW_LINEUPS) return null;

  const currentSquad = TOURNAMENT_SQUADS[selectedTeamKey] || TOURNAMENT_SQUADS.base;

  // Helper to compute goals & cards strictly from REAL MATCH EVENTS & DISCIPLINARY DB
  const getPlayerStatsAndDisciplinary = (playerName, playerNum) => {
    let goals = 0;
    const lowerName = (playerName || '').toLowerCase();
    const numStr = String(playerNum || '');

    // Check goals from match events
    (matchEvents || []).forEach((evt) => {
      const evtPlayer = (evt.player || evt.scorerName || '').toLowerCase();
      if ((evtPlayer && (evtPlayer.includes(lowerName) || lowerName.includes(evtPlayer))) || (evt.playerNumber && String(evt.playerNumber) === numStr)) {
        if (evt.type === 'goal') goals += 1;
      }
    });

    // Check disciplinary cards from dedicated database
    const disciplinary = getPlayerDisciplinaryStatus(playerName, playerNum, currentSquad.name);

    return {
      goals,
      disciplinary,
      hasRedCard: disciplinary.hasRedCard,
      hasYellowCard: disciplinary.hasYellowCard,
      isSuspended: disciplinary.isSuspended,
      latestCard: disciplinary.latestCard
    };
  };

  // Group 7 players by Tactical Rows for 1-2-2-2
  const attackers = currentSquad.starting.filter(p => ['ST', 'CF', 'WF'].includes(p.pos));
  const midfielders = currentSquad.starting.filter(p => ['CM', 'AM', 'MF'].includes(p.pos));
  const defenders = currentSquad.starting.filter(p => ['CB', 'RB', 'LB', 'SW'].includes(p.pos));
  const goalkeepers = currentSquad.starting.filter(p => p.isGK || p.pos === 'GK');

  const isValidSeven = currentSquad.starting.length === 7;

  return (
    <section id="pitch-lineup" className="rounded-3xl border border-surface-border dark:border-navy-700 surface-card p-3 sm:p-5 shadow-card space-y-4">
      {/* 1. Header with Title & Lineup Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-border dark:border-navy-700 pb-3">
        <div>
          <h3 className="text-base sm:text-lg font-black font-sports uppercase tracking-wider text-card-title leading-tight">
            {lang === 'ml' ? 'സ്റ്റാർട്ടിംഗ് 7 ലൈനപ്പ്' : 'STARTING 7 LINEUP'}
          </h3>
          <p className="text-xs text-card-muted font-medium mt-0.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span>
              {lang === 'ml' ? `ലൈനപ്പ് സ്ഥിരീകരിച്ചു (${currentSquad.confirmedAt})` : `Lineup confirmed (${currentSquad.confirmedAt})`}
            </span>
          </p>
        </div>

        {/* Legend Row above Pitch */}
        <div className="flex items-center gap-3 text-xs text-card-muted font-sports font-semibold">
          <span className="flex items-center gap-1">
            <span className="text-xs">⚽</span>
            <span>Goal</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-3.5 rounded-xs bg-amber-400 inline-block border border-amber-600" />
            <span>Yellow</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-3.5 rounded-xs bg-red-600 inline-block border border-red-700" />
            <span>Red</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3.5 h-3.5 rounded-full bg-gold text-navy-900 text-[8px] font-black inline-flex items-center justify-center">C</span>
            <span>Captain</span>
          </span>
        </div>
      </div>

      {/* 2. Team Switcher (Match 1 Stars: BASE PERUMBAVUR & KRSC KOZHIKKODE + UDAYA) */}
      <div className="p-1 rounded-2xl bg-surface-light dark:bg-navy-800 border border-surface-border dark:border-navy-700 grid grid-cols-3 gap-1.5">
        <button
          onClick={() => { setSelectedTeamKey('base'); setActivePlayer(null); }}
          className={`min-h-[44px] px-2.5 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95 ${
            selectedTeamKey === 'base'
              ? 'btn-royal text-white shadow-xs font-black'
              : 'text-card-muted hover:text-card-title'
          }`}
          aria-label="View Base Perumbavur Lineup"
        >
          <div className="w-5 h-5 rounded-full bg-white p-0.5 border border-surface-border dark:border-navy-700 shadow-2xs flex items-center justify-center shrink-0">
            <TeamLogo teamName="BASE PERUMBAVUR" className="w-full h-full rounded-full object-contain" />
          </div>
          <span className="truncate">BASE</span>
        </button>

        <button
          onClick={() => { setSelectedTeamKey('krsc'); setActivePlayer(null); }}
          className={`min-h-[44px] px-2.5 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95 ${
            selectedTeamKey === 'krsc'
              ? 'btn-royal text-white shadow-xs font-black'
              : 'text-card-muted hover:text-card-title'
          }`}
          aria-label="View KRSC Kozhikode Lineup"
        >
          <div className="w-5 h-5 rounded-full bg-white p-0.5 border border-surface-border dark:border-navy-700 shadow-2xs flex items-center justify-center shrink-0">
            <TeamLogo teamName="KRSC KOZHIKKODE" className="w-full h-full rounded-full object-contain" />
          </div>
          <span className="truncate">KRSC</span>
        </button>

        <button
          onClick={() => { setSelectedTeamKey('udaya'); setActivePlayer(null); }}
          className={`min-h-[44px] px-2.5 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95 ${
            selectedTeamKey === 'udaya'
              ? 'btn-royal text-white shadow-xs font-black'
              : 'text-card-muted hover:text-card-title'
          }`}
          aria-label="View Udaya Parambil Peedika Lineup"
        >
          <div className="w-5 h-5 rounded-full bg-white p-0.5 border border-surface-border dark:border-navy-700 shadow-2xs flex items-center justify-center shrink-0">
            <TeamLogo teamName="UDAYA PARAMBIL PEEDIKA" className="w-full h-full rounded-full object-contain" />
          </div>
          <span className="truncate">UDAYA</span>
        </button>
      </div>

      {/* 3. Tactical Pitch */}
      {isValidSeven ? (
        <div 
          className="relative w-full rounded-3xl overflow-hidden border-2 border-emerald-800/80 shadow-md h-[355px] flex flex-col justify-between py-3 px-2 select-none"
          style={{
            background: 'repeating-linear-gradient(to bottom, #15803d 0px, #15803d 35px, #16a34a 35px, #16a34a 70px)'
          }}
        >
          {/* Turf Markings */}
          <div className="absolute inset-x-2 top-0 h-10 border-b border-x border-white/40 rounded-b-xl pointer-events-none" />
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-white/50 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border border-white/50 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/70 pointer-events-none" />
          <div className="absolute inset-x-2 bottom-0 h-10 border-t border-x border-white/40 rounded-t-xl pointer-events-none" />

          {/* Row 1: Attackers (Top of tactical field) */}
          <div className="relative z-10 flex items-center justify-around px-4">
            {attackers.map((player) => (
              <PitchPlayerNode
                key={`${player.num}-${player.name}`}
                player={player}
                playerInfo={getPlayerStatsAndDisciplinary(player.name, player.num)}
                shirtColor={currentSquad.shirtColor}
                onClick={() => setActivePlayer(player)}
              />
            ))}
          </div>

          {/* Row 2: Midfielders */}
          <div className="relative z-10 flex items-center justify-around px-6">
            {midfielders.map((player) => (
              <PitchPlayerNode
                key={`${player.num}-${player.name}`}
                player={player}
                playerInfo={getPlayerStatsAndDisciplinary(player.name, player.num)}
                shirtColor={currentSquad.shirtColor}
                onClick={() => setActivePlayer(player)}
              />
            ))}
          </div>

          {/* Row 3: Defenders */}
          <div className="relative z-10 flex items-center justify-around px-6">
            {defenders.map((player) => (
              <PitchPlayerNode
                key={`${player.num}-${player.name}`}
                player={player}
                playerInfo={getPlayerStatsAndDisciplinary(player.name, player.num)}
                shirtColor={currentSquad.shirtColor}
                onClick={() => setActivePlayer(player)}
              />
            ))}
          </div>

          {/* Row 4: Goalkeeper */}
          <div className="relative z-10 flex items-center justify-center">
            {goalkeepers.map((player) => (
              <PitchPlayerNode
                key={`${player.num}-${player.name}`}
                player={player}
                playerInfo={getPlayerStatsAndDisciplinary(player.name, player.num)}
                shirtColor={currentSquad.shirtColor}
                isGK={true}
                onClick={() => setActivePlayer(player)}
              />
            ))}
          </div>
        </div>
      ) : null}

      {/* 4. Substitutes Bench */}
      <div className="space-y-2 pt-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-card-muted block">
          {lang === 'ml' ? 'പകരക്കാർ (സബ്സ്റ്റിറ്റ്യൂട്ട്സ്)' : 'Substitutes Bench'}
        </span>
        <div className="flex items-center gap-2 overflow-x-auto horizontal-scroll-container py-1">
          {currentSquad.subs.map((sub) => {
            const playerInfo = getPlayerStatsAndDisciplinary(sub.name, sub.num);
            return (
              <button
                key={`${sub.num}-${sub.name}`}
                onClick={() => setActivePlayer({ ...sub, pos: 'SUB' })}
                className={`min-h-[44px] px-3 py-1.5 rounded-xl border flex items-center gap-2 shrink-0 transition active:scale-95 text-xs ${
                  playerInfo.hasRedCard
                    ? 'bg-red-500/15 border-red-500/40 text-red-500 font-bold'
                    : 'bg-surface-light dark:bg-navy-800 border-surface-border dark:border-navy-700 text-card-title hover:border-royal'
                }`}
              >
                <JerseyShirtIcon
                  number={sub.num}
                  color={currentSquad.shirtColor}
                  className="w-6 h-6"
                  hasRedCard={playerInfo.hasRedCard}
                />
                <span className="font-bold truncate max-w-[100px]">{sub.name}</span>
                {playerInfo.hasRedCard && <span className="text-xs">🟥</span>}
                {playerInfo.hasYellowCard && !playerInfo.hasRedCard && <span className="text-xs">🟨</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Player Details Bottom Sheet Modal (Triggered on Click) */}
      {activePlayer && (
        <div 
          onClick={() => setActivePlayer(null)}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-xs animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md surface-navy-card border-t sm:border border-navy-700 rounded-t-3xl sm:rounded-3xl p-5 text-white shadow-2xl space-y-4 animate-slideUp"
            style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom, 16px))' }}
          >
            {/* Handle Bar */}
            <div className="w-12 h-1.5 rounded-full bg-navy-600/80 mx-auto mb-1 sm:hidden" />

            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-navy-700">
              <div className="flex items-center gap-3">
                <JerseyShirtIcon
                  number={activePlayer.num}
                  color={currentSquad.shirtColor}
                  isGK={activePlayer.isGK}
                  captain={activePlayer.captain}
                  hasRedCard={getPlayerStatsAndDisciplinary(activePlayer.name, activePlayer.num).hasRedCard}
                  className="w-12 h-12"
                />
                <div>
                  <h4 className="text-base sm:text-lg font-black font-sports uppercase text-white leading-tight">
                    {activePlayer.name}
                  </h4>
                  <p className="text-xs text-gold font-sports font-bold mt-0.5">
                    #{activePlayer.num} • {activePlayer.pos} {activePlayer.captain ? '(Captain)' : ''}
                  </p>
                  <p className="text-[11px] text-navy-muted">
                    {currentSquad.name}
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
              const info = getPlayerStatsAndDisciplinary(activePlayer.name, activePlayer.num);
              const { disciplinary, goals, hasRedCard, hasYellowCard } = info;
              const hasAnyEvents = goals > 0 || hasRedCard || hasYellowCard;

              return (
                <div className="space-y-3">
                  {/* RED CARD PROMINENT BANNER (User Request: must show when user clicks player) */}
                  {hasRedCard && (
                    <div className="p-4 rounded-2xl bg-red-600/20 border-2 border-red-500/80 text-white space-y-2.5 shadow-lg shadow-red-950/50 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl animate-pulse">🟥</span>
                          <div>
                            <span className="text-[11px] font-black uppercase text-red-400 block tracking-wider">
                              {lang === 'ml' ? 'റഫറി ചുവപ്പ് കാർഡ് നൽകി' : 'OFFICIAL RED CARD BOOKING'}
                            </span>
                            <h5 className="text-sm font-black text-white">
                              {lang === 'ml' ? 'കളത്തിൽ നിന്ന് പുറത്തായി (Suspension)' : 'Expelled & Match Suspended'}
                            </h5>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg bg-red-600 text-white font-mono font-black text-xs shadow-xs">
                          {disciplinary.latestCard?.minute}'
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-navy-950/60 border border-red-500/30 text-xs space-y-1">
                        <div className="flex items-center justify-between text-red-200">
                          <span className="font-bold">{lang === 'ml' ? 'കാരണം:' : 'Reason:'}</span>
                          <span>{disciplinary.latestCard?.reason || 'Tactical foul dismissal'}</span>
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
                          {disciplinary.latestCard?.minute}'
                        </span>
                      </div>
                      <p className="text-xs text-amber-200">
                        {disciplinary.latestCard?.reason || 'Caution for tactical challenge'}
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

                  {/* No events placeholder */}
                  {!hasAnyEvents && (
                    <p className="text-xs text-navy-muted font-medium py-2 text-center bg-navy-800/40 rounded-2xl border border-navy-700">
                      {lang === 'ml' ? 'ഈ കളിക്കാരന് ഡിസിപ്ലിനറി കാർഡുകളോ ഗോളുകളോ ഇല്ല.' : 'No disciplinary cards or goals recorded for this player.'}
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

// Player Node on Pitch
function PitchPlayerNode({ player, playerInfo, shirtColor, isGK = false, onClick }) {
  const shortName = player.name.split(' ')[0] || player.name;
  const hasRedCard = playerInfo?.hasRedCard;
  const hasYellowCard = playerInfo?.hasYellowCard;

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center group cursor-pointer focus:outline-hidden min-h-[44px] min-w-[44px] transition active:scale-95 relative ${
        hasRedCard ? 'ring-2 ring-red-500 rounded-2xl p-1 bg-red-950/40' : ''
      }`}
      aria-label={`${player.name} #${player.num} ${player.pos}`}
    >
      <div className="relative">
        <JerseyShirtIcon
          number={player.num}
          color={shirtColor}
          isGK={isGK}
          captain={player.captain}
          hasRedCard={hasRedCard}
          className="w-9 h-9 sm:w-10 sm:h-10 transition-transform group-hover:scale-105"
        />

        {/* Real Goal Badge */}
        {playerInfo?.goals > 0 && (
          <div className="absolute -bottom-1 -right-2 px-1 rounded-full text-[9px] font-mono bg-emerald-600 text-white font-black border border-white shadow-2xs">
            ⚽ {playerInfo.goals}
          </div>
        )}

        {/* Real Card Badge */}
        {hasRedCard && (
          <div className="absolute -top-1 -right-1 w-3 h-4 rounded-xs bg-red-600 border border-white shadow-md flex items-center justify-center animate-pulse">
            <span className="text-[8px] font-black text-white">R</span>
          </div>
        )}
        {!hasRedCard && hasYellowCard && (
          <div className="absolute -top-1 -right-1 w-2.5 h-3.5 rounded-2xs bg-amber-400 border border-amber-600 shadow-2xs" />
        )}
      </div>

      {/* 2-Line Name Label */}
      <div className={`mt-1 px-1.5 py-0.5 rounded-md text-[12px] font-sports font-bold tracking-tight text-center leading-tight shadow-xs max-w-[85px] ${
        hasRedCard 
          ? 'bg-red-700 text-white border border-red-500' 
          : 'bg-navy-950/90 text-white'
      }`}>
        {shortName}
        {hasRedCard && <span className="block text-[8px] uppercase tracking-wider text-amber-200">OUT</span>}
      </div>
    </button>
  );
}
