import { Input } from "@/components/ui/input";
import { Search as SearchIcon, X } from "lucide-react";

interface SearchProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (e: React.FormEvent) => void;
  onClear: () => void;
  placeholder?: string;
  showClearButton?: boolean;
  disabled?: boolean;
  searchButtonText?: string;
}

const Search = ({
  value,
  onChange,
  onSearch,
  onClear,
  placeholder = "Search...",
  showClearButton = false,
  disabled = false,
  searchButtonText = "Search",
}: SearchProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch(e);
    }
  };

  return (
    <div className="mb-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-10 pr-10"
            disabled={disabled}
          />
          {showClearButton && (
            <button
              onClick={onClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <button
          onClick={onSearch}
          disabled={!value.trim() || disabled}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {searchButtonText}
        </button>
      </div>
    </div>
  );
};

export default Search;
