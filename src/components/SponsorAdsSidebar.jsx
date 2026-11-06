import React from 'react';
import { Sparkles, Award, ShieldCheck } from 'lucide-react';
import fezcoPoster from '../assets/fezco_title_sponsor_poster.webp';

export default function SponsorAdsSidebar({ lang, isDarkMode }) {
  return (
    <aside className="space-y-4">
      {/* Top Banner Header */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span>{lang === 'ml' ? 'ടൂർണ്ണമെന്റ് മുഖ്യ പ്രായോജകർ' : 'Official Title Sponsor'}</span>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold text-navy-950 font-sports">
          Season 7
        </span>
      </div>

      {/* Official Title Sponsor: FEZCO GROUP */}
      <div className="rounded-3xl border border-surface-border dark:border-navy-700 overflow-hidden shadow-lg surface-navy group">
        <div className="p-3 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 border-b border-navy-700 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-[11px] font-black uppercase text-gold tracking-wider">
              {lang === 'ml' ? 'ഔദ്യോഗിക ടൈറ്റിൽ സ്പോൺസർ' : 'OFFICIAL TITLE SPONSOR'}
            </span>
          </div>
          <span className="text-[10px] text-navy-muted font-bold">2026 Nov 6 - Dec 6</span>
        </div>

        <div className="relative aspect-[4/5] overflow-hidden bg-black">
          <img 
            src={fezcoPoster} 
            alt="FEZCO GROUP - Official Title Sponsor" 
            width={801}
            height={1000}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div className="p-3.5 space-y-1 text-center bg-navy-900/90">
          <h3 className="text-base font-black font-sports uppercase text-white tracking-wide">
            FEZCO GROUP
          </h3>
          <p className="text-[11px] text-gold font-bold">
            {lang === 'ml' ? 'പെരുവള്ളൂർ പഞ്ചായത്ത് സ്റ്റേഡിയം • പറമ്പിൽ പീടിക' : 'Peruvallur Panchayath Stadium • Parambil Peedika'}
          </p>
        </div>
      </div>
    </aside>
  );
}
