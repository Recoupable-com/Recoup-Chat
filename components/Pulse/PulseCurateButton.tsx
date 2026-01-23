import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const PulseCurateButton = () => {
  return (
    <Button className="fixed bottom-6 right-6 rounded-full shadow-lg gap-2">
      <Sparkles className="h-4 w-4" />
      Curate
    </Button>
  );
};

export default PulseCurateButton;
