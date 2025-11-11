import UserProfileButton from "./UserProfileButton";

const UserInfo = ({
  toggleMenuExpanded,
}: {
  toggleMenuExpanded: () => void;
}) => {
  return (
    <div className="w-full">
      <UserProfileButton />
    </div>
  );
};

export default UserInfo;
