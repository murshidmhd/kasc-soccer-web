/**
 * Central Tournament Configuration & Design Constants
 * Akhilenthya Sevens Season 7 (Peruvallur Panjayath Stadium)
 */

// Canonical Production URL for sharing (never localhost per prompt rule)
export const SITE_URL = 'https://kasc-sevens.vercel.app';

// Feature Flags
export const SHOW_SFA_CLAIMS = false;
export const SHOW_SPONSORS = true;
export const SHOW_UNFINISHED = false;
export const SHOW_LINEUPS = true;

// Committee Contact Details
export const COMMITTEE_PHONE = '+91 70120 46930';
export const COMMITTEE_WHATSAPP = 'https://wa.me/917012046930?text=Hi%20KASC%20Committee%2C%20I%20have%20an%20inquiry%20regarding%20Season%207';
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
