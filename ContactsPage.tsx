import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, UserPlus, Star, MessageCircle, DollarSign, ChevronRight,
  BadgeCheck, Phone, Mail, X, MapPin, Calendar, Users, Heart,
  ScanLine, ArrowLeft, Check
} from 'lucide-react';
import type { Contact } from '@/types';
import AppLayout from '@/components/layout/AppLayout';
import { toast } from 'sonner';

import { USERS, CONTACTS, SUGGESTIONS } from '@/constants';


type TabType = 'all' | 'favorites' | 'nearby';



export default function ContactsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [contacts, setContacts] = useState(CONTACTS.map(c => ({ ...c, id: 'c1' })) as Contact[]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [addedSuggestions, setAddedSuggestions] = useState<string[]>([]);
  const [sendMoneyUser, setSendMoneyUser] = useState<string | null>(null);
  const [sendAmount, setSendAmount] = useState('');

  const toggleFavorite = (userId: string) => {
    setContacts(prev => prev.map(c =>
      c.user.id === userId ? { ...c, isFavorite: !c.isFavorite } : c
    ));
    const contact = contacts.find(c => c.user.id === userId);
    if (contact) {
      toast.success(contact.isFavorite ? 'Removed from favorites' : 'Added to favorites!');
    }
  };

  const filtered = contacts.filter(c => {
    const matchSearch = c.user.name.toLowerCase().includes(search.toLowerCase()) ||
      c.user.username.toLowerCase().includes(search.toLowerCase());
    if (activeTab === 'all') return matchSearch;
    if (activeTab === 'favorites') return matchSearch && c.isFavorite;
    return matchSearch;
  });

  const grouped: Record<string, typeof filtered> = {};
  filtered.forEach(c => {
    const letter = c.user.name[0].toUpperCase();
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(c);
  });

  const handleMessage = (userId: string) => {
    const idx = contacts.findIndex(c => c.user.id === userId);
    navigate(`/chats/c${idx + 1}`);
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="bg-white px-4 pt-12 pb-3">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
            <button
              onClick={() => navigate('/add-contacts')}
              className="flex items-center gap-1.5 px-3 py-2 bg-brand-600 text-white rounded-full text-sm font-medium hover:bg-brand-700 active:scale-95 transition-all"
            >
              <UserPlus size={15} />
              <span>Add</span>
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-gray-100 rounded-full text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            {([
              { key: 'all', label: `All (${contacts.length})` },
              { key: 'favorites', label: `★ Favorites (${contacts.filter(c => c.isFavorite).length})` },
              { key: 'nearby', label: '📡 Nearby' },
            ] as { key: TabType; label: string }[]).map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${activeTab === tab.key
                  ? 'bg-brand-600 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto scrollbar-hide bg-white">
          {activeTab === 'nearby' ? (
            <NearbyTab />
          ) : (
            <>
              {Object.keys(grouped).sort().map(letter => (
                <div key={letter}>
                  <div className="px-4 py-2 bg-gray-50 sticky top-0 z-10 flex items-center gap-2">
                    <span className="text-xs font-bold text-brand-600 w-5">{letter}</span>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>
                  {grouped[letter].map(c => (
                    <ContactRow
                      key={c.user.id}
                      contact={c}
                      onMessage={() => handleMessage(c.user.id)}
                      onSendMoney={() => setSendMoneyUser(c.user.name)}
                      onFavorite={() => toggleFavorite(c.user.id)}
                      onView={() => navigate(`/user/${c.user.id}`)}
                    />
                  ))}
                </div>
              ))}

              {filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                  <UserPlus size={40} className="mb-3 opacity-40" />
                  <p className="font-medium text-gray-500">No contacts found</p>
                  <button
                    onClick={() => navigate('/add-contacts')}
                    className="mt-3 px-5 py-2 bg-brand-600 text-white rounded-full text-sm font-semibold"
                  >
                    Add Contacts
                  </button>
                </div>
              )}

              {/* Suggestions */}
              <div className="px-4 pt-4 pb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-gray-800">People You May Know</span>
                  <button className="text-xs text-brand-600 font-medium">See All</button>
                </div>
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                  {SUGGESTIONS.map(p => (
                    <div key={p.name} className="flex-shrink-0 w-28 bg-gray-50 rounded-2xl p-3 flex flex-col items-center gap-1.5 border border-gray-100">
                      <div className="relative">
                        <img src={p.avatar} alt={p.name} className="w-14 h-14 rounded-full object-cover" />
                        {addedSuggestions.includes(p.name) && (
                          <div className="absolute inset-0 rounded-full bg-brand-600/80 flex items-center justify-center">
                            <Check size={20} className="text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-gray-800 text-center leading-tight">{p.name}</p>
                      <p className="text-[10px] text-gray-400">{p.mutual} mutual</p>
                      <button
                        onClick={() => {
                          if (!addedSuggestions.includes(p.name)) {
                            setAddedSuggestions(prev => [...prev, p.name]);
                            toast.success(`Friend request sent to ${p.name}!`);
                          }
                        }}
                        className={`w-full py-1.5 text-xs font-semibold rounded-full transition-colors ${addedSuggestions.includes(p.name)
                          ? 'bg-gray-200 text-gray-500'
                          : 'bg-brand-600 text-white hover:bg-brand-700'
                          }`}
                      >
                        {addedSuggestions.includes(p.name) ? 'Sent' : 'Add'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Contact Detail Modal */}
      {selectedContact && (
        <ContactDetailModal
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
          onMessage={() => { setSelectedContact(null); handleMessage(selectedContact.user.id); }}
          onSendMoney={() => { setSelectedContact(null); setSendMoneyUser(selectedContact.user.name); }}
          onFavorite={() => toggleFavorite(selectedContact.user.id)}
          isFavorite={contacts.find(c => c.user.id === selectedContact.user.id)?.isFavorite ?? false}
        />
      )}

      {/* Send Money Modal */}
      {sendMoneyUser && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center" onClick={() => setSendMoneyUser(null)}>
          <div className="bg-white w-full max-w-md rounded-t-3xl p-5 animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Send to {sendMoneyUser}</h3>
              <button onClick={() => setSendMoneyUser(null)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <X size={16} />
              </button>
            </div>
            <div className="text-center py-4">
              <div className="flex items-center justify-center gap-1 mb-2">
                <span className="text-3xl font-bold text-gray-300">$</span>
                <input
                  type="number"
                  value={sendAmount}
                  onChange={e => setSendAmount(e.target.value)}
                  className="text-5xl font-bold text-gray-900 bg-transparent focus:outline-none text-center w-40"
                  placeholder="0"
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-4 gap-2 mt-3">
                {['10', '25', '50', '100'].map(q => (
                  <button key={q} onClick={() => setSendAmount(q)} className="py-2 bg-gray-100 rounded-xl text-sm font-semibold text-gray-700 hover:bg-brand-100 hover:text-brand-700 transition-colors">
                    ${q}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => {
                if (parseFloat(sendAmount) > 0) {
                  toast.success(`$${sendAmount} sent to ${sendMoneyUser}!`);
                  setSendMoneyUser(null);
                  setSendAmount('');
                } else toast.error('Enter a valid amount');
              }}
              className="w-full py-3.5 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 transition-colors"
            >
              Send ${sendAmount || '0'}
            </button>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

function ContactRow({ contact: c, onMessage, onSendMoney, onFavorite, onView }: {
  contact: Contact;
  onMessage: () => void;
  onSendMoney: () => void;
  onFavorite: () => void;
  onView: () => void;
}) {
  const { user: u, isFavorite } = c;
  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
      <button onClick={onView} className="relative flex-shrink-0">
        <img src={u.avatar} alt={u.name} className="w-12 h-12 rounded-full object-cover" />
        {u.isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-brand-500 border-2 border-white rounded-full" />
        )}
      </button>
      <button className="flex-1 min-w-0 text-left" onClick={onView}>
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-gray-900 truncate">{u.name}</span>
          {u.verified && <BadgeCheck size={14} className="text-brand-500 flex-shrink-0" />}
        </div>
        <p className="text-xs text-gray-400 truncate">{u.username} {u.mutualFriends ? `· ${u.mutualFriends} mutual` : ''}</p>
      </button>
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={onFavorite}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <Star size={15} className={isFavorite ? 'text-gold-500 fill-gold-500' : 'text-gray-300'} />
        </button>
        <button onClick={onMessage} className="w-9 h-9 flex items-center justify-center rounded-full bg-brand-50 hover:bg-brand-100 transition-colors" aria-label={`Message ${u.name}`}>
          <MessageCircle size={16} className="text-brand-600" />
        </button>
        <button onClick={onSendMoney} className="w-9 h-9 flex items-center justify-center rounded-full bg-gold-50 hover:bg-gold-100 transition-colors" aria-label={`Send money to ${u.name}`}>
          <DollarSign size={15} className="text-gold-600" />
        </button>
      </div>
    </div>
  );
}

function ContactDetailModal({ contact, onClose, onMessage, onSendMoney, onFavorite, isFavorite }: {
  contact: Contact;
  onClose: () => void;
  onMessage: () => void;
  onSendMoney: () => void;
  onFavorite: () => void;
  isFavorite: boolean;
}) {
  const { user: u } = contact;
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center" onClick={onClose}>
      <div className="bg-white w-full max-w-md rounded-t-3xl overflow-hidden animate-slide-up" onClick={e => e.stopPropagation()}>
        {/* Cover + Avatar */}
        <div className="h-28 wallet-gradient relative">
          <button onClick={onClose} className="absolute top-4 left-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <ArrowLeft size={16} className="text-white" />
          </button>
          <button onClick={onFavorite} className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Heart size={16} className={isFavorite ? 'fill-white text-white' : 'text-white'} />
          </button>
        </div>
        <div className="px-5 pb-5">
          <div className="-mt-10 mb-3">
            <img src={u.avatar} alt={u.name} className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md" />
          </div>
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xl font-bold text-gray-900">{u.name}</h3>
                {u.verified && <BadgeCheck size={18} className="text-brand-500" />}
              </div>
              <p className="text-sm text-brand-600 font-medium">{u.username}</p>
              <p className="text-sm text-gray-500 mt-1">{u.bio}</p>
            </div>
            <div className={`px-2.5 py-1 rounded-full text-xs font-semibold ${u.isOnline ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-500'}`}>
              {u.isOnline ? '● Online' : u.lastSeen}
            </div>
          </div>

          <div className="space-y-2 mb-4">
            {[
              { icon: Phone, label: u.phone, color: 'text-brand-600' },
              { icon: Mail, label: u.email, color: 'text-blue-600' },
              { icon: Calendar, label: `Member since ${u.joinedDate}`, color: 'text-gold-600' },
              { icon: Users, label: `${u.mutualFriends} mutual friends`, color: 'text-purple-600' },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-2.5 text-sm text-gray-600">
                <Icon size={14} className={color} />
                <span>{label}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button onClick={onMessage} className="flex items-center justify-center gap-2 py-3 bg-brand-600 text-white rounded-2xl font-semibold text-sm hover:bg-brand-700 transition-colors">
              <MessageCircle size={16} /> Message
            </button>
            <button onClick={onSendMoney} className="flex items-center justify-center gap-2 py-3 bg-gold-500 text-white rounded-2xl font-semibold text-sm hover:bg-gold-600 transition-colors">
              <DollarSign size={16} /> Send Money
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-2">
            {[
              { icon: Phone, label: 'Call', color: 'bg-green-100 text-green-700' },
              { icon: ScanLine, label: 'Scan', color: 'bg-blue-100 text-blue-700' },
              { icon: MapPin, label: 'Location', color: 'bg-orange-100 text-orange-700' },
            ].map(({ icon: Icon, label, color }) => (
              <button key={label} onClick={() => toast.success(`${label} feature coming soon!`)} className={`flex flex-col items-center gap-1.5 py-2.5 rounded-2xl text-xs font-semibold ${color}`}>
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function NearbyTab() {
  const [scanning, setScanning] = useState(false);
  const [found, setFound] = useState<typeof USERS>([]);

  const startScan = () => {
    setScanning(true);
    setFound([]);
    setTimeout(() => {
      setFound(USERS.slice(0, 3));
      setScanning(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center px-6 py-8 text-center gap-5">
      <div
        className={`w-40 h-40 rounded-full border-4 flex items-center justify-center relative cursor-pointer transition-all ${scanning ? 'border-brand-400 animate-pulse' : 'border-gray-200 hover:border-brand-300'
          }`}
        onClick={!scanning ? startScan : undefined}
      >
        <div className={`absolute inset-2 rounded-full border-2 ${scanning ? 'border-brand-300 animate-ping opacity-50' : 'border-gray-100'}`} />
        <div className="flex flex-col items-center gap-2">
          <MapPin size={28} className={scanning ? 'text-brand-600 animate-bounce' : 'text-gray-300'} />
          <span className="text-xs font-semibold text-gray-400">{scanning ? 'Scanning…' : 'Tap to Scan'}</span>
        </div>
      </div>

      <p className="text-sm text-gray-500">Discover ConnectPay users nearby using location radar</p>

      {found.length > 0 && (
        <div className="w-full space-y-2 text-left animate-fade-in">
          <p className="text-xs font-bold text-brand-600 uppercase tracking-wider">{found.length} found nearby</p>
          {found.map(u => (
            <div key={u.id} className="flex items-center gap-3 bg-brand-50 rounded-2xl px-4 py-3 border border-brand-100">
              <img src={u.avatar} alt={u.name} className="w-11 h-11 rounded-full object-cover" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm">{u.name}</p>
                <p className="text-xs text-gray-400">{u.username}</p>
              </div>
              <button
                onClick={() => toast.success(`Friend request sent to ${u.name}!`)}
                className="px-3 py-1.5 bg-brand-600 text-white text-xs font-semibold rounded-full hover:bg-brand-700 transition-colors"
              >
                Add
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
