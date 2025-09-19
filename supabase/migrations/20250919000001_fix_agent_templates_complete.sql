-- Add new clean agent templates with 5-category system
-- You can manually delete old/duplicate agents from the UI after deployment

INSERT INTO agent_templates (title, description, prompt, tags, creator, is_private, created_at) VALUES

-- RESEARCH CATEGORY (8 agents)
('Find Your Most Valuable Fans', 
 'Identifies your highest-spending fans with demographics and campaign targeting for maximum monetization.',
 'Analyze my artist''s fan segments and tell me who our most valuable listeners are. What demographics do they represent, how do they engage with us, and how should we target them in our next campaign? Please provide a downloadable report with actionable recommendations.',
 ARRAY['Research'], NULL, false, now()),

('Cross-Platform Social Audit', 
 'Complete health check of all your social media platforms with performance analysis and visual improvement diagram.',
 'Give me a complete health check of my artist''s social media presence. Which posts are performing best, what are fans saying in the comments, and how does engagement vary across platforms? Could you create a diagram showing our social ecosystem with specific areas to improve?',
 ARRAY['Research'], NULL, false, now()),

('Instagram Brand Partnership Finder', 
 'Analyzes your Instagram audience to find brand partnership opportunities and creates content themes.',
 'Dive deep into my artist''s Instagram audience. Who are they, what other content do they engage with, and what potential brand partnerships make sense? Could you create some visual content themes that would resonate with them based on your findings?',
 ARRAY['Research'], NULL, false, now()),

('Instagram Comment Response Guide', 
 'Reviews your Instagram comments and tells you which ones to respond to with engagement priorities.',
 'Analyze the comments on my artist''s recent posts across all platforms. What are fans feeling about our latest release? Are there recurring themes or questions? Create a visual breakdown of the sentiment trends so we can adjust our messaging accordingly.',
 ARRAY['Research'], NULL, false, now()),

('Join Trending Conversations', 
 'Finds trending topics your fans are discussing and gives you authentic content ideas to join the conversation.',
 'What topics are trending right now that my artist could naturally join the conversation about? Look at what''s happening on Twitter, analyze if our fans are already discussing these trends, and suggest content ideas that would feel authentic for us to post. Can you create a document with the best opportunities?',
 ARRAY['Research'], NULL, false, now()),

('Copy Your Top 3 Competitors', 
 'Researches your 3 biggest competitors and gives you specific tactics to copy for better performance.',
 'Research our top 3 competitor artists across Spotify, Twitter, and Instagram. What strategies are working for them? Where do our audiences overlap? Create a detailed report with tactics we can adapt and opportunities to differentiate ourselves.',
 ARRAY['Research'], NULL, false, now()),

('Top Performing Content Finder', 
 'Finds your best-performing posts across all platforms to show you what content actually works.',
 'Analyze all my posts across Instagram, Twitter, and YouTube to find my top-performing content. Show me what types of posts get the most engagement, which platforms work best for me, and what patterns I should replicate.',
 ARRAY['Research'], NULL, false, now()),

('Fan Segment Revenue Analysis', 
 'Analyzes your fan segments to show which groups are worth the most money for targeted campaigns.',
 'Create detailed fan segments for my artist and analyze which segments have the highest revenue potential. Show me demographics, spending patterns, and engagement levels so I can focus my marketing on the most valuable fans.',
 ARRAY['Research'], NULL, false, now()),

-- PLAN CATEGORY (7 agents)
('Tour Planning Strategy', 
 'Creates complete tour plan with optimized routing, venue selection, VIP experiences, and pricing strategy.',
 'We''re planning a tour for next quarter. Based on our streaming data, social engagement, and fan locations, where should we perform to maximize attendance and revenue? What VIP experiences could we offer, and how should we price tickets across different markets?',
 ARRAY['Plan'], NULL, false, now()),

('Brand Redesign with Visual Mockups', 
 'Analyzes your current brand perception and creates visual mockups of your refreshed identity with implementation steps.',
 'My artist is ready for a brand refresh. Analyze our current perception across platforms, identify opportunities to evolve while staying authentic, and create visual mockups of what our refreshed identity could look like with implementation steps.',
 ARRAY['Plan'], NULL, false, now()),

('Release Launch Strategy', 
 'Analyzes your past releases and creates timing, messaging, and platform strategy for maximum impact.',
 'We''re planning our next release. Analyze how our previous releases performed, what fans said about them, and current trends in our genre. Give me recommendations for the ideal release timing, messaging approach, and platform focus to maximize impact.',
 ARRAY['Plan'], NULL, false, now()),

('Content Calendar Creator', 
 'Develops strategic monthly content calendar across all platforms with posting schedule and trending topics.',
 'Help me develop a strategic content calendar across all our platforms. Analyze what''s worked best for us in the past, when our audience is most active, and incorporate relevant trending topics. Provide a comprehensive plan we can implement over the next month.',
 ARRAY['Plan'], NULL, false, now()),

('Find New Fans Visual Map', 
 'Identifies untapped audience segments and creates visual map showing where to find and acquire new listeners.',
 'Identify untapped audience segments that should be fans of our music but aren''t yet. Where are these potential fans having conversations online, what artists do they currently follow, and how can we reach them? Create a visual strategy map for acquiring these new listeners.',
 ARRAY['Plan'], NULL, false, now()),

('Merchandise Strategy Plan', 
 'Analyzes successful merch in your genre and creates data-driven product plan with pricing and design recommendations.',
 'Analyze what merchandise is selling best for artists in our genre and with our audience demographics. What price points, designs, and limited-edition strategies are working? Create a data-driven merchandise plan that maximizes profit while delighting fans.',
 ARRAY['Plan'], NULL, false, now()),

('Social Posts to Shop Sales Strategy', 
 'Creates strategy to convert your social media posts into direct shop sales with friction analysis.',
 'Create a strategy that turns our social content into direct sales. Analyze which types of posts drive the most traffic to our shop, identify friction points in our current funnel, and design a seamless path from casual follower to paying customer.',
 ARRAY['Plan'], NULL, false, now()),

-- CREATE CATEGORY (5 agents)
('5 Viral Content Ideas', 
 'Analyzes current viral trends and gives you 5 authentic content ideas with high viral potential and platform strategies.',
 'Based on my artist''s style and what''s currently going viral in our genre, suggest 5 authentic content ideas that have high viral potential. Analyze trending formats across TikTok, Instagram, and Twitter, but make sure the ideas stay true to our artistic identity. Include a strategy for each concept.',
 ARRAY['Create'], NULL, false, now()),

('Update YouTube Thumbnails', 
 'Finds your low-performing videos and creates new eye-catching thumbnails to improve click-through rates.',
 'Analyze my YouTube channel to identify a video with strong content but low click-through rate that needs thumbnail improvements. Create an eye-catching, brand-aligned thumbnail (ghiblified style) with clear focal points, minimal text, and high contrast colors. Show me the thumbnail image and get approval before uploading to YouTube.',
 ARRAY['Create'], NULL, false, now()),

('Corporate Partnership Finder', 
 'Analyzes your audience to find perfect brand partnership opportunities ranked by revenue potential.',
 'Find the perfect brand partnership opportunities for my artist. Analyze our audience demographics, their purchasing habits, and identify brands that share our values. Rank potential partners by fit and revenue potential, with specific collaboration ideas for each.',
 ARRAY['Create'], NULL, false, now()),

('Spotify Profile Optimization', 
 'Optimizes your Spotify profile with cross-platform synchronization and playlist strategy recommendations.',
 'Help me build a complete and consistent artist profile starting with our Spotify information. Make sure our bio, image, and socials are synchronized across platforms, and suggest playlist strategies based on what''s working for similar artists in our genre.',
 ARRAY['Create'], NULL, false, now()),

('Spotify Playlist Placement Finder',
 'Finds playlists your music should be on for maximum streams and discovery.',
 'Research playlists in my genre and style that would be perfect for my music. Find playlist curators, analyze submission requirements, and give me a strategy for getting my songs placed on high-impact playlists.',
 ARRAY['Create'], NULL, false, now()),

-- CONNECT CATEGORY (6 agents)
('Artist Cross-Promotion Finder', 
 'Finds compatible artists for mutual audience growth with fanbase overlap analysis and campaign ideas.',
 'Find compatible artists we could collaborate with for mutual audience growth. Identify where our fanbases overlap and differ, then suggest creative cross-promotion campaigns that would benefit both parties and feel authentic to our respective brands.',
 ARRAY['Connect'], NULL, false, now()),

('10 Podcast Guest Email Templates', 
 'Finds 10 niche creators with audience overlap and writes personalized podcast invitation emails ready to send.',
 'Find 10 creators in unexpected niches (e.g., glitch fashion, gaming modders, TikTok historians, sports crossovers) who share audience overlap with my brand. For each creator: find their email. If no contact is found, skip them and find a different creator. Draft a personalized email inviting them to be a guest on my podcast. Reference their work, explain why the collaboration makes sense, and suggest a creative topic idea for the episode. Show me all the drafted emails and get my approval before sending any outreach emails.',
 ARRAY['Connect'], NULL, false, now()),

('5 Community Partnership Email Templates', 
 'Identifies 5 hyper-niche communities aligned with your brand and writes collaboration emails ready to send.',
 'Identify 5 hyper-niche communities (e.g., glitch art Discords, solarpunk Reddit threads, biohacking forums, VR modding groups) that share values with my brand. For each: find the moderator/admin contact email. If none, skip and find another. Draft a non corporate outreach email offering to guest-speak, co-host an AMA, or co-create content for their community. Show me all the drafted emails and get my approval before sending any outreach emails.',
 ARRAY['Connect'], NULL, false, now()),

('Add Your Spin to Trends', 
 'Shows you how to authentically participate in current trends with unique angle strategies and optimal timing.',
 'What current trends or challenges could my artist authentically participate in that would increase visibility? Don''t just list trends—explain how we could put our unique spin on them, which platforms we should focus on, and how to time our participation for maximum impact.',
 ARRAY['Connect'], NULL, false, now()),

('Weekly Potential Fan Finder',
 'Analyzes lookalike artists and finds their followers who would likely become your fans, delivered weekly via email.',
 'Set up weekly potential fan discovery for my artist. Find lookalike artists and niche creators in my space, analyze their followers and commenters, then email me every week with clickable handles of people who would likely become my fans so I can engage with them.',
 ARRAY['Connect'], NULL, false, now()),

('Comment Response Priority List',
 'Tells you exactly which comments across all platforms to respond to first for maximum engagement impact.',
 'Analyze all the comments on my recent posts across Instagram, YouTube, and Twitter. Tell me which comments I should prioritize responding to based on the commenter''s influence, engagement potential, and likelihood to become a valuable fan.',
 ARRAY['Connect'], NULL, false, now()),

-- REPORT CATEGORY (3 agents)
('YouTube Revenue Report', 
 'Gets your actual YouTube revenue data and video performance metrics in an easy-to-read report.',
 'Show me my YouTube revenue data for the past month. Include total earnings, top-performing videos, and revenue trends. I want to see which videos are making the most money and how my channel is performing financially.',
 ARRAY['Report'], NULL, false, now()),

('Weekly Performance Dashboard', 
 'Sets up automated weekly reports of your performance across all platforms delivered to your email.',
 'Set up a weekly performance dashboard that emails me every Monday with my stats from all platforms - YouTube revenue, Spotify streams, Instagram engagement, and Twitter activity. I want to see week-over-week changes and top-performing content.',
 ARRAY['Report'], NULL, false, now()),

('Weekly Release Reports', 
 'Tracks a specific song release with automated weekly performance reports sent to your email.',
 'I need weekly tracking reports for my song release. What''s the exact song title you want me to track? I''ll monitor its performance on YouTube and Spotify and email you weekly updates with view counts, stream numbers, and engagement data.',
 ARRAY['Report'], NULL, false, now())

ON CONFLICT (title) DO NOTHING;
