"use client";

import { useMessagesProvider } from "@/providers/MessagesProvider";
import ChatInput from "./ChatInput";
import ProviderMessages from "./ProviderMessages";
import { ScrollTo } from "react-scroll-to";
import ChatSkeleton from "./ChatSkeleton";
import { ChatReport } from "./ChatReport";

interface ChatProps {
  reportId?: string;
}

const Chat = ({ reportId }: ChatProps) => {
  const { isLoading } = useMessagesProvider();

  if (isLoading) return <ChatSkeleton />;

  return (
    <div className="flex flex-col h-full">
      <ScrollTo>
        {({ scroll }) => (
          <div className="flex-1 min-h-0">
            <ProviderMessages scroll={scroll}>
              {reportId && <ChatReport reportId={reportId} />}
            </ProviderMessages>
          </div>
        )}
      </ScrollTo>
      <ChatInput />
    </div>
  );
};

export default Chat;
