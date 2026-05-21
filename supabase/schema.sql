CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Pulizia tabelle esistenti (ordinate per dipendenza)
DROP VIEW IF EXISTS latest_crypto_prices CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS crypto_price_history CASCADE;
DROP TABLE IF EXISTS crypto_assets CASCADE;
DROP TABLE IF EXISTS wallets CASCADE;
DROP TABLE IF EXISTS auth_refresh_tokens CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- USERS
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(320) NOT NULL,
  email VARCHAR(320) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- AUTH REFRESH TOKENS
CREATE TABLE IF NOT EXISTS auth_refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  last_used_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_auth_refresh_tokens_user_id ON auth_refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_refresh_tokens_token_hash ON auth_refresh_tokens(token_hash);

-- WALLETS
CREATE TABLE IF NOT EXISTS wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label TEXT,
  chain TEXT,
  address TEXT NOT NULL,
  currency TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, address)
);

-- CRYPTO ASSETS
CREATE TABLE IF NOT EXISTS crypto_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT NOT NULL UNIQUE,
  name TEXT,
  coingecko_id TEXT,
  decimals INT DEFAULT 8,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- CRYPTO PRICE HISTORY
CREATE TABLE IF NOT EXISTS crypto_price_history (
  id BIGSERIAL PRIMARY KEY,
  asset_id UUID REFERENCES crypto_assets(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  symbol TEXT NOT NULL,
  price NUMERIC(38,18) NOT NULL,
  market_cap NUMERIC(38,2),
  volume_24h NUMERIC(38,2),
  percent_change_1h REAL,
  percent_change_24h REAL,
  percent_change_7d REAL,
  captured_at TIMESTAMPTZ NOT NULL,
  inserted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (asset_id, provider, symbol, captured_at)
);

-- Indici ottimizzati per le query temporali sui prezzi
CREATE INDEX IF NOT EXISTS idx_price_asset_captured ON crypto_price_history (asset_id, captured_at DESC);
CREATE INDEX IF NOT EXISTS idx_price_symbol_captured ON crypto_price_history (symbol, captured_at DESC);

-- TRANSACTIONS
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  asset_id UUID REFERENCES crypto_assets(id) ON DELETE SET NULL,
  tx_hash TEXT,
  type TEXT NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'trade')),
  amount NUMERIC(38,18) NOT NULL,
  fee NUMERIC(38,18) DEFAULT 0,
  price_at_execution NUMERIC(38,18),
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'failed')),
  blockchain_timestamp TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_transactions_wallet_time ON transactions (wallet_id, blockchain_timestamp DESC);

-- VIEW: Estrae l'ultimo prezzo caricato per ogni asset
CREATE OR REPLACE VIEW latest_crypto_prices AS
SELECT DISTINCT ON (asset_id)
  asset_id,
  symbol,
  price,
  captured_at
FROM crypto_price_history
ORDER BY asset_id, captured_at DESC;

-- INSTRUMENTS (anagrafica titoli: azioni, ETF, crypto, forex)
CREATE TABLE IF NOT EXISTS instruments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT NOT NULL UNIQUE,
  name TEXT,
  exchange TEXT,
  sector TEXT,
  currency TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_instruments_symbol ON instruments(symbol);

-- PRICE CACHE (cache prezzi storici per simbolo)
CREATE TABLE IF NOT EXISTS price_cache (
  id BIGSERIAL PRIMARY KEY,
  symbol TEXT NOT NULL,
  price NUMERIC(38,18) NOT NULL,
  price_date TIMESTAMPTZ NOT NULL,
  provider TEXT,
  metadata JSONB,
  inserted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_price_cache_symbol_date ON price_cache(symbol, price_date DESC);

-- WATCHLISTS (titoli salvati dagli utenti)
CREATE TABLE IF NOT EXISTS watchlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  symbol TEXT NOT NULL,
  added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB,
  UNIQUE (user_id, symbol)
);

CREATE INDEX IF NOT EXISTS idx_watchlists_user ON watchlists(user_id);
CREATE INDEX IF NOT EXISTS idx_watchlists_symbol ON watchlists(symbol);