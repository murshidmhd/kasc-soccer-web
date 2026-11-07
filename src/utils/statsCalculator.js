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

import { openingMatch, participatingTeams } from '../data/tournamentData';

// Starting Goalkeepers map for clean sheet tracking
export const STARTING_GOALKEEPERS = {
  'KRSC KOZHIKKODE': 'Jithin',
  'BASE PERUMBAVUR': 'Aneesh',
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
    (m) => ['Finished', 'Completed', 'FULL_TIME', 'FINISHED'].includes(m.status)
  ).map((match) => ({ ...match }));

  // If live match state is Full Time and not yet represented in fixtures, include it
  if (
    activeMatchState &&
    (activeMatchState.status === 'FULL_TIME' || activeMatchState.status === 'FINISHED')
  ) {
    const existingMatchIndex = finishedMatches.findIndex(
      (m) => m.id === 'm1' || m.id === activeMatchState.id
    );
    if (existingMatchIndex >= 0) {
      finishedMatches[existingMatchIndex] = {
        ...finishedMatches[existingMatchIndex],
        score1: activeMatchState.officialScoreHome,
        score2: activeMatchState.officialScoreAway,
        status: 'Completed'
      };
    } else {
      finishedMatches.push({
        id: activeMatchState.id || 'm1',
        team1: openingMatch.teamHome.name,
        team2: openingMatch.teamAway.name,
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
    clubMatchesPlayed[openingMatch.teamHome.name] = (clubMatchesPlayed[openingMatch.teamHome.name] || 0) + 1;
    clubMatchesPlayed[openingMatch.teamAway.name] = (clubMatchesPlayed[openingMatch.teamAway.name] || 0) + 1;
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
  validGoalEvents.forEach((evt, eventIndex) => {
    const rawName = (evt.player || '').trim();
    const playerNumber = evt.playerNumber == null ? null : String(evt.playerNumber).trim();
    const isUnknownName = !rawName || ['none', 'unknown', 'unknown player', 'null', 'undefined'].includes(rawName.toLowerCase());
    const fallbackTeam = evt.team === 'away' ? openingMatch.teamAway.name : openingMatch.teamHome.name;
    const teamName = evt.teamName || fallbackTeam;
    const playerName = isUnknownName
      ? `${playerNumber ? `#${playerNumber} ` : ''}None`
      : rawName;
    // Unknown names are identified by club and jersey so different players named
    // "None" never get merged into one scorer entry.
    const playerKey = isUnknownName
      ? `unknown:${teamName}:${playerNumber || evt.id || evt.timestamp || eventIndex}`
      : `${teamName}:${rawName.toLowerCase()}`;
    if (!playerGoalMap[playerKey]) {
      playerGoalMap[playerKey] = {
        name: playerName,
        number: playerNumber,
        team: teamName,
        goals: 0,
        matchesPlayed: clubMatchesPlayed[teamName] || 1,
        firstGoalMinute: evt.minute || 90,
        firstGoalTimestamp: evt.timestamp || 0
      };
    }
    playerGoalMap[playerKey].goals += 1;
    if (typeof evt.minute === 'number' && evt.minute < playerGoalMap[playerKey].firstGoalMinute) {
      playerGoalMap[playerKey].firstGoalMinute = evt.minute;
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
      const fallbackTeam = evt.team === 'away' ? openingMatch.teamAway.name : openingMatch.teamHome.name;
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

  // Tournament table from completed confirmed results only.
  const standingsByTeam = new Map();
  const ensureStanding = (name) => {
    if (!name) return null;
    if (!standingsByTeam.has(name)) {
      standingsByTeam.set(name, {
        team: name, played: 0, wins: 0, draws: 0, losses: 0,
        goalsFor: 0, goalsAgainst: 0, goalDifference: 0, lastResult: null
      });
    }
    return standingsByTeam.get(name);
  };
  participatingTeams.forEach((team) => ensureStanding(team.name));
  finishedMatches.forEach((match) => {
    if (!Number.isFinite(Number(match.score1)) || !Number.isFinite(Number(match.score2))) return;
    const home = ensureStanding(match.team1);
    const away = ensureStanding(match.team2);
    if (!home || !away) return;
    const homeScore = Number(match.score1);
    const awayScore = Number(match.score2);
    home.played += 1;
    away.played += 1;
    home.goalsFor += homeScore;
    home.goalsAgainst += awayScore;
    away.goalsFor += awayScore;
    away.goalsAgainst += homeScore;
    if (homeScore > awayScore) {
      home.wins += 1;
      away.losses += 1;
      home.lastResult = 'W';
      away.lastResult = 'L';
    } else if (awayScore > homeScore) {
      away.wins += 1;
      home.losses += 1;
      away.lastResult = 'W';
      home.lastResult = 'L';
    } else {
      home.draws += 1;
      away.draws += 1;
      home.lastResult = 'D';
      away.lastResult = 'D';
    }
  });
  const teamRecords = [...standingsByTeam.values()]
    .map((team) => ({ ...team, goalDifference: team.goalsFor - team.goalsAgainst }))
    .sort((a, b) => b.played - a.played || b.wins - a.wins || b.goalDifference - a.goalDifference || b.goalsFor - a.goalsFor || a.team.localeCompare(b.team));

  // 4. Tournament Numbers
  const goalsFromFinishedScores = finishedMatches.reduce((total, match) => {
    const score1 = Number(match.score1);
    const score2 = Number(match.score2);
    return Number.isFinite(score1) && Number.isFinite(score2) ? total + score1 + score2 : total;
  }, 0);
  const totalGoals = Math.max(validGoalEvents.length, goalsFromFinishedScores);
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
    teamRecords,
    finishedMatches
  };
}
