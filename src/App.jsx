import React, { useState, useEffect } from 'react';
import { Calendar, Trophy } from 'lucide-react';
import Header from './components/Header';
import Hero from './components/Hero';
import StadiumAnnouncementBanner from './components/StadiumAnnouncementBanner';
import LiveMatchCard from './components/LiveMatchCard';
import MatchPredictionCard from './components/MatchPredictionCard';
import PlayerOfTheMatchVote from './components/PlayerOfTheMatchVote';
import HeadToHeadCard from './components/HeadToHeadCard';
import FixturesSection from './components/FixturesSection';
import TournamentBracket from './components/TournamentBracket';
import TeamLogo from './components/TeamLogo';
import TeamsSection from './components/TeamsSection';
import HomeClubsStrip from './components/HomeClubsStrip';
import TopScorers from './components/TopScorers';
import VenueSection from './components/VenueSection';
import SponsorsSection from './components/SponsorsSection';
import SponsorAdsSidebar from './components/SponsorAdsSidebar';
import PromoEventsSection from './components/PromoEventsSection';
import ClubFanVoteSection from './components/ClubFanVoteSection';
import ClubFanVoteCard from './components/ClubFanVoteCard';
import QuickActionRow from './components/QuickActionRow';
import StartingSevenPitch from './components/StartingSevenPitch';
import VipMatchPassModal from './components/VipMatchPassModal';
import TicketCounterModal from './components/TicketCounterModal';
import StickyScoreWidget from './components/StickyScoreWidget';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';
import { fixtures } from './data/tournamentData';
import { SHOW_LOCAL_ONLY_FEATURES, WHATSAPP_CHANNEL_URL } from './config/siteConfig';

// Lazy-load heavy interactive mini-game to optimize 4G mobile page load speeds
const SevensPenaltyGame = React.lazy(() => import('./components/SevensPenaltyGame'));
// Lazy-load Squad Spotlight video showcase (Rule 12: does not delay live score or fixtures)
const SquadSpotlightSection = React.lazy(() => import('./components/SquadSpotlightSection'));
// Lazy-load Dev-only Admin and Scorer Desk components
const AdminDeskSection = React.lazy(() => import('./components/AdminDeskSection'));
const AdminScoreModal = React.lazy(() => import('./components/AdminScoreModal'));
const ScorerDemoModal = React.lazy(() => import('./components/ScorerDemoModal'));
// Lazy-load First-Visit Welcome Bottom Sheet (Rule 9: performance optimized)
const WelcomeBottomSheet = React.lazy(() => import('./components/WelcomeBottomSheet'));

// Global React Error Boundary to prevent blank page on connection failures
class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Boundary Caught Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex items-center justify-center p-6 text-center">
          <div className="max-w-md p-6 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-xl font-bold">
              ⚠️
            </div>
            <h3 className="text-lg font-black font-sports uppercase text-slate-900">
              പേജ് ലോഡ് ചെയ്യുന്നതിൽ തടസ്സം നേരിട്ടു
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              നെറ്റ്‌വർക്ക് തകരാർ കാരണമായിരിക്കാം. ദയവായി പേജ് റീഫ്രഷ് ചെയ്യുക.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs uppercase shadow-md active:scale-95 transition"
            >
              Refresh Page (റീഫ്രഷ്)
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [lang, setLang] = useState('ml'); // Default Malayalam
  const [isDarkMode, setIsDarkMode] = useState(false); // Default Clean White Theme
  const [activeTab, setActiveTab] = useState('live'); // 'live' | 'fixtures' | 'teams' | 'stats' | 'promo' | 'venue'
  const [isScorerDemoOpen, setIsScorerDemoOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isVipPassModalOpen, setIsVipPassModalOpen] = useState(false);
  const [matchSubTab, setMatchSubTab] = useState('lineup'); // 'lineup' | 'predict' | 'game' | 'h2h' | 'all'
  const [isOnline, setIsOnline] = useState(() => (typeof navigator !== 'undefined' ? navigator.onLine : true));

  // Network online/offline monitor
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync dark class on document element with isDarkMode state
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Sync with URL hash or path if provided
  useEffect(() => {
    const validTabs = [
      'live', 'fixtures', 'teams', 'stats', 'promo', 'venue', 'game', 'vote',
      ...(import.meta.env.DEV ? ['admin', 'desk-s7'] : [])
    ];
    const hash = window.location.hash.replace('#', '');
    const path = window.location.pathname.replace(/^\//, '');

    if (hash === 'tickets') {
      setIsTicketModalOpen(true);
      setActiveTab('live');
    } else if (hash === 'pass') {
      setIsVipPassModalOpen(true);
      setActiveTab('live');
    } else if (hash === 'game') {
      setActiveTab('game');
    } else if (hash === 'predict') {
      setActiveTab('live');
      setMatchSubTab('predict');
    } else if (validTabs.includes(hash)) {
      setActiveTab(hash);
    } else if (validTabs.includes(path)) {
      setActiveTab(path);
    } else if (hash === 'admin' || hash === 'desk-s7') {
      setActiveTab('live');
    }

    const handleHashChange = () => {
      const newHash = window.location.hash.replace('#', '');
      if (newHash === 'tickets') {
        setIsTicketModalOpen(true);
      } else if (newHash === 'pass') {
        setIsVipPassModalOpen(true);
      } else if (newHash === 'game') {
        setActiveTab('game');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (newHash === 'predict') {
        setActiveTab('live');
        setMatchSubTab('predict');
        setTimeout(() => {
          const el = document.getElementById('match-subtabs');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else if (validTabs.includes(newHash)) {
        setActiveTab(newHash);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabChange = (tab) => {
    if (tab === 'tickets') {
      setIsTicketModalOpen(true);
      return;
    }
    if (tab === 'pass') {
      setIsVipPassModalOpen(true);
      return;
    }
    if (tab === 'predict') {
      setActiveTab('live');
      setMatchSubTab('predict');
      window.location.hash = 'predict';
      setTimeout(() => {
        const el = document.getElementById('match-subtabs');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
      return;
    }
    if (tab === 'game') {
      setActiveTab('game');
      window.location.hash = 'game';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setActiveTab(tab);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 overflow-x-hidden w-full max-w-full ${
      isDarkMode ? 'surface-navy' : 'surface-light'
    }`}>
      {/* Offline Connectivity Notification Banner */}
      {!isOnline && (
        <div className="sticky top-0 z-50 bg-gold text-navy-900 px-4 py-2 text-xs font-bold text-center flex items-center justify-center gap-2 shadow-xs">
          <span>📡</span>
          <span>നിങ്ങൾ ഇപ്പോൾ ഓഫ്‌ലൈനിലാണ് (Offline Mode) • പേജ് ലഭ്യമാണ്. കണക്ഷൻ തിരിച്ചുവരുമ്പോൾ ലൈവ് സ്കോർ തത്സമയം അപ്‌ഡേറ്റ് ആകും.</span>
        </div>
      )}

      {/* Sticky Header with Desktop Tabs & Mobile Branding */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        lang={lang}
        setLang={setLang}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onOpenTicketModal={() => setIsTicketModalOpen(true)}
        onOpenPassModal={() => setIsVipPassModalOpen(true)}
      />

      {/* Main Content Rendered by Page/Tab Wrapped in Error Boundary */}
      <GlobalErrorBoundary>
        <main className="flex-1 pb-28 sm:pb-12">
          {/* Page 1: LIVE MATCH CENTER (Home) */}
          {activeTab === 'live' && (
            <div className="animate-fadeIn">
              <Hero 
                lang={lang} 
                isDarkMode={isDarkMode} 
                scrollToSection={handleTabChange}
                onNavigate={handleTabChange}
                onOpenTicketModal={() => setIsTicketModalOpen(true)}
              />
              
              <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-6">
                {/* Calm Live Scores Honesty Banner (Rule 4) */}
                {WHATSAPP_CHANNEL_URL && (
                  <a
                    href={WHATSAPP_CHANNEL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 sm:p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-950 dark:text-emerald-200 text-xs font-semibold hover:bg-emerald-500/15 transition shadow-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-base shrink-0">📢</span>
                        <span className="truncate">
                          {lang === 'ml' 
                            ? 'തത്സമയ സ്കോറുകൾ ഞങ്ങളുടെ വാട്ട്‌സ്ആപ്പ് ചാനൽ വഴി അപ്‌ഡേറ്റ് ചെയ്യപ്പെടുന്നു' 
                            : 'Live scores update on our WhatsApp channel'}
                        </span>
                      </div>
                      <span className="text-[11px] font-black underline shrink-0 text-emerald-700 dark:text-emerald-400">
                        {lang === 'ml' ? 'ചാനൽ കാണുക →' : 'Follow Channel →'}
                      </span>
                    </div>
                  </a>
                )}

                {/* 1. Next / Live Match Center */}
                <LiveMatchCard
                  lang={lang}
                  isDarkMode={isDarkMode}
                  onOpenAdminModal={() => setIsAdminModalOpen(true)}
                  onOpenPassModal={() => setIsVipPassModalOpen(true)}
                  onOpenDemoModal={() => setIsScorerDemoOpen(true)}
                  onOpenTicketModal={() => setIsTicketModalOpen(true)}
                  onNavigateTab={handleTabChange}
                />

                {/* 2. Quick Action Row (Change 3: 4 equal buttons replacing feature hub) */}
                <QuickActionRow
                  lang={lang}
                  isDarkMode={isDarkMode}
                  onNavigate={handleTabChange}
                />

                {/* 3. Today's & Upcoming Fixtures (Rule 1 & Rule 2: White cards, Gold next match accent) */}
                <section className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-surface-border dark:border-navy-700">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-navy-800 text-gold flex items-center justify-center font-bold shadow-xs">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-black font-sports uppercase tracking-wider text-card-title leading-[1.3]">
                          {lang === 'ml' ? 'ഇന്നത്തെ & വരാനിരിക്കുന്ന മത്സരങ്ങൾ' : "TODAY'S & UPCOMING FIXTURES"}
                        </h3>
                        <p className="text-xs text-card-muted font-medium leading-[1.5]">
                          {lang === 'ml' ? 'പെരുവള്ളൂർ പഞ്ചായത്ത് സ്റ്റേഡിയം • രാത്രി 8:00 PM IST' : 'Peruvallur Panjayath Stadium • 8:00 PM IST'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleTabChange('fixtures')}
                      className="self-start sm:self-auto min-h-touch px-3.5 py-2 rounded-xl bg-white dark:bg-navy-800 border border-surface-border dark:border-navy-700 text-royal dark:text-sky font-bold text-xs uppercase transition active:scale-95 flex items-center gap-1.5 shadow-xs"
                    >
                      <span>{lang === 'ml' ? 'മുഴുവൻ ഫിക്സ്ചറുകളും കാണുക' : 'View Full Schedule'}</span>
                      <span>→</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    {fixtures.slice(0, 3).map((match) => {
                      const isNextMatch = match.id === 'm1' && match.status === 'Upcoming';
                      const isMatchLive = match.status === 'LIVE';
                      const shortTag = match.id === 'm1' 
                        ? (lang === 'ml' ? 'ഉദ്ഘാടന മത്സരം' : 'Opening match')
                        : (lang === 'ml' ? 'റൗണ്ട് 1' : 'Round 1');

                      return (
                        <div
                          key={match.id}
                          className={`rounded-2xl p-4 transition-all shadow-card ${
                            isNextMatch
                              ? 'border-2 border-gold ring-1 ring-gold/40 bg-white dark:bg-navy-800'
                              : 'bg-white dark:bg-navy-800 border border-surface-border dark:border-navy-700'
                          }`}
                        >
                          {/* Header */}
                          <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-surface-border dark:border-navy-700 text-xs font-semibold">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              isNextMatch 
                                ? 'bg-gold text-navy-900' 
                                : 'bg-surface-light dark:bg-navy-700 text-card-title'
                            }`}>
                              {shortTag}
                            </span>
                            <span className="font-mono text-card-muted text-[11px]">
                              {match.dateFormatted || match.date}
                            </span>
                          </div>

                          {/* Teams */}
                          <div className="space-y-2.5">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <TeamLogo teamName={match.team1} size="sm" isDark={isDarkMode} />
                                <span className="text-xs font-bold text-card-title line-clamp-2 leading-[1.3]">
                                  {match.team1}
                                </span>
                              </div>
                              <span className="text-xs font-black font-mono text-card-title shrink-0">
                                {match.score1 !== null ? match.score1 : match.time}
                              </span>
                            </div>

                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <TeamLogo teamName={match.team2} size="sm" isDark={isDarkMode} />
                                <span className="text-xs font-bold text-card-title line-clamp-2 leading-[1.3]">
                                  {match.team2}
                                </span>
                              </div>
                              <span className="text-xs font-black font-mono text-card-title shrink-0">
                                {match.score2 !== null ? match.score2 : match.time}
                              </span>
                            </div>
                          </div>

                          {/* Footer Status */}
                          <div className="mt-3 pt-2 border-t border-surface-border dark:border-navy-700 flex items-center justify-between text-[11px]">
                            <span className={`inline-flex items-center gap-1 font-black uppercase ${
                              isMatchLive 
                                ? 'text-gold' 
                                : isNextMatch 
                                  ? 'text-gold' 
                                  : 'text-card-muted'
                            }`}>
                              {isMatchLive && <span className="w-1.5 h-1.5 rounded-full bg-gold animate-ping"></span>}
                              {isMatchLive ? 'LIVE' : (isNextMatch ? (lang === 'ml' ? 'അടുത്ത മത്സരം' : 'Next Match') : (lang === 'ml' ? 'വരാനിരിക്കുന്നു' : 'Upcoming'))}
                            </span>
                            <span className="text-card-muted font-mono">8:00 PM IST</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* 3. Table or Knockout Bracket (Change 1 Rule 4) */}
                <section className="space-y-3">
                  <TournamentBracket lang={lang} isDarkMode={isDarkMode} />
                </section>

                {/* 4. Clubs Strip (Home compact scroll-snap strip with View All 24) */}
                <HomeClubsStrip 
                  lang={lang} 
                  isDarkMode={isDarkMode} 
                  onNavigateToTeams={() => handleTabChange('teams')} 
                />

                {/* 5. Squad Spotlight Section (Rule 12 & 13: Lazy loaded after teams, does not delay live score) */}
                <React.Suspense fallback={
                  <div className="py-8 px-3 sm:px-6 max-w-6xl mx-auto space-y-4 animate-pulse">
                    <div className="h-6 w-48 skeleton-box"></div>
                    <div className="flex gap-3 overflow-hidden">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-[170px] aspect-[3/4] skeleton-box rounded-2xl shrink-0"></div>
                      ))}
                    </div>
                  </div>
                }>
                  <SquadSpotlightSection lang={lang} isDarkMode={isDarkMode} />
                </React.Suspense>

                {/* 6. Then Everything Else (Matchday Hub, Stadium Announcement, Features & Promos) */}
                {/* Official Malayalam Stadium Announcement Player */}
                <StadiumAnnouncementBanner 
                  lang={lang} 
                  isDarkMode={isDarkMode} 
                />

                {/* 2-Column Responsive Layout: Left 8 cols Main Content, Right 4 cols Sponsor Ads */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left 8 cols: Matchday Hub with Sub-tabs to reduce scroll & clutter */}
                  <div className="lg:col-span-8 space-y-6">
                    {/* Matchday Sub-Tabs Controller (Rule 1 & Rule 4: Touch-friendly 44px tabs, horizontal scroll) */}
                    <div id="match-subtabs" className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 horizontal-scroll-container">
                      <div className="flex items-center gap-1.5 shrink-0 py-0.5">
                        <button
                          onClick={() => setMatchSubTab('lineup')}
                          className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 active:scale-95 ${
                            matchSubTab === 'lineup' 
                              ? 'bg-blue-700 text-white shadow-card font-black' 
                              : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
                          }`}
                        >
                          <span>⚽</span>
                          <span>{lang === 'ml' ? 'സ്റ്റാർട്ടിംഗ് 7 ലൈനപ്പ്' : 'Starting 7 Lineup'}</span>
                        </button>

                        {SHOW_LOCAL_ONLY_FEATURES && (
                          <button
                            onClick={() => setMatchSubTab('predict')}
                            className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 active:scale-95 ${
                              matchSubTab === 'predict' 
                                ? 'bg-amber-500 text-slate-950 shadow-card font-black' 
                                : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
                            }`}
                          >
                            <span>🎯</span>
                            <span>{lang === 'ml' ? 'പ്രവചന മത്സരങ്ങൾ' : 'Predict & Win'}</span>
                            <span className="px-1.5 py-0.5 rounded-full bg-red-600 text-white text-[9px] font-black uppercase">
                              Live
                            </span>
                          </button>
                        )}

                        <button
                          onClick={() => setMatchSubTab('game')}
                          className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 active:scale-95 ${
                            matchSubTab === 'game' 
                              ? 'bg-emerald-600 text-white shadow-card font-black' 
                              : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
                          }`}
                        >
                          <span>🎮</span>
                          <span>{lang === 'ml' ? 'പെനാൽറ്റി കളി' : 'Mini Game'}</span>
                        </button>

                        <button
                          onClick={() => setMatchSubTab('h2h')}
                          className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 active:scale-95 ${
                            matchSubTab === 'h2h' 
                              ? 'bg-indigo-600 text-white shadow-card font-black' 
                              : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
                          }`}
                        >
                          <span>📊</span>
                          <span>{lang === 'ml' ? 'H2H & ഫോം' : 'H2H'}</span>
                        </button>

                        <button
                          onClick={() => setMatchSubTab(matchSubTab === 'all' ? 'lineup' : 'all')}
                          className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                            matchSubTab === 'all'
                              ? 'bg-slate-950 text-white font-black'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
                          }`}
                          title="Toggle full continuous view of all components"
                        >
                          {matchSubTab === 'all' ? (lang === 'ml' ? 'ചുരുക്കുക' : 'Tabs View') : (lang === 'ml' ? 'എല്ലാം' : 'View All')}
                        </button>
                      </div>
                    </div>

                    {/* Section 1: Starting 7 Tactical Turf Pitch */}
                    {(matchSubTab === 'lineup' || matchSubTab === 'all') && (
                      <div className="animate-fadeIn">
                        <StartingSevenPitch
                          lang={lang}
                          isDarkMode={isDarkMode}
                        />
                      </div>
                    )}

                    {/* Section 2: Fan Zone & Prediction Hub (Cleanly grouped so home page is not cluttered) */}
                    {(matchSubTab === 'predict' || matchSubTab === 'all') && SHOW_LOCAL_ONLY_FEATURES && (
                      <div className="space-y-6 animate-fadeIn">
                        {/* Predict & Win Contest */}
                        <MatchPredictionCard
                          lang={lang}
                          isDarkMode={isDarkMode}
                        />

                        {/* Fan Player of the Match Voting */}
                        <PlayerOfTheMatchVote
                          lang={lang}
                          isDarkMode={isDarkMode}
                        />

                        {/* 24 Club Fan Vote Teaser Card */}
                        <ClubFanVoteCard
                          lang={lang}
                          isDarkMode={isDarkMode}
                          onOpenVotingPage={() => handleTabChange('vote')}
                        />
                      </div>
                    )}

                    {/* Section 3: Interactive Penalty Shootout Mini-Game (Lazy-Loaded) */}
                    {(matchSubTab === 'game' || matchSubTab === 'all') && (
                      <div id="penalty-game" className="animate-fadeIn">
                        <React.Suspense fallback={
                          <div className="p-12 text-center rounded-3xl bg-white border border-slate-200">
                            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                            <p className="text-xs font-bold text-slate-500">ലോഡിംഗ് പെനാൽറ്റി ഗെയിം...</p>
                          </div>
                        }>
                          <SevensPenaltyGame
                            lang={lang}
                            isDarkMode={isDarkMode}
                          />
                        </React.Suspense>
                      </div>
                    )}

                    {/* Section 4: Head-to-Head & Historical Form */}
                    {(matchSubTab === 'h2h' || matchSubTab === 'all') && (
                      <div className="animate-fadeIn">
                        <HeadToHeadCard
                          lang={lang}
                          isDarkMode={isDarkMode}
                        />
                      </div>
                    )}
                  </div>

                  {/* Right 4 cols: Side Sponsor Ads */}
                  <div className="lg:col-span-4 lg:sticky lg:top-20">
                    <SponsorAdsSidebar 
                      lang={lang} 
                      isDarkMode={isDarkMode} 
                    />
                  </div>
                </div>

                {/* Marathon Section (Moved to the bottom of the page) */}
                <div id="marathon-section" className="pt-6 border-t border-slate-200 dark:border-slate-800">
                  <PromoEventsSection 
                    lang={lang} 
                    isDarkMode={isDarkMode} 
                  />
                </div>
              </div>
            </div>
          )}

          {/* Page 2: 24 CLUB FAN VOTE MARATHON */}
          {activeTab === 'vote' && (
            <div className="animate-fadeIn py-6 max-w-6xl mx-auto px-3 sm:px-6">
              {SHOW_LOCAL_ONLY_FEATURES ? (
                <ClubFanVoteSection 
                  lang={lang} 
                  isDarkMode={isDarkMode} 
                />
              ) : (
                <div className="py-16 text-center max-w-md mx-auto space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-navy-800 text-gold flex items-center justify-center mx-auto shadow-xs">
                    <Trophy className="w-6 h-6 text-gold" />
                  </div>
                  <h3 className="text-lg font-bold text-navy-900 dark:text-white">
                    {lang === 'ml' ? 'ഫാൻ വോട്ട് ഉടൻ ആരംഭിക്കും' : 'Official Fan Vote Coming Soon'}
                  </h3>
                  <p className="text-xs text-navy-muted">
                    {lang === 'ml' 
                      ? 'ഔദ്യോഗിക ഫാൻ വോട്ടിംഗ് ടൂർണ്ണമെന്റ് ആരംഭിക്കുന്നതോടെ ലൈവാകും.' 
                      : 'Official 24-club fan voting will go live with shared scoring.'}
                  </p>
                  <button
                    onClick={() => handleTabChange('live')}
                    className="px-4 py-2 rounded-xl btn-royal text-white text-xs font-bold"
                  >
                    {lang === 'ml' ? 'ലൈവ് പേജിലേക്ക് മടങ്ങുക' : 'Return to Live'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Page 3: FIXTURES */}
          {activeTab === 'fixtures' && (
            <div className="animate-fadeIn py-6 max-w-6xl mx-auto px-3 sm:px-6">
              <FixturesSection 
                lang={lang} 
                isDarkMode={isDarkMode} 
              />
            </div>
          )}

          {/* Page 4: 24 SFA PARTICIPATING CLUBS */}
          {activeTab === 'teams' && (
            <div className="animate-fadeIn py-6 max-w-6xl mx-auto px-3 sm:px-6 pb-28 sm:pb-12">
              <TeamsSection 
                lang={lang} 
                isDarkMode={isDarkMode} 
              />
            </div>
          )}

          {/* Page 5: TOP SCORERS & STATS */}
          {activeTab === 'stats' && (
            <div className="animate-fadeIn py-6 max-w-6xl mx-auto px-3 sm:px-6">
              <TopScorers 
                lang={lang} 
                isDarkMode={isDarkMode} 
              />
            </div>
          )}

          {/* Page 6: PROMO EVENTS & CELEBRATION */}
          {activeTab === 'promo' && (
            <div className="animate-fadeIn py-6 max-w-6xl mx-auto px-3 sm:px-6">
              <PromoEventsSection 
                lang={lang} 
                isDarkMode={isDarkMode} 
              />
            </div>
          )}

          {/* Page 7: VENUE & DIRECTIONS */}
          {activeTab === 'venue' && (
            <div className="animate-fadeIn py-6 max-w-6xl mx-auto px-3 sm:px-6">
              <VenueSection 
                lang={lang} 
                isDarkMode={isDarkMode} 
              />
            </div>
          )}

          {/* Page: INTERACTIVE PENALTY SHOOTOUT GAME */}
          {activeTab === 'game' && (
            <div className="animate-fadeIn py-6 max-w-4xl mx-auto px-3 sm:px-6 pb-28 sm:pb-12">
              <div className="mb-4 flex items-center justify-between">
                <button
                  onClick={() => handleTabChange('live')}
                  className="px-3.5 py-2 rounded-xl bg-navy-800 hover:bg-navy-750 border border-navy-700 text-gold text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-xs"
                >
                  ← {lang === 'ml' ? 'ലൈവ് മാച്ച് സെന്ററിലേക്ക് മടങ്ങുക' : 'Back to Live Center'}
                </button>
              </div>
              <React.Suspense fallback={
                <div className="p-12 text-center rounded-3xl bg-navy-900 border border-navy-700">
                  <div className="w-8 h-8 border-3 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-xs font-bold text-white">ലോഡിംഗ് പെനാൽറ്റി ഗെയിം...</p>
                </div>
              }>
                <SevensPenaltyGame
                  lang={lang}
                  isDarkMode={isDarkMode}
                />
              </React.Suspense>
            </div>
          )}

          {/* Page 8: OFFICIAL MATCH SCORER & ADMIN DESK (Private Route: #desk-s7) */}
          {(activeTab === 'admin' || activeTab === 'desk-s7') && (
            import.meta.env.DEV ? (
              <div className="animate-fadeIn pt-4 max-w-5xl mx-auto px-3 sm:px-6">
                <React.Suspense fallback={<div className="p-8 text-center text-xs text-navy-muted">Loading Scorer Desk...</div>}>
                  <AdminDeskSection 
                    lang={lang} 
                    isDarkMode={isDarkMode} 
                    onBackToLive={() => handleTabChange('live')}
                  />
                </React.Suspense>
              </div>
            ) : (
              <div className="animate-fadeIn py-16 text-center max-w-md mx-auto px-4 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-navy-800 text-gold flex items-center justify-center mx-auto shadow-xs">
                  <Trophy className="w-6 h-6 text-gold" />
                </div>
                <h3 className="text-lg font-bold text-navy-900 dark:text-white">
                  {lang === 'ml' ? 'സ്കോറർ ഡെസ്ക് ലഭ്യമല്ല' : 'Scorer Desk Disabled in Production'}
                </h3>
                <p className="text-xs text-navy-muted">
                  {lang === 'ml'
                    ? 'ലൈവ് സ്കോറുകൾ ഞങ്ങളുടെ വാട്ട്‌സ്ആപ്പ് ചാനൽ വഴി അപ്‌ഡേറ്റ് ചെയ്യപ്പെടുന്നു.'
                    : 'The live scorer desk is disabled in production builds until a shared server backend is connected.'}
                </p>
                {WHATSAPP_CHANNEL_URL && (
                  <a
                    href={WHATSAPP_CHANNEL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs"
                  >
                    <span>{lang === 'ml' ? 'വാട്ട്‌സ്ആപ്പ് ചാനൽ കാണുക' : 'Join WhatsApp Channel'}</span>
                  </a>
                )}
              </div>
            )
          )}
        </main>
      </GlobalErrorBoundary>

      {/* Footer */}
      <Footer 
        lang={lang} 
        isDarkMode={isDarkMode} 
        setActiveTab={handleTabChange}
      />

      {/* Mobile App Bottom Navigation Bar */}
      <BottomNav 
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        isDarkMode={isDarkMode} 
        lang={lang}
      />

      {/* Floating / Sticky Live Score Widget */}
      <StickyScoreWidget
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        isDarkMode={isDarkMode}
      />

      {/* Official Match Scorer & Admin Desk Modal (Dev Only) */}
      {import.meta.env.DEV && (
        <React.Suspense fallback={null}>
          <AdminScoreModal
            isOpen={isAdminModalOpen}
            isDarkMode={isDarkMode}
            lang={lang}
            onClose={() => setIsAdminModalOpen(false)}
          />
          <ScorerDemoModal
            isOpen={isScorerDemoOpen}
            isDarkMode={isDarkMode}
            onClose={() => setIsScorerDemoOpen(false)}
          />
        </React.Suspense>
      )}

      {/* Official Ticket Pricing & Coming Soon Modal */}
      <TicketCounterModal
        isOpen={isTicketModalOpen}
        isDarkMode={isDarkMode}
        lang={lang}
        onClose={() => setIsTicketModalOpen(false)}
      />

      {/* Personalized VIP Matchday Fan Pass Generator Modal */}
      <VipMatchPassModal
        isOpen={isVipPassModalOpen}
        onClose={() => setIsVipPassModalOpen(false)}
        lang={lang}
      />

      {/* First-Visit Welcome Bottom Sheet (Lazy-Loaded) */}
      <React.Suspense fallback={null}>
        <WelcomeBottomSheet
          lang={lang}
          setLang={setLang}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          isLiveMatch={false}
          isOtherModalOpen={isAdminModalOpen || isScorerDemoOpen || isTicketModalOpen || isVipPassModalOpen}
          onNavigate={handleTabChange}
        />
      </React.Suspense>
    </div>
  );
}
