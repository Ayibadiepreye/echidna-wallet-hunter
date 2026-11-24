import axios from 'axios';
import { WalletGenerator } from './src/generator.js';

const gen = new WalletGenerator();
const endpoint = 'https://rpcfree.com/ethereum-rpc';

async function testBatchSize(size) {
  try {
    console.log(`\n🧪 Testing batch size: ${size}`);
    
    // Generate addresses
    const addresses = [];
    for (let i = 0; i < size; i++) {
      const wallet = gen.generateWallet();
      addresses.push(wallet.addresses.ethereum);
    }
    
    // Build batch request
    const batchRequest = addresses.map((address, index) => ({
      jsonrpc: '2.0',
      method: 'eth_getBalance',
      params: [address, 'latest'],
      id: index
    }));
    
    console.log(`📦 Payload size: ${(JSON.stringify(batchRequest).length / 1024).toFixed(1)} KB`);
    
    const start = Date.now();
    const response = await axios.post(endpoint, batchRequest, {
      timeout: 30000,
      headers: { 'Content-Type': 'application/json' },
      maxBodyLength: Infinity,
      maxContentLength: Infinity
    });
    const elapsed = Date.now() - start;
    
    console.log(`📥 Response type:`, typeof response.data);
    console.log(`📥 Is array:`, Array.isArray(response.data));
    console.log(`📥 Sample:`, JSON.stringify(response.data).substring(0, 200));
    
    const results = Array.isArray(response.data) ? response.data : [response.data];
    const successCount = results.filter(r => r.result !== undefined).length;
    const errorCount = results.filter(r => r.error !== undefined).length;
    
    if (successCount === size) {
      console.log(`✅ SUCCESS! All ${size} responses received in ${elapsed}ms`);
      console.log(`⚡ Speed: ${(size / (elapsed / 1000)).toFixed(0)} addresses/sec`);
      return { success: true, size, elapsed, speed: (size / (elapsed / 1000)).toFixed(0) };
    } else {
      console.log(`⚠️  Partial: ${successCount} success, ${errorCount} errors`);
      return { success: false, size, successCount, errorCount };
    }
    
  } catch (error) {
    console.log(`❌ FAILED: ${error.code || error.message}`);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Data:`, error.response.data);
    }
    return { success: false, size, error: error.code || error.message };
  }
}

async function main() {
  console.log('🚀 Testing rpcfree.com batch size limits\n');
  console.log('='.repeat(60));
  
  const sizes = [10, 50, 100, 200, 500, 1000];
  const results = [];
  
  for (const size of sizes) {
    const result = await testBatchSize(size);
    results.push(result);
    
    if (!result.success) {
      console.log(`\n⛔ Stopped at ${size} (failed)`);
      break;
    }
    
    // Delay between tests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESULTS SUMMARY');
  console.log('='.repeat(60));
  
  const working = results.filter(r => r.success);
  if (working.length > 0) {
    console.log('\n✅ Working batch sizes:');
    working.forEach(r => {
      console.log(`   ${r.size.toString().padStart(5)} addresses - ${r.elapsed}ms (${r.speed}/sec)`);
    });
    
    const max = working[working.length - 1];
    console.log(`\n🏆 Maximum tested: ${max.size} addresses`);
    console.log(`⚡ Best speed: ${max.speed} addresses/sec`);
  }
  
  console.log('\n' + '='.repeat(60));
}

main();
