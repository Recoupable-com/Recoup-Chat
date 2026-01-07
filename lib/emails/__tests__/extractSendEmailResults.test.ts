import { describe, it, expect } from "vitest";
import { extractSendEmailResults } from "../extractSendEmailResults";
import { UIMessage } from "ai";

describe("extractSendEmailResults", () => {
  it("returns empty array when no messages", () => {
    const result = extractSendEmailResults([]);
    expect(result).toEqual([]);
  });

  it("returns empty array when no send_email tool parts", () => {
    const messages: UIMessage[] = [
      {
        id: "msg-1",
        role: "assistant",
        parts: [{ type: "text", text: "Hello" }],
        content: "",
        createdAt: new Date(),
      },
    ];
    const result = extractSendEmailResults(messages);
    expect(result).toEqual([]);
  });

  it("extracts email ID from send_email tool result", () => {
    const messages: UIMessage[] = [
      {
        id: "msg-1",
        role: "assistant",
        parts: [
          {
            type: "tool-send_email",
            state: "output-available",
            output: {
              success: true,
              data: { id: "email-123" },
              message: "Email sent successfully",
            },
          } as unknown as UIMessage["parts"][number],
        ],
        content: "",
        createdAt: new Date(),
      },
    ];
    const result = extractSendEmailResults(messages);
    expect(result).toEqual([{ emailId: "email-123", messageId: "msg-1" }]);
  });

  it("extracts multiple email IDs from multiple messages", () => {
    const messages: UIMessage[] = [
      {
        id: "msg-1",
        role: "assistant",
        parts: [
          {
            type: "tool-send_email",
            state: "output-available",
            output: { success: true, data: { id: "email-1" } },
          } as unknown as UIMessage["parts"][number],
        ],
        content: "",
        createdAt: new Date(),
      },
      {
        id: "msg-2",
        role: "assistant",
        parts: [
          {
            type: "tool-send_email",
            state: "output-available",
            output: { success: true, data: { id: "email-2" } },
          } as unknown as UIMessage["parts"][number],
        ],
        content: "",
        createdAt: new Date(),
      },
    ];
    const result = extractSendEmailResults(messages);
    expect(result).toEqual([
      { emailId: "email-1", messageId: "msg-1" },
      { emailId: "email-2", messageId: "msg-2" },
    ]);
  });

  it("ignores tool parts without output-available state", () => {
    const messages: UIMessage[] = [
      {
        id: "msg-1",
        role: "assistant",
        parts: [
          {
            type: "tool-send_email",
            state: "pending",
          } as unknown as UIMessage["parts"][number],
        ],
        content: "",
        createdAt: new Date(),
      },
    ];
    const result = extractSendEmailResults(messages);
    expect(result).toEqual([]);
  });

  it("ignores tool parts with missing data.id", () => {
    const messages: UIMessage[] = [
      {
        id: "msg-1",
        role: "assistant",
        parts: [
          {
            type: "tool-send_email",
            state: "output-available",
            output: { success: true, data: {} },
          } as unknown as UIMessage["parts"][number],
        ],
        content: "",
        createdAt: new Date(),
      },
    ];
    const result = extractSendEmailResults(messages);
    expect(result).toEqual([]);
  });

  it("extracts email IDs from message with mixed parts", () => {
    const messages: UIMessage[] = [
      {
        id: "msg-1",
        role: "assistant",
        parts: [
          { type: "text", text: "I'll send that email for you" },
          {
            type: "tool-send_email",
            state: "output-available",
            output: { success: true, data: { id: "email-abc" } },
          } as unknown as UIMessage["parts"][number],
          { type: "text", text: "Email sent!" },
        ],
        content: "",
        createdAt: new Date(),
      },
    ];
    const result = extractSendEmailResults(messages);
    expect(result).toEqual([{ emailId: "email-abc", messageId: "msg-1" }]);
  });
});
