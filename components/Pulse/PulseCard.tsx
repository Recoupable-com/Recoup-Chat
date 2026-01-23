"use client";

import { useState } from "react";
import PulseCardActions from "./PulseCardActions";
import PulseArticleDrawer, { PulseArticle } from "./PulseArticleDrawer";

interface PulseCardProps {
  article: PulseArticle;
}

const PulseCard = ({ article }: PulseCardProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        className="relative overflow-hidden rounded-2xl cursor-pointer transition-transform hover:scale-[1.02] text-left"
      >
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full aspect-[4/3] object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
          <h3 className="text-white text-lg font-semibold">{article.title}</h3>
          <p className="text-white/80 text-sm mt-1">{article.description}</p>
        </div>
      </button>
      <PulseCardActions />
      <PulseArticleDrawer
        article={article}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
};

export default PulseCard;
