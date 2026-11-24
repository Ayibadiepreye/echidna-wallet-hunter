#!/bin/bash

##############################################
# Echidna Wallet Hunter - VPS Auto-Deploy
# Run: curl -o- URL_TO_THIS_SCRIPT | bash
##############################################

set -e  # Exit on error

echo "🦔 Echidna Wallet Hunter - VPS Deployment"
echo "=========================================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo "❌ Please run as root (use: sudo bash deploy.sh)"
  exit 1
fi

echo "📦 Step 1: Updating system..."
apt update -qq && apt upgrade -y -qq

echo "📦 Step 2: Installing Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash - > /dev/null 2>&1
apt-get install -y nodejs git -qq

echo "📦 Step 3: Installing PM2..."
npm install -g pm2 --silent

echo "✅ Installed:"
echo "   Node.js: $(node --version)"
echo "   npm: $(npm --version)"
echo "   PM2: $(pm2 --version)"
echo ""

echo "📂 Step 4: Setting up application directory..."
mkdir -p /opt/echidna
cd /opt/echidna

echo "📥 Step 5: Cloning repository..."
if [ -d ".git" ]; then
  echo "   Repository already exists, pulling latest..."
  git pull origin main
else
  git clone https://github.com/Ayibadiepreye/echidna-wallet-hunter.git .
fi

echo "📦 Step 6: Installing dependencies..."
npm install --production --silent

echo ""
echo "🔑 Step 7: Environment Configuration"
echo "======================================"
echo ""

if [ -f ".env" ]; then
  echo "⚠️  .env file already exists. Keeping existing configuration."
else
  echo "Creating .env file..."
  
  read -p "Enter Supabase URL: " SUPABASE_URL
  read -p "Enter Supabase Key: " SUPABASE_KEY
  read -p "Enter Alchemy API Key 1: " ALCHEMY_KEY_1
  read -p "Enter Alchemy API Key 2 (optional): " ALCHEMY_KEY_2
  read -p "Enter Alchemy API Key 3 (optional): " ALCHEMY_KEY_3
  
  cat > .env << EOF
# Supabase
SUPABASE_URL=$SUPABASE_URL
SUPABASE_KEY=$SUPABASE_KEY

# Alchemy Keys
ALCHEMY_API_KEY=$ALCHEMY_KEY_1
EOF

  if [ -n "$ALCHEMY_KEY_2" ]; then
    echo "ALCHEMY_API_KEY_2=$ALCHEMY_KEY_2" >> .env
  fi
  
  if [ -n "$ALCHEMY_KEY_3" ]; then
    echo "ALCHEMY_API_KEY_3=$ALCHEMY_KEY_3" >> .env
  fi
  
  cat >> .env << EOF

# Server
PORT=3000
NODE_ENV=production
EOF

  echo "✅ .env file created"
fi

echo ""
echo "🚀 Step 8: Starting application with PM2..."

# Stop if already running
pm2 stop echidna 2>/dev/null || true
pm2 delete echidna 2>/dev/null || true

# Start fresh
pm2 start src/server.js --name echidna --time
pm2 save

echo ""
echo "⚙️  Step 9: Setting up auto-start on reboot..."
pm2 startup systemd -u root --hp /root > /tmp/pm2-startup.sh
bash /tmp/pm2-startup.sh
rm /tmp/pm2-startup.sh

echo ""
echo "🔥 Step 10: Configuring firewall..."
ufw --force enable
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'
ufw allow 3000/tcp comment 'Echidna'

echo ""
echo "✅ Deployment Complete!"
echo "======================"
echo ""
echo "📊 Application Status:"
pm2 status
echo ""
echo "🌐 Access your app:"
echo "   http://$(curl -s ifconfig.me):3000"
echo ""
echo "📝 Useful commands:"
echo "   pm2 logs echidna          # View logs"
echo "   pm2 restart echidna       # Restart app"
echo "   pm2 stop echidna          # Stop app"
echo "   pm2 monit                 # Monitor CPU/RAM"
echo ""
echo "📖 Full documentation: /opt/echidna/VPS-DEPLOYMENT.md"
echo ""
echo "🎯 Next steps:"
echo "   1. Open http://$(curl -s ifconfig.me):3000 in browser"
echo "   2. Click START button"
echo "   3. Monitor: pm2 logs echidna"
echo "   4. Watch for rate limits (429 errors)"
echo "   5. Adjust PARALLEL_BATCHES in src/engine.js if needed"
echo ""
echo "🦔 Happy hunting! Billions of wallets await..."
