import { Loader2 } from "lucide-react";

interface OrganizationButtonProps {
  organizationId: string;
  organizationName: string | null | undefined;
  isLoading: boolean;
  disabled: boolean;
  onClick: () => void;
}

/**
 * Button component for selecting an organization in a dropdown list.
 */
const OrganizationButton = ({
  organizationId,
  organizationName,
  isLoading,
  disabled,
  onClick,
}: OrganizationButtonProps) => {
  return (
    <button
      key={organizationId}
      onClick={onClick}
      disabled={disabled}
      className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center justify-between disabled:opacity-50"
      type="button"
    >
      <span className="truncate">{organizationName || "Unnamed"}</span>
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
    </button>
  );
};

export default OrganizationButton;

