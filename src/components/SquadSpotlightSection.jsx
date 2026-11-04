import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Play, 
  Pause, 
  RotateCcw, 
  AlertCircle,
  WifiOff,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { squadPlayers, squadClubs } from '../data/squad';
import TeamLogo from './TeamLogo';

export default function SquadSpotlightSection({ lang, isDarkMode }) {
  const [selectedClub, setSelectedClub] = useState('All');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true); // In-memory only per Rule 13
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(6);
  const [isBuffering, setIsBuffering] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isStoppedAfterCycles, setIsStoppedAfterCycles] = useState(false);
  const [isDataSaving, setIsDataSaving] = useState(false);
  const [isSectionVisible, setIsSectionVisible] = useState(false);
  const [isPressing, setIsPressing] = useState(false);
  const [videoError, setVideoError] = useState(null);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const bufferTimerRef = useRef(null);
  const stallTimerRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Filter players by selected club
  const filteredPlayers = selectedClub === 'All'
    ? squadPlayers
    : squadPlayers.filter(p => p.club === selectedClub);

  const activePlayer = filteredPlayers[activeIndex] || filteredPlayers[0];

  // Data saving detection (Rule 12)
  useEffect(() => {
    const isSaveData = typeof navigator !== 'undefined' && navigator.connection?.saveData === true;
    const isSlowConn = typeof navigator !== 'undefined' && ['2g', '3g', 'slow-2g'].includes(navigator.connection?.effectiveType);
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isSaveData || isSlowConn || prefersReducedMotion) {
      setIsDataSaving(true);
    }
  }, []);

  // IntersectionObserver: Section >= 60% visible to autoplay (Rule 8)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
          setIsSectionVisible(true);
        } else {
          setIsSectionVisible(false);
          if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
            setIsPlaying(false);
          }
        }
      },
      { threshold: [0.55] }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // VisibilityChange: Pause when tab is hidden (Rule 8)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else if (!document.hidden && isSectionVisible && !isStoppedAfterCycles && !isDataSaving) {
        if (videoRef.current) {
          videoRef.current.play().catch(() => {});
          setIsPlaying(true);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [isSectionVisible, isStoppedAfterCycles, isDataSaving]);

  // Handle active player change & video source setup (Rule 7: ONE shared video element)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !activePlayer) return;

    setCurrentTime(0);
    setIsBuffering(false);
    setVideoError(null);
    setAutoplayBlocked(false);
    clearTimeout(bufferTimerRef.current);
    clearTimeout(stallTimerRef.current);

    // Prefer devFallbackUrl if present, otherwise videoUrl
    const sourceUrl = activePlayer.devFallbackUrl || activePlayer.videoUrl;

    if (!sourceUrl) {
      setVideoError({ url: 'N/A', code: 'NO_SOURCE' });
      return;
    }

    video.src = sourceUrl;
    video.muted = isMuted;

    if (isSectionVisible && !isStoppedAfterCycles && !isDataSaving && !isPressing) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setAutoplayBlocked(false);
          })
          .catch((err) => {
            setIsPlaying(false);
            setAutoplayBlocked(true);
          });
      }
    } else {
      setAutoplayBlocked(true);
    }

    // Set stall fallback timer for 8 seconds (Rule 14)
    stallTimerRef.current = setTimeout(() => {
      if (video.readyState < 2 && !videoError) {
        handleNextPlayer(false);
      }
    }, 8000);

    return () => {
      clearTimeout(bufferTimerRef.current);
      clearTimeout(stallTimerRef.current);
    };
  }, [activeIndex, selectedClub, isSectionVisible, isStoppedAfterCycles, isDataSaving]);

  // Video error listener with console logging (Step 2, Rule 9)
  const onVideoError = (e) => {
    const sourceUrl = activePlayer?.devFallbackUrl || activePlayer?.videoUrl;
    const mediaError = videoRef.current?.error;
    const errorCode = mediaError ? mediaError.code : 'UNKNOWN';
    console.error(`[Squad Spotlight] Video error (code: ${errorCode}) failed to load URL: ${sourceUrl}`, mediaError);
    setVideoError({
      url: sourceUrl,
      code: errorCode
    });
    setIsPlaying(false);
  };

  // Video Retry action
  const handleRetryVideo = (e) => {
    if (e) e.stopPropagation();
    setVideoError(null);
    setAutoplayBlocked(false);
    const video = videoRef.current;
    if (video && activePlayer) {
      const sourceUrl = activePlayer.devFallbackUrl || activePlayer.videoUrl;
      video.src = sourceUrl;
      video.load();
      video.play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          setIsPlaying(false);
          setAutoplayBlocked(true);
        });
    }
  };

  // User Tap-to-play trigger (Step 2, Rule 10)
  const handleStartPlay = (e) => {
    if (e) e.stopPropagation();
    setIsDataSaving(false);
    setAutoplayBlocked(false);
    setVideoError(null);
    if (videoRef.current) {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.error('[Squad Spotlight] Play rejected on user tap:', err);
        });
    }
  };

  // Video Time & Buffer event listeners
  const onTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.duration) {
        setDuration(videoRef.current.duration);
      }
    }
  };

  const onWaiting = () => {
    bufferTimerRef.current = setTimeout(() => {
      setIsBuffering(true);
    }, 500);
  };

  const onPlaying = () => {
    clearTimeout(bufferTimerRef.current);
    clearTimeout(stallTimerRef.current);
    setIsBuffering(false);
    setIsPlaying(true);
  };

  // Rule 9: When video ends, go to next player; after last player loop back
  const handleVideoEnded = () => {
    handleNextPlayer(false);
  };

  const handleNextPlayer = useCallback((userTriggered = true) => {
    if (userTriggered) {
      setHasInteracted(true);
      setIsStoppedAfterCycles(false);
    }

    setActiveIndex((prev) => {
      const next = prev + 1;
      if (next >= filteredPlayers.length) {
        // Completed 1 full cycle
        if (!userTriggered && !hasInteracted) {
          setCycleCount((c) => {
            const nextCycle = c + 1;
            // Rule 10: Stop after 3 full cycles with no user interaction
            if (nextCycle >= 3) {
              setIsStoppedAfterCycles(true);
              if (videoRef.current) videoRef.current.pause();
            }
            return nextCycle;
          });
        }
        return 0; // Loop back to first player
      }
      return next;
    });
  }, [filteredPlayers.length, hasInteracted]);

  const handlePrevPlayer = useCallback(() => {
    setHasInteracted(true);
    setIsStoppedAfterCycles(false);
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : filteredPlayers.length - 1));
  }, [filteredPlayers.length]);

  // Gesture Controls: Tap left third = prev, Tap right third = next, Press and hold = pause (Rule 5)
  const handleCardClick = (e) => {
    if (isStoppedAfterCycles) {
      setIsStoppedAfterCycles(false);
      setCycleCount(0);
      setHasInteracted(true);
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;

    if (x < width * 0.33) {
      handlePrevPlayer();
    } else if (x > width * 0.66) {
      handleNextPlayer(true);
    } else {
      // Center tap: toggle play/pause
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause();
          setIsPlaying(false);
        } else {
          videoRef.current.play().catch(() => {});
          setIsPlaying(true);
        }
      }
    }
  };

  const handlePointerDown = () => {
    setIsPressing(true);
    if (videoRef.current && isPlaying) {
      videoRef.current.pause();
    }
  };

  const handlePointerUp = () => {
    setIsPressing(false);
    if (videoRef.current && isSectionVisible && !isStoppedAfterCycles && !isDataSaving) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
    }
  };

  // Next player prefetch clip (Rule 11: Preload only NEXT clip, never all)
  const nextPlayer = filteredPlayers[(activeIndex + 1) % filteredPlayers.length];
  const nextClipUrl = nextPlayer?.devFallbackUrl || nextPlayer?.videoUrl;

  return (
    <section 
      id="squad-spotlight" 
      ref={containerRef}
      className="space-y-3.5 scroll-mt-20"
    >
      {/* 1. Header with Title & Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-border dark:border-navy-700 pb-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-navy-800 border border-navy-700 text-gold text-xs font-bold uppercase tracking-wider mb-1 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>{lang === 'ml' ? 'സ്ക്വാഡ് സ്റ്റോറികൾ' : 'SQUAD STORIES'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-sports tracking-wide uppercase leading-[1.3] text-card-title">
            {lang === 'ml' ? 'താരങ്ങളുടെ വീഡിയോ പ്രൊഫൈലുകൾ' : 'PLAYER STORY SHOWCASE'}
          </h2>
          <p className="text-xs text-card-muted font-medium leading-[1.4] mt-0.5">
            {lang === 'ml'
              ? 'മുൻനിര കളിക്കാരുടെ 9:16 പോർട്രെയ്റ്റ് വീഡിയോകൾ'
              : 'Story-style portrait video cards of star players'}
          </p>
        </div>
      </div>

      {/* 2. Club Filter Chips Row */}
      <div className="flex items-center gap-1.5 overflow-x-auto horizontal-scroll-container py-0.5">
        {squadClubs.map((club) => {
          const isSelected = selectedClub === club;
          return (
            <button
              key={club}
              onClick={() => {
                setSelectedClub(club);
                setActiveIndex(0);
              }}
              className={`min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition active:scale-95 flex items-center gap-1.5 ${
                isSelected
                  ? 'btn-royal text-white font-black shadow-xs'
                  : 'surface-card text-card-title border border-surface-border dark:border-navy-700'
              }`}
            >
              <span>{club === 'All' ? (lang === 'ml' ? 'എല്ലാ ക്ലബ്ബുകളും' : 'All Clubs') : club}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Story-Style Video Player Card (Rule 1: ~85% width, centered, next card peeking) */}
      <div className="relative flex justify-center py-1">
        <div 
          data-testid="story-player-card"
          onClick={handleCardClick}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="relative w-[85vw] max-w-[340px] aspect-[9/16] rounded-3xl overflow-hidden surface-navy shadow-2xl border border-navy-700 cursor-pointer select-none group"
        >
          {/* Shared Single <video> Element (Rule 7) */}
          <video
            ref={videoRef}
            playsInline
            muted={isMuted}
            preload="metadata"
            onTimeUpdate={onTimeUpdate}
            onWaiting={onWaiting}
            onPlaying={onPlaying}
            onError={onVideoError}
            onEnded={handleVideoEnded}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isPlaying ? 'opacity-100' : 'opacity-85'
            }`}
          >
            {sourceUrl && <source src={sourceUrl} type="video/mp4" />}
          </video>

          {/* Small Dev-Only Debug Line (Step 2, Rule 12 - hidden in production) */}
          {import.meta.env.DEV && (
            <div className="absolute top-14 inset-x-3 z-30 px-2.5 py-1 rounded-lg bg-black/85 text-[10px] font-mono text-amber-300 pointer-events-none truncate border border-amber-500/40 shadow-xs">
              <span>[Dev Debug: </span>
              <span className="font-bold">
                {videoError ? 'Video 404 / Network Error' :
                 isDataSaving ? 'Data-Saver / Slow Network' :
                 !isSectionVisible ? 'Section < 55% visible' :
                 isStoppedAfterCycles ? 'Stopped after 3 cycles' :
                 isPlaying ? 'Active Playing' : 'Autoplay Blocked (Tap to play)'}
              </span>
              <span>]</span>
            </div>
          )}

          {/* Hidden Next Video Prefetcher (Rule 11: Preload only NEXT clip) */}
          {nextClipUrl && (
            <video 
              src={nextClipUrl} 
              preload="metadata" 
              className="hidden" 
              aria-hidden="true" 
            />
          )}

          {/* Poster Fallback (shown while video is buffering or in data saving mode) */}
          {(!isPlaying || isDataSaving || videoError) && activePlayer?.posterUrl && (
            <img
              src={activePlayer.posterUrl}
              alt={activePlayer.name}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
          )}

          {/* Clear Error Overlay with Retry Button (Step 2, Rule 9) */}
          {videoError && (
            <div className="absolute inset-0 z-35 flex flex-col items-center justify-center p-4 bg-navy-950/90 text-center space-y-3 animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black font-sports uppercase text-white">
                  {lang === 'ml' ? 'വീഡിയോ ലഭ്യമല്ല' : 'Video unavailable'}
                </h4>
                <p className="text-[11px] text-navy-muted mt-1 max-w-[200px]">
                  {lang === 'ml'
                    ? 'വീഡിയോ സെർവറിൽ നിന്ന് ലോഡ് ചെയ്യാൻ സാധിച്ചില്ല'
                    : 'External video file could not be loaded'}
                </p>
              </div>
              <button
                onClick={handleRetryVideo}
                className="min-h-[44px] px-4 py-2 rounded-xl btn-gold text-navy-900 font-bold text-xs uppercase flex items-center gap-1.5 shadow-md active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{lang === 'ml' ? 'വീണ്ടും ശ്രമിക്കുക' : 'Retry'}</span>
              </button>
            </div>
          )}

          {/* Visible Tap to Play Button Overlay (Step 2, Rule 10) */}
          {!isPlaying && !isBuffering && !videoError && !isStoppedAfterCycles && (
            <div 
              onClick={handleStartPlay}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 bg-navy-950/35 group cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full btn-gold text-navy-900 flex items-center justify-center shadow-2xl transition-transform duration-200 group-hover:scale-110 active:scale-90">
                <Play className="w-7 h-7 fill-current ml-1" />
              </div>
              <span className="mt-2.5 px-3 py-1 rounded-full bg-navy-950/90 text-white text-xs font-bold border border-white/20 shadow-md">
                {lang === 'ml' ? 'പ്ലേ ചെയ്യാൻ ടാപ്പ് ചെയ്യുക' : 'Tap to play'}
              </span>
            </div>
          )}

          {/* Story Progress Bar at Top (Rule 2: thin segments, fills as video plays) */}
          <div className="absolute top-3 inset-x-3 z-30 flex items-center gap-1 pointer-events-none">
            {filteredPlayers.length <= 12 ? (
              filteredPlayers.map((p, idx) => {
                let progress = 0;
                if (idx < activeIndex) progress = 100;
                else if (idx === activeIndex && duration > 0) {
                  progress = Math.min(100, (currentTime / duration) * 100);
                }

                return (
                  <div 
                    key={p.id}
                    className="flex-1 h-1 rounded-full bg-white/30 overflow-hidden"
                  >
                    <div 
                      className="h-full bg-gold transition-all duration-100 ease-linear"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                );
              })
            ) : (
              <div className="px-2.5 py-0.5 rounded-full bg-navy-950/80 text-[10px] font-mono text-gold font-bold">
                {activeIndex + 1} / {filteredPlayers.length}
              </div>
            )}
          </div>

          {/* Top Right Controls (Rule 4: Mute/Unmute 44px + AI visual label) */}
          <div className="absolute top-7 right-3 z-30 flex items-center gap-2">
            {activePlayer?.isAiGenerated && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-navy-950/80 border border-gold/40 text-gold text-[10px] font-black uppercase tracking-wider">
                <Sparkles className="w-2.5 h-2.5 text-gold" />
                <span>AI Visual</span>
              </span>
            )}
            <button
              onClick={toggleMute}
              className="w-11 h-11 rounded-full bg-navy-950/80 hover:bg-navy-900 text-white flex items-center justify-center transition active:scale-90 border border-white/20 shadow-xs"
              aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-white" />
              ) : (
                <Volume2 className="w-4 h-4 text-gold" />
              )}
            </button>
          </div>

          {/* Buffering Spinner (Rule 14: after 500ms) */}
          {isBuffering && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 pointer-events-none">
              <div className="w-10 h-10 border-3 border-gold border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Data Saving Mode Overlay (Rule 12: Tap to Play) */}
          {isDataSaving && !isPlaying && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-4 bg-navy-950/60 text-center">
              <WifiOff className="w-8 h-8 text-gold mb-2" />
              <p className="text-xs text-white font-bold mb-3">
                {lang === 'ml' ? 'ഡാറ്റാ സേവിംഗ് മോഡ്' : 'Data Saver Mode Active'}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDataSaving(false);
                  if (videoRef.current) {
                    videoRef.current.play().catch(() => {});
                    setIsPlaying(true);
                  }
                }}
                className="min-h-[44px] px-4 py-2 rounded-xl btn-gold text-navy-900 font-bold text-xs uppercase flex items-center gap-1.5 shadow-md active:scale-95"
              >
                <Play className="w-4 h-4 fill-navy-900" />
                <span>Play Clip ({activePlayer?.fileSize || '1.3 MB'})</span>
              </button>
            </div>
          )}

          {/* 3 Cycles Paused Overlay (Rule 10: Tap to keep watching) */}
          {isStoppedAfterCycles && (
            <div 
              onClick={(e) => {
                e.stopPropagation();
                setIsStoppedAfterCycles(false);
                setCycleCount(0);
                if (videoRef.current) {
                  videoRef.current.play().catch(() => {});
                  setIsPlaying(true);
                }
              }}
              className="absolute inset-0 z-40 flex flex-col items-center justify-center p-4 bg-navy-950/85 text-center cursor-pointer animate-fadeIn"
            >
              <div className="w-12 h-12 rounded-full btn-gold text-navy-900 flex items-center justify-center mb-3 shadow-lg">
                <RotateCcw className="w-6 h-6 text-navy-900" />
              </div>
              <h4 className="text-sm font-black font-sports uppercase text-white mb-1">
                {lang === 'ml' ? 'വീണ്ടും കാണാൻ ടാപ്പ് ചെയ്യുക' : 'Tap to Keep Watching'}
              </h4>
              <p className="text-[11px] text-navy-muted">
                {lang === 'ml' ? '3 റൗണ്ട് പൂർത്തിയായി' : 'Paused after 3 cycles'}
              </p>
            </div>
          )}

          {/* Bottom Overlay with Linear Gradient (Rule 3: NO blur, WCAG AA contrast) */}
          <div className="absolute inset-x-0 bottom-0 z-30 pt-16 pb-4 px-4 bg-gradient-to-t from-navy-950 via-navy-950/80 to-transparent pointer-events-none text-left">
            <div className="flex items-end justify-between gap-3">
              <div className="min-w-0 flex-1 space-y-1">
                {/* Shirt Number Badge */}
                <span className="inline-block px-2 py-0.5 rounded-md btn-gold text-navy-900 text-[11px] font-black font-sports">
                  #{activePlayer?.number}
                </span>

                {/* Player Name (Max 2 lines) */}
                <h3 className="text-base sm:text-lg font-black font-sports text-white leading-tight line-clamp-2">
                  {lang === 'ml' ? (activePlayer?.nameMl || activePlayer?.name) : activePlayer?.name}
                </h3>

                {/* Position */}
                {activePlayer?.position && (
                  <p className="text-xs text-gold font-bold">
                    {activePlayer.position}
                  </p>
                )}

                {/* Club Name */}
                <p className="text-[11px] text-navy-muted font-medium truncate">
                  {lang === 'ml' ? (activePlayer?.clubMl || activePlayer?.club) : activePlayer?.club}
                </p>
              </div>

              {/* Club Logo in 28px White Circle (Rule 3) */}
              <div className="w-7 h-7 rounded-full bg-white p-0.5 border border-navy-700 shadow-xs flex items-center justify-center shrink-0 mb-1">
                <TeamLogo 
                  teamName={activePlayer?.club} 
                  className="w-full h-full rounded-full object-contain" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Peeking Next Card Thumbnail (Rule 1: ~12% on right) */}
        <div 
          onClick={handleNextPlayer}
          className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 w-[12%] aspect-[9/16] rounded-2xl overflow-hidden opacity-40 hover:opacity-75 transition-opacity cursor-pointer border border-navy-700 shadow-md"
        >
          {nextPlayer?.posterUrl && (
            <img 
              src={nextPlayer.posterUrl} 
              alt={nextPlayer.name} 
              className="w-full h-full object-cover" 
            />
          )}
        </div>
      </div>
    </section>
  );
}
