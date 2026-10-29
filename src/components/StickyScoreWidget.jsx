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

  // Visibility logic based on scroll position & active tab
  useEffect(() => {
    const checkScroll = () => {
      if (isDismissed) return;

      // On pages other than 'live', always show the sticky score widget
      if (activeTab !== 'live') {
        setIsVisible(true);
        return;
      }

      // On 'live' home page, show only when scrolled past the main match scoreboard (380px)
      const scrolled = window.scrollY > 380;
      setIsVisible(scrolled);
    };

    checkScroll();
    window.addEventListener('scroll', checkScroll, { passive: true });
    return () => window.removeEventListener('scroll', checkScroll);
  }, [activeTab, isDismissed]);

  if (!isVisible || isDismissed) {
    // If dismissed or hidden, render a tiny recall pill button if match is live
    if (isDismissed && matchState.status !== 'UPCOMING') {
      return (
        <button
          onClick={() => setIsDismissed(false)}
          className="fixed bottom-20 right-3 sm:bottom-6 sm:right-6 z-40 px-3 py-1.5 rounded-full bg-slate-900/90 text-white text-xs font-bold border border-slate-700 shadow-xl backdrop-blur-md flex items-center gap-1.5 hover:scale-105 active:scale-95 transition animate-fadeIn"
          title="Show Live Match Score"
        >
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          <span className="font-mono font-black">{matchState.officialScoreHome}-{matchState.officialScoreAway}</span>
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

  return (
    <aside 
      className={`fixed bottom-20 right-3 sm:bottom-6 sm:right-6 z-40 transition-all duration-300 select-none ${
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
      <div className="bg-slate-950/95 backdrop-blur-xl border border-slate-800 text-white rounded-2xl shadow-2xl p-2.5 sm:p-3 w-[270px] sm:w-[310px] space-y-2 transition-all">
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

          {/* Right Action Icons: Expand / Close */}
          <div className="flex items-center gap-1 text-slate-400">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-md hover:bg-slate-800 hover:text-white transition"
              title={isExpanded ? 'Collapse' : 'Expand Details'}
            >
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setIsDismissed(true)}
              className="p-1 rounded-md hover:bg-slate-800 hover:text-red-400 transition"
              title="Close mini widget"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Middle Scoreboard Area */}
        <div 
          onClick={handleJumpToMatch}
          className="flex items-center justify-between px-1 cursor-pointer hover:opacity-90 transition group"
          title="Click to jump to Match Center"
        >
          {/* Home Team */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <TeamLogo teamName={openingMatch.teamHome.name} className="w-7 h-7 shrink-0" />
            <div className="truncate">
              <span className="font-sports font-black text-xs sm:text-sm block truncate group-hover:text-blue-400 transition">
                UDAYA
              </span>
              <span className="text-[9px] text-slate-400 block truncate">Peruvallur</span>
            </div>
          </div>

          {/* Score Numbers */}
          <div className="px-3 text-center shrink-0">
            <div className="font-sports font-black text-xl sm:text-2xl tracking-widest text-white flex items-center justify-center gap-1.5">
              <span>{matchState.officialScoreHome}</span>
              <span className="text-slate-500 text-base">-</span>
              <span>{matchState.officialScoreAway}</span>
            </div>
          </div>

          {/* Away Team */}
          <div className="flex items-center justify-end gap-2 flex-1 min-w-0 text-right">
            <div className="truncate">
              <span className="font-sports font-black text-xs sm:text-sm block truncate group-hover:text-amber-400 transition">
                SABAN
              </span>
              <span className="text-[9px] text-slate-400 block truncate">Kottakkal</span>
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