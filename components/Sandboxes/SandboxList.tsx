import type { Sandbox } from "@/lib/sandboxes/createSandbox";
import SandboxListCard from "./SandboxListCard";

interface SandboxListProps {
  sandboxes: Sandbox[];
}

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
          <SandboxListCard key={sandbox.sandboxId} sandbox={sandbox} />
        ))}
      </div>
    </div>
  );
}
