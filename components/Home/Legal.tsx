"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface LegalProps {
  className?: string;
}

const Legal = ({ className = "mt-6 mb-4" }: LegalProps) => {
  const pathname = usePathname();
  
  const isOnChatRoom = pathname?.startsWith('/chat/') && pathname !== '/chat';
  
  if (isOnChatRoom) return null;

  return (
    <div className={`text-xs text-gray-500 ${className}`.trim()}>
      <Link
        href="https://recoupable.com/privacy-policy"
        className="underline hover:text-gray-700"
        target="_blank"
        rel="noopener noreferrer"
      >
        Privacy Policy
      </Link>
      <span className="mx-2">|</span>
      <Link
        href="https://recoupable.com/terms-of-use"
        className="underline hover:text-gray-700"
        target="_blank"
        rel="noopener noreferrer"
      >
        Terms of Use
      </Link>
    </div>
  );
};

export default Legal;
