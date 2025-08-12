import React from "react";
import Markdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import styles from "./markdown.module.css";
import MarkdownA from "./MarkdownA";
import MarkdownPre from "./MarkdownPre";
import MarkdownCode from "./MarkdownCode";
import MarkdownImg from "./MarkdownImg";
import MarkdownTable from "./MarkdownTable";
import { markdownComponents } from "../VercelChat/markdown-components";

interface ChatMarkdownProps {
  children: string;
}

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
          // Add header components from markdown-components for better formatting
          h1: markdownComponents.h1,
          h2: markdownComponents.h2,
          h3: markdownComponents.h3,
          h4: markdownComponents.h4,
          h5: markdownComponents.h5,
          h6: markdownComponents.h6,
          // Add other formatting components for improved readability
          strong: markdownComponents.strong,
          ul: markdownComponents.ul,
          ol: markdownComponents.ol,
          li: markdownComponents.li,
          p: markdownComponents.p,
        }}
      >
        {children}
      </Markdown>
    </div>
  );
};

export default ChatMarkdown; 