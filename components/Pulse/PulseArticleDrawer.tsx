"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputButton,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import PulseArticleHero from "./PulseArticleHero";
import PulseArticleSection from "./PulseArticleSection";

export interface PulseArticle {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  intro?: string;
  sections?: {
    title: string;
    items: string[];
  }[];
}

interface PulseArticleDrawerProps {
  article: PulseArticle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PulseArticleDrawer = ({
  article,
  open,
  onOpenChange,
}: PulseArticleDrawerProps) => {
  const [input, setInput] = useState("");

  if (!article) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    // TODO: Handle chat submission
    setInput("");
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[95vh] max-h-[95vh]">
        <DrawerTitle className="sr-only">{article.title}</DrawerTitle>
        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-md px-6 py-4 pb-24">
              <PulseArticleHero imageUrl={article.imageUrl} alt={article.title} />

              <div className="mt-6 flex flex-col gap-6">
                <h1 className="text-2xl font-semibold leading-tight">
                  {article.title}
                </h1>

                {article.intro && (
                  <p className="text-base text-muted-foreground">
                    {article.intro}
                  </p>
                )}

                {article.sections?.map((section, index) => (
                  <PulseArticleSection
                    key={index}
                    title={section.title}
                    items={section.items}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-border p-4">
            <PromptInput onSubmit={handleSubmit}>
              <PromptInputTextarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about this article..."
              />
              <PromptInputToolbar>
                <PromptInputButton>
                  <Plus className="h-4 w-4" />
                </PromptInputButton>
                <PromptInputSubmit disabled={!input.trim()} />
              </PromptInputToolbar>
            </PromptInput>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default PulseArticleDrawer;
