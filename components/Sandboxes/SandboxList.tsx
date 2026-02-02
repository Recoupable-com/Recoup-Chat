import type { Sandbox } from "@/lib/sandboxes/createSandbox";

interface SandboxListProps {
  sandboxes: Sandbox[];
}

const statusColors: Record<Sandbox["sandboxStatus"], string> = {
  pending: "bg-yellow-500",
  running: "bg-green-500",
  stopping: "bg-orange-500",
  stopped: "bg-gray-500",
  failed: "bg-red-500",
};

export default function SandboxList({ sandboxes }: SandboxListProps) {
  if (sandboxes.length === 0) {
    return (
      <div className="w-full max-w-md text-center text-muted-foreground">
        <p>No sandboxes yet. Create one above to get started.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-2">
      <h2 className="text-lg font-medium">Sandbox History</h2>
      <div className="space-y-2">
        {sandboxes.map((sandbox) => (
          <div
            key={sandbox.sandboxId}
            className="rounded-lg border border-border p-3"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium font-mono">
                {sandbox.sandboxId}
              </p>
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${statusColors[sandbox.sandboxStatus]}`}
                />
                <span className="text-xs text-muted-foreground capitalize">
                  {sandbox.sandboxStatus}
                </span>
              </div>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Created: {new Date(sandbox.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
