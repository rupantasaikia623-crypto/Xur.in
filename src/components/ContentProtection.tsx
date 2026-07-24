import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, ShieldAlert, Lock, Eye, EyeOff, AlertCircle, Copy, AlertOctagon, CheckCircle2 } from 'lucide-react';

interface ContentProtectionContextType {
  protectionEnabled: boolean;
  setProtectionEnabled: (enabled: boolean) => void;
  devToolsOpen: boolean;
  sessionId: string;
  watermarkText: string;
  showProtectionToast: (message: string) => void;
  isUnlocked: boolean;
  unlockContent: () => void;
}

const ContentProtectionContext = createContext<ContentProtectionContextType | null>(null);

export const useContentProtection = () => {
  const context = useContext(ContentProtectionContext);
  if (!context) {
    return {
      protectionEnabled: false,
      setProtectionEnabled: () => {},
      devToolsOpen: false,
      sessionId: 'XUR-SEC-GUEST',
      watermarkText: 'XUR MUSIC',
      showProtectionToast: () => {},
      isUnlocked: true,
      unlockContent: () => {}
    };
  }
  return context;
};

interface ContentProtectionProviderProps {
  children: React.ReactNode;
  userId?: string;
}

export function ContentProtectionProvider({ children, userId }: ContentProtectionProviderProps) {
  const [protectionEnabled, setProtectionEnabled] = useState<boolean>(true);
  const [devToolsOpen, setDevToolsOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);

  // Generate or retrieve a consistent session ID
  const [sessionId] = useState(() => {
    const existing = sessionStorage.getItem('xur_sec_session_id');
    if (existing) return existing;
    const newId = 'XUR-SEC-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    sessionStorage.setItem('xur_sec_session_id', newId);
    return newId;
  });

  const watermarkText = `XUR MUSIC • ${userId ? `USER: ${userId}` : `SESSION: ${sessionId}`}`;

  const showProtectionToast = (msg: string) => {
    setToastMessage(msg);
  };

  // Toast timeout
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // DevTools detection via window dimension thresholds & console timing
  useEffect(() => {
    if (!protectionEnabled) {
      setDevToolsOpen(false);
      return;
    }

    const checkDevTools = () => {
      // If running inside an iframe (like AI Studio preview environment), outer vs inner window comparison is inaccurate
      const isIframe = window.self !== window.top;
      
      const threshold = 180;
      const widthDiff = !isIframe && (window.outerWidth - window.innerWidth > threshold);
      const heightDiff = !isIframe && (window.outerHeight - window.innerHeight > threshold);
      
      // Secondary timing check
      const start = performance.now();
      const end = performance.now();

      if (widthDiff || heightDiff || (end - start > 100)) {
        setDevToolsOpen(true);
      } else {
        setDevToolsOpen(false);
      }
    };

    window.addEventListener('resize', checkDevTools);
    const interval = setInterval(checkDevTools, 2000);

    return () => {
      window.removeEventListener('resize', checkDevTools);
      clearInterval(interval);
    };
  }, [protectionEnabled]);

  // Global event blockers (Keyboard shortcuts, Right-click contextmenu, Copy, Print)
  useEffect(() => {
    if (!protectionEnabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not block shortcuts if user is inside an input, textarea, or contentEditable element
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      // Detect Ctrl / Cmd key combinations
      const isCmdOrCtrl = e.ctrlKey || e.metaKey;

      if (isCmdOrCtrl) {
        const key = e.key.toLowerCase();
        // Ctrl+C (Copy), Ctrl+X (Cut), Ctrl+S (Save), Ctrl+P (Print), Ctrl+U (View Source)
        if (['c', 'x', 's', 'p', 'u'].includes(key)) {
          e.preventDefault();
          e.stopPropagation();
          showProtectionToast(`Shortcut Ctrl+${key.toUpperCase()} is disabled to protect XUR lyrics.`);
          return false;
        }
      }

      // F12 or Ctrl+Shift+I / J / C (DevTools)
      if (
        e.key === 'F12' ||
        (isCmdOrCtrl && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase()))
      ) {
        e.preventDefault();
        e.stopPropagation();
        showProtectionToast('Developer inspection shortcuts are restricted on XUR.');
        return false;
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Allow context menu on form inputs
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      e.preventDefault();
      showProtectionToast('Right-click context menu disabled on protected content.');
    };

    const handleCopy = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      e.preventDefault();
      showProtectionToast('Direct text copying is restricted for copyright protection.');
    };

    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.tagName === 'IMG') {
        e.preventDefault();
        showProtectionToast('Image drag-and-drop is restricted.');
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('contextmenu', handleContextMenu, true);
    window.addEventListener('copy', handleCopy, true);
    window.addEventListener('dragstart', handleDragStart, true);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('contextmenu', handleContextMenu, true);
      window.removeEventListener('copy', handleCopy, true);
      window.removeEventListener('dragstart', handleDragStart, true);
    };
  }, [protectionEnabled]);

  return (
    <ContentProtectionContext.Provider
      value={{
        protectionEnabled,
        setProtectionEnabled,
        devToolsOpen,
        sessionId,
        watermarkText,
        showProtectionToast,
        isUnlocked,
        unlockContent: () => setIsUnlocked(true)
      }}
    >
      <div className={protectionEnabled ? 'select-none' : ''}>
        {children}
      </div>

      {/* Security Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 bg-[#0c1222] border border-amber-500/50 text-amber-200 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-2xl flex items-center gap-3 max-w-md pointer-events-auto"
          >
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="text-xs font-medium leading-tight">
              <div className="font-bold text-amber-300 mb-0.5">XUR Content Protection</div>
              {toastMessage}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DevTools Warning Banner */}
      <AnimatePresence>
        {devToolsOpen && protectionEnabled && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-0 inset-x-0 z-50 bg-gradient-to-r from-red-950/90 via-amber-950/90 to-red-950/90 border-b border-red-500/40 text-red-200 px-4 py-2.5 backdrop-blur-md shadow-2xl flex items-center justify-between gap-4 text-xs font-medium"
          >
            <div className="flex items-center gap-2 max-w-3xl mx-auto text-center sm:text-left">
              <AlertOctagon className="w-4 h-4 text-red-400 shrink-0 animate-pulse" />
              <span>
                <strong className="text-white font-bold">Developer Inspection Detected:</strong> Extra watermarks and protection measures active. Content screenshot or code copying is prohibited on XUR.
              </span>
            </div>
            <button
              onClick={() => setDevToolsOpen(false)}
              className="px-2.5 py-1 bg-red-900/60 hover:bg-red-800 text-red-100 rounded-lg text-[10px] font-bold shrink-0 cursor-pointer"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </ContentProtectionContext.Provider>
  );
}

// Dynamic Watermark Overlay Component
export function DynamicWatermark({ opacity = 0.07 }: { opacity?: number }) {
  const { watermarkText, protectionEnabled } = useContentProtection();

  if (!protectionEnabled) return null;

  return (
    <div 
      className="absolute inset-0 pointer-events-none overflow-hidden z-10 select-none flex flex-wrap gap-12 justify-around items-center p-6"
      style={{ opacity }}
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="text-xs sm:text-sm font-mono font-bold tracking-widest text-slate-300 uppercase transform -rotate-12 whitespace-nowrap"
        >
          {watermarkText}
        </div>
      ))}
    </div>
  );
}

// Protected Content Wrapper (Handles blurred / locked state & watermark)
interface ProtectedContentProps {
  children: React.ReactNode;
  isPremium?: boolean;
  title?: string;
  className?: string;
}

export function ProtectedContent({
  children,
  isPremium = false,
  title = 'Exclusive Lyrics & Composition',
  className = ''
}: ProtectedContentProps) {
  const { isUnlocked, unlockContent, devToolsOpen, protectionEnabled } = useContentProtection();

  const isLocked = isPremium && !isUnlocked;

  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      {/* Watermark layer */}
      <DynamicWatermark opacity={devToolsOpen ? 0.15 : 0.08} />

      {/* Content wrapper with blur if locked or devtools open */}
      <div
        className={`transition-all duration-300 ${
          isLocked
            ? 'filter blur-md pointer-events-none select-none opacity-40'
            : devToolsOpen && protectionEnabled
            ? 'filter blur-sm select-none'
            : ''
        }`}
      >
        {children}
      </div>

      {/* Lock Overlay for Premium / Protected Content */}
      {isLocked && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-[#080d1a]/80 backdrop-blur-md text-center rounded-2xl border border-emerald-500/30">
          <div className="p-4 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mb-3 shadow-xl">
            <Lock className="w-8 h-8 animate-bounce" />
          </div>
          <h4 className="text-base font-bold text-white mb-1">{title}</h4>
          <p className="text-xs text-slate-300 max-w-xs mb-4 leading-relaxed">
            This songwriting masterpiece is protected under XUR License. Click below to verify and view full content.
          </p>
          <button
            onClick={unlockContent}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Authorize & Unlock Lyrics</span>
          </button>
        </div>
      )}
    </div>
  );
}
