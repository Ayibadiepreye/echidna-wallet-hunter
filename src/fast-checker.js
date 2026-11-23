/**
 * Echidna - ULTRA FAST Checker
 * Smart checking: Only check Ethereum first (fastest), then others only if balance found
 * Millions per day strategy!
 */

import axios from 'axios';
import { ethers } from 'ethers';
import { config } from './config.js';

export class FastChecker {
  constructor() {
    this.requestCount = 0;
    this.ethProviderIndex = 0;
    
    // Create MULTIPLE Ethereum providers for round-robin speed
    this.ethProviders = [
      new ethers.JsonRpcProvider('https://rpc.ankr.com/eth'),
      new ethers.JsonRpcProvider('https://eth.llamarpc.com'),
      new ethers.JsonRpcProvider('https://ethereum.publicnode.com'),
      new ethers.JsonRpcProvider('https://1rpc.io/eth'),
      new ethers.JsonRpcProvider('https://eth.rpc.blxrbdn.com'),
    ];
    
    // Add Alchemy keys if available (FASTEST!)
    if (config.alchemyApiKey) {
      this.ethProviders.push(
        new ethers.JsonRpcProvider(`https://eth-mainnet.g.alchemy.com/v2/${config.alchemyApiKey}`)
      );
    }
    if (config.alchemyApiKey2) {
      this.ethProviders.push(
        new ethers.JsonRpcProvider(`https://eth-mainnet.g.alchemy.com/v2/${config.alchemyApiKey2}`)
      );
    }
    
    // Other chains (lazy loaded only when needed)
    this.otherProviders = {
      bsc: new ethers.JsonRpcProvider('https://rpc.ankr.com/bsc'),
      polygon: new ethers.JsonRpcProvider('https://rpc.ankr.com/polygon'),
      avalanche: new ethers.JsonRpcProvider('https://rpc.ankr.com/avalanche'),
      arbitrum: new ethers.JsonRpcProvider('https://rpc.ankr.com/arbitrum'),
    };
  }

  // Get next Ethereum provider in round-robin
  getEthProvider() {
    const provider = this.ethProviders[this.ethProviderIndex % this.ethProviders.length];
    this.ethProviderIndex++;
    return provider;
  }

  async checkEthereumOnly(address) {
    try {
      const provider = this.getEthProvider();
      const balance = await provider.getBalance(address);
      this.requestCount++;
      
      return {
        chain: 'Ethereum',
        symbol: 'ETH',
        balance: ethers.formatEther(balance),
        hasBalance: balance > 0n,
        address,
      };
    } catch (error) {
      return { chain: 'Ethereum', balance: '0', hasBalance: false, error: error.message, address };
    }
  }

  async checkAllEVMChains(address) {
    // Check all EVM chains in parallel (same address works on all!)
    const results = await Promise.allSettled([
      this.checkEthereumOnly(address),
      this.checkChain('bsc', address, 'BNB'),
      this.checkChain('polygon', address, 'MATIC'),
      this.checkChain('avalanche', address, 'AVAX'),
      this.checkChain('arbitrum', address, 'ETH'),
    ]);

    return results
      .filter(r => r.status === 'fulfilled')
      .map(r => r.value)
      .filter(r => !r.error);
  }

  async checkChain(chainName, address, symbol) {
    try {
      const provider = this.otherProviders[chainName];
      const balance = await provider.getBalance(address);
      this.requestCount++;
      
      return {
        chain: chainName.toUpperCase(),
        symbol,
        balance: ethers.formatEther(balance),
        hasBalance: balance > 0n,
        address,
      };
    } catch (error) {
      return { chain: chainName, balance: '0', hasBalance: false, error: error.message, address };
    }
  }

  async checkBitcoin(address) {
    try {
      const url = `https://api.blockcypher.com/v1/btc/main/addrs/${address}/balance`;
      const params = config.blockcypherToken ? { token: config.blockcypherToken } : {};
      
      const response = await axios.get(url, { params, timeout: 5000 });
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

  /**
   * ULTRA FAST MODE: Only check Ethereum (fastest chain)
   * This gives maximum speed for initial screening
   */
  async checkFast(wallet) {
    // Only check Ethereum - fastest screening
    const ethResult = await this.checkEthereumOnly(wallet.addresses.ethereum);
    return [ethResult];
  }

  /**
   * THOROUGH MODE: Check all chains if Ethereum shows promise
   * or for periodic deep checks
   */
  async checkThorough(wallet) {
    const results = await Promise.allSettled([
      ...await this.checkAllEVMChains(wallet.addresses.ethereum),
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
      ethProviders: this.ethProviders.length,
      mode: 'ULTRA FAST - Ethereum Only Priority',
    };
  }
}
