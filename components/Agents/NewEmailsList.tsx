import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface NewEmailsListProps {
  emails: string[];
  onRemoveEmail: (email: string) => void;
}

const NewEmailsList = ({ emails, onRemoveEmail }: NewEmailsListProps) => {
  if (emails.length === 0) return null;

  return (
    <div>
      <div className="text-sm text-muted-foreground mb-2">
        New shares to add:
      </div>
      <div className="flex flex-wrap gap-2">
        {emails.map((email) => (
          <Badge
            key={`new-${email}`}
            variant="secondary"
            className="flex items-center gap-1 pr-1"
          >
            {email}
            <button
              type="button"
              onClick={() => onRemoveEmail(email)}
              className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
              aria-label={`Remove ${email}`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default NewEmailsList;
