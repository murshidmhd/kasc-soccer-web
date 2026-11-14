import React, { useState, useEffect } from 'react';
import { Calendar, Trophy } from 'lucide-react';
import ModernAppHome from './components/ModernAppHome';
import Header from './components/Header';
import MatchdayHero from './components/MatchdayHero';
import MatchdayStrip from './components/MatchdayStrip';
import Hero from './components/Hero';
import LiveViewingSection from './components/LiveViewingSection';
import MatchPredictionCard from './components/MatchPredictionCard';
import PlayerOfTheMatchVote from './components/PlayerOfTheMatchVote';
import HeadToHeadCard from './components/HeadToHeadCard';
import FixturesSection from './components/FixturesSection';
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
import NewUserGuidedTour from './components/NewUserGuidedTour';
import InstallAppBanner from './components/InstallAppBanner';
import { fixtures } from './data/tournamentData';
import { getStoredMatchState, applyRemoteMatchState } from './utils/matchStateManager';
import { applyRemoteLineupTactics } from './utils/lineupManager';
import { applyRemoteFixtures } from './utils/fixtureManager';
import { subscribeToMatchState, subscribeToLineup, subscribeToFixtures } from './utils/firebaseSync';
import { SHOW_LOCAL_ONLY_FEATURES, WHATSAPP_CHANNEL_URL, SHOW_BRACKET } from './config/siteConfig';

// Lazy-load heavy interactive mini-game to optimize 4G mobile page load speeds
const SevensPenaltyGame = React.lazy(() => import('./components/SevensPenaltyGame'));
// Lazy-load Squad Spotlight video showcase (Rule 12: does not delay live score or fixtures)
const SquadSpotlightSection = React.lazy(() => import('./components/SquadSpotlightSection'));
// Lazy-load Dev-only Admin Desk component
const AdminDeskSection = React.lazy(() => import('./components/AdminDeskSection'));
const AdminScoreModal = React.lazy(() => import('./components/AdminScoreModal'));

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
  const [isDarkMode, setIsDarkMode] = useState(true); // Default premium dark theme
  const [activeTab, setActiveTab] = useState('live'); // 'live' | 'fixtures' | 'teams' | 'stats' | 'promo' | 'venue'
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isVipPassModalOpen, setIsVipPassModalOpen] = useState(false);
  const [isTourOpenManually, setIsTourOpenManually] = useState(false);
  const [matchSubTab, setMatchSubTab] = useState('lineup'); // 'lineup' | 'predict' | 'game' | 'h2h' | 'all'
  const [isOnline, setIsOnline] = useState(() => (typeof navigator !== 'undefined' ? navigator.onLine : true));
  const [matchState, setMatchState] = useState(getStoredMatchState);

  // Sync matchState with global updates
  useEffect(() => {
    const handleUpdate = (e) => {
      setMatchState(e.detail || getStoredMatchState());
    };
    window.addEventListener('kasc_match_state_updated', handleUpdate);
    return () => window.removeEventListener('kasc_match_state_updated', handleUpdate);
  }, []);

  // Real-time Cloud Subscriptions (Push updates from Admin to all fans globally)
  useEffect(() => {
    const unsubMatch = subscribeToMatchState((remoteState) => {
      applyRemoteMatchState(remoteState);
    });
    const unsubLineup = subscribeToLineup((remoteLineup) => {
      applyRemoteLineupTactics(remoteLineup);
    });
    const unsubFixtures = subscribeToFixtures((remoteFixtures) => {
      applyRemoteFixtures(remoteFixtures);
    });
    return () => {
      if (typeof unsubMatch === 'function') unsubMatch();
      if (typeof unsubLineup === 'function') unsubLineup();
      if (typeof unsubFixtures === 'function') unsubFixtures();
    };
  }, []);

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
      'admin', 'desk-s7'
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
    if (tab === 'tour') {
      setIsTourOpenManually(true);
      return;
    }
    if (tab === 'tickets') {
      setIsTicketModalOpen(true);
      return;
    }
    if (tab === 'pass') {
      setIsVipPassModalOpen(true);
      return;
    }
    if (tab === 'predict' || tab === 'vote') {
      setActiveTab('predict');
      window.location.hash = 'predict';
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <div className={`min-h-screen font-sans transition-colors duration-200 overflow-x-hidden w-full ${
      isDarkMode 
        ? 'bg-[#0b0816] sm:bg-gradient-to-b sm:from-[#18112e] sm:via-[#0e091c] sm:to-[#07050e] text-white' 
        : 'bg-[#f4f0fc] sm:bg-gradient-to-b sm:from-[#ede5fd] sm:via-[#e6dcfa] sm:to-[#ddd2f8] text-slate-900'
    }`}>
      {/* Central Modern Mobile App Canvas */}
      <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl mx-auto min-h-screen flex flex-col bg-slate-900/95 dark:bg-slate-950 sm:shadow-[0_0_50px_rgba(147,51,234,0.15)] sm:border-x sm:border-purple-500/20 relative">
        {/* Offline Connectivity Notification Banner */}
      {!isOnline && (
        <div className="sticky top-0 z-50 bg-gold text-navy-900 px-4 py-2 text-xs font-bold text-center flex items-center justify-center gap-2 shadow-xs">
          <span>📡</span>
          <span>നിങ്ങൾ ഇപ്പോൾ Offline ആണ് • പേജ് ലഭ്യമാണ്. കണക്ഷൻ തിരിച്ചുവരുമ്പോൾ Live Score തത്സമയം അപ്‌ഡേറ്റ് ആകും.</span>
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
        onOpenTour={() => setIsTourOpenManually(true)}
      />

      {/* Main Content Rendered by Page/Tab Wrapped in Error Boundary */}
      <GlobalErrorBoundary>
        <main className="flex-1 pb-36 sm:pb-12">
          {/* Page 1: LIVE MATCH CENTER (Modern App Home) */}
          {activeTab === 'live' && (
            <ModernAppHome
              lang={lang}
              isDarkMode={isDarkMode}
              onNavigate={handleTabChange}
            />
          )}

          {/* Page 2: FAN ZONE & PREDICTIONS */}
          {(activeTab === 'predict' || activeTab === 'vote') && (
            <div className="animate-fadeIn py-4 max-w-md mx-auto px-4 pb-28 space-y-6">
              <MatchPredictionCard
                lang={lang}
                isDarkMode={isDarkMode}
              />
              <ClubFanVoteSection 
                lang={lang} 
                isDarkMode={isDarkMode} 
                onBack={() => handleTabChange('live')}
              />
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
                  ← {lang === 'ml' ? 'Live Match Center-ലേക്ക് മടങ്ങുക' : 'Back to Live Center'}
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

          {/* Page 8: OFFICIAL MATCH SCORER & ADMIN DESK (Private Route: #desk-s7 / #admin) */}
          {(activeTab === 'admin' || activeTab === 'desk-s7') && (
            <div className="animate-fadeIn pt-4 max-w-5xl mx-auto px-3 sm:px-6">
              <React.Suspense fallback={<div className="p-8 text-center text-xs text-navy-muted">Loading Scorer Desk...</div>}>
                <AdminDeskSection 
                  lang={lang} 
                  isDarkMode={isDarkMode} 
                  onBackToLive={() => handleTabChange('live')}
                />
              </React.Suspense>
            </div>
          )}
        </main>
      </GlobalErrorBoundary>
      </div>

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

      {/* Interactive New User Guided Tour Coachmark Card (Manual Trigger Only) */}
      {isTourOpenManually && (
        <NewUserGuidedTour
          lang={lang}
          activeTab={activeTab}
          onNavigate={handleTabChange}
          isOpenManually={isTourOpenManually}
          onCloseManual={() => setIsTourOpenManually(false)}
        />
      )}

      {/* PWA Mobile Install Banner (Liquid Glass) */}
      <InstallAppBanner lang={lang} />
    </div>
  );
}
