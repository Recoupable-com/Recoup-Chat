import { useEffect } from "react";

type UseKeyboardSaveParams = {
  isOpen: boolean;
  isEditing: boolean;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  onSave: () => void;
};

/**
 * Hook to handle Cmd+S / Ctrl+S keyboard shortcut for saving
 */
export function useKeyboardSave({
  isOpen,
  isEditing,
  hasUnsavedChanges,
  isSaving,
  onSave,
}: UseKeyboardSaveParams) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        if (isEditing && hasUnsavedChanges && !isSaving) {
          onSave();
        }
      }
    };

    if (isOpen && isEditing) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, isEditing, hasUnsavedChanges, isSaving, onSave]);
}

