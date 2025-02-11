import { useRouter } from "next/navigation";
import useIsMobile from "./useIsMobile";

const useClickChat = () => {
  const { push } = useRouter();
  const isMobile = useIsMobile();

  const handleClick = (conversation: any, toggleModal: () => void) => {
    if (isMobile) toggleModal();
    if (conversation?.agentId) {
      push(`/funnels/${conversation?.platform}/${conversation.agentId}`);
      return;
    }
    push(`/${conversation.id}`);
  };

  return {
    handleClick,
  };
};

export default useClickChat;
