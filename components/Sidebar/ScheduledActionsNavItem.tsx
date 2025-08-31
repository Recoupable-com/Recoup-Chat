import NavButton from "./NavButton";

const ScheduledActionsNavItem = ({
  isActive,
  onClick,
}: {
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <NavButton
      icon="clock"
      label="Tasks"
      isActive={isActive}
      onClick={onClick}
      aria-label="View scheduled actions"
    />
  );
};

export default ScheduledActionsNavItem;
