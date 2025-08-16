# Complete "Create New Artist" Flow Analysis - From UI Click to Completion

## Part 1: Frontend UI Flow

### Step 1: User Clicks "New Artist" Button
**Location:** Multiple UI entry points
- `components/Artists/Artists.tsx` (line 25) - Main artists page
- `components/Header/ArtistDropDown.tsx` (line 36-44) - Header dropdown
- `components/SideArtists/SideArtists.tsx` (line 42-51) - Side menu
- `components/Artists/ArtistsSidebar.tsx` (line 81-101) - Sidebar

All buttons call: `toggleCreation()`

### Step 2: toggleCreation Function
**Location:** `hooks/useArtistMode.tsx` (lines 16-20)
```typescript
const toggleCreation = () => {
    clearParams();
    if (!email) return;
    push("/?q=create a new artist");  // <-- KEY LINE
};
```
**What happens:** 
- Navigates to root URL with query parameter `q=create a new artist`

### Step 3: Root Page Processes Query
**Location:** `app/page.tsx` (lines 11-16)
```typescript
export default async function Home({ searchParams }: ChatPageProps) {
    const id = generateUUID();  // Generate chat ID
    const initialMessage = (await searchParams)?.q as string;  // Gets "create a new artist"
    const initialMessages = getMessages(initialMessage);  // Converts to chat message format
    return <HomePage id={id} initialMessages={initialMessages} />;
}
```

### Step 4: Convert Query to Chat Message
**Location:** `lib/messages/getMessages.ts` (lines 11-23)
```typescript
export function getMessages(content?: string): UIMessage[] {
    if (!content) return [];
    return [{
        id: generateUUID(),
        role: "user",
        parts: [{ type: "text", text: content }]  // "create a new artist"
    }];
}
```

### Step 5: HomePage Renders Chat Component
**Location:** `components/Home/HomePage.tsx` (line 26)
```typescript
<Chat id={id} initialMessages={initialMessages} />
```

### Step 6: Chat Component with Provider
**Location:** `components/VercelChat/chat.tsx` (lines 31-36)
```typescript
export function Chat({ id, reportId, initialMessages }: ChatProps) {
    return (
        <VercelChatProvider chatId={id} initialMessages={initialMessages}>
            <ChatContent reportId={reportId} id={id} />
        </VercelChatProvider>
    );
}
```

### Step 7: Chat Provider Sets Up Hook
**Location:** `providers/VercelChatProvider.tsx` (lines 58-94)
- Initializes `useVercelChat` hook with initial messages
- Sets up message handling and API communication

### Step 8: Auto-Send Initial Message
**Location:** `hooks/useVercelChat.ts` (lines 163-171)
```typescript
useEffect(() => {
    const isFullyLoggedIn = userId;
    const isReady = status === "ready";
    const hasMessages = messages.length > 1;
    const hasInitialMessages = initialMessages && initialMessages.length > 0;
    if (!hasInitialMessages || !isReady || hasMessages || !isFullyLoggedIn) return;
    
    handleSendQueryMessages(initialMessages[0]);  // Auto-sends "create a new artist"
}, [initialMessages, status, userId]);
```

### Step 9: Send Message to API
**Location:** `hooks/useVercelChat.ts` (lines 158-161)
```typescript
const handleSendQueryMessages = async (initialMessage: UIMessage) => {
    silentlyUpdateUrl();  // Changes URL to /chat/{id}
    sendMessage(initialMessage, chatRequestOptions);  // Sends to API
};
```

## Part 2: Backend API Processing

### Step 10: API Receives Request
**Location:** `app/api/chat/route.ts` (lines 25-69)
```typescript
export async function POST(request: NextRequest) {
    const body: ChatRequest = await request.json();  // Contains "create a new artist" message
    const chatConfig = await setupChatRequest(body);  // Step 11
    
    const stream = createUIMessageStream({
        execute: ({ writer }) => {
            const result = streamText(chatConfig);  // Step 13
            writer.merge(result.toUIMessageStream());
        },
        onFinish: async ({ messages }) => {
            await handleChatCompletion(body, messages);  // Saves to DB
        }
    });
    
    return createUIMessageStreamResponse({ stream });
}
```

### Step 11: Setup Chat Request
**Location:** `lib/chat/setupChatRequest.ts` (lines 13-68)
```typescript
export async function setupChatRequest(body: ChatRequest): Promise<ChatConfig> {
    const tools = await getMcpTools();  // Loads ALL available tools
    const system = await getSystemPrompt({ ... });  // Gets system prompt
    
    return {
        model: model || DEFAULT_MODEL,
        system,
        messages: messagesWithRichFiles.slice(-MAX_MESSAGES),
        tools,  // Includes create_new_artist tool
        prepareStep: (options) => {
            const next = getPrepareStepResult(options);  // TOOL CHAIN TRIGGER!
            if (next) return { ...options, ...next };
            return options;
        }
    };
}
```

### Step 12: Load Available Tools
**Location:** `lib/tools/getMcpTools.ts` (lines 38-80)
```typescript
export async function getMcpTools() {
    const tools = {
        create_new_artist: createArtist,  // <-- THE ENTRY POINT TOOL
        get_spotify_search: getSpotifySearch,
        update_account_info: updateAccountInfo,
        // ... 70+ other tools
    };
    return tools;
}
```

## Part 3: AI Processing & Tool Execution

### Step 13: AI Processes Message
**What happens:**
1. AI receives message: "create a new artist"
2. AI has access to all tools including `create_new_artist`
3. AI decides to call `create_new_artist` tool
4. AI must provide: name, account_id (from context)

### Step 14: AI Calls create_new_artist Tool
**Location:** `lib/tools/createArtist.tsx` (lines 18-99)
```typescript
const createArtist = tool({
    description: `
    Create a new artist account in the system...
    always follow this tool loop:
    <tool_loop>
        create_new_artist - create a new artist account
        get_spotify_search - check for Spotify data
        update_account_info - update profile picture
        update_artist_socials - add social profiles
        artist_deep_research - conduct comprehensive research
    </tool_loop>
    
    IMPORTANT: After creating the artist, you MUST continue with these steps...
    `,
    execute: async ({ name, account_id, active_conversation_id }) => {
        // Step 1: Create artist in database
        const artist = await createArtistInDb(name, account_id);
        
        // Step 2: Copy conversation room
        if (active_conversation_id) {
            newRoomId = await copyRoom(active_conversation_id, artist.account_id);
        }
        
        return {
            artist,
            artistAccountId: artist.account_id,
            message: "Successfully created artist...",
            newRoomId
        };
    }
});
```

### Step 15: Tool Chain Automatically Triggers
**Location:** `lib/chat/toolChains/getPrepareStepResult.ts` (lines 16-76)
```typescript
const getPrepareStepResult = (options: PrepareStepOptions) => {
    const executedTimeline = getExecutedToolTimeline(steps);
    
    for (const [trigger, sequenceAfter] of Object.entries(TOOL_CHAINS)) {
        // If "create_new_artist" was called...
        const triggerIndex = executedTimeline.indexOf(trigger);
        if (triggerIndex === -1) continue;
        
        // Return next tool in the chain
        if (sequencePosition < fullSequence.length) {
            const nextToolItem = fullSequence[sequencePosition];
            return {
                toolChoice: { type: "tool", toolName: nextToolItem.toolName }
            };
        }
    }
};
```

### Step 16: Tool Chain Mapping
**Location:** `lib/chat/toolChains/toolChains.ts` (lines 26-36)
```typescript
export const TOOL_CHAINS: Record<string, readonly ToolChainItem[]> = {
    create_new_artist: createNewArtistToolChain,  // Maps to 17-step chain
    create_release_report: createReleaseReportToolChain,
};
```

### Step 17: The 17-Step Tool Chain Executes
**Location:** `lib/chat/toolChains/createNewArtistToolChain.ts` (lines 4-35)
```typescript
export const createNewArtistToolChain: ToolChainItem[] = [
    { toolName: "get_spotify_search" },                // Step 1
    { toolName: "update_account_info", system: "..." }, // Step 2
    { toolName: "update_artist_socials" },             // Step 3
    { toolName: "artist_deep_research" },              // Step 4
    { toolName: "spotify_deep_research" },             // Step 5
    { toolName: "get_artist_socials" },                // Step 6
    { toolName: "get_spotify_artist_top_tracks" },     // Step 7
    { toolName: "get_spotify_artist_albums" },         // Step 8
    { toolName: "get_spotify_album" },                 // Step 9
    { toolName: "search_web" },                        // Step 10
    { toolName: "update_artist_socials" },             // Step 11
    { toolName: "web_deep_research", messages: [...] }, // Step 12
    { toolName: "create_knowledge_base", messages: [...] }, // Step 13
    { toolName: "generate_txt_file", messages: [...] },    // Step 14
    { toolName: "update_account_info" },               // Step 15
    { toolName: "create_segments" },                   // Step 16
    { toolName: "youtube_login" }                      // Step 17
];
```

## Part 4: How Tool Chain Orchestration Works

### The prepareStep Function
After EACH tool execution, `prepareStep` is called:
1. It checks what tools have been executed so far
2. It looks up if any executed tool is a "trigger" in TOOL_CHAINS
3. If yes, it returns the next tool in that chain
4. This FORCES the AI to call the next tool in sequence

### Example Flow:
1. AI calls `create_new_artist` → Creates artist in DB
2. prepareStep sees `create_new_artist` was called
3. prepareStep returns `{ toolChoice: { toolName: "get_spotify_search" }}`
4. AI is FORCED to call `get_spotify_search` next
5. After `get_spotify_search` completes...
6. prepareStep returns `{ toolChoice: { toolName: "update_account_info" }}`
7. This continues for all 17 steps

## Part 5: What Each Tool Does

### Tool 1: `get_spotify_search`
- Searches Spotify for artist name
- Returns array of potential matches with IDs, images, popularity

### Tool 2: `update_account_info`
- AI selects best match from results
- Updates artist profile with name, image, label

### Tool 3-17: [Continues with all tools...]
- Each tool collects specific data
- Results build comprehensive artist profile

## Summary

**The Complete Flow:**
1. User clicks "New Artist" → URL: `/?q=create a new artist`
2. Chat auto-sends message to API
3. AI calls `create_new_artist` tool
4. Tool chain automatically executes 17 steps
5. Artist profile complete with research

**Key Components:**
- **Entry Point:** UI button calling `toggleCreation()`
- **Message Routing:** Query param → Chat message → API
- **Tool Trigger:** `create_new_artist` tool
- **Orchestration:** `prepareStep` + `TOOL_CHAINS` mapping
- **Execution:** 17 automatic sequential tool calls