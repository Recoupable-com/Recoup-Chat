import { useState, useEffect, useCallback } from "react";

type UseTextEditorParams = {
  content: string | null;
  isDialogOpen: boolean;
  onSave?: (editedContent: string) => Promise<boolean>;
};

type UseTextEditorResult = {
  isEditing: boolean;
  editedContent: string;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  setEditedContent: (content: string) => void;
  handleEditToggle: (editing: boolean) => void;
  handleSave: () => Promise<void>;
  handleDialogClose: () => boolean;
};

/**
 * Unified hook for managing text file editing state
 * Combines functionality from useKnowledgeEditor and useFileEdit
 */
export function useTextEditor({
  content,
  isDialogOpen,
  onSave,
}: UseTextEditorParams): UseTextEditorResult {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Check if content has unsaved changes
  const hasUnsavedChanges = isEditing && content !== editedContent && editedContent !== "";

  // Initialize edited content when entering edit mode
  useEffect(() => {
    if (isEditing && content) {
      setEditedContent(content);
    }
  }, [isEditing, content]);

  // Reset editing state when dialog closes
  useEffect(() => {
    if (!isDialogOpen) {
      setIsEditing(false);
      setEditedContent("");
    }
  }, [isDialogOpen]);

  // Handle edit mode toggle
  const handleEditToggle = useCallback((editing: boolean) => {
    // If canceling edit mode with unsaved changes, confirm first
    if (!editing && hasUnsavedChanges) {
      if (!window.confirm("You have unsaved changes. Are you sure you want to discard them?")) {
        return;
      }
    }

    if (editing && content) {
      setEditedContent(content);
    } else {
      setEditedContent("");
    }
    setIsEditing(editing);
  }, [content, hasUnsavedChanges]);

  // Handle save operation
  const handleSave = useCallback(async () => {
    if (!onSave) return;

    setIsSaving(true);
    try {
      const success = await onSave(editedContent);
      if (success) {
        setIsEditing(false);
        setEditedContent("");
      }
    } finally {
      setIsSaving(false);
    }
  }, [editedContent, onSave]);

  // Handle dialog close with unsaved changes warning
  const handleDialogClose = useCallback((): boolean => {
    if (isEditing && hasUnsavedChanges) {
      return window.confirm("You have unsaved edits. Discard changes?");
    }
    return true;
  }, [isEditing, hasUnsavedChanges]);

  return {
    isEditing,
    editedContent,
    isSaving,
    hasUnsavedChanges,
    setEditedContent,
    handleEditToggle,
    handleSave,
    handleDialogClose,
  };
}

export default useTextEditor;

