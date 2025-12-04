"use client";

import { useState } from "react";
import Modal from "../Modal";
import Input from "../Input";
import { useOrganization } from "@/providers/OrganizationProvider";
import { useUserProvider } from "@/providers/UserProvder";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

const CreateOrgModal = () => {
  const { isCreateOrgOpen, closeCreateOrg, setSelectedOrgId } = useOrganization();
  const { userData } = useUserProvider();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  if (!isCreateOrgOpen) return null;

  const handleCreate = async () => {
    if (!name.trim() || !userData?.account_id) return;

    setIsCreating(true);
    try {
      const response = await fetch("/api/organization/create", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          userId: userData.account_id,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        // Invalidate the organizations query to refetch
        await queryClient.invalidateQueries({ queryKey: ["userOrganizations"] });
        // Select the new org
        setSelectedOrgId(data.organization.id);
        // Reset and close
        setName("");
        closeCreateOrg();
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setName("");
    closeCreateOrg();
  };

  return (
    <Modal onClose={handleClose}>
      <div className="w-full max-w-md mx-auto">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Create Organization
        </h2>

        <div className="space-y-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            label="Organization Name"
            id="newOrgName"
            name="newOrgName"
            placeholder="e.g. Rostrum Records"
            className="bg-background border-border text-foreground"
            autoFocus
          />

          <button
            className="w-full bg-primary text-primary-foreground rounded-lg py-2.5 text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            type="button"
            onClick={handleCreate}
            disabled={isCreating || !name.trim()}
          >
            {isCreating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Organization"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateOrgModal;

