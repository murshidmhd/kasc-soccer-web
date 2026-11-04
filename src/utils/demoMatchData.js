/**
 * Development-Only Demo Simulation Data
 * Strictly isolated so this file is NOT bundled into production builds.
 */

export const demoOfficialMatchState = {
  officialScoreHome: 2,
  officialScoreAway: 1,
  matchSeconds: 30 * 60 + 30, // 30:30 in 2nd Half
  matchMinute: 31,
  isTimerRunning: true,
  timerStartedAt: Date.now(),
  status: '2ND_HALF',
  isVerified: true,
  lastUpdated: new Date().toISOString(),
  updatedBy: 'Demo Simulation Mode',
  isCrowdLocked: false,
  crowdReports: {
    home: 18,
    away: 9,
    total: 27
  },
  events: [
    { id: 'evt-1', minute: 12, team: 'home', player: 'Ibrahim Soumahoro', type: 'goal', text: 'Curler into top corner', isOfficial: true },
    { id: 'evt-2', minute: 24, team: 'away', player: 'Jameel (New Malaya #6)', type: 'goal', text: 'Equalizer through penalty rebound', isOfficial: true },
    { id: 'evt-3', minute: 30, team: 'home', player: 'Riyas K. (Captain)', type: 'goal', text: 'Header right before Half-Time whistle', isOfficial: true }
  ]
};

export const sampleDemoCommentary = [
  { min: "30'", type: "whistle", textMl: 'ഹാഫ് ടൈം വിസിൽ! ആദ്യ പകുതിയിൽ ഉദയ പറമ്പിൽ പീടിക 2 - 1 ന് മുന്നിൽ.', textEn: 'Half-time whistle! Udaya leads 2-1 after a breathless first half.' },
  { min: "26'", type: "card", textMl: '🟨 യെല്ലോ കാർഡ്: ന്യൂ മലയ മിഡ്ഫീൽഡർക്ക് കൗണ്ടർ തടഞ്ഞതിന് റഫറിയുടെ മുന്നറിയിപ്പ്.', textEn: '🟨 Yellow Card: Tactical foul stopping a dangerous break.' },
  { min: "24'", type: "goal", textMl: '⚽ ഗോൾ!! ഷമീർ കെ. (ഉദയ). ഡി-ബോക്സിന് വെളിയിൽ നിന്നുള്ള ബുള്ളറ്റ് വോളി!', textEn: '⚽ GOAL!! Shameer K. (Udaya) with a screamer into the top corner!' },
  { min: "18'", type: "save", textMl: '🧤 മിന്നൽ സേവ്! ന്യൂ മലയ സ്ട്രൈക്കറുടെ ഹെഡർ ഉദയ ഗോൾകീപ്പർ ഷംസീർ തട്ടിയകറ്റി.', textEn: '🧤 Sensational reflex save by Udaya keeper Shamseer to deny an equalizer!' },
  { min: "12'", type: "goal", textMl: '⚽ ഗോൾ!! ഇബ്രാഹിം സുമഹോറോ (ഉദയ). കിടിലൻ ചിപ്പ് ഫിനിഷ്.', textEn: '⚽ GOAL!! Ibrahim Soumahoro (Udaya) chips the keeper with sublime composure.' },
  { min: "7'", type: "attack", textMl: 'ന്യൂ മലയയുടെ കൗണ്ടർ അറ്റാക്ക്! ഉദയ പ്രതിരോധം തടഞ്ഞു.', textEn: 'Dangerous counter-attack by New Malaya, snuffed out by Udaya defense.' },
  { min: "1'", type: "start", textMl: '🟢 പെരുവള്ളൂർ സ്റ്റേഡിയത്തിൽ ആവേശകരമായ ഉദ്ഘാടന മത്സരത്തിന് തുടക്കം!', textEn: '🟢 Kickoff under floodlights at Peruvallur Panjayath Stadium!' }
];
