import React from 'react';
import { Award, Megaphone, CheckCircle } from 'lucide-react';
import { sponsors } from '../data/tournamentData';

export default function SponsorsSection({ lang, isDarkMode }) {
  return (
    <section id="sponsors" className="py-12 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider">
          <Award className="w-3.5 h-3.5 text-amber-600" />
          <span>{lang === 'ml' ? 'സ്പോൺസർഷിപ്പ് & പങ്കാളികൾ' : 'SPONSORS & PARTNERS'}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black font-sports text-slate-950 tracking-wide uppercase">
          {lang === 'ml' ? 'ടൂർണ്ണമെന്റ് പങ്കാളികൾ' : 'OFFICIAL PARTNERS'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          {lang === 'ml'
            ? 'അഖിലേന്ത്യാ സെവൻസ് ടൂർണ്ണമെന്റ് വിജയകരമാക്കാൻ സഹകരിക്കുന്ന സ്ഥാപനങ്ങളും പ്രവാസി കൂട്ടായ്മകളും'
            : 'Proudly supported by local business leaders, community patrons, and Gulf expat associations.'}
        </p>
      </div>

      {/* Sponsors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {sponsors.map((sp, idx) => (
          <div
            key={idx}
            className={`rounded-2xl p-5 border text-center space-y-2 group transition duration-200 ${
              isDarkMode 
                ? 'bg-slate-900 border-slate-800 text-white' 
                : 'bg-white border-slate-200 text-slate-900 shadow-sm hover:shadow-md hover:border-amber-400'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600 group-hover:scale-110 transition">
              <Award className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              {sp.tier}
            </div>
            <h4 className="text-base font-bold text-slate-900 font-sports">
              {sp.name}
            </h4>
            <p className="text-xs text-slate-500">
              {sp.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Pitch Banner for Committee Sponsors */}
      <div className={`rounded-3xl p-6 sm:p-8 border text-center max-w-3xl mx-auto space-y-3 transition-colors ${
        isDarkMode 
          ? 'bg-slate-900 border-slate-800 text-white' 
          : 'bg-gradient-to-r from-blue-50 via-white to-amber-50 border-slate-200 text-slate-900 shadow-sm'
      }`}>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold border border-blue-200">
          <Megaphone className="w-3.5 h-3.5 text-blue-700" />
          <span>Feature Your Brand on the Official Web Portal</span>
        </div>
        <h3 className="text-lg sm:text-xl font-black font-sports text-slate-950 uppercase">
          WANT TO REACH 25,000+ LOCAL FANS & GULF VIEWERS?
        </h3>
        <p className="text-xs text-slate-600 max-w-xl mx-auto leading-relaxed">
          Get prominent banner placement across live match scorecards, fixture sheets, and WhatsApp shared status cards.
        </p>
        <div className="pt-2">
          <a
            href="tel:9961878508"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-black shadow-sm transition"
          >
            <span>Contact Committee Media Desk: 9961878508</span>
          </a>
        </div>
      </div>
    </section>
  );
}
