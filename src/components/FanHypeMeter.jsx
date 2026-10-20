import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Flame, BellRing, Heart, Radio, Music } from 'lucide-react';
import { openingMatch } from '../data/tournamentData';
import TeamLogo from './TeamLogo';

// Lightweight Web Audio API Synthesizer (No external MP3 files needed!)
class StadiumAudio {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playWhistle() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // High pitched whistle ~2800 Hz with vibrato
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2600, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(2900, this.ctx.currentTime + 0.08);
    osc.frequency.linearRampToValueAtTime(2700, this.ctx.currentTime + 0.18);

    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.28);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.28);
  }

  playDrum() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    // Chenda / Stadium bass drum punch
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(38, this.ctx.currentTime + 0.18);

    gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.22);
  }

  playHorn() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    // Stadium Vuvuzela / Horn
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(233.08, this.ctx.currentTime); // Bb3
    osc.frequency.linearRampToValueAtTime(235, this.ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);
  }
}

const audioSynth = new StadiumAudio();

export default function FanHypeMeter({ lang, isDarkMode }) {
  const [cheersHome, setCheersHome] = useState(() => {
    return parseInt(localStorage.getItem('kasc_cheers_home') || '2840', 10);
  });

  const [cheersAway, setCheersAway] = useState(() => {
    return parseInt(localStorage.getItem('kasc_cheers_away') || '2310', 10);
  });

  const [isMuted, setIsMuted] = useState(false);
  const [activeReaction, setActiveReaction] = useState(null);
  const [floatingIcons, setFloatingIcons] = useState([]);

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    audioSynth.muted = next;
  };

  const triggerFloatingEffect = (iconType, side) => {
    const newId = Date.now() + Math.random();
    setFloatingIcons((prev) => [
      ...prev.slice(-8), // Keep max 8 floating icons in memory
      { id: newId, icon: iconType, side, left: Math.floor(Math.random() * 60) + 20 }
    ]);

    setTimeout(() => {
      setFloatingIcons((prev) => prev.filter((item) => item.id !== newId));
    }, 1200);
  };

  const handleCheerHome = () => {
    audioSynth.playDrum();
    const next = cheersHome + 1;
    setCheersHome(next);
    localStorage.setItem('kasc_cheers_home', next.toString());
    triggerFloatingEffect('💙', 'home');
  };

  const handleCheerAway = () => {
    audioSynth.playDrum();
    const next = cheersAway + 1;
    setCheersAway(next);
    localStorage.setItem('kasc_cheers_away', next.toString());
    triggerFloatingEffect('💛', 'away');
  };

  const handleSoundTrigger = (type) => {
    if (type === 'whistle') {
      audioSynth.playWhistle();
      triggerFloatingEffect('📢', 'center');
    } else if (type === 'drum') {
      audioSynth.playDrum();
      triggerFloatingEffect('🥁', 'center');
    } else if (type === 'horn') {
      audioSynth.playHorn();
      triggerFloatingEffect('🎺', 'center');
    }
  };

  const totalCheers = cheersHome + cheersAway;
  const homePercent = Math.round((cheersHome / totalCheers) * 100);
  const awayPercent = 100 - homePercent;

  return (
    <div className={`rounded-2xl sm:rounded-3xl border overflow-hidden p-4 sm:p-6 transition-colors shadow-xs relative ${
      isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
    }`}>
      {/* Floating Reactions Container */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
        {floatingIcons.map((item) => (
          <div
            key={item.id}
            className={`absolute bottom-6 text-2xl animate-float-fade transition-all ${
              item.side === 'home'
                ? 'left-8 sm:left-16'
                : item.side === 'away'
                  ? 'right-8 sm:right-16'
                  : 'left-1/2 -translate-x-1/2'
            }`}
          >
            {item.icon}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
            <Flame className="w-5 h-5 text-red-600 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black font-sports uppercase tracking-wider text-slate-950">
              {lang === 'ml' ? 'ഗ്യാലറി ഹൈപ്പ് മീറ്റർ' : 'GALLERY HYPE METER'}
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              {lang === 'ml'
                ? 'നിങ്ങളുടെ ടീമിന് വേണ്ടി കയ്യടിക്കൂ... വിസിൽ അടിക്കൂ!'
                : 'Tap to cheer for your team & blow the stadium whistle!'}
            </p>
          </div>
        </div>

        {/* Audio Mute / Unmute Toggle */}
        <button
          onClick={toggleMute}
          className={`p-2 rounded-xl border transition active:scale-95 flex items-center gap-1.5 text-xs font-bold ${
            isMuted
              ? 'bg-slate-100 text-slate-400 border-slate-200'
              : 'bg-blue-50 text-blue-700 border-blue-200 shadow-xs'
          }`}
          title={isMuted ? 'Unmute Stadium Sounds' : 'Mute Stadium Sounds'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Sound ON'}</span>
        </button>
      </div>

      {/* Rivalry Cheer Bar */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-blue-700 flex items-center gap-1 font-sports">
            <TeamLogo teamName={openingMatch.teamHome.name} className="w-4 h-4" />
            <span>UDAYA: {cheersHome.toLocaleString()}</span>
          </span>
          <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
            Matchday Roar
          </span>
          <span className="text-amber-700 flex items-center gap-1 font-sports">
            <span>SABAN FC: {cheersAway.toLocaleString()}</span>
            <TeamLogo teamName={openingMatch.teamAway.name} className="w-4 h-4" />
          </span>
        </div>

        {/* Percentage bar */}
        <div className="h-3 rounded-full bg-slate-100 overflow-hidden flex border border-slate-200 p-0.5 gap-0.5">
          <div
            style={{ width: `${homePercent}%` }}
            className="bg-blue-600 rounded-l-full transition-all duration-300"
          />
          <div
            style={{ width: `${awayPercent}%` }}
            className="bg-amber-500 rounded-r-full transition-all duration-300"
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 px-0.5">
          <span className="text-blue-700">{homePercent}% Hype</span>
          <span className="text-amber-700">{awayPercent}% Hype</span>
        </div>
      </div>

      {/* Dual Cheer Buttons */}
      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <button
          onClick={handleCheerHome}
          className="p-3 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-700 hover:from-blue-700 hover:to-sky-800 text-white font-bold text-xs sm:text-sm shadow-xs transition active:scale-95 flex items-center justify-center gap-2"
        >
          <span className="text-base">👏</span>
          <span>{lang === 'ml' ? 'ഉദയക്ക് കയ്യടി!' : 'Cheer UDAYA!'}</span>
        </button>

        <button
          onClick={handleCheerAway}
          className="p-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-slate-950 font-black text-xs sm:text-sm shadow-xs transition active:scale-95 flex items-center justify-center gap-2"
        >
          <span className="text-base">👏</span>
          <span>{lang === 'ml' ? 'സബാന് കയ്യടി!' : 'Cheer SABAN!'}</span>
        </button>
      </div>

      {/* Stadium Sound Effects Bar (Whistle, Chenda, Horn) */}
      <div className="mt-3.5 pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {lang === 'ml' ? 'സ്റ്റേഡിയം സൗണ്ട് ബോർഡ് (തത്സമയം കേൾക്കാം)' : 'Stadium Soundboard (Tap to Play)'}
          </span>
          <span className="text-[10px] text-slate-400">Web Audio FX</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleSoundTrigger('whistle')}
            className="py-2 px-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 active:scale-95 transition flex items-center justify-center gap-1.5 text-xs font-bold text-slate-800"
          >
            <span>📢</span>
            <span>{lang === 'ml' ? 'വിസിൽ' : 'Whistle'}</span>
          </button>

          <button
            onClick={() => handleSoundTrigger('drum')}
            className="py-2 px-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 active:scale-95 transition flex items-center justify-center gap-1.5 text-xs font-bold text-slate-800"
          >
            <span>🥁</span>
            <span>{lang === 'ml' ? 'ചെണ്ട' : 'Chenda'}</span>
          </button>

          <button
            onClick={() => handleSoundTrigger('horn')}
            className="py-2 px-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 active:scale-95 transition flex items-center justify-center gap-1.5 text-xs font-bold text-slate-800"
          >
            <span>🎺</span>
            <span>{lang === 'ml' ? 'ഹോൺ' : 'Vuvuzela'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
