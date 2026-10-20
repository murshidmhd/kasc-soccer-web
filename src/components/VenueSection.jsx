import React from 'react';
import { MapPin, Navigation, Car, Users, Lightbulb, Phone } from 'lucide-react';
import { tournamentInfo } from '../data/tournamentData';

export default function VenueSection({ lang, isDarkMode }) {
  return (
    <section id="venue" className="py-12 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className={`rounded-3xl p-6 sm:p-10 border transition-colors shadow-sm ${
        isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Details */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-red-600" />
              <span>{lang === 'ml' ? 'വേദി വിവരങ്ങൾ' : 'OFFICIAL VENUE'}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black font-sports text-slate-950 uppercase">
              {tournamentInfo.venue}
            </h2>

            <p className="text-sm sm:text-base text-blue-700 font-bold font-malayalam">
              {tournamentInfo.venueMalayalam}
            </p>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {lang === 'ml'
                ? 'ഹൈ-മാസ്റ്റ് ഫ്ലഡ് ലൈറ്റുകളുടെ പ്രഭയിൽ ആയിരക്കണക്കിന് ഫുട്ബോൾ പ്രേമികൾക്ക് ഇരിക്കാവുന്ന ഗാലറിയോടെ സജ്ജീകരിച്ചിരിക്കുന്ന സ്റ്റേഡിയം. കുടുംബങ്ങൾക്കും പ്രത്യേക ഇരിപ്പിടങ്ങൾ ഒരുക്കിയിരിക്കുന്നു.'
                : 'Sevens arena under high-mast floodlights with covered grandstands, family enclosures, and extensive parking facilities.'}
            </p>

            {/* Stadium Key Features */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center text-center">
                <Lightbulb className="w-5 h-5 text-amber-500 mb-1" />
                <span className="text-xs font-bold text-slate-900">High-Mast Lights</span>
                <span className="text-[10px] text-slate-500">Night Matches</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center text-center">
                <Users className="w-5 h-5 text-blue-600 mb-1" />
                <span className="text-xs font-bold text-slate-900">Covered Stands</span>
                <span className="text-[10px] text-slate-500">5,000+ Capacity</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center text-center col-span-2 sm:col-span-1">
                <Car className="w-5 h-5 text-emerald-600 mb-1" />
                <span className="text-xs font-bold text-slate-900">Parking Area</span>
                <span className="text-[10px] text-slate-500">Bikes & Cars</span>
              </div>
            </div>

            {/* Map Direction & Hotline Button */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <a
                href={tournamentInfo.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-red-600 hover:bg-red-700 text-white shadow transition"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Google Maps Directions</span>
              </a>

              <a
                href={`tel:${tournamentInfo.mediaContact}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition"
              >
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Desk: {tournamentInfo.mediaContact}</span>
              </a>
            </div>
          </div>

          {/* Right Stadium Card Graphic */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50 p-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center mx-auto text-blue-700">
                <MapPin className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-xl font-black font-sports text-slate-950">
                  PARAMBIL PEEDIKA
                </h4>
                <p className="text-xs text-blue-700 font-bold">
                  Peruvallur, Malappuram Dt., Kerala
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 space-y-1.5 shadow-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Kickoff Time:</span>
                  <span className="font-bold text-amber-700">8:00 PM Sharp</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Halves:</span>
                  <span className="font-bold text-slate-900">25 + 25 Minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tie Breaker:</span>
                  <span className="font-bold text-blue-700">Penalty Shootout</span>
                </div>
              </div>

              <div className="text-[11px] text-emerald-800 font-bold bg-emerald-50 py-1.5 px-3 rounded-lg border border-emerald-200">
                ✓ Sevens Football Association (SFA) Approved Ground
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
