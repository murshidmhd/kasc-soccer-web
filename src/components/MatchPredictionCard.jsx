import React, { useState, useEffect } from 'react';
import { Trophy, Gift, Share2, CheckCircle2, Flame, Award, Users, Sparkles, TrendingUp } from 'lucide-react';
import confetti from 'canvas-confetti';
import { openingMatch } from '../data/tournamentData';
import TeamLogo from './TeamLogo';

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
    setSelectedOutcome(outcome);
    localStorage.setItem('kasc_prediction_outcome', outcome);
  };

  const handleScoreChange = (team, delta) => {
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
      ? 'UDAYA ജയിക്കും' 
      : selectedOutcome === 'away' 
        ? 'SABAN FC ജയിക്കും' 
        : 'മത്സരം സമനിലയാകും (Draw)';

    const shareUrl = `${window.location.origin}${window.location.pathname}#live`;
    const text = encodeURIComponent(
      `⚽ *അഖിലേന്ത്യാ സെവൻസ് സീസൺ 7 - എന്റെ മാച്ച് പ്രവചനം!* 🔥\n\n` +
      `⚔️ UDAYA Peruvallur vs SABAN FC Kottakkal\n` +
      `🎯 എന്റെ പ്രവചനം: *${openingMatch.teamHome.shortName} ${predictedScoreHome} - ${predictedScoreAway} ${openingMatch.teamAway.shortName}* (${outcomeText})\n` +
      `🎁 കൃത്യമായി പ്രവചിച്ച് റൈദാൻ കുഴിമന്തി സ്പെഷ്യൽ സമ്മാനങ്ങൾ നേടൂ!\n\n` +
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-xs">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-xl font-black font-sports uppercase tracking-wider text-slate-950">
                {lang === 'ml' ? 'സ്കോർ പ്രവചിക്കൂ... സമ്മാനം നേടൂ!' : 'PREDICT & WIN CONTEST'}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-black uppercase tracking-wider animate-pulse">
                Live Poll
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {lang === 'ml' 
                ? 'മത്സരഫലവും കൃത്യമായ സ്കോറും പ്രവചിക്കുന്നവരിൽ നിന്നും നറുക്കെടുപ്പിലൂടെ വമ്പൻ സമ്മാനം!'
                : 'Predict match winner & exact scoreline to enter the Matchday Lucky Draw!'}
            </p>
          </div>
        </div>

        {/* Sponsor Tag */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-[11px] font-bold text-amber-900 self-start sm:self-auto">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Sponsored by <strong>Raidhan Kuzhimanthi</strong></span>
        </div>
      </div>

      {/* Part 1: Sofascore-Style Win Probability Community Poll */}
      <div className="mt-5 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600 uppercase tracking-wider">
          <span className="flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
            <span>{lang === 'ml' ? 'ആര് വിജയിക്കും? (ഫാൻ പോൾ)' : 'Who Will Win? (Fan Poll)'}</span>
          </span>
          <span className="flex items-center gap-1 text-[11px] text-slate-400 font-normal">
            <Users className="w-3 h-3" />
            <span>{totalVotes.toLocaleString()} {lang === 'ml' ? 'വോട്ടുകൾ' : 'votes'}</span>
          </span>
        </div>

        {/* 3 Outcome Vote Buttons (Home / Draw / Away) */}
        <div className="grid grid-cols-3 gap-2">
          {/* Option 1: UDAYA Win */}
          <button
            onClick={() => handleVoteOutcome('home')}
            className={`p-2.5 sm:p-3 rounded-xl border text-center transition active:scale-95 flex flex-col items-center justify-center space-y-1 ${
              selectedOutcome === 'home'
                ? 'bg-blue-600 border-blue-600 text-white shadow-xs font-black'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800 font-bold'
            }`}
          >
            <span className="text-xs sm:text-sm font-black font-sports">
              {openingMatch.teamHome.shortName}
            </span>
            <span className={`text-[10px] ${selectedOutcome === 'home' ? 'text-blue-100' : 'text-slate-500'}`}>
              {lang === 'ml' ? 'വിജയം' : 'Win (1)'}
            </span>
          </button>

          {/* Option 2: Draw */}
          <button
            onClick={() => handleVoteOutcome('draw')}
            className={`p-2.5 sm:p-3 rounded-xl border text-center transition active:scale-95 flex flex-col items-center justify-center space-y-1 ${
              selectedOutcome === 'draw'
                ? 'bg-slate-800 border-slate-800 text-white shadow-xs font-black'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800 font-bold'
            }`}
          >
            <span className="text-xs sm:text-sm font-black font-sports">
              DRAW
            </span>
            <span className={`text-[10px] ${selectedOutcome === 'draw' ? 'text-slate-300' : 'text-slate-500'}`}>
              {lang === 'ml' ? 'സമനില' : 'Draw (X)'}
            </span>
          </button>

          {/* Option 3: SABAN FC Win */}
          <button
            onClick={() => handleVoteOutcome('away')}
            className={`p-2.5 sm:p-3 rounded-xl border text-center transition active:scale-95 flex flex-col items-center justify-center space-y-1 ${
              selectedOutcome === 'away'
                ? 'bg-amber-500 border-amber-500 text-slate-950 shadow-xs font-black'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800 font-bold'
            }`}
          >
            <span className="text-xs sm:text-sm font-black font-sports">
              {openingMatch.teamAway.shortName}
            </span>
            <span className={`text-[10px] ${selectedOutcome === 'away' ? 'text-amber-950' : 'text-slate-500'}`}>
              {lang === 'ml' ? 'വിജയം' : 'Win (2)'}
            </span>
          </button>
        </div>

        {/* Community Percentage Progress Bar */}
        <div className="pt-1 space-y-1.5">
          <div className="h-3 rounded-full bg-slate-100 overflow-hidden flex border border-slate-200 p-0.5 gap-0.5">
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

          <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 px-1">
            <span className="text-blue-700">{openingMatch.teamHome.shortName}: {homePercent}%</span>
            <span className="text-slate-500">Draw: {drawPercent}%</span>
            <span className="text-amber-700">{openingMatch.teamAway.shortName}: {awayPercent}%</span>
          </div>
        </div>
      </div>

      {/* Part 2: Exact Scoreline Stepper (FotMob Style) */}
      <div className="mt-6 pt-5 border-t border-slate-100 space-y-4">
        <div className="text-center">
          <span className="text-xs font-black font-sports text-slate-900 uppercase tracking-wider">
            {lang === 'ml' ? 'കൃത്യമായ സ്കോർ പ്രവചിക്കൂ (Exact Scoreline)' : 'Predict Exact Full-Time Score'}
          </span>
          <p className="text-[11px] text-slate-500">
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
              <span className="font-black font-sports text-xs sm:text-sm text-slate-900">
                {openingMatch.teamHome.shortName}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleScoreChange('home', -1)}
                disabled={predictedScoreHome <= 0}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-800 font-black text-base flex items-center justify-center active:scale-95 transition"
              >
                -
              </button>
              <span className="w-10 text-center text-3xl sm:text-4xl font-black font-sports text-blue-700">
                {predictedScoreHome}
              </span>
              <button
                onClick={() => handleScoreChange('home', 1)}
                disabled={predictedScoreHome >= 10}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-800 font-black text-base flex items-center justify-center active:scale-95 transition"
              >
                +
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="text-2xl font-black text-slate-300 pt-5">
            :
          </div>

          {/* Away Team Score Stepper */}
          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center gap-1.5">
              <TeamLogo teamName={openingMatch.teamAway.name} className="w-6 h-6" />
              <span className="font-black font-sports text-xs sm:text-sm text-slate-900">
                {openingMatch.teamAway.shortName}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleScoreChange('away', -1)}
                disabled={predictedScoreAway <= 0}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-800 font-black text-base flex items-center justify-center active:scale-95 transition"
              >
                -
              </button>
              <span className="w-10 text-center text-3xl sm:text-4xl font-black font-sports text-amber-600">
                {predictedScoreAway}
              </span>
              <button
                onClick={() => handleScoreChange('away', 1)}
                disabled={predictedScoreAway >= 10}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-800 font-black text-base flex items-center justify-center active:scale-95 transition"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Submission / Confirmation & WhatsApp Share */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
          {!isSubmitted ? (
            <button
              onClick={handleSubmitPrediction}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-xs transition active:scale-95 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>{lang === 'ml' ? 'പ്രവചനം സമർപ്പിക്കുക (Submit Vote)' : 'Lock In My Prediction'}</span>
            </button>
          ) : (
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900">
              <div className="flex items-center gap-2 text-xs font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  {lang === 'ml' 
                    ? `നിങ്ങളുടെ പ്രവചനം രേഖപ്പെടുത്തി: ${openingMatch.teamHome.shortName} ${predictedScoreHome} - ${predictedScoreAway} ${openingMatch.teamAway.shortName}` 
                    : `Prediction Saved: ${openingMatch.teamHome.shortName} ${predictedScoreHome} - ${predictedScoreAway} ${openingMatch.teamAway.shortName}`}
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-3 py-1.5 rounded-xl border border-emerald-300 text-[11px] font-bold text-emerald-800 hover:bg-emerald-100 transition active:scale-95"
                >
                  Change
                </button>
                <button
                  onClick={handleShareToWhatsApp}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition active:scale-95 flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Status</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
