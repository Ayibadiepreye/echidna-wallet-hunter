# VPS Deployment Guide - Echidna Wallet Hunter

## 🎯 Goal: Billions of Wallets Per Day

This guide will help you deploy Echidna on a VPS to achieve maximum throughput.

---

## 📋 Recommended VPS Providers

### Best Options (Ranked by Value):

1. **Hetzner Cloud** (Best Value)
   - CPX31: 4 vCPU, 8GB RAM - €8.90/month (~$9.50)
   - Unlimited outbound traffic
   - Fast network (1 Gbit/s)
   - Sign up: https://www.hetzner.com/cloud

2. **DigitalOcean**
   - Basic Droplet: 2 vCPU, 4GB RAM - $24/month
   - 4TB outbound transfer
   - Easy to use
   - Sign up: https://www.digitalocean.com

3. **Vultr**
   - High Performance: 2 vCPU, 4GB RAM - $18/month
   - 3TB bandwidth
   - Sign up: https://www.vultr.com

4. **Contabo**
   - Cloud VPS M: 4 vCPU, 8GB RAM - €6.99/month (~$7.50)
   - 32TB traffic
   - Very cheap but mixed reviews
   - Sign up: https://contabo.com

### Minimum Requirements:
- **CPU:** 2+ cores (4+ recommended)
- **RAM:** 4GB minimum (8GB recommended)
- **Network:** Unlimited or 3TB+ outbound traffic
- **OS:** Ubuntu 22.04 LTS

---

## 🚀 Quick Deploy Steps

### 1. Create Your VPS

Choose a provider above and create an Ubuntu 22.04 server.

### 2. Connect via SSH

```bash
ssh root@YOUR_VPS_IP
```

### 3. Run the Auto-Install Script

```bash
# Download and run the installation script
curl -o- https://raw.githubusercontent.com/Ayibadiepreye/echidna-wallet-hunter/main/deploy.sh | bash
```

**OR** manually follow the steps below ⬇️

---

## 🛠️ Manual Deployment Steps

### Step 1: Update System & Install Node.js

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Install git
apt-get install -y git

# Install PM2 (process manager)
npm install -g pm2

# Verify installations
node --version  # Should show v20.x
npm --version
```

### Step 2: Clone Your Repository

```bash
# Create app directory
mkdir -p /opt/echidna
cd /opt/echidna

# Clone from GitHub
git clone https://github.com/Ayibadiepreye/echidna-wallet-hunter.git .

# Install dependencies
npm install
```

### Step 3: Configure Environment

```bash
# Create .env file
nano .env
```

**Add this content (replace with your actual keys):**

```env
# Supabase
SUPABASE_URL=https://fvypxfnsgeybfqowcpif.supabase.co
SUPABASE_KEY=your_supabase_key_here

# Alchemy Keys (add as many as you have)
ALCHEMY_API_KEY=SfvA8i98oTWs8ITGAR-cN7XlFgWSvKJ-
ALCHEMY_API_KEY_2=alch_rnVKp5xdax7R5KI0-zZbX
ALCHEMY_API_KEY_3=your_third_key_here
ALCHEMY_API_KEY_4=your_fourth_key_here
ALCHEMY_API_KEY_5=your_fifth_key_here

# BlockCypher
BLOCKCYPHER_TOKEN=4c4661ff761c4d508e0ae41a0c480ea9

# Server
PORT=3000
NODE_ENV=production
```

**Save:** `Ctrl+X`, then `Y`, then `Enter`

### Step 4: Start with PM2

```bash
# Start the app
pm2 start src/server.js --name echidna

# Save PM2 config
pm2 save

# Setup auto-start on reboot
pm2 startup
# Run the command it outputs

# Check status
pm2 status
pm2 logs echidna
```

### Step 5: Setup Nginx (Optional - for domain)

```bash
# Install Nginx
apt-get install -y nginx

# Create Nginx config
nano /etc/nginx/sites-available/echidna
```

**Add this config:**

```nginx
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain or VPS IP

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

**Save and enable:**

```bash
# Enable site
ln -s /etc/nginx/sites-available/echidna /etc/nginx/sites-enabled/

# Test config
nginx -t

# Restart Nginx
systemctl restart nginx
```

### Step 6: Setup Firewall

```bash
# Allow SSH, HTTP, HTTPS
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 3000/tcp

# Enable firewall
ufw enable
```

---

## 📊 Monitoring & Management

### PM2 Commands

```bash
# View logs
pm2 logs echidna

# View real-time logs
pm2 logs echidna --lines 100

# Restart app
pm2 restart echidna

# Stop app
pm2 stop echidna

# Start app
pm2 start echidna

# View status
pm2 status

# Monitor CPU/RAM
pm2 monit
```

### Update the App

```bash
cd /opt/echidna
git pull origin main
npm install
pm2 restart echidna
```

---

## 🎛️ Performance Tuning

### After deployment, monitor the first hour:

```bash
# Watch logs for errors
pm2 logs echidna --lines 200

# Check for rate limits (429 errors)
pm2 logs echidna | grep "429"

# Check for timeouts
pm2 logs echidna | grep "timeout"
```

### Adjust Parallelism Based on Results:

**If you see many 429 errors:**

```bash
# Edit engine.js
nano /opt/echidna/src/engine.js

# Change this line:
const PARALLEL_BATCHES = 200;  // Reduce to 100 or 150

# Restart
pm2 restart echidna
```

**If no errors and running smooth:**

```bash
# You can try increasing to 250 or 300
const PARALLEL_BATCHES = 250;
```

---

## 🔥 Expected Performance

### Conservative Estimate (100 parallel batches):
- **10,000 addresses per second**
- **864 million wallets per day**

### Optimistic Estimate (200 parallel batches):
- **20,000 addresses per second**
- **1.728 billion wallets per day**

### With Multiple Alchemy Keys (5 keys, 200 parallel):
- **25,000+ addresses per second**
- **2.16 billion wallets per day**

---

## 🆘 Troubleshooting

### App won't start:
```bash
pm2 logs echidna
# Check for errors in .env file or missing dependencies
```

### Rate limiting (429 errors):
```bash
# Reduce PARALLEL_BATCHES in src/engine.js
# Add more Alchemy API keys to .env
```

### High CPU usage:
```bash
# This is normal - app is checking millions of wallets
# Check: htop
```

### Out of memory:
```bash
# Upgrade to larger VPS (8GB+ RAM recommended)
```

### Can't connect to Supabase:
```bash
# Check firewall allows outbound HTTPS
# Verify SUPABASE_URL and SUPABASE_KEY in .env
```

---

## 🌐 Access Your App

**Without domain:**
- http://YOUR_VPS_IP:3000

**With Nginx:**
- http://your-domain.com

**With SSL (recommended):**
```bash
# Install Certbot
apt-get install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d your-domain.com

# Auto-renewal is setup automatically
```

---

## 💡 Pro Tips

1. **Get 5 Free Alchemy Accounts**
   - Create 5 Gmail accounts
   - Sign up for free Alchemy tier on each
   - Add all 5 keys to .env
   - This gives you 5x the rate limits

2. **Monitor from Your Phone**
   - Use "Termius" app for SSH
   - Check logs: `pm2 logs echidna`

3. **Daily Backups**
   - Supabase handles database backups
   - Your code is on GitHub
   - Nothing to backup on VPS

4. **Cost Optimization**
   - Start with Hetzner CPX21 (€4.90/month)
   - Upgrade if you need more power
   - You can always resize later

---

## 📞 Support

If you hit issues during deployment, check:
1. PM2 logs: `pm2 logs echidna`
2. System logs: `journalctl -xe`
3. Nginx logs: `tail -f /var/log/nginx/error.log`

---

**Ready to deploy? Pick a VPS provider and let's go! 🚀**
