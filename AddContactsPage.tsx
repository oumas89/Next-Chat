import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Search, ScanLine, Phone, Radar, Mail, MessageSquareDot,
  Users, BookOpen, ShoppingBag, ChevronRight, QrCode
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import type { Contact, User } from '@/types';
import { toast } from 'sonner';

// Placeholder data - replace with Supabase integration
const CONTACTS: Contact[] = [
  { user: { id: 'u1', name: 'Sarah Chen', username: '@sarahchen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face', bio: '', phone: '', email: '', isOnline: true, lastSeen: '', joinedDate: '', verified: true }, isFavorite: true, addedDate: 'March 2024' },
  { user: { id: 'u2', name: 'Marcus Johnson', username: '@marcusj', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', bio: '', phone: '', email: '', isOnline: false, lastSeen: '', joinedDate: '', verified: true }, isFavorite: true, addedDate: 'Feb 2024' },
];

// USERS not used, remove



const ADD_OPTIONS = [
  {
    id: 'scan',
    icon: ScanLine,
    iconBg: 'bg-brand-100',
    iconColor: 'text-brand-600',
    label: 'Scan',
    sub: "Scan contact's QR code",
    action: 'scan',
  },
  {
    id: 'mobile',
    icon: Phone,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    label: 'Mobile Contact',
    sub: 'Add from Contacts',
    action: 'mobile',
  },
  {
    id: 'radar',
    icon: Radar,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    label: 'Radar',
    sub: 'Quickly add friends in your vicinity',
    action: 'radar',
  },
  {
    id: 'invite',
    icon: Mail,
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    label: 'Invite Friends',
    sub: 'Tell your friends to join',
    action: 'invite',
  },
  {
    id: 'wecom',
    icon: MessageSquareDot,
    iconBg: 'bg-brand-100',
    iconColor: 'text-brand-600',
    label: 'ConnectPay Contacts',
    sub: 'Search users by mobile number',
    action: 'wecom',
  },
  {
    id: 'group',
    icon: Users,
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600',
    label: 'Join Private Group',
    sub: 'Join a group with friends nearby',
    action: 'group',
  },
  {
    id: 'official',
    icon: BookOpen,
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
    label: 'Official Accounts',
    sub: 'Get more information',
    action: 'official',
  },
  {
    id: 'service',
    icon: ShoppingBag,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    label: 'Service Accounts',
    sub: 'Get more shopping information and services',
    action: 'service',
  },
];

const ACTION_MESSAGES: Record<string, string> = {
  scan: 'QR scanner coming soon!',
  mobile: 'Importing mobile contacts coming soon!',
  radar: 'Radar nearby detection coming soon!',
  invite: 'Invite link copied to clipboard!',
  wecom: 'Search users by mobile number coming soon!',
  group: 'Join group feature coming soon!',
  official: 'Official accounts directory coming soon!',
  service: 'Service accounts coming soon!',
};

const SUGGESTED_USERS: User[] = [
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

export default function AddContactsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [addedContacts, setAddedContacts] = useState<Contact[]>(CONTACTS);

  const availableSuggestions = SUGGESTED_USERS.filter(user => !addedContacts.some(contact => contact.user.id === user.id));
  const filteredSuggestions = availableSuggestions.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  const handleRemoveContact = (userId: string) => {
    setAddedContacts(prev => prev.filter(contact => contact.user.id !== userId));
    toast.success('Contact removed.');
  };

  const handleOption = (action: string) => {
    if (action === 'scan') {
      setShowQR(true);
      return;
    }
    if (action === 'invite') {
      if (navigator.clipboard) {
        navigator.clipboard.writeText('https://connectpay.app/invite');
      }
      toast.success(ACTION_MESSAGES[action] ?? 'Invitation link copied!');
      return;
    }

    toast.success(ACTION_MESSAGES[action] ?? 'Coming soon!');
  };

  const handleAddContact = (user: User) => {
    setAddedContacts(prev => [...prev, { user, isFavorite: false, addedDate: 'Today' }]);
    toast.success(`${user.name} added to contacts!`);
  };

  return (
    <AppLayout hideNav>
      <div className="flex flex-col h-full bg-gray-50">
        {/* Header */}
        <div className="bg-white px-4 pt-12 pb-3 flex items-center gap-3 shadow-sm">
          <button
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-gray-900 flex-1 text-center">Add Contacts</h1>
          <div className="w-9" />
        </div>

        {/* Search */}
        <div className="px-4 pt-3 pb-2 bg-white">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search Account / Mobile Number"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && search.trim()) {
                  toast.success(`Searching for "${search}"...`);
                }
              }}
              className="w-full pl-9 pr-4 py-3 bg-gray-100 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
          </div>
        </div>

        {/* Options */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pt-3 space-y-0.5">
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            {ADD_OPTIONS.map((opt, idx) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleOption(opt.action)}
                  className="w-full flex items-center gap-4 px-4 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
                >
                  <div className={`w-11 h-11 rounded-2xl ${opt.iconBg} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={20} className={opt.iconColor} strokeWidth={1.8} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{opt.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{opt.sub}</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
                </button>
              );
            })}
          </div>

          {addedContacts.length > 0 && (
            <div className="mt-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-bold text-gray-900">Your Contacts</p>
                  <p className="text-xs text-gray-400">Contacts already in your list</p>
                </div>
                <span className="text-xs font-semibold text-brand-600">{addedContacts.length}</span>
              </div>
              <div className="space-y-3">
                {addedContacts.slice(0, 4).map(contact => (
                  <div key={contact.user.id} className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors">
                    <img src={contact.user.avatar} alt={contact.user.name} className="w-12 h-12 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{contact.user.name}</p>
                      <p className="text-xs text-gray-400 truncate">{contact.user.username}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveContact(contact.user.id)}
                      className="text-xs font-semibold text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {addedContacts.length > 4 && (
                  <p className="text-xs text-gray-400">Showing 4 of {addedContacts.length} contacts</p>
                )}
              </div>
            </div>
          )}

          <div className="mt-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-bold text-gray-900">Suggested Contacts</p>
                <p className="text-xs text-gray-400">Search and add people from ConnectPay</p>
              </div>
              <span className="text-xs font-semibold text-brand-600">{addedContacts.length} contacts</span>
            </div>
            {filteredSuggestions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
                <p>No matching contacts found.</p>
                <p className="mt-2 text-xs text-gray-400">Try a different name or username.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredSuggestions.slice(0, 4).map(user => (
                  <div key={user.id} className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors">
                    <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user.username}</p>
                    </div>
                    <button
                      onClick={() => handleAddContact(user)}
                      className="py-2 px-3 bg-brand-600 text-white rounded-2xl text-xs font-semibold hover:bg-brand-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* My QR Code Card */}
        <div className="px-4 pb-6 pt-4">
          <button
            onClick={() => setShowQR(true)}
            className="w-full bg-white rounded-2xl p-4 shadow-sm border border-brand-100 flex items-center gap-4 hover:bg-brand-50 active:bg-brand-100 transition-colors"
          >
            <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center flex-shrink-0">
              <QrCode size={22} className="text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-gray-900 text-sm">My QR Code</p>
              <p className="text-xs text-gray-400 mt-0.5">Share your QR to let others add you</p>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </button>
        </div>

        {/* QR Modal */}
        {showQR && (
          <div
            className="fixed inset-0 z-50 bg-black/70 flex items-end justify-center"
            onClick={() => setShowQR(false)}
          >
            <div
              className="bg-white w-full max-w-md rounded-t-3xl p-6 flex flex-col items-center gap-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mb-1" />
              <p className="text-lg font-bold text-gray-900">My QR Code</p>
              <p className="text-sm text-gray-400 text-center -mt-2">Others can scan this to add you</p>

              {/* Simulated QR Code */}
              <div className="bg-white p-4 rounded-2xl border-2 border-brand-200 shadow-lg mt-1">
                <div className="w-52 h-52 relative">
                  {/* QR grid pattern */}
                  <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    {/* Top-left finder */}
                    <rect x="5" y="5" width="25" height="25" rx="3" fill="#166534" />
                    <rect x="9" y="9" width="17" height="17" rx="2" fill="white" />
                    <rect x="13" y="13" width="9" height="9" rx="1" fill="#166534" />
                    {/* Top-right finder */}
                    <rect x="70" y="5" width="25" height="25" rx="3" fill="#166534" />
                    <rect x="74" y="9" width="17" height="17" rx="2" fill="white" />
                    <rect x="78" y="13" width="9" height="9" rx="1" fill="#166534" />
                    {/* Bottom-left finder */}
                    <rect x="5" y="70" width="25" height="25" rx="3" fill="#166534" />
                    <rect x="9" y="74" width="17" height="17" rx="2" fill="white" />
                    <rect x="13" y="78" width="9" height="9" rx="1" fill="#166534" />
                    {/* Data modules */}
                    {[35, 39, 43, 47, 51, 55, 59, 63].map((x, i) =>
                      [5, 9, 13, 17, 21, 25].map((y, j) =>
                        (i + j) % 3 !== 0 ? <rect key={`${x}-${y}`} x={x} y={y} width="3" height="3" rx="0.5" fill="#166534" /> : null
                      )
                    )}
                    {[5, 9, 13, 17, 21, 25, 29].map((x, i) =>
                      [35, 39, 43, 47, 51, 55, 59, 63, 67, 71, 75, 79, 83, 87, 91].map((y, j) =>
                        (i * 3 + j) % 5 !== 0 ? <rect key={`r${x}-${y}`} x={x} y={y} width="3" height="3" rx="0.5" fill="#166534" /> : null
                      )
                    )}
                    {[35, 39, 43, 47, 51, 55, 59, 63, 67, 71, 75, 79, 83, 87, 91, 95].map((x, i) =>
                      [35, 39, 43, 47, 51, 55, 59, 63, 67, 71, 75, 79, 83, 87, 91, 95].map((y, j) =>
                        (i + j * 2) % 4 !== 0 ? <rect key={`d${x}-${y}`} x={x} y={y} width="3" height="3" rx="0.5" fill="#166534" /> : null
                      )
                    )}
                    {/* Center logo area */}
                    <rect x="43" y="43" width="14" height="14" rx="3" fill="white" />
                    <circle cx="50" cy="50" r="5" fill="#16a34a" />
                    <circle cx="50" cy="50" r="2.5" fill="white" />
                  </svg>
                </div>
              </div>

              <div className="flex flex-col items-center gap-1">
                <p className="font-bold text-gray-900">Alex Morgan</p>
                <p className="text-sm text-gray-400">@alexmorgan</p>
              </div>

              <div className="flex gap-3 w-full mt-1">
                <button
                  onClick={() => { toast.success('QR code saved!'); setShowQR(false); }}
                  className="flex-1 py-3 bg-brand-600 text-white rounded-2xl font-semibold text-sm hover:bg-brand-700 active:scale-95 transition-all"
                >
                  Save QR Code
                </button>
                <button
                  onClick={() => { toast.success('QR link shared!'); setShowQR(false); }}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-2xl font-semibold text-sm hover:bg-gray-200 active:scale-95 transition-all"
                >
                  Share
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
