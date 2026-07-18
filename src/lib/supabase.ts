import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment
const supabaseUrl = ((import.meta as any).env?.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '').trim();

// Check if credentials are set and valid
const checkSupabaseConfig = (): boolean => {
  if (!supabaseUrl || !supabaseAnonKey) return false;
  // Ensure it starts with http:// or https://
  if (!/^https?:\/\//i.test(supabaseUrl)) return false;
  // Ensure it's not a placeholder value
  if (supabaseUrl.includes('placeholder') || supabaseAnonKey.includes('placeholder')) return false;
  // Real anon keys are long JWTs, but let's just make sure it has some length
  if (supabaseAnonKey.length < 10) return false;
  return true;
};

export const isSupabaseConfigured = checkSupabaseConfig();

// Initialize Supabase Client (lazy loaded/safely handled so it never crashes if keys are empty or invalid)
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Robust mock implementation of Supabase Auth for seamless local development
 * when Supabase keys are not yet configured in the environment.
 */
class MockSupabaseAuth {
  private listeners: Array<(event: string, session: any) => void> = [];
  private currentSession: any = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('supabase_mock_session');
      if (savedUser) {
        this.currentSession = JSON.parse(savedUser);
      }
    }
  }

  onAuthStateChange(callback: (event: string, session: any) => void) {
    this.listeners.push(callback);
    // Emit initial event with current session
    setTimeout(() => {
      callback(this.currentSession ? 'SIGNED_IN' : 'SIGNED_OUT', this.currentSession);
    }, 0);

    return {
      data: {
        subscription: {
          unsubscribe: () => {
            this.listeners = this.listeners.filter(l => l !== callback);
          }
        }
      }
    };
  }

  async signInWithPassword({ email, password }: any) {
    // Basic local emulation
    if (!email || !password) {
      return { data: { user: null, session: null }, error: new Error('Email and password required') };
    }
    
    // Simulate user creation or retrieval from local profiles
    const profiles = JSON.parse(localStorage.getItem('xur_local_profile') || '{}');
    let foundProfile = Object.values(profiles).find((p: any) => p.email === email) as any;

    if (!foundProfile) {
      // Just auto-create a mock user for zero-hurdle demo login if not exists
      const uid = 'mock-sb-' + Math.random().toString(36).substring(2, 9);
      foundProfile = {
        uid,
        email,
        displayName: email.split('@')[0],
        role: email.includes('admin') || email.includes('mod') ? 'moderator' : 'user',
        createdAt: new Date().toISOString()
      };
      profiles[uid] = foundProfile;
      localStorage.setItem('xur_local_profile', JSON.stringify(profiles));
    }

    const mockSession = {
      user: {
        id: foundProfile.uid,
        email: foundProfile.email,
        user_metadata: {
          displayName: foundProfile.displayName
        }
      }
    };

    this.currentSession = mockSession;
    localStorage.setItem('supabase_mock_session', JSON.stringify(mockSession));
    this.notify('SIGNED_IN', mockSession);

    return { data: mockSession, error: null };
  }

  async signUp({ email, password, options }: any) {
    if (!email || !password) {
      return { data: { user: null, session: null }, error: new Error('Email and password required') };
    }

    const displayName = options?.data?.displayName || email.split('@')[0];
    const uid = 'mock-sb-' + Math.random().toString(36).substring(2, 9);
    
    const mockProfile = {
      uid,
      email,
      displayName,
      role: 'user',
      createdAt: new Date().toISOString()
    };

    const profiles = JSON.parse(localStorage.getItem('xur_local_profile') || '{}');
    profiles[uid] = mockProfile;
    localStorage.setItem('xur_local_profile', JSON.stringify(profiles));

    const mockSession = {
      user: {
        id: uid,
        email,
        user_metadata: {
          displayName
        }
      }
    };

    this.currentSession = mockSession;
    localStorage.setItem('supabase_mock_session', JSON.stringify(mockSession));
    this.notify('SIGNED_IN', mockSession);

    return { data: mockSession, error: null };
  }

  async signOut() {
    this.currentSession = null;
    localStorage.removeItem('supabase_mock_session');
    this.notify('SIGNED_OUT', null);
    return { error: null };
  }

  async updateUser({ data }: any) {
    if (this.currentSession?.user) {
      this.currentSession.user.user_metadata = {
        ...this.currentSession.user.user_metadata,
        ...data
      };
      localStorage.setItem('supabase_mock_session', JSON.stringify(this.currentSession));
      this.notify('USER_UPDATED', this.currentSession);
      
      // Mirror in local profile
      const uid = this.currentSession.user.id;
      const profiles = JSON.parse(localStorage.getItem('xur_local_profile') || '{}');
      if (profiles[uid]) {
        profiles[uid].displayName = data.displayName || profiles[uid].displayName;
        localStorage.setItem('xur_local_profile', JSON.stringify(profiles));
      }
    }
    return { data: this.currentSession, error: null };
  }

  private notify(event: string, session: any) {
    this.listeners.forEach(callback => callback(event, session));
  }
}

// Export a proxy auth interface that handles active/inactive configurations seamlessly
export const supabaseAuth = {
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    if (supabase) {
      return supabase.auth.onAuthStateChange(callback);
    } else {
      const mock = new MockSupabaseAuth();
      return mock.onAuthStateChange(callback);
    }
  },
  
  signInWithPassword: async ({ email, password }: any) => {
    if (supabase) {
      return supabase.auth.signInWithPassword({ email, password });
    } else {
      const mock = new MockSupabaseAuth();
      return mock.signInWithPassword({ email, password });
    }
  },

  signUp: async ({ email, password, options }: any) => {
    if (supabase) {
      return supabase.auth.signUp({ email, password, options });
    } else {
      const mock = new MockSupabaseAuth();
      return mock.signUp({ email, password, options });
    }
  },

  signOut: async () => {
    if (supabase) {
      return supabase.auth.signOut();
    } else {
      const mock = new MockSupabaseAuth();
      return mock.signOut();
    }
  },

  updateUser: async ({ data }: any) => {
    if (supabase) {
      return supabase.auth.updateUser({ data });
    } else {
      const mock = new MockSupabaseAuth();
      return mock.updateUser({ data });
    }
  }
};
