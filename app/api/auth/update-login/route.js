import { connectDB } from '@/lib/mongodb';
import User from '@/lib/schemas/User';

export async function POST(req) {
  try {
    await connectDB();

    const { supabaseId } = await req.json();

    if (!supabaseId) {
      return Response.json({ error: 'Missing supabaseId' }, { status: 400 });
    }

    // Update last login
    const user = await User.findOneAndUpdate(
      { supabaseId },
      { lastLogin: new Date() },
      { new: true }
    );

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    return Response.json({ message: 'Login updated' }, { status: 200 });
  } catch (error) {
    console.error('[v0] Update login error:', error);
    return Response.json({ error: 'Update failed' }, { status: 500 });
  }
}
