import React, { useState } from 'react';
import { Radio, Users, Phone, Share2, Play, Volume2, Maximize2, Sparkles, Globe2 } from 'lucide-react';
import { openingMatch, tournamentInfo } from '../data/tournamentData';

export default function LiveStreamHub({ lang, isDarkMode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [streamServer, setStreamServer] = useState('server1'); // 'server1' | 'server2'
  const [liveViewers, setLiveViewers] = useState(3840);

  const handleShareStream = () => {
    const text = encodeURIComponent(
      `🔴 *അഖിലേന്ത്യാ സെവൻസ് സീസൺ 7 - ലൈവ് സ്ട്രീമിംഗ്!* ⚽\n\n` +
      `⚔️ UDAYA Peruvallur vs SABAN FC Kottakkal\n` +
      `📅 06 Nov 2026 • 8:00 PM IST\n` +
      `📍 Peruvallur Panjayath Stadium\n` +
      `📺 ഗൾഫിലും നാട്ടിലുമുള്ളവർക്ക് തത്സമയം കാണാം: ${window.location.origin}/#live`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className={`rounded-2xl sm:rounded-3xl border overflow-hidden transition-colors shadow-xs ${
      isDarkMode 
        ? 'bg-slate-900 border-slate-800 text-white' 
        : 'bg-white border-slate-200 text-slate-900'
    }`}>
      {/* Stream Top Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black shadow-xs">
            <Radio className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black font-sports uppercase tracking-wider text-slate-950">
                {lang === 'ml' ? 'ലൈവ് മാച്ച് സ്ട്രീം ഹബ്ബ്' : 'OFFICIAL LIVE STREAM HUB'}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                HD Live
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {lang === 'ml'
                ? 'നാട്ടിലും ഗൾഫിലുമുള്ള പ്രവാസികൾക്കായി തത്സമയ സംപ്രേഷണം'
                : 'Live broadcast for Malappuram fans & Gulf Pravasi diaspora across GCC'}
            </p>
          </div>
        </div>

        {/* Live Viewers Counter */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 self-start sm:self-auto">
          <Globe2 className="w-4 h-4 text-emerald-600" />
          <span>{liveViewers.toLocaleString()} watching</span>
          <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">(UAE, KSA, Qatar)</span>
        </div>
      </div>

      {/* Main Video Screen Container */}
      <div className="relative aspect-video w-full bg-slate-950 overflow-hidden group">
        {!isPlaying ? (
          /* Pre-Play Matchday Thumbnail & Play Overlay */
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-900/90 text-white">
            {/* Background stadium floodlight ambiance */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-transparent to-transparent pointer-events-none"></div>

            <div className="relative z-10 space-y-3 max-w-md">
              <span className="px-3 py-1 rounded-full bg-red-600/90 text-white text-[10px] sm:text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5 shadow-md">
                <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                8:00 PM IST NIGHT BROADCAST
              </span>

              <h2 className="text-xl sm:text-3xl font-black font-sports tracking-wide uppercase">
                {openingMatch.teamHome.shortName} <span className="text-blue-400">vs</span> {openingMatch.teamAway.shortName}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                {tournamentInfo.venueMalayalam} • {openingMatch.stage}
              </p>

              {/* Big Play Button */}
              <button
                onClick={() => setIsPlaying(true)}
                className="mt-2 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center mx-auto shadow-xl hover:scale-110 active:scale-95 transition-all group-hover:ring-4 group-hover:ring-red-500/50"
                title="Launch Live Stream"
              >
                <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current ml-1" />
              </button>

              <span className="text-[11px] text-slate-400 block pt-1">
                Tap to connect to live stadium broadcast
              </span>
            </div>
          </div>
        ) : (
          /* Active Video Player Screen */
          <div className="absolute inset-0 w-full h-full bg-black flex flex-col justify-between p-3">
            {/* Top Overlay Badge */}
            <div className="flex items-center justify-between text-white text-xs z-10">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white font-black text-[10px] uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                  LIVE FEED
                </span>
                <span className="text-xs font-bold text-slate-200 font-sports">
                  PERUVALLUR STADIUM • CAM 1
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-md bg-white/20 text-[10px] font-bold">1080p 60fps</span>
              </div>
            </div>

            {/* Simulated Live Pitch Center Broadcast Frame */}
            <div className="flex-1 flex flex-col items-center justify-center text-center text-white/90 space-y-2">
              <div className="w-16 h-16 rounded-full border-2 border-red-500/80 border-t-transparent animate-spin mb-2" />
              <p className="text-sm font-bold font-sports tracking-wide">
                STREAMING PERUVALLUR STADIUM FLOODLIGHT FEED...
              </p>
              <p className="text-xs text-slate-400">
                Official Live Commentary Desk • SFA Season 7
              </p>
            </div>

            {/* Bottom Controls Bar */}
            <div className="flex items-center justify-between text-white text-xs z-10 pt-2 border-t border-white/10">
              <button
                onClick={() => setIsPlaying(false)}
                className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold text-[11px] transition"
              >
                Exit Player
              </button>

              <div className="flex items-center gap-2 text-slate-300 text-[11px]">
                <Volume2 className="w-4 h-4 text-white" />
                <span>Stereo Mic Audio</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stream Controls & WhatsApp Share Footer */}
      <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Stream Server Toggles */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-500 font-bold text-[11px] mr-1">Server:</span>
          <button
            onClick={() => setStreamServer('server1')}
            className={`px-3 py-1 rounded-xl font-bold text-xs transition active:scale-95 ${
              streamServer === 'server1'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            Server 1 (Kerala Edge)
          </button>
          <button
            onClick={() => setStreamServer('server2')}
            className={`px-3 py-1 rounded-xl font-bold text-xs transition active:scale-95 ${
              streamServer === 'server2'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            Server 2 (GCC Gulf Relay)
          </button>
        </div>

        {/* Media Desk Contact & WhatsApp Share */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <a
            href="tel:9961878508"
            className="flex-1 sm:flex-initial px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-1.5"
            title="Call Broadcast Hotline"
          >
            <Phone className="w-3.5 h-3.5 text-blue-600" />
            <span>Broadcast Hotline</span>
          </a>

          <button
            onClick={handleShareStream}
            className="flex-1 sm:flex-initial px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Stream</span>
          </button>
        </div>
      </div>
    </div>
  );
}
