import Icon from "../Icon";
import UserProfileButton from "./UserProfileButton";

const UserInfo = ({
  toggleMenuExpanded,
}: {
  toggleMenuExpanded: () => void;
}) => {
  return (
    <div
      className={`w-full flex gap-3 items-center justify-end pr-2`}
    >
      <UserProfileButton />
      <button type="button" onClick={toggleMenuExpanded}>
        <Icon name="exit" />
      </button>
    </div>
  );
};

export default UserInfo;
