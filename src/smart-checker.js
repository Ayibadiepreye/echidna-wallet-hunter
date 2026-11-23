/**
 * Echidna - BATCH Checker
 * Uses JSON-RPC batch requests to check 100+ wallets in ONE request!
 * This is 100x faster than individual calls!
 */

import axios from 'axios';

export class SmartChecker {
  constructor() {
    this.requestCount = 0;
    this.endpointIndex = 0;
    this.batchSize = 500; // Check 500 wallets per batch!
    
    this.endpoints = [
      // Ankr free endpoints (no auth required)
      'https://rpc.ankr.com/eth',
      
      // Other major free endpoints
      'https://eth.llamarpc.com',
      'https://ethereum.publicnode.com',
      'https://1rpc.io/eth',
      'https://cloudflare-eth.com',
      'https://eth-mainnet.public.blastapi.io',
      'https://eth.merkle.io',
      'https://eth.meowrpc.com',
      'https://singapore.rpc.blxrbdn.com',
    ];
    
    if (process.env.ALCHEMY_API_KEY) {
      this.endpoints.push(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`);
    }
    if (process.env.ALCHEMY_API_KEY_2) {
      this.endpoints.push(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY_2}`);
    }
    
    console.log(`🚀 BATCH Checker with ${this.endpoints.length} endpoints - ${this.batchSize} wallets/request`);
  }

  getEndpoint() {
    const endpoint = this.endpoints[this.endpointIndex % this.endpoints.length];
    this.endpointIndex++;
    return endpoint;
  }

  /**
   * BATCH CHECK: Check multiple addresses in ONE request!
   * This is the breakthrough - 500 wallets in one HTTP call!
   */
  async checkBatch(addresses) {
    try {
      const endpoint = this.getEndpoint();
      
      // Build batch request - one eth_getBalance per address
      const batchRequest = addresses.map((address, index) => ({
        jsonrpc: '2.0',
        method: 'eth_getBalance',
        params: [address, 'latest'],
        id: index
      }));

      const response = await axios.post(endpoint, batchRequest, {
        timeout: 5000, // Longer timeout for batch
        headers: { 'Content-Type': 'application/json' }
      });

      this.requestCount++;
      
      // Parse batch response
      const results = Array.isArray(response.data) ? response.data : [response.data];
      
      return results.map((item, index) => {
        if (item.error || !item.result) {
          return { 
            chain: 'Ethereum', 
            balance: '0', 
            hasBalance: false, 
            address: addresses[index] 
          };
        }

        const balanceWei = BigInt(item.result);
        const hasBalance = balanceWei > 0n;
        const balanceEth = Number(balanceWei) / 1e18;
        
        return {
          chain: 'Ethereum',
          symbol: 'ETH',
          balance: balanceEth.toString(),
          hasBalance,
          address: addresses[index],
        };
      });
    } catch (error) {
      // On error, return all as zero balance
      return addresses.map(address => ({
        chain: 'Ethereum',
        balance: '0',
        hasBalance: false,
        address,
        error: true
      }));
    }
  }

  /**
   * Check single wallet (wraps batch for compatibility)
   */
  async checkFast(wallet) {
    const address = wallet.addresses.ethereum;
    const results = await this.checkBatch([address]);
    return results;
  }

  getStats() {
    return {
      totalRequests: this.requestCount,
      batchSize: this.batchSize,
      endpoints: this.endpoints.length,
      mode: 'BATCH MODE - 100x Speed Boost',
    };
  }
}
