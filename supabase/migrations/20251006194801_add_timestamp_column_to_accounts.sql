-- Add timestamp column to accounts table (if not exists)
ALTER TABLE "public"."accounts" 
ADD COLUMN IF NOT EXISTS "timestamp" bigint DEFAULT extract(epoch from now());

-- Add comment for documentation
COMMENT ON COLUMN "public"."accounts"."timestamp" IS 'Unix timestamp of when the account was last updated';
