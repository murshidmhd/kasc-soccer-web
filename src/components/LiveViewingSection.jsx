import React, { useState, useEffect } from 'react';
import { Play, Radio } from 'lucide-react';
import { getStoredMatchState } from '../utils/matchStateManager';
import tournamentPoster from '../assets/tournament_teaser_poster.webp';

const DEFAULT_STREAM_URL = 'https://www.youtube.com/@sabithsmgvlog';

function extractYouTubeId(url) {
  if (!url || typeof url !== 'string') return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|live\/|shorts\/)|youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=))([^"&?\/\s]{11})/i);
  return match ? match[1] : null;
}

export default function LiveViewingSection({ lang }) {
  const isMalayalam = lang === 'ml';
  const [matchState, setMatchState] = useState(getStoredMatchState);

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e?.detail) {
        setMatchState(e.detail);
      }
    };
    window.addEventListener('kasc_match_state_updated', handleUpdate);
    return () => window.removeEventListener('kasc_match_state_updated', handleUpdate);
  }, []);

  const streamUrl = (matchState?.liveStreamUrl || '').trim() || DEFAULT_STREAM_URL;
  const isMatchLive = matchState?.status === '1ST_HALF' || matchState?.status === '2ND_HALF' || matchState?.status === 'HALF_TIME';
  const isLive = Boolean(matchState?.isStreamLive || isMatchLive);

  const videoId = extractYouTubeId(streamUrl);
  const thumbnailUrl = videoId 
    ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
    : tournamentPoster;

  return (
    <section
      id="live-viewing"
      className="overflow-hidden rounded-3xl border border-surface-border dark:border-navy-700 surface-card shadow-card animate-fadeIn"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-border dark:border-navy-700 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2.5">
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${
            isLive 
              ? 'bg-red-500/20 text-red-500 animate-pulse' 
              : 'bg-royal/10 text-royal dark:bg-sky/10 dark:text-sky'
          }`}>
            <Radio className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-black font-sports uppercase tracking-wide text-card-title">
              {isLive 
                ? (isMalayalam ? 'തത്സമയ ലൈവ് സ്ട്രീം' : 'Live Match Stream')
                : (isMalayalam ? 'മത്സര റീപ്ലേ & ഹൈലൈറ്റ്സ്' : 'Match Replay & Highlights')}
            </h2>
            <p className="text-[11px] text-card-muted">
              {isLive
                ? (isMalayalam ? 'ഗ്രൗണ്ടിൽ നിന്നുള്ള ഔദ്യോഗിക സംപ്രേക്ഷണം' : 'Official stadium stream')
                : (isMalayalam ? 'YouTube സംപ്രേക്ഷണം' : 'Watch on YouTube')}
            </p>
          </div>
        </div>

        {isLive ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-500/15 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-red-600 dark:text-red-400 animate-pulse">
            <span className="h-2 w-2 rounded-full bg-red-600" />
            {isMalayalam ? '🔴 ലൈവ്' : '🔴 LIVE NOW'}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-300">
            <Play className="h-3 w-3 fill-current" />
            {isMalayalam ? 'കഴിഞ്ഞ മത്സരത്തിന്റെ റീപ്ലേ' : 'Previous match replay'}
          </span>
        )}
      </div>

      <a
        href={streamUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block aspect-video w-full overflow-hidden bg-black text-white"
        aria-label={isLive 
          ? (isMalayalam ? 'YouTube-ൽ തത്സമയം മത്സരം കാണുക' : 'Watch live match on YouTube')
          : (isMalayalam ? 'YouTube-ൽ കഴിഞ്ഞ മത്സരത്തിന്റെ റീപ്ലേ കാണുക' : 'Watch replay on YouTube')}
      >
        <img
          src={thumbnailUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-80 transition group-hover:scale-[1.02]"
          onError={(event) => { event.currentTarget.style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
        <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 sm:inset-x-6 sm:bottom-5">
          <div className="flex min-w-0 items-center gap-3">
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white shadow-lg transition group-hover:scale-105 ${
              isLive ? 'bg-red-600 ring-4 ring-red-500/30 animate-pulse' : 'bg-red-600'
            }`}>
              <Play className="ml-0.5 h-5 w-5 fill-current" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-black">
                {isLive 
                  ? (isMalayalam ? 'തത്സമയം കാണുക' : 'Watch Live Stream') 
                  : (isMalayalam ? 'വീഡിയോ കാണുക' : 'Watch on YouTube')}
              </span>
              <span className="block text-[11px] text-white/75 truncate">
                {isLive 
                  ? (isMalayalam ? 'ഔദ്യോഗിക HD സംപ്രേക്ഷണം' : 'Official HD Stream')
                  : (isMalayalam ? 'പൂർണ്ണ മത്സര വീഡിയോ' : 'Full match video')}
              </span>
            </span>
          </div>
          <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-white ${
            isLive ? 'bg-red-600' : 'bg-red-600'
          }`}>
            YouTube
          </span>
        </div>
      </a>
    </section>
  );
}
