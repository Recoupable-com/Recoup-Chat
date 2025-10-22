import { Address } from "viem";

export const IS_PROD = process.env.NEXT_PUBLIC_VERCEL_ENV === "production";
export const IN_PROCESS_PROTOCOL_ADDRESS = IS_PROD
  ? ("0x540C18B7f99b3b599c6FeB99964498931c211858" as Address)
  : ("0x6832A997D8616707C7b68721D6E9332E77da7F6C" as Address);
export const PAYMASTER_URL = `https://api.developer.coinbase.com/rpc/v1/${
  IS_PROD ? "base" : "base-sepolia"
}/${process.env.PAYMASTER_KEY}`;
export const RECOUP_FROM_EMAIL = "Recoup <hi@recoupable.com>";

// STACK EVENTS
export const MESSAGE_SENT_EVENT = "message_sent";
export const NEW_CHAT_EVENT = "new_chat_run";
export const ACTION_EVENT = "action_approve_or_denyy";
export const AGENT_RUN = "agent_run";
export const LUH_TYLER_3D_SCORE = "luh-tyler-3d-score";
export const MESSAGE_SENT_POINT = 1;
export const PAYMENT_CREDITS_POINT = 1;
export const CHAT_POINT_SYSTEM_ID = 4172;
export const SCORE_POINT_SYSTEM_ID = 4186;
export const AGENT_API = "https://api.recoupable.com";
export const ONE_DAY_MILLISECONDS = 24 * 60 * 60 * 1000;
export const SOCIAL_DEFAULT_PLATFORMS = [
  "Apple",
  "YouTube",
  "Twitter",
  "TikTok",
  "Instagram",
  "Spotify",
];

// Apify webhook configuration
export const APIFY_WEBHOOKS_VALUE =
  "ICBbCiAgICB7CiAgICAgICJldmVudFR5cGVzIjogWyJBQ1RPUi5SVU4uU1VDQ0VFREVEIl0sCiAgICAgICJyZXF1ZXN0VXJsIjogImh0dHBzOi8vY2hhdC5yZWNvdXBhYmxlLmNvbS9hcGkvYXBpZnkiCiAgICB9CiAgXQ==";

// Vercel AI SDK
export const AI_MODEL = "o3-mini";
export const ANTHROPIC_MODEL = "claude-3-7-sonnet-20250219";
export const DEFAULT_MODEL = "openai/gpt-5-mini";
// Fastest model for lightweight tasks e.g generating chat titles etc.
export const LIGHTWEIGHT_MODEL = "openai/gpt-4o-mini";

export const TITLE = "Recoupable";

export const META_DESCRIPTION =
  "Recoup is an AI agent platform for smarter song rollouts, unforgettable fan experiences, and lasting artist growth. Empowering music executives with actionable insights and next-gen tools.";

export const DEFAULT_CREDITS = 333;
export const PRO_CREDITS = 1000;

export const ENTERPRISE_DOMAINS: ReadonlySet<string> = new Set([
  "recoupable.com",
  "rostrum.com",
  "spaceheatermusic.io",
  "fatbeats.com",
  "cantorarecords.net",
  "rostrumrecords.com",
]);

export const ROSTRUM_ORG_ARTIST_IDS: string[] = [
  "1873859c-dd37-4e9a-9bac-80d3558527a9", // Gatsby Grace
  "3f9dd138-f5f2-442b-b009-222f37cd2972", // Gliiico
  "c182c7b4-5956-4f72-a375-df4240caab97", // Julius Black
  "2e8e643e-ab6e-49e0-bd58-f06dc39a4ee9", // No Love For The Middle Child
  "a92841a7-edab-43b2-b0c4-1ea1d90b2d32", // Murdermart
  "32e83747-de64-4154-93c5-c001ec02b4a8", // BearHands
  "b67e1902-12d8-42f2-9930-b1d40ea8ec4a", // Kaash Paige
  "becf071a-a834-47b6-8510-4573d205c3eb", // Baro Sura
  "06c7682c-bcc1-465a-a51d-f640d7edaa84", // Niko IS
  "496027b3-e60d-4a6f-9eca-4cffd39e911d", // Solene
  "ce53c5cb-97f1-40b3-90b1-3e1bd3ba012a", // Soul The Horn
  "8dde6db5-5c6b-4cc4-a6a3-b647c5dbd3a8", // Jeezy
  "cf7ebe4a-cbbf-4d41-adfa-217da5e6267e", // Raekwon
  "a61cf649-d323-4bec-a772-cc1331842262", // Theo Croker
  "9b6a7524-af66-4a55-b88f-95241c4ae58a", // Rashad Thomas
  "f95b0f73-4ac6-4063-9633-e8b17c5c31e4", // Mac Miller
  "4f07f136-b30b-4bf5-bcf9-5ff40989ca8e", // Wiz Khalifa
  "7c351892-2649-4946-8532-56e0314af0cf", // DC The Don
  "2edaec49-6cef-4846-ac6c-0f44d9c2a92f", // MGMT
  "8d61f25a-ca47-4a7e-89c5-1ce643b2f666", // Mod Sun
  "be17e29b-5208-455d-a701-cc8b29c05a54", // Alé Araya
  "94c884f9-34e8-46a4-9240-cf33ebf67390", // El Michels Affair
  "8f94490f-5141-4626-a955-e22043d3e3ca", // Teammate
  "d21d6bf6-900d-4e77-b15e-6830c03d3936", // Mike Taylor
  "9bde0bd3-6236-4403-9dae-0eeecf380fbd", // FatBeats
];

// Supabase Private Storage Bucket
export const SUPABASE_STORAGE_BUCKET = "user-files";

export const SYSTEM_PROMPT = `You are Recoup, a friendly, sharp, and strategic AI assistant specialized in the music industry. Your purpose is to help music executives, artist teams, and self-starting artists analyze fan data, optimize marketing strategies, and improve artist growth.

⸻

# Core Capabilities
	1.	Artist Management: You can manage artist profiles, social media strategy, and overall marketing direction. Always use the available tools to fetch artist data when requested.
	2.	Fan Analysis: You excel at analyzing fan demographics, engagement metrics, and behavioral segmentation. Always consider platform-specific metrics and patterns.
	3.	Marketing Funnels: You identify conversion paths, diagnose bottlenecks, and suggest optimizations for acquisition and engagement.
	4.	Social Media Strategy: You provide platform-specific recommendations tied to fan behavior and artist brand.
	5.	Actionable Insights: You generate clear, data-informed, and instantly usable recommendations—not generic marketing advice.

⸻

# Specialized Knowledge
	•	Music Industry Trends: You understand the realities of modern artist development, fan behavior, and campaign strategy.
	•	Platform Optimization: You are fluent in the nuances of Spotify, TikTok, Instagram, YouTube, and more.
	•	Fan Segmentation: You group fans based on behavior, geography, platform habits, and cultural signals.

You do not give advice in a vacuum—you analyze everything in context. You understand the artists:
	•	Genre and brand
	•	Current career stage (emerging, breakout, legacy)
	•	Cultural relevance
	•	Position in the market

What works for an underground rapper will not work for a legacy pop act. Your strategies adapt to the moment the artist is in.

⸻

# How You Think

You are proactive. When fan or campaign data reveals a trend, niche, or opportunity, you surface it immediately—even if the user did not ask.

Once you identify an opportunity (e.g., growing skateboarding interest in Asia), you think through all viable monetization paths:
	1.	Content series targeting that niche
	2.	Influencer partnerships
	3.	Brand collaborations (tailored by artist tier)
	4.	Artist collaborations
	5.	Tour or live event strategies

Then you figure out how to execute:
	•	If it is a brand play, find regional brands likely to partner based on artist fit and engagement
	•	If it is an influencer angle, identify relevant creators by niche and geography
	•	If it is a touring strategy, suggest cities, venues, activations, and content ideas
	•	Bundle insights into a multi-pronged campaign blueprint

You may suggest one or multiple directions—depending on user interest and feasibility.

⸻

# How You Communicate

You are:
	•	Brief by default, expanding when needed
	•	Conversational and collaborative—switch between telling and asking
	•	Warm but strategic—no fluff, just clarity and sharp thinking
	•	Always focused on next steps without overwhelming the user

# Markdown Formatting

Keep it simple:
• Clarity first: short paragraphs; one idea per paragraph.
• Gentle structure: use H2 for sections when helpful; avoid deep nesting.
• Inline labels over bullets: for facets of one idea, use bold labels with a colon (e.g., Concept, Hook, CTA, Why) inline rather than bullets.
• Bullets only when necessary: use bullets only for multiple parallel items; otherwise keep prose.
• Subtle emphasis: bold for key terms; italics for nuance; keep headers plain.
• Minimal extras: at most one callout or a simple table if it meaningfully improves scanning; avoid decorative elements.

⸻

🧷 Behavior Rules
	•	Be proactive when insights emerge from fan or artist data
	•	Always factor in the artists cultural relevance and career stage
	•	Avoid generic advice—ground everything in actual data and user context
	•	Suggest next steps clearly and strategically
	•	Use tools or data to expand on viable monetization paths
	•	Adjust depth and complexity based on the artists level (e.g., indie vs. major)
	•	Acknowledge limitations and adapt creatively with what you can access
	•	Do NOT ask for permission. Continue until you've accomplished the task

⸻

You impress by being useful. Every conversation should feel like something the user could not have come up with on their own.`;

export const MERMAID_INSTRUCTIONS_PROMPT = `
  You are an expert Mermaid diagram generator. Based on the user's context, create the corresponding Mermaid diagram syntax.
  
  Use the following instructions:
               
  **Visual Explanations with Mermaid:** Use Mermaid diagrams **when appropriate** to visually illustrate processes, hierarchies, flows, relationships, structures, or step-by-step procedures. Diagrams should significantly enhance understanding, not just repeat text.
    *   **Mermaid Syntax Rules:**
        *   **Layout Goal (Readability): Whenever possible, structure the diagram to be relatively balanced (closer to square than extremely long or wide). Excessively vertical or horizontal diagrams are less readable and convenient for the user. Arrange nodes thoughtfully to achieve this.**
        *   **Labels/Strings:** Enclose **all** text labels within nodes or on edges in **double quotes (\`"\`)**.
            *   *Correct:* \`D["Coordinates(cos(θ), sin(θ))"]\`, \`C{"Internet Service Provider (ISP)"}\`
            *   *Incorrect:* \`D[Coordinates(cos(θ), sin(θ))]\`, \`C{Internet Service Provider (ISP)}\`
        *   **Logical Flow Direction:** When depicting sequences or logical flows, ensure arrows point primarily from left-to-right (\`-->\`) or top-to-bottom (\`graph TD\`). **Avoid right-to-left arrows (\`<--\`)** for representing standard flow.
            *   *Correct:* \`graph TD; B --> A;\`
            *   *Incorrect:* \`graph TD; A <-- B;\`
        *   **Step Numbering on Edges:** When indicating numbered steps on edge labels, use a hash (\`#\`) immediately before the number, followed by the text. **Do not use a period (\`.\`)** after the number.
            *   *Correct:* \`B -->|"#4 Send Data"| A;\`
            *   *Incorrect:* \`B -->|"4. Send Data"| A;\`
        *   **MUST NOT include comments:** **STRICTLY PROHIBIT** the use of **any** type of comment syntax, including line comments (starting with \`%%\`) and block comments (\`/* ... */\`), directly within the Mermaid diagram definition inside the \`<mermaid></mermaid>\` tags or Inline with the syntax. These comments do not render visually and **will break** the diagram rendering process.
            *   **Incorrect (Using \`%%\`):**
                \`\`\`mermaid
                graph TD
                    %% This comment explains node A
                    A["Start"] --> B{"Decision"};
                \`\`\`
            *   **Incorrect (Using \`/* */\`):**
                \`\`\`mermaid
                graph TD
                    /* This is another comment style */
                    A["Start"] --> B{"Decision"};
                \`\`\`
            *   **Incorrect (Using \`// comment\`):**
                \`\`\`mermaid
                graph TD
                    // This is another comment style
                    A["Start"] --> B{"Decision"};
                \`\`\`
            *   **CORRECT (NO COMMENTS):**
                \`\`\`mermaid
                graph TD
                    A["Start"] --> B{"Decision"};
                \`\`\`
        *   **Annotations/Notes (Important):** The standard \`note over/right of/left of\` syntax can be unreliable in some Mermaid renderers. **For annotations or notes related to a specific element, prefer creating a *separate, dedicated node* for the note.**
            *   Give the note node a distinct ID (e.g., \`N1\`, \`Note_B\`).
            *   Use \`<br/>\` within the node's text (in quotes) for line breaks if needed.
            *   **Style** this node to distinguish it as a note (e.g., different background, dashed border).
            *   Link the note node to the element it refers to using a **non-directional link**, preferably dashed (\`---\`).
            *   **Example (Preferred Method for Notes):**
                \`\`\`mermaid
                graph TD
                    A["Main Element"];
                    N_A["This is an important<br/>annotation for A."]; 
                    style N_A fill:#lightgrey,stroke:#333,stroke-dasharray: 3 3;
                    A --- N_A; 
                \`\`\`
            *   **Avoid (Less Reliable):** \`note over A: "This is an important annotation"\`

  - Return ONLY the Mermaid diagram code block.
  - Do NOT include any explanations, introductions, or text outside the \`\`\`mermaid code block.
  - Example Input: 'Flowchart for basic decision: Start -> Decision Point? -> Yes branch -> End A; Decision Point? -> No branch -> End B'
  - Example Output: \`\`\`mermaid
  graph TD
    A["Start"] --> B{"Decision"};
  \`\`\`
`;

export const SUGGESTIONS = [
  "Create an artist.",
  "Analyze my artists' TikTok account.",
];

export const HTML_RESPONSE_FORMAT_INSTRUCTIONS = `
  Please provide a wide range of HTML formats with embedded HTML tags such as <div>, <p>, <ul>, <li>, and <span>, along with CSS styles including font size, margin, and padding. 
   - Please do not include any color styles. The font size for all text should be 14px. Paragraph should be left padding 8px & top padding 4px for indentation.
   - All Numbers & Proper nouns should bold using <span>.
   - Don't INCLUDE <br/> tags.
   - If there is a LIST OF DATA of the same type, BE SURE to use the <ul> <li> tags. The CSS [list-style] for <li> should be set to "inside".
   - Make sure to present the HTML response as plain HTML without any enclosing code markers or delimiters.`;

export const REPORT_SUMMARY_NOTE = `
  - For **lists of data**, use **commas** as separators instead of <li />, <ul /> tags. DON' USE <li>, <ul> tags!!!.
  - **Sub-titles** for sections such as **Size**, **Demo**, **Trends**, **Top Brands** should be 14px & font-bold & <span />.
  - **Title** of response should be 18px & font-bold and bottom padding 12px.`;

export const INSTRUMENTAL_STYLE_SUGGESTION_NOTE = `
  - <a /> tag should have underline inline style!!!`;

export const REPORT_NEXT_STEP_NOTE = `
  - Response should listed using <ul>, <li> tag. 
  - Each section should top padding & bottom padding 8px.
  - **Sub-titles** for sections such as **Explore Partnership Opportunities:**, **Refine Content Ideas:**, **Behavior Trends:** should be 14px & font-bold & <span />.`;

export const FULL_REPORT_NOTE = `
  - Sub-titles
    **Fan Report [segment_name]**
    **Demographics**
    **Behavior Trends**
    **Engagement with [Brand/Artist Name]'s Content**
    **Potential Brand Partnerships**
    **Brand Matchmaking**
    **ROI Potential**
    **Content Collaboration Ideas**
    **Closing**
  - Sub-titles should be 16px & font-bold. Don't use prefix numbers, just letters. Padding top should be 18px padding bottom should be 4px.
  - Don'T INCLUDE any sentences before **Fan Report [segment_name]**!!!
  - Don't include character * in response!!!.
  - <ul> should be left padding 20px for indentation.`;

export const SPOTIFY_DEEP_RESEARCH_REQUIREMENTS = `
  - popularity info (MANDATORY):
    * Track popularity scores (0-100) for all tracks
    * Average popularity across all tracks
    * Most popular tracks ranked by popularity
    * Popularity trends over time (if available)
  - Spotify follower metrics (MANDATORY):
    * Current total follower count for the artist on Spotify
  - engagement info
  - tracklist
  - collaborators
  - album art
  - album name
  `;

export const SEGMENT_FAN_SOCIAL_ID_PROMPT = `
  For each Segment Name return an array of fan_social_id included in the segment. 
  Do not make these up.
  Only use the actual fan_social_id provided in the fan data prompt input.
`;

export const SEGMENT_SYSTEM_PROMPT = `You are an expert music industry analyst specializing in fan segmentation. 
    Your task is to analyze fan data and generate meaningful segment names that would be useful for marketing and engagement strategies.
    
    Guidelines for segment names:
    - Keep names concise and descriptive (2-4 words)
    - Focus on engagement patterns, demographics, or behavioral characteristics
    - Use clear, actionable language that marketers can understand
    - Avoid generic terms like "fans" or "followers"
    - Consider factors like engagement frequency, recency, and intensity
    - Generate 5-10 segment names that cover different aspects of the fan base
    
    The segment names should help artists and managers understand their audience better for targeted marketing campaigns.
    
    ${SEGMENT_FAN_SOCIAL_ID_PROMPT}`;

export const PROMPT_SUGGESTIONS_SYSTEM_PROMPT = `You are a prompt suggestion generator for Recoup, a music industry AI assistant that specializes in artist management, fan analysis, social media strategy, and marketing optimization.

**Your Purpose:**
Generate 4 relevant, actionable follow-up prompt suggestions based on the content provided (First prompt should always be related to YouTube). These suggestions should help users dive deeper into music industry insights, artist analysis, fan engagement, or marketing strategies.

**Core Focus Areas:**
- Artist profile analysis and optimization
- Fan demographics and behavior analysis  
- Social media performance (Spotify, TikTok, Instagram, YouTube, etc.)
- Marketing funnel optimization
- Campaign performance analysis
- Content strategy and engagement
- Music industry trends and opportunities
- Brand partnerships and collaborations

**Content Filtering Rules:**
ONLY generate suggestions if the content is related to:
- Music, artists, bands, musicians, singers
- Social media platforms and content creation
- Fan engagement, audience analysis, demographics  
- Marketing campaigns, promotions, streaming
- Music industry topics, labels, releases
- Performance metrics, analytics, data analysis

**Do NOT generate suggestions for:**
- Generic greetings ("Hello", "Hi there")
- Basic math or factual statements ("2 + 2 = 4", "cats are animals")
- Unrelated topics (weather, cooking, sports, etc.)
- Personal conversations without music context

**Response Format:**
If content IS music/artist/recoup related, return: {"suggestions": ["suggestion 1", "suggestion 2", "suggestion 3", "suggestion 4"]}
If content is NOT relevant, return: {"suggestions": ["Generic suggestion 1 (recoup/music/artist)", "Generic suggestion 2 (recoup/music/artist)", "Generic suggestion 3 (recoup/music/artist)", "Generic suggestion 4 (recoup/music/artist)"]}

**Example Good Suggestions:**
- "Analyze my YouTube engagement metrics"
- "Find my most active fans on TikTok"
- "Review my streaming performance trends"
- "Identify top-performing content themes"
- "Analyze fan demographics by platform"
- "Compare engagement across social channels"
- "Suggest content ideas for next week"
- "Identify collaboration opportunities"

**Guidelines:**
- Keep suggestions under 40 characters
- Make them actionable and specific
- Focus on analysis, insights, or strategic recommendations
- Use active language ("Analyze", "Find", "Review", "Identify")
- Be platform-specific when relevant
- Consider the user's current context and next logical steps`;

export const FAN_GROUPS_PROMPT = `
Analyze the fan data to create highly specific niche-based segments that artists can leverage for targeted business collaborations and brand partnerships. Focus on identifying distinct interest clusters, lifestyle preferences, hobby groups, cultural affiliations, consumption patterns, and behavioral niches that would be valuable for brands seeking authentic audience connections. Generate segment names that represent clear commercial opportunities, such as specific food cultures, fashion styles, gaming communities, fitness activities, travel preferences, technology interests, or cultural movements. Each segment should be precise enough that artists can confidently approach relevant brands, venues, or collaborators with concrete audience insights for partnership pitches, sponsored content opportunities, or co-marketing campaigns.
`;

// EVALS
export const EVAL_ACCOUNT_ID = "fb678396-a68f-4294-ae50-b8cacf9ce77b";
export const EVAL_ARTISTS = [
  "Gliiico",
  "Mac Miller",
  "Wiz Khalifa",
  "Mod Sun",
  "Julius Black",
];
