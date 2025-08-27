-- Modify agent_templates to support user-created templates
-- Adds creator (FK -> accounts.id) and is_private (boolean, default false)

ALTER TABLE agent_templates
  ADD COLUMN IF NOT EXISTS creator uuid REFERENCES accounts(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS is_private boolean NOT NULL DEFAULT false;


