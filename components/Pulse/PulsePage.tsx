"use client";

import { useAutoLogin } from "@/hooks/useAutoLogin";
import PulseHeader from "./PulseHeader";
import PulseGreeting from "./PulseGreeting";
import PulseCard from "./PulseCard";
import PulseCurateButton from "./PulseCurateButton";
import { PulseArticle } from "./PulseArticleDrawer";

const MOCK_ARTICLES: PulseArticle[] = [
  {
    id: "airport-guide",
    imageUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800",
    title: "A Guide to Europe's Busiest Airport",
    description: "Check Your Terminal: Heathrow has four terminals, and they're far apart.",
    intro: "Heathrow is one of the world's busiest airports. Here's what you need to know before your trip.",
    sections: [
      {
        title: "Terminal Information",
        items: [
          "Terminal 2: Star Alliance airlines",
          "Terminal 3: Oneworld and other airlines",
          "Terminal 4: SkyTeam airlines",
          "Terminal 5: British Airways exclusive",
        ],
      },
      {
        title: "Getting Between Terminals",
        items: [
          "Free transfer trains connect all terminals",
          "Allow 30-60 minutes for connections",
          "Follow signs to 'Flight Connections'",
        ],
      },
    ],
  },
  {
    id: "dinner-gems",
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
    title: "Hidden Gems for Dinner",
    description: "Discover the best local restaurants near your destination.",
    intro: "Skip the tourist traps and discover where the locals actually eat.",
    sections: [
      {
        title: "Finding Local Spots",
        items: [
          "Ask hotel staff for personal recommendations",
          "Look for restaurants with menus in the local language",
          "Visit neighborhood markets for authentic food",
        ],
      },
      {
        title: "Timing Your Meals",
        items: [
          "Lunch specials offer best value",
          "Dinner reservations recommended for popular spots",
          "Late dining is common in many European cities",
        ],
      },
    ],
  },
];

const PulsePage = () => {
  useAutoLogin();

  const greeting =
    "Hey Aleks, your big trip is around the corner. Here's a handy guide for Heathrow and a few dinner ideas.";

  return (
    <div className="relative min-h-full bg-background">
      <div className="mx-auto max-w-md px-6 py-8 pb-24">
        <div className="flex flex-col gap-4">
          <PulseHeader />
          <PulseGreeting message={greeting} />
        </div>

        <div className="mt-6 flex flex-col gap-6">
          {MOCK_ARTICLES.map((article) => (
            <PulseCard key={article.id} article={article} />
          ))}
        </div>
      </div>

      <div className="sticky bottom-6 flex justify-end px-6 pb-6 pointer-events-none">
        <PulseCurateButton />
      </div>
    </div>
  );
};

export default PulsePage;
