import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { tournamentInfo } from '../data/tournamentData';

export default function Countdown({ lang, isDarkMode }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

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

  return (
    <div className={`w-full max-w-xl mx-auto rounded-2xl p-4 sm:p-5 my-6 text-center border transition-colors ${
      isDarkMode 
        ? 'bg-slate-900/90 border-slate-700 text-white' 
        : 'bg-white border-slate-200 text-slate-900 shadow-sm'
    }`}>
      <div className={`flex items-center justify-center gap-2 mb-3 text-xs sm:text-sm font-bold uppercase tracking-wider ${
        isDarkMode ? 'text-blue-400' : 'text-blue-700'
      }`}>
        <Clock className="w-4 h-4 text-blue-600 animate-spin" style={{ animationDuration: '8s' }} />
        <span>{lang === 'ml' ? 'ടൂർണ്ണമെന്റ് കിക്ക്ഓഫിലേക്ക്' : 'COUNTDOWN TO KICKOFF'}</span>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        {/* Days */}
        <div className={`rounded-xl p-3 border shadow-sm ${
          isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="text-2xl sm:text-4xl font-extrabold font-sports text-blue-900 tracking-wider">
            {String(timeLeft.days).padStart(2, '0')}
          </div>
          <div className="text-[11px] sm:text-xs text-slate-500 uppercase font-bold mt-0.5">
            {lang === 'ml' ? 'ദിവസം' : 'Days'}
          </div>
        </div>

        {/* Hours */}
        <div className={`rounded-xl p-3 border shadow-sm ${
          isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="text-2xl sm:text-4xl font-extrabold font-sports text-blue-900 tracking-wider">
            {String(timeLeft.hours).padStart(2, '0')}
          </div>
          <div className="text-[11px] sm:text-xs text-slate-500 uppercase font-bold mt-0.5">
            {lang === 'ml' ? 'മണിക്കൂർ' : 'Hours'}
          </div>
        </div>

        {/* Minutes */}
        <div className={`rounded-xl p-3 border shadow-sm ${
          isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="text-2xl sm:text-4xl font-extrabold font-sports text-blue-900 tracking-wider">
            {String(timeLeft.minutes).padStart(2, '0')}
          </div>
          <div className="text-[11px] sm:text-xs text-slate-500 uppercase font-bold mt-0.5">
            {lang === 'ml' ? 'മിനിറ്റ്' : 'Mins'}
          </div>
        </div>

        {/* Seconds */}
        <div className={`rounded-xl p-3 border shadow-sm ${
          isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="text-2xl sm:text-4xl font-extrabold font-sports text-red-600 tracking-wider">
            {String(timeLeft.seconds).padStart(2, '0')}
          </div>
          <div className="text-[11px] sm:text-xs text-red-600 uppercase font-bold mt-0.5">
            {lang === 'ml' ? 'സെക്കന്റ്' : 'Secs'}
          </div>
        </div>
      </div>

      <div className="mt-3 text-xs text-slate-600 flex items-center justify-center gap-2 font-medium">
        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        <span>
          {lang === 'ml'
            ? '2026 നവംബർ 06 വെള്ളി | രാത്രി 8:00 മണിക്ക് ആരംഭിക്കുന്നു'
            : 'Starts Friday, 06 November 2026 at 8:00 PM IST'}
        </span>
      </div>
    </div>
  );
}
