import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Play, 
  Sparkles, 
  Plus, 
  Radio
} from 'lucide-react';
import OrbitingInstrumentsWheel from './OrbitingInstrumentsWheel';
import { Song } from '../types';

interface HeroSectionProps {
  songs: Song[];
  onExploreClick: () => void;
  onAddSongClick: () => void;
  onSelectSong: (songId: string) => void;
  totalViews?: number;
}

export default function HeroSection({
  songs,
  onExploreClick,
  onAddSongClick,
  onSelectSong,
  totalViews = 14200
}: HeroSectionProps) {
  const [activeCounterSongs, setActiveCounterSongs] = useState(0);
  const [activeCounterArtists, setActiveCounterArtists] = useState(0);
  const [activeCounterUsers, setActiveCounterUsers] = useState(0);

  // Featured song for the vinyl album cover
  const featuredSong = songs && songs.length > 0 ? songs[0] : null;

  // Animated counters increment logic
  useEffect(() => {
    const targetSongs = Math.max(songs.length, 128);
    const targetArtists = Math.max(new Set(songs.map(s => s.artist)).size, 45);
    const targetUsers = 3850;

    let currentS = 0;
    let currentA = 0;
    let currentU = 0;

    const interval = setInterval(() => {
      if (currentS < targetSongs) {
        currentS += Math.ceil(targetSongs / 25);
        setActiveCounterSongs(Math.min(currentS, targetSongs));
      }
      if (currentA < targetArtists) {
        currentA += Math.ceil(targetArtists / 25);
        setActiveCounterArtists(Math.min(currentA, targetArtists));
      }
      if (currentU < targetUsers) {
        currentU += Math.ceil(targetUsers / 25);
        setActiveCounterUsers(Math.min(currentU, targetUsers));
      }
      if (currentS >= targetSongs && currentA >= targetArtists && currentU >= targetUsers) {
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [songs]);

  return (
    <div className="relative overflow-hidden bg-[#060913] text-white pt-24 pb-16 sm:pt-32 sm:pb-24 border-b border-white/10 select-none">
      {/* Background Animated Gradient Blobs & Particles */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-600/25 via-teal-500/15 to-transparent rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-indigo-600/20 via-purple-600/15 to-cyan-500/20 rounded-full blur-[140px] pointer-events-none" />

      {/* Floating Music Notes Backdrop */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-40">
        <span className="absolute left-[10%] top-[20%] text-2xl animate-float-note">🎵</span>
        <span className="absolute left-[85%] top-[15%] text-3xl animate-float-note" style={{ animationDelay: '2s' }}>🎶</span>
        <span className="absolute left-[25%] top-[70%] text-xl animate-float-note" style={{ animationDelay: '4s' }}>🎼</span>
        <span className="absolute left-[75%] top-[65%] text-2xl animate-float-note" style={{ animationDelay: '1s' }}>🎧</span>
        <span className="absolute left-[50%] top-[30%] text-2xl animate-float-note" style={{ animationDelay: '3s' }}>🎸</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Description & CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-cyan-500/15 border border-emerald-500/30 rounded-full px-4 py-1.5 shadow-lg shadow-emerald-500/5">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-spin-slow" />
              <span className="text-xs font-bold tracking-wider text-emerald-300 uppercase">
                XUR (সুৰ) • Explore lyrics of any song
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
            </div>

            {/* Main Display Headline */}
            <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-6xl tracking-tight leading-[1.1]">
              Listen, Translate & <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent animate-gradient-text">
                Decode Regional Melodies
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Experience Assamese, Bengali & Regional song lyrics like never before with line-by-line English meanings, interactive phonetics, community annotations, and original audio previews.
            </p>

            {/* Call to Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                type="button"
                onClick={onExploreClick}
                className="group relative px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 text-slate-950 font-bold text-sm tracking-wide shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center gap-2 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Explore Song Lyrics</span>
              </button>

              <button
                type="button"
                onClick={onAddSongClick}
                className="px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-emerald-500/40 text-white font-bold text-sm tracking-wide backdrop-blur-md hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-lg"
              >
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>Submit New Song</span>
              </button>
            </div>

            {/* Equalizer Audio Bar Visualizer in Hero */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-3">
              <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                Live Acoustic Signal:
              </span>
              <div className="flex items-end gap-1 h-5 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                <span className="w-1 bg-emerald-400 rounded-full animate-eq-1" />
                <span className="w-1 bg-cyan-400 rounded-full animate-eq-2" />
                <span className="w-1 bg-teal-300 rounded-full animate-eq-3" />
                <span className="w-1 bg-emerald-500 rounded-full animate-eq-4" />
                <span className="w-1 bg-purple-400 rounded-full animate-eq-5" />
                <span className="w-1 bg-emerald-400 rounded-full animate-eq-2" />
              </div>
            </div>

            {/* Animated Counters Grid */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 max-w-lg mx-auto lg:mx-0">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center lg:text-left backdrop-blur-md">
                <div className="font-display font-extrabold text-xl sm:text-2xl text-emerald-400">
                  {activeCounterSongs}+
                </div>
                <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">
                  Verified Songs
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center lg:text-left backdrop-blur-md">
                <div className="font-display font-extrabold text-xl sm:text-2xl text-cyan-400">
                  {activeCounterArtists}+
                </div>
                <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">
                  Regional Artists
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center lg:text-left backdrop-blur-md">
                <div className="font-display font-extrabold text-xl sm:text-2xl text-purple-400">
                  {(totalViews || 14200).toLocaleString()}+
                </div>
                <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">
                  Lyric Readers
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Immersive Interactive Rotating Music Wheel & Orbiting Musical Instruments */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 flex justify-center relative min-h-[480px] sm:min-h-[540px]"
          >
            <OrbitingInstrumentsWheel 
              featuredSong={featuredSong}
              onSelectSong={onSelectSong}
            />
          </motion.div>

        </div>
      </div>
    </div>
  );
}
