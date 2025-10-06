create table "public"."song_artists" (
    "id" uuid not null default gen_random_uuid(),
    "song" text not null,
    "artist" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);

alter table "public"."song_artists" enable row level security;

-- Primary key constraint on id
CREATE UNIQUE INDEX song_artists_pkey ON public.song_artists USING btree (id);
alter table "public"."song_artists" add constraint "song_artists_pkey" PRIMARY KEY using index "song_artists_pkey";

-- Unique constraint to ensure one artist can only be associated with a song once
CREATE UNIQUE INDEX song_artists_song_artist_unique ON public.song_artists USING btree (song, artist);
alter table "public"."song_artists" add constraint "song_artists_song_artist_unique" UNIQUE using index "song_artists_song_artist_unique";

-- Indexes for efficient queries
CREATE INDEX idx_song_artists_song ON public.song_artists USING btree (song);
CREATE INDEX idx_song_artists_artist ON public.song_artists USING btree (artist);
CREATE INDEX idx_song_artists_created_at ON public.song_artists USING btree (created_at);

-- Foreign key constraints
alter table "public"."song_artists" add constraint "song_artists_song_fkey" FOREIGN KEY (song) REFERENCES "public"."songs"(isrc) ON DELETE CASCADE not valid;
alter table "public"."song_artists" validate constraint "song_artists_song_fkey";

alter table "public"."song_artists" add constraint "song_artists_artist_fkey" FOREIGN KEY (artist) REFERENCES "public"."accounts"(id) ON DELETE CASCADE not valid;
alter table "public"."song_artists" validate constraint "song_artists_artist_fkey";

-- Grant permissions to service_role only
grant delete on table "public"."song_artists" to "service_role";
grant insert on table "public"."song_artists" to "service_role";
grant references on table "public"."song_artists" to "service_role";
grant select on table "public"."song_artists" to "service_role";
grant trigger on table "public"."song_artists" to "service_role";
grant truncate on table "public"."song_artists" to "service_role";
grant update on table "public"."song_artists" to "service_role";

-- Add trigger to automatically update updated_at timestamp
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON song_artists
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at();

-- Add comments for documentation
COMMENT ON TABLE "public"."song_artists" IS 'Join table linking songs to artists';
COMMENT ON COLUMN "public"."song_artists"."id" IS 'Unique identifier for the song-artist relationship';
COMMENT ON COLUMN "public"."song_artists"."song" IS 'Foreign key reference to songs table (ISRC)';
COMMENT ON COLUMN "public"."song_artists"."artist" IS 'Foreign key reference to accounts table (artist account)';
