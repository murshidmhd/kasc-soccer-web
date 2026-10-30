import React from 'react';
import { Calendar, MapPin, Phone, Award, Shield, ChevronDown, Ticket, Play, Film, Gamepad2 } from 'lucide-react';
import { tournamentInfo } from '../data/tournamentData';
import Countdown from './Countdown';
import squadStarsPoster from '../assets/squad_stars_poster.jpg';
import logoUdaya from '../assets/logo_udaya_transparent.png';
import logoKasc from '../assets/logo_kasc.png';
import matchActionDuel from '../assets/match_action_duel.jpg';
import tournamentOfficialPoster from '../assets/tournament_official_poster.jpg';
import tournamentTeaser from '../assets/tournament_teaser.mp4';
import tournamentTeaserPoster from '../assets/tournament_teaser_poster.jpg';

export default function Hero({ lang, scrollToSection, isDarkMode, onOpenTicketModal }) {
  const [activeBannerTab, setActiveBannerTab] = React.useState('action');

  return (
    <section className={`relative pt-5 pb-10 px-3 sm:px-6 border-b transition-colors ${
      isDarkMode 
        ? 'bg-slate-950 border-slate-800 text-white' 
        : 'bg-gradient-to-b from-blue-50/70 via-white to-slate-50 border-slate-200 text-slate-900'
    }`}>
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Top Badges: Affiliation & Season */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
            isDarkMode 
              ? 'bg-blue-950 border-blue-800 text-blue-300' 
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            {tournamentInfo.affiliation}
          </span>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
            isDarkMode 
              ? 'bg-amber-950 border-amber-800 text-amber-300' 
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}>
            <Award className="w-3.5 h-3.5 text-amber-600" />
            {lang === 'ml' ? 'സീസൺ 7' : 'Season 7'}
          </span>
        </div>

        {/* Club Crests & Main Tournament Heading */}
        <div className="text-center space-y-3">
          {/* Joint Organizers Crest Bar */}
          <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-2xl border shadow-xs bg-white border-slate-200">
            <img src={logoUdaya} alt="Udaya Club" className="w-7 h-7 rounded-full object-contain" />
            <span className="text-xs font-black text-amber-800 font-sports">UDAYA</span>
            <span className="text-slate-400 font-bold text-xs">✕</span>
            <img src={logoKasc} alt="KASC Peruvallur" className="w-7 h-7 rounded-full object-contain" />
            <span className="text-xs font-black text-blue-800 font-sports">KASC</span>
            <span className="text-[11px] text-slate-500 font-medium pl-1 hidden sm:inline font-malayalam">
              {lang === 'ml' ? 'സംയുക്തമായി സംഘടിപ്പിക്കുന്നു' : 'Joint Presentation'}
            </span>
          </div>

          {/* Main Title & Season Tag */}
          <div className="space-y-1">
            <h1 className={`font-black uppercase text-slate-950 ${
              lang === 'ml' 
                ? 'font-malayalam text-2xl sm:text-4xl md:text-5xl leading-tight' 
                : 'font-sports text-3xl sm:text-5xl md:text-6xl leading-tight tracking-tight'
            }`}>
              {lang === 'ml' ? 'അഖിലേന്ത്യാ സെവൻസ്' : 'ALL INDIA SEVENS'}
            </h1>
            <div className="flex items-center justify-center gap-2 pt-0.5">
              <span className="text-base sm:text-2xl font-black font-sports text-red-600 tracking-wider">
                SEASON 7
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs sm:text-sm font-bold text-slate-600">
                {lang === 'ml' ? 'നവംബർ 06 - ഡിസംബർ 06' : 'Nov 06 - Dec 06, 2026'}
              </span>
            </div>
          </div>

          {/* Venue & Maps Button */}
          <div className="flex justify-center pt-1">
            <a
              href={tournamentInfo.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-xs font-bold shadow-xs transition hover:border-red-400 ${
                isDarkMode 
                  ? 'bg-slate-900 border-slate-700 text-slate-200' 
                  : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
              <span>{lang === 'ml' ? 'പെരുവള്ളൂർ പഞ്ചായത്ത് സ്റ്റേഡിയം, പറമ്പിൽ പീടിക' : tournamentInfo.venue}</span>
            </a>
          </div>
        </div>

        {/* Hero Visual Showcase with BOTH Duel Image and Poster Image */}
        <div className={`relative mt-6 rounded-2xl overflow-hidden border p-3.5 sm:p-5 transition-colors shadow-xs ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            {/* Left Column: Match Duel */}
            <div className="md:col-span-7 flex flex-col justify-center space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 text-red-800 text-[10px] sm:text-xs font-bold border border-red-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
                  <span>{lang === 'ml' ? 'ഉദ്ഘാടന മത്സരം' : 'OPENING BLOCKBUSTER'} • NOV 06</span>
                </div>

                {/* Toggle Visual Mode */}
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[11px]">
                  <button
                    onClick={() => setActiveBannerTab('video')}
                    className={`px-2.5 py-1 rounded-md font-bold transition active:scale-95 flex items-center gap-1 ${
                      activeBannerTab === 'video' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-700 hover:text-red-600'
                    }`}
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>{lang === 'ml' ? 'ടീസർ' : 'Teaser Video'}</span>
                  </button>
                  <button
                    onClick={() => setActiveBannerTab('action')}
                    className={`px-2.5 py-1 rounded-md font-bold transition active:scale-95 ${
                      activeBannerTab === 'action' ? 'bg-blue-700 text-white shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Match Duel
                  </button>
                  <button
                    onClick={() => setActiveBannerTab('stars')}
                    className={`px-2.5 py-1 rounded-md font-bold transition active:scale-95 ${
                      activeBannerTab === 'stars' ? 'bg-blue-700 text-white shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Squad Stars
                  </button>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 font-sports">
                UDAYA PARAMBIL PEEDIKA <span className="text-blue-600">vs</span> NEW MALAYA MALABAR FC
              </h2>

              <p className="text-xs text-slate-600 font-medium">
                {lang === 'ml'
                  ? 'ഫ്ലഡ്‌ലിറ്റ് സെവൻസ് ഫുട്ബോൾ പോരാട്ടം • രാത്രി 8:00 PM'
                  : 'Live Floodlit Sevens Football • Every Night 8:00 PM IST'}
              </p>

              {/* Dynamic Duel Visual (Official Video vs Action Duel vs Squad Stars) */}
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-950 p-1 shadow-xs relative">
                {activeBannerTab === 'video' ? (
                  <div className="relative w-full h-56 sm:h-72 md:h-80 lg:h-[340px] rounded-lg overflow-hidden bg-black flex items-center justify-center">
                    <video
                      src={tournamentTeaser}
                      poster={tournamentTeaserPoster}
                      controls
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ) : activeBannerTab === 'action' ? (
                  <div className="relative group">
                    <img
                      src={matchActionDuel}
                      alt="Match Duel: Udaya vs New Malaya Malabar FC"
                      className="w-full h-56 sm:h-72 md:h-80 lg:h-[340px] object-cover object-top rounded-lg"
                    />
                    <button
                      onClick={() => setActiveBannerTab('video')}
                      className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-red-600/90 hover:bg-red-700 text-white font-black text-xs shadow-lg backdrop-blur-md flex items-center gap-1.5 transition active:scale-95 animate-pulse"
                      title="Play Official Promo Video"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{lang === 'ml' ? 'ടീസർ കാണുക' : 'Watch Promo Video'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="relative group">
                    <img
                      src={squadStarsPoster}
                      alt="Official Udaya FC Squad 2026-2027"
                      className="w-full h-56 sm:h-72 md:h-80 lg:h-[340px] object-cover object-top rounded-lg"
                    />
                    <button
                      onClick={() => setActiveBannerTab('video')}
                      className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-red-600/90 hover:bg-red-700 text-white font-black text-xs shadow-lg backdrop-blur-md flex items-center gap-1.5 transition active:scale-95"
                      title="Play Official Promo Video"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{lang === 'ml' ? 'ടീസർ കാണുക' : 'Watch Promo Video'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => scrollToSection('live-match')}
                  className="w-full py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-blue-700 hover:bg-blue-800 text-white shadow-xs transition active:scale-95 text-center"
                >
                  {lang === 'ml' ? 'ലൈവ് സ്കോർ' : 'Live Match Center'}
                </button>
                <button
                  onClick={() => scrollToSection('fixtures')}
                  className="w-full py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition active:scale-95 text-center"
                >
                  {lang === 'ml' ? 'മത്സരക്രമം' : 'View Fixtures'}
                </button>
              </div>

              {/* Instant Ticket & GPay Counter POS Banner Button */}
              <button
                onClick={onOpenTicketModal}
                className="w-full py-2.5 px-4 rounded-xl font-black text-xs sm:text-sm bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 shadow-sm transition active:scale-98 flex items-center justify-center gap-2 border border-amber-300"
              >
                <Ticket className="w-4 h-4 text-slate-950" />
                <span>
                  {lang === 'ml' 
                    ? 'ടിക്കറ്റ് ബുക്കിംഗ് & GPay QR' 
                    : 'Match Tickets & Instant GPay QR'}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-950 text-white text-[10px] font-black uppercase">
                  From ₹50
                </span>
              </button>
            </div>

            {/* Right Column: Clean Generated Tournament Poster (NO text at bottom) */}
            <div className="md:col-span-5 flex flex-col items-center justify-center pt-2 md:pt-0 space-y-2.5">
              <div className="relative group rounded-2xl overflow-hidden border border-slate-200 shadow-md max-w-[260px] sm:max-w-[300px] w-full">
                <img
                  src={tournamentOfficialPoster}
                  alt="Peruvallur Cup Official Poster"
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition duration-500"
                />
              </div>

              {/* Teaser Video Quick Play Button & Penalty Game Launcher */}
              <div className="w-full max-w-[260px] sm:max-w-[300px] grid grid-cols-2 gap-2">
                <button
                  onClick={() => setActiveBannerTab('video')}
                  className="py-2 px-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-[11px] shadow-xs flex items-center justify-center gap-1.5 transition active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{lang === 'ml' ? 'ടീസർ (HD)' : 'Teaser Video'}</span>
                </button>
                <a
                  href="#game"
                  className="py-2 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[11px] shadow-xs flex items-center justify-center gap-1.5 transition active:scale-95 text-center"
                >
                  <Gamepad2 className="w-3.5 h-3.5" />
                  <span>{lang === 'ml' ? 'പെനാൽറ്റി കളി' : 'Play Penalty'}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Live Countdown Timer */}
        <Countdown lang={lang} isDarkMode={isDarkMode} />
      </div>
    </section>
  );
}
