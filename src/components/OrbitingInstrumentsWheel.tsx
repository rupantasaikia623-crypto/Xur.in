import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import brandLogo from '../assets/images/app_logo_wave_1784874601917.jpg';
import { 
  Sparkles, 
  Volume2, 
  Disc, 
  Music, 
  Flame, 
  Maximize2, 
  Radio, 
  Zap,
  Info,
  Pause,
  Play
} from 'lucide-react';
import { Song } from '../types';

export interface Instrument {
  id: string;
  name: string;
  assameseName?: string;
  category: 'strings' | 'percussion' | 'winds' | 'keyboards';
  origin: 'regional' | 'western' | 'classical';
  icon: string; // Emoji/SVG representation
  color: string;
  borderColor: string;
  bgGlow: string;
  description: string;
  radius: number; // Orbit layer radius in px (desktop)
  baseAngle: number; // Starting angle in degrees
  orbitSpeedSec: number; // Seconds per full orbit
  floatDelay: number; // Bobbing delay
}

const INSTRUMENTS: Instrument[] = [
  {
    id: 'bamboo-flute',
    name: 'Bamboo Flute',
    assameseName: 'বাঁহী (Bahi)',
    category: 'winds',
    origin: 'regional',
    icon: '🪈',
    color: 'from-amber-400 to-emerald-400',
    borderColor: 'border-amber-400/60',
    bgGlow: 'shadow-amber-500/30',
    description: 'Traditional Assamese & Indian bamboo flute with soulful resonant acoustic melodies.',
    radius: 170,
    baseAngle: 0,
    orbitSpeedSec: 22,
    floatDelay: 0
  },
  {
    id: 'sitar',
    name: 'Sitar',
    assameseName: 'চেতাৰ',
    category: 'strings',
    origin: 'classical',
    icon: '🪕',
    color: 'from-amber-500 to-orange-500',
    borderColor: 'border-amber-500/60',
    bgGlow: 'shadow-amber-600/30',
    description: 'Plucked string instrument central to Indian classical and regional ragas.',
    radius: 230,
    baseAngle: 28,
    orbitSpeedSec: 28,
    floatDelay: 0.5
  },
  {
    id: 'dhol',
    name: 'Dhol',
    assameseName: 'ঢোল (Bihu Dhol)',
    category: 'percussion',
    origin: 'regional',
    icon: '🥁',
    color: 'from-red-500 to-amber-500',
    borderColor: 'border-red-500/60',
    bgGlow: 'shadow-red-500/30',
    description: 'Energetic double-headed drum essential for Assamese Bihu and folk celebrations.',
    radius: 185,
    baseAngle: 55,
    orbitSpeedSec: 20,
    floatDelay: 1.0
  },
  {
    id: 'tabla',
    name: 'Tabla',
    assameseName: 'তবলা',
    category: 'percussion',
    origin: 'classical',
    icon: '🪘',
    color: 'from-yellow-400 to-amber-600',
    borderColor: 'border-yellow-400/60',
    bgGlow: 'shadow-yellow-500/30',
    description: 'Twin hand drums providing complex rhythmic cycles (Taal) in Indian music.',
    radius: 245,
    baseAngle: 85,
    orbitSpeedSec: 30,
    floatDelay: 1.5
  },
  {
    id: 'harmonium',
    name: 'Harmonium',
    assameseName: 'হাৰমনিয়াম',
    category: 'keyboards',
    origin: 'regional',
    icon: '🎹',
    color: 'from-emerald-400 to-teal-500',
    borderColor: 'border-emerald-400/60',
    bgGlow: 'shadow-emerald-500/30',
    description: 'Free-reed keyboard instrument accompanying devotional and regional songs.',
    radius: 175,
    baseAngle: 115,
    orbitSpeedSec: 24,
    floatDelay: 2.0
  },
  {
    id: 'acoustic-guitar',
    name: 'Acoustic Guitar',
    assameseName: 'একোষ্টিক গিটাৰ',
    category: 'strings',
    origin: 'western',
    icon: '🎸',
    color: 'from-cyan-400 to-blue-500',
    borderColor: 'border-cyan-400/60',
    bgGlow: 'shadow-cyan-500/30',
    description: 'Resonant wooden guitar ideal for unplugged acoustic arrangements.',
    radius: 235,
    baseAngle: 145,
    orbitSpeedSec: 26,
    floatDelay: 0.3
  },
  {
    id: 'violin',
    name: 'Violin',
    assameseName: 'বেহালা (Behala)',
    category: 'strings',
    origin: 'classical',
    icon: '🎻',
    color: 'from-purple-400 to-pink-500',
    borderColor: 'border-purple-400/60',
    bgGlow: 'shadow-purple-500/30',
    description: 'Bowed string instrument expressing deep emotional glides and ornaments.',
    radius: 180,
    baseAngle: 175,
    orbitSpeedSec: 21,
    floatDelay: 0.8
  },
  {
    id: 'electric-guitar',
    name: 'Electric Guitar',
    assameseName: 'ইলেকট্ৰিক গিটাৰ',
    category: 'strings',
    origin: 'western',
    icon: '⚡🎸',
    color: 'from-fuchsia-500 to-pink-500',
    borderColor: 'border-fuchsia-400/60',
    bgGlow: 'shadow-fuchsia-500/30',
    description: 'Amplified guitar delivering rock solos, riffs, and modern synth textures.',
    radius: 250,
    baseAngle: 205,
    orbitSpeedSec: 32,
    floatDelay: 1.2
  },
  {
    id: 'piano',
    name: 'Piano Keyboard',
    assameseName: 'পিয়ানো',
    category: 'keyboards',
    origin: 'western',
    icon: '🎼🎹',
    color: 'from-sky-400 to-indigo-500',
    borderColor: 'border-sky-400/60',
    bgGlow: 'shadow-sky-500/30',
    description: '88-key piano keyboard framing harmonies, chords, and basslines.',
    radius: 190,
    baseAngle: 235,
    orbitSpeedSec: 23,
    floatDelay: 1.7
  },
  {
    id: 'drum-set',
    name: 'Drum Kit',
    assameseName: 'ড্ৰাম ছেট',
    category: 'percussion',
    origin: 'western',
    icon: '🥁✨',
    color: 'from-rose-500 to-red-600',
    borderColor: 'border-rose-400/60',
    bgGlow: 'shadow-rose-500/30',
    description: 'Full acoustic drum kit driving punchy modern backbeats.',
    radius: 240,
    baseAngle: 265,
    orbitSpeedSec: 29,
    floatDelay: 0.4
  },
  {
    id: 'saxophone',
    name: 'Saxophone',
    assameseName: "চেক্স'ফ'ন",
    category: 'winds',
    origin: 'western',
    icon: '🎷',
    color: 'from-amber-300 to-yellow-500',
    borderColor: 'border-amber-300/60',
    bgGlow: 'shadow-amber-400/30',
    description: 'Brass wind instrument generating smooth jazz notes and vocal-like brass leads.',
    radius: 185,
    baseAngle: 295,
    orbitSpeedSec: 25,
    floatDelay: 0.9
  },
  {
    id: 'trumpet',
    name: 'Brass Trumpet',
    assameseName: 'ট্ৰামপেট',
    category: 'winds',
    origin: 'western',
    icon: '🎺',
    color: 'from-teal-300 to-emerald-500',
    borderColor: 'border-teal-300/60',
    bgGlow: 'shadow-teal-400/30',
    description: 'Bright brass trumpet projecting triumphant fanfares and horn lines.',
    radius: 225,
    baseAngle: 325,
    orbitSpeedSec: 27,
    floatDelay: 1.4
  }
];

interface OrbitingInstrumentsWheelProps {
  featuredSong?: Song | null;
  onSelectSong?: (songId: string) => void;
}

export default function OrbitingInstrumentsWheel({
  featuredSong,
  onSelectSong
}: OrbitingInstrumentsWheelProps) {
  const [isWheelSpinning, setIsWheelSpinning] = useState(true);
  const [hoveredInst, setHoveredInst] = useState<Instrument | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [orbitSpeed, setOrbitSpeed] = useState<number>(1);

  // Filter instruments based on user selection
  const filteredInstruments = INSTRUMENTS.filter(inst => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'regional') return inst.origin === 'regional' || inst.origin === 'classical';
    if (activeCategory === 'western') return inst.origin === 'western';
    return inst.category === activeCategory;
  });

  return (
    <div className="relative w-full max-w-xl mx-auto min-h-[460px] sm:min-h-[520px] flex items-center justify-center select-none py-4">
      
      {/* Category Filter Pills on Top */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 bg-[#0b1021]/80 border border-white/10 rounded-full p-1.5 backdrop-blur-xl shadow-2xl max-w-full overflow-x-auto no-scrollbar">
        {[
          { id: 'all', label: 'All Instruments' },
          { id: 'regional', label: ' Folk & Traditional' },
          { id: 'strings', label: ' Strings' },
          { id: 'percussion', label: ' Drums & Tabla' },
          { id: 'winds', label: ' Flutes & Brass' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all duration-200 ${
              activeCategory === cat.id
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold shadow-md shadow-emerald-500/20 scale-105'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Orbit Track Rings (Background Visual Guides) */}
      <div className="absolute w-[330px] h-[330px] sm:w-[380px] sm:h-[380px] rounded-full border border-emerald-500/15 border-dashed animate-spin-slow-paused pointer-events-none" />
      <div className="absolute w-[440px] h-[440px] sm:w-[500px] sm:h-[500px] rounded-full border border-cyan-500/10 border-dashed pointer-events-none hidden sm:block" />

      {/* Acoustic Sound Wave Equalizer Pulse Rings */}
      <div className={`absolute w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] rounded-full bg-emerald-500/10 blur-xl pointer-events-none transition-opacity duration-500 ${isWheelSpinning ? 'animate-ping opacity-25' : 'opacity-0'}`} />
      <div className={`absolute w-[380px] h-[380px] sm:w-[440px] sm:h-[440px] rounded-full bg-cyan-500/10 blur-2xl pointer-events-none transition-opacity duration-700 ${isWheelSpinning ? 'animate-pulse opacity-20' : 'opacity-0'}`} />

      {/* Central Spinning Music Wheel (Vinyl Record) */}
      <div className="relative z-20 flex items-center justify-center">
        <div 
          onClick={() => setIsWheelSpinning(!isWheelSpinning)}
          title="Click to pause or rotate central music wheel"
          className={`relative w-48 h-48 sm:w-60 sm:h-60 rounded-full bg-[#080b14] border-4 border-slate-800/90 shadow-2xl flex items-center justify-center cursor-pointer group transition-all duration-300 hover:scale-105 ${
            isWheelSpinning ? 'animate-spin-slow' : 'animate-spin-slow-paused'
          }`}
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px), radial-gradient(circle, rgba(5,5,10,0.95) 0%, rgba(15,20,32,1) 100%)`,
            boxShadow: '0 0 60px rgba(16, 185, 129, 0.25), inset 0 0 35px rgba(255,255,255,0.08)'
          }}
        >
          {/* Concentric Vinyl Grooves */}
          <div className="absolute inset-3 sm:inset-4 rounded-full border border-white/10 pointer-events-none" />
          <div className="absolute inset-6 sm:inset-8 rounded-full border border-white/5 pointer-events-none" />
          <div className="absolute inset-9 sm:inset-12 rounded-full border border-white/10 pointer-events-none" />
          <div className="absolute inset-12 sm:inset-16 rounded-full border border-white/5 pointer-events-none" />

          {/* Sound Wave Rays radiating outwards */}
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent opacity-60 pointer-events-none" />

          {/* Center Brand Logo Label */}
          <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-slate-900 shadow-2xl relative flex items-center justify-center bg-slate-950">
            <img 
              src={brandLogo} 
              alt="Xur Brand Logo"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.onerror = null;
                target.src = '/logo.jpg';
              }}
            />
            {/* Center Spindle Hole */}
            <div className="absolute w-4 h-4 sm:w-5 sm:h-5 bg-[#0a0a0c] rounded-full border-2 border-emerald-400 shadow-lg flex items-center justify-center z-10">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>
          </div>
        </div>

        {/* Center Control Badge overlay */}
        <button
          onClick={() => setIsWheelSpinning(!isWheelSpinning)}
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#090d1a]/90 hover:bg-[#0f172a] border border-emerald-500/50 rounded-full px-3.5 py-1 text-[11px] font-bold text-emerald-300 shadow-xl backdrop-blur-md flex items-center gap-1.5 z-30 transition-transform hover:scale-110 active:scale-95 cursor-pointer whitespace-nowrap"
        >
          {isWheelSpinning ? (
            <>
              <Pause className="w-3 h-3 text-emerald-400" />
              <span>Orbit Active</span>
            </>
          ) : (
            <>
              <Play className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span>Resume Spin</span>
            </>
          )}
        </button>
      </div>

      {/* Orbiting Instruments Container */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {filteredInstruments.map((inst) => {
          // Calculate scale ratio for mobile vs desktop radius
          const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
          const displayRadius = isMobile ? inst.radius * 0.72 : inst.radius;
          const duration = (inst.orbitSpeedSec / orbitSpeed);

          return (
            <div
              key={inst.id}
              className="absolute pointer-events-auto transition-opacity duration-300"
              style={{
                animationName: isWheelSpinning ? 'orbitSpin' : 'none',
                animationDuration: `${duration}s`,
                animationTimingFunction: 'linear',
                animationIterationCount: 'infinite',
                animationDelay: `-${(inst.baseAngle / 360) * duration}s`,
                transformOrigin: 'center center'
              }}
            >
              {/* Instrument Wrapper placed at calculated orbital distance */}
              <div
                style={{
                  transform: `translate(${displayRadius}px, 0px)`
                }}
                className="relative group"
              >
                {/* Counter-rotate the icon container so the instrument icon stays upright while orbiting */}
                <div
                  style={{
                    animationName: isWheelSpinning ? 'counterOrbitSpin' : 'none',
                    animationDuration: `${duration}s`,
                    animationTimingFunction: 'linear',
                    animationIterationCount: 'infinite',
                    animationDelay: `-${(inst.baseAngle / 360) * duration}s`
                  }}
                  className="relative"
                >
                  {/* Floating Bobbing Wrapper */}
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      duration: 3 + (inst.floatDelay % 2),
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: inst.floatDelay
                    }}
                    onMouseEnter={() => setHoveredInst(inst)}
                    onMouseLeave={() => setHoveredInst(null)}
                    onClick={() => setHoveredInst(hoveredInst?.id === inst.id ? null : inst)}
                    className={`relative p-2.5 sm:p-3 rounded-2xl bg-[#0a0f1d]/85 border ${inst.borderColor} ${inst.bgGlow} shadow-xl backdrop-blur-md cursor-pointer transition-all duration-300 hover:scale-125 hover:z-50 hover:border-emerald-400 hover:shadow-emerald-500/50 flex items-center justify-center`}
                  >
                    {/* Icon Emoji / SVG */}
                    <span className="text-xl sm:text-2xl select-none leading-none drop-shadow-md">
                      {inst.icon}
                    </span>

                    {/* Subtle Pulsing Ring when hovered */}
                    {hoveredInst?.id === inst.id && (
                      <span className="absolute inset-0 rounded-2xl border-2 border-emerald-400 animate-ping opacity-60 pointer-events-none" />
                    )}
                  </motion.div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Musical Notes Particles (♪, ♫, ♬, ♩) around orbit */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {[
          { note: '🎵', top: '15%', left: '20%', delay: '0s' },
          { note: '🎶', top: '25%', left: '78%', delay: '1.2s' },
          { note: '🎼', top: '75%', left: '18%', delay: '2.5s' },
          { note: '🎷', top: '80%', left: '82%', delay: '0.8s' },
          { note: '♩', top: '10%', left: '50%', delay: '3.1s' },
          { note: '♫', top: '60%', left: '88%', delay: '1.8s' }
        ].map((pt, i) => (
          <span
            key={i}
            className="absolute text-lg sm:text-xl text-emerald-400/70 animate-float-note pointer-events-none drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]"
            style={{
              top: pt.top,
              left: pt.left,
              animationDelay: pt.delay
            }}
          >
            {pt.note}
          </span>
        ))}
      </div>

      {/* Instrument Detail Glassmorphism Card Overlay (when hovered/clicked) */}
      <AnimatePresence>
        {hoveredInst && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute -bottom-16 sm:-bottom-20 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-md bg-[#090d1c]/95 border border-emerald-500/40 rounded-2xl p-4 shadow-2xl backdrop-blur-2xl flex items-start gap-3.5"
          >
            <div className={`p-3 rounded-xl bg-gradient-to-br ${hoveredInst.color} text-slate-950 font-black text-2xl shadow-lg shrink-0 flex items-center justify-center`}>
              {hoveredInst.icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <div className="font-bold text-sm text-white flex items-center gap-1.5 truncate">
                  <span>{hoveredInst.name}</span>
                  {hoveredInst.assameseName && (
                    <span className="text-xs font-normal text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      {hoveredInst.assameseName}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10 shrink-0">
                  {hoveredInst.origin}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {hoveredInst.description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Featured Song Floating Card at bottom left if provided */}
      {featuredSong && !hoveredInst && (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={() => onSelectSong && onSelectSong(featuredSong.id)}
          className="absolute -bottom-8 -left-2 sm:-bottom-10 sm:-left-4 bg-[#0b1021]/90 border border-emerald-500/40 rounded-2xl p-3 shadow-2xl backdrop-blur-xl flex items-center gap-3 cursor-pointer hover:border-emerald-400 transition-all group max-w-xs z-30"
        >
          <div className="w-9 h-9 rounded-xl overflow-hidden bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-400/30">
            <Music className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-400 animate-pulse" /> Featured Song
            </div>
            <div className="font-bold text-xs text-white truncate group-hover:text-emerald-300">
              {featuredSong.title}
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              {featuredSong.artist}
            </div>
          </div>
        </motion.div>
      )}

      {/* CSS Keyframe Definitions for Orbiting & Counter-Rotation */}
      <style>{`
        @keyframes orbitSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes counterOrbitSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(-360deg);
          }
        }
      `}</style>
    </div>
  );
}
