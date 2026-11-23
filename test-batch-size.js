/**
 * Test RPC Batch Size Limits
 * Finds the maximum batch size each endpoint supports
 */

import axios from 'axios';
import { WalletGenerator } from './src/generator.js';

const generator = new WalletGenerator();

const endpoints = [
  { name: 'Ankr', url: 'https://rpc.ankr.com/eth' },
  { name: 'LlamaRPC', url: 'https://eth.llamarpc.com' },
  { name: 'PublicNode', url: 'https://ethereum.publicnode.com' },
  { name: '1RPC', url: 'https://1rpc.io/eth' },
  { name: 'Cloudflare', url: 'https://cloudflare-eth.com' },
  { name: 'BlastAPI', url: 'https://eth-mainnet.public.blastapi.io' },
];

// Add Alchemy if available
if (process.env.ALCHEMY_API_KEY) {
  endpoints.push({
    name: 'Alchemy-1',
    url: `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
  });
}
if (process.env.ALCHEMY_API_KEY_2) {
  endpoints.push({
    name: 'Alchemy-2',
    url: `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY_2}`
  });
}

async function testBatchSize(endpoint, batchSize) {
  try {
    console.log(`  Testing ${batchSize.toLocaleString()} addresses...`);
    
    // Generate test addresses
    const addresses = [];
    for (let i = 0; i < batchSize; i++) {
      const wallet = generator.generateWallet();
      addresses.push(wallet.addresses.ethereum);
    }
    
    // Build batch request
    const batchRequest = addresses.map((address, index) => ({
      jsonrpc: '2.0',
      method: 'eth_getBalance',
      params: [address, 'latest'],
      id: index
    }));
    
    const startTime = Date.now();
    
    const response = await axios.post(endpoint.url, batchRequest, {
      timeout: 60000, // 60 second timeout
      headers: { 'Content-Type': 'application/json' },
      maxBodyLength: Infinity,
      maxContentLength: Infinity
    });
    
    const elapsed = Date.now() - startTime;
    const walletsPerSec = (batchSize / (elapsed / 1000)).toFixed(0);
    
    // Check if response is valid
    const results = Array.isArray(response.data) ? response.data : [response.data];
    const successCount = results.filter(r => r.result !== undefined).length;
    
    if (successCount === batchSize) {
      console.log(`  ✅ SUCCESS! ${elapsed}ms (${walletsPerSec} wallets/sec)\n`);
      return { success: true, elapsed, walletsPerSec };
    } else {
      console.log(`  ⚠️  Partial success: ${successCount}/${batchSize} responses\n`);
      return { success: false, partial: true };
    }
    
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      console.log(`  ❌ TIMEOUT (>60s)\n`);
    } else if (error.response?.status === 413) {
      console.log(`  ❌ Payload too large (HTTP 413)\n`);
    } else if (error.response?.status === 429) {
      console.log(`  ❌ Rate limited (HTTP 429)\n`);
    } else {
      console.log(`  ❌ Error: ${error.message}\n`);
    }
    return { success: false, error: error.message };
  }
}

async function findMaxBatchSize(endpoint) {
  console.log(`\n🔍 Testing ${endpoint.name} (${endpoint.url})`);
  console.log('='.repeat(70));
  
  const sizes = [100, 500, 1000, 2000, 5000, 10000, 20000];
  let maxWorking = 0;
  let bestSpeed = 0;
  
  for (const size of sizes) {
    const result = await testBatchSize(endpoint, size);
    
    if (result.success) {
      maxWorking = size;
      bestSpeed = result.walletsPerSec;
    } else {
      // Stop testing larger sizes if this one failed
      break;
    }
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  return { endpoint: endpoint.name, maxBatch: maxWorking, speed: bestSpeed };
}

async function main() {
  console.log('\n🚀 ECHIDNA BATCH SIZE TEST');
  console.log('Finding optimal batch size for each RPC endpoint...\n');
  
  const results = [];
  
  for (const endpoint of endpoints) {
    const result = await findMaxBatchSize(endpoint);
    results.push(result);
    
    // Longer delay between endpoints
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('📊 RESULTS SUMMARY');
  console.log('='.repeat(70));
  
  results.sort((a, b) => b.maxBatch - a.maxBatch);
  
  for (const result of results) {
    if (result.maxBatch > 0) {
      console.log(`✅ ${result.endpoint.padEnd(20)} | Max: ${result.maxBatch.toLocaleString().padStart(7)} | Speed: ${result.speed.toLocaleString().padStart(6)}/sec`);
    } else {
      console.log(`❌ ${result.endpoint.padEnd(20)} | FAILED`);
    }
  }
  
  const best = results.filter(r => r.maxBatch > 0).sort((a, b) => b.speed - a.speed)[0];
  const recommended = Math.max(...results.map(r => r.maxBatch));
  
  console.log('\n' + '='.repeat(70));
  console.log(`🏆 RECOMMENDED BATCH SIZE: ${recommended.toLocaleString()}`);
  if (best) {
    console.log(`⚡ FASTEST ENDPOINT: ${best.endpoint} (${best.speed.toLocaleString()}/sec)`);
    
    const dailyRate = (best.speed * 60 * 60 * 24).toLocaleString();
    console.log(`📈 PROJECTED DAILY RATE: ${dailyRate} wallets/day`);
  }
  console.log('='.repeat(70) + '\n');
}

main().catch(console.error);
