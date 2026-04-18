import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Phone, Video, MoreVertical, Send, DollarSign, Smile,
  Paperclip, CheckCheck, Check, X, Mic, Info, BadgeCheck,
  Reply, Copy, Forward, Trash2, Heart, ThumbsUp, Clock,
  Camera, Image as ImageIcon, Edit2, Pin, MessageCircle, MapPin, FileText, Gift, Search, XCircle
} from 'lucide-react';
import type { Message, Conversation } from '@/types';
import AppLayout from '@/components/layout/AppLayout';
import { toast } from 'sonner';
import { MOCK_IMAGES } from '@/assets/mock-images';
import { CONVERSATIONS, CURRENT_USER } from '@/constants';

const WECHAT_FEATURES = [
  { icon: ImageIcon, label: 'Photos', type: 'image' },
  { icon: Camera, label: 'Camera', type: 'camera' },
  { icon: FileText, label: 'File', type: 'file' },
  { icon: MapPin, label: 'Location', type: 'location' },
  { icon: Gift, label: 'Red Packet', type: 'redpacket' },
  { icon: MessageCircle, label: 'Voice', type: 'voice' },
];

const REACTION_EMOJIS = ['❤️', '😂', '😮', '😢', '😡', '👍', '💯', '🎉'];

interface MsgWithReaction extends Message {
  reaction?: string;
  replyTo?: string | null;
  replyToSender?: string;
  pinned?: boolean;
  image?: string;
  edited?: boolean;
  paymentAmount?: number;
  paymentCurrency?: string;
}

export default function ChatConversationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState('');
  const [editingMsg, setEditingMsg] = useState<MsgWithReaction | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [payCurrency, setPayCurrency] = useState('USD');
  const [showEmoji, setShowEmoji] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [replyTo, setReplyTo] = useState<MsgWithReaction | null>(null);
  const [longPressMsg, setLongPressMsg] = useState<MsgWithReaction | null>(null);
  const [showMsgMenu, setShowMsgMenu] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const [pinnedMsgs, setPinnedMsgs] = useState<string[]>([]);
  const [showFeatures, setShowFeatures] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messageReactions, setMessageReactions] = useState<Record<string, string>>({});
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recordTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const conv = CONVERSATIONS.find((c: Conversation) => c.id === id);
  if (!conv) {
    useEffect(() => {
      toast.error('Conversation not found');
      navigate('/chats');
    }, [id, navigate]);
    return null;
  }

  const [messages, setMessages] = useState<MsgWithReaction[]>(conv.messages as MsgWithReaction[]);

  const isMe = (msg: MsgWithReaction) => msg.senderId === CURRENT_USER.id || msg.senderId === 'me';

  // Filter messages by search query
  const filteredMessages = messages.filter(m =>
    m.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Typing indicator simulation
  const handleTextChange = (value: string) => {
    setText(value);

    if (!isTyping && value.length > 0) {
      setIsTyping(true);
      // Simulate sending typing indicator
    }

    // Clear existing timer
    if (typingTimer.current) {
      clearTimeout(typingTimer.current);
    }

    // Set new timer to stop typing indicator after 1 second of no input
    typingTimer.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  const addReaction = (messageId: string, emoji: string) => {
    setMessageReactions(prev => ({
      ...prev,
      [messageId]: emoji,
    }));
    toast.success(`Added ${emoji}`);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    return () => {
      if (longPressTimer.current) clearTimeout(longPressTimer.current);
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    };
  }, []);

  const handleLongPress = useCallback((msg: MsgWithReaction, e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setMenuPos({ x: rect.right, y: rect.top });
    setLongPressMsg(msg);
    setShowMsgMenu(true);
  }, []);

  const handleTouchStart = (msg: MsgWithReaction, e: React.TouchEvent) => {
    longPressTimer.current = setTimeout(() => handleLongPress(msg, e), 500);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleContextMenu = (msg: MsgWithReaction, e: React.MouseEvent) => {
    e.preventDefault();
    handleLongPress(msg, e);
  };

  const editMessage = useCallback((msg: MsgWithReaction) => {
    setEditingMsg(msg);
    setText(msg.text);
    setReplyTo(null);
    inputRef.current?.focus();
    setShowMsgMenu(false);
  }, []);

  const saveEdit = () => {
    if (editingMsg && text.trim()) {
      setMessages(prev => prev.map(m =>
        m.id === editingMsg.id ? { ...m, text: text.trim(), edited: true } : m
      ));
      toast.success('Message edited');
    }
    setEditingMsg(null);
    setText('');
  };

  const togglePin = useCallback((msgId: string) => {
    setPinnedMsgs(currentPinned => {
      const isPinned = currentPinned.includes(msgId);
      const newPinned = isPinned
        ? currentPinned.filter(id => id !== msgId)
        : [...currentPinned, msgId];
      toast.success(isPinned ? 'Unpinned' : 'Pinned');
      setShowMsgMenu(false);
      return newPinned;
    });
  }, []);

  const replyMessage = (msg: MsgWithReaction) => {
    setReplyTo(msg);
    setEditingMsg(null);
    inputRef.current?.focus();
    setShowMsgMenu(false);
  };

  const sendMessage = (msgText?: string, replyMsg?: MsgWithReaction | null, type: 'text' | 'image' | 'payment' = 'text', imageUrl?: string) => {
    const content = (msgText ?? text).trim();
    if (!content && type === 'text') return;

    const msg: MsgWithReaction = {
      id: `m${Date.now()}`,
      senderId: 'me',
      text: type === 'image' ? '[Image]' : (type === 'payment' ? `[Payment ${payCurrency} ${payAmount}]` : content),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type,
      image: imageUrl,
      status: 'sent' as const,
      replyTo: replyMsg?.text || undefined,
      replyToSender: replyMsg?.senderId,
    };

    setMessages(prev => [...prev, msg]);
    setText('');
    setShowEmoji(false);
    setReplyTo(null);
    setEditingMsg(null);
    scrollToBottom();

    // Simulate reply
    if (type === 'text' && Math.random() > 0.4) {
      const replies = ['Got it! 👍', 'Nice photo! 📸', 'Thanks!', 'Perfect 🎯', 'Love it ❤️', 'See you soon!'];
      const delay = 800 + Math.random() * 1200;
      setTimeout(() => {
        const replyMsg: MsgWithReaction = {
          id: `m${Date.now() + 1}`,
          senderId: conv.participant.id,
          text: replies[Math.floor(Math.random() * replies.length)],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'text',
          status: 'read' as const,
        };
        setMessages(prev => [...prev, replyMsg]);
      }, delay);
    }
  };

  const sendImage = (url: string) => {
    sendMessage('[Image sent]', null, 'image', url);
    setShowFeatures(false);
  };

  const handleFeature = (type: string) => {
    switch (type) {
      case 'image':
        const randomImg = MOCK_IMAGES[Math.floor(Math.random() * MOCK_IMAGES.length)];
        sendImage(randomImg);
        break;
      case 'camera':
        toast.success('📸 Photo taken!');
        sendImage(MOCK_IMAGES[0]);
        break;
      case 'file':
        toast.success('📎 File attached');
        sendMessage('[File: document.pdf]', null, 'text');
        break;
      case 'location':
        toast.success('📍 Location shared');
        sendMessage('[Location: Current position]', null, 'text');
        break;
      case 'redpacket':
        toast.success('🎁 Red packet sent! $8.88');
        sendMessage('[Red Packet: $8.88]', null, 'text');
        break;
      case 'voice':
        toast.success('🎤 Voice message 0:05');
        sendMessage('[Voice 0:05]', null, 'text');
        break;
    }
    setShowFeatures(false);
  };

  const sendPayment = () => {
    const amountNum = parseFloat(payAmount);
    if (amountNum > 0) {
      const msg: MsgWithReaction = {
        id: `m${Date.now()}`,
        senderId: 'me',
        text: `Sent ${payCurrency} ${payAmount}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'payment',
        paymentAmount: amountNum,
        paymentCurrency: payCurrency,
        status: 'sent' as const,
      };
      setMessages(prev => [...prev, msg]);
      setPayAmount('');
      setShowPayment(false);
      toast.success(`Payment sent: ${payCurrency} ${payAmount}`);
      scrollToBottom();
    }
  };

  const pinnedMessages = messages.filter(m => pinnedMsgs.includes(m.id));

  return (
    <AppLayout hideNav>
      <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-white">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 shrink-0">
          <button onClick={() => navigate(-1)} className="p-2 -ml-1 rounded-full hover:bg-gray-100">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 flex items-center justify-center shadow-md">
              <img
                src={conv.participant.avatar}
                alt={conv.participant.name}
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none' as any;
                  (e.target as HTMLImageElement).nextElementSibling!.style.display = 'flex';
                }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-sm text-gray-900 truncate">{conv.participant.name}</div>
              <div className={`flex items-center gap-1 text-xs ${conv.participant.isOnline ? 'text-green-500' : 'text-gray-400'}`}>
                {conv.participant.isOnline ? (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    Online
                  </>
                ) : (
                  'Offline'
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${showSearch ? 'bg-brand-100 text-brand-600' : 'hover:bg-gray-100'
                }`}
            >
              <Search size={18} />
            </button>
            <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center">
              <Phone size={18} />
            </button>
            <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center">
              <Video size={18} />
            </button>
            <button
              onClick={() => setShowInfo(true)}
              className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
            >
              <Info size={18} />
            </button>
            <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center">
              <MoreVertical size={18} />
            </button>
          </div>
        </div>

        {/* Pinned Messages */}
        {pinnedMessages.length > 0 && (
          <div className="bg-amber-50/80 border-b border-amber-100/50 px-3 py-2.5 flex items-center gap-2 backdrop-blur-sm">
            <Pin size={14} className="text-amber-600 flex-shrink-0" />
            <span className="text-xs font-semibold text-amber-800 flex-shrink-0">Pinned ({pinnedMessages.length})</span>
          </div>
        )}

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
          {/* Search Bar */}
          {showSearch && (
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm py-2 -mx-4 px-4 flex gap-2 border-b border-gray-100">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-3 top-2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-10 pr-3 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <button
                onClick={() => {
                  setShowSearch(false);
                  setSearchQuery('');
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <XCircle size={20} className="text-gray-500" />
              </button>
            </div>
          )}

          {pinnedMessages.map(msg => (
            <div key={msg.id} className="p-3 bg-white/60 rounded-2xl rounded-tr-none border border-amber-200 max-w-[85%] ml-auto animate-slide-up">
              <div className="flex items-start gap-2 text-xs">
                <Pin size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <span className="font-medium text-amber-800">{isMe(msg) ? 'You' : msg.replyToSender || conv.participant.name.split(' ')[0]} • </span>
                  <span className="text-gray-500">{msg.timestamp}</span>
                </div>
              </div>
              <div className="mt-1 text-sm">{msg.text}</div>
            </div>
          ))}

          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className={`group flex ${isMe(msg) ? 'justify-end' : 'justify-start'}`}
              onContextMenu={(e) => handleContextMenu(msg, e)}
            >
              <div
                className={`max-w-[75%] p-3.5 rounded-2xl shadow-sm relative ${isMe(msg)
                  ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-br-md'
                  : 'bg-white border border-gray-200 rounded-bl-md shadow-md'
                  }`}
                onTouchStart={(e) => handleTouchStart(msg, e)}
                onTouchEnd={handleTouchEnd}
                onMouseDown={() => {
                  longPressTimer.current = setTimeout(() => {
                    const rect = { right: window.innerWidth / 2, top: window.innerHeight / 2 };
                    handleLongPress(msg, { currentTarget: { getBoundingClientRect: () => rect } } as any);
                  }, 500);
                }}
              >
                {/* Reply Preview */}
                {msg.replyTo && (
                  <div className={`text-xs p-2 rounded-xl mb-2 ${isMe(msg) ? 'bg-brand-400/30 border-brand-400/50' : 'bg-gray-100 border-gray-200'
                    }`}>
                    <div className="font-medium">{msg.replyToSender || 'Someone'}</div>
                    <div className="truncate">{msg.replyTo}</div>
                  </div>
                )}

                {/* Message Content */}
                <div className="break-words">
                  {msg.type === 'image' && msg.image ? (
                    <img
                      src={msg.image}
                      alt="Sent image"
                      className={`max-w-full max-h-64 rounded-lg cursor-pointer object-cover shadow-md ${isMe(msg) ? 'rounded-br-md' : 'rounded-bl-md'
                        }`}
                      onClick={() => window.open(msg.image, '_blank')}
                    />
                  ) : (
                    <div>{msg.text}</div>
                  )}
                  {msg.type === 'payment' && msg.paymentAmount !== undefined && (
                    <div className="flex items-center justify-between pt-2 mt-2 border-t border-white/30">
                      <DollarSign size={16} />
                      <span className="font-bold text-lg">{msg.paymentCurrency ?? 'USD'} ${msg.paymentAmount}</span>
                    </div>
                  )}
                </div>

                {/* Message Meta */}
                <div className={`flex items-center justify-between mt-2 pt-1 text-xs opacity-75 gap-1 flex-nowrap min-h-[1.25rem]`}>
                  {msg.edited && <span className="text-xs flex items-center gap-0.5">
                    <Edit2 size={12} /> edited
                  </span>}
                  <div className="flex items-center gap-1 ml-auto">
                    {msg.reaction && <span className="ml-1">{msg.reaction}</span>}
                    {!isMe(msg) && <div className={`w-2 h-2 rounded-full bg-blue-500 ${msg.status === 'read' ? 'scale-125' : ''}`} />}
                    {isMe(msg) && (
                      <>
                        {msg.status === 'sent' && <Check className="w-3.5 h-3.5" />}
                        {msg.status === 'delivered' && <CheckCheck className="w-3.5 h-3.5 text-blue-400" />}
                        {msg.status === 'read' && <CheckCheck className="w-3.5 h-3.5 text-blue-500 scale-110" />}
                      </>
                    )}
                    <Clock className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-end gap-2 justify-start">
              <div className="flex gap-1 px-4 py-3 bg-gray-200 rounded-2xl rounded-bl-md">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
              <span className="text-xs text-gray-500">{conv.participant.name.split(' ')[0]} is typing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Menu */}
        {longPressMsg && showMsgMenu && (
          <div
            className="fixed bg-white border rounded-xl shadow-2xl py-1 min-w-[160px] z-50 animate-in slide-in-from-bottom-2 duration-200"
            style={{ left: menuPos.x - 20, top: menuPos.y }}
          >
            {isMe(longPressMsg) && (
              <button
                onClick={() => editMessage(longPressMsg)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 w-full text-left rounded-md transition-colors"
              >
                <Edit2 size={16} className="text-blue-500 flex-shrink-0" />
                Edit
              </button>
            )}
            <button
              onClick={() => togglePin(longPressMsg.id)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 w-full text-left rounded-md transition-colors"
            >
              <Pin size={16} className={`flex-shrink-0 ${pinnedMsgs.includes(longPressMsg.id) ? 'text-amber-500' : 'text-gray-500'}`} />
              {pinnedMsgs.includes(longPressMsg.id) ? 'Unpin' : 'Pin'}
            </button>
            <button
              onClick={() => replyMessage(longPressMsg)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 w-full text-left rounded-md transition-colors"
            >
              <Reply size={16} className="text-green-500 flex-shrink-0" />
              Reply
            </button>
            <button
              onClick={() => {
                toast('Copied!');
                navigator.clipboard.writeText(longPressMsg.text);
                setShowMsgMenu(false);
              }}
              className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 w-full text-left rounded-md transition-colors"
            >
              <Copy size={16} className="flex-shrink-0" />
              Copy
            </button>
          </div>
        )}

        {/* Input Bar */}
        <div className="bg-white/95 backdrop-blur-sm border-t border-gray-200 px-3 py-3 flex items-end gap-2 safe-area-inset-bottom flex-shrink-0">
          {editingMsg && (
            <div className="flex items-center gap-2 text-xs bg-orange-100 text-orange-800 px-3 py-1.5 rounded-full border border-orange-200">
              <Edit2 size={12} />
              <span>Editing</span>
              <button onClick={() => { setEditingMsg(null); setText(''); }} className="ml-1">
                <X size={14} />
              </button>
            </div>
          )}
          {replyTo && !editingMsg && (
            <div className="flex items-center gap-2 text-xs bg-blue-50 text-blue-800 px-3 py-1.5 rounded-full border border-blue-200 max-w-[60%]">
              <Reply size={12} />
              <span className="truncate">Replying to {replyTo.senderId === 'me' ? 'yourself' : (replyTo.senderId === conv.participant.id ? conv.participant.name.split(' ')[0] : 'Someone')}</span>
              <button onClick={() => setReplyTo(null)} className="ml-auto -mr-1">
                <X size={14} />
              </button>
            </div>
          )}
          {!editingMsg && !replyTo && (
            <button
              onClick={() => setShowFeatures(true)}
              className="w-11 h-11 rounded-2xl hover:bg-gray-100 p-2.5 transition-colors flex items-center justify-center"
            >
              <Paperclip size={18} className="text-gray-500" />
            </button>
          )}
          <div className="flex-1 relative min-w-0">
            <input
              ref={inputRef}
              value={text}
              onChange={(e) => handleTextChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  editingMsg ? saveEdit() : sendMessage(undefined, replyTo);
                }
                if (e.key === 'Escape') {
                  setEditingMsg(null);
                  setReplyTo(null);
                  setText('');
                }
              }}
              placeholder={editingMsg ? 'Edit your message...' : 'Type a message...'}
              className="w-full px-4 py-3 pr-12 bg-gray-100 hover:bg-gray-200 focus:bg-white rounded-2xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-400 transition-all resize-none"
              autoFocus={!editingMsg && !replyTo}
            />
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => setShowEmoji(v => !v)}
              className={`w-11 h-11 rounded-2xl p-2.5 transition-all flex items-center justify-center ${showEmoji
                ? 'bg-brand-100 text-brand-600 shadow-md'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                }`}
            >
              <Smile size={20} />
            </button>
            <button
              onClick={() => setShowPayment(true)}
              className="w-11 h-11 rounded-2xl p-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg hover:shadow-xl active:scale-[0.97] transition-all flex items-center justify-center"
            >
              <DollarSign size={18} />
            </button>
            {text.trim() || editingMsg || replyTo ? (
              <button
                onClick={() => editingMsg ? saveEdit() : sendMessage(undefined, replyTo)}
                className="w-14 h-14 bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg hover:shadow-xl active:scale-[0.97] rounded-2xl flex items-center justify-center transition-all ml-1"
              >
                <Send size={20} className="-rotate-45" />
              </button>
            ) : (
              <button
                onClick={() => setIsRecording(true)}
                className="w-14 h-14 bg-gray-200 hover:bg-gray-300 text-gray-600 shadow-md hover:shadow-lg active:bg-red-100 active:scale-[0.97] rounded-2xl flex items-center justify-center transition-all ml-1 relative overflow-hidden"
              >
                {isRecording ? (
                  <>
                    <div className="w-full h-full bg-red-400/20 animate-ping rounded-2xl absolute inset-0" />
                    <Mic size={20} />
                    <span className="absolute -bottom-8 text-xs text-red-500 font-mono">0:05</span>
                  </>
                ) : (
                  <Mic size={20} />
                )}
              </button>
            )}
          </div>
        </div>

        {/* WeChat Features Panel */}
        {showFeatures && (
          <div className="fixed bottom-24 left-6 right-6 z-50 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200 p-4 flex flex-wrap gap-3 animate-slide-up">
            {WECHAT_FEATURES.map(({ icon: Icon, label, type }) => (
              <button
                key={type}
                onClick={() => handleFeature(type)}
                className="group flex flex-col items-center gap-1.5 p-3 flex-1 rounded-2xl hover:bg-gray-50 hover:shadow-md transition-all active:scale-95 min-w-[58px]"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-brand-50 group-hover:to-brand-100 flex items-center justify-center shadow-sm">
                  <Icon size={20} className="text-gray-600 group-hover:text-brand-600 transition-colors" />
                </div>
                <span className="text-[11px] font-medium text-gray-700 text-center whitespace-nowrap">{label}</span>
              </button>
            ))}
            <button
              onClick={() => setShowFeatures(false)}
              className="absolute -top-3 right-3 w-10 h-10 bg-white border-2 border-gray-200 rounded-2xl shadow-lg hover:bg-gray-50 flex items-center justify-center"
            >
              <X size={16} className="text-gray-500" />
            </button>
          </div>
        )}

        {/* Payment Modal */}
        {showPayment && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end z-50 animate-in slide-in-from-bottom-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-sm mx-4 max-h-[70vh] overflow-y-auto shadow-2xl border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Send Money</h3>
                <button onClick={() => setShowPayment(false)} className="p-1.5 rounded-full hover:bg-gray-100">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Amount</label>
                  <div className="relative">
                    <select
                      value={payCurrency}
                      onChange={(e) => setPayCurrency(e.target.value)}
                      className="w-full p-4 pr-10 border border-gray-200 rounded-2xl text-lg font-bold focus:outline-none focus:ring-2 focus:ring-brand-400"
                    >
                      <option value="USD">$ USD</option>
                      <option value="EUR">€ EUR</option>
                      <option value="GBP">£ GBP</option>
                    </select>
                    <DollarSign className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  </div>
                  <input
                    type="number"
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full mt-2 p-4 border border-gray-200 rounded-2xl text-2xl font-bold text-right focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                <button
                  onClick={sendPayment}
                  disabled={!payAmount}
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-lg"
                >
                  Send {payCurrency} {payAmount || '0'}
                </button>
                <div className="text-xs text-gray-500 text-center pt-2">
                  Fees: Free • Instant
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Emoji Picker */}
        {showEmoji && (
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[320px] max-w-[90vw] z-40 bg-white rounded-2xl shadow-2xl border p-3 animate-slide-up">
            <div className="grid grid-cols-7 gap-1.5 p-1 max-h-64 overflow-y-auto rounded-xl">
              {REACTION_EMOJIS.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => {
                    sendMessage(emoji, replyTo);
                    setShowEmoji(false);
                  }}
                  className="w-12 h-12 rounded-lg hover:bg-gray-100 flex items-center justify-center text-xl transition-colors active:scale-95"
                >
                  {emoji}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowEmoji(false)}
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Message Info Modal */}
        {showInfo && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Chat Info</h3>
                <button onClick={() => setShowInfo(false)} className="p-2 hover:bg-gray-100 rounded-xl">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                  <div className="w-12 h-12 rounded-2xl bg-brand-100 flex items-center justify-center">
                    👤
                  </div>
                  <div>
                    <div className="font-semibold">{conv.participant.name}</div>
                    <div className="text-gray-500">{conv.participant.bio}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <button className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-xl transition-colors">
                    <MessageCircle size={20} />
                    <span className="text-xs mt-1">Media</span>
                  </button>
                  <button className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-xl transition-colors">
                    <FileText size={20} />
                    <span className="text-xs mt-1">Files</span>
                  </button>
                  <button className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-xl transition-colors">
                    <Pin size={20} />
                    <span className="text-xs mt-1">Pinned ({pinnedMsgs.length})</span>
                  </button>
                </div>
                <div className="pt-4 border-t text-xs text-gray-500 text-center">
                  Messages end-to-end encrypted
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

