import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import useClickChat from "@/hooks/useClickChat";
import { useConversationsProvider } from "@/providers/ConversationsProvider";
import { useMobileDetection } from "@/hooks/useMobileDetection";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import type { Conversation } from "@/types/Chat";
import type { ArtistAgent } from "@/lib/supabase/getArtistAgents";
import RecentChatSkeleton from "./RecentChatSkeleton";
import ChatItem from "./ChatItem";
import RenameModal from "../Modals/RenameModal";
import DeleteConfirmationModal from "../Modals/DeleteConfirmationModal";

const getChatRoomId = (chatRoom: Conversation | ArtistAgent): string => {
  return "id" in chatRoom ? chatRoom.id : chatRoom.agentId;
};

const RecentChats = ({ toggleModal }: { toggleModal: () => void }) => {
  const { conversations, isLoading, refetchConversations } =
    useConversationsProvider();
  const { handleClick } = useClickChat();
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const isMobile = useMobileDetection();
  const params = useParams();

  const [activeChatId, setActiveChatId] = useState<string | null>(
    typeof params?.roomId === "string"
      ? params.roomId
      : typeof params?.agentId === "string"
        ? params.agentId
        : null
  );

  useEffect(() => {
    const updateActiveChatId = () => {
      const urlChatId = window.location.pathname.match(/\/chat\/([^\/]+)/);

      if (urlChatId && urlChatId[1]) {
        setActiveChatId(urlChatId[1]);
      } else {
        const roomId =
          typeof params?.roomId === "string" ? params.roomId : null;
        const agentId =
          typeof params?.agentId === "string" ? params.agentId : null;
        setActiveChatId(roomId || agentId || null);
      }
    };

    updateActiveChatId();
  }, [params, conversations]);

  const [modalState, setModalState] = useState<{
    type: "rename" | "delete" | null;
    chatRoom: Conversation | ArtistAgent | null;
    chatRooms?: Array<Conversation | ArtistAgent>;
  }>({ type: null, chatRoom: null });

  const [selectedChatIds, setSelectedChatIds] = useState<Set<string>>(
    new Set()
  );
  const [lastClickedId, setLastClickedId] = useState<string | null>(null);
  const [isShiftPressed, setIsShiftPressed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        setIsShiftPressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        setIsShiftPressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useOutsideClick({
    menuRef,
    buttonRefs,
    isOpen: !!openMenuId,
    onClose: () => setOpenMenuId(null),
  });

  const openModal = (
    type: "rename" | "delete",
    chatRoom: Conversation | ArtistAgent
  ) => {
    setModalState({ type, chatRoom });
    setOpenMenuId(null);
  };

  const closeModal = () => {
    setModalState({ type: null, chatRoom: null });
    setSelectedChatIds(new Set());
  };

  const handleApiAction = async () => {
    try {
      await refetchConversations();
      setSelectedChatIds(new Set());
    } catch (error) {
      console.error(
        `Error refreshing conversations after ${modalState.type}:`,
        error
      );
    }
  };

  const handleChatSelection = (chatId: string, isShiftKey: boolean) => {
    setSelectedChatIds((prev) => {
      const newSelection = new Set(prev);

      if (isShiftKey && lastClickedId) {
        const chatIds = conversations.map(getChatRoomId);
        const lastIndex = chatIds.indexOf(lastClickedId);
        const currentIndex = chatIds.indexOf(chatId);

        if (lastIndex !== -1 && currentIndex !== -1) {
          const start = Math.min(lastIndex, currentIndex);
          const end = Math.max(lastIndex, currentIndex);

          for (let i = start; i <= end; i++) {
            newSelection.add(chatIds[i]);
          }
        }
      } else {
        if (newSelection.has(chatId)) {
          newSelection.delete(chatId);
        } else {
          newSelection.add(chatId);
        }
      }

      return newSelection;
    });

    setLastClickedId(chatId);
  };

  const handleBulkDelete = () => {
    const chatsToDelete = conversations.filter((chat) =>
      selectedChatIds.has(getChatRoomId(chat))
    );

    setModalState({
      type: "delete",
      chatRoom: null,
      chatRooms: chatsToDelete,
    });
    setOpenMenuId(null);
  };

  const isRenameModalOpen = modalState.type === "rename";
  const isDeleteModalOpen = modalState.type === "delete";

  const isSelectionMode = selectedChatIds.size > 0;

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
              onClick={() => setSelectedChatIds(new Set())}
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
              <AnimatePresence initial={false}>
                {conversations.map((chatRoom) => {
                  const roomId = getChatRoomId(chatRoom);

                  return (
                    <motion.div
                      key={roomId}
                      layout="position"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                        mass: 0.5,
                      }}
                    >
                      <ChatItem
                        chatRoom={chatRoom}
                        isMobile={isMobile}
                        isHovered={hoveredChatId === roomId}
                        isMenuOpen={openMenuId === roomId}
                        isActive={roomId === activeChatId}
                        isSelected={selectedChatIds.has(roomId)}
                        isSelectionMode={isSelectionMode}
                        isShiftPressed={isShiftPressed}
                        menuRef={openMenuId === roomId ? menuRef : null}
                        setButtonRef={(el: HTMLButtonElement | null) => {
                          buttonRefs.current[roomId] = el;
                        }}
                        onMouseEnter={() => setHoveredChatId(roomId)}
                        onMouseLeave={() => setHoveredChatId(null)}
                        onChatClick={() => handleClick(chatRoom, toggleModal)}
                        onSelect={(isShiftKey) =>
                          handleChatSelection(roomId, isShiftKey)
                        }
                        onMenuToggle={() => {
                          setOpenMenuId(openMenuId === roomId ? null : roomId);
                        }}
                        onRenameClick={() => openModal("rename", chatRoom)}
                        onDeleteClick={() => openModal("delete", chatRoom)}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
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
