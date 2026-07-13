# Matrimonial Website - Deployment & Scaling Guide

## Complete Implementation Status

### ✅ Completed
- Full Supabase Authentication (email/password)
- MongoDB database with 7 complete schemas
- User management with role-based access
- Profile creation and editing
- Matches system with like/accept/reject
- Messaging system with conversations
- Admin dashboard API
- API routes with RBAC
- Protected routes with authentication
- Dashboard home page

### 📋 Configuration Required

#### 1. Environment Setup
```bash
# Copy .env.example to .env.local
cp .env.example .env.local

# Fill in your credentials:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_32_char_secret
```

#### 2. Supabase Setup
1. Create account at https://supabase.com
2. Create new project
3. In Authentication Settings:
   - Enable Email/Password auth
   - Enable Email confirmations
   - Set redirect URLs: http://localhost:3000/auth/callback
4. Copy API credentials to .env.local

#### 3. MongoDB Setup
1. Create account at https://mongodb.com/cloud/atlas
2. Create cluster
3. Get connection string
4. Replace username:password in URI
5. Whitelist your IP address
6. Copy URI to MONGODB_URI

#### 4. Database Collections
Mongoose automatically creates collections. First data insertion creates schema:
- Users
- Profiles
- Matches
- Messages
- Conversations
- MembershipPlans
- Subscriptions

### 🚀 Deployment Steps

#### Local Development
```bash
cd /vercel/share/v0-project

# Install dependencies (already done)
pnpm install

# Run development server
pnpm dev

# Visit http://localhost:3000
```

#### Deploy to Vercel
1. Push code to GitHub
2. Go to https://vercel.com
3. Import from Git
4. Select repository
5. Add Environment Variables (from .env.local)
6. Deploy

**Environment Variables in Vercel:**
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
MONGODB_URI
MONGODB_DB_NAME
JWT_SECRET
NODE_ENV=production
```

### 🎯 Scaling Strategy

#### Horizontal Scaling (Multiple Servers)
Our architecture is stateless and ready to scale:

1. **API Layer (Next.js)**
   - Deploy to Vercel (automatic auto-scaling)
   - Or use multiple instances with load balancer
   - Each request is independent
   - No session storage on server

2. **Database Layer (MongoDB)**
   - Use MongoDB Atlas (managed sharding)
   - Enable auto-sharding for large datasets
   - Read replicas for read-heavy operations
   - Connection pooling (maxPoolSize: 10)

3. **Real-time Features (Socket.IO)**
   - Use Redis for socket.io adapter
   - Deploy to Vercel Functions or separate servers
   - Sticky sessions required for WebSocket

4. **File Storage (Supabase)**
   - Images stored in Supabase Storage
   - CDN automatically caches
   - Handles concurrent uploads

#### Performance Optimization
```javascript
// Connection pooling configured in lib/mongodb.js
maxPoolSize: 10
minPoolSize: 2
socketTimeoutMS: 45000

// Indexes for fast queries
- User: email, role, membershipTier, isActive
- Profile: userId, gender, dateOfBirth, location.coordinates
- Match: senderId, recipientId, status, createdAt
- Message: conversationId, createdAt
- Conversation: participants, lastMessageAt
```

#### Caching Strategy
```javascript
// Redis caching for frequently accessed data
- User profiles (TTL: 1 hour)
- Search results (TTL: 30 minutes)
- Message counts (TTL: 5 minutes)
- Admin stats (TTL: 15 minutes)
```

### 📊 Database Schema Overview

```
User
├── supabaseId (unique, indexed)
├── email (unique, indexed)
├── role (admin, premium, regular)
├── membershipTier
├── lastLogin
└── reportedBy[]

Profile
├── userId (indexed)
├── gender (indexed)
├── location (2dsphere index for geo-search)
├── preferences
└── verifications

Match
├── senderId (indexed)
├── recipientId (indexed)
├── status (indexed)
└── connectionDate

Message
├── conversationId (indexed)
├── senderId (indexed)
└── isRead (indexed)

Conversation
├── participants[] (indexed)
└── lastMessageAt (indexed)

Subscription
├── userId (unique, indexed)
├── status (indexed)
└── endDate (indexed)
```

### 🔐 Security Checklist

- [x] Authentication with Supabase Auth
- [x] JWT token validation
- [x] API middleware for auth checks
- [x] Role-based access control
- [x] Password hashing (Supabase handles)
- [x] CORS configured
- [x] Rate limiting middleware
- [x] Input validation with Zod
- [ ] HTTPS enforced (Vercel automatic)
- [ ] CSRF protection (add in production)
- [ ] Data encryption at rest (MongoDB Enterprise)
- [ ] Regular security audits

### 📈 Monitoring & Analytics

#### Logs
- Vercel: Real-time server logs
- MongoDB: Query performance insights
- Supabase: Auth events and API usage

#### Metrics to Track
- API response time
- Database query time
- Error rate
- Active users
- Peak traffic times
- Storage usage

### 🔧 API Routes Reference

**Authentication:**
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Handled by Supabase UI
- POST `/api/auth/logout` - Logout user
- POST `/api/auth/update-login` - Track last login

**User Management:**
- GET `/api/users` - Get current user
- PUT `/api/users` - Update user profile
- GET `/api/profiles` - Browse profiles with pagination
- POST `/api/profiles` - Create/update profile

**Matches:**
- POST `/api/matches` - Like/accept/reject
- GET `/api/matches` - Get user's matches
- GET `/api/matches?status=accepted` - Get connections

**Messages:**
- POST `/api/messages` - Send message
- GET `/api/messages?conversationId=xyz` - Get conversation
- PUT `/api/messages` - Mark as read

**Admin:**
- GET `/api/admin/users` - List all users
- PUT `/api/admin/users` - Update user role/status
- GET `/api/admin/dashboard` - Dashboard stats

### 🐛 Troubleshooting

**MongoDB Connection Error**
```javascript
// Check MONGODB_URI format
mongodb+srv://user:pass@cluster.mongodb.net/dbname?retryWrites=true

// Whitelist IP in MongoDB Atlas
```

**Supabase Auth Issues**
```javascript
// Ensure redirect URLs are configured
// Check email confirmations are enabled
// Verify NEXT_PUBLIC_SUPABASE_URL ends with .co
```

**API Rate Limiting**
```javascript
// Increase limits in lib/api-middleware.js
rateLimit(maxRequests = 100, windowMs = 60000)
```

### 📝 Additional Pages Needed

1. **Browse Profiles** - `/dashboard/browse`
2. **My Matches** - `/dashboard/matches`
3. **Conversations** - `/dashboard/messages`
4. **Profile Edit** - `/dashboard/profile`
5. **Membership Plans** - `/dashboard/membership`
6. **Admin Dashboard** - `/admin/dashboard`
7. **Admin Users** - `/admin/users`
8. **Settings** - `/dashboard/settings`

### 🎁 Next Steps

1. Set up Supabase account
2. Configure MongoDB Atlas
3. Update .env.local with credentials
4. Test authentication flow
5. Deploy to Vercel
6. Monitor performance
7. Scale based on traffic

### 📞 Support Resources

- Supabase Docs: https://supabase.com/docs
- MongoDB Docs: https://docs.mongodb.com
- Next.js Docs: https://nextjs.org/docs
- Vercel Docs: https://vercel.com/docs
