import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Radio, 
  Users, 
  Flame, 
  Zap, 
  Trophy, 
  ShieldCheck, 
  Share2, 
  Clock, 
  Lock, 
  AlertCircle, 
  CheckCircle2, 
  Settings 
} from 'lucide-react';
import { openingMatch } from '../data/tournamentData';
import TeamLogo from './TeamLogo';
import { 
  getStoredMatchState, 
  submitFanCrowdGoal, 
  getUserRateLimitStatus 
} from '../utils/matchStateManager';

export default function LiveMatchCard({ lang, isDarkMode, onOpenAdminPanel }) {
  const [matchState, setMatchState] = useState(getStoredMatchState);
  const [rateLimit, setRateLimit] = useState(getUserRateLimitStatus);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync with global custom event when Admin updates score
  useEffect(() => {
    const handleStateUpdate = (e) => {
      if (e.detail) {
        setMatchState(e.detail);
      } else {
        setMatchState(getStoredMatchState());
      }
    };

    window.addEventListener('kasc_match_state_updated', handleStateUpdate);
    return () => window.removeEventListener('kasc_match_state_updated', handleStateUpdate);
  }, []);

  // Cooldown countdown timer interval
  useEffect(() => {
    const interval = setInterval(() => {
      setRateLimit(getUserRateLimitStatus());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCrowdGoal = (team) => {
    const result = submitFanCrowdGoal(team);

    if (result.success) {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
      setRateLimit(getUserRateLimitStatus());
      setToastMessage({
        type: 'success',
        text: `✅ ${result.message} (Rate limited for 45s to stop spam)`
      });
    } else {
      setToastMessage({
        type: 'error',
        text: result.message
      });
    }

    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const getStatusBadge = () => {
    switch (matchState.status) {
      case 'UPCOMING':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 font-bold text-[10px] sm:text-xs border border-blue-200">
            Upcoming • Nov 06, 8:00 PM
          </span>
        );
      case '1ST_HALF':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-600 text-white font-bold text-[10px] sm:text-xs uppercase shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
            LIVE • 1st Half • {matchState.matchMinute}'
          </span>
        );
      case 'HALF_TIME':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] sm:text-xs uppercase shadow-xs">
            ⏸️ Half Time (HT)
          </span>
        );
      case '2ND_HALF':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-600 text-white font-bold text-[10px] sm:text-xs uppercase shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
            LIVE • 2nd Half • {matchState.matchMinute}'
          </span>
        );
      case 'FULL_TIME':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white font-black text-[10px] sm:text-xs uppercase shadow-xs border border-slate-700">
            🏁 FULL TIME (FINAL)
          </span>
        );
      default:
        return null;
    }
  };

  const isLive = matchState.status !== 'UPCOMING';

  return (
    <section id="live-match" className="w-full">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="p-1 rounded-md bg-red-600 text-white">
              <Flame className="w-3.5 h-3.5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-sports uppercase tracking-wider text-slate-950">
              {lang === 'ml' ? 'മാച്ച് സെന്റർ' : 'MATCH CENTER'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            {lang === 'ml'
              ? 'ഔദ്യോഗിക തത്സമയ സ്കോറും പന്ത് തട്ടുന്ന നിമിഷങ്ങളും'
              : 'Official live score verified by Ground Referee Desk'}
          </p>
        </div>

        {/* Admin Desk Trigger Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAdminPanel}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition active:scale-95 bg-white border-blue-200 text-blue-800 hover:bg-blue-50 shadow-xs"
            title="Open Official Scorer Desk"
          >
            <Settings className="w-3.5 h-3.5 text-blue-600" />
            <span>Admin / Scorer Desk</span>
          </button>
        </div>
      </div>

      {/* Main Match Scorecard */}
      <div className={`rounded-3xl overflow-hidden border p-4 sm:p-7 relative shadow-xs transition-colors ${
        isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Top Match Ribbon with Official Verification Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-900 font-bold text-[10px] sm:text-xs border border-blue-200">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Official Scorer Verified</span>
            </span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">•</span>
            <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
              Day 1 Blockbuster
            </span>
          </div>

          <div className="flex items-center gap-2">
            {getStatusBadge()}
          </div>
        </div>

        {/* Mobile-Perfect Scoreboard (UDAYA vs SABAN FC) */}
        <div className="grid grid-cols-12 gap-2 sm:gap-4 items-center text-center py-2">
          {/* Team Home (UDAYA Peruvallur) */}
          <div className="col-span-4 flex flex-col items-center space-y-1.5">
            <TeamLogo teamName={openingMatch.teamHome.name} className="w-16 h-16 sm:w-20 sm:h-20 shadow-xs" />
            <h3 className="text-sm sm:text-lg font-black font-sports text-slate-950 leading-tight">
              UDAYA
            </h3>
            <span className="text-[10px] sm:text-xs text-blue-700 font-bold">
              Peruvallur
            </span>
          </div>

          {/* Center Official Scores or VS */}
          <div className="col-span-4 flex flex-col items-center justify-center">
            {isLive ? (
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  <span className="text-4xl sm:text-6xl font-black font-sports text-slate-950">
                    {matchState.officialScoreHome}
                  </span>
                  <span className="text-2xl sm:text-4xl font-black text-slate-300">-</span>
                  <span className="text-4xl sm:text-6xl font-black font-sports text-slate-950">
                    {matchState.officialScoreAway}
                  </span>
                </div>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Official Ground Score</span>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="text-2xl sm:text-4xl font-black font-sports text-blue-700">
                  VS
                </div>
                <div className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                  8:00 PM Floodlit
                </div>
              </div>
            )}
          </div>

          {/* Team Away (SABAN FC Kottakkal) */}
          <div className="col-span-4 flex flex-col items-center space-y-1.5">
            <TeamLogo teamName={openingMatch.teamAway.name} className="w-16 h-16 sm:w-20 sm:h-20 shadow-xs" />
            <h3 className="text-sm sm:text-lg font-black font-sports text-slate-950 leading-tight">
              SABAN FC
            </h3>
            <span className="text-[10px] sm:text-xs text-amber-700 font-bold">
              Kottakkal
            </span>
          </div>
        </div>

        {/* Notification Toast */}
        {toastMessage && (
          <div className={`mt-4 p-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 animate-fadeIn shadow-xs ${
            toastMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
              : 'bg-red-50 text-red-900 border border-red-300'
          }`}>
            {toastMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
            <span>{toastMessage.text}</span>
          </div>
        )}

        {/* FAN CROWD GOAL REPORTING WITH ANTI-SPAM RATE LIMITER */}
        <div className="mt-6 pt-5 border-t border-slate-200 bg-slate-50 -mx-4 -mb-4 sm:-mx-7 sm:-mb-7 p-4 sm:p-6 rounded-b-3xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-slate-600" />
                <h4 className="text-xs font-black font-sports uppercase tracking-wider text-slate-800">
                  Fan Crowd Score Pulse
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200">
                  Anti-Spam Protected
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Rate limited to 1 report every 45s (Max 5/match) to stop spam. Admin score remains final.
              </p>
            </div>

            {/* Rate limit status pill */}
            <div className="flex items-center gap-2">
              {rateLimit.isCooldownActive ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-100 text-amber-900 font-mono font-bold text-xs border border-amber-300">
                  <Clock className="w-3.5 h-3.5 text-amber-700 animate-spin" />
                  <span>Cooldown: {rateLimit.remainingSeconds}s</span>
                </span>
              ) : rateLimit.isLimitReached ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs">
                  <span>Limit Reached (5/5)</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-900 font-bold text-xs">
                  <span>Ready ({rateLimit.reportsCount}/5 used)</span>
                </span>
              )}
            </div>
          </div>

          {/* User Action Buttons (Rate Limited) */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleCrowdGoal('home')}
              disabled={rateLimit.isCooldownActive || rateLimit.isLimitReached || matchState.isCrowdLocked || matchState.status === 'FULL_TIME'}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs active:scale-95 ${
                rateLimit.isCooldownActive || rateLimit.isLimitReached || matchState.isCrowdLocked || matchState.status === 'FULL_TIME'
                  ? 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
                  : 'bg-sky-600 hover:bg-sky-700 text-white shadow-sm'
              }`}
            >
              <span>⚽ Report Goal: UDAYA</span>
              {rateLimit.isCooldownActive && <span className="text-[10px]">({rateLimit.remainingSeconds}s)</span>}
            </button>

            <button
              onClick={() => handleCrowdGoal('away')}
              disabled={rateLimit.isCooldownActive || rateLimit.isLimitReached || matchState.isCrowdLocked || matchState.status === 'FULL_TIME'}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs active:scale-95 ${
                rateLimit.isCooldownActive || rateLimit.isLimitReached || matchState.isCrowdLocked || matchState.status === 'FULL_TIME'
                  ? 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
                  : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-sm'
              }`}
            >
              <span>⚽ Report Goal: SABAN FC</span>
              {rateLimit.isCooldownActive && <span className="text-[10px]">({rateLimit.remainingSeconds}s)</span>}
            </button>
          </div>

          {/* Crowd Stats Counter Bar */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 bg-white p-2.5 rounded-xl border border-slate-200">
            <span>
              Community Reports: <strong>{matchState.crowdReports?.home || 0} Udaya</strong> vs <strong>{matchState.crowdReports?.away || 0} Saban</strong> ({matchState.crowdReports?.total || 0} total)
            </span>
            <span className="font-bold text-blue-700">
              🛡️ Admin Score Governed
            </span>
          </div>

          {/* Official Events Timeline */}
          {matchState.events && matchState.events.length > 0 && (
            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Official Match Events Timeline (Referee Desk):
              </span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {matchState.events.map((evt) => (
                  <div
                    key={evt.id}
                    className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-white border border-slate-200 shadow-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-black text-blue-800 font-sports">
                        {evt.minute}'
                      </span>
                      <span>
                        {evt.type === 'goal' ? '⚽' : evt.type === 'yellow_card' ? '🟨' : evt.type === 'red_card' ? '🟥' : '🥅'}
                      </span>
                      <span className="font-bold text-slate-900 truncate">
                        {evt.player}
                      </span>
                      <span className="text-[11px] text-slate-500 hidden sm:inline">
                        ({evt.text})
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Official
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}