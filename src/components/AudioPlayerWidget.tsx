import React, { useState, useEffect, useRef } from 'react';
import { Song } from '../types';
import { Play, Pause, Volume2, VolumeX, Maximize2, Music, Sparkles, ChevronUp, ChevronDown, Repeat } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import brandLogo from '../assets/images/xur_music_logo_1784714618259.jpg';

interface AudioPlayerWidgetProps {
  song: Song | null;
  onOpenLyrics: (songId: string) => void;
}

export default function AudioPlayerWidget({ song, onOpenLyrics }: AudioPlayerWidgetProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(15);
  const [isMinimized, setIsMinimized] = useState(false);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (song) {
      setIsPlaying(true);
      setProgress(10);
    }
  }, [song?.id]);

  // Simulated audio timeline progress bar
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying]);

  const togglePlaySound = () => {
    setIsPlaying(!isPlaying);
  };

  if (!song) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        className="fixed bottom-4 right-4 sm:right-6 z-40 max-w-sm w-[calc(100vw-2rem)] sm:w-96 select-none"
      >
        <div className="bg-[#0b101e]/95 border border-emerald-500/30 rounded-2xl shadow-2xl backdrop-blur-xl p-3 sm:p-4 text-white relative overflow-hidden group">
          {/* Top ambient glow */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-12 bg-gradient-to-r from-emerald-500/30 via-teal-400/20 to-cyan-500/30 blur-xl pointer-events-none" />

          {/* Player Header Control */}
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/10">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 ${isPlaying ? 'opacity-75' : 'opacity-0'}`} />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              Now Playing Preview
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                title={isMinimized ? "Expand Player" : "Minimize Player"}
              >
                {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Song Information & Vinyl Thumbnail */}
              <div className="flex items-center gap-3 my-2">
                <div
                  onClick={() => onOpenLyrics(song.id)}
                  className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-slate-900 border border-white/20 shrink-0 cursor-pointer group/art shadow-lg"
                >
                  {song.albumArtUrl ? (
                    <img
                      src={song.albumArtUrl}
                      alt={song.title}
                      className={`w-full h-full object-cover transition-transform duration-500 ${isPlaying ? 'scale-105' : ''}`}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = brandLogo; }}
                    />
                  ) : (
                    <img
                      src={brandLogo}
                      alt="Xur Logo"
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* Vinyl spinning ring effect */}
                  <div
                    className={`absolute inset-0 rounded-xl border-2 border-emerald-400/40 ${isPlaying ? 'animate-spin-slow' : ''}`}
                    style={{ pointerEvents: 'none' }}
                  />

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/art:opacity-100 flex items-center justify-center transition-opacity">
                    <Maximize2 className="w-4 h-4 text-white" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h4
                    onClick={() => onOpenLyrics(song.id)}
                    className="font-bold text-sm text-white truncate hover:text-emerald-300 transition-colors cursor-pointer"
                  >
                    {song.title}
                  </h4>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {song.artist} {song.movieOrAlbum ? `• ${song.movieOrAlbum}` : ''}
                  </p>

                  {/* Equalizer Waveform Bars */}
                  <div className="flex items-end gap-1 h-3 mt-1.5">
                    <span className={`w-1 rounded-full bg-emerald-400 ${isPlaying ? 'animate-eq-1' : 'h-1'}`} />
                    <span className={`w-1 rounded-full bg-cyan-400 ${isPlaying ? 'animate-eq-2' : 'h-1.5'}`} />
                    <span className={`w-1 rounded-full bg-teal-300 ${isPlaying ? 'animate-eq-3' : 'h-1'}`} />
                    <span className={`w-1 rounded-full bg-emerald-500 ${isPlaying ? 'animate-eq-4' : 'h-2'}`} />
                    <span className={`w-1 rounded-full bg-purple-400 ${isPlaying ? 'animate-eq-5' : 'h-1'}`} />
                  </div>
                </div>

                {/* Play / Pause Toggle Button */}
                <button
                  type="button"
                  onClick={togglePlaySound}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer shrink-0"
                  title={isPlaying ? "Pause Preview" : "Play Preview"}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 fill-slate-950" />
                  ) : (
                    <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                  )}
                </button>
              </div>

              {/* Progress Timeline Scrubber */}
              <div className="mt-3">
                <div className="w-full bg-white/10 rounded-full h-1 overflow-hidden cursor-pointer">
                  <div
                    className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[9px] font-mono text-slate-400 mt-1">
                  <span>0:{progress < 10 ? `0${progress}` : progress}</span>
                  <span>3:45</span>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-xs text-slate-400">
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
                  <span className="text-[10px]">{isMuted ? 'Muted' : 'Volume'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenLyrics(song.id)}
                  className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>View Lyrics & Line Analysis</span>
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
