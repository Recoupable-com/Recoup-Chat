import React from "react";
import { Action } from "@/components/actions";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";

interface CopyActionProps {
  text: string;
}

const CopyAction: React.FC<CopyActionProps> = ({ text }) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <Action
      onClick={handleCopy}
      label="Copy"
      tooltip="Copy response to clipboard"
    >
      <CopyIcon className="!w-3 !h-3" />
    </Action>
  );
};

export default CopyAction;
