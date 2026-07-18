import React, { useState } from 'react';
import { Song } from '../types';
import { MessageSquarePlus, Languages, FileText, Music4 } from 'lucide-react';

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
    <div className="bg-white border border-gray-100 rounded-3xl p-5 sm:p-7 shadow-xs">
      {/* Tab Switcher */}
      <div className="flex border-b border-gray-100 pb-4 mb-6 gap-2">
        <button
          onClick={() => setActiveTab('lyrics')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
            activeTab === 'lyrics'
              ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-xs'
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
          }`}
          id="lyrics-tab-main"
        >
          <FileText className="w-4 h-4" />
          Lyrics
        </button>

        {hasTransliteration && (
          <button
            onClick={() => setActiveTab('transliteration')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'transliteration'
                ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-xs'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
            id="lyrics-tab-translit"
          >
            <Music4 className="w-4 h-4" />
            Transliteration
          </button>
        )}

        {hasTranslation && (
          <button
            onClick={() => setActiveTab('translation')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'translation'
                ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-xs'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
            id="lyrics-tab-translation"
          >
            <Languages className="w-4 h-4" />
            Translation
          </button>
        )}
      </div>

      {/* Lyrics body */}
      <div className="space-y-1 font-sans text-gray-800 leading-relaxed text-sm sm:text-base selection:bg-emerald-100 max-h-[600px] overflow-y-auto pr-2">
        {lines.length === 0 ? (
          <p className="text-gray-400 italic text-center py-10 text-sm">
            No content available for this tab.
          </p>
        ) : (
          lines.map((line, idx) => {
            const isBlank = line.trim().length === 0;
            const isHighlighted = selectedLine === line.trim() && !isBlank;
            const isChorusHeader = line.toLowerCase().startsWith('[chorus') || line.toLowerCase().startsWith('[verse');

            if (isBlank) {
              return <div key={idx} className="h-4" />;
            }

            if (isChorusHeader) {
              return (
                <div 
                  key={idx} 
                  className="font-mono text-xs font-semibold tracking-wider text-emerald-600/80 uppercase pt-3 pb-1"
                >
                  {line}
                </div>
              );
            }

            return (
              <div
                key={idx}
                onClick={() => onSelectLine(line.trim())}
                className={`group flex items-center justify-between gap-4 py-1.5 px-3 rounded-lg transition-all cursor-pointer ${
                  isHighlighted
                    ? 'bg-emerald-50 border-l-4 border-emerald-500 text-emerald-900 font-medium pl-2.5'
                    : 'hover:bg-slate-50 border-l-4 border-transparent text-gray-700 hover:text-gray-950'
                }`}
              >
                <span className="break-words select-text pr-4">{line}</span>
                <span className={`shrink-0 transition-opacity flex items-center text-xs text-emerald-600 gap-1 font-mono font-medium ${
                  isHighlighted ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}>
                  <MessageSquarePlus className="w-4 h-4 shrink-0" />
                  <span className="hidden sm:inline">Discuss</span>
                </span>
              </div>
            );
          })
        )}
      </div>

      <div className="border-t border-gray-50 pt-4 mt-6 text-xs text-gray-400 text-center">
        💡 <span className="font-medium">Tip:</span> Hover or tap on any line to select & discuss its specific meaning or translation with the community!
      </div>
    </div>
  );
}
