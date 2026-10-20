import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Radio, Users, Flame, Zap, Trophy, ShieldCheck, Share2 } from 'lucide-react';
import { openingMatch } from '../data/tournamentData';
import TeamLogo from './TeamLogo';

export default function LiveMatchCard({ lang, isDarkMode }) {
  const [isLiveDemo, setIsLiveDemo] = useState(false);
  const [scoreHome, setScoreHome] = useState(2);
  const [scoreAway, setScoreAway] = useState(1);
  const [matchMinute, setMatchMinute] = useState(38);
  const [events, setEvents] = useState([
    { minute: 12, team: 'home', player: 'Ibrahim Soumahoro', type: 'goal', text: 'Stunning curler into top right corner' },
    { minute: 24, team: 'away', player: 'Shameer K.', type: 'goal', text: 'Equalizer through penalty rebound' },
    { minute: 36, team: 'home', player: 'Riyas K. (Captain)', type: 'goal', text: 'Header from close range' }
  ]);

  const handleAddGoal = (team) => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });

    const newMinute = matchMinute + 2;
    setMatchMinute(newMinute);

    if (team === 'home') {
      setScoreHome((prev) => prev + 1);
      setEvents((prev) => [
        {
          minute: newMinute,
          team: 'home',
          player: 'Ibrahim Soumahoro',
          type: 'goal',
          text: 'Powerful counter-attack finish!'
        },
        ...prev
      ]);
    } else {
      setScoreAway((prev) => prev + 1);
      setEvents((prev) => [
        {
          minute: newMinute,
          team: 'away',
          player: 'Ousmane (Ghana)',
          type: 'goal',
          text: 'Thunderbolt strike from distance!'
        },
        ...prev
      ]);
    }
  };

  const handleReset = () => {
    setScoreHome(2);
    setScoreAway(1);
    setMatchMinute(38);
    setEvents([
      { minute: 12, team: 'home', player: 'Ibrahim Soumahoro', type: 'goal', text: 'Stunning curler into top right corner' },
      { minute: 24, team: 'away', player: 'Shameer K.', type: 'goal', text: 'Equalizer through penalty rebound' },
      { minute: 36, team: 'home', player: 'Riyas K. (Captain)', type: 'goal', text: 'Header from close range' }
    ]);
  };

  return (
    <section id="live-match" className="w-full">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="p-1 rounded-md bg-red-600 text-white">
              <Flame className="w-3.5 h-3.5" />
            </span>
            <h2 className="text-xl sm:text-3xl font-black font-sports uppercase tracking-wider text-slate-950">
              {lang === 'ml' ? 'മാച്ച് സെന്റർ' : 'MATCH CENTER'}
            </h2>
          </div>
          <p className="text-[11px] sm:text-sm text-slate-600">
            {lang === 'ml'
              ? 'തത്സമയ സ്കോറും പന്ത് തട്ടുന്ന നിമിഷങ്ങളും'
              : 'Real-time scores & minute-by-minute updates'}
          </p>
        </div>

        {/* Committee Live Demo Toggle */}
        <div className={`flex items-center justify-between sm:justify-start gap-2 p-1.5 rounded-xl border ${
          isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300 shadow-xs'
        }`}>
          <span className="text-[11px] font-bold text-slate-600 pl-1.5">
            Demo:
          </span>
          <button
            onClick={() => setIsLiveDemo(!isLiveDemo)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 active:scale-95 ${
              isLiveDemo
                ? 'bg-red-600 text-white shadow-xs animate-pulse'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Radio className="w-3 h-3" />
            <span>{isLiveDemo ? 'SIMULATION ON' : 'PREVIEW LIVE'}</span>
          </button>
        </div>
      </div>

      {/* Main Match Card (App-Style Mobile Layout) */}
      <div className={`rounded-2xl sm:rounded-3xl overflow-hidden border p-3.5 sm:p-7 relative shadow-xs transition-colors ${
        isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Top Match Ribbon */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 mb-4 text-[11px] sm:text-xs font-semibold">
          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 font-bold border border-blue-200">
            Day 1 • Opening Match
          </span>

          <div className="flex items-center gap-2">
            {isLiveDemo ? (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-600 text-white font-bold text-[10px] uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                LIVE • {matchMinute}'
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-bold text-[10px] border border-amber-200">
                Nov 06 • 8:00 PM
              </span>
            )}
          </div>
        </div>

        {/* Mobile-Perfect Scoreboard Layout (Side-by-Side 3-part layout) */}
        <div className="grid grid-cols-12 gap-1 sm:gap-4 items-center text-center">
          {/* Team Home (UDAYA Peruvallur) */}
          <div className="col-span-4 flex flex-col items-center space-y-1">
            <TeamLogo teamName={openingMatch.teamHome.name} className="w-14 h-14 sm:w-20 sm:h-20 shadow-xs" />
            <h3 className="text-xs sm:text-lg font-black font-sports text-slate-950 leading-tight">
              UDAYA
            </h3>
            <span className="text-[10px] sm:text-xs text-blue-700 font-bold">
              Peruvallur
            </span>
          </div>

          {/* Center Scores / VS */}
          <div className="col-span-4 flex flex-col items-center justify-center">
            {isLiveDemo ? (
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1.5 sm:gap-3">
                  <span className="text-4xl sm:text-6xl font-black font-sports text-slate-950">
                    {scoreHome}
                  </span>
                  <span className="text-2xl sm:text-4xl font-black text-slate-300">-</span>
                  <span className="text-4xl sm:text-6xl font-black font-sports text-slate-950">
                    {scoreAway}
                  </span>
                </div>
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[9px] sm:text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>1.4k+ Online</span>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="text-2xl sm:text-4xl font-black font-sports text-blue-700">
                  VS
                </div>
                <div className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                  Floodlight
                </div>
              </div>
            )}
          </div>

          {/* Team Away (SABAN FC Kottakkal) */}
          <div className="col-span-4 flex flex-col items-center space-y-1">
            <TeamLogo teamName={openingMatch.teamAway.name} className="w-14 h-14 sm:w-20 sm:h-20 shadow-xs" />
            <h3 className="text-xs sm:text-lg font-black font-sports text-slate-950 leading-tight">
              SABAN FC
            </h3>
            <span className="text-[10px] sm:text-xs text-amber-700 font-bold">
              Kottakkal
            </span>
          </div>
        </div>

        {/* Live Simulation Control Buttons for Mobile Presentation */}
        {isLiveDemo && (
          <div className="mt-5 pt-4 border-t border-slate-200 bg-slate-50 -mx-3.5 -mb-3.5 sm:-mx-7 sm:-mb-7 p-3 sm:p-5 rounded-b-2xl sm:rounded-b-3xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Demo Tap Controls:
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => handleAddGoal('home')}
                  className="py-1.5 px-2 rounded-lg text-[10px] font-bold bg-sky-700 hover:bg-sky-800 text-white shadow-xs active:scale-95 transition"
                >
                  +1 Udaya
                </button>
                <button
                  onClick={() => handleAddGoal('away')}
                  className="py-1.5 px-2 rounded-lg text-[10px] font-bold bg-amber-500 hover:bg-amber-600 text-black shadow-xs active:scale-95 transition"
                >
                  +1 Saban
                </button>
                <button
                  onClick={handleReset}
                  className="py-1.5 px-2 rounded-lg text-[10px] font-bold bg-slate-200 text-slate-700 active:scale-95 transition"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Live Events Timeline */}
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {events.map((evt, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-[11px] py-1.5 px-2.5 rounded-lg bg-white border border-slate-200 shadow-xs"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-blue-700 font-sports">
                      {evt.minute}'
                    </span>
                    <span className="text-emerald-700 font-bold">⚽ Goal!</span>
                    <span className="text-slate-900 font-bold truncate max-w-[130px] sm:max-w-none">
                      {evt.player}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
