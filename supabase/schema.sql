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
