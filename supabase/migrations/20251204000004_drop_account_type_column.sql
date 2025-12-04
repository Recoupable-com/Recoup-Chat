-- Drop account_type column from accounts table
-- We now use join tables to determine account type:
--   - account_artist_ids: links owner accounts to their artists
--   - account_workspace_ids: links owner accounts to their workspaces
--   - account_organization_ids: links accounts to their organizations
--   - artist_organization_ids: links artists to organizations

-- Drop the index first
DROP INDEX IF EXISTS idx_accounts_account_type;

-- Drop the column
ALTER TABLE "public"."accounts" DROP COLUMN IF EXISTS "account_type";

