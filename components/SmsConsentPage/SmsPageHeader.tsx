import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function SmsPageHeader() {
  return (
    <div className="bg-white border-b">
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">SMS Messaging</h1>
        </div>
      </div>
    </div>
  );
}
