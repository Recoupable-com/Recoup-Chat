-- Drop file_access table and related artifacts (indexes, RLS policies, grants)

-- Drop table (CASCADE removes indexes, constraints, policies on the table)
drop table if exists "public"."file_access" cascade;

-- Drop enum type used by file_access if it exists and has no remaining dependencies
do $$ begin
  if exists (select 1 from pg_type where typname = 'file_access_scope') then
    drop type file_access_scope;
  end if;
end $$;


