import React from 'react';
import { Megaphone, Calendar, MapPin } from 'lucide-react';

export default function StadiumAnnouncementBanner({ lang, isDarkMode }) {
  return (
    <div className={`rounded-2xl sm:rounded-3xl border overflow-hidden p-3.5 sm:p-4 transition-colors shadow-card ${
      isDarkMode 
        ? 'bg-navy-800 border-navy-700 text-white' 
        : 'bg-white border-surface-border text-navy-900'
    }`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Left info badge & stadium announcement text */}
        <div className="flex items-start sm:items-center gap-3 w-full sm:w-auto min-w-0">
          <div className="w-11 h-11 rounded-2xl btn-gold text-navy-900 flex items-center justify-center shrink-0 shadow-xs">
            <Megaphone className="w-5 h-5 text-navy-900" />
          </div>

          <div className="leading-tight flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="px-2 py-0.5 rounded-full bg-gold text-navy-900 text-[10px] font-black uppercase tracking-wider shadow-xs">
                Official Notice
              </span>
              {/* Title wraps to 2 lines cleanly without ellipsis */}
              <h4 className="text-xs sm:text-sm font-black font-sports uppercase tracking-wider leading-[1.3] text-card-title line-clamp-2">
                {lang === 'ml' 
                  ? 'സ്റ്റേഡിയം ഒഫീഷ്യൽ അനൗൺസ്മെന്റ് ബുള്ളറ്റിൻ' 
                  : 'STADIUM OFFICIAL ANNOUNCEMENT BULLETIN'}
              </h4>
            </div>
            {/* Description wraps to 2 lines cleanly without ending in ellipsis */}
            <p className="text-[11px] font-medium line-clamp-2 mt-1 leading-[1.4] text-card-muted">
              {lang === 'ml' 
                ? 'ഉദയ പറമ്പിൽ പീടിക & KASC പെരുവള്ളൂർ സീസൺ 7 ടൂർണ്ണമെന്റ് പെരുവള്ളൂർ പഞ്ചായത്ത് സ്റ്റേഡിയത്തിൽ നവംബർ 6 മുതൽ' 
                : 'Udaya Parambil Peedika & KASC Peruvallur Season 7 Tournament at Peruvallur Panjayath Stadium starting Nov 06'}
            </p>
          </div>
        </div>

        {/* Right venue & date chip */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-surface-border dark:border-navy-700">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl surface-card-subtle border border-surface-border dark:border-navy-700 text-xs text-card-muted font-bold">
            <MapPin className="w-3.5 h-3.5 text-royal dark:text-sky" />
            <span>Peruvallur</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl surface-card-subtle border border-surface-border dark:border-navy-700 text-xs text-gold font-bold font-mono">
            <Calendar className="w-3.5 h-3.5 text-gold" />
            <span>06 Nov • 8 PM</span>
          </div>
        </div>
      </div>
    </div>
  );
}
