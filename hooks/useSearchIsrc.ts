import { useState } from "react";
import useSongsByIsrc from "./useSongsByIsrc";

const useSearchIsrc = () => {
  const [searchIsrc, setSearchIsrc] = useState("");
  const [activeIsrc, setActiveIsrc] = useState("");

  const queryResult = useSongsByIsrc({
    isrc: activeIsrc,
    enabled: !!activeIsrc,
  });

  const handleSearch = (value?: string) => {
    const searchValue = value ?? searchIsrc;
    if (searchValue.trim()) {
      setActiveIsrc(searchValue.trim());
    }
  };

  const handleClearSearch = () => {
    setSearchIsrc("");
    setActiveIsrc("");
  };

  return {
    searchIsrc,
    setSearchIsrc,
    activeIsrc,
    queryResult,
    handleSearch,
    handleClearSearch,
    isSearchMode: !!activeIsrc,
  };
};

export default useSearchIsrc;
