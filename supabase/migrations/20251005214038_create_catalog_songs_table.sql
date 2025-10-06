create table "public"."catalog_songs" (
    "id" uuid not null default gen_random_uuid(),
    "catalog" uuid not null,
    "song" text not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);

alter table "public"."catalog_songs" enable row level security;

-- Primary key constraint on id
CREATE UNIQUE INDEX catalog_songs_pkey ON public.catalog_songs USING btree (id);
alter table "public"."catalog_songs" add constraint "catalog_songs_pkey" PRIMARY KEY using index "catalog_songs_pkey";

-- Unique constraint to ensure one song can only be in a catalog once
CREATE UNIQUE INDEX catalog_songs_catalog_song_unique ON public.catalog_songs USING btree (catalog, song);
alter table "public"."catalog_songs" add constraint "catalog_songs_catalog_song_unique" UNIQUE using index "catalog_songs_catalog_song_unique";

-- Indexes for efficient queries
CREATE INDEX idx_catalog_songs_catalog ON public.catalog_songs USING btree (catalog);
CREATE INDEX idx_catalog_songs_song ON public.catalog_songs USING btree (song);
CREATE INDEX idx_catalog_songs_created_at ON public.catalog_songs USING btree (created_at);

-- Foreign key constraints
alter table "public"."catalog_songs" add constraint "catalog_songs_catalog_fkey" FOREIGN KEY (catalog) REFERENCES "public"."catalogs"(id) ON DELETE CASCADE not valid;
alter table "public"."catalog_songs" validate constraint "catalog_songs_catalog_fkey";

alter table "public"."catalog_songs" add constraint "catalog_songs_song_fkey" FOREIGN KEY (song) REFERENCES "public"."songs"(isrc) ON DELETE CASCADE not valid;
alter table "public"."catalog_songs" validate constraint "catalog_songs_song_fkey";

-- Grant permissions to service_role only
grant delete on table "public"."catalog_songs" to "service_role";
grant insert on table "public"."catalog_songs" to "service_role";
grant references on table "public"."catalog_songs" to "service_role";
grant select on table "public"."catalog_songs" to "service_role";
grant trigger on table "public"."catalog_songs" to "service_role";
grant truncate on table "public"."catalog_songs" to "service_role";
grant update on table "public"."catalog_songs" to "service_role";

-- Add trigger to automatically update updated_at timestamp
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON catalog_songs
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at();

-- Add comments for documentation
COMMENT ON TABLE "public"."catalog_songs" IS 'Join table linking catalogs to songs';
COMMENT ON COLUMN "public"."catalog_songs"."id" IS 'Unique identifier for the catalog-song relationship';
COMMENT ON COLUMN "public"."catalog_songs"."catalog" IS 'Foreign key reference to catalogs table';
COMMENT ON COLUMN "public"."catalog_songs"."song" IS 'Foreign key reference to songs table (ISRC)';
