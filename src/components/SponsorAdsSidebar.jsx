import React from 'react';
import { Utensils, HeartPulse, Phone, ExternalLink, Sparkles, MapPin } from 'lucide-react';
import { sponsorAds } from '../data/tournamentData';

export default function SponsorAdsSidebar({ lang, isDarkMode }) {
  return (
    <aside className="space-y-4">
      {/* Top Banner Header */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>{lang === 'ml' ? 'ഔദ്യോഗിക പരസ്യങ്ങൾ & പങ്കാളികൾ' : 'Official Tournament Ads'}</span>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          Season 7
        </span>
      </div>

      {/* Ad 1: Raidhan Kuzhimanthi */}
      <div className={`rounded-2xl p-4 border transition-all duration-200 relative overflow-hidden group shadow-xs ${
        isDarkMode 
          ? 'bg-slate-900 border-amber-900/40 hover:border-amber-700' 
          : 'bg-gradient-to-br from-amber-50/70 via-white to-orange-50/40 border-amber-200 hover:border-amber-400'
      }`}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black tracking-wider uppercase shadow-xs">
            <Utensils className="w-3 h-3" />
            <span>{lang === 'ml' ? 'ഭക്ഷണ പങ്കാളി' : 'Food Partner'}</span>
          </span>
          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
            Malappuram
          </span>
        </div>

        <h3 className="text-lg sm:text-xl font-black font-sports text-slate-950 uppercase tracking-tight leading-tight">
          {lang === 'ml' ? 'റൈദാൻ കുഴിമന്തി' : 'Raidhan Kuzhimanthi'}
        </h3>
        
        <p className="text-xs text-amber-800 font-bold mt-0.5">
          {lang === 'ml' ? 'അറേബ്യൻ കുഴിമന്തിയുടെ തനിമയാർന്ന രുചിപ്പെരുമ' : 'Authentic Arabian Kuzhimanthi & Mandi Specialists'}
        </p>

        <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
          {lang === 'ml' 
            ? 'സെവൻസ് ഫുട്ബോൾ ആരവത്തോടൊപ്പം ആസ്വദിക്കാം സ്വാദിഷ്ടമായ കുഴിമന്തി, അൽഫഹം, ഷവർമ്മ. ഫാമിലി എസി ഡൈനിങ് & പാർസൽ സൗകര്യം ലഭ്യമാണ്.'
            : 'Enjoy mouth-watering Kuzhimanthi, Alfaham & Arabian delicacies during match nights. Family AC Dining & Takeaway available.'}
        </p>

        <div className="mt-3 pt-3 border-t border-amber-200/60 flex items-center justify-between text-xs font-bold">
          <span className="flex items-center gap-1 text-[11px] text-slate-500">
            <MapPin className="w-3 h-3 text-amber-600" />
            <span>പറമ്പിൽ പീടിക • മലപ്പുറം</span>
          </span>
          <a
            href="tel:9961878508"
            className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs transition active:scale-95"
          >
            <Phone className="w-3 h-3" />
            <span>Order Now</span>
          </a>
        </div>
      </div>

      {/* Ad 2: Life Line Hospital */}
      <div className={`rounded-2xl p-4 border transition-all duration-200 relative overflow-hidden group shadow-xs ${
        isDarkMode 
          ? 'bg-slate-900 border-emerald-900/40 hover:border-emerald-700' 
          : 'bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/40 border-emerald-200 hover:border-emerald-400'
      }`}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black tracking-wider uppercase shadow-xs">
            <HeartPulse className="w-3 h-3" />
            <span>{lang === 'ml' ? 'മെഡിക്കൽ പങ്കാളി' : 'Healthcare Partner'}</span>
          </span>
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
            24x7 Emergency
          </span>
        </div>

        <h3 className="text-lg sm:text-xl font-black font-sports text-slate-950 uppercase tracking-tight leading-tight">
          {lang === 'ml' ? 'ലൈഫ് ലൈൻ ഹോസ്പിറ്റൽ' : 'Life Line Hospital'}
        </h3>
        
        <p className="text-xs text-emerald-800 font-bold mt-0.5">
          {lang === 'ml' ? 'അത്യാഹിത വിഭാഗം & സ്പോർട്സ് ഇഞ്ചുറി കെയർ' : '24x7 Emergency Care & Sports Injury Management'}
        </p>

        <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
          {lang === 'ml' 
            ? 'ടൂർണ്ണമെന്റ് വേദിയിൽ കളിക്കാർക്കും കാണികൾക്കും സമ്പൂർണ്ണ പ്രഥമശുശ്രൂഷാ സൗകര്യം. അത്യാധുനിക ഐസിയു ആംബുലൻസ് സർവീസ് 24 മണിക്കൂറും സജ്ജം.'
            : 'Complete emergency medical coverage and sports injury assistance for players. 24-hour ICU ambulance standby.'}
        </p>

        <div className="mt-3 pt-3 border-t border-emerald-200/60 flex items-center justify-between text-xs font-bold">
          <span className="flex items-center gap-1 text-[11px] text-slate-500">
            <MapPin className="w-3 h-3 text-emerald-600" />
            <span>മലപ്പുറം • പെരുവള്ളൂർ</span>
          </span>
          <a
            href="tel:9961878508"
            className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition active:scale-95"
          >
            <Phone className="w-3 h-3" />
            <span>Helpline</span>
          </a>
        </div>
      </div>

      {/* Ad Promotion Box */}
      <div className={`p-3 rounded-xl border border-dashed text-center text-xs space-y-1 ${
        isDarkMode ? 'border-slate-700 bg-slate-900/60 text-slate-400' : 'border-slate-300 bg-slate-100/60 text-slate-600'
      }`}>
        <p className="font-bold text-[11px] text-slate-700">
          {lang === 'ml' ? 'നിങ്ങളുടെ പരസ്യങ്ങൾ ഇവിടെ നൽകാൻ:' : 'Advertise Your Business on this Portal:'}
        </p>
        <p className="text-[11px] text-blue-700 font-mono font-bold">
          Media Desk: +91 99618 78508
        </p>
      </div>
    </aside>
  );
}
