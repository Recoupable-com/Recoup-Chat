create table "public"."catalogs" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);

alter table "public"."catalogs" enable row level security;

-- Primary key constraint on id
CREATE UNIQUE INDEX catalogs_pkey ON public.catalogs USING btree (id);
alter table "public"."catalogs" add constraint "catalogs_pkey" PRIMARY KEY using index "catalogs_pkey";

-- Indexes for efficient queries
CREATE INDEX idx_catalogs_name ON public.catalogs USING btree (name);
CREATE INDEX idx_catalogs_created_at ON public.catalogs USING btree (created_at);

-- Grant permissions to service_role only
grant delete on table "public"."catalogs" to "service_role";
grant insert on table "public"."catalogs" to "service_role";
grant references on table "public"."catalogs" to "service_role";
grant select on table "public"."catalogs" to "service_role";
grant trigger on table "public"."catalogs" to "service_role";
grant truncate on table "public"."catalogs" to "service_role";
grant update on table "public"."catalogs" to "service_role";

-- Add trigger to automatically update updated_at timestamp
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON catalogs
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at();

-- Add comments for documentation
COMMENT ON TABLE "public"."catalogs" IS 'Table storing catalog information';
COMMENT ON COLUMN "public"."catalogs"."id" IS 'Unique identifier for the catalog';
COMMENT ON COLUMN "public"."catalogs"."name" IS 'Name of the catalog';
