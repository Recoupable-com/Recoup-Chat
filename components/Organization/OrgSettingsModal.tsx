"use client";

import Modal from "../Modal";
import { useOrganization } from "@/providers/OrganizationProvider";
import OrgSettings from "./OrgSettings";

const OrgSettingsModal = () => {
  const { isOrgSettingsOpen, closeOrgSettings } = useOrganization();

  if (!isOrgSettingsOpen) return null;

  return (
    <Modal onClose={closeOrgSettings}>
      <OrgSettings />
    </Modal>
  );
};

export default OrgSettingsModal;

