import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock external dependencies
vi.mock("@/lib/tools/getMcpTools", () => ({
  getMcpTools: vi.fn(),
}));

vi.mock("@/lib/coinbase/getOrCreatePurchaserAccount", () => ({
  getOrCreatePurchaserAccount: vi.fn(),
}));

vi.mock("@ai-sdk/mcp", () => ({
  experimental_createMCPClient: vi.fn(),
}));

vi.mock("x402-mcp", () => ({
  withPayment: vi.fn(),
}));

vi.mock("@modelcontextprotocol/sdk/client/streamableHttp.js", () => ({
  StreamableHTTPClientTransport: vi.fn(),
}));

// Import after mocks
import { setupToolsForRequest } from "../setupToolsForRequest";
import { getMcpTools } from "@/lib/tools/getMcpTools";
import { getOrCreatePurchaserAccount } from "@/lib/coinbase/getOrCreatePurchaserAccount";
import { experimental_createMCPClient as createMCPClient } from "@ai-sdk/mcp";
import { withPayment } from "x402-mcp";
import { ChatRequestBody } from "../validateChatRequest";

const mockGetMcpTools = vi.mocked(getMcpTools);
const mockGetOrCreatePurchaserAccount = vi.mocked(getOrCreatePurchaserAccount);
const mockCreateMCPClient = vi.mocked(createMCPClient);
const mockWithPayment = vi.mocked(withPayment);

describe("setupToolsForRequest", () => {
  const mockLocalTools = {
    localTool1: { description: "Local Tool 1", parameters: {} },
    localTool2: { description: "Local Tool 2", parameters: {} },
  };

  const mockMcpClientTools = {
    send_email: { description: "Send email", parameters: {} },
    web_search: { description: "Web search", parameters: {} },
  };

  const mockAccount = { address: "0x123", network: "base" };

  const mockMcpClient = {
    tools: vi.fn().mockResolvedValue(mockMcpClientTools),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mocks
    mockGetMcpTools.mockReturnValue(mockLocalTools);
    mockGetOrCreatePurchaserAccount.mockResolvedValue(mockAccount);
    mockCreateMCPClient.mockResolvedValue({ tools: vi.fn() });
    mockWithPayment.mockResolvedValue(mockMcpClient);
  });

  describe("basic functionality", () => {
    it("fetches local tools", async () => {
      const body: ChatRequestBody = {
        messages: [{ id: "1", role: "user", content: "Hello" }],
        accessToken: "test-token",
      };

      await setupToolsForRequest(body);

      expect(mockGetMcpTools).toHaveBeenCalled();
    });

    it("creates MCP client with access token", async () => {
      const body: ChatRequestBody = {
        messages: [{ id: "1", role: "user", content: "Hello" }],
        accessToken: "test-token",
      };

      await setupToolsForRequest(body);

      expect(mockCreateMCPClient).toHaveBeenCalled();
    });

    it("gets purchaser account", async () => {
      const body: ChatRequestBody = {
        messages: [{ id: "1", role: "user", content: "Hello" }],
        accessToken: "test-token",
      };

      await setupToolsForRequest(body);

      expect(mockGetOrCreatePurchaserAccount).toHaveBeenCalled();
    });

    it("wraps MCP client with payment", async () => {
      const body: ChatRequestBody = {
        messages: [{ id: "1", role: "user", content: "Hello" }],
        accessToken: "test-token",
      };

      await setupToolsForRequest(body);

      expect(mockWithPayment).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ account: mockAccount, network: "base" })
      );
    });

    it("merges local tools and MCP client tools", async () => {
      const body: ChatRequestBody = {
        messages: [{ id: "1", role: "user", content: "Hello" }],
        accessToken: "test-token",
      };

      const result = await setupToolsForRequest(body);

      // Should have both local and MCP tools
      expect(result).toHaveProperty("localTool1");
      expect(result).toHaveProperty("localTool2");
      expect(result).toHaveProperty("send_email");
      expect(result).toHaveProperty("web_search");
    });

    it("local tools take precedence over MCP tools with same name", async () => {
      mockGetMcpTools.mockReturnValue({
        send_email: { description: "Local version", parameters: {} },
      });

      const body: ChatRequestBody = {
        messages: [{ id: "1", role: "user", content: "Hello" }],
        accessToken: "test-token",
      };

      const result = await setupToolsForRequest(body);

      // Local version should win (due to spread order: ...mcpClientTools, ...localTools)
      expect(result.send_email).toEqual(
        expect.objectContaining({ description: "Local version" })
      );
    });
  });

  describe("tool filtering", () => {
    it("excludes tools specified in excludeTools array", async () => {
      const body: ChatRequestBody = {
        messages: [{ id: "1", role: "user", content: "Hello" }],
        accessToken: "test-token",
        excludeTools: ["localTool1"],
      };

      const result = await setupToolsForRequest(body);

      expect(result).not.toHaveProperty("localTool1");
      expect(result).toHaveProperty("localTool2");
    });

    it("returns all tools when excludeTools is undefined", async () => {
      const body: ChatRequestBody = {
        messages: [{ id: "1", role: "user", content: "Hello" }],
        accessToken: "test-token",
      };

      const result = await setupToolsForRequest(body);

      expect(result).toHaveProperty("localTool1");
      expect(result).toHaveProperty("localTool2");
    });
  });

  describe("parallel execution", () => {
    it("fetches account and creates MCP client in parallel", async () => {
      const executionOrder: string[] = [];

      // Track when each operation starts and completes
      mockGetOrCreatePurchaserAccount.mockImplementation(async () => {
        executionOrder.push("getOrCreatePurchaserAccount:start");
        await new Promise((resolve) => setTimeout(resolve, 10));
        executionOrder.push("getOrCreatePurchaserAccount:end");
        return mockAccount;
      });

      mockCreateMCPClient.mockImplementation(async () => {
        executionOrder.push("createMCPClient:start");
        await new Promise((resolve) => setTimeout(resolve, 10));
        executionOrder.push("createMCPClient:end");
        return { tools: vi.fn() };
      });

      const body: ChatRequestBody = {
        messages: [{ id: "1", role: "user", content: "Hello" }],
        accessToken: "test-token",
      };

      await setupToolsForRequest(body);

      // Both should start before either ends (parallel execution)
      const accountStartIndex = executionOrder.indexOf(
        "getOrCreatePurchaserAccount:start"
      );
      const mcpStartIndex = executionOrder.indexOf("createMCPClient:start");
      const accountEndIndex = executionOrder.indexOf(
        "getOrCreatePurchaserAccount:end"
      );
      const mcpEndIndex = executionOrder.indexOf("createMCPClient:end");

      // Both operations should have started
      expect(accountStartIndex).toBeGreaterThanOrEqual(0);
      expect(mcpStartIndex).toBeGreaterThanOrEqual(0);

      // Both starts should come before both ends
      expect(accountStartIndex).toBeLessThan(accountEndIndex);
      expect(mcpStartIndex).toBeLessThan(mcpEndIndex);

      // At least one start should come before the other's end (proves parallelism)
      const bothStartedBeforeAnyEnds =
        Math.max(accountStartIndex, mcpStartIndex) <
        Math.min(accountEndIndex, mcpEndIndex);
      expect(bothStartedBeforeAnyEnds).toBe(true);
    });

    it("both account fetch and MCP client creation are called", async () => {
      const body: ChatRequestBody = {
        messages: [{ id: "1", role: "user", content: "Hello" }],
        accessToken: "test-token",
      };

      await setupToolsForRequest(body);

      expect(mockGetOrCreatePurchaserAccount).toHaveBeenCalledTimes(1);
      expect(mockCreateMCPClient).toHaveBeenCalledTimes(1);
    });
  });
});
