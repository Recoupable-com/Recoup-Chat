import NavButton from "./NavButton";

const TasksNavItem = ({
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
      aria-label="View tasks"
    />
  );
};

export default TasksNavItem;
