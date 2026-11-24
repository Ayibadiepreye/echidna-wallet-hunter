import axios from 'axios';
import { WalletGenerator } from './src/generator.js';

const gen = new WalletGenerator();

async function testSmallBatch() {
  try {
    const batchSize = 100;
    console.log(`Generating ${batchSize} wallets...`);
    const addresses = [];
    for (let i = 0; i < batchSize; i++) {
      const wallet = gen.generateWallet();
      addresses.push(wallet.addresses.ethereum);
    }
    console.log(`Generated ${addresses.length} addresses`);
    
    console.log('\nSending batch request to PublicNode...');
    
    const batchRequest = addresses.map((address, index) => ({
      jsonrpc: '2.0',
      method: 'eth_getBalance',
      params: [address, 'latest'],
      id: index
    }));
    
    console.log(`Request payload size: ${JSON.stringify(batchRequest).length} bytes`);
    
    const start = Date.now();
    const response = await axios.post('https://ethereum.publicnode.com', batchRequest, {
      timeout: 15000,
      headers: { 'Content-Type': 'application/json' },
      maxBodyLength: Infinity,
      maxContentLength: Infinity
    });
    const elapsed = Date.now() - start;
    
    console.log(`✅ Got response in ${elapsed}ms`);
    console.log(`Results: ${response.data.length}`);
    console.log(`Speed: ${(batchSize / (elapsed / 1000)).toFixed(0)} addresses/sec`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Code:', error.code);
  }
}

testSmallBatch();
