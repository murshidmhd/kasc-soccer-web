import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveQuarterFinals, INITIAL_QUARTERS } from '../src/utils/fixtureManager.js';
import { fixtures } from '../src/data/tournamentData.js';

test('Completed Round 1 matches automatically advance winners into Quarter Finals', () => {
  const qfs = resolveQuarterFinals(fixtures);

  // QF 1: Winner Match 1 (KRSC Kozhikkode) vs Winner Match 2 (X8 Tours Calicut)
  assert.equal(qfs[0].team1, 'KRSC KOZHIKKODE');
  assert.equal(qfs[0].team2, 'X8 TOURS CALICUT');
  assert.equal(qfs[0].team1Decided, true);
  assert.equal(qfs[0].team2Decided, true);

  // QF 2: Winner Match 3 (Saban FC) vs Winner Match 4 (United FC)
  assert.equal(qfs[1].team1, 'SABAN FC KOTTAKKAL');
  assert.equal(qfs[1].team2, 'UNITED FC NELLIKKUTH');
  assert.equal(qfs[1].team1Decided, true);
  assert.equal(qfs[1].team2Decided, true);

  // QF 3: Winner Match 5 (Linsha Medicals) vs Winner Match 6 (I nov FC)
  assert.equal(qfs[2].team1, 'LINSHA MEDICALS MANNARKKAD');
  assert.equal(qfs[2].team2, 'I nov FC MANJERI');
  assert.equal(qfs[2].team1Decided, true);
  assert.equal(qfs[2].team2Decided, true);

  // QF 4: Winner Match 7 (KMG Mavoor) vs Winner Match 8 (Upcoming)
  assert.equal(qfs[3].team1, 'KMG MAVOOR');
  assert.equal(qfs[3].team1Decided, true);
  assert.equal(qfs[3].team2, 'Winner Match 8');
  assert.equal(qfs[3].team2Decided, false);
});
