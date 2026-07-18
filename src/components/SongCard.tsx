import React from 'react';
import { Song } from '../types';
import { Music, Eye, ThumbsUp, MessageSquare, Globe2 } from 'lucide-react';

interface SongCardProps {
  song: Song;
  onClick: () => void;
  key?: string | number;
}

export default function SongCard({ song, onClick }: SongCardProps) {
  return (
    <div 
      onClick={onClick}
      className="group bg-white border border-gray-100 rounded-2xl p-5 hover:border-emerald-200 hover:shadow-md hover:shadow-emerald-50/40 transition-all duration-300 cursor-pointer flex flex-col justify-between h-full relative overflow-hidden"
    >
      {/* Decorative accent top line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full tracking-wide">
            <Globe2 className="w-3.5 h-3.5" />
            {song.language}
          </span>
          <span className="text-[11px] font-medium text-gray-400 font-mono">
            {song.releaseYear}
          </span>
        </div>

        <h3 className="font-display font-semibold text-lg text-gray-900 group-hover:text-emerald-700 transition-colors tracking-tight line-clamp-1">
          {song.title}
        </h3>
        
        <p className="text-sm font-medium text-gray-500 mb-4 tracking-tight">
          {song.artist}
        </p>

        {song.tags && song.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {song.tags.slice(0, 3).map((tag, i) => (
              <span 
                key={i} 
                className="text-[10px] text-gray-500 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-2 text-xs font-mono text-gray-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1" title="Views">
            <Eye className="w-3.5 h-3.5 text-gray-300 group-hover:text-emerald-500/60 transition-colors" />
            {song.views}
          </span>
          <span className="flex items-center gap-1" title="Upvotes">
            <ThumbsUp className="w-3.5 h-3.5 text-gray-300 group-hover:text-emerald-500/60 transition-colors" />
            {song.upvotesCount}
          </span>
        </div>

        <span className="flex items-center gap-1 hover:text-emerald-600 transition-colors" title="Comments">
          <MessageSquare className="w-3.5 h-3.5 text-gray-300 group-hover:text-emerald-500/60 transition-colors" />
          {song.commentsCount}
        </span>
      </div>
    </div>
  );
}
