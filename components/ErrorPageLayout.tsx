import Image from "next/image";
import { ReactNode } from "react";

interface ErrorPageLayoutProps {
  title: string;
  description: string;
  actions: ReactNode;
  showLogo?: boolean;
  className?: string;
}

export default function ErrorPageLayout({ 
  title, 
  description, 
  actions, 
  showLogo = true,
  className = "flex items-center justify-center h-full text-center px-4"
}: ErrorPageLayoutProps) {
  return (
    <div className={className}>
      <div className="w-full max-w-lg flex flex-col items-center">
        {showLogo && (
          <div className="mb-6">
            <Image
              src="/Recoup_Icon_Wordmark_Black.svg"
              alt="Recoup Logo"
              width={160}
              height={60}
              priority
            />
          </div>
        )}
        
        <h1 className="text-2xl md:text-3xl font-semibold mb-4 text-foreground">
          {title}
        </h1>
        
        <p className="text-muted-foreground max-w-md mx-auto text-base md:text-lg mb-8">
          {description}
        </p>
        
        {actions}
      </div>
    </div>
  );
} 