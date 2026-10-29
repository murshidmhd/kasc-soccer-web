import React, { useState } from 'react';
import { 
  Trophy, 
  Flag, 
  Calendar, 
  MapPin, 
  Users, 
  Award, 
  Sparkles, 
  Eye, 
  X, 
  Share2, 
  ChevronRight, 
  CheckCircle2, 
  Image as ImageIcon 
} from 'lucide-react';
import { promoData } from '../data/tournamentData';

// Import local promo & marathon images
import countdown8 from '../assets/promo/countdown_8days.jpg';
import countdown9 from '../assets/promo/countdown_9days.jpg';
import countdown10 from '../assets/promo/countdown_10days.jpg';
import countdown11 from '../assets/promo/countdown_11days.jpg';
import winner1st from '../assets/promo/marathon_winner_1st.jpg';
import winner2nd from '../assets/promo/marathon_winner_2nd.jpg';
import winner3rd from '../assets/promo/marathon_winner_3rd.jpg';
import flagoffImg from '../assets/promo/marathon_flagoff.jpg';
import runnersCrowdImg from '../assets/promo/marathon_runners_crowd.jpg';
import marathonPosterImg from '../assets/promo/marathon_official_poster.jpg';

const imageMap = {
  'countdown_8days.jpg': countdown8,
  'countdown_9days.jpg': countdown9,
  'countdown_10days.jpg': countdown10,
  'countdown_11days.jpg': countdown11,
  'marathon_winner_1st.jpg': winner1st,
  'marathon_winner_2nd.jpg': winner2nd,
  'marathon_winner_3rd.jpg': winner3rd,
  'marathon_flagoff.jpg': flagoffImg,
  'marathon_runners_crowd.jpg': runnersCrowdImg,
  'marathon_official_poster.jpg': marathonPosterImg
};

export default function PromoEventsSection({ lang, isDarkMode }) {
  const [activeSubTab, setActiveSubTab] = useState('marathon'); // 'marathon' | 'countdown'
  const [selectedImage, setSelectedImage] = useState(null);

  const { marathon, countdownPosters } = promoData;

  const handleShare = (title) => {
    if (navigator.share) {
      navigator.share({
        title: `${title} - SFA All India Sevens`,
        text: `Check out the official tournament updates: ${title}`,
        url: window.location.href
      }).catch(() => {});
    }
  };

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className={`rounded-3xl p-5 sm:p-7 border transition-all ${
        isDarkMode 
          ? 'bg-slate-900 border-slate-800 text-white' 
          : 'bg-white border-slate-200 text-slate-900 shadow-xs'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] sm:text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                <span>{lang === 'ml' ? 'പ്രചാരണ വിശേഷങ്ങൾ' : 'TOURNAMENT BUZZ'}</span>
              </span>
              <span className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-md ${
                isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
              }`}>
                Parambil Peedika
              </span>
            </div>
            <h2 className={`font-black uppercase tracking-tight ${
              lang === 'ml' ? 'font-malayalam text-xl sm:text-3xl' : 'font-sports text-2xl sm:text-3xl'
            }`}>
              {lang === 'ml' ? 'മിനി മാരത്തോൺ & ഔദ്യോഗിക പോസ്റ്ററുകൾ' : 'PROMOTIONS & MINI MARATHON 2026'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl font-malayalam">
              {lang === 'ml' 
                ? 'ഉദയ പറമ്പിൽ പീടിക സംഘടിപ്പിച്ച 8 കി.മീ മിനി മാരത്തോൺ ഫോട്ടോകളും കൗണ്ട്ഡൗൺ പോസ്റ്ററുകളും' 
                : 'Highlights from the official 8 KM Mini Marathon and the countdown series organized by Udaya Parambil Peedika.'}
            </p>
          </div>

          {/* Sub-tab Pill Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200 self-start sm:self-center">
            <button
              onClick={() => setActiveSubTab('marathon')}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 ${
                activeSubTab === 'marathon'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-300" />
              <span>{lang === 'ml' ? 'മിനി മാരത്തോൺ (8 KM)' : 'Mini Marathon (8 KM)'}</span>
            </button>
            <button
              onClick={() => setActiveSubTab('countdown')}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 ${
                activeSubTab === 'countdown'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-red-300" />
              <span>{lang === 'ml' ? 'കൗണ്ട്ഡൗൺ പോസ്റ്റർ' : 'Countdown Posters'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: MINI MARATHON 8 KM HIGHLIGHTS */}
      {activeSubTab === 'marathon' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Key Event Overview Card */}
          <div className={`rounded-3xl p-5 sm:p-6 border overflow-hidden relative ${
            isDarkMode 
              ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/40 border-slate-800' 
              : 'bg-gradient-to-br from-amber-50/60 via-white to-blue-50/40 border-slate-200 shadow-xs'
          }`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-900 font-black text-[11px] uppercase tracking-wide border border-blue-200">
                    🏁 8 KM Distance Run
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[11px] border border-emerald-200">
                    Free Entry Completed
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-[11px] border border-amber-200">
                    ₹6,000 Total Prizes
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black font-sports text-slate-950 uppercase leading-snug">
                  {lang === 'ml' ? marathon.titleMl : marathon.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {lang === 'ml' 
                    ? '2026 ഒക്ടോബർ 25 ഞായറാഴ്ച രാവിലെ പറമ്പിൽ പീടിക പഞ്ചായത്ത് സ്റ്റേഡിയത്തിൽ നിന്ന് ആരംഭിച്ച 8 കിലോമീറ്റർ മിനി മാരത്തോൺ പെരുവള്ളൂർ ഗ്രാമ പഞ്ചായത്ത് പ്രസിഡന്റ് പി. പി. സുനീൽ ഫ്ലാഗ് ഓഫ് ചെയ്തു. അബാക്കസ് അക്കാദമി പറമ്പിൽ പീടിക & പുത്തൂർ പള്ളിക്കൽ നൽകിയ ക്യാഷ് പ്രൈസുകൾ വിജയികൾക്ക് വിതരണം ചെയ്തു.'
                    : 'The grand promotional 8 km mini marathon was officially flagged off on Sunday, 25 October 2026 from Peruvallur Panjayath Stadium by Grama Panchayath President P. P. Suneel. Elite athletes from Malappuram, Kozhikode, and Palakkad competed.'}
                </p>

                {/* Event Facts Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                  <div className={`p-2.5 rounded-xl border ${isDarkMode ? 'bg-slate-800/70 border-slate-700' : 'bg-white border-slate-200 shadow-xs'}`}>
                    <span className="text-[10px] text-slate-500 font-medium block">Date & Day</span>
                    <span className="text-xs font-bold text-slate-900 font-sports">Sun, Oct 25, 2026</span>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${isDarkMode ? 'bg-slate-800/70 border-slate-700' : 'bg-white border-slate-200 shadow-xs'}`}>
                    <span className="text-[10px] text-slate-500 font-medium block">Flag-off Time</span>
                    <span className="text-xs font-bold text-slate-900 font-sports">6:30 AM IST</span>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${isDarkMode ? 'bg-slate-800/70 border-slate-700' : 'bg-white border-slate-200 shadow-xs'}`}>
                    <span className="text-[10px] text-slate-500 font-medium block">Flagged Off By</span>
                    <span className="text-xs font-bold text-blue-700 font-sports">P. P. Suneel (President)</span>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${isDarkMode ? 'bg-slate-800/70 border-slate-700' : 'bg-white border-slate-200 shadow-xs'}`}>
                    <span className="text-[10px] text-slate-500 font-medium block">Prize Sponsor</span>
                    <span className="text-xs font-bold text-amber-700 font-sports">Abacus Academy</span>
                  </div>
                </div>
              </div>

              {/* Official Marathon Notice Banner Thumbnail */}
              <div className="lg:col-span-4 flex justify-center">
                <div 
                  onClick={() => setSelectedImage({
                    src: marathonPosterImg,
                    title: lang === 'ml' ? 'മിനി മാരത്തോൺ അറിയിപ്പ് പോസ്റ്റർ' : 'Official Marathon Announcement Poster',
                    subtitle: 'Organized by UDAYA Parambil Peedika - Prize Sponsor: Abacus Academy'
                  })}
                  className="relative group cursor-pointer rounded-2xl overflow-hidden border-2 border-amber-300 shadow-md max-w-[220px] transition-transform hover:scale-102"
                >
                  <img 
                    src={marathonPosterImg} 
                    alt="Official Marathon Announcement Poster"
                    className="w-full h-auto object-cover" 
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition text-white text-xs font-bold gap-1">
                    <Eye className="w-4 h-4" />
                    <span>View Full Poster</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Podium Winners Showcase */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black font-sports uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span>{lang === 'ml' ? 'മാരത്തോൺ വിജയികൾ (Winners Podium)' : 'Mini Marathon 8KM Champions'}</span>
              </h3>
              <span className="text-xs font-bold text-slate-500">
                Prize Money Sponsored by Abacus Academy
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {marathon.prizes.map((p) => {
                const img = imageMap[p.filename];
                const isFirst = p.place === 1;
                const isSecond = p.place === 2;

                return (
                  <div
                    key={p.place}
                    className={`rounded-2xl border overflow-hidden transition-all duration-200 group flex flex-col justify-between ${
                      isFirst
                        ? 'border-amber-400 bg-gradient-to-b from-amber-50/80 via-white to-amber-50/30 shadow-md'
                        : isSecond
                        ? 'border-slate-300 bg-white shadow-xs'
                        : 'border-amber-200/80 bg-white shadow-xs'
                    }`}
                  >
                    {/* Top Prize Badge */}
                    <div className={`p-3 flex items-center justify-between border-b ${
                      isFirst ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-100 text-slate-800 border-slate-200'
                    }`}>
                      <div className="flex items-center gap-1.5">
                        <Award className="w-4 h-4" />
                        <span className="font-sports font-black text-xs uppercase tracking-wide">
                          {p.title}
                        </span>
                      </div>
                      <span className="text-xs font-black px-2 py-0.5 rounded-full bg-white/90 text-slate-950 shadow-xs">
                        {p.cash}
                      </span>
                    </div>

                    {/* Winner Photo with Click to Lightbox */}
                    <div 
                      onClick={() => setSelectedImage({
                        src: img,
                        title: `${p.title}: ${p.winner}`,
                        subtitle: `${p.cash} Cash Award & Trophy Presentation by Committee`
                      })}
                      className="relative overflow-hidden cursor-pointer bg-slate-100 aspect-3/4 max-h-[300px]"
                    >
                      <img
                        src={img}
                        alt={p.winner}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-90"></div>
                      <div className="absolute bottom-2 inset-x-2 text-white">
                        <span className="inline-block text-[10px] font-black px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs mb-1">
                          {p.badge}
                        </span>
                        <h4 className="font-black text-base sm:text-lg leading-tight drop-shadow-sm font-sports">
                          {p.winner}
                        </h4>
                        <p className="text-xs text-amber-300 font-malayalam font-bold">
                          {p.winnerMl}
                        </p>
                      </div>
                      <div className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition">
                        <Eye className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Card Footer details */}
                    <div className="p-3 text-center bg-slate-50 border-t border-slate-100">
                      <p className="text-[11px] text-slate-600 font-medium">
                        {lang === 'ml' 
                          ? `${p.titleMl} ട്രോഫിയും ${p.cash} ക്യാഷ് അവാർഡും നൽകി ആദരിച്ചു.` 
                          : `Honored with ${p.title} trophy, medal and ${p.cash} prize.`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Marathon Photo Gallery: Flag-off & Crowd Moments */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black font-sports uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-600" />
                <span>{lang === 'ml' ? 'മാരത്തോൺ നിമിഷങ്ങൾ (Event Moments)' : 'Ceremony & Action Photos'}</span>
              </h3>
              <span className="text-xs text-slate-500 font-medium">Tap photo to enlarge</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {marathon.gallery.map((item) => {
                const img = imageMap[item.filename];
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedImage({
                      src: img,
                      title: item.title,
                      subtitle: item.desc
                    })}
                    className={`rounded-2xl border overflow-hidden cursor-pointer group transition-all duration-200 shadow-xs hover:shadow-md ${
                      isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                      <img
                        src={img}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-bold backdrop-blur-xs">
                        {item.tag}
                      </div>
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition text-white">
                        <div className="p-2 rounded-full bg-white/20 backdrop-blur-xs">
                          <Eye className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                    <div className="p-3.5 space-y-1">
                      <h4 className="font-bold text-sm text-slate-900 leading-snug">
                        {lang === 'ml' ? item.titleMl : item.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {lang === 'ml' ? item.descMl : item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Prize Sponsor Recognition Banner */}
          <div className={`rounded-2xl p-4 sm:p-5 border flex flex-col sm:flex-row items-center justify-between gap-4 ${
            isDarkMode 
              ? 'bg-blue-950/40 border-blue-900 text-white' 
              : 'bg-blue-50/80 border-blue-200 text-slate-900'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs font-black font-sports text-lg">
                AA
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-blue-700 tracking-wider">
                  Official Cash Prize Sponsor
                </span>
                <h4 className="text-base sm:text-lg font-black font-sports text-slate-950">
                  ABACUS ACADEMY
                </h4>
                <p className="text-xs text-slate-600 font-medium">
                  {lang === 'ml' 
                    ? 'പറമ്പിൽ പീടിക & പുത്തൂർ പള്ളിക്കൽ • സെവൻസ് മിനി മാരത്തോൺ ക്യാഷ് പ്രൈസ് സ്പോൺസർമാർ' 
                    : 'Parambil Peedika & Puthur Pallikkal - Supporting Youth Sports & Education'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-white text-blue-900 border border-blue-200 text-xs font-black shadow-xs">
                Total ₹6,000 Cash Awarded
              </span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: COUNTDOWN POSTERS SERIES */}
      {activeSubTab === 'countdown' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Intro text */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black font-sports uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-red-600" />
                <span>{lang === 'ml' ? 'ഔദ്യോഗിക കൗണ്ട്ഡൗൺ പോസ്റ്ററുകൾ' : 'Official Countdown Posters Gallery'}</span>
              </h3>
              <p className="text-xs text-slate-500">
                Exclusive visual campaign celebrating the kickoff to Season 7
              </p>
            </div>
          </div>

          {/* 4 Countdown Posters Grid (8, 9, 10, 11 Days) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {countdownPosters.map((poster) => {
              const img = imageMap[poster.filename];
              return (
                <div
                  key={poster.days}
                  onClick={() => setSelectedImage({
                    src: img,
                    title: poster.title,
                    subtitle: `${poster.subtitle} • Peruvallur Panjayath Stadium`
                  })}
                  className={`rounded-2xl border overflow-hidden cursor-pointer group transition-all duration-300 shadow-xs hover:shadow-lg hover:-translate-y-1 ${
                    isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}
                >
                  {/* Poster Image with ratio 3:4 */}
                  <div className="relative aspect-3/4 overflow-hidden bg-slate-950">
                    <img
                      src={img}
                      alt={poster.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-red-600 text-white font-sports font-black text-xs shadow-md">
                      {poster.days} DAYS TO GO
                    </div>
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-amber-300 text-[10px] font-bold">
                      {poster.highlight}
                    </div>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition text-white">
                      <div className="p-2.5 rounded-full bg-white/20 backdrop-blur-xs flex items-center gap-1.5 text-xs font-bold">
                        <Eye className="w-4 h-4" />
                        <span>Enlarge Poster</span>
                      </div>
                    </div>
                  </div>

                  {/* Poster Info */}
                  <div className="p-3.5 space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                      <span>Peruvallur Stadium</span>
                      <span>Nov 6 - Dec 6</span>
                    </div>
                    <h4 className="font-black text-base text-slate-950 font-sports leading-tight">
                      {lang === 'ml' ? poster.titleMl : poster.title}
                    </h4>
                    <p className="text-xs text-slate-500 truncate">
                      {poster.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {selectedImage && (
        <div 
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full max-h-[92vh] flex flex-col rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl"
          >
            {/* Top Modal Controls */}
            <div className="p-3 sm:p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-white">
              <div>
                <h3 className="font-sports font-black text-base sm:text-lg leading-tight text-white">
                  {selectedImage.title}
                </h3>
                <p className="text-xs text-slate-400 truncate max-w-sm sm:max-w-md">
                  {selectedImage.subtitle}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShare(selectedImage.title)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-red-600 text-slate-200 transition"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Image Preview Canvas */}
            <div className="flex-1 overflow-auto bg-black flex items-center justify-center p-2 sm:p-4">
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-lg shadow-lg"
              />
            </div>

            {/* Bottom Caption */}
            <div className="p-3 bg-slate-900 border-t border-slate-800 text-center text-xs text-slate-400">
              UDAYA Parambil Peedika & KASC Peruvallur • SFA All India Sevens Season 7
            </div>
          </div>
        </div>
      )}
    </section>
  );
}