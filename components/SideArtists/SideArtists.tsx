import { useState } from "react";
import SideModal from "../SideModal";
import { useUserProvider } from "@/providers/UserProvder";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { Plus, Loader } from "lucide-react";
import { useArtistPinRenderer } from "@/hooks/useArtistPinRenderer";
import CreateWorkspaceModal from "@/components/CreateWorkspaceModal";

const SideArtists = ({
  isVisible,
  toggleModal,
}: {
  isVisible: boolean;
  toggleModal: () => void;
}) => {
  const { address, isPrepared } = useUserProvider();
  const { sorted, isCreatingArtist } = useArtistProvider();
  const { renderArtistListWithPins } = useArtistPinRenderer({ sorted, menuExpanded: true });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    if (!isPrepared()) return;
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
          onClick={handleOpenModal}
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
