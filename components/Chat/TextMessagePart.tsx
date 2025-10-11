"use client";

import { Response } from "@/components/response";
import { TextUIPart } from "ai";

interface TextMessagePartProps {
  part: TextUIPart;
}

export function TextMessagePart({ part }: TextMessagePartProps) {
  return <Response>{part?.text || ""}</Response>;
}
