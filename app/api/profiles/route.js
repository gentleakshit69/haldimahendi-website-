import { connectDB } from '@/lib/mongodb';
import { getSupabaseUser } from '@/lib/supabase';
import User from '@/lib/schemas/User';
import Profile from '@/lib/schemas/Profile';
import Match from '@/lib/schemas/Match';

export async function GET(req) {
  try {
    await connectDB();

    const user = await getSupabaseUser(req);
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const skip = (page - 1) * limit;

    // Get current user
    const currentUser = await User.findOne({ supabaseId: user.id });
    const currentProfile = await Profile.findOne({ userId: currentUser._id });

    // Build search query
    const query = {
      gender: currentProfile.lookingFor !== 'anyone' ? currentProfile.lookingFor : { $in: ['male', 'female'] },
      userId: { $ne: currentUser._id },
    };

    // Age filter
    if (currentProfile.preferences?.ageMin || currentProfile.preferences?.ageMax) {
      const minAge = currentProfile.preferences.ageMin || 18;
      const maxAge = currentProfile.preferences.ageMax || 100;
      const maxDOB = new Date();
      maxDOB.setFullYear(maxDOB.getFullYear() - minAge);
      const minDOB = new Date();
      minDOB.setFullYear(minDOB.getFullYear() - maxAge);

      query.dateOfBirth = { $gte: minDOB, $lte: maxDOB };
    }

    // Get profiles
    const profiles = await Profile.find(query)
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await Profile.countDocuments(query);

    return Response.json(
      {
        profiles,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Get profiles error:', error);
    return Response.json({ error: 'Failed to fetch profiles' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const user = await getSupabaseUser(req);
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await req.json();

    const currentUser = await User.findOne({ supabaseId: user.id });
    let profile = await Profile.findOne({ userId: currentUser._id });

    if (!profile) {
      profile = new Profile({ userId: currentUser._id, ...updates });
    } else {
      Object.assign(profile, updates);
    }

    await profile.save();

    // Mark profile as complete if all required fields are filled
    if (
      profile.dateOfBirth &&
      profile.gender &&
      profile.lookingFor &&
      profile.location?.city &&
      profile.bio
    ) {
      currentUser.profileComplete = true;
      await currentUser.save();
    }

    return Response.json({ profile }, { status: 200 });
  } catch (error) {
    console.error('[v0] Update profile error:', error);
    return Response.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
