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
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import logoUdaya from '../assets/logo_udaya_transparent.webp';
import logoKasc from '../assets/logo_kasc.webp';
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
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-[#071433]/90 backdrop-blur-xs animate-fadeIn select-none"
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl border shadow-2xl p-4 sm:p-7 transition-all surface-card"
      >
        {/* Top Header Row with prominent Back Button */}
        <div className="flex items-center justify-between gap-2 pb-2.5 mb-3 border-b border-surface-border dark:border-navy-700">
          <button
            onClick={onClose}
            className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-surface-light dark:bg-navy-800 hover:bg-navy-700 border border-surface-border dark:border-navy-700 text-card-title text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-xs"
            aria-label="Back to page"
          >
            <ArrowLeft className="w-4 h-4 text-gold shrink-0" />
            <span>{lang === 'ml' ? '← തിരികെ' : '← Back'}</span>
          </button>

          <button
            onClick={onClose}
            className="min-w-[40px] min-h-[40px] rounded-xl bg-surface-light dark:bg-navy-800 hover:bg-navy-700 border border-surface-border dark:border-navy-700 text-card-title flex items-center justify-center transition active:scale-95"
            title="Close"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 mb-2.5">
          <div className="flex items-center -space-x-1.5 shrink-0">
            <img src={logoUdaya} alt="Udaya Parambil Peedika" className="w-9 h-9 rounded-full border-2 border-gold bg-white p-0.5 object-contain shadow-sm z-10" />
            <img src={logoKasc} alt="KASC Peruvallur" className="w-7 h-7 rounded-full border border-sky/80 bg-white p-0.5 object-contain opacity-90" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="px-2.5 py-0.5 rounded-full btn-gold text-[10px] font-black uppercase tracking-wider">
                🏟️ നേരിട്ടുള്ള കൗണ്ടർ ടിക്കറ്റ്
              </span>
              <span className="text-[11px] text-card-muted font-bold">UDAYA & KASC Peruvallur</span>
            </div>
          </div>
        </div>

        <h3 className="text-lg sm:text-2xl font-black font-sports uppercase tracking-wider text-card-title">
          {lang === 'ml' ? 'ടിക്കറ്റ് നിരക്കുകളും വിവരങ്ങളും' : 'OFFICIAL TICKET RATES'}
        </h3>
        <p className="text-xs text-card-muted mt-1 mb-4 leading-relaxed">
          {lang === 'ml' 
            ? 'മത്സര ടിക്കറ്റുകൾ പെരുവള്ളൂർ പഞ്ചായത്ത് സ്റ്റേഡിയം കൗണ്ടറിൽ നേരിട്ട് ലഭ്യമാണ്. ഓൺലൈൻ പേയ്മെന്റ് ഗേറ്റ്‌വേ പരീക്ഷണ ഘട്ടത്തിലാണ്.' 
            : 'Match tickets will be sold directly at the Peruvallur Panjayath Stadium counters. Online digital payment is under test mode.'}
        </p>

        {/* Official Ticket Pricing Tiers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
          {TICKET_TIERS.map((tier) => (
            <div
              key={tier.id}
              className="p-3.5 rounded-2xl border border-surface-border dark:border-navy-700 surface-card-subtle transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 dark:bg-navy-700 text-royal dark:text-sky border border-blue-200 dark:border-navy-600">
                    {tier.badge}
                  </span>
                  <span className="font-sports font-black text-lg text-emerald-600 dark:text-emerald-400">
                    {tier.price}
                  </span>
                </div>
                <h4 className="font-sports font-black text-sm text-card-title">
                  {lang === 'ml' ? tier.nameMl : tier.nameEn}
                </h4>
                <p className="text-[11px] text-card-muted mt-0.5 leading-snug">
                  {lang === 'ml' ? tier.descMl : tier.descEn}
                </p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-surface-border dark:border-navy-700 flex items-center justify-between text-[10px] font-bold text-amber-700 dark:text-amber-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{lang === 'ml' ? 'കൗണ്ടർ വിൽപന' : 'Direct Counter'}</span>
                </span>
                <span className="text-card-muted font-normal">Per Match</span>
              </div>
            </div>
          ))}
        </div>

        {/* Committee Official Notice Box */}
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-950 dark:text-amber-200 space-y-1 mb-4">
          <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-300">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{lang === 'ml' ? 'കമ്മിറ്റി ഔദ്യോഗിക അറിയിപ്പ്:' : 'Official Organizing Notice:'}</span>
          </div>
          <p className="text-[11px] leading-relaxed pl-5 font-malayalam text-card-title">
            {lang === 'ml'
              ? 'എല്ലാ ദിവസങ്ങളിലെയും മത്സര ടിക്കറ്റുകൾ പെരുവള്ളൂർ പഞ്ചായത്ത് സ്റ്റേഡിയം ബോക്സ് ഓഫീസ് കൗണ്ടറിൽ നേരിട്ട് ലഭിക്കും. ഓൺലൈൻ പേയ്മെന്റ് ഗേറ്റ്‌വേ 50/50 പരീക്ഷണാർത്ഥം മാത്രമാണ്.'
              : 'Direct match tickets will be available at Peruvallur Panjayath Stadium box office counters. Digital online gateway is in simple test mode.'}
          </p>
        </div>

        {/* Action Buttons with Back button */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleShare}
            className="min-h-[44px] py-2.5 px-3 rounded-2xl btn-royal text-white font-black text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 transition active:scale-95"
          >
            <Share2 className="w-4 h-4" />
            <span>{lang === 'ml' ? 'നിരക്കുകൾ പങ്കിടുക' : 'Share Pricing'}</span>
          </button>
          <button
            onClick={onClose}
            className="min-h-[44px] py-2.5 px-3 rounded-2xl bg-surface-light dark:bg-navy-800 hover:bg-navy-700 border border-surface-border dark:border-navy-700 text-card-title font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-gold" />
            <span>{lang === 'ml' ? 'തിരികെ പേജിലേക്ക്' : 'Back to Match Center'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
