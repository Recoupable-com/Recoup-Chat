create table if not exists "public"."files" (
    "id" uuid not null default gen_random_uuid(),
    "owner_account_id" uuid not null,
    "artist_account_id" uuid not null,
    "storage_key" text not null,
    "file_name" text not null,
    "mime_type" text,
    "size_bytes" bigint,
    "description" text,
    "tags" text[] default '{}'::text[],
    "shared_with_artist_account_ids" uuid[] default '{}'::uuid[],
    "shared_with_account_ids" uuid[] default '{}'::uuid[],
    "shared_with_all_artist_members" boolean not null default false,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);

alter table "public"."files" enable row level security;

-- Indexes and constraints
CREATE UNIQUE INDEX files_pkey ON public.files USING btree (id);
alter table "public"."files" add constraint "files_pkey" PRIMARY KEY using index "files_pkey";

CREATE UNIQUE INDEX files_storage_key_key ON public.files USING btree (storage_key);
alter table "public"."files" add constraint "files_storage_key_key" UNIQUE using index "files_storage_key_key";

CREATE INDEX idx_files_owner_account_id ON public.files USING btree (owner_account_id);
CREATE INDEX idx_files_artist_account_id ON public.files USING btree (artist_account_id);
CREATE INDEX idx_files_created_at ON public.files USING btree (created_at);
CREATE INDEX idx_files_shared_with_account_ids ON public.files USING GIN (shared_with_account_ids);
CREATE INDEX idx_files_shared_with_artist_account_ids ON public.files USING GIN (shared_with_artist_account_ids);

-- Foreign keys
alter table "public"."files" add constraint "files_owner_account_id_fkey" FOREIGN KEY (owner_account_id) REFERENCES "public"."accounts"(id) ON DELETE CASCADE not valid;
alter table "public"."files" validate constraint "files_owner_account_id_fkey";

alter table "public"."files" add constraint "files_artist_account_id_fkey" FOREIGN KEY (artist_account_id) REFERENCES "public"."accounts"(id) ON DELETE CASCADE not valid;
alter table "public"."files" validate constraint "files_artist_account_id_fkey";

-- Grants (consistent with existing migrations)
grant delete on table "public"."files" to "anon";
grant insert on table "public"."files" to "anon";
grant references on table "public"."files" to "anon";
grant select on table "public"."files" to "anon";
grant trigger on table "public"."files" to "anon";
grant truncate on table "public"."files" to "anon";
grant update on table "public"."files" to "anon";

grant delete on table "public"."files" to "authenticated";
grant insert on table "public"."files" to "authenticated";
grant references on table "public"."files" to "authenticated";
grant select on table "public"."files" to "authenticated";
grant trigger on table "public"."files" to "authenticated";
grant truncate on table "public"."files" to "authenticated";
grant update on table "public"."files" to "authenticated";

grant delete on table "public"."files" to "service_role";
grant insert on table "public"."files" to "service_role";
grant references on table "public"."files" to "service_role";
grant select on table "public"."files" to "service_role";
grant trigger on table "public"."files" to "service_role";
grant truncate on table "public"."files" to "service_role";
grant update on table "public"."files" to "service_role";
