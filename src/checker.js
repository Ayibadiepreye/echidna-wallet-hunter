/**
 * Echidna - Balance Checker
 * Multi-chain balance checking with MULTIPLE endpoints for SPEED!
 */

import axios from 'axios';
import { ethers } from 'ethers';
import { config } from './config.js';

export class BalanceChecker {
  constructor() {
    this.providers = this.initializeProviders();
    this.requestCount = 0;
    this.endpointIndex = 0; // Round-robin through endpoints
  }

  initializeProviders() {
    // Simplified providers - no network detection, just work!
    // Using best free endpoints
    return {
      ethereum: [
        new ethers.JsonRpcProvider('https://rpc.ankr.com/eth'),
        new ethers.JsonRpcProvider('https://eth.llamarpc.com'),
      ],
      bsc: [
        new ethers.JsonRpcProvider('https://rpc.ankr.com/bsc'),
        new ethers.JsonRpcProvider('https://bsc-dataseed1.binance.org'),
      ],
      polygon: [
        new ethers.JsonRpcProvider('https://rpc.ankr.com/polygon'),
        new ethers.JsonRpcProvider('https://polygon.llamarpc.com'),
      ],
      avalanche: [
        new ethers.JsonRpcProvider('https://rpc.ankr.com/avalanche'),
      ],
      arbitrum: [
        new ethers.JsonRpcProvider('https://rpc.ankr.com/arbitrum'),
      ],
    };
  }

  // Get next provider in round-robin fashion
  getProvider(chain) {
    const providers = this.providers[chain];
    const provider = providers[this.endpointIndex % providers.length];
    this.endpointIndex++;
    return provider;
  }

  async checkEthereum(address) {
    try {
      const provider = this.getProvider('ethereum');
      const balance = await provider.getBalance(address);
      const balanceEth = ethers.formatEther(balance);
      this.requestCount++;
      
      return {
        chain: 'Ethereum',
        symbol: 'ETH',
        balance: balanceEth,
        balanceWei: balance.toString(),
        hasBalance: balance > 0n,
        address,
      };
    } catch (error) {
      return { chain: 'Ethereum', balance: '0', hasBalance: false, error: error.message, address };
    }
  }

  async checkBSC(address) {
    try {
      const provider = this.getProvider('bsc');
      const balance = await provider.getBalance(address);
      const balanceBnb = ethers.formatEther(balance);
      this.requestCount++;
      
      return {
        chain: 'BSC',
        symbol: 'BNB',
        balance: balanceBnb,
        hasBalance: balance > 0n,
        address,
      };
    } catch (error) {
      return { chain: 'BSC', balance: '0', hasBalance: false, error: error.message, address };
    }
  }

  async checkPolygon(address) {
    try {
      const provider = this.getProvider('polygon');
      const balance = await provider.getBalance(address);
      const balanceMatic = ethers.formatEther(balance);
      this.requestCount++;
      
      return {
        chain: 'Polygon',
        symbol: 'MATIC',
        balance: balanceMatic,
        hasBalance: balance > 0n,
        address,
      };
    } catch (error) {
      return { chain: 'Polygon', balance: '0', hasBalance: false, error: error.message, address };
    }
  }

  async checkAvalanche(address) {
    try {
      const provider = this.getProvider('avalanche');
      const balance = await provider.getBalance(address);
      const balanceAvax = ethers.formatEther(balance);
      this.requestCount++;
      
      return {
        chain: 'Avalanche',
        symbol: 'AVAX',
        balance: balanceAvax,
        hasBalance: balance > 0n,
        address,
      };
    } catch (error) {
      return { chain: 'Avalanche', balance: '0', hasBalance: false, error: error.message, address };
    }
  }

  async checkArbitrum(address) {
    try {
      const provider = this.getProvider('arbitrum');
      const balance = await provider.getBalance(address);
      const balanceEth = ethers.formatEther(balance);
      this.requestCount++;
      
      return {
        chain: 'Arbitrum',
        symbol: 'ETH',
        balance: balanceEth,
        hasBalance: balance > 0n,
        address,
      };
    } catch (error) {
      return { chain: 'Arbitrum', balance: '0', hasBalance: false, error: error.message, address };
    }
  }

  async checkBitcoin(address) {
    try {
      const url = `https://api.blockcypher.com/v1/btc/main/addrs/${address}/balance`;
      const params = config.blockcypherToken ? { token: config.blockcypherToken } : {};
      
      const response = await axios.get(url, { params, timeout: 10000 });
      const satoshis = response.data.balance || 0;
      const btc = satoshis / 100000000;
      this.requestCount++;
      
      return {
        chain: 'Bitcoin',
        symbol: 'BTC',
        balance: btc.toString(),
        hasBalance: satoshis > 0,
        address,
      };
    } catch (error) {
      return { chain: 'Bitcoin', balance: '0', hasBalance: false, error: error.message, address };
    }
  }

  async checkAllChains(wallet) {
    // Check ALL chains in parallel - same ETH address works on all EVM chains!
    const results = await Promise.allSettled([
      this.checkEthereum(wallet.addresses.ethereum),
      this.checkBSC(wallet.addresses.ethereum),        // Same address, different network
      this.checkPolygon(wallet.addresses.ethereum),    // Same address, different network  
      this.checkAvalanche(wallet.addresses.ethereum),  // Same address, different network
      this.checkArbitrum(wallet.addresses.ethereum),   // Same address, different network
      this.checkBitcoin(wallet.addresses.bitcoin),
    ]);

    return results
      .filter(r => r.status === 'fulfilled')
      .map(r => r.value)
      .filter(r => !r.error);
  }

  getStats() {
    return {
      totalRequests: this.requestCount,
      chainsChecked: ['Ethereum', 'BSC', 'Polygon', 'Avalanche', 'Arbitrum', 'Bitcoin'],
      endpointsPerChain: {
        ethereum: this.providers.ethereum.length,
        bsc: this.providers.bsc.length,
        polygon: this.providers.polygon.length,
        avalanche: this.providers.avalanche.length,
        arbitrum: this.providers.arbitrum.length,
      }
    };
  }
}

