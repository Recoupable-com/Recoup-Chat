import React from "react";

/**
 * Component that displays a loading state while the delete_artist tool is being called
 */
export function DeleteArtistToolCall() {
  return (
    <div className="flex items-center space-x-4 p-3 rounded-md bg-muted border border-border my-2">
      <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center">
        <div className="animate-pulse h-6 w-6 rounded-full bg-muted-foreground/50"></div>
      </div>
      <div>
        <p className="font-medium text-foreground">Deleting Artist...</p>
        <p className="text-sm text-muted-foreground">
          Please wait while the artist is being deleted
        </p>
      </div>
    </div>
  );
}

export default DeleteArtistToolCall;
