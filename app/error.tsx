"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import ErrorPageLayout from "@/components/ErrorPageLayout";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Runtime error:", error);
  }, [error]);

  const actions = (
    <>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={reset}
          className="px-6 py-2"
        >
          Try again
        </Button>
        <Button 
          variant="outline"
          onClick={() => window.location.href = '/'}
          className="px-6 py-2"
        >
          Go home
        </Button>
      </div>
      
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-8 text-left max-w-full">
          <summary className="cursor-pointer text-sm text-gray-600 mb-2">
            Error details (development only)
          </summary>
          <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-w-full whitespace-pre-wrap">
            {error.message}
            {error.stack && `\n\n${error.stack}`}
          </pre>
        </details>
      )}
    </>
  );

  return (
    <ErrorPageLayout
      title="Oops, something's not working"
      description="We're having a small hiccup. No worries though - just try again and you should be good to go!"
      actions={actions}
    />
  );
} 