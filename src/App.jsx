import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import StadiumAnnouncementBanner from './components/StadiumAnnouncementBanner';
import LiveMatchCard from './components/LiveMatchCard';
import SevensPenaltyGame from './components/SevensPenaltyGame';
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

export default function App() {
  const [lang, setLang] = useState('ml'); // Default Malayalam
  const [isDarkMode, setIsDarkMode] = useState(false); // Default Clean White Theme
  const [activeTab, setActiveTab] = useState('live'); // 'live' | 'fixtures' | 'teams' | 'stats' | 'promo' | 'venue'
  const [isScorerDemoOpen, setIsScorerDemoOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isVipPassModalOpen, setIsVipPassModalOpen] = useState(false);

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
        setTimeout(() => {
          const el = document.getElementById('game');
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
      {/* Sticky Header with Desktop Tabs & Mobile Branding */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        lang={lang}
        setLang={setLang}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onOpenScorerDemo={() => handleTabChange('admin')}
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

              {/* Tournament Features Command Hub (Instant proof of 10+ professional features) */}
              <TournamentFeatureHub
                lang={lang}
                setActiveTab={handleTabChange}
                onOpenTicketModal={() => setIsTicketModalOpen(true)}
                onOpenPassGenerator={() => setIsVipPassModalOpen(true)}
                onOpenPitchLineup={() => {
                  const el = document.getElementById('pitch-lineup');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left 8 cols: Match Center & Interactive Fan Features */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Real-time Match Center Scoreboard with Admin Governance */}
                  <LiveMatchCard 
                    lang={lang} 
                    isDarkMode={isDarkMode} 
                    onOpenAdminPanel={() => setIsAdminModalOpen(true)}
                  />

                  {/* Starting 7 Tactical Turf Pitch Lineup (Premier League Style) */}
                  <StartingSevenPitch
                    lang={lang}
                    isDarkMode={isDarkMode}
                  />

                  {/* Kerala Sevens Penalty Shootout Mini-Game */}
                  <SevensPenaltyGame
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

                  {/* Compact Club Fan Vote Teaser Card (Opens full 24-team voting page without cluttering home scroll) */}
                  <ClubFanVoteCard
                    lang={lang}
                    isDarkMode={isDarkMode}
                    onOpenVotingPage={() => handleTabChange('vote')}
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

              {/* Tournament Promotions & 8 KM Mini Marathon Highlights */}
              <div className="pt-2">
                <PromoEventsSection
                  lang={lang}
                  isDarkMode={isDarkMode}
                />
              </div>
            </div>
          </div>
        )}

        {/* Dedicated Page: 24 SFA CLUBS FAN VOTE BATTLE */}
        {activeTab === 'vote' && (
          <div className="animate-fadeIn pt-4 max-w-6xl mx-auto px-3 sm:px-6">
            <ClubFanVoteSection 
              lang={lang} 
              isDarkMode={isDarkMode} 
              onBack={() => handleTabChange('live')}
            />
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
          <div className="animate-fadeIn pt-4 space-y-6 max-w-6xl mx-auto px-3 sm:px-6">
            {/* Club Popularity Fan Poll at top of Clubs page */}
            <ClubFanVoteSection 
              lang={lang} 
              isDarkMode={isDarkMode} 
            />
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

        {/* Page 5: PROMOTIONS & MINI MARATHON (Full Page) */}
        {activeTab === 'promo' && (
          <div className="animate-fadeIn pt-4 max-w-6xl mx-auto px-3 sm:px-6">
            <PromoEventsSection 
              lang={lang} 
              isDarkMode={isDarkMode} 
            />
          </div>
        )}

        {/* Page 6: VENUE & SPONSORS */}
        {activeTab === 'venue' && (
          <div className="animate-fadeIn pt-4 space-y-6 max-w-6xl mx-auto px-3 sm:px-6">
            <VenueSection 
              lang={lang} 
              isDarkMode={isDarkMode} 
            />
            <PromoEventsSection 
              lang={lang} 
              isDarkMode={isDarkMode} 
            />
            <SponsorsSection 
              lang={lang} 
              isDarkMode={isDarkMode} 
            />
          </div>
        )}

        {/* Page 7: OFFICIAL REFEREE & SCORER ADMIN DESK (Dedicated Full Page) */}
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

      {/* Floating / Sticky Live Score Widget (FotMob & Flashscore Style) */}
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
