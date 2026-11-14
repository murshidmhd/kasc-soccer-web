export const tournamentInfo = {
  name: "അഖിലേന്ത്യാ സെവൻസ് ടൂർണ്ണമെന്റ്",
  nameEn: "ALL INDIA SEVENS TOURNAMENT",
  season: "SEASON 7",
  fullTitle: "UDAYA & KASC FOOTBALL - ALL INDIA SEVENS FOOTBALL TOURNAMENT",
  organizersMalayalam: "ഉദയ പറമ്പിൽ പീടികയും KASC പെരുവള്ളൂരും സംയുക്തമായി സംഘടിപ്പിക്കുന്ന",
  organizersEn: "Organized by UDAYA Parambil Peedika & KASC Peruvallur",
  affiliation: "SFA (Sevens Football Association) Affiliated",
  taglineMl: "2026-27 സീസണിലെ ആദ്യ അഖിലേന്ത്യാ സെവൻസ് ഫുട്ബോൾ ടൂർണ്ണമെന്റ് പറമ്പിൽ പീടികയിൽ",
  taglineEn: "The Premier Opening All-India Sevens Football Tournament of Season 2026-27",
  startDate: "2026-11-06T20:45:00",
  startDateDisplay: "2026 November 06, Friday",
  endDateDisplay: "2026 December 06",
  durationMalayalam: "നവംബർ 6 മുതൽ ഡിസംബർ 6 വരെ",
  venue: "Peruvallur Panjayath Stadium",
  venueMalayalam: "പെരുവള്ളൂർ പഞ്ചായത്ത് സ്റ്റേഡിയം, പറമ്പിൽ പീടിക",
  location: "Parambil Peedika, Malappuram, Kerala",
  googleMapsUrl: "https://maps.google.com/?q=Peruvallur+Panjayath+Stadium+Parambil+Peedika",
  mediaContact: "UDAYA & KASC Committee Desk",
  matchTime: "8:45 PM IST (Every Night)"
};

export const openingMatch = {
  id: "match-01",
  stage: "Opening Match (Day 1)",
  date: "Friday, 06 Nov 2026",
  time: "8:45 PM IST",
  venue: "Peruvallur Panjayath Stadium",
  venueMl: "പെരുവള്ളൂർ പഞ്ചായത്ത് സ്റ്റേഡിയം, പറമ്പിൽ പീടിക",
  teamHome: {
    id: "krsc-kozhikkode",
    name: "KRSC KOZHIKKODE",
    nameMl: "കെ.ആർ.എസ്.സി കോഴിക്കോട്",
    shortName: "KRSC",
    city: "Kozhikode",
    color: "#EAB308",
    textColor: "#ffffff",
    badgeBg: "from-amber-500 to-red-800",
    kit: "Yellow & Red (KRSC #10)",
    manager: "Rujeesh",
    form: ["W", "W", "D", "W", "W"]
  },
  teamAway: {
    id: "base-perumbavur",
    name: "BASE PERUMBAVUR",
    nameMl: "ബേസ് പെരുമ്പാവൂർ",
    shortName: "BASE",
    city: "Perumbavoor",
    color: "#1E293B",
    textColor: "#ffffff",
    badgeBg: "from-zinc-800 to-black",
    kit: "White & Blue (BASE #7)",
    manager: "Sujith",
    form: ["W", "D", "W", "W", "L"]
  }
};

export const fixtures = [
  {
    id: "m1",
    day: "Day 1",
    date: "06 Nov 2026",
    time: "08:45 PM",
    stage: "Round 1 (Opening Match)",
    team1: "KRSC KOZHIKKODE",
    team2: "BASE PERUMBAVUR",
    status: "Completed",
    score1: 1,
    score2: 0,
    confirmed: true,
    badge1Color: "from-amber-500 to-red-800",
    badge2Color: "from-zinc-800 to-black",
    stadium: "Peruvallur Panjayath Stadium",
    winner: "KRSC KOZHIKKODE",
    motm: "Matti",
    motmTeam: "KRSC KOZHIKKODE",
    winnerPosterUrl: "/match1_winner_poster.jpg",
    motmPosterUrl: "/match1_motm_matti.jpg"
  },
  {
    id: "m2",
    day: "Day 2",
    date: "07 Nov 2026",
    time: "08:45 PM",
    stage: "Round 1 (Match 2)",
    team1: "KMG MAVOOR",
    team2: "SHOOTERS PADANNA",
    status: "Completed",
    score1: 3,
    score2: 1,
    confirmed: true,
    badge1Color: "from-green-700 to-emerald-950",
    badge2Color: "from-emerald-500 to-green-950",
    stadium: "Peruvallur Panjayath Stadium",
    winner: "KMG MAVOOR",
    winnerPosterUrl: "/results/match2_kmg_vs_shooters.jpg"
  },
  {
    id: "m3",
    day: "Day 3",
    date: "08 Nov 2026",
    time: "08:45 PM",
    stage: "Round 1 (Match 3)",
    team1: "X8 TOURS CALICUT",
    team2: "AYC UCHARAKKADVU",
    status: "Completed",
    score1: 2,
    score2: 1,
    confirmed: true,
    badge1Color: "from-red-700 to-black",
    badge2Color: "from-cyan-600 to-blue-950",
    stadium: "Peruvallur Panjayath Stadium",
    winner: "X8 TOURS CALICUT",
    winnerPosterUrl: "/results/match3_x8_vs_ayc.jpg"
  },
  {
    id: "m4",
    day: "Day 4",
    date: "09 Nov 2026",
    time: "08:45 PM",
    stage: "Round 1 (Match 4)",
    team1: "SABAN FC KOTTAKKAL",
    team2: "TOWN TEAM AREEKODE",
    status: "Completed",
    score1: 4,
    score2: 0,
    confirmed: true,
    badge1Color: "from-amber-400 to-yellow-600",
    badge2Color: "from-sky-600 to-blue-950",
    stadium: "Peruvallur Panjayath Stadium",
    winner: "SABAN FC KOTTAKKAL",
    winnerPosterUrl: "/results/match4_saban_vs_townteam.jpg"
  },
  {
    id: "m5",
    day: "Day 5",
    date: "10 Nov 2026",
    time: "08:45 PM",
    stage: "Round 1 (Match 5)",
    team1: "ABHILASH FC KUPPOOTH",
    team2: "UNITED FC NELLIKKUTH",
    status: "Completed",
    score1: 1,
    score2: 2,
    confirmed: true,
    badge1Color: "from-blue-700 to-indigo-950",
    badge2Color: "from-blue-800 to-orange-700",
    stadium: "Peruvallur Panjayath Stadium",
    winner: "UNITED FC NELLIKKUTH",
    winnerPosterUrl: "/results/match5_abhilash_vs_united.jpg"
  },
  {
    id: "m6",
    day: "Day 6",
    date: "11 Nov 2026",
    time: "08:45 PM",
    stage: "Round 1 (Match 6)",
    team1: "LINSHA MEDIKKALS MANNARKADU",
    team2: "AFC WAYANAD",
    status: "Completed",
    score1: 2,
    score2: 0,
    confirmed: true,
    badge1Color: "from-emerald-600 to-teal-900",
    badge2Color: "from-red-600 to-amber-700",
    stadium: "Peruvallur Panjayath Stadium",
    winner: "LINSHA MEDIKKALS MANNARKADU",
    winnerPosterUrl: "/results/match6_linsha_vs_afc.jpg"
  },
  {
    id: "m7",
    day: "Day 7",
    date: "12 Nov 2026",
    time: "08:45 PM",
    stage: "Round 1 (Match 7)",
    team1: "USHA FC THRISSUR",
    team2: "I NOV FC MANJERI",
    status: "Completed",
    score1: 1,
    score2: 3,
    confirmed: true,
    badge1Color: "from-red-600 to-rose-900",
    badge2Color: "from-slate-900 to-blue-900",
    stadium: "Peruvallur Panjayath Stadium",
    winner: "I NOV FC MANJERI",
    winnerPosterUrl: "/results/match7_usha_vs_inov.jpg"
  },
  {
    id: "m8",
    day: "Day 8",
    date: "14 Nov 2026",
    time: "08:45 PM",
    stage: "Pre-Quarter (Round of 16)",
    team1: "X8 TOURS CALICUT",
    team2: "REAL FC THENNALA",
    status: "Upcoming",
    score1: null,
    score2: null,
    confirmed: true,
    badge1Color: "from-red-700 to-black",
    badge2Color: "from-sky-400 to-blue-700",
    stadium: "Peruvallur Panjayath Stadium"
  },
  {
    id: "pq-udaya",
    day: "Pre-Quarter",
    date: "Date TBA",
    time: "08:45 PM",
    stage: "Pre-Quarter (Round of 16)",
    team1: "UDAYA PARAMBIL PEEDIKA",
    team2: "Opponent TBA",
    status: "Upcoming",
    score1: null,
    score2: null,
    confirmed: true,
    badge1Color: "from-sky-600 to-blue-900",
    badge2Color: "from-zinc-700 to-zinc-950",
    stadium: "Peruvallur Panjayath Stadium"
  },
  {
    id: "pq-super",
    day: "Pre-Quarter",
    date: "Date TBA",
    time: "08:45 PM",
    stage: "Pre-Quarter (Round of 16)",
    team1: "SUPER STUDIO MALAPPURAM",
    team2: "Opponent TBA",
    status: "Upcoming",
    score1: null,
    score2: null,
    confirmed: true,
    badge1Color: "from-amber-600 to-yellow-900",
    badge2Color: "from-zinc-700 to-zinc-950",
    stadium: "Peruvallur Panjayath Stadium"
  },
  {
    id: "pq-madina",
    day: "Pre-Quarter",
    date: "Date TBA",
    time: "08:45 PM",
    stage: "Pre-Quarter (Round of 16)",
    team1: "AL MADEENA CHERPULASSERI",
    team2: "Opponent TBA",
    status: "Upcoming",
    score1: null,
    score2: null,
    confirmed: true,
    badge1Color: "from-purple-600 to-violet-950",
    badge2Color: "from-zinc-700 to-zinc-950",
    stadium: "Peruvallur Panjayath Stadium"
  },
  {
    id: "qf1",
    day: "Quarter Final 1",
    date: "20 Nov 2026",
    time: "08:45 PM",
    stage: "Quarter Final 1",
    team1: "Winner Pre-Quarter 1",
    team2: "Winner Pre-Quarter 2",
    status: "Upcoming",
    score1: null,
    score2: null,
    confirmed: true,
    badge1Color: "from-amber-500 to-red-800",
    badge2Color: "from-green-700 to-emerald-950",
    stadium: "Peruvallur Panjayath Stadium"
  },
  {
    id: "qf2",
    day: "Quarter Final 2",
    date: "22 Nov 2026",
    time: "08:45 PM",
    stage: "Quarter Final 2",
    team1: "Winner Pre-Quarter 3",
    team2: "Winner Pre-Quarter 4",
    status: "Upcoming",
    score1: null,
    score2: null,
    confirmed: true,
    badge1Color: "from-red-700 to-black",
    badge2Color: "from-amber-400 to-yellow-600",
    stadium: "Peruvallur Panjayath Stadium"
  },
  {
    id: "qf3",
    day: "Quarter Final 3",
    date: "24 Nov 2026",
    time: "08:45 PM",
    stage: "Quarter Final 3",
    team1: "Winner Pre-Quarter 5",
    team2: "Winner Pre-Quarter 6",
    status: "Upcoming",
    score1: null,
    score2: null,
    confirmed: true,
    badge1Color: "from-blue-800 to-orange-700",
    badge2Color: "from-emerald-600 to-teal-900",
    stadium: "Peruvallur Panjayath Stadium"
  },
  {
    id: "qf4",
    day: "Quarter Final 4",
    date: "26 Nov 2026",
    time: "08:45 PM",
    stage: "Quarter Final 4",
    team1: "Winner Pre-Quarter 7",
    team2: "Winner Pre-Quarter 8",
    status: "Upcoming",
    score1: null,
    score2: null,
    confirmed: true,
    badge1Color: "from-slate-900 to-blue-900",
    badge2Color: "from-zinc-700 to-zinc-950",
    stadium: "Peruvallur Panjayath Stadium"
  }
];

// Last completed match highlight
export const lastMatchResult = {
  matchId: "m7",
  homeTeam: "USHA FC THRISSUR",
  awayTeam: "I NOV FC MANJERI",
  homeScore: 1,
  awayScore: 3,
  winnerTeam: "I NOV FC MANJERI",
  stage: "Round 1 (Match 7)",
  date: "12 Nov 2026",
  winnerPosterUrl: "/results/match7_usha_vs_inov.jpg",
};

// Next upcoming match (Day 8 — Pre-Quarter)
export const nextMatch = {
  id: "m8",
  stage: "Pre-Quarter (Round of 16 — Day 8)",
  date: "Saturday, 14 Nov 2026",
  time: "8:45 PM IST",
  venue: "Peruvallur Panjayath Stadium",
  teamHome: {
    id: "x8-tours-calicut",
    name: "X8 TOURS CALICUT",
    nameMl: "എക്സ് 8 ടൂർസ് കോഴിക്കോട്",
    shortName: "X8 TOURS",
    city: "Calicut",
    color: "#b91c1c",
    textColor: "#ffffff",
    badgeBg: "from-red-700 to-black",
  },
  teamAway: {
    id: "real-fc-thennala",
    name: "REAL FC THENNALA",
    nameMl: "റിയൽ എഫ്.സി തെന്നല",
    shortName: "REAL THENNALA",
    city: "Thennala",
    color: "#0284c7",
    textColor: "#ffffff",
    badgeBg: "from-sky-400 to-blue-700",
  }
};

export const participatingTeams = [
  {
    id: 1,
    slug: "super_studio_malappuram",
    name: "SUPER STUDIO MALAPPURAM",
    nameMl: "സൂപ്പർ സ്റ്റുഡിയോ മലപ്പുറം",
    city: "Malappuram",
    manager: "Asharaf Bava",
    asstManager: "Imathiyas",
    category: "Permanent SFA Club",
    column: "left"
  },
  {
    id: 2,
    slug: "linsha_medicals_mannarkkad",
    name: "LINSHA MEDICALS MANNARKKAD",
    nameMl: "ലിൻഷാ മെഡിക്കൽസ് മണ്ണാർക്കാട്",
    city: "Mannarkkad, Palakkad",
    manager: "Rasheed Poorona",
    asstManager: "Shameer Babu",
    category: "Permanent SFA Club",
    column: "left"
  },
  {
    id: 3,
    slug: "saban_kottakkal",
    name: "SABAN KOTTAKKAL",
    nameMl: "സബാൻ കോട്ടക്കൽ",
    city: "Kottakkal, Malappuram",
    manager: "Mubaarak Salih",
    asstManager: "Ajith",
    category: "Permanent SFA Club",
    column: "left"
  },
  {
    id: 4,
    slug: "al_madeena_cherpulasseri",
    name: "AL MADEENA CHERPULASSERI",
    nameMl: "അൽ മദീന ചെറുപ്പുളശ്ശേരി",
    city: "Cherpulasseri, Palakkad",
    manager: "Latheef",
    asstManager: "Sidiq E 4",
    category: "Permanent SFA Club",
    column: "left"
  },
  {
    id: 5,
    slug: "base_perumbavur",
    name: "BASE PERUMBAVUR",
    nameMl: "ബേസ് പെരുമ്പാവൂർ",
    city: "Perumbavoor, Ernakulam",
    manager: "Usman K P",
    asstManager: "Musthu",
    category: "Permanent SFA Club",
    column: "left"
  },
  {
    id: 6,
    slug: "kmg_mavoor",
    name: "KMG MAVOOR",
    nameMl: "കെ.എം.ജി മാവൂർ",
    city: "Mavoor, Kozhikode",
    manager: "Hifsu Rahman",
    asstManager: "Shafeeq",
    category: "Permanent SFA Club",
    column: "left"
  },
  {
    id: 7,
    slug: "fc_perinthalmanna",
    name: "FC PERINTHALMANNA",
    nameMl: "എഫ്.സി പെരിന്തൽമണ്ണ",
    city: "Perinthalmanna, Malappuram",
    manager: "Rasheed",
    asstManager: "Arshad Soopi",
    category: "Permanent SFA Club",
    column: "left"
  },
  {
    id: 8,
    slug: "united_fc_nellikkuth",
    name: "UNITED FC NELLIKKUTH",
    nameMl: "യുണൈറ്റഡ് എഫ്.സി നെല്ലിക്കുത്ത്",
    city: "Nellikkuth, Malappuram",
    manager: "Noufal",
    asstManager: "Riyas",
    category: "Permanent SFA Club",
    column: "left"
  },
  {
    id: 9,
    slug: "i_nov_fc_manjeri",
    name: "I nov FC MANJERI",
    nameMl: "ഐ നോവ് എഫ്.സി മഞ്ചേരി",
    city: "Manjeri, Malappuram",
    manager: "Bava Master",
    asstManager: "Mujeeb",
    category: "Permanent SFA Club",
    column: "left"
  },
  {
    id: 10,
    slug: "x8_tours_calicut",
    name: "X8 TOURS CALICUT",
    nameMl: "എക്സ് 8 ടൂർസ് കോഴിക്കോട്",
    city: "Calicut",
    manager: "Faisal",
    asstManager: "Shihab",
    category: "Permanent SFA Club",
    column: "left"
  },
  {
    id: 11,
    slug: "malbar_fc_kozhikkode",
    name: "NEW MALAYA MALABAR FC",
    nameMl: "ന്യൂ മലയ മലബാർ എഫ്.സി",
    city: "Kozhikode",
    manager: "Aboobacker Master",
    asstManager: "Ziyad",
    category: "Permanent SFA Club",
    column: "left"
  },
  {
    id: 12,
    slug: "shooters_padanna",
    name: "SHOOTERS PADANNA",
    nameMl: "ഷൂട്ടേഴ്സ് പടന്ന",
    city: "Padanna, Kasaragod",
    manager: "Ansari P",
    asstManager: "Shahul",
    category: "Permanent SFA Club",
    column: "left"
  },
  {
    id: 13,
    slug: "ayc_ucharakadavu",
    name: "AYC UCHARAKADAVU",
    nameMl: "എ.വൈ.സി ഉച്ചാരക്കടവ്",
    city: "Ucharakadavu, Malappuram",
    manager: "Saifudheen (Mani)",
    asstManager: "Manager Desk",
    category: "Permanent SFA Club",
    column: "right"
  },
  {
    id: 14,
    slug: "soccer_sporting_shornur",
    name: "SOCCER SPORTING SHORNUR",
    nameMl: "സോക്കർ സ്പോർട്ടിംഗ് ഷൊർണ്ണൂർ",
    city: "Shornur, Palakkad",
    manager: "Dilshad",
    asstManager: "Anil Mathew",
    category: "Permanent SFA Club",
    column: "right"
  },
  {
    id: 15,
    slug: "town_team_areekode",
    name: "TOWN TEAM AREEKODE",
    nameMl: "ടൗൺ ടീം അരീക്കോട്",
    city: "Areekode, Malappuram",
    manager: "Salam",
    asstManager: "Rajeesh Piari",
    category: "Permanent SFA Club",
    column: "right"
  },
  {
    id: 16,
    slug: "seven_star_fc_palakkad",
    name: "SEVEN STAR FC PALAKKAD",
    nameMl: "സെവൻ സ്റ്റാർ എഫ്.സി പാലക്കാട്",
    city: "Palakkad",
    manager: "Haridas",
    asstManager: "Vineeth",
    category: "Permanent SFA Club",
    column: "right"
  },
  {
    id: 17,
    slug: "real_fc_thennala",
    name: "REAL FC THENNALA",
    nameMl: "റിയൽ എഫ്.സി തെന്നല",
    city: "Thennala, Malappuram",
    manager: "Usman",
    asstManager: "Jershid",
    category: "Permanent SFA Club",
    column: "right"
  },
  {
    id: 18,
    slug: "powerdippo_thrissur",
    name: "POWERDIPPO THRISSUR",
    nameMl: "പവർഡിപ്പോ തൃശ്ശൂർ",
    city: "Thrissur",
    manager: "Santhosh K. T",
    asstManager: "Biju Varghese",
    category: "Permanent SFA Club",
    column: "right"
  },
  {
    id: 19,
    slug: "krsc_kozhikkode",
    name: "KRSC KOZHIKKODE",
    nameMl: "കെ.ആർ.എസ്.സി കോഴിക്കോട്",
    city: "Kozhikode",
    manager: "Rujeesh",
    asstManager: "Asif",
    category: "Permanent SFA Club",
    column: "right"
  },
  {
    id: 20,
    slug: "hunters_koothuparamba",
    name: "HUNTERS KOOTHUPARAMBA",
    nameMl: "ഹണ്ടേഴ്സ് കൂത്തുപറമ്പ്",
    city: "Koothuparamba, Kannur",
    manager: "Shamsu",
    asstManager: "Ansar",
    category: "Permanent SFA Club",
    column: "right"
  },
  {
    id: 21,
    slug: "abilash_fc_kuppooth",
    name: "ABILASH FC KUPPOOTH",
    nameMl: "അഭിലാഷ് എഫ്.സി കുപ്പൂത്ത്",
    city: "Kuppooth, Palakkad",
    manager: "Abdul Vahid",
    asstManager: "Muhamed Sabique",
    category: "Permanent SFA Club",
    column: "right"
  },
  {
    id: 22,
    slug: "afc_wayanad",
    name: "AFC WAYANAD",
    nameMl: "എ.എഫ്.സി വയനാട്",
    city: "Wayanad",
    manager: "Baiju",
    asstManager: "Shanid",
    category: "Permanent SFA Club",
    column: "right"
  },
  {
    id: 23,
    slug: "udaya_parambil_peedika",
    name: "UDAYA PARAMBIL PEEDIKA",
    nameMl: "ഉദയ പറമ്പിൽ പീടിക",
    city: "Parambil Peedika, Malappuram",
    manager: "Muneer",
    asstManager: "Shabeer",
    category: "Host Club & Tournament Pioneer",
    column: "right"
  },
  {
    id: 24,
    slug: "usha_fc_thrissur",
    name: "USHA FC THRISSUR",
    nameMl: "ഉഷാ എഫ്.സി തൃശ്ശൂർ",
    city: "Thrissur",
    manager: "Pradeep P V",
    asstManager: "C G Shinil",
    category: "Permanent SFA Club",
    column: "right"
  }
];

export const topScorersPreview = [
  { rank: 1, name: "Ibrahim Soumahoro", team: "UDAYA Parambil Peedika", goals: 0, matches: 0, origin: "Ivory Coast", flag: "🇨🇮", category: "Overseas Marquee" },
  { rank: 2, name: "Shameer Kottakkal", team: "SABAN FC Kottakkal", goals: 0, matches: 0, origin: "Malappuram", flag: "🇮🇳", category: "Homegrown Striker" },
  { rank: 3, name: "Junior Toure", team: "FIFA Manjeri", goals: 0, matches: 0, origin: "Ghana", flag: "🇬🇭", category: "Overseas Marquee" },
  { rank: 4, name: "Muhammed Faslu", team: "Linsha Tirur", goals: 0, matches: 0, origin: "Tirur, Malappuram", flag: "🇮🇳", category: "Homegrown Striker" }
];

export const sponsors = [
  { name: "Abacus Academy", tier: "Marathon Partner", desc: "Parambil Peedika & Puthur Pallikkal - Educational Excellence & Sports Sponsor" },
  { name: "Raidhan Kuzhimanthi", tier: "Food Partner", desc: "Official Food & Hospitality Partner - Parambil Peedika" },
  { name: "Life Line Hospital", tier: "Healthcare Partner", desc: "24x7 Emergency Care & Medical Partner" },
  { name: "UDAYA & KASC Peruvallur", tier: "Organizers", desc: "UDAYA Parambil Peedika & KASC Peruvallur" },
  { name: "Sevens Football Association", tier: "Governing Body", desc: "SFA Approved Tournament" },
  { name: "Gulf Expat Fans Club", tier: "Diaspora Partner", desc: "UAE, Saudi & Qatar Pravasi Koottayma" },
  { name: "Organizing Committee", tier: "Event Administration", desc: "UDAYA Parambil Peedika & KASC Peruvallur" }
];

export const sponsorAds = [
  {
    id: "abacus",
    name: "Abacus Academy",
    nameMl: "അബാക്കസ് അക്കാദമി",
    category: "Official Event Sponsor",
    categoryMl: "ഇവന്റ് സ്പോൺസർ",
    tagline: "Quality Education & Promoting Local Athletic Excellence",
    taglineMl: "വിദ്യാഭ്യാസ രംഗത്ത് പുത്തൻ മുന്നേറ്റം • പറമ്പിൽ പീടിക & പുത്തൂർ പള്ളിക്കൽ",
    location: "Parambil Peedika & Puthur Pallikkal",
    offers: "Proud Event Sponsor for SFA All India Sevens 8 KM Mini Marathon",
    offersMl: "8 കി.മീ മിനി മാരത്തോൺ അഭിമാന പങ്കാളി",
    badge: "🎓 EDUCATION & SPORTS",
    badgeColor: "bg-blue-100 text-blue-900 border-blue-300",
    gradient: "from-blue-600 to-indigo-700"
  },
  {
    id: "raidhan",
    name: "Raidhan Kuzhimanthi",
    nameMl: "റൈദാൻ കുഴിമന്തി",
    category: "Official Food Partner",
    categoryMl: "ഭക്ഷണ പങ്കാളി",
    tagline: "Authentic Arabian Kuzhimanthi & Mandi Specialists",
    taglineMl: "അറേബ്യൻ കുഴിമന്തിയുടെ തനിമയാർന്ന രുചിപ്പെരുമ",
    location: "Parambil Peedika & Malappuram",
    offers: "Special Sevens Match Combos & Family AC Dine-In",
    offersMl: "സെവൻസ് സ്പെഷ്യൽ ഫാമിലി കോമ്പോ ഓഫറുകൾ",
    badge: "🍗 FOOD PARTNER",
    badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
    gradient: "from-amber-500 to-orange-600"
  },
  {
    id: "lifeline",
    name: "Life Line Hospital",
    nameMl: "ലൈഫ് ലൈൻ ഹോസ്പിറ്റൽ",
    category: "Official Healthcare Partner",
    categoryMl: "മെഡിക്കൽ പങ്കാളി",
    tagline: "24x7 Emergency Care, Trauma Unit & Sports Clinic",
    taglineMl: "24x7 അത്യാഹിത വിഭാഗം, അത്യാധുനിക ഐ.സി.യു & ആംബുലൻസ്",
    location: "Parambil Peedika / Malappuram",
    offers: "Free Medical Emergency & First Aid on Ground",
    offersMl: "കളിക്കാർക്ക് ഗ്രൗണ്ടിൽ സൗജന്യ പ്രഥമശുശ്രൂഷ സഹായം",
    badge: "🏥 MEDICAL PARTNER",
    badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
    gradient: "from-emerald-600 to-teal-700"
  }
];

export const promoData = {
  marathon: {
    title: "SFA Promotional Mini Marathon (8 KM)",
    titleMl: "എസ്.എഫ്.എ അഖിലേന്ത്യാ സെവൻസ് പ്രചരണാർത്ഥം മിനി മാരത്തോൺ",
    organizers: "UDAYA Parambil Peedika & KASC Peruvallur",
    organizersMl: "ഉദയ പറമ്പിൽ പീടിക",
    date: "Sunday, 25 October 2026",
    dateMl: "2026 ഒക്ടോബർ 25, ഞായറാഴ്ച",
    time: "Reporting: 6:00 AM | Flag-off: 6:30 AM",
    timeMl: "റിപ്പോർട്ടിംഗ്: രാവിലെ 6:00 | ഫ്ലാഗ് ഓഫ്: രാവിലെ 6:30",
    venue: "Peruvallur Panjayath Stadium, Parambil Peedika",
    venueMl: "പെരുവള്ളൂർ പഞ്ചായത്ത് സ്റ്റേഡിയം, പറമ്പിൽ പീടിക",
    distance: "8 KM (Free Registration)",
    distanceMl: "8 കി.മീ സൗജന്യ രജിസ്ട്രേഷൻ",
    flagOffBy: {
      name: "P. P. Suneel",
      nameMl: "പി. പി. സുനീൽ",
      designation: "President, Peruvallur Grama Panchayath",
      designationMl: "പെരുവള്ളൂർ ഗ്രാമ പഞ്ചായത്ത് പ്രസിഡന്റ്"
    },
    prizeSponsor: {
      name: "Abacus Academy",
      nameMl: "അബാക്കസ് അക്കാദമി",
      branches: "Parambil Peedika & Puthur Pallikkal",
      branchesMl: "പറമ്പിൽ പീടിക & പുത്തൂർ പള്ളിക്കൽ",
      role: "Official Event Partner"
    },
    prizes: [
      {
        place: 1,
        title: "1st Place",
        titleMl: "ഒന്നാം സ്ഥാനം",
        cash: "Trophy & Medal",
        winner: "Avinash Koyilandy",
        winnerMl: "അവിനാഷ് കൊയിലാണ്ടി",
        badge: "🥇 Champion Runner",
        filename: "marathon_winner_1st.jpg"
      },
      {
        place: 2,
        title: "2nd Place",
        titleMl: "രണ്ടാം സ്ഥാനം",
        cash: "Trophy & Medal",
        winner: "Aswan Palakkad",
        winnerMl: "അസ്വാൻ പാലക്കാട്",
        badge: "🥈 Runner-Up",
        filename: "marathon_winner_2nd.jpg"
      },
      {
        place: 3,
        title: "3rd Place",
        titleMl: "മൂന്നാം സ്ഥാനം",
        cash: "Trophy & Medal",
        winner: "Aadil Kummipiparambin",
        winnerMl: "ആദിൽ കുമ്മിണിപ്പറമ്പ്",
        badge: "🥉 2nd Runner-Up",
        filename: "marathon_winner_3rd.jpg"
      }
    ],
    gallery: [
      {
        id: "flagoff",
        title: "Flag-off Ceremony by Panchayath President",
        titleMl: "ഫ്ലാഗ് ഓഫ് കർമ്മം - പി. പി. സുനീൽ",
        desc: "Peruvallur Grama Panchayath President P. P. Suneel inaugurating and flagging off the 8 KM Mini Marathon at Panjayath Stadium.",
        descMl: "പെരുവള്ളൂർ ഗ്രാമ പഞ്ചായത്ത് പ്രസിഡന്റ് പി. പി. സുനീൽ ഫ്ലാഗ് ഓഫ് നിർവ്വഹിക്കുന്നു",
        filename: "marathon_flagoff.jpg",
        tag: "Inauguration"
      },
      {
        id: "crowd",
        title: "Elite Runners Assembly at Parambil Peedika",
        titleMl: "കായിക താരങ്ങളുടെ സംഗമം",
        desc: "Participants gathered with the official SFA Sevens Mini Marathon promotional banner before embarking on the 8 km race.",
        descMl: "പറമ്പിൽ പീടിക ടൗണിൽ അത്‌ലറ്റുകളുടെ ആവേശകരമായ ഒത്തുചേരൽ",
        filename: "marathon_runners_crowd.jpg",
        tag: "Athletes Gathering"
      },
      {
        id: "poster",
        title: "Official 8 KM Marathon Notice",
        titleMl: "ഔദ്യോഗിക മാരത്തോൺ അറിയിപ്പ്",
        desc: "Official announcement poster sponsored by Abacus Academy Parambil Peedika & Puthur Pallikkal.",
        descMl: "അബാക്കസ് അക്കാദമി സ്പോൺസർ ചെയ്ത മാരത്തോൺ അറിയിപ്പ്",
        filename: "marathon_official_poster.jpg",
        tag: "Official Poster"
      }
    ]
  },
  goalVandi: {
    title: "Udaya Goal Vandi Shootout Contest",
    titleMl: "ഉദയ ഗോൾ വണ്ടി ഷൂട്ട് ഔട്ട് മത്സരം",
    organizers: "Udaya Kala Kayika Samskarika Vedi Parambil Peedika & KASC",
    organizersMl: "ഉദയ കലാ കായിക സാംസ്കാരിക വേദി പറമ്പിൽ പീടിക",
    sponsor: "FEZCO GROUP",
    sponsorMl: "ഫെസ്കോ ഗ്രൂപ്പ് (FEZCO GROUP)",
    desc: "As part of the promotional campaigns for the Udaya KASC All India Sevens, the 'Udaya Goal Vandi' mobile penalty shootout contest was organized across schools and local centers.",
    descMl: "ഉദയ കാസ്ക് ഫുട്ബോൾ അഖിലേന്ത്യാ സെവൻസ് ഫുട്ബോൾ ടൂർണമെന്റിന്റെ പ്രചരണത്തിന്റെ ഭാഗമായി ഉദയ കലാ കായിക സാംസ്കാരിക വേദി പറമ്പിൽ പീടിക സംഘടിപ്പിച്ച “ഉദയ ഗോൾ വണ്ടി” ഷൂട്ട് ഔട്ട് മത്സരം സംഘടിപ്പിച്ചു.",
    locations: [
      { name: "AKHM UP School, Chatrathodi", nameMl: "AKHM UP സ്കൂൾ ചാത്രത്തൊടി" },
      { name: "Peruvallur Higher Secondary School", nameMl: "പെരുവള്ളൂർ ഹയർ സെക്കൻഡറി സ്കൂൾ" },
      { name: "VPKMHSS, Puthur Pallikkal Padikkal", nameMl: "VPKMHSS പുത്തൂർ പള്ളിക്കൽ പടിക്കൽ" },
      { name: "Parambil Peedika Town", nameMl: "പറമ്പിൽ പീടിക" }
    ],
    reward: "Free Opening Matchday Passes awarded to all shootout champions",
    rewardMl: "ഷൂട്ട് ഔട്ട് മത്സരത്തിലെ വിജയികൾക്ക് അഖിലേന്ത്യാ സെവൻസ് ഫുട്ബോൾ ഉദ്ഘാടന ദിവസത്തെ മത്സരം കാണുവാനുള്ള FREE PASS സമ്മാനിച്ചു.",
    upcomingNotice: "In the coming days, Udaya Goal Vandi Shootout contests will continue across Peruvallur and surrounding regions.",
    upcomingNoticeMl: "വരും ദിവസങ്ങളിൽ പെരുവള്ളൂരിലും പരിസര പ്രദേശങ്ങളിലും ഉദയ ഗോൾ വണ്ടി ഷൂട്ട് ഔട്ട് മത്സരം ഉണ്ടായിരിക്കുമെന്ന് സംഘാടകർ അറിയിച്ചു.",
    gallery: [
      {
        id: "goalvandi_vehicle",
        title: "Official Udaya Goal Vandi Promotional Vehicle",
        titleMl: "ഔദ്യോഗിക ഉദയ ഗോൾ വണ്ടി വാഹനം",
        desc: "Customized promotional Thar / Jeep equipped with trophy showcase & Fezco Group branding.",
        descMl: "ഫെസ്കോ ഗ്രൂപ്പ് സ്പോൺസർ ചെയ്ത ഉദയ ഗോൾ വണ്ടി പ്രചാരണ വാഹനം",
        filename: "goalvandi_vehicle.jpg",
        tag: "Promo Vehicle"
      },
      {
        id: "goalvandi_winners",
        title: "Shootout Champions Awarded Free Match Passes",
        titleMl: "വിജയികൾക്ക് ഉദ്ഘാടന മത്സര ഫ്രീ പാസ്സ് സമ്മാനിച്ചു",
        desc: "Winners from school campuses and local centers receiving their official All India Sevens opening day VIP tickets.",
        descMl: "വിവിധ കേന്ദ്രങ്ങളിലെ വിജയികൾക്ക് ഫ്രീ പാസ്സ് വിതരണം ചെയ്യുന്നു",
        filename: "goalvandi_winners_collage.jpg",
        tag: "Champions & Free Passes"
      },
      {
        id: "goalvandi_school",
        title: "Students Gather at Peruvallur Higher Secondary School",
        titleMl: "വിദ്യാർത്ഥികളുടെ ആവേശകരമായ ഒത്തുചേരൽ",
        desc: "Massive turnout of passionate school students cheering on the live kickoff of the Goal Vandi shootout challenge.",
        descMl: "സ്കൂൾ അങ്കണത്തിൽ വിദ്യാർത്ഥികളുടെ വലിയ ആവേശം",
        filename: "goalvandi_school_crowd.jpg",
        tag: "School Tour"
      },
      {
        id: "goalvandi_action",
        title: "Ground Penalty Shootout Action in Progress",
        titleMl: "ഷൂട്ട് ഔട്ട് മത്സരം തത്സമയം",
        desc: "Young talents competing in penalty shootout kicks towards the mini target goalpost.",
        descMl: "മിനി പോസ്റ്റിലേക്ക് കുട്ടികളുടെ പെനാൽറ്റി ഷോട്ടുകൾ",
        filename: "goalvandi_shootout_action.jpg",
        tag: "Ground Action"
      }
    ]
  },
  countdownPosters: [
    {
      days: 3,
      title: "3 Days To Go",
      titleMl: "ഇനി 03 ദിനങ്ങൾ മാത്രം",
      subtitle: "Team Huddle Floodlights & Full Crowd Stadium Edition",
      dates: "2026 Nov 06 - Dec 06",
      venue: "Peruvallur Panchayath Stadium, Parambil Peedika",
      filename: "countdown_3days.jpg",
      highlight: "Team Unity Floodlight Edition"
    },
    {
      days: 4,
      title: "4 Days To Go",
      titleMl: "ഇനി 04 ദിനങ്ങൾ മാത്രം",
      subtitle: "Purple Fortress & Star Striker #10 Edition",
      dates: "2026 Nov 06 - Dec 06",
      venue: "Peruvallur Panchayath Stadium, Parambil Peedika",
      filename: "countdown_4days.jpg",
      highlight: "Purple Power Striker Edition"
    },
    {
      days: 5,
      title: "5 Days To Go",
      titleMl: "ഇനി 05 ദിനങ്ങൾ മാത്രം",
      subtitle: "The Ultimate Battle Begins Sunset Inferno Edition",
      dates: "2026 Nov 06 - Dec 06",
      venue: "Peruvallur Panchayath Stadium, Parambil Peedika",
      filename: "countdown_5days.jpg",
      highlight: "The Ultimate Battle Begins"
    },
    {
      days: 6,
      title: "6 Days To Go",
      titleMl: "ഇനി 06 ദിനങ്ങൾ മാത്രം",
      subtitle: "Peruvallur Panchayath Office Parambil Peedika Edition",
      dates: "2026 Nov 06 - Dec 06",
      venue: "Peruvallur Panchayath Stadium, Parambil Peedika",
      filename: "countdown_6days.jpg",
      highlight: "Panchayath Office Edition"
    },
    {
      days: 8,
      title: "8 Days To Go",
      titleMl: "ഇനി 8 ദിനങ്ങൾ മാത്രം",
      subtitle: "Star Forward in Festiwelt Jersey #10 Spotlight",
      dates: "2026 Nov 06 - Dec 06",
      venue: "Peruvallur Panchayath Stadium, Parambil Peedika",
      filename: "countdown_8days.jpg",
      highlight: "Jersey #10 Edition"
    },
    {
      days: 9,
      title: "9 Days To Go",
      titleMl: "ഇനി 9 ദിനങ്ങൾ മാത്രം",
      subtitle: "Sprint Attack Through the Gateway of Fire",
      dates: "2026 Nov 06 - Dec 06",
      venue: "Peruvallur Panchayath Stadium",
      filename: "countdown_9days.jpg",
      highlight: "Inferno Gate Edition"
    },
    {
      days: 10,
      title: "10 Days To Go",
      titleMl: "ഇനി 10 ദിനങ്ങൾ മാത്രം",
      subtitle: "Aerial Clash & Fortress Defense (#9 vs #2)",
      dates: "2026 Nov 06 - Dec 06",
      venue: "Peruvallur Panchayath Stadium",
      filename: "countdown_10days.jpg",
      highlight: "Fortress Aerial Battle"
    },
    {
      days: 11,
      title: "11 Days To Go",
      titleMl: "ഇനി 11 ദിനങ്ങൾ മാത്രം",
      subtitle: "The Proud Udaya Club Flag Flying at Sunset",
      dates: "2026 Nov 06 - Dec 06",
      venue: "Peruvallur Panchayath Stadium",
      filename: "countdown_11days.jpg",
      highlight: "Official Club Colors"
    }
  ]
};
