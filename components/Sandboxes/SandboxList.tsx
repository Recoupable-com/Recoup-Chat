import type { Sandbox } from "@/lib/sandbox/createSandbox";

interface SandboxListProps {
  sandboxes: Sandbox[];
}

export default function SandboxList({ sandboxes }: SandboxListProps) {
  if (sandboxes.length === 0) return null;

  return (
    <div className="w-full max-w-md space-y-2">
      <h2 className="text-lg font-medium">Created Sandboxes</h2>
      <div className="space-y-2">
        {sandboxes.map((sandbox) => (
          <div
            key={sandbox.sandboxId}
            className="rounded-lg border border-border p-3"
          >
            <p className="text-sm font-medium">{sandbox.sandboxId}</p>
            <p className="text-xs text-muted-foreground">
              Status: {sandbox.sandboxStatus}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
