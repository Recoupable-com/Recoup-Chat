import React from "react";
import { type Components } from "react-markdown";
import { CodeBlock, CodeBlockCopyButton } from "@/components/ai-elements/code-block";

interface CodeBlockProps extends React.HTMLAttributes<HTMLElement> {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const MarkdownCode: Components['code'] = (props: CodeBlockProps) => {
  const { inline, className, children } = props;
  
  // Extract language from className (format: language-*)
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "";

  if (!inline) {
    const codeContent = String(children).replace(/\n$/, "");
    return (
      <CodeBlock 
        code={codeContent}
        language={language}
        showLineNumbers={false}
      >
        <CodeBlockCopyButton />
      </CodeBlock>
    );
  }
  
  return (
    <code className="px-1.5 py-0.5 rounded-sm bg-gray-100 font-mono text-sm">
      {children}
    </code>
  );
};

export default MarkdownCode; 