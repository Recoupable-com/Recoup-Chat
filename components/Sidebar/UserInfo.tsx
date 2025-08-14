import { useUserProvider } from "@/providers/UserProvder";
import Icon from "../Icon";
import UserProfileButton from "./UserProfileButton";

const UserInfo = ({
  toggleMenuExpanded,
}: {
  toggleMenuExpanded: () => void;
}) => {
  const { email } = useUserProvider();

  return (
    <div
      className={`w-full flex gap-3 items-center ${email ? "justify-between" : "justify-end pr-2"}`}
    >
      <UserProfileButton />
      <button type="button" onClick={toggleMenuExpanded}>
        <Icon name="exit" />
      </button>
    </div>
  );
};

export default UserInfo;
