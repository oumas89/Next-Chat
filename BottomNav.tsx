import { useLocation, useNavigate } from 'react-router-dom';
import { MessageCircle, Users, Compass, User, Wallet, Bell } from 'lucide-react';

import type { Conversation } from '@/types';
import { CONVERSATIONS as conversationsData, NOTIFICATIONS } from '@/constants';

const tabs = [
  { path: '/chats', label: 'Chats', icon: MessageCircle },
  { path: '/contacts', label: 'Contacts', icon: Users },
  { path: '/explore', label: 'Explore', icon: Compass },
  { path: '/profile', label: 'Profile', icon: User },
];

const totalUnread = conversationsData.reduce((sum, c) => sum + c.unreadCount, 0);
const unreadNotifications = NOTIFICATIONS.filter(n => !n.read).length;

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) => {
    if (path === '/chats') return location.pathname === '/chats' || location.pathname.startsWith('/chats/');
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-xl safe-bottom">
      <div className="flex items-center max-w-md mx-auto px-2 h-16">
        {/* First two tabs */}
        {tabs.slice(0, 2).map(({ path, label, icon: Icon }) => {
          const active = isActive(path);
          const showBadge = path === '/chats' && totalUnread > 0;
          return (
            <TabButton
              key={path}
              active={active}
              onClick={() => navigate(path)}
              badge={showBadge ? (totalUnread > 9 ? '9+' : String(totalUnread)) : undefined}
            >
              <Icon size={22} className={`transition-all duration-200 ${active ? 'text-brand-600' : 'text-gray-400'}`} strokeWidth={active ? 2.5 : 1.8} />
              <span className={`text-[10px] font-semibold transition-colors duration-200 ${active ? 'text-brand-600' : 'text-gray-400'}`}>{label}</span>
              {active && <ActiveDot />}
            </TabButton>
          );
        })}

        {/* Center Wallet FAB */}
        <div className="flex-1 flex justify-center">
          <button
            onClick={() => navigate('/profile')}
            className={`w-14 h-14 rounded-full flex flex-col items-center justify-center shadow-lg transition-all active:scale-95 -mt-5 shadow-brand-500/50 shadow-2xl ${location.pathname === '/profile'
              ? 'bg-gradient-to-br from-brand-500 to-brand-700 shadow-brand-300'
              : 'bg-gradient-to-br from-brand-600 to-brand-800 hover:from-brand-500 hover:to-brand-700'
              }`} aria-label="Wallet/Profile"
          >
            <Wallet size={22} className="text-white" strokeWidth={2} />
          </button>
        </div>

        {/* Last two tabs */}
        {tabs.slice(2, 4).map(({ path, label, icon: Icon }) => {
          const active = isActive(path);
          return (
            <TabButton
              key={path}
              active={active}
              onClick={() => navigate(path)}
            >
              <Icon size={22} className={`transition-all duration-200 ${active ? 'text-brand-600' : 'text-gray-400'}`} strokeWidth={active ? 2.5 : 1.8} />
              <span className={`text-[10px] font-semibold transition-colors duration-200 ${active ? 'text-brand-600' : 'text-gray-400'}`}>{label}</span>
              {active && <ActiveDot />}
            </TabButton>
          );
        })}
      </div>
    </nav>
  );
}

function TabButton({ children, active, onClick, badge }: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  badge?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 relative min-h-[44px] group"
    >
      <div className={`relative flex items-center justify-center w-10 h-8 rounded-2xl transition-all duration-200 ${active ? 'bg-brand-50' : 'group-hover:bg-gray-50'}`}>
        {children}
        {badge && (
          <span className="absolute -top-1.5 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {badge}
          </span>
        )}
      </div>
    </button>
  );
}

function ActiveDot() {
  return (
    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand-500 rounded-full" />
  );
}
