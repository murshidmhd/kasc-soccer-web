import React, { useState, useEffect } from 'react';
import { Clock, Sparkles, ChevronLeft, ChevronRight, Eye, ZoomIn, X, LayoutGrid, Layers } from 'lucide-react';
import { tournamentInfo } from '../data/tournamentData';
import countdown3 from '../assets/promo/countdown_3days.jpg';
import countdown4 from '../assets/promo/countdown_4days.jpg';
import countdown5 from '../assets/promo/countdown_5days.jpg';
import countdown6 from '../assets/promo/countdown_6days.jpg';
import countdown8 from '../assets/promo/countdown_8days.jpg';
import countdown9 from '../assets/promo/countdown_9days.jpg';
import countdown10 from '../assets/promo/countdown_10days.jpg';
import countdown11 from '../assets/promo/countdown_11days.jpg';

const COUNTDOWN_SLIDES = [
  { id: 3, days: '03 DAYS TO GO', titleMl: '03 ദിനങ്ങൾ ബാക്കി', img: countdown3, date: '03 Nov 2026', tag: 'TODAY', highlight: 'Team Unity Floodlights' },
  { id: 4, days: '04 DAYS TO GO', titleMl: '04 ദിനങ്ങൾ ബാക്കി', img: countdown4, date: '02 Nov 2026', tag: 'SEASON 7', highlight: 'Purple Power Striker' },
  { id: 5, days: '05 DAYS TO GO', titleMl: '05 ദിനങ്ങൾ ബാക്കി', img: countdown5, date: '01 Nov 2026', tag: 'SEASON 7', highlight: 'Ultimate Battle Inferno' },
  { id: 6, days: '06 DAYS TO GO', titleMl: '06 ദിനങ്ങൾ ബാക്കി', img: countdown6, date: '31 Oct 2026', tag: 'SEASON 7', highlight: 'Panchayath Office Edition' },
  { id: 8, days: '08 DAYS TO GO', titleMl: '08 ദിനങ്ങൾ ബാക്കി', img: countdown8, date: '29 Oct 2026', tag: 'SEASON 7', highlight: 'Festiwell Jersey #10' },
  { id: 9, days: '09 DAYS TO GO', titleMl: '09 ദിനങ്ങൾ ബാക്കി', img: countdown9, date: '28 Oct 2026', tag: 'SEASON 7', highlight: 'Inferno Gate Edition' },
  { id: 10, days: '10 DAYS TO GO', titleMl: '10 ദിനങ്ങൾ ബാക്കി', img: countdown10, date: '27 Oct 2026', tag: 'SEASON 7', highlight: 'Fortress Defense' },
  { id: 11, days: '11 DAYS TO GO', titleMl: '11 ദിനങ്ങൾ ബാക്കി', img: countdown11, date: '26 Oct 2026', tag: 'SEASON 7', highlight: 'Club Colors Sunset' },
];

export default function Countdown({ lang, isDarkMode }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [isAllPostersOpen, setIsAllPostersOpen] = useState(false);

  // Live countdown clock ticker - single source of truth for time remaining
  useEffect(() => {
    const target = new Date(tournamentInfo.startDate).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Automatic slide rotation every 4 seconds
  useEffect(() => {
    if (isPaused) return;
    const slideTimer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % COUNTDOWN_SLIDES.length);
    }, 4000);

    return () => clearInterval(slideTimer);
  }, [isPaused]);

  const currentSlide = COUNTDOWN_SLIDES[activeSlide];

  return (
    <div className={`w-full max-w-4xl mx-auto rounded-3xl p-4 sm:p-6 my-6 border transition-all shadow-sm ${
      isDarkMode 
        ? 'bg-slate-900/90 border-slate-700 text-white' 
        : 'bg-white border-slate-200 text-slate-900'
    }`}>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Left 7 cols: Live Ticker Digits */}
        <div className="md:col-span-7 space-y-3 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-700">
            <Clock className="w-4 h-4 text-blue-600 animate-spin" style={{ animationDuration: '10s' }} />
            <span>{lang === 'ml' ? 'ടൂർണ്ണമെന്റ് കിക്ക്ഓഫിലേക്ക്' : 'COUNTDOWN TO KICKOFF'}</span>
            <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-black uppercase tracking-wider animate-pulse ml-1">
              Live
            </span>
          </div>

          {/* Digits Grid */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {/* Days */}
            <div className={`rounded-2xl p-2.5 sm:p-3 text-center border shadow-2xs ${
              isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="text-2xl sm:text-4xl font-extrabold font-sports text-blue-900 tracking-wider">
                {String(timeLeft.days).padStart(2, '0')}
              </div>
              <div className="text-[10px] sm:text-xs text-slate-500 uppercase font-bold mt-0.5">
                {lang === 'ml' ? 'ദിവസം' : 'Days'}
              </div>
            </div>

            {/* Hours */}
            <div className={`rounded-2xl p-2.5 sm:p-3 text-center border shadow-2xs ${
              isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="text-2xl sm:text-4xl font-extrabold font-sports text-blue-900 tracking-wider">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <div className="text-[10px] sm:text-xs text-slate-500 uppercase font-bold mt-0.5">
                {lang === 'ml' ? 'മണിക്കൂർ' : 'Hours'}
              </div>
            </div>

            {/* Minutes */}
            <div className={`rounded-2xl p-2.5 sm:p-3 text-center border shadow-2xs ${
              isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="text-2xl sm:text-4xl font-extrabold font-sports text-blue-900 tracking-wider">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <div className="text-[10px] sm:text-xs text-slate-500 uppercase font-bold mt-0.5">
                {lang === 'ml' ? 'മിനിറ്റ്' : 'Mins'}
              </div>
            </div>

            {/* Seconds */}
            <div className={`rounded-2xl p-2.5 sm:p-3 text-center border shadow-2xs ${
              isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="text-2xl sm:text-4xl font-extrabold font-sports text-red-600 tracking-wider">
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
              <div className="text-[10px] sm:text-xs text-red-600 uppercase font-bold mt-0.5">
                {lang === 'ml' ? 'സെക്കന്റ്' : 'Secs'}
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-600 flex items-center justify-center md:justify-start gap-1.5 font-medium pt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
            <span>
              {lang === 'ml'
                ? '2026 നവംബർ 06 വെള്ളി | രാത്രി 8:00 മണിക്ക് ആരംഭിക്കുന്നു'
                : 'Starts Friday, 06 November 2026 at 8:00 PM IST'}
            </span>
          </div>

          {/* Quick Button to View All 8 Posters (Rule 4: 44px tap target) */}
          <div className="pt-2 flex justify-center md:justify-start">
            <button
              onClick={() => setIsAllPostersOpen(true)}
              className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-blue-200 dark:border-slate-600 text-blue-800 dark:text-blue-300 text-xs font-bold transition active:scale-95 shadow-card"
            >
              <LayoutGrid className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>{lang === 'ml' ? 'എല്ലാ പോസ്റ്ററുകളും കാണുക (8 Posters)' : 'View All 8 Posters'}</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-mono ml-0.5">
                {COUNTDOWN_SLIDES.length}
              </span>
            </button>
          </div>
        </div>

        {/* Right 5 cols: Official Season 7 Countdown Poster Carousel */}
        <div 
          className="md:col-span-5 flex flex-col items-center"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="w-full relative group">
            {/* Top Badge */}
            <div className="flex items-center justify-between text-xs mb-1.5 px-1">
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>{lang === 'ml' ? 'ഔദ്യോഗിക പോസ്റ്റർ പരമ്പര' : 'Official Countdown Series'}</span>
              </span>
              <span className="text-[10px] text-blue-700 font-mono font-bold">
                {activeSlide + 1} / {COUNTDOWN_SLIDES.length}
              </span>
            </div>

            {/* Poster Frame (Strict 3:4 Sports Poster Format) */}
            <div 
              onClick={() => setSelectedPoster(currentSlide.img)}
              className="relative w-full max-w-[240px] sm:max-w-[260px] mx-auto aspect-[3/4] rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 shadow-md cursor-pointer transition-all duration-300 bg-slate-950 group"
            >
              <img 
                src={currentSlide.img} 
                alt={currentSlide.days}
                width="260"
                height="347"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Floating Badge on Image */}
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-xs border border-white/20">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping shrink-0"></span>
                  <span className="font-sports font-black tracking-wider text-amber-300">
                    {lang === 'ml' ? currentSlide.titleMl : currentSlide.days}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-300 shrink-0">
                  <ZoomIn className="w-3 h-3" />
                  <span>3:4</span>
                </div>
              </div>

              {/* Previous / Next Arrow Controls (Rule 4: 44px tap zone) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSlide((prev) => (prev - 1 + COUNTDOWN_SLIDES.length) % COUNTDOWN_SLIDES.length);
                }}
                className="absolute left-1.5 top-1/2 -translate-y-1/2 min-w-[40px] min-h-[40px] flex items-center justify-center p-2 rounded-full bg-black/70 hover:bg-black text-white transition opacity-80 group-hover:opacity-100 shadow-md active:scale-95"
                title="Previous Slide"
                aria-label="Previous Poster"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSlide((prev) => (prev + 1) % COUNTDOWN_SLIDES.length);
                }}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 min-w-[40px] min-h-[40px] flex items-center justify-center p-2 rounded-full bg-black/70 hover:bg-black text-white transition opacity-80 group-hover:opacity-100 shadow-md active:scale-95"
                title="Next Slide"
                aria-label="Next Poster"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Horizontal Mini-Thumbnail Selector (Rule 1 & Rule 4: Touch friendly selector) */}
            <div className="flex items-center justify-center gap-1 mt-2.5 overflow-x-auto py-1 px-0.5 horizontal-scroll-container max-w-full">
              {COUNTDOWN_SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => setActiveSlide(idx)}
                  className={`min-h-[36px] px-2.5 py-1.5 rounded-xl text-xs font-mono font-black transition-all active:scale-95 flex items-center justify-center ${
                    idx === activeSlide 
                      ? 'bg-blue-600 text-white shadow-card scale-105' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 border border-slate-200 dark:border-slate-700'
                  }`}
                  title={`${slide.days} • ${slide.highlight}`}
                >
                  #{slide.id}d
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ALL POSTERS GRID MODAL */}
      {isAllPostersOpen && (
        <div 
          onClick={() => setIsAllPostersOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-slate-900 text-white rounded-3xl overflow-hidden border border-slate-700 shadow-2xl flex flex-col max-h-[90vh]"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-600/30 border border-blue-500/40 text-blue-400">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-sports font-black text-base sm:text-lg uppercase tracking-wider text-white">
                    {lang === 'ml' ? 'ഔദ്യോഗിക കൗണ്ട്ഡൗൺ പോസ്റ്ററുകൾ' : 'OFFICIAL SEASON 7 COUNTDOWN POSTERS'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {lang === 'ml' ? '3 മുതൽ 11 വരെയുള്ള മുഴുവൻ പോസ്റ്ററുകൾ • ടാപ്പ് ചെയ്ത് വലുതായി കാണാം' : 'All 8 official creatives (Days 03 to 11) • Tap to view full size'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAllPostersOpen(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Grid of All 8 Posters */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {COUNTDOWN_SLIDES.map((slide, idx) => (
                  <div
                    key={slide.id}
                    onClick={() => {
                      setSelectedPoster(slide.img);
                      setActiveSlide(idx);
                    }}
                    className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 cursor-pointer shadow-md hover:border-blue-400 transition-all hover:scale-102"
                  >
                    <img 
                      src={slide.img} 
                      alt={slide.days}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-[10px] font-black font-sports text-amber-300 backdrop-blur-xs">
                      #{slide.id} Days
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2.5 text-white">
                      <span className="text-[10px] font-mono text-slate-300">{slide.date}</span>
                      <span className="text-xs font-bold leading-tight truncate">{slide.highlight}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 text-center text-xs text-slate-400">
              UDAYA Parambil Peedika & KASC Peruvallur • SFA All India Sevens Season 7
            </div>
          </div>
        </div>
      )}

      {/* Poster Full Size Lightbox Modal (3:4 Poster Lightbox) */}
      {selectedPoster && (
        <div 
          onClick={() => setSelectedPoster(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
        >
          <div className="relative max-w-sm sm:max-w-md w-full aspect-[3/4] rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black">
            <img src={selectedPoster} alt="Season 7 Poster Full" className="w-full h-full object-contain" />
            <button
              onClick={() => setSelectedPoster(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/70 hover:bg-black text-white transition border border-white/20"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
