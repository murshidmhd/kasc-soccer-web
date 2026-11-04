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
  Settings,
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';
import { openingMatch } from '../data/tournamentData';
import TeamLogo from './TeamLogo';
import GoalShareCardModal from './GoalShareCardModal';
import { 
  getStoredMatchState, 
  submitFanCrowdGoal, 
  getUserRateLimitStatus,
  getCalculatedMatchTime,
  getDaysToKickoff,
  isDemoModeActive,
  setDemoModeActive,
  SEVENS_HALF_MINUTES,
  SEVENS_TOTAL_MINUTES
} from '../utils/matchStateManager';

export default function LiveMatchCard({ lang, isDarkMode, onOpenAdminPanel }) {
  const [matchState, setMatchState] = useState(getStoredMatchState);
  const [clock, setClock] = useState(() => getCalculatedMatchTime(getStoredMatchState()));
  const [rateLimit, setRateLimit] = useState(getUserRateLimitStatus);
  const [toastMessage, setToastMessage] = useState(null);
  const [timelineTab, setTimelineTab] = useState('commentary'); // 'timeline' | 'commentary'
  const [isDemo, setIsDemo] = useState(isDemoModeActive);
  const [goalShareModal, setGoalShareModal] = useState({ isOpen: false, goalData: null });

  // Sync with global custom events
  useEffect(() => {
    const handleStateUpdate = (e) => {
      const newState = e.detail || getStoredMatchState();
      setMatchState(newState);
      setClock(getCalculatedMatchTime(newState));
    };

    const handleDemoChange = (e) => {
      setIsDemo(Boolean(e.detail));
    };

    window.addEventListener('kasc_match_state_updated', handleStateUpdate);
    window.addEventListener('kasc_demo_mode_changed', handleDemoChange);
    return () => {
      window.removeEventListener('kasc_match_state_updated', handleStateUpdate);
      window.removeEventListener('kasc_demo_mode_changed', handleDemoChange);
    };
  }, []);

  // Continuous 1-second ticker interval for live moving clock & rate limit
  useEffect(() => {
    const interval = setInterval(() => {
      setRateLimit(getUserRateLimitStatus());
      setClock(getCalculatedMatchTime(matchState));
    }, 1000);
    return () => clearInterval(interval);
  }, [matchState]);

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
        text: `✅ ${result.message}`
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

  const daysToKickoff = getDaysToKickoff();
  const isLive = matchState.status !== 'UPCOMING';

  const getStatusBadge = () => {
    if (!isLive) {
      return (
        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-900 font-bold text-xs border border-blue-200 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-blue-700" />
          <span>{lang === 'ml' ? `കിക്ക്ഓഫ്: ${daysToKickoff} ദിനം ബാക്കി` : `Kickoff in ${daysToKickoff} days`}</span>
        </span>
      );
    }

    switch (matchState.status) {
      case '1ST_HALF':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold text-navy-900 font-mono font-black text-xs uppercase shadow-xs">
            <span className="w-2 h-2 rounded-full bg-navy-900 animate-ping"></span>
            <span>LIVE 1ST HALF • {clock.display}</span>
          </span>
        );
      case 'HALF_TIME':
        return (
          <span className="px-3 py-1 rounded-full bg-navy-700 text-white font-black text-xs uppercase shadow-xs border border-navy-600">
            ⏸️ Half Time (30:00 Break)
          </span>
        );
      case '2ND_HALF':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold text-navy-900 font-mono font-black text-xs uppercase shadow-xs">
            <span className="w-2 h-2 rounded-full bg-navy-900 animate-ping"></span>
            <span>LIVE 2ND HALF • {clock.display}</span>
          </span>
        );
      case 'FULL_TIME':
        return (
          <span className="px-3 py-1 rounded-full bg-navy-900 text-white font-black text-xs uppercase shadow-xs border border-navy-700">
            🏁 FULL TIME • 60:00 (FINAL)
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <section id="live-match" className="w-full">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="p-1 rounded-md bg-royal text-white">
              <Flame className="w-3.5 h-3.5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-sports uppercase tracking-wider text-navy-900 dark:text-white leading-[1.3]">
              {lang === 'ml' ? 'മാച്ച് സെന്റർ' : 'MATCH CENTER'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-muted-on-navy font-medium leading-[1.5]">
            {isLive
              ? (lang === 'ml' ? 'ഔദ്യോഗിക തത്സമയ സ്കോറും പന്ത് തട്ടുന്ന നിമിഷങ്ങളും' : 'Official live score verified by Ground Referee Desk')
              : (lang === 'ml' ? `ഉദ്ഘാടന മത്സരം: 2026 നവംബർ 06, രാത്രി 8:00 മണിക്ക് (${daysToKickoff} ദിനം ബാക്കി)` : `Opening Match: Nov 06, 2026, 8:00 PM IST (Kickoff in ${daysToKickoff} days)`)}
          </p>
        </div>

        {/* Demo Mode Toggle (Off by default) & Private Admin Link */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => {
              const next = !isDemo;
              setDemoModeActive(next);
              setIsDemo(next);
            }}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 active:scale-95 ${
              isDemo 
                ? 'bg-gold text-navy-900 border-gold font-black shadow-xs' 
                : 'bg-white dark:bg-navy-700 border-surface-border dark:border-navy-600 text-navy-900 dark:text-muted-on-navy hover:bg-surface-light dark:hover:bg-navy-600'
            }`}
            title="Toggle sample demo match simulation (off by default)"
          >
            <span>⚡ Demo Simulation:</span>
            <span className="font-black underline">{isDemo ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Main Match Scorecard */}
      <div className="rounded-3xl overflow-hidden border p-4 sm:p-7 relative shadow-card transition-colors surface-card">
        {/* DEMO MODE ACTIVE WARNING BANNER */}
        {isDemo && (
          <div className="mb-4 p-2.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-900 text-xs font-bold flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-base">⚡</span>
              <span>DEMO MODE ACTIVE: Showing simulated 2-1 sample match for testing. Toggle OFF for real pre-kickoff state.</span>
            </div>
            <button
              onClick={() => {
                setDemoModeActive(false);
                setIsDemo(false);
              }}
              className="text-[11px] underline font-black text-amber-950 shrink-0"
            >
              Turn Off
            </button>
          </div>
        )}

        {/* Top Match Ribbon with Official Verification Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-surface-border dark:border-navy-700 pb-3 mb-5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-900 font-bold text-[10px] sm:text-xs border border-blue-200">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Official Matchday 1</span>
            </span>
            <span className="text-[11px] text-card-muted hidden sm:inline">•</span>
            <span className="text-[11px] text-card-muted font-medium hidden sm:inline">
              Peruvallur Panjayath Stadium
            </span>
          </div>

          <div className="flex items-center gap-2">
            {getStatusBadge()}
          </div>
        </div>

        {/* Matchup Presentation (UDAYA vs NEW MALAYA) */}
        <div className="grid grid-cols-12 gap-2 sm:gap-4 items-center text-center py-2">
          {/* Team Home (UDAYA Parambil Peedika) */}
          <div className="col-span-4 flex flex-col items-center space-y-1.5">
            <TeamLogo teamName={openingMatch.teamHome.name} className="w-16 h-16 sm:w-20 sm:h-20 shadow-xs" />
            <h3 className="text-sm sm:text-lg font-black font-sports text-card-title leading-tight">
              UDAYA
            </h3>
            <span className="text-[10px] sm:text-xs text-royal dark:text-sky font-bold">
              Parambil Peedika
            </span>
          </div>

          {/* Center Official Scores (if Live or Demo) OR Kickoff countdown (if Upcoming) */}
          <div className="col-span-4 flex flex-col items-center justify-center">
            {isLive ? (
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  <span className="text-4xl sm:text-6xl font-black font-sports text-card-title">
                    {matchState.officialScoreHome}
                  </span>
                  <span className="text-2xl sm:text-4xl font-black text-card-muted">-</span>
                  <span className="text-4xl sm:text-6xl font-black font-sports text-card-title">
                    {matchState.officialScoreAway}
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Ground Referee Score</span>
                  </div>
                  <button
                    onClick={() => setGoalShareModal({
                      isOpen: true,
                      goalData: {
                        scorerName: matchState.events?.find(e => e.type === 'goal')?.player || 'Match Update',
                        minute: matchState.matchMinute || 30,
                        goalTeam: 'home',
                        scoreHome: matchState.officialScoreHome,
                        scoreAway: matchState.officialScoreAway,
                        homeTeamName: 'UDAYA PARAMBIL PEEDIKA',
                        awayTeamName: 'NEW MALAYA MALABAR FC',
                        matchStatus: matchState.status,
                        goalText: 'Official Live Match Score'
                      }
                    })}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 hover:bg-blue-100 text-royal text-[10px] font-bold border border-blue-200 transition active:scale-95"
                    title="Generate WhatsApp Status Card"
                  >
                    <Share2 className="w-3 h-3" />
                    <span>Share Status Card</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="text-2xl sm:text-4xl font-black font-sports text-royal dark:text-sky">
                  VS
                </div>
                <div className="text-[10px] sm:text-xs font-black text-card-title bg-surface-light dark:bg-navy-900 px-2.5 py-1 rounded-lg border border-surface-border dark:border-navy-700">
                  06 Nov • 8:00 PM
                </div>
                <span className="text-[10px] text-card-muted font-bold block">
                  {lang === 'ml' ? `${daysToKickoff} ദിനം ബാക്കി` : `In ${daysToKickoff} days`}
                </span>
              </div>
            )}
          </div>

          {/* Team Away (NEW MALAYA MALABAR FC) */}
          <div className="col-span-4 flex flex-col items-center space-y-1.5">
            <TeamLogo teamName={openingMatch.teamAway.name} className="w-16 h-16 sm:w-20 sm:h-20 shadow-xs" />
            <h3 className="text-sm sm:text-lg font-black font-sports text-card-title leading-tight">
              NEW MALAYA
            </h3>
            <span className="text-[10px] sm:text-xs text-card-muted font-bold">
              Kozhikode
            </span>
          </div>
        </div>

        {/* Pre-Kickoff Notice when match is not live and Demo is off */}
        {!isLive && (
          <div className="mt-5 p-3.5 rounded-2xl surface-card-subtle text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-card-title">
              <Clock className="w-4 h-4 text-royal dark:text-sky" />
              <span>{lang === 'ml' ? `ഉദ്ഘാടന മത്സര കിക്ക്ഓഫിലേക്ക് ${daysToKickoff} ദിനങ്ങൾ ബാക്കി` : `Kickoff in ${daysToKickoff} days`}</span>
            </div>
            <p className="text-[11px] text-card-muted leading-relaxed">
              {lang === 'ml'
                ? 'നവംബർ 6 ന് രാത്രി 8:00 ന് ഗ്രൗണ്ട് റഫറി വിസിൽ മുഴങ്ങുന്നതോടെ ഔദ്യോഗിക ലൈവ് സ്കോർബോർഡും ടൈംലൈനും സജീവമാകും.'
                : 'Official live scoreboard, goal alerts and referee timeline will activate at match kickoff.'}
            </p>
          </div>
        )}

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

        {/* FAN CROWD GOAL REPORTING & COMMENTARY: SHOWN ONLY IF LIVE OR DEMO MODE IS ON */}
        {isLive && (
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
                  Rate limited to 1 report every 60s (Max 3/match). Referee score remains final authority.
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
                    <span>Limit Reached (3/3)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-900 font-bold text-xs">
                    <span>Ready ({rateLimit.reportsCount}/3 used)</span>
                  </span>
                )}
              </div>
            </div>

            {/* User Action Buttons (Rule 4: Minimum 44px tap targets) */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleCrowdGoal('home')}
                disabled={rateLimit.isCooldownActive || rateLimit.isLimitReached || matchState.isCrowdLocked || matchState.status === 'FULL_TIME'}
                className={`min-h-[44px] py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-card active:scale-95 ${
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
                className={`min-h-[44px] py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-card active:scale-95 ${
                  rateLimit.isCooldownActive || rateLimit.isLimitReached || matchState.isCrowdLocked || matchState.status === 'FULL_TIME'
                    ? 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
                    : 'bg-zinc-800 hover:bg-zinc-900 text-white shadow-sm'
                }`}
              >
                <span>⚽ Report Goal: NEW MALAYA</span>
                {rateLimit.isCooldownActive && <span className="text-[10px]">({rateLimit.remainingSeconds}s)</span>}
              </button>
            </div>

            {/* Crowd Stats Counter Bar */}
            <div className="flex items-center justify-between text-xs text-slate-600 bg-white dark:bg-slate-800 dark:text-slate-300 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-card">
              <span>
                Community Reports: <strong>{matchState.crowdReports?.home || 0} Udaya</strong> vs <strong>{matchState.crowdReports?.away || 0} New Malaya</strong>
              </span>
              <span className="font-bold text-blue-700 dark:text-blue-400">
                🛡️ Ground Desk Authority
              </span>
            </div>

            {/* Dual Tab: Official Events vs Live Commentary Feed */}
            <div className="pt-2 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <div className="flex items-center gap-1 bg-slate-200/80 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
                  <button
                    onClick={() => setTimelineTab('commentary')}
                    className={`min-h-[44px] px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 active:scale-95 ${
                      timelineTab === 'commentary' ? 'bg-blue-700 text-white shadow-card font-black' : 'text-slate-700 dark:text-slate-300 hover:text-blue-700'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>{lang === 'ml' ? 'ലൈവ് കമന്ററി' : 'Live Commentary'}</span>
                  </button>
                  <button
                    onClick={() => setTimelineTab('timeline')}
                    className={`min-h-[44px] px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 active:scale-95 ${
                      timelineTab === 'timeline' ? 'bg-blue-700 text-white shadow-card font-black' : 'text-slate-700 dark:text-slate-300 hover:text-blue-700'
                    }`}
                  >
                    <span>{lang === 'ml' ? 'റഫറി ഇവന്റ്സ്' : 'Referee Timeline'}</span>
                  </button>
                </div>
              </div>

              {/* View 1: Ball-by-ball Text Commentary */}
              {timelineTab === 'commentary' && (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1 animate-fadeIn">
                  {[
                    { min: "30'", type: "whistle", text: lang === 'ml' ? 'ഹാഫ് ടൈം വിസിൽ! ആദ്യ പകുതിയിൽ ഉദയ പറമ്പിൽ പീടിക 2 - 1 ന് മുന്നിൽ. ഗാലറിയിൽ ആവേശക്കടൽ.' : 'Half-time whistle! Udaya leads 2-1 after a breathless first half under the floodlights.' },
                    { min: "26'", type: "card", text: lang === 'ml' ? '🟨 യെല്ലോ കാർഡ്: ന്യൂ മലയ മിഡ്ഫീൽഡർക്ക് കൗണ്ടർ തടഞ്ഞതിന് റഫറിയുടെ മുന്നറിയിപ്പ്.' : '🟨 Yellow Card: Tactical foul stopping a dangerous break.' },
                    { min: "24'", type: "goal", text: lang === 'ml' ? '⚽ ഗോൾ!! ഷമീർ കെ. (ഉദയ). ഡി-ബോക്സിന് വെളിയിൽ നിന്നുള്ള ബുള്ളറ്റ് വോളി പോസ്റ്റിന്റെ ടോപ്പ് കോർണറിലേക്ക്!' : '⚽ GOAL!! Shameer K. (Udaya) with a screamer into the top corner!' },
                    { min: "18'", type: "save", text: lang === 'ml' ? '🧤 മിന്നൽ സേവ്! ന്യൂ മലയ സ്ട്രൈക്കറുടെ ഹെഡർ ഉദയ ഗോൾകീപ്പർ ഷംസീർ പറന്നു തട്ടിയകറ്റി.' : '🧤 Sensational reflex save by Udaya keeper Shamseer to deny an equalizer!' },
                    { min: "12'", type: "goal", text: lang === 'ml' ? '⚽ ഗോൾ!! ഇബ്രാഹിം സുമഹോറോ (ഉദയ). ഡിഫൻഡർമാരെ വെട്ടിച്ച് കിടിലൻ ചിപ്പ് ഫിനിഷ്.' : '⚽ GOAL!! Ibrahim Soumahoro (Udaya) chips the keeper with sublime composure.' },
                    { min: "7'", type: "attack", text: lang === 'ml' ? 'ന്യൂ മലയയുടെ കൗണ്ടർ അറ്റാക്ക്! ഉദയ സെന്റർ ബാക്ക് ഫൈസൽ പന്ത് കൃത്യസമയത്ത് ക്ലിയർ ചെയ്തു.' : 'Dangerous counter-attack by New Malaya, snuffed out by Udaya defense.' },
                    { min: "1'", type: "start", text: lang === 'ml' ? '🟢 പെരുവള്ളൂർ പഞ്ചായത്ത് സ്റ്റേഡിയത്തിൽ ഫ്ലഡ്‌ലൈറ്റിന്റെ പ്രഭയിൽ ആവേശകരമായ ഉദ്ഘാടന മത്സരത്തിന് തുടക്കം!' : '🟢 Kickoff under floodlights at Peruvallur Panjayath Stadium!' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-2 rounded-xl bg-white border border-slate-100 shadow-2xs text-xs">
                      <span className="font-sports font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md shrink-0 border border-blue-200">
                        {item.min}
                      </span>
                      <p className="text-slate-800 font-medium leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* View 2: Official Referee Events */}
              {timelineTab === 'timeline' && (
                <div className="space-y-1.5 max-h-48 overflow-y-auto animate-fadeIn">
                  {matchState.events && matchState.events.length > 0 ? (
                    matchState.events.map((evt) => (
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
                          <span className="font-bold text-slate-900">
                            {evt.player}
                          </span>
                          <span className="text-[11px] text-slate-500 hidden sm:inline">
                            ({evt.text})
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {evt.type === 'goal' && (
                            <button
                              onClick={() => setGoalShareModal({
                                isOpen: true,
                                goalData: {
                                  scorerName: evt.player,
                                  minute: evt.minute,
                                  goalTeam: evt.team || 'home',
                                  scoreHome: matchState.officialScoreHome,
                                  scoreAway: matchState.officialScoreAway,
                                  homeTeamName: 'UDAYA PARAMBIL PEEDIKA',
                                  awayTeamName: 'NEW MALAYA MALABAR FC',
                                  matchStatus: matchState.status,
                                  goalText: evt.text
                                }
                              })}
                              className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200 transition active:scale-95"
                              title="Share Goal Status to WhatsApp"
                            >
                              <Share2 className="w-3 h-3" />
                              <span>Share</span>
                            </button>
                          )}
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            Official
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-xs text-slate-500">
                      No official referee events recorded yet.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Goal Share Status Modal */}
      <GoalShareCardModal
        isOpen={goalShareModal.isOpen}
        onClose={() => setGoalShareModal({ isOpen: false, goalData: null })}
        initialGoalData={goalShareModal.goalData || {
          scoreHome: matchState.officialScoreHome,
          scoreAway: matchState.officialScoreAway,
          minute: matchState.matchMinute || 30,
          homeTeamName: 'UDAYA PARAMBIL PEEDIKA',
          awayTeamName: 'NEW MALAYA MALABAR FC',
          matchStatus: matchState.status
        }}
        isDarkMode={isDarkMode}
      />
    </section>
  );
}
