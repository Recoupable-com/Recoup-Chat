import Link from "next/link";
import { MessageSquare, CheckCircle2, ChevronRight } from "lucide-react";

export interface ChatItem {
  id: string;
  topic?: string | null;
  account_id?: string | null;
  artist_id?: string | null;
  updated_at?: string;
}

export interface GetChatsResultType {
  chats?: ChatItem[];
  status?: string;
  message?: string;
}

interface GetChatsResultProps {
  result: GetChatsResultType;
}

const GetChatsResult = ({ result }: GetChatsResultProps) => {
  const chats = result?.chats ?? [];

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm max-w-md">
      <div className="px-4 py-3 border-b border-border bg-muted rounded-t-lg">
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="h-5 w-5 text-green-500 dark:text-green-400" />
          <h3 className="text-sm font-semibold text-foreground">Chats</h3>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {chats.length === 0
            ? "No chats found"
            : `Found ${chats.length} chat${chats.length === 1 ? "" : "s"}`}
        </p>
      </div>

      {chats.length > 0 && (
        <div className="p-2 max-h-72 overflow-y-auto">
          <ul className="space-y-1">
            {chats.map((chat) => {
              const displayTopic =
                chat.topic && chat.topic.trim().length > 0
                  ? chat.topic
                  : "Untitled Chat";

              return (
                <li key={chat.id}>
                  <Link
                    href={`/chat/${chat.id}`}
                    prefetch={true}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors group"
                  >
                    <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm text-foreground truncate flex-1">
                      {displayTopic}
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {chats.length === 0 && (
        <div className="p-6 text-center">
          <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No chats available</p>
        </div>
      )}
    </div>
  );
};

export default GetChatsResult;
