import React, { useState, useEffect } from 'react';
import { X, Check, Trash2, AlertCircle, ShieldAlert, UserCheck } from 'lucide-react';
import { getStoredMatchState, getCalculatedMatchTime } from '../utils/matchStateManager';
import { 
  saveDisciplinaryRecord, 
  removeDisciplinaryRecord, 
  getAllDisciplinaryRecords 
} from '../utils/disciplinaryManager';
import { openingMatch } from '../data/tournamentData';
import TeamLogo from './TeamLogo';

// Official Match Squads for Quick Player Selection (Day 1 Opening Match Stars & Key Clubs)
const SQUADS_BY_CLUB = {
  'BASE PERUMBAVUR': {
    name: 'BASE PERUMBAVUR',
    nameMl: 'ബേസ് പെരുമ്പാവൂർ',
    shortName: 'BASE',
    isDay1Match: true,
    players: [
      { num: 10, name: 'Ashik Usman', pos: 'FWD', isStar: true },
      { num: 7, name: 'Aju Ashi', pos: 'WGR', isStar: true },
      { num: 4, name: 'Muhammed Sajad', pos: 'DEF', isStar: true },
      { num: 11, name: 'Ajmal', pos: 'MID', isStar: true },
      { num: 9, name: 'Fahad', pos: 'ST', isStar: true },
      { num: 1, name: 'Aneesh', pos: 'GK', isStar: false },
      { num: 5, name: 'Musthafa', pos: 'CB', isStar: false },
      { num: 6, name: 'Jameel', pos: 'SW', isStar: false },
      { num: 8, name: 'Nabeel', pos: 'CM', isStar: false },
      { num: 22, name: 'Suhair', pos: 'SUB', isStar: false },
      { num: 14, name: 'Nizar', pos: 'SUB', isStar: false }
    ]
  },
  'KRSC KOZHIKKODE': {
    name: 'KRSC KOZHIKKODE',
    nameMl: 'കെ.ആർ.എസ്.സി കോഴിക്കോട്',
    shortName: 'KRSC',
    isDay1Match: true,
    players: [
      { num: 10, name: 'Abdul Vahid C', pos: 'FWD', isStar: true },
      { num: 1, name: 'Jithin', pos: 'GK', isStar: false },
      { num: 4, name: 'Midhun', pos: 'DEF', isStar: false },
      { num: 7, name: 'Favas', pos: 'MID', isStar: false },
      { num: 9, name: 'Vysakh', pos: 'ST', isStar: false },
      { num: 11, name: 'Arjun', pos: 'WGR', isStar: false },
      { num: 14, name: 'Abhijith', pos: 'SUB', isStar: false }
    ]
  },
  'UDAYA PARAMBIL PEEDIKA': {
    name: 'UDAYA PARAMBIL PEEDIKA',
    nameMl: 'ഉദയ പറമ്പിൽ പീടിക',
    shortName: 'UDAYA',
    isDay1Match: false,
    players: [
      { num: 4, name: 'Shameer K.', pos: 'CB', isStar: true },
      { num: 9, name: 'Ibrahim Soumahoro', pos: 'ST', isStar: true },
      { num: 10, name: 'Asif Ali', pos: 'CF', isStar: true },
      { num: 1, name: 'Shamseer', pos: 'GK', isStar: false },
      { num: 3, name: 'Faisal M.', pos: 'RB', isStar: false },
      { num: 7, name: 'Riyas K.', pos: 'CM', isStar: false },
      { num: 8, name: 'Suhail P.', pos: 'AM', isStar: false },
      { num: 13, name: 'Junaid', pos: 'SUB', isStar: false },
      { num: 11, name: 'Salman', pos: 'SUB', isStar: false },
      { num: 14, name: 'Anas', pos: 'SUB', isStar: false }
    ]
  },
  'SUPER STUDIO MALAPPURAM': {
    name: 'SUPER STUDIO MALAPPURAM',
    nameMl: 'സൂപ്പർ സ്റ്റുഡിയോ മലപ്പുറം',
    shortName: 'SUPER STUDIO',
    isDay1Match: false,
    players: [
      { num: 11, name: 'Ashique K.', pos: 'WGR', isStar: true },
      { num: 7, name: 'Rameez', pos: 'MID', isStar: true },
      { num: 10, name: 'Suhail', pos: 'FWD', isStar: false },
      { num: 1, name: 'Sajeer', pos: 'GK', isStar: false }
    ]
  },
  'LINSHA MEDICALS MANNARKKAD': {
    name: 'LINSHA MEDICALS MANNARKKAD',
    nameMl: 'ലിൻഷാ മെഡിക്കൽസ്',
    shortName: 'LINSHA',
    isDay1Match: false,
    players: [
      { num: 10, name: 'Muhammed Faslu', pos: 'ST', isStar: true },
      { num: 10, name: 'Shameer Babu', pos: 'WGR', isStar: true },
      { num: 10, name: 'Salman Faris', pos: 'MID', isStar: true },
      { num: 10, name: 'Noufal K.', pos: 'AM', isStar: true }
    ]
  }
};

const COMMON_REASONS = [
  { ml: 'ഫൗൾ (Tactical Foul)', en: 'Tactical Foul' },
  { ml: 'വാക്കുതർക്കം (Dissent)', en: 'Dissent' },
  { ml: 'റഫ് ടാക്കിൾ (Rough Tackle)', en: 'Rough Tackle' },
  { ml: 'ഹാൻഡ് ബോൾ (Handball)', en: 'Handball' },
  { ml: 'ടൈം വേസ്റ്റിംഗ് (Time Wasting)', en: 'Time Wasting' },
  { ml: 'അപകടകരമായ ഫൗൾ (Serious Foul Play)', en: 'Serious Foul Play' }
];

export default function AddCardModal({ isOpen, onClose, isDarkMode, lang }) {
  if (!isOpen) return null;

  const currentMatchState = getStoredMatchState();
  const currentClock = getCalculatedMatchTime(currentMatchState);

  const [cardType, setCardType] = useState('red_card'); // Default to red_card per user priority
  const [selectedClubKey, setSelectedClubKey] = useState('BASE PERUMBAVUR');
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [selectedPlayerObj, setSelectedPlayerObj] = useState(null);
  const [customPlayerName, setCustomPlayerName] = useState('');
  const [minute, setMinute] = useState(() => currentClock.minuteOnly || 25);
  const [reason, setReason] = useState('Tactical Foul');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [existingCards, setExistingCards] = useState(() => getAllDisciplinaryRecords());

  // Listen for live updates
  useEffect(() => {
    const refresh = () => setExistingCards(getAllDisciplinaryRecords());
    window.addEventListener('kasc_disciplinary_updated', refresh);
    window.addEventListener('kasc_match_state_updated', refresh);
    return () => {
      window.removeEventListener('kasc_disciplinary_updated', refresh);
      window.removeEventListener('kasc_match_state_updated', refresh);
    };
  }, []);

  const currentClub = SQUADS_BY_CLUB[selectedClubKey] || SQUADS_BY_CLUB['BASE PERUMBAVUR'];

  const handleSelectPlayer = (playerObj) => {
    setSelectedPlayer(playerObj.name);
    setSelectedPlayerObj(playerObj);
    setCustomPlayerName('');
  };

  const handleSaveCard = () => {
    const finalPlayer = (selectedPlayer || customPlayerName || '').trim();
    if (!finalPlayer) {
      setFeedbackMsg(lang === 'ml' ? 'ദയവായി കളിക്കാരന്റെ പേര് തിരഞ്ഞെടുക്കുക' : 'Please select or enter a player name');
      return;
    }

    const saved = saveDisciplinaryRecord({
      cardType,
      playerName: finalPlayer,
      playerNumber: selectedPlayerObj?.num || null,
      team: selectedClubKey === 'KRSC KOZHIKKODE' ? 'home' : 'away',
      teamName: currentClub.name,
      minute: Number(minute) || 1,
      reason: reason || (cardType === 'yellow_card' ? 'Yellow card caution' : 'Red card ejection'),
      matchId: openingMatch.id,
      matchTitle: `${openingMatch.teamHome.name} vs ${openingMatch.teamAway.name}`
    });

    setExistingCards(getAllDisciplinaryRecords());

    setFeedbackMsg(
      lang === 'ml'
        ? `✅ ${cardType === 'yellow_card' ? 'മഞ്ഞ കാർഡ്' : '🟥 ചുവപ്പ് കാർഡ്'} ഡാറ്റാബേസിൽ രേഖപ്പെടുത്തി: ${finalPlayer}`
        : `✅ ${cardType === 'yellow_card' ? 'Yellow Card' : '🟥 Red Card'} saved to database: ${finalPlayer}`
    );

    setTimeout(() => {
      setFeedbackMsg('');
      onClose();
    }, 1200);
  };

  const handleDeleteCard = (cardId) => {
    removeDisciplinaryRecord(cardId);
    setExistingCards(getAllDisciplinaryRecords());
    setFeedbackMsg(lang === 'ml' ? 'കാർഡ് ഡാറ്റാബേസിൽ നിന്ന് ഒഴിവാക്കി' : 'Card removed from database');
    setTimeout(() => setFeedbackMsg(''), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
      <div
        className={`relative w-full max-w-lg max-h-[92vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden ${
          isDarkMode ? 'bg-navy-900 border-navy-700 text-white' : 'bg-white border-surface-border text-navy-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-surface-border dark:border-navy-700">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shadow-xs ${
              cardType === 'red_card' ? 'bg-red-600/20 text-red-500' : 'bg-amber-500/20 text-amber-500'
            }`}>
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black font-sports uppercase tracking-wider text-card-title">
                {lang === 'ml' ? 'റഫറി ഡിസിപ്ലിനറി കാർഡ് രജിസ്റ്റർ' : 'Referee Disciplinary Booking'}
              </h3>
              <p className="text-[11px] text-card-muted font-medium">
                {lang === 'ml' ? 'ഡാറ്റാബേസിൽ തത്സമയം രേഖപ്പെടുത്തുന്നു' : 'Stores in persistent database & syncs live'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-light dark:bg-navy-800 hover:bg-surface-border dark:hover:bg-navy-700 text-card-title flex items-center justify-center transition active:scale-95"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {feedbackMsg && (
            <div className="p-3 rounded-2xl bg-emerald-600/15 border border-emerald-500/30 text-emerald-500 text-xs font-bold flex items-center gap-2 animate-fadeIn">
              <Check className="w-4 h-4 shrink-0" />
              <span>{feedbackMsg}</span>
            </div>
          )}

          {/* 1. Select Card Type (Red vs Yellow) */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-card-muted block mb-1.5">
              1. {lang === 'ml' ? 'കാർഡ് തരം തിരഞ്ഞെടുക്കുക' : 'Select Card Type'}
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setCardType('red_card')}
                className={`py-3 px-3 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition border ${
                  cardType === 'red_card'
                    ? 'bg-red-600 text-white border-red-700 shadow-md ring-2 ring-red-500/50 scale-[1.02]'
                    : 'bg-surface-light dark:bg-navy-800 border-surface-border dark:border-navy-700 text-card-muted hover:text-card-title'
                }`}
              >
                <span className="w-3.5 h-4.5 rounded-xs bg-red-600 border border-white inline-block shadow-2xs" />
                <span>{lang === 'ml' ? '🟥 റെഡ് കാർഡ് (പുറത്താക്കൽ)' : '🟥 Red Card (Expulsion)'}</span>
              </button>

              <button
                type="button"
                onClick={() => setCardType('yellow_card')}
                className={`py-3 px-3 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition border ${
                  cardType === 'yellow_card'
                    ? 'bg-amber-500 text-navy-950 border-amber-600 shadow-md ring-2 ring-amber-400/50 scale-[1.02]'
                    : 'bg-surface-light dark:bg-navy-800 border-surface-border dark:border-navy-700 text-card-muted hover:text-card-title'
                }`}
              >
                <span className="w-3.5 h-4.5 rounded-xs bg-amber-400 border border-amber-600 inline-block shadow-2xs" />
                <span>{lang === 'ml' ? '🟨 യെല്ലോ കാർഡ് (മുന്നറിയിപ്പ്)' : '🟨 Yellow Card (Caution)'}</span>
              </button>
            </div>
          </div>

          {/* 2. Select Team */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-card-muted block mb-1.5">
              2. {lang === 'ml' ? 'ടീം തിരഞ്ഞെടുക്കുക' : 'Select Team'}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {Object.keys(SQUADS_BY_CLUB).map((clubKey) => {
                const club = SQUADS_BY_CLUB[clubKey];
                const isSelected = selectedClubKey === clubKey;
                return (
                  <button
                    key={clubKey}
                    type="button"
                    onClick={() => {
                      setSelectedClubKey(clubKey);
                      setSelectedPlayer('');
                      setSelectedPlayerObj(null);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 active:scale-95 border ${
                      isSelected
                        ? 'btn-royal text-white border-blue-700 font-black shadow-xs'
                        : 'bg-surface-light dark:bg-navy-800 text-card-muted border-surface-border dark:border-navy-700 hover:text-card-title'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white p-0.5 border border-slate-300 shrink-0">
                      <TeamLogo teamName={club.name} className="w-full h-full object-contain" />
                    </div>
                    <span>{club.shortName}</span>
                    {club.isDay1Match && (
                      <span className="text-[9px] px-1 rounded-sm bg-gold text-navy-950 font-black">
                        Day 1
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Quick Player Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-card-muted">
                3. {lang === 'ml' ? 'കളിക്കാരനെ തിരഞ്ഞെടുക്കുക' : 'Select Player'} ({currentClub.shortName})
              </label>
              {selectedPlayer && (
                <span className="text-[11px] font-bold text-emerald-500 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" />
                  {selectedPlayer} #{selectedPlayerObj?.num || ''}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-40 overflow-y-auto p-1 bg-surface-light/40 dark:bg-navy-800/40 rounded-2xl border border-surface-border dark:border-navy-700">
              {currentClub.players.map((p) => {
                const isSelected = selectedPlayer === p.name;
                return (
                  <button
                    key={`${p.num}-${p.name}`}
                    type="button"
                    onClick={() => handleSelectPlayer(p)}
                    className={`p-2 rounded-xl text-left transition flex items-center gap-2 border text-xs ${
                      isSelected
                        ? cardType === 'red_card'
                          ? 'bg-red-600 text-white border-red-700 font-black shadow-xs'
                          : 'bg-amber-500 text-navy-950 border-amber-600 font-black shadow-xs'
                        : 'bg-white dark:bg-navy-900 border-surface-border dark:border-navy-700 hover:border-royal text-card-title'
                    }`}
                  >
                    <span className="w-6 h-6 rounded-md bg-navy-950 text-gold font-mono font-black text-[10px] flex items-center justify-center shrink-0">
                      #{p.num}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold truncate text-[11px] leading-tight">{p.name}</p>
                      <span className="text-[9px] text-card-muted opacity-80">{p.pos}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Player Name Input */}
            <div className="pt-2">
              <input
                type="text"
                value={customPlayerName}
                onChange={(e) => {
                  setCustomPlayerName(e.target.value);
                  setSelectedPlayer('');
                  setSelectedPlayerObj(null);
                }}
                placeholder={lang === 'ml' ? 'അല്ലെങ്കിൽ മറ്റൊരു പേര് ടൈപ്പ് ചെയ്യുക (Custom Player Name)...' : 'Or type custom player name...'}
                className="w-full p-2.5 text-xs font-bold rounded-xl border bg-white dark:bg-navy-800 border-surface-border dark:border-navy-700 text-card-title shadow-2xs placeholder-card-muted"
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
                  {lang === 'ml' ? 'മിനിറ്റിൽ (1-60)' : "minute (1'-60')"}
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-wider text-card-muted block mb-1.5">
                5. {lang === 'ml' ? 'കാരണം' : 'Reason / Note'}
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
                className="px-2 py-1 rounded-lg text-[10px] font-bold bg-surface-light dark:bg-navy-800 hover:bg-surface-border dark:hover:bg-navy-700 text-card-muted border border-surface-border dark:border-navy-700 transition"
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
                : 'bg-red-600 hover:bg-red-700 shadow-red-600/30 ring-2 ring-red-500/50'
            }`}
          >
            <Check className="w-5 h-5" />
            <span>
              {lang === 'ml'
                ? `${cardType === 'yellow_card' ? 'മഞ്ഞ കാർഡ്' : '🟥 ചുവപ്പ് കാർഡ്'} ഡാറ്റാബേസിൽ രേഖപ്പെടുത്തുക`
                : `Store ${cardType === 'yellow_card' ? 'Yellow Card' : 'Red Card'} in Database`}
            </span>
          </button>

          {/* Existing Cards in Database (Allows referee to view and delete mistaken cards) */}
          {existingCards.length > 0 && (
            <div className="pt-3 border-t border-surface-border dark:border-navy-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-card-muted">
                  {lang === 'ml' ? 'ഡാറ്റാബേസിലെ കാർഡുകൾ' : 'Cards Stored in Database'} ({existingCards.length})
                </span>
                <span className="text-[10px] text-card-muted font-bold font-mono">Live Sync</span>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {existingCards.map((c) => {
                  const isRed = c.cardType === 'red_card';
                  return (
                    <div
                      key={c.id}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition ${
                        isRed
                          ? 'bg-red-500/10 border-red-500/30 text-card-title'
                          : 'bg-amber-500/10 border-amber-500/30 text-card-title'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-base shrink-0">{isRed ? '🟥' : '🟨'}</span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-mono font-bold text-royal dark:text-sky">{c.minute}'</span>
                            <span className="font-bold truncate">{c.playerName || c.player}</span>
                            <span className="text-[10px] text-card-muted">({c.teamName || c.team})</span>
                          </div>
                          {c.reason && (
                            <p className="text-[10px] text-card-muted truncate font-medium">{c.reason}</p>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteCard(c.id)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/20 transition shrink-0 ml-2"
                        title={lang === 'ml' ? 'കാർഡ് ഒഴിവാക്കുക' : 'Delete Card from Database'}
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
