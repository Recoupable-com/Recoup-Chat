-- Add onboarding columns to account_info
ALTER TABLE "public"."account_info"
ADD COLUMN IF NOT EXISTS "job_title" text,
ADD COLUMN IF NOT EXISTS "role_type" text,
ADD COLUMN IF NOT EXISTS "company_name" text,
ADD COLUMN IF NOT EXISTS "onboarding_data" jsonb,
ADD COLUMN IF NOT EXISTS "onboarding_status" jsonb;

-- Backfill existing users as "completed" (they skip onboarding)
UPDATE "public"."account_info"
SET "onboarding_status" = '{"step": "completed", "completedActions": []}'::jsonb
WHERE "onboarding_status" IS NULL;

-- Set default for NEW users (they go through onboarding)
ALTER TABLE "public"."account_info"
ALTER COLUMN "onboarding_status" 
SET DEFAULT '{"step": "welcome", "completedActions": []}'::jsonb;

