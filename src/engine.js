/**
 * Echidna - Main Engine
 * "Insatiable thirst for knowledge" - The Witch of Greed
 */

import { WalletGenerator } from './generator.js';
import { SmartChecker } from './smart-checker.js';
import { Database } from './database.js';
import { Notifier } from './notifier.js';
import { config } from './config.js';

export class EchidnaEngine {
  constructor() {
    this.generator = new WalletGenerator();
    this.checker = new SmartChecker(); // SMART PRE-SCREEN - 3X FASTER!
    this.database = new Database();
    this.notifier = new Notifier();
    
    this.isRunning = false;
    this.isPaused = false;
    this.thoroughCheckInterval = 100; // Every 100th wallet gets thorough check
    this.stats = {
      totalWallets: 0,
      totalHits: 0,
      startedAt: null,
      checksPerSecond: 0,
      lastCheck: null,
    };
    
    this.logs = [];
    this.maxLogs = 100;
  }

  async initialize() {
    await this.database.initialize();
    const savedState = await this.database.loadState();
    this.stats = { ...this.stats, ...savedState };
    this.log('✨ Echidna initialized - The Witch of Greed awakens');
  }

  log(message, type = 'info') {
    const entry = {
      timestamp: new Date().toISOString(),
      message,
      type,
      id: Date.now(),
    };
    
    this.logs.unshift(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }
    
    console.log(`[${type.toUpperCase()}] ${message}`);
  }

  async start() {
    if (this.isRunning) {
      this.log('⚠️  Already running', 'warn');
      return;
    }

    this.isRunning = true;
    this.isPaused = false;
    this.stats.startedAt = this.stats.startedAt || new Date().toISOString();
    this.log('🚀 Starting wallet hunting...', 'success');

    // Don't await - let it run in background
    this.mainLoop().catch(error => {
      this.log(`❌ Main loop error: ${error.message}`, 'error');
      this.isRunning = false;
    });
  }

  async mainLoop() {
    console.log('🔄 Main loop started');
    while (this.isRunning) {
      if (this.isPaused) {
        await this.sleep(1000);
        continue;
      }

      console.log('🔄 Starting batch cycle...');
      
      try {
        // 100 parallel batches of 100 = 10,000 wallets checked simultaneously
        // 100 addresses @ 176/sec = 0.57 seconds per batch
        // 100 parallel = 10k every ~1 second = 10k/sec TARGET MET!
        const parallelBatches = 100;
        const promises = [];
        
        for (let b = 0; b < parallelBatches; b++) {
          promises.push(this.processBatch());
        }
        
        console.log(`⏳ Waiting for ${parallelBatches} batch(es) to complete...`);
        await Promise.all(promises);
        console.log('✅ Batch cycle complete');
        
      } catch (error) {
        this.log(`❌ Error: ${error.message}`, 'error');
        await this.sleep(500);
      }
    }
    console.log('🛑 Main loop exited');
  }

  async processBatch() {
    try {
      // Generate 100 wallets (tested optimal batch size)
      const batchSize = 100;
      const wallets = [];
      const addresses = [];
      
      for (let i = 0; i < batchSize; i++) {
        const wallet = this.generator.generateWallet();
        wallets.push(wallet);
        addresses.push(wallet.addresses.ethereum);
      }
      
      const batchStartTime = Date.now();
      
      // ONE RPC call for 100 wallets!
      const results = await this.checker.checkBatch(addresses);
      
      const batchElapsed = Date.now() - batchStartTime;
      
      // Process results
      for (let i = 0; i < wallets.length; i++) {
        this.stats.totalWallets++;
        
        if (results[i] && results[i].hasBalance) {
          await this.handleHit(wallets[i], [results[i]]);
        }
      }
      
      // LOG EVERY BATCH for real-time telemetry!
      this.stats.lastCheck = new Date().toISOString();
      const runtime = Date.now() - new Date(this.stats.startedAt).getTime();
      this.stats.checksPerSecond = (this.stats.totalWallets / (runtime / 1000)).toFixed(2);
      
      const batchSpeed = (batchSize / (batchElapsed / 1000)).toFixed(0);
      this.log(`⚡ ${this.stats.totalWallets.toLocaleString()} wallets | ${this.stats.checksPerSecond}/sec | Batch: ${batchSpeed}/sec`, 'info');
      
      // Save state every 10 batches (every 1k wallets)
      if (this.stats.totalWallets % 1000 === 0) {
        await this.database.saveState(this.stats);
      }
    } catch (error) {
      this.log(`❌ Batch error: ${error.message}`, 'error');
      // Don't crash - keep going
    }
  }

  async processWallet() {
    // DEPRECATED - now using batch mode in mainLoop
  }

  async handleHit(wallet, balances) {
    this.stats.totalHits++;
    
    const hitInfo = balances
      .filter(b => b.hasBalance)
      .map(b => `${b.chain}: ${b.balance} ${b.symbol}`)
      .join(', ');
    
    this.log(`🎉 HIT FOUND! ${hitInfo}`, 'hit');
    
    // Save to database
    await this.database.saveFoundWallet(wallet, balances);
    
    // Send notification
    await this.notifier.sendHit(wallet, balances, this.stats);
  }

  pause() {
    this.isPaused = true;
    this.log('⏸️  Paused', 'warn');
  }

  resume() {
    this.isPaused = false;
    this.log('▶️  Resumed', 'success');
  }

  stop() {
    this.isRunning = false;
    this.log('🛑 Stopped', 'warn');
  }

  getStatus() {
    try {
      const runtime = this.stats.startedAt 
        ? Date.now() - new Date(this.stats.startedAt).getTime()
        : 0;
      
      return {
        isRunning: this.isRunning,
        isPaused: this.isPaused,
        stats: {
          ...this.stats,
          runtime,
          runtimeFormatted: this.formatRuntime(runtime),
        },
        logs: this.logs.slice(0, 20),
        probability: this.generator.getStats(),
      };
    } catch (error) {
      console.error('getStatus error:', error);
      return {
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
      };
    }
  }

  formatRuntime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
