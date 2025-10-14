import { Eval } from "braintrust";
import { AnswerCorrectness } from "autoevals";
import { callChatFunctions } from "@/lib/evals";

/**
 * Search Web Tool Evaluation
 *
 * This evaluation tests whether the searchWeb tool properly uses Perplexity's API
 * to fetch accurate, up-to-date information from the web and returns factual responses
 * with proper citations. It focuses on current events, recent releases, and factual data
 * that requires web search capabilities.
 *
 * Run: npx braintrust eval evals/search-web-tool.eval.ts
 */

Eval("Search Web Tool Evaluation", {
  data: () => [
    {
      input: "What are the latest music industry trends for 2025?",
      expected: `The latest music industry trends for 2025 include several transformative shifts driven by technology, changing listener habits, and new genre developments.

## Key Trends in 2025 Music Industry

- Music is increasingly defined by moment and mood rather than strict genres, with a rise in unique and bold styles that break mainstream formulas. Musicians no longer need to conform to established molds to find success, aided by viral social media and streaming algorithms.
- Generative AI tools are becoming integrated into music production workflows, enabling new creative possibilities and disrupting formulaic genres.
- An aesthetic shift toward "dirty" and authentic sounds is emerging, especially in pop music.
- Social media continues to birth new music formats tailored for short-video consumption, influencing how music is created and marketed.
- Live music is gaining even more value despite the rise of digital platforms.
- Sync licensing revenue is growing, fueled by demand from streaming services and gaming. There's a shift away from just "sync-friendly" music toward originality and emotional impact in sync selections. Hip-Hop, R&B, Indie, Electronic, Latin, and Retro genres are notably popular for sync.
- AI-powered tools are helping music supervisors sift through the ever-expanding catalogs to find sync-ready music.
- Blockchain technology is expected to significantly reshape music publishing by enhancing transparency, rights management, and faster royalty payments, empowering artists.
- Distribution models are shifting toward direct-to-fan platforms like Bandcamp and Patreon, allowing artists greater control and profit retention.
- Micro-genres and niche musical styles are increasingly gaining focus, supported by enhanced artist data analytics to understand listener behavior better.
- Despite challenges like slowing streaming growth and high concert ticket prices, the industry continues evolving with innovation in AI and broader artist diversity.

Dance music specifically shows signs of a softening trend with the rise of slower, groove-focused styles versus the previous half-decade's faster, aggressive beats.
These trends collectively indicate a music industry in 2025 that is more diverse, technology-driven, artist-empowered, and tuned to new consumption patterns driven by social media, AI, and fan-direct engagement.`,
      metadata: {
        category: "industry_trends",
        expected_tool_usage: true,
        data_type: "current_events",
        requires_web_search: true,
      },
    },
    {
      input: "What happened at the 2025 Grammy Awards?",
      expected: `The 2025 Grammy Awards (67th edition) were historic for several reasons: Beyoncé finally won Album of the Year—the top prize she had long been denied—and became the first Black woman to win Best Country Album, while Kendrick Lamar swept major rap categories with his song "Not Like Us". Sabrina Carpenter took home Album of the Year, Shakira won Best Latin Pop Album, and Chappell Roan was named Best New Artist, bringing dazzling performances and activism to the stage.

67th Annual Grammy Awards
Key Moments and Milestones:

Beyoncé's double win for "Cowboy Carter" marked a breakthrough for Black artists in country music—her astonished reaction and acceptance speech are already iconic.

Kendrick Lamar dominated with "Not Like Us," winning five Grammys (including record and song of the year); his diss track for Drake became an anthem for Los Angeles in light of recent wildfires, and the awards focused heavily on fundraising for wildfire victims.

Chappell Roan delivered a theatrical performance of "Pink Pony Club" featuring queer and rodeo themes. She urged record labels to provide fair wages and healthcare for emerging artists.

Shakira, winning Best Latin Pop Album, dedicated her award to immigrants and made a passionate speech about supporting immigrant communities in the US.

The Weeknd ended his Grammy boycott, returning for a surprise performance and opening dialogue about Academy diversity.

Janelle Monáe led a moving tribute to Quincy Jones, joined by Cynthia Erivo, Herbie Hancock, and Stevie Wonder, with Taylor Swift supporting the tribute.

Sabrina Carpenter was recognized with Album of the Year, highlighting the ceremony’s focus on new voices.

Show Format:

The ceremony, organized by Trevor Noah, had a telethon-like format to support victims of Los Angeles wildfires, with frequent calls for donations and themed performances.

Fashion and pop culture moments, such as Miley Cyrus's bold dress and Chappell Roan's art-inspired gown, stood out on the red carpet.

What stood out and why it matters:

This year's Grammys were notable for historic wins, genre-crossing breakthroughs, and activism onstage. Beyoncé’s recognition for both country and overall album marked a cultural milestone for Grammy representation, while Lamar’s wins reinforced the ceremony's relevance to contemporary social issues. The spotlight on fundraising and artist advocacy set a new precedent for the event’s purpose and public engagement, and star performances from the likes of Sabrina Carpenter, Chappell Roan, and Shakira signaled a shift toward fresh voices and more inclusive storytelling.`,
      metadata: {
        category: "awards",
        expected_tool_usage: true,
        data_type: "current_events",
        requires_web_search: true,
      },
    },
    {
      input:
        "What are the current Spotify streaming numbers for Bad Bunny's latest album?",
      expected: `Bad Bunny's latest album titled "DeBÍ TiRAR MáS FOToS," released in 2025, currently has around 1.07 billion streams on Spotify. His previous album "Un Verano Sin Ti" has over 20.6 billion streams on Spotify, making it one of the most streamed albums on the platform as of late 2025.`,
      metadata: {
        category: "streaming_data",
        expected_tool_usage: true,
        data_type: "current_streaming_stats",
        requires_web_search: true,
      },
    },
    {
      input: "What new albums were released in January 2025?",
      expected: `In January 2025, several notable albums were released across various genres. Key releases include:

- The Weeknd's album "Hurry Up Tomorrow," released on January 24, which was accompanied by a tour and a related film debut scheduled for May 16, 2025.
- Lil Baby's album "WHAM (Who Hard As Me)," released on January 3, featuring collaborations with artists like Young Thug, Future, Travis Scott, and production from prominent producers such as Southside and Wheezy.
- Mac Miller's posthumous album "Balloonerism," released on January 17, with 14 tracks recorded over a decade ago and officially released in 2025.
- Bad Bunny's album "Debí Tirar Más Fotos," released on January 5.
- Ethel Cain's album "Perverts," released on January 8.
- Franz Ferdinand's album "The Human Fear," released on January 10.
- Ringo Starr's album "Look Up," released on January 10.

Other notable releases include albums and EPs by Ellis King, Lambrini Girls, Mon Rovîa, Moonchild Sanelly, Tremonti, and several others across different music styles.

There were also albums highlighted for their quality and range, from introspective hip-hop to dance-pop with influences from artists like Björk and Radiohead.

This January lineup showcased a mix of established artists and emerging talent, setting the tone for music in 2025.`,
      metadata: {
        category: "releases",
        expected_tool_usage: true,
        data_type: "recent_releases",
        requires_web_search: true,
      },
    },
    {
      input: "What are the latest developments in music streaming technology?",
      expected: `The latest developments in music streaming technology in 2025 center around advanced AI-driven personalization, high-resolution (hi-res) and lossless audio streaming, integration of blockchain for direct artist payments, and emerging AI detection tools for identifying AI-generated music.

### AI-Driven Personalization and Contextual Experiences
Music streaming platforms use AI and machine learning to create hyper-personalized listening experiences, understanding not only users' preferences but also contextual factors like mood, activity, and time of day. This allows apps to offer playlists and recommendations tailored specifically to each unique moment, going beyond traditional genre or artist-based suggestions. Features like AI DJs and AI-powered remixing tools are part of this trend, enhancing user engagement and creating a more dynamic discovery process.

### Enhanced Audio Quality with Hi-Res and Lossless Streaming
There is growing demand and broader availability of high-resolution audio streaming, delivering superior sound quality to listeners. Major platforms including Apple Music, Amazon Music, and TIDAL offer hi-res and spatial audio options, while Spotify is launching its long-awaited Spotify HiFi tier with lossless streaming as part of a new premium subscription add-on called "Music Pro." This trend reflects an industry-wide move toward premium sound experiences especially valued by audiophiles.

### Blockchain Integration for Fair Artist Compensation
Blockchain technology is being adopted by platforms like Audius to provide decentralized and transparent music distribution, allowing artists to sell music directly to fans and receive payments via smart contracts without intermediaries. This innovation is beginning to reshape the economic model of music streaming with more direct artist-fan engagement and fair compensation.

### AI Music Detection and Content Integrity
With the rise of AI-generated music, platforms like Deezer have implemented AI detection tools to identify and tag artificially created music tracks. For example, Deezer found that approximately 10% of daily uploads were fully AI-generated and plans to exclude such content from algorithmic recommendations to preserve platform integrity. Tools like Ircam Amplify's AI Music Detector achieve high accuracy in distinguishing human and AI music, which is vital for protecting artists' rights and ensuring fair revenue distribution.

### Other Emerging Trends
- Social media synergy with streaming services continues to impact music discovery and promotion.
- Immersive experiences such as virtual and augmented reality concerts are poised to dissolve physical barriers between artists and fans.
- Subscription models are evolving with offerings targeting superfans with exclusive perks and enhanced interactivity.

These trends collectively showcase how music streaming technology in 2025 is becoming more personalized, immersive, transparent, and high-fidelity while addressing new challenges posed by AI-generated content.`,
      metadata: {
        category: "technology",
        expected_tool_usage: true,
        data_type: "tech_developments",
        requires_web_search: true,
      },
    },
    {
      input: "What is Bad Bunny's current tour schedule for 2025?",
      expected: `Bad Bunny's current 2025 tour schedule includes two major components:

1. A concert residency titled "No Me Quiero Ir de Aquí" in Puerto Rico at the José Miguel Agrelot Coliseum, running from July 11 to September 20, 2025, with 31 concert dates.

2. An all-stadium world tour called the "Debí Tirar Más Fotos World Tour" supporting his 2025 album, starting November 21, 2025, at Estadio Olímpico Félix Sánchez in Santo Domingo, and concluding July 22, 2026, in Brussels. This tour features over 57 shows across Latin America, Australia, Japan, and Europe, with many additional dates added due to high demand.

There are no 2025 U.S. tour dates, reportedly due to concerns over anti-immigration raids. The residency and world tour cover a wide range of locations internationally with record-breaking ticket sales and multiple added shows in cities like Mexico City, Madrid, and others.`,
      metadata: {
        category: "tour_info",
        expected_tool_usage: true,
        data_type: "current_tour_dates",
        requires_web_search: true,
      },
    },
    {
      input: "What are the latest collaborations in hip-hop for August 2025?",
      expected: `In August 2025, some of the latest notable collaborations in hip-hop included:

- Drake featuring Central Cee on the track "WHICH ONE" (DJ OiO Acap In).
- Offset featuring JID on the song "Bodies".
- Offset teaming up with Key Glock for "Run It Up".
- Joyner Lucas featuring J Balvin, Fireboy DML, and DaBaby on a track titled "Time Is Money".
- Metro Boomin featuring Waka Flocka Flame on "Clap" and with J Money, Quavo, and Waka Flocka Flame on "Drip BBQ".
- Buddah Bless featuring Big Sean, 2 Chainz, and BossMan Dlow on "See The World".
- Juicy J featuring Wale and Trey Songz on "Bounce It".
- Pluto and YK Niece featuring Sexyy Red on "WHIM WHAMIEE (Remix)".

These collaborations highlight a range of featured artists who dropped new tracks or contributed to each other's projects in August 2025.`,
      metadata: {
        category: "collaborations",
        expected_tool_usage: true,
        data_type: "recent_collaborations",
        requires_web_search: true,
      },
    },
    {
      input:
        "What are the current music industry revenue statistics for Q2 2025?",
      expected: `The current music industry revenue statistics for Q2 2025 show continued growth driven primarily by streaming and subscription services.

Key highlights from major companies:
- Universal Music Group reported revenue of €2.98 billion for Q2 2025, a 1.6% year-over-year increase (4.5% in constant currency). Recorded Music revenue rose 1.1%, with streaming revenue up 4.4%, and subscription revenue growing 5.3% year-over-year. Music Publishing revenue grew 11.5% year-over-year. Adjusted EBITDA margin expanded to 22.7%.
- Sony generated $2.77 billion in global music revenue in Q2 2025, up 8.8% year-over-year in constant currency. Recorded Music revenue was $2.09 billion, with streaming at $1.36 billion (7.3% increase). Physical music sales rose 19%. Music Publishing earned $683 million, up 9.9%, with streaming publishing revenue increasing 8%.
- Spotify reported total revenue of €4.2 billion for Q2 2025, a 10% increase year-over-year. Subscribers climbed 12% to 276 million, and monthly active users grew 11% to 696 million.
- Live Nation recorded a consolidated revenue surge of 16% to $7 billion in Q2 2025, driven by global fan demand.
- Industry-wide, revenue across all formats hit a new high of $5.6 billion mid-year 2025, with paid subscriptions driving much of that growth, growing 5.7% to $3.2 billion.

Streaming remains the dominant and fastest-growing revenue source, supported by subscriptions. Physical sales showed some growth in companies like Sony but declined in others. Music publishing also saw healthy growth.

These figures represent strong, broad-based financial health in the global music industry for Q2 2025, with double-digit growth in key segments like streaming and live events continuing to drive overall revenue increases.`,
      metadata: {
        category: "market_data",
        expected_tool_usage: true,
        data_type: "revenue_statistics",
        requires_web_search: true,
      },
    },
    {
      input: "What are the latest changes in music copyright law for 2025?",
      expected: `The latest changes in music copyright law for 2025 focus heavily on issues related to artificial intelligence (AI), international rights, and new rulings on originality and royalty protections. Key updates include:

- In the UK, there is a debated government plan to allow AI developers to train on copyrighted music with an "opt-out" system, meaning unless creators choose not to allow it. This faced strong opposition from musicians, and the government may adjust the approach. Also, the UK expanded rights for more international performers to receive royalties when their recordings are played in public or on radio.

- The UK House of Lords recently voted in favor of strengthening copyright protections against unauthorized use by AI firms, emphasizing the need for transparency and redress mechanisms for creators.

- In the US, the Supreme Court declined to revive the copyright infringement suit against Ed Sheeran, affirming that common musical structures like chord progressions are not copyrightable. This sets a precedent supporting originality as a requirement.

- AI-generated music is a central issue globally. Lawsuits and debates revolve around whether AI can legally train on copyrighted songs and when AI-generated outputs infringe copyrights. Countries vary in their legal stances— for example, the US leans on fair use for AI training data, while the EU allows AI training unless rights holders opt out.

- Various legal cases in 2024-2025 tested copyright issues related to AI music, including suits against AI companies for unauthorized training on copyrighted songs and concerns over AI-generated music mimicking real artists' voices.

- Tax regulation changes from 2025 adjust how earnings from copyright income versus professional income are treated for musicians and other creative professionals.

Overall, 2025 sees music copyright law adapting to address the growing influence of AI in music creation, emphasizing the protection of creators' rights internationally, clarifying originality standards, and adjusting royalty frameworks.`,
      metadata: {
        category: "legal",
        expected_tool_usage: true,
        data_type: "copyright_updates",
        requires_web_search: true,
      },
    },
    {
      input:
        "What are the latest features on TikTok for music creators in Q2 2025?",
      expected: `The latest features on TikTok for music creators in Q2 2025 center around the beta launch of TikTok Songwriter Features. These include:

- Songwriter Account Label: Music creators can create official Songwriter accounts that add a clear "Songwriter" label to their profile for identification.
- Songwriter Music Tab: A dedicated tab on user profiles where songwriters can spotlight tracks they have written or co-written.
- Story Sharing Tools: Songwriters can share stories behind their music to engage fans deeper.
- Enhanced Music Discovery: Fans can explore, use, save, and share music from songwriters easily.
- Existing tools integration: Features like #BehindTheSong campaign, "New" tags on latest releases, and Add to Music App for saving songs to streaming services complement the new tools.

These innovations aim to highlight songwriters' work, improve discovery, and support monetization opportunities based on songwriter feedback and research. Notable early users include Lauren Christy, Toby Gad, and Justin Tranter. These features reflect TikTok's strong commitment to music creators and help build their audience and profile on the platform in 2025.`,
      metadata: {
        category: "platform_features",
        expected_tool_usage: true,
        data_type: "social_media_updates",
        requires_web_search: true,
      },
    },
    {
      input:
        "whats going on at spotify for artists with terms and services. Artists do not like it",
      expected:
        "Spotify updated its Terms of Service in 2025, which has caused controversy among artists. The main concerns arise from language in the terms that grant Spotify broad rights to use any user-uploaded content through Spotify for Artists—such as music, photos, biographies, and promotional materials—in marketing and promotional activities worldwide and royalty-free. This means Spotify can use artists' uploaded content to promote its platform without additional compensation to the artists. Some artists feel this overreaches and infringes on their control over their intellectual property.",
      metadata: {
        category: "platform_policy",
        expected_tool_usage: true,
        data_type: "current_events",
        requires_web_search: true,
      },
    },
  ],

  task: async (input: string): Promise<string> => {
    try {
      const response = await callChatFunctions(input);
      return response;
    } catch (error) {
      return `Error: ${error instanceof Error ? error.message : "Function call failed"}`;
    }
  },

  scores: [AnswerCorrectness],
});
