import { useNavigate } from 'react-router-dom';
import { MessageCircle, Users, Compass, User, ArrowRight, Zap, Shield, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: MessageCircle,
      title: 'Instant Messaging',
      description: 'Connect with friends and family through secure, real-time messaging.'
    },
    {
      icon: Zap,
      title: 'Fast Payments',
      description: 'Send and receive money instantly with our integrated payment system.'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your conversations and transactions are protected with end-to-end encryption.'
    },
    {
      icon: Globe,
      title: 'Global Network',
      description: 'Connect with people worldwide in a decentralized social network.'
    }
  ];

  const quickActions = [
    { path: '/chats', label: 'Start Chatting', icon: MessageCircle },
    { path: '/contacts', label: 'Find Contacts', icon: Users },
    { path: '/explore', label: 'Explore', icon: Compass },
    { path: '/profile', label: 'My Profile', icon: User }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Welcome to Oumas
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your all-in-one platform for messaging, payments, and social connections.
            Connect, communicate, and transact securely in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/chats')} className="text-lg px-8">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/explore')} className="text-lg px-8">
              Explore Features
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-blue-100 dark:bg-blue-900 rounded-full w-fit">
                  <feature.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="text-center">
          <h2 className="text-3xl font-semibold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-20 flex flex-col gap-2 hover:bg-blue-50 dark:hover:bg-blue-950"
                onClick={() => navigate(action.path)}
              >
                <action.icon className="h-6 w-6" />
                <span className="text-sm">{action.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
