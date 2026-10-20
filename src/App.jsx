import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import StadiumAnnouncementBanner from './components/StadiumAnnouncementBanner';
import LiveMatchCard from './components/LiveMatchCard';
import LiveStreamHub from './components/LiveStreamHub';
import MatchPredictionCard from './components/MatchPredictionCard';
import PlayerOfTheMatchVote from './components/PlayerOfTheMatchVote';
import FanHypeMeter from './components/FanHypeMeter';
import HeadToHeadCard from './components/HeadToHeadCard';
import FixturesSection from './components/FixturesSection';
import TeamsSection from './components/TeamsSection';
import TopScorers from './components/TopScorers';
import VenueSection from './components/VenueSection';
import SponsorsSection from './components/SponsorsSection';
import SponsorAdsSidebar from './components/SponsorAdsSidebar';
import ScorerDemoModal from './components/ScorerDemoModal';
import TicketCounterModal from './components/TicketCounterModal';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';

export default function App() {
  const [lang, setLang] = useState('ml'); // Default Malayalam
  const [isDarkMode, setIsDarkMode] = useState(false); // Default Clean White Theme
  const [activeTab, setActiveTab] = useState('live'); // 'live' | 'fixtures' | 'teams' | 'stats' | 'venue'
  const [isScorerDemoOpen, setIsScorerDemoOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  // Sync with URL hash if provided
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (['live', 'fixtures', 'teams', 'stats', 'venue'].includes(hash)) {
      setActiveTab(hash);
    }

    const handleHashChange = () => {
      const newHash = window.location.hash.replace('#', '');
      if (['live', 'fixtures', 'teams', 'stats', 'venue'].includes(newHash)) {
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
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Sticky Header with Desktop Tabs & Mobile Branding */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        lang={lang}
        setLang={setLang}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onOpenScorerDemo={() => setIsScorerDemoOpen(true)}
        onOpenTicketModal={() => setIsTicketModalOpen(true)}
      />

      {/* Main Content Rendered by Page/Tab */}
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

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left 8 cols: Match Center & Interactive Fan Features */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Real-time Match Center Scoreboard */}
                  <LiveMatchCard 
                    lang={lang} 
                    isDarkMode={isDarkMode} 
                  />

                  {/* Official Matchday Live Stream Broadcast Hub */}
                  <LiveStreamHub
                    lang={lang}
                    isDarkMode={isDarkMode}
                  />

                  {/* FotMob & Sofascore Style: Predict & Win Contest */}
                  <MatchPredictionCard
                    lang={lang}
                    isDarkMode={isDarkMode}
                  />

                  {/* Premier League Style: Fan Player of the Match Voting */}
                  <PlayerOfTheMatchVote
                    lang={lang}
                    isDarkMode={isDarkMode}
                  />

                  {/* Malappuram Sevens Gallery Hype Meter & Stadium Soundboard */}
                  <FanHypeMeter
                    lang={lang}
                    isDarkMode={isDarkMode}
                  />

                  {/* Head-to-Head & Form Guide */}
                  <HeadToHeadCard
                    lang={lang}
                    isDarkMode={isDarkMode}
                  />
                </div>

                {/* Right 4 cols: Side Sponsor Ads */}
                <div className="lg:col-span-4 lg:sticky lg:top-20">
                  <SponsorAdsSidebar 
                    lang={lang} 
                    isDarkMode={isDarkMode} 
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Page 2: FIXTURES & SCHEDULE */}
        {activeTab === 'fixtures' && (
          <div className="animate-fadeIn pt-4">
            <FixturesSection 
              lang={lang} 
              isDarkMode={isDarkMode} 
            />
          </div>
        )}

        {/* Page 3: TEAMS & CLUBS */}
        {activeTab === 'teams' && (
          <div className="animate-fadeIn pt-4">
            <TeamsSection 
              lang={lang} 
              isDarkMode={isDarkMode} 
            />
          </div>
        )}

        {/* Page 4: STATS & GOLDEN BOOT */}
        {activeTab === 'stats' && (
          <div className="animate-fadeIn pt-4">
            <TopScorers 
              lang={lang} 
              isDarkMode={isDarkMode} 
            />
          </div>
        )}

        {/* Page 5: VENUE & SPONSORS */}
        {activeTab === 'venue' && (
          <div className="animate-fadeIn pt-4 space-y-4">
            <VenueSection 
              lang={lang} 
              isDarkMode={isDarkMode} 
            />
            <SponsorsSection 
              lang={lang} 
              isDarkMode={isDarkMode} 
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer 
        lang={lang} 
        isDarkMode={isDarkMode} 
      />

      {/* Mobile App Bottom Navigation Bar */}
      <BottomNav 
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        isDarkMode={isDarkMode} 
        lang={lang}
      />

      {/* Scorer Demonstration Modal for Committee */}
      <ScorerDemoModal
        isOpen={isScorerDemoOpen}
        isDarkMode={isDarkMode}
        onClose={() => setIsScorerDemoOpen(false)}
      />

      {/* Smart Ticket Counter POS & GPay QR Modal */}
      <TicketCounterModal
        isOpen={isTicketModalOpen}
        isDarkMode={isDarkMode}
        lang={lang}
        onClose={() => setIsTicketModalOpen(false)}
      />
    </div>
  );
}
