# Unified Chain of Thought Implementation Plan

## Problem Analysis

### Current Architecture (Fragmented)
- **Multiple Chain of Thought dropdowns** - Each reasoning part creates a separate component
- **No visual connection** - Reasoning phases are isolated from each other
- **Fragmented narrative** - User can't see the complete AI thought process
- **Individual message parts** - Each `type: "reasoning"` part renders independently

### Target Architecture (Unified - Perplexity Style)
- **Single Chain of Thought container** - One continuous reasoning timeline per conversation
- **Accumulated steps** - Each reasoning part adds steps to the same timeline
- **Continuous vertical line** - Visual connection through entire conversation
- **Unified narrative** - Complete AI thought process visible in one place

## Technical Investigation

### Current Message Flow
```typescript
// Current: Each reasoning part renders separately
messages.map(message => 
  message.parts.map(part => {
    if (part.type === "reasoning") {
      return <EnhancedReasoning content={part.text} /> // Separate dropdown
    }
  })
)
```

### Required Architecture
```typescript
// Target: Accumulate all reasoning into single timeline
const allReasoningSteps = extractAllReasoningFromConversation(messages);
return (
  <UnifiedChainOfThought steps={allReasoningSteps} />
  // Then render messages without reasoning parts
)
```

### Key Files to Modify

#### Core Components
1. **`components/VercelChat/messages.tsx`** - Add unified Chain of Thought before messages
2. **`components/VercelChat/message.tsx`** - Skip rendering individual reasoning parts
3. **`components/reasoning/UnifiedChainOfThought.tsx`** - New unified component
4. **`lib/reasoning/extractConversationReasoning.ts`** - Extract all reasoning from messages

#### State Management
5. **`providers/VercelChatProvider.tsx`** - Add reasoning timeline state
6. **`hooks/useReasoningTimeline.ts`** - Manage accumulated reasoning steps

## Breaking Changes Analysis

### High Risk Changes
1. **Message rendering logic** - Fundamental change to how reasoning is displayed
2. **State management** - Adding new state for reasoning timeline
3. **Component hierarchy** - Moving reasoning outside individual messages

### Low Risk Changes
1. **Keep existing reasoning parts** - Don't change how AI SDK generates reasoning
2. **Preserve message structure** - Messages still contain reasoning parts
3. **Additive approach** - Add unified display without breaking individual parts

### Mitigation Strategies
1. **Feature flag approach** - Allow switching between old/new reasoning display
2. **Preserve original components** - Keep `EnhancedReasoning` as fallback
3. **Incremental rollout** - Test with single conversation first

## Atomic Action Plan (Following @principles.md)

### Phase 1: Foundation (DRY Principle - Reuse Existing)
**Time: 45 minutes | Risk: Low**

#### Task 1.1: Create Reasoning Extraction Utility (15 min)
**File**: `lib/reasoning/extractConversationReasoning.ts`
**Purpose**: Extract all reasoning parts from messages array
```typescript
// Single responsibility: Extract reasoning from conversation
export function extractConversationReasoning(messages: UIMessage[]): ReasoningStep[]
```
**Dependencies**: None
**Risk**: Low - Pure utility function

#### Task 1.2: Create Unified Component (20 min)
**File**: `components/reasoning/UnifiedChainOfThought.tsx`
**Purpose**: Single Chain of Thought displaying all reasoning steps
```typescript
// Reuses existing AI Elements, follows established patterns
export function UnifiedChainOfThought({ steps, isStreaming }: Props)
```
**Dependencies**: Task 1.1
**Risk**: Low - Builds on existing components

#### Task 1.3: Add Reasoning Timeline Hook (10 min)
**File**: `hooks/useReasoningTimeline.ts`
**Purpose**: Manage reasoning state at conversation level
```typescript
// Single responsibility: Reasoning timeline state management
export function useReasoningTimeline(messages: UIMessage[])
```
**Dependencies**: Task 1.1
**Risk**: Low - Simple state management

### Phase 2: Integration (Production Code Standards)
**Time: 30 minutes | Risk: Medium**

#### Task 2.1: Update Messages Component (15 min)
**File**: `components/VercelChat/messages.tsx`
**Purpose**: Add unified Chain of Thought before messages
```typescript
// Add single unified reasoning component at top
<UnifiedChainOfThought steps={reasoningSteps} />
{messages.map(message => <Message />)}
```
**Dependencies**: Tasks 1.1, 1.2, 1.3
**Risk**: Medium - Changes message rendering

#### Task 2.2: Update Message Renderer (15 min)
**File**: `components/VercelChat/message.tsx`
**Purpose**: Skip individual reasoning parts (they're now in unified timeline)
```typescript
// Skip reasoning parts - they're handled by UnifiedChainOfThought
if (type === "reasoning") {
  return null; // Or feature flag to old behavior
}
```
**Dependencies**: Task 2.1
**Risk**: Medium - Changes core message logic

### Phase 3: Enhancement (User Experience First)
**Time: 25 minutes | Risk: Low**

#### Task 3.1: Add Feature Flag (10 min)
**File**: `lib/reasoning/config.ts`
**Purpose**: Allow switching between unified/individual reasoning display
```typescript
// Don't artificially limit - let users choose experience
export const UNIFIED_REASONING_ENABLED = process.env.NEXT_PUBLIC_UNIFIED_REASONING === 'true'
```
**Dependencies**: None
**Risk**: Low - Configuration only

#### Task 3.2: Add Streaming Integration (10 min)
**Purpose**: Ensure streaming works with unified timeline
**Dependencies**: Tasks 2.1, 2.2
**Risk**: Low - Uses existing streaming logic

#### Task 3.3: Add Auto-Scroll to Latest Reasoning (5 min)
**Purpose**: Scroll to latest reasoning step during streaming
**Dependencies**: Task 3.2
**Risk**: Low - UX enhancement

### Phase 4: Testing & Validation (Single Responsibility)
**Time: 20 minutes | Risk: Medium**

#### Task 4.1: Test Conversation Flow (10 min)
**Purpose**: Verify unified reasoning works across multiple exchanges
**Test Cases**:
- Multiple reasoning phases in one conversation
- Streaming with unified timeline
- Feature flag switching
**Dependencies**: All previous tasks
**Risk**: Medium - Integration testing

#### Task 4.2: Test Edge Cases (10 min)
**Purpose**: Handle empty reasoning, long conversations, errors
**Dependencies**: Task 4.1
**Risk**: Medium - Edge case handling

### Phase 5: Cleanup (Production Standards)
**Time: 10 minutes | Risk: Low**

#### Task 5.1: Remove Development Code (5 min)
**Purpose**: Clean up console.logs, temporary code
**Dependencies**: Task 4.2
**Risk**: Low - Cleanup only

#### Task 5.2: Update Component Exports (5 min)
**Purpose**: Ensure clean imports/exports
**Dependencies**: Task 5.1
**Risk**: Low - Organization

## Implementation Strategy

### Simplest Solution (YAGNI Principle)
1. **Keep existing reasoning parts intact** - Don't break current functionality
2. **Add unified display as enhancement** - Additive, not replacement
3. **Use feature flag** - Allow gradual rollout
4. **Leverage existing components** - Reuse AI Elements Chain of Thought

### File Structure (Single Responsibility)
```
lib/reasoning/
├── extractConversationReasoning.ts    # Extract reasoning from messages
├── config.ts                          # Reasoning configuration
└── types.ts                           # Reasoning types

components/reasoning/
├── UnifiedChainOfThought.tsx          # Unified reasoning component
├── EnhancedReasoning.tsx              # Keep as fallback
└── index.ts                           # Clean exports

hooks/
└── useReasoningTimeline.ts            # Reasoning timeline state
```

### Breaking Changes Mitigation
- **Feature flag**: `UNIFIED_REASONING_ENABLED` environment variable
- **Fallback behavior**: Keep individual reasoning as backup
- **Gradual rollout**: Test per conversation, not globally
- **Preserve APIs**: Don't change how reasoning parts are generated

## Success Criteria
1. ✅ Single continuous Chain of Thought per conversation
2. ✅ Visual line connecting all reasoning phases  
3. ✅ No fragmentation between reasoning sections
4. ✅ Streaming works with unified timeline
5. ✅ Feature flag allows switching approaches
6. ✅ No breaking changes to existing functionality
7. ✅ Performance equal or better than current system

## Risk Assessment

| Task | Risk Level | Mitigation |
|------|------------|------------|
| 1.1-1.3 | Low | Pure utilities, no UI changes |
| 2.1-2.2 | Medium | Feature flag rollback |
| 3.1-3.3 | Low | UX enhancements only |
| 4.1-4.2 | Medium | Comprehensive testing |
| 5.1-5.2 | Low | Cleanup only |

**Overall Risk**: Medium - Manageable with feature flags and incremental approach

## Total Effort
- **Development**: ~2 hours
- **Testing**: ~30 minutes  
- **Total**: ~2.5 hours

This plan follows @principles.md by:
- ✅ **DRY**: Reuses existing AI Elements components
- ✅ **Single Responsibility**: Each file has one clear purpose
- ✅ **Production Standards**: Feature flags for safe rollout
- ✅ **User Experience First**: Unified reasoning improves UX
- ✅ **No Premature Abstraction**: Simplest solution that works
- ✅ **Maintainable**: Clear file organization and responsibilities
