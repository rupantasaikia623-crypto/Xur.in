import React, { useState } from 'react';
import brandLogo from '../assets/images/xur_music_logo_1784714618259.jpg';
import { 
  Youtube, 
  Instagram, 
  Globe2, 
  Heart, 
  Send, 
  CheckCircle, 
  Sparkles, 
  Music, 
  Shield, 
  BookOpen, 
  Users 
} from 'lucide-react';

interface FooterSectionProps {
  onNavigatePage: (page: string) => void;
}

export default function FooterSection({ onNavigatePage }: FooterSectionProps) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
      setNewsletterSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="relative bg-[#040711] text-slate-300 pt-16 pb-12 border-t border-white/10 select-none overflow-hidden">
      {/* Top Ambient Glow Line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-24 bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl overflow-hidden border border-emerald-500/30 bg-emerald-500/10 p-1 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                <img
                  src={brandLogo}
                  alt="Xur"
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/logo.jpg';
                  }}
                />
              </div>
              <div>
                <span className="font-display font-bold text-2xl text-white tracking-tight flex items-center gap-1.5">
                  XUR <span className="text-emerald-400 font-sans text-xl">(সুৰ)</span>
                </span>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                  Regional Melodies & Lyrics Engine
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              XUR (সুৰ) is a community-driven digital repository dedicated to preserving, annotating, and translating Assamese, Bengali, and North-East Indian musical heritage with line-by-line meanings and phonetic guides.
            </p>

            {/* Social Icons with Glowing Hovers */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:border-red-500/50 hover:bg-red-500/10 text-slate-400 hover:text-red-400 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md hover:scale-110"
                title="YouTube Channel"
              >
                <Youtube className="w-4 h-4" />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:border-pink-500/50 hover:bg-pink-500/10 text-slate-400 hover:text-pink-400 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md hover:scale-110"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-400 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md hover:scale-110"
                title="Regional Portal"
              >
                <Globe2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Platform Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigatePage('home')}
                  className="text-slate-400 hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  🎵 Explore All Song Lyrics
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigatePage('add-song')}
                  className="text-slate-400 hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  ➕ Submit Song / Translation
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigatePage('profile')}
                  className="text-slate-400 hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  👤 Contributor Profile
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigatePage('moderator-board')}
                  className="text-slate-400 hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  🛡️ Moderator Review Desk
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscribe */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
              <Music className="w-3.5 h-3.5 text-cyan-400" /> Weekly Lyric Releases
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Subscribe to receive weekly curated Assamese & Bengali classic song translations directly in your inbox.
            </p>

            {newsletterSubscribed ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl p-3 text-xs flex items-center gap-2 animate-fade-in">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Subscribed! You will receive weekly lyric updates.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500/50 flex-1"
                  required
                />
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shrink-0 shadow-md shadow-emerald-500/10"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Meet Our Team Section */}
        <div className="py-8 border-b border-white/10">
          <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" /> Meet Our Core Team
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Founder & CEO */}
            <div className="bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between group shadow-lg">
              <div>
                <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest block mb-1">Founder & CEO</span>
                <h5 className="font-bold text-sm text-white font-sans tracking-tight">Udipta Pran</h5>
                <ul className="mt-2.5 space-y-1">
                  <li className="text-[11px] text-slate-300 flex items-center gap-1.5 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Songwriter
                  </li>
                  <li className="text-[11px] text-slate-300 flex items-center gap-1.5 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Musician & Singer
                  </li>
                </ul>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex justify-start">
                <a 
                  href="https://www.instagram.com/_udipta_pran_?igsh=MWhlN2s3cmlyNzc5bw==" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                  id="instagram-founder-link"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>Instagram</span>
                </a>
              </div>
            </div>

            {/* Co-Founder & CTO */}
            <div className="bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between group shadow-lg">
              <div>
                <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest block mb-1">Co-Founder & CTO</span>
                <h5 className="font-bold text-sm text-white font-sans tracking-tight">Rupanta Saikia</h5>
                <ul className="mt-2.5 space-y-1">
                  <li className="text-[11px] text-slate-300 flex items-center gap-1.5 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Songwriter & Tech Lead
                  </li>
                </ul>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex justify-start">
                <span className="text-[11px] text-slate-400 font-medium">Platform Architect</span>
              </div>
            </div>

            {/* Marketing Manager */}
            <div className="bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between group shadow-lg">
              <div>
                <span className="text-[9px] font-bold text-amber-400 uppercase tracking-widest block mb-1">Marketing Manager</span>
                <h5 className="font-bold text-sm text-white font-sans tracking-tight">Himanshu Sharma</h5>
                <ul className="mt-2.5 space-y-1">
                  <li className="text-[11px] text-slate-300 flex items-center gap-1.5 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" /> Marketing Expert
                  </li>
                </ul>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex justify-start">
                <a 
                  href="https://www.instagram.com/xypherion07_?igsh=cjJmbnhyb2R1Znhp" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                  id="instagram-marketing-link"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>Instagram</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center gap-1.5 font-medium">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
            <span>for Regional Music Enthusiasts everywhere</span>
          </div>

          <div className="font-mono text-[11px] text-slate-500">
            © {new Date().getFullYear()} XUR (সুৰ) • All Rights Reserved
          </div>
        </div>
      </div>
    </footer>
  );
}
