import { Icons } from "./resolver";

export type IconsType = keyof typeof Icons;

interface IIcon {
  name: IconsType;
}

const Icon = ({ name }: IIcon) => {
  const IconSVG = Icons[name];

  return (
    <div className="text-black dark:text-white flex items-center justify-center">
      <IconSVG />
    </div>
  );
};

export default Icon;
