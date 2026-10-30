import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Trophy, 
  Share2, 
  CheckCircle2, 
  Search, 
  Flame, 
  Users, 
  Sparkles, 
  Award, 
  TrendingUp, 
  ChevronRight, 
  Lock,
  ArrowLeft 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { participatingTeams } from '../data/tournamentData';
import TeamLogo from './TeamLogo';

const INITIAL_VOTES = {
  1: 1840, // Super Studio Malappuram
  2: 1420, // Linsha Medicals Mannarkkad
  3: 1780, // Saban Kottakkal
  4: 1530, // Al Madeena Cherpulasseri
  5: 960,  // Base Perumbavur
  6: 1150, // KMG Mavoor
  7: 1220, // FC Perinthalmanna
  8: 910,  // United FC Nellikkuth
  9: 1390, // I nov FC Manjeri
  10: 840, // X8 Tours Calicut
  11: 990, // Malbar FC Kozhikkode
  12: 1040,// Shooters Padanna
  13: 1110,// AYC Ucharakadavu
  14: 870, // Soccer Sporting Shornur
  15: 1690,// Town Team Areekode
  16: 940, // Seven Star FC Palakkad
  17: 880, // Real FC Thennala
  18: 920, // Powerdippo Thrissur
  19: 1060,// KRSC Kozhikkode
  20: 890, // Hunters Koothuparamba
  21: 830, // Abilash FC Kuppooth
  22: 950, // AFC Wayanad
  23: 1950,// Udaya Parambil Peedika (Host)
  24: 1130 // Usha FC Thrissur
};

export default function ClubFanVoteSection({ lang, isDarkMode, onBack }) {
  // Stored voted club in localStorage
  const [votedClubId, setVotedClubId] = useState(() => {
    return parseInt(localStorage.getItem('kasc_fan_voted_club_id') || '0', 10);
  });

  const [votes, setVotes] = useState(() => {
    try {
      const stored = localStorage.getItem('kasc_club_votes_data');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return INITIAL_VOTES;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'leaderboard'
  const [toastMessage, setToastMessage] = useState('');

  // Total votes calculation
  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  // Sort teams by vote count for the leaderboard
  const sortedTeams = [...participatingTeams].sort((a, b) => {
    const votesA = votes[a.id] || 0;
    const votesB = votes[b.id] || 0;
    return votesB - votesA;
  });

  const handleVote = (teamId) => {
    if (votedClubId === teamId) return; // already voted for this club

    // Increment vote count
    setVotes((prev) => {
      const updated = {
        ...prev,
        [teamId]: (prev[teamId] || 0) + 1
      };
      // If user had previous vote, decrement it
      if (votedClubId && prev[votedClubId]) {
        updated[votedClubId] = Math.max(0, prev[votedClubId] - 1);
      }
      localStorage.setItem('kasc_club_votes_data', JSON.stringify(updated));
      return updated;
    });

    setVotedClubId(teamId);
    localStorage.setItem('kasc_fan_voted_club_id', teamId.toString());

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });

    const targetTeam = participatingTeams.find((t) => t.id === teamId);
    setToastMessage(`🎉 You voted for ${targetTeam?.name || 'your club'}!`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleShare = (team) => {
    const shareText = encodeURIComponent(
      `⚽ *I voted for ${team.name} in SFA All India Sevens Season 7!*\n` +
      `🔥 Stand with your favorite club in the official fan poll:\n` +
      `${window.location.origin}/#teams`
    );
    window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank');
  };

  const filteredTeams = sortedTeams.filter((team) => {
    return (
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.nameMl.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.city.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <section className="space-y-5">
      {/* Optional Back to Live Match navigation */}
      {onBack && (
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition active:scale-95 shadow-2xs border border-slate-200"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{lang === 'ml' ? '← ലൈവ് മാച്ചിലേക്ക് മടങ്ങുക' : '← Back to Live Match'}</span>
        </button>
      )}

      {/* Header Banner */}
      <div className={`rounded-3xl p-5 sm:p-7 border transition-all ${
        isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-xs'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-xs">
                <Heart className="w-3 h-3 fill-white" />
                <span>{lang === 'ml' ? 'ഫാൻ വോട്ടിംഗ്' : 'FAN POLL BATTLE'}</span>
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                {totalVotes.toLocaleString()} Votes Casted
              </span>
            </div>

            <h2 className={`font-black uppercase tracking-tight ${
              lang === 'ml' ? 'font-malayalam text-xl sm:text-2xl' : 'font-sports text-2xl sm:text-3xl'
            }`}>
              {lang === 'ml' ? 'നിങ്ങളുടെ പ്രിയപ്പെട്ട ക്ലബ്ബിന് വോട്ട് ചെയ്യൂ!' : 'VOTE FOR YOUR CLUB'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl font-malayalam">
              {lang === 'ml' 
                ? 'സെവൻസ് അസോസിയേഷനിലെ 24 ഔദ്യോഗിക ക്ലബ്ബുകളിൽ ഏറ്റവും കൂടുതൽ ആരാധക പിന്തുണ ആർക്ക്? നിങ്ങളുടെ വോട്ട് രേഖപ്പെടുത്തൂ!' 
                : 'Which of the 24 confirmed clubs has the biggest fan following in Kerala? Cast your vote and see the live standings!'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200 self-start sm:self-center">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 ${
                activeTab === 'all'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Vote Clubs
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition active:scale-95 ${
                activeTab === 'leaderboard'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Standings</span>
            </button>
          </div>
        </div>

        {/* Feedback notification toast */}
        {toastMessage && (
          <div className="mt-4 p-3 rounded-2xl bg-emerald-600 text-white text-xs font-bold text-center animate-fadeIn shadow-md">
            {toastMessage}
          </div>
        )}
      </div>

      {/* VIEW 1: VOTE FOR CLUBS (CARD GRID) */}
      {activeTab === 'all' && (
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'ml' ? 'ക്ലബ്ബിന്റെ പേര് തിരയുക...' : 'Search any of the 24 confirmed clubs...'}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-xs"
              />
            </div>
          </div>

          {/* Clubs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredTeams.map((team, idx) => {
              const teamVotes = votes[team.id] || 0;
              const percent = totalVotes > 0 ? Math.round((teamVotes / totalVotes) * 100) : 0;
              const isVoted = votedClubId === team.id;

              return (
                <div
                  key={team.id}
                  className={`rounded-2xl p-4 border transition-all duration-200 flex flex-col justify-between ${
                    isVoted
                      ? 'border-red-400 bg-red-50/50 shadow-md ring-2 ring-red-400'
                      : isDarkMode
                      ? 'bg-slate-900 border-slate-800 text-white hover:border-slate-700'
                      : 'bg-white border-slate-200 text-slate-900 shadow-xs hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <TeamLogo teamName={team.name} className="w-10 h-10 shrink-0 shadow-xs" />
                      <div className="leading-tight">
                        <h4 className="font-sports font-black text-sm sm:text-base text-slate-950 truncate max-w-[170px]">
                          {team.name}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-medium">
                          {team.city}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold text-slate-400 px-2 py-0.5 rounded-md bg-slate-100">
                      #{idx + 1}
                    </span>
                  </div>

                  {/* Progress bar of fan support */}
                  <div className="my-2 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-slate-600">{teamVotes.toLocaleString()} fans</span>
                      <span className="text-blue-700 font-sports">{percent}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          isVoted ? 'bg-red-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${Math.max(4, percent)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => handleVote(team.id)}
                      className={`flex-1 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition active:scale-95 shadow-xs ${
                        isVoted
                          ? 'bg-red-600 text-white shadow-sm'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isVoted ? 'fill-white' : 'text-red-500'}`} />
                      <span>{isVoted ? 'Supported! ❤️' : 'Vote Club'}</span>
                    </button>

                    <button
                      onClick={() => handleShare(team)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 transition"
                      title="Share to WhatsApp"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: LEADERBOARD STANDINGS */}
      {activeTab === 'leaderboard' && (
        <div className={`rounded-3xl border overflow-hidden ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-sports font-black text-sm sm:text-base uppercase tracking-wider flex items-center gap-2 text-slate-950">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Official Fan Support Leaderboard</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Ranked by Fan Votes
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {sortedTeams.map((team, idx) => {
              const teamVotes = votes[team.id] || 0;
              const percent = totalVotes > 0 ? Math.round((teamVotes / totalVotes) * 100) : 0;
              const isVoted = votedClubId === team.id;

              return (
                <div 
                  key={team.id}
                  className={`p-3.5 sm:p-4 flex items-center justify-between gap-3 transition ${
                    isVoted ? 'bg-red-50/40' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-black font-sports text-xs shrink-0 ${
                      idx === 0 ? 'bg-amber-400 text-slate-950' : idx === 1 ? 'bg-slate-300 text-slate-900' : idx === 2 ? 'bg-amber-700 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {idx + 1}
                    </span>

                    <TeamLogo teamName={team.name} className="w-8 h-8 shrink-0" />

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-sports font-black text-sm text-slate-950">
                          {team.name}
                        </h4>
                        {isVoted && (
                          <span className="px-1.5 py-0.5 rounded-full bg-red-600 text-white text-[9px] font-black uppercase">
                            My Club
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400">{team.city}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <span className="font-sports font-black text-sm sm:text-base text-slate-950 block">
                        {teamVotes.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-blue-700 font-bold">{percent}%</span>
                    </div>

                    <button
                      onClick={() => handleVote(team.id)}
                      className={`p-2 rounded-xl text-xs font-bold transition active:scale-95 ${
                        isVoted ? 'bg-red-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                      title={isVoted ? 'Your Voted Club' : 'Vote for this club'}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isVoted ? 'fill-white' : ''}`} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}