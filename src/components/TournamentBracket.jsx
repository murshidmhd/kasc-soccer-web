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

// Drive round 1 from shared tournamentData.js fixtures (Task 4, Rule 17)
export const BRACKET_DATA = {
  round1: fixtures.slice(0, 8).map((f, i) => ({
    id: f.id,
    matchNum: i + 1,
    date: f.date,
    time: f.time,
    team1: f.team1,
    team2: f.team2,
    status: f.id === 'm1' ? 'Opening Match' : 'Upcoming',
    winner: null,
    qfSlot: `qf${Math.floor(i / 2) + 1}`,
    confirmed: f.confirmed
  })),
  quarterFinals: [
    { id: 'qf1', matchNum: 'QF 1', date: '20 Nov', time: '8:45 PM', team1Slot: 'Winner Match 1', team2Slot: 'Winner Match 2', status: 'Quarter Final', winner: null, sfSlot: 'sf1' },
    { id: 'qf2', matchNum: 'QF 2', date: '22 Nov', time: '8:45 PM', team1Slot: 'Winner Match 3', team2Slot: 'Winner Match 4', status: 'Quarter Final', winner: null, sfSlot: 'sf1' },
    { id: 'qf3', matchNum: 'QF 3', date: '24 Nov', time: '8:45 PM', team1Slot: 'Winner Match 5', team2Slot: 'Winner Match 6', status: 'Quarter Final', winner: null, sfSlot: 'sf2' },
    { id: 'qf4', matchNum: 'QF 4', date: '26 Nov', time: '8:45 PM', team1Slot: 'Winner Match 7', team2Slot: 'Winner Match 8', status: 'Quarter Final', winner: null, sfSlot: 'sf2' }
  ],
  semiFinals: [
    { id: 'sf1', matchNum: 'SF 1', date: '30 Nov', time: '8:45 PM', team1Slot: 'Winner QF 1', team2Slot: 'Winner QF 2', status: 'Semi Final', winner: null, finalSlot: 'final' },
    { id: 'sf2', matchNum: 'SF 2', date: '02 Dec', time: '8:45 PM', team1Slot: 'Winner QF 3', team2Slot: 'Winner QF 4', status: 'Semi Final', winner: null, finalSlot: 'final' }
  ],
  grandFinal: {
    id: 'final',
    matchNum: 'FINAL',
    date: '06 Dec 2026 • 8:45 PM',
    venue: 'Peruvallur Panjayath Stadium',
    team1Slot: 'Winner Semi Final 1',
    team2Slot: 'Winner Semi Final 2',
    trophy: 'Rolling Trophy',
    trophyFull: 'Season 7 Champions Rolling Trophy'
  }
};

// Data Rule 1: Single helper function accessing bracket data
export const getBracketData = () => {
  return BRACKET_DATA;
};

export default function TournamentBracket({ lang, isDarkMode }) {
  if (!SHOW_BRACKET) {
    return (
      <div className={`p-6 rounded-2xl border text-center ${
        isDarkMode ? 'bg-navy-800 border-navy-700 text-white' : 'bg-white border-surface-border text-navy-900'
      }`}>
        <Calendar className="w-8 h-8 text-royal dark:text-sky mx-auto mb-2" />
        <p className="text-xs sm:text-sm font-bold">
          {lang === 'ml' 
            ? 'മത്സരങ്ങൾ ദിവസേന പ്രഖ്യാപിക്കുന്നതാണ്. ഓരോ മത്സര ദിവസത്തിനും ശേഷം വീണ്ടും പരിശോധിക്കുക.' 
            : 'Fixtures are announced daily. Check back after each match day.'}
        </p>
      </div>
    );
  }

  // In-memory state only (no localStorage per Rule 5)
  // Default opens on round containing next upcoming match (Round 1)
  const [activeRound, setActiveRound] = useState('r1'); // 'r1' | 'qf' | 'sf' | 'final'
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);

  const bracketData = getBracketData();

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
  const rounds = ['r1', 'qf', 'sf', 'final'];

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
    // Show team names ONLY for Nov 6 opening match (m1 / confirmed)
    if (match?.confirmed || match?.id === 'm1') {
      return { name: match[teamKey], isDecided: true };
    }

    // For all other slots, show "?" per user specification
    return { name: '?', isDecided: false };
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
              {lang === 'ml' ? 'ഫിക്സ്ചർ ട്രീ (Fixture Tree)' : 'TOURNAMENT BRACKET'}
            </h3>
          </div>
          {/* Venue shown once at the top of the page (Rule 12) */}
          <p className="text-xs text-card-muted font-medium mt-0.5 flex items-center gap-1 leading-[1.4]">
            <MapPin className="w-3.5 h-3.5 text-royal dark:text-sky shrink-0" />
            <span>Peruvallur Panjayath Stadium • 8:45 PM IST</span>
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
              ? 'ഫിക്സ്ചർ ഉടൻ സ്ഥിരീകരിക്കും • ഉദ്ഘാടന മത്സരം മാത്രം നിശ്ചയിച്ചിരിക്കുന്നു' 
              : 'Draw to be confirmed • Nov 6 opening match confirmed'}
          </span>
        </div>
      )}

      {/* 3. Road to the Final Strip (Rule 6: 4 nodes + trophy connected by thin line) */}
      <div className="py-2 px-1">
        <div className="relative flex items-center justify-between max-w-md mx-auto">
          {/* Connecting line */}
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-surface-border dark:bg-navy-700 z-0" />

          {/* Nodes */}
          {[
            { id: 'r1', label: 'R1', num: 'Round 1' },
            { id: 'qf', label: 'QF', num: 'Quarters' },
            { id: 'sf', label: 'SF', num: 'Semis' },
            { id: 'final', label: 'Final', isTrophy: true }
          ].map((node, i) => {
            const isActive = activeRound === node.id;
            const currentIndex = rounds.indexOf(activeRound);
            const isCompleted = rounds.indexOf(node.id) < currentIndex;

            return (
              <button
                key={node.id}
                onClick={() => setActiveRound(node.id)}
                className={`relative z-10 flex flex-col items-center group transition active:scale-95 focus:outline-hidden min-h-[44px] justify-center px-1`}
                aria-label={`Go to ${node.num || 'Final'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-sports text-xs font-black transition-all ${
                  isActive 
                    ? 'btn-gold text-navy-900 ring-4 ring-gold/30 scale-110 shadow-xs' 
                    : isCompleted
                      ? 'btn-royal text-white'
                      : 'bg-white dark:bg-navy-800 border border-surface-border dark:border-navy-700 text-card-muted group-hover:text-card-title'
                }`}>
                  {node.isTrophy ? <Trophy className="w-3.5 h-3.5" /> : node.label}
                </div>
                <span className={`text-[10px] font-sports font-bold mt-1 tracking-wider uppercase transition-colors ${
                  isActive ? 'text-gold font-black' : 'text-card-muted'
                }`}>
                  {node.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Round Tabs (Rule 5: Sticky below header, swipe left/right to change) */}
      <div className="sticky top-14 sm:top-16 z-20 py-1.5 bg-surface-light dark:bg-navy-900 border-b border-surface-border dark:border-navy-800 -mx-3 px-3 sm:mx-0 sm:px-0">
        <div className="grid grid-cols-4 gap-1.5 max-w-md mx-auto">
          {[
            { id: 'r1', label: lang === 'ml' ? 'റൗണ്ട് 1' : 'Round 1' },
            { id: 'qf', label: lang === 'ml' ? 'ക്വാർട്ടേഴ്സ്' : 'Quarters' },
            { id: 'sf', label: lang === 'ml' ? 'സെമി' : 'Semis' },
            { id: 'final', label: lang === 'ml' ? 'ഫൈനൽ' : 'Final' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveRound(tab.id)}
              className={`min-h-[44px] py-2 px-1 rounded-xl text-xs font-bold transition flex items-center justify-center active:scale-95 ${
                activeRound === tab.id
                  ? 'btn-royal text-white font-black shadow-xs'
                  : 'surface-card text-card-title border border-surface-border dark:border-navy-700'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 5. Match Cards Rendered by Active Round (No horizontal page scroll per Rule 4) */}
      <div className="space-y-3 pb-8">
        {/* ROUND 1 */}
        {activeRound === 'r1' && (
          <div className="space-y-3 animate-fadeIn">
            {bracketData.round1.map((m) => {
              const team1 = getMatchTeamDisplay(m, 'team1', 'team1Slot');
              const team2 = getMatchTeamDisplay(m, 'team2', 'team2Slot');
              const isOpening = m.id === 'm1';

              return (
                <div
                  key={m.id}
                  className={`p-3.5 rounded-2xl border surface-card shadow-card space-y-3 ${
                    isOpening ? 'border-gold/80 ring-1 ring-gold/30' : 'border-surface-border dark:border-navy-700'
                  }`}
                >
                  {/* Header Row: Match number, Date & Kickoff Time (Rule 7) */}
                  <div className="flex items-center justify-between text-xs font-semibold pb-2 border-b border-surface-border dark:border-navy-700 text-card-muted">
                    <span className="font-sports font-black uppercase text-card-title">
                      Match {m.matchNum}
                    </span>
                    <span className="font-mono">
                      {m.date} • {m.time}
                    </span>
                  </div>

                  {/* Team 1 Row */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {team1.isDecided ? (
                        <div className="w-10 h-10 rounded-full bg-white p-1 border border-surface-border dark:border-navy-700 shadow-2xs flex items-center justify-center shrink-0">
                          <TeamLogo teamName={team1.name} className="w-full h-full rounded-full object-contain" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full border-2 border-dashed border-card-muted text-card-muted flex items-center justify-center font-bold text-sm shrink-0">
                          ?
                        </div>
                      )}
                      <span className={`text-xs sm:text-sm font-sports line-clamp-2 leading-tight ${
                        team1.isDecided ? 'font-bold text-card-title' : 'text-card-muted font-medium'
                      }`}>
                        {team1.name}
                      </span>
                    </div>
                  </div>

                  {/* Team 2 Row */}
                  <div className="flex items-center justify-between gap-3 pt-1 border-t border-surface-border/50 dark:border-navy-800">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {team2.isDecided ? (
                        <div className="w-10 h-10 rounded-full bg-white p-1 border border-surface-border dark:border-navy-700 shadow-2xs flex items-center justify-center shrink-0">
                          <TeamLogo teamName={team2.name} className="w-full h-full rounded-full object-contain" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full border-2 border-dashed border-card-muted text-card-muted flex items-center justify-center font-bold text-sm shrink-0">
                          ?
                        </div>
                      )}
                      <span className={`text-xs sm:text-sm font-sports line-clamp-2 leading-tight ${
                        team2.isDecided ? 'font-bold text-card-title' : 'text-card-muted font-medium'
                      }`}>
                        {team2.name}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* QUARTERS */}
        {activeRound === 'qf' && (
          <div className="space-y-3 animate-fadeIn">
            {bracketData.quarterFinals.map((qf) => {
              const team1 = getMatchTeamDisplay(qf, 'team1', 'team1Slot');
              const team2 = getMatchTeamDisplay(qf, 'team2', 'team2Slot');

              return (
                <div
                  key={qf.id}
                  className="p-3.5 rounded-2xl border border-surface-border dark:border-navy-700 surface-card shadow-card space-y-3"
                >
                  <div className="flex items-center justify-between text-xs font-semibold pb-2 border-b border-surface-border dark:border-navy-700 text-card-muted">
                    <span className="font-sports font-black uppercase text-card-title">
                      {qf.matchNum}
                    </span>
                    <span className="font-mono">
                      {qf.date} • {qf.time}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-full border-2 border-dashed border-card-muted text-card-muted flex items-center justify-center font-bold text-sm shrink-0">
                        ?
                      </div>
                      <span className="text-xs sm:text-sm font-sports line-clamp-2 leading-tight text-card-muted font-medium">
                        {team1.name}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-1 border-t border-surface-border/50 dark:border-navy-800">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-full border-2 border-dashed border-card-muted text-card-muted flex items-center justify-center font-bold text-sm shrink-0">
                        ?
                      </div>
                      <span className="text-xs sm:text-sm font-sports line-clamp-2 leading-tight text-card-muted font-medium">
                        {team2.name}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* SEMIS */}
        {activeRound === 'sf' && (
          <div className="space-y-3 animate-fadeIn">
            {bracketData.semiFinals.map((sf) => {
              const team1 = getMatchTeamDisplay(sf, 'team1', 'team1Slot');
              const team2 = getMatchTeamDisplay(sf, 'team2', 'team2Slot');

              return (
                <div
                  key={sf.id}
                  className="p-3.5 rounded-2xl border border-surface-border dark:border-navy-700 surface-card shadow-card space-y-3"
                >
                  <div className="flex items-center justify-between text-xs font-semibold pb-2 border-b border-surface-border dark:border-navy-700 text-card-muted">
                    <span className="font-sports font-black uppercase text-card-title">
                      {sf.matchNum}
                    </span>
                    <span className="font-mono">
                      {sf.date} • {sf.time}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-full border-2 border-dashed border-card-muted text-card-muted flex items-center justify-center font-bold text-sm shrink-0">
                        ?
                      </div>
                      <span className="text-xs sm:text-sm font-sports line-clamp-2 leading-tight text-card-muted font-medium">
                        {team1.name}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-1 border-t border-surface-border/50 dark:border-navy-800">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-full border-2 border-dashed border-card-muted text-card-muted flex items-center justify-center font-bold text-sm shrink-0">
                        ?
                      </div>
                      <span className="text-xs sm:text-sm font-sports line-clamp-2 leading-tight text-card-muted font-medium">
                        {team2.name}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
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
                  8:45 PM IST
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
                  {lang === 'ml' ? 'പൂർണ്ണ നോക്കൗട്ട് ട്രീ' : 'FULL TOURNAMENT TREE'}
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
                  Round 1 (8 Matches)
                </span>
                {bracketData.round1.map((m) => (
                  <div key={m.id} className="p-2.5 rounded-xl bg-navy-900 border border-navy-700 text-xs space-y-1">
                    <div className="text-[10px] text-gold font-bold">{m.date} • Match {m.matchNum}</div>
                    <div className="font-bold truncate text-white">{m.team1}</div>
                    <div className="font-bold truncate text-white">{m.team2}</div>
                  </div>
                ))}
              </div>

              {/* Col 2: Quarters */}
              <div className="space-y-8">
                <span className="text-xs font-bold text-sky uppercase tracking-wider block text-center pb-1 border-b border-navy-800">
                  Quarter Finals
                </span>
                {bracketData.quarterFinals.map((qf) => (
                  <div key={qf.id} className="p-3 rounded-xl bg-navy-900 border border-navy-700 text-xs space-y-1">
                    <div className="text-[10px] text-sky font-bold">{qf.matchNum} • {qf.date}</div>
                    <div className="text-navy-muted truncate">{qf.team1Slot}</div>
                    <div className="text-navy-muted truncate">{qf.team2Slot}</div>
                  </div>
                ))}
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
                  <div className="text-[10px] text-gold font-black uppercase">🏆 DEC 06 • 8 PM</div>
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
