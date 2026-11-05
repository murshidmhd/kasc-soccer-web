import React, { useEffect, useState } from 'react';
import { 
  X, 
  Shield, 
  UserCheck, 
  MapPin, 
  Calendar, 
  Star, 
  BookOpen, 
  Share2 
} from 'lucide-react';
import TeamLogo from './TeamLogo';
import { fixtures, openingMatch } from '../data/tournamentData';
import clubHistoryData from '../data/clubHistory.json';

// Single configuration switches requested by user
export const FIXTURES_CONFIRMED = false;
export const SHOW_SFA_CLAIMS = false;

export default function ClubBottomSheet({ 
  isOpen, 
  onClose, 
  club, 
  lang, 
  isDarkMode 
}) {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'history'

  // Handle Browser Back Button (popstate listener)
  useEffect(() => {
    if (!isOpen) return;

    window.history.pushState({ clubSheetOpen: true }, '');

    const handlePopState = () => {
      onClose();
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isOpen, onClose]);

  // Swipe Down to Close gesture
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchEnd - touchStart;
    if (distance > minSwipeDistance) {
      if (window.history.state?.clubSheetOpen) {
        window.history.back();
      } else {
        onClose();
      }
    }
  };

  if (!isOpen || !club) return null;

  // Determine Next Match:
  // Disagreement on Nov 7-13 between list & bracket views.
  // Until FIXTURES_CONFIRMED = true, show next match ONLY for Nov 6 clubs (KRSC & Base Perumbavur).
  const isNov6Team = 
    club.name.toLowerCase().includes('krsc') || 
    club.name.toLowerCase().includes('base');

  const nov6Match = {
    date: '06 Nov 2026',
    time: '08:00 PM',
    team1: openingMatch.teamHome.name,
    team2: openingMatch.teamAway.name
  };

  const nextMatch = fixtures.find(
    (m) => m.confirmed &&
           (m.team1.toLowerCase().includes(club.name.toLowerCase()) || 
            club.name.toLowerCase().includes(m.team1.toLowerCase()) ||
            m.team2.toLowerCase().includes(club.name.toLowerCase()) || 
            club.name.toLowerCase().includes(m.team2.toLowerCase())) &&
           m.status !== 'Completed'
  );

  const displayMatch = FIXTURES_CONFIRMED ? nextMatch : (isNov6Team ? nov6Match : null);

  const isPermanent = club.category?.includes('Permanent') || club.category?.includes('Host');

  // Verify History Data:
  // Rule 8: Show history content ONLY if status === 'verified'.
  // For any 'draft' or unverified club, show placeholder and nothing from draft data.
  const historyEntry = clubHistoryData.find(
    (entry) => 
      entry.clubId === club.slug || 
      entry.name?.toLowerCase() === club.name?.toLowerCase() ||
      club.name?.toLowerCase().includes(entry.name?.toLowerCase() || '') ||
      entry.name?.toLowerCase().includes(club.name?.toLowerCase() || '')
  );
  const isHistoryVerified = historyEntry && historyEntry.status === 'verified';

  const handleShare = () => {
    const text = encodeURIComponent(
      `⚽ *${club.name} (${club.nameMl})*\n` +
      `📍 ${club.city}\n` +
      `👤 Manager: ${club.manager}\n` +
      (club.asstManager ? `👤 Asst Manager: ${club.asstManager}\n` : '') +
      `🔥 Season 7 Club Profile\n` +
      `${window.location.origin}/#teams`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-end justify-center bg-[#071433]/85 animate-fadeIn"
      onClick={() => {
        if (window.history.state?.clubSheetOpen) {
          window.history.back();
        } else {
          onClose();
        }
      }}
    >
      {/* Bottom Sheet Container */}
      <div 
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="w-full max-w-lg rounded-t-3xl border-t border-x border-surface-border dark:border-navy-700 surface-card p-5 sm:p-6 max-h-[88vh] overflow-y-auto animate-slideUp relative shadow-2xl space-y-4"
        style={{ paddingBottom: 'max(2.5rem, env(safe-area-inset-bottom, 24px))' }}
      >
        {/* Top Swipe Drag Pill Handle */}
        <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-navy-700 mx-auto -mt-1 mb-2" />

        {/* Top Row: Close Button & Badges */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 flex-wrap">
            {isPermanent && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full btn-gold text-[10px] font-black uppercase font-sports shadow-xs">
                <Star className="w-3 h-3 fill-navy-900" />
                <span>
                  {SHOW_SFA_CLAIMS 
                    ? 'Permanent SFA' 
                    : (lang === 'ml' ? 'സ്ഥിരം ടീം' : 'Permanent Club')}
                </span>
              </span>
            )}
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-navy-800 text-royal dark:text-sky text-[10px] font-bold border border-blue-200 dark:border-navy-600">
              {SHOW_SFA_CLAIMS 
                ? 'Registered Club' 
                : (lang === 'ml' ? 'സീസൺ 7 ടീം' : 'Season 7 Club')}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleShare}
              className="w-11 h-11 rounded-full bg-surface-light dark:bg-navy-800 border border-surface-border dark:border-navy-700 text-card-title flex items-center justify-center transition active:scale-95"
              title="Share club details"
              aria-label="Share club details"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (window.history.state?.clubSheetOpen) {
                  window.history.back();
                } else {
                  onClose();
                }
              }}
              className="w-11 h-11 rounded-full bg-surface-light dark:bg-navy-800 border border-surface-border dark:border-navy-700 text-card-title flex items-center justify-center transition active:scale-95"
              title="Close details"
              aria-label="Close details"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Club Brand Header (Full district displayed inside bottom sheet per Rule 2) */}
        <div className="flex items-center gap-3.5 pt-1">
          <div className="w-16 h-16 rounded-full bg-white p-1 border border-surface-border dark:border-navy-700 shadow-sm flex items-center justify-center shrink-0">
            <TeamLogo teamName={club.name} className="w-full h-full rounded-full object-contain" />
          </div>
          <div className="min-w-0">
            <h3 className="text-lg sm:text-xl font-black font-sports text-card-title leading-snug">
              {club.name}
            </h3>
            <p className="text-xs font-semibold text-card-muted font-malayalam">
              {club.nameMl}
            </p>
            <p className="text-xs font-bold text-royal dark:text-sky flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>{club.city}</span>
            </p>
          </div>
        </div>

        {/* Tabs: Details vs History */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-light dark:bg-navy-900 border border-surface-border dark:border-navy-700">
          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 min-h-[44px] py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95 ${
              activeTab === 'details'
                ? 'btn-royal text-white font-black shadow-xs'
                : 'text-card-muted hover:text-card-title'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{lang === 'ml' ? 'വിവരങ്ങൾ' : 'Club Details'}</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 min-h-[44px] py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95 ${
              activeTab === 'history'
                ? 'btn-royal text-white font-black shadow-xs'
                : 'text-card-muted hover:text-card-title'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{lang === 'ml' ? 'ചരിത്രം' : 'Club History'}</span>
          </button>
        </div>

        {/* TAB 1: DETAILS */}
        {activeTab === 'details' && (
          <div className="space-y-3 animate-fadeIn">
            {/* Management Cards */}
            <div className="space-y-2">
              <div className="p-3 rounded-2xl border border-surface-border dark:border-navy-700 surface-card-subtle flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-card-muted block">
                    {lang === 'ml' ? 'ടീം മാനേജർ' : 'Team Manager'}
                  </span>
                  <span className="text-sm font-bold text-card-title font-sports">
                    {club.manager}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-navy-800 text-royal dark:text-sky flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
              </div>

              {club.asstManager && (
                <div className="p-3 rounded-2xl border border-surface-border dark:border-navy-700 surface-card-subtle flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-card-muted block">
                      {lang === 'ml' ? 'അസിസ്റ്റന്റ് മാനേജർ' : 'Assistant Manager'}
                    </span>
                    <span className="text-sm font-bold text-card-title font-sports">
                      {club.asstManager}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-navy-800 text-royal dark:text-sky flex items-center justify-center">
                    <UserCheck className="w-4 h-4" />
                  </div>
                </div>
              )}
            </div>

            {/* Next Match Card: Rule 1 */}
            {displayMatch ? (
              <div className="p-3.5 rounded-2xl border-2 border-gold surface-navy-card space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-gold font-sports uppercase">
                  <span>{lang === 'ml' ? 'അടുത്ത മത്സരം' : 'Upcoming Match'}</span>
                  <span>{displayMatch.date} • {displayMatch.time}</span>
                </div>
                <div className="flex items-center justify-between gap-2 text-xs font-bold text-white font-sports">
                  <span className="truncate">{displayMatch.team1}</span>
                  <span className="text-gold font-black">VS</span>
                  <span className="truncate">{displayMatch.team2}</span>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl border border-surface-border dark:border-navy-700 surface-card-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-card-muted">
                  <Calendar className="w-4 h-4 text-royal dark:text-sky shrink-0" />
                  <span className="font-bold">{lang === 'ml' ? 'അടുത്ത മത്സരം' : 'Next Match'}</span>
                </div>
                <span className="font-sports font-bold text-card-title text-left sm:text-right">
                  {lang === 'ml' ? 'മത്സരങ്ങൾ ദിവസേന പ്രഖ്യാപിക്കുന്നതാണ്. ഓരോ മത്സര ദിവസത്തിനും ശേഷം വീണ്ടും പരിശോധിക്കുക.' : 'Fixtures are announced daily. Check back after each match day.'}
                </span>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CLUB HISTORY (Rule 8: Show content ONLY if verified; for draft show placeholder and NOTHING from draft data) */}
        {activeTab === 'history' && (
          <div className="space-y-3 animate-fadeIn">
            {isHistoryVerified ? (
              <div className="space-y-3 p-4 rounded-2xl surface-card-subtle border border-surface-border dark:border-navy-700">
                <h4 className="text-sm font-black font-sports uppercase text-card-title">
                  {historyEntry.name}
                </h4>
                <p className="text-xs text-card-muted leading-relaxed">
                  {historyEntry.summary}
                </p>
                {historyEntry.honours && historyEntry.honours.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-card-muted block mb-1">
                      {lang === 'ml' ? 'കിരീട നേട്ടങ്ങൾ' : 'Major Honours'}
                    </span>
                    <ul className="text-xs text-card-title space-y-1">
                      {historyEntry.honours.map((h, i) => (
                        <li key={i}>🏆 {h}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3 p-5 rounded-2xl surface-card-subtle border border-surface-border dark:border-navy-700 text-center">
                <div className="w-12 h-12 rounded-full btn-gold mx-auto flex items-center justify-center shadow-xs">
                  <BookOpen className="w-6 h-6 text-navy-900" />
                </div>
                <h4 className="text-sm font-black font-sports uppercase text-card-title">
                  {lang === 'ml' ? 'ക്ലബ്ബ് ചരിത്രം സ്ഥിരീകരണത്തിലാണ്' : 'Club history is being confirmed'}
                </h4>
                <p className="text-xs text-card-muted leading-relaxed max-w-sm mx-auto">
                  {lang === 'ml'
                    ? 'ഈ ക്ലബ്ബിന്റെ ചരിത്രവും റെക്കോർഡുകളും സ്ഥിരീകരിച്ചു വരുന്നു. ഔദ്യോഗിക വിവരങ്ങൾ ഉടൻ ലഭ്യമാകും.'
                    : 'Club history and records are currently being confirmed with independent records and club representatives.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
