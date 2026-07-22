import React, { useState } from 'react';
import brandLogo from '../assets/images/brand_logo_1784387163973.jpg';
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
  Sparkles
} from 'lucide-react';
import { UserProfile, UserFeedback } from '../types';
import ProfilePanel from './ProfilePanel';

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
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20 gap-4">
          
          {/* Logo */}
          <div 
            onClick={() => { onNavigate('home'); setSelectedLanguage('All'); setSelectedGenre('All'); setSearchText(''); }}
            className="flex items-center gap-2.5 cursor-pointer shrink-0 group"
            id="nav-logo"
          >
            <div className="w-11 h-11 rounded-xl overflow-hidden border border-rose-100/80 flex items-center justify-center bg-[#FFF5F6] shadow-xs group-hover:scale-105 group-hover:border-rose-200 transition-all">
              <img 
                src={brandLogo} 
                alt="Xur Logo" 
                className="w-full h-full object-contain p-0.5"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="font-display font-bold text-lg sm:text-xl text-gray-900 tracking-tight block">
                সুৰ <span className="text-emerald-600 font-medium">(Xur)</span>
              </span>
              <span className="text-[9px] font-semibold text-gray-400 font-mono tracking-widest uppercase block -mt-1">
                Melody Community
              </span>
            </div>
          </div>

          {/* Search bar (Center-left) */}
          {currentPage === 'home' && (
            <div className="hidden md:flex items-center relative max-w-md w-full shrink">
              <Search className="absolute left-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchText}
                onChange={handleSearchChange}
                placeholder="Search songs, artists, lyrics, albums..."
                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 pl-10 pr-4 text-sm text-gray-800 outline-none focus:bg-white focus:border-emerald-300 focus:ring-2 focus:ring-emerald-50 transition-all placeholder-gray-400"
                id="search-input-desktop"
              />
            </div>
          )}

          {/* Actions & User State (Right) */}
          <div className="hidden md:flex items-center gap-3">
            {/* Submit Song button */}
            <button
              onClick={() => onNavigate('add-song')}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-2 px-4 rounded-xl transition-all cursor-pointer shadow-sm shadow-emerald-900/5 hover:-translate-y-0.5"
              id="nav-submit-song-btn"
            >
              <Plus className="w-4 h-4" />
              Submit Lyrics
            </button>

            {/* Moderator board link */}
            {currentUser && (currentUser.role === 'moderator' || currentUser.role === 'admin') && (
              <button
                onClick={() => onNavigate('moderator-board')}
                className={`flex items-center gap-1.5 font-semibold text-xs py-2 px-3.5 rounded-xl border transition-all cursor-pointer ${
                  currentPage === 'moderator-board'
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : 'text-red-600 border-red-100 hover:bg-red-50/50'
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
                  className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition-all cursor-pointer"
                  title="Logout"
                  id="nav-logout-btn"
                >
                  <LogOut className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setProfilePanelOpen(true)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    profilePanelOpen
                      ? 'bg-emerald-50 text-emerald-700 font-bold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  id="nav-profile-btn"
                >
                  {currentUser.avatarUrl ? (
                    <img 
                      src={currentUser.avatarUrl} 
                      alt="" 
                      className="w-5 h-5 rounded-full object-cover border border-emerald-500/20" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <User className="w-4 h-4 text-emerald-600" />
                  )}
                  {currentUser.displayName}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="text-gray-600 hover:text-emerald-600 font-semibold text-xs py-2 px-3 rounded-xl transition-colors cursor-pointer"
                  id="nav-login-trigger"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-2 px-3.5 rounded-xl transition-all cursor-pointer shadow-xs"
                  id="nav-register-trigger"
                >
                  <Sparkles className="w-3.5 h-3.5" />
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
                className="p-2 text-red-600 bg-red-50 rounded-xl"
              >
                <ShieldAlert className="w-4 h-4" />
              </button>
            )}

            {/* Profile/Auth Button on Mobile Header */}
            {currentUser ? (
              <button
                onClick={() => setProfilePanelOpen(true)}
                className="p-1 rounded-full border border-emerald-500/20 hover:bg-emerald-50 transition-all cursor-pointer flex items-center justify-center shrink-0"
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
                  <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs uppercase">
                    {currentUser.displayName.slice(0, 2)}
                  </div>
                )}
              </button>
            ) : (
              <button
                onClick={() => onOpenAuth('login')}
                className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-gray-50 rounded-xl transition-all cursor-pointer shrink-0"
                title="Sign In"
                id="nav-mobile-signin-btn"
              >
                <User className="w-4.5 h-4.5" />
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-gray-50 text-gray-500 rounded-xl transition-all cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Filters bar for Discovery Page (Desktop Only) */}
      {currentPage === 'home' && (
        <div className="bg-gray-50/50 border-t border-gray-50 py-3 px-4 sm:px-6 lg:px-8 hidden md:block">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
            
            {/* Language filter buttons */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider font-mono mr-1">
                Languages:
              </span>
              {LANGUAGES.map(lang => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`text-[11px] font-semibold px-3 py-1 rounded-full border transition-all cursor-pointer ${
                    selectedLanguage === lang
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-100 hover:text-gray-800'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Genre filter buttons */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider font-mono mr-1">
                Genres:
              </span>
              {GENRES.map(genre => (
                <button
                  key={genre}
                  onClick={() => handleGenreChange(genre)}
                  className={`text-[11px] font-semibold px-3 py-1 rounded-full border transition-all cursor-pointer ${
                    selectedGenre === genre
                      ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                      : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-100 hover:text-gray-800'
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
        <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-4 animate-fade-in shadow-lg">
          {currentPage === 'home' && (
            <div className="relative">
              <Search className="absolute left-3 w-4 h-4 text-gray-400 top-2.5" />
              <input
                type="text"
                value={searchText}
                onChange={handleSearchChange}
                placeholder="Search lyrics..."
                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 pl-9 pr-4 text-xs"
              />
            </div>
          )}

          {/* Quick Submit */}
          <button
            onClick={() => { onNavigate('add-song'); setMobileMenuOpen(false); }}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white font-semibold text-xs py-2.5 px-4 rounded-xl"
          >
            <Plus className="w-4 h-4" />
            Submit Lyrics
          </button>

          {/* Profile Controls */}
          {currentUser ? (
            <div className="space-y-2 pt-2 border-t border-gray-50">
              <button
                onClick={() => { setProfilePanelOpen(true); setMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-semibold py-2.5 rounded-xl cursor-pointer"
              >
                {currentUser.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt="" className="w-5 h-5 rounded-full object-cover border border-emerald-500/10" referrerPolicy="no-referrer" />
                ) : (
                  <User className="w-4 h-4 text-emerald-600" />
                )}
                {currentUser.displayName} (Account Menu)
              </button>
              <button
                onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-1.5 border border-gray-100 text-gray-500 hover:text-gray-800 text-xs font-semibold py-2.5 rounded-xl cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pt-2 border-t border-gray-50">
              <button
                onClick={() => { onOpenAuth('login'); setMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-1.5 border border-emerald-500 text-emerald-600 text-xs font-semibold py-2.5 rounded-xl cursor-pointer"
              >
                <User className="w-4 h-4" />
                Sign In
              </button>
              <button
                onClick={() => { onOpenAuth('register'); setMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-1.5 bg-emerald-600 text-white text-xs font-semibold py-2.5 rounded-xl cursor-pointer hover:bg-emerald-500 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Create Account
              </button>
            </div>
          )}

          {/* Filters (Mobile view select options) */}
          {currentPage === 'home' && (
            <div className="space-y-2 pt-3 border-t border-gray-100">
              <div className="flex gap-2 items-center">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider font-mono shrink-0">Language:</span>
                <select
                  value={selectedLanguage}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="bg-gray-50 text-gray-700 border border-gray-100 rounded-lg text-xs p-1.5 grow outline-none"
                >
                  {LANGUAGES.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 items-center">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider font-mono shrink-0">Genre:</span>
                <select
                  value={selectedGenre}
                  onChange={(e) => handleGenreChange(e.target.value)}
                  className="bg-gray-50 text-gray-700 border border-gray-100 rounded-lg text-xs p-1.5 grow outline-none"
                >
                  {GENRES.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
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
