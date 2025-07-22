import { Message } from "@ai-sdk/react";

export interface ReasoningDetail {
  type: "text";
  text: string;
}

export interface ReasoningPart {
  type: "reasoning";
  reasoningText: string;
  details: ReasoningDetail[];
}

export interface TextPart {
  type: "text";
  text: string;
}

export type MessagePart = ReasoningPart | TextPart;

export interface ChatMessage extends Message {
  parts?: MessagePart[];
}
