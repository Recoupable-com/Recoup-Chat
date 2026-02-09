import UserProfileButton from "./UserProfileButton";

const UserInfo = ({ isExpanded }: { isExpanded?: boolean }) => {
  return (
    <div className="w-full">
      <UserProfileButton isExpanded={isExpanded} />
    </div>
  );
};

export default UserInfo;
