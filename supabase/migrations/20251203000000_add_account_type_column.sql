-- Add account_type column to accounts table
-- Types: 'customer', 'artist', 'workspace', (future: 'organization', 'campaign')
-- No default value - must be explicitly set when creating accounts

ALTER TABLE "public"."accounts" ADD COLUMN "account_type" TEXT;

-- Add index for faster filtering by account type
CREATE INDEX idx_accounts_account_type ON "public"."accounts" ("account_type");

-- Optional: Add comment for documentation
COMMENT ON COLUMN "public"."accounts"."account_type" IS 'Type of account: customer, artist, workspace, organization, campaign';

