"use client";

import { useState } from "react";
import MiniMenu from "./MiniMenu";
import { motion } from "framer-motion";
import Menu from "./Menu";
import AccountModal from "../AccountModal";
import OrgSettingsModal from "../Organization/OrgSettingsModal";
import CreateOrgModal from "../Organization/CreateOrgModal";

const Sidebar = () => {
  const [menuExpanded, setMenuExpanded] = useState(true);
  const toggleMenuExpanded = () => setMenuExpanded(!menuExpanded);
  const animate = { width: menuExpanded ? 265 : 80 };
  const initial = { width: 265 };

  return (
    <motion.div
      className="bg-sidebar"
      animate={animate}
      initial={initial}
      transition={{ duration: 0.2 }}
    >
      {menuExpanded ? (
        <Menu toggleMenuExpanded={toggleMenuExpanded} />
      ) : (
        <MiniMenu toggleMenuExpanded={toggleMenuExpanded} />
      )}
      <AccountModal />
      <OrgSettingsModal />
      <CreateOrgModal />
    </motion.div>
  );
};

export default Sidebar;
