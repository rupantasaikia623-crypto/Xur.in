import React, { useState } from 'react';
import { Song } from '../types';
import { Sparkles, Languages, HelpCircle, ArrowRight, Loader2, RefreshCw } from 'lucide-react';

interface LyricsHelperProps {
  song: Song;
  selectedLine: string | null;
  onSelectLine: (line: string | null) => void;
  onUpdateLyrics: (updatedLyrics: { lyrics: string; transliteration?: string; translation?: string }) => void;
  currentUser: { uid: string; displayName: string } | null;
}

const SUPPORTED_LANGUAGES = [
  "English",
  "Assamese",
  "Bengali",
  "Hindi",
  "Spanish",
  "French",
  "German"
];

export default function LyricsHelper({ song, selectedLine, onSelectLine, onUpdateLyrics, currentUser }: LyricsHelperProps) {
  const [loading, setLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<'explain' | 'translate' | 'translit' | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [targetLang, setTargetLang] = useState('English');
  const [error, setError] = useState<string | null>(null);

  const handleExplain = async (isLineOnly: boolean) => {
    setLoading(true);
    setLoadingType('explain');
    setError(null);
    setResult(null);
    try {
      const body: any = {
        title: song.title,
        artist: song.artist,
        lyrics: song.lyrics,
      };
      if (isLineOnly && selectedLine) {
        body.line = selectedLine;
      }

      const res = await fetch('/api/lyrics/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to analyze");
      setResult(data.explanation);
    } catch (err: any) {
      setError(err.message || "Something went wrong while communicating with Gemini.");
    } finally {
      setLoading(false);
      setLoadingType(null);
    }
  };

  const handleTranslate = async () => {
    setLoading(true);
    setLoadingType('translate');
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/lyrics/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: song.title,
          artist: song.artist,
          lyrics: song.lyrics,
          targetLang
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to translate");
      
      setResult(data.translation);
      
      // Auto-update song translation locally in UI if there's none
      if (!song.translation) {
        onUpdateLyrics({
          lyrics: song.lyrics,
          transliteration: song.transliteration,
          translation: data.translation
        });
      }
    } catch (err: any) {
      setError(err.message || "Failed to translate lyrics.");
    } finally {
      setLoading(false);
      setLoadingType(null);
    }
  };

  const handleTransliterate = async () => {
    setLoading(true);
    setLoadingType('translit');
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/lyrics/transliterate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: song.title,
          artist: song.artist,
          lyrics: song.lyrics
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to transliterate");

      setResult(data.transliteration);

      // Auto-update song translit locally in UI if there's none
      if (!song.transliteration) {
        onUpdateLyrics({
          lyrics: song.lyrics,
          transliteration: data.transliteration,
          translation: song.translation
        });
      }
    } catch (err: any) {
      setError(err.message || "Failed to generate transliteration.");
    } finally {
      setLoading(false);
      setLoadingType(null);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 shadow-xl border border-slate-800 relative overflow-hidden">
      {/* Sparkle background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="flex items-center gap-2.5 mb-5 border-b border-slate-800 pb-4">
        <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
        <div>
          <h3 className="font-display font-semibold text-base text-slate-100 tracking-tight">
            Gemini Lyrics Assistant
          </h3>
          <p className="text-[11px] text-slate-400">
            Translate scripts, understand deep meanings & get transliterations
          </p>
        </div>
      </div>

      {/* Selected Line Display (Conditional) */}
      {selectedLine ? (
        <div className="mb-5 bg-slate-800/50 border border-slate-700/50 rounded-xl p-3.5 relative">
          <div className="text-[10px] uppercase tracking-wider font-mono text-emerald-400 font-semibold mb-1">
            Selected Lyric Line
          </div>
          <p className="text-sm font-medium italic text-slate-200 pl-2 border-l-2 border-emerald-400">
            "{selectedLine}"
          </p>
          <button 
            onClick={() => onSelectLine(null)}
            className="absolute top-2 right-2 text-[10px] text-slate-500 hover:text-slate-300"
          >
            Clear
          </button>
        </div>
      ) : (
        <div className="mb-5 bg-slate-800/20 border border-dashed border-slate-800 rounded-xl p-3 text-center text-xs text-slate-400">
          💡 Select any line on the left to analyze its specific poetic or cultural meaning line-by-line!
        </div>
      )}

      {/* Actions grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {/* Explanation actions */}
        <div className="space-y-2">
          {selectedLine && (
            <button
              disabled={loading}
              onClick={() => handleExplain(true)}
              className="w-full flex items-center justify-between gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-medium text-xs py-2.5 px-4 rounded-xl transition-all cursor-pointer shadow-sm shadow-emerald-900/10"
              id="ai-explain-line-btn"
            >
              <span className="flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                Explain selected line
              </span>
              {loadingType === 'explain' && <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-200" />}
            </button>
          )}

          <button
            disabled={loading}
            onClick={() => handleExplain(false)}
            className="w-full flex items-center justify-between gap-2 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-800 disabled:text-slate-500 text-slate-200 font-medium text-xs py-2.5 px-4 rounded-xl transition-all cursor-pointer border border-slate-700"
            id="ai-explain-song-btn"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Explain song theme
            </span>
            {loadingType === 'explain' && !selectedLine && <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />}
          </button>
        </div>

        {/* Translation / Transliteration */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="bg-slate-800 text-white border border-slate-700 rounded-xl text-xs px-2 py-2 grow outline-none focus:border-emerald-500 transition-colors"
              id="ai-target-lang-select"
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
            <button
              disabled={loading}
              onClick={handleTranslate}
              className="flex items-center justify-center bg-slate-800 border border-slate-700 hover:bg-emerald-600 text-slate-100 hover:text-white rounded-xl p-2.5 transition-colors cursor-pointer"
              title={`Translate entire song to ${targetLang}`}
              id="ai-translate-btn"
            >
              {loadingType === 'translate' ? (
                <Loader2 className="w-4 h-4 animate-spin text-emerald-200" />
              ) : (
                <Languages className="w-4 h-4 text-emerald-400 hover:text-white" />
              )}
            </button>
          </div>

          <button
            disabled={loading}
            onClick={handleTransliterate}
            className="w-full flex items-center justify-between gap-2 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-800 disabled:text-slate-500 text-slate-200 font-medium text-xs py-2.5 px-4 rounded-xl transition-all cursor-pointer border border-slate-700"
            id="ai-translit-btn"
          >
            <span className="flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
              Transliterate to Roman script
            </span>
            {loadingType === 'translit' && <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />}
          </button>
        </div>
      </div>

      {/* Error Output */}
      {error && (
        <div className="bg-red-950/40 border border-red-900/50 rounded-xl p-4 text-xs text-red-300 mb-4 leading-relaxed">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Loading Overlay state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-10 text-slate-400 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
          <div className="text-center">
            <p className="text-xs font-semibold text-slate-200">Gemini is thinking...</p>
            <p className="text-[10px] text-slate-500 mt-1">Analyzing poetic styles & translation rhythms</p>
          </div>
        </div>
      )}

      {/* Result Output */}
      {result && !loading && (
        <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4 max-h-[350px] overflow-y-auto mt-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
              AI Analysis Result
            </span>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(result);
                // Optionally show visual feedback
              }}
              className="text-[10px] text-slate-400 hover:text-slate-200 font-medium"
            >
              Copy text
            </button>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap selection:bg-slate-700">
            {result}
          </p>
        </div>
      )}
    </div>
  );
}
