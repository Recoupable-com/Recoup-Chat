"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PropsWithChildren } from "react";
import { useQueryClient } from "@tanstack/react-query";

type RevokeAccessDialogProps = PropsWithChildren<{
  fileId: string;
  artistId: string;
  accountId?: string;
  artistLabel?: string;
}>;

export default function RevokeAccessDialog({
  fileId,
  artistId,
  accountId,
  artistLabel,
  children,
}: RevokeAccessDialogProps) {
  const queryClient = useQueryClient();

  const handleConfirm = async () => {
    await fetch("/api/files/revoke-access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileId, artistId }),
    });
    if (accountId) {
      queryClient.invalidateQueries({ queryKey: ["file-access-artists", fileId, accountId] });
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove access?</AlertDialogTitle>
          <AlertDialogDescription>
            {artistLabel ? (
              <span>
                This will revoke access to this file for <strong>{artistLabel}</strong>.
                You can grant access again later.
              </span>
            ) : (
              "This will revoke access to this file for the selected artist. You can grant access again later."
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>Remove</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}


