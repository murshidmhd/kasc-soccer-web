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
  Ticket,
  Target,
  Image as ImageIcon 
} from 'lucide-react';
import { promoData } from '../data/tournamentData';

// Import local promo & marathon images
import countdown3 from '../assets/promo/countdown_3days.jpg';
import countdown4 from '../assets/promo/countdown_4days.jpg';
import countdown5 from '../assets/promo/countdown_5days.jpg';
import countdown6 from '../assets/promo/countdown_6days.jpg';
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
import goalvandiVehicle from '../assets/promo/goalvandi_vehicle.jpg';
import goalvandiWinners from '../assets/promo/goalvandi_winners_collage.jpg';
import goalvandiSchool from '../assets/promo/goalvandi_school_crowd.jpg';
import goalvandiAction from '../assets/promo/goalvandi_shootout_action.jpg';

const imageMap = {
  'countdown_3days.jpg': countdown3,
  'countdown_4days.jpg': countdown4,
  'countdown_5days.jpg': countdown5,
  'countdown_6days.jpg': countdown6,
  'countdown_8days.jpg': countdown8,
  'countdown_9days.jpg': countdown9,
  'countdown_10days.jpg': countdown10,
  'countdown_11days.jpg': countdown11,
  'marathon_winner_1st.jpg': winner1st,
  'marathon_winner_2nd.jpg': winner2nd,
  'marathon_winner_3rd.jpg': winner3rd,
  'marathon_flagoff.jpg': flagoffImg,
  'marathon_runners_crowd.jpg': runnersCrowdImg,
  'marathon_official_poster.jpg': marathonPosterImg,
  'goalvandi_vehicle.jpg': goalvandiVehicle,
  'goalvandi_winners_collage.jpg': goalvandiWinners,
  'goalvandi_school_crowd.jpg': goalvandiSchool,
  'goalvandi_shootout_action.jpg': goalvandiAction
};

export default function PromoEventsSection({ lang, isDarkMode }) {
  const [activeSubTab, setActiveSubTab] = useState('goalvandi'); // 'goalvandi' | 'marathon' | 'countdown'
  const [selectedImage, setSelectedImage] = useState(null);

  const { marathon, goalVandi, countdownPosters } = promoData;

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
                Parambil Peedika & Schools
              </span>
            </div>
            <h2 className={`font-black uppercase tracking-tight leading-[1.3] ${
              lang === 'ml' ? 'font-malayalam text-xl sm:text-2xl' : 'font-sports text-2xl sm:text-3xl'
            }`}>
              {lang === 'ml' ? 'പ്രചാരണ പരിപാടികൾ' : 'PROMOTIONS & CELEBRATIONS'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl font-malayalam leading-[1.5]">
              {lang === 'ml' 
                ? 'ഉദയ ഗോൾ വണ്ടി ഷൂട്ട് ഔട്ട് മത്സരം, 8 കി.മീ മിനി മാരത്തോൺ & ഒഫീഷ്യൽ കൗണ്ട്ഡൗൺ പരമ്പര' 
                : 'Udaya Goal Vandi Shootout Challenge, 8 KM Mini Marathon & Official Countdown Series.'}
            </p>
          </div>

          {/* Sub-tab Pill Switcher */}
          <div className={`horizontal-scroll-container flex items-center gap-1.5 p-1 rounded-2xl border self-start sm:self-center overflow-x-auto max-w-full ${
            isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => setActiveSubTab('goalvandi')}
              className={`min-h-touch px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap flex items-center gap-2 transition active:scale-95 ${
                activeSubTab === 'goalvandi'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Target className="w-4 h-4 text-amber-300" />
              <span>{lang === 'ml' ? 'ഉദയ ഗോൾ വണ്ടി' : 'Goal Vandi Shootout'}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[9px] font-black uppercase">
                New
              </span>
            </button>
            <button
              onClick={() => setActiveSubTab('marathon')}
              className={`min-h-touch px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap flex items-center gap-2 transition active:scale-95 ${
                activeSubTab === 'marathon'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-300" />
              <span>{lang === 'ml' ? 'മിനി മാരത്തോൺ' : 'Mini Marathon (8 KM)'}</span>
            </button>
            <button
              onClick={() => setActiveSubTab('countdown')}
              className={`min-h-touch px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap flex items-center gap-2 transition active:scale-95 ${
                activeSubTab === 'countdown'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-4 h-4 text-red-300" />
              <span>{lang === 'ml' ? 'കൗണ്ട്ഡൗൺ' : 'Countdown Posters'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: UDAYA GOAL VANDI SHOOTOUT CONTEST */}
      {activeSubTab === 'goalvandi' && goalVandi && (
        <div className="space-y-6 animate-fadeIn">
          {/* Key Overview Card */}
          <div className={`rounded-3xl p-5 sm:p-7 border overflow-hidden relative ${
            isDarkMode 
              ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border-slate-800' 
              : 'bg-gradient-to-br from-blue-50/70 via-white to-amber-50/50 border-slate-200 shadow-xs'
          }`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8 space-y-3.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                    Official Campaign Tour
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-950 text-[10px] font-black uppercase tracking-wider border border-amber-300">
                    Free Match Passes Awarded
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-950 text-[10px] font-black uppercase tracking-wider border border-blue-200">
                    Sponsor: {goalVandi.sponsor}
                  </span>
                </div>

                <h3 className={`font-black uppercase tracking-tight text-slate-950 leading-[1.3] ${
                  lang === 'ml' ? 'font-malayalam text-xl sm:text-2xl' : 'font-sports text-2xl sm:text-3xl'
                }`}>
                  {lang === 'ml' ? goalVandi.titleMl : goalVandi.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-700 font-malayalam leading-[1.5]">
                  {lang === 'ml' ? goalVandi.descMl : goalVandi.desc}
                </p>

                {/* Tour Locations Badges */}
                <div className="pt-1">
                  <span className="text-[11px] font-black uppercase text-slate-500 block mb-1.5 tracking-wider">
                    {lang === 'ml' ? 'മത്സരം നടന്ന പ്രധാന കേന്ദ്രങ്ങൾ:' : 'Tour Contest Locations:'}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {goalVandi.locations.map((loc, idx) => (
                      <span 
                        key={idx} 
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs"
                      >
                        <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                        <span>{lang === 'ml' ? loc.nameMl : loc.name}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Reward Callout */}
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs font-bold flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    {lang === 'ml' ? goalVandi.rewardMl : goalVandi.reward}
                  </span>
                </div>
              </div>

              {/* Vehicle Showcase Thumbnail */}
              <div className="lg:col-span-4 flex justify-center">
                <div 
                  onClick={() => setSelectedImage({
                    src: imageMap['goalvandi_vehicle.jpg'],
                    title: lang === 'ml' ? 'ഉദയ ഗോൾ വണ്ടി' : 'Official Goal Vandi Vehicle',
                    subtitle: lang === 'ml' ? 'ഫെസ്കോ ഗ്രൂപ്പ് സ്പോൺസർ ചെയ്ത പ്രചാരണ വാഹനം' : 'Promotional vehicle powered by Fezco Group'
                  })}
                  className="relative rounded-2xl overflow-hidden border-2 border-slate-200 hover:border-blue-500 shadow-md cursor-pointer group aspect-3/4 max-w-[220px] w-full bg-black transition-all"
                >
                  <img 
                    src={imageMap['goalvandi_vehicle.jpg']} 
                    alt="Goal Vandi Vehicle"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3 text-white">
                    <span className="text-[10px] font-mono text-amber-300 font-bold uppercase">FEZCO GROUP</span>
                    <span className="text-xs font-sports font-black">ഉദയ ഗോൾ വണ്ടി</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Photo Gallery Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-black font-sports uppercase tracking-wider flex items-center gap-2 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                <ImageIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>{lang === 'ml' ? 'ഷൂട്ട് ഔട്ട് ചിത്രങ്ങൾ (Event Gallery)' : 'Shootout Action & Ceremony Photos'}</span>
              </h3>
              <span className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Tap photo to enlarge</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {goalVandi.gallery.map((item) => {
                const img = imageMap[item.filename];
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedImage({
                      src: img,
                      title: lang === 'ml' ? item.titleMl : item.title,
                      subtitle: lang === 'ml' ? item.descMl : item.desc
                    })}
                    className={`rounded-2xl border overflow-hidden cursor-pointer group transition-all duration-200 shadow-xs hover:shadow-md ${
                      isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="relative aspect-4/3 overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={img}
                        alt={item.title}
                        loading="lazy"
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
                      <h4 className={`font-bold text-sm leading-snug ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {lang === 'ml' ? item.titleMl : item.title}
                      </h4>
                      <p className={`text-xs line-clamp-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        {lang === 'ml' ? item.descMl : item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Notice Announcement */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-bold">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{lang === 'ml' ? goalVandi.upcomingNoticeMl : goalVandi.upcomingNotice}</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-950 font-black text-[10px] uppercase shrink-0">
              Ongoing Tour
            </span>
          </div>
        </div>
      )}

      {/* VIEW 2: MINI MARATHON 8 KM HIGHLIGHTS */}
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
                  <span className="px-2.5 py-1 rounded-full bg-blue-700 text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                    Official SFA Promotion
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                    {marathon.distance}
                  </span>
                </div>

                <h3 className={`font-black uppercase tracking-tight text-slate-950 ${
                  lang === 'ml' ? 'font-malayalam text-xl sm:text-2xl' : 'font-sports text-2xl sm:text-3xl'
                }`}>
                  {lang === 'ml' ? marathon.titleMl : marathon.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-malayalam">
                  {lang === 'ml'
                    ? '2026 ഒക്ടോബർ 25 ഞായറാഴ്ച രാവിലെ പറമ്പിൽ പീടിക പഞ്ചായത്ത് സ്റ്റേഡിയത്തിൽ നിന്ന് ആരംഭിച്ച 8 കിലോമീറ്റർ മിനി മാരത്തോൺ പെരുവള്ളൂർ ഗ്രാമ പഞ്ചായത്ത് പ്രസിഡന്റ് പി. പി. സുനീൽ ഫ്ലാഗ് ഓഫ് ചെയ്തു. അബാക്കസ് അക്കാദമി പറമ്പിൽ പീടിക & പുത്തൂർ പള്ളിക്കൽ നൽകിയ ക്യാഷ് പ്രൈസുകൾ വിജയികൾക്ക് വിതരണം ചെയ്തു.'
                    : 'The grand promotional 8 km mini marathon was officially flagged off on Sunday, 25 October 2026 from Peruvallur Panjayath Stadium by Grama Panchayath President P. P. Suneel. Elite athletes from Malappuram, Kozhikode, and Palakkad competed.'}
                </p>

                {/* Key metadata pills */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                  <div className="p-2.5 rounded-xl bg-white/80 border border-slate-200">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Flag-Off By</span>
                    <span className="font-bold text-slate-900">{lang === 'ml' ? marathon.flagOffBy.nameMl : marathon.flagOffBy.name}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/80 border border-slate-200">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Event Type</span>
                    <span className="font-bold text-slate-900">8 KM Mini Marathon</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/80 border border-slate-200 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Event Partner</span>
                    <span className="font-bold text-blue-800">{marathon.prizeSponsor.name}</span>
                  </div>
                </div>
              </div>

              {/* Official Marathon Notice Banner Thumbnail */}
              <div className="lg:col-span-4 flex justify-center">
                <div 
                  onClick={() => setSelectedImage({
                    src: marathonPosterImg,
                    title: lang === 'ml' ? 'മിനി മാരത്തോൺ അറിയിപ്പ് പോസ്റ്റർ' : 'Official Marathon Announcement Poster',
                    subtitle: lang === 'ml' ? 'അബാക്കസ് അക്കാദമി സ്പോൺസർ ചെയ്ത പോസ്റ്റർ' : 'Official Notice by Udaya Parambil Peedika'
                  })}
                  className="relative rounded-2xl overflow-hidden border-2 border-slate-200 hover:border-blue-500 shadow-md cursor-pointer group aspect-3/4 max-w-[220px] w-full bg-black transition-all"
                >
                  <img 
                    src={marathonPosterImg} 
                    alt="Official Marathon Announcement Poster"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3 text-white">
                    <span className="text-[10px] font-mono text-amber-300 font-bold uppercase">ABACUS ACADEMY</span>
                    <span className="text-xs font-sports font-black">8 KM MINI MARATHON</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Winners Podium Showcase (3 Cards) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black font-sports uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span>{lang === 'ml' ? 'മാരത്തോൺ വിജയികൾ (Winners Podium)' : 'Mini Marathon 8KM Champions'}</span>
              </h3>
              <span className="text-xs text-slate-500 font-medium">Top 3 Finishers</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {marathon.prizes.map((p) => {
                const img = imageMap[p.filename];
                return (
                  <div
                    key={p.place}
                    className={`rounded-2xl border overflow-hidden transition-all duration-200 shadow-xs hover:shadow-md ${
                      isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                    } ${p.place === 1 ? 'ring-2 ring-amber-400' : ''}`}
                  >
                    <div 
                      onClick={() => setSelectedImage({
                        src: img,
                        title: `${p.title}: ${lang === 'ml' ? p.winnerMl : p.winner}`,
                        subtitle: `${p.badge} • ${p.title}`
                      })}
                      className="relative aspect-4/3 overflow-hidden cursor-pointer group bg-slate-100"
                    >
                      <img
                        src={img}
                        alt={p.winner}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-slate-950/85 text-white text-[11px] font-black font-sports backdrop-blur-xs flex items-center gap-1">
                        <span>{p.badge}</span>
                      </div>
                    </div>

                    <div className="p-3.5 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-blue-700 tracking-wider">
                          {lang === 'ml' ? p.titleMl : p.title}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400">8 KM Run</span>
                      </div>
                      <h4 className="font-sports font-black text-base text-slate-900">
                        {lang === 'ml' ? p.winnerMl : p.winner}
                      </h4>
                    </div>

                    {/* Card Footer details */}
                    <div className="p-3 text-center bg-slate-50 border-t border-slate-100">
                      <p className="text-[11px] text-slate-600 font-medium">
                        {lang === 'ml' 
                          ? `${p.titleMl} ട്രോഫിയും മെഡലും നൽകി ആദരിച്ചു.` 
                          : `Honored with ${p.title} trophy and medal.`}
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
                <span className="text-[10px] font-mono text-blue-700 font-bold uppercase tracking-wider">
                  Official Marathon Partner
                </span>
                <h4 className="font-sports font-black text-base text-slate-950">
                  {marathon.prizeSponsor.name} ({marathon.prizeSponsor.nameMl})
                </h4>
                <p className="text-xs text-slate-500">
                  {lang === 'ml' 
                    ? 'പറമ്പിൽ പീടിക & പുത്തൂർ പള്ളിക്കൽ • സെവൻസ് മിനി മാരത്തോൺ സ്പോൺസർമാർ' 
                    : `${marathon.prizeSponsor.branches} • Official Partner for SFA Sevens 8KM Marathon`}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="inline-block px-3 py-1.5 rounded-xl bg-blue-100 text-blue-950 font-black text-xs font-mono shadow-xs border border-blue-200">
                Official Event Partner
              </span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: COUNTDOWN POSTERS GALLERY */}
      {activeSubTab === 'countdown' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black font-sports uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-red-600" />
                <span>{lang === 'ml' ? 'കൗണ്ട്ഡൗൺ പോസ്റ്റർ പരമ്പര' : 'Official Countdown Series'}</span>
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'ml' 
                  ? 'കിക്ക്ഓഫിലേക്ക് ദിനങ്ങൾ എണ്ണുന്ന ഔദ്യോഗിക ഡിജിറ്റൽ പോസ്റ്ററുകൾ' 
                  : 'Official countdown creatives released in the build-up to kickoff.'}
              </p>
            </div>
            <span className="text-xs text-blue-700 font-bold font-mono">
              {countdownPosters.length} Posters
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {countdownPosters.map((poster) => {
              const img = imageMap[poster.filename];
              return (
                <div
                  key={poster.days}
                  onClick={() => setSelectedImage({
                    src: img,
                    title: `${poster.days} Days To Go - Season 7`,
                    subtitle: `${poster.subtitle} • ${poster.dates}`
                  })}
                  className={`rounded-2xl border overflow-hidden cursor-pointer group transition-all duration-200 shadow-xs hover:shadow-md ${
                    isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="relative aspect-3/4 overflow-hidden bg-slate-950">
                    <img
                      src={img}
                      alt={poster.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-red-600 text-white text-[10px] font-black font-sports uppercase tracking-wider shadow-xs">
                      {poster.days} Days
                    </div>
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition text-white">
                      <div className="p-2 rounded-full bg-white/20 backdrop-blur-xs">
                        <Eye className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                  <div className="p-3 space-y-1">
                    <span className="text-[10px] text-amber-700 font-bold uppercase block tracking-wider">
                      {poster.highlight}
                    </span>
                    <h4 className="font-sports font-black text-sm text-slate-900 leading-snug">
                      {lang === 'ml' ? poster.titleMl : poster.title}
                    </h4>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Lightbox Image Preview Modal */}
      {selectedImage && (
        <div 
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col max-h-[90vh]"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800 text-white">
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
                  className="w-11 h-11 min-w-touch min-h-touch rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition flex items-center justify-center active:scale-95"
                  title="Share"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="w-11 h-11 min-w-touch min-h-touch rounded-xl bg-slate-800 hover:bg-red-600 text-slate-200 transition flex items-center justify-center active:scale-95"
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
