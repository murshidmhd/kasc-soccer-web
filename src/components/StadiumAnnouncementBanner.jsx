import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Radio, Sparkles, Mic, Music } from 'lucide-react';

export default function StadiumAnnouncementBanner({ lang, isDarkMode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(27);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const setAudioDuration = () => setDuration(audio.duration || 27);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', setAudioDuration);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', setAudioDuration);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        console.error('Audio play error:', e);
      });
    }
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className={`rounded-2xl sm:rounded-3xl border overflow-hidden p-3.5 sm:p-4 transition-colors shadow-xs ${
      isDarkMode 
        ? 'bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border-slate-800 text-white' 
        : 'bg-gradient-to-r from-blue-50 via-white to-amber-50 border-blue-200 text-slate-900 shadow-xs'
    }`}>
      {/* Hidden Native Audio Element */}
      <audio ref={audioRef} src="/sevens_announcement.mp3" preload="metadata" />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left info badge & animated mic */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={togglePlay}
            className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-800 text-white flex items-center justify-center shrink-0 shadow-md hover:scale-105 active:scale-95 transition"
            title={isPlaying ? 'Pause Announcement' : 'Play Stadium Announcement'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          <div className="leading-tight flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
                Official Mic
              </span>
              <h4 className="text-xs sm:text-sm font-black font-sports uppercase tracking-wider text-slate-950">
                {lang === 'ml' ? 'സ്റ്റേഡിയം അനൗൺസ്മെന്റ്' : 'STADIUM AUDIO ANNOUNCEMENT'}
              </h4>
            </div>
            <p className="text-[11px] text-slate-600 font-medium truncate max-w-[240px] sm:max-w-md mt-0.5">
              {lang === 'ml' 
                ? 'ഉദയ പറമ്പിൽ പീടിക & KASC പെരുവള്ളൂർ സീസൺ 7 ഒഫീഷ്യൽ അനൗൺസ്മെന്റ്' 
                : 'Listen to the official Malappuram Sevens tournament broadcast announcement'}
            </p>
          </div>
        </div>

        {/* Right audio waveform visualizer & progress */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {/* Animated Equalizer Wave Bars */}
          <div className="flex items-center gap-1 h-5 px-2">
            {[40, 75, 55, 95, 60, 80, 45].map((h, i) => (
              <div
                key={i}
                className={`w-1 rounded-full bg-blue-600 transition-all duration-300 ${
                  isPlaying ? 'animate-pulse' : 'opacity-40'
                }`}
                style={{
                  height: isPlaying ? `${h}%` : '20%',
                  animationDelay: `${i * 120}ms`
                }}
              />
            ))}
          </div>

          {/* Time & Play status */}
          <div className="text-right">
            <span className="font-mono text-xs font-bold text-slate-700 block">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase">
              {isPlaying ? 'Playing • ലൈവ്' : 'Tap to Listen'}
            </span>
          </div>

          <button
            onClick={togglePlay}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs shadow-xs transition active:scale-95 ${
              isPlaying
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-blue-700 hover:bg-blue-800 text-white'
            }`}
          >
            {isPlaying ? (lang === 'ml' ? 'നിർത്തുക' : 'Pause') : (lang === 'ml' ? 'കേൾക്കാം 📢' : 'Play Mic 📢')}
          </button>
        </div>
      </div>

      {/* Scrubber track */}
      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-2">
        <input
          type="range"
          min="0"
          max={duration || 27}
          step="0.1"
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
      </div>
    </div>
  );
}
