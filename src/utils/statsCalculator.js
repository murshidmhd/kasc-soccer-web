/**
 * KASC Sevens Tournament Statistics Calculator
 * Akhilenthya Sevens Season 7 (Peruvallur Panjayath Stadium)
 *
 * Rules:
 * - Stats are derived strictly from logged match events (no manual fake stats)
 * - Goals exclude own goals and penalty shootouts
 * - Top Scorer Tie-breakers:
 *     1. More goals
 *     2. Fewer matches played
 *     3. Earlier first goal minute
 *   Ties receive equal rank.
 * - Clean sheets computed only for starting goalkeepers of finished matches.
 * - Fair Play: sorted by fewest red cards, then fewest yellow cards.
 */

// Starting Goalkeepers map for clean sheet tracking
export const STARTING_GOALKEEPERS = {
  'UDAYA PARAMBIL PEEDIKA': 'Shamseer',
  'NEW MALAYA MALABAR FC': 'Aneesh',
  'SUPER STUDIO MALAPPURAM': 'Mujeeb',
  'AYC UCHARAKADAVU': 'Rashid',
  'FIFA MANJERI': 'Muneer',
  'LINSHA TIRUR': 'Fawas',
  'SABAN FC KOTTAKKAL': 'Niyas'
};

export function calculateTournamentStats(events = [], fixtures = [], activeMatchState = null) {
  // Aggregate real events
  const allEvents = [...events];
  if (activeMatchState?.events) {
    activeMatchState.events.forEach((evt) => {
      if (!allEvents.some((e) => e.id === evt.id)) {
        allEvents.push(evt);
      }
    });
  }

  // Finished matches list
  const finishedMatches = fixtures.filter(
    (m) => m.status === 'Finished' || m.status === 'FULL_TIME'
  );

  // If live match state is Full Time and not yet represented in fixtures, include it
  if (
    activeMatchState &&
    (activeMatchState.status === 'FULL_TIME' || activeMatchState.status === 'FINISHED')
  ) {
    const isAlreadyIn = finishedMatches.some(
      (m) => m.id === 'm1' || m.id === activeMatchState.id
    );
    if (!isAlreadyIn) {
      finishedMatches.push({
        id: activeMatchState.id || 'm1',
        team1: 'UDAYA PARAMBIL PEEDIKA',
        team2: 'NEW MALAYA MALABAR FC',
        score1: activeMatchState.officialScoreHome,
        score2: activeMatchState.officialScoreAway,
        status: 'Finished',
        playerOfTheMatch: activeMatchState.playerOfTheMatch || null
      });
    }
  }

  // Calculate matches played per club
  const clubMatchesPlayed = {};
  finishedMatches.forEach((m) => {
    clubMatchesPlayed[m.team1] = (clubMatchesPlayed[m.team1] || 0) + 1;
    clubMatchesPlayed[m.team2] = (clubMatchesPlayed[m.team2] || 0) + 1;
  });

  // Include live match teams in matches played count
  if (
    activeMatchState &&
    activeMatchState.status !== 'UPCOMING' &&
    activeMatchState.status !== 'FULL_TIME'
  ) {
    clubMatchesPlayed['UDAYA PARAMBIL PEEDIKA'] = (clubMatchesPlayed['UDAYA PARAMBIL PEEDIKA'] || 0) + 1;
    clubMatchesPlayed['NEW MALAYA MALABAR FC'] = (clubMatchesPlayed['NEW MALAYA MALABAR FC'] || 0) + 1;
  }

  // 1. Regular goals only (excluding own goals and penalty shootout goals)
  const validGoalEvents = allEvents.filter(
    (e) =>
      e.type === 'goal' &&
      !e.isOwnGoal &&
      e.type !== 'own_goal' &&
      !e.isShootout &&
      e.type !== 'shootout_goal'
  );

  const playerGoalMap = {};
  validGoalEvents.forEach((evt) => {
    const playerName = (evt.player || 'Unknown Player').trim();
    if (!playerGoalMap[playerName]) {
      const fallbackTeam = evt.team === 'away' ? 'NEW MALAYA MALABAR FC' : 'UDAYA PARAMBIL PEEDIKA';
      const teamName = evt.teamName || fallbackTeam;
      playerGoalMap[playerName] = {
        name: playerName,
        team: teamName,
        goals: 0,
        matchesPlayed: clubMatchesPlayed[teamName] || 1,
        firstGoalMinute: evt.minute || 90,
        firstGoalTimestamp: evt.timestamp || 0
      };
    }
    playerGoalMap[playerName].goals += 1;
    if (typeof evt.minute === 'number' && evt.minute < playerGoalMap[playerName].firstGoalMinute) {
      playerGoalMap[playerName].firstGoalMinute = evt.minute;
    }
  });

  // Sort Golden Boot race with strict tie-break rules:
  // 1. More goals (descending)
  // 2. Fewer matches played (ascending)
  // 3. Earlier first goal minute (ascending)
  const sortedScorers = Object.values(playerGoalMap).sort((a, b) => {
    if (b.goals !== a.goals) return b.goals - a.goals;
    if (a.matchesPlayed !== b.matchesPlayed) return a.matchesPlayed - b.matchesPlayed;
    return a.firstGoalMinute - b.firstGoalMinute;
  });

  // Assign honest sporting rank with tied ranks
  let currentRank = 1;
  const rankedScorers = sortedScorers.map((scorer, idx, arr) => {
    if (idx > 0) {
      const prev = arr[idx - 1];
      const isTied =
        prev.goals === scorer.goals &&
        prev.matchesPlayed === scorer.matchesPlayed &&
        prev.firstGoalMinute === scorer.firstGoalMinute;
      if (!isTied) {
        currentRank = idx + 1;
      }
    }
    return {
      ...scorer,
      rank: currentRank
    };
  });

  // 2. Cards per club
  const clubCards = {};
  allEvents.forEach((evt) => {
    if (evt.type === 'yellow_card' || evt.type === 'red_card') {
      const fallbackTeam = evt.team === 'away' ? 'NEW MALAYA MALABAR FC' : 'UDAYA PARAMBIL PEEDIKA';
      const club = evt.teamName || fallbackTeam;
      if (!clubCards[club]) {
        clubCards[club] = { club, yellow: 0, red: 0, total: 0 };
      }
      if (evt.type === 'yellow_card') {
        clubCards[club].yellow += 1;
      } else if (evt.type === 'red_card') {
        clubCards[club].red += 1;
      }
      clubCards[club].total += 1;
    }
  });

  // Fair Play: clubs with fewest cards (fewest reds first, then fewest yellows, then fewest total)
  const fairPlayClubs = Object.values(clubCards).sort((a, b) => {
    if (a.red !== b.red) return a.red - b.red;
    if (a.yellow !== b.yellow) return a.yellow - b.yellow;
    return a.total - b.total;
  });

  // 3. Clean sheets per starting goalkeeper
  const keeperCleanSheets = {};
  finishedMatches.forEach((m) => {
    if (typeof m.score1 === 'number' && typeof m.score2 === 'number') {
      // If team2 scored 0, team1's keeper kept clean sheet
      if (m.score2 === 0 && STARTING_GOALKEEPERS[m.team1]) {
        const gk = STARTING_GOALKEEPERS[m.team1];
        keeperCleanSheets[gk] = (keeperCleanSheets[gk] || 0) + 1;
      }
      // If team1 scored 0, team2's keeper kept clean sheet
      if (m.score1 === 0 && STARTING_GOALKEEPERS[m.team2]) {
        const gk = STARTING_GOALKEEPERS[m.team2];
        keeperCleanSheets[gk] = (keeperCleanSheets[gk] || 0) + 1;
      }
    }
  });

  const rankedGoalkeepers = Object.entries(keeperCleanSheets)
    .map(([name, cleanSheets]) => {
      const foundClub = Object.entries(STARTING_GOALKEEPERS).find(([, k]) => k === name);
      return {
        name,
        club: foundClub ? foundClub[0] : '',
        cleanSheets
      };
    })
    .sort((a, b) => b.cleanSheets - a.cleanSheets);

  // 4. Tournament Numbers
  const totalGoals = validGoalEvents.length;
  const matchesCount = finishedMatches.length;
  const avgGoals = matchesCount > 0 ? (totalGoals / matchesCount).toFixed(2) : '0.00';
  const totalCleanSheets = Object.values(keeperCleanSheets).reduce((sum, v) => sum + v, 0);

  // 5. Biggest Win
  let biggestWin = null;
  let maxMargin = 0;
  finishedMatches.forEach((m) => {
    if (typeof m.score1 === 'number' && typeof m.score2 === 'number') {
      const margin = Math.abs(m.score1 - m.score2);
      if (margin > maxMargin) {
        maxMargin = margin;
        biggestWin = {
          winner: m.score1 > m.score2 ? m.team1 : m.team2,
          loser: m.score1 > m.score2 ? m.team2 : m.team1,
          score: `${Math.max(m.score1, m.score2)} - ${Math.min(m.score1, m.score2)}`,
          margin
        };
      }
    }
  });

  return {
    matchesCount,
    totalGoals,
    avgGoals,
    totalCleanSheets,
    biggestWin,
    rankedScorers,
    rankedGoalkeepers,
    fairPlayClubs,
    finishedMatches
  };
}
