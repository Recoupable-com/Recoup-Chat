/**
 * Types of accounts in the system
 * - customer: End user who logs in and uses the platform
 * - artist: Artist workspace with streaming/social integrations
 * - workspace: Generic workspace for non-artist use cases
 * - organization: Parent entity for billing and team management (future)
 * - campaign: Marketing campaign workspace (future)
 */
export type AccountType = "customer" | "artist" | "workspace" | "organization" | "campaign";

