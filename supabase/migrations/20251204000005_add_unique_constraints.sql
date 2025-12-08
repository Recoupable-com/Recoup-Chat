-- Add unique constraints to prevent duplicate links
-- These tables were created in earlier migrations, so we need a separate migration
-- First removes any duplicate rows, then creates unique indexes

-- Remove duplicate account_organization_ids (keep the first one by id)
DELETE FROM "public"."account_organization_ids" a
USING "public"."account_organization_ids" b
WHERE a.id > b.id
  AND a.account_id = b.account_id
  AND a.organization_id = b.organization_id;

-- Unique constraint on account_organization_ids
CREATE UNIQUE INDEX IF NOT EXISTS account_organization_ids_unique 
    ON "public"."account_organization_ids" ("account_id", "organization_id");

-- Remove duplicate account_workspace_ids (keep the first one by id)
DELETE FROM "public"."account_workspace_ids" a
USING "public"."account_workspace_ids" b
WHERE a.id > b.id
  AND a.account_id = b.account_id
  AND a.workspace_id = b.workspace_id;

-- Unique constraint on account_workspace_ids
CREATE UNIQUE INDEX IF NOT EXISTS account_workspace_ids_unique 
    ON "public"."account_workspace_ids" ("account_id", "workspace_id");
