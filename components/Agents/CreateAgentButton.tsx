import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const CreateAgentButton = () => {
  return (
    <Button variant="default" size="sm" className="gap-2 rounded-xl">
      <Plus />
      Create
    </Button>
  );
};

export default CreateAgentButton;
