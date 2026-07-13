import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

// Client for browser/public operations
export const supabase = createClient(supabaseUrl, supabaseKey);

// Client for server operations with admin privileges
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseKey, {
  auth: {
    persistSession: false,
  },
});

export async function getSupabaseUser(req) {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) return null;

    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) return null;
    return user;
  } catch (error) {
    console.error('[v0] Error getting Supabase user:', error);
    return null;
  }
}
