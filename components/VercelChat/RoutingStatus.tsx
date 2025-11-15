import { motion, AnimatePresence } from "framer-motion";
import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAgentRouting } from "@/providers/AgentRoutingProvider";

export function RoutingStatus() {
  const { routingStatus } = useAgentRouting();

  if (!routingStatus) {
    return null;
  }

  const { status, message, agent } = routingStatus;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg border",
          "bg-muted/50 backdrop-blur-sm",
          "border-border/50",
          status === "analyzing" && "text-muted-foreground",
          status === "complete" && "text-muted-foreground/80"
        )}
      >
        {status === "analyzing" && (
          <Loader className="h-3 w-3 animate-spin text-muted-foreground" />
        )}
        <span>{message}</span>
        {agent && status === "complete" && (
          <span className="text-muted-foreground/60">• {agent}</span>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
