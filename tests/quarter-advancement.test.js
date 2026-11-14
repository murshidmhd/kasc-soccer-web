import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveQuarterFinals, INITIAL_QUARTERS } from '../src/utils/fixtureManager.js';
import { fixtures } from '../src/data/tournamentData.js';

test('Completed Round 1 matches automatically advance winners into Quarter Finals', () => {
  const qfs = resolveQuarterFinals(fixtures);

  // QF 1: Winner Match 1 (KRSC Kozhikkode) vs Winner Match 2 (KMG Mavoor)
  assert.equal(qfs[0].team1, 'KRSC KOZHIKKODE');
  assert.equal(qfs[0].team2, 'KMG MAVOOR');
  assert.equal(qfs[0].team1Decided, true);
  assert.equal(qfs[0].team2Decided, true);

  // QF 2: Winner Match 3 (X8 Tours Calicut) vs Winner Match 4 (Saban FC Kottakkal)
  assert.equal(qfs[1].team1, 'X8 TOURS CALICUT');
  assert.equal(qfs[1].team2, 'SABAN FC KOTTAKKAL');
  assert.equal(qfs[1].team1Decided, true);
  assert.equal(qfs[1].team2Decided, true);

  // QF 3: Winner Match 5 (United FC Nellikkuth) vs Winner Match 6 (Linsha Medicals)
  assert.equal(qfs[2].team1, 'UNITED FC NELLIKKUTH');
  assert.equal(qfs[2].team2, 'LINSHA MEDICALS MANNARKKAD');
  assert.equal(qfs[2].team1Decided, true);
  assert.equal(qfs[2].team2Decided, true);

  // QF 4: Winner Match 7 (I nov FC Manjeri) vs Winner Match 8 (Upcoming)
  assert.equal(qfs[3].team1, 'I nov FC MANJERI');
  assert.equal(qfs[3].team1Decided, true);
  assert.equal(qfs[3].team2, 'Winner Match 8');
  assert.equal(qfs[3].team2Decided, false);
});
