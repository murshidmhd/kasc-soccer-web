import React from 'react';
import { Flame, Calendar, Shield, Trophy, MapPin, Award, ShieldCheck } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab, isDarkMode, lang }) {
  const navItems = [
    { id: 'live', label: 'Live', icon: Flame, color: 'text-red-600' },
    { id: 'fixtures', label: 'Fixtures', icon: Calendar, color: 'text-blue-600' },
    { id: 'teams', label: 'Clubs', icon: Shield, color: 'text-blue-600' },
    { id: 'stats', label: 'Stats', icon: Trophy, color: 'text-indigo-600' },
    { id: 'promo', label: 'Marathon', icon: Award, color: 'text-amber-600' }
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.location.hash = tabId;
  };

  return (
    <nav 
      className="footer-glass-nav fixed bottom-0 inset-x-0 z-50 sm:hidden rounded-t-[28px] px-1.5 transition-colors"
      style={{ paddingBottom: 'max(0.6rem, env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="grid grid-cols-5 items-stretch w-full max-w-md mx-auto pt-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`min-h-[56px] flex flex-col items-center justify-center gap-1 py-1 px-0.5 rounded-2xl border transition duration-200 active:scale-[0.95] w-full min-w-0 relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-frost/70 ${
                isActive
                  ? 'footer-glass-active border-frost/30 text-white shadow-liquid-pill'
                  : 'bg-white/[0.02] border-transparent hover:bg-white/[0.06] hover:border-white/[0.08] text-frost/65'
              }`}
              aria-label={item.label}
            >
              <Icon className={`w-5 h-5 shrink-0 transition-all ${
                isActive ? 'text-frost scale-110' : 'text-frost/60'
              }`} />
              <span className={`text-[10px] mt-0 tracking-tight w-full min-w-0 text-center leading-[1.1] transition-colors ${
                isActive ? 'text-white font-bold' : 'text-frost/60 font-medium'
              }`}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute top-0 inset-x-4 h-0.5 rounded-full bg-gradient-to-r from-transparent via-frost to-transparent shadow-[0_0_12px_rgba(201,194,227,0.9)] animate-fadeIn"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
