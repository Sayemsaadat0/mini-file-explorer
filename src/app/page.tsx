"use client";

import { useFileContext } from "@/context/FileContextProvider";
import { findNodeByPath, updateFileContent } from "@/libs/tree";
import { FileIcon } from "@/components/core/icons";
import { FolderView } from "@/components/core/MainPanel/FolderView";

const Home = () => {
  const { tree, setTree, selectedPath } = useFileContext();

  const selectedNode = selectedPath
    ? findNodeByPath(tree, selectedPath)
    : undefined;

  if (selectedNode?.type === "file") {
    return (
      <div className="flex-1 h-full w-full">
        <textarea
          className="h-full w-full resize-none bg-transparent p-4 font-mono text-sm outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
          value={selectedNode.content || ""}
          onChange={(e) => {
            setTree(
              updateFileContent({
                tree,
                id: selectedNode.id,
                content: e.target.value,
              })
            );
          }}
          placeholder="Type your content here..."
        />
      </div>
    );
  }

  // Folder or Root view
  return <FolderView folderNode={selectedNode} />;
};

export default Home;
