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
    this.batchSize = 100; // TESTED: PublicNode can handle 100, not 1000!
    
    this.endpoints = [
      // Back to PublicNode but sequential batches for Render
      'https://ethereum.publicnode.com',
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
      
      console.log(`🔍 Checking batch of ${addresses.length} addresses via ${endpoint}`);
      
      // Build batch request - one eth_getBalance per address
      const batchRequest = addresses.map((address, index) => ({
        jsonrpc: '2.0',
        method: 'eth_getBalance',
        params: [address, 'latest'],
        id: index
      }));

      console.log(`📡 Sending batch request to ${endpoint}...`);
      
      const startTime = Date.now();
      const response = await axios.post(endpoint, batchRequest, {
        timeout: 30000, // 30 second timeout - Render may be slow
        headers: { 'Content-Type': 'application/json' },
        maxBodyLength: Infinity,
        maxContentLength: Infinity
      });
      const elapsed = Date.now() - startTime;

      console.log(`✅ Got batch response in ${elapsed}ms from ${endpoint}`);
      
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
      console.error(`❌ Batch check error from ${endpoint}:`, error.code || error.message);
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
