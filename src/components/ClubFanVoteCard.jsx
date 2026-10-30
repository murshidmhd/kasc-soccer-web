import React, { useState, useEffect } from 'react';
import { Heart, Trophy, ChevronRight, Users, Sparkles, CheckCircle2 } from 'lucide-react';
import { participatingTeams } from '../data/tournamentData';
import TeamLogo from './TeamLogo';

const INITIAL_VOTES = {
  1: 1840, // Super Studio
  2: 1420, // Linsha Medicals
  3: 1620, // Saban Kottakkal
  4: 1180, // Al Madeena
  5: 760,  // Base Perumbavur
  6: 820,  // KMG Mavoor
  7: 910,  // FC Perinthalmanna
  8: 840,  // United FC Nellikkuth
  9: 980,  // I nov FC Manjeri
  10: 710, // X8 Tours Calicut
  11: 1250,// New Malaya Malabar FC
  12: 670, // Shooters Padanna
  13: 880, // AYC Ucharakadavu
  14: 790, // Soccer Sporting Shornur
  15: 1120,// Town Team Areekode
  16: 860, // Seven Star FC Palakkad
  17: 940, // Real FC Thennala
  18: 780, // Powerdippo Thrissur
  19: 810, // KRSC Kozhikkode
  20: 890, // Hunters Koothuparamba
  21: 830, // Abilash FC Kuppooth
  22: 950, // AFC Wayanad
  23: 1950,// Udaya Parambil Peedika (Host)
  24: 1130 // Usha FC Thrissur
};

export default function ClubFanVoteCard({ lang, isDarkMode, onOpenVotingPage }) {
  const [votedClubId, setVotedClubId] = useState(0);
  const [votes, setVotes] = useState(INITIAL_VOTES);

  useEffect(() => {
    try {
      const storedId = parseInt(localStorage.getItem('kasc_fan_voted_club_id') || '0', 10);
      setVotedClubId(storedId);

      const storedVotes = localStorage.getItem('kasc_club_votes_data');
      if (storedVotes) {
        setVotes(JSON.parse(storedVotes));
      }
    } catch (e) {}
  }, []);

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  // Top 3 clubs
  const topTeams = [...participatingTeams]
    .sort((a, b) => (votes[b.id] || 0) - (votes[a.id] || 0))
    .slice(0, 3);

  const votedTeam = participatingTeams.find((t) => t.id === votedClubId);

  return (
    <div 
      onClick={onOpenVotingPage}
      className={`rounded-3xl border overflow-hidden p-4 sm:p-5 transition-all shadow-xs hover:shadow-md cursor-pointer group select-none ${
        isDarkMode 
          ? 'bg-slate-900 border-slate-800 text-white hover:border-red-500/50' 
          : 'bg-white border-slate-200 text-slate-900 hover:border-red-400'
      }`}
    >
      {/* Top Tag & Total Count */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-xs">
            <Heart className="w-3 h-3 fill-white" />
            <span>{lang === 'ml' ? 'ഫാൻ വോട്ട് ബാറ്റിൽ' : 'FAN CLUB BATTLE'}</span>
          </span>
          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
            24 SFA Clubs
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-bold text-blue-700">
          <Users className="w-3.5 h-3.5" />
          <span>{totalVotes.toLocaleString()} {lang === 'ml' ? 'വോട്ടുകൾ' : 'Votes'}</span>
        </div>
      </div>

      {/* Middle: Title & Top 3 Snapshot */}
      <div className="py-3 space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h3 className="text-base sm:text-lg font-black font-sports uppercase tracking-wider text-slate-950 group-hover:text-red-600 transition">
              {lang === 'ml' ? 'ഏറ്റവും കൂടുതൽ ആരാധക പിന്തുണ ഏത് ക്ലബ്ബിന്?' : 'WHO HAS THE BIGGEST FANBASE?'}
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              {lang === 'ml'
                ? '24 ഒഫീഷ്യൽ ടീമുകളിൽ നിങ്ങളുടെ പ്രിയപ്പെട്ട ക്ലബ്ബിന് വോട്ട് രേഖപ്പെടുത്തൂ!'
                : 'Stand with your club! Vote across all 24 official confirmed SFA teams.'}
            </p>
          </div>

          {votedTeam && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold shrink-0 self-start sm:self-auto">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lang === 'ml' ? 'വോട്ട് ചെയ്തത്:' : 'You voted:'} <strong>{votedTeam.shortName || votedTeam.name}</strong></span>
            </div>
          )}
        </div>

        {/* Top 3 Leaders Snapshot */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {topTeams.map((team, idx) => {
            const count = votes[team.id] || 0;
            const rankMedal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉';
            return (
              <div 
                key={team.id}
                className="p-2 sm:p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-2 group-hover:bg-slate-100/70 transition"
              >
                <div className="relative shrink-0">
                  <TeamLogo teamName={team.name} className="w-8 h-8" />
                  <span className="absolute -top-1.5 -left-1.5 text-xs drop-shadow-xs">{rankMedal}</span>
                </div>
                <div className="min-w-0 flex-1 truncate">
                  <span className="font-sports font-black text-xs block truncate text-slate-900">
                    {team.shortName || team.name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold block truncate">
                    {count.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA Button */}
      <div className="pt-2">
        <button
          onClick={onOpenVotingPage}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-700 hover:to-rose-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition active:scale-98"
        >
          <span>{lang === 'ml' ? '24 ക്ലബ്ബുകൾക്ക് വോട്ട് ചെയ്യൂ (ലൈവ് പോൾ)' : 'Open Full Voting Page (24 Clubs)'}</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
        </button>
      </div>
    </div>
  );
}
