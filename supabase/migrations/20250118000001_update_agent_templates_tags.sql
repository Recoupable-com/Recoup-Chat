-- Update agent templates tags to new 5-category system
-- Research, Plan, Create, Connect, Report

-- Research - Data analysis and insights
UPDATE agent_templates SET tags = '{"Research"}' WHERE title = 'Trend Analysis';
UPDATE agent_templates SET tags = '{"Research"}' WHERE title = 'Competitive Benchmarking';
UPDATE agent_templates SET tags = '{"Research"}' WHERE title = 'Superfan Insights';
UPDATE agent_templates SET tags = '{"Research"}' WHERE title = 'Social Performance Audit';
UPDATE agent_templates SET tags = '{"Research"}' WHERE title = 'Instagram Growth Analysis';
UPDATE agent_templates SET tags = '{"Research"}' WHERE title = 'Sentiment Analysis';

-- Plan - Strategy and planning
UPDATE agent_templates SET tags = '{"Plan"}' WHERE title = 'Tour Strategy';
UPDATE agent_templates SET tags = '{"Plan"}' WHERE title = 'Brand Positioning';
UPDATE agent_templates SET tags = '{"Plan"}' WHERE title = 'Release Optimization';
UPDATE agent_templates SET tags = '{"Plan"}' WHERE title = 'Content Calendar Planning';
UPDATE agent_templates SET tags = '{"Plan"}' WHERE title = 'Market Expansion';
UPDATE agent_templates SET tags = '{"Plan"}' WHERE title = 'Merchandising Strategy';
UPDATE agent_templates SET tags = '{"Plan"}' WHERE title = 'Commerce Funnel Analysis';
UPDATE agent_templates SET tags = '{"Plan"}' WHERE title = 'Merchandising Optimization';

-- Create - Content and asset creation
UPDATE agent_templates SET tags = '{"Create"}' WHERE title = 'Viral Content Innovation';
UPDATE agent_templates SET tags = '{"Create"}' WHERE title = 'Ghibli YouTube Thumbnail Generation';
UPDATE agent_templates SET tags = '{"Create"}' WHERE title = 'Brand Partnership Scouting';
UPDATE agent_templates SET tags = '{"Create"}' WHERE title = 'Spotify Profile Audit';

-- Connect - Outreach and relationship building
UPDATE agent_templates SET tags = '{"Connect"}' WHERE title = 'Collaboration Scouting';
UPDATE agent_templates SET tags = '{"Connect"}' WHERE title = 'Fan Engagement Strategy';
UPDATE agent_templates SET tags = '{"Connect"}' WHERE title = 'Podcast Guest Acquisition';
UPDATE agent_templates SET tags = '{"Connect"}' WHERE title = 'Niche Community Infiltration';
UPDATE agent_templates SET tags = '{"Connect"}' WHERE title = 'Trend Participation';

-- Note: No agents mapped to "Report" category yet
-- Audience Segmentation remains unchanged (hidden from UI)
