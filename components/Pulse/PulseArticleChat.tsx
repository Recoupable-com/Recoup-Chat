"use client";

import { useState } from "react";
import { Plus, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const PulseArticleChat = () => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    // TODO: Handle chat submission
    setInput("");
  };

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-background border-t border-border p-4">
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-10 w-10 shrink-0"
        >
          <Plus className="h-5 w-5" />
        </Button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about this article..."
          className="flex-1 bg-muted rounded-full px-4 py-2 text-base outline-none focus:ring-2 focus:ring-ring"
        />
        <Button
          type="submit"
          size="icon"
          className="h-10 w-10 shrink-0 rounded-full"
          disabled={!input.trim()}
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
};

export default PulseArticleChat;
