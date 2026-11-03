import React, { useState } from 'react';
import { 
  Shield, 
  Users, 
  Trophy, 
  ChevronRight, 
  Info, 
  X, 
  BarChart3, 
  LayoutGrid, 
  Flame, 
  Award
} from 'lucide-react';
import TeamLogo from './TeamLogo';

export default function StartingSevenPitch({ lang, isDarkMode }) {
  const [selectedTeam, setSelectedTeam] = useState('home'); // 'home' | 'away'
  const [viewMode, setViewMode] = useState('pitch'); // 'pitch' | 'table'
  const [activePlayer, setActivePlayer] = useState(null);

  const homeSquad = {
    name: 'UDAYA Parambil Peedika',
    formation: '2 - 2 - 2 (Tactical 7s)',
    manager: 'K. M. Basheer',
    coach: 'Majeed Master',
    kit: 'Purple & Red Stripes',
    starting: [
      { 
        num: 1, 
        name: 'Shamseer', 
        role: 'Goalkeeper', 
        pos: 'GK', 
        country: '🇮🇳 India', 
        goals: 0,
        cards: 'None',
        desc: 'Shot-stopper, Penalty Specialist' 
      },
      { 
        num: 4, 
        name: 'Shameer K.', 
        role: 'Center Back', 
        pos: 'CB', 
        country: '🇮🇳 Malappuram', 
        goals: 1,
        cards: 'None',
        desc: 'Vice Captain, Aerial Defender', 
        captain: false 
      },
      { 
        num: 3, 
        name: 'Faisal M.', 
        role: 'Right Back', 
        pos: 'RB', 
        country: '🇮🇳 Calicut', 
        goals: 0,
        cards: 'None',
        desc: 'Pacy tackling flank defender' 
      },
      { 
        num: 7, 
        name: 'Riyas K.', 
        role: 'Central Midfielder', 
        pos: 'CM', 
        country: '🇮🇳 Malappuram', 
        goals: 0,
        cards: 'None',
        desc: 'Captain & Midfield Playmaker', 
        captain: true 
      },
      { 
        num: 8, 
        name: 'Suhail P.', 
        role: 'Attacking Midfielder', 
        pos: 'AM', 
        country: '🇮🇳 Wayanad', 
        goals: 0,
        cards: 'None',
        desc: 'Creative play distributor' 
      },
      { 
        num: 9, 
        name: 'Ibrahim Soumahoro', 
        role: 'Center Forward', 
        pos: 'ST', 
        country: '🇨🇮 Ivory Coast', 
        goals: 1,
        cards: 'None',
        desc: 'Marquee International Striker' 
      },
      { 
        num: 10, 
        name: 'Asif Ali', 
        role: 'Second Striker', 
        pos: 'CF', 
        country: '🇮🇳 Malappuram', 
        goals: 0,
        cards: 'None',
        desc: 'Rapid dribbler, clinical finisher' 
      }
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
      { 
        num: 1, 
        name: 'Aneesh', 
        role: 'Goalkeeper', 
        pos: 'GK', 
        country: '🇮🇳 Kozhikode', 
        goals: 0,
        cards: 'None',
        desc: 'Agile Reflex Specialist' 
      },
      { 
        num: 5, 
        name: 'Musthafa', 
        role: 'Center Back', 
        pos: 'CB', 
        country: '🇮🇳 Malappuram', 
        goals: 0,
        cards: 'None',
        desc: 'Aerial Dominator' 
      },
      { 
        num: 6, 
        name: 'Jameel', 
        role: 'Sweeper Back', 
        pos: 'SW', 
        country: '🇮🇳 Wayanad', 
        goals: 1,
        cards: 'None',
        desc: 'Defensive Anchor' 
      },
      { 
        num: 8, 
        name: 'Nabeel', 
        role: 'Box-to-Box MF', 
        pos: 'CM', 
        country: '🇮🇳 Kozhikode', 
        goals: 0,
        cards: 'None',
        desc: 'High stamina midfield workhorse' 
      },
      { 
        num: 10, 
        name: 'Rashid', 
        role: 'Creative Playmaker', 
        pos: 'AM', 
        country: '🇮🇳 Malappuram', 
        goals: 0,
        cards: 'Yellow',
        desc: 'Captain & set-piece taker', 
        captain: true 
      },
      { 
        num: 11, 
        name: 'Basith', 
        role: 'Winger Forward', 
        pos: 'WF', 
        country: '🇮🇳 Kannur', 
        goals: 0,
        cards: 'None',
        desc: 'Pacy counter-attack winger' 
      },
      { 
        num: 9, 
        name: 'Usman', 
        role: 'Striker', 
        pos: 'ST', 
        country: '🇳🇬 Nigeria', 
        goals: 0,
        cards: 'None',
        desc: 'Power striker, Target Man' 
      }
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
      {/* Official Lineup Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <Shield className="w-3 h-3 text-blue-600" />
              <span>Official Matchday Lineup</span>
            </span>
            <span className="text-xs text-slate-500 font-bold">Referee Desk Records</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black font-sports uppercase tracking-wider text-slate-950 mt-1">
            {lang === 'ml' ? 'സ്റ്റാർട്ടിംഗ് 7 ലൈനപ്പ്' : 'STARTING 7 LINEUP'}
          </h3>
          <p className="text-xs text-slate-500">
            {lang === 'ml' 
              ? 'ഒഫീഷ്യൽ റഫറി ഡെസ്‌ക് രേഖപ്പെടുത്തിയ കളിക്കാരും പകരക്കാരും (ഗോളുകൾ, കാർഡുകൾ, സബ്‌സ്റ്റിറ്റ്യൂഷനുകൾ)' 
              : 'Official starting seven, substitutes bench, match goals and cards verified at the referee desk'}
          </p>
        </div>

        {/* View Mode Toggle: Pitch vs Squad List */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <div className="bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-bold flex items-center">
            <button
              onClick={() => setViewMode('pitch')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                viewMode === 'pitch' ? 'bg-white text-blue-700 shadow-2xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{lang === 'ml' ? 'ഗ്രൗണ്ട് പിച്ച്' : 'Pitch'}</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                viewMode === 'table' ? 'bg-white text-blue-700 shadow-2xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>{lang === 'ml' ? 'സ്ക്വാഡ് ലിസ്റ്റ്' : 'Squad List'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Official Match Authority Notice */}
      <div className="p-2.5 rounded-2xl bg-blue-50/80 border border-blue-200/60 text-blue-900 text-xs flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-medium">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            {lang === 'ml'
              ? 'യഥാർത്ഥ മാച്ച് റെക്കോർഡുകൾ (ഗോളുകൾ, കാർഡുകൾ, സബ്‌സ്റ്റിറ്റ്യൂഷനുകൾ) ഒഫീഷ്യൽ റഫറി ഡെസ്‌ക് രേഖപ്പെടുത്തുന്നു.'
              : 'Official match facts (goals, cards, substitutions) recorded directly by the referee desk.'}
          </span>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-blue-200 text-blue-950 font-bold text-[9px] uppercase tracking-wider shrink-0">
          Official Desk
        </span>
      </div>

      {/* Team Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setSelectedTeam('home'); setActivePlayer(null); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              selectedTeam === 'home' ? 'bg-purple-700 text-white shadow-xs font-black' : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <TeamLogo teamName="UDAYA PARAMBIL PEEDIKA" className="w-5 h-5 rounded-md" />
            <span>UDAYA</span>
          </button>
          <button
            onClick={() => { setSelectedTeam('away'); setActivePlayer(null); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              selectedTeam === 'away' ? 'bg-zinc-900 text-white shadow-xs font-black' : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <TeamLogo teamName="NEW MALAYA MALABAR FC" className="w-5 h-5 rounded-md" />
            <span>NEW MALAYA</span>
          </button>
        </div>

        <div className="text-xs text-slate-600 font-bold flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-wider text-slate-500">Formation:</span>
          <span className="px-2 py-0.5 rounded-lg bg-slate-200 text-slate-800 font-mono text-[11px]">
            {currentSquad.formation}
          </span>
        </div>
      </div>

      {/* VIEW 1: TACTICAL TURF PITCH VIEW */}
      {viewMode === 'pitch' && (
        <div className="relative w-full max-w-2xl mx-auto rounded-3xl overflow-hidden border-4 border-emerald-950 shadow-2xl bg-gradient-to-b from-emerald-800 via-emerald-700 to-emerald-800 p-4 sm:p-6 text-white min-h-[500px] sm:min-h-[540px] flex flex-col justify-between select-none animate-fadeIn">
          {/* Pitch Markings */}
          <div className="absolute inset-0 pointer-events-none opacity-25">
            <div className="w-full h-full flex flex-col">
              <div className="flex-1 bg-black/10"></div>
              <div className="flex-1 bg-transparent"></div>
              <div className="flex-1 bg-black/10"></div>
              <div className="flex-1 bg-transparent"></div>
              <div className="flex-1 bg-black/10"></div>
              <div className="flex-1 bg-transparent"></div>
            </div>
            <div className="absolute inset-4 border-2 border-white rounded-2xl"></div>
            <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-white"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 border-2 border-white rounded-full"></div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 h-20 border-2 border-b-0 border-white rounded-t-xl"></div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-24 h-4 border-2 border-b-0 border-amber-300 bg-amber-300/20"></div>
          </div>

          {/* Top Banner */}
          <div className="relative z-10 flex items-center justify-between text-xs">
            <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-sports font-black tracking-wide">{currentSquad.name}</span>
            </div>
            <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-[11px] font-mono text-amber-300">
              {currentSquad.formation}
            </div>
          </div>

          {/* Player Nodes on Pitch */}
          <div className="relative z-10 flex flex-col justify-around py-2 h-[410px]">
            {/* 1. Attackers */}
            <div className="flex items-center justify-around px-8">
              {currentSquad.starting.filter(p => p.pos === 'ST' || p.pos === 'CF' || p.pos === 'WF').map(player => (
                <TurfPlayerNode 
                  key={player.num} 
                  player={player} 
                  isHome={selectedTeam === 'home'} 
                  isActive={activePlayer?.num === player.num}
                  onClick={() => setActivePlayer(player)} 
                />
              ))}
            </div>

            {/* 2. Midfielders */}
            <div className="flex items-center justify-around px-12">
              {currentSquad.starting.filter(p => p.pos === 'CM' || p.pos === 'AM').map(player => (
                <TurfPlayerNode 
                  key={player.num} 
                  player={player} 
                  isHome={selectedTeam === 'home'} 
                  isActive={activePlayer?.num === player.num}
                  onClick={() => setActivePlayer(player)} 
                />
              ))}
            </div>

            {/* 3. Defenders */}
            <div className="flex items-center justify-around px-6">
              {currentSquad.starting.filter(p => p.pos === 'CB' || p.pos === 'RB' || p.pos === 'SW').map(player => (
                <TurfPlayerNode 
                  key={player.num} 
                  player={player} 
                  isHome={selectedTeam === 'home'} 
                  isActive={activePlayer?.num === player.num}
                  onClick={() => setActivePlayer(player)} 
                />
              ))}
            </div>

            {/* 4. Goalkeeper */}
            <div className="flex items-center justify-center">
              {currentSquad.starting.filter(p => p.pos === 'GK').map(player => (
                <TurfPlayerNode 
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

          {/* Legend Bar */}
          <div className="relative z-10 flex items-center justify-between text-[10px] text-emerald-100/90 bg-black/50 backdrop-blur-xs py-1.5 px-3 rounded-full border border-white/10">
            <span>💡 Tap any player for profile</span>
            <div className="flex items-center gap-2 font-bold font-mono">
              <span className="flex items-center gap-1">⚽ Goal Scorer</span>
              <span className="flex items-center gap-1">🟨 Card</span>
              <span className="flex items-center gap-1">C Captain</span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: OFFICIAL SQUAD TABLE */}
      {viewMode === 'table' && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white animate-fadeIn">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Player</th>
                <th className="py-2.5 px-2">Pos</th>
                <th className="py-2.5 px-2 text-center">Goals</th>
                <th className="py-2.5 px-2 text-center">Cards</th>
                <th className="py-2.5 px-3 text-right">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentSquad.starting.map((p) => {
                const isSelected = activePlayer?.num === p.num;
                return (
                  <tr 
                    key={p.num}
                    onClick={() => setActivePlayer(p)}
                    className={`cursor-pointer transition hover:bg-blue-50/50 ${isSelected ? 'bg-blue-50' : ''}`}
                  >
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-sports font-black text-slate-800 text-xs w-5 text-center">
                          #{p.num}
                        </span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900">{p.name}</span>
                            {p.captain && (
                              <span className="px-1 py-0.2 bg-amber-400 text-slate-950 text-[9px] font-black rounded">
                                C
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400">{p.country}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-2">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono font-bold text-[10px]">
                        {p.pos}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-center font-bold text-slate-900">
                      {p.goals ? `⚽ ${p.goals}` : '-'}
                    </td>
                    <td className="py-2.5 px-2 text-center font-bold text-slate-900">
                      {p.cards !== 'None' ? (p.cards === 'Yellow' ? '🟨' : '🟥') : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-right text-[11px] text-slate-600 font-medium">
                      {p.desc}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* OFFICIAL PLAYER MODAL / CARD */}
      {activePlayer && (
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 text-white border-2 border-slate-700 shadow-2xl space-y-4 animate-fadeIn select-none">
          {/* Top Bar */}
          <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-800 text-white font-black font-sports text-2xl flex items-center justify-center shadow-lg shrink-0">
                #{activePlayer.num}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-sports font-black text-lg sm:text-xl text-white">
                    {activePlayer.name}
                  </h4>
                  {activePlayer.captain && (
                    <span className="px-2 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-black rounded-full uppercase">
                      Captain (C)
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 font-bold mt-0.5">
                  {activePlayer.role} ({activePlayer.pos}) • {activePlayer.country}
                </p>
              </div>
            </div>

            <button
              onClick={() => setActivePlayer(null)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Official Match Records */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
              <span className="text-[10px] text-slate-400 block font-bold">Goals</span>
              <span className="text-sm font-black font-mono text-emerald-400">
                {activePlayer.goals ? `⚽ ${activePlayer.goals}` : '0'}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
              <span className="text-[10px] text-slate-400 block font-bold">Cards</span>
              <span className="text-sm font-black font-mono text-amber-300">
                {activePlayer.cards !== 'None' ? activePlayer.cards : 'None'}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
              <span className="text-[10px] text-slate-400 block font-bold">Squad Status</span>
              <span className="text-xs font-bold text-white block mt-0.5">Starting 7</span>
            </div>
          </div>

          {/* Profile Note */}
          <p className="text-xs text-slate-300 bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/60 leading-relaxed">
            📋 <strong>Role:</strong> {activePlayer.desc}
          </p>
        </div>
      )}

      {/* Bench Substitutes */}
      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2">
          <span className="uppercase tracking-wider">Substitutes Bench (പകരക്കാർ):</span>
          <span className="text-[10px] text-blue-700 font-bold">{currentSquad.subs.length} Subs Registered</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {currentSquad.subs.map(s => (
            <span key={s.num} className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs flex items-center gap-1.5">
              <span>#{s.num} {s.name}</span>
              <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px] font-mono">
                {s.role}
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// Tactical Player Node on Turf Pitch
function TurfPlayerNode({ player, isGK = false, isHome, isActive, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`group cursor-pointer flex flex-col items-center transition-all hover:scale-110 active:scale-95 ${
        isActive ? 'scale-115' : ''
      }`}
    >
      <div className="relative">
        {/* Jersey Circle */}
        <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-sports font-black text-sm sm:text-base border-2 shadow-lg transition-all ${
          isGK 
            ? 'bg-amber-400 text-slate-950 border-white'
            : isHome
              ? 'bg-gradient-to-br from-purple-600 to-indigo-900 text-white border-amber-300'
              : 'bg-gradient-to-br from-zinc-800 to-black text-white border-zinc-300'
        } ${isActive ? 'ring-4 ring-amber-400' : ''}`}>
          <span>{player.num}</span>
          {player.captain && (
            <span className="absolute -top-1 -left-1 w-4 h-4 bg-yellow-400 text-slate-950 text-[9px] font-black rounded-full flex items-center justify-center shadow-xs">
              C
            </span>
          )}
        </div>

        {/* Goal Badge if player scored */}
        {player.goals > 0 && (
          <div className="absolute -bottom-1 -right-2 px-1 rounded-full font-mono text-[9px] bg-emerald-600 text-white border border-white/60 font-bold shadow-xs">
            ⚽ {player.goals}
          </div>
        )}

        {/* Card Badge if player received card */}
        {player.cards === 'Yellow' && (
          <div className="absolute -top-1 -right-1 text-[10px]">
            🟨
          </div>
        )}
      </div>

      {/* Player Name Tag */}
      <div className="mt-1.5 px-1.5 py-0.2 rounded bg-black/80 backdrop-blur-xs text-[10px] font-bold text-white tracking-tight truncate max-w-[80px] sm:max-w-[95px] text-center border border-white/10 shadow-xs flex items-center justify-center gap-0.5">
        <span>{player.name.split(' ')[0]}</span>
      </div>
    </div>
  );
}
