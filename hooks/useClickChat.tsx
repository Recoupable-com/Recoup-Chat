import { useRouter } from "next/navigation";
import useIsMobile from "./useIsMobile";

const useClickChat = () => {
  const { push } = useRouter();
  const isMobile = useIsMobile();

  const handleClick = (conversation: any, toggleModal: () => void) => {
    if (isMobile) toggleModal();
    push(`/chat/${conversation.id}`);
  };

  return {
    handleClick,
  };
};

export default useClickChat;
