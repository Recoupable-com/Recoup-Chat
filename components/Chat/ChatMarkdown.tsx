import React from "react";
import Markdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import styles from "./markdown.module.css";
import MarkdownA from "./MarkdownA";
import MarkdownPre from "./MarkdownPre";
import MarkdownCode from "./MarkdownCode";
import MarkdownImg from "./MarkdownImg";
import MarkdownTable from "./MarkdownTable";

interface ChatMarkdownProps {
  children: string;
}

// Custom header components that work with CSS module styles
const markdownHeaders = {
  h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
  h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
  h3: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
  h4: ({ children, ...props }: any) => <h4 {...props}>{children}</h4>,
  h5: ({ children, ...props }: any) => <h5 {...props}>{children}</h5>,
  h6: ({ children, ...props }: any) => <h6 {...props}>{children}</h6>,
  strong: ({ children, ...props }: any) => <strong {...props}>{children}</strong>,
  p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  ul: ({ children, ...props }: any) => <ul {...props}>{children}</ul>,
  ol: ({ children, ...props }: any) => <ol {...props}>{children}</ol>,
  li: ({ children, ...props }: any) => <li {...props}>{children}</li>,
};

const ChatMarkdown: React.FC<ChatMarkdownProps> = ({ children }) => {
  return (
    <div className={`${styles.markdown} w-full max-w-full overflow-hidden`} style={{ overflowX: 'hidden', maxWidth: '100%', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Use existing custom components for specific elements
          a: MarkdownA,
          pre: MarkdownPre,
          // Type issues are handled in the component itself
          code: MarkdownCode,
          img: MarkdownImg,
          table: MarkdownTable,
          // Use simple header components that let CSS module styles take precedence
          h1: markdownHeaders.h1,
          h2: markdownHeaders.h2,
          h3: markdownHeaders.h3,
          h4: markdownHeaders.h4,
          h5: markdownHeaders.h5,
          h6: markdownHeaders.h6,
          // Add other formatting components
          strong: markdownHeaders.strong,
          ul: markdownHeaders.ul,
          ol: markdownHeaders.ol,
          li: markdownHeaders.li,
          p: markdownHeaders.p,
        }}
      >
        {children}
      </Markdown>
    </div>
  );
};

export default ChatMarkdown; 