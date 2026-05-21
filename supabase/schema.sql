-- Schema SQL per Progetto GPOI: tabelle principali e indici
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- USERS
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(320) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

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

-- TRANSACTIONS
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  asset_id UUID REFERENCES crypto_assets(id),
  tx_hash TEXT,
  type TEXT NOT NULL CHECK (type IN ('deposit','withdrawal','trade')),
  amount NUMERIC(36,18) NOT NULL,
  fee NUMERIC(36,18) DEFAULT 0,
  price_at_execution NUMERIC(36,18),
  status TEXT NOT NULL CHECK (status IN ('pending','confirmed','failed')),
  blockchain_timestamp TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_transactions_wallet_time ON transactions (wallet_id, blockchain_timestamp DESC);

-- CRYPTO PRICE HISTORY (time-series)
CREATE TABLE IF NOT EXISTS crypto_price_history (
  id BIGSERIAL PRIMARY KEY,
  asset_id UUID REFERENCES crypto_assets(id),
  provider TEXT NOT NULL,
  symbol TEXT NOT NULL,
  price NUMERIC(36,18) NOT NULL,
  market_cap NUMERIC(36,2),
  volume_24h NUMERIC(36,2),
  percent_change_1h REAL,
  percent_change_24h REAL,
  percent_change_7d REAL,
  captured_at TIMESTAMPTZ NOT NULL,
  inserted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (asset_id, provider, symbol, captured_at)
);

CREATE INDEX IF NOT EXISTS idx_price_asset_captured ON crypto_price_history (asset_id, captured_at DESC);
CREATE INDEX IF NOT EXISTS idx_price_symbol_captured ON crypto_price_history (symbol, captured_at DESC);

-- NOTE: Per dataset grandi valutare TimescaleDB o partitioning su captured_at (monthly/quarterly)
-- Supabase schema per autenticazione custom e token refresh

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  full_name text not null,
  password_hash text not null,
  role text not null default 'user',
  is_active boolean not null default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists auth_refresh_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  token_hash text not null,
  expires_at timestamp with time zone not null,
  revoked boolean not null default false,
  created_at timestamp with time zone default now(),
  last_used_at timestamp with time zone
);

create index if not exists idx_auth_refresh_tokens_user_id on auth_refresh_tokens(user_id);
create index if not exists idx_auth_refresh_tokens_token_hash on auth_refresh_tokens(token_hash);

create table if not exists password_reset_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  token_hash text not null,
  expires_at timestamp with time zone not null,
  used boolean not null default false,
  created_at timestamp with time zone default now()
);

create index if not exists idx_password_reset_tokens_user_id on password_reset_tokens(user_id);
create index if not exists idx_password_reset_tokens_token_hash on password_reset_tokens(token_hash);

-- VIEWS
CREATE OR REPLACE VIEW latest_crypto_prices AS
SELECT DISTINCT ON (symbol)
  symbol,
  price,
  percent_change_24h,
  captured_at
FROM crypto_price_history
ORDER BY symbol, captured_at DESC;
