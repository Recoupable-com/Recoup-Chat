"use client";

import {
  Drawer,
  DrawerContent,
  DrawerTitle,
} from "@/components/ui/drawer";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import PulseArticleHero from "./PulseArticleHero";
import PulseArticleSection from "./PulseArticleSection";
import PulseArticleChat from "./PulseArticleChat";

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
  if (!article) return null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[95vh] max-h-[95vh]">
        <VisuallyHidden>
          <DrawerTitle>{article.title}</DrawerTitle>
        </VisuallyHidden>
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

          <PulseArticleChat />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default PulseArticleDrawer;
