"use client";

import { useState } from "react";
import { Music, FolderPlus, Loader } from "lucide-react";
import { toast } from "sonner";
import Modal from "./Modal";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useUserProvider } from "@/providers/UserProvder";
import { useOrganization } from "@/providers/OrganizationProvider";
import { cn } from "@/lib/utils";

interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateWorkspaceModal = ({ isOpen, onClose }: CreateWorkspaceModalProps) => {
  const { 
    toggleCreation, 
    getArtists, 
    setIsCreatingArtist,
    setSelectedArtist,
    setEditableArtist,
    setIsOpenSettingModal,
  } = useArtistProvider();
  const { userData } = useUserProvider();
  const { selectedOrgId } = useOrganization();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateArtist = () => {
    setIsCreatingArtist(true);
    toggleCreation();
    onClose();
  };

  const handleCreateWorkspace = async () => {
    if (!userData?.id) return;
    
    setIsCreating(true);
    try {
      const response = await fetch("/api/workspace/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          account_id: userData.id,
          // Keep workspace linked to current org context when applicable.
          organization_id: selectedOrgId,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.workspace) {
        // Format workspace to match ArtistRecord structure
        const newWorkspace = {
          ...data.workspace,
          account_id: data.workspace.id,
        };
        
        // Auto-select the new workspace
        setSelectedArtist(newWorkspace);
        
        // Set it as editable and open settings modal
        setEditableArtist(newWorkspace);
        setIsOpenSettingModal(true);
        
        // Refresh the list to include the new workspace
        await getArtists();
      } else {
        toast.error("Failed to create workspace");
      }
    } catch (error) {
      console.error("Error creating workspace:", error);
      toast.error("Failed to create workspace");
    } finally {
      setIsCreating(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <Modal onClose={onClose} containerClasses="!w-full md:!w-[360px] !p-6">
      <div className="pt-4">
        <h2 className="text-xl font-semibold mb-2">Create Workspace</h2>
        <p className="text-sm text-muted-foreground mb-6">
          A workspace keeps your knowledge, files, tasks, and chats organized around a topic.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={handleCreateArtist}
            disabled={isCreating}
            className={cn(
              "w-full flex items-center gap-4 p-4 rounded-xl border border-border",
              "hover:bg-accent hover:border-primary/20 transition-all",
              "text-left group"
            )}
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Music className="size-6 text-primary" />
            </div>
            <div>
              <p className="font-medium">Artist</p>
              <p className="text-sm text-muted-foreground">
                Set up with AI to connect streaming and socials
              </p>
            </div>
          </button>

          <button
            onClick={handleCreateWorkspace}
            disabled={isCreating}
            className={cn(
              "w-full flex items-center gap-4 p-4 rounded-xl border border-border",
              "hover:bg-accent hover:border-primary/20 transition-all",
              "text-left group"
            )}
          >
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-muted/80 transition-colors">
              {isCreating ? (
                <Loader className="size-6 text-muted-foreground animate-spin" />
              ) : (
                <FolderPlus className="size-6 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="font-medium">Blank Workspace</p>
              <p className="text-sm text-muted-foreground">
                Start empty and configure it yourself
              </p>
            </div>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateWorkspaceModal;
