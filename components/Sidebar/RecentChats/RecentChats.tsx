import RecentChatSkeleton from "./RecentChatSkeleton";
import RenameModal from "../Modals/RenameModal";
import DeleteConfirmationModal from "../Modals/DeleteConfirmationModal";
import { useRecentChats } from "./useRecentChats";
import RecentChatList from "./RecentChatList";
import SelectionModeHeader from "./SelectionModeHeader";
import NoRecentChats from "./NoRecentChats";
import { useUserProvider } from "@/providers/UserProvder";
import { useArtistProvider } from "@/providers/ArtistProvider";

const RecentChats = ({ toggleModal }: { toggleModal: () => void }) => {
  const { userData } = useUserProvider();
  const { selectedArtist } = useArtistProvider();
  const {
    conversations,
    isLoading,
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

  const showSkeleton = isLoading || isFetching || !userData || !selectedArtist;

  return (
    <div className="w-full flex-grow min-h-0 flex flex-col">
      <div className="h-[1px] bg-grey-light dark:bg-dark-border w-full mt-1 mb-2 md:mt-2 md:mb-3 shrink-0" />

      {isSelectionMode ? (
        <SelectionModeHeader
          selectedCount={selectedChatIds.size}
          onCancel={clearSelection}
          onDelete={handleBulkDelete}
        />
      ) : (
        <p className="text-sm mb-1 md:mb-2 font-inter text-grey-dark dark:text-gray-400 px-2 shrink-0">
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
