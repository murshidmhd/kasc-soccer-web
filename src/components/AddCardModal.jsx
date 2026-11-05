import React, { useState } from 'react';
import { X, Check, Trash2, AlertCircle, ShieldAlert } from 'lucide-react';
import { getStoredMatchState, saveOfficialMatchState, getCalculatedMatchTime } from '../utils/matchStateManager';
import { openingMatch } from '../data/tournamentData';

// Official Match Squads for Quick Player Selection
const SQUADS = {
  home: {
    name: 'UDAYA PARAMBIL PEEDIKA',
    shortName: 'UDAYA',
    players: [
      { num: 1, name: 'Shamseer', pos: 'GK' },
      { num: 4, name: 'Shameer K.', pos: 'CB' },
      { num: 3, name: 'Faisal M.', pos: 'RB' },
      { num: 7, name: 'Riyas K.', pos: 'CM' },
      { num: 8, name: 'Suhail P.', pos: 'AM' },
      { num: 9, name: 'Ibrahim Soumahoro', pos: 'ST' },
      { num: 10, name: 'Asif Ali', pos: 'CF' },
      { num: 13, name: 'Junaid', pos: 'SUB' },
      { num: 11, name: 'Salman', pos: 'SUB' },
      { num: 14, name: 'Anas', pos: 'SUB' },
      { num: 15, name: 'Haris', pos: 'SUB' },
      { num: 18, name: 'Rahul', pos: 'SUB' }
    ]
  },
  away: {
    name: 'NEW MALAYA MALABAR FC',
    shortName: 'NEW MALAYA',
    players: [
      { num: 1, name: 'Aneesh', pos: 'GK' },
      { num: 5, name: 'Musthafa', pos: 'CB' },
      { num: 6, name: 'Jameel', pos: 'SW' },
      { num: 8, name: 'Nabeel', pos: 'CM' },
      { num: 10, name: 'Rashid', pos: 'AM' },
      { num: 11, name: 'Basith', pos: 'WF' },
      { num: 9, name: 'Usman', pos: 'ST' },
      { num: 22, name: 'Suhair', pos: 'SUB' },
      { num: 7, name: 'Shafeeq', pos: 'SUB' },
      { num: 14, name: 'Nizar', pos: 'SUB' },
      { num: 17, name: 'Ajmal', pos: 'SUB' },
      { num: 19, name: 'Irfan', pos: 'SUB' }
    ]
  }
};

const COMMON_REASONS = [
  { ml: 'ഫൗൾ (Tactical Foul)', en: 'Tactical Foul' },
  { ml: 'വാക്കുതർക്കം (Dissent)', en: 'Dissent' },
  { ml: 'റഫ് ടാക്കിൾ (Rough Tackle)', en: 'Rough Tackle' },
  { ml: 'ഹാൻഡ് ബോൾ (Handball)', en: 'Handball' },
  { ml: 'ടൈം വേസ്റ്റിംഗ് (Time Wasting)', en: 'Time Wasting' }
];

export default function AddCardModal({ isOpen, onClose, isDarkMode, lang }) {
  if (!isOpen) return null;

  const currentMatchState = getStoredMatchState();
  const currentClock = getCalculatedMatchTime(currentMatchState);

  const [cardType, setCardType] = useState('yellow_card'); // 'yellow_card' | 'red_card'
  const [selectedTeam, setSelectedTeam] = useState('home'); // 'home' | 'away'
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [customPlayerName, setCustomPlayerName] = useState('');
  const [minute, setMinute] = useState(() => currentClock.minuteOnly || 25);
  const [reason, setReason] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const currentSquad = SQUADS[selectedTeam] || SQUADS.home;

  const handleSelectPlayer = (name) => {
    setSelectedPlayer(name);
    setCustomPlayerName('');
  };

  const handleSaveCard = () => {
    const finalPlayer = (selectedPlayer || customPlayerName || '').trim();
    if (!finalPlayer) {
      setFeedbackMsg(lang === 'ml' ? 'ദയവായി കളിക്കാരന്റെ പേര് തിരഞ്ഞെടുക്കുക' : 'Please select or enter a player name');
      return;
    }

    const state = getStoredMatchState();
    const newEvent = {
      id: `card-${Date.now()}`,
      type: cardType,
      team: selectedTeam,
      player: finalPlayer,
      minute: Number(minute) || 1,
      text: reason || (cardType === 'yellow_card' ? 'Yellow card caution' : 'Red card ejection'),
      timestamp: new Date().toISOString()
    };

    const updatedEvents = [...(state.events || []), newEvent];
    saveOfficialMatchState({
      ...state,
      events: updatedEvents
    });

    setFeedbackMsg(
      lang === 'ml'
        ? `✅ ${cardType === 'yellow_card' ? 'മഞ്ഞ കാർഡ്' : 'ചുവപ്പ് കാർഡ്'} രേഖപ്പെടുത്തി: ${finalPlayer}`
        : `✅ ${cardType === 'yellow_card' ? 'Yellow Card' : 'Red Card'} recorded for ${finalPlayer}`
    );

    setTimeout(() => {
      setFeedbackMsg('');
      onClose();
    }, 1200);
  };

  const handleDeleteEvent = (eventId) => {
    const state = getStoredMatchState();
    const filtered = (state.events || []).filter((e) => e.id !== eventId);
    saveOfficialMatchState({
      ...state,
      events: filtered
    });
    setFeedbackMsg(lang === 'ml' ? 'കാർഡ് ഒഴിവാക്കി' : 'Card removed');
    setTimeout(() => setFeedbackMsg(''), 1500);
  };

  // Filter existing cards from current match events
  const existingCards = (currentMatchState.events || []).filter(
    (e) => e.type === 'yellow_card' || e.type === 'red_card'
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
      <div
        className={`relative w-full max-w-lg max-h-[92vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden ${
          isDarkMode ? 'bg-navy-900 border-navy-700 text-white' : 'bg-white border-surface-border text-navy-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-surface-border dark:border-navy-700">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center shadow-xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-sports font-black text-base sm:text-lg leading-tight">
                {lang === 'ml' ? 'കാർഡ് ചേർക്കുക (Yellow / Red Card)' : 'Add Match Card'}
              </h3>
              <p className="text-xs text-card-muted">
                {lang === 'ml' ? 'ഔദ്യോഗിക റഫറി ബുക്കിംഗ് ലൈവായി അപ്‌ഡേറ്റ് ചെയ്യുക' : 'Official referee disciplinary booking'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-light dark:bg-navy-800 hover:bg-surface-border dark:hover:bg-navy-700 flex items-center justify-center transition active:scale-95"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feedback message banner */}
        {feedbackMsg && (
          <div className="p-3 bg-emerald-600 text-white text-xs font-bold text-center animate-fadeIn">
            {feedbackMsg}
          </div>
        )}

        {/* Scrollable Body */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto max-h-[calc(92vh-140px)]">
          {/* 1. Choose Card Type: Yellow vs Red */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-card-muted block mb-2">
              1. {lang === 'ml' ? 'കാർഡിന്റെ തരം' : 'Card Type'}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCardType('yellow_card')}
                className={`py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 border-2 transition active:scale-98 ${
                  cardType === 'yellow_card'
                    ? 'border-amber-400 bg-amber-500/15 text-amber-900 dark:text-amber-300 shadow-md ring-2 ring-amber-400/40'
                    : 'border-surface-border dark:border-navy-700 text-card-muted hover:bg-surface-light dark:hover:bg-navy-800'
                }`}
              >
                <span className="w-4 h-6 rounded-xs bg-amber-400 border border-amber-600 shadow-xs inline-block" />
                <span>{lang === 'ml' ? 'മഞ്ഞ കാർഡ് (Yellow)' : 'Yellow Card'}</span>
              </button>

              <button
                type="button"
                onClick={() => setCardType('red_card')}
                className={`py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 border-2 transition active:scale-98 ${
                  cardType === 'red_card'
                    ? 'border-red-500 bg-red-500/15 text-red-900 dark:text-red-300 shadow-md ring-2 ring-red-500/40'
                    : 'border-surface-border dark:border-navy-700 text-card-muted hover:bg-surface-light dark:hover:bg-navy-800'
                }`}
              >
                <span className="w-4 h-6 rounded-xs bg-red-600 border border-red-700 shadow-xs inline-block" />
                <span>{lang === 'ml' ? 'ചുവപ്പ് കാർഡ് (Red)' : 'Red Card'}</span>
              </button>
            </div>
          </div>

          {/* 2. Choose Team */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-card-muted block mb-2">
              2. {lang === 'ml' ? 'ടീം' : 'Team'}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedTeam('home');
                  setSelectedPlayer('');
                }}
                className={`p-3 rounded-2xl border text-left transition active:scale-98 ${
                  selectedTeam === 'home'
                    ? 'border-royal dark:border-sky bg-purple-50 dark:bg-purple-950/60 shadow-xs ring-1 ring-royal'
                    : 'border-surface-border dark:border-navy-700 hover:bg-surface-light dark:hover:bg-navy-800'
                }`}
              >
                <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-royal text-white block w-fit mb-1">
                  {openingMatch.teamHome.shortName}
                </span>
                <span className="text-xs font-bold block truncate">{openingMatch.teamHome.name}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedTeam('away');
                  setSelectedPlayer('');
                }}
                className={`p-3 rounded-2xl border text-left transition active:scale-98 ${
                  selectedTeam === 'away'
                    ? 'border-royal dark:border-sky bg-blue-50 dark:bg-blue-950/60 shadow-xs ring-1 ring-royal'
                    : 'border-surface-border dark:border-navy-700 hover:bg-surface-light dark:hover:bg-navy-800'
                }`}
              >
                <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-600 text-white block w-fit mb-1">
                  {openingMatch.teamAway.shortName}
                </span>
                <span className="text-xs font-bold block truncate">{openingMatch.teamAway.name}</span>
              </button>
            </div>
          </div>

          {/* 3. Choose Player (Quick Tap Chips) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-black uppercase tracking-wider text-card-muted">
                3. {lang === 'ml' ? 'കളിക്കാരൻ (ടാപ്പ് ചെയ്യുക)' : 'Player (Tap to Select)'}
              </label>
              {selectedPlayer && (
                <span className="text-[11px] font-bold text-royal dark:text-sky">
                  ✓ {selectedPlayer}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 rounded-2xl border border-surface-border dark:border-navy-700 bg-surface-light/50 dark:bg-navy-800/50">
              {currentSquad.players.map((p) => {
                const isSelected = selectedPlayer === p.name;
                return (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => handleSelectPlayer(p.name)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 active:scale-95 ${
                      isSelected
                        ? 'bg-royal text-white shadow-xs'
                        : 'bg-white dark:bg-navy-700 border border-surface-border dark:border-navy-600 text-card-title hover:border-royal/50'
                    }`}
                  >
                    <span className="text-[10px] opacity-75">#{p.num}</span>
                    <span>{p.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Player Name Option */}
            <div className="mt-2">
              <input
                type="text"
                value={customPlayerName}
                onChange={(e) => {
                  setCustomPlayerName(e.target.value);
                  setSelectedPlayer('');
                }}
                placeholder={lang === 'ml' ? 'മറ്റൊരു കളിക്കാരന്റെ പേര് ടൈപ്പ് ചെയ്യുക...' : 'Or type custom player name...'}
                className="w-full p-2.5 text-xs font-bold rounded-xl border bg-white dark:bg-navy-800 border-surface-border dark:border-navy-700 text-card-title shadow-2xs"
              />
            </div>
          </div>

          {/* 4. Match Minute & Reason */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-card-muted block mb-1.5">
                4. {lang === 'ml' ? 'മിനിറ്റ്' : 'Match Minute'}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="70"
                  value={minute}
                  onChange={(e) => setMinute(parseInt(e.target.value, 10) || 1)}
                  className="w-24 p-2.5 text-sm font-black font-mono rounded-xl border bg-white dark:bg-navy-800 border-surface-border dark:border-navy-700 text-card-title shadow-2xs text-center"
                />
                <span className="text-xs text-card-muted font-bold font-mono">
                  {lang === 'ml' ? 'മിനിറ്റിൽ' : "minute (1'-60')"}
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-wider text-card-muted block mb-1.5">
                5. {lang === 'ml' ? 'കാരണം (ഓപ്ഷണൽ)' : 'Reason (Optional)'}
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Tactical foul"
                className="w-full p-2.5 text-xs font-bold rounded-xl border bg-white dark:bg-navy-800 border-surface-border dark:border-navy-700 text-card-title shadow-2xs"
              />
            </div>
          </div>

          {/* Quick reason suggestions */}
          <div className="flex flex-wrap gap-1">
            {COMMON_REASONS.map((r) => (
              <button
                key={r.en}
                type="button"
                onClick={() => setReason(lang === 'ml' ? r.ml : r.en)}
                className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-surface-light dark:bg-navy-800 hover:bg-surface-border dark:hover:bg-navy-700 text-card-muted border border-surface-border dark:border-navy-700 transition"
              >
                + {lang === 'ml' ? r.ml : r.en}
              </button>
            ))}
          </div>

          {/* Submit Action Button */}
          <button
            type="button"
            onClick={handleSaveCard}
            className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm uppercase tracking-wider text-white shadow-lg transition active:scale-98 flex items-center justify-center gap-2 ${
              cardType === 'yellow_card'
                ? 'bg-amber-500 hover:bg-amber-600 text-navy-950 font-black'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>
              {lang === 'ml'
                ? `${cardType === 'yellow_card' ? 'മഞ്ഞ കാർഡ്' : 'ചുവപ്പ് കാർഡ്'} രേഖപ്പെടുത്തുക`
                : `Publish ${cardType === 'yellow_card' ? 'Yellow Card' : 'Red Card'}`}
            </span>
          </button>

          {/* Existing Cards Management (Allows deleting mistaken cards) */}
          {existingCards.length > 0 && (
            <div className="pt-3 border-t border-surface-border dark:border-navy-700">
              <span className="text-[11px] font-black uppercase tracking-wider text-card-muted block mb-2">
                {lang === 'ml' ? 'ഈ മത്സരത്തിൽ രേഖപ്പെടുത്തിയ കാർഡുകൾ' : 'Cards Recorded in Current Match'} ({existingCards.length})
              </span>
              <div className="space-y-1.5">
                {existingCards.map((c) => {
                  const teamName = c.team === 'away' ? 'New Malaya' : 'Udaya';
                  return (
                    <div
                      key={c.id}
                      className="flex items-center justify-between p-2 rounded-xl border border-surface-border dark:border-navy-700 bg-surface-light/40 dark:bg-navy-800/40 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span>{c.type === 'yellow_card' ? '🟨' : '🟥'}</span>
                        <span className="font-mono font-bold text-royal dark:text-sky">{c.minute}'</span>
                        <span className="font-bold">{c.player}</span>
                        <span className="text-[10px] text-card-muted">({teamName})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteEvent(c.id)}
                        className="p-1 rounded-lg text-red-500 hover:bg-red-500/10 transition"
                        title="Delete Card"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
