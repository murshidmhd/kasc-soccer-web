import React from 'react';
import { Trophy, Award, Sparkles } from 'lucide-react';
import { topScorersPreview } from '../data/tournamentData';
import trophyImg from '../assets/tournament_trophy.jpg';

export default function TopScorers({ lang, isDarkMode }) {
  return (
    <section className="py-12 px-4 sm:px-6 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Trophy Spotlight Card */}
        <div className={`md:col-span-4 rounded-3xl p-5 border text-center space-y-3 relative overflow-hidden transition-colors ${
          isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
        }`}>
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            <img
              src={trophyImg}
              alt="Peruvallur Cup Championship Trophy"
              width="300"
              height="300"
              loading="lazy"
              className="w-full h-auto object-cover"
            />
            <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md border border-amber-300 text-[10px] font-bold text-amber-800 flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>Championship Trophy</span>
            </div>
          </div>
          <div>
            <h4 className={`text-lg font-black font-sports uppercase tracking-wider ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              {lang === 'ml' ? 'അഖിലേന്ത്യാ സെവൻസ് ട്രോഫി' : 'ALL INDIA SEVENS TROPHY'}
            </h4>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-bold">
              Season 7 All-India Champions
            </p>
          </div>
        </div>

        {/* Right: Golden Boot Leaderboard */}
        <div className={`md:col-span-8 rounded-3xl p-6 sm:p-7 border transition-colors ${
          isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-sm shrink-0">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`text-xl sm:text-2xl font-black font-sports uppercase tracking-wider ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  {lang === 'ml' ? 'ഗോൾഡൻ ബൂട്ട് ലീഡർബോർഡ്' : 'GOLDEN BOOT RACE'}
                </h3>
                <p className="text-xs text-amber-600 dark:text-amber-400 font-bold">
                  {lang === 'ml'
                    ? 'ടൂർണ്ണമെന്റിലെ മുൻനിര ഗോൾവേട്ടക്കാർ'
                    : 'Leading Goalscorers of Season 7'}
                </p>
              </div>
            </div>

            <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/40 text-amber-800 dark:text-amber-300 text-xs font-bold">
              Live Tracking
            </span>
          </div>

          {/* Scorers Table */}
          <div className="overflow-x-auto horizontal-scroll-container">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className={`border-b text-xs uppercase tracking-wider ${
                  isDarkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
                }`}>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">{lang === 'ml' ? 'താരം' : 'Player'}</th>
                  <th className="py-2.5 px-3">{lang === 'ml' ? 'ക്ലബ്ബ്' : 'Club'}</th>
                  <th className="py-2.5 px-3 text-center">{lang === 'ml' ? 'സ്വദേശം / രാജ്യം' : 'Origin / District'}</th>
                  <th className="py-2.5 px-3 text-right">{lang === 'ml' ? 'ഗോളുകൾ' : 'Goals'}</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
                {topScorersPreview.map((item) => (
                  <tr key={item.rank} className={`transition ${isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}`}>
                    <td className="py-3 px-3 font-bold text-amber-500">
                      {item.rank}
                    </td>
                    <td className="py-3 px-3">
                      <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.name}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{item.category}</div>
                    </td>
                    <td className="py-3 px-3 text-blue-600 dark:text-blue-400 font-medium">
                      {item.team}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        isDarkMode 
                          ? 'bg-slate-800 text-slate-300 border-slate-700' 
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        <span>{item.flag}</span>
                        <span>{item.origin}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-black font-sports text-amber-500 text-base">
                      {item.goals}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
