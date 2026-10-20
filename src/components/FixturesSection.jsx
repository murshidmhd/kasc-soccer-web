import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Share2, Trophy } from 'lucide-react';
import { fixtures } from '../data/tournamentData';
import TeamLogo from './TeamLogo';

export default function FixturesSection({ lang, isDarkMode }) {
  return (
    <section id="fixtures" className="py-12 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-wider">
          <Calendar className="w-3.5 h-3.5 text-blue-600" />
          <span>{lang === 'ml' ? 'മത്സരക്രമം' : 'TOURNAMENT SCHEDULE'}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black font-sports text-slate-950 tracking-wide uppercase">
          {lang === 'ml' ? 'റൗണ്ട് 1 ഫിക്സ്ചറുകൾ' : 'OFFICIAL FIXTURES'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          {lang === 'ml'
            ? 'നവംബർ 6 മുതൽ ഡിസംബർ 6 വരെ രാത്രി 8:00 മണിക്ക് പെരുവള്ളൂർ പഞ്ചായത്ത് സ്റ്റേഡിയത്തിൽ'
            : 'Every night at 8:00 PM IST under floodlights at Peruvallur Stadium.'}
        </p>
      </div>

      {/* Fixture Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {fixtures.map((match) => (
          <div
            key={match.id}
            className={`rounded-2xl p-5 border transition duration-200 ${
              isDarkMode 
                ? 'bg-slate-900 border-slate-800 text-white' 
                : 'bg-white border-slate-200 text-slate-900 shadow-sm hover:shadow-md hover:border-blue-400'
            }`}
          >
            {/* Top Match Info */}
            <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-2.5 mb-3.5">
              <span className="font-bold text-amber-700 uppercase tracking-wider bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                {match.day} • {match.stage}
              </span>
              <div className="flex items-center gap-1.5 font-medium text-slate-600">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>{match.date} | {match.time}</span>
              </div>
            </div>

            {/* Teams Matchup */}
            <div className="space-y-2.5">
              {/* Team 1 */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-3">
                  <TeamLogo teamName={match.team1} className="w-8 h-8" />
                  <span className="font-bold text-sm sm:text-base text-slate-900 font-sports tracking-wide">
                    {match.team1}
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-600 bg-white px-2.5 py-1 rounded border border-slate-200">
                  {match.status === 'Completed' ? match.score1 : '-'}
                </span>
              </div>

              {/* Team 2 */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-3">
                  <TeamLogo teamName={match.team2} className="w-8 h-8" />
                  <span className="font-bold text-sm sm:text-base text-slate-900 font-sports tracking-wide">
                    {match.team2}
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-600 bg-white px-2.5 py-1 rounded border border-slate-200">
                  {match.status === 'Completed' ? match.score2 : '-'}
                </span>
              </div>
            </div>

            {/* Stadium & Status Footer */}
            <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1.5 truncate max-w-[200px]">
                <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span className="truncate">{match.stadium}</span>
              </div>
              <span className="font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                {match.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
