"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

export type DeleteFileDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id: string;
  storageKey: string;
  fileName: string;
  ownerAccountId: string;
  onDeleted?: () => void;
};

export default function DeleteFileDialog({ open, onOpenChange, id, storageKey, fileName, ownerAccountId, onDeleted }: DeleteFileDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  async function handleConfirm() {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/files/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, storageKey, ownerAccountId }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || "Failed to delete file");
        setLoading(false);
        return;
      }
      onOpenChange(false);
      onDeleted?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete “{fileName}”?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove the file from storage. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={loading} className="bg-red-600 hover:bg-red-700">
            {loading ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}


