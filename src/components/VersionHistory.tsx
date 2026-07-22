import React, { useState, useEffect } from 'react';
import { Song, SongVersion } from '../types';
import { fetchSongVersions } from '../lib/db-helpers';
import { History, Calendar, User, BookOpen, ChevronRight, CornerDownRight } from 'lucide-react';

interface VersionHistoryProps {
  song: Song;
  onRefreshSong: () => void;
}

export default function VersionHistory({ song, onRefreshSong }: VersionHistoryProps) {
  const [versions, setVersions] = useState<SongVersion[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<SongVersion | null>(null);
  const [loading, setLoading] = useState(false);

  const loadVersions = async () => {
    setLoading(true);
    const list = await fetchSongVersions(song.id);
    setVersions(list);
    setLoading(false);
  };

  useEffect(() => {
    loadVersions();
  }, [song.id, song.currentVersionId]);

  return (
    <div className="bg-[#0d121f]/80 border border-white/10 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center gap-2 border-b border-white/10 pb-4 mb-6">
        <History className="w-5 h-5 text-emerald-400" />
        <h3 className="font-display font-bold text-lg text-white tracking-tight">
          Edit History & Versions
        </h3>
      </div>

      {loading ? (
        <div className="text-center py-8 text-slate-500 text-sm italic">
          Loading edits...
        </div>
      ) : versions.length === 0 ? (
        <div className="text-center py-8 text-slate-500 text-sm italic">
          No edits recorded for this song yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Versions list */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-2">
              Revision Log (Wiki-style)
            </h4>
            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2 scrollbar-none">
              {versions.map((ver, idx) => {
                const isSelected = selectedVersion?.id === ver.id;
                const isCurrent = ver.id === song.currentVersionId || (idx === 0 && !song.currentVersionId);

                return (
                  <div
                    key={ver.id}
                    onClick={() => setSelectedVersion(isSelected ? null : ver)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500/20 border-emerald-500/40 shadow-md shadow-emerald-500/10'
                        : 'bg-white/5 hover:bg-white/10 border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-emerald-400" />
                        {ver.editedByUsername}
                      </span>
                      {isCurrent && (
                        <span className="text-[9px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-mono">
                          Current
                        </span>
                      )}
                    </div>
                    
                    <p className="text-xs font-medium text-slate-300 mb-1.5 line-clamp-1 italic">
                      "{ver.editNotes || "Lyrics improvement"}"
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {new Date(ver.createdAt).toLocaleDateString()} at {new Date(ver.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                      <span className="text-emerald-400 font-bold flex items-center gap-0.5 hover:underline">
                        View Lyrics <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Version Preview panel */}
          <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col justify-between min-h-[300px] backdrop-blur-md">
            {selectedVersion ? (
              <div className="space-y-4 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 border-b border-white/10 pb-2 mb-3 justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      Lyrics Version Snapshot
                    </span>
                    <button
                      onClick={() => setSelectedVersion(null)}
                      className="text-xs text-slate-400 hover:text-white font-mono cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                  <div className="bg-slate-950/80 border border-white/10 rounded-xl p-3.5 max-h-[220px] overflow-y-auto text-xs sm:text-sm font-sans text-slate-200 leading-relaxed whitespace-pre-wrap selection:bg-emerald-500/30">
                    {selectedVersion.lyrics}
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-slate-400 mt-2">
                  <div className="font-bold text-slate-200 mb-0.5 flex items-center gap-1">
                    <CornerDownRight className="w-3 h-3 text-emerald-400" /> 
                    Revision info
                  </div>
                  Submitted by <strong className="text-white">{selectedVersion.editedByUsername}</strong>. 
                  Edit notes: <span className="italic text-slate-300">"{selectedVersion.editNotes || 'No notes'}"</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center h-full text-slate-500 py-10">
                <History className="w-10 h-10 text-slate-600 mb-3" />
                <h5 className="font-bold text-sm text-slate-300 tracking-tight mb-1">
                  Revision Inspector
                </h5>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                  Click on any log entry on the left to inspect previous lyrics, transliterations, and contributor notes.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
