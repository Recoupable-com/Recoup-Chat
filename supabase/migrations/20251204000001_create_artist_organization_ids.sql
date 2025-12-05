-- Create artist_organization_ids table
-- Links artists to organizations (many-to-many: an artist can belong to multiple orgs)

CREATE TABLE "public"."artist_organization_ids" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "artist_id" uuid NOT NULL,
    "organization_id" uuid NOT NULL,
    "created_at" timestamp with time zone DEFAULT now(),
    "updated_at" timestamp with time zone DEFAULT now()
);

-- Enable row level security
ALTER TABLE "public"."artist_organization_ids" ENABLE ROW LEVEL SECURITY;

-- Primary key
CREATE UNIQUE INDEX artist_organization_ids_pkey ON public.artist_organization_ids USING btree (id);
ALTER TABLE "public"."artist_organization_ids" ADD CONSTRAINT "artist_organization_ids_pkey" PRIMARY KEY USING INDEX "artist_organization_ids_pkey";

-- Foreign key to accounts table (artist accounts where account_type = 'artist')
ALTER TABLE "public"."artist_organization_ids" ADD CONSTRAINT "artist_organization_ids_artist_id_fkey" 
    FOREIGN KEY (artist_id) REFERENCES accounts(id) ON DELETE CASCADE NOT VALID;
ALTER TABLE "public"."artist_organization_ids" VALIDATE CONSTRAINT "artist_organization_ids_artist_id_fkey";

-- Foreign key to accounts table (organization accounts)
ALTER TABLE "public"."artist_organization_ids" ADD CONSTRAINT "artist_organization_ids_organization_id_fkey" 
    FOREIGN KEY (organization_id) REFERENCES accounts(id) ON DELETE CASCADE NOT VALID;
ALTER TABLE "public"."artist_organization_ids" VALIDATE CONSTRAINT "artist_organization_ids_organization_id_fkey";

-- Unique constraint to prevent duplicate artist-org links
CREATE UNIQUE INDEX artist_organization_ids_unique ON "public"."artist_organization_ids" ("artist_id", "organization_id");

-- Indexes for faster lookups
CREATE INDEX idx_artist_organization_ids_artist_id ON "public"."artist_organization_ids" ("artist_id");
CREATE INDEX idx_artist_organization_ids_organization_id ON "public"."artist_organization_ids" ("organization_id");

-- Updated_at trigger (uses existing trigger function)
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON artist_organization_ids
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at();

-- Comment for documentation
COMMENT ON TABLE "public"."artist_organization_ids" IS 'Links artist accounts to organizations. An artist can belong to multiple orgs. When either is deleted, the link is automatically removed. Note: artist_id references accounts(id) where account_type = artist.';

