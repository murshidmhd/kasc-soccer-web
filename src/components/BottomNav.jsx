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
      className="fixed bottom-0 inset-x-0 z-50 sm:hidden border-t border-navy-700 surface-navy px-1 transition-colors"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="grid grid-cols-5 items-center w-full max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className="min-h-[52px] flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition active:scale-95 w-full min-w-0 relative"
              aria-label={item.label}
            >
              <Icon className={`w-6 h-6 shrink-0 transition-colors ${
                isActive ? 'text-gold' : 'text-navy-muted'
              }`} />
              <span className={`text-[11px] mt-0.5 tracking-tight truncate w-full text-center leading-tight transition-colors ${
                isActive ? 'text-gold font-black' : 'text-navy-muted font-medium'
              }`}>
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-gold mt-0.5 shrink-0 animate-fadeIn"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
