-- Create table to store per-file access grants

-- Simple scope enum for access level
do $$ begin
  if not exists (select 1 from pg_type where typname = 'file_access_scope') then
    create type file_access_scope as enum ('read_only','admin');
  end if;
end $$;

create table if not exists "public"."file_access" (
    "id" uuid not null default gen_random_uuid(),
    "file_id" uuid not null,
    "artist_account_id" uuid,
    "user_id" uuid,
    "organization_id" uuid,
    "granted_by" uuid,
    "scope" file_access_scope not null default 'read_only',
    "expires_at" timestamp with time zone,
    "revoked_at" timestamp with time zone,
    "created_at" timestamp with time zone not null default now()
);

alter table "public"."file_access" enable row level security;

-- Primary key
CREATE UNIQUE INDEX file_access_pkey ON public.file_access USING btree (id);
alter table "public"."file_access" add constraint "file_access_pkey" PRIMARY KEY using index "file_access_pkey";

-- Foreign keys
alter table "public"."file_access" add constraint "file_access_file_id_fkey" FOREIGN KEY (file_id) REFERENCES "public"."files"(id) ON DELETE CASCADE not valid;
alter table "public"."file_access" validate constraint "file_access_file_id_fkey";

alter table "public"."file_access" add constraint "file_access_artist_account_id_fkey" FOREIGN KEY (artist_account_id) REFERENCES "public"."accounts"(id) ON DELETE CASCADE not valid;
alter table "public"."file_access" validate constraint "file_access_artist_account_id_fkey";

alter table "public"."file_access" add constraint "file_access_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "public"."accounts"(id) ON DELETE CASCADE not valid;
alter table "public"."file_access" validate constraint "file_access_user_id_fkey";

alter table "public"."file_access" add constraint "file_access_granted_by_fkey" FOREIGN KEY (granted_by) REFERENCES "public"."accounts"(id) ON DELETE SET NULL not valid;
alter table "public"."file_access" validate constraint "file_access_granted_by_fkey";

-- Ensure at least one grantee is provided
alter table "public"."file_access"
  add constraint "file_access_grantee_present"
  check (
    artist_account_id is not null
    or user_id is not null
    or organization_id is not null
  );

-- Helpful indexes
CREATE INDEX idx_file_access_file_id ON public.file_access USING btree (file_id);
CREATE INDEX idx_file_access_artist_account_id ON public.file_access USING btree (artist_account_id);
CREATE INDEX idx_file_access_user_id ON public.file_access USING btree (user_id);
CREATE INDEX idx_file_access_organization_id ON public.file_access USING btree (organization_id);

-- Prevent duplicate grants per grantee type
CREATE UNIQUE INDEX uniq_file_access_file_artist ON public.file_access (file_id, artist_account_id) WHERE artist_account_id IS NOT NULL;
CREATE UNIQUE INDEX uniq_file_access_file_user ON public.file_access (file_id, user_id) WHERE user_id IS NOT NULL;
CREATE UNIQUE INDEX uniq_file_access_file_org ON public.file_access (file_id, organization_id) WHERE organization_id IS NOT NULL;

-- Grants (align with project conventions)
grant delete on table "public"."file_access" to "anon";
grant insert on table "public"."file_access" to "anon";
grant references on table "public"."file_access" to "anon";
grant select on table "public"."file_access" to "anon";
grant trigger on table "public"."file_access" to "anon";
grant truncate on table "public"."file_access" to "anon";
grant update on table "public"."file_access" to "anon";

grant delete on table "public"."file_access" to "authenticated";
grant insert on table "public"."file_access" to "authenticated";
grant references on table "public"."file_access" to "authenticated";
grant select on table "public"."file_access" to "authenticated";
grant trigger on table "public"."file_access" to "authenticated";
grant truncate on table "public"."file_access" to "authenticated";
grant update on table "public"."file_access" to "authenticated";

grant delete on table "public"."file_access" to "service_role";
grant insert on table "public"."file_access" to "service_role";
grant references on table "public"."file_access" to "service_role";
grant select on table "public"."file_access" to "service_role";
grant trigger on table "public"."file_access" to "service_role";
grant truncate on table "public"."file_access" to "service_role";
grant update on table "public"."file_access" to "service_role";


