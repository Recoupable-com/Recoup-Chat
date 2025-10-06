create table "public"."songs" (
    "isrc" text not null,
    "name" text not null,
    "album" text not null,
    "lyrics" text not null,
    "updated_at" timestamp with time zone not null default now()
);

alter table "public"."songs" enable row level security;

-- Primary key constraint on isrc
CREATE UNIQUE INDEX songs_pkey ON public.songs USING btree (isrc);
alter table "public"."songs" add constraint "songs_pkey" PRIMARY KEY using index "songs_pkey";

-- Indexes for efficient queries
CREATE INDEX idx_songs_name ON public.songs USING btree (name);
CREATE INDEX idx_songs_album ON public.songs USING btree (album);

-- Grant permissions to service_role only
grant delete on table "public"."songs" to "service_role";
grant insert on table "public"."songs" to "service_role";
grant references on table "public"."songs" to "service_role";
grant select on table "public"."songs" to "service_role";
grant trigger on table "public"."songs" to "service_role";
grant truncate on table "public"."songs" to "service_role";
grant update on table "public"."songs" to "service_role";

-- Add trigger to automatically update updated_at timestamp
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON songs
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at();

-- Add comments for documentation
COMMENT ON TABLE "public"."songs" IS 'Table storing song information with ISRC as unique identifier';
COMMENT ON COLUMN "public"."songs"."isrc" IS 'International Standard Recording Code - unique identifier for the recording';
COMMENT ON COLUMN "public"."songs"."name" IS 'Name/title of the song';
COMMENT ON COLUMN "public"."songs"."album" IS 'Album name where the song appears';
COMMENT ON COLUMN "public"."songs"."lyrics" IS 'Full lyrics text of the song';
