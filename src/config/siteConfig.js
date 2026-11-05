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
    logo: '/logo_udaya_transparent.png'
  },
  coOrganiser: {
    id: 'kasc',
    name: 'KASC Peruvallur',
    nameMl: 'KASC പെരുവള്ളൂർ',
    shortName: 'KASC',
    shortNameMl: 'കാസ്ക്',
    role: 'Co-Organiser',
    roleMl: 'സഹ സംഘാടകർ',
    logo: '/logo_kasc.png'
  }
};

// Canonical Production URL for sharing (auto-resolves current live domain with udaya-football fallback)
export const SITE_URL = typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost')
  ? window.location.origin
  : 'https://udaya-football.vercel.app';

// Feature Flags
export const SHOW_BRACKET = false;
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

// Match Length & Clock Caps (Kerala Sevens: 30 mins 1st half, 60 mins full match)
export const HALF_LENGTH_MINUTES = 30;
export const MAX_MATCH_MINUTES = 60;

// Admin Access & Shortcuts
export const ADMIN_SHORTCUT_ENABLED = true;

// Official Tournament WhatsApp Broadcast Channel (Hidden when empty)
export const WHATSAPP_CHANNEL_URL = '';

// Committee Contact Details
export const COMMITTEE_PHONE = '+91 70120 46930';
export const COMMITTEE_WHATSAPP = 'https://wa.me/917012046930?text=Hi%20UDAYA%20%26%20KASC%20Committee%2C%20I%20have%20an%20inquiry%20regarding%20Season%207';
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

// Official Tournament Sponsors Array
export const SPONSORS_DATA = [
  { name: 'Fezco Group', logoUrl: null, url: '#' },
  { name: 'Raidhan Kuzhimanthi', logoUrl: null, url: '#' },
  { name: 'Abacus Academy', logoUrl: null, url: '#' },
  { name: 'Life Line Hospital', logoUrl: null, url: '#' },
  { name: 'Malabar Gold & Diamonds', logoUrl: null, url: '#' },
  { name: 'Al-Ameen Builders', logoUrl: null, url: '#' }
];

// Stadium Maps URL
export const STADIUM_MAPS_URL = 'https://maps.google.com/?q=Peruvallur+Panchayath+Stadium+Parambil+Peedika';
