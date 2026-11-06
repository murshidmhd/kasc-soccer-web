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
      { num: 1, name: 'Jithin', pos: 'GK', captain: false, isGK: true, baseRating: 0.0 },
      { num: 4, name: 'Midhun', pos: 'CB', captain: false, baseRating: 0.0 },
      { num: 3, name: 'Rahul K.', pos: 'RB', captain: false, baseRating: 0.0 },
      { num: 7, name: 'None', pos: 'CM', captain: false, photoUrl: '/players/krsc_mid_1.jpg', baseRating: 0.0 },
      { num: 99, name: 'None', pos: 'CM', captain: false, photoUrl: '/players/krsc_mid_2.jpg', baseRating: 0.0 },
      { num: 11, name: 'Arjun Jayaraj', displayName: 'Arjun Jayaraj', fullName: 'Arjun Jayaraj', pos: 'CF', captain: false, photoUrl: '/players/arjun_jayaraj.webp', baseRating: 0.0 },
      { num: 10, name: 'Abdul Vahid C', displayName: 'Vahid C', pos: 'ST', captain: true, photoUrl: '/players/abdul_vahid.webp', baseRating: 0.0 }
    ],
    subs: [
      { num: 14, name: 'Abhijith', pos: 'SUB', baseRating: 0.0 },
      { num: 8, name: 'Vysakh', pos: 'SUB', baseRating: 0.0 },
      { num: 15, name: 'Sarath', pos: 'SUB', baseRating: 0.0 },
      { num: 18, name: 'Nithin', pos: 'SUB', baseRating: 0.0 },
      { num: 0, name: 'None', pos: 'CF', baseRating: 0.0 }
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
      { num: 1, name: 'Aneesh', pos: 'GK', captain: false, isGK: true, baseRating: 0.0 },
      { num: 4, name: 'Sajad', fullName: 'Muhammed Sajad', displayName: 'Sajad', pos: 'CB', captain: false, photoUrl: '/players/muhammed_sajad.webp', baseRating: 0.0 },
      { num: 5, name: 'Musthafa', pos: 'SW', captain: false, baseRating: 0.0 },
      { num: 11, name: 'Ajmal', pos: 'CM', captain: false, baseRating: 0.0 },
      { num: 7, name: 'Aju Ashi', pos: 'WF', captain: false, photoUrl: '/players/aju_ashi.webp', baseRating: 0.0 },
      { num: 9, name: 'Fahad', pos: 'ST', captain: false, photoUrl: '/players/fahad.webp', baseRating: 0.0 },
      { num: 10, name: 'Ashik Usman', pos: 'CF', captain: true, photoUrl: '/players/ashik_usman.webp', baseRating: 0.0 }
    ],
    subs: [
      { num: 3, name: 'Ameer', pos: 'SUB', photoUrl: '/players/ameer.webp', baseRating: 0.0 },
      { num: 22, name: 'Suhair', pos: 'SUB', baseRating: 0.0 },
      { num: 6, name: 'Jameel', pos: 'SUB', baseRating: 0.0 },
      { num: 8, name: 'Nabeel', pos: 'SUB', baseRating: 0.0 },
      { num: 14, name: 'Nizar', pos: 'SUB', baseRating: 0.0 },
      { num: 17, name: 'Ajmal Jr', pos: 'SUB', baseRating: 0.0 }
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

    // Enrich starting players with photoUrl, name, displayName, fullName, and pos
    team.starting = (team.starting || defaultTeam.starting).map((p) => {
      const match = defaultByNum.get(p.num) || defaultByName.get(p.name?.toLowerCase().trim());
      if (match) {
        return {
          ...p,
          name: match.name || p.name,
          displayName: match.displayName || p.displayName,
          fullName: match.fullName || p.fullName,
          pos: match.pos || p.pos,
          photoUrl: match.photoUrl || p.photoUrl
        };
      }
      return p;
    });

    // Move the new KRSC midfielder into the starting seven for existing saved lineups.
    if (teamKey === 'krsc' && !team.starting.some((p) => p.num === 99)) {
      const replacementIndex = team.starting.findIndex((p) => p.num === 8 || p.name?.toLowerCase().trim() === 'vysakh');
      const newMidfielder = defaultTeam.starting.find((p) => p.num === 99);
      if (replacementIndex !== -1 && newMidfielder) {
        const displacedMidfielder = team.starting[replacementIndex];
        team.starting[replacementIndex] = newMidfielder;
        team.subs = [...(team.subs || []), { ...displacedMidfielder, pos: 'SUB' }];
      }
    }

    // Check subs: enrich existing subs and ensure all default subs exist
    const startingNums = new Set(team.starting.map((p) => p.num));
    const startingNames = new Set(team.starting.map((p) => p.name?.toLowerCase().trim()));
    const subs = [...(team.subs || [])].map((s) => {
      const match = defaultByNum.get(s.num) || defaultByName.get(s.name?.toLowerCase().trim());
      if (match) {
        return {
          ...s,
          name: match.name || s.name,
          displayName: match.displayName || s.displayName,
          fullName: match.fullName || s.fullName,
          photoUrl: match.photoUrl || s.photoUrl
        };
      }
      return s;
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

export function updatePlayerPosition(teamKey, playerNum, newPosition) {
  const current = getLineupTactics();
  const squad = current.squads[teamKey];
  if (!squad) return current;

  const isGK = newPosition === 'GK';

  const updatedStarting = squad.starting.map((p) => {
    if (p.num === playerNum) {
      return { ...p, pos: newPosition, isGK };
    }
    return p;
  });

  const updatedSubs = (squad.subs || []).map((p) => {
    if (p.num === playerNum) {
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
        subs: updatedSubs
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

export function updatePlayerRating(teamKey, playerNum, rating) {
  const current = getLineupTactics();
  const squad = current.squads[teamKey];
  if (!squad) return current;

  const numVal = Number(playerNum);
  const ratingVal = Math.min(10.0, Math.max(0.0, Number(rating) || 0.0));

  const updatedStarting = (squad.starting || []).map((p) => 
    p.num === numVal ? { ...p, baseRating: ratingVal, adminModifiedRating: true } : p
  );
  const updatedSubs = (squad.subs || []).map((s) => 
    s.num === numVal ? { ...s, baseRating: ratingVal, adminModifiedRating: true } : s
  );

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
