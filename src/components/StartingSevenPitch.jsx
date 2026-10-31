import React, { useState } from 'react';
import { 
  Shield, 
  Users, 
  Trophy, 
  ChevronRight, 
  Info, 
  X, 
  Star, 
  Sparkles, 
  BarChart3, 
  LayoutGrid, 
  TrendingUp, 
  Flame, 
  Award,
  ThumbsUp
} from 'lucide-react';
import TeamLogo from './TeamLogo';
import confetti from 'canvas-confetti';

export default function StartingSevenPitch({ lang, isDarkMode }) {
  const [selectedTeam, setSelectedTeam] = useState('home'); // 'home' | 'away'
  const [viewMode, setViewMode] = useState('pitch'); // 'pitch' | 'table'
  const [activePlayer, setActivePlayer] = useState(null);
  const [fanVotes, setFanVotes] = useState({});

  const homeSquad = {
    name: 'UDAYA Parambil Peedika',
    formation: '2 - 2 - 2 (Tactical 7s)',
    manager: 'K. M. Basheer',
    coach: 'Majeed Master',
    kit: 'Purple & Red Stripes',
    teamRating: 8.1,
    starting: [
      { 
        num: 1, 
        name: 'Shamseer', 
        role: 'Goalkeeper', 
        pos: 'GK', 
        country: '🇮🇳 India', 
        rating: 7.8,
        stats: { saves: 4, punches: 2, passAcc: '78%', ratingDesc: 'Solid shot-stopping performance' },
        desc: 'Shot-stopper, Penalty Specialist' 
      },
      { 
        num: 4, 
        name: 'Shameer K.', 
        role: 'Center Back', 
        pos: 'CB', 
        country: '🇮🇳 Malappuram', 
        rating: 8.6,
        goals: 1,
        stats: { goals: 1, interceptions: 5, clearances: 4, passAcc: '84%', ratingDesc: 'Scored 24\' bullet volley goal & led defense' },
        desc: 'Vice Captain, Header threat', 
        captain: false 
      },
      { 
        num: 3, 
        name: 'Faisal M.', 
        role: 'Right Back', 
        pos: 'RB', 
        country: '🇮🇳 Calicut', 
        rating: 7.3,
        stats: { tackles: 4, interceptions: 2, passAcc: '81%', ratingDesc: 'Pacy tackling on the right flank' },
        desc: 'Pacy tackling defender' 
      },
      { 
        num: 7, 
        name: 'Riyas K.', 
        role: 'Central Midfielder', 
        pos: 'CM', 
        country: '🇮🇳 Malappuram', 
        rating: 8.8,
        assists: 1,
        stats: { assists: 1, keyPasses: 4, passAcc: '91%', touches: 48, ratingDesc: 'Captain playmaker, dictated match tempo' },
        desc: 'Captain & Midfield Playmaker', 
        captain: true 
      },
      { 
        num: 8, 
        name: 'Suhail P.', 
        role: 'Attacking Midfielder', 
        pos: 'AM', 
        country: '🇮🇳 Wayanad', 
        rating: 7.5,
        stats: { dribbles: 3, keyPasses: 2, passAcc: '82%', ratingDesc: 'Constant creative movement behind strikers' },
        desc: 'Through-ball specialist' 
      },
      { 
        num: 9, 
        name: 'Ibrahim Soumahoro', 
        role: 'Center Forward', 
        pos: 'ST', 
        country: '🇨🇮 Ivory Coast', 
        rating: 9.2,
        goals: 1,
        assists: 1,
        isMvp: true,
        stats: { goals: 1, assists: 1, shots: 4, onTarget: 3, ratingDesc: 'Match MVP • Clinical 12\' chip & assisted goal' },
        desc: 'Marquee International Striker' 
      },
      { 
        num: 10, 
        name: 'Asif Ali', 
        role: 'Second Striker', 
        pos: 'CF', 
        country: '🇮🇳 Malappuram', 
        rating: 7.9,
        stats: { shots: 3, dribbles: 4, passAcc: '86%', ratingDesc: 'Rapid acceleration, hit the crossbar' },
        desc: 'Rapid dribbler, clinical finisher' 
      }
    ],
    subs: [
      { num: 13, name: 'Junaid', role: 'GK', rating: 6.8 },
      { num: 11, name: 'Salman', role: 'MF', rating: 7.0 },
      { num: 14, name: 'Anas', role: 'DF', rating: 6.9 },
      { num: 15, name: 'Haris', role: 'FW', rating: 7.1 },
      { num: 18, name: 'Rahul', role: 'MF', rating: 6.7 }
    ]
  };

  const awaySquad = {
    name: 'NEW MALAYA MALABAR FC',
    formation: '2 - 3 - 1 (Dynamic Counter)',
    manager: 'Aboobacker Master',
    coach: 'Siddique Master',
    kit: 'Black & White Stripes',
    teamRating: 7.5,
    starting: [
      { 
        num: 1, 
        name: 'Aneesh', 
        role: 'Goalkeeper', 
        pos: 'GK', 
        country: '🇮🇳 Kozhikode', 
        rating: 6.9,
        stats: { saves: 5, punches: 1, passAcc: '70%', ratingDesc: 'Denied two close-range shots' },
        desc: 'Agile Reflex Specialist' 
      },
      { 
        num: 5, 
        name: 'Musthafa', 
        role: 'Center Back', 
        pos: 'CB', 
        country: '🇮🇳 Malappuram', 
        rating: 7.1,
        stats: { aerialDuels: 4, blocks: 3, passAcc: '79%', ratingDesc: 'Strong in air duels' },
        desc: 'Aerial Dominator' 
      },
      { 
        num: 6, 
        name: 'Jameel', 
        role: 'Sweeper Back', 
        pos: 'SW', 
        country: '🇮🇳 Wayanad', 
        rating: 7.6,
        stats: { clearances: 6, tackles: 3, passAcc: '85%', ratingDesc: 'Solid last-man defensive cover' },
        desc: 'Defensive Anchor' 
      },
      { 
        num: 8, 
        name: 'Nabeel', 
        role: 'Box-to-Box MF', 
        pos: 'CM', 
        country: '🇮🇳 Kozhikode', 
        rating: 7.4,
        stats: { interceptions: 3, tackles: 4, passAcc: '80%', ratingDesc: 'High workrate across pitch' },
        desc: 'High stamina workhorse' 
      },
      { 
        num: 10, 
        name: 'Rashid', 
        role: 'Creative Playmaker', 
        pos: 'AM', 
        country: '🇮🇳 Malappuram', 
        rating: 8.4,
        goals: 1,
        stats: { goals: 1, freekicks: 3, passAcc: '89%', ratingDesc: 'Scored New Malaya goal from set-piece' },
        desc: 'Captain & freekick expert', 
        captain: true 
      },
      { 
        num: 11, 
        name: 'Basith', 
        role: 'Winger Forward', 
        pos: 'WF', 
        country: '🇮🇳 Kannur', 
        rating: 7.2,
        stats: { crosses: 4, dribbles: 3, passAcc: '77%', ratingDesc: 'Pacey runs on left flank' },
        desc: 'Sprint speed 32 km/h' 
      },
      { 
        num: 9, 
        name: 'Usman', 
        role: 'Striker', 
        pos: 'ST', 
        country: '🇳🇬 Nigeria', 
        rating: 7.7,
        assists: 1,
        stats: { assists: 1, shots: 3, onTarget: 2, ratingDesc: 'Target man holding up play' },
        desc: 'Power striker, Target Man' 
      }
    ],
    subs: [
      { num: 22, name: 'Suhair', role: 'GK', rating: 6.8 },
      { num: 7, name: 'Shafeeq', role: 'MF', rating: 7.0 },
      { num: 14, name: 'Nizar', role: 'DF', rating: 6.9 },
      { num: 17, name: 'Ajmal', role: 'FW', rating: 7.1 },
      { num: 19, name: 'Irfan', role: 'MF', rating: 6.7 }
    ]
  };

  const currentSquad = selectedTeam === 'home' ? homeSquad : awaySquad;

  const handleVotePlayer = (playerNum) => {
    const key = `${selectedTeam}-${playerNum}`;
    setFanVotes(prev => ({
      ...prev,
      [key]: (prev[key] || 0) + 1
    }));
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.7 }
    });
  };

  const getRatingBadgeStyle = (rating, isMvp = false) => {
    if (isMvp) return 'bg-amber-400 text-slate-950 font-black ring-2 ring-yellow-200 shadow-md';
    if (rating >= 8.5) return 'bg-emerald-500 text-white font-black shadow-xs';
    if (rating >= 7.5) return 'bg-emerald-600 text-white font-bold shadow-xs';
    if (rating >= 7.0) return 'bg-blue-600 text-white font-bold shadow-xs';
    return 'bg-amber-500 text-slate-950 font-bold shadow-xs';
  };

  return (
    <section id="pitch-lineup" className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-7 shadow-xs space-y-5">
      {/* Header with Google Sports Style Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-600" />
              <span>Google Sports Match Center</span>
            </span>
            <span className="text-xs text-slate-500 font-bold">Live Player Ratings & Lineup</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black font-sports uppercase tracking-wider text-slate-950 mt-1">
            {lang === 'ml' ? 'ലൈനപ്പും പ്ലെയർ റേറ്റിംഗും' : 'STARTING 7 & PLAYER RATINGS'}
          </h3>
          <p className="text-xs text-slate-500">
            {lang === 'ml' 
              ? 'ഗൂഗിൾ മാച്ച് സെന്റർ ശൈലിയിൽ ഓരോ കളിക്കാരന്റെയും ലൈവ് റേറ്റിംഗും പിച്ചിലെ പൊസിഷനും' 
              : 'Google Sports style live player performance ratings, match stats, and tactical turf formation'}
          </p>
        </div>

        {/* View Mode Toggle: Pitch vs Google Ratings Table */}
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
              <span>{lang === 'ml' ? 'റേറ്റിംഗ് ലിസ്റ്റ്' : 'Ratings List'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Team Selector & Overall Team Rating Bar */}
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
            <span className="px-1.5 py-0.2 rounded bg-purple-900 text-white text-[10px] font-mono">
              ★ {homeSquad.teamRating}
            </span>
          </button>
          <button
            onClick={() => { setSelectedTeam('away'); setActivePlayer(null); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              selectedTeam === 'away' ? 'bg-zinc-900 text-white shadow-xs font-black' : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <TeamLogo teamName="NEW MALAYA MALABAR FC" className="w-5 h-5 rounded-md" />
            <span>NEW MALAYA</span>
            <span className="px-1.5 py-0.2 rounded bg-zinc-800 text-white text-[10px] font-mono">
              ★ {awaySquad.teamRating}
            </span>
          </button>
        </div>

        <div className="text-xs text-slate-500 font-bold flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider text-slate-400">Team Avg Rating:</span>
          <span className="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-900 font-black font-mono">
            {currentSquad.teamRating} / 10
          </span>
        </div>
      </div>

      {/* VIEW 1: GOOGLE SPORTS PITCH VIEW WITH RATINGS ON EACH PLAYER */}
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

          {/* Player Nodes on Pitch with Google Ratings */}
          <div className="relative z-10 flex flex-col justify-around py-2 h-[410px]">
            {/* 1. Attackers */}
            <div className="flex items-center justify-around px-8">
              {currentSquad.starting.filter(p => p.pos === 'ST' || p.pos === 'CF' || p.pos === 'WF').map(player => (
                <GooglePitchPlayerNode 
                  key={player.num} 
                  player={player} 
                  isHome={selectedTeam === 'home'} 
                  isActive={activePlayer?.num === player.num}
                  badgeStyle={getRatingBadgeStyle(player.rating, player.isMvp)}
                  onClick={() => setActivePlayer(player)} 
                />
              ))}
            </div>

            {/* 2. Midfielders */}
            <div className="flex items-center justify-around px-12">
              {currentSquad.starting.filter(p => p.pos === 'CM' || p.pos === 'AM').map(player => (
                <GooglePitchPlayerNode 
                  key={player.num} 
                  player={player} 
                  isHome={selectedTeam === 'home'} 
                  isActive={activePlayer?.num === player.num}
                  badgeStyle={getRatingBadgeStyle(player.rating, player.isMvp)}
                  onClick={() => setActivePlayer(player)} 
                />
              ))}
            </div>

            {/* 3. Defenders */}
            <div className="flex items-center justify-around px-6">
              {currentSquad.starting.filter(p => p.pos === 'CB' || p.pos === 'RB' || p.pos === 'SW').map(player => (
                <GooglePitchPlayerNode 
                  key={player.num} 
                  player={player} 
                  isHome={selectedTeam === 'home'} 
                  isActive={activePlayer?.num === player.num}
                  badgeStyle={getRatingBadgeStyle(player.rating, player.isMvp)}
                  onClick={() => setActivePlayer(player)} 
                />
              ))}
            </div>

            {/* 4. Goalkeeper */}
            <div className="flex items-center justify-center">
              {currentSquad.starting.filter(p => p.pos === 'GK').map(player => (
                <GooglePitchPlayerNode 
                  key={player.num} 
                  player={player} 
                  isGK={true} 
                  isHome={selectedTeam === 'home'} 
                  isActive={activePlayer?.num === player.num}
                  badgeStyle={getRatingBadgeStyle(player.rating, player.isMvp)}
                  onClick={() => setActivePlayer(player)} 
                />
              ))}
            </div>
          </div>

          {/* Rating Legend Bar */}
          <div className="relative z-10 flex items-center justify-between text-[10px] text-emerald-100/90 bg-black/50 backdrop-blur-xs py-1.5 px-3 rounded-full border border-white/10">
            <span>💡 Tap any player for stats</span>
            <div className="flex items-center gap-2 font-bold font-mono">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400"></span>⭐ 9.0+ MVP</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>8.0+ Great</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span>7.0+ Solid</span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: GOOGLE SPORTS RATINGS TABLE / LIST */}
      {viewMode === 'table' && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white animate-fadeIn">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Player</th>
                <th className="py-2.5 px-2">Pos</th>
                <th className="py-2.5 px-2 text-center">Rating</th>
                <th className="py-2.5 px-2 text-center">Goals</th>
                <th className="py-2.5 px-2 text-center">Assists</th>
                <th className="py-2.5 px-3 text-right">Key Highlight</th>
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
                            {p.isMvp && (
                              <span className="px-1.5 py-0.2 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 text-[9px] font-black rounded uppercase">
                                ⭐ MVP
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
                    <td className="py-2.5 px-2 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-lg font-mono font-black text-xs ${getRatingBadgeStyle(p.rating, p.isMvp)}`}>
                        {p.rating.toFixed(1)}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-center font-bold text-slate-900">
                      {p.goals ? `⚽ ${p.goals}` : '-'}
                    </td>
                    <td className="py-2.5 px-2 text-center font-bold text-slate-900">
                      {p.assists ? `🎯 ${p.assists}` : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-right text-[11px] text-slate-600 font-medium">
                      {p.stats?.ratingDesc || p.desc}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* GOOGLE SPORTS STYLE DETAILED PLAYER MODAL / CARD */}
      {activePlayer && (
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 text-white border-2 border-amber-400/80 shadow-2xl space-y-4 animate-fadeIn select-none">
          {/* Top Bar */}
          <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 text-slate-950 font-black font-sports text-2xl flex items-center justify-center shadow-lg shrink-0">
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
                  {activePlayer.isMvp && (
                    <span className="px-2 py-0.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 text-[10px] font-black rounded-full uppercase flex items-center gap-1 shadow-xs">
                      <Star className="w-3 h-3 fill-current" />
                      <span>Match MVP</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-amber-300 font-bold mt-0.5">
                  {activePlayer.role} ({activePlayer.pos}) • {activePlayer.country}
                </p>
              </div>
            </div>

            {/* Google Rating Big Badge */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Google Rating
                </span>
                <span className={`inline-block px-3 py-1 rounded-xl font-mono font-black text-base sm:text-lg mt-0.5 ${getRatingBadgeStyle(activePlayer.rating, activePlayer.isMvp)}`}>
                  {activePlayer.rating.toFixed(1)} <span className="text-[11px] font-normal opacity-80">/10</span>
                </span>
              </div>

              <button
                onClick={() => setActivePlayer(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Player Match Stats Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
              <span className="text-[10px] text-slate-400 block font-bold">Pass Accuracy</span>
              <span className="text-sm font-black font-mono text-emerald-400">{activePlayer.stats?.passAcc || '85%'}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
              <span className="text-[10px] text-slate-400 block font-bold">Goals & Assists</span>
              <span className="text-sm font-black font-mono text-amber-300">
                {activePlayer.goals ? `${activePlayer.goals}G ` : ''}{activePlayer.assists ? `${activePlayer.assists}A` : activePlayer.goals ? '' : '0G / 0A'}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
              <span className="text-[10px] text-slate-400 block font-bold">Role Speciality</span>
              <span className="text-xs font-bold text-white truncate block">{activePlayer.desc}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
              <span className="text-[10px] text-slate-400 block font-bold">Match Minutes</span>
              <span className="text-sm font-black font-mono text-blue-400">30' (Full 1st Half)</span>
            </div>
          </div>

          {/* Performance Summary Text */}
          <p className="text-xs text-slate-300 bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/60 leading-relaxed">
            📝 <strong>Analyst Note:</strong> {activePlayer.stats?.ratingDesc || activePlayer.desc}
          </p>

          {/* Live Fan Upvote Button */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => handleVotePlayer(activePlayer.num)}
              className="py-2 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition active:scale-95 shadow-md"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{lang === 'ml' ? 'പ്ലെയറെ റേറ്റ് ചെയ്യുക (Upvote)' : 'Upvote Player Rating'}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-mono ml-1">
                +{fanVotes[`${selectedTeam}-${activePlayer.num}`] || 0}
              </span>
            </button>

            <span className="text-[11px] text-slate-400 font-medium">
              SFA Ground Scorer Desk Verified
            </span>
          </div>
        </div>
      )}

      {/* Bench Substitutes */}
      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2">
          <span className="uppercase tracking-wider">Substitutes Bench (പകരക്കാർ):</span>
          <span className="text-[10px] text-blue-700 font-bold">5 Subs Ready</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {currentSquad.subs.map(s => (
            <span key={s.num} className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs flex items-center gap-1.5">
              <span>#{s.num} {s.name}</span>
              <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px] font-mono">
                ★ {s.rating}
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// Google Style Player Node on Turf Pitch
function GooglePitchPlayerNode({ player, isGK = false, isHome, isActive, badgeStyle, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`group cursor-pointer flex flex-col items-center transition-all hover:scale-115 active:scale-95 ${
        isActive ? 'scale-120' : ''
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

        {/* Google Sports Rating Badge floating on top right */}
        <div className={`absolute -bottom-1 -right-2 px-1.5 py-0.2 rounded-full font-mono text-[9px] sm:text-[10px] border border-white/40 ${badgeStyle}`}>
          {player.rating.toFixed(1)}
        </div>
      </div>

      {/* Player Name Tag */}
      <div className="mt-1.5 px-1.5 py-0.2 rounded bg-black/80 backdrop-blur-xs text-[10px] font-bold text-white tracking-tight truncate max-w-[80px] sm:max-w-[95px] text-center border border-white/10 shadow-xs flex items-center justify-center gap-0.5">
        {player.isMvp && <span className="text-amber-400 text-[9px]">⭐</span>}
        <span>{player.name.split(' ')[0]}</span>
      </div>
    </div>
  );
}
