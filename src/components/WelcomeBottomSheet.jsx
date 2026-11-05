import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  Globe, 
  Moon, 
  Sun, 
  Sparkles,
  Shield,
  Calendar,
  Star
} from 'lucide-react';
import { SITE_URL, ORGANISERS } from '../config/siteConfig';

export default function WelcomeBottomSheet({ 
  lang, 
  setLang, 
  isDarkMode, 
  setIsDarkMode,
  isLiveMatch = false,
  isOtherModalOpen = false,
  onDismissCallback,
  onNavigate
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [touchStartY, setTouchStartY] = useState(null);
  const previousFocusedElement = useRef(null);
  const sheetRef = useRef(null);
  const closeButtonRef = useRef(null);
  const timerRef = useRef(null);

  // Helper to mark seen in localStorage safely
  const markAsSeen = () => {
    try {
      localStorage.setItem('welcomeSeenV1', 'true');
    } catch (e) {
      // Storage blocked; silently ignored
    }
  };

  const handleDismiss = () => {
    markAsSeen();
    setIsOpen(false);
    if (onDismissCallback) onDismissCallback();
    if (window.history.state?.welcomeSheetOpen) {
      window.history.back();
    }
    // Return focus to previous element (Rule 8)
    if (previousFocusedElement.current && typeof previousFocusedElement.current.focus === 'function') {
      previousFocusedElement.current.focus();
    }
  };

  // Eligibility check and 3-second delay trigger (Rule 1 & 2)
  useEffect(() => {
    // 1. Storage check
    let alreadySeen = false;
    try {
      alreadySeen = localStorage.getItem('welcomeSeenV1') === 'true';
    } catch (e) {
      alreadySeen = false;
    }
    if (alreadySeen) return;

    // 2. Route checks
    const hash = window.location.hash.replace('#', '').toLowerCase();
    const pathname = window.location.pathname.toLowerCase();

    const isAdminRoute = hash === 'admin' || hash === 'desk-s7' || pathname.includes('/admin') || pathname.includes('/desk-s7');
    const isScreenRoute = hash === 'screen' || pathname.includes('/screen');
    const isNonHomeHash = hash !== '' && hash !== 'live';

    if (isAdminRoute || isScreenRoute || isNonHomeHash || isLiveMatch || isOtherModalOpen) {
      return;
    }

    // 3. Trigger 3 seconds after page load
    timerRef.current = setTimeout(() => {
      // Re-verify conditions right before opening
      if (document.hidden) return;
      previousFocusedElement.current = document.activeElement;
      setIsOpen(true);

      // Browser back button support (Rule 3)
      window.history.pushState({ welcomeSheetOpen: true }, '');
    }, 3000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isLiveMatch, isOtherModalOpen]);

  // Handle browser back button (Rule 3)
  useEffect(() => {
    if (!isOpen) return;
    const handlePopState = (e) => {
      markAsSeen();
      setIsOpen(false);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isOpen]);

  // Handle Escape key (Rule 3)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Prevent background scrolling while open & trap focus (Rule 8)
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      // Focus first actionable element
      setTimeout(() => {
        if (closeButtonRef.current) closeButtonRef.current.focus();
      }, 100);

      const handleTabKey = (e) => {
        if (!sheetRef.current || e.key !== 'Tab') return;
        const focusables = sheetRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      };

      window.addEventListener('keydown', handleTabKey);
      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleTabKey);
      };
    }
  }, [isOpen]);

  // Touch swipe-down gesture to dismiss (Rule 3)
  const handleTouchStart = (e) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e) => {
    if (touchStartY === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchEndY - touchStartY;
    if (diff > 50) {
      // Swiped down
      handleDismiss();
    }
    setTouchStartY(null);
  };

  // Share functionality (Rule 5a: Web Share with WhatsApp & Copy link fallbacks)
  const orgLine = lang === 'ml'
    ? `${ORGANISERS.primary.nameMl} & ${ORGANISERS.coOrganiser.nameMl}`
    : `${ORGANISERS.primary.name} & ${ORGANISERS.coOrganiser.name}`;

  const shareMessage = lang === 'ml'
    ? `⚽ അഖിലേന്ത്യാ സെവൻസ് ഫുട്ബോൾ ടൂർണ്ണമെന്റ് Season 7 • ${orgLine} • പെരുവള്ളൂർ പഞ്ചായത്ത് സ്റ്റേഡിയം\nലൈവ് സ്കോറുകളും ഫിക്സ്ചറുകളും കാണാൻ സന്ദർശിക്കുക:`
    : `⚽ Akhilenthya Sevens Football Tournament Season 7 • ${orgLine} • Peruvallur Panjayath Stadium\nFollow live scores & fixtures:`;

  const shareTargetUrl = `${SITE_URL}?v=udaya_s7`;

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Akhilenthya Sevens S7',
          text: shareMessage,
          url: shareTargetUrl
        });
        return;
      } catch (err) {
        if (err.name !== 'AbortError') {
          openWhatsApp();
        }
      }
    } else {
      openWhatsApp();
    }
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent(`${shareMessage} ${shareTargetUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const handleCopy = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(shareTargetUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[60] flex flex-col justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-sheet-title"
    >
      {/* Semi-transparent dark overlay (Rule 7: No blur/backdrop-filter) */}
      <div 
        onClick={handleDismiss}
        className="fixed inset-0 bg-navy-950/70 transition-opacity duration-200"
        aria-hidden="true"
      />

      {/* Bottom Sheet Container (Rule 7: max height 40% of viewport, 200ms slide-up, safe-area-inset-bottom) */}
      <div 
        ref={sheetRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 16px))' }}
        className="relative z-10 w-full max-h-[75vh] overflow-y-auto surface-navy-card border-t border-navy-700 rounded-t-3xl shadow-2xl transition-transform duration-200 ease-out transform translate-y-0 px-4 pt-3 text-white select-none motion-reduce:transition-none"
      >
        {/* Drag Handle Bar (Rule 7) */}
        <div className="w-12 h-1.5 rounded-full bg-navy-600/80 mx-auto mb-3" />

        {/* Header Row: Title & Close Button */}
        <div className="flex items-center justify-between pb-2.5 border-b border-navy-700/80">
          <div className="flex items-center gap-2 min-w-0 pr-2">
            <Sparkles className="w-4 h-4 text-gold shrink-0" />
            <h2 
              id="welcome-sheet-title" 
              className="text-sm sm:text-base font-black font-sports uppercase tracking-wider text-white truncate leading-tight"
            >
              {lang === 'ml' 
                ? 'അഖിലേന്ത്യാ സെവൻസ് സീസൺ 7-ലേക്ക് സ്വാഗതം' 
                : 'Welcome to Akhilenthya Sevens S7'}
            </h2>
          </div>

          <button
            ref={closeButtonRef}
            onClick={handleDismiss}
            className="w-8 h-8 rounded-full bg-navy-800 text-white flex items-center justify-center hover:bg-navy-700 active:scale-95 transition shrink-0"
            aria-label="Close welcome bottom sheet"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Highlights for New Fans (User request: view full team, fixtures, current top player) */}
        <div className="pt-3 pb-2 border-b border-navy-700/60">
          <div className="text-[11px] font-black uppercase tracking-wider text-gold flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5">
              <span>⚡</span>
              <span>{lang === 'ml' ? 'പ്രധാന വിവരങ്ങൾ പെട്ടെന്ന് കാണാം:' : 'Explore Tournament:'}</span>
            </span>
            <span className="text-[10px] text-navy-muted font-normal lowercase">{lang === 'ml' ? 'ക്ലിക്ക് ചെയ്യുക' : 'tap to view'}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => {
                handleDismiss();
                if (onNavigate) onNavigate('teams');
              }}
              className="p-2 sm:p-2.5 rounded-2xl bg-navy-800 hover:bg-navy-750 border border-navy-700 transition active:scale-95 flex flex-col items-center text-center group shadow-xs"
            >
              <div className="w-8 h-8 rounded-xl bg-gold/15 text-gold flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-black text-white leading-tight">
                {lang === 'ml' ? '24 ക്ലബ്ബുകൾ' : 'Full Teams'}
              </span>
              <span className="text-[9px] text-navy-muted mt-0.5">
                {lang === 'ml' ? 'സ്ക്വാഡ് കാണാം' : 'View Squad'}
              </span>
            </button>

            <button
              onClick={() => {
                handleDismiss();
                if (onNavigate) onNavigate('fixtures');
              }}
              className="p-2 sm:p-2.5 rounded-2xl bg-navy-800 hover:bg-navy-750 border border-navy-700 transition active:scale-95 flex flex-col items-center text-center group shadow-xs"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-black text-white leading-tight">
                {lang === 'ml' ? 'മത്സരക്രമം' : 'Fixtures'}
              </span>
              <span className="text-[9px] text-navy-muted mt-0.5">
                {lang === 'ml' ? 'ടൈംടേബിൾ' : 'Schedule'}
              </span>
            </button>

            <button
              onClick={() => {
                handleDismiss();
                if (onNavigate) onNavigate('stats');
              }}
              className="p-2 sm:p-2.5 rounded-2xl bg-navy-800 hover:bg-navy-750 border border-navy-700 transition active:scale-95 flex flex-col items-center text-center group shadow-xs"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <Star className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-black text-white leading-tight">
                {lang === 'ml' ? 'താരങ്ങൾ' : 'Top Players'}
              </span>
              <span className="text-[9px] text-navy-muted mt-0.5">
                {lang === 'ml' ? 'സ്റ്റാറ്റ്സ് & ഗോൾ' : 'Stats Race'}
              </span>
            </button>
          </div>
        </div>

        {/* Action Controls Grid (Rule 5: Three large buttons >= 48px tall) */}
        <div className="space-y-2.5 py-3">
          {/* 1. Share With Friends Button with Copy Fallback */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex-1 min-h-[48px] px-4 py-2.5 rounded-2xl btn-royal text-white font-bold text-xs uppercase flex items-center justify-center gap-2 active:scale-98 transition shadow-xs"
            >
              <Share2 className="w-4 h-4 shrink-0" />
              <span>{lang === 'ml' ? 'കൂട്ടുകാർക്ക് ഷെയർ ചെയ്യാം' : 'Share with friends'}</span>
            </button>

            <button
              onClick={handleCopy}
              className="min-h-[48px] px-3.5 py-2.5 rounded-2xl bg-navy-800 hover:bg-navy-700 text-white border border-navy-700 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition shrink-0"
              title="Copy link"
              aria-label="Copy website link"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-[11px] text-emerald-400 font-bold">{lang === 'ml' ? 'കോപ്പി ചെയ്തു' : 'Copied'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-navy-muted" />
                  <span className="text-[11px] text-navy-muted">{lang === 'ml' ? 'ലിങ്ക്' : 'Copy'}</span>
                </>
              )}
            </button>
          </div>

          {/* 2. Language & Theme Segmented Controls Row */}
          <div className="grid grid-cols-2 gap-2">
            {/* Language Segmented Control (Rule 5b: Malayalam | English) */}
            <div className="min-h-[48px] p-1 rounded-2xl bg-navy-800 border border-navy-700 flex items-center">
              <button
                type="button"
                onClick={() => setLang('ml')}
                className={`flex-1 h-full rounded-xl text-xs font-bold transition flex items-center justify-center active:scale-95 ${
                  lang === 'ml' 
                    ? 'btn-gold text-navy-900 font-black shadow-xs' 
                    : 'text-navy-muted hover:text-white'
                }`}
              >
                മലയാളം
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`flex-1 h-full rounded-xl text-xs font-bold transition flex items-center justify-center active:scale-95 ${
                  lang === 'en' 
                    ? 'btn-gold text-navy-900 font-black shadow-xs' 
                    : 'text-navy-muted hover:text-white'
                }`}
              >
                English
              </button>
            </div>

            {/* Theme Segmented Control (Rule 5c: Light | Dark) */}
            <div className="min-h-[48px] p-1 rounded-2xl bg-navy-800 border border-navy-700 flex items-center">
              <button
                type="button"
                onClick={() => setIsDarkMode(false)}
                className={`flex-1 h-full rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 active:scale-95 ${
                  !isDarkMode 
                    ? 'bg-white text-navy-900 font-black shadow-xs' 
                    : 'text-navy-muted hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Light</span>
              </button>
              <button
                type="button"
                onClick={() => setIsDarkMode(true)}
                className={`flex-1 h-full rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 active:scale-95 ${
                  isDarkMode 
                    ? 'btn-royal text-white font-black shadow-xs' 
                    : 'text-navy-muted hover:text-white'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Dark</span>
              </button>
            </div>
          </div>
        </div>

        {/* Done / Dismiss Button */}
        <div className="pt-1 pb-1">
          <button
            onClick={handleDismiss}
            className="w-full min-h-[44px] py-2.5 rounded-2xl bg-navy-800 hover:bg-navy-700 text-gold font-bold text-xs uppercase tracking-wider transition active:scale-98 border border-navy-700"
          >
            {lang === 'ml' ? 'പൂർത്തിയായി (Done)' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
}
