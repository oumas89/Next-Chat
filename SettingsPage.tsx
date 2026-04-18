import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, Bell, Lock, Eye, User, LogOut, Database, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/components/layout/AppLayout';
import { toast } from 'sonner';

interface SettingsState {
    darkMode: boolean;
    notifications: {
        messages: boolean;
        payments: boolean;
        socialActivity: boolean;
        soundEnabled: boolean;
    };
    privacy: {
        profileVisibility: 'public' | 'followers' | 'private';
        lastSeenVisible: boolean;
        allowMessages: 'everyone' | 'followers' | 'none';
    };
    blockedUsers: string[];
}

export default function SettingsPage() {
    const navigate = useNavigate();
    const [settings, setSettings] = useState<SettingsState>({
        darkMode: false,
        notifications: {
            messages: true,
            payments: true,
            socialActivity: true,
            soundEnabled: true,
        },
        privacy: {
            profileVisibility: 'public',
            lastSeenVisible: true,
            allowMessages: 'everyone',
        },
        blockedUsers: [],
    });
    const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'privacy' | 'security'>('general');

    // Load settings from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('oumas_settings');
        if (saved) {
            setSettings(JSON.parse(saved));
        }
    }, []);

    // Save settings to localStorage
    const saveSettings = (newSettings: SettingsState) => {
        setSettings(newSettings);
        localStorage.setItem('oumas_settings', JSON.stringify(newSettings));
    };

    const toggleDarkMode = () => {
        const updated = { ...settings, darkMode: !settings.darkMode };
        saveSettings(updated);
        document.documentElement.classList.toggle('dark');
        toast.success(updated.darkMode ? 'Dark mode enabled' : 'Light mode enabled');
    };

    const toggleNotification = (key: keyof typeof settings.notifications) => {
        const updated = {
            ...settings,
            notifications: {
                ...settings.notifications,
                [key]: !settings.notifications[key],
            },
        };
        saveSettings(updated);
        toast.success(`${key} notification ${updated.notifications[key] ? 'enabled' : 'disabled'}`);
    };

    const updatePrivacy = (key: string, value: any) => {
        const updated = {
            ...settings,
            privacy: {
                ...settings.privacy,
                [key]: value,
            },
        };
        saveSettings(updated);
        toast.success('Privacy settings updated');
    };

    const SettingItem = ({ label, description, children }: any) => (
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 last:border-b-0 bg-white">
            <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{label}</p>
                {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
            </div>
            {children}
        </div>
    );

    const Toggle = ({ checked, onChange }: any) => (
        <button
            onClick={onChange}
            className={`relative w-12 h-6 rounded-full transition-colors ${checked ? 'bg-brand-600' : 'bg-gray-300'
                }`}
        >
            <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${checked ? 'translate-x-6' : ''
                    }`}
            />
        </button>
    );

    return (
        <AppLayout hideNav>
            <div className="flex flex-col h-full bg-gray-50">
                {/* Header */}
                <div className="bg-white px-4 pt-4 pb-3 flex items-center gap-3 border-b border-gray-100">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft size={24} className="text-gray-700" />
                    </button>
                    <h1 className="text-lg font-bold text-gray-900">Settings</h1>
                </div>

                {/* Tab Navigation */}
                <div className="bg-white border-b border-gray-100 flex overflow-x-auto scrollbar-hide">
                    {[
                        { id: 'general', label: 'General', icon: User },
                        { id: 'notifications', label: 'Notifications', icon: Bell },
                        { id: 'privacy', label: 'Privacy', icon: Eye },
                        { id: 'security', label: 'Security', icon: Shield },
                    ].map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id as any)}
                            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-all whitespace-nowrap ${activeTab === id
                                ? 'border-brand-600 text-brand-600'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <Icon size={18} />
                            {label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto scrollbar-hide pb-20">
                    {/* General Settings */}
                    {activeTab === 'general' && (
                        <div className="space-y-3 py-3">
                            <SettingItem label="Dark Mode" description="Toggle dark mode for the app">
                                <Toggle checked={settings.darkMode} onChange={toggleDarkMode} />
                            </SettingItem>
                            <SettingItem label="Language" description="Change app language">
                                <select className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white">
                                    <option>English</option>
                                    <option>Spanish</option>
                                    <option>French</option>
                                    <option>German</option>
                                </select>
                            </SettingItem>
                            <SettingItem label="Theme Color" description="Choose your preferred color theme">
                                <div className="flex gap-2">
                                    {['#2563eb', '#06b6d4', '#10b981', '#f59e0b'].map(color => (
                                        <button
                                            key={color}
                                            className="w-6 h-6 rounded-full border-2 border-gray-300"
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </SettingItem>
                        </div>
                    )}

                    {/* Notification Settings */}
                    {activeTab === 'notifications' && (
                        <div className="space-y-3 py-3">
                            <SettingItem label="Messages" description="Notifications for new messages">
                                <Toggle
                                    checked={settings.notifications.messages}
                                    onChange={() => toggleNotification('messages')}
                                />
                            </SettingItem>
                            <SettingItem label="Payments" description="Notifications for payment confirmations">
                                <Toggle
                                    checked={settings.notifications.payments}
                                    onChange={() => toggleNotification('payments')}
                                />
                            </SettingItem>
                            <SettingItem label="Social Activity" description="Likes, comments, and follows">
                                <Toggle
                                    checked={settings.notifications.socialActivity}
                                    onChange={() => toggleNotification('socialActivity')}
                                />
                            </SettingItem>
                            <SettingItem label="Sound" description="Enable notification sounds">
                                <Toggle
                                    checked={settings.notifications.soundEnabled}
                                    onChange={() => toggleNotification('soundEnabled')}
                                />
                            </SettingItem>
                            <SettingItem label="Notification Timing" description="Choose when to receive notifications">
                                <select className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white">
                                    <option>Instant</option>
                                    <option>Hourly Digest</option>
                                    <option>Daily Digest</option>
                                </select>
                            </SettingItem>
                        </div>
                    )}

                    {/* Privacy Settings */}
                    {activeTab === 'privacy' && (
                        <div className="space-y-3 py-3">
                            <SettingItem label="Profile Visibility" description="Who can see your profile">
                                <select
                                    value={settings.privacy.profileVisibility}
                                    onChange={e => updatePrivacy('profileVisibility', e.target.value)}
                                    className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white"
                                >
                                    <option value="public">Public</option>
                                    <option value="followers">Followers Only</option>
                                    <option value="private">Private</option>
                                </select>
                            </SettingItem>
                            <SettingItem label="Last Seen" description="Show when you were last active">
                                <Toggle
                                    checked={settings.privacy.lastSeenVisible}
                                    onChange={() => updatePrivacy('lastSeenVisible', !settings.privacy.lastSeenVisible)}
                                />
                            </SettingItem>
                            <SettingItem label="Message Requests" description="Who can message you">
                                <select
                                    value={settings.privacy.allowMessages}
                                    onChange={e => updatePrivacy('allowMessages', e.target.value)}
                                    className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white"
                                >
                                    <option value="everyone">Everyone</option>
                                    <option value="followers">Followers Only</option>
                                    <option value="none">Nobody</option>
                                </select>
                            </SettingItem>
                            <div className="px-4 py-4 bg-white border-b border-gray-100">
                                <p className="text-sm font-semibold text-gray-900 mb-3">Blocked Users</p>
                                <div className="text-xs text-gray-500">
                                    {settings.blockedUsers.length === 0 ? 'No blocked users' : `${settings.blockedUsers.length} users blocked`}
                                </div>
                                <Button variant="outline" size="sm" className="mt-3 w-full">
                                    Manage Blocked Users
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Security Settings */}
                    {activeTab === 'security' && (
                        <div className="space-y-3 py-3">
                            <SettingItem label="Two-Factor Authentication" description="Add extra security to your account">
                                <Button variant="outline" size="sm">
                                    Enable 2FA
                                </Button>
                            </SettingItem>
                            <SettingItem label="Biometric Login" description="Use fingerprint or face ID">
                                <Toggle checked={false} onChange={() => toast.success('Biometric login enabled')} />
                            </SettingItem>
                            <SettingItem label="Active Sessions" description="Manage your active login sessions">
                                <Button variant="outline" size="sm">
                                    View Sessions
                                </Button>
                            </SettingItem>
                            <SettingItem label="Change Password" description="Update your account password">
                                <Button variant="outline" size="sm">
                                    Change
                                </Button>
                            </SettingItem>
                            <div className="px-4 py-4 bg-white border-b border-gray-100 space-y-3">
                                <p className="text-sm font-semibold text-gray-900">Account Actions</p>
                                <Button variant="outline" size="sm" className="w-full justify-start">
                                    <Database size={16} className="mr-2" />
                                    Export My Data
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full justify-start text-red-600 hover:text-red-700 border-red-200"
                                >
                                    <LogOut size={16} className="mr-2" />
                                    Log Out
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Save Button */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 flex gap-3 max-w-md mx-auto">
                    <Button variant="outline" onClick={() => navigate(-1)} className="flex-1">
                        Cancel
                    </Button>
                    <Button onClick={() => { toast.success('Settings saved!'); navigate(-1); }} className="flex-1">
                        Save Settings
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
