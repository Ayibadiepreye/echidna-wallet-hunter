/**
 * Echidna - Wallet Generator
 * BIP39 Mnemonic and Key Derivation
 */

import * as bip39 from 'bip39';
import { ethers } from 'ethers';
import * as bitcoin from 'bitcoinjs-lib';
import * as ecc from 'tiny-secp256k1';
import { BIP32Factory } from 'bip32';
import { config } from './config.js';

const bip32 = BIP32Factory(ecc);

export class WalletGenerator {
  constructor() {
    this.attempts = 0;
  }

  /**
   * Generate a random BIP39 mnemonic phrase
   * @returns {string} 12 or 24 word mnemonic
   */
  generateMnemonic() {
    // This is cryptographically secure random generation
    return bip39.generateMnemonic(config.mnemonicStrength);
  }

  /**
   * Validate if a mnemonic is valid BIP39
   * @param {string} mnemonic 
   * @returns {boolean}
   */
  validateMnemonic(mnemonic) {
    return bip39.validateMnemonic(mnemonic);
  }

  /**
   * Derive Ethereum address from mnemonic
   * @param {string} mnemonic 
   * @returns {string} Ethereum address
   */
  deriveEthereumAddress(mnemonic) {
    // BIP44 path for Ethereum: m/44'/60'/0'/0/0
    const hdNode = ethers.HDNodeWallet.fromPhrase(mnemonic);
    return hdNode.address;
  }

  /**
   * Derive Bitcoin address from mnemonic
   * @param {string} mnemonic 
   * @returns {string} Bitcoin address (Legacy P2PKH)
   */
  deriveBitcoinAddress(mnemonic) {
    // Convert mnemonic to seed
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    
    // Create HD node from seed
    const root = bip32.fromSeed(seed);
    
    // BIP44 path for Bitcoin: m/44'/0'/0'/0/0
    const child = root.derivePath("m/44'/0'/0'/0/0");
    
    // Generate P2PKH (Legacy) address
    const { address } = bitcoin.payments.p2pkh({
      pubkey: child.publicKey,
      network: bitcoin.networks.bitcoin
    });
    
    return address;
  }

  /**
   * Derive Bitcoin SegWit (P2WPKH) address
   * @param {string} mnemonic 
   * @returns {string} Bitcoin SegWit address
   */
  deriveBitcoinSegWitAddress(mnemonic) {
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const root = bip32.fromSeed(seed);
    
    // BIP84 path for SegWit: m/84'/0'/0'/0/0
    const child = root.derivePath("m/84'/0'/0'/0/0");
    
    const { address } = bitcoin.payments.p2wpkh({
      pubkey: child.publicKey,
      network: bitcoin.networks.bitcoin
    });
    
    return address;
  }

  /**
   * Get private key from mnemonic (for Ethereum)
   * @param {string} mnemonic 
   * @returns {string} Private key
   */
  getPrivateKey(mnemonic) {
    const hdNode = ethers.HDNodeWallet.fromPhrase(mnemonic);
    return hdNode.privateKey;
  }

  /**
   * Generate a complete wallet with all addresses
   * @returns {Object} Wallet object
   */
  generateWallet() {
    this.attempts++;
    
    const mnemonic = this.generateMnemonic();
    
    return {
      id: this.attempts,
      mnemonic,
      timestamp: new Date().toISOString(),
      addresses: {
        ethereum: this.deriveEthereumAddress(mnemonic),
        bitcoin: this.deriveBitcoinAddress(mnemonic),
        bitcoinSegWit: this.deriveBitcoinSegWitAddress(mnemonic),
      },
      privateKey: this.getPrivateKey(mnemonic),
    };
  }

  /**
   * Generate from existing mnemonic or private key
   * @param {string} input - mnemonic or private key
   * @returns {Object|null} Wallet object or null if invalid
   */
  fromExisting(input) {
    try {
      // Check if it's a valid mnemonic
      if (this.validateMnemonic(input)) {
        return {
          mnemonic: input,
          addresses: {
            ethereum: this.deriveEthereumAddress(input),
            bitcoin: this.deriveBitcoinAddress(input),
            bitcoinSegWit: this.deriveBitcoinSegWitAddress(input),
          },
          privateKey: this.getPrivateKey(input),
        };
      }
      
      // Check if it's a private key (for Ethereum)
      if (input.startsWith('0x') && input.length === 66) {
        const wallet = new ethers.Wallet(input);
        return {
          mnemonic: null,
          addresses: {
            ethereum: wallet.address,
            bitcoin: null, // Can't derive Bitcoin from ETH private key
            bitcoinSegWit: null,
          },
          privateKey: input,
        };
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get current statistics
   */
  getStats() {
    const odds = config.PROBABILITY_12_WORDS / config.ESTIMATED_ACTIVE_WALLETS;
    
    return {
      totalAttempts: this.attempts,
      oddsPerAttempt: `1 in ${odds.toExponential(2)}`,
      probabilityOfSuccess: (this.attempts / odds * 100).toExponential(2) + '%',
      estimatedYearsAt1MPerSec: (odds / (1_000_000 * 60 * 60 * 24 * 365)).toExponential(2),
    };
  }
}
