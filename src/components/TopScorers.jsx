import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  Award, 
  Sparkles, 
  ShieldCheck, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Flame, 
  Goal, 
  ShieldAlert, 
  Info,
  Calendar,
  Medal,
  Users
} from 'lucide-react';
import trophyImg from '../assets/tournament_trophy.jpg';
import TeamLogo from './TeamLogo';
import { fixtures, tournamentInfo, participatingTeams } from '../data/tournamentData';
import { squadPlayers, squadClubs, clubSquadStatus } from '../data/squad';
import { getStoredMatchState } from '../utils/matchStateManager';
import { calculateTournamentStats } from '../utils/statsCalculator';
import { 
  TROPHY_IS_ILLUSTRATION, 
  SHOW_NATIONALITY, 
  AWARDS_NOTE 
} from '../config/siteConfig';

export default function TopScorers({ lang, isDarkMode }) {
  const [matchState] = useState(getStoredMatchState);
  const [showTopTen, setShowTopTen] = useState(false);
  const [playerSearchQuery, setPlayerSearchQuery] = useState('');
  const [selectedClubFilter, setSelectedClubFilter] = useState('All');

  // Compute all tournament stats once and memoize so ticker doesn't recompute (Confirmed matches only - Task 4, Rule 15)
  const stats = useMemo(() => {
    return calculateTournamentStats([], fixtures.filter((m) => m.confirmed), matchState);
  }, [matchState]);

  // Check if a final match is finished to display the tournament champion
  const finalMatch = useMemo(() => {
    return stats.finishedMatches?.find((m) => {
      const stage = (m.stage || '').toLowerCase();
      return stage.includes('final') && !stage.includes('quarter') && !stage.includes('semi');
    });
  }, [stats.finishedMatches]);

  const championTeam = useMemo(() => {
    if (!finalMatch || typeof finalMatch.score1 !== 'number' || typeof finalMatch.score2 !== 'number') {
      return null;
    }
    return finalMatch.score1 > finalMatch.score2 ? finalMatch.team1 : finalMatch.team2;
  }, [finalMatch]);

  // Filtered confirmed squad players for "All Players" section (Rule 9f)
  const isClubConfirmed = selectedClubFilter === 'All' || clubSquadStatus[selectedClubFilter] === 'confirmed';

  const visiblePlayers = useMemo(() => {
    if (!isClubConfirmed) return [];

    return squadPlayers.filter((p) => {
      const isConfirmedClub = clubSquadStatus[p.club] === 'confirmed';
      if (!isConfirmedClub) return false;

      const matchesClub = selectedClubFilter === 'All' || p.club === selectedClubFilter;
      if (!matchesClub) return false;

      if (!playerSearchQuery.trim()) return true;

      const query = playerSearchQuery.toLowerCase().trim();
      const nameEn = (p.name || '').toLowerCase();
      const nameMl = (p.nameMl || '').toLowerCase();
      const num = String(p.number || '');
      const club = (p.club || '').toLowerCase();

      return nameEn.includes(query) || nameMl.includes(query) || num.includes(query) || club.includes(query);
    });
  }, [selectedClubFilter, isClubConfirmed, playerSearchQuery]);

  const topScorerLeader = stats.rankedScorers[0] || null;
  const subsequentScorers = showTopTen ? stats.rankedScorers.slice(1, 10) : stats.rankedScorers.slice(1, 5);

  return (
    <div className="space-y-6 pb-28 max-w-5xl mx-auto select-none">
      {/* 1. Trophy Showcase & Tournament Status Banner */}
      <section className="rounded-3xl p-5 sm:p-7 border border-surface-border dark:border-navy-700 surface-card shadow-card">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Trophy Image Card */}
          <div className="md:col-span-4 flex flex-col items-center text-center space-y-3">
            <div className="relative rounded-2xl overflow-hidden border border-surface-border dark:border-navy-700 shadow-md max-w-[240px] w-full surface-light">
              <img
                src={trophyImg}
                alt="All India Sevens Championship Trophy"
                width="240"
                height="240"
                loading="lazy"
                className="w-full h-auto object-cover"
              />
              {/* Illustration Badge (Rule 2) */}
              {TROPHY_IS_ILLUSTRATION && (
                <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-navy-950/85 text-[10px] font-bold text-amber-300 border border-white/20 shadow-xs flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                  <span>{lang === 'ml' ? 'ചിത്രീകരണ മാതൃക' : 'Illustration'}</span>
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-black font-sports uppercase tracking-wider text-card-title">
                {lang === 'ml' ? 'അഖിലേന്ത്യാ സെവൻസ് ട്രോഫി' : 'ALL INDIA SEVENS TROPHY'}
              </h3>
              {/* Rule 2: Show "Season 7 Trophy" unless Final is finished in real data */}
              <p className="text-xs font-bold text-royal dark:text-sky">
                {championTeam
                  ? (lang === 'ml' ? `വിജയികൾ: ${championTeam}` : `Champions: ${championTeam}`)
                  : (lang === 'ml' ? 'സീസൺ 7 ട്രോഫി' : 'Season 7 Trophy')}
              </p>
            </div>
          </div>

          {/* Tournament Overview & Explainer */}
          <div className="md:col-span-8 space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-royal text-white text-[11px] font-bold uppercase tracking-wider mb-2">
                <Trophy className="w-3.5 h-3.5" />
                <span>{tournamentInfo.season || 'SEASON 7'}</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black font-sports uppercase tracking-wide text-card-title leading-tight">
                {lang === 'ml' ? 'ടൂർണ്ണമെന്റ് സ്ഥിതിവിവരക്കണക്കുകൾ' : 'OFFICIAL TOURNAMENT STATS'}
              </h2>
              <p className="text-xs text-card-muted font-medium mt-1 leading-relaxed">
                {lang === 'ml'
                  ? 'പെരുവള്ളൂർ പഞ്ചായത്ത് സ്റ്റേഡിയത്തിൽ നടക്കുന്ന മത്സരങ്ങളിൽ നിന്നുള്ള ഔദ്യോഗിക കണക്കുകൾ. റഫറി സ്കോർ കാർഡുകളിൽ നിന്ന് തത്സമയം കണക്കാക്കുന്നു.'
                  : 'Official real-time statistics derived strictly from logged referee match events under the floodlights at Peruvallur Stadium.'}
              </p>
            </div>

            {/* Rule 9a: Tournament Numbers (Row of 4 Small Stat Tiles) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              {/* Matches Finished */}
              <div className="p-3 rounded-2xl surface-light border border-surface-border dark:border-navy-700 text-center space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-card-muted block">
                  {lang === 'ml' ? 'മത്സരങ്ങൾ' : 'Matches'}
                </span>
                <span className="text-2xl font-black font-sports text-card-title">
                  {stats.matchesCount}
                </span>
              </div>

              {/* Total Goals */}
              <div className="p-3 rounded-2xl surface-light border border-surface-border dark:border-navy-700 text-center space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-card-muted block">
                  {lang === 'ml' ? 'ഗോളുകൾ' : 'Goals'}
                </span>
                <span className="text-2xl font-black font-sports text-royal dark:text-sky">
                  {stats.totalGoals}
                </span>
              </div>

              {/* Average per Match */}
              <div className="p-3 rounded-2xl surface-light border border-surface-border dark:border-navy-700 text-center space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-card-muted block">
                  {lang === 'ml' ? 'ശരാശരി' : 'Avg / Match'}
                </span>
                <span className="text-2xl font-black font-sports text-card-title">
                  {stats.avgGoals}
                </span>
              </div>

              {/* Clean Sheets */}
              <div className="p-3 rounded-2xl surface-light border border-surface-border dark:border-navy-700 text-center space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-card-muted block">
                  {lang === 'ml' ? 'ക്ലീൻ ഷീറ്റ്' : 'Clean Sheets'}
                </span>
                <span className="text-2xl font-black font-sports text-emerald-600 dark:text-emerald-400">
                  {stats.totalCleanSheets}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Golden Boot Race (Rule 9b & Rules 3, 4, 5, 8) */}
      <section className="rounded-3xl p-5 sm:p-7 border border-surface-border dark:border-navy-700 surface-card shadow-card space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border dark:border-navy-700 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs shrink-0">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black font-sports uppercase tracking-wider text-card-title">
                {lang === 'ml' ? 'ഗോൾഡൻ ബൂട്ട് ലീഡർബോർഡ്' : 'GOLDEN BOOT RACE'}
              </h3>
              {/* Rule 3: Replaced "Live Tracking" with "Updated after each match" */}
              <p className="text-xs text-amber-600 dark:text-amber-400 font-bold">
                {lang === 'ml' ? 'ഓരോ മത്സരശേഷവും അപ്ഡേറ്റ് ചെയ്യുന്നു' : 'Updated after each match'}
              </p>
            </div>
          </div>

          <span className="self-start sm:self-auto text-[11px] font-bold text-card-muted">
            {lang === 'ml' ? 'ടൈ-ബ്രേക്കർ: കൂടുതൽ ഗോളുകൾ, കുറഞ്ഞ മത്സരങ്ങൾ' : 'Tie-break: Goals → Fewer matches → Earlier goal'}
          </span>
        </div>

        {/* Rule 5: If no match has a goal yet, show calm empty state */}
        {stats.rankedScorers.length === 0 ? (
          <div className="py-10 px-4 rounded-2xl surface-light border border-dashed border-surface-border dark:border-navy-700 text-center space-y-2">
            <Goal className="w-8 h-8 text-royal dark:text-sky mx-auto opacity-70 animate-pulse" />
            <h4 className="text-sm font-bold text-card-title">
              {lang === 'ml' ? 'ആദ്യ ഗോളിന് ശേഷം സ്റ്റാറ്റിസ്റ്റിക്സ് ആരംഭിക്കും' : 'Stats start after the first goal'}
            </h4>
            <p className="text-xs text-card-muted max-w-sm mx-auto">
              {lang === 'ml'
                ? 'ഉദ്ഘാടന മത്സരത്തിൽ ആദ്യ ഗോൾ പിറക്കുന്നതോടെ ലീഡർബോർഡ് യാന്ത്രികമായി സജീവമാകും.'
                : 'The official Golden Boot race will populate immediately after the opening goal is logged.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Leader Card (Rank 1) */}
            {topScorerLeader && (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 font-black font-sports text-xl flex items-center justify-center shrink-0 shadow-sm">
                    #{topScorerLeader.rank}
                  </div>
                  {/* Club Logo in 40px White Circle (Rule 12) */}
                  <div className="w-10 h-10 rounded-full bg-white p-0.5 border border-slate-200 shadow-xs flex items-center justify-center shrink-0">
                    <TeamLogo teamName={topScorerLeader.team} className="w-full h-full object-contain" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base sm:text-lg font-black font-sports text-card-title truncate">
                        {topScorerLeader.name}
                      </h4>
                      <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-black uppercase shrink-0">
                        Leader
                      </span>
                    </div>
                    <p className="text-xs text-card-muted truncate font-medium">
                      {topScorerLeader.team}
                    </p>
                    <span className="text-[10px] text-card-muted block mt-0.5">
                      {topScorerLeader.matchesPlayed} {topScorerLeader.matchesPlayed === 1 ? 'match' : 'matches'} • First goal: {topScorerLeader.firstGoalMinute}'
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-3xl sm:text-4xl font-black font-sports text-amber-500 block leading-none">
                    {topScorerLeader.goals}
                  </span>
                  <span className="text-[10px] font-bold text-card-muted uppercase">
                    {topScorerLeader.goals === 1 ? 'Goal' : 'Goals'}
                  </span>
                </div>
              </div>
            )}

            {/* Subsequent Scorers (Ranks 2 to 5 or Top 10) */}
            {subsequentScorers.length > 0 && (
              <div className="space-y-2">
                {subsequentScorers.map((scorer) => (
                  <div
                    key={`${scorer.name}-${scorer.team}`}
                    className="p-3 sm:p-3.5 rounded-xl surface-light border border-surface-border dark:border-navy-700 flex items-center justify-between gap-3 text-xs sm:text-sm"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-7 h-7 rounded-lg bg-surface-card text-card-title border border-surface-border dark:border-navy-700 font-bold font-sports flex items-center justify-center shrink-0 text-xs">
                        #{scorer.rank}
                      </span>
                      {/* Logo in 32px White Circle (Rule 12) */}
                      <div className="w-8 h-8 rounded-full bg-white p-0.5 border border-slate-200 shadow-2xs flex items-center justify-center shrink-0">
                        <TeamLogo teamName={scorer.team} className="w-full h-full object-contain" />
                      </div>
                      <div className="min-w-0">
                        <h5 className="font-bold text-card-title truncate">
                          {scorer.name}
                        </h5>
                        <p className="text-[11px] text-card-muted truncate font-medium">
                          {scorer.team} • {scorer.matchesPlayed}M
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 font-sports font-black text-amber-500 text-lg sm:text-xl">
                      {scorer.goals}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* See Top 10 Expander Toggle (Rule 9b) */}
            {stats.rankedScorers.length > 5 && (
              <div className="pt-2 text-center">
                <button
                  onClick={() => setShowTopTen(!showTopTen)}
                  className="min-h-[44px] px-4 py-2 rounded-xl surface-light hover:bg-surface-border dark:hover:bg-navy-800 text-card-title text-xs font-bold border border-surface-border dark:border-navy-700 inline-flex items-center gap-1.5 transition active:scale-95"
                >
                  <span>{showTopTen ? (lang === 'ml' ? 'കുറച്ച് കാണിക്കുക' : 'Show Top 5') : (lang === 'ml' ? 'ടോപ്പ് 10 കാണുക' : 'See Top 10')}</span>
                  {showTopTen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* 3. Golden Glove (Starting Goalkeepers Only) (Rule 9c) */}
      <section className="rounded-3xl p-5 sm:p-7 border border-surface-border dark:border-navy-700 surface-card shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-border dark:border-navy-700 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-xl bg-emerald-600 text-white shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-black font-sports uppercase tracking-wider text-card-title">
                {lang === 'ml' ? 'ഗോൾഡൻ ഗ്ലോവ് (ക്ലീൻ ഷീറ്റ്)' : 'GOLDEN GLOVE RACE'}
              </h3>
              <p className="text-[11px] text-card-muted font-bold">
                {lang === 'ml' ? 'സ്റ്റാർട്ടിംഗ് ഗോൾകീപ്പർമാരുടെ അടിസ്ഥാനത്തിൽ' : 'Based on starting goalkeepers'}
              </p>
            </div>
          </div>
        </div>

        {stats.rankedGoalkeepers.length === 0 ? (
          <div className="py-6 px-4 rounded-2xl surface-light border border-dashed border-surface-border dark:border-navy-700 text-center">
            <p className="text-xs text-card-muted font-medium">
              {lang === 'ml'
                ? 'പൂർത്തിയായ മത്സരങ്ങൾക്ക് ശേഷം ക്ലീൻ ഷീറ്റ് കണക്കുകൾ രേഖപ്പെടുത്തും.'
                : 'Clean sheet records activate after finished matches.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {stats.rankedGoalkeepers.slice(0, 3).map((gk, idx) => (
              <div 
                key={gk.name} 
                className="p-3.5 rounded-2xl surface-light border border-surface-border dark:border-navy-700 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold font-sports text-xs flex items-center justify-center shrink-0">
                    #{idx + 1}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white p-0.5 border border-slate-200 shrink-0">
                    <TeamLogo teamName={gk.club} className="w-full h-full object-contain" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="font-bold text-card-title text-xs truncate">{gk.name}</h5>
                    <p className="text-[10px] text-card-muted truncate">{gk.club}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-lg font-black font-sports text-emerald-600 dark:text-emerald-400 block leading-none">
                    {gk.cleanSheets}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-card-muted">Clean Sheet</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Fair Play Table (Rule 9d: Clubs with fewest cards) */}
      <section className="rounded-3xl p-5 sm:p-7 border border-surface-border dark:border-navy-700 surface-card shadow-card space-y-4">
        <div className="flex items-center gap-2.5 border-b border-surface-border dark:border-navy-700 pb-3">
          <span className="p-1.5 rounded-xl bg-blue-600 text-white shadow-xs">
            <Medal className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-base sm:text-lg font-black font-sports uppercase tracking-wider text-card-title">
              {lang === 'ml' ? 'ഫെയർ പ്ലേ അവാർഡ് പട്ടിക' : 'FAIR PLAY STANDINGS'}
            </h3>
            <p className="text-[11px] text-card-muted font-bold">
              {lang === 'ml' ? 'ഏറ്റവും കുറഞ്ഞ കാർഡുകൾ നേടിയ ക്ലബ്ബുകൾ' : 'Clubs ranked by fewest disciplined cards'}
            </p>
          </div>
        </div>

        {stats.fairPlayClubs.length === 0 ? (
          <div className="py-6 px-4 rounded-2xl surface-light border border-dashed border-surface-border dark:border-navy-700 text-center">
            <p className="text-xs text-card-muted font-medium">
              {lang === 'ml'
                ? 'മത്സരങ്ങളിൽ റഫറി കാർഡുകൾ രേഖപ്പെടുത്തുമ്പോൾ ഫെയർ പ്ലേ പട്ടിക അപ്ഡേറ്റ് ചെയ്യപ്പെടും.'
                : 'Fair play table activates as match referee cards are recorded.'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {stats.fairPlayClubs.map((item, idx) => (
              <div
                key={item.club}
                className="p-3 rounded-xl surface-light border border-surface-border dark:border-navy-700 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-6 h-6 rounded-md bg-surface-card text-card-title font-bold text-xs flex items-center justify-center border border-surface-border dark:border-navy-700 shrink-0">
                    #{idx + 1}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-white p-0.5 border border-slate-200 shrink-0">
                    <TeamLogo teamName={item.club} className="w-full h-full object-contain" />
                  </div>
                  <span className="font-bold text-card-title truncate">{item.club}</span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="inline-flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                    <span className="w-2.5 h-3.5 bg-amber-400 rounded-xs inline-block border border-amber-600"></span>
                    <span>{item.yellow}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 font-bold text-red-600 dark:text-red-400">
                    <span className="w-2.5 h-3.5 bg-red-600 rounded-xs inline-block border border-red-700"></span>
                    <span>{item.red}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. Tournament Awards (Rule 9e: Player of the Match & Player of Tournament) */}
      <section className="rounded-3xl p-5 sm:p-7 border border-surface-border dark:border-navy-700 surface-card shadow-card space-y-4">
        <div className="flex items-center gap-2.5 border-b border-surface-border dark:border-navy-700 pb-3">
          <span className="p-1.5 rounded-xl bg-amber-500 text-slate-950 shadow-xs">
            <Award className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-base sm:text-lg font-black font-sports uppercase tracking-wider text-card-title">
              {lang === 'ml' ? 'ടൂർണ്ണമെന്റ് അവാർഡുകൾ' : 'OFFICIAL MATCH AWARDS'}
            </h3>
            <p className="text-[11px] text-card-muted font-bold">
              {lang === 'ml' ? 'സംഘാടക സമിതി ഔദ്യോഗികമായി നിശ്ചയിക്കുന്നത്' : 'Designated by the organizing committee'}
            </p>
          </div>
        </div>

        {/* Check if any awards exist */}
        {!tournamentInfo.playerOfTheTournament && !stats.finishedMatches.some(m => m.playerOfTheMatch) ? (
          <div className="py-6 px-4 rounded-2xl surface-light border border-dashed border-surface-border dark:border-navy-700 text-center">
            <p className="text-xs text-card-muted font-medium">
              {lang === 'ml'
                ? 'മത്സരങ്ങൾക്ക് ശേഷം ഔദ്യോഗിക പ്ലെയർ ഓഫ് ദി മാച്ച് അവാർഡുകൾ ഇവിടെ പ്രസിദ്ധീകരിക്കും.'
                : 'Player of the Match awards will be posted by the committee following each finished match.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {tournamentInfo.playerOfTheTournament && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/30 space-y-1">
                <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400">
                  Player of the Tournament
                </span>
                <h4 className="text-sm font-black font-sports text-card-title">
                  {tournamentInfo.playerOfTheTournament}
                </h4>
              </div>
            )}
            {stats.finishedMatches
              .filter(m => m.playerOfTheMatch)
              .map(m => (
                <div key={m.id} className="p-3.5 rounded-2xl surface-light border border-surface-border dark:border-navy-700 space-y-0.5">
                  <span className="text-[10px] font-bold text-card-muted uppercase">
                    {m.team1} vs {m.team2} • Player of the Match
                  </span>
                  <h5 className="text-xs font-bold text-card-title">{m.playerOfTheMatch}</h5>
                </div>
              ))}
          </div>
        )}
      </section>

      {/* 6. All Players Directory (Confirmed Squads Only) (Rule 9f) */}
      <section className="rounded-3xl p-5 sm:p-7 border border-surface-border dark:border-navy-700 surface-card shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border dark:border-navy-700 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-xl bg-navy-800 text-gold shadow-xs">
              <Users className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-black font-sports uppercase tracking-wider text-card-title">
                {lang === 'ml' ? 'കളിക്കാരുടെ പട്ടിക' : 'ALL PLAYERS DIRECTORY'}
              </h3>
              <p className="text-[11px] text-card-muted font-bold">
                {lang === 'ml' ? 'സ്ഥിരീകരിച്ച സ്ക്വാഡുകളിൽ നിന്നുള്ള താരങ്ങൾ' : 'Names, numbers and clubs from confirmed squad rosters'}
              </p>
            </div>
          </div>
        </div>

        {/* Club Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto horizontal-scroll-container py-1">
          {squadClubs.map((club) => {
            const isSelected = selectedClubFilter === club;
            const isConfirmed = club === 'All' || clubSquadStatus[club] === 'confirmed';
            return (
              <button
                key={club}
                onClick={() => setSelectedClubFilter(club)}
                className={`min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition active:scale-95 flex items-center gap-1.5 ${
                  isSelected
                    ? 'btn-royal text-white font-black shadow-xs'
                    : 'surface-light text-card-title border border-surface-border dark:border-navy-700'
                }`}
              >
                <span>{club === 'All' ? (lang === 'ml' ? 'എല്ലാ ക്ലബ്ബുകളും' : 'All Clubs') : club}</span>
                {!isConfirmed && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300">
                    Draft
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        {isClubConfirmed && (
          <div className="relative">
            <Search className="w-4 h-4 text-card-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={playerSearchQuery}
              onChange={(e) => setPlayerSearchQuery(e.target.value)}
              placeholder={lang === 'ml' ? 'കളിക്കാരന്റെ പേര് അല്ലെങ്കിൽ ജേഴ്സി നമ്പർ തിരയുക...' : 'Search player by name, number or club...'}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium surface-light border border-surface-border dark:border-navy-700 text-card-title focus:outline-hidden focus:ring-2 focus:ring-blue-500 min-h-[44px]"
            />
          </div>
        )}

        {/* Players List or Unconfirmed Squad Notice */}
        {!isClubConfirmed ? (
          <div className="py-8 px-4 rounded-2xl surface-light border border-dashed border-surface-border dark:border-navy-700 text-center space-y-1.5">
            <ShieldAlert className="w-6 h-6 text-royal dark:text-sky mx-auto opacity-75" />
            <h4 className="text-sm font-bold text-card-title">
              {lang === 'ml' ? 'സ്ക്വാഡ് ഉടൻ പ്രഖ്യാപിക്കും' : 'Squad to be confirmed'}
            </h4>
            <p className="text-xs text-card-muted">
              {lang === 'ml'
                ? 'ഔദ്യോഗിക സ്ക്വാഡ് ലിസ്റ്റ് ക്ലബ്ബ് സമർപ്പിച്ച ശേഷം ഇവിടെ പ്രസിദ്ധീകരിക്കും.'
                : 'Official roster will be displayed once confirmed by the club committee.'}
            </p>
          </div>
        ) : visiblePlayers.length === 0 ? (
          <div className="py-8 px-4 rounded-2xl surface-light border border-dashed border-surface-border dark:border-navy-700 text-center text-xs text-card-muted font-medium">
            {lang === 'ml' ? 'തിരഞ്ഞെടുത്ത വിവരങ്ങളുമായി പൊരുത്തപ്പെടുന്ന കളിക്കാരെ കണ്ടെത്തിയില്ല' : 'No players found matching your query'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {visiblePlayers.map((p) => (
              <div
                key={p.id}
                className="p-3 rounded-xl surface-light border border-surface-border dark:border-navy-700 flex items-center justify-between gap-3 text-xs min-h-[48px]"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-7 h-7 rounded-lg bg-surface-card text-card-title font-black font-sports border border-surface-border dark:border-navy-700 flex items-center justify-center shrink-0">
                    #{p.number}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-white p-0.5 border border-slate-200 shrink-0">
                    <TeamLogo teamName={p.club} className="w-full h-full object-contain" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="font-bold text-card-title truncate">
                      {lang === 'ml' ? (p.nameMl || p.name) : p.name}
                    </h5>
                    <p className="text-[10px] text-card-muted truncate font-medium">
                      {p.club}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 7. Tournament Awards Explainer Note (Rule 11) */}
      {AWARDS_NOTE && (
        <div className="p-3.5 rounded-2xl surface-light border border-surface-border dark:border-navy-700 text-center text-xs text-card-muted font-medium flex items-center justify-center gap-1.5">
          <Info className="w-4 h-4 text-royal dark:text-sky shrink-0" />
          <span>
            {lang === 'ml'
              ? 'ടൂർണ്ണമെന്റ് അവാർഡുകൾ സംഘാടക സമിതിയാണ് തീരുമാനിക്കുന്നത്.'
              : 'Awards are decided by the organizing committee.'}
          </span>
        </div>
      )}
    </div>
  );
}
