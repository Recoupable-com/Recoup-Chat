-- Create favorites junction table for agent templates
CREATE TABLE IF NOT EXISTS agent_template_favorites (
  template_id uuid NOT NULL REFERENCES agent_templates(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (template_id, user_id)
);

-- Index for fast lookups by user
CREATE INDEX IF NOT EXISTS idx_agent_template_favorites_user ON agent_template_favorites(user_id);

-- Add denormalized favorites_count to agent_templates
ALTER TABLE agent_templates
  ADD COLUMN IF NOT EXISTS favorites_count integer NOT NULL DEFAULT 0;

-- Trigger function to keep favorites_count accurate
CREATE OR REPLACE FUNCTION update_agent_template_favorites_count()
RETURNS TRIGGER AS $$
DECLARE
  affected_template_id uuid;
BEGIN
  IF TG_OP = 'INSERT' THEN
    affected_template_id := NEW.template_id;
  ELSIF TG_OP = 'DELETE' THEN
    affected_template_id := OLD.template_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.template_id IS DISTINCT FROM OLD.template_id THEN
      UPDATE agent_templates
      SET favorites_count = (
        SELECT COUNT(*) FROM agent_template_favorites WHERE template_id = OLD.template_id
      )
      WHERE id = OLD.template_id;
    END IF;
    affected_template_id := NEW.template_id;
  END IF;

  UPDATE agent_templates
  SET favorites_count = (
    SELECT COUNT(*) FROM agent_template_favorites WHERE template_id = affected_template_id
  )
  WHERE id = affected_template_id;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to invoke the function after changes
DROP TRIGGER IF EXISTS trg_update_favorites_count ON agent_template_favorites;
CREATE TRIGGER trg_update_favorites_count
  AFTER INSERT OR UPDATE OR DELETE ON agent_template_favorites
  FOR EACH ROW
  EXECUTE FUNCTION update_agent_template_favorites_count();

-- Backfill counts for existing data
UPDATE agent_templates SET favorites_count = 0;

UPDATE agent_templates a
SET favorites_count = c.cnt
FROM (
  SELECT template_id, COUNT(*)::int AS cnt
  FROM agent_template_favorites
  GROUP BY template_id
) c
WHERE a.id = c.template_id;


