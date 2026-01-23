"use client";

import { useAutoLogin } from "@/hooks/useAutoLogin";
import PulseArticleHero from "./PulseArticleHero";
import PulseArticleSection from "./PulseArticleSection";
import PulseArticleChat from "./PulseArticleChat";

const MOCK_ARTICLE = {
  imageUrl: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800",
  title: "Rebuilding Strength: Your Steady Return to Trail Running",
  intro:
    "Below is a guide, but be sure to follow your surgeon or physical therapist's protocol.",
  sections: [
    {
      title: "Phase 1: Rehab Foundation",
      items: [
        "Strength: Single-leg work (step-ups, lunges, split squats).",
        "Stability: Balance drills (single-leg stands, wobble board).",
        "Mobility: Hip and ankle stretches daily.",
      ],
    },
    {
      title: "Phase 2: Return to Running",
      items: [
        "Run/Walk: Start intervals on flat ground.",
        "Form: Short quick strides.",
        "Progress: Gradually add duration; avoid sharp turns/cutting.",
      ],
    },
    {
      title: "Phase 3: Trail Reintroduction",
      items: [
        "Surface: Smooth grass, or dirt first.",
        "Uphill > Downhill: Walk steeper descents.",
        "Trail Drills: Single-leg hops, step-ups.",
      ],
    },
  ],
};

const PulseArticlePage = () => {
  useAutoLogin();

  return (
    <div className="flex flex-col min-h-full bg-background">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-md px-6 py-8 pb-24">
          <PulseArticleHero
            imageUrl={MOCK_ARTICLE.imageUrl}
            alt={MOCK_ARTICLE.title}
          />

          <div className="mt-6 flex flex-col gap-6">
            <h1 className="text-2xl font-semibold leading-tight">
              {MOCK_ARTICLE.title}
            </h1>

            <p className="text-base text-muted-foreground">
              {MOCK_ARTICLE.intro}
            </p>

            {MOCK_ARTICLE.sections.map((section, index) => (
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
  );
};

export default PulseArticlePage;
