import NavButton from "./NavButton";

const FilesNavItem = ({
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
      icon="files"
      label="Files"
      isActive={isActive}
      isExpanded={isExpanded}
      onClick={onClick}
      aria-label="View files"
    />
  );
};

export default FilesNavItem;


