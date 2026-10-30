import React, { useState } from 'react';
import { X, Sparkles, Share2, Download, Check, Shield, Trophy, QrCode } from 'lucide-react';
import confetti from 'canvas-confetti';
import logoUdaya from '../assets/logo_udaya_transparent.png';
import logoKasc from '../assets/logo_kasc.png';

export default function VipMatchPassModal({ isOpen, onClose, lang }) {
  const [fanName, setFanName] = useState('');
  const [selectedClub, setSelectedClub] = useState('UDAYA PARAMBIL PEEDIKA');
  const [isGenerated, setIsGenerated] = useState(false);
  const [passNumber, setPassNumber] = useState('KASC-VIP-7782');

  if (!isOpen) return null;

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!fanName.trim()) return;
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setPassNumber(`KASC-VIP-${randomNum}`);
    setIsGenerated(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const sharePass = () => {
    const text = encodeURIComponent(
      `🎫 *എന്റെ ഒഫീഷ്യൽ VIP മാച്ച് പാസ്സ് തയ്യാർ!*\n` +
      `👤 ഫാൻ: *${fanName}*\n` +
      `🔥 സപ്പോർട്ടിംഗ് ക്ലബ്ബ്: *${selectedClub}*\n` +
      `⚽ *അഖിലേന്ത്യാ സെവൻസ് Season 7* (UDAYA & KASC)\n` +
      `📅 2026 Nov 06 • പെരുവള്ളൂർ പഞ്ചായത്ത് സ്റ്റേഡിയം\n` +
      `നിങ്ങളുടെയും ഫ്രീ VIP പാസ്സ് സ്വന്തമാക്കൂ: ${window.location.origin}/`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/40 text-white rounded-3xl shadow-2xl p-5 sm:p-7 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        {!isGenerated ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1 rounded-md bg-amber-400 text-slate-950">
                <Sparkles className="w-4 h-4" />
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                Official Digital Identity
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-sports uppercase tracking-wider text-white">
              {lang === 'ml' ? 'വി.ഐ.പി മാച്ച് പാസ്സ് ജനറേറ്റർ' : 'VIP MATCHDAY FAN PASS'}
            </h3>
            <p className="text-xs text-slate-300 mt-1 mb-5">
              {lang === 'ml' 
                ? 'നിങ്ങളുടെ പേര് നൽകി ടൂർണ്ണമെന്റിന്റെ ഒഫീഷ്യൽ വി.ഐ.പി ഡിജിറ്റൽ പാസ്സ് സ്വന്തമാക്കൂ (സൗജന്യം)' 
                : 'Generate your personalized tournament VIP digital pass to share on WhatsApp status.'}
            </p>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  {lang === 'ml' ? 'നിങ്ങളുടെ പേര് (Your Name)' : 'Your Name'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={lang === 'ml' ? 'ഉദാ: മുഹമ്മദ് മുർഷിദ് / ബാഷീർ മാസ്റ്റർ' : 'e.g. Muhammed Murshid'}
                  value={fanName}
                  onChange={(e) => setFanName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  {lang === 'ml' ? 'സപ്പോർട്ട് ചെയ്യുന്ന ക്ലബ്ബ്' : 'Select Supported Club'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedClub('UDAYA PARAMBIL PEEDIKA')}
                    className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      selectedClub === 'UDAYA PARAMBIL PEEDIKA'
                        ? 'bg-purple-800 border-purple-500 text-white shadow-xs font-black'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    <span>💜 UDAYA</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedClub('NEW MALAYA MALABAR FC')}
                    className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      selectedClub === 'NEW MALAYA MALABAR FC'
                        ? 'bg-zinc-800 border-amber-400 text-white shadow-xs font-black'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    <span>🖤 NEW MALAYA</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg transition active:scale-98 flex items-center justify-center gap-2 mt-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{lang === 'ml' ? 'വി.ഐ.പി പാസ്സ് നിർമ്മിക്കുക' : 'Generate VIP Pass Now'}</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-4 animate-fadeIn">
            {/* The Holographic VIP Pass Card */}
            <div className="relative rounded-3xl p-5 border-2 border-amber-400/80 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white shadow-2xl overflow-hidden select-none">
              {/* Background watermark */}
              <div className="absolute -right-6 -bottom-6 w-36 h-36 rounded-full bg-amber-400/10 pointer-events-none blur-xl"></div>

              {/* Pass Header */}
              <div className="flex items-center justify-between border-b border-white/15 pb-3">
                <div className="flex items-center gap-2">
                  <img src={logoUdaya} alt="Udaya" className="w-8 h-8 rounded-full border border-amber-400 bg-white p-0.5 object-contain" />
                  <img src={logoKasc} alt="KASC" className="w-8 h-8 rounded-full border border-blue-500 bg-white p-0.5 object-contain" />
                  <div className="leading-tight">
                    <span className="font-sports font-black text-sm block tracking-wide">AKHILENDHYA SEVENS S7</span>
                    <span className="text-[9px] text-amber-300">Udaya & KASC Peruvallur</span>
                  </div>
                </div>
                <div className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow-xs">
                  VIP ACCESS
                </div>
              </div>

              {/* Pass Holder Details */}
              <div className="py-4 space-y-3">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">VIP Pass Holder</span>
                  <h4 className="text-2xl font-black font-sports text-white tracking-wide uppercase mt-0.5">
                    {fanName}
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                    <span className="text-[9px] text-slate-400 block font-bold">Loyal Supporter</span>
                    <span className="font-bold text-amber-300 truncate block mt-0.5">{selectedClub}</span>
                  </div>
                  <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                    <span className="text-[9px] text-slate-400 block font-bold">Match Pass ID</span>
                    <span className="font-mono font-bold text-emerald-400 block mt-0.5">{passNumber}</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-300 space-y-0.5 pt-1">
                  <div className="flex items-center justify-between">
                    <span>🏟️ Venue:</span>
                    <strong className="text-white">Peruvallur Panjayath Stadium</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>📅 Kickoff:</span>
                    <strong className="text-amber-400">06 Nov 2026 • 8:00 PM IST</strong>
                  </div>
                </div>
              </div>

              {/* Pass Barcode Footer */}
              <div className="border-t border-dashed border-white/20 pt-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
                  <QrCode className="w-5 h-5 text-amber-300" />
                  <span>VERIFIED • SFA ALL INDIA SEVENS</span>
                </div>
                <span className="text-[10px] font-black text-amber-400 uppercase">
                  GATE 1 ADMISSION
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={sharePass}
                className="py-3 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition active:scale-95"
              >
                <Share2 className="w-4 h-4" />
                <span>WhatsApp Status</span>
              </button>
              <button
                onClick={() => setIsGenerated(false)}
                className="py-3 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider border border-slate-700 flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                <span>പുതിയ പാസ്സ്</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
