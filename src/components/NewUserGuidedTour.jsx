import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  ChevronRight, 
  Check, 
  Play, 
  Calendar, 
  Shield, 
  Star,
  Award
} from 'lucide-react';

const TOUR_STORAGE_KEY = 'kasc_guided_tour_seen_v1';

export default function NewUserGuidedTour({ 
  lang, 
  activeTab, 
  onNavigate,
  isOpenManually = false,
  onCloseManual
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      id: 'live',
      icon: Play,
      iconColor: 'text-amber-400 bg-amber-400/20',
      badgeMl: '1/5 • Live',
      badgeEn: '1/5 • Live',
      titleMl: '⚽ Live Match Score',
      titleEn: '⚽ Live Match Score',
      descMl: 'Home പേജിൽ Live Score, Team Line-up, Goal notifications എന്നിവ കാണാം!',
      descEn: 'See live scores, team line-ups and goal flash notifications right on the Home tab!',
      targetId: 'live-match-card',
      tab: 'live'
    },
    {
      id: 'fixtures',
      icon: Calendar,
      iconColor: 'text-blue-400 bg-blue-400/20',
      badgeMl: '2/5 • Fixtures',
      badgeEn: '2/5 • Fixtures',
      titleMl: '📅 മത്സരക്രമവും ടൈംടേബിളും',
      titleEn: '📅 Match Schedule & Timetable',
      descMl: 'Opening Match മുതൽ Final വരെയുള്ള 24 Matches-ന്റെ തീയതികളും Kick-off സമയവും ഇവിടെ പരിശോധിക്കാം.',
      descEn: 'Browse kickoff dates, match timings, and upcoming tournament fixtures anytime.',
      targetId: 'hero-fixtures-btn',
      tab: 'fixtures'
    },
    {
      id: 'teams',
      icon: Shield,
      iconColor: 'text-emerald-400 bg-emerald-400/20',
      badgeMl: '3/5 • ക്ലബ്ബുകൾ',
      badgeEn: '3/5 • 24 Clubs',
      titleMl: '🛡️ 24 ക്ലബ്ബുകളും സ്ക്വാഡ് ലിസ്റ്റും',
      titleEn: '🛡️ 24 Clubs & Squad Lists',
      descMl: 'അഖിലേന്ത്യാ സെവൻസിൽ മാറ്റുരയ്ക്കുന്ന 24 പ്രമുഖ ക്ലബ്ബുകളെയും അവരുടെ ഒഫീഷ്യൽ താരങ്ങളെയും കാണാൻ ഇവിടെ ക്ലിക്ക് ചെയ്യുക.',
      descEn: 'Explore all 24 competing clubs and their confirmed registered squad players.',
      tab: 'teams'
    },
    {
      id: 'stats',
      icon: Star,
      iconColor: 'text-purple-400 bg-purple-400/20',
      badgeMl: '4/5 • താരങ്ങൾ',
      badgeEn: '4/5 • Top Scorers',
      titleMl: '⭐ Top Scorer & Golden Boot',
      titleEn: '⭐ Golden Boot & Player Directory',
      descMl: 'Tournament-ലെ leading Goal Scorers, Golden Boot race, Live Stats എന്നിവ ഇവിടെ കാണാം!',
      descEn: 'Follow the Golden Boot race, top goal scorers, and player performances.',
      tab: 'stats'
    },
    {
      id: 'marathon',
      icon: Award,
      iconColor: 'text-amber-400 bg-amber-400/20',
      badgeMl: '5/5 • മാരത്തോൺ',
      badgeEn: '5/5 • Marathon',
      titleMl: '🏃 8 KM Mini Marathon',
      titleEn: '🏃 8 KM Mini Marathon',
      descMl: 'മാരത്തോൺ പേജിൽ 2026 ഒക്ടോബർ 25-ലെ പരിപാടിയുടെ വിവരങ്ങൾ, വിജയികൾ, സമ്മാനങ്ങൾ, ഔദ്യോഗിക പോസ്റ്റർ, ഫോട്ടോ ഗാലറി എന്നിവ കാണാം.',
      descEn: 'Check the 8 km event details, winners and prizes, official poster, and photo gallery from the marathon held on 25 October 2026.',
      targetId: 'promo-marathon-tab',
      autoClickTarget: true,
      tab: 'promo'
    }
  ];

  // Auto-trigger for first-time visitors after 2.5 seconds
  useEffect(() => {
    if (isOpenManually) {
      setCurrentStep(0);
      setIsVisible(true);
      return;
    }

    try {
      const alreadySeen = localStorage.getItem(TOUR_STORAGE_KEY) === 'true';
      if (alreadySeen) return;

      const timer = setTimeout(() => {
        // Only trigger on home or live hash
        const hash = window.location.hash.replace('#', '');
        if (!hash || hash === 'live') {
          setIsVisible(true);
        }
      }, 2500);

      return () => clearTimeout(timer);
    } catch (e) {
      // Storage unavailable
    }
  }, [isOpenManually]);

  const handleDismiss = () => {
    try {
      localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    } catch (e) {}
    setIsVisible(false);
    if (onCloseManual) onCloseManual();
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);

      // Smoothly navigate to relevant tab or scroll to button
      const target = steps[nextStep];
      if (target.tab && target.tab !== activeTab && onNavigate) {
        onNavigate(target.tab);
      }
      if (target.targetId) {
        setTimeout(() => {
          const el = document.getElementById(target.targetId);
          if (!el) return;
          if (target.autoClickTarget) el.click();
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, target.tab && target.tab !== activeTab ? 250 : 100);
      }
    } else {
      handleDismiss();
    }
  };

  if (!isVisible) return null;

  const current = steps[currentStep];
  const StepIcon = current.icon;
  const isLast = currentStep === steps.length - 1;

  return (
    <aside 
      className="fixed inset-x-3 bottom-20 sm:bottom-6 max-w-md mx-auto z-50 animate-fadeIn select-none pointer-events-auto"
      role="dialog"
      aria-label="New User Interactive Tournament Tour"
    >
      <div 
        className="rounded-3xl border-2 border-gold/90 text-white p-4 sm:p-5 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #2D1061 0%, #1E0B3F 50%, #130728 100%)',
          boxShadow: '0 20px 50px -10px rgba(30, 11, 63, 0.95), 0 0 0 1px rgba(245, 179, 1, 0.4)'
        }}
      >
        {/* Glowing Ambient Halo */}
        <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-gold/15 blur-xl pointer-events-none" />

        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-purple-800/60">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-gold/20 text-gold text-[10px] font-black uppercase tracking-wider flex items-center gap-1 border border-gold/40">
              <Sparkles className="w-3 h-3 text-gold" />
              <span>{lang === 'ml' ? current.badgeMl : current.badgeEn}</span>
            </span>
            <div className="flex items-center gap-1">
              {steps.map((_, idx) => (
                <span
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    idx === currentStep ? 'w-4 bg-gold shadow-xs' : 'bg-purple-800/80'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="w-7 h-7 rounded-full bg-purple-900/90 hover:bg-purple-800 text-purple-200 hover:text-white flex items-center justify-center transition active:scale-95"
            aria-label="Skip Tour"
            title="Skip Tour"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex items-start gap-3 my-2">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border border-purple-500/30 bg-purple-900/60 ${current.iconColor}`}>
            <StepIcon className="w-5 h-5" />
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="font-sports font-black text-sm text-white uppercase tracking-wider leading-snug">
              {lang === 'ml' ? current.titleMl : current.titleEn}
            </h4>
            <p className="text-xs text-purple-200/90 mt-1 leading-relaxed font-malayalam">
              {lang === 'ml' ? current.descMl : current.descEn}
            </p>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between gap-2 pt-2.5 mt-2 border-t border-purple-800/60">
          <button
            onClick={handleDismiss}
            className="text-[11px] font-bold text-purple-300 hover:text-white px-2 py-1 transition"
          >
            {lang === 'ml' ? 'ഒഴിവാക്കുക (Skip)' : 'Skip Tour'}
          </button>

          <button
            onClick={handleNext}
            className="min-h-[38px] px-4 py-1.5 rounded-xl btn-gold text-navy-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition active:scale-95 shadow-md"
          >
            {isLast ? (
              <>
                <Check className="w-4 h-4 text-navy-950 stroke-[3]" />
                <span>{lang === 'ml' ? 'തുടങ്ങാം (Start)' : 'Start Exploring'}</span>
              </>
            ) : (
              <>
                <span>{lang === 'ml' ? 'അടുത്തത് (Next)' : 'Next'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
