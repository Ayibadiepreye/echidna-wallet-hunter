/**
 * Echidna - RAW HTTP Ultra Fast Checker
 * Direct JSON-RPC calls with axios - NO ethers.js overhead!
 * Target: MILLIONS per day!
 */

import axios from 'axios';

export class UltraFastChecker {
  constructor() {
    this.requestCount = 0;
    this.endpointIndex = 0;
    
    // MAXIMUM endpoints for load balancing - aiming for 3-5M/day!
    this.endpoints = [
      // Free public RPCs
      'https://rpc.ankr.com/eth',
      'https://eth.llamarpc.com',
      'https://ethereum.publicnode.com',
      'https://1rpc.io/eth',
      'https://eth.rpc.blxrbdn.com',
      'https://rpc.flashbots.net',
      'https://cloudflare-eth.com',
      'https://eth-mainnet.public.blastapi.io',
      'https://api.mycryptoapi.com/eth',
      'https://ethereumnodelight.app.runonflux.io',
    ];
    
    // Add Alchemy keys (you have 2!)
    if (process.env.ALCHEMY_API_KEY) {
      this.endpoints.push(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`);
    }
    if (process.env.ALCHEMY_API_KEY_2) {
      this.endpoints.push(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY_2}`);
    }
    
    console.log(`🚀 Ultra Fast Checker initialized with ${this.endpoints.length} endpoints`);
  }

  getEndpoint() {
    const endpoint = this.endpoints[this.endpointIndex % this.endpoints.length];
    this.endpointIndex++;
    return endpoint;
  }

  /**
   * Direct JSON-RPC call - MUCH faster than ethers.js!
   */
  async checkEthereumRaw(address) {
    try {
      const endpoint = this.getEndpoint();
      
      const response = await axios.post(endpoint, {
        jsonrpc: '2.0',
        method: 'eth_getBalance',
        params: [address, 'latest'],
        id: 1
      }, {
        timeout: 1500, // Aggressive timeout for maximum throughput
        headers: { 'Content-Type': 'application/json' }
      });

      this.requestCount++;
      
      if (response.data.error) {
        return { chain: 'Ethereum', balance: '0', hasBalance: false, address };
      }

      // Convert hex balance to decimal
      const balanceWei = BigInt(response.data.result);
      const hasBalance = balanceWei > 0n;
      const balanceEth = Number(balanceWei) / 1e18;
      
      return {
        chain: 'Ethereum',
        symbol: 'ETH',
        balance: balanceEth.toString(),
        hasBalance,
        address,
      };
    } catch (error) {
      return { chain: 'Ethereum', balance: '0', hasBalance: false, address };
    }
  }

  /**
   * Ultra fast mode: Ethereum only
   */
  async checkFast(wallet) {
    const result = await this.checkEthereumRaw(wallet.addresses.ethereum);
    return [result];
  }

  getStats() {
    return {
      totalRequests: this.requestCount,
      endpoints: this.endpoints.length,
      mode: 'RAW JSON-RPC - Maximum Speed',
    };
  }
}
