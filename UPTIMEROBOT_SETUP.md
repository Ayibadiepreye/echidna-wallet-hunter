# ⏰ UptimeRobot Setup Guide

## 🎯 Why You Need This

Render **free tier sleeps after 15 minutes of inactivity**. UptimeRobot pings your app every 5 minutes to keep it awake 24/7!

## 🔗 Endpoints Available

### Option 1: `/ping` (Recommended - Fastest)
```
https://your-app-name.onrender.com/ping
```
- Returns: `pong`
- Super fast response
- Lowest resource usage

### Option 2: `/health` (More Info)
```
https://your-app-name.onrender.com/health
```
- Returns JSON with stats:
```json
{
  "status": "ok",
  "timestamp": "2024-11-23T...",
  "uptime": 3600,
  "isRunning": true,
  "totalWallets": 1234567,
  "checksPerSecond": "10234.56"
}
```

## 📋 Setup Steps

### 1. Deploy to Render First
- Push code to GitHub ✅ (already done!)
- Create Web Service on Render
- Get your URL: `https://echidna-wallet-hunter.onrender.com`

### 2. Create UptimeRobot Monitor

1. Go to: **https://uptimerobot.com**
2. Sign up (free forever)
3. Click **"+ Add New Monitor"**

**Settings:**
- Monitor Type: `HTTP(s)`
- Friendly Name: `Echidna Wallet Hunter`
- URL: `https://your-app.onrender.com/ping`
- Monitoring Interval: `5 minutes` (free tier)
- Monitor Timeout: `30 seconds`
- Alert Contacts: (optional - get notified if down)

4. Click **"Create Monitor"**

### 3. Done! 🎉

Your app will now:
- ✅ Stay awake 24/7
- ✅ Get pinged every 5 minutes
- ✅ Never sleep on Render free tier
- ✅ Run continuously checking wallets

## 📊 Expected Behavior

**Before UptimeRobot:**
- App sleeps after 15 minutes
- Needs manual wake-up
- Loses progress

**After UptimeRobot:**
- Always running
- Continuous wallet checking
- 10,000 wallets/sec × 86,400 seconds = **864 MILLION per day**

## 💡 Pro Tips

1. **Multiple Monitors**: Create monitors for both `/ping` and `/health`
   - `/ping` keeps it awake
   - `/health` lets you see stats in UptimeRobot dashboard

2. **Notifications**: Enable SMS/Email alerts so you know if it goes down

3. **Status Page**: UptimeRobot can create a public status page showing uptime

4. **Multiple Instances**: Deploy to 5-10 different services:
   - Render (this one)
   - Railway
   - Fly.io
   - Vercel (Edge Functions)
   - Netlify (Edge Functions)
   
   Each with separate UptimeRobot monitors = **5-10 BILLION wallets per day!**

## 🔍 Testing Your Endpoint

Before adding to UptimeRobot, test it:

```bash
# Test ping
curl https://your-app.onrender.com/ping

# Test health
curl https://your-app.onrender.com/health
```

Should return instant responses!

## 🚨 Important Notes

- Render free tier has **750 hours/month** (31.25 days) of runtime
- With UptimeRobot, you use all 750 hours = **24/7 uptime**
- This is **completely free** and within Render's terms of service
- UptimeRobot free tier = **50 monitors**, perfect for multiple instances

## 📈 Your Setup URLs

Once deployed on Render, your URLs will be:

- **Main App**: `https://echidna-wallet-hunter.onrender.com`
- **Ping Endpoint**: `https://echidna-wallet-hunter.onrender.com/ping`
- **Health Check**: `https://echidna-wallet-hunter.onrender.com/health`
- **API Status**: `https://echidna-wallet-hunter.onrender.com/api/status`

Use the **ping endpoint** in UptimeRobot!
