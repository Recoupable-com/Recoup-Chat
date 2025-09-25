import { useAgentData } from "../Agents/useAgentData";
import NavButton from "./NavButton";

const AgentsNavItem = ({
  isActive,
  onClick,
}: {
  isActive: boolean;
  onClick: () => void;
}) => {
  const { prefetchAgents } = useAgentData();

  return (
    <NavButton
      icon="robot"
      label="Agents"
      isActive={isActive}
      onClick={onClick}
      aria-label="View agents"
      onHover={prefetchAgents}
    />
  );
};

export default AgentsNavItem; 