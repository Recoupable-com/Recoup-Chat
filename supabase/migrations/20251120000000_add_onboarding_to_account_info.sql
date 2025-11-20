-- Add onboarding columns to account_info
ALTER TABLE "public"."account_info"
ADD COLUMN IF NOT EXISTS "job_title" text,
ADD COLUMN IF NOT EXISTS "role_type" text,
ADD COLUMN IF NOT EXISTS "company_name" text,
ADD COLUMN IF NOT EXISTS "onboarding_data" jsonb,
ADD COLUMN IF NOT EXISTS "onboarding_status" jsonb;

-- Set default for NEW users (they go through onboarding)
ALTER TABLE "public"."account_info"
ALTER COLUMN "onboarding_status" 
SET DEFAULT '{"step": "welcome", "completedActions": []}'::jsonb;

-- Note: Existing users will have NULL onboarding_status
-- You can manually set specific users to "completed" or "welcome" as needed

