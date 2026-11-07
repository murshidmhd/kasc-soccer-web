import React, { useState } from 'react';
import { Calendar, Ticket, Play, X, Film } from 'lucide-react';
import { nextMatch } from '../data/tournamentData';
import TeamLogo from './TeamLogo';
import teaserPoster from '../assets/tournament_teaser_poster.webp';
import { SHOW_HOME_TEASER, VIDEO_AUTOPLAY_ENABLED, OFFICIAL_TRAILER_URL } from '../config/siteConfig';

export default function Hero({ lang, scrollToSection, isDarkMode, onOpenTicketModal, onNavigate }) {
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const isUdayaMatch = Boolean(
    nextMatch.teamHome?.name?.toUpperCase().includes('UDAYA') ||
    nextMatch.teamAway?.name?.toUpperCase().includes('UDAYA')
  );
  const nextMatchDate = nextMatch.date.replace(/^[^,]+,\s*/, '').replace(/\s+2026$/, '');

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
            {lang === 'ml' ? 'സീസൺ 7 • ഉദയ പറമ്പിൽ പീടിക & KASC' : 'Season 7 • Udaya Parambil Peedika & KASC'}
          </p>
        </div>

        {/* Next Match Card */}
        <div className={`w-full max-w-2xl mx-auto rounded-3xl p-5 sm:p-7 border-2 border-gold ${isUdayaMatch ? 'border-l-4 border-l-purple-500' : ''} ring-1 ring-gold/40 surface-navy-card text-white shadow-card relative overflow-hidden transition-all`}>
          {/* Upcoming match header */}
          <div className="flex items-center justify-between gap-2 flex-wrap pb-3.5 border-b border-navy-700">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-black uppercase tracking-wider btn-gold shadow-xs">
                <span>{lang === 'ml' ? 'അടുത്ത മത്സരം' : 'NEXT MATCH'}</span>
              </span>
              {isUdayaMatch && (
                <span className="px-2 py-0.5 rounded-md bg-purple-700 text-white text-[10px] font-black uppercase tracking-wider">
                  UDAYA
                </span>
              )}
            </div>

            <div className="text-[11px] sm:text-xs font-bold font-mono text-navy-muted shrink-0">
              <span>{nextMatchDate} • {nextMatch.time}</span>
            </div>
          </div>

          {/* Both Team Logos (Large in white circles) & Names */}
          <div className="grid grid-cols-12 gap-2 sm:gap-4 items-start text-center py-4 sm:py-6">
            {/* Team Home */}
            <div className="col-span-5 flex flex-col items-center space-y-2">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white p-1 border border-navy-700 flex items-center justify-center shadow-xs">
                <TeamLogo 
                  teamName={nextMatch.teamHome.name}
                  className="w-full h-full rounded-full object-contain" 
                />
              </div>
              <span className="font-sports font-black text-sm sm:text-base leading-snug line-clamp-2 px-1 text-white">
                {nextMatch.teamHome.name}
              </span>
              <span className="text-[11px] font-bold text-navy-muted">
                {nextMatch.teamHome.city}
              </span>
            </div>

            {/* Upcoming fixture */}
            <div className="col-span-2 flex flex-col items-center justify-center pt-3 sm:pt-5">
              <div className="w-10 h-10 rounded-full surface-navy-box border border-navy-700 text-white flex items-center justify-center font-black font-sports text-sm shadow-xs">
                VS
              </div>
            </div>

            {/* Team Away */}
            <div className="col-span-5 flex flex-col items-center space-y-2">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white p-1 border border-navy-700 flex items-center justify-center shadow-xs">
                <TeamLogo 
                  teamName={nextMatch.teamAway.name}
                  className="w-full h-full rounded-full object-contain" 
                />
              </div>
              <span className="font-sports font-black text-sm sm:text-base leading-snug line-clamp-2 px-1 text-white">
                {nextMatch.teamAway.name}
              </span>
              <span className="text-[11px] font-bold text-navy-muted">
                {nextMatch.teamAway.city}
              </span>
            </div>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="grid grid-cols-2 gap-2.5 pt-4">
            <button
              id="hero-fixtures-btn"
              onClick={() => scrollToSection('fixtures')}
              className="min-h-touch w-full py-3 px-3 sm:px-4 rounded-xl font-bold text-xs sm:text-sm btn-royal text-white shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Calendar className="w-4 h-4" />
              <span>{lang === 'ml' ? 'ഫിക്സ്ചർ (Fixtures)' : 'View Fixtures'}</span>
            </button>
            <button
              id="hero-ticket-btn"
              onClick={onOpenTicketModal}
              className="min-h-touch w-full py-3 px-2 sm:px-4 rounded-xl font-black text-xs sm:text-sm btn-gold shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <Ticket className="w-4 h-4 text-navy-900 shrink-0" />
              <span className="truncate">{lang === 'ml' ? 'ടിക്കറ്റ് (Tickets)' : 'Ticket Info'}</span>
            </button>
          </div>

          {/* Official Trailer Video Card with Poster & Play Button (Hidden behind SHOW_HOME_TEASER) */}
          {SHOW_HOME_TEASER && (
            <div className="mt-3.5">
              <button
                id="hero-trailer-btn"
                onClick={() => setIsTrailerOpen(true)}
                className="relative w-full h-24 sm:h-28 rounded-2xl overflow-hidden border border-gold/40 hover:border-gold shadow-lg group transition active:scale-98 text-left flex items-center"
                aria-label="Watch Official Tournament Trailer"
              >
                {/* Background Video Poster */}
                <img
                  src={teaserPoster}
                  alt="Tournament Trailer"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90"
                />
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/75 to-navy-900/40" />

                {/* Foreground Content */}
                <div className="relative z-10 w-full px-3.5 sm:px-5 py-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Glowing Play Button with pulse animation */}
                    <div className="relative shrink-0">
                      <span className="absolute -inset-1 rounded-full bg-gold/30 animate-ping opacity-75" />
                      <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-gold to-amber-500 text-navy-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-navy-950 text-navy-950 ml-0.5" />
                      </div>
                    </div>

                    {/* Title and Action Text */}
                    <div className="min-w-0">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-600/90 text-white text-[10px] font-black uppercase tracking-wider mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        <span>{lang === 'ml' ? 'ഒഫീഷ്യൽ ട്രെയിലർ' : 'Official Trailer'}</span>
                      </div>
                      <h3 className="font-sports font-black text-xs sm:text-sm text-white uppercase tracking-wider truncate drop-shadow-sm">
                        {lang === 'ml' ? 'സീസൺ 7 വീഡിയോ കാണുക' : 'Watch Season 7 Teaser'}
                      </h3>
                      <p className="text-[11px] text-gold font-semibold truncate">
                        {lang === 'ml' ? 'ക്ലിക്ക് ചെയ്ത് പ്ലേ ചെയ്യാം • Tap to Play' : 'Click to watch preview • Full HD'}
                      </p>
                    </div>
                  </div>

                  {/* Right Badge */}
                  <div className="hidden xs:flex flex-col items-end shrink-0">
                    <span className="px-2 py-1 rounded-lg bg-navy-900/80 border border-gold/30 text-gold text-[10px] font-black uppercase tracking-wider">
                      HD VIDEO
                    </span>
                  </div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Tournament Trailer Lightbox Modal */}
      {SHOW_HOME_TEASER && isTrailerOpen && (
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
                src={OFFICIAL_TRAILER_URL}
                poster={teaserPoster}
                controls
                preload="metadata"
                autoPlay={VIDEO_AUTOPLAY_ENABLED}
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
