import Image from "next/image";

const Logo = () => {
  return (
    <div className="relative flex items-center">
      <Image
        src="/Recoup_Icon_Wordmark_Black.svg"
        alt="Recoup Logo"
        width={260}
        height={70}
        priority
        style={{ width: '100%', height: 'auto', maxWidth: '260px' }}
      />
    </div>
  );
};

export default Logo;
