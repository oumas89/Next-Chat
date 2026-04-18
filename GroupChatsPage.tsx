import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, Plus, Search, Users, Settings, Trash2, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppLayout } from '@/components/layout/AppLayout';
import { GROUP_CHATS, USERS, CURRENT_USER } from '@/constants/data';
import { toast } from 'sonner';

export default function GroupChatsPage() {
    const navigate = useNavigate();
    const [groups, setGroups] = useState(GROUP_CHATS);
    const [search, setSearch] = useState('');
    const [showCreateGroup, setShowCreateGroup] = useState(false);
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('');

    const filteredGroups = groups.filter(g =>
        g.name.toLowerCase().includes(search.toLowerCase()) ||
        g.description.toLowerCase().includes(search.toLowerCase())
    );

    const toggleMember = (userId: string) => {
        setSelectedMembers(prev =>
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        );
    };

    const createGroup = () => {
        if (!groupName.trim() || selectedMembers.length === 0) {
            toast.error('Please enter group name and select members');
            return;
        }

        const newGroup = {
            id: `g${Date.now()}`,
            name: groupName,
            description: groupDescription,
            avatar: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=150&h=150&fit=crop',
            members: [CURRENT_USER, ...selectedMembers.map(id => USERS.find(u => u.id === id)!).filter(Boolean)],
            adminId: CURRENT_USER.id,
            messages: [],
            createdAt: new Date().toLocaleDateString(),
            unreadCount: 0,
        };

        setGroups([newGroup, ...groups]);
        setShowCreateGroup(false);
        setGroupName('');
        setGroupDescription('');
        setSelectedMembers([]);
        toast.success(`Group "${groupName}" created!`);
    };

    const deleteGroup = (groupId: string) => {
        const group = groups.find(g => g.id === groupId);
        if (group?.adminId !== CURRENT_USER.id) {
            toast.error('Only admins can delete groups');
            return;
        }
        setGroups(groups.filter(g => g.id !== groupId));
        toast.success('Group deleted');
    };

    const leaveGroup = (groupId: string) => {
        const group = groups.find(g => g.id === groupId);
        if (group) {
            const updatedGroup = {
                ...group,
                members: group.members.filter(m => m.id !== CURRENT_USER.id),
            };
            if (updatedGroup.members.length === 0) {
                setGroups(groups.filter(g => g.id !== groupId));
                toast.success('Left and deleted group');
            } else {
                setGroups(groups.map(g => g.id === groupId ? updatedGroup : g));
                toast.success('Left group');
            }
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
                            <h1 className="text-lg font-bold text-gray-900">Group Chats</h1>
                        </div>
                        <Button onClick={() => setShowCreateGroup(true)} size="sm" className="gap-2">
                            <Plus size={16} />
                            Create
                        </Button>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search groups..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                    </div>
                </div>

                {/* Groups List */}
                <div className="flex-1 overflow-y-auto scrollbar-hide">
                    {filteredGroups.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full py-12">
                            <Users size={48} className="text-gray-300 mb-4" />
                            <p className="text-gray-500 font-medium">No groups yet</p>
                            <p className="text-xs text-gray-400 mt-1">Create or join a group to get started</p>
                            <Button onClick={() => setShowCreateGroup(true)} className="mt-4">
                                Create Group
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-2 p-3">
                            {filteredGroups.map(group => (
                                <div
                                    key={group.id}
                                    onClick={() => navigate(`/group-chats/${group.id}`)}
                                    className="bg-white rounded-2xl p-4 hover:bg-gray-50 cursor-pointer border border-gray-100 transition-all"
                                >
                                    <div className="flex items-start gap-3">
                                        <img
                                            src={group.avatar}
                                            alt={group.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900">{group.name}</h3>
                                            <p className="text-xs text-gray-500 truncate">{group.description}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Users size={14} className="text-gray-400" />
                                                <span className="text-xs text-gray-500">{group.members.length} members</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {group.unreadCount! > 0 && (
                                                <span className="w-5 h-5 bg-brand-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                                                    {group.unreadCount! > 9 ? '9+' : group.unreadCount}
                                                </span>
                                            )}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (group.adminId === CURRENT_USER.id) {
                                                        deleteGroup(group.id);
                                                    } else {
                                                        leaveGroup(group.id);
                                                    }
                                                }}
                                                className="p-2 hover:bg-red-100 rounded-full text-gray-400 hover:text-red-600"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Create Group Modal */}
                {showCreateGroup && (
                    <div className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center">
                        <div className="bg-white w-full max-w-md rounded-t-3xl overflow-hidden animate-slide-up max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                <h2 className="text-lg font-bold">Create Group</h2>
                                <button
                                    onClick={() => setShowCreateGroup(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                {/* Group Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">
                                        Group Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter group name"
                                        value={groupName}
                                        onChange={(e) => setGroupName(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    />
                                </div>

                                {/* Group Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">
                                        Description (Optional)
                                    </label>
                                    <textarea
                                        placeholder="What's this group about?"
                                        value={groupDescription}
                                        onChange={(e) => setGroupDescription(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none h-20"
                                    />
                                </div>

                                {/* Members Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">
                                        Add Members ({selectedMembers.length})
                                    </label>
                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {USERS.map(user => (
                                            <label
                                                key={user.id}
                                                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedMembers.includes(user.id)}
                                                    onChange={() => toggleMember(user.id)}
                                                    className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                                                />
                                                <img
                                                    src={user.avatar}
                                                    alt={user.name}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                                    <p className="text-xs text-gray-500">{user.username}</p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-3 pt-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowCreateGroup(false)}
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                    <Button onClick={createGroup} className="flex-1">
                                        Create Group
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
