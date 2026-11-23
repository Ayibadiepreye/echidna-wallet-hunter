# ⚡ Echidna - Quick Start Guide

## 🎯 Fastest Way to Get Started

### 1. Install Dependencies (5 minutes)

```bash
npm install
```

If this takes too long or fails, install in stages:
```bash
npm install express axios dotenv
npm install ethers bip39 bitcoinjs-lib
npm install @supabase/supabase-js
```

### 2. Configure (1 minute)

```bash
# Copy environment template
cp .env.example .env

# Edit .env if you have API keys (optional for testing)
# For now, just ensure PORT=3000 is set
```

### 3. Run Locally (30 seconds)

```bash
npm start
```

Open: http://localhost:3000

That's it! You should see the Echidna interface. 🎉

## 🎮 Quick Test

1. Click **START** button
2. Watch the telemetry terminal scroll
3. See stats update in real-time
4. Click **PAUSE** to pause
5. Click **STOP** to stop

## 🚀 Deploy to Render (10 minutes)

### Fast Track:

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Echidna setup"
   # Create repo on GitHub, then:
   git remote add origin https://github.com/yourusername/echidna.git
   git push -u origin main
   ```

2. **Deploy on Render**:
   - Go to [render.com](https://render.com)
   - New + → Web Service
   - Connect your GitHub repo
   - Settings:
     - Build: `npm install`
     - Start: `npm start`
     - Plan: Free
   - Click "Create Web Service"
   - Wait 2-3 minutes → Live!

3. **Done!** Access your URL and start hunting.

## 📱 Install on Phone (2 minutes)

1. Open your Render URL on mobile
2. **iOS**: Share → Add to Home Screen
3. **Android**: Menu → Install App

Now you can monitor from anywhere!

## 🎓 What It Does

- **Generates** BIP39 wallet mnemonics (12 words)
- **Derives** addresses for Ethereum, BSC, Polygon, Bitcoin
- **Checks** balances across all chains
- **Stores** any wallets with balance (astronomically unlikely!)
- **Shows** real-time telemetry and stats

## 🤔 Common Questions

**Q: Will it find anything?**
A: Odds are 1 in 10^30. This is for learning about wallets and blockchain APIs.

**Q: Does it work offline?**
A: No, it needs internet to check blockchain balances via public APIs.

**Q: How fast is it?**
A: ~1-10 wallets/second on free tier (limited by API rate limits).

**Q: Can I add more blockchains?**
A: Yes! Edit `src/checker.js` and add more chain providers.

## 🔥 Pro Tips

1. **Get API Keys** (free):
   - [Alchemy](https://alchemy.com) for better Ethereum rate limits
   - [BlockCypher](https://blockcypher.com) for Bitcoin rate limits

2. **Setup Supabase** (free):
   - Cloud database for storing any hits
   - See SETUP.md for detailed instructions

3. **Add Notifications**:
   - Discord webhook for instant alerts
   - See SETUP.md for webhook setup

## 📚 Full Documentation

- **README.md** - Complete project overview
- **SETUP.md** - Detailed setup with screenshots
- **supabase-schema.sql** - Database schema
- **render.yaml** - One-click deploy config

## 🛟 Need Help?

If npm install fails:
```bash
# Try with legacy peer deps
npm install --legacy-peer-deps

# Or use yarn
npm install -g yarn
yarn install
```

If port is taken:
```bash
# Edit .env
PORT=3001
```

If APIs fail:
- Check internet connection
- APIs might be rate-limited (get API keys)
- Check terminal for specific errors

## 🎉 You're Ready!

The Witch of Greed awaits your command. Start hunting! 🌟

---

**Remember:** This is a learning project. The probability of finding funded wallets through random generation is essentially zero. Use it to understand how wallets, blockchains, and cryptography work!
