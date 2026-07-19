import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAXk1Eb53p4naN7LWM37UfbrpFSxb5J78E",
  authDomain: "gen-lang-client-0650504101.firebaseapp.com",
  projectId: "gen-lang-client-0650504101",
  storageBucket: "gen-lang-client-0650504101.firebasestorage.app",
  messagingSenderId: "601017407449",
  appId: "1:601017407449:web:49beff43aa058e4703abc8"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with custom databaseId and long polling enabled
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, "ai-studio-bec1f635-62c5-44c0-8335-ae32c1356049");

// Initialize Auth
const auth = getAuth(app);

export { app, db, auth };
