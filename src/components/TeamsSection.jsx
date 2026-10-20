import React from 'react';
import { Shield, Star, User } from 'lucide-react';
import { participatingTeams } from '../data/tournamentData';
import TeamLogo from './TeamLogo';

export default function TeamsSection({ lang, isDarkMode }) {
  return (
    <section id="teams" className="py-12 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5 text-blue-600" />
          <span>{lang === 'ml' ? 'ടീമുകൾ' : 'PARTICIPATING CLUBS'}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black font-sports text-slate-950 tracking-wide uppercase">
          {lang === 'ml' ? 'പ്രമുഖ സെവൻസ് ക്ലബ്ബുകൾ' : 'ALL-INDIA POWERHOUSE TEAMS'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          {lang === 'ml'
            ? 'കേരളത്തിലെയും ഇന്ത്യയിലെയും ഏറ്റവും പ്രശസ്തമായ പ്രമുഖ സെവൻസ് ടീമുകൾ പറമ്പിൽ പീടികയിൽ കളത്തിലിറങ്ങുന്നു'
            : 'Top-tier Sevens football giants featuring foreign stars and Indian internationals.'}
        </p>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {participatingTeams.map((team, idx) => (
          <div
            key={idx}
            className={`rounded-2xl p-5 border transition duration-200 group hover:-translate-y-1 ${
              isDarkMode 
                ? 'bg-slate-900 border-slate-800 text-white' 
                : 'bg-white border-slate-200 text-slate-900 shadow-sm hover:shadow-md hover:border-blue-400'
            }`}
          >
            <div className="mb-3">
              <TeamLogo teamName={team.name} className="w-14 h-14" />
            </div>

            <h3 className="text-lg font-bold font-sports text-slate-900 group-hover:text-blue-700 transition">
              {team.name}
            </h3>
            <p className="text-xs text-blue-600 font-bold mb-3">
              {team.city}
            </p>

            <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1 font-medium">
                  <User className="w-3.5 h-3.5 text-slate-400" /> Captain:
                </span>
                <span className="font-bold text-slate-900">{team.captain}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1 font-medium">
                  <Star className="w-3.5 h-3.5 text-amber-500" /> Key Star:
                </span>
                <span className="font-bold text-amber-700">{team.starPlayer}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
