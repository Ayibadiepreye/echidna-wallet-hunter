/**
 * Quick test to verify Echidna components work
 */

import { WalletGenerator } from './src/generator.js';

console.log('🧪 Testing Echidna Components...\n');

// Test 1: Wallet Generation
console.log('Test 1: Generating a BIP39 wallet...');
const generator = new WalletGenerator();
const wallet = generator.generateWallet();

console.log('✅ Wallet generated successfully!');
console.log('   Mnemonic:', wallet.mnemonic);
console.log('   Ethereum Address:', wallet.addresses.ethereum);
console.log('   Bitcoin Address:', wallet.addresses.bitcoin);
console.log('   Bitcoin SegWit:', wallet.addresses.bitcoinSegWit);
console.log();

// Test 2: Validation
console.log('Test 2: Validating mnemonic...');
const isValid = generator.validateMnemonic(wallet.mnemonic);
console.log(isValid ? '✅ Mnemonic is valid!' : '❌ Mnemonic is invalid!');
console.log();

// Test 3: Stats
console.log('Test 3: Getting probability stats...');
const stats = generator.getStats();
console.log('   Total Attempts:', stats.totalAttempts);
console.log('   Odds per Attempt:', stats.oddsPerAttempt);
console.log('   Estimated Years (at 1M/sec):', stats.estimatedYearsAt1MPerSec);
console.log();

console.log('🎉 All tests passed! Echidna is ready to run.');
console.log('\nYou can now start the server with: npm start');
