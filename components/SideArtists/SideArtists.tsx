import SideModal from "../SideModal";
import { useUserProvider } from "@/providers/UserProvder";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { Plus, Loader } from "lucide-react";
import { useArtistPinRenderer } from "@/hooks/useArtistPinRenderer";
import CreateWorkspaceModal from "@/components/CreateWorkspaceModal";
import { useCreateWorkspaceModal } from "@/hooks/useCreateWorkspaceModal";

const SideArtists = ({
  isVisible,
  toggleModal,
}: {
  isVisible: boolean;
  toggleModal: () => void;
}) => {
  const { address } = useUserProvider();
  const { sorted, isCreatingArtist } = useArtistProvider();
  const { renderArtistListWithPins } = useArtistPinRenderer({ sorted, menuExpanded: true });
  const { isOpen: isModalOpen, open: openModal, close: closeModal } = useCreateWorkspaceModal();

  const handleCloseModal = () => {
    closeModal();
    toggleModal();
  };

  return (
    <>
      <SideModal
        isVisible={isVisible}
        toggleModal={toggleModal}
        containerClasses="justify-end"
        direction="right"
        className="w-[250px]"
      >
        <div className="no-scrollbar grow flex flex-col gap-1 overflow-y-auto overflow-x-hidden w-full">
          {address && renderArtistListWithPins().map((element, index) => (
            <div key={index} onClick={() => toggleModal()}>
              {element}
            </div>
          ))}
        </div>
        <button
          className="flex px-2 py-1 gap-2 text-sm items-center text-grey-dark-1 w-full hover:bg-muted"
          type="button"
          onClick={openModal}
          disabled={isCreatingArtist}
        >
          <div className="w-8 flex justify-center">
            {isCreatingArtist ? (
              <Loader className="size-5 text-grey-dark-1 animate-spin" />
            ) : (
              <Plus className="size-5 text-grey-dark-1" />
            )}
          </div>
          <span className="text-left grow">New Workspace</span>
        </button>
      </SideModal>
      
      <CreateWorkspaceModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </>
  );
};

export default SideArtists;
