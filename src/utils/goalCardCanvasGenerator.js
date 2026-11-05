// Client-side 1080x1920 Canvas Goal Status Card Generator & Web Share API
// Zero server cost • Branded Kerala Sevens Season 7 WhatsApp Status & Story card

import logoUdaya from '../assets/logo_udaya_transparent.png';
import logoKasc from '../assets/logo_kasc_transparent.png';
import logoSfa from '../assets/logo_sfa.png';
import { getTeamLogoUrl } from '../assets/teams/index';

/**
 * Preload all Malayalam and Sports Google Fonts prior to drawing canvas.
 * Ensures Malayalam ligatures and Oswald numbers render faithfully without font swap glitches.
 */
export async function ensureFontsLoaded() {
  if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
      await Promise.allSettled([
        document.fonts.load('bold 54px "Anek Malayalam"'),
        document.fonts.load('bold 54px "Noto Sans Malayalam"'),
        document.fonts.load('bold 120px "Oswald"'),
        document.fonts.load('bold 48px "Plus Jakarta Sans"')
      ]);
    } catch (err) {
      console.warn('Canvas font preloading warning (falling back gracefully):', err);
    }
  }
}

/**
 * Helper to asynchronously load image elements for HTML5 canvas rendering
 */
function loadImage(src) {
  return new Promise((resolve) => {
    if (!src) {
      resolve(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      console.warn('Canvas image loader failed for:', src);
      resolve(null);
    };
    img.src = src;
  });
}

/**
 * Draws rounded rectangle path
 */
function roundRect(ctx, x, y, width, height, radius) {
  if (typeof radius === 'number') {
    radius = { tl: radius, tr: radius, br: radius, bl: radius };
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
}

/**
 * Intelligent text wrap & dynamic font scaler for long player names (Malayalam & English)
 */
function drawScaledText({
  ctx,
  text,
  x,
  y,
  maxWidth,
  maxFontSize = 58,
  minFontSize = 34,
  fontFamily = '"Anek Malayalam", "Noto Sans Malayalam", "Plus Jakarta Sans", sans-serif',
  fontWeight = 'bold',
  fillStyle = '#ffffff',
  textAlign = 'center'
}) {
  ctx.save();
  ctx.fillStyle = fillStyle;
  ctx.textAlign = textAlign;
  ctx.textBaseline = 'middle';

  // Try single line with decreasing font size
  let currentSize = maxFontSize;
  ctx.font = `${fontWeight} ${currentSize}px ${fontFamily}`;
  let textWidth = ctx.measureText(text).width;

  while (textWidth > maxWidth && currentSize > minFontSize) {
    currentSize -= 2;
    ctx.font = `${fontWeight} ${currentSize}px ${fontFamily}`;
    textWidth = ctx.measureText(text).width;
  }

  // If text still overflows at minFontSize, wrap into 2 lines
  if (textWidth > maxWidth && text.includes(' ')) {
    const words = text.split(' ');
    let line1 = '';
    let line2 = '';
    const mid = Math.ceil(words.length / 2);
    line1 = words.slice(0, mid).join(' ');
    line2 = words.slice(mid).join(' ');

    const lineFontSize = Math.max(minFontSize, 36);
    ctx.font = `${fontWeight} ${lineFontSize}px ${fontFamily}`;
    const lineHeight = lineFontSize * 1.25;

    ctx.fillText(line1, x, y - lineHeight / 2);
    ctx.fillText(line2, x, y + lineHeight / 2);
  } else {
    ctx.fillText(text, x, y);
  }

  ctx.restore();
}

/**
 * Generate 1080x1920 WhatsApp Status / Instagram Story Portrait Goal Card
 * 
 * @param {Object} params
 * @param {string} params.scorerName - Name of player who scored (e.g. Ibrahim Soumahoro)
 * @param {string|number} params.minute - Match minute (e.g. 24 or "24'")
 * @param {string} params.goalTeam - 'home' | 'away'
 * @param {number} params.scoreHome - Current Home Score
 * @param {number} params.scoreAway - Current Away Score
 * @param {string} [params.homeTeamName] - Default "UDAYA PARAMBIL PEEDIKA"
 * @param {string} [params.awayTeamName] - Default "NEW MALAYA MALABAR FC"
 * @param {string} [params.matchStatus] - e.g. "LIVE 2ND HALF", "1ST HALF", "FULL TIME"
 * @param {string} [params.goalText] - Optional description (e.g. "Curler into top corner")
 * @param {string} [params.lang] - 'en' | 'ml'
 * @returns {Promise<{ blob: Blob, dataUrl: string, fileName: string }>}
 */
export async function generateGoalStatusImage({
  scorerName = 'Player',
  minute = 30,
  goalTeam = 'home',
  scoreHome = 2,
  scoreAway = 1,
  homeTeamName = 'UDAYA PARAMBIL PEEDIKA',
  awayTeamName = 'NEW MALAYA MALABAR FC',
  matchStatus = 'LIVE 2ND HALF',
  goalText = '',
  lang = 'en'
}) {
  await ensureFontsLoaded();

  // Create off-screen canvas at strict 1080x1920 portrait dimensions
  const width = 1080;
  const height = 1920;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Resolve team logos
  const homeLogoUrl = getTeamLogoUrl(homeTeamName) || logoUdaya;
  const awayLogoUrl = getTeamLogoUrl(awayTeamName);

  // Preload all assets in parallel
  const [
    imgUdayaHeader,
    imgKascHeader,
    imgSfaHeader,
    imgHomeLogo,
    imgAwayLogo
  ] = await Promise.all([
    loadImage(logoUdaya),
    loadImage(logoKasc),
    loadImage(logoSfa),
    loadImage(homeLogoUrl),
    loadImage(awayLogoUrl)
  ]);

  // ==========================================
  // 1. BASE BACKGROUND & STADIUM ATMOSPHERE
  // ==========================================
  // Deep midnight navy to royal blue gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, '#050a1a');      // Top deep midnight
  bgGrad.addColorStop(0.35, '#0b1633');   // Upper stadium glow
  bgGrad.addColorStop(0.70, '#071026');   // Mid pitch shadow
  bgGrad.addColorStop(1, '#030611');      // Bottom anchor dark
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Radial Floodlight Spotlight from top center
  const spotGrad = ctx.createRadialGradient(width / 2, 100, 50, width / 2, 500, 800);
  spotGrad.addColorStop(0, 'rgba(56, 189, 248, 0.25)'); // Bright sky spotlight
  spotGrad.addColorStop(0.5, 'rgba(30, 58, 138, 0.15)'); // Royal blue diffusion
  spotGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = spotGrad;
  ctx.fillRect(0, 0, width, height);

  // Pitch Field Geometry (Subtle Pitch Center Circle & Lines)
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 4;
  // Center circle
  ctx.beginPath();
  ctx.arc(width / 2, height / 2 + 100, 360, 0, Math.PI * 2);
  ctx.stroke();
  // Center line
  ctx.beginPath();
  ctx.moveTo(60, height / 2 + 100);
  ctx.lineTo(width - 60, height / 2 + 100);
  ctx.stroke();
  ctx.restore();

  // Premium Gold & Royal Blue Perimeter Frame
  ctx.save();
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)'; // Gold line
  ctx.lineWidth = 4;
  roundRect(ctx, 30, 30, width - 60, height - 60, 32);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(59, 130, 246, 0.25)'; // Inner subtle cyan
  ctx.lineWidth = 2;
  roundRect(ctx, 42, 42, width - 84, height - 84, 24);
  ctx.stroke();
  ctx.restore();

  // Corner Gold Accent Highlights
  const drawCorner = (cx, cy, rotate) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotate);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 40);
    ctx.lineTo(0, 0);
    ctx.lineTo(40, 0);
    ctx.stroke();
    ctx.restore();
  };
  drawCorner(55, 55, 0);
  drawCorner(width - 55, 55, Math.PI / 2);
  drawCorner(width - 55, height - 55, Math.PI);
  drawCorner(55, height - 55, -Math.PI / 2);

  // ==========================================
  // 2. TOURNAMENT BRANDING HEADER (y: 80 - 270)
  // ==========================================
  // Badges Row: UDAYA (Left), Official SEASON 7 Crest (Center), KASC (Right)
  const logoY = 90;
  const logoSize = 100;

  // Udaya Crest (Left)
  if (imgUdayaHeader) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(240, logoY + logoSize / 2, 54, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.clip();
    ctx.drawImage(imgUdayaHeader, 240 - 50, logoY, 100, 100);
    ctx.restore();
    ctx.beginPath();
    ctx.arc(240, logoY + logoSize / 2, 54, 0, Math.PI * 2);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  // Official Central Season 7 Shield Emblem (Center)
  ctx.save();
  const centerCrestX = width / 2;
  const centerCrestY = logoY + logoSize / 2;
  const crestR = 50;

  const crestGrad = ctx.createRadialGradient(centerCrestX, centerCrestY - 15, 6, centerCrestX, centerCrestY, crestR);
  crestGrad.addColorStop(0, '#fef08a');
  crestGrad.addColorStop(0.4, '#f59e0b');
  crestGrad.addColorStop(1, '#b45309');
  ctx.fillStyle = crestGrad;
  ctx.beginPath();
  ctx.arc(centerCrestX, centerCrestY, crestR, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3.5;
  ctx.stroke();

  // Emblem Typography
  ctx.fillStyle = '#0f172a';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '900 34px "Oswald", sans-serif';
  ctx.fillText('S7', centerCrestX, centerCrestY - 6);

  ctx.fillStyle = '#1e293b';
  ctx.font = '800 13px "Oswald", sans-serif';
  ctx.fillText('2026-27', centerCrestX, centerCrestY + 20);
  ctx.restore();

  // KASC Peruvallur Crest (Right)
  if (imgKascHeader) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(width - 240, logoY + logoSize / 2, 54, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.clip();
    ctx.drawImage(imgKascHeader, width - 240 - 50, logoY, 100, 100);
    ctx.restore();
    ctx.beginPath();
    ctx.arc(width - 240, logoY + logoSize / 2, 54, 0, Math.PI * 2);
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  // Tournament Titles
  ctx.save();
  ctx.textAlign = 'center';

  // Malayalam Tournament Title
  ctx.fillStyle = '#fbbf24'; // Bright warm gold
  ctx.font = 'bold 36px "Anek Malayalam", "Noto Sans Malayalam", sans-serif';
  ctx.fillText('അഖിലേന്ത്യാ സെവൻസ് ഫുട്ബോൾ ടൂർണ്ണമെന്റ്', width / 2, 230);

  // English Tournament Title
  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('ALL INDIA SEVENS FOOTBALL • PERUVALLUR', width / 2, 268);
  ctx.restore();

  // Season 7 Pill Badge
  ctx.save();
  const seasonPillW = 320;
  const seasonPillH = 46;
  const seasonPillX = (width - seasonPillW) / 2;
  const seasonPillY = 295;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  roundRect(ctx, seasonPillX, seasonPillY, seasonPillW, seasonPillH, 23);
  ctx.fill();
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.fillStyle = '#fde047';
  ctx.font = '800 22px "Oswald", "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('★ SEASON 7 • 2026-27 ★', width / 2, seasonPillY + seasonPillH / 2);
  ctx.restore();

  // ==========================================
  // 3. EXPLOSIVE "GOAL!" HERO SPLASH (y: 380 - 540)
  // ==========================================
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Glow shadow for GOAL text
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 30;

  // Gold to pure white gradient text
  const goalTextGrad = ctx.createLinearGradient(0, 390, 0, 520);
  goalTextGrad.addColorStop(0, '#fffbeb');
  goalTextGrad.addColorStop(0.3, '#fef08a');
  goalTextGrad.addColorStop(1, '#f59e0b');

  ctx.fillStyle = goalTextGrad;
  ctx.font = '900 135px "Oswald", "Plus Jakarta Sans", sans-serif';
  ctx.fillText('GOAL!', width / 2, 450);

  // Second Malayalam subtle label: ഗോൾ!
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.font = 'bold 36px "Anek Malayalam", "Noto Sans Malayalam", sans-serif';
  ctx.fillText('ഗോൾ!', width / 2, 530);
  ctx.restore();

  // Match Minute Pill Badge (e.g. ⚽ 24' MINUTE)
  ctx.save();
  const minPillW = 280;
  const minPillH = 50;
  const minPillX = (width - minPillW) / 2;
  const minPillY = 570;

  ctx.fillStyle = '#10b981'; // Emerald Green
  roundRect(ctx, minPillX, minPillY, minPillW, minPillH, 25);
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px "Oswald", "Anek Malayalam", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const cleanMin = String(minute).replace(/[^0-9]/g, '') || '30';
  ctx.fillText(`⚽ ${cleanMin}' MINUTE`, width / 2, minPillY + minPillH / 2);
  ctx.restore();

  // ==========================================
  // 4. SCORER SPOTLIGHT CARD (y: 655 - 905)
  // ==========================================
  const scorerCardX = 70;
  const scorerCardY = 655;
  const scorerCardW = width - 140; // 940px
  const scorerCardH = 240;

  // Glassmorphic Card Background
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
  roundRect(ctx, scorerCardX, scorerCardY, scorerCardW, scorerCardH, 28);
  ctx.fill();

  const scorerBorderGrad = ctx.createLinearGradient(scorerCardX, scorerCardY, scorerCardX + scorerCardW, scorerCardY + scorerCardH);
  scorerBorderGrad.addColorStop(0, '#f59e0b');
  scorerBorderGrad.addColorStop(0.5, '#3b82f6');
  scorerBorderGrad.addColorStop(1, '#10b981');
  ctx.strokeStyle = scorerBorderGrad;
  ctx.lineWidth = 3;
  ctx.stroke();

  // Scorer Header Tag
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 18px "Plus Jakarta Sans", "Anek Malayalam", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('OFFICIAL GOAL SCORER • ഒഫീഷ്യൽ ഗോൾ സ്കോറർ', width / 2, scorerCardY + 42);
  ctx.restore();

  // Scorer Player Name (Handled with auto-scaling & wrapping for long Malayalam/English names)
  drawScaledText({
    ctx,
    text: scorerName.toUpperCase(),
    x: width / 2,
    y: scorerCardY + 105,
    maxWidth: scorerCardW - 60,
    maxFontSize: 56,
    minFontSize: 32,
    fontWeight: '900',
    fontFamily: '"Oswald", "Anek Malayalam", "Noto Sans Malayalam", sans-serif',
    fillStyle: '#ffffff',
    textAlign: 'center'
  });

  // Team Scored For Sub-Banner
  const scoringTeamName = goalTeam === 'home' ? homeTeamName : awayTeamName;
  ctx.save();
  ctx.fillStyle = '#38bdf8'; // Sky accent
  ctx.font = 'bold 22px "Plus Jakarta Sans", "Anek Malayalam", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`⚽ ${scoringTeamName}`, width / 2, scorerCardY + 165);

  // Optional Note (e.g. "Curler into top corner")
  if (goalText && goalText.trim()) {
    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'italic 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`“${goalText.trim()}”`, width / 2, scorerCardY + 205);
  }
  ctx.restore();

  // ==========================================
  // 5. BIG MATCH SCOREBOARD CARD (y: 930 - 1500)
  // ==========================================
  const scoreCardX = 60;
  const scoreCardY = 930;
  const scoreCardW = width - 120; // 960px
  const scoreCardH = 550;

  // Background Box
  ctx.save();
  const scoreCardGrad = ctx.createLinearGradient(scoreCardX, scoreCardY, scoreCardX, scoreCardY + scoreCardH);
  scoreCardGrad.addColorStop(0, 'rgba(15, 23, 42, 0.95)');
  scoreCardGrad.addColorStop(1, 'rgba(10, 16, 32, 0.98)');
  ctx.fillStyle = scoreCardGrad;
  roundRect(ctx, scoreCardX, scoreCardY, scoreCardW, scoreCardH, 32);
  ctx.fill();

  ctx.strokeStyle = 'rgba(245, 158, 11, 0.7)';
  ctx.lineWidth = 3.5;
  ctx.stroke();

  // Status Bar inside Scoreboard
  const statusBarY = scoreCardY + 45;
  ctx.fillStyle = '#ef4444'; // Red Live Pulse
  ctx.beginPath();
  ctx.arc(width / 2 - 120, statusBarY, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 22px "Oswald", "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(matchStatus ? `● ${matchStatus.toUpperCase()}` : '● LIVE MATCH SCORE', width / 2, statusBarY);
  ctx.restore();

  // Team 1: HOME (Left Column, Center X = 300)
  const homeColX = 300;
  const awayColX = width - 300; // 780
  const teamRowY = scoreCardY + 170;

  // Home Logo Circle
  ctx.save();
  const badgeRadius = 75;
  ctx.beginPath();
  ctx.arc(homeColX, teamRowY, badgeRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.clip();
  if (imgHomeLogo) {
    ctx.drawImage(imgHomeLogo, homeColX - badgeRadius, teamRowY - badgeRadius, badgeRadius * 2, badgeRadius * 2);
  } else if (imgUdayaHeader) {
    ctx.drawImage(imgUdayaHeader, homeColX - badgeRadius + 5, teamRowY - badgeRadius + 5, (badgeRadius - 5) * 2, (badgeRadius - 5) * 2);
  }
  ctx.restore();
  ctx.beginPath();
  ctx.arc(homeColX, teamRowY, badgeRadius, 0, Math.PI * 2);
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Home Team Name
  drawScaledText({
    ctx,
    text: homeTeamName === 'UDAYA PARAMBIL PEEDIKA' ? 'UDAYA' : homeTeamName,
    x: homeColX,
    y: teamRowY + 115,
    maxWidth: 320,
    maxFontSize: 34,
    minFontSize: 24,
    fontWeight: '900',
    fontFamily: '"Oswald", "Anek Malayalam", sans-serif',
    fillStyle: '#ffffff',
    textAlign: 'center'
  });

  // Home Malayalam Subtitle
  ctx.save();
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 20px "Anek Malayalam", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('ഉദയ പറമ്പിൽ പീടിക', homeColX, teamRowY + 155);
  ctx.restore();

  // Home Score (Huge Number)
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 135px "Oswald", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(scoreHome), homeColX, teamRowY + 265);
  ctx.restore();

  // Center "VS" Divider
  ctx.save();
  const vsY = teamRowY + 130;
  ctx.beginPath();
  ctx.arc(width / 2, vsY, 32, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(245, 158, 11, 0.2)';
  ctx.fill();
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.fillStyle = '#f59e0b';
  ctx.font = '900 24px "Oswald", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('VS', width / 2, vsY);

  // Score colon / separator
  ctx.fillStyle = '#64748b';
  ctx.font = '900 110px "Oswald", sans-serif';
  ctx.fillText('-', width / 2, teamRowY + 260);
  ctx.restore();

  // Team 2: AWAY (Right Column, Center X = 780)
  // Away Logo Circle
  ctx.save();
  ctx.beginPath();
  ctx.arc(awayColX, teamRowY, badgeRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.clip();
  if (imgAwayLogo) {
    ctx.drawImage(imgAwayLogo, awayColX - badgeRadius, teamRowY - badgeRadius, badgeRadius * 2, badgeRadius * 2);
  } else {
    // Default stylized shield for opponent
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(awayColX - badgeRadius, teamRowY - badgeRadius, badgeRadius * 2, badgeRadius * 2);
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 32px "Oswald", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('MALABAR', awayColX, teamRowY);
  }
  ctx.restore();
  ctx.beginPath();
  ctx.arc(awayColX, teamRowY, badgeRadius, 0, Math.PI * 2);
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Away Team Name
  drawScaledText({
    ctx,
    text: awayTeamName === 'NEW MALAYA MALABAR FC' ? 'NEW MALAYA' : awayTeamName,
    x: awayColX,
    y: teamRowY + 115,
    maxWidth: 320,
    maxFontSize: 34,
    minFontSize: 24,
    fontWeight: '900',
    fontFamily: '"Oswald", "Anek Malayalam", sans-serif',
    fillStyle: '#ffffff',
    textAlign: 'center'
  });

  // Away Malayalam Subtitle
  ctx.save();
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 20px "Anek Malayalam", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('ന്യൂ മലയ മലബാർ എഫ്.സി', awayColX, teamRowY + 155);
  ctx.restore();

  // Away Score (Huge Number)
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 135px "Oswald", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(scoreAway), awayColX, teamRowY + 265);
  ctx.restore();

  // ==========================================
  // 6. OFFICIAL VERIFICATION & VENUE (y: 1515 - 1715)
  // ==========================================
  const metaCardY = 1515;
  const metaCardH = 175;

  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
  roundRect(ctx, 70, metaCardY, width - 140, metaCardH, 24);
  ctx.fill();
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Verified Badge
  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🛡️ SFA OFFICIAL MATCH DESK VERIFIED BROADCAST', width / 2, metaCardY + 45);

  // Stadium & Date
  ctx.fillStyle = '#f1f5f9';
  ctx.font = 'bold 24px "Plus Jakarta Sans", "Anek Malayalam", sans-serif';
  ctx.fillText('🏟️ Peruvallur Panjayath Stadium, Parambil Peedika', width / 2, metaCardY + 95);

  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 20px "Anek Malayalam", sans-serif';
  ctx.fillText('പെരുവള്ളൂർ പഞ്ചായത്ത് സ്റ്റേഡിയം • പറമ്പിൽ പീടിക', width / 2, metaCardY + 135);
  ctx.restore();

  // ==========================================
  // 7. BRAND FOOTER (y: 1720 - 1880)
  // ==========================================
  ctx.save();
  // Thin Gold Divider
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(120, 1725);
  ctx.lineTo(width - 120, 1725);
  ctx.stroke();

  // Organizers Tagline
  ctx.fillStyle = '#fde047';
  ctx.font = 'bold 22px "Plus Jakarta Sans", "Anek Malayalam", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('UDAYA PARAMBIL PEEDIKA & KASC PERUVALLUR', width / 2, 1765);

  // Live URL & Hashtags
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
  const displayDomain = typeof window !== 'undefined' && window.location.hostname
    ? window.location.hostname
    : 'udaya-football.vercel.app';
  ctx.fillText(`${displayDomain}  •  #KeralaSevens  •  #Season7`, width / 2, 1810);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.font = '16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Instant WhatsApp Status Share • Official Digital Media Desk', width / 2, 1850);
  ctx.restore();

  // ==========================================
  // 8. EXPORT BLOB & DATA URL
  // ==========================================
  const dataUrl = canvas.toDataURL('image/png', 0.95);
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png', 0.95));

  const asciiOnly = scorerName.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
  const cleanPlayerName = asciiOnly.length > 0 ? asciiOnly.slice(0, 20) : 'scorer';
  const fileName = `kasc-goal-${cleanPlayerName}-${cleanMin}min.png`;

  return {
    blob,
    dataUrl,
    fileName,
    width,
    height
  };
}

/**
 * Native Web Share API with instant direct download fallback
 */
export async function shareGoalCard({ blob, dataUrl, title, text, fileName }) {
  const finalFileName = fileName || 'kasc-sevens-goal.png';
  const shareTitle = title || '⚽ GOAL! - All India Sevens Season 7';
  const fallbackOrigin = typeof window !== 'undefined' && window.location.origin
    ? window.location.origin
    : 'https://udaya-football.vercel.app';
  const shareText = text || `Live goal update from Udaya & KASC All India Sevens Football Tournament! Check live scores at ${fallbackOrigin}`;

  // 1. Try Native Web Share API (Mobile WhatsApp Status direct share)
  if (typeof navigator !== 'undefined' && navigator.share && blob) {
    try {
      const file = new File([blob], finalFileName, { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          files: [file]
        });
        return { success: true, method: 'web-share' };
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        // User voluntarily dismissed share sheet
        return { success: false, aborted: true };
      }
      console.warn('Web Share API error, engaging download fallback:', err);
    }
  }

  // 2. Fallback: Trigger browser image download
  try {
    const downloadHref = dataUrl || (blob ? URL.createObjectURL(blob) : null);
    if (!downloadHref) throw new Error('No image data available to download');

    const link = document.createElement('a');
    link.href = downloadHref;
    link.download = finalFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (!dataUrl && blob) {
      setTimeout(() => URL.revokeObjectURL(downloadHref), 4000);
    }

    return { success: true, method: 'download' };
  } catch (downloadErr) {
    console.error('Download fallback failed:', downloadErr);
    return { success: false, error: downloadErr.message };
  }
}
