# 🦔 Echidna Wallet Hunter - Quick Start

## ⚡ 60-Second Deploy to VPS

### 1. Get a VPS
**Recommended:** Hetzner CPX31 (€8.90/month)
- Sign up: https://www.hetzner.com/cloud
- Create Ubuntu 22.04 server
- Note your IP address

### 2. SSH into VPS
```bash
ssh root@YOUR_VPS_IP
```

### 3. Run Auto-Installer
```bash
curl -o- https://raw.githubusercontent.com/Ayibadiepreye/echidna-wallet-hunter/main/deploy.sh | bash
```

### 4. Access Your App
```
http://YOUR_VPS_IP:3000
```

**That's it! You're checking billions of wallets.** 🚀

---

## 📊 Expected Performance

| Setup | Speed | Daily Volume |
|-------|-------|--------------|
| Basic (100 parallel) | 10k/sec | 864 million/day |
| Optimized (200 parallel) | 20k/sec | 1.7 billion/day |
| Max (5 Alchemy keys) | 25k/sec | 2.1 billion/day |

---

## 🎯 What It Checks

✅ **Only checks:** `eth_getBalance`  
✅ **Only saves:** Wallets with balance > 0  
✅ **No wasted space or time**

---

## 📱 Monitor From Your Phone

1. Install "Termius" SSH app
2. Connect to your VPS
3. Run: `pm2 logs echidna`

---

## 🔧 Useful Commands

```bash
# View logs
pm2 logs echidna

# Restart app
pm2 restart echidna

# Check performance
bash /opt/echidna/monitor.sh

# Update app
cd /opt/echidna && git pull && pm2 restart echidna
```

---

## 🚨 If You Hit Rate Limits

**See many 429 errors in logs?**

1. Edit config:
```bash
nano /opt/echidna/src/engine.js
```

2. Change this line:
```javascript
const PARALLEL_BATCHES = 200;  // Reduce to 100
```

3. Restart:
```bash
pm2 restart echidna
```

**OR** Add more Alchemy API keys to `.env`

---

## 💡 Pro Tips

### Get 5 Free Alchemy Accounts
1. Create 5 Gmail accounts
2. Sign up at https://www.alchemy.com (free tier)
3. Add all keys to `/opt/echidna/.env`:
```env
ALCHEMY_API_KEY=key1
ALCHEMY_API_KEY_2=key2
ALCHEMY_API_KEY_3=key3
ALCHEMY_API_KEY_4=key4
ALCHEMY_API_KEY_5=key5
```
4. Restart: `pm2 restart echidna`

### Cost Optimization
- Start small: Hetzner CPX21 (€4.90/month)
- Monitor performance for 24 hours
- Upgrade if CPU maxed out

---

## 🆘 Troubleshooting

**App won't start:**
```bash
pm2 logs echidna
# Check for .env errors
```

**No wallets being checked:**
```bash
# Check if START button was clicked in browser
# Check logs: pm2 logs echidna
```

**High CPU (100%):**
```
This is normal - app is checking millions of wallets
```

---

## 📖 Full Documentation

- Detailed guide: `VPS-DEPLOYMENT.md`
- Code on GitHub: https://github.com/Ayibadiepreye/echidna-wallet-hunter

---

## ✅ Your App is Configured to:

- ✅ Check only `eth_getBalance` (nothing else)
- ✅ Save only wallets with balance > 0
- ✅ Use 200 parallel batches (20k addresses/cycle)
- ✅ Rotate across 10+ free RPC endpoints
- ✅ Support unlimited Alchemy API keys
- ✅ Target 1.7 billion wallets/day

**Everything is optimized. Just deploy to VPS and start! 🦔**
