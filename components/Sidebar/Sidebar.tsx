"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Menu from "./Menu";
import AccountModal from "../AccountModal";
import OrgSettingsModal from "../Organization/OrgSettingsModal";
import CreateOrgModal from "../Organization/CreateOrgModal";
import useIsMobile from "@/hooks/useIsMobile";

const Sidebar = () => {
  const [menuExpanded, setMenuExpanded] = useState(false);
  const isMobile = useIsMobile();
  const animate = { width: menuExpanded ? 240 : 56 };
  const initial = { width: 56 };

  return (
    <motion.div
      className="bg-sidebar overflow-hidden"
      animate={animate}
      initial={initial}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setMenuExpanded(!isMobile)}
      onMouseLeave={() => setMenuExpanded(false)}
    >
      <Menu isExpanded={menuExpanded} />
      <AccountModal />
      <OrgSettingsModal />
      <CreateOrgModal />
    </motion.div>
  );
};

export default Sidebar;
