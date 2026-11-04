import React, { useState, useEffect } from 'react';
import { Calendar, Ticket, Clock, Play, X, Film } from 'lucide-react';
import { tournamentInfo, openingMatch } from '../data/tournamentData';
import TeamLogo from './TeamLogo';
import { getStoredMatchState } from '../utils/matchStateManager';

export default function Hero({ lang, scrollToSection, isDarkMode, onOpenTicketModal }) {
  const [matchState, setMatchState] = useState(getStoredMatchState);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Sync with global match state updates
  useEffect(() => {
    const handleUpdate = (e) => {
      setMatchState(e.detail || getStoredMatchState());
    };
    window.addEventListener('kasc_match_state_updated', handleUpdate);
    return () => window.removeEventListener('kasc_match_state_updated', handleUpdate);
  }, []);

  // Live countdown clock ticker
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
      const minutes = Math.floor((difference % (1000 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const isLive = matchState && matchState.status !== 'UPCOMING';

  return (
    <section className="pt-6 pb-6 px-3 sm:px-6 border-b border-navy-700 surface-navy text-white transition-colors">
      <div className="max-w-4xl mx-auto">
        {/* Top Title: Clean & Direct */}
        <div className="text-center space-y-1 mb-5">
          <h1 className={`font-black uppercase tracking-tight text-white ${
            lang === 'ml' 
              ? 'font-malayalam text-2xl sm:text-4xl leading-[1.3]' 
              : 'font-sports text-3xl sm:text-5xl leading-[1.3]'
          }`}>
            {lang === 'ml' ? 'അഖിലേന്ത്യാ സെവൻസ്' : 'ALL INDIA SEVENS'}
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-navy-muted leading-[1.5]">
            {lang === 'ml' ? 'സീസൺ 7 • ഉദയ & കാസ്ക്' : 'Season 7 • Udaya & KASC'}
          </p>
        </div>

        {/* Next / Live Match Card */}
        <div className={`w-full max-w-2xl mx-auto rounded-3xl p-5 sm:p-7 border-2 border-gold ring-1 ring-gold/40 surface-navy-card text-white shadow-card relative overflow-hidden transition-all ${
          isLive ? 'ring-2 ring-gold' : ''
        }`}>
          {/* Card Header: Gold highlight for next match / LIVE */}
          <div className="flex items-center justify-between pb-3.5 border-b border-navy-700">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider btn-gold shadow-xs">
              {isLive && <span className="w-2 h-2 rounded-full bg-navy-900 animate-ping"></span>}
              <span>{isLive ? 'LIVE' : (lang === 'ml' ? 'ഉദ്ഘാടന മത്സരം' : 'Opening match')}</span>
            </span>

            <div className="text-xs font-bold font-mono text-navy-muted">
              <span>06 Nov • 8:00 PM IST</span>
            </div>
          </div>

          {/* Both Team Logos (Large in white circles) & Names */}
          <div className="grid grid-cols-12 gap-2 sm:gap-4 items-center text-center py-4 sm:py-6">
            {/* Team Home */}
            <div className="col-span-5 flex flex-col items-center space-y-2">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white p-1 border border-navy-700 flex items-center justify-center shadow-xs">
                <TeamLogo 
                  teamName={openingMatch.teamHome.name} 
                  className="w-full h-full rounded-full object-contain" 
                />
              </div>
              <span className="font-sports font-black text-sm sm:text-base leading-snug line-clamp-2 px-1 text-white">
                {openingMatch.teamHome.name}
              </span>
              <span className="text-[11px] font-bold text-navy-muted">
                {openingMatch.teamHome.city}
              </span>
            </div>

            {/* Center Score (Live) or VS (Upcoming) */}
            <div className="col-span-2 flex flex-col items-center justify-center">
              {isLive ? (
                <div className="flex items-center justify-center gap-1.5 font-sports font-black text-3xl sm:text-4xl text-white">
                  <span>{matchState.officialScoreHome}</span>
                  <span className="text-gold">-</span>
                  <span>{matchState.officialScoreAway}</span>
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full surface-navy-box border border-navy-700 text-white flex items-center justify-center font-black font-sports text-sm shadow-xs">
                  VS
                </div>
              )}
            </div>

            {/* Team Away */}
            <div className="col-span-5 flex flex-col items-center space-y-2">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white p-1 border border-navy-700 flex items-center justify-center shadow-xs">
                <TeamLogo 
                  teamName={openingMatch.teamAway.name} 
                  className="w-full h-full rounded-full object-contain" 
                />
              </div>
              <span className="font-sports font-black text-sm sm:text-base leading-snug line-clamp-2 px-1 text-white">
                {openingMatch.teamAway.name}
              </span>
              <span className="text-[11px] font-bold text-navy-muted">
                {openingMatch.teamAway.city}
              </span>
            </div>
          </div>

          {/* Integrated Live Countdown Timer */}
          {!isLive && (
            <div className="pt-3 pb-1 border-t border-navy-700">
              <div className="text-center mb-2.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-navy-muted">
                  {lang === 'ml' ? 'കിക്ക്ഓഫിലേക്ക് ഇനി' : 'COUNTDOWN TO KICKOFF'}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-sm mx-auto">
                <div className="p-2 sm:p-2.5 rounded-2xl text-center border border-navy-700 surface-navy-box">
                  <div className="text-[28px] sm:text-3xl font-black font-sports text-white leading-none">
                    {String(timeLeft.days).padStart(2, '0')}
                  </div>
                  <div className="text-[12px] font-bold uppercase text-navy-muted mt-1">
                    {lang === 'ml' ? 'ദിനം' : 'Days'}
                  </div>
                </div>
                <div className="p-2 sm:p-2.5 rounded-2xl text-center border border-navy-700 surface-navy-box">
                  <div className="text-[28px] sm:text-3xl font-black font-sports text-white leading-none">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </div>
                  <div className="text-[12px] font-bold uppercase text-navy-muted mt-1">
                    {lang === 'ml' ? 'മണി' : 'Hours'}
                  </div>
                </div>
                <div className="p-2 sm:p-2.5 rounded-2xl text-center border border-navy-700 surface-navy-box">
                  <div className="text-[28px] sm:text-3xl font-black font-sports text-white leading-none">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </div>
                  <div className="text-[12px] font-bold uppercase text-navy-muted mt-1">
                    {lang === 'ml' ? 'മിനിറ്റ്' : 'Mins'}
                  </div>
                </div>
                <div className="p-2 sm:p-2.5 rounded-2xl text-center border border-navy-700 surface-navy-box">
                  <div className="text-[28px] sm:text-3xl font-black font-sports text-gold leading-none">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </div>
                  <div className="text-[12px] font-bold uppercase text-navy-muted mt-1">
                    {lang === 'ml' ? 'സെക്കൻഡ്' : 'Secs'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Action Navigation Buttons */}
          <div className="grid grid-cols-2 gap-2.5 pt-4">
            <button
              onClick={() => scrollToSection('fixtures')}
              className="min-h-touch w-full py-3 px-3 sm:px-4 rounded-xl font-bold text-xs sm:text-sm btn-royal text-white shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Calendar className="w-4 h-4" />
              <span>{lang === 'ml' ? 'മത്സരക്രമം' : 'View Fixtures'}</span>
            </button>
            <button
              onClick={onOpenTicketModal}
              className="min-h-touch w-full py-3 px-2 sm:px-4 rounded-xl font-black text-xs sm:text-sm btn-gold shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <Ticket className="w-4 h-4 text-navy-900 shrink-0" />
              <span className="truncate">{lang === 'ml' ? 'ടിക്കറ്റ് വിവരങ്ങൾ' : 'Ticket Info'}</span>
            </button>
          </div>

          {/* Official Trailer Button in Front (User request: trailer video in front) */}
          <button
            onClick={() => setIsTrailerOpen(true)}
            className="mt-3 w-full min-h-[44px] py-2.5 px-4 rounded-xl border border-navy-700 bg-navy-850 hover:bg-navy-700 text-gold font-bold text-xs uppercase tracking-wider transition active:scale-95 flex items-center justify-center gap-2 shadow-xs"
            aria-label="Watch Official Tournament Trailer"
          >
            <Play className="w-4 h-4 fill-gold text-gold shrink-0" />
            <span className="truncate">
              {lang === 'ml' ? '🎬 ഒഫീഷ്യൽ ടൂർണ്ണമെന്റ് ട്രെയിലർ കാണുക' : '🎬 Watch Official Tournament Trailer'}
            </span>
          </button>
        </div>
      </div>

      {/* Fullscreen Tournament Trailer Lightbox Modal */}
      {isTrailerOpen && (
        <div 
          onClick={() => setIsTrailerOpen(false)}
          className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6 bg-navy-900/95 animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl rounded-3xl bg-navy-950 border border-navy-700 shadow-2xl overflow-hidden"
          >
            <div className="p-3.5 bg-navy-800 border-b border-navy-700 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-gold" />
                <h4 className="font-sports font-black text-xs sm:text-sm uppercase tracking-wider text-white">
                  {lang === 'ml' ? 'സീസൺ 7 ഒഫീഷ്യൽ ട്രെയിലർ' : 'Season 7 Official Tournament Teaser'}
                </h4>
              </div>
              <button
                onClick={() => setIsTrailerOpen(false)}
                className="w-11 h-11 rounded-xl bg-navy-700 hover:bg-navy-600 text-white flex items-center justify-center transition active:scale-95"
                aria-label="Close trailer video"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-2 sm:p-4 bg-black flex items-center justify-center">
              <video
                src="/tournament_teaser.mp4"
                controls
                autoPlay
                playsInline
                className="w-full max-h-[70vh] rounded-xl object-contain shadow-2xl"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
