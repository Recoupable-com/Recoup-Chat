import PulseHeader from "./PulseHeader";
import PulseGreeting from "./PulseGreeting";
import PulseCard from "./PulseCard";
import PulseCurateButton from "./PulseCurateButton";

const MOCK_CARDS = [
  {
    imageUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800",
    title: "A Guide to Europe's Busiest Airport",
    description: "Check Your Terminal: Heathrow has four terminals, and they're far apart.",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
    title: "Hidden Gems for Dinner",
    description: "Discover the best local restaurants near your destination.",
  },
];

const PulsePage = () => {
  const greeting =
    "Hey Aleks, your big trip is around the corner. Here's a handy guide for Heathrow and a few dinner ideas.";

  return (
    <div className="relative min-h-full bg-background">
      <div className="mx-auto max-w-md px-6 py-8 pb-24">
        <div className="flex flex-col gap-4">
          <PulseHeader date={new Date()} />
          <PulseGreeting message={greeting} />
        </div>

        <div className="mt-6 flex flex-col gap-6">
          {MOCK_CARDS.map((card, index) => (
            <PulseCard
              key={index}
              imageUrl={card.imageUrl}
              title={card.title}
              description={card.description}
            />
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
