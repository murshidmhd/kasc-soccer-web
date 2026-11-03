import React, { useState, useEffect } from 'react';
import { Clock, Sparkles, Calendar, Eye, ZoomIn, X } from 'lucide-react';
import { tournamentInfo } from '../data/tournamentData';
import countdownSeason7 from '../assets/promo/countdown_6days.jpg';

export default function Countdown({ lang, isDarkMode }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [selectedPoster, setSelectedPoster] = useState(null);

  // Live countdown clock ticker - single source of truth for time remaining
  useEffect(() => {
    const target = new Date(tournamentInfo.startDate).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const daysLabel = timeLeft.days === 1
    ? (lang === 'ml' ? '01 ദിനം ബാക്കി' : '01 DAY TO GO')
    : (lang === 'ml' ? `${String(timeLeft.days).padStart(2, '0')} ദിനങ്ങൾ ബാക്കി` : `${String(timeLeft.days).padStart(2, '0')} DAYS TO GO`);

  return (
    <div className={`w-full max-w-4xl mx-auto rounded-3xl p-4 sm:p-6 my-6 border transition-all shadow-sm ${
      isDarkMode 
        ? 'bg-slate-900/90 border-slate-700 text-white' 
        : 'bg-white border-slate-200 text-slate-900'
    }`}>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Left 7 cols: Live Ticker Digits */}
        <div className="md:col-span-7 space-y-3 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-700">
            <Clock className="w-4 h-4 text-blue-600 animate-spin" style={{ animationDuration: '10s' }} />
            <span>{lang === 'ml' ? 'ടൂർണ്ണമെന്റ് കിക്ക്ഓഫിലേക്ക്' : 'COUNTDOWN TO KICKOFF'}</span>
            <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-black uppercase tracking-wider animate-pulse ml-1">
              Live
            </span>
          </div>

          {/* Digits Grid */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {/* Days */}
            <div className={`rounded-2xl p-2.5 sm:p-3 text-center border shadow-2xs ${
              isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="text-2xl sm:text-4xl font-extrabold font-sports text-blue-900 tracking-wider">
                {String(timeLeft.days).padStart(2, '0')}
              </div>
              <div className="text-[10px] sm:text-xs text-slate-500 uppercase font-bold mt-0.5">
                {lang === 'ml' ? 'ദിവസം' : 'Days'}
              </div>
            </div>

            {/* Hours */}
            <div className={`rounded-2xl p-2.5 sm:p-3 text-center border shadow-2xs ${
              isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="text-2xl sm:text-4xl font-extrabold font-sports text-blue-900 tracking-wider">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <div className="text-[10px] sm:text-xs text-slate-500 uppercase font-bold mt-0.5">
                {lang === 'ml' ? 'മണിക്കൂർ' : 'Hours'}
              </div>
            </div>

            {/* Minutes */}
            <div className={`rounded-2xl p-2.5 sm:p-3 text-center border shadow-2xs ${
              isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="text-2xl sm:text-4xl font-extrabold font-sports text-blue-900 tracking-wider">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <div className="text-[10px] sm:text-xs text-slate-500 uppercase font-bold mt-0.5">
                {lang === 'ml' ? 'മിനിറ്റ്' : 'Mins'}
              </div>
            </div>

            {/* Seconds */}
            <div className={`rounded-2xl p-2.5 sm:p-3 text-center border shadow-2xs ${
              isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="text-2xl sm:text-4xl font-extrabold font-sports text-red-600 tracking-wider">
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
              <div className="text-[10px] sm:text-xs text-red-600 uppercase font-bold mt-0.5">
                {lang === 'ml' ? 'സെക്കന്റ്' : 'Secs'}
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-600 flex items-center justify-center md:justify-start gap-1.5 font-medium pt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
            <span>
              {lang === 'ml'
                ? '2026 നവംബർ 06 വെള്ളി | രാത്രി 8:00 മണിക്ക് ആരംഭിക്കുന്നു'
                : 'Starts Friday, 06 November 2026 at 8:00 PM IST'}
            </span>
          </div>
        </div>

        {/* Right 5 cols: Current Season 7 Poster */}
        <div className="md:col-span-5 flex flex-col items-center">
          <div className="w-full relative group">
            {/* Top Badge */}
            <div className="flex items-center justify-between text-xs mb-1.5 px-1">
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>{lang === 'ml' ? 'ഔദ്യോഗിക സീസൺ 7 പോസ്റ്റർ' : 'Official Season 7 Poster'}</span>
              </span>
              <span className="text-[10px] text-blue-700 font-mono font-bold">
                Season 7
              </span>
            </div>

            {/* Poster Frame (Strict 3:4 Sports Poster Format) */}
            <div 
              onClick={() => setSelectedPoster(countdownSeason7)}
              className="relative w-full max-w-[240px] sm:max-w-[260px] mx-auto aspect-[3/4] rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 shadow-md cursor-pointer transition-all duration-300 bg-slate-950 group"
            >
              <img 
                src={countdownSeason7} 
                alt="Season 7 Official Tournament Poster"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Floating Badge on Image driven by single source of truth countdown */}
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-xs border border-white/20">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping shrink-0"></span>
                  <span className="font-sports font-black tracking-wider text-amber-300">
                    {daysLabel}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-300 shrink-0">
                  <ZoomIn className="w-3 h-3" />
                  <span>3:4</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Poster Full Size Lightbox Modal (3:4 Poster Lightbox) */}
      {selectedPoster && (
        <div 
          onClick={() => setSelectedPoster(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
        >
          <div className="relative max-w-sm sm:max-w-md w-full aspect-[3/4] rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black">
            <img src={selectedPoster} alt="Season 7 Poster Full" className="w-full h-full object-contain" />
            <button
              onClick={() => setSelectedPoster(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/70 hover:bg-black text-white transition border border-white/20"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
