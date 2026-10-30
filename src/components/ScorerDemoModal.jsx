import React, { useState } from 'react';
import { X, Smartphone, Zap, CheckCircle, Shield, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ScorerDemoModal({ isOpen, onClose, isDarkMode }) {
  if (!isOpen) return null;

  const [scorerLog, setScorerLog] = useState([
    'Match started: 08:00 PM',
    'Kickoff whistle blown by referee',
    '12\' - Goal Udaya Parambil Peedika (Ibrahim)',
    '24\' - Goal New Malaya Malabar FC (Jameel)',
  ]);

  const recordEvent = (text) => {
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    setScorerLog((prev) => [`Just now: ${text}`, ...prev.slice(0, 5)]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl">
        {/* Modal Top Bar */}
        <div className="bg-blue-900 p-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider font-sports">
                Official Scorer Mobile Panel
              </h3>
              <p className="text-[11px] text-blue-200">
                Ground Commentator & Referee Desk
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-black/20 hover:bg-black/40 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto text-slate-900">
          {/* Info pill */}
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-2">
            <Zap className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <span>
              <strong>Zero-Delay Matchday Tech:</strong> Tapping any button instantly pushes live score updates to all fans and Gulf viewers in &lt;50ms.
            </span>
          </div>

          {/* Quick Action Tap Buttons */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Quick Tap Actions (Single-Thumb):
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => recordEvent('⚽ Goal: UDAYA Parambil Peedika (+1)')}
                className="p-3.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex flex-col items-center justify-center shadow-sm active:scale-95 transition"
              >
                <span className="text-xl">⚽</span>
                <span>+ GOAL UDAYA</span>
              </button>

              <button
                onClick={() => recordEvent('⚽ Goal: NEW MALAYA MALABAR FC (+1)')}
                className="p-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-900 text-white font-bold text-xs flex flex-col items-center justify-center shadow-sm active:scale-95 transition"
              >
                <span className="text-xl">⚽</span>
                <span>+ GOAL NEW MALAYA</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                onClick={() => recordEvent('🟨 Yellow Card Recorded')}
                className="p-2.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 font-bold text-xs flex items-center justify-center gap-1 active:scale-95"
              >
                <span>🟨</span> Yellow Card
              </button>

              <button
                onClick={() => recordEvent('🟥 Red Card Recorded')}
                className="p-2.5 rounded-lg bg-red-50 border border-red-300 text-red-900 font-bold text-xs flex items-center justify-center gap-1 active:scale-95"
              >
                <span>🟥</span> Red Card
              </button>

              <button
                onClick={() => recordEvent('⏱️ Half-Time Whistle Blown')}
                className="p-2.5 rounded-lg bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs flex items-center justify-center gap-1 active:scale-95"
              >
                <span>⏱️</span> Half Time
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => recordEvent('🎯 Penalty Shootout Initiated')}
                className="p-2.5 rounded-lg bg-purple-50 border border-purple-300 text-purple-900 font-bold text-xs flex items-center justify-center gap-1 active:scale-95"
              >
                <span>🎯</span> Tie-Breaker Penalties
              </button>

              <button
                onClick={() => recordEvent('🏆 Full Time: Match Finished')}
                className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold text-xs flex items-center justify-center gap-1 active:scale-95"
              >
                <span>🏆</span> Final Whistle
              </button>
            </div>
          </div>

          {/* Live Push Log */}
          <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-xs space-y-1.5">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Live WebSocket Feed:</span>
              <span className="text-emerald-700 font-mono font-bold">CONNECTED</span>
            </div>
            {scorerLog.map((log, i) => (
              <div key={i} className="text-slate-800 font-mono text-[11px] truncate flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-800 transition"
          >
            Close Demo
          </button>
        </div>
      </div>
    </div>
  );
}
