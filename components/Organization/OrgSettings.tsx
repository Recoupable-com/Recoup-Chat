"use client";

import Form from "../Form";
import Input from "../Input";
import useOrgSettings from "@/hooks/useOrgSettings";
import { useOrganization } from "@/providers/OrganizationProvider";
import AccountIdDisplay from "../ArtistSetting/AccountIdDisplay";
import ArtistInstructionTextArea from "../Account/ArtistInstructionTextArea";
import { Camera, Loader2, Trash2, Plus, X } from "lucide-react";
import ImageWithFallback from "../ImageWithFallback";
import Icon, { IconsType } from "../Icon";
import getKnowledgeIcon from "@/lib/getKnowledgeIcon";
import { Button } from "../ui/button";

const OrgSettings = () => {
  const { editingOrgId, closeOrgSettings } = useOrganization();
  const {
    name,
    setName,
    image,
    instruction,
    setInstruction,
    knowledges,
    isLoading,
    isSaving,
    imageUploading,
    knowledgeUploading,
    imageRef,
    knowledgeRef,
    handleImageSelected,
    removeImage,
    handleKnowledgesSelected,
    handleDeleteKnowledge,
    save,
  } = useOrgSettings(editingOrgId);

  const handleSave = async () => {
    const success = await save();
    if (success) {
      closeOrgSettings();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const hasImage = image && image !== "";
  const initials = name ? name.slice(0, 2).toUpperCase() : "OR";

  return (
    <Form
      id="org-setting"
      className="w-full flex flex-col items-center max-w-md mx-auto pb-2"
    >
      {/* Header Section */}
      <div className="w-full flex flex-col items-center space-y-4 mb-4">
        <div className="flex flex-col items-center gap-3">
          {/* Image Upload */}
          <div className="group relative inline-block">
            <button
              className="rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              type="button"
              onClick={() => imageRef.current?.click()}
            >
              <div className="size-32 rounded-full relative overflow-hidden flex items-center justify-center ring-1 ring-border bg-muted text-muted-foreground transition-all hover:ring-ring/50">
                {imageUploading ? (
                  <Loader2 className="h-8 w-8 animate-spin" />
                ) : hasImage ? (
                  <ImageWithFallback
                    src={image}
                    fallbackSrc=""
                    alt={name || "Organization"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="text-3xl font-semibold">{initials}</span>
                )}
              </div>
            </button>
            <div className="absolute bottom-0 right-0 flex gap-1">
              <button
                type="button"
                onClick={() => imageRef.current?.click()}
                className="p-2 rounded-full bg-background border border-border shadow-sm hover:bg-muted transition-colors"
              >
                <Camera className="h-4 w-4" />
              </button>
              {hasImage && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="p-2 rounded-full bg-background border border-border shadow-sm hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          <input
            ref={imageRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelected}
            className="hidden"
          />
          {editingOrgId && (
            <AccountIdDisplay accountId={editingOrgId} label="Org ID" />
          )}
        </div>
      </div>

      {/* Form Fields */}
      <div className="w-full space-y-5 mb-6">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          label="Organization Name"
          id="orgName"
          name="orgName"
          className="bg-background border-border text-foreground"
        />

        <div className="pt-2">
          <div className="mb-1.5 flex justify-between items-baseline">
            <label className="text-sm font-medium text-foreground">
              Organization Instructions
            </label>
            <span className="text-[10px] text-muted-foreground">
              Shared context for all org members
            </span>
          </div>
          <ArtistInstructionTextArea
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            label=""
            id="orgInstruction"
            name="orgInstruction"
            rows={4}
            className="bg-background border-border text-foreground text-sm resize-none"
            placeholder="e.g. We're a music label focused on hip-hop artists. Always consider our brand voice."
          />
        </div>

        {/* Knowledge Base Section */}
        <div className="pt-2">
          <div className="mb-1.5 flex justify-between items-baseline">
            <label className="text-sm font-medium text-foreground">
              Knowledge Base
            </label>
            <span className="text-[10px] text-muted-foreground">
              Shared files for all org members
            </span>
          </div>
          <div className="space-y-2">
            {/* Upload Button */}
            <button
              type="button"
              className="w-full flex gap-2 items-center border-border rounded-md p-2 border bg-background hover:bg-muted transition-colors"
              onClick={() => knowledgeRef.current?.click()}
              disabled={knowledgeUploading}
            >
              {knowledgeUploading ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <Plus className="size-5" />
              )}
              <p className="text-sm">
                {knowledgeUploading ? "Uploading..." : "Click or Drop Files"}
              </p>
            </button>
            <input
              type="file"
              multiple
              hidden
              ref={knowledgeRef}
              onChange={handleKnowledgesSelected}
            />

            {/* Knowledge Files List */}
            {knowledges.length > 0 && (
              <div className="space-y-1">
                {knowledges.map((file, index) => (
                  <div
                    key={index}
                    className="group flex w-full items-center justify-between rounded-sm border border-border/40 px-2 py-1 transition-colors hover:bg-accent"
                  >
                    <div className="flex items-center gap-1 min-w-0">
                      <Icon name={getKnowledgeIcon(file.type) as IconsType} />
                      <span className="truncate max-w-[200px] text-xs">
                        {file.name}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Remove file"
                      className="h-7 w-7 opacity-70 transition-colors group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => handleDeleteKnowledge(index)}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="w-full space-y-3 mt-2">
        <button
          className="w-full bg-primary text-primary-foreground rounded-lg py-2.5 text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          type="button"
          onClick={handleSave}
          disabled={isSaving || imageUploading || knowledgeUploading}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </Form>
  );
};

export default OrgSettings;

