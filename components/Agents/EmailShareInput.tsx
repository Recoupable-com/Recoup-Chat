import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { isValidEmail } from "@/lib/utils/isValidEmail";

interface EmailShareInputProps {
  emails: string[];
  onEmailsChange: (emails: string[]) => void;
}

const EmailShareInput = ({ emails, onEmailsChange }: EmailShareInputProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addEmail();
    }
  };

  const addEmail = () => {
    const trimmedEmail = inputValue.trim().toLowerCase();
    
    if (!trimmedEmail) return;
    
    if (!isValidEmail(trimmedEmail)) {
      // You could add error handling here
      return;
    }
    
    if (emails.includes(trimmedEmail)) {
      setInputValue("");
      return;
    }
    
    onEmailsChange([...emails, trimmedEmail]);
    setInputValue("");
  };

  const removeEmail = (emailToRemove: string) => {
    onEmailsChange(emails.filter(email => email !== emailToRemove));
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="share-emails">Share with (email addresses)</Label>
      <Input
        id="share-emails"
        type="email"
        placeholder="Enter email address and press Enter"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      
      {emails.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {emails.map((email) => (
            <Badge
              key={email}
              variant="secondary"
              className="flex items-center gap-1 pr-1"
            >
              {email}
              <button
                type="button"
                onClick={() => removeEmail(email)}
                className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                aria-label={`Remove ${email}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmailShareInput;
