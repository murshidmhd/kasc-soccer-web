/**
 * MatchdayHero — Smart hero card that adapts to match state.
 * PRE_MATCH  → countdown + logos + kickoff time
 * LIVE       → big score + clock + latest event + "Updated Xs ago"
 * FINISHED   → final score + scorers + share result
 * NO_FIXTURE → announcement message
 *
 * Reads kickoff time exclusively from fixtures data (single source of truth).
 * No video loads or autoplays here.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Share2, Clock, Zap, Trophy, Calendar, AlertCircle } from 'lucide-react';
import TeamLogo from './TeamLogo';
import { fixtures } from '../data/tournamentData';
import { getStoredMatchState } from '../utils/matchStateManager';
import { SITE_URL, ORGANISERS } from '../config/siteConfig';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Returns the fixture that should be featured (live > recently finished within 12h > next upcoming). */
function selectFeaturedFixture(matchState) {
  const now = Date.now();
  const confirmed = fixtures.filter((f) => f.confirmed);
  if (!confirmed.length) return null;

  // 1. LIVE fixture
  if (
    matchState.status === '1ST_HALF' ||
    matchState.status === 'HALF_TIME' ||
    matchState.status === '2ND_HALF'
  ) {
    return confirmed[0]; // current match
  }

  // 2. Recently FINISHED (within 12 h)
  if (matchState.status === 'FULL_TIME') {
    const lastUpdated = matchState.lastUpdated
      ? new Date(matchState.lastUpdated).getTime()
      : 0;
    const twelveHours = 12 * 60 * 60 * 1000;
    if (!lastUpdated || now - lastUpdated < twelveHours) {
      return confirmed[0];
    }
  }

  // 3. Next upcoming confirmed fixture
  return confirmed.find((f) => f.status === 'Upcoming' || !f.score1) || confirmed[0];
}

/** Format countdown from now to target ISO string */
function useCountdown(targetIso) {
  const [remaining, setRemaining] = useState(null);

  useEffect(() => {
    if (!targetIso) return;
    const target = new Date(targetIso).getTime();
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setRemaining(null);
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRemaining({ h, m, s, diff });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetIso]);

  return remaining;
}

/** Milliseconds since lastUpdated — for "Updated Xs ago" */
function useTimeSince(isoString) {
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    if (!isoString) return;
    const base = new Date(isoString).getTime();
    const id = setInterval(() => setSecs(Math.floor((Date.now() - base) / 1000)), 1000);
    setSecs(Math.floor((Date.now() - base) / 1000));
    return () => clearInterval(id);
  }, [isoString]);
  return secs;
}

function formatTimeSince(secs) {
  if (secs < 60) return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  return `${Math.floor(secs / 3600)}h ago`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TeamBlock({ name, size = 64, lang }) {
  return (
    <div className="flex flex-col items-center gap-1.5 min-w-0 flex-1">
      <div
        className="rounded-full bg-white border border-white/30 shadow-sm flex items-center justify-center overflow-hidden"
        style={{ width: size, height: size }}
      >
        <TeamLogo teamName={name} className="w-full h-full object-contain rounded-full" />
      </div>
      <span className="text-[11px] sm:text-xs font-bold text-white/90 text-center leading-tight line-clamp-2 max-w-[72px] sm:max-w-[96px]">
        {name}
      </span>
    </div>
  );
}

function CountdownBlock({ diff, lang }) {
  if (!diff) return null;
  const { h, m, s } = diff;
  const pad = (n) => String(n).padStart(2, '0');
  return (
    <div className="flex items-center justify-center gap-1.5 mt-3" aria-live="polite" aria-label={`Kickoff in ${h}h ${m}m ${s}s`}>
      {[
        { v: pad(h), l: lang === 'ml' ? 'മണിക്കൂർ' : 'h' },
        { v: pad(m), l: lang === 'ml' ? 'മിനിറ്റ്' : 'm' },
        { v: pad(s), l: lang === 'ml' ? 'സെക്കൻഡ്' : 's' },
      ].map(({ v, l }, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="text-gold font-black text-sm pb-3">:</span>}
          <div className="flex flex-col items-center">
            <span className="font-mono font-black text-xl sm:text-2xl text-white tabular-nums w-10 text-center">{v}</span>
            <span className="text-[9px] text-white/60 uppercase tracking-wider">{l}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MatchdayHero({ lang, isDarkMode, onNavigate }) {
  const [matchState, setMatchState] = useState(() => getStoredMatchState());
  const [shareStatus, setShareStatus] = useState('idle'); // idle | sharing | done | error

  // Poll for state changes (syncs with admin changes via storage events)
  useEffect(() => {
    const sync = () => setMatchState(getStoredMatchState());
    sync();
    window.addEventListener('kasc_match_state_updated', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('kasc_match_state_updated', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const featured = selectFeaturedFixture(matchState);
  const secondsSinceUpdate = useTimeSince(matchState?.lastUpdated);

  // Build a kickoff ISO from fixtures data (single source of truth)
  const kickoffIso = (() => {
    if (!featured) return null;
    // fixtures store date like "06 Nov 2026" and time "08:45 PM"
    try {
      const dateStr = featured.date; // e.g. "06 Nov 2026"
      const timeStr = featured.time || '08:45 PM'; // canonical from fixtures
      return new Date(`${dateStr} ${timeStr} IST`).toISOString();
    } catch {
      return null;
    }
  })();

  const countdown = useCountdown(kickoffIso);

  const isLive =
    matchState.status === '1ST_HALF' ||
    matchState.status === 'HALF_TIME' ||
    matchState.status === '2ND_HALF';
  const isFinished = matchState.status === 'FULL_TIME';
  const isPreMatch = !isLive && !isFinished;

  // ── SHARE RESULT ──
  const handleShareResult = useCallback(async () => {
    if (!featured) return;
    setShareStatus('sharing');
    const scoreHome = matchState.officialScoreHome ?? 0;
    const scoreAway = matchState.officialScoreAway ?? 0;
    const goalEvents = (matchState.events || []).filter((e) => e.type === 'goal');
    const scorerLines = goalEvents
      .map((e) => `${e.minute}' ${e.player} (${e.team === 'home' ? featured.team1 : featured.team2})`)
      .join(', ');
    const text = [
      `⚽ FT: ${featured.team1} ${scoreHome} – ${scoreAway} ${featured.team2}`,
      scorerLines ? `Goals: ${scorerLines}` : 'Match details coming',
      `${ORGANISERS.primary.name} & ${ORGANISERS.coOrganiser.name}, Season 7`,
      SITE_URL,
    ].join('\n');

    try {
      if (navigator.share) {
        await navigator.share({ title: 'All India Sevens – Result', text });
        setShareStatus('done');
      } else {
        const wa = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(wa, '_blank', 'noopener,noreferrer');
        setShareStatus('done');
      }
    } catch {
      // User cancelled or failed — fallback WhatsApp
      const wa = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(wa, '_blank', 'noopener,noreferrer');
      setShareStatus('idle');
    }
  }, [featured, matchState]);

  // ── NO FIXTURE ──
  if (!featured) {
    return (
      <div className="rounded-2xl p-5 border border-white/20 bg-white/5 text-center space-y-2">
        <AlertCircle className="w-8 h-8 text-white/50 mx-auto" />
        <p className="text-sm font-semibold text-white/80 leading-snug">
          {lang === 'ml'
            ? 'മത്സരങ്ങൾ ദിവസേന പ്രഖ്യാപിക്കുന്നതാണ്. ഓരോ മത്സര ദിവസത്തിനും ശേഷം വീണ്ടും പരിശോധിക്കുക.'
            : 'Fixtures are announced daily. Check back after each match day.'}
        </p>
      </div>
    );
  }

  const scoreHome = matchState.officialScoreHome ?? 0;
  const scoreAway = matchState.officialScoreAway ?? 0;
  const goalEvents = (matchState.events || []).filter((e) => e.type === 'goal');
  const latestEvent = [...(matchState.events || [])].reverse().find(Boolean);
  const isStale = secondsSinceUpdate > 60 && isLive;

  // ── PRE MATCH ──
  const PreMatch = (
    <div className="space-y-3">
      {/* Badge row */}
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gold text-navy-900 text-[10px] font-black uppercase tracking-wider">
          <Calendar className="w-3 h-3" />
          {lang === 'ml' ? 'അടുത്ത മത്സരം' : 'NEXT MATCH'}
        </span>
        <span className="text-[11px] font-mono text-white/70">
          {featured.date} · {featured.time}
        </span>
      </div>

      {/* Teams */}
      <div className="flex items-center justify-between gap-2 py-2">
        <TeamBlock name={featured.team1} size={64} lang={lang} />
        <div className="flex flex-col items-center px-2">
          <span className="font-black text-lg text-white/90 font-sports tracking-widest">VS</span>
          {countdown && <CountdownBlock diff={countdown} lang={lang} />}
          {!countdown && (
            <span className="text-xs text-white/60 mt-1">
              {lang === 'ml' ? 'ഉടൻ ആരംഭിക്കും' : 'Starting soon'}
            </span>
          )}
        </div>
        <TeamBlock name={featured.team2} size={64} lang={lang} />
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={() => onNavigate('fixtures')}
          className="flex-1 min-h-[44px] rounded-xl bg-gold hover:bg-amber-400 text-navy-900 font-black text-xs uppercase tracking-wide transition active:scale-95 shadow-sm"
          aria-label={lang === 'ml' ? 'ഫിക്സ്ചറുകൾ കാണുക' : 'View Fixtures'}
        >
          {lang === 'ml' ? 'ഫിക്സ്ചർ' : 'Fixtures'}
        </button>
        <button
          onClick={() => onNavigate('teams')}
          className="flex-1 min-h-[44px] rounded-xl border border-white/30 text-white font-bold text-xs uppercase transition active:scale-95 hover:bg-white/10"
          aria-label={lang === 'ml' ? 'ക്ലബ്ബുകൾ കാണുക' : 'View Clubs'}
        >
          {lang === 'ml' ? 'ക്ലബ്ബുകൾ' : 'Clubs'}
        </button>
      </div>
    </div>
  );

  // ── LIVE ──
  const Live = (
    <div className="space-y-3">
      {/* Badge row */}
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          LIVE
        </span>
        <span className="text-[11px] font-mono text-white/70 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {matchState.matchMinute ?? 0}'
          {matchState.status === 'HALF_TIME' && (
            <span className="text-gold font-bold ml-1">HT</span>
          )}
        </span>
      </div>

      {/* Score */}
      <div className="flex items-center justify-between gap-2">
        <TeamBlock name={featured.team1} size={56} lang={lang} />
        <div className="flex flex-col items-center">
          <span className="font-black text-5xl sm:text-6xl text-white tabular-nums font-sports">
            {scoreHome}–{scoreAway}
          </span>
          {isStale && (
            <span className="text-[10px] text-amber-400 font-bold mt-1 animate-pulse">
              {lang === 'ml' ? 'പുനഃബന്ധിക്കുന്നു...' : 'Reconnecting...'}
            </span>
          )}
          {!isStale && matchState.lastUpdated && (
            <span className="text-[10px] text-white/50 mt-1">
              {lang === 'ml' ? 'അപ്ഡേറ്റ്:' : 'Updated'} {formatTimeSince(secondsSinceUpdate)}
            </span>
          )}
        </div>
        <TeamBlock name={featured.team2} size={56} lang={lang} />
      </div>

      {/* Latest event */}
      {latestEvent && (
        <div className="rounded-xl bg-white/10 px-3 py-2 text-xs text-white/80 font-medium truncate">
          <span className="text-gold font-black">{latestEvent.minute}'</span>{' '}
          {latestEvent.type === 'goal' ? '⚽' : latestEvent.type === 'yellowcard' ? '🟨' : latestEvent.type === 'redcard' ? '🟥' : '📋'}{' '}
          {latestEvent.player}
          {latestEvent.team
            ? ` (${latestEvent.team === 'home' ? featured.team1 : featured.team2})`
            : ''}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={() => onNavigate('live')}
          className="flex-1 min-h-[44px] rounded-xl bg-gold hover:bg-amber-400 text-navy-900 font-black text-xs uppercase tracking-wide transition active:scale-95 shadow-sm flex items-center justify-center gap-1.5"
        >
          <Zap className="w-3.5 h-3.5" />
          {lang === 'ml' ? 'ലൈവ് സ്കോർ' : 'Live Score'}
        </button>
        <button
          onClick={() => onNavigate('fixtures')}
          className="flex-1 min-h-[44px] rounded-xl border border-white/30 text-white font-bold text-xs uppercase transition active:scale-95 hover:bg-white/10"
        >
          {lang === 'ml' ? 'ഫിക്സ്ചർ' : 'Fixtures'}
        </button>
      </div>
    </div>
  );

  // ── FINISHED ──
  const winner =
    scoreHome > scoreAway
      ? featured.team1
      : scoreAway > scoreHome
      ? featured.team2
      : null;

  const Finished = (
    <div className="space-y-3">
      {/* Badge */}
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black uppercase">
          <Trophy className="w-3 h-3 text-gold" />
          {lang === 'ml' ? 'ഫൈനൽ സ്കോർ' : 'FULL TIME'}
        </span>
        <span className="text-[11px] font-mono text-white/60">{featured.date}</span>
      </div>

      {/* Score */}
      <div className="flex items-center justify-between gap-2">
        <TeamBlock name={featured.team1} size={56} lang={lang} />
        <div className="flex flex-col items-center gap-1">
          <span className="font-black text-5xl sm:text-6xl text-white tabular-nums font-sports">
            {scoreHome}–{scoreAway}
          </span>
          {winner && (
            <span className="text-[10px] text-gold font-black uppercase tracking-wider">
              {winner} {lang === 'ml' ? 'ജയിച്ചു' : 'wins'}
            </span>
          )}
          {!winner && (
            <span className="text-[10px] text-white/60 font-bold uppercase">
              {lang === 'ml' ? 'സമനില' : 'Draw'}
            </span>
          )}
        </div>
        <TeamBlock name={featured.team2} size={56} lang={lang} />
      </div>

      {/* Scorers */}
      {goalEvents.length > 0 ? (
        <div className="rounded-xl bg-white/10 px-3 py-2 space-y-0.5">
          {goalEvents.map((e, i) => (
            <div key={i} className="text-xs text-white/80 flex items-center gap-1.5">
              <span className="text-[10px] text-gold font-black w-8 shrink-0">{e.minute}'</span>
              <span>⚽</span>
              <span className="font-medium truncate">{e.player}</span>
              <span className="text-white/50 shrink-0 text-[10px]">
                ({e.team === 'home' ? featured.team1 : featured.team2})
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[11px] text-white/50 text-center italic">
          {lang === 'ml' ? 'മാച്ച് വിവരങ്ങൾ ഉടൻ ലഭ്യമാകും' : 'Match details coming'}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={handleShareResult}
          disabled={shareStatus === 'sharing'}
          className="flex-1 min-h-[44px] rounded-xl bg-gold hover:bg-amber-400 text-navy-900 font-black text-xs uppercase tracking-wide transition active:scale-95 shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-70"
          aria-label={lang === 'ml' ? 'ഫലം ഷെയർ ചെയ്യുക' : 'Share result'}
        >
          <Share2 className="w-3.5 h-3.5" />
          {shareStatus === 'sharing'
            ? '...'
            : lang === 'ml'
            ? 'ഫലം ഷെയർ ചെയ്യുക'
            : 'Share Result'}
        </button>
        <button
          onClick={() => onNavigate('fixtures')}
          className="flex-1 min-h-[44px] rounded-xl border border-white/30 text-white font-bold text-xs uppercase transition active:scale-95 hover:bg-white/10"
        >
          {lang === 'ml' ? 'ഫിക്സ്ചർ' : 'Fixtures'}
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="rounded-2xl p-4 sm:p-5 border border-white/20 bg-white/5"
      role="region"
      aria-label={lang === 'ml' ? 'മാച്ച് ഹൈലൈറ്റ്' : 'Match highlight'}
    >
      {isLive ? Live : isFinished ? Finished : PreMatch}
    </div>
  );
}
