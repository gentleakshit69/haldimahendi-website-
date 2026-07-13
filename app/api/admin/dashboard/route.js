import { connectDB } from '@/lib/mongodb';
import { getSupabaseUser } from '@/lib/supabase';
import User from '@/lib/schemas/User';
import Profile from '@/lib/schemas/Profile';
import Match from '@/lib/schemas/Match';
import Message from '@/lib/schemas/Message';

async function checkAdmin(supabaseId) {
  const user = await User.findOne({ supabaseId });
  return user?.role === 'admin';
}

export async function GET(req) {
  try {
    await connectDB();

    const user = await getSupabaseUser(req);
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = await checkAdmin(user.id);
    if (!isAdmin) {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Get statistics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const premiumUsers = await User.countDocuments({ membershipTier: { $ne: 'free' } });
    const verifiedUsers = await User.countDocuments({ isVerified: true });

    const completedProfiles = await Profile.countDocuments({
      dateOfBirth: { $exists: true },
      gender: { $exists: true },
    });

    const totalMatches = await Match.countDocuments();
    const acceptedMatches = await Match.countDocuments({ status: 'accepted' });
    const totalMessages = await Message.countDocuments();

    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const recentSignups = await User.countDocuments({ createdAt: { $gte: last30Days } });
    const recentMatches = await Match.countDocuments({ createdAt: { $gte: last30Days } });

    return Response.json(
      {
        stats: {
          totalUsers,
          activeUsers,
          premiumUsers,
          verifiedUsers,
          completedProfiles,
          totalMatches,
          acceptedMatches,
          totalMessages,
          recentSignups,
          recentMatches,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Admin dashboard error:', error);
    return Response.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
