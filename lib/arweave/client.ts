import Arweave from "arweave";
import type { JWKInterface } from "arweave/web/lib/wallet";

let cachedClient: Arweave | null = null;
let cachedKey: JWKInterface | null = null;

function ensureBase64Polyfills() {
  const atobImpl = (data: string) => Buffer.from(data, "base64").toString("binary");
  const btoaImpl = (data: string) => Buffer.from(data, "binary").toString("base64");

  const globalObject = globalThis as typeof globalThis & {
    atob?: (data: string) => string;
    btoa?: (data: string) => string;
  };

  if (typeof globalObject.atob === "undefined") {
    globalObject.atob = atobImpl;
  }
  if (typeof globalObject.btoa === "undefined") {
    globalObject.btoa = btoaImpl;
  }
}

function getRawArweaveKey(): string {
  const rawKey = process.env.ARWEAVE_KEY;
  if (!rawKey) {
    throw new Error("ARWEAVE_KEY environment variable is not set");
  }

  const normalized = rawKey.replace(/^ARWEAVE_KEY=/, "");
  return Buffer.from(normalized, "base64").toString();
}

export function getArweaveClient(): Arweave {
  if (!cachedClient) {
    ensureBase64Polyfills();
    cachedClient = Arweave.init({
      host: "arweave.net",
      port: 443,
      protocol: "https",
    });
  }

  return cachedClient;
}

export function getArweaveKey(): JWKInterface {
  if (!cachedKey) {
    const keyJson = getRawArweaveKey();
    cachedKey = JSON.parse(keyJson) as JWKInterface;
  }

  return cachedKey;
}
