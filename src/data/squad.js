/**
 * SQUAD SPOTLIGHT DATA
 * External Hosting Assumption:
 * Video files are hosted on Cloudinary / Cloudflare R2 / Vercel Blob storage.
 * To upload new videos:
 * 1. Upload the 9:16 vertical MP4 video to your cloud bucket (e.g., Cloudinary folder 'squad/').
 * 2. Copy the secure HTTPS URL into `videoUrl`.
 * 3. Extract or upload a 3:4 WebP poster into `posterUrl`.
 *
 * NOTE: Local fallback videoUrl paths (/squad/videos/...) are provided for development
 * preview and are strictly gitignored via .gitignore.
 */

export const squadPlayers = [
  // Super Studio Malappuram Official Squad Videos
  {
    id: 'ss_1',
    name: 'Safwan K.',
    nameMl: 'സഫ്‌വാൻ കെ.',
    number: '4',
    club: 'SUPER STUDIO MALAPPURAM',
    clubMl: 'സൂപ്പർ സ്റ്റുഡിയോ മലപ്പുറം',
    position: 'Defender / പ്രതിരോധ താരം',
    posterUrl: '/squad/posters/super_studio_1.webp',
    videoUrl: '/squad/videos/super_studio_1.mp4',
    devFallbackUrl: '/squad/videos/super_studio_1.mp4',
    fileSize: '2.0 MB',
    isAiGenerated: true,
  },
  {
    id: 'ss_2',
    name: 'Christian Koffi',
    nameMl: 'ക്രിസ്റ്റ്യൻ കോഫി',
    number: '17',
    club: 'SUPER STUDIO MALAPPURAM',
    clubMl: 'സൂപ്പർ സ്റ്റുഡിയോ മലപ്പുറം',
    position: 'Center Back / ഡിഫെൻഡർ',
    posterUrl: '/squad/posters/super_studio_2.webp',
    videoUrl: '/squad/videos/super_studio_2.mp4',
    devFallbackUrl: '/squad/videos/super_studio_2.mp4',
    fileSize: '1.9 MB',
    isAiGenerated: true,
  },
  {
    id: 'ss_3',
    name: 'Niyas Malappuram',
    nameMl: 'നിയാസ് മലപ്പുറം',
    number: '9',
    club: 'SUPER STUDIO MALAPPURAM',
    clubMl: 'സൂപ്പർ സ്റ്റുഡിയോ മലപ്പുറം',
    position: 'Striker / സ്ട്രൈക്കർ',
    posterUrl: '/squad/posters/super_studio_3.webp',
    videoUrl: '/squad/videos/super_studio_3.mp4',
    devFallbackUrl: '/squad/videos/super_studio_3.mp4',
    fileSize: '808 KB',
    isAiGenerated: true,
  },
  {
    id: 'ss_4',
    name: 'Ashique K.',
    nameMl: 'ആഷിഖ് കെ.',
    number: '11',
    club: 'SUPER STUDIO MALAPPURAM',
    clubMl: 'സൂപ്പർ സ്റ്റുഡിയോ മലപ്പുറം',
    position: 'Winger / വിങ്ങർ',
    posterUrl: '/squad/posters/super_studio_4.webp',
    videoUrl: '/squad/videos/super_studio_4.mp4',
    devFallbackUrl: '/squad/videos/super_studio_4.mp4',
    fileSize: '1.8 MB',
    isAiGenerated: true,
  },
  {
    id: 'ss_5',
    name: 'Rameez',
    nameMl: 'റമീസ്',
    number: '7',
    club: 'SUPER STUDIO MALAPPURAM',
    clubMl: 'സൂപ്പർ സ്റ്റുഡിയോ മലപ്പുറം',
    position: 'Playmaker / മിഡ്ഫീൽഡർ',
    posterUrl: '/squad/posters/super_studio_5.webp',
    videoUrl: '/squad/videos/super_studio_5.mp4',
    devFallbackUrl: '/squad/videos/super_studio_5.mp4',
    fileSize: '858 KB',
    isAiGenerated: true,
  },
  // Udaya Parambil Peedika
  {
    id: 'p1',
    name: 'Shameer K.',
    nameMl: 'ഷമീർ കെ.',
    number: '10',
    club: 'UDAYA Parambil Peedika',
    clubMl: 'ഉദയ പറമ്പിൽ പീടിക',
    position: 'Forward / വിങ്ങർ',
    posterUrl: '/squad/posters/player_1.webp',
    videoUrl: '/squad/videos/player_1.mp4',
    devFallbackUrl: '/squad/videos/player_1.mp4',
    fileSize: '2.7 MB',
    isAiGenerated: true,
  },
  {
    id: 'p2',
    name: 'Ibrahim Soumahoro',
    nameMl: 'ഇബ്രാഹിം സുമഹോറോ',
    number: '10',
    club: 'UDAYA Parambil Peedika',
    clubMl: 'ഉദയ പറമ്പിൽ പീടിക',
    position: 'Striker / സ്ട്രൈക്കർ',
    posterUrl: '/squad/posters/player_2.webp',
    videoUrl: '/squad/videos/player_2.mp4',
    devFallbackUrl: '/squad/videos/player_2.mp4',
    fileSize: '823 KB',
    isAiGenerated: true,
  },
  // New Malaya Malabar FC
  {
    id: 'p3',
    name: 'Jameel Kozhikode',
    nameMl: 'ജമീൽ കോഴിക്കോട്',
    number: '10',
    club: 'NEW MALAYA MALABAR FC',
    clubMl: 'ന്യൂ മലയ മലബാർ എഫ്.സി',
    position: 'Playmaker / പ്ലേമേക്കർ',
    posterUrl: '/squad/posters/player_3.webp',
    videoUrl: '/squad/videos/player_3.mp4',
    devFallbackUrl: '/squad/videos/player_3.mp4',
    fileSize: '828 KB',
    isAiGenerated: true,
  },
  {
    id: 'p4',
    name: 'Emmanuel',
    nameMl: 'ഇമ്മാനുവൽ',
    number: '11',
    club: 'NEW MALAYA MALABAR FC',
    clubMl: 'ന്യൂ മലയ മലബാർ എഫ്.സി',
    position: 'Forward / ഫോർവേഡ്',
    posterUrl: '/squad/posters/player_4.webp',
    videoUrl: '/squad/videos/player_4.mp4',
    devFallbackUrl: '/squad/videos/player_4.mp4',
    fileSize: '799 KB',
    isAiGenerated: true,
  },
  {
    id: 'p5',
    name: 'Riyas K.',
    nameMl: 'റിയാസ് കെ.',
    number: '7',
    club: 'UDAYA Parambil Peedika',
    clubMl: 'ഉദയ പറമ്പിൽ പീടിക',
    position: 'Midfield / ക്യാപ്റ്റൻ',
    posterUrl: '/squad/posters/player_5.webp',
    videoUrl: '/squad/videos/player_5.mp4',
    devFallbackUrl: '/squad/videos/player_5.mp4',
    fileSize: '940 KB',
    isAiGenerated: true,
  },
  {
    id: 'p6',
    name: 'Faisal K.',
    nameMl: 'ഫൈസൽ കെ.',
    number: '8',
    club: 'UDAYA Parambil Peedika',
    clubMl: 'ഉദയ പറമ്പിൽ പീടിക',
    position: 'Midfielder / മിഡ്ഫീൽഡർ',
    posterUrl: '/squad/posters/player_6.webp',
    videoUrl: '/squad/videos/player_6.mp4',
    devFallbackUrl: '/squad/videos/player_6.mp4',
    fileSize: '939 KB',
    isAiGenerated: true,
  },
  {
    id: 'p7',
    name: 'Jamsheer V.',
    nameMl: 'ജംഷീർ വി.',
    number: '9',
    club: 'FIFA Manjeri',
    clubMl: 'ഫിഫ മഞ്ചേരി',
    position: 'Striker / സ്ട്രൈക്കർ',
    posterUrl: '', // Tests placeholder poster
    videoUrl: '', // Tests placeholder video
    devFallbackUrl: '',
    fileSize: 'Unknown',
    isAiGenerated: false,
  }
];

export const squadClubs = [
  'All',
  'SUPER STUDIO MALAPPURAM',
  'UDAYA Parambil Peedika',
  'NEW MALAYA MALABAR FC',
  'FIFA Manjeri'
];

// Official Squad Confirmation Status per Club (Rule 9f)
export const clubSquadStatus = {
  'SUPER STUDIO MALAPPURAM': 'confirmed',
  'UDAYA Parambil Peedika': 'confirmed',
  'NEW MALAYA MALABAR FC': 'confirmed',
  'FIFA Manjeri': 'unconfirmed'
};
