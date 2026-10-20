import React, { useState } from 'react';
import { Film, Image as ImageIcon, Users, Phone, Share2, Play, Volume2, Maximize2, Sparkles, Globe2, Eye } from 'lucide-react';
import { openingMatch, tournamentInfo } from '../data/tournamentData';
import tournamentOfficialPoster from '../assets/tournament_official_poster.jpg';
import matchActionDuel from '../assets/match_action_duel.jpg';

export default function LiveStreamHub({ lang, isDarkMode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeMediaTab, setActiveMediaTab] = useState('video'); // 'video' | 'poster'
  const [liveViewers, setLiveViewers] = useState(3840);

  const handleShareStream = () => {
    const text = encodeURIComponent(
      `⚽ *അഖിലേന്ത്യാ സെവൻസ് സീസൺ 7 - ഒഫീഷ്യൽ മാച്ച് പ്രിവ്യൂ & വീഡിയോ!* 🔥\n\n` +
      `⚔️ UDAYA Peruvallur vs SABAN FC Kottakkal\n` +
      `📅 06 Nov 2026 • 8:00 PM IST\n` +
      `📍 Peruvallur Panjayath Stadium\n` +
      `🎬 ഒഫീഷ്യൽ വീഡിയോയും പോസ്റ്ററും ഇവിടെ കാണാം: ${window.location.origin}/#live`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className={`rounded-2xl sm:rounded-3xl border overflow-hidden transition-colors shadow-xs ${
      isDarkMode 
        ? 'bg-slate-900 border-slate-800 text-white' 
        : 'bg-white border-slate-200 text-slate-900'
    }`}>
      {/* Media Top Header with Switcher */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-700 text-white flex items-center justify-center font-black shadow-xs">
            <Film className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black font-sports uppercase tracking-wider text-slate-950">
                {lang === 'ml' ? 'മാച്ച് വീഡിയോ & ഒഫീഷ്യൽ പോസ്റ്റർ' : 'OFFICIAL MATCH VIDEO & POSTER'}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-black uppercase tracking-wider">
                HD Media
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {lang === 'ml'
                ? 'സെവൻസ് ആവേശ വീഡിയോയും ഒഫീഷ്യൽ ടൂർണ്ണമെന്റ് പോസ്റ്ററും തത്സമയം കാണാം'
                : 'Watch official Kerala Sevens match footage and high-res tournament poster'}
            </p>
          </div>
        </div>

        {/* Media Switcher: Video Reel vs Official Poster */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 self-start sm:self-auto shadow-xs">
          <button
            onClick={() => setActiveMediaTab('video')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 active:scale-95 ${
              activeMediaTab === 'video'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Match Video</span>
          </button>
          <button
            onClick={() => setActiveMediaTab('poster')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 active:scale-95 ${
              activeMediaTab === 'poster'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Official Poster</span>
          </button>
        </div>
      </div>

      {/* Main Media Screen Container */}
      {activeMediaTab === 'video' ? (
        <div className="relative aspect-video w-full bg-slate-950 overflow-hidden group">
          {!isPlaying ? (
            /* Pre-Play Matchday Thumbnail & Play Overlay */
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-900/90 text-white">
              {/* Background preview image */}
              <img
                src={matchActionDuel}
                alt="Match Preview"
                className="absolute inset-0 w-full h-full object-cover opacity-25 filter blur-xs"
              />

              <div className="relative z-10 space-y-3 max-w-md">
                <span className="px-3 py-1 rounded-full bg-red-600/95 text-white text-[10px] sm:text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5 shadow-md">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                  SEVENS FOOTBALL TEASER
                </span>

                <h2 className="text-xl sm:text-3xl font-black font-sports tracking-wide uppercase">
                  {openingMatch.teamHome.shortName} <span className="text-blue-400">vs</span> {openingMatch.teamAway.shortName}
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  {tournamentInfo.venueMalayalam} • 06 Nov 8:00 PM
                </p>

                {/* Big Play Button */}
                <button
                  onClick={() => setIsPlaying(true)}
                  className="mt-2 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center mx-auto shadow-xl hover:scale-110 active:scale-95 transition-all group-hover:ring-4 group-hover:ring-red-500/50"
                  title="Play Match Action Video"
                >
                  <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current ml-1" />
                </button>

                <span className="text-[11px] text-slate-300 block pt-1 font-medium">
                  Tap to watch Kerala Sevens electric action video
                </span>
              </div>
            </div>
          ) : (
            /* Active YouTube Video Player */
            <iframe
              className="w-full h-full border-0"
              src="https://www.youtube-nocookie.com/embed/i-MLmjgL5nY?autoplay=1&rel=0&modestbranding=1"
              title="Kerala Sevens Football Highlights"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      ) : (
        /* Official High-Resolution Tournament Poster View */
        <div className="relative bg-slate-950 p-4 flex flex-col items-center justify-center">
          <div className="relative max-w-sm sm:max-w-md w-full rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
            <img
              src={tournamentOfficialPoster}
              alt="All India Sevens Season 7 Official Poster"
              className="w-full h-auto object-contain"
            />
          </div>
          <p className="text-xs text-slate-400 mt-3 font-medium text-center">
            Official All India Sevens Tournament Season 7 Poster • UDAYA Parambil Peedika & KASC Peruvallur
          </p>
        </div>
      )}

      {/* Media Controls & WhatsApp Share Footer */}
      <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Globe2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">
            Join the stadium gallery on <strong>06 November 2026</strong> at Peruvallur Stadium
          </span>
        </div>

        {/* Media Desk Contact & WhatsApp Share */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <a
            href="tel:9961878508"
            className="flex-1 sm:flex-initial px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-1.5"
            title="Call Media Desk"
          >
            <Phone className="w-3.5 h-3.5 text-blue-600" />
            <span>Media Desk</span>
          </a>

          <button
            onClick={handleShareStream}
            className="flex-1 sm:flex-initial px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Media</span>
          </button>
        </div>
      </div>
    </div>
  );
}
