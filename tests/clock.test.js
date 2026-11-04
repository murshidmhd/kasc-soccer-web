import test from 'node:test';
import assert from 'node:assert/strict';
import { getCalculatedMatchTime } from '../src/utils/matchStateManager.js';
import { HALF_LENGTH_MINUTES, MAX_MATCH_MINUTES } from '../src/config/siteConfig.js';

test('Clock Suite: Sevens Match Clock Caps and Freeze Verification', async (t) => {
  await t.test('1. Before match start (UPCOMING): frozen at 00:00', () => {
    const state = {
      status: 'UPCOMING',
      matchSeconds: 0,
      matchMinute: 0,
      isTimerRunning: false,
      timerStartedAt: null
    };
    const clock = getCalculatedMatchTime(state);
    assert.equal(clock.display, '00:00');
    assert.equal(clock.minutes, 0);
    assert.equal(clock.seconds, 0);
    assert.equal(clock.totalSeconds, 0);
    assert.equal(clock.isRunning, false);
    assert.equal(clock.isCapped, false);
  });

  await t.test('2. Mid first half: 15 minutes elapsed (ticking normally)', () => {
    const fifteenMinsAgo = Date.now() - (15 * 60 * 1000);
    const state = {
      status: '1ST_HALF',
      matchSeconds: 0,
      isTimerRunning: true,
      timerStartedAt: fifteenMinsAgo
    };
    const clock = getCalculatedMatchTime(state);
    assert.equal(clock.display, '15:00');
    assert.equal(clock.minutes, 15);
    assert.equal(clock.seconds, 0);
    assert.equal(clock.totalSeconds, 900);
    assert.equal(clock.isRunning, true);
    assert.equal(clock.isCapped, false);
  });

  await t.test('3. At first half cap (exactly 30:00): marks isCapped', () => {
    const thirtyMinsAgo = Date.now() - (30 * 60 * 1000);
    const state = {
      status: '1ST_HALF',
      matchSeconds: 0,
      isTimerRunning: true,
      timerStartedAt: thirtyMinsAgo
    };
    const clock = getCalculatedMatchTime(state);
    assert.equal(clock.display, '30:00');
    assert.equal(clock.minutes, 30);
    assert.equal(clock.seconds, 0);
    assert.equal(clock.totalSeconds, 1800);
    assert.equal(clock.isCapped, true);
    assert.equal(clock.isRunning, false); // Timer ceases ticking past cap
  });

  await t.test('4. After first half cap (elapsed 35 mins): stays strictly frozen at 30:00', () => {
    const thirtyFiveMinsAgo = Date.now() - (35 * 60 * 1000);
    const state = {
      status: '1ST_HALF',
      matchSeconds: 0,
      isTimerRunning: true,
      timerStartedAt: thirtyFiveMinsAgo
    };
    const clock = getCalculatedMatchTime(state);
    assert.equal(clock.display, '30:00');
    assert.equal(clock.minutes, 30);
    assert.equal(clock.seconds, 0);
    assert.equal(clock.totalSeconds, 1800);
    assert.equal(clock.isCapped, true);
    assert.equal(clock.isRunning, false);
  });

  await t.test('5. Half Time (HALF_TIME): frozen at 30:00 break', () => {
    const state = {
      status: 'HALF_TIME',
      matchSeconds: 1800,
      isTimerRunning: false,
      timerStartedAt: null
    };
    const clock = getCalculatedMatchTime(state);
    assert.equal(clock.display, '30:00');
    assert.equal(clock.totalSeconds, 1800);
    assert.equal(clock.isRunning, false);
    assert.equal(clock.isCapped, true);
  });

  await t.test('6. Second half mid-half (started at 30:00, 15 mins elapsed = 45:00)', () => {
    const fifteenMinsAgo = Date.now() - (15 * 60 * 1000);
    const state = {
      status: '2ND_HALF',
      matchSeconds: 1800, // 30:00 base
      isTimerRunning: true,
      timerStartedAt: fifteenMinsAgo
    };
    const clock = getCalculatedMatchTime(state);
    assert.equal(clock.display, '45:00');
    assert.equal(clock.minutes, 45);
    assert.equal(clock.seconds, 0);
    assert.equal(clock.totalSeconds, 2700);
    assert.equal(clock.isRunning, true);
    assert.equal(clock.isCapped, false);
  });

  await t.test('7. Second half after cap (elapsed 35 mins from 30:00 = 65 mins without extra time): freezes at 60:00', () => {
    const thirtyFiveMinsAgo = Date.now() - (35 * 60 * 1000);
    const state = {
      status: '2ND_HALF',
      matchSeconds: 1800,
      isTimerRunning: true,
      timerStartedAt: thirtyFiveMinsAgo
    };
    const clock = getCalculatedMatchTime(state);
    assert.equal(clock.display, '60:00');
    assert.equal(clock.minutes, 60);
    assert.equal(clock.totalSeconds, 3600);
    assert.equal(clock.isCapped, true);
    assert.equal(clock.isRunning, false);
  });

  await t.test('8. Full Time (FULL_TIME): locked at 60:00 final', () => {
    const state = {
      status: 'FULL_TIME',
      matchSeconds: 3600,
      isTimerRunning: false,
      timerStartedAt: null
    };
    const clock = getCalculatedMatchTime(state);
    assert.equal(clock.display, '60:00');
    assert.equal(clock.totalSeconds, 3600);
    assert.equal(clock.isRunning, false);
    assert.equal(clock.isCapped, true);
  });

  await t.test('9. Extra time (+5 mins added in 2nd half): ticks to 63:00 and caps at 65:00', () => {
    // 33 mins elapsed in 2nd half = 30 + 33 = 63 mins
    const thirtyThreeMinsAgo = Date.now() - (33 * 60 * 1000);
    const stateMidExtra = {
      status: '2ND_HALF',
      matchSeconds: 1800,
      isTimerRunning: true,
      timerStartedAt: thirtyThreeMinsAgo,
      extraTimeMinutes: 5
    };
    const clockMid = getCalculatedMatchTime(stateMidExtra);
    assert.equal(clockMid.display, '63:00');
    assert.equal(clockMid.minutes, 63);
    assert.equal(clockMid.isCapped, false);
    assert.equal(clockMid.capMinutes, 65);

    // 40 mins elapsed in 2nd half = 30 + 40 = 70 mins -> caps at 65:00
    const fortyMinsAgo = Date.now() - (40 * 60 * 1000);
    const statePastExtra = {
      status: '2ND_HALF',
      matchSeconds: 1800,
      isTimerRunning: true,
      timerStartedAt: fortyMinsAgo,
      extraTimeMinutes: 5
    };
    const clockCapped = getCalculatedMatchTime(statePastExtra);
    assert.equal(clockCapped.display, '65:00');
    assert.equal(clockCapped.minutes, 65);
    assert.equal(clockCapped.totalSeconds, 3900);
    assert.equal(clockCapped.isCapped, true);
    assert.equal(clockCapped.isRunning, false);
  });

  await t.test('10. Root-cause regression test: start time 4 hours in the past (must show cap 30:00 or 60:00, never 234)', () => {
    // 4 hours in the past = 240 minutes
    const fourHoursAgo = Date.now() - (4 * 60 * 60 * 1000);
    
    // In 1st half:
    const state1st = {
      status: '1ST_HALF',
      matchSeconds: 0,
      isTimerRunning: true,
      timerStartedAt: fourHoursAgo
    };
    const clock1st = getCalculatedMatchTime(state1st);
    assert.equal(clock1st.display, '30:00');
    assert.equal(clock1st.minutes, 30);
    assert.notEqual(clock1st.minutes, 234);
    assert.notEqual(clock1st.minutes, 240);
    assert.equal(clock1st.isCapped, true);

    // In 2nd half:
    const state2nd = {
      status: '2ND_HALF',
      matchSeconds: 1800,
      isTimerRunning: true,
      timerStartedAt: fourHoursAgo
    };
    const clock2nd = getCalculatedMatchTime(state2nd);
    assert.equal(clock2nd.display, '60:00');
    assert.equal(clock2nd.minutes, 60);
    assert.notEqual(clock2nd.minutes, 234);
    assert.notEqual(clock2nd.minutes, 240);
    assert.equal(clock2nd.isCapped, true);
  });
});
