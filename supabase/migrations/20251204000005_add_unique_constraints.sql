-- Add unique constraints to prevent duplicate links
-- These tables were created in earlier migrations, so we need a separate migration

-- Unique constraint on account_organization_ids
CREATE UNIQUE INDEX IF NOT EXISTS account_organization_ids_unique 
    ON "public"."account_organization_ids" ("account_id", "organization_id");

-- Unique constraint on account_workspace_ids
CREATE UNIQUE INDEX IF NOT EXISTS account_workspace_ids_unique 
    ON "public"."account_workspace_ids" ("account_id", "workspace_id");

