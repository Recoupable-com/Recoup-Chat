"use client";

import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { Chat } from "../VercelChat/chat";
import { useEffect } from "react";
import { Message } from "ai";
import Legal from "./Legal";

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
      <Legal />
    </div>
  );
};

export default HomePage;
