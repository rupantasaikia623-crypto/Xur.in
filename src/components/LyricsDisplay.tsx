import React, { useState } from 'react';
import { Song } from '../types';
import { MessageSquarePlus, Languages, FileText, Music4, Sparkles, ShieldCheck } from 'lucide-react';
import { ProtectedContent, DynamicWatermark } from './ContentProtection';

interface LyricsDisplayProps {
  song: Song;
  onSelectLine: (line: string) => void;
  selectedLine: string | null;
}

type TabType = 'lyrics' | 'transliteration' | 'translation';

export default function LyricsDisplay({ song, onSelectLine, selectedLine }: LyricsDisplayProps) {
  const [activeTab, setActiveTab] = useState<TabType>('lyrics');

  // Splitting helper that handles different line break types
  const getLines = (text: string | undefined) => {
    if (!text) return [];
    return text.split('\n');
  };

  const lines = getLines(
    activeTab === 'lyrics' 
      ? song.lyrics 
      : activeTab === 'transliteration' 
        ? song.transliteration 
        : song.translation
  );

  const hasTransliteration = !!song.transliteration && song.transliteration.trim().length > 0;
  const hasTranslation = !!song.translation && song.translation.trim().length > 0;

  return (
    <div className="relative bg-[#0d121f]/80 border border-white/10 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-xl overflow-hidden">
      {/* Dynamic Watermark Background */}
      <DynamicWatermark opacity={0.06} />

      {/* Header and Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-4 mb-6 gap-3">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('lyrics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'lyrics'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
            }`}
            id="lyrics-tab-main"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            Lyrics
          </button>

          {hasTransliteration && (
            <button
              onClick={() => setActiveTab('transliteration')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'transliteration'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
              }`}
              id="lyrics-tab-translit"
            >
              <Music4 className="w-4 h-4 text-emerald-400" />
              Transliteration
            </button>
          )}

          {hasTranslation && (
            <button
              onClick={() => setActiveTab('translation')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'translation'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
              }`}
              id="lyrics-tab-translation"
            >
              <Languages className="w-4 h-4 text-emerald-400" />
              Translation
            </button>
          )}
        </div>

        {/* Protected Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-bold text-emerald-400 shadow-sm shrink-0">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>XUR Protected</span>
        </div>
      </div>

      {/* Lyrics body wrapped in ProtectedContent */}
      <ProtectedContent isPremium={song.isPremium || song.verified} title={`${song.title} - Protected Composition`}>
        <div className="space-y-1.5 font-sans text-slate-200 leading-relaxed text-base sm:text-lg selection:bg-emerald-500/30 selection:text-emerald-200 max-h-[650px] overflow-y-auto pr-2 scrollbar-none">
          {lines.length === 0 ? (
            <p className="text-slate-500 italic text-center py-12 text-sm">
              No content available for this tab.
            </p>
          ) : (
            lines.map((line, idx) => {
              const isBlank = line.trim().length === 0;
              const isHighlighted = selectedLine === line.trim() && !isBlank;
              const isChorusHeader = line.toLowerCase().startsWith('[chorus') || line.toLowerCase().startsWith('[verse') || line.toLowerCase().startsWith('[bridge');

              if (isBlank) {
                return <div key={idx} className="h-4" />;
              }

              if (isChorusHeader) {
                return (
                  <div 
                    key={idx} 
                    className="font-mono text-xs font-bold tracking-wider text-emerald-400 uppercase pt-4 pb-1.5 flex items-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {line}
                  </div>
                );
              }

              return (
                <div
                  key={idx}
                  onClick={() => onSelectLine(line.trim())}
                  className={`group flex items-center justify-between gap-4 py-2 px-3.5 rounded-xl transition-all cursor-pointer ${
                    isHighlighted
                      ? 'bg-emerald-500/20 border-l-4 border-emerald-400 text-emerald-200 font-semibold pl-3.5 shadow-md shadow-emerald-500/5'
                      : 'hover:bg-white/5 border-l-4 border-transparent text-slate-300 hover:text-white'
                  }`}
                >
                  <span className="break-words select-text pr-4 tracking-wide">{line}</span>
                  <span className={`shrink-0 transition-opacity flex items-center text-xs text-emerald-400 gap-1.5 font-mono font-medium ${
                    isHighlighted ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}>
                    <MessageSquarePlus className="w-4 h-4 shrink-0" />
                    <span className="hidden sm:inline">Discuss Line</span>
                  </span>
                </div>
              );
            })
          )}
        </div>
      </ProtectedContent>

      <div className="border-t border-white/10 pt-4 mt-6 text-xs text-slate-400 text-center flex items-center justify-center gap-1.5">
        <span>💡</span> <span className="font-medium text-slate-300">Tip:</span> Click or tap any line to highlight and discuss its meaning with the community!
      </div>
    </div>
  );
}


