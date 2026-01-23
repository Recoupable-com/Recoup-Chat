import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const PulseCurateButton = () => {
  return (
    <Button className="rounded-full shadow-lg gap-2 pointer-events-auto">
      <Sparkles className="h-4 w-4" />
      Curate
    </Button>
  );
};

export default PulseCurateButton;
