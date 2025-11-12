interface SelectionModeHeaderProps {
  selectedCount: number;
  onCancel: () => void;
  onDelete: () => void;
}

const SelectionModeHeader = ({
  selectedCount,
  onCancel,
  onDelete,
}: SelectionModeHeaderProps) => {
  return (
    <div className="flex items-center justify-between px-2 mb-1 md:mb-2 shrink-0">
      <p className="text-sm font-sans text-grey-dark">
        {selectedCount} selected
      </p>
      <div className="flex gap-2">
        <button
          onClick={onCancel}
          className="text-xs granary font-sans text-grey-dark hover:text-black transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onDelete}
          className="text-xs font-sans text-red-500 hover:text-red-700 transition-colors font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default SelectionModeHeader;
