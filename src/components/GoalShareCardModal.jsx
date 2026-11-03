import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Share2, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  RefreshCw, 
  Trophy, 
  ShieldCheck, 
  Flame,
  Smartphone
} from 'lucide-react';
import { generateGoalStatusImage, shareGoalCard } from '../utils/goalCardCanvasGenerator';

export default function GoalShareCardModal({
  isOpen,
  onClose,
  initialGoalData = {},
  isDarkMode = false
}) {
  const [formData, setFormData] = useState({
    scorerName: initialGoalData.scorerName || initialGoalData.player || 'Ibrahim Soumahoro',
    minute: initialGoalData.minute || 24,
    goalTeam: initialGoalData.team || initialGoalData.goalTeam || 'home',
    scoreHome: initialGoalData.scoreHome ?? 2,
    scoreAway: initialGoalData.scoreAway ?? 1,
    homeTeamName: initialGoalData.homeTeamName || 'UDAYA PARAMBIL PEEDIKA',
    awayTeamName: initialGoalData.awayTeamName || 'NEW MALAYA MALABAR FC',
    matchStatus: initialGoalData.matchStatus || 'LIVE 2ND HALF',
    goalText: initialGoalData.goalText || initialGoalData.text || 'Stunning top corner finish'
  });

  const [cardImage, setCardImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [copiedText, setCopiedText] = useState(false);

  // Sync initial props when opened
  useEffect(() => {
    if (isOpen) {
      setFormData({
        scorerName: initialGoalData.scorerName || initialGoalData.player || 'Ibrahim Soumahoro',
        minute: initialGoalData.minute ?? 24,
        goalTeam: initialGoalData.team || initialGoalData.goalTeam || 'home',
        scoreHome: initialGoalData.scoreHome ?? 2,
        scoreAway: initialGoalData.scoreAway ?? 1,
        homeTeamName: initialGoalData.homeTeamName || 'UDAYA PARAMBIL PEEDIKA',
        awayTeamName: initialGoalData.awayTeamName || 'NEW MALAYA MALABAR FC',
        matchStatus: initialGoalData.matchStatus || 'LIVE 2ND HALF',
        goalText: initialGoalData.goalText || initialGoalData.text || 'Stunning top corner finish'
      });
    }
  }, [isOpen, initialGoalData]);

  // Generate canvas card whenever form data is modified or opened
  const handleGenerate = async (overrideData = null) => {
    setIsGenerating(true);
    setStatusMessage(null);
    try {
      const activeData = overrideData || formData;
      const result = await generateGoalStatusImage({
        scorerName: activeData.scorerName,
        minute: activeData.minute,
        goalTeam: activeData.goalTeam,
        scoreHome: Number(activeData.scoreHome),
        scoreAway: Number(activeData.scoreAway),
        homeTeamName: activeData.homeTeamName,
        awayTeamName: activeData.awayTeamName,
        matchStatus: activeData.matchStatus,
        goalText: activeData.goalText
      });
      setCardImage(result);
    } catch (err) {
      console.error('Failed to generate goal card:', err);
      setStatusMessage({ type: 'error', text: 'Canvas generation failed. Please try again.' });
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      handleGenerate();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleShare = async () => {
    if (!cardImage) return;
    setStatusMessage({ type: 'info', text: 'Opening Share Menu...' });

    const shareTitle = `⚽ GOAL! ${formData.scorerName} (${formData.minute}')`;
    const shareText = `⚽ GOAL ALERT!\n${formData.scorerName} scores at ${formData.minute}'!\n${formData.homeTeamName} ${formData.scoreHome} - ${formData.scoreAway} ${formData.awayTeamName}\n\n🏆 Udaya KASC All India Sevens Season 7\nLive Scores: https://kasc-soccer-web.vercel.app`;

    const result = await shareGoalCard({
      blob: cardImage.blob,
      dataUrl: cardImage.dataUrl,
      fileName: cardImage.fileName,
      title: shareTitle,
      text: shareText
    });

    if (result.success) {
      setStatusMessage({
        type: 'success',
        text: result.method === 'web-share' 
          ? '✅ Shared successfully to WhatsApp Status!' 
          : '📥 HD Goal Status Image downloaded to device!'
      });
    } else if (result.aborted) {
      setStatusMessage(null);
    } else {
      setStatusMessage({
        type: 'error',
        text: 'Sharing failed. Use the Download HD button below.'
      });
    }

    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleDownload = () => {
    if (!cardImage) return;
    const link = document.createElement('a');
    link.href = cardImage.dataUrl;
    link.download = cardImage.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setStatusMessage({
      type: 'success',
      text: '📥 1080x1920 HD Status Image downloaded!'
    });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleCopyText = () => {
    const text = `⚽ GOAL ALERT! (${formData.minute}')\nScorer: ${formData.scorerName}\n${formData.homeTeamName} [ ${formData.scoreHome} - ${formData.scoreAway} ] ${formData.awayTeamName}\n\n🏆 All India Sevens Football Season 7 (Peruvallur)\nLive Scores: https://kasc-soccer-web.vercel.app`;
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  // Test Presets for long names (both Malayalam and English)
  const nameTestPresets = [
    { label: 'Ibrahim Soumahoro Al-Hassan', name: 'Ibrahim Soumahoro Al-Hassan' },
    { label: 'മുഹമ്മദ് ഷമീർ പറമ്പിൽ പീടിക', name: 'മുഹമ്മദ് ഷമീർ പറമ്പിൽ പീടിക' },
    { label: 'Mohammed Abdul Rahman Al-Bader', name: 'Mohammed Abdul Rahman Al-Bader' },
    { label: 'ഇബ്രാഹിം സുമഹോറോ', name: 'ഇബ്രാഹിം സുമഹോറോ' }
  ];

  const applyNamePreset = (name) => {
    const next = { ...formData, scorerName: name };
    setFormData(next);
    handleGenerate(next);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div 
        className={`relative w-full max-w-4xl max-h-[94vh] rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border transition-colors ${
          isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button Top Right */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white transition active:scale-95 shadow-md"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT COLUMN: 1080x1920 PORTRAIT STATUS CARD PREVIEW */}
        <div className="md:w-1/2 p-4 sm:p-6 bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-800 shrink-0">
          <div className="w-full flex items-center justify-between pb-3 text-slate-300 text-xs">
            <span className="flex items-center gap-1.5 font-bold">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Status Preview (1080x1920 • 9:16)</span>
            </span>
            <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-400/30">
              Client Canvas (0 Cost)
            </span>
          </div>

          <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-400/50 bg-slate-950 flex items-center justify-center group">
            {isGenerating ? (
              <div className="text-center space-y-3 p-4">
                <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
                <p className="text-xs text-blue-200 font-bold">Drawing 1080x1920 Canvas...</p>
                <p className="text-[10px] text-slate-400">Loading Malayalam & Sports Fonts</p>
              </div>
            ) : cardImage ? (
              <img 
                src={cardImage.dataUrl} 
                alt="Goal Status Card" 
                className="w-full h-full object-contain select-none"
              />
            ) : null}
          </div>

          <p className="text-[11px] text-slate-400 text-center mt-3">
            Branded with Season 7 badge, official SFA logos, verified timestamp & match scores.
          </p>
        </div>

        {/* RIGHT COLUMN: CUSTOMIZATION CONTROLS & 1-TAP SHARE */}
        <div className="md:w-1/2 p-4 sm:p-6 flex flex-col justify-between overflow-y-auto max-h-[85vh]">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black font-sports uppercase tracking-wider">
                  Share Goal Status Card
                </h3>
                <p className="text-xs text-slate-500">
                  Auto-generated when ground scorer registers an official goal
                </p>
              </div>
            </div>

            {/* Status Flash */}
            {statusMessage && (
              <div className={`p-2.5 rounded-xl text-xs font-bold text-center animate-fadeIn ${
                statusMessage.type === 'success' 
                  ? 'bg-emerald-500 text-white' 
                  : statusMessage.type === 'error'
                  ? 'bg-red-500 text-white'
                  : 'bg-blue-600 text-white'
              }`}>
                {statusMessage.text}
              </div>
            )}

            {/* Form Inputs */}
            <div className="space-y-3 text-xs">
              {/* Scorer Name Input */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Scorer Player Name (Tested with Long Names & Malayalam)
                </label>
                <input
                  type="text"
                  value={formData.scorerName}
                  onChange={(e) => setFormData({ ...formData, scorerName: e.target.value })}
                  placeholder="e.g. Ibrahim Soumahoro"
                  className="w-full p-2.5 rounded-xl border font-bold bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                />
              </div>

              {/* Long Name Quick Test Presets */}
              <div>
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  🧪 Test Long Player Names (Auto-Scale & Wrap):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {nameTestPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => applyNamePreset(preset.name)}
                      className="px-2 py-1 rounded-lg text-[10px] font-bold bg-slate-100 hover:bg-blue-100 text-slate-800 hover:text-blue-700 border border-slate-200 transition active:scale-95"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Minute & Team Row */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Goal Minute
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="80"
                    value={formData.minute}
                    onChange={(e) => setFormData({ ...formData, minute: parseInt(e.target.value, 10) || 0 })}
                    className="w-full p-2.5 rounded-xl border font-mono font-bold bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Team Scored
                  </label>
                  <select
                    value={formData.goalTeam}
                    onChange={(e) => setFormData({ ...formData, goalTeam: e.target.value })}
                    className="w-full p-2.5 rounded-xl border font-bold bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                  >
                    <option value="home">UDAYA (Home)</option>
                    <option value="away">NEW MALAYA (Away)</option>
                  </select>
                </div>
              </div>

              {/* Scoreline Numbers Row */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                    UDAYA Score
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={formData.scoreHome}
                    onChange={(e) => setFormData({ ...formData, scoreHome: parseInt(e.target.value, 10) || 0 })}
                    className="w-full p-2.5 rounded-xl border font-mono font-black text-center text-sm bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                    NEW MALAYA Score
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={formData.scoreAway}
                    onChange={(e) => setFormData({ ...formData, scoreAway: parseInt(e.target.value, 10) || 0 })}
                    className="w-full p-2.5 rounded-xl border font-mono font-black text-center text-sm bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                  />
                </div>
              </div>

              {/* Optional Description Note */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Goal Highlight Note (Optional)
                </label>
                <input
                  type="text"
                  value={formData.goalText}
                  onChange={(e) => setFormData({ ...formData, goalText: e.target.value })}
                  placeholder="e.g. Stunning 25-yard top corner volley"
                  className="w-full p-2.5 rounded-xl border text-xs bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                />
              </div>

              {/* Update Preview Button */}
              <button
                type="button"
                onClick={() => handleGenerate()}
                disabled={isGenerating}
                className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 border border-slate-300 dark:border-slate-600"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>Update Card Preview</span>
              </button>
            </div>
          </div>

          {/* Action Buttons: 1-Tap Share to WhatsApp Status & Download Fallback */}
          <div className="pt-4 space-y-2 border-t border-slate-200 dark:border-slate-800 mt-4">
            <button
              onClick={handleShare}
              disabled={isGenerating || !cardImage}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 active:scale-95 transition"
            >
              <Share2 className="w-5 h-5" />
              <span>Share to WhatsApp Status (9:16)</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleDownload}
                disabled={isGenerating || !cardImage}
                className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition"
              >
                <Download className="w-4 h-4" />
                <span>Download HD Image</span>
              </button>

              <button
                onClick={handleCopyText}
                className="py-2.5 px-3 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition"
              >
                {copiedText ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{copiedText ? 'Copied Text!' : 'Copy Match Text'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
