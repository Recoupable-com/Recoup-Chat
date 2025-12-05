-- Create account_organization_ids table
-- Links user/customer accounts to organization accounts
-- Similar structure to account_artist_ids (without pinned column)

CREATE TABLE "public"."account_organization_ids" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "account_id" uuid,
    "organization_id" uuid,
    "updated_at" timestamp with time zone DEFAULT now()
);

-- Enable row level security
ALTER TABLE "public"."account_organization_ids" ENABLE ROW LEVEL SECURITY;

-- Primary key
CREATE UNIQUE INDEX account_organization_ids_pkey ON public.account_organization_ids USING btree (id);
ALTER TABLE "public"."account_organization_ids" ADD CONSTRAINT "account_organization_ids_pkey" PRIMARY KEY USING INDEX "account_organization_ids_pkey";

-- Foreign keys with cascade delete
-- account_id references the user/customer account
ALTER TABLE "public"."account_organization_ids" ADD CONSTRAINT "account_organization_ids_account_id_fkey" 
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE NOT VALID;
ALTER TABLE "public"."account_organization_ids" VALIDATE CONSTRAINT "account_organization_ids_account_id_fkey";

-- organization_id references the organization account
ALTER TABLE "public"."account_organization_ids" ADD CONSTRAINT "account_organization_ids_organization_id_fkey" 
    FOREIGN KEY (organization_id) REFERENCES accounts(id) ON DELETE CASCADE NOT VALID;
ALTER TABLE "public"."account_organization_ids" VALIDATE CONSTRAINT "account_organization_ids_organization_id_fkey";

-- Updated_at trigger (uses existing trigger function)
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON account_organization_ids
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at();

-- Indexes for faster lookups
CREATE INDEX idx_account_organization_ids_account_id ON "public"."account_organization_ids" ("account_id");
CREATE INDEX idx_account_organization_ids_organization_id ON "public"."account_organization_ids" ("organization_id");

-- Comment for documentation
COMMENT ON TABLE "public"."account_organization_ids" IS 'Links customer accounts to organization accounts. When either account is deleted, the link is automatically removed.';

