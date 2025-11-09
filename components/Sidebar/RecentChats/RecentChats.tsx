import RecentChatSkeleton from "./RecentChatSkeleton";
import RenameModal from "../Modals/RenameModal";
import DeleteConfirmationModal from "../Modals/DeleteConfirmationModal";
import { useRecentChats } from "./useRecentChats";
import RecentChatList from "./RecentChatList";

const RecentChats = ({ toggleModal }: { toggleModal: () => void }) => {
  const {
    conversations,
    isLoading,
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

  return (
    <div className="w-full flex-grow min-h-0 flex flex-col">
      <div className="h-[1px] bg-grey-light w-full mt-1 mb-2 md:mt-2 md:mb-3 shrink-0" />

      {isSelectionMode ? (
        <div className="flex items-center justify-between px-2 mb-1 md:mb-2 shrink-0">
          <p className="text-sm font-inter text-grey-dark">
            {selectedChatIds.size} selected
          </p>
          <div className="flex gap-2">
            <button
              onClick={clearSelection}
              className="text-xs font-inter text-grey-dark hover:text-black transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleBulkDelete}
              className="text-xs font-inter text-red-500 hover:text-red-700 transition-colors font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm mb-1 md:mb-2 font-inter text-grey-dark px-2 shrink-0">
          Recent Chats
        </p>
      )}
      <div className="overflow-y-auto space-y-1 flex-grow">
        {isLoading ? (
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
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                <p className="text-sm font-inter text-grey-dark mb-1">
                  No recent chats
                </p>
                <p className="text-xs font-inter text-grey-dark-1">
                  Start a conversation to see it here
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <RenameModal
        isOpen={isRenameModalOpen}
        onClose={closeModal}
        chatRoom={modalState.chatRoom}
        onRename={handleApiAction}
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
