import React, { useState } from "react";
import { Action } from "@/components/actions";
import { CopyIcon, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CopyActionProps {
  text: string;
}

const CopyAction: React.FC<CopyActionProps> = ({ text }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);

      // Reset back to copy icon after 1.5 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 1500);
    } catch {
      console.error("Failed to copy to clipboard");
    }
  };

  return (
    <Action
      onClick={handleCopy}
      label="Copy"
      tooltip="Copy response to clipboard"
    >
      <AnimatePresence mode="wait">
        {isCopied ? (
          <motion.div
            key="check"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.15 }}
          >
            <Check className="!w-3 !h-3" />
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.15 }}
          >
            <CopyIcon className="!w-3 !h-3" />
          </motion.div>
        )}
      </AnimatePresence>
    </Action>
  );
};

export default CopyAction;
