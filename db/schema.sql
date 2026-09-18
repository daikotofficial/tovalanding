CREATE TABLE IF NOT EXISTS affiliates (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  location TEXT,
  channel TEXT,
  code TEXT NOT NULL UNIQUE,
  verification_code TEXT NOT NULL DEFAULT '',
  verified INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL,
  earnings BIGINT NOT NULL DEFAULT 0,
  password_hash TEXT,
  password_salt TEXT,
  failed_login_attempts INTEGER NOT NULL DEFAULT 0,
  locked_until BIGINT NOT NULL DEFAULT 0,
  password_updated_at TIMESTAMPTZ,
  payout_method TEXT NOT NULL DEFAULT 'bank_transfer',
  payout_account_name TEXT NOT NULL DEFAULT '',
  payout_account_number TEXT NOT NULL DEFAULT '',
  payout_bank_name TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS auth_challenges (
  email TEXT PRIMARY KEY,
  code_hash TEXT NOT NULL,
  expires BIGINT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  affiliate_id BIGINT NOT NULL REFERENCES affiliates(id),
  expires BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS superadmin_sessions (
  token_hash TEXT PRIMARY KEY,
  email TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'superadmin',
  expires BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS admin_users (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGSERIAL PRIMARY KEY,
  actor_email TEXT NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL,
  expires BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS referrals (
  id BIGSERIAL PRIMARY KEY,
  affiliate_id BIGINT NOT NULL REFERENCES affiliates(id),
  product TEXT NOT NULL,
  external_id TEXT NOT NULL,
  referred_name TEXT,
  referred_company TEXT,
  referred_email TEXT,
  source TEXT NOT NULL DEFAULT 'link',
  status TEXT NOT NULL DEFAULT 'registered',
  signed_up_at TIMESTAMPTZ,
  converted_at TIMESTAMPTZ,
  subscription_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL,
  UNIQUE(product, external_id)
);

CREATE TABLE IF NOT EXISTS commissions (
  id BIGSERIAL PRIMARY KEY,
  affiliate_id BIGINT NOT NULL REFERENCES affiliates(id),
  referral_id BIGINT NOT NULL REFERENCES referrals(id),
  amount BIGINT NOT NULL CHECK (amount > 0),
  rate INTEGER NOT NULL DEFAULT 20,
  currency TEXT NOT NULL DEFAULT 'NGN',
  payment_reference TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL,
  UNIQUE (referral_id, payment_reference)
);

CREATE TABLE IF NOT EXISTS payouts (
  id BIGSERIAL PRIMARY KEY,
  affiliate_id BIGINT NOT NULL REFERENCES affiliates(id),
  amount BIGINT NOT NULL CHECK (amount > 0),
  status TEXT NOT NULL DEFAULT 'requested',
  created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS payout_commissions (
  payout_id BIGINT NOT NULL REFERENCES payouts(id),
  commission_id BIGINT NOT NULL REFERENCES commissions(id),
  PRIMARY KEY (payout_id, commission_id),
  UNIQUE (commission_id)
);
