import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createStartedFixtureState,
  getInitialAdminFixtureId,
  getMatchFixtureInfo
} from '../src/utils/matchStateManager.js';

test('Admin selects the next fixture after the opening match ends', () => {
  assert.equal(
    getInitialAdminFixtureId({ status: 'FULL_TIME', activeFixtureId: 'm6' }),
    'm7'
  );
});

test('Starting KMG vs Shooters resets the completed match state', () => {
  const previous = {
    activeFixtureId: 'm6',
    status: 'FULL_TIME',
    officialScoreHome: 1,
    officialScoreAway: 3,
    events: [{ id: 'old-goal', type: 'goal', playerNumber: 10 }],
    extraTimeMinutes: 5,
    crowdReports: { home: 2, away: 1, total: 3 },
    matchSeconds: 3600,
    matchMinute: 60,
    isTimerRunning: false,
    timerStartedAt: null
  };

  const started = createStartedFixtureState(previous, 'm7', '1ST_HALF', 123456);

  assert.equal(started.activeFixtureId, 'm7');
  assert.equal(started.status, '1ST_HALF');
  assert.equal(started.officialScoreHome, 0);
  assert.equal(started.officialScoreAway, 0);
  assert.deepEqual(started.events, []);
  assert.deepEqual(started.crowdReports, { home: 0, away: 0, total: 0 });
  assert.equal(started.matchSeconds, 0);
  assert.equal(started.timerStartedAt, 123456);
  assert.equal(getMatchFixtureInfo(started.activeFixtureId).teamHome.name, 'KMG MAVOOR');
  assert.equal(getMatchFixtureInfo(started.activeFixtureId).teamAway.name, 'SHOOTERS PADANNA');
});

test('Resuming halftime preserves the current fixture score and events', () => {
  const previous = {
    activeFixtureId: 'm7',
    status: 'HALF_TIME',
    officialScoreHome: 1,
    officialScoreAway: 2,
    events: [{ id: 'current-goal', type: 'goal' }],
    matchSeconds: 1800,
    matchMinute: 30
  };

  const resumed = createStartedFixtureState(previous, 'm7', '2ND_HALF', 789);

  assert.equal(resumed.officialScoreHome, 1);
  assert.equal(resumed.officialScoreAway, 2);
  assert.deepEqual(resumed.events, previous.events);
  assert.equal(resumed.isTimerRunning, true);
  assert.equal(resumed.matchSeconds, 1800);
  assert.equal(resumed.timerStartedAt, 789);
});
