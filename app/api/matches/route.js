import { connectDB } from '@/lib/mongodb';
import { getSupabaseUser } from '@/lib/supabase';
import User from '@/lib/schemas/User';
import Match from '@/lib/schemas/Match';

export async function POST(req) {
  try {
    await connectDB();

    const user = await getSupabaseUser(req);
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { recipientId, status, message } = await req.json();

    if (!recipientId) {
      return Response.json({ error: 'Recipient ID required' }, { status: 400 });
    }

    const sender = await User.findOne({ supabaseId: user.id });

    // Check if match already exists
    let match = await Match.findOne({
      senderId: sender._id,
      recipientId,
    });

    if (match) {
      match.status = status;
      if (message) match.message = message;
      if (status === 'accepted') match.connectionDate = new Date();
    } else {
      match = new Match({
        senderId: sender._id,
        recipientId,
        status,
        message,
      });

      if (status === 'accepted') {
        match.connectionDate = new Date();
      }
    }

    await match.save();

    // Update profile stats
    if (status === 'liked' || status === 'super_liked') {
      await User.findByIdAndUpdate(recipientId, { $inc: { likeCount: 1 } });
    }

    return Response.json({ match }, { status: 201 });
  } catch (error) {
    console.error('[v0] Create match error:', error);
    return Response.json({ error: 'Failed to create match' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectDB();

    const user = await getSupabaseUser(req);
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'accepted';
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const skip = (page - 1) * limit;

    const sender = await User.findOne({ supabaseId: user.id });

    const matches = await Match.find({
      $or: [{ senderId: sender._id }, { recipientId: sender._id }],
      status,
    })
      .populate('senderId recipientId', 'email firstName lastName')
      .limit(limit)
      .skip(skip);

    const total = await Match.countDocuments({
      $or: [{ senderId: sender._id }, { recipientId: sender._id }],
      status,
    });

    return Response.json(
      {
        matches,
        pagination: { total, page, pages: Math.ceil(total / limit) },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Get matches error:', error);
    return Response.json({ error: 'Failed to fetch matches' }, { status: 500 });
  }
}
