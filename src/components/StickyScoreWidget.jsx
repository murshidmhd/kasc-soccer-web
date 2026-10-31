import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  ChevronUp, 
  ChevronDown, 
  X, 
  ExternalLink, 
  Clock, 
  ShieldCheck, 
  Minimize2, 
  Maximize2 
} from 'lucide-react';
import { 
  getStoredMatchState, 
  getCalculatedMatchTime, 
  SEVENS_HALF_MINUTES 
} from '../utils/matchStateManager';
import { openingMatch } from '../data/tournamentData';
import TeamLogo from './TeamLogo';

export default function StickyScoreWidget({ activeTab, setActiveTab, isDarkMode }) {
  const [matchState, setMatchState] = useState(getStoredMatchState);
  const [clock, setClock] = useState(() => getCalculatedMatchTime(getStoredMatchState()));
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  // On mobile screens, default to minimized sleek pill to never block content
  const [isMinimized, setIsMinimized] = useState(() => {
    return typeof window !== 'undefined' && window.innerWidth < 640;
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [goalAlert, setGoalAlert] = useState(null);

  // Sync state with global updates
  useEffect(() => {
    const handleStateUpdate = (e) => {
      const newState = e.detail || getStoredMatchState();
      
      // Check if a goal was scored to trigger flash animation
      if (
        newState.officialScoreHome !== matchState.officialScoreHome ||
        newState.officialScoreAway !== matchState.officialScoreAway
      ) {
        setGoalAlert(`⚽ GOAL! ${newState.officialScoreHome} - ${newState.officialScoreAway}`);
        setTimeout(() => setGoalAlert(null), 5000);
      }

      setMatchState(newState);
      setClock(getCalculatedMatchTime(newState));
    };

    window.addEventListener('kasc_match_state_updated', handleStateUpdate);
    return () => window.removeEventListener('kasc_match_state_updated', handleStateUpdate);
  }, [matchState]);

  // Continuous 1-second ticker interval for live moving clock
  useEffect(() => {
    const interval = setInterval(() => {
      setClock(getCalculatedMatchTime(matchState));
    }, 1000);
    return () => clearInterval(interval);
  }, [matchState]);

  // Visibility logic: only show on other tabs (fixtures, teams, stats, promo)
  // or on live page only when scrolled deep into the bottom archive (scrollY > 2200px)
  useEffect(() => {
    const checkScroll = () => {
      if (isDismissed) return;

      // On pages other than 'live', show the sticky score widget
      if (activeTab !== 'live') {
        setIsVisible(true);
        return;
      }

      // On 'live' home page, the match center is already on screen,
      // so ONLY show if scrolled deep past all hero, countdown, lineup & prediction (2200px)
      const scrolled = window.scrollY > 2200;
      setIsVisible(scrolled);
    };

    checkScroll();
    window.addEventListener('scroll', checkScroll, { passive: true });
    return () => window.removeEventListener('scroll', checkScroll);
  }, [activeTab, isDismissed]);

  if (!isVisible || isDismissed) {
    // If dismissed, render a tiny recall pill button
    if (isDismissed) {
      return (
        <button
          onClick={() => { setIsDismissed(false); setIsMinimized(false); }}
          className="fixed bottom-[74px] sm:bottom-6 right-3 sm:right-6 z-40 px-3 py-1.5 rounded-full bg-slate-900/95 text-white text-xs font-bold border border-slate-700 shadow-xl backdrop-blur-md flex items-center gap-1.5 hover:scale-105 active:scale-95 transition animate-fadeIn touch-manipulation"
          title="Show Live Match Score"
        >
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          <span className="font-sports font-black">UDY {matchState.officialScoreHome}-{matchState.officialScoreAway} MAL</span>
          <span className="text-[10px] text-amber-400 font-mono">({clock.display})</span>
        </button>
      );
    }
    return null;
  }

  const isLive = matchState.status === '1ST_HALF' || matchState.status === '2ND_HALF';
  const isHT = matchState.status === 'HALF_TIME';
  const isFT = matchState.status === 'FULL_TIME';

  const handleJumpToMatch = () => {
    if (activeTab !== 'live') {
      setActiveTab('live');
    }
    setTimeout(() => {
      const el = document.getElementById('live-match');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 400, behavior: 'smooth' });
      }
    }, 100);
  };

  const latestEvent = matchState.events && matchState.events[0];

  // Compact Mini Pill Mode on mobile screens
  if (isMinimized) {
    return (
      <aside 
        className="fixed bottom-[74px] left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-[320px] sm:bottom-6 sm:right-6 sm:left-auto sm:translate-x-0 sm:w-[320px] transition-all select-none animate-fadeIn"
        aria-label="Sticky Live Score Mini Pill"
      >
        <div 
          onClick={() => setIsMinimized(false)}
          className="bg-slate-950/95 backdrop-blur-xl border border-slate-700 text-white rounded-full shadow-2xl px-3 py-1.5 flex items-center justify-between gap-2 cursor-pointer hover:border-slate-500 transition active:scale-98"
        >
          <div className="flex items-center gap-1.5 text-xs truncate min-w-0">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping shrink-0"></span>
            <span className="font-sports font-black tracking-wide truncate">
              UDAYA {matchState.officialScoreHome} - {matchState.officialScoreAway} NEW MALAYA
            </span>
            <span className="text-[10px] text-amber-400 font-mono shrink-0">({clock.display})</span>
          </div>

          <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setIsMinimized(false)}
              className="p-1 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition"
              title="Expand scoreboard"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsDismissed(true)}
              className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition"
              title="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside 
      className={`fixed bottom-[74px] left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-[320px] sm:bottom-6 sm:right-6 sm:left-auto sm:translate-x-0 sm:w-[320px] transition-all duration-200 select-none ${
        goalAlert ? 'scale-105 ring-4 ring-amber-400' : ''
      }`}
      aria-label="Sticky Live Score Widget"
    >
      {/* Top Goal Flash Banner if newly scored */}
      {goalAlert && (
        <div className="mb-1.5 py-1 px-3 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs text-center shadow-lg animate-bounce flex items-center justify-center gap-1.5">
          <span>⚡</span>
          <span>{goalAlert}</span>
        </div>
      )}

      {/* Main Glassmorphic Widget Container */}
      <div className="bg-slate-950/95 backdrop-blur-xl border border-slate-800 text-white rounded-2xl shadow-2xl p-2.5 sm:p-3 w-full space-y-2 transition-all">
        {/* Top Status & Controls Bar */}
        <div className="flex items-center justify-between text-[11px] pb-1.5 border-b border-slate-800">
          <div className="flex items-center gap-1.5">
            {isLive ? (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-600 text-white font-black text-[9px] uppercase tracking-wider shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                <span>LIVE {matchState.status === '1ST_HALF' ? '1H' : '2H'}</span>
              </span>
            ) : isHT ? (
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[9px] uppercase">
                HT BREAK
              </span>
            ) : isFT ? (
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold text-[9px] uppercase">
                FULL TIME
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-blue-900 text-blue-200 font-bold text-[9px] uppercase">
                PRE-MATCH
              </span>
            )}

            {/* Live Moving Clock */}
            <span className="font-mono font-black text-amber-400 flex items-center gap-1">
              <Clock className="w-3 h-3 animate-spin" style={{ animationDuration: '6s' }} />
              <span>{clock.display}</span>
            </span>
          </div>

          {/* Right Action Icons: Minimize to Pill / Expand Details / Close */}
          <div className="flex items-center gap-1 text-slate-400">
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 rounded-lg hover:bg-slate-800 hover:text-white transition active:scale-90 touch-manipulation sm:hidden"
              title="Minimize to Pill"
              aria-label="Minimize"
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-lg hover:bg-slate-800 hover:text-white transition active:scale-90 touch-manipulation"
              title={isExpanded ? 'Collapse' : 'Expand Details'}
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setIsDismissed(true)}
              className="p-1 rounded-lg hover:bg-slate-800 hover:text-red-400 transition active:scale-90 touch-manipulation"
              title="Close mini widget"
              aria-label="Close widget"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Middle Scoreboard Area */}
        <div 
          onClick={handleJumpToMatch}
          className="flex items-center justify-between px-0.5 cursor-pointer hover:opacity-90 transition group"
          title="Click to jump to Match Center"
        >
          {/* Home Team */}
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <TeamLogo teamName={openingMatch.teamHome.name} className="w-7 h-7 shrink-0" />
            <div className="truncate min-w-0 flex-1">
              <span className="font-sports font-black text-xs sm:text-sm block truncate group-hover:text-blue-400 transition">
                UDAYA
              </span>
              <span className="text-[9px] text-slate-400 block truncate hidden xs:block">
                {openingMatch.teamHome.city || 'Parambil Peedika'}
              </span>
            </div>
          </div>

          {/* Score Numbers */}
          <div className="px-2 text-center shrink-0">
            <div className="font-sports font-black text-xl sm:text-2xl tracking-wider text-white flex items-center justify-center gap-1.5">
              <span>{matchState.officialScoreHome}</span>
              <span className="text-slate-500 text-base">-</span>
              <span>{matchState.officialScoreAway}</span>
            </div>
          </div>

          {/* Away Team */}
          <div className="flex items-center justify-end gap-1.5 flex-1 min-w-0 text-right">
            <div className="truncate min-w-0 flex-1">
              <span className="font-sports font-black text-xs sm:text-sm block truncate group-hover:text-amber-400 transition">
                {openingMatch.teamAway.shortName || 'NEW MALAYA'}
              </span>
              <span className="text-[9px] text-slate-400 block truncate hidden xs:block">
                {openingMatch.teamAway.city || 'Kozhikode'}
              </span>
            </div>
            <TeamLogo teamName={openingMatch.teamAway.name} className="w-7 h-7 shrink-0" />
          </div>
        </div>

        {/* Optional Expanded Drawer: Latest Event & Jump Button */}
        {isExpanded && (
          <div className="pt-2 border-t border-slate-800 space-y-2 animate-fadeIn text-[11px]">
            {latestEvent && (
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px]">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="font-bold text-amber-400 font-mono">{latestEvent.minute}'</span>
                  <span>{latestEvent.type === 'goal' ? '⚽' : '🟨'}</span>
                  <span className="font-bold truncate max-w-[120px]">{latestEvent.player}</span>
                </div>
                <span className="text-[9px] text-emerald-400 font-medium">Official</span>
              </div>
            )}

            <button
              onClick={handleJumpToMatch}
              className="w-full py-1.5 px-3 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition"
            >
              <span>View Full Match Center</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}