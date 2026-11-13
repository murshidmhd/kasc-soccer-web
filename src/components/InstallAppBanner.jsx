import React, { useState, useEffect } from 'react';
import { Download, X, Share, PlusSquare, Smartphone, Check } from 'lucide-react';
import logoUdaya from '../assets/logo_udaya_transparent.png';

export default function InstallAppBanner({ lang = 'ml' }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // 1. Check if already installed / standalone mode
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;
    setIsStandalone(isStandaloneMode);
    if (isStandaloneMode) return;

    // 2. Check if user dismissed recently (remember for 5 days)
    const dismissedAt = localStorage.getItem('udaya_pwa_banner_dismissed');
    if (dismissedAt) {
      const daysSince = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60 * 24);
      if (daysSince < 5) return;
    }

    // 3. Detect iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // 4. Capture beforeinstallprompt on Android / Chromium
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // 5. Detect app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsVisible(false);
      setDeferredPrompt(null);
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    // 6. Listen for manual trigger from Header Menu
    const handleManualTrigger = () => {
      setIsVisible(true);
      if (isIosDevice) {
        setShowIOSGuide(true);
      }
    };
    window.addEventListener('trigger_pwa_install', handleManualTrigger);

    // If on iOS and not standalone, show after a gentle 3-second delay
    if (isIosDevice && !isStandaloneMode) {
      const timer = setTimeout(() => setIsVisible(true), 3500);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('trigger_pwa_install', handleManualTrigger);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    if (!deferredPrompt) {
      // Fallback instruction
      alert(lang === 'ml' 
        ? 'ബ്രൗസർ മെനുവിൽ നിന്ന് "Add to Home screen" ക്ലിക്ക് ചെയ്യുക.' 
        : 'Please select "Add to Home screen" from your browser menu.');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('udaya_pwa_banner_dismissed', Date.now().toString());
  };

  if (isStandalone || isInstalled || !isVisible) {
    return null;
  }

  return (
    <>
      {/* Floating Liquid Glass Install Bar */}
      <aside 
        className="fixed bottom-20 sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 sm:w-96 z-40 animate-fadeIn"
        aria-label={lang === 'ml' ? 'ആപ്പ് ഇൻസ്റ്റാൾ ചെയ്യുക' : 'Install App'}
      >
        <div className="p-3 sm:p-4 rounded-3xl liquid-glass border border-frost/30 shadow-[0_20px_48px_rgba(14,11,29,0.85)] flex items-center justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-white p-1 border border-frost/30 shrink-0 flex items-center justify-center shadow-md">
              <img 
                src={logoUdaya} 
                alt="Udaya FC" 
                className="w-full h-full object-contain" 
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-sports font-black text-xs sm:text-sm text-white tracking-wide truncate">
                  {lang === 'ml' ? 'ഉദയ സെവൻസ് ആപ്പ്' : 'Udaya Sevens App'}
                </span>
                <span className="px-1.5 py-0.2 rounded-full bg-gold text-[#0E0B1D] font-black text-[8px] uppercase tracking-wider shrink-0">
                  FREE
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-frost/70 truncate">
                {lang === 'ml' 
                  ? 'വേഗത്തിൽ Live സ്കോറുകൾ കാണാൻ ആപ്പ് ഇൻസ്റ്റാൾ ചെയ്യാം' 
                  : 'Install app for 1-tap fast live scores'}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleInstallClick}
              className="min-h-[38px] px-3.5 py-1.5 rounded-full btn-royal text-white font-sports font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{lang === 'ml' ? 'ഇൻസ്റ്റാൾ' : 'Install'}</span>
            </button>
            <button
              onClick={handleDismiss}
              className="w-8 h-8 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-frost/70 hover:text-white flex items-center justify-center active:scale-95 transition"
              aria-label="Dismiss install banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* iOS Safari Add to Home Screen Instructions Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl liquid-glass border border-frost/30 p-5 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-gold" />
                <h3 className="font-sports font-black text-sm uppercase">
                  {lang === 'ml' ? 'ഐഫോണിൽ ആപ്പ് ഇൻസ്റ്റാൾ ചെയ്യാൻ' : 'Install on iPhone / iPad'}
                </h3>
              </div>
              <button 
                onClick={() => setShowIOSGuide(false)}
                className="p-1 rounded-full text-frost/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <ol className="space-y-3 text-xs text-frost/85 font-medium">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#5A3B8C] text-white flex items-center justify-center text-[11px] font-bold shrink-0">1</span>
                <span>
                  {lang === 'ml' 
                    ? 'സഫാരി (Safari) ബ്രൗസറിന്റെ അടിയിലുള്ള ' 
                    : 'Tap the '}
                  <strong className="text-white inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/15">
                    <Share className="w-3 h-3 text-sky inline" /> Share
                  </strong>
                  {lang === 'ml' ? ' ബട്ടൺ അമർത്തുക.' : ' button in Safari.'}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#5A3B8C] text-white flex items-center justify-center text-[11px] font-bold shrink-0">2</span>
                <span>
                  {lang === 'ml' 
                    ? 'ലിസ്റ്റിൽ നിന്ന് താഴേക്ക് സ്ക്രോൾ ചെയ്ത് ' 
                    : 'Scroll down and choose '}
                  <strong className="text-white inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/15">
                    <PlusSquare className="w-3 h-3 text-gold inline" /> Add to Home Screen
                  </strong>
                  {lang === 'ml' ? ' തിരഞ്ഞെടുക്കുക.' : '.'}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#5A3B8C] text-white flex items-center justify-center text-[11px] font-bold shrink-0">3</span>
                <span>
                  {lang === 'ml' 
                    ? 'മുകളിൽ വലതുവശത്ത് കാണുന്ന ' 
                    : 'Tap '}
                  <strong className="text-white">Add</strong>
                  {lang === 'ml' ? ' ക്ലിക്ക് ചെയ്താൽ ആപ്പ് ഹോം സ്ക്രീനിൽ റെഡിയാകും!' : ' in the top right corner. Done!'}
                </span>
              </li>
            </ol>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full min-h-[42px] rounded-full btn-royal text-white font-sports font-black text-xs uppercase tracking-wider transition active:scale-95"
            >
              {lang === 'ml' ? 'മനസ്സിലായി (Got It)' : 'Got It'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
