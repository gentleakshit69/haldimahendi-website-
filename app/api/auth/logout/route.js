import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req) {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (token) {
      await supabaseAdmin.auth.admin.signOut(token);
    }

    return Response.json({ message: 'Logged out successfully' }, { status: 200 });
  } catch (error) {
    console.error('[v0] Logout error:', error);
    return Response.json({ error: 'Logout failed' }, { status: 500 });
  }
}
