"use client";

import { MicVocal } from "lucide-react";
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSave = async () => {
    const artistInfo = await saveSetting();
    setSelectedArtist(artistInfo);
    toggleSettingModal();
  };

  return (
    <Form
      id="artist-setting"
      className="w-full grid grid-cols-12 gap-2 md:gap-3"
      validationSchema={validation}
      onSubmit={handleSave}
    >
      <div className="col-span-12 flex justify-between items-center border-b border-grey dark:border-dark-border pb-3">
        <div className="flex gap-2 items-center">
          <MicVocal className="text-gray-700 dark:text-dark-text-primary" />
          <div className="flex flex-col">
            <p className="text-gray-900 dark:text-dark-text-primary font-medium">
              {settingMode === SETTING_MODE.CREATE
                ? "Add Artist"
                : "Artist Settings"}
            </p>
            {settingMode === SETTING_MODE.UPDATE && editableArtist && (
              <AccountIdDisplay accountId={editableArtist.account_id} />
            )}
          </div>
        </div>
      </div>
      <div className="col-span-4 space-y-1 md:space-y-2">
        <p className="text-sm text-gray-700 dark:text-dark-text-secondary">Artist Image</p>
        <ImageSelect />
      </div>
      <Inputs />
      <div className="col-span-7 md:col-span-5 space-y-1 md:space-y-2">
        <p className="text-sm text-gray-700 dark:text-dark-text-secondary">Knowledge Base</p>
        <KnowledgeSelect />
      </div>
      <div className="col-span-7 space-y-1 md:space-y-2 flex flex-col justify-end items-start">
        {knowledgeUploading ? (
          <p className="text-sm text-gray-600 dark:text-dark-text-muted">Uploading...</p>
        ) : (
          <Knowledges />
        )}
      </div>
      <button
        className="col-span-12 border border-grey dark:border-dark-border rounded-md py-1 bg-gray-50 dark:bg-dark-bg-hover hover:bg-gray-100 dark:hover:bg-dark-bg-active text-gray-900 dark:text-dark-text-primary transition-colors"
        type="submit"
      >
        {updating ? "Saving..." : "Save"}
      </button>
      <button
        className="col-span-12 border border-grey dark:border-dark-border rounded-md py-1 mb-4 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
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
