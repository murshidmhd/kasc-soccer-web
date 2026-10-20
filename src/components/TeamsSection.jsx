import React, { useState } from 'react';
import { Shield, Search, Users, CheckCircle2, UserCheck } from 'lucide-react';
import { participatingTeams } from '../data/tournamentData';
import TeamLogo from './TeamLogo';

export default function TeamsSection({ lang, isDarkMode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all' | 'permanent' | 'malappuram'

  const filteredTeams = participatingTeams.filter((team) => {
    const matchesSearch =
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.nameMl.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.manager.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (team.asstManager && team.asstManager.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedFilter === 'permanent') {
      return team.category.includes('Permanent') || team.category.includes('Host');
    }
    if (selectedFilter === 'malappuram') {
      return team.city.toLowerCase().includes('malappuram') || team.name.toLowerCase().includes('malappuram');
    }
    return true;
  });

  return (
    <section id="teams" className="py-10 px-3 sm:px-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5 text-blue-600" />
          <span>SFA Official Registered Clubs (22 Teams)</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black font-sports text-slate-950 tracking-wide uppercase">
          {lang === 'ml' ? 'ടീമുകളും മാനേജർമാരും' : 'CLUBS & MANAGEMENT'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          {lang === 'ml'
            ? 'സെവൻസ് ഫുട്ബോൾ അസോസിയേഷൻ (SFA) അംഗീകൃത ടീമുകളും അവയുടെ മാനേജ്‌മെന്റ് വിവരങ്ങളും'
            : 'Official Sevens Football Association (SFA) registered permanent & tournament teams'}
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="max-w-xl mx-auto mb-6 space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'ml' ? 'ടീം അല്ലെങ്കിൽ മാനേജറുടെ പേര് തിരയുക...' : 'Search club, city, or manager...'}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-xs"
          />
        </div>

        <div className="flex items-center justify-center gap-1.5 flex-wrap">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition active:scale-95 ${
              selectedFilter === 'all'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All 22 Clubs
          </button>
          <button
            onClick={() => setSelectedFilter('permanent')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition active:scale-95 ${
              selectedFilter === 'permanent'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {lang === 'ml' ? 'സ്ഥിരം ടീമുകൾ' : 'Permanent SFA'}
          </button>
          <button
            onClick={() => setSelectedFilter('malappuram')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition active:scale-95 ${
              selectedFilter === 'malappuram'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Malappuram Belt
          </button>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeams.map((team) => (
          <div
            key={team.id}
            className={`rounded-2xl p-4 sm:p-5 border transition duration-200 group relative hover:-translate-y-0.5 ${
              isDarkMode
                ? 'bg-slate-900 border-slate-800 text-white'
                : 'bg-white border-slate-200 text-slate-900 shadow-xs hover:border-blue-400 hover:shadow-md'
            }`}
          >
            {/* Top Row: Logo & Badge */}
            <div className="flex items-start justify-between gap-2 mb-3">
              <TeamLogo teamName={team.name} className="w-12 h-12 shadow-xs" />
              <div className="text-right">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 inline-block">
                  NO. {team.id}
                </span>
                <span className={`block text-[9px] font-bold mt-1 ${
                  team.category.includes('Permanent') || team.category.includes('Host')
                    ? 'text-emerald-700'
                    : 'text-slate-500'
                }`}>
                  {team.category.includes('Permanent') ? '★ Permanent SFA' : 'SFA Registered'}
                </span>
              </div>
            </div>

            {/* Team Titles */}
            <h3 className="text-base sm:text-lg font-black font-sports text-slate-950 group-hover:text-blue-700 transition leading-tight">
              {team.name}
            </h3>
            <p className="text-xs font-bold text-slate-500 mb-1">
              {team.nameMl}
            </p>
            <p className="text-[11px] text-blue-700 font-bold mb-3">
              📍 {team.city}
            </p>

            {/* Official Management Information (Clean & Private) */}
            <div className="space-y-1.5 text-xs border-t border-slate-100 pt-3">
              {/* Manager */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Manager</span>
                <span className="font-bold text-slate-900 text-xs">{team.manager}</span>
              </div>

              {/* Assistant Manager */}
              {team.asstManager && (
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50/70 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Asst Manager</span>
                  <span className="font-bold text-slate-800 text-xs">{team.asstManager}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredTeams.length === 0 && (
        <div className="text-center py-12 text-slate-400 text-sm">
          No clubs found matching your search.
        </div>
      )}
    </section>
  );
}
