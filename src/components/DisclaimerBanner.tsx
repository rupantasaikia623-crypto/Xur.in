import React, { useState } from 'react';
import { AlertCircle, X } from 'lucide-react';

export default function DisclaimerBanner() {
  const [visible, setVisible] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('xur_disclaimer_dismissed') !== 'true';
    }
    return true;
  });

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem('xur_disclaimer_dismissed', 'true');
  };

  if (!visible) return null;

  return (
    <div className="bg-amber-950/30 border border-amber-500/30 rounded-2xl p-4 sm:p-5 shadow-xl relative text-amber-200 transition-all backdrop-blur-md">
      <div className="flex gap-3">
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" id="disclaimer-icon" />
        <div className="space-y-1.5 pr-6">
          <h4 className="font-bold text-sm sm:text-base text-amber-100 tracking-tight">
            Fair Use & Content Policy
          </h4>
          <p className="text-xs sm:text-sm leading-relaxed text-amber-200/90">
            সুৰ (Xur) is a community translation, transliteration, and song lyric interpretation platform. 
            All lyrics displayed are provided by users for educational, translation, and analytical purposes under 
            <strong className="text-amber-300"> Fair Use</strong> guidelines. We strictly respect intellectual property; if you are a copyright 
            owner and wish to have content removed, please contact us for immediate takedown.
          </p>
        </div>
      </div>
      <button 
        onClick={dismiss}
        className="absolute top-4 right-4 text-amber-400/80 hover:text-amber-200 transition-colors p-1.5 rounded-lg hover:bg-amber-500/20 cursor-pointer"
        id="dismiss-disclaimer-btn"
        aria-label="Dismiss disclaimer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
