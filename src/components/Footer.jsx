import React from 'react';
import { Heart, Trophy, MapPin, Phone, Shield } from 'lucide-react';
import { tournamentInfo } from '../data/tournamentData';
import logoKerala from '../assets/logo_kerala.png';
import logoKasc from '../assets/logo_kasc.png';
import logoSfa from '../assets/logo_sfa.png';
import logoUdaya from '../assets/logo_udaya_transparent.png';

export default function Footer({ lang, isDarkMode, setActiveTab }) {
  return (
    <footer className="border-t border-navy-700 surface-navy text-white py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Tournament Brand */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <img src={logoUdaya} alt="Udaya" className="w-8 h-8 rounded-full border border-gold bg-white p-0.5 object-contain" />
              <img src={logoKasc} alt="KASC" className="w-8 h-8 rounded-full border border-sky bg-white p-0.5 object-contain" />
              <img src={logoSfa} alt="SFA" className="w-8 h-8 rounded-full border border-navy-700 bg-white object-contain" />
              <span className="text-xl font-black font-sports text-white">
                {tournamentInfo.nameEn} {tournamentInfo.season}
              </span>
            </div>
            <p className="text-xs text-muted-on-navy font-malayalam leading-relaxed">
              {tournamentInfo.organizersMalayalam} സംയുക്തമായി സംഘടിപ്പിക്കുന്ന അഖിലേന്ത്യാ സെവൻസ് ഫുട്ബോൾ മാമാങ്കം.
            </p>
            <p className="text-xs text-muted-on-navy">
              The official portal for live match updates, knockout schedules, and tournament statistics.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-white uppercase tracking-wider font-sports">
              Match Info
            </div>
            <ul className="text-xs space-y-2 text-muted-on-navy">
              <li>
                <button
                  onClick={() => { setActiveTab?.('admin'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-gold hover:text-amber-300 font-bold transition flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Official Scorer Desk (PIN: 7012)</span>
                </button>
              </li>
              <li>
                <a href="#live" onClick={() => setActiveTab?.('live')} className="hover:text-white transition">
                  Live Match Center
                </a>
              </li>
              <li>
                <a href="#fixtures" className="hover:text-white transition">
                  Tournament Schedule
                </a>
              </li>
              <li>
                <a href="#teams" className="hover:text-white transition">
                  Participating Teams
                </a>
              </li>
              <li>
                <a href="#sponsors" className="hover:text-white transition">
                  Sponsors & Partners
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Venue */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-white uppercase tracking-wider font-sports">
              Location & Contact
            </div>
            <div className="text-xs space-y-1 text-muted-on-navy">
              <p className="flex items-center gap-1.5 text-white font-medium">
                <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>Peruvallur Panjayath Stadium</span>
              </p>
              <p className="pl-5 text-[11px] text-muted-on-navy">
                Parambil Peedika, Malappuram
              </p>
              <p className="flex items-center gap-1.5 pt-2 text-white font-medium">
                <Phone className="w-3.5 h-3.5 text-sky shrink-0" />
                <span>Hotline: {tournamentInfo.mediaContact}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Association & Official Sponsors Showcase (Change 1, Rule 2) */}
        <div className="border-t border-navy-700 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={logoSfa} alt="SFA" className="w-10 h-10 rounded-full border border-navy-700 bg-white p-0.5 object-contain shrink-0" />
              <div>
                <span className="text-xs font-bold text-white block">Sevens Football Association (SFA)</span>
                <span className="text-[11px] text-muted-on-navy">Official State Recognition & Sanctioned Tournament</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-muted-on-navy font-bold uppercase text-[10px]">Official Partners:</span>
              <span className="px-2.5 py-1 rounded-xl bg-navy-800 border border-navy-700 text-white font-bold">Fezco Group</span>
              <span className="px-2.5 py-1 rounded-xl bg-navy-800 border border-navy-700 text-white font-bold">Raidhan Kuzhimanthi</span>
              <span className="px-2.5 py-1 rounded-xl bg-navy-800 border border-navy-700 text-white font-bold">Abacus Academy</span>
              <span className="px-2.5 py-1 rounded-xl bg-navy-800 border border-navy-700 text-white font-bold">Life Line Hospital</span>
            </div>
          </div>
        </div>

        {/* Bottom Credits with Murshid's Developer Signature */}
        <div className="border-t border-navy-700 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs gap-3">
          <p className="text-muted-on-navy">
            © 2026 Udaya Parambil Peedika & KASC Peruvallur. All Rights Reserved.
          </p>

          <div className="flex items-center gap-1.5 text-muted-on-navy">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>for Parambil Peedika Sevens by</span>
            <a
              href="https://github.com/murshidmhd"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-sky font-bold ml-1 underline"
            >
              Muhammed Murshid
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
