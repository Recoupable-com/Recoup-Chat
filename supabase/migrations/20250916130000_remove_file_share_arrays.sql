-- Remove unused sharing arrays from public.files and related indexes

-- Drop dependent indexes if they exist
drop index if exists public.idx_files_shared_with_account_ids;
drop index if exists public.idx_files_shared_with_artist_account_ids;

-- Drop legacy sharing columns
alter table "public"."files"
  drop column if exists "shared_with_artist_account_ids",
  drop column if exists "shared_with_account_ids",
  drop column if exists "shared_with_all_artist_members";


