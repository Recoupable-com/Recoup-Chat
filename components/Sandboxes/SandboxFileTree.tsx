"use client";

import { FileTree } from "@/components/ai-elements/file-tree";
import type { FileNode } from "@/lib/sandboxes/parseFileTree";
import FileNodeComponent from "./FileNodeComponent";

interface SandboxFileTreeProps {
  filetree: FileNode[];
}

export default function SandboxFileTree({
  filetree,
}: SandboxFileTreeProps) {
  if (filetree.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-md">
      <h2 className="mb-2 text-lg font-medium">Repository Files</h2>
      <FileTree>
        {filetree.map((node) => (
          <FileNodeComponent key={node.path} node={node} />
        ))}
      </FileTree>
    </div>
  );
}
