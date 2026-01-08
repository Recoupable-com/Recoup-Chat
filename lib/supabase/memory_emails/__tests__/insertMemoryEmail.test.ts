import { describe, it, expect, vi, beforeEach } from "vitest";
import { insertMemoryEmail } from "../insertMemoryEmail";

const mockInsert = vi.fn();

vi.mock("../../serverClient", () => ({
  default: {
    from: () => ({
      insert: mockInsert,
    }),
  },
}));

describe("insertMemoryEmail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("inserts a memory_email record successfully", async () => {
    mockInsert.mockResolvedValue({ error: null });

    await insertMemoryEmail({
      email_id: "email-123",
      memory: "msg-456",
      message_id: "msg-456",
    });

    expect(mockInsert).toHaveBeenCalledWith({
      email_id: "email-123",
      memory: "msg-456",
      message_id: "msg-456",
    });
  });

  it("throws error when insert fails", async () => {
    const dbError = { message: "Database error", code: "23505" };
    mockInsert.mockResolvedValue({ error: dbError });

    await expect(
      insertMemoryEmail({
        email_id: "email-123",
        memory: "msg-456",
        message_id: "msg-456",
      }),
    ).rejects.toEqual(dbError);
  });
});
