import React from 'react';

const teamBadgeConfigs = {
  'UDAYA Peruvallur': {
    code: 'UDAYA',
    sub: 'PRVLR',
    bgGradient: 'from-sky-600 to-blue-900',
    borderColor: 'border-sky-500',
    ringColor: 'ring-sky-200',
    textColor: 'text-white',
    accentColor: 'text-sky-300'
  },
  'UDAYA PERUVALLUR': {
    code: 'UDAYA',
    sub: 'PRVLR',
    bgGradient: 'from-sky-600 to-blue-900',
    borderColor: 'border-sky-500',
    ringColor: 'ring-sky-200',
    textColor: 'text-white',
    accentColor: 'text-sky-300'
  },
  'SABAN FC Kottakkal': {
    code: 'SABAN',
    sub: 'KTKL',
    bgGradient: 'from-amber-400 to-yellow-600',
    borderColor: 'border-amber-400',
    ringColor: 'ring-amber-200',
    textColor: 'text-slate-950',
    accentColor: 'text-slate-900'
  },
  'SABAN FC KOTTAKKAL': {
    code: 'SABAN',
    sub: 'KTKL',
    bgGradient: 'from-amber-400 to-yellow-600',
    borderColor: 'border-amber-400',
    ringColor: 'ring-amber-200',
    textColor: 'text-slate-950',
    accentColor: 'text-slate-900'
  },
  'FIFA Manjeri': {
    code: 'FIFA',
    sub: 'MJR',
    bgGradient: 'from-red-600 to-rose-900',
    borderColor: 'border-red-500',
    ringColor: 'ring-red-200',
    textColor: 'text-white',
    accentColor: 'text-amber-300'
  },
  'Super Studio Malappuram': {
    code: 'SUPER',
    sub: 'MLPM',
    bgGradient: 'from-blue-700 to-indigo-950',
    borderColor: 'border-blue-500',
    ringColor: 'ring-blue-200',
    textColor: 'text-white',
    accentColor: 'text-yellow-400'
  },
  'Linsha Tirur': {
    code: 'LINSHA',
    sub: 'TIRUR',
    bgGradient: 'from-emerald-600 to-teal-900',
    borderColor: 'border-emerald-500',
    ringColor: 'ring-emerald-200',
    textColor: 'text-white',
    accentColor: 'text-emerald-200'
  },
  'Linsha Medicals Tirur': {
    code: 'LINSHA',
    sub: 'TIRUR',
    bgGradient: 'from-emerald-600 to-teal-900',
    borderColor: 'border-emerald-500',
    ringColor: 'ring-emerald-200',
    textColor: 'text-white',
    accentColor: 'text-emerald-200'
  },
  'Al-Madina Cherpulassery': {
    code: 'MADINA',
    sub: 'CPLY',
    bgGradient: 'from-purple-600 to-violet-950',
    borderColor: 'border-purple-500',
    ringColor: 'ring-purple-200',
    textColor: 'text-white',
    accentColor: 'text-amber-300'
  },
  'Royal Travel Kozhikode': {
    code: 'ROYAL',
    sub: 'CLT',
    bgGradient: 'from-cyan-600 to-blue-950',
    borderColor: 'border-cyan-500',
    ringColor: 'ring-cyan-200',
    textColor: 'text-white',
    accentColor: 'text-cyan-200'
  },
  'Usha Thrissur': {
    code: 'USHA',
    sub: 'TSR',
    bgGradient: 'from-orange-500 to-red-900',
    borderColor: 'border-orange-500',
    ringColor: 'ring-orange-200',
    textColor: 'text-white',
    accentColor: 'text-yellow-200'
  },
  'Town Team Areekode': {
    code: 'TOWN',
    sub: 'ARKD',
    bgGradient: 'from-green-600 to-emerald-950',
    borderColor: 'border-green-500',
    ringColor: 'ring-green-200',
    textColor: 'text-white',
    accentColor: 'text-green-200'
  },
  'Black & White Kozhikode': {
    code: 'B & W',
    sub: 'CLT',
    bgGradient: 'from-zinc-800 to-black',
    borderColor: 'border-zinc-500',
    ringColor: 'ring-zinc-300',
    textColor: 'text-white',
    accentColor: 'text-zinc-300'
  },
  'Gymkhana Thrissur': {
    code: 'GYM',
    sub: 'TSR',
    bgGradient: 'from-amber-600 to-stone-900',
    borderColor: 'border-amber-500',
    ringColor: 'ring-amber-200',
    textColor: 'text-white',
    accentColor: 'text-amber-300'
  },
  'Moon Star Kalpakanchery': {
    code: 'MOON',
    sub: 'KPKY',
    bgGradient: 'from-sky-500 to-slate-900',
    borderColor: 'border-sky-400',
    ringColor: 'ring-sky-200',
    textColor: 'text-white',
    accentColor: 'text-sky-200'
  }
};

export default function TeamLogo({ teamName, className = "w-12 h-12" }) {
  const config = teamBadgeConfigs[teamName] || {
    code: teamName ? teamName.substring(0, 4).toUpperCase() : 'FC',
    sub: 'CLUB',
    bgGradient: 'from-blue-700 to-slate-900',
    borderColor: 'border-blue-500',
    ringColor: 'ring-blue-200',
    textColor: 'text-white',
    accentColor: 'text-blue-200'
  };

  return (
    <div
      className={`${className} shrink-0 rounded-2xl bg-gradient-to-br ${config.bgGradient} p-1 border-2 ${config.borderColor} shadow-xs flex flex-col items-center justify-center text-center select-none`}
      title={teamName}
    >
      <span className={`font-black font-sports tracking-wider leading-none text-xs sm:text-sm ${config.textColor}`}>
        {config.code}
      </span>
      <span className={`text-[8px] font-bold uppercase tracking-widest mt-0.5 leading-none opacity-85 ${config.accentColor}`}>
        {config.sub}
      </span>
    </div>
  );
}
