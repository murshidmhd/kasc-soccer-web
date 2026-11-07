import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Zap, 
  Plus, 
  Minus, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  RotateCcw, 
  Send, 
  LogOut,
  Radio,
  Play,
  Pause,
  Square,
  ArrowLeft,
  ExternalLink,
  Trash2,
  X,
  Wifi,
  WifiOff,
  UserCheck,
  Share2,
  Camera,
  Star,
  Award,
  ArrowUpDown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  isAdminAuthenticated, 
  setAdminAuthenticated, 
  getStoredMatchState, 
  saveOfficialMatchState,
  getCalculatedMatchTime,
  canUndoOfficialMatchAction,
  undoLastOfficialMatchAction,
  getMatchHistory,
  getOfflineQueue,
  queueOfflineAction,
  clearOfflineQueue,
  getOfflineQueueCount,
  verifyAdminPin,
  getActiveScorerInfo,
  setActiveScorerInfo,
  SEVENS_HALF_MINUTES,
  SEVENS_TOTAL_MINUTES,
  resetTestMatchState,
  addExtraTimeMinutes
} from '../utils/matchStateManager';
import { HALF_LENGTH_MINUTES, MAX_MATCH_MINUTES } from '../config/siteConfig';
import { tournamentInfo, openingMatch } from '../data/tournamentData';
import logoUdaya from '../assets/logo_udaya_transparent.webp';
import logoKasc from '../assets/logo_kasc.webp';
import GoalShareCardModal from './GoalShareCardModal';
import AddCardModal from './AddCardModal';
import { saveDisciplinaryRecord, removeDisciplinaryRecord } from '../utils/disciplinaryManager';
import { 
  getLineupTactics, 
  updateTeamFormation, 
  updatePlayerPosition, 
  updatePlayerRating,
  swapStarterAndSub, 
  setManOfTheMatchAward, 
  resetLineupTactics,
  SEVENS_FORMATIONS,
  TACTICAL_POSITIONS,
  DEFAULT_TOURNAMENT_SQUADS
} from '../utils/lineupManager';
import AdminLineupPitchEditor from './AdminLineupPitchEditor';

export default function AdminDeskSection({ 
  isDarkMode, 
  lang, 
  onBackToLive, 
  isModal = false, 
  onClose 
}) {
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(isAdminAuthenticated);

  // Match State copy for Admin editing
  const [matchState, setMatchState] = useState(getStoredMatchState);
  const [clock, setClock] = useState(() => getCalculatedMatchTime(getStoredMatchState()));
  const [notification, setNotification] = useState('');

  // Scorer Redundancy & Offline Resiliency
  const [isOnline, setIsOnline] = useState(() => (typeof navigator !== 'undefined' ? navigator.onLine : true));
  const [activeScorer, setActiveScorer] = useState(getActiveScorerInfo);
  const [historyCount, setHistoryCount] = useState(() => getMatchHistory().length);
  const [offlineCount, setOfflineCount] = useState(getOfflineQueueCount);

  // Safety Confirmation Modal for Destructive Ground Actions
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    title: '',
    message: '',
    onConfirm: null,
    confirmText: 'Confirm',
    confirmColor: 'bg-red-600'
  });

  // Custom Time Setter inputs (defaulting to Sevens 30:30)
  const [inputMinutes, setInputMinutes] = useState(30);
  const [inputSeconds, setInputSeconds] = useState(30);

  // New Event Form State
  const [newEvent, setNewEvent] = useState({
    type: 'goal',
    team: 'home',
    player: '',
    playerNumber: null,
    minute: 31,
    text: ''
  });

  // Goal Share WhatsApp Status Modal State
  const [goalShareModal, setGoalShareModal] = useState({
    isOpen: false,
    goalData: null
  });
  const [isCardBookingOpen, setIsCardBookingOpen] = useState(false);

  // Lineup & Tactics Governance State
  const [lineupTactics, setLineupTactics] = useState(getLineupTactics);
  const [selectedTacticsTeam, setSelectedTacticsTeam] = useState('base'); // 'base' or 'krsc'
  const [motmForm, setMotmForm] = useState({
    teamKey: 'base',
    playerNum: 10,
    playerName: 'Ashik Usman',
    rating: '9.2',
    awardTitle: 'Man of the Match (MVP)',
    pos: 'CF',
    photoUrl: '/players/ashik_usman.webp',
    goals: 1,
    shots: 5,
    dribbles: 4
  });

  // Keep lineup tactics synced across tabs and local events
  useEffect(() => {
    const syncTactics = () => {
      setLineupTactics(getLineupTactics());
    };
    window.addEventListener('kasc_lineup_tactics_updated', syncTactics);
    return () => {
      window.removeEventListener('kasc_lineup_tactics_updated', syncTactics);
    };
  }, []);

  const dynamicMatchdaySquads = useMemo(() => {
    const krsc = lineupTactics?.squads?.krsc || DEFAULT_TOURNAMENT_SQUADS.krsc;
    const base = lineupTactics?.squads?.base || DEFAULT_TOURNAMENT_SQUADS.base;
    return {
      home: {
        teamName: krsc.name,
        shortName: krsc.shortName,
        players: [...(krsc.starting || []), ...(krsc.subs || [])]
      },
      away: {
        teamName: base.name,
        shortName: base.shortName,
        players: [...(base.starting || []), ...(base.subs || [])]
      }
    };
  }, [lineupTactics]);

  const handleAdminFormationChange = (teamKey, newFormation) => {
    const updated = updateTeamFormation(teamKey, newFormation);
    setLineupTactics(updated);
    confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
    setNotification(`⚡ Formation updated to ${newFormation} for ${teamKey.toUpperCase()} & applied to Live Pitch!`);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleAdminPositionChange = (teamKey, playerNum, newPosition, startingIndex) => {
    const updated = updatePlayerPosition(teamKey, playerNum, newPosition, startingIndex);
    setLineupTactics(updated);
    setNotification(`🔄 Player #${playerNum} repositioned to ${newPosition}! Pitch updated.`);
    setTimeout(() => setNotification(''), 2500);
  };

  const handleAdminRatingChange = (teamKey, playerNum, newRating, startingIndex) => {
    const parsed = parseFloat(newRating);
    const updated = updatePlayerRating(teamKey, playerNum, isNaN(parsed) ? 0.0 : parsed, startingIndex);
    setLineupTactics(updated);
  };

  const handleAdminSwapPlayers = (teamKey, starterNum, subNum) => {
    if (!subNum) return;
    const updated = swapStarterAndSub(teamKey, starterNum, parseInt(subNum, 10));
    setLineupTactics(updated);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    setNotification(`🔁 Substituted Starter #${starterNum} with Bench Player #${subNum}!`);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleAdminResetTactics = () => {
    const res = resetLineupTactics();
    setLineupTactics(res);
    setNotification('↩️ Lineups, Formations & MOTM reset to default tournament sheet.');
    setTimeout(() => setNotification(''), 3000);
  };

  const handlePublishMotm = () => {
    const teamSquad = lineupTactics.squads[motmForm.teamKey];
    const playerObj = [...teamSquad.starting, ...(teamSquad.subs || [])].find(p => p.num === Number(motmForm.playerNum)) || {};
    
    const motmData = {
      enabled: true,
      teamKey: motmForm.teamKey,
      teamName: teamSquad.name,
      playerNum: Number(motmForm.playerNum),
      playerName: motmForm.playerName || playerObj.name || 'Star Player',
      pos: motmForm.pos || playerObj.pos || 'Forward',
      photoUrl: playerObj.photoUrl || motmForm.photoUrl || (
        motmForm.teamKey === 'base' && Number(motmForm.playerNum) === 10 ? '/players/ashik_usman.webp' : 
        Number(motmForm.playerNum) === 7 ? '/players/aju_ashi.webp' : 
        (motmForm.teamKey === 'krsc' && Number(motmForm.playerNum) === 11) ? '/players/arjun_jayaraj.webp' : ''
      ),
      rating: motmForm.rating || '9.2',
      awardTitle: motmForm.awardTitle || 'Man of the Match (MVP)',
      goals: parseInt(motmForm.goals, 10) || 0,
      shots: parseInt(motmForm.shots, 10) || 4,
      dribbles: parseInt(motmForm.dribbles, 10) || 3
    };

    setManOfTheMatchAward(motmData);
    setLineupTactics(getLineupTactics());
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    setNotification(`🏆 MAN OF THE MATCH AWARDED TO ${motmData.playerName}! Now visible to all fans on the website.`);
    setTimeout(() => setNotification(''), 3500);
  };

  const handleHideMotm = () => {
    setManOfTheMatchAward(null);
    setLineupTactics(getLineupTactics());
    setNotification('🔒 Man of the Match hidden from the public website.');
    setTimeout(() => setNotification(''), 2500);
  };

  // Live ticking interval for the clock inside Admin Desk
  useEffect(() => {
    const interval = setInterval(() => {
      setClock(getCalculatedMatchTime(matchState));
    }, 1000);
    return () => clearInterval(interval);
  }, [matchState]);

  // Sync state whenever mounted or updated
  useEffect(() => {
    const stored = getStoredMatchState();
    setIsAuthenticated(isAdminAuthenticated());
    setMatchState(stored);
    setClock(getCalculatedMatchTime(stored));
    setHistoryCount(getMatchHistory().length);
    setActiveScorer(getActiveScorerInfo());
    setOfflineCount(getOfflineQueueCount());
    setPinError('');
    setPinInput('');
  }, []);

  // Offline / Online network connectivity listeners for 4G ground safety
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      const pendingCount = getOfflineQueueCount();
      if (pendingCount > 0) {
        clearOfflineQueue();
        setOfflineCount(0);
        setNotification(`🟢 Back Online! Auto-synced ${pendingCount} offline score change(s) to tournament server.`);
        setTimeout(() => setNotification(''), 4000);
      } else {
        setNotification('🟢 4G Network connected. Scorer desk live.');
        setTimeout(() => setNotification(''), 2500);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setNotification('🟡 Ground 4G Dropped! Scorer changes are safely buffered in phone storage.');
      setTimeout(() => setNotification(''), 4000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleLogin = (e) => {
    e?.preventDefault();
    const verification = verifyAdminPin(pinInput);
    if (verification.isValid) {
      setIsAuthenticated(true);
      setAdminAuthenticated(true);
      const scorerObj = { role: verification.role, label: verification.label, pinUsed: pinInput.trim() };
      setActiveScorerInfo(scorerObj);
      setActiveScorer(scorerObj);
      setPinError('');
      setNotification(`Authenticated: ${verification.label}`);
      setTimeout(() => setNotification(''), 3000);
    } else {
      setPinError('Invalid Committee PIN. Please enter an authorized scorer PIN.');
    }
  };

  const handleLogout = () => {
    setAdminAuthenticated(false);
    setIsAuthenticated(false);
    setPinInput('');
  };

  // Switch between Primary and Standby Scorer
  const handleScorerHandover = (targetRole) => {
    const newRole = targetRole || (activeScorer.role === 'PRIMARY' ? 'BACKUP' : 'PRIMARY');
    const label = newRole === 'PRIMARY' ? 'Primary Ground Scorer' : 'Standby Backup Scorer';
    const info = { role: newRole, label, pinUsed: 'dev_session' };
    setActiveScorerInfo(info);
    setActiveScorer(info);
    setNotification(`Scorer Handover Complete: ${label}`);
    setTimeout(() => setNotification(''), 3000);
  };

  // Undo Last Action with instant state reversion
  const handleUndo = () => {
    const res = undoLastOfficialMatchAction();
    if (res.success) {
      setMatchState(res.restoredState);
      setClock(getCalculatedMatchTime(res.restoredState));
      setHistoryCount(res.remainingCount);
      setNotification('↩️ Action Undone! Restored previous score and clock state.');
      setTimeout(() => setNotification(''), 3000);
    } else {
      setNotification(res.message);
      setTimeout(() => setNotification(''), 2500);
    }
  };

  // Sevens Football: 30 minutes 1st Half + 30 minutes 2nd Half = 60 minutes
  const handleStartMatch = (half) => {
    const totalSec = half === '1ST_HALF' ? 0 : half === 'HALF_TIME' ? 30 * 60 : 30 * 60;
    const isRunning = half === '1ST_HALF' || half === '2ND_HALF';

    setMatchState((prev) => {
      const next = {
        ...prev,
        status: half,
        matchSeconds: totalSec,
        matchMinute: Math.floor(totalSec / 60),
        isTimerRunning: isRunning,
        timerStartedAt: isRunning ? Date.now() : null,
        isCrowdLocked: false
      };
      saveOfficialMatchState(next);
      setClock(getCalculatedMatchTime(next));
      setHistoryCount(getMatchHistory().length);
      if (!isOnline) {
        queueOfflineAction(next);
        setOfflineCount(getOfflineQueueCount());
      }
      return next;
    });

    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    setNotification(
      half === '1ST_HALF'
        ? '🟢 Match Started! 1st Half Kickoff (00:00 to 30:00) clock is now moving.'
        : half === 'HALF_TIME'
        ? '⏸️ Half Time Whistle (Paused at 30:00).'
        : '▶️ 2nd Half Kickoff (30:00 to 60:00) clock is now moving!'
    );
    setTimeout(() => setNotification(''), 3000);
  };

  const handleToggleTimerRunning = () => {
    const currentClock = getCalculatedMatchTime(matchState);
    const newRunning = !matchState.isTimerRunning;

    setMatchState((prev) => {
      const next = {
        ...prev,
        matchSeconds: currentClock.totalSeconds,
        isTimerRunning: newRunning,
        timerStartedAt: newRunning ? Date.now() : null
      };
      saveOfficialMatchState(next);
      setClock(getCalculatedMatchTime(next));
      setHistoryCount(getMatchHistory().length);
      if (!isOnline) {
        queueOfflineAction(next);
        setOfflineCount(getOfflineQueueCount());
      }
      return next;
    });

    setNotification(newRunning ? '▶️ Match clock resumed and ticking.' : '⏸️ Match clock paused.');
    setTimeout(() => setNotification(''), 2000);
  };

  const handleApplyCustomTime = (min, sec) => {
    const m = typeof min === 'number' ? min : parseInt(inputMinutes, 10) || 0;
    const s = typeof sec === 'number' ? sec : parseInt(inputSeconds, 10) || 0;
    const totalSec = Math.max(0, m * 60 + s);

    // Auto determine status (before 30m is 1st half, after 30m is 2nd half)
    const newStatus = totalSec < 30 * 60 ? '1ST_HALF' : totalSec < 60 * 60 ? '2ND_HALF' : 'FULL_TIME';

    setMatchState((prev) => {
      const next = {
        ...prev,
        status: prev.status === 'UPCOMING' ? newStatus : prev.status,
        matchSeconds: totalSec,
        matchMinute: Math.floor(totalSec / 60),
        isTimerRunning: true,
        timerStartedAt: Date.now()
      };
      saveOfficialMatchState(next);
      setClock(getCalculatedMatchTime(next));
      setHistoryCount(getMatchHistory().length);
      if (!isOnline) {
        queueOfflineAction(next);
        setOfflineCount(getOfflineQueueCount());
      }
      return next;
    });

    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    setNotification(`⚡ Match clock set to ${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')} and moving!`);
    setTimeout(() => setNotification(''), 3000);
  };

  // Safe Stop Match with 2-step confirmation dialog
  const handleStopMatch = () => {
    setConfirmModal({
      open: true,
      title: 'Blow Final Whistle (Full Time)?',
      message: 'Are you sure you want to end the match and lock Full Time (60:00)? This will lock the official final score across all fan mobile screens.',
      confirmText: 'Yes, Blow Final Whistle',
      confirmColor: 'bg-red-600',
      onConfirm: () => {
        setMatchState((prev) => {
          const next = {
            ...prev,
            status: 'FULL_TIME',
            matchSeconds: 60 * 60, // 60:00 Sevens Full Time
            matchMinute: 60,
            isTimerRunning: false,
            isCrowdLocked: true
          };
          saveOfficialMatchState(next);
          setClock(getCalculatedMatchTime(next));
          setHistoryCount(getMatchHistory().length);
          if (!isOnline) {
            queueOfflineAction(next);
            setOfflineCount(getOfflineQueueCount());
          }
          return next;
        });
        setConfirmModal((prev) => ({ ...prev, open: false }));
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
        setNotification('⏹️ Final Whistle blown! Full Time (60:00) locked.');
        setTimeout(() => setNotification(''), 3500);
      }
    });
  };

  const handleAdjustMinute = (delta) => {
    const currentClock = getCalculatedMatchTime(matchState);
    const newTotal = Math.max(0, currentClock.totalSeconds + delta * 60);

    setMatchState((prev) => {
      const next = {
        ...prev,
        matchSeconds: newTotal,
        matchMinute: Math.floor(newTotal / 60),
        timerStartedAt: prev.isTimerRunning ? Date.now() : null
      };
      saveOfficialMatchState(next);
      setClock(getCalculatedMatchTime(next));
      setHistoryCount(getMatchHistory().length);
      if (!isOnline) {
        queueOfflineAction(next);
        setOfflineCount(getOfflineQueueCount());
      }
      return next;
    });
  };

  // Safe Reset Match with 2-step confirmation dialog
  const handleResetToUpcoming = () => {
    setConfirmModal({
      open: true,
      title: 'Wipe & Reset Live Score?',
      message: 'One mis-tap on Reset with a crowd watching wipes the scoreboard! Are you completely sure you want to reset the match to Pre-Match (0-0)?',
      confirmText: 'Yes, Reset to Pre-Match',
      confirmColor: 'bg-red-600',
      onConfirm: () => {
        setMatchState((prev) => {
          const next = {
            ...prev,
            officialScoreHome: 0,
            officialScoreAway: 0,
            status: 'UPCOMING',
            matchSeconds: 0,
            matchMinute: 0,
            isTimerRunning: false,
            isCrowdLocked: false
          };
          saveOfficialMatchState(next);
          setClock(getCalculatedMatchTime(next));
          setHistoryCount(getMatchHistory().length);
          if (!isOnline) {
            queueOfflineAction(next);
            setOfflineCount(getOfflineQueueCount());
          }
          return next;
        });
        setConfirmModal((prev) => ({ ...prev, open: false }));
        setNotification('Match safely reset to Upcoming Pre-Match status (0-0).');
        setTimeout(() => setNotification(''), 2500);
      }
    });
  };

  const handlePromptAddExtraTime = () => {
    const currentExtra = matchState.extraTimeMinutes || 0;
    const newCap = (MAX_MATCH_MINUTES + currentExtra + 5);
    setConfirmModal({
      open: true,
      title: 'Add 5 Minutes Extra Time?',
      message: `Are you sure you want to add 5 minutes stoppage/extra time? This will raise the match clock cap to ${newCap}:00 for this match only.`,
      confirmText: 'Add +5 Minutes',
      confirmColor: 'bg-emerald-600',
      onConfirm: () => {
        setConfirmModal((prev) => ({ ...prev, open: false }));
        const res = addExtraTimeMinutes(5);
        if (res.success) {
          setMatchState(res.state);
          setClock(getCalculatedMatchTime(res.state));
          setNotification(`⏱️ Added 5 minutes extra time! Match cap raised to ${newCap}:00.`);
          setTimeout(() => setNotification(''), 3500);
        }
      }
    });
  };

  const handlePromptResetTestState = () => {
    setConfirmModal({
      open: true,
      title: 'Reset Test Match State?',
      message: 'This will completely clear localStorage test match data, history, and offline queue, and reset to pre-match 0-0 UPCOMING (00:00). Available in DEV only.',
      confirmText: 'Reset Test State',
      confirmColor: 'bg-rose-600',
      onConfirm: () => {
        setConfirmModal((prev) => ({ ...prev, open: false }));
        const res = resetTestMatchState();
        if (res.success) {
          setMatchState(res.state);
          setClock(getCalculatedMatchTime(res.state));
          setHistoryCount(0);
          setNotification('🧪 Test match state completely reset to pre-match 0-0.');
          setTimeout(() => setNotification(''), 3000);
        }
      }
    });
  };

  const handleScoreChange = (team, delta) => {
    setMatchState((prev) => {
      const nextHome = team === 'home' ? Math.max(0, prev.officialScoreHome + delta) : prev.officialScoreHome;
      const nextAway = team === 'away' ? Math.max(0, prev.officialScoreAway + delta) : prev.officialScoreAway;
      const next = {
        ...prev,
        officialScoreHome: nextHome,
        officialScoreAway: nextAway
      };
      saveOfficialMatchState(next);
      setHistoryCount(getMatchHistory().length);
      if (!isOnline) {
        queueOfflineAction(next);
        setOfflineCount(getOfflineQueueCount());
      }
      return next;
    });
  };

  const handleStatusChange = (status) => {
    setMatchState((prev) => {
      const next = {
        ...prev,
        status
      };
      saveOfficialMatchState(next);
      setHistoryCount(getMatchHistory().length);
      return next;
    });
  };

  const handleMinuteChange = (e) => {
    const val = parseInt(e.target.value, 10) || 0;
    setMatchState((prev) => ({
      ...prev,
      matchMinute: Math.max(0, Math.min(90, val))
    }));
  };

  const handleToggleCrowdLock = () => {
    setMatchState((prev) => {
      const next = {
        ...prev,
        isCrowdLocked: !prev.isCrowdLocked
      };
      saveOfficialMatchState(next);
      return next;
    });
  };

  const handleAddOfficialEvent = () => {
    const rawPlayer = newEvent.player.trim();
    if (!rawPlayer) return;

    // Resolve player number and team name
    const currentTeamSquad = dynamicMatchdaySquads[newEvent.team] || dynamicMatchdaySquads.home;
    const matchedSquadPlayer = currentTeamSquad.players.find(
      (p) => p.name.toLowerCase() === rawPlayer.toLowerCase() || p.num === newEvent.playerNumber
    );
    const finalPlayerNumber = newEvent.playerNumber || matchedSquadPlayer?.num || null;
    const finalTeamName = newEvent.team === 'away' ? openingMatch.teamAway.name : openingMatch.teamHome.name;

    const eventObj = {
      id: `evt-${Date.now()}`,
      minute: newEvent.minute,
      team: newEvent.team,
      teamName: finalTeamName,
      player: rawPlayer,
      playerNumber: finalPlayerNumber,
      type: newEvent.type,
      text: newEvent.text.trim() || (newEvent.type === 'goal' ? 'Goal Scored' : newEvent.type === 'red_card' ? 'Red Card Dismissal' : newEvent.type === 'yellow_card' ? 'Caution' : 'Penalty Kick'),
      isOfficial: true,
      timestamp: new Date().toISOString()
    };

    setMatchState((prev) => {
      // Auto-increment official score if goal is logged
      const nextHome = (newEvent.type === 'goal' && newEvent.team === 'home') 
        ? prev.officialScoreHome + 1 
        : prev.officialScoreHome;
      const nextAway = (newEvent.type === 'goal' && newEvent.team === 'away') 
        ? prev.officialScoreAway + 1 
        : prev.officialScoreAway;

      const next = {
        ...prev,
        officialScoreHome: nextHome,
        officialScoreAway: nextAway,
        events: [eventObj, ...(prev.events || [])]
      };
      saveOfficialMatchState(next);
      setHistoryCount(getMatchHistory().length);
      return next;
    });

    // If official YELLOW/RED CARD is logged, persistently store in Disciplinary Database
    if (newEvent.type === 'yellow_card' || newEvent.type === 'red_card') {
      saveDisciplinaryRecord({
        id: eventObj.id,
        cardType: newEvent.type,
        player: rawPlayer,
        playerName: rawPlayer,
        playerNumber: finalPlayerNumber,
        team: newEvent.team,
        teamName: finalTeamName,
        minute: newEvent.minute,
        reason: newEvent.text.trim() || (newEvent.type === 'red_card' ? 'Red Card Dismissal' : 'Caution / Tactical challenge'),
        matchId: openingMatch.id,
        matchTitle: `${openingMatch.teamHome.name} vs ${openingMatch.teamAway.name}`,
        timestamp: eventObj.timestamp
      });
    }

    // If official GOAL is logged, auto-prompt the branded WhatsApp Status Goal Card
    if (newEvent.type === 'goal') {
      setGoalShareModal({
        isOpen: true,
        goalData: {
          scorerName: rawPlayer,
          minute: newEvent.minute,
          goalTeam: newEvent.team,
          scoreHome: newEvent.team === 'home' ? matchState.officialScoreHome + 1 : matchState.officialScoreHome,
          scoreAway: newEvent.team === 'away' ? matchState.officialScoreAway + 1 : matchState.officialScoreAway,
          homeTeamName: openingMatch.teamHome.name,
          awayTeamName: openingMatch.teamAway.name,
          matchStatus: matchState.status === 'UPCOMING' ? 'MATCH HIGHLIGHT' : matchState.status,
          goalText: newEvent.text.trim()
        }
      });
    }

    setNewEvent((prev) => ({
      ...prev,
      player: '',
      playerNumber: null,
      text: ''
    }));

    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    setNotification(newEvent.type === 'goal' ? '⚽ Goal Recorded & Lineup Pitch Updated!' : newEvent.type === 'red_card' ? '🟥 Red Card Logged & Player Sent Off on Lineup!' : '🟨 Yellow Card Logged & Lineup Updated!');
    setTimeout(() => setNotification(''), 2500);
  };

  const handleDeleteEvent = (id) => {
    // Also remove from disciplinary storage if it was a card
    removeDisciplinaryRecord(id);

    setMatchState((prev) => {
      const deletedEvent = (prev.events || []).find((e) => e.id === id);
      const nextHome = (deletedEvent && deletedEvent.type === 'goal' && deletedEvent.team === 'home')
        ? Math.max(0, prev.officialScoreHome - 1)
        : prev.officialScoreHome;
      const nextAway = (deletedEvent && deletedEvent.type === 'goal' && deletedEvent.team === 'away')
        ? Math.max(0, prev.officialScoreAway - 1)
        : prev.officialScoreAway;

      const next = {
        ...prev,
        officialScoreHome: nextHome,
        officialScoreAway: nextAway,
        events: (prev.events || []).filter((e) => e.id !== id)
      };
      saveOfficialMatchState(next);
      setHistoryCount(getMatchHistory().length);
      return next;
    });
  };

  const handleSaveAndBroadcast = () => {
    saveOfficialMatchState(matchState);
    setHistoryCount(getMatchHistory().length);
    if (!isOnline) {
      queueOfflineAction(matchState);
      setOfflineCount(getOfflineQueueCount());
    }
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
    setNotification(
      isOnline 
        ? '✅ OFFICIAL SCORE SAVED & BROADCASTED TO ALL FANS!'
        : '💾 SAVED IN LOCAL OFFLINE QUEUE • Will broadcast when 4G returns'
    );
    setTimeout(() => {
      setNotification('');
      if (isModal && onClose) onClose();
    }, 1200);
  };

  const handleResetCrowdSpam = () => {
    setMatchState((prev) => {
      const next = {
        ...prev,
        crowdReports: {
          home: prev.officialScoreHome * 8,
          away: prev.officialScoreAway * 8,
          total: (prev.officialScoreHome + prev.officialScoreAway) * 8
        }
      };
      saveOfficialMatchState(next);
      return next;
    });
    setNotification('Crowd reports synchronized with official score!');
    setTimeout(() => setNotification(''), 2500);
  };

  return (
    <div className={`w-full ${isModal ? 'flex flex-col h-full' : 'space-y-6 pb-12'}`}>
      {/* Top Header Card */}
      <div className={`rounded-3xl border shadow-xl overflow-hidden transition-colors ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-4 sm:p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center -space-x-2 shrink-0">
              <img 
                src={logoUdaya} 
                alt="Udaya Parambil Peedika (Host Club)" 
                className="w-12 h-12 rounded-full border-2 border-gold bg-white p-0.5 object-contain shadow-md z-10 ring-1 ring-gold/40" 
              />
              <img 
                src={logoKasc} 
                alt="KASC Peruvallur" 
                className="w-9 h-9 rounded-full border border-sky/80 bg-white p-0.5 object-contain opacity-90" 
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-amber-500 text-slate-950 font-black">
                  <ShieldCheck className="w-4 h-4" />
                </span>
                <h2 className="text-base sm:text-xl font-black font-sports uppercase tracking-wider">
                  Official Match Scorer & Admin Desk
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-red-600 text-[10px] font-black uppercase shrink-0">
                  {activeScorer.role === 'PRIMARY' ? 'Primary Scorer' : 'Backup Scorer'}
                </span>
                <span className="hidden xs:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Cloud Sync</span>
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-0.5">
                UDAYA Parambil Peedika & KASC Peruvallur • SFA All India Sevens Season 7
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onBackToLive && (
              <button
                onClick={onBackToLive}
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>View Fan Site</span>
              </button>
            )}

            {isModal && onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Status Notification Flash */}
        {notification && (
          <div className="bg-emerald-600 text-white py-2.5 px-4 text-xs font-bold text-center animate-fadeIn shadow-md">
            {notification}
          </div>
        )}

        <div className="p-4 sm:p-6">
          {/* SCREEN 1: PIN AUTHENTICATION */}
          {!isAuthenticated ? (
            <div className="py-8 max-w-md mx-auto text-center space-y-5">
              <div className="w-16 h-16 rounded-3xl bg-blue-100 text-blue-800 flex items-center justify-center mx-auto shadow-inner">
                <Lock className="w-8 h-8" />
              </div>
              
              <div className="space-y-1">
                <h3 className="text-xl font-black font-sports uppercase tracking-wide">
                  Enter Committee Scorer PIN
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Authorized Ground Referees and Committee Members can unlock the live match clock, score adjustments, and anti-spam controls.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-3.5 max-w-xs mx-auto">
                <input
                  type="password"
                  maxLength={6}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Enter Scorer PIN"
                  className={`w-full p-3.5 text-center text-xl font-mono tracking-widest rounded-2xl border font-bold shadow-xs ${
                    isDarkMode ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                  autoFocus
                />

                {pinError && (
                  <p className="text-xs text-red-600 font-bold bg-red-50 p-2 rounded-xl border border-red-200">
                    {pinError}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-black text-sm uppercase tracking-wider shadow-md transition active:scale-95"
                >
                  Unlock Admin Control Panel
                </button>
              </form>
            </div>
          ) : (
            /* SCREEN 2: MAIN ADMIN CONTROLLER */
            <div className="space-y-6">
              {/* Authenticated Status & Safety Redundancy Bar */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex flex-wrap items-center justify-between text-xs font-bold gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Role: {activeScorer.label}</span>
                  </div>

                  {/* Online / Offline Connectivity Status Pill */}
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    isOnline 
                      ? 'bg-emerald-200 text-emerald-900' 
                      : 'bg-amber-200 text-amber-900 animate-pulse'
                  }`}>
                    {isOnline ? <Wifi className="w-3 h-3 text-emerald-700" /> : <WifiOff className="w-3 h-3 text-amber-700" />}
                    <span>{isOnline ? 'Online (4G Live)' : `Offline Queue (${offlineCount})`}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Undo Button with Stack Counter */}
                  <button
                    onClick={handleUndo}
                    disabled={historyCount === 0}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 active:scale-95 transition shadow-2xs"
                    title="Undo last recorded score or clock action"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Undo Last Action {historyCount > 0 ? `(${historyCount})` : ''}</span>
                  </button>

                  {/* Scorer Takeover Handover Switch */}
                  <button
                    onClick={() => handleScorerHandover()}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-900 text-xs font-bold active:scale-95 transition"
                    title="Switch scorer role to standby backup scorer"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>{activeScorer.role === 'PRIMARY' ? 'Switch to Backup' : 'Switch to Primary'}</span>
                  </button>

                  {onBackToLive && (
                    <button
                      onClick={onBackToLive}
                      className="text-blue-700 hover:underline flex items-center gap-1 font-bold"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Live Site</span>
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-red-700 hover:underline flex items-center gap-1 font-bold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Lock</span>
                  </button>
                </div>
              </div>

              {/* MASTER MATCH CONTROLLER: START / PAUSE / STOP LIVE OPERATIONS */}
              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white space-y-4 shadow-lg border border-blue-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded-xl bg-amber-500 text-slate-950 font-black">
                      <Radio className="w-5 h-5" />
                    </span>
                    <div>
                      <h4 className="text-sm font-black font-sports uppercase tracking-wider text-amber-300">
                        Live Match Operations
                      </h4>
                      <p className="text-xs text-blue-200">
                        Kickoff 1st Half, pause at Half Time, or blow Final Whistle
                      </p>
                    </div>
                  </div>

                  {/* Active Match Status Pill */}
                  <div>
                    {matchState.status === 'UPCOMING' && (
                      <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 font-bold text-xs border border-slate-700">
                        ⚪ Pre-Match (8:45 PM)
                      </span>
                    )}
                    {(matchState.status === '1ST_HALF' || matchState.status === '2ND_HALF') && (
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white font-black text-xs uppercase animate-pulse shadow-xs">
                        <span className="w-2 h-2 rounded-full bg-white"></span>
                        LIVE MATCH ON ({matchState.status === '1ST_HALF' ? '1st Half' : '2nd Half'})
                      </span>
                    )}
                    {matchState.status === 'HALF_TIME' && (
                      <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-xs uppercase shadow-xs">
                        ⏸️ Half Time Break (30:00)
                      </span>
                    )}
                    {matchState.status === 'FULL_TIME' && (
                      <span className="px-3 py-1 rounded-full bg-slate-950 text-white font-black text-xs uppercase border border-slate-700 shadow-xs">
                        🏁 Match Ended (Full Time 60:00)
                      </span>
                    )}
                  </div>
                </div>

                {/* Big Action Buttons (Kerala Sevens: 30 + 30 Mins = 60 Mins) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                  {/* Button 1: Start 1st Half */}
                  <button
                    onClick={() => handleStartMatch('1ST_HALF')}
                    className="p-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex flex-col items-center justify-center gap-1 shadow-md transition active:scale-95"
                  >
                    <span className="text-lg">🟢</span>
                    <span className="uppercase tracking-wider">START MATCH</span>
                    <span className="text-[10px] font-normal opacity-90">(00:00 to 30:00)</span>
                  </button>

                  {/* Button 2: Half Time */}
                  <button
                    onClick={() => handleStartMatch('HALF_TIME')}
                    className="p-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex flex-col items-center justify-center gap-1 shadow-md transition active:scale-95"
                  >
                    <span className="text-lg">⏸️</span>
                    <span className="uppercase tracking-wider">HALF TIME</span>
                    <span className="text-[10px] font-normal opacity-90">(Pause at 30:00)</span>
                  </button>

                  {/* Button 3: Start 2nd Half */}
                  <button
                    onClick={() => handleStartMatch('2ND_HALF')}
                    className="p-3.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs flex flex-col items-center justify-center gap-1 shadow-md transition active:scale-95"
                  >
                    <span className="text-lg">▶️</span>
                    <span className="uppercase tracking-wider">START 2ND HALF</span>
                    <span className="text-[10px] font-normal opacity-90">(Resume 30:00 to 60:00)</span>
                  </button>

                  {/* Button 4: Stop Match (Full Time) with 2-step confirmation */}
                  <button
                    onClick={handleStopMatch}
                    className="p-3.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-xs flex flex-col items-center justify-center gap-1 shadow-md transition active:scale-95"
                  >
                    <span className="text-lg">⏹️</span>
                    <span className="uppercase tracking-wider">STOP MATCH</span>
                    <span className="text-[10px] font-normal opacity-90">(FT 60:00 & Lock)</span>
                  </button>
                </div>

                {/* DIGITAL MOVING CLOCK & CUSTOM TIME SETTER (SEVENS 30:30) */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3.5">
                  {/* Clear Clock Cap Stopped Banner (Task 1 Rule 4) */}
                  {clock.isCapped && (
                    <div className="p-3 rounded-xl bg-amber-500/20 border-2 border-amber-400 text-amber-200 text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-pulse">
                      <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                      <span>
                        {matchState.status === '1ST_HALF' 
                          ? `Clock stopped at ${clock.capDisplay}. Press Half Time.`
                          : `Clock stopped at ${clock.capDisplay}. Press Full Time or add extra time.`}
                      </span>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
                          Live Ticking Match Clock (Kerala Sevens: 30 + 30 Mins)
                        </span>
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="text-3xl font-black font-mono tracking-widest text-white drop-shadow-sm">
                            {clock.display}
                          </span>
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase ${
                            matchState.isTimerRunning ? 'bg-emerald-500 text-slate-950 animate-pulse' : 'bg-slate-700 text-slate-300'
                          }`}>
                            {matchState.isTimerRunning ? 'Clock Running' : 'Clock Paused'}
                          </span>
                          {matchState.status === '1ST_HALF' && clock.totalSeconds > (SEVENS_HALF_MINUTES + 2) * 60 && !matchState.events?.some(e => e.type === 'half_time' || e.type === 'full_time') && (
                            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/25 border border-amber-400 text-amber-300 text-[10px] font-black uppercase animate-pulse">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span>Half time not pressed</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleToggleTimerRunning}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 active:scale-95 self-start sm:self-center shadow-md ${
                        matchState.isTimerRunning
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      }`}
                    >
                      {matchState.isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      <span>{matchState.isTimerRunning ? 'Pause Clock' : 'Resume Clock'}</span>
                    </button>
                  </div>

                  {/* Manual Time Setter (Min:Sec) with 30:30 Quick Preset */}
                  <div className="pt-2.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-2.5 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-blue-200 font-bold">Set Clock:</span>
                      <input
                        type="number"
                        min="0"
                        max="75"
                        value={inputMinutes}
                        onChange={(e) => setInputMinutes(e.target.value)}
                        className="w-14 p-1.5 text-center font-mono font-bold rounded-lg bg-slate-900 border border-slate-700 text-white"
                        placeholder="MM"
                      />
                      <span className="text-white font-bold text-sm">:</span>
                      <input
                        type="number"
                        min="0"
                        max="59"
                        value={inputSeconds}
                        onChange={(e) => setInputSeconds(e.target.value)}
                        className="w-14 p-1.5 text-center font-mono font-bold rounded-lg bg-slate-900 border border-slate-700 text-white"
                        placeholder="SS"
                      />
                      <button
                        onClick={() => handleApplyCustomTime()}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold active:scale-95 shadow-xs"
                      >
                        Apply Time
                      </button>
                    </div>

                    {/* Quick Presets: 30:30, 00:00, 30:00, 60:00 */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => { setInputMinutes(30); setInputSeconds(30); handleApplyCustomTime(30, 30); }}
                        className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 shadow-xs"
                        title="Set to 30:30 (Sevens 2nd Half Kickoff)"
                      >
                        ⚡ 30:30
                      </button>
                      <button
                        onClick={() => { setInputMinutes(0); setInputSeconds(0); handleApplyCustomTime(0, 0); }}
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
                      >
                        00:00
                      </button>
                      <button
                        onClick={() => { setInputMinutes(30); setInputSeconds(0); handleApplyCustomTime(30, 0); }}
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
                      >
                        30:00 (HT)
                      </button>
                      <button
                        onClick={() => { setInputMinutes(60); setInputSeconds(0); handleApplyCustomTime(60, 0); }}
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
                      >
                        60:00 (FT)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Live Minute Quick Increments & Safety Reset Button */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/10 text-xs">
                  <span className="text-blue-200 font-medium">Clock Controls & Extra Time:</span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      onClick={() => handleAdjustMinute(-1)}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] active:scale-95"
                    >
                      -1 Min
                    </button>
                    <button
                      onClick={() => handleAdjustMinute(1)}
                      className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold text-[11px] active:scale-95"
                    >
                      +1 Min
                    </button>
                    <button
                      onClick={handlePromptAddExtraTime}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] active:scale-95 shadow-xs flex items-center gap-1"
                      title="Add 5 minutes stoppage/extra time for this match only"
                    >
                      <span>⏱️ +5 Mins Extra Time</span>
                      {matchState.extraTimeMinutes > 0 && (
                        <span className="px-1 py-0.2 rounded bg-emerald-950 text-[10px] font-black">
                          +{matchState.extraTimeMinutes}m
                        </span>
                      )}
                    </button>
                    <button
                      onClick={handleResetToUpcoming}
                      className="px-2.5 py-1 rounded-lg bg-red-500/30 hover:bg-red-600 text-white font-bold text-[11px] active:scale-95 border border-red-400/40"
                      title="Safely reset to pre-match with confirmation"
                    >
                      Reset Pre-Match
                    </button>
                    {import.meta.env.DEV && (
                      <button
                        onClick={handlePromptResetTestState}
                        className="px-2.5 py-1 rounded-lg bg-rose-700 hover:bg-rose-600 text-white font-bold text-[11px] active:scale-95 border border-rose-400/50"
                        title="Clear localStorage test match state (DEV only)"
                      >
                        🧪 Reset Test State
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION A: OFFICIAL MATCH SCORE OVERWRITE */}
              <div className={`p-4 sm:p-5 rounded-3xl border space-y-4 ${
                isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black font-sports uppercase tracking-wider text-slate-500">
                    Official Ground Scoreboard
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200">
                      FINAL AUTHORITY OVER CROWD
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 items-center">
                  {/* Home Team Score (UDAYA) */}
                  <div className={`p-4 rounded-2xl border text-center space-y-2 ${
                    isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
                  }`}>
                    <span className="text-xs sm:text-sm font-bold text-sky-700 block truncate">
                      {openingMatch.teamHome.name}
                    </span>
                    <div className="text-5xl sm:text-6xl font-black font-sports text-slate-950">
                      {matchState.officialScoreHome}
                    </div>
                    <div className="flex items-center justify-center gap-2 pt-1">
                      <button
                        onClick={() => handleScoreChange('home', -1)}
                        className="w-10 h-10 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-900 font-bold flex items-center justify-center active:scale-95 shadow-xs"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleScoreChange('home', 1)}
                        className="w-10 h-10 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold flex items-center justify-center active:scale-95 shadow-md"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Away Team Score (NEW MALAYA) */}
                  <div className={`p-4 rounded-2xl border text-center space-y-2 ${
                    isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
                  }`}>
                    <span className="text-xs sm:text-sm font-bold text-zinc-900 block truncate">
                      {openingMatch.teamAway.name}
                    </span>
                    <div className="text-5xl sm:text-6xl font-black font-sports text-slate-950">
                      {matchState.officialScoreAway}
                    </div>
                    <div className="flex items-center justify-center gap-2 pt-1">
                      <button
                        onClick={() => handleScoreChange('away', -1)}
                        className="w-10 h-10 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-900 font-bold flex items-center justify-center active:scale-95 shadow-xs"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleScoreChange('away', 1)}
                        className="w-10 h-10 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold flex items-center justify-center active:scale-95 shadow-md"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Score Preset Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-500 mr-1">Quick Presets:</span>
                  {['0-0', '1-0', '0-1', '1-1', '2-1', '2-2', '3-2', '4-2'].map((preset) => {
                    const [h, a] = preset.split('-').map(Number);
                    return (
                      <button
                        key={preset}
                        onClick={() => {
                          setMatchState((prev) => {
                            const next = { ...prev, officialScoreHome: h, officialScoreAway: a };
                            saveOfficialMatchState(next);
                            setHistoryCount(getMatchHistory().length);
                            return next;
                          });
                        }}
                        className="px-3 py-1 rounded-lg text-xs font-sports font-bold bg-slate-200 hover:bg-blue-600 hover:text-white transition active:scale-95 shadow-2xs"
                      >
                        {preset}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION B: MATCH STATUS & CLOCK SLIDER */}
              <div className={`p-4 sm:p-5 rounded-3xl border space-y-3.5 ${
                isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black font-sports uppercase tracking-wider text-slate-500">
                    Match Period & Progress Slider
                  </h4>
                  <span className="text-xs font-bold text-blue-700">
                    Current: {matchState.matchMinute}'
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'UPCOMING', label: 'Upcoming' },
                    { id: '1ST_HALF', label: '1st Half' },
                    { id: 'HALF_TIME', label: 'Half Time' },
                    { id: '2ND_HALF', label: '2nd Half' },
                    { id: 'FULL_TIME', label: 'Full Time (FT)' }
                  ].map((st) => (
                    <button
                      key={st.id}
                      onClick={() => handleStatusChange(st.id)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold transition active:scale-95 ${
                        matchState.status === st.id
                          ? 'bg-blue-700 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>

                {/* Minute Input Slider */}
                <div className="pt-2 flex items-center gap-3">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="range"
                    min="0"
                    max="75"
                    value={matchState.matchMinute}
                    onChange={handleMinuteChange}
                    className="flex-1 accent-blue-600 cursor-pointer"
                  />
                  <span className="w-14 text-center text-xs font-mono font-bold px-2 py-1 bg-white border border-slate-200 rounded-lg shadow-2xs">
                    {matchState.matchMinute}'
                  </span>
                </div>
              </div>

              {/* SECTION C: PUBLISH MATCH EVENT (GOAL / CARD / PENALTY) */}
              <div className={`p-4 sm:p-5 rounded-3xl border space-y-3.5 ${
                isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="text-xs font-black font-sports uppercase tracking-wider text-slate-500">
                    Publish Official Timeline Event
                  </h4>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCardBookingOpen(true)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-600 dark:text-amber-300 font-bold text-[11px] border border-amber-500/30 transition active:scale-95 shadow-2xs"
                    >
                      <span className="flex items-center -space-x-1">
                        <span className="w-2 h-2.5 rounded-2xs bg-amber-400 border border-amber-600 inline-block" />
                        <span className="w-2 h-2.5 rounded-2xs bg-red-600 border border-red-700 inline-block" />
                      </span>
                      <span>{lang === 'ml' ? 'കാർഡ് ചേർക്കുക (Book Card)' : 'Book Yellow / Red Card'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setGoalShareModal({
                        isOpen: true,
                        goalData: {
                          scorerName: newEvent.player || 'Player Name',
                          minute: newEvent.minute || matchState.matchMinute || 24,
                          goalTeam: newEvent.team,
                          scoreHome: matchState.officialScoreHome,
                          scoreAway: matchState.officialScoreAway,
                          homeTeamName: openingMatch.teamHome.name,
                          awayTeamName: openingMatch.teamAway.name,
                          matchStatus: matchState.status === 'UPCOMING' ? 'MATCH HIGHLIGHT' : matchState.status,
                          goalText: newEvent.text || 'Official Goal Highlight'
                        }
                      })}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-300 font-bold text-[11px] border border-blue-500/30 transition active:scale-95"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Status Card Creator</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Event Type</label>
                    <select
                      value={newEvent.type}
                      onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                      className="w-full p-2.5 text-xs font-bold rounded-xl border bg-white border-slate-300 shadow-2xs"
                    >
                      <option value="goal">⚽ Goal</option>
                      <option value="yellow_card">🟨 Yellow Card</option>
                      <option value="red_card">🟥 Red Card</option>
                      <option value="penalty">🥅 Penalty Kick</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Team</label>
                    <select
                      value={newEvent.team}
                      onChange={(e) => setNewEvent({ ...newEvent, team: e.target.value, player: '', playerNumber: null })}
                      className="w-full p-2.5 text-xs font-bold rounded-xl border bg-white border-slate-300 shadow-2xs"
                    >
                      <option value="home">{openingMatch.teamHome.name} (KRSC)</option>
                      <option value="away">{openingMatch.teamAway.name} (BASE)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Player Name</label>
                    <input
                      type="text"
                      value={newEvent.player}
                      onChange={(e) => setNewEvent({ ...newEvent, player: e.target.value, playerNumber: null })}
                      placeholder={newEvent.team === 'away' ? 'e.g. Ashik Usman' : 'e.g. Abdul Vahid C'}
                      className="w-full p-2.5 text-xs font-bold rounded-xl border bg-white border-slate-300 shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Minute</label>
                    <input
                      type="number"
                      value={newEvent.minute}
                      onChange={(e) => setNewEvent({ ...newEvent, minute: parseInt(e.target.value, 10) || 0 })}
                      className="w-full p-2.5 text-xs font-bold rounded-xl border bg-white border-slate-300 shadow-2xs"
                    />
                  </div>
                </div>

                {/* Quick Player Suggestions for Selected Matchday Team */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold">
                    <span>
                      {newEvent.team === 'away' ? 'BASE PERUMBAVUR Matchday Squad:' : 'KRSC KOZHIKKODE Matchday Squad:'}
                    </span>
                    <span className="text-[9px] text-slate-400">Click to select player</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 max-h-24 overflow-y-auto pr-1">
                    {(dynamicMatchdaySquads[newEvent.team]?.players || []).map((p) => {
                      const isSelected = newEvent.player === p.name;
                      return (
                        <button
                          key={`${p.num}-${p.name}`}
                          type="button"
                          onClick={() => setNewEvent((prev) => ({
                            ...prev,
                            player: p.name,
                            playerNumber: p.num
                          }))}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition active:scale-95 flex items-center gap-1 ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                          }`}
                        >
                          <span className="font-mono opacity-70">#{p.num}</span>
                          <span>{p.name}</span>
                          <span className="text-[8px] opacity-60 uppercase">({p.pos})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newEvent.text}
                    onChange={(e) => setNewEvent({ ...newEvent, text: e.target.value })}
                    placeholder="Event note: e.g. Stunning top corner volley"
                    className="flex-1 p-2.5 text-xs rounded-xl border bg-white border-slate-300 shadow-2xs"
                  />
                  <button
                    onClick={handleAddOfficialEvent}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 active:scale-95 shadow-sm shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish Event</span>
                  </button>
                </div>

                {/* Published Events List */}
                {matchState.events && matchState.events.length > 0 && (
                  <div className="pt-2 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Published Match Events ({matchState.events.length})
                    </span>
                    <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                      {matchState.events.map((ev) => (
                        <div 
                          key={ev.id}
                          className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 text-xs shadow-2xs"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="font-mono font-bold text-blue-700">{ev.minute}'</span>
                            <span className="font-bold">{ev.player}</span>
                            <span className="text-slate-500 text-[11px] truncate">({ev.text})</span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {ev.type === 'goal' && (
                              <button
                                onClick={() => setGoalShareModal({
                                  isOpen: true,
                                  goalData: {
                                    scorerName: ev.player,
                                    minute: ev.minute,
                                    goalTeam: ev.team,
                                    scoreHome: matchState.officialScoreHome,
                                    scoreAway: matchState.officialScoreAway,
                                    homeTeamName: openingMatch.teamHome.name,
                                    awayTeamName: openingMatch.teamAway.name,
                                    matchStatus: matchState.status,
                                    goalText: ev.text
                                  }
                                })}
                                className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1 border border-emerald-200 transition active:scale-95"
                                title="Generate WhatsApp Status Goal Card"
                              >
                                <Share2 className="w-3 h-3" />
                                <span>Share</span>
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteEvent(ev.id)}
                              className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                              title="Delete Event"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION D: ANTI-SPAM & CROWD REPORTING GOVERNANCE */}
              <div className={`p-4 sm:p-5 rounded-3xl border space-y-3.5 ${
                isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-black font-sports uppercase tracking-wider text-slate-700">
                      Crowd Anti-Spam Governance
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Fans have a 60s cooldown limit and a strict 3-submission maximum per device.
                    </p>
                  </div>

                  <button
                    onClick={handleToggleCrowdLock}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-xs ${
                      matchState.isCrowdLocked
                        ? 'bg-red-600 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {matchState.isCrowdLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                    <span>{matchState.isCrowdLocked ? 'Crowd Input: LOCKED' : 'Crowd Input: ACTIVE'}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                  <span className="text-slate-600">
                    Current Fan Reports: <strong>{matchState.crowdReports?.total || 0} votes</strong>
                  </span>
                  <button
                    onClick={handleResetCrowdSpam}
                    className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs flex items-center gap-1 shadow-2xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Sync Crowd to Official Score</span>
                  </button>
                </div>
              </div>

              {/* SECTION E0: VISUAL LINEUP PITCH EDITOR (New - Tap to Edit Players) */}
              <div className={`p-4 sm:p-5 rounded-3xl border space-y-4 ${
                isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <AdminLineupPitchEditor isDarkMode={isDarkMode} />
              </div>

              {/* SECTION E: 7-A-SIDE FORMATIONS & SQUAD TACTICAL GOVERNANCE */}
              <div className={`p-4 sm:p-5 rounded-3xl border space-y-4 ${
                isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-xl bg-purple-500/20 text-purple-400 font-black">
                      <ArrowUpDown className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="text-xs font-black font-sports uppercase tracking-wider text-slate-700 dark:text-slate-200">
                        7-A-Side Formations & Tactical Squad Control
                      </h4>
                      <p className="text-[10px] text-slate-500">
                        Admin-only control: Adjust formations, change player roles (e.g. CB to CF), and swap starters.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAdminResetTactics}
                    className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 transition"
                  >
                    Reset to Default Squads
                  </button>
                </div>

                {/* Formation Selectors (Home vs Away) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  {/* KRSC Formation */}
                  <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <div>
                      <span className="text-xs font-black font-sports text-slate-900 dark:text-white block">
                        KRSC KOZHIKKODE
                      </span>
                      <span className="text-[10px] text-amber-500 font-bold uppercase">HOME TEAM (TOP)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-500">Formation:</span>
                      <select
                        value={lineupTactics?.formations?.home || '2-2-2'}
                        onChange={(e) => handleAdminFormationChange('krsc', e.target.value)}
                        className="px-2.5 py-1 text-xs font-bold font-mono rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white cursor-pointer shadow-xs"
                      >
                        {SEVENS_FORMATIONS.map((f) => (
                          <option key={`admin-krsc-${f}`} value={f}>{f}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* BASE Formation */}
                  <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <div>
                      <span className="text-xs font-black font-sports text-slate-900 dark:text-white block">
                        BASE PERUMBAVUR
                      </span>
                      <span className="text-[10px] text-blue-500 font-bold uppercase">AWAY TEAM (BOTTOM)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-500">Formation:</span>
                      <select
                        value={lineupTactics?.formations?.away || '2-2-2'}
                        onChange={(e) => handleAdminFormationChange('base', e.target.value)}
                        className="px-2.5 py-1 text-xs font-bold font-mono rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white cursor-pointer shadow-xs"
                      >
                        {SEVENS_FORMATIONS.map((f) => (
                          <option key={`admin-base-${f}`} value={f}>{f}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Team Roster Selection Tabs */}
                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTacticsTeam('base')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black font-sports uppercase transition ${
                      selectedTacticsTeam === 'base'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    BASE PERUMBAVUR ({lineupTactics?.squads?.base?.starting?.length || 7} Starters + {lineupTactics?.squads?.base?.subs?.length || 6} Subs)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTacticsTeam('krsc')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black font-sports uppercase transition ${
                      selectedTacticsTeam === 'krsc'
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    KRSC KOZHIKKODE ({lineupTactics?.squads?.krsc?.starting?.length || 7} Starters + {lineupTactics?.squads?.krsc?.subs?.length || 3} Subs)
                  </button>
                </div>

                {/* Editable Starting 7 Players List */}
                {(() => {
                  const currentSquad = lineupTactics?.squads?.[selectedTacticsTeam] || DEFAULT_TOURNAMENT_SQUADS[selectedTacticsTeam];
                  const starters = currentSquad.starting || [];
                  const subs = currentSquad.subs || [];

                  return (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                        <span>Starting 7 on Turf (Click dropdown to change player role/position):</span>
                        <span className="text-[10px] text-emerald-600 font-mono">7 Active Players</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {starters.map((player, playerIndex) => (
                          <div
                            key={`starter-${player.num}-${player.name}-${playerIndex}`}
                            className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 shadow-2xs"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-800 flex items-center justify-center font-mono font-black text-xs text-white shrink-0 relative">
                                {player.photoUrl ? (
                                  <img
                                    src={player.photoUrl}
                                    alt={player.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                      e.currentTarget.nextSibling && (e.currentTarget.nextSibling.style.display = 'flex');
                                    }}
                                  />
                                ) : null}
                                <span style={{display: player.photoUrl ? 'none' : 'flex'}} className="absolute inset-0 items-center justify-center text-[9px] font-black text-center leading-tight text-white px-0.5">
                                  {(player.name || '').split(' ')[0]?.slice(0,5) || `#${player.num}`}
                                </span>
                              </div>
                              <div className="min-w-0 leading-tight">
                                <span className="text-xs font-black text-slate-900 dark:text-white truncate block">
                                  {player.name} {player.captain ? ' (C)' : ''}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  Current: <strong className="text-blue-500">{player.pos}</strong>
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              {/* Position Role Selector */}
                              <select
                                value={player.pos}
                                onChange={(e) => handleAdminPositionChange(selectedTacticsTeam, player.num, e.target.value, playerIndex)}
                                className="px-2 py-1 text-xs font-bold font-mono rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white cursor-pointer"
                                title="Change Player Tactical Position (e.g. CB to CF)"
                              >
                                {TACTICAL_POSITIONS.map((pos) => (
                                  <option key={`pos-${playerIndex}-${pos.code}`} value={pos.code}>
                                    {pos.code} - {pos.category}
                                  </option>
                                ))}
                              </select>

                              {/* Admin Rating Input */}
                              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-1.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700" title="Player Match Rating (Set by Admin)">
                                <span className="text-[10px] font-mono text-amber-500 font-black">★</span>
                                <input
                                  type="number"
                                  min="0"
                                  max="10"
                                  step="0.1"
                                  value={player.baseRating || 0}
                                  onChange={(e) => handleAdminRatingChange(selectedTacticsTeam, player.num, e.target.value, playerIndex)}
                                  className="w-10 bg-transparent text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-hidden"
                                />
                              </div>

                              {/* Quick Swap with Bench */}
                              {subs.length > 0 && (
                                <select
                                  defaultValue=""
                                  onChange={(e) => {
                                    if (e.target.value) {
                                      handleAdminSwapPlayers(selectedTacticsTeam, player.num, e.target.value);
                                      e.target.value = "";
                                    }
                                  }}
                                  className="px-1.5 py-1 text-[10px] font-bold rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-600 dark:text-amber-400 cursor-pointer"
                                  title="Substitute with player from bench"
                                >
                                  <option value="" disabled>Swap ⇅</option>
                                  {subs.map((s) => (
                                    <option key={`swap-sub-${s.num}`} value={s.num}>
                                      Sub #{s.num} {s.name}
                                    </option>
                                  ))}
                                </select>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Substitutes Bench List */}
                      <div className="pt-2">
                        <span className="text-[11px] font-bold text-slate-500 block mb-1">
                          Substitutes Bench ({subs.length} players):
                        </span>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {subs.map((s) => (
                            <div 
                              key={`bench-${s.num}-${s.name}`}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
                            >
                              {s.photoUrl ? (
                                <img
                                  src={s.photoUrl}
                                  alt={s.name}
                                  className="w-4 h-4 rounded-full object-cover shrink-0"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              ) : (
                                <span className="font-mono text-[10px] text-slate-400">#{s.num}</span>
                              )}
                              <span>{s.name}</span>
                              <span className="text-[9px] uppercase px-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-500">{s.pos || 'SUB'}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* SECTION F: MAN OF THE MATCH (MVP) AWARD CONTROL - Only available after FULL_TIME */}
              {matchState.status !== 'FULL_TIME' ? (
                <div className={`p-4 sm:p-5 rounded-3xl border space-y-2 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-xl bg-slate-500/20 text-slate-400 font-black">
                      <Star className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="text-xs font-black font-sports uppercase tracking-wider text-slate-500">Man of the Match (MVP) Governance</h4>
                      <p className="text-[10px] text-slate-400">🔒 Available only after Full Time (60:00). Match must be completed first.</p>
                    </div>
                  </div>
                </div>
              ) : (
              <div className={`p-4 sm:p-5 rounded-3xl border space-y-4 ${
                isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400 font-black">
                      <Star className="w-4 h-4 fill-current" />
                    </span>
                    <div>
                      <h4 className="text-xs font-black font-sports uppercase tracking-wider text-slate-700 dark:text-slate-200">
                        Man of the Match (MVP) Governance
                      </h4>
                      <p className="text-[10px] text-slate-500">
                        Hidden by default. Admin selects and publishes the award after match completion.
                      </p>
                    </div>
                  </div>

                  {/* Current MOTM Status Badge */}
                  <div>
                    {lineupTactics?.manOfTheMatch?.enabled ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-mono font-bold text-[10px] flex items-center gap-1 shadow-2xs">
                        <span>✓</span>
                        <span>LIVE ON FAN SITE: #{lineupTactics.manOfTheMatch.playerNum} {lineupTactics.manOfTheMatch.playerName}</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono font-bold text-[10px]">
                        🔒 MOTM Currently Hidden
                      </span>
                    )}
                  </div>
                </div>

                {/* MOTM Award Selection Controls */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Award Winning Team</label>
                    <select
                      value={motmForm.teamKey}
                      onChange={(e) => {
                        const newTeam = e.target.value;
                        const squad = lineupTactics.squads[newTeam] || DEFAULT_TOURNAMENT_SQUADS[newTeam];
                        const defaultP = squad.starting[6] || squad.starting[0];
                        setMotmForm((prev) => ({
                          ...prev,
                          teamKey: newTeam,
                          playerNum: defaultP.num,
                          playerName: defaultP.name,
                          pos: defaultP.pos,
                          photoUrl: defaultP.photoUrl || ''
                        }));
                      }}
                      className="w-full p-2.5 text-xs font-bold rounded-xl border bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white shadow-2xs"
                    >
                      <option value="base">BASE PERUMBAVUR</option>
                      <option value="krsc">KRSC KOZHIKKODE</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Select MVP Player</label>
                    <select
                      value={motmForm.playerNum}
                      onChange={(e) => {
                        const pNum = Number(e.target.value);
                        const squad = lineupTactics.squads[motmForm.teamKey] || DEFAULT_TOURNAMENT_SQUADS[motmForm.teamKey];
                        const found = [...squad.starting, ...(squad.subs || [])].find(p => p.num === pNum);
                        if (found) {
                          setMotmForm((prev) => ({
                            ...prev,
                            playerNum: found.num,
                            playerName: found.name,
                            pos: found.pos,
                            photoUrl: found.photoUrl || ''
                          }));
                        }
                      }}
                      className="w-full p-2.5 text-xs font-bold rounded-xl border bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white shadow-2xs"
                    >
                      {(() => {
                        const squad = lineupTactics.squads[motmForm.teamKey] || DEFAULT_TOURNAMENT_SQUADS[motmForm.teamKey];
                        const allPlayers = [...squad.starting, ...(squad.subs || [])];
                        return allPlayers.map((p) => (
                          <option key={`motm-option-${p.num}`} value={p.num}>
                            #{p.num} {p.name} ({p.pos})
                          </option>
                        ));
                      })()}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Official Rating</label>
                    <input
                      type="number"
                      step="0.1"
                      min="5.0"
                      max="10.0"
                      value={motmForm.rating}
                      onChange={(e) => setMotmForm({ ...motmForm, rating: e.target.value })}
                      placeholder="e.g. 9.2"
                      className="w-full p-2.5 text-xs font-bold font-mono rounded-xl border bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Award Title</label>
                    <input
                      type="text"
                      value={motmForm.awardTitle}
                      onChange={(e) => setMotmForm({ ...motmForm, awardTitle: e.target.value })}
                      placeholder="e.g. Man of the Match"
                      className="w-full p-2.5 text-xs font-bold rounded-xl border bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white shadow-2xs"
                    />
                  </div>
                </div>

                {/* Quick Performance Numbers */}
                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Goals Scored</label>
                    <input
                      type="number"
                      min="0"
                      value={motmForm.goals}
                      onChange={(e) => setMotmForm({ ...motmForm, goals: parseInt(e.target.value, 10) || 0 })}
                      className="w-full p-2 text-xs font-mono font-bold rounded-xl border bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Shots on Target</label>
                    <input
                      type="number"
                      min="0"
                      value={motmForm.shots}
                      onChange={(e) => setMotmForm({ ...motmForm, shots: parseInt(e.target.value, 10) || 0 })}
                      className="w-full p-2 text-xs font-mono font-bold rounded-xl border bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Completed Dribbles</label>
                    <input
                      type="number"
                      min="0"
                      value={motmForm.dribbles}
                      onChange={(e) => setMotmForm({ ...motmForm, dribbles: parseInt(e.target.value, 10) || 0 })}
                      className="w-full p-2 text-xs font-mono font-bold rounded-xl border bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handlePublishMotm}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-1.5 active:scale-98 transition cursor-pointer"
                  >
                    <Star className="w-4 h-4 fill-current" />
                    <span>Publish Man of the Match to Fan Site</span>
                  </button>

                  {lineupTactics?.manOfTheMatch?.enabled && (
                    <button
                      type="button"
                      onClick={handleHideMotm}
                      className="py-3 px-4 rounded-xl bg-rose-600/15 hover:bg-rose-600/25 border border-rose-600/40 text-rose-500 font-bold text-xs uppercase transition active:scale-95 cursor-pointer"
                    >
                      Hide MOTM
                    </button>
                  )}
                </div>
              </div>
              )}
              <div className="pt-2">
                <button
                  onClick={handleSaveAndBroadcast}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white font-black text-sm uppercase tracking-wider shadow-xl flex items-center justify-center gap-2 active:scale-98 transition"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Save & Push Official Score to Website</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Safety Confirmation Modal for Destructive Ground Actions */}
      {confirmModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700 text-white p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-black font-sports uppercase tracking-wider text-white">
                  {confirmModal.title}
                </h4>
                <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wide">
                  Referee Desk Safety Confirmation
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {confirmModal.message}
            </p>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModal((prev) => ({ ...prev, open: false }))}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition active:scale-95"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmModal.onConfirm}
                className={`flex-1 py-2.5 rounded-xl text-white font-black text-xs uppercase tracking-wider transition active:scale-95 shadow-md ${confirmModal.confirmColor}`}
              >
                {confirmModal.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Branded 1080x1920 WhatsApp Status / Story Goal Card Modal */}
      <GoalShareCardModal
        isOpen={goalShareModal.isOpen}
        onClose={() => setGoalShareModal({ isOpen: false, goalData: null })}
        initialGoalData={goalShareModal.goalData || {
          scoreHome: matchState.officialScoreHome,
          scoreAway: matchState.officialScoreAway,
          minute: matchState.matchMinute || 30,
          homeTeamName: openingMatch.teamHome.name,
          awayTeamName: openingMatch.teamAway.name,
          matchStatus: matchState.status
        }}
        isDarkMode={isDarkMode}
      />

      {/* Admin Disciplinary Card Booking Modal (Yellow & Red Cards) */}
      <AddCardModal
        isOpen={isCardBookingOpen}
        onClose={() => setIsCardBookingOpen(false)}
        isDarkMode={isDarkMode}
        lang={lang}
      />
    </div>
  );
}
