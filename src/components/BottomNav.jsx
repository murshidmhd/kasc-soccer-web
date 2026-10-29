import React from 'react';
import { Flame, Calendar, Shield, Trophy, MapPin, Award, ShieldCheck } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab, isDarkMode, lang }) {
  const navItems = [
    { id: 'live', label: lang === 'ml' ? 'ലൈവ്' : 'Live', icon: Flame, color: 'text-red-600' },
    { id: 'fixtures', label: lang === 'ml' ? 'ഫിക്സ്ചർ' : 'Fixtures', icon: Calendar, color: 'text-blue-600' },
    { id: 'teams', label: lang === 'ml' ? 'ക്ലബ്ബുകൾ' : 'Clubs', icon: Shield, color: 'text-blue-600' },
    { id: 'promo', label: lang === 'ml' ? 'മാരത്തോൺ' : 'Buzz', icon: Award, color: 'text-amber-600' },
    { id: 'stats', label: lang === 'ml' ? 'സ്റ്റാറ്റ്സ്' : 'Stats', icon: Trophy, color: 'text-indigo-600' },
    { id: 'admin', label: lang === 'ml' ? 'അഡ്മിൻ' : 'Admin', icon: ShieldCheck, color: 'text-amber-500' }
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.location.hash = tabId;
  };

  return (
    <nav className={`fixed bottom-0 inset-x-0 z-50 sm:hidden border-t backdrop-blur-lg px-1 py-1.5 transition-colors ${
      isDarkMode 
        ? 'bg-slate-950/95 border-slate-800 text-slate-400' 
        : 'bg-white/95 border-slate-200 text-slate-600 shadow-lg'
    }`}>
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition active:scale-90 ${
                isActive
                  ? isDarkMode
                    ? 'bg-blue-950/80 text-blue-400 font-bold'
                    : 'bg-blue-50 text-blue-800 font-bold'
                  : 'hover:text-slate-900 font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? item.color : 'text-slate-400'}`} />
              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-bold' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
