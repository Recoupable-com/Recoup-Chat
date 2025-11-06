import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteScheduledAction } from "@/hooks/useDeleteScheduledAction";
import { useState } from "react";
import { Trash2 } from "lucide-react";

interface DeleteTaskButtonProps {
  taskId: string;
  taskTitle: string;
  onDelete?: () => void;
  className?: string;
}

const DeleteTaskButton: React.FC<DeleteTaskButtonProps> = ({
  taskId,
  taskTitle,
  onDelete,
  className = "",
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { deleteAction, isLoading } = useDeleteScheduledAction();

  const handleDeleteConfirm = async () => {
    try {
      await deleteAction({
        actionId: taskId,
        onSuccess: () => {
          setShowDeleteConfirm(false);
          onDelete?.();
        },
      });
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <Button 
        variant="destructive" 
        size="sm" 
        className={`w-full flex items-center gap-2 ${className}`}
        onClick={handleDeleteClick}
        disabled={isLoading}
      >
        <Trash2 className="h-4 w-4" />
        Delete Task
      </Button>

      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete &ldquo;{taskTitle}&rdquo;? This action cannot be undone.
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={handleCancelDelete}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteConfirm}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteTaskButton;
