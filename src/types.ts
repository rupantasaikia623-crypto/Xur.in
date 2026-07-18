export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  role: 'user' | 'moderator' | 'admin';
  favorites: string[]; // song IDs
  following: string[]; // user IDs
  followers: string[]; // user IDs
  submittedSongs: string[]; // song IDs
  createdAt: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  language: string; // e.g. Assamese, Bengali, Hindi, English
  album: string;
  releaseYear: number;
  genre: string;
  tags: string[];
  lyrics: string; // Formatting with newline, verses, chorus
  transliteration?: string;
  translation?: string;
  youtubeLink?: string;
  submittedBy: string; // userId
  submittedByUsername: string;
  createdAt: string;
  views: number;
  upvotesCount: number;
  upvotedBy: string[]; // list of user uids
  commentsCount: number;
  isFlagged: boolean;
  flagReason?: string;
  currentVersionId?: string;
}

export interface Comment {
  id: string;
  songId: string;
  userId: string;
  username: string;
  avatarUrl?: string;
  content: string;
  quotedLine?: string; // Highlighted line being discussed
  parentId: string | null; // null for top-level, commentId for replies
  upvotes: string[]; // user IDs who upvoted
  reactions: Record<string, string[]>; // e.g., { "❤️": ["user1"], "💡": ["user2"] }
  createdAt: string;
  isFlagged: boolean;
}

export interface SongVersion {
  id: string;
  songId: string;
  lyrics: string;
  transliteration?: string;
  translation?: string;
  editedBy: string; // userId
  editedByUsername: string;
  editNotes: string;
  createdAt: string;
}

export interface FlagReport {
  id: string;
  type: 'song' | 'comment';
  targetId: string; // songId or commentId
  songId: string; // context song page
  reason: string;
  details: string;
  reportedBy: string;
  reportedByUsername: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}
