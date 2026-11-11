import React from 'react';
import { Calendar, Shield, Trophy, Navigation } from 'lucide-react';
import { STADIUM_MAPS_URL } from '../config/siteConfig';

export default function QuickActionRow({ lang, isDarkMode, onNavigate }) {
  const actions = [
    {
      id: 'fixtures',
      label: 'Fixtures',
      icon: Calendar,
      color: 'text-sky dark:text-sky',
      onClick: () => onNavigate('fixtures')
    },
    {
      id: 'teams',
      label: 'Clubs',
      icon: Shield,
      color: 'text-royal dark:text-sky',
      onClick: () => onNavigate('teams')
    },
    {
      id: 'stats',
      label: 'Stats',
      icon: Trophy,
      color: 'text-gold',
      onClick: () => onNavigate('stats')
    },
    {
      id: 'directions',
      label: 'Directions',
      icon: Navigation,
      color: 'text-emerald-500 dark:text-emerald-400',
      onClick: () => window.open(STADIUM_MAPS_URL, '_blank', 'noopener,noreferrer')
    }
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              onClick={act.onClick}
              className="min-h-[58px] min-w-[44px] py-2 px-1 rounded-2xl surface-card border border-frost/20 hover:border-frost/40 shadow-xs hover:shadow-liquid-pill flex flex-col items-center justify-center gap-1 transition-all duration-200 active:scale-95 group focus:outline-hidden"
              aria-label={act.label}
            >
              <Icon className={`w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${act.color}`} />
              <span className="text-[11px] sm:text-xs font-sports font-black tracking-wide text-card-title truncate max-w-full text-center leading-tight">
                {act.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
