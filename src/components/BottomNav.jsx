import React from 'react';
import { Flame, Calendar, Shield, Trophy, MapPin, Award, ShieldCheck } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab, isDarkMode, lang }) {
  const navItems = [
    { id: 'live', label: lang === 'ml' ? 'ലൈവ്' : 'Live', icon: Flame, color: 'text-red-600' },
    { id: 'fixtures', label: lang === 'ml' ? 'ഫിക്സ്ചർ' : 'Fixtures', icon: Calendar, color: 'text-blue-600' },
    { id: 'teams', label: lang === 'ml' ? 'ക്ലബ്ബുകൾ' : 'Clubs', icon: Shield, color: 'text-blue-600' },
    { id: 'stats', label: lang === 'ml' ? 'സ്റ്റാറ്റ്സ്' : 'Stats', icon: Trophy, color: 'text-indigo-600' },
    { id: 'promo', label: lang === 'ml' ? 'മാരത്തോൺ' : 'Marathon', icon: Award, color: 'text-amber-600' }
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.location.hash = tabId;
  };

  return (
    <nav 
      className="fixed bottom-0 inset-x-0 z-50 sm:hidden border-t border-white/10 rounded-t-2xl bg-gradient-to-r from-violet-950/75 via-slate-950/80 to-indigo-950/75 backdrop-blur-2xl shadow-[0_-10px_32px_rgba(8,6,30,0.45)] px-1 transition-colors before:absolute before:inset-x-10 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/35 before:to-transparent"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="grid grid-cols-5 items-stretch w-full max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`min-h-[56px] flex flex-col items-center justify-center gap-0.5 py-1 px-0 rounded-xl border transition active:scale-95 w-full min-w-0 relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 ${
                isActive
                  ? 'bg-white/[0.09] border-white/15 shadow-inner shadow-white/5 backdrop-blur-md'
                  : 'bg-transparent border-transparent hover:bg-white/[0.05]'
              }`}
              aria-label={item.label}
            >
              <Icon className={`w-5 h-5 shrink-0 transition-colors ${
                isActive ? 'text-gold' : 'text-navy-muted'
              }`} />
              <span className={`text-[9px] mt-0 tracking-tight w-full min-w-0 text-center leading-[1.1] transition-colors ${
                isActive ? 'text-gold font-black' : 'text-navy-muted font-medium'
              }`}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute top-0 inset-x-5 h-0.5 rounded-full bg-gradient-to-r from-transparent via-gold to-transparent shadow-[0_0_10px_rgba(245,179,1,0.75)] animate-fadeIn"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
