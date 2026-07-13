'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Heart, MessageCircle, Users, LogOut, Edit, Settings } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    matches: 0,
    likes: 0,
    messages: 0,
  });

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        router.push('/auth/login');
        return;
      }

      try {
        // Fetch user data
        const response = await fetch('/api/users');
        const data = await response.json();
        setUser(data.user);

        // Fetch stats
        const matchesRes = await fetch('/api/matches?status=accepted&limit=1');
        const matchesData = await matchesRes.json();
        setStats((prev) => ({
          ...prev,
          matches: matchesData.pagination?.total || 0,
        }));
      } catch (error) {
        console.error('[v0] Dashboard error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/5">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">
              Welcome back, {user?.firstName}
            </h1>
            <p className="text-foreground/60 mt-2">
              Tier: <span className="font-semibold capitalize">{user?.membershipTier}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard/profile">
              <Button variant="outline" size="md">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </Link>
            <Button variant="ghost" size="md" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground/60 text-sm">Matches</p>
                <p className="text-3xl font-bold text-primary">{stats.matches}</p>
              </div>
              <Heart className="w-12 h-12 text-primary/20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground/60 text-sm">Likes Received</p>
                <p className="text-3xl font-bold text-secondary">{user?.likeCount || 0}</p>
              </div>
              <Heart className="w-12 h-12 text-secondary/20 fill-secondary/20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground/60 text-sm">Active Connections</p>
                <p className="text-3xl font-bold text-accent">{stats.matches}</p>
              </div>
              <Users className="w-12 h-12 text-accent/20" />
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Profile Completion</h3>
            <div className="mb-4">
              <div className="w-full bg-border rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{
                    width: user?.profileComplete ? '100%' : '60%',
                  }}
                ></div>
              </div>
            </div>
            <p className="text-foreground/60 text-sm mb-4">
              {user?.profileComplete ? 'Profile Complete!' : 'Complete your profile to get more matches'}
            </p>
            {!user?.profileComplete && (
              <Link href="/dashboard/profile">
                <Button variant="primary" size="sm" className="w-full">
                  Complete Profile
                </Button>
              </Link>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Membership</h3>
            <p className="text-foreground/60 text-sm mb-4">
              Upgrade your membership to unlock premium features
            </p>
            <Link href="/dashboard/membership">
              <Button variant="primary" size="sm" className="w-full">
                View Plans
              </Button>
            </Link>
          </Card>
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link href="/dashboard/browse">
            <Card className="p-6 hover:shadow-lg transition-all cursor-pointer h-full">
              <Users className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-bold">Browse Profiles</h3>
              <p className="text-foreground/60 text-sm">Find your perfect match</p>
            </Card>
          </Link>

          <Link href="/dashboard/matches">
            <Card className="p-6 hover:shadow-lg transition-all cursor-pointer h-full">
              <Heart className="w-8 h-8 text-secondary mb-3" />
              <h3 className="font-bold">My Matches</h3>
              <p className="text-foreground/60 text-sm">View your connections</p>
            </Card>
          </Link>

          <Link href="/dashboard/messages">
            <Card className="p-6 hover:shadow-lg transition-all cursor-pointer h-full">
              <MessageCircle className="w-8 h-8 text-accent mb-3" />
              <h3 className="font-bold">Messages</h3>
              <p className="text-foreground/60 text-sm">Chat with your matches</p>
            </Card>
          </Link>

          <Link href="/dashboard/settings">
            <Card className="p-6 hover:shadow-lg transition-all cursor-pointer h-full">
              <Settings className="w-8 h-8 text-primary/60 mb-3" />
              <h3 className="font-bold">Settings</h3>
              <p className="text-foreground/60 text-sm">Account preferences</p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
