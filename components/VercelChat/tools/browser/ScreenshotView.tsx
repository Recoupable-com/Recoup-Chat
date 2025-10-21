import Image from "next/image";
import { cn } from "@/lib/utils";

const STYLES = {
  border: "border-gray-200 dark:border-gray-700",
} as const;

interface ScreenshotViewProps {
  screenshotUrl: string;
  platformName?: string;
}

export function ScreenshotView({ screenshotUrl, platformName }: ScreenshotViewProps) {
  return (
    <div className={cn("rounded-lg overflow-hidden shadow-sm border", STYLES.border)}>
      <Image
        src={screenshotUrl}
        alt={`${platformName || "Browser"} screenshot`}
        width={600}
        height={450}
        className="w-full h-auto"
        unoptimized
      />
    </div>
  );
}

