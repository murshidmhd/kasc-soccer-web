/**
 * AdminLineupPitchEditor.jsx
 * Visual interactive football pitch editor for admin.
 * Shows an exact copy of the fan-facing StartingSevenPitch lineup
 * on each team half, and lets admin tap any player to edit:
 *   - Player image (URL)
 *   - Name / Jersey number
 *   - Position (tactical role)
 *   - Base rating
 *   - Goals (match goals counter)
 *   - Cards (yellow / red)
 *   - Captain flag
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  X,
  Edit3,
  User,
  Star,
  Target,
  Square,
  Triangle,
  Camera,
  CheckCircle2,
  RotateCcw,
  ChevronDown,
  Zap,
  ShieldAlert,
  AlertTriangle,
  Users,
  ArrowUpDown
} from 'lucide-react';
import {
  getLineupTactics,
  updatePlayerInfo,
  updateTeamFormation,
  swapStarterAndSub,
  resetLineupTactics,
  SEVENS_FORMATIONS,
  TACTICAL_POSITIONS,
  DEFAULT_TOURNAMENT_SQUADS
} from '../utils/lineupManager';
import { saveDisciplinaryRecord, removeDisciplinaryRecord } from '../utils/disciplinaryManager';
import { getSevensFormationPositions, mapSquadToPositions, JerseyShirtIcon } from './StartingSevenPitch';

// ─── Pitch colours per team ───────────────────────────────────────────────────
const TEAM_META = {
  krsc: { label: 'KRSC KOZHIKKODE', shortLabel: 'KRSC', shirtColor: '#EAB308', side: 'home' },
  base: { label: 'BASE PERUMBAVUR',  shortLabel: 'BASE',  shirtColor: '#1E3A8A', side: 'away'  }
};

// ─── Tiny card badge ──────────────────────────────────────────────────────────
function CardBadge({ type }) {
  if (type === 'red')    return <span className="inline-block w-3 h-4 rounded-sm bg-rose-600 border border-white shadow ml-1" title="Red Card" />;
  if (type === 'yellow') return <span className="inline-block w-3 h-4 rounded-sm bg-amber-400 border border-amber-600 shadow ml-1" title="Yellow Card" />;
  return null;
}

// ─── Single player token on pitch ────────────────────────────────────────────
function PitchPlayerToken({ player, posData, shirtColor, goals, hasYellow, hasRed, onEdit }) {
  const shortName = (() => {
    const raw = player.displayName || player.name || '';
    const lower = raw.toLowerCase();
    if (lower.startsWith('muhammed ')) return raw.slice(9).trim();
    if (lower.startsWith('mohammed ')) return raw.slice(9).trim();
    if (lower.startsWith('abdul '))    return raw.slice(6).trim();
    return raw.split(' ')[0] || raw;
  })();

  const rating = Number(player.baseRating || 0);
  const ratingColor = rating >= 7
    ? 'bg-emerald-600 text-white'
    : rating >= 6
      ? 'bg-amber-500 text-navy-950 font-black'
      : rating > 0
        ? 'bg-rose-600 text-white'
        : 'bg-slate-700/85 text-white/90 border border-white/20';

  return (
    <button
      onClick={onEdit}
      style={{
        position: 'absolute',
        left: `${posData.x}%`,
        top:  `${posData.y}%`,
        transform: 'translate(-50%, -50%)'
      }}
      className={`group flex flex-col items-center justify-center cursor-pointer focus:outline-hidden transition active:scale-90 z-20 pointer-events-auto ${hasRed ? 'opacity-85' : ''}`}
      aria-label={`Edit ${player.name}`}
    >
      {/* Avatar ring */}
      <div className="relative">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden shadow-lg border transition-transform group-hover:scale-105 relative ${
          hasRed ? 'ring-2 ring-rose-500 border-rose-600 bg-rose-950/60' : 'border-white/30 bg-slate-900/90'
        }`}>
          <JerseyShirtIcon
            number={player.num}
            color={shirtColor}
            isGK={player.isGK}
            captain={player.captain}
            hasRedCard={hasRed}
            className="w-full h-full absolute inset-0"
          />
          {player.photoUrl && (
            <img
              src={player.photoUrl}
              alt={player.name}
              className="w-full h-full object-cover absolute inset-0 z-10"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          )}
          {player.captain && (
            <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-gold text-navy-950 font-sports font-black text-[9px] flex items-center justify-center border border-white shadow z-10">C</span>
          )}
        </div>

        {/* Rating */}
        <div className={`absolute -bottom-1 -left-1.5 px-1 py-0.5 rounded-md font-mono font-black text-[8px] shadow border border-white/20 z-10 ${ratingColor}`}>
          {rating.toFixed(1)}
        </div>

        {/* Goals */}
        {goals > 0 && (
          <div className="absolute -bottom-1 -right-2 px-1 py-0.5 rounded-full text-[8px] font-mono bg-emerald-600 text-white font-black border border-white shadow z-10">
            ⚽{goals}
          </div>
        )}

        {/* Red card */}
        {hasRed && (
          <div className="absolute -top-1.5 -right-1.5 w-3.5 h-4.5 rounded-sm bg-rose-600 border border-white shadow flex items-center justify-center animate-pulse z-10">
            <span className="text-[8px] font-black text-white">R</span>
          </div>
        )}

        {/* Yellow card */}
        {!hasRed && hasYellow && (
          <div className="absolute -top-1.5 -right-1.5 w-2.5 h-3.5 rounded-sm bg-amber-400 border border-amber-600 shadow z-10" />
        )}

        {/* Edit pencil indicator */}
        <div className="absolute top-0 right-0 w-4 h-4 rounded-bl-lg bg-sky-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition z-20">
          <Edit3 className="w-2.5 h-2.5" />
        </div>
      </div>

      {/* Name pill */}
      <div className={`mt-0.5 px-1.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-sports font-bold tracking-tight text-center leading-tight shadow-sm max-w-[76px] sm:max-w-[85px] truncate ${
        hasRed ? 'bg-rose-700 text-white border border-rose-500' : 'bg-navy-950/85 text-white border border-white/10'
      }`}>
        <span className="opacity-70 mr-0.5 text-[9px] font-mono">#{player.num}</span>
        <span>{shortName}</span>
      </div>
    </button>
  );
}

// ─── Full pitch half for one team ─────────────────────────────────────────────
function PitchHalf({ teamKey, squad, formation, disciplinaryMap, goalsMap, onPlayerEdit }) {
  const meta = TEAM_META[teamKey];
  const side = meta.side;
  const positions = useMemo(() => getSevensFormationPositions(formation, side), [formation, side]);
  const positionedPlayers = useMemo(
    () => mapSquadToPositions(squad, positions, side),
    [squad, positions, side]
  );

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Team label */}
      <div className={`absolute ${side === 'home' ? 'top-1' : 'bottom-1'} left-2 z-30`}>
        <span className="text-[9px] font-black uppercase tracking-widest text-white/60">
          {meta.shortLabel}
          {side === 'home' ? ' (home)' : ' (away)'}
        </span>
      </div>

      {/* Formation label */}
      <div className={`absolute ${side === 'home' ? 'top-1' : 'bottom-1'} right-2 z-30`}>
        <span className="text-[9px] font-black text-white/50">{formation}</span>
      </div>

      {/* Player tokens */}
      {positionedPlayers.map(({ player, posData }, idx) => {
        const dKey = `${player.name?.toLowerCase()}_${player.num}`;
        const disc = disciplinaryMap[dKey] || {};
        const goals = goalsMap[`${teamKey}_${player.num}`] || 0;
        return (
          <PitchPlayerToken
            key={`${teamKey}_${player.num}_${idx}`}
            player={player}
            posData={posData}
            shirtColor={squad.shirtColor || meta.shirtColor}
            goals={goals}
            hasYellow={disc.hasYellowCard}
            hasRed={disc.hasRedCard}
            onEdit={() => onPlayerEdit(teamKey, player, squad.starting.indexOf(player), false)}
          />
        );
      })}
    </div>
  );
}

// ─── Player Edit Modal ────────────────────────────────────────────────────────
function PlayerEditModal({ teamKey, player, squad, lineupTactics, playerIndex, isSub, onClose, onSave }) {
  const meta = TEAM_META[teamKey];
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    name: player.name || '',
    num: player.num || '',
    pos: player.pos || 'GK',
    photoUrl: player.photoUrl || '',
    baseRating: player.baseRating ?? 0.0,
    captain: player.captain || false,
    isGK: player.isGK || false,
    goals: player.goals || 0,
    yellowCard: player.yellowCard || false,
    redCard: player.redCard || false,
  });

  const [photoPreviewUrl, setPhotoPreviewUrl] = useState(player.photoUrl || '');
  const [photoFile, setPhotoFile] = useState(null);
  const [swapWith, setSwapWith] = useState('');
  const [saved, setSaved] = useState(false);

  // Position auto-sets isGK
  const handlePosChange = (pos) => {
    setForm(f => ({ ...f, pos, isGK: pos === 'GK' }));
  };

  // Local photo file upload → data URL preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhotoPreviewUrl(ev.target.result);
      setForm(f => ({ ...f, photoUrl: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const subs = squad?.subs || [];
  const otherStarters = (squad?.starting || []).filter(p => p.num !== player.num);

  const handleSave = () => {
    onSave(teamKey, player.num, {
      name: form.name,
      num: Number(form.num),
      pos: form.pos,
      photoUrl: form.photoUrl,
      baseRating: parseFloat(form.baseRating) || 0.0,
      captain: form.captain,
      isGK: form.isGK,
      goals: Number(form.goals) || 0,
    }, form.yellowCard, form.redCard, swapWith ? Number(swapWith) : null, playerIndex, isSub);
    setSaved(true);
    setTimeout(() => onClose(), 700);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center px-2 pt-2 pb-[calc(4rem+env(safe-area-inset-bottom,0px))] sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn" onClick={onClose}>
      <div
        className="w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-md flex flex-col rounded-t-3xl sm:rounded-3xl bg-slate-900 border border-slate-700 text-white shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-4 pb-3 border-b border-slate-700/60 shrink-0"
          style={{ background: `linear-gradient(135deg, ${meta.shirtColor}22, transparent)` }}>
          <div className="w-10 h-10 rounded-xl overflow-hidden relative bg-slate-800 border border-slate-600 shrink-0">
            <JerseyShirtIcon number={player.num} color={meta.shirtColor} isGK={player.isGK} className="w-full h-full" />
            {photoPreviewUrl && (
              <img src={photoPreviewUrl} alt={player.name} className="w-full h-full object-cover absolute inset-0 z-10"
                onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-black font-sports uppercase tracking-wide truncate">{player.name}</h3>
            <p className="text-[10px] text-slate-400 font-mono">#{player.num} · {player.pos} · {meta.shortLabel}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body – scrollable */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 space-y-4">

          {/* Photo */}
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-xl overflow-hidden relative bg-slate-800 border border-slate-600 shrink-0">
              <JerseyShirtIcon number={form.num} color={meta.shirtColor} isGK={form.isGK} className="w-full h-full absolute inset-0" />
              {photoPreviewUrl && (
                <img src={photoPreviewUrl} alt="preview" className="w-full h-full object-cover absolute inset-0 z-10"
                  onError={e => { e.currentTarget.style.display = 'none'; }} />
              )}
            </div>
            <div className="flex-1 space-y-2">
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full py-2 px-3 rounded-xl bg-sky-600/20 border border-sky-600/40 text-sky-400 text-xs font-bold flex items-center gap-2 hover:bg-sky-600/30 transition"
              >
                <Camera className="w-3.5 h-3.5" /> Upload Photo
              </button>
              <input
                type="file"
                ref={fileRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              <input
                type="url"
                value={form.photoUrl}
                onChange={e => { setForm(f => ({ ...f, photoUrl: e.target.value })); setPhotoPreviewUrl(e.target.value); }}
                placeholder="Or paste image URL…"
                className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-600 text-xs text-white placeholder-slate-500 focus:border-sky-500 outline-none"
              />
            </div>
          </div>

          {/* Name & Number */}
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2 space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Player Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-600 text-sm text-white focus:border-sky-500 outline-none"
                placeholder="e.g. Ashik Usman"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider"># Jersey</label>
              <input
                type="number"
                value={form.num}
                onChange={e => setForm(f => ({ ...f, num: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-600 text-sm text-white text-center font-mono focus:border-sky-500 outline-none"
                min="0" max="99"
              />
            </div>
          </div>

          {/* Position & Rating */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Position</label>
              <div className="relative">
                <select
                  value={form.pos}
                  onChange={e => handlePosChange(e.target.value)}
                  className="w-full appearance-none px-3 py-2 rounded-xl bg-slate-800 border border-slate-600 text-sm text-white focus:border-sky-500 outline-none pr-8"
                >
                  {TACTICAL_POSITIONS.map(tp => (
                    <option key={tp.code} value={tp.code}>{tp.code} – {tp.label.split('(')[0].trim()}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Base Rating</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="9.9"
                value={form.baseRating}
                onChange={e => setForm(f => ({ ...f, baseRating: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-600 text-sm text-white text-center font-mono focus:border-sky-500 outline-none"
              />
            </div>
          </div>

          {/* Goals */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <span>⚽</span> Goals This Match
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setForm(f => ({ ...f, goals: Math.max(0, f.goals - 1) }))}
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-black text-lg flex items-center justify-center transition"
              >−</button>
              <span className="flex-1 text-center text-2xl font-black font-mono text-emerald-400">{form.goals}</span>
              <button
                onClick={() => setForm(f => ({ ...f, goals: f.goals + 1 }))}
                className="w-9 h-9 rounded-xl bg-emerald-700 hover:bg-emerald-600 border border-emerald-500 text-white font-black text-lg flex items-center justify-center transition"
              >+</button>
            </div>
          </div>

          {/* Cards */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" /> Cards
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setForm(f => ({ ...f, yellowCard: !f.yellowCard }))}
                className={`flex-1 py-2.5 rounded-xl border text-xs font-black flex items-center justify-center gap-1.5 transition ${
                  form.yellowCard ? 'bg-amber-500 border-amber-400 text-black' : 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-amber-500/10 hover:border-amber-500/50'
                }`}
              >
                <span className="w-3 h-4 rounded-sm bg-amber-400 border border-amber-600 inline-block" />
                Yellow Card
              </button>
              <button
                onClick={() => setForm(f => ({ ...f, redCard: !f.redCard }))}
                className={`flex-1 py-2.5 rounded-xl border text-xs font-black flex items-center justify-center gap-1.5 transition ${
                  form.redCard ? 'bg-rose-600 border-rose-500 text-white' : 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-rose-600/10 hover:border-rose-600/50'
                }`}
              >
                <span className="w-3 h-4 rounded-sm bg-rose-600 border border-rose-800 inline-block" />
                Red Card
              </button>
            </div>
          </div>

          {/* Captain toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800 border border-slate-700">
            <div className="flex items-center gap-2">
              <span className="text-sm">👑</span>
              <span className="text-xs font-bold text-slate-200">Team Captain (C)</span>
            </div>
            <button
              onClick={() => setForm(f => ({ ...f, captain: !f.captain }))}
              className={`w-10 h-5 rounded-full transition-colors relative ${form.captain ? 'bg-gold' : 'bg-slate-600'}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.captain ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>

          {/* Swap with sub */}
          {subs.length > 0 && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <ArrowUpDown className="w-3 h-3" /> Swap / Sub with
              </label>
              <div className="relative">
                <select
                  value={swapWith}
                  onChange={e => setSwapWith(e.target.value)}
                  className="w-full appearance-none px-3 py-2 rounded-xl bg-slate-800 border border-slate-600 text-sm text-white focus:border-sky-500 outline-none pr-8"
                >
                  <option value="">— No swap —</option>
                  {subs.filter(s => s.name && s.name !== 'None').map(s => (
                    <option key={s.num} value={s.num}>#{s.num} {s.name} (SUB)</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div className="shrink-0 p-3 sm:p-4 pt-3 border-t border-slate-700/60 bg-slate-900 flex gap-2 shadow-[0_-8px_20px_rgba(2,6,23,0.35)]">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={`flex-1 py-2.5 rounded-xl text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg transition ${
              saved ? 'bg-emerald-600 border border-emerald-400' : 'bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-700 hover:to-blue-800'
            }`}
          >
            {saved ? <><CheckCircle2 className="w-4 h-4" /> Saved!</> : <><Zap className="w-4 h-4 text-amber-300" /> Save Changes</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main exported component ──────────────────────────────────────────────────
export default function AdminLineupPitchEditor({ isDarkMode }) {
  const [lineupTactics, setLineupTactics] = useState(getLineupTactics);
  const [editingPlayer, setEditingPlayer] = useState(null); // { teamKey, player }
  const [notification, setNotification] = useState('');
  const [selectedTeamTab, setSelectedTeamTab] = useState('krsc'); // For subs panel

  // Sync when other admin tabs update lineup
  useEffect(() => {
    const sync = () => setLineupTactics(getLineupTactics());
    window.addEventListener('kasc_lineup_tactics_updated', sync);
    return () => window.removeEventListener('kasc_lineup_tactics_updated', sync);
  }, []);

  const krscSquad = lineupTactics?.squads?.krsc || DEFAULT_TOURNAMENT_SQUADS.krsc;
  const baseSquad = lineupTactics?.squads?.base || DEFAULT_TOURNAMENT_SQUADS.base;

  const krscFormation = lineupTactics?.formations?.home || krscSquad.formation || '2-2-2';
  const baseFormation = lineupTactics?.formations?.away || baseSquad.formation || '2-2-2';

  // Build a simple goals map from player.goals field (admin-set)
  const goalsMap = useMemo(() => {
    const map = {};
    ['krsc', 'base'].forEach(tk => {
      const sq = lineupTactics?.squads?.[tk] || DEFAULT_TOURNAMENT_SQUADS[tk];
      [...(sq.starting || []), ...(sq.subs || [])].forEach(p => {
        if (p.goals) map[`${tk}_${p.num}`] = p.goals;
      });
    });
    return map;
  }, [lineupTactics]);

  // Simple disciplinary map from player.yellowCard / .redCard fields
  const disciplinaryMap = useMemo(() => {
    const map = {};
    ['krsc', 'base'].forEach(tk => {
      const sq = lineupTactics?.squads?.[tk] || DEFAULT_TOURNAMENT_SQUADS[tk];
      [...(sq.starting || []), ...(sq.subs || [])].forEach(p => {
        const key = `${(p.name || '').toLowerCase()}_${p.num}`;
        map[key] = { hasYellowCard: p.yellowCard, hasRedCard: p.redCard };
      });
    });
    return map;
  }, [lineupTactics]);

  const notify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 2500);
  };

  // Save all edits for one player
  const handlePlayerSave = (teamKey, oldNum, updates, yellowCard, redCard, swapSubNum, playerIndex, isSub) => {
    // Apply yellow/red card flags on the player object itself (admin-side state)
    const fullUpdates = { ...updates, yellowCard, redCard };
    const updated = updatePlayerInfo(teamKey, oldNum, fullUpdates, playerIndex, isSub);
    setLineupTactics(updated);

    // Also persist card to disciplinaryManager for the pitch viewer
    const squadData = updated.squads[teamKey];
    const player = [...(squadData.starting || []), ...(squadData.subs || [])].find(p => p.num === (updates.num ?? oldNum));
    if (player) {
      const teamName = squadData.name || '';
      if (redCard) {
        saveDisciplinaryRecord({
          playerName: player.name, playerNumber: player.num, teamName,
          cardType: 'red_card', minute: 90, matchId: 'opening_match'
        });
      }
      if (yellowCard) {
        saveDisciplinaryRecord({
          playerName: player.name, playerNumber: player.num, teamName,
          cardType: 'yellow_card', minute: 90, matchId: 'opening_match'
        });
      }
    }

    // Handle substitution swap
    if (swapSubNum) {
      const afterSwap = swapStarterAndSub(teamKey, oldNum, swapSubNum);
      setLineupTactics(afterSwap);
    }

    notify(`✅ ${updates.name} (#${updates.num}) updated!`);
  };

  const handleFormationChange = (teamKey, val) => {
    const updated = updateTeamFormation(teamKey, val);
    setLineupTactics(updated);
    notify(`⚡ ${TEAM_META[teamKey].shortLabel} formation → ${val}`);
  };

  const handleReset = () => {
    if (!confirm('Reset all lineup data to defaults?')) return;
    const reset = resetLineupTactics();
    setLineupTactics(reset);
    notify('🔄 Lineup reset to defaults');
  };

  const selectedSquad = selectedTeamTab === 'krsc' ? krscSquad : baseSquad;
  const selectedMeta = TEAM_META[selectedTeamTab];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-black font-sports uppercase tracking-widest text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-sky-400" />
            Lineup Pitch Editor
          </h2>
          <p className="text-[10px] text-slate-400 mt-0.5">Tap any player on the pitch to edit their details</p>
        </div>
        <button
          onClick={handleReset}
          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-rose-900/30 border border-slate-700 hover:border-rose-700/50 text-slate-300 hover:text-rose-400 text-xs font-bold flex items-center gap-1.5 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="py-2 px-4 rounded-xl bg-emerald-600/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold text-center animate-fadeIn">
          {notification}
        </div>
      )}

      {/* Formation pickers */}
      <div className="grid grid-cols-2 gap-3">
        {['krsc', 'base'].map(tk => {
          const meta = TEAM_META[tk];
          const currentFormation = tk === 'krsc' ? krscFormation : baseFormation;
          return (
            <div key={tk} className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-1.5">
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">{meta.shortLabel} Formation</span>
              <div className="flex flex-wrap gap-1">
                {SEVENS_FORMATIONS.map(f => (
                  <button
                    key={f}
                    onClick={() => handleFormationChange(tk, f)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold border transition ${
                      currentFormation === f
                        ? 'text-white border-transparent'
                        : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
                    }`}
                    style={currentFormation === f ? { background: meta.shirtColor, borderColor: meta.shirtColor } : {}}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* ══════════════════ THE PITCH ══════════════════ */}
      <div className="relative w-full overflow-hidden rounded-2xl border border-slate-700 shadow-2xl">
        {/* Green pitch background */}
        <div
          className="relative w-full"
          style={{
            background: 'linear-gradient(180deg, #15803d 0%, #166534 25%, #14532d 50%, #166534 75%, #15803d 100%)',
            paddingBottom: '170%',  /* ~portrait mobile ratio */
          }}
        >
          <div className="absolute inset-0">
            {/* Pitch markings */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 170" preserveAspectRatio="none">
              {/* Outer boundary */}
              <rect x="3" y="3" width="94" height="164" rx="1" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
              {/* Centre line */}
              <line x1="3" y1="85" x2="97" y2="85" stroke="rgba(255,255,255,0.3)" strokeWidth="0.4" />
              {/* Centre circle */}
              <circle cx="50" cy="85" r="11" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.4" />
              <circle cx="50" cy="85" r="0.8" fill="rgba(255,255,255,0.4)" />
              {/* Home penalty area */}
              <rect x="22" y="3" width="56" height="20" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.4" />
              <rect x="34" y="3" width="32" height="10" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.4" />
              {/* Away penalty area */}
              <rect x="22" y="147" width="56" height="20" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.4" />
              <rect x="34" y="157" width="32" height="10" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.4" />
              {/* Goals */}
              <rect x="39" y="0" width="22" height="3" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.4)" strokeWidth="0.3" />
              <rect x="39" y="167" width="22" height="3" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.4)" strokeWidth="0.3" />
            </svg>

            {/* HOME HALF (KRSC) */}
            <div className="absolute inset-0">
              <PitchHalf
                teamKey="krsc"
                squad={krscSquad}
                formation={krscFormation}
                disciplinaryMap={disciplinaryMap}
                goalsMap={goalsMap}
                onPlayerEdit={(tk, pl, playerIndex, isSub) => setEditingPlayer({ teamKey: tk, player: pl, playerIndex, isSub })}
              />
            </div>

            {/* Centre divider label */}
            <div className="absolute left-1/2 -translate-x-1/2 z-30" style={{ top: '49%' }}>
              <div className="flex gap-3 items-center">
                <span className="text-[8px] font-black text-white/50 uppercase tracking-widest">KRSC</span>
                <span className="text-[8px] text-white/30">vs</span>
                <span className="text-[8px] font-black text-white/50 uppercase tracking-widest">BASE</span>
              </div>
            </div>

            {/* AWAY HALF (BASE) */}
            <div className="absolute inset-0">
              <PitchHalf
                teamKey="base"
                squad={baseSquad}
                formation={baseFormation}
                disciplinaryMap={disciplinaryMap}
                goalsMap={goalsMap}
                onPlayerEdit={(tk, pl, playerIndex, isSub) => setEditingPlayer({ teamKey: tk, player: pl, playerIndex, isSub })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════ SUBSTITUTES PANEL ══════════════════ */}
      <div className="rounded-2xl bg-slate-800/50 border border-slate-700 overflow-hidden">
        {/* Team tab picker */}
        <div className="flex border-b border-slate-700">
          {['krsc', 'base'].map(tk => (
            <button
              key={tk}
              onClick={() => setSelectedTeamTab(tk)}
              className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider transition ${
                selectedTeamTab === tk ? 'text-white border-b-2' : 'text-slate-400 hover:text-slate-200'
              }`}
              style={selectedTeamTab === tk ? { borderColor: TEAM_META[tk].shirtColor } : {}}
            >
              {TEAM_META[tk].shortLabel} Subs
            </button>
          ))}
        </div>

        {/* Sub list */}
        <div className="p-3 space-y-2">
          {(selectedSquad.subs || []).length === 0 && (
            <p className="text-xs text-slate-500 text-center py-4">No substitutes listed</p>
          )}
          {(selectedSquad.subs || []).map((sub, idx) => (
            <button
              key={`${sub.num}_${idx}`}
              onClick={() => setEditingPlayer({ teamKey: selectedTeamTab, player: sub, playerIndex: idx, isSub: true })}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 hover:border-slate-500 transition text-left group"
            >
              <div className="w-9 h-9 rounded-lg overflow-hidden relative bg-slate-800 border border-slate-600 shrink-0">
                <JerseyShirtIcon number={sub.num} color={selectedMeta.shirtColor} isGK={sub.isGK} className="w-full h-full" />
                {sub.photoUrl && (
                  <img src={sub.photoUrl} alt={sub.name} className="w-full h-full object-cover absolute inset-0 z-10"
                    onError={e => { e.currentTarget.style.display = 'none'; }} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-white truncate">{sub.name || '—'}</span>
                  {sub.yellowCard && <span className="w-2.5 h-3 rounded-sm bg-amber-400 inline-block shrink-0" />}
                  {sub.redCard   && <span className="w-2.5 h-3 rounded-sm bg-rose-600 inline-block shrink-0" />}
                </div>
                <span className="text-[10px] text-slate-400 font-mono">#{sub.num} · {sub.pos}</span>
              </div>
              <Edit3 className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 transition shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* ══════════════════ PLAYER EDIT MODAL ══════════════════ */}
      {editingPlayer && (
        <PlayerEditModal
          teamKey={editingPlayer.teamKey}
          player={editingPlayer.player}
          squad={editingPlayer.teamKey === 'krsc' ? krscSquad : baseSquad}
          lineupTactics={lineupTactics}
          playerIndex={editingPlayer.playerIndex}
          isSub={editingPlayer.isSub}
          onClose={() => setEditingPlayer(null)}
          onSave={handlePlayerSave}
        />
      )}
    </div>
  );
}
