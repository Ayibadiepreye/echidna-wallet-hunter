# 🌟 ECHIDNA - The Witch of Greed's Wallet Hunter

> "My insatiable thirst for knowledge knows no bounds." - Echidna

A production-ready, multi-blockchain wallet hunter that generates BIP39 mnemonics and checks for balances across multiple blockchains. Features a stunning web UI inspired by Echidna from Re:Zero, real-time telemetry, PWA support, and cloud database integration.

## ⚠️ Reality Check

**Probability of Success:** 1 in 10^30 (that's 1,000,000,000,000,000,000,000,000,000,000)

This is astronomically unlikely. You could run this for trillions of years and never find a wallet with funds. This project is for:
- **Learning** about BIP39, HD wallets, and blockchain APIs
- **Recovering lost wallets** where you have partial information
- **Understanding** why cryptocurrency is secure
- **Testing** wallet generation and blockchain integration

## ✨ Features

### 🔥 Core Functionality
- **BIP39 Mnemonic Generation** - Cryptographically secure 12/24-word phrases
- **Multi-Chain Support** - Ethereum, BSC, Polygon, Bitcoin (Legacy & SegWit)
- **Balance Checking** - Real-time balance verification across all chains
- **Persistent State** - Pause/resume anytime, never lose progress
- **Supabase Integration** - Cloud database for found wallets (optional)
- **Local Storage Fallback** - Works without cloud database
- **Webhook Notifications** - Discord/Slack alerts when wallets found

### 🎨 Beautiful UI
- **Echidna-Themed Design** - Purple/gold aesthetic inspired by the Witch of Greed
- **Real-Time Telemetry** - Live scrolling terminal with colored logs
- **Statistics Dashboard** - Wallets checked, hits found, checks/second, runtime
- **Blockchain Coverage Display** - Visual tags for all supported chains
- **Notification Bar** - Prominent alerts for hits
- **PWA Support** - Install on mobile, check status anytime
- **Fully Responsive** - Works beautifully on desktop and mobile

### ⚡ Optimized for Render Free Tier
- Lightweight and efficient
- Minimal resource usage
- Automatic sleep/wake handling
- Health check endpoint

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone or create project
cd echidna

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your API keys (all optional but recommended)
# ALCHEMY_API_KEY - for better Ethereum rate limits
# BLOCKCYPHER_TOKEN - for Bitcoin API rate limits
# SUPABASE_URL & SUPABASE_KEY - for cloud storage
# WEBHOOK_URL - for notifications

# Start the application
npm start
```

Access at: `http://localhost:3000`

## 📦 Deployment to Render

### Method 1: Deploy from GitHub

1. Push code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: echidna
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
6. Add environment variables in Render dashboard
7. Deploy!

### Method 2: Deploy with Render Blueprint

```yaml
# render.yaml
services:
  - type: web
    name: echidna
    env: node
    buildCommand: npm install
    startCommand: npm start
    plan: free
    envVars:
      - key: NODE_ENV
        value: production
```

## 🗄️ Supabase Setup (Optional but Recommended)

### 1. Create Supabase Project
- Go to [supabase.com](https://supabase.com/)
- Create free account
- Create new project

### 2. Create Table

Run this SQL in Supabase SQL Editor:

```sql
CREATE TABLE found_wallets (
  id BIGSERIAL PRIMARY KEY,
  mnemonic TEXT NOT NULL,
  private_key TEXT NOT NULL,
  eth_address TEXT,
  btc_address TEXT,
  btc_segwit_address TEXT,
  balances JSONB,
  found_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX idx_found_at ON found_wallets(found_at DESC);
```

### 3. Get Credentials
- Go to Project Settings → API
- Copy **Project URL** → `SUPABASE_URL`
- Copy **anon public** key → `SUPABASE_KEY`
- Add to `.env` or Render environment variables

## 🎮 Usage

### Web Interface

1. **Start**: Click START button to begin hunting
2. **Pause**: Pause anytime, resume later
3. **Stop**: Stop the engine completely
4. **Monitor**: Watch real-time telemetry stream
5. **Stats**: Track wallets checked, hits, and performance

### API Endpoints

```javascript
// Get current status
GET /api/status

// Start engine
POST /api/start

// Pause engine
POST /api/pause

// Resume engine
POST /api/resume

// Stop engine
POST /api/stop

// Get found wallets
GET /api/found

// Get logs
GET /api/logs

// Health check (for Render)
GET /health
```

## 🧠 How It Works

### 1. **Generation**
```
Random Entropy (128-256 bits)
  ↓
BIP39 Mnemonic (12-24 words)
  ↓
Seed Derivation (PBKDF2)
  ↓
HD Key Derivation (BIP32/BIP44)
  ↓
Addresses for Multiple Chains
```

### 2. **Derivation Paths**
- Ethereum: `m/44'/60'/0'/0/0`
- Bitcoin Legacy: `m/44'/0'/0'/0/0`
- Bitcoin SegWit: `m/84'/0'/0'/0/0`

### 3. **Balance Checking**
- Uses public RPC endpoints
- No authentication needed to check balances
- Parallel requests for speed
- Rate limit aware

## 📊 Supported Blockchains

| Chain | Symbol | Address Type |
|-------|--------|--------------|
| Ethereum | ETH | 0x... |
| Binance Smart Chain | BNB | 0x... |
| Polygon | MATIC | 0x... |
| Bitcoin | BTC | 1... (Legacy) |
| Bitcoin | BTC | bc1... (SegWit) |

## 🔔 Notifications

### Discord Webhook

1. Create Discord webhook in server settings
2. Copy webhook URL
3. Add to `WEBHOOK_URL` in .env

### Slack Webhook

1. Create Slack incoming webhook
2. Copy webhook URL
3. Add to `WEBHOOK_URL` in .env

## 📱 PWA Installation

### On Mobile:
1. Open site in browser
2. Tap "Add to Home Screen"
3. App installs like native app
4. Check status anytime!

### On Desktop:
1. Click install icon in address bar
2. Install as app
3. Runs in standalone window

## 🛠️ Configuration

Edit `src/config.js` to customize:

```javascript
{
  mnemonicStrength: 128,     // 128=12 words, 256=24 words
  checkInterval: 100,         // ms between checks
  batchSize: 10,              // wallets per batch
}
```

## 📈 Performance Tips

1. **Use API Keys** - Alchemy/BlockCypher for better rate limits
2. **Adjust Intervals** - Balance speed vs rate limits
3. **Monitor Logs** - Watch for rate limit errors
4. **Cloud Database** - Supabase for reliability

## 🤔 FAQ

**Q: Will this actually find wallets?**
A: Statistically, no. The odds are 1 in 10^30. This is a learning/recovery tool.

**Q: Is this legal?**
A: Yes - checking public blockchain data is legal. Finding funds from a generated mnemonic is like finding buried treasure.

**Q: How fast can it check?**
A: Limited by API rate limits, typically 1-10 wallets/second on free tier.

**Q: Can I add more blockchains?**
A: Yes! Add providers in `src/checker.js`.

**Q: Does it work for wallet recovery?**
A: If you have PARTIAL information (some words, typos), use BTCRecover instead. Random generation won't help.

## 🎓 Educational Value

This project teaches:
- BIP39 mnemonic generation
- HD wallet derivation (BIP32/BIP44)
- Multi-chain address generation
- Blockchain API integration
- Probability and cryptography
- Why crypto is secure (impossibly large keyspace)

## 📄 License

MIT License - Use for learning and recovery purposes.

## ⚠️ Disclaimer

This software is provided for educational purposes. The probability of finding a wallet with funds through random generation is astronomically low. Use responsibly and ethically.

---

*"The Witch of Greed seeks knowledge of all possibilities, no matter how unlikely."* - Echidna
