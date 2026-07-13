# Quick Start Guide - 5 Minutes to Live

## Step 1: Get Your Credentials (2 minutes)

### Supabase
1. Go to https://supabase.com
2. Click "Start your project"
3. Create account
4. Create new project
5. Go to Settings → API → Copy:
   - Project URL
   - Anon Public Key
   - Service Role Key

### MongoDB Atlas
1. Go to https://mongodb.com/cloud/atlas
2. Create account
3. Create cluster (M10 tier is fine)
4. Click "Connect"
5. Copy connection string
6. Save username/password

## Step 2: Setup Environment (1 minute)

```bash
cd /vercel/share/v0-project

# Copy template
cp .env.example .env.local

# Edit with your credentials
nano .env.local
# Or use your editor: VSCode, Sublime, etc.
```

Fill in these values:
```
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_key_here
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/matrimonial?retryWrites=true&w=majority
JWT_SECRET=your_random_32_char_secret
```

## Step 3: Run Locally (2 minutes)

```bash
# Install (if not done)
pnpm install

# Start dev server
pnpm dev

# Open browser
# http://localhost:3000
```

## Step 4: Test It

1. **Homepage**: http://localhost:3000
2. **Sign Up**: http://localhost:3000/auth/signup
3. **Create account** with test email
4. **Check terminal** for verification (in dev mode)
5. **Login**: http://localhost:3000/auth/login
6. **Dashboard**: http://localhost:3000/dashboard

## Step 5: Deploy to Vercel (Optional)

```bash
# 1. Push to GitHub
git add .
git commit -m "Add auth and database"
git push

# 2. Go to https://vercel.com
# 3. Click "Import"
# 4. Select your GitHub repo
# 5. Add these environment variables:
#    - NEXT_PUBLIC_SUPABASE_URL
#    - NEXT_PUBLIC_SUPABASE_ANON_KEY
#    - SUPABASE_SERVICE_ROLE_KEY
#    - MONGODB_URI
#    - JWT_SECRET
# 6. Click "Deploy"
```

Your live URL: `https://[your-project].vercel.app`

---

## Common Commands

```bash
# Development
pnpm dev              # Start dev server

# Build for production
pnpm build            # Create optimized build

# Type checking
pnpm type-check       # Check TypeScript

# Linting
pnpm lint             # Run ESLint

# Database
# MongoDB schemas auto-sync on first write
```

## Troubleshooting Quick Fixes

**"Cannot find module"**
```bash
pnpm install
```

**"MongoDB connection failed"**
- Check MONGODB_URI format
- Whitelist your IP in MongoDB Atlas
- Verify username/password

**"Supabase auth error"**
- Check URLs don't have extra spaces
- Verify keys are correct
- Ensure project exists

**"Port 3000 already in use"**
```bash
pnpm dev -- -p 3001   # Use port 3001
```

## File Layout

```
/vercel/share/v0-project/
├── app/auth/          ← Login/Signup pages
├── app/api/           ← All API endpoints
├── app/dashboard/     ← User dashboard
├── lib/schemas/       ← Database models
├── components/        ← UI components
├── .env.example       ← Copy to .env.local
├── .env.local         ← YOUR CREDENTIALS (never commit)
├── QUICK_START.md     ← This file
├── DEPLOYMENT_GUIDE.md ← Detailed setup
├── ARCHITECTURE.md    ← Scaling guide
└── README_AUTH_DB.md  ← Full documentation
```

## API Endpoints Quick Reference

All require Authorization header:
```
Authorization: Bearer YOUR_TOKEN
```

### Auth
```
POST /api/auth/register
POST /api/auth/update-login
POST /api/auth/logout
```

### Profiles
```
GET /api/profiles?page=1&limit=20
POST /api/profiles
```

### Matches
```
POST /api/matches
GET /api/matches?status=accepted
```

### Messages
```
POST /api/messages
GET /api/messages?conversationId=xxx
```

## Next Features to Build

1. Browse page (`/dashboard/browse`)
2. Matches page (`/dashboard/matches`)
3. Messages page (`/dashboard/messages`)
4. Admin dashboard (`/admin/dashboard`)
5. Payment integration

See ARCHITECTURE.md for feature roadmap.

## Support

- Issues? Check DEPLOYMENT_GUIDE.md
- Want to scale? See ARCHITECTURE.md
- Need API info? See README_AUTH_DB.md
- Code examples? Check /app/api/ folder

---

## You're Done!

Your authentication & database system is live.

**Next**: Deploy to Vercel for free hosting.

Questions? Check the documentation files in the project root.
