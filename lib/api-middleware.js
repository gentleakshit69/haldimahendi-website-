import { connectDB } from './mongodb';
import { getSupabaseUser } from './supabase';

export async function withAuth(handler) {
  return async (req, res) => {
    try {
      // Connect to MongoDB
      await connectDB();

      // Get authenticated user from Supabase
      const user = await getSupabaseUser(req);
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Attach user to request
      req.user = user;

      return handler(req, res);
    } catch (error) {
      console.error('[v0] API Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}

export async function withDB(handler) {
  return async (req, res) => {
    try {
      await connectDB();
      return handler(req, res);
    } catch (error) {
      console.error('[v0] Database Error:', error);
      return res.status(500).json({ error: 'Database connection failed' });
    }
  };
}

export async function cors(req, res, next) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_APP_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (typeof next === 'function') {
    next();
  }
}

export function validateRole(allowedRoles = ['admin', 'premium', 'regular']) {
  return async (req, res, next) => {
    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }
    if (typeof next === 'function') {
      next();
    }
  };
}

export function rateLimit(maxRequests = 100, windowMs = 60000) {
  const requestCounts = new Map();

  return (req, res, next) => {
    const key = req.user?.id || req.ip;
    const now = Date.now();
    const count = requestCounts.get(key) || [];

    const recentRequests = count.filter((timestamp) => now - timestamp < windowMs);

    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({ error: 'Too many requests' });
    }

    recentRequests.push(now);
    requestCounts.set(key, recentRequests);

    if (typeof next === 'function') {
      next();
    }
  };
}
