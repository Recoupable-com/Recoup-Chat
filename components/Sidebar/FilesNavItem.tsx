import NavButton from "./NavButton";

const FilesNavItem = ({
  isActive,
  onClick,
}: {
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <NavButton
      icon="files"
      label="Files"
      isActive={isActive}
      onClick={onClick}
      aria-label="View files"
    />
  );
};

export default FilesNavItem;


