/**
 * StepContent Component
 * 
 * Renders step content safely using Response component.
 * Single responsibility: Display reasoning step content with proper markdown.
 */

import { memo } from 'react';
import { Response } from '@/components/ai-elements/response';

interface StepContentProps {
  content: string;
}

const StepContent = memo(({ content }: StepContentProps) => {
  return (
    <div className="text-sm text-muted-foreground/80 leading-relaxed">
      <Response>{content}</Response>
    </div>
  );
});

StepContent.displayName = 'StepContent';

export default StepContent;
