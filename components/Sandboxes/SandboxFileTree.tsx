"use client";

import {
  FileTree,
  FileTreeFile,
  FileTreeFolder,
} from "@/components/ai-elements/file-tree";
import type { FileNode } from "@/lib/sandboxes/parseFileTree";

interface SandboxFileTreeProps {
  filetree: FileNode[];
  onSelect?: (path: string) => void;
}

function FileNodeComponent({ node }: { node: FileNode }) {
  if (node.type === "folder") {
    return (
      <FileTreeFolder path={node.path} name={node.name}>
        {node.children?.map((child) => (
          <FileNodeComponent key={child.path} node={child} />
        ))}
      </FileTreeFolder>
    );
  }

  return <FileTreeFile path={node.path} name={node.name} />;
}

export default function SandboxFileTree({
  filetree,
  onSelect,
}: SandboxFileTreeProps) {
  if (filetree.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-md">
      <h2 className="mb-2 text-lg font-medium">Repository Files</h2>
      <FileTree onSelect={onSelect}>
        {filetree.map((node) => (
          <FileNodeComponent key={node.path} node={node} />
        ))}
      </FileTree>
    </div>
  );
}
