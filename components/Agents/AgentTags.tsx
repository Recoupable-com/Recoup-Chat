import type React from "react";

interface AgentTagsProps {
  tags: string[];
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  showAllTags: boolean;
  setShowAllTags: (show: boolean) => void;
}

const AgentTags: React.FC<AgentTagsProps> = ({
  tags,
  selectedTag,
  setSelectedTag,
}) => (
  <div className="flex flex-wrap gap-2 items-center justify-start">
    {tags.map((tag) => (
      <button
        key={tag}
        type="button"
        className={`px-3 py-1 rounded-full border text-sm transition-colors ${
          selectedTag === tag
            ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white"
            : "bg-white dark:bg-dark-bg-secondary text-black dark:text-white border-gray-200 dark:border-dark-border-light hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary"
        }`}
        onClick={() => setSelectedTag(tag)}
      >
        {tag}
      </button>
    ))}
  </div>
);

export default AgentTags; 