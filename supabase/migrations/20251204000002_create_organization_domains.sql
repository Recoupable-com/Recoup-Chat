-- Create organization_domains table
-- Maps email domains to organizations for auto-assignment on login
-- One org can have multiple domains (e.g., Rostrum Pacific has 6)

CREATE TABLE "public"."organization_domains" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "domain" text NOT NULL,
    "organization_id" uuid NOT NULL,
    "created_at" timestamp with time zone DEFAULT now()
);

-- Enable row level security
ALTER TABLE "public"."organization_domains" ENABLE ROW LEVEL SECURITY;

-- Primary key
CREATE UNIQUE INDEX organization_domains_pkey ON public.organization_domains USING btree (id);
ALTER TABLE "public"."organization_domains" ADD CONSTRAINT "organization_domains_pkey" PRIMARY KEY USING INDEX "organization_domains_pkey";

-- Foreign key to accounts table (organization accounts)
ALTER TABLE "public"."organization_domains" ADD CONSTRAINT "organization_domains_organization_id_fkey" 
    FOREIGN KEY (organization_id) REFERENCES accounts(id) ON DELETE CASCADE NOT VALID;
ALTER TABLE "public"."organization_domains" VALIDATE CONSTRAINT "organization_domains_organization_id_fkey";

-- Unique constraint - each domain can only belong to one org
CREATE UNIQUE INDEX organization_domains_domain_unique ON "public"."organization_domains" ("domain");

-- Index for fast domain lookups
CREATE INDEX idx_organization_domains_domain ON "public"."organization_domains" ("domain");
CREATE INDEX idx_organization_domains_organization_id ON "public"."organization_domains" ("organization_id");

-- Grant permissions to all roles
GRANT DELETE ON TABLE "public"."organization_domains" TO "anon";
GRANT INSERT ON TABLE "public"."organization_domains" TO "anon";
GRANT REFERENCES ON TABLE "public"."organization_domains" TO "anon";
GRANT SELECT ON TABLE "public"."organization_domains" TO "anon";
GRANT TRIGGER ON TABLE "public"."organization_domains" TO "anon";
GRANT TRUNCATE ON TABLE "public"."organization_domains" TO "anon";
GRANT UPDATE ON TABLE "public"."organization_domains" TO "anon";

GRANT DELETE ON TABLE "public"."organization_domains" TO "authenticated";
GRANT INSERT ON TABLE "public"."organization_domains" TO "authenticated";
GRANT REFERENCES ON TABLE "public"."organization_domains" TO "authenticated";
GRANT SELECT ON TABLE "public"."organization_domains" TO "authenticated";
GRANT TRIGGER ON TABLE "public"."organization_domains" TO "authenticated";
GRANT TRUNCATE ON TABLE "public"."organization_domains" TO "authenticated";
GRANT UPDATE ON TABLE "public"."organization_domains" TO "authenticated";

GRANT DELETE ON TABLE "public"."organization_domains" TO "service_role";
GRANT INSERT ON TABLE "public"."organization_domains" TO "service_role";
GRANT REFERENCES ON TABLE "public"."organization_domains" TO "service_role";
GRANT SELECT ON TABLE "public"."organization_domains" TO "service_role";
GRANT TRIGGER ON TABLE "public"."organization_domains" TO "service_role";
GRANT TRUNCATE ON TABLE "public"."organization_domains" TO "service_role";
GRANT UPDATE ON TABLE "public"."organization_domains" TO "service_role";

-- Comment for documentation
COMMENT ON TABLE "public"."organization_domains" IS 'Maps email domains to organizations. Used for auto-assigning users to orgs on login. Each domain can only belong to one org.';

-- NOTE: Seed data is NOT included in this migration because it references 
-- the Rostrum Pacific org which only exists in production.
-- 
-- After deploying to production, run this SQL manually:
--
-- INSERT INTO "public"."organization_domains" (domain, organization_id) VALUES
--     ('recoupable.com', 'cebcc866-34c3-451c-8cd7-f63309acff0a'),
--     ('rostrum.com', 'cebcc866-34c3-451c-8cd7-f63309acff0a'),
--     ('rostrumrecords.com', 'cebcc866-34c3-451c-8cd7-f63309acff0a'),
--     ('spaceheatermusic.io', 'cebcc866-34c3-451c-8cd7-f63309acff0a'),
--     ('fatbeats.com', 'cebcc866-34c3-451c-8cd7-f63309acff0a'),
--     ('cantorarecords.net', 'cebcc866-34c3-451c-8cd7-f63309acff0a');
--
-- When onboarding new enterprise customers:
-- 1. Create their organization account (account_type = 'organization')
-- 2. Add their domains to this table
-- 3. Also add 'recoupable.com' to their org so Recoup team can access it

