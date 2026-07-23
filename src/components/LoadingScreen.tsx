import React from 'react';
import { motion } from 'motion/react';
import brandLogo from '../assets/images/xur_music_logo_1784714618259.jpg';

interface LoadingScreenProps {
  onComplete?: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      onAnimationComplete={onComplete}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050812] text-white select-none overflow-hidden"
    >
      {/* Background radial glow */}
      <div className="absolute w-[500px] h-[500px] bg-gradient-to-tr from-emerald-500/20 via-purple-500/10 to-cyan-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" />

      {/* Main Logo Card */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative flex flex-col items-center"
      >
        <div className="relative mb-6">
          <div className="absolute -inset-3 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 rounded-3xl blur-lg opacity-60 animate-pulse" />
          <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-[#0b101d] p-1 flex items-center justify-center">
            <img
              src={brandLogo}
              alt="Xur"
              className="w-full h-full object-cover rounded-xl"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/logo.jpg';
              }}
            />
          </div>
        </div>

        {/* Title */}
        <h1 className="font-display font-bold text-3xl tracking-wider text-white flex items-center gap-2">
          XUR <span className="text-emerald-400 text-2xl font-sans">(সুৰ)</span>
        </h1>
        <p className="text-xs text-slate-400 tracking-widest uppercase mt-1 font-medium">
          Explore lyrics of any song
        </p>

        {/* Equalizer Waveform Loading Animation */}
        <div className="flex items-end gap-1.5 h-10 mt-8 mb-4 px-4 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
          <span className="w-1.5 bg-emerald-400 rounded-full animate-eq-1" />
          <span className="w-1.5 bg-cyan-400 rounded-full animate-eq-2" />
          <span className="w-1.5 bg-teal-300 rounded-full animate-eq-3" />
          <span className="w-1.5 bg-emerald-500 rounded-full animate-eq-4" />
          <span className="w-1.5 bg-purple-400 rounded-full animate-eq-5" />
          <span className="w-1.5 bg-emerald-400 rounded-full animate-eq-2" />
          <span className="w-1.5 bg-cyan-400 rounded-full animate-eq-1" />
        </div>

        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="text-[11px] text-slate-400 font-mono tracking-wider"
        >
          Tuning frequencies & loading lyrics...
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
