-- Create account_workspace_ids table
-- Links owner accounts to workspace accounts
-- Similar structure to account_artist_ids (without pinned column)
-- Used to identify which accounts are workspaces (vs artists)

CREATE TABLE "public"."account_workspace_ids" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "account_id" uuid,
    "workspace_id" uuid,
    "updated_at" timestamp with time zone DEFAULT now()
);

-- Enable row level security
ALTER TABLE "public"."account_workspace_ids" ENABLE ROW LEVEL SECURITY;

-- Primary key
CREATE UNIQUE INDEX account_workspace_ids_pkey ON public.account_workspace_ids USING btree (id);
ALTER TABLE "public"."account_workspace_ids" ADD CONSTRAINT "account_workspace_ids_pkey" PRIMARY KEY USING INDEX "account_workspace_ids_pkey";

-- Foreign keys with cascade delete
-- account_id references the owner account
ALTER TABLE "public"."account_workspace_ids" ADD CONSTRAINT "account_workspace_ids_account_id_fkey" 
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE NOT VALID;
ALTER TABLE "public"."account_workspace_ids" VALIDATE CONSTRAINT "account_workspace_ids_account_id_fkey";

-- workspace_id references the workspace account
ALTER TABLE "public"."account_workspace_ids" ADD CONSTRAINT "account_workspace_ids_workspace_id_fkey" 
    FOREIGN KEY (workspace_id) REFERENCES accounts(id) ON DELETE CASCADE NOT VALID;
ALTER TABLE "public"."account_workspace_ids" VALIDATE CONSTRAINT "account_workspace_ids_workspace_id_fkey";

-- Updated_at trigger (uses existing trigger function)
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON account_workspace_ids
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at();

-- Grant permissions to all roles
GRANT DELETE ON TABLE "public"."account_workspace_ids" TO "anon";
GRANT INSERT ON TABLE "public"."account_workspace_ids" TO "anon";
GRANT REFERENCES ON TABLE "public"."account_workspace_ids" TO "anon";
GRANT SELECT ON TABLE "public"."account_workspace_ids" TO "anon";
GRANT TRIGGER ON TABLE "public"."account_workspace_ids" TO "anon";
GRANT TRUNCATE ON TABLE "public"."account_workspace_ids" TO "anon";
GRANT UPDATE ON TABLE "public"."account_workspace_ids" TO "anon";

GRANT DELETE ON TABLE "public"."account_workspace_ids" TO "authenticated";
GRANT INSERT ON TABLE "public"."account_workspace_ids" TO "authenticated";
GRANT REFERENCES ON TABLE "public"."account_workspace_ids" TO "authenticated";
GRANT SELECT ON TABLE "public"."account_workspace_ids" TO "authenticated";
GRANT TRIGGER ON TABLE "public"."account_workspace_ids" TO "authenticated";
GRANT TRUNCATE ON TABLE "public"."account_workspace_ids" TO "authenticated";
GRANT UPDATE ON TABLE "public"."account_workspace_ids" TO "authenticated";

GRANT DELETE ON TABLE "public"."account_workspace_ids" TO "service_role";
GRANT INSERT ON TABLE "public"."account_workspace_ids" TO "service_role";
GRANT REFERENCES ON TABLE "public"."account_workspace_ids" TO "service_role";
GRANT SELECT ON TABLE "public"."account_workspace_ids" TO "service_role";
GRANT TRIGGER ON TABLE "public"."account_workspace_ids" TO "service_role";
GRANT TRUNCATE ON TABLE "public"."account_workspace_ids" TO "service_role";
GRANT UPDATE ON TABLE "public"."account_workspace_ids" TO "service_role";

-- Indexes for faster lookups
CREATE INDEX idx_account_workspace_ids_account_id ON "public"."account_workspace_ids" ("account_id");
CREATE INDEX idx_account_workspace_ids_workspace_id ON "public"."account_workspace_ids" ("workspace_id");

-- Comment for documentation
COMMENT ON TABLE "public"."account_workspace_ids" IS 'Links owner accounts to workspace accounts. When either account is deleted, the link is automatically removed. Used to identify workspaces (vs artists) without relying on account_type column.';

