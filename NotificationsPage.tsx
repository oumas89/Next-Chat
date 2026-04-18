import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, MessageCircle, DollarSign, Heart, MessageSquare, UserPlus, Trash2 } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { NOTIFICATIONS } from '@/constants/data';
import { toast } from 'sonner';

type NotificationFilter = 'all' | 'unread' | 'messages' | 'payments' | 'social';

const getNotificationIcon = (type: string) => {
    switch (type) {
        case 'message':
            return <MessageCircle size={20} className="text-brand-600" />;
        case 'payment':
            return <DollarSign size={20} className="text-green-600" />;
        case 'like':
            return <Heart size={20} className="text-red-600" />;
        case 'comment':
            return <MessageSquare size={20} className="text-blue-600" />;
        case 'follow':
            return <UserPlus size={20} className="text-purple-600" />;
        default:
            return <MessageCircle size={20} className="text-gray-600" />;
    }
};

export default function NotificationsPage() {
    const navigate = useNavigate();
    const [filter, setFilter] = useState<NotificationFilter>('all');
    const [notifications, setNotifications] = useState(NOTIFICATIONS);
    const [unreadIds, setUnreadIds] = useState(
        NOTIFICATIONS.filter(n => !n.read).map(n => n.id)
    );

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'unread') return !n.read;
        if (filter === 'messages') return n.type === 'message';
        if (filter === 'payments') return n.type === 'payment';
        if (filter === 'social') return ['like', 'comment', 'follow'].includes(n.type);
        return true;
    });

    const markAsRead = (id: string) => {
        setUnreadIds(unreadIds.filter(uid => uid !== id));
    };

    const deleteNotification = (id: string) => {
        setNotifications(notifications.filter(n => n.id !== id));
        toast.success('Notification deleted');
    };

    const markAllAsRead = () => {
        setUnreadIds([]);
        toast.success('All notifications marked as read');
    };

    const handleNotificationClick = (notification: any) => {
        markAsRead(notification.id);
        if (notification.type === 'message' && notification.relatedUser) {
            navigate(`/chats/${notification.relatedUser.id}`);
        } else if (notification.relatedUser) {
            navigate(`/user/${notification.relatedUser.id}`);
        }
    };

    return (
        <AppLayout hideNav>
            <div className="flex flex-col h-full bg-gray-50">
                {/* Header */}
                <div className="bg-white px-4 pt-4 pb-3 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
                                <ArrowLeft size={24} className="text-gray-700" />
                            </button>
                            <h1 className="text-lg font-bold text-gray-900">Notifications</h1>
                        </div>
                        {unreadIds.length > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs font-semibold text-brand-600 hover:text-brand-700 px-3 py-1 rounded-full hover:bg-brand-50"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4">
                        {[
                            { id: 'all', label: 'All' },
                            { id: 'unread', label: `Unread (${unreadIds.length})` },
                            { id: 'messages', label: 'Messages' },
                            { id: 'payments', label: 'Payments' },
                            { id: 'social', label: 'Social' },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setFilter(tab.id as NotificationFilter)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${filter === tab.id
                                        ? 'bg-brand-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Notifications List */}
                <div className="flex-1 overflow-y-auto scrollbar-hide">
                    {filteredNotifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full py-12">
                            <MessageCircle size={48} className="text-gray-300 mb-4" />
                            <p className="text-gray-500 font-medium">No notifications</p>
                            <p className="text-xs text-gray-400 mt-1">
                                {filter === 'unread' ? 'All caught up!' : 'Check back later'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {filteredNotifications.map(notification => (
                                <div
                                    key={notification.id}
                                    onClick={() => handleNotificationClick(notification)}
                                    className={`px-4 py-4 border-b border-gray-100 cursor-pointer transition-all ${unreadIds.includes(notification.id)
                                            ? 'bg-blue-50 hover:bg-blue-100'
                                            : 'bg-white hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Icon */}
                                        <div className="flex-shrink-0 mt-1">
                                            {notification.avatar ? (
                                                <img
                                                    src={notification.avatar}
                                                    alt={notification.title}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                    {getNotificationIcon(notification.type)}
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <p className={`text-sm font-semibold ${unreadIds.includes(notification.id) ? 'text-gray-900' : 'text-gray-800'}`}>
                                                        {notification.title}
                                                    </p>
                                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                        {notification.description}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-2">
                                                        {notification.timestamp}
                                                    </p>
                                                </div>

                                                {/* Delete Button */}
                                                <button
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        deleteNotification(notification.id);
                                                    }}
                                                    className="p-1.5 hover:bg-red-100 rounded-lg text-gray-400 hover:text-red-600 transition-all flex-shrink-0"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>

                                            {/* Unread Indicator */}
                                            {unreadIds.includes(notification.id) && (
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-brand-600 rounded-full" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Bottom Safe Area */}
                <div className="h-20 safe-bottom" />
            </div>
        </AppLayout>
    );
}
