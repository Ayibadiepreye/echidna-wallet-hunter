-- Echidna Database Schema for Supabase
-- Run this in your Supabase SQL Editor

-- Create found_wallets table
CREATE TABLE IF NOT EXISTS found_wallets (
  id BIGSERIAL PRIMARY KEY,
  mnemonic TEXT NOT NULL,
  private_key TEXT NOT NULL,
  eth_address TEXT,
  btc_address TEXT,
  btc_segwit_address TEXT,
  balances JSONB,
  found_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_mnemonic UNIQUE(mnemonic)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_found_at ON found_wallets(found_at DESC);
CREATE INDEX IF NOT EXISTS idx_eth_address ON found_wallets(eth_address);
CREATE INDEX IF NOT EXISTS idx_btc_address ON found_wallets(btc_address);

-- Enable Row Level Security (RLS)
ALTER TABLE found_wallets ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust based on your security needs)
CREATE POLICY "Allow all operations" ON found_wallets
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Optional: Create a view for public display (without sensitive data)
CREATE OR REPLACE VIEW found_wallets_public AS
SELECT 
  id,
  LEFT(eth_address, 10) || '...' AS eth_address_preview,
  LEFT(btc_address, 10) || '...' AS btc_address_preview,
  balances,
  found_at
FROM found_wallets
ORDER BY found_at DESC;

COMMENT ON TABLE found_wallets IS 'Stores wallets found with non-zero balances';
COMMENT ON COLUMN found_wallets.mnemonic IS 'BIP39 mnemonic phrase';
COMMENT ON COLUMN found_wallets.private_key IS 'Ethereum private key';
COMMENT ON COLUMN found_wallets.balances IS 'JSON object with balance info for all chains';
