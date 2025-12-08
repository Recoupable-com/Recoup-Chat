-- Create account_workspace_ids table
-- Links owner accounts to workspace accounts
-- Similar structure to account_artist_ids (without pinned column)
-- Used to identify which accounts are workspaces (vs artists)
-- Made idempotent: safe to run even if table already exists

CREATE TABLE IF NOT EXISTS "public"."account_workspace_ids" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "account_id" uuid,
    "workspace_id" uuid,
    "updated_at" timestamp with time zone DEFAULT now()
);

-- Enable row level security (idempotent by default)
ALTER TABLE "public"."account_workspace_ids" ENABLE ROW LEVEL SECURITY;

-- Primary key (only if not exists)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'account_workspace_ids_pkey') THEN
        CREATE UNIQUE INDEX account_workspace_ids_pkey ON public.account_workspace_ids USING btree (id);
        ALTER TABLE "public"."account_workspace_ids" ADD CONSTRAINT "account_workspace_ids_pkey" PRIMARY KEY USING INDEX "account_workspace_ids_pkey";
    END IF;
END $$;

-- Foreign keys with cascade delete
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'account_workspace_ids_account_id_fkey') THEN
        ALTER TABLE "public"."account_workspace_ids" ADD CONSTRAINT "account_workspace_ids_account_id_fkey" 
            FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE NOT VALID;
        ALTER TABLE "public"."account_workspace_ids" VALIDATE CONSTRAINT "account_workspace_ids_account_id_fkey";
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'account_workspace_ids_workspace_id_fkey') THEN
        ALTER TABLE "public"."account_workspace_ids" ADD CONSTRAINT "account_workspace_ids_workspace_id_fkey" 
            FOREIGN KEY (workspace_id) REFERENCES accounts(id) ON DELETE CASCADE NOT VALID;
        ALTER TABLE "public"."account_workspace_ids" VALIDATE CONSTRAINT "account_workspace_ids_workspace_id_fkey";
    END IF;
END $$;

-- Updated_at trigger (only if not exists)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at' AND tgrelid = 'account_workspace_ids'::regclass) THEN
        CREATE TRIGGER set_updated_at
            BEFORE UPDATE ON account_workspace_ids
            FOR EACH ROW
            EXECUTE FUNCTION trigger_set_updated_at();
    END IF;
END $$;

-- Indexes for faster lookups (IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_account_workspace_ids_account_id ON "public"."account_workspace_ids" ("account_id");
CREATE INDEX IF NOT EXISTS idx_account_workspace_ids_workspace_id ON "public"."account_workspace_ids" ("workspace_id");

-- Comment for documentation (idempotent by default)
COMMENT ON TABLE "public"."account_workspace_ids" IS 'Links owner accounts to workspace accounts. When either account is deleted, the link is automatically removed. Used to identify workspaces (vs artists) without relying on account_type column.';
