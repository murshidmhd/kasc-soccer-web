import { HALF_LENGTH_MINUTES, MAX_MATCH_MINUTES } from '../config/siteConfig.js';

// Match State, Offline Queue, Scorer Redundancy, and Anti-Spam Rate Limiter for KASC Sevens

const MATCH_STORAGE_KEY = 'kasc_official_match_state_v2';
const MATCH_HISTORY_KEY = 'kasc_official_match_history_v1';
const OFFLINE_QUEUE_KEY = 'kasc_offline_event_queue_v1';
const SCORER_ROLE_KEY = 'kasc_scorer_active_role';
const USER_LAST_REPORT_KEY = 'kasc_user_last_report_ts';
const USER_REPORT_COUNT_KEY = 'kasc_user_report_count';
const ADMIN_AUTH_KEY = 'kasc_admin_session_auth';

export const COOLDOWN_SECONDS = 60; // 60s Anti-Spam for crowd reports
export const MAX_REPORTS_PER_USER = 3; // Strict 3 reports max per device
// Admin PIN removed from source for production security; read strictly via VITE_DEV_ADMIN_PIN in dev only

// Kerala Sevens Football: 30 minutes + 30 minutes = 60 minutes full match
export const SEVENS_HALF_MINUTES = HALF_LENGTH_MINUTES;
export const SEVENS_TOTAL_MINUTES = MAX_MATCH_MINUTES;

// Real Official Match State (Pre-Kickoff, authentic state before Nov 6, 2026, 8:00 PM IST)
export const realOfficialMatchState = {
  officialScoreHome: 0,
  officialScoreAway: 0,
  matchSeconds: 0,
  matchMinute: 0,
  isTimerRunning: false,
  timerStartedAt: null,
  status: 'UPCOMING',
  extraTimeMinutes: 0,
  isVerified: false,
  scoreEnteredByDesk: false,
  lastUpdated: new Date().toISOString(),
  updatedBy: '',
  isCrowdLocked: true,
  crowdReports: {
    home: 0,
    away: 0,
    total: 0
  },
  events: []
};

export const DEMO_MODE_KEY = 'kasc_demo_mode_active';

// Demo mode is available strictly in DEV builds or when ?demo=1 is present in non-production
export function isDemoModeActive() {
  if (!import.meta.env.DEV) {
    return false;
  }
  try {
    const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const hasDemoParam = urlParams?.get('demo') === '1';
    return hasDemoParam || localStorage.getItem(DEMO_MODE_KEY) === 'true';
  } catch (e) {
    return false;
  }
}

// In production builds, demo toggling is impossible and does nothing
export async function setDemoModeActive(enabled) {
  if (!import.meta.env.DEV) {
    return;
  }
  try {
    if (enabled) {
      const { demoOfficialMatchState } = await import('./demoMatchData.js');
      localStorage.setItem(DEMO_MODE_KEY, 'true');
      localStorage.setItem(MATCH_STORAGE_KEY, JSON.stringify(demoOfficialMatchState));
      window.dispatchEvent(new CustomEvent('kasc_match_state_updated', { detail: demoOfficialMatchState }));
    } else {
      localStorage.removeItem(DEMO_MODE_KEY);
      localStorage.setItem(MATCH_STORAGE_KEY, JSON.stringify(realOfficialMatchState));
      window.dispatchEvent(new CustomEvent('kasc_match_state_updated', { detail: realOfficialMatchState }));
    }
    window.dispatchEvent(new CustomEvent('kasc_demo_mode_changed', { detail: Boolean(enabled) }));
  } catch (e) {
    console.error('Failed to toggle demo mode', e);
  }
}

// Dynamic loader for development demo commentary
export async function getDemoCommentaryIfDev() {
  if (!import.meta.env.DEV) return [];
  try {
    const { sampleDemoCommentary } = await import('./demoMatchData.js');
    return sampleDemoCommentary;
  } catch (e) {
    return [];
  }
}

export function getDaysToKickoff() {
  const kickoff = new Date('2026-11-06T20:00:00+05:30').getTime();
  const diff = kickoff - Date.now();
  if (diff <= 0) return 0;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export const initialOfficialMatchState = realOfficialMatchState;

// Calculate real-time ticking match time (MM:SS) with caps per Sevens rules
export function getCalculatedMatchTime(matchState) {
  const halfMinutes = typeof HALF_LENGTH_MINUTES === 'number' ? HALF_LENGTH_MINUTES : 30;
  const maxMinutes = typeof MAX_MATCH_MINUTES === 'number' ? MAX_MATCH_MINUTES : 60;
  const extraMinutes = (matchState && typeof matchState.extraTimeMinutes === 'number') ? Math.max(0, matchState.extraTimeMinutes) : 0;
  const pad = (n) => String(n).padStart(2, '0');

  if (!matchState || matchState.status === 'UPCOMING' || !matchState.status) {
    return {
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      display: '00:00',
      minuteOnly: 0,
      isRunning: false,
      isCapped: false,
      capMinutes: halfMinutes,
      capDisplay: `${pad(halfMinutes)}:00`,
      status: 'UPCOMING'
    };
  }

  // HALF_TIME: frozen at exactly 1st half length (or custom set seconds within 1st half)
  if (matchState.status === 'HALF_TIME') {
    const htSeconds = halfMinutes * 60;
    const minutes = Math.floor(htSeconds / 60);
    const seconds = htSeconds % 60;
    return {
      minutes,
      seconds,
      totalSeconds: htSeconds,
      display: `${pad(minutes)}:${pad(seconds)}`,
      minuteOnly: minutes,
      isRunning: false,
      isCapped: true,
      capMinutes: halfMinutes,
      capDisplay: `${pad(halfMinutes)}:00`,
      status: 'HALF_TIME'
    };
  }

  // FULL_TIME: frozen at match cap (60:00 or with extra time)
  if (matchState.status === 'FULL_TIME') {
    const ftCapMinutes = maxMinutes + extraMinutes;
    const ftSeconds = ftCapMinutes * 60;
    const minutes = Math.floor(ftSeconds / 60);
    const seconds = ftSeconds % 60;
    return {
      minutes,
      seconds,
      totalSeconds: ftSeconds,
      display: `${pad(minutes)}:${pad(seconds)}`,
      minuteOnly: minutes,
      isRunning: false,
      isCapped: true,
      capMinutes: ftCapMinutes,
      capDisplay: `${pad(ftCapMinutes)}:00`,
      status: 'FULL_TIME'
    };
  }

  // Active match status (1ST_HALF or 2ND_HALF or custom)
  const isFirstHalf = matchState.status === '1ST_HALF';
  const capMinutes = isFirstHalf ? halfMinutes : (maxMinutes + extraMinutes);
  const capSeconds = capMinutes * 60;

  let totalSeconds = typeof matchState.matchSeconds === 'number'
    ? matchState.matchSeconds
    : (matchState.matchMinute || 0) * 60;

  if (matchState.isTimerRunning && matchState.timerStartedAt) {
    const elapsed = Math.max(0, Math.floor((Date.now() - matchState.timerStartedAt) / 1000));
    totalSeconds += elapsed;
  }

  // Enforce cap: clock stops at capMinutes (30:00 or 60:00 / 65:00)
  const isCapped = totalSeconds >= capSeconds;
  if (isCapped) {
    totalSeconds = capSeconds;
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const display = `${pad(minutes)}:${pad(seconds)}`;

  return {
    minutes,
    seconds,
    totalSeconds,
    display,
    minuteOnly: minutes,
    isRunning: Boolean(matchState.isTimerRunning) && !isCapped,
    isCapped,
    capMinutes,
    capDisplay: `${pad(capMinutes)}:00`,
    status: matchState.status
  };
}

// Reset match state strictly for development/testing
export function resetTestMatchState() {
  try {
    localStorage.removeItem(MATCH_STORAGE_KEY);
    localStorage.removeItem(MATCH_HISTORY_KEY);
    localStorage.removeItem(OFFLINE_QUEUE_KEY);
    localStorage.setItem(MATCH_STORAGE_KEY, JSON.stringify(realOfficialMatchState));
    window.dispatchEvent(new CustomEvent('kasc_match_state_updated', { detail: realOfficialMatchState }));
    return { success: true, state: realOfficialMatchState };
  } catch (err) {
    console.error('Failed to reset test match state', err);
    return { success: false, state: realOfficialMatchState };
  }
}

// Add extra time (stoppage time) raising the cap for the current match
export function addExtraTimeMinutes(minutesToAdd = 5) {
  try {
    const currentState = getStoredMatchState();
    const currentExtra = typeof currentState.extraTimeMinutes === 'number' ? currentState.extraTimeMinutes : 0;
    const newExtra = currentExtra + minutesToAdd;
    
    // If timer was capped and stopped, resume timer from current capped seconds
    const currentClock = getCalculatedMatchTime(currentState);
    
    const updatedState = {
      ...currentState,
      extraTimeMinutes: newExtra,
      matchSeconds: currentClock.totalSeconds,
      matchMinute: Math.floor(currentClock.totalSeconds / 60),
      isTimerRunning: true,
      timerStartedAt: Date.now(),
      lastUpdated: new Date().toISOString()
    };
    
    pushMatchHistory(currentState);
    localStorage.setItem(MATCH_STORAGE_KEY, JSON.stringify(updatedState));
    window.dispatchEvent(new CustomEvent('kasc_match_state_updated', { detail: updatedState }));
    return { success: true, state: updatedState, newExtra };
  } catch (err) {
    console.error('Failed to add extra time', err);
    return { success: false };
  }
}

// Retrieve stored state or fallback to real pre-match default
export function getStoredMatchState() {
  try {
    const raw = localStorage.getItem(MATCH_STORAGE_KEY);
    if (!raw) {
      return realOfficialMatchState;
    }
    const parsed = JSON.parse(raw);
    if (!isDemoModeActive() && (parsed.updatedBy === 'Demo Simulation Mode' || (parsed.status === '2ND_HALF' && parsed.officialScoreHome === 2 && parsed.officialScoreAway === 1))) {
      return realOfficialMatchState;
    }
    return parsed;
  } catch (err) {
    console.error('Failed to read match state from localStorage', err);
    return realOfficialMatchState;
  }
}

// History Stack for Scorer Undo safety
export function getMatchHistory() {
  try {
    const raw = localStorage.getItem(MATCH_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function pushMatchHistory(state) {
  try {
    const history = getMatchHistory();
    // Keep max 10 states for undo
    const updated = [JSON.parse(JSON.stringify(state)), ...history].slice(0, 10);
    localStorage.setItem(MATCH_HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to push match history', e);
  }
}

export function canUndoOfficialMatchAction() {
  const history = getMatchHistory();
  return history.length > 0;
}

export function undoLastOfficialMatchAction() {
  try {
    const history = getMatchHistory();
    if (!history || history.length === 0) {
      return { success: false, message: 'തിരിച്ചെടുക്കാൻ മാറ്റങ്ങളൊന്നുമില്ല (No actions to undo).' };
    }
    const previousState = history[0];
    const remainingHistory = history.slice(1);
    localStorage.setItem(MATCH_HISTORY_KEY, JSON.stringify(remainingHistory));
    localStorage.setItem(MATCH_STORAGE_KEY, JSON.stringify(previousState));
    window.dispatchEvent(new CustomEvent('kasc_match_state_updated', { detail: previousState }));
    return { success: true, restoredState: previousState, remainingCount: remainingHistory.length };
  } catch (e) {
    console.error('Failed to undo match action', e);
    return { success: false, message: 'Undo action failed.' };
  }
}

// Offline Event Queue for Ground Scorer Connectivity Drops
export function getOfflineQueue() {
  try {
    const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function queueOfflineAction(action) {
  try {
    const queue = getOfflineQueue();
    const item = {
      id: `offline-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: Date.now(),
      action
    };
    const updated = [...queue, item];
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('kasc_offline_queue_changed', { detail: updated }));
    return item;
  } catch (e) {
    console.error('Failed to queue offline action', e);
    return null;
  }
}

export function clearOfflineQueue() {
  localStorage.removeItem(OFFLINE_QUEUE_KEY);
  window.dispatchEvent(new CustomEvent('kasc_offline_queue_changed', { detail: [] }));
}

export function getOfflineQueueCount() {
  return getOfflineQueue().length;
}

// Scorer Handover & Role Management
export function verifyAdminPin(pin) {
  // Disabled in production builds
  if (!import.meta.env.DEV) {
    return { isValid: false, role: null, label: null };
  }
  const devPin = import.meta.env.VITE_DEV_ADMIN_PIN;
  if (!devPin) {
    return { isValid: false, role: null, label: null };
  }
  const clean = (pin || '').trim();
  if (clean === devPin.trim()) {
    return { isValid: true, role: 'PRIMARY', label: 'Dev Scorer (ഡെവലപ്‌മെന്റ് സ്കോറർ)' };
  }
  return { isValid: false, role: null, label: null };
}

export function getActiveScorerInfo() {
  try {
    const raw = localStorage.getItem(SCORER_ROLE_KEY);
    if (!raw) return { role: 'PRIMARY', label: 'Primary Ground Scorer' };
    return JSON.parse(raw);
  } catch (e) {
    return { role: 'PRIMARY', label: 'Primary Ground Scorer' };
  }
}

export function setActiveScorerInfo(info) {
  try {
    localStorage.setItem(SCORER_ROLE_KEY, JSON.stringify(info));
    window.dispatchEvent(new CustomEvent('kasc_scorer_role_changed', { detail: info }));
  } catch (e) {
    console.error('Failed to set active scorer', e);
  }
}

// Save official state to localStorage and trigger CustomEvent
export function saveOfficialMatchState(newState, skipHistory = false) {
  try {
    if (!skipHistory) {
      const current = getStoredMatchState();
      pushMatchHistory(current);
    }
    const updated = {
      ...newState,
      isVerified: true,
      scoreEnteredByDesk: true,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(MATCH_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('kasc_match_state_updated', { detail: updated }));
    return updated;
  } catch (err) {
    console.error('Failed to save match state', err);
    return newState;
  }
}

// User Rate Limiting Check
export function getUserRateLimitStatus() {
  try {
    const lastTs = parseInt(localStorage.getItem(USER_LAST_REPORT_KEY) || '0', 10);
    const count = parseInt(localStorage.getItem(USER_REPORT_COUNT_KEY) || '0', 10);
    const now = Date.now();

    const elapsedSeconds = Math.floor((now - lastTs) / 1000);
    const remainingSeconds = Math.max(0, COOLDOWN_SECONDS - elapsedSeconds);
    const isCooldownActive = remainingSeconds > 0;
    const isLimitReached = count >= MAX_REPORTS_PER_USER;

    return {
      isCooldownActive,
      remainingSeconds,
      reportsCount: count,
      maxReports: MAX_REPORTS_PER_USER,
      isLimitReached
    };
  } catch (e) {
    return {
      isCooldownActive: false,
      remainingSeconds: 0,
      reportsCount: 0,
      maxReports: MAX_REPORTS_PER_USER,
      isLimitReached: false
    };
  }
}

// Submit a fan crowd goal report with anti-spam check
export function submitFanCrowdGoal(team) {
  const currentState = getStoredMatchState();

  // 1. Check if Admin locked crowd reporting
  if (currentState.isCrowdLocked) {
    return {
      success: false,
      error: 'LOCKED',
      message: 'Crowd reporting is temporarily locked by the Match Referee Desk.'
    };
  }

  // 2. Check if Match is already Full Time
  if (currentState.status === 'FULL_TIME') {
    return {
      success: false,
      error: 'FULL_TIME',
      message: 'Match is completed. Final score is locked by the Committee.'
    };
  }

  // 3. Rate Limit & Limit check
  const rateLimit = getUserRateLimitStatus();
  if (rateLimit.isLimitReached) {
    return {
      success: false,
      error: 'LIMIT_REACHED',
      message: `You have reached the maximum ${MAX_REPORTS_PER_USER} goal reports for this match.`
    };
  }

  if (rateLimit.isCooldownActive) {
    return {
      success: false,
      error: 'COOLDOWN',
      remainingSeconds: rateLimit.remainingSeconds,
      message: `Anti-Spam Active: Please wait ${rateLimit.remainingSeconds}s before submitting another goal report.`
    };
  }

  // 4. Record new submission & update timestamps
  const newCount = rateLimit.reportsCount + 1;
  localStorage.setItem(USER_LAST_REPORT_KEY, Date.now().toString());
  localStorage.setItem(USER_REPORT_COUNT_KEY, newCount.toString());

  // Increment crowd reports
  const updatedCrowd = {
    ...currentState.crowdReports,
    home: team === 'home' ? currentState.crowdReports.home + 1 : currentState.crowdReports.home,
    away: team === 'away' ? currentState.crowdReports.away + 1 : currentState.crowdReports.away,
    total: currentState.crowdReports.total + 1
  };

  const updatedState = {
    ...currentState,
    crowdReports: updatedCrowd
  };

  localStorage.setItem(MATCH_STORAGE_KEY, JSON.stringify(updatedState));
  window.dispatchEvent(new CustomEvent('kasc_match_state_updated', { detail: updatedState }));

  return {
    success: true,
    cooldownSeconds: COOLDOWN_SECONDS,
    reportsCount: newCount,
    maxReports: MAX_REPORTS_PER_USER,
    message: `Thank you! Your goal report for ${team === 'home' ? 'UDAYA' : 'NEW MALAYA'} was registered.`
  };
}

// Admin Authentication check
export function isAdminAuthenticated() {
  return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
}

export function setAdminAuthenticated(auth) {
  if (auth) {
    localStorage.setItem(ADMIN_AUTH_KEY, 'true');
  } else {
    localStorage.removeItem(ADMIN_AUTH_KEY);
    localStorage.removeItem(SCORER_ROLE_KEY);
  }
}
