import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, MessageCircle, UserPlus, UserCheck, MoreVertical, Share2, MapPin, Calendar, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/components/layout/AppLayout';
import { USERS, CURRENT_USER, USER_FOLLOWERS, USER_FOLLOWING } from '@/constants/data';
import { toast } from 'sonner';

export default function UserProfilePage() {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const [isFollowing, setIsFollowing] = useState(false);
    const [showActions, setShowActions] = useState(false);

    const user = userId === 'me' ? CURRENT_USER : USERS.find(u => u.id === userId);

    if (!user) {
        return (
            <AppLayout>
                <div className="flex flex-col items-center justify-center h-full">
                    <p className="text-lg font-semibold text-gray-600">User not found</p>
                    <Button onClick={() => navigate('/contacts')} className="mt-4">Back to Contacts</Button>
                </div>
            </AppLayout>
        );
    }

    const followers = USER_FOLLOWERS[user.id] || [];
    const following = USER_FOLLOWING[user.id] || [];
    const isCurrentUser = user.id === 'me';

    const handleFollow = () => {
        setIsFollowing(!isFollowing);
        toast.success(isFollowing ? 'Unfollowed' : `Following ${user.name}!`);
    };

    const handleMessage = () => {
        navigate(`/chats/${user.id}`);
    };

    const handleSendMoney = () => {
        navigate(`/profile`);
        toast.success(`Opening send money for ${user.name}...`);
    };

    return (
        <AppLayout hideNav>
            <div className="flex flex-col h-full bg-gradient-to-b from-brand-50 to-white">
                {/* Header */}
                <div className="bg-white px-4 pt-4 pb-3 flex items-center justify-between border-b border-gray-100">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft size={24} className="text-gray-700" />
                    </button>
                    <span className="text-sm font-semibold text-gray-600">Profile</span>
                    <div className="relative">
                        <button onClick={() => setShowActions(!showActions)} className="p-2 hover:bg-gray-100 rounded-full">
                            <MoreVertical size={24} className="text-gray-700" />
                        </button>
                        {showActions && (
                            <div className="absolute right-0 top-12 z-50 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden w-48">
                                <button onClick={() => { toast.success('Profile link copied!'); setShowActions(false); }} className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2 text-sm">
                                    <Share2 size={16} />
                                    Share Profile
                                </button>
                                {!isCurrentUser && (
                                    <button onClick={() => { toast.success('Reported user'); setShowActions(false); }} className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2 text-sm text-red-600">
                                        Flag/Report
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-hide pb-20">
                    {/* Profile Header */}
                    <div className="bg-gradient-to-b from-brand-100 to-brand-50 px-4 pt-8 pb-6 text-center">
                        <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-white shadow-lg" />
                        <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                        <p className="text-sm text-gray-500 font-medium">{user.username}</p>
                        {user.verified && (
                            <div className="flex items-center justify-center gap-1 mt-2">
                                <Shield size={14} className="text-blue-500" />
                                <span className="text-xs font-semibold text-blue-600">Verified</span>
                            </div>
                        )}
                        <p className="text-sm text-gray-600 mt-3 max-w-xs mx-auto">{user.bio}</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 px-4 py-6 bg-white border-b border-gray-100">
                        <div className="text-center">
                            <p className="text-xl font-bold text-gray-900">{followers.length}</p>
                            <p className="text-xs text-gray-500 mt-1">Followers</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xl font-bold text-gray-900">{following.length}</p>
                            <p className="text-xs text-gray-500 mt-1">Following</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xl font-bold text-gray-900">{user.mutualFriends ?? 0}</p>
                            <p className="text-xs text-gray-500 mt-1">Mutual Friends</p>
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="px-4 py-6 bg-white border-b border-gray-100 space-y-4">
                        <div className="flex items-start gap-3">
                            <Calendar size={18} className="text-gray-400 mt-1" />
                            <div>
                                <p className="text-xs text-gray-500">Joined</p>
                                <p className="text-sm font-medium text-gray-900">{user.joinedDate}</p>
                            </div>
                        </div>
                        {user.phone && (
                            <div className="flex items-start gap-3">
                                <MapPin size={18} className="text-gray-400 mt-1" />
                                <div>
                                    <p className="text-xs text-gray-500">Phone</p>
                                    <p className="text-sm font-medium text-gray-900">{user.phone}</p>
                                </div>
                            </div>
                        )}
                        {user.email && (
                            <div className="flex items-start gap-3">
                                <Shield size={18} className="text-gray-400 mt-1" />
                                <div>
                                    <p className="text-xs text-gray-500">Email</p>
                                    <p className="text-sm font-medium text-gray-900">{user.email}</p>
                                </div>
                            </div>
                        )}
                        <div className="flex items-center gap-2 pt-2">
                            <div className={`w-2.5 h-2.5 rounded-full ${user.isOnline ? 'bg-green-500' : 'bg-gray-300'}`} />
                            <p className="text-xs text-gray-500">{user.isOnline ? 'Online' : `Last seen ${user.lastSeen}`}</p>
                        </div>
                    </div>

                    {/* About Section */}
                    <div className="px-4 py-6 space-y-3">
                        <h3 className="text-sm font-bold text-gray-900">About</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {user.bio || 'No bio available'}
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                {!isCurrentUser && (
                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 flex gap-3 max-w-md mx-auto safe-bottom">
                        <Button onClick={handleMessage} variant="outline" className="flex-1">
                            <MessageCircle size={18} className="mr-2" />
                            Message
                        </Button>
                        <Button onClick={handleFollow} className={`flex-1 ${isFollowing ? 'bg-gray-200 text-gray-700' : 'bg-brand-600'}`}>
                            {isFollowing ? (
                                <>
                                    <UserCheck size={18} className="mr-2" />
                                    Following
                                </>
                            ) : (
                                <>
                                    <UserPlus size={18} className="mr-2" />
                                    Follow
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
