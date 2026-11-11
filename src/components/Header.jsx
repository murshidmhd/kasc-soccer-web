/**
 * Header — Slim sticky header (~48-56px).
 * Left:  Udaya logo (36px) + two-line title (never truncated). KASC credited.
 * Right: language toggle + share button only.
 * More menu: theme toggle + tickets + all other features.
 * No permanent ticker. Announcement bar shown only when data provides one.
 * No backdrop-filter / blur.
 */

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
  X,
  MoreHorizontal,
  Calendar,
  Shield,
  Star,
  Target,
  Info,
} from 'lucide-react';
import { tournamentInfo, nextMatch } from '../data/tournamentData';
import {
  SITE_URL,
  LIVE_YOUTUBE_CHANNEL_URL,
  SHOW_LOCAL_ONLY_FEATURES,
  ORGANISERS,
} from '../config/siteConfig';

export default function Header({
  activeTab,
  setActiveTab,
  onOpenTicketModal,
  onOpenPassModal,
  onOpenTour,
  lang,
  setLang,
  isDarkMode,
  setIsDarkMode,
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const desktopMenuRef = useRef(null);

  // Close desktop menu on outside click
  useEffect(() => {
    if (!isDesktopMenuOpen) return;
    const handler = (e) => {
      if (desktopMenuRef.current && !desktopMenuRef.current.contains(e.target)) {
        setIsDesktopMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isDesktopMenuOpen]);

  const navigate = (tab) => {
    setActiveTab(tab);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const shareOnWhatsApp = () => {
    const homeTeam = nextMatch.teamHome || {};
    const awayTeam = nextMatch.teamAway || {};
    const text = encodeURIComponent(
      `⚽ *അഖിലേന്ത്യാ സെവൻസ് ഫുട്ബോൾ — സീസൺ 7*\n` +
        `${homeTeam.nameMl || 'Team 1'} VS ${awayTeam.nameMl || 'Team 2'}\n` +
        `🌐 ${SITE_URL}\n` +
        `🔴 ${LIVE_YOUTUBE_CHANNEL_URL}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  // Desktop-only nav links (BottomNav handles mobile navigation)
  const mainNavLinks = [
    { id: 'live', label: 'Live' },
    { id: 'fixtures', label: 'Fixtures' },
    { id: 'teams', label: 'Clubs' },
    { id: 'stats', label: 'Stats' },
  ];

  // All items that move into the More dropdown
  const moreMenuItems = [
    {
      id: 'theme',
      label: isDarkMode
        ? lang === 'ml' ? 'ലൈറ്റ് മോഡ്' : 'Light Mode'
        : lang === 'ml' ? 'ഡാർക്ക് മോഡ്' : 'Dark Mode',
      icon: isDarkMode ? Sun : Moon,
      action: () => setIsDarkMode(!isDarkMode),
    },
    {
      id: 'tickets',
      label: lang === 'ml' ? 'ടിക്കറ്റ് നിരക്കുകൾ' : 'Ticket Tiers & Counter Rates',
      icon: Ticket,
      action: () => { if (onOpenTicketModal) onOpenTicketModal(); },
    },
    {
      id: 'pass',
      label: lang === 'ml' ? 'വി.ഐ.പി ഫാൻ പാസ്സ്' : 'VIP Fan Supporter Pass',
      icon: Sparkles,
      action: () => { if (onOpenPassModal) onOpenPassModal(); },
    },
    {
      id: 'tour',
      label: lang === 'ml' ? '🎯 App Tour' : '🎯 Interactive App Tour',
      icon: Info,
      action: () => { if (onOpenTour) onOpenTour(); },
    },
    {
      id: 'promo',
      label: lang === 'ml' ? 'Marathon & Gallery' : 'Marathon & Media Gallery',
      icon: Award,
      action: () => navigate('promo'),
    },
    {
      id: 'venue',
      label: lang === 'ml' ? 'Stadium & GPS' : 'Stadium Venue & GPS',
      icon: MapPin,
      action: () => navigate('venue'),
    },
    {
      id: 'game',
      label: lang === 'ml' ? 'Penalty Shootout Game' : 'Penalty Shootout Game',
      icon: Gamepad2,
      action: () => navigate('game'),
    },
    ...(SHOW_LOCAL_ONLY_FEATURES
      ? [
          {
            id: 'vote',
            label: lang === 'ml' ? 'ഫാൻ വോട്ട്' : 'Fan Vote Battle',
            icon: Users,
            action: () => navigate('vote'),
          },
          {
            id: 'predict',
            label: lang === 'ml' ? 'പ്രഡിക്ഷൻ' : 'Match Prediction',
            icon: Target,
            action: () => setActiveTab('predict'),
          },
        ]
      : []),
    {
      id: 'admin',
      label: lang === 'ml' ? '🛡️ അഡ്മിൻ ഡെസ്ക്' : '🛡️ Admin Scorer Desk',
      icon: Shield,
      action: () => navigate('admin'),
    },
  ];

  const MoreMenu = ({ items, onClose }) => (
    <div
      className="absolute right-0 mt-1.5 w-60 rounded-2xl border border-navy-700 bg-navy-900 text-white shadow-2xl py-1.5 z-50 animate-fadeIn max-h-[80vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="px-3.5 py-1.5 text-[10px] font-black tracking-widest uppercase text-gold border-b border-navy-800 mb-1">
        {lang === 'ml' ? 'കൂടുതൽ' : 'MORE'}
      </div>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => { onClose(); item.action(); }}
            className="w-full px-3.5 py-2.5 text-left text-xs font-semibold flex items-center gap-2.5 hover:bg-navy-800 active:bg-navy-750 text-white transition cursor-pointer"
          >
            <Icon className="w-4 h-4 text-sky shrink-0" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <header
      className="sticky top-0 z-40 w-full header-glass text-white pt-safe transition-all duration-200"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      {/* Slim header row — target ~48-56px total */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-12 sm:h-14 flex items-center justify-between gap-2 w-full">

        {/* LEFT: Udaya logo + title */}
        <button
          type="button"
          onClick={() => navigate('live')}
          className="flex items-center gap-2 cursor-pointer select-none min-w-0 active:opacity-80 transition"
          aria-label="Go to home"
        >
          {/* Udaya logo (36px white circle) — primary organiser */}
          <img
            src={ORGANISERS.primary.logo}
            alt={lang === 'ml' ? ORGANISERS.primary.nameMl : ORGANISERS.primary.name}
            width={36}
            height={36}
            className="w-9 h-9 rounded-full border-2 border-gold bg-white p-0.5 object-contain shadow-md shrink-0 ring-1 ring-gold/40"
            title={`${ORGANISERS.primary.name} — Primary Organiser`}
          />
          {/* KASC co-organiser logo (28px, slightly overlapped) */}
          <img
            src={ORGANISERS.coOrganiser.logo}
            alt={lang === 'ml' ? ORGANISERS.coOrganiser.nameMl : ORGANISERS.coOrganiser.name}
            width={24}
            height={24}
            className="-ml-3 w-6 h-6 rounded-full border border-purple-400/70 bg-white p-0.5 object-contain shadow-sm shrink-0 opacity-90"
            title={`${ORGANISERS.coOrganiser.name} — Co-Organiser`}
          />

          {/* Two-line title — wraps, never truncated */}
          <div className="leading-tight min-w-0">
            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-[12px] sm:text-sm font-black font-sports tracking-tight text-white whitespace-nowrap">
                {lang === 'ml' ? 'അഖിലേന്ത്യാ സെവൻസ്' : 'ALL INDIA SEVENS'}
              </span>
              <span className="px-1.5 py-0.2 rounded-full bg-gold text-[#0E0B1D] font-black text-[9px] uppercase tracking-wider shrink-0 shadow-xs">
                S7
              </span>
            </div>
            <p className="text-[9px] sm:text-[10px] text-frost/70 font-medium leading-tight font-malayalam">
              {lang === 'ml'
                ? `${ORGANISERS.primary.nameMl} & ${ORGANISERS.coOrganiser.shortNameMl}`
                : `${ORGANISERS.primary.name} & ${ORGANISERS.coOrganiser.shortName}`}
            </p>
          </div>
        </button>

        {/* CENTER: Desktop nav (hidden on mobile — BottomNav handles that) */}
        <nav className="hidden lg:flex items-center gap-1 shrink-0" aria-label="Main navigation">
          {mainNavLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => navigate(link.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition active:scale-95 ${
                activeTab === link.id
                  ? 'btn-royal text-white shadow-xs'
                  : 'text-frost/75 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* RIGHT: Language toggle + Share + More (mobile) */}
        <div className="flex items-center gap-1.5 shrink-0">

          {/* Language toggle */}
          <button
            onClick={() => setLang(lang === 'ml' ? 'en' : 'ml')}
            className="h-8 px-2.5 rounded-full border border-frost/20 bg-white/[0.06] hover:bg-white/[0.12] text-frost font-bold text-[11px] backdrop-blur-md transition active:scale-95 shadow-2xs"
            aria-label={lang === 'ml' ? 'Switch to English' : 'Malayalam ഭാഷ'}
          >
            {lang === 'ml' ? 'EN' : 'മല'}
          </button>

          {/* Share button */}
          <button
            onClick={shareOnWhatsApp}
            className="w-8 h-8 rounded-full btn-royal text-white flex items-center justify-center active:scale-95 transition shadow-xs"
            aria-label={lang === 'ml' ? 'ഷെയർ' : 'Share'}
            title="Share on WhatsApp"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>

          {/* Mobile More button (opens bottom sheet on mobile) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-8 h-8 rounded-full border border-frost/20 bg-white/[0.06] hover:bg-white/[0.12] text-gold flex items-center justify-center active:scale-95 backdrop-blur-md transition"
              aria-label="More options"
              aria-expanded={isMobileMenuOpen}
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {/* More dropdown — mobile */}
            {isMobileMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-hidden="true"
                />
                <div
                  className="fixed top-14 left-3 right-3 sm:absolute sm:top-auto sm:left-auto sm:right-0 sm:mt-2 sm:w-64 max-h-[80vh] overflow-y-auto rounded-3xl border border-frost/20 bg-[#140F27]/95 backdrop-blur-2xl text-white shadow-2xl py-2 z-50 animate-fadeIn"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.08] mb-1">
                    <span className="text-[10px] font-black tracking-widest uppercase text-gold">
                      {lang === 'ml' ? 'കൂടുതൽ' : 'MORE'}
                    </span>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-1 text-white/50 hover:text-white"
                      aria-label="Close menu"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {moreMenuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => { setIsMobileMenuOpen(false); item.action(); }}
                        className="w-full px-4 py-2.5 text-left text-xs font-semibold flex items-center gap-3 hover:bg-white/[0.08] active:bg-white/[0.12] text-white transition cursor-pointer"
                      >
                        <Icon className="w-4 h-4 text-sky shrink-0" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Desktop-only More dropdown (reference-based) */}
          <div className="relative hidden lg:block" ref={desktopMenuRef}>
            <button
              onClick={() => setIsDesktopMenuOpen(!isDesktopMenuOpen)}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 text-white/60 hover:text-white hover:bg-navy-800 transition active:scale-95"
              aria-expanded={isDesktopMenuOpen}
            >
              <span>{lang === 'ml' ? 'കൂടുതൽ' : 'More'}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isDesktopMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            {isDesktopMenuOpen && (
              <MoreMenu items={moreMenuItems} onClose={() => setIsDesktopMenuOpen(false)} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
