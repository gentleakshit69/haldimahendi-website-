import { connectDB } from '@/lib/mongodb';
import { getSupabaseUser } from '@/lib/supabase';
import User from '@/lib/schemas/User';

// Middleware to check admin role
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

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 50;
    const skip = (page - 1) * limit;
    const role = searchParams.get('role');
    const status = searchParams.get('status');

    const query = {};
    if (role) query.role = role;
    if (status === 'active') query.isActive = true;
    if (status === 'inactive') query.isActive = false;

    const users = await User.find(query)
      .select('-blockedUsers')
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await User.countDocuments(query);

    return Response.json(
      {
        users,
        pagination: { total, page, pages: Math.ceil(total / limit) },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Admin get users error:', error);
    return Response.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function PUT(req) {
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

    const { userId, updates } = await req.json();

    // Only admins can change role/membership
    const allowedUpdates = {
      role: updates.role,
      membershipTier: updates.membershipTier,
      isActive: updates.isActive,
      isVerified: updates.isVerified,
    };

    const updatedUser = await User.findByIdAndUpdate(userId, { $set: allowedUpdates }, { new: true });

    return Response.json({ user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error('[v0] Admin update user error:', error);
    return Response.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
