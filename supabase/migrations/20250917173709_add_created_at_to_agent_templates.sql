-- Add created_at column to agent_templates
ALTER TABLE agent_templates
  ADD COLUMN IF NOT EXISTS created_at timestamp with time zone NOT NULL DEFAULT now();


