import { MoreHorizontal, Pencil, Trash2, Check } from "lucide-react";
import type { Conversation } from "@/types/Chat";
import type { ArtistAgent } from "@/lib/supabase/getArtistAgents";
import capitalize from "@/lib/capitalize";
import { useState, type RefObject } from "react";
import { cn } from "@/lib/utils";
import useCreateChat from "@/hooks/useCreateChat";

type ChatItemProps = {
  chatRoom: Conversation | ArtistAgent;
  isMobile: boolean;
  isHovered: boolean;
  isMenuOpen: boolean;
  isActive?: boolean;
  isSelected?: boolean;
  isSelectionMode?: boolean;
  isShiftPressed?: boolean;
  menuRef: RefObject<HTMLDivElement> | null;
  setButtonRef: (el: HTMLButtonElement | null) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onChatClick: () => void;
  onSelect: (isShiftKey: boolean) => void;
  onMenuToggle: () => void;
  onRenameClick: () => void;
  onDeleteClick: () => void;
};

// Helper functions consolidated into one
const getChatDisplayInfo = (item: Conversation | ArtistAgent) => {
  const isChatRoom = 'id' in item;
  const displayName = isChatRoom ? item.topic : capitalize(item.type);
  return { 
    displayName: displayName || `${capitalize(isChatRoom ? "Chat" : item.type)} Analysis`, 
    isChatRoom 
  };
};

const ChatItem = ({
  chatRoom,
  isMobile,
  isHovered,
  isMenuOpen,
  isActive = false,
  isSelected = false,
  isSelectionMode = false,
  isShiftPressed = false,
  menuRef,
  setButtonRef,
  onMouseEnter,
  onMouseLeave,
  onChatClick,
  onSelect,
  onMenuToggle,
  onRenameClick,
  onDeleteClick
}: ChatItemProps) => {
  const [displayName, setDisplayName] = useState(getChatDisplayInfo(chatRoom).displayName);
  
  const showOptions = isMobile || isHovered || isActive;
  const isOptimisticChatItem = (
    'id' in chatRoom &&
    Array.isArray((chatRoom as Conversation).memories) &&
    (chatRoom as Conversation).memories.some((m) => {
      const content = m?.content as unknown;
      return (
        !!content &&
        typeof content === 'object' &&
        'optimistic' in (content as Record<string, unknown>) &&
        (content as { optimistic?: unknown }).optimistic === true
      );
    })
  );
  useCreateChat({
    isOptimisticChatItem,
    chatRoom,
    setDisplayName,
  });

  // Show checkbox only when shift is held AND (hovering OR already in selection mode)
  const showCheckbox = isShiftPressed && (isHovered || isSelectionMode);

  const handleClick = (e: React.MouseEvent) => {
    if (e.shiftKey || isSelectionMode) {
      onSelect(e.shiftKey);
    } else {
      onChatClick();
    }
  };

  return (
    <div 
      className={`flex gap-2 items-center w-full py-1.5 px-2 rounded-xl transition-all duration-150 relative ${
        isSelected 
          ? 'bg-primary/20 border border-primary/30' 
          : isActive 
            ? 'bg-primary/10' 
            : 'hover:bg-gray-100'
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Selection checkbox */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onSelect(e.shiftKey);
        }}
        className={`shrink-0 w-4 h-4 rounded border-2 transition-all duration-150 flex items-center justify-center ${
          showCheckbox ? 'opacity-100' : 'opacity-0'
        } ${
          isSelected 
            ? 'bg-primary border-primary' 
            : 'border-gray-300 hover:border-primary/50'
        }`}
        aria-label="Select chat"
      >
        {isSelected && <Check size={12} className="text-white" strokeWidth={3} />}
      </button>

      <button
        className="flex-grow text-left truncate min-w-0"
        type="button"
        onClick={handleClick}
      >
        <p className={`text-sm truncate ${isActive ? 'font-medium' : ''}`}>
          {displayName}
        </p>
      </button>
      
      {/* Three-dot menu - hide in selection mode */}
      {!isSelectionMode && (
        <button
          ref={setButtonRef}
          className={cn(`shrink-0 p-1 text-gray-500 hover:text-gray-700 transition-colors duration-150 ${
            showOptions ? 'opacity-100' : 'opacity-0'
          }`, {
            'opacity-50 pointer-events-none': isOptimisticChatItem
          })}
          onClick={(e) => {
            e.stopPropagation();
            onMenuToggle();
          }}
          type="button"
          aria-label="Chat options"
        >
          <MoreHorizontal size={16} />
        </button>
      )}
      
      {isMenuOpen && (
        <div 
          ref={menuRef}
          className="absolute right-2 top-full mt-1 bg-white shadow-lg rounded-md py-1 z-10 w-32 border border-gray-100"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.key === 'Escape' && onMenuToggle()}
          tabIndex={-1}
          role="menu"
        >
          <button
            type="button"
            className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm flex items-center gap-2 transition-colors"
            onClick={onRenameClick}
            role="menuitem"
          >
            <Pencil size={14} className="text-gray-500" />
            <span>Rename</span>
          </button>
          <button
            type="button"
            className="w-full text-left px-3 py-2 hover:bg-red-50 text-sm text-red-500 flex items-center gap-2 transition-colors"
            onClick={onDeleteClick}
            role="menuitem"
          >
            <Trash2 size={14} className="text-red-500" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatItem;
