import React, { useRef } from 'react';
import { 
  MapPin, 
  Phone, 
  MessageCircle, 
  Navigation, 
  Calendar,
  Shield,
  Trophy,
  Flame
} from 'lucide-react';
import logoKasc from '../assets/logo_kasc.png';
import logoUdaya from '../assets/logo_udaya_transparent.png';
import logoSfa from '../assets/logo_sfa.png';
import { 
  SHOW_SFA_CLAIMS, 
  SHOW_SPONSORS, 
  COMMITTEE_PHONE, 
  COMMITTEE_WHATSAPP, 
  COMMITTEE_INSTAGRAM, 
  COMMITTEE_YOUTUBE, 
  DEVELOPER_CREDIT, 
  SPONSORS_DATA,
  STADIUM_MAPS_URL,
  ADMIN_SHORTCUT_ENABLED
} from '../config/siteConfig';

function InstagramIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

function LinkedinIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect width="4" height="12" x="2" y="9"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  );
}

function YoutubeIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
      <polygon points="10 15 15 12 10 9 10 15" fill="currentColor"/>
    </svg>
  );
}

export default function Footer({ lang, isDarkMode, setActiveTab }) {
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef(null);

  const handleCopyrightTap = () => {
    // Only active when shortcut enabled AND admin desk is enabled in this build
    // (if desk is disabled in production, shortcut does nothing per Task 2 Rule 10)
    if (!ADMIN_SHORTCUT_ENABLED || !import.meta.env.DEV) {
      return;
    }

    tapCountRef.current += 1;

    if (tapTimerRef.current) {
      clearTimeout(tapTimerRef.current);
    }

    if (tapCountRef.current >= 5) {
      tapCountRef.current = 0;
      if (setActiveTab) {
        setActiveTab('admin');
      }
      window.location.hash = '#admin';
      return;
    }

    tapTimerRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, 3000);
  };

  const quickLinks = [
    { id: 'live', label: lang === 'ml' ? 'ലൈവ് മാച്ച്' : 'Live Match', icon: Flame },
    { id: 'fixtures', label: lang === 'ml' ? 'മത്സരക്രമം' : 'Fixtures', icon: Calendar },
    { id: 'teams', label: lang === 'ml' ? '24 ക്ലബ്ബുകൾ' : 'Clubs', icon: Shield },
    { id: 'stats', label: lang === 'ml' ? 'ടോപ്പ് സ്കോറർ' : 'Stats', icon: Trophy }
  ];

  return (
    <footer 
      className="border-t border-navy-700 surface-navy text-white pt-10 px-4 sm:px-6 transition-colors"
      style={{ paddingBottom: 'max(6rem, calc(env(safe-area-inset-bottom, 0px) + 5rem))' }}
    >
      <div className="max-w-4xl mx-auto space-y-8 select-none">
        {/* 1. Header Row: Two Club Logos (40px white circles) & Organizer Title (Rule 8) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-700/80 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center -space-x-2">
              <div className="w-10 h-10 rounded-full bg-white p-1 border-2 border-amber-400 shadow-md flex items-center justify-center shrink-0">
                <img 
                  src={logoUdaya} 
                  alt="Udaya Parambil Peedika" 
                  width={36} 
                  height={36} 
                  loading="lazy" 
                  className="w-full h-full object-contain rounded-full" 
                />
              </div>
              <div className="w-10 h-10 rounded-full bg-white p-1 border-2 border-sky shadow-md flex items-center justify-center shrink-0">
                <img 
                  src={logoKasc} 
                  alt="KASC Peruvallur" 
                  width={36} 
                  height={36} 
                  loading="lazy" 
                  className="w-full h-full object-contain rounded-full" 
                />
              </div>
            </div>

            <div className="min-w-0">
              <h3 className="font-sports font-black text-sm sm:text-base text-white tracking-wide leading-tight line-clamp-1">
                UDAYA PARAMBIL PEEDIKA & KASC PERUVALLUR
              </h3>
              <p className="text-xs text-gold font-sports font-bold tracking-wider uppercase mt-0.5">
                All India Sevens Football Tournament • Season 7
              </p>
            </div>
          </div>

          {/* SFA Logo & Claims (Guarded by SHOW_SFA_CLAIMS = false per Rule 3) */}
          {SHOW_SFA_CLAIMS && (
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-navy-800 border border-navy-700 shrink-0">
              <img 
                src={logoSfa} 
                alt="SFA" 
                width={32} 
                height={32} 
                loading="lazy" 
                className="w-8 h-8 rounded-full bg-white p-0.5 object-contain" 
              />
              <div className="text-[11px] leading-tight">
                <span className="font-bold text-white block">Sevens Football Association (SFA)</span>
                <span className="text-navy-muted">Official State Recognition & Sanctioned Tournament</span>
              </div>
            </div>
          )}
        </div>

        {/* 2. De-duplicated Malayalam About Sentence (Rule 5: needs Malayalam proofreading) */}
        {/* needs Malayalam proofreading: repetition of 'സംയുക്തമായി സംഘടിപ്പിക്കുന്ന' removed */}
        <p className="text-xs text-navy-muted font-malayalam leading-relaxed max-w-2xl">
          {lang === 'ml'
            ? 'KASC പെരുവള്ളൂരും ഉദയ പറമ്പിൽ പീടികയും സംയുക്തമായി സംഘടിപ്പിക്കുന്ന അഖിലേന്ത്യാ സെവൻസ് ഫുട്ബോൾ മാമാങ്കം.'
            : 'Organized jointly by KASC Peruvallur and Udaya Parambil Peedika for the Akhilenthya Sevens Football Championship Season 7.'}
        </p>

        {/* 3. Quick Links 2-Column Grid of Buttons >= 44px (Rule 8) */}
        <div className="space-y-2">
          <span className="text-[11px] font-sports font-black tracking-wider uppercase text-gold block">
            {lang === 'ml' ? 'പെട്ടെന്നുള്ള ലിങ്കുകൾ' : 'QUICK ACCESS'}
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    if (setActiveTab) setActiveTab(link.id);
                    window.location.hash = link.id;
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="min-h-[44px] px-3 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 border border-navy-700 text-white font-sports font-bold text-xs flex items-center justify-center gap-2 transition active:scale-95 shadow-2xs"
                >
                  <Icon className="w-3.5 h-3.5 text-sky shrink-0" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Directions & Stadium Info (Rule 8) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-navy-800/90 border border-navy-700">
          <div className="flex items-center gap-2.5 text-xs text-navy-muted min-w-0">
            <MapPin className="w-4 h-4 text-gold shrink-0" />
            <div className="truncate">
              <span className="text-white font-bold block truncate">Peruvallur Panjayath Stadium</span>
              <span className="text-[11px] text-navy-muted">Parambil Peedika, Malappuram • 8:00 PM IST</span>
            </div>
          </div>

          <button
            onClick={() => window.open(STADIUM_MAPS_URL, '_blank', 'noopener,noreferrer')}
            className="min-h-[44px] px-4 py-2 rounded-xl btn-royal text-white font-bold text-xs uppercase flex items-center justify-center gap-1.5 transition active:scale-95 shrink-0 shadow-xs"
          >
            <Navigation className="w-3.5 h-3.5 shrink-0" />
            <span>{lang === 'ml' ? 'റൂട്ട് കാണുക (GPS)' : 'Get Directions'}</span>
          </button>
        </div>

        {/* 5. Contact & Socials Row (Rule 6 & Rule 8: Hotline shown only if COMMITTEE_PHONE is set) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-navy-700/60">
          <div className="flex items-center gap-4 text-xs">
            {COMMITTEE_PHONE && (
              <a 
                href={`tel:${COMMITTEE_PHONE.replace(/\s+/g, '')}`}
                className="flex items-center gap-1.5 text-white hover:text-gold transition font-mono font-medium"
                aria-label={`Call hotline ${COMMITTEE_PHONE}`}
              >
                <Phone className="w-3.5 h-3.5 text-sky shrink-0" />
                <span>Hotline: {COMMITTEE_PHONE}</span>
              </a>
            )}
          </div>

          {/* Social Channels (WhatsApp, Instagram, YouTube) */}
          <div className="flex items-center gap-2">
            {COMMITTEE_WHATSAPP && (
              <a
                href={COMMITTEE_WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] min-w-[44px] px-3 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
                aria-label="Contact Tournament Committee on WhatsApp"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
            )}

            {COMMITTEE_INSTAGRAM && (
              <a
                href={COMMITTEE_INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 border border-navy-700 text-white flex items-center justify-center transition active:scale-95"
                aria-label="Tournament Instagram Page"
              >
                <InstagramIcon className="w-4 h-4 text-pink-400" />
              </a>
            )}

            {COMMITTEE_YOUTUBE && (
              <a
                href={COMMITTEE_YOUTUBE}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 border border-navy-700 text-white flex items-center justify-center transition active:scale-95"
                aria-label="Tournament YouTube Channel"
              >
                <YoutubeIcon className="w-4 h-4 text-red-500" />
              </a>
            )}
          </div>
        </div>

        {/* 6. Sponsor Strip (Rule 4 & Rule 8: SHOW_SPONSORS = true, horizontal scroll-snap with soft edge) */}
        {SHOW_SPONSORS && (
          <div className="space-y-2 pt-2 border-t border-navy-700/60">
            <span className="text-[10px] font-sports font-black tracking-widest uppercase text-navy-muted block">
              {lang === 'ml' ? 'സ്പോൺസർമാർ & പങ്കാളികൾ' : 'OFFICIAL TOURNAMENT SPONSORS'}
            </span>
            <div className="relative">
              <div className="flex items-center gap-2 overflow-x-auto scroll-smooth py-1 px-0.5 no-scrollbar snap-x snap-mandatory">
                {SPONSORS_DATA.map((sp, idx) => (
                  <div
                    key={idx}
                    className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-navy-800 border border-navy-700 text-white font-sports font-bold text-xs whitespace-nowrap snap-start flex items-center gap-1.5 shadow-2xs shrink-0"
                  >
                    {sp.logoUrl ? (
                      <img 
                        src={sp.logoUrl} 
                        alt={sp.name} 
                        width={20} 
                        height={20} 
                        loading="lazy" 
                        className="w-5 h-5 object-contain" 
                      />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-gold shrink-0" />
                    )}
                    <span>{sp.name}</span>
                  </div>
                ))}
              </div>
              {/* Soft fade overlay on right edge (Rule 8) */}
              <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-navy-900 to-transparent" />
            </div>
          </div>
        )}

        {/* 7. Copyright & Developer Credit (Rule 7: Built by Murshid with 44px tap target icons) */}
        <div className="pt-6 border-t border-navy-700/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-navy-muted">
          <p 
            onClick={handleCopyrightTap}
            className="text-[11px] sm:text-xs text-center sm:text-left leading-relaxed select-none touch-manipulation cursor-default"
          >
            © 2026 Udaya Parambil Peedika & KASC Peruvallur. All Rights Reserved.
          </p>

          {DEVELOPER_CREDIT?.show && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[12px] text-navy-muted font-medium">
                Built by <strong className="text-white font-semibold">{DEVELOPER_CREDIT.name}</strong>
              </span>

              <div className="flex items-center gap-1">
                {DEVELOPER_CREDIT.linkedin && (
                  <a
                    href={DEVELOPER_CREDIT.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-sky hover:text-white transition flex items-center justify-center active:scale-95"
                    aria-label="Murshid's LinkedIn Profile"
                  >
                    <LinkedinIcon className="w-4 h-4" />
                  </a>
                )}

                {DEVELOPER_CREDIT.instagram && (
                  <a
                    href={DEVELOPER_CREDIT.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-pink-400 hover:text-white transition flex items-center justify-center active:scale-95"
                    aria-label="Murshid's Instagram Profile"
                  >
                    <InstagramIcon className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
