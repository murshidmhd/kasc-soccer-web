import { getStoredMatchState, saveOfficialMatchState } from './matchStateManager.js';

/**
 * Disciplinary Manager for KASC Sevens Football
 * Persistently manages Yellow Cards, Red Cards, and Match Suspensions.
 * Stores in dedicated localStorage key 'kasc_player_disciplinary_records_v1'
 * and keeps synchronized with 'kasc_official_match_state_v2' match events.
 */

export const DISCIPLINARY_STORAGE_KEY = 'kasc_player_disciplinary_records_v1';

/**
 * Normalize player name for fuzzy matching (handles "Usman K. P.", "Usman KP", "Usman")
 */
export function normalizePlayerName(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/[\.\,\_\-\#\(\)]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Check if two player identities match across different input variations
 */
export function isPlayerMatch(nameA, nameB, numA, numB, teamA, teamB) {
  if (!nameA || !nameB) return false;
  const normA = normalizePlayerName(nameA);
  const normB = normalizePlayerName(nameB);

  // Exact or substring match
  if (normA === normB || normA.includes(normB) || normB.includes(normA)) {
    return true;
  }

  // Token / First name match (e.g., "usman" in "usman k p")
  const tokensA = normA.split(' ').filter((w) => w.length >= 3);
  const tokensB = normB.split(' ').filter((w) => w.length >= 3);
  const hasCommonToken = tokensA.some((w) => tokensB.includes(w));

  if (hasCommonToken) {
    if (numA && numB && String(numA) === String(numB)) {
      return true;
    }
    if (teamA && teamB) {
      const tA = teamA.toLowerCase();
      const tB = teamB.toLowerCase();
      if (tA.includes(tB) || tB.includes(tA)) {
        return true;
      }
    }
    // High-confidence single significant token (e.g. Usman, Vahid, Soumahoro)
    if (tokensA.length === 1 || tokensB.length === 1) {
      return true;
    }
  }

  // Jersey number + team match if names are partially related
  if (numA && numB && String(numA) === String(numB) && teamA && teamB) {
    const tA = teamA.toLowerCase();
    const tB = teamB.toLowerCase();
    if (tA.includes(tB) || tB.includes(tA)) {
      return true;
    }
  }

  return false;
}

/**
 * Retrieve all persistent disciplinary records from local database and active match state
 */
export function getAllDisciplinaryRecords() {
  const records = [];
  const seenIds = new Set();

  // 1. Read from dedicated disciplinary database key
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(DISCIPLINARY_STORAGE_KEY) : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        parsed.forEach((rec) => {
          if (rec && rec.id) {
            records.push(rec);
            seenIds.add(rec.id);
          }
        });
      }
    }
  } catch (e) {
    console.error('Failed to read disciplinary records', e);
  }

  // 2. Merge with cards logged in match events from official match state
  try {
    const matchState = getStoredMatchState();
    if (matchState && Array.isArray(matchState.events)) {
      matchState.events.forEach((evt) => {
        if ((evt.type === 'yellow_card' || evt.type === 'red_card') && !seenIds.has(evt.id)) {
          const mappedRecord = {
            id: evt.id,
            cardType: evt.type,
            player: evt.player || 'Player',
            playerName: evt.player || 'Player',
            playerNumber: evt.playerNumber || null,
            team: evt.team || 'home',
            teamName: evt.teamName || (evt.team === 'away' ? 'BASE PERUMBAVUR' : 'KRSC KOZHIKKODE'),
            minute: evt.minute || 1,
            reason: evt.text || (evt.type === 'red_card' ? 'Red Card Dismissal' : 'Caution / Tactical Foul'),
            timestamp: evt.timestamp || new Date().toISOString()
          };
          records.push(mappedRecord);
          seenIds.add(evt.id);
        }
      });
    }
  } catch (e) {
    console.error('Failed to merge match state events', e);
  }

  return records;
}

/**
 * Save a new disciplinary card to the database and sync with match events
 */
export function saveDisciplinaryRecord(cardData) {
  const existing = getAllDisciplinaryRecords();
  const cardId = cardData.id || `card-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

  const finalRecord = {
    id: cardId,
    cardType: cardData.cardType || 'red_card', // 'red_card' | 'yellow_card'
    player: (cardData.playerName || cardData.player || '').trim(),
    playerName: (cardData.playerName || cardData.player || '').trim(),
    playerNumber: cardData.playerNumber ? String(cardData.playerNumber) : null,
    team: cardData.team || 'home',
    teamName: cardData.teamName || (cardData.team === 'away' ? 'BASE PERUMBAVUR' : 'KRSC KOZHIKKODE'),
    minute: Number(cardData.minute) || 1,
    reason: cardData.reason || (cardData.cardType === 'red_card' ? 'Red card dismissal' : 'Caution'),
    matchId: cardData.matchId || 'match-01',
    matchTitle: cardData.matchTitle || 'Match 1 • KRSC KOZHIKKODE vs BASE PERUMBAVUR',
    timestamp: cardData.timestamp || new Date().toISOString()
  };

  // 1. Update dedicated database
  const updatedRecords = [
    finalRecord,
    ...existing.filter((r) => r.id !== finalRecord.id)
  ];

  try {
    localStorage.setItem(DISCIPLINARY_STORAGE_KEY, JSON.stringify(updatedRecords));
  } catch (e) {
    console.error('Failed to save to disciplinary storage', e);
  }

  // 2. Synchronize with official match state events
  try {
    const state = getStoredMatchState();
    const existingEvents = state.events || [];
    const eventAlreadyPresent = existingEvents.some((e) => e.id === finalRecord.id);

    if (!eventAlreadyPresent) {
      const newEvent = {
        id: finalRecord.id,
        type: finalRecord.cardType,
        team: finalRecord.team,
        teamName: finalRecord.teamName,
        player: finalRecord.playerName,
        minute: finalRecord.minute,
        text: finalRecord.reason,
        timestamp: finalRecord.timestamp
      };

      saveOfficialMatchState({
        ...state,
        events: [newEvent, ...existingEvents]
      });
    }
  } catch (e) {
    console.error('Failed to sync card with match state', e);
  }

  // 3. Dispatch broadcast events for instant live UI re-render
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('kasc_disciplinary_updated', { detail: finalRecord }));
  }

  return finalRecord;
}

/**
 * Remove / Delete a card from database (e.g. referee corrected mistaken booking)
 */
export function removeDisciplinaryRecord(cardId) {
  try {
    const existing = getAllDisciplinaryRecords();
    const filtered = existing.filter((r) => r.id !== cardId);
    localStorage.setItem(DISCIPLINARY_STORAGE_KEY, JSON.stringify(filtered));

    // Also remove from match state events
    const state = getStoredMatchState();
    if (state && Array.isArray(state.events)) {
      const updatedEvents = state.events.filter((e) => e.id !== cardId);
      saveOfficialMatchState({
        ...state,
        events: updatedEvents
      });
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('kasc_disciplinary_updated', { detail: { id: cardId, deleted: true } }));
    }
    return true;
  } catch (e) {
    console.error('Failed to remove card record', e);
    return false;
  }
}

/**
 * Get full disciplinary status for any given player
 */
export function getPlayerDisciplinaryStatus(playerName, playerNumber = null, teamName = null) {
  const allRecords = getAllDisciplinaryRecords();

  const matchingCards = allRecords.filter((rec) => {
    return isPlayerMatch(
      rec.playerName || rec.player,
      playerName,
      rec.playerNumber,
      playerNumber,
      rec.teamName || rec.team,
      teamName
    );
  });

  const redCards = matchingCards.filter((c) => c.cardType === 'red_card');
  const yellowCards = matchingCards.filter((c) => c.cardType === 'yellow_card');

  const hasRedCard = redCards.length > 0;
  const hasYellowCard = yellowCards.length > 0;
  // In Sevens, a direct red or 2 yellow cards results in immediate match suspension
  const isSuspended = hasRedCard || yellowCards.length >= 2;

  const latestCard = matchingCards.length > 0
    ? [...matchingCards].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]
    : null;

  return {
    hasCard: matchingCards.length > 0,
    hasRedCard,
    hasYellowCard,
    redCardsCount: redCards.length,
    yellowCardsCount: yellowCards.length,
    totalCardsCount: matchingCards.length,
    isSuspended,
    cards: matchingCards,
    latestCard
  };
}
