/**
 * Echidna - Database Handler
 * Supabase integration for storing found wallets
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import { config } from './config.js';

export class Database {
  constructor() {
    this.supabase = null;
    this.useLocal = !process.env.SUPABASE_URL || !process.env.SUPABASE_KEY;
    
    if (!this.useLocal) {
      this.supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_KEY
      );
    }
  }

  async initialize() {
    if (this.useLocal) {
      await fs.mkdir(config.dataDir, { recursive: true });
      console.log('📁 Using local file storage');
    } else {
      console.log('☁️  Connected to Supabase');
    }
  }

  async saveFoundWallet(wallet, balances) {
    const record = {
      mnemonic: wallet.mnemonic,
      private_key: wallet.privateKey,
      eth_address: wallet.addresses.ethereum,
      btc_address: wallet.addresses.bitcoin,
      btc_segwit_address: wallet.addresses.bitcoinSegWit,
      balances: JSON.stringify(balances),
      found_at: new Date().toISOString(),
    };

    if (this.useLocal) {
      return this.saveLocal(record);
    } else {
      return this.saveSupabase(record);
    }
  }

  async saveLocal(record) {
    try {
      let data = [];
      try {
        const content = await fs.readFile(config.foundWalletsFile, 'utf-8');
        data = JSON.parse(content);
      } catch {}

      data.push(record);
      await fs.writeFile(config.foundWalletsFile, JSON.stringify(data, null, 2));
      return { success: true, storage: 'local' };
    } catch (error) {
      console.error('Local save error:', error);
      return { success: false, error: error.message };
    }
  }

  async saveSupabase(record) {
    try {
      const { data, error } = await this.supabase
        .from('found_wallets')
        .insert([record]);

      if (error) throw error;
      return { success: true, storage: 'supabase', data };
    } catch (error) {
      console.error('Supabase save error:', error);
      return { success: false, error: error.message };
    }
  }

  async getFoundWallets() {
    if (this.useLocal) {
      try {
        const content = await fs.readFile(config.foundWalletsFile, 'utf-8');
        return JSON.parse(content);
      } catch {
        return [];
      }
    } else {
      const { data, error } = await this.supabase
        .from('found_wallets')
        .select('*')
        .order('found_at', { ascending: false });

      return error ? [] : data;
    }
  }

  async saveState(state) {
    try {
      await fs.writeFile(config.stateFile, JSON.stringify(state, null, 2));
    } catch (error) {
      console.error('State save error:', error);
    }
  }

  async loadState() {
    try {
      const content = await fs.readFile(config.stateFile, 'utf-8');
      return JSON.parse(content);
    } catch {
      return {
        totalWallets: 0,
        totalHits: 0,
        startedAt: new Date().toISOString(),
        isRunning: false,
      };
    }
  }
}
