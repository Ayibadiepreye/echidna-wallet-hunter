/**
 * Echidna - API Server
 * Express server for web interface and API
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { EchidnaEngine } from './engine.js';
import { config } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const engine = new EchidnaEngine();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Initialize engine
await engine.initialize();

// API Routes
app.get('/api/status', (req, res) => {
  try {
    const status = engine.getStatus();
    res.json(status);
  } catch (error) {
    console.error('Status error:', error);
    res.json({
      isRunning: false,
      isPaused: false,
      stats: {
        totalWallets: 0,
        totalHits: 0,
        checksPerSecond: '0',
        runtimeFormatted: '0s'
      },
      logs: [],
      probability: { oddsPerAttempt: '1 in 10^30' }
    });
  }
});

app.post('/api/start', (req, res) => {
  try {
    console.log('📡 Start request received');
    engine.start(); // Don't await - it runs in background
    console.log('✅ Engine start initiated');
    res.json({ success: true, message: 'Engine started' });
  } catch (error) {
    console.error('❌ Start error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/pause', (req, res) => {
  engine.pause();
  res.json({ success: true, message: 'Engine paused' });
});

app.post('/api/resume', (req, res) => {
  engine.resume();
  res.json({ success: true, message: 'Engine resumed' });
});

app.post('/api/stop', (req, res) => {
  engine.stop();
  res.json({ success: true, message: 'Engine stopped' });
});

app.get('/api/found', async (req, res) => {
  const wallets = await engine.database.getFoundWallets();
  res.json(wallets);
});

app.get('/api/logs', (req, res) => {
  res.json(engine.logs);
});

// Health check for UptimeRobot / Render
app.get('/health', (req, res) => {
  const status = engine.getStatus();
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    isRunning: status.isRunning,
    totalWallets: status.stats.totalWallets,
    checksPerSecond: status.stats.checksPerSecond,
  });
});

// Simple ping endpoint (fastest response)
app.get('/ping', (req, res) => {
  res.send('pong');
});

// Test endpoint to verify code version
app.get('/version', (req, res) => {
  res.json({
    version: '2.0',
    batchSize: 100,
    parallelBatches: 100,
    timestamp: new Date().toISOString(),
    message: 'Latest code deployed'
  });
});

// PWA Manifest
app.get('/manifest.json', (req, res) => {
  res.json({
    name: 'Echidna - Wallet Hunter',
    short_name: 'Echidna',
    description: 'The Witch of Greed\'s Wallet Hunter',
    start_url: '/',
    display: 'standalone',
    background_color: '#1a1a2e',
    theme_color: '#9b59b6',
    icons: [
      {
        src: '/echidna.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: '/echidna.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
        purpose: 'any'
      },
    ],
  });
});

// Serve index.html for all other routes (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

const PORT = config.port;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌟 Echidna server running on port ${PORT}`);
  console.log(`🌐 Access at: http://localhost:${PORT}`);
});

export { app, engine };
