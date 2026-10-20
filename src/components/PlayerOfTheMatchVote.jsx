import React, { useState } from 'react';
import { Award, Star, Share2, CheckCircle2, TrendingUp, Sparkles, UserCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { openingMatch } from '../data/tournamentData';

const CANDIDATES = [
  {
    id: 'ibrahim',
    name: 'Ibrahim Soumahoro',
    nameMl: 'ഇബ്രാഹിം സുമഹോറോ',
    number: '9',
    team: 'UDAYA Peruvallur',
    teamShort: 'UDAYA',
    position: 'Striker / ഫോർവേഡ്',
    origin: 'Ivory Coast 🇨🇮',
    votes: 840,
    accent: 'from-sky-600 to-blue-700',
    border: 'border-blue-500',
    tag: 'Marquee Striker'
  },
  {
    id: 'shameer',
    name: 'Shameer Kottakkal',
    nameMl: 'ഷമീർ കോട്ടക്കൽ',
    number: '10',
    team: 'SABAN FC Kottakkal',
    teamShort: 'SABAN',
    position: 'Playmaker / ക്യാപ്റ്റൻ',
    origin: 'Malappuram 🇮🇳',
    votes: 520,
    accent: 'from-amber-500 to-yellow-600',
    border: 'border-amber-500',
    tag: 'Homegrown Star'
  },
  {
    id: 'riyas',
    name: 'Riyas K.',
    nameMl: 'റിയാസ് കെ.',
    number: '7',
    team: 'UDAYA Peruvallur',
    teamShort: 'UDAYA',
    position: 'Midfield Maestro / ക്യാപ്റ്റൻ',
    origin: 'Peruvallur 🇮🇳',
    votes: 310,
    accent: 'from-sky-600 to-blue-800',
    border: 'border-blue-400',
    tag: 'Captain'
  },
  {
    id: 'ousmane',
    name: 'Ousmane',
    nameMl: 'ഉസ്മാൻ',
    number: '4',
    team: 'SABAN FC Kottakkal',
    teamShort: 'SABAN',
    position: 'Center Back / ഡിഫെൻഡർ',
    origin: 'Ghana 🇬🇭',
    votes: 170,
    accent: 'from-amber-600 to-yellow-700',
    border: 'border-amber-400',
    tag: 'Ghana Wall'
  }
];

export default function PlayerOfTheMatchVote({ lang, isDarkMode }) {
  const [selectedId, setSelectedId] = useState(() => {
    return localStorage.getItem('kasc_potm_voted_id') || null;
  });

  const [votesData, setVotesData] = useState(() => {
    return CANDIDATES;
  });

  const [hasVoted, setHasVoted] = useState(() => {
    return localStorage.getItem('kasc_potm_voted_id') !== null;
  });

  const totalVotes = votesData.reduce((acc, c) => acc + c.votes, 0);

  const handleVote = (candidateId) => {
    setSelectedId(candidateId);
    setHasVoted(true);
    localStorage.setItem('kasc_potm_voted_id', candidateId);

    setVotesData((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, votes: c.votes + 1 } : c))
    );

    try {
      confetti({
        particleCount: 75,
        spread: 65,
        origin: { y: 0.7 }
      });
    } catch (e) {
      // safe fallback
    }
  };

  const selectedCandidate = votesData.find((c) => c.id === selectedId);

  const handleShare = () => {
    const candidateName = selectedCandidate 
      ? (lang === 'ml' ? selectedCandidate.nameMl : selectedCandidate.name)
      : 'എന്റെ പ്രിയ താരം';

    const shareUrl = `${window.location.origin}${window.location.pathname}#live`;
    const text = encodeURIComponent(
      `⭐ *അഖിലേന്ത്യാ സെവൻസ് ടൂർണ്ണമെന്റ് സീസൺ 7 - മാൻ ഓഫ് ദി മാച്ച് വോട്ടിംഗ്!* ⚽\n\n` +
      `🔥 UDAYA Peruvallur vs SABAN FC Kottakkal ഉദ്ഘാടന മത്സരത്തിലെ കളിയിലെ താരമായി ഞാൻ വോട്ട് ചെയ്തത്: *${candidateName}* (${selectedCandidate?.teamShort || ''})\n\n` +
      `നിങ്ങളുടെ പ്രിയതാരത്തിന് ഇവിടെ വോട്ട് രേഖപ്പെടുത്തൂ: ${shareUrl}`
    );

    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className={`rounded-2xl sm:rounded-3xl border overflow-hidden p-4 sm:p-6 transition-colors shadow-xs ${
      isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-slate-950 font-black shadow-xs">
            <Award className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-xl font-black font-sports uppercase tracking-wider text-slate-950">
                {lang === 'ml' ? 'കളിയിലെ താരം (PLAYER OF THE MATCH)' : 'PLAYER OF THE MATCH VOTE'}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider">
                Fan Choice
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {lang === 'ml'
                ? 'ഉദ്ഘാടന മത്സരത്തിലെ മികച്ച കളിക്കാരന് വോട്ട് രേഖപ്പെടുത്തൂ'
                : 'Vote for your standout performer in the Day 1 Blockbuster!'}
            </p>
          </div>
        </div>

        {/* Sponsor Tag */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-900 self-start sm:self-auto">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Presented by <strong>Life Line Hospital</strong></span>
        </div>
      </div>

      {/* Candidates Grid */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {votesData.map((candidate) => {
          const isSelected = selectedId === candidate.id;
          const percentage = Math.round((candidate.votes / totalVotes) * 100);

          return (
            <div
              key={candidate.id}
              onClick={() => handleVote(candidate.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden active:scale-[0.99] ${
                isSelected
                  ? 'bg-blue-50/70 border-blue-600 shadow-sm ring-1 ring-blue-500'
                  : 'bg-slate-50/70 hover:bg-slate-100/80 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Jersey Number Avatar */}
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${candidate.accent} text-white flex flex-col items-center justify-center shrink-0 shadow-xs`}>
                    <span className="text-[10px] font-bold uppercase opacity-80">NO</span>
                    <span className="text-lg font-black font-sports leading-none">{candidate.number}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-black text-sm sm:text-base text-slate-950 font-sports">
                        {lang === 'ml' ? candidate.nameMl : candidate.name}
                      </h4>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-600 font-medium">
                      <span className="font-bold text-slate-900">{candidate.teamShort}</span>
                      <span>•</span>
                      <span>{candidate.position}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {candidate.origin}
                    </span>
                  </div>
                </div>

                {/* Percentage & Vote Counter */}
                <div className="text-right shrink-0">
                  <div className="text-lg font-black font-sports text-slate-900">
                    {percentage}%
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    {candidate.votes} votes
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3 w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 bg-gradient-to-r ${candidate.accent}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Post Vote / WhatsApp Status Action */}
      {hasVoted && (
        <div className="mt-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 text-xs font-bold">
            <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {lang === 'ml'
                ? `നിങ്ങൾ വോട്ട് ചെയ്തത്: ${selectedCandidate ? selectedCandidate.nameMl : ''} (${selectedCandidate?.teamShort})`
                : `Your Vote: ${selectedCandidate?.name} (${selectedCandidate?.teamShort})`}
            </span>
          </div>

          <button
            onClick={handleShare}
            className="w-full sm:w-auto px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share My Vote on WhatsApp</span>
          </button>
        </div>
      )}
    </div>
  );
}
