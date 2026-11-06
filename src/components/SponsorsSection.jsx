import React from 'react';
import { Award, Sparkles, ShieldCheck } from 'lucide-react';
import fezcoPoster from '../assets/fezco_title_sponsor_poster.webp';

export default function SponsorsSection({ lang, isDarkMode }) {
  return (
    <section id="sponsors" className="py-8 px-4 sm:px-6 max-w-4xl mx-auto space-y-6">
      {/* Title Sponsor Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span>{lang === 'ml' ? 'ഔദ്യോഗിക ടൈറ്റിൽ സ്പോൺസർ' : 'OFFICIAL TITLE SPONSOR'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black font-sports uppercase tracking-wide text-card-title">
          FEZCO GROUP
        </h2>
        <p className="text-xs text-card-muted max-w-md mx-auto">
          {lang === 'ml'
            ? 'അഖിലേന്ത്യാ സെവൻസ് ഫുട്ബോൾ സീസൺ 7-ന്റെ ഔദ്യോഗിക മുഖ്യ പ്രായോജകർ'
            : 'Proud Official Title Sponsor of All India Sevens Football Season 7'}
        </p>
      </div>

      {/* Official Poster Presentation */}
      <div className="relative rounded-3xl overflow-hidden border border-surface-border dark:border-navy-700 shadow-2xl max-w-md mx-auto bg-navy-950 group">
        <img 
          src={fezcoPoster} 
          alt="FEZCO GROUP - Official Title Sponsor Season 7" 
          width={801}
          height={1000}
          loading="lazy"
          className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-[1.01]"
        />
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white text-center">
          <h3 className="text-base font-black font-sports tracking-wider uppercase text-gold">
            FEZCO GROUP
          </h3>
          <p className="text-[11px] text-slate-300 font-medium">
            Peruvallur Panchayath Stadium • 2026 Nov 6 - Dec 6
          </p>
        </div>
      </div>
    </section>
  );
}
