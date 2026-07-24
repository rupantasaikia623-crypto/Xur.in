import React, { useState } from 'react';
import brandLogo from '../assets/images/app_logo_wave_1784874601917.jpg';
import { 
  Globe2, 
  Search, 
  User, 
  Plus, 
  LogOut, 
  ShieldAlert, 
  BookHeart,
  Music,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  Shield
} from 'lucide-react';
import { UserProfile, UserFeedback } from '../types';
import ProfilePanel from './ProfilePanel';
import { useContentProtection } from './ContentProtection';

interface NavbarProps {
  onSearch: (text: string) => void;
  onLanguageFilter: (lang: string) => void;
  onGenreFilter: (genre: string) => void;
  onNavigate: (page: string, songId?: string) => void;
  currentPage: string;
  currentUser: UserProfile | null;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onLogout: () => void;
  onUpdateProfile: (updatedProfile: Partial<UserProfile>) => Promise<void>;
  feedbacks: UserFeedback[];
}

const LANGUAGES = ["All", "Assamese", "Bengali", "Hindi", "English"];
const GENRES = ["All", "Folk", "Classic", "Rabindra Sangeet", "Sufi Pop", "Classic Rock"];

export default function Navbar({
  onSearch,
  onLanguageFilter,
  onGenreFilter,
  onNavigate,
  currentPage,
  currentUser,
  onOpenAuth,
  onLogout,
  onUpdateProfile,
  feedbacks
}: NavbarProps) {
  const [searchText, setSearchText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profilePanelOpen, setProfilePanelOpen] = useState(false);
  const { protectionEnabled, setProtectionEnabled, watermarkText } = useContentProtection();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchText(val);
    onSearch(val);
  };

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    onLanguageFilter(lang === 'All' ? '' : lang);
  };

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
    onGenreFilter(genre === 'All' ? '' : genre);
  };

  return (
    <nav className="bg-[#0b0f19]/80 backdrop-blur-2xl border-b border-white/10 sticky top-0 z-40 shadow-2xl shadow-black/50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20 gap-4">
          
          {/* Logo */}
          <div 
            onClick={() => { onNavigate('home'); setSelectedLanguage('All'); setSelectedGenre('All'); setSearchText(''); }}
            className="flex items-center gap-3 cursor-pointer shrink-0 group"
            id="nav-logo"
          >
            <div className="w-11 h-11 rounded-2xl overflow-hidden border border-emerald-500/30 flex items-center justify-center bg-gradient-to-br from-emerald-900/40 to-slate-900 shadow-md shadow-emerald-500/10 group-hover:scale-105 group-hover:border-emerald-400 group-hover:shadow-emerald-500/20 transition-all shrink-0">
              <img 
                src={brandLogo} 
                alt="Xur Logo" 
                className="w-full h-full object-cover rounded-xl"
                referrerPolicy="no-referrer"
                onError={(e) => { 
                  const target = e.currentTarget as HTMLImageElement;
                  target.onerror = null;
                  target.src = '/logo.jpg'; 
                }}
              />
            </div>
            <div>
              <span className="font-display font-bold text-lg sm:text-xl text-white tracking-tight block group-hover:text-emerald-400 transition-colors">
                সুৰ <span className="text-emerald-400 font-semibold">(Xur)</span>
              </span>
              <span className="text-[9px] font-semibold text-emerald-400/80 font-mono tracking-widest uppercase block -mt-1">
                Lyrics Platform
              </span>
            </div>
          </div>

          {/* Search bar (Center-left) */}
          {currentPage === 'home' && (
            <div className="hidden md:flex items-center relative max-w-md w-full shrink">
              <Search className="absolute left-3.5 w-4 h-4 text-emerald-400/70 pointer-events-none" />
              <input
                type="text"
                value={searchText}
                onChange={handleSearchChange}
                placeholder="Search songs, artists, lyrics, albums..."
                className="w-full bg-slate-900/80 border border-white/10 rounded-2xl py-2 pl-10 pr-4 text-sm text-slate-100 outline-none focus:bg-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition-all placeholder-slate-500 shadow-inner"
                id="search-input-desktop"
              />
            </div>
          )}

          {/* Actions & User State (Right) */}
          <div className="hidden md:flex items-center gap-3">
            {/* Submit Song button */}
            <button
              onClick={() => onNavigate('add-song')}
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs py-2 px-4 rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 hover:-translate-y-0.5 active:translate-y-0"
              id="nav-submit-song-btn"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              Submit Lyrics
            </button>

            {/* Content Protection Toggle Badge */}
            <button
              onClick={() => setProtectionEnabled(!protectionEnabled)}
              className={`hidden xl:flex items-center gap-1.5 font-semibold text-xs py-2 px-3 rounded-xl border transition-all cursor-pointer ${
                protectionEnabled
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20 shadow-xs'
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
              }`}
              title={protectionEnabled ? `XUR DRM Active • ${watermarkText}` : 'Protection Disabled'}
            >
              {protectionEnabled ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>DRM Active</span>
                </>
              ) : (
                <>
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>DRM Off</span>
                </>
              )}
            </button>

            {/* Moderator board link */}
            {currentUser && (currentUser.role === 'moderator' || currentUser.role === 'admin') && (
              <button
                onClick={() => onNavigate('moderator-board')}
                className={`flex items-center gap-1.5 font-semibold text-xs py-2 px-3.5 rounded-xl border transition-all cursor-pointer ${
                  currentPage === 'moderator-board'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-md shadow-rose-500/10'
                    : 'text-rose-400 border-rose-500/20 hover:bg-rose-500/10'
                }`}
                id="nav-mod-btn"
              >
                <ShieldAlert className="w-4 h-4" />
                Mod Board
              </button>
            )}

            {/* Profile or Login */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer"
                  title="Logout"
                  id="nav-logout-btn"
                >
                  <LogOut className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setProfilePanelOpen(true)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                    profilePanelOpen
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                      : 'text-slate-300 border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                  }`}
                  id="nav-profile-btn"
                >
                  {currentUser.avatarUrl ? (
                    <img 
                      src={currentUser.avatarUrl} 
                      alt="" 
                      className="w-5 h-5 rounded-full object-cover border border-emerald-400/40" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <User className="w-4 h-4 text-emerald-400" />
                  )}
                  {currentUser.displayName}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="text-slate-300 hover:text-emerald-400 font-semibold text-xs py-2 px-3 rounded-xl transition-colors cursor-pointer"
                  id="nav-login-trigger"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs py-2 px-3.5 rounded-xl border border-white/15 transition-all cursor-pointer shadow-xs"
                  id="nav-register-trigger"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  Create Account
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger & Profile button */}
          <div className="flex md:hidden items-center gap-2">
            {currentUser && (currentUser.role === 'moderator' || currentUser.role === 'admin') && (
              <button
                onClick={() => onNavigate('moderator-board')}
                className="p-2 text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl"
              >
                <ShieldAlert className="w-4 h-4" />
              </button>
            )}

            {/* Profile/Auth Button on Mobile Header */}
            {currentUser ? (
              <button
                onClick={() => setProfilePanelOpen(true)}
                className="p-1 rounded-full border border-emerald-500/30 hover:bg-emerald-500/10 transition-all cursor-pointer flex items-center justify-center shrink-0"
                title="Account Menu"
                id="nav-mobile-profile-btn"
              >
                {currentUser.avatarUrl ? (
                  <img 
                    src={currentUser.avatarUrl} 
                    alt="" 
                    className="w-7 h-7 rounded-full object-cover" 
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center font-bold text-xs uppercase">
                    {currentUser.displayName.slice(0, 2)}
                  </div>
                )}
              </button>
            ) : (
              <button
                onClick={() => onOpenAuth('login')}
                className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-white/5 rounded-xl transition-all cursor-pointer shrink-0"
                title="Sign In"
                id="nav-mobile-signin-btn"
              >
                <User className="w-4.5 h-4.5" />
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl transition-all cursor-pointer border border-white/10"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-emerald-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Filters bar for Discovery Page (Desktop Only) */}
      {currentPage === 'home' && (
        <div className="bg-slate-950/60 border-t border-white/5 py-2.5 px-4 sm:px-6 lg:px-8 hidden md:block">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
            
            {/* Language filter buttons */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider font-mono mr-1 flex items-center gap-1">
                <Globe2 className="w-3.5 h-3.5 text-emerald-400" /> Languages:
              </span>
              {LANGUAGES.map(lang => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`text-[11px] font-semibold px-3 py-1 rounded-full border transition-all cursor-pointer ${
                    selectedLanguage === lang
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20 font-bold'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Genre filter buttons */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider font-mono mr-1 flex items-center gap-1">
                <Music className="w-3.5 h-3.5 text-teal-400" /> Genres:
              </span>
              {GENRES.map(genre => (
                <button
                  key={genre}
                  onClick={() => handleGenreChange(genre)}
                  className={`text-[11px] font-semibold px-3 py-1 rounded-full border transition-all cursor-pointer ${
                    selectedGenre === genre
                      ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-md shadow-teal-500/20 font-bold'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0c101c]/95 border-t border-white/10 py-5 px-4 space-y-4 animate-fade-in shadow-2xl backdrop-blur-2xl">
          {currentPage === 'home' && (
            <div className="relative">
              <Search className="absolute left-3 w-4 h-4 text-emerald-400 top-2.5" />
              <input
                type="text"
                value={searchText}
                onChange={handleSearchChange}
                placeholder="Search lyrics..."
                className="w-full bg-slate-900 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:border-emerald-500 outline-none"
              />
            </div>
          )}

          {/* Quick Submit */}
          <button
            onClick={() => { onNavigate('add-song'); setMobileMenuOpen(false); }}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs py-2.5 px-4 rounded-xl shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Submit Lyrics
          </button>

          {/* Profile Controls */}
          {currentUser ? (
            <div className="space-y-2 pt-2 border-t border-white/10">
              <button
                onClick={() => { setProfilePanelOpen(true); setMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-1.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-semibold py-2.5 rounded-xl cursor-pointer"
              >
                {currentUser.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt="" className="w-5 h-5 rounded-full object-cover border border-emerald-400/30" referrerPolicy="no-referrer" />
                ) : (
                  <User className="w-4 h-4 text-emerald-400" />
                )}
                {currentUser.displayName} (Account Menu)
              </button>
              <button
                onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-1.5 border border-white/10 text-slate-400 hover:text-white text-xs font-semibold py-2.5 rounded-xl cursor-pointer bg-white/5"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
              <button
                onClick={() => { onOpenAuth('login'); setMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-1.5 border border-emerald-500/30 text-emerald-400 text-xs font-semibold py-2.5 rounded-xl cursor-pointer bg-emerald-500/10"
              >
                <User className="w-4 h-4" />
                Sign In
              </button>
              <button
                onClick={() => { onOpenAuth('register'); setMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-1.5 bg-white/10 text-white border border-white/15 text-xs font-semibold py-2.5 rounded-xl cursor-pointer hover:bg-white/20 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Create Account
              </button>
            </div>
          )}

          {/* Filters (Mobile view select options) */}
          {currentPage === 'home' && (
            <div className="space-y-2 pt-3 border-t border-white/10">
              <div className="flex gap-2 items-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono shrink-0">Language:</span>
                <select
                  value={selectedLanguage}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="bg-slate-900 text-slate-200 border border-white/10 rounded-lg text-xs p-2 grow outline-none focus:border-emerald-500"
                >
                  {LANGUAGES.map(lang => (
                    <option key={lang} value={lang} className="bg-[#0d121f] text-white">{lang}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 items-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono shrink-0">Genre:</span>
                <select
                  value={selectedGenre}
                  onChange={(e) => handleGenreChange(e.target.value)}
                  className="bg-slate-900 text-slate-200 border border-white/10 rounded-lg text-xs p-2 grow outline-none focus:border-teal-500"
                >
                  {GENRES.map(genre => (
                    <option key={genre} value={genre} className="bg-[#0d121f] text-white">{genre}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Render the full account profile details drawer */}
      <ProfilePanel 
        isOpen={profilePanelOpen}
        onClose={() => setProfilePanelOpen(false)}
        currentUser={currentUser}
        onLogout={onLogout}
        onUpdateProfile={onUpdateProfile}
        feedbacks={feedbacks}
      />
    </nav>
  );
}
