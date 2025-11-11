import Icon from "../Icon";
import UserProfileButton from "./UserProfileButton";

const UserInfo = ({
  toggleMenuExpanded,
}: {
  toggleMenuExpanded: () => void;
}) => {
  return (
    <div className="flex gap-3 items-center">
      <UserProfileButton />
      <button type="button" onClick={toggleMenuExpanded}>
        <Icon name="exit" />
      </button>
    </div>
  );
};

export default UserInfo;
