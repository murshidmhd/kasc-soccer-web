import React, { useState, useEffect } from 'react';
import { Trophy, Gift, Share2, CheckCircle2, Flame, Award, Users, Sparkles, TrendingUp, ShieldCheck, Info } from 'lucide-react';
import confetti from 'canvas-confetti';
import { openingMatch } from '../data/tournamentData';
import TeamLogo from './TeamLogo';
import { PRIZES_CONFIRMED } from '../config/siteConfig';

export default function MatchPredictionCard({ lang, isDarkMode }) {
  // Persisted state in localStorage
  const [selectedOutcome, setSelectedOutcome] = useState(() => {
    return localStorage.getItem('kasc_prediction_outcome') || null;
  });

  const [predictedScoreHome, setPredictedScoreHome] = useState(() => {
    return parseInt(localStorage.getItem('kasc_predicted_score_home') || '2', 10);
  });

  const [predictedScoreAway, setPredictedScoreAway] = useState(() => {
    return parseInt(localStorage.getItem('kasc_predicted_score_away') || '1', 10);
  });

  const [isSubmitted, setIsSubmitted] = useState(() => {
    return localStorage.getItem('kasc_prediction_submitted') === 'true';
  });

  // Simulated live community votes (starting numbers)
  const [votes, setVotes] = useState({
    home: 1420,
    draw: 290,
    away: 730
  });

  const totalVotes = votes.home + votes.draw + votes.away;
  const homePercent = Math.round((votes.home / totalVotes) * 100);
  const drawPercent = Math.round((votes.draw / totalVotes) * 100);
  const awayPercent = 100 - homePercent - drawPercent;

  const handleVoteOutcome = (outcome) => {
    if (isSubmitted) return; // Locked once submitted
    setSelectedOutcome(outcome);
    localStorage.setItem('kasc_prediction_outcome', outcome);
  };

  const handleScoreChange = (team, delta) => {
    if (isSubmitted) return; // Locked once submitted
    if (team === 'home') {
      const next = Math.max(0, Math.min(10, predictedScoreHome + delta));
      setPredictedScoreHome(next);
      localStorage.setItem('kasc_predicted_score_home', next.toString());
    } else {
      const next = Math.max(0, Math.min(10, predictedScoreAway + delta));
      setPredictedScoreAway(next);
      localStorage.setItem('kasc_predicted_score_away', next.toString());
    }
  };

  const handleSubmitPrediction = () => {
    setIsSubmitted(true);
    localStorage.setItem('kasc_prediction_submitted', 'true');
    localStorage.setItem('kasc_prediction_outcome', selectedOutcome || 'home');
    localStorage.setItem('kasc_predicted_score_home', predictedScoreHome.toString());
    localStorage.setItem('kasc_predicted_score_away', predictedScoreAway.toString());

    // Update community votes count locally
    setVotes((prev) => ({
      ...prev,
      [selectedOutcome || 'home']: prev[selectedOutcome || 'home'] + 1
    }));

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // Ignore if confetti not available
    }
  };

  const handleShareToWhatsApp = () => {
    const outcomeText = selectedOutcome === 'home' 
      ? `${openingMatch.teamHome.shortName || 'KRSC'} ജയിക്കും` 
      : selectedOutcome === 'away' 
        ? `${openingMatch.teamAway.shortName || 'BASE'} ജയിക്കും` 
        : 'മത്സരം സമനിലയാകും (Draw)';

    const shareUrl = `${window.location.origin}${window.location.pathname}#live`;
    const text = encodeURIComponent(
      `⚽ *അഖിലേന്ത്യാ സെവൻസ് സീസൺ 7 - എന്റെ മാച്ച് പ്രവചനം!* 🔥\n\n` +
      `⚔️ ${openingMatch.teamHome.name} vs ${openingMatch.teamAway.name}\n` +
      `🎯 എന്റെ പ്രവചനം: *${openingMatch.teamHome.shortName} ${predictedScoreHome} - ${predictedScoreAway} ${openingMatch.teamAway.shortName}* (${outcomeText})\n\n` +
      `നിങ്ങളുടെ പ്രവചനം ഇവിടെ രേഖപ്പെടുത്തൂ: ${shareUrl}`
    );

    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className={`rounded-2xl sm:rounded-3xl border overflow-hidden p-4 sm:p-6 transition-colors shadow-xs ${
      isDarkMode 
        ? 'bg-slate-900 border-slate-800 text-white' 
        : 'bg-white border-slate-200 text-slate-900'
    }`}>
      {/* Header with Sponsor Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-xs">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`text-base sm:text-xl font-black font-sports uppercase tracking-wider ${
                isDarkMode ? 'text-white' : 'text-slate-950'
              }`}>
                {lang === 'ml' ? 'ആദ്യ മത്സര സ്കോർ പ്രവചനം' : 'OPENING MATCH PREDICTION'}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 text-[10px] font-black uppercase tracking-wider animate-pulse">
                Live Poll
              </span>
            </div>
            <p className={`text-xs font-medium mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {lang === 'ml'
                ? 'മത്സരഫലവും കൃത്യമായ സ്കോറും പ്രവചിച്ച് നിങ്ങളുടെ ഫുട്ബോൾ അറിവ് തെളിയിക്കൂ.'
                : 'Predict match winner & exact scoreline for the Season 7 opening match.'}
            </p>
          </div>
        </div>

        {/* Sponsor Tag (Only shown if prizes/sponsorship confirmed) */}
        {PRIZES_CONFIRMED && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 text-[11px] font-bold text-amber-900 dark:text-amber-300 self-start sm:self-auto">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Sponsored by <strong>Raidhan Kuzhimanthi</strong></span>
          </div>
        )}
      </div>

      {/* Part 1: Win Probability Community Poll */}
      <div className="mt-5 space-y-3">
        <div className={`flex items-center justify-between text-xs font-bold uppercase tracking-wider ${
          isDarkMode ? 'text-slate-400' : 'text-slate-600'
        }`}>
          <span className="flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>{lang === 'ml' ? 'ആര് വിജയിക്കും? (ഫാൻ പോൾ)' : 'Who Will Win? (Fan Poll)'}</span>
          </span>
          <span className={`flex items-center gap-1 text-[11px] font-normal ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            <Users className="w-3 h-3" />
            <span>{totalVotes.toLocaleString()} {lang === 'ml' ? 'വോട്ടുകൾ' : 'votes'}</span>
          </span>
        </div>

        {/* 3 Outcome Vote Buttons (Home / Draw / Away) */}
        <div className="grid grid-cols-3 gap-2">
          {/* Option 1: UDAYA Win */}
          <button
            onClick={() => handleVoteOutcome('home')}
            disabled={isSubmitted}
            className={`min-h-touch p-2.5 sm:p-3 rounded-xl border text-center transition flex flex-col items-center justify-center space-y-1 ${
              isSubmitted ? 'cursor-not-allowed opacity-90' : 'active:scale-95'
            } ${
              selectedOutcome === 'home'
                ? 'bg-blue-600 border-blue-600 text-white shadow-xs font-black'
                : isDarkMode ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200 font-bold' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800 font-bold'
            }`}
          >
            <span className="text-xs sm:text-sm font-black font-sports">
              {openingMatch.teamHome.shortName}
            </span>
            <span className={`text-[10px] ${selectedOutcome === 'home' ? 'text-blue-100' : isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {lang === 'ml' ? 'വിജയം' : 'Win (1)'}
            </span>
          </button>

          {/* Option 2: Draw */}
          <button
            onClick={() => handleVoteOutcome('draw')}
            disabled={isSubmitted}
            className={`min-h-touch p-2.5 sm:p-3 rounded-xl border text-center transition flex flex-col items-center justify-center space-y-1 ${
              isSubmitted ? 'cursor-not-allowed opacity-90' : 'active:scale-95'
            } ${
              selectedOutcome === 'draw'
                ? 'bg-slate-700 border-slate-600 text-white shadow-xs font-black'
                : isDarkMode ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200 font-bold' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800 font-bold'
            }`}
          >
            <span className="text-xs sm:text-sm font-black font-sports">
              DRAW
            </span>
            <span className={`text-[10px] ${selectedOutcome === 'draw' ? 'text-slate-300' : isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {lang === 'ml' ? 'സമനില' : 'Draw (X)'}
            </span>
          </button>

          {/* Option 3: SABAN FC Win */}
          <button
            onClick={() => handleVoteOutcome('away')}
            disabled={isSubmitted}
            className={`min-h-touch p-2.5 sm:p-3 rounded-xl border text-center transition flex flex-col items-center justify-center space-y-1 ${
              isSubmitted ? 'cursor-not-allowed opacity-90' : 'active:scale-95'
            } ${
              selectedOutcome === 'away'
                ? 'bg-amber-500 border-amber-500 text-slate-950 shadow-xs font-black'
                : isDarkMode ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200 font-bold' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800 font-bold'
            }`}
          >
            <span className="text-xs sm:text-sm font-black font-sports">
              {openingMatch.teamAway.shortName}
            </span>
            <span className={`text-[10px] ${selectedOutcome === 'away' ? 'text-amber-950' : isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {lang === 'ml' ? 'വിജയം' : 'Win (2)'}
            </span>
          </button>
        </div>

        {/* Community Percentage Progress Bar */}
        <div className="pt-1 space-y-1.5">
          <div className={`h-3 rounded-full overflow-hidden flex border p-0.5 gap-0.5 ${
            isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <div 
              style={{ width: `${homePercent}%` }} 
              className="bg-blue-600 rounded-l-full transition-all duration-700"
              title={`UDAYA: ${homePercent}%`}
            />
            <div 
              style={{ width: `${drawPercent}%` }} 
              className="bg-slate-400 transition-all duration-700"
              title={`Draw: ${drawPercent}%`}
            />
            <div 
              style={{ width: `${awayPercent}%` }} 
              className="bg-amber-500 rounded-r-full transition-all duration-700"
              title={`SABAN FC: ${awayPercent}%`}
            />
          </div>

          <div className={`flex items-center justify-between text-[11px] font-bold px-1 ${
            isDarkMode ? 'text-slate-300' : 'text-slate-600'
          }`}>
            <span className="text-blue-600 dark:text-blue-400">{openingMatch.teamHome.shortName}: {homePercent}%</span>
            <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Draw: {drawPercent}%</span>
            <span className="text-amber-600 dark:text-amber-400">{openingMatch.teamAway.shortName}: {awayPercent}%</span>
          </div>
        </div>
      </div>

      {/* Part 2: Exact Scoreline Stepper */}
      <div className={`mt-6 pt-5 border-t space-y-4 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
        <div className="text-center">
          <span className={`text-xs font-black font-sports uppercase tracking-wider ${
            isDarkMode ? 'text-slate-100' : 'text-slate-900'
          }`}>
            {lang === 'ml' ? 'കൃത്യമായ സ്കോർ പ്രവചിക്കൂ (Exact Scoreline)' : 'Predict Exact Full-Time Score'}
          </span>
          <p className={`text-[11px] mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {lang === 'ml' 
              ? '+ അല്ലെങ്കിൽ - ടാപ്പ് ചെയ്ത് ഫൈനൽ സ്കോർ സെറ്റ് ചെയ്യാം' 
              : 'Tap + / - to set your predicted full-time score'}
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 sm:gap-8">
          {/* Home Team Score Stepper */}
          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center gap-1.5">
              <TeamLogo teamName={openingMatch.teamHome.name} className="w-6 h-6" />
              <span className={`font-black font-sports text-xs sm:text-sm ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                {openingMatch.teamHome.shortName}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleScoreChange('home', -1)}
                disabled={isSubmitted || predictedScoreHome <= 0}
                className={`w-11 h-11 min-w-touch min-h-touch rounded-xl disabled:opacity-30 disabled:cursor-not-allowed font-black text-lg flex items-center justify-center active:scale-95 transition ${
                  isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
              >
                -
              </button>
              <span className="w-10 text-center text-3xl sm:text-4xl font-black font-sports text-blue-600 dark:text-blue-400">
                {predictedScoreHome}
              </span>
              <button
                onClick={() => handleScoreChange('home', 1)}
                disabled={isSubmitted || predictedScoreHome >= 10}
                className={`w-11 h-11 min-w-touch min-h-touch rounded-xl disabled:opacity-30 disabled:cursor-not-allowed font-black text-lg flex items-center justify-center active:scale-95 transition ${
                  isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
              >
                +
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="text-2xl font-black text-slate-300 dark:text-slate-600 pt-5">
            :
          </div>

          {/* Away Team Score Stepper */}
          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center gap-1.5">
              <TeamLogo teamName={openingMatch.teamAway.name} className="w-6 h-6" />
              <span className={`font-black font-sports text-xs sm:text-sm ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                {openingMatch.teamAway.shortName}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleScoreChange('away', -1)}
                disabled={isSubmitted || predictedScoreAway <= 0}
                className={`w-11 h-11 min-w-touch min-h-touch rounded-xl disabled:opacity-30 disabled:cursor-not-allowed font-black text-lg flex items-center justify-center active:scale-95 transition ${
                  isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
              >
                -
              </button>
              <span className="w-10 text-center text-3xl sm:text-4xl font-black font-sports text-amber-600 dark:text-amber-400">
                {predictedScoreAway}
              </span>
              <button
                onClick={() => handleScoreChange('away', 1)}
                disabled={isSubmitted || predictedScoreAway >= 10}
                className={`w-11 h-11 min-w-touch min-h-touch rounded-xl disabled:opacity-30 disabled:cursor-not-allowed font-black text-lg flex items-center justify-center active:scale-95 transition ${
                  isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Submission / Locked State & WhatsApp Share */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
          {!isSubmitted ? (
            <button
              onClick={handleSubmitPrediction}
              className="w-full sm:w-auto min-h-touch px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-xs transition active:scale-95 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>{lang === 'ml' ? 'പ്രവചനം സമർപ്പിക്കുക (Submit Vote)' : 'Lock In My Prediction'}</span>
            </button>
          ) : (
            <div className={`w-full flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl border ${
              isDarkMode 
                ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200' 
                : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}>
              <div className="flex items-center gap-2 text-xs font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span>
                      {lang === 'ml' 
                        ? `പ്രവചനം: ${openingMatch.teamHome.shortName} ${predictedScoreHome} - ${predictedScoreAway} ${openingMatch.teamAway.shortName}` 
                        : `Prediction: ${openingMatch.teamHome.shortName} ${predictedScoreHome} - ${predictedScoreAway} ${openingMatch.teamAway.shortName}`}
                    </span>
                    <span className="px-1.5 py-0.2 rounded-md bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 text-[10px] font-black uppercase tracking-wider">
                      🔒 LOCKED
                    </span>
                  </div>
                  <span className={`text-[10px] font-medium block ${isDarkMode ? 'text-emerald-300/80' : 'text-emerald-700'}`}>
                    {lang === 'ml' ? 'ഒരിക്കൽ രേഖപ്പെടുത്തിയ പ്രവചനം മാറ്റാനാകില്ല' : 'Your prediction is locked and cannot be edited'}
                  </span>
                </div>
              </div>

              <button
                onClick={handleShareToWhatsApp}
                className="w-full sm:w-auto min-h-touch px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Status</span>
              </button>
            </div>
          )}
        </div>

        {/* Written Contest Rules & Legal Free-Entry Disclaimers */}
        <div className={`mt-4 p-3.5 rounded-2xl border text-xs leading-relaxed space-y-1.5 ${
          isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
        }`}>
          <div className={`flex items-center gap-1.5 font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
            <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{lang === 'ml' ? 'മത്സര നിബന്ധനകളും നിയമപരമായ വ്യക്തതയും (Terms & Fair Play)' : 'Contest Terms & Fair Play Rules'}</span>
          </div>
          <ul className={`list-disc list-inside space-y-1 text-[11px] pl-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            <li>
              <strong className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>{lang === 'ml' ? '100% സൗജന്യ പങ്കാളിത്തം:' : '100% Free Entry:'}</strong>{' '}
              {lang === 'ml' 
                ? 'യാതൊരുവിധ എൻട്രി ഫീസോ പണമിടപാടോ ആവശ്യമില്ല. ഫാൻ വിനോദാർത്ഥം മാത്രം സംഘടിപ്പിക്കുന്നത്.' 
                : 'No purchase, entry fee, or monetary payment required. Strictly organized for fan promotional entertainment.'}
            </li>
            <li>
              <strong className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>{lang === 'ml' ? 'ഫാൻ എൻഗേജ്മെന്റ്:' : 'Fan Engagement:'}</strong>{' '}
              {lang === 'ml'
                ? 'ഇതൊരു കായിക വിനോദ പരിപാടിയാണ്. ചൂതാട്ടമോ വാതുവെപ്പോ അല്ല.'
                : 'Purely promotional community fan engagement, strictly not gambling.'}
            </li>
            <li>
              <strong className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>{lang === 'ml' ? 'നിയമം:' : 'Fair Play:'}</strong>{' '}
              {lang === 'ml' 
                ? 'ഒരു ഉപകരണത്തിൽ (Device) നിന്ന് ഒരു പ്രവചനം മാത്രം രേഖപ്പെടുത്താൻ സാധിക്കും.' 
                : 'Limited to 1 submission per device to prevent automated voting.'}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
