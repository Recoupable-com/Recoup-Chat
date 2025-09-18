-- Complete agent templates restructure with new names and descriptions
-- Implements 5-category system: Research, Plan, Create, Connect, Report

-- First, remove duplicate agents
DELETE FROM agent_templates WHERE title = 'Merchandising Optimization';

-- Update existing agents with new names, descriptions, and tags

-- RESEARCH CATEGORY (6 agents)
UPDATE agent_templates SET 
  title = 'Find Your Most Valuable Fans',
  description = 'Identifies your highest-spending fans with demographics and campaign targeting for maximum monetization.',
  tags = '{"Research"}'
WHERE title = 'Superfan Insights';

UPDATE agent_templates SET 
  title = 'Cross-Platform Social Audit',
  description = 'Complete health check of all your social media platforms with performance analysis and visual improvement diagram.',
  tags = '{"Research"}'
WHERE title = 'Social Performance Audit';

UPDATE agent_templates SET 
  title = 'Instagram Brand Partnership Finder',
  description = 'Analyzes your Instagram audience to find brand partnership opportunities and creates content themes.',
  tags = '{"Research"}'
WHERE title = 'Instagram Growth Analysis';

UPDATE agent_templates SET 
  title = 'Instagram Comment Response Guide',
  description = 'Reviews your Instagram comments and tells you which ones to respond to with engagement priorities.',
  tags = '{"Research"}'
WHERE title = 'Sentiment Analysis';

UPDATE agent_templates SET 
  title = 'Join Trending Conversations',
  description = 'Finds trending topics your fans are discussing and gives you authentic content ideas to join the conversation.',
  tags = '{"Research"}'
WHERE title = 'Trend Analysis';

UPDATE agent_templates SET 
  title = 'Copy Your Top 3 Competitors',
  description = 'Researches your 3 biggest competitors and gives you specific tactics to copy for better performance.',
  tags = '{"Research"}'
WHERE title = 'Competitive Benchmarking';

-- PLAN CATEGORY (8 agents)
UPDATE agent_templates SET 
  title = 'Tour Planning Strategy',
  description = 'Creates complete tour plan with optimized routing, venue selection, VIP experiences, and pricing strategy.',
  tags = '{"Plan"}'
WHERE title = 'Tour Strategy';

UPDATE agent_templates SET 
  title = 'Brand Redesign with Visual Mockups',
  description = 'Analyzes your current brand perception and creates visual mockups of your refreshed identity with implementation steps.',
  tags = '{"Plan"}'
WHERE title = 'Brand Positioning';

UPDATE agent_templates SET 
  title = 'Release Launch Strategy',
  description = 'Analyzes your past releases and creates timing, messaging, and platform strategy for maximum impact.',
  tags = '{"Plan"}'
WHERE title = 'Release Optimization';

UPDATE agent_templates SET 
  title = 'Content Calendar Creator',
  description = 'Develops strategic monthly content calendar across all platforms with posting schedule and trending topics.',
  tags = '{"Plan"}'
WHERE title = 'Content Calendar Planning';

UPDATE agent_templates SET 
  title = 'Find New Fans Visual Map',
  description = 'Identifies untapped audience segments and creates visual map showing where to find and acquire new listeners.',
  tags = '{"Plan"}'
WHERE title = 'Market Expansion';

UPDATE agent_templates SET 
  title = 'Merchandise Strategy Plan',
  description = 'Analyzes successful merch in your genre and creates data-driven product plan with pricing and design recommendations.',
  tags = '{"Plan"}'
WHERE title = 'Merchandising Strategy';

UPDATE agent_templates SET 
  title = 'Social Posts to Shop Sales Strategy',
  description = 'Creates strategy to convert your social media posts into direct shop sales with friction analysis.',
  tags = '{"Plan"}'
WHERE title = 'Commerce Funnel Analysis';

-- CREATE CATEGORY (4 agents)
UPDATE agent_templates SET 
  title = '5 Viral Content Ideas',
  description = 'Analyzes current viral trends and gives you 5 authentic content ideas with high viral potential and platform strategies.',
  tags = '{"Create"}'
WHERE title = 'Viral Content Innovation';

UPDATE agent_templates SET 
  title = 'Update YouTube Thumbnails',
  description = 'Finds your low-performing videos and creates new eye-catching thumbnails to improve click-through rates.',
  tags = '{"Create"}'
WHERE title = 'Ghibli YouTube Thumbnail Generation';

UPDATE agent_templates SET 
  title = 'Corporate Partnership Finder',
  description = 'Analyzes your audience to find perfect brand partnership opportunities ranked by revenue potential.',
  tags = '{"Create"}'
WHERE title = 'Brand Partnership Scouting';

UPDATE agent_templates SET 
  title = 'Spotify Profile Optimization',
  description = 'Optimizes your Spotify profile with cross-platform synchronization and playlist strategy recommendations.',
  tags = '{"Create"}'
WHERE title = 'Spotify Profile Audit';

-- CONNECT CATEGORY (4 agents)
UPDATE agent_templates SET 
  title = 'Artist Cross-Promotion Finder',
  description = 'Finds compatible artists for mutual audience growth with fanbase overlap analysis and campaign ideas.',
  tags = '{"Connect"}'
WHERE title = 'Collaboration Scouting';

UPDATE agent_templates SET 
  title = '10 Podcast Guest Email Templates',
  description = 'Finds 10 niche creators with audience overlap and writes personalized podcast invitation emails ready to send.',
  tags = '{"Connect"}'
WHERE title = 'Podcast Guest Acquisition';

UPDATE agent_templates SET 
  title = '5 Community Partnership Email Templates',
  description = 'Identifies 5 hyper-niche communities aligned with your brand and writes collaboration emails ready to send.',
  tags = '{"Connect"}'
WHERE title = 'Niche Community Infiltration';

UPDATE agent_templates SET 
  title = 'Add Your Spin to Trends',
  description = 'Shows you how to authentically participate in current trends with unique angle strategies and optimal timing.',
  tags = '{"Connect"}'
WHERE title = 'Trend Participation';

-- Remove the duplicate Fan Engagement Strategy (same prompt as Sentiment Analysis)
DELETE FROM agent_templates WHERE title = 'Fan Engagement Strategy';

-- INSERT NEW HIGH-VALUE AGENTS

INSERT INTO agent_templates (title, description, prompt, tags) VALUES

-- REPORT CATEGORY (New agents)
('YouTube Revenue Report', 
 'Gets your actual YouTube revenue data and video performance metrics in an easy-to-read report.',
 'Show me my YouTube revenue data for the past month. Include total earnings, top-performing videos, and revenue trends. I want to see which videos are making the most money and how my channel is performing financially.',
 '{"Report"}'),

('Weekly Performance Dashboard', 
 'Sets up automated weekly reports of your performance across all platforms delivered to your email.',
 'Set up a weekly performance dashboard that emails me every Monday with my stats from all platforms - YouTube revenue, Spotify streams, Instagram engagement, and Twitter activity. I want to see week-over-week changes and top-performing content.',
 '{"Report"}'),

('Weekly Release Reports', 
 'Tracks a specific song release with automated weekly performance reports sent to your email.',
 'I need weekly tracking reports for my song release. What''s the exact song title you want me to track? I''ll monitor its performance on YouTube and Spotify and email you weekly updates with view counts, stream numbers, and engagement data.',
 '{"Report"}'),

-- RESEARCH CATEGORY (New agents)
('Top Performing Content Finder', 
 'Finds your best-performing posts across all platforms to show you what content actually works.',
 'Analyze all my posts across Instagram, Twitter, and YouTube to find my top-performing content. Show me what types of posts get the most engagement, which platforms work best for me, and what patterns I should replicate.',
 '{"Research"}'),

('Fan Segment Revenue Analysis', 
 'Analyzes your fan segments to show which groups are worth the most money for targeted campaigns.',
 'Create detailed fan segments for my artist and analyze which segments have the highest revenue potential. Show me demographics, spending patterns, and engagement levels so I can focus my marketing on the most valuable fans.',
 '{"Research"}'),

-- CREATE CATEGORY (New agents)  
('Spotify Playlist Placement Finder',
 'Finds playlists your music should be on for maximum streams and discovery.',
 'Research playlists in my genre and style that would be perfect for my music. Find playlist curators, analyze submission requirements, and give me a strategy for getting my songs placed on high-impact playlists.',
 '{"Create"}'),

-- CONNECT CATEGORY (New agents)
('Weekly Potential Fan Finder',
 'Analyzes lookalike artists and finds their followers who would likely become your fans, delivered weekly via email.',
 'Set up weekly potential fan discovery for my artist. Find lookalike artists and niche creators in my space, analyze their followers and commenters, then email me every week with clickable handles of people who would likely become my fans so I can engage with them.',
 '{"Connect"}'),

('Comment Response Priority List',
 'Tells you exactly which comments across all platforms to respond to first for maximum engagement impact.',
 'Analyze all the comments on my recent posts across Instagram, YouTube, and Twitter. Tell me which comments I should prioritize responding to based on the commenter''s influence, engagement potential, and likelihood to become a valuable fan.',
 '{"Connect"}');
