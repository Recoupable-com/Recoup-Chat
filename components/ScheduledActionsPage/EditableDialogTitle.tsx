import { useState } from "react";
import { cn } from "@/lib/utils";
import { Check, X, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface EditableDialogTitleProps {
  title: string;
  actionId: string;
  isActive: boolean;
  isPaused: boolean;
  onTitleChange?: (newTitle: string) => void;
}

const EditableDialogTitle: React.FC<EditableDialogTitleProps> = ({
  title,
  actionId,
  isActive,
  isPaused,
  onTitleChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    setEditValue(title);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(title);
  };

  const handleSave = async () => {
    if (editValue.trim() === title || !editValue.trim()) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/scheduled-actions", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: actionId,
          title: editValue.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update title");
      }

      const result = await response.json();
      setIsEditing(false);
      
      // Notify parent component of the title change
      onTitleChange?.(result.data.title);
      toast.success("Title updated successfully");
    } catch (error) {
      console.error("Failed to update title:", error);
      // Keep in edit mode on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <div className="flex items-center justify-between text-base w-full">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {isEditing ? (
          <div className="flex items-center gap-2 flex-1">
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="text-base font-medium h-8 px-2"
              autoFocus
              disabled={isLoading}
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={handleSave}
              disabled={isLoading}
              className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCancel}
              disabled={isLoading}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className={cn("font-medium truncate")}>{title}</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleEdit}
              className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100 flex-shrink-0"
            >
              <Pencil className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
      
      <span
        className={cn(
          "text-xs px-2 py-1 rounded-md flex-shrink-0 ml-2",
          isActive
            ? "bg-green-50 text-green-700"
            : isPaused
            ? "bg-gray-50 text-gray-600"
            : "bg-red-50 text-red-600"
        )}
      >
        {isActive ? "Active" : isPaused ? "Paused" : "Deleted"}
      </span>
    </div>
  );
};

export default EditableDialogTitle;
