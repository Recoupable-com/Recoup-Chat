-- Create account_organization_ids table
-- Links user/customer accounts to organization accounts
-- Similar structure to account_artist_ids (without pinned column)
-- Made idempotent: safe to run even if table already exists

CREATE TABLE IF NOT EXISTS "public"."account_organization_ids" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "account_id" uuid,
    "organization_id" uuid,
    "updated_at" timestamp with time zone DEFAULT now()
);

-- Enable row level security (idempotent by default)
ALTER TABLE "public"."account_organization_ids" ENABLE ROW LEVEL SECURITY;

-- Primary key (only if not exists)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'account_organization_ids_pkey') THEN
        CREATE UNIQUE INDEX account_organization_ids_pkey ON public.account_organization_ids USING btree (id);
        ALTER TABLE "public"."account_organization_ids" ADD CONSTRAINT "account_organization_ids_pkey" PRIMARY KEY USING INDEX "account_organization_ids_pkey";
    END IF;
END $$;

-- Foreign keys with cascade delete (only if not exists)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'account_organization_ids_account_id_fkey') THEN
        ALTER TABLE "public"."account_organization_ids" ADD CONSTRAINT "account_organization_ids_account_id_fkey" 
            FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE NOT VALID;
        ALTER TABLE "public"."account_organization_ids" VALIDATE CONSTRAINT "account_organization_ids_account_id_fkey";
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'account_organization_ids_organization_id_fkey') THEN
        ALTER TABLE "public"."account_organization_ids" ADD CONSTRAINT "account_organization_ids_organization_id_fkey" 
            FOREIGN KEY (organization_id) REFERENCES accounts(id) ON DELETE CASCADE NOT VALID;
        ALTER TABLE "public"."account_organization_ids" VALIDATE CONSTRAINT "account_organization_ids_organization_id_fkey";
    END IF;
END $$;

-- Updated_at trigger (only if not exists)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at' AND tgrelid = 'account_organization_ids'::regclass) THEN
        CREATE TRIGGER set_updated_at
            BEFORE UPDATE ON account_organization_ids
            FOR EACH ROW
            EXECUTE FUNCTION trigger_set_updated_at();
    END IF;
END $$;

-- Indexes for faster lookups (IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_account_organization_ids_account_id ON "public"."account_organization_ids" ("account_id");
CREATE INDEX IF NOT EXISTS idx_account_organization_ids_organization_id ON "public"."account_organization_ids" ("organization_id");

-- Comment for documentation (idempotent by default)
COMMENT ON TABLE "public"."account_organization_ids" IS 'Links customer accounts to organization accounts. When either account is deleted, the link is automatically removed.';
