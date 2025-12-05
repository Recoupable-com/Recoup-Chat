-- Add model column to scheduled_actions table
-- Allows tasks to specify which AI model to use for execution

ALTER TABLE public.scheduled_actions
ADD COLUMN IF NOT EXISTS model TEXT DEFAULT NULL;

COMMENT ON COLUMN public.scheduled_actions.model IS
'Model ID for task execution (e.g., openai/gpt-5-mini). NULL = default model.';

