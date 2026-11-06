// Official 7-A-Side Lineup & Tactics Governance Manager
// Manages formations, tactical roles, starting/substitute swaps, and Man of the Match awards

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
      { num: 1, name: 'Jithin', pos: 'GK', captain: false, isGK: true, baseRating: 7.2 },
      { num: 4, name: 'Midhun', pos: 'CB', captain: false, baseRating: 7.1 },
      { num: 3, name: 'Rahul K.', pos: 'RB', captain: false, baseRating: 7.0 },
      { num: 7, name: 'Favas', pos: 'CM', captain: false, baseRating: 7.4 },
      { num: 8, name: 'Vysakh', pos: 'AM', captain: false, baseRating: 7.5 },
      { num: 11, name: 'Arjun', pos: 'WF', captain: false, baseRating: 7.6 },
      { num: 10, name: 'Abdul Vahid C', pos: 'ST', captain: true, photoUrl: '/players/abdul_vahid.webp', baseRating: 8.3 }
    ],
    subs: [
      { num: 14, name: 'Abhijith', pos: 'SUB', baseRating: 6.8 },
      { num: 15, name: 'Sarath', pos: 'SUB', baseRating: 6.7 },
      { num: 18, name: 'Nithin', pos: 'SUB', baseRating: 6.7 }
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
      { num: 1, name: 'Aneesh', pos: 'GK', captain: false, isGK: true, baseRating: 7.3 },
      { num: 4, name: 'Muhammed Sajad', pos: 'CB', captain: false, photoUrl: '/players/muhammed_sajad.webp', baseRating: 7.4 },
      { num: 5, name: 'Musthafa', pos: 'SW', captain: false, baseRating: 7.2 },
      { num: 11, name: 'Ajmal', pos: 'CM', captain: false, baseRating: 7.5 },
      { num: 7, name: 'Aju Ashi', pos: 'WF', captain: false, photoUrl: '/players/aju_ashi.webp', baseRating: 7.8 },
      { num: 9, name: 'Fahad', pos: 'ST', captain: false, photoUrl: '/players/fahad.webp', baseRating: 7.7 },
      { num: 10, name: 'Ashik Usman', pos: 'CF', captain: true, photoUrl: '/players/ashik_usman.webp', baseRating: 8.8 }
    ],
    subs: [
      { num: 3, name: 'Ameer', pos: 'SUB', photoUrl: '/players/ameer.webp', baseRating: 7.3 },
      { num: 22, name: 'Suhair', pos: 'SUB', baseRating: 6.9 },
      { num: 6, name: 'Jameel', pos: 'SUB', baseRating: 6.8 },
      { num: 8, name: 'Nabeel', pos: 'SUB', baseRating: 6.7 },
      { num: 14, name: 'Nizar', pos: 'SUB', baseRating: 6.6 },
      { num: 17, name: 'Ajmal Jr', pos: 'SUB', baseRating: 6.8 }
    ]
  }
};

const STORAGE_KEY = 'kasc_lineup_tactics_v1';

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

    // Enrich starting players with photoUrl
    team.starting = (team.starting || defaultTeam.starting).map((p) => {
      const match = defaultByNum.get(p.num) || defaultByName.get(p.name?.toLowerCase().trim());
      if (match?.photoUrl && (!p.photoUrl || p.photoUrl !== match.photoUrl)) {
        return { ...p, photoUrl: match.photoUrl };
      }
      return p;
    });

    // Check subs: enrich existing subs and ensure all default subs exist
    const startingNums = new Set(team.starting.map((p) => p.num));
    const startingNames = new Set(team.starting.map((p) => p.name?.toLowerCase().trim()));
    const subs = [...(team.subs || [])].map((s) => {
      const match = defaultByNum.get(s.num) || defaultByName.get(s.name?.toLowerCase().trim());
      if (match?.photoUrl && (!s.photoUrl || s.photoUrl !== match.photoUrl)) {
        return { ...s, photoUrl: match.photoUrl };
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
  } catch (e) {
    console.error('Error saving lineup tactics:', e);
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

export function resetLineupTactics() {
  const resetData = {
    formations: { home: '2-2-2', away: '2-2-2' },
    squads: DEFAULT_TOURNAMENT_SQUADS,
    manOfTheMatch: null
  };
  saveLineupTactics(resetData);
  return resetData;
}
