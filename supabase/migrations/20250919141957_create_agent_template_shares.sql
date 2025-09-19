-- Create agent template shares table
-- Allows users to share agent templates with other users

CREATE TABLE agent_template_shares (
  template_id uuid NOT NULL REFERENCES agent_templates(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (template_id, user_id)
);

-- Indexes for performance
CREATE INDEX idx_agent_template_shares_user_id ON agent_template_shares(user_id);
CREATE INDEX idx_agent_template_shares_template_id ON agent_template_shares(template_id);

-- Enable row level security
ALTER TABLE agent_template_shares ENABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT SELECT, INSERT, DELETE ON agent_template_shares TO authenticated;
GRANT SELECT, INSERT, DELETE ON agent_template_shares TO anon;
