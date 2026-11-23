# 🚀 Echidna Setup Guide

Complete setup instructions for deploying Echidna to Render's free tier.

## 📋 Prerequisites

- GitHub account
- Render account (free tier)
- Supabase account (optional but recommended)
- Discord/Slack webhook (optional for notifications)

## 🎯 Step-by-Step Setup

### 1. Local Development Setup

```bash
# Install Node.js 18+ if you haven't
# Download from: https://nodejs.org/

# Navigate to project
cd echidna

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env (all optional for local testing)
# Just leave PORT=3000 for now

# Start locally
npm start

# Open browser
# Visit: http://localhost:3000
```

You should see the Echidna interface! 🎉

### 2. Get API Keys (Optional but Recommended)

#### Alchemy (for Ethereum/BSC/Polygon)
1. Go to [alchemy.com](https://www.alchemy.com/)
2. Sign up for free account
3. Create new app
4. Select "Ethereum Mainnet"
5. Copy API Key
6. Add to `.env`: `ALCHEMY_API_KEY=your_key_here`

#### BlockCypher (for Bitcoin)
1. Go to [blockcypher.com](https://www.blockcypher.com/)
2. Sign up for free account
3. Get your token
4. Add to `.env`: `BLOCKCYPHER_TOKEN=your_token_here`

**Benefits:**
- Higher rate limits
- More requests per second
- Better reliability

### 3. Supabase Database Setup

#### Create Project
1. Go to [supabase.com](https://supabase.com/)
2. Click "New Project"
3. Choose organization
4. Name: `echidna-db`
5. Database Password: Create strong password
6. Region: Choose closest to you
7. Click "Create new project" (takes ~2 minutes)

#### Create Table
1. Click "SQL Editor" in left sidebar
2. Click "New Query"
3. Copy content from `supabase-schema.sql`
4. Click "Run"
5. Should see "Success. No rows returned"

#### Get Credentials
1. Click "Settings" (gear icon)
2. Click "API"
3. Copy **Project URL** → This is `SUPABASE_URL`
4. Copy **anon public** key → This is `SUPABASE_KEY`
5. Add to `.env`:
   ```
   SUPABASE_URL=your_url_here
   SUPABASE_KEY=your_key_here
   ```

#### Verify Connection
```bash
# Restart your app
npm start

# Check terminal
# Should see: "☁️  Connected to Supabase"
# Instead of: "📁 Using local file storage"
```

### 4. Discord Notifications Setup (Optional)

#### Create Webhook
1. Open Discord
2. Go to Server Settings → Integrations
3. Click "Create Webhook"
4. Choose channel for notifications
5. Click "Copy Webhook URL"
6. Add to `.env`: `WEBHOOK_URL=your_webhook_url`

#### Test Notification
You can manually test by temporarily modifying `src/engine.js` to always trigger a hit, or just wait for the first (unlikely) hit!

### 5. Deploy to Render

#### Push to GitHub
```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial Echidna setup"

# Create GitHub repo (via GitHub website)
# Then push:
git remote add origin https://github.com/yourusername/echidna.git
git branch -M main
git push -u origin main
```

#### Deploy on Render

1. Go to [dashboard.render.com](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Click "Connect GitHub account" (if first time)
4. Find your `echidna` repository
5. Click "Connect"

6. **Configure Service:**
   - **Name**: `echidna` (or your preferred name)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: Leave empty
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

7. **Add Environment Variables:**
   Click "Advanced" → Add environment variables:
   
   ```
   NODE_ENV = production
   PORT = 3000
   ALCHEMY_API_KEY = your_alchemy_key (if you have one)
   BLOCKCYPHER_TOKEN = your_token (if you have one)
   SUPABASE_URL = your_supabase_url (if using Supabase)
   SUPABASE_KEY = your_supabase_key (if using Supabase)
   WEBHOOK_URL = your_discord_webhook (if you have one)
   ```

8. Click "Create Web Service"

9. Wait for deployment (~2-3 minutes)

10. When you see "Live", click your app URL!

### 6. Configure Auto-Sleep (Free Tier)

Render free tier sleeps after 15 minutes of inactivity.

**Solutions:**

#### Option A: Accept Sleep (Recommended for Testing)
- App sleeps when inactive
- Wakes up when you visit (takes 30-60 seconds)
- State is saved, so it resumes where it left off
- **Cost**: $0

#### Option B: Keep Alive Service (If you want 24/7)
Use a service like:
- UptimeRobot (free)
- Cron-job.org (free)
- Ping your `/health` endpoint every 10 minutes

**But** this defeats Render's free tier purpose and may violate TOS.

#### Option C: Upgrade to Paid Plan
- $7/month for always-on
- No sleep time
- More resources

### 7. Install as PWA on Mobile

1. Open your Render URL on mobile browser
2. For iOS (Safari):
   - Tap Share button
   - Tap "Add to Home Screen"
3. For Android (Chrome):
   - Tap menu (3 dots)
   - Tap "Install App" or "Add to Home Screen"

Now you can check status anytime from your phone! 📱

## 🔧 Troubleshooting

### "Module not found" Error
```bash
npm install
npm start
```

### Port Already in Use
Change PORT in `.env` to 3001 or another number.

### API Rate Limit Errors
- Get API keys (Alchemy, BlockCypher)
- Increase `checkInterval` in `src/config.js`

### Supabase Connection Failed
- Verify URL and KEY are correct
- Check if table exists
- Verify RLS policies

### Nothing Happening on Start
- Check browser console (F12)
- Check terminal for errors
- Verify API endpoints with: `curl http://localhost:3000/api/status`

## 📊 Monitoring Your Deployment

### Render Dashboard
- View logs in real-time
- Monitor resource usage
- Check deployment history

### Supabase Dashboard
- View stored data
- Monitor API requests
- Check storage usage

## 🎮 Using the App

1. **Start the Engine**: Click "START" button
2. **Watch Telemetry**: Live scrolling terminal shows activity
3. **Monitor Stats**: Wallets checked, hits, speed
4. **Pause/Resume**: Control execution anytime
5. **Check Mobile**: Install PWA for on-the-go monitoring

## 💡 Tips for Best Performance

1. **Use API Keys**: Much better rate limits
2. **Supabase**: Reliable cloud storage
3. **Notifications**: Know immediately when something happens
4. **PWA**: Check status from anywhere
5. **Be Patient**: The odds are astronomical, but that's the point!

## 🎓 What You've Learned

By setting up Echidna, you've learned:
- BIP39 mnemonic generation
- Multi-chain wallet derivation
- Blockchain API integration
- Supabase database usage
- Render deployment
- PWA configuration
- Real-time web applications
- Webhook notifications

## 🤝 Need Help?

- Check README.md for general information
- Review code comments for technical details
- Check Render logs for deployment issues
- Verify environment variables are set correctly

---

**You're all set!** The Witch of Greed awaits your command. 🌟
