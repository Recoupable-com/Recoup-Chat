import type { Sandbox } from "@/lib/sandboxes/createSandbox";

interface SandboxListCardProps {
  sandbox: Sandbox;
}

const statusColors: Record<Sandbox["sandboxStatus"], string> = {
  pending: "bg-yellow-500",
  running: "bg-green-500",
  stopping: "bg-orange-500",
  stopped: "bg-gray-500",
  failed: "bg-red-500",
};

export default function SandboxListCard({ sandbox }: SandboxListCardProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border p-3">
      <div className="flex min-w-0 items-center justify-between gap-2">
        <p className="min-w-0 truncate text-sm font-medium font-mono">
          {sandbox.sandboxId}
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${statusColors[sandbox.sandboxStatus]}`}
          />
          <span className="text-xs text-muted-foreground capitalize">
            {sandbox.sandboxStatus}
          </span>
        </div>
      </div>
      <p className="mt-1 truncate text-xs text-muted-foreground">
        Created: {new Date(sandbox.createdAt).toLocaleString()}
      </p>
    </div>
  );
}
