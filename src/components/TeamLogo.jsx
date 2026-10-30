import React, { useState } from 'react';
import { getTeamLogoUrl } from '../assets/teams/index';

const teamBadgeConfigs = {
  'UDAYA Peruvallur': { code: 'UDAYA', sub: 'PRVLR', bgGradient: 'from-sky-600 to-blue-900', borderColor: 'border-sky-500', textColor: 'text-white', accentColor: 'text-sky-300' },
  'UDAYA PERUVALLUR': { code: 'UDAYA', sub: 'PRVLR', bgGradient: 'from-sky-600 to-blue-900', borderColor: 'border-sky-500', textColor: 'text-white', accentColor: 'text-sky-300' },
  'UDAYA PARAMBIL PEEDIKA': { code: 'UDAYA', sub: 'PRVLR', bgGradient: 'from-amber-500 to-red-700', borderColor: 'border-amber-400', textColor: 'text-white', accentColor: 'text-yellow-200' },
  'SABAN KOTTAKKAL': { code: 'SABAN', sub: 'KTKL', bgGradient: 'from-amber-400 to-yellow-600', borderColor: 'border-amber-400', textColor: 'text-slate-950', accentColor: 'text-slate-900' },
  'SABAN FC Kottakkal': { code: 'SABAN', sub: 'KTKL', bgGradient: 'from-amber-400 to-yellow-600', borderColor: 'border-amber-400', textColor: 'text-slate-950', accentColor: 'text-slate-900' },
  'SABAN FC KOTTAKKAL': { code: 'SABAN', sub: 'KTKL', bgGradient: 'from-amber-400 to-yellow-600', borderColor: 'border-amber-400', textColor: 'text-slate-950', accentColor: 'text-slate-900' },
  'Super Studio Malappuram': { code: 'SUPER', sub: 'MLPM', bgGradient: 'from-blue-700 to-indigo-950', borderColor: 'border-blue-500', textColor: 'text-white', accentColor: 'text-yellow-400' },
  'SUPER STUDIO MALAPPURAM': { code: 'SUPER', sub: 'MLPM', bgGradient: 'from-blue-700 to-indigo-950', borderColor: 'border-blue-500', textColor: 'text-white', accentColor: 'text-yellow-400' },
  'Linsha Medicals Mannarkkad': { code: 'LINSHA', sub: 'MNKD', bgGradient: 'from-emerald-600 to-teal-900', borderColor: 'border-emerald-500', textColor: 'text-white', accentColor: 'text-emerald-200' },
  'LINSHA MEDICALS MANNARKKAD': { code: 'LINSHA', sub: 'MNKD', bgGradient: 'from-emerald-600 to-teal-900', borderColor: 'border-emerald-500', textColor: 'text-white', accentColor: 'text-emerald-200' },
  'Al-Madina Cherpulassery': { code: 'MADINA', sub: 'CPLY', bgGradient: 'from-purple-600 to-violet-950', borderColor: 'border-purple-500', textColor: 'text-white', accentColor: 'text-amber-300' },
  'AL MADEENA CHERPULASSERI': { code: 'MADINA', sub: 'CPLY', bgGradient: 'from-purple-600 to-violet-950', borderColor: 'border-purple-500', textColor: 'text-white', accentColor: 'text-amber-300' },
  'Base Perumbavur': { code: 'BASE', sub: 'PBR', bgGradient: 'from-zinc-800 to-black', borderColor: 'border-zinc-400', textColor: 'text-white', accentColor: 'text-zinc-300' },
  'BASE PERUMBAVUR': { code: 'BASE', sub: 'PBR', bgGradient: 'from-zinc-800 to-black', borderColor: 'border-zinc-400', textColor: 'text-white', accentColor: 'text-zinc-300' },
  'KMG Mavoor': { code: 'KMG', sub: 'MVR', bgGradient: 'from-green-700 to-emerald-950', borderColor: 'border-green-500', textColor: 'text-white', accentColor: 'text-green-200' },
  'KMG MAVOOR': { code: 'KMG', sub: 'MVR', bgGradient: 'from-green-700 to-emerald-950', borderColor: 'border-green-500', textColor: 'text-white', accentColor: 'text-green-200' },
  'FC Perinthalmanna': { code: 'PMNA', sub: 'FC', bgGradient: 'from-red-600 to-indigo-900', borderColor: 'border-red-400', textColor: 'text-white', accentColor: 'text-yellow-300' },
  'FC PERINTHALMANNA': { code: 'PMNA', sub: 'FC', bgGradient: 'from-red-600 to-indigo-900', borderColor: 'border-red-400', textColor: 'text-white', accentColor: 'text-yellow-300' },
  'United FC Nellikkuth': { code: 'UNITED', sub: 'NLKT', bgGradient: 'from-blue-800 to-orange-700', borderColor: 'border-blue-500', textColor: 'text-white', accentColor: 'text-orange-300' },
  'UNITED FC NELLIKKUTH': { code: 'UNITED', sub: 'NLKT', bgGradient: 'from-blue-800 to-orange-700', borderColor: 'border-blue-500', textColor: 'text-white', accentColor: 'text-orange-300' },
  'I nov FC Manjeri': { code: 'INOV', sub: 'MJR', bgGradient: 'from-slate-900 to-blue-900', borderColor: 'border-sky-400', textColor: 'text-white', accentColor: 'text-amber-400' },
  'I nov FC MANJERI': { code: 'INOV', sub: 'MJR', bgGradient: 'from-slate-900 to-blue-900', borderColor: 'border-sky-400', textColor: 'text-white', accentColor: 'text-amber-400' },
  'X8 Tours Calicut': { code: 'X8', sub: 'CLT', bgGradient: 'from-red-700 to-black', borderColor: 'border-red-500', textColor: 'text-white', accentColor: 'text-red-200' },
  'X8 TOURS CALICUT': { code: 'X8', sub: 'CLT', bgGradient: 'from-red-700 to-black', borderColor: 'border-red-500', textColor: 'text-white', accentColor: 'text-red-200' },
  'Malbar FC Kozhikkode': { code: 'MALBAR', sub: 'CLT', bgGradient: 'from-sky-500 to-blue-900', borderColor: 'border-sky-400', textColor: 'text-white', accentColor: 'text-yellow-300' },
  'MALBAR FC KOZHIKKODE': { code: 'MALBAR', sub: 'CLT', bgGradient: 'from-sky-500 to-blue-900', borderColor: 'border-sky-400', textColor: 'text-white', accentColor: 'text-yellow-300' },
  'NEW MALAYA MALABAR FC': { code: 'MALABAR', sub: 'CLT', bgGradient: 'from-zinc-900 to-black', borderColor: 'border-zinc-400', textColor: 'text-white', accentColor: 'text-zinc-300' },
  'New Malaya Malabar FC': { code: 'MALABAR', sub: 'CLT', bgGradient: 'from-zinc-900 to-black', borderColor: 'border-zinc-400', textColor: 'text-white', accentColor: 'text-zinc-300' },
  'NEW MALAYA FC': { code: 'MALABAR', sub: 'CLT', bgGradient: 'from-zinc-900 to-black', borderColor: 'border-zinc-400', textColor: 'text-white', accentColor: 'text-zinc-300' },
  'New Malaya FC': { code: 'MALABAR', sub: 'CLT', bgGradient: 'from-zinc-900 to-black', borderColor: 'border-zinc-400', textColor: 'text-white', accentColor: 'text-zinc-300' },
  'Shooters Padanna': { code: 'SHOTR', sub: 'PDNA', bgGradient: 'from-emerald-500 to-green-950', borderColor: 'border-emerald-400', textColor: 'text-white', accentColor: 'text-emerald-300' },
  'SHOOTERS PADANNA': { code: 'SHOTR', sub: 'PDNA', bgGradient: 'from-emerald-500 to-green-950', borderColor: 'border-emerald-400', textColor: 'text-white', accentColor: 'text-emerald-300' },
  'AYC Ucharakadavu': { code: 'AYC', sub: 'UKDV', bgGradient: 'from-cyan-600 to-blue-950', borderColor: 'border-cyan-400', textColor: 'text-white', accentColor: 'text-cyan-200' },
  'AYC UCHARAKADAVU': { code: 'AYC', sub: 'UKDV', bgGradient: 'from-cyan-600 to-blue-950', borderColor: 'border-cyan-400', textColor: 'text-white', accentColor: 'text-cyan-200' },
  'Soccer Sporting Shornur': { code: 'SOCCER', sub: 'SHNR', bgGradient: 'from-rose-800 to-red-950', borderColor: 'border-rose-400', textColor: 'text-white', accentColor: 'text-yellow-300' },
  'SOCCER SPORTING SHORNUR': { code: 'SOCCER', sub: 'SHNR', bgGradient: 'from-rose-800 to-red-950', borderColor: 'border-rose-400', textColor: 'text-white', accentColor: 'text-yellow-300' },
  'Town Team Areekode': { code: 'TOWN', sub: 'ARKD', bgGradient: 'from-sky-600 to-blue-950', borderColor: 'border-sky-400', textColor: 'text-white', accentColor: 'text-sky-200' },
  'TOWN TEAM AREEKODE': { code: 'TOWN', sub: 'ARKD', bgGradient: 'from-sky-600 to-blue-950', borderColor: 'border-sky-400', textColor: 'text-white', accentColor: 'text-sky-200' },
  'Seven Star FC Palakkad': { code: '7STAR', sub: 'PKD', bgGradient: 'from-red-900 to-black', borderColor: 'border-red-600', textColor: 'text-white', accentColor: 'text-amber-400' },
  'SEVEN STAR FC PALAKKAD': { code: '7STAR', sub: 'PKD', bgGradient: 'from-red-900 to-black', borderColor: 'border-red-600', textColor: 'text-white', accentColor: 'text-amber-400' },
  'Real FC Thennala': { code: 'REAL', sub: 'THNL', bgGradient: 'from-sky-400 to-blue-700', borderColor: 'border-sky-300', textColor: 'text-white', accentColor: 'text-white' },
  'REAL FC THENNALA': { code: 'REAL', sub: 'THNL', bgGradient: 'from-sky-400 to-blue-700', borderColor: 'border-sky-300', textColor: 'text-white', accentColor: 'text-white' },
  'Powerdippo Thrissur': { code: 'PWR', sub: 'TSR', bgGradient: 'from-red-600 to-rose-900', borderColor: 'border-red-400', textColor: 'text-white', accentColor: 'text-yellow-200' },
  'POWERDIPPO THRISSUR': { code: 'PWR', sub: 'TSR', bgGradient: 'from-red-600 to-rose-900', borderColor: 'border-red-400', textColor: 'text-white', accentColor: 'text-yellow-200' },
  'KRSC Kozhikkode': { code: 'KRSC', sub: 'CLT', bgGradient: 'from-amber-500 to-red-800', borderColor: 'border-amber-400', textColor: 'text-white', accentColor: 'text-yellow-200' },
  'KRSC KOZHIKKODE': { code: 'KRSC', sub: 'CLT', bgGradient: 'from-amber-500 to-red-800', borderColor: 'border-amber-400', textColor: 'text-white', accentColor: 'text-yellow-200' },
  'Hunters Koothuparamba': { code: 'HNTR', sub: 'KTPR', bgGradient: 'from-zinc-900 to-black', borderColor: 'border-amber-500', textColor: 'text-white', accentColor: 'text-amber-400' },
  'HUNTERS KOOTHUPARAMBA': { code: 'HNTR', sub: 'KTPR', bgGradient: 'from-zinc-900 to-black', borderColor: 'border-amber-500', textColor: 'text-white', accentColor: 'text-amber-400' },
  'Abilash FC Kuppooth': { code: 'ABLSH', sub: 'KPTH', bgGradient: 'from-blue-700 to-indigo-950', borderColor: 'border-blue-400', textColor: 'text-white', accentColor: 'text-blue-200' },
  'ABILASH FC KUPPOOTH': { code: 'ABLSH', sub: 'KPTH', bgGradient: 'from-blue-700 to-indigo-950', borderColor: 'border-blue-400', textColor: 'text-white', accentColor: 'text-blue-200' },
  'AFC Wayanad': { code: 'AFC', sub: 'WYND', bgGradient: 'from-red-600 to-amber-700', borderColor: 'border-amber-400', textColor: 'text-white', accentColor: 'text-yellow-300' },
  'AFC WAYANAD': { code: 'AFC', sub: 'WYND', bgGradient: 'from-red-600 to-amber-700', borderColor: 'border-amber-400', textColor: 'text-white', accentColor: 'text-yellow-300' },
  'Usha FC Thrissur': { code: 'USHA', sub: 'TSR', bgGradient: 'from-red-600 to-rose-900', borderColor: 'border-red-400', textColor: 'text-white', accentColor: 'text-yellow-200' },
  'USHA FC THRISSUR': { code: 'USHA', sub: 'TSR', bgGradient: 'from-red-600 to-rose-900', borderColor: 'border-red-400', textColor: 'text-white', accentColor: 'text-yellow-200' }
};

export default function TeamLogo({ teamName, className = "w-12 h-12", fallbackClassName }) {
  const [hasImageError, setHasImageError] = useState(false);
  const logoUrl = getTeamLogoUrl(teamName);
  const hasCustomRounding = className.includes('rounded-');

  if (logoUrl && !hasImageError) {
    return (
      <div 
        className={`${className} shrink-0 ${hasCustomRounding ? '' : 'rounded-2xl'} bg-white p-1 border border-slate-200 shadow-xs flex items-center justify-center overflow-hidden transition-transform duration-200 hover:scale-105 select-none`}
        title={teamName}
      >
        <img 
          src={logoUrl} 
          alt={teamName || 'Club Logo'} 
          onError={() => setHasImageError(true)}
          className="w-full h-full object-contain filter drop-shadow-2xs"
          loading="lazy"
        />
      </div>
    );
  }

  // Stylish SVG / Typography Fallback Badge
  const config = teamBadgeConfigs[teamName] || {
    code: teamName ? teamName.substring(0, 4).toUpperCase() : 'FC',
    sub: 'CLUB',
    bgGradient: 'from-blue-700 to-slate-900',
    borderColor: 'border-blue-500',
    textColor: 'text-white',
    accentColor: 'text-blue-200'
  };

  return (
    <div
      className={`${fallbackClassName || className} shrink-0 rounded-2xl bg-gradient-to-br ${config.bgGradient} p-1 border-2 ${config.borderColor} shadow-xs flex flex-col items-center justify-center text-center select-none`}
      title={teamName}
    >
      <span className={`font-black font-sports tracking-wider leading-none text-xs sm:text-sm ${config.textColor}`}>
        {config.code}
      </span>
      <span className={`text-[8px] font-bold uppercase tracking-widest mt-0.5 leading-none opacity-90 ${config.accentColor}`}>
        {config.sub}
      </span>
    </div>
  );
}
