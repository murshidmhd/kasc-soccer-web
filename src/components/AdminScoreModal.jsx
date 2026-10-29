import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Zap, 
  Plus, 
  Minus, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  RotateCcw, 
  Send, 
  LogOut,
  Radio,
  Play,
  Square,
  Pause
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  DEFAULT_ADMIN_PIN, 
  isAdminAuthenticated, 
  setAdminAuthenticated, 
  getStoredMatchState, 
  saveOfficialMatchState 
} from '../utils/matchStateManager';
import { openingMatch } from '../data/tournamentData';

export default function AdminScoreModal({ isOpen, onClose, isDarkMode, lang }) {
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(isAdminAuthenticated);

  // Match State copy for Admin editing
  const [matchState, setMatchState] = useState(getStoredMatchState);
  const [notification, setNotification] = useState('');

  // New Event form
  const [newEvent, setNewEvent] = useState({
    type: 'goal',
    team: 'home',
    player: 'Ibrahim Soumahoro',
    minute: 38,
    text: 'Clinical finish into bottom corner'
  });

  // Sync state whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setIsAuthenticated(isAdminAuthenticated());
      setMatchState(getStoredMatchState());
      setPinError('');
      setPinInput('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e?.preventDefault();
    if (pinInput.trim() === DEFAULT_ADMIN_PIN || pinInput.trim() === '2026') {
      setIsAuthenticated(true);
      setAdminAuthenticated(true);
      setPinError('');
      setNotification('Authenticated as Official Ground Referee Desk');
      setTimeout(() => setNotification(''), 3000);
    } else {
      setPinError('Invalid Committee PIN. Default PIN: 7012');
    }
  };

  const handleLogout = () => {
    setAdminAuthenticated(false);
    setIsAuthenticated(false);
    setPinInput('');
  };

  const handleStartMatch = (half) => {
    const min = half === '1ST_HALF' ? 1 : half === 'HALF_TIME' ? 35 : 36;
    setMatchState((prev) => {
      const next = {
        ...prev,
        status: half,
        matchMinute: min,
        isCrowdLocked: false
      };
      saveOfficialMatchState(next);
      return next;
    });
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    setNotification(
      half === '1ST_HALF'
        ? '🟢 Match Started! Live 1st Half Kickoff broadcasted to all fans.'
        : half === 'HALF_TIME'
        ? '⏸️ Half Time Break Called (35 mins).'
        : '▶️ 2nd Half Kickoff broadcasted!'
    );
    setTimeout(() => setNotification(''), 3000);
  };

  const handleStopMatch = () => {
    setMatchState((prev) => {
      const next = {
        ...prev,
        status: 'FULL_TIME',
        isCrowdLocked: true
      };
      saveOfficialMatchState(next);
      return next;
    });
    confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
    setNotification('⏹️ Match Ended! Final Score Locked & Broadcasted.');
    setTimeout(() => setNotification(''), 3500);
  };

  const handleAdjustMinute = (delta) => {
    setMatchState((prev) => {
      const nextMin = Math.max(0, Math.min(90, prev.matchMinute + delta));
      const next = { ...prev, matchMinute: nextMin };
      saveOfficialMatchState(next);
      return next;
    });
  };

  const handleResetToUpcoming = () => {
    setMatchState((prev) => {
      const next = {
        ...prev,
        status: 'UPCOMING',
        matchMinute: 0,
        isCrowdLocked: false
      };
      saveOfficialMatchState(next);
      return next;
    });
    setNotification('Match reset to Upcoming Pre-Match status (8:00 PM).');
    setTimeout(() => setNotification(''), 2500);
  };

  const handleScoreChange = (team, delta) => {
    setMatchState((prev) => {
      const nextHome = team === 'home' ? Math.max(0, prev.officialScoreHome + delta) : prev.officialScoreHome;
      const nextAway = team === 'away' ? Math.max(0, prev.officialScoreAway + delta) : prev.officialScoreAway;
      return {
        ...prev,
        officialScoreHome: nextHome,
        officialScoreAway: nextAway
      };
    });
  };

  const handleStatusChange = (status) => {
    setMatchState((prev) => ({
      ...prev,
      status
    }));
  };

  const handleMinuteChange = (e) => {
    const val = parseInt(e.target.value, 10) || 0;
    setMatchState((prev) => ({
      ...prev,
      matchMinute: Math.max(0, Math.min(90, val))
    }));
  };

  const handleToggleCrowdLock = () => {
    setMatchState((prev) => ({
      ...prev,
      isCrowdLocked: !prev.isCrowdLocked
    }));
  };

  const handleAddOfficialEvent = () => {
    if (!newEvent.player.trim()) return;

    const eventObj = {
      id: `evt-${Date.now()}`,
      minute: newEvent.minute,
      team: newEvent.team,
      player: newEvent.player.trim(),
      type: newEvent.type,
      text: newEvent.text.trim() || `${newEvent.type.toUpperCase()} recorded`,
      isOfficial: true
    };

    setMatchState((prev) => ({
      ...prev,
      events: [eventObj, ...prev.events]
    }));

    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    setNotification('Official Match Event Added!');
    setTimeout(() => setNotification(''), 2500);
  };

  const handleSaveAndBroadcast = () => {
    saveOfficialMatchState(matchState);
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
    setNotification('✅ OFFICIAL SCORE SAVED & BROADCASTED TO ALL FANS!');
    setTimeout(() => {
      setNotification('');
      onClose();
    }, 1200);
  };

  const handleResetCrowdSpam = () => {
    setMatchState((prev) => ({
      ...prev,
      crowdReports: {
        home: prev.officialScoreHome * 8,
        away: prev.officialScoreAway * 8,
        total: (prev.officialScoreHome + prev.officialScoreAway) * 8
      }
    }));
    setNotification('Crowd reports synchronized with official score!');
    setTimeout(() => setNotification(''), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className={`relative w-full max-w-xl max-h-[92vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden ${
        isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Top Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-4 sm:p-5 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500 text-slate-950 font-black">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black font-sports uppercase tracking-wider">
                  Official Scorer & Admin Desk
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-red-600 text-[10px] font-black uppercase">
                  Committee Only
                </span>
              </div>
              <p className="text-xs text-blue-200">
                Ground Referee Desk • SFA All India Sevens Season 7
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {notification && (
            <div className="p-3 rounded-xl bg-emerald-600 text-white text-xs font-bold text-center animate-fadeIn shadow-md">
              {notification}
            </div>
          )}

          {/* SCREEN 1: PIN AUTHENTICATION */}
          {!isAuthenticated ? (
            <div className="py-6 max-w-sm mx-auto text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mx-auto">
                <Lock className="w-7 h-7" />
              </div>
              
              <div className="space-y-1">
                <h4 className="text-lg font-black font-sports uppercase">
                  Enter Committee Access PIN
                </h4>
                <p className="text-xs text-slate-500">
                  Please enter your authorized 4-digit Scorer PIN to update official scores and manage anti-spam filters.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-3">
                <input
                  type="password"
                  maxLength={6}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Enter PIN (Default: 7012)"
                  className={`w-full p-3 text-center text-xl font-mono tracking-widest rounded-xl border font-bold ${
                    isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                  autoFocus
                />

                {pinError && (
                  <p className="text-xs text-red-600 font-bold">{pinError}</p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-md transition active:scale-95"
                >
                  Unlock Admin Control Panel
                </button>
              </form>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => { setPinInput('7012'); }}
                  className="text-xs text-blue-600 hover:underline font-semibold"
                >
                  Click to Auto-fill Default PIN (7012)
                </button>
              </div>
            </div>
          ) : (
            /* SCREEN 2: MAIN ADMIN CONTROLLER */
            <div className="space-y-6">
              {/* Authenticated Status Banner */}
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center justify-between text-xs font-bold">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Authorized as Ground Match Scorer (Murshid / Desk)</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-red-700 hover:underline flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Lock</span>
                </button>
              </div>

              {/* MASTER MATCH CONTROLLER: START / PAUSE / STOP LIVE OPERATIONS */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white space-y-3.5 shadow-md border border-blue-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-amber-500 text-slate-950 font-black">
                      <Radio className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="text-xs font-black font-sports uppercase tracking-wider text-amber-300">
                        Live Match Operations
                      </h4>
                      <p className="text-[11px] text-blue-200">
                        Kickoff, pause half time, or blow final whistle
                      </p>
                    </div>
                  </div>

                  {/* Active Match Status Pill */}
                  <div>
                    {matchState.status === 'UPCOMING' && (
                      <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-bold text-xs border border-slate-700">
                        ⚪ Pre-Match (8:00 PM)
                      </span>
                    )}
                    {(matchState.status === '1ST_HALF' || matchState.status === '2ND_HALF') && (
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white font-black text-xs uppercase animate-pulse shadow-xs">
                        <span className="w-2 h-2 rounded-full bg-white"></span>
                        LIVE MATCH ON ({matchState.status === '1ST_HALF' ? '1st Half' : '2nd Half'})
                      </span>
                    )}
                    {matchState.status === 'HALF_TIME' && (
                      <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-xs uppercase shadow-xs">
                        ⏸️ Half Time Break
                      </span>
                    )}
                    {matchState.status === 'FULL_TIME' && (
                      <span className="px-3 py-1 rounded-full bg-slate-950 text-white font-black text-xs uppercase border border-slate-700 shadow-xs">
                        🏁 Match Ended & Locked
                      </span>
                    )}
                  </div>
                </div>

                {/* Big Action Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {/* Button 1: Start 1st Half */}
                  <button
                    onClick={() => handleStartMatch('1ST_HALF')}
                    className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex flex-col items-center justify-center gap-1 shadow-md transition active:scale-95"
                  >
                    <span className="text-base">🟢</span>
                    <span>START MATCH</span>
                    <span className="text-[9px] font-normal opacity-90">(1st Half Kickoff)</span>
                  </button>

                  {/* Button 2: Half Time */}
                  <button
                    onClick={() => handleStartMatch('HALF_TIME')}
                    className="p-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex flex-col items-center justify-center gap-1 shadow-md transition active:scale-95"
                  >
                    <span className="text-base">⏸️</span>
                    <span>HALF TIME</span>
                    <span className="text-[9px] font-normal opacity-90">(Pause at 35')</span>
                  </button>

                  {/* Button 3: Start 2nd Half */}
                  <button
                    onClick={() => handleStartMatch('2ND_HALF')}
                    className="p-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs flex flex-col items-center justify-center gap-1 shadow-md transition active:scale-95"
                  >
                    <span className="text-base">▶️</span>
                    <span>START 2ND HALF</span>
                    <span className="text-[9px] font-normal opacity-90">(Resume at 36')</span>
                  </button>

                  {/* Button 4: Stop Match (Full Time) */}
                  <button
                    onClick={handleStopMatch}
                    className="p-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs flex flex-col items-center justify-center gap-1 shadow-md transition active:scale-95"
                  >
                    <span className="text-base">⏹️</span>
                    <span>STOP MATCH</span>
                    <span className="text-[9px] font-normal opacity-90">(Final Whistle & Lock)</span>
                  </button>
                </div>

                {/* Live Minute Tickers */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/10 text-xs">
                  <span className="text-blue-200">
                    Live Match Clock: <strong className="text-white text-sm font-mono">{matchState.matchMinute}' mins</strong>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleAdjustMinute(1)}
                      className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold text-[11px] active:scale-95"
                    >
                      +1 Min
                    </button>
                    <button
                      onClick={() => handleAdjustMinute(5)}
                      className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold text-[11px] active:scale-95"
                    >
                      +5 Mins
                    </button>
                    <button
                      onClick={handleResetToUpcoming}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-red-500 text-white font-medium text-[11px] active:scale-95"
                    >
                      Reset Pre-Match
                    </button>
                  </div>
                </div>
              </div>

              {/* SECTION A: OFFICIAL MATCH SCORE OVERWRITE */}
              <div className={`p-4 sm:p-5 rounded-2xl border space-y-4 ${
                isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black font-sports uppercase tracking-wider text-slate-500">
                    Official Ground Scoreboard
                  </h4>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200">
                    HIGHEST AUTHORITY OVER CROWD
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 items-center">
                  {/* Home Team Score (UDAYA) */}
                  <div className={`p-4 rounded-xl border text-center space-y-2 ${
                    isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-xs'
                  }`}>
                    <span className="text-xs font-bold text-sky-700 block truncate">
                      UDAYA Peruvallur
                    </span>
                    <div className="text-4xl sm:text-5xl font-black font-sports text-slate-950">
                      {matchState.officialScoreHome}
                    </div>
                    <div className="flex items-center justify-center gap-2 pt-1">
                      <button
                        onClick={() => handleScoreChange('home', -1)}
                        className="w-9 h-9 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-900 font-bold flex items-center justify-center active:scale-95"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleScoreChange('home', 1)}
                        className="w-9 h-9 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold flex items-center justify-center active:scale-95 shadow-sm"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Away Team Score (SABAN FC) */}
                  <div className={`p-4 rounded-xl border text-center space-y-2 ${
                    isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-xs'
                  }`}>
                    <span className="text-xs font-bold text-amber-700 block truncate">
                      SABAN FC Kottakkal
                    </span>
                    <div className="text-4xl sm:text-5xl font-black font-sports text-slate-950">
                      {matchState.officialScoreAway}
                    </div>
                    <div className="flex items-center justify-center gap-2 pt-1">
                      <button
                        onClick={() => handleScoreChange('away', -1)}
                        className="w-9 h-9 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-900 font-bold flex items-center justify-center active:scale-95"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleScoreChange('away', 1)}
                        className="w-9 h-9 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold flex items-center justify-center active:scale-95 shadow-sm"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Score Preset Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-500 mr-1">Quick Presets:</span>
                  {['0-0', '1-0', '0-1', '1-1', '2-1', '2-2', '3-2'].map((preset) => {
                    const [h, a] = preset.split('-').map(Number);
                    return (
                      <button
                        key={preset}
                        onClick={() => setMatchState((prev) => ({ ...prev, officialScoreHome: h, officialScoreAway: a }))}
                        className="px-2.5 py-1 rounded-md text-xs font-sports font-bold bg-slate-200 hover:bg-blue-600 hover:text-white transition active:scale-95"
                      >
                        {preset}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION B: MATCH STATUS & CLOCK */}
              <div className={`p-4 sm:p-5 rounded-2xl border space-y-3 ${
                isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black font-sports uppercase tracking-wider text-slate-500">
                    Match Period & Official Clock
                  </h4>
                  <span className="text-xs font-bold text-blue-700">
                    Current: {matchState.matchMinute}'
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                  {[
                    { id: 'UPCOMING', label: 'Upcoming' },
                    { id: '1ST_HALF', label: '1st Half' },
                    { id: 'HALF_TIME', label: 'Half Time' },
                    { id: '2ND_HALF', label: '2nd Half' },
                    { id: 'FULL_TIME', label: 'Full Time (FT)' }
                  ].map((st) => (
                    <button
                      key={st.id}
                      onClick={() => handleStatusChange(st.id)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition active:scale-95 ${
                        matchState.status === st.id
                          ? 'bg-blue-700 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>

                {/* Minute Input Slider */}
                <div className="pt-2 flex items-center gap-3">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="range"
                    min="0"
                    max="80"
                    value={matchState.matchMinute}
                    onChange={handleMinuteChange}
                    className="flex-1 accent-blue-600 cursor-pointer"
                  />
                  <span className="w-12 text-center text-xs font-mono font-bold px-2 py-1 bg-white border border-slate-200 rounded-md">
                    {matchState.matchMinute}'
                  </span>
                </div>
              </div>

              {/* SECTION C: PUBLISH MATCH EVENT (GOAL / CARD / PENALTY) */}
              <div className={`p-4 sm:p-5 rounded-2xl border space-y-3 ${
                isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <h4 className="text-xs font-black font-sports uppercase tracking-wider text-slate-500">
                  Publish Official Timeline Event
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Event Type</label>
                    <select
                      value={newEvent.type}
                      onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                      className="w-full p-2 text-xs font-bold rounded-lg border bg-white border-slate-300"
                    >
                      <option value="goal">⚽ Goal</option>
                      <option value="yellow_card">🟨 Yellow Card</option>
                      <option value="red_card">🟥 Red Card</option>
                      <option value="penalty">🥅 Penalty Kick</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Team</label>
                    <select
                      value={newEvent.team}
                      onChange={(e) => setNewEvent({ ...newEvent, team: e.target.value })}
                      className="w-full p-2 text-xs font-bold rounded-lg border bg-white border-slate-300"
                    >
                      <option value="home">UDAYA Peruvallur</option>
                      <option value="away">SABAN FC Kottakkal</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Player Name</label>
                    <input
                      type="text"
                      value={newEvent.player}
                      onChange={(e) => setNewEvent({ ...newEvent, player: e.target.value })}
                      placeholder="e.g. Ibrahim Soumahoro"
                      className="w-full p-2 text-xs font-bold rounded-lg border bg-white border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Minute</label>
                    <input
                      type="number"
                      value={newEvent.minute}
                      onChange={(e) => setNewEvent({ ...newEvent, minute: parseInt(e.target.value, 10) || 0 })}
                      className="w-full p-2 text-xs font-bold rounded-lg border bg-white border-slate-300"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newEvent.text}
                    onChange={(e) => setNewEvent({ ...newEvent, text: e.target.value })}
                    placeholder="Event note: e.g. Stunning top corner volley"
                    className="flex-1 p-2 text-xs rounded-lg border bg-white border-slate-300"
                  />
                  <button
                    onClick={handleAddOfficialEvent}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 active:scale-95 shadow-xs shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish Event</span>
                  </button>
                </div>
              </div>

              {/* SECTION D: ANTI-SPAM & CROWD REPORTING GOVERNANCE */}
              <div className={`p-4 sm:p-5 rounded-2xl border space-y-3 ${
                isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-black font-sports uppercase tracking-wider text-slate-700">
                      Crowd Anti-Spam Governance
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Users have a strict 45s rate limit and 5-submission cap per match.
                    </p>
                  </div>

                  <button
                    onClick={handleToggleCrowdLock}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 ${
                      matchState.isCrowdLocked
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'bg-emerald-600 text-white shadow-xs'
                    }`}
                  >
                    {matchState.isCrowdLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                    <span>{matchState.isCrowdLocked ? 'Crowd Input: LOCKED' : 'Crowd Input: ACTIVE'}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-xs">
                  <span className="text-slate-600">
                    Current Crowd Votes: <strong>{matchState.crowdReports?.total || 0} reports</strong>
                  </span>
                  <button
                    onClick={handleResetCrowdSpam}
                    className="px-3 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Sync Crowd to Official Score</span>
                  </button>
                </div>
              </div>

              {/* ACTION FOOTER */}
              <div className="pt-2">
                <button
                  onClick={handleSaveAndBroadcast}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white font-black text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 active:scale-98 transition"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Save & Push Official Score to Website</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}