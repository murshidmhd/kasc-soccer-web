/**
 * Firebase Realtime Database Sync
 * Cross-device real-time sync for KASC Sevens live match state & lineup.
 * Admin writes → Firebase RTDB → all fans get instant push updates.
 *
 * Setup: Create a free Firebase project at https://console.firebase.google.com
 * and add your config to .env.local (see .env.example)
 */

import { initializeApp, getApps } from 'firebase/app';
import { getDatabase, ref, set, onValue, off, serverTimestamp } from 'firebase/database';

// ─── Firebase Config (Direct + Vite env var fallback) ───────────────────────
const viteEnv = import.meta.env || {};
const firebaseConfig = {
  apiKey:            viteEnv.VITE_FIREBASE_API_KEY || "AIzaSyB49JnjdYjXOSqdogZ7bgwCwjI39yFcA4M",
  authDomain:        viteEnv.VITE_FIREBASE_AUTH_DOMAIN || "udaya-79877.firebaseapp.com",
  databaseURL:       viteEnv.VITE_FIREBASE_DATABASE_URL || "https://udaya-79877-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId:         viteEnv.VITE_FIREBASE_PROJECT_ID || "udaya-79877",
  storageBucket:     viteEnv.VITE_FIREBASE_STORAGE_BUCKET || "udaya-79877.firebasestorage.app",
  messagingSenderId: viteEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || "449334363982",
  appId:             viteEnv.VITE_FIREBASE_APP_ID || "1:449334363982:web:0e3541838132b07364c01f",
  measurementId:     viteEnv.VITE_FIREBASE_MEASUREMENT_ID || "G-ZM59962VJJ"
};

// ─── Singleton App & DB ───────────────────────────────────────────────────────
let app = null;
let db  = null;

function isFirebaseConfigured() {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.databaseURL &&
    firebaseConfig.projectId
  );
}

function getDb() {
  if (!isFirebaseConfigured()) return null;
  if (db) return db;
  try {
    app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    db  = getDatabase(app);
    return db;
  } catch (err) {
    console.warn('[KASC Firebase] Init failed:', err.message);
    return null;
  }
}

// ─── RTDB Paths ───────────────────────────────────────────────────────────────
const MATCH_PATH  = 'kasc_sevens_s7/match/state';
const LINEUP_PATH = 'kasc_sevens_s7/lineup/tactics';

// ─── WRITE ────────────────────────────────────────────────────────────────────

/**
 * Push official match state to Firebase RTDB.
 * Called by admin desk after every score / status change.
 */
export async function pushMatchStateToFirebase(matchState) {
  const database = getDb();
  if (!database) return { success: false, reason: 'not_configured' };
  try {
    const sanitized = sanitizeForFirebase(matchState);
    await set(ref(database, MATCH_PATH), {
      ...sanitized,
      _serverTs: serverTimestamp(),
    });
    return { success: true };
  } catch (err) {
    console.warn('[KASC Firebase] pushMatchState failed:', err.message);
    return { success: false, reason: err.message };
  }
}

/**
 * Push lineup/tactics to Firebase RTDB.
 * Called by admin desk after formation or MOTM changes.
 */
export async function pushLineupToFirebase(lineupTactics) {
  const database = getDb();
  if (!database) return { success: false, reason: 'not_configured' };
  try {
    const sanitized = sanitizeForFirebase(lineupTactics);
    await set(ref(database, LINEUP_PATH), {
      ...sanitized,
      _serverTs: serverTimestamp(),
    });
    return { success: true };
  } catch (err) {
    console.warn('[KASC Firebase] pushLineup failed:', err.message);
    return { success: false, reason: err.message };
  }
}

// ─── SUBSCRIBE ────────────────────────────────────────────────────────────────

/**
 * Subscribe to real-time match state updates from Firebase.
 * Fan browsers call this once on mount — Firebase pushes changes instantly.
 * Returns an unsubscribe function.
 */
export function subscribeToMatchState(callback) {
  const database = getDb();
  if (!database) return () => {};

  const matchRef = ref(database, MATCH_PATH);

  const handler = onValue(matchRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      // Strip internal Firebase fields before passing to app
      const { _serverTs, ...cleanState } = data;
      callback(cleanState);
    }
  }, (err) => {
    console.warn('[KASC Firebase] subscribeToMatchState error:', err.message);
  });

  // Return cleanup function
  return () => off(matchRef, 'value', handler);
}

/**
 * Subscribe to real-time lineup/tactics updates from Firebase.
 * Returns an unsubscribe function.
 */
export function subscribeToLineup(callback) {
  const database = getDb();
  if (!database) return () => {};

  const lineupRef = ref(database, LINEUP_PATH);

  const handler = onValue(lineupRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const { _serverTs, ...cleanData } = data;
      callback(cleanData);
    }
  }, (err) => {
    console.warn('[KASC Firebase] subscribeToLineup error:', err.message);
  });

  return () => off(lineupRef, 'value', handler);
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

/**
 * Firebase RTDB cannot store undefined values or arrays with holes.
 * This cleans the state object recursively.
 */
function sanitizeForFirebase(obj) {
  if (obj === null || obj === undefined) return null;
  if (Array.isArray(obj)) return obj.map(sanitizeForFirebase).filter(v => v !== undefined);
  if (typeof obj === 'object') {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        result[key] = sanitizeForFirebase(value);
      }
    }
    return result;
  }
  return obj;
}

/**
 * Returns true if Firebase is properly configured via env vars.
 * Used to show/hide sync status badge in admin desk.
 */
export function isFirebaseSyncEnabled() {
  return isFirebaseConfigured();
}
