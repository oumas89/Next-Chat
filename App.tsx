import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import ChatsPage from '@/pages/ChatsPage';
import ChatConversationPage from '@/pages/ChatConversationPage';
import ContactsPage from '@/pages/ContactsPage';
import ExplorePage from '@/pages/ExplorePage';
import ProfilePage from '@/pages/ProfilePage';
import AddContactsPage from '@/pages/AddContactsPage';
import Index from '@/pages/Index';
import UserProfilePage from '@/pages/UserProfilePage';
import SettingsPage from '@/pages/SettingsPage';
import NotificationsPage from '@/pages/NotificationsPage';
import GroupChatsPage from '@/pages/GroupChatsPage';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-background">
      <p className="text-4xl font-bold gradient-text mb-2">404</p>
      <p className="text-gray-400">Page not found</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/chats" element={<ChatsPage />} />
        <Route path="/chats/:id" element={<ChatConversationPage />} />
        <Route path="/group-chats" element={<GroupChatsPage />} />
        <Route path="/group-chats/:id" element={<ChatConversationPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/add-contacts" element={<AddContactsPage />} />
        <Route path="/user/:userId" element={<UserProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#fff',
            border: '1px solid #bbf7d0',
            color: '#166534',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
          },
          classNames: {
            success: 'border-brand-200',
          },
        }}
      />
    </BrowserRouter>
  );
}
