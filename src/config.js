/**
 * Echidna - Configuration
 * "The Witch of Greed seeks knowledge of all possibilities"
 */

import dotenv from 'dotenv';
dotenv.config();

export const config = {
  // Server
  port: process.env.PORT || 3000,
  
  // API Keys
  alchemyApiKey: process.env.ALCHEMY_API_KEY || '',
  alchemyApiKey2: process.env.ALCHEMY_API_KEY_2 || '',
  blockcypherToken: process.env.BLOCKCYPHER_TOKEN || '',
  
  // Notification
  webhookUrl: process.env.WEBHOOK_URL || '',
  
  // Wallet Generation
  mnemonicStrength: 128, // 128 = 12 words, 256 = 24 words
  
  // Performance - MILLIONS PER DAY MODE!
  checkInterval: 0, // No delay! As fast as possible!
  batchSize: 1,
  
  // Persistence
  dataDir: './data',
  stateFile: './data/state.json',
  foundWalletsFile: './data/found_wallets.json',
  
  // The Mathematical Truth
  PROBABILITY_12_WORDS: Math.pow(2, 128), // 3.4 × 10^38
  ESTIMATED_ACTIVE_WALLETS: 300_000_000, // generous estimate
  
  // Blockchain RPC endpoints - Using ANKR (fast & free!)
  rpc: {
    ethereum: 'https://rpc.ankr.com/eth',
    bsc: 'https://rpc.ankr.com/bsc',
    polygon: 'https://rpc.ankr.com/polygon',
    avalanche: 'https://rpc.ankr.com/avalanche',
    arbitrum: 'https://rpc.ankr.com/arbitrum',
    optimism: 'https://rpc.ankr.com/optimism',
  }
};
