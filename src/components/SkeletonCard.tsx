import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="bg-[#0b101e]/80 border border-white/5 rounded-3xl p-5 shadow-xl flex flex-col justify-between h-full relative overflow-hidden">
      <div className="absolute inset-0 animate-shimmer pointer-events-none" />
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-20 h-5 bg-white/10 rounded-full" />
          <div className="w-12 h-5 bg-white/10 rounded-full" />
        </div>
        <div className="flex gap-3 mb-4">
          <div className="w-14 h-14 bg-white/10 rounded-2xl shrink-0" />
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-white/15 rounded-md w-3/4" />
            <div className="h-3 bg-white/10 rounded-md w-1/2" />
          </div>
        </div>
        <div className="space-y-1.5 my-3">
          <div className="h-3 bg-white/10 rounded w-full" />
          <div className="h-3 bg-white/10 rounded w-5/6" />
        </div>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-2">
        <div className="w-16 h-4 bg-white/10 rounded" />
        <div className="w-24 h-8 bg-white/10 rounded-xl" />
      </div>
    </div>
  );
}

export function SkeletonLyrics() {
  return (
    <div className="bg-[#0b101e]/90 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
      <div className="absolute inset-0 animate-shimmer pointer-events-none" />
      <div className="flex gap-4 items-center border-b border-white/10 pb-6">
        <div className="w-20 h-20 bg-white/10 rounded-2xl shrink-0" />
        <div className="space-y-3 flex-1">
          <div className="h-6 bg-white/15 rounded-lg w-1/2" />
          <div className="h-4 bg-white/10 rounded-md w-1/3" />
        </div>
      </div>
      <div className="space-y-4 py-4">
        <div className="h-4 bg-white/10 rounded w-3/4" />
        <div className="h-4 bg-white/10 rounded w-2/3" />
        <div className="h-4 bg-white/10 rounded w-5/6" />
        <div className="h-4 bg-white/10 rounded w-1/2" />
        <div className="h-4 bg-white/10 rounded w-4/5" />
      </div>
    </div>
  );
}
