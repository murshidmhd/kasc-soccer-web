import React from 'react';
import { Award, Sparkles, ShieldCheck, ExternalLink } from 'lucide-react';
import fezcoPoster from '../assets/fezco_title_sponsor_poster.webp';
import { SPONSORS_DATA } from '../config/siteConfig';

export default function SponsorsSection({ lang, isDarkMode }) {
  const titleSponsor = SPONSORS_DATA[0];
  const associateSponsors = SPONSORS_DATA.slice(1);

  return (
    <section id="sponsors" className="py-8 px-4 sm:px-6 max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* 1. Title Sponsor Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span>{lang === 'ml' ? 'ഔദ്യോഗിക പ്രായോജകർ' : 'OFFICIAL TOURNAMENT SPONSORS'}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black font-sports uppercase tracking-wide text-card-title">
          {lang === 'ml' ? 'ടൂർണ്ണമെന്റ് സ്പോൺസർഷിപ്പ്' : 'OUR VALUED PARTNERS'}
        </h2>
        <p className="text-xs sm:text-sm text-card-muted max-w-lg mx-auto">
          {lang === 'ml'
            ? 'അഖിലേന്ത്യാ സെവൻസ് ഫുട്ബോൾ സീസൺ 7-ന്റെ കരുത്തായി ഒപ്പമുള്ള ഔദ്യോഗിക പ്രായോജകർ'
            : 'Powering Kerala All India Sevens Football Season 7 at Peruvallur Panjayath Stadium'}
        </p>
      </div>

      {/* 2. Official Title Sponsor Poster Showcase (FEZCO GROUP) */}
      <div className="rounded-3xl overflow-hidden border-2 border-gold/50 shadow-2xl bg-navy-950 group max-w-2xl mx-auto">
        <div className="p-3.5 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 border-b border-navy-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gold animate-pulse" />
            <span className="text-xs sm:text-sm font-black uppercase text-gold font-sports tracking-wider">
              {lang === 'ml' ? titleSponsor.tierMl : titleSponsor.tier}
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-gold/20 text-gold text-[10px] font-black font-mono uppercase">
            SEASON 7
          </span>
        </div>

        <div className="p-4 sm:p-6 bg-black flex flex-col items-center justify-center space-y-4">
          <img 
            src={titleSponsor.logoUrl} 
            alt={titleSponsor.name} 
            className="h-16 sm:h-20 w-auto object-contain drop-shadow-md"
            loading="lazy"
          />
          <img 
            src={fezcoPoster} 
            alt={`${titleSponsor.name} - Official Title Sponsor Season 7`} 
            width={801}
            height={1000}
            loading="lazy"
            className="w-full max-w-md h-auto rounded-2xl object-cover transition-transform duration-500 group-hover:scale-[1.01] shadow-xl"
          />
        </div>

        <div className="p-4 bg-navy-900/95 text-center space-y-1 border-t border-navy-800">
          <h3 className="text-lg font-black font-sports tracking-wider uppercase text-white">
            {titleSponsor.name}
          </h3>
          <p className="text-xs text-gold font-bold">
            {lang === 'ml' ? titleSponsor.taglineMl : titleSponsor.tagline}
          </p>
          <p className="text-[11px] text-navy-muted">
            Peruvallur Panchayath Stadium • 2026 Nov 6 - Dec 6
          </p>
        </div>
      </div>

      {/* 3. Associate Sponsors & Official Partners (MOTONEX & BIT LOGIC) */}
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-sm font-black font-sports uppercase tracking-wider text-card-title">
            {lang === 'ml' ? 'സഹ പ്രായോജകർ & പാർട്ണർമാർ' : 'CO-SPONSORS & OFFICIAL PARTNERS'}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {associateSponsors.map((sp) => (
            <div 
              key={sp.id}
              className="rounded-2xl border border-surface-border dark:border-navy-700 bg-surface-card dark:bg-navy-900 overflow-hidden shadow-md flex flex-col justify-between hover:border-gold/60 transition group"
            >
              {/* Partner Badge */}
              <div className="px-3.5 py-2 bg-surface-light dark:bg-navy-800 border-b border-surface-border dark:border-navy-700 flex items-center justify-between">
                <span className="text-[11px] font-black font-sports uppercase text-gold tracking-wider">
                  {lang === 'ml' ? sp.tierMl : sp.tier}
                </span>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              </div>

              {/* Logo Area */}
              <div className="p-6 bg-white flex items-center justify-center min-h-[120px] transition group-hover:brightness-105">
                <img 
                  src={sp.logoUrl} 
                  alt={sp.name} 
                  className="max-h-16 w-auto max-w-[260px] object-contain drop-shadow-xs"
                  loading="lazy"
                />
              </div>

              {/* Info Footer */}
              <div className="p-3.5 bg-surface-light dark:bg-navy-900/90 border-t border-surface-border dark:border-navy-700 text-center">
                <h4 className="text-sm font-black font-sports uppercase text-card-title">
                  {sp.name}
                </h4>
                <p className="text-[11px] text-card-muted font-bold mt-0.5">
                  {lang === 'ml' ? sp.taglineMl : sp.tagline}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
