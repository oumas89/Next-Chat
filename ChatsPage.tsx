import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Pin, CheckCheck, Check, Plus, MessageCircle, UserPlus,
  X, Bell, BellOff, Archive, Trash2, Send
} from 'lucide-react';
import type { Conversation, User } from '@/types';
import AppLayout from '@/components/layout/AppLayout';
import { toast } from 'sonner';
import { USERS, CONVERSATIONS, STORY_USERS } from '@/constants';

const CURRENT_USER = {
  id: 'me',
  name: 'Alex Morgan',
  username: '@alexmorgan',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
};

type FilterType = 'all' | 'unread' | 'pinned';

function StoryViewer({ name, avatar, onClose }: { name: string; avatar: string; onClose: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          onClose();
          return 0;
        }
        return p + 10;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col" onClick={onClose}>
      <div className="absolute top-0 left-0 right-0 z-10 px-4 pt-4">
        <div className="h-1 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full"
            style={{ width: `${progress}%`, transition: 'width 100ms linear' }}
          />
        </div>
      </div>
      <div className="absolute top-4 left-4 right-4 flex gap-3 px-4 z-10">
        <img src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover border-2 border-white" />
        <div>
          <p className="text-white font-semibold text-sm">{name}</p>
          <p className="text-white/70 text-xs">Just now</p>
        </div>
        <button onClick={onClose} className="ml-auto w-10 h-10 flex items-center justify-center">
          <X size={20} className="text-white" />
        </button>
      </div>
      <img src={avatar} alt="" className="w-full h-full object-cover opacity-90" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <p className="text-white text-4xl font-bold text-center px-8 drop-shadow-lg">{name}'s Story ✨</p>
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex gap-3 p-4" onClick={e => e.stopPropagation()}>
        <input
          className="flex-1 bg-white/20 backdrop-blur text-white placeholder-white/70 rounded-full px-4 py-2 text-sm focus:outline-none focus:bg-white/30"
          placeholder={`Reply to ${name}…`}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              toast.success('Reply sent!');
              onClose();
            }
          }}
        />
        <button
          onClick={() => { toast.success('Reply sent!'); onClose(); }}
          className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30"
        >
          <Send size={18} className="text-white" />
        </button>
      </div>
    </div>
  );
}

function NewChatModal({ onClose, onSelectUser }: { onClose: () => void; onSelectUser: (user: User) => void }) {
  const [search, setSearch] = useState('');
  const filteredUsers = useMemo(() =>
    USERS.filter(u =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase())
    ),
    [search]);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center" onClick={onClose}>
      <div className="bg-white w-full max-w-md rounded-t-3xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="px-6 pt-8 pb-6 border-b border-gray-200">
          <div className="w-8 h-1 bg-gray-200 rounded-full mx-auto mb-6" />
          <div className="flex gap-4 mb-6">
            <h2 className="text-lg font-bold text-gray-900">New Chat</h2>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center" title="Close" aria-label="Close modal">
              <X size={20} />
            </button>
          </div>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              autoFocus
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search contacts ..."
              className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
          </div>
        </div>

        <div className="overflow-y-auto max-h-[60vh]">
          <button
            onClick={() => { onClose(); toast.success('Group chat coming soon!'); }}
            className="w-full flex items-center gap-3 px-6 py-4 hover:bg-gray-50 border-b border-gray-100 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-brand-500 flex items-center justify-center flex-shrink-0">
              <UserPlus size={20} className="text-brand-100" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900 text-sm">New Group Chat</p>
              <p className="text-xs text-gray-500">Add multiple people</p>
            </div>
          </button>

          <div className="px-6 py-3 bg-gray-50">
            <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">Contacts</span>
          </div>

          {filteredUsers.map(u => (
            <button
              key={u.id}
              onClick={() => onSelectUser(u)}
              className="w-full flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-colors text-left border-b border-gray-100 last:border-b-0"
            >
              <div className="relative flex-shrink-0">
                <img src={u.avatar} alt={u.name} className="w-12 h-12 rounded-full object-cover" />
                {u.isOnline && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm">{u.name}</p>
                <p className="text-xs text-gray-500 truncate">{u.bio}</p>
              </div>
              {u.isOnline && <span className="text-[11px] text-brand-600 font-medium flex-shrink-0">Online</span>}
            </button>
          ))}

          {filteredUsers.length === 0 && (
            <div className="flex flex-col items-center py-12 text-gray-500">
              <p className="text-sm">No contacts found for "{search}"</p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200">
          <button
            onClick={() => { onClose(); window.location.href = '/add-contacts'; }}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gray-100 text-gray-700 rounded-2xl text-sm font-semibold hover:bg-gray-200 transition-colors"
          >
            <UserPlus size={16} /> Add New Contact
          </button>
        </div>
      </div>
    </div>
  );
}

function ConversationItem({
  conversation: c,
  isMuted,
  onClick,
  isSwipedOpen,
  onSwipeOpen,
  onArchive,
  onDelete,
  onMute
}: {
  conversation: Conversation;
  isMuted: boolean;
  onClick: () => void;
  isSwipedOpen: boolean;
  onSwipeOpen: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onMute: () => void;
}) {
  const lastMsg = c.messages[c.messages.length - 1];
  const touchStartXRef = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = touchStartXRef.current - e.changedTouches[0].clientX;
    if (dx > 50) onSwipeOpen();
    if (dx < -50 && isSwipedOpen) onSwipeOpen();
  };

  return (
    <div className="relative overflow-hidden border-b border-gray-100 last:border-b-0">
      <div className={`absolute right-0 top-0 bottom-0 flex transition-all duration-300 ease-out ${isSwipedOpen ? 'w-48' : 'w-0'}`}>
        <button onClick={onMute} className="flex flex-col items-center justify-center gap-1 bg-blue-500 text-white min-w-[64px]">
          {isMuted ? <Bell size={16} /> : <BellOff size={16} />}
          <span className="text-[11px] font-bold">{isMuted ? 'Unmute' : 'Mute'}</span>
        </button>
        <button onClick={onArchive} className="flex flex-col items-center justify-center gap-1 bg-gray-500 text-white min-w-[64px]">
          <Archive size={16} />
          <span className="text-[11px] font-bold">Archive</span>
        </button>
        <button onClick={onDelete} className="flex flex-col items-center justify-center gap-1 bg-red-500 text-white min-w-[64px]">
          <Trash2 size={16} />
          <span className="text-[11px] font-bold">Delete</span>
        </button>
      </div>

      <div
        className={`flex items-center gap-4 px-4 py-4 bg-white hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-all ${isSwipedOpen ? '-translate-x-48' : ''}`}
        style={{ transform: `translateX(${isSwipedOpen ? '-192px' : '0px'})`, transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative flex-shrink-0" onClick={onSwipeOpen}>
          <img
            src={c.participant.avatar}
            alt={c.participant.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          {c.participant.isOnline && (
            <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
          )}
          {isMuted && (
            <span className="absolute top-0 right-0 w-4 h-4 bg-gray-500 rounded-full border-2 border-white flex items-center justify-center">
              <BellOff size={10} className="text-white" />
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0" onClick={onClick}>
          <div className="flex justify-between mb-0.5">
            <span className={`font-semibold text-gray-900 truncate ${c.unreadCount > 0 ? 'font-bold' : ''}`}>
              {c.participant.name}
            </span>
            <span className={`text-xs flex-shrink-0 ml-2 ${c.unreadCount > 0 ? 'text-brand-600 font-semibold' : 'text-gray-500'}`}>
              {c.lastTime}
            </span>
          </div>
          <div className="flex justify-between">
            <div className="flex gap-1 flex-1 min-w-0">
              {lastMsg && (
                lastMsg.status === 'read'
                  ? <CheckCheck size={16} className="text-brand-600 flex-shrink-0" />
                  : <Check size={16} className="text-gray-400 flex-shrink-0" />
              )}
              <p className={`text-sm truncate ${c.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                {c.lastMessage}
              </p>
            </div>
            <div className="flex gap-0.5 ml-2 flex-shrink-0">
              {c.isPinned && <Pin size={16} className="text-gray-400" />}
              {c.unreadCount > 0 && (
                <span className="min-w-[18px] h-5 px-1.5 bg-brand-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center">
                  {c.unreadCount > 99 ? '99+' : c.unreadCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChatsPage() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>(CONVERSATIONS);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [showNewChat, setShowNewChat] = useState(false);
  const [storyViewer, setStoryViewer] = useState<{ name: string, avatar: string } | null>(null);
  const [mutedIds, setMutedIds] = useState<string[]>([]);
  const [swipedId, setSwipedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return conversations.filter(conv => {
      const matchesSearch = conv.participant.name.toLowerCase().includes(search.toLowerCase()) ||
        conv.lastMessage.toLowerCase().includes(search.toLowerCase());
      if (!matchesSearch) return false;
      if (filterType === 'unread') return conv.unreadCount > 0;
      if (filterType === 'pinned') return conv.isPinned;
      return true;
    });
  }, [conversations, search, filterType]);

  const pinned = useMemo(() => filtered.filter(c => c.isPinned), [filtered]);
  const regular = useMemo(() => filtered.filter(c => !c.isPinned), [filtered]);

  const toggleMute = useCallback((convId: string) => {
    setMutedIds(prev =>
      prev.includes(convId) ? prev.filter(id => id !== convId) : [...prev, convId]
    );
  }, []);

  const archiveConv = useCallback((convId: string) => {
    toast.success('Conversation archived');
    setSwipedId(null);
  }, []);

  const deleteConv = useCallback((convId: string) => {
    toast.success('Conversation deleted');
    setConversations(prev => prev.filter(c => c.id !== convId));
    setSwipedId(null);
  }, []);

  const startNewChat = useCallback((user: User) => {
    toast.success(`Started chat with ${user.name}`);
    setShowNewChat(false);
    // Navigate to new chat (mock ID)
    navigate(`/chats/new-${user.id}`);
  }, [navigate]);

  useEffect(() => {
    // Mock real-time updates
  }, []);

  return (
    <AppLayout>
      {/* Search & Filter */}
      <div className="bg-white border-b border-gray-100 px-4 pt-1 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="relative flex-1 mr-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search chats..."
              className="w-full pl-9 pr-4 py-2.5 bg-gray-100 rounded-full text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
          </div>
          <button
            onClick={() => navigate('/group-chats')}
            className="p-2.5 bg-brand-100 text-brand-600 rounded-full hover:bg-brand-200 transition-colors flex items-center justify-center"
            title="Group Chats"
          >
            <MessageCircle size={18} />
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 -mb-1 scrollbar-hide">
          {(['all', 'unread', 'pinned'] as FilterType[]).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-colors ${filterType === type
                ? 'bg-brand-600 text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)} {type !== 'all' && `(${type === 'unread' ? filtered.filter(c => c.unreadCount > 0).length : pinned.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Stories */}
      <div className="bg-white border-b border-gray-200 px-4 py-2.5">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide">
          {STORY_USERS.map(s => (
            <button
              key={s.name}
              onClick={() => {
                if (s.isMe) toast.success('Add story coming soon!');
                else if (s.hasStory) setStoryViewer({ name: s.name, avatar: s.avatar });
                else toast.success(`${s.name} has no story yet`);
              }}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 active:scale-[0.97] transition-transform"
            >
              <div className={`p-1.5 rounded-full ${s.hasStory ? 'bg-gradient-to-tr from-brand-500 to-amber-500' : s.isMe ? 'border-2 border-dashed border-gray-400' : 'border-2 border-gray-300'}`}>
                <div className="p-1 bg-white rounded-full">
                  <img src={s.avatar} alt={s.name} className="w-12 h-12 rounded-full object-cover" />
                </div>
              </div>
              <span className="text-[10px] font-medium text-gray-700 truncate w-20 text-center">{s.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto bg-white">
        {pinned.length > 0 && (
          <div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 sticky top-0 z-10">
              <Pin size={16} className="text-brand-600" />
              <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">Pinned</span>
            </div>
            {pinned.map(c => (
              <ConversationItem
                key={c.id}
                conversation={c}
                isMuted={mutedIds.includes(c.id)}
                onClick={() => navigate(`/chats/${c.id}`)}
                isSwipedOpen={swipedId === c.id}
                onSwipeOpen={() => setSwipedId(swipedId === c.id ? null : c.id)}
                onArchive={() => archiveConv(c.id)}
                onDelete={() => deleteConv(c.id)}
                onMute={() => toggleMute(c.id)}
              />
            ))}
            <div className="h-px bg-gray-200 mx-4" />
          </div>
        )}

        {regular.length > 0 && (
          <div>
            <div className="flex items-center justify-between px-4 py-2 bg-gray-50 sticky top-0 z-10">
              <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">All Messages</span>
              <span className="text-[11px] text-brand-600 font-semibold">{regular.length} chats</span>
            </div>
            {regular.map(c => (
              <ConversationItem
                key={c.id}
                conversation={c}
                isMuted={mutedIds.includes(c.id)}
                onClick={() => navigate(`/chats/${c.id}`)}
                isSwipedOpen={swipedId === c.id}
                onSwipeOpen={() => setSwipedId(swipedId === c.id ? null : c.id)}
                onArchive={() => archiveConv(c.id)}
                onDelete={() => deleteConv(c.id)}
                onMute={() => toggleMute(c.id)}
              />
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-gray-500 px-4">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <MessageCircle size={24} className="text-gray-400" />
            </div>
            <p className="font-semibold text-gray-700 text-base mb-2">
              {search ? `No results for "${search}"` : filterType === 'unread' ? 'No unread chats' : 'No chats yet'}
            </p>
            <p className="text-sm text-center text-gray-500 mb-6">
              {search ? 'Try a different name or keyword' : 'Start a new conversation with the + button'}
            </p>
            {!search && (
              <button
                onClick={() => setShowNewChat(true)}
                className="flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-full text-sm font-semibold hover:bg-brand-700 transition-colors"
              >
                <Plus size={16} /> New Chat
              </button>
            )}
          </div>
        )}

        <div className="h-20" /> {/* Bottom padding for nav */}
      </div>

      {storyViewer && (
        <StoryViewer
          name={storyViewer.name}
          avatar={storyViewer.avatar}
          onClose={() => setStoryViewer(null)}
        />
      )}

      {showNewChat && (
        <NewChatModal
          onClose={() => setShowNewChat(false)}
          onSelectUser={startNewChat}
        />
      )}
    </AppLayout>
  );
}

