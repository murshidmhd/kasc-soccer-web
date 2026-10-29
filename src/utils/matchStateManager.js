// Match State and Anti-Spam Rate Limiter for KASC Sevens

const MATCH_STORAGE_KEY = 'kasc_official_match_state_v2';
const USER_LAST_REPORT_KEY = 'kasc_user_last_report_ts';
const USER_REPORT_COUNT_KEY = 'kasc_user_report_count';
const ADMIN_AUTH_KEY = 'kasc_admin_session_auth';

export const COOLDOWN_SECONDS = 45;
export const MAX_REPORTS_PER_USER = 5;
export const DEFAULT_ADMIN_PIN = '7012'; // Default Committee PIN

export const initialOfficialMatchState = {
  officialScoreHome: 2,
  officialScoreAway: 1,
  matchMinute: 38,
  status: '2ND_HALF', // 'UPCOMING' | '1ST_HALF' | 'HALF_TIME' | '2ND_HALF' | 'FULL_TIME'
  isVerified: true,
  lastUpdated: new Date().toISOString(),
  updatedBy: 'Committee Ground Desk (Official)',
  isCrowdLocked: false,
  crowdReports: {
    home: 18,
    away: 9,
    total: 27
  },
  events: [
    { id: 'evt-1', minute: 12, team: 'home', player: 'Ibrahim Soumahoro', type: 'goal', text: 'Stunning curler into top right corner', isOfficial: true },
    { id: 'evt-2', minute: 24, team: 'away', player: 'Shameer K.', type: 'goal', text: 'Equalizer through penalty rebound', isOfficial: true },
    { id: 'evt-3', minute: 36, team: 'home', player: 'Riyas K. (Captain)', type: 'goal', text: 'Header from close range', isOfficial: true }
  ]
};

// Retrieve stored state or fallback to default
export function getStoredMatchState() {
  try {
    const raw = localStorage.getItem(MATCH_STORAGE_KEY);
    if (!raw) return initialOfficialMatchState;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read match state from localStorage', err);
    return initialOfficialMatchState;
  }
}

// Save official state to localStorage and trigger CustomEvent
export function saveOfficialMatchState(newState) {
  try {
    const updated = {
      ...newState,
      isVerified: true,
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
    message: `Thank you! Your goal report for ${team === 'home' ? 'UDAYA' : 'SABAN FC'} was registered.`
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
  }
}
