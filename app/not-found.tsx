import Link from "next/link";
import { Button } from "@/components/ui/button";
import ErrorPageLayout from "@/components/ErrorPageLayout";

export default function NotFoundPage() {
  const actions = (
    <div className="flex flex-col sm:flex-row gap-3">
      <Link href="/">
        <Button className="px-6 py-2">
          Go home
        </Button>
      </Link>
      <Link href="/chat">
        <Button variant="outline" className="px-6 py-2">
          Start new chat
        </Button>
      </Link>
    </div>
  );

  return (
    <ErrorPageLayout
      title="Page not found"
      description="Looks like this page doesn't exist. No problem - let's get you back to where you need to be."
      actions={actions}
    />
  );
} 