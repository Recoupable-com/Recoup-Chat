"use client";

import useIsMobile from "@/hooks/useIsMobile";
import { X } from "lucide-react";
import Form from "../Form";
import { accountValidation } from "@/lib/utils/setting";
import ImageSelect from "./ImageSelect";
import { useUserProvider } from "@/providers/UserProvder";
import ArtistInstructionTextArea from "./ArtistInstructionTextArea";
import Input from "../Input";
import AccountIdDisplay from "../ArtistSetting/AccountIdDisplay";

const Account = () => {
  const isMobile = useIsMobile();
  const {
    toggleModal,
    setInstruction,
    setName,
    instruction,
    name,
    updating,
    organization,
    setOrganization,
    save,
    signOut,
    userData,
  } = useUserProvider();

  return (
    <Form
      id="account-setting"
      className="w-full grid grid-cols-12 gap-2 md:gap-3"
      validationSchema={accountValidation}
    >
      <div className="col-span-12 flex justify-between items-center border-b-greyborder-b-[1px] pb-3">
        <div className="flex flex-col">
          <p>Account Setting</p>
          {/* Show Account ID if available */}
          {userData?.account_id && (
            <AccountIdDisplay
              accountId={userData.account_id}
              label="Account ID"
            />
          )}
        </div>
        {!isMobile && (
          <button type="button" onClick={toggleModal}>
            <X />
          </button>
        )}
      </div>
      <div className="col-span-7 space-y-1 md:space-y-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          label="Name"
          id="name"
          name="name"
          hookToForm
        />
        <Input
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
          label="Organization"
          id="organization"
          name="organization"
          hookToForm
        />
      </div>
      <div className="col-span-5 space-y-1 md:space-y-2">
        <p className="text-sm">Image</p>
        <ImageSelect />
      </div>
      <div className="col-span-12">
        <ArtistInstructionTextArea
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          label="Custom Instruction"
          id="instruction"
          name="instruction"
          rows={3}
          hookToForm
        />
      </div>
      <button
        className="col-span-12 border-grey border-[1px] rounded-md py-1"
        type="submit"
        onClick={save}
        disabled={updating}
      >
        {updating ? "Saving..." : "Save"}
      </button>
      <button
        className="col-span-12 border-grey border-[1px] rounded-md py-1 mb-4"
        onClick={signOut}
        type="button"
      >
        Log Out
      </button>
    </Form>
  );
};

export default Account;
