import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import StadiumAnnouncementBanner from './components/StadiumAnnouncementBanner';
import LiveMatchCard from './components/LiveMatchCard';
import MatchPredictionCard from './components/MatchPredictionCard';
import PlayerOfTheMatchVote from './components/PlayerOfTheMatchVote';
import HeadToHeadCard from './components/HeadToHeadCard';
import FixturesSection from './components/FixturesSection';
import TeamsSection from './components/TeamsSection';
import TopScorers from './components/TopScorers';
import VenueSection from './components/VenueSection';
import SponsorsSection from './components/SponsorsSection';
import SponsorAdsSidebar from './components/SponsorAdsSidebar';
import PromoEventsSection from './components/PromoEventsSection';
import ClubFanVoteSection from './components/ClubFanVoteSection';
import ClubFanVoteCard from './components/ClubFanVoteCard';
import TournamentFeatureHub from './components/TournamentFeatureHub';
import StartingSevenPitch from './components/StartingSevenPitch';
import VipMatchPassModal from './components/VipMatchPassModal';
import AdminScoreModal from './components/AdminScoreModal';
import AdminDeskSection from './components/AdminDeskSection';
import ScorerDemoModal from './components/ScorerDemoModal';
import TicketCounterModal from './components/TicketCounterModal';
import StickyScoreWidget from './components/StickyScoreWidget';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';

// Lazy-load heavy interactive mini-game to optimize 4G mobile page load speeds
const SevensPenaltyGame = React.lazy(() => import('./components/SevensPenaltyGame'));

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
    const validTabs = ['live', 'vote', 'fixtures', 'teams', 'stats', 'promo', 'venue', 'admin'];
    const hash = window.location.hash.replace('#', '');
    const path = window.location.pathname.replace(/^\//, '');

    if (validTabs.includes(hash)) {
      setActiveTab(hash);
    } else if (validTabs.includes(path)) {
      setActiveTab(path);
    }

    const handleHashChange = () => {
      const newHash = window.location.hash.replace('#', '');
      if (newHash === 'game') {
        setActiveTab('live');
        setMatchSubTab('game');
        setTimeout(() => {
          const el = document.getElementById('penalty-game');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
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
    setActiveTab(tab);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 overflow-x-hidden w-full max-w-full ${
      isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Offline Connectivity Notification Banner */}
      {!isOnline && (
        <div className="sticky top-0 z-50 bg-amber-500 text-slate-950 px-4 py-2 text-xs font-bold text-center flex items-center justify-center gap-2 shadow-md">
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
      />

      {/* Main Content Rendered by Page/Tab Wrapped in Error Boundary */}
      <GlobalErrorBoundary>
        <main className="flex-1 pb-20 sm:pb-8">
          {/* Page 1: LIVE MATCH CENTER (Home) */}
          {activeTab === 'live' && (
            <div className="animate-fadeIn">
              <Hero 
                lang={lang} 
                isDarkMode={isDarkMode} 
                scrollToSection={(id) => handleTabChange(id === 'fixtures' ? 'fixtures' : 'live')} 
                onOpenTicketModal={() => setIsTicketModalOpen(true)}
              />
              
              <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-6">
                {/* Official Malayalam Stadium Announcement Player */}
                <StadiumAnnouncementBanner 
                  lang={lang} 
                  isDarkMode={isDarkMode} 
                />

                {/* Main Event Live Match Card with Real-time Clock, Crowd Goals, & Instant Share */}
                <LiveMatchCard
                  lang={lang}
                  isDarkMode={isDarkMode}
                  onOpenAdminModal={() => setIsAdminModalOpen(true)}
                  onOpenPassModal={() => setIsVipPassModalOpen(true)}
                  onOpenDemoModal={() => setIsScorerDemoOpen(true)}
                  onOpenTicketModal={() => setIsTicketModalOpen(true)}
                  onNavigateTab={handleTabChange}
                />

                {/* 2-Column Responsive Layout: Left 8 cols Main Content, Right 4 cols Sponsor Ads */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left 8 cols: Matchday Hub with Sub-tabs to reduce scroll & clutter */}
                  <div className="lg:col-span-8 space-y-6">
                    {/* Matchday Sub-Tabs Controller (Lineup | Predict | Penalty Game | H2H) */}
                    <div id="match-subtabs" className="flex items-center justify-between p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar scroll-smooth">
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => setMatchSubTab('lineup')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                            matchSubTab === 'lineup' 
                              ? 'bg-blue-700 text-white shadow-xs font-black' 
                              : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
                          }`}
                        >
                          <span>⚽</span>
                          <span>{lang === 'ml' ? 'സ്റ്റാർട്ടിംഗ് 7 ലൈനപ്പ്' : 'Starting 7 Lineup'}</span>
                        </button>

                        <button
                          onClick={() => setMatchSubTab('predict')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                            matchSubTab === 'predict' 
                              ? 'bg-amber-500 text-slate-950 shadow-xs font-black' 
                              : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
                          }`}
                        >
                          <span>🎯</span>
                          <span>{lang === 'ml' ? 'പ്രവചന മത്സരങ്ങൾ' : 'Predict & Win'}</span>
                          <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[9px] font-black uppercase">
                            Live
                          </span>
                        </button>

                        <button
                          onClick={() => setMatchSubTab('game')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                            matchSubTab === 'game' 
                              ? 'bg-emerald-600 text-white shadow-xs font-black' 
                              : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
                          }`}
                        >
                          <span>🎮</span>
                          <span>{lang === 'ml' ? 'പെനാൽറ്റി കളി' : 'Mini Game'}</span>
                        </button>

                        <button
                          onClick={() => setMatchSubTab('h2h')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                            matchSubTab === 'h2h' 
                              ? 'bg-indigo-600 text-white shadow-xs font-black' 
                              : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
                          }`}
                        >
                          <span>📊</span>
                          <span>{lang === 'ml' ? 'H2H & ഫോം' : 'H2H'}</span>
                        </button>
                      </div>

                      {/* Toggle All Continuous View */}
                      <button
                        onClick={() => setMatchSubTab(matchSubTab === 'all' ? 'lineup' : 'all')}
                        className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition shrink-0 ml-1 ${
                          matchSubTab === 'all'
                            ? 'bg-slate-950 text-white font-black'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                        title="Toggle full continuous view of all components"
                      >
                        {matchSubTab === 'all' ? (lang === 'ml' ? 'ചുരുക്കുക' : 'Tabs View') : (lang === 'ml' ? 'എല്ലാം കാണുക' : 'View All')}
                      </button>
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
                    {(matchSubTab === 'predict' || matchSubTab === 'all') && (
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

                {/* Tournament Feature Hub: Quick Access to Voting, Pass, Tickets */}
                <TournamentFeatureHub
                  lang={lang}
                  isDarkMode={isDarkMode}
                  onOpenVote={() => handleTabChange('vote')}
                  onOpenPassModal={() => setIsVipPassModalOpen(true)}
                  onOpenTicketModal={() => setIsTicketModalOpen(true)}
                  onOpenDemo={() => setIsScorerDemoOpen(true)}
                />

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
              <ClubFanVoteSection 
                lang={lang} 
                isDarkMode={isDarkMode} 
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
            <div className="animate-fadeIn py-6 max-w-6xl mx-auto px-3 sm:px-6">
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

          {/* Page 8: OFFICIAL MATCH SCORER & ADMIN DESK */}
          {activeTab === 'admin' && (
            <div className="animate-fadeIn pt-4 max-w-5xl mx-auto px-3 sm:px-6">
              <AdminDeskSection 
                lang={lang} 
                isDarkMode={isDarkMode} 
                onBackToLive={() => handleTabChange('live')}
              />
            </div>
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

      {/* Official Match Scorer & Admin Desk Modal */}
      <AdminScoreModal
        isOpen={isAdminModalOpen}
        isDarkMode={isDarkMode}
        lang={lang}
        onClose={() => setIsAdminModalOpen(false)}
      />

      {/* Scorer Demonstration Modal for Committee */}
      <ScorerDemoModal
        isOpen={isScorerDemoOpen}
        isDarkMode={isDarkMode}
        onClose={() => setIsScorerDemoOpen(false)}
      />

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
    </div>
  );
}
