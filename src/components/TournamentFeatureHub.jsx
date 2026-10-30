import React from 'react';
import { 
  Calendar, 
  Shield, 
  Trophy, 
  Ticket, 
  Gamepad2, 
  Flame, 
  Award, 
  MapPin, 
  Radio, 
  Users, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function TournamentFeatureHub({ 
  lang, 
  setActiveTab, 
  onOpenTicketModal,
  onOpenPassGenerator,
  onOpenPitchLineup
}) {
  const features = [
    {
      id: 'fixtures',
      title: lang === 'ml' ? '30-ദിന ഫിക്സ്ചറുകൾ' : '30-Day Match Fixtures',
      desc: lang === 'ml' ? '24 പോരാട്ടങ്ങളുടെ തീയതികളും സമയവും' : 'Full 24 matches schedule & kickoff times',
      icon: Calendar,
      badge: '24 Matches',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      action: () => { setActiveTab('fixtures'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    },
    {
      id: 'teams',
      title: lang === 'ml' ? '24 ഒഫീഷ്യൽ ക്ലബ്ബുകൾ' : '24 Official SFA Clubs',
      desc: lang === 'ml' ? 'മാനേജർമാരും രജിസ്റ്റർ ചെയ്ത ടീമുകളും' : 'Full rosters, managers & club headquarters',
      icon: Shield,
      badge: 'SFA Confirmed',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      action: () => { setActiveTab('teams'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    },
    {
      id: 'lineup',
      title: lang === 'ml' ? 'സ്റ്റാർട്ടിംഗ് 7 ടാക്റ്റിക്കൽ പിച്ച്' : 'Starting 7 Pitch Lineup',
      desc: lang === 'ml' ? 'പച്ചപ്പുള്ള പിച്ചിലെ കളിക്കാരുടെ പൊസിഷനുകൾ' : 'Interactive turf formation & jersey numbers',
      icon: Flame,
      badge: '★ Hot Tactical',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300 font-black',
      action: onOpenPitchLineup
    },
    {
      id: 'pass',
      title: lang === 'ml' ? 'വി.ഐ.പി മാച്ച് പാസ്സ് ജനറേറ്റർ' : 'VIP Digital Fan Pass',
      desc: lang === 'ml' ? 'നിങ്ങളുടെ പേരിലുള്ള ഒഫീഷ്യൽ ഡിജിറ്റൽ പാസ്സ്' : 'Personalized match ticket for WhatsApp Status',
      icon: Sparkles,
      badge: 'Free VIP Pass',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      action: onOpenPassGenerator
    },
    {
      id: 'vote',
      title: lang === 'ml' ? '24 ക്ലബ് ഫാൻ പോൾ ബാറ്റിൽ' : '24 Club Fan Battle',
      desc: lang === 'ml' ? 'ഏറ്റവും കൂടുതൽ ആരാധകരുള്ള ക്ലബ്ബിന് വോട്ട്' : 'Vote for your favorite team & live rankings',
      icon: Users,
      badge: 'Live Poll',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
      action: () => { setActiveTab('vote'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    },
    {
      id: 'stats',
      title: lang === 'ml' ? 'ഗോൾഡൻ ബൂട്ട് & നോക്കൗട്ട് ട്രീ' : 'Golden Boot & Bracket',
      desc: lang === 'ml' ? 'ടോപ്പ് സ്കോറർമാരും ഫൈനൽ പാതയും' : 'Top scorers leaderboard & road to the final',
      icon: Trophy,
      badge: 'Knockout Tree',
      badgeColor: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      action: () => { setActiveTab('stats'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    },
    {
      id: 'game',
      title: lang === 'ml' ? 'സെവൻസ് പെനാൽറ്റി ഷൂട്ടൗട്ട്' : 'Penalty Shootout Game',
      desc: lang === 'ml' ? 'കീപ്പറെ വെട്ടിച്ച് ഗോൾ നേടൂ' : 'Interactive mini-game with 3D goalkeeper',
      icon: Gamepad2,
      badge: 'Play Live',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      action: () => {
        const el = document.getElementById('penalty-game');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      id: 'promo',
      title: lang === 'ml' ? '8 KM മിനി മാരത്തോൺ ഗാലറി' : '8 KM Marathon Media',
      desc: lang === 'ml' ? 'പഞ്ചായത്ത് പ്രസിഡന്റ് ഫ്ലാഗ് ഓഫും വിജയികളും' : 'Official marathon flag-off & podium winners',
      icon: Award,
      badge: 'Photo Gallery',
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
      action: () => { setActiveTab('promo'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    },
    {
      id: 'tickets',
      title: lang === 'ml' ? 'ടിക്കറ്റ് കൗണ്ടർ & UPI QR' : 'Tickets & GPay Counter',
      desc: lang === 'ml' ? 'ഗ്യാലറി, വി.ഐ.പി, സീസൺ പാസ്സ് നിരക്കുകൾ' : 'Official seat pricing & direct booking',
      icon: Ticket,
      badge: 'Instant POS',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      action: onOpenTicketModal
    },
    {
      id: 'venue',
      title: lang === 'ml' ? 'സ്റ്റേഡിയം GPS & പാർക്കിംഗ്' : 'Stadium GPS & Parking',
      desc: lang === 'ml' ? 'പെരുവള്ളൂർ സ്റ്റേഡിയത്തിലേക്ക് നേരിട്ട് റൂട്ട്' : 'One-tap Google Maps route & gate details',
      icon: MapPin,
      badge: 'Directions',
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
      action: () => { setActiveTab('venue'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    }
  ];

  return (
    <section className="mt-8 mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-blue-600">
              Tournament OS Platform
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-sports uppercase tracking-wider text-slate-950 mt-0.5">
            {lang === 'ml' ? 'ടൂർണ്ണമെന്റ് ഫീച്ചർ ഹബ്ബ്' : 'TOURNAMENT COMMAND HUB'}
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            {lang === 'ml' 
              ? 'ലൈവ് സ്കോർ മാത്രമല്ല, സെവൻസ് ടൂർണ്ണമെന്റിന്റെ സമ്പൂർണ്ണ ഡിജിറ്റൽ സംവിധാനങ്ങൾ ഇവിടെ കാണാം' 
              : 'Explore the full digital suite: Live Lineups, 30-Day Fixtures, 24 SFA Clubs, VIP Pass & Games'}
          </p>
        </div>

        <div className="text-right hidden sm:block">
          <span className="text-xs font-bold text-slate-400">
            10+ Professional Features
          </span>
        </div>
      </div>

      {/* Grid of 10 Mind-Blowing Features */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
        {features.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={item.action}
              className="group relative bg-white hover:bg-gradient-to-br hover:from-white hover:to-blue-50/50 rounded-2xl p-3 sm:p-4 border border-slate-200 hover:border-blue-400 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer active:scale-97 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-1 mb-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-100 group-hover:bg-blue-600 group-hover:text-white text-slate-800 flex items-center justify-center transition-colors shadow-2xs">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" />
                  </div>
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-xs sm:text-sm font-black font-sports text-slate-950 group-hover:text-blue-700 transition leading-snug line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-[10px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-blue-600 group-hover:text-blue-700">
                <span>{lang === 'ml' ? 'തുറക്കുക' : 'Open'}</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
