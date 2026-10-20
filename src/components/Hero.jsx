import React from 'react';
import { Calendar, MapPin, Phone, Award, Shield, ChevronDown } from 'lucide-react';
import { tournamentInfo } from '../data/tournamentData';
import Countdown from './Countdown';
import playersHero from '../assets/players_hero.png';
import logoUdaya from '../assets/logo_udaya_transparent.png';
import logoKasc from '../assets/logo_kasc.png';
import matchActionDuel from '../assets/match_action_duel.jpg';
import tournamentOfficialPoster from '../assets/tournament_official_poster.jpg';

export default function Hero({ lang, scrollToSection, isDarkMode }) {
  const [activeBannerTab, setActiveBannerTab] = React.useState('action');

  return (
    <section className={`relative pt-5 pb-10 px-3 sm:px-6 border-b transition-colors ${
      isDarkMode 
        ? 'bg-slate-950 border-slate-800 text-white' 
        : 'bg-gradient-to-b from-blue-50/70 via-white to-slate-50 border-slate-200 text-slate-900'
    }`}>
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Top Affiliation Badge */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mb-3">
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
            isDarkMode 
              ? 'bg-blue-950 border-blue-800 text-blue-300' 
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            <Shield className="w-3 h-3 text-blue-600" />
            {tournamentInfo.affiliation}
          </span>
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
            isDarkMode 
              ? 'bg-amber-950 border-amber-800 text-amber-300' 
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}>
            <Award className="w-3 h-3 text-amber-600" />
            {lang === 'ml' ? 'സീസൺ 7' : 'Season 7'}
          </span>
        </div>

        {/* Club Crests & Main Tournament Heading */}
        <div className="text-center space-y-2.5">
          <div className="flex items-center justify-center gap-2 mb-1 flex-wrap">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border shadow-xs ${
              isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <img src={logoUdaya} alt="Udaya Club" className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white p-0.5 object-contain" />
              <span className="text-[11px] sm:text-xs font-bold text-amber-700">UDAYA Parambil Peedika</span>
            </div>
            <span className="text-slate-400 font-bold text-xs">✕</span>
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border shadow-xs ${
              isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <img src={logoKasc} alt="KASC Peruvallur" className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white p-0.5 object-contain" />
              <span className="text-[11px] sm:text-xs font-bold text-blue-700">KASC Peruvallur</span>
            </div>
          </div>

          <p className="text-[11px] sm:text-sm font-bold text-blue-700 uppercase tracking-wider font-malayalam px-2">
            {lang === 'ml' ? tournamentInfo.organizersMalayalam : tournamentInfo.organizersEn}
          </p>

          <h1 className="text-3xl sm:text-6xl md:text-7xl font-black font-sports tracking-tight text-slate-950 uppercase leading-none">
            <span>{lang === 'ml' ? tournamentInfo.name : tournamentInfo.nameEn}</span>
            <span className="block text-xl sm:text-4xl md:text-5xl text-red-600 tracking-wider mt-1">
              {tournamentInfo.season}
            </span>
          </h1>

          <p className="text-xs sm:text-base font-bold text-blue-700 tracking-wide font-sports max-w-3xl mx-auto">
            {lang === 'ml' ? 'പെരുവള്ളൂർ പഞ്ചായത്ത് സ്റ്റേഡിയം, പറമ്പിൽ പീടിക' : 'PERUVALLUR PANCHAYATH STADIUM, PARAMBIL PEEDIKA'}
          </p>

          {/* Tournament Date & Venue Ribbon (Optimized for Mobile) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1 max-w-lg mx-auto">
            <div className={`w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] sm:text-xs font-bold shadow-xs ${
              isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
            }`}>
              <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate">{lang === 'ml' ? tournamentInfo.durationMalayalam : `${tournamentInfo.startDateDisplay} - ${tournamentInfo.endDateDisplay}`}</span>
            </div>

            <a
              href={tournamentInfo.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] sm:text-xs font-bold shadow-xs transition active:scale-95 ${
                isDarkMode 
                  ? 'bg-slate-900 border-slate-700 text-slate-200' 
                  : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
              <span className="truncate">{lang === 'ml' ? 'പെരുവള്ളൂർ സ്റ്റേഡിയം' : tournamentInfo.venue}</span>
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
                    onClick={() => setActiveBannerTab('action')}
                    className={`px-2.5 py-1 rounded-md font-bold transition active:scale-95 ${activeBannerTab === 'action' ? 'bg-blue-700 text-white shadow-xs' : 'text-slate-600'}`}
                  >
                    Match Duel
                  </button>
                  <button
                    onClick={() => setActiveBannerTab('stars')}
                    className={`px-2.5 py-1 rounded-md font-bold transition active:scale-95 ${activeBannerTab === 'stars' ? 'bg-blue-700 text-white shadow-xs' : 'text-slate-600'}`}
                  >
                    Squad Stars
                  </button>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 font-sports">
                UDAYA PERUVALLUR <span className="text-blue-600">vs</span> SABAN FC KOTTAKKAL
              </h2>

              <p className="text-xs text-slate-600 leading-relaxed">
                {lang === 'ml'
                  ? 'മലപ്പുറത്തിന്റെ സ്വന്തം സെവൻസ് ആരവം പറമ്പിൽ പീടിക പഞ്ചായത്ത് സ്റ്റേഡിയത്തിൽ. എല്ലാ ദിവസവും രാത്രി 8:00 മണിക്ക്.'
                  : 'The greatest Sevens football carnival returns to Peruvallur Panjayath Stadium. Live floodlit matches at 8:00 PM.'}
              </p>

              {/* Dynamic 2 Players Duel Visual */}
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-1 shadow-xs">
                {activeBannerTab === 'action' ? (
                  <img
                    src={matchActionDuel}
                    alt="Match Duel: Udaya vs Saban FC"
                    className="w-full h-44 sm:h-56 object-cover rounded-lg"
                  />
                ) : (
                  <img
                    src={playersHero}
                    alt="Featured Stars"
                    className="w-full h-44 sm:h-56 object-cover rounded-lg"
                  />
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
            </div>

            {/* Right Column: Clean Generated Tournament Poster (NO text at bottom) */}
            <div className="md:col-span-5 flex justify-center pt-2 md:pt-0">
              <div className="relative group rounded-2xl overflow-hidden border border-slate-200 shadow-md max-w-[260px] sm:max-w-[300px] w-full">
                <img
                  src={tournamentOfficialPoster}
                  alt="Peruvallur Cup Official Poster"
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition duration-500"
                />
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
