-- Migration: Add trigger_schedule_id to scheduled_actions
-- Purpose: Store Trigger.dev schedule id for external schedule lookup

-- Reference (current schema excerpt):
-- Table: public.scheduled_actions
-- Columns (existing):
--   account_id uuid NOT NULL,
--   artist_account_id uuid NOT NULL,
--   created_at timestamptz NULL,
--   enabled boolean NULL,
--   id uuid PRIMARY KEY,
--   last_run timestamptz NULL,
--   next_run timestamptz NULL,
--   prompt text NOT NULL,
--   schedule text NOT NULL,
--   title text NOT NULL,
--   updated_at timestamptz NULL

-- Change: add optional text column trigger_schedule_id with default NULL
ALTER TABLE public.scheduled_actions
ADD COLUMN IF NOT EXISTS trigger_schedule_id text DEFAULT NULL;

COMMENT ON COLUMN public.scheduled_actions.trigger_schedule_id IS
'Trigger.dev schedule id for looking up the external scheduled task';


