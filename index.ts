export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  phone: string;
  email: string;
  isOnline: boolean;
  lastSeen: string;
  joinedDate: string;
  verified: boolean;
  mutualFriends?: number;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  type: 'text' | 'payment' | 'image';
  paymentAmount?: number;
  paymentCurrency?: string;
  status: 'sent' | 'delivered' | 'read';
}

export interface Conversation {
  id: string;
  participant: User;
  messages: Message[];
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
  isPinned?: boolean;
}

export interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'exchange' | 'topup';
  amount: number;
  currency: string;
  toFrom: string;
  toFromAvatar?: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  note?: string;
}

export interface WalletBalance {
  currency: string;
  symbol: string;
  amount: number;
  usdValue: number;
  change24h: number;
  flag?: string;
  color: string;
}

export interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
}

export interface Contact {
  user: User;
  isFavorite: boolean;
  addedDate: string;
}

export interface ExplorePost {
  id: string;
  author: User;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  tags: string[];
  isLiked: boolean;
  isBookmarked?: boolean;
}

export interface GroupChat {
  id: string;
  name: string;
  description: string;
  avatar: string;
  members: User[];
  adminId: string;
  messages: Message[];
  createdAt: string;
  isPinned?: boolean;
  unreadCount?: number;
}

export interface MessageReaction {
  messageId: string;
  userId: string;
  emoji: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  type: 'message' | 'payment' | 'follow' | 'like' | 'comment' | 'mention';
  title: string;
  description: string;
  avatar?: string;
  read: boolean;
  timestamp: string;
  actionUrl?: string;
  relatedUser?: User;
}

export interface UserPreferences {
  darkMode: boolean;
  notifications: {
    messages: boolean;
    payments: boolean;
    socialActivity: boolean;
    soundEnabled: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'followers' | 'private';
    lastSeenVisible: boolean;
    allowMessages: 'everyone' | 'followers' | 'none';
  };
  blockedUsers: string[];
  followingUsers: string[];
}

export interface CommentData {
  id: string;
  postId: string;
  author: User;
  text: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies?: CommentData[];
}

export interface SearchResult {
  id: string;
  type: 'user' | 'conversation' | 'post' | 'contact';
  title: string;
  description?: string;
  avatar?: string;
  timestamp?: string;
}

export interface MessageWithReactions extends Message {
  reactions?: MessageReaction[];
  replyTo?: string;
  replyToSender?: string;
  pinned?: boolean;
  image?: string;
  edited?: boolean;
  typingUsers?: string[];
}
