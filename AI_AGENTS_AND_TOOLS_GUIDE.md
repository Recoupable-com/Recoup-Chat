# AI Agents & Tools Architecture Guide

## Overview

This document explains the **multi-agent architecture** used in this financial assistant application. The system uses a **specialized agent pattern** where different AI agents handle specific domains (like reports, customers, analytics) and use **tools** to interact with data sources.

---

## 📂 Directory Structure

```
src/ai/
├── agents/                    # AI agents (specialized assistants)
│   ├── triage.ts             # Router agent (entry point)
│   ├── general.ts            # General assistant & coordinator
│   ├── analytics.ts          # Forecasting & business intelligence
│   ├── customers.ts          # Customer management
│   ├── invoices.ts           # Invoice operations
│   ├── operations.ts         # Account operations
│   ├── reports.ts            # Financial reports
│   ├── time-tracking.ts      # Time tracking
│   ├── transactions.ts       # Transaction queries
│   ├── shared.ts             # Shared configuration & utilities
│   └── *.md                  # Templates & instructions
│
└── tools/                     # Tool implementations (agent capabilities)
    ├── analytics/            # Analytics tools
    ├── customers/            # Customer management tools
    ├── invoices/             # Invoice tools
    ├── operations/           # Operations tools
    ├── reports/              # Financial reporting tools
    ├── search/               # Web search tools
    ├── tracker/              # Time tracking tools
    └── transactions/         # Transaction tools
```

---

## 🤖 What Are Agents?

**Agents** are specialized AI assistants that handle specific domains. Think of them as different departments in a company:
- The **Reports Agent** is like your CFO who knows all about financial metrics
- The **Customer Agent** is like your CRM specialist
- The **Analytics Agent** is like your business intelligence analyst

### Key Agent Concepts

#### 1. **Agent Configuration**
Each agent is configured with:
- **Name**: Unique identifier (e.g., "reports", "customers")
- **Model**: Which LLM to use (e.g., GPT-4o, GPT-4o-mini)
- **Instructions**: System prompt that defines behavior and personality
- **Tools**: Functions the agent can call to get data or take actions
- **Handoffs**: Other agents this agent can transfer to
- **maxTurns**: Maximum conversation rounds

#### 2. **The Triage Agent (Router)**
The **triage agent** is the entry point for all user requests. It's like a receptionist who routes visitors to the right department.

```typescript
// From: triage.ts
export const triageAgent = createAgent({
  name: "triage",
  model: openai("gpt-4o-mini"),
  modelSettings: {
    toolChoice: "required",  // Must route every request
    activeTools: ["handoff_to_agent"],
  },
  instructions: (ctx: AppContext) => `You are a routing specialist...
  
  ROUTING RULES:
  - "runway" OR "burn rate" → reports
  - "forecast" OR "health score" → analytics
  - "customer" → customers
  - Greetings or complex queries → general
  ...`
});
```

**How it works:**
1. User sends a message
2. Triage agent analyzes the request
3. Routes to the appropriate specialist agent
4. The specialist handles the request and responds

#### 3. **The General Agent (Coordinator)**
The **general agent** handles:
- Greetings and general questions
- Web searches for current information
- Complex queries that need multiple specialists
- Coordination between different agents

```typescript
// From: general.ts
export const generalAgent = createAgent({
  name: "general",
  model: openai("gpt-4o"),
  instructions: (ctx) => `You are a general assistant...
  
  CRITICAL WORKFLOW FOR MULTI-STEP QUERIES:
  1. Identify if query needs multiple data sources
  2. CALL ALL TOOLS IN ONE STEP - Use parallel tool calling
  3. Synthesize results into one complete answer
  ...`,
  tools: (ctx) => ({
    webSearch: createWebSearchTool(ctx),  // Can search the web
  }),
  handoffs: [
    operationsAgent,
    reportsAgent,
    analyticsAgent,
    // ... can transfer to all specialists
  ]
});
```

#### 4. **Specialist Agents**
Each specialist agent focuses on one domain:

**Reports Agent** - Financial metrics and reporting
```typescript
export const reportsAgent = createAgent({
  name: "reports",
  model: openai("gpt-4o-mini"),
  instructions: (ctx) => `You are a financial reports specialist...`,
  tools: {
    revenue: revenueDashboardTool,
    profitLoss: profitLossTool,
    cashFlow: cashFlowTool,
    balanceSheet: balanceSheetTool,
    expenses: expensesTool,
    burnRate: burnRateMetricsTool,
    runway: runwayMetricsTool,
    spending: spendingMetricsTool,
    taxSummary: taxSummaryTool,
  }
});
```

**Analytics Agent** - Forecasting and predictions
```typescript
export const analyticsAgent = createAgent({
  name: "analytics",
  model: openai("gpt-4o"),
  instructions: (ctx) => `You are an analytics specialist...`,
  tools: {
    businessHealth: businessHealthScoreTool,
    cashFlowForecast: cashFlowForecastTool,
    stressTest: cashFlowStressTestTool,
  }
});
```

**Customers Agent** - Customer relationship management
```typescript
export const customersAgent = createAgent({
  name: "customers",
  model: openai("gpt-4o-mini"),
  instructions: (ctx) => `You are a customer management specialist...`,
  tools: {
    getCustomer: getCustomerTool,
    getCustomers: getCustomersTool,
    createCustomer: createCustomerTool,
    updateCustomer: updateCustomerTool,
    profitabilityAnalysis: customerProfitabilityTool,
  }
});
```

---

## 🛠️ What Are Tools?

**Tools** are functions that agents can call to:
- **Retrieve data** (get customer info, fetch transactions)
- **Perform calculations** (calculate burn rate, forecast cash flow)
- **Take actions** (create invoice, update customer)
- **Search external sources** (web search)

### Tool Structure

Every tool follows the same pattern:

```typescript
import { tool } from "ai";
import { z } from "zod";

export const exampleTool = tool({
  // Human-readable description for the AI
  description: `What this tool does and when to use it`,
  
  // Input parameters with validation using Zod
  inputSchema: z.object({
    paramName: z.string().describe("What this parameter is for"),
    optionalParam: z.number().optional().describe("Optional parameter"),
  }),
  
  // The actual function that gets executed
  execute: async (params) => {
    // Your logic here
    const result = await fetchData(params);
    return result;
  },
});
```

### Real Example: Get Customers Tool

```typescript
// From: tools/customers/get-customers.ts
export const getCustomersTool = tool({
  description: `Get a list of customers with optional filtering and sorting`,

  inputSchema: z.object({
    limit: z
      .number()
      .optional()
      .describe("Maximum number of customers to return (default: 10)"),
    sortBy: z
      .enum(["revenue", "name", "created"])
      .optional()
      .describe("Sort customers by revenue, name, or creation date"),
    sortOrder: z
      .enum(["asc", "desc"])
      .optional()
      .describe("Sort order"),
    tags: z
      .array(z.string())
      .optional()
      .describe("Filter by customer tags (e.g., VIP, Enterprise)"),
  }),

  execute: async (params) => {
    // Generate/fetch customer data
    const customers = fetchCustomers(params);
    
    // Apply filters and sorting
    const filtered = applyFilters(customers, params.tags);
    const sorted = sortCustomers(filtered, params.sortBy, params.sortOrder);
    
    return {
      customers: sorted.slice(0, params.limit),
      total: filtered.length,
      returned: sorted.length,
    };
  },
});
```

### Tool Organization

Tools are organized by domain in subdirectories:

```
tools/
├── analytics/
│   ├── index.ts                      # Exports all analytics tools
│   ├── business-health-score.ts     # Calculate health metrics
│   ├── cash-flow-forecast.ts        # Predict future cash flow
│   └── cash-flow-stress-test.ts     # Scenario testing
│
├── customers/
│   ├── index.ts                      # Exports all customer tools
│   ├── get-customer.ts               # Fetch single customer
│   ├── get-customers.ts              # List customers
│   ├── create-customer.ts            # Create new customer
│   ├── update-customer.ts            # Update customer info
│   └── profitability-analysis.ts    # Analyze customer profit
│
└── reports/
    ├── index.ts                      # Exports all report tools
    ├── burn-rate.ts                  # Cash consumption metrics
    ├── runway.ts                     # Time until funds run out
    ├── revenue.ts                    # Revenue dashboard
    ├── profit-loss.ts                # P&L statement
    └── balance-sheet.ts              # Balance sheet report
```

Each domain has an `index.ts` that exports all tools:

```typescript
// tools/customers/index.ts
export { createCustomerTool } from "./create-customer";
export { getCustomerTool } from "./get-customer";
export { getCustomersTool } from "./get-customers";
export { updateCustomerTool } from "./update-customer";
export { customerProfitabilityTool } from "./profitability-analysis";
```

---

## 🔄 The Complete Request Flow: From User Query to Response

Understanding how a user query travels through the system is crucial. Let's trace the **complete journey** from the moment a user sends a message.

### The Big Picture

```
User Query
    ↓
API Route (/api/chat)
    ↓
Build Context (user info, date/time, locale)
    ↓
Triage Agent (analyzes & routes)
    ↓
Specialist Agent (executes tools)
    ↓
Tools (fetch/calculate data)
    ↓
Specialist Agent (formats response)
    ↓
Streaming Response to User
```

---

## 🎯 Step-by-Step: What Happens When a User Sends a Message

### Step 1: User Sends Message

User types in the chat: **"What's my burn rate?"**

The frontend sends a POST request to `/api/chat`:

```typescript
POST /api/chat
{
  "message": "What's my burn rate?",
  "id": "chat-123",
  "agentChoice": null,
  "toolChoice": null
}
```

### Step 2: API Route Receives Request

The Next.js API route handles the request:

```typescript
// From: app/api/chat/route.ts
export async function POST(request: NextRequest) {
  // 1. Rate limiting check
  const ip = getClientIP(request);
  const { success, remaining } = await checkRateLimit(ip);
  
  if (!success) {
    return new Response("Rate limit exceeded", { status: 429 });
  }

  // 2. Parse incoming message
  const { message, id, agentChoice, toolChoice } = await request.json();

  // 3. Build application context
  const userId = `user-${ip}`;
  const appContext = buildAppContext({
    userId,
    fullName: "John Doe",
    companyName: "Acme Inc.",
    baseCurrency: "USD",
    locale: "en-US",
    timezone: "America/New_York",
    country: "US",
    city: "New York",
    region: "New York",
    chatId: id,
  });

  // 4. Pass to triage agent
  return triageAgent.toUIMessageStream({
    message,
    strategy: "auto",
    maxRounds: 5,     // Up to 5 rounds of agent handoffs
    maxSteps: 20,     // Up to 20 total tool calls
    context: appContext,
    agentChoice,      // Optional: force specific agent
    toolChoice,       // Optional: force specific tool
    experimental_transform: smoothStream({ chunking: "word" }),
    sendReasoning: true,   // Include agent reasoning
    sendSources: true,     // Include source citations
  });
}
```

**What's happening here:**
- Rate limiting protects the API
- Context is built with **current date/time** (important for time-sensitive queries)
- Context includes user preferences (locale, currency, timezone)
- The triage agent receives the message and context

### Step 3: Triage Agent Analyzes the Query

The triage agent is configured as a **router**:

```typescript
// From: agents/triage.ts
export const triageAgent = createAgent({
  name: "triage",
  model: openai("gpt-4o-mini"),  // Fast, efficient model for routing
  modelSettings: {
    toolChoice: "required",        // MUST use a tool (can't respond directly)
    activeTools: ["handoff_to_agent"],  // Only has handoff capability
  },
  instructions: (ctx) => `You are a routing specialist. Your ONLY job is to route requests to the appropriate agent.

ROUTING RULES:
- "runway" OR "burn rate" OR "revenue" OR "profit" OR "loss" → **reports**
- "balance sheet" OR "assets" OR "liabilities" OR "equity" → **reports**
- "account balance" OR "bank balance" → **operations**
- "forecast" OR "health score" OR "stress test" → **analytics**
- "transaction" OR "spending" → **transactions**
- "invoice" → **invoices**
- "customer" → **customers**
- "time" OR "tracking" → **timeTracking**
- Greetings, unclear, or complex multi-specialist → **general**

AGENT CAPABILITIES:
**reports** - Financial metrics: revenue, P&L, burn rate, runway, cash flow, balance sheet
**operations** - Account operations: balances, inbox, documents, exports
**analytics** - Forecasting: business health, predictions, stress testing
**transactions** - Transaction queries and search
**invoices** - Invoice management
**customers** - Customer management and profitability
**timeTracking** - Time tracking and entries
**general** - Everything else: greetings, web search, compound queries

${formatContextForLLM(ctx)}`,
  handoffs: [
    generalAgent,
    operationsAgent,
    reportsAgent,
    analyticsAgent,
    transactionsAgent,
    invoicesAgent,
    timeTrackingAgent,
    customersAgent,
  ],
  maxTurns: 1,  // Only 1 turn - route and done
});
```

**Key Configuration Details:**

1. **`toolChoice: "required"`** - The agent MUST call a tool, it cannot respond directly to the user
2. **`activeTools: ["handoff_to_agent"]`** - Only the handoff tool is available
3. **`maxTurns: 1`** - Only gets one chance to route, then it's done
4. **Instructions** - Clear routing rules based on keywords

### Step 4: Triage Makes Routing Decision

The triage agent analyzes: **"What's my burn rate?"**

**Internal reasoning:**
```
Analyzing query: "What's my burn rate?"
- Contains keyword: "burn rate"
- Routing rule: "burn rate" → **reports**
- Decision: Hand off to reports agent
```

The agent calls the `handoff_to_agent` tool:

```typescript
// Internal tool call (generated by AI)
{
  tool: "handoff_to_agent",
  parameters: {
    agent: "reports",
    message: "What's my burn rate?",
    context: "User asking about burn rate metric"
  }
}
```

### Step 5: Handoff to Reports Agent

The system transfers control to the Reports Agent:

```typescript
// From: agents/reports.ts
export const reportsAgent = createAgent({
  name: "reports",
  model: openai("gpt-4o-mini"),
  instructions: (ctx) => `You are a financial reports specialist for ${ctx.companyName}.

Provide clear, concise financial metrics with key numbers and brief context.

CURRENT DATE: ${ctx.currentDateTime}
Use this for calculating "this quarter", "last month", "this year", etc.
...`,
  tools: {
    revenue: revenueDashboardTool,
    profitLoss: profitLossTool,
    cashFlow: cashFlowTool,
    balanceSheet: balanceSheetTool,
    expenses: expensesTool,
    burnRate: burnRateMetricsTool,  // ← This is what we need!
    runway: runwayMetricsTool,
    spending: spendingMetricsTool,
    taxSummary: taxSummaryTool,
  },
  maxTurns: 5,  // Can take up to 5 turns to complete task
});
```

**The Reports Agent receives:**
- Original message: "What's my burn rate?"
- Full context (user, company, date/time)
- Its available tools
- Its instructions

### Step 6: Reports Agent Selects and Calls Tool

The Reports Agent analyzes the request:

**Internal reasoning:**
```
User wants: burn rate
Available tools: I have a burnRate tool
Action: Call burnRate tool with appropriate parameters
```

The agent calls the tool:

```typescript
// Tool call generated by the AI
{
  tool: "burnRate",
  parameters: {
    from: "2024-01-01",      // Infers date range from current date
    to: "2024-12-31",
    currency: "USD"          // From context
  }
}
```

### Step 7: Burn Rate Tool Executes

```typescript
// From: tools/reports/burn-rate.ts
export const burnRateMetricsTool = tool({
  description: `Get burn rate metrics showing monthly cash consumption`,
  
  inputSchema: dateRangeSchema.merge(currencyFilterSchema),
  
  execute: async ({ from, to, currency }) => {
    // Fetch actual data (or generate for demo)
    return generateBurnRateMetrics({ from, to, currency });
  },
});
```

**Tool returns data:**
```typescript
{
  monthlyBurnRate: 50000,
  averageBurnRate: 48500,
  trend: "increasing",
  previousPeriodBurn: 45000,
  changePercent: 11.1,
  monthlyBreakdown: [
    { month: "2024-01", burn: 45000 },
    { month: "2024-02", burn: 47000 },
    { month: "2024-03", burn: 50000 },
    // ... more months
  ],
  currency: "USD"
}
```

### Step 8: Reports Agent Formats Response

The Reports Agent receives the tool result and formats it for the user:

**Internal reasoning:**
```
Tool returned burn rate data:
- Current: $50,000/month
- Average: $48,500/month
- Trend: increasing by 11.1%

Format as: Concise answer with key numbers
```

**Agent generates response:**
```
Your monthly burn rate is $50,000, averaging $48,500 over the year. 
The trend shows an 11% increase from the previous period, rising 
from $45,000 to $50,000 per month. This acceleration in spending 
is worth monitoring closely.
```

### Step 9: Response Streams to User

The response is streamed back through the API route to the frontend:

```typescript
// Streaming format
{
  type: "text-delta",
  content: "Your monthly burn rate is $50,000..."
}
{
  type: "tool-call",
  toolName: "burnRate",
  args: { from: "2024-01-01", to: "2024-12-31" }
}
{
  type: "tool-result",
  toolName: "burnRate",
  result: { monthlyBurnRate: 50000, ... }
}
{
  type: "finish",
  finishReason: "stop"
}
```

The user sees the response appear word-by-word in the chat interface.

---

## 📊 Visual Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│  USER: "What's my burn rate?"                               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  API ROUTE: /api/chat                                       │
│  ✓ Rate limiting                                            │
│  ✓ Build context (date/time, user info, locale)            │
│  ✓ Pass to triage agent                                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  TRIAGE AGENT (Router)                                      │
│  • Analyzes: "burn rate" keyword found                      │
│  • Decision: Route to "reports" agent                       │
│  • Action: handoff_to_agent("reports")                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  REPORTS AGENT (Specialist)                                 │
│  • Receives: Original message + context                     │
│  • Analyzes: User wants burn rate metric                    │
│  • Action: Call burnRate tool                               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  BURN RATE TOOL                                             │
│  • Execute: Fetch/calculate burn rate data                  │
│  • Returns: { monthlyBurnRate: 50000, trend: "up", ... }   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  REPORTS AGENT (Formatting)                                 │
│  • Receives: Tool result with data                          │
│  • Formats: Clear, concise answer                           │
│  • Generates: "Your monthly burn rate is $50,000..."        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  RESPONSE STREAM                                            │
│  ✓ Streams back through API                                 │
│  ✓ User sees response word-by-word                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔀 Different Routing Scenarios

### Scenario 1: Simple Query (Direct Specialist)

**User:** "List my top customers"

```
User → API → Triage → Customers Agent → getCustomers tool → Response
           (keyword: "customer")
```

**Flow:**
1. Triage sees "customer" → routes to `customersAgent`
2. Customers Agent calls `getCustomers` tool
3. Tool returns customer list
4. Agent formats as table
5. User sees customer list

---

### Scenario 2: Greeting (General Agent)

**User:** "Hello!"

```
User → API → Triage → General Agent → Response (no tools needed)
           (greeting detected)
```

**Flow:**
1. Triage sees greeting → routes to `generalAgent`
2. General Agent responds with greeting (no tools needed)
3. User sees welcome message

---

### Scenario 3: Complex Multi-Step Query

**User:** "Can I afford to hire someone at $120k? Check my balance and runway."

```
User → API → Triage → General Agent → Multiple Tool Calls
           (complex query)          ↓
                                    ├─→ Handoff to Operations → getBalances
                                    └─→ Handoff to Reports → runway
                                    ↓
                            Synthesis & Response
```

**Flow:**
1. Triage sees complex query → routes to `generalAgent`
2. General Agent identifies need for:
   - Current balance (operations)
   - Runway calculation (reports)
3. General Agent makes **parallel handoffs**:
   - Hands off to Operations Agent → gets balance: $600k
   - Hands off to Reports Agent → gets runway: 12 months
4. General Agent **synthesizes** the information:
   - Current burn: $50k/month
   - New hire cost: $10k/month ($120k/year)
   - New burn: $60k/month
   - New runway: 10 months
5. General Agent responds with complete analysis
6. User sees comprehensive answer

---

### Scenario 4: Ambiguous Query

**User:** "What's my revenue?"

```
User → API → Triage → Reports Agent → revenue tool → Response
           (keyword: "revenue")
```

**Flow:**
1. Triage sees "revenue" → routes to `reportsAgent`
2. Reports Agent calls `revenue` tool with inferred date range
3. Tool returns revenue data
4. Agent formats response with key numbers
5. User sees revenue summary

---

## 🎛️ Triage Configuration Explained

Let's break down the triage agent configuration:

### 1. Model Selection

```typescript
model: openai("gpt-4o-mini")
```

**Why gpt-4o-mini?**
- Routing is a simple classification task
- Doesn't need advanced reasoning
- Fast and cost-effective
- Perfect for keyword matching and pattern recognition

### 2. Tool Choice: Required

```typescript
modelSettings: {
  toolChoice: "required",
  activeTools: ["handoff_to_agent"],
}
```

**Why required?**
- Triage agent should **never** respond directly to users
- It must **always** route to a specialist
- This prevents the triage agent from trying to answer questions
- Forces a routing decision every time

**What this means:**
- Agent cannot say "I don't know" or chat with users
- Agent must pick an agent to hand off to
- If unsure → routes to `generalAgent` (the catch-all)

### 3. Max Turns: 1

```typescript
maxTurns: 1
```

**Why only 1 turn?**
- Triage has one job: route the request
- After routing, it's done - the specialist takes over
- Prevents triage from staying in the conversation
- Clean handoff pattern

### 4. Routing Instructions

The instructions include:

**A. Keyword-Based Rules**
```
- "runway" OR "burn rate" → reports
- "customer" → customers
- "forecast" → analytics
```

**B. Agent Capabilities**
```
**reports** - Financial metrics: revenue, P&L, burn rate
**analytics** - Forecasting: health score, predictions
**general** - Everything else
```

**C. Catch-All**
```
Greetings, unclear, or complex → general
```

This ensures **every query** gets routed somewhere.

---

## 🧪 How Triage Handles Edge Cases

### Edge Case 1: Multiple Keywords

**User:** "Show me revenue and customers"

**Triage Logic:**
- Detects both "revenue" (→ reports) and "customers" (→ customers)
- Complex query with multiple domains
- **Routes to:** `generalAgent`
- General Agent then coordinates handoffs to both specialists

### Edge Case 2: Unclear Query

**User:** "What's going on?"

**Triage Logic:**
- No clear keywords
- Ambiguous intent
- **Routes to:** `generalAgent`
- General Agent asks clarifying questions or provides general help

### Edge Case 3: Typos/Variations

**User:** "What's my burn-rate?"

**Triage Logic:**
- LLM understands "burn-rate" = "burn rate"
- Semantic understanding beyond exact keywords
- **Routes to:** `reportsAgent`

### Edge Case 4: Conversational Context

**User:** "How about last quarter?"

**Triage Logic:**
- Needs conversation history
- Context-dependent query
- **Routes to:** `generalAgent`
- General Agent has access to memory and conversation history

---

## 🔧 How to Modify Triage Routing

### Adding a New Route

Let's say you add a "Products Agent":

```typescript
export const triageAgent = createAgent({
  // ... existing config
  instructions: (ctx) => `...
  
  ROUTING RULES:
  // ... existing rules
  - "product" OR "inventory" OR "SKU" OR "stock" → **products**  // NEW
  
  AGENT CAPABILITIES:
  // ... existing capabilities
  **products** - Product inventory, stock levels, SKU management  // NEW
  ...`,
  handoffs: [
    // ... existing handoffs
    productsAgent,  // NEW - add to handoffs array
  ],
});
```

### Adjusting Route Priority

If queries are being misrouted:

1. **Make keywords more specific:**
   ```typescript
   - "account balance" → operations  // More specific
   - "balance" → general             // Less specific (catch-all)
   ```

2. **Add examples to instructions:**
   ```typescript
   ROUTING EXAMPLES:
   - "What's my runway?" → reports
   - "Show account balance" → operations
   - "Hello" → general
   ```

3. **Test with edge cases:**
   - "balance sheet" vs "account balance"
   - "customer profitability" (customers or analytics?)

---

## 💡 Key Takeaways: How Triage Works

1. **Triage is the Entry Point**
   - Every user message goes through triage first
   - Acts like a receptionist routing calls

2. **Simple but Powerful**
   - Uses keyword matching + semantic understanding
   - Fast model (gpt-4o-mini) for efficiency
   - Clear routing rules

3. **Must Always Route**
   - `toolChoice: "required"` forces a decision
   - Can't respond directly to users
   - If unsure → routes to general agent

4. **One Turn Only**
   - `maxTurns: 1` means route and done
   - Clean handoff to specialists
   - Specialist takes over completely

5. **Context Flows Through**
   - User message passes to specialist
   - Full context (date/time, user info) included
   - Conversation history maintained

6. **Fallback to General**
   - Complex queries → general agent
   - Greetings → general agent
   - Unclear queries → general agent
   - General agent is the "catch-all"

---

## 📝 Summary: The Power of Multi-Agent Architecture

The combination of agents and tools creates a powerful, modular system:

1. **Triage** routes efficiently with keyword + semantic understanding
2. **Specialists** have deep domain expertise and appropriate tools
3. **General** coordinates complex queries across multiple domains
4. **Tools** provide actual capabilities (data retrieval, calculations)
5. **Context** flows seamlessly through the entire journey
6. **Memory** maintains continuity across conversations

This architecture is **scalable** - you can add new agents and tools without modifying the core routing logic

---

## 🧩 Shared Configuration

### Context System

All agents share the same **AppContext** that provides:
- User information (name, company)
- Current date/time
- Locale and currency settings
- Timezone

```typescript
// From: shared.ts
export interface AppContext {
  userId: string;
  fullName: string;
  companyName: string;
  baseCurrency: string;
  locale: string;
  currentDateTime: string;  // Always fresh
  country?: string;
  city?: string;
  region?: string;
  timezone: string;
  chatId: string;
}
```

This context is built **per-request** to ensure current date/time:

```typescript
export function buildAppContext(params: {...}): AppContext {
  const now = new Date();
  return {
    ...params,
    currentDateTime: now.toISOString(),  // Fresh timestamp
    baseCurrency: params.baseCurrency || "USD",
    locale: params.locale || "en-US",
  };
}
```

### Memory System

Agents use **working memory** to remember user preferences and context:

```typescript
// From: shared.ts
export const createAgent = (config: AgentConfig<AppContext>) => {
  return new Agent<AppContext>({
    ...config,
    memory: {
      provider: memoryProvider,      // Upstash Redis
      history: {
        enabled: true,
        limit: 10,                    // Keep last 10 messages
      },
      workingMemory: {
        enabled: true,
        template: memoryTemplate,     // Template from memory-template.md
        scope: "user",                // Per-user memory
      },
      chats: {
        enabled: true,
        generateTitle: {              // Auto-generate chat titles
          model: openai("gpt-4.1-nano"),
          instructions: "Generate a short, focused title..."
        },
        generateSuggestions: {        // Suggest follow-up questions
          enabled: true,
          model: openai("gpt-4.1-nano"),
          limit: 5,
          instructions: suggestionsInstructions,
        },
      },
    }
  });
};
```

The **memory template** (from `memory-template.md`) guides what to remember:

```markdown
# Financial Assistant Memory

## User Profile
- Name: [Learn from conversation]
- Role: [CEO, CFO, Finance Manager, etc.]

## Financial Focus
- Key Metrics: [Revenue, burn rate, runway, cash flow, etc.]
- Recent Concerns: [Financial issues or questions mentioned]

## Business Context
- Industry: [If mentioned]
- Growth Stage: [Startup, Scale-up, Established]

## Preferences
- Communication Style: [Formal vs casual, technical vs simplified]
```

---

## 🎯 Design Patterns & Best Practices

### 1. **Single Responsibility Principle**
Each agent has ONE clear purpose:
- ✅ Reports Agent = Financial reports only
- ✅ Customer Agent = Customer operations only
- ❌ Don't mix concerns

### 2. **Tool Naming Convention**
Tools follow consistent naming:
- **get** = Retrieve single item (`getCustomer`, `getInvoice`)
- **list** = Retrieve multiple items (`listInvoices`, `listTransactions`)
- **create** = Create new item (`createCustomer`, `createInvoice`)
- **update** = Modify existing item (`updateCustomer`, `updateInvoice`)
- **delete** = Remove item (`deleteTimeEntry`)

### 3. **Agent Instructions Pattern**
Every agent's instructions follow this structure:

```typescript
instructions: (ctx: AppContext) => `You are a [ROLE] for ${ctx.companyName}.

CORE RULES:
1. USE TOOLS IMMEDIATELY - Get data, don't ask for it
2. BE CONCISE - One clear answer with key details
3. COMPLETE THE TASK - Provide actionable information

RESPONSE STYLE:
- Lead with the key information
- Brief context if needed
- Natural conversational tone
- Use "your" to make it personal

${formatContextForLLM(ctx)}`  // Inject current context
```

### 4. **Parallel Tool Calls**
Agents are configured to call multiple tools simultaneously for efficiency:

```typescript
export const createAgent = (config) => {
  return new Agent({
    modelSettings: {
      parallel_tool_calls: true,  // Enable parallel execution
    },
    ...config
  });
};
```

### 5. **Handoff Strategy**
- **Triage Agent**: Routes to specialists (maxTurns: 1)
- **General Agent**: Coordinates complex queries (maxTurns: 5)
- **Specialist Agents**: Handle their domain (maxTurns: 5)

### 6. **Model Selection**
Different models for different needs:
- **GPT-4o**: Complex analysis, synthesis (General, Analytics)
- **GPT-4o-mini**: Straightforward operations (Reports, Customers, Invoices)
- **GPT-4.1-nano**: Simple tasks (Title generation, suggestions)

---

## 📊 Tool Categories Explained

### Analytics Tools
**Purpose**: Forecasting and business intelligence

| Tool | Description |
|------|-------------|
| `businessHealthScoreTool` | Calculate comprehensive health score |
| `cashFlowForecastTool` | Predict future cash flow |
| `cashFlowStressTestTool` | Test scenarios and "what-if" analysis |

### Customer Tools
**Purpose**: Customer relationship management

| Tool | Description |
|------|-------------|
| `getCustomerTool` | Retrieve single customer details |
| `getCustomersTool` | List customers with filtering/sorting |
| `createCustomerTool` | Create new customer record |
| `updateCustomerTool` | Update customer information |
| `customerProfitabilityTool` | Analyze customer profitability |

### Report Tools
**Purpose**: Financial metrics and statements

| Tool | Description |
|------|-------------|
| `revenueDashboardTool` | Revenue metrics and breakdown |
| `profitLossTool` | P&L statement |
| `cashFlowTool` | Cash flow statement |
| `balanceSheetTool` | Balance sheet report |
| `expensesTool` | Expense analysis |
| `burnRateMetricsTool` | Monthly cash consumption |
| `runwayMetricsTool` | Time until funds depleted |
| `spendingMetricsTool` | Spending patterns |
| `taxSummaryTool` | Tax summary and estimates |

### Invoice Tools
**Purpose**: Invoice management

| Tool | Description |
|------|-------------|
| `listInvoicesTool` | List invoices with filters |
| `getInvoiceTool` | Get single invoice details |
| `createInvoiceTool` | Create new invoice |
| `updateInvoiceTool` | Update invoice (status, amount) |

### Operations Tools
**Purpose**: Account and system operations

| Tool | Description |
|------|-------------|
| `getBalancesTool` | Retrieve account balances |
| `listInboxItemsTool` | List inbox notifications |
| `listDocumentsTool` | List documents |
| `exportDataTool` | Export data to files |

### Time Tracking Tools
**Purpose**: Track time entries and projects

| Tool | Description |
|------|-------------|
| `getTimeEntriesTool` | List time entries |
| `createTimeEntryTool` | Create time entry |
| `updateTimeEntryTool` | Update time entry |
| `deleteTimeEntryTool` | Delete time entry |
| `startTimerTool` | Start tracking timer |
| `stopTimerTool` | Stop tracking timer |
| `getTrackerProjectsTool` | List projects for time tracking |

### Search Tools
**Purpose**: External information retrieval

| Tool | Description |
|------|-------------|
| `webSearch` | Search the web for current information |

---

## 🚀 How to Add a New Agent

Let's say you want to add a **"Products Agent"** to manage product inventory:

### Step 1: Create the Agent File

```typescript
// agents/products.ts
import { openai } from "@ai-sdk/openai";
import { 
  getProductTool, 
  listProductsTool,
  createProductTool,
  updateProductTool 
} from "../tools/products";
import { createAgent, formatContextForLLM } from "./shared";

export const productsAgent = createAgent({
  name: "products",
  model: openai("gpt-4o-mini"),
  instructions: (ctx) => `You are a product management specialist for ${ctx.companyName}.

CORE RULES:
1. USE TOOLS IMMEDIATELY - Get data, don't ask for it
2. BE CONCISE - One clear answer with key details
3. COMPLETE THE TASK - Provide actionable information

RESPONSE STYLE:
- Lead with the key information
- Present product details clearly (name, SKU, price, stock)
- For multiple products, use markdown tables
- Natural conversational tone
- Use "your" to make it personal

${formatContextForLLM(ctx)}`,
  tools: {
    getProduct: getProductTool,
    listProducts: listProductsTool,
    createProduct: createProductTool,
    updateProduct: updateProductTool,
  },
  maxTurns: 5,
});
```

### Step 2: Export from Index

```typescript
// agents/index.ts
export { productsAgent } from "./products";
// ... other exports
```

### Step 3: Add to Triage Routing

```typescript
// agents/triage.ts
import { productsAgent } from "./products";

export const triageAgent = createAgent({
  // ...
  instructions: (ctx) => `...
  ROUTING RULES:
  - "product" OR "inventory" OR "SKU" → **products**
  ...
  
  AGENT CAPABILITIES:
  **products** - Product inventory and management
  ...`,
  handoffs: [
    // ...other agents
    productsAgent,
  ],
});
```

### Step 4: Add to General Agent Handoffs

```typescript
// agents/general.ts
import { productsAgent } from "./products";

export const generalAgent = createAgent({
  // ...
  handoffs: [
    // ...other agents
    productsAgent,
  ],
});
```

---

## 🛠️ How to Add a New Tool

Let's add a `getProductTool`:

### Step 1: Create the Tool File

```typescript
// tools/products/get-product.ts
import { tool } from "ai";
import { z } from "zod";
import { fetchProduct } from "@/api/products";  // Your data source

export const getProductTool = tool({
  description: `Get detailed information about a specific product by ID or SKU`,

  inputSchema: z.object({
    productId: z
      .string()
      .optional()
      .describe("Product ID (e.g., PROD-123)"),
    sku: z
      .string()
      .optional()
      .describe("Product SKU (e.g., WIDGET-001)"),
  }),

  execute: async (params) => {
    // Validate at least one identifier is provided
    if (!params.productId && !params.sku) {
      throw new Error("Either productId or sku must be provided");
    }

    // Fetch product from your data source
    const product = await fetchProduct({
      id: params.productId,
      sku: params.sku,
    });

    if (!product) {
      return {
        success: false,
        error: "Product not found",
      };
    }

    return {
      success: true,
      product: {
        id: product.id,
        sku: product.sku,
        name: product.name,
        description: product.description,
        price: product.price,
        currency: product.currency,
        stockQuantity: product.stockQuantity,
        status: product.status,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      },
    };
  },
});
```

### Step 2: Create Index File

```typescript
// tools/products/index.ts
export { getProductTool } from "./get-product";
export { listProductsTool } from "./list-products";
export { createProductTool } from "./create-product";
export { updateProductTool } from "./update-product";
```

### Step 3: Use in Agent

Import and add to agent's tools (shown in Step 1 above).

---

## 💡 Key Concepts Summary

### For Agents:
- **Agents are specialists** - Each has one clear domain
- **Triage routes** - Entry point that directs traffic
- **General coordinates** - Handles complex multi-agent queries
- **Handoffs enable collaboration** - Agents can transfer to each other
- **Instructions define personality** - How the agent thinks and responds
- **Context provides environment** - Current date, user info, locale

### For Tools:
- **Tools are capabilities** - What agents can DO
- **Zod validates inputs** - Type-safe parameters
- **Descriptions guide AI** - Clear descriptions help AI choose correctly
- **Execute is the logic** - Your actual implementation
- **Organized by domain** - Grouped with related tools
- **Exported via index** - Clean imports for agents

### For the System:
- **Modular architecture** - Easy to add new agents/tools
- **Parallel execution** - Multiple tools can run simultaneously
- **Memory persists** - User context saved across conversations
- **Type-safe** - TypeScript + Zod ensure correctness
- **Scalable** - Add new domains without modifying existing code

---

## 🎓 Learning Path

If you're new to this architecture:

1. **Start with one agent** - Read `customers.ts` - it's straightforward
2. **Look at its tools** - Check `tools/customers/get-customers.ts`
3. **Trace a query** - Follow "get customers" from triage → agent → tool → response
4. **Examine the general agent** - See how it coordinates multiple agents
5. **Study the triage agent** - Understand the routing logic
6. **Try adding a tool** - Start simple, maybe a new customer filter
7. **Try adding an agent** - Create a simple domain agent

---

## 🔍 Common Patterns You'll See

### Pattern: Tool with Optional Filters

```typescript
inputSchema: z.object({
  limit: z.number().optional().default(10),
  sortBy: z.enum(["date", "amount", "name"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  status: z.array(z.string()).optional(),
}),
```

### Pattern: Date Range Filters

```typescript
import { dateRangeSchema } from "@/ai/types/filters";

inputSchema: dateRangeSchema.merge(
  z.object({
    // Additional params
  })
),
```

### Pattern: Currency Handling

```typescript
import { currencyFilterSchema } from "@/ai/types/filters";

inputSchema: currencyFilterSchema.merge(
  z.object({
    // Additional params
  })
),
```

### Pattern: Artifact Toggle

```typescript
inputSchema: z.object({
  useArtifact: z
    .boolean()
    .optional()
    .default(false)
    .describe("Generate interactive visualization"),
}),
```

### Pattern: Conditional Tool Response

```typescript
execute: async (params) => {
  const data = await fetchData();
  
  if (!data) {
    return {
      success: false,
      error: "No data found",
      message: "Try adjusting your filters",
    };
  }
  
  return {
    success: true,
    data: data,
    metadata: {
      total: data.length,
      filtered: true,
    },
  };
},
```

---

## 🎯 Next Steps

Now that you understand the architecture:

1. **Explore the codebase** - Read through different agents and tools
2. **Make small changes** - Adjust an agent's personality in instructions
3. **Add a new tool** - Create a simple tool for an existing agent
4. **Test handoffs** - See how agents collaborate
5. **Add a new agent** - Create a complete new domain specialist

Remember: This architecture is designed to be **modular** and **extensible**. You can add new capabilities without breaking existing functionality.

---

## 📚 Additional Resources

- **Agent Configuration**: See `@ai-sdk-tools/agents` package
- **Tool Creation**: See Vercel AI SDK documentation
- **Zod Validation**: [Zod documentation](https://zod.dev)
- **Memory System**: See `@ai-sdk-tools/memory` package

---

## Questions?

As you work with this architecture, you'll discover:
- How agents decide which tool to use
- When to hand off to another agent
- How to structure complex multi-step workflows
- Best practices for instruction engineering

The beauty of this system is that it **scales** - you can add as many agents and tools as you need without modifying the core architecture!

