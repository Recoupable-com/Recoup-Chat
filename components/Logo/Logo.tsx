import Image from "next/image";

const Logo = () => {
  return (
    <div className="relative">
      <Image
        src="/Recoup_Icon_Wordmark_Black.svg"
        alt="Recoup Logo"
        width={180}
        height={48}
        priority
        style={{ width: 'auto', height: 'auto', maxWidth: '180px' }}
      />
    </div>
  );
};

export default Logo;
