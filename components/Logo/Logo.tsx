import Image from "next/image";

const Logo = () => {
  return (
    <div className="relative">
      <Image
        src="/Recoup_Icon_Wordmark_Black.svg"
        alt="Recoup Logo"
        width={130}
        height={35}
        priority
      />
    </div>
  );
};

export default Logo;
