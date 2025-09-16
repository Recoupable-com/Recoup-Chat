-- Add unique constraint to email field in account_emails table
-- This migration enforces that each email can only be associated with one account

-- First, remove any duplicate email entries if they exist
-- Keep the oldest entry for each duplicate email
WITH duplicates AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (
      PARTITION BY email 
      ORDER BY updated_at ASC
    ) as rn
  FROM account_emails 
  WHERE email IS NOT NULL
)
DELETE FROM account_emails 
WHERE id IN (
  SELECT id 
  FROM duplicates 
  WHERE rn > 1
);

-- Add unique constraint on email field
-- This will prevent duplicate emails from being inserted in the future
ALTER TABLE "public"."account_emails" 
ADD CONSTRAINT "account_emails_email_unique" 
UNIQUE ("email");

-- Add index for better performance on email lookups
CREATE INDEX IF NOT EXISTS "account_emails_email_idx" 
ON "public"."account_emails" USING btree ("email");
