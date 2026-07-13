import { connectDB } from '@/lib/mongodb';
import { getSupabaseUser } from '@/lib/supabase';
import User from '@/lib/schemas/User';
import Message from '@/lib/schemas/Message';
import Conversation from '@/lib/schemas/Conversation';

export async function POST(req) {
  try {
    await connectDB();

    const user = await getSupabaseUser(req);
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { conversationId, recipientId, content } = await req.json();

    if (!conversationId || !content) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const sender = await User.findOne({ supabaseId: user.id });

    const message = new Message({
      conversationId,
      senderId: sender._id,
      recipientId,
      content,
    });

    await message.save();

    // Update conversation last message
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
      lastMessageAt: new Date(),
    });

    return Response.json({ message }, { status: 201 });
  } catch (error) {
    console.error('[v0] Send message error:', error);
    return Response.json({ error: 'Failed to send message' }, { status: 500 });
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
    const conversationId = searchParams.get('conversationId');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 50;
    const skip = (page - 1) * limit;

    if (!conversationId) {
      return Response.json({ error: 'Conversation ID required' }, { status: 400 });
    }

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Message.countDocuments({ conversationId });

    return Response.json(
      {
        messages: messages.reverse(),
        pagination: { total, page, pages: Math.ceil(total / limit) },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Get messages error:', error);
    return Response.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectDB();

    const user = await getSupabaseUser(req);
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { messageId } = await req.json();

    const message = await Message.findByIdAndUpdate(
      messageId,
      { isRead: true, readAt: new Date() },
      { new: true }
    );

    return Response.json({ message }, { status: 200 });
  } catch (error) {
    console.error('[v0] Mark message read error:', error);
    return Response.json({ error: 'Failed to update message' }, { status: 500 });
  }
}
