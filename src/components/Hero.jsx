import React from 'react';
import { Calendar, MapPin, Phone, Award, Shield, ChevronDown, Ticket, Play, Film, Gamepad2, X, Sparkles } from 'lucide-react';
import { tournamentInfo } from '../data/tournamentData';
import Countdown from './Countdown';
import squadStarsPoster from '../assets/squad_stars_poster.jpg';
import logoUdaya from '../assets/logo_udaya_transparent.png';
import logoKasc from '../assets/logo_kasc.png';
import matchActionDuel from '../assets/match_action_duel.jpg';
import tournamentOfficialPoster from '../assets/tournament_official_poster.jpg';
import tournamentTeaser from '../assets/tournament_teaser.mp4';
import tournamentTeaserPoster from '../assets/tournament_teaser_poster.jpg';
import teaserVideoBtnThumb from '../assets/teaser_video_btn_thumb.jpg';
import countdown6 from '../assets/promo/countdown_6days.jpg';
import countdown8 from '../assets/promo/countdown_8days.jpg';
import countdown9 from '../assets/promo/countdown_9days.jpg';
import countdown10 from '../assets/promo/countdown_10days.jpg';
import countdown11 from '../assets/promo/countdown_11days.jpg';

const AMBIENT_COUNTDOWN_POSTERS = [countdown6, countdown8, countdown9, countdown10, countdown11];

export default function Hero({ lang, scrollToSection, isDarkMode, onOpenTicketModal }) {
  const [activeBannerTab, setActiveBannerTab] = React.useState('action');
  const [ambientIndex, setAmbientIndex] = React.useState(0);

  // Subtle ambient countdown posters background rotation
  React.useEffect(() => {
    const timer = setInterval(() => {
      setAmbientIndex((prev) => (prev + 1) % AMBIENT_COUNTDOWN_POSTERS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className={`relative pt-6 pb-10 px-3 sm:px-6 border-b transition-colors overflow-hidden ${
      isDarkMode 
        ? 'bg-slate-950 border-slate-800 text-white' 
        : 'bg-gradient-to-b from-blue-50/70 via-white to-slate-50 border-slate-200 text-slate-900'
    }`}>
      {/* Subtle Ambient Countdown Posters Background Blend with Light Mask */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {AMBIENT_COUNTDOWN_POSTERS.map((poster, idx) => (
          <img
            key={idx}
            src={poster}
            alt="Countdown Backdrop Ambient"
            className={`absolute inset-0 w-full h-full object-cover filter blur-[3px] transition-all duration-1000 ${
              idx === ambientIndex 
                ? isDarkMode ? 'opacity-[0.08] scale-105' : 'opacity-[0.05] scale-105'
                : 'opacity-0 scale-100'
            }`}
          />
        ))}
        {/* Soft Vignette Mask preserving crisp contrast */}
        <div className={`absolute inset-0 ${
          isDarkMode 
            ? 'bg-gradient-to-t from-slate-950/95 via-transparent to-slate-950/90' 
            : 'bg-gradient-to-t from-slate-50/95 via-transparent to-white/90'
        }`}></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Top Organizer & Affiliation Ribbon (Clean 2-tier alignment) */}
        <div className="flex flex-col items-center gap-2 mb-3">
          {/* Tier 1: Affiliation & Season Badges */}
          <div className="flex items-center justify-center flex-wrap gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border shadow-2xs ${
              isDarkMode 
                ? 'bg-blue-950/80 border-blue-700 text-blue-300' 
                : 'bg-blue-50 border-blue-200 text-blue-900'
            }`}>
              <Shield className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>{tournamentInfo.affiliation}</span>
            </span>
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black border shadow-2xs ${
              isDarkMode 
                ? 'bg-amber-950/80 border-amber-700 text-amber-300' 
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>{lang === 'ml' ? 'സീസൺ 7' : 'Season 7'}</span>
            </span>
          </div>

          {/* Tier 2: Joint Organizers Crest Bar */}
          <div className={`inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-full border shadow-xs transition-colors ${
            isDarkMode 
              ? 'bg-slate-900 border-slate-800 text-white' 
              : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <img src={logoUdaya} alt="Udaya Club" className="w-6 h-6 rounded-full object-contain border border-amber-500 bg-white p-0.5" />
            <span className="text-xs font-black text-amber-700 dark:text-amber-400 font-sports tracking-wide">UDAYA</span>
            <span className="text-slate-400 font-bold text-xs">✕</span>
            <img src={logoKasc} alt="KASC Peruvallur" className="w-6 h-6 rounded-full object-contain border border-blue-600 bg-white p-0.5" />
            <span className="text-xs font-black text-blue-800 dark:text-sky-400 font-sports tracking-wide">KASC</span>
            <span className="text-[11px] text-slate-700 dark:text-slate-300 font-bold pl-1 font-malayalam">
              {lang === 'ml' ? 'സംയുക്തമായി സംഘടിപ്പിക്കുന്നു' : 'Joint Presentation'}
            </span>
          </div>
        </div>

        {/* Main Tournament Heading */}
        <div className="text-center space-y-2.5">
          {/* Crisp, Vibrant Main Title & Season Tag */}
          <div className="space-y-1">
            <h1 className={`font-black uppercase tracking-tight text-slate-950 dark:text-white ${
              lang === 'ml' 
                ? 'font-malayalam text-2xl sm:text-4xl md:text-5xl leading-tight' 
                : 'font-sports text-3xl sm:text-5xl md:text-6xl leading-tight'
            }`}>
              {lang === 'ml' ? 'അഖിലേന്ത്യാ സെവൻസ്' : 'ALL INDIA SEVENS'}
            </h1>
            <div className="flex items-center justify-center gap-2 pt-0.5">
              <span className="text-base sm:text-2xl font-black font-sports text-red-600 tracking-wider">
                SEASON 7
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200">
                {lang === 'ml' ? 'നവംബർ 06 - ഡിസംബർ 06' : 'Nov 06 - Dec 06, 2026'}
              </span>
            </div>
          </div>

          {/* Venue & Maps Button */}
          <div className="flex justify-center pt-0.5">
            <a
              href={tournamentInfo.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold shadow-xs transition active:scale-95 ${
                isDarkMode 
                  ? 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700' 
                  : 'bg-white border-slate-200 hover:border-red-400 text-slate-800'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
              <span>{lang === 'ml' ? 'പെരുവള്ളൂർ പഞ്ചായത്ത് സ്റ്റേഡിയം, പറമ്പിൽ പീടിക' : tournamentInfo.venue}</span>
            </a>
          </div>
        </div>

        {/* Hero Visual Showcase: Clean Sports Card with Match Duel & 3:4 Poster */}
        <div className={`relative mt-6 rounded-3xl overflow-hidden border p-4 sm:p-6 shadow-sm transition-colors ${
          isDarkMode 
            ? 'bg-slate-900 border-slate-800 text-white' 
            : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            {/* Left Column: Match Duel */}
            <div className="md:col-span-7 flex flex-col justify-center space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider bg-red-600 text-white shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                  <span>{lang === 'ml' ? 'ഉദ്ഘാടന മത്സരം' : 'OPENING BLOCKBUSTER'} • NOV 06</span>
                </div>

                {/* Toggle Visual Mode (High Contrast & Sharp Readability) */}
                <div className={`flex items-center gap-1 p-0.5 rounded-xl border text-[11px] shadow-2xs ${
                  isDarkMode 
                    ? 'bg-slate-800 border-slate-700' 
                    : 'bg-slate-100 border-slate-300'
                }`}>
                  <button
                    onClick={() => setActiveBannerTab('video')}
                    className={`px-2.5 py-1 rounded-lg font-black transition active:scale-95 flex items-center gap-1 ${
                      activeBannerTab === 'video' 
                        ? 'bg-red-600 text-white shadow-xs' 
                        : 'bg-white text-slate-900 hover:bg-slate-50 border border-slate-200/80'
                    }`}
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>{lang === 'ml' ? 'ടീസർ' : 'Teaser Video'}</span>
                  </button>
                  <button
                    onClick={() => setActiveBannerTab('action')}
                    className={`px-2.5 py-1 rounded-lg font-black transition active:scale-95 ${
                      activeBannerTab === 'action' 
                        ? 'bg-blue-700 text-white shadow-xs' 
                        : 'bg-white text-slate-900 hover:bg-slate-50 border border-slate-200/80'
                    }`}
                  >
                    Match Duel
                  </button>
                  <button
                    onClick={() => setActiveBannerTab('stars')}
                    className={`px-2.5 py-1 rounded-lg font-black transition active:scale-95 ${
                      activeBannerTab === 'stars' 
                        ? 'bg-blue-700 text-white shadow-xs' 
                        : 'bg-white text-slate-900 hover:bg-slate-50 border border-slate-200/80'
                    }`}
                  >
                    Squad Stars
                  </button>
                </div>
              </div>

              {/* Matchup Headline - Clean Championship Clash Bar */}
              <div className="space-y-1.5">
                <div className={`p-2.5 sm:p-3 rounded-2xl border shadow-2xs ${
                  isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-2">
                    <span className="font-sports font-black text-sm sm:text-base text-slate-950 dark:text-white tracking-wide truncate">
                      UDAYA PARAMBIL PEEDIKA
                    </span>
                    <div className="flex items-center justify-center my-0.5 sm:my-0">
                      <span className="px-2 py-0.5 rounded-md bg-blue-700 text-white font-black font-sports text-[11px] shadow-xs">
                        VS
                      </span>
                    </div>
                    <span className="font-sports font-black text-sm sm:text-base text-slate-950 dark:text-white tracking-wide truncate sm:text-right">
                      NEW MALAYA MALABAR FC
                    </span>
                  </div>
                </div>

                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 pt-0.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 animate-pulse"></span>
                  <span className="truncate">
                    {lang === 'ml'
                      ? 'ഫ്ലഡ്‌ലിറ്റ് സെവൻസ് ഫുട്ബോൾ പോരാട്ടം • രാത്രി 8:00 PM'
                      : 'Live Floodlit Sevens Football • Every Night 8:00 PM IST'}
                  </span>
                </p>
              </div>

              {/* Dynamic Duel Visual (Official Video vs Action Duel vs Squad Stars) */}
              <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-950 p-1 shadow-md relative">
                {activeBannerTab === 'video' ? (
                  <div className="relative w-full h-56 sm:h-72 md:h-80 lg:h-[340px] rounded-xl overflow-hidden bg-black flex items-center justify-center">
                    <video
                      src={tournamentTeaser}
                      poster={tournamentTeaserPoster}
                      controls
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <button
                      onClick={() => setActiveBannerTab('action')}
                      className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-slate-950/85 hover:bg-black text-white text-[11px] font-bold border border-white/20 backdrop-blur-md flex items-center gap-1 transition active:scale-95 shadow-md"
                      title="Back to Match Duel Poster"
                    >
                      <X className="w-3.5 h-3.5 text-red-400" />
                      <span>{lang === 'ml' ? 'പോസ്റ്റർ' : 'Poster'}</span>
                    </button>
                  </div>
                ) : activeBannerTab === 'action' ? (
                  <div className="relative group">
                    <img
                      src={matchActionDuel}
                      alt="Match Duel: Udaya vs New Malaya Malabar FC"
                      className="w-full h-56 sm:h-72 md:h-80 lg:h-[340px] object-cover object-top rounded-xl"
                    />
                    {/* Cinema-Style Video Teaser Button with Real Video Frame */}
                    <button
                      onClick={() => setActiveBannerTab('video')}
                      className="group/btn absolute bottom-3 right-3 p-1.5 pr-3.5 rounded-2xl bg-slate-950/90 hover:bg-black text-white border border-white/25 shadow-2xl backdrop-blur-md flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                      title="Play Official Promo Video"
                    >
                      <div className="relative w-12 h-9 sm:w-14 sm:h-10 rounded-xl overflow-hidden border border-amber-400/90 shrink-0 shadow-sm">
                        <img 
                          src={teaserVideoBtnThumb} 
                          alt="Video Preview" 
                          className="w-full h-full object-cover group-hover/btn:scale-110 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                          <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-white shadow-md group-hover/btn:scale-110 transition">
                            <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                          </div>
                        </div>
                      </div>

                      <div className="text-left leading-tight">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.2 rounded bg-red-600 text-white">
                            HD Video
                          </span>
                          <span className="text-[10px] text-amber-300 font-mono font-bold">0:23</span>
                        </div>
                        <span className="text-xs font-black text-white group-hover/btn:text-amber-400 transition block mt-0.5">
                          {lang === 'ml' ? 'ടീസർ കാണുക' : 'Watch Promo'}
                        </span>
                      </div>
                    </button>
                  </div>
                ) : (
                  <div className="relative group">
                    <img
                      src={squadStarsPoster}
                      alt="Official Udaya FC Squad 2026-2027"
                      className="w-full h-56 sm:h-72 md:h-80 lg:h-[340px] object-cover object-top rounded-xl"
                    />
                    {/* Cinema-Style Video Teaser Button with Real Video Frame */}
                    <button
                      onClick={() => setActiveBannerTab('video')}
                      className="group/btn absolute bottom-3 right-3 p-1.5 pr-3.5 rounded-2xl bg-slate-950/90 hover:bg-black text-white border border-white/25 shadow-2xl backdrop-blur-md flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                      title="Play Official Promo Video"
                    >
                      <div className="relative w-12 h-9 sm:w-14 sm:h-10 rounded-xl overflow-hidden border border-amber-400/90 shrink-0 shadow-sm">
                        <img 
                          src={teaserVideoBtnThumb} 
                          alt="Video Preview" 
                          className="w-full h-full object-cover group-hover/btn:scale-110 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                          <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-white shadow-md group-hover/btn:scale-110 transition">
                            <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                          </div>
                        </div>
                      </div>

                      <div className="text-left leading-tight">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.2 rounded bg-red-600 text-white">
                            HD Video
                          </span>
                          <span className="text-[10px] text-amber-300 font-mono font-bold">0:23</span>
                        </div>
                        <span className="text-xs font-black text-white group-hover/btn:text-amber-400 transition block mt-0.5">
                          {lang === 'ml' ? 'ടീസർ കാണുക' : 'Watch Promo'}
                        </span>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => scrollToSection('live-match')}
                  className="w-full py-2.5 rounded-xl font-black text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-md transition active:scale-95 text-center"
                >
                  {lang === 'ml' ? '⚡ ലൈവ് മാച്ച്' : '⚡ Live Match'}
                </button>
                <button
                  onClick={() => scrollToSection('fixtures')}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs sm:text-sm border shadow-xs transition active:scale-95 text-center ${
                    isDarkMode 
                      ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' 
                      : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  {lang === 'ml' ? 'മത്സരക്രമം' : 'View Fixtures'}
                </button>
              </div>

              {/* Official Ticket Pricing & Coming Soon Modal Trigger */}
              <button
                onClick={onOpenTicketModal}
                className="w-full py-2.5 px-4 rounded-xl font-black text-xs sm:text-sm bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 shadow-md transition active:scale-98 flex items-center justify-center gap-2 border border-amber-300"
              >
                <Ticket className="w-4 h-4 text-slate-950" />
                <span>
                  {lang === 'ml' 
                    ? 'ടിക്കറ്റ് നിരക്കുകൾ (ബുക്കിംഗ് ഉടൻ)' 
                    : 'Ticket Pricing (Booking Soon)'}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-950 text-amber-300 text-[10px] font-black uppercase">
                  From ₹50
                </span>
              </button>
            </div>

            {/* Right Column: Clean Generated Professional 3:4 Tournament Poster */}
            <div className="md:col-span-5 flex flex-col items-center justify-center pt-2 md:pt-0 space-y-2.5">
              <div className="relative group rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-lg max-w-[240px] sm:max-w-[270px] w-full aspect-[3/4] bg-slate-950">
                <img
                  src={tournamentOfficialPoster}
                  alt="Peruvallur Cup Official Poster"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-[9px] font-black uppercase text-amber-300 border border-amber-400/40">
                  Official Poster • 3:4
                </div>
              </div>

              {/* Teaser Video Quick Play Button & Penalty Game Launcher */}
              <div className="w-full max-w-[240px] sm:max-w-[270px] grid grid-cols-2 gap-2">
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
