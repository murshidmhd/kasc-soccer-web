/**
 * NextMatchCard.jsx
 * Shows the upcoming Day 2 match (KMG Mavoor vs Shooters Padanna)
 * styled exactly like the LiveMatchCard hero — same layout, colors, and feel.
 */

import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import TeamLogo from './TeamLogo';
import { nextMatch } from '../data/tournamentData';

export default function NextMatchCard({ lang, isDarkMode, onFixtures }) {
  const { teamHome, teamAway, stage, date, time, venue } = nextMatch;

  return (
    <div className={`rounded-3xl overflow-hidden border shadow-xl ${
      isDarkMode
        ? 'bg-gradient-to-br from-slate-900 via-navy-900 to-slate-950 border-slate-700'
        : 'bg-gradient-to-br from-indigo-950 via-navy-900 to-slate-900 border-slate-800'
    }`}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
            🗓 Upcoming
          </span>
          <span className="text-[10px] text-slate-400 font-mono">{date} · {time}</span>
        </div>
        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">{stage}</span>
      </div>

      {/* Main match row */}
      <div className="flex items-center justify-between px-4 py-4 gap-2">
        {/* Home team */}
        <div className="flex-1 flex flex-col items-center gap-2">
          <TeamLogo teamName={teamHome.name} className="w-16 h-16 sm:w-20 sm:h-20 shadow-lg" />
          <div className="text-center">
            <p className="text-white font-black font-sports text-sm leading-tight uppercase tracking-wider">
              {teamHome.name}
            </p>
            <p className="text-slate-400 text-[10px] mt-0.5">{teamHome.city}</p>
          </div>
        </div>

        {/* VS / Score area */}
        <div className="flex flex-col items-center justify-center gap-1 px-2">
          <div className="flex items-center gap-3">
            <span className="text-5xl font-black font-sports text-white/20 tracking-tighter">?</span>
            <span className="text-2xl font-black text-slate-500">-</span>
            <span className="text-5xl font-black font-sports text-white/20 tracking-tighter">?</span>
          </div>
          <span className="mt-1 px-3 py-1 rounded-full bg-slate-700/50 border border-slate-600/40 text-slate-300 text-[10px] font-bold uppercase tracking-widest">
            Kick-off 8:45 PM
          </span>
        </div>

        {/* Away team */}
        <div className="flex-1 flex flex-col items-center gap-2">
          <TeamLogo teamName={teamAway.name} className="w-16 h-16 sm:w-20 sm:h-20 shadow-lg" />
          <div className="text-center">
            <p className="text-white font-black font-sports text-sm leading-tight uppercase tracking-wider">
              {teamAway.name}
            </p>
            <p className="text-slate-400 text-[10px] mt-0.5">{teamAway.city}</p>
          </div>
        </div>
      </div>

      {/* Venue strip */}
      <div className="flex items-center justify-center gap-1.5 pb-3 px-4">
        <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
        <span className="text-[10px] text-slate-500 font-mono truncate">{venue}</span>
      </div>

      {/* Action buttons */}
      <div className="px-4 pb-4 flex gap-2">
        <button
          onClick={onFixtures}
          className="flex-1 py-3 rounded-2xl bg-indigo-700/30 hover:bg-indigo-700/50 border border-indigo-600/40 text-indigo-300 text-xs font-bold flex items-center justify-center gap-1.5 transition"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>{lang === 'ml' ? 'ഫിക്സ്ചർ (Fixtures)' : 'Fixtures'}</span>
        </button>
      </div>
    </div>
  );
}
