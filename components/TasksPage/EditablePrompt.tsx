import { useState } from "react";
import { Check, X, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateScheduledAction } from "@/hooks/useUpdateScheduledAction";

interface EditablePromptProps {
  prompt: string;
  taskId: string;
  onPromptChange?: (newPrompt: string) => void;
}

const EditablePrompt: React.FC<EditablePromptProps> = ({
  prompt,
  taskId,
  onPromptChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(prompt);
  const { updateAction, isLoading } = useUpdateScheduledAction();

  const handleEdit = () => {
    setIsEditing(true);
    setEditValue(prompt);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(prompt);
  };

  const handleSave = async () => {
    if (editValue.trim() === prompt || !editValue.trim()) {
      setIsEditing(false);
      return;
    }

    try {
      await updateAction({
        actionId: taskId,
        updates: { prompt: editValue.trim() },
        onSuccess: (updatedData) => {
          setIsEditing(false);
          onPromptChange?.(updatedData.prompt);
        },
        successMessage: "Prompt updated successfully",
      });
    } catch {
      console.error("Failed to update prompt");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-medium text-gray-900">Prompt</h3>
        {!isEditing && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleEdit}
            className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            <Pencil className="h-3 w-3" />
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-2 px-1">
          <Textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="text-sm leading-snug min-h-[80px] resize-y no-scrollbar"
            placeholder="Enter prompt..."
            disabled={isLoading}
            autoFocus
            rows={10}
          />
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              onClick={handleSave}
              disabled={isLoading}
              className="h-8 px-3 text-xs bg-green-600 hover:bg-green-700"
            >
              <Check className="h-3 w-3" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="h-8 px-3 text-xs"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-600 leading-snug whitespace-pre-wrap">
          {prompt}
        </p>
      )}
    </div>
  );
};

export default EditablePrompt;
