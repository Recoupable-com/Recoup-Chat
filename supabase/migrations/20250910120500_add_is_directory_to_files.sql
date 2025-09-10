-- Add an explicit directory flag to files

alter table "public"."files"
  add column if not exists "is_directory" boolean not null default false;

-- Optional: lightweight helper index for common filters (kept minimal)
create index if not exists idx_files_is_directory
  on public.files using btree (is_directory);


