/**
 * Parse unstructured reasoning text into structured steps for Chain of Thought
 * 
 * Converts free-form reasoning content into an array of steps with:
 * - Appropriate icons based on content type
 * - Clear labels extracted from content
 * - Status indicators (complete, active, pending)
 * - Processed content for each step
 */

import { 
  BrainIcon, 
  SearchIcon, 
  LightbulbIcon, 
  CheckCircleIcon,
  ListIcon,
  TargetIcon,
  DotIcon,
  type LucideIcon 
} from 'lucide-react';

export interface ReasoningStep {
  icon: LucideIcon;
  label: string;
  description?: string;
  status: 'complete' | 'active' | 'pending';
  content: string;
}

/**
 * Parse reasoning content into structured steps
 */
export function parseReasoningSteps(
  content: string, 
  isStreaming: boolean = false
): ReasoningStep[] {
  if (!content || !content.trim()) {
    return [];
  }

  // Extract the title (first line) that will be shown in the header
  extractFirstLineAsLabel(content);
  
  // Remove the title from content to avoid duplication
  const contentWithoutTitle = removeFirstLineFromContent(content);
  
  // Split remaining content into potential steps using various patterns
  const steps = extractSteps(contentWithoutTitle);
  
  // If no clear steps found after removing title, create a single reasoning step
  if (steps.length === 0 && contentWithoutTitle.trim()) {
    return [{
      icon: BrainIcon,
      label: "Analysis",
      status: isStreaming ? 'active' : 'complete',
      content: contentWithoutTitle
    }];
  }

  // Process each step and assign appropriate metadata
  return steps.map((step, index) => ({
    icon: getStepIcon(step.content),
    label: extractActionLabel(step.content), // Use action verbs like "Searching", "Analyzing"
    description: step.description,
    status: getStepStatus(index, steps.length, isStreaming),
    content: step.content
  }));
}

/**
 * Extract steps from content using various parsing strategies
 */
function extractSteps(content: string): Array<{
  label: string;
  description?: string;
  content: string;
}> {
  const steps: Array<{ label: string; description?: string; content: string }> = [];
  
  // Strategy 1: Look for markdown headers
  const headerSteps = extractHeaderSteps(content);
  if (headerSteps.length >= 1) {
    return headerSteps;
  }
  
  // Strategy 2: Look for numbered lists
  const numberedSteps = extractNumberedSteps(content);
  if (numberedSteps.length >= 1) {
    return numberedSteps;
  }
  
  // Strategy 3: Look for bullet points
  const bulletSteps = extractBulletSteps(content);
  if (bulletSteps.length >= 1) {
    return bulletSteps;
  }
  
  // Strategy 4: Look for bold text patterns
  const boldSteps = extractBoldSteps(content);
  if (boldSteps.length >= 1) {
    return boldSteps;
  }
  
  // Strategy 5: Split by double newlines (paragraphs)
  const paragraphSteps = extractParagraphSteps(content);
  if (paragraphSteps.length >= 1) {
    return paragraphSteps;
  }
  
  return steps;
}

/**
 * Extract steps based on markdown headers (# ## ###)
 */
function extractHeaderSteps(content: string): Array<{
  label: string;
  description?: string;
  content: string;
}> {
  const lines = content.split('\n');
  const steps: Array<{ label: string; description?: string; content: string }> = [];
  let currentStep: { label: string; content: string } | null = null;
  
  for (const line of lines) {
    const headerMatch = line.match(/^(#{1,6})\s*(.+)$/);
    
    if (headerMatch) {
      // Save previous step
      if (currentStep) {
        steps.push(currentStep);
      }
      
      // Start new step
      currentStep = {
        label: headerMatch[2].trim(),
        content: ''
      };
    } else if (currentStep) {
      // Add content to current step
      currentStep.content += (currentStep.content ? '\n' : '') + line;
    }
  }
  
  // Add final step
  if (currentStep) {
    steps.push(currentStep);
  }
  
  return steps;
}

/**
 * Extract steps based on numbered lists (1. 2. 3.)
 */
function extractNumberedSteps(content: string): Array<{
  label: string;
  description?: string;
  content: string;
}> {
  const lines = content.split('\n');
  const steps: Array<{ label: string; content: string }> = [];
  let currentStep: { label: string; content: string } | null = null;
  
  for (const line of lines) {
    const numberMatch = line.match(/^\d+\.\s*(.+)$/);
    
    if (numberMatch) {
      // Save previous step
      if (currentStep) {
        steps.push(currentStep);
      }
      
      // Start new step
      currentStep = {
        label: numberMatch[1].trim(),
        content: numberMatch[1].trim()
      };
    } else if (currentStep && line.trim()) {
      // Add content to current step
      currentStep.content += '\n' + line;
    }
  }
  
  // Add final step
  if (currentStep) {
    steps.push(currentStep);
  }
  
  return steps;
}

/**
 * Extract steps based on bullet points (- • *)
 */
function extractBulletSteps(content: string): Array<{
  label: string;
  description?: string;
  content: string;
}> {
  const lines = content.split('\n');
  const steps: Array<{ label: string; content: string }> = [];
  let currentStep: { label: string; content: string } | null = null;
  
  for (const line of lines) {
    const bulletMatch = line.match(/^[-•*]\s*(.+)$/);
    
    if (bulletMatch) {
      // Save previous step
      if (currentStep) {
        steps.push(currentStep);
      }
      
      // Start new step
      currentStep = {
        label: bulletMatch[1].trim(),
        content: bulletMatch[1].trim()
      };
    } else if (currentStep && line.trim()) {
      // Add content to current step
      currentStep.content += '\n' + line;
    }
  }
  
  // Add final step
  if (currentStep) {
    steps.push(currentStep);
  }
  
  return steps;
}

/**
 * Extract steps based on bold text patterns (**text**)
 */
function extractBoldSteps(content: string): Array<{
  label: string;
  description?: string;
  content: string;
}> {
  const lines = content.split('\n');
  const steps: Array<{ label: string; content: string }> = [];
  let currentStep: { label: string; content: string } | null = null;
  
  for (const line of lines) {
    const boldMatch = line.match(/^\*\*(.+?)\*\*:?\s*(.*)$/);
    
    if (boldMatch) {
      // Save previous step
      if (currentStep) {
        steps.push(currentStep);
      }
      
      // Start new step
      const label = boldMatch[1].trim();
      const restOfLine = boldMatch[2].trim();
      currentStep = {
        label,
        content: restOfLine || label
      };
    } else if (currentStep && line.trim()) {
      // Add content to current step
      currentStep.content += '\n' + line;
    }
  }
  
  // Add final step
  if (currentStep) {
    steps.push(currentStep);
  }
  
  return steps;
}

/**
 * Extract steps based on paragraph breaks (double newlines)
 */
function extractParagraphSteps(content: string): Array<{
  label: string;
  description?: string;
  content: string;
}> {
  // Try double newlines first
  let paragraphs = content.split('\n\n').filter(p => p.trim());
  
  // If we don't get multiple paragraphs, try single newlines with substantial content
  if (paragraphs.length < 2) {
    const lines = content.split('\n').filter(line => line.trim());
    paragraphs = [];
    let currentParagraph = '';
    
    for (const line of lines) {
      if (line.trim().length > 50) { // Substantial line, likely a new thought
        if (currentParagraph) {
          paragraphs.push(currentParagraph.trim());
        }
        currentParagraph = line;
      } else if (currentParagraph) {
        currentParagraph += '\n' + line;
      }
    }
    
    if (currentParagraph) {
      paragraphs.push(currentParagraph.trim());
    }
  }
  
  // Only create steps if we have substantial paragraphs
  if (paragraphs.length === 0) {
    return [];
  }
  
  return paragraphs.map(paragraph => {
    const firstLine = paragraph.split('\n')[0].trim();
    const label = firstLine.length > 100 
      ? firstLine.substring(0, 97) + '...'
      : firstLine;
    
    return {
      label,
      content: paragraph.trim()
    };
  });
}

/**
 * Extract first line as label for single-step reasoning
 */
function extractFirstLineAsLabel(content: string): string {
  const lines = content.split('\n').filter(line => line.trim());
  if (lines.length === 0) return 'Reasoning';
  
  let firstLine = lines[0].trim();
  
  // Strip markdown formatting
  firstLine = firstLine
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold **text**
    .replace(/\*(.*?)\*/g, '$1')     // Remove italic *text*
    .replace(/`(.*?)`/g, '$1')       // Remove code `text`
    .replace(/#{1,6}\s*/g, '')       // Remove headers # ## ###
    .trim();
  
  // Truncate if too long
  if (firstLine.length > 100) {
    const firstSentence = firstLine.split('.')[0];
    return firstSentence.length < 100 ? firstSentence : firstSentence.substring(0, 97) + '...';
  }
  
  return firstLine;
}

/**
 * Remove the first line from content to avoid duplication with header
 */
function removeFirstLineFromContent(content: string): string {
  const lines = content.split('\n');
  if (lines.length <= 1) return '';
  
  // Remove the first non-empty line that matches our title
  const filteredLines = lines.slice(1);
  return filteredLines.join('\n').trim();
}

/**
 * Extract action verb from content to create step labels like "Searching", "Analyzing", etc.
 */
function extractActionLabel(content: string): string {
  const lowerContent = content.toLowerCase();
  
  // Look for action verbs and convert to -ing form
  if (lowerContent.includes('search') || lowerContent.includes('find') || lowerContent.includes('look')) {
    return 'Searching';
  }
  
  if (lowerContent.includes('analyz') || lowerContent.includes('consider') || lowerContent.includes('think')) {
    return 'Analyzing';
  }
  
  if (lowerContent.includes('review') || lowerContent.includes('check') || lowerContent.includes('examine')) {
    return 'Reviewing';
  }
  
  if (lowerContent.includes('plan') || lowerContent.includes('design') || lowerContent.includes('strategy')) {
    return 'Planning';
  }
  
  if (lowerContent.includes('gather') || lowerContent.includes('collect') || lowerContent.includes('compile')) {
    return 'Gathering';
  }
  
  if (lowerContent.includes('clarify') || lowerContent.includes('confirm') || lowerContent.includes('verify')) {
    return 'Clarifying';
  }
  
  if (lowerContent.includes('propose') || lowerContent.includes('suggest') || lowerContent.includes('recommend')) {
    return 'Proposing';
  }
  
  if (lowerContent.includes('assess') || lowerContent.includes('evaluat') || lowerContent.includes('determin')) {
    return 'Assessing';
  }
  
  // Default to "Processing" if no specific action found
  return 'Processing';
}

/**
 * Determine appropriate icon based on step content and position
 */
function getStepIcon(content: string): LucideIcon {
  const lowerContent = content.toLowerCase();
  
  // Search-related keywords
  if (lowerContent.includes('search') || lowerContent.includes('find') || lowerContent.includes('look')) {
    return SearchIcon;
  }
  
  // Analysis/thinking keywords
  if (lowerContent.includes('analyz') || lowerContent.includes('consider') || lowerContent.includes('think')) {
    return BrainIcon;
  }
  
  // Solution/idea keywords
  if (lowerContent.includes('solution') || lowerContent.includes('idea') || lowerContent.includes('approach')) {
    return LightbulbIcon;
  }
  
  // Conclusion/result keywords
  if (lowerContent.includes('conclusion') || lowerContent.includes('result') || lowerContent.includes('final')) {
    return CheckCircleIcon;
  }
  
  // List/steps keywords
  if (lowerContent.includes('step') || lowerContent.includes('list') || lowerContent.includes('item')) {
    return ListIcon;
  }
  
  // Goal/target keywords
  if (lowerContent.includes('goal') || lowerContent.includes('target') || lowerContent.includes('objective')) {
    return TargetIcon;
  }
  
  // Default to DotIcon (like Perplexity)
  return DotIcon;
}

/**
 * Determine step status based on position and streaming state
 */
function getStepStatus(
  stepIndex: number, 
  totalSteps: number, 
  isStreaming: boolean
): 'complete' | 'active' | 'pending' {
  if (!isStreaming) {
    return 'complete'; // All steps complete when not streaming
  }
  
  // When streaming, show progression through steps
  const currentStep = Math.floor(totalSteps * 0.7); // Assume we're 70% through
  
  if (stepIndex < currentStep) {
    return 'complete';
  } else if (stepIndex === currentStep) {
    return 'active';
  } else {
    return 'pending';
  }
}
