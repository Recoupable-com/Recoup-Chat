"use client";

import { Response } from "@/components/response";
import { TextUIPart } from "ai";

interface TextMessagePartProps {
  part: TextUIPart;
  isAnimating?: boolean;
}

export function TextMessagePart({ part, isAnimating = false }: TextMessagePartProps) {
  return <Response isAnimating={isAnimating}>{part?.text || ""}</Response>;
}
