import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  ChevronRight, 
  Shield, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Maximize2, 
  X, 
  RotateCw,
  AlertCircle
} from 'lucide-react';
import TeamLogo from './TeamLogo';
import { fixtures } from '../data/tournamentData';
import { SHOW_BRACKET } from '../config/siteConfig';

// Single configuration constant (Data Rule 2, Task 4)
export const BRACKET_CONFIRMED = SHOW_BRACKET;

// Seeded direct entries into Pre-Quarter
export const SEEDED_PRE_QUARTERS = [
  { name: 'SUPER STUDIO MALAPPURAM', note: 'Seeded Direct Entry' },
  { name: 'AL MADEENA CHERPULASSERI', note: 'Seeded Direct Entry' },
  { name: 'UDAYA PARAMBIL PEEDIKA', note: 'Host Club / Seeded Entry' }
];

// Dynamically compute bracket data from current tournament fixtures
export const getBracketData = (fixturesList = fixtures) => {
  const round1Matches = fixturesList.filter((f) => ['m1','m2','r1-x8-ayc','r1-saban-townteam','r1-united-abilash','m6','m7','m9'].includes(f.id) || (f.stage?.includes('Round 1') && !f.stage?.includes('Pre-Quarter')));
  const round1 = round1Matches.map((f, i) => {
    const winner = f.winner || (f.confirmed && Number.isFinite(f.score1) && Number.isFinite(f.score2)
      ? f.score1 === f.score2 ? null : f.score1 > f.score2 ? f.team1 : f.team2
      : null);
    return {
      id: f.id,
      matchNum: i + 1,
      date: f.date,
      time: f.time,
      team1: f.team1,
      team2: f.team2,
      status: f.status === 'Completed' ? 'Completed' : (f.id === 'm1' ? 'Opening Match' : 'Upcoming'),
      score1: f.score1,
      score2: f.score2,
      winner,
      confirmed: f.confirmed,
      penaltyScore: f.penaltyScore,
      penaltyScore1: f.penaltyScore1,
      penaltyScore2: f.penaltyScore2
    };
  });

  // Pre-Quarters (Round of 16)
  const preQuarterMatches = fixturesList.filter((f) => ['m8', 'r1-kmg-perinthalmanna', 'pq-krsc-madina', 'm5', 'm4', 'm3', 'pq-udaya', 'pq-malabar'].includes(f.id) || (f.stage?.includes('Pre-Quarter') && !['m1','m2','r1-x8-ayc','r1-saban-townteam','r1-united-abilash','m6','m7','m9'].includes(f.id)));
  const preQuarters = preQuarterMatches.map((f, i) => {
    const winner = f.winner || (f.confirmed && Number.isFinite(f.score1) && Number.isFinite(f.score2)
      ? f.score1 === f.score2 ? null : f.score1 > f.score2 ? f.team1 : f.team2
      : null);
    return {
      id: f.id,
      matchNum: `PQ ${i + 1}`,
      date: f.date,
      time: f.time,
      team1: f.team1,
      team2: f.team2,
      status: f.status,
      score1: f.score1,
      score2: f.score2,
      winner,
      confirmed: f.confirmed,
      penaltyScore: f.penaltyScore,
      penaltyScore1: f.penaltyScore1,
      penaltyScore2: f.penaltyScore2
    };
  });

  const quarterFinalMatches = fixturesList.filter((f) => f.id?.startsWith('qf') || f.stage?.includes('Quarter Final'));
  const quarterFinals = quarterFinalMatches.map((f, i) => {
    const winner = f.winner || (f.confirmed && Number.isFinite(f.score1) && Number.isFinite(f.score2)
      ? f.score1 === f.score2 ? null : f.score1 > f.score2 ? f.team1 : f.team2
      : null);
    return {
      id: f.id,
      matchNum: `QF ${i + 1}`,
      date: f.date,
      time: f.time,
      team1: f.team1,
      team2: f.team2,
      team1Slot: f.team1 || `Winner PQ ${2 * i + 1}`,
      team2Slot: f.team2 || `Winner PQ ${2 * i + 2}`,
      status: f.status,
      score1: f.score1,
      score2: f.score2,
      winner,
      confirmed: f.confirmed,
      penaltyScore: f.penaltyScore,
      penaltyScore1: f.penaltyScore1,
      penaltyScore2: f.penaltyScore2,
      sfSlot: i < 2 ? 'sf1' : 'sf2'
    };
  });

  return {
    round1,
    preQuarters,
    quarterFinals,
    semiFinals: [
      { id: 'sf1', matchNum: 'SF 1', date: '30 Nov', time: '9:00 PM', team1Slot: 'Winner QF 1', team2Slot: 'Winner QF 2', status: 'Semi Final', winner: null, finalSlot: 'final' },
      { id: 'sf2', matchNum: 'SF 2', date: '02 Dec', time: '9:00 PM', team1Slot: 'Winner QF 3', team2Slot: 'Winner QF 4', status: 'Semi Final', winner: null, finalSlot: 'final' }
    ],
    grandFinal: {
      id: 'final',
      matchNum: 'FINAL',
      date: '06 Dec 2026 • 9:00 PM',
      venue: 'Peruvallur Panjayath Stadium',
      team1Slot: 'Winner Semi Final 1',
      team2Slot: 'Winner Semi Final 2',
      trophy: 'Rolling Trophy',
      trophyFull: 'Season 7 Champions Rolling Trophy'
    }
  };
};

export const BRACKET_DATA = getBracketData();

function BracketMatchCard({ match, isOpening, lang }) {
  const isCompleted = match.status === 'Completed' || (Number.isFinite(match.score1) && Number.isFinite(match.score2));
  const winnerName = match.winner;

  const team1IsWinner = Boolean(
    winnerName && match.team1 && (
      winnerName.toLowerCase() === match.team1.toLowerCase() ||
      match.team1.toLowerCase().includes(winnerName.toLowerCase()) ||
      winnerName.toLowerCase().includes(match.team1.toLowerCase())
    )
  );

  const team2IsWinner = Boolean(
    winnerName && match.team2 && (
      winnerName.toLowerCase() === match.team2.toLowerCase() ||
      match.team2.toLowerCase().includes(winnerName.toLowerCase()) ||
      winnerName.toLowerCase().includes(match.team2.toLowerCase())
    )
  );

  const penaltyText = match.penaltyScore 
    ? match.penaltyScore.replace(/\(Pens\)/i, 'Pens').trim()
    : (match.penaltyScore1 != null && match.penaltyScore2 != null)
    ? `${match.penaltyScore1}-${match.penaltyScore2} Pens`
    : null;

  return (
    <div
      className={`p-3.5 rounded-2xl border surface-card shadow-card space-y-2.5 transition duration-150 ${
        isOpening 
          ? 'border-gold/80 ring-1 ring-gold/30' 
          : isCompleted 
          ? 'border-surface-border dark:border-navy-700/80' 
          : 'border-surface-border dark:border-navy-700'
      }`}
    >
      {/* Header Row: Match label, Date, Kickoff & FT Badge */}
      <div className="flex items-center justify-between text-xs pb-2 border-b border-surface-border dark:border-navy-700 text-card-muted">
        <div className="flex items-center gap-2">
          <span className="font-sports font-black uppercase text-card-title">
            {typeof match.matchNum === 'number' ? `Match ${match.matchNum}` : match.matchNum}
          </span>
          {isOpening && (
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-gold/15 text-gold border border-gold/30 uppercase">
              Opening
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px]">
            {match.date} • {match.time?.replace(':00', '') || '9:00 PM'}
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
            isCompleted 
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
              : 'bg-surface-subtle text-card-muted border border-surface-border'
          }`}>
            {isCompleted ? 'FT' : 'Upcoming'}
          </span>
        </div>
      </div>

      {/* Team 1 Row */}
      <div className={`flex items-center justify-between gap-3 p-2 rounded-xl transition ${
        team1IsWinner ? 'bg-emerald-500/10 dark:bg-emerald-950/20 border border-emerald-500/30' : ''
      }`}>
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {match.team1 ? (
            <div className="w-8 h-8 rounded-full bg-white p-0.5 border border-surface-border dark:border-navy-700 shadow-2xs flex items-center justify-center shrink-0">
              <TeamLogo teamName={match.team1} className="w-full h-full rounded-full object-contain" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full border-2 border-dashed border-card-muted text-card-muted flex items-center justify-center font-bold text-xs shrink-0">?</div>
          )}
          <span className={`text-xs sm:text-sm font-sports truncate leading-tight ${
            team1IsWinner ? 'font-black text-emerald-400 dark:text-emerald-300' : match.team1 ? 'font-bold text-card-title' : 'text-card-muted'
          }`}>
            {match.team1 || match.team1Slot || 'TBD'}
          </span>
          {team1IsWinner && (
            <span className="text-[10px] text-emerald-400 font-bold shrink-0">✓ Won</span>
          )}
        </div>

        {/* Score */}
        {isCompleted && match.score1 != null && (
          <div className="text-right shrink-0">
            <span className={`text-base font-black font-mono px-2 py-0.5 rounded ${
              team1IsWinner ? 'text-emerald-400 font-black' : 'text-card-title'
            }`}>
              {match.score1}
            </span>
          </div>
        )}
      </div>

      {/* Team 2 Row */}
      <div className={`flex items-center justify-between gap-3 p-2 rounded-xl transition ${
        team2IsWinner ? 'bg-emerald-500/10 dark:bg-emerald-950/20 border border-emerald-500/30' : ''
      }`}>
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {match.team2 ? (
            <div className="w-8 h-8 rounded-full bg-white p-0.5 border border-surface-border dark:border-navy-700 shadow-2xs flex items-center justify-center shrink-0">
              <TeamLogo teamName={match.team2} className="w-full h-full rounded-full object-contain" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full border-2 border-dashed border-card-muted text-card-muted flex items-center justify-center font-bold text-xs shrink-0">?</div>
          )}
          <span className={`text-xs sm:text-sm font-sports truncate leading-tight ${
            team2IsWinner ? 'font-black text-emerald-400 dark:text-emerald-300' : match.team2 ? 'font-bold text-card-title' : 'text-card-muted'
          }`}>
            {match.team2 || match.team2Slot || 'TBD'}
          </span>
          {team2IsWinner && (
            <span className="text-[10px] text-emerald-400 font-bold shrink-0">✓ Won</span>
          )}
        </div>

        {/* Score */}
        {isCompleted && match.score2 != null && (
          <div className="text-right shrink-0">
            <span className={`text-base font-black font-mono px-2 py-0.5 rounded ${
              team2IsWinner ? 'text-emerald-400 font-black' : 'text-card-title'
            }`}>
              {match.score2}
            </span>
          </div>
        )}
      </div>

      {/* Penalty Shootout Banner */}
      {penaltyText && (
        <div className="pt-1.5 border-t border-surface-border/60 dark:border-navy-800 flex items-center justify-between text-[11px] text-amber-400 px-1 font-semibold">
          <span>Shootout</span>
          <span className="font-mono font-bold bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/30">
            {penaltyText}
          </span>
        </div>
      )}
    </div>
  );
}

export default function TournamentBracket({ lang, isDarkMode, fixturesList }) {
  if (!SHOW_BRACKET) {
    return (
      <div className={`p-6 rounded-2xl border text-center ${
        isDarkMode ? 'bg-navy-800 border-navy-700 text-white' : 'bg-white border-surface-border text-navy-900'
      }`}>
        <Calendar className="w-8 h-8 text-royal dark:text-sky mx-auto mb-2" />
        <p className="text-xs sm:text-sm font-bold">
          {lang === 'ml' 
            ? 'Matches ദിവസേന പ്രഖ്യാപിക്കുന്നതാണ്. ഓരോ match day-ക്കും ശേഷം വീണ്ടും പരിശോധിക്കുക.'
            : 'Fixtures are announced daily. Check back after each match day.'}
        </p>
      </div>
    );
  }

  // In-memory state only (no localStorage per Rule 5)
  // Default opens on round containing next upcoming match (Pre-Quarters)
  const [activeRound, setActiveRound] = useState('pq'); // 'r1' | 'pq' | 'qf' | 'sf' | 'final'
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);

  const bracketData = React.useMemo(() => getBracketData(fixturesList || fixtures), [fixturesList]);

  // Browser back button support for full bracket view (Rule 10)
  useEffect(() => {
    if (!isFullScreenOpen) return;
    window.history.pushState({ fullBracketOpen: true }, '');

    const handlePopState = () => {
      setIsFullScreenOpen(false);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isFullScreenOpen]);

  // Swipe gesture to switch tabs (Rule 5)
  const rounds = ['r1', 'pq', 'qf', 'sf', 'final'];

  const handleTouchStart = (e) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    const currentIndex = rounds.indexOf(activeRound);
    if (diff > 50 && currentIndex < rounds.length - 1) {
      // Swipe left -> next round
      setActiveRound(rounds[currentIndex + 1]);
    } else if (diff < -50 && currentIndex > 0) {
      // Swipe right -> previous round
      setActiveRound(rounds[currentIndex - 1]);
    }
    setTouchStartX(null);
  };

  // Helper to determine team name and decided state
  const getMatchTeamDisplay = (match, teamKey, slotKey) => {
    // If team is already resolved (e.g. winner moved into quarter final)
    const teamVal = match?.[teamKey];
    if (teamVal && typeof teamVal === 'string' && !teamVal.startsWith('Winner Match') && !teamVal.includes('Slot')) {
      return { name: teamVal, isDecided: true };
    }

    // Show team names for confirmed round 1 matches
    if ((match?.confirmed || match?.id === 'm1') && teamVal) {
      return { name: teamVal, isDecided: true };
    }

    // Resolve a knockout slot when its source round match has a confirmed winner.
    const matchWinnerSlot = match?.[slotKey]?.match(/^Winner Match (\d+)$/);
    if (matchWinnerSlot) {
      const sourceMatch = bracketData.round1.find(
        (roundMatch) => roundMatch.matchNum === Number(matchWinnerSlot[1])
      );
      if (sourceMatch?.winner) {
        return { name: sourceMatch.winner, isDecided: true };
      }
    }

    // Keep unplayed knockout paths understandable on small screens.
    const slot = match?.[slotKey];
    return { name: slot || 'Team TBD', isDecided: false };
  };

  return (
    <div 
      className="space-y-4"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 1. Header with Title & Full Bracket Button */}
      <div className="flex items-center justify-between gap-2 border-b border-surface-border dark:border-navy-700 pb-3">
        <div>
          <div className="flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-gold shrink-0" />
            <h3 className="text-base sm:text-lg font-black font-sports uppercase tracking-wider text-card-title leading-[1.3]">
              {lang === 'ml' ? 'Tournament Bracket' : 'TOURNAMENT BRACKET'}
            </h3>
          </div>
          {/* Venue shown once at the top of the page (Rule 12) */}
          <p className="text-xs text-card-muted font-medium mt-0.5 flex items-center gap-1 leading-[1.4]">
            <MapPin className="w-3.5 h-3.5 text-royal dark:text-sky shrink-0" />
            <span>Peruvallur Panjayath Stadium • 9:00 PM IST</span>
          </p>
        </div>

        {/* Full Bracket Modal Button (Rule 10) */}
        <button
          onClick={() => setIsFullScreenOpen(true)}
          className="min-h-[44px] px-3.5 py-2 rounded-xl btn-royal text-white font-bold text-xs uppercase transition active:scale-95 flex items-center gap-1.5 shadow-xs shrink-0"
          aria-label="Open full tree bracket view"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Full Tree</span>
        </button>
      </div>

      {/* 2. Unconfirmed Draw Banner (Data Rule 2) */}
      {!BRACKET_CONFIRMED && (
        <div className="p-2.5 rounded-xl border border-amber-300 dark:border-amber-700/60 bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 flex items-center gap-2 text-xs">
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span className="font-semibold">
            {lang === 'ml' 
              ? 'Fixtures ഉടൻ സ്ഥിരീകരിക്കും • Opening Match മാത്രം നിശ്ചയിച്ചിരിക്കുന്നു'
              : 'Draw to be confirmed • Nov 6 opening match confirmed'}
          </span>
        </div>
      )}

      {/* 3. Sleek Stage Navigation Bar (Unified & Responsive) */}
      <div className="sticky top-14 sm:top-16 z-20 py-2 bg-surface-light/95 dark:bg-navy-900/95 backdrop-blur-md border-b border-surface-border dark:border-navy-800 -mx-3 px-3 sm:mx-0 sm:px-0">
        <div className="grid grid-cols-5 gap-1 sm:gap-2 max-w-md mx-auto">
          {[
            { id: 'r1', step: '1', label: 'Round 1', short: 'R1' },
            { id: 'pq', step: '2', label: 'Pre-QF', short: 'Pre-QF' },
            { id: 'qf', step: '3', label: 'Quarters', short: 'QF' },
            { id: 'sf', step: '4', label: 'Semis', short: 'SF' },
            { id: 'final', step: '5', label: 'Final', short: 'Final', isTrophy: true }
          ].map((tab) => {
            const isActive = activeRound === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveRound(tab.id)}
                className={`min-h-[46px] py-1.5 px-1 rounded-2xl text-center transition flex flex-col items-center justify-center active:scale-95 ${
                  isActive
                    ? 'btn-royal text-white font-black shadow-md ring-2 ring-royal/30'
                    : 'surface-card text-card-muted hover:text-card-title border border-surface-border dark:border-navy-700'
                }`}
                aria-label={`Go to ${tab.label}`}
              >
                <div className="flex items-center gap-1">
                  {tab.isTrophy ? (
                    <Trophy className={`w-3.5 h-3.5 ${isActive ? 'text-gold' : 'text-card-muted'}`} />
                  ) : (
                    <span className={`text-[10px] font-sports font-black ${isActive ? 'text-gold' : 'text-card-muted'}`}>
                      {tab.short}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] sm:text-xs font-sports font-bold leading-tight ${isActive ? 'text-white' : 'text-card-title'}`}>
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.short}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Match Cards Rendered by Active Round (No horizontal page scroll per Rule 4) */}
      <div className="space-y-3 pb-28">
        {/* PRE-QUARTERS (Round of 16) */}
        {activeRound === 'pq' && (
          <div className="space-y-3 animate-fadeIn">
            {bracketData.preQuarters.map((m) => (
              <BracketMatchCard key={m.id} match={m} lang={lang} />
            ))}
          </div>
        )}

        {/* ROUND 1 */}
        {activeRound === 'r1' && (
          <div className="space-y-3 animate-fadeIn">
            {bracketData.round1.map((m) => (
              <BracketMatchCard key={m.id} match={m} isOpening={m.id === 'm1'} lang={lang} />
            ))}
          </div>
        )}

        {/* QUARTERS */}
        {activeRound === 'qf' && (
          <div className="space-y-3 animate-fadeIn">
            {bracketData.quarterFinals.map((qf) => (
              <BracketMatchCard key={qf.id} match={qf} lang={lang} />
            ))}
          </div>
        )}

        {/* SEMIS */}
        {activeRound === 'sf' && (
          <div className="space-y-3 animate-fadeIn">
            {bracketData.semiFinals.map((sf) => (
              <BracketMatchCard key={sf.id} match={sf} lang={lang} />
            ))}
          </div>
        )}

        {/* FINAL (Rule 9: Larger, Gold border, Trophy icon, Rolling Trophy label) */}
        {activeRound === 'final' && (
          <div className="animate-fadeIn">
            <div className="p-4 sm:p-6 rounded-3xl border-2 border-gold surface-navy-card text-white shadow-2xl space-y-4">
              {/* Header with Trophy Icon and Name (Rule 9) */}
              <div className="flex items-center justify-between pb-3 border-b border-navy-700">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl btn-gold text-navy-900 flex items-center justify-center font-black shadow-xs">
                    <Trophy className="w-5 h-5 text-navy-900" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-gold block">
                      ★ GRAND FINALE • DEC 06
                    </span>
                    <h4 className="text-base sm:text-lg font-black font-sports text-white uppercase leading-tight">
                      {bracketData.grandFinal.trophy}
                    </h4>
                  </div>
                </div>
                <span className="text-xs font-mono text-gold font-bold">
                  9:00 PM IST
                </span>
              </div>

              {/* Finalists Slots */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-navy-900/90 border border-navy-700">
                  <div className="w-10 h-10 rounded-full border-2 border-dashed border-navy-600 text-gold flex items-center justify-center font-bold text-sm shrink-0">
                    ?
                  </div>
                  <span className="text-sm font-sports font-bold text-white line-clamp-1">
                    {bracketData.grandFinal.team1Slot}
                  </span>
                </div>

                <div className="text-center font-sports font-black text-xs text-gold uppercase tracking-widest">
                  VS
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-navy-900/90 border border-navy-700">
                  <div className="w-10 h-10 rounded-full border-2 border-dashed border-navy-600 text-gold flex items-center justify-center font-bold text-sm shrink-0">
                    ?
                  </div>
                  <span className="text-sm font-sports font-bold text-white line-clamp-1">
                    {bracketData.grandFinal.team2Slot}
                  </span>
                </div>
              </div>

              <div className="pt-2 text-center text-xs text-navy-muted font-medium">
                📍 {bracketData.grandFinal.venue}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 6. Fullscreen Bracket Tree Modal (Rule 10: Pan/Scrollable tree with connector lines, rotate hint, close button) */}
      {isFullScreenOpen && (
        <div 
          onClick={() => setIsFullScreenOpen(false)}
          className="fixed inset-0 z-[70] flex flex-col bg-navy-950/98 text-white animate-fadeIn"
        >
          {/* Top Bar */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="p-3 sm:p-4 bg-navy-900 border-b border-navy-800 flex items-center justify-between shrink-0"
          >
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-gold" />
              <div>
                <h4 className="font-sports font-black text-sm uppercase tracking-wider text-white">
                  {lang === 'ml' ? 'Full Knockout Bracket' : 'FULL TOURNAMENT BRACKET'}
                </h4>
                <p className="text-[10px] text-navy-muted">
                  Round 1 → Quarters → Semis → Final
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Rotation Hint Banner */}
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-navy-800 border border-navy-700 text-[10px] text-gold font-bold">
                <RotateCw className="w-3 h-3" />
                <span>Rotate phone for wide view</span>
              </span>
              <button
                onClick={() => {
                  if (window.history.state?.fullBracketOpen) {
                    window.history.back();
                  } else {
                    setIsFullScreenOpen(false);
                  }
                }}
                className="w-11 h-11 rounded-xl bg-navy-800 hover:bg-navy-700 text-white flex items-center justify-center transition active:scale-95"
                aria-label="Close full bracket tree"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable / Pinch-to-zoom Container with Tree and Connectors */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="flex-1 overflow-auto p-4 sm:p-8"
          >
            <div className="min-w-[840px] grid grid-cols-4 gap-6 items-center py-4">
              {/* Col 1: Round 1 */}
              <div className="space-y-4">
                <span className="text-xs font-bold text-gold uppercase tracking-wider block text-center pb-1 border-b border-navy-800">
                  {lang === 'ml' 
                    ? `Round 1 (Confirmed ${bracketData.round1.length} Matches)`
                    : `Round 1 (Confirmed ${bracketData.round1.length} Matches)`}
                </span>
                {bracketData.round1.map((m) => (
                  <div key={m.id} className="p-2.5 rounded-xl bg-navy-900 border border-navy-700 text-xs space-y-1">
                    <div className="text-[10px] text-gold font-bold">{m.date} • Match {m.matchNum}</div>
                    <div className="font-bold truncate text-white">{m.team1}</div>
                    <div className="font-bold truncate text-white">{m.team2}</div>
                  </div>
                ))}
                {bracketData.round1.length < 8 && (
                  <div className="p-2.5 rounded-xl bg-navy-900/60 border border-dashed border-navy-700 text-center">
                    <span className="text-[10px] text-navy-muted font-bold block">
                      {lang === 'ml' ? 'ബാക്കി Matches ഉടൻ പ്രഖ്യാപിക്കും' : 'Remaining Matches TBA'}
                    </span>
                  </div>
                )}
              </div>

              {/* Col 2: Quarters */}
              <div className="space-y-8">
                <span className="text-xs font-bold text-sky uppercase tracking-wider block text-center pb-1 border-b border-navy-800">
                  Quarter Finals
                </span>
                {bracketData.quarterFinals.map((qf) => {
                  const team1 = getMatchTeamDisplay(qf, 'team1', 'team1Slot');
                  const team2 = getMatchTeamDisplay(qf, 'team2', 'team2Slot');
                  return (
                    <div key={qf.id} className="p-3 rounded-xl bg-navy-900 border border-navy-700 text-xs space-y-1">
                      <div className="text-[10px] text-sky font-bold">{qf.matchNum} • {qf.date}</div>
                      <div className={`${team1.isDecided ? 'text-white' : 'text-navy-muted'} truncate`}>{team1.name}</div>
                      <div className={`${team2.isDecided ? 'text-white' : 'text-navy-muted'} truncate`}>{team2.name}</div>
                    </div>
                  );
                })}
              </div>

              {/* Col 3: Semis */}
              <div className="space-y-16">
                <span className="text-xs font-bold text-royal dark:text-sky uppercase tracking-wider block text-center pb-1 border-b border-navy-800">
                  Semi Finals
                </span>
                {bracketData.semiFinals.map((sf) => (
                  <div key={sf.id} className="p-3.5 rounded-xl bg-navy-900 border border-navy-700 text-xs space-y-1.5">
                    <div className="text-[10px] text-royal dark:text-sky font-black">{sf.matchNum} • {sf.date}</div>
                    <div className="text-navy-muted truncate">{sf.team1Slot}</div>
                    <div className="text-navy-muted truncate">{sf.team2Slot}</div>
                  </div>
                ))}
              </div>

              {/* Col 4: Final */}
              <div className="space-y-6">
                <span className="text-xs font-bold text-gold uppercase tracking-wider block text-center pb-1 border-b border-navy-800">
                  Grand Finale
                </span>
                <div className="p-4 rounded-2xl bg-gradient-to-r from-navy-800 to-navy-900 border-2 border-gold text-white text-xs space-y-2 shadow-xl">
                  <div className="text-[10px] text-gold font-black uppercase">🏆 DEC 06 • 8:45 PM</div>
                  <div className="font-sports font-black text-sm text-gold">{bracketData.grandFinal.trophy}</div>
                  <div className="text-navy-muted truncate">{bracketData.grandFinal.team1Slot}</div>
                  <div className="text-gold font-bold text-center">VS</div>
                  <div className="text-navy-muted truncate">{bracketData.grandFinal.team2Slot}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
