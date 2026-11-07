import React, { useState } from 'react';
import { Shield, Swords, BarChart3, ChevronDown, ChevronUp } from 'lucide-react';
import { openingMatch } from '../data/tournamentData';
import TeamLogo from './TeamLogo';

export default function HeadToHeadCard({ lang, isDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);

  const homeForm = ['W', 'W', 'D', 'W', 'W'];
  const awayForm = ['W', 'W', 'W', 'L', 'W'];

  const formColor = (res) => {
    if (res === 'W') return 'bg-emerald-600 text-white';
    if (res === 'D') return 'bg-slate-400 text-white';
    return 'bg-rose-600 text-white';
  };

  return (
    <div className={`rounded-2xl sm:rounded-3xl border overflow-hidden transition-colors shadow-xs ${
      isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
    }`}>
      {/* Collapsible Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-50/50 dark:hover:bg-white/[0.03] transition"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black">
            <Swords className="w-5 h-5 text-blue-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`text-sm sm:text-base font-black font-sports uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
                {lang === 'ml' ? 'Head-to-Head & Team Form' : 'HEAD-TO-HEAD & FORM GUIDE'}
              </h3>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              {lang === 'ml'
                ? 'കഴിഞ്ഞ Matches-ലെ Team പ്രകടനവും നേർക്കുനേർ കണക്കുകളും'
                : 'Last 5 matches form & historical rivalry records'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          <span className="text-xs font-bold hidden sm:inline">
            {isOpen ? 'Collapse' : 'View Stats'}
          </span>
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {/* Expanded Content */}
      {isOpen && (
        <div className={`px-4 sm:px-6 pb-5 pt-1 border-t space-y-4 animate-fadeIn ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
          {/* Recent Form (Last 5 matches) */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {lang === 'ml' ? 'സമീപകാല ഫോം (കഴിഞ്ഞ 5 മത്സരങ്ങൾ)' : 'Recent Form (Last 5 Matches)'}
            </span>

            <div className="grid grid-cols-2 gap-3">
              {/* Home Team Form */}
              <div className={`p-3 rounded-2xl border ${isDarkMode ? 'bg-slate-800/70 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center gap-1.5 mb-2">
                  <TeamLogo teamName={openingMatch.teamHome.name} className="w-5 h-5" />
                  <span className={`text-xs font-black font-sports ${isDarkMode ? 'text-blue-200' : 'text-blue-900'}`}>
                    {openingMatch.teamHome.shortName || 'KRSC'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {homeForm.map((res, idx) => (
                    <span
                      key={idx}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${formColor(
                        res
                      )}`}
                    >
                      {res}
                    </span>
                  ))}
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold ml-1">Unbeaten in 4</span>
                </div>
              </div>

              {/* Away Team Form */}
              <div className={`p-3 rounded-2xl border ${isDarkMode ? 'bg-slate-800/70 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center gap-1.5 mb-2">
                  <TeamLogo teamName={openingMatch.teamAway.name} className="w-5 h-5" />
                  <span className={`text-xs font-black font-sports ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                    {openingMatch.teamAway.shortName || 'BASE'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {awayForm.map((res, idx) => (
                    <span
                      key={idx}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${formColor(
                        res
                      )}`}
                    >
                      {res}
                    </span>
                  ))}
                  <span className={`text-[10px] font-bold ml-1 ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}>4 Wins</span>
                </div>
              </div>
            </div>
          </div>

          {/* Past H2H Summary */}
              <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-gradient-to-r from-slate-800 to-slate-900 border-slate-700' : 'bg-gradient-to-r from-blue-50/60 to-zinc-100/60 border-slate-200'}`}>
            <div className="flex items-center justify-between text-center">
              <div>
                <span className={`text-xl font-black font-sports ${isDarkMode ? 'text-purple-300' : 'text-blue-700'}`}>2</span>
                <p className={`text-[10px] font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{openingMatch.teamHome.shortName || 'KRSC'} Wins</p>
              </div>

              <div>
                <span className={`text-xl font-black font-sports ${isDarkMode ? 'text-slate-200' : 'text-slate-600'}`}>1</span>
                <p className={`text-[10px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Draws</p>
              </div>

              <div>
                <span className={`text-xl font-black font-sports ${isDarkMode ? 'text-slate-200' : 'text-zinc-700'}`}>1</span>
                <p className={`text-[10px] font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{openingMatch.teamAway.shortName || 'BASE'} Wins</p>
              </div>
            </div>
          </div>

          {/* Key Clashes on the Pitch */}
          <div className={`pt-1 text-xs space-y-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            <div className={`flex items-center justify-between py-1 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
              <span className={`font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{lang === 'ml' ? 'പോരാട്ടം' : 'Battle'}:</span>
              <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Abdul Vahid ({openingMatch.teamHome.shortName || 'KRSC'} #10) vs Ashik Usman ({openingMatch.teamAway.shortName || 'BASE'} #10)</span>
            </div>
            <div className={`flex items-center justify-between py-1 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
              <span className={`font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{lang === 'ml' ? 'വേദി' : 'Pitch'}:</span>
              <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Peruvallur Panjayath Stadium (Natural Grass)</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className={`font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Kick-off:</span>
              <span className={`font-bold ${isDarkMode ? 'text-purple-300' : 'text-blue-700'}`}>8:45 PM IST Floodlight</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
