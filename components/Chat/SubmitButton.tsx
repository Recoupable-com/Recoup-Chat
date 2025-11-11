import { ArrowUpRightIcon } from "lucide-react";

const SubmitButton = ({ canSubmit }: { canSubmit: boolean }) => {
  return (
    <button
      type="submit"
      className={`p-1.5 rounded-md border-[1px] border-grey  ${canSubmit ? "bg-card" : "bg-background"}`}
      aria-label="Send message"
      disabled={!canSubmit}
    >
      <ArrowUpRightIcon className="w-3 h-3" />
    </button>
  );
};

export default SubmitButton;
