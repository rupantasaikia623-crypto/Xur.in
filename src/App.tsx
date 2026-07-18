import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  fetchSongs, 
  getSongById, 
  addSong, 
  toggleSongUpvote, 
  editSongLyrics, 
  saveProfile, 
  getProfile,
  reportFlag,
  fetchFlags,
  resolveFlag
} from './lib/db-helpers';
import { auth } from './lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { Song, UserProfile, FlagReport } from './types';
import Navbar from './components/Navbar';
import SongCard from './components/SongCard';
import DisclaimerBanner from './components/DisclaimerBanner';
import LyricsDisplay from './components/LyricsDisplay';
import LyricsHelper from './components/LyricsHelper';
import DiscussionSection from './components/DiscussionSection';
import VersionHistory from './components/VersionHistory';

import { 
  Plus, 
  ChevronRight, 
  Eye, 
  ThumbsUp, 
  MessageSquare, 
  Sparkles, 
  X, 
  Loader2, 
  AlertTriangle, 
  ArrowLeft,
  Youtube,
  Edit3,
  CheckCircle,
  Globe2,
  Trash2,
  Info,
  BookHeart,
  ShieldAlert,
  Music
} from 'lucide-react';

export default function App() {
  // Navigation / Page state
  const [currentPage, setCurrentPage] = useState('home'); // 'home' | 'song-details' | 'add-song' | 'profile' | 'moderator-board'
  const [selectedSongId, setSelectedSongId] = useState<string | null>(null);
  
  // App-wide data states
  const [songs, setSongs] = useState<Song[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [langFilter, setLangFilter] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [sortMethod, setSortMethod] = useState<'recent' | 'trending' | 'discussed'>('recent');
  
  // User Auth states
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Auth Form states
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authDisplayName, setAuthDisplayName] = useState('');
  const [authBio, setAuthBio] = useState('');
  const [authRole, setAuthRole] = useState<'user' | 'moderator' | 'admin'>('user');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // New Song submission states
  const [newTitle, setNewTitle] = useState('');
  const [newArtist, setNewArtist] = useState('');
  const [newLanguage, setNewLanguage] = useState('Assamese');
  const [newAlbum, setNewAlbum] = useState('');
  const [newReleaseYear, setNewReleaseYear] = useState(new Date().getFullYear());
  const [newGenre, setNewGenre] = useState('Folk');
  const [newTags, setNewTags] = useState('');
  const [newLyrics, setNewLyrics] = useState('');
  const [newTranslit, setNewTranslit] = useState('');
  const [newTranslation, setNewTranslation] = useState('');
  const [newYoutube, setNewYoutube] = useState('');
  const [isSubmittingSong, setIsSubmittingSong] = useState(false);
  const [generationLoading, setGenerationLoading] = useState<'translit' | 'translation' | null>(null);

  // Wiki Edit Lyrics states
  const [isEditingLyrics, setIsEditingLyrics] = useState(false);
  const [editLyricsText, setEditLyricsText] = useState('');
  const [editTranslitText, setEditTranslitText] = useState('');
  const [editTranslationText, setEditTranslationText] = useState('');
  const [editNotesText, setEditNotesText] = useState('');
  const [isSavingEdits, setIsSavingEdits] = useState(false);

  // Highlighting line to discuss
  const [selectedLine, setSelectedLine] = useState<string | null>(null);

  // Song Reporting State
  const [reportingSong, setReportingSong] = useState<boolean>(false);
  const [songFlagReason, setSongFlagReason] = useState('');
  const [songFlagDetails, setSongFlagDetails] = useState('');
  const [isSubmittingSongFlag, setIsSubmittingSongFlag] = useState(false);

  // Mod Board state
  const [flags, setFlags] = useState<FlagReport[]>([]);
  const [flagsLoading, setFlagsLoading] = useState(false);

  // Load songs on mount & when state updates
  const loadAllSongs = async () => {
    const list = await fetchSongs();
    setSongs(list);
  };

  useEffect(() => {
    loadAllSongs();
  }, []);

  // Filter and sort songs whenever data or filters change
  useEffect(() => {
    let result = [...songs];

    if (langFilter) {
      result = result.filter(s => s.language.toLowerCase() === langFilter.toLowerCase());
    }
    if (genreFilter) {
      result = result.filter(s => s.genre.toLowerCase() === genreFilter.toLowerCase());
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => 
        s.title.toLowerCase().includes(q) || 
        s.artist.toLowerCase().includes(q) || 
        (s.album && s.album.toLowerCase().includes(q)) || 
        s.lyrics.toLowerCase().includes(q)
      );
    }

    // Filter out flagged songs for general users, but allow for mod review
    const isMod = currentUser && (currentUser.role === 'moderator' || currentUser.role === 'admin');
    if (!isMod) {
      result = result.filter(s => !s.isFlagged);
    }

    // Sort songs
    if (sortMethod === 'recent') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortMethod === 'trending') {
      result.sort((a, b) => (b.views + b.upvotesCount * 5) - (a.views + a.upvotesCount * 5));
    } else if (sortMethod === 'discussed') {
      result.sort((a, b) => b.commentsCount - a.commentsCount);
    }

    setFilteredSongs(result);
  }, [songs, searchQuery, langFilter, genreFilter, sortMethod, currentUser]);

  // Handle Auth state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch or create profile in firestore
        const profile = await getProfile(user.uid);
        if (profile) {
          setCurrentUser(profile);
        } else {
          // Setup initial database entry
          const newProfile: UserProfile = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || user.email?.split('@')[0] || 'User',
            role: 'user',
            favorites: [],
            following: [],
            followers: [],
            submittedSongs: [],
            createdAt: new Date().toISOString()
          };
          await saveProfile(newProfile);
          setCurrentUser(newProfile);
        }
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch song details when selected
  const handleSelectSong = async (songId: string) => {
    const song = await getSongById(songId);
    if (song) {
      setSelectedSong(song);
      setSelectedSongId(songId);
      // Populate edit fields for wiki editor
      setEditLyricsText(song.lyrics);
      setEditTranslitText(song.transliteration || '');
      setEditTranslationText(song.translation || '');
      setCurrentPage('song-details');
      setSelectedLine(null);
      setIsEditingLyrics(false);
    }
  };

  const handleRefreshSong = async () => {
    if (selectedSongId) {
      const song = await getSongById(selectedSongId);
      if (song) {
        setSelectedSong(song);
      }
      loadAllSongs();
    }
  };

  // Auth Operations
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      if (authMode === 'login') {
        await signInWithEmailAndPassword(auth, authEmail, authPassword);
      } else {
        const cred = await createUserWithEmailAndPassword(auth, authEmail, authPassword);
        await updateProfile(cred.user, { displayName: authDisplayName });
        const newProfile: UserProfile = {
          uid: cred.user.uid,
          email: authEmail,
          displayName: authDisplayName,
          bio: authBio,
          role: authRole,
          favorites: [],
          following: [],
          followers: [],
          submittedSongs: [],
          createdAt: new Date().toISOString()
        };
        await saveProfile(newProfile);
        setCurrentUser(newProfile);
      }
      setAuthModalOpen(false);
      resetAuthForm();
    } catch (err: any) {
      setAuthError(err.message || "Authentication failed. Check your credentials.");
    } finally {
      setAuthLoading(false);
    }
  };

  const resetAuthForm = () => {
    setAuthEmail('');
    setAuthPassword('');
    setAuthDisplayName('');
    setAuthBio('');
    setAuthRole('user');
    setAuthError(null);
  };

  const handleQuickLogin = async (role: 'user' | 'moderator') => {
    setAuthLoading(true);
    // Create a client-only local mock account for zero-hurdle testing
    const mockUid = `demo-${role}-${Date.now().toString().slice(-4)}`;
    const mockUser: UserProfile = {
      uid: mockUid,
      email: `${role}@xur.com`,
      displayName: role === 'moderator' ? 'Wiki Moderator (Demo)' : 'Joyjeet (Demo)',
      bio: role === 'moderator' ? 'Official content review manager.' : 'Avid translator and classical music fan.',
      role: role,
      favorites: [],
      following: [],
      followers: [],
      submittedSongs: [],
      createdAt: new Date().toISOString()
    };
    
    // Save to local persistence & apply to state
    const profiles = JSON.parse(localStorage.getItem('xur_local_profile') || '{}');
    profiles[mockUid] = mockUser;
    localStorage.setItem('xur_local_profile', JSON.stringify(profiles));
    
    setCurrentUser(mockUser);
    setAuthModalOpen(false);
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    // Also remove any demo user
    setCurrentUser(null);
    setCurrentPage('home');
  };

  // Submit Song
  const handleAddSongSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newArtist || !newLyrics) return;

    setIsSubmittingSong(true);
    const userId = currentUser ? currentUser.uid : "system";
    const userName = currentUser ? currentUser.displayName : "Xur Moderator";

    const songId = await addSong({
      title: newTitle.trim(),
      artist: newArtist.trim(),
      language: newLanguage,
      album: newAlbum.trim() || "Single",
      releaseYear: Number(newReleaseYear),
      genre: newGenre,
      tags: newTags.split(',').map(t => t.trim().toLowerCase()).filter(t => t.length > 0),
      lyrics: newLyrics.trim(),
      transliteration: newTranslit.trim() || undefined,
      translation: newTranslation.trim() || undefined,
      youtubeLink: newYoutube.trim() || undefined,
      submittedBy: userId,
      submittedByUsername: userName
    });

    // Reset fields
    setNewTitle('');
    setNewArtist('');
    setNewLanguage('Assamese');
    setNewAlbum('');
    setNewReleaseYear(new Date().getFullYear());
    setNewGenre('Folk');
    setNewTags('');
    setNewLyrics('');
    setNewTranslit('');
    setNewTranslation('');
    setNewYoutube('');
    setIsSubmittingSong(false);

    loadAllSongs();
    handleSelectSong(songId);
  };

  // Gemini assistant inside Lyrics Creator Form
  const handleGenerateInCreator = async (type: 'translit' | 'translation') => {
    if (!newLyrics) {
      alert("Please enter original lyrics first so Gemini can process it!");
      return;
    }
    setGenerationLoading(type);
    try {
      const endpoint = type === 'translit' ? '/api/lyrics/transliterate' : '/api/lyrics/translate';
      const body: any = {
        title: newTitle || "Untitled Song",
        artist: newArtist || "Unknown Artist",
        lyrics: newLyrics,
      };
      if (type === 'translation') {
        body.targetLang = "English"; // Default translation helper
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed generation");
      
      if (type === 'translit') {
        setNewTranslit(data.transliteration);
      } else {
        setNewTranslation(data.translation);
      }
    } catch (err: any) {
      alert(err.message || "Failed to communicate with Gemini. Ensure server is up.");
    } finally {
      setGenerationLoading(null);
    }
  };

  // Wiki Edit Submissions
  const handleWikiEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSong || !editLyricsText.trim() || !editNotesText.trim()) return;

    setIsSavingEdits(true);
    const userId = currentUser ? currentUser.uid : "wiki-contributor";
    const userName = currentUser ? currentUser.displayName : "Contributor";

    await editSongLyrics(
      selectedSong.id,
      {
        lyrics: editLyricsText.trim(),
        transliteration: editTranslitText.trim() || undefined,
        translation: editTranslationText.trim() || undefined
      },
      userId,
      userName,
      editNotesText.trim()
    );

    setEditNotesText('');
    setIsEditingLyrics(false);
    setIsSavingEdits(false);
    handleRefreshSong();
  };

  // Toggle Song Bookmark/Favorite
  const handleToggleFavorite = async () => {
    if (!selectedSong) return;
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }

    const profiles = JSON.parse(localStorage.getItem('xur_local_profile') || '{}');
    const userProfile = profiles[currentUser.uid] || { ...currentUser };
    
    if (!userProfile.favorites) userProfile.favorites = [];
    
    const favIdx = userProfile.favorites.indexOf(selectedSong.id);
    if (favIdx !== -1) {
      userProfile.favorites.splice(favIdx, 1);
    } else {
      userProfile.favorites.push(selectedSong.id);
    }

    // Save
    profiles[currentUser.uid] = userProfile;
    localStorage.setItem('xur_local_profile', JSON.stringify(profiles));
    setCurrentUser(userProfile);
  };

  // Song Upvoting
  const handleToggleSongUpvote = async () => {
    if (!selectedSong) return;
    const uid = currentUser ? currentUser.uid : "guest-user";
    const result = await toggleSongUpvote(selectedSong.id, uid);
    handleRefreshSong();
  };

  // Song Report submission
  const handleSongFlagSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSong || !songFlagReason.trim()) return;

    setIsSubmittingSongFlag(true);
    const repId = currentUser ? currentUser.uid : "guest-reporter";
    const repName = currentUser ? currentUser.displayName : "Anonymous";

    await reportFlag({
      type: 'song',
      targetId: selectedSong.id,
      songId: selectedSong.id,
      reason: songFlagReason,
      details: songFlagDetails,
      reportedBy: repId,
      reportedByUsername: repName
    });

    setReportingSong(false);
    setSongFlagReason('');
    setSongFlagDetails('');
    setIsSubmittingSongFlag(false);
    handleRefreshSong();
    alert("Thank you. This song has been flagged and sent to moderators for review.");
    setCurrentPage('home');
  };

  // Moderator review operations
  const loadFlags = async () => {
    setFlagsLoading(true);
    const list = await fetchFlags();
    setFlags(list);
    setFlagsLoading(false);
  };

  useEffect(() => {
    if (currentPage === 'moderator-board') {
      loadFlags();
    }
  }, [currentPage]);

  const handleResolveFlag = async (flagId: string, action: 'resolve' | 'dismiss') => {
    await resolveFlag(flagId, action);
    loadFlags();
    loadAllSongs();
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans selection:bg-emerald-100 antialiased text-gray-800">
      
      {/* Top Navigation bar */}
      <Navbar
        onSearch={setSearchQuery}
        onLanguageFilter={setLangFilter}
        onGenreFilter={setGenreFilter}
        onNavigate={setCurrentPage}
        currentPage={currentPage}
        currentUser={currentUser}
        onOpenAuth={() => { setAuthMode('login'); setAuthModalOpen(true); }}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
        
        {/* Animated Page Transitions */}
        <AnimatePresence mode="wait">
          
          {/* PAGE 1: Discovery (Home) */}
          {currentPage === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6 sm:space-y-8"
            >
              {/* Legal disclaimer banner */}
              <DisclaimerBanner />

              {/* Jumbotron / Hero Section */}
              <div className="bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-3 max-w-xl z-10 text-center sm:text-left">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                    <Sparkles className="w-3.5 h-3.5" />
                    Interactive Lyrics Wiki
                  </span>
                  <h1 className="font-display font-bold text-3xl sm:text-4xl tracking-tight leading-tight text-white">
                    Explore the depths of musical poetry
                  </h1>
                  <p className="text-xs sm:text-sm text-emerald-200/80 leading-relaxed">
                    Collaborate on translations, understand deep metaphors with Gemini AI, discuss cultural contexts line-by-line, and read songs in multiple scripts seamlessly.
                  </p>
                </div>
                <div className="shrink-0 flex gap-3 z-10">
                  <button
                    onClick={() => setCurrentPage('add-song')}
                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition-all cursor-pointer shadow-md shadow-emerald-500/15"
                  >
                    <Plus className="w-4 h-4" />
                    Submit Song
                  </button>
                </div>
                {/* Visual glow background */}
                <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-teal-500/10 blur-3xl rounded-full" />
              </div>

              {/* Discovery Main Layout Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                {/* Left Columns: Songs Catalog & Sort */}
                <div className="lg:col-span-3 space-y-5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-100 pb-3 gap-3">
                    <h2 className="font-display font-semibold text-lg sm:text-xl text-gray-900 tracking-tight">
                      Explore Song Library
                    </h2>
                    
                    {/* Catalog sorting buttons */}
                    <div className="flex bg-gray-100 p-1 rounded-lg text-xs font-semibold self-stretch sm:self-auto">
                      <button
                        onClick={() => setSortMethod('recent')}
                        className={`px-3 py-1.5 rounded-md grow sm:grow-0 transition-all ${
                          sortMethod === 'recent' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'text-gray-500 hover:text-gray-900'
                        }`}
                      >
                        Recently Added
                      </button>
                      <button
                        onClick={() => setSortMethod('trending')}
                        className={`px-3 py-1.5 rounded-md grow sm:grow-0 transition-all ${
                          sortMethod === 'trending' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'text-gray-500 hover:text-gray-900'
                        }`}
                      >
                        Trending
                      </button>
                      <button
                        onClick={() => setSortMethod('discussed')}
                        className={`px-3 py-1.5 rounded-md grow sm:grow-0 transition-all ${
                          sortMethod === 'discussed' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'text-gray-500 hover:text-gray-900'
                        }`}
                      >
                        Most Discussed
                      </button>
                    </div>
                  </div>

                  {/* Songs grid */}
                  {filteredSongs.length === 0 ? (
                    <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center text-gray-400">
                      No songs found matching your current query or filters.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {filteredSongs.map(song => (
                        <SongCard 
                          key={song.id} 
                          song={song} 
                          onClick={() => handleSelectSong(song.id)} 
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Column: Platform Stats & Info sidebar */}
                <div className="space-y-6">
                  {/* Language Distribution */}
                  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs">
                    <h3 className="font-display font-bold text-sm text-gray-900 border-b border-gray-100 pb-2 mb-3 tracking-tight">
                      Supported Regions & Scripts
                    </h3>
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="flex items-center gap-1.5 text-gray-700">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                          অসমীয়া (Assamese)
                        </span>
                        <span className="text-gray-400">Romanized</span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="flex items-center gap-1.5 text-gray-700">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                          বাংলা (Bengali)
                        </span>
                        <span className="text-gray-400">Translits</span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="flex items-center gap-1.5 text-gray-700">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                          हिन्दी (Hindi)
                        </span>
                        <span className="text-gray-400">Devenagari</span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="flex items-center gap-1.5 text-gray-700">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                          English
                        </span>
                        <span className="text-gray-400">Poetic snaps</span>
                      </div>
                    </div>
                  </div>

                  {/* Leaderboard or Contributors */}
                  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs">
                    <h3 className="font-display font-bold text-sm text-gray-900 border-b border-gray-100 pb-2 mb-3 tracking-tight">
                      Community Leaders
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center font-bold text-xs uppercase font-display">
                          BH
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-800">Bhupen_Hazarika_Archives</div>
                          <div className="text-[10px] text-gray-400">18 submissions, 42 translations</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-teal-100 text-teal-800 rounded-full flex items-center justify-center font-bold text-xs uppercase font-display">
                          RF
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-800">Rabindra_Fan_99</div>
                          <div className="text-[10px] text-gray-400">12 submissions, 32 comments</div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </motion.div>
          )}

          {/* PAGE 2: Song Details Page */}
          {currentPage === 'song-details' && selectedSong && (
            <motion.div
              key="song-details"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Navigation Back */}
              <button
                onClick={() => { setCurrentPage('home'); handleRefreshSong(); }}
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-800 bg-emerald-50 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
                id="back-to-home-btn"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Discovery
              </button>

              {/* Song Header Card */}
              <div className="bg-white border border-gray-100 rounded-3xl p-5 sm:p-7 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                        <Globe2 className="w-3.5 h-3.5" />
                        {selectedSong.language}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                        {selectedSong.genre}
                      </span>
                    </div>

                    <h1 className="font-display font-bold text-2xl sm:text-3xl text-gray-950 tracking-tight leading-tight">
                      {selectedSong.title}
                    </h1>
                    
                    <p className="text-sm font-semibold text-gray-600">
                      by <span className="text-emerald-600">{selectedSong.artist}</span> 
                      {selectedSong.album && <span> • Album: <span className="font-medium text-gray-700">{selectedSong.album}</span></span>} 
                      {selectedSong.releaseYear && <span> • Year: <span className="font-medium text-gray-700">{selectedSong.releaseYear}</span></span>}
                    </p>
                  </div>

                  {/* Actions (Upvote, Favorite, Wiki Edit) */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      onClick={handleToggleSongUpvote}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        selectedSong.upvotedBy?.includes(currentUser?.uid || "guest-user")
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'
                      }`}
                      id="song-upvote-btn"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      Upvote ({selectedSong.upvotesCount})
                    </button>

                    <button
                      onClick={handleToggleFavorite}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        currentUser?.favorites?.includes(selectedSong.id)
                          ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                          : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'
                      }`}
                      id="song-fav-btn"
                    >
                      <BookHeart className="w-4 h-4" />
                      {currentUser?.favorites?.includes(selectedSong.id) ? "Favorited" : "Favorite"}
                    </button>

                    <button
                      onClick={() => setIsEditingLyrics(!isEditingLyrics)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        isEditingLyrics
                          ? 'bg-slate-800 text-white border-slate-800'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-100 hover:bg-emerald-100/50'
                      }`}
                      id="song-wiki-edit-btn"
                    >
                      <Edit3 className="w-4 h-4" />
                      Wiki Edit Lyrics
                    </button>

                    <button
                      onClick={() => setReportingSong(true)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 border border-transparent rounded-xl transition-colors cursor-pointer"
                      title="Flag/Report lyrics accuracy"
                      id="song-report-btn"
                    >
                      <AlertTriangle className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Optional YouTube embed */}
                {selectedSong.youtubeLink && (
                  <div className="mt-5 pt-5 border-t border-gray-50">
                    <div className="flex items-center gap-2 text-xs font-bold text-red-600 mb-3 uppercase tracking-wider font-mono">
                      <Youtube className="w-4 h-4" />
                      Listen Along
                    </div>
                    {/* Standard YouTube safe link display / link button */}
                    <div className="bg-slate-50 border border-gray-100 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <span className="text-xs text-gray-500">
                        Official video or audio representation of the song is linked by the community:
                      </span>
                      <a
                        href={selectedSong.youtubeLink}
                        target="_blank"
                        referrerPolicy="no-referrer"
                        className="bg-red-600 hover:bg-red-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors inline-flex items-center gap-2 cursor-pointer"
                      >
                        <Youtube className="w-4 h-4" />
                        Open on YouTube
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Wiki Editor Panel (Conditional) */}
              <AnimatePresence>
                {isEditingLyrics && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <form onSubmit={handleWikiEditSubmit} className="bg-slate-900 text-white rounded-3xl p-5 sm:p-7 shadow-xl space-y-4 border border-slate-800">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <h3 className="font-display font-semibold text-base text-slate-100 flex items-center gap-1.5">
                          <Edit3 className="w-4 h-4 text-emerald-400" />
                          Wiki Lyrics Editor (Attributed)
                        </h3>
                        <button
                          type="button"
                          onClick={() => setIsEditingLyrics(false)}
                          className="text-slate-400 hover:text-slate-200 text-xs font-mono"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {/* Lyrics editor */}
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Original Lyrics</label>
                          <textarea
                            value={editLyricsText}
                            onChange={(e) => setEditLyricsText(e.target.value)}
                            className="w-full h-80 bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm font-sans text-slate-100 resize-none outline-none focus:border-emerald-500 transition-colors"
                            required
                          />
                        </div>

                        {/* Translit editor */}
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Transliteration (Optional)</label>
                          <textarea
                            value={editTranslitText}
                            onChange={(e) => setEditTranslitText(e.target.value)}
                            className="w-full h-80 bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm font-sans text-slate-100 resize-none outline-none focus:border-emerald-500 transition-colors"
                            placeholder="Phonetic Roman text to sing along..."
                          />
                        </div>

                        {/* Translation editor */}
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Translation (Optional)</label>
                          <textarea
                            value={editTranslationText}
                            onChange={(e) => setEditTranslationText(e.target.value)}
                            className="w-full h-80 bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm font-sans text-slate-100 resize-none outline-none focus:border-emerald-500 transition-colors"
                            placeholder="Line-by-line translation..."
                          />
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="w-full sm:max-w-md">
                          <input
                            type="text"
                            value={editNotesText}
                            onChange={(e) => setEditNotesText(e.target.value)}
                            placeholder="Briefly explain your improvements (e.g. 'Corrected verse 3 spelling', 'Added English translation')"
                            className="w-full bg-slate-850 border border-slate-750 text-slate-100 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-emerald-500 transition-colors"
                            required
                            id="edit-notes-input"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={isSavingEdits}
                          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm w-full sm:w-auto"
                          id="save-wiki-edit-btn"
                        >
                          {isSavingEdits ? "Saving..." : "Save Revision"}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Workspace Main split grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left side: Lyrics (lg:col-span-7) */}
                <div className="lg:col-span-7 space-y-6">
                  <LyricsDisplay
                    song={selectedSong}
                    onSelectLine={setSelectedLine}
                    selectedLine={selectedLine}
                  />

                  {/* Version history log */}
                  <VersionHistory
                    song={selectedSong}
                    onRefreshSong={handleRefreshSong}
                  />
                </div>

                {/* Right side: AI helpers & Discussion (lg:col-span-5) */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* Gemini Helper */}
                  <LyricsHelper
                    song={selectedSong}
                    selectedLine={selectedLine}
                    onSelectLine={setSelectedLine}
                    currentUser={currentUser}
                    onUpdateLyrics={async (updates) => {
                      // Updates without wiki prompt
                      await editSongLyrics(
                        selectedSong.id,
                        updates,
                        "gemini-assistant",
                        "Gemini Assistant",
                        "Auto-generated lyrics helper content"
                      );
                      handleRefreshSong();
                    }}
                  />

                  {/* Discussion comment feed */}
                  <DiscussionSection
                    song={selectedSong}
                    currentUser={currentUser}
                    selectedLine={selectedLine}
                    onClearSelectedLine={() => setSelectedLine(null)}
                    onRefreshSong={handleRefreshSong}
                  />

                </div>

              </div>
            </motion.div>
          )}

          {/* PAGE 3: Submit Lyrics (Add Song) */}
          {currentPage === 'add-song' && (
            <motion.div
              key="add-song"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h1 className="font-display font-bold text-xl sm:text-2xl text-gray-950 tracking-tight flex items-center gap-2">
                  <Plus className="w-6 h-6 text-emerald-600" />
                  Submit Song Lyrics
                </h1>
                <button
                  onClick={() => setCurrentPage('home')}
                  className="text-xs font-semibold text-gray-500 hover:text-gray-900 bg-gray-100 px-3 py-1.5 rounded-lg"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleAddSongSubmit} className="space-y-6 bg-white border border-gray-100 rounded-3xl p-5 sm:p-8 shadow-xs">
                {/* Basic Metadata */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Song Title *</label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Pratidhwani"
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:bg-white focus:border-emerald-300 transition-all text-gray-800"
                      required
                      id="new-song-title"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Artist / Band *</label>
                    <input
                      type="text"
                      value={newArtist}
                      onChange={(e) => setNewArtist(e.target.value)}
                      placeholder="e.g. Dr. Bhupen Hazarika"
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:bg-white focus:border-emerald-300 transition-all text-gray-800"
                      required
                      id="new-song-artist"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Language *</label>
                    <select
                      value={newLanguage}
                      onChange={(e) => setNewLanguage(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 text-sm outline-none focus:bg-white focus:border-emerald-300 transition-all text-gray-800"
                      id="new-song-language"
                    >
                      <option value="Assamese">অসমীয়া (Assamese)</option>
                      <option value="Bengali">বাংলা (Bengali)</option>
                      <option value="Hindi">हिन्दी (Hindi)</option>
                      <option value="English">English</option>
                      <option value="Sanskrit">Sanskrit</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Genre *</label>
                    <select
                      value={newGenre}
                      onChange={(e) => setNewGenre(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 text-sm outline-none focus:bg-white focus:border-emerald-300 transition-all text-gray-800"
                      id="new-song-genre"
                    >
                      <option value="Folk">Folk</option>
                      <option value="Classic">Classic</option>
                      <option value="Rabindra Sangeet">Rabindra Sangeet</option>
                      <option value="Sufi Pop">Sufi Pop</option>
                      <option value="Classic Rock">Classic Rock</option>
                      <option value="Pop">Pop</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Album / Soundtrack</label>
                    <input
                      type="text"
                      value={newAlbum}
                      onChange={(e) => setNewAlbum(e.target.value)}
                      placeholder="e.g. Pratidhwani"
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none text-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Release Year</label>
                    <input
                      type="number"
                      value={newReleaseYear}
                      onChange={(e) => setNewReleaseYear(Number(e.target.value))}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none text-gray-800"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">YouTube Audio/Video Link</label>
                    <input
                      type="url"
                      value={newYoutube}
                      onChange={(e) => setNewYoutube(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none text-gray-800"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Tags (Comma-separated)</label>
                    <input
                      type="text"
                      value={newTags}
                      onChange={(e) => setNewTags(e.target.value)}
                      placeholder="e.g. classic, philosophical, peaceful"
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none text-gray-800 font-mono text-xs"
                    />
                  </div>
                </div>

                {/* Lyrics Creator Textareas */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Original Lyrics *</label>
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleGenerateInCreator('translit')}
                          disabled={generationLoading !== null}
                          className="text-[10px] bg-slate-900 text-white font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 hover:bg-slate-800 disabled:opacity-50"
                        >
                          {generationLoading === 'translit' ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Sparkles className="w-3 h-3 text-emerald-400" />
                          )}
                          AI Transliterate
                        </button>
                        <button
                          type="button"
                          onClick={() => handleGenerateInCreator('translation')}
                          disabled={generationLoading !== null}
                          className="text-[10px] bg-slate-900 text-white font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 hover:bg-slate-800 disabled:opacity-50"
                        >
                          {generationLoading === 'translation' ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Sparkles className="w-3 h-3 text-emerald-400" />
                          )}
                          AI Translate (English)
                        </button>
                      </div>
                    </div>
                    <textarea
                      value={newLyrics}
                      onChange={(e) => setNewLyrics(e.target.value)}
                      placeholder="Paste lyrics formatted by verse and chorus here... Use [Verse 1], [Chorus] headings if wanted."
                      className="w-full h-48 bg-gray-50 border border-gray-100 focus:bg-white rounded-xl p-3.5 text-sm text-gray-800 resize-none outline-none focus:border-emerald-300 transition-all"
                      required
                      id="new-lyrics-textarea"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Transliteration (Romanised Script)</label>
                      <textarea
                        value={newTranslit}
                        onChange={(e) => setNewTranslit(e.target.value)}
                        placeholder="Phonetic Roman text generated automatically or custom edited..."
                        className="w-full h-32 bg-gray-50 border border-gray-100 rounded-xl p-3 text-xs sm:text-sm text-gray-800 resize-none outline-none focus:border-emerald-300 transition-all font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Translation</label>
                      <textarea
                        value={newTranslation}
                        onChange={(e) => setNewTranslation(e.target.value)}
                        placeholder="Poetic or prose translation..."
                        className="w-full h-32 bg-gray-50 border border-gray-100 rounded-xl p-3 text-xs sm:text-sm text-gray-800 resize-none outline-none focus:border-emerald-300 transition-all font-sans"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-5 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentPage('home')}
                    className="text-xs font-bold text-gray-500 hover:bg-gray-100 px-4 py-2.5 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingSong}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-colors cursor-pointer"
                    id="submit-song-creator-btn"
                  >
                    {isSubmittingSong ? "Publishing..." : "Publish Song"}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* PAGE 4: User Profile Page */}
          {currentPage === 'profile' && currentUser && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl w-fit cursor-pointer" onClick={() => setCurrentPage('home')}>
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </div>

              {/* Profile Card */}
              <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-700 font-display font-bold text-3xl uppercase flex items-center justify-center border-2 border-emerald-100">
                  {currentUser.displayName.slice(0, 2)}
                </div>
                <div className="grow space-y-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2.5">
                    <h1 className="font-display font-bold text-2xl text-gray-950 tracking-tight">{currentUser.displayName}</h1>
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-mono">
                      {currentUser.role || 'User'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-400 font-mono">{currentUser.email}</p>
                  <p className="text-sm text-gray-600 italic font-medium leading-relaxed max-w-lg">
                    "{currentUser.bio || "No profile bio written yet."}"
                  </p>
                </div>
              </div>

              {/* Favorites & Submissions List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Favorites */}
                <div className="bg-white border border-gray-100 rounded-3xl p-5 sm:p-6 shadow-xs">
                  <h3 className="font-display font-bold text-base text-gray-900 border-b border-gray-100 pb-2 mb-4 tracking-tight flex items-center gap-1.5">
                    <BookHeart className="w-4 h-4 text-emerald-600" />
                    Bookmarked Songs
                  </h3>
                  {(!currentUser.favorites || currentUser.favorites.length === 0) ? (
                    <p className="text-xs text-gray-400 italic py-6 text-center">No bookmarked songs yet.</p>
                  ) : (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                      {currentUser.favorites.map(songId => {
                        const sObj = songs.find(s => s.id === songId);
                        if (!sObj) return null;
                        return (
                          <div
                            key={songId}
                            onClick={() => handleSelectSong(songId)}
                            className="p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-emerald-200 cursor-pointer flex items-center justify-between text-left transition-colors"
                          >
                            <div>
                              <div className="text-xs font-bold text-gray-900 line-clamp-1">{sObj.title}</div>
                              <div className="text-[10px] text-gray-500 font-medium">{sObj.artist}</div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-300" />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Submissions/Edits activity */}
                <div className="bg-white border border-gray-100 rounded-3xl p-5 sm:p-6 shadow-xs">
                  <h3 className="font-display font-bold text-base text-gray-900 border-b border-gray-100 pb-2 mb-4 tracking-tight flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-emerald-600" />
                    Your Contributions
                  </h3>
                  <div className="space-y-3.5 text-xs text-gray-600 font-medium py-3">
                    <div className="flex justify-between items-center bg-gray-50/50 p-2.5 rounded-xl border border-gray-100">
                      <span>Joined Community:</span>
                      <strong className="text-gray-800 font-mono">{new Date(currentUser.createdAt).toLocaleDateString()}</strong>
                    </div>
                    <div className="flex justify-between items-center bg-gray-50/50 p-2.5 rounded-xl border border-gray-100">
                      <span>Wiki role tier:</span>
                      <strong className="text-emerald-700 capitalize font-mono">{currentUser.role || 'User'}</strong>
                    </div>
                    <div className="flex justify-between items-center bg-gray-50/50 p-2.5 rounded-xl border border-gray-100">
                      <span>Saved items count:</span>
                      <strong className="text-gray-800 font-mono">{currentUser.favorites?.length || 0}</strong>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* PAGE 5: Moderator Board */}
          {currentPage === 'moderator-board' && (
            <motion.div
              key="moderator-board"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h1 className="font-display font-bold text-xl sm:text-2xl text-red-700 tracking-tight flex items-center gap-2">
                  <ShieldAlert className="w-6 h-6" />
                  Moderator Queue & Flagged Content
                </h1>
                <button
                  onClick={() => setCurrentPage('home')}
                  className="text-xs font-semibold text-gray-500 hover:text-gray-900 bg-gray-100 px-3 py-1.5 rounded-lg"
                >
                  Back
                </button>
              </div>

              {flagsLoading ? (
                <div className="text-center py-10 text-gray-400">Loading flagged reports...</div>
              ) : flags.length === 0 ? (
                <div className="bg-white border border-gray-100 rounded-3xl p-10 text-center text-gray-400">
                  Excellent! The moderation queue is currently empty. No pending flags.
                </div>
              ) : (
                <div className="space-y-4">
                  {flags.map(flag => {
                    const isPending = flag.status === 'pending';
                    return (
                      <div 
                        key={flag.id} 
                        className={`bg-white border border-gray-100 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row justify-between gap-4 items-start ${
                          !isPending ? 'opacity-60' : ''
                        }`}
                      >
                        <div className="space-y-1.5 grow">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              flag.type === 'song' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                            }`}>
                              Flagged {flag.type}
                            </span>
                            <span className={`text-[10px] font-bold font-mono tracking-wider px-2 py-0.5 rounded-full capitalize ${
                              isPending ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-500'
                            }`}>
                              {flag.status}
                            </span>
                          </div>

                          <h3 className="font-bold text-sm text-gray-900">
                            Reason: {flag.reason}
                          </h3>
                          
                          <p className="text-xs text-gray-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-gray-100">
                            <strong>Reporter details:</strong> {flag.details || "No details provided."}
                          </p>

                          <div className="text-[10px] text-gray-400 font-mono">
                            Reported by <strong>{flag.reportedByUsername}</strong> on {new Date(flag.createdAt).toLocaleDateString()}
                          </div>
                        </div>

                        {isPending && (
                          <div className="flex gap-2 shrink-0 md:self-center">
                            <button
                              onClick={() => handleResolveFlag(flag.id, 'dismiss')}
                              className="text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
                            >
                              Dismiss (Keep Content)
                            </button>
                            <button
                              onClick={() => handleResolveFlag(flag.id, 'resolve')}
                              className="text-xs font-semibold bg-red-600 hover:bg-red-500 text-white px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
                            >
                              Resolve (Hide Content)
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Global Lyrics Reporter Modal */}
      {reportingSong && selectedSong && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
              <h3 className="font-display font-semibold text-base text-gray-900 flex items-center gap-1.5">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Report Lyrics Inaccuracy
              </h3>
              <button 
                onClick={() => setReportingSong(false)}
                className="text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSongFlagSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Type of Discrepancy
                </label>
                <select
                  value={songFlagReason}
                  onChange={(e) => setSongFlagReason(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-red-500 transition-colors"
                  required
                >
                  <option value="">Select reason...</option>
                  <option value="Severe Spelling/Type typos">Typo typos / incorrect lyrics lines</option>
                  <option value="Highly Inaccurate Translation">Inaccurate or offensive translation</option>
                  <option value="Incorrect Song Metadata">Incorrect metadata (Artist, Album, Year)</option>
                  <option value="Copyright/Trademark Violation">Copyright takedown requests</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Detailed Explanation
                </label>
                <textarea
                  value={songFlagDetails}
                  onChange={(e) => setSongFlagDetails(e.target.value)}
                  placeholder="Reference the incorrect line or explain the legal/spelling discrepancy here..."
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 text-sm text-gray-800 h-28 resize-none outline-none focus:border-red-500 transition-colors"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-50">
                <button
                  type="button"
                  onClick={() => setReportingSong(false)}
                  className="text-xs font-medium text-gray-500 hover:bg-gray-100 px-4 py-2.5 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingSongFlag}
                  className="bg-red-600 hover:bg-red-500 disabled:bg-slate-400 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  {isSubmittingSongFlag ? "Sending Report..." : "Submit Report"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Auth (Sign In / Register) Modal Dialog */}
      {authModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-slate-100 relative">
            <button 
              onClick={() => { setAuthModalOpen(false); resetAuthForm(); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-3 shadow-md shadow-emerald-500/10">
                <Music className="w-6 h-6 text-white" />
              </div>
              <h2 className="font-display font-bold text-xl text-gray-950 tracking-tight">
                {authMode === 'login' ? "Welcome to Xur" : "Create Xur Account"}
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                {authMode === 'login' ? "Sign in to edit lyrics, translate, and discuss meaning" : "Sign up and build your translation profile"}
              </p>
            </div>

            {/* Error alerts */}
            {authError && (
              <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl p-3 text-xs mb-4 leading-relaxed font-medium">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' && (
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Display Name</label>
                  <input
                    type="text"
                    value={authDisplayName}
                    onChange={(e) => setAuthDisplayName(e.target.value)}
                    placeholder="e.g. Joyjeet"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-sm outline-none text-gray-800"
                    required
                    id="auth-reg-name"
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Email Address</label>
                <input
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-sm outline-none text-gray-800"
                  required
                  id="auth-email-input"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Password</label>
                <input
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-sm outline-none text-gray-800"
                  required
                  id="auth-pass-input"
                />
              </div>

              {authMode === 'register' && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Short Bio</label>
                    <input
                      type="text"
                      value={authBio}
                      onChange={(e) => setAuthBio(e.target.value)}
                      placeholder="Avid lyrics translator..."
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-sm outline-none text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">System Role Tier</label>
                    <select
                      value={authRole}
                      onChange={(e) => setAuthRole(e.target.value as any)}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm outline-none text-gray-800"
                    >
                      <option value="user">User Contributor</option>
                      <option value="moderator">Official Moderator (Review flags)</option>
                    </select>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-400 text-white font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer shadow-sm shadow-emerald-900/5 mt-2"
                id="auth-submit-btn"
              >
                {authLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mx-auto text-emerald-200" />
                ) : (
                  authMode === 'login' ? "Sign In" : "Sign Up"
                )}
              </button>
            </form>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                className="text-xs text-emerald-600 hover:text-emerald-800 font-semibold"
              >
                {authMode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
              </button>
            </div>

            {/* Quick Demologin (Zerodelay test capability) */}
            <div className="border-t border-gray-100 pt-4 mt-4 text-center">
              <span className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                Quick Test Login (No Password)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('user')}
                  className="bg-gray-50 hover:bg-emerald-50/50 border border-gray-100 text-[10px] font-bold text-emerald-700 py-2 rounded-xl transition-colors cursor-pointer"
                  id="auth-demo-user-btn"
                >
                  Login as Contributor
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('moderator')}
                  className="bg-gray-50 hover:bg-red-50/50 border border-gray-100 text-[10px] font-bold text-red-700 py-2 rounded-xl transition-colors cursor-pointer"
                  id="auth-demo-mod-btn"
                >
                  Login as Moderator
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-6 mt-12 text-center text-xs text-gray-400 font-medium">
        <p>© 2026 সুৰ (Xur) Lyrics & Music Community. All rights reserved.</p>
        <p className="mt-1 text-[10px] text-gray-300">Empowered by Gemini AI Studio & Firebase</p>
      </footer>

    </div>
  );
}
