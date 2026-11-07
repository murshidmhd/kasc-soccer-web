import React from 'react';
import { Play, Radio } from 'lucide-react';

const PREVIOUS_MATCH_VIDEO_ID = '3Fr8ctztT7k';
const PREVIOUS_MATCH_VIDEO_URL = `https://www.youtube.com/watch?v=${PREVIOUS_MATCH_VIDEO_ID}`;

export default function LiveViewingSection({ lang }) {
  const isMalayalam = lang === 'ml';

  return (
    <section
      id="live-viewing"
      className="overflow-hidden rounded-3xl border border-surface-border dark:border-navy-700 surface-card shadow-card"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-border dark:border-navy-700 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-royal/10 text-royal dark:bg-sky/10 dark:text-sky">
            <Radio className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-black font-sports uppercase tracking-wide text-card-title">
              {isMalayalam ? 'ലൈവ് മത്സരവും റീപ്ലേയും' : 'Live Match & Replay'}
            </h2>
            <p className="text-[11px] text-card-muted">
              {isMalayalam ? 'തത്സമയ മത്സരവും കഴിഞ്ഞ മത്സരങ്ങളുടെ റീപ്ലേയും' : 'Watch live matches and previous match replays'}
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-300">
          <Play className="h-3 w-3 fill-current" />
          {isMalayalam ? 'കഴിഞ്ഞ മത്സരത്തിന്റെ റീപ്ലേ' : 'Previous match replay'}
        </span>
      </div>

      <a
        href={PREVIOUS_MATCH_VIDEO_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block aspect-video w-full overflow-hidden bg-black text-white"
        aria-label={isMalayalam ? 'YouTube-ൽ കഴിഞ്ഞ മത്സരത്തിന്റെ റീപ്ലേ കാണുക' : 'Watch the previous match replay on YouTube'}
      >
        <img
          src={`https://i.ytimg.com/vi/${PREVIOUS_MATCH_VIDEO_ID}/hqdefault.jpg`}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-80 transition group-hover:scale-[1.02]"
          onError={(event) => { event.currentTarget.style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
        <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 sm:inset-x-6 sm:bottom-5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition group-hover:scale-105">
              <Play className="ml-0.5 h-5 w-5 fill-current" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-black">
                {isMalayalam ? 'YouTube-ൽ റീപ്ലേ കാണുക' : 'Watch replay on YouTube'}
              </span>
              <span className="block text-[11px] text-white/75">
                {isMalayalam ? 'കഴിഞ്ഞ മത്സരത്തിന്റെ പൂർണ്ണ വീഡിയോ' : 'Full video of the previous match'}
              </span>
            </span>
          </div>
          <span className="shrink-0 rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide">
            YouTube
          </span>
        </div>
      </a>

    </section>
  );
}
