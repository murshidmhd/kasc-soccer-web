import React from 'react';
import { 
  X, 
  Ticket, 
  Clock, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Sparkles, 
  Bell, 
  Share2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import logoUdaya from '../assets/logo_udaya_transparent.png';
import logoKasc from '../assets/logo_kasc.png';
import { tournamentInfo } from '../data/tournamentData';

const TICKET_TIERS = [
  { 
    id: 'gallery', 
    nameMl: 'ഗ്യാലറി സ്റ്റാൻഡ്', 
    nameEn: 'Gallery Stand', 
    price: '₹50', 
    descMl: '360° സ്റ്റേഡിയം കാഴ്ചയും ഇരമ്പുന്ന ഗാലറി ആവേശവും',
    descEn: 'Open general admission with electric stadium atmosphere',
    badge: 'Popular'
  },
  { 
    id: 'chair', 
    nameMl: 'സ്പെഷ്യൽ ചെയർ', 
    nameEn: 'Special Chair', 
    price: '₹100', 
    descMl: 'സൈഡ്‌ലൈൻ മുൻനിര റിസർവ്ഡ് കസേര ഇരിപ്പിടങ്ങൾ',
    descEn: 'Front-row seated reserved chairs with sideline match view',
    badge: 'Seated'
  },
  { 
    id: 'vip', 
    nameMl: 'വി.ഐ.പി പവലിയൻ', 
    nameEn: 'VIP Pavilion', 
    price: '₹250', 
    descMl: 'പ്രത്യേക വി.ഐ.പി ബോക്സ് & കോംപ്ലിമെന്ററി സൗകര്യങ്ങൾ',
    descEn: 'Covered VIP grandstand with complimentary refreshments',
    badge: 'VIP Box'
  },
  { 
    id: 'season', 
    nameMl: 'ഓൾ-മാച്ച് സീസൺ പാസ്സ്', 
    nameEn: '30-Day Season Pass', 
    price: '₹1,500', 
    descMl: 'മുഴുവൻ 30 ദിവസങ്ങളിലെയും മത്സരങ്ങൾ കാണാൻ ഒരൊറ്റ പാസ്സ്',
    descEn: 'Unlimited admission for all 24 clashes and finals night',
    badge: 'Best Value'
  }
];

export default function TicketCounterModal({ isOpen, onClose, lang, isDarkMode }) {
  if (!isOpen) return null;

  const handleShare = () => {
    const text = encodeURIComponent(
      `🎫 *അഖിലേന്ത്യാ സെവൻസ് Season 7 ടിക്കറ്റ് നിരക്കുകൾ*\n` +
      `🏟️ വേദി: പെരുവള്ളൂർ പഞ്ചായത്ത് സ്റ്റേഡിയം\n` +
      `📅 2026 Nov 06 മുതൽ Dec 06 വരെ\n` +
      `• ഗ്യാലറി: ₹50\n` +
      `• ചെയർ: ₹100\n` +
      `• വി.ഐ.പി: ₹250\n` +
      `• സീസൺ പാസ്സ്: ₹1,500\n` +
      `ഓൺലൈൻ ബുക്കിംഗ് ഉടൻ ആരംഭിക്കും! നേരിട്ടുള്ള ടിക്കറ്റുകൾ സ്റ്റേഡിയം കൗണ്ടറിൽ ലഭ്യമാണ്.\n` +
      `വിവരങ്ങൾക്ക്: ${window.location.origin}/`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className={`relative w-full max-w-xl rounded-3xl border shadow-2xl p-5 sm:p-7 overflow-hidden transition-all ${
        isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition active:scale-95 z-10"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center -space-x-1">
            <img src={logoUdaya} alt="Udaya" className="w-8 h-8 rounded-full border border-amber-400 bg-white p-0.5 object-contain" />
            <img src={logoKasc} alt="KASC" className="w-8 h-8 rounded-full border border-blue-500 bg-white p-0.5 object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                Coming Soon
              </span>
              <span className="text-xs text-slate-500 font-bold">Official Announcement</span>
            </div>
          </div>
        </div>

        <h3 className="text-xl sm:text-2xl font-black font-sports uppercase tracking-wider text-slate-950">
          {lang === 'ml' ? 'ഓൺലൈൻ ടിക്കറ്റ് ബുക്കിംഗ്' : 'ONLINE TICKET BOOKING'}
        </h3>
        <p className="text-xs text-slate-500 mt-1 mb-5">
          {lang === 'ml' 
            ? 'ഓൺലൈൻ ടിക്കറ്റ് പേയ്മെന്റ് സൗകര്യം ഉടൻ ആരംഭിക്കും. ഔദ്യോഗിക ടിക്കറ്റ് നിരക്കുകൾ താഴെ നൽകുന്നു.' 
            : 'Online payment and digital booking will open shortly. Check official matchday tier pricing below.'}
        </p>

        {/* Official Ticket Pricing Tiers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
          {TICKET_TIERS.map((tier) => (
            <div
              key={tier.id}
              className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/80 hover:bg-slate-50 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                    {tier.badge}
                  </span>
                  <span className="font-sports font-black text-lg text-emerald-700">
                    {tier.price}
                  </span>
                </div>
                <h4 className="font-sports font-black text-sm text-slate-950">
                  {lang === 'ml' ? tier.nameMl : tier.nameEn}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  {lang === 'ml' ? tier.descMl : tier.descEn}
                </p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[10px] font-bold text-amber-700">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{lang === 'ml' ? 'ഓൺലൈൻ ഉടൻ' : 'Online Soon'}</span>
                </span>
                <span className="text-slate-400 font-normal">Per Match</span>
              </div>
            </div>
          ))}
        </div>

        {/* Committee Official Notice Box */}
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1 mb-5">
          <div className="flex items-center gap-1.5 font-bold text-amber-900">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{lang === 'ml' ? 'കമ്മിറ്റി ഔദ്യോഗിക അറിയിപ്പ്:' : 'Official Organizing Notice:'}</span>
          </div>
          <p className="text-[11px] text-amber-900/90 leading-relaxed pl-5 font-malayalam">
            {lang === 'ml'
              ? 'ഓൺലൈൻ പേയ്മെന്റ് ഗേറ്റ്‌വേ ഉദ്ഘാടനത്തോട് അനുബന്ധിച്ച് നിലവിൽ വരും. ഉദ്ഘാടന ദിവസമായ 2026 നവംബർ 06 മുതൽ പെരുവള്ളൂർ പഞ്ചായത്ത് സ്റ്റേഡിയം മെയിൻ കൗണ്ടറുകളിൽ നേരിട്ട് ടിക്കറ്റുകൾ ലഭ്യമാകും.'
              : 'Direct match tickets will be available at Peruvallur Panjayath Stadium ticket counters starting kickoff day, 06 November 2026. Online booking will be activated closer to the date.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleShare}
            className="py-3 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition active:scale-95"
          >
            <Share2 className="w-4 h-4" />
            <span>{lang === 'ml' ? 'നിരക്കുകൾ പങ്കിടുക' : 'Share Pricing'}</span>
          </button>
          <button
            onClick={onClose}
            className="py-3 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider transition active:scale-95"
          >
            <span>{lang === 'ml' ? 'മനസ്സിലായി (Close)' : 'Got It'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
