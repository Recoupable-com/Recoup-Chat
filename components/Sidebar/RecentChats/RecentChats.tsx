import RecentChatSkeleton from "./RecentChatSkeleton";
import RenameModal from "../Modals/RenameModal";
import DeleteConfirmationModal from "../Modals/DeleteConfirmationModal";
import { useRecentChats } from "./useRecentChats";
import RecentChatList from "./RecentChatList";
import SelectionModeHeader from "./SelectionModeHeader";
import NoRecentChats from "./NoRecentChats";
import { useUserProvider } from "@/providers/UserProvder";

const RecentChats = ({ toggleModal }: { toggleModal: () => void }) => {
  const { userData } = useUserProvider();
  const {
    conversations,
    isFetching,
    hoveredChatId,
    setHoveredChatId,
    openMenuId,
    toggleMenu,
    isMobile,
    activeChatId,
    selectedChatIds,
    isSelectionMode,
    menuRef,
    buttonRefs,
    isRenameModalOpen,
    isDeleteModalOpen,
    modalState,
    handleChatSelection,
    handleBulkDelete,
    handleChatClick,
    openModal,
    closeModal,
    clearSelection,
    handleApiAction,
    isShiftPressed,
  } = useRecentChats({ toggleModal });

  // Only show skeleton on initial load, not during background refetches
  const showSkeleton = !userData || (isFetching && conversations.length === 0);

  return (
    <div className="w-full flex-grow min-h-0 flex flex-col">
      <div className="h-[1px] bg-border w-full mt-1 mb-2 md:mt-2 md:mb-3 shrink-0" />

      {isSelectionMode ? (
        <SelectionModeHeader
          selectedCount={selectedChatIds.size}
          onCancel={clearSelection}
          onDelete={handleBulkDelete}
        />
      ) : (
        <p className="text-xs font-medium text-muted-foreground px-2 shrink-0 mb-2">
          Recent Chats
        </p>
      )}
      <div className="overflow-y-auto space-y-1 flex-grow">
        {showSkeleton ? (
          <RecentChatSkeleton />
        ) : (
          <>
            {conversations.length > 0 ? (
              <RecentChatList
                conversations={conversations}
                isMobile={isMobile}
                hoveredChatId={hoveredChatId}
                openMenuId={openMenuId}
                activeChatId={activeChatId}
                selectedChatIds={selectedChatIds}
                isSelectionMode={isSelectionMode}
                isShiftPressed={isShiftPressed}
                menuRef={menuRef}
                buttonRefs={buttonRefs}
                setHoveredChatId={setHoveredChatId}
                handleChatClick={handleChatClick}
                handleChatSelection={handleChatSelection}
                toggleMenu={toggleMenu}
                openModal={openModal}
              />
            ) : (
              <NoRecentChats />
            )}
          </>
        )}
      </div>

      <RenameModal
        isOpen={isRenameModalOpen}
        onClose={closeModal}
        chatRoom={modalState.chatRoom}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeModal}
        chatRoom={modalState.chatRoom}
        chatRooms={modalState.chatRooms}
        onDelete={handleApiAction}
      />
    </div>
  );
};

export default RecentChats;
