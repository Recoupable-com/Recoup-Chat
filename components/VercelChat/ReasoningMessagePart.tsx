import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { SpinnerIcon, ChevronDownIcon, ChevronUpIcon } from "./icons";
import ChatMarkdown from "../Chat/ChatMarkdown";
import { ReasoningUIPart } from "ai";

interface ReasoningMessagePartProps {
  part: ReasoningUIPart;
  isReasoning: boolean;
}

const ReasoningMessagePart: React.FC<ReasoningMessagePartProps> = ({
  part,
  isReasoning,
}: ReasoningMessagePartProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const variants = {
    collapsed: {
      height: 0,
      opacity: 0,
      marginTop: 0,
      marginBottom: 0,
    },
    expanded: {
      height: "auto",
      opacity: 1,
      marginTop: "1rem",
      marginBottom: 0,
    },
  };

  useEffect(() => {
    if (isReasoning) {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
    }
  }, [isReasoning]);

  return (
    <div className="flex flex-col">
      {isReasoning ? (
        <div className="flex flex-row gap-2 items-center">
          <div className="font-medium text-sm">Reasoning</div>
          <div className="animate-spin">
            <SpinnerIcon />
          </div>
        </div>
      ) : (
        <div className="flex flex-row gap-2 items-center">
          <div className="font-medium text-sm">Reasoned for a few seconds</div>
          <button
            className={cn(
              "cursor-pointer rounded-full dark:hover:bg-zinc-800 hover:bg-zinc-200",
              {
                "dark:bg-zinc-800 bg-zinc-200": isExpanded,
              }
            )}
            onClick={() => {
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? <ChevronDownIcon /> : <ChevronUpIcon />}
          </button>
        </div>
      )}

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="reasoning"
            className="text-sm dark:text-zinc-400 text-zinc-600 flex flex-col gap-4 border-l pl-3 dark:border-zinc-800 [&_p]:text-sm [&_li]:text-sm bg-primary/5 p-2 rounded-md"
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={variants}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <ChatMarkdown>{part.text || ""}</ChatMarkdown>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReasoningMessagePart;
