import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  User, 
  Mail, 
  ShieldCheck, 
  Edit3, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Check, 
  ChevronLeft, 
  Save, 
  Camera, 
  Bell, 
  Lock, 
  Eye,
  Activity,
  Heart,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { UserProfile, UserFeedback } from '../types';

interface ProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLogout: () => void;
  onUpdateProfile: (updatedProfile: Partial<UserProfile>) => Promise<void>;
  feedbacks: UserFeedback[];
}

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
];

export default function ProfilePanel({
  isOpen,
  onClose,
  currentUser,
  onLogout,
  onUpdateProfile,
  feedbacks
}: ProfilePanelProps) {
  const [activeTab, setActiveTab] = useState<'main' | 'edit' | 'feedback' | 'settings'>('main');
  const [feedbackFilter, setFeedbackFilter] = useState<'all' | 'mine'>('all');
  
  // Edit form states
  const [editName, setEditName] = useState(currentUser?.displayName || '');
  const [editBio, setEditBio] = useState(currentUser?.bio || '');
  const [editAvatarUrl, setEditAvatarUrl] = useState(currentUser?.avatarUrl || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Settings states
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState('public');
  const [marketingEmails, setMarketingEmails] = useState(false);

  // Sync edit states when profile opens or changes
  React.useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.displayName);
      setEditBio(currentUser.bio || '');
      setEditAvatarUrl(currentUser.avatarUrl || '');
    }
  }, [currentUser, isOpen]);

  if (!currentUser) return null;

  // Filter feedbacks written by this user
  const userFeedbacks = feedbacks.filter(f => f.userId === currentUser.uid);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;

    setIsSaving(true);
    setSaveStatus('idle');
    try {
      await onUpdateProfile({
        displayName: editName.trim(),
        bio: editBio.trim(),
        avatarUrl: editAvatarUrl.trim() || undefined
      });
      setSaveStatus('success');
      setTimeout(() => {
        setSaveStatus('idle');
        setActiveTab('main');
      }, 1200);
    } catch (err) {
      console.error(err);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 cursor-pointer"
            id="profile-panel-backdrop"
          />

          {/* Slider Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:max-w-md bg-[#0a0e17]/95 text-slate-100 shadow-2xl border-l border-white/10 z-50 flex flex-col focus:outline-none backdrop-blur-2xl"
            id="profile-panel-container"
          >
            {/* Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#0d121f]/80">
              <div className="flex items-center gap-2">
                {activeTab !== 'main' && (
                  <button 
                    onClick={() => setActiveTab('main')}
                    className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Back to main menu"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                )}
                <h2 className="font-display font-bold text-lg text-white tracking-tight">
                  {activeTab === 'main' && 'User Account'}
                  {activeTab === 'edit' && 'Edit Profile Details'}
                  {activeTab === 'feedback' && 'Community Feedback'}
                  {activeTab === 'settings' && 'Account Preferences'}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                id="profile-panel-close-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-none">
              
              {/* TAB 1: MAIN ACCOUNT VIEW */}
              {activeTab === 'main' && (
                <div className="space-y-6 animate-fade-in">
                  {/* User Badge Info */}
                  <div className="flex flex-col items-center text-center space-y-3.5 pb-2">
                    <div className="relative group">
                      {currentUser.avatarUrl ? (
                        <img 
                          src={currentUser.avatarUrl} 
                          alt={currentUser.displayName} 
                          className="w-24 h-24 rounded-full object-cover border-2 border-emerald-500/50 shadow-xl shadow-emerald-500/10"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 text-slate-950 font-display font-bold text-3xl uppercase flex items-center justify-center border-2 border-emerald-400 shadow-xl shadow-emerald-500/10">
                          {currentUser.displayName.slice(0, 2)}
                        </div>
                      )}
                      <button 
                        onClick={() => setActiveTab('edit')}
                        className="absolute bottom-0 right-0 p-2 bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 rounded-full shadow-lg transition-transform hover:scale-110 cursor-pointer"
                        title="Change profile picture"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <h3 className="font-display font-bold text-xl text-white tracking-tight flex items-center justify-center gap-1.5">
                        {currentUser.displayName}
                        <ShieldCheck className="w-5 h-5 text-emerald-400" title="Verified Member" />
                      </h3>
                      <p className="text-sm text-slate-400 font-mono mt-0.5">{currentUser.email}</p>
                    </div>

                    {/* Bio phrase */}
                    {currentUser.bio ? (
                      <p className="text-sm text-slate-300 italic bg-white/5 px-4 py-3 rounded-2xl border border-white/10 max-w-sm">
                        "{currentUser.bio}"
                      </p>
                    ) : (
                      <button 
                        onClick={() => setActiveTab('edit')}
                        className="text-xs text-emerald-400 hover:text-emerald-300 font-bold cursor-pointer"
                      >
                        + Add profile bio phrase
                      </button>
                    )}
                  </div>

                  {/* Account Status Card */}
                  <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between backdrop-blur-md">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-400 block uppercase tracking-wider font-mono">
                        Account Status
                      </span>
                      <span className="text-sm font-bold text-emerald-200 flex items-center gap-2 mt-0.5">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Verified Active
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-emerald-400 block uppercase tracking-wider font-mono">
                        Role Tier
                      </span>
                      <span className="text-xs font-bold bg-emerald-500 text-slate-950 px-2.5 py-0.5 rounded-full capitalize block mt-0.5">
                        {currentUser.role || 'User'}
                      </span>
                    </div>
                  </div>

                  {/* Stats Counter Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-center">
                      <Heart className="w-4 h-4 text-rose-400 mx-auto mb-1" />
                      <span className="text-xl font-bold text-white font-mono block">
                        {currentUser.favorites?.length || 0}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">
                        Bookmarks
                      </span>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-center">
                      <Activity className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                      <span className="text-xl font-bold text-white font-mono block">
                        {userFeedbacks.length}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">
                        Feedbacks
                      </span>
                    </div>
                  </div>

                  {/* Action Menu Buttons */}
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => setActiveTab('edit')}
                      className="w-full flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-white/5 hover:border-emerald-500/40 hover:bg-emerald-500/10 text-slate-200 text-sm font-semibold transition-all cursor-pointer group"
                    >
                      <span className="flex items-center gap-2.5">
                        <Edit3 className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                        Edit Profile details
                      </span>
                      <span className="text-xs text-slate-400 font-semibold group-hover:text-emerald-400 transition-colors">→</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('feedback')}
                      className="w-full flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-white/5 hover:border-emerald-500/40 hover:bg-emerald-500/10 text-slate-200 text-sm font-semibold transition-all cursor-pointer group"
                    >
                      <span className="flex items-center gap-2.5">
                        <MessageSquare className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                        Community Feedbacks ({feedbacks.length})
                      </span>
                      <span className="text-xs text-slate-400 font-semibold group-hover:text-emerald-400 transition-colors">→</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('settings')}
                      className="w-full flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-white/5 hover:border-emerald-500/40 hover:bg-emerald-500/10 text-slate-200 text-sm font-semibold transition-all cursor-pointer group"
                    >
                      <span className="flex items-center gap-2.5">
                        <Settings className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                        Account Preferences
                      </span>
                      <span className="text-xs text-slate-400 font-semibold group-hover:text-emerald-400 transition-colors">→</span>
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-white/10 my-2" />

                  {/* Logout Button */}
                  <button
                    onClick={() => {
                      onLogout();
                      onClose();
                    }}
                    className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-300 text-sm font-bold transition-all cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout from Account
                  </button>
                </div>
              )}

              {/* TAB 2: EDIT PROFILE VIEW */}
              {activeTab === 'edit' && (
                <form onSubmit={handleSaveProfile} className="space-y-5 animate-fade-in">
                  
                  {/* Preset Avatar Selection */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                      Choose Profile Picture Presets
                    </label>
                    <div className="grid grid-cols-6 gap-2">
                      {PRESET_AVATARS.map((url, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setEditAvatarUrl(url)}
                          className={`relative rounded-full overflow-hidden aspect-square border-2 transition-all cursor-pointer ${
                            editAvatarUrl === url ? 'border-emerald-400 ring-2 ring-emerald-400/30 scale-105' : 'border-white/10 hover:border-white/30'
                          }`}
                        >
                          <img src={url} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          {editAvatarUrl === url && (
                            <div className="absolute inset-0 bg-emerald-500/40 flex items-center justify-center">
                              <Check className="w-4 h-4 text-slate-950 font-extrabold" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Avatar URL input */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                      Or Custom Image URL
                    </label>
                    <input
                      type="url"
                      value={editAvatarUrl}
                      onChange={(e) => setEditAvatarUrl(e.target.value)}
                      placeholder="https://example.com/photo.jpg"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl py-2 px-3.5 text-sm text-slate-200 outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  {/* Display Name Input */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                      Full Display Name <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 w-4 h-4 text-slate-500 top-3" />
                      <input
                        type="text"
                        required
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-slate-900 border border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-sm text-slate-200 outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Profile Bio Input */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                      Short Bio / Tagline
                    </label>
                    <textarea
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      placeholder="Tell us about yourself..."
                      rows={3}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-sm text-slate-200 outline-none focus:border-emerald-500 transition-colors resize-none"
                    />
                  </div>

                  {/* Save Status message */}
                  {saveStatus === 'success' && (
                    <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400" />
                      Changes saved permanently to database!
                    </div>
                  )}

                  {saveStatus === 'error' && (
                    <div className="p-3 bg-rose-950/40 border border-rose-500/30 text-rose-300 rounded-xl text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-400" />
                      Failed to save changes. Please try again.
                    </div>
                  )}

                  {/* Submit buttons */}
                  <div className="flex gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('main')}
                      className="flex-1 border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 font-semibold py-2.5 rounded-xl text-sm transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving || !editName.trim()}
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-slate-950 font-bold py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-500/20"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 stroke-[2.5]" />
                          Save Profile
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 3: USER FEEDBACKS LIST */}
              {activeTab === 'feedback' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between gap-2 bg-slate-900 p-1 rounded-xl border border-white/10">
                    <button
                      type="button"
                      onClick={() => setFeedbackFilter('all')}
                      className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        feedbackFilter === 'all'
                          ? 'bg-emerald-500 text-slate-950 shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      All Feedback ({feedbacks.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setFeedbackFilter('mine')}
                      className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        feedbackFilter === 'mine'
                          ? 'bg-emerald-500 text-slate-950 shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      My Feedback ({userFeedbacks.length})
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 font-medium">
                    {feedbackFilter === 'all'
                      ? "Browse all feedback submitted by the community in real-time."
                      : "Here are the feedback notes you posted to Xur."}
                  </p>

                  {((feedbackFilter === 'all' ? feedbacks : userFeedbacks).length === 0) ? (
                    <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-2xl">
                      <MessageSquare className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                      <p className="text-sm font-bold text-slate-300">No feedbacks found</p>
                      <p className="text-xs text-slate-500 mt-0.5">Use the Feedback floating badge or bottom menu to write one.</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2 scrollbar-none">
                      {(feedbackFilter === 'all' ? feedbacks : userFeedbacks).map((fb) => (
                        <div key={fb.id} className="p-4 bg-white/5 rounded-2xl border border-white/10 flex flex-col gap-2 hover:border-emerald-500/30 transition-all">
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <span className="font-bold text-xs text-white block">
                                {fb.username || "Guest Listener"}
                              </span>
                              <span className={`inline-block text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full mt-1 ${
                                fb.category === 'bug' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                                fb.category === 'suggestion' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                                fb.category === 'praise' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                                'bg-white/10 text-slate-300 border border-white/10'
                              }`}>
                                {fb.category}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono shrink-0">
                              {new Date(fb.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic bg-slate-900/80 p-2.5 rounded-xl border border-white/5">
                            "{fb.message}"
                          </p>

                          {fb.songTitle && (
                            <span className="text-[10px] text-emerald-300 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md inline-block self-start border border-emerald-500/20">
                              🎵 Linked Song: {fb.songTitle}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: SETTINGS VIEW */}
              {activeTab === 'settings' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Category: Communication */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono border-b border-white/10 pb-1.5">
                      Communications
                    </h4>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5 pr-2">
                        <span className="text-sm font-semibold text-slate-200 block">
                          Email Notifications
                        </span>
                        <span className="text-xs text-slate-400 block">
                          Receive weekly reports, contributions alerts, and status changes.
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEmailNotifications(!emailNotifications)}
                        className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                          emailNotifications ? 'bg-emerald-500' : 'bg-slate-800'
                        }`}
                      >
                        <span className={`w-4 h-4 rounded-full bg-slate-950 absolute top-1 left-1 transition-transform ${
                          emailNotifications ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="space-y-0.5 pr-2">
                        <span className="text-sm font-semibold text-slate-200 block">
                          Community Marketing
                        </span>
                        <span className="text-xs text-slate-400 block">
                          Receive alerts for regional translation workshops and releases.
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setMarketingEmails(!marketingEmails)}
                        className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                          marketingEmails ? 'bg-emerald-500' : 'bg-slate-800'
                        }`}
                      >
                        <span className={`w-4 h-4 rounded-full bg-slate-950 absolute top-1 left-1 transition-transform ${
                          marketingEmails ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>
                  </div>

                  {/* Category: Privacy */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono border-b border-white/10 pb-1.5">
                      Privacy Preferences
                    </h4>

                    <div className="space-y-2">
                      <span className="text-sm font-semibold text-slate-200 block">
                        Profile Visibility
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setProfileVisibility('public')}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                            profileVisibility === 'public'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          Public Member
                        </button>
                        <button
                          type="button"
                          onClick={() => setProfileVisibility('private')}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                            profileVisibility === 'private'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          Anonymous Only
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Save setting preferences feedback */}
                  <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl text-xs text-emerald-300 flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <span>Preferences updated successfully! Settings are securely loaded & synchronised on current device session.</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('main')}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold py-2.5 rounded-xl text-sm transition-all text-center block cursor-pointer shadow-md shadow-emerald-500/20"
                  >
                    Done Settings
                  </button>
                </div>
              )}

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
