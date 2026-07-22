import React from 'react';
import { Song } from '../types';
import { Eye, ThumbsUp, MessageSquare, Globe2, Music, Play } from 'lucide-react';

interface SongCardProps {
  song: Song;
  onClick: () => void;
  searchQuery?: string;
  key?: string | number;
}

export default function SongCard({ song, onClick, searchQuery }: SongCardProps) {
  // Helper to find and highlight matching line
  const getMatchingSnippet = () => {
    if (!searchQuery) return null;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return null;

    // Search lyrics
    const lyricLines = song.lyrics.split('\n');
    let matchedLine = lyricLines.find(l => l.toLowerCase().includes(q));
    let source = 'Lyrics';

    // Fallback to translit
    if (!matchedLine && song.transliteration) {
      const translitLines = song.transliteration.split('\n');
      matchedLine = translitLines.find(l => l.toLowerCase().includes(q));
      source = 'Transliteration';
    }

    // Fallback to translation
    if (!matchedLine && song.translation) {
      const translationLines = song.translation.split('\n');
      matchedLine = translationLines.find(l => l.toLowerCase().includes(q));
      source = 'Translation';
    }

    if (matchedLine) {
      const trimmed = matchedLine.trim();
      const idx = trimmed.toLowerCase().indexOf(q);
      
      // Return snippet with bold search term
      return (
        <div className="mt-3 p-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs backdrop-blur-md">
          <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 block mb-1 font-mono">{source} Match</span>
          <span className="text-slate-300 italic">
            {idx > 25 ? '...' : ''}
            {trimmed.substring(Math.max(0, idx - 25), idx)}
            <mark className="bg-emerald-400 text-slate-950 font-bold px-1 rounded-sm shadow-xs">{trimmed.substring(idx, idx + q.length)}</mark>
            {trimmed.substring(idx + q.length, Math.min(trimmed.length, idx + q.length + 30))}
            {idx + q.length + 30 < trimmed.length ? '...' : ''}
          </span>
        </div>
      );
    }
    return null;
  };

  const matchedSnippet = getMatchingSnippet();

  return (
    <div 
      onClick={onClick}
      className="group bg-[#0d121f]/70 border border-white/10 rounded-2xl p-5 hover:border-emerald-500/40 hover:bg-[#111827]/90 transition-all duration-300 cursor-pointer flex flex-col justify-between h-full relative overflow-hidden backdrop-blur-xl shadow-xl hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1"
    >
      {/* Decorative top ambient glow line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full tracking-wide">
            <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
            {song.language}
          </span>
          
          <div className="flex items-center gap-2">
            {song.youtubeLink && (
              <span className="text-[10px] text-teal-400 bg-teal-500/10 border border-teal-500/20 p-1 rounded-full flex items-center justify-center" title="Includes Audio Preview">
                <Play className="w-3 h-3 fill-teal-400" />
              </span>
            )}
            <span className="text-[11px] font-medium text-slate-400 font-mono">
              {song.releaseYear}
            </span>
          </div>
        </div>

        <h3 className="font-display font-bold text-lg text-white group-hover:text-emerald-400 transition-colors tracking-tight line-clamp-1">
          {song.title}
        </h3>
        
        <p className="text-sm font-medium text-slate-400 mb-2 tracking-tight flex items-center gap-1.5">
          <Music className="w-3.5 h-3.5 text-emerald-400/60" />
          {song.artist}
        </p>

        {/* Display lyrics snippet matching search query */}
        {matchedSnippet}

        {song.tags && song.tags.length > 0 && !matchedSnippet && (
          <div className="flex flex-wrap gap-1 mb-4 mt-2">
            {song.tags.slice(0, 3).map((tag, i) => (
              <span 
                key={i} 
                className="text-[10px] font-medium text-slate-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md hover:border-emerald-500/30 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-white/10 pt-3.5 mt-3 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 hover:text-slate-200 transition-colors" title="Views">
            <Eye className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
            {song.views}
          </span>
          <span className="flex items-center gap-1 hover:text-slate-200 transition-colors" title="Upvotes">
            <ThumbsUp className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
            {song.upvotesCount}
          </span>
        </div>

        <span className="flex items-center gap-1 text-slate-400 group-hover:text-emerald-400 transition-colors font-sans font-medium" title="Comments">
          <MessageSquare className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
          {song.commentsCount}
        </span>
      </div>
    </div>
  );
}

