/**
 * Central Tournament Configuration & Design Constants
 * Akhilenthya Sevens Season 7 (Peruvallur Panjayath Stadium)
 */

// Official Organisers (Task 3, Rule 9: Udaya primary, KASC co-organiser)
export const ORGANISERS = {
  primary: {
    id: 'udaya',
    name: 'Udaya Parambil Peedika',
    nameMl: 'ഉദയ പറമ്പിൽ പീടിക',
    shortName: 'UDAYA',
    shortNameMl: 'ഉദയ',
    role: 'Primary Organiser',
    roleMl: 'മുഖ്യ സംഘാടകർ',
    logo: '/logo_udaya_transparent.webp'
  },
  coOrganiser: {
    id: 'kasc',
    name: 'KASC Peruvallur',
    nameMl: 'KASC പെരുവള്ളൂർ',
    shortName: 'KASC',
    shortNameMl: 'കാസ്ക്',
    role: 'Co-Organiser',
    roleMl: 'സഹ സംഘാടകർ',
    logo: '/logo_kasc.webp'
  }
};

// Canonical Production URL for sharing (auto-resolves current live domain with udaya-football fallback)
export const SITE_URL = typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost')
  ? window.location.origin
  : 'https://udaya-football.vercel.app';

// Feature Flags
export const SHOW_BRACKET = true;
export const SHOW_LOCAL_ONLY_FEATURES = false;
export const PRIZES_CONFIRMED = false;
export const SHOW_SFA_CLAIMS = false;
export const SHOW_SPONSORS = true;
export const SHOW_UNFINISHED = false;
export const SHOW_LINEUPS = true;
export const FAN_REPORTS_ENABLED = false;
export const TROPHY_IS_ILLUSTRATION = true;
export const SHOW_NATIONALITY = false;
export const AWARDS_NOTE = true;

// Bandwidth & Media Control Flags
export const VIDEO_AUTOPLAY_ENABLED = false;
export const SHOW_HOME_TEASER = false;

// Polling intervals (Ready for live backend)
export const LIVE_POLL_MS = 10000;
export const IDLE_POLL_MS = 60000;

// Match Length & Clock Caps (Kerala Sevens: 30 mins 1st half, 60 mins full match)
export const HALF_LENGTH_MINUTES = 30;
export const MAX_MATCH_MINUTES = 60;

// Admin Access & Shortcuts
export const ADMIN_SHORTCUT_ENABLED = true;

// Official Tournament WhatsApp Broadcast Channel (Hidden when empty)
export const WHATSAPP_CHANNEL_URL = '';

// Committee Contact Details (Hotline & WhatsApp numbers removed for privacy)
export const COMMITTEE_PHONE = '';
export const COMMITTEE_WHATSAPP = '';
export const COMMITTEE_INSTAGRAM = 'https://www.instagram.com/kasc_peruvallur';
export const COMMITTEE_YOUTUBE = ''; // Hidden if empty

// Developer Signature & Credits
export const DEVELOPER_CREDIT = {
  name: 'Murshid',
  fullName: 'Muhammed Murshid',
  role: 'Full-Stack Developer',
  linkedin: 'https://www.linkedin.com/in/murshid70/',
  instagram: 'https://www.instagram.com/mursh1d7',
  github: 'https://github.com/murshidmhd',
  show: true
};

// Official Tournament Sponsors Array (Official Title Sponsor: FEZCO GROUP)
export const SPONSORS_DATA = [
  { 
    name: 'FEZCO GROUP (Official Title Sponsor)', 
    tier: 'Official Title Sponsor',
    logoUrl: '/fezco_title_sponsor_poster.webp', 
    url: '#' 
  }
];

// Stadium Maps URL
export const STADIUM_MAPS_URL = 'https://maps.google.com/?q=Peruvallur+Panchayath+Stadium+Parambil+Peedika';
