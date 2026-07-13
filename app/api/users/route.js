import { connectDB } from '@/lib/mongodb';
import { getSupabaseUser } from '@/lib/supabase';
import User from '@/lib/schemas/User';

export async function GET(req) {
  try {
    await connectDB();

    const user = await getSupabaseUser(req);
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current user data
    const userData = await User.findOne({ supabaseId: user.id }).select('-blockedUsers -reportedBy');

    if (!userData) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    return Response.json({ user: userData }, { status: 200 });
  } catch (error) {
    console.error('[v0] Get user error:', error);
    return Response.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectDB();

    const user = await getSupabaseUser(req);
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await req.json();

    // Prevent role/membership changes
    delete updates.role;
    delete updates.membershipTier;
    delete updates.supabaseId;

    const updatedUser = await User.findOneAndUpdate(
      { supabaseId: user.id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    return Response.json({ user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error('[v0] Update user error:', error);
    return Response.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
