import React from 'react';
import { Home, Calendar, Shield, Trophy, Flame } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab, isDarkMode, lang }) {
  const navItems = [
    { id: 'live', label: 'Home', icon: Home },
    { id: 'fixtures', label: 'Fixtures', icon: Calendar },
    { id: 'teams', label: 'Clubs', icon: Shield },
    { id: 'stats', label: 'Stats', icon: Trophy },
    { id: 'predict', label: 'Vote', icon: Flame },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.location.hash = tabId;
  };

  return (
    <div className="fixed bottom-4 inset-x-0 z-50 pointer-events-none flex justify-center px-4">
      <nav 
        className="pointer-events-auto w-full max-w-sm rounded-full p-1.5 shadow-2xl backdrop-blur-2xl bg-white/85 dark:bg-slate-950/85 border border-slate-200/80 dark:border-white/15 transition-all duration-300"
        style={{ paddingBottom: 'max(0.35rem, env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="flex items-center justify-between gap-1 w-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`flex-1 py-2 px-1 rounded-full flex flex-col sm:flex-row items-center justify-center gap-1 transition-all duration-200 active:scale-95 ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md dark:shadow-purple-900/50'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-white/5'
                }`}
                aria-label={item.label}
              >
                <Icon className={`w-4 h-4 transition-transform ${isActive ? 'scale-110' : ''}`} />
                <span className={`text-[10px] tracking-tight font-bold ${
                  isActive ? 'text-white' : 'text-slate-600 dark:text-slate-400'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
