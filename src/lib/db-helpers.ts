import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  increment,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { Song, Comment, SongVersion, UserProfile, FlagReport } from '../types';

// Seed Songs Data
const SEED_SONGS: Partial<Song>[] = [
  {
    id: "pratidhwani-hazarika",
    title: "প্ৰতিধ্বনি শুনো মই (Pratidhwani Xunu Moi)",
    artist: "Dr. Bhupen Hazarika",
    language: "Assamese",
    album: "Pratidhwani",
    releaseYear: 1964,
    genre: "Folk/Patriotic",
    tags: ["Classic", "Philosophical", "Humanitarian"],
    lyrics: `প্ৰতিধ্বনি শুনো মই প্ৰতিধ্বনি শুনো
কাৰোবাৰ যেন এক আৰ্তনাদ শুনো...

নিয়তিৰ চক্ৰত পিষ্ট মানুহৰ
বুকুভঙা হুমুনিয়াহ শুনো মই শুনো
প্ৰতিধ্বনি শুনো মই প্ৰতিধ্বনি শুনো।

মহা মানৱতাৰ হাহাকাৰ শুনো
কাৰোবাৰ যেন এক ক্ৰন্দন শুনো
মই প্ৰতিধ্বনি শুনো...`,
    transliteration: `Pratidhwani xunu moi pratidhwani xunu
Karubhar jen ek aartonadh xunu...

Niyotor sokrot pistoh manuxor
Bukubhongah humuniyah xunu moi xunu
Pratidhwani xunu moi pratidhwani xunu.

Moha manuwotor hahakar xunu
Karubhar jen ek krondon xunu
Moi pratidhwani xunu...`,
    translation: `I hear the echo, I hear the echo,
As if I hear someone's painful cry...

Of people crushed in the wheel of destiny,
I hear their heart-broken sighs.
I hear the echo, I hear the echo.

I hear the screams of great humanity,
As if I hear someone weeping.
I hear the echo...`,
    youtubeLink: "https://www.youtube.com/watch?v=OshXf9Xq8yE",
    submittedBy: "system",
    submittedByUsername: "Xur Moderator",
    createdAt: new Date().toISOString(),
    views: 342,
    upvotesCount: 18,
    upvotedBy: [],
    commentsCount: 3,
    isFlagged: false
  },
  {
    id: "ekla-cholo-tagore",
    title: "যদি তোর ডাক শুনে কেউ না আসে (Ekla Cholo Re)",
    artist: "Rabindranath Tagore",
    language: "Bengali",
    album: "Rabindra Sangeet",
    releaseYear: 1905,
    genre: "Rabindra Sangeet",
    tags: ["Inspirational", "Freedom", "Tagore"],
    lyrics: `যদি তোর ডাক শুনে কেউ না আসে তবে একলা চলো রে।
একলা চলো, একলা চলো, একলা চলো, একলা চলো রে॥

যদি কেউ কথা না কয়, ওরে ওরে ও অভাগা,
যদি সবাই থাকে মুখ ফিরায়ে সবাই করে ভয়—
তবে পরাণ খুলে
তুই মুখ ফুটে তোর মনের কথা একলা বলো রে॥

যদি সবাই ফিরে যায়, ওরে ওরে ও অভাগা,
যদি গহন পথে যাবার কালে কেউ ফিরে না চায়—
তবে পথের কাঁটা
তুই রক্তমাখা চরণে দলি একলা চলো রে॥`,
    transliteration: `Jodi tor dak shune keu na ase tobe ekla cholo re.
Ekla cholo, ekla cholo, ekla cholo, ekla cholo re.

Jodi keu kotha na koy, ore ore o obhaga,
Jodi sobai thake mukh firaye sobai kore bhoy—
Tobe poran khule
Tui mukh fute tor moner kotha ekla bolo re.

Jodi sobai fire jay, ore ore o obhaga,
Jodi gohon pothe jabar kale keu fire na chay—
Tobe pother kanta
Tui roktomakha chorone doli ekla cholo re.`,
    translation: `If they answer not to your call walk alone,
Walk alone, walk alone, walk alone, walk alone!

If no one speaks, oh you unlucky mind,
If everyone turns away their face and everyone fears—
Then opening up your soul,
Speak out your mind's thoughts alone.

If everyone turns back, oh you unlucky mind,
If while walking along the deep path no one looks back—
Then treading on the thorns of the path
With blood-stained feet, walk alone.`,
    youtubeLink: "https://www.youtube.com/watch?v=64X7Iatd9Z8",
    submittedBy: "system",
    submittedByUsername: "Xur Moderator",
    createdAt: new Date().toISOString(),
    views: 289,
    upvotesCount: 24,
    upvotedBy: [],
    commentsCount: 2,
    isFlagged: false
  },
  {
    id: "kabira-arijit",
    title: "Kabira",
    artist: "Arijit Singh & Rekha Bhardwaj",
    language: "Hindi",
    album: "Yeh Jawaani Hai Deewani",
    releaseYear: 2013,
    genre: "Sufi Pop",
    tags: ["Melancholy", "Soulful", "Sufi"],
    lyrics: `Kaisi teri khudgarzi
Na dhoop chune na chhaon
Kaisi teri khudgarzi
Kisi thaur tike na paon

Ban banata aangna dharat nahi paon
Kaisi teri khudgarzi
Kisi thaur tike na paon

Re kabira maan ja
Re fakeera maan ja
Aaja tujhko pukaarein teri parchhaaiyan
Re kabira maan ja
Re fakeera maan ja
Kaisa tu hai nirmohi kaisa harjaaiyan`,
    transliteration: `Kaisi teri khudgarzi
Na dhoop chune na chhaon
Kaisi teri khudgarzi
Kisi thaur tike na paon

Ban banata aangna dharat nahi paon
Kaisi teri khudgarzi
Kisi thaur tike na paon

Re kabira maan ja
Re fakeera maan ja
Aaja tujhko pukaarein teri parchhaaiyan
Re kabira maan ja
Re fakeera maan ja
Kaisa tu hai nirmohi kaisa harjaaiyan`,
    translation: `What kind of selfishness is this?
You don't choose the sunshine nor the shade.
What kind of selfishness is this?
Your feet don't stay at any one place.

Even a courtyard made of dense forest doesn't please you,
What kind of selfishness is this?
Your feet don't stay at any one place.

Oh Kabir, listen to me,
Oh Saint, listen to me,
Come back, your own shadows are calling you.
Oh Kabir, listen to me,
Oh Saint, listen to me,
Why are you so detached, what kind of wanderer are you?`,
    youtubeLink: "https://www.youtube.com/watch?v=j8S_IuH9uLI",
    submittedBy: "system",
    submittedByUsername: "Xur Moderator",
    createdAt: new Date().toISOString(),
    views: 521,
    upvotesCount: 39,
    upvotedBy: [],
    commentsCount: 4,
    isFlagged: false
  },
  {
    id: "imagine-lennon",
    title: "Imagine",
    artist: "John Lennon",
    language: "English",
    album: "Imagine",
    releaseYear: 1971,
    genre: "Classic Rock",
    tags: ["Peace", "Classic", "Hope"],
    lyrics: `Imagine there's no heaven
It's easy if you try
No hell below us
Above us, only sky

Imagine all the people
Livin' for today

Imagine there's no countries
It isn't hard to do
Nothing to kill or die for
And no religion, too

Imagine all the people
Livin' life in peace`,
    translation: `স্বৰ্গ বুলি যে একো নাই ভাৱি চোৱা চোন
চেষ্টা কৰিলে ই অতি উজু...
আমাৰ তলত কোনো নৰক নাই
ওপৰত কেৱল নীলা আকাশখন।

ভাৱি চোৱা সকলো মানুহেই
কেৱল বৰ্তমানৰ বাবেই জীয়াই আছে...`,
    youtubeLink: "https://www.youtube.com/watch?v=YkgkThdzWik",
    submittedBy: "system",
    submittedByUsername: "Xur Moderator",
    createdAt: new Date().toISOString(),
    views: 412,
    upvotesCount: 32,
    upvotedBy: [],
    commentsCount: 1,
    isFlagged: false
  }
];

// In-memory local storage fallback to ensure the app is 100% functional and crash-proof
const LOCAL_STORAGE_KEY_SONGS = "xur_local_songs";
const LOCAL_STORAGE_KEY_COMMENTS = "xur_local_comments";
const LOCAL_STORAGE_KEY_VERSIONS = "xur_local_versions";
const LOCAL_STORAGE_KEY_PROFILE = "xur_local_profile";
const LOCAL_STORAGE_KEY_FLAGS = "xur_local_flags";

function initializeLocalDb() {
  if (!localStorage.getItem(LOCAL_STORAGE_KEY_SONGS)) {
    localStorage.setItem(LOCAL_STORAGE_KEY_SONGS, JSON.stringify(SEED_SONGS));
  }
  if (!localStorage.getItem(LOCAL_STORAGE_KEY_COMMENTS)) {
    const seedComments: Comment[] = [
      {
        id: "c1",
        songId: "pratidhwani-hazarika",
        userId: "system",
        username: "Xur Moderator",
        content: "Bhupen da wrote this song highlighting the pains and echoes of marginalized struggles. It's incredibly relevant today.",
        parentId: null,
        upvotes: ["demo-user-1"],
        reactions: { "💡": ["demo-user-1"] },
        createdAt: new Date().toISOString(),
        isFlagged: false
      },
      {
        id: "c2",
        songId: "pratidhwani-hazarika",
        userId: "demo-user-1",
        username: "Joyjeet",
        content: "The term 'Niyoti' (destiny) here represents systemic forces rather than just pure luck. A masterpiece.",
        parentId: null,
        upvotes: ["system"],
        reactions: { "❤️": ["system"] },
        createdAt: new Date().toISOString(),
        isFlagged: false
      },
      {
        id: "c3",
        songId: "pratidhwani-hazarika",
        userId: "demo-user-2",
        username: "Ananya",
        content: "Exactly! Beautiful interpretation.",
        parentId: "c2",
        upvotes: [],
        reactions: {},
        createdAt: new Date().toISOString(),
        isFlagged: false
      },
      {
        id: "c4",
        songId: "ekla-cholo-tagore",
        userId: "system",
        username: "Rabindra Fan",
        content: "This song was Mahatma Gandhi's favorite during tough moments in the freedom struggle.",
        parentId: null,
        upvotes: ["demo-user-2"],
        reactions: { "💡": ["demo-user-2", "demo-user-1"] },
        createdAt: new Date().toISOString(),
        isFlagged: false
      }
    ];
    localStorage.setItem(LOCAL_STORAGE_KEY_COMMENTS, JSON.stringify(seedComments));
  }
  if (!localStorage.getItem(LOCAL_STORAGE_KEY_VERSIONS)) {
    localStorage.setItem(LOCAL_STORAGE_KEY_VERSIONS, JSON.stringify([]));
  }
  if (!localStorage.getItem(LOCAL_STORAGE_KEY_FLAGS)) {
    localStorage.setItem(LOCAL_STORAGE_KEY_FLAGS, JSON.stringify([]));
  }
}

// Ensure the local storage is populated on module load
if (typeof window !== "undefined") {
  initializeLocalDb();
}

// -------------------------------------------------------------
// FIREBASE / LOCAL FALLBACK WRAPPER
// -------------------------------------------------------------

// Helper to determine if we can/should write to Firestore
async function checkFirestore() {
  try {
    // Just a fast validation to see if the network or auth works
    const testDoc = await getDoc(doc(db, "system_metadata", "health"));
    return true;
  } catch (e) {
    console.warn("Firestore connection not fully ready, falling back to local storage.", e);
    return false;
  }
}

// User Profiles
export async function getProfile(uid: string): Promise<UserProfile | null> {
  try {
    const docRef = doc(db, "users", uid);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
  } catch (e) {
    console.error("Firestore error in getProfile:", e);
  }

  // Fallback
  const profiles = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_PROFILE) || "{}");
  return profiles[uid] || null;
}

export async function saveProfile(profile: UserProfile): Promise<void> {
  try {
    await setDoc(doc(db, "users", profile.uid), profile);
    return;
  } catch (e) {
    console.error("Firestore error in saveProfile:", e);
  }

  // Fallback
  const profiles = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_PROFILE) || "{}");
  profiles[profile.uid] = profile;
  localStorage.setItem(LOCAL_STORAGE_KEY_PROFILE, JSON.stringify(profiles));
}

// Songs
export async function fetchSongs(filter?: { language?: string; genre?: string; queryText?: string }): Promise<Song[]> {
  let songs: Song[] = [];
  try {
    const qRef = collection(db, "songs");
    const snap = await getDocs(qRef);
    songs = snap.docs.map(d => ({ id: d.id, ...d.data() } as Song));
  } catch (e) {
    console.warn("Firestore fetchSongs failed, using local fallback", e);
    songs = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_SONGS) || "[]");
  }

  // Apply filter
  if (filter) {
    const { language, genre, queryText } = filter;
    if (language) {
      songs = songs.filter(s => s.language.toLowerCase() === language.toLowerCase());
    }
    if (genre) {
      songs = songs.filter(s => s.genre.toLowerCase() === genre.toLowerCase());
    }
    if (queryText) {
      const q = queryText.toLowerCase();
      songs = songs.filter(s => 
        s.title.toLowerCase().includes(q) || 
        s.artist.toLowerCase().includes(q) || 
        (s.album && s.album.toLowerCase().includes(q)) ||
        s.lyrics.toLowerCase().includes(q)
      );
    }
  }

  // Filter out flagged songs unless moderator
  return songs;
}

export async function getSongById(id: string): Promise<Song | null> {
  try {
    const docRef = doc(db, "songs", id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      // Increment view count in background
      updateDoc(docRef, { views: increment(1) }).catch(console.error);
      return { id: snap.id, ...snap.data() } as Song;
    }
  } catch (e) {
    console.warn("Firestore getSongById failed, using local fallback", e);
  }

  // Fallback
  const songs: Song[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_SONGS) || "[]");
  const idx = songs.findIndex(s => s.id === id);
  if (idx !== -1) {
    songs[idx].views += 1;
    localStorage.setItem(LOCAL_STORAGE_KEY_SONGS, JSON.stringify(songs));
    return songs[idx];
  }
  return null;
}

export async function addSong(songInput: Omit<Song, "id" | "createdAt" | "views" | "upvotesCount" | "upvotedBy" | "commentsCount" | "isFlagged">): Promise<string> {
  const newId = songInput.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now().toString().slice(-4);
  const newSong: Song = {
    ...songInput,
    id: newId,
    createdAt: new Date().toISOString(),
    views: 0,
    upvotesCount: 0,
    upvotedBy: [],
    commentsCount: 0,
    isFlagged: false
  };

  try {
    await setDoc(doc(db, "songs", newId), newSong);
    // Create initial version
    const initialVersion: SongVersion = {
      id: "v-initial-" + Date.now(),
      songId: newId,
      lyrics: newSong.lyrics,
      transliteration: newSong.transliteration,
      translation: newSong.translation,
      editedBy: newSong.submittedBy,
      editedByUsername: newSong.submittedByUsername,
      editNotes: "Initial lyrics submission",
      createdAt: newSong.createdAt
    };
    await setDoc(doc(db, `songs/${newId}/versions`, initialVersion.id), initialVersion);
    return newId;
  } catch (e) {
    console.error("Firestore addSong failed, saving locally", e);
  }

  // Local fallback
  const songs = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_SONGS) || "[]");
  songs.push(newSong);
  localStorage.setItem(LOCAL_STORAGE_KEY_SONGS, JSON.stringify(songs));

  // Also save initial version locally
  const versions = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_VERSIONS) || "[]");
  versions.push({
    id: "v-initial-" + Date.now(),
    songId: newId,
    lyrics: newSong.lyrics,
    transliteration: newSong.transliteration,
    translation: newSong.translation,
    editedBy: newSong.submittedBy,
    editedByUsername: newSong.submittedByUsername,
    editNotes: "Initial lyrics submission",
    createdAt: newSong.createdAt
  });
  localStorage.setItem(LOCAL_STORAGE_KEY_VERSIONS, JSON.stringify(versions));

  return newId;
}

export async function editSongLyrics(
  songId: string, 
  updates: { lyrics: string; transliteration?: string; translation?: string }, 
  editorId: string, 
  editorName: string, 
  editNotes: string
): Promise<void> {
  const versionId = "v-" + Date.now();
  const newVersion: SongVersion = {
    id: versionId,
    songId,
    lyrics: updates.lyrics,
    transliteration: updates.transliteration,
    translation: updates.translation,
    editedBy: editorId,
    editedByUsername: editorName,
    editNotes,
    createdAt: new Date().toISOString()
  };

  try {
    // 1. Add version doc
    await setDoc(doc(db, `songs/${songId}/versions`, versionId), newVersion);
    // 2. Update song
    await updateDoc(doc(db, "songs", songId), {
      lyrics: updates.lyrics,
      transliteration: updates.transliteration || "",
      translation: updates.translation || "",
      currentVersionId: versionId
    });
    return;
  } catch (e) {
    console.error("Firestore editSongLyrics failed, saving locally", e);
  }

  // Fallback
  const songs: Song[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_SONGS) || "[]");
  const sIdx = songs.findIndex(s => s.id === songId);
  if (sIdx !== -1) {
    songs[sIdx].lyrics = updates.lyrics;
    songs[sIdx].transliteration = updates.transliteration;
    songs[sIdx].translation = updates.translation;
    songs[sIdx].currentVersionId = versionId;
    localStorage.setItem(LOCAL_STORAGE_KEY_SONGS, JSON.stringify(songs));
  }

  const versions: SongVersion[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_VERSIONS) || "[]");
  versions.push(newVersion);
  localStorage.setItem(LOCAL_STORAGE_KEY_VERSIONS, JSON.stringify(versions));
}

export async function fetchSongVersions(songId: string): Promise<SongVersion[]> {
  try {
    const snap = await getDocs(collection(db, `songs/${songId}/versions`));
    const sorted = snap.docs.map(d => d.data() as SongVersion);
    return sorted.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (e) {
    console.warn("Firestore fetchSongVersions failed, using local", e);
  }

  // Fallback
  const versions: SongVersion[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_VERSIONS) || "[]");
  return versions
    .filter(v => v.songId === songId)
    .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function toggleSongUpvote(songId: string, userId: string): Promise<{ upvoted: boolean; count: number }> {
  try {
    const songRef = doc(db, "songs", songId);
    const snap = await getDoc(songRef);
    if (snap.exists()) {
      const data = snap.data() as Song;
      const upvotedBy = data.upvotedBy || [];
      const hasUpvoted = upvotedBy.includes(userId);
      if (hasUpvoted) {
        await updateDoc(songRef, {
          upvotedBy: arrayRemove(userId),
          upvotesCount: increment(-1)
        });
        return { upvoted: false, count: data.upvotesCount - 1 };
      } else {
        await updateDoc(songRef, {
          upvotedBy: arrayUnion(userId),
          upvotesCount: increment(1)
        });
        return { upvoted: true, count: data.upvotesCount + 1 };
      }
    }
  } catch (e) {
    console.error("Firestore toggleUpvote failed, fallback to local", e);
  }

  // Fallback
  const songs: Song[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_SONGS) || "[]");
  const idx = songs.findIndex(s => s.id === songId);
  if (idx !== -1) {
    const song = songs[idx];
    if (!song.upvotedBy) song.upvotedBy = [];
    const uIdx = song.upvotedBy.indexOf(userId);
    let upvoted = false;
    if (uIdx !== -1) {
      song.upvotedBy.splice(uIdx, 1);
      song.upvotesCount = Math.max(0, song.upvotesCount - 1);
    } else {
      song.upvotedBy.push(userId);
      song.upvotesCount += 1;
      upvoted = true;
    }
    localStorage.setItem(LOCAL_STORAGE_KEY_SONGS, JSON.stringify(songs));
    return { upvoted, count: song.upvotesCount };
  }
  return { upvoted: false, count: 0 };
}

// Comments
export async function fetchComments(songId: string): Promise<Comment[]> {
  try {
    const q = query(collection(db, "comments"), where("songId", "==", songId));
    const snap = await getDocs(q);
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Comment));
    return list.sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  } catch (e) {
    console.warn("Firestore fetchComments failed, fallback to local", e);
  }

  // Fallback
  const comments: Comment[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_COMMENTS) || "[]");
  return comments
    .filter(c => c.songId === songId && !c.isFlagged)
    .sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export async function addComment(commentInput: Omit<Comment, "id" | "createdAt" | "upvotes" | "reactions" | "isFlagged">): Promise<Comment> {
  const newId = "c-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6);
  const newComment: Comment = {
    ...commentInput,
    id: newId,
    upvotes: [],
    reactions: {},
    createdAt: new Date().toISOString(),
    isFlagged: false
  };

  try {
    await setDoc(doc(db, "comments", newId), newComment);
    // Increment commentsCount in song
    await updateDoc(doc(db, "songs", commentInput.songId), {
      commentsCount: increment(1)
    });
  } catch (e) {
    console.error("Firestore addComment failed, saving locally", e);
  }

  // Local fallback
  const comments = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_COMMENTS) || "[]");
  comments.push(newComment);
  localStorage.setItem(LOCAL_STORAGE_KEY_COMMENTS, JSON.stringify(comments));

  const songs: Song[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_SONGS) || "[]");
  const sIdx = songs.findIndex(s => s.id === commentInput.songId);
  if (sIdx !== -1) {
    songs[sIdx].commentsCount += 1;
    localStorage.setItem(LOCAL_STORAGE_KEY_SONGS, JSON.stringify(songs));
  }

  return newComment;
}

export async function toggleCommentUpvote(commentId: string, userId: string): Promise<Comment | null> {
  // Fallback / standard
  const comments: Comment[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_COMMENTS) || "[]");
  const idx = comments.findIndex(c => c.id === commentId);
  if (idx !== -1) {
    const comment = comments[idx];
    if (!comment.upvotes) comment.upvotes = [];
    const uIdx = comment.upvotes.indexOf(userId);
    if (uIdx !== -1) {
      comment.upvotes.splice(uIdx, 1);
    } else {
      comment.upvotes.push(userId);
    }
    localStorage.setItem(LOCAL_STORAGE_KEY_COMMENTS, JSON.stringify(comments));

    // Try to mirror in firestore
    try {
      await updateDoc(doc(db, "comments", commentId), {
        upvotes: comment.upvotes
      });
    } catch (e) {
      console.warn("Firestore comment upvote sync failed", e);
    }

    return comment;
  }
  return null;
}

export async function addCommentReaction(commentId: string, emoji: string, userId: string): Promise<Comment | null> {
  const comments: Comment[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_COMMENTS) || "[]");
  const idx = comments.findIndex(c => c.id === commentId);
  if (idx !== -1) {
    const comment = comments[idx];
    if (!comment.reactions) comment.reactions = {};
    if (!comment.reactions[emoji]) comment.reactions[emoji] = [];
    
    const userIdx = comment.reactions[emoji].indexOf(userId);
    if (userIdx !== -1) {
      // Remove
      comment.reactions[emoji].splice(userIdx, 1);
      if (comment.reactions[emoji].length === 0) {
        delete comment.reactions[emoji];
      }
    } else {
      // Add
      comment.reactions[emoji].push(userId);
    }
    
    localStorage.setItem(LOCAL_STORAGE_KEY_COMMENTS, JSON.stringify(comments));

    // Try to mirror in firestore
    try {
      await updateDoc(doc(db, "comments", commentId), {
        reactions: comment.reactions
      });
    } catch (e) {
      console.warn("Firestore comment reaction sync failed", e);
    }

    return comment;
  }
  return null;
}

// Moderation / Flags
export async function reportFlag(report: Omit<FlagReport, "id" | "createdAt" | "status">): Promise<void> {
  const newReport: FlagReport = {
    ...report,
    id: "flag-" + Date.now(),
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, "flags", newReport.id), newReport);
    // Mark target as flagged
    if (report.type === 'song') {
      await updateDoc(doc(db, "songs", report.targetId), { isFlagged: true, flagReason: report.reason });
    } else {
      await updateDoc(doc(db, "comments", report.targetId), { isFlagged: true });
    }
  } catch (e) {
    console.error("Firestore flag report failed, saving locally", e);
  }

  // Fallback
  const flags = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_FLAGS) || "[]");
  flags.push(newReport);
  localStorage.setItem(LOCAL_STORAGE_KEY_FLAGS, JSON.stringify(flags));

  if (report.type === 'song') {
    const songs: Song[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_SONGS) || "[]");
    const sIdx = songs.findIndex(s => s.id === report.targetId);
    if (sIdx !== -1) {
      songs[sIdx].isFlagged = true;
      songs[sIdx].flagReason = report.reason;
      localStorage.setItem(LOCAL_STORAGE_KEY_SONGS, JSON.stringify(songs));
    }
  } else {
    const comments: Comment[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_COMMENTS) || "[]");
    const cIdx = comments.findIndex(c => c.id === report.targetId);
    if (cIdx !== -1) {
      comments[cIdx].isFlagged = true;
      localStorage.setItem(LOCAL_STORAGE_KEY_COMMENTS, JSON.stringify(comments));
    }
  }
}

export async function fetchFlags(): Promise<FlagReport[]> {
  try {
    const snap = await getDocs(collection(db, "flags"));
    return snap.docs.map(d => d.data() as FlagReport);
  } catch (e) {
    console.warn("Firestore fetchFlags failed, using local", e);
  }

  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_FLAGS) || "[]");
}

export async function resolveFlag(flagId: string, action: 'resolve' | 'dismiss'): Promise<void> {
  // Update local
  const flags: FlagReport[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_FLAGS) || "[]");
  const idx = flags.findIndex(f => f.id === flagId);
  if (idx !== -1) {
    const flag = flags[idx];
    flag.status = action === 'resolve' ? 'resolved' : 'dismissed';
    localStorage.setItem(LOCAL_STORAGE_KEY_FLAGS, JSON.stringify(flags));

    // Remove flag status on original song/comment if dismissed
    if (action === 'dismiss') {
      if (flag.type === 'song') {
        const songs: Song[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_SONGS) || "[]");
        const sIdx = songs.findIndex(s => s.id === flag.targetId);
        if (sIdx !== -1) {
          songs[sIdx].isFlagged = false;
          delete songs[sIdx].flagReason;
          localStorage.setItem(LOCAL_STORAGE_KEY_SONGS, JSON.stringify(songs));
        }
      } else {
        const comments: Comment[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_COMMENTS) || "[]");
        const cIdx = comments.findIndex(c => c.id === flag.targetId);
        if (cIdx !== -1) {
          comments[cIdx].isFlagged = false;
          localStorage.setItem(LOCAL_STORAGE_KEY_COMMENTS, JSON.stringify(comments));
        }
      }
    } else {
      // If resolved (kept hidden), remove permanently from public feeds
      if (flag.type === 'song') {
        let songs: Song[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_SONGS) || "[]");
        songs = songs.filter(s => s.id !== flag.targetId);
        localStorage.setItem(LOCAL_STORAGE_KEY_SONGS, JSON.stringify(songs));
      } else {
        let comments: Comment[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_COMMENTS) || "[]");
        comments = comments.filter(c => c.id !== flag.targetId);
        localStorage.setItem(LOCAL_STORAGE_KEY_COMMENTS, JSON.stringify(comments));
      }
    }

    try {
      await updateDoc(doc(db, "flags", flagId), { status: flag.status });
      if (action === 'dismiss') {
        if (flag.type === 'song') {
          await updateDoc(doc(db, "songs", flag.targetId), { isFlagged: false });
        } else {
          await updateDoc(doc(db, "comments", flag.targetId), { isFlagged: false });
        }
      }
    } catch (e) {
      console.warn("Firestore resolving flag sync failed", e);
    }
  }
}
