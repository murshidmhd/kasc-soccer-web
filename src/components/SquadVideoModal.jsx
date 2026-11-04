import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle, 
  RotateCw, 
  Sparkles, 
  WifiOff, 
  Shield 
} from 'lucide-react';

export default function SquadVideoModal({ 
  isOpen, 
  onClose, 
  players, 
  currentIndex, 
  onNavigate, 
  lang 
}) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isBuffering, setIsBuffering] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [userRequestedVideoLoad, setUserRequestedVideoLoad] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const videoRef = useRef(null);

  const currentPlayer = players && players[currentIndex] ? players[currentIndex] : null;

  // Check if browser/network is in Data Saver mode (Rule 6)
  const isDataSaverActive = useCallback(() => {
    if (typeof navigator === 'undefined') return false;
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!conn) return false;
    if (conn.saveData) return true;
    if (conn.effectiveType === '2g' || conn.effectiveType === '3g') return true;
    return false;
  }, []);

  const shouldHoldVideoForDataSaver = isDataSaverActive() && !userRequestedVideoLoad;

  // Handle browser back button (Rule 4)
  useEffect(() => {
    if (!isOpen) return;

    // Push state for back button navigation
    window.history.pushState({ squadModalOpen: true }, '');

    const handlePopState = () => {
      onClose();
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isOpen, onClose]);

  // Pause when tab is hidden or modal closes (Rule 5)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  // Reset video states on player change
  useEffect(() => {
    if (!isOpen) return;
    setIsBuffering(true);
    setHasError(false);
    setIsPlaying(true);
    setUserRequestedVideoLoad(false);

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      if (!shouldHoldVideoForDataSaver) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            setIsPlaying(false);
          });
        }
      }
    }
  }, [currentIndex, isOpen, shouldHoldVideoForDataSaver]);

  // Handle Play/Pause toggle
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Handle Mute toggle
  const toggleMute = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Swipe navigation (Rule 4)
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentIndex < players.length - 1) {
      onNavigate(currentIndex + 1);
    } else if (isRightSwipe && currentIndex > 0) {
      onNavigate(currentIndex - 1);
    }
  };

  const handleManualVideoLoad = (e) => {
    e.stopPropagation();
    setUserRequestedVideoLoad(true);
    setIsBuffering(true);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => setIsPlaying(false));
    }
  };

  const handleRetry = (e) => {
    e.stopPropagation();
    setHasError(false);
    setIsBuffering(true);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => setIsPlaying(false));
    }
  };

  if (!isOpen || !currentPlayer) return null;

  const currentVideoSource = currentPlayer.devFallbackUrl || currentPlayer.videoUrl;

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#071433] flex flex-col justify-between select-none overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Top Bar with Safe Area inset */}
      <div className="pt-safe px-4 py-3 flex items-center justify-between w-full bg-gradient-to-b from-[#071433] to-transparent z-20">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full btn-gold text-xs font-black uppercase font-sports shadow-xs">
            #{currentPlayer.number}
          </span>
          <div className="min-w-0">
            <h3 className="text-white font-sports font-black text-sm sm:text-base leading-tight truncate">
              {lang === 'ml' ? (currentPlayer.nameMl || currentPlayer.name) : currentPlayer.name}
            </h3>
            <p className="text-[11px] text-navy-muted truncate">
              {lang === 'ml' ? (currentPlayer.clubMl || currentPlayer.club) : currentPlayer.club}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* AI Visual Badge (Rule 8) */}
          {currentPlayer.isAiGenerated && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-navy-800 border border-navy-700 text-[10px] font-bold text-gold">
              <Sparkles className="w-3 h-3 text-gold" />
              <span>AI Visual</span>
            </span>
          )}

          {/* Sound Mute/Unmute Button (Rule 5) */}
          <button
            onClick={toggleMute}
            className="w-11 h-11 rounded-full bg-navy-800/90 border border-navy-700 text-white flex items-center justify-center transition active:scale-95 shadow-xs"
            title={isMuted ? 'Unmute' : 'Mute'}
            aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-navy-muted" /> : <Volume2 className="w-5 h-5 text-gold" />}
          </button>

          {/* Close Button (Rule 4: Minimum 44x44px touch target) */}
          <button
            onClick={() => {
              if (window.history.state?.squadModalOpen) {
                window.history.back();
              } else {
                onClose();
              }
            }}
            className="w-11 h-11 rounded-full bg-navy-800/90 border border-navy-700 text-white flex items-center justify-center transition active:scale-95 shadow-xs"
            title="Close viewer"
            aria-label="Close viewer"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Main Video Presentation Stage */}
      <div 
        onClick={togglePlay}
        className="relative flex-1 w-full max-w-lg mx-auto flex items-center justify-center overflow-hidden cursor-pointer"
      >
        {/* Poster Fallback / Background while loading or on error */}
        {(shouldHoldVideoForDataSaver || hasError || !currentVideoSource) && (
          <div className="absolute inset-0 flex items-center justify-center p-4">
            {currentPlayer.posterUrl ? (
              <img
                src={currentPlayer.posterUrl}
                alt={currentPlayer.name}
                className="w-full h-full object-contain max-h-[80vh] rounded-2xl"
              />
            ) : (
              <div className="w-full h-full max-h-[70vh] rounded-2xl surface-navy-card flex flex-col items-center justify-center text-center p-6">
                <Shield className="w-16 h-16 text-gold mb-3" />
                <h4 className="text-white font-sports font-bold text-lg">{currentPlayer.name}</h4>
                <p className="text-xs text-navy-muted">#{currentPlayer.number} • {currentPlayer.club}</p>
              </div>
            )}
          </div>
        )}

        {/* Video Element (Rule 5: playsInline, loop, muted, preload="none") */}
        {currentVideoSource && !shouldHoldVideoForDataSaver && (
          <video
            ref={videoRef}
            src={currentVideoSource}
            poster={currentPlayer.posterUrl || undefined}
            playsInline
            loop
            muted={isMuted}
            preload="metadata"
            className="w-full h-full object-contain max-h-[82vh] transition-opacity duration-200"
            onWaiting={() => setIsBuffering(true)}
            onPlaying={() => setIsBuffering(false)}
            onCanPlay={() => setIsBuffering(false)}
            onError={() => {
              setIsBuffering(false);
              setHasError(true);
            }}
          />
        )}

        {/* Data Saver Mode Warning & Tap to Load (Rule 6) */}
        {shouldHoldVideoForDataSaver && (
          <div className="absolute inset-0 bg-[#071433]/85 flex flex-col items-center justify-center p-6 text-center space-y-3 z-30">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-gold flex items-center justify-center border border-gold/40">
              <WifiOff className="w-6 h-6 text-gold" />
            </div>
            <div>
              <h4 className="text-white font-sports font-black text-base uppercase">
                {lang === 'ml' ? 'ഡാറ്റ സേവർ മോഡ് സജീവമാണ്' : 'Data Saver Mode Active'}
              </h4>
              <p className="text-xs text-navy-muted mt-1 max-w-xs leading-relaxed">
                {lang === 'ml' 
                  ? 'മൊബൈൽ ഡാറ്റ ലാഭിക്കാൻ വീഡിയോ ഓട്ടോ-പ്ലേ നിർത്തിവെച്ചിരിക്കുന്നു.' 
                  : 'Video autoplay paused to save cellular data.'}
              </p>
            </div>
            <button
              onClick={handleManualVideoLoad}
              className="min-h-[44px] px-5 py-2.5 rounded-xl btn-gold font-bold text-xs uppercase flex items-center gap-2 shadow-md active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{lang === 'ml' ? `വീഡിയോ ലോഡ് ചെയ്യുക (${currentPlayer.fileSize})` : `Tap to load video (${currentPlayer.fileSize})`}</span>
            </button>
          </div>
        )}

        {/* Video Buffering Spinner (Rule 7) */}
        {isBuffering && !hasError && !shouldHoldVideoForDataSaver && currentVideoSource && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className="w-12 h-12 rounded-full border-3 border-gold/30 border-t-gold animate-spin"></div>
          </div>
        )}

        {/* Play / Pause Tap Overlay Indicator */}
        {!isPlaying && !isBuffering && !hasError && !shouldHoldVideoForDataSaver && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 bg-black/20">
            <div className="w-16 h-16 rounded-full bg-navy-900/80 border border-gold text-gold flex items-center justify-center shadow-lg">
              <Play className="w-8 h-8 fill-gold ml-1" />
            </div>
          </div>
        )}

        {/* Video Error Unavailable Fallback (Rule 7) */}
        {hasError && (
          <div className="absolute inset-0 bg-[#071433]/85 flex flex-col items-center justify-center p-6 text-center space-y-3 z-30">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/40">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h4 className="text-white font-sports font-black text-base uppercase">
                {lang === 'ml' ? 'വീഡിയോ ലഭ്യമല്ല' : 'Video Unavailable'}
              </h4>
              <p className="text-xs text-navy-muted mt-1 max-w-xs leading-relaxed">
                {lang === 'ml' 
                  ? 'നെറ്റ്‌വർക്ക് തകരാർ കാരണമായിരിക്കാം. ദയവായി വീണ്ടും ശ്രമിക്കുക.' 
                  : 'Could not stream video. Please check your network and retry.'}
              </p>
            </div>
            <button
              onClick={handleRetry}
              className="min-h-[44px] px-5 py-2.5 rounded-xl btn-royal text-white font-bold text-xs uppercase flex items-center gap-2 shadow-md active:scale-95"
            >
              <RotateCw className="w-4 h-4" />
              <span>{lang === 'ml' ? 'വീണ്ടും ശ്രമിക്കുക' : 'Retry'}</span>
            </button>
          </div>
        )}

        {/* Previous Player Button (Rule 4: Minimum 44x44px target) */}
        {currentIndex > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(currentIndex - 1);
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-navy-800/80 border border-navy-700 text-white flex items-center justify-center transition active:scale-95 shadow-md z-30"
            title="Previous player"
            aria-label="Previous player"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Next Player Button (Rule 4: Minimum 44x44px target) */}
        {currentIndex < players.length - 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(currentIndex + 1);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-navy-800/80 border border-navy-700 text-white flex items-center justify-center transition active:scale-95 shadow-md z-30"
            title="Next player"
            aria-label="Next player"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Bottom Information Card & Swipe Guidance */}
      <div className="pb-safe px-4 py-3 bg-gradient-to-t from-[#071433] via-[#071433]/90 to-transparent z-20">
        <div className="max-w-md mx-auto text-center space-y-1">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-gold font-sports">
            <span>{currentPlayer.position || 'Player Spotlight'}</span>
            <span>•</span>
            <span>{currentIndex + 1} of {players.length}</span>
          </div>
          <p className="text-[11px] text-navy-muted">
            {lang === 'ml' ? 'അടുത്ത താരത്തെ കാണാൻ ഇടത്തോട്ട് / വലത്തോട്ട് സ്വൈപ്പ് ചെയ്യുക' : 'Swipe left/right or use arrows to view squad'}
          </p>
        </div>
      </div>
    </div>
  );
}
