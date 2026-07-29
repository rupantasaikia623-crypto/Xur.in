import { Song, Comment, SongVersion, UserProfile, FlagReport, UserFeedback, UserActivity } from '../types';
import { supabase } from './supabase';

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

// Local Storage Fallback Keys
const LOCAL_STORAGE_KEY_SONGS = "xur_local_songs";
const LOCAL_STORAGE_KEY_COMMENTS = "xur_local_comments";
const LOCAL_STORAGE_KEY_VERSIONS = "xur_local_versions";
const LOCAL_STORAGE_KEY_PROFILE = "xur_local_profile";
const LOCAL_STORAGE_KEY_FLAGS = "xur_local_flags";
const LOCAL_STORAGE_KEY_FEEDBACKS = "xur_local_feedbacks";
const LOCAL_STORAGE_KEY_ACTIVITIES = "xur_local_activities";

function initializeLocalDb() {
  if (!localStorage.getItem(LOCAL_STORAGE_KEY_SONGS)) {
    localStorage.setItem(LOCAL_STORAGE_KEY_SONGS, JSON.stringify(SEED_SONGS));
  }
}

if (typeof window !== "undefined") {
  initializeLocalDb();
}

// -------------------------------------------------------------
// USER PROFILES (SUPABASE + LOCAL FALLBACK)
// -------------------------------------------------------------

export async function getProfile(uid: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', uid)
      .maybeSingle();

    if (!error && data) {
      return {
        uid: data.id,
        email: data.email || '',
        displayName: data.display_name || 'User',
        avatarUrl: data.avatar_url || undefined,
        bio: data.bio || undefined,
        role: data.role || 'user',
        favorites: data.favorites || [],
        following: data.following || [],
        followers: data.followers || [],
        submittedSongs: data.submitted_songs || [],
        createdAt: data.created_at || new Date().toISOString()
      };
    }
  } catch (e) {
    console.warn("Supabase getProfile error:", e);
  }

  // Local fallback
  const profiles = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_PROFILE) || "{}");
  return profiles[uid] || null;
}

export async function saveProfile(profile: UserProfile): Promise<void> {
  try {
    await supabase.from('profiles').upsert({
      id: profile.uid,
      email: profile.email,
      display_name: profile.displayName,
      avatar_url: profile.avatarUrl || null,
      bio: profile.bio || null,
      role: profile.role || 'user',
      favorites: profile.favorites || [],
      following: profile.following || [],
      followers: profile.followers || [],
      submitted_songs: profile.submittedSongs || [],
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' });
  } catch (e) {
    console.warn("Supabase saveProfile error:", e);
  }

  // Local fallback
  const profiles = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_PROFILE) || "{}");
  profiles[profile.uid] = profile;
  localStorage.setItem(LOCAL_STORAGE_KEY_PROFILE, JSON.stringify(profiles));
}

// -------------------------------------------------------------
// SONGS (SUPABASE + LOCAL FALLBACK)
// -------------------------------------------------------------

export async function fetchSongs(filter?: { language?: string; genre?: string; queryText?: string }): Promise<Song[]> {
  let songs: Song[] = [];

  try {
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      songs = data.map((d: any) => ({
        id: d.id,
        title: d.title,
        artist: d.artist,
        language: d.language,
        album: d.album || 'Single',
        releaseYear: d.release_year || 2024,
        genre: d.genre || 'Folk',
        tags: d.tags || [],
        lyrics: d.lyrics,
        transliteration: d.transliteration || '',
        translation: d.translation || '',
        youtubeLink: d.youtube_link || '',
        submittedBy: d.submitted_by || 'system',
        submittedByUsername: d.submitted_by_username || 'Xur Moderator',
        createdAt: d.created_at,
        views: d.views || 0,
        upvotesCount: d.upvotes_count || 0,
        upvotedBy: d.upvoted_by || [],
        commentsCount: d.comments_count || 0,
        isFlagged: d.is_flagged || false,
        flagReason: d.flag_reason || undefined
      }));
    } else if (!error && (!data || data.length === 0)) {
      // Seed songs into Supabase table if it's currently empty
      for (const s of SEED_SONGS) {
        await supabase.from('songs').upsert({
          id: s.id,
          title: s.title,
          artist: s.artist,
          language: s.language,
          album: s.album,
          release_year: s.releaseYear,
          genre: s.genre,
          tags: s.tags,
          lyrics: s.lyrics,
          transliteration: s.transliteration,
          translation: s.translation,
          youtube_link: s.youtubeLink,
          submitted_by: s.submittedBy,
          submitted_by_username: s.submittedByUsername,
          created_at: s.createdAt,
          views: s.views,
          upvotes_count: s.upvotesCount,
          upvoted_by: s.upvotedBy,
          comments_count: s.commentsCount,
          is_flagged: s.isFlagged
        }, { onConflict: 'id' });
      }
      songs = SEED_SONGS as Song[];
    }
  } catch (e) {
    console.warn("Supabase fetchSongs error, fallback to local:", e);
    songs = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_SONGS) || "[]");
  }

  // Merge user submitted lyrics if any exist
  for (const song of songs) {
    const userLyrics = await getLatestUserLyrics(song.id);
    if (userLyrics) {
      song.lyrics = userLyrics.lyrics;
      if (userLyrics.transliteration) song.transliteration = userLyrics.transliteration;
      if (userLyrics.translation) song.translation = userLyrics.translation;
      song.hasUserSubmitted = true;
    }
  }

  // Apply filters
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

  return songs;
}

export async function getSongById(id: string): Promise<Song | null> {
  let song: Song | null = null;

  try {
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (!error && data) {
      song = {
        id: data.id,
        title: data.title,
        artist: data.artist,
        language: data.language,
        album: data.album,
        releaseYear: data.release_year,
        genre: data.genre,
        tags: data.tags || [],
        lyrics: data.lyrics,
        transliteration: data.transliteration || '',
        translation: data.translation || '',
        youtubeLink: data.youtube_link || '',
        submittedBy: data.submitted_by,
        submittedByUsername: data.submitted_by_username,
        createdAt: data.created_at,
        views: (data.views || 0) + 1,
        upvotesCount: data.upvotes_count || 0,
        upvotedBy: data.upvoted_by || [],
        commentsCount: data.comments_count || 0,
        isFlagged: data.is_flagged || false,
        flagReason: data.flag_reason || undefined
      };

      // Increment view count in Supabase asynchronously
      supabase.from('songs').update({ views: song.views }).eq('id', id).then();
    }
  } catch (e) {
    console.warn("Supabase getSongById error:", e);
  }

  if (!song) {
    const songs: Song[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_SONGS) || "[]");
    const idx = songs.findIndex(s => s.id === id);
    if (idx !== -1) {
      songs[idx].views += 1;
      localStorage.setItem(LOCAL_STORAGE_KEY_SONGS, JSON.stringify(songs));
      song = songs[idx];
    }
  }

  if (song) {
    const userLyrics = await getLatestUserLyrics(id);
    if (userLyrics) {
      song.lyrics = userLyrics.lyrics;
      song.transliteration = userLyrics.transliteration || "";
      song.translation = userLyrics.translation || "";
      song.hasUserSubmitted = true;
    } else {
      song.hasUserSubmitted = false;
    }
  }

  return song;
}

export async function addSong(songInput: Omit<Song, "id" | "createdAt" | "views" | "upvotesCount" | "upvotedBy" | "commentsCount" | "isFlagged">): Promise<string> {
  const newId = songInput.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now().toString().slice(-4);
  const createdAt = new Date().toISOString();
  
  const newSong: Song = {
    ...songInput,
    id: newId,
    createdAt,
    views: 0,
    upvotesCount: 0,
    upvotedBy: [],
    commentsCount: 0,
    isFlagged: false
  };

  try {
    await supabase.from('songs').insert({
      id: newId,
      title: newSong.title,
      artist: newSong.artist,
      language: newSong.language,
      album: newSong.album,
      release_year: newSong.releaseYear,
      genre: newSong.genre,
      tags: newSong.tags,
      lyrics: newSong.lyrics,
      transliteration: newSong.transliteration,
      translation: newSong.translation,
      youtube_link: newSong.youtubeLink,
      submitted_by: newSong.submittedBy,
      submitted_by_username: newSong.submittedByUsername,
      created_at: createdAt,
      views: 0,
      upvotes_count: 0,
      upvoted_by: [],
      comments_count: 0,
      is_flagged: false
    });

    const initialVersion: SongVersion = {
      id: "v-initial-" + Date.now(),
      songId: newId,
      lyrics: newSong.lyrics,
      transliteration: newSong.transliteration,
      translation: newSong.translation,
      editedBy: newSong.submittedBy,
      editedByUsername: newSong.submittedByUsername,
      editNotes: "Initial lyrics submission",
      createdAt
    };

    await supabase.from('song_versions').insert({
      id: initialVersion.id,
      song_id: newId,
      lyrics: newSong.lyrics,
      transliteration: newSong.transliteration,
      translation: newSong.translation,
      edited_by: newSong.submittedBy,
      edited_by_username: newSong.submittedByUsername,
      edit_notes: "Initial lyrics submission",
      created_at: createdAt
    });
  } catch (e) {
    console.warn("Supabase addSong error:", e);
  }

  // Local fallback
  const songs = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_SONGS) || "[]");
  songs.push(newSong);
  localStorage.setItem(LOCAL_STORAGE_KEY_SONGS, JSON.stringify(songs));

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
  const createdAt = new Date().toISOString();

  try {
    await supabase.from('song_versions').insert({
      id: versionId,
      song_id: songId,
      lyrics: updates.lyrics,
      transliteration: updates.transliteration || '',
      translation: updates.translation || '',
      edited_by: editorId,
      edited_by_username: editorName,
      edit_notes: editNotes,
      created_at: createdAt
    });

    await supabase.from('user_submitted_lyrics').upsert({
      song_id: songId,
      lyrics: updates.lyrics,
      transliteration: updates.transliteration || '',
      translation: updates.translation || '',
      submitted_by: editorId,
      submitted_by_username: editorName,
      created_at: createdAt
    }, { onConflict: 'song_id' });
  } catch (e) {
    console.warn("Supabase editSongLyrics error:", e);
  }

  // Fallback / Local Storage
  const userLyricsData = {
    songId,
    lyrics: updates.lyrics,
    transliteration: updates.transliteration || "",
    translation: updates.translation || "",
    submittedBy: editorId,
    submittedByUsername: editorName,
    createdAt
  };
  localStorage.setItem(`xur_user_submitted_lyrics_${songId}`, JSON.stringify(userLyricsData));
}

export async function getLatestUserLyrics(songId: string): Promise<any | null> {
  try {
    const { data, error } = await supabase
      .from('user_submitted_lyrics')
      .select('*')
      .eq('song_id', songId)
      .maybeSingle();

    if (!error && data) {
      return {
        songId: data.song_id,
        lyrics: data.lyrics,
        transliteration: data.transliteration,
        translation: data.translation,
        submittedBy: data.submitted_by,
        submittedByUsername: data.submitted_by_username,
        createdAt: data.created_at
      };
    }
  } catch (e) {
    console.warn("Supabase getLatestUserLyrics error:", e);
  }

  if (typeof window !== "undefined") {
    const local = localStorage.getItem(`xur_user_submitted_lyrics_${songId}`);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {}
    }
  }

  return null;
}

export async function deleteUserSubmittedLyrics(songId: string): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.removeItem(`xur_user_submitted_lyrics_${songId}`);
  }

  try {
    await supabase.from('user_submitted_lyrics').delete().eq('song_id', songId);
  } catch (e) {
    console.warn("Supabase deleteUserSubmittedLyrics error:", e);
  }
}

export async function fetchSongVersions(songId: string): Promise<SongVersion[]> {
  try {
    const { data, error } = await supabase
      .from('song_versions')
      .select('*')
      .eq('song_id', songId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      return data.map((d: any) => ({
        id: d.id,
        songId: d.song_id,
        lyrics: d.lyrics,
        transliteration: d.transliteration,
        translation: d.translation,
        editedBy: d.edited_by,
        editedByUsername: d.edited_by_username,
        editNotes: d.edit_notes,
        createdAt: d.created_at
      }));
    }
  } catch (e) {
    console.warn("Supabase fetchSongVersions error:", e);
  }

  const versions: SongVersion[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_VERSIONS) || "[]");
  return versions
    .filter(v => v.songId === songId)
    .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function toggleSongUpvote(songId: string, userId: string): Promise<{ upvoted: boolean; count: number }> {
  try {
    const { data: song } = await supabase.from('songs').select('upvoted_by, upvotes_count').eq('id', songId).single();
    if (song) {
      const upvotedBy: string[] = song.upvoted_by || [];
      const hasUpvoted = upvotedBy.includes(userId);
      let updatedList = [];
      let newCount = song.upvotes_count || 0;

      if (hasUpvoted) {
        updatedList = upvotedBy.filter(id => id !== userId);
        newCount = Math.max(0, newCount - 1);
      } else {
        updatedList = [...upvotedBy, userId];
        newCount += 1;
      }

      await supabase.from('songs').update({
        upvoted_by: updatedList,
        upvotes_count: newCount
      }).eq('id', songId);

      return { upvoted: !hasUpvoted, count: newCount };
    }
  } catch (e) {
    console.warn("Supabase toggleSongUpvote error:", e);
  }

  // Local fallback
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

// -------------------------------------------------------------
// COMMENTS (SUPABASE + LOCAL FALLBACK)
// -------------------------------------------------------------

export async function fetchComments(songId: string): Promise<Comment[]> {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('song_id', songId)
      .order('created_at', { ascending: true });

    if (!error && data) {
      return data.map((d: any) => ({
        id: d.id,
        songId: d.song_id,
        userId: d.user_id,
        username: d.username,
        avatarUrl: d.user_avatar || d.avatar_url,
        content: d.content,
        parentId: d.parent_id,
        upvotes: d.upvotes || [],
        reactions: d.reactions || {},
        createdAt: d.created_at,
        isFlagged: d.is_flagged || false
      }));
    }
  } catch (e) {
    console.warn("Supabase fetchComments error:", e);
  }

  const comments: Comment[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_COMMENTS) || "[]");
  return comments
    .filter(c => c.songId === songId && !c.isFlagged)
    .sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export async function addComment(commentInput: Omit<Comment, "id" | "createdAt" | "upvotes" | "reactions" | "isFlagged">): Promise<Comment> {
  const newId = "c-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6);
  const createdAt = new Date().toISOString();

  const newComment: Comment = {
    ...commentInput,
    id: newId,
    upvotes: [],
    reactions: {},
    createdAt,
    isFlagged: false
  };

  try {
    await supabase.from('comments').insert({
      id: newId,
      song_id: commentInput.songId,
      user_id: commentInput.userId,
      username: commentInput.username,
      user_avatar: commentInput.avatarUrl || null,
      content: commentInput.content,
      parent_id: commentInput.parentId || null,
      upvotes: [],
      reactions: {},
      created_at: createdAt,
      is_flagged: false
    });

    // Increment comment count on song
    const { data: song } = await supabase.from('songs').select('comments_count').eq('id', commentInput.songId).single();
    if (song) {
      await supabase.from('songs').update({ comments_count: (song.comments_count || 0) + 1 }).eq('id', commentInput.songId);
    }
  } catch (e) {
    console.warn("Supabase addComment error:", e);
  }

  // Local fallback
  const comments = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_COMMENTS) || "[]");
  comments.push(newComment);
  localStorage.setItem(LOCAL_STORAGE_KEY_COMMENTS, JSON.stringify(comments));

  return newComment;
}

export async function toggleCommentUpvote(commentId: string, userId: string): Promise<Comment | null> {
  try {
    const { data: comment } = await supabase.from('comments').select('*').eq('id', commentId).single();
    if (comment) {
      const upvotes: string[] = comment.upvotes || [];
      const userIdx = upvotes.indexOf(userId);
      let updatedUpvotes = [];
      if (userIdx !== -1) {
        updatedUpvotes = upvotes.filter(u => u !== userId);
      } else {
        updatedUpvotes = [...upvotes, userId];
      }

      await supabase.from('comments').update({ upvotes: updatedUpvotes }).eq('id', commentId);

      return {
        id: comment.id,
        songId: comment.song_id,
        userId: comment.user_id,
        username: comment.username,
        avatarUrl: comment.user_avatar || comment.avatar_url,
        content: comment.content,
        parentId: comment.parent_id,
        upvotes: updatedUpvotes,
        reactions: comment.reactions || {},
        createdAt: comment.created_at,
        isFlagged: comment.is_flagged || false
      };
    }
  } catch (e) {
    console.warn("Supabase toggleCommentUpvote error:", e);
  }

  // Local fallback
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
    return comment;
  }

  return null;
}

export async function addCommentReaction(commentId: string, emoji: string, userId: string): Promise<Comment | null> {
  try {
    const { data: comment } = await supabase.from('comments').select('*').eq('id', commentId).single();
    if (comment) {
      const reactions = comment.reactions || {};
      if (!reactions[emoji]) reactions[emoji] = [];
      const userIdx = reactions[emoji].indexOf(userId);
      if (userIdx !== -1) {
        reactions[emoji].splice(userIdx, 1);
        if (reactions[emoji].length === 0) delete reactions[emoji];
      } else {
        reactions[emoji].push(userId);
      }

      await supabase.from('comments').update({ reactions }).eq('id', commentId);

      return {
        id: comment.id,
        songId: comment.song_id,
        userId: comment.user_id,
        username: comment.username,
        avatarUrl: comment.user_avatar || comment.avatar_url,
        content: comment.content,
        parentId: comment.parent_id,
        upvotes: comment.upvotes || [],
        reactions,
        createdAt: comment.created_at,
        isFlagged: comment.is_flagged || false
      };
    }
  } catch (e) {
    console.warn("Supabase addCommentReaction error:", e);
  }

  // Local fallback
  const comments: Comment[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_COMMENTS) || "[]");
  const idx = comments.findIndex(c => c.id === commentId);
  if (idx !== -1) {
    const comment = comments[idx];
    if (!comment.reactions) comment.reactions = {};
    if (!comment.reactions[emoji]) comment.reactions[emoji] = [];
    const userIdx = comment.reactions[emoji].indexOf(userId);
    if (userIdx !== -1) {
      comment.reactions[emoji].splice(userIdx, 1);
      if (comment.reactions[emoji].length === 0) delete comment.reactions[emoji];
    } else {
      comment.reactions[emoji].push(userId);
    }
    localStorage.setItem(LOCAL_STORAGE_KEY_COMMENTS, JSON.stringify(comments));
    return comment;
  }

  return null;
}

// -------------------------------------------------------------
// FEEDBACK & CONTACT FORMS (SUPABASE + LOCAL FALLBACK)
// -------------------------------------------------------------

export async function submitFeedback(
  rating: number,
  category: 'bug' | 'suggestion' | 'praise' | 'other',
  message: string,
  userId?: string,
  username?: string,
  songId?: string,
  songTitle?: string
): Promise<UserFeedback> {
  const feedback: UserFeedback = {
    id: `fb_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    userId: userId || 'anonymous',
    username: username || 'Guest User',
    rating,
    category,
    message,
    createdAt: new Date().toISOString(),
    songId: songId || undefined,
    songTitle: songTitle || undefined
  };

  try {
    await supabase.from('feedbacks').insert({
      id: feedback.id,
      user_id: feedback.userId,
      username: feedback.username,
      rating: feedback.rating,
      category: feedback.category,
      message: feedback.message,
      song_id: feedback.songId || null,
      song_title: feedback.songTitle || null,
      created_at: feedback.createdAt
    });
  } catch (e) {
    console.warn("Supabase submitFeedback error:", e);
  }

  // Local sync
  const localFbs = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_FEEDBACKS) || "[]");
  localFbs.unshift(feedback);
  localStorage.setItem(LOCAL_STORAGE_KEY_FEEDBACKS, JSON.stringify(localFbs));

  return feedback;
}

export async function fetchFeedback(): Promise<UserFeedback[]> {
  try {
    const { data, error } = await supabase
      .from('feedbacks')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      return data.map((d: any) => ({
        id: d.id,
        userId: d.user_id,
        username: d.username,
        rating: d.rating,
        category: d.category,
        message: d.message,
        createdAt: d.created_at,
        songId: d.song_id,
        songTitle: d.song_title
      }));
    }
  } catch (e) {
    console.warn("Supabase fetchFeedback error:", e);
  }

  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_FEEDBACKS) || "[]");
}

export async function deleteFeedback(feedbackId: string): Promise<void> {
  try {
    await supabase.from('feedbacks').delete().eq('id', feedbackId);
  } catch (e) {
    console.warn("Supabase deleteFeedback error:", e);
  }

  const localFbs = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_FEEDBACKS) || "[]");
  const updated = localFbs.filter((fb: UserFeedback) => fb.id !== feedbackId);
  localStorage.setItem(LOCAL_STORAGE_KEY_FEEDBACKS, JSON.stringify(updated));
}

export async function submitContactMessage(
  name: string,
  email: string,
  subject: string,
  message: string
): Promise<void> {
  if (!email || !message) throw new Error("Email and message are required.");

  try {
    await supabase.from('contact_messages').insert({
      name,
      email,
      subject,
      message,
      created_at: new Date().toISOString()
    });
  } catch (e) {
    console.warn("Supabase submitContactMessage error:", e);
  }
}

export async function submitSubscriber(email: string): Promise<void> {
  if (!email) throw new Error("Email is required.");

  try {
    await supabase.from('subscribers').upsert({
      email,
      created_at: new Date().toISOString()
    }, { onConflict: 'email' });
  } catch (e) {
    console.warn("Supabase submitSubscriber error:", e);
  }
}

// -------------------------------------------------------------
// USER ACTIVITIES (SUPABASE + LOCAL FALLBACK)
// -------------------------------------------------------------

export async function logUserActivity(
  actionType: 'upvote' | 'comment' | 'song_submit' | 'lyrics_edit' | 'feedback_submit' | 'share' | 'visit',
  details: string,
  songId?: string,
  userId?: string,
  username?: string
): Promise<UserActivity> {
  const activity: UserActivity = {
    id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    userId: userId || 'anonymous',
    username: username || 'Guest User',
    actionType,
    details,
    songId: songId || undefined,
    createdAt: new Date().toISOString()
  };

  try {
    await supabase.from('user_activities').insert({
      id: activity.id,
      user_id: activity.userId,
      username: activity.username,
      action_type: activity.actionType,
      details: activity.details,
      song_id: activity.songId || null,
      created_at: activity.createdAt
    });
  } catch (e) {
    console.warn("Supabase logUserActivity error:", e);
  }

  const localActs = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_ACTIVITIES) || "[]");
  localActs.unshift(activity);
  if (localActs.length > 100) localActs.pop();
  localStorage.setItem(LOCAL_STORAGE_KEY_ACTIVITIES, JSON.stringify(localActs));

  return activity;
}

export async function fetchUserActivities(): Promise<UserActivity[]> {
  try {
    const { data, error } = await supabase
      .from('user_activities')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(25);

    if (!error && data) {
      return data.map((d: any) => ({
        id: d.id,
        userId: d.user_id,
        username: d.username,
        actionType: d.action_type,
        details: d.details,
        songId: d.song_id,
        createdAt: d.created_at
      }));
    }
  } catch (e) {
    console.warn("Supabase fetchUserActivities error:", e);
  }

  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_ACTIVITIES) || "[]");
}

// -------------------------------------------------------------
// MODERATION & FLAGS (SUPABASE + LOCAL FALLBACK)
// -------------------------------------------------------------

export async function reportFlag(report: Omit<FlagReport, "id" | "createdAt" | "status">): Promise<void> {
  const newReport: FlagReport = {
    ...report,
    id: "flag-" + Date.now(),
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  try {
    await supabase.from('flags').insert({
      id: newReport.id,
      type: newReport.type,
      target_id: newReport.targetId,
      song_id: newReport.songId || null,
      reason: newReport.reason,
      details: newReport.details || '',
      reported_by: newReport.reportedBy,
      reported_by_username: newReport.reportedByUsername || 'Anonymous',
      status: 'pending',
      created_at: newReport.createdAt
    });

    if (report.type === 'song') {
      await supabase.from('songs').update({ is_flagged: true, flag_reason: report.reason }).eq('id', report.targetId);
    } else {
      await supabase.from('comments').update({ is_flagged: true }).eq('id', report.targetId);
    }
  } catch (e) {
    console.warn("Supabase reportFlag error:", e);
  }

  const flags = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_FLAGS) || "[]");
  flags.push(newReport);
  localStorage.setItem(LOCAL_STORAGE_KEY_FLAGS, JSON.stringify(flags));
}

export async function fetchFlags(): Promise<FlagReport[]> {
  try {
    const { data, error } = await supabase
      .from('flags')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      return data.map((d: any) => ({
        id: d.id,
        type: d.type,
        targetId: d.target_id,
        songId: d.song_id || '',
        reason: d.reason,
        details: d.details || '',
        reportedBy: d.reported_by,
        reportedByUsername: d.reported_by_username || 'Anonymous',
        status: d.status,
        createdAt: d.created_at
      }));
    }
  } catch (e) {
    console.warn("Supabase fetchFlags error:", e);
  }

  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_FLAGS) || "[]");
}

export async function resolveFlag(flagId: string, action: 'resolve' | 'dismiss'): Promise<void> {
  try {
    await supabase.from('flags').update({ status: action === 'resolve' ? 'resolved' : 'dismissed' }).eq('id', flagId);
    const { data: flag } = await supabase.from('flags').select('*').eq('id', flagId).single();
    if (flag) {
      if (action === 'dismiss') {
        if (flag.type === 'song') {
          await supabase.from('songs').update({ is_flagged: false, flag_reason: null }).eq('id', flag.target_id);
        } else {
          await supabase.from('comments').update({ is_flagged: false }).eq('id', flag.target_id);
        }
      } else {
        if (flag.type === 'song') {
          await supabase.from('songs').delete().eq('id', flag.target_id);
        } else {
          await supabase.from('comments').delete().eq('id', flag.target_id);
        }
      }
    }
  } catch (e) {
    console.warn("Supabase resolveFlag error:", e);
  }
}

export async function fetchUsers(): Promise<UserProfile[]> {
  try {
    const { data, error } = await supabase.from('profiles').select('*');
    if (!error && data) {
      return data.map((d: any) => ({
        uid: d.id,
        email: d.email || '',
        displayName: d.display_name || 'User',
        avatarUrl: d.avatar_url || undefined,
        bio: d.bio || undefined,
        role: d.role || 'user',
        favorites: d.favorites || [],
        following: d.following || [],
        followers: d.followers || [],
        submittedSongs: d.submitted_songs || [],
        createdAt: d.created_at
      }));
    }
  } catch (e) {
    console.warn("Supabase fetchUsers error:", e);
  }

  const profiles = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_PROFILE) || "{}");
  return Object.values(profiles);
}

export async function incrementAndGetPageViews(): Promise<number> {
  try {
    const { data } = await supabase.from('system_stats').select('page_views').eq('id', 'stats').maybeSingle();
    let currentViews = data?.page_views || 12480;
    const newViews = currentViews + 1;
    await supabase.from('system_stats').upsert({ id: 'stats', page_views: newViews }, { onConflict: 'id' });
    return newViews;
  } catch (e) {
    console.warn("Supabase page views update error:", e);
  }

  const localViews = Number(localStorage.getItem("xur_local_page_views") || "12480") + 1;
  localStorage.setItem("xur_local_page_views", String(localViews));
  return localViews;
}
