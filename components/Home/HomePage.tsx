"use client";

import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { Chat } from "../VercelChat/chat";
import { useEffect } from "react";
import { Message } from "ai";

const HomePage = ({
  id,
  initialMessages,
}: {
  id: string;
  initialMessages?: Message[];
}) => {
  const { setFrameReady, isFrameReady } = useMiniKit();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  return (
    <div className="flex flex-col size-full items-center">
      <Chat id={id} initialMessages={initialMessages} />
      {/* Legal links required by Google OAuth policy */}
      <div className="mt-6 mb-4 text-xs text-gray-500">
        <a href="/privacy" className="underline hover:text-gray-700">
          Privacy Policy
        </a>
        <span className="mx-2">|</span>
        <a href="/terms" className="underline hover:text-gray-700">
          Terms of Service
        </a>
      </div>
    </div>
  );
};

export default HomePage;
