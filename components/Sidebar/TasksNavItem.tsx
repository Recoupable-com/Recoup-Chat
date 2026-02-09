import NavButton from "./NavButton";

const TasksNavItem = ({
  isActive,
  isExpanded,
  onClick,
}: {
  isActive: boolean;
  isExpanded?: boolean;
  onClick: () => void;
}) => {
  return (
    <NavButton
      icon="clock"
      label="Tasks"
      isActive={isActive}
      isExpanded={isExpanded}
      onClick={onClick}
      aria-label="View tasks"
    />
  );
};

export default TasksNavItem;
