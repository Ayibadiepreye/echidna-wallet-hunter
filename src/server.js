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
  res.json(engine.getStatus());
});

app.post('/api/start', (req, res) => {
  engine.start();
  res.json({ success: true, message: 'Engine started' });
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

// Health check for Render
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
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
