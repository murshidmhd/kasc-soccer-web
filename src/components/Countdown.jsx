import React, { useState, useEffect } from 'react';
import { Clock, ChevronLeft, ChevronRight, Sparkles, Calendar, Eye } from 'lucide-react';
import { tournamentInfo } from '../data/tournamentData';
import countdown8 from '../assets/promo/countdown_8days.jpg';
import countdown9 from '../assets/promo/countdown_9days.jpg';
import countdown10 from '../assets/promo/countdown_10days.jpg';
import countdown11 from '../assets/promo/countdown_11days.jpg';

const COUNTDOWN_SLIDES = [
  { id: 8, days: '8 DAYS TO GO', titleMl: '8 ദിനങ്ങൾ ബാക്കി', img: countdown8, date: '29 Oct 2026' },
  { id: 9, days: '9 DAYS TO GO', titleMl: '9 ദിനങ്ങൾ ബാക്കി', img: countdown9, date: '28 Oct 2026' },
  { id: 10, days: '10 DAYS TO GO', titleMl: '10 ദിനങ്ങൾ ബാക്കി', img: countdown10, date: '27 Oct 2026' },
  { id: 11, days: '11 DAYS TO GO', titleMl: '11 ദിനങ്ങൾ ബാക്കി', img: countdown11, date: '26 Oct 2026' }
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

  // Live countdown clock ticker
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
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Automatic slide rotation every 3.5 seconds
  useEffect(() => {
    if (isPaused) return;
    const slideTimer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % COUNTDOWN_SLIDES.length);
    }, 3500);

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
        </div>

        {/* Right 5 cols: Automatic Sliding Countdown Posters */}
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
              <span className="text-[10px] text-slate-400 font-mono font-bold">
                {activeSlide + 1} / {COUNTDOWN_SLIDES.length}
              </span>
            </div>

            {/* Slide Poster Frame */}
            <div 
              onClick={() => setSelectedPoster(currentSlide.img)}
              className="relative w-full h-44 sm:h-48 rounded-2xl overflow-hidden border-2 border-slate-200 hover:border-blue-400 shadow-md cursor-pointer transition-all duration-300"
            >
              <img 
                src={currentSlide.img} 
                alt={currentSlide.days}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Floating Slide Badge on Image */}
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-xl text-white text-xs border border-white/20">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  <span className="font-sports font-black tracking-wider text-amber-300">
                    {lang === 'ml' ? currentSlide.titleMl : currentSlide.days}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-300">
                  <Eye className="w-3 h-3" />
                  <span>View</span>
                </div>
              </div>

              {/* Previous / Next Arrow Controls */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSlide((prev) => (prev - 1 + COUNTDOWN_SLIDES.length) % COUNTDOWN_SLIDES.length);
                }}
                className="absolute left-1.5 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/60 hover:bg-black/80 text-white transition opacity-0 group-hover:opacity-100"
                title="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSlide((prev) => (prev + 1) % COUNTDOWN_SLIDES.length);
                }}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/60 hover:bg-black/80 text-white transition opacity-0 group-hover:opacity-100"
                title="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Indicator Dots */}
            <div className="flex items-center justify-center gap-1.5 mt-2">
              {COUNTDOWN_SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => setActiveSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === activeSlide 
                      ? 'w-6 bg-blue-600' 
                      : 'w-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                  title={slide.days}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Poster Full Size Lightbox Modal */}
      {selectedPoster && (
        <div 
          onClick={() => setSelectedPoster(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
        >
          <div className="relative max-w-lg w-full max-h-[90vh] rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
            <img src={selectedPoster} alt="Countdown Poster Full" className="w-full h-auto object-contain" />
            <button
              onClick={() => setSelectedPoster(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/80 text-white text-xs font-bold"
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
