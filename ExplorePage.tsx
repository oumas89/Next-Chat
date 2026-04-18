import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, TrendingUp, Hash, Heart, MessageSquare, Share2, Bookmark,
  BadgeCheck, Flame, Plus, X, Camera, Image, Send, Globe, ChevronDown
} from 'lucide-react';
import type { ExplorePost } from '@/types';
import AppLayout from '@/components/layout/AppLayout';
import { toast } from 'sonner';

// Placeholder data - replace with Supabase integration
const CURRENT_USER = {
  id: 'me',
  name: 'Alex Morgan',
  username: '@alexmorgan',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
  bio: '',
  phone: '',
  email: '',
  isOnline: true,
  lastSeen: '',
  joinedDate: '',
  verified: true,
};

const USERS = [
  { id: 'u1', name: 'Sarah Chen', username: '@sarahchen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face', bio: '', phone: '', email: '', isOnline: true, lastSeen: '', joinedDate: '', verified: true },
  { id: 'u2', name: 'Marcus Johnson', username: '@marcusj', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', bio: '', phone: '', email: '', isOnline: false, lastSeen: '', joinedDate: '', verified: true },
];

const EXPLORE_POSTS: ExplorePost[] = [
  {
    id: 'p1',
    author: USERS[0],
    content: 'Just discovered this amazing new payment feature! 💳✨ The instant transfers are game-changing for small businesses.',
    timestamp: '2 hours ago',
    likes: 42,
    comments: 8,
    shares: 3,
    isLiked: false,
    isBookmarked: false,
    tags: ['payments', 'business'],
    images: [],
  },
  {
    id: 'p2',
    author: USERS[1],
    content: 'Bitcoin hitting new highs! 🚀 What are your thoughts on the current market? #Bitcoin #Crypto',
    timestamp: '4 hours ago',
    likes: 156,
    comments: 23,
    shares: 12,
    isLiked: true,
    isBookmarked: true,
    tags: ['crypto', 'bitcoin'],
    images: [],
  },
];

const TOPICS = ['All', 'Finance', 'Crypto', 'Payments', 'Tech', 'Travel', 'Design'];
const TRENDING = [
  { tag: '#ConnectPay', count: '12.4K' },
  { tag: '#Bitcoin', count: '89.2K' },
  { tag: '#Fintech', count: '34.1K' },
  { tag: '#RemoteWork', count: '21.7K' },
  { tag: '#Startup', count: '18.9K' },
];

const STORY_USERS = [
  { name: 'Your Story', avatar: CURRENT_USER.avatar, isMe: true },
  ...USERS.slice(0, 5).map(u => ({ name: u.name.split(' ')[0], avatar: u.avatar, isMe: false })),
];

export default function ExplorePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeTopic, setActiveTopic] = useState('All');
  const [posts, setPosts] = useState(EXPLORE_POSTS);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [commentPost, setCommentPost] = useState<ExplorePost | null>(null);
  const [followingList, setFollowingList] = useState<string[]>([]);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const [storyViewer, setStoryViewer] = useState<{ name: string; avatar: string } | null>(null);

  const toggleLike = (postId: string) => {
    setPosts(prev => prev.map(p =>
      p.id === postId
        ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 }
        : p
    ));
  };

  const toggleSave = (postId: string) => {
    setSavedPosts(prev =>
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    );
    toast.success(savedPosts.includes(postId) ? 'Post unsaved' : 'Post saved!');
  };

  const toggleFollow = (userId: string) => {
    setFollowingList(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
    toast.success(followingList.includes(userId) ? 'Unfollowed' : 'Following!');
  };

  const filteredPosts = posts.filter(p => {
    if (search) {
      return p.content.toLowerCase().includes(search.toLowerCase()) ||
        p.author.name.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    }
    if (activeTopic === 'All') return true;
    return p.tags.some(t => t.toLowerCase().includes(activeTopic.toLowerCase())) ||
      p.content.toLowerCase().includes(activeTopic.toLowerCase());
  });

  return (
    <AppLayout>
      <div className="flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="bg-white px-4 pt-12 pb-3">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Explore</h1>
            <button
              onClick={() => setShowCreatePost(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-brand-600 text-white rounded-full text-sm font-semibold hover:bg-brand-700 active:scale-95 transition-all"
            >
              <Plus size={15} /> Post
            </button>
          </div>
          <div className="relative mb-3">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts, people, topics..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-gray-100 rounded-full text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
          </div>
          {/* Topics */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {TOPICS.map(t => (
              <button
                key={t}
                onClick={() => setActiveTopic(t)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeTopic === t ? 'bg-brand-600 text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {/* Stories Row */}
          <div className="bg-white border-b border-gray-100 px-4 py-3">
            <div className="flex gap-3 overflow-x-auto scrollbar-hide">
              {STORY_USERS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (s.isMe) setShowCreatePost(true);
                    else setStoryViewer({ name: s.name, avatar: s.avatar });
                  }}
                  className="flex flex-col items-center gap-1.5 flex-shrink-0 active:scale-95 transition-transform"
                >
                  <div className={`p-0.5 rounded-full ${!s.isMe ? 'bg-gradient-to-tr from-brand-500 to-gold-400' : 'border-2 border-dashed border-gray-300'}`}>
                    <div className="p-0.5 bg-white rounded-full relative">
                      <img src={s.avatar} alt={s.name} className="w-12 h-12 rounded-full object-cover" />
                      {s.isMe && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-brand-600 rounded-full border-2 border-white flex items-center justify-center">
                          <Plus size={9} className="text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] font-medium text-gray-600 w-14 truncate text-center">{s.isMe ? 'Add Story' : s.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Trending */}
          <div className="bg-white mx-4 mt-3 rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={16} className="text-brand-600" />
              <span className="text-sm font-bold text-gray-800">Trending Now</span>
              <Flame size={14} className="text-orange-500" />
            </div>
            <div className="space-y-2">
              {TRENDING.map((item, i) => (
                <button
                  key={item.tag}
                  onClick={() => { setSearch(item.tag); setActiveTopic('All'); }}
                  className="w-full flex items-center gap-3 hover:bg-gray-50 rounded-xl px-2 py-1.5 transition-colors"
                >
                  <span className="text-xs font-bold text-gray-400 w-4">{i + 1}</span>
                  <div className="flex items-center gap-1.5 flex-1">
                    <Hash size={11} className="text-brand-500" />
                    <span className="text-sm font-semibold text-gray-800">{item.tag.replace('#', '')}</span>
                  </div>
                  <span className="text-xs text-gray-400">{item.count} posts</span>
                </button>
              ))}
            </div>
          </div>

          {/* Posts */}
          <div className="px-4 pt-3 pb-4 space-y-3">
            {filteredPosts.length === 0 && (
              <div className="text-center py-10 text-gray-400">
                <Search size={32} className="mx-auto mb-2 opacity-30" />
                <p>No posts found for "{search || activeTopic}"</p>
              </div>
            )}
            {filteredPosts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onLike={() => toggleLike(post.id)}
                onSave={() => toggleSave(post.id)}
                isSaved={savedPosts.includes(post.id)}
                onComment={() => setCommentPost(post)}
                onFollow={() => toggleFollow(post.author.id)}
                isFollowing={followingList.includes(post.author.id)}
                onViewProfile={() => navigate(`/user/${post.author.id}`)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Story Viewer */}
      {storyViewer && (
        <StoryViewer name={storyViewer.name} avatar={storyViewer.avatar} onClose={() => setStoryViewer(null)} />
      )}

      {/* Create Post Modal */}
      {showCreatePost && <CreatePostModal onClose={() => setShowCreatePost(false)} onPost={(text) => {
        const newPost: ExplorePost = {
          id: `p${Date.now()}`,
          author: CURRENT_USER,
          content: text,
          likes: 0,
          comments: 0,
          shares: 0,
          timestamp: 'Just now',
          tags: [],
          isLiked: false,
        };
        setPosts(prev => [newPost, ...prev]);
        setShowCreatePost(false);
        toast.success('Post published!');
      }} />}

      {/* Comment Modal */}
      {commentPost && <CommentModal post={commentPost} onClose={() => setCommentPost(null)} />}
    </AppLayout>
  );
}

function PostCard({ post, onLike, onSave, isSaved, onComment, onFollow, isFollowing, onViewProfile }: {
  post: ExplorePost;
  onLike: () => void;
  onSave: () => void;
  isSaved: boolean;
  onComment: () => void;
  onFollow: () => void;
  isFollowing: boolean;
  onViewProfile: () => void;
}) {
  const [showMore, setShowMore] = useState(false);
  const isLong = post.content.length > 120;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
      {/* Author */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <button onClick={onViewProfile} className="flex-shrink-0 hover:opacity-80 transition-opacity">
          <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full object-cover" />
        </button>
        <div className="flex-1 min-w-0">
          <button onClick={onViewProfile} className="flex items-center gap-1.5 hover:underline">
            <span className="font-semibold text-gray-900 text-sm">{post.author.name}</span>
            {post.author.verified && <BadgeCheck size={13} className="text-brand-500" />}
          </button>
          <p className="text-xs text-gray-400">{post.author.username} · {post.timestamp}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onFollow}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${isFollowing ? 'bg-gray-100 text-gray-600' : 'bg-brand-50 text-brand-700 border border-brand-200 hover:bg-brand-100'
              }`}
          >
            {isFollowing ? 'Following' : '+ Follow'}
          </button>
          <button onClick={onSave} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
            <Bookmark size={15} className={isSaved ? 'text-brand-600 fill-brand-600' : 'text-gray-400'} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-sm text-gray-800 leading-relaxed">
          {isLong && !showMore ? post.content.slice(0, 120) + '…' : post.content}
        </p>
        {isLong && (
          <button onClick={() => setShowMore(v => !v)} className="text-xs text-brand-600 font-medium mt-0.5 flex items-center gap-0.5">
            {showMore ? 'Show less' : 'Show more'} <ChevronDown size={12} className={showMore ? 'rotate-180' : ''} />
          </button>
        )}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {post.tags.map(tag => (
              <span key={tag} className="text-xs text-brand-600 font-medium bg-brand-50 px-2 py-0.5 rounded-full">{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* Image */}
      {post.image && (
        <div className="px-4 pb-3">
          <img src={post.image} alt="Post" className="w-full h-52 object-cover rounded-xl" />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 px-4 py-3 border-t border-gray-50">
        <button
          onClick={onLike}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all active:scale-95 ${post.isLiked ? 'bg-red-50 text-red-500' : 'hover:bg-gray-100 text-gray-500'
            }`}
        >
          <Heart size={16} className={post.isLiked ? 'fill-red-500' : ''} />
          <span>{post.likes.toLocaleString()}</span>
        </button>
        <button
          onClick={onComment}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium text-gray-500 hover:bg-gray-100 transition-all"
        >
          <MessageSquare size={16} />
          <span>{post.comments}</span>
        </button>
        <button
          onClick={() => toast.success('Post shared!')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium text-gray-500 hover:bg-gray-100 transition-all"
        >
          <Share2 size={16} />
          <span>{post.shares}</span>
        </button>
        <button
          onClick={() => toast.success('Post shared to contacts!')}
          className="ml-auto flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium text-gray-500 hover:bg-gray-100 transition-all"
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  );
}

function StoryViewer({ name, avatar, onClose }: { name: string; avatar: string; onClose: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { onClose(); return 100; }
        return p + 2;
      });
    }, 60);
    return () => clearInterval(interval);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black" onClick={onClose}>
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/30 z-10 m-3 rounded-full overflow-hidden">
        <div className="h-full bg-white rounded-full" style={{ width: `${progress}%`, transition: 'width 0.1s linear' }} />
      </div>
      <div className="absolute top-6 left-0 right-0 flex items-center gap-3 px-4 z-10">
        <img src={avatar} alt={name} className="w-10 h-10 rounded-full border-2 border-white" />
        <div>
          <p className="text-white font-semibold text-sm">{name}</p>
          <p className="text-white/60 text-xs">Just now</p>
        </div>
        <button onClick={onClose} className="ml-auto"><X size={22} className="text-white" /></button>
      </div>
      <img src={avatar} alt="" className="w-full h-full object-cover opacity-50" />
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-white text-xl font-bold px-8 text-center drop-shadow-lg">{name}'s Story ✨</p>
      </div>
    </div>
  );
}

function CreatePostModal({ onClose, onPost }: { onClose: () => void; onPost: (text: string) => void }) {
  const [text, setText] = useState('');
  const [privacy, setPrivacy] = useState('Everyone');

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center" onClick={onClose}>
      <div className="bg-white w-full max-w-md rounded-t-3xl p-5 animate-slide-up max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Create Post</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X size={16} />
          </button>
        </div>

        <div className="flex items-start gap-3 mb-3">
          <img src={CURRENT_USER.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
          <div className="flex-1">
            <p className="font-semibold text-gray-900 text-sm">{CURRENT_USER.name}</p>
            <button
              onClick={() => setPrivacy(p => p === 'Everyone' ? 'Friends Only' : 'Everyone')}
              className="flex items-center gap-1 text-xs text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full mt-0.5 font-medium"
            >
              <Globe size={10} /> {privacy} <ChevronDown size={10} />
            </button>
          </div>
        </div>

        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full h-32 px-1 py-1 text-sm text-gray-800 focus:outline-none resize-none leading-relaxed placeholder-gray-400"
          autoFocus
        />

        <div className="flex items-center gap-2 border-t border-gray-100 pt-3 mb-3">
          <p className="text-xs font-semibold text-gray-500 mr-1">Add:</p>
          {[
            { icon: Image, label: 'Photo', color: 'text-green-600 bg-green-50' },
            { icon: Camera, label: 'Camera', color: 'text-blue-600 bg-blue-50' },
            { icon: Hash, label: 'Tags', color: 'text-purple-600 bg-purple-50' },
          ].map(({ icon: Icon, label, color }) => (
            <button key={label} onClick={() => toast.success(`${label} picker coming soon!`)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${color}`}>
              <Icon size={12} /> {label}
            </button>
          ))}
        </div>

        <button
          onClick={() => text.trim() && onPost(text.trim())}
          disabled={!text.trim()}
          className="w-full py-3.5 bg-brand-600 text-white rounded-2xl font-bold disabled:opacity-40 hover:bg-brand-700 transition-colors"
        >
          Publish Post
        </button>
      </div>
    </div>
  );
}

function CommentModal({ post, onClose }: { post: ExplorePost; onClose: () => void }) {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    { id: '1', name: 'Sarah Chen', avatar: USERS[0].avatar, text: 'Amazing post! Really insightful 🔥', time: '2m ago' },
    { id: '2', name: 'Marcus J.', avatar: USERS[1].avatar, text: 'Totally agree with this perspective.', time: '5m ago' },
    { id: '3', name: 'Priya P.', avatar: USERS[2].avatar, text: 'This is exactly what I needed to read today!', time: '12m ago' },
  ]);

  const submit = () => {
    if (!comment.trim()) return;
    setComments(prev => [{
      id: Date.now().toString(),
      name: CURRENT_USER.name,
      avatar: CURRENT_USER.avatar,
      text: comment.trim(),
      time: 'Just now',
    }, ...prev]);
    setComment('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center" onClick={onClose}>
      <div className="bg-white w-full max-w-md rounded-t-3xl p-5 animate-slide-up max-h-[75vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <h3 className="text-base font-bold text-gray-900">Comments ({post.comments + comments.filter(c => c.time === 'Just now').length})</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><X size={16} /></button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide space-y-3 mb-3">
          {comments.map(c => (
            <div key={c.id} className="flex items-start gap-2.5">
              <img src={c.avatar} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
              <div className="flex-1 bg-gray-50 rounded-2xl px-3 py-2">
                <p className="text-xs font-bold text-gray-800">{c.name} <span className="font-normal text-gray-400 ml-1">{c.time}</span></p>
                <p className="text-sm text-gray-700 mt-0.5">{c.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 border-t border-gray-100 pt-3 flex-shrink-0">
          <img src={CURRENT_USER.avatar} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
          <input
            value={comment}
            onChange={e => setComment(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
            placeholder="Add a comment…"
            className="flex-1 px-3 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
          />
          <button onClick={submit} disabled={!comment.trim()} className="w-9 h-9 bg-brand-600 rounded-full flex items-center justify-center disabled:opacity-40">
            <Send size={14} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
