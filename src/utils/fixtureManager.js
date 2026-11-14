import { fixtures as initialFixtures } from '../data/tournamentData.js';
import { pushFixturesToFirebase } from './firebaseSync.js';

const FIXTURES_STORAGE_KEY = 'kasc_tournament_fixtures_v2';

export const SEEDED_PRE_QUARTER_TEAMS = [
  "SUPER STUDIO MALAPPURAM",
  "AL MADEENA CHERPULASSERI",
  "UDAYA PARAMBIL PEEDIKA"
];

export const INITIAL_QUARTERS = [
  {
    id: "qf1",
    day: "Quarter Final 1",
    date: "20 Nov 2026",
    time: "08:45 PM",
    stage: "Quarter Final 1",
    matchNum: "QF 1",
    source1MatchId: "m1",
    source2MatchId: "m2",
    team1Slot: "Winner Match 1",
    team2Slot: "Winner Match 2",
    team1: null,
    team2: null,
    status: "Upcoming",
    score1: null,
    score2: null,
    confirmed: true,
    stadium: "Peruvallur Panjayath Stadium"
  },
  {
    id: "qf2",
    day: "Quarter Final 2",
    date: "22 Nov 2026",
    time: "08:45 PM",
    stage: "Quarter Final 2",
    matchNum: "QF 2",
    source1MatchId: "m3",
    source2MatchId: "m4",
    team1Slot: "Winner Match 3",
    team2Slot: "Winner Match 4",
    team1: null,
    team2: null,
    status: "Upcoming",
    score1: null,
    score2: null,
    confirmed: true,
    stadium: "Peruvallur Panjayath Stadium"
  },
  {
    id: "qf3",
    day: "Quarter Final 3",
    date: "24 Nov 2026",
    time: "08:45 PM",
    stage: "Quarter Final 3",
    matchNum: "QF 3",
    source1MatchId: "m5",
    source2MatchId: "m6",
    team1Slot: "Winner Match 5",
    team2Slot: "Winner Match 6",
    team1: null,
    team2: null,
    status: "Upcoming",
    score1: null,
    score2: null,
    confirmed: true,
    stadium: "Peruvallur Panjayath Stadium"
  },
  {
    id: "qf4",
    day: "Quarter Final 4",
    date: "26 Nov 2026",
    time: "08:45 PM",
    stage: "Quarter Final 4",
    matchNum: "QF 4",
    source1MatchId: "m7",
    source2MatchId: "m8",
    team1Slot: "Winner Match 7",
    team2Slot: "Winner Match 8",
    team1: null,
    team2: null,
    status: "Upcoming",
    score1: null,
    score2: null,
    confirmed: true,
    stadium: "Peruvallur Panjayath Stadium"
  }
];

/**
 * Automatically advance winners of completed Round 1 matches into Quarter Finals
 */
export function resolveQuarterFinals(round1Matches = []) {
  const matchMap = new Map();
  round1Matches.forEach((m) => {
    matchMap.set(m.id, m);
  });

  return INITIAL_QUARTERS.map((qf) => {
    const m1 = matchMap.get(qf.source1MatchId);
    const m2 = matchMap.get(qf.source2MatchId);

    // Compute or read winner for source 1
    let winner1 = m1?.winner;
    if (!winner1 && m1?.status === 'Completed' && Number.isFinite(m1?.score1) && Number.isFinite(m1?.score2)) {
      if (m1.score1 > m1.score2) winner1 = m1.team1;
      else if (m1.score2 > m1.score1) winner1 = m1.team2;
    }

    // Compute or read winner for source 2
    let winner2 = m2?.winner;
    if (!winner2 && m2?.status === 'Completed' && Number.isFinite(m2?.score1) && Number.isFinite(m2?.score2)) {
      if (m2.score1 > m2.score2) winner2 = m2.team1;
      else if (m2.score2 > m2.score1) winner2 = m2.team2;
    }

    return {
      ...qf,
      team1: winner1 || qf.team1Slot,
      team2: winner2 || qf.team2Slot,
      team1Decided: Boolean(winner1),
      team2Decided: Boolean(winner2)
    };
  });
}

/**
 * Retrieve current stored fixtures (Round 1 + Quarters) with localStorage caching
 */
export function getStoredFixtures() {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(FIXTURES_STORAGE_KEY) : null;
    let list = initialFixtures;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Merge with initialFixtures so new fields/posters are preserved
        list = initialFixtures.map((base) => {
          const override = parsed.find((p) => p.id === base.id);
          return override ? { ...base, ...override } : base;
        });
      }
    }
    return list;
  } catch (err) {
    console.error('Failed to get stored fixtures:', err);
    return initialFixtures;
  }
}

/**
 * Save updated fixtures to localStorage, dispatch update event, and push to Firebase RTDB
 */
export function saveStoredFixtures(fixturesList) {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(FIXTURES_STORAGE_KEY, JSON.stringify(fixturesList));
      window.dispatchEvent(new CustomEvent('kasc_fixtures_updated', { detail: fixturesList }));
    }

    // Push to Firebase RTDB database
    pushFixturesToFirebase(fixturesList).catch((err) => {
      console.warn('[Firebase Sync] Push fixtures deferred:', err);
    });

    return true;
  } catch (err) {
    console.error('Failed to save fixtures:', err);
    return false;
  }
}

/**
 * Update a fixture score, status, and winner when admin logs updates
 */
export function updateFixtureScoreAndStatus(fixtureId, score1, score2, status = 'Completed', winnerPosterUrl = null) {
  const currentFixtures = getStoredFixtures();
  const updated = currentFixtures.map((f) => {
    if (f.id !== fixtureId) return f;

    const s1 = typeof score1 === 'number' ? score1 : f.score1;
    const s2 = typeof score2 === 'number' ? score2 : f.score2;
    let winner = f.winner;
    if (status === 'Completed' || status === 'FULL_TIME') {
      if (s1 > s2) winner = f.team1;
      else if (s2 > s1) winner = f.team2;
    }

    return {
      ...f,
      score1: s1,
      score2: s2,
      status: status === 'FULL_TIME' ? 'Completed' : status,
      confirmed: true,
      winner: winner || f.winner,
      ...(winnerPosterUrl ? { winnerPosterUrl } : {})
    };
  });

  saveStoredFixtures(updated);
  return updated;
}

/**
 * Apply remote fixtures received from Firebase database
 */
export function applyRemoteFixtures(remoteFixtures) {
  if (!Array.isArray(remoteFixtures)) return;
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(FIXTURES_STORAGE_KEY, JSON.stringify(remoteFixtures));
      window.dispatchEvent(new CustomEvent('kasc_fixtures_updated', { detail: remoteFixtures }));
    }
  } catch (err) {
    console.error('Failed to apply remote fixtures:', err);
  }
}
