import React, { useState, useEffect, useRef } from 'react';
import { 
  Share2, 
  Moon, 
  Sun, 
  Ticket, 
  ChevronDown, 
  Award, 
  Users, 
  MapPin, 
  Sparkles, 
  Gamepad2, 
  Flame,
  X,
  MoreHorizontal
} from 'lucide-react';
import logoKasc from '../assets/logo_kasc.png';
import logoUdaya from '../assets/logo_udaya_transparent.png';
import { tournamentInfo } from '../data/tournamentData';
import { SITE_URL, SHOW_UNFINISHED, SHOW_LOCAL_ONLY_FEATURES } from '../config/siteConfig';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  onOpenTicketModal,
  onOpenPassModal,
  lang, 
  setLang, 
  isDarkMode, 
  setIsDarkMode 
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu on click outside
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMenuOpen]);

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(
      `⚽ *അഖിലേന്ത്യാ സെവൻസ് ടൂർണ്ണമെന്റ് Season 7*\n` +
      `📅 2026 Nov 06 - Dec 06\n` +
      `📍 Peruvallur Panjayath Stadium, Parambil Peedika\n` +
      `🔥 Opening Match: UDAYA Parambil Peedika vs NEW MALAYA MALABAR FC\n` +
      `Follow live scores & fixtures here: ${SITE_URL}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  // Top nav strictly reduced to: Live, Fixtures, Teams, Stats
  const mainNavLinks = [
    { id: 'live', label: lang === 'ml' ? 'ലൈവ്' : 'Live' },
    { id: 'fixtures', label: lang === 'ml' ? 'ഫിക്സ്ചർ' : 'Fixtures' },
    { id: 'teams', label: lang === 'ml' ? 'ക്ലബ്ബുകൾ' : 'Teams' },
    { id: 'stats', label: lang === 'ml' ? 'സ്റ്റാറ്റ്സ്' : 'Stats' }
  ];

  // More menu features (Rule 4: List every feature only reachable from hub, no SFA/official badges)
  const moreMenuFeatures = [
    ...(SHOW_LOCAL_ONLY_FEATURES ? [{
      id: 'vote',
      label: lang === 'ml' ? '24 ക്ലബ് ഫാൻ വോട്ട്' : 'Fan Vote Battle',
      icon: Users,
      action: () => {
        setActiveTab('vote');
        window.location.hash = 'vote';
        setIsMenuOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }] : []),
    {
      id: 'pass',
      label: lang === 'ml' ? 'വി.ഐ.പി ഫാൻ പാസ്സ്' : 'VIP Fan Pass',
      icon: Sparkles,
      action: () => {
        setIsMenuOpen(false);
        if (onOpenPassModal) onOpenPassModal();
      }
    },
    {
      id: 'game',
      label: lang === 'ml' ? 'പെനാൽറ്റി ഷൂട്ടൗട്ട് ഗെയിം' : 'Penalty Shootout Game',
      icon: Gamepad2,
      action: () => {
        setActiveTab('live');
        window.location.hash = 'game';
        setIsMenuOpen(false);
        setTimeout(() => {
          const el = document.getElementById('penalty-game');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    },
    {
      id: 'promo',
      label: lang === 'ml' ? 'മാരത്തോൺ ഫോട്ടോ ഗാലറി' : 'Marathon & Media',
      icon: Award,
      action: () => {
        setActiveTab('promo');
        window.location.hash = 'promo';
        setIsMenuOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    {
      id: 'venue',
      label: lang === 'ml' ? 'സ്റ്റേഡിയം GPS & വിവരങ്ങൾ' : 'Stadium Venue & GPS',
      icon: MapPin,
      action: () => {
        setActiveTab('venue');
        window.location.hash = 'venue';
        setIsMenuOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    ...(SHOW_UNFINISHED ? [
      {
        id: 'tickets',
        label: lang === 'ml' ? 'ടിക്കറ്റ് നിരക്കുകൾ' : 'Ticket Tiers',
        icon: Ticket,
        action: () => {
          setIsMenuOpen(false);
          if (onOpenTicketModal) onOpenTicketModal();
        }
      }
    ] : [])
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-navy-700 surface-navy text-white pt-safe transition-colors">
      {/* Top Malayalam ticker banner */}
      <div className="surface-navy-card border-b border-navy-700/60 py-1 px-3 text-center text-[11px] sm:text-xs font-semibold text-white flex items-center justify-center gap-1.5 overflow-hidden">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
        <span className="font-malayalam tracking-wide truncate max-w-full text-center">
          {tournamentInfo.taglineMl}
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-6 py-2 flex items-center justify-between gap-1.5 sm:gap-4 w-full">
        {/* Logos & Brand Title */}
        <div 
          onClick={() => { setActiveTab('live'); window.location.hash = 'live'; window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex items-center gap-1.5 sm:gap-2.5 cursor-pointer select-none min-w-0"
        >
          <div className="flex items-center -space-x-1 sm:space-x-1 shrink-0">
            <img 
              src={logoUdaya} 
              alt="Udaya Parambil Peedika" 
              width={36}
              height={36}
              className="w-7 h-7 sm:w-9 sm:h-9 rounded-full border border-amber-400 bg-white p-0.5 object-contain shadow-xs shrink-0" 
              title="Udaya Parambil Peedika"
            />
            <img 
              src={logoKasc} 
              alt="KASC Peruvallur" 
              width={36}
              height={36}
              className="w-7 h-7 sm:w-9 sm:h-9 rounded-full border border-sky bg-white p-0.5 object-contain shadow-xs shrink-0" 
              title="KASC Peruvallur"
            />
          </div>

          <div className="leading-tight min-w-0">
            <div className="flex items-center gap-1 min-w-0">
              <span className="text-[11px] sm:text-base md:text-xl font-black font-sports tracking-tight text-white truncate">
                {lang === 'ml' ? 'അഖിലേന്ത്യാ സെവൻസ്' : 'ALL INDIA SEVENS'}
              </span>
              <span className="px-1 py-0.2 text-[8px] sm:text-[10px] font-black rounded bg-gold text-navy-900 uppercase tracking-wider shrink-0 shadow-xs">
                S7
              </span>
            </div>
            <p className="text-[9px] sm:text-xs text-navy-muted font-medium truncate font-malayalam">
              {lang === 'ml' ? 'ഉദയ & KASC പെരുവള്ളൂർ' : 'UDAYA & KASC Peruvallur'}
            </p>
          </div>
        </div>

        {/* Desktop Top Nav: Live, Fixtures, Teams, Stats + Desktop More Button */}
        <nav className="hidden lg:flex items-center gap-1 shrink-0">
          {mainNavLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => { setActiveTab(link.id); window.location.hash = link.id; window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition active:scale-95 ${
                  isActive
                    ? 'btn-royal text-white shadow-xs'
                    : 'text-navy-muted hover:text-white hover:bg-navy-800'
                }`}
              >
                {link.label}
              </button>
            );
          })}

          {/* Desktop "More" Menu Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition text-navy-muted hover:text-white hover:bg-navy-800"
              aria-expanded={isMenuOpen}
              aria-label="More Features Menu"
            >
              <span>{lang === 'ml' ? 'കൂടുതൽ' : 'More'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-56 rounded-2xl border border-navy-700 bg-navy-900 text-white shadow-2xl py-2 z-50 animate-fadeIn"
              >
                <div className="px-3 py-1 text-[10px] font-sports font-black tracking-widest uppercase text-navy-muted border-b border-navy-800 mb-1">
                  {lang === 'ml' ? 'ഫീച്ചറുകൾ' : 'FEATURES'}
                </div>
                {moreMenuFeatures.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={item.action}
                      className="w-full px-3.5 py-2.5 text-left text-xs font-bold flex items-center gap-2.5 hover:bg-navy-800 text-navy-muted hover:text-white transition"
                    >
                      <Icon className="w-4 h-4 text-sky shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Mobile "More" Menu Trigger (Rule 4) */}
          <div className="relative lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl border border-navy-700 bg-navy-800 text-gold hover:text-white transition flex items-center justify-center active:scale-95 shrink-0"
              title="More Features"
              aria-label="More Features"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {isMenuOpen && (
              <>
                {/* Backdrop overlay to close menu on click outside */}
                <div 
                  className="fixed inset-0 z-40 bg-navy-950/60"
                  onClick={() => setIsMenuOpen(false)}
                  aria-hidden="true"
                />

                {/* Dropdown positioned safely inside phone viewport (Fixes left clipping) */}
                <div 
                  className="fixed top-14 left-3 right-3 sm:left-auto sm:right-4 sm:top-16 sm:absolute sm:w-64 rounded-2xl border border-navy-700 bg-navy-900 text-white shadow-2xl py-2 z-50 animate-fadeIn"
                >
                  <div className="flex items-center justify-between px-3.5 py-1.5 border-b border-navy-800 mb-1">
                    <span className="text-[10px] font-sports font-black tracking-widest uppercase text-gold">
                      {lang === 'ml' ? 'കൂടുതൽ ഫീച്ചറുകൾ' : 'MORE FEATURES'}
                    </span>
                    <button 
                      onClick={() => setIsMenuOpen(false)}
                      className="p-1 text-navy-muted hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {moreMenuFeatures.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setIsMenuOpen(false);
                          item.action();
                        }}
                        className="w-full px-3.5 py-2.5 text-left text-xs font-bold flex items-center gap-2.5 hover:bg-navy-800 text-navy-muted hover:text-white transition"
                      >
                        <Icon className="w-4 h-4 text-sky shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Theme Toggle (Light / Dark) */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl border border-navy-700 bg-navy-800 text-navy-muted hover:text-white transition flex items-center justify-center active:scale-95 shrink-0"
            title="Toggle Theme"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'ml' ? 'en' : 'ml')}
            className="h-8 sm:h-10 px-2 sm:px-2.5 rounded-xl border border-navy-700 bg-navy-800 text-white hover:border-navy-600 font-bold text-[11px] sm:text-xs transition flex items-center justify-center active:scale-95 shrink-0"
            aria-label="Toggle Language"
          >
            {lang === 'ml' ? 'EN' : 'മല'}
          </button>

          {/* Ticket Rates Modal trigger */}
          <button
            onClick={onOpenTicketModal}
            className="h-8 sm:h-10 w-8 sm:w-auto px-0 sm:px-3 rounded-xl btn-gold font-black text-xs transition flex items-center justify-center gap-1 active:scale-95 shrink-0 whitespace-nowrap shadow-xs"
            title="Ticket Pricing & Online Booking"
            aria-label="Tickets"
          >
            <Ticket className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-navy-900 shrink-0" />
            <span className="hidden sm:inline font-malayalam whitespace-nowrap">{lang === 'ml' ? 'ടിക്കറ്റ്' : 'Tickets'}</span>
          </button>

          {/* WhatsApp Share Button */}
          <button
            onClick={shareOnWhatsApp}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl btn-royal text-white transition flex items-center justify-center gap-1 active:scale-95 shrink-0 shadow-xs"
            title="Share on WhatsApp"
            aria-label="Share on WhatsApp"
          >
            <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden md:inline text-xs font-bold">Share</span>
          </button>
        </div>
      </div>
    </header>
  );
}
