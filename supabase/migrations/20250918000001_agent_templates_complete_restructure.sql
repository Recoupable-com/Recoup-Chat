-- Complete agent templates restructure with new names and descriptions
-- Implements 5-category system: Research, Plan, Create, Connect, Report

-- Create table if it doesn't exist (for preview environments)
CREATE TABLE IF NOT EXISTS agent_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  prompt text NOT NULL,
  tags text[] NOT NULL DEFAULT '{}',
  updated_at timestamp with time zone DEFAULT now()
);

-- Add updated_at trigger if it doesn't exist
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO ''
AS $function$
begin
    new.updated_at = now();
    return NEW;
end
$function$;

DROP TRIGGER IF EXISTS set_updated_at_agent_templates ON agent_templates;
CREATE TRIGGER set_updated_at_agent_templates
  BEFORE UPDATE ON agent_templates
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_updated_at();

-- Basic index for performance
CREATE INDEX IF NOT EXISTS idx_agent_templates_title ON agent_templates(title);

-- Enforce unique titles to avoid duplicate inserts on re-runs
CREATE UNIQUE INDEX IF NOT EXISTS ux_agent_templates_title ON agent_templates(title);

-- Insert original data if table is empty
INSERT INTO agent_templates (title, description, prompt, tags) 
SELECT title::text, description::text, prompt::text, tags::text[] FROM (VALUES
  ('Audience Segmentation', 'Identify and analyze key audience segments for targeted marketing and growth.', '', '{"Research"}'),
  ('Superfan Insights', 'Surface your most engaged listeners for premium engagement and monetization opportunities.', 'Analyze my artist''s fan segments and tell me who our most valuable listeners are. What demographics do they represent, how do they engage with us, and how should we target them in our next campaign? Please provide a downloadable report with actionable recommendations.', '{"Social"}'),
  ('Social Performance Audit', 'Comprehensive analysis of your social channels to inform digital strategy.', 'Give me a complete health check of my artist''s social media presence. Which posts are performing best, what are fans saying in the comments, and how does engagement vary across platforms? Could you create a diagram showing our social ecosystem with specific areas to improve?', '{"Social"}'),
  ('Collaboration Scouting', 'Identify high-potential artist collaborations to expand your roster and reach new audiences.', 'Find compatible artists we could collaborate with for mutual audience growth. Identify where our fanbases overlap and differ, then suggest creative cross-promotion campaigns that would benefit both parties and feel authentic to our respective brands.', '{"A&R"}'),
  ('Tour Strategy', 'Optimize tour routing, venues, and VIP offerings to maximize revenue and fan engagement.', 'We''re planning a tour for next quarter. Based on our streaming data, social engagement, and fan locations, where should we perform to maximize attendance and revenue? What VIP experiences could we offer, and how should we price tickets across different markets?', '{"Tour"}'),
  ('Brand Positioning', 'Strategic recommendations to refine and elevate your artist''s brand in the market.', 'My artist is ready for a brand refresh. Analyze our current perception across platforms, identify opportunities to evolve while staying authentic, and create visual mockups of what our refreshed identity could look like with implementation steps.', '{"Marketing"}'),
  ('Release Optimization', 'Leverage data to maximize the impact and reach of your next release.', 'We''re planning our next release. Analyze how our previous releases performed, what fans said about them, and current trends in our genre. Give me recommendations for the ideal release timing, messaging approach, and platform focus to maximize impact.', '{"Assistant"}'),
  ('Sentiment Analysis', 'Leverage sentiment analysis to shape PR and marketing communications.', 'Analyze the comments on my artist''s recent posts across all platforms. What are fans feeling about our latest release? Are there recurring themes or questions? Create a visual breakdown of the sentiment trends so we can adjust our messaging accordingly.', '{"PR"}'),
  ('Merchandising Strategy', 'Maximize merch revenue through data-driven product and pricing strategies.', 'Analyze what merchandise is selling best for artists in our genre and with our audience demographics. What price points, designs, and limited-edition strategies are working? Create a data-driven merchandise plan that maximizes profit while delighting fans.', '{"Merchandise"}'),
  ('Trend Analysis', 'Spot emerging trends relevant to your brand and audience.', 'What topics are trending right now that my artist could naturally join the conversation about? Look at what''s happening on Twitter, analyze if our fans are already discussing these trends, and suggest content ideas that would feel authentic for us to post. Can you create a document with the best opportunities?', '{"Research"}'),
  ('Instagram Growth Analysis', 'Evaluate follower demographics and engagement to inform content strategy.', 'Dive deep into my artist''s Instagram audience. Who are they, what other content do they engage with, and what potential brand partnerships make sense? Could you create some visual content themes that would resonate with them based on your findings?', '{"Social"}'),
  ('Competitive Benchmarking', 'Compare performance metrics against industry peers and leaders.', 'Research our top 3 competitor artists across Spotify, Twitter, and Instagram. What strategies are working for them? Where do our audiences overlap? Create a detailed report with tactics we can adapt and opportunities to differentiate ourselves.', '{"Research"}'),
  ('Content Calendar Planning', 'Develop a coordinated release and content schedule for maximum engagement.', 'Help me develop a strategic content calendar across all our platforms. Analyze what''s worked best for us in the past, when our audience is most active, and incorporate relevant trending topics. Provide a comprehensive plan we can implement over the next month.', '{"Assistant"}'),
  ('Fan Engagement Strategy', 'Best practices for high-value fan interactions and community management.', 'Review all the comments on our recent Instagram posts and help me develop a response strategy. What questions keep coming up? Which fans should we prioritize engaging with? Create a playbook we can follow for authentic and effective fan interactions.', '{"Social"}'),
  ('Market Expansion', 'Pinpoint high-potential markets for targeted expansion and investment.', 'Identify untapped audience segments that should be fans of our music but aren''t yet. Where are these potential fans having conversations online, what artists do they currently follow, and how can we reach them? Create a visual strategy map for acquiring these new listeners.', '{"Global"}'),
  ('Viral Content Innovation', 'Generate creative concepts with high viral potential based on current trends.', 'Based on my artist''s style and what''s currently going viral in our genre, suggest 5 authentic content ideas that have high viral potential. Analyze trending formats across TikTok, Instagram, and Twitter, but make sure the ideas stay true to our artistic identity. Include a strategy for each concept.', '{"Social"}'),
  ('Brand Partnership Scouting', 'Identify and evaluate potential brand partners for strategic collaborations.', 'Find the perfect brand partnership opportunities for my artist. Analyze our audience demographics, their purchasing habits, and identify brands that share our values. Rank potential partners by fit and revenue potential, with specific collaboration ideas for each.', '{"Marketing"}'),
  ('Spotify Profile Audit', 'Assess and optimize your Spotify presence for maximum discoverability.', 'Help me build a complete and consistent artist profile starting with our Spotify information. Make sure our bio, image, and socials are synchronized across platforms, and suggest playlist strategies based on what''s working for similar artists in our genre.', '{"Marketing"}'),
  ('Merchandising Optimization', 'Refine merchandising approach to maximize sales and fan satisfaction.', 'Analyze what merchandise is selling best for artists in our genre and with our audience demographics. What price points, designs, and limited-edition strategies are working? Create a data-driven merchandise plan that maximizes profit while delighting fans.', '{"Merchandise"}'),
  ('Commerce Funnel Analysis', 'Analyze and optimize the path from content to commerce for increased conversions.', 'Create a strategy that turns our social content into direct sales. Analyze which types of posts drive the most traffic to our shop, identify friction points in our current funnel, and design a seamless path from casual follower to paying customer.', '{"Merchandise"}'),
  ('Trend Participation', 'Strategic guidance for authentic and effective trend participation.', 'What current trends or challenges could my artist authentically participate in that would increase visibility? Don''t just list trends—explain how we could put our unique spin on them, which platforms we should focus on, and how to time our participation for maximum impact.', '{"PR"}'),
  ('Podcast Guest Acquisition', 'Find the right creators to feature on your podcast, build relationships, and send outreach emails that spark collaborations.', 'Find 10 creators in unexpected niches (e.g., glitch fashion, gaming modders, TikTok historians, sports crossovers) who share audience overlap with my brand. For each creator: find their email. If no contact is found, skip them and find a different creator. Draft a personalized email inviting them to be a guest on my podcast. Reference their work, explain why the collaboration makes sense, and suggest a creative topic idea for the episode. Show me all the drafted emails and get my approval before sending any outreach emails.', '{"Podcasts", "Outreach"}'),
  ('Niche Community Infiltration', 'Find overlooked communities that align with your audience, then pitch tailored collaborations to build cultural relevance.', 'Identify 5 hyper-niche communities (e.g., glitch art Discords, solarpunk Reddit threads, biohacking forums, VR modding groups) that share values with my brand. For each: find the moderator/admin contact email. If none, skip and find another. Draft a non corporate outreach email offering to guest-speak, co-host an AMA, or co-create content for their community. Show me all the drafted emails and get my approval before sending any outreach emails.', '{"Community", "Outreach"}'),
  ('Ghibli YouTube Thumbnail Generation', 'Find a strong video with low CTR, create a Ghibli-style thumbnail, and upload it.', 'Analyze my YouTube channel to identify a video with strong content but low click-through rate that needs thumbnail improvements. Create an eye-catching, brand-aligned thumbnail (ghiblified style) with clear focal points, minimal text, and high contrast colors. Show me the thumbnail image and get approval before uploading to YouTube.', '{"YouTube", "Content", "Social", "Assistant"}')
) AS new_data(title, description, prompt, tags)
WHERE NOT EXISTS (SELECT 1 FROM agent_templates LIMIT 1);

-- Now proceed with updates and removals
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
 '{"Connect"}')
ON CONFLICT (title) DO NOTHING;
