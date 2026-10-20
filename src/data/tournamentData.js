export const tournamentInfo = {
  name: "പെരുവള്ളൂർ കപ്പ്",
  nameEn: "PERUVALLUR CUP",
  season: "SEASON 7",
  fullTitle: "UDAYA KASC SOCCER - ALL INDIA SEVENS FOOTBALL TOURNAMENT",
  organizersMalayalam: "KASC പെരുവള്ളൂരും ഉദയ പറമ്പിൽ പീടികയും സംയുക്തമായി സംഘടിപ്പിക്കുന്ന",
  organizersEn: "Jointly Organized by KASC Peruvallur & Udaya Parambil Peedika",
  affiliation: "SFA (Sevens Football Association) Affiliated",
  taglineMl: "2026-27 സീസണിലെ ആദ്യ അഖിലേന്ത്യാ സെവൻസ് ഫുട്ബോൾ ടൂർണ്ണമെന്റ് പറമ്പിൽ പീടികയിൽ",
  taglineEn: "The Premier Opening All-India Sevens Football Tournament of Season 2026-27",
  startDate: "2026-11-06T20:00:00",
  startDateDisplay: "2026 November 06, Friday",
  endDateDisplay: "2026 December 06",
  durationMalayalam: "നവംബർ 6 മുതൽ ഡിസംബർ 6 വരെ",
  venue: "Peruvallur Panjayath Stadium",
  venueMalayalam: "പെരുവള്ളൂർ പഞ്ചായത്ത് സ്റ്റേഡിയം, പറമ്പിൽ പീടിക",
  location: "Parambil Peedika, Malappuram, Kerala",
  googleMapsUrl: "https://maps.google.com/?q=Peruvallur+Panjayath+Stadium+Parambil+Peedika",
  mediaContact: "9961878508",
  matchTime: "8:00 PM IST (Every Night)"
};

export const openingMatch = {
  id: "match-01",
  stage: "Opening Blockbuster (Day 1)",
  date: "Friday, 06 Nov 2026",
  time: "8:00 PM IST",
  venue: "Peruvallur Panjayath Stadium",
  teamHome: {
    id: "udaya-peruvallur",
    name: "UDAYA PERUVALLUR",
    nameMl: "ഉദയ പെരുവള്ളൂർ",
    shortName: "UDAYA",
    city: "Peruvallur",
    color: "#0284c7",
    textColor: "#ffffff",
    badgeBg: "from-sky-600 to-blue-900",
    kit: "Royal Blue & Navy",
    manager: "K. M. Basheer",
    form: ["W", "W", "D", "W", "W"]
  },
  teamAway: {
    id: "saban-kottakkal",
    name: "SABAN FC KOTTAKKAL",
    nameMl: "സബാൻ എഫ്.സി കോട്ടക്കൽ",
    shortName: "SABAN",
    city: "Kottakkal",
    color: "#eab308",
    textColor: "#000000",
    badgeBg: "from-amber-400 to-yellow-600",
    kit: "Gold & Black",
    manager: "Saban Master",
    form: ["W", "W", "W", "L", "W"]
  }
};

export const fixtures = [
  {
    id: "m1",
    day: "Day 1",
    date: "06 Nov 2026",
    time: "08:00 PM",
    stage: "Round 1",
    team1: "UDAYA Peruvallur",
    team2: "SABAN FC Kottakkal",
    status: "Upcoming",
    score1: null,
    score2: null,
    badge1Color: "from-sky-500 to-blue-800",
    badge2Color: "from-amber-400 to-yellow-600",
    stadium: "Peruvallur Panjayath Stadium"
  },
  {
    id: "m2",
    day: "Day 2",
    date: "07 Nov 2026",
    time: "08:00 PM",
    stage: "Round 1",
    team1: "FIFA Manjeri",
    team2: "Linsha Medicals Tirur",
    status: "Upcoming",
    score1: null,
    score2: null,
    badge1Color: "from-red-600 to-rose-900",
    badge2Color: "from-emerald-500 to-teal-800",
    stadium: "Peruvallur Panjayath Stadium"
  },
  {
    id: "m3",
    day: "Day 3",
    date: "08 Nov 2026",
    time: "08:00 PM",
    stage: "Round 1",
    team1: "Al-Madina Cherpulassery",
    team2: "Royal Travel Kozhikode",
    status: "Upcoming",
    score1: null,
    score2: null,
    badge1Color: "from-purple-600 to-indigo-900",
    badge2Color: "from-cyan-500 to-blue-700",
    stadium: "Peruvallur Panjayath Stadium"
  },
  {
    id: "m4",
    day: "Day 4",
    date: "09 Nov 2026",
    time: "08:00 PM",
    stage: "Round 1",
    team1: "Usha Thrissur",
    team2: "Black & White Kozhikode",
    status: "Upcoming",
    score1: null,
    score2: null,
    badge1Color: "from-orange-500 to-red-800",
    badge2Color: "from-zinc-700 to-black",
    stadium: "Peruvallur Panjayath Stadium"
  },
  {
    id: "m5",
    day: "Day 5",
    date: "10 Nov 2026",
    time: "08:00 PM",
    stage: "Round 1",
    team1: "Super Studio Malappuram",
    team2: "Gymkhana Thrissur",
    status: "Upcoming",
    score1: null,
    score2: null,
    badge1Color: "from-blue-600 to-indigo-900",
    badge2Color: "from-amber-600 to-orange-900",
    stadium: "Peruvallur Panjayath Stadium"
  },
  {
    id: "m6",
    day: "Day 6",
    date: "11 Nov 2026",
    time: "08:00 PM",
    stage: "Round 1",
    team1: "Town Team Areekode",
    team2: "Moon Star Kalpakanchery",
    status: "Upcoming",
    score1: null,
    score2: null,
    badge1Color: "from-green-600 to-emerald-900",
    badge2Color: "from-sky-400 to-blue-600",
    stadium: "Peruvallur Panjayath Stadium"
  }
];

export const participatingTeams = [
  { name: "UDAYA Peruvallur", city: "Peruvallur", captain: "Riyas K.", starPlayer: "Ibrahim (Ivory Coast)", gradient: "from-sky-600 to-blue-900" },
  { name: "SABAN FC Kottakkal", city: "Kottakkal", captain: "Shameer", starPlayer: "Ousmane (Ghana)", gradient: "from-amber-400 to-yellow-600" },
  { name: "FIFA Manjeri", city: "Manjeri", captain: "Ashiq", starPlayer: "Junior Toure", gradient: "from-rose-600 to-red-900" },
  { name: "Linsha Tirur", city: "Tirur", captain: "Faslu", starPlayer: "Diallo", gradient: "from-emerald-500 to-green-800" },
  { name: "Al-Madina Cherpulassery", city: "Cherpulassery", captain: "Navas", starPlayer: "Kante", gradient: "from-purple-600 to-indigo-900" },
  { name: "Royal Travel Kozhikode", city: "Kozhikode", captain: "Arjun", starPlayer: "Moussa", gradient: "from-cyan-500 to-blue-800" },
  { name: "Super Studio Malappuram", city: "Malappuram", captain: "Sameer", starPlayer: "Traore", gradient: "from-blue-600 to-indigo-900" },
  { name: "Usha Thrissur", city: "Thrissur", captain: "Nikhil", starPlayer: "Emmanuel", gradient: "from-orange-500 to-amber-800" }
];

export const topScorersPreview = [
  { rank: 1, name: "Ibrahim Soumahoro", team: "UDAYA Peruvallur", goals: 0, matches: 0, origin: "Ivory Coast", flag: "🇨🇮", category: "Overseas Marquee" },
  { rank: 2, name: "Shameer Kottakkal", team: "SABAN FC Kottakkal", goals: 0, matches: 0, origin: "Malappuram", flag: "🇮🇳", category: "Homegrown Striker" },
  { rank: 3, name: "Junior Toure", team: "FIFA Manjeri", goals: 0, matches: 0, origin: "Ghana", flag: "🇬🇭", category: "Overseas Marquee" },
  { rank: 4, name: "Muhammed Faslu", team: "Linsha Tirur", goals: 0, matches: 0, origin: "Tirur, Malappuram", flag: "🇮🇳", category: "Homegrown Striker" }
];

export const sponsors = [
  { name: "Official Club Partner", tier: "Title", desc: "UDAYA Parambil Peedika & KASC Peruvallur" },
  { name: "Sevens Football Association", tier: "Governing Body", desc: "SFA Approved Tournament" },
  { name: "Gulf Expat Fans Club", tier: "Diaspora Partner", desc: "UAE, Saudi & Qatar Pravasi Koottayma" },
  { name: "Media Desk Hotline", tier: "Broadcast & Media", desc: "Call / WhatsApp: 9961878508" }
];
