import { UIMessage } from "ai";

export type StackMessage = UIMessage & {
  questionId?: string;
};

export type Conversation = {
  title: string;
  id: string;
  account_id: string;
  memories: Array<string>;
  room_reports: Array<string>;
  updated_at: string;
};
