# Nano Banana Implementation User Journey Analysis

## Complete User Flow Investigation

### **Step 1: Model Selection in Dropdown**
**File**: `components/ModelSelect/ModelSelect.tsx`
- User sees "Nano Banana" as display name in dropdown
- **Model ID**: When selected, sets `model = "fal-ai/nano-banana/edit"` (from featuredModels.ts line 28)
- **Storage**: Stored in localStorage as "RECOUP_MODEL" (useVercelChat.ts line 48-51)

### **Step 2: User Types Message and Sends**
**Flow**: User types "desk" → clicks send
- **Frontend**: `useVercelChat.ts` builds chat request with current model
- **Request Body**: `{ model: "fal-ai/nano-banana/edit", messages: [...], ...otherData }`
- **API Call**: POST to `/api/chat` with the request body

### **Step 3: Backend Processing**
**File**: `app/api/chat/route.ts`
- Receives ChatRequest with `model: "fal-ai/nano-banana/edit"`
- Calls `getExecute(options, body)` → `setupChatRequest(body)`

### **Step 4: Chat Request Setup**
**File**: `lib/chat/setupChatRequest.ts`
- Calls `handleNanoBananaModel(body)` with the ChatRequest
- **handleNanoBananaModel checks**: `if (model !== "fal-ai/nano-banana/edit")`
- **IF MATCH**: Returns `{ resolvedModel: "google/gemini-2.5-flash-lite", excludeTools: ["generate_image"] }`
- **Final Config**: Uses Google Flash as LLM, excludes regular image tool, includes nano banana tools

### **Step 5: Tool Availability**
**File**: `lib/tools/getMcpTools.ts`
- **Available Tools**: `nano_banana_generate` and `nano_banana_edit` (lines 45-46)
- **Excluded Tools**: `generate_image` is excluded when nano banana model selected
- **Final Tools**: Google Flash has access to nano banana tools but NOT regular image generation

### **Step 6: LLM Decision Making**
**Process**: Google Flash (gemini-2.5-flash-lite) receives:
- User prompt: "desk"
- Available tools: nano_banana_generate, nano_banana_edit (+ all other non-image tools)
- **LLM Decides**: Whether to call nano_banana_generate based on prompt analysis

### **Step 7: Tool Execution (If Called)**
**File**: `lib/tools/nanoBananaGenerate.ts`
- **Fal API Call**: `fal.subscribe("fal-ai/nano-banana")` 
- **Authentication**: Uses FAL_KEY environment variable
- **Result**: Returns image URL and description

### **Step 8: Image Editing Flow**
**User Action**: After image generated, user can ask to "make changes"
- **LLM Choice**: Google Flash should call `nano_banana_edit` tool
- **File**: `lib/tools/nanoBananaEdit.ts` 
- **Fal API Call**: `fal.subscribe("fal-ai/nano-banana/edit")`
- **Input**: Original image URL + edit prompt

## Potential Issues Identified

### **Issue 1: Tool Selection Logic**
**Problem**: Google Flash might not be calling nano banana tools for image requests
**Reason**: LLM might prefer other available tools or not recognize image generation need

### **Issue 2: Model Availability**
**Problem**: `"fal-ai/nano-banana/edit"` might not be in availableModels list
**Check**: Verify if getFalModels() output is included in final model list from /api/ai/models

### **Issue 3: Tool Filtering**
**Problem**: `filterExcludedTools()` might be removing nano banana tools incorrectly
**Check**: Verify tools array after filtering

### **Issue 4: Environment Configuration**
**Problem**: FAL_KEY might be missing/invalid causing tool failures
**Evidence**: "Unauthorized" error in your screenshot suggests API key issues

### **Issue 5: Prompt Context**
**Problem**: "desk" prompt might not trigger image generation in LLM
**Reason**: LLM might not interpret "desk" as requiring image generation

## Most Likely Root Cause
Based on the "Unauthorized" error in your screenshot, the issue is most likely **FAL_KEY configuration**. The flow is working (nano banana tool is being called), but failing at the Fal API level due to authentication issues.

## Architecture Summary
The nano banana implementation is sophisticated:
1. **Model Selection**: User selects display name, gets specific model ID
2. **Model Swapping**: Backend swaps fal model for Google Flash LLM  
3. **Tool Filtering**: Excludes competing image tools
4. **LLM Choice**: Google Flash chooses appropriate nano banana tool
5. **Tool Execution**: Direct Fal API calls with proper authentication

**The flow appears architecturally sound - issue is likely authentication or LLM tool selection.**
