import React, { useState, useEffect, useRef } from 'react';
import { Trophy, RotateCcw, Share2, Volume2, VolumeX, Sparkles, Flame, Shield, Target, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

// Lightweight Web Audio Sound Effects Synthesizer
class GameAudio {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playKick() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  playGoal() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    // Cheerful arpeggio
    const notes = [440, 554, 659, 880];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + idx * 0.08 + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + idx * 0.08);
      osc.stop(this.ctx.currentTime + idx * 0.08 + 0.25);
    });
  }

  playSave() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  playWhistle() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2600, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(2900, this.ctx.currentTime + 0.06);
    osc.frequency.linearRampToValueAtTime(2700, this.ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }
}

const audio = new GameAudio();

const TARGET_ZONES = [
  { id: 'top-left', label: '↖ Top Left', labelMl: '↖ മുകളിൽ ഇടത്', x: 20, y: 25 },
  { id: 'top-center', label: '⬆ Top Bar', labelMl: '⬆ ക്രോസ്ബാർ', x: 50, y: 20 },
  { id: 'top-right', label: '↗ Top Right', labelMl: '↗ മുകളിൽ വലത്', x: 80, y: 25 },
  { id: 'bottom-left', label: '↙ Low Left', labelMl: '↙ താഴെ ഇടത്', x: 22, y: 75 },
  { id: 'bottom-right', label: '↘ Low Right', labelMl: '↘ താഴെ വലത്', x: 78, y: 75 }
];

export default function SevensPenaltyGame({ lang, isDarkMode }) {
  const TOTAL_KICKS = 5;
  const [kickIndex, setKickIndex] = useState(0);
  const [results, setResults] = useState([]); // array of 'goal' | 'saved'
  const [isShooting, setIsShooting] = useState(false);
  const [shotTarget, setShotTarget] = useState(null);
  const [keeperPos, setKeeperPos] = useState({ x: 50, y: 55, dive: 'center' });
  const [lastShotOutcome, setLastShotOutcome] = useState(null); // 'goal' | 'saved' | null
  const [isGameOver, setIsGameOver] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('kasc_penalty_high_score') || '0', 10);
  });

  const goalsCount = results.filter((r) => r === 'goal').length;

  const handleShoot = (target) => {
    if (isShooting || isGameOver) return;

    audio.playKick();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(40);
    }

    setIsShooting(true);
    setShotTarget(target);
    setLastShotOutcome(null);

    // Goalkeeper AI decides dive zone (50-60% chance of diving to a random zone)
    const possibleKeeperZones = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'center'];
    const keeperChoice = possibleKeeperZones[Math.floor(Math.random() * possibleKeeperZones.length)];

    let kX = 50;
    let kY = 55;
    if (keeperChoice === 'top-left') { kX = 28; kY = 35; }
    else if (keeperChoice === 'top-right') { kX = 72; kY = 35; }
    else if (keeperChoice === 'bottom-left') { kX = 26; kY = 68; }
    else if (keeperChoice === 'bottom-right') { kX = 74; kY = 68; }
    else { kX = 50; kY = 50; }

    setKeeperPos({ x: kX, y: kY, dive: keeperChoice });

    // Determine outcome: If keeper guessed exact zone -> SAVED, otherwise GOAL!
    const isSaved = keeperChoice === target.id;

    setTimeout(() => {
      const outcome = isSaved ? 'saved' : 'goal';
      setLastShotOutcome(outcome);
      const nextResults = [...results, outcome];
      setResults(nextResults);

      if (outcome === 'goal') {
        audio.playGoal();
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 }
          });
        } catch (e) {
          // ignore
        }
      } else {
        audio.playSave();
      }

      // Check if round is finished
      const nextKick = kickIndex + 1;
      setKickIndex(nextKick);

      if (nextKick >= TOTAL_KICKS) {
        setTimeout(() => {
          setIsGameOver(true);
          const finalGoals = nextResults.filter((r) => r === 'goal').length;
          if (finalGoals > highScore) {
            setHighScore(finalGoals);
            localStorage.setItem('kasc_penalty_high_score', finalGoals.toString());
          }
          audio.playWhistle();
        }, 1200);
      } else {
        // Reset ball position after 1.4s for next kick
        setTimeout(() => {
          setIsShooting(false);
          setShotTarget(null);
          setKeeperPos({ x: 50, y: 55, dive: 'center' });
        }, 1200);
      }
    }, 450);
  };

  const handleRestart = () => {
    setKickIndex(0);
    setResults([]);
    setIsShooting(false);
    setShotTarget(null);
    setKeeperPos({ x: 50, y: 55, dive: 'center' });
    setLastShotOutcome(null);
    setIsGameOver(false);
    audio.playWhistle();
  };

  const handleShare = () => {
    const text = encodeURIComponent(
      `⚽ *അഖിലേന്ത്യാ സെവൻസ് - പെനാൽറ്റി ഷൂട്ടൗട്ട് ചലഞ്ച്!* 🏆\n\n` +
      `ഞാൻ 5 പെനാൽറ്റിയിൽ *${goalsCount}/5* ഗോളുകൾ നേടി! 🔥\n` +
      `നിങ്ങൾക്ക് എന്റെ സ്കോർ മറികടക്കാൻ കഴിയുമോ? കളിച്ചു നോക്കൂ: ${window.location.origin}/#game`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    audio.muted = next;
  };

  return (
    <div id="game" className={`rounded-3xl border overflow-hidden p-4 sm:p-6 transition-colors shadow-sm ${
      isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 text-white flex items-center justify-center font-black shadow-xs shrink-0">
            ⚽
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black font-sports uppercase tracking-wider text-slate-950">
                {lang === 'ml' ? 'സെവൻസ് പെനാൽറ്റി ഷൂട്ടൗട്ട്' : 'SEVENS PENALTY SHOOTOUT'}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-black uppercase tracking-wider">
                Mini Game
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              {lang === 'ml' 
                ? '5 പെനാൽറ്റി ഷോട്ടുകൾ • ദിശ തിരഞ്ഞെടുത്ത് ഗോളടിക്കൂ!' 
                : '5 Penalty kicks • Choose target zone & beat the goalkeeper!'}
            </p>
          </div>
        </div>

        {/* Right Info: High Score & Sound */}
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span>Best: {highScore}/5</span>
          </div>

          <button
            onClick={toggleMute}
            className={`p-2 rounded-xl border transition active:scale-90 ${
              isMuted ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-blue-50 text-blue-700 border-blue-200 shadow-xs'
            }`}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Kick Progress Indicators */}
      <div className="mt-3.5 flex items-center justify-between text-xs font-bold px-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-500 uppercase font-sports">Shot:</span>
          <div className="flex items-center gap-1.5">
            {[0, 1, 2, 3, 4].map((i) => {
              const res = results[i];
              return (
                <span
                  key={i}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border font-black transition-all ${
                    res === 'goal'
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs scale-105'
                      : res === 'saved'
                        ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                        : i === kickIndex && !isGameOver
                          ? 'bg-amber-400 text-slate-950 border-amber-500 animate-pulse'
                          : 'bg-slate-100 text-slate-400 border-slate-300'
                  }`}
                >
                  {res === 'goal' ? '⚽' : res === 'saved' ? '✕' : i + 1}
                </span>
              );
            })}
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-sports font-black text-emerald-600">
            {goalsCount} / {kickIndex} Goals
          </span>
        </div>
      </div>

      {/* Main Pitch & Goal Arena */}
      <div className="relative mt-3 rounded-2xl overflow-hidden border border-emerald-900/40 shadow-inner bg-gradient-to-b from-emerald-800 via-emerald-700 to-emerald-900 h-64 sm:h-72 select-none">
        {/* Grass Texture & Markings */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        {/* Goal Post Frame */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[85%] sm:w-[75%] h-36 border-4 border-white/95 rounded-t-lg shadow-2xl bg-white/5 backdrop-blur-xs flex flex-col justify-between">
          {/* Net Mesh Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff20_1px,transparent_1px),linear-gradient(to_bottom,#ffffff20_1px,transparent_1px)] bg-[size:12px_12px] opacity-70"></div>

          {/* Goal Post Crossbar Branding */}
          <div className="relative z-10 w-full py-0.5 bg-black/40 text-center text-[9px] font-sports font-black tracking-widest text-amber-300">
            UDAYA KASC SEVENS • PARAMPIL PEEDIKA
          </div>

          {/* Target Zone Clickable Overlays */}
          {!isShooting && !isGameOver && (
            <div className="absolute inset-0 z-20 grid grid-cols-3 grid-rows-2 p-2 gap-2">
              <button
                onClick={() => handleShoot(TARGET_ZONES[0])}
                className="rounded-lg border-2 border-dashed border-amber-300/60 bg-amber-400/10 hover:bg-amber-400/30 flex items-center justify-center text-amber-200 text-xs font-black transition active:scale-95 group"
                title="Top Left Corner"
              >
                <Target className="w-5 h-5 group-hover:scale-110 transition" />
              </button>
              <button
                onClick={() => handleShoot(TARGET_ZONES[1])}
                className="rounded-lg border-2 border-dashed border-amber-300/60 bg-amber-400/10 hover:bg-amber-400/30 flex items-center justify-center text-amber-200 text-xs font-black transition active:scale-95 group"
                title="Top Center Bar Down"
              >
                <Target className="w-5 h-5 group-hover:scale-110 transition" />
              </button>
              <button
                onClick={() => handleShoot(TARGET_ZONES[2])}
                className="rounded-lg border-2 border-dashed border-amber-300/60 bg-amber-400/10 hover:bg-amber-400/30 flex items-center justify-center text-amber-200 text-xs font-black transition active:scale-95 group"
                title="Top Right Corner"
              >
                <Target className="w-5 h-5 group-hover:scale-110 transition" />
              </button>
              <button
                onClick={() => handleShoot(TARGET_ZONES[3])}
                className="rounded-lg border-2 border-dashed border-amber-300/60 bg-amber-400/10 hover:bg-amber-400/30 flex items-center justify-center text-amber-200 text-xs font-black transition active:scale-95 group"
                title="Bottom Left Low Drive"
              >
                <Target className="w-5 h-5 group-hover:scale-110 transition" />
              </button>
              <div></div> {/* Empty center bottom */}
              <button
                onClick={() => handleShoot(TARGET_ZONES[4])}
                className="rounded-lg border-2 border-dashed border-amber-300/60 bg-amber-400/10 hover:bg-amber-400/30 flex items-center justify-center text-amber-200 text-xs font-black transition active:scale-95 group"
                title="Bottom Right Low Drive"
              >
                <Target className="w-5 h-5 group-hover:scale-110 transition" />
              </button>
            </div>
          )}

          {/* Goalkeeper */}
          <div
            style={{
              left: `${keeperPos.x}%`,
              top: `${keeperPos.y}%`,
              transform: `translate(-50%, -50%) ${
                keeperPos.dive === 'top-left' || keeperPos.dive === 'bottom-left'
                  ? 'rotate(-25deg) scale(1.05)'
                  : keeperPos.dive === 'top-right' || keeperPos.dive === 'bottom-right'
                    ? 'rotate(25deg) scale(1.05)'
                    : 'rotate(0deg)'
              }`
            }}
            className="absolute z-15 transition-all duration-300 ease-out flex flex-col items-center"
          >
            {/* Goalkeeper Jersey & Gloves */}
            <div className="w-9 h-11 sm:w-11 sm:h-13 bg-gradient-to-b from-yellow-400 to-amber-500 border-2 border-amber-300 rounded-lg shadow-xl flex flex-col items-center justify-between p-1">
              <span className="text-[10px] font-black text-slate-950 font-sports">GK 1</span>
              <div className="flex justify-between w-full text-[10px]">
                <span>🧤</span>
                <span>🧤</span>
              </div>
            </div>
          </div>
        </div>

        {/* Penalty Spot Line */}
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 w-28 h-0.5 bg-white/60"></div>
        <div className="absolute bottom-13 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white shadow-md"></div>

        {/* Football */}
        <div
          style={{
            left: isShooting && shotTarget ? `${shotTarget.x}%` : '50%',
            bottom: isShooting ? '42%' : '44px',
            transform: `translate(-50%, 50%) ${isShooting ? 'scale(0.55) rotate(720deg)' : 'scale(1) rotate(0deg)'}`,
            transition: 'all 0.42s cubic-bezier(0.25, 1, 0.5, 1)'
          }}
          className="absolute z-30 pointer-events-none drop-shadow-2xl"
        >
          <span className="text-3xl sm:text-4xl filter drop-shadow-md inline-block select-none">
            ⚽
          </span>
        </div>

        {/* Shot Outcome Flash Banner */}
        {lastShotOutcome && (
          <div className="absolute inset-x-0 bottom-3 flex justify-center z-40 animate-bounce">
            {lastShotOutcome === 'goal' ? (
              <div className="py-1 px-4 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-black text-xs sm:text-sm shadow-xl flex items-center gap-1.5 border border-emerald-300">
                <span>🔥</span>
                <span>GOOOAL! (ഗോൾ!)</span>
                <span>🎉</span>
              </div>
            ) : (
              <div className="py-1 px-4 rounded-full bg-gradient-to-r from-rose-600 to-red-700 text-white font-black text-xs sm:text-sm shadow-xl flex items-center gap-1.5 border border-red-300">
                <span>🧤</span>
                <span>SAVED BY KEEPER! (സേവ്!)</span>
              </div>
            )}
          </div>
        )}

        {/* Instruction overlay when ready */}
        {!isShooting && !isGameOver && (
          <div className="absolute top-1 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-bold backdrop-blur-xs flex items-center gap-1.5 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
            <span>{lang === 'ml' ? 'ടാർഗറ്റിൽ ക്ലിക്ക് ചെയ്ത് ഷൂട്ട് ചെയ്യൂ!' : 'Tap any target to shoot!'}</span>
          </div>
        )}
      </div>

      {/* Target Direction Quick Buttons for Mobile */}
      {!isGameOver && (
        <div className="mt-3 grid grid-cols-5 gap-1.5 text-center">
          {TARGET_ZONES.map((zone) => (
            <button
              key={zone.id}
              onClick={() => handleShoot(zone)}
              disabled={isShooting}
              className={`py-2 px-1 rounded-xl text-[10px] font-bold border transition active:scale-90 flex flex-col items-center justify-center ${
                isShooting
                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                  : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-900 shadow-2xs'
              }`}
            >
              <Target className="w-3.5 h-3.5 text-emerald-600 mb-0.5" />
              <span className="truncate w-full">{zone.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Game Over Celebration Card */}
      {isGameOver && (
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white border border-slate-800 shadow-xl space-y-3 animate-fadeIn text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase">
            <Award className="w-4 h-4 text-slate-950" />
            <span>Matchday Penalty Result</span>
          </div>

          <div>
            <div className="text-3xl sm:text-4xl font-sports font-black text-amber-400 tracking-wider">
              {goalsCount} / {TOTAL_KICKS} GOALS
            </div>
            <p className="text-xs text-slate-300 font-medium mt-1 font-malayalam">
              {goalsCount === 5 
                ? '🏆 അത്യുഗ്രൻ! നിങ്ങൾ ഒരു സെവൻസ് ഇതിഹാസമാണ് (Sevens Legend)!'
                : goalsCount >= 3
                  ? '⚽ മികച്ച പ്രകടനം! സൂപ്പർ സ്ട്രൈക്കർ പദവി!'
                  : '🏃 നല്ലൊരു ശ്രമം! വീണ്ടും കളിച്ചു പരിശീലിക്കൂ!'}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
            <button
              onClick={handleRestart}
              className="py-2.5 px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition active:scale-95 shadow-md"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{lang === 'ml' ? 'വീണ്ടും കളിക്കുക' : 'Play Again'}</span>
            </button>

            <button
              onClick={handleShare}
              className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition active:scale-95 shadow-md"
            >
              <Share2 className="w-4 h-4" />
              <span>{lang === 'ml' ? 'സുഹൃത്തുക്കളെ വെല്ലുവിളിക്കൂ' : 'Share on WhatsApp'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
