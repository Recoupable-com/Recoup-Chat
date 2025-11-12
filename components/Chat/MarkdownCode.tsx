import React from "react";
import { type Components } from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight, oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

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
    const codeString = String(children).replace(/\n$/, "");
    
    return (
      <>
        {/* Light mode */}
        <SyntaxHighlighter
          className="dark:hidden"
          language={language}
          style={oneLight}
          customStyle={{ 
            margin: 0,
            padding: 0,
            borderRadius: 0,
            fontSize: "0.875rem",
            lineHeight: 1.6,
            background: "transparent",
            color: "hsl(var(--foreground))",
            overflowX: "auto",
          }}
          wrapLines
          wrapLongLines
        >
          {codeString}
        </SyntaxHighlighter>
        
        {/* Dark mode */}
        <SyntaxHighlighter
          className="hidden dark:block"
          language={language}
          style={oneDark}
          customStyle={{ 
            margin: 0,
            padding: 0,
            borderRadius: 0,
            fontSize: "0.875rem",
            lineHeight: 1.6,
            background: "transparent",
            color: "hsl(var(--foreground))",
            overflowX: "auto",
          }}
          wrapLines
          wrapLongLines
        >
          {codeString}
        </SyntaxHighlighter>
      </>
    );
  }
  
  return (
    <code className="px-1.5 py-0.5 rounded-sm bg-muted font-mono text-sm">
      {children}
    </code>
  );
};

export default MarkdownCode; 