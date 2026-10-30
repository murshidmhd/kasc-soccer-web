import React, { useState } from 'react';
import { Shield, Users, Trophy, ChevronRight, Info, X } from 'lucide-react';
import TeamLogo from './TeamLogo';
import { openingMatch } from '../data/tournamentData';

export default function StartingSevenPitch({ lang, isDarkMode, onClose }) {
  const [selectedTeam, setSelectedTeam] = useState('home'); // 'home' | 'away'
  const [activePlayer, setActivePlayer] = useState(null);

  const homeSquad = {
    name: 'UDAYA Parambil Peedika',
    formation: '2 - 2 - 2 (Tactical 7s)',
    manager: 'K. M. Basheer',
    coach: 'Majeed Master',
    kit: 'Purple & Red Stripes',
    starting: [
      { num: 1, name: 'Shamseer', role: 'Goalkeeper', pos: 'GK', country: '🇮🇳 India', desc: 'Shot-stopper, Penalty Specialist' },
      { num: 4, name: 'Shameer K.', role: 'Center Back', pos: 'CB', country: '🇮🇳 Malappuram', desc: 'Vice Captain, Header threat', captain: false },
      { num: 3, name: 'Faisal M.', role: 'Right Back', pos: 'RB', country: '🇮🇳 Calicut', desc: 'Pacy tackling defender' },
      { num: 7, name: 'Riyas K.', role: 'Central Midfielder', pos: 'CM', country: '🇮🇳 Malappuram', desc: 'Captain & Midfield Playmaker', captain: true },
      { num: 8, name: 'Suhail P.', role: 'Attacking Midfielder', pos: 'AM', country: '🇮🇳 Wayanad', desc: 'Through-ball specialist' },
      { num: 9, name: 'Ibrahim Soumahoro', role: 'Center Forward', pos: 'ST', country: '🇨🇮 Ivory Coast', desc: 'Marquee International Striker' },
      { num: 10, name: 'Asif Ali', role: 'Second Striker', pos: 'CF', country: '🇮🇳 Malappuram', desc: 'Rapid dribbler, clinical finisher' }
    ],
    subs: [
      { num: 13, name: 'Junaid', role: 'GK' },
      { num: 11, name: 'Salman', role: 'MF' },
      { num: 14, name: 'Anas', role: 'DF' },
      { num: 15, name: 'Haris', role: 'FW' },
      { num: 18, name: 'Rahul', role: 'MF' }
    ]
  };

  const awaySquad = {
    name: 'NEW MALAYA MALABAR FC',
    formation: '2 - 3 - 1 (Dynamic Counter)',
    manager: 'Aboobacker Master',
    coach: 'Siddique Master',
    kit: 'Black & White Stripes',
    starting: [
      { num: 1, name: 'Aneesh', role: 'Goalkeeper', pos: 'GK', country: '🇮🇳 Kozhikode', desc: 'Agile Reflex Specialist' },
      { num: 5, name: 'Musthafa', role: 'Center Back', pos: 'CB', country: '🇮🇳 Malappuram', desc: 'Aerial Dominator' },
      { num: 6, name: 'Jameel', role: 'Sweeper Back', pos: 'SW', country: '🇮🇳 Wayanad', desc: 'Defensive Anchor' },
      { num: 8, name: 'Nabeel', role: 'Box-to-Box MF', pos: 'CM', country: '🇮🇳 Kozhikode', desc: 'High stamina workhorse' },
      { num: 10, name: 'Rashid', role: 'Creative Playmaker', pos: 'AM', country: '🇮🇳 Malappuram', desc: 'Captain & freekick expert', captain: true },
      { num: 11, name: 'Basith', role: 'Winger Forward', pos: 'WF', country: '🇮🇳 Kannur', desc: 'Sprint speed 32 km/h' },
      { num: 9, name: 'Usman', role: 'Striker', pos: 'ST', country: '🇳🇬 Nigeria', desc: 'Power striker, Target Man' }
    ],
    subs: [
      { num: 22, name: 'Suhair', role: 'GK' },
      { num: 7, name: 'Shafeeq', role: 'MF' },
      { num: 14, name: 'Nizar', role: 'DF' },
      { num: 17, name: 'Ajmal', role: 'FW' },
      { num: 19, name: 'Irfan', role: 'MF' }
    ]
  };

  const currentSquad = selectedTeam === 'home' ? homeSquad : awaySquad;

  return (
    <section id="pitch-lineup" className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-7 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
              Premier League Style
            </span>
            <span className="text-xs text-slate-500 font-bold">Tactical 7s Pitch Board</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black font-sports uppercase tracking-wider text-slate-950 mt-1">
            {lang === 'ml' ? 'സ്റ്റാർട്ടിംഗ് 7 ടാക്റ്റിക്കൽ ലൈനപ്പ്' : 'STARTING 7 TACTICAL LINEUP'}
          </h3>
          <p className="text-xs text-slate-500">
            {lang === 'ml' 
              ? 'പച്ചപ്പുള്ള പിച്ചിൽ കളിക്കാരുടെ യഥാർത്ഥ പൊസിഷനുകളും ജേഴ്സി നമ്പറുകളും' 
              : 'Official starting seven tactical formation on turf pitch with player details'}
          </p>
        </div>

        {/* Team Selector Pills */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => { setSelectedTeam('home'); setActivePlayer(null); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              selectedTeam === 'home' ? 'bg-purple-700 text-white shadow-xs' : 'text-slate-700 hover:text-purple-700'
            }`}
          >
            <TeamLogo teamName="UDAYA PARAMBIL PEEDIKA" className="w-5 h-5 rounded-md" />
            <span>UDAYA</span>
          </button>
          <button
            onClick={() => { setSelectedTeam('away'); setActivePlayer(null); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              selectedTeam === 'away' ? 'bg-zinc-900 text-white shadow-xs' : 'text-slate-700 hover:text-zinc-900'
            }`}
          >
            <TeamLogo teamName="NEW MALAYA MALABAR FC" className="w-5 h-5 rounded-md" />
            <span>NEW MALAYA</span>
          </button>
        </div>
      </div>

      {/* Main Pitch View */}
      <div className="relative w-full max-w-2xl mx-auto rounded-3xl overflow-hidden border-4 border-emerald-950 shadow-2xl bg-gradient-to-b from-emerald-800 via-emerald-700 to-emerald-800 p-4 sm:p-6 text-white min-h-[480px] sm:min-h-[520px] flex flex-col justify-between select-none">
        {/* Subtle Pitch Markings */}
        <div className="absolute inset-0 pointer-events-none opacity-25">
          {/* Grass stripes */}
          <div className="w-full h-full flex flex-col">
            <div className="flex-1 bg-black/10"></div>
            <div className="flex-1 bg-transparent"></div>
            <div className="flex-1 bg-black/10"></div>
            <div className="flex-1 bg-transparent"></div>
            <div className="flex-1 bg-black/10"></div>
            <div className="flex-1 bg-transparent"></div>
          </div>
          {/* Pitch borders */}
          <div className="absolute inset-4 border-2 border-white rounded-2xl"></div>
          {/* Halfway line & center circle */}
          <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-white"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 border-2 border-white rounded-full"></div>
          {/* Penalty box at bottom */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 h-20 border-2 border-b-0 border-white rounded-t-xl"></div>
          {/* Goal post at bottom */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-24 h-4 border-2 border-b-0 border-amber-300 bg-amber-300/20"></div>
        </div>

        {/* Top Pitch Tag */}
        <div className="relative z-10 flex items-center justify-between text-xs">
          <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-sports font-black tracking-wide">{currentSquad.name}</span>
          </div>
          <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-[11px] font-mono text-amber-300">
            {currentSquad.formation}
          </div>
        </div>

        {/* Player Layout (Attackers -> Midfielders -> Defenders -> Goalkeeper) */}
        <div className="relative z-10 flex flex-col justify-around py-2 h-[400px]">
          {/* 1. Attackers (2 forwards) */}
          <div className="flex items-center justify-around px-8">
            {currentSquad.starting.filter(p => p.pos === 'ST' || p.pos === 'CF' || p.pos === 'WF').map(player => (
              <PlayerNode 
                key={player.num} 
                player={player} 
                isHome={selectedTeam === 'home'} 
                isActive={activePlayer?.num === player.num}
                onClick={() => setActivePlayer(player)} 
              />
            ))}
          </div>

          {/* 2. Midfielders (2 players) */}
          <div className="flex items-center justify-around px-12">
            {currentSquad.starting.filter(p => p.pos === 'CM' || p.pos === 'AM').map(player => (
              <PlayerNode 
                key={player.num} 
                player={player} 
                isHome={selectedTeam === 'home'} 
                isActive={activePlayer?.num === player.num}
                onClick={() => setActivePlayer(player)} 
              />
            ))}
          </div>

          {/* 3. Defenders (2 players) */}
          <div className="flex items-center justify-around px-6">
            {currentSquad.starting.filter(p => p.pos === 'CB' || p.pos === 'RB' || p.pos === 'SW').map(player => (
              <PlayerNode 
                key={player.num} 
                player={player} 
                isHome={selectedTeam === 'home'} 
                isActive={activePlayer?.num === player.num}
                onClick={() => setActivePlayer(player)} 
              />
            ))}
          </div>

          {/* 4. Goalkeeper (1 player) */}
          <div className="flex items-center justify-center">
            {currentSquad.starting.filter(p => p.pos === 'GK').map(player => (
              <PlayerNode 
                key={player.num} 
                player={player} 
                isGK={true} 
                isHome={selectedTeam === 'home'} 
                isActive={activePlayer?.num === player.num}
                onClick={() => setActivePlayer(player)} 
              />
            ))}
          </div>
        </div>

        {/* Tap Prompt Hint */}
        <div className="relative z-10 text-center text-[10px] text-emerald-100/90 font-medium bg-black/40 backdrop-blur-xs py-1 rounded-full border border-white/10">
          💡 Tap any player circle on pitch to view player card & role
        </div>
      </div>

      {/* Selected Player Detail Card (Modal / Banner) */}
      {activePlayer && (
        <div className="p-4 rounded-2xl bg-slate-900 text-white border border-amber-400/50 shadow-xl flex items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 text-slate-950 font-black font-sports text-xl flex items-center justify-center shadow-md">
              #{activePlayer.num}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-sports font-black text-base sm:text-lg text-white">
                  {activePlayer.name}
                </span>
                {activePlayer.captain && (
                  <span className="px-1.5 py-0.2 bg-amber-400 text-slate-950 text-[10px] font-black rounded uppercase">
                    Captain (C)
                  </span>
                )}
                <span className="text-xs">{activePlayer.country}</span>
              </div>
              <p className="text-xs text-amber-300 font-bold">
                {activePlayer.role} ({activePlayer.pos}) • {activePlayer.desc}
              </p>
            </div>
          </div>

          <button
            onClick={() => setActivePlayer(null)}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Bench Substitutes & Management */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
        {/* Substitutes Bench */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2">
            <span className="uppercase tracking-wider">Substitutes Bench (പകരക്കാർ):</span>
            <span className="text-[10px] text-blue-700 font-bold">5 Subs Ready</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {currentSquad.subs.map(s => (
              <span key={s.num} className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs">
                #{s.num} {s.name} <span className="text-[10px] text-slate-500">({s.role})</span>
              </span>
            ))}
          </div>
        </div>

        {/* Tactical Management */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">
              Official Team Management
            </span>
            <div className="text-xs font-bold text-slate-900 mt-0.5">
              Manager: <strong className="text-blue-700">{currentSquad.manager}</strong>
            </div>
            <div className="text-xs font-bold text-slate-600">
              Head Coach: <strong className="text-slate-800">{currentSquad.coach}</strong>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-500 block">Match Kit</span>
            <span className="text-xs font-black text-slate-800">{currentSquad.kit}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// Player Node on Pitch
function PlayerNode({ player, isGK = false, isHome, isActive, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`group cursor-pointer flex flex-col items-center transition-transform hover:scale-115 active:scale-95 ${
        isActive ? 'scale-120' : ''
      }`}
    >
      <div className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-sports font-black text-sm sm:text-base border-2 shadow-lg transition-all ${
        isGK 
          ? 'bg-amber-400 text-slate-950 border-white'
          : isHome
            ? 'bg-gradient-to-br from-purple-600 to-indigo-900 text-white border-amber-300'
            : 'bg-gradient-to-br from-zinc-800 to-black text-white border-zinc-300'
      } ${isActive ? 'ring-4 ring-amber-400 animate-pulse' : ''}`}>
        <span>{player.num}</span>
        {player.captain && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 text-slate-950 text-[9px] font-black rounded-full flex items-center justify-center shadow-xs">
            C
          </span>
        )}
      </div>
      <div className="mt-1 px-1.5 py-0.2 rounded bg-black/75 backdrop-blur-xs text-[10px] font-bold text-white tracking-tight truncate max-w-[80px] sm:max-w-[95px] text-center border border-white/10 shadow-xs">
        {player.name.split(' ')[0]}
      </div>
    </div>
  );
}
