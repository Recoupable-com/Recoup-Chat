-- Add onboarding columns to account_info
ALTER TABLE "public"."account_info"
ADD COLUMN IF NOT EXISTS "job_title" text,
ADD COLUMN IF NOT EXISTS "role_type" text,
ADD COLUMN IF NOT EXISTS "company_name" text,
ADD COLUMN IF NOT EXISTS "onboarding_data" jsonb,
ADD COLUMN IF NOT EXISTS "onboarding_status" jsonb;

