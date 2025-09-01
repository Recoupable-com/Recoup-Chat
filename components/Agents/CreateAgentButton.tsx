import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CreateAgentDialog from "./CreateAgentDialog";

const CreateAgentButton = () => {
  return (
    <CreateAgentDialog>
      <Button variant="default" size="sm" className="gap-2 rounded-xl">
        <Plus />
        Create
      </Button>
    </CreateAgentDialog>
  );
};

export default CreateAgentButton;
