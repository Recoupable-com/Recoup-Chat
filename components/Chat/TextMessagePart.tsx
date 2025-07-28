"use client";

import ChatMarkdown from "./ChatMarkdown";
import { TextUIPart } from "ai";

interface TextMessagePartProps {
  part: TextUIPart;
}

export function TextMessagePart({ part }: TextMessagePartProps) {
  return <ChatMarkdown>{part?.text || ""}</ChatMarkdown>;
}
