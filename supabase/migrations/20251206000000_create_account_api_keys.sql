-- Create account_api_keys table
-- Stores API keys associated with accounts

CREATE TABLE public.account_api_keys (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  account uuid NULL,
  key_hash text NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  last_used timestamp without time zone NULL,
  CONSTRAINT account_api_keys_pkey PRIMARY KEY (id),
  CONSTRAINT account_api_keys_account_fkey FOREIGN KEY (account) 
    REFERENCES accounts(id) ON UPDATE CASCADE ON DELETE CASCADE
) TABLESPACE pg_default;

-- Enable Row Level Security
ALTER TABLE public.account_api_keys ENABLE ROW LEVEL SECURITY;

-- Create index on account for faster lookups
CREATE INDEX IF NOT EXISTS account_api_keys_account_idx 
  ON public.account_api_keys(account);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.account_api_keys TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.account_api_keys TO service_role;

