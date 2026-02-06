import {
  FileTreeFile,
  FileTreeFolder,
} from "@/components/ai-elements/file-tree";
import type { FileNode } from "@/lib/sandboxes/parseFileTree";

export default function FileNodeComponent({ node }: { node: FileNode }) {
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
