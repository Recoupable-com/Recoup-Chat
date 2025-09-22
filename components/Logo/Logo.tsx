import Image from "next/image";

const Logo = () => {
  return (
    <div className="relative flex items-center pl-2">
      <Image
        src="/brand-logos/recoup-v2.png"
        alt="Recoup Logo"
        width={260}
        height={260}
        priority
        className="w-7 h-7 rounded-lg"
      />
    </div>
  );
};

export default Logo;
