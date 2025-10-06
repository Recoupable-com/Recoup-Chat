create table "public"."account_catalogs" (
    "id" uuid not null default gen_random_uuid(),
    "account" uuid not null,
    "catalog" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);

alter table "public"."account_catalogs" enable row level security;

-- Primary key constraint on id
CREATE UNIQUE INDEX account_catalogs_pkey ON public.account_catalogs USING btree (id);
alter table "public"."account_catalogs" add constraint "account_catalogs_pkey" PRIMARY KEY using index "account_catalogs_pkey";

-- Unique constraint to ensure one catalog can only be associated with an account once
CREATE UNIQUE INDEX account_catalogs_account_catalog_unique ON public.account_catalogs USING btree (account, catalog);
alter table "public"."account_catalogs" add constraint "account_catalogs_account_catalog_unique" UNIQUE using index "account_catalogs_account_catalog_unique";

-- Indexes for efficient queries
CREATE INDEX idx_account_catalogs_account ON public.account_catalogs USING btree (account);
CREATE INDEX idx_account_catalogs_catalog ON public.account_catalogs USING btree (catalog);
CREATE INDEX idx_account_catalogs_created_at ON public.account_catalogs USING btree (created_at);

-- Foreign key constraints
alter table "public"."account_catalogs" add constraint "account_catalogs_account_fkey" FOREIGN KEY (account) REFERENCES "public"."accounts"(id) ON DELETE CASCADE not valid;
alter table "public"."account_catalogs" validate constraint "account_catalogs_account_fkey";

alter table "public"."account_catalogs" add constraint "account_catalogs_catalog_fkey" FOREIGN KEY (catalog) REFERENCES "public"."catalogs"(id) ON DELETE CASCADE not valid;
alter table "public"."account_catalogs" validate constraint "account_catalogs_catalog_fkey";

-- Grant permissions to service_role only
grant delete on table "public"."account_catalogs" to "service_role";
grant insert on table "public"."account_catalogs" to "service_role";
grant references on table "public"."account_catalogs" to "service_role";
grant select on table "public"."account_catalogs" to "service_role";
grant trigger on table "public"."account_catalogs" to "service_role";
grant truncate on table "public"."account_catalogs" to "service_role";
grant update on table "public"."account_catalogs" to "service_role";

-- Add trigger to automatically update updated_at timestamp
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON account_catalogs
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at();

-- Add comments for documentation
COMMENT ON TABLE "public"."account_catalogs" IS 'Join table linking accounts to catalogs';
COMMENT ON COLUMN "public"."account_catalogs"."id" IS 'Unique identifier for the account-catalog relationship';
COMMENT ON COLUMN "public"."account_catalogs"."account" IS 'Foreign key reference to accounts table';
COMMENT ON COLUMN "public"."account_catalogs"."catalog" IS 'Foreign key reference to catalogs table';
