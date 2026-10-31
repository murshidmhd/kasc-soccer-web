import React from 'react';
import { Share2, Smartphone, Moon, Sun, Flame, Calendar, Shield, Trophy, MapPin, Ticket } from 'lucide-react';
import logoKerala from '../assets/logo_kerala.png';
import logoKasc from '../assets/logo_kasc.png';
import logoSfa from '../assets/logo_sfa.png';
import logoUdaya from '../assets/logo_udaya_transparent.png';
import { tournamentInfo } from '../data/tournamentData';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  onOpenScorerDemo, 
  onOpenTicketModal,
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
      `🔥 Opening Match: UDAYA Parambil Peedika vs NEW MALAYA MALABAR FC\n` +
      `Follow live scores & fixtures here: ${window.location.origin}/?v=3`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const navLinks = [
    { id: 'live', label: lang === 'ml' ? 'ലൈവ്' : 'Live' },
    { id: 'vote', label: lang === 'ml' ? 'ഫാൻ വോട്ട്' : 'Fan Vote' },
    { id: 'fixtures', label: lang === 'ml' ? 'ഫിക്സ്ചർ' : 'Fixtures' },
    { id: 'teams', label: lang === 'ml' ? 'ടീമുകൾ' : 'Clubs' },
    { id: 'stats', label: lang === 'ml' ? 'സ്റ്റാറ്റ്സ്' : 'Stats' },
    { id: 'promo', label: lang === 'ml' ? 'പ്രചാരണം' : 'Promo' },
    { id: 'venue', label: lang === 'ml' ? 'സ്റ്റേഡിയം' : 'Venue' },
    { id: 'admin', label: lang === 'ml' ? 'സ്കോറർ' : 'Admin' }
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

      <div className="max-w-7xl mx-auto px-2 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-1.5 sm:gap-4 overflow-hidden w-full">
        {/* Logos & Brand Title */}
        <div 
          onClick={() => { setActiveTab('live'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex items-center gap-1.5 sm:gap-2.5 cursor-pointer select-none min-w-0 flex-1 max-w-[calc(100%-130px)] sm:max-w-none"
        >
          <div className="flex items-center -space-x-1 sm:space-x-1 shrink-0">
            <img 
              src={logoUdaya} 
              alt="Udaya Parambil Peedika" 
              className="w-7 h-7 sm:w-10 sm:h-10 rounded-full border border-amber-500 bg-white p-0.5 object-contain shadow-xs shrink-0" 
              title="Udaya Parambil Peedika"
            />
            <img 
              src={logoKasc} 
              alt="KASC Peruvallur" 
              className="w-7 h-7 sm:w-10 sm:h-10 rounded-full border border-blue-600 bg-white p-0.5 object-contain shadow-xs shrink-0" 
              title="KASC Peruvallur"
            />
          </div>

          <div className="leading-tight min-w-0 truncate">
            <div className="flex items-center gap-1 truncate">
              <span className="text-xs sm:text-base md:text-xl font-black font-sports tracking-tight truncate">
                {lang === 'ml' ? 'അഖിലേന്ത്യാ സെവൻസ്' : 'ALL INDIA SEVENS'}
              </span>
              <span className="px-1 py-0.2 text-[8px] sm:text-xs font-black rounded bg-red-600 text-white uppercase tracking-wider shrink-0 shadow-xs">
                S7
              </span>
            </div>
            <p className="text-[9px] sm:text-xs text-slate-500 font-medium truncate font-malayalam">
              {lang === 'ml' ? 'ഉദയ & KASC പെരുവള്ളൂർ' : 'UDAYA & KASC Peruvallur'}
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links (xl+ only to prevent any collision on laptops/tablets) */}
        <nav className="hidden xl:flex items-center gap-1 shrink-0">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => { setActiveTab(link.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition active:scale-95 ${
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

        {/* Right Action buttons - strictly compact on mobile (fits within 125px with zero overflow) */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Theme Toggle (Light / Dark) */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl border text-xs font-bold transition flex items-center justify-center active:scale-95 shrink-0 ${
              isDarkMode 
                ? 'border-slate-700 bg-slate-800 text-amber-300' 
                : 'border-slate-200 bg-slate-100 text-slate-700'
            }`}
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'ml' ? 'en' : 'ml')}
            className={`px-1.5 py-1 sm:px-2.5 sm:py-1.5 text-[11px] sm:text-xs rounded-xl border font-bold transition active:scale-95 shrink-0 ${
              isDarkMode
                ? 'border-slate-700 bg-slate-800 text-blue-400'
                : 'border-slate-200 bg-slate-100 text-blue-800'
            }`}
          >
            {lang === 'ml' ? 'EN' : 'മല'}
          </button>

          {/* Admin / Official Scorer Panel (PIN Protected) - hidden on mobile phones because BottomNav has Admin */}
          <button
            onClick={() => { setActiveTab('admin'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-xl transition active:scale-95 shadow-xs ${
              activeTab === 'admin'
                ? 'bg-amber-500 text-slate-950 font-black ring-2 ring-amber-300'
                : 'bg-blue-700 hover:bg-blue-800 text-white'
            }`}
            title="Official Referee & Scorer Panel (PIN: 7012)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Admin Desk</span>
            <span className="md:hidden">Admin</span>
          </button>

          {/* Ticket Rates Modal trigger (Coming Soon) */}
          <button
            onClick={onOpenTicketModal}
            className="flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-black rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 shadow-xs transition active:scale-95 shrink-0"
            title="Ticket Pricing & Online Booking (Coming Soon)"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-malayalam">{lang === 'ml' ? 'ടിക്കറ്റ്' : 'Tickets'}</span>
          </button>

          {/* WhatsApp Share Button */}
          <button
            onClick={shareOnWhatsApp}
            className="flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition active:scale-95 shrink-0"
            title="Share on WhatsApp"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Share</span>
          </button>
        </div>
      </div>
    </header>
  );
}
