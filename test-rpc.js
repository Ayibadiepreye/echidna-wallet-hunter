import axios from 'axios';

async function testRPC() {
  try {
    console.log('Testing PublicNode RPC with valid address...');
    
    const response = await axios.post('https://ethereum.publicnode.com', [{
      jsonrpc: '2.0',
      method: 'eth_getBalance',
      params: ['0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', 'latest'], // Vitalik's address
      id: 0
    }], {
      timeout: 5000,
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log('✅ RPC Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('❌ RPC Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testRPC();
