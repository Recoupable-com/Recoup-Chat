import NavButton from "./NavButton";

const ChatNavItem = ({ onClick, email, isActive }: { onClick: () => void; email: string | undefined; isActive: boolean }) => {
  return (
    <NavButton
      icon={email ? "squarePen" : "user"}
      label={email ? "New Chat" : "Sign In"}
      isActive={isActive}
      onClick={onClick}
      aria-label={email ? "Start a new chat" : "Sign in to your account"}
    />
  );
};

export default ChatNavItem;
