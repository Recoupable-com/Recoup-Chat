"use client";

import { MicVocal, FolderOpen } from "lucide-react";
import Form from "../Form";
import { validation } from "@/lib/utils/setting";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { SETTING_MODE } from "@/types/Setting";
import Knowledges from "./Knowledges";
import ImageSelect from "./ImageSelect";
import KnowledgeSelect from "./KnowledgeSelect";
import Inputs from "./Inputs";
import DeleteModal from "./DeleteModal";
import { useState } from "react";
import AccountIdDisplay from "./AccountIdDisplay";
import { borderPatterns, buttonPatterns, iconPatterns, textPatterns } from "@/lib/styles/patterns";
import { cn } from "@/lib/utils";

const Settings = () => {
  const {
    toggleSettingModal,
    saveSetting,
    updating,
    settingMode,
    knowledgeUploading,
    setSelectedArtist,
    editableArtist,
  } = useArtistProvider();
  const [isVisibleDeleteModal, setIsVisibleDeleteModal] = useState(false);
  
  // Determine if this is a workspace (not an artist)
  const isWorkspace = editableArtist?.account_type === "workspace";
  const entityLabel = isWorkspace ? "Workspace" : "Artist";

  const handleSave = async () => {
    const artistInfo = await saveSetting();
    // Only update selected artist if save was successful
    if (artistInfo) {
      setSelectedArtist(artistInfo);
    }
    toggleSettingModal();
  };

  return (
    <Form
      id="artist-setting"
      className="w-full grid grid-cols-12 gap-2 md:gap-3"
      validationSchema={validation}
      onSubmit={handleSave}
    >
      <div className={cn("col-span-12 flex justify-between items-center pb-3", borderPatterns.divider)}>
        <div className="flex gap-2 items-center">
          {isWorkspace ? (
            <FolderOpen className={iconPatterns.primary} />
          ) : (
            <MicVocal className={iconPatterns.primary} />
          )}
          <div className="flex flex-col">
            <p className={textPatterns.heading}>
              {settingMode === SETTING_MODE.CREATE
                ? `Add ${entityLabel}`
                : `${entityLabel} Settings`}
            </p>
            {settingMode === SETTING_MODE.UPDATE && editableArtist && (
              <AccountIdDisplay accountId={editableArtist.account_id} label={`${entityLabel} ID`} />
            )}
          </div>
        </div>
      </div>
      <div className="col-span-4 space-y-1 md:space-y-2">
        <p className="text-sm text-muted-foreground">{entityLabel} Image</p>
        <ImageSelect />
      </div>
      <Inputs />
      <div className="col-span-7 md:col-span-5 space-y-1 md:space-y-2">
        <p className="text-sm text-muted-foreground">Knowledge Base</p>
        <KnowledgeSelect />
      </div>
      <div className="col-span-7 space-y-1 md:space-y-2 flex flex-col justify-end items-start">
        {knowledgeUploading ? (
          <p className="text-sm text-muted-foreground">Uploading...</p>
        ) : (
          <Knowledges />
        )}
      </div>
      <button
        className={cn(buttonPatterns.primary, "col-span-12 py-2")}
        type="submit"
      >
        {updating ? "Saving..." : "Save"}
      </button>
      <button
        className={cn(buttonPatterns.danger, "col-span-12 py-2 mb-4")}
        onClick={() => setIsVisibleDeleteModal(true)}
        type="button"
      >
        Delete
      </button>
      {isVisibleDeleteModal && (
        <DeleteModal
          toggleModal={() => setIsVisibleDeleteModal(!isVisibleDeleteModal)}
        />
      )}
    </Form>
  );
};

export default Settings;
