import NavButton from "./NavButton";

const AgentsNavItem = ({
  isActive,
  onClick,
}: {
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <NavButton
      icon="robot"
      label="Agents"
      isActive={isActive}
      onClick={onClick}
      aria-label="View agents"
    />
  );
};

export default AgentsNavItem; 