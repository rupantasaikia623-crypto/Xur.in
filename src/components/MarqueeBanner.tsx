import React from 'react';
import { Song } from '../types';
import { Play, Sparkles, TrendingUp, Music, Flame } from 'lucide-react';

interface MarqueeBannerProps {
  songs: Song[];
  onSelectSong: (songId: string) => void;
  onPlayPreview?: (song: Song) => void;
}

export default function MarqueeBanner({ songs, onSelectSong, onPlayPreview }: MarqueeBannerProps) {
  if (!songs || songs.length === 0) return null;

  // Duplicate songs list to ensure seamless infinite looping marquee
  const marqueeItems = [...songs, ...songs, ...songs];

  return (
    <div className="w-full bg-[#080d1a]/90 border-y border-white/10 py-3 overflow-hidden select-none relative backdrop-blur-md">
      {/* Gradient side masks for seamless blending */}
      <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-[#080d1a] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-[#080d1a] to-transparent z-10 pointer-events-none" />

      <div className="flex items-center gap-2 mb-1 px-4 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
        <Flame className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
        <span>Live Trending Radar</span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping ml-1" />
      </div>

      <div className="animate-marquee flex items-center gap-4">
        {marqueeItems.map((song, idx) => (
          <div
            key={`${song.id}-marquee-${idx}`}
            onClick={() => onSelectSong(song.id)}
            className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/40 rounded-full px-4 py-1.5 cursor-pointer transition-all duration-200 shrink-0 group shadow-md"
          >
            {/* Thumbnail or Icon */}
            <div className="w-7 h-7 rounded-full overflow-hidden bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0 relative group-hover:scale-105 transition-transform">
              {song.albumArtUrl ? (
                <img
                  src={song.albumArtUrl}
                  alt={song.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <Music className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <div className="absolute inset-0 bg-emerald-500/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Play className="w-3 h-3 text-slate-950 fill-slate-950 ml-0.5" />
              </div>
            </div>

            {/* Song Title & Artist */}
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-white group-hover:text-emerald-300 transition-colors">
                {song.title}
              </span>
              <span className="text-slate-400 text-[11px]">
                • {song.artist}
              </span>
            </div>

            {/* Language Tag */}
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              {song.language}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
