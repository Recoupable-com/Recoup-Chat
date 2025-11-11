import React from "react";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface CommentDetailsDialogHeaderProps {
  currentIndex: number;
  totalComments: number;
}

const CommentDetailsDialogHeader: React.FC<CommentDetailsDialogHeaderProps> = ({
  currentIndex,
  totalComments,
}) => {
  return (
    <DialogHeader>
      <DialogTitle className="flex items-center space-x-2">
        <span>Comment Details</span>
        <span className="text-xs text-muted-foreground font-normal">
          {currentIndex + 1} of {totalComments}
        </span>
      </DialogTitle>
      <DialogDescription className="text-xs text-muted-foreground">
        Full details of the selected comment
      </DialogDescription>
    </DialogHeader>
  );
};

export default CommentDetailsDialogHeader; 