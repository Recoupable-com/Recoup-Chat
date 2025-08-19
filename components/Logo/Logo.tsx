import Image from "next/image";

const Logo = () => {
  return (
    <div className="relative">
      <Image
        src="/Recoup_Icon_Wordmark_Black.svg"
        alt="Recoup Logo"
        width={240}
        height={64}
        priority
        style={{ width: 'auto', height: 'auto', maxWidth: '240px' }}
      />
    </div>
  );
};

export default Logo;
