import React from 'react';
import { Share2, Smartphone, Moon, Sun, Flame, Calendar, Shield, Trophy, MapPin } from 'lucide-react';
import logoKerala from '../assets/logo_kerala.png';
import logoKasc from '../assets/logo_kasc.png';
import logoSfa from '../assets/logo_sfa.png';
import logoUdaya from '../assets/logo_udaya_transparent.png';
import { tournamentInfo } from '../data/tournamentData';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  onOpenScorerDemo, 
  lang, 
  setLang, 
  isDarkMode, 
  setIsDarkMode 
}) {
  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(
      `⚽ *അഖിലേന്ത്യാ സെവൻസ് ടൂർണ്ണമെന്റ് Season 7*\n` +
      `📅 2026 Nov 06 - Dec 06\n` +
      `📍 Peruvallur Panjayath Stadium, Parambil Peedika\n` +
      `🔥 Opening Match: UDAYA Peruvallur vs SABAN FC Kottakkal\n` +
      `Follow live scores & fixtures here: ${window.location.origin}/?v=3`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const navLinks = [
    { id: 'live', label: lang === 'ml' ? 'ലൈവ് മാച്ച്' : 'Live Match' },
    { id: 'fixtures', label: lang === 'ml' ? 'ഫിക്സ്ചറുകൾ' : 'Fixtures' },
    { id: 'teams', label: lang === 'ml' ? 'ടീമുകൾ' : 'Clubs' },
    { id: 'stats', label: lang === 'ml' ? 'ഗോൾഡൻ ബൂട്ട്' : 'Stats' },
    { id: 'venue', label: lang === 'ml' ? 'സ്റ്റേഡിയം & സ്പോൺസേഴ്സ്' : 'Venue & Info' }
  ];

  return (
    <header className={`sticky top-0 z-40 w-full border-b transition-colors duration-200 ${
      isDarkMode 
        ? 'border-slate-800 bg-slate-950/95 text-white' 
        : 'border-slate-200 bg-white/95 text-slate-900 shadow-xs'
    } backdrop-blur-md`}>
      {/* Top Malayalam ticker banner in Royal Blue */}
      <div className="bg-blue-900 py-1.5 px-3 text-center text-[11px] sm:text-sm font-semibold text-white flex items-center justify-center gap-1.5 leading-snug">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
        <span className="font-malayalam tracking-wide truncate">
          {tournamentInfo.taglineMl}
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-3 py-2.5 sm:px-6 flex items-center justify-between">
        {/* Logos & Brand Title */}
        <div 
          onClick={() => { setActiveTab('live'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none"
        >
          <div className="flex items-center -space-x-1 sm:space-x-1.5 shrink-0">
            <img 
              src={logoUdaya} 
              alt="Udaya Parambil Peedika" 
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 border-amber-500 bg-white p-0.5 object-contain shadow-xs" 
              title="Udaya Parambil Peedika"
            />
            <img 
              src={logoKasc} 
              alt="KASC Peruvallur" 
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 border-blue-600 bg-white p-0.5 object-contain shadow-xs" 
              title="KASC Peruvallur"
            />
          </div>

          <div className="leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-2xl font-black font-sports tracking-wide">
                {lang === 'ml' ? tournamentInfo.name : tournamentInfo.nameEn}
              </span>
              <span className="px-1.5 py-0.5 text-[9px] sm:text-xs font-bold rounded bg-red-600 text-white uppercase tracking-wider">
                S7
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium truncate max-w-[170px] sm:max-w-md font-malayalam">
              {lang === 'ml' ? 'KASC & ഉദയ സംയുക്തമായി' : tournamentInfo.organizersEn}
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => { setActiveTab(link.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  isActive
                    ? isDarkMode
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'bg-blue-700 text-white shadow-xs'
                    : isDarkMode
                      ? 'text-slate-300 hover:bg-slate-900'
                      : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Theme Toggle (Light / Dark) */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-xl border text-xs font-bold transition flex items-center justify-center active:scale-95 ${
              isDarkMode 
                ? 'border-slate-700 bg-slate-800 text-amber-300' 
                : 'border-slate-200 bg-slate-100 text-slate-700'
            }`}
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'ml' ? 'en' : 'ml')}
            className={`px-2.5 py-1.5 text-xs rounded-xl border font-bold transition active:scale-95 ${
              isDarkMode
                ? 'border-slate-700 bg-slate-800 text-blue-400'
                : 'border-slate-200 bg-slate-100 text-blue-800'
            }`}
          >
            {lang === 'ml' ? 'EN' : 'മലയാളം'}
          </button>

          {/* Scorer Demo (Visible on desktop/tablet) */}
          <button
            onClick={onOpenScorerDemo}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-blue-700 hover:bg-blue-800 text-white shadow-xs transition"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Scorer</span>
          </button>

          {/* WhatsApp Share Button */}
          <button
            onClick={shareOnWhatsApp}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition active:scale-95"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Share</span>
          </button>
        </div>
      </div>
    </header>
  );
}
