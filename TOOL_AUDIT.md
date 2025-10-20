# Recoup Tool Audit - Complete Deep Dive

## How to Read This Document

Each tool shows:
- **What it ACTUALLY does** (not assumptions)
- **Complete workflow** (all steps)
- **Database impact** (what tables it touches)
- **API calls** (external services)
- **Dependencies** (must call first)
- **Cascading effects** (what it triggers)
- **OAuth requirements** (who needs to authorize)
- **Failure modes** (what can go wrong)

---

## THE INSTAGRAM SCRAPING CASCADE (Critical to Understand!)

This is your most complex workflow - it has **automatic cascading**:

### Step 1: User Calls `scrape_instagram_profile`
```typescript
Input: handles: ["kaashpaige"]
```

**What Actually Happens**:
1. Tool calls `api.recoupable.com/api/instagram/profiles?handles=kaashpaige&webhooks=...`
2. Backend triggers Apify Instagram Profile Scraper (actorId: `dSCLg0C3YEZ83HzYX`)
3. Returns immediately: `{ runId: "abc123", datasetId: "def456" }`
4. User sees: "Scraper started, results coming via webhook"

**Scraper runs for 2-5 minutes** (async, out of band)

### Step 2: Webhook Receives Results (`/api/apify`)
When Apify finishes:
1. Posts to `/api/apify` with results
2. Validates payload
3. Routes by `actorId` to `handleInstagramProfileScraperResults()`

### Step 3: `handleInstagramProfileScraperResults` Processes Data
**Massive data processing pipeline**:

```typescript
// 1. Fetch dataset from Apify
const dataset = await getDataset(datasetId);
const profile = dataset[0];  // Instagram profile data

// 2. Save posts to DB
const posts = await saveApifyInstagramPosts(profile.latestPosts);
// Writes to: posts table

// 3. Upload profile pic to Arweave (permanent storage)
const arweaveUrl = await uploadLinkToArweave(profile.profilePicUrlHD);

// 4. Create/update social record
await insertSocials([{
  username: profile.username,
  avatar: arweaveUrl,  // Now on Arweave
  profile_url: profile.url,
  bio: profile.biography,
  followerCount: profile.followersCount,
  followingCount: profile.followsCount
}]);
// Writes to: socials table

// 5. Get the social_id
const social = await getSocialByProfileUrl(profile.url);

// 6. Link posts to social
await insertSocialPosts(posts.map(post => ({
  post_id: post.id,
  social_id: social.id
})));
// Writes to: social_posts table

// 7. Find which artist owns this social
const accountSocials = await getAccountSocials({ socialId: [social.id] });
// Reads from: account_socials table

// 8. Find which user owns this artist
const accountArtistIds = await getAccountArtistIds({ 
  artistIds: accountSocials.map(a => a.account_id) 
});
// Reads from: account_artist_ids table

// 9. Get user emails
const emails = await getAccountEmails(uniqueAccountIds);
// Reads from: account_emails table

// 10. Send email notification
await sendApifyWebhookEmail(profile, emails);
// Sends email: "Your Instagram scrape for @kaashpaige is complete!"

// 11. 🔥 AUTOMATIC CASCADE: Trigger comment scraping for new posts
await handleInstagramProfileFollowUpRuns(dataset, profile);
// This AUTOMATICALLY calls scrape_instagram_comments for each post!
```

### Step 4: CASCADE - Comment Scraper Auto-Triggers
**From Instagram profile scraper success**:
```typescript
// For each post in the scraped profile:
const postUrls = profile.latestPosts.map(p => p.post_url);
await runInstagramCommentsScraper(postUrls);
// Triggers ANOTHER async job
```

### Step 5: Comment Webhook Processes (`/api/apify`)
When comment scraper finishes:
```typescript
// Routes to handleInstagramCommentsScraper()

// 1. Get comments dataset
const comments = await getDataset(datasetId);

// 2. Save comments to DB
await saveApifyInstagramComments(comments);
// This is complex:
//   - Creates posts if they don't exist
//   - Creates social records for commenters
//   - Links comments to posts and socials
// Writes to: post_comments, posts, socials tables

// 3. 🔥 ANOTHER CASCADE: Scrape commenter profiles!
const fanHandles = comments.map(c => c.ownerUsername);
await runInstagramProfilesScraper(fanHandles);
// Scrapes fan profiles to build social_fans data
```

### The Complete Instagram Flow

```
User: scrape_instagram_profile("kaashpaige")
  ↓ (returns runId immediately)
  
[2-5 min async processing]
  ↓
Webhook: Artist profile scraped
  ↓
System: 
  - Saves artist posts
  - Saves artist social
  - Links posts to social
  - Uploads profile pic to Arweave
  - Sends email
  - AUTO-TRIGGERS comment scraping
  ↓
  
[3-10 min async processing per post]
  ↓
Webhook: Comments scraped
  ↓
System:
  - Saves comments
  - Creates social records for commenters
  - Links comments to posts
  - AUTO-TRIGGERS fan profile scraping
  ↓
  
[5-15 min async processing for all fans]
  ↓
Webhook: Fan profiles scraped
  ↓
System:
  - Saves fan profiles (social_fans table)
  - NOW user can call create_segments!
```

**Total time**: 15-30 minutes from initial call to segment-ready fan data!

---

## COMPLETE TOOL BREAKDOWN

### 🎯 INSTAGRAM SCRAPING TOOLS

#### scrape_instagram_profile
- **Type**: `ASYNC` (returns runId, webhook delivers results)
- **OAuth**: `NONE` (uses Apify, no Instagram auth needed)
- **Input**: handles: ["username1", "username2"]
- **Immediate Return**: `{ runId, datasetId }`
- **Webhook Processing** (2-5 min later):
  - Saves posts to `posts` table
  - Saves social to `socials` table
  - Links via `social_posts` table
  - Uploads profile pic to Arweave
  - Finds owner via `account_socials` → `account_artist_ids` → `account_emails`
  - Sends completion email
  - **AUTO-TRIGGERS**: Comment scraping for all posts
- **Database Writes**: posts, socials, social_posts
- **Database Reads**: account_socials, account_artist_ids, account_emails
- **External Services**: Apify API, Arweave (permanent storage)
- **Failure Modes**:
  - Private account → scraper fails
  - Invalid handle → no data
  - Apify rate limits → delayed/failed
- **ORG POTENTIAL**: Could scrape all org artists at once

#### scrape_instagram_comments
- **Type**: `ASYNC`
- **OAuth**: `NONE`
- **Input**: postUrls: ["https://instagram.com/p/ABC123"]
- **Immediate Return**: `{ runId, datasetId }`
- **Webhook Processing** (3-10 min later):
  - Saves comments to `post_comments` table
  - Creates posts if they don't exist (`posts` table)
  - Creates social records for commenters (`socials` table)
  - **AUTO-TRIGGERS**: Fan profile scraping for unique commenters
- **Database Writes**: post_comments, posts, socials
- **Cascade Effect**: Triggers `scrape_instagram_profile` for fan handles
- **ORG POTENTIAL**: Track org-wide comment sentiment

#### get_social_posts
- **Type**: `SYNC`
- **OAuth**: `NONE`
- **Input**: social_id (from get_artist_socials)
- **Returns**: Posts from `social_posts` table (already scraped)
- **PREREQUISITE**: Instagram scraper must have run first
- **Query**: API endpoint that joins social_posts + posts tables
- **Pagination**: page, limit (max 100 per page)
- **Database Reads**: social_posts JOIN posts
- **Cannot Do**: Get posts that haven't been scraped yet

#### get_post_comments
- **Type**: `SYNC`
- **OAuth**: `NONE`
- **Input**: post_id
- **Returns**: Comments from `post_comments` table
- **PREREQUISITE**: Comment scraper must have run first
- **Database Reads**: post_comments JOIN socials
- **Cannot Do**: Get comments not yet scraped

---

## 🎯 FAN SEGMENTATION TOOLS (AI-Powered)

#### create_segments
- **Type**: `HYBRID` (complex AI analysis + multi-table writes)
- **OAuth**: `NONE`
- **Input**: artist_account_id, prompt (e.g., "Identify brand partnership opportunities")
- **Complete Workflow**:

```typescript
// STEP 1: Validate artist has social accounts
const accountSocials = await getAccountSocials({ accountId: artist_account_id });
const socialIds = accountSocials.map(s => s.social_id);

if (socialIds.length === 0) {
  return { 
    error: "No social accounts found",
    feedback: "Steps to fix:
      1. search_web for artist's Instagram handle
      2. update_artist_socials with discovered URL
      3. retry create_segments"
  };
}

// STEP 2: Get all fans from social_fans table
const fans = await selectSocialFans({ social_ids: socialIds });

if (fans.length === 0) {
  return {
    error: "No fans found",
    feedback: "Steps to fix:
      1. scrape_instagram_profile to get posts
      2. scrape_instagram_comments to get engagement
      3. Wait for webhook processing (fan profiles)
      4. retry create_segments"
  };
}

// STEP 3: AI Analysis - Generate segment names
const analysisPrompt = buildPrompt(fans, prompt);
// Takes up to 111 fans max
// Sends to Claude with fan data: username, bio, followerCount, latest comment

const segments = await generateArray({
  system: SEGMENT_SYSTEM_PROMPT,
  prompt: analysisPrompt
});
// Claude returns: [
//   { segmentName: "Gaming Community", fans: ["fan_id_1", "fan_id_2"] },
//   { segmentName: "Music Producers", fans: ["fan_id_3"] }
// ]

// STEP 4: Delete existing segments
await deleteSegments(artist_account_id);
// Deletes from: segments, artist_segments, fan_segments (CASCADE)

// STEP 5: Insert new segments
const insertedSegments = await insertSegments(segments.map(s => ({ 
  name: s.segmentName 
})));
// Writes to: segments table

// STEP 6: Link segments to artist
await insertArtistSegments(insertedSegments.map(seg => ({
  artist_account_id,
  segment_id: seg.id
})));
// Writes to: artist_segments table

// STEP 7: Link fans to segments
await insertFanSegments(fanSegmentMappings);
// Writes to: fan_segments table
```

- **Database Writes**: segments, artist_segments, fan_segments
- **Database Reads**: account_socials, social_fans
- **AI Call**: Claude Anthropic model for segment generation
- **Limitations**: 
  - Max 111 fans analyzed per call (prompt size limits)
  - Requires scraped fan data
  - Deletes ALL existing segments (replace, not append)
- **Cannot Do**: 
  - Create segments without fan data
  - Append to existing segments (always replaces)
  - Segment fans from multiple artists
- **ORG POTENTIAL**: Could segment across ALL org artists' fans

#### get_artist_segments
- **Type**: `SYNC`
- **Input**: artist_account_id
- **Returns**: Segments from `artist_segments` JOIN `segments`
- **API**: `api.recoupable.com/api/artist/segments`
- **Pagination**: Yes
- **Cannot Do**: Get fans within segment (need get_segment_fans for that)

#### get_segment_fans
- **Type**: `SYNC`
- **Input**: segment_id
- **Returns**: Fans in that segment from `fan_segments` table
- **API**: `api.recoupable.com/api/segment/fans`
- **Pagination**: Yes
- **Data**: Fan social profiles (username, avatar, bio, followers)

#### get_social_fans
- **Type**: `SYNC`
- **Input**: social_ids (array)
- **Returns**: Raw fan data from `social_fans` table
- **Query**: Direct Supabase query
- **Purpose**: Get underlying fan data before segmentation
- **Cannot Do**: Filter by segment (that's get_segment_fans)

---

## 🎯 CATALOG TOOLS (AI-Powered Song Matching)

#### select_catalogs
- **Type**: `SYNC`
- **OAuth**: `NONE`
- **Input**: account_id
- **API**: `api.recoupable.com/api/catalogs`
- **Returns**: List of catalog IDs and metadata
- **Database**: Catalogs are stored at ACCOUNT level (not artist level!)
- **Ownership**: Account owns catalog, can be shared across their artists
- **Cannot Do**: Get songs (need select_catalog_songs for that)

#### select_catalog_songs
- **Type**: `HYBRID` (fetch ALL songs + AI filtering)
- **OAuth**: `NONE`
- **Input**: catalog_id, criteria (e.g., "Halloween workout songs, 120-140 BPM")
- **Complete Workflow**:

```typescript
// STEP 1: Fetch first page to get total count
const firstPage = await getCatalogSongs(catalogId, 100, page:1);
// API: api.recoupable.com/api/catalogs/songs
const totalPages = firstPage.pagination.total_pages;
const totalSongs = firstPage.pagination.total_count;

// STEP 2: Fetch ALL pages in PARALLEL
const allPages = await Promise.all(
  pageNumbers.map(page => getCatalogSongs(catalogId, 100, page))
);
const allSongs = allPages.flat();  
// Could be 1000+ songs!

// STEP 3: AI Filtering in parallel batches
const batches = chunk(allSongs, 100);  // 100 songs per batch

await Promise.all(
  batches.map(async batch => {
    // For each batch, call AI:
    const { object } = await generateObject({
      model: DEFAULT_MODEL,
      schema: { selected_song_isrcs: z.array(z.string()) },
      prompt: `Given these songs and criteria "${criteria}", 
               select ISRCs that match.
               Songs: ${JSON.stringify(batch)}`
    });
    return songs.filter(s => object.selected_song_isrcs.includes(s.isrc));
  })
);

// STEP 4: Recursive refinement if too many results
if (results.length > 1000) {
  // Process again with stricter filtering
  return await refineResults(results, criteria);
}
```

- **AI Calls**: Multiple parallel calls to DEFAULT_MODEL (gpt-5-mini)
- **Cost**: Potentially expensive for large catalogs (10+ AI calls)
- **Speed**: Parallelized, but still 5-15 seconds for 1000+ songs
- **Database Reads**: Via API (catalog_songs table)
- **Cannot Do**: 
  - Add songs (that's insert_catalog_songs)
  - Search across multiple catalogs
  - Filter without AI (no simple search)
- **ORG POTENTIAL**: Already account-level → easy org support

#### insert_catalog_songs
- **Type**: `SYNC`
- **Input**: Array of { catalog_id, isrc }
- **Purpose**: Batch add songs to catalog by ISRC
- **API**: `api.recoupable.com/api/catalogs/songs` (POST)
- **Database Writes**: catalog_songs table
- **Cannot Do**: Add songs without ISRC codes

---

## 🎯 YOUTUBE TOOLS (OAuth-Gated)

### The YouTube OAuth Flow

#### youtube_login
- **Type**: `SYNC` (returns status, doesn't generate URL)
- **Input**: artist_account_id
- **What It Actually Does**:
```typescript
// 1. Check if tokens exist in DB
const tokens = await getYouTubeTokens(artist_account_id);
// Reads from: youtube_tokens table

// 2. If tokens exist, check expiry
if (isTokenExpired(tokens.expires_at)) {
  // 3. Try to refresh using refresh_token
  const refreshed = await refreshStoredYouTubeToken(tokens, artist_account_id);
  // Calls Google OAuth API
  // Updates youtube_tokens table
  
  if (refreshed.success) {
    return { success: true, message: "YouTube connected" };
  }
}

// 4. If no tokens or refresh failed
return { 
  success: false, 
  message: "YouTube authentication required. Please connect." 
};
```

- **Does NOT**: Generate OAuth URL (frontend handles that via `lib/youtube/youtubeLogin.ts`)
- **Database**: youtube_tokens table
- **Token Refresh**: Automatic via Google OAuth
- **Cannot Do**: Force user to authenticate (just checks status)

#### get_youtube_channels
- **Type**: `SYNC`
- **OAuth**: `ARTIST` (requires YouTube OAuth completed)
- **PREREQUISITE**: youtube_login must return success:true
- **Workflow**:
```typescript
// 1. Validate tokens
const tokens = await validateYouTubeTokens(artist_account_id);
if (!tokens.success) {
  return { error: "YouTube authentication required" };
}

// 2. Create YouTube API client
const youtube = createYouTubeAPIClient(access_token, refresh_token);

// 3. Fetch channel info from Google
const response = await youtube.channels.list({
  part: ["snippet", "statistics", "contentDetails", "brandingSettings"],
  mine: true
});

// Returns: Channel data including subscriber count, uploads_playlist_id, etc.
```

- **External API**: Google YouTube Data API v3
- **OAuth Scopes**: youtube.readonly
- **Returns**: Channel ID, subscriber count, uploads_playlist_id (critical for getting videos)
- **Cannot Do**: Get videos directly (need uploads_playlist_id first)

#### get_youtube_channel_video_list  
- **Type**: `SYNC`
- **OAuth**: `ARTIST`
- **PREREQUISITE**: 
  1. youtube_login (authentication)
  2. get_youtube_channels (to get uploads_playlist_id)
- **Input**: uploads_playlist_id (from get_youtube_channels)
- **Workflow**:
```typescript
// 1. Get video IDs from playlist
const playlist = await youtube.playlistItems.list({
  playlistId: uploads_playlist_id,
  part: ["snippet", "contentDetails"],
  maxResults: max_results
});
const videoIds = playlist.items.map(i => i.contentDetails.videoId);

// 2. Get FULL video details (includes stats)
const videos = await youtube.videos.list({
  id: videoIds,
  part: ["id", "snippet", "statistics", "contentDetails"]
});
```

- **Returns**: Full video data (title, views, likes, duration, thumbnails)
- **Limitation**: Max 50 videos per call
- **Cannot Do**: Get videos without playlist_id

#### get_youtube_revenue
- **Type**: `SYNC`
- **OAuth**: `ARTIST` (requires yt-analytics-monetary.readonly scope)
- **Input**: artist_account_id, startDate, endDate
- **Workflow**:
```typescript
// 1. Validate tokens
// 2. Get channel ID
const channel = await youtube.channels.list({ mine: true });
const channelId = channel.items[0].id;

// 3. Query YouTube Analytics API
const analytics = await ytAnalytics.reports.query({
  ids: `channel==${channelId}`,
  startDate,
  endDate,
  metrics: "estimatedRevenue",
  dimensions: "day"
});

// 4. Process daily revenue
const dailyRevenue = analytics.rows.map(row => ({
  date: row[0],
  revenue: parseFloat(row[1])
}));
const totalRevenue = dailyRevenue.reduce((sum, day) => sum + day.revenue, 0);
```

- **External API**: YouTube Analytics API (separate from Data API)
- **OAuth Scope**: MUST have yt-analytics-monetary.readonly
- **Limitation**: Only works if channel is monetized
- **Returns**: Daily breakdown + total revenue
- **Cannot Do**: Get revenue for non-monetized channels

#### set_youtube_thumbnail
- **Type**: `SYNC`
- **OAuth**: `ARTIST` (requires youtube scope, not just readonly)
- **Input**: video_id, thumbnail_url
- **Workflow**:
```typescript
// 1. Download image from URL
const imageBuffer = await fetch(thumbnail_url);

// 2. Resize/compress if needed
const resizedBuffer = await getResizedImageBuffer(imageBuffer);
// Max 2MB, converts to JPEG

// 3. Upload to YouTube
await youtube.thumbnails.set({
  videoId: video_id,
  media: { mimeType: "image/jpeg", body: resizedBuffer }
});
```

- **OAuth Scope**: Requires `youtube` (write access)
- **Limitation**: Max 2MB image size
- **Cannot Do**: Set thumbnails for videos user doesn't own

---

## 🎯 SPOTIFY TOOLS (Public API - No Auth)

All Spotify tools use `api.recoupable.com/api/spotify/*` (your backend proxies to Spotify API)

#### get_spotify_search
- **Type**: `SYNC`
- **OAuth**: `NONE` (public Spotify API)
- **Input**: name, type: ["artist", "track", "album"], limit
- **Returns**: Search results for requested types
- **API**: Spotify Web API /search endpoint
- **Cannot Do**: Get user's personal data (that would need Spotify OAuth)

#### get_spotify_artist_top_tracks
- **Type**: `SYNC`
- **OAuth**: `NONE`
- **PREREQUISITE**: Need Spotify artist ID (from get_spotify_search or get_artist_socials)
- **Returns**: Top 10 tracks with popularity scores
- **Cannot Do**: Get real-time stream counts (Spotify doesn't provide)

#### get_spotify_artist_albums
- **Type**: `SYNC`
- **OAuth**: `NONE`
- **Returns**: Artist's albums with release dates, track counts
- **Filters**: Can filter by album_type (album, single, appears_on, compilation)

#### get_spotify_album
- **Type**: `SYNC`
- **OAuth**: `NONE`
- **Input**: album_id
- **Returns**: Full album data including ALL tracks, copyrights, label
- **Rich Data**: Includes ISRC codes for tracks

#### spotify_deep_research
- **Type**: `WORKFLOW STARTER`
- **What It Really Does**:
```typescript
// 1. Gets artist socials
const socials = await getArtistSocials(artist_account_id);

// 2. Returns requirements (doesn't execute research)
return {
  artistSocials: socials,
  artist_account_id,
  success: true
  // LLM must then call:
  // - get_spotify_artist_top_tracks
  // - get_spotify_artist_albums  
  // - Analyze popularity, followers, etc.
};
```

- **NOT a researcher**: Just returns social data + reminds LLM what to research
- **Requirements** (from SPOTIFY_DEEP_RESEARCH_REQUIREMENTS):
  - Popularity scores (0-100) for all tracks
  - Average popularity
  - Follower metrics
  - Engagement info
  - Tracklist
  - Collaborators

---

## 🎯 ARTIST MANAGEMENT TOOLS

#### create_new_artist
- **Type**: `WORKFLOW` (creates artist + suggests next steps)
- **OAuth**: `NONE`
- **Input**: name, account_id, active_conversation_id (optional)
- **Complete Workflow**:
```typescript
// 1. Create artist account in DB
const artist = await createArtistInDb(name, account_id);
// Inserts into: accounts table (artist IS an account)
// Generates new UUID for artist_account_id

// 2. Link to user's account
// Automatically creates record in account_artist_ids table
// Links: user account_id → artist_account_id

// 3. Copy current conversation to new artist (if provided)
if (active_conversation_id) {
  const newRoomId = await copyRoom(active_conversation_id, artist.account_id);
  // Duplicates conversation for new artist context
}

// 4. Returns suggestion
return {
  artist: { account_id, name },
  message: "Successfully created. Now searching Spotify for this artist..."
  // LLM should follow up with get_spotify_search
};
```

- **Database Writes**: accounts, account_artist_ids, rooms (if conversation copied)
- **Special**: Artist IS an account (accounts table serves dual purpose)
- **Relationship**: Creates many-to-many between user account and artist account
- **Cannot Do**: Add social links (need update_artist_socials)

#### delete_artist
- **Type**: `SYNC`
- **OAuth**: `NONE`
- **Input**: artist_account_id, account_id
- **What Happens**:
```typescript
// 1. Find relationship record
const relationship = await getAccountArtistIds({
  artistIds: [artist_account_id],
  accountIds: [account_id]
});

// 2. Delete relationship
await deleteAccountArtistId(relationship.id);
// Deletes from: account_artist_ids

// 3. Check if other users have this artist
const otherUsers = await getAccountArtistIds({
  artistIds: [artist_account_id]
});

// 4. If no other users, CASCADE DELETE artist
if (otherUsers.length === 0) {
  // CASCADE deletes:
  // - account_socials
  // - artist_segments
  // - scheduled_actions
  // - files
  // - All related data
}
```

- **Soft Delete**: If other users have artist, only removes relationship
- **Hard Delete**: If last user, deletes entire artist account
- **CASCADE**: Database foreign keys handle related data cleanup

#### update_artist_socials
- **Type**: `SYNC`
- **OAuth**: `NONE`
- **Input**: artistId, urls: ["https://instagram.com/artist", "https://twitter.com/artist"]
- **Workflow**:
```typescript
// 1. For each URL, infer platform
const platform = getSocialPlatformByLink(url);
// "https://instagram.com/X" → "INSTAGRAM"
// "https://twitter.com/X" → "TWITTER"

// 2. Check if social record exists
const existingSocial = await getSocialByProfileUrl(url);

if (existingSocial) {
  // Link existing social to artist
  await insertAccountSocial(artistId, existingSocial.id);
} else {
  // Create new social record
  const newSocial = await insertSocials([{
    username: getUserNameByProfileLink(url),
    profile_url: url
  }]);
  await insertAccountSocial(artistId, newSocial.id);
}

// 3. Remove old socials of same platform
// (If artist had old Instagram, replace with new)
```

- **Database Writes**: socials, account_socials
- **Smart**: Creates social if doesn't exist, links if it does
- **Platform Detection**: Automatic from URL
- **Cannot Do**: Verify URL belongs to artist (just stores whatever you give it)

#### get_artist_socials
- **Type**: `SYNC`
- **OAuth**: `NONE`
- **Input**: artist_account_id
- **API**: `api.recoupable.com/api/artist/socials`
- **Returns**: All social profile URLs linked to artist
- **Database**: account_socials JOIN socials
- **Critical**: Returns social_id needed for many other tools
- **Pagination**: Yes

#### update_account_info
- **Type**: `SYNC`
- **OAuth**: `NONE`
- **Input**: artistId, email?, image?, name?, instruction?, label?, knowledges?
- **Purpose**: Updates artist profile metadata
- **Database**: account_info table (upsert)
- **Knowledge Base Storage**:
```typescript
knowledges: [
  { url: "https://arweave.net/abc123", name: "Bio.txt", type: "text/plain" },
  { url: "https://arweave.net/def456", name: "Press Kit.pdf", type: "application/pdf" }
]
```
- **Special**: Knowledges are injected into system prompt via getSystemPrompt()
- **Cannot Do**: Upload files (must provide URLs to existing files)

#### create_knowledge_base
- **Type**: `SYNC` (prepare only, doesn't persist)
- **Input**: knowledgeBaseText
- **Returns**: `{ success: true, knowledgeBaseText, message: "Prepared for storage" }`
- **What It Doesn't Do**: STORE the knowledge base!
- **Required Follow-up**: Must call update_account_info with knowledges array
- **Purpose**: Validates text is ready to be stored

---

## 🎯 FILE MANAGEMENT TOOLS (Supabase Storage)

#### Storage Structure
```
Supabase Storage Bucket: "user-files"
Path: files/{account_id}/{artist_account_id}/{path}/{fileName}

Example: files/user-123/artist-456/research/spotify_analysis.md
```

#### write_file
- **Type**: `SYNC`
- **OAuth**: `NONE`
- **Complete Workflow**:
```typescript
// 1. Check if file exists
const existing = await findFileByName(fileName, account_id, artist_id, path);
if (existing) {
  return { error: "File exists, use update_file" };
}

// 2. Ensure directory exists (creates if needed)
if (path) {
  await ensureDirectoryExists(account_id, artist_id, path);
  // Creates virtual directory record in files table
}

// 3. Build storage key
const storageKey = `files/${account_id}/${artist_id}/${path}/${fileName}`;

// 4. Auto-detect MIME type
const ext = fileName.split('.').pop();
const mimeType = mimeTypeMap[ext] || "text/plain";

// 5. Upload to Supabase Storage
await uploadFileByKey(storageKey, file, { contentType: mimeType });
// Writes to: Supabase Storage bucket

// 6. Create metadata record
await createFileRecord({
  ownerAccountId: account_id,
  artistAccountId: artist_id,
  storageKey,
  fileName,
  mimeType,
  sizeBytes,
  description
});
// Writes to: files table
```

- **Database**: files table (metadata) + Supabase Storage (actual file)
- **Cannot Do**: Overwrite existing files (use update_file)
- **Auto-creates**: Directories as needed

#### read_file
- **Type**: `SYNC`
- **Workflow**:
```typescript
// 1. Find file in DB
const fileRecord = await findFileByName(fileName, account_id, artist_id, path);

// 2. Check if it's a directory
if (fileRecord.is_directory) {
  return { error: "Cannot read directory" };
}

// 3. Fetch from Supabase Storage
const content = await fetchFileContentServer(fileRecord.storage_key);
// Downloads from Storage bucket

// Returns: content, fileName, mimeType, sizeBytes, createdAt
```

- **Cannot Do**: Read binary files (only text-based)

#### update_file
- **Type**: `SYNC`
- **Input**: fileName, content, operation (default: "overwrite")
- **Database**: Updates files table metadata + Storage
- **Cannot Do**: Update non-existent files (use write_file)

#### list_files
- **Type**: `SYNC`
- **Input**: path?, textFilesOnly?
- **Database Query**: files table WHERE owner_account_id AND artist_account_id
- **Returns**: File metadata (not content)
- **Supports**: Directories (virtual folders)

---

## 🎯 SCHEDULED ACTIONS (Recurring Workflows)

#### create_scheduled_actions
- **Type**: `SYNC` (creates DB record)
- **Input**: Array of {title, prompt, schedule (cron), account_id, artist_account_id, enabled}
- **Critical Understanding**:
```typescript
// The "prompt" is the ENTIRE WORKFLOW as natural language!
prompt: `
  MULTI-STEP WORKFLOW:
  1. Hand off to Social Media Specialist → getAllSocialMetrics()
  2. read_file("history.json")
  3. Hand off to Analytics Specialist → generate report
  4. update_file("history.json")
  5. send_email()
  
  ERROR HANDLING:
  - If scraper fails, continue with available data
`

// This prompt is executed by the LLM on schedule!
// Each cron execution re-runs this prompt fresh
```

- **Database Writes**: scheduled_actions table
- **Cron Execution**: External cron job reads table, executes prompts
- **Flexibility**: Can modify workflow by updating prompt field
- **Cannot Do**: Execute immediately (only schedules for future)

#### get_scheduled_actions
- **Type**: `SYNC`
- **Returns**: List from scheduled_actions table
- **Filters**: By account_id, artist_account_ids[], enabled status

#### update_scheduled_action
- **Type**: `SYNC`
- **Purpose**: Modify existing scheduled actions
- **Can Update**: title, prompt, schedule, enabled status
- **Use Case**: User says "Change report to daily" → update cron expression

#### delete_scheduled_actions
- **Type**: `SYNC`
- **Input**: Array of IDs to delete
- **Database**: Deletes from scheduled_actions table

---

## 🎯 WORKFLOW STARTER TOOLS (Templates, Not Executors)

#### create_release_report
```typescript
// What it returns:
{
  success: true,
  songTitle: "Midnight Dreams",
  nextSteps: [
    "get_youtube_channel_video_list - search for videos related to release",
    "get_spotify_artist_albums - search for songs related to release"
  ],
  message: "Follow the tool loop to create release report"
}
```

- **NOT an executor**: Doesn't create the report!
- **Purpose**: Reminds LLM of the workflow
- **LLM Must**: Execute each nextStep tool, then synthesize into report

#### artist_deep_research
```typescript
// Returns:
{
  artistSocials: [...],  // From get_artist_socials
  artist_account_id,
  success: true
  // LLM sees description with research requirements
}
```

- **Tool Description Includes**: Full research checklist
- **LLM Must**: Execute research across platforms based on description

#### spotify_deep_research  
- Similar to artist_deep_research but Spotify-focused
- Returns socials + requirements
- LLM executes actual research

---

## 🎯 COMMUNICATION TOOLS

#### send_email
- **Type**: `SYNC`
- **Service**: Resend API
- **Input**: to[], cc[], subject, text?, html?, headers?
- **From**: hi@recoupable.com (hardcoded)
- **Features**:
  - Supports multiple recipients
  - HTML and plain text
  - Custom headers
- **Cannot Do**: Send from different email address

#### contact_team
- **Type**: `SYNC`
- **Service**: Telegram Bot API
- **Purpose**: Sends message to Recoup team
- **Format**:
```
🔔 New Team Contact
From: user@email.com
Chat: "Weekly Reports Setup"
Chat ID: chat-123
Time: 2025-10-20T15:30:00Z

Message:
I need help with...
```

- **Target**: Recoup team Telegram channel
- **Cannot Do**: Reply back to user (one-way)

---

## 🎯 CONTENT GENERATION TOOLS

#### generate_image
- **Workflow**:
```typescript
// 1. Generate image (AI)
const image = await generateAndProcessImage(prompt);
// Uses OpenAI DALL-E or similar

// 2. Upload to Arweave (permanent storage)
const arweaveUrl = await uploadToArweave(image);

// 3. Create NFT on Base blockchain
const tx = await createOnchainCollection(arweaveUrl);
// Uses Coinbase CDP SDK

// Returns: arweaveUrl, transactionHash, blockExplorerUrl
```

- **Blockchain**: Base (mainnet) or Base Sepolia (testnet)
- **Cost**: Gas fees for blockchain transaction
- **Permanent**: Arweave storage is forever

#### nano_banana_generate
- **Service**: Fal AI (Google's Nano Banana model)
- **Credits**: Deducts from account credits
- **Returns**: Fal-hosted URL (not blockchain)
- **Faster**: No blockchain overhead
- **Temporary**: URL expires eventually

#### nano_banana_edit
- **Input**: prompt, imageUrl
- **Purpose**: Modify existing image
- **Same credit system** as generate

#### generate_sora_2_video
- **Service**: OpenAI Sora 2 API
- **Async**: Returns job ID, must poll for completion
- **Params**: seconds (4-20), size (portrait/landscape)
- **Cost**: Expensive ($0.80-$2.00 per video)

#### retrieve_sora_2_video
- **Input**: video_id (from generate)
- **Returns**: Status (queued/processing/completed/failed) + progress %
- **Use**: Poll until status === "completed"

#### retrieve_sora_2_video_content
- **Input**: video_id
- **PREREQUISITE**: Status must be "completed"
- **Returns**: Video data URL, file size, content type
- **Downloads**: Actual video file

---

## 🎯 UTILITY TOOLS

#### get_local_time
- **Type**: `SYNC`
- **Input**: timezone? (IANA format)
- **Purpose**: Get current date/time in specified timezone
- **Returns**: localTime, timezone, offsetMinutes, localeString
- **Use Case**: Validate scheduling times, display current time

#### generate_mermaid_diagram
- **Type**: `SYNC`
- **AI**: Uses Claude to generate Mermaid syntax
- **Input**: context description
- **Returns**: Formatted Mermaid code block
- **Frontend**: Renders diagram from returned syntax

---

## CRITICAL DEPENDENCIES MAP

### Instagram Workflow Dependencies
```
1. scrape_instagram_profile
   ↓ (webhook, 2-5 min)
2. Data saved to posts, socials, social_posts tables
   ↓ (auto-triggers)
3. scrape_instagram_comments (for each post)
   ↓ (webhook, 3-10 min)
4. Comments saved to post_comments, socials tables
   ↓ (auto-triggers)
5. scrape_instagram_profile (for commenter handles - fans!)
   ↓ (webhook, 5-15 min)
6. Fan profiles saved to socials, social_fans tables
   ↓ (NOW ready)
7. create_segments (can now execute)
```

**Total Pipeline**: 15-30 minutes from scrape to segments!

### YouTube Workflow Dependencies
```
1. youtube_login (check status)
   ↓ (if not connected, user must OAuth)
2. [User completes OAuth flow in browser]
   ↓ (tokens stored in youtube_tokens table)
3. get_youtube_channels (get channel info + uploads_playlist_id)
   ↓ (required for videos)
4. get_youtube_channel_video_list (use uploads_playlist_id)
   ↓ (can also get)
5. get_youtube_revenue (if monetized + correct scope)
```

### Catalog Workflow Dependencies
```
1. select_catalogs (get catalog_id)
   ↓ (required)
2. select_catalog_songs (AI filters songs)
   ↓ (can then)
3. insert_catalog_songs (add more songs)
```

---

## TOOL CAPABILITIES MATRIX

| Tool | Sync/Async | OAuth Required | DB Writes | DB Reads | External API | AI Calls | Cascades |
|------|------------|----------------|-----------|----------|--------------|----------|----------|
| scrape_instagram_profile | ASYNC | NONE | posts, socials, social_posts | account_socials, account_artist_ids, account_emails | Apify, Arweave | NO | YES → comments |
| scrape_instagram_comments | ASYNC | NONE | post_comments, socials | - | Apify | NO | YES → fan profiles |
| create_segments | SYNC | NONE | segments, artist_segments, fan_segments | account_socials, social_fans | - | YES (Claude) | NO |
| select_catalog_songs | SYNC | NONE | - | catalog_songs (via API) | - | YES (GPT-5-mini, parallel) | NO |
| youtube_login | SYNC | ARTIST | youtube_tokens (if refresh) | youtube_tokens | Google OAuth | NO | NO |
| get_youtube_revenue | SYNC | ARTIST | - | youtube_tokens | YouTube Analytics API | NO | NO |
| create_scheduled_actions | SYNC | NONE | scheduled_actions | - | - | NO | NO |
| write_file | SYNC | NONE | files | files (check exists) | Supabase Storage | NO | NO |
| generate_image | SYNC | NONE | - | - | AI API, Arweave, Base blockchain | NO | NO |
| send_email | SYNC | NONE | - | - | Resend API | NO | NO |

---

## ASYNC TOOL HANDLING STRATEGY

### Problem
Async tools don't return data in same conversation turn.

### Current Behavior
```
User: "Scrape my Instagram"
Agent: Calls scrape_instagram_profile()
Returns: { runId: "abc123" }
Agent to user: "Scraping started! Check back in a few minutes."
❌ User frustrated - no immediate value
```

### Better Multi-Agent Handling
```
User: "Scrape my Instagram"
  ↓
Main Agent → Coordinator → Social Media Specialist
  ↓
Social Specialist: 
  - Calls scrape_instagram_profile()
  - Gets runId
  - Checks if data already exists from previous scrape
  
  IF recent data exists:
    - Returns cached data: "Last scraped 2 hours ago, here's data..."
  ELSE:
    - Returns: "Scrape started, I'll email you when ready"
    - Operations Specialist: Monitors runId completion
    - Sends email when webhook receives data
```

---

## ORGANIZATION-LEVEL FEATURES (Future)

### Current State
- `organization` field exists in `account_info`
- Not enforced or used
- No UI for organization management

### Tools Ready for Org-Level
- `select_catalogs` → Already account-level (easy to make org-level)
- `create_segments` → Could segment across all org artists
- `scrape_instagram_profile` → Could scrape all org artists at once
- `scheduled_actions` → Org-wide reporting
- `get_artist_socials` → Get all org artists' socials

### Needs Org Implementation
1. Organization CRUD (create, manage org)
2. Organization membership (which accounts belong)
3. Org-level permissions (who can do what)
4. Org context in AppContext
5. Tool filtering by org_id

---

## KEY INSIGHTS FOR AGENT DESIGN

### 1. Many Tools Are Interdependent
Can't just call them in isolation - need prerequisite chains.

### 2. Async Tools Need Special Handling
Can't return data immediately - need monitoring/notification strategy.

### 3. Some Tools Trigger Cascades
Instagram scraper triggers comments scraper triggers fan scraper - 3-level cascade!

### 4. Some Tools Are Just Reminders
create_release_report, artist_deep_research - they don't DO anything, just tell LLM what to do.

### 5. Specialists Need Context About Prerequisites
Social Media Specialist needs to know:
- "Has artist connected socials?" (check get_artist_socials)
- "Has data been scraped?" (check if posts exist)
- "Is this an async job still running?" (check runId status)

### 6. Organization Support is Half-Built
Infrastructure exists but not enforced - easy to add.

---

## RECOMMENDATIONS FOR MULTI-AGENT ARCHITECTURE

### 1. Add "Data Availability Checker" to Coordinator
Before spawning specialists, Coordinator should check:
```typescript
const dataAvailability = {
  hasScrapedData: await checkIfPostsExist(artist_id),
  hasYouTubeAuth: await checkYouTubeTokens(artist_id),
  hasSegments: await checkSegmentsExist(artist_id),
  hasCatalog: await checkCatalogExists(account_id)
};

// Then spawn appropriate specialists based on what's available
```

### 2. Operations Specialist Handles Async Monitoring
When Social Specialist triggers async scraper:
```typescript
Social Specialist returns: { runId, status: "started" }
  ↓
Operations Specialist:
  - Stores runId in monitoring queue
  - Periodically calls get_apify_scraper(runId)
  - When complete, notifies user
```

### 3. Specialists Should Return Data Freshness
```typescript
{
  instagram: {
    followers: 2000,
    data_source: "scraper",
    last_updated: "2 hours ago",  // ← Add this!
    needs_refresh: false
  }
}
```

### 4. Prerequisite Auto-Resolution
If specialist needs prerequisite, it should handle it:
```typescript
// User: "Get my top Spotify tracks"
Streaming Specialist:
  - Needs Spotify artist ID
  - Auto-calls get_artist_socials first
  - Extracts Spotify ID
  - Then calls get_spotify_artist_top_tracks
  - Returns tracks
```

**This document is now your complete tool reference.**
