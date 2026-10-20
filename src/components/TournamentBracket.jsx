import React, { useState } from 'react';
import { Trophy, ChevronRight, Award, Shield, Calendar, Sparkles } from 'lucide-react';
import TeamLogo from './TeamLogo';

const BRACKET_DATA = {
  round1: [
    { id: 'm1', date: '06 Nov', team1: 'UDAYA Peruvallur', team2: 'SABAN FC Kottakkal', status: 'Day 1 Blockbuster', winner: null, qfSlot: 'qf1' },
    { id: 'm2', date: '07 Nov', team1: 'FIFA Manjeri', team2: 'Linsha Medicals Tirur', status: 'Upcoming', winner: null, qfSlot: 'qf1' },
    { id: 'm3', date: '08 Nov', team1: 'Al-Madina Cherpulassery', team2: 'Royal Travel Kozhikode', status: 'Upcoming', winner: null, qfSlot: 'qf2' },
    { id: 'm4', date: '09 Nov', team1: 'Usha Thrissur', team2: 'Black & White Kozhikode', status: 'Upcoming', winner: null, qfSlot: 'qf2' },
    { id: 'm5', date: '10 Nov', team1: 'Super Studio Malappuram', team2: 'Gymkhana Thrissur', status: 'Upcoming', winner: null, qfSlot: 'qf3' },
    { id: 'm6', date: '11 Nov', team1: 'Town Team Areekode', team2: 'Moon Star Kalpakanchery', status: 'Upcoming', winner: null, qfSlot: 'qf3' },
    { id: 'm7', date: '12 Nov', team1: 'FC Nellikkuth', team2: 'Real FC Thennala', status: 'Upcoming', winner: null, qfSlot: 'qf4' },
    { id: 'm8', date: '13 Nov', team1: 'KMG Mavoor', team2: 'Abhilash FC Kuppooth', status: 'Upcoming', winner: null, qfSlot: 'qf4' }
  ],
  quarterFinals: [
    { id: 'qf1', date: '20 Nov', team1: 'Winner Match 1 (Udaya/Saban)', team2: 'Winner Match 2 (FIFA/Linsha)', status: 'QF 1', sfSlot: 'sf1' },
    { id: 'qf2', date: '22 Nov', team1: 'Winner Match 3 (Al-Madina/Royal)', team2: 'Winner Match 4 (Usha/B&W)', status: 'QF 2', sfSlot: 'sf1' },
    { id: 'qf3', date: '24 Nov', team1: 'Winner Match 5 (Super Studio/Gymkhana)', team2: 'Winner Match 6 (Town Team/Moon Star)', status: 'QF 3', sfSlot: 'sf2' },
    { id: 'qf4', date: '26 Nov', team1: 'Winner Match 7 (Nellikkuth/Thennala)', team2: 'Winner Match 8 (KMG/Abhilash)', status: 'QF 4', sfSlot: 'sf2' }
  ],
  semiFinals: [
    { id: 'sf1', date: '30 Nov', team1: 'Winner Quarter Final 1', team2: 'Winner Quarter Final 2', status: 'Semi Final 1', finalSlot: 'final' },
    { id: 'sf2', date: '02 Dec', team1: 'Winner Quarter Final 3', team2: 'Winner Quarter Final 4', status: 'Semi Final 2', finalSlot: 'final' }
  ],
  grandFinal: {
    id: 'final',
    date: '06 Dec 2026 • 8:00 PM',
    venue: 'Peruvallur Panjayath Stadium',
    team1: 'Champion of Semi Final 1',
    team2: 'Champion of Semi Final 2',
    trophy: 'SFA All India Sevens Season 7 Rolling Trophy',
    prize: 'First Prize & Champions Purse'
  }
};

export default function TournamentBracket({ lang, isDarkMode }) {
  const [activeStage, setActiveStage] = useState('all'); // 'all' | 'r1' | 'qf' | 'sf' | 'final'

  return (
    <div className={`rounded-2xl sm:rounded-3xl border overflow-hidden p-4 sm:p-6 transition-colors shadow-xs ${
      isDarkMode 
        ? 'bg-slate-900 border-slate-800 text-white' 
        : 'bg-white border-slate-200 text-slate-900'
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-600 text-slate-950 flex items-center justify-center font-black shadow-xs">
            <Trophy className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-xl font-black font-sports uppercase tracking-wider text-slate-950">
                {lang === 'ml' ? 'റോഡ് ടു ഫൈനൽ (ടൂർണ്ണമെന്റ് ട്രീ)' : 'ROAD TO THE FINAL (KNOCKOUT TREE)'}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider">
                SFA Bracket
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {lang === 'ml'
                ? 'ഫൈനൽ കിരീടത്തിലേക്കുള്ള നോക്കൗട്ട് മത്സരവഴികൾ ഒറ്റനോട്ടത്തിൽ'
                : 'Interactive single-elimination tournament bracket from Round 1 to Grand Finale'}
            </p>
          </div>
        </div>

        {/* Stage Filter Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
          {[
            { id: 'all', label: 'Full Tree' },
            { id: 'r1', label: 'Round 1' },
            { id: 'qf', label: 'Quarters' },
            { id: 'sf', label: 'Semis' },
            { id: 'final', label: 'Grand Final' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveStage(tab.id)}
              className={`px-3 py-1 rounded-xl text-xs font-bold shrink-0 transition active:scale-95 ${
                activeStage === tab.id
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grand Finale Spotlight Card */}
      {(activeStage === 'all' || activeStage === 'final') && (
        <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-100 border-2 border-amber-300 shadow-xs relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0">
                <Trophy className="w-6 h-6 text-slate-950" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 block">
                  ★ THE GRAND FINALE • DEC 06
                </span>
                <h4 className="text-base sm:text-xl font-black font-sports text-slate-950 uppercase">
                  {BRACKET_DATA.grandFinal.trophy}
                </h4>
                <p className="text-xs text-amber-950 font-medium">
                  {BRACKET_DATA.grandFinal.venue} • 8:00 PM IST Floodlight
                </p>
              </div>
            </div>

            <div className="px-4 py-2 rounded-xl bg-slate-950 text-amber-400 font-sports font-black text-xs sm:text-sm tracking-wider uppercase shadow-xs self-stretch sm:self-auto text-center">
              🏆 Champions Night
            </div>
          </div>
        </div>
      )}

      {/* Bracket Columns Container */}
      <div className="mt-5 overflow-x-auto no-scrollbar pb-3">
        <div className="min-w-[700px] grid grid-cols-12 gap-3 sm:gap-4 items-start">
          {/* Column 1: Round 1 (5 cols) */}
          {(activeStage === 'all' || activeStage === 'r1') && (
            <div className={`${activeStage === 'r1' ? 'col-span-12' : 'col-span-4'} space-y-3`}>
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 border-b border-slate-200 pb-1.5">
                <span className="uppercase tracking-wider">Round 1 (8 Clashes)</span>
                <span className="text-[10px] text-blue-700">Nov 06 - 13</span>
              </div>

              <div className="space-y-2.5">
                {BRACKET_DATA.round1.map((m) => (
                  <div
                    key={m.id}
                    className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100/80 transition text-xs space-y-1.5 shadow-xs"
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span className="font-bold text-amber-700">{m.date}</span>
                      <span className="font-medium">{m.status}</span>
                    </div>

                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span className="truncate">{m.team1}</span>
                      <span className="text-slate-400">-</span>
                    </div>
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span className="truncate">{m.team2}</span>
                      <span className="text-slate-400">-</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Column 2: Quarter Finals (4 cols) */}
          {(activeStage === 'all' || activeStage === 'qf') && (
            <div className={`${activeStage === 'qf' ? 'col-span-12' : 'col-span-4'} space-y-3`}>
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 border-b border-slate-200 pb-1.5">
                <span className="uppercase tracking-wider">Quarter Finals</span>
                <span className="text-[10px] text-blue-700">Nov 20 - 26</span>
              </div>

              <div className="space-y-3 pt-2">
                {BRACKET_DATA.quarterFinals.map((qf) => (
                  <div
                    key={qf.id}
                    className="p-3 rounded-xl border border-blue-200 bg-blue-50/40 text-xs space-y-1.5 shadow-xs"
                  >
                    <div className="flex items-center justify-between text-[10px] text-blue-800 font-bold">
                      <span>{qf.status}</span>
                      <span>{qf.date}</span>
                    </div>

                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span className="truncate">{qf.team1}</span>
                    </div>
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span className="truncate">{qf.team2}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Column 3: Semi Finals & Final (4 cols) */}
          {(activeStage === 'all' || activeStage === 'sf') && (
            <div className={`${activeStage === 'sf' ? 'col-span-12' : 'col-span-4'} space-y-3`}>
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 border-b border-slate-200 pb-1.5">
                <span className="uppercase tracking-wider">Semi Finals</span>
                <span className="text-[10px] text-blue-700">Nov 30 - Dec 02</span>
              </div>

              <div className="space-y-4 pt-4">
                {BRACKET_DATA.semiFinals.map((sf) => (
                  <div
                    key={sf.id}
                    className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/50 text-xs space-y-2 shadow-xs"
                  >
                    <div className="flex items-center justify-between text-[10px] text-indigo-900 font-black">
                      <span>{sf.status}</span>
                      <span>{sf.date}</span>
                    </div>

                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span className="truncate">{sf.team1}</span>
                    </div>
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span className="truncate">{sf.team2}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
