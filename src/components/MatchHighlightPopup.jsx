/**
 * MatchHighlightPopup.jsx
 * Shows on page load: today's match poster, last match result, and Player of the Match
 * Swipeable / tabbed carousel of match and result posters.
 * Dismissed on tap outside, swipe, or close button. Stored in sessionStorage
 * so it only shows once per browser session (not per visit like welcomeSheet).
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { lastMatchResult, fixtures } from '../data/tournamentData';
import todayMatchPoster from '../assets/poster-nov-7.png';
import alternateMatchPoster from '../assets/nov-7-match-poster-2.png';

const SESSION_KEY = 'matchHighlightSeenV2';

export default function MatchHighlightPopup({ isDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [slide, setSlide] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const [imgLoaded, setImgLoaded] = useState([false, false, false, false]);
  const overlayRef = useRef(null);

  const slides = [
    {
      url: todayMatchPoster,
      label: '📅 Today’s Match Poster',
      sublabel: 'KMG MAVOOR vs SHOOTERS PADANNA',
      footer: `07 NOV 2026 · ${(fixtures[1]?.time || '08:45 PM').replace(':','.')} · PERUVALLUR PANCHAYATH STADIUM`
    },
    {
      url: alternateMatchPoster,
      label: '📅 Match Poster · Alternate Design',
      sublabel: 'KMG MAVOOR vs SHOOTERS PADANNA',
      footer: 'ALTERNATE MATCH POSTER DESIGN'
    },
    {
      url: lastMatchResult.winnerPosterUrl,
      label: '🏆  Player of the Match',
      sublabel: `${lastMatchResult.motmName} · #${lastMatchResult.motmNumber} · ${lastMatchResult.motmTeam}`,
      footer: `${lastMatchResult.stage} · ${lastMatchResult.date}`
    },
    {
      url: lastMatchResult.motmPosterUrl,
      label: '⭐ Match Result',
      sublabel: `${lastMatchResult.homeTeam} ${lastMatchResult.homeScore} – ${lastMatchResult.awayScore} ${lastMatchResult.awayTeam}`,
      footer: `${lastMatchResult.stage} · ${lastMatchResult.date}`
    }
  ];

  // Show once per session, after a 1-second delay
  useEffect(() => {
    let alreadySeen = false;
    try { alreadySeen = sessionStorage.getItem(SESSION_KEY) === 'true'; } catch (_) {}
    if (alreadySeen) return;

    // Don't show on admin routes
    const hash = window.location.hash.replace('#', '').toLowerCase();
    if (hash === 'admin' || hash === 'desk-s7') return;

    const timer = setTimeout(() => setIsOpen(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    try { sessionStorage.setItem(SESSION_KEY, 'true'); } catch (_) {}
  }, []);

  const goNext = () => setSlide(s => Math.min(s + 1, slides.length - 1));
  const goPrev = () => setSlide(s => Math.max(s - 1, 0));

  // Touch swipe
  const handleTouchStart = (e) => setTouchStartX(e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 50) goNext();
    else if (diff < -50) goPrev();
    setTouchStartX(null);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => { if (e.target === overlayRef.current) handleClose(); }}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl"
        style={{ maxHeight: '90vh' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 transition shadow-lg"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Slide label pill */}
        <div className="absolute top-3 left-3 z-20">
          <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-black uppercase tracking-wider shadow">
            {slides[slide].label}
          </span>
        </div>

        {/* Poster image */}
        <div className="relative w-full bg-black" style={{ aspectRatio: '3/4', maxHeight: '75vh' }}>
          {slides.map((s, idx) => (
            <img
              key={idx}
              src={s.url}
              alt={s.label}
              onLoad={() => setImgLoaded(prev => { const n = [...prev]; n[idx] = true; return n; })}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${slide === idx ? 'opacity-100' : 'opacity-0'}`}
            />
          ))}

          {/* Loading shimmer */}
          {!imgLoaded[slide] && (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 animate-pulse" />
          )}
        </div>

        {/* Bottom info bar */}
        <div className="bg-gradient-to-t from-black via-black/90 to-transparent px-4 pt-6 pb-4 -mt-16 relative z-10">
          <p className="text-white text-sm font-black text-center leading-tight">{slides[slide].sublabel}</p>
          <p className="text-slate-400 text-[10px] text-center mt-0.5 uppercase tracking-widest">
            {slides[slide].footer || `${lastMatchResult.stage} · ${lastMatchResult.date}`}
          </p>

          {/* Slide dots */}
          <div className="flex items-center justify-center gap-2 mt-3">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setSlide(idx)}
                className={`rounded-full transition-all ${slide === idx ? 'w-5 h-2 bg-amber-400' : 'w-2 h-2 bg-slate-600'}`}
              />
            ))}
          </div>

          {/* Nav arrows */}
          <div className="flex items-center justify-between mt-3 gap-2">
            <button
              onClick={goPrev}
              disabled={slide === 0}
              className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white text-xs font-bold flex items-center justify-center gap-1 transition"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>
            {slide < slides.length - 1 ? (
              <button
                onClick={goNext}
                className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black flex items-center justify-center gap-1 transition"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleClose}
                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center justify-center gap-1 transition"
              >
                <Star className="w-3.5 h-3.5 fill-current" /> Done
              </button>
            )}
          </div>
        </div>

        {/* Left / Right tap zones */}
        {slide > 0 && (
          <button onClick={goPrev} className="absolute left-0 top-1/4 bottom-1/4 w-10 z-10" aria-label="Previous" />
        )}
        {slide < slides.length - 1 && (
          <button onClick={goNext} className="absolute right-0 top-1/4 bottom-1/4 w-10 z-10" aria-label="Next" />
        )}
      </div>
    </div>
  );
}
