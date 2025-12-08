"use client";

import Modal from "../Modal";
import Input from "../Input";
import useCreateOrganization from "@/hooks/useCreateOrganization";
import { Loader2 } from "lucide-react";

const CreateOrgModal = () => {
  const {
    isCreateOrgOpen,
    name,
    setName,
    isCreating,
    createOrganization,
    handleClose,
  } = useCreateOrganization();

  if (!isCreateOrgOpen) return null;

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
            onClick={createOrganization}
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

