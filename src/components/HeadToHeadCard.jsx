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
        className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-50/50 transition"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black">
            <Swords className="w-5 h-5 text-blue-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black font-sports uppercase tracking-wider text-slate-950">
                {lang === 'ml' ? 'ഹെഡ്-ടു-ഹെഡ് & ടീം ഫോം (H2H)' : 'HEAD-TO-HEAD & FORM GUIDE'}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                FotMob Style
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              {lang === 'ml'
                ? 'കഴിഞ്ഞ മത്സരങ്ങളിലെ ടീം പ്രകടനം & നേർക്കുനേർ കണക്കുകൾ'
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
        <div className="px-4 sm:px-6 pb-5 pt-1 border-t border-slate-100 space-y-4 animate-fadeIn">
          {/* Recent Form (Last 5 matches) */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {lang === 'ml' ? 'സമീപകാല ഫോം (കഴിഞ്ഞ 5 മത്സരങ്ങൾ)' : 'Recent Form (Last 5 Matches)'}
            </span>

            <div className="grid grid-cols-2 gap-3">
              {/* UDAYA Form */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-1.5 mb-2">
                  <TeamLogo teamName={openingMatch.teamHome.name} className="w-5 h-5" />
                  <span className="text-xs font-black font-sports text-blue-900">
                    UDAYA
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
                  <span className="text-[10px] text-emerald-700 font-bold ml-1">Unbeaten in 4</span>
                </div>
              </div>

              {/* SABAN FC Form */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-1.5 mb-2">
                  <TeamLogo teamName={openingMatch.teamAway.name} className="w-5 h-5" />
                  <span className="text-xs font-black font-sports text-amber-900">
                    SABAN FC
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
                  <span className="text-[10px] text-amber-700 font-bold ml-1">4 Wins</span>
                </div>
              </div>
            </div>
          </div>

          {/* Past H2H Summary */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50/60 to-amber-50/60 border border-slate-200">
            <div className="flex items-center justify-between text-center">
              <div>
                <span className="text-xl font-black font-sports text-blue-700">2</span>
                <p className="text-[10px] font-bold text-slate-600">UDAYA Wins</p>
              </div>

              <div>
                <span className="text-xl font-black font-sports text-slate-600">1</span>
                <p className="text-[10px] font-bold text-slate-500">Draws</p>
              </div>

              <div>
                <span className="text-xl font-black font-sports text-amber-600">1</span>
                <p className="text-[10px] font-bold text-slate-600">SABAN Wins</p>
              </div>
            </div>
          </div>

          {/* Key Clashes on the Pitch */}
          <div className="pt-1 text-xs text-slate-600 space-y-1.5">
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="font-medium text-slate-500">{lang === 'ml' ? 'പോരാട്ടം' : 'Battle'}:</span>
              <span className="font-bold text-slate-900">Ibrahim (UDAYA #9) vs Ousmane (SABAN #4)</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="font-medium text-slate-500">{lang === 'ml' ? 'വേദി' : 'Pitch'}:</span>
              <span className="font-bold text-slate-900">Peruvallur Panjayath Stadium (Natural Grass)</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="font-medium text-slate-500">{lang === 'ml' ? 'കിക്കോഫ്' : 'Kickoff'}:</span>
              <span className="font-bold text-blue-700">8:00 PM IST Floodlight</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
