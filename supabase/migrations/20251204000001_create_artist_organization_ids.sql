-- Create artist_organization_ids table
-- Links artists to organizations (many-to-many: an artist can belong to multiple orgs)
-- Made idempotent: safe to run even if table already exists

CREATE TABLE IF NOT EXISTS "public"."artist_organization_ids" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "artist_id" uuid NOT NULL,
    "organization_id" uuid NOT NULL,
    "created_at" timestamp with time zone DEFAULT now(),
    "updated_at" timestamp with time zone DEFAULT now()
);

-- Enable row level security (idempotent by default)
ALTER TABLE "public"."artist_organization_ids" ENABLE ROW LEVEL SECURITY;

-- Primary key (only if not exists)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'artist_organization_ids_pkey') THEN
        CREATE UNIQUE INDEX artist_organization_ids_pkey ON public.artist_organization_ids USING btree (id);
        ALTER TABLE "public"."artist_organization_ids" ADD CONSTRAINT "artist_organization_ids_pkey" PRIMARY KEY USING INDEX "artist_organization_ids_pkey";
    END IF;
END $$;

-- Foreign key to accounts table (artist accounts)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'artist_organization_ids_artist_id_fkey') THEN
        ALTER TABLE "public"."artist_organization_ids" ADD CONSTRAINT "artist_organization_ids_artist_id_fkey" 
            FOREIGN KEY (artist_id) REFERENCES accounts(id) ON DELETE CASCADE NOT VALID;
        ALTER TABLE "public"."artist_organization_ids" VALIDATE CONSTRAINT "artist_organization_ids_artist_id_fkey";
    END IF;
END $$;

-- Foreign key to accounts table (organization accounts)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'artist_organization_ids_organization_id_fkey') THEN
        ALTER TABLE "public"."artist_organization_ids" ADD CONSTRAINT "artist_organization_ids_organization_id_fkey" 
            FOREIGN KEY (organization_id) REFERENCES accounts(id) ON DELETE CASCADE NOT VALID;
        ALTER TABLE "public"."artist_organization_ids" VALIDATE CONSTRAINT "artist_organization_ids_organization_id_fkey";
    END IF;
END $$;

-- Unique constraint to prevent duplicate artist-org links (IF NOT EXISTS)
CREATE UNIQUE INDEX IF NOT EXISTS artist_organization_ids_unique ON "public"."artist_organization_ids" ("artist_id", "organization_id");

-- Indexes for faster lookups (IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_artist_organization_ids_artist_id ON "public"."artist_organization_ids" ("artist_id");
CREATE INDEX IF NOT EXISTS idx_artist_organization_ids_organization_id ON "public"."artist_organization_ids" ("organization_id");

-- Updated_at trigger (only if not exists)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at' AND tgrelid = 'artist_organization_ids'::regclass) THEN
        CREATE TRIGGER set_updated_at
            BEFORE UPDATE ON artist_organization_ids
            FOR EACH ROW
            EXECUTE FUNCTION trigger_set_updated_at();
    END IF;
END $$;

-- Comment for documentation (idempotent by default)
COMMENT ON TABLE "public"."artist_organization_ids" IS 'Links artist accounts to organizations. An artist can belong to multiple orgs. When either is deleted, the link is automatically removed.';
