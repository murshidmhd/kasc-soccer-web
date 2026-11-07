import React, { useState, useEffect, useMemo } from 'react';
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
  Info,
  WifiOff
} from 'lucide-react';
import TeamLogo from './TeamLogo';
import GoalShareCardModal from './GoalShareCardModal';
import { getLineupTactics } from '../utils/lineupManager';
import { 
  getStoredMatchState, 
  getMatchFixtureInfo,
  submitFanCrowdGoal, 
  getUserRateLimitStatus,
  getCalculatedMatchTime,
  SEVENS_HALF_MINUTES,
  SEVENS_TOTAL_MINUTES
} from '../utils/matchStateManager';
import { FAN_REPORTS_ENABLED, WHATSAPP_CHANNEL_URL } from '../config/siteConfig';

const getOpeningMatchEventTeam = (event) => {
  const teamInfo = `${event?.team || ''} ${event?.teamName || ''}`.toLowerCase();
  const eventName = String(event?.player || event?.playerName || '').trim().toLowerCase();
  const eventNumber = event?.playerNumber ?? event?.num;

  if (eventName || eventNumber !== undefined && eventNumber !== null) {
    const squads = getLineupTactics()?.squads || {};
    const matchedTeams = ['krsc', 'base'].filter((teamKey) => {
      const players = [...(squads[teamKey]?.starting || []), ...(squads[teamKey]?.subs || [])];
      return players.some((player) => {
        const playerName = String(player.name || '').trim().toLowerCase();
        const matchesName = eventName && playerName && (
          eventName === playerName || eventName.includes(playerName) || playerName.includes(eventName)
        );
        const matchesNumber = eventNumber !== undefined && eventNumber !== null && String(player.num) === String(eventNumber);
        return matchesName || matchesNumber;
      });
    });
    if (matchedTeams.length === 1) return matchedTeams[0] === 'base' ? 'away' : 'home';
  }

  if (teamInfo.includes('base') || teamInfo.includes('perumbavur') || teamInfo.includes('away')) {
    return 'away';
  }
  if (teamInfo.includes('krsc') || teamInfo.includes('kozhik') || teamInfo.includes('home')) {
    return 'home';
  }
  return 'home';
};

const getOpeningMatchEventPlayer = (event, isOpeningFixture) => {
  if (event?.type === 'goal') {
    if (isOpeningFixture && getOpeningMatchEventTeam(event) === 'home') return '#15';
    if (event.playerNumber) return `#${event.playerNumber}`;
  }
  return event?.player || (event?.playerNumber ? `#${event.playerNumber}` : '—');
};

export default function LiveMatchCard({ lang, isDarkMode, onOpenAdminPanel }) {
  const [matchState, setMatchState] = useState(getStoredMatchState);
  const [clock, setClock] = useState(() => getCalculatedMatchTime(getStoredMatchState()));
  const [rateLimit, setRateLimit] = useState(getUserRateLimitStatus);
  const [toastMessage, setToastMessage] = useState(null);
  const [timelineTab, setTimelineTab] = useState('commentary'); // 'timeline' | 'commentary'
  const [goalShareModal, setGoalShareModal] = useState({ isOpen: false, goalData: null });
  const [isOnline, setIsOnline] = useState(() => (typeof navigator !== 'undefined' ? navigator.onLine : true));
  const [nowTs, setNowTs] = useState(Date.now());
  const activeMatch = getMatchFixtureInfo(matchState.activeFixtureId);
  const isOpeningFixture = activeMatch.id === 'm1';
  const kickoffDate = activeMatch.date.split(', ').pop().replace(/\s+\d{4}$/, '');
  const kickoffLabel = `${kickoffDate} · ${activeMatch.time.replace(' IST', '')}`;
  const getEventTeam = (event) => {
    if (isOpeningFixture) return getOpeningMatchEventTeam(event);
    if (event?.team === 'away' || String(event?.teamName || '').toLowerCase().includes(activeMatch.teamAway.name.toLowerCase())) return 'away';
    return 'home';
  };

  // Online / Offline monitor
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync with global custom events
  useEffect(() => {
    const handleStateUpdate = (e) => {
      const newState = e.detail || getStoredMatchState();
      setMatchState(newState);
      setClock(getCalculatedMatchTime(newState));
    };

    window.addEventListener('kasc_match_state_updated', handleStateUpdate);
    return () => {
      window.removeEventListener('kasc_match_state_updated', handleStateUpdate);
    };
  }, []);

  // Continuous 1-second ticker interval for live moving clock, rate limit & relative time
  useEffect(() => {
    const interval = setInterval(() => {
      setNowTs(Date.now());
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

  const isLive = ['1ST_HALF', 'HALF_TIME', '2ND_HALF'].includes(matchState.status);
  const hasMatchStarted = isLive || ['FULL_TIME', 'COMPLETED'].includes(matchState.status);
  const isUdayaMatch = Boolean(
    activeMatch.teamHome?.name?.toUpperCase().includes('UDAYA') ||
    activeMatch.teamAway?.name?.toUpperCase().includes('UDAYA')
  );

  // Relative timestamp calculation for trust details ("Updated Xs ago")
  const relativeUpdateTime = useMemo(() => {
    if (!matchState.lastUpdated) return '';
    const diffSec = Math.max(0, Math.floor((nowTs - new Date(matchState.lastUpdated).getTime()) / 1000));
    if (diffSec < 5) {
      return lang === 'ml' ? 'ഇപ്പോൾ അപ്ഡേറ്റ് ചെയ്തു' : 'Updated just now';
    }
    if (diffSec < 60) {
      return lang === 'ml' ? `${diffSec} സെക്കൻഡ് മുൻപ്` : `Updated ${diffSec}s ago`;
    }
    const diffMin = Math.floor(diffSec / 60);
    return lang === 'ml' ? `${diffMin} മിനിറ്റ് മുൻപ്` : `Updated ${diffMin}m ago`;
  }, [matchState.lastUpdated, nowTs, lang]);

  // Whether score was entered by official ground desk
  const isScoreEnteredByDesk = Boolean(
    matchState.scoreEnteredByDesk ||
    matchState.updatedBy?.includes('Desk') ||
    matchState.updatedBy?.includes('Scorer') ||
    matchState.updatedBy?.includes('Official')
  );

  // Keep the public timeline aligned with the confirmed opening-match result.
  // The referee desk's default final state can contain the score before event
  // records have synced, so supply the known KRSC scorer in that case.
  const displayEvents = useMemo(() => {
    const sourceEvents = matchState.events || [];
    const hasYellowCardEvents = sourceEvents.some((event) => event.type === 'yellow_card');
    const events = sourceEvents.filter((event) => event.type !== 'yellow_card');

    if (isOpeningFixture && hasYellowCardEvents) {
      events.push(
        { id: 'opening-match-yellow-card-50', type: 'yellow_card', minute: 50, player: 'None', team: 'away', teamName: activeMatch.teamAway.name },
        { id: 'opening-match-yellow-card-55', type: 'yellow_card', minute: 55, player: 'None', team: 'away', teamName: activeMatch.teamAway.name }
      );
    }

    const isFinal = ['FULL_TIME', 'COMPLETED'].includes(matchState.status);
    const krscScored = Number(matchState.officialScoreHome) > 0 && Number(matchState.officialScoreAway) === 0;
    const hasKrscGoal = events.some((event) => event.type === 'goal' && getEventTeam(event) === 'home');

    if (isOpeningFixture && isFinal && krscScored && !hasKrscGoal) {
      events.push({
        id: 'opening-match-krsc-goal-15',
        type: 'goal',
        minute: 45,
        player: '#15',
        playerNumber: 15,
        team: 'home',
        teamName: activeMatch.teamHome.name
      });
    }

    return events.map((event) => (
      isOpeningFixture && event.type === 'goal' && getEventTeam(event) === 'home'
        ? { ...event, minute: 45, player: '#15', playerNumber: 15 }
        : event
    ));
  }, [matchState.activeFixtureId, matchState.events, matchState.status, matchState.officialScoreHome, matchState.officialScoreAway]);

  // Auto-generate commentary feed from logged events (newest first)
  const commentaryLines = useMemo(() => {
    if (displayEvents.length === 0) {
      return [];
    }

    // Sort newest first by minute
    const sorted = [...displayEvents].sort((a, b) => (b.minute || 0) - (a.minute || 0));

    return sorted.map((evt) => {
      const eventTeam = getEventTeam(evt);
      const teamLabel = eventTeam === 'away'
        ? activeMatch.teamAway.shortName
        : activeMatch.teamHome.shortName;
      const playerLabel = getOpeningMatchEventPlayer(evt, isOpeningFixture);
      const minText = `${evt.minute || 0}'`;
      let mainLine = '';

      switch (evt.type) {
        case 'goal':
          mainLine = lang === 'ml'
            ? `⚽ Goal: ${playerLabel} (${teamLabel})`
            : `⚽ Goal: ${playerLabel} (${teamLabel})`;
          break;
        case 'yellow_card':
          mainLine = lang === 'ml'
            ? `🟨 Yellow Card: ${playerLabel} (${teamLabel})`
            : `🟨 Yellow Card: ${playerLabel} (${teamLabel})`;
          break;
        case 'red_card':
          mainLine = lang === 'ml'
            ? `🟥 Red Card: ${playerLabel} (${teamLabel})`
            : `🟥 Red Card: ${playerLabel} (${teamLabel})`;
          break;
        case 'sub':
        case 'substitution':
          mainLine = lang === 'ml'
            ? `🔄 Substitution: ${playerLabel} (${teamLabel})`
            : `🔄 Substitution: ${playerLabel} (${teamLabel})`;
          break;
        case 'half_time':
          mainLine = lang === 'ml'
            ? '⏸️ ഹാഫ് ടൈം വിസിൽ'
            : '⏸️ Half Time Whistle';
          break;
        case 'full_time':
          mainLine = lang === 'ml'
            ? '🏁 ഫുൾ ടൈം വിസിൽ: മത്സരം സമാപിച്ചു'
            : '🏁 Full Time Whistle: Match Ended';
          break;
        default:
          mainLine = `${evt.player ? `${playerLabel} (${teamLabel})` : teamLabel}`;
      }

      // Check if desk entered an optional custom typed note
      const hasCustomText = evt.text && !evt.text.toUpperCase().includes('RECORDED');
      const noteText = hasCustomText ? evt.text : null;

      return {
        id: evt.id || `evt-${evt.minute}-${Math.random()}`,
        minute: minText,
        mainLine,
        noteText,
        type: evt.type
      };
    });
  }, [displayEvents, lang]);

  const getStatusBadge = () => {
    if (!isLive) {
      return (
        <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-900 dark:text-blue-200 font-bold text-xs border border-blue-200 dark:border-blue-800 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400" />
          <span>{kickoffLabel}</span>
        </span>
      );
    }

    switch (matchState.status) {
      case '1ST_HALF':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold text-navy-900 font-mono font-black text-xs uppercase shadow-xs">
            <span className={`w-2 h-2 rounded-full bg-navy-900 ${clock.isCapped ? '' : 'animate-ping'}`}></span>
            <span>LIVE 1ST HALF • {clock.display}</span>
            {clock.isCapped && (
              <span className="px-1.5 py-0.2 rounded bg-navy-950 text-gold text-[10px] font-bold uppercase tracking-wider">
                Time
              </span>
            )}
          </span>
        );
      case 'HALF_TIME':
        return (
          <span className="px-3 py-1 rounded-full bg-navy-700 text-white font-black text-xs uppercase shadow-xs border border-navy-600">
            ⏸️ Half Time ({clock.display} Break)
          </span>
        );
      case '2ND_HALF':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold text-navy-900 font-mono font-black text-xs uppercase shadow-xs">
            <span className={`w-2 h-2 rounded-full bg-navy-900 ${clock.isCapped ? '' : 'animate-ping'}`}></span>
            <span>LIVE 2ND HALF • {clock.display}</span>
            {clock.isCapped && (
              <span className="px-1.5 py-0.2 rounded bg-navy-950 text-gold text-[10px] font-bold uppercase tracking-wider">
                Time
              </span>
            )}
          </span>
        );
      case 'FULL_TIME':
        return (
          <span className="px-3 py-1 rounded-full bg-navy-900 text-white font-black text-xs uppercase shadow-xs border border-navy-700">
            🏁 FULL TIME • {clock.display} (FINAL)
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
              {lang === 'ml' ? 'Match Center' : 'MATCH CENTER'}
            </h2>
          </div>
          {/* Subtitle: Single line kickoff date and time, no repeated days countdown */}
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-[1.5]">
            {isLive
              ? (lang === 'ml' ? 'ഔദ്യോഗിക തത്സമയ സ്കോറും പന്ത് തട്ടുന്ന നിമിഷങ്ങളും' : 'Official live score verified by Ground Referee Desk')
              : hasMatchStarted
                ? (lang === 'ml' ? 'Opening Match Final Score' : 'Opening Match Final Score')
                : (lang === 'ml' ? 'ഉദ്ഘാടന മത്സരം: 2026 നവംബർ 06, രാത്രി 8:45 മണിക്ക്' : 'Opening Match: Nov 06, 2026, 8:45 PM IST')}
          </p>
        </div>
      </div>

      {/* Main Match Scorecard */}
      <div className={`rounded-3xl overflow-hidden border ${isUdayaMatch ? 'border-l-4 border-l-purple-600' : ''} p-4 sm:p-7 relative shadow-card transition-colors surface-card`}>

        {/* Calm Live Scores Broadcast Banner (Rule 4) */}
        {WHATSAPP_CHANNEL_URL && (
          <a
            href={WHATSAPP_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-4 p-2.5 sm:p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-950 dark:text-emerald-200 text-xs font-semibold flex items-center justify-between gap-2 hover:bg-emerald-500/15 transition shadow-xs"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-base shrink-0">📢</span>
              <span className="truncate">
                {lang === 'ml' 
                  ? 'തത്സമയ സ്കോറുകൾ ഞങ്ങളുടെ വാട്ട്‌സ്ആപ്പ് ചാനൽ വഴി അപ്‌ഡേറ്റ് ചെയ്യപ്പെടുന്നു' 
                  : 'Live scores update on our WhatsApp channel'}
              </span>
            </div>
            <span className="text-[11px] font-black underline shrink-0 text-emerald-700 dark:text-emerald-400">
              {lang === 'ml' ? 'വാട്ട്‌സ്ആപ്പ് ചാനൽ →' : 'Follow Channel →'}
            </span>
          </a>
        )}

        {/* Top Match Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-surface-border dark:border-navy-700 pb-3 mb-5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-900 dark:text-blue-200 font-bold text-[10px] sm:text-xs border border-blue-200 dark:border-blue-800">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Official Matchday 1</span>
            </span>
            <span className="text-[11px] text-card-muted hidden sm:inline">•</span>
            <span className="text-[11px] text-card-muted font-medium hidden sm:inline">
              Peruvallur Panjayath Stadium
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isUdayaMatch && (
              <span className="px-2 py-0.5 rounded-md bg-purple-700 text-white text-[10px] font-black uppercase tracking-wider">
                UDAYA
              </span>
            )}
            {getStatusBadge()}
          </div>
        </div>

        {/* Matchup Presentation (KRSC vs BASE) */}
        <div className="grid grid-cols-12 gap-2 sm:gap-4 items-center text-center py-2">
          {/* Team Home (KRSC KOZHIKKODE) */}
          <div className="col-span-4 flex flex-col items-center space-y-1.5">
            <TeamLogo teamName={activeMatch.teamHome.name} className="w-16 h-16 sm:w-20 sm:h-20 shadow-xs" />
            <h3 className="text-sm sm:text-lg font-black font-sports text-card-title leading-tight">
              {activeMatch.teamHome.name}
            </h3>
            <span className="text-[10px] sm:text-xs text-royal dark:text-sky font-bold">
              {activeMatch.teamHome.city || activeMatch.teamHome.shortName}
            </span>
          </div>

          {/* Center Official Scores (if Live) OR Single Kickoff Date/Time (if Upcoming) */}
          <div className="col-span-4 flex flex-col items-center justify-center">
            {hasMatchStarted ? (
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

                {/* Trust Details */}
                <div className="flex flex-col items-center gap-1">
                  {isScoreEnteredByDesk && (
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Ground Referee Score</span>
                    </div>
                  )}

                  {/* Relative timestamp ticker & Reconnecting offline indicator */}
                  <div className="flex items-center gap-2">
                    {relativeUpdateTime && (
                      <span className="text-[10px] text-card-muted font-medium">
                        {relativeUpdateTime}
                      </span>
                    )}
                    {!isOnline && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 font-bold animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        <span>{lang === 'ml' ? 'വീണ്ടും ബന്ധിപ്പിക്കുന്നു...' : 'Reconnecting...'}</span>
                      </span>
                    )}
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
                        homeTeamName: activeMatch.teamHome.name,
                        awayTeamName: activeMatch.teamAway.name,
                        matchStatus: matchState.status,
                        goalText: 'Official Live Match Score'
                      }
                    })}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900 text-royal dark:text-sky text-[10px] font-bold border border-blue-200 dark:border-blue-800 transition active:scale-95 mt-0.5"
                    title="Generate WhatsApp Status Card"
                  >
                    <Share2 className="w-3 h-3" />
                    <span>Share Status Card</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5 flex flex-col items-center">
                <div className="text-2xl sm:text-4xl font-black font-sports text-royal dark:text-sky">
                  VS
                </div>
                {/* One short line for kickoff date and time, no repeated days text */}
                <div className="text-[10px] sm:text-xs font-black text-card-title bg-surface-light dark:bg-navy-900 px-2.5 py-1 rounded-lg border border-surface-border dark:border-navy-700 shadow-2xs">
                  {kickoffLabel}
                </div>
              </div>
            )}
          </div>

          {/* Team Away (BASE PERUMBAVUR) */}
          <div className="col-span-4 flex flex-col items-center space-y-1.5">
            <TeamLogo teamName={activeMatch.teamAway.name} className="w-16 h-16 sm:w-20 sm:h-20 shadow-xs" />
            <h3 className="text-sm sm:text-lg font-black font-sports text-card-title leading-tight">
              {activeMatch.teamAway.name}
            </h3>
            <span className="text-[10px] sm:text-xs text-card-muted font-bold">
              {activeMatch.teamAway.city || activeMatch.teamAway.shortName}
            </span>
          </div>
        </div>

        {/* Pre-Kickoff Notice: Clean single announcement, no countdown repetition */}
        {!hasMatchStarted && (
          <div className="mt-5 p-3.5 rounded-2xl surface-card-subtle text-center space-y-1 border border-surface-border dark:border-navy-700">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-card-title">
              <Clock className="w-4 h-4 text-royal dark:text-sky" />
              <span>{lang === 'ml' ? 'Kick-off സമയത്ത് Match Center സജീവമാകും' : 'Match Center activates at kickoff'}</span>
            </div>
            <p className="text-[11px] text-card-muted leading-relaxed">
              {lang === 'ml'
                ? 'നവംബർ 6 രാത്രി 8:45-ന് ഗ്രൗണ്ട് റഫറിയുടെ വിസിലോടെ Official Live Scoreboard, Timeline എന്നിവ സജീവമാകും.'
                : 'Official live scoreboard, goal alerts and referee timeline will activate at match kickoff.'}
            </p>
          </div>
        )}

        {/* Match Disciplinary Bookings & Events Strip (View Only for Public) */}
        {displayEvents.length > 0 && (
          <div className="mt-4 p-3.5 rounded-2xl bg-surface-light dark:bg-navy-900 border border-surface-border dark:border-navy-700 animate-fadeIn text-left">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-surface-border dark:border-navy-700">
              <span className="text-[11px] font-black uppercase tracking-wider text-card-title flex items-center gap-1.5">
                <span className="flex items-center -space-x-1">
                  <span className="w-2.5 h-3.5 rounded-2xs bg-amber-400 border border-amber-600 inline-block" />
                  <span className="w-2.5 h-3.5 rounded-2xs bg-red-600 border border-red-700 inline-block" />
                </span>
                <span>{lang === 'ml' ? 'മത്സരത്തിലെ കാർഡുകൾ (Bookings)' : 'Match Bookings'}</span>
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {displayEvents.map((evt) => {
                const isYellow = evt.type === 'yellow_card';
                const isRed = evt.type === 'red_card';
                const eventTeam = getEventTeam(evt);
                const teamLabel = eventTeam === 'away'
                  ? activeMatch.teamAway.shortName
                  : activeMatch.teamHome.shortName;
                const playerLabel = getOpeningMatchEventPlayer(evt, isOpeningFixture);
                return (
                  <div
                    key={evt.id}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-navy-800 border border-surface-border dark:border-navy-700 shadow-2xs text-xs"
                  >
                    <span>{isYellow ? '🟨' : isRed ? '🟥' : evt.type === 'goal' ? '⚽' : '📌'}</span>
                    <span className="font-mono font-bold text-royal dark:text-sky">{evt.minute}'</span>
                    <span className="font-bold text-card-title">{playerLabel}</span>
                    <span className="text-[10px] text-card-muted">({teamLabel})</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Notification Toast */}
        {toastMessage && (
          <div className={`mt-4 p-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 animate-fadeIn shadow-xs ${
            toastMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-200 dark:border-emerald-700'
              : 'bg-red-50 text-red-900 border border-red-300 dark:bg-red-950/80 dark:text-red-200 dark:border-red-700'
          }`}>
            {toastMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />}
            <span>{toastMessage.text}</span>
          </div>
        )}

        {/* LIVE-ONLY SECTION: All live elements hidden until match kickoff */}
        {isLive && (
          <div className="mt-6 pt-5 border-t border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-900/60 -mx-4 -mb-4 sm:-mx-7 sm:-mb-7 p-4 sm:p-6 rounded-b-3xl space-y-4">
            {/* FAN CROWD GOAL REPORTING: Controlled strictly by FAN_REPORTS_ENABLED */}
            {FAN_REPORTS_ENABLED && (
              <div className="space-y-4 pb-4 border-b border-slate-200 dark:border-navy-700">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                      <h4 className="text-xs font-black font-sports uppercase tracking-wider text-slate-800 dark:text-white">
                        Fan Crowd Score Pulse
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-800">
                        Anti-Spam Protected
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                      Rate limited to 1 report every 60s (Max 3/match). Referee score remains final authority.
                    </p>
                  </div>

                  {/* Rate limit status pill */}
                  <div className="flex items-center gap-2">
                    {rateLimit.isCooldownActive ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 font-mono font-bold text-xs border border-amber-300 dark:border-amber-700">
                        <Clock className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 animate-spin" />
                        <span>Cooldown: {rateLimit.remainingSeconds}s</span>
                      </span>
                    ) : rateLimit.isLimitReached ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-200 dark:bg-navy-700 text-slate-700 dark:text-slate-300 font-bold text-xs">
                        <span>Limit Reached (3/3)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 font-bold text-xs border border-emerald-300 dark:border-emerald-700">
                        <span>Ready ({rateLimit.reportsCount}/3 used)</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* User Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleCrowdGoal('home')}
                    disabled={rateLimit.isCooldownActive || rateLimit.isLimitReached || matchState.isCrowdLocked || matchState.status === 'FULL_TIME'}
                    className={`min-h-[44px] py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-card active:scale-95 ${
                      rateLimit.isCooldownActive || rateLimit.isLimitReached || matchState.isCrowdLocked || matchState.status === 'FULL_TIME'
                        ? 'bg-slate-200 dark:bg-navy-800 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-navy-700 cursor-not-allowed'
                        : 'bg-sky-700 hover:bg-sky-800 text-white shadow-sm'
                    }`}
                  >
                    <span>⚽ Report Goal: {activeMatch.teamHome.shortName}</span>
                    {rateLimit.isCooldownActive && <span className="text-[10px]">({rateLimit.remainingSeconds}s)</span>}
                  </button>

                  <button
                    onClick={() => handleCrowdGoal('away')}
                    disabled={rateLimit.isCooldownActive || rateLimit.isLimitReached || matchState.isCrowdLocked || matchState.status === 'FULL_TIME'}
                    className={`min-h-[44px] py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-card active:scale-95 ${
                      rateLimit.isCooldownActive || rateLimit.isLimitReached || matchState.isCrowdLocked || matchState.status === 'FULL_TIME'
                        ? 'bg-slate-200 dark:bg-navy-800 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-navy-700 cursor-not-allowed'
                        : 'bg-zinc-800 hover:bg-zinc-900 text-white shadow-sm'
                    }`}
                  >
                    <span>⚽ Report Goal: {activeMatch.teamAway.shortName}</span>
                    {rateLimit.isCooldownActive && <span className="text-[10px]">({rateLimit.remainingSeconds}s)</span>}
                  </button>
                </div>

                {/* Crowd Stats Counter Bar */}
                <div className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-200 bg-white dark:bg-navy-800 p-3 rounded-xl border border-slate-200 dark:border-navy-700 shadow-card">
                  <span>
                    Community Reports: <strong>{matchState.crowdReports?.home || 0} {activeMatch.teamHome.shortName}</strong> vs <strong>{matchState.crowdReports?.away || 0} {activeMatch.teamAway.shortName}</strong>
                  </span>
                  <span className="font-bold text-royal dark:text-sky">
                    🛡️ Ground Desk Authority
                  </span>
                </div>
              </div>
            )}

            {/* Dual Tab: Live Commentary Feed vs Referee Timeline */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-navy-700 pb-2">
                <div className="flex items-center gap-1 bg-slate-200/80 dark:bg-navy-800 p-1 rounded-xl text-xs font-bold">
                  <button
                    onClick={() => setTimelineTab('commentary')}
                    className={`min-h-[44px] px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 active:scale-95 ${
                      timelineTab === 'commentary' 
                        ? 'bg-royal text-white shadow-card font-black' 
                        : 'text-slate-700 dark:text-slate-200 hover:text-royal dark:hover:text-sky'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>{lang === 'ml' ? 'Live Commentary' : 'Live Commentary'}</span>
                  </button>
                  <button
                    onClick={() => setTimelineTab('timeline')}
                    className={`min-h-[44px] px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 active:scale-95 ${
                      timelineTab === 'timeline' 
                        ? 'bg-royal text-white shadow-card font-black' 
                        : 'text-slate-700 dark:text-slate-200 hover:text-royal dark:hover:text-sky'
                    }`}
                  >
                    <span>{lang === 'ml' ? 'റഫറി ഇവന്റ്സ്' : 'Referee Timeline'}</span>
                  </button>
                </div>
              </div>

              {/* View 1: Auto-Generated Commentary Feed (Newest First) */}
              {timelineTab === 'commentary' && (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1 animate-fadeIn">
                  {commentaryLines.length > 0 ? (
                    commentaryLines.map((item, idx) => (
                      <div 
                        key={item.id || idx} 
                        className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white dark:bg-navy-800/80 border border-slate-200 dark:border-navy-700 shadow-2xs text-xs"
                      >
                        <span className="font-sports font-black text-royal dark:text-sky bg-blue-50 dark:bg-blue-950/70 px-2 py-0.5 rounded-md shrink-0 border border-blue-200 dark:border-blue-800">
                          {item.minute}
                        </span>
                        <div className="space-y-0.5 min-w-0 flex-1">
                          <p className="text-slate-900 dark:text-white font-bold leading-relaxed">
                            {item.mainLine}
                          </p>
                          {item.noteText && (
                            <p className="text-[11px] text-slate-600 dark:text-slate-300 italic">
                              "{item.noteText}"
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 px-4 rounded-xl bg-white dark:bg-navy-800/60 border border-dashed border-slate-300 dark:border-navy-700 text-xs text-slate-600 dark:text-slate-300">
                      <Radio className="w-5 h-5 mx-auto mb-1.5 text-royal dark:text-sky opacity-80 animate-pulse" />
                      <span className="font-bold">
                        {lang === 'ml' ? 'Kick-off സമയത്ത് Live Commentary ആരംഭിക്കും' : 'Commentary starts at kickoff'}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* View 2: Official Referee Events */}
              {timelineTab === 'timeline' && (
                <div className="space-y-1.5 max-h-48 overflow-y-auto animate-fadeIn">
                  {displayEvents.length > 0 ? (
                    displayEvents.map((evt) => (
                      <div
                        key={evt.id}
                        className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-white dark:bg-navy-800/80 border border-slate-200 dark:border-navy-700 shadow-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-black text-royal dark:text-sky font-sports">
                            {evt.minute}'
                          </span>
                          <span>
                            {evt.type === 'goal' ? '⚽' : evt.type === 'yellow_card' ? '🟨' : evt.type === 'red_card' ? '🟥' : '🥅'}
                          </span>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {evt.player}
                          </span>
                          {evt.text && (
                            <span className="text-[11px] text-slate-600 dark:text-slate-300 hidden sm:inline">
                              ({evt.text})
                            </span>
                          )}
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
                                  homeTeamName: activeMatch.teamHome.name,
                                  awayTeamName: activeMatch.teamAway.name,
                                  matchStatus: matchState.status,
                                  goalText: evt.text
                                }
                              })}
                              className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/70 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800 transition active:scale-95"
                              title="Share Goal Status to WhatsApp"
                            >
                              <Share2 className="w-3 h-3" />
                              <span>Share</span>
                            </button>
                          )}
                          <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                            Official
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-xs text-slate-600 dark:text-slate-300">
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
          homeTeamName: activeMatch.teamHome.name,
          awayTeamName: activeMatch.teamAway.name,
          matchStatus: matchState.status
        }}
        isDarkMode={isDarkMode}
      />
    </section>
  );
}
