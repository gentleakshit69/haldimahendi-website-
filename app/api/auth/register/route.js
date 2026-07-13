import { connectDB } from '@/lib/mongodb';
import User from '@/lib/schemas/User';
import Profile from '@/lib/schemas/Profile';

export async function POST(req) {
  try {
    await connectDB();

    const { supabaseId, email, firstName, lastName } = await req.json();

    if (!supabaseId || !email || !firstName || !lastName) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return Response.json({ error: 'User already exists' }, { status: 400 });
    }

    // Create new user
    user = new User({
      supabaseId,
      email,
      firstName,
      lastName,
      role: 'regular',
      membershipTier: 'free',
    });

    await user.save();

    // Create empty profile
    const profile = new Profile({
      userId: user._id,
      gender: 'male',
      lookingFor: 'female',
    });

    await profile.save();

    return Response.json(
      {
        message: 'User registered successfully',
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[v0] Register error:', error);
    return Response.json({ error: 'Registration failed' }, { status: 500 });
  }
}
