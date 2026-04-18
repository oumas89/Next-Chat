import type { User, Conversation, Message, WalletBalance, Transaction, ExchangeRate, Contact, ExplorePost, GroupChat, Notification, UserPreferences } from '@/types';

export const CURRENT_USER: User = {
    id: 'me',
    name: 'Alex Morgan',
    username: '@alexmorgan',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
    bio: 'Digital nomad • Finance & Tech enthusiast 🌍',
    phone: '+1 (555) 012-3456',
    email: 'alex.morgan@email.com',
    isOnline: true,
    lastSeen: 'now',
    joinedDate: 'January 2024',
    verified: true,
};

export const USERS: User[] = [
    {
        id: 'u1',
        name: 'Sarah Chen',
        username: '@sarahchen',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
        bio: 'Product designer & crypto enthusiast',
        phone: '+1 (555) 123-4567',
        email: 'sarah.chen@email.com',
        isOnline: true,
        lastSeen: 'now',
        joinedDate: 'Jan 2024',
        verified: true,
        mutualFriends: 5,
    },
    {
        id: 'u2',
        name: 'Marcus Johnson',
        username: '@marcusj',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        bio: 'Blockchain developer',
        phone: '+1 (555) 234-5678',
        email: 'marcus.j@email.com',
        isOnline: false,
        lastSeen: '1h ago',
        joinedDate: 'Feb 2024',
        verified: true,
        mutualFriends: 3,
    },
    {
        id: 'u3',
        name: 'Priya Patel',
        username: '@priyap',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        bio: 'Fintech founder',
        phone: '+1 (555) 345-6789',
        email: 'priya.patel@email.com',
        isOnline: true,
        lastSeen: '3h ago',
        joinedDate: 'March 2024',
        verified: false,
        mutualFriends: 2,
    },
    {
        id: 'u4',
        name: 'Taylor Swift',
        username: '@taylorswift',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
        bio: 'Artist & investor',
        phone: '',
        email: '',
        isOnline: false,
        lastSeen: '2 days ago',
        joinedDate: 'April 2024',
        verified: true,
        mutualFriends: 3,
    },
    {
        id: 'u5',
        name: 'Ryan Park',
        username: '@ryanpark',
        avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face',
        bio: 'Data scientist',
        phone: '',
        email: '',
        isOnline: true,
        lastSeen: 'now',
        joinedDate: 'May 2024',
        verified: false,
        mutualFriends: 7,
    },
    {
        id: 'u6',
        name: 'Nina Brooks',
        username: '@ninabrooks',
        avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
        bio: 'Marketing lead',
        phone: '',
        email: '',
        isOnline: false,
        lastSeen: '5h ago',
        joinedDate: 'June 2024',
        verified: false,
        mutualFriends: 2,
    },
    {
        id: 'u7',
        name: 'Maya Singh',
        username: '@mayasingh',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
        bio: 'Blockchain product manager',
        phone: '+1 (555) 222-3333',
        email: 'maya.singh@email.com',
        isOnline: true,
        lastSeen: 'now',
        joinedDate: 'May 2024',
        verified: false,
    },
    {
        id: 'u8',
        name: 'Noah Martinez',
        username: '@noahmartinez',
        avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=150&h=150&fit=crop&crop=face',
        bio: 'Freelance developer',
        phone: '+1 (555) 444-5555',
        email: 'noah.martinez@email.com',
        isOnline: false,
        lastSeen: '1h ago',
        joinedDate: 'April 2024',
        verified: false,
    },
    {
        id: 'u9',
        name: 'Ava Kim',
        username: '@avakim',
        avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150&h=150&fit=crop&crop=face',
        bio: 'Startup growth lead',
        phone: '+1 (555) 666-7777',
        email: 'ava.kim@email.com',
        isOnline: true,
        lastSeen: 'now',
        joinedDate: 'June 2024',
        verified: true,
    },
];

export const CONVERSATIONS: Conversation[] = [
    {
        id: 'c1',
        participant: USERS[0],
        messages: [
            {
                id: 'm1',
                senderId: 'u1',
                text: 'Hey! Did you get the transfer I sent?',
                timestamp: '10:30 AM',
                type: 'text',
                status: 'read',
            },
            {
                id: 'm2',
                senderId: 'me',
                text: 'Yes! Got it, thank you so much 🙏',
                timestamp: '10:31 AM',
                type: 'text',
                status: 'read',
            },
        ],
        lastMessage: 'Just sent you $50 for the dinner!',
        lastTime: '2:15 PM',
        unreadCount: 2,
        isPinned: true,
    },
    {
        id: 'c2',
        participant: USERS[1],
        messages: [
            {
                id: 'm1',
                senderId: 'me',
                text: 'Marcus, what do you think about BTC right now?',
                timestamp: 'Yesterday',
                type: 'text',
                status: 'read',
            },
            {
                id: 'm2',
                senderId: 'u2',
                text: 'Bullish long term but volatile short term. DCA is the way.',
                timestamp: 'Yesterday',
                type: 'text',
                status: 'read',
            },
        ],
        lastMessage: 'Bullish long term, DCA is the way.',
        lastTime: 'Yesterday',
        unreadCount: 0,
    },
];

export const CONTACTS: Contact[] = [
    {
        user: USERS[0],
        isFavorite: true,
        addedDate: '2024-01-15',
    },
    {
        user: USERS[1],
        isFavorite: false,
        addedDate: '2024-01-10',
    },
    {
        user: USERS[2],
        isFavorite: true,
        addedDate: '2024-03-20',
    },
];

export const WALLET_BALANCES: WalletBalance[] = [
    { currency: 'USD', symbol: '$', amount: 12450.80, usdValue: 12450.80, change24h: 0, flag: '🇺🇸', color: '#16a34a' },
    { currency: 'BDT', symbol: '৳', amount: 85000.00, usdValue: 770.00, change24h: 0.05, flag: '🇧🇩', color: '#dc2626' },
    { currency: 'EUR', symbol: '€', amount: 3200.00, usdValue: 3456.00, change24h: 0.3, flag: '🇪🇺', color: '#1d4ed8' },
    { currency: 'BTC', symbol: '₿', amount: 0.2845, usdValue: 18200.00, change24h: 2.4, flag: '₿', color: '#f59e0b' },
    { currency: 'ETH', symbol: 'Ξ', amount: 3.45, usdValue: 9800.00, change24h: -1.2, flag: 'Ξ', color: '#7c3aed' },
    { currency: 'GBP', symbol: '£', amount: 850.00, usdValue: 1071.00, change24h: 0.1, flag: '🇬🇧', color: '#b91c1c' },
];

export const TRANSACTIONS: Transaction[] = [
    { id: 't1', type: 'receive', amount: 50.00, currency: 'USD', toFrom: 'Sarah Chen', timestamp: 'Today, 2:15 PM', status: 'completed', note: 'Dinner last night' },
    { id: 't2', type: 'send', amount: 120.00, currency: 'USD', toFrom: 'Marcus Johnson', timestamp: 'Today, 9:00 AM', status: 'completed', note: 'Rent split' },
    { id: 't3', type: 'receive', amount: 200.00, currency: 'USD', toFrom: 'Priya Patel', timestamp: 'Yesterday', status: 'completed', note: 'Pitch deck bonus' },
    { id: 't4', type: 'exchange', amount: 500.00, currency: 'USD', toFrom: 'EUR Exchange', timestamp: 'Mon', status: 'completed', note: 'USD → EUR' },
    { id: 't5', type: 'topup', amount: 1000.00, currency: 'USD', toFrom: 'Bank Transfer', timestamp: 'Sun', status: 'completed' },
];

export const EXCHANGE_RATES: ExchangeRate[] = [
    { from: 'USD', to: 'EUR', rate: 0.9256 },
    { from: 'USD', to: 'GBP', rate: 0.7912 },
    { from: 'USD', to: 'BTC', rate: 0.0000156 },
    { from: 'USD', to: 'ETH', rate: 0.000352 },
    { from: 'USD', to: 'BDT', rate: 110.25 },
];

export const EXPLORE_POSTS: ExplorePost[] = [
    {
        id: 'p1',
        author: USERS[0],
        content: 'Just discovered this amazing new payment feature! 💳✨ The instant transfers are game-changing for small businesses.',
        image: '',
        timestamp: '2 hours ago',
        likes: 42,
        comments: 8,
        shares: 3,
        tags: ['payments', 'business'],
        isLiked: false,
    },
    {
        id: 'p2',
        author: USERS[1],
        content: 'Bitcoin hitting new highs! 🚀 What are your thoughts on the current market? #Bitcoin #Crypto',
        image: '',
        timestamp: '4 hours ago',
        likes: 156,
        comments: 23,
        shares: 12,
        tags: ['crypto', 'bitcoin'],
        isLiked: true,
    },
    {
        id: 'p3',
        author: USERS[2],
        content: "Loving the wallet integration! Made my first crypto purchase today. Super smooth experience.",
        image: '',
        timestamp: '6 hours ago',
        likes: 89,
        comments: 12,
        shares: 5,
        tags: ['wallet', 'crypto'],
        isLiked: false,
    },
];

export const TOPICS = ['All', 'Finance', 'Crypto', 'Payments', 'Tech', 'Travel', 'Design'] as const;

export const TRENDING = [
    { tag: '#ConnectPay', count: '12.4K' },
    { tag: '#Bitcoin', count: '89.2K' },
    { tag: '#Fintech', count: '34.1K' },
    { tag: '#RemoteWork', count: '21.7K' },
    { tag: '#Startup', count: '18.9K' },
] as const;

export const STORY_USERS = [
    { name: 'My Story', avatar: CURRENT_USER.avatar, isMe: true, hasStory: false },
    ...USERS.slice(0, 6).map(u => ({ name: u.name.split(' ')[0], avatar: u.avatar, isMe: false, hasStory: true })),
];

export const SUGGESTIONS = [
    { name: 'Taylor Swift', avatar: USERS[3].avatar, mutual: 3, username: '@taylorswift' },
    { name: 'Ryan Park', avatar: USERS[4].avatar, mutual: 7, username: '@ryanpark' },
    { name: 'Nina Brooks', avatar: USERS[5].avatar, mutual: 2, username: '@ninabrooks' },
    { name: 'Liam Chen', avatar: USERS[7].avatar, mutual: 5, username: '@liamchen' },
];

// Group Chats
export const GROUP_CHATS: GroupChat[] = [
    {
        id: 'g1',
        name: 'Crypto Enthusiasts',
        description: 'Discuss crypto trends and investments',
        avatar: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=150&h=150&fit=crop',
        members: [CURRENT_USER, USERS[0], USERS[1], USERS[2]],
        adminId: 'me',
        messages: [
            {
                id: 'gm1',
                senderId: 'u1',
                text: 'Did everyone see the BTC surge?',
                timestamp: '2:30 PM',
                type: 'text',
                status: 'read',
            },
            {
                id: 'gm2',
                senderId: 'u2',
                text: 'Yep! Time to hodl 💎',
                timestamp: '2:32 PM',
                type: 'text',
                status: 'read',
            },
        ],
        createdAt: 'March 2024',
        unreadCount: 0,
    },
    {
        id: 'g2',
        name: 'Startup Squad',
        description: 'Building the future together',
        avatar: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=150&h=150&fit=crop',
        members: [CURRENT_USER, USERS[2], USERS[4], USERS[5]],
        adminId: 'u3',
        messages: [],
        createdAt: 'April 2024',
        unreadCount: 3,
    },
];

// Notifications
export const NOTIFICATIONS: Notification[] = [
    {
        id: 'n1',
        type: 'message',
        title: 'New message from Sarah Chen',
        description: 'Hey! How are you doing?',
        avatar: USERS[0].avatar,
        read: false,
        timestamp: '5 min ago',
        relatedUser: USERS[0],
    },
    {
        id: 'n2',
        type: 'payment',
        title: 'Payment received',
        description: '$50.00 from Marcus Johnson',
        avatar: USERS[1].avatar,
        read: false,
        timestamp: '15 min ago',
        relatedUser: USERS[1],
    },
    {
        id: 'n3',
        type: 'follow',
        title: 'New follower',
        description: 'Priya Patel started following you',
        avatar: USERS[2].avatar,
        read: true,
        timestamp: '1 hour ago',
        relatedUser: USERS[2],
    },
    {
        id: 'n4',
        type: 'like',
        title: 'Someone liked your post',
        description: 'Ryan Park liked your post about fintech',
        avatar: USERS[4].avatar,
        read: true,
        timestamp: '2 hours ago',
        relatedUser: USERS[4],
    },
    {
        id: 'n5',
        type: 'comment',
        title: 'New comment on your post',
        description: 'Nina Brooks: "Love this perspective!"',
        avatar: USERS[5].avatar,
        read: true,
        timestamp: '3 hours ago',
        relatedUser: USERS[5],
    },
];

// User Preferences / Settings
export const DEFAULT_USER_PREFERENCES: UserPreferences = {
    darkMode: false,
    notifications: {
        messages: true,
        payments: true,
        socialActivity: true,
        soundEnabled: true,
    },
    privacy: {
        profileVisibility: 'public',
        lastSeenVisible: true,
        allowMessages: 'everyone',
    },
    blockedUsers: [],
    followingUsers: ['u1', 'u3', 'u5'],
};

// Search History
export const SEARCH_HISTORY: string[] = [
    'bitcoin',
    'fintech news',
    'payment apps',
    'crypto wallets',
];

// User Followers/Following
export const USER_FOLLOWERS: Record<string, string[]> = {
    'me': ['u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7', 'u8', 'u9'],
    'u1': ['me', 'u2', 'u3', 'u7', 'u9'],
    'u2': ['me', 'u1', 'u4', 'u8'],
    'u3': ['me', 'u5', 'u6', 'u9'],
};

export const USER_FOLLOWING: Record<string, string[]> = {
    'me': ['u1', 'u3', 'u5', 'u7', 'u9'],
    'u1': ['me', 'u3', 'u4', 'u6'],
    'u2': ['me', 'u5', 'u7', 'u8'],
    'u3': ['me', 'u1', 'u2', 'u8'],
};

export const CURRENCIES = [
    { code: 'USD', symbol: '$', flag: '🇺🇸', balance: 12450.80 },
    { code: 'BDT', symbol: '৳', flag: '🇧🇩', balance: 85000.00 },
    { code: 'EUR', symbol: '€', flag: '🇪🇺', balance: 3200.00 },
    { code: 'GBP', symbol: '£', flag: '🇬🇧', balance: 850.00 },
    { code: 'BTC', symbol: '₿', flag: '₿', balance: 0.2845 },
];

