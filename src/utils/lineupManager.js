// Official 7-A-Side Lineup & Tactics Governance Manager
// Manages formations, tactical roles, starting/substitute swaps, and Man of the Match awards
import { pushLineupToFirebase } from './firebaseSync.js';

export const SEVENS_FORMATIONS = ['2-2-2', '2-3-1', '3-2-1', '3-1-2', '1-3-2'];

export const TACTICAL_POSITIONS = [
  { code: 'GK', label: 'Goalkeeper (GK)', category: 'GK' },
  { code: 'CB', label: 'Centre Back (CB)', category: 'DEF' },
  { code: 'RB', label: 'Right Back (RB)', category: 'DEF' },
  { code: 'LB', label: 'Left Back (LB)', category: 'DEF' },
  { code: 'SW', label: 'Sweeper (SW)', category: 'DEF' },
  { code: 'CM', label: 'Central Midfielder (CM)', category: 'MID' },
  { code: 'AM', label: 'Attacking Midfielder (AM)', category: 'MID' },
  { code: 'WF', label: 'Wing Forward (WF)', category: 'FWD' },
  { code: 'CF', label: 'Centre Forward (CF)', category: 'FWD' },
  { code: 'ST', label: 'Striker (ST)', category: 'FWD' }
];

export const DEFAULT_TOURNAMENT_SQUADS = {
  krsc: {
    id: 'krsc',
    name: 'KRSC KOZHIKKODE',
    shortName: 'KRSC',
    nameMl: 'കെ.ആർ.എസ്.സി കോഴിക്കോട്',
    shirtColor: '#EAB308', // Gold / Yellow
    status: 'confirmed',
    confirmedAt: '06 Nov 7:00 PM',
    formation: '2-2-2',
    starting: [
      { num: 1, name: 'Jithin', displayName: 'Jithin', fullName: 'Jithin', pos: 'GK', captain: false, isGK: true, baseRating: 7.2 },
      { num: 4, name: 'Muhammad M', displayName: 'Muhammad M', fullName: 'Muhammad M', pos: 'CB', captain: false, baseRating: 7.5 },
      { num: 3, name: 'Shafeel', displayName: 'Shafeel', fullName: 'Shafeel', pos: 'RB', captain: false, baseRating: 7.0 },
      { num: 7, name: 'Akmal K.M', displayName: 'Akmal', fullName: 'Akmal K.M', pos: 'CM', captain: false, photoUrl: '/players/krsc_mid_1.jpg', baseRating: 7.2 },
      { num: 14, name: 'Muhammed Dilshad', displayName: 'Dilshad', fullName: 'Muhammed Dilshad K.M', pos: 'CM', captain: false, photoUrl: '/players/krsc_mid_2.jpg', baseRating: 7.8 },
      { num: 11, name: 'Arjun Jayaraj', displayName: 'Arjun Jayaraj', fullName: 'Arjun Jayaraj', pos: 'CF', captain: false, photoUrl: '/players/arjun_jayaraj.webp', baseRating: 7.6 },
      { num: 10, name: 'Abdul Vahid C', displayName: 'Vahid C', pos: 'ST', captain: true, photoUrl: '/players/abdul_vahid.webp', baseRating: 7.4 }
    ],
    subs: [
      { num: 15, name: 'Matti', displayName: 'Matti', fullName: 'Matti', pos: 'FWD', baseRating: 8.5 },
      { num: 21, name: 'Dinkan', displayName: 'Dinkan (GK)', fullName: 'Dinkan krsc', pos: 'GK', isGK: true, baseRating: 8.0 },
      { num: 8, name: 'Yaseen', displayName: 'Yaseen', fullName: 'Yaseen', pos: 'MID', baseRating: 7.0 },
      { num: 5, name: 'Akhil P', displayName: 'Akhil', fullName: 'Akhil P', pos: 'DEF', baseRating: 7.0 },
      { num: 6, name: 'Ajmal Fayis P', displayName: 'Ajmal Fayis', fullName: 'Ajmal Fayis P', pos: 'MID', baseRating: 7.0 },
      { num: 2, name: 'Abinav A', displayName: 'Abinav', fullName: 'Abinav A', pos: 'DEF', baseRating: 6.8 },
      { num: 17, name: 'Richu', displayName: 'Richu', fullName: 'Richu', pos: 'FWD', baseRating: 7.0 }
    ]
  },
  base: {
    id: 'base',
    name: 'BASE PERUMBAVUR',
    shortName: 'BASE',
    nameMl: 'ബേസ് പെരുമ്പാവൂർ',
    shirtColor: '#1E3A8A', // Deep Blue
    status: 'confirmed',
    confirmedAt: '06 Nov 7:00 PM',
    formation: '2-2-2',
    starting: [
      { num: 1, name: 'Aneesh', displayName: 'Aneesh', fullName: 'Aneesh', pos: 'GK', captain: false, isGK: true, baseRating: 7.0 },
      { num: 4, name: 'Muhammed Sajad A', fullName: 'Muhammed Sajad A', displayName: 'Sajad', pos: 'CB', captain: false, photoUrl: '/players/muhammed_sajad.webp', baseRating: 7.0 },
      { num: 5, name: 'Musthafa', displayName: 'Musthafa', fullName: 'Musthafa', pos: 'SW', captain: false, baseRating: 6.8 },
      { num: 11, name: 'Ajmal', displayName: 'Ajmal', fullName: 'Ajmal', pos: 'CM', captain: false, baseRating: 7.0 },
      { num: 7, name: 'Aju Ashi', displayName: 'Aju Ashi', fullName: 'Aju Ashi', pos: 'WF', captain: false, photoUrl: '/players/aju_ashi.webp', baseRating: 7.2 },
      { num: 9, name: 'Fahad M.M', displayName: 'Fahad', fullName: 'Fahad M.M', pos: 'ST', captain: false, photoUrl: '/players/fahad.webp', baseRating: 7.1 },
      { num: 10, name: 'Ashik Usman', displayName: 'Ashik Usman', fullName: 'Ashik Usman', pos: 'CF', captain: true, photoUrl: '/players/ashik_usman.webp', baseRating: 7.3 }
    ],
    subs: [
      { num: 3, name: 'Ajay Alex', displayName: 'Ajay Alex', fullName: 'Ajay Alex', pos: 'DEF', photoUrl: '/players/ameer.webp', baseRating: 6.9 },
      { num: 2, name: 'Pratheesh V.V', displayName: 'Pratheesh', fullName: 'Pratheesh V.V', pos: 'DEF', baseRating: 6.8 },
      { num: 6, name: 'Sarath C.S', displayName: 'Sarath', fullName: 'Sarath C.S', pos: 'MID', baseRating: 6.8 },
      { num: 8, name: 'Vaishakh Mohanan', displayName: 'Vaishakh', fullName: 'Vaishakh Mohanan', pos: 'MID', baseRating: 6.9 },
      { num: 12, name: 'Thierry Jr', displayName: 'Thierry Jr', fullName: 'Thierry Jr', pos: 'FWD', baseRating: 7.0 },
      { num: 14, name: 'Hassane', displayName: 'Hassane', fullName: 'Hassane', pos: 'FWD', baseRating: 7.0 },
      { num: 15, name: 'Maji', displayName: 'Maji', fullName: 'Maji', pos: 'MID', baseRating: 6.8 },
      { num: 18, name: 'Anychie', displayName: 'Anychie', fullName: 'Anychie', pos: 'FWD', baseRating: 7.0 }
    ]
  }
};

const STORAGE_KEY = 'kasc_lineup_tactics_v2';

function mergeSquadsWithDefaults(storedSquads) {
  if (!storedSquads) return DEFAULT_TOURNAMENT_SQUADS;
  const merged = { ...storedSquads };
  for (const teamKey of ['krsc', 'base']) {
    const defaultTeam = DEFAULT_TOURNAMENT_SQUADS[teamKey];
    if (!merged[teamKey]) {
      merged[teamKey] = defaultTeam;
      continue;
    }
    const team = { ...merged[teamKey] };
    const allDefaults = [...(defaultTeam.starting || []), ...(defaultTeam.subs || [])];
    const defaultByNum = new Map(allDefaults.map((p) => [p.num, p]));
    const defaultByName = new Map(allDefaults.map((p) => [p.name?.toLowerCase().trim(), p]));

    const mergePlayerWithDefault = (player, match) => {
      const isPlaceholder = !player.name || ['none', 'null', 'undefined', 'unknown', ''].includes(String(player.name).toLowerCase().trim());
      const name = isPlaceholder ? (match?.name || 'Player') : player.name;
      const displayName = isPlaceholder ? (match?.displayName || name) : (player.displayName || name);
      const fullName = isPlaceholder ? (match?.fullName || name) : (player.fullName || name);

      return {
        ...player,
        name,
        displayName,
        fullName,
        pos: player.pos || match?.pos || 'SUB',
        photoUrl: player.photoUrl || match?.photoUrl,
        baseRating: (Number(player.baseRating) > 0 && !isPlaceholder) ? Number(player.baseRating) : (match?.baseRating || 7.0)
      };
    };

    // Enrich starting players
    team.starting = (team.starting || defaultTeam.starting)
      .filter((p) => p && !['none', 'null'].includes(String(p.name).toLowerCase().trim()) || defaultByNum.has(p.num))
      .map((p) => {
        const match = defaultByNum.get(p.num) || defaultByName.get(p.name?.toLowerCase().trim());
        return mergePlayerWithDefault(p, match);
      });

    // Check subs: enrich existing subs and ensure all default subs exist
    const startingNums = new Set(team.starting.map((p) => p.num));
    const startingNames = new Set(team.starting.map((p) => p.name?.toLowerCase().trim()));
    const subs = [...(team.subs || [])]
      .filter((s) => s && !['none', 'null'].includes(String(s.name).toLowerCase().trim()) || defaultByNum.has(s.num))
      .map((s) => {
        const match = defaultByNum.get(s.num) || defaultByName.get(s.name?.toLowerCase().trim());
        return mergePlayerWithDefault(s, match);
      });

    const subNums = new Set(subs.map((s) => s.num));
    const subNames = new Set(subs.map((s) => s.name?.toLowerCase().trim()));

    for (const defSub of defaultTeam.subs || []) {
      const inStarting = startingNums.has(defSub.num) || startingNames.has(defSub.name?.toLowerCase().trim());
      const inSubs = subNums.has(defSub.num) || subNames.has(defSub.name?.toLowerCase().trim());
      if (!inStarting && !inSubs) {
        subs.push(defSub);
        subNums.add(defSub.num);
        if (defSub.name) subNames.add(defSub.name.toLowerCase().trim());
      }
    }

    team.subs = subs;
    merged[teamKey] = team;
  }
  return merged;
}

export function getLineupTactics() {
  if (typeof window === 'undefined') {
    return {
      formations: { home: '2-2-2', away: '2-2-2' },
      squads: DEFAULT_TOURNAMENT_SQUADS,
      manOfTheMatch: null
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        formations: { home: '2-2-2', away: '2-2-2' },
        squads: DEFAULT_TOURNAMENT_SQUADS,
        manOfTheMatch: null
      };
    }
    const parsed = JSON.parse(raw);
    return {
      formations: parsed.formations || { home: '2-2-2', away: '2-2-2' },
      squads: mergeSquadsWithDefaults(parsed.squads),
      manOfTheMatch: parsed.manOfTheMatch || null
    };
  } catch (e) {
    console.error('Error reading lineup tactics from storage:', e);
    return {
      formations: { home: '2-2-2', away: '2-2-2' },
      squads: DEFAULT_TOURNAMENT_SQUADS,
      manOfTheMatch: null
    };
  }
}

export function saveLineupTactics(data) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('kasc_lineup_tactics_updated', { detail: data }));

    // Instant cross-tab BroadcastChannel broadcast
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const bc = new BroadcastChannel('kasc_realtime_lineup_sync');
        bc.postMessage({ type: 'LINEUP_TACTICS_UPDATED', payload: data });
        bc.close();
      } catch (e) {
        // BroadcastChannel optional fallback
      }
    }

    // Async push to Firebase Cloud Realtime Database (updates all fans globally)
    pushLineupToFirebase(data).catch((err) => {
      console.warn('[Firebase Sync] Lineup push deferred:', err);
    });
  } catch (e) {
    console.error('Error saving lineup tactics:', e);
  }
}

// Apply remote lineup tactics received from Firebase or BroadcastChannel
export function applyRemoteLineupTactics(remoteData) {
  if (!remoteData || typeof remoteData !== 'object' || typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteData));
    window.dispatchEvent(new CustomEvent('kasc_lineup_tactics_updated', { detail: remoteData }));
  } catch (e) {
    console.error('Error applying remote lineup tactics:', e);
  }
}

// Setup background cross-tab BroadcastChannel listener for lineups
if (typeof window !== 'undefined' && typeof BroadcastChannel !== 'undefined') {
  try {
    const lineupSyncChannel = new BroadcastChannel('kasc_realtime_lineup_sync');
    lineupSyncChannel.onmessage = (event) => {
      if (event?.data?.type === 'LINEUP_TACTICS_UPDATED' && event.data.payload) {
        applyRemoteLineupTactics(event.data.payload);
      }
    };
  } catch (e) {
    // Ignore BroadcastChannel errors
  }
}

export function updateTeamFormation(teamKey, newFormation) {
  const current = getLineupTactics();
  const side = teamKey === 'base' ? 'away' : 'home';
  const updated = {
    ...current,
    formations: {
      ...current.formations,
      [side]: newFormation
    },
    squads: {
      ...current.squads,
      [teamKey]: {
        ...current.squads[teamKey],
        formation: newFormation
      }
    }
  };
  saveLineupTactics(updated);
  return updated;
}

export function updatePlayerPosition(teamKey, playerNum, newPosition, startingIndex = -1) {
  const current = getLineupTactics();
  const squad = current.squads[teamKey];
  if (!squad) return current;

  const isGK = newPosition === 'GK';

  let updatedTarget = false;
  const updatedStarting = squad.starting.map((p, index) => {
    // Admin's starting-player list supplies the row index, so duplicate jersey
    // numbers cannot cause one player's role change to affect another player.
    const isTarget = startingIndex >= 0
      ? index === startingIndex
      : !updatedTarget && p.num === Number(playerNum);
    if (isTarget) {
      updatedTarget = true;
      return { ...p, pos: newPosition, isGK };
    }
    return p;
  });

  const updated = {
    ...current,
    squads: {
      ...current.squads,
      [teamKey]: {
        ...squad,
        starting: updatedStarting,
        subs: squad.subs || []
      }
    }
  };

  saveLineupTactics(updated);
  return updated;
}

export function swapStarterAndSub(teamKey, starterNum, subNum) {
  const current = getLineupTactics();
  const squad = current.squads[teamKey];
  if (!squad) return current;

  const starterIndex = squad.starting.findIndex((p) => p.num === starterNum);
  const subIndex = squad.subs.findIndex((p) => p.num === subNum);

  if (starterIndex === -1 || subIndex === -1) return current;

  const starterPlayer = squad.starting[starterIndex];
  const subPlayer = squad.subs[subIndex];

  const newStarting = [...squad.starting];
  const newSubs = [...squad.subs];

  // Inherit starter's position role or keep existing
  newStarting[starterIndex] = {
    ...subPlayer,
    pos: starterPlayer.pos,
    isGK: starterPlayer.isGK
  };

  newSubs[subIndex] = {
    ...starterPlayer,
    pos: 'SUB',
    isGK: false
  };

  const updated = {
    ...current,
    squads: {
      ...current.squads,
      [teamKey]: {
        ...squad,
        starting: newStarting,
        subs: newSubs
      }
    }
  };

  saveLineupTactics(updated);
  return updated;
}

export function setManOfTheMatchAward(motmData) {
  const current = getLineupTactics();
  const updated = {
    ...current,
    manOfTheMatch: motmData ? {
      ...motmData,
      awardedAt: new Date().toISOString()
    } : null
  };
  saveLineupTactics(updated);
  return updated;
}

export function updatePlayerRating(teamKey, playerNum, rating, startingIndex = -1) {
  const current = getLineupTactics();
  const squad = current.squads[teamKey];
  if (!squad) return current;

  const numVal = Number(playerNum);
  const ratingVal = Math.min(10.0, Math.max(0.0, Number(rating) || 0.0));

  let updatedTarget = false;
  const updatedStarting = (squad.starting || []).map((p, index) => {
    const isTarget = startingIndex >= 0
      ? index === startingIndex
      : !updatedTarget && p.num === numVal;
    if (!isTarget) return p;
    updatedTarget = true;
    return { ...p, baseRating: ratingVal, adminModifiedRating: true };
  });
  const updatedSubs = squad.subs || [];

  const updated = {
    ...current,
    squads: {
      ...current.squads,
      [teamKey]: {
        ...squad,
        starting: updatedStarting,
        subs: updatedSubs
      }
    }
  };

  saveLineupTactics(updated);
  return updated;
}

/**
 * Update full player info (name, number, position, photoUrl, rating, captain, goals, cards)
 * teamKey: 'krsc' | 'base'
 * playerNum: jersey number (old number to find the player)
 * updates: partial player object fields to merge in
 */
export function updatePlayerInfo(teamKey, playerNum, updates, playerIndex = -1, isSub = false) {
  const current = getLineupTactics();
  const squad = current.squads[teamKey];
  if (!squad) return current;

  const numVal = Number(playerNum);

  let updatedTarget = false;
  const applyUpdates = (p, index, listIsSub) => {
    const isTarget = playerIndex >= 0
      ? listIsSub === isSub && index === playerIndex
      : !updatedTarget && p.num === numVal;
    if (!isTarget) return p;
    updatedTarget = true;
    return {
      ...p,
      ...updates,
      ...(updates.name !== undefined ? {
        displayName: updates.name,
        fullName: updates.name,
        adminModifiedName: true
      } : {}),
      // If jersey number changed, update num field too
      num: updates.num !== undefined ? Number(updates.num) : p.num,
      adminModifiedRating: updates.baseRating !== undefined ? true : p.adminModifiedRating
    };
  };

  const updatedStarting = (squad.starting || []).map((p, index) => applyUpdates(p, index, false));
  const updatedSubs = (squad.subs || []).map((p, index) => applyUpdates(p, index, true));

  const updated = {
    ...current,
    squads: {
      ...current.squads,
      [teamKey]: {
        ...squad,
        starting: updatedStarting,
        subs: updatedSubs
      }
    }
  };

  saveLineupTactics(updated);
  return updated;
}

export function resetLineupTactics() {
  const resetData = {
    formations: { home: '2-2-2', away: '2-2-2' },
    squads: DEFAULT_TOURNAMENT_SQUADS,
    manOfTheMatch: null
  };
  saveLineupTactics(resetData);
  return resetData;
}
